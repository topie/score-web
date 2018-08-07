/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/approve/renshePrevApprove/approving": "scoreRenshePrevApproving",
        "/api/score/approve/renshePrevApprove/approved": "scoreRenshePrevApproved",
        "/api/score/approve/renshePrevApprove/rejected": "scoreRenshePrevRejected",
        "/api/score/approve/renshePrevApprove/supply": "scoreRenshePrevSupply"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreRenshePrevApproving = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待审核列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRenshePrevApprove("approving");
        }
    };
    App.scoreRenshePrevApproved = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">已审核列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRenshePrevApprove("approved");
        }
    };
    App.scoreRenshePrevRejected = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">已审核列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRenshePrevApprove("rejected");
        }
    };

    App.scoreRenshePrevSupply = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待补件列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRenshePrevApprove("supply");
        }
    };
    var scoreRenshePrevApprove = function (type) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/approve/renshePrevApprove/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var unionApproveStatus2 = fd.data.unionApproveStatus2;
                    var unionApproveStatus1 = fd.data.unionApproveStatus1;
                    var reservationStatus = fd.data.reservationStatus;
                    var companyNames = fd.data.companyNames;
                    var newSearchItems = [];
                    if (searchItems != null) {
                        $.each(searchItems, function (ii, dd) {
                            if (dd.name !== 'batchId') {
                                newSearchItems.push(dd);
                            }
                        });
                    }
                    searchItems = newSearchItems;
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
                        if (dd.name == 'nation') {
                            var national = [
                                "汉族", "壮族", "满族", "回族", "苗族", "维吾尔族", "土家族", "彝族", "蒙古族", "藏族", "布依族", "侗族", "瑶族", "朝鲜族", "白族", "哈尼族",
                                "哈萨克族", "黎族", "傣族", "畲族", "傈僳族", "仡佬族", "东乡族", "高山族", "拉祜族", "水族", "佤族", "纳西族", "羌族", "土族", "仫佬族", "锡伯族",
                                "柯尔克孜族", "达斡尔族", "景颇族", "毛南族", "撒拉族", "布朗族", "塔吉克族", "阿昌族", "普米族", "鄂温克族", "怒族", "京族", "基诺族", "德昂族", "保安族",
                                "俄罗斯族", "裕固族", "乌孜别克族", "门巴族", "鄂伦春族", "独龙族", "塔塔尔族", "赫哲族", "珞巴族"
                            ];
                            for (var n in national) {
                                dd.items.push({
                                    text: national[n],
                                    value: national[n]
                                })
                            }
                        }
                    });
                    columns.push({
                        title: '性别',
                        field: 'sex',
                        format: function (ii, dd) {
                            return dd.sex === 1 ? '男' : '女';
                        }
                    });
                    columns.push(
                        {
                            title: '公安审核状态',
                            field: 'unionApproveStatus1',
                            format: function (i, cd) {
                                return unionApproveStatus1[cd.unionApproveStatus1];
                            }
                        }
                    );
                    columns.push(
                        {
                            title: '企业',
                            field: 'companyId',
                            format: function (i, cd) {
                                if (cd.companyWarning == 1) {
                                    return '<span style="color: red">' + companyNames[cd.companyId] + '</span>';
                                } else {
                                    return companyNames[cd.companyId];
                                }

                            }
                        }
                    );
                    columns.push(
                        {
                            title: '人社审核状态',
                            field: 'unionApproveStatus2',
                            format: function (i, cd) {
                                return unionApproveStatus2[cd.unionApproveStatus2];
                            }
                        }
                    );
                    columns.push(
                        {
                            title: '网上预约状态',
                            field: 'reservationStatus',
                            format: function (i, cd) {
                                return reservationStatus[cd.reservationStatus];
                            }
                        }
                    );
                    if (type == "approving" || type == "supply") {
                        columns.push({
                            title: '预审剩余时间',
                            field: 'epStatus'
                        });
                    }
                    columns.push(
                        {
                            title: '锁定人',
                            field: 'lockUser2'
                        }
                    );
                    columns.push(
                        {
                            title: '审核人',
                            field: 'opuser2'
                        }
                    );
                    var grid;
                    var options = {
                        url: App.href + "/api/score/approve/renshePrevApprove/" + type,
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
                                cls: "btn-info btn-sm",
                                visible: function (i, d) {
                                    return d.unionApproveStatus2 != 1;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "approve_form_modal",
                                        title: "查看申请人信息",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '打印申请人信息',
                                                cls: 'btn btn-warning',
                                                handle: function (m) {
                                                    m.$body.find("#info-tab").print({
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
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_pre";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var checkList = data.data.cMids;
                                            for (var i in checkList) {
                                                modal.$body.find("input[name=material]:checkbox[value='" + checkList[i] + "']").attr('checked', 'true');
                                            }
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "锁定",
                                cls: "btn-danger btn-sm",
                                visible: function (i, d) {
                                    return (d.lockUser2 == null || d.lockUser2 == '') && (d.unionApproveStatus2 == 1 || d.unionApproveStatus2 == 4);
                                },
                                handle: function (index, d) {
                                    var requestUrl = App.href + "/api/score/approve/renshePrevApprove/lock?id=" + d.id;
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            grid.reload();
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "审核",
                                cls: "btn-info btn-sm",
                                visible: function (i, d) {
                                    return d.unionApproveStatus2 == 1 && d.lockUser2 != null && d.lockUser2 != '';
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "approve_form_modal",
                                        title: "审核申请人信息",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '打印申请人信息',
                                                cls: 'btn btn-warning',
                                                handle: function (m) {
                                                    m.$body.find("#info-tab").print({
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
                                                text: "打印材料清单",
                                                cls: "btn btn-info",
                                                handle: function (m) {
                                                    var requestUrl = App.href + "/api/score/print/uploadMaterialDoc?personId=" + d.id;
                                                    $.ajax({
                                                        type: "GET",
                                                        dataType: "json",
                                                        url: requestUrl,
                                                        success: function (data) {
                                                            $.orangeModal({
                                                                title: "打印材料清单",
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
                                            },
                                            {
                                                text: '通过',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var requestUrl = App.href + "/api/score/approve/renshePrevApprove/agree";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    id: d.id
                                                                },
                                                                success: function (data) {
                                                                    if (data.code !== 200) {
                                                                        bootbox.alert(data.message);
                                                                    }
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
                                            },
                                            {
                                                text: '不通过',
                                                cls: 'btn btn-danger',
                                                handle: function (mm) {
                                                    var modal = $.orangeModal({
                                                        id: "score_disagree_form_modal",
                                                        title: "不通过",
                                                        destroy: true
                                                    }).show();
                                                    modal.$body.orangeForm({
                                                        id: "score_disagree_form",
                                                        name: "score_disagree_form",
                                                        method: "POST",
                                                        action: App.href + "/api/score/approve/renshePrevApprove/disAgree?id=" + d.id,
                                                        ajaxSubmit: true,
                                                        ajaxSuccess: function () {
                                                            mm.hide();
                                                            modal.hide();
                                                            grid.reload();
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
                                                                type: 'select',
                                                                name: 'reasonType',
                                                                label: '不通过原因类型',
                                                                items: [
                                                                    {
                                                                        text: '社会保险出现补缴',
                                                                        value: '社会保险出现补缴'
                                                                    },
                                                                    {
                                                                        text: '社会保险出现断缴',
                                                                        value: '社会保险出现断缴'
                                                                    }, {
                                                                        text: '社会保险缴纳单位发生变更',
                                                                        value: '社会保险缴纳单位发生变更'
                                                                    }, {
                                                                        text: '其它',
                                                                        value: '其它'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: 'textarea',
                                                                name: 'rejectReason',
                                                                label: '不通过原因'
                                                            }
                                                        ]
                                                    });
                                                }
                                            },
                                            {
                                                text: '材料待补正',
                                                cls: 'btn btn-danger',
                                                handle: function (m) {
                                                    var modal = $.orangeModal({
                                                        id: "approve_supply_form_modal",
                                                        title: "材料待补正",
                                                        destroy: true,
                                                        buttons: [
                                                            {
                                                                text: '确认',
                                                                cls: 'btn btn-warning',
                                                                handle: function (mm) {
                                                                    bootbox.confirm("确定该操作?", function (result) {
                                                                        if (result) {
                                                                            var supplyArr = [];
                                                                            mm.$body.find("input[name=supplyMaterial]").each(
                                                                                function (i, d) {
                                                                                    console.log(d);
                                                                                    if ($(this).is(":checked")) {
                                                                                        var id = $(this).val();
                                                                                        var reason = $(this).parent().parent().next("tr").find("input[name=supplyReason]").val();
                                                                                        supplyArr.push({
                                                                                            "id": id,
                                                                                            "reason": reason
                                                                                        });
                                                                                    }
                                                                                }
                                                                            );
                                                                            var supplyStr = JSON.stringify(supplyArr);
                                                                            var requestUrl = App.href + "/api/score/approve/renshePrevApprove/supply";
                                                                            $.ajax({
                                                                                type: "POST",
                                                                                dataType: "json",
                                                                                url: requestUrl,
                                                                                data: {
                                                                                    "id": d.id,
                                                                                    "supplyArr": supplyStr
                                                                                },
                                                                                success: function (data) {
                                                                                    grid.reload();
                                                                                    m.hide();
                                                                                    mm.hide();
                                                                                },
                                                                                error: function (e) {
                                                                                    console.error("请求异常。");
                                                                                }
                                                                            });
                                                                        }
                                                                    });

                                                                }
                                                            },
                                                            {
                                                                text: '关闭',
                                                                cls: 'btn btn-default',
                                                                handle: function (m) {
                                                                    m.hide();
                                                                }
                                                            }
                                                        ]
                                                    }).show();
                                                    var requestUrl = App.href + "/api/score/info/identityInfo/materialSupply?identityInfoId=" + d.id;
                                                    $.ajax({
                                                        type: "GET",
                                                        dataType: "json",
                                                        url: requestUrl,
                                                        success: function (data) {
                                                            modal.$body.html(data.data.html);
                                                            var checkList = data.data.cMids;
                                                            for (var i in checkList) {
                                                                modal.$body.find("input[name=material]:checkbox[value='" + checkList[i] + "']").attr('checked', 'true');
                                                            }
                                                        },
                                                        error: function (e) {
                                                            console.error("请求异常。");
                                                        }
                                                    });
                                                }
                                            }, {
                                                text: '社保情况',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    var requestUrl = App.href + "/api/score/info/identityInfo/socialInfo";
                                                    $.ajax({
                                                        type: "POST",
                                                        dataType: "json",
                                                        url: requestUrl,
                                                        data: {
                                                            personId: d.id
                                                        },
                                                        success: function (data) {
                                                            var content = '<div>公司名称</div><div id="info"></div><div>社保情况</div><div id="list"></div>'
                                                            var modal = $.orangeModal({
                                                                title: "社保缴纳情况",
                                                                destroy: true
                                                            }).show();
                                                            modal.$body.html(content);
                                                            if (data.data.info.appCode === "1") {
                                                                modal.$body.find("#info").html(data.data.info.errMsg);
                                                            } else {
                                                                modal.$body.find("#info").html(data.data.info.unitName);
                                                            }
                                                            modal.$body.find("#list").html(data.data.list);
                                                        },
                                                        error: function (e) {
                                                            console.error("请求异常。");
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_pre";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var checkList = data.data.cMids;
                                            for (var i in checkList) {
                                                modal.$body.find("input[name=material]:checkbox[value='" + checkList[i] + "']").attr('checked', 'true');
                                            }
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "审核补件",
                                cls: "btn-warning btn-sm",
                                visible: function (i, d) {
                                    return d.unionApproveStatus2 == 4 && d.lockUser2 != null && d.lockUser2 != '';
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "approve_form_modal",
                                        title: "审核申请人信息",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '通过',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var requestUrl = App.href + "/api/score/approve/renshePrevApprove/agree";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    id: d.id
                                                                },
                                                                success: function (data) {
                                                                    if (data.code !== 200) {
                                                                        bootbox.alert(data.message);
                                                                    }
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
                                            },
                                            {
                                                text: '不通过',
                                                cls: 'btn btn-danger',
                                                handle: function (mm) {
                                                    var modal = $.orangeModal({
                                                        id: "score_disagree_form_modal",
                                                        title: "不通过",
                                                        destroy: true
                                                    }).show();
                                                    modal.$body.orangeForm({
                                                        id: "score_disagree_form",
                                                        name: "score_disagree_form",
                                                        method: "POST",
                                                        action: App.href + "/api/score/approve/renshePrevApprove/disAgree?id=" + d.id,
                                                        ajaxSubmit: true,
                                                        ajaxSuccess: function () {
                                                            modal.hide();
                                                            mm.hide();
                                                            grid.reload();
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
                                                                type: 'select',
                                                                name: 'reasonType',
                                                                label: '不通过原因类型',
                                                                items: [
                                                                    {
                                                                        text: '社会保险出现补缴',
                                                                        value: '社会保险出现补缴'
                                                                    },
                                                                    {
                                                                        text: '社会保险出现断缴',
                                                                        value: '社会保险出现断缴'
                                                                    }, {
                                                                        text: '社会保险缴纳单位发生变更',
                                                                        value: '社会保险缴纳单位发生变更'
                                                                    }, {
                                                                        text: '其它',
                                                                        value: '其它'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: 'textarea',
                                                                name: 'rejectReason',
                                                                label: '不通过原因'
                                                            }
                                                        ]
                                                    });
                                                }
                                            },
                                            {
                                                text: '材料待补正',
                                                cls: 'btn btn-danger',
                                                handle: function (mm) {
                                                    var modal = $.orangeModal({
                                                        id: "approve_supply_form_modal",
                                                        title: "材料待补正",
                                                        destroy: true,
                                                        buttons: [
                                                            {
                                                                text: '确认',
                                                                cls: 'btn btn-warning',
                                                                handle: function (m) {
                                                                    bootbox.confirm("确定该操作?", function (result) {
                                                                        if (result) {
                                                                            var supplyArr = [];
                                                                            m.$body.find("input[name=supplyMaterial]").each(
                                                                                function (i, d) {
                                                                                    if ($(this).is(":checked")) {
                                                                                        console.log(d);
                                                                                        var id = $(this).val();
                                                                                        var reason = $(this).parent().parent().next("tr").find("input[name=supplyReason]").val();
                                                                                        supplyArr.push({
                                                                                            "id": id,
                                                                                            "reason": reason
                                                                                        });
                                                                                    }
                                                                                }
                                                                            );
                                                                            var supplyStr = JSON.stringify(supplyArr);
                                                                            var requestUrl = App.href + "/api/score/approve/renshePrevApprove/supply";
                                                                            $.ajax({
                                                                                type: "POST",
                                                                                dataType: "json",
                                                                                url: requestUrl,
                                                                                data: {
                                                                                    "id": d.id,
                                                                                    "supplyArr": supplyStr
                                                                                },
                                                                                success: function (data) {
                                                                                    if (data.code !== 200) {
                                                                                        bootbox.alert(data.message);
                                                                                    }
                                                                                    grid.reload();
                                                                                    m.hide();
                                                                                    mm.hide();
                                                                                },
                                                                                error: function (e) {
                                                                                    console.error("请求异常。");
                                                                                }
                                                                            });
                                                                        }
                                                                    });

                                                                }
                                                            },
                                                            {
                                                                text: '关闭',
                                                                cls: 'btn btn-default',
                                                                handle: function (m) {
                                                                    m.hide();
                                                                }
                                                            }
                                                        ]
                                                    }).show();
                                                    var requestUrl = App.href + "/api/score/info/identityInfo/materialSupply?identityInfoId=" + d.id;
                                                    $.ajax({
                                                        type: "GET",
                                                        dataType: "json",
                                                        url: requestUrl,
                                                        success: function (data) {
                                                            modal.$body.html(data.data.html);
                                                            var checkList = data.data.cMids;
                                                            for (var i in checkList) {
                                                                modal.$body.find("input[name=material]:checkbox[value='" + checkList[i] + "']").attr('checked', 'true');
                                                            }
                                                        },
                                                        error: function (e) {
                                                            console.error("请求异常。");
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_pre";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var checkList = data.data.cMids;
                                            for (var i in checkList) {
                                                modal.$body.find("input[name=material]:checkbox[value='" + checkList[i] + "']").attr('checked', 'true');
                                            }
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
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

})(jQuery, window, document);
