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


