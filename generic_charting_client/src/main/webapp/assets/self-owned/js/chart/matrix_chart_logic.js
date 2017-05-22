function initialize_chart() {
    var x_Axis_data = [2013, 2014, 2015, 2016, 2017];
    var series_name = 'GDP';
    var series_data = [20, 30, 30, 50, 80];
    chart = ChartPOJO.generateGridChart('main', 'bar', 'Descartes coordinates Demo', false, x_Axis_data, series_name, series_data);
    chart = ChartPOJO.addSeries(chart, "KPI", "bar", [60, 90, 10, 80, 70]);
    chart = ChartPOJO.addSeries(chart, "AI", "bar", [10, 20, 30, 40, 50]);
    chart = ChartPOJO.addSeries(chart, "BI", "bar", [10, 20, 30, 40, 50]);
    chart = ChartPOJO.addStack(chart, "Science", "BI");
    chart = ChartPOJO.addStack(chart, "Science", "AI");
    chart = ChartPOJO.addStack(chart, "Economy", "GDP");
    chart = ChartPOJO.addStack(chart, "Economy", "KPI");

    if (chartViewModel) {
        chartViewModel.chart = chart;
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
        if (chart_type !== 'graph') {
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
                    };
                    var a = [];
                    option.series.forEach(function (item) {
                        a.push({"name": item.name, "data": item.data})
                    });
                    barViewModel.series(JSON.stringify(a));
                    break;
                case 'line':
                    if (option.xAxis[0].data) {
                        lineViewModel.xOry('x');
                        lineViewModel.axis(JSON.stringify(option.xAxis[0].data).replace(/[\[\]"]/g, ''));
                    } else {
                        lineViewModel.xOry('y');
                        lineViewModel.axis(JSON.stringify(option.yAxis[0].data).replace(/[\[\]"]/g, ''));
                    };
                    var a = [];
                    option.series.forEach(function (item) {
                        a.push({"name": item.name, "data": item.data})
                    });
                    lineViewModel.series(JSON.stringify(a));
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
//                    $('#sub_content_div').load($.getRootPath() + '/assets/self-owned/html/chart/content_boxplot.html');
                    break;
                case 'pie':
                    pieViewModel.series(JSON.stringify(option.series[1].data));
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
                    break;
                case 'sankey':
                    sankeyViewModel.nodes(JSON.stringify(option.series[0].data));
                    sankeyViewModel.links(JSON.stringify(option.series[0].links));
                    break;
                case 'graph':
                    var layout = option.series[0].layout;

                    setTimeout(function () {
                        if (layout == 'none') {
                            rerender_children_dom('graph');
                            setTimeout(function () {

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
                    }, 200)

                    break;
                default:
            }
        }, 200);
        setTimeout(function () {
            chart = ChartPOJO.renderChart('main_chart', option);
            if (chartViewModel) {
                chartViewModel.chart = chart;
                chartViewModel.data = json;
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
