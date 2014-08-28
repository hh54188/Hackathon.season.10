define (function () {
	if (!$) {
		console.error("$ expected!");
		return false;	
	} 

	// 按钮：

	var nextBtn = $(".img-next"); // 下一张图片
	var prevBtn = $(".img-prev"); // 上一张图片

	var slideNextBtn = $(".slider-btn-next"); // 列表下一页
	var slidePrevBtn = $(".slider-btn-prev"); // 列表前一页

	var zoomInBtn = $("#btnZoomIn"); // 放大
	var zoomOutBtn = $("#btnZoomOut"); // 缩小

	var pullHandler = $(".album-handler"); // 是否显示列表

	// 容器：

	var img = $("#srcPic img"); // 当前显示的图片
	var ad = $("#sider"); // 右侧广告栏
	var header = $("#header"); // 顶栏
	var dock = $(".album-pnl"); // 图片列表


	var rotateX = 0,
		rotateY = 0,
		rotateZ = 0,
		translateX = 0,
		translateY = 0,
		translateZ = 0;

	function generateTransform () {

		return [
			"translateX(" + translateX + "px)",
			"translateY(" + translateY + "px)",
			"translateZ(" + translateZ + "px)",
			"rotateX(" + rotateX + "deg)",
			"rotateY(" + rotateY + "deg)",
			"rotateZ(" + rotateZ + "deg)"
		].join(" ");
	}

	return {

		threed: {

			zoomIn: function () {
				translateZ++;
				img.style.transform = generateTransform();
			},

			zoomOut: function () {
				translateZ--;
				img.style.transform = generateTransform();
			},

			translateOnSurface: function (xAct, yAct) {

				translateX = xAct? ++translateX: --translateX;
				translateY = yAct? ++translateY: --translateY;

				img.style.transform = generateTransform();
			},

			rotateOn3d: function () {
				// TODO	
			}
		},

		/**
		 * 初始化页面, 给容器添加3d属性
		 */
		init: function () {
			var body = document.body;
			body.style.perspective = "1000px";
			img.style.transformStyle = "preserve-3d";
		},

		/**
		 * 切换至下一张图片
		 */
		nextImage: function () {
			nextBtn.click();
		},
		
		/**
		 * 切换至前一张图片
		 */
		prevImage: function () {
			prevBtn.click();
		},

		/**
		 * 拉起列表
		 */
		pullUpDock: function () {
			pullHandler.click();
		},

		/**
		 * 收起列表
		 */
		pullDownDock: function () {
			pullHandler.click();
		},

		/**
		 * 列表下一页
		 */
		slideToNext: function () {
			slideNextBtn.click();
		},

		/**
		 * 列表前一页
		 */
		slideToPrev: function () {
			slidePrevBtn.click();
		},

		/**
		 * 放大
		 */
		zoomIn: function () {
			zoomInBtn.click();
		},

		/**
		 * 缩小
		 */
		zoomOut: function () {
			zoomOutBtn.click();
		}
	}
});