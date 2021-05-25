$(document).ready(function () {

   

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
   
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    



    //var todaydate = new Date();
    //var validTodate = $("#ToDate").data("kendoDatePicker");
    //validTodate.min(todaydate);
    //var validfromdate = $("#FromDate").data("kendoDatePicker");
    //validfromdate.min(todaydate);



});


function SearchAmendFlightRecords() {

    $("#FromDate").attr('data-valid', 'required');
    $("#ToDate").attr('data-valid', 'required');
   
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
   
    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();
    
    if (FromDate != "" || ToDate != "") {
        $.ajax({
            url: 'GetAmendFlightRecords',
            async: false,
            type: "GET",
            dataType: "json",
            data: { FromDate: FromDate, ToDate: ToDate },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var theDiv = document.getElementById("BindAmendFlighRecords");
                theDiv.innerHTML = "";
                var str = "<table id='FlightListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>Reference Number</th><th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>AWB Origin</th><th bgcolor='lightblue'>AWB Destination</th><th bgcolor='lightblue'>Flight No.</th><th bgcolor='lightblue'>Flight Date</th><th bgcolor='lightblue'>Flight Origin</th><th bgcolor='lightblue'>Flight Destination</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Gross Weight</th><th bgcolor='lightblue'>Volume</th><th bgcolor='lightblue'>AWB Status</th></tr></thead>";
                if (result.Table0.length > 0) {
                    for (var i = 0; i < result.Table0.length; i++) {
                        str += " <tbody><tr>";
                        str += "<td>" + result.Table0[i].Reference + "</td>"
                        str += "<td>" + result.Table0[i].AgentName + "</td>"
                        str += "<td>" + result.Table0[i].AWBOrigin + "</td>"
                        str += "<td>" + result.Table0[i].AWBDestination + "</td>"
                        str += "<td>" + result.Table0[i].FlightNo + "</td>"
                        str += "<td>" + result.Table0[i].FlightDate + "</td>";
                        str += "<td>" + result.Table0[i].FlightOrigin + "</td>";
                        str += "<td>" + result.Table0[i].FlightDestination + "</td>";
                        str += "<td>" + result.Table0[i].Pieces + "</td>";

                        str += "<td>" + result.Table0[i].GrossWeight + "</td>";
                        str += "<td>" + result.Table0[i].Volume + "</td>";
                        str += "<td>" + result.Table0[i].AWBStatus + "</td>";
                      
                        str += "</tr></tbody>";
                    }// Reference,FlightNo,FlightDate,FlightOrigin,FlightDestination,Pieces,GrossWeight,Volume,AWBStatus,AgentName,AWBOrigin,AWBDestination
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='12'><center><p style='color:red'>Not Exists</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";

                theDiv.innerHTML = str;

             

                //return false
            },
            //error: function (xhr) {
            //    var a = "";Dir
            //}
        });
    }
}


function ShowMessage(msgType, title, htmlText, position, width, logout) {

    if (htmlText != "") {
        CallMessageBox(msgType, title, htmlText, position, undefined, undefined, undefined, width, logout);
    }
}
function CallMessageBox(msgType, title, msg, position, fadeInTime, fadeOutTime, timeout, width, logout) {

    if (fadeInTime == undefined)
        fadeInTime = 300;
    if (fadeOutTime == undefined)
        fadeOutTime = 1000;
    if (timeout == undefined)
        timeout = 6000;
    if (width == undefined)
        width = "300px";
    if (position == undefined)
        position = "cfMessage-top-right";
    else
        position = "cfMessage-" + position.toLowerCase();
    InvokeMsg.options = {
        "debug": false,
        "positionClass": position,
        "onclick": null,
        "fadeIn": fadeInTime,
        "fadeOut": fadeOutTime,
        "timeOut": timeout,
        "width": width,
        "logout": logout

    }
    InvokeMsg[msgType](msg, title)

}


