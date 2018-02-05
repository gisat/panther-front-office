Ext.define('Puma.patch.view.Table', {
    override: 'Ext.view.Table',
    refreshSize: function() {
        if (!this.dontRefreshSize) {
            var self = this;
            setTimeout(function(){
				self.callParent();
            },10);
        }
    }
});


