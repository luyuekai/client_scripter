var json1 = '{"color":["#1ABC9C","#5DADE2","#FFC153","#EC7063","#CC99CC","#666666","#5E5E73","#FFBC11"],"chart_div_id":"main","origin_data":[[850,740,900,1070,930,850,950,980,980,880,1000,980,930,650,760,810,1000,1000,960,960],[960,940,960,940,880,800,850,880,900,840,830,790,810,880,880,830,800,790,760,800],[880,880,880,860,720,720,620,860,970,950,880,910,850,870,840,840,850,840,840,840],[890,810,810,820,800,770,760,740,750,760,910,920,890,860,880,720,840,850,850,780],[890,840,780,810,760,810,790,810,820,850,870,870,810,740,810,940,950,800,810,870]],"textStyle":{"fontFamily":"sans-serif","fontSize":12,"fontStyle":"normal","fontWeight":"normal"},"animation":true,"animationDuration":1000,"animationDurationUpdate":300,"animationEasing":"exponentialOut","animationEasingUpdate":"cubicOut","animationThreshold":2000,"progressiveThreshold":3000,"progressive":400,"hoverLayerThreshold":3000,"title":[{"show":true,"x":"left","padding":[0,0,0,20],"textStyle":{"fontWeight":"bold","fontSize":"12","color":"#333"},"text":"Matrix Boxplot Demo","left":"left","zlevel":0,"z":6,"target":"blank","subtext":"","subtarget":"blank","top":0,"backgroundColor":"rgba(0,0,0,0)","borderColor":"#ccc","borderWidth":0,"itemGap":10,"subtextStyle":{"color":"#aaa"}}],"tooltip":[{"trigger":"item","axisPointer":{"type":"shadow","axis":"auto","animation":true,"animationDurationUpdate":200,"animationEasingUpdate":"exponentialOut","lineStyle":{"color":"#555","width":1,"type":"solid"},"crossStyle":{"color":"#555","width":1,"type":"dashed","textStyle":{}},"shadowStyle":{"color":"rgba(150,150,150,0.3)"}},"zlevel":0,"z":8,"show":true,"showContent":true,"triggerOn":"mousemove","alwaysShowContent":false,"confine":false,"showDelay":0,"hideDelay":100,"transitionDuration":0.4,"enterable":false,"backgroundColor":"rgba(50,50,50,0.7)","borderColor":"#333","borderRadius":4,"borderWidth":0,"padding":5,"extraCssText":"","textStyle":{"color":"#fff","fontSize":14}}],"yAxis":[{"type":"value","splitArea":{"show":true,"areaStyle":{"color":["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},"boundaryGap":[0,0],"splitNumber":5,"show":true,"zlevel":0,"z":0,"inverse":false,"name":"","nameLocation":"end","nameRotate":null,"nameTruncate":{"maxWidth":null,"ellipsis":"...","placeholder":"."},"nameTextStyle":{},"nameGap":15,"silent":false,"triggerEvent":false,"tooltip":{"show":false},"axisLine":{"show":true,"onZero":true,"lineStyle":{"color":"#333","width":1,"type":"solid"}},"axisTick":{"show":true,"inside":false,"length":5,"lineStyle":{"width":1}},"axisLabel":{"show":true,"inside":false,"rotate":0,"margin":8,"textStyle":{"fontSize":12}},"splitLine":{"show":true,"lineStyle":{"color":["#ccc"],"width":1,"type":"solid"}},"offset":0,"rangeEnd":null,"rangeStart":null}],"xAxis":[{"type":"category","data":["0","1","2","3","4"],"boundaryGap":true,"nameGap":30,"splitArea":{"show":false,"areaStyle":{"color":["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},"axisLabel":{"formatter":"boxplot {value}","interval":"auto","show":true,"inside":false,"rotate":0,"margin":8,"textStyle":{"fontSize":12}},"splitLine":{"show":false,"lineStyle":{"color":["#ccc"],"width":1,"type":"solid"}},"axisTick":{"alignWithLabel":false,"interval":"auto","show":true,"inside":false,"length":5,"lineStyle":{"width":1}},"show":true,"zlevel":0,"z":0,"inverse":false,"name":"","nameLocation":"end","nameRotate":null,"nameTruncate":{"maxWidth":null,"ellipsis":"...","placeholder":"."},"nameTextStyle":{},"silent":false,"triggerEvent":false,"tooltip":{"show":false},"axisLine":{"show":true,"onZero":true,"lineStyle":{"color":"#333","width":1,"type":"solid"}},"offset":0,"rangeEnd":null,"rangeStart":null}],"grid":[{"show":false,"zlevel":0,"z":0,"left":"10%","top":60,"right":"10%","bottom":60,"containLabel":false,"backgroundColor":"rgba(0,0,0,0)","borderWidth":1,"borderColor":"#ccc"}],"series":[{"name":"boxplot","type":"boxplot","data":[[655,850,940,980,1175],[672.5,800,845,885,1012.5],[780,840,855,880,940],[621.25,767.5,815,865,1011.25],[713.75,807.5,810,870,963.75]],"itemStyle":{"normal":{"borderColor":"#1ABC9C","color":"#fff","borderWidth":1},"emphasis":{"borderColor":"#5DADE2","borderWidth":2,"shadowBlur":5,"shadowOffsetX":2,"shadowOffsetY":2,"shadowColor":"rgba(0,0,0,0.4)"}},"tooltip":{},"zlevel":0,"z":2,"coordinateSystem":"cartesian2d","legendHoverLink":true,"hoverAnimation":true,"layout":"horizontal","boxWidth":[7,50],"animationEasing":"elasticOut","animationDuration":800},{"name":"outlier","type":"scatter","itemStyle":{"normal":{"color":"#1ABC9C","opacity":0.8},"emphasis":{"color":"#5DADE2"}},"data":[[0,650],[2,620],[2,720],[2,720],[2,950],[2,970]],"coordinateSystem":"cartesian2d","zlevel":0,"z":2,"legendHoverLink":true,"hoverAnimation":true,"symbolSize":10,"large":false,"largeThreshold":2000}],"markArea":[{"zlevel":0,"z":1,"tooltip":{"trigger":"item"},"animation":false,"label":{"normal":{"show":true,"position":"top"},"emphasis":{"show":true,"position":"top"}},"itemStyle":{"normal":{"borderWidth":0}}}],"markLine":[{"zlevel":0,"z":5,"symbol":["circle","arrow"],"symbolSize":[8,16],"precision":2,"tooltip":{"trigger":"item"},"label":{"normal":{"show":true,"position":"end"},"emphasis":{"show":true}},"lineStyle":{"normal":{"type":"dashed"},"emphasis":{"width":3}},"animationEasing":"linear"}],"markPoint":[{"zlevel":0,"z":5,"symbol":"pin","symbolSize":50,"tooltip":{"trigger":"item"},"label":{"normal":{"show":true,"position":"inside"},"emphasis":{"show":true}},"itemStyle":{"normal":{"borderWidth":2}}}],"marker":[],"visualMap":[],"dataZoom":[],"brush":[],"legend":[]}';
var json2 = '{"color":["#1ABC9C","#5DADE2","#FFC153","#EC7063","#CC99CC","#666666","#5E5E73","#FFBC11"],"chart_div_id":"main","animation":false,"textStyle":{"fontFamily":"sans-serif","fontSize":12,"fontStyle":"normal","fontWeight":"normal"},"animationDuration":1000,"animationDurationUpdate":300,"animationEasing":"exponentialOut","animationEasingUpdate":"cubicOut","animationThreshold":2000,"progressiveThreshold":3000,"progressive":400,"hoverLayerThreshold":3000,"title":[{"show":true,"x":"left","padding":[0,0,0,20],"textStyle":{"fontWeight":"bold","fontSize":"12","color":"#333"},"text":"Matrix Heatmap Demo","left":"left","zlevel":0,"z":6,"target":"blank","subtext":"","subtarget":"blank","top":0,"backgroundColor":"rgba(0,0,0,0)","borderColor":"#ccc","borderWidth":0,"itemGap":10,"subtextStyle":{"color":"#aaa"}}],"tooltip":[{"position":"top","zlevel":0,"z":8,"show":true,"showContent":true,"trigger":"item","triggerOn":"mousemove","alwaysShowContent":false,"confine":false,"showDelay":0,"hideDelay":100,"transitionDuration":0.4,"enterable":false,"backgroundColor":"rgba(50,50,50,0.7)","borderColor":"#333","borderRadius":4,"borderWidth":0,"padding":5,"extraCssText":"","axisPointer":{"type":"line","axis":"auto","animation":true,"animationDurationUpdate":200,"animationEasingUpdate":"exponentialOut","lineStyle":{"color":"#555","width":1,"type":"solid"},"crossStyle":{"color":"#555","width":1,"type":"dashed","textStyle":{}},"shadowStyle":{"color":"rgba(150,150,150,0.3)"}},"textStyle":{"color":"#fff","fontSize":14}}],"yAxis":[{"type":"category","data":["Saturday","Friday","Thursday","Wednesday","Tuesday","Monday","Sunday"],"splitArea":{"show":true,"areaStyle":{"color":["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},"boundaryGap":true,"splitLine":{"show":false,"lineStyle":{"color":["#ccc"],"width":1,"type":"solid"}},"axisTick":{"alignWithLabel":false,"interval":"auto","show":true,"inside":false,"length":5,"lineStyle":{"width":1}},"axisLabel":{"interval":"auto","show":true,"inside":false,"rotate":0,"margin":8,"textStyle":{"fontSize":12}},"show":true,"zlevel":0,"z":0,"inverse":false,"name":"","nameLocation":"end","nameRotate":null,"nameTruncate":{"maxWidth":null,"ellipsis":"...","placeholder":"."},"nameTextStyle":{},"nameGap":15,"silent":false,"triggerEvent":false,"tooltip":{"show":false},"axisLine":{"show":true,"onZero":true,"lineStyle":{"color":"#333","width":1,"type":"solid"}},"offset":0,"rangeEnd":null,"rangeStart":null}],"xAxis":[{"type":"category","data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"splitArea":{"show":true,"areaStyle":{"color":["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},"boundaryGap":true,"splitLine":{"show":false,"lineStyle":{"color":["#ccc"],"width":1,"type":"solid"}},"axisTick":{"alignWithLabel":false,"interval":"auto","show":true,"inside":false,"length":5,"lineStyle":{"width":1}},"axisLabel":{"interval":"auto","show":true,"inside":false,"rotate":0,"margin":8,"textStyle":{"fontSize":12}},"show":true,"zlevel":0,"z":0,"inverse":false,"name":"","nameLocation":"end","nameRotate":null,"nameTruncate":{"maxWidth":null,"ellipsis":"...","placeholder":"."},"nameTextStyle":{},"nameGap":15,"silent":false,"triggerEvent":false,"tooltip":{"show":false},"axisLine":{"show":true,"onZero":true,"lineStyle":{"color":"#333","width":1,"type":"solid"}},"offset":0,"rangeEnd":null,"rangeStart":null}],"grid":[{"height":"80%","y":"10%","top":"10%","show":false,"zlevel":0,"z":0,"left":"10%","right":"10%","containLabel":false,"backgroundColor":"rgba(0,0,0,0)","borderWidth":1,"borderColor":"#ccc"}],"series":[{"name":"Punch Card","type":"heatmap","data":[[0,0,5],[1,0,1],[2,0,"-"],[3,0,"-"],[4,0,"-"],[5,0,"-"],[6,0,"-"],[7,0,"-"],[8,0,"-"],[9,0,"-"],[10,0,"-"],[11,0,2],[12,0,4],[13,0,1],[14,0,1],[15,0,3],[16,0,4],[17,0,6],[18,0,4],[19,0,4],[20,0,3],[21,0,3],[22,0,2],[23,0,5],[0,1,7],[1,1,"-"],[2,1,"-"],[3,1,"-"],[4,1,"-"],[5,1,"-"],[6,1,"-"],[7,1,"-"],[8,1,"-"],[9,1,"-"],[10,1,5],[11,1,2],[12,1,2],[13,1,6],[14,1,9],[15,1,11],[16,1,6],[17,1,7],[18,1,8],[19,1,12],[20,1,5],[21,1,5],[22,1,7],[23,1,2],[0,2,1],[1,2,1],[2,2,"-"],[3,2,"-"],[4,2,"-"],[5,2,"-"],[6,2,"-"],[7,2,"-"],[8,2,"-"],[9,2,"-"],[10,2,3],[11,2,2],[12,2,1],[13,2,9],[14,2,8],[15,2,10],[16,2,6],[17,2,5],[18,2,5],[19,2,5],[20,2,7],[21,2,4],[22,2,2],[23,2,4],[0,3,7],[1,3,3],[2,3,"-"],[3,3,"-"],[4,3,"-"],[5,3,"-"],[6,3,"-"],[7,3,"-"],[8,3,1],[9,3,"-"],[10,3,5],[11,3,4],[12,3,7],[13,3,14],[14,3,13],[15,3,12],[16,3,9],[17,3,5],[18,3,5],[19,3,10],[20,3,6],[21,3,4],[22,3,4],[23,3,1],[0,4,1],[1,4,3],[2,4,"-"],[3,4,"-"],[4,4,"-"],[5,4,1],[6,4,"-"],[7,4,"-"],[8,4,"-"],[9,4,2],[10,4,4],[11,4,4],[12,4,2],[13,4,4],[14,4,4],[15,4,14],[16,4,12],[17,4,1],[18,4,8],[19,4,5],[20,4,3],[21,4,7],[22,4,3],[23,4,"-"],[0,5,2],[1,5,1],[2,5,"-"],[3,5,3],[4,5,"-"],[5,5,"-"],[6,5,"-"],[7,5,"-"],[8,5,2],[9,5,"-"],[10,5,4],[11,5,1],[12,5,5],[13,5,10],[14,5,5],[15,5,7],[16,5,11],[17,5,6],[18,5,"-"],[19,5,5],[20,5,3],[21,5,4],[22,5,2],[23,5,"-"],[0,6,1],[1,6,"-"],[2,6,"-"],[3,6,"-"],[4,6,"-"],[5,6,"-"],[6,6,"-"],[7,6,"-"],[8,6,"-"],[9,6,"-"],[10,6,1],[11,6,"-"],[12,6,2],[13,6,1],[14,6,3],[15,6,4],[16,6,"-"],[17,6,"-"],[18,6,"-"],[19,6,"-"],[20,6,1],[21,6,2],[22,6,2],[23,6,6]],"label":{"normal":{"show":true},"emphasis":{"show":true}},"itemStyle":{"emphasis":{"shadowBlur":10,"shadowColor":"rgba(0, 0, 0, 0.5)"}},"coordinateSystem":"cartesian2d","zlevel":0,"z":2,"geoIndex":0,"blurSize":30,"pointSize":20,"maxOpacity":1,"minOpacity":0}],"markArea":[{"zlevel":0,"z":1,"tooltip":{"trigger":"item"},"animation":false,"label":{"normal":{"show":true,"position":"top"},"emphasis":{"show":true,"position":"top"}},"itemStyle":{"normal":{"borderWidth":0}}}],"markLine":[{"zlevel":0,"z":5,"symbol":["circle","arrow"],"symbolSize":[8,16],"precision":2,"tooltip":{"trigger":"item"},"label":{"normal":{"show":true,"position":"end"},"emphasis":{"show":true}},"lineStyle":{"normal":{"type":"dashed"},"emphasis":{"width":3}},"animationEasing":"linear"}],"markPoint":[{"zlevel":0,"z":5,"symbol":"pin","symbolSize":50,"tooltip":{"trigger":"item"},"label":{"normal":{"show":true,"position":"inside"},"emphasis":{"show":true}},"itemStyle":{"normal":{"borderWidth":2}}}],"marker":[],"visualMap":[{"min":0,"max":10,"calculable":true,"orient":"vertical","left":"right","top":"5%","show":true,"zlevel":0,"z":4,"seriesIndex":[0],"dimension":null,"inRange":null,"outOfRange":null,"right":null,"itemWidth":null,"itemHeight":null,"inverse":false,"backgroundColor":"rgba(0,0,0,0)","borderColor":"#ccc","contentColor":"#5793f3","inactiveColor":"#aaa","borderWidth":0,"padding":5,"textGap":10,"precision":0,"color":null,"formatter":null,"text":null,"textStyle":{"color":"#333"},"align":"auto","range":[0,10],"realtime":true,"hoverLink":true,"hoverLinkDataSize":null,"hoverLinkOnHandle":true,"target":{"inRange":{"color":["#f6efa6","#d88273","#bf444c"]},"outOfRange":{"color":["rgba(0,0,0,0)"],"opacity":[0,0]}},"controller":{"inRange":{"color":["#f6efa6","#d88273","#bf444c"],"symbol":["roundRect"],"symbolSize":[20,20]},"outOfRange":{"color":["#aaa"],"symbol":["roundRect"],"symbolSize":[20,20]}}}],"dataZoom":[],"brush":[],"legend":[]}';
function test(json){
  if (true) {
    var option = ChartPOJO.deserialize_chart_option(json);

    var context_div_clone = $('#tutorial_chart').clone().removeAttr('id');
    var cell_id = (new Date()).getTime() + "_cell";
    context_div_clone.attr('id', cell_id);
    context_div_clone.css('display', '');
    add_content_div(context_div_clone, 0, 0, 6, 6);
    setTimeout(function() {
      c = ChartPOJO.renderChart(cell_id, option);
    }, 200);
  }
}


var c;
function addCell_chart(json) {
  if (json) {
    var option = ChartPOJO.deserialize_chart_option(json);

    var context_div_clone = $('#tutorial_chart').clone().removeAttr('id');
    var cell_id = (new Date()).getTime() + "_cell";
    context_div_clone.attr('id', cell_id);
    context_div_clone.css('display', '');
    add_content_div(context_div_clone, 0, 0, 6, 6);
    setTimeout(function() {
      c = ChartPOJO.renderChart(cell_id, option);
    }, 200);
  }
};


// *******Server Side Retrieve Data JS Code*******
var retrieveData_chart = function(page) {
  //        LoaderUtil.add('tableDIV');
  var requestPOJO = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": pageMaxSize,
    "currentPageNumber": page || 1,
    "likeORMap": {

    },
    "eqMap": {
      "type": "MATRIX_CHART",
      "deleted": false
    },
    "inMap": {},
  };
  var data = {
    'queryJson': $.toJSON(requestPOJO)
  };
  $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "CHART_SEARCH_SUCCESS_LISTENER", "CHART_PAGING_SEARCH_FAILED", "CHART_SERVICE_GENERIC_QUERY_FAILED");
}


// *******Server Side Retrieve Data Listener JS Code*******
$.subscribe("CHART_SEARCH_SUCCESS_LISTENER", successListener_chart);
$.subscribe("CHART_PAGING_SEARCH_FAILED", failedListener_chart);
$.subscribe("CHART_SERVICE_GENERIC_QUERY_FAILED", failedServiceListener_chart);


function failedServiceListener_chart() {
  if(!genericModalViewModel){
    return;
  }
  genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", "SERVICE 'GENERIC CUD' FAILED! Please contact with the system admin for more information...");
}

function failedListener_chart() {
  if(!genericModalViewModel){
    return;
  }
  if (arguments && arguments[1]) {
    var errorMessage = arguments[1].errorMessage;
    genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", errorMessage);
  }
}

function successListener_chart() {
  if(!genericModalViewModel){
    return;
  }
  if (arguments && arguments[1]) {
    var data = arguments[1].result;
    displayResult = displayResult.concat(data);
    if (data.length < pageMaxSize) {
      hasNewData = false;
    }
    var history_scripts = displayResult.sort(sortTime);

    genericModalViewModel.businessPOJO().serverPagingViewModel.viewData(history_scripts);
  }
}

function sortTime(a, b) {
  return b.createtime - a.createtime;
}









function initialize() {

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

            initialize();
        }
    }
}
$.subscribe("MATRIX_SHARE_SUCCESS", successListener);
$.subscribe("MATRIX_SHARE_FAILED", failedListener);
$.subscribe("MATRIX_SHARE_SERVICE_FAILED", failedServiceListener);

function successListener() {
    if (arguments && arguments[1]) {
        var json = arguments[1].result[0];
        // render dom
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
