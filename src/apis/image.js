define (["../lib/velocity"], function (Velocity) {

	var hasInit = false;
	if (!hasInit 
		&& $ 
		&& $("#srcPic") 
		&& $("#img-next") 
		&& $("#img-prev")) {

		document.body.style.perspective = "1000px";
		$("#srcPic img")[0].style.transformStyle = "preserve-3d";

		console.log("API INIT CONPLETE");
		hasInit = true;
	}

	var emptyFn = function () {
		console.log("NO API");
	}

	if (!window.$) {
		window.$ = emptyFn;
	} 


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

	function reset (target) {

		rotateX = 0,
		rotateY = 0,
		rotateZ = 0,
		translateX = 0,
		translateY = 0,
		translateZ = 0;

		target.style.transform = generateTransform(); 
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

			translate: function (x, y) {

				Velocity(img[0], {
					"translateX": x + "px",
					"translateY": y + "px"
				})
			},

			rotateOn3d: function () {
				
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
			reset();
		},
		
		/**
		 * 切换至前一张图片
		 */
		prevImage: function () {
			prevBtn.click();
			reset();
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