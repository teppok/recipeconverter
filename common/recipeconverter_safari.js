/**
 * @author Teppo Kankaanpää
 */

/*
 * Fluff for safari. This file is appended to all html files downloaded by Safari.
 * We check the autorun value by sending a message to the global.html requesting its
 * value (only global.html can see extension setting values). When we see it and it's
 * true, we convert the document.
 * 
 * This file requires m4 preprocessor so that the include statement is processed.
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

