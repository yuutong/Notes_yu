# 一个典型的3D渲染过程：
//2.画整个窗体，包括前景（图片），背景（窗体颜色）和中间层的3D视图
void ccGLWindow::paintGL()
{
	//OpenGL窗口的绘制函数。当窗口需要刷新时，例如窗口大小改变或者显示内容更新时，这个函数就会被调用
#ifdef CC_GL_WINDOW_USE_QWINDOW
	if (!isExposed())
	{
		return;
	}
	if (!m_initialized && !initialize())
	{
		return;
	}
	assert(m_context);
	makeCurrent();
#endif
	//获取OpenGL函数对象,这个对象包含了所有的OpenGL函数，是OpenGL在Qt中的封装
	ccQOpenGLFunctions* glFunc = functions();
	assert(glFunc);

#ifdef CC_GL_WINDOW_USE_QWINDOW
	//视口大小通常和窗口大小相同，但也可以设置为窗口的一部分，以在窗口的某个区域绘制图像
	glFunc->glViewport(m_glViewport.x(), m_glViewport.y(), m_glViewport.width(), m_glViewport.height());
#endif

	qint64 startTime_ms = m_currentLODState.inProgress ? m_timer.elapsed() : 0;


	//初始化一个名为CC_DRAW_CONTEXT的上下文对象，并向其填充一些必要的信息。这个上下文对象会在后续的绘制过程中被使用
	CC_DRAW_CONTEXT CONTEXT;
	getContext(CONTEXT);        //getcontext删掉后无法显示点云图像



	//初始化一个名为RenderingParams的渲染参数对象。这个对象包含了一些控制渲染过程的参数
	RenderingParams renderingParams;
	//renderingParams.drawBackground = false;
	//renderingParams.draw3DPass = false;    //通行证？  中间层
	//renderingParams.drawForeground = true;
	


	//进行渲染循环。在这个循环中，会根据RenderingParams的设置，依次进行背景绘制，3D内容绘制，以及前景绘制
	for (renderingParams.passIndex = 0; renderingParams.passIndex < renderingParams.passCount; ++renderingParams.passIndex)
	{
		fullRenderingPass(CONTEXT, renderingParams);   //这个语句渲染整个窗体，包括前景（图片），背景（窗体颜色）和中间层的3D视图
	}


}


//3. 完全渲染过程
void ccGLWindow::fullRenderingPass(CC_DRAW_CONTEXT& CONTEXT, RenderingParams& renderingParams)
{
	ccQOpenGLFunctions* glFunc = functions();   // 获取OpenGL函数对象
	assert(glFunc);

	//备份当前的视口大小，因为在渲染过程中可能会改变视口大小，渲染结束后需要恢复
	QRect originViewport = m_glViewport;
	bool modifiedViewport = false;
	//	ccFrameBufferObject* currentFBO = renderingParams.useFBO ? m_fbo : nullptr;     //采用FBO

		/******************/
		//*** BACKGROUND 背景
		/******************/
	if (renderingParams.drawBackground)
	{
		/*if (m_showDebugTraces)
		{
			diagStrings << "draw background";
		}*/

		//shall we clear the background (depth and/or color)  
		//要清除背景（深度和/或颜色）吗
		if (m_currentLODState.level == 0)
		{
			if (m_stereoModeEnabled && m_stereoParams.isAnaglyph())
			{
				//we don't want to clear the color layer between two anaglyph rendering steps!  不要清除两个浮雕渲染步骤之间的颜色层！
				renderingParams.clearColorLayer = (renderingParams.passIndex == 0);
			}
		}
		else
		{
			renderingParams.clearDepthLayer = false;
			renderingParams.clearColorLayer = false;
		}
		//设置清除颜色，然后清除颜色缓冲区，来设置新的背景颜色
		drawBackground(CONTEXT, renderingParams);   //背景渲染，删掉这个语句，背景变为默认的黑色
	}

	/*********************/
	/*** MAIN 3D LAYER ***/   //主要的3D图像层
	/*********************/

	//这个if语句删掉后图像无法显示
	if (renderingParams.draw3DPass)
	{
		/*if (m_showDebugTraces)
		{
			diagStrings << "draw 3D";
		}*/
		if (m_stereoModeEnabled && m_stereoParams.isAnaglyph())
		{
			//change color filter    更改颜色过滤器
			static GLboolean RED[3] = { GL_TRUE, GL_FALSE, GL_FALSE };   //红 
			static GLboolean BLUE[3] = { GL_FALSE, GL_FALSE, GL_TRUE };  //蓝
			static GLboolean CYAN[3] = { GL_FALSE, GL_TRUE, GL_TRUE };   //青
			const GLboolean* RGB = nullptr;
			switch (m_stereoParams.glassType)
			{
			case StereoParams::RED_BLUE:
				RGB = (renderingParams.passIndex == 0 ? RED : BLUE);
				break;
			case StereoParams::BLUE_RED:
				RGB = (renderingParams.passIndex == 0 ? BLUE : RED);
				break;
			case StereoParams::RED_CYAN:
				RGB = (renderingParams.passIndex == 0 ? RED : CYAN);
				break;
			case StereoParams::CYAN_RED:
				RGB = (renderingParams.passIndex == 0 ? CYAN : RED);
				break;
			default:
				assert(false);
			}
			if (RGB)
			{
				glFunc->glColorMask(RGB[0], RGB[1], RGB[2], GL_TRUE);
			}
		}
		//包含了所有3D对象绘制的逻辑，例如设置透视矩阵，遍历场景中的所有对象并调用它们的绘制函数
		draw3D(CONTEXT, renderingParams);    //这个函数画中间层的 3D View，删掉后对窗体前景和背景没有影响。
		if (m_stereoModeEnabled && m_stereoParams.isAnaglyph())
		{
			//如果之前设置过颜色过滤器，那么在3D对象绘制结束后，需要恢复默认的颜色过滤器设置，即允许所有颜色分量通过
			glFunc->glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
		}
	}


	//如果在渲染过程中改变了视口大小，那么在所有渲染步骤结束后，需要恢复初始的视口大小
	if (modifiedViewport)
	{
		setGLViewport(originViewport);
		CONTEXT.glW = originViewport.width();
		CONTEXT.glH = originViewport.height();
		modifiedViewport = false;
	}

	bool oculusMode = (m_stereoModeEnabled && m_stereoParams.glassType == StereoParams::OCULUS);
	glFunc->glFlush();


	/******************/
	/*** FOREGROUND ***/    //前景
	/******************/

	if (renderingParams.drawForeground && !oculusMode)
	{
		drawForeground1(CONTEXT, renderingParams);     //这个语句在窗体中画前景（图片），删掉后对3D视图和背景无影响。
	}

	//用于强制刷新缓冲，保证绘图命令将被执行，而不是存储在缓冲区中等待其他的OpenGL命令。
	glFunc->glFlush();
}



//4.画背景   
void ccGLWindow::drawBackground(CC_DRAW_CONTEXT& CONTEXT, RenderingParams& renderingParams)
{
	ccQOpenGLFunctions* glFunc = functions();
	assert(glFunc);

	/****************************************/
	/****  PASS: 2D/BACKGROUND/NO LIGHT  ****/    //2D背景，无光线
	/****************************************/

	glFunc->glPointSize(m_viewportParams.defaultPointSize);
	glFunc->glLineWidth(m_viewportParams.defaultLineWidth);
	glFunc->glDisable(GL_DEPTH_TEST);

	CONTEXT.drawingFlags = CC_DRAW_2D;
	if (m_interactionFlags & INTERACT_TRANSFORM_ENTITIES)
	{
		CONTEXT.drawingFlags |= CC_VIRTUAL_TRANS_ENABLED;
	}

	setStandardOrthoCenter();

	//clear background   清除背景同时设置背景色
	{
		GLbitfield clearMask = GL_NONE;

		if (renderingParams.clearDepthLayer)
		{
			clearMask |= GL_DEPTH_BUFFER_BIT;
		}
		if (renderingParams.clearColorLayer)
		{
			const ccGui::ParamStruct& displayParams = getDisplayParameters();
			if (displayParams.drawBackgroundGradient)  //背景渐变
			{
				//draw the default gradient color background  
				int w = m_glViewport.width() / 2 + 1;
				int h = m_glViewport.height() / 2 + 1;

				const ccColor::Rgbub& bkgCol = getDisplayParameters().backgroundCol;
				const ccColor::Rgbub& frgCol = getDisplayParameters().textDefaultCol;

				//Gradient "texture" drawing
				glFunc->glBegin(GL_QUADS);
				{
					//we use the default background color for gradient start
					glColor3ubv_safe<ccQOpenGLFunctions>(glFunc, bkgCol.rgb);
					glFunc->glVertex2i(-w, h);
					glFunc->glVertex2i(w, h);
					//and the inverse of the text color for gradient stop
					glFunc->glColor3ub(255 - frgCol.r, 255 - frgCol.g, 255 - frgCol.b);
					glFunc->glVertex2i(w, -h);
					glFunc->glVertex2i(-w, -h);
				}
				glFunc->glEnd();
			}
			else   //纯色背景    删掉后所有的背景都是纯黑色，不再有其他颜色的背景
			{
				//use plain color as specified by the user
				const ccColor::Rgbub& bkgCol = displayParams.backgroundCol;
				const ccColor::Rgbaf backgroundColor(bkgCol.r / 255.0f,
					bkgCol.g / 255.0f,
					bkgCol.b / 255.0f,
					1.0f);

				glFunc->glClearColor(backgroundColor.r,   //  glClearColor其实是设定颜色 参数为RGB和透明度
					backgroundColor.g,
					backgroundColor.b,
					backgroundColor.a);

				clearMask |= GL_COLOR_BUFFER_BIT;
			}
		}

		//we clear the background    清除背景色
		if (clearMask != GL_NONE)
		{
			glFunc->glClear(clearMask);
		}
	}
#if 0
	if (false)
	{
		//we draw 2D entities
		if (m_globalDBRoot)
			m_globalDBRoot->draw(CONTEXT);
		if (m_winDBRoot)
			m_winDBRoot->draw(CONTEXT);
	}
#endif
}


void ccGLWindow::drawForeground1(CC_DRAW_CONTEXT& CONTEXT, RenderingParams& renderingParams)
{
	ccQOpenGLFunctions* glFunc = functions();
	assert(glFunc);

	/****************************************/
	/****  PASS: 2D/FOREGROUND/NO LIGHT  ****/
	/****************************************/
	setStandardOrthoCenter();
	glFunc->glDisable(GL_DEPTH_TEST);// 禁用深度测试和写入

	CONTEXT.drawingFlags = CC_DRAW_2D | CC_DRAW_FOREGROUND;
	if (m_interactionFlags & INTERACT_TRANSFORM_ENTITIES)
	{
		CONTEXT.drawingFlags |= CC_VIRTUAL_TRANS_ENABLED;
	}


	//we draw 2D entities
	if (m_globalDBRoot)  //这个if语句画主界面上的2D图像
	{
		//model and projection matrices
		ccGLMatrixd modelViewMat;
		modelViewMat = getModelViewMatrix();
		glFunc->glPushMatrix();             //将多组属性或者全部属性通过函数glPushAttrib压入属性堆栈中    
		//setup the default view matrix
		{
			//模型视图变换（GL_MODELVIEW）：从“相对移动”的观点来看，改变观察点的位置与方向和改变物体本身的位置与方向具有等效性。
			glFunc->glMatrixMode(GL_MODELVIEW);
			glFunc->glLoadMatrixd(modelViewMat.data());       //删掉这个语句，3D视图的初始显示很小且无法用鼠标进行任何操作
		}

		m_globalDBRoot->draw(CONTEXT);
		glFunc->glPopMatrix();             //恢复到将属性压入堆栈前的状态
	}


	if (m_winDBRoot)  //这个if语句画子界面上的2D图像，以及子界面上的2D矩形roi
	{
		ccGLMatrixd modelViewMat;
		modelViewMat = getModelViewMatrix();
		glFunc->glPushMatrix();             //将多组属性或者全部属性通过函数glPushAttrib压入属性堆栈中    
		//setup the default view matrix
		{
			glFunc->glMatrixMode(GL_MODELVIEW);
			glFunc->glLoadMatrixd(modelViewMat.data());       //删掉这个语句，3D视图的初始显示很小且无法用鼠标进行任何操作
		}
		m_winDBRoot->draw(CONTEXT);
		glFunc->glPopMatrix();             //恢复到将属性压入堆栈前的状态
	}



	//glFunc->glLoadMatrixd(false);
	//current displayed scalar field color ramp (if any)
	//透视投影变换（GL_PROJECTION）：定义一个可视空间，可视空间以外的物体不会被绘制到屏幕上
	glFunc->glDisable(GL_MODELVIEW);
	ccRenderingTools::DrawColorRamp(CONTEXT);     //删掉这个语句，colorscale将不能实现


	//m_clickableItems.clear();
	/*** overlay entities ***/
	//if (m_displayOverlayEntities)    //这段代码跟屏幕上显示字幕相关，删掉后无法显示字幕
	//{
	//	//default overlay color
	//	const ccColor::Rgbub& textCol = getDisplayParameters().textDefaultCol;
	//	if (!m_captureMode.enabled || m_captureMode.renderOverlayItems)
	//	{
	//		//scale: only in ortho mode
	//		if (!m_viewportParams.perspectiveView)
	//		{
	//			//drawScale(textCol);
	//		}
	//		//trihedron
	//		//drawTrihedron();
	//	}
	//	if (!m_captureMode.enabled)
	//	{
	//		int yStart = 0;
	//		//transparent border at the top of the screen
	//		bool showGLFilterRibbon = renderingParams.useFBO && m_activeGLFilter;
	//		showGLFilterRibbon &= !exclusiveFullScreen(); //we hide it in fullscreen mode!
	//		
	//		//current messages (if valid)
	//		if (!m_messagesToDisplay.empty())
	//		{
	//			glColor3ubv_safe<ccQOpenGLFunctions>(glFunc, textCol.rgb);
	//			int ll_currentHeight = m_glViewport.height() - 10; //lower left
	//			int uc_currentHeight = 10; //upper center
	//			for (const auto &message : m_messagesToDisplay)
	//			{
	//				switch (message.position)
	//				{
	//				case LOWER_LEFT_MESSAGE:
	//				{
	//					renderText(10, ll_currentHeight, message.message, m_font);
	//					int messageHeight = QFontMetrics(m_font).height();
	//					ll_currentHeight -= (messageHeight * 5) / 4; //add a 25% margin
	//				}
	//				break;
	//				case UPPER_CENTER_MESSAGE:
	//				{
	//					QRect rect = QFontMetrics(m_font).boundingRect(message.message);
	//					//take the GL filter banner into account!
	//					int x = (m_glViewport.width() - rect.width()) / 2;
	//					int y = uc_currentHeight + rect.height();
	//					if (showGLFilterRibbon)
	//					{
	//						y += getGlFilterBannerHeight();
	//					}
	//					renderText(x, y, message.message, m_font);
	//					uc_currentHeight += (rect.height() * 5) / 4; //add a 25% margin
	//				}
	//				break;
	//				case SCREEN_CENTER_MESSAGE:    //正是这个语句使得屏幕字幕显示在屏幕正中间
	//				{
	//					QFont newFont(m_font); //no need to take zoom into account!
	//					newFont.setPointSize(36 * devicePixelRatio());    //原本是12
	//					QRect rect = QFontMetrics(newFont).boundingRect(message.message);
	//					//only one message supported in the screen center (for the moment ;)
	//					renderText((m_glViewport.width() - rect.width()) / 2, (m_glViewport.height() - rect.height()) / 2, message.message, newFont);
	//				}
	//				break;
	//				}
	//			}
	//		}
	//		
	//	}
	//}
	//logGLError("ccGLWindow::drawForeground");
}


//5.画3D 不能删，删除后无法显示点云图像
void ccGLWindow::draw3D(CC_DRAW_CONTEXT& CONTEXT, RenderingParams& renderingParams)
{
	ccQOpenGLFunctions* glFunc = functions();
	assert(glFunc);

	glFunc->glPointSize(m_viewportParams.defaultPointSize);   // 默认点尺寸
	glFunc->glLineWidth(m_viewportParams.defaultLineWidth);   //默认线宽，没有用

	glFunc->glEnable(GL_DEPTH_TEST);

	CONTEXT.drawingFlags = CC_DRAW_3D | CC_DRAW_FOREGROUND;
	if (m_interactionFlags & INTERACT_TRANSFORM_ENTITIES)
	{
		CONTEXT.drawingFlags |= CC_VIRTUAL_TRANS_ENABLED;
	}

	setStandardOrthoCenter();

	/****************************************/
	/****    PASS: 3D/FOREGROUND/LIGHT   ****/
	/****************************************/


	if (m_customLightEnabled || m_sunLightEnabled)
	{
		CONTEXT.drawingFlags |= CC_LIGHT_ENABLED;
	}

	//we activate the current shader (if any)
	if (m_activeShader)
	{
		m_activeShader->bind();
	}

	//color ramp shader for fast dynamic color ramp lookup-up
	if (m_colorRampShader && getDisplayParameters().colorScaleUseShader)
	{
		CONTEXT.colorRampShader = m_colorRampShader;
	}

	//custom rendering shader (OpenGL 3.3+)
	{
		//FIXME: work in progress
		CONTEXT.customRenderingShader = m_customRenderingShader;
	}

	//model and projection matrices
	ccGLMatrixd modelViewMat, projectionMat;

	{
		modelViewMat = getModelViewMatrix();
		projectionMat = getProjectionMatrix();
	}

	//setup the projection matrix
	{
		glFunc->glMatrixMode(GL_PROJECTION);
		glFunc->glLoadMatrixd(projectionMat.data());
	}
	//setup the default view matrix
	{
		glFunc->glMatrixMode(GL_MODELVIEW);
		glFunc->glLoadMatrixd(modelViewMat.data());
	}


	//we draw 3D entities
	if (m_globalDBRoot)     //删掉这个if语句，在主界面上没有3D图像在视图中显示
	{
		m_globalDBRoot->draw(CONTEXT);

	}

	if (m_winDBRoot)    //删掉这个if语句，在子界面视图中没有3D图像显示
	{
		m_winDBRoot->draw(CONTEXT);
	}

	if (m_globalDBRoot && m_globalDBRoot->getChildrenNumber())
	{
		//draw pivot  轴线先不用画
		//drawPivot();  
	}



	//reset context  复位内容
	CONTEXT.colorRampShader = nullptr;
	CONTEXT.customRenderingShader = nullptr;

	//we disable shader (if any)
	if (m_activeShader)
	{
		m_activeShader->release();

	}
	//we display the cross at the end (and in orthographic mode)
	if (renderingParams.draw3DCross
		&&	m_currentLODState.level == 0
		&& !m_captureMode.enabled
		&& !m_viewportParams.perspectiveView
		&& (!renderingParams.useFBO || !m_activeGLFilter))
	{
		setStandardOrthoCenter();
		drawCross();
	}

}

