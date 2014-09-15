define(function () {

	function TranslateGesture () {

	}

	TranslateGesture.prototype.validate = function  (controller, frame) {
		if (!controller) return;

		var hands = frame.hands;

		//  只允许有一只手
		if (!hands.length || hands.length == 2) {
			return false;
		}

		// 只允许是右手
		if (hands[0].type == "left") {
			return false;
		}

		var rightHand = hands[0];
		
		if (rightHand.grabStrength == 1) {
			return true;
		}

		return false;
	};

	return TranslateGesture;
});