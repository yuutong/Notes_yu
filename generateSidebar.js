const fs = require('fs');
const path = require('path');

const rootDir = './docs'; // 根目录

// 递归读取目录结构
function generateSidebar(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  let sidebarContent = '';

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      sidebarContent += `* [${file}](${prefix}/${file}/)\n`;
      sidebarContent += generateSidebar(filePath, `${prefix}/${file}`);
    } else if (file !== '_sidebar.md' && file !== 'README.md') {
      const fileName = path.basename(file, path.extname(file));
      sidebarContent += `  * [${fileName}](${prefix}/${file})\n`;
    }
  });

  // 写入当前目录的 _sidebar.md 文件
  fs.writeFileSync(path.join(dir, '_sidebar.md'), sidebarContent);
  return sidebarContent;
}

// 生成所有目录的 _sidebar.md 文件
generateSidebar(rootDir);

console.log('Sidebars generated successfully!');