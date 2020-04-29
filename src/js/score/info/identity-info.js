/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/info/identityInfo/list": "scoreIdentityInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreIdentityInfo = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">申请人信息</div>' +
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
            url: App.href + "/api/score/info/identityInfo/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var reservationStatus = fd.data.reservationStatus;
                    var companyNames = fd.data.companyNames;
                    var hallStatus = fd.data.hallStatus;
                    if (searchItems == null)
                        searchItems = [];
                    /*searchItems.push({
                        type: 'select',
                        label: '企业',
                        name: 'companyId',
                        items: [{
                            text: '全部',
                            value: ''
                        }],
                        itemsUrl: App.href + '/api/score/companyInfo/options'
                    });*/
                    searchItems.push({
                        type: 'select',
                        label: '批次',
                        name: 'batchId',
                        items: [{
                            text: '全部',
                            value: ''
                        }],
                        itemsUrl: App.href + '/api/score/batchConf/options'
                    }, {
                        type: 'text',
                        label: '单位名称',
                        name: 'rentHouseAddress'
                    });

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
                    columns.push({
                        title: '网上预约状态',
                        field: 'reservationStatus',
                        format: function (i, cd) {
                            return reservationStatus[cd.reservationStatus];
                        }
                    });
                    columns.push({
                        title: '预约大厅状态',
                        field: 'hallStatus',
                        format: function (i, cd) {
                            return hallStatus[cd.hallStatus];
                        }
                    });
                    columns.push({
                        title: '核算状态',
                        field: 'resultStatus',
                        format: function (i, cd) {
                            return cd.resultStatus === 0 ? '未核算' : '已核算';
                        }
                    });
                    columns.push({
                        title: '所属企业',
                        field: 'companyId',
                        format: function (i, cd) {
                            // return companyNames[cd.companyId];
                            return cd.isPreviewd;
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/info/identityInfo/list",
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
                        select2: true,
                        pageSelect: [2, 15, 30, 50],
                        columns: columns,
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [
                            {
                                text: "查看",
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_form_modal",
                                        title: "查看申请人信息",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id;
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
                                text: '修改',
                                cls: 'btn-danger btn-sm',
                                visible: function (i, d) {
                                    return true;
                                },
                                handle: function (i, d) {
                                    var modal = $.orangeModal({
                                        id: "approve_edit_form_modal",
                                        title: "修改申请人信息",
                                        width: "70%",
                                        height: "460px",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '保存',
                                                cls: 'btn btn-warning',
                                                handle: function (mm) {
                                                    bootbox.confirm("确定修改吗?", function (result) {
                                                        if (result) {
                                                            var arr = [];
                                                            mm.$body.find(".edit").each(function () {
                                                                var that = $(this);
                                                                arr.push({
                                                                    'name': that.attr("data-name"),
                                                                    'id': that.attr("data-id"),
                                                                    'value': that.val()
                                                                });
                                                            });
                                                            var requestUrl = App.href + "/api/score/info/identityInfo/updateEdit";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    identityInfoId: d.id,
                                                                    editInfo: JSON.stringify(arr)
                                                                },
                                                                success: function (data) {
                                                                    var requestUrl1 = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_edit";
                                                                    $.ajax({
                                                                        type: "GET",
                                                                        dataType: "json",
                                                                        url: requestUrl1,
                                                                        success: function (data) {
                                                                            modal.$body.html(data.data.html);
                                                                        },
                                                                        error: function (e) {
                                                                            console.error("请求异常。");
                                                                        }
                                                                    });
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
                                                handle: function (mm) {
                                                    mm.hide();
                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_edit1";
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
                                text: '修改材料+打分状态',
                                cls: 'btn-danger btn-sm',
                                visible: function (i, d) {
                                    return d.formerName==100;
                                },
                                handle: function (i, d) {
                                    var modal = $.orangeModal({
                                        id: "approve_edit_form_modal",
                                        title: "修改申请人材料+打分状态",
                                        width: "70%",
                                        height: "460px",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '保存',
                                                cls: 'btn btn-warning',
                                                handle: function (mm) {
                                                    bootbox.confirm("确定修改吗?", function (result) {
                                                        if (result) {
                                                            var arr = [];
                                                            mm.$body.find(".id").each(function () {
                                                                var that = $(this);
                                                                arr.push({
                                                                    'id': that.val()
                                                                });
                                                            });
                                                            // 材料接收与打分的状态
                                                            var arr2 = [];
                                                            mm.$body.find(".status").each(function () {
                                                                var that = $(this);
                                                                arr2.push({
                                                                    'status': that.val()
                                                                });
                                                            });
                                                            // 得分
                                                            var arr3 = [];
                                                            mm.$body.find(".scoreValue").each(function () {
                                                                var that = $(this);
                                                                arr3.push({
                                                                    'scoreValue': that.val()
                                                                });
                                                            });

                                                            // 打分项目
                                                            var arr4 = [];
                                                            mm.$body.find(".indicatorName").each(function () {
                                                                var that = $(this);
                                                                arr4.push({
                                                                    'indicatorName': that.val()
                                                                });
                                                            });

                                                            var requestUrl = App.href + "/api/score/info/identityInfo/saveChange";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    ids: JSON.stringify(arr),
                                                                    statuss:JSON.stringify(arr2),
                                                                    scoreValues:JSON.stringify(arr3),
                                                                    indicatorNames:JSON.stringify(arr4)
                                                                },
                                                                success: function (data) {
                                                                    var requestUrl1 = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id + "&template=identity_info_for_edit";
                                                                    $.ajax({
                                                                        type: "GET",
                                                                        dataType: "json",
                                                                        url: requestUrl1,
                                                                        success: function (data) {
                                                                            modal.$body.html(data.data.html);
                                                                        },
                                                                        error: function (e) {
                                                                            console.error("请求异常。");
                                                                        }
                                                                    });
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
                                                handle: function (mm) {
                                                    mm.hide();
                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/info/identityInfo/changeMaterialAndScore?identityInfoId=" + d.id + "&template=score_record_edit";
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
                                text: "审核过程",
                                cls: "btn-success btn-sm",
                                handle: function (index, data) {
                                    statusProgress(data);
                                }
                            },
                            {
                                text: "查看指标",
                                cls: "btn-primary btn-sm",
                                handle: function (index, d) {
                                    scoreRecord(d.id);
                                }
                            }, {
                                text: "追加人社受理通过",
                                cls: "btn-warning btn-sm",
                                visible: function (i, d) {
                                    return d.rensheAcceptStatus == 3;
                                },
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/appendAgree";
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: requestUrl,
                                                data: {
                                                    id: d.id
                                                },
                                                success: function (data) {
                                                    grid.reload();
                                                    if (data.code !== 200) {
                                                        bootbox.alert(data.message);
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
                                text: "恢复到测评前",
                                cls: "btn-danger btn-sm",
                                visible: function (i, d) {
                                    return true;
                                },
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作，恢复此人到测评前?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/selfTest";
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: requestUrl,
                                                data: {
                                                    id: d.id
                                                },
                                                success: function (data) {
                                                    grid.reload();
                                                    if (data.code !== 200) {
                                                        bootbox.alert(data.message);
                                                    }
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


    var statusProgress = function (d) {
        var modal = $.orangeModal({
            id: "status_form_modal",
            title: "审核过程",
            destroy: true
        }).show();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/personBatchStatusRecord/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
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
                    var grid;
                    var options = {
                        url: App.href + "/api/score/personBatchStatusRecord/list?batchId=" + d.batchId + "&personIdNumber=" + d.idNumber,
                        contentType: "timeline",
                        contentTypeItems: "timeline,table,list",
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
                        actionColumns: [],
                        tools: []
                    };
                    modal.$body.orangeGrid(options);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                console.error("请求异常。");
            }
        });
    };
    var scoreRecord = function (personId) {
        var modal = $.orangeModal({
            id: "view_score_form_modal",
            title: "查看申请人打分信息",
            destroy: true
        }).show();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/monitor/scoreInfo/score/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var scoreRecordStatus = fd.data.scoreRecordStatus;
                    if (searchItems == null)
                        searchItems = [];
                    var columns = [];
                    $.each(formItems, function (ii, dd) {
                        if (dd.type === 'text') {
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
                        title: '打分',
                        field: 'scoreValue'
                    });
                    columns.push({
                        title: '办理进度',
                        field: 'status',
                        format: function (i, d) {
                            return scoreRecordStatus[d.status];
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/monitor/scoreInfo/score/list?personId=" + personId,
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
                                cls: "btn-danger btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_score_detail_form_modal",
                                        title: "查看打分信息",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/monitor/scoreInfo/scoreDetail?identityInfoId=" + d.personId + "&indicatorId=" + d.indicatorId;
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
                                                modal.$body.find("input[d-indicator=" + arr[0] + "_" + arr[1] + "]").val(parseFloat(arr[2]).toFixed(2));
                                            }
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "重新人社受理通过",
                                cls: "btn-warning btn-sm",
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/reAgree";
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: requestUrl,
                                                data: {
                                                    id: d.personId,
                                                    indicatorId: d.indicatorId
                                                },
                                                success: function (data) {
                                                    grid.reload();
                                                    if (data.code !== 200) {
                                                        bootbox.alert(data.message);
                                                    }
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
