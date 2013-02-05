/**
 * @author Teppo Kankaanpää
 */

/* Fluff for Firefox.
 * 
 * We wrap everything inside a variable to adhere to extension coding standard.
 * 
 * m4 preprocessor is required for this file to process the include statement.
 */


var recipeConverter = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
include(recipeconverter_include.js)

	/* autoConvert is set as a listener for the DOMContentLoaded event. We check if autoRun is on and if we're at the root node of a
	 * document. 
	 */

	function autoConvert(aEvent) {
		var autoRun = prefManager.getBoolPref("extensions.recipeconverter.autorun");
		if (autoRun && aEvent.originalTarget && aEvent.originalTarget.body && aEvent.originalTarget.nodeName == "#document") {
			traverseChildNodes(aEvent.originalTarget.body);
		}
	};

	/* Reference to the DOM node status bar icon. */
	
	var statusBarIcon = null;

	/* Public variables and methods. */

	return {
		
		toggle : function() {
			var autoRun2 = prefManager.getBoolPref("extensions.recipeconverter.autorun");
			prefManager.setBoolPref("extensions.recipeconverter.autorun", !autoRun2);

			if (!autoRun2) {
				recipeConverter.run();
			}
			recipeConverter.setStatusbar();
		},
		
		
		setStatusbar : function() {
			var autoRun = prefManager.getBoolPref("extensions.recipeconverter.autorun");
			if (autoRun) {
		        recipeConverter.statusBarIcon.setAttribute('value', 'active-noglow');				
			} else {
		        recipeConverter.statusBarIcon.setAttribute('value', 'inactive-noglow');				
			}
		},
		
		
		init : function () {
	        statusBarIcon = document.getElementById('recipe-converter-status-bar-icon');
			recipeConverter.setStatusbar();

	        if(gBrowser) gBrowser.addEventListener("DOMContentLoaded", autoConvert, false);
		},


		run : function () {
			traverseChildNodes(content.document.body);
		},
	};
	
}();

window.addEventListener("load", recipeConverter.init, false);
