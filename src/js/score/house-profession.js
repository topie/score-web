/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/houseProfession/list": "scoreHouseProfession"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.scoreHouseProfession = {
        edit: edit
    };
    var edit = function (d) {
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
                    var modal = $.orangeModal({
                        id: "edit_form_modal",
                        title: "职业信息",
                        destroy: true
                    }).show();
                    var form = modal.$body.orangeForm({
                        id: "edit_form",
                        name: "edit_form",
                        method: "POST",
                        action: App.href + "/api/score/houseProfession/update",
                        ajaxSubmit: true,
                        ajaxSuccess: function () {
                            modal.hide();
                            grid.reload();
                        },
                        submitText: "保存",
                        showReset: true,
                        resetText: "重置",
                        isValidate: true,
                        labelInline: true,
                        buttons: [{
                            type: 'button',
                            text: '关闭',
                            handle: function () {
                                modal.hide();
                            }
                        }],
                        buttonsAlign: "center",
                        items: formItems
                    });
                    form.loadRemote(App.href + "/api/score/houseProfession/detail?id=" + d.id);
                } else {
                    alert(fd.message);
                }
            },
            error: function (e) {
                alert("请求异常。");
            }
        });
    }
})(jQuery, window, document);
