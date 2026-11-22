#define _POSIX_C_SOURCE 200809L
#include <rknn_api.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

enum { samples = 60, warmup = 5, max_outputs = 16 };

static double ns(void) {
    struct timespec now;
    clock_gettime(CLOCK_MONOTONIC, &now);
    return (double)now.tv_sec * 1e9 + now.tv_nsec;
}

static int ascending(const void *a, const void *b) {
    const double l = *(const double *)a, r = *(const double *)b;
    return (l > r) - (l < r);
}

static int load_ppm(const char *path, int8_t *out, unsigned w, unsigned h) {
    FILE *file = fopen(path, "rb");
    if (!file) return -1;
    char magic[3];
    unsigned src_w = 0, src_h = 0, max = 0;
    if (fscanf(file, "%2s%u%u%u", magic, &src_w, &src_h, &max) != 4 || strcmp(magic, "P6") ||
            !src_w || !src_h || src_w > 4096 || src_h > 4096 || max != 255 || fgetc(file) == EOF) {
        fclose(file);
        return -1;
    }
    size_t bytes = (size_t)src_w * src_h * 3;
    uint8_t *pixels = malloc(bytes);
    if (!pixels || fread(pixels, 1, bytes, file) != bytes) {
        fclose(file);
        free(pixels);
        return -1;
    }
    fclose(file);
    memset(out, 0x80, (size_t)w * h * 3);
    const float sx = (float)w / src_w, sy = (float)h / src_h;
    const float scale = sx < sy ? sx : sy;
    const unsigned vw = (unsigned)(src_w * scale + 0.5f);
    const unsigned vh = (unsigned)(src_h * scale + 0.5f);
    const unsigned pad_x = (w - vw) / 2, pad_y = (h - vh) / 2;
    for (unsigned y = 0; y < vh; ++y) {
        for (unsigned x = 0; x < vw; ++x) {
            size_t dst = ((size_t)(y + pad_y) * w + x + pad_x) * 3;
            size_t src = ((size_t)(y * src_h / vh) * src_w + x * src_w / vw) * 3;
            for (unsigned c = 0; c < 3; ++c) out[dst+c] = (int8_t)((int)pixels[src+c] - 128);
        }
    }
    free(pixels);
    return 0;
}

static uint64_t hash_outputs(const rknn_output *outputs, unsigned count) {
    uint64_t hash = 14695981039346656037ULL;
    for (unsigned tensor = 0; tensor < count; ++tensor) {
        const uint8_t *bytes = outputs[tensor].buf;
        for (unsigned i = 0; i < outputs[tensor].size; ++i) {
            hash = (hash ^ bytes[i]) * 1099511628211ULL;
        }
    }
    return hash;
}

static int run(const char *model, const char *first, const char *second, int bind, uint64_t *hashes) {
    rknn_context ctx = 0;
    rknn_tensor_mem *mem = NULL;
    int8_t *pixels[2] = {NULL, NULL};
    int rc = rknn_init(&ctx, (void *)model, 0, 0, NULL);
    if (rc) return rc;
    rknn_input_output_num io = {0};
    rknn_tensor_attr attr = {0};
    rc = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io, sizeof(io));
    if (rc || io.n_input != 1 || !io.n_output || io.n_output > max_outputs) { rc = -100; goto done; }
    rc = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &attr, sizeof(attr));
    if (rc || attr.fmt != RKNN_TENSOR_NHWC || attr.type != RKNN_TENSOR_INT8 ||
            attr.n_dims != 4 || attr.dims[0] != 1 || attr.dims[3] != 3 || attr.zp != -128 ||
            attr.scale < 0.0039215f || attr.scale > 0.0039217f || attr.size != attr.size_with_stride) {
        rc = -101;
        goto done;
    }
    pixels[0] = malloc(attr.size);
    pixels[1] = malloc(attr.size);
    if (!pixels[0] || !pixels[1] || load_ppm(first, pixels[0], attr.dims[2], attr.dims[1]) ||
            load_ppm(second, pixels[1], attr.dims[2], attr.dims[1])) { rc = -102; goto done; }
    if (bind) {
        mem = rknn_create_mem(ctx, attr.size_with_stride);
        if (!mem || !mem->virt_addr) { rc = -103; goto done; }
        attr.pass_through = 1;
        rc = rknn_set_io_mem(ctx, mem, &attr);
        if (rc) { fprintf(stderr, "rknn_set_io_mem=%d\n", rc); goto done; }
    }
    double submit[samples], full[samples];
    for (unsigned frame = 0; frame < samples + warmup; ++frame) {
        unsigned index = frame & 1U;
        double start = ns();
        if (bind) {
            memcpy(mem->virt_addr, pixels[index], attr.size);
            rc = rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_TO_DEVICE);
        } else {
            rknn_input input = {.index=0, .buf=pixels[index], .size=attr.size, .pass_through=1,
                                .type=attr.type, .fmt=attr.fmt};
            rc = rknn_inputs_set(ctx, 1, &input);
        }
        if (rc) { fprintf(stderr, "submit=%d\n", rc); goto done; }
        double input_done = ns();
        rc = rknn_run(ctx, NULL);
        if (rc) { fprintf(stderr, "run=%d\n", rc); goto done; }
        rknn_output out[max_outputs] = {0};
        for (unsigned i = 0; i < io.n_output; ++i) { out[i].index = i; out[i].want_float = 1; }
        rc = rknn_outputs_get(ctx, io.n_output, out, NULL);
        if (rc) { fprintf(stderr, "outputs_get=%d\n", rc); goto done; }
        double end = ns();
        if (frame < 2) hashes[frame] = hash_outputs(out, io.n_output);
        rknn_outputs_release(ctx, io.n_output, out);
        if (frame >= warmup) {
            submit[frame-warmup] = (input_done-start) / 1e6;
            full[frame-warmup] = (end-start) / 1e6;
        }
    }
    qsort(submit, samples, sizeof(*submit), ascending);
    qsort(full, samples, sizeof(*full), ascending);
    printf("%s 60 frames input p50=%.3f p95=%.3f ms total p50=%.3f p95=%.3f ms\n",
           bind ? "bound input + memcpy and sync" : "native pass-through", submit[29], submit[56], full[29], full[56]);
done:
    if (mem) rknn_destroy_mem(ctx, mem);
    rknn_destroy(ctx);
    free(pixels[0]);
    free(pixels[1]);
    return rc;
}

int main(int argc, char **argv) {
    if (argc != 4) return 2;
    uint64_t baseline[2] = {0}, bound[2] = {0};
    int rc = run(argv[1], argv[2], argv[3], 0, baseline);
    if (rc) { fprintf(stderr, "baseline failed: %d\n", rc); return 1; }
    rc = run(argv[1], argv[2], argv[3], 1, bound);
    if (rc) { fprintf(stderr, "bound input failed: %d\n", rc); return 1; }
    const int match = baseline[0] != baseline[1] && baseline[0] == bound[0] && baseline[1] == bound[1];
    printf("Exact output match for two distinct alternating images: %s\n", match ? "yes" : "no");
    return match ? 0 : 1;
}
