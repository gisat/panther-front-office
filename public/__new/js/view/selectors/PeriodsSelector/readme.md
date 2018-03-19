This document explains how are the changes in periods distributed through application.

# Case 1: Change in original Ext timeline
Single or multiple period selection

* See Final steps part

# Case 2: Change in new Periods Selector
It includes Single period change from Select, All periods selection via Compare button and Period selection/deselection from MultiSelect.

1. Selected periods are obtained from either Select or MultiSelect component
2. Global Store is notified about a change with adjusted list of periods as an "option" parameter -> see Final steps part

# Case 3: Change in Map Container (currently only removing of a map)
1. Current periods are obtained from StateStore
2. A period of the map which is up to be deleted is removed from the list of current periods
3. Global Store is notified about a change with adjusted list of periods as an "option" parameter -> see Final steps part

# Final steps
1. Ext component - DicreteTimeline.js - is rebuilded with given array of periods
2. Because of a change in periods (LocathionTheme.js - onYearChange), FrontOffice.js is rebuilded
3. Period store is notified about a change
4. PeriodsSelector is rebuilded (in this case completely destroyed and created and then created a new one) with periods connected to the current dataset. Periods obtained from StateStore are selected.
4. MapContainer is rebuilded with periods obtained from StateStore.
	* If a map particular period doesn't exist, it is created.
	* If there is a map with associated period which is not in a list of periods, it is deleted (in the case of the default map, the map is not deleted, but rebuilded with data from WorldWindWidget currently).