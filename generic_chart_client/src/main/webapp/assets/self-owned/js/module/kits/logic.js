var chartViewModel = new ChartViewModel();
var chart;       //tutorial chart object
ko.applyBindings(chartViewModel, document.getElementById('main_content_div'));
$('input[name="radio_data_from"]').change(function () {
    $('#data_from_manual').css('display', 'none');
    $('#data_from_dynamic').css('display', 'none');
    $('#data_from_' + $(this).val()).css('display', '');
})

$.subscribe("get_user_detail_chain_finished", initialize);

function initialize() {
    if ($.hasUrlParam('token')) {
        SharePOJO.environmentCheck();
    } else {
        rerender_children_dom('bar')
    }
}

var SharePOJO = SharePOJO || {};
SharePOJO = {
    environmentCheck: function () {
        console.log("SHARE FUNCTION ENVIRONMENT CHECK...");
        console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[BEGIN]");
        var tokenFlag = $.hasUrlParam('token');
        if (tokenFlag) {
            console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[FINISHED & RESULT:SUCCESSED]");
        } else {
            SharePOJO.redirect('NORMAL');
            console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[FINISHED & RESULT:FAILED]");
            return;
        }
        console.log("ENVIRONMENT CHECK [STEP 2: Get token ]...[BEGIN]");
        var token = $.urlParamValue('token');
        if (token) {
            console.log("ENVIRONMENT CHECK [STEP 2: Get token]...[FINISHED & RESULT:SUCCESSED]");
        } else {
            SharePOJO.redirect('INVALID');
            console.log("ENVIRONMENT CHECK [STEP 2: Get token]...[FINISHED & RESULT:FAILED]");
        }

        console.log("ENVIRONMENT CHECK [STEP 3: validate token from SERVER side ... please invoke the correct URL and handle the response]...[BEGIN]");
        $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/fetch/' + token, null, "MATRIX_SHARE_SUCCESS", "MATRIX_SHARE_FAILED", "MATRIX_SHARE_SERVICE_FAILED");
    },
    redirect: function (type) {
        if (type == 'INVALID') {
            console.log("REDIRECT TO INVALID PAGE");
            window.location.href = "404.html";
        } else if (type == 'EXPIRED') {
            console.log("REDIRECT TO EXPIRED PAGE");
            window.location.href = "404.html";
        } else if (type == 'NORMAL') {
            console.log("REDIRECT TO EDIT PAGE");
            initialize_chart();
        }
    }
}

//SharePOJO listener
$.subscribe("MATRIX_SHARE_SUCCESS", successListener);
$.subscribe("MATRIX_SHARE_FAILED", failedListener);
$.subscribe("MATRIX_SHARE_SERVICE_FAILED", failedServiceListener);
function successListener() {
    if (arguments && arguments[1]) {
        var json = arguments[1].result[0];
        var json_chart = json.json;
        var option = ChartPOJO.deserialize_chart_option(json_chart);
        console.log(option)
        var chart_type = option.series[0].type;
        if (chart_type !== 'graph' && chart_type !== 'line') {
            rerender_children_dom(chart_type);
        }
        setTimeout(function () {
            switch (chart_type) {
                case 'bar':
                    if (option.xAxis[0].data) {
                        barViewModel.xOry('x');
                        barViewModel.axis(JSON.stringify(option.xAxis[0].data).replace(/[\[\]"]/g, ''));
                    } else {
                        barViewModel.xOry('y');
                        barViewModel.axis(JSON.stringify(option.yAxis[0].data).replace(/[\[\]"]/g, ''));
                    }
                    ;
                    var a = [];
                    option.series.forEach(function (item) {
                        a.push({"name": item.name, "data": item.data})
                    });
                    barViewModel.series(JSON.stringify(a));
                    break;
                case 'line':
                    if (!option.series[0].areaStyle) {
                        rerender_children_dom('line');
                        setTimeout(function () {
                            if (option.xAxis[0].data) {
                                lineViewModel.xOry('x');
                                lineViewModel.axis(JSON.stringify(option.xAxis[0].data).replace(/[\[\]"]/g, ''));
                            } else {
                                lineViewModel.xOry('y');
                                lineViewModel.axis(JSON.stringify(option.yAxis[0].data).replace(/[\[\]"]/g, ''));
                            }
                            ;
                            var a = [];
                            option.series.forEach(function (item) {
                                a.push({"name": item.name, "data": item.data})
                            });
                            lineViewModel.series(JSON.stringify(a));
                        }, 200);
                    } else {
                        rerender_children_dom('area');
                        setTimeout(function () {
                            if (option.xAxis[0].data) {
                                areaViewModel.xOry('x');
                                areaViewModel.axis(JSON.stringify(option.xAxis[0].data).replace(/[\[\]"]/g, ''));
                            } else {
                                areaViewModel.xOry('y');
                                areaViewModel.axis(JSON.stringify(option.yAxis[0].data).replace(/[\[\]"]/g, ''));
                            }
                            ;
                            var a = [];
                            option.series.forEach(function (item) {
                                a.push({"name": item.name, "data": item.data})
                            });
                            areaViewModel.series(JSON.stringify(a));
                        }, 200);
                    }
                    break;
                case 'scatter':
                    if (option.xAxis[0].data) {
                        scatterViewModel.xOry('x');
                        scatterViewModel.axis(JSON.stringify(option.xAxis[0].data).replace(/[\[\]"]/g, ''));
                    } else {
                        scatterViewModel.xOry('y');
                        scatterViewModel.axis(JSON.stringify(option.yAxis[0].data).replace(/[\[\]"]/g, ''));
                    }
                    var a = [];
                    option.series.forEach(function (item) {
                        a.push({"name": item.name, "data": item.data})
                    });
                    scatterViewModel.series(JSON.stringify(a));
                    break;
                case 'boxplot':
                    break;
                case 'pie':
                    break;
                case 'radar':
                    var a = [];
                    option.radar[0].indicator.forEach(function (item) {
                        a.push({"name": item.name, "max": item.max});
                    });
                    radarViewModel.indicator(JSON.stringify(a));
                    var b = [];
                    radarViewModel.series(JSON.stringify(option.series[2].data));
                    break;
                case 'treemap':
                    treemapViewModel.series(JSON.stringify(option.series[0].data));
                    break;
                case 'heatmap':
                    heatmapViewModel.xAxis(JSON.stringify(option.xAxis[0].data).replace(/[\[\]"]/g, ''));
                    heatmapViewModel.yAxis(JSON.stringify(option.yAxis[0].data).replace(/[\[\]"]/g, ''));
                    heatmapViewModel.series(JSON.stringify(option.series[0].data));
                    heatmapViewModel.scale_max(option.visualMap[0].max);
                    heatmapViewModel.scale_min(option.visualMap[0].min);
                    break;
                case 'parallel':
                    var a = '';
                    var b = '';
                    option.parallelAxis.forEach(function (item) {
                        if (!a) {
                            a = item.name
                        } else {
                            a = a + "," + item.name
                        }
                    })
                    parallelViewModel.axis(a);
                    parallelViewModel.name(JSON.stringify(option.legend[0].data).replace(/[\[\]"]/g, ''))
                    for (i = 1; i < option.series.length; i++) {
                        b += JSON.stringify(option.series[i].data);
                        b += '\n\n'
                    }
                    parallelViewModel.series(b);
                    break;
                case 'themeRiver':
                    riverViewModel.type(option.singleAxis[0].type);
                    riverViewModel.series(JSON.stringify(option.series[0].data))
                    break;
                case 'sankey':
                    sankeyViewModel.nodes(JSON.stringify(option.series[0].data));
                    sankeyViewModel.links(JSON.stringify(option.series[0].links));
                    break;
                case 'wordCloud':
                    var a = option.series;
                    a[0].textStyle.normal.color = function () {
                        var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                        return colors[parseInt(Math.random() * 10)];
                    };
                    option.series = a;
                    break;
                case 'graph':
                    var layout = option.series[0].layout;
                    if (layout == 'none') {
                        rerender_children_dom('graph');
                        setTimeout(function () {
                            graphViewModel.categories(JSON.stringify(option.series[0].categories));
                            graphViewModel.nodes(JSON.stringify(option.series[0].data));
                            graphViewModel.links(JSON.stringify(option.series[0].links));
                        }, 200);
                    } else if (layout == 'circular') {
                        rerender_children_dom('circular');
                        setTimeout(function () {
                            circularViewModel.categories(JSON.stringify(option.series[0].categories));
                            circularViewModel.nodes(JSON.stringify(option.series[0].data));
                            circularViewModel.links(JSON.stringify(option.series[0].links));
                        }, 200);
                    } else if (layout == 'force') {
                        rerender_children_dom('force');
                        setTimeout(function () {
                            forceViewModel.categories(JSON.stringify(option.series[0].categories));
                            forceViewModel.nodes(JSON.stringify(option.series[0].data));
                            forceViewModel.links(JSON.stringify(option.series[0].links));
                        }, 200);
                    }
                    break;
                default:
            }
        }, 200);
        setTimeout(function () {
            if (!option.ds_setting) {
                var main_chart = ChartPOJO.renderChart('main_chart', option);
                if (chartViewModel) {
                    chartViewModel.chart = main_chart;
                    chartCache['main_chart'] = chartViewModel.chart;
                    chartViewModel.data = json;
                }
            } else {
                var main_chart = ChartPOJO.generate_default_chart('main_chart');
                if (chartViewModel) {
                    chartViewModel.chart = main_chart;
                    chartCache['main_chart'] = chartViewModel.chart;
                }
                ChartPOJO.renderDynamicChart(option.ds_setting, chart);
            }
        }, 500);
    }
}

function failedListener() {
    console.log("Server Failed!");
}

function failedServiceListener() {
    if (arguments && arguments[1]) {
        var errorMessage = arguments[1].errorMessage;
        if (errorMessage == "Token Invalid!") {
            console.log('request action invoked[request_invalid]');
            SharePOJO.redirect('INVALID');
        } else if (errorMessage == "Token Expire!") {
            console.log('request action invoked[request_expired]');
            SharePOJO.redirect('EXPIRED');
        }
    }
}


function hide_configuration_panel() {
    hide_div('configuration_div');
    resetCssClass('chart_content_div', 'col-md-12');
    show_div('dispaly_config_button');
    hide_div('undispaly_config_button');
//    chartViewModel.resize_chart();
    refresh_workbench()
}

function show_configuration_panel() {
    show_div('configuration_div');
    resetCssClass('chart_content_div', 'col-md-8');
    hide_div('dispaly_config_button');
    show_div('undispaly_config_button');
    refresh_workbench();

}

function rerender_children_dom(type) {
    $('#chart_tutorials_content_div').load($.getRootPath() + '/assets/self-owned/html/chart/tutorial_' + type + '.html');
    $('#data_config_content_div').load($.getRootPath() + '/assets/self-owned/html/chart/config_' + type + '.html');
}

function reset_title() {
    var chart_title = $('#title_value_input').val();
    chartViewModel.chart.setOption({title: {text: chart_title}})
}
