
  Recipe converter plugin for Firefox and Safari
  Copyright 2012-2013 Teppo Kankaanpää
  
  1. Introduction
  
    This plugin will automatically convert pounds and cups in web pages to grams and dl. See
  the attached web page for usage instructions.
  
  2. Deployment
  
  2.1. Preprocessing
  
      Run common/preprocess.sh in that working directory on a system that supports m4 preprocessor.
    This will create the appropriate javascript files for firefox and safari extension directories.
    
  2.2. Packaging for Firefox
      
      Package firefox_extension directory as you would package any other firefox extension: zip it
    and rename it to recipeconverter.xpi
    
  2.3. Packaging for Safari
  
      Use Safari extension builder. Point the extension to the recipeconverter.safariextension directory
    and build recipeconverter.safariextz file using that.
    
  2.4. Testing
  
      After running the preprocessor, there is a testing suite at tests/ which can be run using
      tests/tests.html.
      
  
     
