Ext.define('Puma.patch.Main',{
    requires: [
        'Puma.patch.data.Store'
        ,'Puma.patch.data.Model'
        ,'Puma.patch.form.field.ComboBox'
        ,'Puma.patch.form.field.Base'
        ,'Puma.patch.form.ItemSelector'
        ,'Puma.patch.data.proxy.Server'
        ,'Puma.patch.dd.DropZone'
        ,'Puma.patch.picker.Color'
        ,'Puma.patch.Component'
        ,'Puma.patch.EventManager'
        ,'Puma.patch.view.Table'
        ,'Puma.patch.panel.Panel'
        ,'Puma.patch.panel.Tool'
        ,'Puma.patch.panel.Header'
        ,'Puma.patch.tree.View'
        ,'Puma.patch.button.Button'
    ]
})


/**
 * FiltersFeature is a grid {@link Ext.grid.feature.Feature feature} that allows for a slightly more
 * robust representation of filtering than what is provided by the default store.
 *
 * Filtering is adjusted by the user using the grid's column header menu (this menu can be
 * disabled through configuration). Through this menu users can configure, enable, and
 * disable filters for each column.
 *
 * #Features#
 *
 * ##Filtering implementations:##
 *
 * Default filtering for Strings, Numeric Ranges, Date Ranges, Lists (which can be backed by a
 * {@link Ext.data.Store}), and Boolean. Additional custom filter types and menus are easily
 * created by extending {@link Ext.ux.grid.filter.Filter}.
 *
 * ##Graphical Indicators:##
 *
 * Columns that are filtered have {@link #filterCls a configurable css class} applied to the column headers.
 *
 * ##Automatic Reconfiguration:##
 *
 * Filters automatically reconfigure when the grid 'reconfigure' event fires.
 *
 * ##Stateful:##
 *
 * Filter information will be persisted across page loads by specifying a `stateId`
 * in the Grid configuration.
 *
 * The filter collection binds to the {@link Ext.grid.Panel#beforestaterestore beforestaterestore}
 * and {@link Ext.grid.Panel#beforestatesave beforestatesave} events in order to be stateful.
 *
 * ##GridPanel Changes:##
 *
 * - A `filters` property is added to the GridPanel using this feature.
 * - A `filterupdate` event is added to the GridPanel and is fired upon onStateChange completion.
 *
 * ##Server side code examples:##
 *
 * - [PHP](http://www.vinylfox.com/extjs/grid-filter-php-backend-code.php) - (Thanks VinylFox)
 * - [Ruby on Rails](http://extjs.com/forum/showthread.php?p=77326#post77326) - (Thanks Zyclops)
 * - [Ruby on Rails](http://extjs.com/forum/showthread.php?p=176596#post176596) - (Thanks Rotomaul)
 *
 * #Example usage:#
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         pageSize: 15
 *         ...
 *     });
 *
 *     var filtersCfg = {
 *         ftype: 'filters',
 *         autoReload: false, //don't reload automatically
 *         local: true, //only filter locally
 *         // filters may be configured through the plugin,
 *         // or in the column definition within the headers configuration
 *         filters: [{
 *             type: 'numeric',
 *             dataIndex: 'id'
 *         }, {
 *             type: 'string',
 *             dataIndex: 'name'
 *         }, {
 *             type: 'numeric',
 *             dataIndex: 'price'
 *         }, {
 *             type: 'date',
 *             dataIndex: 'dateAdded'
 *         }, {
 *             type: 'list',
 *             dataIndex: 'size',
 *             options: ['extra small', 'small', 'medium', 'large', 'extra large'],
 *             phpMode: true
 *         }, {
 *             type: 'boolean',
 *             dataIndex: 'visible'
 *         }]
 *     };
 *
 *     var grid = Ext.create('Ext.grid.Panel', {
 *          store: store,
 *          columns: ...,
 *          features: [filtersCfg],
 *          height: 400,
 *          width: 700,
 *          bbar: Ext.create('Ext.PagingToolbar', {
 *              store: store
 *          })
 *     });
 *
 *     // a filters property is added to the GridPanel
 *     grid.filters
 */
Ext.define('Ext.ux.grid.FiltersFeature', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.filters',
    uses: [
        'Ext.ux.grid.menu.ListMenu',
        'Ext.ux.grid.menu.RangeMenu',
        'Ext.ux.grid.filter.BooleanFilter',
        'Ext.ux.grid.filter.DateFilter',
        'Ext.ux.grid.filter.DateTimeFilter',
        'Ext.ux.grid.filter.ListFilter',
        'Ext.ux.grid.filter.NumericFilter',
        'Ext.ux.grid.filter.StringFilter'
    ],

    /**
     * @cfg {Boolean} autoReload
     * Defaults to true, reloading the datasource when a filter change happens.
     * Set this to false to prevent the datastore from being reloaded if there
     * are changes to the filters.  See <code>{@link #updateBuffer}</code>.
     */
    autoReload : true,
    /**
     * @cfg {Boolean} encode
     * Specify true for {@link #buildQuery} to use Ext.util.JSON.encode to
     * encode the filter query parameter sent with a remote request.
     * Defaults to false.
     */
    /**
     * @cfg {Array} filters
     * An Array of filters config objects. Refer to each filter type class for
     * configuration details specific to each filter type. Filters for Strings,
     * Numeric Ranges, Date Ranges, Lists, and Boolean are the standard filters
     * available.
     */
    /**
     * @cfg {String} filterCls
     * The css class to be applied to column headers with active filters.
     * Defaults to <tt>'ux-filterd-column'</tt>.
     */
    filterCls : 'ux-filtered-column',
    /**
     * @cfg {Boolean} local
     * <tt>true</tt> to use Ext.data.Store filter functions (local filtering)
     * instead of the default (<tt>false</tt>) server side filtering.
     */
    local : false,
    /**
     * @cfg {String} menuFilterText
     * defaults to <tt>'Filters'</tt>.
     */
    menuFilterText : 'Filters',
    /**
     * @cfg {String} paramPrefix
     * The url parameter prefix for the filters.
     * Defaults to <tt>'filter'</tt>.
     */
    paramPrefix : 'filter',
    /**
     * @cfg {Boolean} showMenu
     * Defaults to true, including a filter submenu in the default header menu.
     */
    showMenu : true,
    /**
     * @cfg {String} stateId
     * Name of the value to be used to store state information.
     */
    stateId : undefined,
    /**
     * @cfg {Number} updateBuffer
     * Number of milliseconds to defer store updates since the last filter change.
     */
    updateBuffer : 500,

    // doesn't handle grid body events
    hasFeatureEvent: false,


    /** @private */
    constructor : function (config) {
        var me = this;

        config = config || {};
        Ext.apply(me, config);

        me.deferredUpdate = Ext.create('Ext.util.DelayedTask', me.reload, me);

        // Init filters
        me.filters = me.createFiltersCollection();
        me.filterConfigs = config.filters;
    },

    attachEvents: function() {
        var me = this,
            view = me.view,
            headerCt = view.headerCt,
            grid = me.getGridPanel();

        me.bindStore(view.getStore(), true);

        // Listen for header menu being created
        headerCt.on('menucreate', me.onMenuCreate, me);

        view.on('refresh', me.onRefresh, me);
        grid.on({
            scope: me,
            beforestaterestore: me.applyState,
            beforestatesave: me.saveState,
            beforedestroy: me.destroy
        });

        // Add event and filters shortcut on grid panel
        grid.filters = me;
        grid.addEvents('filterupdate');
    },

    createFiltersCollection: function () {
        return Ext.create('Ext.util.MixedCollection', false, function (o) {
            return o ? o.dataIndex : null;
        });
    },

    /**
     * @private Create the Filter objects for the current configuration, destroying any existing ones first.
     */
    createFilters: function() {
        var me = this,
            hadFilters = me.filters.getCount(),
            grid = me.getGridPanel(),
            filters = me.createFiltersCollection(),
            model = grid.store.model,
            fields = model.prototype.fields,
            field,
            filter,
            state;

        if (hadFilters) {
            state = {};
            me.saveState(null, state);
        }

        function add (dataIndex, config, filterable) {
            if (dataIndex && (filterable || config)) {
                field = fields.get(dataIndex);
                filter = {
                    dataIndex: dataIndex,
                    type: (field && field.type && field.type.type) || 'auto'
                };

                if (Ext.isObject(config)) {
                    Ext.apply(filter, config);
                }

                filters.replace(filter);
            }
        }

        // We start with filters from our config
        Ext.Array.each(me.filterConfigs, function (filterConfig) {
            add(filterConfig.dataIndex, filterConfig);
        });

        // Then we merge on filters from the columns in the grid. The columns' filters take precedence.
        Ext.Array.each(grid.columns, function (column) {
            if (column.filterable === false) {
                filters.removeAtKey(column.dataIndex);
            } else {
                add(column.dataIndex, column.filter, column.filterable);
            }
        });


        me.removeAll();
        if (filters.items) {
            me.initializeFilters(filters.items);
        }

        if (hadFilters) {
            me.applyState(null, state);
        }
    },

    /**
     * @private
     */
    initializeFilters: function(filters) {
        var me = this,
            filtersLength = filters.length,
            i, filter, FilterClass;

        for (i = 0; i < filtersLength; i++) {
            filter = filters[i];
            if (filter) {
                FilterClass = me.getFilterClass(filter.type);
                filter = filter.menu ? filter : new FilterClass(filter);
                me.filters.add(filter);
                Ext.util.Observable.capture(filter, this.onStateChange, this);
            }
        }
    },

    /**
     * @private Handle creation of the grid's header menu. Initializes the filters and listens
     * for the menu being shown.
     */
    onMenuCreate: function(headerCt, menu) {
        var me = this;
        me.createFilters();
        menu.on('beforeshow', me.onMenuBeforeShow, me);
    },

    /**
     * @private Handle showing of the grid's header menu. Sets up the filter item and menu
     * appropriate for the target column.
     */
    onMenuBeforeShow: function(menu) {
        var me = this,
            menuItem, filter;

        if (me.showMenu) {
            menuItem = me.menuItem;
            if (!menuItem || menuItem.isDestroyed) {
                me.createMenuItem(menu);
                menuItem = me.menuItem;
            }

            filter = me.getMenuFilter();

            if (filter) {
                menuItem.setMenu(filter.menu, false);
                menuItem.setChecked(filter.active);
                // disable the menu if filter.disabled explicitly set to true
                menuItem.setDisabled(filter.disabled === true);
            }
            menuItem.setVisible(!!filter);
            this.sep.setVisible(!!filter);
        }
    },


    createMenuItem: function(menu) {
        var me = this;
        me.sep  = menu.add('-');
        me.menuItem = menu.add({
            checked: false,
            itemId: 'filters',
            text: me.menuFilterText,
            listeners: {
                scope: me,
                checkchange: me.onCheckChange,
                beforecheckchange: me.onBeforeCheck
            }
        });
    },

    getGridPanel: function() {
        return this.view.up('gridpanel');
    },

    /**
     * @private
     * Handler for the grid's beforestaterestore event (fires before the state of the
     * grid is restored).
     * @param {Object} grid The grid object
     * @param {Object} state The hash of state values returned from the StateProvider.
     */
    applyState : function (grid, state) {
        var me = this,
            key, filter;
        me.applyingState = true;
        me.clearFilters();
        if (state.filters) {
            for (key in state.filters) {
                if (state.filters.hasOwnProperty(key)) {
                    filter = me.filters.get(key);
                    if (filter) {
                        filter.setValue(state.filters[key]);
                        filter.setActive(true);
                    }
                }
            }
        }
        me.deferredUpdate.cancel();
        if (me.local) {
            me.reload();
        }
        delete me.applyingState;
        delete state.filters;
    },

    /**
     * Saves the state of all active filters
     * @param {Object} grid
     * @param {Object} state
     * @return {Boolean}
     */
    saveState : function (grid, state) {
        var filters = {};
        this.filters.each(function (filter) {
            if (filter.active) {
                filters[filter.dataIndex] = filter.getValue();
            }
        });
        return (state.filters = filters);
    },

    /**
     * @private
     * Handler called by the grid 'beforedestroy' event
     */
    destroy : function () {
        var me = this;
        Ext.destroyMembers(me, 'menuItem', 'sep');
        me.removeAll();
        me.clearListeners();
    },

    /**
     * Remove all filters, permanently destroying them.
     */
    removeAll : function () {
        if(this.filters){
            Ext.destroy.apply(Ext, this.filters.items);
            // remove all items from the collection
            this.filters.clear();
        }
    },


    /**
     * Changes the data store bound to this view and refreshes it.
     * @param {Ext.data.Store} store The store to bind to this view
     */
    bindStore : function(store) {
        var me = this;

        // Unbind from the old Store
        if (me.store && me.storeListeners) {
            me.store.un(me.storeListeners);
        }

        // Set up correct listeners
        if (store) {
            me.storeListeners = {
                scope: me
            };
            if (me.local) {
                me.storeListeners.load = me.onLoad;
            } else {
                me.storeListeners['before' + (store.buffered ? 'prefetch' : 'load')] = me.onBeforeLoad;
            }
            store.on(me.storeListeners);
        } else {
            delete me.storeListeners;
        }
        me.store = store;
    },

    /**
     * @private
     * Get the filter menu from the filters MixedCollection based on the clicked header
     */
    getMenuFilter : function () {
        var header = this.view.headerCt.getMenu().activeHeader;
        return header ? this.filters.get(header.dataIndex) : null;
    },

    /** @private */
    onCheckChange : function (item, value) {
        this.getMenuFilter().setActive(value);
    },

    /** @private */
    onBeforeCheck : function (check, value) {
        return !value || this.getMenuFilter().isActivatable();
    },

    /**
     * @private
     * Handler for all events on filters.
     * @param {String} event Event name
     * @param {Object} filter Standard signature of the event before the event is fired
     */
    onStateChange : function (event, filter) {
        if (event !== 'serialize') {
            var me = this,
                grid = me.getGridPanel();

            if (filter == me.getMenuFilter()) {
                me.menuItem.setChecked(filter.active, false);
            }

            if ((me.autoReload || me.local) && !me.applyingState) {
                me.deferredUpdate.delay(me.updateBuffer);
            }
            me.updateColumnHeadings();

            if (!me.applyingState) {
                grid.saveState();
            }
            grid.fireEvent('filterupdate', me, filter);
        }
    },

    /**
     * @private
     * Handler for store's beforeload event when configured for remote filtering
     * @param {Object} store
     * @param {Object} options
     */
    onBeforeLoad : function (store, options) {
        options.params = options.params || {};
        this.cleanParams(options.params);
        var params = this.buildQuery(this.getFilterData());
        Ext.apply(options.params, params);
    },

    /**
     * @private
     * Handler for store's load event when configured for local filtering
     * @param {Object} store
     */
    onLoad : function (store) {
        store.filterBy(this.getRecordFilter());
    },

    /**
     * @private
     * Handler called when the grid's view is refreshed
     */
    onRefresh : function () {
        this.updateColumnHeadings();
    },

    /**
     * Update the styles for the header row based on the active filters
     */
    updateColumnHeadings : function () {
        var me = this,
            headerCt = me.view.headerCt;
        if (headerCt) {
            headerCt.items.each(function(header) {
                var filter = me.getFilter(header.dataIndex);
                header[filter && filter.active ? 'addCls' : 'removeCls'](me.filterCls);
            });
        }
    },

    /** @private */
    reload : function () {
        var me = this,
            store = me.view.getStore();

        if (me.local) {
            store.clearFilter(true);
            store.filterBy(me.getRecordFilter());
            store.sort();
        } else {
            me.deferredUpdate.cancel();
            if (store.buffered) {
                store.pageMap.clear();
            }
            store.loadPage(1);
        }
    },

    /**
     * Method factory that generates a record validator for the filters active at the time
     * of invokation.
     * @private
     */
    getRecordFilter : function () {
        var f = [], len, i;
        this.filters.each(function (filter) {
            if (filter.active) {
                f.push(filter);
            }
        });

        len = f.length;
        return function (record) {
            for (i = 0; i < len; i++) {
                if (!f[i].validateRecord(record)) {
                    return false;
                }
            }
            return true;
        };
    },

    /**
     * Adds a filter to the collection and observes it for state change.
     * @param {Object/Ext.ux.grid.filter.Filter} config A filter configuration or a filter object.
     * @return {Ext.ux.grid.filter.Filter} The existing or newly created filter object.
     */
    addFilter : function (config) {
        var me = this,
            columns = me.getGridPanel().columns,
            i, columnsLength, column, filtersLength, filter;


        for (i = 0, columnsLength = columns.length; i < columnsLength; i++) {
            column = columns[i];
            if (column.dataIndex === config.dataIndex) {
                column.filter = config;
            }
        }

        if (me.view.headerCt.menu) {
            me.createFilters();
        } else {
            // Call getMenu() to ensure the menu is created, and so, also are the filters. We cannot call
            // createFilters() withouth having a menu because it will cause in a recursion to applyState()
            // that ends up to clear all the filter values. This is likely to happen when we reorder a column
            // and then add a new filter before the menu is recreated.
            me.view.headerCt.getMenu();
        }

        for (i = 0, filtersLength = me.filters.items.length; i < filtersLength; i++) {
            filter = me.filters.items[i];
            if (filter.dataIndex === config.dataIndex) {
                return filter;
            }
        }
    },

    /**
     * Adds filters to the collection.
     * @param {Array} filters An Array of filter configuration objects.
     */
    addFilters : function (filters) {
        if (filters) {
            var me = this,
                i, filtersLength;
            for (i = 0, filtersLength = filters.length; i < filtersLength; i++) {
                me.addFilter(filters[i]);
            }
        }
    },

    /**
     * Returns a filter for the given dataIndex, if one exists.
     * @param {String} dataIndex The dataIndex of the desired filter object.
     * @return {Ext.ux.grid.filter.Filter}
     */
    getFilter : function (dataIndex) {
        return this.filters.get(dataIndex);
    },

    /**
     * Turns all filters off. This does not clear the configuration information
     * (see {@link #removeAll}).
     */
    clearFilters : function () {
        this.filters.each(function (filter) {
            filter.setActive(false);
        });
    },

    getFilterItems: function () {
        var me = this;

        // If there's a locked grid then we must get the filter items for each grid.
        if (me.lockingPartner) {
            return me.filters.items.concat(me.lockingPartner.filters.items);
        }

        return me.filters.items;
    },

    /**
     * Returns an Array of the currently active filters.
     * @return {Array} filters Array of the currently active filters.
     */
    getFilterData : function () {
        var items = this.getFilterItems(),
            filters = [],
            n, nlen, item, d, i, len;

        for (n = 0, nlen = items.length; n < nlen; n++) {
            item = items[n];
            if (item.active) {
                d = [].concat(item.serialize());
                for (i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: item.dataIndex,
                        data: d[i]
                    });
                }
            }
        }
        return filters;
    },

    /**
     * Function to take the active filters data and build it into a query.
     * The format of the query depends on the {@link #encode} configuration:
     *
     *   - `false` (Default) :
     *     Flatten into query string of the form (assuming <code>{@link #paramPrefix}='filters'</code>:
     *
     *         filters[0][field]="someDataIndex"&
     *         filters[0][data][comparison]="someValue1"&
     *         filters[0][data][type]="someValue2"&
     *         filters[0][data][value]="someValue3"&
     *
     *
     *   - `true` :
     *     JSON encode the filter data
     *
     *         {filters:[{"field":"someDataIndex","comparison":"someValue1","type":"someValue2","value":"someValue3"}]}
     *
     * Override this method to customize the format of the filter query for remote requests.
     *
     * @param {Array} filters A collection of objects representing active filters and their configuration.
     * Each element will take the form of {field: dataIndex, data: filterConf}. dataIndex is not assured
     * to be unique as any one filter may be a composite of more basic filters for the same dataIndex.
     *
     * @return {Object} Query keys and values
     */
    buildQuery : function (filters) {
        var p = {}, i, f, root, dataPrefix, key, tmp,
            len = filters.length;

        if (!this.encode){
            for (i = 0; i < len; i++) {
                f = filters[i];
                root = [this.paramPrefix, '[', i, ']'].join('');
                p[root + '[field]'] = f.field;

                dataPrefix = root + '[data]';
                for (key in f.data) {
                    p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
                }
            }
        } else {
            tmp = [];
            for (i = 0; i < len; i++) {
                f = filters[i];
                tmp.push(Ext.apply(
                    {},
                    {field: f.field},
                    f.data
                ));
            }
            // only build if there is active filter
            if (tmp.length > 0){
                p[this.paramPrefix] = Ext.JSON.encode(tmp);
            }
        }
        return p;
    },

    /**
     * Removes filter related query parameters from the provided object.
     * @param {Object} p Query parameters that may contain filter related fields.
     */
    cleanParams : function (p) {
        // if encoding just delete the property
        if (this.encode) {
            delete p[this.paramPrefix];
            // otherwise scrub the object of filter data
        } else {
            var regex, key;
            regex = new RegExp('^' + this.paramPrefix + '\[[0-9]+\]');
            for (key in p) {
                if (regex.test(key)) {
                    delete p[key];
                }
            }
        }
    },

    /**
     * Function for locating filter classes, overwrite this with your favorite
     * loader to provide dynamic filter loading.
     * @param {String} type The type of filter to load ('Filter' is automatically
     * appended to the passed type; eg, 'string' becomes 'StringFilter').
     * @return {Function} The Ext.ux.grid.filter.Class
     */
    getFilterClass : function (type) {
        // map the supported Ext.data.Field type values into a supported filter
        switch(type) {
            case 'auto':
                type = 'string';
                break;
            case 'int':
            case 'float':
                type = 'numeric';
                break;
            case 'bool':
                type = 'boolean';
                break;
        }
        return Ext.ClassManager.getByAlias('gridfilter.' + type);
    }
});

Ext.define('PumaMain.view.Chart', {
    extend: 'Ext.container.Container',
    alias: 'widget.chartcmp',
    colspan: 2,
    border: 0,
    autoScroll: true,
    initComponent: function() {


        this.callParent();

    }
})


Ext.define('PumaMain.view.VisualizationForm', {
    extend: 'Puma.view.container.Common',
    alias: 'widget.visualizationform',
    requires: ['Puma.view.CommonForm', 'Puma.view.CommonGrid', 'Puma.view.form.DefaultComboBox', 'Gisatlib.form.HiddenStoreField', 'Puma.model.ColumnMap', 'Puma.model.Column'],
    padding: 5,
    initComponent: function() {



        var grid = Ext.widget('commongrid', {
            width: 450,
            //disabled: true,
            itemId: 'visualizationgrid',
            margin: '0 10 0 0',
            disableFilter: true,
            title: polyglot.t('visualizations'),
            columns: [{
                dataIndex: 'name',
                flex: 1,
                header: 'Name'
            }],
            selModel: {
                allowDeselect: true
            },
            store: Ext.StoreMgr.lookup('visualization4window')
        })

        var form = Ext.widget('commonform', {
            title: polyglot.t('visu'),
            model: 'Visualization',
            itemId: 'layerrefform',
            width: 300,
            items: [{
                xtype: 'textfield',
                name: 'name',
                allowBlank: false,
                fieldLabel: polyglot.t('name')
            },{
                xtype: 'hiddenfield',
                name: 'theme',
                value: this.theme
            }

            ]
        })



        this.items = [grid, form];
        this.callParent();

    }


});


Ext.define('Puma.view.CommonForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.commonform',
    requires: [],
    padding: 10,
    frame: true,
    initComponent: function() {
        this.buttons = [{
            itemId: 'resetbtn',
            text: polyglot.t('reset')
        }, {
            itemId: 'reloadbtn',
            text: polyglot.t('reload')
        }, {
            itemId: 'savebtn',
            formBind: true,
            disabled: true,
            text: polyglot.t('save')
        }]
        this.fieldDefaults = {
            labelAlign: 'left',
            labelWidth: 90,
            anchor: '100%'
        };
        this.callParent();
        this.addEvents({
            loadrecord: true,
            beforesave: true,
            aftersave: true
        })
        var me = this;
        var form = this.getForm();

        form.loadRecord = function(record) {
            this._record = record;
            var values = this.setValues(record.data);
            this.getFields().each(function(field) {
                if (field.disableUpdate) {
                    field.disable();
                }
            })
            me.fireEvent('loadrecord',me,record);
            return values;
        }

        form.unbindRecord = function() {
            this._record = null;
            this.getFields().each(function(field) {
                if (field.disableUpdate) {
                    field.enable();
                }
            })
            if (!this.copying && !this.unselecting) {
                this.getFields().each(function(field) {
                    field.fireEvent('change',field,field.getValue(),field.getValue())
                })
            }
            //var values = this.getValues();
            //this.setValues(values);
        }

        this.on('enable',function() {
            var me = this;
            window.setTimeout(function() {

                me.getForm().checkValidity();
            },1)
        })

    }
});

Ext.define('Puma.view.CommonGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.commongrid',
    requires: ['Ext.ux.grid.FiltersFeature'],
    padding: 10,
    frame: true,
    initComponent: function() {


        var filtersCfg = {
            ftype: 'filters',
            local: true,
            filters: [{
                type: 'string',
                dataIndex: 'name'
            }]
        };

        if (!this.disableFilter) {
            this.features = [filtersCfg];
        }
        this.columns = this.columns || [{
            dataIndex: 'name',
            header: polyglot.t('name'),
            flex: 1
        }]
        this.buttons = this.buttons || [];
        this.buttons = Ext.Array.merge(this.buttons,[{
            text: polyglot.t('delete'),
            itemId: 'deletebtn',
            disabled: true,
        }, {
            text: polyglot.t('createCopy'),
            disabled: true,
            itemId: 'copybtn'
        }, {
            text: polyglot.t('createBlank'),
            itemId: 'createbtn'
        }])
        this.selModel = {
            allowDeselect: true
        }
        this.callParent();
    }
});


Ext.define('Gisatlib.form.HiddenStoreField', {
    extend: 'Ext.form.field.Hidden',
    alias: 'widget.storefield',

    initComponent: function() {
        this.callParent();
        if (this.autoSave) {
            this.store.on('write',this.onStoreChanged,this)
            this.store.on('remove',this.onStoreItemRemoved,this)
            this.store.on('add',this.onStoreChanged,this)
        }
        else {
            this.store.on('update',this.validateStore,this)
        }

    },

    validateStore: function() {
        this.validate();
    },

    getErrors: function(value) {

        var errors = this.callParent(arguments);

        if (Ext.isFunction(this.validator)) {
            var msg = this.validator.call(this, value);
            if (msg !== true) {
                errors.push(msg);
            }
        }
        return errors;
    },

    onStoreItemRemoved: function(store) {
        this.onStoreChanged(store,true);
    },

    onStoreChanged: function(store,remove) {
        var form = this.up('form');
        var record = form.getRecord();
        // pro draggovani chceme obslouzit pouze udalost "add"
        if (record && (remove!==true || !store.dragging)) {
            var base = form.getForm();
            base.updateRecord(record);

            if (!base.isValid()) {
                //alert('form not valid');
                return;
            }
            form.fireEvent('beforesave',form,record);
            record.save();

        }

    },

    setValue: function(value) {
        var ret;
        if (this.store.getRootNode) {
            ret = this.setValueTree(value);
        }
        else {
            ret = this.store.loadData(value || []);
        }
        this.validate();
        return ret

    },
    getValue: function() {
        if (this.store.getRootNode) {
            return this.getValueTree();
        }
        var records = this.store.getRange();
        var data = [];
        for (var i=0; i<records.length;i++) {
            data.push(Ext.clone(records[i].data));
        }
        return data;
    },
    getRawValue: function() {
        return this.getValue();
    },
    getValueTree: function() {
        var root = this.store.getRootNode();
        var obj = this.parseNode(root);
        return obj;
    },

    parseNode: function(node) {
        var obj = Ext.clone(this.store.proxy.writer.getRecordData(node));
        delete obj['parentId'];
        delete obj['_id'];
        var childNodes = node.childNodes || [];
        var children = [];
        for (var i=0;i<childNodes.length;i++) {
            var childNode = childNodes[i];
            var parsed = this.parseNode(childNode);
            children.push(parsed);
        }
        if (children.length) {
            obj.children = children;
        }
        return obj;
    },

    setValueTree: function(value) {

        if (!value) {
            //console.log('removed')
            var nodes = this.store.getRootNode().removeAll(false);
            return;
        }
        var ret = this.store.setRootNode(Ext.clone(value));
        this.store.getRootNode().expand(true);
        return ret;
    },

    reset: function() {
        if (this.disableReset) return;
        this.callParent();
    }

})

Ext.define('PumaMain.view.ChartPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chartpanel',
    layout: 'fit',
    frame: false,
    border: 0,
    collapseLeft: true,
    cls: 'chart-panel',
    padding: 0,
    initComponent: function() {
        this.toolMap = {
            description: {
                type: 'description',
                tooltip: polyglot.t('description'),
                cls: 'tool-icon tool-chart-description'
            },
            gear: {
                type: 'gear',
                helpId: 'Modifyingcharts',
                tooltip: polyglot.t('settings'),
                cls: 'tool-icon tool-chart-settings'
            },
            close: {
                type: 'close',
                helpId: 'Removingcharts',
                tooltip: polyglot.t('remove'),
                cls: 'tool-icon tool-chart-close'
            },
            help: {
                type: 'help',
                helpId: 'Displayingchartlegend',
                cls: 'tool-icon tool-chart-help',
                tooltip: polyglot.t('legend')
            },
            collapse: {
                type: 'collapse',
                helpId: 'Exportingchartsastables',
                cls: 'tool-icon tool-chart-export-csv',
                tooltip: polyglot.t('exportCsv')
            },
            print: {
                type: 'print',
                helpId: 'Exportingchartsasgraphics',
                tooltip: polyglot.t('snapshot'),
                cls: 'tool-icon tool-chart-export-png'
            },
            search: {
                type: 'search',
                tooltip: polyglot.t('switchZooming'),
                cls: 'tool-icon tool-chart-search',
                width: 22,
                height: 22
            }
        }
        this.tools = [];

        var toolNames = ['description','gear','help','collapse','search','print','close'];
        for (var i=0;i<toolNames.length;i++) {
            this.tools.push(this.toolMap[toolNames[i]]);
        }
        this.callParent();
        this.updateToolVisibility();
    },

    updateToolVisibility: function() {
        var toolNames = [];
        switch (this.cfgType) {
            case 'polarchart': // TODO do we want also 'help'?
            case 'grid':
                toolNames = ['description','gear','collapse','print','close']; break;
            case 'piechart':
                toolNames = ['description','gear','help','collapse','print','close']; break;
            case 'columnchart':
                toolNames = ['description','gear','help','collapse','print','close']; break;
            case 'scatterchart':
                toolNames = ['description','gear','help','collapse','search','print','close']; break;
            case 'extentoutline':
                toolNames = ['description','gear','print','close']; break;
            case 'filter':
                toolNames = ['close']; break;
        }
        for (var i=0;i<this.tools.length;i++) {
            var tool = this.tools[i];
            if (tool.type === 'collapse-top' || tool.type === 'expand-bottom') {
                tool.addCls('tool-icon tool-chart-collapse');
                continue;
            }
            var vis = Ext.Array.contains(toolNames,tool.type);
            if (tool.rendered) {
                tool.setVisible(vis);
            }
            else if (!vis) {
                tool.hidden = true;
            }
        }
    }
})


/**
 * This is a supporting class for {@link Ext.ux.grid.filter.ListFilter}.
 * Although not listed as configuration options for this class, this class
 * also accepts all configuration options from {@link Ext.ux.grid.filter.ListFilter}.
 */
Ext.define('Ext.ux.grid.menu.ListMenu', {
    extend: 'Ext.menu.Menu',

    /**
     * @cfg {String} idField
     * Defaults to 'id'.
     */
    idField :  'id',

    /**
     * @cfg {String} labelField
     * Defaults to 'text'.
     */
    labelField :  'text',
    /**
     * @cfg {String} paramPrefix
     * Defaults to 'Loading...'.
     */
    loadingText : 'Loading...',
    /**
     * @cfg {Boolean} loadOnShow
     * Defaults to true.
     */
    loadOnShow : true,
    /**
     * @cfg {Boolean} single
     * Specify true to group all items in this list into a single-select
     * radio button group. Defaults to false.
     */
    single : false,

    constructor : function (cfg) {
        var me = this,
            options,
            i,
            len,
            value;

        me.selected = [];
        me.addEvents(
            /**
             * @event checkchange
             * Fires when there is a change in checked items from this list
             * @param {Object} item Ext.menu.CheckItem
             * @param {Object} checked The checked value that was set
             */
            'checkchange'
        );

        me.callParent([cfg = cfg || {}]);

        if(!cfg.store && cfg.options) {
            options = [];
            for(i = 0, len = cfg.options.length; i < len; i++){
                value = cfg.options[i];
                switch(Ext.type(value)){
                    case 'array':  options.push(value); break;
                    case 'object': options.push([value[me.idField], value[me.labelField]]); break;
                    case 'string': options.push([value, value]); break;
                }
            }

            me.store = Ext.create('Ext.data.ArrayStore', {
                fields: [me.idField, me.labelField],
                data:   options,
                listeners: {
                    load: me.onLoad,
                    scope:  me
                }
            });
            me.loaded = true;
            me.autoStore = true;
        } else {
            me.add({
                text: me.loadingText,
                iconCls: 'loading-indicator'
            });
            me.store.on('load', me.onLoad, me);
        }
    },

    destroy : function () {
        var me = this,
            store = me.store;

        if (store) {
            if (me.autoStore) {
                store.destroyStore();
            } else {
                store.un('unload', me.onLoad, me);
            }
        }
        me.callParent();
    },

    /**
     * Lists will initially show a 'loading' item while the data is retrieved from the store.
     * In some cases the loaded data will result in a list that goes off the screen to the
     * right (as placement calculations were done with the loading item). This adapter will
     * allow show to be called with no arguments to show with the previous arguments and
     * thus recalculate the width and potentially hang the menu from the left.
     */
    show : function () {
        if (this.loadOnShow && !this.loaded && !this.store.loading) {
            this.store.load();
        }
        this.callParent();
    },

    /** @private */
    onLoad : function (store, records) {
        var me = this,
            gid, itemValue, i, len,
            listeners = {
                checkchange: me.checkChange,
                scope: me
            };

        Ext.suspendLayouts();
        me.removeAll(true);

        gid = me.single ? Ext.id() : null;
        for (i = 0, len = records.length; i < len; i++) {
            itemValue = records[i].get(me.idField);
            me.add(Ext.create('Ext.menu.CheckItem', {
                text: records[i].get(me.labelField),
                group: gid,
                checked: Ext.Array.contains(me.selected, itemValue),
                hideOnClick: false,
                value: itemValue,
                listeners: listeners
            }));
        }

        me.loaded = true;
        Ext.resumeLayouts(true);
        me.fireEvent('load', me, records);
    },

    /**
     * Get the selected items.
     * @return {Array} selected
     */
    getSelected : function () {
        return this.selected;
    },

    /** @private */
    setSelected : function (value) {
        value = this.selected = [].concat(value);

        if (this.loaded) {
            this.items.each(function(item){
                item.setChecked(false, true);
                for (var i = 0, len = value.length; i < len; i++) {
                    if (item.value == value[i]) {
                        item.setChecked(true, true);
                    }
                }
            }, this);
        }
    },

    /**
     * Handler for the 'checkchange' event from an check item in this menu
     * @param {Object} item Ext.menu.CheckItem
     * @param {Object} checked The checked value that was set
     */
    checkChange : function (item, checked) {
        var value = [];
        this.items.each(function(item){
            if (item.checked) {
                value.push(item.value);
            }
        },this);
        this.selected = value;

        this.fireEvent('checkchange', item, checked);
    }
});
/**
 * Custom implementation of {@link Ext.menu.Menu} that has preconfigured items for entering numeric
 * range comparison values: less-than, greater-than, and equal-to. This is used internally
 * by {@link Ext.ux.grid.filter.NumericFilter} to create its menu.
 */
Ext.define('Ext.ux.grid.menu.RangeMenu', {
    extend: 'Ext.menu.Menu',

    /**
     * @cfg {String} fieldCls
     * The Class to use to construct each field item within this menu
     * Defaults to:<pre>
     * fieldCls : Ext.form.field.Number
     * </pre>
     */
    fieldCls : 'Ext.form.field.Number',

    /**
     * @cfg {Object} fieldCfg
     * The default configuration options for any field item unless superseded
     * by the <code>{@link #fields}</code> configuration.
     * Defaults to:<pre>
     * fieldCfg : {}
     * </pre>
     * Example usage:
     * <pre><code>
     fieldCfg : {
    width: 150,
},
     * </code></pre>
     */

    /**
     * @cfg {Object} fields
     * The field items may be configured individually
     * Defaults to <tt>undefined</tt>.
     * Example usage:
     * <pre><code>
     fields : {
    gt: { // override fieldCfg options
        width: 200,
        fieldCls: Ext.ux.form.CustomNumberField // to override default {@link #fieldCls}
    }
},
     * </code></pre>
     */

    /**
     * @cfg {Object} itemIconCls
     * The itemIconCls to be applied to each comparator field item.
     * Defaults to:<pre>
     itemIconCls : {
    gt : 'ux-rangemenu-gt',
    lt : 'ux-rangemenu-lt',
    eq : 'ux-rangemenu-eq'
}
     * </pre>
     */
    itemIconCls : {
        gt : 'ux-rangemenu-gt',
        lt : 'ux-rangemenu-lt',
        eq : 'ux-rangemenu-eq'
    },

    /**
     * @cfg {Object} fieldLabels
     * Accessible label text for each comparator field item. Can be overridden by localization
     * files. Defaults to:<pre>
     fieldLabels : {
     gt: 'Greater Than',
     lt: 'Less Than',
     eq: 'Equal To'
}</pre>
     */
    fieldLabels: {
        gt: 'Greater Than',
        lt: 'Less Than',
        eq: 'Equal To'
    },

    /**
     * @cfg {Object} menuItemCfgs
     * Default configuration options for each menu item
     * Defaults to:<pre>
     menuItemCfgs : {
    emptyText: 'Enter Filter Text...',
    selectOnFocus: true,
    width: 125
}
     * </pre>
     */
    menuItemCfgs : {
        emptyText: 'Enter Number...',
        selectOnFocus: false,
        width: 155
    },

    /**
     * @cfg {Array} menuItems
     * The items to be shown in this menu.  Items are added to the menu
     * according to their position within this array. Defaults to:<pre>
     * menuItems : ['lt','gt','-','eq']
     * </pre>
     */
    menuItems : ['lt', 'gt', '-', 'eq'],


    constructor : function (config) {
        var me = this,
            fields, fieldCfg, i, len, item, cfg, Cls;

        me.callParent(arguments);

        fields = me.fields = me.fields || {};
        fieldCfg = me.fieldCfg = me.fieldCfg || {};

        me.addEvents(
            /**
             * @event update
             * Fires when a filter configuration has changed
             * @param {Ext.ux.grid.filter.Filter} this The filter object.
             */
            'update'
        );

        me.updateTask = Ext.create('Ext.util.DelayedTask', me.fireUpdate, me);

        for (i = 0, len = me.menuItems.length; i < len; i++) {
            item = me.menuItems[i];
            if (item !== '-') {
                // defaults
                cfg = {
                    itemId: 'range-' + item,
                    enableKeyEvents: true,
                    hideEmptyLabel: false,
                    labelCls: 'ux-rangemenu-icon ' + me.itemIconCls[item],
                    labelSeparator: '',
                    labelWidth: 29,
                    listeners: {
                        scope: me,
                        change: me.onInputChange,
                        keyup: me.onInputKeyUp,
                        el: {
                            click: function(e) {
                                e.stopPropagation();
                            }
                        }
                    },
                    activate: Ext.emptyFn,
                    deactivate: Ext.emptyFn
                };
                Ext.apply(
                    cfg,
                    // custom configs
                    Ext.applyIf(fields[item] || {}, fieldCfg[item]),
                    // configurable defaults
                    me.menuItemCfgs
                );
                Cls = cfg.fieldCls || me.fieldCls;
                item = fields[item] = Ext.create(Cls, cfg);
            }
            me.add(item);
        }
    },

    /**
     * @private
     * called by this.updateTask
     */
    fireUpdate : function () {
        this.fireEvent('update', this);
    },

    /**
     * Get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        var result = {}, key, field;
        for (key in this.fields) {
            field = this.fields[key];
            if (field.isValid() && field.getValue() !== null) {
                result[key] = field.getValue();
            }
        }
        return result;
    },

    /**
     * Set the value of this menu and fires the 'update' event.
     * @param {Object} data The data to assign to this menu
     */
    setValue : function (data) {
        var me = this,
            key,
            field;

        for (key in me.fields) {

            // Prevent field's change event from tiggering a Store filter. The final upate event will do that
            field = me.fields[key];
            field.suspendEvents();
            field.setValue(key in data ? data[key] : '');
            field.resumeEvents();
        }

        // Trigger the filering of the Store
        me.fireEvent('update', me);
    },

    /**
     * @private
     * Handler method called when there is a keyup event on an input
     * item of this menu.
     */
    onInputKeyUp: function(field, e) {
        if (e.getKey() === e.RETURN && field.isValid()) {
            e.stopEvent();
            this.hide();
        }
    },

    /**
     * @private
     * Handler method called when the user changes the value of one of the input
     * items in this menu.
     */
    onInputChange: function(field) {
        var me = this,
            fields = me.fields,
            eq = fields.eq,
            gt = fields.gt,
            lt = fields.lt;

        if (field == eq) {
            if (gt) {
                gt.setValue(null);
            }
            if (lt) {
                lt.setValue(null);
            }
        }
        else {
            eq.setValue(null);
        }

        // restart the timer
        this.updateTask.delay(this.updateBuffer);
    }
});
/**
 * Boolean filters use unique radio group IDs (so you can have more than one!)
 * <p><b><u>Example Usage:</u></b></p>
 * <pre><code>
 var filters = Ext.create('Ext.ux.grid.GridFilters', {
    ...
    filters: [{
        // required configs
        type: 'boolean',
        dataIndex: 'visible'

        // optional configs
        defaultValue: null, // leave unselected (false selected by default)
        yesText: 'Yes',     // default
        noText: 'No'        // default
    }]
});
 * </code></pre>
 */
Ext.define('Ext.ux.grid.filter.BooleanFilter', {
    extend: 'Ext.ux.grid.filter.Filter',
    alias: 'gridfilter.boolean',

    /**
     * @cfg {Boolean} defaultValue
     * Set this to null if you do not want either option to be checked by default. Defaults to false.
     */
    defaultValue : false,
    /**
     * @cfg {String} yesText
     * Defaults to 'Yes'.
     */
    yesText : 'Yes',
    /**
     * @cfg {String} noText
     * Defaults to 'No'.
     */
    noText : 'No',

    /**
     * @private
     * Template method that is to initialize the filter and install required menu items.
     */
    init : function (config) {
        var gId = Ext.id();
        this.options = [
            Ext.create('Ext.menu.CheckItem', {text: this.yesText, group: gId, checked: this.defaultValue === true}),
            Ext.create('Ext.menu.CheckItem', {text: this.noText, group: gId, checked: this.defaultValue === false})];

        this.menu.add(this.options[0], this.options[1]);

        for(var i=0; i<this.options.length; i++){
            this.options[i].on('click', this.fireUpdate, this);
            this.options[i].on('checkchange', this.fireUpdate, this);
        }
    },

    /**
     * @private
     * Template method that is to get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        return this.options[0].checked;
    },

    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter
     */
    setValue : function (value) {
        this.options[value ? 0 : 1].setChecked(true);
    },

    /**
     * @private
     * Template method that is to get and return serialized filter data for
     * transmission to the server.
     * @return {Object/Array} An object or collection of objects containing
     * key value pairs representing the current configuration of the filter.
     */
    getSerialArgs : function () {
        var args = {type: 'boolean', value: this.getValue()};
        return args;
    },

    /**
     * Template method that is to validate the provided Ext.data.Record
     * against the filters configuration.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord : function (record) {
        return record.get(this.dataIndex) == this.getValue();
    }
});
/**
 * Filter by a configurable Ext.picker.DatePicker menu
 *
 * This filter allows for the following configurations:
 *
 * - Any of the normal configs will be passed through to either component.
 * - There can be a docked config.
 * - The timepicker can be on the right or left (datepicker, too, of course).
 * - Choose which component will initiate the filtering, i.e., the event can be
 *   configured to be bound to either the datepicker or the timepicker, or if
 *   there is a docked config it be automatically have the handler bound to it.
 *
 * Although not shown here, this class accepts all configuration options
 * for {@link Ext.picker.Date} and {@link Ext.picker.Time}.
 *
 * In the case that a custom dockedItems config is passed in, the
 * class will handle binding the default listener to it so the
 * developer need not worry about having to do it.
 *
 * The default dockedItems position and the toolbar's
 * button text can be passed a config for convenience, i.e.,:
 *
 *     dock: {
 *        buttonText: 'Click to Filter',
 *        dock: 'left'
 *     }
 *
 * Or, pass in a full dockedItems config:
 *
 *     dock: {
 *        dockedItems: {
 *            xtype: 'toolbar',
 *            dock: 'bottom',
 *            ...
 *        }
 *     }
 *
 * Or, give a value of `true` to accept dock defaults:
 *
 *     dock: true
 *
 * But, it must be one or the other.
 *
 * Example Usage:
 *
 *     var filters = Ext.create('Ext.ux.grid.GridFilters', {
 *         ...
 *         filters: [{
 *             // required configs
 *             type: 'datetime',
 *             dataIndex: 'date',
 *
 *             // optional configs
 *             //positionDatepickerFirst: true,
 *             //selectDateToFilter: false,
 *             date: {
 *
 *             },
 *             time: {
 *                 format: 'H:i:s A',
 *                 increment: 1
 *             },
 *             dock: {
 *                 buttonText: 'Click to Filter',
 *                 dock: 'left'
 *
 *                 // allows for custom dockedItems cfg
 *                 //dockedItems: {}
 *             }
 *         }]
 *     });
 */
Ext.define('Ext.ux.grid.filter.DateTimeFilter', {
    extend: 'Ext.ux.grid.filter.DateFilter',
    alias: 'gridfilter.datetime',

    dateDefaults: {
        xtype: 'datepicker'
    },

    timeDefaults: {
        xtype: 'timepicker',
        width: 100,
        height: 200
    },

    dockDefaults: {
        dock: 'top',
        buttonText: 'Filter'
    },

    /**
     * @private
     * By default, the datepicker has the default event listener bound to it.
     * Setting to `false` will bind it to the timepicker.
     *
     * The config will be ignored if there is a `dock` config.
     */
    selectDateToFilter: true,

    /**
     * @private
     * Positions the datepicker within its container.
     * Defaults to `true`.
     */
    positionDatepickerFirst: true,

    reTime: /\s(am|pm)/i,
    reItemId: /\w*-(\w*)$/,

    /**
     * Replaces the selected value of the timepicker with the default 00:00:00.
     * @private
     * @param {Object} date
     * @param {Ext.picker.Time} timepicker
     * @return Date object
     */
    addTimeSelection: function (date, timepicker) {
        var me = this,
            selection = timepicker.getSelectionModel().getSelection(),
            time, len, fn, val,
            i = 0,
            arr = [],
            timeFns = ['setHours', 'setMinutes', 'setSeconds', 'setMilliseconds'];


        if (selection.length) {
            time = selection[0].get('disp');

            // Loop through all of the splits and add the time values.
            arr = time.replace(me.reTime, '').split(':');

            for (len = arr.length; i < len; i++) {
                fn = timeFns[i];
                val = arr[i];

                if (val) {
                    date[fn](parseInt(val, 10));
                }
            }
        }

        return date;
    },

    /**
     * @private
     * Template method that is to initialize the filter and install required menu items.
     */
    init: function (config) {
        var me = this,
            dateCfg = Ext.applyIf(me.date || {}, me.dateDefaults),
            timeCfg = Ext.applyIf(me.time || {}, me.timeDefaults),
            dockCfg = me.dock, // should not default to empty object
            defaultListeners = {
                click: {
                    scope: me,
                    click: me.onMenuSelect
                },
                select: {
                    scope: me,
                    select: me.onMenuSelect
                }
            },
            pickerCtnCfg, i, len, item, cfg,
            items = [dateCfg, timeCfg],

            // we need to know the datepicker's position in the items array
            // for when the itemId name is bound to it before adding to the menu
            datepickerPosition = 0;

        if (!me.positionDatepickerFirst) {
            items = items.reverse();
            datepickerPosition = 1;
        }

        pickerCtnCfg = Ext.apply(me.pickerOpts, {
            xtype: !dockCfg ? 'container' : 'panel',
            layout: 'hbox',
            items: items
        });

        // If there's no dock config then bind the default listener to the desired picker.
        if (!dockCfg) {
            if (me.selectDateToFilter) {
                dateCfg.listeners = defaultListeners.select;
            } else {
                timeCfg.listeners = defaultListeners.select;
            }
        } else if (dockCfg) {
            me.selectDateToFilter = null;

            if (dockCfg.dockedItems) {
                pickerCtnCfg.dockedItems = dockCfg.dockedItems;
                // TODO: allow config that will tell which item to bind the listener to
                // right now, it's using the first item
                pickerCtnCfg.dockedItems.items[dockCfg.bindToItem || 0].listeners = defaultListeners.click;
            } else {
                // dockCfg can be `true` if button text and dock position defaults are wanted
                if (Ext.isBoolean(dockCfg)) {
                    dockCfg = {};
                }
                dockCfg = Ext.applyIf(dockCfg, me.dockDefaults);
                pickerCtnCfg.dockedItems = {
                    xtype: 'toolbar',
                    dock: dockCfg.dock,
                    items: [
                        {
                            xtype: 'button',
                            text: dockCfg.buttonText,
                            flex: 1,
                            listeners: defaultListeners.click
                        }
                    ]
                };
            }
        }

        me.fields = {};
        for (i = 0, len = me.menuItems.length; i < len; i++) {
            item = me.menuItems[i];
            if (item !== '-') {
                pickerCtnCfg.items[datepickerPosition].itemId = item;

                cfg = {
                    itemId: 'range-' + item,
                    text: me[item + 'Text'],
                    menu: Ext.create('Ext.menu.Menu', {
                        items: pickerCtnCfg
                    }),
                    listeners: {
                        scope: me,
                        checkchange: me.onCheckChange
                    }
                };
                item = me.fields[item] = Ext.create('Ext.menu.CheckItem', cfg);
            }
            me.menu.add(item);
        }
        me.values = {};
    },

    onCheckChange: function (item, checked) {
        var me = this,
            menu = item.menu,
            timepicker = menu.down('timepicker'),
            datepicker = menu.down('datepicker'),
            itemId = datepicker.itemId,
            values = me.values;

        if (checked) {
            values[itemId] = me.addTimeSelection(datepicker.value, timepicker);
        } else {
            delete values[itemId];
        }
        me.setActive(me.isActivatable());
        me.fireEvent('update', me);
    },

    /**
     * Handler for when the DatePicker for a field fires the 'select' event
     * @param {Ext.picker.Date} picker
     * @param {Object} date
     */
    onMenuSelect: function (picker, date) {
        // NOTE: we need to redefine the picker.
        var me = this,
            menu = me.menu,
            checkItemId = menu.getFocusEl().itemId.replace(me.reItemId, '$1'),
            fields = me.fields,
            field;

        picker = menu.queryById(checkItemId);
        field = me.fields[picker.itemId];
        field.setChecked(true);

        if (field == fields.on) {
            fields.before.setChecked(false, true);
            fields.after.setChecked(false, true);
        } else {
            fields.on.setChecked(false, true);
            if (field == fields.after && me.getFieldValue('before') < date) {
                fields.before.setChecked(false, true);
            } else if (field == fields.before && me.getFieldValue('after') > date) {
                fields.after.setChecked(false, true);
            }
        }
        me.fireEvent('update', me);

        // The timepicker's getBubbleTarget() returns the boundlist's implementation,
        // so it doesn't look up ownerCt chain (it looks up this.pickerField).
        // This is a problem :)
        // This can be fixed by just walking up the ownerCt chain
        // (same thing, but confusing without comment).
        picker.ownerCt.ownerCt.hide();
    },

    /**
     * Template method that is to validate the provided Ext.data.Record
     * against the filters configuration.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord: function (record) {
        // remove calls to Ext.Date.clearTime
        var me = this,
            key,
            pickerValue,
            val = record.get(me.dataIndex);

        if(!Ext.isDate(val)){
            return false;
        }

        val = val.getTime();

        for (key in me.fields) {
            if (me.fields[key].checked) {
                pickerValue = me.getFieldValue(key).getTime();
                if (key == 'before' && pickerValue <= val) {
                    return false;
                }
                if (key == 'after' && pickerValue >= val) {
                    return false;
                }
                if (key == 'on' && pickerValue != val) {
                    return false;
                }
            }
        }
        return true;
    }
});
/**
 * <p>List filters are able to be preloaded/backed by an Ext.data.Store to load
 * their options the first time they are shown. ListFilter utilizes the
 * {@link Ext.ux.grid.menu.ListMenu} component.</p>
 * <p>Although not shown here, this class accepts all configuration options
 * for {@link Ext.ux.grid.menu.ListMenu}.</p>
 *
 * <p><b><u>Example Usage:</u></b></p>
 * <pre><code>
 var filters = Ext.create('Ext.ux.grid.GridFilters', {
    ...
    filters: [{
        type: 'list',
        dataIndex: 'size',
        phpMode: true,
        // options will be used as data to implicitly creates an ArrayStore
        options: ['extra small', 'small', 'medium', 'large', 'extra large']
    }]
});
 * </code></pre>
 *
 */
Ext.define('Ext.ux.grid.filter.ListFilter', {
    extend: 'Ext.ux.grid.filter.Filter',
    alias: 'gridfilter.list',

    /**
     * @cfg {Array} options
     * <p><code>data</code> to be used to implicitly create a data store
     * to back this list when the data source is <b>local</b>. If the
     * data for the list is remote, use the <code>{@link #store}</code>
     * config instead.</p>
     * <br><p>Each item within the provided array may be in one of the
     * following formats:</p>
     * <div class="mdetail-params"><ul>
     * <li><b>Array</b> :
     * <pre><code>
     options: [
     [11, 'extra small'],
     [18, 'small'],
     [22, 'medium'],
     [35, 'large'],
     [44, 'extra large']
     ]
     * </code></pre>
     * </li>
     * <li><b>Object</b> :
     * <pre><code>
     labelField: 'name', // override default of 'text'
     options: [
     {id: 11, name:'extra small'},
     {id: 18, name:'small'},
     {id: 22, name:'medium'},
     {id: 35, name:'large'},
     {id: 44, name:'extra large'}
     ]
     * </code></pre>
     * </li>
     * <li><b>String</b> :
     * <pre><code>
     * options: ['extra small', 'small', 'medium', 'large', 'extra large']
     * </code></pre>
     * </li>
     */
    /**
     * @cfg {Boolean} phpMode
     * <p>Adjust the format of this filter. Defaults to false.</p>
     * <br><p>When GridFilters <code>@cfg encode = false</code> (default):</p>
     * <pre><code>
     // phpMode == false (default):
     filter[0][data][type] list
     filter[0][data][value] value1
     filter[0][data][value] value2
     filter[0][field] prod

     // phpMode == true:
     filter[0][data][type] list
     filter[0][data][value] value1, value2
     filter[0][field] prod
     * </code></pre>
     * When GridFilters <code>@cfg encode = true</code>:
     * <pre><code>
     // phpMode == false (default):
     filter : [{"type":"list","value":["small","medium"],"field":"size"}]

     // phpMode == true:
     filter : [{"type":"list","value":"small,medium","field":"size"}]
     * </code></pre>
     */
    phpMode : false,
    /**
     * @cfg {Ext.data.Store} store
     * The {@link Ext.data.Store} this list should use as its data source
     * when the data source is <b>remote</b>. If the data for the list
     * is local, use the <code>{@link #options}</code> config instead.
     */

    /**
     * @private
     * Template method that is to initialize the filter.
     * @param {Object} config
     */
    init : function (config) {
        this.dt = Ext.create('Ext.util.DelayedTask', this.fireUpdate, this);
    },

    /**
     * @private @override
     * Creates the Menu for this filter.
     * @param {Object} config Filter configuration
     * @return {Ext.menu.Menu}
     */
    createMenu: function(config) {
        var menu = Ext.create('Ext.ux.grid.menu.ListMenu', config);
        menu.on('checkchange', this.onCheckChange, this);
        return menu;
    },

    /**
     * @private
     * Template method that is to get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        return this.menu.getSelected();
    },
    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter
     */
    setValue : function (value) {
        this.menu.setSelected(value);
        this.fireEvent('update', this);
    },

    /**
     * Template method that is to return <tt>true</tt> if the filter
     * has enough configuration information to be activated.
     * @return {Boolean}
     */
    isActivatable : function () {
        return this.getValue().length > 0;
    },

    /**
     * @private
     * Template method that is to get and return serialized filter data for
     * transmission to the server.
     * @return {Object/Array} An object or collection of objects containing
     * key value pairs representing the current configuration of the filter.
     */
    getSerialArgs : function () {
        return {type: 'list', value: this.phpMode ? this.getValue().join(',') : this.getValue()};
    },

    /** @private */
    onCheckChange : function(){
        this.dt.delay(this.updateBuffer);
    },


    /**
     * Template method that is to validate the provided Ext.data.Record
     * against the filters configuration.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord : function (record) {
        var valuesArray = this.getValue();
        return Ext.Array.indexOf(valuesArray, record.get(this.dataIndex)) > -1;
    }
});
Ext.define('PumaMain.view.LayerPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.layerpanel',
    requires: ['Ext.ux.RowExpander'],
    cls: 'layerpanel',
    initComponent: function() {

        var me = this;
        this.tabBar = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {flex: 1}
        };

        this.items = [
            {
                xtype: 'treepanel',
                itemId: 'layerpanel',
                id: 'layeravailablepanel',
                helpId: 'Availablelayers',
                hideHeaders: true,
                store: Ext.StoreMgr.lookup('layers'),
                displayField: 'name',
                rootVisible: false,
                title: polyglot.t('availableLayers'),
                border: true,
                viewConfig: {
                    autoScroll: false,
                    overflowY: 'auto',
                    getRowClass: function(rec) {
                        return rec.get('type')=='topiclayer' ? 'has-metadata' : '';
                    }
                },
                columns: [{
                    xtype: 'treecolumn',
                    dataIndex: 'name',
                    sortable: false,
                    menuDisabled: true,
                    flex: 1,
                    renderer : function(value, metadata, store) {
                        var data = store.data;

                        // prepare a unique id
                        var id = data.type;
                        if (data.type == "chartlayer"){
                            id += "-" + data.attributeSet + "-" + data.attribute;
                        } else if (data.type == "topiclayer"){
                            if (data.symbologyId == "#blank#"){
                                id += "-" + data.at;
                            } else {
                                id += "-" + data.at + "-" + data.symbologyId;
                            }
                        } else if (data.type == "wmsLayer"){
                            id += "-" + data.id;
                        }

                        metadata.tdAttr = 'data-qtip="' + value + '" data-for="' + id + '"';
                        return value;
                    },
                    header: polyglot.t('name')
                }
                ],
                style: {
                    borderRadius: '0px'
                }
            },

            {
                xtype: 'grid',
                itemId: 'layerselectedpanel',
                helpId: 'Selectedlayers',
                hideHeaders: true,
                id: 'layerselectedpanel',
                store: Ext.StoreMgr.lookup('selectedlayers'),
                viewConfig: {
                    plugins: {ptype: 'gridviewdragdrop'}
                },
                displayField: 'name',
                title: polyglot.t('selectedLayers'),
                bodyCls: 'layers-selected',
                border: true,
                columns: [
                    {
                        dataIndex: 'name',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        renderer : function(value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        },
                        header: polyglot.t('name')
                    }
                    , {
                        xtype: 'actioncolumn',
                        sortable: false,
                        menuDisabled: true,
                        width: 65,
                        items: [
                            {
                                icon: 'images/icons/opacity.png', // Use a URL in the icon config
                                tooltip: polyglot.t('opacity'),
                                helpId: 'Settinglayersopacity',
                                width: 16,
                                height: 16,
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('layeropacity',me,record)
                                }
                            },{
                                icon: 'images/icons/info.png', // Use a URL in the icon config
                                tooltip: polyglot.t('metadata'),
                                width: 16,
                                height: 16,
                                getClass: function(v,metadata,rec) {

                                    if (rec.get('type')!='topiclayer') {
                                        return 'invisible'
                                    }
                                },
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('showmetadata',me,record)
                                }
                            }
                            ,{
                                icon: 'images/icons/legend.png', // Use a URL in the icon config
                                tooltip: polyglot.t('openLegend'),
                                width: 16,
                                height: 16,
                                getClass: function(v,metadata,rec) {

                                    if (rec.get('type')!='chartlayer' && rec.get('type')!='topiclayer') {
                                        return 'invisible'
                                    }
                                    if (rec.get('legend')) {
                                        return 'invisiblecomplete';
                                    }
                                },
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('layerlegend',me,record,true)
                                }
                            }

                            ,{
                                icon: 'images/icons/legend-active.png', // Use a URL in the icon config
                                tooltip: polyglot.t('closeLegend'),
                                width: 16,
                                height: 16,
                                getClass: function(v,metadata,rec) {

                                    if (rec.get('type')!='chartlayer' && rec.get('type')!='topiclayer') {
                                        return 'invisible'
                                    }
                                    if (!rec.get('legend')) {
                                        return 'invisiblecomplete';
                                    }
                                },
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('layerlegend',me,record,false)
                                }
                            }
                        ]
                    }
                ],
                style: {
                    borderRadius: '0px'
                }
            }
        ];

        this.callParent();
        this.query('#layerselectedpanel')[0].on('afterrender',function() {
            Ext.get('layerselectedpanel').on('click',function(e,dom) {
                var el = Ext.get(dom);
                var panel = Ext.ComponentQuery.query('#layerselectedpanel')[0]
                var rec = panel.getView().getRecord(el.up('.x-grid-row'))
                var cls = el.getAttribute('class');
                var name = 'layeropacity';
                if (cls.search('legend')>-1) {
                    name = 'layerlegend';
                    el.toggleCls('checked')
                }
                else if (cls.search('metadata')>-1) {
                    name = 'showmetadata'
                }
                this.fireEvent(name,this,rec,el);

            },this,{delegate:'.layertool'})




        },this);

        this.query('#layerpanel')[0].on('afterrender',function() {
            Ext.get('layeravailablepanel').on('click',function(e,dom) {
                var el = Ext.get(dom);
                var panel = Ext.ComponentQuery.query('#layerpanel')[0]
                var rec = panel.getView().getRecord(el.up('.x-grid-row'))
                this.fireEvent('showmetadata',this,rec,el);

            },this,{delegate:'.x-tree-icon-leaf'})
        },this);

        this.addEvents('choroplethreconfigure','choroplethremove','layerremove','layeropacity','layerup','layerdown','checkchange','showmetadata','layerlegend');
    }
})


Ext.define('PumaMain.view.MapTools', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.maptools',
    columns: 4,
    helpId: 'Maptools',
    initComponent: function() {
        this.defaults = {
            height: 90,
            width: 60
        };
        this.layout = {
            type: 'table',
            columns: 4
        };
        var selectionButton = {
            xtype: 'button',
            enableToggle: true,
            itemId: 'hoverbtn',
            helpId: 'Selectiononhover',
            text: polyglot.t('hover'),
            iconAlign: 'top',
            icon: 'images/icons/tools-hover.png',
            cls: 'custom-button btn-map-tool btn-tool-hover',
            scale: 'large'
        };
        if (Config.toggles.useTopToolbar) {
            selectionButton = {
                xtype: 'button',
                enableToggle: true,
                itemId: 'selectinmapbtn',
                helpId: 'Selectingunitsinmap',
                text: polyglot.t('selectInMap'),
                iconAlign: 'top',
                icon: 'images/new/map-select.png',
                cls: 'custom-button btn-map-tool btn-tool-select',
                scale: 'large'
            };
        }
        this.items = [selectionButton,{
            xtype: 'button',
            itemId: 'zoomselectedbtn',
            helpId: 'Zoomingtoselectedunits',
            text: polyglot.t('zoomSelected'),
            iconAlign: 'top',
            icon: 'images/icons/tools-zoom.png',
            cls: 'custom-button btn-map-tool btn-tool-zoom-selected',
            scale: 'large'
        },{
            xtype: 'button',
            enableToggle: true,
            helpId: 'Measuringdistance',
            toggleGroup: 'mapmodal',
            itemId: 'measurelinebtn',
            text: polyglot.t('measureLine'),
            iconAlign: 'top',
            icon: 'images/icons/tools-measure-line.png',
            cls: 'custom-button btn-map-tool btn-tool-measure-line',
            scale: 'large'
        },{
            xtype: 'button',
            enableToggle: true,
            toggleGroup: 'mapmodal',
            itemId: 'measurepolygonbtn',
            helpId: 'Measuringpolygonarea',
            text: polyglot.t('measurePolygon'),
            iconAlign: 'top',
            icon: 'images/icons/tools-measure-polygon.png',
            cls: 'custom-button btn-map-tool btn-tool-measure-polygon',
            scale: 'large'
        },{
            xtype: 'button',
            itemId: 'multiplemapsbtn',
            helpId: 'Multiplemaps',
            enableToggle: true,
            hidden: Config.toggles.useNewViewSelector,
            text: polyglot.t('multipleMaps'),
            iconAlign: 'top',
            icon: 'images/icons/tools-maps-multiple.png',
            cls: 'custom-button btn-map-tool btn-tool-multiple-maps',
            scale: 'large'
        },{
            xtype: 'button',
            text: polyglot.t('saveAsImage'),
            itemId: 'savemapbtn',
            helpId: 'Savingmapasimage',
            icon: 'images/icons/tools-save.png',
            iconAlign: 'top',
            cls: 'custom-button btn-map-tool btn-tool-save-image',
            scale: 'large',
            hidden: true //to be removed, duplicates functionality of snapshots
        }];
        if(Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo){
            this.items.unshift({
                xtype: 'button',
                enableToggle: true,
                itemId: 'featureInfoBtn',
                helpId: 'FeatureInfo',
                text: polyglot.t('featureInfo'),
                iconAlign: 'top',
                icon: 'images/new/tool-feature-info.png',
                cls: 'custom-button btn-map-tool btn-tool-feature-info',
                scale: 'large'
            })
        }

        this.callParent();

    }
})

Ext.define('Gisatlib.slider.DiscreteTimeline', {
    extend: 'Ext.slider.Multi',
    alias: 'widget.discretetimeline',
    requires: ['Gisatlib.slider.DiscreteThumb'],
    mixins: ['Ext.util.Bindable','Ext.form.field.Field'],
    clickToChange: false,
    initComponent: function() {
        this.fieldSubTpl[0] = '<div class="timeline-labels"></div>'+this.fieldSubTpl[0];


        this.displayField = this.displayField || 'name';
        this.valueField = this.valueField || '_id';

        this.callParent();
        if (this.store) {
            this.bindStore(this.store);
        }
    },

    getStoreListeners: function() {
        return {
            datachanged: this.refresh
        }
    },

    refresh: function() {
        var me = this;
        if (!me.store) {
            return;
        }

        var value = this.getValue();
        var presentValues = this.store.collect(this.valueField);
        var newValues = Ext.Array.intersect(value,presentValues);
        if (!newValues.length && !this.allowBlank) {
            newValues.push(presentValues[presentValues.length-1]);
        }
        var years = this.store.collect(this.displayField);
        years = Ext.Array.map(years,function(v) {
            return parseInt(v);
        })
        years = Ext.Array.sort(years);
        //this.setVisible(years.length>0);
        if (years.length<1) return;
        var min = years[0];
        var max = years[years.length-1];
        var valOffset = (max-min)*0.09;
        this.setMinValue(years.length>1 ? years[0]-valOffset : years[0]-1);
        this.setMaxValue(years.length>1 ? years[years.length-1]+valOffset : years[0]+1);
        this.syncThumbCount(years);

        var valueChanged = Ext.Array.difference(value,newValues).length || Ext.Array.difference(newValues,value).length
        this.setValue(newValues,!valueChanged);
        //Ext.slider.Multi.prototype.setValue.call(this,years);
        window.setTimeout(function() {
            me.updateLabels();
        },1)



//        labelEl.setHTML(value);
//        var offset = 0;
//
//        labelEl.alignTo(thumb.el,"b-t",[0,0]);
//        if (isFirst && labelEl.dom.offsetLeft<2) {
//            offset = 2 - labelEl.dom.offsetLeft
//        }
//        else if (labelEl.dom.offsetParent && labelEl.dom.offsetLeft+labelEl.dom.offsetWidth>labelEl.dom.offsetParent.offsetWidth-2){
//            offset = -(labelEl.dom.offsetLeft+labelEl.dom.offsetWidth-labelEl.dom.offsetParent.offsetWidth+2);
//        }
//        if (offset) {
//            labelEl.alignTo(thumb.el,"b-t",[offset,0]);
//        }

    },
    syncThumbCount: function(values) {
        var thumbCount = this.thumbs.length
        for (var i=0;i<thumbCount;i++) {
            var thumb = this.thumbs[i];
            if (thumb.labelEl) thumb.labelEl.destroy();
            thumb.el.destroy();
        }
        this.thumbs = [];
        for (var i=0;i<values.length;i++) {
            this.addThumb(values[i]);
        }

    },

    addThumb: function(value) {
        if (!this.store || !this.store.isStore) {
            return;
        }

        var rec = this.store.findRecord(this.displayField,value);
        var recValue = rec ? rec.get(this.valueField) : null;

        var me = this,
            thumb = new Gisatlib.slider.DiscreteThumb({
                ownerCt     : me,
                ownerLayout : me.getComponentLayout(),
                value       : value,
                recValue    : recValue,
                slider      : me,
                index       : me.thumbs.length,
                constrain   : me.constrainThumbs,
                disabled    : !!me.readOnly
            });

        me.thumbs.push(thumb);
        //render the thumb now if needed
        if (me.rendered) {
            thumb.render();
        }

        return thumb;
    },

    updateLabels: function() {
        var cont = this.el.down('.timeline-labels');
        cont.update('');
        for (var i=0;i<this.thumbs.length;i++) {
            var thumb = this.thumbs[i];
            var labelEl = Ext.get(Ext.DomHelper.createDom({cls:'timeline-label',tag:'span',html:thumb.value}));
            cont.appendChild(labelEl);
            var offset = 0;

            labelEl.alignTo(thumb.el,"b-t",[0,3]);
            if (i==0 && labelEl.dom.offsetLeft<2) {
                offset = 2 - labelEl.dom.offsetLeft
            }
            else if (labelEl.dom.offsetParent && labelEl.dom.offsetLeft+labelEl.dom.offsetWidth>labelEl.dom.offsetParent.offsetWidth-2){
                offset = -(labelEl.dom.offsetLeft+labelEl.dom.offsetWidth-labelEl.dom.offsetParent.offsetWidth+2);
            }
            if (offset) {
                labelEl.alignTo(thumb.el,"b-t",[0,3]);
            }
            thumb.labelEl = labelEl;
        }
    },

    getValue: function() {
        var value = [];
        for (var i=0;i<this.thumbs.length;i++) {
            var thumb = this.thumbs[i];
            if (thumb.el && thumb.el.hasCls(Ext.baseCSSPrefix + 'slider-thumb-drag')) {
                value.push(thumb.recValue);
            }
        }
        return value;
    },
    setValue: function(value,disableChange) {
        value = Ext.isArray(value) ? value : [value];
        var changed = false;
        for (var i=0;i<this.thumbs.length;i++) {
            var thumb = this.thumbs[i];
            if (Ext.Array.contains(value,thumb.recValue)) {
                thumb.el.addCls(Ext.baseCSSPrefix + 'slider-thumb-drag');
                changed = true;
            }
            else {
                thumb.el.removeCls(Ext.baseCSSPrefix + 'slider-thumb-drag');
                changed = true;
            }

        }

        if (!disableChange) {
            this.fireEvent('change',this,this.getValue());
        }
        return value;
    },


})


Ext.define('PumaMain.view.AreaTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.areatree',

    // itemId: 'areatree',
    // cls: 'areaTreeSelection',
    // helpId: 'TreeofanalyticalunitsAREAS',

    collapsed: !Config.toggles.useTopToolbar,
    selModel: {
        mode: 'MULTI'
    },
    rootVisible: false,
    displayField: 'name',

    requires: ['Ext.ux.CheckColumn', 'Ext.grid.plugin.CellEditing'],
    initComponent: function () {
        this.store = Ext.StoreMgr.lookup('area');

        this.callParent();
    }
});

Ext.define('Puma.patch.data.Store',{
    override: 'Ext.data.Store',



    load: function() {
        this.callParent();
        if (!this.loadEventPrepared) {
            this.on('load',this.syncLoad);
            this.loadEventPrepared = true;
        }
    },

    syncLoad: function() {
        var stores = this.findMasterSlaves();
        for (var i=0;i<stores.length;i++) {
            var store = stores[i];
            if (store.slave) {
                store.load();
            }
        }
    },

    filter: function(filters,value) {
        if (!filters) {
            filters = this.filters.getRange();
            this.clearFilter(true);
        }
        this.callParent(filters,value)
    },

    addWithSlaves: function(model) {
        var stores = this.findMasterSlaves();
        for (var i = 0; i < stores.length; i++) {
            var store = stores[i];
            if (this != store) {
                store.addSorted(model);
            }
        }
        this.addSorted(model);
    },

    findMasterSlaves: function() {
        var model = this.model.$className;
        var stores = Ext.StoreMgr.getRange();
        var foundStores = [];
        for (var i=0;i<stores.length;i++) {
            var store = stores[i];
            if (store.model.$className == model && !store.independent) {
                foundStores.push(store);
            }
        }
        return foundStores;
    }
})


Ext.define('Puma.patch.data.Model',{
    override: 'Ext.data.Model',

    destroy: function(options) {
        options = Ext.apply({
            records: [this],
            action : 'destroy'
        }, options);

        var me = this,
            isNotPhantom = me.phantom !== true,
            scope  = options.scope || me,
            stores = me.stores,
            store,
            args,
            operation,
            callback;
        operation = new Ext.data.Operation(options);
        callback = function(operation) {
            args = [me, operation];
            if (operation.wasSuccessful()) {
                for(var i = stores.length-1; i >= 0; i--) {
                    store = stores[i];

                    // Remove this record from Store. Avoid Store handling anything by passing the "isMove" flag
                    store.remove(me, true);
                    if (isNotPhantom) {
                        store.fireEvent('write', store, operation);
                    }
                }
                me.clearListeners();
                Ext.callback(options.success, scope, args);
            } else {
                Ext.callback(options.failure, scope, args);
            }
            Ext.callback(options.callback, scope, args);
        };

        // Not a phantom, then we must perform this operation on the remote datasource.
        // Record will be removed from the store in the callback upon a success response
        if (isNotPhantom) {
            me.getProxy().destroy(operation, callback, me);
        }
        // If it's a phantom, then call the callback directly with a dummy successful ResultSet
        else {
            operation.complete = operation.success = true;
            operation.resultSet = me.getProxy().reader.nullResultSet;
            callback(operation);
        }
        return me;
    }
})

Ext.define('Puma.patch.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',
    onDataChanged: function() {
        this.callParent();
        var index = this.store.find(this.valueField, this.value);
        if (index == -1) {
            this.setValue(null);
        }
    }
})



Ext.define('Puma.patch.form.field.Base', {
    override: 'Ext.form.field.Base',
    initComponent: function() {
        this.callParent();
        this.on('enable',function() {
            this.validate();
        });
        this.toBeEnabled = !this.disabled;
    }
//    ,
//
//    enable: function(silent) {
//
//        this.toBeEnabled = true;
//        if (this.internalDisabled) {
//            return this;
//        }
//        return this.callParent(silent);
//    },
//
//    disable: function(silent) {
//        var ret = this.callParent(silent);
//
//        if (this.internalDisabled) {
//            return this;
//        }
//        this.toBeEnabled = false;
//        return ret;
//    }


})


Ext.define('Puma.patch.form.ItemSelector', {
    override: 'Ext.ux.form.ItemSelector',
    initComponent: function() {
        this.callParent();
        this.store.on('refresh',this.onDataChanged,this);
    },

    onDataChanged: function() {
        if (!this.store) return;


        var me = this;
        window.setTimeout(function() {
            var value = me.value || [];
            var storeValues = me.store.collect(me.valueField);
            var newValue = Ext.Array.intersect(value,storeValues);
            me.bindStore(me.store);
            me.setValue(newValue);
        },1)
    },

    onBindStore: function(store, initial) {
        var me = this;

        if (me.fromField) {
            me.fromField.store.removeAll()
            me.toField.store.removeAll();

            me.populateFromStore(store);

        }
    },
})


Ext.define('Puma.patch.data.proxy.Server', {
    override: 'Ext.data.proxy.Server',
    setException: function(operation, response) {
        operation.setException({
            status: response.status,
            statusText: response.statusText,
            response: response
        });
    }

});

Ext.define('Puma.patch.dd.DropZone', {
    override: 'Ext.dd.DropZone',

    notifyDrop : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
        var n = this.getTargetFromEvent(e);
        dd.view.store.dragging = true;
        var ret = n ?
            this.onNodeDrop(n, dd, e, data) :
            this.onContainerDrop(dd, e, data);
        dd.view.store.dragging = false;
        return ret;
    },
})



Ext.define('Puma.patch.picker.Color', {
    override: 'Ext.picker.Color',
    select: function(color, suppressEvent) {

        var me = this,
            selectedCls = me.selectedCls,
            value = me.value,
            el;

        if (!me.rendered) {
            if (me.allowToggle && Ext.isArray(color)) {

                me.xValue = [];
                me.value = [];
                for (var i=0;i<color.length;i++) {
                    var partColor = color[i];
                    partColor = partColor.replace('#', '').toLowerCase();
                    Ext.Array.include(me.xValue,partColor);
                }
            }
            else {

                color = color.replace('#', '').toLowerCase();
                me.value = color;
            }

            return;
        }
        if (Ext.isArray(color)) {
            color = null;
        }
        else {
            color = color.replace('#', '').toLowerCase();
        }
        if (me.allowToggle) {

            value = me.xValue || ((value && Ext.isArray(value)) ? value : []);
            me.xValue = null;
            if (Ext.Array.contains(value,color) && color) {
                value = Ext.Array.difference(value,[color])
            }
            else if (color) {
                Ext.Array.include(value,color)
            }
            el = me.el;

            for (var i=0;i<me.colors.length;i++) {
                var partColor = me.colors[i];
                if (Ext.Array.contains(value,partColor)) {
                    el.down('a.color-' + partColor).addCls(selectedCls);
                }
                else {
                    el.down('a.color-' + partColor).removeCls(selectedCls);
                }
            }

            me.value = value;
            if (suppressEvent !== true) {
                me.fireEvent('select', me, value);
            }
        }


        else if (color != value || me.allowReselect) {
            el = me.el;

            if (me.value) {
                el.down('a.color-' + value).removeCls(selectedCls);
            }
            el.down('a.color-' + color).addCls(selectedCls);
            me.value = color;
            if (suppressEvent !== true) {
                me.fireEvent('select', me, color);
            }
        }
    }
})

Ext.define('Puma.patch.Component', {
    override: 'Ext.Component',
    initComponent: function() {
        this.callParent();

//        this.on('render',function(cmp) {
//            cmp.suspendEvents();
//            //cmp.getEl().purgeAllListeners();
//            cmp.getEl().on('mousedown', this.onHelpClick, this, {
//
//                stopEvent : true
//            });
//        })
    },

    onHelpClick: function(a,b,c) {
        a.preventDefault();
    }
})

Ext.define('Puma.patch.EventManager', {
    override: 'Ext.EventManager',
    createListenerWrap : function(dom, ename, fn, scope, options) {
        options = options || {};

        var f, gen, escapeRx = /\\/g, wrap = function(e, args) {
            // Compile the implementation upon first firing
            if (!gen) {
                f = ['if(!' + Ext.name + ') {return;}'];
                // 2 radky navic zde
                f.push('if(Config.contextHelp && e.type=="mouseover") {PumaMain.controller.Help.onHelpOver(e);return;}')
                f.push('if(Config.contextHelp && e.type=="click") {PumaMain.controller.Help.onHelpClick(e);return;}')
                if(options.buffer || options.delay || options.freezeEvent) {
                    if (options.freezeEvent) {
                        // If we're freezing, we still want to update the singleton event object
                        // as well as returning a frozen copy
                        f.push('e = X.EventObject.setEvent(e);');
                    }
                    f.push('e = new X.EventObjectImpl(e, ' + (options.freezeEvent ? 'true' : 'false' ) + ');');
                } else {
                    f.push('e = X.EventObject.setEvent(e);');
                }

                if (options.delegate) {
                    // double up '\' characters so escape sequences survive the
                    // string-literal translation
                    f.push('var result, t = e.getTarget("' + (options.delegate + '').replace(escapeRx, '\\\\') + '", this);');
                    f.push('if(!t) {return;}');
                } else {
                    f.push('var t = e.target, result;');
                }

                if (options.target) {
                    f.push('if(e.target !== options.target) {return;}');
                }

                if(options.stopEvent) {
                    f.push('e.stopEvent();');
                } else {
                    if(options.preventDefault) {
                        f.push('e.preventDefault();');
                    }
                    if(options.stopPropagation) {
                        f.push('e.stopPropagation();');
                    }
                }

                if(options.normalized === false) {
                    f.push('e = e.browserEvent;');
                }

                if(options.buffer) {
                    f.push('(wrap.task && clearTimeout(wrap.task));');
                    f.push('wrap.task = setTimeout(function() {');
                }

                if(options.delay) {
                    f.push('wrap.tasks = wrap.tasks || [];');
                    f.push('wrap.tasks.push(setTimeout(function() {');
                }

                // finally call the actual handler fn
                f.push('result = fn.call(scope || dom, e, t, options);');

                if(options.single) {
                    f.push('evtMgr.removeListener(dom, ename, fn, scope);');
                }

                // Fire the global idle event for all events except mousemove which is too common, and
                // fires too frequently and fast to be use in tiggering onIdle processing. Do not fire on page unload.
                if (ename !== 'mousemove' && ename !== 'unload') {
                    f.push('if (evtMgr.idleEvent.listeners.length) {');
                    f.push('evtMgr.idleEvent.fire();');
                    f.push('}');
                }

                if(options.delay) {
                    f.push('}, ' + options.delay + '));');
                }

                if(options.buffer) {
                    f.push('}, ' + options.buffer + ');');
                }
                f.push('return result;')

                gen = Ext.cacheableFunctionFactory('e', 'options', 'fn', 'scope', 'ename', 'dom', 'wrap', 'args', 'X', 'evtMgr', f.join('\n'));
            }

            return gen.call(dom, e, options, fn, scope, ename, dom, wrap, args, Ext, Ext.EventManager);
        };
        return wrap;
    }
})


Ext.define('Puma.patch.view.Table', {
    override: 'Ext.view.Table',
    refreshSize: function() {
        if (!this.dontRefreshSize) {
            this.callParent();
        }
    }
});


Ext.define('Puma.patch.panel.Panel', {
    override: 'Ext.panel.Panel',
    initComponent: function() {
        this.header = this.header !== false && (this.title || this.xtype=='window') ? {
            height: 31,
            collapseLeft: this.collapseLeft,
            collapseRight: this.collapseRight,
            leftMargin: this.leftMargin,
            topMargin: this.topMargin,
            leftSpace: this.leftSpace
        } : false;
        this.callParent();
    }
})

Ext.define('Puma.patch.panel.Tool', {
    override: 'Ext.panel.Tool',
    initComponent: function() {
        this.height = 22;
        this.width = 22;
        this.margin = '0 0 0 5';
        this.callParent();
    },
})


Ext.define('Puma.patch.panel.Header', {
    override: 'Ext.panel.Header',
    initComponent: function() {
        {
            var me = this;

            me.addEvents(
                /**
                 * @event click
                 * Fires when the header is clicked. This event will not be fired
                 * if the click was on a {@link Ext.panel.Tool}
                 * @param {Ext.panel.Header} this
                 * @param {Ext.EventObject} e
                 */
                'click',
                /**
                 * @event dblclick
                 * Fires when the header is double clicked. This event will not
                 * be fired if the click was on a {@link Ext.panel.Tool}
                 * @param {Ext.panel.Header} this
                 * @param {Ext.EventObject} e
                 */
                'dblclick'
            );

            me.indicateDragCls = me.baseCls + '-draggable';
            me.title = me.title || '&#160;';
            me.tools = me.tools || [];
            me.items = me.items || [];
            me.orientation = me.orientation || 'horizontal';
            me.dock = (me.dock) ? me.dock : (me.orientation == 'horizontal') ? 'top' : 'left';

            //add the dock as a ui
            //this is so we support top/right/left/bottom headers
            me.addClsWithUI([me.orientation, me.dock]);

            if (me.indicateDrag) {
                me.addCls(me.indicateDragCls);
            }

            // Add Icon
            if (!Ext.isEmpty(me.iconCls) || !Ext.isEmpty(me.icon)) {
                me.initIconCmp();
                me.iconCmp.margin = '0 5 0 0';
                me.items.push(me.iconCmp);
            }

            // Add Title
            me.titleCmp = new Ext.Component({
                ariaRole: 'heading',
                focusable: false,
                noWrap: true,
                flex: 1,
                id: me.id + '_hd',
                style: 'text-align:' + me.titleAlign,
                cls: me.baseCls + '-text-container',
                renderTpl: me.getTpl('headingTpl'),
                renderData: {
                    title: me.title,
                    cls: me.baseCls,
                    ui: me.ui
                },
                childEls: ['textEl'],
                listeners: {
                    render: me.onTitleRender,
                    scope: me
                }
            });
            me.layout = (me.orientation == 'vertical') ? {
                type: 'vbox',
                align: 'center'
            } : {
                type: 'hbox',
                align: 'middle'
            };
            me.items.push(me.titleCmp);

            // Add Tools
            me.items = me.items.concat(me.tools);
            // clear the tools so we can have only the instances
            me.tools = [];
            var collapseTool = null
            for (var i=0;i<me.items.length;i++) {
                var item = me.items[i];
                if (item.type=='collapse-top' || item.type=='expand-bottom') {

                    collapseTool = item;
                    break;
                }
            }
            if (collapseTool && me.collapseLeft) {
                Ext.Array.remove(me.items,collapseTool)
                Ext.Array.insert(me.items,0,[collapseTool])
                collapseTool.margin = (me.topMargin || '0') + ' 10 0 '+(me.leftMargin || '-5');
            }
            if (collapseTool && me.collapseRight) {
                Ext.Array.remove(me.items,collapseTool)
                Ext.Array.insert(me.items,me.items.length,[collapseTool])
                //collapseTool.margin = '0 10 0 -5';
            }
            me.callSuper();

            me.on({
                dblclick: me.onDblClick,
                click: me.onClick,
                element: 'el',
                scope: me
            });
        }

    },
    initIconCmp: function() {
        var me = this,
            cfg = {
                focusable: false,
                src: Ext.BLANK_IMAGE_URL,
                cls: [me.baseCls + '-icon', me.iconCls],
                id: me.id + '-iconEl',
                margin: '0 0 0 '+me.leftSpace || 5,
                iconCls: me.iconCls
            };

        if (!Ext.isEmpty(me.icon)) {
            delete cfg.iconCls;
            cfg.src = me.icon;
        }

        me.iconCmp = new Ext.Img(cfg);
    }
})


Ext.define('Puma.patch.tree.View', {
    override: 'Ext.tree.View',
    onCheckboxChange: function(e,t) {
        this.lastE = e;
        this.callParent(arguments);
    }

})


Ext.define('Puma.patch.button.Button',{
    override: 'Ext.button.Button',



    initComponent: function() {
        this.persistentPadding = [0,0,0,0];
        this.callParent();

    }

})


Ext.define('Puma.view.container.Common', {
    extend: 'Ext.container.Container',
    alias: 'widget.commoncontainer',
    frame: false,
    border: 0,
    requires: [],
    initComponent: function() {
        this.layout = {
            type: 'hbox',
            align: 'stretchmax',
            pack: 'center'
        }
        this.callParent();
    }
});

Ext.define('Puma.view.form.DefaultComboBox',{
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.pumacombo',
    queryMode: 'local',
    valueField: '_id',
    displayField: 'name',
    editable: false,

    //trigger2Cls: 'x-form-clear-trigger',

    // kod z http://stackoverflow.com/questions/13830537/extjs4-add-an-empty-option-in-a-combobox pro mazani komba
    initComponent: function () {
        var me = this;


        me.addEvents(
            /**
             * @event beforeclear
             *
             * @param {FilterCombo} FilterCombo The filtercombo that triggered the event
             */
            'beforeclear',
            /**
             * @event beforeclear
             *
             * @param {FilterCombo} FilterCombo The filtercombo that triggered the event
             */
            'clear'
        );

        me.callParent(arguments);

        me.on('specialkey', this.onSpecialKeyDown, me);
//        me.on('select', function (me, rec) {
//            me.onShowClearTrigger(true);
//        }, me);
        //me.on('afterrender', function () { me.onShowClearTrigger(false); }, me);
    },

    /**
     * @private onSpecialKeyDown
     * eventhandler for special keys
     */
    onSpecialKeyDown: function (obj, e, opt) {
        if ( e.getKey() == e.ESC || e.getKey() == e.DELETE)
        {
            this.clear();
        }
    },

    onShowClearTrigger: function (show) {
        var me = this;

        if (show) {
            me.triggerEl.each(function (el, c, i) {
                if (i === 1) {
                    el.setWidth(el.originWidth, false);
                    el.setVisible(true);
                    me.active = true;
                }
            });
        } else {
            me.triggerEl.each(function (el, c, i) {
                if (i === 1) {
                    el.originWidth = el.getWidth();
                    el.setWidth(0, false);
                    el.setVisible(false);
                    me.active = false;
                }
            });
        }
        // ToDo -> Version specific methods
        if (Ext.lastRegisteredVersion.shortVersion > 407) {
            me.updateLayout();
        } else {
            me.updateEditState();
        }
    },

    /**
     * @override onTrigger2Click
     * eventhandler
     */
    onTrigger2Click: function (args) {
        //this.clear();
    },

    /**
     * @private clear
     * clears the current search
     */
    clear: function () {
        var me = this;
        me.fireEvent('beforeclear', me);
        me.clearValue();
        me.onShowClearTrigger(false);
        me.fireEvent('clear', me);
    },

    getValue: function() {
        var value = this.callParent();
        if (this.multiSelect && !Ext.isArray(value)) {
            value = value.split(',');
        }
        if (Ext.isArray(value)) {
            value = value.length ? value : null;
        }
        return value;
    }


})

Ext.define('Puma.model.ColumnMap', {
    extend: 'Ext.data.Model',
    fields: [

        'column','attribute'
    ],
    idProperty: 'attribute',
    proxy: 'memory'
});


Ext.define('Puma.model.Column', {
    extend: 'Ext.data.Model',
    fields: [

        'column'
    ],
    idProperty: 'column',
    proxy: 'memory'
});


/**
 * Abstract base class for filter implementations.
 */
Ext.define('Ext.ux.grid.filter.Filter', {
    extend: 'Ext.util.Observable',

    /**
     * @cfg {Boolean} active
     * Indicates the initial status of the filter (defaults to false).
     */
    active : false,
    /**
     * True if this filter is active.  Use setActive() to alter after configuration.
     * @type Boolean
     * @property active
     */
    /**
     * @cfg {String} dataIndex
     * The {@link Ext.data.Store} dataIndex of the field this filter represents.
     * The dataIndex does not actually have to exist in the store.
     */
    dataIndex : null,
    /**
     * The filter configuration menu that will be installed into the filter submenu of a column menu.
     * @type Ext.menu.Menu
     * @property
     */
    menu : null,
    /**
     * @cfg {Number} updateBuffer
     * Number of milliseconds to wait after user interaction to fire an update. Only supported
     * by filters: 'list', 'numeric', and 'string'. Defaults to 500.
     */
    updateBuffer : 500,

    constructor : function (config) {
        Ext.apply(this, config);

        this.addEvents(
            /**
             * @event activate
             * Fires when an inactive filter becomes active
             * @param {Ext.ux.grid.filter.Filter} this
             */
            'activate',
            /**
             * @event deactivate
             * Fires when an active filter becomes inactive
             * @param {Ext.ux.grid.filter.Filter} this
             */
            'deactivate',
            /**
             * @event serialize
             * Fires after the serialization process. Use this to attach additional parameters to serialization
             * data before it is encoded and sent to the server.
             * @param {Array/Object} data A map or collection of maps representing the current filter configuration.
             * @param {Ext.ux.grid.filter.Filter} filter The filter being serialized.
             */
            'serialize',
            /**
             * @event update
             * Fires when a filter configuration has changed
             * @param {Ext.ux.grid.filter.Filter} this The filter object.
             */
            'update'
        );
        Ext.ux.grid.filter.Filter.superclass.constructor.call(this);

        this.menu = this.createMenu(config);
        this.init(config);
        if(config && config.value){
            this.setValue(config.value);
            this.setActive(config.active !== false, true);
            delete config.value;
        }
    },

    /**
     * Destroys this filter by purging any event listeners, and removing any menus.
     */
    destroy : function(){
        if (this.menu){
            this.menu.destroy();
        }
        this.clearListeners();
    },

    /**
     * Template method to be implemented by all subclasses that is to
     * initialize the filter and install required menu items.
     * Defaults to Ext.emptyFn.
     */
    init : Ext.emptyFn,

    /**
     * @private @override
     * Creates the Menu for this filter.
     * @param {Object} config Filter configuration
     * @return {Ext.menu.Menu}
     */
    createMenu: function(config) {
        return Ext.create('Ext.menu.Menu', config);
    },

    /**
     * Template method to be implemented by all subclasses that is to
     * get and return the value of the filter.
     * Defaults to Ext.emptyFn.
     * @return {Object} The 'serialized' form of this filter
     * @methodOf Ext.ux.grid.filter.Filter
     */
    getValue : Ext.emptyFn,

    /**
     * Template method to be implemented by all subclasses that is to
     * set the value of the filter and fire the 'update' event.
     * Defaults to Ext.emptyFn.
     * @param {Object} data The value to set the filter
     * @methodOf Ext.ux.grid.filter.Filter
     */
    setValue : Ext.emptyFn,

    /**
     * Template method to be implemented by all subclasses that is to
     * return <tt>true</tt> if the filter has enough configuration information to be activated.
     * Defaults to <tt>return true</tt>.
     * @return {Boolean}
     */
    isActivatable : function(){
        return true;
    },

    /**
     * Template method to be implemented by all subclasses that is to
     * get and return serialized filter data for transmission to the server.
     * Defaults to Ext.emptyFn.
     */
    getSerialArgs : Ext.emptyFn,

    /**
     * Template method to be implemented by all subclasses that is to
     * validates the provided Ext.data.Record against the filters configuration.
     * Defaults to <tt>return true</tt>.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord : function(){
        return true;
    },

    /**
     * Returns the serialized filter data for transmission to the server
     * and fires the 'serialize' event.
     * @return {Object/Array} An object or collection of objects containing
     * key value pairs representing the current configuration of the filter.
     * @methodOf Ext.ux.grid.filter.Filter
     */
    serialize : function(){
        var args = this.getSerialArgs();
        this.fireEvent('serialize', args, this);
        return args;
    },

    /** @private */
    fireUpdate : function(){
        if (this.active) {
            this.fireEvent('update', this);
        }
        this.setActive(this.isActivatable());
    },

    /**
     * Sets the status of the filter and fires the appropriate events.
     * @param {Boolean} active        The new filter state.
     * @param {Boolean} suppressEvent True to prevent events from being fired.
     * @methodOf Ext.ux.grid.filter.Filter
     */
    setActive : function(active, suppressEvent){
        if(this.active != active){
            this.active = active;
            if (suppressEvent !== true) {
                this.fireEvent(active ? 'activate' : 'deactivate', this);
            }
        }
    }
});
/**
 * Filter by a configurable Ext.picker.DatePicker menu
 *
 * Example Usage:
 *
 *     var filters = Ext.create('Ext.ux.grid.GridFilters', {
 *         ...
 *         filters: [{
 *             // required configs
 *             type: 'date',
 *             dataIndex: 'dateAdded',
 *
 *             // optional configs
 *             dateFormat: 'm/d/Y',  // default
 *             beforeText: 'Before', // default
 *             afterText: 'After',   // default
 *             onText: 'On',         // default
 *             pickerOpts: {
 *                 // any DatePicker configs
 *             },
 *
 *             active: true // default is false
 *         }]
 *     });
 */
Ext.define('Ext.ux.grid.filter.DateFilter', {
    extend: 'Ext.ux.grid.filter.Filter',
    alias: 'gridfilter.date',
    uses: ['Ext.picker.Date', 'Ext.menu.Menu'],

    /**
     * @cfg {String} afterText
     * Defaults to 'After'.
     */
    afterText : 'After',
    /**
     * @cfg {String} beforeText
     * Defaults to 'Before'.
     */
    beforeText : 'Before',
    /**
     * @cfg {Object} compareMap
     * Map for assigning the comparison values used in serialization.
     */
    compareMap : {
        before: 'lt',
        after:  'gt',
        on:     'eq'
    },
    /**
     * @cfg {String} dateFormat
     * The date format to return when using getValue.
     * Defaults to 'm/d/Y'.
     */
    dateFormat : 'm/d/Y',

    /**
     * @cfg {Date} maxDate
     * Allowable date as passed to the Ext.DatePicker
     * Defaults to undefined.
     */
    /**
     * @cfg {Date} minDate
     * Allowable date as passed to the Ext.DatePicker
     * Defaults to undefined.
     */
    /**
     * @cfg {Array} menuItems
     * The items to be shown in this menu
     * Defaults to:<pre>
     * menuItems : ['before', 'after', '-', 'on'],
     * </pre>
     */
    menuItems : ['before', 'after', '-', 'on'],

    /**
     * @cfg {Object} menuItemCfgs
     * Default configuration options for each menu item
     */
    menuItemCfgs : {
        selectOnFocus: true,
        width: 125
    },

    /**
     * @cfg {String} onText
     * Defaults to 'On'.
     */
    onText : 'On',

    /**
     * @cfg {Object} pickerOpts
     * Configuration options for the date picker associated with each field.
     */
    pickerOpts : {},

    /**
     * @private
     * Template method that is to initialize the filter and install required menu items.
     */
    init : function (config) {
        var me = this,
            pickerCfg, i, len, item, cfg;

        pickerCfg = Ext.apply(me.pickerOpts, {
            xtype: 'datepicker',
            minDate: me.minDate,
            maxDate: me.maxDate,
            format:  me.dateFormat,
            listeners: {
                scope: me,
                select: me.onMenuSelect
            }
        });

        me.fields = {};
        for (i = 0, len = me.menuItems.length; i < len; i++) {
            item = me.menuItems[i];
            if (item !== '-') {
                cfg = {
                    itemId: 'range-' + item,
                    text: me[item + 'Text'],
                    menu: Ext.create('Ext.menu.Menu', {
                        items: [
                            Ext.apply(pickerCfg, {
                                itemId: item,
                                listeners: {
                                    select: me.onPickerSelect,
                                    scope: me
                                }
                            })
                        ]
                    }),
                    listeners: {
                        scope: me,
                        checkchange: me.onCheckChange
                    }
                };
                item = me.fields[item] = Ext.create('Ext.menu.CheckItem', cfg);
            }
            //me.add(item);
            me.menu.add(item);
        }
        me.values = {};
    },

    onCheckChange : function (item, checked) {
        var me = this,
            picker = item.menu.items.first(),
            itemId = picker.itemId,
            values = me.values;

        if (checked) {
            values[itemId] = picker.getValue();
        } else {
            delete values[itemId]
        }
        me.setActive(me.isActivatable());
        me.fireEvent('update', me);
    },

    /**
     * @private
     * Handler method called when there is a keyup event on an input
     * item of this menu.
     */
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
            this.menu.hide();
        }
    },

    /**
     * Handler for when the DatePicker for a field fires the 'select' event
     * @param {Ext.picker.Date} picker
     * @param {Object} date
     */
    onMenuSelect : function (picker, date) {
        var fields = this.fields,
            field = this.fields[picker.itemId];

        field.setChecked(true);

        if (field == fields.on) {
            fields.before.setChecked(false, true);
            fields.after.setChecked(false, true);
        } else {
            fields.on.setChecked(false, true);
            if (field == fields.after && this.getFieldValue('before') < date) {
                fields.before.setChecked(false, true);
            } else if (field == fields.before && this.getFieldValue('after') > date) {
                fields.after.setChecked(false, true);
            }
        }
        this.fireEvent('update', this);

        picker.up('menu').hide();
    },

    /**
     * @private
     * Template method that is to get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        var key, result = {};
        for (key in this.fields) {
            if (this.fields[key].checked) {
                result[key] = this.getFieldValue(key);
            }
        }
        return result;
    },

    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter
     * @param {Boolean} preserve true to preserve the checked status
     * of the other fields.  Defaults to false, unchecking the
     * other fields
     */
    setValue : function (value, preserve) {
        var key;
        for (key in this.fields) {
            if(value[key]){
                this.getPicker(key).setValue(value[key]);
                this.fields[key].setChecked(true);
            } else if (!preserve) {
                this.fields[key].setChecked(false);
            }
        }
        this.fireEvent('update', this);
    },

    /**
     * Template method that is to return <tt>true</tt> if the filter
     * has enough configuration information to be activated.
     * @return {Boolean}
     */
    isActivatable : function () {
        var key;
        for (key in this.fields) {
            if (this.fields[key].checked) {
                return true;
            }
        }
        return false;
    },

    /**
     * @private
     * Template method that is to get and return serialized filter data for
     * transmission to the server.
     * @return {Object/Array} An object or collection of objects containing
     * key value pairs representing the current configuration of the filter.
     */
    getSerialArgs : function () {
        var args = [];
        for (var key in this.fields) {
            if(this.fields[key].checked){
                args.push({
                    type: 'date',
                    comparison: this.compareMap[key],
                    value: Ext.Date.format(this.getFieldValue(key), this.dateFormat)
                });
            }
        }
        return args;
    },

    /**
     * Get and return the date menu picker value
     * @param {String} item The field identifier ('before', 'after', 'on')
     * @return {Date} Gets the current selected value of the date field
     */
    getFieldValue : function(item){
        return this.values[item];
    },

    /**
     * Gets the menu picker associated with the passed field
     * @param {String} item The field identifier ('before', 'after', 'on')
     * @return {Object} The menu picker
     */
    getPicker : function(item){
        return this.fields[item].menu.items.first();
    },

    /**
     * Template method that is to validate the provided Ext.data.Record
     * against the filters configuration.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord : function (record) {
        var key,
            pickerValue,
            val = record.get(this.dataIndex),
            clearTime = Ext.Date.clearTime;

        if(!Ext.isDate(val)){
            return false;
        }
        val = clearTime(val, true).getTime();

        for (key in this.fields) {
            if (this.fields[key].checked) {
                pickerValue = clearTime(this.getFieldValue(key), true).getTime();
                if (key == 'before' && pickerValue <= val) {
                    return false;
                }
                if (key == 'after' && pickerValue >= val) {
                    return false;
                }
                if (key == 'on' && pickerValue != val) {
                    return false;
                }
            }
        }
        return true;
    },

    onPickerSelect: function(picker, date) {
        // keep track of the picker value separately because the menu gets destroyed
        // when columns order changes.  We return this value from getValue() instead
        // of picker.getValue()
        this.values[picker.itemId] = date;
        this.fireEvent('update', this);
    }
});
// feature idea to enable Ajax loading and then the content
// cache would actually make sense. Should we dictate that they use
// data or support raw html as well?

/**
 * Plugin (ptype = 'rowexpander') that adds the ability to have a Column in a grid which enables
 * a second row body which expands/contracts.  The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row, and/or hitting enter while a row is selected.
 */
Ext.define('Ext.ux.RowExpander', {
    extend: 'Ext.AbstractPlugin',
    lockableScope: 'normal',

    requires: [
        'Ext.grid.feature.RowBody',
        'Ext.grid.feature.RowWrap'
    ],

    alias: 'plugin.rowexpander',

    rowBodyTpl: null,

    /**
     * @cfg {Boolean} expandOnEnter
     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
     * key is pressed (defaults to <tt>true</tt>).
     */
    expandOnEnter: true,

    /**
     * @cfg {Boolean} expandOnDblClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnDblClick: true,

    /**
     * @cfg {Boolean} selectRowOnExpand
     * <tt>true</tt> to select a row when clicking on the expander icon
     * (defaults to <tt>false</tt>).
     */
    selectRowOnExpand: false,

    rowBodyTrSelector: '.x-grid-rowbody-tr',
    rowBodyHiddenCls: 'x-grid-row-body-hidden',
    rowCollapsedCls: 'x-grid-row-collapsed',

    /**
     * @event expandbody
     * <b<Fired through the grid's View</b>
     * @param {HTMLElement} rowNode The &lt;tr> element which owns the expanded row.
     * @param {Ext.data.Model} record The record providing the data.
     * @param {HTMLElement} expandRow The &lt;tr> element containing the expanded data.
     */
    /**
     * @event collapsebody
     * <b<Fired through the grid's View.</b>
     * @param {HTMLElement} rowNode The &lt;tr> element which owns the expanded row.
     * @param {Ext.data.Model} record The record providing the data.
     * @param {HTMLElement} expandRow The &lt;tr> element containing the expanded data.
     */

    constructor: function() {
        var me = this,
            grid,
            rowBodyTpl,
            features;

        me.callParent(arguments);
        grid = me.getCmp();

        me.recordsExpanded = {};
        // <debug>
        if (!me.rowBodyTpl) {
            Ext.Error.raise("The 'rowBodyTpl' config is required and is not defined.");
        }
        // </debug>

        me.rowBodyTpl = Ext.XTemplate.getTpl(me, 'rowBodyTpl');
        rowBodyTpl = this.rowBodyTpl;
        features = [{
            ftype: 'rowbody',
            lockableScope: 'normal',
            columnId: me.getHeaderId(),
            recordsExpanded: me.recordsExpanded,
            rowBodyHiddenCls: me.rowBodyHiddenCls,
            rowCollapsedCls: me.rowCollapsedCls,
            getAdditionalData: me.getRowBodyFeatureData,
            getRowBodyContents: function(data) {
                return rowBodyTpl.applyTemplate(data);
            }
        },{
            ftype: 'rowwrap',
            lockableScope: 'normal'
        },
            // In case the client grid is lockable (At this stage we cannot know; plugins are constructed early)
            // push a Feature into the locked side which sets up the initially collapsed row state correctly
            {
                ftype: 'feature',
                lockableScope: 'locked',
                getAdditionalData: function(data, idx, record, result) {
                    if (!me.recordsExpanded[record.internalId]) {
                        result.rowCls = (result.rowCls || '') + ' ' + me.rowCollapsedCls;
                    }
                }
            }];

        if (grid.features) {
            grid.features = Ext.Array.push(features, grid.features);
        } else {
            grid.features = features;
        }
        // NOTE: features have to be added before init (before Table.initComponent)
    },

    init: function(grid) {
        var me = this,
            reconfigurable = grid;

        me.callParent(arguments);
        me.grid = grid;
        me.view = grid.getView();
        // Columns have to be added in init (after columns has been used to create the headerCt).
        // Otherwise, shared column configs get corrupted, e.g., if put in the prototype.
        me.addExpander();
        me.bindView(me.view);

        // If our client grid is the normal side of a lockable grid, we listen to its lockable owner's beforereconfigure
        // and also bind to the locked grid's view for dblclick and keydown events
        if (reconfigurable.ownerLockable) {
            reconfigurable = reconfigurable.ownerLockable;
            me.bindView(reconfigurable.lockedGrid.getView());
        }
        reconfigurable.on('beforereconfigure', me.beforeReconfigure, me);
    },

    beforeReconfigure: function(grid, store, columns, oldStore, oldColumns) {
        var expander = this.getHeaderConfig();
        expander.locked = true;
        columns.unshift(expander);
    },

    /**
     * @private
     * Inject the expander column into the correct grid.
     *
     * If we are expanding the normal side of a lockable grid, poke the column into the locked side
     */
    addExpander: function() {
        var me = this,
            expanderGrid = me.grid,
            expanderHeader = me.getHeaderConfig();

        // If this is the normal side of a lockable grid, find the other side.
        if (expanderGrid.ownerLockable) {
            expanderGrid = expanderGrid.ownerLockable.lockedGrid;
            expanderGrid.width += expanderHeader.width;
        }
        expanderGrid.headerCt.insert(0, expanderHeader);
    },

    getHeaderId: function() {
        if (!this.headerId) {
            this.headerId = Ext.id();
        }
        return this.headerId;
    },

    getRowBodyFeatureData: function(data, idx, record, orig) {
        var me = this,
            o = me.self.prototype.getAdditionalData.apply(this, arguments),
            id = me.columnId;

        o.rowBodyColspan = o.rowBodyColspan - 1;
        o.rowBody = me.getRowBodyContents(data);
        o.rowCls = me.recordsExpanded[record.internalId] ? '' : me.rowCollapsedCls;
        o.rowBodyCls = me.recordsExpanded[record.internalId] ? '' : me.rowBodyHiddenCls;
        o[id + '-tdAttr'] = ' valign="top" rowspan="2" ';
        if (orig[id+'-tdAttr']) {
            o[id+'-tdAttr'] += orig[id+'-tdAttr'];
        }
        return o;
    },

    bindView: function(view) {
        if (this.expandOnEnter) {
            view.on('itemkeydown', this.onKeyDown, this);
        }
        if (this.expandOnDblClick) {
            view.on('itemdblclick', this.onDblClick, this);
        }
    },

    onKeyDown: function(view, record, row, rowIdx, e) {
        if (e.getKey() == e.ENTER) {
            var ds   = view.store,
                sels = view.getSelectionModel().getSelection(),
                ln   = sels.length,
                i = 0;

            for (; i < ln; i++) {
                rowIdx = ds.indexOf(sels[i]);
                this.toggleRow(rowIdx, sels[i]);
            }
        }
    },

    onDblClick: function(view, record, row, rowIdx, e) {
        this.toggleRow(rowIdx, record);
    },

    toggleRow: function(rowIdx, record) {
        var me = this,
            view = me.view,
            rowNode = view.getNode(rowIdx),
            row = Ext.fly(rowNode, '_rowExpander'),
            nextBd = row.down(me.rowBodyTrSelector, true),
            isCollapsed = row.hasCls(me.rowCollapsedCls),
            addOrRemoveCls = isCollapsed ? 'removeCls' : 'addCls',
            rowHeight;

        // Suspend layouts because of possible TWO views having their height change
        Ext.suspendLayouts();
        row[addOrRemoveCls](me.rowCollapsedCls);
        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
        me.recordsExpanded[record.internalId] = isCollapsed;
        view.refreshSize();
        view.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);

        // Sync the height and class of the row on the locked side
        if (me.grid.ownerLockable) {
            view = me.grid.ownerLockable.lockedGrid.view;
            rowHeight = row.getHeight();
            row = Ext.fly(view.getNode(rowIdx), '_rowExpander');
            row.setHeight(rowHeight);
            row[addOrRemoveCls](me.rowCollapsedCls);
            view.refreshSize();
        }
        // Coalesce laying out due to view size changes
        Ext.resumeLayouts(true);
    },

    getHeaderConfig: function() {
        var me = this;

        return {
            id: me.getHeaderId(),
            width: 24,
            lockable: false,
            sortable: false,
            resizable: false,
            draggable: false,
            hideable: false,
            menuDisabled: true,
            cls: Ext.baseCSSPrefix + 'grid-header-special',
            renderer: function(value, metadata) {
                metadata.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
                return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander">&#160;</div>';
            },
            processEvent: function(type, view, cell, rowIndex, cellIndex, e, record) {
                if (type == "mousedown" && e.getTarget('.x-grid-row-expander')) {
                    me.toggleRow(rowIndex, record);
                    return me.selectRowOnExpand;
                }
            }
        };
    }
});


Ext.define('Ext.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumnwithheader',

    disableColumn: false,
    disableFunction: null,
    disabledColumnDataIndex: null,
    columnHeaderCheckbox: false,
    autoCommit: true,
    constructor: function(config) {

        var me = this;
        if(config.columnHeaderCheckbox)
        {
            var store = config.store;
            store.on("datachanged", function(){
                me.updateColumnHeaderCheckbox(me);
            });
            store.on("update", function(){
                me.updateColumnHeaderCheckbox(me);
            });
            config.text = me.getHeaderCheckboxImage(store, config.dataIndex);
        }

        me.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'beforecheckchange',
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );

        me.callParent(arguments);
    },

    updateColumnHeaderCheckbox: function(column){
        var image = column.getHeaderCheckboxImage(column.store, column.dataIndex);
        column.setText(image);
    },

    toggleSortState: function(){
        var me = this;
        if(me.columnHeaderCheckbox)
        {
            var store = me.up('tablepanel').store;
            var isAllChecked = me.getStoreIsAllChecked(store, me.dataIndex);
            store.each(function(record){
                record.set(me.dataIndex, !isAllChecked);
                record.commit();
            });
        }
        else
            me.callParent(arguments);
    },

    getStoreIsAllChecked: function(store, dataIndex){
        var allTrue = true;
        store.each(function(record){
            if(!record.get(dataIndex))
                allTrue = false;
        });
        return allTrue;
    },

    getHeaderCheckboxImage: function(store, dataIndex){

        var allTrue = this.getStoreIsAllChecked(store, dataIndex);

        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (allTrue) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>'
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = this.dataIndex,
                checked = !record.get(dataIndex),
                column = view.panel.columns[cellIndex];
            if(!(column.disableColumn || record.get(column.disabledColumnDataIndex) || (column.disableFunction && column.disableFunction(checked, record))))
            {
                if(this.fireEvent('beforecheckchange', this, recordIndex, checked, record))
                {
                    record.set(dataIndex, checked);
                    if (this.autoCommit) {
                        record.commit();
                    }
                    this.fireEvent('checkchange', this, recordIndex, checked, record);
                }
            }
            // cancel selection.
            return false;
        } else {
            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value, metaData, record, rowIndex, colIndex, store, view){
        var disabled = "",
            column = view.panel.columns[colIndex];
        if(column.disableColumn || column.disabledColumnDataIndex || (column.disableFunction && column.disableFunction(value, record)))
            disabled = "-disabled";
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader' + disabled];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked' + disabled);
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});
Ext.define('Gisatlib.slider.DiscreteThumb', {
    extend: 'Ext.slider.Thumb',
    alias: 'widget.discretethumb',
    initEvents: function() {
        var me = this;
        this.el.on('click',function(evt) {
            var el = this;
            var unchanged = false;
            var removed = false;
            var cont = el.up('.'+Ext.baseCSSPrefix +'slider-inner');
            if (evt.ctrlKey) {
                el.toggleCls(Ext.baseCSSPrefix + 'slider-thumb-drag')
                var thumbEls = cont.query('.'+Ext.baseCSSPrefix + 'slider-thumb');
                if (!thumbEls.length) {
                    el.toggleCls(Ext.baseCSSPrefix + 'slider-thumb-drag');
                    unchanged = true;
                }
            }
            else {

                var thumbEls = cont.query('.'+Ext.baseCSSPrefix + 'slider-thumb');
                for (var i=0;i<thumbEls.length;i++) {
                    var thumbEl = Ext.get(thumbEls[i]);
                    var hasCls = thumbEl.hasCls(Ext.baseCSSPrefix + 'slider-thumb-drag')
                    if (el==thumbEl) {
                        thumbEl.addCls(Ext.baseCSSPrefix + 'slider-thumb-drag');
                        if (hasCls) {
                            unchanged = true;
                        }
                    }
                    else {
                        thumbEl.removeCls(Ext.baseCSSPrefix + 'slider-thumb-drag');
                        removed = true;
                    }
                }
            }
            if (!unchanged || removed) {
                me.slider.fireEvent('change',me.slider,me.slider.getValue(),me)
            }
        })
    }



})


Ext.define('PumaMain.controller.DomManipulation', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        if (Config.exportPage) {
            return;
        }
        Observer.addListener("resizeMap",this.resizeMap.bind(this));
        window.Stores.addListener(this.windowStoresListener.bind(this));
        $("#sidebar-reports-toggle").on("click", $.proxy(this._onReportsSidebarToggleClick, this));
        $("#sidebar-tools-toggle").on("click", $.proxy(this._onToolsSidebarToggleClick, this));
        $(window).on("resize", $.proxy(this._onWindowResize, this));
        this.control({
            "toolspanel panel" : {
                expand   : this.onToolPanelExpand,
                collapse : this.onToolPanelCollapse
            },
            "toolspanel" : {
                resize: this.onToolsResize,
                afterrender: this.onToolsResize
            },
            "window" : {
                dragstart: this.onWindowDragStart,
                dragend: this.onWindowDragEnd
            }
        });
        this.resizeMap();
        this.resizeSidebars();

        Observer.notify('DomManipulation#init');
    },

    onWindowDragStart: function() {
        $("#map-holder").append('<div id="draggingOverMapProtectionOverlay"></div>');
    },

    onWindowDragEnd: function(xWindow) {
        $("#draggingOverMapProtectionOverlay").remove();
        window.Stores.notify('floaters#sort', {
            fromExt: true,
            xWindow: xWindow
        });
    },

    onToolsResize: function(toolPanel) {
        this.resizeTools();
    },

    onToolPanelResize: function(panel) {
        this.resizeTools();
    },

    onToolPanelExpand: function(panel) {
        this.resizeTools();
    },

    onToolPanelCollapse: function(panel) {
        this.resizeTools();
    },

    renderApp: function() {
        $("body").removeClass("intro").addClass("application");
        window.Stores.notify("components#applicationMode");
        window.Stores.notify("appRenderingStarted");
        this.resizeMap();
        this.resizeSidebars();
    },

    renderIntro: function() {
        // zatim neni potreba
        $("body").addClass("intro");
    },

    resizeMap: function() {
        this.resizeReports();
        var availableSize = this.getContentAvailableSize();

        var w  = availableSize.width;
        var h  = availableSize.height;
        var sw = $("#sidebar-reports").width();

        if ($("body").hasClass("application") && sw > 0) {
            w = w - sw;
            var reportsRight = $("#sidebar-reports").css("right");
            if (reportsRight){
                w = w - Number(reportsRight.slice(0,-2));
            }

        }

        $("#map-holder").css({width : w, height : h});
        $("#maps-container").css({width : w, height : h});
    },

    resizeSidebars: function() {
        this.resizeTools();
        this.resizeReports();
    },

    resizeTools: function() {
        if (!Config.toggles.useTopToolbar) { // TODO do we need to do something else?
            var availableSize = this.getContentAvailableSize();
            var accordeonMaxH = availableSize.height - $("#app-tools-actions").outerHeight(true) - $("#sidebar-tools-colors").outerHeight(true);
            var accordeon = Ext.ComponentQuery.query('toolspanel')[0];
            if (accordeon) {
                accordeon.maxHeight = accordeonMaxH;
                accordeon.updateLayout();
            }
            $("#sidebar-tools").css("max-height", availableSize.height);
        }
    },

    resizeReports: function() {
        var availableSize = this.getContentAvailableSize();
        $("#sidebar-reports").height(availableSize.height);
        if(Config.toggles.isSnow) {
            $("#app-extra-content").height(availableSize.height);
        } else {
            $("#app-reports-accordeon").height(availableSize.height - $("#app-reports-paging").outerHeight(true));
        }
    },

    activateMapSplit: function() {
        $("#map-holder").addClass("split");
        this.resizeMap();
    },

    deactivateMapSplit: function() {
        $("#map-holder").removeClass("split");
        this.resizeMap();
    },

    getContentAvailableSize: function() {
        var w  = $(window).width();
        var h  = $(window).height() - $("#wb-header").outerHeight(true) - $("#header").outerHeight(true) - $("#footer").outerHeight(true);

        //var h  = $(window).height();

        if ($("body").hasClass("application")) {
            if (Config.toggles.useNewViewSelector) {
                h -= $("#view-selector").outerHeight(true);
            } else {
                h -= $("#legacy-view-selector").outerHeight(true);
            }
            if (Config.toggles.useTopToolbar) {
                h -= $("#top-toolbar").outerHeight(true);
            }
            if (Config.toggles.hideSelectorToolbar){
                h += $("#view-selector").outerHeight(true);
            }
        }
        return { width  : w, height : h };
    },

    activateLoadingMask: function() {
        //$("#loading-mask-shim, #loading-mask").show();
        console.log('DomManipulation#activateLoadingMask Show Loading');
        $('#loading-screen').css('display', 'block');
    },

    deactivateLoadingMask: function() {
        //$("#loading-mask-shim, #loading-mask").hide();
        console.log('DomManipulation#activateLoadingMask Hide Loading');
        $('#loading-screen').css('display', 'none');
    },

    _onReportsSidebarToggleClick: function() {
        $("#sidebar-reports").toggleClass("hidden");
        $("#world-wind-map").toggleClass("charts-hidden");
        this.resizeMap();
    },

    _onReportsSidebarHide: function() {
        $("#sidebar-reports").addClass("hidden");
        $("#world-wind-map").addClass("charts-hidden");
        this.resizeMap();
    },

    _onToolsSidebarToggleClick: function() {
        $("#sidebar-tools").toggleClass("hidden");
    },

    _onWindowResize: function() {
        this.resizeMap();
        this.resizeSidebars();
    },

    windowStoresListener: function(event) {
        if (event === 'resizeMap') {
            this.resizeMap();
        }
    }
});
Ext.define('PumaMain.controller.Render', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['Puma.view.form.DefaultComboBox','Gisatlib.slider.DiscreteTimeline','Ext.form.CheckboxGroup','PumaMain.view.TopTools','PumaMain.view.Tools','PumaMain.view.ChartBar','Gisatlib.container.StoreContainer','Ext.slider.Multi'],
    init: function() {
        this.control({
            'toolspanel tool[type=detach]': {
                click: this.undockPanel
            },
            'window[isdetached=1]': {
                close: this.dockPanel
            },
            'window[isdetached=1] panel': {
                collapse: this.onFloatingCollapse
            }
        })

        $('.problematichelp').on('click',function(e) {

            if (Config.contextHelp) {
                PumaMain.controller.Help.onHelpClick(e);
            }
        })

        Observer.notify('Render#init');
    },
    onFloatingCollapse: function(panel) {
        window.setTimeout(function() {
            panel.up('window').setHeight(null);
        },100)
    },

    dockPanel: function(win) {
        var panel = win.down('panel');
        win.remove(panel,false);
        var order = ['selcolor','layerpanel','areatree','maptools','advancedfilters'];
        if (Config.toggles.advancedFiltersFirst){
            order = ['selcolor','advancedfilters','layerpanel','areatree','maptools'];
        }
        var idx = 0;
        for (var i=0;i<order.length;i++) {
            var name = order[i];
            if (name==panel.itemId) break;
            var cmp = Ext.ComponentQuery.query('toolspanel #'+name);
            if (cmp.length) {
                idx++;
            }
        }

        var container = Ext.ComponentQuery.query('toolspanel')[0];

        panel.collapse();
        panel.header.items.getByKey('undock').show();
        container.insert(idx,panel);

    },

    undockPanel: function(tool) {
        var panel = tool.up('panel');
        panel.up('container').remove(panel,false);
        panel.el.setTop(0);
        var win = Ext.widget('window',{
            layout: 'fit',
            width: 260,
            maxHeight: 600,
            resizable: true,
            cls: 'detached-window',
            isdetached: 1,
            constrainHeader: true,
            items: [panel]
        }).show();
        var toolId = win.tools.close.el.id;
        Ext.tip.QuickTipManager.register({
            target: toolId,
            text: 'Attach back'
        });

        win.el.setOpacity(0.9);
        var el = Ext.get('sidebar-tools-toggle');
        var factor = Ext.ComponentQuery.query('window[isdetached=1]').length-1;
        win.alignTo(el,'tl-tr',[50*factor,50*factor]);

        panel.expand();
        panel.doLayout();
        panel.header.items.getByKey('undock').hide();
    },


    renderApp: function() {
        var me = this;
        var locStore = Ext.StoreMgr.lookup('location4init');
        //var customRec = locStore.getById('custom');
        //customRec.set('name','Custom')
        if (Config.dataviewId) {
            Ext.getBody().addCls('dataview');
            if(Config.toggles.useWBAgreement) {
                this.renderAggreement();
            }
        }
        if (Config.toggles.hideSelectorToolbar){
            $("#view-selector").css("display","none");
        }
//		Ext.widget('button',{ // JJJ HACK čára do konzole
//			renderTo: 'footer-legal',
//			itemId: 'consolebreak',
//			tooltip: 'Insert line in console',
//			tooltipType: 'title',
//			width: 30,
//			height: 30,
//			text: '=',
//			floating: true,
//			listeners: {
//				click: function(){
//					console.log("===========================================================");
//				}
//			}
//		});
        Ext.widget('pumacombo',{
            store: 'dataset',
            helpId: 'Selectingscopeofanalysis',
            itemId: 'seldataset',
            cls: 'custom-combo',
            listConfig: {
                cls: 'custom-combo-list',
            },
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-scope' : 'app-legacy-view-selector-scope'
        })
        Ext.widget('pumacombo',{
            store: 'location4init',
            itemId: 'sellocation',
            helpId: 'Selectingterritory',
            valueField: 'id',
            cls: 'custom-combo',
            listConfig: {
                cls: 'custom-combo-list',
            },
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-place' : 'app-legacy-view-selector-place'
        })
        Ext.widget('pumacombo',{
            store: 'theme4sel',
            itemId: 'seltheme',
            helpId: 'Selectingtheme',
            width: 180,
            trigger2Cls: 'x-form-refresh-trigger',
            onTrigger2Click: function() {
                me.getController('LocationTheme').refreshTheme();
            },
            cls: 'custom-combo',
            listConfig: {
                cls: 'custom-combo-list',
            },
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-theme' : 'app-legacy-view-selector-theme'
        });

        var timelineWidth = 150;
        if (Config.toggles.isMelodies){
            timelineWidth = 270;
        }
        Ext.widget('discretetimeline',{
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-period' : 'app-legacy-view-selector-year',
            width: timelineWidth,
            store: Ext.StoreMgr.lookup('year4sel'),
            //forceSelection: true,
            itemId: 'selyear',
            cls: 'yearselector problematichelp',
            helpId: 'Switchingbetweenyears',

        })
        Ext.widget('pumacombo',{
            store: 'visualization4sel',
            helpId: 'Selectingthevisualisation',
            itemId: 'selvisualization',
            cls: 'custom-combo',
            width: 180,
            trigger2Cls: 'x-form-refresh-trigger',
            onTrigger2Click: function() {
                me.getController('LocationTheme').refreshVisualization();
            },
            listConfig: {
                cls: 'custom-combo-list',
            },
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-visualization' : 'app-legacy-view-selector-visualization'
        })
        Ext.widget('button',{
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-visualization-save' : 'app-legacy-view-selector-visualization-save',
            text: polyglot.t('saveAs'),
            itemId: 'savevisualization',
            width: '100%',
            height: '100%',
            hidden: !Config.auth,
            cls: 'custom-button btn-visualization-save'
        })
        Ext.widget('button',{
            renderTo: 'app-legacy-view-selector-share',
            text: polyglot.t('shareDataView'),
            itemId: 'sharedataview',
            helpId: 'Sharingdataviews',
            width: '100%',
            height: '100%',
            hidden: !Config.auth,
            icon: 'images/icons/share.png',
            cls: 'custom-button btn-share'
        })

        if (Config.toggles.useNewViewSelector) {
            Ext.widget('button',{
                renderTo: 'app-view-selector-period-compare',
                text: polyglot.t('compare'),
                itemId: 'compareperiods',
                helpId: 'Multiplemaps',
                enableToggle: true,
                width: '100%',
                height: '100%',
                cls: 'custom-button btn-period-compare'
            })
        }


//        Ext.widget('slider',{
//            renderTo: 'app-legacy-view-selector-level',
//            itemId: 'areaslider',
//            minValue: 0,
//            value: 0,
//            maxValue: 2,
//            width: '100%'
//        })

        if(Config.toggles.allowPumaHelp !== false) {
            Ext.widget('button', {
                renderTo: 'app-legacy-view-selector-contexthelp',
                itemId: 'contexthelp',
                tooltip: polyglot.t('Context help'),
                tooltipType: 'title',
                //icon: 'images/icons/help-context.png',
                enableToggle: true,
                width: 25,
                height: 25,
                listeners: {
                    toggle: {
                        fn: function (btn, active) {
                            if (active) {
                                btn.addCls("toggle-active");
                            }
                            else {
                                btn.removeCls("toggle-active");
                            }
                        }
                    }
                }
            })
            Ext.widget('button', {
                renderTo: 'app-legacy-view-selector-webhelp',
                itemId: 'webhelp',
                tooltip: polyglot.t('pumaWebtoolHelp'),
                tooltipType: 'title',
                //icon: 'images/icons/help-web.png',
                width: 25,
                height: 25,
                href: 'help/PUMA webtool help.html'
            })
        }

        Ext.widget('button',{
            renderTo: 'app-legacy-view-selector-level-more',
            itemId: 'areamoredetails',
            helpId: 'Settingthelevelofdetail',
            text: '+',
            width: '100%',
            height: '100%',
            cls: 'custom-button'
        })
        Ext.widget('button',{
            renderTo: 'app-legacy-view-selector-level-less',
            itemId: 'arealessdetails',
            helpId: 'Settingthelevelofdetail',
            text: '-',
            width: '100%',
            height: '100%',
            cls: 'custom-button'
        })

        Ext.widget('button',{
            renderTo: 'app-legacy-view-selector-manage',
            itemId: 'managedataview',
            helpId: 'Managingdataviews',
            hidden: !Config.auth,
            //icon: 'images/icons/settings.png',
            width: '100%',
            height: '100%',
            cls: 'custom-button btn-manage'
        })
        Ext.widget('button',{
            renderTo: Config.toggles.useNewViewSelector ? 'app-view-selector-visualization-manage' : 'app-legacy-view-selector-visualization-manage',
            itemId: 'managevisualization',
            hidden: !Config.auth,
            //icon: 'images/icons/settings.png',
            width: '100%',
            height: '100%',
            cls: 'custom-button btn-visualization-manage'
        })
        Ext.widget('button',{
            renderTo: 'app-legacy-view-selector-save',
            itemId: 'savedataview',
            helpId: 'Savingdataviews',
            hidden: !Config.auth,
            text: polyglot.t('saveView'),
            icon: 'images/icons/save.png',
            width: '100%',
            height: '100%',
            cls: 'custom-button btn-save'
        })
//        Ext.widget('colorpicker',{
//                    xtype: 'colorpicker',
//                    fieldLabel: 'CP',
//                    value: 'ff4c39',
//                    itemId: 'selectcolorpicker',
//                    height: 16,
//                    width: 120,
//                    renderTo: 'app-tools-colors',
//                    colors: ['ff4c39', '34ea81', '39b0ff', 'ffde58', '5c6d7e', 'd97dff']
//                })
        Ext.widget('toptoolspanel',{
            renderTo: 'app-tools-actions'
        })



        Ext.widget('toolspanel', {
            renderTo: 'app-tools-accordeon'
        });

        if (Config.toggles.useTopToolbar){

            // Show widgets windows
            // TODO - do we need to show them?
            var widgetIDs = ['layerpanel', 'areatree', 'colourSelection', 'maptools', 'customLayers'];
            if (!Config.toggles.hasNewEvaluationTool){
                widgetIDs.push('legacyAdvancedFilters');
            }
            for (var i in widgetIDs){
                if(!widgetIDs.hasOwnProperty(i)) continue;
                var queryResults = Ext.ComponentQuery.query('#window-' + widgetIDs[i]);
                queryResults[0].show();
            }
        }

        Ext.widget('chartbar',{
            renderTo: 'app-reports-accordeon',
            cls: 'problematichelp',
            helpId: 'Modifyingchartpanel'
        })
        Ext.widget('pagingtoolbar',{
            renderTo: 'app-reports-paging',
            itemId: 'areapager',
            displayInfo: true,
            displayMsg: polyglot.t('areasAmount'),
            emptyMsg: polyglot.t('noAreas'),
            cls: 'paging-toolbar problematichelp',
            helpId: 'Paging',
            buttons: ['-',{
                xtype: 'splitbutton',
                menu: {
                    items:[{
                        xtype: 'colorpicker',
                        allowToggle: true,
                        fieldLabel: 'CP',
                        itemId: 'useselectedcolorpicker',
                        padding: '2 5',
                        height: 24,
                        width: 132,
                        //value: ['ff0000', '00ff00', '0000ff', 'ffff00', '00ffff', 'ff00ff'],
                        colors: ['ff4c39', '34ea81', '39b0ff', 'ffde58', '5c6d7e', 'd97dff']
                    }],
                    showSeparator: false
                },
                itemId: 'onlySelected',

                //text: 'Only selected',
                enableToggle: true,
                tooltip: polyglot.t('onlySelected'),
                cls: "paging-only-selected"
            }],
            store: Ext.StoreMgr.lookup('paging')
        });
        Ext.ComponentQuery.query('#screenshotpanel')[0].collapse();
        Ext.ComponentQuery.query('#areapager #useselectedcolorpicker')[0].select(['ff4c39', '34ea81', '39b0ff', 'ffde58', '5c6d7e', 'd97dff']);

    },

    renderMap: function() {
        Ext.widget('component',{
            renderTo: 'app-map',
            itemId: 'map',
            width: 1920,
            height: 900
        })
        Ext.widget('component',{
            renderTo: 'app-map2',
            itemId: 'map2',
            hidden: true,
            width: 1920,
            height: 900
        })
    },

    renderAggreement: function() {
        Ext.widget('button',{
            renderTo: 'agreement-accept',
            itemId: 'acceptAgreement',
            text: polyglot.t('continue'),
            width: '100%',
            height: '100%'
        })
        Ext.widget('button',{
            renderTo: 'agreement-cancel',
            itemId: 'cancelAgreement',
            text: polyglot.t('cancel'),
            width: '100%',
            height: '100%'
        })
        var me = this;
        Ext.widget('checkbox',{
            renderTo: 'agreement-accept-chb',
            itemId: 'agreementCheck',
            boxLabel: 'I have read this Users Agreement and agree to these terms and conditions.'

//			,listeners: { //JJJ HACK agreement
//				el : {
//			        'mouseover': function(e,t){
//						Ext.ComponentQuery.query('#initialdataset')[0].setValue(1532);
//						Ext.ComponentQuery.query('#initiallocation')[0].setValue('276_1');
//						Ext.ComponentQuery.query('#initialtheme')[0].setValue(1365);
//						Ext.ComponentQuery.query('#agreementCheck')[0].setValue(1);
//						me.getController('LocationTheme').onAcceptAgreement();
//						me.getController('LocationTheme').onConfirm();
//					}
//			    }
//			}


        })
    },

    renderIntro: function() {
        this.renderMap();
        Ext.widget('pumacombo',{
            renderTo: 'app-intro-scope',
            initial: true,
            emptyText: polyglot.t('selectScope'),
            allowBlank: false,
            store: Ext.StoreMgr.lookup('dataset'),
            cls: 'custom-combo',
            listConfig: {
                cls: 'custom-combo-list',
            },
            itemId: 'initialdataset'
        })
        Ext.widget('pumacombo',{
            renderTo: 'app-intro-place',
            initial: true,
            //hidden: true,
            valueField: 'id',
            store: Ext.StoreMgr.lookup('location4init'),
            cls: 'custom-combo',
            listConfig: {
                cls: 'custom-combo-list',
            },
            itemId: 'initiallocation'
        })
        Ext.widget('pumacombo',{
            renderTo: 'app-intro-theme',
            initial: true,
            //hidden: true,
            itemId: 'initialtheme',
            cls: 'custom-combo',
            listConfig: {
                cls: 'custom-combo-list',
            },
            store: Ext.StoreMgr.lookup('theme4sel')
        })
        Ext.widget('button',{
            renderTo: 'app-intro-confirm',
            itemId: 'initialconfirm',
            text: polyglot.t('explore'),
            width: '100%',
            height: '100%',
            cls: 'custom-button btn-confirm'
        });
        if(Config.toggles.useWBAgreement) {
            this.renderAggreement();
        }

        this.loadingFinishedNotification();
    },

    loadingFinishedNotification: function(){
        window.clearTimeout(this._intervalCheck);
        if (window.Stores.hasStateStore){
            window.Stores.notify("initialLoadingFinished");
        } else {
            var self = this;
            this._intervalCheck = window.setTimeout(function(){
                self.loadingFinishedNotification();
            },100);
        }
    }

})


Ext.define('PumaMain.controller.Store', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [
        'Puma.model.Location',
        'Puma.model.AttributeSet',
        'Puma.model.Attribute',
        'Puma.model.AreaTemplate',
        'Puma.model.Dataset',
        'Puma.model.DataView',
        'Puma.model.Topic',
        'Puma.model.Symbology',
        'Puma.model.LayerRef',
        'Puma.model.LayerServer',
        'Puma.model.Theme',
        'Puma.model.Aggregated',
        'Puma.model.Area',
        'Puma.model.Year',
        'Puma.model.Scope',
        'Puma.model.ColumnMap',
        'Puma.model.Column',
        'Puma.model.MapLayer',
        'Puma.model.LayerGroup',
        'Puma.model.MappedAttribute',
        'Puma.model.Visualization',
        'Puma.model.Screenshot',
        'Puma.model.MappedChartAttribute',
        'Ext.data.Store',
        'Gisatlib.data.SlaveStore',
        'Gisatlib.paging.PhantomStore',
        'Gisatlib.data.AggregatedStore'
    ],
    init: function () {
        if (Config.exportPage) {
            return;
        }
        this.initStores();
        this.initSlaveStores();
        this.initLocalStores();
        this.initAggregatedStores();
        this.initEvents();
        // this.initLocations();

        window.Stores.addListener(this.onEvent.bind(this));
    },

    initLocations: function () {
        var store = Ext.StoreMgr.lookup('location4init');
        store.loading = true;
        Ext.Ajax.request({
            url: Config.url + 'api/theme/getLocationConf',
            scope: this,
            method: 'POST',
            success: function (response) {
                var data = JSON.parse(response.responseText).data;
                store.loadData(data);
                store.loading = false;
            },
            failure: function (response, opts) {
                console.log('Store.initLocations AJAX request failed. Status: ' + response.status, "Response:", response);
            }
        })
    },

    initAggregatedStores: function () {


    },
    initStores: function () {
        console.log('Store#initStores Load stores');

        var autoLoad = false;

        Ext.create('Ext.data.Store', {
            storeId: 'location',
            autoLoad: autoLoad,
            model: 'Puma.model.Location'
        });
        Ext.create('Ext.data.Store', {
            storeId: 'theme',
            autoLoad: autoLoad,
            model: 'Puma.model.Theme'
        });
        Ext.create('Ext.data.Store', {
            storeId: 'topic',
            autoLoad: autoLoad,
            model: 'Puma.model.Topic'
        });
        Ext.create('Ext.data.Store', {
            storeId: 'dataset',
            autoLoad: autoLoad,
            model: 'Puma.model.Dataset'
        });

        Ext.create('Ext.data.Store', {
            storeId: 'layergroup',
            autoLoad: autoLoad,
            model: 'Puma.model.LayerGroup'
        })

        Ext.create('Ext.data.Store', {
            storeId: 'attributeset',
            autoLoad: autoLoad,
            model: 'Puma.model.AttributeSet'
        })

        Ext.create('Ext.data.Store', {
            storeId: 'attribute',
            autoLoad: autoLoad,
            model: 'Puma.model.Attribute'
        })

        Ext.create('Ext.data.Store', {
            storeId: 'visualization',
            autoLoad: autoLoad,
            model: 'Puma.model.Visualization'
        })


        Ext.create('Ext.data.Store', {
            storeId: 'year',
            autoLoad: autoLoad,
            sorters: [{property: 'name', direction: 'ASC'}],
            model: 'Puma.model.Year'
        })




        Ext.create('Ext.data.Store', {
            storeId: 'areatemplate',
            autoLoad: autoLoad,
            model: 'Puma.model.AreaTemplate'
        })

        Ext.create('Ext.data.Store', {
            storeId: 'symbology',
            autoLoad: autoLoad,
            model: 'Puma.model.Symbology'
        })
        Ext.create('Ext.data.TreeStore', {
            model: 'Puma.model.Area',
            root: {
                expanded: false,
                children: [{text: "Child 1", leaf: true}]
            },
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            storeId: 'area'
        })

        Ext.create('Ext.data.Store', {
            storeId: 'dataview',
            autoLoad: autoLoad,
            filters: [function (rec) {
                return rec.get('name');
            }],
            model: 'Puma.model.DataView'
        })


    },

    initEvents: function () {
        var me = this;
        var areaStore = Ext.StoreMgr.lookup('area');
        areaStore.on('beforeload', function (store, options) {
            me.getController('Area').onBeforeLoad(store, options);
        }, this);
        areaStore.on('load', function (store, node, records) {
            me.getController('Area').onLoad(store, node, records);
        }, this);

    },

    initSlaveStores: function () {

        // active objects
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'visualization4window',
            model: 'Puma.model.Visualization'
        })

        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'activescope',
            filters: [function (rec) {
                return rec.get('active') !== false;
            }],
            model: 'Puma.model.Scope'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'activedataset',
            filters: [function (rec) {
                return rec.get('active') !== false;
            }],
            model: 'Puma.model.Dataset'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'activelocation',
            filters: [function (rec) {
                return rec.get('active') !== false;
            }],
            model: 'Puma.model.Location'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'activeattributeset',
            filters: [function (rec) {
                return rec.get('active') !== false;
            }],
            model: 'Puma.model.AttributeSet'
        })


        // objects for selection
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'theme4sel',
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.Theme'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'year4sel',
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.Year'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'visualization4sel',
            filters: [function (rec) {
                return false;
            }],
            sorters: [{
                sorterFn: function (o1, o2) {
                    var activeThemeCombo = Ext.ComponentQuery.query('#seltheme')[0];
                    var activeThemeId = activeThemeCombo ? activeThemeCombo.getValue() : null;
                    var theme = activeThemeId ? Ext.StoreMgr.lookup('theme').getById(activeThemeId) : null;
                    var order = theme ? theme.get('visOrder') : null;
                    if (!order) return o1.get('name') > o2.get('name');
                    var idx1 = Ext.Array.indexOf(order, o1.get('_id'));
                    var idx2 = Ext.Array.indexOf(order, o2.get('_id'));
                    if (idx1 < 0) return true;
                    if (idx2 < 0) return false;
                    return idx1 > idx2;

                }
            }],
            model: 'Puma.model.Visualization'
        })


        // layer templates vs. feature layer templates
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'featurelayertemplate',
            filters: [function (rec) {
                return !rec.get('justVisualization') && rec.get('active');
            }],
            model: 'Puma.model.AreaTemplate'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'layertemplate',
            filters: [function (rec) {
                return rec.get('justVisualization') && rec.get('active');
            }],
            model: 'Puma.model.AreaTemplate'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'layertemplate2choose',
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.AreaTemplate'
        })


        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'attributeset2choose',
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.AttributeSet'
        })


        // need advanced logic
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'attributeset4chart',
            model: 'Puma.model.AttributeSet'
        })


        // attributes based on attr sets
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'attribute4chart',
            sorters: [{
                property: 'code',
                direction: 'ASC'
            }],
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.Attribute'
        })
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'normattribute4chart',
            sorters: [{
                property: 'code',
                direction: 'ASC'
            }],
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.Attribute'
        })


        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'attribute4chart4norm',
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.Attribute'
        })

        // ? is needed, i think use of year4sel is sufficient
        Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            storeId: 'year4chart',
            model: 'Puma.model.Year'
        })

        Ext.create('Gisatlib.data.SlaveStore', {
            model: 'Puma.model.MapLayer',
            slave: true,
            filters: [function (rec) {
                return rec.get('type') == 'topiclayer';
            }],
            storeId: 'layers4outline'
        })
    },

    initLocalStores: function () {

        Ext.create('Gisatlib.paging.PhantomStore', {
            storeId: 'paging'
        });


        Ext.create('Ext.data.TreeStore', {
            storeId: 'attributes2choose',
            // JJJ TODO mozna i prejmenovat ten model
            model: 'Puma.model.MappedChartAttribute',
            root: {
                expanded: true
            }
        });
        Ext.create('Ext.data.TreeStore', {
            model: 'Puma.model.MapLayer',
            storeId: 'layers',
            sorters: [{
                sorterFn: function (o1, o2) {
                    var type1 = o1.get('type');

                    if (Ext.Array.contains(['systemgroup,choroplethgroup', 'thematicgroup', 'basegroup'], type1)) {
                        return null;
                    }
                }
            }],
            root: {
                expanded: true,
                children: [{
                    name: polyglot.t('analyticalUnits'),
                    type: 'systemgroup',
                    expanded: true,
                    checked: null
                }, {
                    name: polyglot.t('thematicMaps'),
                    type: 'choroplethgroup',
                    expanded: true,
                    children: [],
                    checked: null
                }, {
                    name: polyglot.t('backgroundLayers'),
                    type: 'basegroup',
                    expanded: true,
                    checked: null
                }, {
                    name: polyglot.t('liveData'),
                    type: 'livegroup',
                    expanded: true,
                    checked: null
                }, {
                    name: polyglot.t('customWms'),
                    type: 'customwms',
                    expanded: true,
                    checked: null
                }]
            }
        });

        Ext.create('Ext.data.Store', {
            model: 'Puma.model.MapLayer',
            filters: [function (rec) {
                return rec.get('checked');
            }],
            slave: true,
            sorters: [{
                property: 'sortIndex',
                direction: 'ASC'
            }],
            storeId: 'selectedlayers'
        })

        Ext.create('Ext.data.Store', {
            model: 'Puma.model.Screenshot',
            data: [],
            storeId: 'screenshot'
        })


        Ext.create('Ext.data.Store', {
            fields: ['name', 'type'],
            storeId: 'classificationtype',
            data: [{
                name: polyglot.t('continuous'),
                type: 'continuous'
            }, {
                name: polyglot.t('equal'),
                type: 'equal'
            }, {
                name: polyglot.t('quantiles'),
                type: 'quantiles'
            }]
        })

        Ext.create('Ext.data.Store', {
            storeId: 'charttype4chart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('table'),
                type: 'grid'
            }, {
                name: polyglot.t('column'),
                type: 'columnchart'
            }, {
                name: polyglot.t('scatter'),
                type: 'scatterchart'
            }, {
                name: polyglot.t('pie'),
                type: 'piechart'
            }, { // TODO polyglot translation
                name: 'Polar',
                type: 'polarchart'
            }, {
                name: polyglot.t('extentOutline'),
                type: 'extentoutline'
            }
            ]
        });

        Ext.create('Ext.data.Store', {
            storeId: 'stacking4chart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('none'),
                type: 'none'
            }, {
                name: polyglot.t('percent'),
                type: 'percent'
            }, {
                name: polyglot.t('normal'),
                type: 'normal'
            }, {
                name: polyglot.t('double'),
                type: 'double'
            }]
        });
        Ext.create('Ext.data.Store', {
            storeId: 'periods4chart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('allPeriods'),
                type: 'all'
            }, {
                name: polyglot.t('average4allPeriods'),
                type: 'average'
            }, {
                name: polyglot.t('latest'),
                type: 'latest'
            }, {
                name: polyglot.t('withMinValue'),
                type: 'min'
            }, {
                name: polyglot.t('withMaxValue'),
                type: 'max'
            }, {
                name: polyglot.t('withMinMaxValue'),
                type: 'minMax'
            }, {
                name: polyglot.t('withMinAverageMaxValue'),
                type: 'minAverageMax'
            }]
        });
        Ext.create('Ext.data.Store', {
            storeId: 'periods4polarchart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('average4allPeriods'),
                type: 'average'
            }, {
                name: polyglot.t('latest'),
                type: 'latest'
            }, {
                name: polyglot.t('withMinValue'),
                type: 'min'
            }, {
                name: polyglot.t('withMaxValue'),
                type: 'max'
            }]
        });
        Ext.create('Ext.data.Store', {
            storeId: 'normalization4polarchart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('no'),
                type: 'no'
            }, {
                name: polyglot.t('yes'),
                type: 'yes'
            }]
        });
        Ext.create('Ext.data.Store', {
            storeId: 'aggregate4chart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('none'),
                type: 'none'
            },
//            {
//                name: 'Min',
//                type: 'min'
//            },{
//                name: 'Max',
//                type: 'max'
//            },
                {
                    name: polyglot.t('average'),
                    type: 'avg'
                }, {
                    // 	name: polyglot.t('all'),
                    // 	type: 'topall'
                    // }, {
                    name: polyglot.t('selectedAreaForChart'),
                    type: 'select'
                }]
        });

        Ext.create('Ext.data.Store', {
            storeId: 'areas4chart',
            fields: ['name', 'type'],
            data: [{
                name: polyglot.t('justSelect'),
                type: 'select'
            }, {
                name: polyglot.t('treeAll'),
                type: 'treeall'
            }, {
                name: polyglot.t('treeLowestLevel'),
                type: 'treelowest'
            }
            ]
        });

        Ext.create('Ext.data.Store', {
            storeId: 'normalization4chart',
            fields: ['name', 'type'],
            data: [
                {
                    name: polyglot.t('none'),
                    type: ''
                }, {
                    name: polyglot.t('area'),
                    type: 'area'
                }, {
                    name: polyglot.t('attribute'),
                    type: 'attribute'
                }, {
                    name: polyglot.t('attributeSet'),
                    type: 'attributeset'
                }
            ]
        });

        Ext.create('Ext.data.Store', {
            storeId: 'change_units',
            fields: ['name', 'type'],
            data: [
                {
                    name: polyglot.t('none'),
                    type: ''
                }, {
                    name: 'm2',
                    type: 'm2'
                }, {
                    name: 'ha',
                    type: 'ha'
                }, {
                    name: 'km2',
                    type: 'km2'
                }, {
                    name: '%',
                    type: '%'
                }
            ]
        });

        Ext.create('Ext.data.Store', {
            storeId: 'area_units',
            fields: ['name', 'type'],
            data: [
                {
                    name: 'm2',
                    type: 'm2'
                }, {
                    name: 'ha',
                    type: 'ha'
                }, {
                    name: 'km2',
                    type: 'km2'
                }
            ]
        });

        // JJJ Neni to zbytecne?
        Ext.create('Ext.data.Store', {
            storeId: 'mappedattribute4chart',
            model: 'Puma.model.MappedChartAttribute',
            data: []
        })

        Ext.create('Ext.data.Store', {
            storeId: 'location4init',
            sorters: [{
                sorterFn: function (r1, r2) {
                    var d1 = r1.get('dataset');
                    var d2 = r2.get('dataset');
                    if (!d1) return -1;
                    if (!d2) return 1;
                    return 0;
                }
            }, {
                property: 'name',
                direction: 'ASC'
            }],
            fields: ['name', 'locGid', 'location', 'dataset', 'at', 'bbox', '_id'],
            filters: [function (rec) {
                return false;
            }],
            data: []
        });

    },

    onEvent: function (type, options) {
        if (type === "REDUX_SCOPES_ADD"){

        }
    }

});


Ext.define('PumaMain.controller.LocationTheme', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {

        Observer.addListener("PumaMain.controller.LocationTheme.reloadWmsLayers",this.reloadWmsLayers.bind(this));

        Stores.addListener(this.areaTemplateChange.bind(this));
        Stores.addListener(this.triggerConfirm.bind(this));

        Stores.addListener(this.setLocationFromRedux.bind(this));
        Stores.addListener(this.setThemeFromRedux.bind(this));
        Stores.addListener(this.setPeriodsFromRedux.bind(this));
        Stores.addListener(this.setVisualizationFromRedux.bind(this));

        this.control({
            '#initialdataset':{
                change: this.onDatasetChange
            },
            '#initiallocation':{
                change: this.onLocationChange
            },
            '#initialtheme':{
                change: this.onThemeChange
            },
            '#seldataset':{
                change: this.onDatasetChange
            },
            '#sellocation':{
                change: this.onLocationChange
            },
            '#seltheme': {
                change: this.onThemeChange
            },
            '#selyear': {
                change: this.onYearChange
            },
            '#selvisualization': {
                change: this.onVisChange
            },
            '#initialconfirm': {
                click: this.onConfirm
            },
            '#acceptAgreement': {
                click: this.onAcceptAgreement
            },
            '#cancelAgreement': {
                click: this.onCancelAgreement
            }
        })

        Observer.notify('LocationTheme#init');
    },

    setLocationFromRedux: function(type, options){
        if (type === 'REDUX_SET_ACTIVE_PLACES'){
            if (options && options.keys){
                let locationCombo = Ext.ComponentQuery.query('#sellocation')[0];
                let locComboValue = locationCombo.value;
                let placeId = options.keys;

                if (placeId.length){
                    placeId = placeId[0];
                }


                if (placeId !== locComboValue){
                    locationCombo.setValue(placeId);
                }
            }
        }
    },

    setThemeFromRedux: function(type, options){
        if (type === 'REDUX_SET_ACTIVE_THEME'){
            if (options && options.key){
                ThemeYearConfParams.theme = options.key;
                let themeCombo = Ext.ComponentQuery.query('#seltheme')[0];
                let themeComboValue = themeCombo.value;
                let activeThemeKey = options.key;
                if (activeThemeKey !== themeComboValue){
                    themeCombo.setValue(activeThemeKey);
                }
            }
        }
    },

    setPeriodsFromRedux: function(type, options){
        if (type === 'REDUX_SET_ACTIVE_PERIODS'){
            if (options && options.keys){
                let periodsCombo = Ext.ComponentQuery.query('#selyear')[0];
                let periodsComboValue = periodsCombo.value;
                let activePeriodsKey = options.keys;
                if (activePeriodsKey !== periodsComboValue){
                    periodsCombo.setValue(activePeriodsKey);
                }
            }
        }
    },

    setVisualizationFromRedux: function(type, options){
        if (type === 'REDUX_SET_ACTIVE_VISUALIZATION'){
            if (options && options.key){
                ThemeYearConfParams.visualization = options.key;
                let visualizationCombo = Ext.ComponentQuery.query('#selvisualization')[0];
                let visualizationComboValue = visualizationCombo.value;
                let activeVisKey = options.key;
                if (activeVisKey !== visualizationComboValue){
                    visualizationCombo.setValue(activeVisKey);
                }
            }
        }
    },

    triggerConfirm: function(action){
        if (action === "confirmInitialSelection"){
            this.onConfirm();
        }
    },
    onAcceptAgreement: function() {
        var checked = Ext.ComponentQuery.query('#agreementCheck')[0].getValue();
        if (!checked) {
            this.onCancelAgreement();
            return;
        }
        this.agreementAccepted = true;
        Ext.get('content-intro-terms').hide();

    },
    onCancelAgreement: function() {
        window.location = '/';
    },
    onDatasetChange: function(cnt,val) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        // new URBIS change
        if (!$('body').hasClass("intro")){
            console.log('LocationTheme#onDatasetChange Show Loading');
            $("#loading-screen").css({
                display: "block",
                background: "radial-gradient(rgba(255, 255, 255, .85), rgba(230, 230, 230, .85))"
            })
        }
        ThemeYearConfParams.datasetChanged = true;
        if (cnt.eventsSuspended) {
            return;
        }
        this.getController('Select').selMap = {'ff4c39':[]};
        this.datasetChanged = true;
        var locationCombo = Ext.ComponentQuery.query(cnt.initial ? '#initiallocation':'#sellocation')[0];
        var locationComboAlt = Ext.ComponentQuery.query(!cnt.initial ? '#initiallocation':'#sellocation')[0] || locationCombo;
        var themeCombo = Ext.ComponentQuery.query(cnt.initial ? '#initialtheme':'#seltheme')[0];
        var themeComboAlt = Ext.ComponentQuery.query(!cnt.initial ? '#initialtheme':'#seltheme')[0] || themeCombo;
        var layersCtrl = this.getController('Layers');
        // to be set on dataset level
        if (val==4054) {
            layersCtrl.scaleBorder = layersCtrl.scaleBorderCnst;
        }
        else {
            layersCtrl.scaleBorder = 1000000000;
        }

        locationCombo.suspendEvents();
        locationComboAlt.suspendEvents();
        themeComboAlt.suspendEvents();
        themeCombo.resumeEvents();

        var locStore = Ext.StoreMgr.lookup('location4init');
        locStore.clearFilter(true);
        var locCount = locStore.query('dataset',val).getCount();

        var locationsData = locStore.query('dataset',val);
        ThemeYearConfParams.allPlaces = [];
        locationsData.items.forEach(function(item){
            ThemeYearConfParams.allPlaces.push(item.raw.id);
        });

        var stores = ['layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataview'];
        stores.forEach(function(store){
            var extStore = Ext.StoreMgr.lookup(store);
            extStore.proxy.extraParams = { scope: val };
            extStore.load();
        });

        locStore.filter([
            function(rec) {
                if (locCount == 1){
                    return rec.get('dataset')==val || (!rec.get('dataset') && locCount>1);
                } else {
                    return rec.get('id') == 'custom' || rec.get('dataset')==val || (!rec.get('dataset') && locCount>1);
                }
            }
        ]);
        if (locCount == 1){
            this._hasOnlyOnePlace = true;
        }


        locationCombo.show();
        var first = locStore.findRecord('id','2450_1') || locStore.getAt(0);
        if (first && !cnt.initial) {
            locationCombo.setValue(first);

        }
        var themeStore = Ext.StoreMgr.lookup('theme4sel');
        themeStore.clearFilter(true);
        themeStore.filter([

            function(rec) {
                return rec.get('dataset')==val;
            }
        ]);
        themeCombo.eventsSuspended = 0;
        var first = themeStore.getAt(0);
        if (first && !cnt.initial) {
            themeCombo.setValue(first)
        }
        if (cnt.initial) {
            locationCombo.emptyText = polyglot.t('selectPlace');
            locationCombo.setValue(null);
            if (themeCombo && themeCombo.isVisible()) {
                themeCombo.emptyText = polyglot.t('selectTheme');
                themeCombo.setValue(null);
            }
        }

        locationCombo.resumeEvents();
        locationComboAlt.resumeEvents();
        themeComboAlt.resumeEvents();

        Observer.notify('scopeChange');
    },

    onLocationChange: function(cnt,val) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        // URBIS change
        if ((!val) && !cnt.initial && this.locationInitialized) {
            this.forceInit = true;
            this.updateLayerContext();
            this.forceInit = false;
        }
        //if ((val=='custom' || val=='Custom' || !val) && !cnt.initial && this.locationInitialized) {
        //    this.forceInit = true;
        //    this.updateLayerContext();
        //    this.forceInit = false;
        //}
        if (!cnt.initial) {
            this.locationInitialized = true;
        }

        // URBIS Change
        if (cnt.initial || !val) {

            return;
        }

        ////cnt.eventsSuspended ||
        //if (cnt.initial || val=='custom' || val=='Custom' || !val) {
        //    return;
        //}

        var locObj = this.getController('Area').getLocationObj();
        if (this.datasetChanged) {

            this.locationChanged = true;
            this.onYearChange(cnt);
            return;
        }
        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();

        var nodesToCollapse = [];
        var nodeToExpand = null;
        for (var i=0;i<areaRoot.childNodes.length;i++) {
            var node = areaRoot.childNodes[i];
            if (node.get('loc') == locObj.location && (node.get('definedplace') || node.get('gid')==locObj.locGid)) {
                nodeToExpand = node;
            }
            else {
                nodesToCollapse.push(node);
            }
        }
        for (var i=0;i<nodesToCollapse.length;i++) {
            var node = nodesToCollapse[i];
            if (nodeToExpand || i!=nodesToCollapse.length-1) {
                node.suppress = true;
            }
            node.collapse();
            node.suppress = false;
        }
        if (nodeToExpand) {
            var loaded = nodeToExpand.get('loaded') || nodeToExpand.isLeaf();
            if (!loaded) {
                this.locationChanged = true;
            }
            nodeToExpand.expand();

            if (loaded) {
                this.getController('Area').scanTree();
                if (nodesToCollapse.length) {
                    var selController = this.getController('Select');
                    this.getController('Area').colourTree(selController.colorMap);
                    this.getController('Layers').colourMap(selController.colorMap);
                }
                this.getController('Chart').reconfigureAll();
                this.getController('Layers').reconfigureAll();
                this.getController('Area').zoomToLocation();
            }
        }
        else {
            this.getController('Area').scanTree();
            if (nodesToCollapse.length) {
                var selController = this.getController('Select');
                this.getController('Area').colourTree(selController.colorMap);
                this.getController('Layers').colourMap(selController.colorMap);
                this.getController('Chart').reconfigureAll();
                this.getController('Layers').reconfigureAll();
            }
            this.getController('Area').zoomToLocation();
        }
        this.forceInit = true;
        this.updateLayerContext();
        this.forceInit = false;

        this.reloadWmsLayers();
        // new URBIS change
        this.newOnChange({
            placeChanged: true
        });

        this.checkAttrSets(this.attributeSets, this.theme);
    },

    onConfirm: function() {
        if (Config.toggles.useWBAgreement && !this.agreementAccepted){
            console.info("Access not allowed. You have to agree with Agreement.");
            return;
        }
        var val = Ext.ComponentQuery.query('#initialtheme')[0].getValue();
        this.onThemeChange({switching:true},val);
    },

    onThemeChange: function(cnt,val) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        if (cnt.eventsSuspended || cnt.initial || !val) {
            return;
        }
        this.themeChanged = true;
        var themeCombo = null;
        if (cnt.switching) {
            this.getController('Area').showLoading("block");
            this.getController('DomManipulation').renderApp();
            this.getController('Render').renderApp();
            themeCombo = Ext.ComponentQuery.query('#seltheme')[0];
            var datasetVal = Ext.ComponentQuery.query('#initialdataset')[0].getValue();
            var datasetCombo = Ext.ComponentQuery.query('#seldataset')[0];
            var locationVal = Ext.ComponentQuery.query('#initiallocation')[0].getValue();
            var locationCombo = Ext.ComponentQuery.query('#sellocation')[0];
            datasetCombo.suspendEvents();
            locationCombo.suspendEvents();
            themeCombo.suspendEvents();

            datasetCombo.setValue(datasetVal);
            locationCombo.setValue(locationVal);
            themeCombo.setValue(val);

            datasetCombo.resumeEvents();
            locationCombo.resumeEvents();
            themeCombo.resumeEvents();


        }
        themeCombo = themeCombo || Ext.ComponentQuery.query('#seltheme')[0];
        var yearCnt = Ext.ComponentQuery.query('#selyear')[0];
        var visCnt = Ext.ComponentQuery.query('#selvisualization')[0];
        yearCnt.suspendEvents();
        visCnt.suspendEvents();

        var visStore = Ext.StoreMgr.lookup('visualization4sel');
        var yearStore = Ext.StoreMgr.lookup('year4sel');

        var themeStore = Ext.StoreMgr.lookup('theme');
        var themeYears = themeStore.getById(val).get('years');

        yearStore.clearFilter(true);
        yearStore.filter([function(rec) {
            return Ext.Array.contains(themeYears,rec.get('_id'))
        }])

        visStore.clearFilter(true);
        visStore.filter([function(rec) {
            return rec.get('theme')==val
        }]);

        // add all years to ThemeYearConfParams
        ThemeYearConfParams.allYears = [];
        var yearStoreContent = yearStore.getRange();
        for(var yearIndex in yearStoreContent){
            if(!yearStoreContent.hasOwnProperty(yearIndex)) continue;
            ThemeYearConfParams.allYears.push(yearStoreContent[yearIndex].get('_id'));
        }

        var vis = visCnt.getValue();
        var first = visStore.getAt(0);
        if (first && first.get('_id')!=vis) {
            visCnt.setValue(first.get('_id'));
            this.visChanged = true;
        }
        var years = yearCnt.getValue();
        if (!years.length && !Config.toggles.hideSelectorToolbar) {
            this.yearChanged = true;
            var yearCount = yearStore.getCount();
            yearCnt.setValue([yearStore.getAt(yearCount-1).get('_id')])
        }
        yearCnt.resumeEvents();
        visCnt.resumeEvents();
        this.onYearChange(themeCombo);

        // new URBIS change
        this.newOnChange({
            themeChanged: true
        });

        this.checkAttrSets(this.attributeSets, Ext.StoreMgr.lookup('theme').getById(val));
    },

    onYearChange: function(cnt) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        var val = Ext.ComponentQuery.query('#selyear')[0].getValue();
        if (!val.length || cnt.eventsSuspended) {
            //this.getController('Area').showLoading("none");
            return;
        }
        if (cnt.itemId=='selyear' ) {
            this.yearChanged = true;
        }
        var isFilter = cnt.itemId == 'filter' || cnt.itemId == 'selectfilter';
        var detailLevelChanged = cnt.itemId == 'detaillevel';

        var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var vis = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        var params = {
            theme: theme,
            years: JSON.stringify(years),
            dataset: dataset
        };
        var areaController = this.getController('Area');

        var locationObj = areaController.getLocationObj();
        var cntId = cnt.itemId;

        var root = Ext.StoreMgr.lookup('area').getRootNode();

        params['refreshLayers'] = (this.themeChanged) ? true : null;
        params['refreshAreas'] = (this.yearChanged || this.datasetChanged || this.locationChanged || detailLevelChanged || isFilter) ? true : false;

        if (params['refreshLayers']) {
            params['queryTopics'] = this.getQueryTopics(theme);
        }
        var locationId = locationObj.location;
        if (this.datasetChanged && locationId && !this._hasOnlyOnePlace) {
            var expanded = {};
            var areaTemplateId = locationObj.at;
            var locGid = locationObj.locGid;
            expanded[locationId] = {};
            expanded[locationId][areaTemplateId] = [locGid];
            params['expanded'] = JSON.stringify(expanded);
        }
        if (detailLevelChanged) {
            var parentGids = this.getController('Area').detailLevelParents;
            params['parentgids'] = JSON.stringify(parentGids);
            params['artifexpand'] = true;
        }
        if (Config.cfg) {
            params['expanded'] = JSON.stringify(Config.cfg.expanded);
        }
        if (cntId=='selyear' && root.hasChildNodes() || isFilter) {
            var expandedAndFids = this.getController('Area').getExpandedAndFids();
            params['expanded'] = JSON.stringify(expandedAndFids.loaded);
            params['fids'] = JSON.stringify(expandedAndFids.fids);
        }
        if (cntId=='slider') {
            params['parentgids'] = JSON.stringify(this.getController('Area').parentGids)
        }
        if (cntId=='selectfilter') {
            delete params['fids'];
        }

        if (!detailLevelChanged && !this.yearChanged) {
            this.reloadWmsLayers();
        }

        var me = this;
        Ext.Ajax.request({
            url: Config.url+'api/theme/getThemeYearConf',
            params: params,
            scope: this,
            originatingCnt: cnt,
            visChanged: this.visChanged,
            themeChanged: this.themeChanged,
            datasetChanged: this.datasetChanged,
            locationChanged: this.locationChanged,
            yearChanged: this.yearChanged,
            success: this.onThemeLocationConfReceived,
            failure: function() {
                me.getController('Area').showLoading("none");
            }
        });

        if (this.visChanged) {
            this.getController('Chart').loadVisualization(vis);
            this.getController('Layers').loadVisualization(vis);
        }
        this.datasetChanged = null;
        this.locationChanged = null;
        this.visChanged = null;
        this.themeChanged = null;
        this.yearChanged = null;

        // new URBIS change
        ThemeYearConfParams.action = cntId;
        this.newOnChange();
    },

    reloadWmsLayers: function() {
        var areaController = this.getController('Area');
        var layersController = this.getController('Layers');

        var dataset = Ext.ComponentQuery.query('#seldataset')[0] && Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var years = Ext.ComponentQuery.query('#selyear')[0] && Ext.ComponentQuery.query('#selyear')[0].getValue();
        var location = areaController.getLocationObj() && areaController.getLocationObj().location;

        var selectedLayers = Config.cfg && Config.cfg.layers || [];
        selectedLayers = selectedLayers
            .filter(function(layer){return layer.type == "wmsLayer"})
            .map(function(layer){
                return layer.name;
            });
        var selectedNodes = [];

        var self = this;
        $.get(Config.url+'rest/wms/layer', {
            scope: dataset,
            place: location,
            periods: years
        }, function(data){
            // TODO: Remove the test data
            var customWms = Ext.StoreMgr.lookup('layers').getRootNode().findChild('type', 'customwms');
            var previousNodes = customWms.childNodes;

            Ext.StoreMgr.lookup('selectedlayers').remove(previousNodes);
            customWms.removeAll();

            if(data.data && data.data.length) {
                var nodes = data.data.map(function(layer, index) {
                    var node = Ext.create('Puma.model.MapLayer', {
                        name: layer.name,
                        id: layer.id,
                        initialized: true,
                        allowDrag: true,
                        checked: false,
                        leaf: true,
                        sortIndex: index,
                        type: 'wmsLayer'
                    });

                    if(selectedLayers.indexOf(layer.name) != -1) {
                        selectedNodes.push(node);
                    }

                    return node;
                });
                Ext.StoreMgr.lookup('selectedlayers').loadData(nodes,true);
                customWms.appendChild(nodes);

                selectedNodes.forEach(function(node){
                    node.set('checked', true);
                    layersController.onCheckChange(node, true);
                });
            }
        });
    },

    // new URBIS change
    newOnChange: function(params){
        if (!ThemeYearConfParams.datasetChanged){
            if (params && params.hasOwnProperty("placeChanged")){
                ThemeYearConfParams.placeChanged = params.placeChanged;
            }
            else {
                ThemeYearConfParams.placeChanged = false;
            }

            // detect if theme has been changed
            if (params && params.hasOwnProperty("themeChanged")){
                ThemeYearConfParams.themeChanged = params.themeChanged;
                Observer.notify("rebuild");
            }
            else {
                ThemeYearConfParams.themeChanged = false;
            }

            // detect if year has been changed
            var currentYears = Ext.ComponentQuery.query('#selyear')[0].getValue();
            var cYears = "[" + currentYears.toString() + "]";
            if (ThemeYearConfParams.years != cYears){
                Observer.notify("rebuild");
            }
        }

        // current dataset
        var dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        ThemeYearConfParams.dataset = dataset.toString();

        // current place
        var locObj = this.getController('Area').getLocationObj();
        if (locObj.location){
            ThemeYearConfParams.place = locObj.location.toString();
        }
        else {
            ThemeYearConfParams.place = "";
        }
        //current theme
        var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        ThemeYearConfParams.theme = theme.toString();

        // current years
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        ThemeYearConfParams.years = "[" + years.toString() + "]";

        // current visualization
        var visualization = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        if (visualization){
            ThemeYearConfParams.visualization = visualization.toString();
        } else {
            ThemeYearConfParams.visualization = "";
        }

    },
    onVisChange: function(cnt) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        if (cnt.eventsSuspended) {
            return;
        }
        var val = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        if (val) {
            this.getController('Chart').loadVisualization(val);
            this.getController('Layers').loadVisualization(val);
            this.getController('Chart').reconfigureAll();
            //this.getController('Layers').reconfigureAll();
            this.getController('Layers').checkVisibilityAndStyles();

            ThemeYearConfParams.visualization = val.toString();
            Observer.notify("rebuild");
        }
    },

    refreshVisualization: function() {
        this.onVisChange({});
    },
    refreshTheme: function() {
        var val = Ext.ComponentQuery.query('#seltheme')[0].getValue()
        this.onThemeChange({},val);
    },

    onFilter: function() {
        var filterCmp = null;
        this.onYearChange(filterCmp)
    },

    getQueryTopics: function(theme) {
        var layerRoot = Ext.StoreMgr.lookup('layers').getRootNode();
        var children = layerRoot.childNodes;
        var presentTopics = [];
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            var topic = node.get('topic');
            if (topic) {
                presentTopics.push(topic);
            }
        }
        var themeTopics = Ext.StoreMgr.lookup('theme').getById(theme).get('topics');
        var queryTopics = Ext.Array.difference(themeTopics, presentTopics);
        if (themeTopics.length != queryTopics.length) {
            return queryTopics;

        }
    },



    addAreas: function(areasToAdd) {
        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();
        areaRoot.removeAll();
        var data = [];
        var currentLevel = [];
        var parentLevel = null;
        var level = null;
        var leafMap = {};
        for (var i=0;i<areasToAdd.length;i++) {
            var area = areasToAdd[i];
            level = level || area.at;
            //area.children = [];
            if (area.at!=level) {
                level = area.at;
                parentLevel = currentLevel;
                currentLevel = [];
            }
            if (!area.leaf) {
                area.expandable = true;
                area.children = [];
            }
            else {
                leafMap[area.loc] = leafMap[area.loc] || {};
                leafMap[area.loc][area.at] = leafMap[area.loc][area.at] || [];
                leafMap[area.loc][area.at].push(area.gid)
            }
            area.id = area.at+'_'+area.gid;
            var node = Ext.create('Puma.model.Area',area);
            if (!area.parentgid) {
                data.push(node);
            }
            else {
                for (var j=0;j<parentLevel.length;j++) {
                    if (parentLevel[j].get('gid') == area.parentgid) {
                        parentLevel[j].set('expanded',true);
                        parentLevel[j].appendChild(node)
                    }
                }
            }
            currentLevel.push(node);
        }
        areaRoot.removeAll();
        //areaRoot.appendChild(data);
        areaRoot.suspendEvents();
        if (!OneLevelAreas.hasOneLevel){
            areaRoot.appendChild(data);
        }
        areaRoot.resumeEvents();
    },

    refreshAreas: function(add,remove) {
        var root = Ext.StoreMgr.lookup('area').getRootNode();
        var changed = false;
        var nodesToDestroy = [];

        var tree = Ext.ComponentQuery.query('#areatree')[0];

        tree.suspendEvents();

        tree.view.dontRefreshSize = true;
        for (var loc in remove) {
            var locRoot = root.findChild('loc',loc);
            for (var at in remove[loc]) {
                locRoot.cascadeBy(function(node) {
                    if (node.get('at')!=at) return;
                    if (Ext.Array.contains(remove[loc][at],node.get('gid'))) {
                        nodesToDestroy.push(node);
                        changed = true;
                    }
                });
            }
        }
        for (var i=0;i<nodesToDestroy.length;i++) {
            var node = nodesToDestroy[i]
            node.set('id',node.get('at')+'_'+node.get('gid'));
            Ext.suspendLayouts();
            node.parentNode.removeChild(node,false);
            Ext.resumeLayouts(true);
        }
        var datasetId = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var featureLayers = Ext.StoreMgr.lookup('dataset').getById(datasetId).get('featureLayers');

        let parentNodes = {};
        for (var i = 0;i<add.length;i++) {
            var area = add[i];
            var loc = area.loc;
            var at = area.at;
            var atIndex = Ext.Array.indexOf(featureLayers,at);
            var prevAtIndex = atIndex>0 ? atIndex-1 : null;
            var prevAt = featureLayers[prevAtIndex];
            var parentgid = area.parentgid;

            let nodeId = null;
            root.cascadeBy(function(node) {
                if (!parentgid && node==root) {
                    nodeId = node.internalId;
                    if (!parentNodes[nodeId]){
                        parentNodes[nodeId] = node;
                        if (!parentNodes[nodeId].areasToAdd){
                            parentNodes[nodeId].areasToAdd = [];
                        }
                    }
                    return false;
                }
                if (node==root) return;
                if (node.get('loc')==loc && node.get('at')==prevAt && node.get('gid')==parentgid) {
                    nodeId = node.internalId;
                    if (!parentNodes[nodeId]){
                        parentNodes[nodeId] = node;
                        if (!parentNodes[nodeId].areasToAdd){
                            parentNodes[nodeId].areasToAdd = [];
                        }
                    }
                    return false;
                }
            });

            if (parentNodes[nodeId]){
                area.id = area.at+'_'+area.gid;
                parentNodes[nodeId].areasToAdd.push(area);
            }
        }
        for (var key in parentNodes){
            var node = parentNodes[key];
            if (node.areasToAdd && node.areasToAdd.length){
                changed = true;
                node.appendChild(node.areasToAdd);
            }
        }

        tree.resumeEvents();

        tree.view.dontRefreshSize = false;
        if (changed) {
            //Ext.StoreMgr.lookup('area').sort();
            tree.view.refresh();
        }
        return changed;
    },


    updateLayerContext: function() {

    },
    initializeLayer: function(node,layer,year,cfg) {
        var at = node.get('at');
        var symbologyId = node.get('symbologyId');
        symbologyId = symbologyId=='#blank#' ? '' : symbologyId;
        var atCfg = cfg[at];
        var layers = [];
        var symbologies = [];
        var selectedLoc = this.getController('Area').getLocationObj().location;
        if (selectedLoc) {
            atCfg = {};
            atCfg[selectedLoc] = cfg[at][selectedLoc];
        }
        for (var loc in atCfg) {
            if (!atCfg[loc]) {
                return;
            }
            var locCfg = atCfg[loc][year] || [];

            for (var i=0;i<locCfg.length;i++) {
                layers.push(locCfg[i].layer);
                symbologies.push(symbologyId || '');
            }

        }
        layer.initialized = true;
        layers.sort();
        layer.mergeNewParams({
            layers: layers.join(','),
            styles: symbologies.join(',')
        })
        var src = this.getController('Layers').getLegendUrl(layers[0],null,symbologyId);
        node.set('src',src)
        if (node.get('checked')) {
            layer.setVisibility(true);
        }
    },



    removeLayers: function() {
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var topics = Ext.StoreMgr.lookup('theme').getById(themeId).get('topics');
        var root = Ext.StoreMgr.lookup('layers').getRootNode();
        var nodesToDestroy = [];
        var thematicNodes = [];
        root.eachChild(function(node) {
            if (node.get('type')=='thematicgroup') {
                thematicNodes.push(node);
            }
        },this);
        for (var i = 0; i < thematicNodes.length; i++) {
            var thematicNode = thematicNodes[i];
            for (var j = 0; j < thematicNode.childNodes.length; j++) {
                var node = thematicNode.childNodes[j];
                var topic = node.get('topic');
                if (topic && !Ext.Array.contains(topics, parseInt(topic))) {
                    node.get('layer1').setVisibility(false);
                    node.get('layer2').setVisibility(false);
                    nodesToDestroy.push(node);
                }
            }
        }

        for (var i=0;i<nodesToDestroy.length;i++) {
            nodesToDestroy[i].destroy();
        }

        // deleting empty groups
        var groupsToDestroy = [];
        for (var i = 0; i < thematicNodes.length; i++) {
            if (!thematicNodes[i].childNodes.length) {
                groupsToDestroy.push(thematicNodes[i])
            }
        }
        for (var i=0;i<groupsToDestroy.length;i++) {
            groupsToDestroy[i].destroy();
        }
    },


    appendLayers: function(layerNodes) {
        layerNodes = layerNodes || [];
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var topics = Ext.StoreMgr.lookup('theme').getById(themeId).get('topics');
        var nodesToAdd = [];
        for (var i = 0; i < layerNodes.length; i++) {
            var topic = layerNodes[i].topic;
            if (Ext.Array.contains(this.topics || [], topic)) {
                continue;
            }
            nodesToAdd.push(layerNodes[i])
        }
        this.topics = topics;

        var root = Ext.StoreMgr.lookup('layers').getRootNode();
        var childNodes = root.childNodes;
        var areaLayerNode = null;
        var selectedLayerNode = null;
        var systemNode = null;
        var thematicNode = null;
        var layerGroupsToAdd = [];
        var layerGroupsMap = [];
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            var type = node.get('type');

            if (type == 'systemgroup') {
                systemNode = node;
            }
//                if (type=='thematicgroup') {
//                    thematicNode = node;
//                }
        }
        var layerGroupStore = Ext.StoreMgr.lookup('layergroup');
        // for (var i = 0; i < nodesToAdd.length; i++) {
        //     var nodeToAdd = nodesToAdd[i];
        //     var layerGroupId = nodeToAdd.layerGroup;
        //     if (!layerGroupId) continue;
        //     var layerGroupNode = root.findChild('layerGroup', layerGroupId);
        //     if (!layerGroupNode) {
        //         var count = root.childNodes.length;
        //         var layerGroupRec = layerGroupStore.getById(layerGroupId);
        //
        //         var priorities = Ext.Array.map(root.childNodes,function(chNode) {
        //             return chNode.get('priority')
        //         })
        //         priorities = Ext.Array.clean(priorities);
        //         var priority = layerGroupRec.get('priority')
        //         priorities.push(priority);
        //         // from highest priority to lowest
        //         priorities.sort();//.reverse();
        //         var idx = Ext.Array.indexOf(priorities,priority);
        //
        //         layerGroupNode = root.insertChild(2+idx,{
        //             name: layerGroupRec.get('name'),
        //             layerGroup: layerGroupId,
        //             type: 'thematicgroup',
        //             priority: layerGroupRec.get('priority'),
        //             expanded: true,
        //             checked: null
        //         })
        //     }
        //     layerGroupNode.appendChild(nodeToAdd)
        // }


        if (!systemNode.childNodes.length) {
            selectedLayerNode = {
                type: 'selectedareas',
                name: polyglot.t('selectedAreas'),
                sortIndex: 0,
                checked: false,
                leaf: true
            };
            selectedLayerFilledNode = {
                type: 'selectedareasfilled',
                name: polyglot.t('selectedAreasFilled'),
                sortIndex: 0,
                checked: true,
                leaf: true
            };
            areaLayerNode = {
                type: 'areaoutlines',
                sortIndex: 1,
                name: polyglot.t('areaOutlines'),
                checked: true,
                leaf: true
            };
            systemNode.appendChild([selectedLayerNode, selectedLayerFilledNode, areaLayerNode]);
        }



        var layersToAdd = [];

        var layerDefaults = this.getController('Layers').getWmsLayerDefaults();


        for (var i = 0; i < root.childNodes.length; i++) {
            var node = root.childNodes[i];
            if (node.get('type') == 'thematicgroup' || node.get('type') == 'systemgroup') {
                for (var j = 0; j < node.childNodes.length; j++) {
                    var layerNode = node.childNodes[j];
                    if (layerNode.get('layer1'))
                        continue;
                    if (node.get('type') == 'thematicgroup' && !Ext.Array.contains(topics, layerNode.get('topic')))
                        continue;
                    Ext.Array.include(layersToAdd, layerNode);
                    var params = Ext.clone(layerDefaults.params);
                    var layerParams = Ext.clone(layerDefaults.layerParams);
                    if (node.get('type')=='thematicgroup') {
                        params.tiled = true;
                        delete layerParams.singleTile;
                        layerParams.tileSize = new OpenLayers.Size(256,256)
                        layerParams.removeBackBufferDelay = 0;
                        layerParams.transitionEffect = null;
                    }
                    var layer1 = new OpenLayers.Layer.WMS('WMS', Config.url + 'geoserver/wms', Ext.clone(params), Ext.clone(layerParams));
                    var layer2 = new OpenLayers.Layer.WMS('WMS', Config.url + 'geoserver/wms', Ext.clone(params), Ext.clone(layerParams));
                    if (node.get('type') == 'thematicgroup') {
                        layer1.events.register('visibilitychanged',{layer:layer1,me:this},function(a,b,c) {
                            this.me.getController('Layers').onLayerLegend(null,this.layer.nodeRec,this.layer.visibility);
                        })
                    }
                    layerNode.set('layer1', layer1);
                    layerNode.set('layer2', layer2);
                    layer1.nodeRec = layerNode;
                    layer2.nodeRec = layerNode;
                }
            }
        }
        Ext.StoreMgr.lookup('selectedlayers').loadData(layersToAdd, true);
        var layerController = this.getController('Layers');
        layerController.resetIndexes();
        layerController.onLayerDrop();
    },
    updateLeafs: function(leafMap) {
        var root = Ext.StoreMgr.lookup('area').getRootNode();
        root.cascadeBy(function(node) {
            var loc = node.get('loc');
            var at = node.get('at');
            var gid = node.get('gid');
            if (leafMap[loc] && leafMap[loc][at] && leafMap[loc][at][gid]) {
                node.set('leaf', true);
                node.set('expanded', false)
            }
            else if (node.get('leaf')) {
                node.set('leaf', false)
            }
        })

    },
    onThemeLocationConfReceived: function(response) {
        ThemeYearConfParams.actions.push(response.request.options.originatingCnt.itemId);

        var conf = JSON.parse(response.responseText).data;
        var scope = Ext.StoreMgr.lookup('dataset').getById(Number(response.request.options.params.dataset));

        if (conf.hasOwnProperty("auRefMap")){
            OlMap.auRefMap = conf.auRefMap;
            ThemeYearConfParams.auRefMap = conf.auRefMap;
            var counter = 1;
            for (var a in conf.auRefMap){
                var auLevels = Object.keys(conf.auRefMap[a]).length;
                if (auLevels > 1){
                    counter++;
                }
                else {
                    ThemeYearConfParams.auCurrentAt = Object.keys(conf.auRefMap[a])[0];
                }
            }

            OneLevelAreas.hasOneLevel = (counter == 1 && scope.get('oneLevelOnly'));

            Stores.notify('fo#adjustConfiguration');

            var tools = scope.get('removedTools') || [];
            var dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
            var only3D = (tools.indexOf('2dmap') !== -1);

            // if(dataset !== this._datasetId) {
            //     this._datasetId = dataset;
            //     if ((Config.cfg && !Config.cfg.sidebarReportsOpen) || !Config.cfg){
            //         this.getController('DomManipulation')._onReportsSidebarHide();
            //     }
            // }

            if (!scope.get('hideSidebarReports')) {
                $('#sidebar-reports').show();
            } else {
                $('#sidebar-reports').hide();
            }

            if(tools.indexOf('2dmap') !== -1) {
                $('#top-toolbar-3dmap').hide();
            } else {
                $('#top-toolbar-3dmap').show();
            }

            if(tools.indexOf('evaluationTool') !== -1) {
                $('#top-toolbar-selection-filter').hide();
                $('#top-toolbar-selections').hide();
            }

            if(tools.indexOf('mapTools') !== -1) {
                $('#top-toolbar-map-tools').hide();
            }

            // if(tools.indexOf('savedViews') !== -1) {
            //     $('#top-toolbar-saved-views').hide();
            // }

            if(tools.indexOf('savedViews') !== -1 && Config.auth && Config.auth.userName !== "admin") {
                $('#top-toolbar-saved-views').hide();
            }

            // if(tools.indexOf('visualization') !== -1) {
            //     $('.field.visualization').hide();
            // }

            if((tools.indexOf('visualization') !== -1 && Config.auth && Config.auth.userName !== "admin") || (tools.indexOf('visualization-always') !== -1)) {
                $('.field.visualization').hide();
            }


            if(tools.indexOf('context-help') !== -1) {
                $('#top-toolbar-context-help').hide();
            }

            if(tools.indexOf('scope') !== -1) {
                $('.field.scope').hide();
            }

            if(tools.indexOf('period') !== -1) {
                $('#selector-periods').hide();
            }

            if(tools.indexOf('theme') !== -1) {
                $('.field.theme').hide();
            }

            if(tools.indexOf('place') !== -1) {
                $('.field.place').hide();
            }

            if(tools.indexOf('add-layer') !== -1) {
                $('#top-toolbar-custom-layers').hide();
            }

            if(tools.indexOf('3dMap') !== -1) {
                $('#top-toolbar-3dmap').hide();
            }

            if(tools.indexOf('areas') !== -1) {
                $('.areaTreeSelection').hide();
                $('#window-areatree').hide();
                $('#top-toolbar-areas').hide();
            } else {
                $('.areaTreeSelection').show();
                $('#window-areatree').show();
            }

            if (!Config.toggles.isSnow) {
                $('#top-toolbar-areas').show();
            }

            // TODO: To be removed and replaced with toggles.
            if (scope.get("aggregated")) {
                this.getController('DomManipulation')._onReportsSidebarHide();
            }
        }
        if (response.request.options.originatingCnt.itemId == 'selectfilter') {
            this.getController('Select').selectInternal(conf.areas, false, false, 1);
            return;
        }
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var multiMapBtn = Ext.ComponentQuery.query('maptools #multiplemapsbtn')[0];
        multiMapBtn.leftYearsUnchanged = true;
        var multiMapPressed = multiMapBtn.pressed;
        multiMapBtn.toggle(years.length > 1);
        // manually fire change handler, because nothing has changed
        multiMapBtn.leftYearsUnchanged = false;
        if (!conf.layerRefMap) {
            conf = {
                add: conf
            }
        }
        if (conf.layerRefMap) {
            this.getController('Area').areaTemplateMap = conf.auRefMap;
        }
        if (conf.areas) {
            this.addAreas(conf.areas);
            if (!this.initialAdd) {


                Ext.ComponentQuery.query('#areatree')[0].getView().refresh();

                this.initialAdd = true;
            }
            OneLevelAreas.data = conf.areas;
        }
        if (conf.add || conf.remove) {

            var changed = this.refreshAreas(conf.add,conf.remove);
        }
        if (response.request.options.datasetChanged){
            Ext.StoreMgr.lookup('area').sort()
        }
        if (Config.cfg) {
            Ext.StoreMgr.lookup('paging').currentPage = Config.cfg.page;
            var selController = this.getController('Select');
            selController.selMap = Config.cfg.selMap;
            selController.colorMap = selController.prepareColorMap();
            this.getController('Area').colourTree(selController.colorMap);
        }
        if (true) {
            this.removeLayers();
            this.appendLayers(conf.layerNodes);
            Ext.StoreMgr.lookup('layers4outline').load();
        }
        if (conf.layerRefMap) {
            this.layerRefMap = conf.layerRefMap;
            ThemeYearConfParams.layerRefMap = conf.layerRefMap;
        }
        if (conf.layerRefMap || response.request.options.locationChanged) {
            this.updateLayerContext();
        }
        if (conf.leafMap && conf.add) {
            this.updateLeafs(conf.leafMap)
        }
        if (conf.areas || ((conf.add || conf.remove) && changed)) {
            this.getController('Area').scanTree();
            if (response.request.options.datasetChanged) {
                this.getController('Layers').colourMap();
            }
        }
        else if (response.request.options.yearChanged){
            this.getController('Layers').refreshOutlines();
        }
        if (conf.attrSets) {
            this.checkFeatureLayers();
            var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
            var theme = Ext.StoreMgr.lookup('theme').getById(themeId);
            this.checkAttrSets(conf.attrSets, theme);
        }

        this.getController('Chart').reconfigureAll();
        this.getController('Layers').reconfigureAll();
        if (response.request.options.visChanged) {
            this.getController('Layers').checkVisibilityAndStyles();
        }
        if (Config.cfg && Config.cfg.multipleMaps) {
            multiMapBtn.toggle(true);
        }
        if ((response.request.options.locationChanged || response.request.options.datasetChanged) && (response.request.options.originatingCnt.itemId !== "dataview")) {
            this.getController('Area').zoomToLocation();
        }

        if (!this.placeInitialChange) {
            var locStore = Ext.StoreMgr.lookup('location4init');
            this.placeInitialChange = true;
        }

        console.log('LocationTheme#onThemeLocationConfReceived Delete Config');
        delete Config.cfg;

        Stores.notify('extRestructured');
    },
    checkFeatureLayers: function() {
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var theme = Ext.StoreMgr.lookup('theme').getById(themeId);
        var topics = theme.get('topics');
        var store = Ext.StoreMgr.lookup('layertemplate2choose');
        store.clearFilter(true);
        store.filter([function(rec) {
            return Ext.Array.contains(topics,rec.get('topic'));
        }]);
    },

    areaTemplateChange: function(notification){
        if (notification === "areas#areaTemplateChange"){
            this.checkAttrSets(this.attributeSets, this.theme);
        }
    },

    /**
     * Check, if attribute sets has been changed. It also check, if all attributes in menu contain relevant data and omit those,
     * which doesn'n.
     * @param attrSets {Array} list of attribute sets for current configuration
     * @param theme {number} id of theme
     */
    checkAttrSets: function(attrSets, theme) {
        this.attributeSets = attrSets;
        this.theme = theme;

        if (!this.attributeSets || !this.theme){
            return;
        }

        var topics = theme.get('topics'); // get all topics (id's) of current theme
        var attrSetStore = Ext.StoreMgr.lookup('attributeset');
        var attrStore = Ext.StoreMgr.lookup('attribute');

        this.getAttributesWithData(topics, attrSetStore, attrStore)
            .then(this.rebuildAttributesTree.bind(this, topics, this.theme, attrSetStore, attrStore, this.attributeSets));
    },

    /**
     * Rebuild attribute tree with relevant attributes for current configuration. Do not show attributes without data.
     * @param topics {Array}
     * @param theme
     * @param attrSetStore
     * @param attrStore
     * @param allAttributes {Array} list of relevant attributes
     * @param attrSets
     */
    rebuildAttributesTree: function(topics, theme, attrSetStore, attrStore, attrSets, allAttributes){
        var attributesWithData = null;
        if (allAttributes){
            attributesWithData = Ext.Array.filter(allAttributes.attributes, function(rec){
                return rec.type === "text" || rec.distribution[0] > 0 || (rec.min === rec.max);
            });
        } else {
            console.log("LocationTheme#rebuildAttributesTree: No attributes!");
            return;
        }
        var prefTopics = theme.get('prefTopics'); // get pref. topics of current theme
        var a2chStore = Ext.StoreMgr.lookup('attributes2choose');
        var rootNode = a2chStore.getRootNode();

        // clear the store
        while(rootNode.firstChild){
            rootNode.removeChild(rootNode.firstChild);
        }


        // populate the store
        for(var isPref = 1; isPref >= 0; isPref--){ // iterate two bools: is preferential and isn't
            for(var topic in topics){ // iterate topics (id's) of actual theme
                if( isPref != Ext.Array.contains(prefTopics, topics[topic]) ) continue;
                rootNode.appendChild(Ext.create('Puma.model.MappedChartAttribute',{
                    topic: topics[topic],
                    leaf: false,
                    expanded: isPref,
                    checked: null
                }));
                var topicNode = rootNode.lastChild;

                attrSetStore.data.each(function(attrSet){ // iterate attrSets (objects)
                    if(attrSet.get('topic') == topics[topic]){
                        var attrSetAttributes = attrSet.get('attributes');

                        topicNode.appendChild(Ext.create('Puma.model.MappedChartAttribute',{
                            as: attrSet.get('_id'),
                            topic: topics[topic],
                            leaf: false,
                            expanded: false,
                            checked: false
                        }));
                        var attrSetNode = topicNode.lastChild;

                        attrStore.data.each(function(attribute){ // iterate attributes (objects)
                            if( Ext.Array.contains(attrSetAttributes, attribute.get('_id')) && (attribute.data.type === "numeric" || attribute.data.type === "text")){
                                var attrs = Ext.Array.filter(attributesWithData, function(rec){
                                    return (Number(rec.attribute) === attribute.get('_id') && Number(rec.attributeSet) === attrSet.get('_id'));
                                });
                                if (attrs.length > 0){
                                    attrSetNode.appendChild(Ext.create('Puma.model.MappedChartAttribute',{
                                        attr: Number(attribute.get('_id')),
                                        as: Number(attrSet.get('_id')),
                                        topic: topics[topic],
                                        type: attribute.get('type'),
                                        leaf: true,
                                        checked: false
                                    }));
                                }
                            }
                        });
                        if(!attrSetNode.childNodes.length) attrSetNode.remove();
                    }
                });
                if(!topicNode.childNodes.length) topicNode.remove();
            }
        }

        // filter store attributeset2choose
        // povoli ty, jejichz id je v poli attrSets
        var asStoreToFilter = Ext.StoreMgr.lookup('attributeset2choose');
        asStoreToFilter.clearFilter(true);
        asStoreToFilter.filter([function(rec){
            return Ext.Array.contains(attrSets,rec.get('_id'));
        }]);
    },

    /**
     * Go through all attributes for current configuration. Then make statistics request.
     * @param topics {Object}
     * @param attrSetStore {Object}
     * @param attrStore {Object}
     * @returns {Promise}
     */
    getAttributesWithData: function(topics, attrSetStore, attrStore){
        var attributes = [];
        for(var topic in topics){ // iterate topics (id's) of actual theme
            attrSetStore.data.each(function(attrSet){ // iterate attrSets (objects)
                if(attrSet.get('topic') === topics[topic]){
                    var attrSetAttributes = attrSet.get('attributes');
                    attrStore.data.each(function(attribute){ // iterate attributes (objects)
                        if( Ext.Array.contains(attrSetAttributes, attribute.get('_id')) && (attribute.data.type === "numeric" || attribute.data.type === "text")){
                            var attr = $.extend({}, attribute.data);
                            attr.attributeSet = attrSet.data._id;
                            attr.attribute = attribute.data._id;
                            attributes.push(attr);
                        }
                    });
                }
            });
        }

        return this.getAttributesStatistics(attributes);
    },

    /**
     * Get statistics about attributes
     * @param attributes {Array} list of all attributes
     * @returns {Promise}
     */
    getAttributesStatistics: function(attributes){
        var dist = {
            type: 'normal',
            classes: 1
        };

        var params = this.prepareParams();
        return $.post(Config.url + "rest/filter/attribute/statistics", {
            areaTemplate: params.areaTemplate,
            periods: params.periods,
            places: params.locations,
            attributes: attributes,
            distribution: dist
        });
    },

    /**
     * It prepares basics parameters for request according to current configuration.
     * @returns {{areaTemplate: string, locations: [], periods: []}}
     */
    prepareParams: function () {
        var locations;
        if (ThemeYearConfParams.place.length > 0) {
            locations = [Number(ThemeYearConfParams.place)];
        } else {
            locations = ThemeYearConfParams.allPlaces;
        }
        return {
            areaTemplate: ThemeYearConfParams.auCurrentAt,
            locations: locations,
            periods: JSON.parse(ThemeYearConfParams.years)
        }
    },

    checkUserPolygons: function(years,analysis,callback) {
        Ext.Ajax.request({
            url: Config.url+'api/userpolygon/checkAnalysis',
            params: {
                analysis: JSON.stringify(analysis || [955]),
                years: JSON.stringify(years || [277])
            },
            success: callback
        })
    },

    onVisualizationChange: function(btn,value,forceVisReinit) {
        if (!value) return;
        var itemId = btn.ownerCt.itemId;
        var visChanged = false;
        if (forceVisReinit===true || itemId == 'visualizationcontainer') {
            var vis = Ext.ComponentQuery.query('initialbar #visualizationcontainer button[pressed=true]')[0].objId;
            if (vis=='custom') return;
            this.getController('Chart').loadVisualization(vis);
            visChanged = true;
        }

        var preserveVis = false;

        var selController = this.getController('Select')
        if (Config.cfg) {
            selController.selMap = Config.cfg.selMap
            selController.colorMap = selController.prepareColorMap(selController.selMap);
        }
        this.getController('Chart').reconfigureAll();
        if (forceVisReinit===true || itemId == 'visualizationcontainer') {
            this.getController('Layers').checkVisibilityAndStyles(!visChanged,preserveVis);

        }
        if (Config.cfg) {
            this.getController('Area').colourTree(selController.colorMap);
            this.getController('Layers').colourMap(selController.colorMap);
            if (Config.cfg.multipleMaps) {
                Ext.ComponentQuery.query('initialbar #multiplemapsbtn')[0].toggle();
            }

        }
        console.log('LocationTheme#onVisualizationChange Delete Config');
        delete Config.cfg;
    }

});

Ext.define('PumaMain.controller.Area', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        this.control({
            "#areatree": {
                beforeselect: this.onBeforeSelect,
                itemclick: this.onItemClick,
                itemmouseenter: this.onItemMouseEnter,
                itemexpand: this.onNodeExpanded,
                itemcollapse: this.onNodeCollapsed
            },
            '#areatree #areacollapseall': {
                click: this.onCollapseAll
            },
            '#window-areatree #areacollapseall': {
                click: this.onCollapseAll
            },
            "chartbar chartcmp": {
                beforeselect: this.onBeforeSelect,
                itemclick: this.onItemClick,
                itemmouseenter: this.onItemMouseEnter
            },
            '#areaslider':{
                changecomplete: this.onSliderSlide,
                beforechange: this.onBeforeSliderSlide
            },
            '#areamoredetails':{
                click: this.onShowMoreDetailed
            },
            '#arealessdetails':{
                click: this.onShowLessDetailed
            },
            '#areaexpandlevel':{
                click: this.onShowMoreDetailed
            },
            '#areacollapselevel':{
                click: this.onShowLessDetailed
            }
        });
        this.areaMap = {};
        this.areaTemplates = [];
        this.areaTemplateMap = {};
        this.allAreas = {};
        this.lowestAreas = {};
        this.highestAreas = {};
        this.oldSliderVal = 0;
        //this.filterActive = true;

        Observer.notify('Area#init');
    },



    getLocationObj: function() {
        var locObjId =  Ext.ComponentQuery.query('#sellocation')[0].getValue();
        var store = Ext.StoreMgr.lookup('location4init');
        var rec = store.getById(locObjId);
        var location =  rec ? rec.get('location') : null;
        if (!location || location.length === 0){
            location = rec ? rec.get('id') : null;
        }
        return {
            location: location,
            locGid: rec ? rec.get('locGid') : null,
            at: rec ? rec.get('at') : null,
            bbox: rec ? rec.get('bbox') : null,
            obj: rec
        };
    },

    /**
     * Show/hide loading overlay
     * @param display {string} CSS display value
     */
    showLoading: function(display){
        // console.log('Area#showLoading Loading ', display);
        // $("#loading-screen").css({
        // 	display: display,
        // 	background: "radial-gradient(rgba(255, 255, 255, .85), rgba(230, 230, 230, .85))"
        // });
    },

    // New URBIS function for detecting areas change
    newAreasChange: function(){
        var self = this;
        // this.showLoading("block");
        clearTimeout(this._areasChangeTimeout);
        this._areasChangeTimeout = setTimeout(function(){
            // current areas
            var level = ThemeYearConfParams.auCurrentAt;
            var place = ThemeYearConfParams.place;

            var areasOutput = {};

            if (OneLevelAreas.hasOneLevel){
                if (place){
                    areasOutput[place] = {};
                    areasOutput[place][level] = [];
                }
                else {
                    OneLevelAreas.data.forEach(function(area){
                        if (!areasOutput.hasOwnProperty(area.loc)){
                            areasOutput[area.loc] = {};
                            if (!areasOutput[area.loc].hasOwnProperty(area.at)){
                                areasOutput[area.loc][area.at] = [];
                            }
                        }
                    });
                }
            }

            else {
                var allAreasExpanded = self.getExpandedAndFids().fids;
                if (place){
                    if (allAreasExpanded.hasOwnProperty(place)){
                        var pom = allAreasExpanded[place];
                        areasOutput[place] = {};
                        if (pom.hasOwnProperty(level)){
                            areasOutput[place][level] = pom[level];
                        }
                    }
                }
                else {
                    for (var key in allAreasExpanded){
                        var pom2 = allAreasExpanded[key];
                        areasOutput[key] = {};
                        if (pom2.hasOwnProperty(level)){
                            areasOutput[key][level] = pom2[level];
                        }
                    }
                }
            }

            ExpandedAreasExchange = areasOutput;
            self.newNotifyChange();
        },50);
    },

    // new URBIS function for change notifying
    newNotifyChange: function(){
        Observer.notify("rebuild");
        // console.log('Area#newNotifyCahnge hide');
        // var self = this;
        // window.setTimeout(function(){
        // 	self.showLoading("none");
        // }, 5000);
    },

    onShowMoreDetailed: function() {
        ThemeYearConfParams.actions.push("detaillevel");
        var toExpand = {};
        var needQuery = false;
        var needChange = false;
        // this.showLoading("block");
        var tree = Ext.ComponentQuery.query('#areatree')[0];

        tree.suspendEvents();

        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();
        var lastAt = null;
        for (var loc in this.lowestMap) {
            for (var at in this.lowestMap[loc]) {
                lastAt = at;
                break;
            }
            break;
        }
        if (!lastAt) {
            // console.log('Area#onShowMoreDetailed hide');
            // this.showLoading("none");
            return;
        }

        // TODO: FInd out about the areaTemplate and working with them.

        var layerRef = "";
        areaRoot.cascadeBy(function(node) {
            var at = node.get('at');
            if (node.get('leaf') || at!=lastAt || !node.parentNode.get('expanded')) return;
            needChange = true;
            if (!node.get('loaded')) {
                node.set('loaded',true);
                var loc = node.get('loc');
                var gid = node.get('gid');
                toExpand[loc] = toExpand[loc] || {};
                toExpand[loc][at] = toExpand[loc][at] || [];
                toExpand[loc][at].push(gid);
                needQuery = true;
            }
            Ext.suspendLayouts();
            node.suppress = true;
            node.expand();
            node.suppress = false;
            Ext.resumeLayouts(true);
        });

        tree.resumeEvents();

        if (needQuery) {
            this.detailLevelParents = toExpand;
            this.getController('LocationTheme').onYearChange({itemId:'detaillevel'});
            this.detailLevelParents = null;
        } else if (needChange) {
            this.scanTree();
            // console.log('Area#onShowMoreDetailedEnd hide');
            // this.showLoading("none");
            this.getController('Chart').reconfigureAll();
            this.getController('Layers').reconfigureAll();
        } else {
            // console.log('Area#newNotifyCahnge Without Change hide');
            // this.showLoading("none");
        }
    },


    onShowLessDetailed: function() {
        // this.showLoading("block");
        ThemeYearConfParams.actions.push("detaillevel");
        var nodesToCollapse = [];
        var tree = Ext.ComponentQuery.query('#areatree')[0];
        tree.suspendEvents();
        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();
        var lastAt = null;
        for (var loc in this.lowestMap) {
            for (var at in this.lowestMap[loc]) {
                lastAt = at;
                break;
            }
            break;
        }
        if (!lastAt) {
            return;
        }

        // this.getController('Area').showLoading("block");
        areaRoot.cascadeBy(function(node) {
            var at = node.get('at');
            if (at!=lastAt || !node.parentNode.get('expanded') || !node.parentNode.get('gid')){
                return;
            }
            nodesToCollapse.push(node.parentNode);
        });
        for (var i=0;i<nodesToCollapse.length;i++) {
            nodesToCollapse[i].suppress = true;
            nodesToCollapse[i].collapse();
            nodesToCollapse[i].suppress = false;
        }
        tree.resumeEvents();
        if (nodesToCollapse.length) {
            this.afterCollapse(tree);
            console.log('Area#onSHowLessDetailed hide');
            // this.showLoading("none");
        } else {
            // this.showLoading("block");
        }
    },

    onCollapseAll: function() {
        var tree = Ext.ComponentQuery.query('#areatree')[0];
        tree.suspendEvents();
        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();
        var nodes = areaRoot.childNodes;
        for (var i=0;i<nodes.length;i++) {
            nodes[i].suppress = true;
            nodes[i].collapse();
            nodes[i].suppress = false;
        }
        tree.resumeEvents();
        this.afterCollapse(tree);
    },

    afterCollapse: function(tree) {
        tree.view.refresh();
        this.scanTree();
        var selController = this.getController('Select');
        this.colourTree(selController.colorMap);
        this.getController('Layers').colourMap(selController.colorMap);
        this.getController('Chart').reconfigureAll();
        this.getController('Layers').reconfigureAll();
    },

    applyTestFilter: function(from,to) {

        this.areaFilter = {
            areaTemplates: {
                281: true
            },
            filters: [{
                as: 321,
                attr: 299,
                normType: 'area',
                min: from,
                max: to
            }]
        };
        if (from==null) {
            this.areaFilter = null;
        }
        this.getController('LocationTheme').onYearChange({itemId:'filter'});
    },

    zoomToLocation: function() {

    },

    getArea: function(area) {
        var store = Ext.StoreMgr.lookup('area');
        var foundNode = store.getRootNode().findChildBy(function(node) {
            return (node.get('at')==area.at && node.get('loc')==area.loc && node.get('gid')==area.gid);
        },this,true);
        return foundNode;
    },

    onBeforeSelect: function() {
        return false;
    },

    getExpandedAndFids: function() {
        var expanded = {};
        var loaded = {};
        var fids = {};
        var root = Ext.StoreMgr.lookup('area').getRootNode();
        root.cascadeBy(function(node) {
            if (node==root) return;
            var loc = node.get('loc');
            var at = node.get('at');
            var gid = node.get('gid');
            if (node.isLoaded()) {
                loaded[loc] = loaded[loc] || {};
                loaded[loc][at] = loaded[loc][at] || [];
                loaded[loc][at].push(gid);
            }
            if (node.isExpanded()) {
                expanded[loc] = expanded[loc] || {};
                expanded[loc][at] = expanded[loc][at] || [];
                expanded[loc][at].push(gid);
            }
            fids[loc] = fids[loc] || {};
            fids[loc][at] = fids[loc][at] || [];
            fids[loc][at].push(gid);
        });
        return {expanded:expanded, fids: fids, loaded: loaded};
    },

    onItemClick: function(tree,rec,item,index,evt) {
        var isParentOfAreaPanel = $(evt.currentTarget).parents("window-areatree");
        if (!isParentOfAreaPanel.length && index === 0){
            index++;
        }

        var selected = [{at:rec.get('at'),gid:rec.get('gid'),loc:rec.get('loc'),index:index}];
        var add = evt.ctrlKey;
        var hover = false;
        if (tree.xtype=='gridview') {
            this.getController('Select').fromChart = true;
        }
        this.getController('Select').select(selected,add,hover);
    },

    onItemMouseEnter: function(tree,rec,item,index,evt) {
        if (!this.hovering) return;
        var selected = [{at:rec.get('at'),gid:rec.get('gid'),loc:rec.get('loc')}];
        var add = false;
        var hover = true;
        this.getController('Select').select(selected,add,hover);
    },

    colourTree: function(selectMap) {
        var areaTree = Ext.ComponentQuery.query('#areatree')[0];
        var view = areaTree.getView();
        areaTree.getRootNode().cascadeBy(function(node) {
            var oldCls = node.get('cls');
            var at = node.get('at');
            var loc = node.get('loc');
            if (!at || !loc) return;
            var gid = node.get('gid');
            var hasColor = selectMap[loc] && selectMap[loc][at] && selectMap[loc][at][gid];
            if (!hasColor && oldCls!='') {
                node.data['cls'] = '';
                view.onUpdate(node.store,node);
            }

            if (hasColor && oldCls!='select_'+selectMap[loc][at][gid]) {
                node.data['cls'] = 'select_'+selectMap[loc][at][gid];
                view.onUpdate(node.store,node);
            }
        });
    },

    onBeforeLoad: function(store, options) {
        var node = options.node;
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        if (!years || !years.length) {
            return;
        }
        if (this.areaFilter) {
            options.params['filter'] = JSON.stringify(this.areaFilter);
        }

        var gid = node.get('gid');
        var loc = node.get('loc');
        var at = node.get('at');
        var parentGids = {};
        parentGids[loc] = {};
        parentGids[loc][at] = [gid];
        options.params['refreshAreas'] = true;
        options.params['dataset'] = dataset;
        options.params['years'] = JSON.stringify(years);
        options.params['parentgids'] = JSON.stringify(parentGids);
    },
    onLoad: function(store,node,records) {
        for (var i=0;i<records.length;i++) {
            var rec = records[i];
            var at = rec.get('at');
            var gid = rec.get('gid');
            var loc = rec.get('loc');
            this.areaMap[loc] = this.areaMap[loc] || {};
            this.areaMap[loc][at] = this.areaMap[loc][at] || {};
            this.areaMap[loc][at][gid] = rec;
        }
    },

    onNodeExpanded: function(node) {
        ThemeYearConfParams.actions.push("detaillevel");
        if (!node.isLoaded() || !node.childNodes.length || node.suppress) {
            return;
        }
        this.scanTree();
        var locThemeController = this.getController('LocationTheme');
        if (locThemeController.locationChanged) {
            this.zoomToLocation();
            var selController = this.getController('Select');
            this.colourTree(selController.colorMap);
            this.getController('Layers').colourMap(selController.colorMap);
            locThemeController.locationChanged = false;
        }
        this.getController('Chart').reconfigure('expand');
        this.getController('Layers').reconfigureAll();


    },
    onNodeCollapsed: function(node) {
        ThemeYearConfParams.actions.push("detaillevel");
        if (!node.isLoaded() || !node.get('at') || node.suppress) {
            return;
        }
        this.scanTree();
        var selController = this.getController('Select');
        this.colourTree(selController.colorMap);
        this.getController('Layers').colourMap(selController.colorMap);
        this.getController('Chart').reconfigure('expand');
        this.getController('Layers').reconfigureAll();
    },

    getTreeLocations: function() {
        var locations = [];
        var locNodes = Ext.StoreMgr.lookup('area').getRootNode().childNodes;
        for (var i=0;i<locNodes.length;i++) {
            Ext.Array.include(locations,locNodes[i].get('loc'));
        }
        return locations;
    },
    scanTree: function() {
        if (OneLevelAreas.hasOneLevel){
            var areas = OneLevelAreas.data;
            var dataSet = Ext.ComponentQuery.query('#seldataset')[0].getValue() || Ext.ComponentQuery.query('#initialdataset')[0].getValue();
            var level = Ext.StoreMgr.lookup('dataset').getById(dataSet).get('featureLayers')[0];
            var place = ThemeYearConfParams.place;
            var self = this;


            this.newAreasChange();

            this.initialized = true;
            this.areaTemplates = [level];
            this.lowestCount = areas.length;
            this.allMap = {};
            if (place){
                this.allMap[place] = {};
                this.allMap[place][level] = [];
                areas.forEach(function(area){
                    self.allMap[place][level].push(area.gid);
                });
            }

            else {
                areas.forEach(function(area){
                    if (!self.allMap.hasOwnProperty(area.loc)){
                        self.allMap[area.loc] = {};
                        if (!self.allMap[area.loc].hasOwnProperty(area.at)){
                            self.allMap[area.loc][area.at] = [];
                        }
                    }
                    self.allMap[area.loc][area.at].push(area.gid);
                });
            }
            this.lowestMap = this.allMap;
            this.highestMap = this.allMap;
            this.lastMap = this.allMap;

            var selMap2 = this.getController('Select').selMap;
            var outerCount2 = 0;
            var overallCount2 = 0;
            for (var color2 in selMap2) {
                var objsToRemove2 = [];
                for (var j=0;j<selMap2[color2].length;j++) {
                    var obj2 = selMap2[color2][j];
                    overallCount2++;

                    if (this.lowestMap[obj2.loc] && this.lowestMap[obj2.loc][obj2.at] && Ext.Array.contains(this.lowestMap[obj2.loc][obj2.at],obj2.gid)) {
                    } else if (this.allMap[obj2.loc] && this.allMap[obj2.loc][obj2.at] && Ext.Array.contains(this.allMap[obj2.loc][obj2.at],obj2.gid)) {
                        outerCount2++;
                    } else {
                        Ext.Array.include(objsToRemove2,obj2);
                    }
                }
                selMap2[color2] = Ext.Array.difference(selMap2[color2],objsToRemove2);
            }
            this.getController('Select').prepareColorMap();
            this.getController('Select').overallCount = overallCount2;
            this.getController('Select').outerCount = outerCount2;
            if (overallCount2==0) {
                this.getController('Select').switchToAllAreas();
            }
            var onlySel2 = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
            var count2 = onlySel2 ? (overallCount2) : (this.lowestCount+outerCount2);
            Ext.StoreMgr.lookup('paging').setCount(count2);

            this.getController('Layers').refreshOutlines();
            return;
        }

        var me = this;
        var root = Ext.StoreMgr.lookup('area').getRootNode();

        var areaTemplates = [];
        var leafMap = {};
        var allMap = {};
        var lowestMap = {};
        var lastMap = {};
        var highestMap = {};
        var parent = null;
        var lowestCount = 0;
        var containsLower = false;
        var lowestNoLeafs = true;
        var locObj = this.getLocationObj();

        var changeLocToCustom = false;
        var atLeastOneLoc = false;
        var maxDepth = 0;
        this.placeNode = null;

        root.cascadeBy(function(node) {
            var at = node.get('at');
            var loc = node.get('loc');
            if (!at || !loc || !node.isVisible() || node==root){
                return;
            }

            var depth = node.getDepth();
            maxDepth = Math.max(depth,maxDepth);
            if (node.parentNode==root) {
                if (root.childNodes.length==1) {
                    parent = node;
                } else {
                    highestMap[loc] = highestMap[loc] || {};
                    highestMap[loc][at] = highestMap[loc][at] || [];
                    highestMap[loc][at].push(gid);
                }
                if (node.isExpanded()) {
                    if (at!=locObj.at || loc!=locObj.location || (!node.get('definedplace') && node.get('gid')!=locObj.locGid)) {
                        if (locObj.obj && locObj.obj.get('dataset')) {
                            changeLocToCustom = true;
                        }
                    } else {
                        me.placeNode = node;
                        atLeastOneLoc = true;
                    }
                }
                if (node.isLeaf() && at==locObj.at && loc==locObj.location && (node.get('definedplace') || node.get('gid')==locObj.locGid)) {
                    me.placeNode = node;
                    atLeastOneLoc = true;
                }

            } else {
                containsLower = true;
            }
            if (parent && node.parentNode==parent) {
                highestMap[loc] = highestMap[loc] || {};
                highestMap[loc][at] = highestMap[loc][at] || [];
                highestMap[loc][at].push(gid);
            }
            Ext.Array.include(areaTemplates,at);
            var gid = node.get('gid');
            if (!node.isExpanded() || !node.hasChildNodes()) {
                lastMap[loc] = lastMap[loc] || {};
                lastMap[loc][at] = lastMap[loc][at] || [];
                lastMap[loc][at].push(gid);
            }
            allMap[loc] = allMap[loc] || {};
            allMap[loc][at] = allMap[loc][at] || [];
            allMap[loc][at].push(gid);
            if (!node.isLeaf()) {
                leafMap[loc] = leafMap[loc] || {};
                leafMap[loc][at] = false;
            }
        });

        if (this.initialized && (changeLocToCustom || !atLeastOneLoc)) {
            var locStore = Ext.StoreMgr.lookup('location4init');
            var customRec = locStore.getById('custom');
            if (!customRec) {
                //customRec = new (locStore.model)({id:'custom',name:'Custom'});
                //locStore.add(customRec);
            }
            // Urbis change
            var recCount = locStore.data.length;
            if (!Config.toggles.isUrbis && recCount > 1){
                //Ext.ComponentQuery.query('#sellocation')[0].setValue(polyglot.t('allPlaces'));
                //Ext.ComponentQuery.query('#sellocation')[0].setValue('Custom');
            }
        }
        this.initialized = true;
        this.areaTemplates = areaTemplates;
        if (areaTemplates.length) {
            var lastAreaTemplate = areaTemplates[areaTemplates.length-1];

            for (var loc in allMap) {
                if (!allMap[loc][lastAreaTemplate]){
                    continue;
                }
                lowestCount += allMap[loc][lastAreaTemplate].length;
                lowestMap[loc] = lowestMap[loc] || {};
                lowestMap[loc][lastAreaTemplate] = Ext.Array.clone(allMap[loc][lastAreaTemplate]);
                if (leafMap[loc] && leafMap[loc][lastAreaTemplate]===false) {
                    lowestNoLeafs = false;
                }
            }
        }

        // new URBIS change
        if (this.areaTemplates[this.areaTemplates.length-1]){
            ThemeYearConfParams.auCurrentAt = this.areaTemplates[this.areaTemplates.length-1];
            Stores.notify("areas#areaTemplateChange")
        }

        this.newAreasChange();

        this.lowestCount = lowestCount;
        this.allMap = allMap;
        this.lowestMap = lowestMap;
        this.highestMap = highestMap;
        this.lastMap = lastMap;
        var selPlaceObj = this.getLocationObj().obj;
        var selPlace = selPlaceObj ? selPlaceObj.get('id') : null;
        var showMore = Ext.ComponentQuery.query('#areamoredetails')[0];
        var showLess = Ext.ComponentQuery.query('#arealessdetails')[0];
        var arrowMore = Ext.ComponentQuery.query('#areaexpandlevel')[0];
        var arrowLess = Ext.ComponentQuery.query('#areacollapselevel')[0];
        //debugger;
        // TODO remove lowestCount dependency
        var disabledMore = lowestCount>5000 || (lowestNoLeafs && areaTemplates.length>1) || !Object.keys(leafMap).length
        showMore.setDisabled(disabledMore);
        arrowMore.setDisabled(disabledMore);
        // TODO remove dependency on maxDepth
        var disabledLess = !containsLower || (selPlace && maxDepth<2);
        showLess.setDisabled(disabledLess);
        arrowLess.setDisabled(disabledLess);

        var selMap = this.getController('Select').selMap;
        var outerCount = 0;
        var overallCount = 0;
        for (var color in selMap) {
            var objsToRemove = [];
            for (var i=0;i<selMap[color].length;i++) {
                var obj = selMap[color][i];
                overallCount++;

                if (lowestMap[obj.loc] && lowestMap[obj.loc][obj.at] && Ext.Array.contains(lowestMap[obj.loc][obj.at],obj.gid)) {
                } else if (allMap[obj.loc] && allMap[obj.loc][obj.at] && Ext.Array.contains(allMap[obj.loc][obj.at],obj.gid)) {
                    outerCount++;
                } else {
                    Ext.Array.include(objsToRemove,obj);
                }
            }
            selMap[color] = Ext.Array.difference(selMap[color],objsToRemove);
        }
        this.getController('Select').prepareColorMap();
        this.getController('Select').overallCount = overallCount;
        this.getController('Select').outerCount = outerCount;
        if (overallCount==0) {
            this.getController('Select').switchToAllAreas();
        }
        var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
        var count = onlySel ? (overallCount) : (lowestCount+outerCount);
        Ext.StoreMgr.lookup('paging').setCount(count);

        this.getController('Layers').refreshOutlines();

        //this.getController('Layers').checkVisibilityAndStyles(true,false);

        // disable + button in Analysis level for PUMA National scope, All places, second level
        // TODO solve this issue differently
        if (ThemeYearConfParams.dataset == "20" && !atLeastOneLoc && lastAreaTemplate == 15){
            showMore.setDisabled(true);
            arrowMore.setDisabled(true);
        }
    },




    reinitializeTree: function(preserveSelection) {
        var root = Ext.StoreMgr.lookup('area').getRootNode();

        root.removeAll(false);
        root.collapse();
        root.loaded = false;
        root.set('loaded',false);
        root.initialized = true;
        root.expand();
        //if (!preserveSelection) {
        this.getController('Select').clearSelections();
        //}
    }
});


Ext.define('PumaMain.controller.Layers', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['PumaMain.view.LayerMenu', 'Puma.util.Color'],
    init: function() {
        Observer.addListener("thematicMapsSettings",this.onConfigure.bind(this));

        this.control({
            'choroplethpanel #numCategories': {
                change: this.onNumCategoriesChange
            },
            'choroplethpanel #classType': {
                change: this.onClassTypeChange
            },
            'choroplethpanel #useAttributeColors': {
                change: this.onUseAttrColorsChange
            },
            'choroplethpanel #fillbtn': {
                click: this.onFillColors
            },
            'choroplethpanel #addbtn': {
                click: this.onChoroplethAdd
            },

            'choroplethpanel #reconfigurebtn': {
                click: this.onChoroplethReconfigure
            }

        });
        this.scaleBorderCnst = 10000000;
        this.scaleBorder = 10000000;
        Select.colourMap = this.colourMap.bind(this);

        Observer.notify('Layers#init');

        this.sldRequestIsRunning = false;
    },

    onConfigure: function() {
        this.getController('AttributeConfig').onConfigureClick({itemId:'configurelayers'});
    },

    onLayerLegend: function(panel, rec, checked) {
        if (checked && !rec.get('legend')) {
            var img = Ext.widget('image',{
                src: rec.get('src'),
                margin: '5 0 0 0'
            });
            var window = Ext.widget('window', {
                autoScroll: true,
                collapsible: true,
                collapseLeft: true,
                minWidth: 260,
                leftMargin: 1,
                titleCollapse: true,
                islegend: 1,
                items: [img],
                factor: Ext.ComponentQuery.query('window[islegend=1]').length,
                title: rec.get('name')
            });
            img.on('resize',function(i) {
                i.el.on('load',function(a, dom) {
                    this.show();
                    this.setSize(dom.clientWidth+32,dom.clientHeight+52);

                    if (Config.toggles.useTopToolbar) {
                        this.showBy('app-map','br-br',[-43,-18]);
                    } else {
                        var leftPanel = Ext.ComponentQuery.query('toolspanel')[0]; // TODO - what if no ToolsPanel?

                        var heightDiff = Ext.get('app-map').getBox().bottom - Ext.get('sidebar-tools').getBox().bottom;

                        this.showBy(leftPanel,'bl-br',[50*this.factor+21,-50*this.factor+heightDiff]);
                    }
                    this.el.setOpacity(0.85)
                },this);
            },window,{single:true});
            window.showAt(1,1);
            window.hide();
            window.rec = rec;
            window.on('close', function(win) {
                win.rec.set('legend',null);
            });
            rec.set('legend',window);
        }
        if (!checked && rec.get('legend')) {
            rec.get('legend').destroy();
            rec.set('legend',null);
        }
    },

    reconfigureChoropleths: function(cfg) {
        window.Stores.notify("choropleths#reconfigured", cfg.attrs);

        this.getController('AttributeConfig').layerConfig = cfg.attrs;
        var root = Ext.StoreMgr.lookup('layers').getRootNode();
        var chartNodes = [];
        root.cascadeBy(function(node) {
            if (node.get('type')=='chartlayer') {
                chartNodes.push(node);
            }
        });
        var nodesToRemove = [];
        var attrs = Ext.Array.clone(cfg.attrs);
        var oldAttrs = Ext.Array.clone(cfg.attrs);
        for (var i=0;i<chartNodes.length;i++) {
            var node = chartNodes[i];
            var attr = node.get('attribute');
            var as = node.get('attributeSet');
            var cfgAttr = node.get('cfg').attrs[0];
            var normType = cfgAttr.normType;
            var normAs = cfgAttr.normAs;
            var normAttr = cfgAttr.normAttr;
            var attrObj = null;
            var found = false;
            for (var j=0;j<attrs.length;j++) {
                attrObj = attrs[j];
                if (attrObj.as==as && attrObj.attr == attr && attrObj.normType==normType && attrObj.normAs == normAs && attrObj.normAttr == normAttr) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                nodesToRemove.push(node);
            } else {
                Ext.Array.remove(attrs,attrObj);
                node.initialized = false;
                var oneCfg = {attrs:[attrObj]};
                oneCfg.numCategories = attrObj.numCategories || 5;
                oneCfg.classType = attrObj.classType || 'quantiles';
                oneCfg.zeroesAsNull = attrObj.zeroesAsNull!==false;
                oneCfg.useAttributeColors = true;
                var params = this.getController('Chart').getParams(oneCfg);
                node.set('params',params);
                node.set('cfg',oneCfg);
                if (attrObj.name) {
                    node.set('name',attrObj.name);
                }
                this.initChartLayer(node);
            }

        }
        for (var i=0;i<nodesToRemove.length;i++) {
            var node = nodesToRemove[i];
            this.onChoroplethRemove(null,node);
        }

        for (var i=0;i<attrs.length;i++) {
            var attr = attrs[i];
            var idx = Ext.Array.indexOf(oldAttrs,attr);
            var oneCfg = Ext.clone(cfg);
            oneCfg.attrs = [attr];
            oneCfg.numCategories = attr.numCategories || 5;
            oneCfg.classType = attr.classType || 'quantiles';
            oneCfg.zeroesAsNull = attr.zeroesAsNull || true;
            oneCfg.useAttributeColors = true;
            this.addChoropleth(oneCfg,true,idx);
        }
    },

    onFillColors: function(btn) {
        var store = btn.up('grid').store;
        var count = store.getCount();
        if (count < 3){
            return;
        }
        try {
            var first = store.getAt(0).get('color');
            var last = store.getAt(count - 1).get('color');
        } catch (e) {
            return;
        }
        for (var i = 1; i < count - 1; i++) {
            var ratio = i / (count - 1);
            var rec = store.getAt(i);
            var color = Puma.util.Color.determineColorFromRange(first, last, ratio);
            rec.set('color', color);
        }
    },

    onClassTypeChange: function(combo, val) {
        var grid = Ext.ComponentQuery.query('choroplethpanel #classgrid')[0];
        grid.columns[2].setVisible(val == 'range');
    },

    onUseAttrColorsChange: function(chb, val) {
        var grid = Ext.ComponentQuery.query('choroplethpanel #classgrid')[0];
        grid.columns[1].setVisible(val ? false : true);
    },

    onNumCategoriesChange: function(combo, val) {
        var store = Ext.ComponentQuery.query('choroplethpanel #classgrid')[0].store;
        var count = store.getCount();
        if (val > count) {
            var data = [];
            for (var i = count; i < val; i++) {
                data.push({idx: i + 1});
            }
            store.loadData(data, true);
        }
        if (val < count) {
            store.removeAt(val, count - val);
        }

    },

    onShowMetadata: function(panel, rec) {

    },


    onBeforeLayerDrop: function(row,obj,dropPos) {
        var type = obj.records[0].get('type');
        if (!Ext.Array.contains(['topiclayer','chartlayer','areaoutlines','selectedareas','selectedareasfilled'],type)) {
            return false;
        } else if (!Ext.Array.contains(['topiclayer','chartlayer','areaoutlines','selectedareas','selectedareasfilled'],dropPos.get('type'))) {
            return false;
        }
    },

    onLayerRemove: function(panel,rec) {

    },

    onLayerDown: function(panel,rec) {

    },

    onLayerUp: function(panel,rec) {

    },

    /**
     * refactor indexes of selected layers in the store to consecutive integers, maintain order
     */
    resetIndexes: function() {

    },

    onLayerDrop: function() {

    },

    onOpacityChange: function(slider, value) {

    },

    openOpacityWindow: function(panel,rec) {

    },

    colourMap: function(selectMap, map1NoChange, map2NoChange) {
        var store = Ext.StoreMgr.lookup('layers');
        var node = store.getRootNode().findChild('type', 'selectedareas', true);
        var filledNode = store.getRootNode().findChild('type', 'selectedareasfilled', true);

        if (!node){
            return;
        }
        var layer1 = node.get('layer1');
        var layer2 = node.get('layer2');
        var filledLayer1 = filledNode.get('layer1');
        var filledLayer2 = filledNode.get('layer2');


        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var areaTemplates = this.getController('Area').areaTemplateMap;
        var namedLayers1 = [];
        var namedLayers2 = [];
        var namedLayersFilled1 = [];
        var namedLayersFilled2 = [];
        selectMap = selectMap || {};
        var noSelect = true;
        for (var loc in selectMap) {

            for (var at in selectMap[loc]) {
                noSelect = false;
                for (var i = 0; i < Math.max(2, years.length); i++) {
                    if (i == 0 && map1NoChange){
                        continue;
                    }
                    if (i == 1 && map2NoChange){
                        continue;
                    }
                    var lr = (areaTemplates[loc] && areaTemplates[loc][at]) ? areaTemplates[loc][at][years[i]] : null;
                    if (!lr && at != -1){
                        continue;
                    }
                    var style = new OpenLayers.Style();
                    var filledStyle = new OpenLayers.Style();
                    //var layerId = at == -1 ? '#userlocation#_y_' + year : lr._id;
                    var layerId = lr._id;
                    var layerName = Config.geoserver2Workspace + ':layer_' + layerId;

                    var defRule = new OpenLayers.Rule({
                        symbolizer: {"Polygon": new OpenLayers.Symbolizer.Polygon({fillOpacity: 0, strokeOpacity: 0}
                            )}
                    });
                    style.addRules([defRule]);
                    filledStyle.addRules([defRule]);
                    var recode = ['${gid}'];
                    var filters = [];
                    for (var gid in selectMap[loc][at]) {
                        var filter = new OpenLayers.Filter.Comparison({type: '==', property: 'gid', value: gid});
                        filters.push(filter);
                        var color = '#' + selectMap[loc][at][gid];
                        recode.push(gid);
                        recode.push(color);
                    }
                    var recodeFc = new OpenLayers.Filter.Function({name: 'Recode', params: recode});
                    var filterFc = new OpenLayers.Filter.Logical({type: '||', filters: filters});


                    /**
                     * This is where switching polygons to points in small scale for choropleths and area outlines is defined.
                     * For other ~3 appearances search "maxScaleDenominator".
                     */
                    var obj = {
                        filter: filterFc,
                        maxScaleDenominator: this.scaleBorder,
                        symbolizer: {"Polygon": new OpenLayers.Symbolizer.Polygon({strokeColor: recodeFc, strokeWidth: 1, fillOpacity: 0})
                            ,"Text":new OpenLayers.Symbolizer.Text({label:'${name}',fontFamily:'DejaVu Sans',fontSize:12,fontWeight:'bold',labelAnchorPointX:0,labelAnchorPointY:0})
                        }
                    };
                    var objFilled = {
                        filter: filterFc,
                        maxScaleDenominator: this.scaleBorder,
                        symbolizer: {"Polygon": new OpenLayers.Symbolizer.Polygon({fillColor: recodeFc, strokeWidth: 1, fillOpacity: 1})
                            ,"Text":new OpenLayers.Symbolizer.Text({label:'${name}',fontFamily:'DejaVu Sans',fontSize:12,fontWeight:'bold',labelAnchorPointX:0,labelAnchorPointY:0})
                        }
                    };
                    var rule2 = new OpenLayers.Rule({
                        filter: filterFc,
                        minScaleDenominator: this.scaleBorder,
                        symbolizer: {"Point": new OpenLayers.Symbolizer.Point({geometry: {property:'centroid'},strokeColor: recodeFc, strokeWidth: 3, graphicName: 'circle', pointRadius: 8, fillOpacity: 0})}
                    });
                    var rule2Filled = new OpenLayers.Rule({
                        filter: filterFc,
                        minScaleDenominator: this.scaleBorder,
                        symbolizer: {"Point": new OpenLayers.Symbolizer.Point({geometry: {property:'centroid'},strokeWidth: 1, strokeOpacity: 1, strokeColor: '#000000', graphicName: 'circle', pointRadius: 8, fillColor: recodeFc, fillOpacity: 1})}
                    });
                    var rule = new OpenLayers.Rule(obj);
                    style.addRules([rule,rule2]);
                    var ruleFilled = new OpenLayers.Rule(objFilled);
                    filledStyle.addRules([ruleFilled,rule2Filled]);
                    var namedLayers = i == 0 ? namedLayers1 : namedLayers2;
                    var namedLayersFilled = i == 0 ? namedLayersFilled1 : namedLayersFilled2;
                    namedLayers.push({
                        name: layerName,
                        userStyles: [style]
                    });
                    namedLayersFilled.push({
                        name: layerName,
                        userStyles: [filledStyle]
                    });
                }
            }
        }

        if (noSelect) {
            layer1.setVisibility(false);
            layer1.initialized = false;
            layer2.setVisibility(false);
            layer2.initialized = false;
            filledLayer1.setVisibility(false);
            filledLayer1.initialized = false;
            filledLayer2.setVisibility(false);
            filledLayer2.initialized = false;
            return;
        }
        var namedLayersGroup = [namedLayers1, namedLayers2,namedLayersFilled1,namedLayersFilled2];
        for (var i = 0; i < namedLayersGroup.length; i++) {
            var namedLayer = namedLayersGroup[i];
            var isFilled = i>1;
            var layer = !isFilled ? (i%2 == 0 ? layer1 : layer2) : (i%2 == 0 ? filledLayer1 : filledLayer2);
            var noChange = i%2 == 0 == 0 ? map1NoChange : map2NoChange;
            if (!namedLayer.length) {
                if (noChange) {
                    layer.setVisibility(false);
                    layer.initialized = false;
                }

                continue;
            }
            var changedNode = isFilled ? filledNode : node;
            this.saveSld(changedNode, namedLayer, layer);
        }
    },

    formatSldText: function(sldText) {
        let parts = sldText.split("<sld:TextSymbolizer>");
        if (parts.length > 1){
            let firstPart = parts[0];
            let secondPart = parts[1];
            let subparts = secondPart.split("</sld:TextSymbolizer>");
            let textSymbolizer = subparts[0];
            let lastPart = subparts[1];

            // label is rendered to the polygon centroid
            textSymbolizer = '<sld:Geometry>' +
                '<ogc:Function name="centroid">' +
                '<ogc:PropertyName>the_geom</ogc:PropertyName>' +
                '</ogc:Function>' +
                '</sld:Geometry>' + textSymbolizer;

            return firstPart + "<sld:TextSymbolizer>" + textSymbolizer + "</sld:TextSymbolizer>" + lastPart;
        } else {
            return sldText;
        }
    },
    saveSld: function(node, namedLayers, layer, params, legendNamedLayers) {
        var sldObject = {
            name: 'style',
            title: 'Style',
            namedLayers: namedLayers
        };

        var format = new OpenLayers.Format.SLD.Geoserver23();
        var xmlFormat = new OpenLayers.Format.XML();
        var sldNode = format.write(sldObject);
        var sldText = xmlFormat.write(sldNode);

        var sldTextFormatted = this.formatSldText(sldText);
        var legendSld =  null;
        if (legendNamedLayers) {
            var legendSldObject = {
                name: 'style',
                title: 'Style',
                namedLayers: legendNamedLayers
            };
            var legendSldNode = format.write(legendSldObject);
            legendSld = xmlFormat.write(legendSldNode);
        }
        var period = params && params.years ? JSON.parse(params.years)[0] : null;

        // hack for second period
        if (params && params.altYears){
            let altPeriod = JSON.parse(params.altYears)[0];
            if (altPeriod && this._previousPeriod && this._previousPeriod === period){
                period = altPeriod;
            }
            this._previousPeriod = period;
        }

        if (period){
            params.years = JSON.stringify([period]);
            if (params.altYears){
                delete params.altYears;
            }
        }

        var me = this;

        handleRequest();

        function handleRequest() {
            if(me.sldRequestIsRunning) {
                setTimeout(handleRequest,100);
            } else {
                me.sldRequestIsRunning = true;
                makeRequest();
            }
        }

        function makeRequest() {
            Ext.Ajax.request({
                url: Config.url + 'api/proxy/saveSld',
                params: Ext.apply({
                    sldBody: sldTextFormatted,
                    legendSld: legendSld || ''
                }, params || {}),
                layer: layer,
                node: node,
                legendLayer: legendNamedLayers && legendNamedLayers.length ? legendNamedLayers[0].name : null,
                success: function (response) {
                    me.sldRequestIsRunning = false;

                    var layer = response.request.options.layer;
                    var node = response.request.options.node;
                    var legendLayer = response.request.options.legendLayer;
                    response = JSON.parse(response.responseText);
                    var id = response.data;

                    var attribute = node.data.attribute;
                    var attributeSet = node.data.attributeSet;

                    if (node.data.type == "chartlayer" && attribute > 0 && attributeSet > 0) {
                        var data = {
                            legendLayer: legendLayer,
                            sldId: id
                        };
                        window.Stores.notify("choropleths#update", {
                            attribute: attribute,
                            attributeSet: attributeSet,
                            layer: legendLayer,
                            sldId: id,
                            period: period,
                        });
                    } else if (node.data.type == "areaoutlines") {
                        Stores.updateOutlines({
                            data: {
                                namedLayers: namedLayers,
                                layer: layer,
                                legendLayer: legendNamedLayers && legendNamedLayers.length ? legendNamedLayers[0].name : null,
                                sldBody: sldText,
                                legendSld: legendSld
                            },
                            sldId: id,
                            layerNames: "outlines"
                        });
                    } else if (node.data.type == "selectedareasfilled") {
                        Stores.updateSelectedOutlines({
                            data: {
                                namedLayers: namedLayers,
                                layer: layer,
                                legendLayer: legendNamedLayers && legendNamedLayers.length ? legendNamedLayers[0].name : null,
                                sldBody: sldText,
                                legendSld: legendSld
                            },
                            sldId: id,
                            layerNames: "selectedAreasFilled"
                        })
                    } else if (node.data.type == "selectedareas") {
                        Stores.updateSelectedAreas({
                            data: {
                                namedLayers: namedLayers,
                                layer: layer,
                                legendLayer: legendNamedLayers && legendNamedLayers.length ? legendNamedLayers[0].name : null,
                                sldBody: sldText,
                                legendSld: legendSld
                            },
                            sldId: id,
                            layerNames: "selectedAreas"
                        });
                    }
                    // TODO: Add information about the selected layers sldId to show the information. .

                    layer.mergeNewParams({
                        "SLD_ID": id
                    });
                    layer.initialized = true;
                    node.initialized = true;
                    if (legendLayer) {
                        node.set('src', me.getLegendUrl(id, legendLayer));
                        var panel = Ext.ComponentQuery.query('layerpanel')[0];
                        var legend = node.get('legend');
                        if (!legend && node.get('checked') && node.needLegend) {
                            node.needLegend = null;
                            panel.fireEvent('layerlegend', panel, node, true);

                        }
                        if (legend) {
                            legend.down('image').el.set({src: node.get('src')});
                        }

                    }
                    if (node.get('checked')) {
                        me.onCheckChange(node, true);
                    }
                },
                failure: function (response) {
                    me.sldRequestIsRunning = false;

                    var layer = response.request.options.layer;
                    layer.initialized = false;
                    layer.setVisibility(false);
                }
            })
        }
    },

    refreshOutlines: function() {
        var store = Ext.StoreMgr.lookup('layers');
        var node = store.getRootNode().findChild('type', 'areaoutlines', true);
        if (!node){
            return;
        }
        var layer1 = node.get('layer1');
        var layer2 = node.get('layer2');

        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        for (var i = 0; i < Math.max(2, years.length); i++) {
            var year = years[i];
            var filterMap = this.getTreeFilters(year);
            var namedLayers = [];

            for (var layerName in filterMap) {
                var style = new OpenLayers.Style();
                var obj = {
                    filter: filterMap[layerName],
                    maxScaleDenominator: this.scaleBorder,
                    symbolizer: {"Polygon": new OpenLayers.Symbolizer.Polygon({strokeColor: '#333333', strokeWidth: 1, fillOpacity: 0.1})}
                };
                var rule1 = new OpenLayers.Rule(obj);
                var rule2 = new OpenLayers.Rule({
                    filter: filterMap[layerName],
                    minScaleDenominator: this.scaleBorder,
                    symbolizer: {"Point": new OpenLayers.Symbolizer.Point({geometry: {property:'centroid'}, strokeWidth: 2, strokeOpacity: 1, graphicName: 'circle', pointRadius: 6, strokeColor: '#000000', fillColor: '#000000'})}
                });
                style.addRules([rule1,rule2]);
                namedLayers.push({
                    name: layerName,
                    userStyles: [style]
                });
            }
            if (!namedLayers.length) {
                continue;
            }
            var layer = i == 0 ? layer1 : layer2;
            if(!OneLevelAreas.hasOneLevel) {
                this.saveSld(node, namedLayers, layer);
            }
        }

    },

    getTreeFilters: function(year) {
        var allAreas = this.getController('Area').lowestMap;
        var areaTemplates = this.getController('Area').areaTemplateMap;

        var filterMap = {};
        for (var loc in allAreas) {
            for (var at in allAreas[loc]) {
                var lr = (areaTemplates[loc] && areaTemplates[loc][at]) ? areaTemplates[loc][at][year] : null;
                if (!lr || !allAreas[loc][at].length ){
                    continue;
                }
                var layerName = Config.geoserver2Workspace + ':layer_' + lr._id;
                var filters = [];
                for (var i = 0; i < allAreas[loc][at].length; i++) {
                    var gid = allAreas[loc][at][i];
                    var filter = new OpenLayers.Filter.Comparison({type: '==', property: 'gid', value: gid});
                    filters.push(filter);
                }
                if (filters.length == 0){
                    continue;
                }
                var filterFc = filters.length > 1 ? new OpenLayers.Filter.Logical({type: '||', filters: filters}) : filters[0];
                filterMap[layerName] = filterFc;
            }
        }
        return filterMap;
    },

    getSymObj: function(params) {

        var symbolizer = null;
        if (true) {
            symbolizer = {};
            var normalization = params['normalization'];
            var classConfig = params['classConfig'] ? JSON.parse(params['classConfig']) : [];
            var colors = [];
            var thresholds = [];
            for (var i = 0; i < classConfig.length; i++) {
                colors.push(classConfig[i].color);
                thresholds.push(classConfig[i].threshold);
            }
            var colorRange = null;

            var attrs = JSON.parse(params['attrs']);
            if (params['useAttributeColors']) {
                var attrStore = Ext.StoreMgr.lookup('attribute');
                var attrId = attrs[0].attr;
                var baseColor = attrStore.getById(attrId).get('color');
                if (baseColor.length == 0){
                    baseColor = "#000000";
                }
                colorRange = Puma.util.Color.determineColorRange(baseColor);
            }
            normalization = attrs[0].normType || normalization;
            var normAttrSet = attrs[0].normAs || params['normalizationAttributeSet'];
            var normAttribute = attrs[0].normAttr || params['normalizationAttribute'];
            var normalizationUnits = attrs[0].normalizationUnits;
            var customFactor = attrs[0].customFactor;

            var factor = 1;
            var attrUnits = Ext.StoreMgr.lookup('attribute').getById(attrs[0].attr).get('units');
            var normAttrUnits = null;
            if (normalization == 'attribute' || normalization == 'attributeset') {
                normAttrUnits = Ext.StoreMgr.lookup('attribute').getById(normAttribute).get('units');
            }

            var units = new Units();
            customFactor = customFactor || 1;
            if (normalization=='area') {
                normAttrUnits = attrs[0].areaUnits || 'm2';
            }

            // Specific use case is when I normalize over attribute. In this case, it is necessary to first handle the
            // Basic factor handling and then use normalizationUnits to get final.
            // TODO: Make sure that the units are correctly counted.

            if(normalization) {
                factor = units.translate(attrUnits, normAttrUnits, false);
            } else {
                factor = 1;
            }
            factor = factor * customFactor;

            var props = '';
            var filtersNull = [];
            var filtersNotNull = [];
            if (normalization && normalization != 'none' && normalization != 'year') { // normalization != area only in case of stuff.
                var normAttr = normalization == 'area' ? 'area' : '';
                normAttr = normalization == 'attributeset' ? ('as_' + normAttrSet + '_attr_#attrid#') : normAttr;
                normAttr = normalization == 'attribute' ? ('as_' + normAttrSet + '_attr_' + normAttribute) : normAttr;
                normAttr = normalization == 'toptree' ? '#toptree#' : normAttr;

                if (normalization != 'toptree') {
                    filtersNull.push(new OpenLayers.Filter.Comparison({type: '==', property: normAttr, value: 0}));
                    filtersNotNull.push(new OpenLayers.Filter.Comparison({type: '!=', property: normAttr, value: 0}));
                    normAttr = '${' + normAttr + '}';
                }

                props = new OpenLayers.Filter.Function({name: 'Mul', params: [new OpenLayers.Filter.Function({name: 'Div', params: ['${#attr#}', normAttr]}), factor]});
            } else {
                props = new OpenLayers.Filter.Function({name: 'Mul', params: ['${#attr#}', factor]});
            }
            if (params['zeroesAsNull']) {
                filtersNull.push(new OpenLayers.Filter.Comparison({type: '==', property: '#attr#', value: 0}));
                filtersNotNull.push(new OpenLayers.Filter.Comparison({type: '!=', property: '#attr#', value: 0}));
            }

            var nullFilter = new OpenLayers.Filter.Comparison({type:'NULL',property:'#attr#'});
            filtersNotNull.push(new OpenLayers.Filter.Logical({type: '!', filters:[nullFilter]}));
            filtersNull.push(nullFilter);

            var fcParams = [props];
            var numCat = params['numCategories'];

            var legendRules = [new OpenLayers.Rule({
                name: '#units#',
                symbolizer: {
                    'Polygon': new OpenLayers.Symbolizer.Polygon({strokeWidth: 0, fillOpacity:0, strokeOpacity:0})
                }
            })];

            for (var i = 0; i < numCat; i++) {
                var ratio = i / (numCat - 1);
                var legendName ='';
                var color = colorRange ? Puma.util.Color.determineColorFromRange(colorRange[0], colorRange[1], ratio) : colors[i];
                if (params['classType'] == 'continuous') {
                    fcParams.push('#minmax_' + (i + 1) + '#');
                    fcParams.push(color);
                    legendName = '#minmax_' + (i + 1) + '#';
                } else {
                    fcParams.push(color);
                    if (i < numCat - 1) {
                        var val = params['classType'] == 'range' ? thresholds[i] : ('#val_' + (i + 1) + '#');
                        fcParams.push(val);
                    }
                    if (i==0) {
                        legendName = '< '+'#val_1#';
                    } else if (i == numCat - 1) {
                        legendName = '#val_'+i+'# >';
                    } else {
                        legendName = '#val_'+i+'#'+' - '+'#val_'+(i+1)+'#';
                    }

                }

                var legendRule = new OpenLayers.Rule({
                    name: legendName,
                    symbolizer: {
                        'Polygon': new OpenLayers.Symbolizer.Polygon({fillColor: color, strokeColor: '#000000', strokeWidth: 1})
                    }
                });
                legendRules.push(legendRule);
            }
            if (params['classType'] == 'continuous') {
                fcParams.push('color');
            }
            var fcName = params['classType'] == 'continuous' ? 'Interpolate' : 'Categorize';
            var fillColor = new OpenLayers.Filter.Function({name: fcName, params: fcParams});

            symbolizer['Polygon'] = new OpenLayers.Symbolizer.Polygon({fillColor: fillColor, strokeColor: '#000000', strokeWidth: 1});
            var rule1 = {
                filter: filtersNotNull.length > 1 ? new OpenLayers.Filter.Logical({type: '&&', filters: filtersNotNull}) : filtersNotNull[0],
                //maxScaleDenominator: this.scaleBorder,
                maxScaleDenominator: 100000000,
                symbolizer: symbolizer
            };
            var rule2 = {
                filter: filtersNotNull.length > 1 ? new OpenLayers.Filter.Logical({type: '&&', filters: filtersNotNull}) : filtersNotNull[0],
                //minScaleDenominator: this.scaleBorder,
                minScaleDenominator: 100000000,
                symbolizer: {"Point": new OpenLayers.Symbolizer.Point({geometry: {property:'centroid'},strokeWidth: 1, strokeOpacity: 1, graphicName: 'square', pointRadius: 18, strokeColor: '#222222',fillColor: fillColor, fillOpacity: 1})}
            };
            var nullColor = params['nullColor'] || '#bbbbbb';
            var nullSymbolizer = {
                'Polygon': new OpenLayers.Symbolizer.Polygon({fillColor: nullColor, strokeColor: '#000000', strokeWidth: 1})
            };
            var rule3 = {
                filter: filtersNull.length > 1 ? new OpenLayers.Filter.Logical({type: '||', filters: filtersNull}) : filtersNull[0],
                symbolizer: nullSymbolizer
            };
            return {
                rules: [rule1, rule2, rule3],
                legend: legendRules
            };
        }
        if (params['showMapChart']) {
            symbolizer = {};
            var max = new OpenLayers.Filter.Function({name: 'env', params: ['maxsize']});
            var min = new OpenLayers.Filter.Function({name: 'Div', params: [max, 20]});
            var sizeRange = new OpenLayers.Filter.Function({name: 'Sub', params: [max, min]});
            var valRange = new OpenLayers.Filter.Function({name: 'Sub', params: ['#maxval#', '#minval#']});
            var valFactor = new OpenLayers.Filter.Function({name: 'Sub', params: ['${#attr#}', '#minval#']});

            var factor = new OpenLayers.Filter.Function({name: 'Div', params: [valFactor, valRange]});
            var sizeAdd = new OpenLayers.Filter.Function({name: 'Mul', params: [sizeRange, factor]});
            var size = new OpenLayers.Filter.Function({name: 'Add', params: [min, sizeAdd]});
            var sizeSqrt = new OpenLayers.Filter.Function({name: 'pow', params: [size, 0.5]});

            var url = Config.url + 'api/chart/drawChart/#url#';
            symbolizer['Point'] = new OpenLayers.Symbolizer.Point({externalGraphic: url, graphicFormat: 'image/svg+xml', graphicWidth: sizeSqrt});
            var rule1 = {
                symbolizer: symbolizer
            };
            return [rule1];
        }

    },
    getWmsLayerDefaults: function() {
        var layerParams = {
            singleTile: true,
            visibility: false,
            opacity: 0.7,
            ratio: 1.2,
            transitionEffect: 'resize',
            removeBackBufferDelay: 100
        };
        var params = {
            transparent: true,
            format: 'image/png'
        };
        return {layerParams: layerParams, params: params};
    },
    getChartNamedLayers: function(ruleObjs, year, forLegend) {

        var treeFilterMap = this.getTreeFilters(year);
        var namedLayers = [];
        for (var layerName in treeFilterMap) {
            var filter = treeFilterMap[layerName];
            var rules = [];
            for (var i = 0; i < ruleObjs.length; i++) {
                var ruleObj = ruleObjs[i];
                var newRuleObj = {
                    symbolizer: ruleObj.symbolizer
                };
                if (ruleObj.filter) {
                    newRuleObj.filter = new OpenLayers.Filter.Logical({type: '&&', filters: [filter, ruleObj.filter]});
                } else if (!forLegend) {
                    newRuleObj.filter = filter;
                }
                if (ruleObj.minScaleDenominator) {
                    newRuleObj.minScaleDenominator = ruleObj.minScaleDenominator;
                }
                if (ruleObj.maxScaleDenominator) {
                    newRuleObj.maxScaleDenominator = ruleObj.maxScaleDenominator;
                }
                if (forLegend) {
                    newRuleObj.name = ruleObj.name;
                }
                var rule = new OpenLayers.Rule(newRuleObj);
                rules.push(rule);
            }
            var style = new OpenLayers.Style();
            style.addRules(rules);
            namedLayers.push({
                name: layerName,
                userStyles: [style]
            });
            if (forLegend) {
                break;
            }
        }
        return namedLayers;
    },

    onLayerClick: function(panel,rec) {
    },

    /**
     * It adds choropleth as layer for potentially both maps.
     * @param cfg
     * @param autoActivate
     * @param index
     */
    addChoropleth: function(cfg,autoActivate,index) {
        var layerStore = Ext.StoreMgr.lookup('layers');
        var choroplethNode = layerStore.getRootNode().findChild('type','choroplethgroup');

        var attr = cfg['attrs'][0];
        var attrObj = Ext.StoreMgr.lookup('attribute').getById(attr.attr);
        var attrSetObj = Ext.StoreMgr.lookup('attributeset').getById(attr.as);

        var layerDefaults = this.getWmsLayerDefaults();

        var params = this.getController('Chart').getParams(cfg);


        var layer1 = new OpenLayers.Layer.WMS('WMS', Config.url + 'geoserver/wms', Ext.clone(layerDefaults.params), Ext.clone(layerDefaults.layerParams));
        var layer2 = new OpenLayers.Layer.WMS('WMS', Config.url + 'geoserver/wms', Ext.clone(layerDefaults.params), Ext.clone(layerDefaults.layerParams));
        layer1.events.register('visibilitychanged',{layer:layer1,me:this},function(a,b,c) {
            this.me.onLayerLegend(null,this.layer.nodeRec,this.layer.visibility);
        });

        // TODO at this point add new choropleth layer to their store.
        //      The same is going to happen with the Selection information. Store the tree information in memory and then
        //      It also makes sense why we have selected area generated by the geoserver.
        var node = Ext.create('Puma.model.MapLayer', {
            name: attr.name || (attrObj.get('name')+' - '+attrSetObj.get('name')),
            attribute: attr.attr,
            attributeSet: attr.as,
            type: 'chartlayer',
            leaf: true,
            params: params,
            cfg: cfg,
            sortIndex: 1.5,
            layer1: layer1,
            layer2: layer2,
            checked: autoActivate ? true : false
        });
        layer1.nodeRec = node;
        layer2.nodeRec = node;
        if (index || index===0) {
            choroplethNode.insertChild(index,node);
        } else {
            choroplethNode.appendChild(node);
        }
        Ext.StoreMgr.lookup('selectedlayers').loadData([node],true); // It actually adds layer among selectedLayers. By selected it means that it is visible in the left menu.
        if (autoActivate) {
            this.initChartLayer(node);
        }
    },

    onChoroplethAdd: function(btn) {
        var form = btn.up('choroplethpanel');
        var cfg = form.getForm().getValues();
        this.addChoropleth(cfg,true);
    },


    onChoroplethRemove: function(panel,record) {

    },


    reconfigureAll: function() {
        var layerStore = Ext.StoreMgr.lookup('layers');
        var choroplethNode = layerStore.getRootNode().findChild('type','choroplethgroup');
        for (var i=0;i<choroplethNode.childNodes.length;i++) {
            var childNode = choroplethNode.childNodes[i];
            this.initChartLayer(childNode);
        }
    },

    onChoroplethReconfigure: function(btn) {
        var form = btn.up('choroplethpanel');
        var cfg = form.getForm().getValues();
        var rec = form.chart;
        var params = this.getController('Chart').getParams(cfg);

        var attr = cfg['attrs'][0];
        var attrObj = Ext.StoreMgr.lookup('attribute').getById(attr.attr);
        // var attrSetObj = Ext.StoreMgr.lookup('attributeset').getById(attr.as);

        rec.set('name',cfg['title']+' - '+attrObj.get('name'));
        rec.set('attributeSet',attr.as);
        rec.set('attribute',attr.attr);
        rec.set('cfg',cfg);
        rec.set('params',params);
        rec.commit();
        this.initChartLayer(rec);
    },

    onChoroplethReconfigureBtnClick: function(panel,rec) {
        var cfg = this.getController('Chart').getChartWindowConfig(rec, true, 'choroplethpanel');
        var window = Ext.widget('window', cfg);
        window.down('choroplethpanel').getForm().setValues(rec.get('cfg'));
        window.show();
    },

    loadVisualization: function(visId) {
        var store = Ext.StoreMgr.lookup('visualization');
        var vis = store.getById(visId);

        if (!vis && !Config.cfg) {
            return;
        }
        var attrs = Config.cfg ? Config.cfg.choroplethCfg : vis.get('choroplethCfg');
        attrs = attrs || [];
        this.reconfigureChoropleths({attrs:attrs});

    },

    getLegendUrl: function(layersOrSldId,legendLayerName,symbologyId) {

    },

    initChartLayer: function(node) {
        //if (!node.get('checked')) {
        //	return;
        //}
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var params = node.get('params');
        params['areas'] = JSON.stringify(this.getController('Area').lowestMap);
        params['showChoropleth'] = 'true';
        var symObjs = this.getSymObj(node.get('params'));
        var ruleObjs = symObjs.rules;
        var legendRules = symObjs.legend;
        for (var i = 0; i < Math.max(2, years.length); i++) {
            var year = years[i];
            var namedLayers = this.getChartNamedLayers(ruleObjs, year);
            var legendNamedLayers = this.getChartNamedLayers(legendRules, year, true);
            node.get('params')['years'] = JSON.stringify([year]);
            if (i == 0 && years.length > 1) {
                node.get('params')['altYears'] = JSON.stringify([years[1]]);
            } else if (i == 1) {
                node.get('params')['altYears'] = JSON.stringify([years[1]]);
                node.get('params')['years'] = JSON.stringify([years[0]]);
            } else {
                delete node.get('params')['altYears'];
            }
            if (!namedLayers || !namedLayers.length){
                continue;
            }
            var layer = i == 0 ? node.get('layer1') : node.get('layer2');
            this.saveSld(node, namedLayers, layer, node.get('params'), legendNamedLayers);
        }
    },

    /**
     * This method is called whenever user clicks on the checkbox in the left menu. It should either show the layer or
     * hide the layer. If there is another layer shown in the same layer group, it also hides the currently shown layer.
     * Each MapLayer is actually associated with two layers. Each of them is for different map.
     * @param node {} Node representing the layer user clicked on.
     * @param checked {Boolean} State of the checked node.
     */
    onCheckChange: function (node, checked) {

    },

    /**
     * It shows or hides the traffic layer.
     * @param node
     * @param checked {Boolean} Whether the layer should be visible.
     * @private
     */
    changeVisibilityOfTrafficLayer: function(node, checked) {

    },

    /**
     * It gets layer group node and hides all other layers in the same layer group.
     * @param layerGroupNode {} Node representing the layer group.
     * @param chosenNode {} Node representing the currently chosen group.
     */
    hideOtherLayersInTheSameLayerGroup: function(layerGroupNode, chosenNode) {

    },

    gatherVisibleLayers: function() {

    },

    // TODO: Figure out exactly what this thing does.
    checkVisibilityAndStyles: function() {

    }
});

function Units() {
    this.units = {
        m2: 1,
        ha: 10000,
        km2: 1000000
    };
    this.allowedUnits = ['m2', 'km2', 'ha'];
}

Units.prototype.translate = function(unitFrom, unitTo, percentage) {
    percentage = percentage ? 100: 1;

    if(!unitFrom && !unitTo) {
        return percentage;
    }

    if(!unitTo || this.allowedUnits.indexOf(unitTo) == -1) {
        return percentage;
    }

    if(!unitFrom || this.allowedUnits.indexOf(unitFrom) == -1) {
        return 1 / percentage;
    }

    return (this.units[unitFrom] / this.units[unitTo]) * percentage;
};
Ext.define('PumaMain.controller.AttributeConfig', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['PumaMain.view.ConfigForm'],
    init: function() {
        this.addInfoOnClickListener(),
            this.standardUnits = ['m2', 'ha', 'km2'];

        this.control(
            {
                'attributegrid #add': {
                    click: this.onAddAttribute
                },
                'attributegrid #remove': {
                    click: this.onRemoveAttribute
                },
                'attributegrid #normalize': {
                    click: this.onOpenAttributeSetting
                },
                'attributegrid #choroplethparams': {
                    click: this.onConfigureChoropleth
                },
                'addattributetree #add': {
                    click: this.onAttributeAdded
                },
                'addattributetree #back': {
                    click: this.backToInitial
                },
                'addattributetree': {
                    checkchange: this.onAddAttrCheck,
                    itemclick: this.onAddAttrItemClick
                },
                'normalizeform #normalize': {
                    click: this.onCloseAttributeSetting
                },
                'normalizeform #back': {
                    click: this.backToInitial
                },
                'normalizeform #normAttributeSet': {
                    change: this.onNormAttrSetChange
                },
                'normalizeform #normType': {
                    change: this.onNormTypeChange
                },
                '#normalizationUnits': {
                    change: this.onChangeUnitsChange
                },
                '#normAttribute': {
                    change: this.onNormAttrChange
                },
                '#areaUnits': {
                    change: this.onAreaUnitsChange
                },
                '#normalizationAreaUnits': {
                    change: this.onNormalizationAreaUnitsChange
                },

                'choroplethform #apply': {
                    click: this.onChoroplethParamsApplied
                },
                'choroplethform #classType': {
                    change: this.onClassTypeChanged
                },
                'choroplethform #back': {
                    click: this.backToInitial
                },

                'configform #type': {
                    change: this.onChartTypeChange
                },

                'chartbar panel[cfgType=add]': {
                    beforeexpand: this.onConfigureClick
                },

                'chartpanel tool[type=gear]': {
                    click: this.onConfigureClick
                },
                '#configurelayers': {
                    click: this.onConfigureClick
                },
                '#configurefilters': {
                    click: this.onConfigureClick
                },
                'configform #configurefinish': {
                    click: this.onConfigureFinish
                }

            });

        Observer.notify('AttributeConfig#init');
    },
    addInfoOnClickListener: function(){
        $("body").on("click", ".form-label-help", function(){
            $(".form-label-help p").removeClass("open");
            var info = $(this).find("p");
            if (info.hasClass("open")){
                info.removeClass("open");
            } else {
                info.addClass("open");
            }
        });
        $("body").on("click", ".x-window", function(e){
            var cls = e.target.className;
            if (cls != "form-label-help" && cls != "form-label-help-button fa fa-info-circle"){
                $(".form-label-help p").removeClass("open");
            }
        });
    },
    onConfigureChoropleth: function(btn) {
        var attrStore = btn.up('[itemId=attributecontainer]').down('attributegrid').store;
        var recs = this.getChecked(attrStore);
        if (recs.length<1) {
            return;
        }

        this.setActiveCard(btn,4);

        var form = btn.up('[itemId=attributecontainer]').down('choroplethform');
        if (recs.length==1) {
            form.down('#classType').setValue(recs[0].get('classType'));
            form.down('#numCategories').setValue(recs[0].get('numCategories'));
        }
        else {
            form.getForm().reset();
        }
    },
    onClassTypeChanged: function(combo,val) {
        var categories = combo.up('panel').down('#numCategories');
        if (val=='continuous') {
            categories.setValue(5);
        }
        categories.setVisible(val!='continuous');
    },

    onChoroplethParamsApplied: function(btn) {

        var form = btn.up('panel');
        var attrStore = form.up('[itemId=attributecontainer]').down('attributegrid').store;
        var recs = this.getChecked(attrStore);
        for (var i=0;i<recs.length;i++) {
            var rec = recs[i];
            rec.set('numCategories',form.getComponent('numCategories').getValue());
            rec.set('classType',form.getComponent('classType').getValue());
            rec.set('zeroesAsNull',true);
            rec.commit();
        }

        this.setActiveCard(btn,0);
    },

    onConfigureFinish: function(cmp) {
        var form = cmp.up('configform');
        var values = form.getForm().getValues();
        var attrs = values.attrs;
        var attrMap = {};
        var isSelect = null;
        for (var i=0;i<attrs.length;i++) {
            var attr = attrs[i];
            var attrName = 'as_'+attr.as+'_attr_'+attr.attr;
            if (attrMap[attrName]) {
                Puma.util.Msg.msg(polyglot.t('duplicateAttributesNotAllowed'),'','l');
                return;
            }

            attrMap[attrName] = true;
            var type = attr.normType;
            if (isSelect === true && type!='select') {
                Puma.util.Msg.msg(polyglot.t('allAttributesHaveToBeNormalized'),'','l');
                return;
            }
            if (isSelect === false && type=='select') {
                Puma.util.Msg.msg(polyglot.t('allAttributesHaveToBeNormalized'),'','l');
                return;
            }
            isSelect = type == 'select';
        }



        delete values['normType'];
        delete values['normYear'];
        delete values['normAttribute'];
        delete values['normAttributeSet'];
        if (form.chart) {
            form.chart.cfg = values;
            this.getController('Chart').reconfigureChart(form.chart,false,false,true)
        }
        else if (form.formType=='chart') {
            this.getController('Chart').addChart(values);
        }
        else if (form.formType=='layers') {
            this.getController('Layers').reconfigureChoropleths(values);
        }
        else if (form.formType=='filters') {
            this.filterConfig = values.attrs;
        }
        form.up('window').close();
    },

    onConfigureClick: function(cmp) {
        var formType = 'chart';
        var cfg = {attrs:[]};
        var chart = null;
        if (cmp.itemId == 'configurelayers') {
            formType = 'layers';
            cfg = {attrs:this.layerConfig || []} ;
        }
        else if (cmp.itemId == 'configurefilters') {
            formType = 'filters';
            cfg = {attrs:this.filterConfig || []} ;
        }
        else if (cmp.xtype == 'tool') {
            chart = cmp.up('chartpanel').chart;
            cfg = chart.cfg;
        }
        var datasetId = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var dataset = Ext.StoreMgr.lookup('dataset').getById(datasetId);
        var levels = dataset.get('featureLayers');
        var fls = Ext.StoreMgr.lookup('layertemplate').queryBy(function(rec) {
            return Ext.Array.contains(levels,rec.get('_id'));
        }).getRange();
        var title = polyglot.t("chartConfiguration");
        switch (cmp.xtype=='tool' ? 'tool' : cmp.itemId) {
            case 'configurelayers':
                title = polyglot.t('thematicMapsConfiguration'); break;
            case 'configurefilters':
                title = polyglot.t('filtersConfiguration'); break;
            case 'tool':
            // title += ' - '+cfg.title

        }
        var window = Ext.widget('window',{
            layout: 'fit',
            cls: 'thematic-maps-settings',
            width: 800,
            height: 600,
            resizable: true,

            title: title,
            items: [{
                xtype: 'configform',
                featureLayers: fls,
                padding: 0,
                cls: 'configform',
                chart: chart,
                formType: formType,
                resizable: false
            }],
            listeners: {
                // JJJ jak se to dela, aby se listenery prirazovaly v this.control?
                close: this.onChartConfWindowClose
            }
        });
        window.show();
        window.down('configform').getForm().setValues(cfg);
        return false;
    },

    onChartConfWindowClose: function(){
        Ext.StoreMgr.lookup('attributes2choose').getRootNode().cascadeBy(function(node){
            if(node.get('checked')) node.set('checked', false);
        });
    },

    // triggered when AddAttributeTree opened
    onAddAttribute: function(btn) {
        var form = btn.up('configform');
        var values = form.getForm().getValues();
        var type = values.type;

        var rootNode = Ext.StoreMgr.lookup('attributes2choose').getRootNode();

        // hide non-numeric attributes for every type, but table. Add type of the node
        rootNode.cascadeBy(function(node){
            // node.collapseChildren();
            if (node.data.attrType === "text"){
                if (type !== "grid"){
                    node.data.cls = "nonnumeric-attribute";
                } else {
                    node.data.cls = "";
                }
            }
            if (type === "grid" && node.data.attrType){
                node.data.treeNodeText = node.data.attrName + " (" + polyglot.t(node.data.attrType) + ")";
            }
        });

        // hide empty attribute sets
        rootNode.cascadeBy(function(node){
            var data = node.data;

            // detect attribute set nodes
            if (data.as > 0 && data.attr.length === 0){
                var hasVisibleAttribute = false;
                node.childNodes.forEach(function(childNode){
                    if (childNode.data.cls !== "nonnumeric-attribute"){
                        hasVisibleAttribute = true;
                    }
                });

                // if there is no visible attribute in attr set, then hide attribute set
                node.data.cls = "";
                if (!hasVisibleAttribute){
                    node.data.cls = "nonnumeric-attribute"
                }
            }
        });

        this.setActiveCard(btn,1);
    },

    onRemoveAttribute: function(btn) {
        var store = btn.up('grid').store;
        var recs = this.getChecked(store);
        store.remove(recs);
    },

    // triggered on change of any checkbox in AddAttributeTree
    onAddAttrCheck: function(checkNode, checked){
        if(checkNode.get('attr')){
            var parentChecked = true;
            Ext.Array.each(checkNode.parentNode.childNodes, function(node){
                if( !node.get('checked') ) return parentChecked = false;
            });
            checkNode.parentNode.set('checked', parentChecked);

        } else if(checkNode.get('as')){
            // check/uncheck all attributes of this attribute set
            Ext.Array.each(checkNode.childNodes, function(node){
                node.set('checked', checked);
            });
            if( checked ){
                checkNode.expand();
            }
        }

    },

    onAddAttrItemClick: function(view, node, item, index, e){
        if(node.get('attr') && e.target.className != 'x-tree-checkbox'){
            node.set('checked', !node.get('checked'));
            this.onAddAttrCheck(node);
        }

        if (node.get('as') && !node.get('attr')){
            node.set('checked', !node.get('checked'));
            this.onAddAttrCheck(node, node.get('checked'));
        }
    },

    // triggered when attribute addition is confirmed in AddAttributeTree
    onAttributeAdded: function(btn) {
        var store = btn.up('addattributetree').store;
        var recs = this.getChecked(store);
        var newRecs = [];
        for (var i=0;i<recs.length;i++) {
            var rec = recs[i];
            if(!rec.get('attr')) continue;
            var newRec = Ext.create('Puma.model.MappedChartAttribute',{
                as: rec.get('as'),
                attr: rec.get('attr'),
                checked: true
            });
            newRecs.push(newRec)
        }
        var mainStore = btn.up('configform').down('attributegrid').store;
        mainStore.add(newRecs);

        // unselect all
        store.getRootNode().cascadeBy(function(node){
            if(node.get('checked')) node.set('checked', false);
        });

        this.setActiveCard(btn,0);
    },

    /**
     * Event handler which runs when user opens settings page for given attribute. It gets all checked attributes and based
     * on them either disable the form or set the current status. Form is disabled when any of the information in the form
     * differs for any two of the attributes in the form.
     * @param btn
     */
    onOpenAttributeSetting: function(btn) {
        var attrStore = btn.up('[itemId=attributecontainer]').down('attributegrid').store;
        var recs = this.getChecked(attrStore);
        if (recs.length < 1) {
            return;
        }

        var form = btn.up('[itemId=attributecontainer]').down('normalizeform');

        var normType = recs[0].get('normType');
        var normAs = recs[0].get('normAs');
        var normAttr = recs[0].get('normAttr');
        var customFactor = recs[0].get('customFactor');
        var units = recs[0].get('units');
        var displayUnits = recs[0].get('displayUnits') || units; // Before there is anything set for the attribute the units are default.
        var overwriteUnits = recs[0].get('normalizationUnits');
        var areaUnits = recs[0].get('areaUnits');

        if (this.isValidToChangeSettings(recs)) {
            form.getForm().applyToFields({disabled: false});

            form.down('#normType').setValue(normType);
            form.down('#normAttributeSet').setValue(normAs);
            form.down('#normAttribute').setValue(normAttr);
            form.down('#normalizationUnits').setValue(overwriteUnits);
            form.down('#customFactor').setValue(customFactor);
            form.down('#displayUnits').setValue(displayUnits);
            form.down('#units').setValue(units);
            form.down('#areaUnits').setValue(areaUnits);

            // Set current units to the relevant ones.
            this.units = units;

            var normalizationAreaUnits = null;
            if(normAttr) {
                var normAttributeVal = form.down('#normAttribute').getValue();
                var normalizationAttribute = normAttributeVal ? Ext.StoreMgr.lookup('attribute').getById(normAttributeVal) : null;
                normalizationAreaUnits = normalizationAttribute && normalizationAttribute.units;

            }
            this.toggleNormalizationAreaUnits(form.down('#normalizationAreaUnits'), units, normalizationAreaUnits);
            this.disableCustomFactorIfOnlyStandard(form.down('#customFactor'), units, normalizationAreaUnits);

            this.updateDisplayedUnits(form.down('#displayUnits'), units, normalizationAreaUnits, displayUnits);
            this.setActiveCard(btn, 2);
        } else {
            form.getForm().applyToFields({disabled: true});
            form.getForm().reset();

            alert(polyglot.t('bulkEditConfiguration'));
        }
    },

    // TODO: Area units in custom factor.
    // TODO: Change to attribute has incorrect information.

    /**
     * It takes source units and normalization units and based on this information it either enables or disables the
     * custom factor field
     * @param customFactorField
     * @param sourceUnits
     * @param normalizationUnits
     */
    disableCustomFactorIfOnlyStandard: function(customFactorField, sourceUnits, normalizationUnits) {
        var validUnits = this.standardUnits;
        if(validUnits.indexOf(sourceUnits) == -1 || (normalizationUnits && validUnits.indexOf(normalizationUnits) == -1)) {
            customFactorField.enable();
        } else {
            customFactorField.disable();
        }
    },

    /**
     * Show the possibility to update normalization area units in case normalization area is in standard units and the
     * units are custom.
     * @param normalizationAreaUnitsField
     * @param normalizationUnits
     */
    toggleNormalizationAreaUnits: function(normalizationAreaUnitsField, sourceUnits, normalizationUnits) {
        var validUnits = this.standardUnits;
        if(normalizationUnits && validUnits.indexOf(normalizationUnits) != -1 && validUnits.indexOf(sourceUnits) == -1) {
            normalizationAreaUnitsField.setValue(normalizationUnits);
            normalizationAreaUnitsField.show();
        } else {
            normalizationAreaUnitsField.hide();
        }
    },

    /**
     * Event handler happening when Users clicks on Setting in the open normalization panel. It simply gathers values in
     * the form and sets them.
     * It simply changes the view, when the values are invalid to be set.
     * @param btn
     */
    onCloseAttributeSetting: function (btn) {
        var normalize = btn.itemId == 'normalize';
        var form = btn.up('panel');

        var attrStore = form.up('[itemId=attributecontainer]').down('attributegrid').store;
        var recs = this.getChecked(attrStore);
        if(!this.isValidToChangeSettings(recs)) {
            this.setActiveCard(btn, 0);
            return;
        }

        var normType = normalize ? form.getComponent('normType').getValue() : null;
        var normAttr = normalize ? form.getComponent('normAttribute').getValue() : null;
        var normAs = normalize ? form.getComponent('normAttributeSet').getValue() : null;

        var normalizationUnits = form.getComponent('normalizationUnits').getValue();
        var customFactor = form.getComponent('customFactor').getValue();
        var displayUnits = form.getComponent('displayUnits').getValue();
        var areaUnits = form.getComponent('areaUnits').getValue();

        for (var i = 0; i < recs.length; i++) {
            var rec = recs[i];
            rec.set('normType', normType);
            rec.set('normAttr', normAttr);
            rec.set('normAs', normAs);
            rec.set('normalizationUnits', normalizationUnits);
            rec.set('customFactor', customFactor);
            rec.set('displayUnits', displayUnits);
            rec.set('areaUnits', areaUnits);
            rec.commit();
        }

        this.setActiveCard(btn, 0);
    },

    /**
     * It verifies whether all checked attributes share the same settings. If they do, it is possible to update them in
     * the bulk. When they don't it isn't possible.
     * @param recs
     * @returns {boolean}
     */
    isValidToChangeSettings: function(recs) {
        var areEqual = true;
        var normType = recs[0].get('normType');
        var normAs = recs[0].get('normAs');
        var normAttr = recs[0].get('normAttr');
        var normalizationUnits = recs[0].get('normalizationUnits');
        var customFactor = recs[0].get('customFactor');
        var units = recs[0].get('units');
        var areaUnits = recs[0].get('areaUnits');

        for (var attribute = 0; attribute < recs.length; attribute++) {
            if (normType != recs[attribute].get('normType') || normAs != recs[attribute].get('normAs') ||
                normAttr != recs[attribute].get('normAttr') || normalizationUnits != recs[attribute].get('normalizationUnits') ||
                customFactor != recs[attribute].get('customFactor') || units != recs[attribute].get('units') ||
                areaUnits != recs[attribute].get('areaUnits')) {
                areEqual = false;
            }
        }

        return areEqual;
    },

    /**
     * It is triggered when normalization attribute set is changed. This means when it is reset or when normalization
     * type is attribute or attribute set.
     * @param combo
     * @param val
     */
    onNormAttrSetChange: function(combo,val) {
        var attrSet = val ? Ext.StoreMgr.lookup('attributeset').getById(val) : null;
        var attributes = attrSet ? attrSet.get('attributes') : [];
        var store = combo.up('panel').down('#normAttribute').store;
        store.clearFilter(true);
        store.filter([function(rec) {
            var numeric = true;
            if (rec.data.hasOwnProperty("type") && rec.data.type != "numeric"){
                numeric = false;
            }
            return Ext.Array.contains(attributes,rec.get('_id')) && numeric
        }]);

        var panel = combo.up('panel');
        if(panel.down('#normType').getValue() == 'attributeset') {
            var unitsToShow = '%';
            panel.down('#normalizationUnits').setValue(unitsToShow);
            panel.down('#customFactor').setValue(100);
            this.updateDisplayedUnits(panel.down('#displayUnits'), null, null, unitsToShow);
        }
    },

    /**
     * It updates the normalization attribute and based on the information it contains it also updates normalization
     * units and display units. It also then update the state of custom factor and either show or hide the possibility
     * to select the normalization area units.
     * @param combo
     * @param val
     */
    onNormAttrChange: function(combo, val) {
        if(!val) {
            return;
        }
        var normalizationAttribute = val ? Ext.StoreMgr.lookup('attribute').getById(val) : null;
        var normalizationUnits = normalizationAttribute && normalizationAttribute.get('units');
        var panel = combo.up('panel');
        this.updateCustomUnits(panel, normalizationUnits);

        var sourceUnits = panel.down('#units').getValue();
        this.toggleNormalizationAreaUnits(
            panel.down('#normalizationAreaUnits'),
            sourceUnits,
            normalizationUnits
        );
        this.disableCustomFactorIfOnlyStandard(
            panel.down('#customFactor'),
            sourceUnits,
            normalizationUnits
        );
    },

    /**
     * This happens when user updates the standard units to be shown to the user. It happens when source unit is non standard and
     * normalization unit is standard.
     * @param combo
     * @param val
     */
    onNormalizationAreaUnitsChange: function(combo, val) {
        var normAttributeVal = combo.up().down('#normAttribute').getValue();
        var normalizationAttribute = normAttributeVal ? Ext.StoreMgr.lookup('attribute').getById(normAttributeVal) : null;
        var sourceUnits = normalizationAttribute && normalizationAttribute.get('units');
        var customFactor = this.getCustomFactor(val, sourceUnits);
        combo.up().down('#customFactor').setValue(customFactor);
        // Update display unit.
        this.updateDisplayedUnits(combo.up().down('#displayUnits'), this.units, val, null);
        combo.up().down('#normalizationUnits').setValue('');
        this.updateCustomFactor(combo.up().down('#customFactor'), sourceUnits, val, null);
    },

    /**
     * It gets current units and normalization units and updates values in the Normalization Units, Custom Factor and
     * current units.
     * If the normalization units and source units are the same it sets % as the valid unit.
     * If they differ but both of them are are area units then % is also set as the valid unit.
     * If at least one isn't area unit, then the unit / normalization unit is displayed.
     * @param panel
     * @param normalizationUnits {String} Units to be used for normalization.
     */
    updateCustomUnits: function(panel, normalizationUnits) {
        normalizationUnits = normalizationUnits || '';

        var validUnits = ['m2', 'ha', 'km2'];
        var unitsToShow = this.units;
        if(normalizationUnits) {
            unitsToShow += '/' + normalizationUnits;
        }

        if(this.units == normalizationUnits || validUnits.indexOf(this.units) != -1 && validUnits.indexOf(normalizationUnits) != -1) {
            unitsToShow = '%';
            panel.down('#normalizationUnits').setValue(unitsToShow);
            panel.down('#customFactor').setValue(100);
        }

        this.updateDisplayedUnits(panel.down('#displayUnits'), this.units, normalizationUnits, null);
    },

    /**
     * Based on the rules it update displayed units.
     *   By default overwrite units, overwrite all other options
     *   If both source and normalization unit is standard the result is in percent
     *   If either source or normalization unit is nonstandard it is source / normalization
     * @param displayUnitsField
     * @param sourceUnit
     * @param normalizationUnit
     * @param overwriteUnit
     */
    updateDisplayedUnits: function(displayUnitsField, sourceUnit, normalizationUnit, overwriteUnit) {
        var displayUnit = '';
        var standardUnits = this.standardUnits;

        if(overwriteUnit) {
            displayUnit = overwriteUnit;
        } else if(standardUnits.indexOf(sourceUnit) != -1 && standardUnits.indexOf(normalizationUnit) != -1) {
            displayUnit = '%';
        } else if(sourceUnit == normalizationUnit) {
            displayUnit = '%';
        } else {
            displayUnit = sourceUnit + '/' + normalizationUnit;
        }

        displayUnitsField.setValue(displayUnit);
    },

    /**
     * It updates custom factor based on similar rules to displayed units.
     *   If there are overwrite units then get custom factor based on the source units and overwrite units.
     *   If the source units and normalization units are both
     * @param customFactorField
     * @param sourceUnit
     * @param normalizationUnit
     * @param overwriteUnit
     */
    updateCustomFactor: function(customFactorField, sourceUnit, normalizationUnit, overwriteUnit) {
        var customFactor = 1;
        var standardUnits = this.standardUnits;

        if(overwriteUnit) {
            customFactor = this.getCustomFactor(sourceUnit, overwriteUnit);
        } else if(standardUnits.indexOf(sourceUnit) != -1 && standardUnits.indexOf(normalizationUnit) != -1) {
            customFactor = this.getCustomFactor(sourceUnit, normalizationUnit);
        } else if(sourceUnit == normalizationUnit) {
            customFactor = 100;
        } else {
            customFactor = 1;
        }

        customFactorField.setValue(customFactor);
    },

    /**
     * This is event handler which happens when type of the normalization changes. If the normalization changes to area
     * or to none the custom units are cleansed
     * @param combo
     * @param val
     */
    onNormTypeChange: function (combo, val) {
        var panel = combo.up('panel');
        var attrCombo = panel.down('#normAttribute');
        var attrSetCombo = panel.down('#normAttributeSet');
        var areaUnits = panel.down('#areaUnits');
        var normalizationAreaUnits = panel.down('#normalizationAreaUnits');
        var customFactor = panel.down('#customFactor');
        var changeUnits = panel.down('#normalizationUnits');
        var displayUnits = panel.down('#displayUnits');
        customFactor.reset();
        attrCombo.reset();
        attrSetCombo.reset();
        normalizationAreaUnits.reset();

        changeUnits.setValue('');
        displayUnits.setValue(this.units);

        if (val == 'attributeset') {
            attrSetCombo.show();
            attrCombo.hide();
            areaUnits.hide();
            normalizationAreaUnits.hide();
        } else if (val == 'attribute') {
            attrSetCombo.show();
            attrCombo.show();
            areaUnits.hide();
        } else if (val == 'area') {
            attrSetCombo.hide();
            attrCombo.hide();
            normalizationAreaUnits.hide();

            var allowedUnits = ['m2','ha','km2'];
            if(allowedUnits.indexOf(this.units) == -1) {
                areaUnits.show();
                if(!areaUnits.getValue()) {
                    areaUnits.setValue('m2');
                }
            }

            this.updateCustomUnits(combo.up('panel'), areaUnits.getValue() || 'm2');
        } else {
            attrSetCombo.hide();
            attrCombo.hide();
            areaUnits.hide();
            normalizationAreaUnits.hide();
        }
    },

    /**
     * When normalization over area it is possible to update the units which will be then used. It must update the
     * dispayed units and custom factor
     * @param combo
     * @param val
     */
    onAreaUnitsChange: function(combo, val) {
        this.updateCustomUnits(combo.up('panel'), val);
        this.updateCustomFactor(combo.up('panel').down('#customFactor'), val, 'm2', null);
    },

    onChartTypeChange: function(combo,val) {
        var configForm = combo.up('configform');
        var advanced = Ext.ComponentQuery.query('#advancedfieldset',configForm)[0];
        var helpInformation = Ext.ComponentQuery.query('#chartTypeHelp', configForm)[0];
        var periodsSettings = Ext.ComponentQuery.query('#periodsSettings',configForm)[0];
        var periodsSettingsPolarChart = Ext.ComponentQuery.query('#periodsSettingsPolarChart',configForm)[0];
        var polarAxesNormalizationSettings = Ext.ComponentQuery.query('#polarAxesNormalizationSettings',configForm)[0];
        var stackingSettings = Ext.ComponentQuery.query('#stackingSettings',configForm)[0];
        var aggregateSettings = Ext.ComponentQuery.query('#aggregateSettings',configForm)[0];
        var cardContainer = Ext.ComponentQuery.query('#attributecontainer',configForm)[0];
        var periods = Ext.ComponentQuery.query('#selyear')[0].getValue();
        cardContainer.show();
        if (val!='extentoutline') {
            cardContainer.getLayout().setActiveItem(0);
        }
        else {
            cardContainer.getLayout().setActiveItem(3);
        }

        // show/hide advanced settings (periods, aggregation, stacking...)
        if (val=='columnchart' || val=='polarchart') {
            advanced.show();
        } else {
            advanced.hide();
        }

        // show/hide aggregation and stacking
        if (val=='columnchart') {
            stackingSettings.show();
            aggregateSettings.show();
        } else {
            stackingSettings.hide();
            aggregateSettings.hide();
        }

        // show/hide periods settings
        if (val=='columnchart' && periods.length > 1 ) {
            periodsSettings.show();
        } else {
            periodsSettings.hide();
        }

        if(val == 'scatterchart'){
            helpInformation.show();
        } else {
            helpInformation.hide();
        }

        // show/hide periods settings
        if (val=='polarchart' && periods.length > 1 ) {
            periodsSettingsPolarChart.show();
        } else {
            periodsSettingsPolarChart.hide();
        }

        // show/hide polar chart normalization options
        if (val=='polarchart') {
            polarAxesNormalizationSettings.show();
        } else {
            polarAxesNormalizationSettings.hide();
        }



        // For all chart types but tables, remove attribute if it isn't numeric
        var store = configForm.down('attributegrid').store;
        store.data.items.forEach(function(record){
            if (record.data.attrType !== 'numeric' && val !== "grid"){
                store.remove(record);
            }
        });
    },

    /**
     * Event handler which happens when Change units change. In this case the display units are updated to current change
     * units and the custom factor is updated based on all the available information.
     * @param combo
     * @param value
     */
    onChangeUnitsChange: function(combo, value) {
        var customFactor = combo.up('configform').down('#customFactor');
        var currentAttributeUnits = this.units;
        var validUnits = this.standardUnits;

        if(value == '%') {
            customFactor.setValue(100);
        } else if(validUnits.indexOf(value) != -1) {
            customFactor.setValue(this.getCustomFactor(currentAttributeUnits, value));
        }

        var normAttribute = combo.up('panel').down('#normalizationUnits').getValue();
        this.updateDisplayedUnits(combo.up('panel').down('#displayUnits'), this.units, null, normAttribute);
    },

    getCustomFactor: function(source, result) {
        var factors = {
            "m2": 1,
            "ha": 10000,
            "km2": 1000000
        };

        return factors[source] / factors[result]
    },

    backToInitial: function(btn) {
        this.setActiveCard(btn,0);
    },
    setActiveCard: function(cmp,idx) {
        var component = cmp.up('[itemId=attributecontainer]');
        var layout = component.getLayout();
        layout.setActiveItem(idx);
    },

    getChecked: function(store) {
        if(!store.tree){
            return store.query('checked',true).getRange();
        }else{
            var checkedNodes = [];
            store.getRootNode().cascadeBy(function(node){
                if(node.get('checked')) checkedNodes.push(node);
            });
            return checkedNodes;
        }
    }
});


Ext.define('PumaMain.controller.ViewMng', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['PumaMain.view.CommonMngGrid','PumaMain.view.CommonSaveForm'],
    init: function() {

        Observer.addListener("PumaMain.controller.ViewMng.onShare",this.onShare.bind(this));

        if (Config.toggles.useTopToolbar) {
            this.onVisOrViewManage({itemId: 'customviews'});
        }

        this.control(
            {
                'commonmnggrid' : {
                    recmoved: this.onRecMoved,
                    recdeleted: this.onDelete,
                    urlopen: this.onUrlOpen
                },
                'commonsaveform #save' : {
                    click: this.onSave
                },
                '#savevisualization': {
                    click: this.onVisSave
                },
                '#managevisualization': {
                    click: this.onVisOrViewManage
                },
                '#sharedataview': {
                    click: this.onShare
                },
            })

        Observer.notify('ViewMng#init');
        window.Stores.addListener(this.onEvent.bind(this));
    },
    onUrlOpen: function(grid,rec) {
        var url = window.location.origin+window.location.pathname+'?id='+rec.get('_id');

        var items = [{
            xtype: 'displayfield',
            value: url
        }];
        if(Config.toggles.isUrbanTep){
            items.push({
                xtype: 'button',
                text: polyglot.t('shareOnPortal'),
                handler: function() {
                    alert('clicked');
                }
            })
        }

        var win = Ext.widget('window',{
            bodyCls: 'urlwindow',
            title: polyglot.t('dataViewUrl'),
            items: items
        });
        win.show();
    },

    onRecMoved: function(grid,rec, moveUp) {
        var store = Ext.StoreMgr.lookup('visualization4sel');
        var ids = store.collect('_id');
        var id = rec.get('_id')
        var idx = Ext.Array.indexOf(ids,id);
        var length = ids.length;
        Ext.Array.remove(ids,id)
        var newIdx = moveUp ? (idx-1) : (idx+1);
        if (newIdx<0 || newIdx+1>length) return;
        Ext.Array.insert(ids,newIdx,[id]);
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var theme = Ext.StoreMgr.lookup('theme').getById(themeId);
        theme.set('visOrder',ids);
        this.saveRecordsOrder(themeId, ids);
        //theme.save();
        store.sort();

    },
    /**
     * Save the order of visualizations
     * @param theme {string} id of the theme
     * @param visualizations {Array} list of visaulizations
     */
    saveRecordsOrder: function(theme, visualizations){
        $.post(Config.url + "rest/vis/saveorder", {
            theme: theme,
            visOrder: visualizations
        }).done(function(data) {
            console.log("Visualizations order saved!")
        });
    },
    onDelete: function(grid,rec) {
        rec.destroy();
        window.Stores.notify("VISUALISATIONS_REFRESH");
    },
    onShare: function(options) {
        const onSave = (rec,operation) => {

            const promises = []
            if(options.group.value && options.group.value !== 'null') {
                promises.push(store.groups.share(options.group.value, options.state.scope, options.state.places, rec.data._id));
            }
            if(options.user.value && options.user.value !== 'null') {
                promises.push(store.users.share(options.user.value, options.state.scope, options.state.places, rec.data._id));
            }
            Promise.all(promises).then(() => {
                this.onSaveFinish(rec, operation, options.group, options.user, options.language);
                window.Stores.notify('components#shareSetVisible', false);
            })
        }

        const store = window.store;
        options.state = window.stateStore.current();
        var view = Ext.create('Puma.model.DataView',this.gatherViewConfig(options));

        //Clear view options from share window
        view.data.conf.components.share = null;
        view.data.conf.components.windows.share = {open:false};

        view.save({
            callback: onSave
        });
    },
    onSave: function(btn) {
        var form = btn.up('form');
        var name = form.getComponent('name').getValue();
        var rec = form.rec;
        rec.set('name',name);
        rec.save({
            callback: this.onSaveFinish
        });
        btn.up('window').close();

    },

    onSaveFinish: function(rec, operation, group, user, language) {
        var isView = rec.modelName == 'Puma.model.DataView';
        var store = Ext.StoreMgr.lookup(isView ? 'dataview' : 'visualization');
        store.addWithSlaves(rec);
        if (isView) {
            var id = rec.get('_id');
            var url = window.location.origin+window.location.pathname+'?id='+id;
            var shareUrl = this.showUrl(url, group, user, language);
            Stores.notify('sharing#urlReceived', {
                isUrbanTep: Config.toggles.isUrbanTep,
                selectedUser: user,
                selectedGroup: group,
                name: rec.data.conf.name,
                url: shareUrl
            });
            Stores.notify("DATAVIEWS_ADD", [{
                id: rec.data._id,
                key: rec.data._id,
                date: new Date(),
                // data: {
                // 	name: rec.data.conf.name,
                // 	description: rec.data.conf.description,
                // 	dataset: rec.data.conf.dataset,
                // 	language: rec.data.conf.language
                // },
                data: rec.data.conf,
                permissions: rec.data.permissions
            }]);
        } else {
            window.Stores.notify("VISUALISATIONS_REFRESH", {key: rec.data._id});
        }
    },

    showUrl: function(baseUrl, selectedGroup, selectedUser, language){
        let auth = "&needLogin=true";
        const isLoggedIn = stateStore.current().user.isLoggedIn;
        if (isLoggedIn && selectedGroup.value === '2'){
            auth = "";
        }
        let url = baseUrl + auth +'&lang=' + language.value;
        return url;
    },

    onVisOrViewManage: function(btn) {
        let component = Ext.getCmp('window-' + btn.itemId);
        if (component) {
            component.destroy();
        } else {
            if (btn.itemId == 'managevisualization') {
                var window = Ext.widget('window',{
                    layout: 'fit',
                    width: 300,
                    title: polyglot.t('manageVisualizations'),
                    id: 'window-' + btn.itemId,
                    height: 400,
                    y: 200,
                    bodyCls: 'manageDwWindow',
                    items: [{
                        xtype: 'commonmnggrid',
                        allowReorder: true,
                        store: Ext.StoreMgr.lookup('visualization4sel')
                    }]
                });
                window.show();
            } else {
                var window2 = Ext.widget('window',{
                    layout: 'fit',
                    width: 300,
                    title: polyglot.t('customViews'),
                    id: 'window-' + btn.itemId,
                    itemId: 'window-customviews',
                    cls: Config.toggles.useTopToolbar ? 'detached-window' : undefined,
                    closable: !Config.toggles.useTopToolbar,
                    height: 400,
                    y: 200,
                    bodyCls: 'manageDwWindow',
                    items: [{
                        xtype: 'commonmnggrid',
                        allowReorder:false,
                        store: Ext.StoreMgr.lookup('dataview')
                    }],
                    tools: [{
                        type: 'hide',
                        cls: 'hide',
                        tooltip: polyglot.t('hide'),
                        itemId: 'hide',
                        hidden: !Config.toggles.useTopToolbar,
                        listeners: {
                            click: {
                                fn: function() {
                                    Observer.notify("Tools.hideClick.customviews");
                                }
                            }
                        }
                    }]
                });
                //window2.show();
            }
        }
    },

    onDataviewLoad: function() {
        var yearCombo = Ext.ComponentQuery.query('#selyear')[0];
        var datasetCombo = Ext.ComponentQuery.query('#seldataset')[0];
        var themeCombo = Ext.ComponentQuery.query('#seltheme')[0];
        var visualizationCombo = Ext.ComponentQuery.query('#selvisualization')[0];
        var locationCombo = Ext.ComponentQuery.query('#sellocation')[0];
        var cfg = Config.cfg;

        yearCombo.suspendEvents();
        datasetCombo.suspendEvents();
        themeCombo.suspendEvents();
        visualizationCombo.suspendEvents();
        locationCombo.suspendEvents();

        datasetCombo.setValue(cfg.dataset);

        var locStore = Ext.StoreMgr.lookup('location4init');
        locStore.clearFilter(true);
        locStore.filter([
            function(rec) {
                return rec.get('dataset')==cfg.dataset;
            }
        ]);

        var themeStore = Ext.StoreMgr.lookup('theme4sel');
        themeStore.clearFilter(true);
        themeStore.filter([
            function(rec) {
                return rec.get('dataset')==cfg.dataset;
            }
        ]);

        var visStore = Ext.StoreMgr.lookup('visualization4sel');
        var yearStore = Ext.StoreMgr.lookup('year4sel');
        var themeYears = Ext.StoreMgr.lookup('theme').getById(cfg.theme).get('years');

        yearStore.clearFilter(true);
        yearStore.filter([function(rec) {
            return Ext.Array.contains(themeYears,rec.get('_id'))
        }])

        visStore.clearFilter(true);
        visStore.filter([function(rec) {
            return rec.get('theme')==cfg.theme
        }]);

        yearCombo.setValue(cfg.years);
        visualizationCombo.setValue(cfg.visualization);
        themeCombo.setValue(cfg.theme);

        locationCombo.setValue(cfg.location);

        yearCombo.resumeEvents();
        datasetCombo.resumeEvents();
        themeCombo.resumeEvents();
        visualizationCombo.resumeEvents();
        locationCombo.resumeEvents();

        var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0];
        onlySel.suspendEvents();
        onlySel.toggle(cfg.pagingUseSelected);
        onlySel.resumeEvents();

        var selColors = Ext.ComponentQuery.query('#useselectedcolorpicker')[0];
        selColors.suspendEvents();
        if (cfg.pagingSelectedColors) {
            selColors.select(cfg.pagingSelectedColors);

        }
        selColors.resumeEvents();

        onlySel.suspendEvents();
        onlySel.toggle(cfg.pagingUseSelected);
        onlySel.resumeEvents();

        this.getController('AttributeConfig').filterConfig = cfg.filterAttrs;
        var locationTheme = this.getController('LocationTheme');
        locationTheme.datasetChanged = true;
        locationTheme.visChanged = true;
        locationTheme.themeChanged = true;
        locationTheme.yearChanged = true;
        locationTheme.locationChanged = true;
        locationTheme.onYearChange({itemId:'dataview'});

        var locStore = Ext.StoreMgr.lookup('location4init');
        var locationsData = locStore.query('dataset',cfg.dataset);

        ThemeYearConfParams.allPlaces = [];
        locationsData.items.forEach(function(item){
            ThemeYearConfParams.allPlaces.push(item.raw._id || item.raw.id);
        });
        this.getController('LocationTheme').reloadWmsLayers();

        // Figure out how does this actually work.
        var scope = Ext.StoreMgr.lookup('dataset').getById(cfg.dataset);
        var selection = cfg.selection;
        if(scope.get('oneLevelOnly')){
            setTimeout(function(){
                Stores.notify('fo#adjustConfiguration');

                if(selection) {
                    window.selectionStore.deserialize(selection);
                }
            }.bind(this), 2000);
        }


        var options = {};

        options.sidebarReportsOpen = Config.cfg.sidebarReportsOpen;

        // set location and range of all maps
        if (Config.cfg.worldWindState){
            options.worldWindState = {
                location: Config.cfg.worldWindState.location,
                range: Config.cfg.worldWindState.range,
                is2D: Config.cfg.worldWindState.is2D,
                considerElevation: Config.cfg.worldWindState.considerElevation
            }
        }

        // set toptoolbar and widgets state
        if (Config.cfg.widgets){
            options.widgets = Config.cfg.widgets;
        }
        // redux components
        if (Config.cfg.components){
            options.components = Config.cfg.components;
        }
        // redux scenarios
        if (Config.cfg.scenarios){
            options.scenarios = Config.cfg.scenarios;
        }
        // maps metadata
        if (Config.cfg.mapsMetadata){
            options.mapsMetadata = Config.cfg.mapsMetadata;
        }
        // map defaults
        if (Config.cfg.mapDefaults){
            options.mapDefaults = Config.cfg.mapDefaults;
        }
        // active aoi
        if (Config.cfg.activeAoi){
            options.activeAoi = Config.cfg.activeAoi;
        }
        // active aoi
        if (Config.cfg.selectedMapId){
            options.selectedMapId = Config.cfg.selectedMapId;
        }

        if (Config.cfg.dataset){
            options.scope = Config.cfg.dataset;
        }
        if (Config.cfg.locations){
            options.locations = Config.cfg.locations;
        }
        if (Config.cfg.selMap){
            options.selMap = Config.cfg.selMap;
        }
        if (Config.cfg.activeChoroplethKeys){
            options.activeChoroplethKeys = Config.cfg.activeChoroplethKeys;
        }


        window.Stores.notify('fo#adjustConfigurationFromDataview', options);

        // show right panel
        if (Config.cfg.sidebarReportsOpen){
            $('#sidebar-reports').show();
        }

        Observer.notify('scopeChange');
        Observer.notify("resizeMap");
    },

    gatherViewConfig: function (options) {
        var cfg = {};
        cfg.multipleMaps = Ext.ComponentQuery.query('maptools #multiplemapsbtn')[0].pressed === true;
        cfg.years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        cfg.dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        cfg.theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        cfg.visualization = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        cfg.location = Ext.ComponentQuery.query('#sellocation')[0].getValue();
        cfg.expanded = this.getController('Area').getExpandedAndFids().expanded;
        cfg.selMap = {};
        var selMap = this.getController('Select').selMap;

        // fix for areas selected from areas filter
        for (var key in selMap){
            cfg.selMap[key] = selMap[key].map(function(area){
                return {
                    at: area.at,
                    gid: area.gid.toString(),
                    loc: area.loc
                }
            });
        }

        cfg.choroplethCfg = this.getController('AttributeConfig').layerConfig;

        cfg.pagingUseSelected = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
        var pagingPicker = Ext.ComponentQuery.query('#useselectedcolorpicker')[0];
        cfg.pagingSelectedColors = pagingPicker.xValue || pagingPicker.value;

        var sliders = Ext.ComponentQuery.query('#advancedfilters multislider');
        var filterMap = {};
        for (var i = 0; i < sliders.length; i++) {
            var slider = sliders[i];
            var val = slider.getValue();
            var attrName = slider.attrname;
            filterMap[attrName] = val;

        }

        cfg.filterMap = filterMap;
        cfg.filterActive = false;

        var layers = Ext.StoreMgr.lookup('selectedlayers').getRange();
        this.getController('Layers').resetIndexes();
        var layerCfg = [];
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            layerCfg.push({
                opacity: layer.get('layer1').opacity || 1,
                sortIndex: layer.get('sortIndex'),
                type: layer.get('type'),
                attributeSet: layer.get('attributeSet'),
                attribute: layer.get('attribute'),
                at: layer.get('at'),
                name: layer.get('name'),
                symbologyId: layer.get('symbologyId')
            })
        }
        cfg.layers = layerCfg;
        // cfg.trafficLayer = Ext.StoreMgr.lookup('layers').getRootNode().findChild('type', 'livegroup').childNodes[0].get('checked');
        var store = Ext.StoreMgr.lookup('paging');
        cfg.page = store.currentPage;

        // SelectionStore
        cfg.selection = window.selectionStore.serialize();

        var cfgs = this.getController('Chart').gatherCfg();
        var queryCfgs = this.getController('Chart').gatherCfg(true);
        var viewCfgs = [];
        for (var i = 0; i < cfgs.length; i++) {
            viewCfgs.push({
                cfg: cfgs[i],
                queryCfg: queryCfgs[i]
            })
        }

        cfg.cfgs = viewCfgs;

        if (cfg.choroplethCfg){
            cfg.choroplethCfg.forEach(function(choropleth){
                if (choropleth.control){
                    delete choropleth.control;
                }
            });
        }

        cfg.is3D = $('body').hasClass('mode-3d');

        if (options){
            // dataview metadata
            cfg.name = options.name;
            cfg.description = options.description;
            cfg.language = options.language.value || "en";

            // world wind map settings
            if (options.state && options.state.worldWindNavigator){
                cfg.worldWindState = {
                    is2D: !options.state.isMap3D,
                    range: options.state.worldWindNavigator.range,
                    location: options.state.worldWindNavigator.lookAtLocation
                };
            }
            // widgets state
            if (options.state && options.state.widgets){
                cfg.widgets = options.state.widgets;
            }
            // components
            if (options.state && options.state.components){
                cfg.components = options.state.components;
            }
            // maps metadata
            if (options.state && options.state.mapsMetadata){
                cfg.mapsMetadata = options.state.mapsMetadata;
            }
            // maps defaults
            if (options.state && options.state.mapDefaults){
                cfg.mapDefaults = options.state.mapDefaults;
            }
            // scenarios
            if (options.state && options.state.scenarios){
                cfg.scenarios = options.state.scenarios;
            }
            // active aoi
            if (options.state && options.state.activeAoi){
                cfg.activeAoi = options.state.activeAoi;
            }
            // active location
            if (options.state && options.state.locations){
                cfg.locations = options.state.locations;
            }
            // selected map
            if (options.state && options.state.selectedMapId){
                cfg.selectedMapId = options.state.selectedMapId;
            }
            // active choropleths
            if (options.state.activeChoroplethKeys){
                cfg.activeChoroplethKeys = options.state.activeChoroplethKeys;
            }

            // sidebar reports settings
            cfg.sidebarReportsOpen = !$('#sidebar-reports').hasClass('hidden');
        }

        return {
            conf: cfg
        }
    },


    onVisSave: function() {
        let component = Ext.getCmp('window-save-vis');
        if (component) {
            component.destroy();
        } else {
            var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
            var cfgs = this.getController('Chart').gatherCfg();
            var layerCfgs = this.getController('AttributeConfig').layerConfig;
            if (layerCfgs){
                layerCfgs.forEach(function(layer){
                    delete layer.control;
                });
            }

            var visibleLayers = {};
            let state = window.stateStore.current();

            // active choropleths
            if (state.activeChoroplethKeys) {
                visibleLayers.choropleths = state.activeChoroplethKeys;
            }
            // active background layers
            if (state.mapDefaults && state.mapDefaults.activeBackgroundLayerKey) {
                visibleLayers.background = state.mapDefaults.activeBackgroundLayerKey;
            }
            // active vector and raster layers
            if (state.mapDefaults && state.mapDefaults.layerTemplates) {
                visibleLayers.layers = state.mapDefaults.layerTemplates;
            }

            var vis = Ext.create('Puma.model.Visualization',{
                theme: theme,
                cfg: cfgs,
                choroplethCfg: layerCfgs,
                visibleLayers: visibleLayers,
                attributes: ExchangeParams.attributesState,
            });
            var wind = Ext.widget('window',{
                layout: 'fit',
                width: 300,
                id: 'window-save-vis',
                cls: 'window-savevisualization',
                title: polyglot.t('saveVisualization'),
                y: 200,
                bodyCls: 'saveaswindow',
                items: [{
                    xtype: 'commonsaveform',
                    rec: vis
                }]
            });
            wind.show();
        }
    },
    onEvent: function (type, options) {
        if (type === "HANDLE_VISUALIZATION_MANAGEMENT_WINDOW"){
            this.onVisOrViewManage({itemId: 'managevisualization'});
        } else if (type === "HANDLE_VISUALIZATION_SAVE_WINDOW"){
            this.onVisSave();
        }
    }

});Ext.define('PumaMain.controller.Select', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        Observer.addListener("selectInternal",this.selectInternal.bind(this));
        Stores.addListener(this._onEvent.bind(this));
        this.control({
            '#selectcolorpicker': {
                select: this.onChangeColor
            },
            '#useselectedcolorpicker': {
                select: this.onChangeChartColor
            },
            'tool[type=unselect]': {
                click: this.clearSelections
            },
            'tool[type=unselectall]': {
                click: this.clearSelectionsAll
            }

        });
        this.selMap = {'ff4c39':[]};
        this.colorMap = {};
        this.hoverMap = [];
        Select.actualColor = this.actualColor = 'ff4c39';
        this.defaultColor = 'ff4c39';

        Select.select = this.select.bind(this);
        Select.selectedAreasMap = {};
        Select.selectedAreasMap[this.actualColor] = [];
        Select.controller = this;

        Observer.notify('Select#init');
    },
    onAfterUnselectRender: function() {
        //Ext.get('app-tools-colors-unselect').on('click',this.clearSelections,this);
    },


    select: function(areas,add,hover) {

        if (!this.actualColor) return;
        if (hover) {
            this.fromChart = null;
        }
        if (this.task) {
            this.task.cancel();
        }
        this.task = new Ext.util.DelayedTask();
        this.task.delay(hover ? 100 : 1,this.selectInternal,this,arguments);


        if (!window.Charts.selectedAreas){
            window.Charts.selectedAreas = {};
        }

        var selectedAreas = areas.map(function(area){return area.gid});

        if (add && window.Charts.selectedAreas[this.actualColor]){
            let oldAreas = window.Charts.selectedAreas[this.actualColor];
            window.Charts.selectedAreas[this.actualColor] = Ext.Array.difference(Ext.Array.merge(oldAreas, selectedAreas), Ext.Array.intersect(oldAreas, selectedAreas));
        } else {
            window.Charts.selectedAreas[this.actualColor] = selectedAreas;
        }

        window.Stores.notify("selection#selectionChanged");
    },

    onToggleHover: function(btn,value) {


    },

    onToggleSelectInMap: function(btn,value) {

    },
    onChangeChartColor: function(picker, value) {
        this.updateCounts();
        this.selectDelayed(null,null,null,true);
    },
    onChangeColor: function(picker,value) {
        Select.actualColor = this.actualColor = value;
        Observer.notify('Select#onChangeColor');
        this.selMap[value] = this.selMap[value] || [];
        if (this.hoverMap.length) {
            this.hoverMap = [];
            this.selectInternal([],true,false);
        }
    },

    selectInternal: function(areas,add,hover,delay) {
        if (OneLevelAreas.hasOneLevel){
            areas = SelectedAreasExchange.data.data;
        }
        if (!hover) {
            var sel = this.selMap[this.actualColor];
        }
        else {
            var sel = this.hoverMap;
        }
        var newSel = [];
        if (!add || hover) {

            areas = areas.concat([]);
            for (var i=0;i<areas.length;i++) {
                areas[i].equals = function(b) {
                    return this.gid === b.gid && this.at === b.at && this.loc === b.loc
                }
            }
            newSel = areas;
        }
        else {
            for (var i=0;i<areas.length;i++) {
                areas[i].equals = function(b) {
                    return this.gid === b.gid && this.at === b.at && this.loc === b.loc
                }
            }
            var diff = this.arrDifference(sel,areas);
            var add = this.arrDifference(areas,sel);
            newSel = Ext.Array.merge(diff,add);
        }

        if (!hover) {
            this.selMap[this.actualColor] = newSel;
            for (var col in this.selMap) {
                if (col==this.actualColor) continue;
                var diff = this.arrDifference(this.selMap[col],newSel);
                this.selMap[col] = diff;
            }
        }
        else {
            this.hoverMap = newSel;
        }

        this.colorMap = this.prepareColorMap();

        if (OneLevelAreas.hasOneLevel){
            this.getController('Chart').reconfigure('immediate');
            return;
        }

        this.getController('Area').colourTree(this.colorMap);
        this.getController('Chart').reconfigure('immediate');

        this.updateCounts();

        Select.selectedAreasMap = this.selMap;

        if (this.selectTask) {
            this.selectTask.cancel();
        }
        this.selectTask = new Ext.util.DelayedTask();
        this.selectTask.delay(delay || 500,this.selectDelayed,this,arguments);

    },

    updateCounts: function() {
        var lowestMap = this.getController('Area').lowestMap;
        var outerCount = 0;
        var overallCount = 0;
        var picker = Ext.ComponentQuery.query('#useselectedcolorpicker')[0]
        var selectColors = picker.xValue || picker.value;
        selectColors = Ext.isArray(selectColors) ? selectColors : [selectColors]
        for (var color in this.selMap) {
            if (!Ext.Array.contains(selectColors,color)) {
                continue;
            }
            for (var i=0;i<this.selMap[color].length;i++) {
                var obj = this.selMap[color][i];
                overallCount++;
                if (lowestMap[obj.loc] && lowestMap[obj.loc][obj.at] && Ext.Array.contains(lowestMap[obj.loc][obj.at],obj.gid)) {}
                else {
                    this.outerSelect = true;
                    outerCount++;
                }
            }
        }
        this.outerCount = outerCount;
        this.overallCount = overallCount;
        if (overallCount==0) {
            this.switchToAllAreas();
        }
    },
    switchToAllAreas: function() {
        var cmp = Ext.ComponentQuery.query('#areapager #onlySelected')[0];
        cmp.suspendEvents();
        cmp.toggle(false);
        cmp.resumeEvents();
    },

    selectDelayed: function(areas,add,hover,bypassMapColor) {
        if (!bypassMapColor) {
            this.getController('Layers').colourMap(this.colorMap);
        }

        if (!hover) {
            var lowestCount = this.getController('Area').lowestCount;
            var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
            var count = onlySel ? (this.overallCount) : (lowestCount+this.outerCount)

            Ext.StoreMgr.lookup('paging').setCount(count);

            var outer = !this.fromChart || this.outerSelect || (!this.outerSelect && this.prevOuterSelect) || onlySel;
            var type = outer  ? 'outer' : 'inner';
            if (outer && this.fromScatterChart && !this.fromChart) type = 'outerscatter';

            this.getController('Chart').reconfigure(type);

            this.fromChart = null;
            this.fromScatterChart = null;
        }
        this.prevOuterSelect = this.outerSelect;
        this.outerSelect = false;
    },

    // taken from Ext.Array
    arrDifference: function(arrayA, arrayB) {
        var clone = arrayA ? Ext.Array.slice(arrayA,0) : [];
        var ln = clone.length,
            i, j, lnB;
        for (i = 0, lnB = arrayB.length; i < lnB; i++) {
            for (j = 0; j < ln; j++) {
                //if (clone[j] === arrayB[i]) {
                clone[j].equals = clone[j].equals || function(b) {
                    return this.gid === b.gid && this.at === b.at && this.loc === b.loc
                }

                if (clone[j].equals(arrayB[i])) {
                    Ext.Array.erase(clone, j, 1);
                    j--;
                    ln--;
                }
            }
        }

        return clone;
    },

    clearSelectionsAll: function() {
        if (this.hoverMap.length > 0 || !Ext.isEmpty(this.colorMap)){
            this.selMap = {'ff4c39':[]};
            this.hoverMap = [];
            this.colorMap = {};
            this.getController('Area').colourTree(this.colorMap);
            this.updateCounts();
            this.selectDelayed();

            Select.selectedAreasMap = null;
            Stores.notify("selection#everythingCleared");
        }
    },
    clearSelections: function() {
        this.selMap[this.actualColor] = [];
        this.prepareColorMap();
        this.getController('Area').colourTree(this.colorMap);
        this.getController('Chart').reconfigure('immediate');
        this.updateCounts();
        this.selectDelayed();

        Stores.notify("selection#activeCleared", {color: this.actualColor});
        var clearAll = true;
        for (var key in this.selMap){
            if (this.selMap[key].length > 0){
                clearAll = false;
            }
        }
        if (clearAll){
            Stores.notify("selection#everythingCleared");
        }
    },

    prepareColorMap: function() {
        var resultMap = {};
        for (var color in this.selMap) {
            var actual = this.selMap[color];
            for (var i=0;i<actual.length;i++) {
                var area = actual[i];
                resultMap[area.loc] = resultMap[area.loc] || {};
                resultMap[area.loc][area.at] = resultMap[area.loc][area.at] || {};
                resultMap[area.loc][area.at][area.gid] = color;
            }
        }
        for (var i=0;i<this.hoverMap.length;i++) {
            var area = this.hoverMap[i];
            resultMap[area.loc] = resultMap[area.loc] || {};
            resultMap[area.loc][area.at] = resultMap[area.loc][area.at] || {};
            resultMap[area.loc][area.at][area.gid] = this.actualColor;
        }
        this.colorMap = resultMap;

        setTimeout(function(){
            Stores.notify('selection#selected');
        },1000);

        return resultMap;
    },

    _onEvent: function(type, options){
        if (type === "selection#clearAll"){
            this.clearSelectionsAll();
        } else if (type === "selection#select"){
            this.actualColor = options.color;
            var colorpicker = Ext.ComponentQuery.query('#selectcolorpicker')[0];
            if (colorpicker){
                colorpicker.select(options.color);
            }
            this.select(options.areas);
        }
    }

});

Ext.define('PumaMain.controller.Chart', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [ 'Ext.ux.grid.FiltersFeature', 'PumaMain.view.Chart', 'PumaMain.view.VisualizationForm', 'Puma.util.Color', 'PumaMain.view.ChartPanel'],
    init: function() {
        this.control({
            'initialbar #visualizationsbtn': {
                click: this.onOpenVisualizationWindow
            },
            'initialbar #chartbtn': {
                click: this.onChartBtnClick
            },
            'initialbar #savevisbtn': {
                click: this.onVisualizationSave
            },
            'initialbar #urlbtn': {
                click: this.onSaveView
            },
            'visualizationform form': {
                beforesave: this.onBeforeVisualizationSave,
                aftersave: this.onAfterVisualizationSave
            },
            'attributepanel #attributeSet': {
                change: this.onAttrSetChange
            },
            'attributepanel #normAttributeSet': {
                change: this.onAttrSetChange
            },
            'attributepanel #normalizationAttributeSet': {
                change: this.onAttrSetChange
            },
            'attributepanel #addattrbtn': {
                click: this.onAddAttribute
            },
            'attributepanel #removeattrbtn': {
                click: this.onRemoveAttribute
            },
            'chartconfigpanel #addbtn': {
                click: this.onChartAdd
            },
            'chartconfigpanel #reconfigurebtn': {
                click: this.onChartReconfigure
            },
            'chartpanel tool[type=close]': {
                click: this.onChartRemove
            },
            'chartpanel tool[type=help]': {
                click: this.onToggleLegend
            },
            'chartpanel tool[type=print]': {
                click: this.onExportImage
            },
            'chartpanel': {
                expand: this.onChartExpand
            },
            'chartpanel tool[type=collapse]': {
                click: this.onExportCsv
            },
            'chartpanel tool[type=search]': {
                click: this.onSwitchZooming
            },
            'chartpanel tool[type=description]': {
                click: this.onDescriptionClick
            },
            '#areapager' : {
                beforechange: this.onPageChange
            },
            '#areapager #onlySelected': {
                toggle: this.onToggleShowSelected
            }
        })
        var me = this;
        $('#sidebar-reports-add').click(function() {
            me.getController('AttributeConfig').onConfigureClick({})
        })

        Highcharts.setOptions({
            lang: {
                thousandsSep: ''
            },
            chart: {
                style: {
                    //fontSize: '12px',
                    fontFamily: '"Open Sans", sans-serif',
                    color: '#000',
                    fontWeight: 'normal'

                }
            }
        })

        Observer.notify('Chart#init');
    },

    onChartExpand: function(panel) {
        window.setTimeout(function() {
            var series = panel.chart.chart.series;
            if (series) {

                for (var i=0;i<series.length;i++) {
                    series[i].show();
                }
            }
        },1)

    },

    onToggleShowSelected: function(btn) {
        var selCtrl = this.getController('Select');
        var areaCtrl = this.getController('Area');
        var onlySel = btn.pressed;
        var count = onlySel ? (selCtrl.overallCount) : (areaCtrl.lowestCount+selCtrl.outerCount);
        Ext.StoreMgr.lookup('paging').setCount(count);
        this.getController('Chart').reconfigure('outer');
    },

    onToggleLegend: function(btn) {
        var chart = btn.up('panel').chart;
        $(btn.el.dom).toggleClass('tool-active');
        chart.legendOn = chart.legendOn ? false : true;
        this.toggleLegendState(chart.chart, chart.legendOn);
    },
    onSwitchZooming: function(btn) {
        var chart = btn.up('panel').chart;
        $(btn.el.dom).toggleClass('tool-active');
        chart.zooming = chart.zooming ? false : true;
    },
    onExportImage: function(btn) {
        var chart = btn.up('panel').chart;
        var chartContainer = $(chart.container.dom);
        var name = chart.cfg && chart.cfg.title ? chart.cfg.title : null;
        var type = chart.cfg && chart.cfg.type ? (chart.cfg.type === "grid" ? "table" : "chart") : null;

        var width = chartContainer.width();
        var height = chartContainer.height();

        var svg;
        // SVG for the Table
        if(type === 'table'){
            var htmlToProcess = chartContainer.clone();
            htmlToProcess.find('[data-qtip]').removeAttr('data-qtip');
            htmlToProcess.find('[class]').removeAttr('class');
            htmlToProcess.find('[style]').removeAttr('style');

            var spans = htmlToProcess.find('span');
            var spansWithText = spans.map(function(index, column){
                return '<th>'+column.textContent+'</th>';
            }).toArray().join(' ');

            htmlToProcess = htmlToProcess.find('table');

            svg = '' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">' +
                '   <style>' +
                '       table {' +
                '           border-collapse: collapse;' +
                '       }' +
                '       ' +
                '       tbody tr:nth-child(odd) {' +
                '           background: #fafafa;' +
                '       }' +
                '' +
                '       td {' +
                '           width: '+ Math.floor((width / spans.length)) +'px' +
                '       }' +
                '' +
                '       thead{' +
                '           background-color: #fcfcfa;' +
                '           font-weight: normal;' +
                '       }' +
                '       ' +
                '       thead th {' +
                '           border: #dcdcdc 1px solid;' +
                '           background-color: #fcfcfa;' +
                '           margin: 0;' +
                '       }' +
                '   </style>' +
                '   <rect width="100%" height="100%" fill="white"/>' +
                '   <foreignObject x="0" y="0" width="'+width+'" height="'+height+'">' +
                '       <div xmlns="http://www.w3.org/1999/xhtml">' +
                '           <table>' +
                '               <thead>' +
                '                   <tr>' +
                spansWithText +
                '                   </tr>' +
                '               </thead>' +
                htmlToProcess.html() +
                '           </table>' +
                '       </div>' +
                '   </foreignObject>' +
                '</svg>';
        } else if(chart.cfg.type === "scatterchart") {
            var texts = chartContainer.find('span');
            var xText = '', yText = '';
            if(texts.length > 1) {
                yText = texts[1].textContent
            }
            if(texts.length > 0) {
                xText = texts[0].textContent
            }

            svg = '' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">' +
                chartContainer.find('svg').html() +
                '   <text x="60" y="'+(height - 5)+'" fill="black">'+xText+'</text>' +
                '   <text x="10" y="-10" fill="black" transform="rotate(90)">'+yText+'</text>' +
                '</svg>';
        } else if(chart.cfg.type === 'polarchart') {
            name = chart.cnt.title;

            svg = '' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">' +
                '   <rect width="100%" height="100%" fill="white"/>' +
                chartContainer.find('svg').html() +
                '</svg>';
        } else {
            svg = '' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">' +
                chartContainer.find('svg').html() +
                '</svg>';
        }

        var data = encodeURIComponent(svg);

        var img = new Image();

        img.onload = function() {
            var canvas = $('<canvas width="'+Number(width)+'" height="'+Number(height)+'"></canvas>')[0];
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            window.Stores.notify('SNAPSHOTS_CREATED', {
                name: name,
                type: type,
                source: canvas.toDataURL()
            });
        };

        img.src = "data:image/svg+xml;utf8," + data;
    },
    onExportCsv: function(btn) {
        var chart = btn.up('panel').chart;
        this.reconfigureChart(chart, true);
    },
    onSaveView: function() {
        var cfg = {};
        cfg.chartCfg = this.gatherCfg();
        cfg.layerCfg = this.getController('Layers').gatherSymbologiesAndOpacities();
        cfg.dataset = Ext.ComponentQuery.query('initialbar #datasetcontainer button[pressed=true]')[0].objId;
        cfg.theme = Ext.ComponentQuery.query('initialbar #themecontainer button[pressed=true]')[0].objId
        cfg.years = Ext.Array.pluck(Ext.ComponentQuery.query('initialbar #yearcontainer button[pressed=true]'), 'objId');
        cfg.visualization = Ext.ComponentQuery.query('initialbar #visualizationcontainer button[pressed=true]')[0].objId
        cfg.expanded = this.getController('Area').getExpandedAndFids().expanded;
        cfg.selMap = this.getController('Select').selMap;
        //cfg.multipleMaps = Ext.ComponentQuery.query('initialbar #multiplemapsbtn')[0].pressed==true;
        Ext.Ajax.request({
            url: Config.url + 'api/urlview/saveView',
            params: {
                cfg: JSON.stringify(cfg)
            },
            scope: this,
            method: 'POST',
            success: function(response) {
                var id = JSON.parse(response.responseText).data;
                var url = window.location.origin + '/index2.html?id=' + id;
                //console.log(url);
            }
        })
    },
    onAfterVisualizationSave: function(formCmp, rec, operation) {
        if (operation.action == 'update') {
            var btn = Ext.ComponentQuery.query('initialbar #visualizationcontainer button[objId=' + rec.get('_id') + ']')[0]
            if (!btn)
                return;
            btn.setText(rec.get('name'));
        }
        else {
            var container = Ext.ComponentQuery.query('initialbar #visualizationcontainer')[0];
            var conf = {text: rec.get('name'), objId: rec.get('_id'), allowDepress: false};
            container.insert(container.items.length - 1, conf);
            var btn = Ext.ComponentQuery.query('initialbar #visualizationcontainer button[objId=' + rec.get('_id') + ']')[0];

            var btns = Ext.ComponentQuery.query('initialbar #visualizationcontainer button');
            for (var i = 0; i < btns.length; i++) {
                btns[i].toggle(false, true);
            }
            btn.toggle(true, true)
        }
    },
    onOpenVisualizationWindow: function(btn) {
        var themeBtn = Ext.ComponentQuery.query('initialbar #themecontainer button[pressed=true]')[0]
        var theme = themeBtn ? themeBtn.objId : null;
        if (!theme)
            return;

        var visualizationStore = Ext.StoreMgr.lookup('visualization4window');
        visualizationStore.clearFilter(true);
        visualizationStore.filter([function(rec) {
            return rec.get('theme') == theme;
        }])
        var window = Ext.WindowManager.get('visualizationwindow');
        window = window || Ext.widget('window', {
            layout: 'fit',
            id: 'visualizationwindow',
            y: 200,
            items: [{
                xtype: 'visualizationform',
                frame: true,
                theme: theme
            }]
        })
        window.show();
    },
    onVisualizationSave: function(btn) {
        var visBtn = Ext.ComponentQuery.query('initialbar #visualizationcontainer button[pressed=true]')[0]
        if (!visBtn)
            return;
        var vis = Ext.StoreMgr.lookup('visualization').getById(visBtn.objId);
        var cfg = this.gatherCfg();
        if (!cfg.length) {
            return false;
        }
        var atMap = this.getController('Layers').gatherSymbologiesAndOpacities();
        vis.set('atMap', atMap);
        vis.set('cfg', cfg);
        vis.save();
    },
    onBeforeVisualizationSave: function(formCmp, rec) {
        if (!rec.stores.length) {
            var cfg = this.gatherCfg();
            if (!cfg.length) {
                return false;
            }
            var atMap = this.getController('Layers').gatherSymbologiesAndOpacities();

            rec.set('atMap', atMap);
            rec.set('cfg', cfg); }
    },
    gatherChartCfg: function(chart, useQueryCfg) {
        chart.cfg.chartId = chart.cfg.chartId || parseInt(Math.random() * 10000000)
        var cfg = useQueryCfg ? {} : Ext.clone(chart.cfg);
        var legendItems = chart.chart && chart.chart.legend && useQueryCfg ? chart.chart.legend.allItems : [];
        if (legendItems.length) {
            cfg.invisibleAttrs = [];
            cfg.invisibleYears = [];

        }
        if (chart.cfg.type == 'grid' && chart.chart && chart.chart.store && useQueryCfg) {
            Ext.apply(cfg,this.getSortParamsFromGrid(chart.chart,true));
        }
        for (var j = 0; j < legendItems.length; j++) {
            var legendItem = legendItems[j];
            if (legendItem.visible)
                continue;
            if (legendItem.as) {
                cfg.invisibleAttrs.push({as: legendItem.as, attr: legendItem.attr})
            }
            else if (legendItem.userOptions.as) {
                cfg.invisibleAttrs.push({as: legendItem.userOptions.as, attr: legendItem.userOptions.attr})
            }
            else if (legendItem.userOptions.year) {
                cfg.invisibleYears.push(legendItem.userOptions.year)
            }
        }
        return cfg
    },
    gatherCfg: function(useQuery) {
        var charts = Ext.ComponentQuery.query('chartbar chartcmp');
        var cfgs = [];
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];
            var cfg = this.gatherChartCfg(chart,useQuery);

            cfgs.push(cfg);
        }
        return cfgs;
    },
    onSaveVis: function(btn) {
        if (!this.activeVis)
            return;
        var cfg = this.gatherCfg();
        this.activeVis.set('cfg', cfg);
        this.activeVis.save();
    },
    loadVisualization: function(visId) {
        var store = Ext.StoreMgr.lookup('visualization');
        var vis = Config.cfg ? null : store.getById(visId);

        var cfg = Config.cfg ? Config.cfg.cfgs : null;
        if (vis) {
            cfg = vis.get('cfg');
        }
        cfg = cfg || [];
        var container = Ext.ComponentQuery.query('chartbar')[0];
        var me = this;
        container.items.each(function(item) {
            if (item.xtype == 'chartpanel') {
                me.onChartRemove(null, item);
            }

        })
        for (var i = 0; i < cfg.length; i++) {
            if (cfg.type != 'filter') {
                if (Config.cfg) {
                    this.addChart(cfg[i].cfg, true,cfg[i].queryCfg);
                }
                else {
                    this.addChart(cfg[i], true);
                }
            }

        }

    },
    onChartAdd: function(btn) {
        var form = btn.up('chartconfigpanel');
        var cfg = form.getForm().getValues();
        this.addChart(cfg);

    },
    addChart: function(cfg, withoutReconfigure, queryCfg) {
        var container = Ext.ComponentQuery.query('chartbar')[0];
        var opts = {
            height: 400,
            width: 575,
            style: {
                //"overflowX": 'hidden ! important'
            },
            layout: 'fit'
        };
        if (cfg.type=='grid') {
            opts.height = 355;
        }
        if (cfg.type == 'extentoutline') {
            opts.layout = {
                type: 'absolute'
            }
            //opts.height = null;
        }
        if (cfg.type=='grid') {
            var hasGrid = false;
            container.items.each(function(item) {
                if (item.chart && item.chart.cfg.type=='grid') {
                    hasGrid = true;
                    return false;
                }
            })
            if (hasGrid) {
                opts.disableSort = true;
            }
        }
        var chart = Ext.widget('chartcmp', opts);
        var items = [chart];


        var cnt = Ext.widget('chartpanel', {
            title: cfg.title || (polyglot.t('anonymous') + cfg.type),
            cfgType: cfg.type,
            iconCls: 'cmptype-'+cfg.type,
            layout: {
                type: 'fit',
                reserveScrollbar: true
            },
            items: items
        })
        container.add(container.items.length, cnt);
        chart.cfg = cfg;
        chart.queryCfg = queryCfg;
        chart.cnt = cnt;
        cnt.chart = chart;
        if (!withoutReconfigure) {
            this.reconfigureChart(chart, false, true);
        }
    },
    onChartRemove: function(btn, panel) {
        var panel = btn ? btn.up('panel') : panel;
        if (panel.chart.chart && panel.chart.chart.renderTo) {
            panel.chart.chart.destroy();

            // remove from exchangeParams#Charts
            if (panel.chart.chart.id){
                delete window.Charts.polar[panel.chart.chart.id];
            }
        }
        panel.destroy();
    },
    toggleLegendState: function(chart, on) {
        var id = chart.container.id;
        var selector = '#' + id + ' .highcharts-legend';
        if (on) {
            $(selector).show();
        }
        else {
            $(selector).hide();
        }
    },
    onChartReconfigure: function(btn) {
        var form = btn.up('chartconfigpanel');
        var cfg = form.getForm().getValues();
        form.chart.cfg = cfg;
        this.reconfigureChart(form.chart);
    },
    getChartWindowConfig: function(chart, reconfiguring, type) {
        var datasetId = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var dataset = Ext.StoreMgr.lookup('dataset').getById(datasetId);
        var areaTemplates = dataset.get('featureLayers');
        var store = Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            filters: [function(rec) {
                return Ext.Array.contains(areaTemplates, rec.get('_id'));
            }],
            model: 'Puma.model.AreaTemplate'
        })
        store.load();
        var cfg = {
            layout: 'fit',
            y: 200,
            items: [{
                xtype: type,
                areaTemplateStore: store,
                chart: chart,
                reconfiguring: reconfiguring
            }]
        }
        if (!reconfiguring) {
            cfg['closeAction'] = 'hide'
            cfg['id'] = 'new' + type
        }
        return cfg;
    },

    reconfigureChart: function(chartCmp, forExport, addingNew, fromConfigPanel) {
        var cfg = chartCmp.cfg;
        var chartPanel = chartCmp.up('chartpanel');
        chartPanel.cfgType = cfg.type;
        chartPanel.updateToolVisibility();
        if (cfg.type=='piechart') {
            //debugger;
        }
        if (cfg.type=='columnchart'){
            if (cfg.stackingSettings){
                cfg.stacking = cfg.stackingSettings;
            }
            if (cfg.aggregateSettings){
                cfg.aggregate = cfg.aggregateSettings;
            }
        }
        var queryCfg = Ext.apply(chartCmp.queryCfg || {},chartCmp.cfg,this.gatherChartCfg(chartCmp,true));
        var areas = {};
        if (cfg.type != 'extentoutline') {
            areas = Ext.clone(this.getController('Area').lowestMap);
        }
        var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;


        if (cfg.title && fromConfigPanel) {
            chartCmp.up('chartpanel').setTitle(cfg.title)
        }
        queryCfg.areas = areas;

        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        if (!years.length)
            return;
        queryCfg.years = years;

        if (!queryCfg.years) {
            queryCfg.years = [];
        }
        if (!queryCfg.years.length) {
            queryCfg.years = [queryCfg.years]
        }

        if (Ext.Array.contains(['grid','columnchart','piechart','scatterchart', 'polarchart'],cfg.type)) {
            var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
            if (onlySel) {
                queryCfg.areas = [];
            }
        }
        if (Ext.Array.contains(['grid','columnchart','piechart'],cfg.type)) {
            Ext.apply(queryCfg,this.getPagingParams());
        }
        if (cfg.type=='scatterchart') {
            delete queryCfg['start'];
            delete queryCfg['limit'];
        }
        if (cfg.type=='extentoutline' || cfg.type == 'scatterchart' || cfg.type == 'polarchart') {
            var selectedAreas = this.getSelectedAreas()
            queryCfg.selectedAreas = JSON.stringify(selectedAreas.selectedAreas);
            queryCfg.defSelectedArea = JSON.stringify(selectedAreas.defArea);
        }
        var params = this.getParams(queryCfg);
        chartCmp.queryCfg = queryCfg;
        if (forExport) {
            this.handleExport(chartCmp,params);
            return;

        }
        if (queryCfg['start']<0) {
            this.onChartReceived({cmp:chartCmp});
            return;
        }
        Ext.Ajax.request({
            url: Config.url + 'api/chart/getChart',
            params: params,
            scope: this,
            //method: 'GET',
            cmp: chartCmp,
            success: forExport ? null : this.onChartReceived,
            failure: forExport ? null : this.onChartReceived
        })
        //this.getController('Layers').onChartReconfigure(chartCmp, params);
    },



    getSelectedAreas: function() {
        var selectedAreas = [];
        var selMap = this.getController('Select').selMap;
        var defColor = this.getController('Select').defaultColor;
        var colors = [];
        var picker = Ext.ComponentQuery.query('#useselectedcolorpicker')[0];
        var onlySelected = Ext.ComponentQuery.query('#onlySelected')[0].pressed;
        var selectColors = picker.xValue || picker.value;
        selectColors = Ext.isArray(selectColors) ? selectColors : [selectColors]
        for (var color in selMap) {
            if (!Ext.Array.contains(selectColors,color) && onlySelected) {
                continue;
            }
            colors.push(color);
        }
        var selMaps = [];
        var map = {};
        var defMap = null;
        for (var i = 0; i < colors.length; i++) {

            var actualMap = selMap[colors[i]];
            if (actualMap && actualMap.length) {
                selMaps.push(actualMap);
                if (colors[i]==defColor) {
                    defMap = actualMap;
                }
            }

        }
        var defArea = null;
        for (var i = 0; i < selMaps.length; i++) {
            var selMap = selMaps[i];
            var map = {};
            for (var j = 0; j < selMap.length; j++) {
                var at = selMap[j].at;
                var gid = selMap[j].gid;
                var loc = selMap[j].loc;
                map[loc] = map[loc] || {};
                map[loc][at] = map[loc][at] || [];
                map[loc][at].push(gid);
                if (selMap==defMap && !defArea) {
                    defArea = {
                        loc: loc,
                        at: at,
                        gid: gid
                    }

                }
            }
            selectedAreas.push(map);
        }
        return {selectedAreas:selectedAreas,defArea:defArea};
    },

    handleExport: function(chartCmp, params) {
        params = Ext.clone(params);
        delete params.start;
        delete params.limit;
        var items = [{
            xtype: 'filefield',
            name: 'file'
        }];
        for (var key in params) {
            items.push({
                xtype: 'textfield',
                name: key,
                value: params[key]
            })
        }
        var form = Ext.widget('form', {
            items: items
        });
        form.getForm().submit({
            url: Config.url + 'api/chart/getGridDataCsv',
            success: function() {
            },
            failure: function() {
            }
        });
        return;
    },
    getParams: function(queryCfg) {
        var params = {};
        //commented by Jonas, Feb. 2016
        //var keysToJson = ['areas', 'attrs', 'years', 'classConfig', 'areaTemplates', 'oldAreas', 'invisibleAttrs', 'invisibleYears', 'activeFilters', 'activeSorters'];
        for (var key in queryCfg) {
            if (Ext.isObject(queryCfg[key]) || Ext.isArray(queryCfg[key])) {
                params[key] = JSON.stringify(queryCfg[key])
            }
            else {
                params[key] = queryCfg[key]
            }
        }
        return params;
    },
    onOutlineReceived: function(data, cmp) {
        cmp.removeAll();
        cmp.layout = {
            type: 'absolute'
        }
        cmp.getLayout();
        data.layerRefs = data.layerRefs || [];
        var l = data.layerRefs.length
        //var anchor = data.layerRefs.length==1 ? '100% 100%' : '45% 100%';
        //anchor = data.layerRefs.length<3 ? anchor : '45% 45%'
        var width = l==1 ? 550 : 264;
        var height = l<3 ? 300 : 140;
        var colorMap = data.colorMap || this.getController('Select').colorMap;
        cmp.mapNum = data.layerRefs.length;
        for (var i = 0; i < data.layerRefs.length; i++) {

            var layerRefs = data.layerRefs[i];
            var item = layerRefs.item;
            var color = (colorMap[item.loc] && colorMap[item.loc][item.at]) ?  colorMap[item.loc][item.at][item.gid] : null;
            if (!color) continue;
            var rows = data.rows[i];
            var anchor = '100% 100%'
            var x = 0;
            var y = 0;

            if (i==0 && l>1) {
                anchor = '50% 100%';
            }
            if (i==0 && l>2) {
                anchor = '50% 49%'
            }
            if (i==1) {
                anchor = '100% 100%';
                if (l>2) {
                    anchor = '100% 49%';
                }
                x = 285;
            }
            if (i==2) {
                y = 200;
                anchor = '50% 100%'
            }


            if (i==3) {
                x = 285;
                y = 200;
            }
            cmp.add({
                xtype: 'component', color: color, type: 'extentoutline', cls:i==0 ? 'extentoutline-first' : 'extentoutline-notfirst' ,opacity: data.opacity, width: width, height: height, anchor: anchor, x: x, y: y, layerRefs: layerRefs, rows: rows, colSpan: data.layerRefs==1 ? 2 : 1
            })
        }

    },

    createSelectAreaChart: function(cmp) {

        var cfg = {
            chart: {
                renderTo: cmp.el.dom
            },
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            labels: {items: [{
                    html: polyglot.t('pleaseSelectAreas'),
                    style: {
                        left: '125px',
                        top: '180px',
                        fontSize: 34,
                        fontFamily: '"Open Sans", sans-serif',
                        color: '#777777'

                    }
                }]}};


        var chart = new Highcharts.Chart(cfg);
        cmp.chart = chart;
        chart.cmp = cmp;
    },

    hideChart: function(cmp) {
        cmp.up().hide();
    },

    showChart: function(cmp) {
        // Show chart only when there is something to show therefore ignoring this piece in printing.
        cmp.up() && cmp.up().show();
    },

    onChartReceived: function(response) {
        var cmp = response.cmp || response.request.options.cmp;

        // call legacy HighCharts function
        // TODO add charts to Charts in the legacy function too?
        if(['columnchart', 'piechart', 'grid', 'scatterchart', 'extentoutline'].includes(cmp.cfg.type)){ // TODO dopsat typy
            return this.onChartReceived_highcharts(response);
        }

        // D3.js charts:
        // create new record in exchangeParams


        // todo check if exists, if not -> add
        // todo if yes -> rebuild with data

        var chartType = cmp && cmp.cfg ? cmp.cfg.type : null;

        if (chartType === "polarchart"){
            var chartUuid = cmp.chart ? cmp.chart.id : null;
            var alreadyExists = !!window.Charts.polar[chartUuid];
            var data = response.responseText ? JSON.parse(response.responseText).data : null;

            if (!alreadyExists){
                // destroy another type of chart in this panel
                if (cmp.chart){
                    cmp.chart.destroy();
                }
                window.Stores.notify("chartContainer#addPolarChart", {
                    containerComponent: cmp
                });
            }

            if (data && !data.noData){
                // at this point, we have cmp.chart again
                window.Stores.notify("polarChart#rebuildWithData", {
                    id: cmp.chart.id,
                    data: data
                });

                // according to the number of columns(axes), set the height of chart panel
                var numberOfAxes = data.chartData && data.chartData[0] ? data.chartData[0].length : 0;
                if (numberOfAxes > 3){
                    cmp.ownerCt.setHeight(450);
                } else {
                    cmp.ownerCt.setHeight(390);
                }
            }
        }
    },

    onChartReceived_highcharts: function(response) {
        console.info('Chart#onChartReceived_highcharts response:', response);
        var cmp = response.cmp || response.request.options.cmp;

        // remove old chart
        if (cmp.chart) {
            try {
                cmp.chart.destroy();
                if (window.Charts.polar[cmp.chart.id]){
                    let element = cmp.getEl();
                    if (element && element.dom){
                        $("#" + element.dom.id).find("svg").remove();
                    }
                    cmp.chart = null;
                    delete window.Charts.polar[cmp.chart.id];
                }
            } catch (e) {
                console.warn('Chart#onChartReceived Not possible to destroy chart. Error: ', e);
            }
        }

        // get and parse graph data
        var data = response.responseText ? JSON.parse(response.responseText).data : null;
        if (cmp.queryCfg.type == 'filter') {
            //this.onFilterReceived(data, cmp)
            return;
        }

        // create NoData chart
        console.log('Chart#onChartReceived Response', response, ' CMP: ', cmp);
        if (!data || data.noData) {
            if(cmp.chart && cmp.chart.type == 'extentoutline') {
                this.createSelectAreaChart(cmp);
            } else {
                this.hideChart(cmp);
            }
            return;
        }

        this.showChart(cmp);

        var isThereTooManyPoints = false, xUnits = null, yUnits = null, zUnits = null, xName = null, yName = null, zName = null, points = [];
        // Make sure that the results are Numbers.
        if(data.series) {
            data.series.forEach(function(serie) {
                if(serie.data && serie.data.length < 1000) {
                    serie.data.forEach(function(dataItem){
                        points.push(dataItem);

                        xUnits = dataItem.xUnits;
                        yUnits = dataItem.yUnits;
                        zUnits = dataItem.zUnits;

                        xName = dataItem.xName;
                        yName = dataItem.yName;
                        zName = dataItem.zName;

                        if(dataItem.x) {
                            dataItem.x = Number(dataItem.x);
                        }
                        if(dataItem.y) {
                            dataItem.y = Number(dataItem.y);
                        }
                        if(dataItem.z) {
                            dataItem.z = Number(dataItem.z);
                        }
                    })
                } else {
                    isThereTooManyPoints = true;
                    serie.data = serie.data.map(function(dataItem){
                        points.push(dataItem);

                        xUnits = dataItem.xUnits;
                        yUnits = dataItem.yUnits;
                        zUnits = dataItem.zUnits;

                        xName = dataItem.xName;
                        yName = dataItem.yName;
                        zName = dataItem.zName;

                        var point = [];

                        if(dataItem.x) {
                            point.push(Number(dataItem.x));
                        }
                        if(dataItem.y) {
                            point.push(Number(dataItem.y));
                        }
                        if(dataItem.z) {
                            point.push(Number(dataItem.z));
                        }
                        point.push({
                            at: Number(dataItem.at),
                            loc: Number(dataItem.loc),
                            gid: Number(dataItem.gid)
                        });
                        return point;
                    })
                }
            });
        }

        var singlePage = response.request.options.singlePage;
        //var legendBtn = singlePage ? Ext.widget('button') : Ext.ComponentQuery.query('#legendbtn', cmp.ownerCt)[0];

        cmp.noData = false;

        if (Ext.Array.contains(['extentoutline'], cmp.cfg.type)) {
            if (singlePage) {
                data.colorMap = JSON.parse(response.request.options.params.colorMap)
            }
            this.onOutlineReceived(data, cmp);
            return;
        }

        cmp.layout = {
            type: 'fit'
        };
        cmp.getLayout();

        //if (!Ext.Array.contains(['grid', 'featurecount'], cmp.cfg.type)) {
        //    legendBtn.show();
        //}

        var isGrid = cmp.queryCfg.type == 'grid';
        if (isGrid) {
            this.onGridReceived(response);
            return;
        }

        data.chart.events = {};
        var me = this;
        data.chart.events.selection = function(evt) {
            me.onScatterSelected(evt, points);
        };
        data.chart.events.click = function(evt) {
            if (Config.contextHelp) {
                PumaMain.controller.Help.onHelpClick({
                    stopPropagation: function() {},
                    preventDefault: function() {},
                    currentTarget: cmp.el
                });
            }
        };

        data.tooltip.formatter = function() {
            var obj = this;
            var type = obj.series.type;
            var attrConf = [];
            var yearName = '';
            var areaName = '';
            if (type=='column') {
                areaName = obj.x;
                yearName = obj.point.yearName;
                attrConf.push({
                    name: obj.series.name,
                    val: obj.y,
                    units: obj.point.units
                });
            }
            else if (type=='pie') {
                areaName = obj.series.name;
                yearName = obj.series.userOptions.yearName;
                attrConf.push({
                    name: obj.point.swap ? polyglot.t('other') : obj.key,
                    val: obj.y,
                    units: obj.point.units
                });
            }
            else {
                areaName = obj.key;
                yearName = obj.series.name;
                attrConf.push({
                    name: yName,
                    val: obj.point.y,
                    units: yUnits
                });
                attrConf.push({
                    name: xName,
                    val: obj.point.x,
                    units: xUnits
                });
                if (obj.point.zName) {
                    attrConf.push({
                        name: zName,
                        val: obj.point.z,
                        units: zUnits
                    });
                }
            }
            return me.getTooltipHtml(areaName,yearName,attrConf);
        };
        data.plotOptions = data.plotOptions || {series: {events: {}}};

        data.plotOptions.series.events.click = function(evt) {
            if (Config.contextHelp) {
                PumaMain.controller.Help.onHelpClick({
                    stopPropagation: function() {},
                    preventDefault: function() {},
                    currentTarget: this.chart.cmp.el
                });
                return;
            }
            me.onPointClick(this.chart.cmp, evt, false);
        };
        if (cmp.cfg.type == 'piechart') {
            data.plotOptions.series.events.mouseOver = function(evt) {
                me.onPointClick(this.chart.cmp, evt, true);
            }
        }
        else if (cmp.cfg.type != 'featurecount') {
            data.plotOptions.series.point.events.mouseOver = function(evt) {
                me.onPointClick(this.series.chart.cmp, evt, true);
            };
            if (cmp.cfg.type == 'scatterchart') {
                data.plotOptions.series.point.events.mouseOut = function(evt) {
                    $('path[linecls=1]').hide();
                }
            }
        }

        if (cmp.cfg.type == 'piechart') {
            data.plotOptions.pie.point.events.legendItemClick = function(evt) {
                evt.preventDefault();
                var isSingle = this.series.chart.options.chart.isPieSingle;
                if (!isSingle) {
                    me.onLegendToggle(this);
                }
            }
        }

        if (cmp.cfg.type === 'columnchart'){
            cmp.ownerCt.setHeight(450);
        } else {
            cmp.ownerCt.setHeight(400);
        }

        data.exporting = {
            enabled: false
        };

        data.chart.renderTo = cmp.el && cmp.el.dom;

        data.chart.events.load = function() {
            if (this.options.chart.isPieSingle) {
                var chart = this;
                var rend = chart.renderer;
                for (var i=0;i<chart.series.length;i++) {
                    var serie = chart.series[i];
                    var left = chart.plotLeft + serie.center[0];
                    var top = chart.plotTop + serie.center[1]+serie.options.pieFontShift;
                    var text = rend.text(serie.options.pieText, left, top)
                        .attr({
                            'style': '',
                            'text-anchor': 'middle',
                            'font-size': serie.options.pieFontSize,
                            'fill': serie.options.pieFontColor
                        })
                        .add();
                }
            }
            if (cmp.cfg.scrollLeft && singlePage) {
                $('.x-container').scrollLeft(cmp.cfg.scrollLeft);
                $('.x-container').css('overflow','hidden');
            }
            if (singlePage) {
                console.log('loadingdone');
            }
        };
        if (singlePage) {
            for (var i = 0; i < data.series.length; i++) {
                data.series[i].animation = false;
            }
        }

        this.setLabelsView(data);

        var chart = new Highcharts.Chart(data);

        cmp.chart = chart;
        chart.cmp = cmp;
        var panel = cmp.ownerCt;
        if (!singlePage) {
            me.toggleLegendState(chart, cmp.legendOn);
        }
        this.colourChart(cmp);
    },

    /**
     * Set view of chart labels
     * @param data {Object}
     */
    setLabelsView: function(data){
        // set labels for pie chart
        if (data.labels.hasOwnProperty("items")){
            var items = data.labels.items;
            this.setPieChartLabels(items);
        } else if (data.hasOwnProperty("xAxis") && data.xAxis.hasOwnProperty("labels")){
            data.xAxis.labels.formatter = function () {
                var label = this.axis.defaultLabelFormatter.call(this);
                if (label.length > 15){
                    label = label.slice(0, 13) + "...";
                }
                return label;
            };
        }
    },

    /**
     * Set pie chart labels view
     * @param labels {Array}
     */
    setPieChartLabels: function(labels){
        var count = labels.length;
        labels.forEach(function(label){
            var text = label.html;
            if (count <= 3){
                if (text.length > 25){
                    label.html = text.slice(0, 23) + "...";
                }
            }
            if (count > 3 && count <= 8){
                label.style.fontSize = "11px";
                if (text.length > 22){
                    label.html = text.slice(0, 20) + "...";
                }
            } else if (count > 8) {
                label.style.fontSize = "11px";
                if (text.length > 15){
                    label.html = text.slice(0, 13) + "...";
                }
            }
        });
    },

    uuid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    onDescriptionClick: function(icon){
        var chart = icon.up('panel').chart;
        var button = $(icon.el.dom);
        button.toggleClass('tool-active');

        window.Stores.notify("chart#toggleDescription", {
            icon: button,
            chart: chart
        });
    },

    onLegendToggle: function(point) {
        var as = point.as;
        var attr = point.attr;
        var chart = point.series.chart;
        var series = chart.series;
        for (var i = 0; i < series.length; i++) {
            var serie = series[i];
            for (var j = 0; j < serie.data.length; j++) {
                var point = serie.data[j];
                if (point.attr == attr && point.as == as) {
                    serie.isDirty = true;
                    point.setVisible();
                    break;
                }
            }
        }
        chart.redraw();

    },
    onPointClick: function(cmp, evt, hovering) {
        if (hovering && !this.hovering && cmp.cfg.type != 'scatterchart')
            return;
        var at = null;
        var gid = null;
        var loc = null;
        if (cmp.cfg.type == 'piechart') {
            var serie = hovering ? evt.target : evt.point.series;
            at = serie.options.at;
            loc = serie.options.loc;
            gid = serie.options.gid;
        }
        else {
            var point = evt.point || evt.target;
            at = point ? point.at : null;
            gid = point ? point.gid : null;
            loc = point ? point.loc : null;
        }
        if (!at || !gid || !loc){
            var target = evt.point || evt.target;
            if (target && target.series && target.series.options && target.series.options.data){
                let data = target.series.options.data;
                data.forEach(function(point){
                    if (target.options.x === point[0] && target.options.y === point[1]){
                        let opt = point[3];
                        if (opt){
                            at = opt.at;
                            gid = opt.gid;
                            loc = opt.loc;
                        }
                    }
                });
            }
        }
        if (!at || !gid || !loc)
            return;
        if (!this.hovering && hovering && cmp.cfg.type == 'scatterchart') {
            var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
            if (years.length<2) return;
            $('path[linecls=1]').hide();
            if (point.yearLines) {
                for (var i = 0; i < point.yearLines.length; i++) {
                    $(point.yearLines[i].element).show();
                    point.yearLines[i].toFront();
                }
            }
            else {
                var points = [];
                for (var i = 0; i < cmp.chart.series.length; i++) {
                    points = Ext.Array.merge(points, cmp.chart.series[i].points);
                }
                for (var i = 0; i < points.length; i++) {
                    var iterPoint = points[i];
                    if (point == iterPoint) {
                        continue;
                    }
                    if (point.at == iterPoint.at && point.gid == iterPoint.gid && point.loc == iterPoint.loc) {
                        var xPlus = point.graphic.renderer.plotBox.x;
                        var yPlus = point.graphic.renderer.plotBox.y;
                        var line = point.graphic.renderer.path(['M', point.plotX + xPlus, point.plotY + yPlus, 'L', iterPoint.plotX + xPlus, iterPoint.plotY + yPlus])
                            .attr({
                                'stroke-width': 2,
                                linecls: 1,
                                stroke: '#888'
                            })

                        line.add();
                        line.toFront();
                        point.yearLines = point.yearLines || [];
                        point.yearLines.push(line)
                    }
                }
            }
            if (!this.hovering) {
                return;
            }
        }
        var areas = [{at: at, gid: gid, loc: loc, index: 1}];
        var add = evt.originalEvent ? evt.originalEvent.ctrlKey : evt.ctrlKey;
        var fromChart = cmp.cfg.type=='grid' || cmp.cfg.type=='piechart' || cmp.cfg.type=='columnchart';
        //this.
        if (!Config.exportPage) {
            this.getController('Select').fromChart = fromChart;
            this.getController('Select').select(areas, add, hovering);
        }
        evt.preventDefault();
    },
    onScatterSelected: function(evt, pointsOriginal) {
//        var zooming = Ext.ComponentQuery.query('#switchzoomingbtn',evt.target.cmp.cnt)[0].pressed

        var chart = evt.target.cmp;
        var zooming = chart.zooming;
        if (zooming || !evt.xAxis) {
            return true;

        }
        var xAxis = evt.xAxis[0];
        var yAxis = evt.yAxis[0];
        var xMin = xAxis.min;
        var yMin = yAxis.min;
        var xMax = xAxis.max;
        var yMax = yAxis.max;
        var atGids = [];
        var points = [];
        for (var i = 0; i < xAxis.axis.series.length; i++) {
            points = Ext.Array.merge(points, xAxis.axis.series[i].points);
        }
        var areas = [], pointOriginal;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if(pointsOriginal.length > 0) {
                pointOriginal = pointsOriginal[i];
            }

            if (point.x > xMin && point.x < xMax && point.y > yMin && point.y < yMax) {
                var atGid = pointOriginal.at + '_' + pointOriginal.gid + '_' + pointOriginal.loc;
                if (!Ext.Array.contains(atGids, atGid)) {
                    areas.push({at: pointOriginal.at, gid: pointOriginal.gid, loc: pointOriginal.loc});
                    atGids.push(atGid)
                }
            }
        }
        var add = evt.originalEvent.ctrlKey;
        if (!Config.exportPage) {

            this.getController('Select').fromScatterChart = true;
            this.getController('Select').select(areas, add, false);
        }
        evt.preventDefault();
    },

    getPagingParams: function() {
        var store =  Ext.StoreMgr.lookup('paging');
        var page = store.currentPage;
        var chartCmps = Ext.ComponentQuery.query('chartcmp');

        var grid = Ext.ComponentQuery.query('grid[isGrid]')[0];
        var params = {
            start: store.pageSize*(page-1),
            limit: store.pageSize
        }
        if (grid) {
            var sortParams = this.getSortParamsFromGrid(grid);
            Ext.apply(params,sortParams);
        }
        else {
            for (var i=0;i<chartCmps.length;i++) {
                var cmp = chartCmps[i]
                if (cmp.cfg.type=='grid') {
                    grid = cmp;
                    break;
                }

            }
            if (grid && grid.queryCfg) {
                params['sort'] = Ext.isString(grid.queryCfg.sort) ? grid.queryCfg.sort : JSON.stringify(grid.queryCfg.sort)
                params['sortNorm'] = Ext.isString(grid.queryCfg.sortNorm) ? grid.queryCfg.sortNorm : JSON.stringify(grid.queryCfg.sortNorm)
            }
            else {
                params['sort'] = null;
            }
        }


        var selectedAreas = this.getSelectedAreas();
        params['selectedAreas'] = JSON.stringify(selectedAreas.selectedAreas);
        params['defSelectedArea'] = JSON.stringify(selectedAreas.defArea);
        return params;
    },

    getSortParamsFromGrid: function(grid,dontStringify) {
        var params = {};
        var sorters = grid.store.sorters;
        var sortProps = [];
        var cfg = grid.cmp.cfg;
        var sortAs = null;
        var sortAttr = null;
        sorters.each(function(sorter) {
            sortProps.push({
                property: sorter.property,
                direction: sorter.direction
            })
            if (sorter.property!='name') {
                sortAs = sorter.property.split('_')[1]
                sortAttr = sorter.property.split('_')[3];
            }
        })
        if (sortAs) {
            for (var i=0;i<cfg.attrs.length;i++) {
                var attr = cfg.attrs[i];
                if (attr.as == sortAs && attr.attr == sortAttr) {
                    params['sortNorm'] = dontStringify ? attr : JSON.stringify(attr);
                }
            }
        }

        if (sortProps.length) {
            params['sort'] = dontStringify ? sortProps : JSON.stringify(sortProps)
        }
        else {
            params['sort'] = null;
        }
        return params;
    },

    onGridReceived: function(response) {
        var me = this;
        var data = JSON.parse(response.responseText).data;
        var cmp = response.request.options.cmp;
        var sorters = response.request.options.params['sort'] ? JSON.parse(response.request.options.params['sort']) : [];
        var store = Ext.create('Ext.data.Store', {
            fields: data.fields,
            autoLoad: false,
            cmp: cmp,
            // vypnuto defaultni sortovani, rizeno pouze extraParams
            doSort: function() {},
            sorters: sorters,
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                url: Config.url + 'api/chart/getGridData',
                getMethod: function() {
                    return 'POST'
                },
                extraParams: response.request.options.params
            }
        });
        store.on('load',function(st,records,successful) {
            if (!successful || !records || !records.length) {
                this.onChartReceived({cmp:st.cmp});
            }
        },this)

        var selectController = this.getController('Select');
        var me = this;
        for (var i=0;i<data.columns.length;i++) {
            var column = data.columns[i];
            column.menuDisabled = true;
            column.resizable = false;
            // column.sortable = cmp.disableSort!==true;
            column.sortable=true;
            column.text = column.text + " (" + column.yearName + ")";
            column.width = 100;
            if (column.dataIndex=='name') {
                if (data.columns.length>4) {
                    column.locked = true;
                    column.width = 160;
                    column.flex = null;

                }
                continue;
            }
            column.renderer = function(val,metadata,rec,rowIndex,colIndex) {
                var columns = this.view.getGridColumns();
                var column = columns[colIndex];
                var attrConf = [{
                    name: column.fullName,
                    val: val,
                    units: column.units,
                    text: column.text + "a"
                }];
                var html = me.getTooltipHtml(rec.get('name'),column.yearName,attrConf);
                metadata.tdAttr = 'data-qtip="' + html + '"';
                return me.formatVal(val);
            };

        }
        data.columns[0].text = polyglot.t(data.columns[0].dataIndex);
        var grid = Ext.widget('grid', {
            renderTo: cmp.el,
            height: '100%',
            header: false,
            store: store,
            isGrid: true,
            title: cmp.cfg.title,
            //frame: true,
            //padding: 10,
            viewConfig: {
                getRowClass: function(record, rowIndex, rowParams, store) {
                    var colorMap = cmp.cfg.colorMap || selectController.colorMap;
                    var at = record.get('at');
                    var gid = record.get('gid');
                    var loc = record.get('loc');
                    var color = '';
                    if (colorMap[loc] && colorMap[loc][at]) {
                        color = colorMap[loc][at][gid] || '';
                    }
                    return color ? ('select_' + color) : ''
                }
            },
            columns: data.columns
        })
        store.load();
        var singlePage = response.request.options.singlePage
        store.on('load',function() {
            if (cmp.queryCfg.scrollLeft && singlePage) {
                $('.x-grid .x-grid-with-row-lines:not(.x-grid-inner-locked) .x-grid-view').scrollLeft(cmp.queryCfg.scrollLeft);
                $('.x-grid .x-grid-with-row-lines:not(.x-grid-inner-locked) .x-grid-view').css('overflow','hidden');
            }
            window.setTimeout(function() {
            }, 200)
        })
        cmp.chart = grid;
        grid.cmp = cmp;
        cmp.relayEvents(grid, ['beforeselect', 'itemclick', 'itemmouseenter']);
        grid.on('sortchange',function() {
            me.reconfigure('page');
        })
        var attrs = JSON.parse(response.request.options.params['attrs']);
        var years = JSON.parse(response.request.options.params['years']);
        grid.view.on('viewready', function() {
            if (years.length*attrs.length<5)
                grid.view.el.setStyle ({
                    overflow: 'hidden'
                })
        })

    },

    getTooltipHtml: function(areaName,yearName,attrConf) {
        var html = areaName+' ('+yearName+')';
        for (var i=0;i<attrConf.length;i++) {
            html += '<br/>'
            var conf = attrConf[i];
            html += conf.name+': '
            html +=  '<b>'+this.formatVal(conf.val)+'</b> ';
            html += conf.units
        }
        return html;
    },
    formatVal: function(val) {
        if (typeof val === "string"){
            return val;
        } else if (typeof val === "number"){
            val = Number(val);
            if (this.isInt(val)) return val;
            var deci = 3;
            if (val>1) deci = 2;
            if (val>100) deci = 1;
            if (val>10000) deci = 0;
            return val!=null ? val.toFixed(deci) : val;
        } else if (!val){
            return polyglot.t('noData');
        }
    },
    isInt: function(value) {
        return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10));
    },

    onPageChange: function() {
        var me = this;
        window.setTimeout(function() {
            me.reconfigure('page');
        },1)

    },

    reconfigure: function(type) {
        var charts = Ext.ComponentQuery.query('chartcmp');
        var selCtrl = this.getController('Select')
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];
            if (type=='immediate') {
                this.colourChart(chart);
            }
            else if (Ext.Array.contains(['expand'],type)) {
                this.reconfigureChart(chart);
            }

            else if (Ext.Array.contains(['outerscatter'],type) && chart.cfg.type!='scatterchart') {
                this.reconfigureChart(chart);
            }
            else if (Ext.Array.contains(['outer'],type)) {
                this.reconfigureChart(chart);
            }
            else if (chart.cfg.attrs && chart.cfg.attrs.length && chart.cfg.attrs[0].normType=='select' && selCtrl.actualColor==selCtrl.defaultColor) {
                this.reconfigureChart(chart);
            }
            else if (type=='inner' && chart.cfg.type == 'extentoutline') {
                this.reconfigureChart(chart);
            }
            else if (Ext.Array.contains(['page','sort'],type) && Ext.Array.contains(['piechart','columnchart'],chart.cfg.type)) {
                this.reconfigureChart(chart);
            }
            else if (type == 'page' && chart.cfg.type == 'grid') {
                var store = chart.chart.store;
                var pagingParams = this.getPagingParams();
                Ext.apply(store.proxy.extraParams,pagingParams);

                var keys = store.sorters.keys;
                if (keys.length){
                    var sortAttr = store.sorters.map[keys[0]];
                    var sortAttrAdjusted = [{
                        direction: sortAttr.direction,
                        property: sortAttr.property
                    }];
                    if (!store.proxy.extraParams.sort){
                        store.proxy.extraParams.sort = JSON.stringify(sortAttrAdjusted);
                    }
                }
                store.load();
            }
        }
    },
    reconfigureAll: function(justMap) {
        var charts = Ext.ComponentQuery.query('chartcmp');
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];
            this.reconfigureChart(chart, false);
        }
    },
    colourChart: function(chart) {
        if (!chart.chart || chart.cfg.type == 'featurecount')
            return;
        if (chart.cfg.type == 'grid') {
            try {
                chart.chart.getView().refresh();
            }
                // problems with refreshing empty grid
            catch(err) {}
            return;
        }
        if (!chart.chart.hasRendered || !chart.chart.series.length) {
            return;
        }
        var colorMap = chart.cfg.colorMap || this.getController('Select').colorMap;
        if (chart.cfg.type == 'piechart') {
            for (var i = 0; i < chart.chart.series.length; i++) {
                var serie = chart.chart.series[i];
                var at = serie.options.at;
                var gid = serie.options.gid;
                var loc = serie.options.loc
                var color = null;
                if (colorMap[loc] && colorMap[loc][at]) {
                    color = colorMap[loc][at][gid] ? ('#' + (colorMap[loc][at][gid])) : null;
                }
                var elem = serie.borderElem;
                if (color) {
                    if (!elem) {
                        var bbox = serie.group.getBBox();
                        var center = serie.userOptions.center;
                        var size = serie.userOptions.size
                        //elem = chart.chart.renderer.rect(bbox.x - 1, bbox.y + 37, bbox.width+4, bbox.height+4, 2)
                        elem = chart.chart.renderer.rect(center[0] - size / 2 + 8, center[1] - size / 2 + 18, size + 24, size + 24, 2)
                    }
                    elem.attr({
                        'stroke-width': 3,
                        stroke: color,
                        zIndex: 1
                    }).add();
                    //elem.toFront();
                    serie.borderElem = elem;
                }
                else {
                    if (elem) {
                        elem.destroy();
                    }
                    serie.borderElem = null;
                }

            }
        }
        if (chart.cfg.type == 'columnchart') {
            var data = chart.chart.series[0].data;
            var labels = chart.chart.xAxis[0].labelGroup.element.childNodes;
            for (var i = 0; i < data.length; i++) {
                var at = data[i].at;
                var gid = data[i].gid;
                var loc = data[i].loc
                var color = null;
                if (colorMap[loc] && colorMap[loc][at]) {
                    color = colorMap[loc][at][gid] ? ('#' + (colorMap[loc][at][gid])) : null;
                }
                var elem = data[i].borderElem;
                if (color) {
                    if (!elem) {
                        var bbox = labels[i].getBBox();
                        var elem = chart.chart.renderer.rect(bbox.x - 1, bbox.y + 1, bbox.width + 3, bbox.height - 1, 2)
                    }
                    elem.attr({
                        'stroke-width': 1,
                        stroke: color,
                        zIndex: 1
                    }).add();
                    data[i].borderElem = elem;
                }
                else {
                    if (elem) {
                        elem.destroy();
                    }
                    data[i].borderElem = null;
                }
            }

        }
        if (chart.cfg.type != 'scatterchart')
            return;
        var points = [];
        for (var i = 0; i < chart.chart.series.length; i++) {
            points = Ext.Array.merge(points, chart.chart.series[i].points);
        }

        var updated = false;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (points.length >= 1000){
                let data = chart.chart.series[0].options.data;
                data.forEach(function(poi){
                    if (point.options.x === poi[0] && point.options.y === poi[1]){
                        let opt = poi[3];
                        if (opt){
                            point.at = opt.at;
                            point.gid = opt.gid;
                            point.loc = opt.loc;
                        }
                    }
                });
            }
            var at = point.at;
            var gid = point.gid;
            var loc = point.loc;
            var actualColor = point.graphic ? point.graphic.stroke.toLowerCase() : 1;
            if (colorMap[loc] && colorMap[loc][at]) {
                var color = '#' + (colorMap[loc][at][gid] || 'dddddd');
                color = color.toLowerCase();
            }
            else {
                color = '#dddddd';
            }
            if (color != actualColor) {
                updated = true;
                point.series.state = '';
                point.update({
                    lineColor: color,
                    lineWidth: color == '#dddddd' ? 1 : 3
                }, false)
            }
        }
        if (updated) {
            chart.chart.redraw();
        }
    },
    onAttrSetChange: function(combo, value) {
        var storeToFilterName = null;
        switch (combo.itemId) {
            case 'attributeSet':
                storeToFilterName = 'attribute4chart';
                break;
            case 'normAttributeSet':
                storeToFilterName = 'normattribute4chart';
                break;
        }
        var storeToFilterName = storeToFilterName || 'attribute4chart4norm';
        var attrSetStore = Ext.StoreMgr.lookup('attributeset');
        var attrSet = attrSetStore.getById(value);
        var attributes = attrSet.get('attributes');
        var storeToFilter = Ext.StoreMgr.lookup(storeToFilterName);
        storeToFilter.clearFilter(true);
        storeToFilter.filter([function(rec) {
            return Ext.Array.contains(attributes, rec.get('_id'));
        }])

    },
    onAddAttribute: function(btn) {
        var panel = btn.up('panel').up('panel')
        var attributeSet = Ext.ComponentQuery.query('#attributeSet', panel)[0].getValue();
        var grid = btn.up('grid');
        var sel = grid.getSelectionModel().getSelection();
        if (!sel || !sel.length)
            return;
        var recsToAdd = [];
        var normType = Ext.ComponentQuery.query('#normType', panel)[0].getValue();
        var normAttrSet = Ext.ComponentQuery.query('#normAttributeSet', panel)[0].getValue();
        var normGrid = Ext.ComponentQuery.query('#normselgrid', panel)[0];
        var normAttr = normGrid.getSelectionModel().getSelection()[0];
        if (Ext.Array.contains(['year', 'area'], normType)) {
            normAttrSet = null;
            normAttr = null;
        }
        else if (normType == 'attributeset' && normAttrSet) {
            normAttr = null
        }
        else if (normType == 'attribute' && normAttrSet && normAttr) {

        }
        else {
            normType = null;
            normAttrSet = null;
            normAttr = null;
        }
        for (var i = 0; i < sel.length; i++) {
            var attr = sel[i];
            var rec = Ext.create('Puma.model.MappedChartAttribute', {
                as: attributeSet,
                attr: attr.get('_id')
            })
            if (normType)
                rec.set('normType', normType);
            if (normAttrSet)
                rec.set('normAs', normAttrSet);
            if (normAttr)
                rec.set('normAttr', normAttr.get('_id'));
            recsToAdd.push(rec);
        }


        var addedGrid = Ext.ComponentQuery.query('#addedgrid', panel)[0]
        addedGrid.store.add(recsToAdd);

    },
    onRemoveAttribute: function(btn) {
        var grid = btn.up('grid');
        var sel = grid.getSelectionModel().getSelection();
        grid.store.remove(sel);
    }
});


Ext.define('PumaMain.view.TopTools', {
    extend: 'Ext.container.Container',
    alias: 'widget.toptoolspanel',
    height: '100%',
    // to be removed
    width: '100%',
    initComponent: function() {
        this.layout = {
            type: 'hbox'
        }
        this.defaults = {
            height: '100%'
        }
        this.items = [{
            xtype: 'button',
            flex: 1,
            enableToggle: true,
            toggleGroup: 'mapmodal',
            itemId: 'selectinmapbtn',
            helpId: 'Selectingunitsinmap',
            text: polyglot.t('selectInMap'),
            icon: 'images/icons/map-select.png',
            cls: 'custom-button btn-map-select',
            listeners : {
                toggle : {
                    fn : function(btn, active) {
                        if (active) {
                            btn.addCls("toggle-active");
                        }
                        else {
                            btn.removeCls("toggle-active");
                        }
                    }
                }
            }
        },{
            xtype: 'button',
            flex: 1,
            text: polyglot.t('snapshot'),
            icon: 'images/icons/snapshot.png',
            itemId: 'mapsnapshotbtn',
            helpId: 'Creatingsnapshots',
            cls: 'custom-button btn-snapshot'
        }]

        this.callParent();

    }
})


/*
 TODO think about it
 */

var widgets = {
    layerpanel: {
        xtype: 'layerpanel',
        //maxHeight: 500,
        itemId: 'layerpanel',
        helpId: 'Layers',
        tools: [{
            type: 'gear',
            tooltip: polyglot.t('configureThematicMaps'),
            itemId: 'gear'
        },{
            type: 'detach',
            cls: 'detach',
            tooltip: polyglot.t('detach'),
            itemId: 'undock',
            hidden: Config.toggles.useTopToolbar
        },{
            type: 'hide',
            cls: 'hide',
            tooltip: polyglot.t('hide'),
            itemId: 'hide',
            hidden: !Config.toggles.useTopToolbar,
            listeners: {
                click: {
                    fn: function() {
                        Observer.notify("Tools.hideClick.layerpanel");
                    }
                }
            }
        }],
        height: 340,
        header: !Config.toggles.useTopToolbar,
        title: polyglot.t('layers')
    },
    areatree: {
        xtype: 'areatree',
        itemId: 'areatree',
        cls: 'areaTreeSelection',
        helpId: 'TreeofanalyticalunitsAREAS',
        tools: [{
            type: 'unselectall',
            cls: 'unselectall',
            tooltip: polyglot.t('unselectAll'),
            itemId: 'unselectall'
        },{
            type: 'areacollapseall',
            cls: 'areacollapseall',
            tooltip: polyglot.t('collapseAll'),
            itemId: 'areacollapseall'
        },{
            type: 'areacollapselevel',
            cls: 'areacollapselevel',
            tooltip: polyglot.t('collapseLastLevel'),
            itemId: 'areacollapselevel'
        },{
            type: 'areaexpandlevel',
            cls: 'areaexpandlevel',
            tooltip: polyglot.t('expandLastLevel'),
            itemId: 'areaexpandlevel'
        },{
            type: 'detach',
            cls: 'detach',
            tooltip: polyglot.t('detach'),
            itemId: 'undock',
            hidden: Config.toggles.useTopToolbar
        },{
            type: 'hide',
            cls: 'hide',
            tooltip: polyglot.t('hide'),
            itemId: 'hide',
            hidden: !Config.toggles.useTopToolbar,
            listeners: {
                click: {
                    fn: function() {
                        window.Stores.notify("Tools.hideClick", {targetId: 'window-areatree'});
                    }
                }
            }
        }],
        title: polyglot.t('areas'),
        header: !Config.toggles.useTopToolbar,
        height: 340
        //,maxHeight: 500
    },
    colourSelection: {
        xtype: 'panel',
        title: polyglot.t('selections'),
        header: Config.toggles.useTopToolbar ? false : {height: 60},
        // id: 'selcolor',
        itemId: 'selcolor',
        helpId: 'Multipleselectionshighlightedbyc',
        tools: [{
            type: 'unselect',
            cls: 'unselect',
            tooltip: polyglot.t('unselectActiveSelection'),
            itemId: 'unselect'
        },{
            type: 'unselectall',
            cls: 'unselectall',
            tooltip: polyglot.t('unselectAll'),
            itemId: 'unselectall'
        },{
            type: 'detach',
            cls: 'detach',
            tooltip: polyglot.t('detach'),
            itemId: 'undock',
            hidden: Config.toggles.useTopToolbar
        },{
            type: 'hide',
            cls: 'hide',
            tooltip: polyglot.t('hide'),
            itemId: 'hide',
            margin: '0 10',
            hidden: !Config.toggles.useTopToolbar,
            listeners: {
                click: {
                    fn: function() {
                        window.Stores.notify("Tools.hideClick", {targetId: 'window-colourSelection'});
                    }
                }
            }
        }],
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        height: 30,
        items: [{
            xtype: 'colorpicker',
            fieldLabel: 'CP',
            value: 'ff4c39',
            itemId: 'selectcolorpicker',
            height: 22,
            margin: '0 10',
            flex: 1,
            //width: 120,
            colors: ['ff4c39', '34ea81', '39b0ff', 'ffde58', '5c6d7e', 'd97dff']

        }]
    },
    legacyAdvancedFilters: {
        xtype: 'panel',
        // id: 'legacyAdvancedFilters0',
        collapsed: !Config.toggles.useTopToolbar,
        tools: [{
            type: 'poweron',
            tooltip: polyglot.t('activateDeactivate'),
            itemId: 'poweron'
        },{
            type: 'refresh',
            tooltip: polyglot.t('reset'),
            itemId: 'refresh'
        },{
            type: 'gear',
            tooltip: polyglot.t('configureFilters'),
            itemId: 'gear'
        },{
            type: 'detach',
            tooltip: polyglot.t('detach'),
            cls: 'detach',
            itemId: 'undock',
            hidden: Config.toggles.useTopToolbar
        },{
            type: 'hide',
            cls: 'hide',
            tooltip: polyglot.t('hide'),
            itemId: 'hide',
            hidden: !Config.toggles.useTopToolbar,
            listeners: {
                click: {
                    fn: function() {
                        Observer.notify("Tools.hideClick.legacyAdvancedFilters");
                    }
                }
            }
        }],
        layout: {
            type: 'vbox',
            align: 'stretch'

        },
        itemId: 'advancedfilters',
        helpId: 'Filteringanalyticalunits',
        //            buttons: [{
        //                text: 'Configure',
        //                hidden: true,
        //                itemId: 'configurefilters'
        //            },{
        //                text: 'Instant',
        //                hidden: true,
        //                itemId: 'instantfilter',
        //                enableToggle: true
        //            },{
        //                text: 'Select',
        //                hidden: true,
        //                disabled: true,
        //                itemId: 'filterselect'
        //            }],
        header: !Config.toggles.useTopToolbar,
        title: Config.basicTexts.advancedFiltersName,
        bodyCls: 'tools-filters-list'
    },
    maptools: {
        xtype: 'maptools',
        collapsed: false,
        itemId: 'maptools',
        helpId: 'Maptools',
        tools: [{
            type: 'detach',
            cls: 'detach',
            tooltip: polyglot.t('detach'),
            itemId: 'undock',
            hidden: Config.toggles.useTopToolbar
        },{
            type: 'hide',
            cls: 'hide',
            tooltip: polyglot.t('hide'),
            itemId: 'hide',
            hidden: !Config.toggles.useTopToolbar,
            listeners: {
                click: {
                    fn: function() {
                        Observer.notify("Tools.hideClick.maptools");
                    }
                }
            }
        }],
        header: !Config.toggles.useTopToolbar,
        title: 'Map tools'
    },
    customLayers: {
        xtype: 'panel',
        //collapsed: false,
        itemId: 'customLayers',
        //helpId: 'customLayers',
        hidden: !Config.toggles.useTopToolbar,
        tools: [{
            type: 'hide',
            cls: 'hide',
            tooltip: polyglot.t('hide'),
            itemId: 'hide',
            hidden: !Config.toggles.useTopToolbar,
            listeners: {
                click: {
                    fn: function() {
                        window.Stores.notify("Tools.hideClick", {targetId: 'window-customLayers'});
                    }
                }
            }
        }],
        width: 400,
        height: 400,
        header: !Config.toggles.useTopToolbar,
        title: polyglot.t('addLayer'),
        html: "<div id='custom-layers'></div>"
    }
};


if (Config.toggles.useTopToolbar) {

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var offsetTop = 0;
    var offsetBottom = 0;
    if (Config.toggles.useWBHeader) offsetTop += 40;
    if (Config.toggles.useHeader) offsetTop += 45;
    if (Config.toggles.useNewViewSelector) {
        if (windowWidth > 1400) {
            offsetTop += 40;
        } else {
            offsetTop += 70;
        }
    } else {
        offsetTop += 105;
    }
    if (Config.toggles.useTopToolbar) offsetTop += 30;
    if (Config.toggles.useWBFooter) offsetBottom += 27;
    var viewportHeight = windowHeight - offsetTop - offsetBottom;
    var floaterAddedHeight = 40;
    var floaterWidth = 260;

    widgets.layerpanel.height = (viewportHeight - 9)/2 - floaterAddedHeight;
    widgets.layerpanel.ptrWindow = {
        x: 3,
        y: offsetTop + 3
    };
    widgets.areatree.height = widgets.layerpanel.height - 20; // todo fix areatree styling & remove 20
    widgets.areatree.ptrWindow = {
        x: 3,
        y: offsetTop + 3 + widgets.layerpanel.height + floaterAddedHeight + 3
    };
    widgets.colourSelection.ptrWindow = {
        x: 3 + floaterWidth + 3,
        y: offsetTop + 3
    }
    widgets.maptools.ptrWindow = {
        x: 3 + floaterWidth + 3,
        y: offsetTop + 3 + widgets.colourSelection.height + floaterAddedHeight + 3
    }
    widgets.legacyAdvancedFilters.ptrWindow = {
        x: 3 + floaterWidth + 3,
        y: offsetTop + 3 + widgets.colourSelection.height + floaterAddedHeight + 3 + 202 + 3 //202 - complete maptools
    }


    Ext.define('PumaMain.view.Tools', {
        extend: 'Ext.container.Container',
        alias: 'widget.toolspanel',
        initComponent: function () {

            // define widgets
            Object.keys(widgets).forEach(function(toolID){

                // resizable widgets have to use temporary map overlay to prevent accidental dropping when dragging edge too fast (which is almost always)
                var resizable = {
                    dynamic: false,
                    listeners: {
                        beforeresize: {
                            fn: function () {
                                $("#map-holder").append('<div id="draggingOverMapProtectionOverlay"></div>');
                            }
                        },
                        afterresize: {
                            fn: function () {
                                $("#draggingOverMapProtectionOverlay").remove();
                            }
                        }
                    }
                };

                // don't allow changing width of Advanced Filters / Evaluation Tool
                if(toolID === 'legacyAdvancedFilters') {
                    resizable.handles = 'n s';
                }

                // don't allow to resize Map Tools or Selections widgets
                if(toolID === 'maptools' || toolID === 'colourSelection') {
                    resizable = false;
                }

                var window = Ext.widget('window',{
                    itemId: "window-" + toolID,
                    id: "window-" + toolID,
                    layout: 'fit',
                    width: widgets[toolID].width || 260,
                    maxHeight: 600,
                    resizable: resizable,
                    closable: !Config.toggles.useTopToolbar,
                    cls: 'detached-window',
                    isdetached: 1,
                    constrainHeader: true,
                    tools: widgets[toolID].tools,
                    title: widgets[toolID].title,
                    x: widgets[toolID].ptrWindow ? widgets[toolID].ptrWindow.x : undefined,
                    y: widgets[toolID].ptrWindow ? widgets[toolID].ptrWindow.y : undefined,
                    items: widgets[toolID]
                });

            });

            this.callParent();

        }
    });

} else {
    Ext.define('PumaMain.view.Tools', {
        extend: 'Ext.container.Container',
        alias: 'widget.toolspanel',
        // to be removed
        width: '100%',
        autoScroll: true,
        requires: ['PumaMain.view.LayerPanel', 'PumaMain.view.MapTools', 'Gisatlib.slider.DiscreteTimeline'],
        initComponent: function () {
            this.layout = {
                type: 'accordion',
                fill: false,
                multi: true
            };
            this.defaults = {
                //hideCollapseTool: true
                collapseLeft: true
            };

            this.items = [widgets.colourSelection,widgets.layerpanel,widgets.areatree,widgets.maptools,widgets.legacyAdvancedFilters];
            if (Config.toggles.advancedFiltersFirst){
                this.items = [widgets.colourSelection,widgets.legacyAdvancedFilters,widgets.layerpanel,widgets.areatree,widgets.maptools];
            }
            if (Config.toggles.hasNewEvaluationTool){
                this.items = [widgets.colourSelection,widgets.layerpanel,widgets.areatree,widgets.maptools];
            }


            this.callParent();
        }
    })
}
Ext.define('PumaMain.view.ChartBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.chartbar',
    requires: ['PumaMain.view.ScreenshotView'],
    autoScroll: true,
    //overflowY: 'scroll',
    height:"100%",
    initComponent: function() {

        this.layout = {
            type: 'accordion',
            multi: true,
            fill: false
        };
        this.items = [
            {
                xtype: 'panel',
                cls: 'chart-panel panel-snapshots',
                collapsed: false,
                layout: 'fit',
                iconCls: 'cmptype-snapshot',
                collapseLeft: true,
                hidden: true,
                itemId: 'screenshotpanel',
                helpId: 'Snapshots',
                items: [{
                    xtype: 'screenshotview'
                }],
                cfgType: 'screenshots',
                height: 400,
                title: polyglot.t('snapshots')
            }
        ];
        this.callParent();
    }
});


Ext.define('Gisatlib.container.StoreContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.storecontainer',
    mixins: ['Ext.util.Bindable','Ext.form.field.Field'],
    initComponent: function() {
        if (this.store) {
            this.bindStore(this.store);
        }
        this.layout = {
            type: 'hbox'
        }
        this.defaults = {
            margin: '0 2 0 0'
        }
        this.displayField = this.displayField || 'name';
        this.valueField = this.valueField || '_id';
        this.type = this.type || 'button';
        this.callParent();
        this.addEvents('change');
    },

    getStoreListeners: function() {
        return {
            datachanged: this.refresh
        }
    },
    refresh: function() {
        var me = this;
        if (!me.store) {
            return;
        }
        var recs = this.store.getRange();
        var presentRecs = [];
        var cmpsToDelete = [];
        var cmpsToAdd = [];
        var changed = false;
        var containsPressed = false;

        this.items.each(function(cmp) {
            var value = me.type == 'button' ? cmp.pressed : cmp.value
            if (!Ext.Array.contains(recs,cmp.rec)) {
                cmpsToDelete.push(cmp);
                if (value) {
                    changed = true;
                }
            }
            else {
                presentRecs.push(cmp.rec);
                if (value) {
                    containsPressed = true;
                }
            }

        })
        for (var i=0;i<cmpsToDelete.length;i++) {
            this.remove(cmpsToDelete[i])
        }
        this.store.each(function(rec,i) {
            if (!Ext.Array.contains(presentRecs,rec)) {
                var cmp = me.createCmp(rec);
                me.insert(i,cmp)
            }
        })

        if (this.forceSelection && !containsPressed) {
            var cmp = this.items.getAt(0);
            if (cmp) {
                this.setCmpValue(cmp,true);
                changed = true;

            }
        }
        if (changed) {
            this.fireEvent('change',this,this.getValue());
        }

    },

    getValue: function() {
        var recs = this.getRecords();
        var ids = [];
        for (var i=0;i<recs.length;i++) {
            ids.push(recs[i].get(this.valueField))
        }
        return ids;
    },
    getRecords: function() {
        var recs = [];
        var me = this;
        this.items.each(function(cmp) {
            var value = me.type == 'button' ? cmp.pressed : cmp.value;
            if (value) {
                recs.push(cmp.rec)
            }
        })
        return recs;
    },
    setValue: function(value) {
        value = Ext.isArray(value) ? value : [value];
        var me = this;
        var changed = false;
        this.items.each(function(cmp) {
            var cmpValue = me.type == 'button' ? cmp.pressed : cmp.value;
            var desiredValue = Ext.Array.contains(value,cmp.rec.get(me.valueField));
            if (cmpValue!=desiredValue) {
                me.setCmpValue(cmp,desiredValue);
                changed = true;
            }

        })
        if (changed) {
            this.fireEvent('change',this,this.getValue());
        }
    },


    createCmp: function(rec) {
        var cmp = null;
        var me = this;
        if (this.type=='button') {
            cmp = Ext.widget('button',{
                text: rec.get(this.displayField),
                rec: rec,
                enableToggle: true
            })
            cmp.on('toggle',me.onChange,me);
            cmp.onClick = function(e) {
                me.e = e;
                this.__proto__.onClick.apply(this,arguments)
            }
        }
        else {
            cmp = Ext.widget('checkbox',{
                boxLabel: rec.get('name'),
                rec: rec,
                inputValue: rec.get(this.valueField)
            })
            cmp.onBoxClick = function(e) {
                me.e = e;
                this.__proto__.onBoxClick.apply(this,arguments)
            }
            cmp.on('change',me.onChange,me);
        }
        return cmp;
    },

    setCmpValue: function(cmp,val) {
        cmp.suspendEvents();
        if (this.type=='button') {
            cmp.toggle(val);
        }
        else {
            cmp.setValue(val);
        }
        cmp.resumeEvents();
    },

    onChange: function(cmp,val) {
        var me = this;
        var changed = false;
        var multiValue = this.getValue();
        // single mode
        if ((!this.multi || (this.multiCtrl && !me.e.ctrlKey))) {
            // select just one item from already selected
            if (this.multi && !val && multiValue.length) {
                this.items.each(function(item) {
                    if (item == cmp) {
                        me.setCmpValue(item, true);
                    }
                    else {
                        me.setCmpValue(item, false);
                    }
                })
                changed = true;
            }
            // select unselected item
            else if (val) {
                this.items.each(function(item) {
                    if (item == cmp)
                        return;
                    me.setCmpValue(item, false);
                })
                changed = true;
            }
            // unselect last item
            else {
                me.setCmpValue(cmp, true);
            }

        }
        // multi mode
        else {

            if (!multiValue.length) {
                me.setCmpValue(cmp, true);
            }
            else {
                changed = true;
            }
        }
        if (changed) {
            this.fireEvent('change',this,this.getValue());
        }

    }
})



Ext.define('Puma.model.Location', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','bbox','center','active','dataset'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/location',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});



Ext.define('Puma.model.AttributeSet', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','attributes','active','description','topic','featureLayers'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/attributeset',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});



Ext.define('Puma.model.Attribute', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','color','code','type','units','active','description'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/attribute',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.AreaTemplate', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','justVisualization','active','symbologies','topic','layerGroup'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/areatemplate',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.Dataset', {
    extend: 'Ext.data.Model',
    fields: [
        '_id', 'name', 'active', 'featureLayers', 'oneLevelOnly', 'aggregated', 'removedTools',
        'disabledBackgroundMaps', 'activeBackgroundMap', 'disabledLayerCategories', 'layerOptions',
        'disabledLayers', 'extraBackgroundLayers', 'hideSidebarReports', 'isMapDependentOnScenario', 'isMapIndependentOfPeriod', 'oneLayerPerMap', 'mapLayerInfo', 'aoiLayer', 'viewSelection', 'showTimeline', 'timelineContent', 'layersWidgetHiddenPanels', 'featurePlaceChangeReview','scenarios', 'configuration', 'description'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url: Config.url + 'restricted/rest/dataset',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});

Ext.define('Puma.model.DataView', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','conf', 'permissions'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/dataview',
        extraParams: {
            justMine: true
        },
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.Topic', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','active','requiresFullRef'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/topic',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});



Ext.define('Puma.model.Symbology', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','symbologyName','active','topic'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/symbology',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.LayerRef', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','columnMap','location','layer','fidColumn','isData','nameColumn','parentColumn','areaTemplate','attributeSet','year','wmsAddress','wmsLayers','active'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        timeout: 120000,
        url : Config.url+'rest/layerref',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.LayerServer', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','referenced','isWms'
    ],
    idProperty: '_id',
    proxy: {
        type: 'ajax',
        actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
        url : Config.url+'api/layers/getLayers',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.Theme', {
    extend: 'Ext.data.Model',
    fields: [
        //removed unused analysis, minFeatureLayer and minAttributeSets. Jonas
        //'_id','name','active','years','dataset','analysis','prefTopics','topics','minFeatureLayer','minAttributeSets','visOrder'
        '_id','name','active','years','dataset','prefTopics','topics','visOrder'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/theme',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.Aggregated', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name'
    ],
    idProperty: '_id',
    proxy: 'memory'
});


Ext.define('Puma.model.Area', {
    extend: 'Ext.data.TreeModel',
    fields: [

        'gid','name','tree','at','lr','initialized','extent','id','loc','definedplace'
    ],
    //idProperty: 'gid',
    proxy: {
        type: 'ajax',
        actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
        url : Config.url+'api/theme/getThemeYearConf',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});


Ext.define('Puma.model.Year', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','active'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/year',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.Scope', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','active','datasets'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'restricted/rest/scope',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


// TODO: Add configuration information from thematic maps to this configuration.
Ext.define('Puma.model.MapLayer', {
    extend: 'Ext.data.TreeModel',
    fields: [
        'name', 'layer1', 'layer2', 'symbologyId', 'at', 'bindChart', 'checked', 'attribute', 'attributeSet',
        'type', 'topic', 'params', 'src', 'sortIndex', 'cfg', 'legend', 'layerGroup', 'priority',
        {
            name: 'atWithSymbology',
            convert: function (val, rec) {
                return rec.get('at') + '_' + rec.get('symbologyId')
            }
        }
    ],
    idProperty: 'id',
    proxy: 'memory'
});


Ext.define('Puma.model.LayerGroup', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','active','priority'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'rest/layergroup',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});


Ext.define('Puma.model.MappedAttribute', {
    extend: 'Ext.data.Model',
    fields: [

        '_id','name','index','attribute','attributeSet'
    ],
    idProperty: '_id',
    proxy: 'memory'
});


Ext.define('Gisatlib.data.SlaveStore',{
    extend: 'Ext.data.Store',
    slave: true,

    load: function() {
        var masterStore = this.findMaster();
        if (!masterStore) {
            this.callParent();
            return;
        }
        if (masterStore.getRange) {
            var records = masterStore.getRange();
        }
        else {
            var records = [];
            masterStore.getRootNode().cascadeBy(function(node) {
                records.push(node);
            })
        }
        //console.log(this.storeId);
        //console.log(records);
        this.loadRecords(records);
        this.filter();
        this.fireEvent('load',this,records,true);
    },

    findMaster: function() {
        var model = this.model.$className;
        var stores = Ext.StoreMgr.getRange();
        for (var i=0;i<stores.length;i++) {
            var store = stores[i];
            if (store.model.$className == model && !store.slave) {
                return store;
            }
        }
    }

});



Ext.define('Gisatlib.paging.PhantomStore',{
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.data.PagingMemoryProxy'],
    constructor: function(config) {
        Ext.define('PhantomModel',{
            extend: 'Ext.data.Model',
            fields: ['id'],
            proxy: 'pagingmemory'
        })
        this.data = [];
        this.pageSize = 15;
        this.model = 'PhantomModel'
        this.callParent([config]);
    },

    setCount: function(count) {
        var data = [];
        for (var i=0;i<count;i++) {
            data.push({
                id: i
            })
        }
        if (count<=(this.currentPage-1)*this.pageSize) {
            this.currentPage = Math.ceil(count/this.pageSize);
        }
        if (count && this.currentPage < 1) {
            this.currentPage = 1;
        }
        this.proxy.data = data;
        this.load();
    }

});


Ext.define('Gisatlib.data.AggregatedStore',{
    extend: 'Ext.data.Store',

    load: function() {
        var me = this;
        for (var i=0;i<this.stores.length;i++) {
            var store = this.stores[i];
            var recs = store.getRange();

            if (!recs || !recs.length) {
                store.on('load',function(st) {
                    var records = st.getRange();
                    this.loadRecords(records,{addRecords:true});
                    this.filter();
                },this)
            }
            else {
                this.loadRecords(recs,true);
                this.filter();
            }
            store.on('add',function(st,records) {
                for (var j=0;j<records.length;j++) {
                    this.addSorted(records[j]);
                }
            },this)
        }
    }

});


Ext.define('PumaMain.view.LayerMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.layermenu',
    initComponent: function() {

        this.items = [{
            text: polyglot.t('opacity'),
            hidden: this.layerName==null,
            itemId: 'opacity'
        },{
            text: polyglot.t('config'),
            hidden: this.bindChart==null,
            itemId: 'config'
        },{
            text: polyglot.t('remove'),
            hidden: this.bindChart==null,
            itemId: 'remove'
        }, {
            text: polyglot.t('exportPng'),
            hidden: this.map==null,
            itemId: 'exportpng'
        }, {
            text: polyglot.t('URL'),
            hidden: this.map==null,
            itemId: 'url'
        }]
        this.callParent();

    }
})

Ext.define('Puma.util.Color', {
    requires: ['Ext.draw.Color'],
    statics: {
        determineColorRange: function(color) {
            var hsl = Ext.draw.Color.fromString(color).getHSL();
            var fromColor = Ext.draw.Color.fromHSL(hsl[0], 0.8+0.2*hsl[1], 0.95+0.05*hsl[2]).toString();
            var toColor = Ext.draw.Color.fromHSL(hsl[0], 0.8+0.2*hsl[1], 0.25+0.1*hsl[2]).toString();
            return [fromColor, toColor];
        },
        determineColorFromRange: function(colorFrom, colorTo, ratio) {
            var rgbFrom = Ext.draw.Color.fromString(colorFrom).getRGB();
            var rgbTo = Ext.draw.Color.fromString(colorTo).getRGB();
            var rgbRatio = [rgbFrom[0] + ratio * (rgbTo[0] - rgbFrom[0]), rgbFrom[1] + ratio * (rgbTo[1] - rgbFrom[1]), rgbFrom[2] + ratio * (rgbTo[2] - rgbFrom[2])];

            return new Ext.draw.Color(rgbRatio[0], rgbRatio[1], rgbRatio[2]).toString();
        }
    }
});


Ext.define('PumaMain.view.CommonMngGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.commonmnggrid',
    autoScroll: true,
    requires: [],
    initComponent: function() {
        var me = this;

        var actionItems = [
            {
                icon: 'images/icons/remove-16.png', // Use a URL in the icon config
                tooltip: polyglot.t('remove'),
                width: 16,
                height: 16,
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    me.fireEvent('recdeleted', me, record)
                }
            }];

        this.columns = [{
            dataIndex: 'name',
            flex: 1,
            resizable: false,
            menuDisabled: true,
            sortable: false,
            text: polyglot.t('name'),
        },
            {
                xtype: 'actioncolumn',
                width: 30,
                items: actionItems
            }
        ]
        this.callParent();

        this.addEvents('recmoved', 'recdeleted','urlopen');
    }
})


Ext.define('PumaMain.view.CommonSaveForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.commonsaveform',
    frame: true,
    initComponent: function() {
        this.items = [{
            xtype: 'textfield',
            fieldLabel: polyglot.t('name'),
            name: 'name',
            itemId: 'name',
            allowBlank: false
        }]
        this.buttons = [{
            text: polyglot.t('save'),
            itemId: 'save'
        }]
        this.callParent();

    }
})

Ext.define('PumaMain.view.ConfigForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.configform',
    autoScroll: true,
    frame: true,
    header: false,
    resizable: true,
    requires: ['Ext.ux.CheckColumn', 'PumaMain.view.AddAttributeTree', 'PumaMain.view.ChoroplethForm', 'PumaMain.view.AttributeGrid', 'Gisatlib.container.StoreContainer', 'PumaMain.view.NormalizeForm'],
    initComponent: function () {
        this.attrStore = Ext.create('Ext.data.Store', {
            data: [],
            model: 'Puma.model.MappedChartAttribute'
        });
        this.items = [{
            xtype: 'textfield',
            name: 'title',
            marginLeft: 5,
            width: 500,
            hidden: this.formType != 'chart',
            fieldLabel: polyglot.t('name')
        }, {
            xtype: 'textareafield',
            name: 'description',
            marginLeft: 5,
            width: 500,
            height: 80,
            hidden: this.formType != 'chart',
            fieldLabel: polyglot.t('description')
        }, {
            xtype: 'pumacombo',
            marginLeft: 5,
            hidden: this.formType != 'chart',
            store: Ext.StoreMgr.lookup('charttype4chart'),
            fieldLabel: polyglot.t('type'),
            valueField: 'type',
            width: 500,
            name: 'type',
            itemId: 'type'
        }, {
            xtype: 'container',
            hidden: true,
            width: 500,
            itemId: 'chartTypeHelp',
            name: 'chartTypeHelp',
            html: polyglot.t('scatterChartHelp')
        },
            {
                xtype: 'storefield',
                itemId: 'attrs',
                name: 'attrs',
                hidden: true,
                store: this.attrStore
            }, {
                xtype: 'container',
                hidden: this.formType == 'chart',
                height: 300,
                itemId: 'attributecontainer',
                marginBottom: 30,
                helpId: 'test',
                layout: 'card',
                cls: 'attribute-container',
                items: [
                    {
                        xtype: 'attributegrid',
                        formType: this.formType,
                        store: this.attrStore
                    }, {
                        xtype: 'addattributetree'
                    }, {
                        xtype: 'normalizeform',
                        cls: 'attribute-configuration',
                        formType: this.formType
                    }, {
                        xtype: 'form',
                        bodyStyle: {
                            padding: '0px'
                        },
                        frame: true,
                        items: [{
                            xtype: 'pumacombo',
                            store: Ext.StoreMgr.lookup('layers4outline'),
                            valueField: 'atWithSymbology',
                            fieldLabel: polyglot.t('layer'),
                            name: 'featureLayer',
                            width: 300
                        }, {
                            xtype: 'numberfield',
                            minValue: 0,
                            value: 70,
                            maxValue: 100,
                            fieldLabel: polyglot.t('opacity'),
                            name: 'featureLayerOpacity',
                            width: 300
                        }]

                    }, {
                        xtype: 'choroplethform'
                    }]
            }, {
                xtype: 'multislider',
                itemId: 'constrainFl',
                name: 'constrainFl',
                values: [0, this.featureLayers.length - 1],
                hidden: true,
                width: 500,
                useTips: {
                    getText: function (thumb) {
                        return thumb.slider.up('form').featureLayers[thumb.value].get('name')
                    }
                },
                increment: 1,
                minValue: 0,
                maxValue: this.featureLayers.length - 1
            }, {
                xtype: 'fieldset',
                itemId: 'advancedfieldset',
                collapsible: true,
                collapsed: true,
                hidden: true,
                title: polyglot.t('advanced'),
                items: [{
                    xtype: 'pumacombo',
                    store: Ext.StoreMgr.lookup('periods4chart'),
                    fieldLabel: polyglot.t('periods'),
                    valueField: 'type',
                    value: 'all',
                    width: 500,
                    name: 'periodsSettings',
                    itemId: 'periodsSettings',
                    hidden: true
                }, {
                    xtype: 'pumacombo',
                    store: Ext.StoreMgr.lookup('periods4polarchart'),
                    fieldLabel: polyglot.t('periods'),
                    valueField: 'type',
                    value: 'latest',
                    width: 500,
                    name: 'periodsSettingsPolarChart',
                    itemId: 'periodsSettingsPolarChart',
                    hidden: true
                }, {
                    xtype: 'pumacombo',
                    store: Ext.StoreMgr.lookup('normalization4polarchart'),
                    fieldLabel: polyglot.t('normalization'),
                    valueField: 'type',
                    value: 'yes',
                    width: 500,
                    name: 'polarAxesNormalizationSettings',
                    itemId: 'polarAxesNormalizationSettings',
                    hidden: true
                }, {
                    xtype: 'pumacombo',
                    store: Ext.StoreMgr.lookup('stacking4chart'),
                    fieldLabel: polyglot.t('stacking'),
                    valueField: 'type',
                    value: 'none',
                    width: 500,
                    name: 'stackingSettings',
                    itemId: 'stackingSettings'
                }, {
                    xtype: 'pumacombo',
                    store: Ext.StoreMgr.lookup('aggregate4chart'),
                    fieldLabel: polyglot.t('aggregate'),
                    valueField: 'type',
                    value: 'none',
                    width: 500,
                    name: 'aggregateSettings',
                    itemId: 'aggregateSettings'
                }]
            }];
        this.buttons = [{
            text: polyglot.t('ok'),
            itemId: 'configurefinish'
        }];
        this.callParent();

    }
});

Ext.define('PumaMain.view.ScreenshotView', {
    extend: 'Ext.view.View',
    alias: 'widget.screenshotview',
    //height: 270,
    overItemCls: 'screenshotover',
    initComponent: function () {
        this.store = Ext.StoreMgr.lookup('screenshot');
        this.itemSelector = 'div.screenshot';
        this.style = {
            overflowY: 'auto'
        };

        var snapshotDownload = 'images/icons/snapshot-download.png';
        var snapshotDelete = 'images/icons/snapshot-delete.png';

        if (Config.toggles.hasOwnProperty("isUrbis") && Config.toggles.isUrbis) {
            snapshotDownload = 'images/urbis/snapshot-download.png';
            snapshotDelete = 'images/urbis/snapshot-delete.png';
        }

        this.tpl = [
            '<tpl for=".">',
            '<div class="screenshot" style="display:<tpl if="visible==1">inline-block<tpl else>none</tpl>;width:<tpl if="large">536px<tpl else>172px</tpl>;height:<tpl if="large">350px<tpl else>118px</tpl>">',
            '<img class="screenshotimg" height=<tpl if="large">350<tpl else>118</tpl> width=<tpl if="large">536<tpl else>172</tpl> src="{src}"/>',
            //'<img class="screenshotimg" src="{src}"/>',
            '<div>',
            '</div>',
            '<img class="screenshoticon screenshotpng" height=30 width=30 src="' + snapshotDownload + '" />',
            '<tpl if="!large"><img class="screenshoticon screenshotremove" height=30 width=30 src="' + snapshotDelete + '" /></tpl>',
            '<img class="screenshoticon screenshotenlarge" height=36 width=36 src="images/icons/snapshot-enlarge.png" />',
            '</div>',
            '</tpl>'
        ]
        this.callParent();
        var me = this;
        this.addEvents('screenshotexport', 'screenshotremove', 'screenshotexpand')
        this.on('itemclick', function (view, rec, domEl, d, e) {
            var className = e.target.className;
            if (className.indexOf('screenshotpng') > -1) {
                me.fireEvent('screenshotexport', me, rec)
            }
            else if (className.indexOf('screenshotremove') > -1) {
                me.fireEvent('screenshotremove', me, rec)
            }
            else {
                me.fireEvent('screenshotexpand', me, rec, Ext.get(domEl))
            }
        })
    }
})


Ext.define('Ext.ux.data.PagingMemoryProxy', {
    extend: 'Ext.data.proxy.Memory',
    alias: 'proxy.pagingmemory',
    alternateClassName: 'Ext.data.PagingMemoryProxy',

    read : function(operation, callback, scope){
        var reader = this.getReader(),
            result = reader.read(this.data),
            sorters, filters, sorterFn, records;

        scope = scope || this;
        // filtering
        filters = operation.filters;
        if (filters.length > 0) {
            //at this point we have an array of  Ext.util.Filter objects to filter with,
            //so here we construct a function that combines these filters by ANDing them together
            records = [];

            Ext.each(result.records, function(record) {
                var isMatch = true,
                    length = filters.length,
                    i;

                for (i = 0; i < length; i++) {
                    var filter = filters[i],
                        fn     = filter.filterFn,
                        scope  = filter.scope;

                    isMatch = isMatch && fn.call(scope, record);
                }
                if (isMatch) {
                    records.push(record);
                }
            }, this);

            result.records = records;
            result.totalRecords = result.total = records.length;
        }

        // sorting
        sorters = operation.sorters;
        if (sorters.length > 0) {
            //construct an amalgamated sorter function which combines all of the Sorters passed
            sorterFn = function(r1, r2) {
                var result = sorters[0].sort(r1, r2),
                    length = sorters.length,
                    i;

                //if we have more than one sorter, OR any additional sorter functions together
                for (i = 1; i < length; i++) {
                    result = result || sorters[i].sort.call(this, r1, r2);
                }

                return result;
            };

            result.records.sort(sorterFn);
        }

        // paging (use undefined cause start can also be 0 (thus false))
        if (operation.start !== undefined && operation.limit !== undefined) {
            result.records = result.records.slice(operation.start, operation.start + operation.limit);
            result.count = result.records.length;
        }

        Ext.apply(operation, {
            resultSet: result
        });

        operation.setCompleted();
        operation.setSuccessful();

        Ext.Function.defer(function () {
            Ext.callback(callback, scope, [operation]);
        }, 10);
    }
});

Ext.define('PumaMain.view.AddAttributeTree', {
    // JJJ TIP: tristavove checkboxy, Ext je asi neumi
    //          http://www.sencha.com/forum/showthread.php?138664-Ext.ux.form.TriCheckbox&p=619810
    //          ve stromu to bude asi slozitejsi, tak nic...
    extend: 'Ext.tree.Panel',
    alias: 'widget.addattributetree',
    border: false,
    autoScroll: true,
    rootVisible: false,
    title: polyglot.t("selectAttributesToAdd"),
    requires: ['Ext.ux.CheckColumn','Ext.ux.grid.filter.StringFilter'],
    initComponent: function() {
        this.id = 'attributeSelectionTree';
        this.hideHeaders = true;
        this.store = Ext.StoreMgr.lookup('attributes2choose'); // store se jmenuje stejne, ale je predelan na treestore
        this.columns = [{
            xtype: 'treecolumn',
            dataIndex: 'treeNodeText',
            sortable: false,
            menuDisabled: true,
            flex: 1,
            renderer: function (value, m, r) {
                if (r.raw.hasOwnProperty('checked') && (r.raw.checked === true || r.raw.checked === false)){
                    return '<div class="tree-column-label">' +
                        value +
                        '</div>'
                }
                return '<div class="tree-root-label">' +
                    value +
                    '</div>';
            }
        }];

        this.buttons = [{
            itemId: 'add',
            text: polyglot.t("add")
        },{
            itemId: 'back',
            text: polyglot.t("back")
        }];
        this.callParent();
    }
});


Ext.define('PumaMain.view.ChoroplethForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.choroplethform',
    frame: true,
    header: false,
    initComponent: function () {
        this.bodyStyle = {
            padding: '0px'
        }
        this.items = [{
            xtype: 'pumacombo',
            forChoro: 1,
            store: Ext.StoreMgr.lookup('classificationtype'),
            fieldLabel: polyglot.t('classType'),
            itemId: 'classType',
            name: 'classType',
            value: 'quantiles',
            valueField: 'type'
        }, {
            xtype: 'numberfield',
            fieldLabel: polyglot.t('numCategories'),
            name: 'numCategories',
            forChoro: 1,
            value: 5,
            minValue: 2,
            allowDecimals: false,
            itemId: 'numCategories'
        }
        ]
        this.buttons = [{
            text: polyglot.t('apply'),
            itemId: 'apply'
        }, {
            text: polyglot.t('back'),
            itemId: 'back'
        }]
        this.callParent();

    }
})


Ext.define('PumaMain.view.AttributeGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.attributegrid',
    colspan: 2,
    border: 0,
    autoScroll: true,
    header: false,
    requires: ['Ext.ux.CheckColumn', 'Ext.grid.plugin.CellEditing'],
    initComponent: function () {
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');
        this.plugins = [this.editing];
        this.columns = [{
            xtype: 'checkcolumnwithheader',
            store: this.store,
            columnHeaderCheckbox: true,
            width: 40,
            menuDisabled: true,
            resizable: false,
            dataIndex: 'checked'
        }, {
            dataIndex: 'attrName',
            flex: 2,
            resizable: true,
            menuDisabled: true,
            text: polyglot.t("attribute"),
            tooltip: polyglot.t("attribute")
        }, {
            dataIndex: 'asName',
            flex: 2,
            resizable: true,
            menuDisabled: true,
            text: polyglot.t("attributeSet"),
            tooltip: polyglot.t("attributeSet")
        }, {
            dataIndex: 'attrType',
            flex: 1,
            resizable: true,
            menuDisabled: true,
            text: polyglot.t("type"),
            tooltip: polyglot.t("type"),
            renderer: function(value){
                return polyglot.t(value);
            }
        }, {
            dataIndex: 'asName',
            flex: 2,
            resizable: true,
            menuDisabled: true,
            text: polyglot.t('normalizationBase'),
            tooltip: polyglot.t('normalizationBase'),
            renderer: function (value, metadata, record) {
                var type = record.get('normType');
                var attrStore = Ext.StoreMgr.lookup('attribute');
                var attrSetStore = Ext.StoreMgr.lookup('attributeset');
                if (type == 'attribute') {
                    var normAs = attrSetStore.getById(record.get('normAs'));
                    var normAttr = attrStore.getById(record.get('normAttr'));
                    if (!normAs || !normAttr) {
                        return '';
                    }
                    var newVal = normAs.get('name') + '-' + normAttr.get('name');
                    metadata.tdAttr = 'data-qtip="' + newVal + '"';
                    return newVal
                }
                else if (type == 'attributeset') {
                    var normAs = attrSetStore.getById(record.get('normAs'));
                    if (!normAs) {
                        return '';
                    }
                    var newVal = normAs.get('name');

                    metadata.tdAttr = 'data-qtip="' + newVal + '"';
                    return newVal
                }
                else return '';
            }
        }, {
            dataIndex: 'normType',
            flex: 2,
            resizable: true,
            menuDisabled: true,
            formType: this.formType,
            text: polyglot.t('normalization'),
            tooltip: polyglot.t('normalization'),
            renderer: function (value, metadata, record) {
                var store = Ext.StoreMgr.lookup('normalization4chart');
                var rec = store.findRecord('type', value);
                return rec ? rec.get('name') : '';
            }
        }, {
            dataIndex: 'units',
            flex: 1,
            resizable: true,
            menuDisabled: true,
            formType: this.formType,
            text: polyglot.t('units'),
            tooltip: polyglot.t('units')
        }, {
            dataIndex: 'displayUnits',
            flex: 1,
            resizable: true,
            menuDisabled: true,
            formType: this.formType,
            text: polyglot.t('displayedUnits'),
            tooltip: polyglot.t('displayedUnits'),
            renderer: function (value, metadata, record) {
                return record.get('displayUnits') || record.get('units');
            }
        }, {
            dataIndex: 'classType',
            flex: 2,
            hidden: this.formType != 'layers',
            resizable: true,
            menuDisabled: true,
            text: polyglot.t('classification'),
            tooltip: polyglot.t('classification'),
            renderer: function (value, metadata, record) {
                value = value || 'quantiles';
                var store = Ext.StoreMgr.lookup('classificationtype');
                var rec = store.findRecord('type', value);
                return rec ? rec.get('name') : '';
            }
        }, {
            dataIndex: 'numCategories',
            flex: 1,
            hidden: this.formType != 'layers',
            resizable: true,
            menuDisabled: true,
            text: polyglot.t('cat'),
            tooltip: polyglot.t('cat'),
            renderer: function (value, metadata, record) {
                value = value || 5;
                return value;
            }
        }, {
            dataIndex: 'name',
            flex: 3,
            hidden: this.formType != 'layers',
            resizable: true,
            menuDisabled: true,
            text: polyglot.t('name'),
            tooltip: polyglot.t('name'),
            field: {
                type: 'textfield'
            }
        }];
        this.tbar = [{
            xtype: 'button',
            itemId: 'add',
            text: polyglot.t('add')
        }, {
            xtype: 'button',
            itemId: 'remove',
            text: polyglot.t('remove'),
        }, {
            xtype: 'button',
            //disabled: this.formType=='filters',
            itemId: 'normalize',
            text: polyglot.t('setting')
        }, {
            xtype: 'button',
            hidden: this.formType != 'layers',
            itemId: 'choroplethparams',
            text: polyglot.t('choroplethParams')
        }];
        this.viewConfig = {
            plugins: {
                ptype: 'gridviewdragdrop'
            }
        };
        this.callParent();

    }
});


Ext.define('PumaMain.view.NormalizeForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.normalizeform',
    frame: true,
    header: true,
    title: polyglot.t('attributeConfiguration'),
    initComponent: function () {
        this.attrStore = Ext.create('Gisatlib.data.SlaveStore', {
            slave: true,
            autoLoad: true,
            filters: [function (rec) {
                return false;
            }],
            model: 'Puma.model.Attribute'
        });
        this.bodyStyle = {
            padding: '0px',
        };
        this.style = {
            marginTop: '10px'
        };
        this.items = [{
            xtype: 'textfield',
            fieldLabel: polyglot.t('attributeUnitOriginal'),
            labelWidth: 170,
            name: 'units',
            valueField: 'type',
            itemId: 'units',
            disabled: true
        }, {
            xtype: 'textfield',
            fieldLabel: polyglot.t('attributeUnitDisplayed'),
            labelWidth: 170,
            name: 'displayUnits',
            valueField: 'type',
            itemId: 'displayUnits',
            disabled: true
        },{
            xtype: 'pumacombo',
            store: Ext.StoreMgr.lookup('change_units'),
            fieldLabel: polyglot.t('modifyDisplayedUnits'),
            labelWidth: 170,
            afterLabelTpl: new Ext.XTemplate(
                '<div class="form-label-help">',
                '<i class="form-label-help-button fa fa-info-circle"></i>',
                polyglot.t('modifyDisplayedUnitsText'),
                '</div>'
            ),
            name: 'normalizationUnits',
            valueField: 'type',
            itemId: 'normalizationUnits'
        }, {
            xtype: 'textfield', // TODO: Validate that it is Number.
            fieldLabel: polyglot.t('customFactor'),
            labelWidth: 170,
            afterLabelTpl: new Ext.XTemplate(
                '<div class="form-label-help">',
                '<i class="form-label-help-button fa fa-info-circle"></i>',
                polyglot.t('customFactorTooltip'),
                '</div>'
            ),
            name: 'customFactor',
            valueField: 'type',
            itemId: 'customFactor'
        }, {
            xtype: 'label',
            text: polyglot.t('normalization'),
            cls: 'form-section-title'
        },{
            xtype: 'pumacombo',
            store: Ext.StoreMgr.lookup('normalization4chart'),
            fieldLabel: polyglot.t('normalizationType'),
            labelWidth: 170,
            name: 'normType',
            valueField: 'type',
            itemId: 'normType'
        }, {
            xtype: 'pumacombo',
            store: Ext.StoreMgr.lookup('area_units'),
            fieldLabel: polyglot.t('areaUnits'),
            labelWidth: 170,
            name: 'areaUnits',
            hidden: true,
            valueField: 'type',
            itemId: 'areaUnits'
        }, {
            xtype: 'pumacombo',
            store: Ext.StoreMgr.lookup('attributeset2choose'),
            fieldLabel: polyglot.t('normalizationAttrSet'),
            labelWidth: 170,
            name: 'normAttributeSet',
            hidden: true,
            itemId: 'normAttributeSet'
        }, {
            xtype: 'pumacombo',
            store: this.attrStore,
            fieldLabel: polyglot.t('normalizationAttribute'),
            labelWidth: 170,
            name: 'normAttribute',
            hidden: true,
            itemId: 'normAttribute'
        }, {
            xtype: 'pumacombo',
            store: Ext.StoreMgr.lookup('area_units'),
            fieldLabel: polyglot.t('normalizationAttributeAreaUnits'),
            name: 'normalizationAreaUnits',
            hidden: true,
            valueField: 'type',
            itemId: 'normalizationAreaUnits'
        }];

        this.buttons = [{
            text: polyglot.t('changeSettings'),
            itemId: 'normalize'
        }, {
            text: polyglot.t('back'),
            itemId: 'back'
        }];
        this.callParent();

    }
})


/**
 * Filter by a configurable Ext.form.field.Text
 * <p><b><u>Example Usage:</u></b></p>
 * <pre><code>
 var filters = Ext.create('Ext.ux.grid.GridFilters', {
    ...
    filters: [{
        // required configs
        type: 'string',
        dataIndex: 'name',

        // optional configs
        value: 'foo',
        active: true, // default is false
        iconCls: 'ux-gridfilter-text-icon' // default
        // any Ext.form.field.Text configs accepted
    }]
});
 * </code></pre>
 */
Ext.define('Ext.ux.grid.filter.StringFilter', {
    extend: 'Ext.ux.grid.filter.Filter',
    alias: 'gridfilter.string',

    /**
     * @cfg {String} iconCls
     * The iconCls to be applied to the menu item.
     * Defaults to <tt>'ux-gridfilter-text-icon'</tt>.
     */
    iconCls : 'ux-gridfilter-text-icon',

    emptyText: 'Enter Filter Text...',
    selectOnFocus: true,
    width: 125,

    /**
     * @private
     * Template method that is to initialize the filter and install required menu items.
     */
    init : function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            iconCls: this.iconCls,
            hideLabel: true,
            listeners: {
                scope: this,
                keyup: this.onInputKeyUp,
                el: {
                    click: function(e) {
                        e.stopPropagation();
                    }
                }
            }
        });

        this.inputItem = Ext.create('Ext.form.field.Text', config);
        this.menu.add(this.inputItem);
        this.updateTask = Ext.create('Ext.util.DelayedTask', this.fireUpdate, this);
    },

    /**
     * @private
     * Template method that is to get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        return this.inputItem.getValue();
    },

    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter
     */
    setValue : function (value) {
        this.inputItem.setValue(value);
        this.fireEvent('update', this);
    },

    /**
     * Template method that is to return <tt>true</tt> if the filter
     * has enough configuration information to be activated.
     * @return {Boolean}
     */
    isActivatable : function () {
        return this.inputItem.getValue().length > 0;
    },

    /**
     * @private
     * Template method that is to get and return serialized filter data for
     * transmission to the server.
     * @return {Object/Array} An object or collection of objects containing
     * key value pairs representing the current configuration of the filter.
     */
    getSerialArgs : function () {
        return {type: 'string', value: this.getValue()};
    },

    /**
     * Template method that is to validate the provided Ext.data.Record
     * against the filters configuration.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord : function (record) {
        var val = record.get(this.dataIndex);

        if(typeof val != 'string') {
            return (this.getValue().length === 0);
        }

        return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
    },

    /**
     * @private
     * Handler method called when there is a keyup event on this.inputItem
     */
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
            this.menu.hide();
            return;
        }
        // restart the timer
        this.updateTask.delay(this.updateBuffer);
    }
});
/**
 * Filters using an Ext.ux.grid.menu.RangeMenu.
 * <p><b><u>Example Usage:</u></b></p>
 * <pre><code>
 var filters = Ext.create('Ext.ux.grid.GridFilters', {
    ...
    filters: [{
        type: 'numeric',
        dataIndex: 'price'
    }]
});
 * </code></pre>
 * <p>Any of the configuration options for {@link Ext.ux.grid.menu.RangeMenu} can also be specified as
 * configurations to NumericFilter, and will be copied over to the internal menu instance automatically.</p>
 */
Ext.define('Ext.ux.grid.filter.NumericFilter', {
    extend: 'Ext.ux.grid.filter.Filter',
    alias: 'gridfilter.numeric',
    uses: ['Ext.form.field.Number'],

    /**
     * @private @override
     * Creates the Menu for this filter.
     * @param {Object} config Filter configuration
     * @return {Ext.menu.Menu}
     */
    createMenu: function(config) {
        var me = this,
            menu;
        menu = Ext.create('Ext.ux.grid.menu.RangeMenu', config);
        menu.on('update', me.fireUpdate, me);
        return menu;
    },

    /**
     * @private
     * Template method that is to get and return the value of the filter.
     * @return {String} The value of this filter
     */
    getValue : function () {
        return this.menu.getValue();
    },

    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter
     */
    setValue : function (value) {
        this.menu.setValue(value);
    },

    /**
     * Template method that is to return <tt>true</tt> if the filter
     * has enough configuration information to be activated.
     * @return {Boolean}
     */
    isActivatable : function () {
        var values = this.getValue(),
            key;
        for (key in values) {
            if (values[key] !== undefined) {
                return true;
            }
        }
        return false;
    },

    /**
     * @private
     * Template method that is to get and return serialized filter data for
     * transmission to the server.
     * @return {Object/Array} An object or collection of objects containing
     * key value pairs representing the current configuration of the filter.
     */
    getSerialArgs : function () {
        var key,
            args = [],
            values = this.menu.getValue();
        for (key in values) {
            args.push({
                type: 'numeric',
                comparison: key,
                value: values[key]
            });
        }
        return args;
    },

    /**
     * Template method that is to validate the provided Ext.data.Record
     * against the filters configuration.
     * @param {Ext.data.Record} record The record to validate
     * @return {Boolean} true if the record is valid within the bounds
     * of the filter, false otherwise.
     */
    validateRecord : function (record) {
        var val = record.get(this.dataIndex),
            values = this.getValue(),
            isNumber = Ext.isNumber;
        if (isNumber(values.eq) && val != values.eq) {
            return false;
        }
        if (isNumber(values.lt) && val >= values.lt) {
            return false;
        }
        if (isNumber(values.gt) && val <= values.gt) {
            return false;
        }
        return true;
    }
});
Ext.define('PumaMain.controller.Dataview', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        this.colorBackComp = {
            'ff0000':'ff4c39',
            '00ff00':'34ea81',
            '0000ff':'39b0ff',
            'ffff00':'ffde58',
            '00ffff':'5c6d7e',
            'ff00ff':'d97dff'
        }

        Observer.notify('Dataview#init');
    },


    checkLoading: function() {
        var runner = new Ext.util.TaskRunner();
        var task = null;
        var me = this;
        task = runner.start({
            run: function() {
                var loading = false;
                Ext.StoreMgr.each(function(store) {
                    if (store.isLoading()) {
                        loading = true;
                        return false;
                    }
                })
                if (!loading) {
                    me.onLoadingFinished();
                    runner.destroy();
                    Observer.notify('Dataview#checkLoading Loading finished');
                }
            },
            interval: 1000
        })
    },

    onLoadingFinished: function(data) {
        if (data){
            console.log(`##### Ext Dataview#onLoadingfinished dataview: ${data}`);
            Config.cfg = data.data;
            Config.dataviewId = data.key;
            this.getController('ViewMng').onDataviewLoad();
        }
    },
});


