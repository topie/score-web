/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/basicConf/list": "scoreBasicConf"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreBasicConf = {
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
        var formItems = [
            {
                type: 'hidden',
                label: 'ID',
                name: 'id',
                id: 'id'
            }, {
                type: 'text',
                label: '自测合格分数',
                name: 'selfTestScoreLine',
                id: 'selfTestScoreLine',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入"
                }
            }, {
                type: 'text',
                label: '自测评次数限制',
                name: 'selfTestLimit',
                id: 'selfTestLimit',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入"
                }
            }, {
                type: 'text',
                label: '预约限制次数',
                name: 'appointmentLimit',
                id: 'appointmentLimit',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入"
                }
            }, {
                type: 'text',
                label: '经办人信息修改次数限制',
                name: 'companyEditLimit',
                id: 'companyEditLimit',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入"
                }
            }, {
                type: 'text',
                label: '发布天数',
                name: 'publishDay',
                id: 'publishDay',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入"
                }
            }, {
                type: 'text',
                label: '公示天数',
                name: 'noticeDay',
                id: 'noticeDay',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入"
                }
            }
        ];
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
        var grid;
        var options = {
            url: App.href + "/api/score/basicConf/list",
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
                        action: App.href + "/api/score/basicConf/update",
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
                    form.loadRemote(App.href + "/api/score/basicConf/detail?id=" + d.id);
                }
            }, {
                text: "删除",
                cls: "btn-danger btn-sm",
                handle: function (index, data) {
                    bootbox.confirm("确定该操作?", function (result) {
                        if (result) {
                            var requestUrl = App.href + "/api/score/basicConf/delete";
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
                            action: App.href + "/api/score/basicConf/insert",
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
            ]
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
    }
})(jQuery, window, document);
