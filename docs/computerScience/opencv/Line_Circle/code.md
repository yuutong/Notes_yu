### 找直线：
      两个过程：边缘提取（抓取边缘点）   拟合成直线

## 边缘检测和提取：
void Extract1DEdge::GetGradientMat()
{
	//计算图像的一维梯度
    if (m_mInputMat.empty())
    {
        return;
    }
	//转灰度图
    if (m_mInputMat.channels() > 1)
    {
        cvtColor(m_mInputMat, m_mInputMat, COLOR_BGR2GRAY);
    }  
	//码将输入的二维图像m_mInputMat在垂直方向（第三个参数为0）上进行压缩，使用的方法是取平均值（REDUCE_AVG），结果是一个一维图像。
    reduce(m_mInputMat, m_mInputMat, 0, REDUCE_AVG, CV_64FC1);
	/**
	 *使用Sobel算子计算输入图像的一维梯度
	 *CV_64FC1是输出图像的类型，单通道64位浮点型
	 *第四个参数1表示在x方向上计算一阶导数
	 *第五个参数0表示在y方向上计算0阶导数，即不计算
	 *最后一个参数1表示使用的Sobel算子的大小是1
	*/
    Sobel(m_mInputMat, m_mInputMat, CV_64FC1, 1, 0, 1);

	//对梯度图像进行一次缩放操作，m_dSigma是缩放因子
	//为了调整梯度的尺度，使其适应后续的处理步骤
    m_mInputMat = m_dSigma * sqrt(2 * PI) * m_mInputMat;
}





void Extract1DEdge::GetEdgePoint(int threshold, Translation traslation, Selection selection)
{
    if (m_mInputMat.empty())
    {
        return;
    }
	//彩色图像转灰度图
    if (m_mInputMat.channels() > 1)
    {
        cvtColor(m_mInputMat, m_mInputMat, COLOR_BGR2GRAY);
    }
	//创建一个指向图像第一行的指针
    double* ptr = m_mInputMat.ptr<double>(0);
	//清空候选点集和最终结果两个向量
    m_vpCandidate.clear();
    m_vEdgesResult.clear();
    //遍历每一列，计算梯度的模值，如果大于输入的阈值，将这个点的位置（一维）和梯度信息
	//存到一个二维向量候选点集
    for (int i = 0; i < m_mInputMat.cols; i++)
    {
        double dGradient = abs(ptr[i]);
        if (dGradient >= threshold)
        {
            m_vpCandidate.push_back(Point2d(i, ptr[i]));
        }
    }
	//若候选点集为空则返回
    if (m_vpCandidate.size() == 0)
    { 
        return;
    }
    //若输入是由暗到明，删除所有梯度值小于0的点
    //反之删除所有梯度值大于0的点
    if (traslation == Translation::Poisitive)// from dark to light: f'(x)>0
    {
        for (vector<Point2d>::iterator iter = m_vpCandidate.begin(); iter != m_vpCandidate.end();)
        {
            if ((*iter).y <= 0)
            {
                //cout << "Negative Edge: " << (*iter).y << endl;
                iter = m_vpCandidate.erase(iter);
            }
            else
            {
                iter++;
            }
        }
    }
    else if (traslation == Translation::Negative)
    {
        for (vector<Point2d>::iterator iter = m_vpCandidate.begin(); iter != m_vpCandidate.end();)
        {
            if ((*iter).y > 0)
            {
                iter = m_vpCandidate.erase(iter);
            }
            else
            {
                iter++;
            }           
        }
    }
    if (m_vpCandidate.size() == 0)
    {
        return;
    }


    /**
	 *selection是候选点类型
	 *如果Selection为First，那么就选择第一个候选点，也就是在图像中最左边的点。这个点满足了梯度阈值条件，所以被认为是一个边缘点。函数会保留这个点并删除其他点。
     *如果Selection为Last，那么就选择最后一个候选点，也就是在图像中最右边的点。同样的，这个点也满足了梯度阈值条件，被认为是一个边缘点。函数会保留这个点并删除其他点。
     *如果Selection为Strongest，那么就选择梯度值最大的点作为边缘点。因为梯度值的大小代表了颜色变化的速度，所以梯度最大的点通常代表了边缘最明显的地方。函数会找出梯度值最大的点，保留它并删除其他点。
     *如果Selection为Weakest，那么就选择梯度值最小的点作为边缘点。尽管这个点的梯度值相对较小，但它仍满足了梯度阈值条件，因此也被认为是一个边缘点。函数会找出梯度值最小的点，保留它并删除其他点。
	*/
    if (selection == Selection::Fisrt)
    {
        m_vpCandidate.erase(m_vpCandidate.begin() + 1, m_vpCandidate.end());
    }
    else if (selection == Selection::Last)
    {
        m_vpCandidate.erase(m_vpCandidate.begin(), m_vpCandidate.end() - 1);
    }
    else if (selection == Selection::Strongest)
    {
        Point2d pdMax(0, 0);
        double dGradientMax = 0;
        for(Point2d item: m_vpCandidate)
        {
            if (abs(item.y) >= dGradientMax)
            {
                pdMax = item;
                dGradientMax = abs(item.y);
            }
        }
        m_vpCandidate.clear();
        m_vpCandidate.push_back(pdMax);
    }
    else if (selection == Selection::weakest)
    {
        Point2d pdMin(0, 99999999);
        for (Point2d item : m_vpCandidate)
        {
            if (abs(item.y) <= pdMin.y)
            {
                pdMin.y = abs(item.y);
                pdMin.x = item.x;
            }
        }
        m_vpCandidate.clear();
        m_vpCandidate.push_back(pdMin);
    }
	/**
	 *使用m_vpCandidate向量中的点，计算最终的边缘点的位置，
	 *并将其和梯度值作为Edge1D_Result结构存入m_vEdgesResult向量
	*/
    double dEdgex = 0, dEdgey = 0;
    for (Point2d item : m_vpCandidate)
    {
        if (isinf(m_dK))
        {
            dEdgex = m_pdStart.x;
            dEdgey = m_pdStart.y + sin(to_radian(m_dAngle)) * item.x;
        }
        else
        {
            dEdgex = m_pdStart.x + item.x * cos(to_radian(m_dAngle));
            dEdgey = m_dK * dEdgex + m_dB;
        }
        m_vEdgesResult.push_back(Edge1D_Result(Point2d(dEdgex, dEdgey), item.y));
    }
}





vector<Edge1D_Result> Extract1DEdge::Get1DEdge(Mat inputMat, Point2d pdCenter, double dMeasureLength, double dMeasureHeight, double dMeasureAngle,double sigma, int threshold, Translation traslation, Selection selection)
{
    if (inputMat.empty())
    {
        return vector<Edge1D_Result>();
    }
    m_vEdgesResult.clear();
    inputMat.copyTo(m_mInputMat);
    m_pdCenter      = pdCenter;
    m_dLength       = dMeasureLength;
    m_dHeight       = dMeasureHeight;
    m_dAngle        = dMeasureAngle;
    m_dSigma        = sigma;
    m_nThreshold    = threshold * (m_dSigma * sqrt(2 * PI));
    GetEndPointsOfLine(pdCenter, dMeasureAngle, dMeasureLength, m_pdStart, m_pdEnd);
    m_dK            = GetLineSlope(m_pdStart, m_pdEnd);
    m_dB            = m_pdStart.y - m_dK * m_pdStart.x;
  
	GetProfieMat();
    FilterMat();
    GetGradientMat();
    GetEdgePoint(threshold, traslation, selection);

    return m_vEdgesResult;
}


### 直线拟合：

void process_edges(const cv::Mat& RoiMat,
	const std::vector<cv::Point2d>& m_vpdEquinoxPoints,
	const double m_dMeasureLength,
	const double m_dMeasureHeight,
	const double m_dAngle,
	const int m_nSampleDirecion,
	const double m_dSigma,
	const int m_nThreshold,
	const int m_nTranslation,
	std::vector<cv::Point2d>& m_vpdEdgePoints,
	std::vector<double>& m_vdEdgeGradient,
	int start_idx, int end_idx, Extract1DEdge extract1DEdge, const int m_nSelection)
{
	/**
	 *给定图像的ROI（感兴趣区域）中提取一维边缘点
	 *通过Get1DEdge函数找到边缘点并将结果存储在edges向量中。
	 *然后，利用互斥锁g_mutex1保护共享资源m_vpdEdgePoints和m_vdEdgeGradient，
	 *防止在多线程环境中出现数据冲突。
	 *最后，将找到的边缘点和相应的梯度值加入到这两个共享资源中
	*/
	std::vector<Edge1D_Result> edges;

	for (int i = start_idx; i < end_idx; i++)
	{
		edges = extract1DEdge.Get1DEdge(RoiMat, m_vpdEquinoxPoints[i], m_dMeasureLength, m_dMeasureHeight, m_dAngle + m_nSampleDirecion
			, m_dSigma, m_nThreshold, m_nTranslation == 1 ? Translation::Poisitive : Translation::Negative,
			m_nSelection == 1 ? Selection::Strongest : m_nSelection == 2 ? Selection::Fisrt : Selection::Last);
		// 使用锁保护m_vpdEdgePoints和m_vdEdgeGradient
		std::lock_guard<std::mutex> lock(g_mutex1);
		for (int j = 0; j < edges.size(); j++)
		{
			m_vpdEdgePoints.push_back(edges[j].m_pdEdgePoint); //边缘点
			m_vdEdgeGradient.push_back(edges[j].m_dGradient);  //梯度值
		}
	}
}



void myGraphicRectItem::RansacLineFiler(const vector<Point2d>& points, vector<Point2d>&vpdExceptPoints, double sigma)
{
	/**
	 *RANSAC直线拟合：
	 *从输入的点集中找出符合直线模型的点，
	 *同时把远离直线的点（即异常点）放入vpdExceptPoints向量。
	 *RANSAC是一种健壮的参数估计方法，能够处理数据中有大量异常值的情况
	 *输入参数为点的集合points，异常点的集合vpdExceptPoints和一个距离阈值sigma
	*/

	unsigned int n = points.size();
	if (n < 2) //点数小于2，直接返回
	{
		return;
	}

	RNG random; //定义一个随机数生成器
	double bestScore = -1.;//初始化最佳得分为-1

	//定义一个临时向量用于存储每次迭代中被认为是异常的点
	vector<Point2d>vpdTemp;

	//计算迭代次数。这个公式是RANSAC算法的标准迭代次数公式，
	//用于保证以99%的概率得到一个好的模型
	int iterations = log(1 - 0.99) / (log(1 - (1.00 / n))) * 10;

	/**
	 *进行RANSAC迭代。每次迭代都会随机选择两个点并计算直线模型，
	 *然后计算所有点到这条直线的距离，如果距离小于sigma，
	 *则认为该点符合直线模型，增加得分
	*/
	for (int k = 0; k < iterations; k++)
	{
		int i1 = 0, i2 = 0;
		while (i1 == i2)
		{
			//随机选择两个点
			i1 = random(n);
			i2 = random(n);
		}

		//从点集points中取出索引为i1，i2的点
		const cv::Point2d& p1 = points[i1];
		const cv::Point2d& p2 = points[i2];
		//计算从p1到p2的向量vectorP21并将其归一化
		Point2d vectorP21 = p2 - p1;
		vectorP21 *= 1. / norm(vectorP21);

		//初始化得分为0，清空临时容器
		double score = 0;
		vpdTemp.clear();

		//遍历每个点检查其是否符合当前的直线模型
		for (int i = 0; i < n; i++)
		{
			//计算p1到当前点points[i]的距离
			Point2d vectorPi1 = points[i] - p1;

			//计算当前点到直线的垂直距离
			double d = vectorPi1.y * vectorP21.x - vectorPi1.x * vectorP21.y;//calculate the cosΘ of the two vectors.

			//如果当前点到直线的距离小于等于阈值sigma，则认为当前点符合直线模型，得分加一
			//如果当前点到直线的距离大于阈值sigma，则认为当前点不符合直线模型，将当前点添加到临时容器vpdTemp中
			if (fabs(d) < sigma)
			{
				score += 1;
			}
			else
			{
				vpdTemp.push_back(points[i]);
			}
		}
		//如果当前的得分高于之前的最高得分，那么更新最高得分，
		//并将临时容器vpdTemp中的点视为异常点，赋值给vpdExceptPoints
		if (score > bestScore)
		{
			bestScore = score;
			vpdExceptPoints = vpdTemp;
		}
	}
}






void myGraphicRectItem::LeastSquaresLineFit(const vector<Point2d>& points, vector<double>& residuals, double& a, double& b)
{
	/**
	 *最小二乘法直线拟合：是一种确定性算法
	 *从输入的点集中找到最佳拟合直线，得到直线的斜率和截距。
	 *同时，计算每个点到拟合直线的垂直距离的平方（即残差平方，residuals）。
	 *输入参数为点的集合points，残差平方集合residuals，以及用于返回直线斜率a和截距b的引用
	 */

	unsigned int n = points.size();
	if (n < 2) //点数小于2，直接返回
	{
		return;
	}

	double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0; //初始化求和变量
	for (int i = 0; i < n; i++)
	{
		sumX += points[i].x;
		sumY += points[i].y;
		sumXY += points[i].x * points[i].y;
		sumXX += points[i].x * points[i].x;
	}

	//根据最小二乘法公式计算拟合直线的斜率a和截距b
	a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	b = (sumY - a * sumX) / n;

	//计算每个点到拟合直线的垂直距离的平方，作为残差平方
	residuals.resize(n);
	for (int i = 0; i < n; i++)
	{
		double residual = points[i].y - a * points[i].x - b; //点到直线的垂直距离
		residuals[i] = residual * residual; //计算残差平方
	}
}




void myGraphicRectItem::HoughTransformLineFit(const vector<Point2d>& points, vector<Point2d>& lineParams, int numBinsTheta, int numBinsRho, int minVotes)
{
	/**
	 *Hough变换直线拟合：
	 *从输入的点集中找出可能的直线，直线的参数（斜率和截距）存放在lineParams向量中。
	 *输入参数为点的集合points，直线参数的集合lineParams，以及角度和半径的分箱数（numBinsTheta和numBinsRho），和最小投票数minVotes。
	 */

	 // 初始化Hough空间为0
	vector<vector<int>> houghSpace(numBinsTheta, vector<int>(numBinsRho, 0));

	// 计算rho的最大值（即点到原点的最大距离）
	double maxRho = 0;
	for (const auto& point : points)
	{
		maxRho = max(maxRho, norm(point));
	}

	// 对每个点进行投票
	for (const auto& point : points)
	{
		for (int i = 0; i < numBinsTheta; ++i)
		{
			// 计算theta值
			double theta = i * CV_PI / numBinsTheta;
			// 计算rho值
			double rho = point.x * cos(theta) + point.y * sin(theta);
			// 将rho映射到合适的箱中
			int rhoIndex = round((rho + maxRho) / (2 * maxRho) * numBinsRho);
			// 投票
			houghSpace[i][rhoIndex]++;
		}
	}

	// 从Hough空间中提取出直线
	lineParams.clear();
	for (int i = 0; i < numBinsTheta; ++i)
	{
		for (int j = 0; j < numBinsRho; ++j)
		{
			// 如果投票数大于阈值，则认为找到了一条直线
			if (houghSpace[i][j] > minVotes)
			{
				double theta = i * CV_PI / numBinsTheta;
				double rho = (j * 2.0 * maxRho / numBinsRho) - maxRho;
				lineParams.push_back(Point2d(theta, rho));
			}
		}
	}
}





void myGraphicRectItem::DouglasPeucker(const vector<Point2d>& points, vector<Point2d>& simplifiedPoints, double epsilon)
{
	/**
	 *道格拉斯-普克算法直线拟合：
	 *从输入的点集中得到一条简化（折线）的曲线，简化后的点存放在simplifiedPoints向量中。
	 *输入参数为点的集合points，简化后的点的集合simplifiedPoints，以及距离阈值epsilon。
	 */

	unsigned int n = points.size();
	if (n < 2) //点数小于2，直接返回
	{
		return;
	}

	// 找到点集中距离首尾两点连线最远的点
	double maxDist = 0;
	int index = 0;
	Point2d line = points[n - 1] - points[0]; //首尾两点形成的线段
	for (int i = 1; i < n - 1; ++i)
	{
		double dist = norm((points[i] - points[0]).cross(line)) / norm(line); //计算点到线段的距离
		if (dist > maxDist)
		{
			maxDist = dist;
			index = i;
		}
	}

	// 如果最远的点到线段的距离大于阈值epsilon，则将点集分为两部分，分别进行递归处理
	if (maxDist > epsilon)
	{
		vector<Point2d> leftPoints(points.begin(), points.begin() + index + 1);
		vector<Point2d> rightPoints(points.begin() + index, points.end());
		vector<Point2d> leftSimplifiedPoints;
		vector<Point2d> rightSimplifiedPoints;
		DouglasPeucker(leftPoints, leftSimplifiedPoints, epsilon);
		DouglasPeucker(rightPoints, rightSimplifiedPoints, epsilon);
		simplifiedPoints = leftSimplifiedPoints;
		simplifiedPoints.insert(simplifiedPoints.end(), rightSimplifiedPoints.begin() + 1, rightSimplifiedPoints.end());
	}
	else //否则，只保留首尾两点
	{
		simplifiedPoints = { points[0], points[n - 1] };
	}
}



//找直线算法
void myGraphicRectItem::FindLine(Point2d& pdStart, Point2d& pdEnd, double& dAngle)
{
	/**
	 *找直线算法
	 *1.获取ROI矩阵：通过创建一个旋转矩形区域并用它作为掩码，从输入图像中提取出感兴趣的区域。
	 *2.提取1D边缘点：首先清空存储边缘点和梯度的向量，然后根据等分点集合m_vpdEquinoxPoints中的每个点，在感兴趣的区域中提取1D边缘点。这个过程采用多线程处理，每个线程处理一部分点。
	 *3.RANSAC线性拟合：使用RANSAC方法对边缘点进行线性拟合，得到的结果是一条直线。同时，剔除掉不满足条件的离群点。
	 *4.拟合直线
	 *5.测量线的交点：计算拟合线与在测量角方向上穿过边缘点的线的交点，这两个交点就是我们要找的线的起点和终点。
	 *6.计算线的角度，使用起点和终点计算出线的角度。
	*/
	//创建一个旋转矩形区域，旋转矩形的中心是m_pdCenter，大小由函数GetPPDistance计算的距离加上10来确定，旋转的角度是m_dAngle
	RotatedRect rMaskRegion(m_pdCenter, Size2f(GetPPDistance(m_pdStart, m_pdEnd) + 10, m_dMeasureLength + 10), m_dAngle);
	//根据旋转矩形生成四个顶点的坐标，存在rMaskRegion中
	Point2f rRegionPoints[4];
	rMaskRegion.points(rRegionPoints);

	/**
	 *创建一个掩码，用于从输入图像中提取旋转矩形（ROI）中的内容
	 *首先，创建一个大小和输入矩阵一样，但所有的像素值均为0的矩阵作为掩码
	 *然后，使用fillPoly函数在掩码上绘制一个多边形，多边形的顶点是旋转矩形的四个顶点，绘制区域的像素值设为255
	 *最后，使用bitwise_and函数将输入图像和掩码进行按位与操作，得到旋转区域的图像
	*/
	Mat mask = Mat::zeros(m_mInputMat.size(), CV_8UC1);
	Point ppt[] = { rRegionPoints[0], rRegionPoints[1], rRegionPoints[2], rRegionPoints[3] };
	const Point* pts[] = { ppt };
	int npt[] = { 4 };
	fillPoly(mask, pts, npt, 1, Scalar::all(255), 8);
	Mat RoiMat;
	bitwise_and(m_mInputMat, m_mInputMat, RoiMat, mask);

	//清空存储边缘点，边缘梯度和异常边缘点的向量
	m_vpdEdgePoints.clear();
	m_vdEdgeGradient.clear();
	m_vpdExcepetEdgePoints.clear();


	int m = m_vpdEquinoxPoints.size();//等分点的大小
	//预留m个空间给m_vpdEdgePoints和m_vdEdgeGradient这两个向量。
	//这个操作可以提高性能，因为它避免了在添加元素时不必要的内存分配
	m_vpdEdgePoints.reserve(m);
	m_vdEdgeGradient.reserve(m);
	vector<Edge1D_Result>edges;
	//彩图转灰度图
	if (RoiMat.channels() > 1)
	{
		cvtColor(RoiMat, RoiMat, COLOR_BGR2GRAY);
	}
	//定义将要创建的线程数量，定义线程向量，每个元素是一个线程
	const int num_threads = m;
	std::vector<std::thread> threads(num_threads);

	//创建两个二维向量，用来存储每个线程找到的边缘点和边缘点的梯度
	std::vector<std::vector<cv::Point2d>> edge_points(num_threads);
	std::vector<std::vector<double>> edge_gradients(num_threads);

	/**
	 *并行地处理图像
	 *在每次迭代中，首先计算出一个区间[start_idx,end_idx]
	 *然后在这个区域内新建一个线程来处理图像，每个线程都会调用process_edges进行边缘提取
	*/
	for (int i = 0; i < num_threads; i++)
	{
		int start_idx = i * m / num_threads;
		int end_idx = (i + 1) * m / num_threads;
		threads[i] = std::thread(process_edges, std::ref(RoiMat), std::ref(m_vpdEquinoxPoints),
			m_dMeasureLength, m_dMeasureHeight, m_dAngle, m_nSampleDirecion, m_dSigma, m_nThreshold, m_nTranslation,
			std::ref(edge_points[i]), std::ref(edge_gradients[i]), start_idx, end_idx, extract1DEdge, m_nSelection);
	}

	/**
	 *等待所有线程都完成他的任务
	 *在每次迭代中，调用join()来等待线程结束，，然后把结果存到边缘点信息和梯度信息的向量中
	*/
	for (int i = 0; i < num_threads; i++)
	{
		threads[i].join();
		// 合并结果
		m_vpdEdgePoints.insert(m_vpdEdgePoints.end(), edge_points[i].begin(), edge_points[i].end());
		m_vdEdgeGradient.insert(m_vdEdgeGradient.end(), edge_gradients[i].begin(), edge_gradients[i].end());
	}

	//定义一个Vec4f型变量，存储拟合直线的参数
	Vec4f lines;
	int nSize = m_vpdEdgePoints.size() - 1; //最后一个边缘点索引

											//起始点和结束点初始化为（-1，-1）
	pdStart = Point2d(-1, -1);
	pdEnd = Point2d(-1, -1);
	/**
	 *检查是否有足够的边缘点来拟合直线。
	 *只有当m_vpdEdgePoints至少有一个元素时，它的大小nSize才会大于等于0
	*/
	if (nSize >= 0)
	{
		//RansacLineFiler(const vector<Point2d>& points, vector<Point2d>&vpdExceptPoints, double sigma)
		//用RANSAC算法剔除异常点，输入包含边缘点的集和，异常点的集合和过滤值
		RansacLineFiler(m_vpdEdgePoints, m_vpdExcepetEdgePoints, m_dFiltrate);
		//DouglasPeucker(m_vpdEdgePoints, m_vpdExcepetEdgePoints, m_dFiltrate);
		  //LeastSquaresLineFit(m_vpdEdgePoints, m_vpdExcepetEdgePoints, m_dFiltrate);
		  //HoughTransformLineFit(m_vpdEdgePoints, m_vpdExcepetEdgePoints, m_dFiltrate);


		//LeastSquaresLineFit(const vector<Point2d>& points, vector<double>& residuals, double& a, double& b)
		//HoughTransformLineFit(const vector<Point2d>& points, vector<Point2d>& lineParams, int numBinsTheta, int numBinsRho, int minVotes)
		//DouglasPeucker(const vector<Point2d>& points, vector<Point2d>& simplifiedPoints, double epsilon)


		//遍历了所有的异常点，并在边缘点集合中找到相同的点并删除
		for (Point2d point : m_vpdExcepetEdgePoints)//remove the excepted points.移除多余的点
		{
			for (int i = 0; i < nSize + 1; i++)
			{
				if (point == m_vpdEdgePoints[i])
				{
					m_vpdEdgePoints.erase(m_vpdEdgePoints.begin() + i);
					break;
				}
			}
		}
		//更新边缘点索引
		nSize = m_vpdEdgePoints.size() - 1;
		//用边缘点拟合成直线，结果存储在lines中
		fitLine(m_vpdEdgePoints, lines, DIST_HUBER, 0, 0.01, 0.01);

		//计算拟合直线的斜率和截距
		double dK = lines[1] / lines[0];
		double dB = lines[3] - dK * lines[2];

		//创建两个点，选取的是边缘点集合中的第一个点和最后一个点
		Point2d pdfitLineP1 = Point2d(m_vpdEdgePoints[0].x, dK * (m_vpdEdgePoints[0].x - lines[2]) + lines[3]);
		Point2d pdfitLineP2 = Point2d(m_vpdEdgePoints[nSize].x, dK * (m_vpdEdgePoints[nSize].x - lines[2]) + lines[3]);

		//定义两个点，将用来存储线段的端点
		Point2d pdP11(0, 0), pdP22(0, 0);

		/**
		 *过给定一个点（这里是m_vpdEdgePoints的第一个点），
		 *一个方向（这里是m_dAngle - 90），和一个长度（这里是m_dMeasureLength），
		 *来获得一个线段的两个端点，这两个端点存储在pdP11和pdP22中
		*/
		GetEndPointsOfLine(m_vpdEdgePoints[0], m_dAngle - 90, m_dMeasureLength, pdP11, pdP22);

		/**
		 *这里的两条线分别是拟合得到的直线（通过pdfitLineP1和pdfitLineP2表示），
		 *和上一行代码中得到的线段（通过pdP11和pdP22表示）。
		 *线段的交点被赋值给pdStart，表示开始点
		*/
		pdStart = GetIntersectionOfLines(pdfitLineP1, pdfitLineP2, pdP11, pdP22);

		//得到了另外一条线段的端点。这一次，线段通过m_vpdEdgePoints的最后一个点和同样的方向和长度得到
		GetEndPointsOfLine(m_vpdEdgePoints[nSize], m_dAngle - 90, m_dMeasureLength, pdP11, pdP22);

		//计算了两条线段的交点，但是这一次得到的是结束点，所以赋值给pdEnd
		pdEnd = GetIntersectionOfLines(pdfitLineP1, pdfitLineP2, pdP11, pdP22);

		//通过给定两个点，计算从第一个点到第二个点的向量与X轴的角度，并赋值给dAngle
		dAngle = GetAngleVecWithX(pdStart, pdEnd);
	}


}




#### 拟合成圆：
     void QtFitCircleTool::FitCircle()
{	
	/**
	 *对图形界面进行更新，包括绘制一个圆形，圆心，以及圆的边缘点
	 *使用一个名为m_Circle的对象来找到一个圆形。方法FitCircle的输入参数是圆心的坐标(pdCenter)和半径(dRadius)，以及一个标志(1)。
     *检查是否已经存在一个名为ellipse的对象。如果存在，首先从场景(scene)中移除ellipse，然后删除ellipse对象。
     *创建一个新的QGraphicsEllipseItem对象(ellipse)，并设置其画笔颜色为绿色，然后根据圆心和半径设置其矩形边界(rect)，并把ellipse对象添加到场景(scene)中。
     *检查是否存在名为Draw_Center_horizontalLine和Draw_Center_verticalLine的对象。如果存在，首先从场景(scene)中移除这两个对象，然后删除这两个对象。
     *创建两个新的QGraphicsLineItem对象，分别表示水平和垂直的线，它们交于圆心，然后把这两条线添加到场景(scene)中。
     *检查DisplayEdgePoints列表中的每一个对象。如果存在，首先从场景(scene)中移除这个对象，然后删除这个对象。
     *清空DisplayEdgePoints列表，并根据m_Circle对象中的边缘点和异常边缘点的数量重新调整其大小。
     *创建新的QGraphicsLineItem对象，分别表示拟合边缘点和不参与拟合的边缘点，然后把这些点添加到场景(scene)中。
     *显示圆心的坐标和半径
	*/


	//找圆
	Point2d pdCenter(0, 0);
	double dRadius = 0;
	m_Circle->FitCircle(pdCenter, dRadius, 1);

	//绘制圆
	if (ellipse != NULL)
	{
		// 从场景中删除 item
		scene->removeItem(ellipse);
		ellipse = NULL;
		// 从内存中删除 item
		delete ellipse;
	}
	ellipse = new QGraphicsEllipseItem();
	QPointF center(pdCenter.x, pdCenter.y); // 圆心坐标
	ellipse->setPen(QPen(Qt::green)); // 设置画笔
	QPointF topLeft(center.x() - dRadius, center.y() - dRadius);
	QPointF bottomRight(center.x() + dRadius, center.y() + dRadius);
	QRectF rect(topLeft, bottomRight);
	ellipse->setRect(rect);
	scene->addItem(ellipse);

	//绘制圆心十字
	if (Draw_Center_horizontalLine != NULL && Draw_Center_verticalLine != NULL)
	{
		// 从场景中删除 item
		scene->removeItem(Draw_Center_horizontalLine);
		scene->removeItem(Draw_Center_verticalLine);
		Draw_Center_horizontalLine = NULL;
		Draw_Center_verticalLine = NULL;
		// 从内存中删除 item
		delete Draw_Center_horizontalLine;
		delete Draw_Center_verticalLine;
	}
	Draw_Center_horizontalLine= new QGraphicsLineItem(pdCenter.x - 20, pdCenter.y, pdCenter.x + 20, pdCenter.y);
	Draw_Center_verticalLine = new QGraphicsLineItem(pdCenter.x, pdCenter.y - 20, pdCenter.x, pdCenter.y + 20);
	Draw_Center_horizontalLine->setPen(QPen(Qt::green)); // 设置画笔
	Draw_Center_verticalLine->setPen(QPen(Qt::green)); // 设置画笔
	scene->addItem(Draw_Center_horizontalLine);
	scene->addItem(Draw_Center_verticalLine);

	//绘制边缘点
	for (size_t i = 0; i < DisplayEdgePoints.size(); i++)
	{
		// 从场景中删除 item
		scene->removeItem(DisplayEdgePoints[i]);
		DisplayEdgePoints[i] = NULL;
		// 从内存中删除 item
		delete DisplayEdgePoints[i];
	}
	DisplayEdgePoints.clear();
	int Edge_num = m_Circle->m_vpdEdgePoints.size() + m_Circle->m_vpdExcepetEdgePoints.size();
	DisplayEdgePoints.resize(Edge_num * 2);
	//拟合边缘点（绿色）
	QPen mPen = QPen(Qt::green);
	int j = 0;
	for (size_t i = 0; i < m_Circle->m_vpdEdgePoints.size(); i++)
	{
		DisplayEdgePoints[j] = new QGraphicsLineItem(m_Circle->m_vpdEdgePoints[i].x - 5,
			m_Circle->m_vpdEdgePoints[i].y, m_Circle->m_vpdEdgePoints[i].x + 5, m_Circle->m_vpdEdgePoints[i].y);

		DisplayEdgePoints[j + 1] = new QGraphicsLineItem(m_Circle->m_vpdEdgePoints[i].x,
			m_Circle->m_vpdEdgePoints[i].y - 5, m_Circle->m_vpdEdgePoints[i].x, m_Circle->m_vpdEdgePoints[i].y + 5);

		DisplayEdgePoints[j]->setPen(mPen);
		DisplayEdgePoints[j]->setFlag(QGraphicsItem::ItemIsMovable, false);

		DisplayEdgePoints[j + 1]->setPen(mPen);
		DisplayEdgePoints[j + 1]->setFlag(QGraphicsItem::ItemIsMovable, false);

		scene->addItem(DisplayEdgePoints[j]);
		scene->addItem(DisplayEdgePoints[j + 1]);
		j += 2;
	}
	//不参加拟合边缘点（红色）
	mPen = QPen(Qt::red);
	for (size_t i = 0; i < m_Circle->m_vpdExcepetEdgePoints.size(); i++)
	{
		DisplayEdgePoints[j] = new QGraphicsLineItem(m_Circle->m_vpdExcepetEdgePoints[i].x - 5,
			m_Circle->m_vpdExcepetEdgePoints[i].y, m_Circle->m_vpdExcepetEdgePoints[i].x + 5, m_Circle->m_vpdExcepetEdgePoints[i].y);

		DisplayEdgePoints[j + 1] = new QGraphicsLineItem(m_Circle->m_vpdExcepetEdgePoints[i].x,
			m_Circle->m_vpdExcepetEdgePoints[i].y - 5, m_Circle->m_vpdExcepetEdgePoints[i].x, m_Circle->m_vpdExcepetEdgePoints[i].y + 5);


		DisplayEdgePoints[j]->setPen(mPen);
		DisplayEdgePoints[j]->setFlag(QGraphicsItem::ItemIsMovable, false);

		DisplayEdgePoints[j + 1]->setPen(mPen);
		DisplayEdgePoints[j + 1]->setFlag(QGraphicsItem::ItemIsMovable, false);

		scene->addItem(DisplayEdgePoints[j]);
		scene->addItem(DisplayEdgePoints[j + 1]);
		j += 2;
	}


	//打印圆信息
	double _CenterX = pdCenter.x;
	QString str = QString::number(_CenterX, 'f', 5);
	ui->Centre_X->setText(str);
	double _CenterY = pdCenter.y;
	str = QString::number(_CenterY, 'f', 5);
	ui->Centre_Y->setText(str);
	double _Radiu = dRadius;
	str = QString::number(_Radiu, 'f', 5);
	ui->Radius->setText(str);
}




void DyConcentricArc::FitCircle(Point2d& pdCenter, double& dRadius, int nFitMethod)
{

	/**
	 *拟合圆
	 *首先，在原始图片m_mInputMat的基础上创建一个掩码图像(mask)，然后用这个掩码图像从原图中提取出感兴趣的区域(RoiMat)。遮罩图像中的感兴趣区域是一个圆形，圆心为m_pdCenter，半径为m_dRadius加上一个测量长度的一半。
     *清空存在的边缘点(m_vpdEdgePoints)和边缘梯度(m_vdEdgeGradient)。
     *将输入图像转换为灰度图，如果输入图像是多通道的话。
     *使用多线程技术处理图像中的每一个边缘点。工作线程的数量是等于m_vpdEquinoxPoints的大小，也就是边缘点的数量。每一个线程会处理m_vpdEquinoxPoints中的一部分数据，然后提取这部分数据的边缘点和边缘梯度。
     *最后，合并所有线程的结果，然后进行RANSAC过滤(RansacCircleFiler)来去除异常的边缘点。根据输入参数nFitMethod的值来选择拟合圆形的方法，0代表最小二乘法(FitCircleWithLeastSquare)，1代表Hype法(FitCircleWithHype)。
	*/

	//创建一个新的图像矩阵和掩模矩阵，所有元素初始化为0
	Mat RoiMat = Mat::zeros(m_mInputMat.size(), m_mInputMat.type());
	Mat mask = Mat::zeros(m_mInputMat.size(), CV_8U);
	//在mask上画一个圆，圆心是m_pdCenter，半径是m_dRadius + m_dMeasureLength * 0.5 + 10，颜色是白色（255），填充整个圆（因为线厚度为-1）
	circle(mask, m_pdCenter, m_dRadius + m_dMeasureLength * 0.5 + 10, Scalar(255), -1);
	//将输入图像按照mask指定的区域复制到RoiMat
	m_mInputMat.copyTo(RoiMat, mask);

	//清空存储边缘点和边缘梯度的向量
	m_vpdEdgePoints.clear();
	m_vdEdgeGradient.clear();

	//获取边缘点的数量
	int m = m_vpdEquinoxPoints.size();
	m_vpdEdgePoints.reserve(m);
	m_vdEdgeGradient.reserve(m);

	//定义向量用于存储一维边缘结果
	vector<Edge1D_Result>edges;
	//转灰度图
	if (RoiMat.channels() > 1)
	{
		cvtColor(RoiMat, RoiMat, COLOR_BGR2GRAY);
	}

	//定义一个线程向量，大小为边缘的的数量
	const int num_threads = m;
	std::vector<std::thread> threads(num_threads);

	//定义两个向量，用于存各个线程处理的边缘点和边缘梯度的结果
	std::vector<std::vector<cv::Point2d>> edge_points(num_threads);
	std::vector<std::vector<double>> edge_gradients(num_threads);

	//对每个线程分配任务，调用process_edges函数处理边缘点
	//得出边缘点和梯度信息的结果
	for (int i = 0; i < num_threads; i++)
	{
		int start_idx = i * m / num_threads;
		int end_idx = (i + 1) * m / num_threads;
		threads[i] = std::thread(process_edges, std::ref(RoiMat), 
			std::ref(m_vpdEquinoxPoints), m_dMeasureLength, m_dMeasureHeight, m_dSigma, m_nThresholdCircle, 
			m_nTranslationCircle, std::ref(m_vdMeasureAngle),std::ref(edge_points[i]), std::ref(edge_gradients[i]), 
			start_idx, end_idx, Extract1DEdgeCircle, m_nSelectionCircle);
	}
	//等待所有线程结束，并将所有结果合并
	for (int i = 0; i < num_threads; i++)
	{
		threads[i].join();
		// 合并结果
		m_vpdEdgePoints.insert(m_vpdEdgePoints.end(), edge_points[i].begin(), edge_points[i].end());
		m_vdEdgeGradient.insert(m_vdEdgeGradient.end(), edge_gradients[i].begin(), edge_gradients[i].end());
	}


	/*for (int i = 0; i < m; i++)
	{
		edges = Extract1DEdgeCircle.Get1DEdge(RoiMat, m_vpdEquinoxPoints[i], m_dMeasureLength, m_dMeasureHeight, m_vdMeasureAngle[i]
			, m_dSigma, m_nThresholdCircle, m_nTranslationCircle == 1 ? Translation::Poisitive : Translation::Negative,
			m_nSelectionCircle == 1 ? Selection::Strongest :m_nSelectionCircle == 2 ? Selection::Fisrt : Selection::Last);
		for (int i = 0; i < edges.size(); i++)
		{
			m_vpdEdgePoints.push_back(edges[i].m_pdEdgePoint);
			m_vdEdgeGradient.push_back(edges[i].m_dGradient);

		}
	}*/

	//若无边缘点，直接返回
	if (m_vpdEdgePoints.size() == 0)
	{
		return;
	}
	//RANSAC随机样本一致性拟合算法来过滤边缘点
	RansacCircleFiler(m_vpdEdgePoints, m_vpdExcepetEdgePoints, m_dFiltrate);

	//移除边缘点结果中的异常点
	for (Point2d point : m_vpdExcepetEdgePoints)//remove the excepted points.
	{
		for (int i = 0; i < m_vpdEdgePoints.size(); i++)
		{
			if (point == m_vpdEdgePoints[i])
			{
				m_vpdEdgePoints.erase(m_vpdEdgePoints.begin() + i);
				break;
			}
		}
	}
    
	//根据参数选择，采用最小二乘法拟合圆 或采用Hype方法拟合圆
	if (nFitMethod == 0)
	{
		FitCircleWithLeastSquare(m_vpdEdgePoints, pdCenter, dRadius);
	}
	else if (nFitMethod == 1)
	{
		FitCircleWithHype(m_vpdEdgePoints, pdCenter, dRadius);
	}



	//else
	//{
	//	vector<Point2f>vpfEdgePoints(m_vpdEdgePoints.begin(), m_vpdEdgePoints.end());
	//	RotatedRect rRect = fitEllipse(vpfEdgePoints);
	//	pdCenter = rRect.center;
	//	dRadius = rRect.size.width*0.5;
	//}

}


关键的算法是RANSAC和通过三点确定一个圆。通过这个函数，我们可以从给定的点集中找出一个最佳的圆，并找出这个圆以外的离群点。


void DyConcentricArc::RansacCircleFiler(const vector<Point2d>& points, vector<Point2d>& vpdExceptPoints, double sigma)
{

	/**
	 *检测并过滤圆中的2D点
	*/
	unsigned int n = points.size();

	if (n < 3)
	{
		return;
	}
	
	RNG random;

	//初始化最佳得分为-1
	double bestScore = -1.; 
	//创建一个临时的Point2d向量，用于在每次迭代中存储不在当前估计的圆上的点
	vector<Point2d>vpdTemp;
	//设置RANSAC的迭代次数。函数使用了一个公式计算迭代次数，以确保有99%的概率能够找到一个好的模型
	int iterations = log(1 - 0.99) / (log(1 - (1.00 / n)));


	/**
	 *对每次迭代：
     *从点集中随机选择三个点，确保这三个点不在一条直线上（即斜率互不相等）。
     *使用这三个点计算出一个圆（这是通过求解两条垂直平分线的交点来实现的）。
     *然后，对所有的点，检查每个点到圆心的距离与半径的差值，如果差值的绝对值小于设定的阈值sigma，则认为这个点在圆上，否则认为是离群点。
     *如果在圆上的点数大于之前任何一次迭代，就更新最佳得分，并更新离群点集合，这些离群点是被过滤掉的点。
	*/
	for (int k = 0; k < iterations; k++)
	{
		//初始化三个索引变量，这些索引将用于随机选择三个点
		int i1 = 0, i2 = 0, i3 = 0;
		//初始化三个2D点，这些点的坐标将基于上述随机选择的索引从points中获取。
		Point2d p1(0, 0), p2(0, 0), p3(0, 0);
		//进入一个无限循环，该循环将持续直到找到三个不同的点且这些点不在一条直线上
		while (true)
		{
			//使用随机数生成器从points中随机选择三个点的索引。
			i1 = random(n);
			i2 = random(n);
			i3 = random(n);
			//确保所选的三个索引是不同的，即确保选择了三个不同的点。
			if ((i1 != i2 && i1 != i3 && i2 != i3))
			{
				//确保这三个点不在一条直线上，即它们的y坐标不能相等
				if ((points[i1].y != points[i2].y) && (points[i1].y != points[i3].y))
				{
					break;
				}
			}
		}
		//使用所选索引从points中获取三个点的坐标
		p1 = points[i1];
		p2 = points[i2];
		p3 = points[i3];

		//use three points to caculate a circle
		//计算点p1和p2的中心点
		Point2d pdP12 = GetPPCenter(p1, p2);
		//计算通过点p1和p2的线的斜率的倒数，然后取其负值。这是因为我们要找到这条线的垂直平分线
		double dK1 = -1 / GetLineSlope(p1, p2);
		//计算垂直平分线的y截距。这是通过将中心点pdP12代入垂直平分线的方程y = kx + b得到的。
		double dB1 = pdP12.y - dK1 * pdP12.x;
		//计算点p1和p3的中心点
		Point2d pdP13 = GetPPCenter(p1, p3);
		//计算通过点p1和p3的线的斜率的倒数，然后取其负值
		double dK2 = -1 / GetLineSlope(p1, p3);
		//计算第二条垂直平分线的y截距
		double dB2 = pdP13.y - dK2 * pdP13.x;
		//初始化圆心点
		Point2d pdCenter(0, 0);
		//计算圆心的x坐标，这是通过求解两条垂直平分线的交点得到的，计算圆心的y坐标。
		pdCenter.x = (dB2 - dB1) / (dK1 - dK2);
		pdCenter.y = dK1 * pdCenter.x + dB1;
		//计算半径，即圆心到任意一个点（这里选择了p1）的距离。
		double dR = GetPPDistance(pdCenter, p1);
		//初始化得分为0，得分是指在当前估计的圆上的点的数量
		double score = 0;
		vpdTemp.clear();
		for (int i = 0; i < n; i++)
		{
			//计算每个点到圆心的距离与半径的差值
			double d = dR - GetPPDistance(points[i], pdCenter);
			//如果差值的绝对值小于给定的阈值sigma，则认为此点在圆上，得分加1。否则，将此点添加到临时点集中
			if (fabs(d) < sigma)
			{
				score += 1;
			}
			else
			{
				vpdTemp.push_back(points[i]);
			}
		}
		//如果当前的得分大于最佳得分，则更新最佳得分，并更新离群点集合
		if (score > bestScore)
		{
			bestScore = score;
			vpdExceptPoints = vpdTemp;
		}
	}
}



void DyConcentricArc::FitCircleWithHype(vector<Point2d> pdPoints, Point2d& pdCenter, double& dRadius)
{
	/**
	*使用迭代的方法通过最小二乘法拟合一系列二维点到一个圆上，得到圆心和半径
	*实际上是基于代数圆拟合（Algebraic Circle Fitting）：
	*首先，构建一个代数方程，描述数据点与假设圆之间的误差，误差：每个数据点到圆上最近点的距离的平方
	*目标是找到最佳的圆心和半径，使所有数据点的误差之和最小：
	*1.计算所有数据点坐标的均值，并将所有点中心化（将所有点的坐标都减去均值，使得新的所有的点的坐标都集中在原点）
	*2.计算所有点与某些值的累加和包括x坐标的平方、y坐标的平方、x坐标与y坐标的乘积、x坐标与点到原点的距离平方的乘积、y坐标与点到原点的距离平方的乘积以及点到原点的距离的四次方
	*3.基于以上计算结果，构建一个描述误差的平方和关于圆心位置和半径的多项式方程
	*4.使用优化算法（如牛顿法）找到使得误差最小的圆心位置和半径
	*/


	int nSize = pdPoints.size();
	if (nSize < 3)
	{
		return;
	}

	//定义用于计算的变量，分别用于存x和y的坐标，存x和y坐标的平均值
	vector<double>vdX;
	vector<double>vdY;
	double dMeanX = 0, dMeanY = 0;

	//将每个点x和y坐标添加到相应的容器中，并计算x和y坐标的总和
	for (Point2d p : pdPoints)
	{
		vdX.push_back(p.x);
		vdY.push_back(p.y);
		dMeanX += p.x;
		dMeanY += p.y;
	}
	//计算x和y坐标的均值
	dMeanX /= (nSize * 1.);
	dMeanY /= (nSize * 1.);

	//Xi, Yi, Zi用于存储矫正后的坐标和到原点的距离
	double Xi = 0, Yi = 0, Zi = 0;
	//Mz, Mxy, Mxx, Myy, Mxz, Myz, Mzz用于存储各种需要计算的和
	double Mz = 0, Mxy = 0, Mxx = 0, Myy = 0, Mxz = 0, Myz = 0, Mzz = 0, Cov_xy = 0, Var_z = 0;
	double A0 = 0, A1 = 0, A2 = 0, A22 = 0;
	double Dy = 0, xnew = 0, x = 0, ynew = 0, y = 0;
	double DET = 0, Xcenter = 0, Ycenter = 0;
	//中心化，首先计算每个点的中心坐标（x和y坐标分别减去其均值），然后计算这个点到原点的距离的平方（Zi）
	for (int i = 0; i < nSize; i++)
	{
		Xi = vdX[i] - dMeanX;   //  centered x-coordinates
		Yi = vdY[i] - dMeanY;   //  centered y-coordinates
		Zi = Xi * Xi + Yi * Yi;

		Mxy += Xi * Yi;
		Mxx += Xi * Xi;
		Myy += Yi * Yi;
		Mxz += Xi * Zi;
		Myz += Yi * Zi;
		Mzz += Zi * Zi;
	}
	//各项和的平均值
	Mxx /= (nSize * 1.);
	Myy /= (nSize * 1.);
	Mxy /= (nSize * 1.);
	Mxz /= (nSize * 1.);
	Myz /= (nSize * 1.);
	Mzz /= (nSize * 1.);

	/**
	*计算Mz：所有点x和y的坐标平方和的平均值之和
	*Cov_xy ：x和y坐标的协方差
	*Var_z：所有点到原点距离的方差
	*/
	Mz = Mxx + Myy;
	Cov_xy = Mxx * Myy - Mxy * Mxy;
	Var_z = Mzz - Mz * Mz;


	//计算特征多项式的系数
	A2 = 4.0 * Cov_xy - 3.0 * Mz * Mz - Mzz;
	A1 = Var_z * Mz + 4.0 * Cov_xy * Mz - Mxz * Mxz - Myz * Myz;
	A0 = Mxz * (Mxz * Myy - Myz * Mxy) + Myz * (Myz * Mxx - Mxz * Mxy) - Var_z * Cov_xy;
	A22 = A2 + A2;


	/**
	 *使用牛顿迭代法找到特征多项式的根x（半径值），这个根使得误差平方和最小
	 *牛顿法是一种迭代法，用于寻找函数的零点或极值
	*/
	x = 0., y = A0;//迭代的初始值，A0是特征多项式的系数
	//
	for (int i = 0; i < 99; i++)  // usually, 4-6 iterations are enough
	{
		//计算了函数在当前点x处的导数dy
		Dy = A1 + x * (A22 + 16. * x * x);

		//用牛顿法的公式更新了x的值
		//公式为：x(t+1) = x(t) - f(x(t))/f'(x(t))，其中f为函数，f'为函数的导数，t表示迭代的次数
		xnew = x - y / Dy;
		//检查新的x值(xnew)是否与旧的x值相同或者xnew是否无限大。如果满足这些条件，则停止迭代
		if ((xnew == x) || (!isfinite(xnew)))
		{
			break;
		}
		//使用新的xnew计算新的y值
		ynew = A0 + xnew * (A1 + xnew * (A2 + 4.0 * xnew * xnew));

		//检查新的y值(ynew)的绝对值是否大于或等于旧的y值的绝对值。如果满足这个条件，则停止迭代
		if (abs(ynew) >= abs(y))
		{
			break;
		}
		//更新x和y的值，进入下一轮迭代
		x = xnew;  y = ynew;
	}

	//求解出的圆心坐标和半径
	DET = x * x - x * Mz + Cov_xy;
	Xcenter = (Mxz * (Myy - x) - Myz * Mxy) / DET / 2.0;
	Ycenter = (Myz * (Mxx - x) - Mxz * Mxy) / DET / 2.0;

	//计算最有圆心位置和半径
	dRadius = sqrt(Xcenter * Xcenter + Ycenter * Ycenter + Mz - x - x);
	pdCenter = Point2d(Xcenter + dMeanX, Ycenter + dMeanY);

}




void DyConcentricArc::FitCircleWithLeastSquare(vector<Point2d> pdPoints, Point2d& pdCenter, double& dRadius)
{
	/**
	 *通过最小二乘法你和一个圆，输入是一组二维点，输出是拟合的圆心坐标和圆半径
	 *
	*/
	int nSize = pdPoints.size();
	//点数小于3，没有足够的信息来拟合圆
	if (nSize < 3)
	{
		return;
	}
	//定义变量用于计算，将用于存储各种点的坐标和它们乘积的和
	double X1 = 0.0;
	double Y1 = 0.0;
	double X2 = 0.0;
	double Y2 = 0.0;
	double X3 = 0.0;
	double Y3 = 0.0;
	double X1Y1 = 0.0;
	double X1Y2 = 0.0;
	double X2Y1 = 0.0;

	//对所有边缘数据点，计算并累加，这些变量是为了后续求误差的
	for (Point2d p : pdPoints)
	{
		X1 = X1 + p.x;  //每次累加x分量
		Y1 = Y1 + p.y;  //每次累加y分量
		X2 = X2 + p.x * p.x;  //每次累加x分量的平方
		Y2 = Y2 + p.y * p.y;  //每次累加y分量的平方
		X3 = X3 + p.x * p.x * p.x;  //每次累加x分量的3次方
		Y3 = Y3 + p.y * p.y * p.y;  //每次累加y分量的3次方
		X1Y1 = X1Y1 + p.x * p.y;    //每次累加x分量乘以y分量
		X1Y2 = X1Y2 + p.x * p.y * p.y;  //每次累加x分量乘以y分量的平方
		X2Y1 = X2Y1 + p.x * p.x * p.y;  //每次累加y分量乘以x分量的平方
	}

	//定义新的变量，基于前面计算的各种和的表达式
	double C = 0.0;
	double D = 0.0;
	double E = 0.0;
	double G = 0.0;
	double H = 0.0;
	double a = 0.0;
	double b = 0.0;
	double c = 0.0;
	//误差的平方和：E(a, b, r) = ∑[(xi - a)^2 + (yi - b)^2 - r^2]^2
	C = nSize * X2 - X1 * X1;
	D = nSize * X1Y1 - X1 * Y1;
	E = nSize * X3 + nSize * X1Y2 - (X2 + Y2) * X1;
	G = nSize * Y2 - Y1 * Y1;
	H = nSize * X2Y1 + nSize * Y3 - (X2 + Y2) * Y1;
	//求解E（a,b,r）关于a,b,r的偏导数，令偏导数等于0，得到方程组的最优解
	a = (H * D - E * G) / (C * G - D * D);
	b = (H * C - E * D) / (D * D - G * C);
	c = -(a * X1 + b * Y1 + X2 + Y2) / nSize;

	double A = 0.0;
	double B = 0.0;
	double R = 0.0;

	//计算A,B,R，分别代表拟合的圆心的x坐标，y坐标和半径
	A = a / (-2);
	B = b / (-2);
	R = double(sqrt(a * a + b * b - 4 * c) / 2);
	pdCenter.x = A;
	pdCenter.y = B;
	dRadius = R;
}

