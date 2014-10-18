define (function () {

	var menu = document.createElement("div");
	menu.innerHTML = [
		'<div class="menu">',
			'<div class="menu-wrap">',
				'<ul>',
					'<li class="menu-item">菜单1</li>',
					'<li class="menu-item">菜单2</li>',
					'<li class="menu-item">菜单3</li>',
				'</ul>',
			'</div>',
		'</div>'
	].join("");

	var undercover = document.createElement("div");
	undercover.style.cssText = "z-index:999;width:100%;height:100%;background:black;opacity:0.8;position:fixed;left:0;top:0";

	var hasInit = false;
	function injectStyle () {
		var head = document.head;
		var cssText = ".menu{z-index:999999;perspective:800px;width:300px;height:420px;position:fixed;left:50%;margin-left:-150px;top:50%;margin-top:-210px;}.menu-item{height:140px;border-bottom:3px solid white;}.menu-item-hover{box-shadow:0 0 10px inset;}.menu-item:last{border-bottom:none;}.menu-wrap{width:100%;height:100%;transform-style:preserve-3d;transition:all .2s;background:skyblue;}";
		var styleBlock = document.createElement("style");
		styleBlock.innerHTML = cssText;
		head.appendChild(styleBlock);
	}
	if (!hasInit) {
		injectStyle();
		hasInit = true;
	}

	return {
		init: function () {
			document.body.appendChild(undercover);
			document.body.appendChild(menu);
		},
		destory: function () {
			console.debug("DESTORY");
			document.body.removeChild(menu);
			document.body.removeChild(undercover);
		}
	}
});