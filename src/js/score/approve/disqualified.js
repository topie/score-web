/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/approve/renshePrevApprove/toReview": "toReview2"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.toReview2 = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">积分查询-申请复核</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            scoreRenshePrevApprove("toReview");
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
                    searchItems.push(
                        {
                            type: 'select',
                            label: '申请复核是否处理',
                            name: 'isDone',
                            items: [
                                {
                                    text: '全部',
                                    value: 12
                                },
                                {
                                    text: '没处理',
                                    value: 1
                                }, {
                                    text: '已处理',
                                    value: 2
                                }
                            ]
                        }
                    );
                    var columns = [];
                    columns.push({
                        title: '受理编号',
                        field: 'acceptNumber'
                    });
                    columns.push({
                        title: '姓名',
                        field: 'name',
                    });
                    columns.push({
                        title: '身份证号码',
                        field: 'idNumber'
                    });
                    columns.push({
                        title: '申请人申请复核的理由',
                        field: 'cancelReason'
                    });
                    columns.push({
                        title: '申请复核的时间',
                        field: 'toreviewtime'
                    });
                    columns.push({
                        title: '申请复核是否完毕',
                        field: 'istoreview',
                        format: function (ii, dd) {
                            return dd.istoreview === 2 ? '完毕' : '复核中';
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
                        select2: true,
                        columns: columns,
                        actionColumnText: "操作",//操作列文本
                        actionColumnWidth: "20%",
                        actionColumns: [
                            {
                                text: "点击办结",
                                cls: "btn-danger btn-sm",
                                visible: function (i, d) {
                                    return d.istoreview == 1;
                                },
                                handle: function (index, d) {
                                    bootbox.confirm("确定该操作？", function (result) {
                                        if (result){
                                            var requestUrl = App.href + "/api/score/approve/rensheAccept/clickHandle?id=" + d.id;
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
                            items: searchItems,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '导出',
                                    cls: "btn btn-danger btn-sm",
                                    handle: function (g) {
                                        var downloadUrl = App.href + "/api/score/stat/export/exportDisqualified?" + g.$searchForm.serialize();
                                        window.open(downloadUrl);
                                    }
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
    };

})(jQuery, window, document);
