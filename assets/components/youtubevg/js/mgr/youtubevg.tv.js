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
                    { id : "Record 2", code : "2", image : "2", title : "2", desc : "0" },
                    { id : "Record 3", code : "3", image : "3", title : "3", desc : "0" },
                    { id : "Record 4", code : "4", image : "4", title : "4", desc : "0" },
                    { id : "Record 5", code : "5", image : "5", title : "5", desc : "0" },
                    { id : "Record 6", code : "6", image : "6", title : "6", desc : "0" },
                ]
            },
            storeId: 'myStore',
            root: 'records',
            idProperty: 'id',
            remoteSort: false,
            listeners: {
                add: function(store, records, index) {
                    console.log(this);
                }
            }
        })
        ,autoExpandColumn: 'title'
        ,autoHeight: true
        ,enableDragDrop: true
        ,ddGroup: 'youtubevg-grid'
        ,ddText : 'Place this row.'
        ,sm: new Ext.grid.RowSelectionModel({
            singleSelect:true,
        }),
        listeners: {
            "render": {
                scope: this,
                fn: function(grid) {
                    var ddrow = new Ext.dd.DropTarget(grid.container, {
                        ddGroup : 'youtubevg-grid',
                        copy:false,
                        notifyDrop : function(dd, e, data){

                            var ds = grid.store;
                            var sm = grid.getSelectionModel();
                            var rows = sm.getSelections();
                            if(dd.getDragData(e)) {
                                var cindex=dd.getDragData(e).rowIndex;
                                if(typeof(cindex) != "undefined") {
                                    for(i = 0; i <  rows.length; i++) {
                                        ds.remove(ds.getById(rows[i].id));
                                    }
                                    ds.insert(cindex,data.selections);
                                    sm.clearSelections();
                                }
                            }
                        }
                    })
                    // load the grid store
                    // after the grid has been rendered
                    //this.store.load();
                }
            }
        }
        ,viewConfig:{
            enableRowBody: false,
            showPreview: false,
            scrollOffset: 0,
            emptyText: 'No items found',
            forceFit: false,
            autoFill: false
        }
        ,cm: new Ext.grid.ColumnModel({
            columns: [{
                header: 'Название',
                dataIndex: 'id',
                width: 100
            },{
                header: 'Изображение',
                dataIndex: 'image',
                width: 150
            },{
                header: 'Описание',
                id: 'title',
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