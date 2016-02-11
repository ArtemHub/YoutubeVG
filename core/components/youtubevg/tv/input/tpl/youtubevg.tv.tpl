<div id="youtubevg-{$tv->id}" style="width: 100%;"></div>
<script type="text/javascript">

    {literal}
    Ext.onReady(function () {
        MODx.load({
            xtype: 'panel',
        {/literal}
            renderTo: 'youtubevg-{$tv->id}',
        {literal}
            autoWidth: true,
            width: '100%',
            layout: 'fit',
            items: [{
                xtype: 'modx-grid-youtubevg'
            }]
        });
    });
    {/literal}

</script>