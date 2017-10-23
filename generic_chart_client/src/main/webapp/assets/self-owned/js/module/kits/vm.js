function ChartViewModel(parent) {
    var self = this;
    self.parent = parent;
    self.chart_parent_div_id = 'main_chart';
    self.data = null;
    self.chart = null;
    self.hasNewContent = ko.observable(false);
    self.option = new ChartOptionViewModel(self);
    self.dynamic_config = new DynamicConfigViewModel(self);
    self.name = ko.observable('');

    self.initialize_chart = function () {
        self.chart = ChartPOJO.generate_default_chart(self.chart_parent_div_id);
        chartCache['main_chart'] = self.chart;
    }

    self.chart_check = function () {
        if (!self.chart) {
            self.initialize_chart();
        }
    }

    self.reset_chart_type = function () {
        self.initialize_chart();
        var select_type = $('#chart_type_select')[0].options[$('#chart_type_select')[0].options.selectedIndex].value;
        self.chart = ChartPOJO.reset_chart_type(self.chart, select_type);
    }

    self.resize_chart = function () {
        if (self.chart) {
            setTimeout(function () {
                self.chart.resize();
            }, 200);
        }
    }

    // self.render_tutorial = function(){
    //   var select_type = $('#chart_type_select')[0].options[$('#chart_type_select')[0].options.selectedIndex].value;
    //   switch_tutorial_function(select_type);
    // }

    self.switch_chart_type_listener = function () {
        if (chartViewModel.chart) {
            chartViewModel.chart.dispose();
        }
        clearInterval(interval);
        self.reset_chart_type();
        // self.render_tutorial();
    }
}

function ChartOptionViewModel(parent) {
    var self = this;
    self.parent = parent;
    self.title = new TitleViewModel(self);
}

function TitleViewModel(parent) {
    var self = this;
    self.parent = parent;
    self.title_name = ko.observable("");
    self.title_display = ko.observable(true);
    self.title_link = ko.observable("");
    self.title_target = ko.observable("blank");
    self.title_align = ko.observable("left");
    self.title_baseline = ko.observable("top");

    self.sub_title_name = ko.observable("");
    self.sub_title_link = ko.observable("");
    self.sub_title_target = ko.observable("blank");

    self.title_gap = ko.observable(10);

    self.update = function () {
        if (parent && parent.parent && parent.parent.chart) {
            var chart = parent.parent.chart;
            ChartPOJO.resetTitle(chart, self);
        }
    }
}

function DynamicConfigViewModel(parent) {
    var self = this;
    self.parent = parent;
    self.legend = ko.observable("");
    self.data_source = ko.observable("");
    self.trans = ko.observable(false);
    self.columns = ko.observable("");
    self.refresh_inteval = ko.observable("");
}
