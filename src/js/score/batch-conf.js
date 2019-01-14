/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/batchConf/list": "scoreBatchConf"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreBatchConf = {
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
            url: App.href + "/api/score/batchConf/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var batchStatus = fd.data.batchStatus;
                    var batchProcess = fd.data.batchProcess;
                    if (searchItems == null)
                        searchItems = [];
                    var columns = [];
                    $.each(formItems, function (ii, dd) {
                        if (dd.type === 'text' || dd.name === 'id') {
                            var column = {
                                title: dd.label,
                                field: dd.name
                            };
                            columns.push(column);
                        }
                        if (dd.itemsUrl !== undefined) {
                            dd.itemsUrl = App.href + dd.itemsUrl;
                        }
                        if (dd.url !== undefined) {
                            dd.url = App.href + dd.url;
                        }
                    });
                    columns.push(
                        {
                            title: '批次状态',
                            field: 'status',
                            format: function (ii, dd) {
                                return batchStatus[dd.status];
                            }
                        }
                    );
                    columns.push(
                        {
                            title: '批次进度',
                            field: 'process',
                            format: function (ii, dd) {
                                return batchProcess[dd.process];
                            }
                        }
                    );
                    var grid;
                    var options = {
                        url: App.href + "/api/score/batchConf/list",
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
                        actionColumns: [
                            {
                                text: "查看预约",
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_form_modal",
                                        title: "查看预约信息",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/batchConf/acceptDateList?batchId=" + d.id;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
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
                                        rowEleNum: 2,
                                        method: "POST",
                                        action: App.href + "/api/score/batchConf/update",
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
                                    form.loadRemote(App.href + "/api/score/batchConf/detail?id=" + d.id);
                                }
                            }, {
                                text: "批次设置",
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    dateConfig(d);
                                }
                            }, {
                                text: "人数统计",
                                cls: "btn-primary btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_form_modal",
                                        title: "人数统计",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/applicationCount?batchId=" + d.id;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "给公安提供数据",
                                visible: function (i, d) {
                                    return parseInt(d.process) >= 3
                                },
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    var requestUrl = App.href + "/api/score/info/identityInfo/provideDataToPolice?batchId=" + d.id;
                                    window.location.href = requestUrl;
                                }
                            },
                            {
                                text: "有落户资格的申请人名单与收件地址",
                                visible: function (i, d) {
                                    return parseInt(d.process) >= 3
                                },
                                cls: "btn-primary btn-sm",
                                handle: function (index, d) {
                                    window.location.href = App.href + "/api/score/info/identityInfo/identityInfoRecipient?batchId=" + d.id;
                                }
                            },
                            {
                                text: "删除",
                                cls: "btn-danger btn-sm",
                                handle: function (index, data) {
                                    bootbox.confirm("确定该操作?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/batchConf/delete";
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
                                                    console.error("请求异常。");
                                                }
                                            });
                                        }
                                    });
                                }
                            }, {
                                text: "设置开始",
                                visible: function (i, d) {
                                    return d.status === 0
                                },
                                cls: "btn-success btn-sm",
                                handle: function (index, data) {
                                    setStatus(data.id, 1, function () {
                                        grid.reload();
                                    });
                                }
                            }, {
                                text: "设置过期",
                                visible: function (i, d) {
                                    return d.status === 1
                                },
                                cls: "btn-warning btn-sm",
                                handle: function (index, data) {
                                    setStatus(data.id, 2, function () {
                                        grid.reload();
                                    });
                                }
                            }
                        ],
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
                                        rowEleNum: 2,
                                        method: "POST",
                                        action: App.href + "/api/score/batchConf/insert",
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
                            items: searchItems
                        }
                    };
                    grid = window.App.content.find("#grid").orangeGrid(options);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                console.error("请求异常。");
            }
        });
    };

    var setStatus = function (id, status, cb) {
        bootbox.confirm("确定该操作?", function (result) {
            if (result) {
                var requestUrl = App.href + "/api/score/batchConf/updateStatus";
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: id,
                        status: status
                    },
                    url: requestUrl,
                    success: function (data) {
                        if (data.code === 200) {
                            cb();
                        } else {
                            alert(data.message);
                        }
                    },
                    error: function (e) {
                        console.error("请求异常。");
                    }
                });
            }
        });
    };
    var dateConfig = function (d) {
        var modal = $.orangeModal({
            id: "detail_config_modal",
            title: "批次设置",
            destroy: true
        }).show();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/acceptDateConf/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var addressMap = fd.data.addressMap;
                    if (searchItems == null)
                        searchItems = [];
                    var columns = [];
                    $.each(formItems, function (ii, dd) {
                        if (dd.type === 'text' || dd.name === 'id') {
                            var column = {
                                title: dd.label,
                                field: dd.name
                            };
                            columns.push(column);
                        }
                        if (dd.itemsUrl !== undefined) {
                            dd.itemsUrl = App.href + dd.itemsUrl;
                        }
                        if (dd.url !== undefined) {
                            dd.url = App.href + dd.url;
                        }
                        if (dd.name === 'batchId') {
                            dd.value = d.id;
                        }
                    });
                    columns.push({
                        title: '受理地址',
                        field: 'addressId',
                        format: function (iii, ddd) {
                            return addressMap[ddd.addressId];
                        }
                    });
                    columns.push({
                        title: '周',
                        field: 'weekDay'
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/acceptDateConf/list?batchId=" + d.id,
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
                                    action: App.href + "/api/score/acceptDateConf/update",
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
                                form.loadRemote(App.href + "/api/score/acceptDateConf/detail?id=" + d.id);
                            }
                        }, {
                            text: "删除",
                            cls: "btn-danger btn-sm",
                            handle: function (index, data) {
                                bootbox.confirm("确定该操作?", function (result) {
                                    if (result) {
                                        var requestUrl = App.href + "/api/score/acceptDateConf/delete";
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
                                                console.error("请求异常。");
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
                                        action: App.href + "/api/score/acceptDateConf/insert",
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
                            items: searchItems
                        }
                    };
                    grid = modal.$body.orangeGrid(options);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                console.error("请求异常。");
            }
        });
    };
})(jQuery, window, document);
