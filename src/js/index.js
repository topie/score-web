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
                '<div class="col-md-4 col-xs-12">' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">当日预约人数</div>' +
                '<div class="panel-body" id="content1">' +
                '<div class="panel panel-info">' +
                '    <div class="panel-heading">' +
                '        <div class="row">' +
                '            <div class="col-xs-3">' +
                '                <i class="fa fa-user"></i>' +
                '            </div>' +
                '            <div class="col-xs-9 text-right">' +
                '                <div id="cnt" class="huge">0</div>' +
                '                <div>预约人数</div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '<div class="panel-footer">' +
                '        <span id="address" class="pull-right"></span>' +
                '        <div class="clearfix"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4 col-xs-12">' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">明日预约人数</div>' +
                '<div class="panel-body" id="content1">' +
                '<div class="panel panel-warning">' +
                '    <div class="panel-heading">' +
                '        <div class="row">' +
                '            <div class="col-xs-3">' +
                '                <i class="fa fa-user"></i>' +
                '            </div>' +
                '            <div class="col-xs-9 text-right">' +
                '                <div id="cnt2" class="huge">-</div>' +
                '                <div>预约人数</div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '<div class="panel-footer">' +
                '        <span id="address2" class="pull-right"></span>' +
                '        <div class="clearfix"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4 col-xs-12">' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">昨日预约人数</div>' +
                '<div class="panel-body" id="content1">' +
                '<div class="panel panel-info">' +
                '    <div class="panel-heading">' +
                '        <div class="row">' +
                '            <div class="col-xs-3">' +
                '                <i class="fa fa-user"></i>' +
                '            </div>' +
                '            <div class="col-xs-9 text-right">' +
                '                <div id="cnt3" class="huge">0</div>' +
                '                <div>预约人数</div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '<div class="panel-footer">' +
                '        <span id="address3" class="pull-right"></span>' +
                '        <div class="clearfix"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12  col-xs-12">' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">待办件</div>' +
                '<div class="panel-body" id="content2"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12  col-xs-12" >' +
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
        var requestUrl = App.href + "/api/score/index/reservationCount";
        $.ajax({
            type: "GET",
            dataType: "json",
            url: requestUrl,
            success: function (data) {
                App.content.find("#cnt").html(data.data.cnt);
                App.content.find("#address").html(data.data.address);
                App.content.find("#cnt2").html(data.data.cnt2);
                App.content.find("#address2").html(data.data.address2);
                App.content.find("#cnt3").html(data.data.cnt3);
                App.content.find("#address3").html(data.data.address3);
            },
            error: function (e) {
                console.error("请求异常。");
            }
        });
    };


})
(jQuery, window, document);
