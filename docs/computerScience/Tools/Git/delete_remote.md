
### 提交删除操作
git commit -m "Remove unwanted files except for .ui, .cpp, .h, .pro, and .gitignore"

### 使用 find 命令逐个删除
git ls-files | grep -vE '\.ui$|\.cpp$|\.h$|\.pro$|\.gitignore$' | while read -r file; do     git rm --cached "$file";  done

### 列出所有需要删除的文件
 cat files_to_remove.txt | xargs git rm --cached

 git ls-files | grep -vE '\.ui$|\.cpp$|\.h$|\.pro$|\.gitignore$' > files_to_remove.txt

### 列出库上的所有文件
git ls-files

### 常看当前分支的本地修改

git status
