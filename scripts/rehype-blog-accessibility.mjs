function taskText(node) {
  if (node.tagName === 'ul' || node.tagName === 'ol') return '';
  if (node.type === 'text') return node.value;
  return node.children?.map(taskText).join('') ?? '';
}

function improveBlogMarkup(node) {
  if (node.tagName === 'span' && node.properties.className?.includes('katex-display')) {
    node.properties.tabIndex = 0;
  }
  if (node.tagName === 'li' && node.properties.className?.includes('task-list-item')) {
    // GFM emits disabled checkboxes. Give each one the same name as its visible text.
    const children = node.children.find((child) => child.tagName === 'p')?.children ?? node.children;
    const input = children.find((child) => child.tagName === 'input' && child.properties.type === 'checkbox');
    const label = children.map(taskText).join('').replace(/\s+/g, ' ').trim();
    if (input?.properties.disabled && label) input.properties.ariaLabel = label;
  }
  node.children?.forEach(improveBlogMarkup);
}

export default function rehypeBlogAccessibility() {
  return improveBlogMarkup;
}
