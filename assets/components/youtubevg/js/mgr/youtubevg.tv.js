Ext.namespace('YoutubeVG');

YoutubeVG.store = function(config) {
    Ext.applyIf(config, {
        autoLoad: true,
        proxy: new Ext.data.MemoryProxy(),
        remoteSort: false,
        idIndex: 0,
        fields: [
            {name: 'code'}
        ]
    });
    YoutubeVG.store.superclass.constructor.call(this, config);
};
Ext.extend(YoutubeVG.store, Ext.data.ArrayStore, {
    getData: function() {
        var result = [];
        this.getRange().forEach(function(el, index) {
            result.push(el.json);
        });
        return result;
    },
    loadData : function(data, append){
        if(typeof(data) == 'string') {
            var json = data; data = [];
            Ext.decode(json).forEach(function(el, index, arr) {
                data[index] = Object.keys(el).map(function(k) { return el[k] });
            });
        }
        console.log(data)
        Ext.data.ArrayStore.superclass.loadData.call(this, data, append);
    }
});


YoutubeVG.toolbar = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        items: [
            {
                xtype: 'textfield',
            },{
                xtype: 'button',
                text: '<i class="icon icon-plus"></i>',
                handler: function() {
                    this.fireEvent('push');
                },scope: this
            }
        ]
    });

    YoutubeVG.toolbar.superclass.constructor.call(this, config);
    this.addEvents('push');
};
Ext.extend(YoutubeVG.toolbar, Ext.Toolbar, {
    getValue: function() {
        return this.getComponent(0).getValue();
    }
    ,clearTextfield: function() {
        this.getComponent(0).setValue('');
    }
});
Ext.reg('youtubevg-grid-tbar', YoutubeVG.toolbar);


YoutubeVG.grid = function (config) {
    config = config || {};
    var data = config.data || {"records": []};
    data = '[{"code":"tntOCGkgt98"},{"code":"BrarLswFq08"},{"code":"HxM46vRJMZs"},{"code":"UIrEM_9qvZU"}]';

    Ext.applyIf(config, {
        fields: ['code']
        ,store: new YoutubeVG.store()
        ,tbar: new YoutubeVG.toolbar()
        ,autoHeight: true
        ,hideHeaders: true
        ,enableDragDrop: true
        ,ddGroup: 'youtubevg-grid'
        ,ddText : 'Place this row.'
        ,sm: new Ext.grid.RowSelectionModel({
            singleSelect:true,
        })
        ,viewConfig:{
            enableRowBody: true,
            showPreview: true,
            scrollOffset: 0,
            emptyText: 'No items found',
            forceFit: true,
            autoFill: true
        }
        ,autoExpandColumn: 'autoExpand'
        ,width: 600
        ,cm: new Ext.grid.ColumnModel({
            columns: [{
                width: 100,
                resizable: false,
                fixed: true,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return '<img width="90" src="http://img.youtube.com/vi/'+ value +'/default.jpg">';
                }
            },{
                id: 'autoExpand',
                dataIndex: 'code',
            },{
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return '<ul class="youtubevg-grid-buttons-wrapper">' +
                        '<li class="youtubevg-action-button play"><i class="action-btn play icon icon-play-circle"></i></li>' +
                        '<li class="youtubevg-action-button remove"><i class="action-btn remove icon icon-times"></i></li>' +
                        '</ul>';
                },
                width: 80,
                resizable: false,
                fixed: true
            }],
            defaults: {
                sortable: false,
                menuDisabled: true,
            }
        })
    });

    YoutubeVG.grid.superclass.constructor.call(this, config);
    this.topToolbar.on('push', this.addVideo, this);
    this.store.on('add', this.onChange, this);
    this.store.on('remove', this.onChange, this);
    this.on('render', this.ddEnable, this);
    this.on('click', this.onClick);

};

Ext.extend(YoutubeVG.grid, MODx.grid.LocalGrid, {
    loadData: function () {
        var data = Ext.get(this.sourseInputId).dom.value;
        if(data == undefined || data == '' || !data) {
            return;
        }
        else {
            this.store
        }
    },
    ddEnable: function() {
        var grid = this;
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
        this.getView().refresh();
    },
    onClick: function(e){
        var t = e.getTarget();
        var elm = t.className.split(' ');
        if(elm[0] == 'action-btn') {
            var action = elm[1];
            switch(action) {
                case 'remove':
                    this.removeVideo();
                    break;
                case 'play':
                    this.playVideo();
                    break;
            }
        }
    },
    playVideo: function() {
        var record = this.getSelectionModel().getSelected();
        MODx.msg.alert('Код видео: ' + record.data.code,'<iframe width="560" height="315" src="https://www.youtube.com/embed/'+record.data.code+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    },
    removeVideo: function() {
        var record = this.getSelectionModel().getSelected();
        this.store.remove(record);
    },
    onChange: function() {
        this.fireEvent('change');
    },
    addVideo: function() {
        var val = this.topToolbar.getValue();
        this.topToolbar.clearTextfield();

        if(val == undefined || val == false || val == '') {
            MODx.msg.alert('Warning!','Вы не указали код видео!');
            return false;
        }
        var record = new this.store.recordType({
            code: val
        });
        this.getStore().add(record);
    }
});

Ext.reg('youtubevg-grid', YoutubeVG.grid);