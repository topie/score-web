/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/core/log/list": "coreLog"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.coreLog = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">留痕列表</div>' +
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
        var searchItems = [];
        var columns = [
            {
                title: '操作人',
                field: 'logUser'
            }, {
                title: '操作内容',
                field: 'logContent'
            }, {
                title: '操作时间',
                field: 'logTime'
            }
        ];
        var grid;
        var options = {
            url: App.href + "/api/core/log/list",
            contentType: "table",
            contentTypeItems: "table,card,list",
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "ID",//id域指定
            headField: "ID",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: columns,
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%"
        };
        grid = window.App.content.find("#grid").orangeGrid(options);
    }
})(jQuery, window, document);
