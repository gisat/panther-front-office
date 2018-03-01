This document contains explanation of the paths that could be taken through the AttributeConfig form. This is basically representation of the Form, where User selects Attributes for Charts and Thematic maps and set up normalizations and adaptations of the units. 

First part consists of selecting the attributes for the Chart. It is possible to select attributes for the chart after clicking on the Add button onAddAttribute is called. After the user selects the attributes, he is interested in, he clicks on the add and onAttributeAdded is called.
 
Adding the attributes:

- onAddAttribute // After the Add attribute button was clicked on. 
- onAddAttrCheck // After any of the checks for the button 
- onAttributeAdded // After the Add on the button was clicked.

The second part consists of setting some additional information for the specific attributes. The user gets there by clicking on the Setting button. It is possible to set settings in bulk for the attributes. This attributes needs to share the same units specified in the BackOffice and if any settings were already applied to them, they must be the same for all the attributes in the bulk edit.

When the user clicks on the settings. 

Updating Settings for the attributes:

The Settings chart should contain source units, change units and Displayed units. Source units and displayed units aren't updatable. 
This means We should probably introduce Source units. 

Current units

Visible:

- In the grid
- Above normalization settings. 

Updated:


When does the units gets updated? When user changes normalization. 

