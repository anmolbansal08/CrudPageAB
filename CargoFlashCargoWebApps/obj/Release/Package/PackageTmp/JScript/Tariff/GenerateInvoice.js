/// <reference path="../../Scripts/references.js" />

var currentIssueType = "";
var currentIssueSNo = "";
var currentCityCode = "";
var currentPeriod = "";
var date = new Date();
var currentDate = date.getUTCDate() + "-" + ('0' + (parseInt(date.getUTCMonth() + 1))).slice(-2) + "-" + date.getUTCFullYear();
var CurrentAirportCode = "";
var currentAirlineAccountSNo = "";

$(document).ready(function () {

    SearchAirline();
    var _CURR_PRO_ = "TariffInvoice";
    //$("#chkSelectAll").removeAttr("checked");

    $(document).on("change", "input[name='Type']", function ()
    {
        $("#divIssueType").html('');
        $("#divInvoiceDetails").html('');
        TypeSourceChange();
    });
});

function TypeSourceChange() {
    if ($("#Type:checked").val() == 0) {
        $("#Text_InvoicingCycle").val('');
        $("#InvoicingCycle").val('');
        cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleType);
    }
    else {
        $("#Text_InvoicingCycle").val('');
        $("#InvoicingCycle").val('');
        cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleTypeAA);
    }
}


// Bind Events for subprocess
//------------------------------------------------------------------------------//
function BindEvents(obj, e, isdblclick) {
    if ($(obj).attr("currentprocess") == "PI" && $(obj).attr("process") == "APPROVEINVOICE") {
        currentAirlineInvoiceSNo = $(obj).closest("tr").find("td[data-column='AirlineInvoiceSNo']").text();
        var tdIsApproved = $(obj).closest("tr").find("td[data-column='IsApproved']").text();
        $.ajax({
            url: "Services/Tariff/TariffInvoiceService.svc/GetSummaryCreditInvoiceGrid/" + $(obj).attr("currentprocess") + "/Tariff/SummaryCreditInvoice/" + currentIssueType + "/" + currentAirlineInvoiceSNo, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divSummaryCreditInvoice").html(result);
                cfi.PopUp("divSummaryCreditInvoice", "Invoice", 1200, null, null, 1);

                if (tdIsApproved == "1")
                    $("#btnApprovedInvoice").hide();
                else
                    $("#btnApprovedInvoice").show();


                $("#divSummaryCreditInvoice").parent("div").css("position", "fixed");
            }
        });
    }

    var subprocess = "PI";
    currentprocess = subprocess;
    _CURR_PRO_ = $(obj).attr("currentprocess");
    if (currentprocess.toUpperCase() == "PI".toUpperCase() & _CURR_PRO_ == "TariffInvoice") {
        currentIssueType = $("#Type:checked").val();
        if (currentIssueType == '0')
            currentIssueSNo = $(obj).closest("tr").find("td[data-column='AccountSNo']").text();
        else
            currentIssueSNo = $(obj).closest("tr").find("td[data-column='AirlineSNo']").text();

        //currentCityCode = userContext.CityCode;
        currentCityCode = userContext.AirportCode;
        currentPeriod = $("#InvoicingCycle").val();

        cfi.ShowIndexView("divInvoiceDetails", "Services/Tariff/TariffInvoiceService.svc/GetInvoiceGridData/" + currentprocess + "/Tariff/TariffInvoice/" + currentIssueType + "/" + currentIssueSNo + "/" + currentCityCode + "/" + currentPeriod + "/" + currentDate);

    }
    if (currentprocess.toUpperCase() == "APPROVEINVOICE" && _CURR_PRO_.toUpperCase() == "PI") {
        currentIssueType = $("#Type:checked").val();

        if (currentIssueType == '0')
            currentIssueSNo = $(obj).closest("tr").find("td[data-column='AccountSNo']").text();
        else
            currentIssueSNo = $(obj).closest("tr").find("td[data-column='AirlineSNo']").text();

        //currentCityCode = userContext.CityCode;
        currentCityCode = userContext.AirportCode;
        currentPeriod = $("#InvoicingCycle").val();
        //currentDate = $("#Period").attr("sqldatevalue");
        $.ajax({
            url: "Services/Tariff/TariffInvoiceService.svc/ApproveInvoiceDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: currentIssueSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success', "Details Saved successfully", "bottom-right");
                }
                else
                    ShowMessage('warning', 'Warning', "Unable to save data.");
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });

    }
    if ($(obj).attr("process").toUpperCase() == "PRINTINVOICE") {
        currentAirlineInvoiceSNo = $(obj).closest("tr").find("td[data-column='AirlineInvoiceSNo']").text();
        var objAgentOrAirline = ($(obj).closest("tr").find("td[data-column='AccountSNo']").text() == "" || $(obj).closest("tr").find("td[data-column='AccountSNo']").text() == undefined) ? 1 : 0;
        //GetInvoiceReport(this, currentAirlineInvoiceSNo, objAgentOrAirline);
        var CurrentObj = this;
        $("#printType Table").remove();
        $("#printType").append('<table style="margin: 0px auto;"><tr><td><input type="radio" id="InvoiceSummary" name="IDType" value="1" checked>Invoice Summary</input><input type="radio" name="IDType" value="2" id="InvoiceDetails">Invoice Details</input><input type="radio" name="IDType" value="3" id="PrintWorkOrder">Print Work Order</input></td></tr></table>');
        $("#printType").dialog(
        {
            autoResize: true,
            maxWidth: 300,
            maxHeight: 150,

            width: 500,
            height: 150,
            modal: true,
            title: 'Print Invoice',
            draggable: false,
            resizable: false,
            buttons: {
                "Ok": function () {
                    var PrintType = 0;
                    if ($("#InvoiceSummary").is(':checked') == true) {
                        PrintType = 1;
                        GetInvoiceReport(CurrentObj, currentAirlineInvoiceSNo, objAgentOrAirline, PrintType);
                    }
                    else if ($("#InvoiceDetails").is(':checked') == true) {
                        PrintType = 2;
                        GetInvoiceReport(CurrentObj, currentAirlineInvoiceSNo, objAgentOrAirline, PrintType);
                    }
                    else if ($("#PrintWorkOrder").is(':checked') == true) {
                        PrintType = 3;
                        GetInvoiceReport(CurrentObj, currentAirlineInvoiceSNo, objAgentOrAirline, PrintType);
                    }
                    else {
                        ShowMessage('warning', 'Warning', "Kindly select Print Type.");
                    }
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                $(this).dialog("close");
            }
        });
    }

    //------------------------------------------------------------------------------------------------
    //-- Re-GenerateInvoice
    //------------------------------------------------------------------------------------------------
    if ($(obj).attr("process").toUpperCase() == "REGENERATEINVOICE" && _CURR_PRO_.toUpperCase() == "PI") {
        currentAirlineInvoiceSNo = $(obj).closest("tr").find("td[data-column='AirlineInvoiceSNo']").text();
        currentIssueType = $("#Type:checked").val();
        if (currentIssueType == '0')
            currentIssueSNo = $(obj).closest("tr").find("td[data-column='AccountSNo']").text();
        else
            currentIssueSNo = $(obj).closest("tr").find("td[data-column='AirlineSNo']").text();
        currentPeriod = $("#InvoicingCycle").val();
        $.ajax({
            url: "Services/Tariff/TariffInvoiceService.svc/ReGenerateInvoice", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentIssueSNo: currentIssueSNo, CurrentAirlineInvoiceSNo: currentAirlineInvoiceSNo, Period: currentPeriod }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success', "Invoice regenerated successfully", "bottom-right");
                    currentprocess = "PI";
                    _CURR_PRO_ = "TariffInvoice";
                    if (currentprocess.toUpperCase() == "PI".toUpperCase() & _CURR_PRO_ == "TariffInvoice") {
                        cfi.ShowIndexView("divInvoiceDetails", "Services/Tariff/TariffInvoiceService.svc/GetInvoiceGridData/" + currentprocess + "/Tariff/TariffInvoice/" + currentIssueType + "/" + currentIssueSNo + "/" + currentCityCode + "/" + currentPeriod + "/" + currentDate);
                        $("#divSummaryCreditInvoice").data("kendoWindow").close();
                    }
                }
                else
                    ShowMessage('warning', 'Warning', "Unable to save data.");
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });
    }
}

//------------------------------------------------------------------------------//
// Invoice Approval
//--------------------------------------------------------------------------------
function ApprovedInvoice() {
    $.ajax({
        url: "Services/Tariff/TariffInvoiceService.svc/ApproveInvoiceData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ CurrentAirlineInvoiceSNo: currentAirlineInvoiceSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success', "Invoice approved successfully.", "bottom-right");
                currentprocess = "PI";
                _CURR_PRO_ = "TariffInvoice";
                if (currentprocess.toUpperCase() == "PI".toUpperCase() & _CURR_PRO_ == "TariffInvoice")
                {
                    cfi.ShowIndexView("divInvoiceDetails", "Services/Tariff/TariffInvoiceService.svc/GetInvoiceGridData/" + currentprocess + "/Tariff/TariffInvoice/" + currentIssueType + "/" + currentIssueSNo + "/" + currentCityCode + "/" + currentPeriod + "/" + currentDate);
                    $("#divSummaryCreditInvoice").data("kendoWindow").close();
                }

            }
            else
                ShowMessage('warning', 'Warning - Approve Invoice', "Invoice not approved.");
        },
        error: function () {
            ShowMessage('warning', 'Warning - Approve Invoice', "Invoice not approved.");
        }
    });
}



function InitializePage(subprocess, cntrlid, isdblclick) {
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "FlightArrivalFlightInformation".toUpperCase()) {
        BindFlightInfo();
    }
    if (subprocess.toUpperCase() == "StopOverFlightInformation".toUpperCase()) {

    }
}
function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
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
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
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
}
function IsValidateDecimalNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&
        (charCode < 48 || charCode > 57))
        return false;
    return true;
}
function IsValidateNumber(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    catch (err) {

    }
}

//function PrintFCReportData(divID) {

//    var divContents = $("#" + divID).html();
//    var printWindow = window.open('', '', '');
//    printWindow.document.write(divContents);
//    printWindow.document.close();
//    printWindow.print();
//}


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    var filterEmbargo1 = cfi.getFilter("OR");
    var filterEmbargo2 = cfi.getFilter("in");


    if (textId == "Text_searchFlightNo") {
        try {
            cfi.setFilter(filterEmbargo, "DestinationAirport", "eq", userContext.CityCode)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    //add//
    if (textId == "AgentAirline" || textId == "Text_AgentAirline") {
        try {


            if ($("#InvoicingCycle").val() != '-1') {
                cfi.setFilter(filterEmbargo, "InvoicingCycle", "eq", $("#InvoicingCycle").val())
                var InvoicingCycleAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return InvoicingCycleAutoCompleteFilter;
            }
        }
        catch (exp)
        { }

    }
    //end//

    if (textId == "tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "SHCSNo", "in", ($("#tblAwbULDLocation_SPHC_" + textId.split('_')[2]).val() == "") ? "0" : $("#tblAwbULDLocation_SPHC_" + textId.split('_')[2]).val());
            cfi.setFilter(filterEmbargo, "CityCode", "eq", userContext.CityCode);
            var SPHCAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return SPHCAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "tblAwbULDLocation_MovableLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "AirportSNo", "eq", userContext.AirportSNo);
            var MovableAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return MovableAutoCompleteFilter;
        }
        catch (exp) { }
    }
}


//------------------------------------------------------------------------------//
// Instantiate Search Control for Work Order Search
//------------------------------------------------------------------------------//
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
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}

//------------------------------------------------------------------------------//
// Get Airline search page
//------------------------------------------------------------------------------//
function SearchAirline() {
    _CURR_PRO_ = "TariffInvoice";
    _CURR_OP_ = "Generate Invoice";

    $.ajax({
        url: "Services/Tariff/TariffInvoiceService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/TariffInvoice/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#Type[value='1']").prop("checked", "true");
            $("#Type[value='1']").closest("td").css("width", "220px");
            //$("#Type").prop("disabled", "true");
            //   $("#Period" ).kendoDatePicker({
            //    // defines the start view
            //    start: "year",

            //    // defines when the calendar should return date
            //    depth: "year",

            //    // display month and year in the input
            //    format: "MMMM yyyy"
            //});
            //add by surbhi//
            cfi.AutoComplete("AgentAirline", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");

            //end//

            cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleTypeAA);
            if ($("#InvoicingCycle").val() == "") {
                $("#InvoicingCycle").val(1);
                $("#Text_InvoicingCycle").val("7 Days");
            }

            //add by surbhi//
            $("input[name=Type]:radio").click(function () {
                if ($(this).attr("value") == "0") {
                    cfi.ResetAutoComplete("AgentAirline");
                    var data = GetDataSource("AgentAirline", "Account", "SNO", "Name", ["Name"], null);
                    cfi.ChangeAutoCompleteDataSource("AgentAirline", data, true, null, "Name", "contains");
                    $('span#spnAgentAirline').text('Forwarder(Agent)');
                }
                else {
                    cfi.ResetAutoComplete("AgentAirline");
                    var data = GetDataSource("AgentAirline", "Airline", "SNO", "AirlineName", ["CarrierCode", "AirlineName"], null);
                    cfi.ChangeAutoCompleteDataSource("AgentAirline", data, true, null, "CarrierCode,AirlineName", "contains");
                    $('span#spnAgentAirline').text('Airline');
                }
            });
            //end//


            SearchPendngWorkOrder();
            $("#btnSearch").bind("click", function () {
                SearchPendngWorkOrder();
            });
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
        }
    });
}

function SearchPendngWorkOrder() {
    $("#divIssueType").html('');
    $("#divInvoiceDetails").html('');
    _CURR_PRO_ = "TariffInvoice";
    var IssueType = $("#Type:checked").val();
    var IssueSNo = '0';
    CurrentAirportCode = userContext.AirportCode;
    //currentDate = $("#Period").attr("sqldatevalue");
    if ($("#Period").attr("sqldatevalue") == "") {
        ShowMessage('warning', 'Information', 'Select Period');
        return false;
    }
    if ($("#InvoicingCycle").val() == "")
    {
        ShowMessage('warning', 'Information', 'Select Invoicing Cycle');
        return false;
    }

    var Period = $("#InvoicingCycle").val();
    var AirlineAccountSNo = ($("#AgentAirline").val() == "" ? "A~A" : $("#AgentAirline").val());

    cfi.ShowIndexView("divIssueType", "Services/Tariff/TariffInvoiceService.svc/GetGridData/" + _CURR_PRO_ + "/Tariff/TariffInvoice/" + IssueType + "/" + IssueSNo + "/" + CurrentAirportCode + "/" + Period + "/" + currentDate + "/" + AirlineAccountSNo);
}
function GetInvoiceReport(obj, AirlineInvoiceSNo, objAgentOrAirline, PrintType, LogoUrl)
{
    var LogoURL = userContext.SysSetting.LogoURL;
    var str = '';
    str = LogoURL.split('..');
    var final = str[3];
    //$('#ImgLogo').attr('src', final);
    if (AirlineInvoiceSNo == "" || AirlineInvoiceSNo == "0")
        ShowMessage('warning', 'Warning - Invoice Report', "Record not found.");
    else
    {
        if (PrintType != 3)
        {
            window.open("HtmlFiles/Tariff/Invoice.html?AirlineInvoiceSNo=" + AirlineInvoiceSNo + "&ObjAgentOrAirline=" + objAgentOrAirline + "&PrintType=" + PrintType + "&CurrentSNo=" + userContext.UserSNo + "&LogoUrl=" + final);
        }
        else
        {
            //$.ajax({
            //    url: "HtmlFiles/Account/InvoiceWorkOrderPrint.html?AirlineInvoiceSNo=" + AirlineInvoiceSNo + "&UserSNo=" + userContext.UserSNo, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            //    success: function (result) {                    
            //        $("#workorderprint").html($("#printPayment", result));                   

            //        $("#workorderprint").printArea();

            //    }
            //});
            window.open("HtmlFiles/Account/InvoiceWorkOrderPrint.html?AirlineInvoiceSNo=" + AirlineInvoiceSNo + "&UserSNo=" + userContext.UserSNo + "&LogoUrl=" + final);
        }
    }

    //$("#InvoiceReportContent").printArea();
}

//------------------------------------------------------------------------------//
// Create Invoice
//------------------------------------------------------------------------------//
function FnCreateInvoice() {
    currentAirlineAccountSNo = "";
    //if ($("#divIssueType").find("table.WebFormTable").find(".k-grid-content table > tbody").find("input[type='checkbox']:checked").length == 0) {
    //    ShowMessage('warning', 'Warning - Create Invoice', "Select at least one airline.");
    //    return;
    //}

    //$("#divIssueType").find("table.WebFormTable").find(".k-grid-content table > tbody").find("input[type='checkbox']").each(function () {
    //    if ($(this).closest("tr").find("input[type='checkbox']").is(":checked")) {
    //        currentAirlineAccountSNo = (currentAirlineAccountSNo == "") ? $(this).closest("tr").find("td:eq(0)").text() : (currentAirlineAccountSNo + ',' + $(this).closest("tr").find("td:eq(0)").text());
    //    }
    //});

    // added extra
    currentAirlineAccountSNo = (currentAirlineAccountSNo == "") ? $(this).closest("tr").find("td:eq(0)").text() : (currentAirlineAccountSNo + ',' + $(this).closest("tr").find("td:eq(0)").text());

    if (currentAirlineAccountSNo != "") {
        currentprocess = "PI";
        _CURR_PRO_ = "TariffInvoice";
        if (currentprocess.toUpperCase() == "PI".toUpperCase() & _CURR_PRO_ == "TariffInvoice") {
            currentIssueType = $("#Type:checked").val();
            currentIssueSNo = currentAirlineAccountSNo;
            currentCityCode = userContext.CityCode;

            if ($("#InvoicingCycle").val() == "")
            {
                ShowMessage('warning', 'Information', 'Select Invoicing Cycle');
                return false;
            }
            currentPeriod = $("#InvoicingCycle").val();
            //currentDate = $("#Period").attr("sqldatevalue");
            cfi.ShowIndexView("divInvoiceDetails", "Services/Tariff/TariffInvoiceService.svc/GetInvoiceGridData/" + currentprocess + "/Tariff/TariffInvoice/" + currentIssueType + "/" + currentIssueSNo + "/" + currentCityCode + "/" + currentPeriod + "/" + currentDate);
        }
    }
    else {
        ShowMessage('warning', 'Warning - Create Invoice', "Invoice not created.");
    }

    //if (currentAirlineAccountSNo != "") {
    //    $.ajax({
    //        url: "Services/Tariff/TariffInvoiceService.svc/CreateInvoiceData", async: false, type: "POST", dataType: "json", cache: false,
    //        data: JSON.stringify({ CurrentIssueType: currentAirlineAccountSNo }),
    //        contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            if (result == "0") {
    //                ShowMessage('success', 'Success - Create Invoice', "Invoice created successfully.", "bottom-right");
    //            }
    //            else
    //                ShowMessage('warning', 'Warning - Create Invoice', "Invoice not created.");
    //        },
    //        error: function () {
    //            ShowMessage('warning', 'Warning - Create Invoice', "Invoice not created.");
    //        }
    //    });
    //}
    //else {
    //    ShowMessage('warning', 'Warning - Create Invoice', "Invoice not created.");
    //}
}

function checkProgress()
{
    //$("#divIssueType").find("a.k-link:contains('Select')").parent().replaceWith("<td data-field='AirlineSNo' data-title='Select' data-groupable='true' class='k-header' data-role='sortable'><input type='checkbox' id='chkSelectAll' onclick='fnSelectAll(this);' /></td>");
    ////$("#divIssueType").find("a.k-link:contains('Select')").replaceWith("<input type='checkbox' id='chkSelectAll' onclick='fnSelectAll();' />");
    //if ($("#btnCreateInvoice").length == 0)
    //    $("#btnSearch").after("&nbsp;&nbsp;&nbsp;<input type='button' id='btnCreateInvoice' value='Create Invoice' class='btn btn-block btn-info btn-sm' onclick='FnCreateInvoice()'/>");

    $("#divIssueType").find(".k-grid-content table tbody tr").closest("tr").find("td[data-column='IssueType']").each(function () {
        $(this).closest('tr').find("input[process='PROVISIONALINVOICE']").attr("class", "incompleteprocess");
    });
}

function SuccessInvoiceGrid()
{
    $("#divInvoiceDetails").find(".k-grid-content table tbody tr").each(function ()
    {
        switch ($(this).closest("tr").find("td[data-column='IsApproved']").text())
        {
            case "0":
                $(this).closest('tr').find("input[process='REGENERATEINVOICE']").attr("class", "incompleteprocess").removeAttr("disabled");
                $(this).closest('tr').find("input[process='PRINTINVOICE']").attr("class", "incompleteprocess");
                $(this).closest('tr').find("input[process='APPROVEINVOICE']").attr("class", "incompleteprocess");
                break;
            case "1":
                $(this).closest('tr').find("input[process='REGENERATEINVOICE']").attr("disabled", true).attr("class", "completeprocess").css({ "background-color": "#51a351", "color": "#fff" });
                $(this).closest('tr').find("input[process='PRINTINVOICE']").attr("class", "incompleteprocess");
                $(this).closest('tr').find("input[process='APPROVEINVOICE']").attr("class", "completeprocess").css({ "background-color": "#51a351", "color": "#fff" });
                break;
            default:
                break;
        }
    });
}

//function fnSelectAll(obj) {
//    $("#divIssueType").find("table.WebFormTable").find(".k-grid-content table > tbody").find("input[type='checkbox']").each(function () {
//        if (obj.checked) {
//            $(this).attr("checked", true);
//        }
//        else
//            $(this).removeAttr("checked");
//    });
//}

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divIssueType' style='width:100%'></div></td></tr></table></div><div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divInvoiceDetails' style='width:100%'></div></td></tr><tr><td valign='top' class='td100Padding'><div id='divSummaryCreditInvoice' style='width:100%'></div></td></tr></table></div><div id='printType'></div><div id='workorderprint' style='Display:none'></div>";