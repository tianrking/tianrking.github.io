#include <cmath>
#include <iomanip>
#include <iostream>
#include <string_view>

int main(int argc, char **argv) {
    if (argc != 2) {
        std::cerr << "Usage: camera-lab eis|water|bandwidth\n";
        return 2;
    }

    const std::string_view experiment = argv[1];
    std::cout << std::fixed << std::setprecision(6);

    if (experiment == "eis") {
        constexpr double focal_length_px = 800;
        const double radians_per_degree = std::acos(-1) / 180.0;
        std::cout << "offset_ms,rotation_deg_s,displacement_px\n";
        for (const int degrees_per_second : {90, 180, 300}) {
            for (int quarter_ms = 0; quarter_ms <= 8; ++quarter_ms) {
                const double offset_ms = quarter_ms / 4.0;
                const double radians = degrees_per_second * radians_per_degree * offset_ms / 1000.0;
                const double displacement_px = focal_length_px * std::tan(radians);
                std::cout << offset_ms << ',' << degrees_per_second << ',' << displacement_px << '\n';
            }
        }
    } else if (experiment == "water") {
        constexpr int camera_depth_m = 5;
        constexpr double direct_at_zero = 0.63;
        constexpr double direct_attenuation_per_m = 0.25;
        constexpr double asymptotic_backscatter = 0.25;
        constexpr double backscatter_coefficient_per_m = 0.20;
        std::cout << "camera_depth_m,subject_range_m,red_direct,red_backscatter,red_combined\n";
        for (const double range_m : {0.5, 2.0, 5.0}) {
            const double direct = direct_at_zero * std::exp(-direct_attenuation_per_m * range_m);
            const double scatter = asymptotic_backscatter *
                (1.0 - std::exp(-backscatter_coefficient_per_m * range_m));
            std::cout << camera_depth_m << ',' << range_m << ',' << direct << ','
                      << scatter << ',' << (direct + scatter) << '\n';
        }
    } else if (experiment == "bandwidth") {
        constexpr int frames_per_second = 30;
        std::cout << "width,height,fps,frame_bytes,read_and_write_mb_per_second\n";
        for (const int width : {1920, 2560, 3840}) {
            const int height = width * 9 / 16;
            const int frame_bytes = width * height * 3 / 2;
            const double mb_per_second = 2.0 * frame_bytes * frames_per_second / 1'000'000.0;
            std::cout << width << ',' << height << ',' << frames_per_second << ','
                      << frame_bytes << ',' << mb_per_second << '\n';
        }
    } else {
        std::cerr << "Unknown experiment\n";
        return 2;
    }
}
