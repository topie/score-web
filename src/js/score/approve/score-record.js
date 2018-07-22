/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/scoreRecord/scoring": "scoreScoreRecordScoring",
        "/api/score/scoreRecord/scoringForRenshe": "scoreScoreRecordScoringForRenshe",
        "/api/score/scoreRecord/scored": "scoreScoreRecordScored"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreScoreRecordScoring = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="widget-box">' +
                '<div class="widget-header widget-header-flat">' +
                '<h4 class="widget-title smaller">待打分列表</h4>' +
                '<div class="widget-toolbar">' +
                '<div class="pull-right">' +
                '<div class="btn-toolbar inline middle no-margin">' +
                '<div class="btn-group no-margin">' +
                '<button id="id-button" class="btn btn-sm btn-success active">' +
                '<span class="bigger-110">按申请人查看</span>' +
                '</button>' +
                '<button id="in-button" class="btn btn-sm btn-success">' +
                '<span class="bigger-110">按指标查看</span>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="widget-body">' +
                '<div class="widget-main" id="grid">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRecordIdentity("scoring");
            content.find("#in-button").on("click", function () {
                $("#id-button").removeClass("active");
                $("#in-button").addClass("active");
                content.find("#grid").empty();
                scoreRecord("scoring");
            });
            content.find("#id-button").on("click", function () {
                $("#in-button").removeClass("active");
                $("#id-button").addClass("active");
                content.find("#grid").empty();
                scoreRecordIdentity("scoring");
            })
        }
    };
    App.scoreScoreRecordScored = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="widget-box">' +
                '<div class="widget-header widget-header-flat">' +
                '<h4 class="widget-title smaller">已打分列表</h4>' +
                '<div class="widget-toolbar">' +
                '<div class="pull-right">' +
                '<div class="btn-toolbar inline middle no-margin">' +
                '<div class="btn-group no-margin">' +
                '<button id="id-button" class="btn btn-sm btn-success active">' +
                '<span class="bigger-110">按申请人查看</span>' +
                '</button>' +
                '<button id="in-button" class="btn btn-sm btn-success">' +
                '<span class="bigger-110">按指标查看</span>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="widget-body">' +
                '<div class="widget-main" id="grid">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRecordIdentity("scored");
            content.find("#in-button").on("click", function () {
                $("#id-button").removeClass("active");
                $("#in-button").addClass("active");
                content.find("#grid").empty();
                scoreRecord("scored");
            });
            content.find("#id-button").on("click", function () {
                $("#in-button").removeClass("active");
                $("#id-button").addClass("active");
                content.find("#grid").empty();
                scoreRecordIdentity("scored");
            });
            window.App.content.append(content);
        }
    };
    App.scoreScoreRecordScoringForRenshe = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待打分列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRecordForRenshe("scoringForRenshe");
        }
    };
    var scoreRecord = function (type) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/scoreRecord/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var scoreRecordStatus = fd.data.scoreRecordStatus;
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
                    columns.push({
                        title: '打分部门',
                        field: 'opRole'
                    });
                    columns.push({
                        title: '办理进度',
                        field: 'status',
                        format: function (i, d) {
                            return scoreRecordStatus[d.status];
                        }
                    });
                    columns.push({
                        title: '分数',
                        field: 'scoreValue',
                        format: function (i, d) {
                            if (d.status !== 4) {
                                return '-';
                            }
                            return d.scoreValue === null ? '-' : d.scoreValue;
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/scoreRecord/" + type,
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
                                text: "查看",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return d.status === 4;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_view_form_modal",
                                        title: "查看",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/scoreRecord/detailAll";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        data: {
                                            "identityInfoId": d.personId,
                                            "indicatorId": d.indicatorId,
                                            "opRoleId": d.opRoleId
                                        },
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var slist = data.data.sCheckList;
                                            for (var i in slist) {
                                                modal.$body.find("input[name=score]:radio[value='" + slist[i] + "']").attr('checked', 'true');
                                            }
                                            var stList = data.data.sTextList;
                                            for (var i in stList) {
                                                var arr = stList[i].split("_");
                                                modal.$body.find("input[d-indicator=" + arr[0] + "]").val(parseFloat(arr[1]).toFixed(2));
                                            }
                                            modal.$body.find("input").each(function () {
                                                $(this).attr("readonly", "readonly");
                                            });
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "审核打分",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return d.status === 3 || d.status === 1;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_form_modal",
                                        title: "审核打分",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '审核打分',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var sIds = [];
                                                            var sAns = [];
                                                            m.$body.find('input[type=radio]:checked').each(function () {
                                                                sIds.push($(this).val());
                                                            });
                                                            var ms = 0;
                                                            var indicatorId = "";
                                                            var roleId = "";
                                                            m.$body.find('input[type=text]').each(function () {
                                                                if ($(this).attr("name") == "manScore") {
                                                                    if (isNaN($(this).val())) {
                                                                        ms += parseFloat($(this).val());
                                                                        indicatorId = $(this).attr("d-indicator") + "";
                                                                        roleId = $(this).attr("d-roleId") + "";
                                                                    }
                                                                } else {
                                                                    if ($.trim($(this).val()) != '') {
                                                                        sAns.push($(this).attr("d-indicator") + "_" + $(this).val() + "_" + $(this).attr("d-roleId"));
                                                                    }
                                                                }
                                                            });
                                                            if (indicatorId != "" && roleId != "") {
                                                                sAns.push(indicatorId + "_" + ms + "_" + roleId);
                                                            }
                                                            if (m.$body.find('input[type=radio]').length > 0 && sIds.length == 0) {
                                                                bootbox.alert('请选择打分项');
                                                                return;
                                                            }
                                                            if (m.$body.find('input[type=text]').length > 0 && sAns.length == 0) {
                                                                bootbox.alert('请填写打分项');
                                                                return;
                                                            }
                                                            var requestUrl = App.href + "/api/score/scoreRecord/score";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    personId: d.personId,
                                                                    sIds: sIds.toString(),
                                                                    sAns: sAns.toString()
                                                                },
                                                                success: function (data) {
                                                                    grid.reload();
                                                                    m.hide();
                                                                },
                                                                error: function (e) {
                                                                    console.error("请求异常。");
                                                                }
                                                            });
                                                        }
                                                    });

                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/scoreRecord/detailAll";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        data: {
                                            "identityInfoId": d.personId,
                                            "indicatorId": d.indicatorId,
                                            "opRoleId": d.opRoleId
                                        },
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });

                                }
                            }, {
                                text: "申请重新打分",
                                cls: "btn-warning btn-sm",
                                visible: function (i, d) {
                                    return d.status === 4;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_apply_form_modal",
                                        title: "申请重新打分",
                                        destroy: true
                                    }).show();
                                    modal.$body.orangeForm({
                                        id: "apply_form",
                                        name: "apply_form",
                                        method: "POST",
                                        action: App.href + "/api/score/applyScore/apply?scoreRecordId=" + d.id,
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            bootbox.alert('申请也发出，请耐心等待');
                                            modal.hide();
                                        },
                                        submitText: "提交",
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
                                        items: [
                                            {
                                                type: 'textarea',
                                                name: 'reason',
                                                id: 'reason',
                                                label: '申请原因',
                                                rule: {
                                                    required: true
                                                },
                                                message: {
                                                    required: "请输入申请原因"
                                                }
                                            }
                                        ]
                                    });
                                }
                            }, {
                                text: "申请取消资格",
                                cls: "btn-danger btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_apply_form_modal",
                                        title: "申请取消资格",
                                        destroy: true
                                    }).show();
                                    modal.$body.orangeForm({
                                        id: "apply_form",
                                        name: "apply_form",
                                        method: "POST",
                                        action: App.href + "/api/score/applyCancel/apply?personId=" + d.personId,
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            bootbox.alert('申请也发出，请耐心等待');
                                            modal.hide();
                                        },
                                        submitText: "提交",
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
                                        items: [
                                            {
                                                type: 'textarea',
                                                name: 'reason',
                                                id: 'reason',
                                                label: '申请原因',
                                                rule: {
                                                    required: true
                                                },
                                                message: {
                                                    required: "请输入申请原因"
                                                }
                                            }
                                        ]
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
    var scoreRecordForRenshe = function (type) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/scoreRecord/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var scoreRecordStatus = fd.data.scoreRecordStatus;
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
                    columns.push({
                        title: '打分部门',
                        field: 'opRole'
                    });
                    columns.push({
                        title: '办理进度',
                        field: 'status',
                        format: function (i, d) {
                            return scoreRecordStatus[d.status];
                        }
                    });
                    columns.push({
                        title: '分数',
                        field: 'scoreValue',
                        format: function (i, d) {
                            if (d.status !== 4) {
                                return '-';
                            }
                            return d.scoreValue === null ? '-' : d.scoreValue;
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/scoreRecord/" + type,
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
                                text: "查看",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return d.status === 4;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_view_form_modal",
                                        title: "查看",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/scoreRecord/detailAll?identityInfoId=" + d.personId + "&indicatorId=" + d.indicatorId;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var slist = data.data.sCheckList;
                                            for (var i in slist) {
                                                modal.$body.find("input[name=score]:radio[value='" + slist[i] + "']").attr('checked', 'true');
                                            }
                                            var stList = data.data.sTextList;
                                            for (var i in stList) {
                                                var arr = stList[i].split("_");
                                                modal.$body.find("input[d-indicator=" + arr[0] + "]").val(parseFloat(arr[1]).toFixed(2));
                                            }
                                            modal.$body.find("input").each(function () {
                                                $(this).attr("readonly", "readonly");
                                            });
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "审核打分",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return d.status === 3 || d.status === 1;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_form_modal",
                                        title: "审核打分",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '审核打分',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var sIds = [];
                                                            var sAns = [];
                                                            m.$body.find('input[type=radio]:checked').each(function () {
                                                                sIds.push($(this).val());
                                                            });
                                                            var ms = 0;
                                                            var indicatorId = "";
                                                            var roleId = "";
                                                            m.$body.find('input[type=text]').each(function () {
                                                                if ($(this).attr("name") == "manScore") {
                                                                    if (isNaN($(this).val())) {
                                                                        ms += parseFloat($(this).val());
                                                                        indicatorId = $(this).attr("d-indicator") + "";
                                                                        roleId = $(this).attr("d-roleId") + "";
                                                                    }
                                                                } else {
                                                                    if ($.trim($(this).val()) != '') {
                                                                        sAns.push($(this).attr("d-indicator") + "_" + $(this).val() + "_" + $(this).attr("d-roleId"));
                                                                    }
                                                                }
                                                            });
                                                            if (m.$body.find('input[type=radio]').length > 0 && sIds.length == 0) {
                                                                bootbox.alert('请选择打分项');
                                                                return;
                                                            }
                                                            if (m.$body.find('input[type=text]').length > 0 && sAns.length == 0) {
                                                                bootbox.alert('请填写打分项');
                                                                return;
                                                            }
                                                            var requestUrl = App.href + "/api/score/scoreRecord/score";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    personId: d.personId,
                                                                    sIds: sIds.toString(),
                                                                    sAns: sAns.toString()
                                                                },
                                                                success: function (data) {
                                                                    grid.reload();
                                                                    m.hide();
                                                                },
                                                                error: function (e) {
                                                                    console.error("请求异常。");
                                                                }
                                                            });
                                                        }
                                                    });

                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/scoreRecord/detailAll";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        data: {
                                            "identityInfoId": d.personId,
                                            "indicatorId": d.indicatorId,
                                            "opRoleId": d.opRoleId
                                        },
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });

                                }
                            }, {
                                text: "申请重新打分",
                                cls: "btn-warning btn-sm",
                                visible: function (i, d) {
                                    return d.status === 4;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_apply_form_modal",
                                        title: "申请重新打分",
                                        destroy: true
                                    }).show();
                                    modal.$body.orangeForm({
                                        id: "apply_form",
                                        name: "apply_form",
                                        method: "POST",
                                        action: App.href + "/api/score/applyScore/apply?scoreRecordId=" + d.id,
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            bootbox.alert('申请也发出，请耐心等待');
                                            modal.hide();
                                        },
                                        submitText: "提交",
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
                                        items: [
                                            {
                                                type: 'textarea',
                                                name: 'reason',
                                                id: 'reason',
                                                label: '申请原因',
                                                rule: {
                                                    required: true
                                                },
                                                message: {
                                                    required: "请输入申请原因"
                                                }
                                            }
                                        ]
                                    });
                                }
                            }, {
                                text: "申请取消资格",
                                cls: "btn-danger btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_apply_form_modal",
                                        title: "申请取消资格",
                                        destroy: true
                                    }).show();
                                    modal.$body.orangeForm({
                                        id: "apply_form",
                                        name: "apply_form",
                                        method: "POST",
                                        action: App.href + "/api/score/applyCancel/apply?personId=" + d.personId,
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            bootbox.alert('申请也发出，请耐心等待');
                                            modal.hide();
                                        },
                                        submitText: "提交",
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
                                        items: [
                                            {
                                                type: 'textarea',
                                                name: 'reason',
                                                id: 'reason',
                                                label: '申请原因',
                                                rule: {
                                                    required: true
                                                },
                                                message: {
                                                    required: "请输入申请原因"
                                                }
                                            }
                                        ]
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
    var scoreRecordIdentity = function (type) {
        var searchItems = [
            {
                type: "select",
                label: "批次",
                name: "batchId",
                itemsUrl: App.href + '/api/score/batchConf/options'
            }, {
                type: 'text',
                label: '申请人姓名',
                name: 'personName'
            }, {
                type: 'text',
                label: '申请人身份证',
                name: 'personIdNum'
            }
        ];
        var columns = [
            {
                title: '申请人ID',
                field: 'personId'
            }, {
                title: '申请人姓名',
                field: 'personName'
            },
            {
                title: '申请人身份证',
                field: 'personIdNum'
            },
            {
                title: '企业',
                field: 'companyName'
            }
        ];
        var grid;
        var options = {
            url: App.href + "/api/score/scoreRecord/identityInfo/" + type,
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
                    text: "审核表打印(空白)",
                    cls: "btn-info btn-sm",
                    visible: function (i, d) {
                        return type === "scoring";
                    },
                    handle: function (index, d) {
                        var requestUrl = App.href + "/api/score/print/approveEmptyDoc";
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                $.orangeModal({
                                    title: "审核表打印(空白)",
                                    destroy: true,
                                    buttons: [
                                        {
                                            text: '打印',
                                            cls: 'btn btn-primary',
                                            handle: function (m) {
                                                m.$body.print({
                                                    globalStyles: true,
                                                    mediaPrint: false,
                                                    stylesheet: null,
                                                    noPrintSelector: ".no-print",
                                                    iframe: true,
                                                    append: null,
                                                    prepend: null,
                                                    manuallyCopyFormValues: true,
                                                    deferred: $.Deferred()
                                                });
                                            }
                                        }, {
                                            type: 'button',
                                            text: '关闭',
                                            cls: "btn btn-default",
                                            handle: function (m) {
                                                m.hide()
                                            }
                                        }
                                    ]
                                }).show().$body.html(data.data.html);
                            },
                            error: function (e) {
                                console.error("请求异常。");
                            }
                        });
                    }
                }, {
                    text: "审核表打印",
                    cls: "btn-info btn-sm",
                    visible: function (i, d) {
                        return type !== "scoring";
                    },
                    handle: function (index, d) {
                        var requestUrl = App.href + "/api/score/scoreRecord/identityInfo/approveDoc?identityInfoId=" + d.personId;
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                $.orangeModal({
                                    title: "审核表打印",
                                    destroy: true,
                                    buttons: [
                                        {
                                            text: '打印',
                                            cls: 'btn btn-primary',
                                            handle: function (m) {
                                                m.$body.print({
                                                    globalStyles: true,
                                                    mediaPrint: false,
                                                    stylesheet: null,
                                                    noPrintSelector: ".no-print",
                                                    iframe: true,
                                                    append: null,
                                                    prepend: null,
                                                    manuallyCopyFormValues: true,
                                                    deferred: $.Deferred()
                                                });
                                            }
                                        }, {
                                            type: 'button',
                                            text: '关闭',
                                            cls: "btn btn-default",
                                            handle: function (m) {
                                                m.hide()
                                            }
                                        }
                                    ]
                                }).show().$body.html(data.data.html);
                            },
                            error: function (e) {
                                console.error("请求异常。");
                            }
                        });
                    }
                }, {
                    text: "审核打分",
                    cls: "btn-primary btn-sm",
                    visible: function (i, d) {
                        return type === "scoring";
                    },
                    handle: function (index, d) {
                        var modal = $.orangeModal({
                            id: "score_form_modal",
                            title: "审核打分",
                            destroy: true,
                            buttons: [
                                {
                                    text: '审核打分',
                                    cls: 'btn btn-info',
                                    handle: function (m) {
                                        bootbox.confirm("确定该操作?", function (result) {
                                            if (result) {
                                                var sIds = [];
                                                var sAns = [];
                                                m.$body.find('input[type=radio]:checked').each(function () {
                                                    sIds.push($(this).val());
                                                });
                                                var ms = 0;
                                                var indicatorId = "";
                                                var roleId = "";
                                                m.$body.find('input[type=text]').each(function () {
                                                    if ($(this).attr("d-name") == "manScore") {
                                                        console.log($(this).val());
                                                        if (parseFloat($(this).val()) > 0) {
                                                            ms += parseFloat($(this).val());
                                                            indicatorId = $(this).attr("d-indicator") + "";
                                                            roleId = $(this).attr("d-roleId") + "";
                                                        }
                                                    } else {
                                                        if ($.trim($(this).val()) != '') {
                                                            sAns.push($(this).attr("d-indicator") + "_" + $(this).val() + "_" + $(this).attr("d-roleId"));
                                                        }
                                                    }
                                                });
                                                if (indicatorId != "" && roleId != "") {
                                                    sAns.push(indicatorId + "_" + ms + "_" + roleId);
                                                }
                                                if (sAns.length == 0 && sIds.length == 0) {
                                                    bootbox.alert('请打分');
                                                    return;
                                                }
                                                var requestUrl = App.href + "/api/score/scoreRecord/identityInfo/score";
                                                $.ajax({
                                                    type: "POST",
                                                    dataType: "json",
                                                    url: requestUrl,
                                                    data: {
                                                        personId: d.personId,
                                                        sIds: sIds.toString(),
                                                        sAns: sAns.toString()
                                                    },
                                                    success: function (data) {
                                                        grid.reload();
                                                        m.hide();
                                                    },
                                                    error: function (e) {
                                                        console.error("请求异常。");
                                                    }
                                                });
                                            }
                                        });

                                    }
                                }
                            ]
                        }).show();
                        var requestUrl = App.href + "/api/score/scoreRecord/identityInfo/detailAll?identityInfoId=" + d.personId;
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                modal.$body.html(data.data.html);
                                var slist = data.data.sCheckList;
                                for (var i in slist) {
                                    var arr = slist[i].split("_");
                                    modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]:radio[value='" + slist[i] + "']").attr('checked', 'true');
                                }
                                var stList = data.data.sTextList;
                                for (var i in stList) {
                                    var arr = stList[i].split("_");
                                    modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]").val(parseFloat(arr[1]).toFixed(2));
                                }
                            },
                            error: function (e) {
                                console.error("请求异常。");
                            }
                        });

                    }
                }, {
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    visible: function (i, d) {
                        return type === "scored";
                    },
                    handle: function (index, d) {
                        var modal = $.orangeModal({
                            id: "score_form_modal",
                            title: "查看打分",
                            destroy: true
                        }).show();
                        var requestUrl = App.href + "/api/score/scoreRecord/identityInfo/detailAll?view=1&identityInfoId=" + d.personId;
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                modal.$body.html(data.data.html);
                                var slist = data.data.sCheckList;
                                for (var i in slist) {
                                    var arr = slist[i].split("_");
                                    modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]:radio[value='" + slist[i] + "']").attr('checked', 'true');
                                }
                                var stList = data.data.sTextList;
                                for (var i in stList) {
                                    var arr = stList[i].split("_");
                                    modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]").val(parseFloat(arr[1]).toFixed(2));
                                }
                            },
                            error: function (e) {
                                console.error("请求异常。");
                            }
                        });

                    }
                }, {
                    text: "申请取消资格",
                    cls: "btn-danger btn-sm",
                    handle: function (index, d) {
                        var modal = $.orangeModal({
                            id: "score_apply_form_modal",
                            title: "申请取消资格",
                            destroy: true
                        }).show();
                        modal.$body.orangeForm({
                            id: "apply_form",
                            name: "apply_form",
                            method: "POST",
                            action: App.href + "/api/score/applyCancel/apply?personId=" + d.personId,
                            ajaxSubmit: true,
                            ajaxSuccess: function () {
                                bootbox.alert('申请也发出，请耐心等待');
                                modal.hide();
                            },
                            submitText: "提交",
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
                            items: [
                                {
                                    type: 'textarea',
                                    name: 'reason',
                                    id: 'reason',
                                    label: '申请原因',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入申请原因"
                                    }
                                }
                            ]
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
        grid = window.App.content.find("#grid").orangeGrid(options);
    };

})(jQuery, window, document);
