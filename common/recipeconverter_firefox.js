/**
 * @author Teppo Kankaanpää
 */


//alert("3");



var recipeConverter = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
include(recipeconverter_include.js)

	function autoConvert(aEvent) {
		var autoRun = prefManager.getBoolPref("extensions.recipeconverter.autorun");
//				var autoRun = true;
//			alert ("aa");
		if (autoRun && aEvent.originalTarget && aEvent.originalTarget.body && aEvent.originalTarget.nodeName == "#document") {
//			if (autoRun) {
			traverseChildNodes(aEvent.originalTarget.body);
//				recipeConverter.run(aEvent.originalTarget);
		}
	};

	return {
		
		
		
		'statusBarIcon': null,
		'statusBarGlow': false,

		
		toggle : function() {
//			alert("myy");
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
				if (recipeConverter.statusBarGlow) {
			        recipeConverter.statusBarIcon.setAttribute('value', 'active-glow');
				} else {
			        recipeConverter.statusBarIcon.setAttribute('value', 'active-noglow');				
				}
			} else {
				if (recipeConverter.statusBarGlow) {
			        recipeConverter.statusBarIcon.setAttribute('value', 'inactive-glow');
				} else {
			        recipeConverter.statusBarIcon.setAttribute('value', 'inactive-noglow');				
				}
			}
		},
		
		init : function () {


	        recipeConverter.statusBarIcon = document.getElementById('recipe-converter-status-bar-icon');
//   			recipeConverter.statusBarIcon.addEventListener('click',
//            	recipeConverter.toggle, false);
			recipeConverter.setStatusbar();

	        if(gBrowser) gBrowser.addEventListener("DOMContentLoaded", autoConvert, false);
//	        if(gBrowser) gBrowser.addEventListener("load", recipeConverter.autoRun, true);
//	        if(gBrowser) gBrowser.addEventListener("load", recipeConverter.autoRun, false);
//			alert("bb");
		},

		run : function () {
			traverseChildNodes(content.document.body);
		},


		
	};
	
}();

window.addEventListener("load", recipeConverter.init, false);
