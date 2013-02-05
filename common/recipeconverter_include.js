/**
 * @author Teppo Kankaanpää
 */

/*
 * Documented at parse function.
 */
	var CUTSIZE = 20;

/*
 * Conversions.
 */	

	var CUPTYPE = 1;
	var PTTYPE = 2;
	var QTTYPE = 3;
	var GALTYPE = 4;
	var OZTYPE = 5;
	var LBTYPE = 6;
	
	var conversions = [ { match: /^cup/, type: CUPTYPE, convertedType: "dl" },
				{ match: /^pt/, type: PTTYPE, convertedType: "dl" },
				{ match: /^pint/, type: PTTYPE, convertedType: "dl" },
				{ match: /^qt/, type: QTTYPE, convertedType: "dl" },
				{ match: /^quart/, type: QTTYPE, convertedType: "dl" },
				{ match: /^gal/, type: GALTYPE, convertedType: "dl" },
				{ match: /^oz/, type: OZTYPE, convertedType: "g" },
				{ match: /^ounce/, type: OZTYPE, convertedType: "g" },
				{ match: /^lb/, type: LBTYPE, convertedType: "g" },
				{ match: /^pound/, type: LBTYPE, convertedType: "g" },
	 ];
	 
	var bigmatch = /[ \t-](cup|pt|pint|qt|quart|gal|gallon|oz|ounce|lb|pound)s?\b/;

/*
 * Convert a value in a conversion type to its predetermined units.
 */

	function convert(value, type) {
		if (type == CUPTYPE) {
			return Math.round(value * 2.36588237 * 100) / 100;
		}
		if (type == PTTYPE) {
			return Math.round(value * 4.73176473 * 100) / 100;
		}
		if (type == QTTYPE) {
			return Math.round(value * 9.46352946 * 100) / 100;
		}
		if (type == GALTYPE) {
			return Math.round(value * 37.8541178 * 100) / 100;
		}
		if (type == OZTYPE) {
			return Math.round(value * 28.3495231 * 100) / 100;
		}
		if (type == LBTYPE) {
			return Math.round(value * 453.59237 * 100) / 100;
		}
		return value;
	};

/*
 * Parse a fractional representation (such as '1 1/2') of a number and return its
 * floating point value. If the number is not fractional, then just return that number.
 * 
 * If the number is somehow weird (for example 1 2 3), return an empty string.
 */
	
	function parseFractional(value) {
		var trimmed = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		//(value.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""));
		
		var parts = trimmed.split(/\s+/);
		
		if (parts.length > 2 || parts.length == 0 || trimmed == "") {
			return "";
		}
		if (parts.length == 1) {
			var fraction = parts[0].split("/");
			if (fraction.length == 0 || fraction.length > 2) {
				return "";
			}
			if (fraction.length == 1) {
				return parseFloat(trimmed);
			}
			var numer = parseFloat(fraction[0], 10);
			var denomin = parseFloat(fraction[1], 10);
			//alert("" + numer + " " + denomin + " " + (numer/denomin));
			return numer / denomin;
		}
		if (parts.length == 2) {
			var fraction = parts[1].split("/");
			if (fraction.length == 0 || fraction.length > 2) {
				return "";
			}
			if (fraction.length == 1) {
				return "";
			}
			var numer = parseFloat(fraction[0]);
			var denomin = parseFloat(fraction[1]);
			//alert("" + numer + " " + denomin + " " + (parseInt(parts[0]) + numer/denomin));
			return parseFloat(parts[0]) + numer/denomin;
		}
		return "";
	};

/*
 * Search recursively through the nodes in a DOM node for text nodes.
 */

	function traverseChildNodes(node) {
	 
	    var next;

	    if (node.nodeType === 1) {
	 
	        // (Element node)
	 		node = node.firstChild;
	        if (node) {
	            do {
	                // Recursively call traverseChildNodes
	                // on each child node
	                next = node.nextSibling;
	                traverseChildNodes(node);
	                node = next;
	            } while(node);
	        }
	 
	    } else if (node.nodeType === 3) {
	 
	        // (Text node)
	 
	        if (bigmatch.test(node.data)) {
				var tmpData = parse(node.data);
			 	if (tmpData) node.data = tmpData;
	        }
	    }
	};

/* This commented section is saved for future because we might want to add links to the text nodes at some point. */ 
	 
		//var temp = document.createElement('div');
 
	    //temp.innerHTML = recipeConverter.parse(textNode.data);
	    // temp.innerHTML is now:
	    // "\n    This order's reference number is <a href="/order/RF83297">RF83297</a>.\n"
	    // |_______________________________________|__________________________________|___|
	    //                     |                                      |                 |
	    //                 TEXT NODE                             ELEMENT NODE       TEXT NODE
	 
	    // Extract produced nodes and insert them
	    // before original textNode:
	    //alert("parsed: " + temp.innerHTML + ":" + temp.firstChild);
	    //while (temp.firstChild) {
	    //    alert(temp.firstChild.nodeType);
	    //    textNode.parentNode.insertBefore(textNode, temp.firstChild);
	    //}
	    // Logged: 3,1,3
	 
	    // Remove original text-node:
	    //textNode.parentNode.removeChild(textNode);

/*
 * Take a string argument, go through it and return a string where the units have been changed to
 * SI-units.
 * 
 * Return "" if nothing was changed.
 * 
 * First find using bigmatch index points where the string contains possible unit matches.
 * Then cut CUTSIZE many chars before that index to look for numbers and some accompanying text.
 * If we find numbers and some well behaving text, we replace them, otherwise we just ignore that
 * possible match.
 */

	function parse(body) {

		var cindex, currentCutSize, cutBegin, continueIndex;
		var smallSection, joinChar, smallAfterSection, smallAfterSplit, originalType;
		var matchId, i;
		var ofAIndex, lastNumIndex, lastNum, lastNumParsed;
		var toIndex, firstNumIndex, firstNum, firstNumParsed;
		var moreOfNum;
		var newFirstNum, newLastNum;
		
		var loop = 0;
		
		var newBody = "";
		var todoBody = body;
		var tmpBody;
		
		var conversionPerformed = false;
		
			while (loop < 200) {
				loop++;
				//alert (newBody + "-" + todoBody);
				
				cindex = todoBody.search(bigmatch);
				if (cindex == -1) {
					break;
				}		
				//alert("Loopy " + i + " " + conversions[i].match + " " + cindex);
				
				if (cindex < CUTSIZE) {
					currentCutSize = cindex;
				} else {
					currentCutSize = CUTSIZE;
				}

				/* smallsection contains CUTSIZE many chars before the bigmatch point */
				
				cutBegin = cindex - currentCutSize;
				smallSection = todoBody.substring(cutBegin, cindex);
//					alert(smallSection);
				
				/* joinChar is how the number joins to the unit: space, minus or tab. */
				
				joinChar = todoBody.substring(cindex, cindex + 1);

				/* smallAfterSection is the unit, plus maybe something. originalType is only the unit. 
				   continueIndex is where the text continues after the unit.
				 */
				// 9 = enough to fit " gallons"
				smallAfterSection = todoBody.substring(cindex + 1, cindex+9);

				smallAfterSplit = smallAfterSection.split(/\s/);
				originalType = smallAfterSplit[0];
				continueIndex = cindex + originalType.length + 1;

				matchId = -1;
				
				for (i = 0; i < conversions.length; i++) {
					if (smallAfterSection.search(conversions[i].match) == 0) {
						matchId = i;
						break;
					}
				}
//					alert("match: " + matchId);
				if (matchId == -1) {
					// Funny thing happened, big match matched, but not one of the small ones.
					// This is not supposed to happen, so just leave.
					break;
				}

				/* Prepare for a pattern "1/2 of a cup". */

				ofAIndex = smallSection.search(/ of an?$/);

				if (ofAIndex >= 0) {
					
					// After this:
					// originalType = "of a cup"
					// smallSection = for example. "asdf 1/8"
					
					originalType = smallSection.substring(ofAIndex + 1) + " " + originalType;
					smallSection = smallSection.substring(0, ofAIndex);
					
				}
//					alert(smallSection + "." + originalType);

//              xyz 10 to 11 cups
//                  | |   | +- cutting index
//                  | |   +- lastNumIndex
//                  | +- toIndex
//                  +- firstNumIndex

				
				lastNumIndex = smallSection.search(/[0-9][0-9.,/]*[ \t]*$/);
				
				if (lastNumIndex == -1) {
					newBody = newBody + todoBody.substring(0, continueIndex);
					todoBody = todoBody.substring(continueIndex);
					continue;
				}

				lastNum = smallSection.substring(lastNumIndex);

				if (lastNum.indexOf("/") >= 0) {
					// Fractional value on the last number. If joinchar is NOT -, take the previous
					// number as the whole number part of a fractional, ie. join it to the number.
					// If it is -, ignore. 
					// Example: 2 1/2-ounce cans of tomatoes.
					
					if (joinChar != "-") {
						moreOfNum = smallSection.substring(0, lastNumIndex).search(/[0-9][0-9.,]*[ \t]*$/);
						if (moreOfNum >= 0) {
							lastNumIndex = moreOfNum;
							lastNum = smallSection.substring(lastNumIndex);
						}							
					}						
				}
				
				lastNumParsed = parseFractional(lastNum);
				if (lastNumParsed == "") {
					newBody = newBody + todoBody.substring(0, continueIndex);
					todoBody = todoBody.substring(continueIndex);
					continue;
				}

//					if (i == 1) {
//						alert("" + lastNum + " " + lastNumParsed);
//					}

				/* Check for possible "1 to 2 cups" pattern. */

				toIndex = smallSection.substring(0, lastNumIndex).search(/-?[ \t]*([ \t]to|[ \t]or|[ \t]and|-)[ \t]*$/);

				if (toIndex != -1) {
					firstNumIndex = smallSection.substring(0, toIndex).search(/[0-9][0-9.,/]*-?[ \t]*$/);
				} else {
					firstNumIndex = -1;
				}
				
				
				if (firstNumIndex != -1) {
					/* If the pattern is a two-number pattern like "1 to 2 cups" */
					
					firstNum = smallSection.substring(firstNumIndex, toIndex);
					
					if (firstNum.indexOf("/") >= 0) {
						// Fractional value on the last number. If joinchar is NOT -, take the previous
						// number as the whole number part of a fractional, ie. join it to the number.
						// If it is -, ignore. 
						// Example: 2 1/2-ounce cans of tomatoes.
						
						if (joinChar != "-") {
							moreOfNum = smallSection.substring(0, firstNumIndex).search(/[0-9][0-9]*[ \t]*$/);
							if (moreOfNum >= 0) {
								firstNumIndex = moreOfNum;
								firstNum = smallSection.substring(firstNumIndex, toIndex);
							}
						}						
					}
					
					
					firstNumParsed = parseFractional(firstNum);
					
					if (firstNumParsed == "") {
						newBody = newBody + todoBody.substring(0, continueIndex);
						todoBody = todoBody.substring(continueIndex);
						continue;
					}
						
						
					newFirstNum = convert(firstNumParsed, conversions[matchId].type);
					newLastNum = convert(lastNumParsed, conversions[matchId].type);
					
					
					newBody = newBody + todoBody.substring(0, cutBegin) +
					    smallSection.substring(0, firstNumIndex) + 
					    newFirstNum + 
						smallSection.substring(toIndex, lastNumIndex) + 
						newLastNum + joinChar + conversions[matchId].convertedType +
						" (" +
					    firstNum + 
						smallSection.substring(toIndex, lastNumIndex) + 
						lastNum + joinChar + originalType + ")";
						
					todoBody = todoBody.substring(continueIndex);
					conversionPerformed = true;
						
				} else {
					/* If the pattern is one number pattern. */
					
					newLastNum = convert(lastNumParsed, conversions[matchId].type);
					
					newBody = newBody + todoBody.substring(0, cutBegin) +
					    smallSection.substring(0, lastNumIndex) + 
						newLastNum + joinChar + conversions[matchId].convertedType +
						" (" +
						lastNum + joinChar + originalType + ")";
					  
//							if (i == 1) { alert ("okay " + newLastNum); }
//							alert ("")
					todoBody = todoBody.substring(continueIndex);
					conversionPerformed = true;
				}
			}
			
			tmpBody = newBody + todoBody;
			newBody = "";
			todoBody = tmpBody;
			
		if (conversionPerformed) {
			return todoBody;
		} else {
			return "";
		}
	};
		

