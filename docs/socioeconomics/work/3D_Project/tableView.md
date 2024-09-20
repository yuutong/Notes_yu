1.
ui->lwDataSource  右侧文字栏

2.ui->swDataSource   左侧数据栏

3.ui->btnAddData   添加

4.ui->leName    软键盘相关

void CreateProDlg::ToEditIndex()
{
    QRect rect = ui->leIndex->rect(); // 获取 leIndex 控件的矩形区域
    QPoint pos = QPoint(rect.left(), rect.bottom() + 2); // 计算软键盘应该出现的位置
    QPoint mPoint = ui->leIndex->mapToGlobal(pos); // 将位置转换为全局坐标

    ImportNumerical *mImportNumerical = new ImportNumerical; // 创建 ImportNumerical 对象，这可能是一个用于输入数值的对话框
    int mCurIntValue = ui->leIndex->text().toInt(); // 获取当前 leIndex 控件中的整数值
    CLTuple mCurValue = CLTuple(mCurIntValue); // 将整数值转换为 CLTuple 类型
    CLTuple mValue = mImportNumerical->ConfigNumerical(mCurValue, mPoint.x(), mPoint.y()); // 调用 ConfigNumerical 函数，这可能会弹出软键盘并获取用户输入

    pro_index = mValue.I(); // 将用户输入的值赋给 pro_index 成员变量
    if(pro_index < 0) // 确保 pro_index 不小于 0
    {
        pro_index = 0;
    }
    if(pro_index > 9999) // 确保 pro_index 不大于 9999
    {
        pro_index = 9999;
    }
    ui->leIndex->setText(QString::number(pro_index)); // 将 pro_index 的值显示在 leIndex 控件中

    delete mImportNumerical; // 删除 ImportNumerical 对象
    mImportNumerical = NULL; // 将指针置空
}


