<!-- <input type="hidden" id="tv{$tv->id}" name="tv{$tv->id}" value='{$tv->value}' /> -->
<input type="hidden" id="tv{$tv->id}" name="tv{$tv->id}"{literal} value='[{"code":"example #1","title":"Title #1"},{"code":"example #2","title":"Title #2"},{"code":"example #3","title":"Title #3"}]' {/literal}/>
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
                linkedField: Ext.get('tv'+id).dom,
            }]
        });
    });
    {/literal}
</script>