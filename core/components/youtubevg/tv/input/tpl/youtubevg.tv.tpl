<div id="youtubevg-{$tv->id}" style="width: 100%;"></div>
<script type="text/javascript">

    {literal}
    Ext.onReady(function () {
        MODx.load({
            xtype: 'container',
        {/literal}
            renderTo: 'youtubevg-{$tv->id}',
        {literal}
            layout: 'column',
            items: [{
                columnWidth: 100,
                items: [{
                    xtype: 'modx-grid-youtubevg',
                }]
            }]
        });
    });
    {/literal}

</script>