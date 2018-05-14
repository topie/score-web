/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/info/listInfo/list": "scoreListInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreListInfo = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">名单公示</div>' +
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
            url: App.href + "/api/score/info/listInfo/batch/formItems",
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
                        url: App.href + "/api/score/info/listInfo/batch/list",
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
                                text: "批次信息",
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_form_modal",
                                        title: "批次信息",
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
                                text: "分数排行",
                                cls: "btn-danger btn-sm",
                                handle: function (index, d) {
                                    var modal = $.orangeModal({
                                        id: "view_form_modal",
                                        title: "分数排行",
                                        destroy: true
                                    }).show();
                                    var options = {
                                        url: App.href + "/api/score/info/listInfo/rank?batchId=" + d.id,
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
                                        columns: [
                                            {
                                                title: '申请人',
                                                field: 'personName'
                                            },
                                            {
                                                title: '申请人身份证',
                                                field: 'personIdNum'
                                            },
                                            {
                                                title: '得分',
                                                field: 'scoreValue'
                                            }
                                        ]
                                    };
                                    modal.$body.orangeGrid(options);
                                }
                            }, {
                                text: "公示",
                                visible: function (i, d) {
                                    return d.process === 2;
                                },
                                cls: "btn-info btn-sm",
                                handle: function (index, d) {

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

})(jQuery, window, document);
