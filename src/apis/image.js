define (function () {

	var hasInit = false;
	if (!hasInit 
		&& $ 
		&& $("#srcPic") 
		&& $(".img-next") 
		&& $(".img-prev")) {

		document.body.style.perspective = "1000px";
		var imgTarget = $("#srcPic img").length
			? $("#srcPic img")[0]
			: $("#srcPic img");

		imgTarget.style.transformStyle = "preserve-3d";
		imgTarget.style.transition = "all .1s";

		console.log("API INIT CONPLETE");
		hasInit = true;
	}

	var emptyFn = function () {
		console.log("NO API");
	}

	// if (!window.$) {
	// 	window.$ = emptyFn;
	// } 


	var emptyElement = {
		isFake: true,
		style: {},
		click: emptyFn
	}

	// 按钮：

	var nextBtn = $(".img-next") || emptyElement; // 下一张图片
	var prevBtn = $(".img-prev") || emptyElement; // 上一张图片

	var slideNextBtn = $(".slider-btn-next") || emptyElement; // 列表下一页
	var slidePrevBtn = $(".slider-btn-prev") || emptyElement; // 列表前一页

	var zoomInBtn = $("#btnZoomIn") || emptyElement; // 放大
	var zoomOutBtn = $("#btnZoomOut") || emptyElement; // 缩小

	var pullHandler = $(".album-handler") || emptyElement; // 是否显示列表

	// 容器：

	var img = $("#srcPic img") || emptyElement; // 当前显示的图片
	var ad = $("#sider") || emptyElement; // 右侧广告栏
	var header = $("#header") || emptyElement; // 顶栏
	var dock = $(".album-pnl") || emptyElement; // 图片列表


	var rotateX = 0,
		rotateY = 0,
		rotateZ = 0,
		translateX = 0,
		translateY = 0,
		translateZ = 0;

	var TRANS_TIMES = 2;

	function generateTransform () {

		return [
			"translateX(" + translateX * TRANS_TIMES + "px)",
			"translateY(" + translateY * TRANS_TIMES + "px)",
			"translateZ(" + translateZ * TRANS_TIMES + "px)",
			"rotateX(" + rotateX + "deg)",
			"rotateY(" + rotateY + "deg)",
			"rotateZ(" + rotateZ + "deg)"
		].join(" ");
	}

	function reset (target) {

		rotateX = 0,
		rotateY = 0,
		rotateZ = 0,
		translateX = 0,
		translateY = 0,
		translateZ = 0;

		target.style.transition = "all .1s";
		target.style.transform = generateTransform(); 
	}

	return {

		threed: {

			translate: function (deltaX, deltaY, deltaZ) {
				
				translateX += deltaX;
				translateY -= deltaY;
				translateZ += deltaZ;

				var target = img.length? img[0]: img;
				target.style.transform = generateTransform();
			},

			rotate: function () {
				
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
			reset(img.length? img[0]: img);
		},
		
		/**
		 * 切换至前一张图片
		 */
		prevImage: function () {
			prevBtn.click();
			reset(img.length? img[0]: img);
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