$(function () {
    MasterAcceptance();
});

//function getParameterByName(name, url) {
//    if (!url) url = window.location.href;
//    name = name.replace(/[\[\]]/g, "\\$&");
//    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//        results = regex.exec(url);
//    if (!results) return null;
//    if (!results[2]) return '';
//    return decodeURIComponent(results[2].replace(/\+/g, " "));
//}
//var PageName = getParameterByName("Apps", "").toUpperCase();

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
var FlightDateForGetRate = '';
var FlightNoForGetRate = '';
var isSaveAndNext = '';
var TactArray = [];

var IsFWbComplete = false;
var IsFWBAmmendment = false
var IsFlightExist = false;

var _IS_DEPEND = false;
var TabColor = '';
var IsAgentBUP = '';

function MasterAcceptance() {
    _CURR_PRO_ = "FWB";
    _CURR_OP_ = "Master Acceptance";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FWBSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            var rights = GetPageRightsByAppName("Shipment", "FWB");
            if (!rights.IsNew) {
                $("#btnNew").remove();
            }
            //if (PageName == "TRANSITFWB") {
            //    $("#btnNew").remove();
            //    $('#sprint').empty();
            //    var newOption = "<option value='AWB'>AWB</option>";
            //    $("#sprint").append(newOption);
            //    $("#sprint").css('width', '100px');
            //}
            $("#__divfwbsearch__ table:first").find("tr>td:first").text("Export FWB");
            cfi.AutoComplete("searchOriginCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchDestinationCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchAWBPrefix", "AWBPrefix", "vwAWBPrefix", "AWBPrefix", "AWBPrefix", ["AWBPrefix"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNumber", "vwAWBNumberSearch", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");

            $('#searchFlightDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
                currentawbsno = 0;
            });
            CleanUI();
            ShipmentSearch();


            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                $("#hdnAWBSNo").val("");


                currentawbsno = 0;
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
                            $("div[id='divareaTrans_shipment_fwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
                            //-- to hide old NOG values for new booking case
                            $("div[id$='divareaTrans_shipment_fwbshipmentnog']").remove();
                            $("div[id$='divDetail']").append(NogDiv);
                            $("input[id*='txtDGRPieces']").attr("disabled", 1);
                            $("div[id='divareaTrans_shipment_fwbshipmentnog']").find("tr[id^='areaTrans_shipment_fwbshipmentnog']").each(function (i, row) {
                                cfi.AutoComplete($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], EnableOtherNog, "contains");
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
    if (_CURR_PRO_ == "FWB") {
        //BindEvents(arg, event, true);
    }
}

function onChange(arg) {

    if (_CURR_PRO_ == "FWB") {

    }

}
function HouseAcceptance() {

    _CURR_PRO_ = "HOUSE";
    _CURR_OP_ = "House Acceptance";
    $("#licurrentop").html(_CURR_OP_);
    $("#divShipmentDetails").html("");
    CleanUI();
    ngen.loadjscssfile("JScript/House/HouseIndex.js?" + Math.random(), "js");
    $("#divSearch").html("");
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/House/HAWBSearch/Search/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divSearch").html(result);

            var dataSource = GetDataSource("searchOriginCity", "City", "CityCode", "CityName", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("searchOriginCity", dataSource, false, null, "CityCode");
            $('#searchFlightDate').data("kendoDatePicker").value(todayDate);

            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
            });
        },
        error: function (xhr) {
            var a = "";
            $("#divShipmentDetails").html("");

        }
    });
}

function PrepareBuildUp() {
    _CURR_PRO_ = "BUILDUP";
    _CURR_OP_ = "Build-Up";
    $("#btnSaveToNext").hide();
    //$("#btnNew").hide();
    $("#licurrentop").html(_CURR_OP_);
    $("#divShipmentDetails").html("");
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    CleanUI();
    $("#divSearch").html("");
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/BuildUp/BuildUpSearch/Search/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divSearch").html(result);
            ngen.loadjscssfile("JScript/BuildUp/BuildUp.js?" + Math.random(), "js");

        },
        error: function (xhr) {
            var a = "";
            $("#divShipmentDetails").html("");

        }
    });
}

//-- Rh 030815 starts
function ReturnAWB() {
    _CURR_PRO_ = "ReturnAWB";
    _CURR_OP_ = "Return AWB";
    $("#licurrentop").html(_CURR_OP_);

    $("#divShipmentDetails").html("");
    CleanUI();

    $("#divSearch").html("");
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetWebForm/" + _CURR_PRO_ + "/ReturnAWB/ReturnAWBSearch/Search/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divSearch").html(result);

            ngen.loadjscssfile("JScript/FlightOperation/ReturnAWB.js?" + Math.random(), "js");
            var dataSource = GetDataSource("searchAWBNo", "VReturnAWB", "SNo", "AWBNo", null)
            cfi.ChangeAutoCompleteDataSource("searchAWBNo", dataSource, false, null, "AWBNo");
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ReturnSearch();
            });
        },
        error: function (xhr) {
            var a = "";
            $("#divShipmentDetails").html("");

        }
    });
}
//-- Rh 030815 starts

function ShipmentSearch() {

    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val().trim();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val().trim();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    // Temporary Set values
    //FlightDate = "2015-10-15";

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val().trim();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val().trim();
    var LoggedInCity = "DEL";

    if (_CURR_PRO_ == "HOUSE") {
        var HAWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetHouseAcceptanceGridData/" + _CURR_PRO_ + "/House/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + HAWBNo + "/" + LoggedInCity);

    }
    else if (_CURR_PRO_ == "FWB") {
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);

    }


}

function AutoShipmentSearch(SubProcess) {
    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
        if ($(e).text() == currentawbsno) {
            BindEvents($(e).parent().find("[process=" + SubProcess + "]"), event); return false;
        }
    });
}
function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}
function BindSubProcess() {
    AutoShipmentSearch(currentprocess);
    $("#divShipmentDetails").find("div[class='k-grid k-widget'] > div.k-grid-header > div > table > thead > tr > th:nth-child(2) > a.k-grid-filter > span").remove();

    var grid = $("#divShipmentDetails div[data-role='grid']").data('kendoGrid');
    var pager = grid.pager;
    pager.unbind('change').bind('change', fn_pagechange);

    function fn_pagechange(e) {
        currentawbsno = 0;
    }
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
    $("#btnSaveToNext").show();
    $("#divDetail").html('');
    $("#divDetailSHC").html('');
    $("#divTab3").html('');
    $("#divTab4").html('');
    $("#divTab5").html('');
    $("#divXRAY").hide();
    $("#tabstrip").show();
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
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
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

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
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

    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();


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
    $("#tdOD").text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());

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
}
function AutoCompleteForFBLHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
        $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
            filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
            dataSource: dataSource,
            filterField: basedOn,
            separator: (separator == undefined ? null : separator),
            dataTextField: autoCompleteText,
            dataValueField: autoCompleteKey,
            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
            template: '<span>#: TemplateColumn #</span>',
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd
        });
    }
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
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').show();

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

function ShowEDI() {
    $("#divEDIDetail").show();
    var awbsno = $('#tblShipmentInfo tr:nth-child(2)>td:eq(2)').text();
    var FlightDate = $('#tblShipmentInfo tr:nth-child(3)>td:eq(2)').text();
    var FlightNo = $('#tblShipmentInfo tr:nth-child(5)>td:eq(2)').text();
    cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/EDIDETAILS/A~A/A~A/" + FlightNo + "/" + FlightDate + "/A~A/" + awbsno + "/A~A");
    $("#btnSave").unbind("click");
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



    //var x = textId.split('_')[2];
    //var y = [];
    //var z = [];
    //if (textId == 'tblAWBRateOtherCharge_OtherCharge_' + x) {
    //    $("#tblAWBRateOtherCharge").find("[id^='tblAWBRateOtherCharge_OtherCharge']").each(function (i, row) {
    //        //if (x != i + 1) {

    //        //    cfi.setFilter(LocaFilter, "OtherChargeCode", 'notin', $(this).val());               
    //        //}

    //        z.push($(this).val());
    //        y.push($(this).closest('td').next().find('[id^="tblAWBRateOtherCharge_DueType"]').val());
    //        if ($("#" + textId.replace('_OtherCharge', '_DueType')).val() == y[i]) {
    //            if (x != i + 1) {

    //                cfi.setFilter(LocaFilter, "OtherChargeCode", 'notin', $(this).val());
    //            }
    //        }

    //    });
    //    var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(LocaFilter);
    //    return ChargeAutoCompleteFilter;
    //}

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
        //else if (textId.indexOf("Text_Unit") >= 0) {
        //    if ($("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete") != undefined) {
        //        var _filterunitDGR = cfi.getFilter("AND");
        //        cfi.setFilter(_filterunitDGR, "Unit", "neq", '');
        //        cfi.setFilter(_filterunitDGR, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        //        filterunitDGR = cfi.autoCompleteFilter(_filterunitDGR);
        //        return filterunitDGR;
        //    }
        //}
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
        return false;
    }
    else if (subprocess.toUpperCase() == "RATE") {

        BindDimensionEventsNew();
        BindDimensionEventsNewULD();
        BindAWBOtherCharge();
        BindAWBRate();

        cfi.Numeric("txtTactRate", 2);
        $("#txtTactRate").css("width", "105.778px");
        $("#_temptxtTactRate").css("width", "105.778px");
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
        return false;
    }
    else if (subprocess.toUpperCase() == "WEIGHINGMACHINE") {
        BindWeighingMachineEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "XRAY") {
        BindXRayEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "LOCATION") {

        BindLocationEvents(isdblclick);
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
        return false;

    }
    else if (subprocess.toUpperCase() == "PAYMENT") {

        InitializePaymentData();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        BindReservationSection();
        UserSubProcessRights("divDetail", subprocesssno);
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
            var FlightDateSelected = $("div[id='divareaTrans_shipment_fwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
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
            var FlightDateSelected = $("div[id='divareaTrans_shipment_fwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
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
                            FlightDateForGetRate = $("#divareaTrans_shipment_fwbshipmentitinerary").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                            FlightNoForGetRate = $("#divareaTrans_shipment_fwbshipmentitinerary").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
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
        return false;
    }
        //else if (subprocess.toUpperCase() == "CHECKLIST") {
        //    BindCheckList();
        //}
    else if (subprocess.toUpperCase() == "EDOX") {
        $("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
        BindEDox();
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

function ResetFBLCharge(textId, textValue, keyId, keyValue) {

    if (ValidateExistingCharges(textId, textValue, keyId, keyValue)) {

        $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {

            if (textId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
                if (keyValue == "") {
                    $(this).find("input[id^='Amount']").val("0");
                    $(this).find("span[id^='TotalAmount']").html("");
                    $(this).find("input[id^='TotalAmount']").val("");
                }
                else {
                    var obj = $(this);
                    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];

                    var paymentList = paymentData.Table0;

                    var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', keyValue);

                    obj.find("input[id^='Amount']").val(NonMendatory[0].ChargeAmount);
                    obj.find("input[id^='_tempAmount']").val(NonMendatory[0].ChargeAmount);
                    var totalAmount = parseFloat(NonMendatory[0].ChargeAmount).toFixed(3);
                    obj.find("span[id^='TotalAmount']").html(totalAmount);
                    obj.find("input[id^='TotalAmount']").val(totalAmount);
                    obj.find("input[id^='Remarks']").val(NonMendatory[0].ChargeRemarks.replace('<Br>', '').replace('<Br>', ''));
                    obj.find("input[id^='rate']").val(NonMendatory[0].Rate);
                    obj.find("input[id^='min']").val(NonMendatory[0].Min);
                    obj.find("input[id^='totaltaxamount']").val(NonMendatory[0].TotalTaxAmount);
                    if (NonMendatory[0].TotalTaxAmount != "2") {
                        obj.closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                    }
                }
            }
        });
    }
    CalculateTotalFBLAmount();
}

function CalculateFBLAmount(obj) {
    var a = "";
    var chargeName = $(obj).closest("tr").find("[id^='ChargeName']");
    var chargeText = $(obj).closest("tr").find("[id^='Text_ChargeName']").attr("id");
    var chargeKey = $("#" + chargeText).data("kendoAutoComplete").key();
    for (var i = 0; i < paymentList.length; i++) {
        if (paymentList[i].TariffSNo == chargeKey) {
            //var gst = parseFloat(paymentList[i].GSTPercentage);
            //var totalAmount = parseFloat($(obj).val()) + (parseFloat($(obj).val()) * gst) / 100;
            var totalAmount = parseFloat($(obj).val());
            if ((isNaN(totalAmount))) {
                totalAmount = '0';
            }
            totalAmount = parseFloat(totalAmount).toFixed(3);
            $(obj).closest("tr").find("span[id^='TotalAmount']").html(totalAmount.toString());
            $(obj).closest("tr").find("input[id^='TotalAmount']").val(totalAmount.toString());

        }
    }
    CalculateTotalFBLAmount();
}

function CalculateTotalFBLAmount() {
    //var totalFBLAmount = 0;
    //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
    //    $(this).find("input[id^='TotalAmount']").each(function () {
    //        if (!isNaN(parseFloat($(this).val())))
    //            totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
    //    });
    //});
    //totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    //$("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    //$("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {

                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else { }

            }

        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }
}


function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });
    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });
    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}
function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_fwbshipmentocitrans']").find("[id^='areaTrans_shipment_fwbshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}
function BindHandlingInfoDetails() {
    cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    cfi.AutoComplete("CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetOSIInfoAndHandlingMessage?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var osiData = jQuery.parseJSON(result);
            var osiInfo = osiData.Table0;
            var handlingArray = osiData.Table1;
            var osiTransInfo = osiData.Table2;

            var ocitransInfo = osiData.Table3;

            //if (osiInfo.length > 0) {
            //    $("#SCI").val(osiInfo[0].SCI.toUpperCase());
            //}

            cfi.makeTrans("shipment_fwbshipmentositrans", null, null, null, null, null, osiTransInfo, 2);//added by Manoj Kumar
            cfi.makeTrans("shipment_fwbshipmentocitrans", null, null, BindCountryCodeAutoComplete, ReBindCountryCodeAutoComplete, null, ocitransInfo);//added by Manoj Kumar
            //cfi.makeTrans("shipment_shipmenthandlinginfo", null, null, BindHandlingAutoComplete, removeHandlingMessage, null, handlingArray);

            //$("div[id$='areaTrans_shipment_shipmenthandlinginfo']").find("[id='areaTrans_shipment_shipmenthandlinginfo']").each(function () {
            //    $(this).find("input[id^='Type']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
            //    });
            //});
        },
        error: {

        }
    });
}

function BindCustomerInfo() {

    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    //cfi.AutoComplete("SHIPPER_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    //cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("Notify_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("Notify_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

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
        url: "Services/Shipment/FWBService.svc/GetShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
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
                $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo.toUpperCase());
                $('#AGENT_Participant').val(agentData[0].Participant.toUpperCase());
                $('span[id=AGENT_Participant]').text(agentData[0].Participant.toUpperCase());
                $('#AGENT_IATACODE').val(agentData[0].IATANo.toUpperCase());
                $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo.toUpperCase());
                $('#AGENT_Name').val(agentData[0].AgentName.toUpperCase());
                $('span[id=AGENT_Name]').text(agentData[0].AgentName.toUpperCase());
                $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress.toUpperCase());
                $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress.toUpperCase());
                $('#AGENT_PLACE').val(agentData[0].Location.toUpperCase());
                $('span[id=AGENT_PLACE]').text(agentData[0].Location.toUpperCase());
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
function CalculatePayment(obj) {
    MarkSelected(obj);

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {
                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else {
                }
            }
        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }

}
function BindHandlingChargeAutoComplete(elem, mainElem) {
    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    $(elem).find("input[id^='ChargeName']").each(function () {
        //AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "WMSFBLHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");       
        AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
    });
    $(elem).find("input[id^='BillTo']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
        $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
    });
    //$(elem).find("input[id^='BillTo']").closest('td').find('span').css("display", "block");
    $(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
    $(elem).find('td:eq(7)').css("display", "none");
    $(elem).find('td:eq(8)').css("display", "none");
    $(elem).find('td:eq(9)').css("display", "none");
    $(elem).find("input[id^='chkCash']").prop('checked', true)
    $(elem).find("input[id^='Amount']").each(function () {
        $(this).unbind("blur").bind("blur", function () {
            CalculateFBLAmount(this);
        });
    });

}


function ReBindHandlingChargeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
        var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        $(this).find("input[id^='ChargeName']").each(function () {
            AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
        });
        if ($(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').attr('style') != "display: none;") {
            $(this).find("input[id^='BillTo']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
            });
        }

        //$(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');

        $(this).find("input[id^='Text_BillTo']").closest('span').css('width', '');
        $(this).find("input[id^='Text_ChargeName']").closest('span').css('width', '');
        $(this).find("input[id^='Amount']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                CalculateFBLAmount(this);
            });
        });
    });
    if ($(elem).find("td[id^='tdSNoCol']").html() == MendatoryPaymentCharges.length) {
        $(elem).find("td[id^=transAction]").find("i[title=Delete]").remove();

    }

    CalculateTotalFBLAmount();
}
function SetChargeValues(textId, textValue, keyId, keyValue) {
    var chkCash = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCash]");
    var chkCredit = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCredit]");

    if (keyValue == "0") {
        MarkSelected(chkCash);
        chkCash.attr('disabled', false);
    } else {
        MarkSelected(chkCredit);
        chkCash.attr('disabled', true);
    }
    CalculateTotalFBLAmount();
}
function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");
                $("#" + textId).closest('tr').find("input[id^='Amount']").val("0");
                $("#" + textId).closest('tr').find("input[id^='_tempAmount']").val("0");
                $("#" + textId).closest('tr').find("span[id^='TotalAmount']").html("");
                $("#" + textId).closest('tr').find("input[id^='TotalAmount']").val("");
                Flag = false;
            }
        }
    });
    return Flag;
}
function BindEDox() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtAWBEDox?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            var alldocrcvd = edoxData.Table1;

            var docRcvd = false;
            if (alldocrcvd.length > 0) {
                var docItem = alldocrcvd[0];
                docRcvd = docItem.IsAllEDoxRecieved.toLowerCase() == "true" ? true : false;
                // $("#XRay").prop("checked", docRcvd == "true" ? true : false);
                $("#XRay").prop("checked", docRcvd);
                //$("#XRay").val(resItem.XrayRequired);
                $("#Remarks").val(docItem.AllEDoxReceivedRemarks);
            }

            cfi.makeTrans("shipment_shipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray);
            if (!docRcvd) {
                $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id='areaTrans_shipment_shipmentedoxinfo']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
                    });
                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                });
            }
            else {
                var prevtr = $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("tr[id='areaTrans_shipment_shipmentedoxinfo']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("tr[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }
        },
        error: {

        }
    });
}

function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
    });
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function UploadEDoxDocument(objId, nexctrlid) {

    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });

}

function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindBankAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BankName']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
    });
}

function ReBindBankAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentaddcheque']").find("[id^='areaTrans_shipment_shipmentaddcheque']").each(function () {
        $(this).find("input[id^='BankName']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}
function BindReservationSection() {

    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    //cfi.AutoComplete("Commodity", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("Commodity", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], null, "contains");
    cfi.AutoComplete("ShipmentOrigin", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("ShipmentDestination", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("IssuingAgent", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
    cfi.AutoComplete("SpecialHandlingCode", "CODE,Description", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",", null, null, null, GetDGRDetails, true);
    cfi.AutoComplete("buptype", "Description", "buptype", "SNO", "Description", "", null, "contains");
    cfi.AutoComplete("densitygroup", "GroupName", "CommodityDensityGroup", "SNO", "GroupName", "", null, "contains");
    cfi.AutoComplete("SubGroupCommodity", "SubGroupName", "vw_Commodity_CommoditySubGroup", "SubGroupSNo", "SubGroupName", "", null, "contains");
    cfi.AutoComplete("CarrierCode", "CarrierCode", "airline", "SNo", "CarrierCode", "", null, "contains");

    $("#AWBDate").data("kendoDatePicker").value(new Date());

    $('#AWBDate').prop('readonly', true);
    $('#AWBDate').parent().css('width', '100px');
    $('#chkFWBAmmendMent').prop('checked', false);
    //$("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
    //    cfi.PopUp("divareaTrans_shipment_fwbshipmentclasssphc", "SPHC");
    //});
    $("#NoofHouse").attr('readonly', 'true');
    tblhtml = $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("table").html();
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

    cfi.AutoComplete("NatureofGoods", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], ShowOtherNog, "contains");

    $("#Text_NatureofGoods").closest("td").append('</br><input type="text" class="transSection k-input" name="OtherNOG" id="OtherNOG" tabindex="16" style="width: 170px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off">')
    $("#OtherNOG").hide();

    cfi.Numeric("CBM", 3);
    cfi.Numeric("VolumeWt", 3);

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

    //$("#GrossWt").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this);
    //});
    //$("#VolumeWt").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this);
    //});
    //$("#ChargeableWt").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this);
    //});
    //$("#CBM").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this);
    //});
    if (!$("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow")) {
        cfi.PopUpCreate("divareaTrans_shipment_shipmentSHCSubGroup", "SHC Sub Group Details", 800);
    }
    cfi.Numeric("txtDGRPieces", 0)

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetAcceptanceInformation?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
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
                $("#Pieces").val(resItem.Pieces == 0 ? "" : resItem.Pieces);
                $("#_tempPieces").val(resItem.Pieces == 0 ? "" : resItem.Pieces);

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
                $("#CBM").val(resItem.CBM == 0 ? "" : resItem.CBM);
                $("#_tempCBM").val(resItem.CBM == 0 ? "" : resItem.CBM);

                //$("#VolumeWt").data("kendoNumericTextBox").value(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#VolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3) == 0 ? "" : parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#_tempVolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3) == 0 ? "" : parseFloat(resItem.VolumeWeight || "0").toFixed(3));

                $("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#AWBNo").val(resItem.AWBNo);
                $("#AWBDate").data("kendoDatePicker").value(resItem.AWBDate);
                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName);
                $("#Text_IssuingAgent").data("kendoAutoComplete").setDefaultValue(resItem.AgentBranchSNo, resItem.AgentName);
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


            $("div[id=divareaTrans_shipment_fwbshipmentclasssphc]").not(':first').remove();
            $("div[id=divareaTrans_shipment_fwbshipmentnog]").not(':first').remove();
            //-- Add seprate Save Button for DGR Detials
            $("div[id$='areaTrans_shipment_fwbshipmentclasssphc'] table >tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
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

            cfi.makeTrans("shipment_fwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray, 8);
            $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("[id='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
                        cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
                    }
                });
                //$(this).find("input[id^='ShippingName']").each(function () {
                //    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                //        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
                //    }
                //});
                $(this).find("input[id^='Class']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
                    }
                });
                $(this).find("input[id^='SubRisk']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                });
                $(this).find("input[id^='PackingGroup']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
                        cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
                    }
                });
                $(this).find("input[id^='Unit']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
                        cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
                    }
                });
                $(this).find("input[id^='PackingInst']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
                        cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
                    }
                });
                $(this).find("input[id^='ERG']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
                    }
                });

                $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
                //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
                $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
            });

            if (HasDGRArray.length > 0) {
                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_shipment_fwbshipmentclasssphc", "DGR Details", 1400);
                    $("div[id='divareaTrans_shipment_fwbshipmentclasssphc']").find("input[id^='Text_SPHC']").attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
                    $("div[id='divareaTrans_shipment_fwbshipmentclasssphc']").find("input[id^='Text_UnNo']").attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
                });

            }
            // $("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });

            $("div[id='divareaTrans_shipment_fwbshipmentnog']").find("tr[id^='areaTrans_shipment_fwbshipmentnog']").each(function (i, row) {
                cfi.AutoComplete($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], EnableOtherNog, "contains");
                $(row).find("input[id^='Text_OtherNatureofGoods']").parent().parent().css('width', '200px');
                $(row).find("input[id^='NOG']").attr('disabled', 1);
                if (NOGData.length > 0) {
                    if (NOGData[i] != undefined) {
                        $("#" + $(row).find("input[id^='Text_OtherNatureofGoods']").attr("id")).data("kendoAutoComplete").setDefaultValue(NOGData[i].OtherNatureofGoods, NOGData[i].Text_OtherNatureofGoods);
                    }
                }
            });

            cfi.makeTrans("shipment_fwbshipmentnog", null, null, null, null, null, NOGData);// Bind NOG Data
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
                if (!$("#divareaTrans_shipment_fwbshipmentnog").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_shipment_fwbshipmentnog", "Nature of Goods Details", 650);
                }
                else {
                    $("#divareaTrans_shipment_fwbshipmentnog").data("kendoWindow").open();
                }

                var PcsRow = 0, WtRow = 0, NogRow = 0;
                $("div[id$='divareaTrans_shipment_fwbshipmentnog']").find("[id^='areaTrans_shipment_fwbshipmentnog']").each(function () {
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

                var FirstNogRow = $("div[id$='divareaTrans_shipment_fwbshipmentnog']").find("[id='areaTrans_shipment_fwbshipmentnog']:first");
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
            $("div[id$='divareaTrans_shipment_fwbshipmentnog']").find("[id^='areaTrans_shipment_fwbshipmentnog']").each(function () {
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
                    var Row = '<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + '"<input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"><input type="hidden" name="IsDGR_' + Sno + '" id="IsDGR_' + Sno + '" value="' + SHCSubGroupdata[i].IsDGR + '" class="transSection"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '</td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SHCSubGroupdata[i].SPHCSNo + '" id="SHCSNo_' + SHCSubGroupdata[i].SPHCSNo + '" value=' + SHCSubGroupdata[i].SPHCSNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td>'
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
                    cfi.AutoComplete($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("name"), "SPHCCode", "vSPHCTrans", "SNo", "SPHCCode", "", null, "contains", ",");
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


            // Bind SHC Sub Group Data Ends
            cfi.makeTrans("shipment_fwbshipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            $("div[id$='divareaTrans_shipment_fwbshipmentitinerary']").find("[id='areaTrans_shipment_fwbshipmentitinerary']").each(function () {

                $(this).find("input[id^='BoardPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='offPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='FlightNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight_FWB", "SNO", "FlightNo", ["FlightNo"], ValidateFlight, "contains");
                });
                var ctrlID = $(this).find("input[id^='FlightDate']").attr("id");
                $(this).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight(ctrlID) });
            });
            $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
            if (itenData.length <= 0) {
                if (resData.length > 0 && resItem != undefined) {
                    $("div[id$='divareaTrans_shipment_fwbshipmentitinerary']").find("[id='areaTrans_shipment_fwbshipmentitinerary']").first().find("input[id^=Text_BoardPoint]").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                    $("div[id$='divareaTrans_shipment_fwbshipmentitinerary']").find("[id='areaTrans_shipment_fwbshipmentitinerary']").first().find("input[id^=Text_offPoint]").data("kendoAutoComplete").setDefaultValue(resItem.RoutingSNo, resItem.RoutingCityCode);
                }
            }

            $("#AWBNo").unbind("keyup").bind("keyup", function () {
                if ($(this).val().length == 3) {
                    $(this).val($(this).val() + "-");
                }
            });
            $("#Text_CarrierCode").closest('span').css('width', '50px');
            if (resData.length <= 0) {
                $("div[id=divareaTrans_shipment_fwbshipmentitinerary]").find("tr[id='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
            if (userContext.SpecialRights.DGR == true) {
                $("a[id^='ahref_ClassDetails']").show();
            } else {
                $("a[id^='ahref_ClassDetails']").hide();
            }
            if (IsAgentBUP == true) {
                $("div[id$='divareaTrans_shipment_fwbshipmentitinerary']").find("[id='areaTrans_shipment_fwbshipmentitinerary']").each(function () {
                    $(this).find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
                    $(this).find("input[id^='Text_offPoint']").data("kendoAutoComplete").enable(false);
                    $(this).find("input[id^='FlightDate']").data('kendoDatePicker').enable(false);
                    $(this).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").enable(false);
                    $(this).find("div[id^='transActionDiv']").css('display', 'none');
                });
            }

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

    $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {

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

    $("div[id=divareaTrans_shipment_fwbshipmentclasssphc]").not(':first').remove();
    $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("tbody").remove();
    $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").append(tblhtml);
    $("div[id$='areaTrans_shipment_fwbshipmentclasssphc'] tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
    $("#btnSaveDGR").unbind("click").bind("click", function () {
        SaveDGRDetails();
    });
    cfi.makeTrans("shipment_fwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, GDRRemainingData);
    $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
        });
        //$(this).find("input[id^='ShippingName']").each(function () {
        //    cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
        //});
        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {
            //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
        });
        $(this).find("input[id^='Unit']").each(function () {
            //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {
            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
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
                        cfi.AutoComplete($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("name"), "SPHCCode", "vSPHCTrans", "SNo", "SPHCCode", "", null, "contains", ",");
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
                $("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
                        cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
                    });
                    //$(this).find("input[id^='ShippingName']").each(function () {
                    //    cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
                    //});
                    $(this).find("input[id^='Class']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
                    });
                    $(this).find("input[id^='SubRisk']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                    });
                    $(this).find("input[id^='PackingGroup']").each(function () {
                        //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
                        cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
                    });
                    $(this).find("input[id^='Unit']").each(function () {
                        //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
                        cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
                    });
                    $(this).find("input[id^='PackingInst']").each(function () {
                        //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
                        cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
                    });
                    $(this).find("input[id^='ERG']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
                    });
                    $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
                    //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
                    $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
                });

                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_shipment_fwbshipmentclasssphc", "DGR Details", 1400);
                    $("div[id='divareaTrans_shipment_fwbshipmentclasssphc']").find("input[id^='Text_SPHC']").attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
                    $("div[id='divareaTrans_shipment_fwbshipmentclasssphc']").find("input[id^='Text_UnNo']").attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
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

function SaveDGRDetails() {
    var ValidMsg = true, msg = "";
    $("div[id$='divareaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
        $("div[id=divareaTrans_shipment_fwbshipmentclasssphc]").data("kendoWindow").close();
        ShowMessage('success', 'Success - DGR', " DGR Details Saved Successfully", "bottom-right");
        return false;
    }

    var DGRArray = [];
    $("div[id$='divareaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
                $("div[id=divareaTrans_shipment_fwbshipmentclasssphc]").data("kendoWindow").close();
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
    var totalRow = $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").length;
    $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 != totalRow) {
            $(this).find("div[id^='transActionDiv']").hide();
        }

        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight_FWB", "SNO", "FlightNo", ["FlightNo"], ValidateFlight, "contains");
            }
        });

    });

    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
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
    $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
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
    $(elem).closest("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").each(function () {
        //$(this).find("input[id^='BoardPoint']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});
        //$(this).find("input[id^='offPoint']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});

        //$(this).find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").options.addOnFunction = ResetSelectedFlight;
        //$(this).find("input[id^='Text_offPoint']").data("kendoAutoComplete").options.addOnFunction = ResetSelectedFlight;

        //$(this).find("input[id^='FlightNo']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});
        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight_FWB", "SNO", "FlightNo", ["FlightNo"], ValidateFlight, "contains");
            }
        });
    });
    $(elem).find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(true);
    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").enable(true);
    $(elem).find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(true);
    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });

    var totalRow = $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").length;
    $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 == totalRow) {
            $(this).find("div[id^='transActionDiv']").show();
        }
    });
}

function BindSPHCAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SpecialHandlingCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
    });
    $(elem).find("a[id^='ahref_ClassDetails']").each(function () {
        $(this).unbind("click").bind("click", function () {
            cfi.PopUp("divareaTrans_shipment_fwbshipmentclasssphc", "SPHC Trans");
        });
    });
}

function ReBindSPHCAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentsphc']").find("[id^='areaTrans_shipment_shipmentsphc']").each(function () {
        $(this).find("input[id^='SPHC']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHC", "SNO", "CODE", ["CODE", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("a[id^='ahref_ClassDetails']").each(function () {
            $(this).unbind("click").bind("click", function () {
                cfi.PopUp("divareaTrans_shipment_fwbshipmentclasssphc", "SPHC Trans");
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
            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
        }
        $("#" + "Text_" + $(this).attr("name")).attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
    });
    //$(elem).find("input[id^='ShippingName']").each(function () {
    //    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
    //        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
    //    }
    //});
    $(elem).find("input[id^='Class']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        }
    });
    $(elem).find("input[id^='SubRisk']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        }
    });
    $(elem).find("input[id^='PackingGroup']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
        }
    });
    $(elem).find("input[id^='Unit']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        }
    });
    $(elem).find("input[id^='PackingInst']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
        }
    });
    $(elem).find("input[id^='ERG']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        }
    });
    $(elem).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
    //$(elem).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
    $(elem).find("input[id^='Text_UnNo']").parent().removeAttr("style");
}

function ReBindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
        });
        //$(this).find("input[id^='ShippingName']").each(function () {
        //    cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
        //});
        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {
            //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
        });
        $(this).find("input[id^='Unit']").each(function () {
            //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {
            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
        //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
        $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function removeHandlingMessage(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmenthandlinginfo']").find("[id^='areaTrans_shipment_shipmenthandlinginfo']").each(function () {
        $(this).find("input[id^='Type']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "HandlingMessageType", "SNo", "MessageType", ["MessageType"]);
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

function ValidateWeighingProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select " + userContext.SysSetting.SLICaption + " for processing.", "bottom-right");
        return;
    }

    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;

    $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:590px;'></div>");

    $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //if (processedpcscount == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }

    //var totalPcs = parseInt($("#TotalPieces").val());
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());

        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    if (!isProcessed) {
        handleAdd($("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("td:last"), "areaTrans_shipment_shipmentweightdetail", pieceSequence, "ScanPieces", "RemainingPieces");
        var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
        var SLINO = $("#Text_SLINo").val().split("-")[0];
        var HAWBNO = $("#Text_SLINo").val().split("-")[2];

        $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
        $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

        $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
        $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("span[id^='SLINo']").html(SLINO);

        $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
        $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

    }



}

function ValidateXRayProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select " + userContext.SysSetting.SLICaption + " for processing.", "bottom-right");
        return;
    }
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:590px;'></div>");
    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs.trim() + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //if (processedpcscount == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        return;
    }
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    //var totalPcs = parseInt($("#TotalPieces").val());
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);

    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    handleAdd($("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("td:last"), "areaTrans_shipment_shipmentxraydetail", pieceSequence, "ScanPieces", "RemainingPieces");

    var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

}

function ValidateLocationProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select " + userContext.SysSetting.SLICaption + " for processing.", "bottom-right");
        return;
    }
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //--
    var ULDLocationPcs = 0;
    $("div[id='divareaTrans_shipment_shipmentuldlocation']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentuldlocation']").each(function () {
        ULDLocationPcs += 1;
    });
    //--
    //if (processedpcscount + ULDLocationPcs == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }
    //var totalPcs = parseInt($("#TotalPieces").val());if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val() == "" ? "0" : $("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val() == "" ? "0" : $("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        //if (startPicesno > totalPcs || (endPicesno + ULDLocationPcs) > totalPcs) {
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        //alert(pieceSequence);
    }
    handleAdd($("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("td:last"), "areaTrans_shipment_shipmentlocationdetail", pieceSequence, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);

    var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

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

function SwitchScanType(val, obj) {
    var closesttable = $(obj).closest("table");
    var closesttrindex = $(obj).closest("tr").index();
    closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").hide();
    if (val == "0") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    else if (val == "1") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    SetTotalPcs();
}

function BindWeighingMachineEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
        if (typevalue == "1") {
            $('#AWBNo').focus();
        }
    });
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtWeighing?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var weighingData = jQuery.parseJSON(result);
            var weighingArray = weighingData.Table0;
            var arr = weighingData.Table1;
            var ULDDimArray = weighingData.Table2;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();
            $("div[id$='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id='areaTrans_shipment_shipmentweightdetail']:first").hide();
            if (weighingArray.length > 0) {
                for (var i = 0; i < weighingArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("td:last"), "areaTrans_shipment_shipmentweightdetail", weighingArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");
                    var row = $("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last");
                    row.find("[id^='GrossWt_']").val(weighingArray[i].GrossWt);
                    row.find("[id^='Remarks_']").val(weighingArray[i].Remarks);
                    row.find("input[type=hidden][id^='SLISNo']").val(weighingArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(weighingArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(weighingArray[i].SLINO);
                    row.find("span[id^='SLINo']").html(weighingArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(weighingArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(weighingArray[i].HAWBNo);

                }

            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_shipment_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentweightdetail']:last").find("td:last"), "areaTrans_shipment_shipmentweightdetail", dblscan, "ScanPieces", "RemainingPieces");
            }
            cfi.makeTrans("shipment_shipmentweightulddetail", null, null, null, null, null, ULDDimArray);
            if (ULDDimArray.length <= 0) {
                $("div[id$='areaTrans_shipment_shipmentweightulddetail']").find("[id='areaTrans_shipment_shipmentweightulddetail']:first").hide();
            } else {
                $("input[id='RemainingPieces']").val(parseInt($("input[id='RemainingPieces']").val()) - parseInt($("div[id$='areaTrans_shipment_shipmentweightulddetail']").find("tr[id^='areaTrans_shipment_shipmentweightulddetail']").length));
                $("span[id='RemainingPieces']").text($("input[id='RemainingPieces']").val());
            }

            $('#divareaTrans_shipment_shipmentweightulddetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(10)').css("display", "none");
                $(tr).find("input[id^='CapturedWt']").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='CapturedWt']").attr("data-valid", "required");
                $(tr).find("input[id^='TareWt']").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='GrossWt']").attr('readonly', true);
            });

            $('#divareaTrans_shipment_shipmentweightdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");

            });

            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}

function fn_ValidateULDWt(obj) {
    var CurrentRow = $(obj).closest('tr');
    if (parseFloat(CurrentRow.find("input[id^='CapturedWt']").val() == "" ? "0" : CurrentRow.find("input[id^='CapturedWt']").val()) < parseFloat(CurrentRow.find("input[id^='TareWt']").val() == "" ? "0" : CurrentRow.find("input[id^='TareWt']").val())) {
        if ($(obj).attr('recname') == "CapturedWt") {
            ShowMessage('warning', 'Warning - Weighing Machine', "Captured Weight can't be less than Tare Weight.", "bottom-right");
            CurrentRow.find("input[id^='CapturedWt']").val('');
            CurrentRow.find("input[id^='GrossWt']").val('');
        } else {
            ShowMessage('warning', 'Warning - Weighing Machine', "Tare Weight can't be greater than Captured Weight.", "bottom-right");
            CurrentRow.find("input[id^='CapturedWt']").val('');
            CurrentRow.find("input[id^='GrossWt']").val('');
        }
    } else {
        CurrentRow.find("input[id^='GrossWt']").val((parseFloat(CurrentRow.find("input[id^='CapturedWt']").val() == "" ? "0" : CurrentRow.find("input[id^='CapturedWt']").val()) - parseFloat(CurrentRow.find("input[id^='TareWt']").val() == "" ? "0" : CurrentRow.find("input[id^='TareWt']").val())).toFixed(3));
    }

}
function ResetPieces() {
    $("#Piecestobeweighed").val("");
    $("#_tempPiecestobeweighed").val("");
    $("#toPiecestobeweighed").val("")
    $("#_temptoPiecestobeweighed").val("")
}
function BindULDAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ULDNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    });
}

function BindDimensionEvents() {
    SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetDimemsionsAndULD?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var dimArray = dimuldData.Table0;
            var uldArray = dimuldData.Table1;
            var totaldim = dimuldData.Table2;
            var awbInfo = dimuldData.Table3;

            var arr = dimuldData.Table4;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            //cfi.makeTrans("shipment_shipmentuld", null, null, BindULDAutoComplete, null, beforeAddULDEventCallback, uldArray);
            //if (uldArray.length <= 0) {
            //    $("div[id$='areaTrans_shipment_shipmentuld']").find("[id='areaTrans_shipment_shipmentuld']:first").hide();
            //}
            cfi.makeTrans("shipment_shipmentdimension", null, null, AfterAddDim, checkonRemove, beforeAddEventCallback, dimArray);

            if (totaldim.length > 0) {
                $("#Unit[value='" + totaldim[0].Unit + "']").prop('checked', true);
                $("input[id='DimVolumeWt']").val(totaldim[0].DimVolumeWt);
                $("span[id='DimVolumeWt']").html(totaldim[0].DimVolumeWt);
            }
            else if (awbInfo.length > 0) {
                $("input[id='DimVolumeWt']").val(awbInfo[0].VOLUMEWEIGHT);
                $("span[id='DimVolumeWt']").html(awbInfo[0].VOLUMEWEIGHT);
            }
            $("[id='Unit']").unbind("click").bind("click", function (e) {
                var typevalue = $(this).attr("value");
                CalculateVolume();
            });


            //$("div[id$='areaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function () {
            //    $(this).find('td:eq(1)').css("display", "none");
            //    $(this).find("input[id^='ULDNo']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            //    });
            //    $(this).find("input[id^='Text_ULDNo']").closest('span').css('width', '100%');
            //});
            $("div[id$='divareaTrans_shipment_shipmentdimension']").find("[id^='areaTrans_shipment_shipmentdimension']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                //$(tr).find('td:eq(7)').prepend("<label for='Pieces'>" + $(tr).find("input[id^='Pieces']").val().toString() + " /</label>");
                $(tr).find('td:eq(7)').append("<label for='Pieces'>/" + dimArray[row]['totalpieces'].toString() + "</label>");

                $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveRow(this);
                });
                $(tr).find("input[id^=Length]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=Width]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=Height]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
            });
            $("div[id$='divareaTrans_shipment_shipmentdimension'] table tr:first").find('td:eq(1)').css("display", "none");
            //$("div[id$='areaTrans_shipment_shipmentuld'] table tr:eq(2)").find('td:eq(1)').css("display", "none");

        },
        error: {

        }
    });
}
function fn_AddNewRow(input) {
    fn_CalculateSplitTotalPcs(input);
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    if ($(input).parent().find("label").text() != undefined && $(input).parent().find("label").text() != "") {
        CurrentTotalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
    }
    CurrentSLISNo = $(input).parent().parent().find("span[id^='SLISNo']").text();

    $(input).parent().parent().parent().find('tr').each(function (row, tr) {
        if ($(tr).find("span[id^='SLISNo']").text() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='Pieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var trClone = $(input).parent().parent().clone(false);
        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }
        trClone.find("input[id^='Pieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
        //trClone.find("input[id^='Length']").val('');
        //trClone.find("input[id^='Width']").val('');
        //trClone.find("input[id^='Height']").val('');
        //trClone.find("input[id^='VolumeWt']").val('');
        //trClone.find("VolumeWt[id^='VolumeWt']").text('');

        trClone.find("input[id*='Length']").attr('readonly', false);
        trClone.find("input[id*='Width']").attr('readonly', false);
        trClone.find("input[id*='Height']").attr('readonly', false);

        $(input).parent().parent().after(trClone);
        $("div[id$='divareaTrans_shipment_shipmentdimension']").find("[id^='areaTrans_shipment_shipmentdimension']").each(function (row, tr) {
            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").remove();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveRow(this);
            });
            $(tr).find("input[id^=Length]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=Width]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=Height]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });

            $(tr).find("input[id^='Length']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });
            $(tr).find("input[id^='Width']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });
            $(tr).find("input[id^='Height']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });


        });
    }
    CalculateVolume();
}
function fn_RemoveRow(input) {
    var tr = $(input).closest('tr');
    if (tr.find("span[id^='SLISNo']").text() == tr.prev().find("span[id^='SLISNo']").text()) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            tr.prev().find("input[id*='Pieces']").val(parseInt(tr.prev().find("input[id^='Pieces']").val()) + parseInt(tr.find("input[id^='Pieces']").val()));
            $(input).closest('tr').remove();
        }
    }
    $("div[id$='divareaTrans_shipment_shipmentdimension']").find("[id^='areaTrans_shipment_shipmentdimension']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
    CalculateVolume(input);
}
function fn_CalculateSplitTotalPcs(input) {
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');
    CurrentSLISNo = $(input).parent().parent().find("span[id^='SLISNo']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();

        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("span[id^='SLISNo']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='Pieces']").val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='Pieces']").val());
            }
        });
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Pieces should be less than Total Pieces");
                ShowMessage('warning', 'Warning -Pieces should be less than Total Pieces', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;

        }
    }
    return flag;
}

function BindULDDimensionInfo() {
    // SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetULDDimensionInfo?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var uldArray = dimuldData.Table0;

            cfi.makeTrans("shipment_shipmentuld", null, null, BindULDAutoComplete, null, null, uldArray);
            if (uldArray.length <= 0) {
                $("div[id$='areaTrans_shipment_shipmentuld']").find("[id='areaTrans_shipment_shipmentuld']:first").hide();
            }

            $("div[id$='areaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
                $(tr).find("input[id^='Unit']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
                });
                $(tr).find('td:eq(6)').append("<label for='Pieces' style='display:none'>/" + uldArray[row]['totalpieces'].toString() + "</label>");
                $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveULDRow(this);
                });
                $(tr).find("input[id^=SLACPieces]").unbind("keydown").bind("keydown", function () {
                    ISNumber(this);
                });
                $(tr).find("input[id^=UldPieces]").unbind("keydown").bind("keydown", function () {
                    ISNumber(this);
                });
                $(tr).find("input[id^=ULDLength]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=ULDWidth]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=ULDHeight]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
                $(tr).find("span[id^='SLISNo']").css("display", "none");
                if (row > 0) {
                    if ($(tr).find("span[id^='ULDNo']").text() == $(tr).prev().find("span[id^='ULDNo']").text()) {
                        $(tr).find("span[id^='SLINo']").css("display", "none");
                        $(tr).find("span[id^='HAWBNo']").css("display", "none");
                        $(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
                        $(tr).find("input[id*='SLACPieces']").css("display", "none");
                    }
                }
            });

            $("div[id$='areaTrans_shipment_shipmentuld'] table tr:eq(2)").find('td:eq(1)').css("display", "none");
            //$("div[id$='areaTrans_shipment_shipmentuld'] table tr:eq(2)").find('td:eq(12)').css("display", "none");

        },
        error: {

        }
    });
}
function fn_AddNewULDRow(input) {
    fn_CalculateSplitTotalULDPcs(input);
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    var SLACPcs = 0;
    if ($(input).parent().find("label").text() != undefined && $(input).parent().find("label").text() != "") {
        CurrentTotalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
    }
    SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? "0" : $(input).parent().parent().find("input[id*='SLACPieces']").val();
    CurrentTotalPcs = parseInt(SLACPcs) > parseInt(CurrentTotalPcs) ? SLACPcs : CurrentTotalPcs;

    CurrentSLISNo = $(input).parent().parent().find("span[id^='ULDNo']").text();

    $(input).parent().parent().parent().find('tr').each(function (row, tr) {
        if ($(tr).find("span[id^='ULDNo']").text() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var trClone = $(input).parent().parent().clone(false);
        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }
        trClone.find("input[id^='UldPieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);

        $(input).parent().parent().find("input[id*='SLACPieces']").attr('disabled', true);
        trClone.find("span[id^='SLINo']").css("display", "none");
        trClone.find("span[id^='HAWBNo']").css("display", "none");
        trClone.find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
        trClone.find("input[id*='SLACPieces']").css("display", "none");

        trClone.find("input[id^='ULDLength']").attr('readonly', false);
        trClone.find("input[id^='ULDWidth']").attr('readonly', false);
        trClone.find("input[id^='ULDHeight']").attr('readonly', false);


        $(input).parent().parent().after(trClone);

        $("div[id$='divareaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function (row, tr) {
            $(tr).find("[id^='Unit']").attr('id', 'Unit' + row)
            $(tr).find("[id^='Unit']").attr('name', 'Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('id', 'Text_Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('name', 'Text_Unit' + row)

            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").remove();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveULDRow(this);
            });
            //$(tr).find("input[id^='ULDNo']").each(function () {
            //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            //});

            $(tr).find("input[id^='Unit']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
            });

            $(tr).find("input[id^=UldPieces]").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $(tr).find("input[id^=ULDLength]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=ULDWidth]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=ULDHeight]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });


            $(tr).find("input[id^='ULDLength']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDWidth']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDHeight']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });


        });
        $("div[id$='divareaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").find("input[id*='Text_Unit']").closest('span').css('width', '')
    }
    CalculateULDVolume();
}
function fn_RemoveULDRow(input) {
    var tr = $(input).closest('tr');
    if (tr.find("span[id^='ULDNo']").text() == tr.prev().find("span[id^='ULDNo']").text()) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            tr.prev().find("input[id*='UldPieces']").val(parseInt(tr.prev().find("input[id^='UldPieces']").val()) + parseInt(tr.find("input[id^='UldPieces']").val()));
            $(input).closest('tr').remove();
        }
    }
    $("div[id$='divareaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
    CalculateULDVolume(input);
}
function fn_ValidateSLACPCS(input) {
    var tr = $(input).closest('tr');
    var SLACPcs, PCS;
    SLACPcs = $(input).val() == "" ? "0" : $(input).val();
    PCS = $(input).closest('tr').find("label[for='Pieces']").text().replace("/", "") == "" ? "0" : $(input).closest('tr').find("label[for='Pieces']").text().replace("/", "");
    if (parseInt(SLACPcs) < parseInt(PCS)) {
        alert("SLAC Pieces should not be less than ULD Pieces");
        $(input).val(PCS);
    }
}
function fn_CalculateSplitTotalULDPcs(input) {
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');
    CurrentSLISNo = $(input).parent().parent().find("span[id^='ULDNo']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();
        ///18
        SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? "0" : $(input).parent().parent().find("input[id*='SLACPieces']").val();
        totalPcs = parseInt(SLACPcs) > parseInt(totalPcs) ? SLACPcs : totalPcs;
        ////18
        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("span[id^='ULDNo']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
            }
        });
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Pieces should be less than Total Pieces");
                ShowMessage('warning', 'Warning -Pieces should be less than Total Pieces', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;

        }
    }
    return flag;
}
function CalculateULDVolume(elem, obj) {
    elem = $("#areaTrans_shipment_shipmentuld");

    var VolumeCalculation = 0;


    elem.closest("div").find("table > tbody").find("[id^='areaTrans_shipment_shipmentuld']").each(function () {

        var Width = $(this).find("input[id^='ULDWidth']").val() == "" ? "0" : $(this).find("input[id^='ULDWidth']").val();
        var Length = $(this).find("input[id^='ULDLength']").val() == "" ? "0" : $(this).find("input[id^='ULDLength']").val();
        var Height = $(this).find("input[id^='ULDHeight']").val() == "" ? "0" : $(this).find("input[id^='ULDHeight']").val();
        var Pieces = $(this).find("input[id^='UldPieces']").val() == "" ? "0" : $(this).find("input[id^='UldPieces']").val();
        var divisor = 1;
        divisor = $(this).find("input[id^='Text_Unit'").data("kendoAutoComplete").value().split('-')[0] == "CMT" ? 6000 : 366;
        var currentVolume = 0;
        if (Pieces != "" && Pieces != undefined) {
            currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
            var volWeight = (currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);

            $(this).find("span[id^='UldVolWt']").html(volWeight.toFixed(3) + "(" + (volWeight.toFixed(3) / 166.66).toFixed(3) + ")");
            $(this).find("input[id^='UldVolWt']").val(volWeight.toFixed(3));
        }
    });
}

function BindULDDimensionDetails() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetULDDimensionDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var uldArray = dimuldData.Table0;

            //cfi.makeTrans("shipment_shipmentuld", null, null, BindULDAutoComplete, null, beforeAddULDEventCallback, uldArray);
            cfi.makeTrans("shipment_shipmentulddetails", null, null, BindULDAutoComplete, null, null, uldArray);
            if (uldArray.length <= 0) {
                $("div[id$='divareaTrans_shipment_shipmentulddetails']").find("[id='areaTrans_shipment_shipmentulddetails']:first").hide();
            }


            $("div[id$='areaTrans_shipment_shipmentulddetails']").find("[id^='areaTrans_shipment_shipmentulddetails']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
                $(tr).find("input[id^='UldLoadingCode']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDLoadingCode", "ULDLoadingCodes", "SNo", "ULDLoadingCode", ["ULDLoadingCode", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldLoadingIndicators']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDLoadingIndicator", "ULDLoadingIndicator", "SNo", "ULDLoadingIndicator", ["ULDLoadingIndicator", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldContourCode']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AbbrCode", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldBupType']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "Description", "buptype", "SNo", "Description", ["Description"], null, "contains");
                });
                $(tr).find("input[id^='UldBasePallet']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });

                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
            });
            $("div[id$='areaTrans_shipment_shipmentulddetails'] table tr:eq(2)").find('td:eq(1)').css("display", "none");
            $("div[id$='areaTrans_shipment_shipmentulddetails'] table tr:eq(2)").find('td:last').css("display", "none");

        },
        error: {

        }
    });
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
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, addOnFunction: function (evt, rowIndex) { return CalculateRateTotal(); }, ctrlCss: { width: "90px" }, isRequired: false, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
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
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
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
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: 0, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                     {
                         name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                     },
                 {
                     name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, tableName: "ULD", textColumn: "ULDName", templateColumn: "", keyColumn: "SNo"
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
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
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
                     name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CheckDuplicae(this)" }, ctrlCss: { width: "90px" }, isRequired: true, tableName: "AWBOtherChargeCode", textColumn: "OtherChargeCode", keyColumn: "OtherChargeCode", templateColumn: ["OtherChargeCode", "Description"]
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
    cfi.AutoComplete("AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", ["AWBChargeCode", "Description"], null, "contains");
    cfi.AutoCompleteByDataSource("Valuation", WeightValuation, EnableDisableChargeField);
    //cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);
    cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation, SetOtherChargeValue); // Added by RH for Other Charge 14-02-17

    cfi.AutoComplete("CDCCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("CDCDestCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

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
                $("#_tempCDCConversionRate").val(RateArray[0].CDCCurrencyConversionRate == "" ? "" : parseFloat(RateArray[0].CDCCurrencyConversionRate).toFixed(6));
                $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCDestinationCurrencyCode, RateArray[0].CDCDestinationCurrencyCode);
                $("#CDCChargeAmount").val(RateArray[0].CDCChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCChargeAmount).toFixed(3));
                $("#_tempCDCChargeAmount").val(RateArray[0].CDCChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCChargeAmount).toFixed(3));
                // $("#CDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));

                $("#CDCTotalCharAmount").data("kendoNumericTextBox").value(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));
                $("#TotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#_tempTotalFreight").val(RateArray[0].TotalPrepaidAmount);

                $("#TotalAmount").val(RateArray[0].TotalCollectAmount);
                $("#_tempTotalAmount").val(RateArray[0].TotalCollectAmount);

                $('#CDCConversionRate').removeAttr('data-valid');
                $('#CDCChargeAmount').removeAttr('data-valid');
                $('#CDCTotalCharAmount').removeAttr('data-valid');
                if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
                    $('#CDCChargeAmount').removeAttr('disabled');
                    $('#CDCTotalCharAmount').removeAttr('disabled');
                    //$('#Text_CDCCurrencyCode').removeAttr('disabled');
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(true);
                    $('#CDCConversionRate').removeAttr('disabled');
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(true);
                    $('#CDCConversionRate').attr('data-valid', 'required,min[0.01]');
                    $('#CDCChargeAmount').attr('data-valid', 'required,min[0.01]');
                    $('#CDCTotalCharAmount').attr('data-valid', 'required,min[0.01]');
                } else {
                    $('#CDCChargeAmount').val('');
                    $('#_tempCDCChargeAmount').val('');
                    $('#CDCTotalCharAmount').val('');
                    $('#_tempCDCTotalCharAmount').val('');
                    $('#CDCConversionRate').val('');
                    $('#_tempCDCConversionRate').val('');
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
    $('#CDCConversionRate').removeAttr('data-valid');
    $('#CDCChargeAmount').removeAttr('data-valid');
    $('#CDCTotalCharAmount').removeAttr('data-valid');
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
        $('#CDCChargeAmount').removeAttr('disabled');
        $('#CDCTotalCharAmount').removeAttr('disabled');
        $('#Text_CDCCurrencyCode').removeAttr('disabled');
        $('#CDCConversionRate').removeAttr('disabled');
        $('#Text_CDCDestCurrencyCode').removeAttr('disabled');
        $('#CDCConversionRate').attr('data-valid', 'required,min[0.01]');
        $('#CDCChargeAmount').attr('data-valid', 'required,min[0.01]');
        $('#CDCTotalCharAmount').attr('data-valid', 'required,min[0.01]');
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
                     name: "MeasurementUnitCode", display: "Mes. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CalculateVol(this);" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "MeasurementUnitCode", textColumn: "UnitCode", templateColumn: "", keyColumn: "UnitCode", templateColumn: ["UnitCode", "UnitName"]
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
                         name: "VolumeUnit", display: "Vol. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "VolumeCode", textColumn: "VolumeCode", templateColumn: ["VolumeCode", "Description"], keyColumn: "VolumeCode"
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
    cfi.AutoComplete("OPIAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("OPIOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("OPIOtherAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    //cfi.AutoComplete("REFAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    //cfi.AutoComplete("REFOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("REFOthAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    //cfi.AutoComplete("CORCustomsOriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("ISUPlace", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");

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
        url: "Services/Shipment/FWBService.svc/GetAWBSummary?AWBSNo=" + currentawbsno + "&OfficeSNo=" + userContext.OfficeSNo || "0", async: false, type: "get", dataType: "json", cache: false,
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
            if ($("#Text_REFAirportCityCode").data("kendoAutoComplete").key() == "") {
                $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(AirportCityData[0]["Key"], AirportCityData[0]["Key"]);
            }
            if ($("#Text_REFOfficeDesignator").data("kendoAutoComplete").key() == "") {
                $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(OfficeDesignatorData[0]["Key"], OfficeDesignatorData[0]["Key"]);
            }
            if ($("#Text_REFCompDesignator").data("kendoAutoComplete").key() == "") {
                $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(CompanyDesignatorData[0]["Key"], CompanyDesignatorData[0]["Key"]);
            }
        },
        error: {

        }
    });
}
function BindXRayEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");

    cfi.AutoComplete("SecurityStatus", "Description", "SecurityCodes", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("SecurityIssuanc", "Description", "securityissuance", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("ScreeningMethod", "Description", "ScreeningMethods", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("ScreeningExemption", "Description", "ScreeningExemptions", "SNo", "Code", ["Code", "Description"], null, "contains");
    $("#Time").kendoTimePicker({
        format: "HH:mm"
    });

    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtXray?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var xrayData = jQuery.parseJSON(result);
            var xrayArray = xrayData.Table0;
            var arr = xrayData.Table1;
            var UldArray = xrayData.Table2;
            var OtherDetailsArray = xrayData.Table3;

            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            $("div[id$='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id='areaTrans_shipment_shipmentxraydetail']:first").hide();

            if (xrayArray.length > 0) {
                for (var i = 0; i < xrayArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("td:last"), "areaTrans_shipment_shipmentxraydetail", xrayArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");

                    var row = $("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last");

                    row.find("input[type=hidden][id^='SLISNo']").val(xrayArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(xrayArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(xrayArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(xrayArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(xrayArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(xrayArray[i].HAWBNo);
                }

            }
            else if ((isdblclick == undefined ? "FALSE" : isdblclick.toUpperCase()) == "TRUE") {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_shipment_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentxraydetail']:last").find("td:last"), "areaTrans_shipment_shipmentxraydetail", dblscan, "ScanPieces", "RemainingPieces");
            }

            cfi.makeTrans("shipment_shipmentxrayulddetail", null, null, null, null, null, UldArray);
            if (UldArray.length <= 0) {
                $("div[id$='areaTrans_shipment_shipmentxrayulddetail']").find("[id='areaTrans_shipment_shipmentxrayulddetail']:first").hide();
            }
            $('#divareaTrans_shipment_shipmentxrayulddetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(6)').css("display", "none");
                if (row > 2) {
                    $(tr).find("span[id^='XrayStatus']").remove();
                    var checked = $(tr).find("input[id^='XrayStatus']").val() == "True" ? "checked='true'" : "";
                    $(tr).find('td:eq(5)').append("<input type='checkbox' name='chXray" + $(tr).find('td:eq(0)').text() + "' id='chXray" + $(tr).find('td:eq(0)').text() + "' " + checked + "'>");
                }
            });

            if (OtherDetailsArray.length > 0) {
                $("#Text_SecurityStatus").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].SecurityStatusSNo, OtherDetailsArray[0].Text_SecurityStatusSNo);
                $("#Text_SecurityIssuanc").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].SecurityIssuanceSNo, OtherDetailsArray[0].Text_SecurityIssuanceSNo);
                $("#Text_ScreeningMethod").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].ScreerningMethodSNo, OtherDetailsArray[0].Text_ScreerningMethodSNo);
                $("#Text_ScreeningExemption").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].ExemptionSNo, OtherDetailsArray[0].Text_ExemptionSNo);
                $("#OthScreeningMthd").val(OtherDetailsArray[0].OtherScreening);
                $("#AdditionalSecurity").val(OtherDetailsArray[0].AdditionalSecurity);
                $("#Name").val(OtherDetailsArray[0].IssuedBy);
                $("#Date").val(OtherDetailsArray[0].IssueDate);
                $("#Time").val(OtherDetailsArray[0].IssueTime);
            }


            $('#divareaTrans_shipment_shipmentxraydetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}
function BindLocationEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtLocation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var locationData = jQuery.parseJSON(result);
            var locationArray = locationData.Table0;
            var uldArray = locationData.Table1;

            if (uldArray.length > 0) {
                id = "areaTrans_shipment_shipmentuldlocation"
                cfi.makeTrans("shipment_shipmentuldlocation", null, null, BindLocationAutoCompleteForULD, ReBindLocationAutoCompleteForULD, null, uldArray)
                $('#divareaTrans_shipment_shipmentuldlocation table tr td:last').remove();
                $('#divareaTrans_shipment_shipmentuldlocation table tr[id!="areaTrans_shipment_shipmentuldlocation"] td:eq(9)').remove();
            }



            cfi.makeTrans("shipment_shipmentlocationdetail", null, null, BindLocationAutoComplete, ReBindLocationAutoComplete, null, null);

            $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id='areaTrans_shipment_shipmentlocationdetail']:first").hide();
            $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id='areaTrans_shipment_shipmentlocationdetail']:first").find("input[id^='Text_Location']").removeAttr("data-valid");
            if (uldArray.length > 0) {
                $("div[id$='divareaTrans_shipment_shipmentuldlocation']").find("[id='areaTrans_shipment_shipmentuldlocation']").each(function () {
                    $(this).find("input[id^='ULDLocation']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
                    });
                });
            }
            if (locationArray.length > 0) {
                for (var i = 0; i < locationArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("td:last"), "areaTrans_shipment_shipmentlocationdetail", locationArray[i].ScannedPieces, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
                    var row = $("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last");
                    row.find("[id^='Text_Location_']").data("kendoAutoComplete").setDefaultValue(locationArray[i].LocationSNo, locationArray[i].LocationName);

                    row.find("input[type=hidden][id^='SLISNo']").val(locationArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(locationArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(locationArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(locationArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(locationArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(locationArray[i].HAWBNo);
                }

            }
            if (uldArray.length > 0) {
                //$("div[id='divareaTrans_shipment_shipmentuldlocation']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentuldlocation']").each(function (row, tr) {
                //$(tr).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").setDefaultValue(uldArray[row].warehouselocationsno, uldArray[row].location);
                //});
                var RemainingPieces;
                RemainingPieces = $("input[id='RemainingPieces']").val();
                $("input[id='RemainingPieces']").val(RemainingPieces - uldArray.length);
                $("span[id='RemainingPieces']").html(RemainingPieces - uldArray.length);
            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_shipment_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_shipment_shipmentlocationdetail']:last").find("td:last"), "areaTrans_shipment_shipmentlocationdetail", dblscan, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
            }

            $('#divareaTrans_shipment_shipmentuldlocation table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDLocation']").closest('span').css('width', '');
            });
            if (uldArray.length == 0) {
                $('#divareaTrans_shipment_shipmentuldlocation table tr[id^="areaTrans_shipment_shipmentuldlocation"]').remove();
            }


            $('#divareaTrans_shipment_shipmentlocationdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}
function BindLocationAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Location']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_Location']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        $(this).attr("data-valid", "required");
    });
}

function ReBindLocationAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentlocationdetail']").find("[id^='areaTrans_shipment_shipmentlocationdetail']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).find("input[id^='ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });

    $(mainElem).find("input[id^='ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        //$(this).attr("data-valid", "required");
    });
}

function ReBindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentuldlocation']").find("[id^='areaTrans_shipment_shipmentuldlocation']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
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


    $("#divareaTrans_shipment_fwbshipmentositrans table tr[data-popup='false']").each(function (row, i) {
        if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
            OSIInfoModel.push({ AWBSNo: currentawbsno, OSI: $(i).find('td:nth-child(2) input[type=text]').val() });
        }

    });

    $("#divareaTrans_shipment_fwbshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
        //if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {

        OCIInfoModel.push({
            AWBSNo: currentawbsno,
            CountryCode: $(i).find("td:eq(1) > [id^='CountryCode']").val(),
            InfoType: $(i).find("td:eq(2) > [id^='InfoType']").val(),
            CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='CSControlInfoIdentifire']").val(),
            SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
        });
        //}
    });

    var osiViewModel;
    //var osiViewModel = {
    //    SCI: $("#SCI").val().toUpperCase(),
    //};

    var HandlingInfoArray = [];
    $("div[id$='areaTrans_shipment_fwbshipmenthandlinginfo']").find("[id^='areaTrans_shipment_fwbshipmenthandlinginfo']").each(function () {

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
        url: "Services/Shipment/FWBService.svc/UpdateOSIInfoAndHandlingMessage", async: false, type: "POST", dataType: "json", cache: false,
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
        url: "Services/Shipment/FWBService.svc/UpdateShipperAndConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, NotifyModel: NotifyModel, NominyModel: NominyModel, UpdatedBy: 2, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", isAmmendment: isAmmendment, isChargableAmendment: isChargableAmendment, CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants }),
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

function SaveWeighingMachineInfo() {
    var flag = false;
    var GrWtFlag = true;
    var ScanType = ($("[id='Type']:checked").val() == 0);
    var WeighingMachineArray = [];
    var WeighingULDArray = [];

    $("div[id$='areaTrans_shipment_shipmentweightdetail']").find("[id^='areaTrans_shipment_shipmentweightdetail_']").each(function () {
        if ($(this).find("input[id^='GrossWt_']").val() == "") {
            if (GrWtFlag != false) {
                $(this).find("input[id^='GrossWt_']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Enter Gross Weight.", "bottom-right");
                GrWtFlag = false;
            }
        }
    });
    $("div[id$='areaTrans_shipment_shipmentweightulddetail']").find("[id^='areaTrans_shipment_shipmentweightulddetail']").each(function () {
        if ($(this).attr('style') != "display: none;") {
            if (parseFloat($(this).find("input[id^='CapturedWt']").val() == "" ? "0" : $(this).find("input[id^='CapturedWt']").val()) <= 0) {
                if (GrWtFlag != false) {
                    $(this).find("input[id^='CapturedWt']").focus();
                    ShowMessage('warning', 'Warning - Weighing Machine', "Enter Captured Weight should be greater than 0.", "bottom-right");
                    GrWtFlag = false;
                }
            }
        }
    });

    if (GrWtFlag == false) { return }

    $("div[id$='areaTrans_shipment_shipmentweightdetail']").find("[id^='areaTrans_shipment_shipmentweightdetail_']").each(function () {
        var WeighingMachineViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            NoOfPieces: $(this).find("input[id^='ScanPieces_']").val().split(',').length,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            GrossWt: $(this).find("input[id^='GrossWt_']").val(),
            Remarks: $(this).find("[id^='Remarks_']").val(),
            SLISNo: $(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("span[id^='SLINo_']").text(),
            HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
        };
        WeighingMachineArray.push(WeighingMachineViewModel);
    });

    $("div[id$='areaTrans_shipment_shipmentweightulddetail']").find("[id^='areaTrans_shipment_shipmentweightulddetail']").each(function () {
        if ($(this).attr('style') != "display: none;") {
            var ULDWeighingModel = {
                ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
                CapturedWeight: $(this).find("input[id^='CapturedWt']").val(),
                UldGrossWt: $(this).find("input[id^='GrossWt']").val(),
                UldTareWt: $(this).find("input[id^='TareWt']").val(),
            };
            WeighingULDArray.push(ULDWeighingModel);
        }
    });

    if (WeighingMachineArray.length > 0)
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveAtWeighing", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBGroup: WeighingMachineArray, lstUldWeigh: WeighingULDArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Weighing Machine', "Gross weight Deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;

                    }
                }
                else
                    ShowMessage('warning', 'Warning - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    else {
        ShowMessage('warning', 'Warning - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  Enter weighing detail.", "bottom-right");
    }
    return flag;
}

function SaveXRayInfo() {
    var flag = false;
    var ScanType = ($("[id='Type']:checked").val() == 0);
    var XRayArray = [];
    var ULDXray = [];
    var ECSDArray = [];
    $("div[id$='areaTrans_shipment_shipmentxraydetail']").find("[id^='areaTrans_shipment_shipmentxraydetail_']").each(function () {
        var XRayViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            SLISNo: $(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("input[type=hidden][id^='SLINo_']").val(),
            HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
        };
        XRayArray.push(XRayViewModel);
    });
    if (ScanType != "0" && ScanType != "1") {
        var sXRayViewModel = {
            SNo: 0,
            ScannedPieces: ""
        };
        XRayArray.push(sXRayViewModel);
    }

    $("div[id$='areaTrans_shipment_shipmentxrayulddetail']").find("[id^='areaTrans_shipment_shipmentxrayulddetail']").each(function () {
        var XRayULDViewModel = {
            ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
            ULDXrayDone: $(this).find("[type=checkbox][id^='chXray']").prop("checked") == true ? 1 : 0
        };
        ULDXray.push(XRayULDViewModel);
    });
    var ECSDArrayViewModel = {
        SecurityCode: $("#Text_SecurityStatus").data("kendoAutoComplete").key(),
        SecurityIssuance: $("#Text_SecurityIssuanc").data("kendoAutoComplete").key(),
        ScreeningMethod: $("#Text_ScreeningMethod").data("kendoAutoComplete").key(),
        ScreeningExemption: $("#Text_ScreeningExemption").data("kendoAutoComplete").key(),
        OthScreeningMthode: $("#OthScreeningMthd").val(),
        AdditionalSecurity: $("#AdditionalSecurity").val(),
        Name: $("#Name").val(),
        Date: cfi.CfiDate("Date"),
        Time: $("#Time").val(),
    };
    ECSDArray.push(ECSDArrayViewModel);


    if (XRayArray.length > 0 || ULDXray.length > 0 || ECSDArray.length > 0)
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveAtXRay", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBXRay: XRayArray, lstULDXrayArray: ULDXray, lstECSDArray: ECSDArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    else {
        ShowMessage('warning', 'Warning - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] -  Validate X-Ray detail.", "bottom-right");
    }
    return flag;
}
function SaveLocationInfo() {
    var flag = false;
    var ScanType = $("[id='Type']:checked").val();
    var LocationArray = [];
    $("div[id$='areaTrans_shipment_shipmentlocationdetail']").find("[id^='areaTrans_shipment_shipmentlocationdetail_']").each(function () {
        var LocationViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            AWBSNo: currentawbsno,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            LocationSNo: $(this).find("[id^='Text_Location']").data("kendoAutoComplete").key(),
            SLISNo: $(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("input[type=hidden][id^='SLINo_']").val(),
            HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
        };
        LocationArray.push(LocationViewModel);

    });

    var ULDLocationArray = [];
    var i = 1;
    $("div[id$='areaTrans_shipment_shipmentuldlocation']").find("[id^='areaTrans_shipment_shipmentuldlocation']").each(function () {
        //if (parseInt($(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key()) > 0) {
        var ULDLocationModel = {
            RowNo: i,
            //SNo: $(this).find('input[type="hidden"][id^="sno"]').val(),
            //LocationSno: $(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key(),
            //SLINo: $(this).find("input[type=hidden][id^='SLINo_']").val(),
            //HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
            ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
            LocationSno: $(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key(),

        };
        ULDLocationArray.push(ULDLocationModel);
        i += 1;
        //}

    });

    if (LocationArray.length > 0 || ULDLocationArray.length > 0) {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveAtLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBLocation: LocationArray, lsULDLocation: ULDLocationArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - Location', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Location', "AWB No. [" + $("#tdAWBNo").text() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Location', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Location', "AWB No. [" + $("#tdAWBNo").text() + "] -  Enter location detail.", "bottom-right");
    }
    return flag;
}

function SaveReservationInfo() {
    var flag = false;
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var awbNo = $("#AWBNo").val();
    var IsCourier = ($("[id='ShipmentType']:checked").val() == 1),
    ShowSlacDetails = false,//$("[id='ShowSlacDetails']:checked").val(),
    AWBNo = $("#AWBNo").val(),
    AgentBranchSNo = $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
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
        $("div[id$='divareaTrans_shipment_fwbshipmentnog']").find("[id^='areaTrans_shipment_fwbshipmentnog']").each(function () {
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
    if (Flag == false) {
        ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', messg, "bottom-right");
        return false;
    }

    var ShipmentInfo = {
        IsCourier: $("[id='ShipmentType']:checked").val(),//($("[id='ShipmentType']:checked").val() == 0 ? 1 : 2),
        ShowSlacDetails: false,
        AWBNo: $("#AWBNo").val(),
        AgentBranchSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
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

    $("div[id$='divareaTrans_shipment_fwbshipmentclasssphc']").find("[id^='areaTrans_shipment_fwbshipmentclasssphc']").each(function () {
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
    $("div[id$='areaTrans_shipment_fwbshipmentitinerary']").find("[id^='areaTrans_shipment_fwbshipmentitinerary']").each(function () {
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
    $("div[id$='areaTrans_shipment_fwbshipmentnog']").find("[id^='areaTrans_shipment_fwbshipmentnog']").each(function () {
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
    if (DalyFlghtSno > 0) {
        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/ValidateCutoffTime?DlyFlghtSno=" + DalyFlghtSno + "&Origin=" + Origin + "&Dest=" + Dest + "&GrossWeight=" + $("#GrossWt").val() + "&VolumeWeight=" + $("#VolumeWt").val() + "&AWBSNo=" + awbSNo + "&SPHC=" + $("#Multi_SpecialHandlingCode").val(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var retdata = jQuery.parseJSON(result);
                var ValidateMsgData = retdata.Table0;
                BkdWeight = retdata.Table1[0].weightmsg;
                IsManifested = retdata.Table2[0].IsManifested;
                IsLateAccepTance = retdata.Table3[0].IsLateAccepTance;
                ManifestMessage = retdata.Table4[0].ManifestMessage;

                if (ValidateMsgData[0].ValidationMsg != "") {
                    Messg = ValidateMsgData[0].ValidationMsg;
                    ValidFlag = false;
                }
            }
        });

    }
    if (IsManifested == "1") {
        jAlert(ManifestMessage);
        var FirstRow = $("div[id='divareaTrans_shipment_shipmentitinerary']").find("tr[id^='areaTrans_shipment_shipmentitinerary']:first");
        FirstRow.find("input[id^='FlightDate']").data("kendoDatePicker").value("");
        FirstRow.find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        FirstRow.find("input[id^='Text_FlightNo']").removeAttr("data-valid");
        return false;
    }
    if (ValidFlag == false) {
        ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', Messg, "bottom-right");
        return false;
    }

    //if (BkdWeight != "") {
    //    var r = confirm(BkdWeight + "!");
    //    if (r == false) {
    //        return false;
    //    }
    //}

    //$.ajax({
    //    url: "Services/Shipment/FWBService.svc/SaveAcceptance", async: false, type: "POST", dataType: "json", cache: false,
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
                    var FirstRow = $("div[id='divareaTrans_shipment_fwbshipmentitinerary']").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first");
                    FirstRow.find("input[id^='FlightDate']").data("kendoDatePicker").value("");
                    FirstRow.find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    FirstRow.find("input[id^='Text_FlightNo']").removeAttr("data-valid");
                    return false;
                }
                $.ajax({
                    url: "Services/Shipment/FWBService.svc/SaveAcceptance", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ AWBNo: $("#AWBNo").val(), AWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCArray, listItineraryInformation: FlightArray, AWBDGRTrans: DGRArray, UpdatedBy: 2, isAmmendment: isAmmendment, IsLateAccepTance: IsLateAccepTance, NOGArray: NOGArray, SHCSubGroupArray: SHCSubGroupArray, isChargableAmendment: isChargableAmendment }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result == "") {
                            ShowMessage('success', 'Success - FWB Saved Successfully', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                            $("#btnSave").unbind("click");
                            flag = true;
                            if (isSaveAndNext == "1") {
                                FlightDateForGetRate = $("#divareaTrans_shipment_fwbshipmentitinerary").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                FlightNoForGetRate = $("#divareaTrans_shipment_fwbshipmentitinerary").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight No value after save and next
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
            url: "Services/Shipment/FWBService.svc/SaveAcceptance", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBNo: $("#AWBNo").val(), AWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCArray, listItineraryInformation: FlightArray, AWBDGRTrans: DGRArray, UpdatedBy: 2, isAmmendment: isAmmendment, IsLateAccepTance: IsLateAccepTance, NOGArray: NOGArray, SHCSubGroupArray: SHCSubGroupArray, isChargableAmendment: isChargableAmendment }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - FWB Saved Successfully', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                    if (isSaveAndNext == "1") {
                        FlightDateForGetRate = $("#divareaTrans_shipment_fwbshipmentitinerary").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                        FlightNoForGetRate = $("#divareaTrans_shipment_fwbshipmentitinerary").find("tr[id^='areaTrans_shipment_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight No value after save and next
                        //$("#divDetailSHC").html("");
                        //ReloadSameGridPage("RATE");
                        //$("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                        //ShowProcessDetailsNew("RATE", "divDetailSHC", false, "2104");
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

function SaveDimensionInfo() {
    var flag = false;

    var DimArray = [];
    $("div[id$='areaTrans_shipment_shipmentdimension']").find("[id^='areaTrans_shipment_shipmentdimension']").each(function () {
        var DimViewModel = {
            AWBSNo: currentawbsno,
            Height: $(this).find("[id^='Height']").val(),
            Length: $(this).find("[id^='Length']").val(),
            Width: $(this).find("input[id^='Width']").val(),
            Pieces: $(this).find("input[id^='Pieces']").val(),
            CBM: $(this).find("input[id^='VolumeWt']").val(),
            Unit: $("#Unit:checked").val() == "1" ? 1 : 0,
            // IsDeleted: false,
            VolumeWeight: 0,
            SLISNo: $(this).find("span[id^='SLISNo']").text(),
            HAWBNo: $(this).find("span[id^='HAWBNo']").text(),
        };
        DimArray.push(DimViewModel);
    });


    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateAWBDimemsions", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, Dimensions: DimArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;
                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}
function SaveDimensionULDInfo() {
    var flag = false;
    var ULDArray = [];
    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    var tempULDSNo = 0;
    var tempULDNo = '';

    var LenWidHei = true;
    $("div[id$='areaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function () {
        var L, W, H;
        L = $(this).find("input[id^='ULDLength']").val() == "" ? "0" : $(this).find("input[id^='ULDLength']").val();
        W = $(this).find("input[id^='ULDWidth']").val() == "" ? "0" : $(this).find("input[id^='ULDWidth']").val();
        H = $(this).find("input[id^='ULDHeight']").val() == "" ? "0" : $(this).find("input[id^='ULDHeight']").val();

        if (parseFloat(L) <= 0) {
            if (LenWidHei != false) {
                $(this).find("input[id^='ULDLength']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Length should be greater than 0.", "bottom-right");
                LenWidHei = false;
            }
        }
        if (parseFloat(W) <= 0) {
            if (LenWidHei != false) {
                $(this).find("input[id^='ULDWidth']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Width should be greater than 0.", "bottom-right");
                LenWidHei = false;
            }
        }
        if (parseFloat(H) <= 0) {
            if (LenWidHei != false) {
                $(this).find("input[id^='ULDHeight']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Height should be greater than 0.", "bottom-right");
                LenWidHei = false;
            }
        }
    });
    if (LenWidHei == false) { return }

    $("div[id$='areaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function () {
        //if ($(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").key() != "") {
        tempULDSNo = $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete") == undefined ? tempULDSNo : $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").key();
        tempULDNo = $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete") == undefined ? tempULDNo : $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").value();
        var ULDViewModel = {
            AWBSNo: currentawbsno,
            SLISNo: $(this).find("span[id^='SLISNo']").text(),
            HAWBNo: $(this).find("span[id^='HAWBNo']").text(),
            ULDSNo: tempULDSNo,
            ULDNo: tempULDNo,
            SLACPieces: $(this).find("input[id^='SLACPieces']").val(),
            UldPieces: $(this).find("input[id^='UldPieces']").val(),
            IsCMS: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
            ULDLength: $(this).find("input[id^='ULDLength']").val(),
            ULDWidth: $(this).find("input[id^='ULDWidth']").val(),
            ULDHeight: $(this).find("input[id^='ULDHeight']").val(),
            ULDVolWt: $(this).find("span[id^='UldVolWt']").text().split("(")[0],
            ULDCBM: $(this).find("span[id^='UldVolWt']").text().split("(")[1].replace(")", ""),
            CityCode: origin,
            MCBookingSNo: 0,
            DNNo: 0,
            MailDestination: 0,
            OriginRefNo: 0,
        };
        ULDArray.push(ULDViewModel);
    });


    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateAWBDimemsionsULDInfo", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBULDTrans: ULDArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;

                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}
function SaveDimensionULDDetails() {
    var flag = false;
    var ULDDetailArray = [];
    $("div[id$='areaTrans_shipment_shipmentulddetails']").find("[id^='areaTrans_shipment_shipmentulddetails']").each(function () {
        //if ($(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").key() != "") {
        var ULDViewModel = {
            AWBSNo: currentawbsno,
            SLISNo: $(this).find("span[id^='SLINo2']").text(),
            ULDSNo: $(this).find("[id^='Text_ULDNo2']").data("kendoAutoComplete").key(),
            LoadingCodeSNo: $(this).find("[id^='Text_UldLoadingCode']").data("kendoAutoComplete").key(),
            LoadingIndicatorSNo: $(this).find("[id^='Text_UldLoadingIndicators']").data("kendoAutoComplete").key(),
            ContourCodeSNo: $(this).find("[id^='Text_UldContourCode']").data("kendoAutoComplete").key(),
            BupTypeSNo: $(this).find("[id^='Text_UldBupType']").data("kendoAutoComplete").key(),
            BasePalletSNo: $(this).find("[id^='Text_UldBasePallet']").data("kendoAutoComplete").key(),
            OtherPallets: $(this).find("input[id^='ULDOtherPallets']").val(),
        };
        ULDDetailArray.push(ULDViewModel);
    });




    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateAWBDimemsionsULDDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBULDDetails: ULDDetailArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;

                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
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
        url: "Services/Shipment/FWBService.svc/UpdateRateDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
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
        url: "Services/Shipment/FWBService.svc/UpdateAWBSummary", async: false, type: "POST", dataType: "json", cache: false,
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

function InitializePaymentData() {
    //Use this function after Crayon System Integartion According to Manish Sir 
    BindPaymentDetails();
}

function SavePaymentInfo() {
    var flag = false;
    var HandlingChargeArray = [];
    //var totalChargeAmt = 0;

    var TotalCash = 0;
    var TotalCredit = 0;
    TotalCash = $("#FBLAmount").val();
    TotalCredit = $("#CrediAmount").val();
    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingCharge = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(), //3
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),//'TERMINAL CHARGES',
                Value: parseFloat($(this).find("[id^='TotalAmount']").text()).toFixed(3),//80.00
                Remarks: $(this).find("[id^='Remarks']").val(), // '<Br><Br> Rate : 375.00 [Weight] * 0.2000 [Slab Value] = 75.000000~<asp:HiddenField ID="hdnFromDate" value="187" runat="server" />',
                Rate: $(this).find("[id^='rate']").val(),
                Min: $(this).find("[id^='min']").val(),
                TotalTaxAmount: $(this).find("[id^='totaltaxamount']").val(),
                Mode: $(this).find("[id^='chkCash']").prop('checked') == true ? "CASH" : "CREDIT",
                Basis: 'PER KG',
                OnWt: 'ChWt',
                ChargeTo: $(this).find("[id^='Text_BillTo']").data("kendoAutoComplete").key()
            }
            //totalChargeAmt = totalChargeAmt + parseFloat($(this).find("[id^='TotalAmount']").text());
            HandlingChargeArray.push(HandlingCharge);
        }

    })

    //multiple
    //var AgentBranchArray = [];
    ////$("div[id$='areaTrans_shipment_shipmentaddcheque']").find("[id^='areaTrans_shipment_shipmentaddcheque']").each(function () {
    //var AgentBranchCheque = {
    //    SNo: 0,// $(this).find("td[id^='tdSNoCol']").html(),
    //    AgentBranchSNo: 0,// $("input[name='AgentName']").val(),
    //    BankSNo: 0,// $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key(),
    //    BankName: "",// $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").value(),
    //    BankBranch: "",// $(this).find("[id^='Branch']").val(),
    //    ChequeNo: 0,// $(this).find("[id^='ChequeNo']").val(),
    //    ChequeDate: '2015/06/23',
    //    ChequeLimit: 0,// $(this).find("[id^='ChequeLimit']").val(),
    //    Availablelimit: 0,// $(this).find("[id^='ChequeLimit']").val(),
    //    ChequeFreuency: 1

    //}
    //AgentBranchArray.push(AgentBranchCheque);
    //})


    //single Row
    var AWBChequeArray = [];
    //var AWBCheque = {
    //    SNo: 1,
    //    AWBSNo: currentawbsno,
    //    AgentBranchSNo: $("input[name='AgentName']").val(),
    //    Amount: parseFloat($('#CashAmount').val()).toFixed(2),
    //    PaymentMode: $('#PaymentMode:checked').val() == "0" ? "Cash" : "Credit",
    //    InvoiceSNo: 0,
    //    InvoiceNo: ''
    //}
    //AWBChequeArray.push(AWBCheque);

    $("div[id$='divareaTrans_shipment_shipmentaddcheque']").find("[id^='areaTrans_shipment_shipmentaddcheque']").each(function () {
        if ($(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key() != "") {
            var AWBCheque = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                BankSNo: $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key(),
                Branch: $(this).find("[id^='Branch']").val(),
                ChequeNo: $(this).find("[id^='ChequeNo']").val(),
                ChequeLimit: $(this).find("[id^='ChequeLimit']").val()
            }
            AWBChequeArray.push(AWBCheque);
        }
    })


    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveAtPayment", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, TotalCash: TotalCash, TotalCredit: TotalCredit, lstHandlingCharge: HandlingChargeArray, lstAWBCheque: AWBChequeArray, CityCode: 'DEL', UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "") {
                ShowMessage('success', 'Success - Payment', "Payment Processed Successfully", "bottom-right");
                ShipmentSearch();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Payment', "Unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Payment', "Unable to process.", "bottom-right");

        }
    });
    return flag;
}

var fblurl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
function GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? fblurl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    chWt: chWt,
                    cityChangeFlag: cityChangeFlag
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}
var paymentData;
var MendatoryPaymentCharges = new Array();
function BindPaymentDetails() {

    $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_shipment_shipmenthandlingchargeinfo']:first").show();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtPayment?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var payementData = jQuery.parseJSON(result);
            var handlingChargeArray = payementData.Table0;
            //var awbChequeArray = payementData.Table1;
            var awbChequeArray = [];
            $("span[id='AgentName']").text(payementData.Table1[0].AgentName.toUpperCase());
            $("input[name='AgentName']").val(payementData.Table1[0].AgentBranchSNo);


            //if (awbChequeArray.length > 0) {
            //    $('#CashAmount').val(awbChequeArray[0].Amount)
            //    if (awbChequeArray[0].PaymentMode == "Cash")
            //        $('#PaymentMode:checked').val("0");
            //    else
            //        $('#PaymentMode:checked').val("1");
            //    printInvoiceSno = payementData.Table1[0].InvoiceSno;
            //    printorigin = payementData.Table1[0].CityCode;

            //    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
            //}

            var tableHandleCharge = "";
            var BillAmt = 0.000;
            var CreditAmt = 0.000;
            if (handlingChargeArray.length > 0) {
                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr:first").find("td:last").hide();
                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_shipment_shipmenthandlingchargeinfo']:first").hide();
                for (var i = 0; i < handlingChargeArray.length; i++) {
                    tableHandleCharge += "<tr><td>" + (i + 1) + "</td><td>" + handlingChargeArray[i].Description + "</td><td>" + handlingChargeArray[i].ChargeValue + "</td><td>" + handlingChargeArray[i].Amount + "</td><td>" + handlingChargeArray[i].PaymentMode + "</td><td>" + handlingChargeArray[i].Remarks + "</td><td>" + handlingChargeArray[i].ChargeTo + "</td></tr>"
                    if (handlingChargeArray[i].PaymentMode == "CASH") {
                        BillAmt = BillAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                    } else {
                        CreditAmt = CreditAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                    }
                }
                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr").each(function () {
                    $(this).find("td:contains('Payment')").css("display", "none");
                    $(this).find("td:contains('Action')").css("display", "none");
                    $(this).find("td:contains('Credit')").text("Mode");
                });
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='FBLAmount']").text(parseFloat(BillAmt).toFixed(3));
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='FBLAmount']").val(parseFloat(BillAmt).toFixed(3));

                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='CrediAmount']").text(parseFloat(CreditAmt).toFixed(3));
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='CrediAmount']").val(parseFloat(CreditAmt).toFixed(3));
                $("#CashAmount").val(parseFloat(BillAmt).toFixed(3));
                $("#_tempCashAmount").val(parseFloat(BillAmt).toFixed(3));

            }
            if (handlingChargeArray.length == 0 && awbChequeArray.length == 0) {

                cfi.makeTrans("shipment_shipmenthandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, null);

                cfi.makeTrans("shipment_shipmentaddcheque", null, null, BindBankAutoComplete, ReBindBankAutoComplete, null, null);
                $("div[id$='areaTrans_shipment_shipmentaddcheque']").find("[id='areaTrans_shipment_shipmentaddcheque']").each(function () {
                    $(this).find("input[id^='BankName']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
                    });
                });

                $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table2[0].CurrencyCode + ')');
                var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
                $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
                    $(this).find("input[id^='ChargeName']").each(function () {
                        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, null, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
                    });
                    $(this).find("input[id^='BillTo']").each(function () {
                        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
                    });
                    $(this).find("input[id^='Amount']").each(function () {
                        $(this).unbind("blur").bind("blur", function () {
                            CalculateFBLAmount(this);
                        });
                    });

                });
                $("#CashAmount").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });

                var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
                $.ajax({
                    url: "Services/Shipment/FWBService.svc/FBLHandlingCharges?AWBSNo=" + currentawbsno + "&CityCode=" + origin, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        paymentData = jQuery.parseJSON(result);
                        paymentList = paymentData.Table0;
                        //Added By Manoj Kumar on 16/9/2015

                        MendatoryPaymentCharges = [];
                        $(paymentList).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                //MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "amount": i.ChargeAmount, "totalamount": parseFloat(parseFloat(i.ChargeAmount) + parseFloat(i.GSTAmount)).toFixed(2), "remarks": i.ChargeRemarks, "list": 1 });
                                MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "amount": i.ChargeAmount, "totalamount": parseFloat(i.ChargeAmount), "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, "min": i.Min, "totaltaxamount": i.TotalTaxAmount, "list": 1, "billto": i.ChargeTo, "text_billto": i.Text_ChargeTo });
                            }
                        })
                        cfi.makeTrans("shipment_shipmenthandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, MendatoryPaymentCharges);
                        ///
                        //        $("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
                        //        $("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);
                        //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
                        //Added By Manoj Kumar on 16/9/2015

                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("[id='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function (row, tr) {
                            $(tr).find('td:eq(7)').css("display", "none");
                            $(tr).find('td:eq(8)').css("display", "none");
                            $(tr).find('td:eq(9)').css("display", "none");
                            $(tr).find("input[id^='chkCash']").prop('checked', true)
                            //$(tr).find("td:last").remove();
                        });

                        $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo'] table tr").each(function (row, tr) {
                            if ($(tr).find("td[id^=tdSNoCol]").text() != "" && $(tr).find("td[id^=tdSNoCol]").text() != undefined) {
                                if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) < MendatoryPaymentCharges.length) {
                                    $(tr).find("td[id^=transAction]").remove();
                                }
                                else if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) == MendatoryPaymentCharges.length) {
                                    $(tr).find("td[id^=transAction]").find("i[title=Delete]").remove();
                                }
                            }

                            $(tr).find("input[id^=Text_ChargeName]").each(function () {
                                var NMendatory = getNonObjects(MendatoryPaymentCharges, 'chargename', $(this).data("kendoAutoComplete").key());
                                if (NMendatory[0].billto != "2") {
                                    $(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                                }
                            });
                            //$(tr).find("input[id^=Text_ChargeName]").data("kendoAutoComplete").key();
                        });

                        CalculateTotalFBLAmount();
                        //
                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(7)").css("display", "none");
                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(8)").css("display", "none");
                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(9)").css("display", "none");

                    },
                    error: function (xhr) {

                    }
                });

                //$("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
                //$("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);
                //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
                //Added By Manoj Kumar on 16/9/2015
                CalculateTotalFBLAmount();

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
                    if (cfi.IsValidSection(sectionId)) {
                        if (true) {
                            SavePaymentInfo();
                        }
                    }
                    else {
                        return false
                    }
                });

                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    var saveflag = false;
                    if (cfi.IsValidSection(sectionId)) {
                        if (true) {
                            saveflag = SavePaymentInfo();
                        }
                    }
                    else {
                        saveflag = false
                    }
                    if (saveflag) {
                        for (var i = 0; i < processList.length; i++) {
                            if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                                if (currentawbsno > 0) {
                                    currentprocess = processList[i + 1].value;
                                    ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                                }
                                else {
                                    CleanUI();
                                    cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                                }
                                return;
                            }
                        }
                    }
                });

                //$("#btnSave").unbind("click").bind("click", function () {
                //    SavePaymentInfo();
                //});
            }
            else {
                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").append(tableHandleCharge);

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('warning', 'Warning - Payment', "Payment already Processed", "bottom-right");
                });
            }
            $("div[id$='areaTrans_shipment_shipmentaddcheque']").hide();
        }
    });
}

function BindCheckList() {
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $("#XRay").prop("checked", false);
    $("#Remarks").val('');
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetCheckList?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var CheckListData = jQuery.parseJSON(result);
            var CheckListInfo = CheckListData.Table0;


            if (CheckListInfo.length > 0) {
                var resItem = CheckListInfo[0];
                if (resItem.XrayRequired = true)
                    $("#XRay").prop("checked", true);
                else
                    $("#XRay").prop("checked", true);
                $("#Remarks").val(resItem.Remarks);
            }
        }
    });
}

function SaveCheckList() {
    var flag = false;
    var XRayRequired = ($("[id='XRay']:checked").val() == 'on');
    var Remarks = $("#Remarks").val();



    var DocumentInfoArray = [];

    $("div[id='divDetail']").find("[id^='rbtnY']").each(function () {
        var rbtnY = $(this).closest('tr').find("[id^='rbtnY']:checked").val();
        var rbtnN = $(this).closest('tr').find("[id^='rbtnN']:checked").val();
        var rbtnNA = $(this).closest('tr').find("[id^='rbtnNA']:checked").val();

        var DocumentViewModel = {
            CheckListDetailSNo: $(this).closest('tr').find("td:first").html(),
            Status: (rbtnY == "Y" ? rbtnY : (rbtnN == "N" ? rbtnN : (rbtnNA == "NA" ? rbtnNA : ""))),
            AWBSNo: currentawbsno,
            EnteredBy: "1",
            Remarks: ""
        };
        DocumentInfoArray.push(DocumentViewModel);
    }
    );


    $("div[id='divDetailSHC']").find("[id^='rbtnY']").each(function () {
        var rbtnY = $(this).closest('tr').find("[id^='rbtnY']:checked").val();
        var rbtnN = $(this).closest('tr').find("[id^='rbtnN']:checked").val();
        var rbtnNA = $(this).closest('tr').find("[id^='rbtnNA']:checked").val();

        var DocumentViewModel = {
            CheckListDetailSNo: $(this).closest('tr').find("td:first").html(),
            Status: (rbtnY == "Y" ? rbtnY : (rbtnN == "N" ? rbtnN : (rbtnNA == "NA" ? rbtnNA : ""))),
            AWBSNo: currentawbsno,
            EnteredBy: "1",
            Remarks: ""
        };
        DocumentInfoArray.push(DocumentViewModel);
    }
    );

    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveCheckList", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, CheckListTrans: DocumentInfoArray, XRay: XRayRequired, Remarks: Remarks, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveEDoxList() {
    var EDoxArray = [];
    var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
    var Remarks = $("#Remarks").val();
    var flag = false; rese
    $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
        var eDoxViewModel = {
            EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
            DocName: $(this).find("span[id^='DocName']").text(),
            AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
            ReferenceNo: $(this).find("input[id^='Reference']").val(),
            Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
        };
        EDoxArray.push(eDoxViewModel);

    });
    if (EDoxArray.length == 0) {
        ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
    }
    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveAWBEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBEDoxDetail: EDoxArray, AllEDoxReceived: AllEDoxReceived, Remarks: Remarks, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveFormData(subprocess) {
    var issave = false;

    if (subprocess.toUpperCase() == "CUSTOMER") {
        issave = SaveCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        issave = SaveDimensionInfo();
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONINFO") {
        issave = SaveDimensionULDInfo();
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONDETAILS") {
        issave = SaveDimensionULDDetails();
    }
    else if (subprocess.toUpperCase() == "RATE") {
        issave = SaveDimensionInfoNew();
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        issave = SaveAWBSummary();
    }
    else if (subprocess.toUpperCase() == "WEIGHINGMACHINE") {
        issave = SaveWeighingMachineInfo();
    }
    else if (subprocess.toUpperCase() == "XRAY") {
        issave = SaveXRayInfo();
    }
    else if (subprocess.toUpperCase() == "LOCATION") {
        issave = SaveLocationInfo();
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        issave = SaveHandlingInfo();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        issave = SaveReservationInfo();
    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        issave = SaveCheckList();
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        issave = SaveEDoxList();
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
            $("#txtTactRate").removeAttr("readonly");
            cfi.Numeric("txtTactRate", 2);
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
            data: JSON.stringify({ AWBSNO: currentawbsno }),
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
    } else {
        $("#txtUserRate").val('')
        $("#chkTactRate").prop("checked", false);
        $("#chkPubRate").prop("checked", false);
        $("#chkUserRate").prop("checked", false);
        $("#chkAsAgreed").prop("checked", true);
    }    
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

var NogDiv = '<div id="divareaTrans_shipment_fwbshipmentnog" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Nature of Good"><span id="spnNOG"> Nature of Goods</span></td><td class="formHeaderLabel" title="Other Nature of Good"><span id="spnOtherNOG">Other</span></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'

    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_4"><td id="tdSNoCol_4" class="formSNo snowidth" style="" name="_4">6</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_4"  onblur="CalculatePieces(this);" id="Pieces_4" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_4" id="NogGrossWt_4" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_4" id="OtherNatureofGoods_4" value=""><input type="text" class="" name="Text_OtherNatureofGoods_4" id="Text_OtherNatureofGoods_4" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_4" id="NOG_4" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_5"><td id="tdSNoCol_5" class="formSNo snowidth" style="" name="_5">7</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_5"  onblur="CalculatePieces(this);" id="Pieces_5" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_5" id="NogGrossWt_5" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_5" id="OtherNatureofGoods_5" value=""><input type="text" class="" name="Text_OtherNatureofGoods_5" id="Text_OtherNatureofGoods_5" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_5" id="NOG_5" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_6"><td id="tdSNoCol_6" class="formSNo snowidth" style="" name="_6">8</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_6"  onblur="CalculatePieces(this);" id="Pieces_6" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_6" id="NogGrossWt_6" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_6" id="OtherNatureofGoods_6" value=""><input type="text" class="" name="Text_OtherNatureofGoods_6" id="Text_OtherNatureofGoods_6" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_6" id="NOG_6" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_7"><td id="tdSNoCol_7" class="formSNo snowidth" style="" name="_7">9</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_7"  onblur="CalculatePieces(this);" id="Pieces_7" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_7" id="NogGrossWt_7" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_7" id="OtherNatureofGoods_7" value=""><input type="text" class="" name="Text_OtherNatureofGoods_7" id="Text_OtherNatureofGoods_7" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_7" id="NOG_7" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_8"><td id="tdSNoCol_8" class="formSNo snowidth" style="" name="_8">10</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_8"  onblur="CalculatePieces(this);" id="Pieces_8" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_8" id="NogGrossWt_8" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_8" id="OtherNatureofGoods_8" value=""><input type="text" class="" name="Text_OtherNatureofGoods_8" id="Text_OtherNatureofGoods_8" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_8" id="NOG_8" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_9"><td id="tdSNoCol_9" class="formSNo snowidth" style="" name="_9">11</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_9"  onblur="CalculatePieces(this);" id="Pieces_9" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_9" id="NogGrossWt_9" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_9" id="OtherNatureofGoods_9" value=""><input type="text" class="" name="Text_OtherNatureofGoods_9" id="Text_OtherNatureofGoods_9" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_9" id="NOG_9" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '</tbody></table>'
    + '</div>'
//+ '<table class="WebFormTable"><tbody>'
//+ '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Nature of Good"><span id="spnNOG"> Nature of Goods</span></td></tr>'
//+ '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="20" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
//+ '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="20" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
//+ '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="20" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
//+ '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="20" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
//+ '<tr data-popup="true" id="areaTrans_shipment_fwbshipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="20" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr></tbody></table>'
//+ '</div>'

var RatePrint = '<div id="RatePrint">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel">Show on AWB Print</td><td class="formHeaderLabel"></td><td class="formHeaderLabel"></td><td class="formHeaderLabel"></td></tr>'
    + '<tr><td class="formHeaderLabel" id="tactrate" name="tactrate"><input id="chkTactRate" name="chkTactRate" type="checkbox" value="1" onclick="SelectClicked(this);">TACT Rate</td><td class="formHeaderLabel" id="publishedrate" name="publishedrate"><input id="chkPubRate" name="chkchkPubRate" type="checkbox" value="2"  onclick="SelectClicked(this);">Published Rate</td><td class="formHeaderLabel" id="userrate" name="userrate"><input id="chkUserRate" name="chkUserRate" type="checkbox" value="3"  onclick="SelectClicked(this);">Manually Entered Rate</td><td class="formHeaderLabel" id="Asagreedrate" name="Asagreedrate"><input id="chkAsAgreed" name="chkAsAgreed" type="checkbox" value="4" onclick="SelectClicked(this);">As Agreed</td></tr>'
    + '<tr><td><input type="text" class="k-input k-state-default transSection" name="txtTactRate" id="txtTactRate" maxlength="10" onblur="SelectRateOption(this);" value="" placeholder=""></td><td><input type="text" class="k-input k-state-default transSection" name="txtPublishRate" id="txtPublishRate" value="" placeholder="" readonly="true"></td><td><input type="text" class="k-input k-state-default transSection" name="txtUserRate" id="txtUserRate" value="" placeholder="" readonly="true"></td><td></td></tr>'
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
            window.open("awbprintA4.html?sno=" + currentawbsno + "&pagename=Acceptance");
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