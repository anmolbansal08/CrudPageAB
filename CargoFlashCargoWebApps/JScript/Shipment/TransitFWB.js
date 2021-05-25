$(function () {

    MasterAcceptance();
});

var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var DGRSPHC = [];
var ItenaryArray = [];
var SHCdata = [];
var TempArray = [];
var FlightDateForGetRate = '';
var FlightNoForGetRate = '';
var isSaveAndNext = '';
var TactArray = [];
var currentawbno = '';
var AWBReferenceNumber = '';

var IsFWbComplete = false;
var IsFWBAmmendment = false
var IsFlightExist = false;

var _IS_DEPEND = false;
var TabColor = '';
var IsAgentBUP = '';
function ValidateDate() {
    var fromDate = $("#searchFlightDate").attr("sqldatevalue");
    var toDate = $("#searchOutwardFlightDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#searchFlightDate').data("kendoDatePicker").value("");
            $('#searchOutwardFlightDate').data("kendoDatePicker").value("");
            $("#searchFlightDate").val("");
            $("#searchOutwardFlightDate").val("");
            ShowMessage('warning', 'Warning - Transit FWB Flight', "Inward flight date should not be greater than outward flight date.");
        }
    }
}
function MasterAcceptance() {
    _CURR_PRO_ = "TRANSITFWB";
    _CURR_OP_ = "Master Acceptance";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetWebForm/FWB/Shipment/FWBSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            var rights = GetPageRightsByAppName("Shipment", "FWB");
            if (!rights.IsNew) {
                $("#btnNew").remove();
            }
            $("#searchFlightDate").change(function () {
                ValidateDate();
            });

            $("#searchOutwardFlightDate").change(function () {
                ValidateDate();
            });
            $("#btnNew").remove();
            $('#sprint').empty();
            var newOption = "<option value='AWB'>AWB</option>";
            $("#sprint").append(newOption);
            $("#sprint").css('width', '100px');


            $("#__divfwbsearch__ table:first").find("tr>td:first").text("Transit AWB");

            cfi.AutoCompleteV2("searchOriginCity", "CityCode,CityName", "TransitFWB_searchOriginCity", null, "contains");

            cfi.AutoCompleteV2("searchDestinationCity", "CityCode,CityName", "TransitFWB_searchDestinationCity", null, "contains");

            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "TransitFWB_searchFlightNo", null, "contains");


            cfi.AutoCompleteV2("searchOutwardFlightNo", "FlightNo", "TransitFWB_searchFlightNo", null, "contains");


            cfi.AutoCompleteV2("searchAWBPrefix", "AWBPrefix", "TransitFWB_searchAWBPrefix", null, "contains");

            cfi.AutoCompleteV2("searchAWBNo", "AWBNumber", "TransitFWB_searchAWBNo", null, "contains");

            cfi.AutoCompleteV2("Arrived", "Arrived", "TransitFWB_Arrived", null, "contains");

            cfi.AutoCompleteV2("DaysNo", "val", "TransitFWB_DaysNo", null, "contains");

            $('#searchOutwardFlightDate').data("kendoDatePicker").value("");



            $('#searchFlightDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
                currentawbsno = 0;
                currentawbno = '';
            });
            CleanUI();
            PageRightsCheckTRANSITFWB()
            ShipmentSearch();


            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                $("#hdnAWBSNo").val("");


                currentawbsno = 0;
                currentawbno = '';
                var module = "Shipment";
                if (_CURR_PRO_ == "HOUSE") {
                    module = "House";
                }
                $.ajax({
                    url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewBooking").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("RESERVATION", "divNewBooking");
                            currentprocess = "RESERVATION";
                            $("#AWBNo").focus();
                            $("#AWBNo").unbind("blur").bind("blur", function () {
                                CheckIsAWBUsable();
                            });
                            // to fill default board point
                            $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
                            $("div[id='tdivareaTrans_shipment_tfwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
                            //-- to hide old NOG values for new booking case
                            $("div[id$='divareaTrans_shipment_tfwbshipmentnog']").remove();
                            $("div[id$='divareaTrans_shipment_tfwbshctemp']").remove();
                            $("div[id$='divDetail']").append(NogDiv);
                            $("div[id='divareaTrans_shipment_tfwbshipmentnog']").find("tr[id^='areaTrans_shipment_tfwbshipmentnog']").each(function (i, row) {
                                cfi.AutoCompleteV2($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "TransitFWB_OtherNatureofGoods", EnableOtherNog, "contains");



                                $(row).find("input[id^='Text_OtherNatureofGoods']").parent().parent().css('width', '200px');
                                $(row).find("input[id^='NOG']").attr('disabled', 1);
                            });
                            //-- TO cleans SUb class Div
                            $("div[id$='divareaTrans_shipment_shipmentSHCSubGroup']").remove();
                            $("div[id$='divDetail']").append(SubGroupDiv);

                            $("#tblShipmentInfo").hide();
                            GetProcessSequence("ACCEPTANCE");
                            $("#btnSaveToNext").hide();
                        }
                    }
                });


            });
        }
    });

}


function BindFlightChart(DailyFlightNo) {



}

function onDataBound(arg) {

    var grid = $("#" + arg.sender.element[0].id + "").data("kendoGrid");
    var gridData = grid.dataSource.view();
    var DailyFlightSNo = '';
    for (var i = 0; i < gridData.length; i++) {
        var currentUid = gridData[i].uid;
        var currenRow = grid.table.find("tr[data-uid='" + currentUid + "']");
        DailyFlightSNo = DailyFlightSNo + "," + gridData[i].DailyFlightSNo;

    }
    //
    //DailyFlightSNo.substr();
    BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

}
function onRowChange(arg) {
    if (_CURR_PRO_ == "TRANSITFWB") {
        //BindEvents(arg, event, true);
    }
}

function onChange(arg) {

    if (_CURR_PRO_ == "TRANSITFWB") {

    }

}

function ShipmentSearch() {

    var OriginCity = $("#searchOriginCity").val() == "" ? "A~A" : $("#searchOriginCity").val().trim();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "A~A" : $("#searchDestinationCity").val().trim();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var Arrived = $("#Arrived").val() == "" ? "A~A" : $("#Arrived").val().trim();
    var DaysNo = $("#DaysNo").val() == "" ? "0" : $("#DaysNo").val().trim();
    var OutwardFlightNo = $("#searchOutwardFlightNo").val() == "" ? "A~A" : $("#searchOutwardFlightNo").val().trim();
    var FlightDate = "";
    var OutwardFlightDate = "";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "A~A" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }

    if ($("#searchOutwardFlightDate").val() != "") {
        OutwardFlightDate = cfi.CfiDate("searchOutwardFlightDate") == "" ? "A~A" : cfi.CfiDate("searchOutwardFlightDate");// "";//month + "-" + day + "-" + year;
    }
    // Temporary Set values
    //FlightDate = "2015-10-15";

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val().trim();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val().trim();
    var LoggedInCity = userContext.CityCode;

    if (_CURR_PRO_ == "HOUSE") {
        var HAWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetHouseAcceptanceGridData/" + _CURR_PRO_ + "/House/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + HAWBNo + "/" + LoggedInCity);

    }
    else if (_CURR_PRO_ == "TRANSITFWB") {
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + OutwardFlightNo + "/" + OutwardFlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity + "/" + Arrived + "/" + DaysNo);
        //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);
        $("#btnSave").hide();
        $("#btnSaveToNext").hide();
    }


}

//function AutoShipmentSearch(SubProcess) {
//    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
//        if ($(e).text() == currentawbsno) {
//           // BindEvents($(e).parent().find("[process=" + SubProcess + "]"), event);
//            return false;
//        }
//    });
//}
function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}
function BindSubProcess() {
    //  AutoShipmentSearch(currentprocess);
    //$("#divShipmentDetails").find("div[class='k-grid k-widget'] > div.k-grid-header > div > table > thead > tr > th:nth-child(2) > a.k-grid-filter > span").remove();

    var grid = $("#divShipmentDetails div[data-role='grid']").data('kendoGrid');
    var pager = grid.pager;
    pager.unbind('change').bind('change', fn_pagechange);
    function fn_pagechange(e) {
        currentawbsno = 0;
        AWBReferenceNumber = '';
    }
    $("th[data-field='OperationalSector']").hide();
    $("td[data-column='OperationalSector']").hide();
    $("th[data-title]:visible").map(function () { return $(this).attr("title", $(this).attr("data-title")) });
}
function checkProgrss(item, subprocess, displaycaption) {
    //dependentprocess
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
}

function CleanUI() {
    $("#divXRAY").hide();
    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");

    $("#divXRAY").hide();

    $("#ulTab").hide();
    $("#divDetail_SPHC").html("");
    $("#divDetailSHC").html("");

    $("#divTab3").html("");
    $("#divTab4").html("");
    $("#divTab5").html("");
    $("#tabstrip").hide();
    $("#btnSave").hide();
    $("#btnSaveToNext").hide();
    PageRightsCheckTRANSITFWB()
}

function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                    }
                });
            }
            out = out + ']';
            processList = eval(out);

        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
            $("th[data-field='OperationalSector']").hide();
            $("td[data-column='OperationalSector']").hide();
        },
        error: function (xhr) {
            var a = "";

        }
    });
}

var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var eDoxDataSource = [{ Key: "1", Text: "Invoice" }, { Key: "2", Text: "Security" }, { Key: "3", Text: "Others" }];

function ShowAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            var cancel = $(this).closest("tr").find("td:last").html();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId, addOnFunction: addOnFunction, addOnParmeter: cancel });
            }
        });
    });
}
//Hmishra
function showAWBPrint() {
    //if (currentawbsno!="")
    window.open("http://ngenops.cargoflash.com/Shipment/GenerateAWB.aspx?AWBSNo=" + currentawbsno + "&HAWBSNo=");


}
function showAWBlbl() {
    ShowMessage('warning', 'Information!', "Printer Not Configured", "bottom-right");
    //IdAWBlbl
}

function showAp() {
    window.open("AcceptanceNote.html?aId=" + currentawbsno);
}

function showPayRcpt() {
    //if (currentawbsno!="")
    window.open("http://localhost:9602/ReportBuilder/PaymentReceipt.aspx?AWBNo=" + printInvoiceSno + "&WMSCity=" + printorigin + "~WMSCity &HAWBSNo=");

}
function addOnFunction(content, obj, recId) {
    $("#header-user-options").find("a").css("display", "");
    if (recId.toUpperCase() == "YES") {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($(this).text().toUpperCase() == "EDIT") {
                $(this).closest("a").css("display", "none");
            }
        });
        $(content).find(".actionSpan").each(function (index) {
            if ($(this).text().toUpperCase() == "EDIT") {
                $(content).find("a:eq(" + index + ")").css("display", "none");
            }
        });
    }
}
var interval = null;
function BindEvents(obj, e, isdblclick) {
    $('select option[value="AWB"]').attr("selected", true);
    //$("#btnSaveToNext").show();
    $("#divDetail").html('');
    $("#divDetailSHC").html('');
    $("#divTab3").html('');
    $("#divTab4").html('');
    $("#divTab5").html('');
    $("#divXRAY").hide();
    $("#tabstrip").show();
    $("#btnSaveToNext").hide();
    $("#btnSave").hide();
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#divTab3").html("");
        $("#divTab4").html("");
        $("#divTab5").html("");
        $("#tabstrip").hide();
        ResetDetails();
        $("#btnSaveToNext").hide();
        $("#btnSave").hide();

    });
    var subprocess = $(obj).attr("process") != undefined ? $(obj).attr("process").toUpperCase() : ""; //
    var subprocesssno = $(obj).attr("subprocesssno") != undefined ? $(obj).attr("subprocesssno").toUpperCase() : ""; //
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    //var clickedRowIndex = $(obj).closest("tr").index();
    //var closestLockedTr = $(obj).closest("div.k-grid").find("div.k-grid-content-locked").find("tr:eq(" + clickedRowIndex.toString() + ")");
    isSaveAndNext = "0";

    var awbNoIndex = 0;
    var awbSNoIndex = 0;
    var awbDateIndex = 0;
    var pcsIndex = 0;
    var chwtIndex = 0;
    var originIndex = 0;
    var destIndex = 0;
    var flightNoIndex = 0;
    var flightDateIndex = 0;
    var commodityIndex = 0;
    var accpcsindex = 0;
    var accgrwtindex = 0;
    var accvolwtindex = 0;
    var awbodindex = 0;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    var trAWBReferenceNumberIndex = 0
    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    awbodindex = trLocked.find("th[data-field='AWBOD']").index();
    originIndex = trLocked.find("th[data-field='Origin']").index();
    destIndex = trLocked.find("th[data-field='Destination']").index();
    awborigin = originIndex;
    awbSNoIndex = 0;
    awbDateIndex = trRow.find("th[data-field='AWBDate']").index();
    pcsIndex = trRow.find("th[data-field='Pcs']").index();
    chwtIndex = trRow.find("th[data-field='ChWt']").index();
    flightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    flightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    commodityIndex = trRow.find("th[data-field='CommodityCode']").index();
    accpcsindex = trRow.find("th[data-field='AccPcs']").index();
    accgrwtindex = trRow.find("th[data-field='AccGrWt']").index();
    accvolwtindex = trRow.find("th[data-field='AccVolWt']").index();
    trAWBReferenceNumberIndex = trRow.find("th[data-field='AWBReferenceNumber']").index();

    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();
    currentawbno = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    AWBReferenceNumber = closestTr.find("td:eq(" + trAWBReferenceNumberIndex + ")").text();
    var FBLWtIndex = 0;
    var FWBWtIndex = 0;
    var RCSWtIndex = 0;
    FBLWtIndex = trRow.find("th[data-field='FBLWt']").index();
    FWBWtIndex = trRow.find("th[data-field='FWBWt']").index();
    RCSWtIndex = trRow.find("th[data-field='RCSWt']").index();
    $("#tdFBLwt").text(closestTr.find("td:eq(" + FBLWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FBLWtIndex + ")").text());
    $("#tdFWBwt").text(closestTr.find("td:eq(" + FWBWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FWBWtIndex + ")").text());
    $("#tdRCSwt").text(closestTr.find("td:eq(" + RCSWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + RCSWtIndex + ")").text());

    $("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    $("#tdOD").text(closestTr.find("td:eq(" + awbodindex + ")").text()) //text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());

    $("#hdnAWBSNo").val(currentawbsno);
    $("#hdnAccPcs").val(accpcs);
    $("#hdnAccGrWt").val(accgrwt);
    $("#hdnAccVolWt").val(accvolwt);

    $("#tdAWBDate").text(closestTr.find("td:eq(" + awbDateIndex + ")").text());
    $("#tdFlightNo").text(closestTr.find("td:eq(" + flightNoIndex + ")").text());
    $("#tdFlightDate").text(closestTr.find("td:eq(" + flightDateIndex + ")").text() == "null" ? "" : closestTr.find("td:eq(" + flightDateIndex + ")").text());
    $("#tdCommodity").text(closestTr.find("td:eq(" + commodityIndex + ")").text());
    $("#tdPcs").text(closestTr.find("td:eq(" + pcsIndex + ")").text());
    $("#tdChWt").text(closestTr.find("td:eq(" + chwtIndex + ")").text());

    awbNoIndex = trRow.find("th[data-field='AWBNo']").index();
    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    $("#tabstrip").kendoTabStrip();
    $("#btnSave").hide();
    $("#btnSaveToNext").hide();
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

}

function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
    $("#IdAWBPrint").css("display", "");
    $("#IdAcptNote").css("display", "");
    $("#IdEDINote").css("display", "");
    $("#ulTab").hide();

    $("#tabstrip").html(rpl);

    if (subprocess.toUpperCase() == "RESERVATION") {
        //$("#tabstrip").html(rpl);
        $("#tabstrip").kendoTabStrip();
        $("#ulTab").show();

        if (isSaveAndNext == "1") {
            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
            isSaveAndNext = "0";
        } else {
            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
        }
        $('#tabstrip ul:first li:eq(0) a').text("AIR WAYBILL");
        $('#tabstrip ul:first li:eq(1) a').text("RATE");
        $('#tabstrip ul:first li:eq(2) a').text("CUSTOMER INFORMATION");
        $('#tabstrip ul:first li:eq(3) a').text("CUSTOMS");
        $('#tabstrip ul:first li:eq(4) a').text("OTHER INFO");

        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').hide();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').show();
        $("div[id=divareaTrans_shipment_tfwbshctemp]").remove();
        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("RESERVATION", "divDetail", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick, subprocesssno);
        });
        setTimeout(function () { $("body").append("<style>ul.k-tabstrip-items li.k-state-active{border-bottom:3px solid red;}</style>") }, 100);
        //if (isSaveAndNext != "1") {
        //    $('#tabstrip ul:first li:eq(0) a').click();
        //}
        PageRightsCheckTRANSITFWB()
    }

    if (subprocess.toUpperCase() == "DIMENSION") {
        $("#tabstrip").kendoTabStrip();
        $("#ulTab").show();
        $('#tabstrip ul:first li:eq(0) a').text("BULK Information");
        $('#tabstrip ul:first li:eq(1) a').text("ULD Information");
        $('#tabstrip ul:first li:eq(2) a').text("ULD Details");
        $('#tabstrip ul:first li:eq(3) a').text("");
        $('#tabstrip ul:first li:eq(4) a').text("");

        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').hide();
        $('#tabstrip ul:first li:eq(4) a').hide();

        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("DIMENSION", "divDetail", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("ULDDimensionInfo", "divDetailSHC", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("ULDDimensionDetails", "divTab3", isdblclick, subprocesssno);
        });
    }


    if (subprocess.toUpperCase() == "HOUSEWAYBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/HOUSEWAYBILL/" + currentawbsno);

        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "SHIPPINGBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/SHIPPINGBILL/" + currentawbsno);
        // bind
        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        $('#tabstrip ul:first li:eq(0) a').text("General");
        $('#tabstrip ul:first li:eq(1) a').text("SPHC Wise");
        $('#tabstrip ul:first li:eq(2) a').hide();
        $('#tabstrip ul:first li:eq(3) a').hide();
        $('#tabstrip ul:first li:eq(4) a').hide();

        $("#divXRAY").show();
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/CHECKLIST/" + currentawbsno);
        cfi.ShowIndexView("divDetailSHC", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/CHECKLIST_SPHC/" + currentawbsno);
        $("#ulTab").show();
        //SAVE SECTION
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick, subprocesssno);
    }

    else {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, "divDetail", isdblclick, subprocesssno);
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

    }
}

function ShowProcessDetailsNew(subprocess, divID, isdblclick, subprocesssno) {
    //if ($("#" + divID).html() != "") {

    //    $("div[id$='divareaTrans_shipment_shipmentdimension']").find("[id^='areaTrans_shipment_shipmentdimension']").each(function (row, tr) {
    //        $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
    //    });
    //    $("div[id$='areaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function (row, tr) {
    //        $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
    //        $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
    //    });

    //    return
    //}
    if (subprocess == "RATE") {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divDetailSHC').html('');
                $('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");
                $("#divDetailSHC").append(RatePrint + "</br>");
                $('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                $('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                $('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");
                $("#divDetailSHC").append(result);
                if (result != undefined || result != "") {

                    //$('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                    //$('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                    //$('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                    //$('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");


                    GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, divID, isdblclick, subprocesssno);
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
    }

    else {

        $.ajax({
            url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#" + divID).html(result);
                if (result != undefined || result != "") {
                    //GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, divID, isdblclick, subprocesssno);
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
    }


}

function MarkSelected(obj) {
    var trRow = $(obj).closest("tr");
    trRow.find("input[type='radio']").each(function () {
        $(this).prop('checked', false);
    });
    $(obj).prop('checked', true);
}

$(document).ready(function () {


});
function ExtraCondition(textId) {

    var filterShipperCity = cfi.getFilter("AND");
    var CommodityFilter = cfi.getFilter("AND");
    var CommoditySubGroupFilter = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var filterAgent = cfi.getFilter("AND");
    //---
    var LocaFilter = cfi.getFilter("AND");
    //---
    var FlightOriginFilter = cfi.getFilter("AND");
    var FlightDestFilter = cfi.getFilter("AND");

    var SPHCFilter = cfi.getFilter("AND");
    var SPHCDGRFilter = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");

    var filterNotifyCity = cfi.getFilter("AND");
    var filterSLINo = cfi.getFilter("AND");

    var filterUnNo = cfi.getFilter("AND");
    var filterShippingName = cfi.getFilter("AND");
    var filterSubRisk = cfi.getFilter("AND");
    var filterPakagingGroup = cfi.getFilter("AND");
    var filterunitDGR = cfi.getFilter("AND");
    var filterPackingInst = cfi.getFilter("AND");
    var filterErg = cfi.getFilter("AND");
    var SHCSubGrioupFilter = cfi.getFilter("AND");
    var SearchFlightFilter = cfi.getFilter("AND");



    if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");

        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    if (textId.indexOf("Text_Commodity") >= 0) {
        if (parseInt($("#Text_SubGroupCommodity").data("kendoAutoComplete").key() || "0") > 0) {
            var _CommodityFilter = cfi.getFilter("AND");
            cfi.setFilter(_CommodityFilter, "SubGroupSNo", "eq", $("#Text_SubGroupCommodity").data("kendoAutoComplete").key());
            CommodityFilter = cfi.autoCompleteFilter(_CommodityFilter);
            return CommodityFilter;
        }
    }
    if (textId.indexOf("Text_SubGroupCommodity") >= 0) {
        if (parseInt($("#Text_Commodity").data("kendoAutoComplete").key() || "0") > 0) {
            var _CommoditySubGroupFilter = cfi.getFilter("AND");
            cfi.setFilter(_CommoditySubGroupFilter, "CommoditySNo", "eq", $("#Text_Commodity").data("kendoAutoComplete").key());
            CommoditySubGroupFilter = cfi.autoCompleteFilter(_CommoditySubGroupFilter);
            return CommoditySubGroupFilter;
        }
    }


    if (textId.indexOf("Text_Notify_City") >= 0) {
        var filterNCity = cfi.getFilter("AND");

        cfi.setFilter(filterNCity, "CountrySNo", "eq", $("#Text_Notify_CountryCode").data("kendoAutoComplete").key());
        filterNotifyCity = cfi.autoCompleteFilter(filterNCity);
        return filterNotifyCity;
    }

    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");

        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    else if (textId.indexOf("Text_IssuingAgent") >= 0) {
        var filterWAgent = cfi.getFilter("AND");

        cfi.setFilter(filterWAgent, "AirportSno", "eq", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        filterAgent = cfi.autoCompleteFilter(filterWAgent);
        return filterAgent;
    }//ChargeName

    //----
    else if (textId.indexOf("Text_FlightNo") >= 0) {
        var FlightOriginwFilter = cfi.getFilter("AND");
        cfi.setFilter(FlightOriginwFilter, "OriginAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(FlightOriginwFilter, "DestinationAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(FlightOriginwFilter, "FlightDate", "eq", cfi.CfiDate($("#" + textId).closest('tr').find("[id^='FlightDate']").attr('id')));
        cfi.setFilter(FlightOriginwFilter, "IsDeparted", "eq", 0);
        cfi.setFilter(FlightOriginwFilter, "IsNILManifested", "eq", 0);
        FlightOriginFilter = cfi.autoCompleteFilter(FlightOriginwFilter);

        return FlightOriginFilter;
    }
    else if (textId.indexOf("Text_searchFlightNo") >= 0) {
        var SearchFlightFltr = cfi.getFilter("AND");

        if ($("#" + textId).closest('tr').find("input[id^='Text_searchOriginCity']").data("kendoAutoComplete").key() != "") {
            cfi.setFilter(SearchFlightFltr, "OriginCity", "eq", $("#" + textId).closest('tr').find("input[id^='Text_searchOriginCity']").data("kendoAutoComplete").key());
        }
        if ($("#" + textId).closest('tr').find("input[id^='Text_searchDestinationCity']").data("kendoAutoComplete").key() != "") {
            cfi.setFilter(SearchFlightFltr, "DestinationCity", "eq", $("#" + textId).closest('tr').find("input[id^='Text_searchDestinationCity']").data("kendoAutoComplete").key());
        }
        if (cfi.CfiDate($("#" + textId).closest('tr').find("[id^='searchFlightDate']").attr('id')) != "") {
            cfi.setFilter(SearchFlightFltr, "FlightDate", "eq", cfi.CfiDate($("#" + textId).closest('tr').find("[id^='searchFlightDate']").attr('id')));
        }
        cfi.setFilter(SearchFlightFltr, "IsDeparted", "eq", 0);
        SearchFlightFilter = cfi.autoCompleteFilter(SearchFlightFltr);

        return SearchFlightFilter;
    }
    //---
    else if (textId.indexOf("Text_Location") >= 0) {

        //var LocaWFilter = cfi.getFilter("AND");
        //var Origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        //cfi.setFilter(LocaWFilter, "WarehouseCity", "eq", Origin);
        //LocaFilter = cfi.autoCompleteFilter(LocaWFilter);
        //return LocaFilter;
    }
    //---
    else if (textId.indexOf("Text_SPHC") >= 0) {
        var filterSPHC1 = cfi.getFilter("AND");
        cfi.setFilter(filterSPHC1, "IsDGR", "eq", "1");
        SPHCFilter = cfi.autoCompleteFilter(filterSPHC1);
        return SPHCFilter;
    }
    else if (textId.indexOf("Text_SpecialHandlingCode") >= 0) {
        var filterSPHC2 = cfi.getFilter("AND");
        //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");
        cfi.setFilter(filterSPHC2, "SNo", "notin", $("#SpecialHandlingCode").val());
        SPHCDGRFilter = cfi.autoCompleteFilter(filterSPHC2);

        return SPHCDGRFilter;
    }

    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        var SHIPPER_AccountNo2 = cfi.getFilter("AND");
        cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
        ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
        return ShipperAccountFilter;
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        var ConsigneeFilter2 = cfi.getFilter("AND");
        cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
        ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
        return ConsigneeFilter;
    }

    else if (textId.indexOf("Text_SLINo") >= 0) {
        var filterSLINo2 = cfi.getFilter("AND");
        cfi.setFilter(filterSLINo2, "AWBSNo", "eq", currentawbsno);
        filterSLINo = cfi.autoCompleteFilter(filterSLINo2);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_UnNo") >= 0) {
        var _filterUnNo = cfi.getFilter("AND");
        cfi.setFilter(_filterUnNo, "UNNumber", "neq", '');
        //if ($("#" + textId).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "" && $("#" + textId).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "0") {
        //    cfi.setFilter(_filterUnNo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key());
        //}
        filterUnNo = cfi.autoCompleteFilter(_filterUnNo);
        return filterUnNo;
    }
    //else if (textId.indexOf("Text_ShippingName") >= 0) {
    //    var _filterShippingName = cfi.getFilter("AND");
    //    cfi.setFilter(_filterShippingName, "ColumnSearch", "neq", '');
    //    if ($("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key() != "") {
    //        cfi.setFilter(_filterShippingName, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
    //    }
    //    filterShippingName = cfi.autoCompleteFilter(_filterShippingName);
    //    return filterShippingName;
    //}
    else if (textId.indexOf("Text_SubRisk") >= 0) {
        var _filterSubRisk = cfi.getFilter("AND");
        cfi.setFilter(_filterSubRisk, "SubRisk", "neq", '');
        cfi.setFilter(_filterSubRisk, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSubRisk = cfi.autoCompleteFilter(_filterSubRisk);
        return filterSubRisk;
    }
    else if (textId.indexOf("Text_Class") >= 0) {
        var _filterSLINo = cfi.getFilter("AND");
        cfi.setFilter(_filterSLINo, "ClassDivSub", "neq", '');
        cfi.setFilter(_filterSLINo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSLINo = cfi.autoCompleteFilter(_filterSLINo);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_PackingGroup") >= 0) {
        var _filterPakagingGroup = cfi.getFilter("AND");
        cfi.setFilter(_filterPakagingGroup, "PackingGroup", "neq", '');
        cfi.setFilter(_filterPakagingGroup, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        filterPakagingGroup = cfi.autoCompleteFilter(_filterPakagingGroup);
        return filterPakagingGroup;
    }

    else if (textId.indexOf("Text_PackingInst") >= 0) {
        var _filterPackingInst = cfi.getFilter("AND");
        cfi.setFilter(_filterPackingInst, "PackingInst", "neq", '');
        cfi.setFilter(_filterPackingInst, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        if (($("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").key() || 0) != 0) {
            cfi.setFilter(_filterPackingInst, "PackingGroup", "eq", $("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").value());
        }
        filterPackingInst = cfi.autoCompleteFilter(_filterPackingInst);
        return filterPackingInst;
    }
    else if (textId.indexOf("Text_ERG") >= 0) {
        var _filterErg = cfi.getFilter("AND");
        cfi.setFilter(_filterErg, "ERGN", "neq", '');
        cfi.setFilter(_filterErg, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterErg = cfi.autoCompleteFilter(_filterErg);
        return filterErg;
    }
    else if (textId.indexOf("Text_SubGroup_") >= 0) {
        var _SHCSubgrpErg = cfi.getFilter("AND");
        cfi.setFilter(_SHCSubgrpErg, "SPHCSNo", "eq", $("#" + textId).closest('tr').find("input[id^='SHCSNo_']").val());
        SHCSubGrioupFilter = cfi.autoCompleteFilter(_SHCSubgrpErg);
        return SHCSubGrioupFilter;
    }
    else if (textId.indexOf("Text_ShipmentDestination") >= 0) {
        var _filterDestination = cfi.getFilter("AND");
        cfi.setFilter(_filterDestination, "SNo", "notin", $("#ShipmentOrigin").val());
        cfi.setFilter(_filterDestination, "SNo", "notin", userContext.AirportSNo);
        SHCSubGrioupFilter = cfi.autoCompleteFilter(_filterDestination);
        return SHCSubGrioupFilter;
    }
}

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
    $("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);
    $("#trAmmendment").hide();
    $("#trAmmendmentCharge").hide();
    $("#btnSave").closest("td").css("width", "");

    if (subprocess.toUpperCase() == "CUSTOMER") {
        BindCustomerInfo();
        UserSubProcessRights("divTab3", subprocesssno);
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
            if (userContext.SpecialRights.LAC == true) {
                $("#trAmmendmentCharge").show();
            }
        } else {
            $("#trAmmendment").hide();
            $("#trAmmendmentCharge").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#chkAmmendMentCharge").prop("checked", false);
                        $("#ulTab li").eq(2).css("background-color", TabColor);
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(3);
                        ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        BindDimensionEvents();
        UserSubProcessRights("divDetail", subprocesssno);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    ShipmentSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                    ShowProcessDetailsNew("ULDDIMENSIONINFO", "divDetailSHC", isdblclick, subprocesssno);
                }

            } else {
                return false;
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;

    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONINFO") {
        BindULDDimensionInfo();
        UserSubProcessRights("divDetailSHC", subprocesssno);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    ShipmentSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                    ShowProcessDetailsNew("ULDDIMENSIONDETAILS", "divTab3", isdblclick, subprocesssno);
                }

            } else {
                return false;
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONDETAILS") {
        BindULDDimensionDetails();
        UserSubProcessRights("divTab3", subprocesssno);

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    ShipmentSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
                    ShowProcessDetailsNew("DIMENSION", "divDetail", isdblclick, subprocesssno);
                }

            } else {
                return false;
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;
    }
    else if (subprocess.toUpperCase() == "RATE") {

        BindDimensionEventsNew();
        BindDimensionEventsNewULD();
        BindAWBOtherCharge();
        BindAWBRate();
        if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length <= 0) {
            SetAWBDefaultValues();
        }
        //-- Disable First Row Pieces and Delete Row Delete Button
        $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {
            if (i < 1) {
                $(row).find("input[id*='tblAWBRateDesription_NoOfPieces']").attr("disabled", 1);
                $(row).find("input[id*='tblAWBRateDesription_GrossWeight']").attr("disabled", 1);
                $(row).find("input[id*='tblAWBRateDesription_NatureOfGoods_']").attr("disabled", 1);
                $(row).find("input[id*='tblAWBRateDesription_ChargeAmount_']").attr("disabled", 1);
                $(row).find("[type='button'][id*='tblAWBRateDesription_Delete']").remove();
                if ($(row).find("[id^='tblAWBRateDesription_CommodityItemNumber_']").val() == 0) {
                    $(row).find("[id*='tblAWBRateDesription_CommodityItemNumber_']").val('');
                }
                if ($(row).find("[id^='tblAWBRateDesription_Charge_']").val() == 0) {
                    $(row).find("[id*='tblAWBRateDesription_Charge_']").val('');
                }
            }
        });
        CalculateRateTotal();
        UserSubProcessRights("divDetailSHC", subprocesssno);

        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
            if (userContext.SpecialRights.LAC == true) {
                $("#trAmmendmentCharge").show();
            }
        } else {
            $("#trAmmendment").hide();
            $("#trAmmendmentCharge").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#chkAmmendMentCharge").prop("checked", false);
                        $("#ulTab li").eq(1).css("background-color", TabColor);
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                        ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        BindAWBSummary(isdblclick);
        UserSubProcessRights("divTab5", subprocesssno);
        $("#btnSaveToNext").hide();
        $("#btnSave").closest("td").css("width", "130px");
        $("#btnSave").closest("td").attr("align", "right");

        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
            if (userContext.SpecialRights.LAC == true) {
                $("#trAmmendmentCharge").show();
            }
        } else {
            $("#trAmmendment").hide();
            $("#trAmmendmentCharge").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                        CleanUI();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#chkAmmendMentCharge").prop("checked", false);
                        $("#ulTab li").eq(4).css("background-color", TabColor);
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
                        ShowProcessDetailsNew("RESERVATION", "divDetail", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        BindHandlingInfoDetails();
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
            if (userContext.SpecialRights.LAC == true) {
                $("#trAmmendmentCharge").show();
            }
        } else {
            $("#trAmmendment").hide();
            $("#trAmmendmentCharge").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#chkAmmendMentCharge").prop("checked", false);
                        $("#ulTab li").eq(3).css("background-color", TabColor);
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(4);
                        ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;

    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        BindReservationSection();
        UserSubProcessRights("divDetail", subprocesssno);
        $("#btnSaveToNext").hide();
        $("#btnSave").hide();

        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
            if (userContext.SpecialRights.LAC == true) {
                $("#trAmmendmentCharge").show();
            }
        } else {
            $("#trAmmendment").hide();
            $("#trAmmendmentCharge").hide();
        }

        $("#btnSave").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_shipment_tfwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "") {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "0";
                    if (SaveFormData(subprocess)) {
                        //ShipmentSearch();
                        CleanUI();
                    }

                } else {
                    return false;
                }
            } else {
                if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "0";
                        if (SaveFormData(subprocess)) {
                            //ShipmentSearch();
                            CleanUI();
                        }

                    } else {
                        return false;
                    }
                } else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_shipment_tfwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "" > 0) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "1";
                    if (SaveFormData(subprocess)) {
                        //ShipmentSearch();
                        //CleanUI();
                        $("#chkAmmendMentCharge").prop("checked", false);
                        $("#ulTab li").eq(0).css("background-color", TabColor);
                        $('#tabstrip ul:first li:eq(1) a').click();
                    }

                } else {
                    return false;
                }
            } else {
                if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "1";
                        if (SaveFormData(subprocess)) {
                            FlightDateForGetRate = $("#divareaTrans_shipment_tfwbshipmentitinerary").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                            FlightNoForGetRate = $("#divareaTrans_shipment_tfwbshipmentitinerary").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                            $("#divDetailSHC").html("");
                            //ReloadSameGridPage("RATE");
                            $("#chkAmmendMentCharge").prop("checked", false);
                            $("#ulTab li").eq(0).css("background-color", TabColor);
                            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                            ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                        }

                    } else {
                        return false;
                    }
                } else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }

        });
        PageRightsCheckTRANSITFWB()
        return false;
    }
    if (subprocess.toUpperCase() != "PAYMENT") {
        var sectionId = "";
        if (parseInt(currentawbsno) > 0) {
            sectionId = "divDetail";
        }
        else {
            sectionId = "divNewBooking";
        }
        cfi.ValidateSection(sectionId);
        //SAVE SECTION
        $("#btnSave").unbind("click").bind("click", function () {
            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "AWB No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                }
            }
            else {
                return false
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var saveflag = false;

            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "AWB No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    saveflag = SaveFormData(subprocess);
                }
            }
            else {
                saveflag = false
            }
            if (saveflag) {
                ShipmentSearch();
                for (var i = 0; i < processList.length; i++) {
                    if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                        if (currentawbsno > 0) {
                            currentprocess = processList[i + 1].value;
                            ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                        }
                        else {
                            CleanUI();
                            cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                        }
                        return;
                    }
                }
            }
        });
        PageRightsCheckTRANSITFWB()
    }

}

function getNonObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getNonObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}


function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CountryCode,CountryName", "TransitFWB_OCICountryCode", null, "contains");

    });
    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "InformationCode,Description", "TransitFWB_InfoType", null, "contains");
    });
    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CustomsCode,Description", "TransitFWB_CSControlInfoIdentifire", null, "contains");

    });
}
function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_tfwbshipmentocitrans']").find("[id^='areaTrans_shipment_tfwbshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "TrasitFWB_Country");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "TrasitFWB_InfoType");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "TrasitFWB_CSControlInfoIdentifire");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}
function BindHandlingInfoDetails() {
    cfi.AutoCompleteV2("CountryCode", "CountryCode,CountryName", "TransitFWB_OCICountryCode", null, "contains");
    cfi.AutoCompleteV2("InfoType", "InformationCode,Description", "TransitFWB_InfoType", null, "contains");
    cfi.AutoCompleteV2("CSControlInfoIdentifire", "CustomsCode,Description", "TransitFWB_CSControlInfoIdentifire", null, "contains");

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetTransitOSIInfoAndHandlingMessage?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var osiData = jQuery.parseJSON(result);
            var osiInfo = osiData.Table0;
            var handlingArray = osiData.Table1;
            var osiTransInfo = osiData.Table2;

            var ocitransInfo = osiData.Table3;


            cfi.makeTrans("shipment_tfwbshipmentositrans", null, null, null, null, null, osiTransInfo, 2);//added by Manoj Kumar
            cfi.makeTrans("shipment_tfwbshipmentocitrans", null, null, BindCountryCodeAutoComplete, ReBindCountryCodeAutoComplete, null, ocitransInfo);//added by Manoj Kumar

        },
        error: {

        }
    });
}

function BindCustomerInfo() {

    cfi.AutoCompleteV2("SHIPPER_AccountNo", "CustomerNo", "TransitFWB_SHIPPER_AccountNo", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);




    cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "TransitFWB_SHIPPER_CountryCode", null, "contains");


    cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "TransitFWB_City", null, "contains");



    cfi.AutoCompleteV2("CONSIGNEE_AccountNo", "CustomerNo", "TransitFWB_CONSIGNEE_AccountNo", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);



    cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "TransitFWB_SHIPPER_CountryCode", null, "contains");

    cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "TransitFWB_City", null, "contains");

    cfi.AutoCompleteV2("Notify_CountryCode", "CountryCode,CountryName", "TransitFWB_SHIPPER_CountryCode", null, "contains");

    cfi.AutoCompleteV2("Notify_City", "CityCode,CityName", "TransitFWB_City", null, "contains");

    CheckContactNo("SHIPPER_MobileNo");
    CheckSpaceInString("SHIPPER_MobileNo2");
    CheckContactNo("SHipper_Fax");

    CheckContactNo("CONSIGNEE_MobileNo");
    CheckSpaceInString("CONSIGNEE_MobileNo2");
    CheckContactNo("CONSIGNEE_Fax");

    CheckContactNo("Notify_MobileNo");
    CheckSpaceInString("Notify_MobileNo2");
    CheckContactNo("Notify_Fax");

    AllowedSpecialChar("SHIPPER_Name");
    AllowedSpecialChar("SHIPPER_Name2");
    AllowedSpecialChar("SHIPPER_Street");
    AllowedSpecialChar("SHIPPER_Street2");
    AllowedSpecialChar("SHIPPER_TownLocation");
    AllowedSpecialChar("SHIPPER_State");

    AllowedSpecialChar("CONSIGNEE_AccountNoName");
    AllowedSpecialChar("CONSIGNEE_AccountNoName2");
    AllowedSpecialChar("CONSIGNEE_Street");
    AllowedSpecialChar("CONSIGNEE_Street2");
    AllowedSpecialChar("CONSIGNEE_TownLocation");
    AllowedSpecialChar("CONSIGNEE_State");

    //-- Agent fields
    AllowedSpecialChar("AGENT_AccountNo");
    CheckContactNo("AGENT_IATACODE");
    $("#AGENT_Name").attr("readonly", true);
    CheckContactNo("AGENT_IATACASSADDRESS");
    AllowedSpecialChar("AGENT_PLACE");

    AllowedSpecialChar("Notify_Name");
    AllowedSpecialChar("Notify_Name2");
    AllowedSpecialChar("Notify_Address");
    AllowedSpecialChar("Notify_Address2");
    AllowedSpecialChar("Notify_State");
    AllowedSpecialChar("Notify_Place");

    $("#chkShipper").attr("title", "Select to add in Participant as Shipper");
    $("#chkconsignee").attr("title", "Select to add in Participant as Consignee");
    $("#chkShipper").livetooltip();
    $("#chkconsignee").livetooltip();

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetTransitShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            var agentData = customerData.Table2;
            var notifyData = customerData.Table3;
            var nominyData = customerData.Table4;

            if (shipperData.length > 0) {
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                if (shipperData[0].ShipperAccountNo != "") {
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                    $("#chkShipper").attr('disabled', true);
                    $("#chkShipper").removeAttr("title");
                }
                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                $("#SHIPPER_State").val(shipperData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                $("#SHipper_Fax").val(shipperData[0].Fax);
            }
            if (consigneeData.length > 0) {
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                if (consigneeData[0].ConsigneeAccountNo != "") {
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                    $("#chkconsignee").attr('disabled', true);
                    $("#chkconsignee").removeAttr("title");
                }
                $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
            }
            if (agentData.length > 0) {
                $('#AGENT_AccountNo').val(agentData[0].AccountNo.toUpperCase());
                //$('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo.toUpperCase());
                $('#AGENT_Participant').val(agentData[0].Participant.toUpperCase());
                $('span[id=AGENT_Participant]').text(agentData[0].Participant.toUpperCase());
                $('#AGENT_IATACODE').val(agentData[0].IATANo.toUpperCase());
                //$('span[id=AGENT_IATACODE]').text(agentData[0].IATANo.toUpperCase());
                $('#AGENT_Name').val(agentData[0].AgentName.toUpperCase());
                //$('span[id=AGENT_Name]').text(agentData[0].AgentName.toUpperCase());
                $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress.toUpperCase());
                //$('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress.toUpperCase());
                $('#AGENT_PLACE').val(agentData[0].Location.toUpperCase());
                //$('span[id=AGENT_PLACE]').text(agentData[0].Location.toUpperCase());
            }
            if (notifyData.length > 0) {
                $("#Notify_Name").val(notifyData[0].CustomerName);
                $("#Notify_Name2").val(notifyData[0].CustomerName2);
                if (notifyData[0].CountrySno > 0) {
                    $("#Text_Notify_CountryCode").data("kendoAutoComplete").setDefaultValue(notifyData[0].CountrySno, notifyData[0].CountryCode + '-' + notifyData[0].CountryName);
                }
                if (notifyData[0].CitySno > 0) {
                    $("#Text_Notify_City").data("kendoAutoComplete").setDefaultValue(notifyData[0].CitySno, notifyData[0].CityCode + '-' + notifyData[0].CityName);
                }
                $("#Notify_MobileNo").val(notifyData[0].Phone);
                $("#Notify_MobileNo2").val(notifyData[0].Phone2);
                $("#Notify_Address").val(notifyData[0].Street);
                $("#Notify_Address2").val(notifyData[0].Street2);
                $("#Notify_State").val(notifyData[0].State);
                $("#Notify_Place").val(notifyData[0].Location);
                $("#Notify_PostalCode").val(notifyData[0].PostalCode);
                $("#Notify_Fax").val(notifyData[0].Fax);
            }
            if (nominyData.length > 0) {
                $('#Nominate_Name').val(nominyData[0].NOMName);
                $('#Nominate_Place').val(nominyData[0].NOMPlace);
            }

            $("div[id='__divcustomer__']").find(":input").css("text-transform", "uppercase")

        },
        error: {

        }
    });

}

function CheckContactNo(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}

function CheckSpaceInString(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[a-zA-Z0-9]+$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}
function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if (UserTyp == "S") {
            $("#chkShipper").prop('checked', false);
            $("#chkShipper").attr('disabled', true);
            $("#chkShipper").removeAttr("title");
        }
        if (UserTyp == "C") {
            $("#chkconsignee").prop('checked', false);
            $("#chkconsignee").attr('disabled', true);
            $("#chkconsignee").removeAttr("title");
        }

        $.ajax({
            url: "Services/Shipment/FWBService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperConsigneeData[0].Name2);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperConsigneeData[0].Address2);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperConsigneeData[0].Fax);
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(shipperConsigneeData[0].Name2);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(shipperConsigneeData[0].Address2);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Name2").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_Street2").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#SHIPPER_MobileNo2").val('');
                        $("#SHIPPER_Email").val('');
                        $("#SHipper_Fax").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_AccountNoName2").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_Street2").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_MobileNo2").val('');
                        $("#CONSIGNEE_Email").val('');
                        $("#CONSIGNEE_Fax").val('');
                    }
                }

            },
            error: {

            }
        });
    } else {
        if (UserTyp == "S") {
            $("#chkShipper").removeAttr('disabled');
            $("#chkShipper").attr("title", "Select to add in Participant as Shipper");

            $("#SHIPPER_Name").val('');
            $("#SHIPPER_Name2").val('');
            $("#SHIPPER_Street").val('');
            $("#SHIPPER_Street2").val('');
            $("#SHIPPER_TownLocation").val('');
            $("#SHIPPER_State").val('');
            $("#SHIPPER_PostalCode").val('');
            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#SHIPPER_MobileNo").val('');
            $("#SHIPPER_MobileNo2").val('');
            $("#SHIPPER_Email").val('');
            $("#SHipper_Fax").val('');

        } else if (UserTyp == "C") {
            $("#chkconsignee").removeAttr('disabled');
            $("#chkconsignee").attr("title", "Select to add in Participant as Consignee");

            $("#CONSIGNEE_AccountNoName").val('');
            $("#CONSIGNEE_AccountNoName2").val('');
            $("#CONSIGNEE_Street").val('');
            $("#CONSIGNEE_Street2").val('');
            $("#CONSIGNEE_TownLocation").val('');
            $("#CONSIGNEE_State").val('');
            $("#CONSIGNEE_PostalCode").val('');
            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#CONSIGNEE_MobileNo").val('');
            $("#CONSIGNEE_MobileNo2").val('');
            $("#CONSIGNEE_Email").val('');
            $("#CONSIGNEE_Fax").val('');
        }
    }

}

function BindReservationSection() {

    cfi.AutoCompleteV2("Product", "ProductName", "TransitFWB_ProductName", null, "contains");


    cfi.AutoCompleteV2("Commodity", "CommodityCode", "TransitFWB_Commodity", null, "contains");

    cfi.AutoCompleteV2("ShipmentOrigin", "AirportCode,AirportName", "TransitFWB_ShipmentOrigin", null, "contains");

    cfi.AutoCompleteV2("ShipmentDestination", "AirportCode,AirportName", "TransitFWB_ShipmentDestination", null, "contains");



    AllowedSpecialChar("IssuingAgent");
    $("#IssuingAgent").css("text-transform", "uppercase");


    cfi.AutoCompleteV2("SpecialHandlingCode", "CODE,Description", "TransitFWB_SpecialHandlingCode", null, "contains", ",", null, null, null, GetDGRDetails, true);
    cfi.AutoCompleteV2("buptype", "Description", "TransitFWB_buptype", null, "contains");


    cfi.AutoCompleteV2("densitygroup", "GroupName", "TransitFWB_densitygroup", null, "contains");

    cfi.AutoCompleteV2("SubGroupCommodity", "SubGroupName", "TransitFWB_AutoSubGroupCommodity", null, "contains");

    cfi.AutoCompleteV2("CarrierCode", "CarrierCode", "TransitFWB_CarrierCode", null, "contains");

    $("#AWBDate").data("kendoDatePicker").value(new Date());

    $('#AWBDate').prop('readonly', true);
    $('#AWBDate').parent().css('width', '100px');
    $('#chkFWBAmmendMent').prop('checked', false);
    //$("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
    //    cfi.PopUp("divareaTrans_shipment_fwbshipmentclasssphc", "SPHC");
    //});
    $("#NoofHouse").attr('readonly', 'true');
    tblhtml = $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("table").html();
    $("div[id$='divareaTrans_shipment_shipmentSHCSubGroup']").remove();
    $("div[id$='divDetail']").append(NogDiv);
    $("div[id$='divDetail']").append(SubGroupDiv);

    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);

    // Hide Fields
    $("span[id='spnProduct']").hide();
    $("span[id='spnProduct']").closest("td").removeAttr("title");
    $("span[id='spnProduct']").closest("td").find("font").remove();
    $("input[id='Product']").closest("td").find("span:first").hide();
    $("input[id='Text_Product']").removeAttr("data-valid");

    $("span[id='spnSubGroupCommodity']").hide();
    $("input[id='SubGroupCommodity']").closest("td").find("span:first").hide();
    $("span[id='spnSubGroupCommodity']").closest("td").removeAttr("title");

    //$("span[id='spnCommodity']").hide();
    //$("span[id='spnCommodity']").closest("td").removeAttr("title");
    //$("input[id='Commodity']").closest("td").find("span:first").hide();
    $("input[id='Text_Commodity']").closest("span").css("display", "none");
    $("div[id^='__divreservation__']").find("td:contains('DGR Pieces')").attr("title", "DGR Pieces")

    cfi.AutoCompleteV2("NatureofGoods", "CommodityCode", "TransitFWB_NatureofGoods", ShowOtherNog, "contains");



    $("#Text_NatureofGoods").closest("td").append('</br><input type="text" class="transSection k-input" name="OtherNOG" id="OtherNOG" style="width: 170px; text-transform: uppercase;" tabindex="16" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off">')
    $("#OtherNOG").hide();

    $("input[id='Pieces']").unbind("blur").bind("blur", function () {
        //comparePcsValue(this);
    });

    $("#ChargeableWt").unbind("blur").bind("blur", function () {
        compareGrossVolValue();
    });

    $("#GrossWt").live("blur", function () {
        //if (compareGrossValue(this))
        CalculateShipmentChWt(this);
    });

    $("#CBM").live("blur", function () {
        //if (compareVolValue(this))                
        CalculateShipmentChWt(this);
    });

    $("#VolumeWt").unbind("blur").bind("blur", function () {
        //if (compareVolValue(this))
        CalculateShipmentCBM();
    });

    $("#GrossWt").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });
    $("#VolumeWt").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });
    $("#ChargeableWt").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });
    $("#CBM").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    if (!$("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow")) {
        cfi.PopUpCreate("divareaTrans_shipment_shipmentSHCSubGroup", "SHC Sub Group Details", 800);
    }
    if (!$("#divareaTrans_shipment_tfwbshctemp").data("kendoWindow")) {
        cfi.PopUpCreate("divareaTrans_shipment_tfwbshctemp", "Temp Details", 550);
    }

    cfi.Numeric("txtDGRPieces", 0)

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetTransitAcceptanceInformation?AWBSNo=" + awbSNo + "&AWBReferenceNumber=" + AWBReferenceNumber, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table2;
            var itenData = fblData.Table1;
            var sphcArray2 = fblData.Table3;
            var HasDGRArray = fblData.Table4;
            var NOGData = fblData.Table8;
            var SHCSubGroupdata = fblData.Table9;
            ItenaryArray = itenData;
            var TabData = fblData.Table10;
            var TransRoutData = fblData.Table11;
            var SHCTempData = fblData.Table12;

            IsFWbComplete = fblData.Table5[0].Status == "True" ? true : false;
            IsFWBAmmendment = fblData.Table6[0].IsEnabled == "True" ? true : false;
            IsFlightExist = fblData.Table7[0].FlightExist == "1" ? true : false;
            IsAgentBUP = fblData.Table7[0].IsAgentBUP == "1" ? true : false;

            if (TabData.length > 0) {
                if (TabData[0].F != "") {
                    $("#ulTab li").eq(0).css("background-color", TabData[0].F);
                }
                if (TabData[0].R != "") {
                    $("#ulTab li").eq(1).css("background-color", TabData[0].R);
                }
                if (TabData[0].C != "") {
                    $("#ulTab li").eq(2).css("background-color", TabData[0].C);
                }
                if (TabData[0].H != "") {
                    $("#ulTab li").eq(3).css("background-color", TabData[0].H);
                }
                if (TabData[0].S != "") {
                    $("#ulTab li").eq(4).css("background-color", TabData[0].S);
                }
                TabColor = TabData[0].TABCOLOR;
            }

            var resItem;
            if (resData.length > 0) {
                resItem = resData[0];

                $("#Text_CarrierCode").data("kendoAutoComplete").setDefaultValue(resItem.AirlineSNo, resItem.CarrierCode);
                $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySNo, resItem.CommodityCode == "" ? "" : resItem.CommodityCode + '-' + resItem.CommodityDescription);
                $("#Text_SubGroupCommodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySubGroupSNo, resItem.SubGroupName);
                //$("#Pieces").data("kendoNumericTextBox").value(resItem.Pieces);
                $("#Pieces").val(resItem.AWBTotalPieces == 0 ? "" : resItem.AWBTotalPieces);
                $("#_tempPieces").val(resItem.AWBTotalPieces == 0 ? "" : resItem.AWBTotalPieces);

                if (resItem.AWBType == 1) {
                    $("input[type='radio'][data-radioval='AWB']").prop('checked', true)
                }
                else if (resItem.AWBType == 2) {
                    $("input[type='radio'][data-radioval='Courier']").prop('checked', true)
                }
                else if (resItem.AWBType == 3) {
                    $("input[type='radio'][data-radioval='CBV']").prop('checked', true)
                }

                //$("span[id='TotalPartPieces']").text("/ " + resItem.TotalPartPieces);
                //$("#TotalPartPieces").text("/ " + resItem.TotalPartPieces);
                //$("#GrossWt").data("kendoNumericTextBox").value(resItem.GrossWeight);
                $("#GrossWt").val(resItem.GrossWeight == 0 ? "" : resItem.GrossWeight);
                $("#_tempGrossWt").val(resItem.GrossWeight == 0 ? "" : resItem.GrossWeight);

                //$("#ChargeableWt").data("kendoNumericTextBox").value(resItem.ChargeableWeight);
                $("#ChargeableWt").val(resItem.ChargeableWeight == 0 ? "" : resItem.ChargeableWeight);
                $("#_tempChargeableWt").val(resItem.ChargeableWeight == 0 ? "" : resItem.ChargeableWeight);
                //$("#CBM").data("kendoNumericTextBox").value(resItem.CBM);
                $("#CBM").val(resItem.AWBVolume == 0 ? "" : resItem.AWBVolume);
                $("#_tempCBM").val(resItem.AWBVolume == 0 ? "" : resItem.AWBVolume);

                //$("#VolumeWt").data("kendoNumericTextBox").value(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#VolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3) == 0 ? "" : parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#_tempVolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3) == 0 ? "" : parseFloat(resItem.VolumeWeight || "0").toFixed(3));

                $("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#AWBNo").val(resItem.AWBNo);
                $("#AWBDate").data("kendoDatePicker").value(resItem.AWBDate);
                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName);
                $("#IssuingAgent").val(resItem.AgentName);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                $("#NoofHouse").val(resItem.NoOfHouse == 0 ? "" : resItem.NoOfHouse);
                $("#FlightDate").data("kendoDatePicker").value(resItem.FlightDate);
                $("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                $("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);
                //$("#NatureofGoods").val(resItem.NatureOfGoods);
                $("#Text_NatureofGoods").data("kendoAutoComplete").setDefaultValue(resItem.NatureOfGoodsSNo, resItem.Text_NatureOfGoodsSNo);
                if (resItem.NatureOfGoods != "") {
                    $("#OtherNOG").val(resItem.NatureOfGoods);
                    $("#OtherNOG").show()
                }
                $('#AWBDate').parent().css('width', '100px');

                if (resItem.IsBup == "False") {
                    $("#chkisBup").prop('checked', false);
                } else {
                    $("#chkisBup").prop('checked', true);
                }
                $("#Text_buptype").data("kendoAutoComplete").setDefaultValue(resItem.BupTypeSNo, resItem.BupType);
                $("#Text_densitygroup").data("kendoAutoComplete").setDefaultValue(resItem.DensityGroupSNo, resItem.DensityGroupName);

                $("#AWBNo").attr("disabled", "disabled");

                bkdgrwt = resItem.GrossWeight;
                bkdvolwt = resItem.CBM;
                bkdpcs = resItem.Pieces;

                if (sphcArray2.length > 0) {
                    if (sphcArray2[0].sphcsno != "0" && sphcArray2[0].sphcsno != "") {
                        cfi.BindMultiValue("SpecialHandlingCode", sphcArray2[0].text_specialhandlingcode, sphcArray2[0].sphcsno)
                        $("#SpecialHandlingCode").val(sphcArray2[0].sphcsno);
                    }
                }

                $("div[id^='divMultiSpecialHandlingCode']").css("overflow", "auto");
                $("div[id^='divMultiSpecialHandlingCode']").css("width", "15em");

                $("input[id='GrossWt']").unbind("blur").bind("blur", function () {

                });

                $("input[id='CBM']").unbind("blur").bind("blur", function () {
                    compareVolValue("V", this, accvolwt, resItem.VolumeWeight);
                });
                if (fblData.Table7[0].RequiredDGRPieces == 1) {
                    $("input[id*='txtDGRPieces']").removeAttr("disabled");
                    $("input[id^='txtDGRPieces']").attr("data-valid", "min[1],required").attr("data-valid-msg", "Enter DGR Pieces");
                } else {
                    $("#txtDGRPieces").val('');
                    $("#txtDGRPieces").val('');
                    $("input[id^='txtDGRPieces']").removeAttr("data-valid").removeAttr("data-valid-msg");
                    $("input[id*='txtDGRPieces']").attr("disabled", 1);
                }
                if (resItem.DGRPieces > 0) {
                    $("input[id*='txtDGRPieces']").val(resItem.DGRPieces);
                }
                if (resItem.DRYICEasRefrigerant == "False") {
                    $("#chkDryIce").prop('checked', false);
                } else {
                    $("#chkDryIce").prop('checked', true);
                }
            }


            $("div[id=divareaTrans_shipment_tfwbshipmentclasssphc]").not(':first').remove();
            $("div[id=divareaTrans_shipment_tfwbshipmentnog]").not(':first').remove();
            //-- Add seprate Save Button for DGR Detials
            $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc'] table >tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
            $("#btnSaveDGR").unbind("click").bind("click", function () {
                SaveDGRDetails();
            });

            // get val for autocomplete from dgr array to bind SPHC autocomp-lete
            if (HasDGRArray.length > 0) {
                DGRSPHC = [];
                for (i = 0; i < HasDGRArray.length; i++) {
                    var info = {
                        Key: HasDGRArray[i].SNo,
                        Text: HasDGRArray[i].Code
                    };
                    DGRSPHC.push(info);
                }
            }

            cfi.makeTrans("shipment_tfwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray, 8);
            $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("[id='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
                AllowedSpecialChar($(this).find("textarea[id^='DGRCommodity']").attr("id"));
                $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
                $(this).find("input[id^='SPHC']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                    }
                    else {
                        cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
                    }
                });
                $(this).find("input[id^='UnNo']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "UNNumber,ColumnSearch", "TransitFWB_UnNo", ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);


                    }
                });

                $(this).find("input[id^='Class']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "TransitFWB_ClassDivSub", null, "contains");

                    }
                });
                $(this).find("input[id^='SubRisk']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "TransitFWB_SubRisk", null, "contains");


                });
                $(this).find("input[id^='PackingGroup']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {

                        cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "TransitFWB_PackingGroup", GetPackingInst, "contains", null, null, null, null, null, null, null, true);

                    }
                });
                $(this).find("input[id^='Unit']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {

                        cfi.AutoCompleteV2($(this).attr("name"), "Unit", "TransitFWB_Unit", null, "contains");
                    }
                });
                $(this).find("input[id^='PackingInst']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {

                        cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "TransitFWB_PackingInst", GetMaxQty, "contains", null, null, null, null, null, null, null, true);


                    }
                });
                $(this).find("input[id^='ERG']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "TransitFWB_ERGN", null, "contains");
                    }
                });

                $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
                //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
                $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
            });

            if (HasDGRArray.length > 0) {
                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_shipment_tfwbshipmentclasssphc", "DGR Details", 1400);
                    $("div[id='divareaTrans_shipment_tfwbshipmentclasssphc']").find("input[id^='Text_SPHC']").attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
                    $("div[id='divareaTrans_shipment_tfwbshipmentclasssphc']").find("input[id^='Text_UnNo']").attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
                });

            }
            //$("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });

            $("div[id='divareaTrans_shipment_tfwbshipmentnog']").find("tr[id^='areaTrans_shipment_tfwbshipmentnog']").each(function (i, row) {
                cfi.AutoCompleteV2($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "TransitFWB_tfOtherNatureofGoods", EnableOtherNog, "contains");


                $(row).find("input[id^='Text_OtherNatureofGoods']").parent().parent().css('width', '200px');
                $(row).find("input[id^='NOG']").attr('disabled', 1);
                if (NOGData.length > 0) {
                    if (NOGData[i] != undefined) {
                        $("#" + $(row).find("input[id^='Text_OtherNatureofGoods']").attr("id")).data("kendoAutoComplete").setDefaultValue(NOGData[i].OtherNatureofGoods, NOGData[i].Text_OtherNatureofGoods);
                    }
                }
            });

            cfi.makeTrans("shipment_tfwbshipmentnog", null, null, null, null, null, NOGData);// Bind NOG Data
            $("a[id^='ahref_NOGDetails']").unbind("click").bind("click", function () {
                var Pieces = parseInt($("#Pieces").val() || "0");
                var GrsWt = parseFloat($("#GrossWt").val() || "0");
                //var NatureofGd = $("#NatureofGoods").val() || "";
                var NatureofGd = ($("#Text_NatureofGoods").data("kendoAutoComplete").key() || "0");
                if (Pieces == 0 || GrsWt == 0 || parseInt(NatureofGd) <= 0) {
                    jAlert("Enter Pieces, Gross weight and Nature of Goods Details.", "Warning - Nature of Goods Details");
                    return false;
                }
                if ((($("#Text_NatureofGoods").data("kendoAutoComplete").value() || "") == "OTHER") && ($("#OtherNOG").val() == "")) {
                    jAlert("Enter Other Nature of Goods Details.", "Warning - Nature of Goods Details");
                    return false;
                }
                if (!$("#divareaTrans_shipment_tfwbshipmentnog").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_shipment_tfwbshipmentnog", "Nature of Goods Details", 650);
                }
                else {
                    $("#divareaTrans_shipment_tfwbshipmentnog").data("kendoWindow").open();
                }

                var PcsRow = 0, WtRow = 0, NogRow = 0;
                $("div[id$='divareaTrans_shipment_tfwbshipmentnog']").find("[id^='areaTrans_shipment_tfwbshipmentnog']").each(function () {
                    if (parseInt(($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0)) > 0) {
                        PcsRow += 1;
                    }
                    if (parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0)) > 0) {
                        WtRow += 1;
                    }
                    if (($(this).find("input[id^='NOG']").val() != "")) {
                        NogRow += 1;
                    }
                });

                var FirstNogRow = $("div[id$='divareaTrans_shipment_tfwbshipmentnog']").find("[id='areaTrans_shipment_tfwbshipmentnog']:first");
                if (parseInt(PcsRow) > 0 || parseInt(WtRow) > 0 || parseInt(NogRow) > 0) { } else {
                    FirstNogRow.find("input[id*='Pieces']").val(Pieces);
                    FirstNogRow.find("input[id*='NogGrossWt']").val(GrsWt);
                    //FirstNogRow.find("input[id^='NOG']").val(NatureofGd);
                }
                var NogKey = $("#Text_NatureofGoods").data("kendoAutoComplete").key();
                var NogVal = $("#Text_NatureofGoods").data("kendoAutoComplete").value();
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").setDefaultValue(NogKey, NogVal);
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").enable(false);
                FirstNogRow.find("input[id^='NOG']").val($("#OtherNOG").val());
                FirstNogRow.find("input[id^='NOG']").attr('readonly', true);

            });
            $("div[id$='divareaTrans_shipment_tfwbshipmentnog']").find("[id^='areaTrans_shipment_tfwbshipmentnog']").each(function () {
                cfi.Numeric($(this).find("input[id^='Pieces']").attr("id"), 0);
                cfi.Numeric($(this).find("input[id^='NogGrossWt']").attr("id"), 3);
                if ($(this).find("input[id^='NOG_']").val() != "") {
                    $(this).find("input[id^='NOG_']").removeAttr('disabled');
                }
            });

            // Bind SHC Sub Group Data Starts
            if (SHCSubGroupdata.length > 0) {
                $("a[id^='ahref_SubGroup']").show();
                var Sno = 0;
                for (i = 0; i < SHCSubGroupdata.length; i++) {
                    Sno = parseInt(i) + 1;
                    var Row = '<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + ' "<input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"><input type="hidden" name="IsDGR_' + Sno + '" id="IsDGR_' + Sno + '" value="' + SHCSubGroupdata[i].IsDGR + '" class="transSection"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '</td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SHCSubGroupdata[i].SPHCSNo + '" id="SHCSNo_' + SHCSubGroupdata[i].SPHCSNo + '" value=' + SHCSubGroupdata[i].SPHCSNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td>'
                    if (SHCSubGroupdata[i].StatementLabel != "") {
                        Row += '<td class="formthreelabel"><span id="spnStatLabel_' + Sno + '">' + SHCSubGroupdata[i].StatementLabel + '</span></td>'
                        Row += '<td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="StatementDesc_' + Sno + '" id="StatementDesc_' + Sno + '" recname="StatementDesc" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="50" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>'
                    }
                    if (SHCSubGroupdata[i].PackingInstructionLabel != "") {
                        Row += '<td class="formthreelabel"><span id="spnStatLabel_' + Sno + '" style="width: 150px;">' + SHCSubGroupdata[i].PackingInstructionLabel + '</span></td>'
                        Row += '<td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="PackingLabel_' + Sno + '" id="PackingLabel_' + Sno + '" recname="PackingLabel" style="width: 100px; text-transform: uppercase;" controltype="uppercase" maxlength="5" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>'
                    }
                    if (SHCSubGroupdata[i].StatementLabel == "" || SHCSubGroupdata[i].PackingInstructionLabel == "") {
                        Row += '<td class="formSNo snowidth" class="transSection"></td><td class="formSNo snowidth" class="transSection"></td>'
                    }
                    Row += '</tr>'
                    //$("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("table > tbody").append('<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + '"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '<input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"></td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SHCSubGroupdata[i].SPHCSNo + '" id="SHCSNo_' + SHCSubGroupdata[i].SPHCSNo + '" value=' + SHCSubGroupdata[i].SPHCSNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr>');
                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("table > tbody").append(Row);
                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SHC_']").val(SHCSubGroupdata[i].Code);
                    cfi.AutoCompleteV2($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("name"), "SPHCCode", "TransitFWB_SPHCTrans", null, "contains", ",");




                    cfi.BindMultiValue($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("name"), SHCSubGroupdata[i].Text_SubGroup, SHCSubGroupdata[i].SubGroup)
                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").val(SHCSubGroupdata[i].SubGroup);
                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='StatementDesc_']").val(SHCSubGroupdata[i].MandatoryInfo);
                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='PackingLabel_']").val(SHCSubGroupdata[i].PackingInstruction);
                    AllowedSpecialChar($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='StatementDesc_']").attr("id"));
                    AllowedSpecialChar($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='PackingLabel_']").attr("id"));
                    Sno += 1;
                }
                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").find("input[id^='StatementDesc_']").each(function () {
                    var NewRow = $(this).closest("tr");
                    $(this).unbind('keyup').bind('keyup', function (e) {
                        if ($(NewRow).find("input[id^='IsDGR']").val() == "T") {
                            var ctrlid = $(this).attr("id");
                            oldVal = $(this).val();
                            $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").find("input[type='hidden'][id^='IsDGR_'][value='T']").closest("tr").find("input[id^='StatementDesc_']").each(function () {
                                if (ctrlid != $(this).attr("id")) {
                                    $(this).val(oldVal);
                                }
                            });
                        }
                    });
                });

            } else {
                $("a[id^='ahref_SubGroup']").hide();
            }
            //-- Bind SPHC Temp Data
            $("div[id=divareaTrans_shipment_tfwbshctemp]").not(':first').remove();
            $("a[id^='ahref_TempControl']").unbind("click").bind("click", function () {
                $("div[id=divareaTrans_shipment_tfwbshctemp]").not(':first').remove();
                $("#divareaTrans_shipment_tfwbshctemp").data("kendoWindow").open();
            });

            cfi.makeTrans("shipment_tfwbshctemp", null, null, BindSPHCTempAutoComplete, ReBindSPHCTempAutoComplete, null, SHCTempData);
            if (SHCTempData.length > 0) {
                TempArray = SHCTempData;
                $("a[id^='ahref_TempControl']").show();

                SHCdata = [];
                for (i = 0; i < SHCTempData.length; i++) {
                    if (SHCTempData[i].tempshccode.indexOf(",") >= 0) {
                        var SHC = SHCTempData[i].tempshccode.split(",");
                        var SHCCode = SHCTempData[i].text_tempshccode.split(",");
                        for (j = 0; j < SHC.length; j++) {
                            var info = {
                                Key: SHC[j],
                                Text: SHCCode[j],
                            };
                            SHCdata.push(info);
                        }
                    } else {
                        var info = {
                            Key: SHCTempData[i].tempshccode,
                            Text: SHCTempData[i].text_tempshccode,
                        };
                        SHCdata.push(info);
                    }
                }

                $("div[id='divareaTrans_shipment_tfwbshctemp']").find("tr[id^='areaTrans_shipment_tfwbshctemp']").each(function (i, row) {
                    $(row).find("div[id^='divMultiTEMPSHCCode']").find("li").not("first").remove();
                    if ($("#" + "Text_" + $(row).find("input[id^='TEMPSHCCode']").attr("id")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteByDataSource($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata, null, ",");
                    }
                    else {
                        cfi.ChangeAutoCompleteDataSource($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata);
                    }
                    cfi.BindMultiValue($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCTempData[i].text_tempshccode, SHCTempData[i].tempshccode);
                    $(row).find("input[id^='TEMPSHCCode']").val(SHCTempData[i].tempshccode);
                });

            } else {
                $("a[id^='ahref_TempControl']").hide();
            }

            $("a[id^='ahref_SubGroup']").unbind("click").bind("click", function () {
                $("#divareaTrans_shipment_shipmentSHCSubGroup").find("input[id^='Text_SubGroup_'").parent().removeAttr("style");
                $("#divareaTrans_shipment_shipmentSHCSubGroup").find("input[id^='Text_SubGroup_'").parent().parent().css('width', '250px');
                if (!$("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_shipment_shipmentSHCSubGroup", "SHC Sub Group Details", 800);
                }
                else {
                    $("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow").open();
                }
            });

            //-- Bind Transit Itenary Data
            cfi.makeTrans("shipment_tfwbshipmenttransitinerary", null, null, null, null, null, TransRoutData);
            $("#divareaTrans_shipment_tfwbshipmenttransitinerary tr td:contains('Action')").text('');
            $("div[id$='divareaTrans_shipment_tfwbshipmenttransitinerary']").find("[id='areaTrans_shipment_tfwbshipmenttransitinerary']").each(function () {
                $(this).find("div[id^='transActionDiv']").hide();
            });
            // Bind SHC Sub Group Data Ends
            cfi.makeTrans("shipment_tfwbshipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            $("div[id$='divareaTrans_shipment_tfwbshipmentitinerary']").find("[id='areaTrans_shipment_tfwbshipmentitinerary']").each(function () {

                $(this).find("input[id^='BoardPoint']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_BoardPoint", ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='offPoint']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_offPoint", ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='FlightNo']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "FlightNo", "TransitFWB_FlightNo", null, "contains");
                });
                var ctrlID = $(this).find("input[id^='FlightDate']").attr("id");
                $(this).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight(ctrlID) });
            });
            $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
            if (itenData.length <= 0) {
                if (resData.length > 0 && resItem != undefined) {
                    $("div[id$='divareaTrans_shipment_tfwbshipmentitinerary']").find("[id='areaTrans_shipment_tfwbshipmentitinerary']").first().find("input[id^=Text_BoardPoint]").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                    $("div[id$='divareaTrans_shipment_tfwbshipmentitinerary']").find("[id='areaTrans_shipment_tfwbshipmentitinerary']").first().find("input[id^=Text_offPoint]").data("kendoAutoComplete").setDefaultValue(resItem.RoutingSNo, resItem.RoutingCityCode);
                }
            }

            $("#AWBNo").unbind("keyup").bind("keyup", function () {
                if ($(this).val().length == 3) {
                    $(this).val($(this).val() + "-");
                }
            });
            $("#Text_CarrierCode").closest('span').css('width', '50px');
            if (resData.length <= 0) {
                $("div[id=divareaTrans_shipment_tfwbshipmentitinerary]").find("tr[id='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
            if (userContext.SpecialRights.DGR == true) {
                $("a[id^='ahref_ClassDetails']").show();
            } else {
                $("a[id^='ahref_ClassDetails']").hide();
            }
            if (IsAgentBUP == true) {
                $("div[id$='divareaTrans_shipment_tfwbshipmentitinerary']").find("[id='areaTrans_shipment_tfwbshipmentitinerary']").each(function () {
                    $(this).find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
                    $(this).find("input[id^='Text_offPoint']").data("kendoAutoComplete").enable(false);
                    $(this).find("input[id^='FlightDate']").data('kendoDatePicker').enable(false);
                    $(this).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").enable(false);
                    $(this).find("div[id^='transActionDiv']").css('display', 'none');
                });
            }
            cfi.Numeric("CBM", 3);
            cfi.Numeric("VolumeWt", 3);
        },
        error: {

        }
    });
}


function ShowOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#OtherNOG").show();
        setTimeout(function () { $("#OtherNOG").focus() }, 200);
        $("#OtherNOG").attr("data-valid", "required").attr("data-valid-msg", "Enter Other Nature of Goods");
    } else {
        $("#OtherNOG").hide();
        $("#OtherNOG").val('');
        $("#OtherNOG").removeAttr("data-valid", "data-valid-msg");
    }
}
function EnableOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#" + e).closest("tr").find("input[id^='NOG']").removeAttr('disabled');
    } else {
        $("#" + e).closest("tr").find("input[id^='NOG']").val('');
        $("#" + e).closest("tr").find("input[id^='NOG']").attr('disabled', 1);
    }

}
function CheckIsAWBUsable() {
    if ($('#AWBNo').val() != "") {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/CheckIsAWBUsable?AWBNo=" + $('#AWBNo').val(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = JSON.parse(result);
                var isValid = data.Table;
                if (isValid[0].MSG != "") {
                    jAlert(isValid[0].MSG, "Warning - FWB");
                    $('#AWBNo').val('');
                }

            },
            error: {
            }
        });
    }
}

function GetDGRDetails(e) {
    if ($("#divMultiSpecialHandlingCode").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    } else {
        GetDGRDetailsBySHC(($("#Multi_SpecialHandlingCode").val() == "" ? "" : $("#Multi_SpecialHandlingCode").val() + ",") + this.dataItem(e.item.index()).Key);
    }
}
function GetDGRDetailsAfterDelete(obj) {
    GetDGRDetailsBySHC($("#Multi_SpecialHandlingCode").val());
    RemoveSPHCSubGroup($("#Multi_SpecialHandlingCode").val());
    var GDRRemainingData = [];

    $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {

        //if ($(obj).attr("id") == $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key()) {
        //    $(this).remove();
        //}
        if ($(obj).attr("id") != $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key()) {
            var DGRInfo = {
                sphc: $(this).find("input[type=hidden][id^='SPHC']").val(),
                text_sphc: $(this).find("input[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                unno: $(this).find("input[type=hidden][id^='UnNo']").val(),
                text_unno: $(this).find("input[id^='Text_UnNo']").data("kendoAutoComplete").value(),
                //shippingname: $(this).find("input[type=hidden][id^='ShippingName']").val(),
                //text_shippingname: $(this).find("input[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                class: $(this).find("input[type=hidden][id^='Class']").val(),
                text_class: $(this).find("input[type=hidden][id^='Class']").val(),
                subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
                text_subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
                packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),
                text_packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),

                dgrpieces: $(this).find("[id^='DGRPieces']").val(),
                netquantity: $(this).find("[id^='NetQuantity']").val(),
                unit: $(this).find("input[type=hidden][id^='Unit']").val(),
                text_unit: $(this).find("input[type=hidden][id^='Unit']").val(),
                quantity: $(this).find("[id^='Quantity']").val(),

                packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
                text_packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
                ramcat: $(this).find("[id^='RamCat']").val(),

                erg: $(this).find("input[type=hidden][id^='ERG']").val(),
                text_erg: $(this).find("input[type=hidden][id^='ERG']").val(),

            };
            GDRRemainingData.push(DGRInfo);
        }

    });

    $("div[id=divareaTrans_shipment_tfwbshipmentclasssphc]").not(':first').remove();
    $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("tbody").remove();
    $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").append(tblhtml);
    $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc'] tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
    $("#btnSaveDGR").unbind("click").bind("click", function () {
        SaveDGRDetails();
    });
    cfi.makeTrans("shipment_tfwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, GDRRemainingData);
    $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
        $(this).find("input[id^='SPHC']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
            }
            else {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
            }
        });
        $(this).find("input[id^='UnNo']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "UNNumber,ColumnSearch", "TransitFWB_DGRUNNumber", ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);





        });

        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "TransitFWB_DGRClassDivSub", null, "contains");

        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {

            cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "TransitFWB_DGRSubRisk", GetPackingInst, "contains", null, null, null, null, null, null, null, true);
        });
        $(this).find("input[id^='Unit']").each(function () {

            cfi.AutoCompleteV2($(this).attr("name"), "Unit", "TransitFWB_DGRUnit", null, "contains");

        });
        $(this).find("input[id^='PackingInst']").each(function () {

            cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "TransitFWB_DGRPackingInst", GetMaxQty, "contains", null, null, null, null, null, null, null, true);


        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "TransitFWB_DGRERG", null, "contains");

        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
        //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
        $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
    });
}

function RemoveSPHCSubGroup(SHC) {
    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetDGRInfo?SPHCSNo=" + SHC, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var DGRData = jQuery.parseJSON(result);
            var SPHCDGR = DGRData.Table;
            var SubGroup = DGRData.Table1;

            // Remove SPHC Sub Group Row on Removing SPHC
            if (SubGroup.length > 0) {
                var NewSHCString = JSON.stringify(SubGroup);
                for (i = 0; i < SubGroup.length; i++) {
                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").each(function (i, row) {
                        if (NewSHCString.indexOf($(row).find("input[id^='SHC_']").val()) < 0) {
                            $(row).remove();
                        }
                    });
                }
                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").each(function (i, row) {
                    $(row).find("td[id^='tdSNoCol']").text(parseInt(i) + 1);
                });
            } else {
                $("a[id^='ahref_SubGroup']").hide();
            }

        },
        error: {

        }
    });
}

function GetDGRDetailsBySHC(SPHCSNos) {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetDGRInfo?SPHCSNo=" + SPHCSNos, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var DGRData = jQuery.parseJSON(result);
            var SPHCDGR = DGRData.Table;
            var SubGroup = DGRData.Table1;
            var DGRPieces = DGRData.Table2;
            var SHCTemp = DGRData.Table3;
            // Add Rows for SPHC having Sub Group
            if (SubGroup.length > 0) {
                $("a[id^='ahref_SubGroup']").show();
                var Sno = 0;
                if ($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").length > 0) {
                    //Sno = parseInt(($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").val() || "0")) + 1;
                    var Ctrlid = parseInt($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("id").split('_')[1]) + 1;
                    var tdSno = $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("td[id^='tdSNoCol']").text();
                    if (parseInt(Ctrlid) > parseInt(tdSno)) {
                        Sno = parseInt(Ctrlid);
                    } else {
                        Sno = parseInt(tdSno);
                    }
                } else {
                    Sno = 1;
                }
                for (i = 0; i < SubGroup.length; i++) {
                    if ($.inArray(SubGroup[i].Code, $("input[id^='SHC_']").map(function (e, f, g) { return $(f).val() })) < 0) {
                        var Row = '<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + '" <input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"><input type="hidden" name="IsDGR_' + Sno + '" id="IsDGR_' + Sno + '" value="' + SubGroup[i].IsDGR + '" class="transSection"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '></td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SubGroup[i].SNo + '" id="SHCSNo_' + SubGroup[i].SNo + '" value=' + SubGroup[i].SNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td>'
                        if (SubGroup[i].StatementLabel != "") {
                            Row += '<td class="formthreelabel"><span id="spnStatLabel_' + Sno + '">' + SubGroup[i].StatementLabel + '</span></td>'
                            Row += '<td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="StatementDesc_' + Sno + '" id="StatementDesc_' + Sno + '" recname="StatementDesc" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="50" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>'
                        }
                        if (SubGroup[i].PackingLabel != "") {
                            Row += '<td class="formthreelabel"><span id="spnStatLabel_' + Sno + '" style="width: 150px;">' + SubGroup[i].PackingLabel + '</span></td>'
                            Row += '<td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="PackingLabel_' + Sno + '" id="PackingLabel_' + Sno + '" recname="PackingLabel" style="width: 100px; text-transform: uppercase;" controltype="uppercase" maxlength="5" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>'
                        }
                        if (SubGroup[i].StatementLabel == "" || SubGroup[i].PackingLabel == "") {
                            Row += '<td class="formSNo snowidth" class="transSection"></td><td class="formSNo snowidth" class="transSection"></td>'
                        }
                        Row += '</tr>'
                        //$("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("table > tbody").append('<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + '"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '<input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"></td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SubGroup[i].SNo + '" id="SHCSNo_' + SubGroup[i].SNo + '" value=' + SubGroup[i].SNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr>');
                        $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("table > tbody").append(Row);
                        AllowedSpecialChar($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='StatementDesc_']").attr("id"));
                        AllowedSpecialChar($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='PackingLabel_']").attr("id"));
                        $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").find("input[id^='StatementDesc_']").each(function () {
                            var NewRow = $(this).closest("tr");
                            $(this).unbind('keyup').bind('keyup', function (e) {
                                if ($(NewRow).find("input[id^='IsDGR']").val() == "T") {
                                    var ctrlid = $(this).attr("id");
                                    oldVal = $(this).val();
                                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").find("input[type='hidden'][id^='IsDGR_'][value='T']").closest("tr").find("input[id^='StatementDesc_']").each(function () {
                                        if (ctrlid != $(this).attr("id")) {
                                            $(this).val(oldVal);
                                        }
                                    });
                                }
                            });
                        });

                        $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SHC_']").val(SubGroup[i].Code);
                        cfi.AutoCompleteV2($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("name"), "SPHCCode", "TransitFWB_DGRSPHCTrans", null, "contains", ",");


                        Sno += 1;
                    }
                }
                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").each(function (i, row) {
                    $(row).find("td[id^='tdSNoCol']").text(parseInt(i) + 1);
                });
            } else {
                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").remove();
                $("a[id^='ahref_SubGroup']").hide();
            }

            DGRSPHC = [];
            for (i = 0; i < SPHCDGR.length; i++) {
                var info = {
                    Key: SPHCDGR[i].SNo,
                    Text: SPHCDGR[i].Code
                };
                DGRSPHC.push(info);
            }
            if (DGRSPHC.length > 0) {
                $("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
                    $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                    $(this).find("input[id^='SPHC']").each(function () {
                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                        }
                        else {
                            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
                        }
                    });
                    $(this).find("input[id^='UnNo']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "UNNumber,ColumnSearch", "TransitFWB_DGRSHCUnNo", ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);


                    });

                    $(this).find("input[id^='Class']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "TransitFWB_DGRSHCClassDivSub", null, "contains");

                    });
                    $(this).find("input[id^='SubRisk']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "TransitFWB_DGRSHCSubRisk", null, "contains");

                    });
                    $(this).find("input[id^='PackingGroup']").each(function () {

                        cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "TransitFWB_DGRSHCPackingGroup", GetPackingInst, "contains", null, null, null, null, null, null, null, true);

                    });
                    $(this).find("input[id^='Unit']").each(function () {

                        cfi.AutoCompleteV2($(this).attr("name"), "Unit", "TransitFWB_DGRSHCUnit", null, "contains");

                    });
                    $(this).find("input[id^='PackingInst']").each(function () {

                        cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "TransitFWB_DGRSHCPackingInst", GetMaxQty, "contains", null, null, null, null, null, null, null, true);


                    });
                    $(this).find("input[id^='ERG']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "TransitFWB_DGRSHCERGN", null, "contains");

                    });
                    $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
                    //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
                    $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
                });

                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_shipment_tfwbshipmentclasssphc", "DGR Details", 1400);
                    $("div[id='divareaTrans_shipment_tfwbshipmentclasssphc']").find("input[id^='Text_SPHC']").attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
                    $("div[id='divareaTrans_shipment_tfwbshipmentclasssphc']").find("input[id^='Text_UnNo']").attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
                    // Use this to unbing click event of DGR when delete shc for future
                    //$("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
                });

            } else {
                $("a[id^='ahref_ClassDetails']").unbind("click");
            }

            if (DGRPieces.length > 0) {
                if (DGRPieces[0].RequiredDGRPieces == 1) {
                    $("input[id*='txtDGRPieces']").removeAttr("disabled");
                    $("input[id^='txtDGRPieces']").attr("data-valid", "min[1],required").attr("data-valid-msg", "Enter DGR Pieces");
                }
                else {
                    $("#txtDGRPieces").val('');
                    $("#_temptxtDGRPieces").val('');
                    $("input[id^='txtDGRPieces']").removeAttr("data-valid").removeAttr("data-valid-msg");
                    $("input[id*='txtDGRPieces']").attr("disabled", 1);
                }
            }
            //-- Check Temp controled  SPHC
            if (SHCTemp.length > 0) {
                TempArray = SHCTemp;
                SHCdata = [];
                for (i = 0; i < SHCTemp.length; i++) {
                    var info = {
                        Key: SHCTemp[i].SNo,
                        Text: SHCTemp[i].Code,
                    };
                    SHCdata.push(info);
                }

                $("a[id^='ahref_TempControl']").show();
                $("#divareaTrans_shipment_tfwbshctemp").find("input[id^='Text_TEMPSHCCode'").parent().removeAttr("style");
                //$("#divareaTrans_shipment_tfwbshctemp").find("input[id^='Text_TEMPSHCCode'").parent().parent().css('width', '100px');
                $("div[id='divareaTrans_shipment_tfwbshctemp']").find("tr[id^='areaTrans_shipment_tfwbshctemp']").each(function (i, row) {
                    if ($("#" + "Text_" + $(row).find("input[id^='TEMPSHCCode']").attr("id")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteByDataSource($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata, null, ",");
                    }
                    else {
                        cfi.ChangeAutoCompleteDataSource($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata);
                    }
                });
            } else {
                $("a[id^='ahref_TempControl']").hide();
                TempArray = [];
            }
        },
        error: {

        }
    });
}

function GetQty(obj) {
    //$(obj).closest('tr').find("input[id^='Quantity']").val((parseInt($(obj).closest('tr').find("input[id^='DGRPieces']").val() || "0") * parseFloat($(obj).closest('tr').find("input[id^='NetQuantity']").val() || "0")).toFixed(2));
    var CurrentRow = $(obj).closest('tr');
    var NetQty = parseFloat($(obj).closest('tr').find("input[id^='NetQuantity']").val() || "0");
    var MaxQty = parseFloat($(obj).closest('tr').find("input[id^='Quantity']").val() || "0");
    var Pieces = $(obj).closest('tr').find("input[id^='DGRPieces']").val() || 1;

    if (NetQty > MaxQty) {
        if ((MaxQty == 0) && (CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").key() == "")) {
            $(obj).closest('tr').find("input[id^='NetQuantity']").val('');
            jAlert("Select Packing Inst. Prior to entry of net quantity. ", "Warning");
        } else if ((MaxQty == 0) && (CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").key() != "")) {

        }
        else {
            if (NetQty / parseFloat(Pieces) > MaxQty) {
                var NetQty = $(obj).closest('tr').find("input[id*='NetQuantity']").val('');
                jAlert("Per Package Weight Limit exceeds. Kindly increase number of Packages or change Packing Inst.", "Warning");
            }
        }
    }
}
function ResetDGROtherDetails(e) {
    if ($("#" + e).data("kendoAutoComplete") != undefined && $("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/GetDGRInfoByID?SNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var DGRData = jQuery.parseJSON(result);
                var DGRDetail = DGRData.Table;

                if (DGRDetail.length > 0) {
                    var currentRow = $("#" + e).closest('tr');
                    //if (e.indexOf("Text_UnNo") >= 0) {
                    //    currentRow.find("input[id^='Text_ShippingName']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["ColumnSearch"]);
                    //    currentRow.find("input[type=hidden][id^='ShippingName']").val(DGRDetail[0]["ID"]);
                    //} else if (e == "Text_ShippingName") {
                    //    currentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["UNNumber"]);
                    //    currentRow.find("input[type=hidden][id^='UnNo']").val(DGRDetail[0]["ID"]);
                    //}
                    currentRow.find("input[id^='Text_Class']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ClassDivSub"], DGRDetail[0]["ClassDivSub"]);
                    currentRow.find("input[id^='Text_SubRisk']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["SubRisk"], DGRDetail[0]["SubRisk"]);
                    //currentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingGroup"], DGRDetail[0]["PackingGroup"]);
                    currentRow.find("input[id^='Text_Unit']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["Unit"], DGRDetail[0]["Unit"]);
                    //currentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingInst"], DGRDetail[0]["PackingInst"]);
                    currentRow.find("input[id^='Text_ERG']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ERGN"], DGRDetail[0]["ERGN"]);
                }

            },
            error: {

            }
        });
    }
    else {
        var CurrentRow = $("#" + e).closest('tr');
        CurrentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").setDefaultValue("", "");
        //CurrentRow.find("input[id^='Text_ShippingName']").data("kendoAutoComplete").setDefaultValue("", "");
        CurrentRow.find("textarea[id^='DGRCommodity']").val("");
        CurrentRow.find("input[id^='Text_Class']").data("kendoAutoComplete").setDefaultValue("", "");
        CurrentRow.find("input[id^='Text_SubRisk']").data("kendoAutoComplete").setDefaultValue("", "");
        CurrentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").setDefaultValue("", "");
        CurrentRow.find("input[id^='DGRPieces']").val("");
        CurrentRow.find("input[id^='_tempDGRPieces']").val("");
        CurrentRow.find("input[id^='NetQuantity']").val("");
        CurrentRow.find("input[id^='_tempNetQuantity']").val("");
        CurrentRow.find("input[id^='Text_Unit']").data("kendoAutoComplete").setDefaultValue("", "");
        CurrentRow.find("input[id^='Quantity']").val("");
        CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue("", "");
        CurrentRow.find("input[id^='RamCat']").val("");
        CurrentRow.find("input[id^='Text_ERG']").data("kendoAutoComplete").setDefaultValue("", "");
    }
    //$("#" + e).closest('tr').find("input:not([id*='_SPHC']").each(function () {
    //    if ($("#" + e).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key() != "" && $("#" + e).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "") {
    //        if ($(this).attr('id').indexOf('UnNo') == -1) {
    //            $(this).val('');
    //        }
    //    }
    //});
}

function GetPackingInst(e) {
    //if (($("#" + e).data("kendoAutoComplete").key() || "") == "") {
    var CurrentRow = $("#" + e).closest('tr');
    CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue("", "");
    CurrentRow.find("input[id^='NetQuantity']").val("");
    CurrentRow.find("input[id^='_tempNetQuantity']").val("");
    CurrentRow.find("input[id^='Quantity']").val("");

    // }
}

function GetMaxQty(e) {
    var CurrentRow = $("#" + e).closest('tr');
    var UNNo = CurrentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0];
    var PackGroup = CurrentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").value();
    var PackInst = CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").value();
    if (CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").value() == "F") {
        CurrentRow.find("input[id*='NetQuantity']").val('');
        CurrentRow.find("input[id*='DGRPieces']").val('');
        CurrentRow.find("input[id^='NetQuantity']").attr('disabled', 1);
        CurrentRow.find("input[id^='DGRPieces']").attr('disabled', 1);
    } else {
        CurrentRow.find("input[id^='NetQuantity']").removeAttr('disabled');
        CurrentRow.find("input[id^='DGRPieces']").removeAttr('disabled');
    }
    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetMaxQty?UNNo=" + UNNo + "&PackGroup=" + PackGroup + "&PackInst=" + PackInst, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var DGRData = jQuery.parseJSON(result);
            var DGRDetail = DGRData.Table;
            var currentRow = $("#" + e).closest('tr');
            if (DGRDetail.length > 0) {
                currentRow.find("input[id^='Quantity']").val(DGRDetail[0]["PCAMaxNetQtyJ"]);
            } else {
                currentRow.find("input[id^='Quantity']").val("");
            }
        }
    });

}

function fn_CheckRange(obj) {
    var currentTr = $(obj).closest('tr');
    var StartTemperature = (currentTr.find("input[id^=StartTemperature]").val() || "0") == 0 ? (currentTr.find("input[id^=_tempStartTemperature]").val() || "0") : (currentTr.find("input[id^=StartTemperature]").val() || "0");
    var EndTempreature = (currentTr.find("input[id^=EndTemperature]").val() || "0") == 0 ? (currentTr.find("input[id^=_tempEndTemperature]").val() || "0") : (currentTr.find("input[id^=EndTemperature]").val() || "0");
    var rangeValida = true;
    if (parseFloat(EndTempreature) != 0) {
        if (parseFloat(EndTempreature) < parseFloat(StartTemperature)) {
            ShowMessage('warning', 'Warning - Temperature', "End temperature should be greater than Start Temperature.", "bottom-right");
            currentTr.find("input[id*='" + $(obj).attr("recname") + "']").val("");
            rangeValida = false;
        }
    }

    if (($(obj).closest("tr").find("li span").text().indexOf("PIL") >= 0) && (rangeValida == true)) {
        var StartValid = true;
        if (StartTemperature != 0) {
            if ((parseInt(StartTemperature) != parseInt(-18)) && (parseInt(StartTemperature) != parseInt(2)) && (parseInt(StartTemperature) != parseInt(15))) {
                ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
                $(obj).val("");
                StartValid = false;
            }
        }

        if (EndTempreature != 0 && StartValid == true) {
            var Valid = true;
            if (StartTemperature == parseInt(-18) && parseInt(EndTempreature) != parseInt(-18)) {
                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be -18", "bottom-right");
                Valid = false;
                $(obj).val("");
            }
            if (StartTemperature == parseInt(2) && parseInt(EndTempreature) != parseInt(8)) {
                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 8", "bottom-right");
                Valid = false;
                $(obj).val("");
            }
            if (StartTemperature == parseInt(15) && parseInt(EndTempreature) != parseInt(25)) {
                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 25", "bottom-right");
                Valid = false;
                $(obj).val("");
            }
            if (Valid != false) {
                if ((parseInt(StartTemperature) != parseInt(-18)) && (parseInt(StartTemperature) != parseInt(2)) && (parseInt(StartTemperature) != parseInt(15))) {
                    ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
                    $(obj).val("");
                }
            }
        }
    }
}

function SaveDGRDetails() {
    var ValidMsg = true, msg = "";
    $("div[id$='divareaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
        if (($(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key() || 0) <= 0) {
            ValidMsg = false;
            msg = "Select IMP"
        }
        if (($(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key() || 0) <= 0) {
            ValidMsg = false;
            msg = "Select UN/ID No"
        }
    });
    if (ValidMsg == false) {
        ShowMessage('warning', 'Information!', msg, "bottom-right");
        return false;
    }

    if (($("#AWBNo").attr("disabled") || "") == "") {
        $("div[id=divareaTrans_shipment_tfwbshipmentclasssphc]").data("kendoWindow").close();
        ShowMessage('success', 'Success - DGR', " DGR Details Saved Successfully", "bottom-right");
        return false;
    }

    var DGRArray = [];
    $("div[id$='divareaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
        if (DGRSPHC.length > 0) {
            var DGRViewModel = {
                SPHCSNo: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                DGRSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                UNNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0],
                //DGRShipperSNo: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").key(),
                //ProperShippingName: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                DGRShipperSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                ProperShippingName: "",
                Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                SubRisk: $(this).find("[id^='Text_SubRisk']").data("kendoAutoComplete").key(),
                PackingGroup: $(this).find("[id^='Text_PackingGroup']").data("kendoAutoComplete").key(),
                Pieces: $(this).find("[id^='DGRPieces']").val() || 0,
                NetQuantity: $(this).find("[id^='NetQuantity']").val() || 0,
                Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                Quantity: $(this).find("[id^='Quantity']").val() || 0,
                PackingInst: $(this).find("[id^='Text_PackingInst']").data("kendoAutoComplete").key(),
                RAMCategory: $(this).find("[id^='RamCat']").val(),
                ERGN: $(this).find("[id^='Text_ERG']").data("kendoAutoComplete").key(),
                Commodity: $(this).find("[id^='DGRCommodity']").val(),
            };
            DGRArray.push(DGRViewModel);
        }
    });

    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveDGRDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBDGRTrans: DGRArray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - DGR', " DGR Details Saved Successfully", "bottom-right");
                $("div[id=divareaTrans_shipment_tfwbshipmentclasssphc]").data("kendoWindow").close();
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - DGR [' + awbNo + ']', result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DGR', "unable to process.", "bottom-right");

        }
    });

}

function compareGrossVolValue() {
    var gw = $("#GrossWt").val();
    var vw = $("#VolumeWt").val();
    var cw = $("#ChargeableWt").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#ChargeableWt").val() == "" ? "0" : $("#ChargeableWt").val()) < chwt) {
        $("#ChargeableWt").val(chwt == 0 ? "" : chwt);
        $("#_tempChargeableWt").val(chwt == 0 ? "" : chwt);
    }
}

function comparePcsValue(obj) {
    var value = $(obj).val();
    if (parseFloat(value) < parseFloat(accpcs)) {
        $(obj).val(bkdpcs == 0 ? "" : bkdpcs);
        ShowMessage('warning', 'Information!', "Entered Pieces cannot be less than Accepted Pieces. Accepted Pieces : " + bkdpcs.toString() + ".", "bottom-right");
    }
}

function compareGrossValue(obj) {
    if (parseFloat(accgrwt) > 0) {
        var flag = false;
        var value = $(obj).val();
        if (parseFloat(value) < parseFloat(accgrwt)) {
            $(obj).val(bkdgrwt == 0 ? "" : bkdgrwt);
            ShowMessage('warning', 'Information!', "Entered Gross weight cannot be less than accepted Gross weight. Accepted gross weight : " + bkdgrwt.toString() + ".", "bottom-right");
            flag = true;
        }
        return flag;
    } else
        return true;
}

function compareVolValue(obj) {
    var flag = true;
    var cbm = ($(obj).val() == "" ? 0 : parseFloat($(obj).val()));
    var volwt = cbm * 166.66;
    if (parseFloat(volwt) < parseFloat(accvolwt)) {
        $(obj).val(bkdvolwt == 0 ? "" : bkdvolwt);
        ShowMessage('warning', 'Information!', "Entered Volume weight cannot be less than accepted Volume weight. Accepted volume weight : " + bkdvolwt.toString() + ".", "bottom-right");
        flag = false;
    }
    return flag;
}

function CalculateShipmentChWt(obj) {

    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));

    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.66;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='VolumeWt']").text(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// Hmishra
        // $("input[id='VolumeWt']").val(volwt.toFixed(3));// Hmishra
        $("#VolumeWt").val(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// Hmishra
        $("#_tempVolumeWt").val(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// Hmishra
    }
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toFixed(3).toString() == 0 ? "" : chwt.toFixed(3).toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString() == 0 ? "" : chwt.toFixed(3).toString());
}


function CalculateShipmentCBM() {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var volwt = ($("#VolumeWt").val() == "" ? 0 : parseFloat($("#VolumeWt").val()));
    var cbm = (volwt / 166.66).toFixed(3);
    $("#CBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    $("#_tempCBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toString() == 0 ? "" : chwt.toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString() == 0 ? "" : chwt.toString());
}

function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}
function ISNumericNew(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 6)) {
        event.preventDefault();
    }
}
function ISNumber(obj) {
    if ($.inArray(event.keyCode, [8, 9, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]) !== -1 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
    } else {
        event.preventDefault();
    }
}

function BindItenAutoComplete(elem, mainElem) {
    var totalRow = $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").length;
    $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 != totalRow) {
            $(this).find("div[id^='transActionDiv']").hide();
        }

        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_BoardPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_offPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "FlightNo", "TransitFWB_FlightNo", null, "contains");
            }
        });

    });

    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_ItenBoardPoint", ResetSelectedFlight, "contains");


        $("input[id^='BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());
        $("input[id^='Text_BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='Text_offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());

    });

    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").value("");
    $(elem).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
    // diable previous row controles
    $(elem).prev().find("[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
    $(elem).prev().find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(false);
    $(elem).prev().find("[id^='FlightDate']").data("kendoDatePicker").enable(false);
    $(elem).prev().find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(false);

    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });
    $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
}

function ResetSelectedFlight(obj) {
    if ($("#" + obj).attr("recname") == "Text_BoardPoint") {
        $("#" + obj).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
    } else if ($("#" + obj).attr("recname") == "Text_offPoint") {
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
    } else {
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        if (parseInt($("#" + obj).closest('tr').find("td[id^='tdSNoCol']").text() || "0") > 1) {
            if (Date.parse($("#" + obj).closest('tr').find("input[id^='FlightDate']").attr("sqldatevalue")) < Date.parse($("#" + obj).closest('tr').prev().find("input[id^='FlightDate']").attr("sqldatevalue"))) {
                $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
        }
        if ($("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value() || "" != "") {
            $("#" + obj).closest('tr').find("[id^='Text_FlightNo']").attr("data-valid", "required");
        } else {
            $("#" + obj).closest('tr').find("[id^='Text_FlightNo']").removeAttr("data-valid");
        }
    }
}

function ReBindItenAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").each(function () {

        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {

                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_BoardPoint", ResetSelectedFlight, "contains");

            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode,AirportName", "TransitFWB_offPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "FlightNo", "TransitFWB_FlightNo", null, "contains");
            }
        });
    });
    $(elem).find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(true);
    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").enable(true);
    $(elem).find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(true);
    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });

    var totalRow = $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").length;
    $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 == totalRow) {
            $(this).find("div[id^='transActionDiv']").show();
        }
    });
}

function BindSPHCAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SpecialHandlingCode']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CODE", "", null, "contains");
    });
    $(elem).find("a[id^='ahref_ClassDetails']").each(function () {
        $(this).unbind("click").bind("click", function () {
            cfi.PopUp("divareaTrans_shipment_tfwbshipmentclasssphc", "SPHC Trans");
        });
    });
}

function ReBindSPHCAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentsphc']").find("[id^='areaTrans_shipment_shipmentsphc']").each(function () {
        $(this).find("input[id^='SPHC']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "TrasitFWB_SPHC");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("a[id^='ahref_ClassDetails']").each(function () {
            $(this).unbind("click").bind("click", function () {
                cfi.PopUp("divareaTrans_shipment_tfwbshipmentclasssphc", "SPHC Trans");
            });
        });
    });
}

function BindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Quantity']").attr("disabled", "disabled");
    cfi.Numeric($(elem).find("input[id^='NetQuantity']").attr("id"), 2);
    $(elem).find("input[id^='SPHC']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
        }
        else {
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
        }
        $("#" + "Text_" + $(this).attr("name")).attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
    });
    $(elem).find("input[id^='UnNo']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "UNNumber,ColumnSearch", "TransitFWB_SPHCUnNo", ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);




        }
        $("#" + "Text_" + $(this).attr("name")).attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
    });

    $(elem).find("input[id^='Class']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "TransitFWB_SPHCClassDivSub", null, "contains");

        }
    });
    $(elem).find("input[id^='SubRisk']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "TransitFWB_SPHCSubRisk", null, "contains");

        }
    });
    $(elem).find("input[id^='PackingGroup']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {

            cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "TransitFWB_SPHCPackingGroup", GetPackingInst, "contains", null, null, null, null, null, null, null, true);
        }
    });
    $(elem).find("input[id^='Unit']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "Unit", "TransitFWB_SPHCUnit", null, "contains");
        }
    });
    $(elem).find("input[id^='PackingInst']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {

            cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "TransitFWB_SPHCPackingInst", GetMaxQty, "contains", null, null, null, null, null, null, null, true);

        }
    });
    $(elem).find("input[id^='ERG']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        }
    });
    $(elem).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
    //$(elem).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
    $(elem).find("input[id^='Text_UnNo']").parent().removeAttr("style");
}

function ReBindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
        cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
        $(this).find("input[id^='SPHC']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
            }
            else {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
            }
        });
        $(this).find("input[id^='UnNo']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "UNNumber,ColumnSearch", "TransitFWB_RESPHCUnNo", ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);


        });

        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "TransitFWB_RESPHCClassDivSub", null, "contains");

        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "TransitFWB_RESPHCSubRisk", null, "contains");

        });
        $(this).find("input[id^='PackingGroup']").each(function () {

            cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "TransitFWB_RESPHCPackingGroup", GetPackingInst, "contains", null, null, null, null, null, null, null, true);
        });
        $(this).find("input[id^='Unit']").each(function () {

            cfi.AutoCompleteV2($(this).attr("name"), "Unit", "TransitFWB_RESPHCUnit", null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {

            cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "TransitFWB_RESPHCPackingInst", GetMaxQty, "contains", null, null, null, null, null, null, null, true);


        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "TransitFWB_RESPHCERGN", null, "contains");

        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
        //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
        $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
    });
}

function BindSPHCTempAutoComplete(elem, mainElem) {
    if ($(elem).find("input[id^='TEMPSHCCode']").data("kendoAutoComplete") == undefined) {
        $(elem).find("div[id^='divMultiTEMPSHCCode']").remove();
        cfi.AutoCompleteByDataSource($(elem).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata, null, ",");
    }
    else {
        cfi.ChangeAutoCompleteDataSource($(elem).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata);
    }
    $(elem).find("input[id^='TEMPSHCCode']").val("");
    //$(elem).find("div[id^='divMultiTEMPSHCCode']").find("li").not("first").remove();

}
function ReBindSPHCTempAutoComplete(elem, mainElem) {
    if ($(elem).find("input[id^='TEMPSHCCode']").data("kendoAutoComplete") == undefined) {
        cfi.AutoCompleteByDataSource($(elem).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata, null, ",");
    }
    else {
        cfi.ChangeAutoCompleteDataSource($(elem).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata);
    }
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "MessageType", "TransitFWB_Type", null, "contains");

    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "MessageType", "TransitFWB_HandleType", null, "contains");
    });
}

function removeHandlingMessage(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmenthandlinginfo']").find("[id^='areaTrans_shipment_shipmenthandlinginfo']").each(function () {
        $(this).find("input[id^='Type']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "TrasitFWB_Type");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function ValidateFlight(obj) {
    var CurrentRow = $("#" + obj).closest('tr');
    var CurrentRowNo = $("#" + obj).closest('tr').find("td[id^='tdSNoCol']").text();
    var FlightSNo = $("#" + obj).data("kendoAutoComplete").key();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/ValidateFlight?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var FlightData = Data.Table0;

            if (FlightData.length > 0) {
                if (FlightData[0].FlightStatus == "B") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert("AWB already Build Up. Flight amendment restricted.", "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert("AWB already Build Up. Flight amendment restricted.", "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
                else if (FlightData[0].FlightStatus == "P") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert("AWB already planned in Loading Instructions. Kindly contact your supervisor in case you want to amend Flight Details.", "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert("AWB already planned in Loading Instructions. Kindly contact your supervisor in case you want to amend Flight Details.", "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
                else if (FlightData[0].FlightStatus == "O") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert(FlightData[0].PromptMsg, "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert(FlightData[0].PromptMsg, "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
                else if (FlightData[0].FlightStatus == "@") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert(FlightData[0].PromptMsg, "Wasrning - Flight No.");
                            setTimeout(function () { $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " "); }, 1);
                        }
                    } else {
                        jAlert(FlightData[0].PromptMsg, "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
            }
        }
    });

}

function ValidatePieces(obj) {

    var elem = $("#areaTrans_shipment_shipmentdimension");
    var Pcs = 0;
    var balancePc = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        balancePc = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });

    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find($(obj).closest("tr")).index() - 1;

    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");
        CalculateVolume(elem);
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = balancePc;
        return false;
    }
    CalculateVolume(elem);
    return true;
}

function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_shipment_shipmentdimension");
    var divisor = 1;
    if ($("#Unit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    //elem.closest("div").find("input[id^='Pieces']").each(function () {
    //    var currentId = $(this).attr("id");
    //    var PieceID = currentId;
    //    var LengthID = currentId.replace("Pieces", "Length");
    //    var WidthID = currentId.replace("Pieces", "Width");
    //    var HeightID = currentId.replace("Pieces", "Height");
    //    var VolumeID = currentId.replace("Pieces", "VolumeWt");
    //    var currentVolume = 0;
    //    if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
    //        currentVolume = parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());
    //        var volWeight = Math.ceil(currentVolume / divisor);
    //        volWeight = (volWeight < 1 ? 1 : volWeight);
    //        VolumeCalculation = VolumeCalculation + volWeight;
    //        $("span[id='" + VolumeID + "']").html(volWeight);
    //        $("input[id='" + VolumeID + "']").val(volWeight);
    //    }
    //});
    elem.closest("div").find("table > tbody").find("[id^='areaTrans_shipment_shipmentdimension']").each(function () {
        //var currentId = $(this).attr("id");
        //var PieceID = currentId;

        var Width = $(this).find("input[id^='Width']").val() == "" ? "0" : $(this).find("input[id^='Width']").val();
        var Length = $(this).find("input[id^='Length']").val() == "" ? "0" : $(this).find("input[id^='Length']").val();
        var Height = $(this).find("input[id^='Height']").val() == "" ? "0" : $(this).find("input[id^='Height']").val();
        var Pieces = $(this).find("input[id^='Pieces']").val() == "" ? "0" : $(this).find("input[id^='Pieces']").val();

        var currentVolume = 0;
        if (Pieces != "" && Pieces != undefined) {
            currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
            //var volWeight = Math.ceil(currentVolume / divisor);
            var volWeight = (currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);
            VolumeCalculation = parseFloat(VolumeCalculation) + parseFloat(volWeight.toFixed(3));
            $(this).find("span[id^='VolumeWt']").html(volWeight.toFixed(3));
            $(this).find("input[id^='VolumeWt']").val(volWeight.toFixed(3));
        }
    });

    if (VolumeCalculation != 0) {
        $("span[id='DimVolumeWt']").html(VolumeCalculation.toFixed(3));
        $("input[id='DimVolumeWt']").val(VolumeCalculation.toFixed(3));
    }
    else {
        $("span[id='DimVolumeWt']").html(0);
        $("input[id='DimVolumeWt']").val(0);
    }
}

function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    //if (elem.closest("table").find("[id^='Pieces']").length < 2)
    $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
    $(elem).find("td[id^=transAction]").find("i[title='Add More']").hide();
    //fn_RemoveRow(elem);
    CalculateVolume(elem);

}

function beforeAddEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value);
    });
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }

    if (Pcs == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    //$(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = true;

    return true;
}


function beforeAddULDEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Text_ULDNo']").each(function () {
        Pcs = Pcs + 1;
    });
    var ManualPcs = 0;

    $("#divareaTrans_shipment_shipmentdimension").find('table:eq(0) > tbody').find("tr[data-popup='false']").each(function (row, i) {
        ManualPcs = $(i).find("td:nth-child(5) input[type=text]").val();
    });
    ManualPcs = ManualPcs == "" ? "0" : ManualPcs;
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='ULDNo']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='UldTareWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldPieces']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldGrossWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='ULDPivotWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldVolWt']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }
    //if (parseInt(Pcs) + 1 == parseInt($("#TotalPieces").val()) && parseInt(ManualPcs) == 0) {
    //    $("#divareaTrans_shipment_shipmentdimension").find('table:eq(0) > tbody').find("tr[data-popup='false']").each(function (row, i) {
    //        $(i).find("input[type=text]").removeAttr('data-valid');
    //    });
    //}
    if (parseInt(Pcs) + parseInt(ManualPcs) >= parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    //$(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = true;

    return true;
}


function AfterAddDim() {
    var elem = $("#areaTrans_shipment_shipmentdimension");
    //if (elem.closest("table").find("[id^='Pieces']").length >= 2)
    //    $('.disablechk').attr('disabled', 'disabled');
    var elem = $("#areaTrans_shipment_shipmentdimension");
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    Pcs = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
    var count = elem.closest("table").find("[id^='Pieces']").length - 2;
    elem.closest("table").find("td[id^=transAction]").find("i[title='Add More']").hide();
}


function handleAdd(elem, strid, pcsseq, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");

    var closestDiv = $(self).closest("div");

    addEventCallback = (addEventCallback == undefined ? null : addEventCallback);
    beforeAddEventCallback = (beforeAddEventCallback == undefined ? null : beforeAddEventCallback);
    removeEventCallback = (removeEventCallback == undefined ? null : removeEventCallback);

    var idCount = 0;
    var lastTable = $(closestDiv).find("[id^='areaTrans']:last");
    var lastAction = $(lastTable).find("[id^='transAction']");
    var myClone = $(self).clone(false);
    var linkText = 'Add more',
        linkClass = 'icon-trans-plus-sign',
        resetLinkText = 'Reset',
        resetLinkClass = 'icon-trans-refresh',
        enableRemove = true,
        removeLinkText = 'Delete',
        removeLinkClass = 'icon-trans-trash',
        confirmOnRemove = true,
        confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
        convertToControl = ConvertToControl,
        maxItemsAllowedToAdd = null,
        maxItemReachedCallback = null,
        searchType = false,
        isReset = false,
        data = [],
        isAdd = false,
        afterConvertMultiField = null;
    if (beforeAddEventCallback !== null) {
        var retVal = beforeAddEventCallback(elem.closest("[id^='areaTrans_']"));
        if (!retVal) {
            return false;
        }
    }

    var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
    var fieldCount = parseInt($(self).attr("FieldCount"), 10);
    if (maxItemsAllowedToAdd === null || totalCount < maxItemsAllowedToAdd) {
        var newElem = myClone.clone(true);
        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount).show();

        var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) - pcsseq.split(',').length).toString();
        $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
        $("span[id='" + remailpcsctrlid + "']").html(remainPcs);

        $(newElem).find("*[id!=''][name!='']").each(function () {
            if ($(this).attr("id")) {
                var strid = $(this).attr("id");
                var strname = "";
                var type = $(this).attr("type");

                $(this).closest("tr").find("td[id^='tdSNoCol']").text((totalCount + 1).toString());

                if ($(this).attr("name")) {
                    strname = $(this).attr("name");
                }
                if ($(this).attr("controltype") == "datetype") {
                    if ($(this).attr("endcontrol") != undefined) {
                        $(this).attr("endcontrol", $(this).attr("endcontrol") + "_" + totalCount)
                    }
                    if ($(this).attr("startcontrol") != undefined) {
                        $(this).attr("startcontrol", $(this).attr("startcontrol") + "_" + totalCount)
                    }
                }

                $(this).attr("id", strid + "_" + totalCount);
                if (strname != undefined)
                    $(this).attr("name", strname + "_" + totalCount);
                if (type != "radio" && type != "checkbox")
                    $(this).val("");
                if (type == "checkbox")
                    $(this).attr("validatename", strid + "_" + totalCount + "[]");
            }
        });

        $(newElem).closest("tr").find("span[id^='" + pcscontrolid + "']").text(pcsseq);
        $(newElem).closest("tr").find("input[id^='" + pcscontrolid + "']").val(pcsseq);
        totalCount++;
        fieldCount++;

        $(self).attr("TotalFieldsAdded", totalCount);
        $(self).attr("FieldCount", fieldCount);

        $(newElem).removeAttr("uniqueId");

        if (enableRemove && $(self).attr("uniqueId") != $(elem).closest("[id^='areaTrans']").attr("uniqueId")) {
            if ($(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).length === 0) {
                $(elem).closest("[id^='areaTrans']").find("#transAction").append(" <input type='button' class='" + removeLinkClass + "'value='" + removeLinkText + "'/>");
            }
            $(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(newElem).attr("uniqueId", linkClass + Math.random());
        //$(elem).parent().after(newElem);
        $(elem).closest("[id^='areaTrans']").after(newElem);

        $(elem).closest("[id^='areaTrans']").find("." + linkClass).remove();

        $(newElem).find("." + resetLinkClass).remove();
        $(newElem).find("." + linkClass).remove();
        $(newElem).find("." + removeLinkClass).remove();

        if (enableRemove) {
            if ($(newElem).find("." + removeLinkClass).length === 0) {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
            }
            $(newElem).find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(self).attr("maxCountReached", "false");
        if (isAdd) {
            if (linkClass != "scheduletransradiocss") {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                newElem.find("." + linkClass).unbind("click").click(function () {
                    if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                        return handleAdd($(this));
                    }
                });
            }
            else {
                $(newElem).find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                    if ($(this).val() == "1") {
                        if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                        else {
                            $(newElem).find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                $(this).removeAttr("checked");
                                if ($(this).val() == "0") {
                                    $(this).attr("checked", true);
                                }
                            });
                        }
                    }
                });
            }
        }
        if (convertToControl !== null) {
            convertToControl($(newElem), self);
        }
        if (addEventCallback !== null) {
            addEventCallback($(newElem), self);
        }
    }

    if (maxItemsAllowedToAdd !== null && totalCount >= maxItemsAllowedToAdd) {
        newElem.find("." + linkClass).hide();

        if (maxItemReachedCallback !== null) {
            maxItemReachedCallback($(newElem), self);
        }
    }
    return true;
}

function handleRemove(elem, strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var cnt = true;

    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");
    var linkText = 'Add more',
        linkClass = 'icon-trans-plus-sign',
        resetLinkText = 'Reset',
        resetLinkClass = 'icon-trans-refresh',
        enableRemove = true,
        removeLinkText = 'Delete',
        removeLinkClass = 'icon-trans-trash',
        confirmOnRemove = true,
        confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
        convertToControl = ConvertToControl,
        maxItemsAllowedToAdd = null,
        maxItemReachedCallback = null,
        searchType = false,
        isReset = false,
        data = [],
        isAdd = false,
        afterConvertMultiField = null;
    if (confirmOnRemove) {
        cnt = confirm(confirmationMsgOnRemove);
    }
    if (cnt) {
        var prevParent = $(elem).closest("[id^='areaTrans']").prev();

        var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
        totalCount--;

        $(self).attr("TotalFieldsAdded", totalCount);

        if ($(elem).closest("[id^='areaTrans']").find("." + linkClass).length >= 0) {
            if (enableRemove && $(self).attr("uniqueId") != $(prevParent).attr("uniqueId")) {
                if ($(prevParent).find("." + removeLinkClass).length === 0) {
                    $(prevParent).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
                }

                $(prevParent).find("." + removeLinkClass).unbind("click").click(function () {
                    return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid);
                });
            }
            var pieceSequence = $(elem).closest("tr").find("input[id^='" + pcscontrolid + "']").val();
            if (pieceSequence != undefined && pieceSequence != "") {
                var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) + pieceSequence.split(',').length).toString();
                $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
                $("span[id='" + remailpcsctrlid + "']").html(remainPcs);
            }
            $(elem).closest("[id^='areaTrans']").remove();
            $(prevParent).closest("div").find("." + linkClass).remove();
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                }
            }
            var idCount = 0;
            var parentID = $(prevParent).closest("div").find("[id^='areaTrans']:eq(0)").attr("id");
            $(prevParent).closest("div").find("[id^='areaTrans']:gt(0)").each(function () {
                $(this).attr("id", parentID + "_" + idCount);
                $(this).find("*[id!=''][name!='']").each(function () {
                    if ($(this).attr("id")) {
                        var strid = $(this).attr("id");
                        var strname = "";
                        $(this).closest("tr").find("td[id^='tdSNoCol']").text((idCount + 1).toString());
                        if ($(this).attr("name")) {
                            strname = $(this).attr("name");
                        }

                        if ($(this).attr("controltype") == "datetype") {
                            var EndControl = $(this).attr("endcontrol");

                            var StartControl = $(this).attr("startcontrol");
                            if (EndControl != undefined) {
                                $(this).attr("endcontrol", EndControl.substr(0, EndControl.lastIndexOf('_')) + "_" + idCount)
                            }
                            if (StartControl != undefined) {
                                $(this).attr("startcontrol", StartControl.substr(0, StartControl.lastIndexOf('_')) + "_" + idCount)
                            }
                        }
                        $(this).attr("id", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                        if (strname != undefined)
                            $(this).attr("name", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                    }
                });
                idCount++;
            });
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("." + linkClass).unbind("click").click(function () {
                        if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                    });
                }
                else {
                    $(prevParent).closest("div").find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                        if ($(this).val() == "1") {
                            if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                                return handleAdd($(this));
                            }
                            else {
                                $(prevParent).closest("div").find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                    $(this).removeAttr("checked");
                                    if ($(this).val() == "0") {
                                        $(this).attr("checked", true);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }

        if (maxItemsAllowedToAdd !== null && totalCount < maxItemsAllowedToAdd) {
            $(self).siblings().find("." + linkClass).show();
        }

        if (convertToControl !== null) {
            convertToControl($(prevParent), self);
        }
        if (removeEventCallback !== null) {
            removeEventCallback($(prevParent), self);
        }

    }
    return true;
}

var pageType = $('#hdnPageType').val();
function BindDimensionEventsNew() {
    var dbtableName = "AWBRateDesription";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/AcceptanceService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDNew",
        masterTableSNo: currentawbsno,
        caption: "Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
        { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
        {
            name: 'NoOfPieces', display: 'Pieces', type: 'text', value: '', ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 5 }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'GrossWeight', display: 'Gr. Wt.', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
        },
        {
            name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, addOnFunction: function (evt, rowIndex) { return CalculateRateTotal(); }, ctrlCss: { width: "90px" }, isRequired: false, AutoCompleteName: 'TransitFWB_RateClassCode', filterField: 'RateClassCode'
        },


        {
            name: 'CommodityItemNumber', display: 'Com. Item No.', type: 'text', value: 0, ctrlCss: { width: '90px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, }, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'ChargeableWeight', display: 'Ch. Wt.', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateChargeAmt(this);", }, isRequired: false, value: 0
        },
        {
            name: 'Charge', display: 'Charge', type: 'decimal3', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: false, value: 0
        },
        {
            name: 'ChargeAmount', display: 'Charge Amt.', type: 'decimal3', ctrlCss: { width: '70px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: false, value: 0
        },

        {
            name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 18, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
        },
        {
            name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, AutoCompleteName: 'TransitFWB_Country', filterField: 'CountryCode'
        },

        {
            name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20, }, isRequired: true
        },
        {
            name: 'ConsolDesc', display: 'Consol Desc.', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { Controltype: 'uppercase', maxlength: 20 }, isRequired: false
        },
        {
            name: 'hdnChildData', type: 'hidden', value: 0
        },
        {
            name: 'hdnVolWeight', type: 'hidden', value: 0
        },

        //{
        //    name: 'GetRate', display: 'Rate', type: 'custom',
        //    customBuilder: function (parent, idPrefix, name, uniqueIndex) {
        //        var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
        //        var ctrl = document.createElement('span');
        //        $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
        //        $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_GetRate', value: 'Get Rate', onclick: 'SearchData(this)' }).css('width', '75px').appendTo(ctrl).button();
        //        return ctrl;
        //    }
        //}
        //,
        {
            name: 'Dimension', display: 'Dimension', type: 'custom',
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                var ctrl = document.createElement('span');
                $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_btnDimension', value: 'Dimension', onclick: ' PopupDiv(this)' }).css('width', '75px').appendTo(ctrl).button();
                return ctrl;
            }
        }
        ],
        customFooterButtons: [
            { uiButton: { label: 'Get Rate', text: true }, btnAttr: { title: 'Get Rate' }, click: function (evt) { SearchData(this) }, atTheFront: true },
        ],
        afterRowRemoved: function (caller, rowIndex) {
            CalculateRateTotal();
        },

        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: false, remove: false }

    });
}

function CalculateVol(obj) {
    if ($(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_HdnMeasurementUnitCode_").val() == "") {
        ShowMessage('warning', 'Information!', "Select Mes. Unit.", "bottom-right");
        $(obj).val('');
        return false;
    }
    var Pcs, Len, Width, Height;
    Pcs = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Pieces_").val();
    Len = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Length_").val();
    Width = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Width_").val();
    Height = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Height_").val();

    if ($(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_HdnMeasurementUnitCode_").val() == "CMP")
        divisor = 6000;
    else
        divisor = 366;


    var currentVolume = 0;
    if (Pcs != "" && Pcs != undefined) {
        currentVolume = parseFloat(Pcs == "" ? "0" : Pcs) * parseFloat(Len == "" ? "0" : Len) * parseFloat(Width == "" ? "0" : Width) * parseFloat(Height == "" ? "0" : Height);
        var volWeight = Math.ceil(currentVolume / divisor);
        volWeight = (volWeight < 1 ? 1 : volWeight);
        $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_VolumeWeight_").val(volWeight);
        $(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_VolumeWeight_").val(volWeight);
    }

}
function BindDimensionEventsNewULD() {
    var dbtableName = "AWBRateDesriptionULD";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/FWBService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDRate",
        masterTableSNo: currentawbsno,
        isGetRecord: true,
        caption: "ULD Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
        { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
        {
            name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
        },
        {
            name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: 0, AutoCompleteName: 'TransitFWB_RateClassCode', filterField: 'RateClassCode'
        },
        {
            name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
        },
        {
            name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, AutoCompleteName: 'TransitFWB_ULD', filterField: 'ULDName'
        },
        {
            name: 'ULDNo', display: 'ULD No.', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 8, }, isRequired: true, onChange: function (evt, rowIndex) { }
        },

        {
            name: 'Charge', display: 'Charge', type: 'decimal3', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: 0, value: 0
        },
        {
            name: 'ChargeAmount', display: 'Charge Amt.', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: 0, value: 0
        },
        {
            name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 10, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
        },
        {
            name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, AutoCompleteName: 'TransitFWB_Country', filterField: 'CountryCode'
        },
        {
            name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: true
        }

        ],

        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function BindAWBOtherCharge() {
    var dbtableName = "AWBRateOtherCharge";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/FWBService.svc',
        getRecordServiceMethod: "GetAWBOtherChargeData",
        masterTableSNo: currentawbsno,
        caption: "Other Charges",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
        { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
        {
            name: pageType == 'EDIT' ? 'Type' : 'Type', display: 'Type', type: 'select', ctrlOptions: { 'P': 'PREPAID', 'C': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { CalculateRateTotal(); }, ctrlCss: { width: '80px' }
        },
        {
            name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CheckDuplicae(this)" }, ctrlCss: { width: "90px" }, isRequired: true, AutoCompleteName: 'TransitFWB_OtherCharge', filterField: 'OtherChargeCode'
        },
        {
            name: pageType == 'EDIT' ? 'DueType' : 'DueType', display: 'Due Carrier/Forwarder(Agent)', type: 'select', ctrlOptions: { 'A': 'Agent', 'C': 'Carrier' }, isRequired: true, onChange: function (evt, rowIndex) {
                //$("#" + evt.target.id.replace('_DueType', '_OtherCharge')).val('');
                //$("#" + evt.target.id.replace('_DueType', '_HdnOtherCharge')).val('');
                var x = evt.target.id.split('_')[2];
                $("#tblAWBRateOtherCharge").find("[id^='tblAWBRateOtherCharge_OtherCharge']").each(function (i, row) {
                    if (x != i + 1) {
                        if ($(this).val() == $("#" + evt.target.id).closest('td').prev().find('input').eq(0).val() && $(this).closest('td').next().find('select').val() == $("#" + evt.target.id).val()) {
                            jAlert("Other charge '" + $("#" + evt.target.id).closest('td').prev().find('input').eq(0).val() + $("#" + evt.target.id).val() + "' already exists for " + ($("#" + evt.target.id).val() == 'A' ? 'Agent' : 'Carrier'));
                            $("#" + evt.target.id).closest('td').prev().find('input').eq(0).val('');
                            $("#" + evt.target.id).closest('td').prev().find('input').eq(1).val('');
                            return;
                        }
                    }
                });
            }, ctrlCss: { width: '80px' }
        },
        {
            name: 'Amount', display: 'Amount', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: true, value: 0
        }
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $(caller).find("tbody tr:last").find("input[id*='tblAWBRateOtherCharge_Amount_']").val('');
            $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(WeightValuation[0].Key, WeightValuation[0].Text);// Added by RH for Other Charge 14-02-17
        },
        afterRowRemoved: function (caller, rowIndex) {// Added by RH for Other Charge 14-02-17
            SetOtherChargeValue();
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function CheckDuplicae(obj) {
    var x = $(obj).attr("id").split('_')[2];
    $("#tblAWBRateOtherCharge").find("[id^='tblAWBRateOtherCharge_OtherCharge']").each(function (i, row) {
        if (x != i + 1) {
            if ($(this).val() == $("#" + $(obj).attr('id')).val() && $(this).closest('td').next().find('select').val() == $(obj).closest('td').next().find('select').val()) {
                jAlert("Other charge '" + $("#" + $(obj).attr('id')).val() + $(obj).closest('td').next().find('select').val() + "' already exists for " + ($(obj).closest('td').next().find('select').val() == 'A' ? 'Agent' : 'Carrier'));
                $("#" + $(obj).attr('id')).val('');
                $("#" + $(obj).attr('id').replace('_OtherCharge', '_HdnOtherCharge')).val('');
                return;
            }
        }
    });
}

function SetAWBDefaultValues() {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetAWBRateDefaultValues?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            if (RateArray.length > 0) {
                for (i = 0; i < RateArray.length; i++) {
                    $('#tblAWBRateDesription').appendGrid('appendRow', [
                        {
                            NoOfPieces: RateArray[0]["TotalPieces"],
                            GrossWeight: RateArray[0]["TotalGrossWeight"],
                            WeightCode: "K",
                            RateClassCode: "",
                            CommodityItemNumber: "",
                            ChargeableWeight: RateArray[0]["ChargeableWeight"],
                            Charge: "",
                            ChargeAmount: "",
                            NatureOfGoods: RateArray[0]["NatureOfGoods"],
                            ConsolDesc: RateArray[0]["ConsolDesc"],
                        }
                    ]);
                }
            }

        },
        error: {

        }
    });


}
var SHCForGetRAte = '';
function BindAWBRate() {

    cfi.AutoCompleteV2("AWBCurrency", "CurrencyCode", "TransitFWB_AWBCurrency", null, "contains");


    cfi.AutoCompleteV2("Currency", "CurrencyCode", "TransitFWB_Currency", null, "contains");

    cfi.AutoCompleteV2("ChargeCode", "AWBChargeCode", "TransitFWB_ChargeCode", null, "contains");




    cfi.AutoCompleteByDataSource("Valuation", WeightValuation, EnableDisableChargeField);
    //cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);
    cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation, SetOtherChargeValue); // Added by RH for Other Charge 14-02-17

    cfi.AutoCompleteV2("CDCCurrencyCode", "CurrencyCode", "TransitFWB_Currency", null, "contains");
    cfi.AutoCompleteV2("CDCDestCurrencyCode", "CurrencyCode", "TransitFWB_Currency", null, "contains");

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetAWBRateDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            var TACTRateArray = Data.Table1;
            var userRateArray = Data.Table2;
            var SHCArray = Data.Table3;

            if (RateArray.length > 0) {

                $("#Text_AWBCurrency").data("kendoAutoComplete").setDefaultValue(RateArray[0].AWBCurrencySNo, RateArray[0].CurrencyCode);
                //$("#TotalFreight").val();
                //$("#TotalAmount").val();
                //--CVD
                $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDCurrencyCode, RateArray[0].CVDCurrencyCode);
                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDChargeCode, RateArray[0].CVDChargeCode);
                $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(RateArray[0].FreightType, RateArray[0].txtFreightType);
                $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDOtherCharges, RateArray[0].CVDOtherChargestext);


                $("#DecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(3));
                $("#_tempDecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(3));

                $("#DecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(3));
                $("#_tempDecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(3));

                $("#Insurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(3));
                $("#_tempInsurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(3));

                $("#ValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(3));
                $("#_tempValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(3));
                //-- CCD
                $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCCurrencyCode, RateArray[0].CDCCurrencyCode);
                $("#CDCConversionRate").val(RateArray[0].CDCCurrencyConversionRate == "" ? "" : parseFloat(RateArray[0].CDCCurrencyConversionRate).toFixed(6));
                $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCDestinationCurrencyCode, RateArray[0].CDCDestinationCurrencyCode);
                $("#CDCChargeAmount").val(RateArray[0].CDCChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCChargeAmount).toFixed(3));
                // $("#CDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));

                $("#CDCTotalCharAmount").data("kendoNumericTextBox").value(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));
                $("#TotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#_tempTotalFreight").val(RateArray[0].TotalPrepaidAmount);

                $("#TotalAmount").val(RateArray[0].TotalCollectAmount);
                $("#_tempTotalAmount").val(RateArray[0].TotalCollectAmount);


                if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
                    $('#CDCChargeAmount').removeAttr('disabled');
                    $('#CDCTotalCharAmount').removeAttr('disabled');
                    //$('#Text_CDCCurrencyCode').removeAttr('disabled');
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(true);
                    $('#CDCConversionRate').removeAttr('disabled');
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(true);
                } else {
                    $('#CDCChargeAmount').val('');
                    $('#_tempCDCChargeAmount').val('');
                    $('#CDCTotalCharAmount').val('');
                    $('#_tempCDCTotalCharAmount').val('');
                    $('#CDCConversionRate').val('');
                    $('#CDCChargeAmount').attr("disabled", "disabled");
                    $('#CDCTotalCharAmount').attr("disabled", "disabled");
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(false);
                    $('#CDCConversionRate').attr("disabled", "disabled");
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(false);
                    $('#Text_CDCCurrencyCode').val('');

                }
            }
            if (TACTRateArray.length > 0) {
                TactArray = [];
                var tactdata = {
                    AWBSNo: TACTRateArray[0].AWBSNo,
                    BaseOn: TACTRateArray[0].BaseOn,
                    ChargeableWeight: TACTRateArray[0].ChargeableWeight,
                    CommodityItemNumber: TACTRateArray[0].CommodityItemNumber,
                    GrossWeight: TACTRateArray[0].GrossWeight,
                    NatureOfGoods: TACTRateArray[0].NatureOfGoods,
                    NoOfPieces: TACTRateArray[0].NoOfPieces,
                    RateClassCode: TACTRateArray[0].RateClassCode,
                    Charge: TACTRateArray[0].Charge,
                    ChargeAmount: TACTRateArray[0].ChargeAmount,
                    WeightCode: TACTRateArray[0].WeightCode,
                }
                TactArray.push(tactdata);
                $("#txtTactRate").val(TACTRateArray[0].Charge);
                $("#_temptxtTactRate").val(TACTRateArray[0].Charge);
                $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate'>TACT Rate: " + TACTRateArray[0].Charge + "</span>");
            }
            if ($("#DecCarriageVal").val() == "")
                $("#_tempDecCarriageVal").val("NVD");
            $("#DecCarriageVal").val("NVD");
            if ($("#DecCustomsVal").val() == "")
                $("#_tempDecCustomsVal").val("NCV");
            $("#DecCustomsVal").val("NCV");
            if ($("#Insurance").val() == "")
                $("#_tempInsurance").val("XXX");
            $("#Insurance").val("XXX");
            $("#DecCarriageVal").bind("blur", function () {
                if ($("#DecCarriageVal").val() == "") {
                    $("#DecCarriageVal").val("NVD");
                    $("#_tempDecCarriageVal").val("NVD");
                }
            });

            $("#DecCustomsVal").bind("blur", function () {
                if ($("#DecCustomsVal").val() == "") {
                    $("#DecCustomsVal").val("NCV");
                    $("#_tempDecCustomsVal").val("NCV");
                }
            });

            $("#Insurance").bind("blur", function () {
                if ($("#Insurance").val() == "") {
                    $("#Insurance").val("XXX");
                    $("#_tempInsurance").val("XXX");
                }
            });

            if (userRateArray.length > 0) {
                $("input[type='checkbox'][value=" + userRateArray[0].PrintRateCode + "]").prop("checked", true);
                $("#txtPublishRate").val(userRateArray[0].PublishedRate == 0 ? "" : userRateArray[0].PublishedRate);
                $("#txtUserRate").val(userRateArray[0].UserRate == 0 ? "" : userRateArray[0].UserRate);
                $("textarea[id='txtRateRemarks']").val(userRateArray[0].RateDiffRemarks);
            }
            if (SHCArray.length > 0) {
                SHCForGetRAte = SHCArray[0].AWBSHC;
            }
            $("#CDCTotalCharAmount").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CDCChargeAmount").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CDCConversionRate").unbind("keypress").bind("keypress", function () {
                ISNumericNew(this);
            });

        },
        error: {

        }
    });
}
function EnableDisableChargeField() {
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
        $('#CDCChargeAmount').removeAttr('disabled');
        $('#CDCTotalCharAmount').removeAttr('disabled');
        $('#Text_CDCCurrencyCode').removeAttr('disabled');
        $('#CDCConversionRate').removeAttr('disabled');
        $('#Text_CDCDestCurrencyCode').removeAttr('disabled');
    } else {
        $('#CDCChargeAmount').val('');
        $('#_tempCDCChargeAmount').val('');
        $('#CDCTotalCharAmount').val('');
        $('#_tempCDCTotalCharAmount').val('');
        $('#CDCConversionRate').val('');
        $('#CDCChargeAmount').attr("disabled", "disabled");
        $('#CDCTotalCharAmount').attr("disabled", "disabled");
        $('#Text_CDCCurrencyCode').attr("disabled", "disabled");
        $('#CDCConversionRate').attr("disabled", "disabled");
        $('#Text_CDCDestCurrencyCode').attr("disabled", "disabled");
        $('#Text_CDCCurrencyCode').val('');
    }
    // calculate Total of rates fetched from Get Rate 
    CalculateRateTotal();
}

var CurrentRow;
function PopupDiv(obj) {
    CurrentRow = obj;
    var HidDataVal = $(obj).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val();
    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    if (HidDataVal != 0 && HidDataVal != "undefined") {
        $("#tblAWBRateDesriptionChild").appendGrid('load', JSON.parse(HidDataVal));
    }
    //else {
    //    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    //}

    $("div[id=ChildGrid]").not(':first').remove();
    if (!$("#ChildGrid").data("kendoWindow"))
        cfi.PopUp("ChildGrid", "", null, null, ShowAlert);
    else
        $("#ChildGrid").data("kendoWindow").open();
    //cfi.PopUp("ChildGrid", "", null, null, ShowAlert);

}
function ShowAlert(e) {
    //var strData;
    //var rows = $("tr[id^='tblAWBRateDesriptionChild']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    //getUpdatedRowIndex(rows.join(","), "tblAWBRateDesriptionChild");
    //strData = $('#tblAWBRateDesriptionChild').appendGrid('getStringJson');
    var childdata = [];
    $("#tblAWBRateDesriptionChild").find("tr[id^='tblAWBRateDesriptionChild_Row_']").each(function (i, row) {
        var dimInfo = {
            SNo: i + 1,
            AWBSNo: currentawbsno,
            Length: $(row).find("[id^=tblAWBRateDesriptionChild_Length_]").val() || "0",
            Width: $(row).find("[id^=tblAWBRateDesriptionChild_Width_]").val() || "0",
            Height: $(row).find("[id^=tblAWBRateDesriptionChild_Height_]").val() || "0",
            MeasurementUnitCode: $(row).find("[id^=tblAWBRateDesriptionChild_MeasurementUnitCode_]").val() || "0",
            Pieces: $(row).find("[id^=tblAWBRateDesriptionChild_Pieces_]").val() || "0",
            VolumeWeight: $(row).find("[id^=tblAWBRateDesriptionChild_VolumeWeight_]").val() || "0",
            VolumeUnit: $(row).find("[id^=tblAWBRateDesriptionChild_VolumeUnit_]").val() || "0",
            AWBRateDescriptionSNo: "0"
        }
        childdata.push(dimInfo);
    });

    $(CurrentRow).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val(JSON.stringify(childdata));
}
function BindDimensionChildGrid(tableid) {
    var dbtableName = tableid;
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/FWBService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDChild",
        isGetRecord: false,
        masterTableSNo: 10,
        caption: "Dimension Information",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
        { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
        {
            name: "MeasurementUnitCode", display: "Mes. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CalculateVol(this);" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: 'ImportInbound_MeasurementUnitCode', filterField: 'UnitCode'
        },
        {
            name: 'Length', display: 'Length', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'Width', display: 'Width', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'Height', display: 'Height', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
        },

        {
            name: 'Pieces', display: 'Pieces', type: 'text', value: 0, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
        },
        {
            name: "VolumeUnit", display: "Vol. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: 'ImportInbound_VolumeUnit', filterField: 'VolumeCode'
        },

        { name: 'AWBRateDescriptionSNo', type: 'hidden', value: 0 },

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

//--01-12
function deleteRecord(rowNo, settings) {
    var strData = $('#' + settings.tableID + '_SNo_' + rowNo).val();
    $('#' + settings.tableID).appendGrid('removeRow', null, rowNo);
    AjaxSucceeded("Row Deleted Successfully.");
}
function AutoCompleteDeleteCallBack(e, div, textboxid) {
    if (textboxid == "Text_SpecialHandlingCode" && div == "divMultiSpecialHandlingCode") {
        var target = e.target; // get current Span.
        var DivId = div; // get div id.
        var textboxid = textboxid; // get textbox id.
        var mid = textboxid.replace('Text', 'Multi');

        var arr = $("#" + mid).val().split(',');
        //var idx = arr.indexOf($(this)[0].id);
        //arr.splice(idx, $(e.target).attr("id"));
        var idx = arr.indexOf($(e.target).attr("id"));
        arr.splice(idx, 1);
        $("#" + mid).val(arr);
        $("#" + textboxid.replace('Text_', '')).val(arr);

        GetDGRDetailsAfterDelete(e);
    }
}
//--

function BindAWBSummary(isdblclick) {
    cfi.AutoCompleteV2("OPIAirportCity", "AirportCode", "TransitFWB_OPIAirportCity", null, "contains");

    cfi.AutoCompleteV2("OPIOfficeDesignator", "Code", "TransitFWB_OPIOfficeDesignator", null, "contains");

    cfi.AutoCompleteV2("OPIOtherAirportCity", "AirportCode", "TransitFWB_OPIOtherAirportCity", null, "contains");

    cfi.AutoCompleteV2("REFOthAirportCityCode", "AirportCode", "TransitFWB_REFOthAirportCityCode", null, "contains");


    cfi.AutoCompleteV2("ISUPlace", "CityCode", "TransitFWB_ISUPlace", null, "contains");





    AllowedSpecialChar("SSRDescription");
    AllowedSpecialChar("SSRDescription2");
    AllowedSpecialChar("SSRDescription3");

    AllowedSpecialChar("ARDFileRefrence");

    AllowedSpecialChar("OPIName");
    AllowedSpecialChar("OPIOtherFileReference");

    AllowedSpecialChar("SRIRefNumber");
    AllowedSpecialChar("SRISupInfo1");
    AllowedSpecialChar("SRISupInfo2");

    AllowedSpecialChar("CERSignature");
    $("div[id='__divsummary__']").find(":input").css("text-transform", "uppercase");
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetTransitAWBSummary?AWBSNo=" + currentawbsno + "&OfficeSNo=" + userContext.OfficeSNo || "0", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var SummaryArray = Data.Table0;
            var SenderRefArray = Data.Table1;

            var AirportCityData = [];
            var OfficeDesignatorData = [];
            var CompanyDesignatorData = [];

            if (SenderRefArray.length > 0) {
                for (i = 0; i < SenderRefArray.length; i++) {
                    var AirportCityinfo = {
                        Key: SenderRefArray[i]["AirportCity"],
                        Text: SenderRefArray[i]["AirportCity"]
                    };
                    var OfficeDesignatorinfo = {
                        Key: SenderRefArray[i]["OfficeDesignator"],
                        Text: SenderRefArray[i]["OfficeDesignator"]
                    };
                    var CompanyDesignatorinfo = {
                        Key: SenderRefArray[i]["CompanyDesignator"],
                        Text: SenderRefArray[i]["CompanyDesignator"]
                    };

                    AirportCityData.push(AirportCityinfo);
                    OfficeDesignatorData.push(OfficeDesignatorinfo);
                    CompanyDesignatorData.push(CompanyDesignatorinfo);
                }
            }
            cfi.AutoCompleteByDataSource("REFAirportCityCode", AirportCityData);
            cfi.AutoCompleteByDataSource("REFOfficeDesignator", OfficeDesignatorData);
            cfi.AutoCompleteByDataSource("REFCompDesignator", CompanyDesignatorData);


            if (SummaryArray.length > 0) {
                $('#CEDate').parent().css('width', '100px');
                //-- SSR (Special Service Request)
                $("#SSRDescription").val(SummaryArray[0].SpecialServiceRequest1);
                $("#SSRDescription2").val(SummaryArray[0].SpecialServiceRequest2);
                $("#SSRDescription3").val(SummaryArray[0].SpecialServiceRequest3);

                // ARD (Agent Reference Data)
                $("#ARDFileRefrence").val(SummaryArray[0].ARDFileRefrence);

                // OPI (Other Participant Information)
                $("#OPIName").val(SummaryArray[0].OPIName);
                $("#Text_OPIAirportCity").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIAirportCityCode, SummaryArray[0].OPIAirportCityCode);
                $("#Text_OPIOfficeDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIOfficeFunctionDesignator, SummaryArray[0].OPIOfficeFunctionDesignator);
                $("#OPICompDesignator").val(SummaryArray[0].OPICompanyDesignator);
                $("#OPIOtherFileReference").val(SummaryArray[0].OPIOtherParticipantOfficeFileReference);
                $("#OPIParticipantCode").val(SummaryArray[0].OPIParticipantCode);
                $("#_tempOPIParticipantCode").val(SummaryArray[0].OPIParticipantCode);
                $("#Text_OPIOtherAirportCity").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIOtherAirportCityCode, SummaryArray[0].OPIOtherAirportCityCode);

                // SRI (Shipment Reference Information)
                $("#SRIRefNumber").val(SummaryArray[0].SRIReferenceNumber);
                $("#SRISupInfo1").val(SummaryArray[0].SRISupplementaryShipmentInformation1);
                $("#SRISupInfo2").val(SummaryArray[0].SRISupplementaryShipmentInformation2);

                // SI (Shipper's Certification)
                $("#CERSignature").val(SummaryArray[0].CERSignature);

                // Carrier's Execution
                $("#CEDate").data("kendoDatePicker").value(SummaryArray[0].ISUDate);
                $("#Text_ISUPlace").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].ISUPlace, SummaryArray[0].ISUPlace);
                $("#ISUSignature").val(SummaryArray[0].ISUSignature);

                // Sender Reference
                $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFAirportCityCode, SummaryArray[0].REFAirportCityCode);
                $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOfficeFunctionDesignator, SummaryArray[0].REFOfficeFunctionDesignator);
                $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFCompanyDesignator, SummaryArray[0].REFCompanyDesignator);

                $("#REFCompDesignator").val(SummaryArray[0].REFCompanyDesignator);
                $("#REFOthPartOfficeFileRef").val(SummaryArray[0].REFOtherParticipantOfficeFileReference);
                $("#REFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#_tempREFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOtherAirportCityCode, SummaryArray[0].REFOtherAirportCityCode);
                //$("#Text_CORCustomsOriginCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].CORCustomsOriginCode, SummaryArray[0].CORCustomsOriginCode);
                $("#CORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
                //$("#_tempCORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
            }
            //if ($("#Text_REFAirportCityCode").data("kendoAutoComplete").key() == "") {
            //    $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(AirportCityData[0]["Key"], AirportCityData[0]["Key"]);
            //}
            //if ($("#Text_REFOfficeDesignator").data("kendoAutoComplete").key() == "") {
            //    $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(OfficeDesignatorData[0]["Key"], OfficeDesignatorData[0]["Key"]);
            //}
            //if ($("#Text_REFCompDesignator").data("kendoAutoComplete").key() == "") {
            //    $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(CompanyDesignatorData[0]["Key"], CompanyDesignatorData[0]["Key"]);
            //}


        },
        error: {

        }
    });
}


function SetTotalPcs() {
    var totalPcs = parseInt($("#tdPcs").html());
    var addedPcs = 0;
    var remainingPcs = totalPcs - addedPcs;
    $("input[id='RemainingPieces']").val(remainingPcs);
    $("span[id='RemainingPieces']").html(remainingPcs);

    $("input[id='Added']").val(addedPcs);
    $("span[id='Added").html(addedPcs);

    $("input[id='TotalPieces']").val(totalPcs);
    $("span[id='TotalPieces']").html(totalPcs);

}

function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");

    $("#divDetailSHC").html("");
    $("#divTab3").html("");
    $("#divTab4").html("");
    $("#divTab5").html("");
    $('#tabstrip ul:first li:eq(0) a').hide();
    $('#tabstrip ul:first li:eq(1) a').hide();
    $('#tabstrip ul:first li:eq(2) a').hide();
    $('#tabstrip ul:first li:eq(3) a').hide();
    $('#tabstrip ul:first li:eq(4) a').hide();

}

function SaveHandlingInfo() {
    var flag = false;
    //
    var osi = '';
    var OSIInfoModel = new Array();
    var OCIInfoModel = new Array();


    $("#divareaTrans_shipment_tfwbshipmentositrans table tr[data-popup='false']").each(function (row, i) {
        if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
            OSIInfoModel.push({ AWBSNo: currentawbsno, OSI: $(i).find('td:nth-child(2) input[type=text]').val() });
        }

    });

    $("#divareaTrans_shipment_tfwbshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
        //if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {

        OCIInfoModel.push({
            AWBSNo: currentawbsno,
            CountryCode: $(i).find("td:eq(1) > [id^='CountryCode']").val(),
            InfoType: $(i).find("td:eq(2) > [id^='InfoType']").val(),
            CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='CSControlInfoIdentifire']").val(),
            SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
        });
        // }
    });

    var osiViewModel;
    //var osiViewModel = {
    //    SCI: $("#SCI").val().toUpperCase(),
    //};

    var HandlingInfoArray = [];
    $("div[id$='areaTrans_shipment_tfwbshipmenthandlinginfo']").find("[id^='areaTrans_shipment_tfwbshipmenthandlinginfo']").each(function () {

        var type = $(this).find("[id^='Text_Type']").data("kendoAutoComplete").key();
        var message = $(this).find("[id^='Message']").val();
        var HandlingInfoViewModel = {
            AWBSNo: currentawbsno,
            HandlingMessageTypeSNo: type,
            Message: message
        };
        HandlingInfoArray.push(HandlingInfoViewModel);

    });
    var isAmmendment = $("#chkFWBAmmendMent").prop("checked") ? "1" : "0";
    var isChargableAmendment = $("#chkAmmendMentCharge").prop("checked") ? "1" : "0";
    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateTransitOSIInfoAndHandlingMessage", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, OSIInformation: osiViewModel, AWBHandlingMessage: HandlingInfoArray, AWBOSIModel: OSIInfoModel, AWBOCIModel: OCIInfoModel, UpdatedBy: 2, isAmmendment: isAmmendment, isChargableAmendment: isChargableAmendment }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //if (result == "0") {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Customs', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                $("#divDetail").html("");
                $("#tblShipmentInfo").hide();

                $("#btnSave").unbind("click");
                flag = true;
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Customs', result.split('?')[1], "bottom-right");
                flag = false;
            }
            else {
                ShowMessage('warning', 'Warning - Customs', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            }

        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customs', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveCustomerInfo() {
    var flag = false;
    var ShipperViewModel = {
        ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
        ShipperName: $("#SHIPPER_Name").val(),
        ShipperName2: $("#SHIPPER_Name2").val(),
        ShipperStreet: $("#SHIPPER_Street").val(),
        ShipperStreet2: $("#SHIPPER_Street2").val(),
        ShipperLocation: $("#SHIPPER_TownLocation").val(),
        ShipperState: $("#SHIPPER_State").val(),
        ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
        ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
        ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
        ShipperMobile: $("#SHIPPER_MobileNo").val(),
        ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
        ShipperEMail: $("#SHIPPER_Email").val(),
        ShipperFax: $("#SHipper_Fax").val(),
    };

    var ConsigneeViewMode = {
        ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
        ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
        ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
        ConsigneeStreet: $("#CONSIGNEE_Street").val(),
        ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
        ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
        ConsigneeState: $("#CONSIGNEE_State").val(),
        ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
        ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
        ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
        ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
        ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
        ConsigneeEMail: $("#CONSIGNEE_Email").val(),
        ConsigneeFax: $("#CONSIGNEE_Fax").val(),
    };

    var AgentViewMode = {
        AgentAccountNo: $("#AGENT_AccountNo").val(),
        AgentParticipant: $("#AGENT_Participant").val(),
        IATACode: $("#AGENT_IATACODE").val(),
        Name: $("#AGENT_Name").val(),
        IATACASSAddress: $("#AGENT_IATACASSADDRESS").val(),
        AgentPlace: $("#AGENT_PLACE").val(),
    };

    var NotifyModel = {
        NotifyName: $("#Notify_Name").val(),
        NotifyName2: $("#Notify_Name2").val(),
        NotifyCountryCode: $("#Text_Notify_CountryCode").data("kendoAutoComplete").key(),
        NotifyCityCode: $("#Text_Notify_City").data("kendoAutoComplete").key(),
        NotifyMobile: $("#Notify_MobileNo").val(),
        NotifyMobile2: $("#Notify_MobileNo2").val(),
        NotifyAddress: $("#Notify_Address").val(),
        NotifyAddress2: $("#Notify_Address2").val(),
        NotifyState: $("#Notify_State").val(),
        NotifyPlace: $("#Notify_Place").val(),
        NotifyPostalCode: $("#Notify_PostalCode").val(),
        NotifyFax: $("#Notify_Fax").val(),
    }
    var NominyModel = {
        NominyName: $("#Nominate_Name").val(),
        NominyAddress: $("#Nominate_Place").val(),
    }
    var isAmmendment = $("#chkFWBAmmendMent").prop("checked") ? "1" : "0";
    var isChargableAmendment = $("#chkAmmendMentCharge").prop("checked") ? "1" : "0";
    var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
    var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";

    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateTransitShipperAndConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, AgentInfo: AgentViewMode, NotifyModel: NotifyModel, NominyModel: NominyModel, UpdatedBy: 2, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", isAmmendment: isAmmendment, isChargableAmendment: isChargableAmendment, CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //if (result.split('?')[0] == "0") {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                flag = true;
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Customer', result.split('?')[1], "bottom-right");
                flag = false;
            }
            else {
                ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            flag = false;
        }
    });
    return flag;
}

function SaveReservationInfo() {
    var flag = false;
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var awbNo = $("#AWBNo").val();
    var IsCourier = ($("[id='ShipmentType']:checked").val() == 1),
        ShowSlacDetails = false,//$("[id='ShowSlacDetails']:checked").val(),
        AWBNo = $("#AWBNo").val(),
        //AgentBranchSNo = $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
        AWBTotalPieces = $("#Pieces").val(),
        CommoditySNo = $("#Text_Commodity").data("kendoAutoComplete").key(),
        GrossWeight = $("#GrossWt").val(),
        VolumeWeight = $("#VolumeWt").val(),
        ChargeableWeight = $("#ChargeableWt").val(),
        Pieces = $("#Pieces").val()

    // Validate FWB and NOG Pieces and Gross weight
    var NogFlag = true;
    var FWBPieces = parseInt(($("#Pieces").val() || 0) == 0 ? ($("#_tempPieces").val() || 0) : ($("#Pieces").val() || 0));
    var FWBGrossWeight = ($("#GrossWt").val() || 0) == 0 ? ($("#_tempGrossWt").val() || 0) : ($("#GrossWt").val() || 0);
    var NogPcs = 0;
    var NogWt = 0;
    var NogMessage = '';
    if (IsAgentBUP != 1) {
        $("div[id$='divareaTrans_shipment_tfwbshipmentnog']").find("[id^='areaTrans_shipment_tfwbshipmentnog']").each(function () {
            NogPcs += parseInt(($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0));
            NogWt += parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0));
        });
        if (!NogPcs == 0 || !NogWt == 0) {
            if ((FWBPieces != parseInt(NogPcs)) && (FWBGrossWeight == parseFloat(NogWt))) {
                NogFlag = false;
                NogMessage = 'FWB Pieces Does not match with Nature of Goods Details Pieces';
            }
            else if ((FWBPieces == parseInt(NogPcs)) && (FWBGrossWeight != parseFloat(NogWt))) {
                NogFlag = false;
                NogMessage = ' FWB Gr. Wt. Does not match with Nature of Goods Details Gr. Wt.';
            }
            else if ((FWBPieces != parseInt(NogPcs)) && (FWBGrossWeight != parseFloat(NogWt))) {
                NogFlag = false;
                NogMessage = ' FWB Pieces,Gr. Wt. Does not match with Nature of Goods Details Pieces,Gr. Wt.';
            }
            if (NogFlag == false) {
                ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', NogMessage, "bottom-right");
                return false;
            }
        }
    }

    //--  Check SHC SubGroup Selected or Not 
    var SubGroupValid = true;
    var InvalidSPHC = "";
    $("#divareaTrans_shipment_shipmentSHCSubGroup").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup']").each(function (i, row) {
        if ($(row).find("input[id^='StatementDesc']").val() == undefined) {
            if (($(row).find("input[id^='SHCSNo_']").val() != "") && ($(row).find("input[id^='Multi_SubGroup_']").val() == "")) {
                SubGroupValid = false;
                if (InvalidSPHC == "") {
                    InvalidSPHC = $(row).find("input[id^='SHC_']").val();
                } else {
                    InvalidSPHC = InvalidSPHC + "," + $(row).find("input[id^='SHC_']").val();
                }
            }
        } else {
            if (($(row).find("input[id^='SHCSNo_']").val() != "") && ($(row).find("input[id^='Multi_SubGroup_']").val() == "") && ($(row).find("input[id^='StatementDesc']").val() == "")) {
                SubGroupValid = false;
                if (InvalidSPHC == "") {
                    InvalidSPHC = $(row).find("input[id^='SHC_']").val();
                } else {
                    InvalidSPHC = InvalidSPHC + "," + $(row).find("input[id^='SHC_']").val();
                }
            }
        }
        if ($(row).find("input[id^='PackingLabel']").val() != undefined) {
            if ($(row).find("input[id^='PackingLabel']").val() == "") {
                SubGroupValid = false;
                if (InvalidSPHC == "") {
                    InvalidSPHC = $(row).find("input[id^='SHC_']").val();
                } else {
                    if (InvalidSPHC.indexOf($(row).find("input[id^='SHC_']").val()) < 0) {
                        InvalidSPHC = InvalidSPHC + "," + $(row).find("input[id^='SHC_']").val();
                    }
                }
            }
        }
    });
    if (SubGroupValid == false) {
        if (!$("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow")) {
            cfi.PopUp("divareaTrans_shipment_shipmentSHCSubGroup", "SHC Sub Group Details", 800);
            $("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow").open();
        }
        else {
            $("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow").open();
        }
        ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', "Select Sub Group/ Mandatory Info for SHC [ " + InvalidSPHC + " ]", "bottom-right");
        return false;
    }
    // check DGR Pieces added or not
    var DGRPcs = 0, FWBPcs = 0;
    DGRPcs = $("#txtDGRPieces").val() || 0;
    FWBPcs = $("#Pieces").val() || 0;
    var messg = '', Flag = true;
    if ($("#txtDGRPieces").attr("disabled") !== "disabled") {
        if (parseInt(DGRPcs) <= 0) {
            messg = "Kindly enter DGR Pieces to proceed.";
            Flag = false;
        } else if (parseInt(DGRPcs) > parseInt(FWBPcs)) {
            messg = "DGR pieces [ " + DGRPcs.toString() + " ] can not be greater than FWB Pieces [ " + FWBPcs.toString() + " ]";
            Flag = false;
        }
    }
    // Check Temp details of SPHC
    var SHCTemp = [];
    if (TempArray.length > 0) {
        $("div[id='divareaTrans_shipment_tfwbshctemp']").find("tr[id^='areaTrans_shipment_tfwbshctemp']").each(function () {
            if ($(this).find("input[id^='Text_TEMPSHCCode']").data("kendoAutoComplete").key() == "" || ($(this).find("input[id^='StartTemperature']").val() || 0) == 0 || ($(this).find("input[id^='EndTemperature']").val() || 0) == 0 || ($(this).find("input[id^='TEMPPieces']").val() || 0) == 0) {
                messg = "Temp Details are required.";
                Flag = false;
                if (!$("#divareaTrans_shipment_tfwbshctemp").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_shipment_tfwbshctemp", "SHC Sub Group Details", 800);
                    $("#divareaTrans_shipment_tfwbshctemp").data("kendoWindow").open();
                }
                else {
                    $("#divareaTrans_shipment_tfwbshctemp").data("kendoWindow").open();
                }
            }
        });
    }

    if (Flag == false) {
        ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', messg, "bottom-right");
        return false;
    }

    if (TempArray.length > 0) {
        $("div[id$='divareaTrans_shipment_tfwbshctemp']").find("[id^='areaTrans_shipment_tfwbshctemp']").each(function () {
            var SHCModel = {
                AWBSNo: currentawbsno,
                SHCSNo: $(this).find("input[id^='Text_TEMPSHCCode']").data("kendoAutoComplete").key(),
                StartTemp: $(this).find("input[id^='StartTemperature']").val() || 0,
                EndTemp: $(this).find("input[id^='EndTemperature']").val() || 0,
                Pieces: $(this).find("input[id^='TEMPPieces']").val() || 0,
            };
            SHCTemp.push(SHCModel);
        });
    }
    var ShipmentInfo = {
        IsCourier: $("[id='ShipmentType']:checked").val(),//($("[id='ShipmentType']:checked").val() == 0 ? 1 : 2),
        ShowSlacDetails: false,
        AWBNo: $("#AWBNo").val(),
        AgentBranchSNo: $("#IssuingAgent").val(),
        AWBTotalPieces: $("#Pieces").val(),
        CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
        GrossWeight: $("#GrossWt").val(),
        VolumeWeight: $("#VolumeWt").val(),
        ChargeableWeight: $("#ChargeableWt").val(),
        Pieces: $("#Pieces").val(),
        ProductSNo: $("#Text_Product").data("kendoAutoComplete").key() || 1,
        IsPrepaid: ($("[id='FreightType']:checked").val() == 0),
        OriginCity: $("#Text_ShipmentOrigin").data("kendoAutoComplete").key(),
        DestinationCity: $("#Text_ShipmentDestination").data("kendoAutoComplete").key(),
        XRayRequired: ($("[id='X-RayRequired']:checked").val() == 0),
        NoOfHouse: ($("#NoofHouse").val() == "" ? 0 : $("#NoofHouse").val()),
        HouseFeededBy: "",
        AWBDate: cfi.CfiDate("AWBDate"),
        //NatureOfGoods: $("#NatureofGoods").val(),
        NatureOfGoodsSNo: $("#Text_NatureofGoods").data("kendoAutoComplete").key(),
        NatureOfGoods: $("#OtherNOG").val(),
        IsBup: $("#chkisBup").prop('checked') == false ? 0 : 1,
        buptypeSNo: $("#Text_buptype").data("kendoAutoComplete").key(),
        DensityGroupSNo: $("#Text_densitygroup").data("kendoAutoComplete").key(),
        AirlineSNo: $("#Text_CarrierCode").data("kendoAutoComplete").key(),
        CBM: $("#CBM").val(),
        DGRPcs: $("#txtDGRPieces").val() || 0,
        DRYICEasRefrigerant: $("#chkDryIce").prop('checked') == false ? 0 : 1,
    };
    var ShipmentSPHCArray = [];
    if ($("#Multi_SpecialHandlingCode").val() != "") {
        var sphcarr = $("#Multi_SpecialHandlingCode").val().split(",")
        for (i = 0; i < sphcarr.length; i++) {
            var ShipmentSPHCInfo = {
                AWBSNo: awbSNo,
                AWBNo: $("#AWBNo").val(),
                SPHCCode: sphcarr[i]
            };
            ShipmentSPHCArray.push(ShipmentSPHCInfo);
        }
    }

    var DGRArray = [];

    $("div[id$='divareaTrans_shipment_tfwbshipmentclasssphc']").find("[id^='areaTrans_shipment_tfwbshipmentclasssphc']").each(function () {
        if (DGRSPHC.length > 0) {
            if (($("#AWBNo").attr("disabled") || "") == "") {
                var DGRViewModel = {
                    SPHCSNo: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                    SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                    DGRSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                    UNNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0],
                    //DGRShipperSNo: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").key(),
                    //ProperShippingName: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                    DGRShipperSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                    ProperShippingName: "",
                    Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                    SubRisk: $(this).find("[id^='Text_SubRisk']").data("kendoAutoComplete").key(),
                    PackingGroup: $(this).find("[id^='Text_PackingGroup']").data("kendoAutoComplete").key(),
                    Pieces: $(this).find("[id^='DGRPieces']").val() || 0,
                    NetQuantity: $(this).find("[id^='NetQuantity']").val() || 0,
                    Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                    Quantity: $(this).find("[id^='Quantity']").val() || 0,
                    PackingInst: $(this).find("[id^='Text_PackingInst']").data("kendoAutoComplete").key(),
                    RAMCategory: $(this).find("[id^='RamCat']").val(),
                    ERGN: $(this).find("[id^='Text_ERG']").data("kendoAutoComplete").key(),
                    Commodity: $(this).find("[id^='DGRCommodity']").val(),
                };
                DGRArray.push(DGRViewModel);
            }
        }
    });

    var FlightArray = [];
    $("div[id$='areaTrans_shipment_tfwbshipmentitinerary']").find("[id^='areaTrans_shipment_tfwbshipmentitinerary']").each(function () {
        //if ($(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").key() != "") {
        var FlightViewModel = {
            FPSNo: $(this).find("input[id^='FPSNo']").val() || 0,
            DailyFlightSNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").key() || 0,
            BoardPoint: $(this).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").key(),
            OffPoint: $(this).find("[id^='Text_offPoint']").data("kendoAutoComplete").key(),
            FlightDate: cfi.CfiDate($(this).find("[id^='FlightDate']").attr("id")),
            FlightNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").value()
        };
        FlightArray.push(FlightViewModel);
        //}
    });

    // NOG Details
    var NOGArray = [];
    $("div[id$='areaTrans_shipment_tfwbshipmentnog']").find("[id^='areaTrans_shipment_tfwbshipmentnog']").each(function () {
        var pcs = $(this).find("input[id^='Pieces']").val() || 0;//($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0);
        var grwt = $(this).find("input[id^='NogGrossWt']").val() || 0; //($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0);
        var Nog = $(this).find("input[id^='NOG']").val();
        var NogSNo = $(this).find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").key() || "0";
        if (parseInt(pcs) > 0 || parseFloat(grwt) > 0 || Nog != "" || parseInt(NogSNo) > 0) {
            var NOGModel = {
                AWBSNo: currentawbsno,
                NogPieces: $(this).find("input[id^='Pieces']").val() || 0,//($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0),
                NogGrossWt: $(this).find("input[id^='NogGrossWt']").val() || 0,//($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0),
                NogSNo: $(this).find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").key() || "0",
                NOG: $(this).find("input[id^='NOG']").val(),
            };
            NOGArray.push(NOGModel);
        }
    });

    var SHCSubGroupArray = [];
    $("#divareaTrans_shipment_shipmentSHCSubGroup").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup']").each(function (i, row) {
        var SubGroupModel = {
            AWBSNo: currentawbsno,
            SHCSNo: $(row).find("input[id^='SHCSNo_']").val() || 0,
            SubGroupSno: $(row).find("input[id^='Multi_SubGroup_']").val() || 0,
            MandatoryInfo: $(row).find("input[id^='StatementDesc_']").val() || "",
            PackingInst: $(row).find("input[id^='PackingLabel_']").val() || "",
        };
        SHCSubGroupArray.push(SubGroupModel);
    });


    var DalyFlghtSno, Origin, Dest, ValidFlag, Messg, IsManifested, IsLateAccepTance;
    ValidFlag = true;
    DalyFlghtSno = $("#Text_FlightNo").data("kendoAutoComplete").key();
    Origin = $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
    Dest = $("#Text_ShipmentDestination").data("kendoAutoComplete").key();
    var BkdWeight = '';
    ////if (DalyFlghtSno > 0) {
    ////    $.ajax({
    ////        url: "Services/Shipment/AcceptanceService.svc/ValidateCutoffTime?DlyFlghtSno=" + DalyFlghtSno + "&Origin=" + Origin + "&Dest=" + Dest + "&GrossWeight=" + $("#GrossWt").val() + "&VolumeWeight=" + $("#VolumeWt").val() + "&AWBSNo=" + awbSNo + "&SPHC=" + $("#Multi_SpecialHandlingCode").val(), async: false, type: "get", dataType: "json", cache: false,
    ////        contentType: "application/json; charset=utf-8",
    ////        success: function (result) {
    ////            var retdata = jQuery.parseJSON(result);
    ////            var ValidateMsgData = retdata.Table0;
    ////            BkdWeight = retdata.Table1[0].weightmsg;
    ////            IsManifested = retdata.Table2[0].IsManifested;
    ////            IsLateAccepTance = retdata.Table3[0].IsLateAccepTance;
    ////            ManifestMessage = retdata.Table4[0].ManifestMessage;

    ////            if (ValidateMsgData[0].ValidationMsg != "") {
    ////                Messg = ValidateMsgData[0].ValidationMsg;
    ////                ValidFlag = false;
    ////            }
    ////        }
    ////    });

    ////}
    ////if (IsManifested == "1") {
    ////    jAlert(ManifestMessage);
    ////    var FirstRow = $("div[id='divareaTrans_shipment_shipmentitinerary']").find("tr[id^='areaTrans_shipment_shipmentitinerary']:first");
    ////    FirstRow.find("input[id^='FlightDate']").data("kendoDatePicker").value("");
    ////    FirstRow.find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
    ////    FirstRow.find("input[id^='Text_FlightNo']").removeAttr("data-valid");
    ////    return false;
    ////}
    ////if (ValidFlag == false) {
    ////    ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', Messg, "bottom-right");
    ////    return false;
    ////}

    //if (BkdWeight != "") {
    //    var r = confirm(BkdWeight + "!");
    //    if (r == false) {
    //        return false;
    //    }
    //}

    //$.ajax({
    //    url: "Services/Shipment/FWBService.svc/SaveTransitAcceptance", async: false, type: "POST", dataType: "json", cache: false,
    //    data: JSON.stringify({ AWBNo: $("#AWBNo").val(), AWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCArray, listItineraryInformation: FlightArray, AWBDGRTrans: DGRArray, UpdatedBy: 2 }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        if (result == "") {
    //            //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
    //            ShowMessage('success', 'Success - FWB', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
    //            $("#btnSave").unbind("click");
    //            flag = true;
    //        }
    //        else
    //            ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
    //    },
    //    error: function (xhr) {
    //        ShowMessage('warning', 'Warning - FWB', "AWB No. [" + awbNo + "] -  unable to process.", "bottom-right");

    //    }
    //});
    var isAmmendment = $("#chkFWBAmmendMent").prop("checked") ? "1" : "0";
    var isChargableAmendment = $("#chkAmmendMentCharge").prop("checked") ? "1" : "0";

    if (BkdWeight != "") {
        //var r = confirm(BkdWeight + "!");
        var r = jConfirm(BkdWeight, "", function (r) {
            if (r == true) {
                if (IsManifested == "1") {
                    var FirstRow = $("div[id='divareaTrans_shipment_tfwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first");
                    FirstRow.find("input[id^='FlightDate']").data("kendoDatePicker").value("");
                    FirstRow.find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    FirstRow.find("input[id^='Text_FlightNo']").removeAttr("data-valid");
                    return false;
                }
                $.ajax({
                    url: "Services/Shipment/FWBService.svc/SaveTransitAcceptance", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ AWBNo: $("#AWBNo").val(), AWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCArray, listItineraryInformation: FlightArray, AWBDGRTrans: DGRArray, UpdatedBy: 2, isAmmendment: isAmmendment, IsLateAccepTance: IsLateAccepTance, NOGArray: NOGArray, SHCSubGroupArray: SHCSubGroupArray, isChargableAmendment: isChargableAmendment, SHCTemp: SHCTemp }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result == "") {
                            ShowMessage('success', 'Success - FWB Saved Successfully', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                            $("#btnSave").unbind("click");
                            flag = true;
                            if (isSaveAndNext == "1") {
                                FlightDateForGetRate = $("#divareaTrans_shipment_tfwbshipmentitinerary").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                FlightNoForGetRate = $("#divareaTrans_shipment_tfwbshipmentitinerary").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight No value after save and next
                                //$("#divDetailSHC").html("");
                                //ReloadSameGridPage("RATE");
                                // $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                                //ShowProcessDetailsNew("RATE", "divDetailSHC", false, "2104");
                                $("#ulTab li").eq(0).css("background-color", TabColor);
                                $('#tabstrip ul:first li:eq(1) a').click();
                            } else {
                                ShipmentSearch();
                                CleanUI();
                            }
                        }
                        else if (result.split('?')[0] == "1") {
                            ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                            flag = true;
                        }
                        else
                            ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', result + ".", "bottom-right");
                    },
                    error: function (xhr) {
                        ShowMessage('warning', 'Warning - FWB', "AWB No. [" + awbNo + "] -  unable to process.", "bottom-right");

                    }
                });
            } else {

            }
        });
        if (r == false) {
            return false;
        }
    } else {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveTransitAcceptance", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBNo: $("#AWBNo").val(), AWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCArray, listItineraryInformation: FlightArray, AWBDGRTrans: DGRArray, UpdatedBy: 2, isAmmendment: isAmmendment, IsLateAccepTance: IsLateAccepTance, NOGArray: NOGArray, SHCSubGroupArray: SHCSubGroupArray, isChargableAmendment: isChargableAmendment, SHCTemp: SHCTemp }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - FWB Saved Successfully', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                    if (isSaveAndNext == "1") {
                        FlightDateForGetRate = $("#divareaTrans_shipment_tfwbshipmentitinerary").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                        FlightNoForGetRate = $("#divareaTrans_shipment_tfwbshipmentitinerary").find("tr[id^='areaTrans_shipment_tfwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight No value after save and next  
                    } else {
                        ShipmentSearch();
                        CleanUI();
                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - FWB', "AWB No. [" + awbNo + "] -  unable to process.", "bottom-right");

            }
        });
    }
    return flag;
}

function CalculatePieces(obj) {
    //var CurRow = $(obj).closest("tr");
    //var TotalPieces = parseInt(($("#Pieces").val() || 0) == 0 ? ($("#_tempPieces").val() || 0) : ($("#Pieces").val() || 0));
    //var CurrentPieces = parseInt(($(CurRow).find("input[id^='Pieces']").val() || 0) == 0 ? ($(CurRow).find("input[id^='_tempPieces']").val() || 0) : ($(CurRow).find("input[id^='Pieces']").val() || 0));
    //var TotalGrWeight = ($("#GrossWt").val() || 0) == 0 ? ($("#_tempGrossWt").val() || 0) : ($("#GrossWt").val() || 0);

    //var pc = 0;
    //var wt = 0;

    //$("div[id$='divareaTrans_shipment_fwbshipmentnog']").find("[id^='areaTrans_shipment_fwbshipmentnog']").each(function (i, row) {
    //    if (CurRow.index() != (i + 1)) {
    //        pc = pc + parseInt(($(row).find("input[id^='Pieces']").val() || 0) == 0 ? ($(row).find("input[id^='_tempPieces']").val() || 0) : ($(row).find("input[id^='Pieces']").val() || 0));
    //    }
    //});
    //var RemPcs = TotalPieces - pc;

    //if (($(CurRow).find("td[id^='tdSNoCol']").text() || 0) != 5) {
    //    if (TotalPieces - (CurrentPieces + pc) <= 0)
    //        $(CurRow).find("input[id*='Pieces']").val(TotalPieces - pc);
    //    else
    //        $(CurRow).next().find("input[id*='Pieces']").val(RemPcs);

    //    //else if ((pc + $(obj).val()) > TotalPieces) {

    //    //}
    //}
    //else {
    //    $(CurRow).find("input[id*='Pieces']").val(TotalPieces - pc);
    //}

}

function SaveDimensionInfoNew() {
    var flag = false;

    var strData, strData2;
    var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");

    var rows2 = $("tr[id^='tblAWBRateDesriptionULD']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesriptionULD");

    var rows3 = $("tr[id^='tblAWBRateOtherCharge']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateOtherCharge");

    strData = $('#tblAWBRateDesription').appendGrid('getStringJson');
    strData2 = $('#tblAWBRateDesriptionULD').appendGrid('getStringJson');
    strData3 = $('#tblAWBRateOtherCharge').appendGrid('getStringJson');

    if ($("#txtUserRate").val() || 0 != 0) {
        if (parseFloat($("#txtPublishRate").val() || 0) != parseFloat($("#txtUserRate").val() || 0)) {
            if (($("textarea[id^='txtRateRemarks']").val() || "") == "") {
                ShowMessage('warning', 'Warning - Rate', "Published Rate and Manually Entered Rate does not match. Kindly enter remarks to proceed.", "bottom-right");
                return false;
            }
        }
    }
    //if (($("#txtTactRate").attr("readonly") || "") == "") {
    //    if (parseFloat($("#txtTactRate").val() || 0) <= 0) {
    //        ShowMessage('warning', 'Warning - Rate', "Kindly enter TACT Rate to proceed.", "bottom-right");
    //        return false;
    //    }
    //}

    if (strData == false || strData2 == false || strData3 == false) { return false; }
    var DimArray = [];
    var ULDDimArray = [];
    var OtherCharge = [];
    var AWBRateArray = [];
    if (strData != "[]") {
        $("#tblAWBRateDesription tbody tr").each(function (index, row) {
            var DimData = {
                AWBSNo: currentawbsno,
                Charge: $(row).find("[id^=tblAWBRateDesription_Charge_]").val() || "0",
                ChargeAmount: $(row).find("[id^=tblAWBRateDesription_ChargeAmount_]").val() || "0",
                ChargeableWeight: $(row).find("[id^=tblAWBRateDesription_ChargeableWeight_]").val() || "0",
                CommodityItemNumber: $(row).find("[id^=tblAWBRateDesription_CommodityItemNumber_]").val(),
                GrossWeight: $(row).find("[id^=tblAWBRateDesription_GrossWeight_]").val(),
                NatureOfGoods: $(row).find("[id^=tblAWBRateDesription_NatureOfGoods_]").val(),
                NoOfPieces: $(row).find("[id^=tblAWBRateDesription_NoOfPieces_]").val(),
                RateClassCode: $(row).find("[id^=tblAWBRateDesription_HdnRateClassCode_]").val(),
                SNo: index + 1,
                WeightCode: $(row).find("[id^=tblAWBRateDesription_WeightCode_]").val(),
                hdnChildData: $(row).find("[id^=tblAWBRateDesription_hdnChildData_]").val(),
                HarmonisedCommodityCode: $(row).find("[id^=tblAWBRateDesription_HarmonisedCommodityCode_]").val(),
                CountrySNo: $(row).find("[id^=tblAWBRateDesription_HdnCountry_]").val(),
                CountryCode: $(row).find("[id^=tblAWBRateDesription_Country_]").val().split('-')[0],
                ConsolDesc: $(row).find("[id^=tblAWBRateDesription_ConsolDesc_]").val()
            }
            DimArray.push(DimData);
        });
    }

    if (strData2 != "[]") {
        $("#tblAWBRateDesriptionULD").find("tr[id^='tblAWBRateDesriptionULD_Row_']").each(function (index, row) {
            var ULDDimData = {
                AWBSNo: currentawbsno,
                ChargeLineCount: index + 1,
                WeightCode: $(row).find("[id^=tblAWBRateDesriptionULD_WeightCode_]").val(),
                RateClassCode: $(row).find("[id^=tblAWBRateDesriptionULD_RateClassCode_]").val().trim(),
                SLAC: $(row).find("[id^=tblAWBRateDesriptionULD_SLAC_]").val(),
                ULDTypeSNo: $(row).find("[id^=tblAWBRateDesriptionULD_HdnULD_]").val(),
                ULDTypeCode: $(row).find("[id^=tblAWBRateDesriptionULD_ULD_]").val(),
                ULDNo: $(row).find("[id^=tblAWBRateDesriptionULD_ULDNo_]").val(),// ULD No
                Charge: $(row).find("[id^=tblAWBRateDesriptionULD_Charge_]").val(),
                ChargeAmount: $(row).find("[id^=tblAWBRateDesriptionULD_ChargeAmount_]").val(),
                HarmonisedCommodityCode: $(row).find("[id^=tblAWBRateDesriptionULD_HarmonisedCommodityCode_]").val(),
                CountrySNo: $(row).find("[id^=tblAWBRateDesriptionULD_HdnCountry_]").val(),
                CountryCode: $(row).find("[id^=tblAWBRateDesriptionULD_Country_]").val().split('-')[0],
                NatureOfGoods: $(row).find("[id^=tblAWBRateDesriptionULD_NatureOfGoods_]").val()
            }
            ULDDimArray.push(ULDDimData);
        });
    }

    if (strData3 != "[]") {
        $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function (index, row) {
            var OtherChargeData = {
                AWBSNo: currentawbsno,
                Type: $(row).find("[id^=tblAWBRateOtherCharge_Type_]").val(),
                OtherChargeCode: $(row).find("[id^=tblAWBRateOtherCharge_OtherCharge_]").val(),
                DueType: $(row).find("[id^=tblAWBRateOtherCharge_DueType_]").val(),
                ChargeAmount: $(row).find("[id^=tblAWBRateOtherCharge_Amount_]").val(),
            }
            OtherCharge.push(OtherChargeData);
        });
    }

    var AWBRate = {
        AWBCurrencySNo: $("#Text_AWBCurrency").data("kendoAutoComplete").key(),
        TotalPrepaid: $("#TotalFreight").val(),
        TotalCollect: $("#TotalAmount").val(),
        CVDCurrency: $("#Text_Currency").data("kendoAutoComplete").key(),
        CVDChargeCode: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
        CVDWeightValuation: $("#Text_Valuation").data("kendoAutoComplete").key(),
        CVDOtherCharges: $("#Text_OtherCharge").data("kendoAutoComplete").key(),
        CVDDCarriageValue: $("#DecCarriageVal").val(),
        CVDCustomValue: $("#DecCustomsVal").val(),
        CVDInsurence: $("#Insurance").val(),
        CVDValuationCharge: $("#ValuationCharge").val(),

        CDCCurrency: $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key(),
        CDCConversionRate: $("#CDCConversionRate").val() == "" ? "0" : $("#CDCConversionRate").val(),
        CDCDestCurrency: $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key(),
        CDCChargeAmount: $("#CDCChargeAmount").val() == "" ? "0" : $("#CDCChargeAmount").val(),
        CDCTotalCharAmount: $("#CDCTotalCharAmount").val() == "" ? "0" : $("#CDCTotalCharAmount").val()
    }
    AWBRateArray.push(AWBRate);

    //ULDDimArray = JSON.parse(strData2);// $('#tblAWBRateDesriptionULD').appendGrid('getAllValue');
    //OtherCharge = JSON.parse(strData3);
    if (TactArray.length <= 0 && ($("#txtTactRate").val() || "") != "") {
        var tactdata = {
            AWBSNo: currentawbsno,
            BaseOn: "",
            ChargeableWeight: $("#tblAWBRateDesription_ChargeableWeight_1").val() || 0,
            CommodityItemNumber: 0,
            GrossWeight: $("#tblAWBRateDesription_GrossWeight_1").val() || 0,
            NatureOfGoods: $("#tblAWBRateDesription_NatureOfGoods_1").val() || "",
            NoOfPieces: $("#tblAWBRateDesription_NoOfPieces_1").val() || 0,
            RateClassCode: "",
            Charge: $("#txtTactRate").val() || 0,
            ChargeAmount: $("#tblAWBRateDesription_ChargeAmount_1").val() || 0,
            WeightCode: $("#tblAWBRateDesription_WeightCode_1").val(),
        }
        TactArray.push(tactdata);
    } else {
        if (TactArray.length > 0) {
            TactArray[0].Charge = $("#txtTactRate").val() || 0;
        }
    }

    var isAmmendment = $("#chkFWBAmmendMent").prop("checked") ? "1" : "0";
    var isChargableAmendment = $("#chkAmmendMentCharge").prop("checked") ? "1" : "0";

    var PrintRateCode = $("#chkTactRate").closest('tr').find("input[type='checkbox']:checked").val();
    var PublishedRate = $("#txtPublishRate").val() || "0";
    var UserRate = $("#txtUserRate").val() || "0";
    var RateDiffRemarks = $("textarea[id^='txtRateRemarks']").val();

    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateTransitRateDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, Dimensions: DimArray, ULDDimension: ULDDimArray, OtherCharge: OtherCharge, RateArray: AWBRateArray, TactRateArray: TactArray, UpdatedBy: 2, isAmmendment: isAmmendment, PrintRateCode: PrintRateCode, PublishedRate: PublishedRate, UserRate: UserRate, RateDiffRemarks: RateDiffRemarks, isChargableAmendment: isChargableAmendment }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Rate', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");

                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Rate', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;

                }
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Rate', result.split('?')[1], "bottom-right");
            }
            else {
                ShowMessage('warning', 'Warning - Rate', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Rate', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveAWBSummary() {
    var flag = false;

    var SummaryArray = [];

    var SaveData = {
        SSRDesc1: $("#SSRDescription").val(),
        SSRDesc2: $("#SSRDescription2").val(),
        SSRDesc3: $("#SSRDescription3").val(),
        ARDFileRef: $("#ARDFileRefrence").val(),
        OPIName: $("#OPIName").val(),
        OPIAirport: $("#Text_OPIAirportCity").data("kendoAutoComplete").key(),
        OfficeDesignator: $("#Text_OPIOfficeDesignator").data("kendoAutoComplete").key(),
        OPICompDesignator: $("#OPICompDesignator").val(),
        OPIOtherFileRef: $("#OPIOtherFileReference").val(),
        OPIParticipantCode: $("#OPIParticipantCode").val(),
        OPIOthAirport: $("#Text_OPIOtherAirportCity").data("kendoAutoComplete").key(),
        SRIRefNumber: $("#SRIRefNumber").val(),
        SRISupInfo1: $("#SRISupInfo1").val(),
        SRISupInfo2: $("#SRISupInfo2").val(),
        CERSignature: $("#CERSignature").val(),
        ISUDate: cfi.CfiDate("CEDate"),
        ISUPlace: $("#Text_ISUPlace").data("kendoAutoComplete").key(),
        ISUSignature: $("#ISUSignature").val(),
        REFAirportCity: $("#Text_REFAirportCityCode").data("kendoAutoComplete").key(),
        REFOfficeDesignator: $("#Text_REFOfficeDesignator").data("kendoAutoComplete").key(),
        REFCompDesignator: $("#REFCompDesignator").val(),
        REFOthPartOfficeFileRef: $("#REFOthPartOfficeFileRef").val(),
        REFParticipantCode: $("#REFParticipantCode").val(),
        REFOthAirportCity: $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").key(),
        //TCORCustomsOrigin: $("#Text_CORCustomsOriginCode").data("kendoAutoComplete").key()
        TCORCustomsOrigin: $("#CORCustomsOriginCode").val()
    }

    SummaryArray.push(SaveData);

    var isAmmendment = $("#chkFWBAmmendMent").prop("checked") ? "1" : "0";
    var isChargableAmendment = $("#chkAmmendMentCharge").prop("checked") ? "1" : "0";

    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateTransitAWBSummary", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, Summary: SummaryArray, UpdatedBy: 2, isAmmendment: isAmmendment, isChargableAmendment: isChargableAmendment }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Other Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");

                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Other Info', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    flag = true;
                }
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Other Info', result.split('?')[1], "bottom-right");
                flag = false;
            }
            else {
                ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            }

        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}


function SaveFormData(subprocess) {
    var issave = false;

    if (subprocess.toUpperCase() == "CUSTOMER") {
        issave = SaveCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "RATE") {
        issave = SaveDimensionInfoNew();
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        issave = SaveAWBSummary();
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        issave = SaveHandlingInfo();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        issave = SaveReservationInfo();
    }

    return issave;
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
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

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}


function SearchData(obj) {
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");
    var testData = $('#tblAWBRateDesription').appendGrid('getStringJson');

    if (testData == "[]" || testData == false) {
        alert('Invalid Data');
        return false;
    }

    //var PostArray = [];
    //PostArray = JSON.parse(testData);

    //PushArray = [];
    //if (PostArray.length > 0) {
    //    for (i = 0; i < PostArray.length; i++) {

    //        var m = "0" + months.indexOf($('#tdFlightDate').text().split('-')[1].toLowerCase());
    //        var d = "0" + $('#tdFlightDate').text().split('-')[0];

    //        var dd = {
    //            "lNOP": PostArray[i]["NoOfPieces"],
    //            "lWeight": PostArray[i]["GrossWeight"],
    //            "lWeightCode": PostArray[i]["WeightCode"],
    //            "lNOG": PostArray[i]["CommodityItemNumber"] || "General", // n 
    //            "lOrigin": $("#tdOD").text().split('-')[0].trim(),
    //            "lDestination": $("#tdOD").text().split('-')[1].trim(),
    //            "lAirlinePrefix": $('#tdFlightNo').text().split('-')[0].trim() || "514",
    //            "lCarrierCode": $('#Text_FlightNo').val().split('-')[0] || "G9",
    //            "lFlightNumber": $('#tdFlightNo').text().split('-')[1].trim() || "",
    //            "lFlightdate": d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + $('#tdFlightDate').text().split('-')[2],
    //            "lFlightCarrierCode": $('#Text_FlightNo').val().split('-')[0] || "G9",
    //            "lCurrencyCode": "IDR",
    //            "lRateType": "PUBLISHED"
    //        };


    //        PushArray.push(dd);
    //    }
    //}
    var flightdt, m, d, flightdtFinal, AirlinePrefix, CarCode, FlightNo;
    var Flightflag = false;

    if ($('#tdFlightDate').text().trim() == "" && FlightDateForGetRate == "") {
        //jAlert("Please provide Flight Date & Flight No. to proceed.", "Get Rate");
        //return false;
        flightdt = "";
        flightdtFinal = kendo.toString(new Date(), "dd/MM/yyyy");
        AirlinePrefix = $('#tdAWBNo').text().trim().split('-')[0] == "SLI" ? "" : $('#tdAWBNo').text().trim().split('-')[0];
        CarCode = "";
        FlightNo = "";
    } else {
        Flightflag = true;
        flightdt = $('#tdFlightDate').text().trim() == "" ? FlightDateForGetRate : $('#tdFlightDate').text();
        m = "0" + parseInt(months.indexOf(flightdt.split('-')[1].toLowerCase()) + parseInt(1));
        d = "0" + flightdt.split('-')[0].trim();
        flightdtFinal = d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + flightdt.split('-')[2];

        AirlinePrefix = $('#tdAWBNo').text().trim().split('-')[0] == "SLI" ? "" : $('#tdAWBNo').text().trim().split('-')[0];//$('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[1].trim() || "" : $('#tdFlightNo').text().split('-')[0].trim() || "";
        CarCode = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[0].trim() || "" : $('#Text_FlightNo').val().split('-')[0] || "";
        FlightNo = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[1].trim() || "" : $('#tdFlightNo').text().split('-')[1].trim() || "";
    }

    PushArray = [];
    if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length > 0) {
        $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {
            var Wt = 0;
            if (parseFloat($(row).find("[id^='tblAWBRateDesription_hdnVolWeight_']").val() || 0) > parseFloat($(row).find("[id^='tblAWBRateDesription_ChargeableWeight_']").val() || 0)) {
                Wt = $(row).find("[id^='tblAWBRateDesription_hdnVolWeight_']").val();
            } else {
                Wt = $(row).find("[id^='tblAWBRateDesription_ChargeableWeight_']").val();
            }
            var dd = {
                "lNOP": $(row).find("[id^='tblAWBRateDesription_NoOfPieces_']").val(),
                "lWeight": Wt,
                "lWeightCode": $(row).find("[id^='tblAWBRateDesription_WeightCode_']").val(),
                "lNOG": ($(row).find("[id^='tblAWBRateDesription_NatureOfGoods_']").val() || "General").replace(",", ""),
                "lOrigin": $("#tdOD").text().split('-')[0].trim(),
                "lDestination": $("#tdOD").text().split('-')[1].trim(),
                "lAirlinePrefix": AirlinePrefix,
                "lCarrierCode": "",
                "lFlightNumber": FlightNo,
                "lFlightdate": flightdtFinal,//d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + flightdt.split('-')[2],
                "lFlightCarrierCode": CarCode,//$('#Text_FlightNo').val().split('-')[0] || "G9",
                "lCurrencyCode": userContext.CurrencyCode,
                "lRateType": "BOTH",
                "lSHCCode": SHCForGetRAte
            };
            PushArray.push(dd);
        });
    }

    var req = { "lText": JSON.stringify(PushArray) }
    //return false;

    //var dd = { "lNOP": "12", "lWeight": "77", "lWeightCode": "K", "lNOG": "SPARE PARTS", "lOrigin": "BOM", "lDestination": "HYD", "lAirlinePrefix": "589", "lCarrierCode": "9W", "lFlightNumber": "111", "lFlightdate": "06/16/2015", "lFlightCarrierCode": "9W" };
    //var dd = { "lNOP": "12", "lWeight": lWeight, "lWeightCode": "K", "lNOG": lNOG, "lOrigin": lOrigin, "lDestination": lDestination, "lAirlinePrefix": lAirlinePrefix, "lCarrierCode": "9W", "lFlightNumber": lFlightNumber, "lFlightdate": "16/06/2015", "lFlightCarrierCode": lFlightCarrierCode };
    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetMultipleRTDRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(req),
        success: function (data) {
            if (data.d == "{}") {
                jAlert('Rate not found.');
                $("#txtTactRate").removeAttr("readonly");
                cfi.Numeric("txtTactRate", 2);
                $("#chkAsAgreed").closest("tr").find("input[type='checkbox']").attr("Checked", false);
                $("#chkAsAgreed").attr("Checked", true);
            } else {
                var ChargeArray = JSON.parse(data.d).Airwaybill_ChargeLines;
                var OtherData = JSON.parse(data.d).Airwaybill_Other_Charges;
                var OtherCharge = [];
                //if (Flightflag == false) {
                //    if (ChargeArray != undefined && ChargeArray.length == 1) {
                //        var tactdata = {
                //            AWBSNo: currentawbsno,
                //            BaseOn: ChargeArray[0].Based_On,
                //            ChargeableWeight: ChargeArray[0].Display_ChargeableWeight,
                //            CommodityItemNumber: ChargeArray[0].Display_CommodityItemNumber,
                //            GrossWeight: ChargeArray[0].Display_GrossWeight,
                //            NatureOfGoods: ChargeArray[0].Display_NOGDIMS,
                //            NoOfPieces: ChargeArray[0].Display_NOPRCP,
                //            RateClassCode: ChargeArray[0].Display_RateClassShortCode,
                //            Charge: ChargeArray[0].Display_RateOrCharge,
                //            ChargeAmount: ChargeArray[0].Display_TotalChargeAmount,
                //            WeightCode: ChargeArray[0].Display_UnitOfGrossWeight,
                //        }
                //        TactArray.push(tactdata);
                //        if ($("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").length > 0) {
                //            $("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").text("TACT Rate: " + ChargeArray[0].Display_RateOrCharge);
                //        } else {
                //            $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate' id='spanTactRate'>TACT Rate: " + ChargeArray[0].Display_RateOrCharge + "</span>");
                //        }
                //        $("#txtTactRate").val(ChargeArray[0].Display_RateOrCharge);
                //    }
                //} else {
                if (ChargeArray != undefined && ChargeArray.length > 0) {
                    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {
                        if ($(row).find("button[id^='tblAWBRateDesription_Delete_']").length <= 0) {
                            $(row).find("input[id^='_temptblAWBRateDesription_ChargeableWeight_']").val(ChargeArray[i]["Display_ChargeableWeight"]);
                            $(row).find("input[id^='tblAWBRateDesription_ChargeableWeight_']").val(ChargeArray[i]["Display_ChargeableWeight"]);
                            $(row).find("input[id^='_temptblAWBRateDesription_Charge_']").val(ChargeArray[i]["Display_RateOrCharge"]);
                            $(row).find("input[id^='tblAWBRateDesription_Charge_']").val(ChargeArray[i]["Display_RateOrCharge"]);
                            $(row).find("input[id^='_temptblAWBRateDesription_ChargeAmount_']").val(ChargeArray[i]["Display_TotalChargeAmount"]);
                            $(row).find("input[id^='tblAWBRateDesription_ChargeAmount_']").val(ChargeArray[i]["Display_TotalChargeAmount"]);

                            $(row).find("input[id^='tblAWBRateDesription_RateClassCode_']").data("kendoAutoComplete").setDefaultValue(ChargeArray[i].Display_RateClassShortCode, ChargeArray[i].Display_RateClassShortCode);
                            //$(row).find("button[id^='tblAWBRateDesription_Delete_']").remove();
                        }
                    });
                    $("#txtPublishRate").val(ChargeArray[0]["Display_RateOrCharge"]);
                }
                if (ChargeArray.length > 1) {
                    var tactdata = {
                        AWBSNo: currentawbsno,
                        BaseOn: ChargeArray[1].Based_On,
                        ChargeableWeight: ChargeArray[1].Display_ChargeableWeight,
                        CommodityItemNumber: ChargeArray[1].Display_CommodityItemNumber,
                        GrossWeight: ChargeArray[1].Display_GrossWeight,
                        NatureOfGoods: ChargeArray[1].Display_NOGDIMS,
                        NoOfPieces: ChargeArray[1].Display_NOPRCP,
                        RateClassCode: ChargeArray[1].Display_RateClassShortCode,
                        Charge: ChargeArray[1].Display_RateOrCharge,
                        ChargeAmount: ChargeArray[1].Display_TotalChargeAmount,
                        WeightCode: ChargeArray[1].Display_UnitOfGrossWeight,
                    }
                    TactArray.push(tactdata);
                    if ($("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").length > 0) {
                        $("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").text("TACT Rate: " + ChargeArray[1].Display_RateOrCharge);
                    } else {
                        $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate' id='spanTactRate'>TACT Rate: " + ChargeArray[1].Display_RateOrCharge + "</span>");
                    }
                    $("#txtTactRate").val(ChargeArray[1].Display_RateOrCharge);
                    $("#_temptxtTactRate").val(ChargeArray[1].Display_RateOrCharge);
                }
                else {
                    jAlert('TACT rate not found. You may enter TACT rate manually if required.');
                    $("#txtTactRate").val('');
                    $("#txtTactRate").removeAttr("readonly");
                    cfi.Numeric("txtTactRate", 2);
                }
                //}

                if (OtherData != undefined && OtherData.length > 0) {
                    for (i = 0; i < OtherData.length; i++) {
                        var otherinfo = {
                            Type: OtherData[i]["PC_Indicator"],
                            OtherCharge: OtherData[i]["Code"],
                            DueType: OtherData[i]["Entitlement_Code"],
                            Amount: OtherData[i]["Charge_Amount"]
                        };
                        OtherCharge.push(otherinfo);
                    }
                    $("#tblAWBRateOtherCharge").appendGrid('load', OtherCharge);
                    $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function (i, row) {
                        $(row).find("input[id^='_temptblAWBRateOtherCharge_Amount_']").val(OtherCharge[i]["Amount"]);
                        $(row).find("button[id^='tblAWBRateOtherCharge_Delete_']").remove();

                    });
                }
                CalculateRateTotal();
                // To desect Manual Rate of again get rate clicked.
                $("#chkAsAgreed").closest("tr").find("input[type='checkbox']").attr("Checked", false);
                $("#chkAsAgreed").attr("Checked", true);
            }
        },
        error: function (a, b) {
            //alert('Error occurred');
        }
    });
    //}
}

function CalculateRateTotal() {
    CalculateChargeAmt();
    var FrieghtType = "";
    var TotalPrepaid = 0;
    var TotalCollect = 0;
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "") {
        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/GetFieldsFromTable?Fields=IsFreightPrepaid&Table=AWB&AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
            //data: JSON.stringify({ AWBSNO: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Frieghtdata = jQuery.parseJSON(result);
                FrieghtType = Frieghtdata.Table[0]["IsFreightPrepaid"] = true ? "PP" : "CC";
                if (FrieghtType = "PP") {
                    $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue("PP", "Prepaid");
                } else {
                    $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue("CC", "Collect");
                }

            },
            error: {

            }
        });
    } else {
        FrieghtType = $("#Text_Valuation").data("kendoAutoComplete").key();
    }

    var _rateAmt = 0;
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        _rateAmt += parseFloat($(this).find("[id^='tblAWBRateDesription_ChargeAmount_']").val() || "0");
    });
    if (FrieghtType == "PP") {
        TotalPrepaid = _rateAmt;
    } else {
        TotalCollect = _rateAmt;
    }

    $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function () {
        if ($(this).find("[id^='tblAWBRateOtherCharge_Type_']").val() == "P") {
            TotalPrepaid += parseFloat($(this).find("[id^='tblAWBRateOtherCharge_Amount_']").val() || "0");
        } else if ($(this).find("[id^='tblAWBRateOtherCharge_Type_']").val() == "C") {
            TotalCollect += parseFloat($(this).find("[id^='tblAWBRateOtherCharge_Amount_']").val() || "0");
        }
    });

    $("#TotalFreight").val(TotalPrepaid.toFixed(3).toString());
    $("#_tempTotalFreight").val(TotalPrepaid.toFixed(2).toString());

    $("#TotalAmount").val(TotalCollect.toFixed(3).toString());
    $("#_tempTotalAmount").val(TotalCollect.toFixed(2).toString());

    if (parseFloat($("#txtPublishRate").val()) != parseFloat($("#tblAWBRateDesription_Charge_1").val())) {
        $("#txtUserRate").val($("#tblAWBRateDesription_Charge_1").val());
    } else { $("#txtUserRate").val('') }
    SetOtherChargeValue()// Added by RH for Other Charge 14-02-17
}

// Added by RH for Other Charge 14-02-17
function SetOtherChargeValue() {
    var CC = 0;
    $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function () {
        if ($(this).find("[id^='tblAWBRateOtherCharge_Type']").val() == "C") {
            CC += 1;
        }
    });
    if (($("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").length || 0) > 0) {
        if (parseInt(CC) == ($("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").length || 0)) {
            $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(WeightValuation[1].Key, WeightValuation[1].Text);
        } else {
            $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(WeightValuation[0].Key, WeightValuation[0].Text);
        }
    }
}
// Added by RH for Other Charge 14-02-17

function CalculateChargeAmt(obj) {
    if ($(obj).attr("id") != undefined) {
        if ($(obj).attr("id").indexOf("tblAWBRateDesription_ChargeableWeight") >= 0) {
            var GrossWt = 0, VolWt = 0;
            GrossWt = $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']:first").find("input[id^='tblAWBRateDesription_GrossWeight']").val() || 0;
            VolWt = $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']:first").find("input[id^='tblAWBRateDesription_hdnVolWeight']").val() || 0;
            if (parseFloat($(obj).val()) < parseFloat(GrossWt) || parseFloat($(obj).val()) < parseFloat(VolWt)) {
                if (parseFloat(GrossWt) < parseFloat(VolWt)) {
                    $(obj).val(VolWt);
                } else {
                    $(obj).val(GrossWt);
                }
                jAlert("Entered chargeable weight can't be less than shipment gross weight (" + parseFloat(GrossWt).toFixed(3).toString() + ") and shipment volume weight (" + parseFloat(VolWt).toFixed(3).toString() + ").", "Warning - AWB Rating");
                return false;
            }
        }
    }
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        // if ($(this).find("[type='button'][id*='tblAWBRateDesription_Delete']").length > 0) {
        var CharWt = ($(this).find("input[id^='tblAWBRateDesription_ChargeableWeight']").val() || "0") == "0" ? ($(this).find("input[id^='_temptblAWBRateDesription_ChargeableWeight']").val() || "0") : ($(this).find("input[id^='tblAWBRateDesription_ChargeableWeight']").val() || "0");
        var Charge = ($(this).find("input[id^='tblAWBRateDesription_Charge_']").val() || "0") == "0" ? ($(this).find("input[id^='_temptblAWBRateDesription_Charge_']").val() || "0") : ($(this).find("input[id^='tblAWBRateDesription_Charge_']").val() || "0");
        if ($(this).find("[id^=tblAWBRateDesription_HdnRateClassCode_]").val().trim() == "M") {
            $(this).find("input[id*='tblAWBRateDesription_ChargeAmount']").val(Charge);
        } else {
            $(this).find("input[id*='tblAWBRateDesription_ChargeAmount']").val((parseFloat(CharWt) * parseFloat(Charge)).toFixed(2));
        }
        //}
    });
}
function ToggleCharge(obj) {
    if ($(obj).prop("checked") == true) {
        //$("#chkAmmendMentCharge").prop("checked", true);
        $("#chkAmmendMentCharge").prop("disabled", false);
    } else {
        $("#chkAmmendMentCharge").prop("checked", false);
        $("#chkAmmendMentCharge").prop("disabled", true);
    }
}
var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New FWB</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
    "</tr></tbody></table> </div>";
//var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >FBL Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td id='IdAWBPrint' colspan='3'><a href='#' onclick='showAWBPrint()'>Print AWB</a></td></tr><tr> <td id='IdAWBlbl' colspan='3'><a href='#' onclick='showAWBlbl()'>Print AWB Label</a></td></tr><tr> <td id='IdAcptNote' colspan='3'><a href='#'>Print Acceptance Note</a></td></tr><tr> <td id='IdEDINote' colspan='3'><a href='#' onclick='ShowEDI()'>EDI Messages</a></td></tr><tr> <td id='IdPayrecpt' colspan='3'><a href='#' onclick='showPayRcpt()'>Print Payment Receipt </a></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";
//var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='/* width:15%; */display: none;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td colspan='3'></td></tr><tr> <td id='IdAWBPrint' colspan='3' class='tdInnerPadding'>Print &nbsp;&nbsp;&nbsp;&nbsp;<select id='sprint' ><option value='AWB' selected>AWB</option><option value='CSD'  selected>eCSD</option><option value='AWBLabel'>AWB Label</option><option value='AcceptanceNote'>Acceptance Note</option><option value='PReceipt'>Payment Receipt</option></select>&nbsp;<button name='button' onclick='bprint();' value='OK type='button'>Print</button></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";//<option value='EDI'>EDI Messages</option>
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td colspan='3'></td></tr><tr> <td id='IdAWBPrint' colspan='3' class='tdInnerPadding'>Print &nbsp;&nbsp;&nbsp;&nbsp;<select id='sprint' ><option value='AWB' selected>AWB</option><option value='CSD'  selected>eCSD</option><option value='AWBLabel'>AWB Label</option><option value='AcceptanceNote'>Acceptance Note</option><option value='PReceipt'>Payment Receipt</option><option value='Checklist'>Check List</option></select>&nbsp;<button name='button' onclick='bprint();' value='OK type='button'>Print</button></td></tr><tr id='trAmmendment'> <td>FWB Amendment</td><td>:</td><td><input type='checkbox' name='chkFWBAmmendMent' id='chkFWBAmmendMent' onclick='ToggleCharge(this)'></td></tr><tr id='trAmmendmentCharge'> <td>Levy Amendment Charges</td><td>:</td><td><input type='checkbox' name='chkAmmendMentCharge' id='chkAmmendMentCharge' disabled></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";//<option value='EDI'>EDI Messages</option>
var rpl = "<ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div>";

var NogDiv = '<div id="divareaTrans_shipment_tfwbshipmentnog" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Nature of Good"><span id="spnNOG"> Nature of Goods</span></td><td class="formHeaderLabel" title="Other Nature of Good"><span id="spnOtherNOG">Other</span></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'

    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_4"><td id="tdSNoCol_4" class="formSNo snowidth" style="" name="_4">6</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_4"  onblur="CalculatePieces(this);" id="Pieces_4" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_4" id="NogGrossWt_4" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_4" id="OtherNatureofGoods_4" value=""><input type="text" class="" name="Text_OtherNatureofGoods_4" id="Text_OtherNatureofGoods_4" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_4" id="NOG_4" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_5"><td id="tdSNoCol_5" class="formSNo snowidth" style="" name="_5">7</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_5"  onblur="CalculatePieces(this);" id="Pieces_5" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_5" id="NogGrossWt_5" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_5" id="OtherNatureofGoods_5" value=""><input type="text" class="" name="Text_OtherNatureofGoods_5" id="Text_OtherNatureofGoods_5" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_5" id="NOG_5" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_6"><td id="tdSNoCol_6" class="formSNo snowidth" style="" name="_6">8</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_6"  onblur="CalculatePieces(this);" id="Pieces_6" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_6" id="NogGrossWt_6" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_6" id="OtherNatureofGoods_6" value=""><input type="text" class="" name="Text_OtherNatureofGoods_6" id="Text_OtherNatureofGoods_6" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_6" id="NOG_6" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_7"><td id="tdSNoCol_7" class="formSNo snowidth" style="" name="_7">9</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_7"  onblur="CalculatePieces(this);" id="Pieces_7" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_7" id="NogGrossWt_7" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_7" id="OtherNatureofGoods_7" value=""><input type="text" class="" name="Text_OtherNatureofGoods_7" id="Text_OtherNatureofGoods_7" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_7" id="NOG_7" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_8"><td id="tdSNoCol_8" class="formSNo snowidth" style="" name="_8">10</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_8"  onblur="CalculatePieces(this);" id="Pieces_8" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_8" id="NogGrossWt_8" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_8" id="OtherNatureofGoods_8" value=""><input type="text" class="" name="Text_OtherNatureofGoods_8" id="Text_OtherNatureofGoods_8" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_8" id="NOG_8" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_tfwbshipmentnog_9"><td id="tdSNoCol_9" class="formSNo snowidth" style="" name="_9">11</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_9"  onblur="CalculatePieces(this);" id="Pieces_9" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_9" id="NogGrossWt_9" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_9" id="OtherNatureofGoods_9" value=""><input type="text" class="" name="Text_OtherNatureofGoods_9" id="Text_OtherNatureofGoods_9" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_9" id="NOG_9" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '</tbody></table>'
    + '</div>'


var RatePrint = '<div id="RatePrint">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel">Show on AWB Print</td><td class="formHeaderLabel"></td><td class="formHeaderLabel"></td><td class="formHeaderLabel"></td></tr>'
    + '<tr><td class="formHeaderLabel" id="tactrate" name="tactrate"><input id="chkTactRate" name="chkTactRate" type="checkbox" value="1" onclick="SelectClicked(this);">TACT Rate</td><td class="formHeaderLabel" id="publishedrate" name="publishedrate"><input id="chkPubRate" name="chkchkPubRate" type="checkbox" value="2"  onclick="SelectClicked(this);">Published Rate</td><td class="formHeaderLabel" id="userrate" name="userrate"><input id="chkUserRate" name="chkUserRate" type="checkbox" value="3"  onclick="SelectClicked(this);">Manually Entered Rate</td><td class="formHeaderLabel" id="Asagreedrate" name="Asagreedrate"><input id="chkAsAgreed" name="chkAsAgreed" type="checkbox" value="4" onclick="SelectClicked(this);">As Agreed</td></tr>'
    + '<tr><td><input type="text" class="k-input k-state-default transSection" name="txtTactRate" id="txtTactRate" maxlength="10" onblur="SelectRateOption(this);" value="" placeholder="" readonly="true"></td><td><input type="text" class="k-input k-state-default transSection" name="txtPublishRate" id="txtPublishRate" value="" placeholder="" readonly="true"></td><td><input type="text" class="k-input k-state-default transSection" name="txtUserRate" id="txtUserRate" value="" placeholder="" readonly="true"></td><td></td></tr>'
    + '<tr><td colspan="4"  style="padding-top: .5em;padding-bottom: .5em;" class="formHeaderLabel">Remarks&nbsp;&nbsp;<textarea class="transSection k-input" name="txtRateRemarks" id="txtRateRemarks" style="width: 95%; text-transform: uppercase;" controltype="alphanumericupper" maxlength="150" data-role="alphabettextbox" autocomplete="off"></textarea></td><tr>'
    + '</tbody></table>'
    + '</div>'

var SubGroupDiv = '<div id="divareaTrans_shipment_shipmentSHCSubGroup" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="SubGroupSNo" name="SubGroupSNo">SNo</td><td class="formHeaderLabel" title="SHC"><span id="spnSHC"> SHC</span></td><td class="formHeaderLabel" title="Sub Group"><span id="spnSubGriup"> Sub Group</span></td>  <td class="formHeaderLabel" title=""><span id="spnLabel"></span></td><td class="formHeaderLabel" title="Mandatory Info"><span id="spnStatement"> Mandatory Info</span></td><td class="formHeaderLabel" title=""><span id="spnpackLabel" style="width: 150px;"></span></td> <td class="formHeaderLabel" title="Packing Instruction"><span id="spnPacking">Packing Instruction</span></td>   </tr>'
    + '</tbody></table>'
    + '</div>'



function SelectClicked(obj) {
    $(obj).closest("tr").find("input[type='checkbox']").attr("Checked", false);
    var messgae = "";
    var Flag = true;
    if (($(obj).attr("id") == "chkTactRate") && (parseFloat($("#txtTactRate").val() || 0) == 0)) {
        messgae = "Kindly click on Get Rate to fetch relevant rate.";
        Flag = false;
    } else if (($(obj).attr("id") == "chkPubRate") && (parseFloat($("#txtPublishRate").val() || 0) == 0)) {
        messgae = "Kindly click on Get Rate to fetch relevant rate.";
        Flag = false;
    } else if (($(obj).attr("id") == "chkUserRate") && (parseFloat($("#txtUserRate").val() || 0) == 0)) {
        messgae = "Kindly enter charge rate before selection for AWB print.";
        Flag = false;
    }
    if (Flag == false) {
        jAlert(messgae, "Warning - Rate");
        $("#chkAsAgreed").prop("checked", true);
        return false;
    }
    //if ($(obj).prop('checked')) {
    $(obj).attr("Checked", true);
    //}
}
function SelectRateOption(obj) {
    if (parseFloat($(obj).val() || 0) <= 0) {
        if ($("#chkTactRate").prop("checked") == true) {
            $("#chkTactRate").prop("checked", false);
            $("#chkPubRate").prop("checked", false);
            $("#chkUserRate").prop("checked", false);
            $("#chkAsAgreed").prop("checked", true);
        }
    }
}
function bprint() {
    switch ($("#sprint").val()) {
        case "CSD":
            window.open("ecsd.html?sno=" + currentawbsno);
            break;
        case "AWB":
            window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('Acceptance'));
            break;
        case "AWBLabel":
            if (CanPrintLable()) {
                window.open("HtmlFiles\\cargolux\\cargolux.html?Sno=" + currentawbsno);
            } else {
                jAlert("Enter AIR WAYBILL Details to print AWB label.", "Warning - AWB Label");
            }
            break;
        case "Checklist":
            window.open("HtmlFiles\\AcceptanceCheckSheet\\CheckListPrint.html?Sno=" + currentawbsno);

            break;
        //case "Notoc":
        //    window.open("HtmlFiles\\Export\\Notoc\\Notoc.html?Sno=" + currentawbsno);
        //    break;

        default:
            break;
    }

}

function CanPrintLable() {
    var Flag = false;
    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetFWBSaveDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var data = jQuery.parseJSON(result);
            if (data.Table[0].FWBSAVED == "1") {
                Flag = true;
            }
        }
    });
    return Flag;
}

function CheckLength(obj) {
    if ($(obj).val() != "") {
        if ($(obj).val().length < 6) {
            $(obj).val('');
            $("#" + '_temp' + $(obj).attr('id')).val('');
            CallMessageBox('info', 'H S Code', 'H S Code should be of minimum 6 digits.');

        }

    }
}

var YesReady = false;
function PageRightsCheckTRANSITFWB() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "TRANSITFWB") {

            if (i.Apps.toString().toUpperCase() == "TRANSITFWB" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "TRANSITFWB" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "TRANSITFWB" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                YesReady = true;
                return
            }

        }
    });

    if (YesReady) {
        $("#btnSave").hide();
        $("#btnNew").hide();
        $("#btnCancel").hide();
        $("#btnSaveToNext").hide();
        //$('#divDetail').find('button').hide();

    }
}