## 添加任务

gen_task_index   任务索引

![添加任务](image-11.png)


## 任务ID

QString task_id;  mTaskId

```cpp

CLTaskClassDlg::CLTaskClassDlg(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::CLTaskClassDlg)
{
    ui->setupUi(this);

    QUuid id = QUuid::createUuid();
    task_id = id.toString();

    //任务自动工作模式(0--软触发；1--硬触发；2--任务跟随)
    mTaskMode = 0;
}
```


![任务ID](image-12.png)

