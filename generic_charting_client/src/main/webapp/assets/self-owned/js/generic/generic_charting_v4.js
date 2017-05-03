var default_chart_type = ['grid_heatmap','sankey','boxplot','treemap','river','radar','pie','circular','graph','force','parallel','scatter','line','bar','area'];

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

var default_legend = {
  orient: 'vertical',
  // orient:'horizontal',
  // left: 'center',
  left: 'right',
  top: 'top',
  padding: [0, 20, 0, 0],
  data: [],
  textStyle: default_labelStyle
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

var default_scale_setting={
  enable: false,
  useData: false,
  min_scale: 10,
  max_scale: 50,
  min_value: 1,
  max_value: 10000
};


var default_grid = {
  left: '10%',
  right: '10%',
};

var default_xAxis = {
  axisLabel: {
    // interval: 0, // 强制显示所有标签
    // rotate: -45,
    textStyle: default_labelStyle,
  },
  axisLine: {
    lineStyle: {
      //color: '#fff'
    }
  },
};

var default_yAxis = {
  axisLabel: {
    // rotate: 45,
    textStyle: default_labelStyle,
  },
  axisLine: {
    lineStyle: {
      //color: '#fff'
    }
  }
};

var default_dataZoom = [{
  type: 'slider',
  orient: 'horizontal',
  left: 'center',
  textStyle: default_labelStyle,
  start: 0,
  end: 100
}, {
  type: 'inside',
  orient: 'horizontal',
  textStyle: default_labelStyle,
  start: 0,
  end: 100
}];

var default_series_object = {
  name: 'Matrix Series',
  type: '',
  itemStyle: {
    normal: {}
  },
  data: []
};

var ChartPOJO = ChartPOJO || {};
ChartPOJO = {

  generate_default_chart: function(chart_div_id) {
    $('#' + chart_div_id).empty();
    var option_chart = {};
    option_chart.color = default_color;
    option_chart.title = default_title;
    option_chart.tooltip = default_tooltip;
    option_chart.legend = default_legend;
    option_chart.legend.data.push([]);
    option_chart.series = [];
    var chart = echarts.init(document.getElementById(chart_div_id));

    chart.parent_div_id = chart_div_id;
    return ChartPOJO.reset_chart_option(chart,option_chart);
  },

  reset_chart_option:function(chart,option){
    // var option_clone = ClonePOJO.deepClone(option);
    // chart.setOption(option_clone);
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
      return Boxplot_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'treemap'){
      return Treemap_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'river'){
      return River_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'radar'){
      return Radar_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'pie'){
      return Pie_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'circular'){
      return Circular_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'graph'){
      return Graph_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'force'){
      return Force_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'parallel'){
      return Parallel_ChartPOJO.initialize_chart(chart);
    }
    if(chart_type == 'scatter'){
      return Descartes_ChartPOJO.initialize_chart(chart,'scatter');
    }
    if(chart_type == 'line'){
      return Descartes_ChartPOJO.initialize_chart(chart,'line');
    }
    if(chart_type == 'area'){
      return Descartes_ChartPOJO.initialize_chart(chart,'area');
    }
    if(chart_type == 'bar'){
      return Descartes_ChartPOJO.initialize_chart(chart,'bar');
    }
  },

  add_series_data_item:function(chart,data_item){
    var option = ClonePOJO.deepClone(chart.getOption());
    option.series[0].data.push(data_item);
    return ChartPOJO.reset_chart_option(chart, option);
  },
  remove_series_data_item:function(chart,data_item_index){
    var option = ClonePOJO.deepClone(chart.getOption());
    option.series[0].data.splice(data_item_index, 1);
    return ChartPOJO.reset_chart_option(chart, option);
  }
}



var HeatMap_Grid_ChartPOJO = HeatMap_Grid_ChartPOJO || {};
HeatMap_Grid_ChartPOJO = {

  data_prototype:{
    x_data:null,
    y_data:null,
    min_scale:null,
    max_scale:null,
    series_data:null
  },

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

  initialize_chart:function(chart,data_prototype){
    if(!chart){
      return null;
    }
    if(!data_prototype){
      data_prototype = ClonePOJO.deepClone(HeatMap_Grid_ChartPOJO.data_prototype);
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = ClonePOJO.deepClone(chart.getOption());
    option.grid=HeatMap_Grid_ChartPOJO.default_grid;
    if(!option.xAxis || option.xAxis.length<1){
      option.xAxis= ClonePOJO.deepClone(HeatMap_Grid_ChartPOJO.default_xAxis);
      option.xAxis.data = data_prototype.x_data||option.xAxis.data||[];
    }else{
      option.xAxis[0].data = data_prototype.x_data||option.xAxis[0].data||[];
    }
    if(!option.yAxis || option.yAxis.length<1){
      option.yAxis= ClonePOJO.deepClone(HeatMap_Grid_ChartPOJO.default_yAxis);
      option.yAxis.data = data_prototype.y_data||option.yAxis.data||[];
    }else{
      option.yAxis[0].data = data_prototype.y_data||option.yAxis[0].data||[];
    }
    if(!option.visualMap || option.visualMap.length<1){
      option.visualMap= ClonePOJO.deepClone(HeatMap_Grid_ChartPOJO.default_visualMap);
      option.visualMap.min = data_prototype.min_scale||option.visualMap.min||0;
      option.visualMap.max = data_prototype.max_scale||option.visualMap.max||10;
    }else{
      option.visualMap[0].min = data_prototype.min_scale||option.visualMap[0].min||0;
      option.visualMap[0].max = data_prototype.max_scale||option.visualMap[0].max||10;
    }
    if(!option.series || option.series.length<1){
      option.series= ClonePOJO.deepClone(HeatMap_Grid_ChartPOJO.default_series);
    }
    option.series[0].data = data_prototype.series_data||option.series[0].data||[];
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
  initialize_chart:function(chart,nodes,links,update){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    if(!update || !option.series || option.series.length<1){
      option.series= ClonePOJO.deepClone(Sankey_ChartPOJO.default_series);
    }
    if(nodes){
      option.series[0].data=nodes;
    }
    if(links){
      option.series[0].links=links;
    }
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


var Treemap_ChartPOJO = Treemap_ChartPOJO || {};
Treemap_ChartPOJO = {
  default_series:[{
    name: 'Matrix Treemap',
    type: 'treemap',
    leafDepth: null,
    label: {
      show: true,
      formatter: '{b}'
    },
    itemStyle: {
      normal: {
        borderColor: '#fff'
      }
    },
    data: [],
    tooltip: {
      formatter: function(param) {
        return [
          'Name: ' + param.data.name,
          'Value: ' + param.data.value,
          'ID: ' + param.data.id
        ].join('<br/>')
      }
    }
  }],
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series= Treemap_ChartPOJO.default_series;
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var River_ChartPOJO = River_ChartPOJO || {};
River_ChartPOJO = {
  default_series:[{
    type: 'themeRiver',
    data: [],
    label: {
      normal: {
        show: true
      }
    }
  }],
  default_singleAxis:{
    max: 'dataMax',
    min: 'dataMin',
    type: 'value'
  },
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series= River_ChartPOJO.default_series;
    option.singleAxis= River_ChartPOJO.default_singleAxis;
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Radar_ChartPOJO = Radar_ChartPOJO || {};
Radar_ChartPOJO = {
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.radar = {
      // shape: 'circle',
      indicator: []
    };
    option.series.push({
      type: 'radar',
      data: []
    });
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Pie_ChartPOJO = Pie_ChartPOJO || {};
Pie_ChartPOJO = {
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series.push({
      name: 'Matrix Pie',
      type: 'pie',
      data: []
    });
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Force_ChartPOJO = Force_ChartPOJO || {};
Force_ChartPOJO = {
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series.push({
      type: 'graph',
      layout: 'force',
      data: [],
      links: [],
      categories: [],
    });
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Graph_ChartPOJO = Graph_ChartPOJO || {};
Graph_ChartPOJO = {
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series.push({
      type: 'graph',
      layout: 'none',
      data: [],
      links: [],
      categories: [],
    });
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Circular_ChartPOJO = Circular_ChartPOJO || {};
Circular_ChartPOJO = {
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.series.push({
      type: 'graph',
      layout: 'circular',
      circular: {
        rotateLabel: true
      },
      data: [],
      links: [],
      categories: [],
      label: {
        normal: {
          position: 'right',
          formatter: '{b}'
        }
      },
      lineStyle: {
        normal: {
          color: 'source',
          curveness: 0.3
        }
      }
    });
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Parallel_ChartPOJO = Parallel_ChartPOJO || {};
Parallel_ChartPOJO = {
  default_parallel:{
    left: '5%',
    right: '18%',
    bottom: 100,
    parallelAxisDefault: {
      type: 'value',
      name: 'parallel',
      nameLocation: 'end',
      nameGap: 20,
      nameTextStyle: {
        color: '#000',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#777'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#000'
        }
      }
    }
  },
  initialize_chart:function(chart){
    if(!chart){
      return null;
    }
    var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    var parallel_axis_data = [];
    var computed_axis = [];
    $.each(parallel_axis_data, function(index, value) {
      var tmp = {
        dim: index,
        name: value
      };
      computed_axis.push(tmp);
    });
    option.parallelAxis = computed_axis;
    option.parallel = Parallel_ChartPOJO.default_parallel;
    option.series.push({
      name: 'Matrix Parallel',
      type: 'parallel',
      itemStyle: {
        normal: {}
      },
      data: []
    });
    return ChartPOJO.reset_chart_option(chart,option);
  },
}

var Descartes_ChartPOJO = Descartes_ChartPOJO || {};
Descartes_ChartPOJO = {
  initialize_chart:function(chart,type){
    if(!chart){
      return null;
    }
      var chart_parent_div_id = chart.parent_div_id;
    var option = chart.getOption();
    option.grid =ClonePOJO.deepClone(default_grid);
    option.xAxis = ClonePOJO.deepClone(default_xAxis);
    option.yAxis = ClonePOJO.deepClone(default_yAxis);
    option.dataZoom = ClonePOJO.deepClone(default_dataZoom);
    var series_object = ClonePOJO.deepClone(default_series_object);
    if (type === 'area') {
      // area acutal is a line chart and has area style fill
      series_object.areaStyle = {
        normal: {}
      };
      series_object.type = 'line';
    }else{
      series_object.type=type;
    }
    option.series.push(series_object);
    return ChartPOJO.reset_chart_option(chart,option);
  },
}





























/////////////////////////////////////
