Ext.namespace('YoutubeVG');

YoutubeVG.store = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        remoteSort: false,
        idIndex: 0,
        fields: ['code'],
    });
    YoutubeVG.store.superclass.constructor.call(this, config);
    this.addEvents('replace');
};
Ext.extend(YoutubeVG.store, Ext.data.ArrayStore, {
    getData: function() {
        var result = [];
        this.getRange().forEach(function(el, index) {
            result.push(el.json);
        });
        return result;
    },
    loadData: function(data, append) {
        if(typeof(data) == 'string' && data.length) {
            var json = data; data = [];
            Ext.decode(json).forEach(function(el, index, arr) {
                data[index] = Object.keys(el).map(function(k) { return el[k] });
            });
        }
        YoutubeVG.store.superclass.loadData.call(this, data, append);
    },
    replace: function(record, oldId, newId) {
        this.remove(this.getById(oldId));
        this.insert(newId, record);
        console.log(this.getData())
        this.fireEvent('replace');
    }
});


YoutubeVG.tbar = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        items: [
            {
                xtype: 'textfield',
                value: 'tntOCGkgt98'
            },{
                xtype: 'button',
                text: '<i class="icon icon-plus"></i>',
                handler: function() {
                    this.fireEvent('push');
                },scope: this
            }
        ]
    });

    YoutubeVG.tbar.superclass.constructor.call(this, config);
    this.addEvents('push');
};
Ext.extend(YoutubeVG.tbar, Ext.Toolbar, {
    getValue: function() {
        return this.getComponent(0).getValue();
    }
    ,clearTextfield: function() {
        this.getComponent(0).setValue('');
    }
});


YoutubeVG.grid = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        fields: ['code']
        ,store: new YoutubeVG.store()
        ,tbar: new YoutubeVG.tbar()
        ,autoHeight: true
        ,hideHeaders: true
        ,enableDragDrop: true
        ,ddGroup: 'youtubevg-grid'
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
    this.store.on('replace', this.setData, this);
    this.on('click', this.onClick);
    this.on('afterrender', this.loadData, this);
    this.on('render', this.initializeDragTarget, this);
    this.on('render', this.initializeDropTarget, this);
};

Ext.extend(YoutubeVG.grid, MODx.grid.LocalGrid, {
    initializeDragTarget: function(grid) {
        grid.dragZone = new Ext.grid.GridDragZone(grid, {
            ddGroup : grid.ddGroup,

            onInitDrag : function(x, y){
                var data = this.dragData;
                var row = this.grid.getSelectionModel().getSelected(),
                    index = this.grid.store.indexOfId(row.id),
                    el = this.grid.getView().getRow(index);

                //this.setDelta(150 , 10);

                this.ddel = el.cloneNode(true);
                this.proxy.update(this.ddel);
            },
        });
    },
    initializeDropTarget: function(grid) {
        grid.dropTarget = new Ext.dd.DropTarget(grid.getView().scroller, {
            ddGroup : grid.ddGroup,
            copy:false,

            notifyDrop : function(dd, e, data){
                var ds = grid.store;
                var sm = grid.getSelectionModel();
                var row = sm.getSelected();
                if(dd.getDragData(e)) {
                    var cindex = dd.getDragData(e).rowIndex;
                    if(typeof(cindex) != "undefined") {
                        ds.replace(data.selections, row.id, cindex);
                        sm.clearSelections();
                    }
                }
            },
        });
    },
    loadData: function() {
        this.store.loadData(this.linkedInputField.value);
    },
    setData: function() {
        var data = this.store.getData();
        this.linkedInputField.value = (!data.length) ? '' : Ext.encode(data);
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
        console.log(record)
        this.store.add(record);
        this.setData();
    }
});

Ext.reg('youtubevg-grid', YoutubeVG.grid);