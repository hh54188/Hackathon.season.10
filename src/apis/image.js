define (["./notify"], function (Notify) {

	var $ = document.querySelector;
	var hasInit = false;

	var doms = {

		// 按钮：
		nextBtn: document.querySelector(".img-next"), // 下一张图片
		prevBtn: document.querySelector(".img-prev"), // 上一张图片
		slideNextBtn: document.querySelector(".slider-btn-next"), // 列表下一页
		slidePrevBtn: document.querySelector(".slider-btn-prev"), // 列表前一页
		zoomInBtn: document.querySelector("#btnZoomIn"), // 放大
		zoomOutBtn: document.querySelector("#btnZoomOut"), // 缩小
		pullHandler: document.querySelector(".album-handler"), // 是否显示列表

		// 容器：
		img: document.querySelector("#srcPic img"), // 当前显示的图片
		ad: document.querySelector("#sider"), // 右侧广告栏
		header: document.querySelector("#header"), // 顶栏
		dock: document.querySelector(".album-pnl") // 图片列表		
	}

	// 检验以上DOM元素是否都存在
	function check() {
		for (var el in doms) {
			if (!doms[el]) {
				return false;
				console.debug("LACK SOME ELEMENTS");
			}
		}
		return true;
	}

	// 初始化	
	if (!hasInit && check()) {

		document.body.style.perspective = "1000px";
		var imgTarget = doms.img; 

		imgTarget.style.transformStyle = "preserve-3d";
		imgTarget.style.transition = "all .1s";

		Notify.log("初始化完成");
		console.debug("API INIT CONPLETE");
		hasInit = true;
	} else {
		Notify.log("初始化失败");
		console.debug("API INIT FAILED");
		return false;
	}

	var emptyFn = function () {
		console.debug("NO API");
	}

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

		// target.style.transition = "all .1s";
		target.style.transform = generateTransform(); 
	}

	return {

		threed: {

			translate: function (deltaX, deltaY, deltaZ) {
				
				translateX += deltaX;
				translateY -= deltaY;
				translateZ += deltaZ;

				var target = doms.img;
				target.style.transform = generateTransform();
			},

			rotate: function (deltaRotate) {
				rotateZ += deltaRotate;
				var target = doms.img;
				target.style.transform = generateTransform();
			}
		},

		/**
		 * 初始化页面, 给容器添加3d属性
		 */
		init: function () {
			var body = document.body;
			body.style.perspective = "1000px";
			doms.img.style.transformStyle = "preserve-3d";
		},

		/**
		 * 切换至下p一张图片
		 */
		nextImage: function () {
			doms.nextBtn.click();
			reset(doms.img);
		},
		
		/**
		 * 切换至前一张图片
		 */
		prevImage: function () {
			doms.prevBtn.click();
			reset(doms.img);
		},

		/**
		 * 拉起列表
		 */
		pullUpDock: function () {
			doms.pullHandler.click();
		},

		/**
		 * 收起列表
		 */
		pullDownDock: function () {
			doms.pullHandler.click();
		},

		/**
		 * 列表下一页
		 */
		slideToNext: function () {
			doms.slideNextBtn.click();
		},

		/**
		 * 列表前一页
		 */
		slideToPrev: function () {
			doms.slidePrevBtn.click();
		},

		/**
		 * 放大
		 */
		zoomIn: function () {
			doms.zoomInBtn.click();
		},

		/**
		 * 缩小
		 */
		zoomOut: function () {
			doms.zoomOutBtn.click();
		}
	}
});