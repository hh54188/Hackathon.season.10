if (!$) {
	console.error("$ expected!");
	return;	
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
	rotateZ = 0;

function generateTransform () {
	return "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg)";
}

window.API = {

	init: function () {
		var body = document.body;
		body.style.perspective = "1000px";

		img.style.transformStyle = "preserve-3d";
		// img.style.transform
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