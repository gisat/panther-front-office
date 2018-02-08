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

