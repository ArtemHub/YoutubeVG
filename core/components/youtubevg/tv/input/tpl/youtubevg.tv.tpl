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
                linkedInputField: Ext.get('tv'+id).dom,
            }]
        });
    });
    {/literal}
</script>