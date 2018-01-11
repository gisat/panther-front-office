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
        if (panel.itemId=='advancedfilters') {
            this.getController('Filter').afterAccordionLayout();
        }
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
            // hidden: !Config.auth,
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
            // hidden: !Config.auth,
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
                icon: 'images/icons/switchsel.gif'
            }],
            store: Ext.StoreMgr.lookup('paging')
        })
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
            boxLabel: 'I have read this User Agreement and agree to these terms and conditions.'

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
			window.Stores.notify('user#changed');
        } else {
            var self = this;
            this._intervalCheck = window.setTimeout(function(){
				self.loadingFinishedNotification();
            },100);
        }
    }

    })


