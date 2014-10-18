define (function () {

	var undercover = document.createElement("div");
	undercover.classList.add("undercover");

	undercover.innerHTML = [
		'<div class="leap-container">',
			'<ul class="list first-row">',
				'<li class="wrap"><img class="item" src="./apple.jpg"></li>',
				'<li class="wrap"><img class="item" src="./apple.jpg"></li>',
				'<li class="wrap"><img class="item" src="./apple.jpg"></li>',
				'<li class="wrap"><img class="item" src="./apple.jpg"></li>',
				'<li class="wrap"><img class="item" src="./apple.jpg"></li>',
			'</ul>',
			'<ul class="list second-row"></ul>',
		'</div>'
	].join("");

	var hasInit = false;
	if (!hasInit) {
		injectStyle();
		hasInit = true;
	}

	function injectStyle () {
		var head = document.head;
		var cssText = ".undercover{z-index:999999;background:black;position:fixed;left:0;top:0;width:100%;height:100%;opacity:0.9;perspective:800px;}.item{width:150px;height:100px;border:5px solid white;box-shadow:0 0 10px black;transform-style:preserve-3d;}.item:hover,.leap-hover{transform:translateZ(35px);transition:all .3s;}.leap-container{margin:120px auto 0;width:950px;transform-style:preserve-3d;transform:rotateY(10deg);transition:all .3s;}.wrap{float:left;margin:0 0 0 20px;}.list{width:100%;height:110px;display:block;margin-bottom:50px;}";
		var styleBlock = document.createElement("style");
		styleBlock.innerHTML = cssText;
		head.appendChild(styleBlock);
	}


	return {

		init: function () {
			document.body.appendChild(undercover);
		},

		destory: function () {
			document.body.removeChild(undercover);
		}
	}

});