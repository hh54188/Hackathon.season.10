define(["../apis/image"], function (ImageAPI) {
	
	function entry (controller, frame) {

		if (!controller) {
			return;
		}

		// var frame = controller.frame();

		// 可能当前取得的值已经不是右手了？
		// 需要修改了
		var rightHand = frame.hands[0];

		if (rightHand.type == "left") {
			return;
		}

		var interactionBox = frame.interactionBox;
		var normalizedPosition = interactionBox.normalizePoint(rightHand.palmPosition, true);

		var docWidth = window.innerWidth;
		var docHeight = window.innerHeight;

		var halfWidth =  docWidth / 2;
		var halfHeight = docHeight / 2;

		var translateX = docWidth * normalizedPosition[0] - halfWidth;
		var translateY = docHeight * (1 - normalizedPosition[1]) - halfHeight;

		ImageAPI.threed.translate(translateX, translateY);
	}

	return entry
});