/// <reference path="../../Scripts/Kendo/kendo.autocomplete.js" />
/// <reference path="../../Scripts/jquery-1.7.2.js" />
/// <reference path="../../Styles/Grid/kendo.common.min.css" />
/// <reference path="../../Styles/Grid/kendo.default.min.css" />
/// <reference path="../../Scripts/jquery.tmpl.js" />
/// <reference path="../../Scripts/maketrans.js" />
/// <reference path="../../Scripts/jquery-1.4.1.min.js" />
/// <reference path="../../Scripts/Kendo/kendo.tabstrip.js" />
/// <reference path="../../Scripts/Kendo/kendo.web.js" />
/// <reference path="../../Scripts/common.js" />

$(document).ready(function () {
    MasterAcceptance();
});

var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;


function MasterAcceptance() {
    _CURR_PRO_ = "HOUSE";
    _CURR_OP_ = "House Acceptance";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    CleanUI();
    //ngen.loadjscssfile("JScript/Shipment/BookingIndex.js?" + Math.random(), "js");

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetWebForm/" + _CURR_PRO_ + "/House/HAWBSEARCH/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();

            cfi.AutoComplete("searchOriginCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchDestinationCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "HAWBNo", "vHAWBGetList", "HAWBNo", "HAWBNo", ["HAWBNo"], null, "contains");
            cfi.AutoComplete("searchAWBPrefix", "AWBPrefix", "Awb", "AWBPrefix", "AWBPrefix", ["AWBPrefix"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNumber", "Awb", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");


            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            //$("#divSearch").html(result);
            //var dataSource = GetDataSource("searchOriginCity", "City", "CityCode", "CityName", ["CityCode", "CityName"])
            //cfi.ChangeAutoCompleteDataSource("searchOriginCity", dataSource, false, null, "CityCode");
            //$('#searchFlightDate').data("kendoDatePicker").value(todayDate);



            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
            });


            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                $("#hdnAWBSNo").val("");

                currentawbsno = 0;
                module = "House";

                $.ajax({
                    url: "Services/Shipment/AcceptanceService.svc/GetWebForm/" + _CURR_PRO_ + "/House/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewBooking").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("RESERVATION", "divNewBooking");
                            currentprocess = "RESERVATION";

                            $("#tblShipmentInfo").hide();
                            GetProcessSequence("HOUSE");
                        }
                    }
                });

            });





        },
        error: function (xhr) {
            var a = "";
            $("#divShipmentDetails").html("");
            $("#imgprocessing").hide();
        }
    });
}

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
}

function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

function ShipmentSearch() {

    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate =cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = "DEL";

    if (_CURR_PRO_ == "HOUSE") {
        var HAWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/AcceptanceService.svc/GetHouseAcceptanceGridData/" + _CURR_PRO_ + "/House/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + HAWBNo + "/" + LoggedInCity);

    }


}

function showAWBPrint() {
    //if (currentawbsno!="")
}
//Hmishra
function showAWBlbl() {
    ShowMessage('warning', 'Information!', "Printer Not Configured", "bottom-right");
    //IdAWBlbl
}
function showAp() {
    //window.open("AcceptanceNote.html?aId=" + currentawbsno);
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

function BindEvents(obj, e, isdblclick) {
    $("#divGraph").show();
    $("#divXRAY").hide();
    $(obj).parents('tbody').find('tr').removeClass('k-state-selected');
    $(obj).parent().parent().addClass('k-state-selected');
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        ResetDetails();
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    //var clickedRowIndex = $(obj).closest("tr").index();
    //var closestLockedTr = $(obj).closest("div.k-grid").find("div.k-grid-content-locked").find("tr:eq(" + clickedRowIndex.toString() + ")");

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

    //var trLocked = $(obj).closest("div.k-grid").find("div.k-grid-header").find("tr[role='row']");
    //var trRow = $(obj).closest("div.k-grid").find("div.k-grid-header").find("tr[role='row']");

    var trLocked = $(obj).closest("div.k-grid").find("div.k-grid-header").find("tr");
    var trRow = $(obj).closest("div.k-grid").find("div.k-grid-header").find("tr");


    awbNoIndex = trLocked.find("th[data-field='HAWBNo']").index();
    originIndex = trLocked.find("th[data-field='OriginCity']").index();
    destIndex = trLocked.find("th[data-field='DestinationCity']").index();

    //awbSNoIndex = trRow.find("th[data-field='SNo']").index();
    awbSNoIndex = trRow.find("th[data-field='SNo'][data-title='SNo']").index();

    awbDateIndex = trRow.find("th[data-field='HAWBDate']").index();
    pcsIndex = trRow.find("th[data-field='Pieces']").index();
    chwtIndex = trRow.find("th[data-field='ChargeableWeight']").index();
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

    $("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    $("#tdOD").text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());

    $("#hdnAWBSNo").val(currentawbsno);
    $("#hdnAccPcs").val(accpcs);
    $("#hdnAccGrWt").val(accgrwt);
    $("#hdnAccVolWt").val(accvolwt);

    $("#tdAWBDate").text(closestTr.find("td:eq(" + awbDateIndex + ")").text());
    $("#tdFlightNo").text(closestTr.find("td:eq(" + flightNoIndex + ")").text());
    $("#tdFlightDate").text(closestTr.find("td:eq(" + flightDateIndex + ")").text());
    $("#tdCommodity").text(closestTr.find("td:eq(" + commodityIndex + ")").text());
    $("#tdPcs").text(closestTr.find("td:eq(" + pcsIndex + ")").text());
    $("#tdChWt").text(closestTr.find("td:eq(" + chwtIndex + ")").text());

    awbNoIndex = trRow.find("th[data-field='HAWBNo']").index();
    ShowProcessDetails(subprocess, isdblclick);
    $("#tabstrip").kendoTabStrip();
    GetProcessSequence("HOUSE");
}

function ShowProcessDetails(subprocess, isdblclick) {

    $("#IdAcptNote").css("display", "none");
    $("#IdAWBPrint").css("display", "none");
    $("#IdEDINote").css("display", "none");
    $("#ulTab").hide();
    $("#divDetailSHC").hide();
    if (subprocess.toUpperCase() == "HOUSEWAYBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/AcceptanceService.svc/GetTransGridData/" + _CURR_PRO_ + "/House/HOUSEWAYBILL/" + currentawbsno);
        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "SHIPPINGBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/AcceptanceService.svc/GetTransGridData/" + _CURR_PRO_ + "/House/SHIPPINGBILL/" + currentawbsno);

        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {

        $("#divXRAY").show();
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/AcceptanceService.svc/GetTransGridData/" + _CURR_PRO_ + "/House/CHECKLIST/" + currentawbsno);
        cfi.ShowIndexView("divDetailSHC", "Services/Shipment/AcceptanceService.svc/GetTransGridData/" + _CURR_PRO_ + "/House/CHECKLIST_SPHC/" + currentawbsno);
        $("#ulTab").show();
        $("#divDetailSHC").show();
        //SAVE SECTION
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);

    }
    else {
        $.ajax({
            //url: "Services/FormService.svc/GetWebForm/" + _CURR_PRO_ + "/House/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            url: "Services/Shipment/AcceptanceService.svc/GetWebForm/" + _CURR_PRO_ + "/House/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    InitializePage(subprocess, "divDetail", isdblclick);
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
    var filterConsigneeCity = cfi.getFilter("AND");
    var filterAgent = cfi.getFilter("AND");

    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");

    if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");

        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");

        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    else if (textId.indexOf("Text_IssuingAgent") >= 0) {
        var filterWAgent = cfi.getFilter("AND");

        //cfi.setFilter(filterWAgent, "CityCode", "eq", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        cfi.setFilter(filterWAgent, "AirportSno", "eq", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        filterAgent = cfi.autoCompleteFilter(filterWAgent);
        return filterAgent;
    }
        //ChargeName
        //hmishra
    else if (textId.indexOf("Text_AWBNo") >= 0) {
        var filterWAgent = cfi.getFilter("AND");
        cfi.setFilter(filterWAgent, "IsAvailable", "eq", "1");
        filterAgent = cfi.autoCompleteFilter(filterWAgent);
        return filterAgent;
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

}

function InitializePage(subprocess, cntrlid, isdblclick) {
    $("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);

    if (subprocess.toUpperCase() == "CUSTOMER") {
        BindCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        BindDimensionEvents();
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

    }
    else if (subprocess.toUpperCase() == "PAYMENT") {

        InitializePaymentData();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        BindReservationSection();
    }
    //else if (subprocess.toUpperCase() == "CHECKLIST") {
    //    BindCheckList();

    //}
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
                ShowMessage('error', 'Error!', "House No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked Master data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    if (SaveFormData(subprocess))
                        ShipmentSearch();
                }
            }
            else {
                return false
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var saveflag = false;
            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "House No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
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
                            cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/House/Booking");
                        }
                        return;
                    }
                }
            }
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

    //$("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    if ($(this).attr("recname") == undefined) {
    //        var controlId = $(this).attr("id");
    //        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //    }
    //});
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

function ResetFBLCharge(textId, textValue, keyId, keyValue) {
    $("div[id$='areaTrans_house_househandlingchargeinfo']").find("[id^='areaTrans_house_househandlingchargeinfo']").each(function () {
        if (textId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
            if (keyValue == "") {
                $(this).find("input[id^='Amount']").val("");
                $(this).find("span[id^='TotalAmount']").html("");
                $(this).find("input[id^='TotalAmount']").val("");
            }
        }
    });
    CalculateTotalFBLAmount();
}

function CalculateFBLAmount(obj) {
    var a = "";
    var chargeName = $(obj).closest("tr").find("[id^='ChargeName']");
    var chargeText = $(obj).closest("tr").find("[id^='Text_ChargeName']").attr("id");
    var chargeKey = $("#" + chargeText).data("kendoAutoComplete").key();
    for (var i = 0; i < paymentList.length; i++) {
        if (paymentList[i].TariffSNo == chargeKey) {
            var gst = parseFloat(paymentList[i].GSTPercentage);
            var totalAmount = parseFloat($(obj).val()) + (parseFloat($(obj).val()) * gst) / 100;
            totalAmount = parseFloat(totalAmount).toFixed(3);
            $(obj).closest("tr").find("span[id^='TotalAmount']").html(totalAmount.toString());
            $(obj).closest("tr").find("input[id^='TotalAmount']").val(totalAmount.toString());
        }
    }
    CalculateTotalFBLAmount();
}

function CalculateTotalFBLAmount() {
    var totalFBLAmount = 0;
    $("div[id$='areaTrans_house_househandlingchargeinfo']").find("[id^='areaTrans_house_househandlingchargeinfo']").each(function () {
        $(this).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val())))
                totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    $("#divareaTrans_house_househandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_house_househandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
}

function BindHandlingInfoDetails() {

    cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    cfi.AutoComplete("CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetOSIInfoAndHandlingMessage?HAWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,

        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var osiData = jQuery.parseJSON(result);
            var osiInfo = osiData.Table0;

            var handlingArray = osiData.Table1;
            var osiTransInfo = osiData.Table2;
            var ocitransInfo = osiData.Table3;

            if (osiInfo.length > 0) {
                $("#SCI").val(osiInfo[0].SCI.toUpperCase());
            }
            cfi.makeTrans("house_houseositrans", null, null, null, null, null, osiTransInfo, 2);
            cfi.makeTrans("house_houseocitrans", null, null, BindCountryCodeAutoComplete, ReBindCountryCodeAutoComplete, null, ocitransInfo);
            cfi.makeTrans("house_househandlinginfo", null, null, BindHandlingAutoComplete, removeHandlingMessage, null, handlingArray);

            $("div[id$='areaTrans_house_househandlinginfo']").find("[id='areaTrans_house_househandlinginfo']").each(function () {
                $(this).find("input[id^='Type']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
                });
            });

        },
        error: {

        }
    });
}

function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "CountryCode", "Country", "CountryCode", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
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
    $(elem).closest("div[id$='areaTrans_shipment_shipmentocitrans']").find("[id^='areaTrans_shipment_shipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "CountryCode", "CountryCode", ["CountryCode", "CountryName"]);
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

function BindCustomerInfo() {
    //cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    //cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    //cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "Customer", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "Customer", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetShipperAndConsigneeInformation?HAWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            var agentData = customerData.Table2;
            if (shipperData.length > 0) {
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                if (shipperData[0].ShipperAccountNo != "") {
                    $("#Text_SHIPPER_AccountNo").prop('disabled', true);
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                }
                $("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperName, shipperData[0].ShipperName);

                $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                $("#SHIPPER_State").val(shipperData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
            }
            if (consigneeData.length > 0) {
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                if (consigneeData[0].ConsigneeAccountNo != "") {
                    $("#Text_CONSIGNEE_AccountNo").prop('disabled', true);
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                }
                $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeName, consigneeData[0].ConsigneeName);

                $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
            }
            if (agentData.length > 0) {
                $('#AGENT_AccountNo').val(agentData[0].AccountNo);
                $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo);
                $('#AGENT_Participant').val(agentData[0].Participant);
                $('span[id=AGENT_Participant]').text(agentData[0].Participant);
                $('#AGENT_IATACODE').val(agentData[0].IATANo);
                $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo);
                $('#AGENT_Name').val(agentData[0].AgentName);
                $('span[id=AGENT_Name]').text(agentData[0].AgentName);
                $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress);
                $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress);
                $('#AGENT_PLACE').val(agentData[0].Location);
                $('span[id=AGENT_PLACE]').text(agentData[0].Location);
            }
        },
        error: {

        }
    });
}

function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {

        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperName, shipperConsigneeData[0].ShipperName);

                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);

                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                    }
                    else if (UserTyp == "C") {
                        $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeName, shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        $("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#SHIPPER_Email").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_Email").val('');
                    }
                }

            },
            error: {

            }
        });
    }

}

function BindHandlingChargeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "WMSFBLHandlingCharges", "", currentawbsno, 0, "DEL", 2, "", "2", "999999999", "No");
    });

    $(elem).find("input[id^='Amount']").each(function () {
        $(this).unbind("blur").bind("blur", function () {
            CalculateFBLAmount(this);
        });
    });
}

function ReBindHandlingChargeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_house_househandlingchargeinfo']").find("[id^='areaTrans_house_househandlingchargeinfo']").each(function () {
        $(this).find("input[id^='ChargeName']").each(function () {
            var newDataSource = GetDataSourceForFBLHandlingCharge("Text_" + $(this).attr("id"), null, "TariffSNo", "TariffCode", null, "WMSFBLHandlingCharges", "", currentawbsno, 0, "DEL", 2, "", "2", "999999999", "No");
            //cfi.AutoComplete($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, null, null, null, null, null, "WMSFBLHandlingCharges");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, ResetFBLCharge);
        });

        $(this).find("input[id^='Amount']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                CalculateFBLAmount(this);
            });
        });
    });
    CalculateTotalFBLAmount();
}

function BindBankAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BankName']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
    });
}

function ReBindBankAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_house_houseaddcheque']").find("[id^='areaTrans_house_houseaddcheque']").each(function () {
        $(this).find("input[id^='BankName']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindReservationSection() {
    //cfi.AutoComplete("Commodity", "Description", "Commodity", "SNo", "Description", ["Description"], null, "contains");
    //cfi.AutoComplete("ShipmentOrigin", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("ShipmentDestination", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");    
    //cfi.AutoComplete("IssuingAgent", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
    //cfi.AutoComplete("SpecialHandlingCode", "CODE", "SpecialHandlingCode", "CODE", "CODE", ["CODE", "Detail"], null, "contains");

    cfi.AutoComplete("Commodity", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("ShipmentOrigin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("ShipmentDestination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("IssuingAgent", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
    cfi.AutoComplete("SpecialHandlingCode", "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");


    //$("#Text_Product").data("kendoAutoComplete").setDefaultValue("2", "GENERAL");

    //$("#AWBDate").data("kendoDatePicker").value(new Date());

    $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
        cfi.PopUp("divareaTrans_house_houseclasssphc", "SPHC");
    });
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetAcceptanceInformation?HAWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table1;
            var sphcArray2 = fblData.Table2;

            if (resData.length > 0) {
                var resItem = resData[0];
                //$("#ShipmentType[value='" + resItem. + "']").prop('checked', true);

                $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySNo, resItem.Description);
                $("#Pieces").val(resItem.Pieces);
                $("#GrossWt").val(resItem.GrossWeight);
                $("#ChargeableWt").val(resItem.ChargeableWeight);
                $("input[id='CBM']").val(resItem.CBM);
                $("input[id='VolumeWt']").val(resItem.VolumeWeight);
                $("span[id='VolumeWt']").html(resItem.VolumeWeight);
                $("#HAWBNo").val(resItem.HAWBNo);
                $("#HAWBDate").data("kendoDatePicker").value(resItem.HAWBDate);
                //$("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName); 
                if (parseInt(resItem.AWBSNo == "" ? 0 : resItem.AWBSNo) > 0) {
                    $("#Text_AWBNo").data("kendoAutoComplete").setDefaultValue(resItem.AWBSNo, resItem.AWBNo);
                }
                $("#Text_IssuingAgent").data("kendoAutoComplete").setDefaultValue(resItem.AgentBranchSNo, resItem.AgentName);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                $("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                $("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);
                $("#NatureofGoods").val(resItem.NatureOfGoods);

                $("#HAWBNo").attr("disabled", "disabled");

                bkdgrwt = resItem.GrossWeight;
                bkdvolwt = resItem.CBM;
                bkdpcs = resItem.Pieces;

                $("input[id='GrossWt']").unbind("blur").bind("blur", function () {

                });

                $("input[id='CBM']").unbind("blur").bind("blur", function () {
                    compareVolValue("V", this, accvolwt, resItem.VolumeWeight);

                });

            }
            if (sphcArray2.length > 0) {
                $("#Text_SpecialHandlingCode").data("kendoAutoComplete").setDefaultValue(sphcArray2[0].sphcsno, sphcArray2[0].text_specialhandlingcode);
            }
            //if ($("#Text_AWBNo").data("kendoAutoComplete").key() == undefined || $("#Text_AWBNo").data("kendoAutoComplete").value() == "") {
            if ($("#Text_AWBNo").data("kendoAutoComplete") == undefined || $("#Text_AWBNo").data("kendoAutoComplete").value() == "") {
                cfi.EnableAutoComplete("AWBNo", true, true);
                cfi.AutoComplete("AWBNo", "AWBNo", "v_AvailableAWBListForHouse", "AWBSNo", "AWBNo", null, null, "contains");
            }
            else {
                cfi.EnableAutoComplete("AWBNo", false, null, "lightgrey");
            }

            cfi.makeTrans("house_houseclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray);
            $("div[id$='areaTrans_house_houseclasssphc']").find("[id='areaTrans_house_houseclasssphc']").each(function () {
                $(this).find("input[id^='SPHC']").each(function () {
                    //cfi.AutoComplete($(this).attr("name"), "CODE", "SpecialHandlingCode", "CODE", "CODE", ["CODE", "Detail"], null, "contains");
                    cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
                });
                $(this).find("input[id^='Class']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains");
                });
            });
            $("input[id='Pieces']").unbind("blur").bind("blur", function () {
                comparePcsValue(this);

            });

            $("#ChargeableWt").unbind("blur").bind("blur", function () {

                compareGrossVolValue();
            });

            $("#GrossWt").unbind("blur").bind("blur", function () {

                if (compareGrossValue(this))
                    CalculateShipmentChWt();
            });
            $("#CBM").unbind("blur").bind("blur", function () {
                if (compareVolValue(this))
                    CalculateShipmentChWt();
            });
        },
        error: {

        }
    });
}


function compareGrossVolValue() {
    var gw = $("#GrossWt").val();
    var vw = $("span[id='VolumeWt']").text();
    var cw = $("#ChargeableWt").val();
    var chwt = gw > vw ? gw : vw;
    if (parseFloat($("#ChargeableWt").val() == "" ? "0" : $("#ChargeableWt").val()) < chwt)
        $("#ChargeableWt").val(chwt);

    //if ((parseFloat(cw) < parseFloat(vw)) && (parseFloat(cw) < parseFloat(gw))) {
    //    var chwt = gw > vw ? gw : vw;        
    //    $("#ChargeableWt").val(chwt.toString());
    //}
}

function comparePcsValue(obj) {
    var value = $(obj).val();
    if (parseFloat(value) < parseFloat(accpcs)) {
        $(obj).val(bkdpcs);
        ShowMessage('warning', 'Information!', "Entered Pieces cannot be less than Accepted Pieces. Accepted Pieces : " + bkdpcs.toString() + ".", "bottom-right");
    }
}

function compareGrossValue(obj) {
    if (parseFloat(accgrwt) > 0) {
        var flag = true;//hmishra
        var value = $(obj).val();
        if (parseFloat(value) < parseFloat(accgrwt)) {
            $(obj).val(bkdgrwt);
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
        $(obj).val(bkdvolwt);
        ShowMessage('warning', 'Information!', "Entered Volume weight cannot be less than accepted Volume weight. Accepted volume weight : " + bkdvolwt.toString() + ".", "bottom-right");
        flag = false;
    }
    return flag;
}

function CalculateShipmentChWt() {

    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.66;
    $("span[id='VolumeWt']").text(volwt.toFixed(3));// HMishra
    $("input[id='VolumeWt']").val(volwt.toFixed(3));// HMishra
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toString());
}

function BindItenAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    });
    $(elem).find("input[id^='offPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    });
    $(elem).find("input[id^='FlightNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "FlightNo", "DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    });
}

function ReBindItenAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_house_houseitinerary']").find("[id^='areaTrans_house_houseitinerary']").each(function () {
        $(this).find("input[id^='BoardPoint']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='offPoint']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "DailyFlight", "FlightNo", "FlightNo", ["FlightNo"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindSPHCAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SpecialHandlingCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CODE", "SpecialHandlingCode", "CODE", "CODE", ["CODE", "Detail"], null, "contains");
    });
    $(elem).find("a[id^='ahref_ClassDetails']").each(function () {
        $(this).unbind("click").bind("click", function () {
            cfi.PopUp("divareaTrans_house_houseclasssphc", "SPHC Trans");
        });
    });
}

function ReBindSPHCAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_house_housesphc']").find("[id^='areaTrans_house_housesphc']").each(function () {
        $(this).find("input[id^='SPHC']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SpecialHandlingCode", "Code", "CODE", ["CODE", "Detail"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("a[id^='ahref_ClassDetails']").each(function () {
            $(this).unbind("click").bind("click", function () {
                cfi.PopUp("divareaTrans_house_houseclasssphc", "SPHC Trans");
            });
        });
    });
}

function BindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SPHC']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "CODE", "SpecialHandlingCode", "CODE", "CODE", ["CODE", "Detail"], null, "contains");
        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
    });
    $(elem).find("input[id^='Class']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains");
    });
}

function ReBindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_house_houseclasssphc']").find("[id^='areaTrans_house_houseclasssphc']").each(function () {
        $(this).find("input[id^='SpecialHandlingCode']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SpecialHandlingCode", "Code", "CODE", ["CODE", "Detail"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHC", "SNO", "CODE", ["CODE", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='Class']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHCClass", "SNo", "ClassName", ["ClassName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function ValidatePieces(obj) {

    if (obj != undefined) {
        cfi.ConvertCulture(obj, 1);
    }
    var elem = $("#areaTrans_house_housedimension");
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
    //CalculatePPVolumeWeight(elem, currentIndexPos);
    //CalculateGrossWeight();

    //if (obj != undefined) {
    //    cfi.ConvertCulture(obj, 0);
    //}
    return true;
}

function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_house_housedimension");
    var divisor = 1;
    if ($("#Unit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    elem.closest("div").find("input[id^='Pieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var LengthID = currentId.replace("Pieces", "Length");
        var WidthID = currentId.replace("Pieces", "Width");
        var HeightID = currentId.replace("Pieces", "Height");
        var VolumeID = currentId.replace("Pieces", "VolumeWt");
        var currentVolume = 0;
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            currentVolume = parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());
            var volWeight = cfi.ceil(currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);
            VolumeCalculation = VolumeCalculation + volWeight;
            $("span[id='" + VolumeID + "']").html(volWeight);
            $("input[id='" + VolumeID + "']").val(volWeight);
        }
    });

    if (VolumeCalculation != 0) {
        $("span[id='DimVolumeWt']").html(VolumeCalculation);
        $("input[id='DimVolumeWt']").val(VolumeCalculation);

    }
    else {
        $("span[id='DimVolumeWt']").html(0);
        $("input[id='DimVolumeWt']").val(0);
    }
}

function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (elem.closest("table").find("[id^='Pieces']").length < 2)
        $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
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

    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = true;



    return true;
}

function AfterAddDim() {
    var elem = $("#areaTrans_house_housedimension");
    if (elem.closest("table").find("[id^='Pieces']").length >= 2)
        $('.disablechk').attr('disabled', 'disabled');
    var elem = $("#areaTrans_house_housedimension");
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    Pcs = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
    var count = elem.closest("table").find("[id^='Pieces']").length - 2;
}

function ValidateWeighingProcess(obj) {
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_house_houseweightdetail']").find("table:first").find("tr[id^='areaTrans_house_houseweightdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
            }
        }
    });
    if (processedpcscount == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        return;
    }
    var totalPcs = parseInt($("#TotalPieces").val());
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno)) {
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
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            return;
        }
    }
    handleAdd($("div[id='divareaTrans_house_houseweightdetail']").find("table:first").find("tr[id^='areaTrans_house_houseweightdetail']:last").find("td:last"), "areaTrans_house_houseweightdetail", pieceSequence, "ScanPieces", "RemainingPieces");
}

function ValidateXRayProcess(obj) {
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_house_housexraydetail']").find("table:first").find("tr[id^='areaTrans_house_housexraydetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
            }
        }
    });
    if (processedpcscount == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        return;
    }
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    var totalPcs = parseInt($("#TotalPieces").val());
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno)) {
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
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            return;
        }
    }
    handleAdd($("div[id='divareaTrans_house_housexraydetail']").find("table:first").find("tr[id^='areaTrans_house_housexraydetail']:last").find("td:last"), "areaTrans_house_housexraydetail", pieceSequence, "ScanPieces", "RemainingPieces");
}

function ValidateLocationProcess(obj) {
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id^='areaTrans_house_houselocationdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
            }
        }
    });
    //--
    var ULDLocationPcs = 0;
    $("div[id='divareaTrans_house_houseuldlocation']").find("table:first").find("tr[id^='areaTrans_house_houseuldlocation']").each(function () {
        ULDLocationPcs += 1;
    });
    //--
    if (processedpcscount + ULDLocationPcs == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        return;
    }
    var totalPcs = parseInt($("#TotalPieces").val());
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno)) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || (endPicesno + ULDLocationPcs) > totalPcs) {
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
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            return;
        }
        //alert(pieceSequence);
    }
    handleAdd($("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id^='areaTrans_house_houselocationdetail']:last").find("td:last"), "areaTrans_house_houselocationdetail", pieceSequence, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
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

                //                                if (($(this).attr("controltype") == "autocomplete") || ($(this).attr("controltype") == "datetype")) {
                //                                    $(this).attr("style", $(this).closest("span")[0].style.cssText); 
                //                                }
                //                                else { 
                //                                        $(this).attr("style", $(this)[0].style.cssText);
                //                                }

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
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetRecordAtWeighing?HAWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,

        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var weighingData = jQuery.parseJSON(result);
            var weighingArray = weighingData.Table0;


            $("div[id$='divareaTrans_house_houseweightdetail']").find("table:first").find("tr[id='areaTrans_house_houseweightdetail']:first").hide();
            if (weighingArray.length > 0) {
                for (var i = 0; i < weighingArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_house_houseweightdetail']").find("table:first").find("tr[id^='areaTrans_house_houseweightdetail']:last").find("td:last"), "areaTrans_house_houseweightdetail", weighingArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");
                    var row = $("div[id='divareaTrans_house_houseweightdetail']").find("table:first").find("tr[id^='areaTrans_house_houseweightdetail']:last");
                    row.find("[id^='GrossWt_']").val(weighingArray[i].GrossWt);
                    row.find("[id^='Remarks_']").val(weighingArray[i].Remarks);
                }

            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_house_houseweightdetail']").find("table:first").find("tr[id^='areaTrans_house_houseweightdetail']:last").find("td:last"), "areaTrans_house_houseweightdetail", dblscan, "ScanPieces", "RemainingPieces");
            }

        },
        error: {

        }
    });
}

function BindULDAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ULDNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
    });
}

function BindDimensionEvents() {
    SetTotalPcs();
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetDimemsionsAndULD?HAWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,

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

            cfi.makeTrans("house_houseuld", null, null, BindULDAutoComplete, null, null, uldArray);

            cfi.makeTrans("house_housedimension", null, null, AfterAddDim, checkonRemove, beforeAddEventCallback, dimArray);
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

            //$("div[id$='areaTrans_house_househandlinginfo']").find("[id='areaTrans_house_househandlinginfo']").each(function () {
            //    $(this).find("input[id^='Type']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
            //    });
            //});
            $("div[id$='areaTrans_house_houseuld']").find("[id='areaTrans_house_houseuld']").each(function () {
                $(this).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
            });
        },
        error: {

        }
    });
}

function BindXRayEvents(isdblclick) {
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetRecordAtXray?HAWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,

        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var xrayData = jQuery.parseJSON(result);
            var xrayArray = xrayData.Table0;

            $("div[id$='divareaTrans_house_housexraydetail']").find("table:first").find("tr[id='areaTrans_house_housexraydetail']:first").hide();

            if (xrayArray.length > 0) {
                for (var i = 0; i < xrayArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_house_housexraydetail']").find("table:first").find("tr[id^='areaTrans_house_housexraydetail']:last").find("td:last"), "areaTrans_house_housexraydetail", xrayArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");
                }

            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_house_housexraydetail']").find("table:first").find("tr[id^='areaTrans_house_housexraydetail']:last").find("td:last"), "areaTrans_house_housexraydetail", dblscan, "ScanPieces", "RemainingPieces");
            }

        },
        error: {

        }
    });
}

function BindLocationEvents(isdblclick) {
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetRecordAtLocation?HAWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,

        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var locationData = jQuery.parseJSON(result);
            var locationArray = locationData.Table0;
            var uldArray = locationData.Table1;
            //++++++++ divareaTrans_house_houseuldlocation
            cfi.makeTrans("house_houseuldlocation", null, null, BindLocationAutoCompleteForULD, ReBindLocationAutoCompleteForULD,null,uldArray)
            $('#divareaTrans_house_houseuldlocation table tr td:last').remove();
            $('#divareaTrans_house_houseuldlocation table tr[id!="areaTrans_house_houseuldlocation"] td:eq(9)').remove();
            $('#divareaTrans_house_houseuldlocation table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            //++++++++


            $("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id='areaTrans_house_houselocationdetail']:first").hide();
            $("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id='areaTrans_house_houselocationdetail']:first").find("input[id^='Text_Location']").removeAttr("data-valid");

            //++++++++
            $("div[id$='divareaTrans_house_houseuldlocation']").find("[id='areaTrans_house_houseuldlocation']").each(function () {
                $(this).find("input[id^='Locationn']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
                });
            });
            //++++++++
            if (uldArray.length > 0) {
                $("div[id='divareaTrans_house_houseuldlocation']").find("table:first").find("tr[id^='areaTrans_house_houseuldlocation']").each(function (row, tr) {
                    $(tr).find("[id^='Text_Locationn']").data("kendoAutoComplete").setDefaultValue(uldArray[row].warehouselocationsno, uldArray[row].location);
                });
                var RemainingPieces;
                RemainingPieces = $("input[id='RemainingPieces']").val();
                $("input[id='RemainingPieces']").val(RemainingPieces - uldArray.length);
                $("span[id='RemainingPieces']").html(RemainingPieces - uldArray.length);
            }

            if (locationArray.length > 0) {
                for (var i = 0; i < locationArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id^='areaTrans_house_houselocationdetail']:last").find("td:last"), "areaTrans_house_houselocationdetail", locationArray[i].ScannedPieces, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
                    var row = $("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id^='areaTrans_house_houselocationdetail']:last");
                    row.find("[id^='Text_Location_']").data("kendoAutoComplete").setDefaultValue(locationArray[i].LocationSNo, locationArray[i].LocationName);
                }

            }                
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_house_houselocationdetail']").find("table:first").find("tr[id^='areaTrans_house_houselocationdetail']:last").find("td:last"), "areaTrans_house_houselocationdetail", dblscan, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
            }

        },
        error: {

        }
    });
}

function BindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).find("input[id^='Locationn']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });

    $(mainElem).find("input[id^='Locationn']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_Locationn']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        $(this).attr("data-valid", "required");
    });
}

function ReBindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentuldlocation']").find("[id^='areaTrans_shipment_shipmentuldlocation']").each(function () {
        $(this).find("input[id^='Locationn']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
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
    $(elem).closest("div[id$='areaTrans_house_houselocationdetail']").find("[id^='areaTrans_house_houselocationdetail']").each(function () {
        $(this).find("input[id^='Location']").each(function () {
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
}

function SaveHandlingInfo() {
    var flag = false;

    var osi = '';
    var OSIInfoModel = new Array();
    var OCIInfoModel = new Array();
    $("#divareaTrans_house_houseositrans table tr[data-popup='false']").each(function (row, i) {
        if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
            OSIInfoModel.push({ HAWBSNo: currentawbsno, OSI: $(i).find('td:nth-child(2) input[type=text]').val() });
        }

    });

    $("#divareaTrans_house_houseocitrans table tr[data-popup='false']").each(function (row, i) {
        if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {

            OCIInfoModel.push({
                HAWBSNo: currentawbsno,
                CountryCode: $(i).find("td:eq(1) > [id^='CountryCode']").val(),
                InfoType: $(i).find("td:eq(2) > [id^='InfoType']").val(),
                CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='CSControlInfoIdentifire']").val(),
                SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
            });
        }
    });

    var osiViewModel = {
        SCI: $("#SCI").val().toUpperCase(),
    };
    var HandlingInfoArray = [];
    $("div[id$='areaTrans_house_househandlinginfo']").find("[id^='areaTrans_house_househandlinginfo']").each(function () {

        var type = $(this).find("[id^='Text_Type']").data("kendoAutoComplete").key();
        var message = $(this).find("[id^='Message']").val();
        var HandlingInfoViewModel = {
            HAWBSNo: currentawbsno,
            HandlingMessageTypeSNo: type,
            Message: message
        };
        HandlingInfoArray.push(HandlingInfoViewModel);

    });


    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/UpdateOSIInfoAndHandlingMessage", async: false, type: "POST", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ HAWBSNo: currentawbsno, OSIInformation: osiViewModel, HAWBHandlingMessage: HandlingInfoArray, HAWBOSIModel: OSIInfoModel, HAWBOCIModel: OCIInfoModel, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Handling Info', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                //$("#divDetail").html("");
                //$("#tblShipmentInfo").hide();

                //$("#btnSave").unbind("click");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Handling Info', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Handling Info', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveCustomerInfo() {
    var flag = false;
    var ShipperViewModel = {
        //ShipperAccountNo: "",
        //ShipperName: $("#SHIPPER_Name").val(),
        ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
        ShipperName: $("#Text_SHIPPER_Name").data("kendoAutoComplete").key(),
        ShipperStreet: $("#SHIPPER_Street").val(),
        ShipperLocation: $("#SHIPPER_TownLocation").val(),
        ShipperState: $("#SHIPPER_State").val(),
        ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
        ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
        ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
        ShipperMobile: $("#SHIPPER_MobileNo").val(),
        ShipperEMail: $("#SHIPPER_Email").val(),
    };

    var ConsigneeViewMode = {
        //ConsigneeAccountNo: "",
        //ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
        ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
        ConsigneeName: $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").key(),
        ConsigneeStreet: $("#CONSIGNEE_Street").val(),
        ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
        ConsigneeState: $("#CONSIGNEE_State").val(),
        ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
        ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
        ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
        ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
        ConsigneeEMail: $("#CONSIGNEE_Email").val(),

    };

    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/UpdateShipperAndConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ HAWBSNo: currentawbsno, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, UpdatedBy: 2, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(), ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Customer', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                //$("#divDetail").html("");
                //$("#tblShipmentInfo").hide();

                //$("#btnSave").unbind("click");
                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - Customer', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customer', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            flag = false;
        }
    });
    return flag;
}

function SaveWeighingMachineInfo() {
    var flag = false;
    var ScanType = ($("[id='Type']:checked").val() == 0);
    var WeighingMachineArray = [];
    $("div[id$='areaTrans_house_houseweightdetail']").find("[id^='areaTrans_house_houseweightdetail_']").each(function () {
        var WeighingMachineViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            NoOfPieces: $(this).find("input[id^='ScanPieces_']").val().split(',').length,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            GrossWt: $(this).find("input[id^='GrossWt_']").val(),
            Remarks: $(this).find("[id^='Remarks_']").val()
        };
        WeighingMachineArray.push(WeighingMachineViewModel);

    });
    if (WeighingMachineArray.length > 0)
        $.ajax({
            url: "Services/House/HouseAcceptanceService.svc/SaveAtWeighing", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
            data: JSON.stringify({ HAWBSNo: currentawbsno, lsAWBGroup: WeighingMachineArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Weighing Machine', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;
                    } else {
                        ShowMessage('warning', 'Warning - Weighing Machine', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;
                    }

                }
                else
                    ShowMessage('warning', 'Warning - Weighing Machine', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Weighing Machine', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    else {
        ShowMessage('warning', 'Warning - Weighing Machine', "House No. [" + $("#tdAWBNo").text() + "] -  Enter weighing detail.", "bottom-right");
    }
    return flag;
}

function SaveXRayInfo() {
    var flag = false;
    var ScanType = ($("[id='Type']:checked").val() == 0);
    var XRayArray = [];
    $("div[id$='areaTrans_house_housexraydetail']").find("[id^='areaTrans_house_housexraydetail_']").each(function () {
        var XRayViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val()
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
    if (XRayArray.length > 0)
        $.ajax({
            url: "Services/House/HouseAcceptanceService.svc/SaveAtXRay", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
            data: JSON.stringify({ HAWBSNo: currentawbsno, lsAWBXRay: XRayArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - XRay', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - XRay', "House No. [" + $("#tdAWBNo").text() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - XRay', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    else {
        ShowMessage('warning', 'Warning - XRay', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
    }
    return flag;
}

function SaveLocationInfo() {
    var flag = false;
    var ScanType = $("[id='Type']:checked").val();
    var LocationArray = [];
    $("div[id$='areaTrans_house_houselocationdetail']").find("[id^='areaTrans_house_houselocationdetail_']").each(function () {
        var LocationViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            AWBSNo: currentawbsno,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            LocationSNo: $(this).find("[id^='Text_Location']").data("kendoAutoComplete").key()
        };
        LocationArray.push(LocationViewModel);
    });

    var ULDLocationArray = [];
    var i = 1;
    $("div[id$='areaTrans_house_houseuldlocation']").find("[id^='areaTrans_house_houseuldlocation']").each(function () {
        if (parseInt($(this).find("[id^='Text_Locationn']").data("kendoAutoComplete").key()) > 0) {
            var ULDLocationModel = {
                RowNo: i,
                SNo: $(this).find('input[type="hidden"][id^="sno"]').val(),
                LocationSno: $(this).find("[id^='Text_Locationn']").data("kendoAutoComplete").key()

            };
            ULDLocationArray.push(ULDLocationModel);
            i += 1;
        }
    });

    if (LocationArray.length > 0) {
        $.ajax({
            url: "Services/House/HouseAcceptanceService.svc/SaveAtLocation", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
            data: JSON.stringify({ HAWBSNo: currentawbsno, lsAWBLocation: LocationArray, lsULDLocation: ULDLocationArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - Location', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Location', "House No. [" + $("#tdAWBNo").text() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Location', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Location', "House No. [" + $("#tdAWBNo").text() + "] -  Enter location detail.", "bottom-right");
    }
    return flag;
}

function SaveReservationInfo() {
    var flag = false;
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var awbNo = $("#HAWBNo").val();
    var IsCourier = false,
    ShowSlacDetails = false,//$("[id='ShowSlacDetails']:checked").val(),
    HAWBNo = $("#HAWBNo").val(),
    AgentBranchSNo = $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
    //AWBDate: cfi.CfiDate("AWBDate"),
    //IssuingAgent: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
    HAWBTotalPieces = $("#Pieces").val(),
    CommoditySNo = $("#Text_Commodity").data("kendoAutoComplete").key(),
    GrossWeight = $("#GrossWt").val(),
    VolumeWeight = $("#VolumeWt").val(),
    ChargeableWeight = $("#ChargeableWt").val(),
    Pieces = $("#Pieces").val()
    var ShipmentInfo = {
        IsCourier: false,
        ShowSlacDetails: false,//$("[id='ShowSlacDetails']:checked").val(),
        HAWBNo: $("#HAWBNo").val(),
        AgentBranchSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
        //AWBDate: cfi.CfiDate("AWBDate"),
        //IssuingAgent: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
        HAWBTotalPieces: $("#Pieces").val(),
        CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
        GrossWeight: $("#GrossWt").val(),
        VolumeWeight: $("#VolumeWt").val(),
        ChargeableWeight: $("#ChargeableWt").val(),
        Pieces: $("#Pieces").val(),
        ProductSNo: 0,//$("#Text_Product").data("kendoAutoComplete").key(),
        IsPrepaid: ($("[id='FreightType']:checked").val() == 0),
        OriginCity: $("#Text_ShipmentOrigin").data("kendoAutoComplete").key(),
        DestinationCity: $("#Text_ShipmentDestination").data("kendoAutoComplete").key(),
        XRayRequired: ($("[id='X-RayRequired']:checked").val() == 0),
        HAWBDate: CfiDate("HAWBDate"),
        NatureOfGoods: $("#NatureofGoods").val(),
        AWBSNo: $("#Text_AWBNo").data("kendoAutoComplete").key(),
        AWBNo: $("#Text_AWBNo").data("kendoAutoComplete").value()


    };

    var ShipmentSPHCInfo = [];
    var SPHC = {
        HAWBSNo: awbSNo,
        HAWBNo: $("#HAWBNo").val(),
        SPHCCode: $("#Text_SpecialHandlingCode").data("kendoAutoComplete").key()
    };
    if ($("#Text_SpecialHandlingCode").data("kendoAutoComplete").key() != "") {
        ShipmentSPHCInfo.push(SPHC);
    }


    var SPHCArray = [];
    $("div[id$='areaTrans_house_houseclasssphc']").find("[id^='areaTrans_house_houseclasssphc']").each(function () {
        var SPHCViewModel = {
            SNo: 0,
            AWBSNo: awbSNo,
            AWBNo: $("#AWBNo").val(),
            SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
            UNNo: $(this).find("input[id^='UnNo']").val(),
            SPHCClassSNo: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key() == "" ? "0" : $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
            HAWBSNo: 0,
            IsRadioActive: 0,
            MCBookingSNo: 0,
            SubRisk: $(this).find("input[id^='SubRisk']").val(),
            RamCat: $(this).find("input[id^='RamCat']").val(),
            UnPackingGroupImpCode: $(this).find("[id^='UnPackingGroup']").val(),
            CaoX: $(this).find("[id^='Caox']").val(),
            ImpCode: $(this).find("[id^='ImpCode']").val()
        };
        if ($(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key() != "" || $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key() != "") {
            SPHCArray.push(SPHCViewModel);
        }


    });
    //if (SPHCArray.length == 0) {
    //    SPHCArray = {
    //        SNo: 0,
    //        HAWBSNo: 0,
    //        SPHCCode: "",
    //        UnNo: "",
    //        SPHCClassSNo: 0,
    //        IsRadioActive: 0,
    //        MCBookingSNo: 0,
    //        SubRisk: "",
    //        RamCat: "",
    //        UnPackingGroupImpCode: "",
    //        Caox: "",
    //        ImpCode: ""
    //    };
    //}


    //var ItineraryInfo = {
    //    DailyFlightSNo: $("#Text_FlightNo").data("kendoAutoComplete").key()
    //    //FlightDate: cfi.CfiDate("FlightDate"),
    //    //OffPoint: $("Text_offPoint").data("kendoAutoComplete").key(),
    //};


    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/SaveAcceptance", async: false, type: "POST", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ HAWBNo: $("#HAWBNo").val(), HAWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCInfo, AWBSPHCTrans: SPHCArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "") {
                //CleanUI();
                //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/AcceptanceService.svc/GetGridData/" + _CURR_PRO_ + "/House/Booking");
                ShowMessage('success', 'Success - Reservation', "House No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                $("#btnSave").unbind("click");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Reservation [' + awbNo + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Reservation', "House No. [" + awbNo + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function CfiDate(cntrl) {
    var cfiDate = $("#" + cntrl).data("kendoDatePicker");
    return cfiDate != undefined ? (cfiDate.sqlDateValue() == null ? "" : cfiDate.sqlDateValue()) : $("#" + cntrl).val();
}

function SaveDimensionInfo() {
    var flag = false;
    var ULDArray = [];
    $("div[id$='areaTrans_house_houseuld']").find("[id^='areaTrans_house_houseuld']").each(function () {
        var ULDViewModel = {
            HAWBSNo: currentawbsno,
            //ULDSNo: $(this).find("td[id^='tdSNo_Col_']").html(),
            //SPHCCode: $(this).find("[id^='Text_SpecialHandlingCode']").data("kendoAutoComplete").key(),
            //Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
            //UnNo: $(this).find("input[id^='UnNo']").val(),
            //SubRisk: $(this).find("input[id^='SubRisk']").val(),
            //RamCat: $(this).find("input[id^='RamCat']").val(),
            //UnPackingGroup: $(this).find("[id^='UnPackingGroup']").val(),
            //ImpCode: $(this).find("[id^='ImpCode']").val(),
            //Caox: $(this).find("[id^='Caox']").val()

            ULDSNo: $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").key(),
            ULDNo: $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").value(),
            UldPieces: $(this).find("input[id^='UldPieces']").val(),
            UldGrossWt: $(this).find("input[id^='UldGrossWt']").val(),
            UldTareWt: $(this).find("input[id^='UldTareWt']").val(),
            UldVolWt: $(this).find("input[id^='UldVolWt']").val(),
            CityCode: 0,
            MCBookingSNo: 0,
            DNNo: 0,
            MailDestination: 0,
            OriginRefNo: 0,
            ULDPivotWt: $(this).find("input[id^='ULDPivotWt']").val(),
        };
        ULDArray.push(ULDViewModel);

    });
    if (ULDArray.length == 0)
        ULDArray = {
            HAWbSNo: 0,
            ULDSNo: 0,
            UldPieces: 0,
            UldGrossWt: 0,
            UldTareWt: 0,
            UldVolWt: 0,
            CityCode: 0,
            MCBookingSNo: 0,
            DNNo: 0,
            MailDestination: 0,
            OriginRefNo: 0,
            ULDPivotWt: 0,
        };

    var DimArray = [];
    $("div[id$='areaTrans_house_housedimension']").find("[id^='areaTrans_house_housedimension']").each(function () {
        var DimViewModel = {
            HAWBSNo: currentawbsno,
            Height: $(this).find("[id^='Height']").val(),
            Length: $(this).find("[id^='Length']").val(),
            Width: $(this).find("input[id^='Width']").val(),
            Pieces: $(this).find("input[id^='Pieces']").val(),
            CBM: $(this).find("input[id^='VolumeWt']").val(),
            Unit: $("#Unit:checked").val()
        };
        DimArray.push(DimViewModel);

    });

    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/UpdateDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ HAWBSNo: currentawbsno, Dimensions: DimArray, AWBULDTrans: ULDArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;
                } else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;

                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function InitializePaymentData() {
    BindPaymentDetails();
}

function SavePaymentInfo() {
    var flag = false;
    var HandlingChargeArray = [];
    var totalChargeAmt = 0;
    $("div[id$='areaTrans_house_househandlingchargeinfo']").find("[id^='areaTrans_house_househandlingchargeinfo']").each(function () {
        var HandlingCharge = {
            SNo: $(this).find("td[id^='tdSNoCol']").html(),
            AWBSNo: currentawbsno,
            TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key().split('@')[0], //3
            TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),//'TERMINAL CHARGES',
            Value: parseFloat($(this).find("[id^='TotalAmount']").text()).toFixed(2),//80.00
            Remarks: $(this).find("[id^='Remarks']").text(), // '<Br><Br> Rate : 375.00 [Weight] * 0.2000 [Slab Value] = 75.000000~<asp:HiddenField ID="hdnFromDate" value="187" runat="server" />',
            Basis: 'Per KG',
            OnWt: 'ChWt'
        }
        totalChargeAmt = totalChargeAmt + parseFloat($(this).find("[id^='TotalAmount']").text());
        HandlingChargeArray.push(HandlingCharge);
    })

    //multiple
    var AgentBranchArray = [];
    //$("div[id$='areaTrans_house_houseaddcheque']").find("[id^='areaTrans_house_houseaddcheque']").each(function () {
    var AgentBranchCheque = {
        SNo: 0,// $(this).find("td[id^='tdSNoCol']").html(),
        AgentBranchSNo: 0,// $("input[name='AgentName']").val(),
        BankSNo: 0,// $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key(),
        BankName: "",// $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").value(),
        BankBranch: "",// $(this).find("[id^='Branch']").val(),
        ChequeNo: 0,// $(this).find("[id^='ChequeNo']").val(),
        ChequeDate: '2015/06/23',
        ChequeLimit: 0,// $(this).find("[id^='ChequeLimit']").val(),
        Availablelimit: 0,// $(this).find("[id^='ChequeLimit']").val(),
        ChequeFreuency: 1

    }
    AgentBranchArray.push(AgentBranchCheque);
    //})


    //single Row
    var AWBChequeArray = [];
    var AWBCheque = {
        SNo: 1,
        AWBSNo: currentawbsno,
        AgentBranchSNo: $("input[name='AgentName']").val(),
        Amount: parseFloat($('#CashAmount').val()).toFixed(2),
        PaymentMode: $('#PaymentMode:checked').val() == "0" ? "Cash" : "Credit",
        InvoiceSNo: 0,
        InvoiceNo: ''
    }
    AWBChequeArray.push(AWBCheque);



    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/SaveAtPayment", async: false, type: "POST", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ lstHandlingCharge: HandlingChargeArray, lstAgentBranchCheque: AgentBranchArray, lstAWBCheque: AWBChequeArray, CityCode: 'DEL', UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Payment', "Payment Processed Successfully", "bottom-right");
                flag = true;
                //$("#divDetail").html("");
                //$("#tblShipmentInfo").hide();

                //$("#btnSave").unbind("click");
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

function BindPaymentDetails() {
    $("div[id='divareaTrans_house_househandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_house_househandlingchargeinfo']:first").show();
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetRecordAtPayment?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var payementData = jQuery.parseJSON(result);
            var handlingChargeArray = payementData.Table0;
            var awbChequeArray = payementData.Table1;
            $("span[id='AgentName']").text(payementData.Table2[0].AgentName);
            $("input[name='AgentName']").val(payementData.Table2[0].AgentBranchSNo);
            if (awbChequeArray.length > 0) {
                $('#CashAmount').val(awbChequeArray[0].Amount)
                if (awbChequeArray[0].PaymentMode == "Cash")
                    $('#PaymentMode:checked').val("0");
                else
                    $('#PaymentMode:checked').val("1");
            }

            var tableHandleCharge = "";

            if (handlingChargeArray.length > 0) {
                $("div[id='divareaTrans_house_househandlingchargeinfo']").find("table:first").find("tr:first").find("td:last").hide();
                $("div[id='divareaTrans_house_househandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_house_househandlingchargeinfo']:first").hide();
                for (var i = 0; i < handlingChargeArray.length; i++) {
                    tableHandleCharge += "<tr><td>" + (i + 1) + "</td><td>" + handlingChargeArray[i].TariffHeadName + "</td><td>" + handlingChargeArray[i].Value + "</td><td>" + handlingChargeArray[i].Value + "</td><td>" + handlingChargeArray[i].Remarks + "</td><td></td></tr>"
                }
            }
            if (handlingChargeArray.length == 0 && awbChequeArray.length == 0) {

                cfi.makeTrans("house_househandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, null);

                $("div[id$='areaTrans_house_househandlingchargeinfo']").find("[id='areaTrans_house_househandlingchargeinfo']").each(function () {
                    $(this).find("input[id^='ChargeName']").each(function () {
                        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "WMSFBLHandlingCharges", "", currentawbsno, 0, "DEL", 2, "", "2", "999999999", "No");
                    });
                    $(this).find("input[id^='Amount']").each(function () {
                        $(this).unbind("blur").bind("blur", function () {
                            CalculateFBLAmount(this);
                        });
                    });
                });
                $.ajax({
                    url: "Services/House/HouseAcceptanceService.svc/FBLHandlingCharges?AWBSNo=" + currentawbsno + "&CityCode=DEL", async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var paymentData = jQuery.parseJSON(result);
                        paymentList = paymentData.Table0;
                        $("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
                        $("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);


                    },
                    error: function (xhr) {

                    }
                });


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
                                    cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/House/Booking");
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
                $("div[id='divareaTrans_house_househandlingchargeinfo']").find("table:first").append(tableHandleCharge);

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('warning', 'Warning - Payment', "Payment already Processed", "bottom-right");
                });
            }
            $("div[id$='areaTrans_house_houseaddcheque']").hide();
        }
    });
}

function BindCheckList() {
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $("#XRay").prop("checked", false);
    $("#Remarks").val('');
    $.ajax({
        url: "Services/House/HouseAcceptanceService.svc/GetCheckList?HAWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
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
                //$("#XRay").val(resItem.XrayRequired);
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
        // var CheckListDetailSNo = $(this).closest('tr').find("td:first").html();
        var rbtnY = $(this).closest('tr').find("[id^='rbtnY']:checked").val();
        var rbtnN = $(this).closest('tr').find("[id^='rbtnN']:checked").val();
        var rbtnNA = $(this).closest('tr').find("[id^='rbtnNA']:checked").val();
        // var status = (rbtnY == "Y" ? rbtnY : (rbtnN == "N" ? rbtnN : rbtnNA));

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
        url: "Services/House/HouseAcceptanceService.svc/SaveCheckList", async: false, type: "POST", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ HAWBSNo: currentawbsno, CheckListTrans: DocumentInfoArray, XRay: XRayRequired, Remarks: Remarks, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Document Info', "House No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                flag = true;
                //$("#divDetail").html("");
                //$("#tblShipmentInfo").hide();

                //$("#btnSave").unbind("click");
            }
            else
                ShowMessage('warning', 'Warning - Document Info', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Document Info', "House No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveFormData(subprocess) {
    var issave = false;
    $("#imgprocessing").show();
    if (subprocess.toUpperCase() == "CUSTOMER") {
        issave = SaveCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        issave = SaveDimensionInfo();
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
    $("#imgprocessing").hide();
    return issave;
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

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });
    //cfi.AutoComplete("searchOriginCity", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("searchDestinationCity", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
}

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Booking</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td id='IdAWBPrint' colspan='3'><a href='#' onclick='showAWBPrint()'>Print AWB</a></td></tr><tr> <td id='IdAWBlbl' colspan='3'><a href='#' onclick='showAWBlbl()'>Print AWB Label</a></td></tr><tr> <td id='IdAcptNote' colspan='3'><a href='#'>Print Acceptance Note</a></td></tr><tr> <td id='IdEDINote' colspan='3'><a href='#' onclick='ShowEDI()'>EDI Messages</a></td></tr><tr> <td id='IdPayrecpt' colspan='3'><a href='#' onclick='showPayRcpt()'>Print Payment Receipt </a></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div></div></td></tr></table> </td></tr></table></div>";