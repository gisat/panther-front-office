Adding of a new widget
======================

create a specific widget class a descendant of the Widget class
------------------------------------------------------------------
* see PeriodsWidget.js as a basic example
* create ExampleWidget.js

create an instance of the ExampleWidget class in app.js
---------------------------------------------------

* create instance with obligatory parameters
var exampleWidget = new ExampleWidget({
	id: 'example-widget',
	name: 'Example'
});

* if you want to make widget's floater visible only in 3D mode, add parameter is3dOnly: true
* if you want to make widget's floater visible only in 2D mode, add parameter is2dOnly: true
* for other optional parameters see Widget.js
* push exampleWidget to an array "widgets"


set up placeholder
-----------------------------

* in TopToolBar.js#build create placeholder for the widget
* connect placeholder with floater via data-for attribute, in this case data-for:"floater-example-widget"
* create placeholder for 3D mode only, for 2D mode only or for both of them
* the placeholder will be visible in top tool bar
* in layout.css add an icon to placeholder like: 

	#top-toolbar .item#id-of-the-placeholder::before {
		content: '\f0b0';
	}
	
	where content value will be unicode of an icon (http://fontawesome.io/icons/)