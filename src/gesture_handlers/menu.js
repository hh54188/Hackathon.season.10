define(["../apis/menu"], 
function (Menu) {  
 
	function entry (control, frame) {
		console.debug("MENU!");
		if (!window.ENABLE_MENU) {
			Menu.init();
			window.ENABLE_MENU = true;	
		} else {
			Menu.destory();
			window.ENABLE_MENU = false;
		}
		
	}

	return entry;
});