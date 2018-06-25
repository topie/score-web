/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var vkey = App.token_key + "_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);

    function initLogin() {
        $("#captcha_img").attr("src", App.href + "/api/noneAuth/captcha?vkey=" + vkey);
        $("#captcha_a").on("click", function () {
            vkey = App.token_key + "_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);
            $("#captcha_img").attr("src", App.href + "/api/noneAuth/captcha?vkey=" + vkey + "&s=" + new Date().getTime());
        });
        $('#username,#password,#vcode').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                login();
            }
        });
        $("#login_btn").on("click", login);
        var alertTmpl = '<div id="alertDive" class="alert alert-${type_} alert-dismissable" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
            + '<p id="alertContent">${alert_}</p></div>';
        var alertDiv = $.tmpl(alertTmpl, {
            "type_": 'warning',
            "alert_": ""
        }).hide();
        $("#login-form").prepend(alertDiv);
    }

    function alertValidate(alertText) {
        if (alertText === '坏的凭证')
            alertText = '密码不正确';
        var alertDiv = $("#login-form").find("#alertDive");
        alertDiv.find("#alertContent").text(alertText);
        alertDiv.show();
        alertDiv.delay(5 * 1000).fadeOut();
        App.scrollTo(alertDiv, -200);
    }

    var login = function () {
        if ($.trim($("#username").val()) == "") {
            alertValidate("登录名不能为空!");
            $("#captcha_a").trigger("click");
            return;
        }
        if ($.trim($("#password").val()) == "") {
            alertValidate("密码不能为空!");
            $("#captcha_a").trigger("click");
            return;
        }
        if ($.trim($("#vcode").val()) == "") {
            alertValidate('验证码不能为空!');
            $("#captcha_a").trigger("click");
            return;
        }
        var fields = JSON.stringify(
            {
                "username": $("#username").val(),
                "password": $("#password").val(),
                "vcode": $("#vcode").val(),
                "vkey": vkey
            });
        $.ajax({
            type: 'POST',
            url: App.href + "/api/token/login",
            contentType: "application/json",
            dataType: "json",
            data: fields,
            success: function (result) {
                if (result.code === 200) {
                    $.cookie(App.token_key, result.token, {expires: 7});
                    window.location.href = App.href + "/index.html";
                } else {
                    alertValidate(result.message);
                    $("#captcha_a").trigger("click");
                }
            }
        });
    };
    $(document).ready(function () {
        initLogin();
    });
})(jQuery, window, document);
