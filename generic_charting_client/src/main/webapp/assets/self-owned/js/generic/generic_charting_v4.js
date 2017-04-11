var default_chart_type = ['grid_heatmap','sankey','boxplot','treemap','river','radar','pie','circular','graph','force','parallel','scatter','line','bar','axis'];

var default_color=['#1ABC9C', '#5DADE2', '#FFC153', '#EC7063', '#CC99CC', '#666666', '#5E5E73', '#FFBC11'];

var default_tooltip={
  position: 'top',
  trigger: 'item',
  formatter: "{a} <br/>{b} : {c}"
};
var default_labelStyle={
  //color: 'white',
  fontWeight: 'bold',
  fontSize: '12'
};

var default_title={
  show: true,
  x: 'left',
  padding: [0, 0, 0, 20],
  textStyle:default_labelStyle,
  text: "Matrix Chart",
};


var default_scatterScale={
  min_scale: 10,
  max_scale: 50
};

var default_default_scale_setting={
  enable: false,
  useData: false,
  min_scale: 10,
  max_scale: 50,
  min_value: 1,
  max_value: 10000
};

var ChartPOJO = ChartPOJO || {};
ChartPOJO = {

  generate_default_chart: function(chart_div_id) {
    $('#' + chart_div_id).empty();
    var option_chart = {};
    option_chart.color = default_color;
    option_chart.title = default_title;
    option_chart.tooltip = default_tooltip;
    option_chart.series = [];
    var chart = echarts.init(document.getElementById(chart_div_id));

    chart.parent_div_id = chart_div_id;
    return ChartPOJO.reset_chart_option(chart,option_chart);
  },

  reset_chart_option:function(chart,option){
    chart.setOption(option);
    $(window).resize(function() {
      setTimeout(function() {
        chart.resize();
      }, 500);
    });
    return chart;
  },

  reset_chart_type:function(chart,chart_type){
    if(!chart || !chart_type){
      return null;
    }
    if(chart_type == 'grid_heatmap'){
      return HeatMap_Grid_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'sankey'){
      return Sankey_ChartPOJO.initialize_chart(chart);
    }

    if(chart_type == 'boxplot'){
      return Sankey_ChartPOJO.initialize_chart(chart);
    }

  }
}




var HeatMap_Grid_ChartPOJO = HeatMap_Grid_ChartPOJO || {};
HeatMap_Grid_ChartPOJO = {
  default_grid:{
    height: '80%',
    y: '10%'
  },
  default_xAxis:{
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  default_yAxis:{
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  default_visualMap:{
    min: 0,
    max: 10,
    calculable: true,
    orient: 'vertical',
    left: 'right',
    top: '5%'
  },
  default_series:[{
    name: 'Matrix Heatmap Series',
    type: 'heatmap',
    data: [],
    label: {
      normal: {
        show: true
      }
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }],
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.grid=HeatMap_Grid_ChartPOJO.default_grid;
    option.xAxis= HeatMap_Grid_ChartPOJO.default_xAxis;
    option.yAxis=HeatMap_Grid_ChartPOJO.default_yAxis;;
    option.visualMap=HeatMap_Grid_ChartPOJO.default_visualMap;
    option.series= HeatMap_Grid_ChartPOJO.default_series;
    return ChartPOJO.reset_chart_option(chart,option);
  },
}


var Sankey_ChartPOJO = Sankey_ChartPOJO || {};
Sankey_ChartPOJO = {
  default_series:[{
    type: 'sankey',
    data: [{'name':'matrix'}],
    links: [],
    itemStyle: {
      normal: {
        borderWidth: 1,
        borderColor: '#aaa'
      }
    },
    lineStyle: {
      normal: {
        color: 'source',
        curveness: 0.5
      }
    }
  }],
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series= Sankey_ChartPOJO.default_series;
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var default_boxplot_data = echarts.dataTool.prepareBoxplotData([[]]);
var Boxplot_ChartPOJO = Boxplot_ChartPOJO || {};
Boxplot_ChartPOJO = {
  default_data:[[]],

  default_tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    }
  },
  default_xAxis:{
    type: 'category',
    data: default_boxplot_data.axisData,
    boundaryGap: true,
    nameGap: 30,
    splitArea: {
      show: false
    },
    axisLabel: {
      formatter: 'boxplot {value}'
    },
    splitLine: {
      show: false
    }
  },
  default_yAxis:{
    type: 'value',
    splitArea: {
      show: true
    }
  },

  default_series:[{
    name: 'boxplot',
    type: 'boxplot',
    data: default_boxplot_data.boxplot_data,
    itemStyle: {
      normal: {
        borderColor: '#1ABC9C'
      },
      emphasis: {
        borderColor: '#5DADE2'
      }
    },
    tooltip: {
      formatter: function(param) {
        return [
          'Boxplot: ' + param.name,
          'upper: ' + param.data[4],
          'Q3: ' + param.data[3],
          'median: ' + param.data[2],
          'Q1: ' + param.data[1],
          'lower: ' + param.data[0]
        ].join('<br/>')
      }
    }
  }, {
    name: 'outlier',
    type: 'scatter',
    itemStyle: {
      normal: {
        color: '#1ABC9C'
      },
      emphasis: {
        color: '#5DADE2'
      }
    },
    data: default_boxplot_data.outliers
  }],
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.origin_data = Boxplot_ChartPOJO.default_data;
    option.xAxis= Boxplot_ChartPOJO.default_xAxis;
    option.yAxis=Boxplot_ChartPOJO.default_yAxis;;
    option.tooltip=Boxplot_ChartPOJO.default_tooltip;
    option.series= Boxplot_ChartPOJO.default_series;
    return ChartPOJO.reset_chart_option(chart,option);
  },

}
