/**
 * @author Teppo Kankaanpää
 */

if (window.top === window) {

include(recipeconverter_include.js)

	function run() {
		traverseChildNodes(document.body);
	};

	
	function getMessage(msgEvent) {
	    if (msgEvent.name == "settingValueIs") {
	        var autoRun = msgEvent.message;
	//		alert("got " + autoRun);
			if (autoRun) {
				
				run();
			}
		}
		if (msgEvent.name == "runNow") {
			run();
		}
	}

	safari.self.tab.dispatchMessage("getSettingValue", "autorun"); // ask for value
	safari.self.addEventListener("message", getMessage, false); // wait for reply
}

