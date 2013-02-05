/**
 * @author Teppo Kankaanpää
 */

/* Test suite for recipe converter. 
 */


include(recipeconverter_include.js)


// Test convert
$(document).ready(function() {

	var testResult = "";

	testResult = testResult + (convert(0, CUPTYPE) == 0) + "<br>";
	testResult = testResult + (convert(1, CUPTYPE) == "2.37") + "<br>";
	testResult = testResult + (convert(1.5, CUPTYPE) == "3.55") + "<br>";
	testResult = testResult + (convert(2, PTTYPE) == "9.46") + "<br>";
	testResult = testResult + (convert(2, QTTYPE) == "18.93") + "<br>";
	testResult = testResult + (convert(2, GALTYPE) == "75.71") + "<br>";
	testResult = testResult + (convert(3, OZTYPE) == "85.05") + "<br>";
	testResult = testResult + (convert(3, LBTYPE) == "1360.78") + "<br>";
	testResult = testResult + (convert(3, 999) == "3") + "<br>";

	testResult = testResult + "-------------<br>";
	
	testResult = testResult + (parseFractional("") == "") + "<br>";
	testResult = testResult + (parseFractional(" ") == "") + "<br>";
	testResult = testResult + (parseFractional("  ") == "") + "<br>";
	testResult = testResult + (parseFractional("1") == 1) + "<br>";
	testResult = testResult + (parseFractional("\t1") == 1) + "<br>";
	testResult = testResult + (parseFractional(" 1  ") == 1) + "<br>";
	testResult = testResult + (parseFractional("91928") == 91928) + "<br>";
	testResult = testResult + (parseFractional("1 1/2") == 1.5) + "<br>";
	testResult = testResult + (parseFractional("  1      1/2  ") == 1.5) + "<br>";
	testResult = testResult + "-------------<br>";
	testResult = testResult + (parseFractional("-1") == -1) + "<br>";
	testResult = testResult + (parseFractional("1 2") == "") + "<br>";
	testResult = testResult + (parseFractional("1 2 3") == "") + "<br>";
	testResult = testResult + (parseFractional("1 1/2 3") == "") + "<br>";
	testResult = testResult + (parseFractional("1/2 3") == "") + "<br>";
	testResult = testResult + (parseFractional("1/2/3") == "") + "<br>";
		// Test some weird yet allowed combinations.
	testResult = testResult + (parseFractional("1.5/3") == 0.5) + "<br>";
	testResult = testResult + (parseFractional("1 3/1.5") == 3) + "<br>";

	testResult = testResult + "-------------<br>";

	testResult = testResult + (parse("asdasfd") == "") + "<br>";
	testResult = testResult + (parse("3 asdf") == "") + "<br>";
	testResult = testResult + (parse(" 3 ") == "") + "<br>";
	testResult = testResult + (parse("1 cups") == "2.37 dl (1 cups)") + "<br>";
	testResult = testResult + (parse("1 cup") == "2.37 dl (1 cup)") + "<br>";
	testResult = testResult + (parse("1 cupa") == "") + "<br>";
	testResult = testResult + (parse("1 cupsa") == "") + "<br>";
	testResult = testResult + (parse("a cup") == "") + "<br>";

	testResult = testResult + "-------------<br>";

	testResult = testResult + (parse(" 1 cup") == " 2.37 dl (1 cup)") + "<br>";
	testResult = testResult + (parse("1-cup") == "2.37-dl (1-cup)") + "<br>";
	testResult = testResult + (parse("1  cup") == "2.37 dl (1  cup)") + "<br>";
	testResult = testResult + (parse("2 pint") == "9.46 dl (2 pint)") + "<br>";
	testResult = testResult + (parse("2 pints") == "9.46 dl (2 pints)") + "<br>";
	testResult = testResult + (parse("2 pints ") == "9.46 dl (2 pints) ") + "<br>";
	testResult = testResult + (parse("2 quart") == "18.93 dl (2 quart)") + "<br>";
	testResult = testResult + (parse("2 quarts") == "18.93 dl (2 quarts)") + "<br>";
	testResult = testResult + (parse("2 qt") == "18.93 dl (2 qt)") + "<br>";
	testResult = testResult + (parse("2 qts") == "18.93 dl (2 qts)") + "<br>";
	testResult = testResult + "-------------<br>";
	testResult = testResult + (parse("2 gallon") == "75.71 dl (2 gallon)") + "<br>";
	testResult = testResult + (parse("2 gallons") == "75.71 dl (2 gallons)") + "<br>";
	testResult = testResult + (parse("2 gal") == "75.71 dl (2 gal)") + "<br>";
	testResult = testResult + (parse("2 gals") == "75.71 dl (2 gals)") + "<br>";
	testResult = testResult + (parse("2 gall") == "") + "<br>";
	testResult = testResult + (parse("3 ounce") == "85.05 g (3 ounce)") + "<br>";
	testResult = testResult + (parse("3 ounces") == "85.05 g (3 ounces)") + "<br>";
	testResult = testResult + "-------------<br>";
	testResult = testResult + (parse("3 oz") == "85.05 g (3 oz)") + "<br>";
	testResult = testResult + (parse("3 ozs") == "85.05 g (3 ozs)") + "<br>";
	testResult = testResult + (parse("3 pound") == "1360.78 g (3 pound)") + "<br>";
	testResult = testResult + (parse("3 pounds") == "1360.78 g (3 pounds)") + "<br>";
	testResult = testResult + (parse("3 lb") == "1360.78 g (3 lb)") + "<br>";
	testResult = testResult + (parse("3 lbs") == "1360.78 g (3 lbs)") + "<br>";
	
	testResult = testResult + (parse("1 1/2 cup") == "3.55 dl (1 1/2 cup)") + "<br>";

	testResult = testResult + (parse("aa bb 1 1/2 cup cc dd 2 pint  ee") == "aa bb 3.55 dl (1 1/2 cup) cc dd 9.46 dl (2 pint)  ee") + "<br>";

	testResult = testResult + (parse("1 to 2 cup") == "2.37 to 4.73 dl (1 to 2 cup)") + "<br>";
	testResult = testResult + (parse("1 and 2 cup") == "2.37 and 4.73 dl (1 and 2 cup)") + "<br>";
	testResult = testResult + (parse("1 - 2 cup") == "2.37 - 4.73 dl (1 - 2 cup)") + "<br>";
	testResult = testResult + (parse("1 or 2 cup") == "2.37 or 4.73 dl (1 or 2 cup)") + "<br>";

	testResult = testResult + (parse("1 to 1 1/2 cup") == "2.37 to 3.55 dl (1 to 1 1/2 cup)") + "<br>";
	testResult = testResult + (parse("1 1/2 to 2 cup") == "3.55 to 4.73 dl (1 1/2 to 2 cup)") + "<br>";
	testResult = testResult + (parse("1 1 to 2 cup") == "1 2.37 to 4.73 dl (1 to 2 cup)") + "<br>";
	testResult = testResult + (parse("1 1/2- to 2-cup") == "1 1.18- to 4.73-dl (1/2- to 2-cup)") + "<br>";
	
	document.getElementById("results").innerHTML = testResult;

});

