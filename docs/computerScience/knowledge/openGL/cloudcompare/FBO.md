

`ccFrameBufferObject` 是一个封装了 OpenGL 帧缓冲对象（FBO）操作的类。<br>
帧缓冲对象用于在渲染到纹理上而不是直接渲染到屏幕时存储渲染结果。<br>
这在后处理效果、离屏渲染等场景中非常有用。



#### 类成员变量

`m_isValid`：标志帧缓冲对象是否有效。<br>
`m_width` 和 `m_height`：帧缓冲对象的宽度和高度。<br>
`m_depthTexture` 和 `m_colorTexture`：深度纹理和颜色纹理的 ID。<br>
`m_ownDepthTexture` 和 `m_ownColorTexture`：标志是否拥有这些纹理的管理权。<br>
`m_fboId`：帧缓冲对象的 ID。<br>
`m_glFunc` 和 `m_glExtFunc`：OpenGL 函数的封装，用于调用 OpenGL 函数。<br>

#### 构造函数

```cpp
ccFrameBufferObject::ccFrameBufferObject()
	: m_isValid(false)
	, m_width(0)
	, m_height(0)
	, m_depthTexture(0)
	, m_ownDepthTexture(false)
	, m_colorTexture(0)
	, m_ownColorTexture(false)
	, m_fboId(0)
{}
```

- 初始化所有成员变量。设置帧缓冲对象无效，纹理 ID 和帧缓冲对象 ID 为 0，宽度和高度为 0。

#### 析构函数

```cpp
ccFrameBufferObject::~ccFrameBufferObject()
{
	reset();
}
```

- 调用 `reset()` 函数以释放资源。

#### `reset()` 方法

```cpp
void ccFrameBufferObject::reset()
{
	if (!m_isValid)
	{
		return;
	}

	deleteDepthTexture();
	deleteColorTexture();

	if (m_fboId != 0)
	{
		m_glExtFunc.glDeleteFramebuffers(1, &m_fboId);
		m_fboId = 0;
	}

	m_width = m_height = 0;
}
```

如果帧缓冲对象有效，删除深度纹理和颜色纹理。<br>
删除帧缓冲对象（如果存在）。<br>
重置宽度和高度。

#### `init()` 方法

```cpp
bool ccFrameBufferObject::init(unsigned w, unsigned h)
{
	if (!m_isValid)
	{
		if (!m_glFunc.initializeOpenGLFunctions())
		{
			return false;
		}

		if (!m_glExtFunc.initializeOpenGLFunctions())
		{
			return false;
		}
	}
	else
	{
		reset();
	}

	m_width = w;
	m_height = h;

	m_glExtFunc.glGenFramebuffers(1, &m_fboId);

	m_isValid = true;

	return m_fboId != 0;
}
```

如果帧缓冲对象无效，初始化 OpenGL 函数。<br>
重置之前的帧缓冲对象（如果存在）。<br>
创建一个新的帧缓冲对象，并更新有效标志。

#### `start()` 和 `stop()` 方法

```cpp
bool ccFrameBufferObject::start()
{
	if (m_isValid && m_fboId != 0)
	{
		m_glExtFunc.glBindFramebuffer(GL_FRAMEBUFFER_EXT, m_fboId);
		return true;
	}
	else
	{
		return false;
	}
}

void ccFrameBufferObject::stop()
{
	if (m_isValid && m_fboId != 0)
	{
		m_glExtFunc.glBindFramebuffer(GL_FRAMEBUFFER_EXT, 0);
	}
}
```

`start()`：绑定帧缓冲对象，使其成为当前的渲染目标。
`stop()`：解绑当前帧缓冲对象（渲染回默认帧缓冲）。

#### `deleteColorTexture()` 和 `deleteDepthTexture()` 方法

```cpp
void ccFrameBufferObject::deleteColorTexture()
{
	if (m_isValid && m_ownColorTexture && m_glFunc.glIsTexture(m_colorTexture))
	{
		m_glFunc.glDeleteTextures(1, &m_colorTexture);
	}
	m_colorTexture = 0;
	m_ownColorTexture = false;
}

void ccFrameBufferObject::deleteDepthTexture()
{
	if (m_isValid && m_ownDepthTexture && m_glFunc.glIsTexture(m_depthTexture))
	{
		m_glFunc.glDeleteTextures(1, &m_depthTexture);
	}
	m_depthTexture = 0;
	m_ownDepthTexture = false;
}
```

删除颜色和深度纹理（如果存在且拥有这些纹理的管理权）。

#### `initColor()` 和 `initDepth()` 方法

```cpp
bool ccFrameBufferObject::initColor(GLint internalformat/*=GL_RGBA*/,
									GLenum format/*=GL_RGBA*/,
									GLenum type/*=GL_UNSIGNED_BYTE*/,
									GLint minMagFilter/*=GL_NEAREST*/,
									GLenum target/*=GL_TEXTURE_2D*/)
{
	if (!m_isValid || m_fboId == 0)
	{
		assert(false);
		return false;
	}

	m_glFunc.glPushAttrib(GL_ENABLE_BIT);
	m_glFunc.glEnable(GL_TEXTURE_2D);

	GLuint texID = 0;
	m_glFunc.glGenTextures(1, &texID);
	m_glFunc.glBindTexture(target, texID);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_MAG_FILTER, minMagFilter);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_MIN_FILTER, minMagFilter);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
	m_glFunc.glTexImage2D(target, 0, internalformat, m_width, m_height, 0, format, type, nullptr);
	m_glFunc.glBindTexture(target, 0);

	m_glFunc.glPopAttrib();

	if (attachColor(texID, true, target))
	{
		return true;
	}
	else
	{
		m_glFunc.glDeleteTextures(1, &texID);
		return false;
	}
}

bool ccFrameBufferObject::initDepth(GLint wrapParam/*=GL_CLAMP_TO_BORDER*/,
									GLenum internalFormat/*=GL_DEPTH_COMPONENT32*/,
									GLint minMagFilter/*=GL_NEAREST*/,
									GLenum target/*=GL_TEXTURE_2D*/)
{
	if (!m_isValid || m_fboId == 0)
	{
		assert(false);
		return false;
	}

	if (!start())
	{
		return false;
	}

	m_glFunc.glPushAttrib(GL_ENABLE_BIT);
	m_glFunc.glEnable(GL_TEXTURE_2D);

	GLuint texID = 0;
	m_glFunc.glGenTextures(1, &texID);
	m_glFunc.glBindTexture(target, texID);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_WRAP_S, wrapParam);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_WRAP_T, wrapParam);
	m_glFunc.glTexParameteri(target, GL_DEPTH_TEXTURE_MODE, GL_LUMINANCE);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_COMPARE_MODE, GL_NONE);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_MIN_FILTER, minMagFilter);
	m_glFunc.glTexParameteri(target, GL_TEXTURE_MAG_FILTER, minMagFilter);
	m_glFunc.glTexImage2D   (target, 0, internalFormat, m_width, m_height, 0, GL_DEPTH_COMPONENT, GL_UNSIGNED_BYTE, nullptr);
	m_glFunc.glBindTexture  (target, 0);

	m_glFunc.glPopAttrib();

	if (attachDepth(texID, true, target))
	{
		return true;
	}
	else
	{
		m_glFunc.glDeleteTextures(1, &texID);
		return false;
	}
}
```

`initColor()`：初始化颜色纹理，并将其附加到帧缓冲对象。<br>
`initDepth()`：初始化深度纹理，并将其附加到帧缓冲对象。

#### `attachColor()` 和 `attachDepth()` 方法

```cpp
bool ccFrameBufferObject::attachColor(GLuint texID,
										bool ownTexture/*=false*/,
										GLenum target/*=GL_TEXTURE_2D*/)
{
	if (!m_isValid || m_fboId == 0)
	{
		assert(false);
		return false;
	}

	if (!m_glFunc.glIsTexture(texID))
	{
		assert(false);
	}

	if (!start())
	{
		return false;
	}

	m_glExtFunc.glFramebufferTexture2D(GL_FRAMEBUFFER_EXT, GL_COLOR_ATTACHMENT0_EXT, target, texID, 0);
	GLenum status = m_glExtFunc.glCheckFramebufferStatus(GL_FRAMEBUFFER_EXT);

	stop();

	bool success = true;
	switch (status)
	{
	case GL_FRAMEBUFFER_COMPLETE_EXT:
		deleteColorTexture();
		m_colorTexture = texID;
		m_ownColorTexture = ownTexture;
		break;
	
	default:
		qDebug("[%s line %d] OpenGL Error: %d", __FILE__, __LINE__, status);
		success = false;
		break;
	}

	return success;
}


bool ccFrameBufferObject::attachDepth(GLuint texID,
										bool ownTexture/*=false*/,
										GLenum target/*=GL_TEXTURE_2D*/)
{
	if (!m_isValid || m_fboId == 0)
	{
		assert(false);
		return false;
	}

	if (!m_glFunc.glIsTexture(texID))
	{
		assert(false);
	}

	if (!start())
	{
		return false;
	}

	m_glExtFunc.glFramebufferTexture2D(GL_FRAMEBUFFER_EXT, GL_DEPTH_ATTACHMENT_EXT, target, texID, 0);
	GLenum status = m_glExtFunc.glCheckFramebufferStatus(GL_FRAMEBUFFER_EXT);

	stop();

	bool success = true;
	switch (status)
	{
	case GL_FRAMEBUFFER_COMPLETE_EXT:
		deleteDepthTexture();
		m_depthTexture = texID;
		m_ownDepthTexture = ownTexture;
		break;
	
	default:
		qDebug("[%s line %d] OpenGL Error: %d", __FILE__, __LINE__, status);
		success = false;
		break;
	}

	return success;
}
```

*检查有效性*：确保 `ccFrameBufferObject` 对象有效且 `m_fboId` 不为 0。<br>
*检查纹理*：验证 `texID` 是否是有效的纹理对象。<br>
*绑定 FBO*：调用 `start()` 方法将帧缓冲对象绑定为当前帧缓冲。<br>
*附加深度纹理*：使用 `glFramebufferTexture2D` 将深度纹理附加到 FBO 的深度附件点。<br>
*检查状态*：调用 `glCheckFramebufferStatus` 确认 FBO 状态是否完整。<br>
*解绑 FBO*：调用 `stop()` 方法解绑帧缓冲对象。<br>
*成功标志*：如果 FBO 状态完整，则删除旧的深度纹理（如果存在），并保存新的深度纹理及其管理权；否则记录错误信息。<br>


#### 帧缓冲区 (FBO) 详解

帧缓冲对象（FBO）是 OpenGL 的一个重要概念，用于在渲染到纹理或其他离屏目标时存储渲染结果。<br>
它提供了一种灵活的方式来实现图像处理、后期处理和其他图形效果。

##### 1. 创建和初始化 FBO

创建 FBO 的过程包括生成 FBO 对象并配置其附件（如颜色附件、深度附件等）。

```cpp
m_glExtFunc.glGenFramebuffers(1, &m_fboId);
```

- `glGenFramebuffers`：生成一个新的 FBO 并分配 ID。

##### 2. 绑定 FBO

在渲染之前需要将 FBO 绑定到当前上下文中，使其成为当前的渲染目标。

```cpp
m_glExtFunc.glBindFramebuffer(GL_FRAMEBUFFER_EXT, m_fboId);
```

- `glBindFramebuffer`：绑定 FBO 对象为当前的帧缓冲。

##### 3. 附加纹理

将纹理附加到 FBO 上，以便渲染结果可以被保存到纹理中。

- *颜色纹理附加*

```cpp
m_glExtFunc.glFramebufferTexture2D(GL_FRAMEBUFFER_EXT, GL_COLOR_ATTACHMENT0_EXT, target, texID, 0);
```

- *深度纹理附加*

```cpp
m_glExtFunc.glFramebufferTexture2D(GL_FRAMEBUFFER_EXT, GL_DEPTH_ATTACHMENT_EXT, target, texID, 0);
```

- `glFramebufferTexture2D`：将纹理附加到指定的附件点（如颜色附件或深度附件）。

##### 4. 检查 FBO 状态

在开始渲染之前，需要检查 FBO 的状态，以确保其配置正确。

```cpp
GLenum status = m_glExtFunc.glCheckFramebufferStatus(GL_FRAMEBUFFER_EXT);
```

`glCheckFramebufferStatus`：检查 FBO 的完整性状态，确保其可以用于渲染。

##### 5. **解绑 FBO**

完成渲染后，可以将 FBO 解绑，恢复到默认的帧缓冲对象（通常是窗口帧缓冲）。

```cpp
m_glExtFunc.glBindFramebuffer(GL_FRAMEBUFFER_EXT, 0);
```

`glBindFramebuffer`：将帧缓冲绑定到 0，表示解除绑定。

##### 总结

*`ccFrameBufferObject` 类* 封装了对帧缓冲对象的管理，包括创建、初始化、绑定、纹理附加、状态检查和资源释放等操作。<br>
*帧缓冲对象（FBO）* 是用于离屏渲染的关键工具，使得渲染结果可以被存储到纹理中以用于后续处理或显示。

这些操作帮助开发人员实现复杂的渲染效果，例如后期处理、阴影映射和多重渲染目标（MRT）等。