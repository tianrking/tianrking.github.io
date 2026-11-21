import {existsSync} from 'node:fs';

const archiveRoot = new URL('../static/', import.meta.url);

function isHeading(node, title) {
  return node.type === 'heading' && node.depth === 2 && node.children[0]?.value === title;
}

// Replace only the illustrations in the original-layout section of WeChat exports.
export function preferArchivePreviews() {
  return (tree, file) => {
    const section = tree.children.findIndex((node) => isHeading(node, '原始排版图'));
    if (section === -1) return;

    const transcript = tree.children.find((node) => isHeading(node, '正文（本地 OCR 转写）'));
    if (!transcript) return;

    // Short transcripts can put the first illustration above the fold.
    const transcriptLength = tree.children[section].position.start.offset - transcript.position.end.offset;
    const deferred = new Set();
    file.data.deferredArchiveImages = deferred;
    const shouldDefer = transcriptLength >= 1500;

    function rewrite(node) {
      if (node.type === 'link') return node;
      if (node.type === 'image' && node.url.startsWith('/img/wechat/')) {
        if (shouldDefer) deferred.add(node);
        const preview = node.url.replace(/\.webp$/, '.reading.webp');
        if (preview === node.url || !existsSync(new URL(encodeURI(preview.slice(1)), archiveRoot))) return node;
        const original = node.url;
        node.url = preview;
        return {
          type: 'link',
          url: `pathname://${original}`,
          title: '開啟原始圖檔',
          children: [node],
        };
      }
      // Split images can be Markdown continuations of the explanatory blockquote.
      if (node.children) node.children = node.children.map(rewrite);
      return node;
    }

    tree.children = [
      ...tree.children.slice(0, section + 1),
      ...tree.children.slice(section + 1).map(rewrite),
    ];
  };
}

// Docusaurus has resolved assets and added intrinsic width/height at this point.
export function deferArchiveImages() {
  return (_tree, file) => {
    for (const node of file.data.deferredArchiveImages ?? []) {
      if (node.type !== 'mdxJsxTextElement' || node.name !== 'img') continue;
      node.attributes.push(
        {type: 'mdxJsxAttribute', name: 'loading', value: 'lazy'},
        {type: 'mdxJsxAttribute', name: 'decoding', value: 'async'},
      );
    }
    delete file.data.deferredArchiveImages;
  };
}
