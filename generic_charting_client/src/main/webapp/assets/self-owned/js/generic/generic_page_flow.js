var PageFlowPOJO = PageFlowPOJO || {};
PageFlowPOJO = {
    environmentCheck: function () {
        console.log("PAGE FLOW ENVIRONMENT CHECK...");
        console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[BEGIN]");
        var tokenFlag = $.hasUrlParam('token');
        if (tokenFlag) {
            console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[FINISHED & RESULT:SUCCESSED]");
        } else {
            PageFlowPOJO.redirect('NORMAL');
            console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[FINISHED & RESULT:FAILED]");
            return;
        }
        console.log("ENVIRONMENT CHECK [STEP 2: Get token ]...[BEGIN]");
        var token = $.urlParamValue('token');
        if (token) {
            console.log("ENVIRONMENT CHECK [STEP 2: Get token]...[FINISHED & RESULT:SUCCESSED]");
        } else {
            PageFlowPOJO.redirect('INVALID');
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
            console.log("REDIRECT TO NORMAL PAGE");
        }
    }
}
