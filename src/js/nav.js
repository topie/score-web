/**
 * Created by chenguojun on 9/28/16.
 */
;
(function ($, window, document, undefined) {
    App.menu = {
        "initSideMenu": initSideMenu,
        "toggleMenu": toggleMenu,
        "showUserInfo": showUserInfo,
        "initHMenu": initHMenu
    };
    App.menusMapping = {};
    App.menu.userOption = {
        id: "current_user_form",//表单id
        name: "current_user_form",//表单名
        method: "POST",//表单method
        action: App.href + "/api/index/updateUser",
        ajaxSubmit: true,//是否使用ajax提交表单
        submitText: "提交",//保存按钮的文本
        showReset: true,//是否显示重置按钮
        resetText: "重置",//重置按钮文本
        isValidate: true,//开启验证
        buttonsAlign: "center",
        items: [
            {
                type: 'hidden',
                name: 'id',
                id: 'id'
            }, {
                type: 'password',//类型
                name: 'password',//name
                id: 'password',//id
                label: '旧密码',//左边label
                rule: {
                    required: true
                },
                message: {
                    required: "请输入旧密码"
                }
            }, {
                type: 'password',//类型
                name: 'newPassword',//name
                id: 'newPassword',//id
                label: '新密码',//左边label
                rule: {
                    minlength: 6,
                    maxlength: 64
                },
                message: {
                    minlength: "至少{0}位",
                    maxlength: "做多{0}位"
                }
            }, {
                type: 'text',//类型
                name: 'contactPhone',//name
                id: 'contactPhone',//id
                label: '手机'
            }, {
                type: 'text',//类型
                name: 'email',//name
                id: 'email',//id
                label: '邮箱'
            }
        ]
    };
    function showUserInfo() {
        var modal = $.orangeModal({
            id: "userForm",
            title: "用户信息",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show();
        App.menu.userOption.ajaxSuccess = function () {
            modal.hide();
            window.location.reload();
        };
        var form = modal.$body.orangeForm(App.menu.userOption);
        form.loadRemote(App.href + "/api/index/loadCurrentUser");
    }
    function toggleMenu() {
        var toggle = $.cookie('spring-menu-toggle');
        if (toggle === undefined) {
            toggle = "s";
        }
        if (toggle === "s") {
            $.cookie('spring-menu-toggle', "v", {expires: 7, path: '/'});
        } else {
            $.cookie('spring-menu-toggle', "s", {expires: 7, path: '/'});
        }
    }

    function initHMenu() {
        var ul = "#h-menu";
        var sidebar = $('<div id="h-sidebar" class="sidebar h-sidebar navbar-collapse collapse ace-save-state">' +
            '<div class="sidebar-shortcuts" id="sidebar-shortcuts">' +
            '    <div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">' +
            '<span class="btn btn-success"></span>' +
            '<span class="btn btn-info"></span>' +
            '<span class="btn btn-warning"></span>' +
            '<span class="btn btn-danger"></span>' +
            '    </div>' +
            '</div>' +
            '<ul id="h-menu" class="nav nav-list">' +
            '</ul>' +
            '    </div>');
        $("#main-container").prepend(sidebar);
        $("#menu-toggler").attr("data-target", "#h-sidebar");
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("#spring_login_user_name").text(userInfo.displayName);
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        var topMenus = getTopMenu(menus);
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var drop = '';
                                var b = '';
                                var subMenus = getSubMenu(menus, m.id);
                                if (subMenus.length > 0) {
                                    drop = 'class="dropdown-toggle" ';
                                    b = '<b class="arrow fa fa-angle-down"></b>';
                                }
                                var ele =
                                    '<li class="hover">'
                                    + '<a data-url="' + m.action
                                    + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);" ' + drop + '><i class="menu-icon fa fa-desktop"></i> '
                                    + '<span class="menu-text">' + m.functionName + '</span>' + b + '</a>';

                                if (subMenus.length > 0) {
                                    ele = subHMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                $(ul).append(li);
                            }
                        });
                        $(ul).find("a[data-url!=#]")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    $(this).on("click", function () {
                                        window.location.href = App.href + '/index.html?u=' + url;
                                    });
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!",function(){
                            window.location.href = '../login.html';
                        });
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    function initSideMenu() {
        var ul = "#side-menu";
        var sidebar = $('<div id="sidebar" class="sidebar responsive ace-save-state">' +
            '<ul id="side-menu" class="nav nav-list">' +
            '</ul>' +
            '<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">' +
            '<i id="sidebar-toggle-icon" class="ace-icon fa fa-angle-double-left ace-save-state" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>' +
            '</div>' +
            '</div>');
        $("#main-container").prepend(sidebar);
        $("#menu-toggler").attr("data-target", "#sidebar");
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("#spring_login_user_name").text(userInfo.displayName);
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        var topMenus = getTopMenu(menus);
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var drop = '';
                                var b = '';
                                var subMenus = getSubMenu(menus, m.id);
                                if (subMenus.length > 0) {
                                    drop = 'class="dropdown-toggle" ';
                                    b = '<b class="arrow fa fa-angle-down"></b>';
                                }
                                var ele =
                                    '<li class="">'
                                    + '<a data-url="' + m.action
                                    + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);" ' + drop + '><i class="menu-icon fa fa-desktop"></i> '
                                    + '<span class="menu-text">' + m.functionName + '</span>' + b + '</a>';

                                if (subMenus.length > 0) {
                                    ele = subMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                $(ul).append(li);
                            }
                        });
                        $(ul).find("a[data-url!=#]")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    $(this).on("click", function () {
                                        window.location.href = App.href + '/index.html?u=' + url;
                                    });
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!",function(){
                            window.location.href = '../login.html';
                        });
                    }
                },
                error: function (err) {
                }
            }
        );
    }


    function getSubMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.id == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getTopMenu(menus) {
        var topMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == 0) {
                topMenus.push(m);
            } else {
                var subMenus = getMenu(menus, m.parentId);
                if (subMenus.length == 0) {
                    topMenus.push(m);
                }
            }
        });
        return topMenus;
    }

    function subMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='submenu'>";
            $.each(subMenus, function (i, m) {
                var drop = '';
                var b = '';
                var sMenus = getSubMenu(menus, m.id);
                if (sMenus.length > 0) {
                    drop = 'class="dropdown-toggle" ';
                    b = '<b class="arrow fa fa-angle-down"></b>';
                }
                ele += ('<li class="" data-level="sub">'
                    + '<a ' + drop + ' data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="javascript:void(0);"><i class="menu-icon fa fa-desktop"></i> '
                    + m.functionName) + b + '</a>';
                if (sMenus.length > 0) {
                    ele = subMenu(ele, menus, sMenus);
                }
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function subHMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='submenu'>";
            $.each(subMenus, function (i, m) {
                var drop = '';
                var b = '';
                var sMenus = getSubMenu(menus, m.id);
                if (sMenus.length > 0) {
                    drop = 'class="dropdown-toggle" ';
                    b = '<b class="arrow fa fa-angle-down"></b>';
                }
                ele += ('<li class="hover" data-level="sub">'
                    + '<a ' + drop + ' data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="javascript:void(0);">'
                    + m.functionName) + b + '</a>';
                if (sMenus.length > 0) {
                    ele = subHMenu(ele, menus, sMenus);
                }
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }


    var refreshHref = function (ul) {
        var location = window.location.href;
        var url = location.substring(location.lastIndexOf("?u=") + 3);
        if (location.lastIndexOf("?u=") > 0 && url != undefined && $.trim(url) != "") {
            var title = App.menusMapping[url];
            var f = App.requestMapping[url];
            var a = $(ul).find("a[data-url='" + url + "']");
            var li1 = a.parent('li');
            var li2 = a.parent().parent().parent('li');
            var li3 = a.parent().parent().parent().parent().parent('li');
            $('#breadcrumb').empty();
            li1.addClass("active");
            $('#breadcrumb').prepend($('<li>' + li1.find('a:eq(0)').text() + '</li>'));
            if (li2.length > 0) {
                li2.addClass("active").addClass("open");
                $('#breadcrumb').prepend($('<li>' + li2.find('a:eq(0)').text() + '</li>'));
            }
            if (li3.length > 0) {
                li3.addClass("active").addClass("open");
                $('#breadcrumb').prepend($('<li>' + li3.find('a:eq(0)').text() + '</li>'));
            }
            if (f != undefined) {
                App[f].page(title);
            } else {
                loadCommonMenu(url, title);
            }
        } else {
            window.location.href = App.href + "/index.html?u=/api/index";
        }

    };

    var loadCommonMenu = function (url, title) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + url,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        App.content.empty();
                        var data = result.data;
                        App.title(title);
                        App.content.append(data.content);
                    } else {
                        alert(result.message);
                    }
                },
                error: function (e) {
                    alert("页面不存在");
                    window.location.href = App.href + "/index.html?u=/api/index";
                }
            }
        );
    };

    var toggle = App.toggle = ($.cookie('spring-menu-toggle') === undefined ? "s" : $.cookie('spring-menu-toggle'));
    if (toggle === undefined) {
        toggle = "s";
    }
    if (toggle === "s") {
        App.menu.initSideMenu();
    } else {
        App.menu.initHMenu();
    }
    $("#orange-settings-navbar").click(function () {
        App.menu.toggleMenu();
        setTimeout(function () {
            window.location.reload();
        }, 500);
    });
    $("#user-info").click(function () {
        App.menu.showUserInfo();
    });

})(jQuery, window, document);
