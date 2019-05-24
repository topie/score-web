/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/monitor/scoreInfo/list": "monitorScoreInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.monitorScoreInfo = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">申请人列表</div>' +
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
            url: App.href + "/api/score/monitor/scoreInfo/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var reservationStatus = fd.data.reservationStatus;
                    var companyNames = fd.data.companyNames;//企业名称，包含数据库所有的企业
                    var personBatchStatusRecords = fd.data.personBatchStatusRecords;//审核过程，包含所有通过人社受理审核的人
                    var newSearchItems = [];
                    if (searchItems != null) {
                        $.each(searchItems, function (ii, dd) {
                            if (dd.name !== 'batchId') {
                                newSearchItems.push(dd);
                            }
                        });
                    }
                    searchItems = newSearchItems;
                    searchItems.push({
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
                        if (dd.name === 'nation') {
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
                        title:'受理地点',
                        field:'acceptAddressId',
                        format: function (ii, dd) {
                            return dd.acceptAddressId === 1 ? '市级行政许可中心' : '滨海新区行政服务中心';
                        }
                    });
                    columns.push({
                       title: "受理日期",//通过人社受理审核日期
                        field: "STATUS_TIME",
                        format: function (i, cd) {
                            return personBatchStatusRecords[cd.id];
                        }
                    });
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
                    var grid;
                    var options = {
                        url: App.href + "/api/score/monitor/scoreInfo/list",
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
                        select2: true,
                        columns: columns,
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [
                            {
                                text: "查看基本信息",
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_form_modal",
                                        title: "查看申请人信息",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/monitor/scoreInfo/detailAll?identityInfoId=" + d.id;
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
                            },
                            {
                                text: "查看指标",
                                cls: "btn-primary btn-sm",
                                handle: function (index, d) {
                                    scoreRecord(d.id);
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
    var scoreRecord = function (personId) {
        /*
        2018年10月18日，在弹窗上显示当前总分
         */
        var sumScore = 0;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/monitor/scoreInfo/score/SumScoreValue?personId=" + personId,
            success: function (fd) {
                sumScore = fd.data.sumScore;
                var modal = $.orangeModal({
                    id: "view_score_form_modal",
                    title: "查看申请人打分信息，总分："+sumScore,
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
            },
            error: function (e) {
                console.error("请求异常。");
            }
        });


    };
})(jQuery, window, document);
