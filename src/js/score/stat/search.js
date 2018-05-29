/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/stat/search/byCompany": "searchByCompany",
        "/api/score/stat/search/byIdentityInfo": "searchByIdentityInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.searchByIdentityInfo = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">按申请人搜索</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            $.ajax({
                type: "GET",
                dataType: "json",
                url: App.href + "/api/score/info/identityInfo/formItems",
                success: function (fd) {
                    if (fd.code === 200) {
                        var formItems = fd.data.formItems;
                        var searchItems = fd.data.searchItems;
                        var reservationStatus = fd.data.reservationStatus;
                        var hallStatus = fd.data.hallStatus;
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
                                    text: "审核过程",
                                    cls: "btn-success btn-sm",
                                    handle: function (index, data) {
                                        statusProgress(data);
                                    }
                                }
                            ],
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
                                            action: App.href + "/api/score/info/identityInfo/insert",
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
        }
    };
    App.searchByCompany = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">按企业搜索</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            $.ajax({
                type: "GET",
                dataType: "json",
                url: App.href + "/api/score/info/identityInfo/formItems",
                success: function (fd) {
                    if (fd.code === 200) {
                        var formItems = fd.data.formItems;
                        var searchItems = fd.data.searchItems;
                        var reservationStatus = fd.data.reservationStatus;
                        var hallStatus = fd.data.hallStatus;
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
                        var grid;
                        var options = {
                            url: App.href + "/api/score/stat/search/byCompany",
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
                                }
                            ],
                            search: {
                                rowEleNum: 2,
                                //搜索栏元素
                                items: [
                                    {
                                        type: "select",
                                        label: "批次",
                                        name: "batchId",
                                        itemsUrl: App.href + '/api/score/batchConf/options'
                                    }, {
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
                                    }, {
                                        type: 'text',
                                        label: '统一社会信用代码',
                                        name: 'societyCode'
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
        }
    };

})(jQuery, window, document);
