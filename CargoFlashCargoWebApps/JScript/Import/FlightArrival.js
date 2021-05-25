$(function () {

    SearchFlightArrival();

});
var currentDailyFlightSno = "";
$(document).ready(function () {
    var _CURR_PRO_ = "FlightArrival";

});

function SearchFlightArrival() {
    _CURR_PRO_ = "FlightArrival";
    _CURR_OP_ = "Flight Arrival";

    var LoggedInCity = "DEL";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divFlightArrivalDetails").html("");
    //CleanUI();
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FlightArrival/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContentAppend);
            //$("#divFooter").html(fotter).show();

            $("#searchFromDate").change(function () {
                ValidateDate();
            });

            $("#searchToDate").change(function () {
                ValidateDate();
            });

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                //CleanUI();
                FlightArrivalSearch()
            });
        }
    });
    FlightArrivalSearch();
}


function FlightArrivalSearch() {
    var LoggedInCity = "DEL";
    var SearchAirlineSNo = 0;//$("#SearchAirlineSNo").val() == "" ? "0" : $("#SearchAirlineSNo").val();
    var SearchFlightNo = $("#SearchFlightNo").val() == "" ? "A~A" : $("#SearchFlightNo").val();
    var SearchBoardingPoint = "a";//$("#SearchBoardingPoint").val() == "" ? "a" : $("#SearchBoardingPoint").val();
    var searchFromDate = "0";
    searchFromDate = $("#searchFromDate").attr("sqldatevalue") != "" ? $("#searchFromDate").attr("sqldatevalue") : "0";
    var searchToDate = "0";
    searchToDate = $("#searchToDate").attr("sqldatevalue") != "" ? $("#searchToDate").attr("sqldatevalue") : "0";
    var StartTime = "0";// $("#StartTime").val() == "" ? "0" : $("#StartTime").val();
    var EndTime = "0";//$("#EndTime").val() == "" ? "0" : $("#EndTime").val();
    var FetchAWBList = "0";

    //$("#imgprocessing").show();
    //$("#imgprocessing").hide();
    if (_CURR_PRO_ == "FlightArrival") {
        cfi.ShowIndexView("divFlightArrivalDetails", "Services/Import/FlightArrivalService.svc/GetGridData/" + _CURR_PRO_ + "/Import/FlightArrival/" + SearchAirlineSNo + "/" + SearchFlightNo + "/" + SearchBoardingPoint + "/" + searchFromDate + "/" + searchToDate + "/" + StartTime.replace(':', '-') + "/" + EndTime.replace(':', '-') + "/" + FetchAWBList);
    }
}

function GetFlightShipment(obj, DailyFlightSno) {
    _CURR_PRO_ = "FlightArrival";
    _CURR_OP_ = "Flight Arrival";
    currentDailyFlightSno = DailyFlightSno;
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FlightArrivalFlightInformation/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContentAppend);
            InitializePage("FlightArrivalFlightInformation", 'divContent')
            if (_CURR_PRO_ == "FlightArrival") {

                cfi.ShowIndexView("divFlightArrivalDetails", "Services/Import/FlightArrivalService.svc/GetFlightArrivalShipmentGrid/" + _CURR_PRO_ + "/Import/FlightArrivalShipment/" + DailyFlightSno);

            }
        }
    });



}
function ValidateDate() {
    var fromDate = $("#searchFromDate").attr("sqldatevalue");
    var toDate = $("#searchToDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $("#searchFromDate").val("");
            $("#searchToDate").val("");
            alert("From date should not be greater than To date");
        }
    }
}
function BindEvents(obj, e, isdblclick) {

    //$("#divDetail").html('');
    //$("#divDetailSHC").html('');
    ////---031215 Starts
    //$("#divTab3").html('');
    //$("#divTab4").html('');
    //$("#divTab5").html('');
    ////---031215 Ends
    //$("#divXRAY").hide();
    //if ($(obj).attr("class") == "dependentprocess")
    //    _IS_DEPEND = true;
    //else
    //    _IS_DEPEND = false;
    //ResetDetails();
    //$("#btnCancel").unbind("click").bind("click", function () {
    //    ResetDetails();
    //});
    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    _CURR_PRO_ = $(obj).attr("currentprocess").toUpperCase();
    //var closestTr = $(obj).closest("tr");
    ////var clickedRowIndex = $(obj).closest("tr").index();
    ////var closestLockedTr = $(obj).closest("div.k-grid").find("div.k-grid-content-locked").find("tr:eq(" + clickedRowIndex.toString() + ")");

    //var awbNoIndex = 0;
    //var awbSNoIndex = 0;
    //var awbDateIndex = 0;
    //var pcsIndex = 0;
    //var chwtIndex = 0;
    //var originIndex = 0;
    //var destIndex = 0;
    //var flightNoIndex = 0;
    //var flightDateIndex = 0;
    //var commodityIndex = 0;
    //var accpcsindex = 0;
    //var accgrwtindex = 0;
    //var accvolwtindex = 0;

    //var trLocked = $(".k-grid-header-wrap tr");
    //var trRow = $(".k-grid-header-wrap tr");

    //awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    //originIndex = trLocked.find("th[data-field='Origin']").index();
    //destIndex = trLocked.find("th[data-field='Destination']").index();
    //awborigin = originIndex;
    //awbSNoIndex = 0;
    //awbDateIndex = trRow.find("th[data-field='AWBDate']").index();
    //pcsIndex = trRow.find("th[data-field='Pcs']").index();
    //chwtIndex = trRow.find("th[data-field='ChWt']").index();
    //flightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    //flightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    //commodityIndex = trRow.find("th[data-field='CommodityCode']").index();
    //accpcsindex = trRow.find("th[data-field='AccPcs']").index();
    //accgrwtindex = trRow.find("th[data-field='AccGrWt']").index();
    //accvolwtindex = trRow.find("th[data-field='AccVolWt']").index();

    //currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    //accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    //accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    //accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();
    //// Added by RH 12-08-15 starts
    //var FBLWtIndex = 0;
    //var FWBWtIndex = 0;
    //var RCSWtIndex = 0;
    //FBLWtIndex = trRow.find("th[data-field='FBLWt']").index();
    //FWBWtIndex = trRow.find("th[data-field='FWBWt']").index();
    //RCSWtIndex = trRow.find("th[data-field='RCSWt']").index();
    //$("#tdFBLwt").text(closestTr.find("td:eq(" + FBLWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FBLWtIndex + ")").text());
    //$("#tdFWBwt").text(closestTr.find("td:eq(" + FWBWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FWBWtIndex + ")").text());
    //$("#tdRCSwt").text(closestTr.find("td:eq(" + RCSWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + RCSWtIndex + ")").text());
    //// Added by RH 12-08-15 ends
    //$("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    //$("#tdOD").text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());

    //$("#hdnAWBSNo").val(currentawbsno);
    //$("#hdnAccPcs").val(accpcs);
    //$("#hdnAccGrWt").val(accgrwt);
    //$("#hdnAccVolWt").val(accvolwt);

    //$("#tdAWBDate").text(closestTr.find("td:eq(" + awbDateIndex + ")").text());
    //$("#tdFlightNo").text(closestTr.find("td:eq(" + flightNoIndex + ")").text());
    //$("#tdFlightDate").text(closestTr.find("td:eq(" + flightDateIndex + ")").text());
    //$("#tdCommodity").text(closestTr.find("td:eq(" + commodityIndex + ")").text());
    //$("#tdPcs").text(closestTr.find("td:eq(" + pcsIndex + ")").text());
    //$("#tdChWt").text(closestTr.find("td:eq(" + chwtIndex + ")").text());

    //awbNoIndex = trRow.find("th[data-field='AWBNo']").index();
    ShowProcessDetails(subprocess, isdblclick);
    //$("#tabstrip").kendoTabStrip();
}


function ShowProcessDetails(subprocess, isdblclick) {

    //if (subprocess.toUpperCase() == "FAULDLocation".toUpperCase()) {
    //$("#tblShipmentInfo").show();
    //cfi.ShowIndexView("divAfterContent", "Services/Import/FlightArrivalService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FlightArrivalFlightInformation/New/1");
    //PopUp
    ////SAVE SECTION
    //$("#btnSave").unbind("click");
    //cfi.PopUp("divAfterContent", "ULD Location");
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divAfterContent").html(result);
            if (result != undefined || result != "") {
                InitializePage(subprocess, "divAfterContent", isdblclick);
                $("#Validate").addClass("btn-info");

            }
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });

    //}

}
function BindSLIDimensionEvents() {
    //SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIDimemsionsAndULD?SLISNo=" + 1, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var dimArray = dimuldData.Table0;
            var DimUnit = dimuldData.Table1;
            var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("PackingTypeSNo", "PackingName", "FlightArrival_PackingTypeSNo", null, "contains");
            cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });
}
function BindULDLocation() {
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetULDLocation?DailyFlightSNo=" + 1 + "&ULDSNo" + 2, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //var dimuldData = jQuery.parseJSON(result);
            //var dimArray = dimuldData.Table0;
            //var DimUnit = dimuldData.Table1;
            //var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("Location", "LocationNo", "FlightArrival_Location", null, "contains");
            //cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });

}
function BindULDDamage() {
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetULDLocation?DailyFlightSNo=" + 1 + "&ULDSNo" + 2, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //var dimuldData = jQuery.parseJSON(result);
            //var dimArray = dimuldData.Table0;
            //var DimUnit = dimuldData.Table1;
            //var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("Location", "LocationNo", "FlightArrival_Location", null, "contains");
            //cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });

}
function BindULDConsumable() {
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetULDLocation?DailyFlightSNo=" + 1 + "&ULDSNo" + 2, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //var dimuldData = jQuery.parseJSON(result);
            //var dimArray = dimuldData.Table0;
            //var DimUnit = dimuldData.Table1;
            //var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("Location", "LocationNo", "FlightArrival_Location", null, "contains");
            //cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });

}
function BindLocation() {
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetULDLocation?DailyFlightSNo=" + 1 + "&ULDSNo" + 2, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //var dimuldData = jQuery.parseJSON(result);
            //var dimArray = dimuldData.Table0;
            //var DimUnit = dimuldData.Table1;
            //var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("Location", "LocationNo", "FlightArrival_Location", null, "contains");
            //cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });

}
function BindDamage() {
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetULDLocation?DailyFlightSNo=" + 1 + "&ULDSNo" + 2, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //var dimuldData = jQuery.parseJSON(result);
            //var dimArray = dimuldData.Table0;
            //var DimUnit = dimuldData.Table1;
            //var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("Location", "LocationNo", "FlightArrival_Location", null, "contains");
            //cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });

}
function BindConsumable() {
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetULDLocation?DailyFlightSNo=" + 1 + "&ULDSNo" + 2, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //var dimuldData = jQuery.parseJSON(result);
            //var dimArray = dimuldData.Table0;
            //var DimUnit = dimuldData.Table1;
            //var uldArray = dimuldData.Table2;
            cfi.AutoCompleteV2("Location", "LocationNo", "FlightArrival_Location", null, "contains");
            //cfi.makeTrans("sli_slidimension", null, null, null, null, null, dimArray);

        },
        error: {

        }
    });

}
function BindFlightInfo() {
    cfi.AutoCompleteV2("Origin", "AirportCode", "FlightArrival_Origin", null, "contains");
    var DailyFlightSno = (currentDailyFlightSno == "" ? 0 : currentDailyFlightSno);
    $.ajax({
        url: "Services/Import/FlightArrivalService.svc/GetFlightArrivalFlightInformation?DailyFlightSno=" + DailyFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData.length > 0) {
                var resItem = resData[0];
                $("span#FlightNo").html(resItem.FlightNo);
                $("span#Origin").html(resItem.OriginAirport);
                $("span#FLIGHTDATE").html(resItem.FlightDate);
                $("#ATA").val(resItem.ATA);
                $("#AircraftRegistrationNo").val(resItem.AircraftRegistrationNo);
            }
        },
        error: {

        }
    });


}
function ShowAlert() {
    alert('madhav');
}
function InitializePage(subprocess, cntrlid, isdblclick) {
    InstantiateControl(cntrlid);
    //  alert(subprocess.toUpperCase());
    if (subprocess.toUpperCase() == "FlightArrivalFlightInformation".toUpperCase()) {
        BindFlightInfo();
    }
    else if (subprocess.toUpperCase() == "FAULDLocation".toUpperCase()) {
        BindULDLocation();
        cfi.PopUp("__div" + subprocess.toLowerCase() + "__", "ULD Location", null, null, ShowAlert);
    }
    else if (subprocess.toUpperCase() == "FAULDDamage".toUpperCase()) {
        cfi.PopUp("__div" + subprocess.toLowerCase() + "__", "ULD Damage");
    }
    else if (subprocess.toUpperCase() == "FAConsumable".toUpperCase()) {
        cfi.PopUp("__div" + subprocess.toLowerCase() + "__", "ULD Consumable");
    }
    else if (subprocess.toUpperCase() == "FALocation".toUpperCase()) {
        cfi.PopUp("__div" + subprocess.toLowerCase() + "__", "Shipment Location");
    }
    else if (subprocess.toUpperCase() == "FADamage".toUpperCase()) {
        cfi.PopUp("__div" + subprocess.toLowerCase() + "__", "Shipment Damage");
    }
    else if (subprocess.toUpperCase() == "FAConsumable".toUpperCase()) {
        cfi.PopUp("__div" + subprocess.toLowerCase() + "__", "Shipment Consumable");
    }
    else if (subprocess.toUpperCase() == "") {


        //$("#Text_Type").unbind("blur").bind("blur", function () {
        //    test();
        //});
    }
    $("#btnSave").unbind("click").bind("click", function () {
        //if (cfi.IsValidSection('divDetail')) {
        //   if (true) {
        if (SaveFormData(subprocess))
            SLISearch();
        //  }
        //   }
        //  else {
        //      return false
        // }
    });
}


function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //   else {
                    //          cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //        }
                }
            }
        }
    });

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });

    cfi.AutoCompleteV2("SearchAirlineSNo", "AirlineCode,AirlineName", "FlightArrival_SearchAirlineSNo", null, null, "contains");
    cfi.AutoCompleteV2("SearchBoardingPoint", "AirportCode", "FlightArrival_SearchBoardingPoint");
    $("#Text_SearchAirlineSNo").attr("placeholder", "Airline");
    $("#Text_SearchBoardingPoint").attr("placeholder", "Boarding Point");
    $('#__tblFlightArrival__ tr:first td:eq(1) span > span:first ').css('width', '90%');
    $('#__tblFlightArrival__ tr:first td:eq(3) span > span:first ').css('width', '90%');

    $('#__tblFlightArrival__').find('td').eq(13).after('<td>&nbsp;</td><td><select class="k-input" style="height:25px;"><option>Less Than 10</option><option>More Than 10</option><option>More Than 20</option><option>More Than 30</option></select></td>');
    $("#FetchAWBList").removeAttr('checked');




    /*Start Time Control***************************/
    $("#ValidFrom").change(function () {
        if ((dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()) + "-" + mnth[dt.getMonth()] + "-" + dt.getFullYear() != $("#ValidFrom").val()) {
            start.min("00:00");
            $("#StartTime").val('');
            $("#EndTime").val('');
        }
        else {
            setTime(dt, start);
            $("#StartTime").val('');
            $("#EndTime").val('');
        }
    });

    $("#StartTime").css('width', '100px').attr("placeholder", "Start Time");
    $("#EndTime").css('width', '100px').attr("placeholder", "End Time");

    var start = $("#StartTime").kendoTimePicker({
        format: "HH:mm",
        change: function () {
            var startTime = start.value();

            if (startTime) {
                startTime = new Date(startTime);
                end.max(startTime);
                startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                end.min(startTime);
                end.value(startTime);
            } else {
                $('#StartTime').val('');
            }
        }
    }).data("kendoTimePicker");

    //init end timepicker
    var end = $("#EndTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");

    /*End Time Control***************************/
}
function InstantiateControl(containerId) {

    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("#" + containerId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });
    SetDateRangeValue();

    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });
    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();
    });
    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            return true;
        }
        else {
            return false
        }
    });
    _callBack = function () {
        if ($.isFunction(window.MakeTransDetailsData)) {
            return MakeTransDetailsData();
        }
    }

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }
    $(".removepopup").click(function () {
        $("#divRemovePanel").show();
        cfi.PopUp("divRemoveRecord", "");
    });
    $(".cancelpopup").click(function () {
        $("#divRemovePanel").hide();
        cfi.ClosePopUp("divRemoveRecord");
    });
    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
        var transid = this.id.replace("divareaTrans_", "");
        cfi.makeTrans(transid, null, null, null, null, null, null);
    });
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
}
var divContentAppend = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divFlightArrivalDetails' style='width:100%'></div></td></tr></table></div>";