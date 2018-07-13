/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/materialReceive/receiving": "scoreMaterialReceiveReceiving",
        "/api/score/materialReceive/received": "scoreMaterialReceiveReceived"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreMaterialReceiveReceiving = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待接收</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreMaterialReceive("receiving");
        }
    };
    App.scoreMaterialReceiveReceived = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">已接收</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreMaterialReceive("received");
        }
    };
    var scoreMaterialReceive = function (mode) {
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
                        title: '办理进度',
                        field: 'status',
                        format: function (i, d) {
                            return scoreRecordStatus[d.status];
                        }
                    });
                    var grid;
                    var options = {
                        url: App.href + "/api/score/materialReceive/" + mode,
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
                                        id: "view_receive_form_modal",
                                        title: "查看",
                                        destroy: true
                                    }).show();
                                    var requestUrl = App.href + "/api/score/materialReceive/detailAll?identityInfoId=" + d.personId + "&indicatorId=" + d.indicatorId;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var clist = data.data.mCheckList;
                                            for (var i in clist) {
                                                modal.$body.find("input[name=material]:checkbox[value='" + clist[i] + "']").attr('checked', 'true');
                                            }
                                        },
                                        error: function (e) {
                                            console.error("请求异常。");
                                        }
                                    });
                                }
                            }, {
                                text: "接收",
                                cls: "btn-primary btn-sm",
                                visible: function (i, d) {
                                    return d.status === 2;
                                },
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "receive_form_modal",
                                        title: "接收",
                                        destroy: true,
                                        buttons: [
                                            {
                                                text: '确认送达',
                                                cls: 'btn btn-info',
                                                handle: function (m) {
                                                    bootbox.confirm("确定该操作?", function (result) {
                                                        if (result) {
                                                            var mIds = [];
                                                            m.$body.find('input[name="material"]:checked').each(function () {
                                                                mIds.push($(this).val());
                                                            });
                                                            if (mIds.length == 0) {
                                                                bootbox.alert('请选择送达材料');
                                                                return;
                                                            }
                                                            var requestUrl = App.href + "/api/score/materialReceive/confirmReceived";
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: requestUrl,
                                                                data: {
                                                                    personId: d.personId,
                                                                    mIds: mIds.toString(),
                                                                    opRoleId: d.opRoleId
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
                                    var requestUrl = App.href + "/api/score/materialReceive/detailAll?identityInfoId=" + d.personId + "&indicatorId=" + d.indicatorId;
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: requestUrl,
                                        success: function (data) {
                                            modal.$body.html(data.data.html);
                                            var clist = data.data.mCheckList;
                                            for (var i in clist) {
                                                modal.$body.find("input[name=material]:checkbox[value='" + clist[i] + "']").attr('checked', 'true');
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
