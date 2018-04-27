/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/approve/policePrevApprove/approving": "scorePolicePrevApproving",
        "/api/score/approve/policePrevApprove/approved": "scorePolicePrevApproved",
        "/api/score/approve/policePrevApprove/rejected": "scorePolicePrevRejected"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scorePolicePrevApproving = {
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
            scorePolicePrevApprove("approving");
        }
    };
    App.scorePolicePrevApproved = {
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
            scorePolicePrevApprove("approved");
        }
    };
    App.scorePolicePrevRejected = {
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
            scorePolicePrevApprove("rejected");
        }
    };
    var scorePolicePrevApprove = function (type) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/approve/policePrevApprove/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    var searchItems = fd.data.searchItems;
                    var unionApproveStatus1 = fd.data.unionApproveStatus1;
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
                            title: '公安审核状态',
                            field: 'unionApproveStatus1',
                            format: function (i, cd) {
                                return unionApproveStatus1[cd.unionApproveStatus1];
                            }
                        }
                    );
                    var grid;
                    var options = {
                        url: App.href + "/api/score/approve/policePrevApprove/" + type,
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
                                        id: "view_form_modal",
                                        title: "查看申请人信息",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '打印信息',
                                                cls: 'btn btn-warning',
                                                handle: function (m) {

                                                }
                                            }
                                        ]
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
                                            alert("请求异常。");
                                        }
                                    });
                                }
                            },{
                                text: "审核",
                                cls: "btn-info btn-sm",
                                visible: function (i, d) {
                                    return d.unionApproveStatus1 == 1;
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
                                                    var requestUrl = App.href + "/api/score/approve/policePrevApprove/agree";
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
                                                            alert("请求异常。");
                                                        }
                                                    });
                                                }
                                            },
                                            {
                                                text: '不通过',
                                                cls: 'btn btn-danger',
                                                handle: function (m) {
                                                    var requestUrl = App.href + "/api/score/approve/policePrevApprove/disAgree";
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
                                                            alert("请求异常。");
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }).show();
                                    var requestUrl = App.href + "/api/score/approve/policePrevApprove/detailAll?id=" + d.id;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                        },
                                        error: function (e) {
                                            alert("请求异常。");
                                        }
                                    });
                                }
                            }],
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
                alert("请求异常。");
            }
        });
    };

    var identityInfo = function (d, ele, view) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/identityInfo/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    $.each(formItems, function (ii, dd) {
                        if (dd.itemsUrl !== undefined) {
                            dd.itemsUrl = App.href + dd.itemsUrl;
                        }
                        if (dd.url !== undefined) {
                            dd.url = App.href + dd.url;
                        }
                        if (dd.type == 'image') {
                            dd.type = 'hidden'
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
                    ele.orangeForm({
                        id: "viewIdentityInfo_edit_form",
                        name: "viewIdentityInfo_edit_form",
                        method: "POST",
                        rowEleNum: 2,
                        action: App.href + "/api/score/identityInfo/update",
                        ajaxSubmit: true,
                        ajaxSuccess: function () {

                        },
                        submitText: "保存",
                        showReset: true,
                        resetText: "重置",
                        isValidate: true,
                        labelInline: false,
                        viewMode: view,
                        showAction: false,
                        buttons: [{
                            type: 'button',
                            text: '关闭',
                            handle: function () {
                                modal.hide();
                            }
                        }],
                        buttonsAlign: "center",
                        items: formItems
                    }).loadRemote(App.href + "/api/score/identityInfo/detail?id=" + d.id);
                }
            }
        });

    };

    var houseProfession = function (d, ele, view) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/houseProfession/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    $.each(formItems, function (ii, dd) {
                        if (dd.itemsUrl != '')
                            dd.itemsUrl = App.href + dd.itemsUrl;
                        if (dd.url != '')
                            dd.url = App.href + dd.url;
                    });
                    ele.orangeForm({
                        id: "house_profession_edit_form",
                        name: "house_profession_edit_form",
                        method: "POST",
                        action: App.href + "/api/score/houseProfession/update",
                        ajaxSubmit: true,
                        ajaxSuccess: function () {

                        },
                        rowEleNum: 2,
                        submitText: "保存",
                        showReset: true,
                        resetText: "重置",
                        isValidate: true,
                        labelInline: false,
                        viewMode: view,
                        showAction: false,
                        buttons: [{
                            type: 'button',
                            text: '关闭',
                            handle: function () {
                                modal.hide();
                            }
                        }],
                        buttonsAlign: "center",
                        items: formItems
                    }).loadRemote(App.href + "/api/score/houseProfession/detailByIdentityId?identityInfoId=" + d.id);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                alert("请求异常。");
            }
        });
    };

    var houseMove = function (d, ele, view) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/houseMove/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    $.each(formItems, function (ii, dd) {
                        if (dd.itemsUrl !== undefined) {
                            dd.itemsUrl = App.href + dd.itemsUrl;
                        }
                        if (dd.url !== undefined) {
                            dd.url = App.href + dd.url;
                        }
                    });
                    ele.orangeForm({
                        id: "house_move_edit_form",
                        name: "house_move_edit_form",
                        method: "POST",
                        action: App.href + "/api/score/houseMove/update",
                        ajaxSubmit: true,
                        ajaxSuccess: function () {

                        },
                        rowEleNum: 3,
                        submitText: "保存",
                        showReset: true,
                        resetText: "重置",
                        labelInline: false,
                        viewMode: view,
                        showAction: false,
                        buttons: [{
                            type: 'button',
                            text: '关闭',
                            handle: function () {
                                modal.hide();
                            }
                        }],
                        buttonsAlign: "center",
                        items: formItems
                    }).loadRemote(App.href + "/api/score/houseMove/detailByIdentityId?identityInfoId=" + d.id);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                alert("请求异常。");
            }
        });
    };

    var houseOther = function (d, ele, view) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: App.href + "/api/score/houseOther/formItems",
            success: function (fd) {
                if (fd.code === 200) {
                    var formItems = fd.data.formItems;
                    $.each(formItems, function (ii, dd) {
                        if (dd.itemsUrl !== undefined) {
                            dd.itemsUrl = App.href + dd.itemsUrl;
                        }
                        if (dd.url !== undefined) {
                            dd.url = App.href + dd.url;
                        }
                    });
                    ele.orangeForm({
                        id: "house_other_edit_form",
                        name: "house_other_edit_form",
                        method: "POST",
                        action: App.href + "/api/score/houseOther/update",
                        ajaxSubmit: true,
                        rowEleNum: 3,
                        ajaxSuccess: function () {
                        },
                        submitText: "保存",
                        showReset: true,
                        resetText: "重置",
                        isValidate: true,
                        labelInline: false,
                        viewMode: view,
                        showAction: false,
                        buttons: [{
                            type: 'button',
                            text: '关闭',
                            handle: function () {
                                modal.hide();
                            }
                        }],
                        buttonsAlign: "center",
                        items: formItems
                    }).loadRemote(App.href + "/api/score/houseOther/detailByIdentityId?identityInfoId=" + d.id);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                alert("请求异常。");
            }
        });
    };
})(jQuery, window, document);
