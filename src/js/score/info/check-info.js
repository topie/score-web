/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/info/checkInfo/list": "scoreCheckInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreCheckInfo = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">汇总发布</div>' +
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
            url: App.href + "/api/score/info/checkInfo/batch/formItems",
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
                        url: App.href + "/api/score/info/checkInfo/batch/list",
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
                                text: "查看申请人",
                                cls: "btn-info btn-sm",
                                visible: function (i, d) {
                                    return d.process >= 1;
                                },
                                handle: function (index, d) {
                                    viewIdentityInfo(d.id);
                                }
                            }, {
                                text: "汇总发布",
                                visible: function (i, d) {
                                    return d.process === 1;
                                },
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/info/checkInfo/checkBatch";
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: requestUrl,
                                                data: {
                                                    batchId: d.id
                                                },
                                                success: function (result) {
                                                    grid.reload();
                                                },
                                                error: function (e) {
                                                    console.error("请求异常。");
                                                }
                                            });
                                        }
                                    });
                                }
                            }, {
                                text: "取消汇总发布",
                                visible: function (i, d) {
                                    return d.process === 2;
                                },
                                cls: "btn-warning btn-sm",
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/info/checkInfo/cancelCheck";
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: requestUrl,
                                                data: {
                                                    batchId: d.id
                                                },
                                                success: function (result) {
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
    var viewIdentityInfo = function (batchId) {
        var modal = $.orangeModal({
            id: "view_person_form_modal",
            title: "查看申请人信息",
            destroy: true
        }).show();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/info/checkInfo/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var reservationStatus = fd.data.reservationStatus;
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
                        title: '核算状态',
                        field: 'resultStatus',
                        format: function (i, cd) {
                            return cd.resultStatus === 0 ? '未核算' : '已核算';
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/info/checkInfo/list?batchId=" + batchId,
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
                                text: "查看打分情况",
                                cls: "btn-Warning btn-sm",
                                handle: function (index, data) {
                                    scoreRecord(data.id);
                                }
                            }, {
                                text: "核算",
                                cls: "btn-success btn-sm",
                                visible: function (i, d) {
                                    return d.hallStatus === 9;
                                },
                                handle: function (index, data) {
                                    bootbox.confirm("确定该操作?", function (result) {
                                        if (result) {
                                            var requestUrl = App.href + "/api/score/info/checkInfo/checkPerson";
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: requestUrl,
                                                data: {
                                                    identityInfoId: data.id
                                                },
                                                success: function (result) {
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
                        title: '打分',
                        field: 'scoreValue'
                    });
                    columns.push(
                        {
                            title: '打分部门',
                            field: 'opRole'
                        }
                    );
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
                            }
                        ]
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
})(jQuery, window, document);
