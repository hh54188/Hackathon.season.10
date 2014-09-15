define(function () {

	function TranslateGesture () {

	}

	TranslateGesture.prototype.validate = function  (controller) {
		if (!controller) return;

		var curFrame = controller.frame();
		var hands = curFrame.hands;

		//  只允许有一只手
		if (!hands.length || hands.length == 2) {
			return false;
		}

		// 只允许是右手
		if (hands[0].type == "left") {
			return false;
		}

		var rightHand = hands[0];
		
		if (rightHand.grabStrength == 0) {
			return true;
		}

		return false;
	};

	return TranslateGesture;
});