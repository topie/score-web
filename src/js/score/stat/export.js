/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var uploadMapping = {
        "/api/score/stat/export/list1": "exportList1",
        "/api/score/stat/export/list2": "exportList2",
        "/api/score/stat/export/list3": "exportList3",
        "/api/score/stat/export/list4": "exportList4"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    App.exportList1 = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">列表1</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            var columns = [
                {
                    title: '受理编号',
                    field: 'ACCEPT_NUMBER'
                }, {
                    title: '身份证号',
                    field: 'ID_NUMBER'
                }, {
                    title: '姓名',
                    field: 'NAME'
                }, {
                    title: '受理日期',
                    field: 'RESERVATION_DATE'
                }, {
                    title: '性别',
                    field: 'SEX'
                }, {
                    title: '文化程度',
                    field: 'CULTURE_DEGREE'
                }, {
                    title: '现有职业资格',
                    field: 'PROFESSION_TYPE'
                }, {
                    title: '工种',
                    field: 'JOB_TYPE'
                }, {
                    title: '单位名称',
                    field: 'COMPANY_NAME'
                }, {
                    title: '单位电话',
                    field: 'COMPANY_MOBILE'
                }, {
                    title: '本人电话',
                    field: 'SELF_PHONE'
                }, {
                    title: '证书编号',
                    field: 'CERTIFICATE_CODE'
                }, {
                    title: '发证机关',
                    field: 'ISSUING_AUTHORITY'
                }, {
                    title: '发证日期',
                    field: 'ISSUING_DATE'
                }
            ];
            var search = [
                {
                    type: 'select',
                    name: 'batchId',
                    id: 'batchId',
                    label: '批次',
                    itemsUrl: App.href + '/api/score/batchConf/options'
                },
                {
                    type: 'text',
                    name: 'idNumber',
                    id: 'idNumber',
                    label: '身份证号'
                }
            ];
            var grid;
            var options = {
                url: App.href + "/api/score/stat/export/list1",
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
                search: {
                    rowEleNum: 2,
                    //搜索栏元素
                    items: search,
                    buttons: [
                        {
                            type: 'button',
                            text: '导出',
                            cls: "btn btn-danger btn-sm",
                            handle: function (g) {
                                var downloadUrl = App.href + "/api/score/stat/export/export1?" + g.$searchForm.serialize();
                                window.open(downloadUrl);
                            }
                        }
                    ]
                }
            };
            grid = window.App.content.find("#grid").orangeGrid(options);
        }
    };

    App.exportList2 = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">列表2</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            var columns = [
                {
                    title: '受理编号',
                    field: 'ACCEPT_NUMBER'
                }, {
                    title: '申请人类型',
                    field: 'APPLICANT_TYPE'
                }, {
                    title: '姓名',
                    field: 'NAME'
                }, {
                    title: '身份证号',
                    field: 'ID_NUMBER'
                }, {
                    title: '职业资格',
                    field: 'PROFESSION_TYPE'
                }, {
                    title: '工种',
                    field: 'JOB_TYPE'
                }, {
                    title: '专业',
                    field: 'PROFESSION'
                }, {
                    title: '拟落户地区',
                    field: 'REGION'
                }, {
                    title: '户口所在地',
                    field: 'MOVE_REGISTERED_OFFICE'
                }
            ];
            var search = [
                {
                    type: 'select',
                    name: 'batchId',
                    id: 'batchId',
                    label: '批次',
                    itemsUrl: App.href + '/api/score/batchConf/options'
                },
                {
                    type: 'text',
                    name: 'idNumber',
                    id: 'idNumber',
                    label: '身份证号'
                }
            ];
            var grid;
            var options = {
                url: App.href + "/api/score/stat/export/list2",
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
                search: {
                    rowEleNum: 2,
                    //搜索栏元素
                    items: search,
                    buttons: [
                        {
                            type: 'button',
                            text: '导出',
                            cls: "btn btn-danger btn-sm",
                            handle: function (g) {
                                var downloadUrl = App.href + "/api/score/stat/export/export2?" + g.$searchForm.serialize();
                                window.open(downloadUrl);
                            }
                        }
                    ]
                }
            };
            grid = window.App.content.find("#grid").orangeGrid(options);
        }
    };

    App.exportList3 = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">列表3</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            var search = [
                {
                    type: 'text',
                    name: 'personIdNum',
                    id: 'personIdNum',
                    label: '身份证号'
                },
                {
                    type: 'text',
                    name: 'personName',
                    id: 'personName',
                    label: '名字'
                },
                {
                    type: 'text',
                    name: 'companyName',
                    id: 'companyName',
                    label: '企业名称'
                }
            ];
            var grid;
            var options = {
                url: App.href + "/api/score/stat/export/list3",
                contentType: "table",
                contentTypeItems: "table,card,list",
                pageNum: 1,//当前页码
                pageSize: 15,//每页显示条数
                idField: "id",//id域指定
                headField: "id",
                showCheck: true,//是否显示checkbox
                checkboxWidth: "3%",
                showIndexNum: true,
                select2: true,
                indexNumWidth: "5%",
                pageSelect: [2, 15, 30, 50],
                dataTransform: function (resultData, grid) {
                    grid._columns = resultData.data.columns;
                    grid._grids = resultData.data.data;
                    grid._total = resultData.data.total;
                    grid._data = {
                        data: resultData.data.data,
                        total: resultData.data.total,
                        html: resultData.data.html
                    }
                },
                actionColumnText: "操作",//操作列文本
                actionColumnWidth: "20%",
                search: {
                    rowEleNum: 2,
                    //搜索栏元素
                    items: search,
                    buttons: [
                        {
                            type: 'button',
                            text: '导出',
                            cls: "btn btn-danger btn-sm",
                            handle: function (g) {
                                var downloadUrl = App.href + "/api/score/stat/export/export3?" + g.$searchForm.serialize();
                                window.open(downloadUrl);
                            }
                        }
                    ]
                }
            };
            grid = window.App.content.find("#grid").orangeGrid(options);
        }
    };

    App.exportList4 = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" >' +
                '<div class="panel panel-default" >' +
                '<div class="panel-heading">列表4</div>' +
                '<div class="panel-body" id="grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            window.App.content.append(content);
            var search = [
                {
                    type: 'select',
                    name: 'acceptAddressId',
                    id: 'acceptAddressId',
                    label: '受理地区',
                    items: [
                        {
                            text: '全部',
                            value: ''
                        }, {
                            text: '市',
                            value: 1
                        }, {
                            text: '滨海',
                            value: 2
                        }
                    ]
                }, {
                    type: 'text',
                    name: 'personIdNum',
                    id: 'personIdNum',
                    label: '身份证号'
                },
                {
                    type: 'text',
                    name: 'personName',
                    id: 'personName',
                    label: '名字'
                },
                {
                    type: 'text',
                    name: 'companyName',
                    id: 'companyName',
                    label: '企业名称'
                }
            ];
            var grid;
            var options = {
                url: App.href + "/api/score/stat/export/list4",
                contentType: "table",
                contentTypeItems: "table,card,list",
                pageNum: 1,//当前页码
                pageSize: 15,//每页显示条数
                idField: "id",//id域指定
                headField: "id",
                showCheck: true,//是否显示checkbox
                checkboxWidth: "3%",
                showIndexNum: true,
                select2: true,
                indexNumWidth: "5%",
                pageSelect: [2, 15, 30, 50],
                dataTransform: function (resultData, grid) {
                    grid._columns = resultData.data.columns;
                    grid._grids = resultData.data.data;
                    grid._total = resultData.data.total;
                    grid._data = {
                        data: resultData.data.data,
                        total: resultData.data.total,
                        html: resultData.data.html
                    }
                },
                actionColumnText: "操作",//操作列文本
                actionColumnWidth: "20%",
                search: {
                    rowEleNum: 2,
                    //搜索栏元素
                    items: search,
                    buttons: [
                        {
                            type: 'button',
                            text: '导出',
                            cls: "btn btn-danger btn-sm",
                            handle: function (g) {
                                var downloadUrl = App.href + "/api/score/stat/export/export4?" + g.$searchForm.serialize();
                                window.open(downloadUrl);
                            }
                        }
                    ]
                }
            };
            grid = window.App.content.find("#grid").orangeGrid(options);
        }
    };

})(jQuery, window, document);
