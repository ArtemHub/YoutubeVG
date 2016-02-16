<input type="hidden" id="tv{$tv->id}" name="tv{$tv->id}" value='{$tv->value}' />
<div id="youtubevg-{$tv->id}-div" style="overflow: hidden; width: 100%;"></div>
<script type="text/javascript">

    {literal}
    Ext.onReady(function () {
        var id = {/literal}{$tv->id}{literal}

        MODx.load({
            xtype: 'panel',
            applyTo: 'youtubevg-'+ id +'-div',
            items: [{
                xtype: 'youtubevg-grid',
                data: Ext.decode(Ext.get('tv'+ id).dom.value),
                listeners: {
                    change: function() {
                        var data = this.store.getData();
                        if(!data.length) {
                            Ext.get('tv'+ id).dom.value = '';
                        }
                        else {
                            Ext.get('tv'+id).dom.value = '{"records":' + Ext.encode(data) +'}';
                        }
                    }
                }
            }]
        });
    });
    {/literal}
</script>