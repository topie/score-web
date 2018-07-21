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
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/approve/rensheAccept/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var hallStatus = fd.data.hallStatus;
                    var rensheAcceptStatus = fd.data.rensheAcceptStatus;
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
                    columns.push(
                        {
                            title: '预约大厅状态',
                            field: 'hallStatus',
                            format: function (i, cd) {
                                return hallStatus[cd.hallStatus];
                            }
                        },
                        {
                            title: '人社受理状态',
                            field: 'rensheAcceptStatus',
                            format: function (i, cd) {
                                return rensheAcceptStatus[cd.rensheAcceptStatus];
                            }
                        });
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
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [
                            {
                                text: "打印接收凭证",
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
                                }
                            }, {
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
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/disAgree";
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
                                    var requestUrl = App.href + "/api/score/info/identityInfo/detailAll?identityInfoId=" + d.id+ "&template=identity_info_for_pre";
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
