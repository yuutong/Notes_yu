* [返回](../README.md)
* [面试题目](./Interview.md)
* [车道检测](./lane_detection.md)


CRadioWidgetUniqueVector::iterator itr = std::find(m_ctrl_list_vec.begin(), m_ctrl_list_vec.end(), item_id);

if (itr != m_ctrl_list_vec.end()) {
    std::shared_ptr<CImageButton> imageButton = std::dynamic_pointer_cast<CImageButton>(*itr);
    if (imageButton) {
        // 转换成功，您现在可以使用imageButton了
    } else {
        // 转换失败，处理错误
    }
}


#include <iostream>
#include <memory>
#include <vector>
#include <algorithm>

// 假设CRadioWidgetContainer、CRadioWidget 和 CImageButton 的定义如下
class CRadioWidget {
public:
    virtual ~CRadioWidget() = default;
};

class CImageButton : public CRadioWidget {
public:
    void Create() {
        // 创建按钮的具体实现
    }
    void click() {
        std::cout << "Button clicked!" << std::endl;
    }
};

class CRadioWidgetContainer {
public:
    void PushToList(std::shared_ptr<CRadioWidget> widget) {
        widgets.push_back(widget);
    }

    std::vector<std::shared_ptr<CRadioWidget>>& GetWidgets() {
        return widgets;
    }

private:
    std::vector<std::shared_ptr<CRadioWidget>> widgets;
};

using CRadioWidgetUniqueVector = std::vector<std::unique_ptr<CRadioWidgetContainer>>;

int main() {
    CRadioWidgetUniqueVector m_ctrl_list_vec;

    // 创建CRadioWidgetContainer的unique_ptr实例
    std::unique_ptr<CRadioWidgetContainer> container(new(std::nothrow) CRadioWidgetContainer());
    if (!container) {
        std::cerr << "Failed to create CRadioWidgetContainer" << std::endl;
        return -1;
    }

    // 创建CImageButton的shared_ptr实例
    std::shared_ptr<CImageButton> btn = std::make_shared<CImageButton>();
    btn->Create();

    // 将CImageButton对象推送到CRadioWidgetContainer实例的列表中
    container->PushToList(btn);

    // 将CRadioWidgetContainer对象通过unique_ptr移动到m_ctrl_list_vec
    m_ctrl_list_vec.push_back(std::move(container));

    // 从m_ctrl_list_vec中获取指针并转换为CImageButton类型
    // 假设我们要查找的item_id实际上是btn
    std::shared_ptr<CRadioWidget> item_id = btn;

    // 遍历m_ctrl_list_vec，查找并转换为CImageButton
    for (const auto& uniqueContainer : m_ctrl_list_vec) {
        auto& widgets = uniqueContainer->GetWidgets();
        auto itr = std::find(widgets.begin(), widgets.end(), item_id);
        
        if (itr != widgets.end()) {
            // 使用dynamic_pointer_cast进行安全转换
            std::shared_ptr<CImageButton> imageButton = std::dynamic_pointer_cast<CImageButton>(*itr);
            if (imageButton) {
                imageButton->click(); // 转换成功，调用CImageButton的方法
            } else {
                std::cerr << "Error: Unable to cast to CImageButton." << std::endl;
            }
        }
    }

    return 0;
}

int main() {
    CRadioWidgetUniqueVector m_ctrl_list_vec;

    // 创建CRadioWidgetContainer的unique_ptr实例
    std::unique_ptr<CRadioWidgetContainer> container(new(std::nothrow) CRadioWidgetContainer());
    if (!container) {
        std::cerr << "Failed to create CRadioWidgetContainer" << std::endl;
        return -1;
    }

    // 创建CImageButton的shared_ptr实例
    std::shared_ptr<CImageButton> btn = std::make_shared<CImageButton>();
    btn->Create();

    // 将CImageButton对象推送到CRadioWidgetContainer实例的列表中
    container->PushToList(btn);

    // 将CRadioWidgetContainer对象通过unique_ptr移动到m_ctrl_list_vec
    m_ctrl_list_vec.push_back(std::move(container));

    // 遍历m_ctrl_list_vec，查找并转换为CImageButton类型
    for (const auto& uniqueContainer : m_ctrl_list_vec) {
        int curSelIndex = uniqueContainer->GetCurSelWidget();
        std::shared_ptr<CRadioWidget> selectedWidget = uniqueContainer->GetWidgetAt(curSelIndex);

        if (selectedWidget) {
            // 使用dynamic_pointer_cast进行安全转换
            std::shared_ptr<CImageButton> imageButton = std::dynamic_pointer_cast<CImageButton>(selectedWidget);
            if (imageButton) {
                imageButton->click(); // 转换成功，调用CImageButton的方法
            } else {
                std::cerr << "Error: Unable to cast to CImageButton." << std::endl;
            }
        } else {
            std::cerr << "Error: No widget found at the selected index." << std::endl;
        }
    }

    return 0;
}