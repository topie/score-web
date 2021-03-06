/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/scoreRecord/scoring": "scoreScoreRecordScoring",
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
                    searchItems.push({
                        type: 'select',
                        label: '打分日期查询设置',
                        name: 'dateSearch',
                        items: [
                            {
                                text: '关闭',
                                value: 0
                            }, {
                                text: '开启',
                                value: 1
                            }
                        ]
                    },{
                        type: "datepicker",
                        label: "打分日期",
                        name: "scoreDate",
                        single: true
                    });
                    var columns = [];
                    $.each(formItems, function (ii, dd) {
                        if (dd.type === 'text' || dd.name === 'id') {
                            var column = {};
                            if (dd.name == 'personName') {
                                column = {
                                    title: dd.label,
                                    field: dd.name,
                                    dataClick: function (i, d) {
                                        var requestUrl = App.href + "/api/score/info/identityInfo/detail";
                                        $.ajax({
                                            type: "GET",
                                            dataType: "json",
                                            url: requestUrl,
                                            data: {
                                                id: d.personId
                                            },
                                            success: function (data) {
                                                var hostName = window.location.host;
                                                var img = {};
                                                if (hostName == "172.16.200.68") {
                                                    img = $('<img width="400" height="300" src="' + data.data.idCardPositive.replace("218.67.246.52:80", "172.16.200.68:8092") + '"><br><img  width="400" height="300"  src="' + data.data.idCardOpposite.replace("218.67.246.52:80", "172.16.200.68:8092") + '">');
                                                } else {
                                                    img = $('<img width="400" height="300" src="' + data.data.idCardPositive + '"><br><img  width="400" height="300"  src="' + data.data.idCardOpposite + '">');
                                                }
                                                $.orangeModal({
                                                    title: "图片预览",
                                                    destroy: true, buttons: [
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
                                                }).show().$body.html(img);
                                            },
                                            error: function (e) {
                                                console.error("请求异常。");
                                            }
                                        });
                                    }
                                };
                            } else {
                                column = {
                                    title: dd.label,
                                    field: dd.name
                                };
                            }
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
                        title: '材料受理时间',
                        field: 'submitDate',
                        sort: true
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
                            return d.scoreValue === null ? '-' : parseFloat(d.scoreValue).toFixed(2);
                        }
                    });
                    columns.push({
                        title: '办理人',
                        field: 'opUser'
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
                                                var arr = slist[i].split("_");
                                                modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]:radio[value='" + slist[i] + "']").attr('checked', 'true');
                                                modal.$body.find("#button_" + arr[0] + "_" + arr[2]).show();
                                            }
                                            var stList = data.data.sTextList;
                                            for (var i in stList) {
                                                var arr = stList[i].split("_");
                                                modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]").val(parseFloat(arr[1]).toFixed(2));
                                                modal.$body.find("#button_" + arr[0] + "_" + arr[2]).show();
                                            }
                                            modal.$body.find("a[role=apply]").on("click", function () {
                                                var id = $(this).attr("scoreRecord")
                                                var modal1 = $.orangeModal({
                                                    id: "score_apply_form_modal",
                                                    title: "申请重新打分",
                                                    destroy: true
                                                }).show();
                                                modal1.$body.orangeForm({
                                                    id: "apply_form",
                                                    name: "apply_form",
                                                    method: "POST",
                                                    action: App.href + "/api/score/applyScore/apply?scoreRecordId=" + id,
                                                    ajaxSubmit: true,
                                                    ajaxSuccess: function () {
                                                        bootbox.alert('申请已发出，请耐心等待');
                                                        modal1.hide();
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
                                                            modal1.hide();
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
                                            });
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
                                text: "确认分值",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return d.status === 3 || d.status === 1;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "score_form_modal",
                                        title: "确认分值",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '确认分值',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    var confirmMessage = "<div style='margin: auto;width: 60%'><table class='table table-hover table-bordered table-condensed' >";
                                                    $(".table_needScore").each(function () {
                                                        var scoreTabel = $(this).next();
                                                        var scoreValue = "未打分";
                                                        scoreTabel.find('input[type=radio]:checked').each(function () {
                                                            scoreValue = $(this).parent().next().next().text();
                                                        });
                                                        if (scoreValue == "未打分") {
                                                            scoreTabel.find('.needscore_inputValue').each(function () {
                                                                if ($(this).val().trim() != "") {
                                                                    scoreValue = $(this).val() + "分";
                                                                }
                                                            });
                                                        }
                                                        confirmMessage += "<tr>" + "<td>" + $(this).find(".th_needScore").text() + ":</td><td>" +
                                                            scoreValue + "</td>" + "</tr>";
                                                    });
                                                    confirmMessage += "</table></div>";

                                                    bootbox.confirm({
                                                        title: "确定打分吗?",
                                                        message: confirmMessage,
                                                        callback: function (result) {
                                                            if (result) {
                                                                var sIds = [];
                                                                var sAns = [];
                                                                var sDetails = [];
                                                                m.$body.find('input[type=radio]:checked').each(function () {
                                                                    sIds.push($(this).val());
                                                                });
                                                                var ms = 0;
                                                                var indicatorId = "";
                                                                var roleId = "";
                                                                m.$body.find('input[type=text]').each(function () {
                                                                    if ($(this).attr("d-name") == "manScore") {
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
                                                                m.$body.find('textarea[d-name="reason"]').each(function () {
                                                                    var indicatorId = $(this).attr("d-indicator") + "";
                                                                    var roleId = $(this).attr("d-roleId") + "";
                                                                    sDetails.push(indicatorId + "_" + $(this).val() + "_" + roleId);
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
                                                                        sAns: sAns.toString(),
                                                                        sDetails: sDetails.toString()
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
                                            bootbox.alert('申请已发出，请耐心等待');
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
                                            bootbox.alert('申请已发出，请耐心等待');
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
                            items: searchItems,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '导出',
                                    cls: "btn btn-danger btn-sm",
                                    handle: function (g) {
                                        var downloadUrl = App.href + "/api/score/stat/export/exportScored?" + g.$searchForm.serialize();
                                        window.open(downloadUrl);
                                    }
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
                console.error("请求异常。");
            }
        });
    };

    var scoreRecordIdentity = function (type) {
        //是否显示家庭关系（卫健委）按钮
        var isVisibleRelationship = false;
        var authoritiesArray = window.App.currentUser['authorities'];
        if (authoritiesArray != undefined) {
            outLoop:
                for (var index in authoritiesArray) {
                    if (authoritiesArray.hasOwnProperty(index)) {
                        switch (authoritiesArray[index]['authority']) {
                            //人社
                            case '3':
                            //卫健委
                            case '12':
                                isVisibleRelationship = true;
                                break outLoop;
                        }
                    }
                }
        }

        var searchItems = [
            {
                type: 'text',
                label: '申请人身份证',
                name: 'personIdNum'
            }, {
                type: 'text',
                label: '申请人姓名',
                name: 'personName'
            }, {
                type: 'select',
                label: '申请审核日期查询设置',
                name: 'dateSearch',
                items: [
                    {
                        text: '关闭',
                        value: 0
                    }, {
                        text: '开启',
                        value: 1
                    }
                ]
            }, {
                type: 'datepicker',
                label: '申请审核日期',
                name: 'acceptDate',
                single: true
            }, {
                type: 'select',
                label: '房子合同/产权证（市区用、滨海新区不用）',
                name: 'rightProperty',
                items: [
                    {
                        text: '请选择',
                        value: 0
                    }, {
                        text: '无租赁+持有“不动产权证”',
                        value: 1
                    }, {
                        text: '租赁租房+自有住房（合同）+自有住房（产权证）',
                        value: 2
                    }
                ]
            }
            , {
                type: 'select',
                label: '受教育程度',
                name: 'cultureDegree',
                items: [
                    {
                        text: '请选择',
                        value: 0
                    }, {
                        text: '本科及以上学历',
                        value: 4
                    }, {
                        text: '大专学历',
                        value: 5
                    }
                    , {
                        text: '高级技工学校高级班',
                        value: 1011
                    }
                    , {
                        text: '无',
                        value: 1013
                    }
                ]
            }
            , {
                type: 'select',
                label: '配偶就业或现役军人',
                name: 'inTianjin',
                items: [
                    {
                        text: '请选择',
                        value: 0
                    }, {
                        text: '是',
                        value: 1
                    }, {
                        text: '否',
                        value: 2
                    }
                ]
            }, {
                type: 'select',
                label: '服役期间立功情况',
                name: 'soldierMeritorious',
                items: [
                    {
                        text: '请选择',
                        value: 0
                    }, {
                        text: '荣立个人一等功',
                        value: 47
                    }, {
                        text: '荣立个人二等功',
                        value: 48
                    }, {
                        text: '荣立个人三等功',
                        value: 49
                    }, {
                        text: '无',
                        value: 50
                    }
                ]
            }, {
                type: 'select',
                label: '是否缴存住房公积金',
                name: 'providentFund',
                items: [
                    {
                        text: '请选择',
                        value: 0
                    }, {
                        text: '是',
                        value: 1
                    }, {
                        text: '否',
                        value: 2
                    }
                ]
            }
        ];
        var columns = [
            {
                title: '申请人ID',
                field: 'personId'
            }, {
                title: '申请人姓名',
                field: 'personName',
                dataClick: function (i, d) {
                    var requestUrl = App.href + "/api/score/info/identityInfo/detail";
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: requestUrl,
                        data: {
                            id: d.personId
                        },
                        success: function (data) {
                            var hostName = window.location.host;
                            var img = {};
                            if (hostName == "172.16.200.68") {
                                img = $('<img src="' + data.data.idCardPositive.replace("218.67.246.52:80", "172.16.200.68:8092") + '"><br><img src="' + data.data.idCardOpposite.replace("218.67.246.52:80", "172.16.200.68:8092") + '">');
                            } else {
                                img = $('<img src="' + data.data.idCardPositive + '"><br><img src="' + data.data.idCardOpposite + '">');
                            }
                            $.orangeModal({
                                title: "图片预览",
                                destroy: true, buttons: [
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
                            }).show().$body.html(img);
                        },
                        error: function (e) {
                            console.error("请求异常。");
                        }
                    });
                }
            },
            {
                title: '申请人身份证',
                field: 'personIdNum'
            },
            {
                title: '企业',
                field: 'companyName'
            },
            {
                title: '申请审核日期',
                field: 'acceptDate',
                sort: true
            },
            {
                title: '公安落户编号',
                field: 'acceptNumber'
            }
        ];

        if (type === "scoring") {
            columns.splice(4, 0,
                {
                    title: '剩余未打分项',
                    field: 'score_value',
                    format: function (i, d) {
                        return d.scoreValue === null ? '无' : '剩余' + d.scoreValue + '项';
                    }
                });
        }
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
                    text: "确认分值",
                    cls: "btn-primary btn-sm",
                    visible: function (i, d) {
                        return type === "scoring";
                    },
                    handle: function (index, d) {
                        var modal = $.orangeModal({
                            id: "score_form_modal",
                            title: "确认分值",
                            destroy: true,
                            buttons: [
                                {
                                    text: '确认分值',
                                    cls: 'btn btn-info',
                                    handle: function (m) {
                                        var confirmMessage = "<div style='margin: auto;width: 60%'><table class='table table-hover table-bordered table-condensed' >";
                                        $(".table_needScore").each(function () {
                                            var scoreTabel = $(this).next();
                                            var scoreValue = "未打分";
                                            scoreTabel.find('input[type=radio]:checked').each(function () {
                                                scoreValue = $(this).parent().next().next().text();
                                            });
                                            if (scoreValue == "未打分") {
                                                scoreTabel.find('.needscore_inputValue').each(function () {
                                                    if ($(this).val().trim() != "") {
                                                        scoreValue = $(this).val() + "分";
                                                    }
                                                });
                                            }
                                            confirmMessage += "<tr>" + "<td>" + $(this).find(".th_needScore").text() + ":</td><td>" +
                                                scoreValue + "</td>" + "</tr>";
                                        });
                                        confirmMessage += "</table></div>";

                                        bootbox.confirm({
                                            title: "确定打分吗?",
                                            message: confirmMessage,
                                            callback: function (result) {
                                                if (result) {
                                                    var sIds = [];
                                                    var sAns = [];
                                                    var sDetails = [];
                                                    m.$body.find('input[type=radio]:checked').each(function () {
                                                        sIds.push($(this).val());
                                                    });
                                                    var ms = 0;
                                                    var indicatorId = "";
                                                    var roleId = "";
                                                    m.$body.find('input[type=text]').each(function () {
                                                        if ($(this).attr("d-name") == "manScore") {
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
                                                    m.$body.find('textarea[d-name="reason"]').each(function () {
                                                        var indicatorId = $(this).attr("d-indicator") + "";
                                                        var roleId = $(this).attr("d-roleId") + "";
                                                        sDetails.push(indicatorId + "_" + $(this).val() + "_" + roleId);
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
                                                            sAns: sAns.toString(),
                                                            sDetails: sDetails.toString()
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
                                            }
                                        });
                                    }
                                },{
                                    text: '确定并打印审核表',
                                    cls: 'btn btn-info',
                                    handle: function (m) {
                                        var confirmMessage = "<div style='margin: auto;width: 60%'><table class='table table-hover table-bordered table-condensed' >";
                                        $(".table_needScore").each(function () {
                                            var scoreTabel = $(this).next();
                                            var scoreValue = "未打分";
                                            scoreTabel.find('input[type=radio]:checked').each(function () {
                                                scoreValue = $(this).parent().next().next().text();
                                            });
                                            if (scoreValue == "未打分") {
                                                scoreTabel.find('.needscore_inputValue').each(function () {
                                                    if ($(this).val().trim() != "") {
                                                        scoreValue = $(this).val() + "分";
                                                    }
                                                });
                                            }
                                            confirmMessage += "<tr>" + "<td>" + $(this).find(".th_needScore").text() + ":</td><td>" +
                                                scoreValue + "</td>" + "</tr>";
                                        });
                                        confirmMessage += "</table></div>";

                                        bootbox.confirm({
                                            title: "确定打分吗?",
                                            message: confirmMessage,
                                            callback: function (result) {
                                                if (result) {
                                                    var sIds = [];
                                                    var sAns = [];
                                                    var sDetails = [];
                                                    m.$body.find('input[type=radio]:checked').each(function () {
                                                        sIds.push($(this).val());
                                                    });
                                                    var ms = 0;
                                                    var indicatorId = "";
                                                    var roleId = "";
                                                    m.$body.find('input[type=text]').each(function () {
                                                        if ($(this).attr("d-name") == "manScore") {
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
                                                    m.$body.find('textarea[d-name="reason"]').each(function () {
                                                        var indicatorId = $(this).attr("d-indicator") + "";
                                                        var roleId = $(this).attr("d-roleId") + "";
                                                        sDetails.push(indicatorId + "_" + $(this).val() + "_" + roleId);
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
                                                            sAns: sAns.toString(),
                                                            sDetails: sDetails.toString()
                                                        },
                                                        success: function (data) {
                                                            grid.reload();
                                                            m.hide();
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
                                                                                type: 'button',
                                                                                text: '关闭',
                                                                                cls: "btn btn-default",
                                                                                handle: function (m) {
                                                                                    m.hide()
                                                                                }
                                                                            }, {
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
                                                                                text: '导出',
                                                                                cls: 'btn btn-primary',
                                                                                handle: function (m) {
                                                                                    window.open(App.href + "/api/score/scoreRecord/identityInfo/export/approveDoc?identityInfoId=" + d.personId)
                                                                                }
                                                                            }
                                                                        ],
                                                                        onEnter: function (m) {
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
                                                                    }).show().$body.html(data.data.html);
                                                                },
                                                                error: function (e) {
                                                                    console.error("请求异常。");
                                                                }
                                                            });
                                                        },
                                                        error: function (e) {
                                                            console.error("请求异常。");
                                                        }
                                                    });
                                                }
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
                    text: "审核表打印(空白)",
                    cls: "btn-info btn-sm",
                    handle: function (index, d) {
                        var requestUrl = App.href + "/api/score/print/approveEmptyDoc?identityInfoId=" + d.personId;
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
                                            type: 'button',
                                            text: '关闭',
                                            cls: "btn btn-default",
                                            handle: function (m) {
                                                m.hide()
                                            }
                                        }, {
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
                                            text: '导出',
                                            cls: 'btn btn-primary',
                                            handle: function (m) {
                                                window.open(App.href + "/api/score/export/approveEmptyDoc?identityInfoId=" + d.personId)
                                            }
                                        }
                                    ],
                                    onEnter: function (m) {
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
                                }).show().$body.html(data.data.html);
                            },
                            error: function (e) {
                                console.error("请求异常。");
                            }
                        });
                    }
                }, {
                    text: "积分审核表(市卫健委)",
                    cls: "btn-info btn-sm",
                    visible: function (i, d) {
                        return isVisibleRelationship
                    },
                    handle: function (index, d) {
                        var requestUrl = App.href + "/api/score/print/approvewjwExcel?identityInfoId=" + d.personId;
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                $.orangeModal({
                                    title: "积分审核表(市卫健委)",
                                    destroy: true,
                                    buttons: [
                                        {
                                            type: 'button',
                                            text: '关闭',
                                            cls: "btn btn-default",
                                            handle: function (m) {
                                                m.hide()
                                            }
                                        }, {
                                            text: '导出',
                                            cls: 'btn btn-primary',
                                            handle: function (m) {
                                                var requestUrl = App.href + "/api/score/materialReceive/identityInfo/getIdentityInfoExcelWJW?identityInfoId=" + d.personId;
                                                window.open(requestUrl);
                                            }
                                        }
                                    ],
                                    onEnter: function (m) {
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
                                            type: 'button',
                                            text: '关闭',
                                            cls: "btn btn-default",
                                            handle: function (m) {
                                                m.hide()
                                            }
                                        }, {
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
                                            text: '导出',
                                            cls: 'btn btn-primary',
                                            handle: function (m) {
                                                window.open(App.href + "/api/score/scoreRecord/identityInfo/export/approveDoc?identityInfoId=" + d.personId)
                                            }
                                        }
                                    ],
                                    onEnter: function (m) {
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
                                }).show().$body.html(data.data.html);
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
                                    modal.$body.find("#button_" + arr[0] + "_" + arr[2]).show();

                                }
                                var stList = data.data.sTextList;
                                for (var i in stList) {
                                    var arr = stList[i].split("_");
                                    modal.$body.find("input[name=score_" + arr[0] + "_" + arr[2] + "]").val(parseFloat(arr[1]).toFixed(2));
                                    modal.$body.find("#button_" + arr[0] + "_" + arr[2]).show();
                                }

                                modal.$body.find("a[role=apply]").on("click", function () {
                                    var id = $(this).attr("scoreRecord")
                                    var modal1 = $.orangeModal({
                                        id: "score_apply_form_modal",
                                        title: "申请重新打分",
                                        destroy: true
                                    }).show();
                                    modal1.$body.orangeForm({
                                        id: "apply_form",
                                        name: "apply_form",
                                        method: "POST",
                                        action: App.href + "/api/score/applyScore/apply?scoreRecordId=" + id,
                                        ajaxSubmit: true,
                                        ajaxSuccess: function () {
                                            bootbox.alert('申请已发出，请耐心等待');
                                            modal1.hide();
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
                                                modal1.hide();
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
                                });
                            },
                            error: function (e) {
                                console.error("请求异常。");
                            }
                        });

                    }
                }, {
                    text: "取消资格",
                    cls: "btn-danger btn-sm",
                    handle: function (index, d) {
                        var modal = $.orangeModal({
                            id: "score_apply_form_modal",
                            title: "取消资格",
                            destroy: true
                        }).show();
                        modal.$body.orangeForm({
                            id: "apply_form",
                            name: "apply_form",
                            method: "POST",
                            action: App.href + "/api/score/applyCancel/apply?personId=" + d.personId,
                            ajaxSubmit: true,
                            ajaxSuccess: function () {
                                bootbox.alert('申请已发出，请耐心等待');
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
