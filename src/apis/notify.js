define (["./lib/message"], function () {

	return {
		log: function (msg) {
			dhtmlx.message(msg);
		}
	}
});