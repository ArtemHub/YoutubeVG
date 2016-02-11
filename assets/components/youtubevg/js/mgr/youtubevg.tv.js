MODx.grid.YoutubeVG = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        fields: ['id','code','image','title','desc']
        ,store: new Ext.data.JsonStore({
            fields: ['id','code','image','title','desc'],
            data:  {
                records : [
                    { id : "Record 0", code : "0", image : "0", title : "0", desc : "0" },
                    { id : "Record 1", code : "1", image : "1", title : "1", desc : "0" },
                    { id : "Record 2", code : "2", image : "1", title : "2", desc : "0" },
                    { id : "Record 3", code : "3", image : "3", title : "3", desc : "0" },
                    { id : "Record 4", code : "4", image : "4", title : "4", desc : "0" },
                    { id : "Record 5", code : "5", image : "5", title : "5", desc : "0" },
                    { id : "Record 6", code : "6", image : "6", title : "6", desc : "0" },
                ]
            },
            storeId: 'myStore',
            root: 'records',
            idProperty: 'id'
        })
        ,width: '100%'
        ,autoHeight: true
        ,viewConfig:{
            //scrollOffset: 0,
            forceFit: false,
            autoFill: true,
            //autoExpandColumn: 'title'
        }
        ,cm: new Ext.grid.ColumnModel({
            columns: [{
                header: 'Название',
                dataIndex: 'id',
                width: 60
            },{
                header: 'Изображение',
                dataIndex: 'image',
                width: 60
            },{
                header: 'Описание',
                dataIndex: 'title',
            }],
            defaults: {
                sortable: false,
                menuDisabled: true,
            }
        })
    });

    MODx.grid.YoutubeVG.superclass.constructor.call(this, config);
};

Ext.extend(MODx.grid.YoutubeVG, MODx.grid.LocalGrid);

Ext.reg('modx-grid-youtubevg', MODx.grid.YoutubeVG);