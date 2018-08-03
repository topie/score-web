/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/applyScore/mine": "scoreApplyScoreMine",
        "/api/score/applyScore/ing": "scoreApplyScoreIng",
        "/api/score/applyScore/agree": "scoreApplyScoreAgree",
        "/api/score/applyScore/disAgree": "scoreApplyScoreDisAgree"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreApplyScoreMine = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">我的申请</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents("mine");
        }
    };
    App.scoreApplyScoreIng = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待审批列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents("ing");
        }
    };
    App.scoreApplyScoreAgree = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">审批通过列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents("agree");
        }
    };
    App.scoreApplyScoreDisAgree = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">审批不通过列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            initEvents("disAgree");
        }
    };
    var initEvents = function (type) {
        var grid;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/applyScore/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var companyNames = fd.data.companyNames;
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
                            title: '申请人名',
                            field: 'personName'
                        }
                    );
                    columns.push(
                        {
                            title: '申请人企业',
                            field: 'companyId',
                            format: function (i, d) {
                                return companyNames[d.companyId];
                            }
                        }
                    );
                    var actionColumns = [
                        {
                            text: "查看",
                            cls: "btn-primary btn-sm",
                            handle: function (index, d) {
                                var modal = $.orangeModal({
                                    id: "view_form_modal",
                                    title: "查看",
                                    destroy: true
                                }).show();
                                var form = modal.$body.orangeForm({
                                    id: "view_form",
                                    name: "view_form",
                                    method: "POST",
                                    ajaxSubmit: true,
                                    viewMode: true,
                                    ajaxSuccess: function () {
                                        modal.hide();
                                        grid.reload();
                                    },
                                    submitText: "保存",
                                    showReset: false,
                                    showSubmit: false,
                                    resetText: "重置",
                                    isValidate: true,
                                    labelInline: true,
                                    buttons: [
                                        {
                                            type: 'button',
                                            text: '关闭',
                                            handle: function () {
                                                modal.hide();
                                            }
                                        }
                                    ],
                                    buttonsAlign: "center",
                                    items: formItems
                                });
                                form.loadRemote(App.href + "/api/score/applyScore/detail?id=" + d.id);
                            }
                        }
                    ];
                    if (type === "ing") {
                        actionColumns.push({
                            text: "审核",
                            cls: "btn-danger btn-sm",
                            handle: function (index, d) {
                                var modal = $.orangeModal({
                                    id: "approve_form_modal",
                                    title: "审核",
                                    destroy: true,
                                    buttons: [
                                        {
                                            type: 'button',
                                            text: '通过',
                                            cls: 'btn btn-info',
                                            handle: function (mm) {
                                                bootbox.confirm("确定该操作?", function (result) {
                                                    if (result) {
                                                        var requestUrl = App.href + "/api/score/applyScore/agree";
                                                        $.ajax({
                                                            type: "POST",
                                                            dataType: "json",
                                                            data: {
                                                                id: d.id
                                                            },
                                                            url: requestUrl,
                                                            success: function (data) {
                                                                if (data.code === 200) {
                                                                    mm.hide();
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
                                            type: 'button',
                                            text: '驳回',
                                            cls: 'btn btn-danger',
                                            handle: function (mm) {
                                                var m = $.orangeModal({
                                                    id: "disagree_form_modal",
                                                    title: "驳回",
                                                    destroy: true,
                                                    width: '600px',
                                                    height: '400px',
                                                    buttons: [{
                                                        type: 'button',
                                                        text: '关闭',
                                                        handle: function (m) {
                                                            m.hide();
                                                        }
                                                    }]
                                                }).show();
                                                m.$body.orangeForm({
                                                    id: "disagree_form",
                                                    name: "disagree_form",
                                                    method: "POST",
                                                    action: App.href + "/api/score/applyScore/disAgree?id=" + d.id,
                                                    ajaxSubmit: true,
                                                    ajaxSuccess: function () {
                                                        m.hide();
                                                        mm.hide();
                                                    },
                                                    submitText: "提交",
                                                    showReset: true,
                                                    resetText: "重置",
                                                    isValidate: true,
                                                    labelInline: true,
                                                    buttonsAlign: "center",
                                                    items: [
                                                        {
                                                            type: 'textarea',
                                                            name: 'approveContent',
                                                            id: 'approveContent',
                                                            label: '驳回原因',
                                                            rule: {
                                                                required: true
                                                            },
                                                            message: {
                                                                required: "请输入驳回原因"
                                                            }
                                                        }
                                                    ]
                                                });
                                            }
                                        }, {
                                            type: 'button',
                                            text: '关闭',
                                            handle: function (m) {
                                                m.hide();
                                            }
                                        }]
                                }).show();
                                var form = modal.$body.orangeForm({
                                    id: "approve_form",
                                    name: "approve_form",
                                    method: "POST",
                                    ajaxSubmit: true,
                                    viewMode: true,
                                    ajaxSuccess: function () {
                                        modal.hide();
                                        grid.reload();
                                    },
                                    submitText: "保存",
                                    showReset: false,
                                    showSubmit: false,
                                    resetText: "重置",
                                    isValidate: true,
                                    labelInline: true,
                                    buttonsAlign: "center",
                                    items: formItems
                                });
                                form.loadRemote(App.href + "/api/score/applyScore/detail?id=" + d.id);
                            }
                        });
                    }

                    var options = {
                        url: App.href + "/api/score/applyScore/" + type,
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
                        actionColumns: actionColumns,
                        search: {
                            rowEleNum: 2,
                            //搜索栏元素
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
    }
})(jQuery, window, document);
