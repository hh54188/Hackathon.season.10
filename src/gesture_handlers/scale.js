define(["../apis/image"], function (ImageAPI) {
	
	function entry (controller, frame) {

		if (!controller) {
			return;
		}

		var rightHand = frame.hands[0];

		if (rightHand.type == "left") {
			return;
		}

		var interactionBox = frame.interactionBox;
		var normalizedPosition = interactionBox.normalizePoint(rightHand.palmPosition, true);

		var MAX_SCALE = 1000;
		ImageAPI.threed.zoom((normalizedPosition[2] - 0.5) * MAX_SCALE);
      	// img.style.transform = "translateZ(" + (normalizedPosition[2] - 0.5) * MAX_SCALE  + "px)"
	}

	return entry
});