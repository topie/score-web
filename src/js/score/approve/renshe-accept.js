/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/approve/rensheAccept/approving": "scoreRensheAcceptApproving",
        "/api/score/approve/rensheAccept/approved": "scoreRensheAcceptd",
        "/api/score/approve/rensheAccept/rejected": "scoreRensheAcceptRejected",
        "/api/score/approve/rensheAccept/supply": "scoreRensheAcceptSupply"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreRensheAcceptApproving = {
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
            scoreRensheAccept("approving");
        }
    };
    App.scoreRensheAcceptd = {
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
            scoreRensheAccept("approved");
        }
    };
    App.scoreRensheAcceptRejected = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">不通过列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRensheAccept("rejected");
        }
    };

    App.scoreRensheAcceptSupply = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">材料待补正列表</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRensheAccept("supply");
        }
    };

    var scoreRensheAccept = function (type) {

        //是否显示家庭关系（卫健委）按钮
        var isVisibleRelationship = false;
        var userType = window.App.currentUser['userType'];
        // 2019年7月29日，将这个表格添加到审核中心——人社预审——待审核——操作列，滨海新区人社权限用户可见
        // 管理员也可见，0：市区；1：滨海；2：市区+滨海
        if(userType==1 || userType==2){
            isVisibleRelationship = true;
        }

        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/approve/rensheAccept/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var hallStatus = fd.data.hallStatus;
                    var companyNames = fd.data.companyNames;
                    var rensheAcceptStatus = fd.data.rensheAcceptStatus;
                    if (searchItems == null)
                        searchItems = [];
                    searchItems.push(
                        /*{
                            type: "select",
                            label: "企业",
                            name: "companyId",
                            items: [
                                {
                                    text: '全部',
                                    value: ''
                                }
                            ],
                            itemsUrl: App.href + '/api/score/companyInfo/options'
                        },*/{
                            type: 'select',
                            label: '受理日期查询设置',
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
                            label: "申请审核日期",
                            name: "reservationDate",
                            single: true
                        }, {
                            type: 'text',
                            label: '单位名称',
                            name: 'rentHouseAddress'
                        }
                    );
                    var columns = [];
                    columns.push(
                        {
                            title: '受理编号',
                            field: 'acceptNumber'
                        }
                    );
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
                            title: '企业',
                            field: 'companyId',
                            format: function (i, cd) {
                                if (cd.companyWarning == 1) {
                                    return '<span style="color: red">' + cd.isPreviewd + '</span>';
                                } else {
                                    return cd.isPreviewd;
                                }

                            }
                        }
                    );
                    columns.push(
                        {
                            title: '预约大厅状态',
                            field: 'hallStatus',
                            format: function (i, cd) {
                                return hallStatus[cd.hallStatus];
                            }
                        }, {
                            title: '申请审核日期',
                            field: 'reservationDate'
                        },{
                            title: '不通过原因',
                            field: 'rejectReason'
                        },
                        {
                            title: '人社受理状态',
                            field: 'rensheAcceptStatus',
                            format: function (i, cd) {
                                return rensheAcceptStatus[cd.rensheAcceptStatus];
                            }
                        });
                    columns.push(
                        {
                            title: '锁定人',
                            field: 'lockUser2'
                        }
                    );
                    columns.push(
                        {
                            title: '审核人',
                            field: 'opuser4'
                        }
                    );
                    var grid;
                    var options = {
                        url: App.href + "/api/score/approve/rensheAccept/" + type,
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
                        select2: true,
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [
                            {
                                text: "打印受理通知书",
                                cls: "btn-info btn-sm",
                                visible: function (i, d) {
                                    return d.rensheAcceptStatus == 3;
                                },
                                handle: function (index, d) {
                                    var requestUrl = App.href + "/api/score/print/acceptNotice?personId=" + d.id;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            $.orangeModal({
                                                title: "打印受理通知书",
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
                            },{
                                text: "锁定",
                                cls: "btn-danger btn-sm",
                                visible: function (i, d) {
                                    return (d.lockUser2 == null || d.lockUser2 == '');
                                },
                                handle: function (index, d) {
                                    var requestUrl = App.href + "/api/score/approve/renshePrevApprove/lock?id=" + d.id;
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            if(data.code==500){
                                                alert("已经被锁定了");
                                            }else {
                                                grid.reload();
                                            }
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "审核",
                                cls: "btn-danger btn-sm",
                                visible: function (i, d) {
                                    return d.rensheAcceptStatus == 1;
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
                                            },
                                            {
                                                text: '通过',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/agree";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    id: d.id
                                                                },
                                                                success: function (data) {
                                                                    grid.reload();
                                                                    m.hide();
                                                                    if (data.code !== 200) {
                                                                        bootbox.alert(data.message);
                                                                        return;
                                                                    }
                                                                    var requestUrl = App.href + "/api/score/print/acceptNotice?personId=" + d.id;
                                                                    $.ajax({
                                                                        type: "GET",
                                                                        dataType: "json",
                                                                        url: requestUrl,
                                                                        success: function (data) {
                                                                            $.orangeModal({
                                                                                title: "打印接收凭证",
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
                                                        //action: App.href + "/api/score/approve/rensheAccept/disAgree?id=" + d.id,
                                                        action: App.href + "/api/score/approve/renshePrevApprove/disAgree2?id=" + d.id,
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
                                                // handle: function (m) {
                                                //     bootbox.confirm("确定该操作?", function (result) {
                                                //         if (result) {
                                                //             var requestUrl = App.href + "/api/score/approve/rensheAccept/disAgree";
                                                //             $.ajax({
                                                //                 type: "POST",
                                                //                 dataType: "json",
                                                //                 url: requestUrl,
                                                //                 data: {
                                                //                     id: d.id
                                                //                 },
                                                //                 success: function (data) {
                                                //                     grid.reload();
                                                //                     m.hide();
                                                //                     if (data.code !== 200) {
                                                //                         bootbox.alert(data.message);
                                                //                     }
                                                //                 },
                                                //                 error: function (e) {
                                                //                     console.error("请求异常。");
                                                //                 }
                                                //             });
                                                //         }
                                                //     });
                                                //
                                                // }
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
                                                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/supply";
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
                            }, {
                                text: "查看",
                                cls: "btn-danger btn-sm",
                                visible: function (i, d) {
                                    return d.rensheAcceptStatus != 1;
                                },
                                handle: function (index, d) {
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_pre";
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            $.orangeModal({
                                                title: "查看申请人信息",
                                                destroy: true,
                                                buttons: [
                                                    {
                                                        type: 'button',
                                                        text: '关闭',
                                                        cls: "btn btn-default",
                                                        handle: function (m) {
                                                            m.hide()
                                                        }
                                                    },
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
                                                        text: '材料上传全部打印',
                                                        cls: 'btn btn-primary',
                                                        handle: function (m) {
                                                            var printDiv = $('#to_point');
                                                            printDiv.html("");
                                                            var count = 0;
                                                            var picpic = $("[name='picpic']");
                                                            picpic.each(function () {
                                                                if ($(this).parent().prev().children().first()[0].checked) {
                                                                    count++;
                                                                }
                                                            });
                                                            var loadImg;
                                                            var realWidth;
                                                            var realHeight;
                                                            var putWidth;
                                                            var putHeight;
                                                            var maxWidth = 630;
                                                            var maxHeight = 958;
                                                            var ratio = 0;

                                                            picpic.each(function () {
                                                                if ($(this).parent().prev().children().first()[0].checked) {
                                                                    $("<img/>").attr("src", $(this).attr("src")).load(function () {
                                                                        loadImg = $(this);
                                                                        realWidth = this.width;
                                                                        realHeight = this.height;
                                                                        if (realWidth > realHeight) {
                                                                            loadImg.css("transform", 'rotate(90deg)');
                                                                            realWidth = realWidth ^ realHeight;
                                                                            realHeight = realWidth ^ realHeight;
                                                                            realWidth = realWidth ^ realHeight;
                                                                        }

                                                                        // 检查图片是否超宽
                                                                        if (realWidth > maxWidth) {
                                                                            ratio = maxWidth / realWidth;
                                                                            putWidth = maxWidth;
                                                                            realHeight = realHeight * ratio;
                                                                            putHeight = realHeight;
                                                                        } else {
                                                                            putWidth = realWidth;
                                                                        }

                                                                        // 检查图片是否超高
                                                                        if (realHeight > maxHeight) {
                                                                            ratio = maxHeight / realHeight;
                                                                            putHeight = maxHeight;
                                                                            putWidth = putWidth * ratio;
                                                                        } else {
                                                                            putHeight = realHeight;
                                                                        }

                                                                        loadImg.css("width", putWidth);
                                                                        loadImg.css("height", putHeight);

                                                                        var topMargin = (maxHeight - putHeight) / 2;
                                                                        var leftMargin = (maxWidth - putWidth) / 2;
                                                                        printDiv.append("<div style='width: 650px;height: 978px'>" +
                                                                            "<div style='padding: " + topMargin + "px " + leftMargin + "px'>" +
                                                                            "</div></div>");
                                                                        printDiv.children("div:last-child").children().first().append(loadImg);
                                                                        count--;
                                                                        if (count === 0) {
                                                                            printDiv.show();
                                                                            printDiv.print({
                                                                                globalStyles: true,
                                                                                mediaPrint: true,
                                                                                stylesheet: null,
                                                                                noPrintSelector: ".no-print",
                                                                                iframe: false,
                                                                                append: null,
                                                                                prepend: null,
                                                                                manuallyCopyFormValues: true,
                                                                                deferred: $.Deferred()
                                                                            });
                                                                            printDiv.hide();
                                                                        }
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    },{
                                                        text: '存档材料全部打印',
                                                        cls: 'btn btn-primary',
                                                        handle: function (m) {
                                                            var printDiv = $('#to_point');
                                                            printDiv.html("");
                                                            var count = 0;
                                                            var picpic = $("[name='picpic_2']");
                                                            picpic.each(function () {
                                                                if ($(this).parent().prev().children().first()[0].checked) {
                                                                    count++;
                                                                }
                                                            });
                                                            var loadImg;
                                                            var realWidth;
                                                            var realHeight;
                                                            var putWidth;
                                                            var putHeight;
                                                            var maxWidth = 630;
                                                            var maxHeight = 958;
                                                            var ratio = 0;

                                                            picpic.each(function () {
                                                                if ($(this).parent().prev().children().first()[0].checked) {
                                                                    $("<img/>").attr("src", $(this).attr("src")).load(function () {
                                                                        loadImg = $(this);
                                                                        realWidth = this.width;
                                                                        realHeight = this.height;
                                                                        if (realWidth > realHeight) {
                                                                            loadImg.css("transform", 'rotate(90deg)');
                                                                            realWidth = realWidth ^ realHeight;
                                                                            realHeight = realWidth ^ realHeight;
                                                                            realWidth = realWidth ^ realHeight;
                                                                        }

                                                                        // 检查图片是否超宽
                                                                        if (realWidth > maxWidth) {
                                                                            ratio = maxWidth / realWidth;
                                                                            putWidth = maxWidth;
                                                                            realHeight = realHeight * ratio;
                                                                            putHeight = realHeight;
                                                                        } else {
                                                                            putWidth = realWidth;
                                                                        }

                                                                        // 检查图片是否超高
                                                                        if (realHeight > maxHeight) {
                                                                            ratio = maxHeight / realHeight;
                                                                            putHeight = maxHeight;
                                                                            putWidth = putWidth * ratio;
                                                                        } else {
                                                                            putHeight = realHeight;
                                                                        }

                                                                        loadImg.css("width", putWidth);
                                                                        loadImg.css("height", putHeight);

                                                                        var topMargin = (maxHeight - putHeight) / 2;
                                                                        var leftMargin = (maxWidth - putWidth) / 2;
                                                                        printDiv.append("<div style='width: 650px;height: 978px'>" +
                                                                            "<div style='padding: " + topMargin + "px " + leftMargin + "px'>" +
                                                                            "</div></div>");
                                                                        printDiv.children("div:last-child").children().first().append(loadImg);
                                                                        count--;
                                                                        if (count === 0) {
                                                                            printDiv.show();
                                                                            printDiv.print({
                                                                                globalStyles: true,
                                                                                mediaPrint: true,
                                                                                stylesheet: null,
                                                                                noPrintSelector: ".no-print",
                                                                                iframe: false,
                                                                                append: null,
                                                                                prepend: null,
                                                                                manuallyCopyFormValues: true,
                                                                                deferred: $.Deferred()
                                                                            });
                                                                            printDiv.hide();
                                                                        }
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    },{
                                                        text: '人社材料全部打印',
                                                        cls: 'btn btn-primary',
                                                        handle: function (m) {
                                                            var printDiv = $('#to_point');
                                                            printDiv.html("");
                                                            var count = 0;
                                                            var picpic = $("[name='picpic_3']");
                                                            picpic.each(function () {
                                                                if ($(this).parent().prev().children().first()[0].checked) {
                                                                    count++;
                                                                }
                                                            });
                                                            var loadImg;
                                                            var realWidth;
                                                            var realHeight;
                                                            var putWidth;
                                                            var putHeight;
                                                            var maxWidth = 630;
                                                            var maxHeight = 958;
                                                            var ratio = 0;

                                                            picpic.each(function () {
                                                                if ($(this).parent().prev().children().first()[0].checked) {
                                                                    $("<img/>").attr("src", $(this).attr("src")).load(function () {
                                                                        loadImg = $(this);
                                                                        realWidth = this.width;
                                                                        realHeight = this.height;
                                                                        if (realWidth > realHeight) {
                                                                            loadImg.css("transform", 'rotate(90deg)');
                                                                            realWidth = realWidth ^ realHeight;
                                                                            realHeight = realWidth ^ realHeight;
                                                                            realWidth = realWidth ^ realHeight;
                                                                        }

                                                                        // 检查图片是否超宽
                                                                        if (realWidth > maxWidth) {
                                                                            ratio = maxWidth / realWidth;
                                                                            putWidth = maxWidth;
                                                                            realHeight = realHeight * ratio;
                                                                            putHeight = realHeight;
                                                                        } else {
                                                                            putWidth = realWidth;
                                                                        }

                                                                        // 检查图片是否超高
                                                                        if (realHeight > maxHeight) {
                                                                            ratio = maxHeight / realHeight;
                                                                            putHeight = maxHeight;
                                                                            putWidth = putWidth * ratio;
                                                                        } else {
                                                                            putHeight = realHeight;
                                                                        }

                                                                        loadImg.css("width", putWidth);
                                                                        loadImg.css("height", putHeight);

                                                                        var topMargin = (maxHeight - putHeight) / 2;
                                                                        var leftMargin = (maxWidth - putWidth) / 2;
                                                                        printDiv.append("<div style='width: 650px;height: 978px'>" +
                                                                            "<div style='padding: " + topMargin + "px " + leftMargin + "px'>" +
                                                                            "</div></div>");
                                                                        printDiv.children("div:last-child").children().first().append(loadImg);
                                                                        count--;
                                                                        if (count === 0) {
                                                                            printDiv.show();
                                                                            printDiv.print({
                                                                                globalStyles: true,
                                                                                mediaPrint: true,
                                                                                stylesheet: null,
                                                                                noPrintSelector: ".no-print",
                                                                                iframe: false,
                                                                                append: null,
                                                                                prepend: null,
                                                                                manuallyCopyFormValues: true,
                                                                                deferred: $.Deferred()
                                                                            });
                                                                            printDiv.hide();
                                                                        }
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    }
                                                ]
                                            }).show().$body.html(data.data.html);
                                            /* modal.$body.html(data.data.html);
                                             var checkList = data.data.cMids;
                                             for (var i in checkList) {
                                             modal.$body.find("input[name=material]:checkbox[value='" + checkList[i] + "']").attr('checked', 'true');
                                             }*/
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "积分审核表(市卫健委)",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return isVisibleRelationship;
                                },
                                handle: function (index, d) {
                                    var requestUrl = App.href + "/api/score/print/approvewjwExcel?identityInfoId=" + d.id;
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
                                                            var requestUrl = App.href + "/api/score/materialReceive/identityInfo/getIdentityInfoExcelWJW?identityInfoId=" + d.id;
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
                                text: "退回至受理待审核",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return (d.rensheAcceptStatus == 3 || d.rensheAcceptStatus == 4) && (d.rensheOrGongan == 4);
                                },
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作？", function (result) {
                                        if (result){
                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/backRensheApprove?id=" + d.id;
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
