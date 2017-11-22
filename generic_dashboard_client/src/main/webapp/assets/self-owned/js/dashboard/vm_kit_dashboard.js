function DashboardViewModel(parent) {
    var self = this;
    self.data = null;
    self.parent = parent;
    self.cells = ko.observableArray();
    self.name = ko.observable();
    self.hasNewContent = ko.observable(false);
    self.refreshIntervalArray = {};

    //commit div setting params
    self.viewHeader = ko.observable(false);
    self.togetherDiv = ko.observable(false);
//    self.domList = {};
    self.domChoose = {};

    self.reset = function () {
        self.data = null;
        self.name();
        self.hasNewContent(true);
        cleanWidget();
    };

    self.serialize_dashboard = function () {
        var result = {
            'name': null,
            'data': null
        };
        WorkbenchCache.updateCache();
        var persist_data = WorkbenchCache.array_elements;
        result.data = persist_data;
        result.name = self.name();
        var json = ko.toJSON(result);
        tmp = json;
        return json;
    };

    self.deserialize_dashboard = function (inputData, e) {
        WorkbenchCache.array_elements = [];
        var json;
        if (typeof inputData == 'string') {
            json = inputData;
        } else {
            self.data = inputData;
            json = inputData.json;
            self.name(inputData.stringalpha);
        }
        var result = $.parseJSON(json);
        if (result.data) {
            cleanWidget();
            $.each(result.data, function (index, value) {
                if (value.widget_id) {
                    var widget = value.widget_element;
                    if (widget.isChart) {
                        var content = $.parseJSON(widget.data);
                        var theme = e || widget.theme;
                        if (theme) {
                            registerTheme(theme, content);
                        } else {
                            theme = '';
                        }
                        var chart = addWidget_chart(content, widget.widget_x, widget.widget_y, widget.widget_width, widget.widget_height, widget.id, theme, widget);
                        var height = $('#' + value.widget_id).height() / 60;
                        var height_cardbody = Math.round(height) * 60;
                        var height_cont = height_cardbody - 40; //- 80;
                        height_cont = resize_setting(value.widget_id, height_cont);
                        $('#' + value.widget_id).find('.card-body').css('height', height_cardbody);
                        setTimeout(function () {
                            if (value.isChart) {
                                $('#' + value.widget_id).find('.draggableTemplateContext').height(height_cont);
                                chart.resize();
                            }
                        }, 500);
                    } else {
                        var cont = deserialize_dom(widget.data);
                        add_content_div(cont, widget.widget_x, widget.widget_y, widget.widget_width, widget.widget_height);
                    }

                }
            });
            refresh_workbench();
        }
    };


    self.persist2server = function () {
        //'type': 'MATRIX_DASHBOARD'
        //'tag': SAVE,SHARE
        var shareJson = {
            'type': 'MATRIX_DASHBOARD',
            'tag': 'SAVE',
            'json': self.serialize_dashboard(),
            'stringalpha': 'report draft demo',
            'username': UserPOJO.user.userName
        };
        var data = {
            'shareJson': $.toJSON(shareJson)
        };
        $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/generate/' + 10000, data, "TOKEN_SUCCESS", "TOKEN_FAILED", "TOKEN_SERVICE_FAILED");
    };
}