   const fs = require('fs');
   const path = require('path');

   const rootDir = './docs'; // 根目录
   const sidebarFile = path.join(rootDir, '_sidebar.md'); // 侧边栏文件路径

   // 递归读取目录结构
   function generateSidebar(dir, prefix = '') {
     let sidebarContent = '';
     const files = fs.readdirSync(dir);

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

     return sidebarContent;
   }

   // 写入 _sidebar.md 文件
   const sidebarContent = generateSidebar(rootDir);
   fs.writeFileSync(sidebarFile, sidebarContent);

   console.log('Sidebar generated successfully!');