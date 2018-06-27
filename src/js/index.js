/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var token = $.cookie(App.token_key);
    if (token === undefined) {
        App.redirectLogin();
    }

    App.token = token;
    var requestMapping = {
        "/api/index": "index"
    };
    App.requestMapping = $.extend({}, App.requestMapping, requestMapping);

    App.index = {
        page: function (title) {
            App.content.empty();
            App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">在办件</div>' +
                '<div class="panel-body" id="content1"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待办件</div>' +
                '<div class="panel-body" id="content2"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">限期办理列表</div>' +
                '<div class="panel-body" id="content3"></div>' +
                '</div>' +
                '</div>' +
                '</div>');
            App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
    };


})
(jQuery, window, document);
