/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/indicator/list": "scoreIndicator"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreIndicator = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/indicator/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data;
                    var columns = [];
                    $.each(formItems, function (ii, dd) {
                        if (dd.type === 'text' || dd.name === 'id') {
                            var column = {
                                title: dd.label,
                                field: dd.name
                            };
                            columns.push(column);
                        }
                        if (dd.type === 'tree') {
                            dd.items = [];
                            dd.url = App.href + dd.url;
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/indicator/list",
                        contentType: "table",
                        contentTypeItems: "table,card,list",
                        pageNum: 1,//当前页码
                        pageSize: 15,//每页显示条数
                        idField: "id",//id域指定
                        headField: "id",
                        showCheck: true,//是否显示checkbox
                        checkboxWidth: "3%",
                        showIndexNum: false,
                        indexNumWidth: "5%",
                        pageSelect: [2, 15, 30, 50],
                        columns: columns,
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [{
                            text: "编辑",
                            cls: "btn-primary btn-sm",
                            handle: function (index, d) {
                                var modal = $.orangeModal({
                                    id: "edit_form_modal",
                                    title: "编辑",
                                    destroy: true
                                }).show();
                                var form = modal.$body.orangeForm({
                                    id: "edit_form",
                                    name: "edit_form",
                                    method: "POST",
                                    action: App.href + "/api/score/indicator/update",
                                    ajaxSubmit: true,
                                    ajaxSuccess: function () {
                                        modal.hide();
                                        grid.reload();
                                    },
                                    submitText: "保存",
                                    showReset: true,
                                    resetText: "重置",
                                    isValidate: true,
                                    labelInline: true,
                                    buttons: [{
                                        type: 'button',
                                        text: '关闭',
                                        handle: function () {
                                            modal.hide();
                                        }
                                    }],
                                    buttonsAlign: "center",
                                    items: formItems
                                });
                                form.loadRemote(App.href + "/api/score/indicator/detail?id=" + d.id);
                            }
                        }, {
                            text: "指标选项管理",
                            cls: "btn-info btn-sm",
                            handle: function (index, data) {
                                indicatorItem(data);
                            }
                        }, {
                            text: "删除",
                            cls: "btn-danger btn-sm",
                            handle: function (index, data) {
                                bootbox.confirm("确定该操作?", function (result) {
                                    if (result) {
                                        var requestUrl = App.href + "/api/score/indicator/delete";
                                        $.ajax({
                                            type: "POST",
                                            dataType: "json",
                                            data: {
                                                id: data.id
                                            },
                                            url: requestUrl,
                                            success: function (data) {
                                                if (data.code === 200) {
                                                    grid.reload();
                                                } else {
                                                    alert(data.message);
                                                }
                                            },
                                            error: function (e) {
                                                alert("请求异常。");
                                            }
                                        });
                                    }
                                });
                            }
                        }],
                        tools: [
                            {
                                text: " 添 加",
                                cls: "btn btn-primary",
                                icon: "fa fa-plus",
                                handle: function (grid) {
                                    var modal = $.orangeModal({
                                        id: "add_modal",
                                        title: "添加",
                                        destroy: true
                                    }).show();
                                    var form = modal.$body.orangeForm({
                                        id: "add_form",
                                        name: "add_form",
                                        method: "POST",
                                        action: App.href + "/api/score/indicator/insert",
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            modal.hide();
                                            grid.reload();
                                        },
                                        submitText: "保存",//保存按钮的文本
                                        showReset: true,//是否显示重置按钮
                                        resetText: "重置",//重置按钮文本
                                        isValidate: true,//开启验证
                                        labelInline: true,
                                        buttons: [{
                                            type: 'button',
                                            text: '关闭',
                                            handle: function () {
                                                modal.hide();
                                                grid.reload();
                                            }
                                        }],
                                        buttonsAlign: "center",
                                        items: formItems
                                    });
                                }
                            }, {
                                text: "生成json",
                                cls: "btn btn-info",
                                handle: function (grid) {
                                    var requestUrl = App.href + "/api/score/indicator/generateJson";
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        data: {
                                            batchId: 1
                                        },
                                        url: requestUrl,
                                        success: function (data) {
                                            if (data.code === 200) {
                                                var m = $.orangeModal({
                                                    id: "json_form_modal",
                                                    title: "JSON预览",
                                                    destroy: true
                                                }).show();
                                                var json = JSON.parse(data.data.html);
                                                var items = [];
                                                $.each(json, function (i, d) {
                                                    var item = {
                                                        name: d.id,
                                                        label: d.name,
                                                        id: d.id
                                                    };
                                                    if (d.itemType == 0) {
                                                        item.type = 'radioGroup';
                                                        item.inline = false;
                                                        item.items = [];
                                                        for (var j in d.items) {
                                                            item.items.push(d.items[j]);
                                                        }
                                                    } else {
                                                        item.type = 'text';
                                                    }
                                                    items.push(item);
                                                });
                                                m.$body.orangeForm({
                                                    id: "add_form",
                                                    name: "add_form",
                                                    method: "POST",
                                                    action: App.href + "/api/score/indicator/insert",
                                                    ajaxSubmit: true,
                                                    ajaxSuccess: function () {
                                                    },
                                                    submitText: "保存",//保存按钮的文本
                                                    showReset: true,//是否显示重置按钮
                                                    resetText: "重置",//重置按钮文本
                                                    isValidate: true,//开启验证
                                                    labelInline: true,
                                                    viewMode: true,
                                                    buttons: [{
                                                        type: 'button',
                                                        text: '关闭',
                                                        handle: function () {
                                                            modal.hide();
                                                            grid.reload();
                                                        }
                                                    }],
                                                    buttonsAlign: "center",
                                                    items: items
                                                });
                                            } else {
                                                alert(data.message);
                                            }
                                        },
                                        error: function (e) {
                                            alert("请求异常。");
                                        }
                                    });
                                }
                            }
                        ],
                        search: {
                            rowEleNum: 2,
                            //搜索栏元素
                            items: [
                                {
                                    type: "text",
                                    label: "ID",
                                    name: "id",
                                    placeholder: "输入ID"
                                }
                            ]
                        }
                    };
                    grid = window.App.content.find("#grid").orangeGrid(options);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                alert("请求异常。");
            }
        });
    };
    var indicatorItem = function (indicator) {
        var modal = $.orangeModal({
            id: "manager_item_modal",
            title: "选项管理",
            destroy: true
        }).show();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/indicatorItem/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data;
                    var columns = [];
                    $.each(formItems, function (ii, dd) {
                        if (dd.type === 'text' || dd.name === 'id') {
                            var column = {
                                title: dd.label,
                                field: dd.name
                            };
                            columns.push(column);
                        }
                        if (dd.name === 'indicatorId') {
                            dd.value = indicator.id;
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/indicatorItem/list?indicatorId=" + indicator.id,
                        contentType: "table",
                        contentTypeItems: "table,card,list",
                        pageNum: 1,//当前页码
                        pageSize: 15,//每页显示条数
                        idField: "id",//id域指定
                        headField: "id",
                        showCheck: true,//是否显示checkbox
                        checkboxWidth: "3%",
                        showIndexNum: false,
                        indexNumWidth: "5%",
                        pageSelect: [2, 15, 30, 50],
                        columns: columns,
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [{
                            text: "编辑",
                            cls: "btn-primary btn-sm",
                            handle: function (index, d) {
                                var modal = $.orangeModal({
                                    id: "edit_form_modal",
                                    title: "编辑",
                                    destroy: true
                                }).show();
                                var form = modal.$body.orangeForm({
                                    id: "edit_form",
                                    name: "edit_form",
                                    method: "POST",
                                    action: App.href + "/api/score/indicatorItem/update",
                                    ajaxSubmit: true,
                                    ajaxSuccess: function () {
                                        modal.hide();
                                        grid.reload();
                                    },
                                    submitText: "保存",
                                    showReset: true,
                                    resetText: "重置",
                                    isValidate: true,
                                    labelInline: true,
                                    buttons: [{
                                        type: 'button',
                                        text: '关闭',
                                        handle: function () {
                                            modal.hide();
                                        }
                                    }],
                                    buttonsAlign: "center",
                                    items: formItems
                                });
                                form.loadRemote(App.href + "/api/score/indicatorItem/detail?id=" + d.id);
                            }
                        }, {
                            text: "删除",
                            cls: "btn-danger btn-sm",
                            handle: function (index, data) {
                                bootbox.confirm("确定该操作?", function (result) {
                                    if (result) {
                                        var requestUrl = App.href + "/api/score/indicatorItem/delete";
                                        $.ajax({
                                            type: "POST",
                                            dataType: "json",
                                            data: {
                                                id: data.id
                                            },
                                            url: requestUrl,
                                            success: function (data) {
                                                if (data.code === 200) {
                                                    grid.reload();
                                                } else {
                                                    alert(data.message);
                                                }
                                            },
                                            error: function (e) {
                                                alert("请求异常。");
                                            }
                                        });
                                    }
                                });
                            }
                        }],
                        tools: [
                            {
                                text: " 添 加",
                                cls: "btn btn-primary",
                                icon: "fa fa-plus",
                                handle: function (grid) {
                                    var modal = $.orangeModal({
                                        id: "add_form_modal",
                                        title: "添加",
                                        destroy: true
                                    }).show();
                                    var form = modal.$body.orangeForm({
                                        id: "add_form",
                                        name: "add_form",
                                        method: "POST",
                                        action: App.href + "/api/score/indicatorItem/insert",
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            modal.hide();
                                            grid.reload();
                                        },
                                        submitText: "保存",//保存按钮的文本
                                        showReset: true,//是否显示重置按钮
                                        resetText: "重置",//重置按钮文本
                                        isValidate: true,//开启验证
                                        labelInline: true,
                                        buttons: [{
                                            type: 'button',
                                            text: '关闭',
                                            handle: function () {
                                                modal.hide();
                                                grid.reload();
                                            }
                                        }],
                                        buttonsAlign: "center",
                                        items: formItems
                                    });
                                }
                            }
                        ],
                        search: {
                            rowEleNum: 2,
                            //搜索栏元素
                            items: [
                                {
                                    type: "text",
                                    label: "ID",
                                    name: "id",
                                    placeholder: "输入ID"
                                }
                            ]
                        }
                    };
                    grid = modal.$body.orangeGrid(options);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                alert("请求异常。");
            }
        });
    };
})(jQuery, window, document);
