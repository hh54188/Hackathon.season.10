define(["../apis/image",
        "../apis/notify"], 
function (ImageAPI, Notify) {

	function entry () {
		console.debug("DOCK RISE");
		ImageAPI.pullUpDock();
	}

	return entry;
});