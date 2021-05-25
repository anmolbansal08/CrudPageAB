/// <reference path="../../HtmlFiles/Export/AirMailPrint.html" />
/// <reference path="../../HtmlFiles/Export/Notoc/Notoc.html" />
/// <reference path="../../HtmlFiles/Export/Notoc/Notoc.html" />
///<reference path="../../Scripts/signalRFactory.js" />

var billto = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];
var processList = [];
$(document).ready(function () {
    cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);

    //  var newDate = new Date();
    //  var processObj = { DailyFlightSNo: 0, ProcessSNo:0, ProcessOpenTime:newDate, ProcessCloseTime:newDate, ConnectionID:connection.id }
    signalR.startHub();
    //signalR.userEnterInProcess(processObj);



});

$(function () {
    signalR.getProcessList(function (completeProcessList) {
        processList = completeProcessList;
    });

    signalR.updateProcessList(function (newProcessObj) {
        // alert('Open by another user');
        processList.push(newProcessObj);
    });
});
//$(function () {
//    signalR.testConnection(function () {
//        console.log("Test Connection");
//        alert("Test Connection");
//    });
//});

function onBillToSelect(e) {
    cfi.ResetAutoComplete("BillToSNo");
    $("#Text_BillToSNo").closest('.k-widget').show();
    if ($('#BillType').val() == '0') {

        $('#spnBillToSNo').text('Agent Name');
        // Changes by Vipin Kumar
        //var data = GetDataSourceV2("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
        var data = GetDataSourceV2("BillToSNo", "FlightControl_Account");
        //Ends
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Agent.');
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
        });
    }
    else if ($('#BillType').val() == '1') {

        $('#spnBillToSNo').text('Airline Name');
        // Changes by Vipin Kumar
        //var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        var data = GetDataSourceV2("BillToSNo", "FlightControl_Airline", null);
        // Ends
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Airline.');

        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
        });
    }
}

$(function () {
    LoadFlightControl();



});

var IsNILLManifestMsgFlag;
var subprocess, subprocesssno;
var SaveProcessStatus;
var FlightRoute = "";
var IsFlightClosed = false;
var TotalAWBGrossWT = 0, TotalAWBVolumeWT = 0, TotalAWBCBMWT = 0;
var RemarkType = 0;
function GetFlightRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    $(Arr).each(function (row, tr) {
        FRoute += tr + ",";
    });
    return FRoute.substr(0, FRoute.length - 1);
}

///////////// for Partner Carrier Code ////////////////////
function GetPartnerCarrierCode(PartnerCarrierCode) {
    var Arr = PartnerCarrierCode.split(',');
    var FPartnerCarrierCode = "";
    $(Arr).each(function (row, tr) {
        FPartnerCarrierCode += tr + ",";
    });
    return FPartnerCarrierCode.substr(0, FPartnerCarrierCode.length - 1);
}

function GetFlightSortRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    $(Arr).each(function (row, tr) {
        if (row != LoginCityIndex)
            FRoute += tr + ",";
    });
    return FRoute.substr(0, FRoute.length - 1);
}

function GetFlightFilterRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    $(Arr).each(function (row, tr) {
        FRoute += tr + ",";
    });
    return FRoute.substr(0, FRoute.length - 1);
}
function GetFlightSSFilterRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    $(Arr).each(function (row, tr) {
        if (tr != userContext.AirportCode)
            FRoute += tr + ",";
    });
    return FRoute.substr(0, FRoute.length - 1);
}
function GetFlightFWDRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    $(Arr).each(function (row, tr) {
        if (row > LoginCityIndex)
            FRoute += tr + ",";
    });
    //FRoute.push({ Key: EndPoint, Text: EndPoint });
    return FRoute.substr(0, FRoute.length - 1);
}
//adding for from date and end Date

function startChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var startDate = start.value();

    if (startDate) {
        startDate = new Date(startDate);
        startDate.setDate(startDate.getDate());
        end.min(startDate);
    }
}

function endChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var endDate = end.value();

    if (endDate) {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate());
        start.max(endDate);
    }
}

//end
function LoadFlightControl() {
    _CURR_PRO_ = "FLIGHTCONTROL";
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/" + _CURR_PRO_ + "/FlightControl/FlightSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();

            $("#divAction").hide();
            PageRightsCheckFlightControl()
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault(); 
            });
            ///
            var FlightStatusType = [{ Key: "OPEN", Text: "OPEN" }, { Key: "EXCLUDENIL", Text: "EXCLUDE NIL" }, { Key: "LI", Text: "LI" }, { Key: "BUILD UP", Text: "BUILD UP" }, { Key: "PRE", Text: "PRE" }, { Key: "MAN", Text: "MAN" }, { Key: "DEP", Text: "DEP" }, { Key: "CLSD", Text: "CLOSED" }, { Key: "NIL-MAN", Text: "NIL-MAN" }, { Key: "NIL-DEP", Text: "NIL-DEP" }, { Key: "NIL-CLSD", Text: "NIL-CLSD" }];
            cfi.AutoCompleteByDataSource("searchFlightStatus", FlightStatusType);
            //adding for airline
            // Changes By Vipin Kumar
            //cfi.AutoComplete("searcheFlightsno", "FlightNo", "VDailyFlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoCompleteV2("searcheFlightsno", "FlightNo", "Flight_Control_searcheFlightsno", null, "contains");

            //cfi.AutoComplete("searchBoardingPoint", "AirportCode,AirportName", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoCompleteV2("searchBoardingPoint", "AirportCode,AirportName", "Flight_Control_searchBoardingPoint", null, "contains");
            //cfi.AutoComplete("searchEndPoint", "AirportCode,AirportName", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoCompleteV2("searchEndPoint", "AirportCode,AirportName", "Flight_Control_searchBoardingPoint", null, "contains");

            //cfi.AutoComplete("SearchAirlineCarrierCode1", "CarrierCode,AirlineName", "airline", "CarrierCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            cfi.AutoCompleteV2("SearchAirlineCarrierCode1", "CarrierCode,AirlineName", "Flight_Control_SearchAirlineCarrierCode1", null, "contains");
            // Ends
            $('#FromFlightDate').data("kendoDatePicker").value('');

            //end

            FlightSearch();
            if (userContext.SysSetting.ClientEnvironment != 'TH')   //added by ankit kumar
                $("#btnliAWBList").hide();
            $("#btnSearch").bind("click", function () {
                $("#dv_FlightManifestPrint").hide()
                CleanUI();
                /*Remove locked process when user search below is uncommented by Brajendra on 4-Nov-2017*/
                cfi.SaveUpdateLockedProcess(0, GroupFlightSNo, "", "", userContext.UserSNo, subprocesssno, subprocess, "", "");
                FlightSearch();
            });
            ////////for search with enter Key

            $("#__tblflightsearch__").keydown(function (e) {
                if (e.which == 13) {
                    CleanUI();
                    FlightSearch();
                }
            });
            ///for remove NIL border
            $("#divDetailPrint").removeAttr("style");
            ////
        }
    }
    );
}

//adding func for validating from date and to date
function ValidateDate() {
    var FromDate = $("#FromFlightdate").attr("sqldatevalue");
    var ToDate = $("#ToFlightdate").attr("sqldatevalue");
    if (FromFlightDate != '' && ToFlightDate != '') {
        if (Date.parse(FromDate) > Date.parse(ToDate)) {
            $('#FromFlightdate').data("kendoDatePicker").value("");
            $('#ToFlightDate').data("kendoDatePicker").value("");
            $("#FromFlightdate").val("");
            $("#ToFlightdate").val("");
            ShowMessage('warning', 'Warning - Flight Control', "From date should not be greater than To date.");
        }
    }
}
//end
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
    //$("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
    //    var transid = this.id.replace("divareaTrans_", "");
    //    cfi.makeTrans(transid, null, null, null, null, null, null);
    //});
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
}
function ResetAutoComplete(obj) {
    cfi.ResetAutoComplete("txtDestinationCity");
}
function AddOnChange(that) {
    if (that.sender.options.addOnChange !== null) {
        if (typeof window[that.sender.options.addOnChange] === "function")
            window[that.sender.options.addOnChange](that.sender.element.attr("id"));
    }
}
function LyingDateType(cntrlId, isSpan) {
    var isDateExist = true;

    if (isSpan == undefined || isSpan == "" || isSpan == false) {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            isDateExist = $("#" + cntrlId).val() != "";
        }
    }
    var startControl = $("#" + cntrlId).attr("startControl");
    var endControl = $("#" + cntrlId).attr("endControl");

    var widthset = $("#" + cntrlId).css("width");
    var addonchange = $("#" + cntrlId).attr("addonchange");
    if (isSpan) {
        $("span[id='" + cntrlId + "']").kendoDatePicker({
            format: "dd-MMM-yyyy",
            width: widthset,
            wrap: false
        });
    }
    else {
        $("#" + cntrlId).kendoDatePicker({
            format: "dd-MMM-yyyy",
            startControlId: (startControl == undefined ? null : startControl),
            endControlId: (endControl == undefined ? null : endControl),
            change: ((startControl != undefined && startControl == cntrlId) ? startChange : (endControl != undefined && endControl == cntrlId) ? endChange : (addonchange != undefined ? AddOnChange : null)),
            width: widthset,
            wrap: true,
            addOnChange: (addonchange != undefined ? addonchange : null)
        });
        if (!isDateExist) {
            $("#" + cntrlId).val("");
        }
    }
}
function ExtraCondition(textId) {

    //Text_txtDestinationCity
    var filterLIDestinationCity = cfi.getFilter("AND");
    var filterOSCLIDestinationCity = cfi.getFilter("AND");
    var filterDestinationCity = cfi.getFilter("AND");
    var filterOSCDestinationCity = cfi.getFilter("AND");
    var FlightOSCLyingFilter = cfi.getFilter("AND");
    var FlightLyingFilter = cfi.getFilter("AND");
    var FlightNoFilter = cfi.getFilter("AND");
    var filterAND = cfi.getFilter("AND");

    if (textId.indexOf("txtLIDestinationCity") >= 0) {
        //var filterDstCity = cfi.getFilter("AND");
        //cfi.setFilter(filterDstCity, "CityCode", "neq", userContext.AirportCode);
        //cfi.setFilter(filterDstCity, "SNo", "neq", userContext.CitySNo);
        //filterDestinationCity = cfi.autoCompleteFilter(filterDstCity);
        var filterLIDest = cfi.getFilter("AND");
        // cfi.setFilter(filterLIDest, "OriginAirportCode", "eq", userContext.AirportCode);
        cfi.setFilter(filterLIDest, "CityCode", "in", GetFlightSSFilterRoute(FlightDestination));
        cfi.setFilter(filterLIDest, "CarrierCode", "in", PartnerGroupCarrierCode);
        filterLIDestinationCity = cfi.autoCompleteFilter(filterLIDest);
        return filterLIDestinationCity;
    }
    else if (textId.indexOf("txtOSCLIDestinationCity") >= 0) {
        var filterOSCLIDest = cfi.getFilter("AND");
        //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");

        cfi.setFilter(filterOSCLIDest, "OriginAirportCode", "eq", userContext.AirportCode);
        cfi.setFilter(filterOSCLIDest, "CityCode", "notin", GetFlightFilterRoute(FlightDestination));
        cfi.setFilter(filterOSCLIDest, "CarrierCode", "in", PartnerGroupCarrierCode);
        filterOSCLIDestinationCity = cfi.autoCompleteFilter(filterOSCLIDest);

        return filterOSCLIDestinationCity;
    }
    if (textId.indexOf("txtDestinationCity") >= 0) {
        //var filterDstCity = cfi.getFilter("AND");
        //cfi.setFilter(filterDstCity, "CityCode", "neq", userContext.AirportCode);
        //cfi.setFilter(filterDstCity, "SNo", "neq", userContext.CitySNo);
        //filterDestinationCity = cfi.autoCompleteFilter(filterDstCity);
        var filterDest = cfi.getFilter("AND");
        cfi.setFilter(filterDest, "OriginAirportCode", "eq", userContext.AirportCode);
        cfi.setFilter(filterDest, "CityCode", "in", GetFlightSSFilterRoute(FlightDestination));
        cfi.setFilter(filterDest, "CarrierCode", "in", PartnerGroupCarrierCode);
        filterDestinationCity = cfi.autoCompleteFilter(filterDest);
        return filterDestinationCity;
    }
    else if (textId.indexOf("txtOSCDestinationCity") >= 0) {
        var filterOSCDest = cfi.getFilter("AND");
        //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");

        cfi.setFilter(filterOSCDest, "OriginAirportCode", "eq", userContext.AirportCode);
        cfi.setFilter(filterOSCDest, "CityCode", "notin", GetFlightFilterRoute(FlightDestination));
        cfi.setFilter(filterOSCDest, "CarrierCode", "in", PartnerGroupCarrierCode);
        filterOSCDestinationCity = cfi.autoCompleteFilter(filterOSCDest);

        return filterOSCDestinationCity;
    }
    else if (textId.indexOf("txtOSCULDNo") >= 0) {
        var FlightULDFilter = cfi.getFilter("AND");
        cfi.setFilter(FlightULDFilter, "OriginCity", "eq", userContext.AirportCode);
        cfi.setFilter(FlightULDFilter, "DestinationCity", "notin", GetFlightFilterRoute(FlightDestination));
        //cfi.setFilter(FlightULDFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
        cfi.setFilter(FlightULDFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
        FlightOSCLyingFilter = cfi.autoCompleteFilter(FlightULDFilter);
        return FlightOSCLyingFilter;
    }
    else if (textId.indexOf("txtULDNo") >= 0) {
        var FlightULDFilter = cfi.getFilter("AND");
        cfi.setFilter(FlightULDFilter, "OriginCity", "eq", userContext.AirportCode);
        cfi.setFilter(FlightULDFilter, "DestinationCity", "in", GetFlightFilterRoute(FlightDestination) + ",A~A");
        //cfi.setFilter(FlightULDFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
        cfi.setFilter(FlightULDFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
        FlightLyingFilter = cfi.autoCompleteFilter(FlightULDFilter);
        return FlightLyingFilter;
    }
    else if (textId.indexOf("FlightNo") >= 0) {
        var FlightFilter = cfi.getFilter("AND");
        var FlightORFilter = cfi.getFilter("OR");
        cfi.setFilter(FlightFilter, "OriginAirport", "eq", userContext.AirportCode);
        cfi.setFilter(FlightFilter, "DestinationAirport", "in", GetFlightFilterRoute(FlightDestination));

        //cfi.setFilter(FlightFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
        cfi.setFilter(FlightFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
        cfi.setFilter(FlightFilter, "FlightDate", "eq", cfi.CfiDate("FlightDate"));
        cfi.setFilter(FlightFilter, "SNo", "neq", $("#hdnFlightSNo").val());
        FlightNoFilter = cfi.autoCompleteFilter(FlightFilter);
        return FlightNoFilter;
    }
    // Changes by Vkumar on 17th July 2017
    else if (textId.indexOf("searcheFlightsno") >= 0) {
        var FromDateFilter = cfi.getFilter("AND");
        var ToDateFilter = cfi.getFilter("AND");
        var CarrierCodeFilter = cfi.getFilter("AND");
        var FromDate = $("#FromFlightDate").val() == "From Date" ? $("#ToFlightDate").val() : $("#FromFlightDate").val();
        cfi.setFilter(FromDateFilter, "FlightDate", "eq", FromDate);
        cfi.setFilter(ToDateFilter, "FlightDate", "eq", $("#ToFlightDate").val());
        FlightFromToDateFilter = cfi.autoCompleteFilter(FromDateFilter);
        FlightFromToDateFilter = cfi.autoCompleteFilter(ToDateFilter);
        if ($("#SearchAirlineCarrierCode1").val() != "") {
            cfi.setFilter(CarrierCodeFilter, "CarrierCode", "eq", $("#SearchAirlineCarrierCode1").val())
            FlightFromToDateFilter = cfi.autoCompleteFilter(CarrierCodeFilter);
        }
        return FlightFromToDateFilter;
    }
    else if (textId.indexOf("RegistrationNo") >= 0) {

        cfi.setFilter(filterAND, "AirCraftSNo", "eq", AirCraftSNo);
        cfi.setFilter(filterAND, "IsActive", "eq", 1);
        return cfi.autoCompleteFilter(filterAND);
    }
    //
    //////////////////for Charges /////////////////
    var filter = cfi.getFilter("AND");
    var x = textId.split('_')[2];
    if (x != undefined) {
        if (textId == 'Text_ChargeName_' + x) {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {

                if (x != i - 1) {
                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
    }
    else {
        if (textId == 'Text_ChargeName') {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {
                if (i != 0) {
                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
    }

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
//$(document).ready(function () {
//     InstantiateControl("tblSearch");
//    $("#imgprocessing").hide();
//    var todayDate = new Date();
//    $('#searchFlightDate').data("kendoDatePicker").value(todayDate);
//    var alphabettypes = [{ Key: "A~A", Text: "ALL" }, { Key: "BookingsOpen", Text: "Bookings Open" }, { Key: "BookingsClosed", Text: "Bookings Closed" }, { Key: "Pre-Manifest", Text: "Pre-Manifest" }, { Key: "Manifested", Text: "Manifested" }, { Key: "Closed", Text: "Closed" }];
//    cfi.AutoCompleteByDataSource("searchFlightStatus", alphabettypes);

//    $("#flightSearch").bind("click", function () {
//        CleanUI();
//        FlightSearch();
//    });
//});

var currentprocess = "";
var currentawbsno = 0;
var CurrentFlightSno = 0;
var GroupFlightSNo = 0;

function CleanUI() {
    $("#divDetail").html("");
    // $("#tblShipmentInfo").hide();
    // $("#divNewBooking").html("");
    //  $("#btnSave").unbind("click");
    // $("#divGraph").hide();
    //  $("#divXRAY").hide();
    $("#imgprocessing").hide();
}

function fun_GetOSCSearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });
            // Changes By Vipin Kumar
            //cfi.AutoComplete("txtOSCDestinationCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], null, "contains");
            cfi.AutoCompleteV2("txtOSCDestinationCity", "CityCode", "Flight_Control_txtOSCDestinationCity", null, "contains");
            // $("#Text_txtOSCDestinationCity").data("kendoAutoComplete").setDefaultValue(FlightFinalDestination, FlightFinalDestination);
            //cfi.ResetAutoComplete
            // Ends
            // cfi.AutoComplete("txtOSCOriginCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], ResetAutoComplete, "contains");
            // Changes By Vipin Kumar
            //cfi.AutoComplete("txtOSCULDNo", "ULDNo", "vGetLyingULDNo", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            cfi.AutoCompleteV2("txtOSCULDNo", "ULDNo", "Flight_Control_txtOSCULDNo", null, "contains");
            //Ends
            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            cfi.AutoCompleteByDataSource("txtOSCOffloadType", OffLoadType);
        }
    }
    );
}
function fun_GetSearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });
            // Changes By Vipin Kumar
            //cfi.AutoComplete("txtDestinationCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], null, "contains");
            cfi.AutoCompleteV2("txtDestinationCity", "CityCode", "Flight_Control_txtOSCDestinationCity", null, "contains");
            $("#Text_txtDestinationCity").data("kendoAutoComplete").setDefaultValue(FlightFinalDestination, FlightFinalDestination);
            //Ends
            // cfi.AutoComplete("txtOriginCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], ResetAutoComplete, "contains");
            // Changes By Vipin Kumar
            //cfi.AutoComplete("txtULDNo", "ULDNo", "vGetLyingULDNo", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            cfi.AutoCompleteV2("txtULDNo", "ULDNo", "Flight_Control_txtOSCULDNo", null, "contains");
            // Ends
            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            cfi.AutoCompleteByDataSource("txtOffloadType", OffLoadType);
        }
    }
    );
}

function fun_GetLIOSCSearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });
            cfi.AutoCompleteV2("txtOSCLIDestinationCity", "CityCode", "Flight_Control_txtOSCDestinationCity", null, "contains");
            // $("#Text_txtDestinationCity").data("kendoAutoComplete").setDefaultValue(FlightFinalDestination, FlightFinalDestination);
            // cfi.AutoComplete("txtOSCDestinationCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], null, "contains");
            // cfi.AutoComplete("txtOSCOriginCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], ResetAutoComplete, "contains");
            //  cfi.AutoComplete("txtOSCULDNo", "ULDNo", "vGetLyingULDNo", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            if (!userContext.SpecialRights.FCRCSLYING) {
                OffLoadType.push({ Key: "RCS", Text: "RCS" });//=[{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            }
            cfi.AutoCompleteByDataSource("txtOSCOffloadType", OffLoadType);
        }
    }
    );
}
function fun_GetLISearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });
            cfi.AutoCompleteV2("txtLIDestinationCity", "CityCode", "Flight_Control_txtOSCDestinationCity", null, "contains");
            $("#Text_txtLIDestinationCity").data("kendoAutoComplete").setDefaultValue(FlightFinalDestination, FlightFinalDestination);
            // $('#txtDestinationCity').val(FlightFinalDestination);
            // cfi.AutoComplete("txtDestinationCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], null, "contains");
            // cfi.AutoComplete("txtOriginCity", "CityCode", "vGetLyingDestCity", "SNo", "CityCode", ["CityCode"], ResetAutoComplete, "contains");
            // cfi.AutoComplete("txtULDNo", "ULDNo", "vGetLyingULDNo", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            // var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "RCS", Text: "RCS" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            if (!userContext.SpecialRights.FCRCSLYING) {
                OffLoadType.push({ Key: "RCS", Text: "RCS" });//=[{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            }

            cfi.AutoCompleteByDataSource("txtOffloadType", OffLoadType);
        }
    }
    );
}

function setshowmsg(ss) {
    var lenCss = 4;
    if (ss.length <= 500)
        lenCss = 4;
    else if (ss.length >= 500 && ss.length <= 750)
        lenCss = 12;
    else if (ss.length >= 750 && ss.length <= 1000)
        lenCss = 16;
    return lenCss;
}

function FlightSearch() {
    //signalR.startHub();
    //if (processList.length > 0) {

    //    processList = [];
    //    signalR.getProcessList(function (completeProcessList) {
    //        processList = completeProcessList;
    //    });

    //    signalR.updateProcessList(function (newProcessObj) {
    //        // alert('Open by another user');
    //        processList.push(newProcessObj);
    //    });


    //}
    var BoardingPoint = $("#searchBoardingPoint").val() == "" ? "0" : $("#searchBoardingPoint").val();
    //var BoardingPoint = $("#Text_searchBoardingPoint").val() == "" ? "0" : $("#Text_searchBoardingPoint").val();
    var EndPoint = $("#searchEndPoint").val() == "" ? "0" : $("#searchEndPoint").val();
    var FlightNo = $("#Text_searcheFlightsno").val() == "" ? "A~A" : $("#Text_searcheFlightsno").val();
    // var FlightDate = "0";
    //if ($("#searchFlightDate").val() != "") {
    //var FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");
    //}
    var SearchAirlineCarrierCode1 = $("#SearchAirlineCarrierCode1").val() == "" ? "A~A" : $("#SearchAirlineCarrierCode1").val();

    var FromFlightDate = cfi.CfiDate("FromFlightDate") == "" ? cfi.CfiDate("ToFlightDate") : cfi.CfiDate("FromFlightDate");

    var ToFlightDate = cfi.CfiDate("ToFlightDate") == "" ? "0" : cfi.CfiDate("ToFlightDate");


    var FlightStatus = $("#searchFlightStatus").val() == "" ? "A~A" : $("#searchFlightStatus").val();
    // var LoggedInCity = "DEL";
    if (ToFlightDate == "0") {
        ShowMessage('warning', 'Warning -Please select To flight date', " ", "bottom-right");
    }
    else {
        cfi.ShowIndexView("divFlightDetails", "Services/FlightControl/FlightControlService.svc/GetFlightGridData/FLIGHTCONTROL/FlightSearch/FlightControl/" + BoardingPoint + "/" + EndPoint + "/" + $.trim(FlightNo) + "/" + SearchAirlineCarrierCode1 + "/" + FromFlightDate + "/" + ToFlightDate + "/" + FlightStatus + "/" + userContext.AirportCode, "Scripts/maketrans.js?" + Math.random());
    }
    $("#divAction").hide();
    $("#divContentDetail").hide();
    AllOffloadRemarksDetails = [];
    POMailDetailsArray = [];
}

var currentprocess = "";
var currentawbsno = 0;
//
function fn_AddNewRow_Backup(input) {
    var TotalPlanPcs = 0;
    var trHeaderRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trHeaderRow.find("th[data-field='TotalPieces']").index();
    var TotalPlanpcsIndex = trHeaderRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trHeaderRow.find("th[data-field='hdnTotalPieces']").index();
    var ULDStockSNoIndex = trHeaderRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trHeaderRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trHeaderRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDTypeIndex = trHeaderRow.find("th[data-field='ULDType']").index();
    var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
    var CurrentAWBNo = $(input).parent().parent().find('td:eq(' + AWBNOIndex + ')').text();
    var ULDValue = $(input).parent().parent().find('td:eq(' + ULDTypeIndex + ') select').val();
    var CurrentTotalPcs = $(input).parent().parent().find('td:eq(' + hdnTotalPiecesIndex + ')').text();

    if ($(input).val() > 0) {
        $(input).parent().parent().parent().find('tr').each(function (row, tr) {
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0)
                    TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val());
            }
        });
        if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
            var trClone = $(input).parent().parent().clone();
            trClone.find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
            ///
            if (trClone.find('td:last a').length == 0) {
                trClone.find('td:last').not('a').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
            }

            var ActualG_V_CBM = $(input).parent().parent().find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
            var PG = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
            var PV = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
            var PCBM = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
            trClone.find('td:eq(' + ULDTypeIndex + ') select').val(ULDValue);
            PG.val(parseFloat((ActualG_V_CBM[0] / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(1));
            PV.val(parseFloat((ActualG_V_CBM[1] / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(2));
            PCBM.val(parseFloat((ActualG_V_CBM[2] / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            $(input).parent().parent().after(trClone);
            // fn_CalculateSplitTotalPcs(input);
            // var idinput = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');

            // fn_CalGVCBMForLI(this);
        }
        //console.log(JSON.stringify())
        fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    }
    else {

        ////  var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
        //  var row_index = $(input).closest('tr').index();
        //  // alert(row_index);
        //  var PlannedActualPcs = 0;
        //  $(input).closest('tbody').find("tr").each(function (row, tr) {
        //      if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
        //          if (row != row_index) {
        //              PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //          }
        //          // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //      }
        //  });
        //  $(input).val(CurrentTotalPcs - PlannedActualPcs);
    }
}

function fn_AddNewRow(input) {
    var TotalPlanPcs = 0;
    var trHeaderRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trHeaderRow.find("th[data-field='TotalPieces']").index();
    var TotalPlanpcsIndex = trHeaderRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trHeaderRow.find("th[data-field='hdnTotalPieces']").index();
    var ULDStockSNoIndex = trHeaderRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trHeaderRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trHeaderRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDTypeIndex = trHeaderRow.find("th[data-field='ULDType']").index();
    var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
    var CurrentAWBNo = $(input).parent().parent().find('td:eq(' + AWBNOIndex + ')').text();
    var ULDValue = $(input).parent().parent().find('td:eq(' + ULDTypeIndex + ') select').val();
    var CurrentTotalPcs = $(input).parent().parent().find('td:eq(' + hdnTotalPiecesIndex + ')').text();

    if ($(input).val() > 0) {
        $(input).parent().parent().parent().find('tr').each(function (row, tr) {
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0)
                    TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val());
            }
        });
        if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
            var trClone = $(input).parent().parent().clone();
            trClone.find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
            ///
            if (trClone.find('td:last a').length == 0) {
                trClone.find('td:last').not('a').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
            }

            var ActualG_V_CBM = $(input).parent().parent().find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
            var PG = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
            var PV = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
            var PCBM = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
            ///////change on 13-07-2016 for manage RCS Without Calculation/////////

            var PGWIndex = trHeaderRow.find("th[data-field='PGW']").index();
            var PVWIndex = trHeaderRow.find("th[data-field='PVW']").index();
            var PCBMWIndex = trHeaderRow.find("th[data-field='PCBMW']").index();
            var PGW = parseFloat(trClone.find('td:eq(' + PGWIndex + ')').text());
            var PVW = parseFloat(trClone.find('td:eq(' + PVWIndex + ')').text());
            var PCBMW = parseFloat(trClone.find('td:eq(' + PCBMWIndex + ')').text());

            //////////////////////////////

            trClone.find('td:eq(' + ULDTypeIndex + ') select').val(ULDValue);
            PG.val(parseFloat((PGW / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(1));
            PV.val(parseFloat((PVW / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(2));
            PCBM.val(parseFloat((PCBMW / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            $(input).parent().parent().after(trClone);
            // fn_CalculateSplitTotalPcs(input);
            // var idinput = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');

            // fn_CalGVCBMForLI(this);
        }
        //console.log(JSON.stringify())
        fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    }
    else {

        ////  var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
        //  var row_index = $(input).closest('tr').index();
        //  // alert(row_index);
        //  var PlannedActualPcs = 0;
        //  $(input).closest('tbody').find("tr").each(function (row, tr) {
        //      if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
        //          if (row != row_index) {
        //              PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //          }
        //          // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //      }
        //  });
        //  $(input).val(CurrentTotalPcs - PlannedActualPcs);
    }
}
function fn_RemoveRow(input) {
    var tr = $(input).closest('tr');
    var trHeaderRow = tr.closest("div.k-grid").find("div.k-grid-header");
    var TotalPlanpcsIndex = trHeaderRow.find("th[data-field='PlannedPieces']").index();
    var PlanG_V_CBMIndex = trHeaderRow.find("th[data-field='PlanG_V_CBM']").index();
    $(input).closest('tr').prev().find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val(parseInt($(input).closest('tr').prev().find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val()) + parseInt($(input).closest('tr').find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val()));
    $(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(parseFloat($(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val()) + parseFloat($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val())).toFixed(1));
    $(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(parseFloat($(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val()) + parseFloat($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val())).toFixed(2));
    $(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(parseFloat($(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val()) + parseFloat($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val())).toFixed(3));
    $(input).closest('tr').remove();

    //alert('Row Deleted')
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
var AWBListFlightSNo = 0;
var AWBListProcess = '';
var FWDGroupSNo = 0;
var IsNarrowBody = false, AirCraftSNo = 0, IsRegistrationAvailable = false, IsStopOver = false, FlightFinalDestination;
function BindEvents(input, e) {

    $("#txtATDDate").val("");
    $('#dv_FlightManifestPrint').hide();
    AWBListFlightSNo = $(input).closest('tr').find('td:eq(0)').text();
    AWBListProcess = $(input).attr('value');
    onRowChange(input);
    //  IsButtonClick = true;
    subprocess = $(input).attr("process").toUpperCase();
    //alert(subprocess); alert(FlightCloseFlag)    
    subprocesssno = $(input).attr("subprocesssno").toUpperCase();

    // $("#divAction").hide();
    $("#tdATDTime,#tdATDDate,#tdManRemarks,#tdregnNo,#tdregnNoTxt").show();
    // $('#spnRegistrationNo,#RegistrationNo').show();
    $('#SecondTab').show();
    $('#OSCTab').show();
    $("#divAction").show();
    $('#btnFlightClose').hide();
    $('#divContentDetail,#btnSave,#btnCancel').show();
    // UserSubProcessRightsFlightControl("divContentDetail", subprocesssno);
    $('#btnMoveToLying,#tdCancelLI,#tdQRTShipment').hide();
    $('#btnSaveAndClose').hide();
    $('#btn_SendNtm').css('visibility', 'hidden');
    $('#td_sendNtm').hide();
    $('#btn_OSI').hide();
    $('#tdManRemarks,#tdATDDate,#tdATDTime').hide();
    $('#btnFinalizedPreMan').hide();
    //$('#dv_FlightManifestPrint').hide();
    $('#btnCBV').hide();
    $('#tdIsExcludeFromFFM').hide();
    $('#btn_Print').hide();
    var trRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    var FlightSNoIndex = trRow.find("th[data-field='SNo']:first").index();
    var GroupFlightSNoIndex = trRow.find("th[data-field='GroupFlightSNo']").index();
    FWDGroupSNo = trRow.find("th[data-field='FWDGroupSNo']").index();
    var FlightStatusIndex = trRow.find("th[data-field='FlightStatus']").index();
    var FlightRouteIndex = trRow.find("th[data-field='FlightRoute']").index();

    IsNarrowBody = $(input).closest('tr').find("td[data-column=IsNarrowBody]").text().trim() == 'true' ? true : false;
    IsStopOver = $(input).closest('tr').find("td[data-column=IsStopOver]").text().trim() == 'true' ? true : false;
    AirCraftSNo = $(input).closest('tr').find("td[data-column=AirCraftSNo]").text().trim();
    FWDGroupSNo = $(input).closest('tr').find("td[data-column=FWDGroupSNo]").text().trim();
    IsRegistrationAvailable = $(input).closest('tr').find("td[data-column=IsRegistrationAvailable]").text().trim() == 'true' ? true : false;
    FlightRoute = GetFlightRoute(($(input).closest('tr').find("td:eq(" + FlightRouteIndex + ")").text()));
    FlightFinalDestination = $(input).closest('tr').find("td:eq(" + FlightRouteIndex + ")").text().substr($(input).closest('tr').find("td:eq(" + FlightRouteIndex + ")").text().length - 3, 3);
    $('#tdregnNoTxt').html('');
    if (IsRegistrationAvailable) {
        $('#tdregnNoTxt').append('<input type="hidden" name="RegistrationNo" id="RegistrationNo" value="" /><input type="text" class="" name="Text_RegistrationNo"  id="Text_RegistrationNo"  tabindex=1002  controltype="autocomplete"   maxlength="10" data-width="40px"  value="" placeholder="Registration No" />');
        cfi.AutoCompleteV2("RegistrationNo", "RegistrationNo", "Flight_Control_RegistrationNo", null, "contains");
        $('#Text_RegistrationNo').css('width', '70px');
        $("#Text_RegistrationNo").data("kendoAutoComplete").setDefaultValue($(input).closest('tr').find("td[data-column=RegistrationNo]").text().trim(), $(input).closest('tr').find("td[data-column=RegistrationNo]").text().trim());
    }
    else {
        $('#tdregnNoTxt').append('<input type="text" class="k-input" name="RegistrationNo" id="RegistrationNo" style="width: 80px;  text-transform: uppercase;" controltype="alphanumericupper" tabindex="8" maxlength="10" value="" placeholder="" data-role="alphabettextbox" autocomplete="off">');
        $("#RegistrationNo").val($(input).closest('tr').find("td[data-column=RegistrationNo]").text().trim());
        $('#RegistrationNo').keypress(function (e) {
            var allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (allowedChars.test(str)) {
                return true;
            }
            e.preventDefault();
            return false;
        }).keyup(function () {
            // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
            // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
            var forbiddenChars = new RegExp("[^a-zA-Z0-9\-]", 'g');
            if (forbiddenChars.test($(this).val())) {
                $(this).val($(this).val().replace(forbiddenChars, ''));
            }
        });
    }


    var IsView, IsBlocked, IsViewDEP, IsBlockedDEP;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == parseInt(subprocesssno)) {
            IsView = e.IsView;
            IsBlocked = e.IsBlocked

        }
        if (parseInt(subprocesssno) == 34) {
            if (e.SubProcessSNo == 2112) {
                IsViewDEP = e.IsView;
                IsBlockedDEP = e.IsBlocked;
            }
        }
    });




    var CurrentValue = $(input).val();
    var CurrentValue = subprocess;
    CurrentFlightSno = $(input).closest('tr').find("td:eq(" + FlightSNoIndex + ")").text();
    GroupFlightSNo = $(input).closest('tr').find("td:eq(" + GroupFlightSNoIndex + ")").text()
    ManageCTMStatus = CurrentValue == 'PER-MANIFEST' ? 'PREUPDATE' : CurrentValue;//Use for Hide and Show CTM Charges

    /********************** For SingleR Locking***************************/
    //if (CurrentValue == 'PER-MANIFEST' || CurrentValue=='MANIFEST' || CurrentValue == 'BUILD-UP') {
    //    signalR.startHub();
    //}
    /******************************END**************************************/



    /*Following is added by Brajendra for unlocked when change tab */
    //debugger;

    cfi.SaveUpdateLockedProcess(0, GroupFlightSNo, "", "", userContext.UserSNo, subprocesssno, subprocess, "", "");



    /*Following is added by Brajendra for locked process*/
    var msg = cfi.GetAWBLockedEvent(userContext.UserSNo, 0, GroupFlightSNo, "", "", "", subprocesssno);
    if (msg == "Fail") { return false; };
    cfi.SaveUpdateLockedProcess(0, GroupFlightSNo, "", "", userContext.UserSNo, subprocesssno, subprocess, 3, "");
    /*End*/

    /*End*/



    //generate COGA Code Added by akash 
    if (CurrentValue == 'GENERATECOGA') {

        var FlightNo = $(input).closest('tr').find("td[data-column=FlightNo] sapn").text().trim();
        var FlightDate = $(input).closest('tr').find("td[data-column=FlightDate]").text().trim();
        var FlightOriginSNo = $(input).closest('tr').find("td[data-column=FlightRoute] b").text().trim();

        var DestinationLength = $(input).closest('tr').find("td[data-column=FlightRoute]").text().trim().split('-').length - 1;
        var FlightDestinationSNo = $(input).closest('tr').find("td[data-column=FlightRoute]").text().trim().split('-')[DestinationLength];

        var NoOfTransaction = "1";
        var IsFlightStatus = "OA-" + $(input).closest('tr').find("td:eq(" + 0 + ")").text();
        var CreatedBy = userContext.UserSNo;
        //if ($(input).closest('tr').find("td[data-column='FlightStatus'] span").text().toUpperCase() == "DEP")
        // {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/SaveAndDownloadCustomFile", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, FlightOriginSNo: FlightOriginSNo, FlightDestinationSNo: FlightDestinationSNo, NoOfTransaction: NoOfTransaction, IsFlightStatus: IsFlightStatus, CreatedBy: CreatedBy }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);

                if (Data.Table0 != undefined && Data.Table0.length > 0) {
                    if (jQuery.parseJSON(result).Table0[0].COGACustomFile == "Message") {
                        //ShowMessage('warning', 'Warning', "COGA File is Not Generated Due To Same Flight !", "bottom-right");
                        ShowMessage('warning', 'warning - COGA', jQuery.parseJSON(result).Table1[0].COGACustomFile, "bottom-right");
                        return
                    }

                    var resData = "";
                    for (var i = 0; i < Data.Table0.length; i++) {
                        resData += Data.Table0[i].COGACustomFile + "\r\n";
                    }
                    var text = resData;

                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!

                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    var today = yyyy + dd + mm;

                    var COGAFileName = FlightNo.replace('-', '') + '_' + today + '' + ".txt";
                    download(COGAFileName, text);
                    ShowMessage('success', 'Success - COGA File', "File Downloaded Successfully !!");
                }
                else {
                    ShowMessage('warning', 'warning - COGA', 'Record Not Found !', "bottom-right");
                }
            },

        });

        // }
        // else {
        //  ShowMessage('warning', 'Warning', "COGA File is Not Generated Due To Flight is not departed Yet !", "bottom-right");
        // }
        PageRightsCheckFlightControl()
        return false;
    }
    else if (CurrentValue == 'PER-MANIFEST') {

        signalR.userEnterInProcess({ GroupFlightSNo: GroupFlightSNo, ProcessSNo: FlightCloseFlag == 'BUILD-UP' ? 30 : 33, EventType: 'OPEN' });

        if (FlightCloseFlag == 'PRE' || FlightCloseFlag == 'MAN' || FlightCloseFlag == 'BUILD-UP')
            $('#tdQRTShipment').show();

        // Changes By Vipin Kumar
        $('#btnliRemarks').hide();
        //Ends
        $('#btn_OSI').hide();
        $('#btnFlightClose').hide();
        $('#tdManRemarks,#tdATDDate,#tdATDTime').hide();
        if (FlightCloseFlag != 'BUP')
            $('#btn_Print').show();
        ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + GroupFlightSNo + "/PRE" + "/" + subprocesssno);

        $("#SecondTab").unbind("click").bind("click", function () {
            if ($("#divLyingDetail table").length === 0) {
                fn_GetLyingList('-1', GetFlightSortRoute(FlightDestination), 'MULTI');
            }
        });
        $("#OSCTab").unbind("click").bind("click", function () {
            if ($("#divOSCDetail table").length === 0) {
                fn_GetOSCLyingList('-1', FlightRoute, 'MULTI');
            }
        });

        //var ULDSNO = "-1";
        //fun_GetSearchPanel("ManifestLyingSearch", "divLyingSearch", SearchManifestLyingLst);
        //cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + GetFlightSortRoute(FlightDestination) + "/A~A/A~A");
        //fun_GetOSCSearchPanel("OSCLyingSearch", "divOSCSearch", SearchOSCLyingLst);
        //cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/OSCFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + FlightRoute + "/A~A/A~A");

        if (!IsView)
            $('#btnFinalizedPreMan').show();
        $('#btnSaveAndClose').hide();
        $('#btnFlightClose').hide();

        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Pre Manifest Details');
        $('#FirstTab').text('Pre Manifest');
        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler")
            $('#btnSave').text("Save Pre Manifest");
        else
            $('#btnSave').text("Update Pre Manifest");


        $('#btnSave').text(FlightCloseFlag == 'PRE' ? 'Update Pre Manifest' : 'Save Pre Manifest');
        if ($(input).closest('tr').find("td[data-column=IsPreManifested]").text().trim() == 'true')
            $('#btnFinalizedPreMan').text("Update Pre Manifest");

        $('#btnSave').hide();//for hide Save and Update Premanifest Button

        SaveProcessStatus = "PRE";
        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 33);
        }

        PageRightsCheckFlightControl()
        $('#OffLoadedULD').hide();
    }
    else if (CurrentValue == 'MANIFEST') {

        signalR.userEnterInProcess({ GroupFlightSNo: GroupFlightSNo, ProcessSNo: 34, EventType: 'OPEN' });
        if (FlightCloseFlag == 'PRE' || FlightCloseFlag == 'MAN' || FlightCloseFlag == 'BUILD-UP')
            $('#tdQRTShipment').show();
        // Changes By Vipin Kumar
        $('#btnliRemarks').show();
        RemarkType = 4;
        //Ends
        if ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR")
            $('#btnCBV').show();
        $('#btnFlightClose').hide();
        ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + GroupFlightSNo + "/" + FlightCloseFlag + "/" + subprocesssno);
        //if ((FlightCloseFlag == "PRE") || (FlightCloseFlag == "DEP")) {
        //    ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + $(input).closest('tr').find("td:eq(" + FlightSNoIndex + ")").text() + "/" + FlightCloseFlag);
        //    LyingListGridType = 'MULTI';
        //}
        //else {
        //    $('#btnSaveAndClose').hide();
        //    ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/FLIGHTAWB/" + $(input).closest('tr').find("td:eq(" + FlightSNoIndex + ")").text() + "/" + FlightCloseFlag);
        //    LyingListGridType = 'SINGLE';
        //}
        $("#SecondTab").unbind("click").bind("click", function () {
            if ($("#divLyingDetail table").length === 0) {
                fn_GetLyingList('-1', GetFlightSortRoute(FlightDestination), 'MULTI');
            }
        });
        $("#OSCTab").unbind("click").bind("click", function () {
            if ($("#divOSCDetail table").length === 0) {
                fn_GetOSCLyingList('-1', FlightRoute, 'MULTI');
            }
        });

        //var ULDSNO = "-1";
        //fun_GetSearchPanel("ManifestLyingSearch", "divLyingSearch", SearchManifestLyingLst);
        //cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + GetFlightSortRoute(FlightDestination) + "/A~A/A~A");
        //fun_GetOSCSearchPanel("OSCLyingSearch", "divOSCSearch", SearchOSCLyingLst);
        ////fun_GetSearchPanel("OSCLyingSearch", "divOSCSearch", SearchOSCLyingLst);
        //cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/OSCFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + FlightRoute + "/A~A/A~A");

        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Manifest Details');

        if (!IsView)
            if (!IsBlocked)
                if (!IsViewDEP)
                    if (!IsBlockedDEP)
                        $('#btnSaveAndClose').show();

        $('#btnFinalizedPreMan').hide();
        $('#btn_OSI').show();
        $('#tdManRemarks,#tdATDDate,#tdATDTime').show();
        $('#btn_Print').show();
        $('#btnSave').text("Update Manifest");
        $('#FirstTab').text('Manifest');
        SaveProcessStatus = "MAN";
        // UserSubProcessRights("divContentDetail", subprocesssno);
        if (FlightStatusFlag != "MAN") {
            $('#btnSaveAndClose').hide();//for hide on click MAN Button      

        }
        if (FlightCloseFlag == 'PRE') { $('#btnSave').text("Save Manifest"); }

        //else if (FlightCloseFlag == 'PRE') {
        $('#btn_Print').show();
        $('#tdFlightType').show();
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#tdFlightType  input[type=radio]').attr('disabled', 'disabled');
        }

        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Manifest Details');

        $('#FirstTab').text('Manifest');
        $('#btn_OSI').show();
        $('#tdManRemarks,#tdATDDate,#tdATDTime').show();
        SaveProcessStatus = "MAN";
        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 34);
        }

        PageRightsCheckFlightControl()
        //}
        $('#OffLoadedULD').hide();
    }
    else if (CurrentValue == 'LOADINGINSTRUCTION') {
        // Changes By Vipin Kumar
        $('#btnliRemarks').show();
        RemarkType = 1;
        //Ends
        //if($("#tdFlightStatus").text().toLowerCase()=="open")

        $('#btnFlightClose').hide();
        $('#btn_OSI').hide();
        $('#tdManRemarks,#tdATDDate,#tdATDTime').hide();
        $('#btn_Print').show();
        // $('#spnRegistrationNo,#RegistrationNo').hide();
        ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/FLIGHTAWB/" + GroupFlightSNo + "/LI" + "/" + subprocesssno);
        $("#SecondTab").unbind("click").bind("click", function () {
            if ($("#divLyingDetail table").length === 0) {
                fn_GetLyingList('-1', GetFlightSortRoute(FlightDestination), 'SINGLE');
            }
        });
        $("#OSCTab").unbind("click").bind("click", function () {
            if ($("#divOSCDetail table").length === 0) {
                fn_GetOSCLyingList('-1', FlightRoute, 'SINGLE');
            }
        });
        //fun_GetLISearchPanel("LILyingSearch", "divLyingSearch", SearchLyingLst);
        //SearchlyingList("A~A", "A~A", "A~A", "0", "0", "0", userContext.AirportCode, PartnerCarrierCode, GetFlightSortRoute(FlightDestination), "A~A");

        //fun_GetLIOSCSearchPanel("OSCLILyingSearch", "divOSCSearch", SearchLIOSCLyingLst);
        //SearchLIOSClyingList("A~A", "A~A", "A~A", "0", "0", "0", userContext.AirportCode, PartnerCarrierCode, FlightRoute, "A~A");

        $('#btnSaveAndClose').hide();
        $('#FirstTab').text('Loading Instruction');
        if ($(input).closest('tr').find("td:eq(" + FlightStatusIndex + ")").text().toUpperCase() == 'OPEN') {
            if (!IsView)
                $('#btnSave').text("Save Loading Instruction").show();
            $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Loading Instruction Details');
            //if (userContext.SysSetting.IsShowOffLoadedULD == "True") {
            if (userContext.SpecialRights.FCShowOffLoadedULD) {
                $('#OffLoadedULD').show();

            } else {
                $('#OffLoadedULD').hide();
            }
        }
        else {
            $('#OffLoadedULD').hide();
            $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Loading Instruction Details');
            if (!IsView)
                $('#btnSave').text("Update Loading Instruction").show();
        }
        SaveProcessStatus = "LI";//for save loading instruction
        //$('#btnSave').show();
        if (!IsView)
            $('#btnCancel').show();
        $('#btnLyingList').show();


        if (FlightCloseFlag == 'LI')
            $('#btnMoveToLying,#tdCancelLI').show();
        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 35);
        }
        PageRightsCheckFlightControl()
    }
    else if (CurrentValue == 'FLIGHTCLOSE') {
        if (IsView) {
            ShowMessage('warning', 'Warning', "User does not have the permission to close the flight. Please contact System Administrator.", "bottom-right");
        }
        else {
            if (($(input).closest('tr').find("td:eq(" + FlightStatusIndex + ")").text().toUpperCase() == 'DEP') || ($(input).closest('tr').find("td:eq(" + FlightStatusIndex + ")").text().toUpperCase() == 'CLSD')) {
                fun_FlightClose();
            }
            else {
                ShowMessage('warning', 'Warning', "Selected flight not departed,Kindly depart flight to proceed with flight close process.", "bottom-right");
            }
        }

        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 2336);
        }
        PageRightsCheckFlightControl()
    }
    else if (CurrentValue == 'ASSIGNTEAM') {
        //alert($(input).closest('tr').find("td:eq(" + FlightSNoIndex + ")").text());
        // $('#spnRegistrationNo,#RegistrationNo').hide();
        $('#btnFlightClose').hide();
        location.href = "Default.cshtml?Module=Shipment&Apps=AssignTeam&FormAction=INDEXVIEW&DailyFlightSNo=" + $(input).closest('tr').find("td:eq(" + 0 + ")").text() + "&MovementTypeSNo=2";

    }
    else if (CurrentValue == 'NOTOC') {
        // $('#btnSave').text("Save").show();
        $('#btn_Print').show();


        $('#btnFlightClose').hide();
        // $('#spnRegistrationNo,#RegistrationNo').hide();

        SaveProcessStatus = "N";
        var GroupFlightSNoNoToc = $(e.target).closest("tr").find("td[data-column='GroupFlightSNo']").text();
        if (userContext.SysSetting.ICMSEnvironment == "GA") {
            // var GroupFlightSNoNoToc = $(e.target).closest("tr").find("td[data-column='GroupFlightSNo']").text();
            $.ajax({
                url: "HtmlFiles/Export/Notoc/Notoc.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //  alert('Test')
                    $("#divDetail").html(result);
                    if (userContext.SysSetting.ICMSEnvironment == "GA") {

                        $("#tdGADGNum").show();
                        $("#tdJTDGNum").hide();
                        $("#tdloaded").show();
                        $("#tdGAULD").show();
                        $("#tdGAPOSITION").show();
                        $("#tdJTULD").hide();
                        $("#tdJTPOSITION").hide();
                        $("#tdGAPackInst").show();
                        //  $("#trGA").show();

                    }
                    else {
                        $("#tdJTDGNum").show();
                        $("#tdGADGNum").hide();
                        //$("#trGA").hide();
                        $("#tdJTULD").show();
                        $("#tdJTPOSITION").show();
                        $("#tdloaded").hide();
                        $("#tdGAULD").hide();
                        $("#tdGAPOSITION").hide()
                        $("#tdGAPackInst").hide();
                    }
                    $('#FirstTab').text('NOTOC Details');
                    $('#SecondTab').hide();
                    $('#OSCTab').hide();
                    $('#divAction').show();
                    $('#btnSave').text("Save").show();
                    $('#btn_SendNtm').css('visibility', 'visible');
                    $('#td_sendNtm').show();
                    $('textarea[id^="spnO_SuppInfo_"]').hide()

                    GetNotocData(GroupFlightSNo);

                    // completeprocess
                    //if ($('input:button').attr('class') == 'completeprocess')
                    $('textarea[id^="spnO_SuppInfo_"],#spnOtherInfo').keyup(function () {
                        $(this).val($(this).val().toUpperCase());
                    });

                    if (FlightStatusFlag.split('_')[4] == 1) {
                        $('#btn_SendNtm').css('visibility', 'hidden');
                        $('#td_sendNtm').hide();
                        $('#divDetail textarea').each(function () {
                            $(this).replaceWith("<span id=" + $(this).attr("id") + ">" + $(this).val().toUpperCase() + "</span>");
                            // $(this).attr("style","font-size: 10px; font-family: 'Arial Tahoma'; border-bottom: none; font-weight: bold; color: gray;");
                        })
                        $('#btnSave').text("Save").hide();
                        $('#btnCancel').hide();

                    }
                    else {
                        $('#btnSave').text("Save").show();
                        $('#btnCancel').show();
                    }

                    // $("#tabstrip").kendoTabStrip();
                    //$("#divDetail").show();
                },
                beforeSend: function (jqXHR, settings) {
                },
                complete: function (jqXHR, textStatus) {
                },
                error: function (xhr) {
                    // var a = "";
                }
            });

        }
        else {
            $.ajax({
                url: "HtmlFiles/NOTOC/NOTOCDG.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",

                success: function (result) {
                    $("#divDetail").html(result);
                    if (userContext.SysSetting.ICMSEnvironment == "JT") {
                        $("#tblnotoc").show();
                        $("#thnotoc").show();
                    }
                    else {
                        $("#tblnotoc").hide();
                        $("#thnotoc").hide();
                    }
                    $("#tdJTDGNum").show();
                    $("#tdGADGNum").hide();
                    //$("#trGA").hide();
                    $("#tdJTULD").show();
                    $("#tdJTPOSITION").show();
                    $("#tdloaded").hide();
                    $("#tdGAULD").hide();
                    $("#tdGAPOSITION").hide()
                    $("#tdGAPackInst").hide();

                    $('#FirstTab').text('NOTOC Details');
                    $('#SecondTab').hide();
                    $('#OSCTab').hide();
                    $('#divAction').show();
                    $('#btnSave').text("Save").show();
                    $('#btn_SendNtm').css('visibility', 'visible');
                    $('#td_sendNtm').show();
                    $('textarea[id^="spnO_SuppInfo_"]').hide()

                    GetNOTOCSPGoodsRecord(GroupFlightSNoNoToc);

                    // completeprocess
                    //if ($('input:button').attr('class') == 'completeprocess')
                    $('textarea[id^="spnO_SuppInfo_"],#spnOtherInfo').keyup(function () {
                        $(this).val($(this).val().toUpperCase());
                    });

                    if (FlightStatusFlag.split('_')[4] == 1) {
                        $('#btn_SendNtm').css('visibility', 'hidden');
                        $('#td_sendNtm').hide();
                        $('#divDetail textarea').each(function () {
                            $(this).replaceWith("<span id=" + $(this).attr("id") + ">" + $(this).val().toUpperCase() + "</span>");
                            // $(this).attr("style","font-size: 10px; font-family: 'Arial Tahoma'; border-bottom: none; font-weight: bold; color: gray;");
                        })
                        $('#btnSave').text("Save").hide();
                        $('#btnCancel').hide();

                    }
                    else {
                        $('#btnSave').text("Save").show();
                        $('#btnCancel').show();
                    }

                }
            });
        }




        $("#btnSave").unbind("click").bind("click", function () {
            //alert("Hello"); 
            var Sno = CurrentFlightSno
            var PreparedBy = userContext.UserName;
            //var SupplentaryInfo = $('#spnO_SuppInfo').val();
            var OtherInfo = $('#spnOtherInfo').val();
            var SupplentaryInfo = new Array();
            $('textarea[id^="spnO_SuppInfo"][value!=""]').each(function () {
                SupplentaryInfo.push({ ManifestSNo: $(this).closest('td').find("input[type='hidden']").val(), SupplentaryInfo: $(this).val() });
                //SupplentaryInfo.push({SupplentaryInfo: $(this).val() });
            });
            // SupplentaryInfo = SupplentaryInfo.substr(1, SupplentaryInfo.length-1)
            // alert(SupplentaryInfo);

            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/SaveNotocRecord", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ Sno: Sno, PreparedBy: PreparedBy, SupplentaryInfo: SupplentaryInfo, OtherInfo: OtherInfo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success', "NOTOC Updated Successfully", "bottom-right");
                    }
                }
            })
            GetNotocData(GroupFlightSNo);
        });
        function loadImgLogo() {
        }
        $('#spnO_SuppInfo,#spnOtherInfo').keypress(function (e) {
            var allowedChars = new RegExp("^[a-zA-Z0-9\ ]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (allowedChars.test(str)) {
                return true;
            }
            e.preventDefault();
            return false;
        }).keyup(function () {
            // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
            // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
            var forbiddenChars = new RegExp("[^a-zA-Z0-9\ ]", 'g');
            if (forbiddenChars.test($(this).val())) {
                $(this).val($(this).val().replace(forbiddenChars, ''));
            }
        });

        // UserSubProcessRightsFlightControl("divContentDetail", subprocesssno);
        $('#btnSaveAndClose').hide();
        $('#btnFinalizedPreMan').hide();
        //$('#spnPreparedBy').change(function () {
        //    //if ($("#spnPreparedBy:contains(/^[0-9a-zA-Z ]*$/)")) {
        //    //    alert("true");
        //    //} else {
        //    //    alert("false");
        //    //};
        //    //return false;
        //    var regex = /^[0-9a-zA-Z ]*$/;
        //    if (!regex.test($("#spnPreparedBy").val())) {
        //        alert("Enter only alphanumeric characters");
        //        $("#spnPreparedBy").val('')
        //        return false;
        //    } else {
        //        return true;
        //    };
        //})
        //$('#spnO_SuppInfo').change(function () {
        //    //if ($("#spnPreparedBy:contains(/^[0-9a-zA-Z ]*$/)")) {
        //    //    alert("true");
        //    //} else {
        //    //    alert("false");
        //    //};
        //    //return false;
        //    var regex = /^[0-9a-zA-Z ]*$/;
        //    if (!regex.test($("#spnO_SuppInfo").val())) {
        //        alert("Enter only alphanumeric characters");
        //        $("#spnO_SuppInfo").val('')
        //        return false;
        //    } else {
        //        return true;
        //    };
        //})
        //$('#spnOtherInfo').change(function () {
        //    //if ($("#spnPreparedBy:contains(/^[0-9a-zA-Z ]*$/)")) {
        //    //    alert("true");
        //    //} else {
        //    //    alert("false");
        //    //};
        //    //return false;
        //    var regex = /^[0-9a-zA-Z ]*$/;
        //    if (!regex.test($("#spnOtherInfo").val())) {
        //        alert("Enter only alphanumeric characters");
        //        $("#spnOtherInfo").val('')
        //        return false;
        //    } else {
        //        return true;
        //    };
        //})

        //if ($("#ordercomments:contains(/^[0-9a-zA-Z ]*$/)")) {
        //    alert("true");
        //} else {
        //    alert("false");
        //};
        //return false;

        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 2102);

        }
        PageRightsCheckFlightControl()
    }
    else if (CurrentValue == 'GATEPASS') {
        if ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR")
            $('#btnCBV').show();
        $('#btnFlightClose').hide();
        ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + $(input).closest('tr').find("td:eq(" + FlightSNoIndex + ")").text() + "/" + FlightCloseFlag + "/" + subprocesssno);

        $("#SecondTab").hide();
        $("#OSCTab").hide();

        $('#tdManRemarks,#tdATDDate,#tdATDTime,#tdEDIMSG,#tdregnNo,#tdregnNoTxt,#tdFlightType,#btnSaveAndClose').hide()
        $('#btn_Print').show();

        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Gate Pass');
        $('#btnSave').text("Save");
        $('#FirstTab').text('Gate Pass');
        $('#btn_OSI').show();
        SaveProcessStatus = "GP";
        //  UserSubProcessRightsFlightControl("divContentDetail", 2102);
        PageRightsCheckFlightControl()
    }
    else if (CurrentValue == 'AIRMAIL') {


        $('#btn_Print').show();


        $('#btnFlightClose').hide();


        // $('#spnRegistrationNo,#RegistrationNo').hide();
        SaveProcessStatus = "A";
        $.ajax({
            url: "HtmlFiles/Export/AirMailPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                //  alert('Test')
                $("#divDetail").html(result);
                $('#FirstTab').text('AirMail Details');
                $('#SecondTab').hide();
                $('#OSCTab').hide();
                $('#divAction').hide();
                fn_AirmailDetails();
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                // var a = "";
            }
        });
        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 2103);
        }
        PageRightsCheckFlightControl()

    }
    else if (CurrentValue == 'CBV') {
        $.ajax({
            url: "HtmlFiles/Export/CBVPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                //  alert('Test')
                $("#divDetail").html(result);
                fn_GetCBVData();
                $('#FirstTab').text('CBV Manifest');
                $('#SecondTab').hide();
                $('#OSCTab').hide();
                $('#divAction').hide();
                $("#btnPrint").unbind("click").bind("click", function () {
                    $("#divDetailPrint #divDetail").printArea();
                });

            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            }
        });

        if (FlightCloseFlag != "DEP" || FlightCloseFlag != "CLSD") {
            UserSubProcessRightsFlightControl("divContentDetail", 3536);
        }
        PageRightsCheckFlightControl()
    }
    else if (CurrentValue == 'CMANIFEST') {
        if (FlightStatus == 'MAN' || FlightStatus == 'NIL-MAN') {
            //$("#divDetailPop").html("");
            //$("#divDetailPop").css('display', 'none');
            $.ajax({
                url: "HtmlFiles/Export/CartManifestPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //  alert('Test')
                    $("#divDetail").html(result);

                    //$("#divDetailPop").html(result);
                    fn_GetCMainData();
                    $('#FirstTab').text('Cart Manifest');
                    $('#SecondTab').hide();
                    $('#OSCTab').hide();
                    $('#divAction').hide();

                    $("#btnPrint").unbind("click").bind("click", function () {
                        //setTimeout(function () { $("#divDetailPrint #divDetail").printArea(); }, 5000);
                        // $("#divDetailPrint #divDetail").printArea();
                        $("#btnPrint").hide();
                        printDivCart('CMANIFEST');

                    });

                },
                beforeSend: function (jqXHR, settings) {
                },
                complete: function (jqXHR, textStatus) {
                }
            });
        }
        else {
            ShowMessage('warning', 'Information!', "Cart Manifest not available as flight manifestation (MAN) is still pending", "bottom-right");
            return;
        }
        PageRightsCheckFlightControl()
    }
    else if (CurrentValue == 'FLIGHTEPOUCH') {
        // $("#tabstrip").hide()
        $('#FirstTab').text('Flight Pouch Details');
        $('#divAction').hide();
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/FLIGHTEPOUCH/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                //cfi.makeTrans("flightcontrol_flightepouchinfo", null, null, null, null, null, null, null, true);
                BindEPouch();
                $('#divAction').show();
                $('#btnSave').text("Save Flight Pouch");
                $('#btnSave').unbind().bind('click', function () {
                    if (cfi.IsValidSection('divDetail')) {
                        SaveEPouchDetails();
                        FlightSearch();
                    }
                })
                //GetManifestRemarks();
                //cfi.PopUp("__divmanifestremarks__", "Manifest Remarks");
                //$('.k-window').closest("div:hidden").remove();
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
        PageRightsCheckFlightControl()
        //ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/EPOUCH/" + GroupFlightSNo + "/" + FlightCloseFlag + "/" + subprocesssno);
    }
    //$("#ulTab").show();
    $("#tabstrip").kendoTabStrip();



    if (FlightCloseFlag == "DEP" || FlightCloseFlag == "CLSD") {

        if (FlightCloseFlag == "CLSD")

            $('#divAction').hide();
        else
            $('#divAction button').hide();
        if (CurrentValue == 'GATEPASS') {
            $('#divAction button').show();
            $('#btnSaveAndClose').hide(); $('#btnFinalizedPreMan').hide();
        }
        // $('#btnFlightClose').show();
    }
    //  e.preventDefault();
    // return false;
    $('#btnEDIMsgSend').hide();
    $('#btnEDIMSG').hide();
    IsButtonClick = false;

    if ((CurrentValue == 'OPEN') || (CurrentValue == 'MANIFEST') || (CurrentValue == 'PER-MANIFEST') || (CurrentValue == 'BUILD-UP') || (CurrentValue == 'LOADINGINSTRUCTION')) {
        $('#btnSave').attr('disabled', 'disabled');
        $('#btnSaveAndClose').attr('disabled', 'disabled');
        $('#btnSaveAndClose').hide();
        $('#btnFinalizedPreMan').attr('disabled', 'disabled');
        var FltCurrentStatus = CurrentValue == 'MANIFEST' ? 'MAN' : CurrentValue == 'PER-MANIFEST' ? 'PRE' : CurrentValue == 'BUILD-UP' ? 'BUP' : CurrentValue == 'LOADINGINSTRUCTION' ? 'LI' : CurrentValue == 'CMANIFEST' ? 'CM' : 'OPEN';
        if (FltCurrentStatus == FlightCloseFlag || FlightCloseFlag.toUpperCase() == 'OPEN') {
            $("#tdNILManifest").show();
        }
        else {
            $("#tdNILManifest").hide();
        }
    }
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && IsNILManifested == 'true') {
        $('#tdUpdateRegistrationNo').show();
    }
    else {
        $('#tdUpdateRegistrationNo').hide();
    }

    if (userContext.SysSetting.IsHideLyingListFromPRE.toLowerCase() == 'true' && CurrentValue == 'PER-MANIFEST') {
        $('#SecondTab').hide();
        $('#OSCTab').hide();
    }
    else if (userContext.SysSetting.IsHideLyingListFromMAN.toLowerCase() == 'true' && (CurrentValue == 'MANIFEST') || CurrentValue == 'CMANIFEST' || CurrentValue == 'NOTOC' || CurrentValue == 'FLIGHTEPOUCH') {
        $('#SecondTab').hide();
        $('#OSCTab').hide();
    }
    //else if (userContext.SysSetting.IsHideLyingListFromCM.toLowerCase() == 'true' && CurrentValue == 'CMANIFEST') {
    //    $('#SecondTab').hide();
    //    $('#OSCTab').hide();
    //}
    else {
        $('#SecondTab').show();
        $('#OSCTab').show();
    }

    if (userContext.SysSetting.IsExpectedLoadOnFlightControl.toLowerCase()=="true") {
        $("#btnExpectedLoad,#btnExpectedLoad").show();
    }
    else {
        $("#btnExpectedLoad,#btnExpectedLoad").hide();
    }
    

}

function ParentSuccessGrid() { }
function fun_FinalizedPreMan() {
    SaveProcessStatus = 'PRE_FINAL';
    if (IsNILManifested == "true") {
        ShowMessage('warning', 'Warning -NIL Manifest already created for this flight', " ", "bottom-right");
    }
    else {
        if (SaveManifestInfo('PRE_FINAL')) {
            FlightSearch();
        }
    }

}
//
function CleanUI() {
    $("#divDetail").html("");
    $("#divFlightDetails").html("");
    // $("#tblShipmentInfo").hide();
    // $("#divNewBooking").html("");
    //  $("#btnSave").unbind("click");
    // $("#divGraph").hide();
    //  $("#divXRAY").hide();
    $("#imgprocessing").hide();
}

var FlightCloseFlag;
var FlightStatusFlag;
//$('#divDetail').bind("click", function () {
//    if (FlightCloseFlag == "DEP")
//    {
//        alert('Test');
//        $('#divDetail input').attr('disabled', 'disabled');
//    }
//})

function CheckAll(e) {
    $("#divDetail input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));

    $("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function () {
        if ($(this).closest('td').find('input[type="hidden"]').val() != "0@0") {
            if ($(this).closest('td').find('input[type="hidden"]').val() == "false")
                $(this).prop('checked', $(e).prop("checked"));
            else
                $(this).prop('checked', 0);
        }
    });
}

function fn_HideBulkChild() {
    var vgrid = cfi.GetCFGrid("divDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;

    $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        // var IsCartIndex = Rowtr.find("th[data-field='IsCart']").index();
        var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();//for RFS Remarks
        var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();//for RFS Remarks
        var ParrentCartIdx = Rowtr.find("th[data-field='IsCart']").index();//for RFS Remarks
        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();
        var IsCartIndex = nestedGridHeader.find("th[data-field='IsCart']").index();

        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {
            ////////////Default Hide For Other Flight////////////////
            $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();

            //////////////////////////////////////////
            if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
                if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
                    $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for rfs
                }
            }
            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                $(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                if ($(trMain).find('td:eq(' + ParrentCartIdx + ')').text() == "false")
                    $(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    $(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    if ($(trChild).find("td:eq(" + IsCartIndex + ")").text() == "false")
                        $(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    //   $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                    }
                    //else
                    //  $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();// for RFS Remarks
                    if ($(trChild).find("td:eq(" + IsCartIndex + ")").text() == "true") {
                        var controlIdcart = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id");
                        cfi.AutoCompleteByDataSource(controlIdcart.replace("Text_", ""), GetFlightRouteArray());
                        $("#" + controlIdcart).data("kendoAutoComplete").setDefaultValue($("#" + controlIdcart.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlIdcart.replace("Text_", "")).val(), $("#" + controlIdcart.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlIdcart.replace("Text_", "")).val());
                        $("#" + controlIdcart).data("kendoAutoComplete").enable(false);
                    }

                });
            }
            else {
                var nestedGridHeader = $(trMain).next().find("div.k-grid-header");

                $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                var IsPreManifestIndex = nestedGridHeader.find("th[data-field='IsPreManifested']").index();
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
                            $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').show();//for RFS Remarks
                        }
                    }

                    if ($(trChild).find('td:eq(' + IsPreManifestIndex + ')').text() == "true") {
                        $(trChild).find('input[type=text],input[type=checkbox]').attr('disabled', 1);
                    }

                    var controlId = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id");
                    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
                    $("#" + controlId).data("kendoAutoComplete").setDefaultValue($("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlId.replace("Text_", "")).val(), $("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlId.replace("Text_", "")).val());

                    if (GetFlightRouteArray().length == 1)
                        $("#" + controlId).data("kendoAutoComplete").enable(false);


                    fn_CheckOffpointMendetory(controlId);

                    // cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");
                });
            }
        }
    });

    //});
    checkBoxSelected();
    $('#btnSave').removeAttr('disabled');
    $('#btnSaveAndClose').removeAttr('disabled');
    $('#btnFinalizedPreMan').removeAttr('disabled');

    if (userContext.SysSetting.IsHideLyingListFromPRE.toLowerCase() == 'true' && (FlightStatus == 'PRE' || FlightStatus == 'BUILD UP')) {
        $('#' + CurrentDivID).find('input[type="text"]').attr('disabled', 'disabled')
    }
    //else if (userContext.SysSetting.IsHideLyingListFromMAN.toLowerCase() == 'true' && FlightStatus == 'MAN') {
    //    $('#' + CurrentDivID).find('input[type="text"]').attr('disabled', 'disabled')
    //}

}

function checkBoxSelected() {
    var chkFlag = 0, chkDisabled = 0;
    $("#divDetail input:checkbox").each(function (row, tr) {
        if ($(tr).attr('id') != "chkAllBox") {
            if (!$(tr).prop('checked')) {
                chkFlag = 1;
            }
            if ($(tr).attr('disabled') == 'disabled') {
                chkDisabled = 1;
            }
        }
    })
    // alert(chkFlag)
    if (chkFlag == 0)
        $("#chkAllBox").prop('checked', 1);
    else
        $("#chkAllBox").prop('checked', 0);
    if (chkDisabled == 1)
        $("#chkAllBox").prop('disabled', 'disabled');
    else
        $("#chkAllBox").prop('disabled', '');
}

function fn_GetCTMChargeDetails(AWBSNo, CTMSNo, input, FromType) {
    // alert('AWBSNO=' + AWBSNo + '  Type=' + FromType);
    $("#divCTM").remove();
    var trHRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var AWBNoIndex = trHRow.find("th[data-field='AWBNo']").index();
    var AWBNo = $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text();
    $("#dv_FlightManifestPrint").html('<div id="divCTM" style="overflow:auto; display:none;"><table id="tblResult" class="WebFormTable"></table></div>');

    $("#tblResult").before('<B>Applied Charges<B><br/><table id="tblResult1" class="WebFormTable"></table>')

    $("#tblResult").append('<tr><td class="formlabel" style="width:10%; ">AWB No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnAWBNo">' + AWBNo + '</span></td><td class="formlabel" >Flight No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnFlightNo">' + $("#tdFlightNo").text() + '</span></td></tr>');

    $("#tblResult").append("<tr><td class='formlabel' title='Select Bill Type' ><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillType'> Bill Type</span></td><td class='formInputcolumn' style='text-align:center;'><input type='hidden' name='BillType' id='BillType' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillType' id='Text_BillType' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='' value='' data-valid='required' data-valid-msg='Bill Type can not be blank'  data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td class='formlabel' title='Select '><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillToSNo'>Bill To</span></td><td class='formInputcolumn' style='text-align:center;'><input type='hidden' name='BillToSNo' id='BillToSNo' value=''><span class='k-widget k-combobox k-header' style='display: inline-block;'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillToSNo' id='Text_BillToSNo' style='width: 100%; text-transform: uppercase;' tabindex='6' controltype='autocomplete' maxlength='' value=''  data-valid='required' data-valid-msg='Bill To can not be blank'  data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Bill To.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr>");

    $("#tblResult").after('<br/><B>CTM Charges<B><br/><table id="tblCTMCharges" class="WebFormTable"></table>')
    cfi.PopUp("divCTM", "CTM", 1200, null, null, null);
    $("#divCTM").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $('.k-window').closest("div:hidden").remove();
    $("#spnAWBNo").after("<input type='hidden' id='AWBNo' name='AWBNo' value=" + AWBSNo + " >");
    $("#spnFlightNo").after("<input type='hidden' id='FlightNo' name='FlightNo' value=" + $("#hdnFlightSNo").val() + " >");
    $("#spnFlightNo").after("<input type='hidden' id='CTMSNo' name='CTMSNo' value=" + CTMSNo + " >");
    GetAWBWeight();
    BindCTMCharges()
    if (IsCTMCharges == "False")
        $("#tblCTMCharges").after("<br/><input type='button' id='SaveCTM' value='Save' class='btn btn-success' onclick='SaveCTMCharges()'>");
}

/////////////////////////// for CTM Charge/////////////////////////////
//CTMCHARGES
var flags = 0;
var weight = 0;
var IsCTMCharges = "False";
function popup() {

    $("#divCTM").remove();
    $("#SendMessage").after('<div id="divCTM" style="overflow:auto; display:none;"><table id="tblResult" class="WebFormTable"></table></div>');
    $("#tblResult").append('<tr><td class="formlabel" style="width:10%; text-align:center;">AWB No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnAWBNo"></span></td><td class="formlabel" style="text-align:center;">Flight No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnFlightNo"></span></td><td class="formlabel" style="text-align:center;">CTM</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnCTMSNo"></span></td></tr>');

    $("#tblResult").after('<br/><B>CTM Charges<B><br/><table id="tblCTMCharges" class="WebFormTable"></table>')
    cfi.PopUp("divCTM", "CTM", 1200, null, null, null);
    $("#divCTM").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $('.k-window').closest("div:hidden").remove();
    $("#spnAWBNo").after("<input type='hidden' id='AWBNo' name='AWBNo' value >");
    $("#spnFlightNo").after("<input type='hidden' id='FlightNo' name='FlightNo' value >");
    $("#spnCTMSNo").after("<input type='hidden' id='CTMSNo' name='CTMSNo' value >");
    GetAWBWeight();
    BindCTMCharges()
    $("#tblCTMCharges").after("<br/><input type='button' id='SaveCTM' value='Save' class='btn btn-success' onclick='SaveCTMCharges()'>");
}

function GetAWBWeight() {
    var Sno = $("#AWBNo").val();
    if ($("#AWBNo").val() != '') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetAWBWeight",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Sno: Sno }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                weight = FinalData[0].Column1;
                IsCTMCharges = FinalData[0].IsCTMCharge;

            }
        });
    }

}

function BindCTMCharges() {
    _CURR_PRO_ = "ESS";
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblCTMCharges").html(result);

            $("#tblCTMCharges").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            var AWBSNo = $("#AWBNo").val();
            var FlightSNo = $("#FlightNo").val();
            var CTMSNo = $("#CTMSNo").val();
            var CityCode = userContext.CityCode;

            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCTMSMendatoryCharges?AWBSNo=" + AWBSNo + "&FlightSNo=" + FlightSNo + "&CTMSNo=" + CTMSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                //   data: JSON.stringify({ AWBSNo: AWBSNo, FlightSNo: FlightSNo, CTMSNo: CTMSNo, CityCode: CityCode, ProcessSNo: 6, SubProcessSNo: 34, ArrivedShipmentSNo: '0', RateType: '0', GrWt: '0', ChWt: '0', Pieces: '0' }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;

                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (resData != []) {
                        $(resData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.pbasis == undefined ? '' : i.pbasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.sbasis == undefined ? '' : i.sbasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, "") });
                                //totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount);
                            }
                        });
                    }

                    cfi.makeTrans("tariff_tariffdohandlingcharge", null, null, BindCTMChargesItemAutoComplete, ReBindCTMChargesItemAutoComplete, null, MendatoryHandlingCharges);

                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            if ((MendatoryHandlingCharges[i].sbasis == undefined || MendatoryHandlingCharges[i].sbasis == "") && (MendatoryHandlingCharges[i].svalue == "" || MendatoryHandlingCharges[i].svalue == undefined || MendatoryHandlingCharges[i].svalue == "0.00")) {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "none");
                                $(this).find("input[id^='PValue']").focus();
                                $(this).find("input[id^='PValue']").blur();
                            }
                            else {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                                $(this).find("input[id^='SValue']").focus();
                                $(this).find("input[id^='SValue']").blur();
                            }
                            $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                            $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                            $(this).find("input[id^='Text_ChargeName']").attr('disabled', 'disabled');

                            $(this).find("div[id^=transActionDiv").hide();
                            $(this).find("input[id^='SValue']").focus();
                            $(this).find("input[id^='SValue']").blur();

                        });
                    }
                    else {
                        $("#tblCTMCharges").parent().parent().hide();
                        $("#tblResult").hide();
                    }
                    $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                    $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                    $("input[id^='PValue']").closest("td").find("input").attr('disabled', 'disabled');
                    $("input[id^='SValue']").closest("td").find("input").attr('disabled', 'disabled');

                    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
                        });


                        $(this).find("input[id^='PValue']").each(function () {
                            var currentID = $(this)[0].id;
                            $('#' + currentID).on("keypress", function (event) {
                                var charCode = (event.which) ? event.which : event.keyCode;
                                if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                    return false;

                                if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                    event.preventDefault();
                                }
                                return true;
                            });
                        });

                        $(this).find("input[id^='SValue']").each(function () {
                            var currentID = $(this)[0].id;
                            $('#' + currentID).on("keypress", function (event) {
                                var charCode = (event.which) ? event.which : event.keyCode;
                                if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                    return false;

                                if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                    event.preventDefault();
                                }
                                return true;
                            });
                        });

                        $('#spnWaveOff').hide();
                        $("#spnRemarks").closest('td').next().next().hide()
                        $(this).find("input[id^='WaveOff']").hide();

                        //$(this).find("input[id^='Text_ChargeName']").attr('disabled', 'disabled')

                    });

                    cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);
                    // Changes by Vipin Kumar
                    //cfi.AutoComplete("BillToSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
                    cfi.AutoCompleteV2("BillToSNo", "Name", "Flight_Control_BillToSNo", null, "contains");
                    // Ends
                },
                error: function (xhr) {
                    var a = "";
                }
            });

            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCTMSMendatoryChargesForFC?AWBSNo=" + AWBSNo + "&FlightSNo=" + FlightSNo + "&CTMSNo=" + CTMSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        $('#tblResult1').append('<tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AIRLINE/AGENT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr>');

                        for (var i = 0; i < resData.length; i++) {
                            $('#tblResult1').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;">' +
                                resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + " " + userContext.CurrencyCode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRFSHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
                        }
                        // $("#tblResult").append
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });
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

function PrintRFSHandlingDetails(SNo, InvoiceType) {
    if (InvoiceType == 0)
        window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + SNo + "&InvoiceType=" + InvoiceType);
    else
        window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo);
}
function AutoCompleteForCTMCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForCTMCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo);
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
}

var dourl = 'Services/AutoCompleteService.svc/CTMAutoCompleteDataSource';
function GetDataSourceForCTMCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourl : serviceurl + newUrl),
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
                    cityChangeFlag: cityChangeFlag,
                    FlightSNo: FlightSNo,
                    CTMSNo: CTMSNo,
                    ProcessSNo: ProcessSNo,
                    SubProcessSNo: SubProcessSNo
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

function BindCTMChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
    });

    if (flags == 1) {
        $(elem).find("input[id^='PaymentMode']").each(function () {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
            $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
        });
    }
    else {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
            $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 0;
        });
    }
    $('#spnWaveOff').hide();
    $("#spnRemarks").closest('td').next().next().hide()
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='WaveOff']").hide();
}

function ReBindCTMChargesItemAutoComplete(elem, mainElem) {
    //$(elem).find("input[id^='ChargeName']").each(function () {
    //    AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
    //});


    //if (flags == 1) {
    //    $(elem).find("input[id^='PaymentMode']").each(function () {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
    //        $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
    //    });
    //}
    //else {
    //    $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //        $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //        flags = 0;
    //    });
    //}


    $(elem).find("input[id^='SBasis']").each(function (i, row) {
        if ($(elem).find("span[id^='SBasis']").text() == '') {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
        }
        else {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
        }
        $(elem).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
    });
    $('#spnWaveOff').hide();
    $("#spnRemarks").closest('td').next().next().hide()
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='WaveOff']").hide();
}

var pValue = 0;
var sValue = 0;
var type = 'AWB';
function GatCTMValueOfAutocomplete(valueId, value, keyId, key) {
    pValue = 0;
    sValue = 0;
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            if ($("input[id^='Text_HAWB']").length > 0) {
                var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
            }
            else
                var hawbSNo = 0;
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CTMGetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(($("#AWBNo").val() == '' ? 0 : $("#AWBNo").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + 2 + "&RateType=" + parseInt(0) + "&Remarks=" + type + "&FlightSNo=" + parseInt($("#FlightNo").val() == '' ? 0 : $("#FlightNo").val()) + "&CTMSNo=" + parseInt($("#CTMSNo").val() == '' ? 0 : $("#CTMSNo").val()) + "&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                            }
                            else {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").text(doItem.SecondaryBasis);
                            }
                            $("input[id='Rate']").closest("td").find("input").css("display", "none");

                            $("span[id='Amount']").text(doItem.ChargeAmount);
                            $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id='Remarks']").text(doItem.ChargeRemarks);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(weight);
                            }
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                            }
                            else {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            }
                            $("input[id='Rate_" + rowId + "']").closest("td").find("input").css("display", "none");
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").focus();
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(weight);
                            }
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                        if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                            $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                        }
                    });
                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").text("");
                $("span[id^='Amount_" + rowId + "']").text("");
                $("span[id^='TotalTaxAmount" + rowId + "']").text("");
                $("span[id^='TotalAmount_" + rowId + "']").text("");
                $("span[id^='Remarks" + rowId + "']").text("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function GetChargeValue(obj) {


    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? ($("#" + obj.id.replace("PValue", "SValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("PValue", "SValue")).val()) : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("SValue", "PValue")).val() != "" ? ($("#" + obj.id.replace("SValue", "PValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("SValue", "PValue")).val()) : 0;
    }

    if (tariffSNo == "" || tariffSNo == undefined) {
        alert("Please select Charges.");
    }
    else {
        totalHandlingCharges = 0;
        totalAmountDO = 0;
        //var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
        var hawbSNo = 0;
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CTMGetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(($("#AWBNo").val() == '' ? 0 : $("#AWBNo").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + parseInt(2) + "&RateType=" + parseInt(0) + "&Remarks=" + 'AWB' + "&DOSNo=" + parseInt($("#FlightNo").val() == '' ? 0 : $("#FlightNo").val()) + "&PDSNo=" + parseInt($("#CTMSNo").val() == '' ? 0 : $("#CTMSNo").val()) + "&ProcessSNo=" + 6 + "&SubProcessSNo=" + 34,
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").text(doItem.SecondryBasis);
                        $("span[id='Amount']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                    }
                }
                $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());




                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }
    // CheckCreditLimitMode(obj)
}

//function ExtraCondition(textId) {
//    var filter = cfi.getFilter("AND");
//    var x = textId.split('_')[2];
//    if (x != undefined) {
//        if (textId == 'Text_ChargeName_' + x) {
//            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {

//                if (x != i - 1) {
//                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
//                }
//            });
//            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
//            return ChargeAutoCompleteFilter;
//        }
//    }
//    else {
//        if (textId == 'Text_ChargeName') {
//            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {
//                if (i != 0) {
//                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
//                }
//            });
//            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
//            return ChargeAutoCompleteFilter;
//        }
//    }

//}

function CheckCreditLimit(obj) {
    if ($("#Text_BillType").val() != 'Airline') {
        var total = 0;
        var value = ($("#" + obj.id + ":checked").attr('data-radioval') == 'CREDIT' ? 1 : 0);
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            if ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT')
                total = parseFloat(total) + parseFloat($(this).find("span[id^='Amount']").text());
        });
        //var total = $("#" + obj.id).closest('td').prev().prev().text();
        var BillToSNo = $("#BillToSNo").val();
        if (value == 1) {
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    FinalData = dataTableobj.Table0;
                    if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT') {
                                $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                            }
                            flags = 1;
                        });
                        if (FinalData[0].Column2 != '')
                            ShowMessage('warning', '', FinalData[0].Column2);
                    }
                    else {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(obj).closest('tr').index() == (i + 1)) {
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                                flags = 0;
                            }
                        });
                    }
                }
            });
        }
    }
}

function CheckCreditLimitMode(obj) {
    //$("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
    //    $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //    $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //});
    $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
    $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
}

function CheckCreditBillToSNo(a, b, c, d) {
    var total = 0;
    var BillToSNo = $("#BillToSNo").val();
    if ($("#BillType").val() != 1) {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    ShowMessage('warning', '', FinalData[0].Column2);
                }
                else {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                        flags = 0;
                    });
                }
            }
        });
    }
    else {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
    //CheckWalkIn();
}

function SaveCTMCharges() {
    cfi.ValidateSection("divCTM");
    if (!cfi.IsValidSection($("#divCTM"))) {
        return false;
    }
    if ($("#Text_BillType").val() == "") {
        ShowMessage('warning', 'CTM Charges', 'Select Bill Type');
        return false;
    }
    if ($("#Text_BillToSNo").val() == "") {
        ShowMessage('warning', 'CTM Charges', 'Select Bill To');
        return false;
    }
    var CTMChargeArray = [];
    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var CTMChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: $('#AWBNo').val(),
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Amount']").text(),
                Min: 1,
                Mode: $(this).find('input:radio[id="PaymentMode"]:checked').attr("data-radioval"),
                ChargeTo: $('#BillType').val(),
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : $(this).find("[id^='Remarks']")[1].innerText.toUpperCase(),
                WaveoffRemarks: ''
            };
            CTMChargeArray.push(CTMChargeViewModel);

        }

    });

    var obj = {
        MomvementType: 2,
        Type: 'AWB',
        TypeValue: $('#AWBNo').val(),
        BillTo: $('#BillToSNo').val(),
        FlightNo: $('#FlightNo').val(),
        CTMSNo: $('#CTMSNo').val(),
        Process: 6,
        SubProcessSNo: 34,
        LstCTMCharges: CTMChargeArray
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateCTMCharges",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != '' || data != '1') {
                ShowMessage('success', 'Success - CTM Charges', 'CTM Charge Applied Successfully for Invoice ' + data);
                //$("input[name='operation']").prop('type', 'button');
                //navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=INDEXVIEW');
                $("#divCTM").data("kendoWindow").close();
            } else {
                ShowMessage('warning', 'Warning - CTM Charges', "Record Not Saved Please Try Again ", "bottom-right");
            }

        }
    });
}


////////////////////////////end/////////////////////////////////////////

var ManageCTMStatus;
function fnHideBulk() {
    var vgrid = cfi.GetCFGrid("divLyingDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;
    $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();

        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
        var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();
        var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {

            ////////////Default Hide For Other Flight////////////////
            $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();

            //////////////////////////////////////////
            if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
                if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
                    $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for RFS Remarks
                }

            }

            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                $(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    $(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    $(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP")
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();


                });
            }
            else {
                if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                    $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                    $(nestedGridHeader).find("th:eq(0)").hide();
                }

                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {

                    var AWBSectorIndex1 = $(nestedGridHeader).find("th[data-field='AWBSector']").index();
                    var FlightNextDestination
                        // Add BY Sushant : On 2020-05-16 Desc : If Flight is multisector  then below condition should be applied ..
                        if (FlightDestination.length > 3) {
                            var str1 = FlightDestination;
                            var AwbFound = $(trChild).find('td:eq(' + AWBSectorIndex1 + ')').text().split('-')[1];
                            if (str1.indexOf(AwbFound) != -1) {
                                FlightNextDestination = AwbFound;
                            } else {
                                FlightNextDestination = "";
                            }
                        }

                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                        $(trChild).find('td:eq(0)').hide();
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
                            $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').show()//for RFS Remarks
                        }
                    }
                    var controlId = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id");

                    if (FlightNextDestination != "") {
                        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), "");
                        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(FlightNextDestination, FlightNextDestination);
                        // if (GetFlightRouteArray().length == 1)
                        $("#" + controlId).data("kendoAutoComplete").enable(false);
                        fn_CheckOffpointMendetory(controlId);
                    } else {
                        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), "");
                        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(FlightNextDestination, FlightNextDestination);
                        // if (GetFlightRouteArray().length == 1)
                        $("#" + controlId).data("kendoAutoComplete").enable(true);

                    }
                    //fn_CheckOffpointMendetory(controlId);

                });
            }
        }
    });

}
function fnOSCHideBulk() {
    var vgrid = cfi.GetCFGrid("divOSCDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;
    $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();
        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();


        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {
            ////////////Default Hide For Other Flight////////////////
            $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();


            // var grid = $(nestedGridHeader).closest('div[data-role="grid"]').find(".k-grid:eq(0)").data("kendoGrid");
            // grid.hideColumn("RFSRemarks");
            // $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

            //////////////////////////////////////////
            if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
                if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
                    $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for RFS Remarks
                }
            }

            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                $(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    $(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    $(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP")
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();


                });
            }
            else {
                if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                    $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                    $(nestedGridHeader).find("th:eq(0)").hide();
                }
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                        $(trChild).find('td:eq(0)').hide();
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
                            $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').show();//for RFS Remarks
                        }
                    }
                    var controlId = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id");
                    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
                    $("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
                    if (GetFlightRouteArray().length == 1)
                        $("#" + controlId).data("kendoAutoComplete").enable(false);

                    fn_CheckOffpointMendetory(controlId);


                });
            }
        }
    });


}

function GetFlightRouteArray() {
    var Arr = FlightDestination.split('-');
    var FRoute = new Array();

    var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    $(Arr).each(function (row, tr) {
        if (row > LoginCityIndex)
            FRoute.push({ Key: tr, Text: tr })
    });
    //FRoute.push({ Key: EndPoint, Text: EndPoint });
    return FRoute;
}
/////////////////////////////////for check OffPointMendetory//////////////////
function fn_CheckOffpointMendetory(controlId) {
    $("#" + controlId).unbind().bind("blur", function () {
        var selectedOffPoint = $(this).val();
        var result = GetFlightRouteArray().find(function (item, i) {
            return item.Key === selectedOffPoint.toUpperCase() ? true : false;
        });

        if (!result) {
            ShowMessage('warning', 'Warning ', "Entered Off-Point must be part of Flight Route", "bottom-right");
            $("#" + controlId).data("kendoAutoComplete").setDefaultValue($("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlId.replace("Text_", "")).val(), $("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlId.replace("Text_", "")).val());
        }

    });
}
////////////////////end////////////////////////


function DisableFlight() {
    //alert
    //debugger
    var IsView, IsBlocked, IsBlockedDEP, IsViewDEP;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subprocesssno) {
            IsView = e.IsView;
            IsBlocked = e.IsBlocked;
        }
        if (subprocesssno == 34) {
            if (e.SubProcessSNo == 2112) {
                IsViewDEP = e.IsView;
                IsBlockedDEP = e.IsBlocked;
            }
        }
    });
    var IsBulkAvailable = false;



    $("#divDetail .WebFormTable2 tbody tr:nth-child(3) td:first div:first div.k-grid-content").css({ "max-height": "300px", "overflow": "auto" });

    if (FlightCloseFlag == "DEP") {
        $('#divDetail input').attr('disabled', 'disabled');
        $('#btnPrint').removeAttr('disabled');
    }

    if (FlightCloseFlag == "PRE") {
        $('#btnSaveAndClose').hide();
    }


    /*---------Change by Pankaj Kumar Ishwar--------*/
    else if (ManageCTMStatus == "MANIFEST") {
        if (FlightCloseFlag == "DEP")
            $('#btnSaveAndClose').hide();
        else
            if (IsView) {
                $('#btnSaveAndClose').hide();
            }
            else {
                if (!IsBlockedDEP)
                    $('#btnSaveAndClose').show();
            }
    }

    var BULKIndex = -1;
    var Rth = $("#divDetail  div.k-grid-header:first  div  table  thead  tr  th[data-field!='isSelect']:nth-child(1)");
    Rth.html("<input type='checkbox' id='chkAllBox' onchange='return CheckAll(this);' >");
    $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
        var LastPointIndex = Rowtr.find("th[data-field='LastPoint']").index();
        if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
            IsBulkAvailable = true;
            BULKIndex = $(trMain).index();
            var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
            $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
            var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
            var IsPreManifestIndex = nestedGridHeader.find("th[data-field='IsPreManifested']").index();
            $(nestedGridContent).each(function (rowChild, trChild) {
                if ($(trChild).find('td:eq(' + IsPreManifestIndex + ')').text() == "true") {
                    $(trChild).find('input[type=text],input[type=checkbox]').attr('disabled', 1);
                    // $(trChild).find('a[class="removed label label-danger"').removeAttr('onclick');
                }

            });



        }
        else {
            $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
                var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
                var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
                // $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-minus"]').trigger("click");
                if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {

                    var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
                    $(nestedGridHeader).find("th:eq(1)").hide();

                    var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                    $(nestedGridContent).each(function (rowChild, trChild) {
                        $(trChild).find('td:eq(1)').hide();
                    });
                }
            });

            if ($(trMain).find('td:eq(' + IsDisabledULDIndex + ')').text() == "true") {
                $(trMain).find('input[type=text],input[type=checkbox]').attr('disabled', 1);
                // $(trChild).find('a[class="removed label label-danger"').removeAttr('onclick');
            }
            // IsDisabledULDIndex
        }
        //var RFSRemarksIndex = Rowtr.find("th[data-field='RFSRemarks']").index();
        var controlId = $(trMain).find("input[type='text'][controltype='autocomplete']").attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
        $("#" + controlId).data("kendoAutoComplete").setDefaultValue($("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlId.replace("Text_", "")).val(), $("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlId.replace("Text_", "")).val());
        //Following is commented By Brajendra
        if (GetFlightRouteArray().length == 1)
            $("#" + controlId).data("kendoAutoComplete").enable(false);

        fn_CheckOffpointMendetory(controlId);



        // cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null,null , "contains");
    });
    ////for RFS Remarks
    var grid = $("#divDetail").find(".k-grid:eq(0)").data("kendoGrid");
    grid.hideColumn("RFSRemarks");
    $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

    //  Rowtr.find("th[data-field='RFSRemarks']").hide();
    // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').hide();
    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
            grid.showColumn("RFSRemarks");
            $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").show();
            // Rowtr.find("th[data-field='RFSRemarks']").show();
            // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').show();
        }
    }
    /////end

    //    $("#chkAllBox").prop('disabled', 'disabled');
    checkBoxSelected();

    if (!IsBulkAvailable) {
        $('#btnSave').removeAttr('disabled');
        $('#btnSaveAndClose').removeAttr('disabled');
        $('#btnFinalizedPreMan').removeAttr('disabled');

    }


}

function AddScroll() {
    $("#divLyingDetail .WebFormTable2 tbody tr:nth-child(3) td:first div:first div.k-grid-content").css({ "max-height": "300px", "overflow": "auto" });
    $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var RFSRemarksIndex = Rowtr.find("th[data-field='RFSRemarks']").index();

        //if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
        //    var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        //    $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
        //}

        var controlId = $(trMain).find("input[type='text'][controltype='autocomplete']").attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
        if (GetFlightRouteArray().length == 1)
            $("#" + controlId).data("kendoAutoComplete").enable(false);

        fn_CheckOffpointMendetory(controlId);

    });
    ////for RFS Remarks
    var grid = $("#divLyingDetail").find(".k-grid:eq(0)").data("kendoGrid");
    grid.hideColumn("RFSRemarks");
    $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

    // Rowtr.find("th[data-field='RFSRemarks']").hide();
    // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').hide();
    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
            grid.showColumn("RFSRemarks");
            $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").show();
            // Rowtr.find("th[data-field='RFSRemarks']").show();
            // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').show();
        }
    }
    /////end
}
function OSCSuccessGrid() {
    $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var RFSRemarksIndex = Rowtr.find("th[data-field='RFSRemarks']").index();

        //if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
        //    var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        //    $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
        //}

        ////for RFS Remarks
        // Rowtr.find("th[data-field='RFSRemarks']").hide();
        // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').hide();

        /////end
        var controlId = $(trMain).find("input[type='text'][controltype='autocomplete']").attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
        if (GetFlightRouteArray().length == 1)
            $("#" + controlId).data("kendoAutoComplete").enable(false);

        fn_CheckOffpointMendetory(controlId);
    });
    var grid = $("#divOSCDetail").find(".k-grid:eq(0)").data("kendoGrid");
    grid.hideColumn("RFSRemarks");
    $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
        if (IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
            grid.showColumn("RFSRemarks");
            $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").show();
            // Rowtr.find("th[data-field='RFSRemarks']").show();
            // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').show();
        }
    }

}

ShowIndexView = function (divId, serviceUrl, jscriptUrl) {
    $.ajax({
        url: serviceUrl, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //if (jscriptUrl != undefined && jscriptUrl != "") {
            //    ngen.loadjscssfile(jscriptUrl, "js");
            //}
            $("#" + divId).html(result);
        },

        error: function (jqXHR, textStatus) {
        }
    });
}
var ATDTime;
var FlightOrigin, FlightDestination, FlightStatus, IsNILManifested, IsRFS, IsBuildup, IsPreManifested, IsRFSFlightsEdit, IsPAX, PartnerCarrierCode, PartnerGroupCarrierCode, IsCargoTransfered, EndPoint;
var IsButtonClick = false;
function onRowChange(input) {
    var trHeaderRow;
    var trContentRow;
    //$('#dv_FlightManifestPrint').hide();
    $("#tdCancelLI").hide();
    //trHeaderRow = this.select().closest("div.k-grid").find("div.k-grid-header");
    //trContentRow = this.select();
    trHeaderRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header")
    trContentRow = $(input).closest('tr').select();
    var FlightSNoIndex = 0;
    //debugger;
    var FlightGroupSNoIndex = trHeaderRow.find("th[data-field='GroupFlightSNo']").index();
    var FlightNoIndex = trHeaderRow.find("th[data-field='FlightNo']").index();
    var FlightDateIndex = trHeaderRow.find("th[data-field='FlightDate']").index();
    var FlightRouteIndex = trHeaderRow.find("th[data-field='FlightRoute']").index();
    var BoardingPointIndex = trHeaderRow.find("th[data-field='BoardingPoint']").index();
    var ETDIndex = trHeaderRow.find("th[data-field='ETD']").index();
    var ATDIndex = trHeaderRow.find("th[data-field='ATD']").index();
    var ATDGMTIndex = trHeaderRow.find("th[data-field='ATDGMT']").index();
    var EndPointIndex = trHeaderRow.find("th[data-field='EndPoint']").index();
    var ACTypeIndex = trHeaderRow.find("th[data-field='ACType']").index();
    var FlightStatusIndex = trHeaderRow.find("th[data-field='FlightStatus']").index();
    var ProcessStatusInx = trHeaderRow.find("th[data-field='ProcessStatus']").index();
    var IsStackInx = trHeaderRow.find("th[data-field='IsStack']").index();
    var IsNILManifestedInx = trHeaderRow.find("th[data-field='IsNILManifested']").index();
    var IsCargoTransferedInx = trHeaderRow.find("th[data-field='IsCargoTransfered']").index();
    var IsRFSInx = trHeaderRow.find("th[data-field='IsRFS']").index();
    var IsRFSFlightsEditIndex = trHeaderRow.find("th[data-field='IsRFSFlightsEdit']").index();
    var IsBuildupInx = trHeaderRow.find("th[data-field='IsBuildup']").index();
    var IsPreManifestedInx = trHeaderRow.find("th[data-field='IsPreManifested']").index();
    var IsFlightClosedInx = trHeaderRow.find("th[data-field='IsFlightClosed']").index();
    var IsStopOverInx = trHeaderRow.find("th[data-field='IsStopOver']").index();
    var IsPAXInx = trHeaderRow.find("th[data-field='IsPAX']").index();
    var IsUWSInx = trHeaderRow.find("th[data-field='IsUWS']").index();
    var RegistrationNoInx = trHeaderRow.find("th[data-field='RegistrationNo']").index();
    var PartnerCarrierCodeInx = trHeaderRow.find("th[data-field='PartnerAirline']").index();
    var EndPointIndex = trHeaderRow.find("th[data-field='EndPoint']").index();

    ATDTime = trContentRow.find("td:eq(" + ETDIndex + ")").text();
    IsFlightClosed = trContentRow.find("td:eq(" + IsFlightClosedInx + ")").text() == "true" ? true : false;
    $("#RegistrationNo").val(trContentRow.find("td:eq(" + RegistrationNoInx + ")").text());

    $("#hdnFlightSNo").val(trContentRow.find("td:eq(" + FlightSNoIndex + ")").text());
    $("#tdFlightNo").text(trContentRow.find("td:eq(" + FlightNoIndex + ")").text());
    $("#tdFlightDate").text(trContentRow.find("td:eq(" + FlightDateIndex + ")").text());
    $("#tdBoardingPoint").text(trContentRow.find("td:eq(" + BoardingPointIndex + ")").text());
    $("#tdEndPoint").text(trContentRow.find("td:eq(" + EndPointIndex + ")").text());
    $("#tdFlightRoute").text(trContentRow.find("td:eq(" + FlightRouteIndex + ")").text());
    $("#tdAircraftType").text(trContentRow.find("td:eq(" + ACTypeIndex + ")").text());
    $("#tdFlightStatus").text(trContentRow.find("td:eq(" + FlightStatusIndex + ")").text());
    IsNILManifested = trContentRow.find("td:eq(" + IsNILManifestedInx + ")").text();

    IsCargoTransfered = trContentRow.find("td:eq(" + IsCargoTransferedInx + ")").text() == "true" ? true : false;
    IsRFS = trContentRow.find("td:eq(" + IsRFSInx + ")").text() == "true" ? true : false;
    IsBuildup = trContentRow.find("td:eq(" + IsBuildupInx + ")").text() == "true" ? true : false;
    IsPreManifested = trContentRow.find("td:eq(" + IsPreManifestedInx + ")").text() == "true" ? true : false;
    IsRFSFlightsEdit = trContentRow.find("td:eq(" + IsRFSFlightsEditIndex + ")").text() == "true" ? true : false;
    IsPAX = trContentRow.find("td:eq(" + IsPAXInx + ")").text() == "true" ? true : false;
    IsUWS = trContentRow.find("td:eq(" + IsUWSInx + ")").text() == "true" ? true : false;
    FlightStatus = trContentRow.find("td:eq(" + FlightStatusIndex + ")").text();
    FlightOrigin = trContentRow.find("td:eq(" + BoardingPointIndex + ")").text();
    FlightDestination = trContentRow.find("td:eq(" + FlightRouteIndex + ")").text();
    FlightCloseFlag = trContentRow.find("td:eq(" + FlightStatusIndex + ")").text() == "BUILD UP" ? "BUP" : trContentRow.find("td:eq(" + FlightStatusIndex + ")").text();
    FlightStatusFlag = trContentRow.find("td:eq(" + ProcessStatusInx + ")").text();
    EndPoint = trContentRow.find("td:eq(" + EndPointIndex + ")").text();
    var FlightSNo = trContentRow.find("td:eq(" + FlightGroupSNoIndex + ")").text(); //$(this.select()).find('td:first').text();
    CurrentFlightSno = trContentRow.find("td:eq(" + FlightGroupSNoIndex + ")").text();

    ///////////////////////
    PartnerCarrierCode = GetPartnerCarrierCode(trContentRow.find("td:eq(" + PartnerCarrierCodeInx + ")").text());
    PartnerGroupCarrierCode = trContentRow.find("td:eq(" + PartnerCarrierCodeInx + ")").text();
    subprocesssno = FlightCloseFlag == "Open" ? 35 : FlightCloseFlag == "LI" ? 35 : FlightCloseFlag == "BUP" ? 33 : FlightCloseFlag == "PRE" ? 34 : FlightCloseFlag == "MAN" ? 34 : 2112;
    //UserSubProcessRightsFlightControl("divContentDetail", subprocesssno);
    $('#StackDetailTab').hide();
    $('#FlightStopOverDetailTab').hide();
    //added for pax and freighter radio button
    $('#tdFlightType').hide();
    $("#tdATDTime,#tdATDDate,#tdManRemarks,#tdregnNo,#tdregnNoTxt").show();
    $('#btnSaveAndClose').hide();
    //$('#spnRegistrationNo,#RegistrationNo').show();
    $('#divDetail,#divLyingDetail').html("");
    $("#divContentDetail").show();
    $('#SecondTab').show();
    $('#btnMoveToLying').hide();
    $('#OSCTab').show();
    $("#divAction").show();
    $('#btnFlightClose').hide();
    $('#tblFlightAWBInfo').show();
    $('#btnFinalizedPreMan').hide();
    $("#tblFlightAWBInfo").show();
    $('#btnSaveAndClose').hide();
    $('#tblAWBButtonInfo').show();

    $('#btn_OSI').hide();
    $('#tdManRemarks,#tdATDDate,#tdATDTime').hide();
    $('#btn_SendNtm').css('visibility', 'hidden');
    $('#td_sendNtm').hide();
    $('#btn_Print').hide();
    $('#btnUWS').hide();
    $('#btnCBV').hide();
    $('#btnEDIMsgSend').hide();
    $('#btnEDIMSG').hide();
    $('#tdIsExcludeFromFFM').hide();

    //// for Flight Details
    FlightRoute = GetFlightRoute(trContentRow.find("td:eq(" + FlightRouteIndex + ")").text());
    ////
    ManageCTMStatus = FlightCloseFlag;//use for Hide and Show CTM Charge Button
    var IsView, IsBlocked;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subprocesssno) {
            IsView = e.IsView;
            IsBlocked = e.IsBlocked;
        }
    });
    if (!IsButtonClick) {
        if (!IsBlocked) {
            var LyingListGridType;
            $('#divContentDetail,#btnSave,#btnCancel').show();
            if ((FlightCloseFlag == "PRE") || (FlightCloseFlag == "BUP") || (FlightCloseFlag == "MAN") || (FlightCloseFlag == "DEP") || (FlightCloseFlag == "CLSD")) {
                ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + FlightSNo + "/" + FlightCloseFlag + "/" + subprocesssno);
                LyingListGridType = 'MULTI';
            }
            else {
                $('#btnSaveAndClose').hide();
                ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/FLIGHTAWB/" + FlightSNo + "/" + FlightCloseFlag + "/" + subprocesssno);
                LyingListGridType = 'SINGLE';
            }

            $("#SecondTab").unbind("click").bind("click", function () {
                if ($("#divLyingDetail table").length === 0) {
                    fn_GetLyingList('-1', GetFlightSortRoute(trContentRow.find("td:eq(" + FlightRouteIndex + ")").text()), LyingListGridType);
                }
            });
            $("#OSCTab").unbind("click").bind("click", function () {
                if ($("#divOSCDetail table").length === 0) {
                    fn_GetOSCLyingList('-1', FlightRoute, LyingListGridType);
                }
            });
        }
        else {
            //$('#StackDetailTab,#FlightStopOverDetailTab,#SecondTab,#OSCTab,#FirstTab').hide();
            $('#divContentDetail,#btnSave,#btnCancel,#btnFinalizedPreMan,#btnSaveAndClose,#btnFlightClose').hide();
        }
    }
    $("#divLyingDetail").html("");
    $("#divOSCDetail").html("");
    if (FlightCloseFlag == 'BUP') {
        FunctionName = "SavePMenifestInformation";
    }
    else {
        FunctionName = FlightCloseFlag == "PRE" ? "SaveMenifestInformation" : "SavePMenifestInformation";
    }

    if (FlightCloseFlag == 'Open') {
        // $('#spnRegistrationNo,#RegistrationNo').hide();
        $('#btnPrint').hide();
        $('#btn_Print').hide();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Loading Instruction Details');
        $('#FirstTab').text('Loading Instruction');
        $('#btnSave').text("Save Loading Instruction");
        SaveProcessStatus = "LI";//for save loading instruction
    }
    else if (FlightCloseFlag == 'LI') {
        $('#btn_Print').show();
        $('#btnMoveToLying').show();
        $("#tdCancelLI").show();
        // $('#spnRegistrationNo,#RegistrationNo').hide();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Loading Instruction Details');
        $('#btnSave').text("Update Loading Instruction");
        $('#FirstTab').text('Loading Instruction');
        SaveProcessStatus = "LI";//for save loading instruction
    }
    else if (FlightCloseFlag == 'BUP') {
        if (!IsView)
            if (!IsBlocked)
                $('#btnFinalizedPreMan').show();
        $('#btn_Print').hide();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Pre Manifest Details');
        $('#btnSave').text("Save Pre Manifest");
        $('#btnSave').hide();//for hide Save and Update Premanifest Button
        $('#FirstTab').text('Pre Manifest');
        SaveProcessStatus = "PRE";
    }
    else if (FlightCloseFlag == 'PRE') {
        $('#btn_Print').show();
        $('#tdFlightType').show();
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#tdFlightType  input[type=radio]').attr('disabled', 'disabled');
        }
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Manifest Details');

        if (!IsView) {
            if (!IsBlocked)
                $('#btnSaveAndClose').show();
            //  if (FlightStatusFlag == '1_0_2_0_0_0' || FlightStatusFlag == '1_1_2_0_0_0' || FlightStatusFlag == '1_0_2_0_0_1' || FlightStatusFlag == '1_1_2_0_0_1')
            //  if (!IsBlocked)
            //    $('#btnFinalizedPreMan').show();
        }
        $('#btnSave').text("Save Manifest");
        $('#FirstTab').text('Manifest');
        $('#btn_OSI').show();
        //$('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime').show();
        $('#tdManRemarks,#tdATDDate,#tdATDTime').show();
        SaveProcessStatus = "MAN";
        //UserSubProcessRightsFlightControl("divContentDetail", subprocesssno);
    }
    else if (FlightCloseFlag == 'MAN') {
        $('#btn_Print').show();
        //added for pax and freighter radio button
        $('#tdFlightType').show();
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#tdFlightType  input[type=radio]').attr('disabled', 'disabled');
        }
        if ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR")
            $('#btnCBV').show();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Manifest Details');
        if (!IsView)
            if (!IsBlocked)
                $('#btnSaveAndClose').show();

        $('#btnSave').text("Update Manifest");
        $('#FirstTab').text('Manifest');
        $('#btn_OSI').show();
        $('#tdManRemarks,#tdATDDate,#tdATDTime').show();
        SaveProcessStatus = "MAN";
        //  UserSubProcessRightsFlightControl("divContentDetail", subprocesssno);
    }
    else if (FlightCloseFlag == "DEP" || FlightCloseFlag == "CLSD") {
        $('#btn_Print').show();
        //added for pax and freighter radio button
        $('#tdFlightType').show();
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#tdFlightType  input[type=radio]').attr('disabled', 'disabled');
        }
        if ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR")
            $('#btnCBV').show();



        $('#tdManRemarks,#tdATDDate,#tdATDTime').show();
        //  UserSubProcessRightsFlightControl("divContentDetail", 2112);
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Flight Depart Details');
        $("#divAction button").hide();
        $('#btnFlightClose').show();
        $('#btn_OSI').show();
        //  $('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime,#tdNILManifest').hide();
        $('#FirstTab').text('Flight Depart');
        if (FlightCloseFlag == "CLSD")
            $('#btnFlightClose').hide();
        $('#btnSave').hide();
        SaveProcessStatus = "DEP";
        //if (FlightCloseFlag == "DEP")
        //    $('#btnEDIMSG').show();
    }
    // else
    //  $('#spnRegistrationNo,#RegistrationNo').hide();


    BindSaveSection();
    $("#ulTab").show();
    $("#tabstrip").kendoTabStrip();
    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select($("#tabstrip").kendoTabStrip().data("kendoTabStrip").tabGroup.children("li").eq(0));


    if (trContentRow.find("td:eq(" + IsStackInx + ")").text() == "true") {
        $('#StackDetailTab').css("display", "inline-block");
        //$("#tabstrip").kendoTabStrip(2).show();
    }
    if (trContentRow.find("td:eq(" + IsStopOverInx + ")").text() == "true") {
        $('#FlightStopOverDetailTab').css("display", "inline-block");
        if (FlightCloseFlag == "PRE" || FlightCloseFlag == "MAN") {
            $('#tdIsExcludeFromFFM').show();
            $('#IsExcludeFromFFM').prop('checked', 0);
        }
        else {
            $('#tdIsExcludeFromFFM').hide();
        }
        //$("#tabstrip").kendoTabStrip(2).show();
    }
    // var TotalAWBGrossWT = 0, TotalAWBVolumeWT = 0, TotalAWBCBMWT = 0;

    $('#RegistrationNo').keypress(function (e) {
        var allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^a-zA-Z0-9\-]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });




    //$("#txtATDTime").kendoTimePicker();
    //$("#txtATDDate").kendoDatePicker();
    //$("#txtATDTime").data("kendoTimePicker").value('');
    //$("#txtATDDate").data("kendoDatePicker").value('');

    // var 
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var flightATDDate = trContentRow.find("td:eq(" + FlightDateIndex + ")").text().trim();
    var flightATDDateData = flightATDDate.split("-");
    var monthIndex = months.indexOf(flightATDDateData[1]);
    var start = new Date(flightATDDateData[2], (monthIndex + 1), flightATDDateData[0]);


    $("#txtATDTime").kendoTimePicker({
        format: "HH:mm", interval: 1
        // , min: new Date(parseInt(flightATDDateData[2]), (monthIndex + 1), parseInt(flightATDDateData[0]), trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1]
        // , min: flightATDDate == $("#txtATDDate").val() ? (new Date(parseInt(flightATDDateData[2]), (monthIndex ), parseInt(flightATDDateData[0]), trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])) : new Date(0, 0, 0, 0, 0, 0),
        //  ,max: new Date(GetUserLocalTime("S").split('-')[2], (months.indexOf(GetUserLocalTime("S").split('-')[1]) ), GetUserLocalTime("S").split('-')[0], GetUserLocalTime("L").split(' ')[1].split(':')[0], GetUserLocalTime("L").split(' ')[1].split(':')[1])

        //, change: function () {
        //    var dt = new Date($("#txtATDTime").data("kendoTimePicker").value())
        //    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        //    var dtDate = new Date($("#txtATDDate").val() + ' ' + time);
        //    if (!(dtDate >= (flightATDDate == $("#txtATDDate").val() ? (new Date(parseInt(flightATDDateData[2]), (monthIndex), parseInt(flightATDDateData[0]), trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])) : new Date(0, 0, 0, 0, 0, 0)) && (dtDate <= new Date(GetUserLocalTime("S").split('-')[2], (months.indexOf(GetUserLocalTime("S").split('-')[1])), GetUserLocalTime("S").split('-')[0], GetUserLocalTime("L").split(' ')[1].split(':')[0], GetUserLocalTime("L").split(' ')[1].split(':')[1])))) {
        //        $("#txtATDTime").data("kendoTimePicker").value("");
        //        ShowMessage('warning', 'Warning -ATD Time', "ATD cannot be less than ETD and cannot be greater than current time.", "bottom-right");
        //    }

        //}
    });
    // $("#txtATDDate").data("kendoDatePicker");
    $("#txtATDDate").kendoDatePicker();

    var TxtDate = new Date();
    if (trContentRow.find("td:eq(" + ATDIndex + ")").text() != "")
        $("#txtATDTime").data("kendoTimePicker").value(trContentRow.find("td:eq(" + ATDIndex + ")").text());
    else {
        // $("#txtATDTime").val('');
        $("#txtATDTime").data("kendoTimePicker").value(userContext.SysSetting.ICMSEnvironment == 'JT' ? GetUserLocalTime("L").split(' ')[1].substr(0, 5) : '');
    }


    if ($("#txtATDDate").data("kendoDatePicker")) {


        //$("#txtATDDate").data("kendoDatePicker").min(userContext.SysSetting.ICMSEnvironment == 'JT' ? new Date() : (new Date(flightATDDate) > new Date() ? new Date() : new Date(flightATDDate)));
        //$("#txtATDDate").data("kendoDatePicker").max(new Date(flightATDDate) > new Date() ? new Date(flightATDDate) : new Date());

        if (userContext.SysSetting.ClientEnvironment == 'UK') {

            $("#txtATDDate").data("kendoDatePicker").max(new Date());
            $("#txtATDTime").kendoTimePicker({
                format: "HH:mm", interval: 1
                , max: new Date(GetUserLocalTime("S").split('-')[2], (months.indexOf(GetUserLocalTime("S").split('-')[1])), GetUserLocalTime("S").split('-')[0], GetUserLocalTime("L").split(' ')[1].split(':')[0], GetUserLocalTime("L").split(' ')[1].split(':')[1])
            });
        }
    }
    /* Commented By Manoj Sir
    else{
        $("#txtATDDate").kendoDatePicker(
                {
                    min: userContext.SysSetting.ICMSEnvironment == 'JT' ? new Date() : (new Date(flightATDDate) > new Date() ? new Date() : new Date(flightATDDate)),
                    //min:  new Date() ,
                    max: new Date(flightATDDate) > new Date() ? new Date(flightATDDate) : new Date(),
                        change: function () {
                 ///    alert($("#txtATDDate").data("kendoDatePicker").value());
                    if (($("#txtATDDate").data("kendoDatePicker").value() >= new Date(flightATDDate)) || ($("#txtATDDate").data("kendoDatePicker").value() <= new Date())) {
                        $('#txtATDTime').val('');
                        $("#txtATDTime").kendoTimePicker({
                            format: "HH:mm", interval: 1
                             , min: new Date(parseInt(flightATDDateData[2]), (monthIndex + 1), parseInt(flightATDDateData[0]), trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])
                             , min: flightATDDate == $("#txtATDDate").val() ? (new Date(parseInt(flightATDDateData[2]), (monthIndex), parseInt(flightATDDateData[0]), trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])) : new Date(0, 0, 0, 0, 0, 0),
                             max: new Date(GetUserLocalTime("S").split('-')[2], (months.indexOf(GetUserLocalTime("S").split('-')[1])), GetUserLocalTime("S").split('-')[0], GetUserLocalTime("L").split(' ')[1].split(':')[0], GetUserLocalTime("L").split(' ')[1].split(':')[1])
                            , change: function () {
                                var dt = new Date($("#txtATDTime").data("kendoTimePicker").value())
                                var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                                var dtDate = new Date($("#txtATDDate").val() + ' ' + time);
                                if (!(dtDate >= (flightATDDate == $("#txtATDDate").val() ? (new Date(parseInt(flightATDDateData[2]), (monthIndex), parseInt(flightATDDateData[0]), trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])) : new Date(0, 0, 0, 0, 0, 0)) && (dtDate <= new Date(GetUserLocalTime("S").split('-')[2], (months.indexOf(GetUserLocalTime("S").split('-')[1])), GetUserLocalTime("S").split('-')[0], GetUserLocalTime("L").split(' ')[1].split(':')[0], GetUserLocalTime("L").split(' ')[1].split(':')[1])))) {
                                    $("#txtATDTime").data("kendoTimePicker").value("");
                                    ShowMessage('warning', 'Warning -ATD Time', "ATD cannot be less than ETD and cannot be greater than current time.", "bottom-right");
                                }
                            }
                        });
                    }
                    else {
                        $("#txtATDDate").data("kendoDatePicker").value("");
                        ShowMessage('warning', 'Warning -ATD Date', "Date cannot be less than ETD Date or cannot be greater than current date ", "bottom-right");

                    }

                      }

                }
            );
}
 */

    $("#txtATDDate").data("kendoDatePicker").value('');
    var DateValue;
    if (trContentRow.find("td:eq(" + ATDGMTIndex + ")").text().replace("01-Jan-1900", "") != "") {
        flightATDDate = trContentRow.find("td:eq(" + ATDGMTIndex + ")").text().trim();
        flightATDDateData = flightATDDate.split("-");
        monthIndex = months.indexOf(flightATDDateData[1]);
        start = new Date(flightATDDateData[2], monthIndex, flightATDDateData[0]);
        $("#txtATDDate").data("kendoDatePicker").value(start);
    }
    else {
        $("#txtATDDate").data("kendoDatePicker").value(userContext.SysSetting.ICMSEnvironment == 'JT' ? new Date() : "");
    }

    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $("#txtATDDate").data("kendoDatePicker").value(new Date());
        $("#txtATDTime").data("kendoTimePicker").enable(false);
        $("#txtATDDate").data("kendoDatePicker").enable(false);
        ////$("#txtATDTime").attr('disabled', 'disabled');
    }


    /*****************************For Ristrict Special Character in ATDTime *************************/
    $('#txtATDTime').keypress(function (e) {
        var allowedChars = new RegExp("^[0-9:]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^0-9:\]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });
    //$('#txtATDTime').blur(function (e) {
    //    $(this).val($(this).val().split(':')[0] > '23' || $(this).val().split(':')[1] > '59'
    //        || (flightATDDate == $("#txtATDDate").val() && $(this).val() < ATDTime) || (ATDTime > GetUserLocalTime("L").split(' ')[1].substr(0, 5)) ? '' : $(this).val());

    //})
    //$('#txtATDTime').blur(function (e) {
    //    $(this).val($(this).val().split(':')[0] > '23' || $(this).val().split(':')[1] > '59' || (flightATDDate == $("#txtATDDate").val() && parseInt($(this).val().replace(':', '')) < parseInt(ATDTime.replace(':', ''))) || (flightATDDate != $("#txtATDDate").val() && parseInt($(this).val().replace(':', '')) > GetUserLocalTime("L").split(' ')[1].substr(0, 5).replace(':', '')) ? '' : $(this).val());

    //})
    /************************************END********************************************/
    /***********For ATD Date and ATD Time Default null on 01/02/2018 ************//*

    $("#txtATDTime").kendoTimePicker({
        format: "HH:mm", interval: 1
        , min: new Date(trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])
    });
    var TxtDate = new Date();
    if (trContentRow.find("td:eq(" + ATDIndex + ")").text() != "")
        $("#txtATDTime").data("kendoTimePicker").value(trContentRow.find("td:eq(" + ATDIndex + ")").text());
    else
        $("#txtATDTime").val(GetUserLocalTime("L").split(' ')[1].substr(0, 5));
    //$("#txtATDTime").data("kendoTimePicker").value(TxtDate.getHours() + ':' + TxtDate.getMinutes());

    // Changes by Vipin Kumar for IE Compatibility
    // Old Code
    //var start = new Date(trContentRow.find("td:eq(" + FlightDateIndex + ")").text());
    //$("#txtATDDate").kendoDatePicker({
    //    value: new Date(),
    //    min: new Date(start.getFullYear(), start.getMonth(), start.getDate())

    //});
    //var DateValue;
    //if (trContentRow.find("td:eq(" + ATDGMTIndex + ")").text().replace("01-Jan-1900", "") != "")
    //    $("#txtATDDate").data("kendoDatePicker").value(new Date(trContentRow.find("td:eq(" + ATDGMTIndex + ")").text()));
    //else
    //    $("#txtATDDate").data("kendoDatePicker").value(new Date(start.getFullYear(), start.getMonth(), start.getDate()));

    // New Code
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var flightATDDate = trContentRow.find("td:eq(" + FlightDateIndex + ")").text().trim();
    var flightATDDateData = flightATDDate.split("-");
    var monthIndex = months.indexOf(flightATDDateData[1]);
    var start = new Date(flightATDDateData[2], monthIndex, flightATDDateData[0]);

    $("#txtATDDate").kendoDatePicker({
        value: new Date(),
        min: start
    });
    var DateValue;
    if (trContentRow.find("td:eq(" + ATDGMTIndex + ")").text().replace("01-Jan-1900", "") != "") {
        flightATDDate = trContentRow.find("td:eq(" + ATDGMTIndex + ")").text().trim();
        flightATDDateData = flightATDDate.split("-");
        monthIndex = months.indexOf(flightATDDateData[1]);
        start = new Date(flightATDDateData[2], monthIndex, flightATDDateData[0]);
        $("#txtATDDate").data("kendoDatePicker").value(start);
    }
    else {
        $("#txtATDDate").data("kendoDatePicker").value(start);
    }

    //Ends

    $("#txtATDTime").data("kendoTimePicker").bind("change", function (e) {
        // if(this.value()<trContentRow.find("td:eq(" + ETDIndex + ")").text())
        //  e.preventDefault()
        // if(this.value()>(trContentRow.find("td:eq(" + ETDIndex + ")").text()+00:10);
        // console.log(value); //value is the selected date in the timepicker
    });

    */
    /***********END************/


    /* for Flight Row reset */
    $('#divFlightDetails table tbody tr').each(function (row, tr) {
        if ($(tr).find("td:eq(" + IsNILManifestedInx + ")").text() == "true")
            $(tr).css('background-color', 'rgba(204, 39, 39, 0.22)');//.css('color', 'white');
        if ($(tr).find("td:eq(" + IsCargoTransferedInx + ")").text() == "true" && $(tr).find("td:eq(" + IsNILManifestedInx + ")").text() == "flase")
            $(tr).css('background-color', 'rgba(159, 123, 246, 0.31)');//.css('color', 'white');

    });
    if (IsNILManifested == "true") {

        $('#btnSave').hide();
        $('#btnNILManifest').text('Print NIL Manifest');
        //$("#divDetailPrint").css("border", "3px solid #e5aeae").css("box-shadow", "inset 0px 0px 10px 0px #e5aeae").css("padding", "2px");
        $(trContentRow).css("background-color", "rgba(204, 39, 39, 0.70)");
        $('#SecondTab,#OSCTab').css("display", "none");
    }
    else if (IsCargoTransfered && IsNILManifested == "false") {
        $(trContentRow).css('background-color', 'rgba(159, 123, 246, 0.82)');//.css('color', 'white');
    }
    else {
        $('#btnNILManifest').text('Create NIL Manifest');
        //$("#divDetailPrint").removeAttr("style");
    }
    //Validation For IsRFS FLight

    //end
    //  if(FlightCloseFlag == "DEP")
    //    $('#btnSave').hide();
    //  IsButtonClick = false;
    if (IsUWS)
        $('#btnUWS').show();
    //Added for Pax and Freighter radio button
    var FlightType = trContentRow.find('td[data-column="FlightType"]').html();
    // Changes by Vipin Kumar discussed with Pradip Kathua Pax(0) and Freighter(1) type
    //$("input[name=Pax][value=" + FlightType + "]").attr("checked", 1);
    if (FlightType == 1)
        $("input[name=Pax][value=" + FlightType + "]").attr("checked", 1);
    else
        $("input[name=Pax][value=" + FlightType + "]").attr("checked", 1);
    //Ends
}

/******************************* Get Lying List Function ****************************************/
//var ULDSNO = "-1";
function fn_GetLyingList(ULDSNO, tdRoute, LyingListGridType) {

    if (LyingListGridType == 'MULTI') {
        fun_GetSearchPanel("ManifestLyingSearch", "divLyingSearch", SearchManifestLyingLst);
        /* For Stop Default Search in LyingList */
        /*
        //Use -1 For Bind All Origin City From Session
        cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + tdRoute + "/A~A/A~A");
        */

    }
    else {
        fun_GetLISearchPanel("LILyingSearch", "divLyingSearch", SearchLyingLst);
        /* For Stop Default Search in LyingList */
        /*
        SearchlyingList("A~A", "A~A", 'A~A', "0", "0", "0", userContext.AirportCode, PartnerCarrierCode, tdRoute, "A~A");
        */

    }
}
function fn_GetOSCLyingList(ULDSNO, FlightRoute, LyingListGridType) {

    if (LyingListGridType == 'MULTI') {
        fun_GetOSCSearchPanel("OSCLyingSearch", "divOSCSearch", SearchOSCLyingLst);
        /* For Stop Default Search in LyingList */
        /*
        cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/OSCFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + FlightRoute + "/A~A/A~A");
        */
    }
    else {
        fun_GetLIOSCSearchPanel("OSCLILyingSearch", "divOSCSearch", SearchLIOSCLyingLst);
        /* For Stop Default Search in LyingList */
        /*
        SearchOSCList("A~A", 'A~A', 'A~A', "0", "0", "0", userContext.AirportCode, PartnerCarrierCode, FlightRoute, "A~A");
        */
    }
}
/******************************************END***************************************************/

function fn_ValidateULDCount(e) {
    $(e).val($(e).val().replace(/[^0-9]/g, ''));
}

function fun_SetTotalGR_V_CBM(input) {
    //var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    //var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    //TotalAWBGrossWT=parseFloat(ActualG_V_CBM[0]);
    //TotalAWBVolumeWT=parseFloat(ActualG_V_CBM[1]);
    //TotalAWBCBMWT = parseFloat(ActualG_V_CBM[2]);
}
function fun_CheckGR_V_CBM() {
    var flag = true;
    var trRow = $('#divDetail tbody tr').closest("div.k-grid").find("div.k-grid-header")
    //var trRow = $(tr).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var MessageArray = new Array();
    var ct = 0;
    var ACTWayBill = "";
    var PGrossWt = 0, PVolumeWt = 0, PCBMWt = 0, TGrossWt = 0, TVolumeWt = 0, TCBM = 0, RGrossWt = 0, RVolumeWt = 0, RCBM = 0;
    $('#divDetail div.k-grid-content tbody tr').each(function (row, tr) {

        PGrossWt = 0, PVolumeWt = 0, PCBMWt = 0;
        var CurrentAWBNo = $(tr).find('td:eq(' + AWBNOIndex + ')').text();
        var ActualG_V_CBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');

        $('#divDetail div.k-grid-content tbody tr').each(function (row1, tr1) {
            if ($(tr1).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                PGrossWt += parseFloat($(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                PVolumeWt += parseFloat($(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                PCBMWt += parseFloat($(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
            }
        });
        ACTWayBill = $(tr).find('td:eq(' + AWBNOIndex + ')').text();
        if (parseFloat(ActualG_V_CBM[0]).toFixed(3) != parseFloat(PGrossWt).toFixed(3)) {
            ct = 1;
            TGrossWt = parseFloat(ActualG_V_CBM[0]).toFixed(3);
            RGrossWt = TGrossWt - PGrossWt;
        }
        else if (parseFloat(ActualG_V_CBM[1]).toFixed(3) != parseFloat(PVolumeWt).toFixed(3)) {
            ct = 2;
            TVolumeWt = parseFloat(ActualG_V_CBM[1]).toFixed(3);
            RVolumeWt = TVolumeWt - PVolumeWt;
        }
        else if (parseFloat(ActualG_V_CBM[2]).toFixed(3) != parseFloat(PCBMWt).toFixed(3)) {
            ct = 3;
            TCBM = parseFloat(ActualG_V_CBM[2]).toFixed(3);
            RCBM = TCBM - PCBMWt;
        }
    });
    switch (ct) {
        case 1:
            {
                ShowMessage('warning', 'Warning -Planned Gross Weight shuld be equal to Actual Gross Weight', "Actual Gross Weight =" + TGrossWt + " and Remainning Gross Weight =" + parseFloat(RGrossWt).toFixed(3) + " ", "bottom-right");
                break;
            }
        case 2:
            {
                ShowMessage('warning', 'Warning -Planned Volume Weight shuld be equal to Actual Volume Weight', "Actual Volume Weight =" + TVolumeWt + " and Remainning Volume Weight =" + parseFloat(RVolumeWt).toFixed(3) + " ", "bottom-right");
                break;
            }
        case 3:
            {
                ShowMessage('warning', 'Warning -Planned CBM shuld be equal to Actual CBM', "Actual CBM =" + TCBM + " and Remainning CBM =" + parseFloat(RCBM).toFixed(3) + " ", "bottom-right");
                break;
            }
    }

}
//For Save All Process
function SaveFormData(subprocess) {
    //debugger;
    var issave = false;
    if (subprocess.toUpperCase() == "LI") {
        issave = SavePreManifestInfo();
    }
    else if (subprocess.toUpperCase() == "PRE") {
        issave = SaveManifestInfo();
    }
    else if (subprocess.toUpperCase() == "PRE_FINAL") {
        issave = SaveManifestInfo();
    }
    else if (subprocess.toUpperCase() == "MAN") {
        issave = SaveManifestInfo();
    }
    else if (subprocess.toUpperCase() == "GP") {   // Add by parvez khan
        issave = SaveGatePass();
    }
    return issave;
}

//End Save All Process

function GetFlightULDSTACKDetails() {
    ShowIndexView("divStackDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/ULDSTACK/" + CurrentFlightSno + "/STACK" + "/" + subprocesssno);
}

function checkProgrss(item, subprocess, displaycaption) {



    // var ProgressStatus = item.split(',');
    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_C" + ",") >= 0) {
        //if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
        return "\"completeprocess\"";
    }
    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_P" + ",") >= 0) {
        //if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
        return "\"partialprocess\"";
    }
    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_I" + ",") >= 0) {
        //if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
        return "\"fcincompleteprocess\"";
    }


}



//function checkProgrss(item, subprocess, displaycaption) {
//    //dependentprocess


//    if (item != "0") {
//        var ProgressStatus = item.split('_');
//        if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
//            return "\"completeprocess\"";
//        }
//        if ((displaycaption == "AT") && (ProgressStatus[1] == 1)) {
//            return "\"completeprocess\"";
//        }
//        if ((displaycaption == "PRE") && (ProgressStatus[2] == 1)) {
//            return "\"completeprocess\"";
//        }
//        if ((displaycaption == "PRE") && (ProgressStatus[2] == 2)) {
//            return "\"partialprocess\"";
//        }
//        if ((displaycaption == "MAN") && (ProgressStatus[3] == 1)) {
//            return "\"completeprocess\"";
//        }
//        if ((displaycaption == "N") && (ProgressStatus[4] == 1)) {
//            return "\"completeprocess\"";
//        }
//        if ((displaycaption == "A") && (ProgressStatus[5] == 2)) {
//            return "\"incompleteprocess\"";
//        }
//        if ((displaycaption == "A") && (ProgressStatus[5] == 1)) {
//            return "\"completeprocess\"";
//        }
//        //if ((displaycaption == "PRE") && (ProgressStatus[0] == 0)) {
//        //    return "\"incompleteprocess\"";
//        //}
//        //if ((displaycaption == "MAN") && (ProgressStatus[1] == 0)) {
//        //    return "\"incompleteprocess\"";
//        //}
//    }
//    // else { return "\"incompleteprocess\""; }
//}


function BindSaveSection() {
    //SAVE SECTION
    $("#btnCancel").unbind("click").bind("click", function () {
        $('#divDetail').html("");
        $('#divContentDetail').hide();
    });
    $("#btnSave").unbind("click").bind("click", function () {
        if (IsNILManifested == "true") {
            ShowMessage('warning', 'Warning -NIL Manifest already created for this flight', " ", "bottom-right");
        }
        else {
            if (SaveFormData(SaveProcessStatus)) {
                FlightSearch();
            }
        }
    });
    $("#btnSaveAndClose").unbind("click").bind("click", function () {

        // if (IsNILManifested == "true") {
        //   ShowMessage('warning', 'Warning -NIL Manifest already created for this flight', " ", "bottom-right");
        // }
        // else {

        if (($("#RegistrationNo").val() || "") == "" && IsRFS == false) {
            var str = IsRegistrationAvailable == true ? 'select' : 'enter';
            ShowMessage('warning', 'Warning-Registration No', 'Please ' + str + ' Aircraft Registration No.', "bottom-right");
        }
        else if ((cfi.CfiDate("txtATDDate") || "") == "" || ($("#txtATDTime").val() || "") == "") {
            ShowMessage('warning', 'Warning ', "Please Enter ATD Date/Time", "bottom-right");
        }
        else {
            var r = jConfirm("Are you sure,you want to Depart Flight ?", "", function (r) {
                if (r == true) {
                    SaveProcessStatus = "DEP";
                    if (SaveManifestInfo("DEP")) {
                        cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + $('#hdnFlightSNo').val() + "/MAN" + "/" + subprocesssno);
                        FlightSearch();
                        $('#tblFlightAWBInfo').show();

                    }
                    SaveProcessStatus = "MAN";
                }
            });
        }
        /*
        if ($("#RegistrationNo").val() != "") {
            var r = jConfirm("Are you sure,you want to Depart Flight ?", "", function (r) {
                if (r == true) {
                    SaveProcessStatus = "DEP";
                    if (SaveManifestInfo("DEP")) {
                        cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + $('#hdnFlightSNo').val() + "/MAN");
                        FlightSearch();
                        $('#tblFlightAWBInfo').show();

                    }
                    SaveProcessStatus = "MAN";
                }
            });
        }

        else {
            ShowMessage('warning', 'Warning', 'Please Enter Aircraft Registration No.', "bottom-right");
        }
        */
        SaveProcessStatus = "MAN";
        //}
    });
}
function fn_OnFlightSuccessGrid(e) {
    var trHeaderMainRow = $("#divFlightDetails").find("div.k-grid-header");
    var IsNILManifestIndex = trHeaderMainRow.find("th[data-field='IsNILManifested']").index();
    var IsFlightStatusIndex = trHeaderMainRow.find("th[data-field='FlightStatus']").index();
    var IsCargoTransferedInx = trHeaderMainRow.find("th[data-field='IsCargoTransfered']").index();
    $('#divFlightDetails table tbody tr').each(function (row, tr) {
        $(tr).removeAttr("style");
        if ($(tr).find(' td:eq(' + IsNILManifestIndex + ')').text() == "true")
            $(tr).css('background-color', 'rgba(204, 39, 39, 0.22)');//.css('color', 'white');
        if ($(tr).find(' td:eq(' + IsCargoTransferedInx + ')').text() == "true" && $(tr).find(' td:eq(' + IsNILManifestIndex + ')').text() == "false")
            $(tr).css('background-color', 'rgba(159, 123, 246, 0.31)');//.css('color', 'white');
        //$(tr).css('background-color', '#9f7bf6');//.css('color', 'white');
        if ($(tr).find(' td:eq(' + IsFlightStatusIndex + ')').text() == "CLSD") {
            $(tr).find('input[type="button"][subprocesssno="2336"]').attr('title', 'Flight Closed');
            $(tr).find('input[type="button"][subprocesssno="2336"]').val('CLSD');
        }
        if ($(tr).find('td[data-column="IsInternational"]').text() == "false") {
            $(tr).find('input[type="button"][subprocesssno="2564"]').attr('Disabled', 1);
        }

    });
    $("#divFlightDetails").unbind('mousedown').bind('mousedown', function (obj) {
        if (obj.target.type == 'button')
            IsButtonClick = true;
        else
            IsButtonClick = false;
    });

    PageRightsCheckFlightControl()
}


//function fn_OnFlightSuccessGrid(e) {
//    var trHeaderMainRow = $("#divFlightDetails").find("div.k-grid-header");
//    var IsNILManifestIndex = trHeaderMainRow.find("th[data-field='IsNILManifested']").index();
//    var IsCargoTransferedInx = trHeaderMainRow.find("th[data-field='IsCargoTransfered']").index();
//    $('#divFlightDetails table tbody tr').each(function (row, tr) {
//        $(tr).removeAttr("style");
//        if ($(tr).find(' td:eq(' + IsNILManifestIndex + ')').text() == "true")
//            $(tr).css('background-color', 'rgba(204, 39, 39, 0.22)');//.css('color', 'white');
//        if ($(tr).find(' td:eq(' + IsCargoTransferedInx + ')').text() == "true" && $(tr).find(' td:eq(' + IsNILManifestIndex + ')').text() == "false")
//            $(tr).css('background-color', 'rgba(159, 123, 246, 0.31)');//.css('color', 'white');
//        //$(tr).css('background-color', '#9f7bf6');//.css('color', 'white');

//    });
//    $("#divFlightDetails").unbind('mousedown').bind('mousedown', function (obj) {
//        if (obj.target.type == 'button')
//            IsButtonClick = true;
//        else
//            IsButtonClick = false;
//    });
//}

function SearchLIOSCLyingLst() {
    var AWBNo = $("#divOSCSearch #txtAWBNo").val() == "" ? "0" : $("#divOSCSearch #txtAWBNo").val();
    var AWBPrefix = 'A~A';
    var OriginCity = 'A~A'; //$("#divOSCSearch #searchOSCLIOriginCity").val() == "" ? "A~A" : $("#divOSCSearch #searchOSCLIOriginCity").val();
    var DestinationCity = $("#Text_txtOSCLIDestinationCity").val() == "" ? "A~A" : $("#Text_txtOSCLIDestinationCity").val();
    var FlightNo = "A~A"; //$("#divOSCSearch #txtFlightNo").val().trim() == "" ? "A~A" : $("#divOSCSearch #txtFlightNo").val().trim();
    var OffloadType = $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key();
    var FlightDate = "0";
    //var LoggedInCity = 'DEL';
    // $("#btnLyingListSearch").unbind("click");
    if (DestinationCity == "A~A" && AWBNo == "0") {
        ShowMessage('warning', 'Warning', "Please provide Destination City or AWB Number to fetch respective data", "bottom-right");
    } else {
        SearchLIOSClyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, userContext.AirportCode, PartnerCarrierCode, FlightRoute, OffloadType);
    }
}
function SearchLyingLst() {
    var AWBNo = $("#divLyingSearch #txtAWBNo").val() == "" ? "0" : $("#divLyingSearch #txtAWBNo").val();
    var AWBPrefix = 'A~A';
    var OriginCity = 'A~A'; //$("#divLyingSearch #searchLIOriginCity").val() == "" ? "A~A" : $("#divLyingSearch #searchLIOriginCity").val();
    var DestinationCity = $("#Text_txtLIDestinationCity").val() == "" ? "A~A" : $("#Text_txtLIDestinationCity").val();
    var FlightNo = "A~A"; //$("#divLyingSearch #txtFlightNo").val().trim() == "" ? "A~A" : $("#divLyingSearch #txtFlightNo").val().trim();
    var OffloadType = $("#Text_txtOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOffloadType").data("kendoAutoComplete").key();
    var FlightDate = "0";
    //var LoggedInCity = 'DEL';
    if (DestinationCity == "A~A" && AWBNo == "0") {
        ShowMessage('warning', 'Warning', "Please provide Destination City or AWB Number to fetch respective data", "bottom-right");
    } else {
        SearchlyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, userContext.AirportCode, PartnerCarrierCode, GetFlightSortRoute(FlightDestination), OffloadType);
    }

    // $("#btnLyingListSearch").unbind("click");
}

function SearchOSCLyingLst() {
    $('#hdnSubProcessType').val("2");
    var ULDSNO = $("#Text_txtOSCULDNo").data("kendoAutoComplete").key() == "" ? "-1" : $("#Text_txtOSCULDNo").data("kendoAutoComplete").key();
    var DestinationCity = $("#Text_txtOSCDestinationCity").val() == "" ? "A~A" : $("#Text_txtOSCDestinationCity").val();
    var OriginCity = userContext.AirportCode;
    var OffloadType = $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key();
    var AWBNo = $("#txtOSCAWBNo").val() == "" ? "A~A" : $("#txtOSCAWBNo").val();
    //var FlightSNo = $("#txtFlightNo").val() == "" ? "A~A" : $("#txtFlightNo").val();
    if (ULDSNO == "-1" && DestinationCity == "A~A" && AWBNo == "A~A") {
        ShowMessage('warning', 'Warning', "Please provide Destination City, ULD Number or AWB Number to fetch respective data", "bottom-right");
    } else {
        cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/OSCFLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + ULDSNO + "/" + PartnerCarrierCode + "/" + GetFlightFWDRoute(FlightDestination) + "/" + OffloadType + "/" + AWBNo);
    }
}


function SearchManifestLyingLst() {
    $('#hdnSubProcessType').val("2");
    var ULDSNO = $("#Text_txtULDNo").data("kendoAutoComplete").key() == "" ? "-1" : $("#Text_txtULDNo").data("kendoAutoComplete").key();
    var DestinationCity = $("#Text_txtDestinationCity").val() == "" ? "A~A" : $("#Text_txtDestinationCity").val();
    var OriginCity = userContext.AirportCode;
    var OffloadType = $("#Text_txtOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOffloadType").data("kendoAutoComplete").key();
    var AWBNo = $("#txtMLAWBNo").val() == "" ? "A~A" : $("#txtMLAWBNo").val();
    //var FlightSNo = $("#txtFlightNo").val() == "" ? "A~A" : $("#txtFlightNo").val();

    if (ULDSNO == "-1" && DestinationCity == "A~A" && AWBNo == "A~A") {
        ShowMessage('warning', 'Warning', "Please provide Destination City, ULD Number or AWB Number to fetch respective data", "bottom-right");
    } else {
        cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTFLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + ULDSNO + "/" + PartnerCarrierCode + "/" + GetFlightSortRoute(FlightDestination) + "/" + OffloadType + "/" + AWBNo);
    }


}
function SearchLIOSClyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, CarrierCode, FlightRoute, OffloadType) {
    $('#hdnSubProcessType').val("2");
    // $("#imgprocessing1").show();
    // cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/CreateFlightLyingGrid/Shipment/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + AWBNo + "/" + OffLoadStatus, "Scripts/maketrans.js?" + Math.random());
    cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetGridData/FLIGHTCONTROL/FlightControl/OSCLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + CarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + LoggedInCity + "/" + GroupFlightSNo, "Scripts/maketrans.js?" + Math.random());
    //$("#imgprocessing1").hide();
}
function SearchlyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, CarrierCode, FlightRoute, OffloadType) {
    $('#hdnSubProcessType').val("2");
    // $("#imgprocessing1").show();
    // cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/CreateFlightLyingGrid/Shipment/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + AWBNo + "/" + OffLoadStatus, "Scripts/maketrans.js?" + Math.random());
    cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetGridData/FLIGHTCONTROL/FlightControl/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + CarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + LoggedInCity + "/" + GroupFlightSNo, "Scripts/maketrans.js?" + Math.random());
    //$("#imgprocessing1").hide();
}
function SearchOSCList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, CarrierCode, FlightRoute, OffloadType) {
    $('#hdnSubProcessType').val("2");
    // $("#imgprocessing1").show();
    // cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/CreateFlightLyingGrid/Shipment/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + AWBNo + "/" + OffLoadStatus, "Scripts/maketrans.js?" + Math.random());
    cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetGridData/FLIGHTCONTROL/FlightControl/OSCLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + CarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + LoggedInCity + "/" + GroupFlightSNo, "Scripts/maketrans.js?" + Math.random());
    //$("#imgprocessing1").hide();
}
//Bind ULD Type
function BindULDType() {
    // $("#divDetail .WebFormTable tbody:first tr:nth-child(2) td:first div.k-grid-content").css({ "max-height": "350px", "overflow": "auto" });
    // var chkFlag = 0, chkDisabled = 0;

    signalR.startHub();
    if (processList.length > 0) {
        //$.grep(processList, function (n, i) {
        //    if (n.GroupFlightSNo == GroupFlightSNo && n.ProcessSNo == 30 && n.EventType == "SAVE") {
        //        processList.splice(i, 1);
        //    }
        //});
        processList = [];
        signalR.getProcessList(function (completeProcessList) {
            processList = completeProcessList;
        });

        signalR.updateProcessList(function (newProcessObj) {
            // alert('Open by another user');
            processList.push(newProcessObj);
        });

    }
    var strULDType = '';
    var trHeaderMainRow = $("#divDetail").find("div.k-grid-header");
    var IsManifestIndex = trHeaderMainRow.find("th[data-field='IsManifested']").index();
    var IsBUPIndex = trHeaderMainRow.find("th[data-field='IsBUP']").index();
    var PriorityIndex = trHeaderMainRow.find("th[data-field='Priority']").index();
    var ULDTypeIndex = trHeaderMainRow.find("th[data-field='ULDType']").index();
    var Rth = $("#divDetail  div.k-grid-header:first  div  table  thead  tr  th[data-field='isSelect']:nth-child(1)");
    Rth.html("<input type='checkbox' id='chkAllBox' onchange='return CheckAll(this);' >");
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetULDType?DailyFlightSNo=" + CurrentFlightSno, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //strULDType = '<option value="0" >BULK</option>';
            $(result.Data).each(function (row, tr) {
                strULDType += '<option value=' + tr.ULDName + ' >' + tr.ULDName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });
    $('#divDetail table tbody tr').each(function (row, tr) {
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').html(strULDType);
        var selectedText = $(tr).find('td:eq(' + ULDTypeIndex + ') input[type=hidden]').val();
        //  if (selectedText != "0")
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').val(selectedText);
        if (selectedText == "BULK")
            $(tr).find(' td:eq(' + ULDTypeIndex + ')').next().find('input[id="txt_ULDCount"]').val('').attr('disabled', 1);//.val(selectedText);
    });
    var strPriorityType = '';
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetPriorityType", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strPriorityType = '<option value="-1" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strPriorityType += '<option value=' + tr.SNo + ' >' + tr.PriorityCode + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $('#divDetail table tbody tr').each(function (row, tr) {
        $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').html(strPriorityType);
        var selectedVal = $(tr).find('td:eq(' + PriorityIndex + ') input[type=hidden]').val();
        if (selectedVal != "-1")
            $(tr).find(' td:eq(' + PriorityIndex + ') #txtPriority').val(selectedVal);
        if (userContext.SysSetting.IsPriorityEnableOnLi != "True") {

            $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').attr('disabled', 'disabled');

        }
    });

    $("#divDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        //$('#divDetail table tbody tr').each(function (row, tr) {
        if (row > 0) {
            var trHeaderRow = $("#divDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').closest("div.k-grid").find("div.k-grid-header");
            var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
            var PrevAWBNo = $("#divDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').find('td:eq(' + AWBNOIndex + ')').text();
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == PrevAWBNo) {
                $(tr).find('td:last').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
            }
        }
    });


    $("#divDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        if ($(tr).find('td:eq(' + IsBUPIndex + ')').text() == "true") {
            $(tr).find('input[type=text],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').remove();
        }
        if ($(tr).find('td:eq(' + IsManifestIndex + ')').text() == 1 && $(tr).find('td:eq(' + IsBUPIndex + ')').text() == "false") {
            $(tr).find('input[type=text],input[type=checkbox],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').removeAttr('onclick');
        }
    });
    checkBoxSelected();
    $('#btnSave').removeAttr('disabled');
    $('#btnSaveAndClose').removeAttr('disabled');
    $('#btnFinalizedPreMan').removeAttr('disabled');
}
function BindLyingULDType() {
    // $("#divDetail .WebFormTable tbody:first tr:nth-child(2) td:first div.k-grid-content").css({ "max-height": "350px", "overflow": "auto" });

    var strULDType = '';
    var trHeaderMainRow = $("#divLyingDetail").find("div.k-grid-header");
    var IsManifestIndex = trHeaderMainRow.find("th[data-field='IsManifested']").index();
    var PriorityIndex = trHeaderMainRow.find("th[data-field='Priority']").index();
    var ULDTypeIndex = trHeaderMainRow.find("th[data-field='ULDType']").index();

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetULDType?DailyFlightSNo=" + CurrentFlightSno, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //strULDType = '<option value="0" >BULK</option>';
            $(result.Data).each(function (row, tr) {
                strULDType += '<option value=' + tr.ULDName + ' >' + tr.ULDName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });
    $('#divLyingDetail table tbody tr').each(function (row, tr) {
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').html(strULDType);
        var selectedText = $(tr).find('td:eq(' + ULDTypeIndex + ') input[type=hidden]').val();
        //  if (selectedText != "0")
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').val(selectedText);
    });
    var strPriorityType = '';
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetPriorityType", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strPriorityType = '<option value="-1" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strPriorityType += '<option value=' + tr.SNo + ' >' + tr.PriorityCode + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $('#divLyingDetail table tbody tr').each(function (row, tr) {
        $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').html(strPriorityType);
        if (userContext.SysSetting.IsPriorityEnableOnLi != "True") {
            $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').attr('disabled', 'disabled');
        }
        var selectedVal = $(tr).find('td:eq(' + PriorityIndex + ') input[type=hidden]').val();
        if (selectedVal != "-1")
            $(tr).find(' td:eq(' + PriorityIndex + ') #txtPriority').val(selectedVal);
    });

    //$("#divLyingDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
    //    //$('#divDetail table tbody tr').each(function (row, tr) {
    //    if (row > 0) {
    //        var trHeaderRow = $("#divLyingDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').closest("div.k-grid").find("div.k-grid-header");
    //        var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
    //        var PrevAWBNo = $("#divLyingDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').find('td:eq(' + AWBNOIndex + ')').text();
    //        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == PrevAWBNo) {
    //            $(tr).find('td:last').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
    //        }
    //    }
    //});

    $("#divLyingDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        if ($(tr).find('td:eq(' + IsManifestIndex + ')').text() == 1) {
            $(tr).find('input[type=text],input[type=checkbox],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').removeAttr('onclick');
        }
    });
}

function BindOSCLyingULDType() {
    var strULDType = '';
    var trHeaderMainRow = $("#divOSCDetail").find("div.k-grid-header");
    var IsManifestIndex = trHeaderMainRow.find("th[data-field='IsManifested']").index();
    var PriorityIndex = trHeaderMainRow.find("th[data-field='Priority']").index();
    var ULDTypeIndex = trHeaderMainRow.find("th[data-field='ULDType']").index();
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetULDType?DailyFlightSNo=" + CurrentFlightSno, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //strULDType = '<option value="0" >BULK</option>';
            $(result.Data).each(function (row, tr) {
                strULDType += '<option value=' + tr.ULDName + ' >' + tr.ULDName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });
    $('#divOSCDetail table tbody tr').each(function (row, tr) {
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').html(strULDType);
        var selectedText = $(tr).find('td:eq(' + ULDTypeIndex + ') input[type=hidden]').val();
        //  if (selectedText != "0")
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').val(selectedText);
    });
    var strPriorityType = '';
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetPriorityType", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strPriorityType = '<option value="-1" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strPriorityType += '<option value=' + tr.SNo + ' >' + tr.PriorityCode + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $('#divOSCDetail table tbody tr').each(function (row, tr) {
        $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').html(strPriorityType);
        var selectedVal = $(tr).find('td:eq(' + PriorityIndex + ') input[type=hidden]').val();
        if (selectedVal != "-1")
            $(tr).find(' td:eq(' + PriorityIndex + ') #txtPriority').val(selectedVal);
    });
    $("#divOSCDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        if ($(tr).find('td:eq(' + IsManifestIndex + ')').text() == 1) {
            $(tr).find('input[type=text],input[type=checkbox],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').removeAttr('onclick');
        }
    });

}
//For Save Loading Instruction
function SavePreManifestInfo() {
    signalR.startHub();
    var flag = false;
    // // alert(FlightCloseFlag)
    var chkSelect = false;
    var LIArray = new Array();
    // // fun_CheckGR_V_CBM();
    $('#btnSave').attr('disabled', 'disabled');


    var IsLITobeRefersh = false;

    if (SaveProcessStatus == "LI") {
        signalR.startHub();
        var BUPdata = jQuery.grep(processList, function (n, i) {
            return (n.GroupFlightSNo == GroupFlightSNo && n.ProcessSNo == 30 && n.EventType == "SAVE");
        });
        var BUPTime = BUPdata.length > 0 ? BUPdata[0].ProcessSaveTime : null;

        if (BUPdata.length > 0) { IsLITobeRefersh = true }
        else {
            signalR.updateProcessStatus({ GroupFlightSNo: GroupFlightSNo, ProcessSNo: subprocesssno, EventType: 'SAVE' });
        }
    }






    $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();
        // var DailyFlightSNo = $('#hdnFlightSNo').val();
        var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var RemarksIndex = Rowtr.find("th[data-field='Remarks']").index();
        var ULDCountIndex = Rowtr.find("th[data-field='ULDCount']").index();
        var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
        var FBLAWBSNoIndex = Rowtr.find("th[data-field='FBLAWBSNo']").index();
        var IsManifestedIndex = Rowtr.find("th[data-field='IsManifested']").index();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            chkSelect = true;
        }


        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();

        /*Following is added by Brajendra*/
        cfi.SaveUpdateLockedProcess(0, GroupFlightSNo, "", "", userContext.UserSNo, subprocesssno, subprocess, "0", "");

        // if ($(tr).find('td:eq(' + IsManifestedIndex + ')').text() == 0) {
        LIArray.push({
            isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
            AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
            DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
            TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
            PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
            ActualVolumeWt: AV,
            ActualGrossWt: AG,
            ActualCBM: ACBM,
            PlannedGrossWt: PG,
            PlannedVolumeWt: PV,
            PlannedCBM: PCBM,
            MovementType: 2,
            ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
            SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
            Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
            ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
            Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
            UpdatedBy: 2,
            Remarks: $(tr).find('td[data-column="Remarks"] input[type=hidden]').val() == "" ? null : $(tr).find('td[data-column="Remarks"]  input[type=hidden]').val(),
            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
            ULDCount: $(tr).find('td:eq(' + ULDCountIndex + ') input[type="text"]').val(),
            FBLAWBSNo: $(tr).find('td:eq(' + FBLAWBSNoIndex + ')').text(),
            FPSNo: $(tr).find('td[data-column="FPSNo"]').text(),
            McBookingSNo: $(tr).find('td[data-column="McBookingSNo"]').text(),
            IsManifested: $(tr).find('td[data-column="IsManifested"]').text(),
            AWBReferenceBookingSNo: $(tr).find('td[data-column="AWBReferenceBookingSNo"]').text()


        });
        // }

    });
    var LyingArray = new Array();
    var OSCLyingArray = new Array();
    $('#divLyingDetail .k-grid-content table tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNo = $('#hdnFlightSNo').val();
        // var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PiecesIndex = Rowtr.find("th[data-field='OLCPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            chkSelect = true;
        }
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            LyingArray.push({
                isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                DailyFlightSNo: DailyFlightSNo,
                TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                ActualVolumeWt: AV,
                ActualGrossWt: AG,
                ActualCBM: ACBM,
                PlannedGrossWt: PG,
                PlannedVolumeWt: PV,
                PlannedCBM: PCBM,
                MovementType: 2,
                ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                UpdatedBy: 2,
                FPSNo: $(tr).find('td[data-column="FPSNo"]').text(),
                McBookingSNo: $(tr).find('td[data-column="McBookingSNo"]').text()

            });
        }
        // }
        //if($($(tr).).prop('checked'))
        //  alert(tr);

    });
    $('#divOSCDetail .k-grid-content table tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNo = $('#hdnFlightSNo').val();
        // var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PiecesIndex = Rowtr.find("th[data-field='OLCPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            chkSelect = true;
        }
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            OSCLyingArray.push({
                isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                DailyFlightSNo: DailyFlightSNo,
                TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                ActualVolumeWt: AV,
                ActualGrossWt: AG,
                ActualCBM: ACBM,
                PlannedGrossWt: PG,
                PlannedVolumeWt: PV,
                PlannedCBM: PCBM,
                MovementType: 2,
                ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                UpdatedBy: 2,
                FPSNo: $(tr).find('td[data-column="FPSNo"]').text(),
                McBookingSNo: $(tr).find('td[data-column="McBookingSNo"]').text()

            });
        }
        // }
        //if($($(tr).).prop('checked'))
        //  alert(tr);

    });
    if (chkSelect) {

        //if (IsLITobeRefersh) {
        //    ShowMessage('warning', 'Warning', "Some changes have been made at Build-UP. Kindly refresh the page to proceed with Loading Instruction.", "bottom-right");
        //    flag = false;
        //} else {

        if (FlightCloseFlag == "PRE") {
            ShowMessage('warning', 'Warning -Pre-Manifest already created for flight.', " No more changes allowed ", "bottom-right");
            flag = false;
        }
        else
            if (FlightCloseFlag == "MAN") {
                ShowMessage('warning', 'Warning -Manifest already created for flight.', " No more changes allowed ", "bottom-right");
                flag = false;
            }
            //else if (FlightCloseFlag == "DEP")
            //{
            //    ShowMessage('warning', 'Warning -Pre-Manifest already created for flight.', " No more changes allowed ", "bottom-right");
            //    flag = false;
            //}
            else {
                if (fn_CheckWeightValidation()) {
                    $.ajax({
                        url: "Services/FlightControl/FlightControlService.svc/SavePreMenifestInformation", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ LIInfo: LIArray, LyingInfo: LyingArray, OSCLyingInfo: OSCLyingArray, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val() }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            $('#btnSave').removeAttr('disabled');
                            var ResultStatus = result.split('?')[0];
                            var ResultValue = result.split('?')[1];
                            if (ResultStatus == "0") {
                                ShowMessage('success', 'Success -Loading Instruction created successfully', "Processed Successfully", "bottom-right");
                                flag = true;

                            }
                            else if (ResultStatus == "1")//for Capacity Check
                            {
                                var msgString = '';
                                var AWBArray = ResultValue.split('@')[0];
                                var AircraftType = ResultValue.split('@')[1].split('^')[0];
                                var SHC = ResultValue.split('@')[1].split('^')[1];
                                ShowMessage('warning', 'Warning', "SHC '" + SHC + "' can not be loaded in this Aircraft", "bottom-right");
                                flag = false;
                            }
                            else if (ResultStatus == "2")//for Capacity Check
                            {
                                var AWBArray = ResultValue.split('@')[0];
                                var AircraftType = ResultValue.split('@')[1].split('^')[0];
                                var SHC = ResultValue.split('@')[1].split('^')[1];

                                ShowMessage('warning', 'Warning', "AWB '" + AWBArray + "' with SHC '" + SHC + "' exceeds the permissible weight in the Aircraft '" + AircraftType + "'", "bottom-right");

                            }
                            else if (ResultStatus == "3")//for CargoClassification 'PAX' Check with 'CAO'
                            {
                                ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

                            }
                            else if (ResultStatus == "4")//for comman Message
                            {
                                ShowMessage('warning', "Warning ", ResultValue, "bottom-right");

                            }
                            else {
                                ShowMessage('warning', 'Warning - Loading Instruction could not be created', " ", "bottom-right");
                                flag = false;
                            }
                        },
                        error: function (xhr) {
                            ShowMessage('warning', 'Warning -Loading Instruction could not be created', " ", "bottom-right");
                            flag = false;
                        }
                    });
                }
            }
        // }
    }
    else {
        ShowMessage('warning', 'Warning -Select a shipment to prepare Loading Instruction', " ", "bottom-right");
        flag = false;
    }
    $('#btnSave').removeAttr('disabled');
    return flag;
}

function fn_DisableCount(input) {
    var trHeader = $(input).closest("div.k-grid").find("div.k-grid-header");
    var ULDCountIndex = trHeader.find("th[data-field='ULDCount']").index();
    var Rowtr = $(input).closest('tr');
    if ($(input).val() == "BULK")
        $(Rowtr).find('td:eq(' + ULDCountIndex + ') input[id="txt_ULDCount"]').val('').attr('disabled', 1);
    else
        $(Rowtr).find('td:eq(' + ULDCountIndex + ') input[id="txt_ULDCount"]').removeAttr('disabled');
}

function UploadLyingInfo() {
    var flag = false;
    var LyingArray = new Array();
    $('#divDetail .k-grid-content table tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNo = $('#hdnFlightSNo').val();
        var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            LyingArray.push({
                isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                DailyFlightSNo: DailyFlightSNo,
                TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                ActualVolumeWt: AV,
                ActualGrossWt: AG,
                ActualCBM: ACBM,
                PlannedGrossWt: PG,
                PlannedVolumeWt: PV,
                PlannedCBM: PCBM,
                MovementType: 2,
                ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                UpdatedBy: 2
            });
        }
        // }
        //if($($(tr).).prop('checked'))
        //  alert(tr);

    });

    //  console.log(JSON.stringify(ManifestArray));
    //alert(JSON.stringify(LyingArray));

    if (LyingArray.length > 0) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/SaveLyingInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ LyingListInfo: LyingArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success -Lying list created successfully', "Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Lying list could not be created ', " ", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Lying list could not be created ', " ", "bottom-right");
                flag = false;
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning -Select a shipment to prepare Lying List ', " ", "bottom-right");
        flag = false;
    }
    return flag;
}

function fn_CheckNum(input) {
    var flag = true;
    if ($(input).val() != "") {
        if (!$.isNumeric($(input).val())) {
            $(input).val(0);
            //alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            flag = false;
        }
    }
    return flag;
}

function fn_CalGVCBMForLI(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    ///////change on 13-07-2016 for manage RCS Without Calculation/////////

    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCBMWIndex = trRow.find("th[data-field='PCBMW']").index();
    var PGW = parseFloat($(input).closest('tr').find('td:eq(' + PGWIndex + ')').text());
    var PVW = parseFloat($(input).closest('tr').find('td:eq(' + PVWIndex + ')').text());
    var PCBMW = parseFloat($(input).closest('tr').find('td:eq(' + PCBMWIndex + ')').text());

    //////////////////////////////
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var row_index = $(input).closest('tr').index();
    // alert(row_index);
    var PlannedActualPcs = 0, TotalPG = 0, TotalPV = 0, TotalPCBM = 0;
    $(input).closest('tbody').find("tr").each(function (row, tr) {

        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if (row != row_index) {
                if ($(tr).find('td:eq(' + ULDStockIndex + ')').text() == 0) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                    TotalPG = TotalPG + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    TotalPV = TotalPV + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    TotalPCBM = TotalPCBM + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
            }

            // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        }
    });
    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + hdnTotalPiecesIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {
            // if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + hdnTotalPiecesIndex + ')').text())  ) {
            if ($(input).val() > (totalPcs - PlannedActualPcs)) {
                ShowMessage('warning', 'Warning -Planned Pieces should be Less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                fn_CalGVCBMForLI(input);
                // fn_ResetPiece(input);
                flag = false;
            }

            else {
                if ($(input).val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned pieces should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else if (PG.val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned Gross Weight should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else if (PV.val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned Volume Weight should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else if (PCBM.val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned CBM should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else {

                    //PG.val(parseFloat(((parseFloat(ActualG_V_CBM[0])-parseFloat(TotalPG)) / (totalPcs-PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    //PV.val(parseFloat(((parseFloat(ActualG_V_CBM[1]) -parseFloat(TotalPV)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    //PCBM.val(parseFloat(((parseFloat(ActualG_V_CBM[2]) - parseFloat(TotalPCBM)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));

                    ////// change on 13-7-2016 for RCS without Flight///////
                    PG.val(parseFloat(((PGW - parseFloat(TotalPG)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(1));
                    PV.val(parseFloat(((PVW - parseFloat(TotalPV)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(2));
                    PCBM.val(parseFloat(((PCBMW - parseFloat(TotalPCBM)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    //////////////

                    flag = true;
                }


            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            fn_CalGVCBMForLI(input);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    // fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    return flag;

}

function fn_ResetPiece_Backup(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    var row_index = $(input).closest('tr').index();
    // alert(row_index);
    var PlannedActualPcs = 0, TotalPG = 0, TotalPV = 0, TotalPCBM = 0;
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if (row != row_index) {
                if ($(tr).find('td:eq(' + ULDStockIndex + ')').text() == 0) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                    TotalPG = TotalPG + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    TotalPV = TotalPV + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    TotalPCBM = TotalPCBM + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
            }

            // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        }
    });

    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs - PlannedActualPcs).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(parseFloat(ActualG_V_CBM[0]) - parseFloat(TotalPG)).toFixed(3)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(parseFloat(ActualG_V_CBM[1]) - parseFloat(TotalPV)).toFixed(3)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(parseFloat(ActualG_V_CBM[2]) - parseFloat(TotalPCBM)).toFixed(3)).focus();
        chkFlag = false;
    }

}

function fn_ResetPiece(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    ///////change on 13-07-2016 for manage RCS Without Calculation/////////

    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCBMWIndex = trRow.find("th[data-field='PCBMW']").index();
    var PGW = parseFloat($(input).closest('tr').find('td:eq(' + PGWIndex + ')').text());
    var PVW = parseFloat($(input).closest('tr').find('td:eq(' + PVWIndex + ')').text());
    var PCBMW = parseFloat($(input).closest('tr').find('td:eq(' + PCBMWIndex + ')').text());

    //////////////////////////////
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    var row_index = $(input).closest('tr').index();
    // alert(row_index);
    var PlannedActualPcs = 0, TotalPG = 0, TotalPV = 0, TotalPCBM = 0;
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if (row != row_index) {
                if ($(tr).find('td:eq(' + ULDStockIndex + ')').text() == 0) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                    TotalPG = TotalPG + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    TotalPV = TotalPV + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    TotalPCBM = TotalPCBM + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
            }

            // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        }
    });

    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "" || $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < 0) {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs - PlannedActualPcs).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(PGW - parseFloat(TotalPG)).toFixed(1)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(PVW - parseFloat(TotalPV)).toFixed(2)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(PCBMW - parseFloat(TotalPCBM)).toFixed(3)).focus();
        chkFlag = false;
    }

}

function fn_ResetPre_Man(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPPcs']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCCBMIndex = trRow.find("th[data-field='PCCBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGW = $(input).closest('tr').find('td:eq(' + PGWIndex + ')').text();
    var PVW = $(input).closest('tr').find('td:eq(' + PVWIndex + ')').text();
    var PCCBM = $(input).closest('tr').find('td:eq(' + PCCBMIndex + ')').text();
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "" || $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < 0) {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs);
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(PGW).toFixed(1));
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(PVW).toFixed(2));
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(PCCBM).toFixed(3));
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }

}


//
function fn_CalculateOLCGVCBM(input) {

    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        var er = /^-?[0-9]+$/;
        if (!er.test(PlannedPcs) && PlannedPcs != "") {
            $(input).val(totalPcs);
            return false;
        }
        if ($(input).val() != 0 && $(input).val() > 0) {
            if ($.isNumeric($(input).val())) {
                //alert($(input).attr('id'))

                if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text())) {
                    // alert("Planned pieces should be less than Total Pieces ");
                    ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                    $(input).val(totalPcs);
                    fn_CalculateOLCGVCBM(input);
                    //PG.val(0);
                    //PV.val(0);
                    //PCBM.val(0);
                    flag = false;
                }

                else {

                    PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(1));
                    PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(2));
                    PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                    flag = true;
                }
            }
            else {
                // alert("Enter Valid Number");
                ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculateOLCGVCBM(input);
                //PG.val(0);
                //PV.val(0);
                //PCBM.val(0);
                flag = false;

            }
        }
        else {
            $(input).val(totalPcs);
            fn_CalculateOLCGVCBM(input);
        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}

//Calculation for OLC

function fn_Cal_GVCBMOnOLC(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var TotalPPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PGW = ActualG_V_CBM[0];
    var PVW = ActualG_V_CBM[1];
    var PCCBM = ActualG_V_CBM[2];
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            if ($(input).val() != 0 && $(input).val() > 0) {
                if (($(input).attr('id') == "txtPG") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PGW)) {
                        ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                        $(input).val(parseFloat(PGW).toFixed(1));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PV.val(parseFloat(PVW).toFixed(2));
                        PCBM.val(parseFloat(PCCBM).toFixed(3));
                    }
                    else
                        if ($(input).val() == parseFloat(PGW)) {
                            $(input).val(parseFloat(PGW).toFixed(1));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PV.val(parseFloat(PVW).toFixed(2));
                            PCBM.val(parseFloat(PCCBM).toFixed(3));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPV") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PVW)) {
                        ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                        $(input).val((parseFloat(PVW)).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(1));
                        PCBM.val(parseFloat(PCCBM).toFixed(3));
                    }
                    else
                        if ($(input).val() == parseFloat(PVW)) {
                            $(input).val((parseFloat(PVW)).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(1));
                            PCBM.val(parseFloat(PCCBM).toFixed(3));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPCBM") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PCCBM)) {
                        ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                        $(input).val((parseFloat(PCCBM)).toFixed(3));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(1));
                        PV.val(parseFloat(PVW).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PCCBM)) {
                            $(input).val((parseFloat(PCCBM)).toFixed(3));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(1));
                            PV.val(parseFloat(PVW).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else {

                    PG.val(parseFloat(PGW).toFixed(1));
                    PV.val(parseFloat(PVW).toFixed(2));
                    PCBM.val(parseFloat(PCCBM).toFixed(3));

                    return true;
                }
            }
            else {
                $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                PG.val(parseFloat(PGW).toFixed(1));
                PV.val(parseFloat(PVW).toFixed(2));
                PCBM.val(parseFloat(PCCBM).toFixed(3));
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  PG.val(parseFloat(PGW).toFixed(2));
            // PV.val(parseFloat(PVW).toFixed(2));
            // PCBM.val(parseFloat(PCCBM).toFixed(2));
            // fn_Cal_GVCBMOnPRE_MAN(input);
            flag = false;
            // flag = false;

        }

    }
    return flag;
}

function fn_ResetOLCPcs(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGW = ActualG_V_CBM[0];
    var PVW = ActualG_V_CBM[1];
    var PCCBM = ActualG_V_CBM[2];
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "" || $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < 0) {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs);
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(PGW).toFixed(1));
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(PVW).toFixed(2));
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(PCCBM).toFixed(3));
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }

}

//

function fn_CalculatePREGVCBM(input) {

    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {
            //alert($(input).attr('id'))

            if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text())) {
                // alert("Planned pieces should be less than Total Pieces ");
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculatePREGVCBM(input);
                //PG.val(0);
                //PV.val(0);
                //PCBM.val(0);
                flag = false;
            }

            else {

                PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(1));
                PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(2));
                PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                flag = true;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            fn_CalculatePREGVCBM(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}
//Calculate GVCBM for Mainfest and Premanifest
function fn_CalPRE_Man_GVCBM(input) {
    // fn_GetPOMAilDNDetails(0, 122, input, 'BUILDUP');//Testing
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var TotalPPcsIndex = trRow.find("th[data-field='TotalPPcs']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCCBMIndex = trRow.find("th[data-field='PCCBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGW = $(input).closest('tr').find('td:eq(' + PGWIndex + ')').text();
    var PVW = $(input).closest('tr').find('td:eq(' + PVWIndex + ')').text();
    var PCCBM = $(input).closest('tr').find('td:eq(' + PCCBMIndex + ')').text();
    var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text();
    var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
    var er = /^-?[0-9]+$/;
    if (!er.test(PlannedPcs) && PlannedPcs != "") {
        $(input).val(totalPcs);
        return false;
    }
    if ($(input).val() != "") {
        if ($(input).val() != 0 && $(input).val() > 0) {
            if ($.isNumeric($(input).val())) {
                //alert($(input).attr('id'))

                if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text())) {
                    // alert("Pieces cannot be Planned pieces");
                    ShowMessage('warning', 'Warning -Planned Pieces should be less than Total Pieces', " ", "bottom-right");
                    $(input).val(totalPcs);
                    //fn_CalculatePREGVCBM(input);
                    fn_CalPRE_Man_GVCBM(input);
                    flag = false;
                }
                else {

                    PG.val(parseFloat((PGW) / ($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) * PlannedPcs).toFixed(1));
                    PV.val(parseFloat(PVW / ($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) * PlannedPcs).toFixed(2));
                    PCBM.val(parseFloat(PCCBM / ($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) * PlannedPcs).toFixed(3));
                    flag = true;
                }
            }
            else {
                // alert("Enter Valid Number");
                ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalPRE_Man_GVCBM(input);
                //fn_CalculatePREGVCBM(input);
                flag = false;

            }
        }
        else {
            $(input).val(totalPcs);
            fn_CalPRE_Man_GVCBM(input);
        }
    }

    // fn_CalculateSplitTotalPcs(input);
    return flag;

}


///Created on 3-2-2016
function fn_Cal_GVCBM(input) {
    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + hdnTotalPiecesIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {



            var Plann_PG = (parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(1));
            var Plann_PV = (parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(2));
            var Plann_PCBM = (parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));


            if (($(input).attr('id') == "txtPG") && ($(input).val() > parseFloat(Plann_PG))) {
                // alert("Planned Gross Weight should be less than Total Gross Weight ");
                ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                $(input).val(Plann_PG);
                // fn_Cal_GVCBM(input);
                flag = false;
            }
            else if (($(input).attr('id') == "txtPV") && ($(input).val() > parseFloat(Plann_PV))) {
                // alert("Planned Volume Weight should be less than Total Volume Weight");
                ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                $(input).val(Plann_PV);
                // fn_Cal_GVCBM(input);
                flag = false;
            }
            else if (($(input).attr('id') == "txtPCBM") && ($(input).val() > parseFloat(Plann_PCBM))) {
                // alert("Planned CBM should be less than Total CBM ");
                ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                $(input).val(Plann_PCBM);
                // fn_Cal_GVCBM(input);
                flag = false;
            }
            else {

                //  PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(3));
                //   PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(3));
                //   PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                flag = true;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            //fn_CalculateGVCBM(input);
            fn_CalGVCBMForLI(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}
////

function fn_CalculateGVCBM(input) {

    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {
            //alert($(input).attr('id'))

            if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text())) {
                // alert("Planned pieces should be less than Total Pieces ");
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculateGVCBM(input);
                //PG.val(0);
                //PV.val(0);
                //PCBM.val(0);
                flag = false;
            }

            else {

                PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(1));
                PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(2));
                PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                flag = true;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            fn_CalculateGVCBM(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}
function fn_Cal_GVCBM1_Backup(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PVN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBMN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').css('border-color', '');

    var NextRow = $(input).closest('tr').next().index();
    var last_index = 0;
    var EFlag = 0;
    var PlanGrossWT = 0, PlanVolWT = 0, PlanCBMWT = 0, TotalGWT = 0;
    var RemPlanGWT = 0, RemPlanVWT = 0, RemPlanCBMWT = 0;
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0) {
                if (row != NextRow) {
                    PlanGrossWT = PlanGrossWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    PlanVolWT = PlanVolWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    PlanCBMWT = PlanCBMWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
                if (row != $(input).closest('tr').index()) {
                    RemPlanGWT = RemPlanGWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    RemPlanVWT = RemPlanVWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    RemPlanCBMWT = RemPlanCBMWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }

                last_index = $(tr).index();
            }
        }
    });
    var RemainningGWT = parseFloat(ActualG_V_CBM[0]) - PlanGrossWT;
    var RemainningVWT = parseFloat(ActualG_V_CBM[1]) - PlanVolWT;
    var RemainningCBMWT = parseFloat(ActualG_V_CBM[2]) - PlanCBMWT;
    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            var Plann_PG = parseFloat(RemainningGWT).toFixed(3);
            var Plann_PV = parseFloat(RemainningVWT).toFixed(3);
            var Plann_PCBM = parseFloat(RemainningCBMWT).toFixed(3);
            if (($(input).attr('id') == "txtPG") && (RemainningGWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                $(input).val((parseFloat(ActualG_V_CBM[0]) - RemPlanGWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPV") && (RemainningVWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                $(input).val((parseFloat(ActualG_V_CBM[1]) - RemPlanVWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPCBM") && (RemainningCBMWT < 0)) {
                ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                $(input).val((parseFloat(ActualG_V_CBM[2]) - RemPlanCBMWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else {
                if (EFlag != 1) {
                    if ($(input).closest('tr').index() == last_index) {

                        PG.val(parseFloat(ActualG_V_CBM[0] - parseFloat(RemPlanGWT)).toFixed(3));
                        PV.val(parseFloat(ActualG_V_CBM[1] - parseFloat(RemPlanVWT)).toFixed(3));
                        PCBM.val(parseFloat(ActualG_V_CBM[2] - parseFloat(RemPlanCBMWT)).toFixed(3));

                    }
                    else {
                        //if (Plann_PG == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Gross Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PV == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Volume Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PCBM == 0) {
                        //    ShowMessage('warning', 'Warning -Planned CBM should be grater than 0', " ", "bottom-right");
                        //}
                        // PGN.val(parseFloat(Plann_PG + incVal).toFixed(3));
                        PGN.val(Plann_PG);
                        PVN.val(Plann_PV);
                        PCBMN.val(Plann_PCBM);
                    }
                }
                return true;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  $(input).val(totalPcs);
            fn_CalGVCBMForLI(input);
            flag = false;

        }
    }
    return flag;
}

function fn_Cal_GVCBM1(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PVN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBMN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    //for ristrict update BUP Shipment
    var NewULDStockSNo = $(input).closest('tr').next().find('td:eq(' + ULDStockSNoIndex + ')').text();
    ///////change on 13-07-2016 for manage RCS Without Calculation/////////

    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCBMWIndex = trRow.find("th[data-field='PCBMW']").index();
    var PGW = parseFloat($(input).closest('tr').find('td:eq(' + PGWIndex + ')').text()).toFixed(1);
    var PVW = parseFloat($(input).closest('tr').find('td:eq(' + PVWIndex + ')').text()).toFixed(2);
    var PCBMW = parseFloat($(input).closest('tr').find('td:eq(' + PCBMWIndex + ')').text()).toFixed(3);

    //////////////////////////////
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').css('border-color', '');

    var NextRow = $(input).closest('tr').next().index();
    var last_index = 0;
    var EFlag = 0;
    var PlanGrossWT = 0, PlanVolWT = 0, PlanCBMWT = 0, TotalGWT = 0;
    var RemPlanGWT = 0, RemPlanVWT = 0, RemPlanCBMWT = 0;
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0) {
                if (row != NextRow) {
                    PlanGrossWT = parseFloat(parseFloat(PlanGrossWT) + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val())).toFixed(1);
                    PlanVolWT = parseFloat(parseFloat(PlanVolWT) + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val())).toFixed(2);
                    PlanCBMWT = parseFloat(parseFloat(PlanCBMWT) + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val())).toFixed(3);
                }
                if (row != $(input).closest('tr').index()) {
                    RemPlanGWT = parseFloat(parseFloat(RemPlanGWT) + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val())).toFixed(1);
                    RemPlanVWT = parseFloat(parseFloat(RemPlanVWT) + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val())).toFixed(2);
                    RemPlanCBMWT = parseFloat(parseFloat(RemPlanCBMWT) + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val())).toFixed(3);
                }

                last_index = $(tr).index();
            }
        }
    });
    var RemainningGWT = PGW - PlanGrossWT;
    var RemainningVWT = PVW - PlanVolWT;
    var RemainningCBMWT = PCBMW - PlanCBMWT;
    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            var Plann_PG = parseFloat(RemainningGWT).toFixed(1);
            var Plann_PV = parseFloat(RemainningVWT).toFixed(2);
            var Plann_PCBM = parseFloat(RemainningCBMWT).toFixed(3);
            if (($(input).attr('id') == "txtPG") && (RemainningGWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                $(input).val((PGW - RemPlanGWT).toFixed(1));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPV") && (RemainningVWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                $(input).val((PVW - RemPlanVWT).toFixed(2));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPCBM") && (RemainningCBMWT < 0)) {
                ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                $(input).val((PCBMW - RemPlanCBMWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else {
                if (EFlag != 1) {
                    if ($(input).closest('tr').index() == last_index) {

                        PG.val((PGW - parseFloat(RemPlanGWT)).toFixed(1));
                        PV.val((PVW - parseFloat(RemPlanVWT)).toFixed(2));
                        PCBM.val((PCBMW - parseFloat(RemPlanCBMWT)).toFixed(3));

                    }
                    else {
                        //if (Plann_PG == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Gross Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PV == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Volume Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PCBM == 0) {
                        //    ShowMessage('warning', 'Warning -Planned CBM should be grater than 0', " ", "bottom-right");
                        //}
                        // PGN.val(parseFloat(Plann_PG + incVal).toFixed(3));

                        if (NewULDStockSNo == 0) { //for ristrict update BUP Shipment

                            PGN.val(Plann_PG);
                            PVN.val(Plann_PV);
                            PCBMN.val(Plann_PCBM);
                        }
                    }
                }
                return true;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  $(input).val(totalPcs);
            fn_CalGVCBMForLI(input);
            flag = false;

        }
    }
    return flag;
}

function fn_CheckWeightValidation() {
    var chkFlag = true;
    var CheckArray = new Array();
    $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        var PlanPcsIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').css('border-color', '');
        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').css('border-color', '');
        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').css('border-color', '');

        // if ($(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').val() =="") {
        //     ShowMessage('warning', 'Warning -Planned Pieces should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        // else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        //     ShowMessage('warning', 'Warning -Planned Gross Weight should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        // else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        //     ShowMessage('warning', 'Warning -Planned Volume Weight should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        // else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        //     ShowMessage('warning', 'Warning -Planned CBM should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        //else 
        if ($(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned Pieces should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').focus().css('border-color', 'red');
            chkFlag = false;
        }
        else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned Gross Weight should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').focus().css('border-color', 'red');
            chkFlag = false;
        }
        else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned Volume Weight should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').focus().css('border-color', 'red');
            chkFlag = false;
        }
        else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned CBM should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').focus().css('border-color', 'red');
            chkFlag = false;
        }

    });
    return chkFlag;
}


function fn_CalculateSplitTotalPcs(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();
        // alert(row_index);
        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                if (row != row_index) {

                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
            }
        });
        //alert(PlannedPcs);
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                //    alert("Planned pieces should be less than Total Pieces ");
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                fn_CalGVCBMForLI(input);
                flag = false;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            // fn_CalculateGVCBM(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    return flag;
}
function fn_CheckOffloadPCS(input) {
    var tr = $(input).closest('tr');
    var trHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TPcsIndex = trHeader.find("th[data-field='TotalPPcs']").index();
    var PlannedPiecesIndex = trHeader.find("th[data-field='PlannedPieces']").index();
    var BulkIndex = trHeader.find("th[data-field='Bulk']").index();
    var chk = $(tr).find('td:eq(' + BulkIndex + ') input[type="checkbox"]');
    if ($(chk).prop("checked") == false) {
        $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val($(tr).find('td:eq(' + TPcsIndex + ')').text());
        fn_CalPRE_Man_GVCBM($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]'));
    }
}
var AWBSNo = 0;
function MarkSelected(input) {
    //debugger;

    IsBulkSelected = false;
    var td = $(input).parent();
    if (userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
        if (IsRFS) {
            var ULDCount = 0;
            if (!IsBulkSelected)
                fn_CheckRFSValidation(input);
        }
    }
    //if (IsPAX)
    //{
    //    var trGridHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //    var SHCIndex = trGridHeader.find("th[data-field='SHC']").index();
    //    var AWBNoIndex = trGridHeader.find("th[data-field='AWBNo']").index();
    //    var tr = $(input).closest('tr');
    //   // if ($(tr).find('td:eq(' + SHCIndex + ')').text() == "CAO")
    //    var SHC=','+$(tr).find('td:eq(' + SHCIndex + ')').text().toLowerCase()+',';    
    //    if (SHC.indexOf(",cao,") >= 0)
    //    {
    //        ShowMessage('warning', "Warning ","AWB '" + $(tr).find('td:eq(' + AWBNoIndex + ')').text() + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '"+$("#tdFlightNo").text()+"'/"+$("#tdFlightDate").text()+"", "bottom-right");
    //        $(input).prop('checked', false);
    //    }
    //    //IsPAX
    //}

    var trHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var setAWBSNo = (subprocess == "LOADINGINSTRUCTION" ? "SNo" : "AWBSNo");
    var AWBSNoIndex = trHeader.find("th[data-field='" + setAWBSNo + "']").index();
    AWBSNo = $(input).closest('tr').find('td:eq(' + AWBSNoIndex + ')').text();
    //var chkboxIndex = trHeader.find("th[data-field='Bulk']").index();
    // var isChecked = $(input).closest('tr').find('td:eq(' + chkboxIndex + ')').find("[id='" + input.id + "']").is(":checked");




    /*Following is added by Brajendra for locked AWBNo*/
    var msg = cfi.GetAWBLockedEvent(userContext.UserSNo, AWBSNo, CurrentFlightSno, "", "", "");
    if (msg == "Fail") { $(input).attr("checked", false); return false };
    cfi.SaveUpdateLockedProcess(AWBSNo, "", "", "", userContext.UserSNo, subprocesssno, subprocess, $(input).is(":checked") == true ? 1 : 0, "");
    /*End*/

    if ($(td).find('input[type="hidden"]').val() == "true") {
        // alert('Shipment onhold');
        var HoldRemarksIndex = trHeader.find("th[data-field='HOLDRemarks']").index();
        var AWBSNoIndex = trHeader.find("th[data-field='AWBSNo']").index();
        var AWBNoIndex = trHeader.find("th[data-field='AWBNo']").index();
        var TotalPPcsIndex = trHeader.find("th[data-field='TotalPPcs']").index() == -1 ? trHeader.find("th[data-field='OLCPieces']").index() : trHeader.find("th[data-field='TotalPPcs']").index();
        var PlannedPiecesIndex = trHeader.find("th[data-field='PlannedPieces']").index();



        if ((SaveProcessStatus == "PRE" && $("#btnSave").text().toUpperCase() == "SAVE MANIFEST") || SaveProcessStatus == "MAN") {
            var ProcessedPCs;
            if (trHeader.find("th[data-field='OLCPieces']").index() > -1)
                ProcessedPCs = 0;
            else
                ProcessedPCs = SaveProcessStatus == "MAN" ? parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) : 0;
            var AvailableProcssPcs = fn_CheckOnHoldPcs($(input).closest('tr').find('td:eq(' + AWBSNoIndex + ')').text(), ProcessedPCs, "A");

            if (AvailableProcssPcs <= 0) {
                $(input).prop('checked', false);
                // ShowMessage('warning', "Warning -Shipment ", $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + ". cannot process", "bottom-right");
                ShowMessage('warning', "Warning -Shipment ", "Few pieces of shipment '" + $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text() + "' are '" + $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + "'.Kindly cross check and plan the remaining pieces accordingly", "bottom-right");
            } else if (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"] ').val()) > AvailableProcssPcs) {
                $(input).prop('checked', false);
                //  ShowMessage('warning', "Warning -Shipment ", $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + ". cannot process more than " + AvailableProcssPcs + " piece", "bottom-right");
                ShowMessage('warning', "Warning -Shipment ", "Few pieces of shipment '" + $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text() + "' are '" + $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + "'.Kindly cross check and plan the remaining pieces accordingly", "bottom-right");
            }
        }
        else {
            ShowMessage('warning', "Warning -Shipment ", "Few pieces of shipment '" + $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text() + "' are '" + $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + "'.Kindly cross check and plan the remaining pieces accordingly", "bottom-right");
        }
    }
}

function fn_CheckOnHoldPcs(AWBSNo, ProcessedPcs, ChkType) {
    var ProcessedPcsVal = 0;
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/fn_CheckOnHoldPcs",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AWBSNo: AWBSNo, ProcessedPcs: ProcessedPcs, ChkType: ChkType }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var Data = jQuery.parseJSON(result)
            var FinalData = Data.Table0
            ProcessedPcsVal = FinalData[0].AvailableProcssPcs;
        }
    });
    return parseInt(ProcessedPcsVal);
}

function fn_AirmailDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetAirMailPrintData",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ DailyFlightSNo: GroupFlightSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var Data = jQuery.parseJSON(result)
            var FinalData = Data.Table0
            var FinalData1 = Data.Table1
            //Added by Pankaj kumar ishwar on 04-02-2019 for run time logo
            $('#divDetailAirMailPrint').find('#ImgLogo').attr('src', '');
            $('#divDetailAirMailPrint').find('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData1[0]["AirlineLogo"]);
            $('#divDetailAirMailPrint').find('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/GaurdaCMS Logo.jpg";');
            if (FinalData.length > 0) {
                $('#spnflightno').text(FinalData[0].FlightNo)
                $('#spnflightdate').html(FinalData[0].FlightDate)
                $('#spnupliftstation').html(FinalData[0].ShipmentOrigin)
                $('#spnTotalPices').text(FinalData[0].TotalPieces)
                $('#spnTotalWeight').text(FinalData[0].TotalWeight)
                $('#spnTotalBegs').text(FinalData.length)
                $('#spnCompletedBy').text(FinalData[0].UserName)
                var i = 0
                $(FinalData).each(function (row, tr) {
                    i = parseInt(i) + 1;
                    $('#tr1').after('<tr>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.MailBegSrNo + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.CNNo + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.NoOfBages + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.ShipmentOrigin + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.ShipmentDest + '</td>' +

                        '<td style="border:1px solid black;text-align:center">' + tr.AO + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.CP + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.SC + '</td>' +
                        '</tr>')
                    if (i < 20) {
                        $('#trlast').prev('tr').remove();
                    }
                })
            }
        }
    })
}
var IsBulkSelected = false;
//var IsOSCBulkSelected = false;
//var IsLYBulkSelected = false;

function fn_CheckRFSValidation(input) {
    if (IsRFS) {
        var ULDCount = 0;
        $('#divDetail  div.k-grid-content   tr.k-detail-row table > tbody > tr > td:nth-child(2) input[type=checkbox]:checked').each(function (row, tr) {
            IsBulkSelected = true;
        });
        $('#divLyingDetail  div.k-grid-content   tr.k-detail-row table > tbody > tr > td:nth-child(2) input[type=checkbox]:checked').each(function (rowmain, trMain) {
            IsBulkSelected = true;

        });
        $('#divOSCDetail  div.k-grid-content   tr.k-detail-row table > tbody > tr > td:nth-child(2) input[type=checkbox]:checked').each(function (rowmain, trMain) {
            IsBulkSelected = true;
        });
        $('#divDetail  div.k-grid-content > table > tbody > tr[class~="k-master-row"] input[type=checkbox]:checked').each(function (row, tr) {
            ULDCount++;
            // alert('Plan='+row)
        });
        $('#divLyingDetail  div.k-grid-content > table > tbody > tr[class~="k-master-row"] input[type=checkbox]:checked').each(function (rowmain, trMain) {
            ULDCount++;
            //alert('Lying='+rowmain)

        });
        $('#divOSCDetail  div.k-grid-content > table > tbody > tr[class~="k-master-row"] input[type=checkbox]:checked').each(function (rowmain, trMain) {
            ULDCount++;
            //alert('OSC='+ rowmain)
        });

        // ULDCount = ULDCount + (IsBulkSelected == true ? 1 : 0) + (IsOSCBulkSelected == true ? 1 : 0) + (IsLYBulkSelected == true ? 1 : 0);
        ULDCount = ULDCount + (IsBulkSelected == true ? 1 : 0);//+ (IsOSCBulkSelected == true ? 1 : 0) + (IsLYBulkSelected == true ? 1 : 0);
        // alert(ULDCount);
        if (ULDCount > 11) {
            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
            $(input).prop('checked', false);
        }
    }
}

function checkOnHold(input) {

    var trHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ULDNo = $(input).closest('tr').find('td:eq(' + trHeader.find("th[data-field='ULDNo']").index() + ')').text();

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //var chkboxIndex = trHeader.find("th[data-field='isSelect']").index();
    //var isChecked = $(input).closest('tr').find('td:eq(' + chkboxIndex + ')').find("[id='" + input.id + "']").is(":checked")


    /*Following is added by Brajendra for locked AWBNo*/
    var msg = cfi.GetAWBLockedEvent(userContext.UserSNo, 0, 0, "", "", ULDNo);
    if (msg == "Fail") { $(input).attr("checked", false); return false };
    cfi.SaveUpdateLockedProcess(0, "", "", "", userContext.UserSNo, subprocesssno, subprocess, $(input).is(":checked") == true ? 1 : 0, ULDNo);
    /*End*/

    var td = $(input).parent();

    if (IsNarrowBody == true) {
        ShowMessage('warning', 'Warning -Shipment ', 'ULD can not be loaded on Narrow Body Aircraft.', "bottom-right");
        $(input).prop('checked', false);
    }
    else if ($(td).find('input[type="hidden"]').val().split('@')[0] != "0") {
        $(input).prop('checked', false);
        var msgString = '';
        var AWBArray = $(td).find('input[type="hidden"]').val().split('@')[0];
        var HOLDRemarksArray = $(td).find('input[type="hidden"]').val().split('@')[1];
        $(AWBArray.split('^')).each(function (r, i) {
            msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
        });
        msgString = '<table>' + msgString + '</table>';

        ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");

    }
    if (userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
        fn_CheckRFSValidation(input);
    }
    // $().each(function (row,tr) {

    //  });

}

function onDataBound(arg) {
    //  alert('test');
    var grid = $("#" + arg.sender.element[0].id + "").data("kendoGrid");
    var gridData = grid.dataSource.view();

    //var DailyFlightSNo = '';
    //
    //DailyFlightSNo.substr();
    // BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));
    //BindFlightChart('159594, 159595, 159596, 159597, 159598');
}

function ISNumeric(obj) {
    if ((event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105) && (event.which != 0 && event.which != 8)) {
        event.preventDefault();
    }
}

function GetReportData(FlightSNo) {
    $("#divDetailPop").html("");
    $("#divDetailPop").css('display', 'none');
    var FlightSNoArray = FlightSNo.split(',');
    $(FlightSNoArray).each(function (r, i) {
        //  if (r < (FlightSNoArray.length - 1)) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetPreReport?DailyFlightSNo=" + i, async: false, type: "get", dataType: "html", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //$("#btnPrint").closest('tr').hide();
                //$('#SecondTab').hide();
                //$('#OSCTab').hide();
                //$('#FlightStopOverDetailTab').hide();
                $("#divDetailPop").append(result);
                // console.log(result);

                //if (r == FlightSNoArray.length - 1) {
                //    $("#btnPrint").unbind("click").bind("click", function () {
                //        $("#divDetailPrint #divDetail").printArea();
                //    });
                //}
                //else {

                //    $("#divDetail").append('</br><div class="page-break"></div>');
                //}
                if (r < (FlightSNoArray.length - 1)) {
                    $("#divDetailPop").append('</br><div class="page-break"></div>');
                }
            },
            error: function (rex) {
                //   alert(rex);
            }
        });
        // }
    })
    printDiv('PreManifest');
    //$("#divDetail #btnPrint:last").closest('tr').show();
}
function GetLIReportData(FlightSNo) {
    $("#divDetailPop").html("");
    $("#divDetailPop").css('display', 'none');
    //$("#divDetail").html("");
    var FlightSNoArray = FlightSNo.split(',');


    if (userContext.SysSetting.ClientEnvironment == "G9") {
        $(FlightSNoArray).each(function (r, i) {
            // if (r < (FlightSNoArray.length - 1)) {
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/GetG9LIReport?DailyFlightSNo=" + i,
                async: false,
                type: "get",
                dataType: "json",
                cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //  $("#btnPrint").closest('tr').hide();
                    // $('#SecondTab').hide();
                    //$('#OSCTab').hide();
                    // $('#FlightStopOverDetailTab').hide();
                    //var DivID = 'grid';
                    //$('#' + DivID).html('');
                    if (result.substring(1, 0) == "{") {


                        var ResultData = jQuery.parseJSON(result)
                        if (ResultData.Table0.length > 0) {
                            var Data = ResultData.Table0;
                            //$(ResultData.Table0).each(function (row, tr) {
                            $.ajax({
                                url: "../Client/" + userContext.SysSetting.ClientEnvironment + "/FlightControl/LIPrint.html",
                                //url: "../Client/G9/FlightControl/LIPrint.html",
                                async: false,
                                type: "get",
                                cache: false,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {

                                    var TotalGrossWeight = 0,
                                        TotalPieces = 0,
                                        TotalRevenue = 0,
                                        GTotal = 0,
                                        RateCountCol = 0,
                                        CustomsCharges = 0,
                                        NetPayableTotal = 0,
                                        InterlineTotal = 0;
                                    $("#divDetailPop").append(result);
                                    $(ResultData.Table0).each(function (row, tr) {

                                        var HtmlData = $('#divDetailPop').find('div[id="divLIReport"]');
                                        var Data = tr;
                                        $(HtmlData).find('#ImgLogo').attr('src', '');
                                        $(HtmlData).find('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + Data.AirlineLogo);
                                        $(HtmlData).find('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/aaa.jpg";');

                                        $(HtmlData).find("#spLoadPlan").text(Data.FlightNo + " / " + Data.FlightDate);
                                        $(HtmlData).find("#spOLOD").text(Data.FlightOrigin + " / " + Data.FlightDestination);
                                        $(HtmlData).find("#spFlightNo").text(Data.FlightNo);
                                        $(HtmlData).find("#spETD").text(Data.ETD);
                                        TotalGrossWeight = TotalGrossWeight + parseFloat(Data.PlannedGrossWeight);
                                        TotalPieces = TotalPieces + parseFloat(Data.PlannedPieces);
                                        $(HtmlData).find('#bodyLIReport').append('<tr>' +
                                            '<td class= "ui-widget-content" >' + Data.AWBNo + '</td>' +
                                            '<td class="ui-widget-content">' + Data.RPTPIECES + '</td>' +
                                            '<td class="ui-widget-content">' + Data.RPTGrossWeight + '</td>' +
                                            '<td class="ui-widget-content">' + Data.Commodity + '</td>' +
                                            //'<td class="ui-widget-content">' + Data.SPHC + '</td>' +
                                            '<td class="ui-widget-content">' + Data.Remarks + '</td>' +
                                            '<td class="ui-widget-content">' + Data.FlightRemarks + '</td>' +
                                            '<td class="ui-widget-content">' + Data.Priority + '</td>' +

                                            '</tr >');

                                        $(HtmlData).find("#tdTotalPieces").text(TotalPieces + 'P');
                                        $(HtmlData).find("#tdTotalGrossWeight").text(TotalGrossWeight.toFixed(2) + 'K');
                                    });
                                }
                            });
                            //});
                        }
                    }
                    // $("#divDetailPop").append(result);
                    //// console.log(result);

                    if (r < (FlightSNoArray.length - 1)) {
                        $("#divDetailPop").append('</br><div class="page-break"></div>');
                    }
                },
                error: function (rex) {
                    //   alert(rex);
                }
            });
            // }
        })
    }
    else {
        $(FlightSNoArray).each(function (r, i) {
            // if (r < (FlightSNoArray.length - 1)) {
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/GetLIReport?DailyFlightSNo=" + i,
                async: false,
                type: "get",
                dataType: "html",
                cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != null && result != "") {
                        $("#tdbtnliSendMail").show();
                    }
                    else {
                        $("#tdbtnliSendMail").hide();
                    }
                    $("#divDetailPop").append(result);
                }
            });
        });
    }
    printDiv('LoadingInstruction');
    // $("#divDetailPop #btnPrint:last").closest('tr').show();
}

function PrintManifestReportHTML(index) {

    $.ajax({
        // url: "HtmlFiles/Export/ManifestPrint.html", async: false, type: "get", dataType: "json", cache: false,

        url: "HtmlFiles/Export/ManifestPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#divDetailPop").append(result);
            $('#divDetailPop  #ImgLogo').attr('id', 'ImgLogo_' + index)
            $('#divDetailPop  #tdFT').attr('id', 'tdFT_' + index)
            $('#divDetailPop  #tdNatinality').attr('id', 'tdNatinality_' + index)
            $('#divDetailPop  #tdOwner').attr('id', 'tdOwner_' + index)
            $('#divDetailPop  #tdPointOfLoading').attr('id', 'tdPointOfLoading_' + index)
            $('#divDetailPop  #tdTotalPcs').attr('id', 'tdTotalPcs_' + index)
            $('#divDetailPop  #tdPointofUnloading').attr('id', 'tdPointofUnloading_' + index)
            $('#divDetailPop  #tdGrossWt').attr('id', 'tdGrossWt_' + index)
            $('#divDetailPop  #spnLocal').attr('id', 'spnLocal_' + index)
            $('#divDetailPop  #tbadyManifestData').attr('id', 'tbadyManifestData_' + index)

        }
    });
}

function GetManifestReportPrint(FlightSNo, Type) {
    //$("#divDetail,#divStopOverDetail").html("");
    var str = '';
    $("#divDetailPop").html("");
    $("#divDetailPop").css('display', 'none');
    var FlightSNoArray = FlightSNo.split(',');
    var LogedInAirport = userContext.AirportCode;
    $(FlightSNoArray).each(function (r, i) {
        // if (r < (FlightSNoArray.length - 1)) {
        PrintManifestReportHTML(r)
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/PrintManifestReport?DailyFlightSNo=" + i + "&LogedInAirport=" + LogedInAirport + "&Type=" + Type + "&IsCart=0", async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                // $("#btnPrint").closest('tr').hide();

                //$('#SecondTab').hide();
                //$('#OSCTab').hide();
                //$('#FlightStopOverDetailTab').hide();
                //if (result.split('?')[0] == '1') {
                //str = '';
                if (result != null && result != "") {
                    var ManifestTable = jQuery.parseJSON(result);
                    var ManifestData0 = ManifestTable.Table0;
                    var ManifestData1 = ManifestTable.Table1;
                    var ManifestData2 = ManifestTable.Table2;
                    //alert(ManifestData0.length)
                    //var divPrintableTBLDetails = $("#divPrintableTBLDetails");
                    $("#tblTransit").hide();
                    $("#spnTrans").hide();
                    if (ManifestData0.length > 0) {

                        $('#divDetailPop').find('#spnLocal_' + r).text('');
                        $('#divDetailPop').find('#ImgLogo_' + r).attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + ManifestData0[0]["AirlineLogo"]);
                        $('#divDetailPop').find('#ImgLogo_' + r).attr('onError', 'this.onerror=null;this.src="../Logo/GaurdaCMS Logo.jpg";');

                        $('#divDetailPop').find('#tdFT_' + r).text(ManifestData0[0]["FlightNo"] + " & " + ManifestData0[0]["FlightDate"]);
                        $('#divDetailPop').find('#tdNatinality_' + r).text(ManifestData0[0]["RegistrationNo"]);
                        $('#divDetailPop').find('#tdPointofUnloading_' + r).text(ManifestData0[0]["FlightDestination"]);
                        $('#divDetailPop').find('#tdPointOfLoading_' + r).text(ManifestData0[0]["FlightOrigin"]);
                        $('#divDetailPop').find('#tdOwner_' + r).text(ManifestData0[0]["FlightOrigin"]);
                        $('#divDetailPop').find('#tdTotalPcs_' + r).text(ManifestData2[0]["TotalPlannedPieces"]);
                        $('#divDetailPop').find('#tdGrossWt_' + r).text(ManifestData2[0]["TotalPlannedGrossWeight"]);
                        if (ManifestData1.length > 0) {
                            //str = '';
                            //$("#divDetailPop").html();
                            //$("#divData").show();
                            //$("#divnill").hide();

                            //$('#tdOwner').text(ManifestData1[0]["FlightOrigin"]);
                            //$('#tdPointOfLoading').text(ManifestData1[0]["FlightOrigin"]);


                            if (ManifestData0[0]["FlightOrigin"] == ManifestData1[0]["OriginAirportCode"]) {
                                //For Local

                                //$("#spnLocal").show();
                                //$("#spnTrans").hide();
                                //$("#tblTransit").hide();
                                //  str += "<tr><td class='grdTableHeader'> ULD No.</td> <td class='grdTableHeader'> AWB No </td><td class='grdTableHeader'> Manifest Pieces </td><td class='grdTableHeader'> Manifest Wt[KG]</td><td class='grdTableHeader'>AWB Pieces</td><td class='grdTableHeader'> AWB Wt(kg)</td> <td class='grdTableHeader'>Description of Goods</td><td class='grdTableHeader'>Origin</td><td class='grdTableHeader'>Destination</td><td class='grdTableHeader'>SHC</td><td class='grdTableHeader'>Bonded </td> <td class='grdTableHeader'> Remarks</td></tr>"
                                $('#divDetailPop').find("#tbadyManifestData_" + r).html('');
                                $('#divDetailPop').find('#spnLocal_' + r).text('Local');
                                //$("#tbadyTransManifestData").html('');
                                $(ManifestData1).each(function (row, j) {
                                    $("#divDetailPop").find("#tbadyManifestData_" + r).append("<tr><td  class='formSection' >" + j.ULDNo + " </td><td  class='formSection' > " + j.AWBNo + "</td> <td class='formSection' >  " + j.PlannedPieces + " </td><td  class='formSection'> " + j.PlannedGrossWeight + " </td> <td  class='formSection'> " + j.TotalPieces + " </td><td  class='formSection'> " + j.GrossWeight + " </td><td  class='formSection'> " + j.NatureOfGoods + " </td> <td  class='formSection'>  " + j.OriginCity + "</td><td  class='formSection'>" + j.DestinationCity + "</td> <td  class='formSection'> " + j.SPHC + "</td> <td  class='formSection'>  </td>  <td  class='formSection'> " + ManifestData0[0]["Remarks"] + " </td> </tr>");
                                });
                                //for (var j = 0; j < ManifestData1.length; j++) {
                                //    str += "<tr><td >" + ManifestData1[j]["ULDNo"] + " </td><td> " + ManifestData1[j]["AWBNo"] + "</td> <td>  " + ManifestData1[j]["PlannedPieces"] + " </td><td> " + ManifestData1[j]["PlannedGrossWeight"] + " </td> <td> " + ManifestData1[j]["TotalPieces"] + " </td><td> " + ManifestData1[j]["GrossWeight"] + " </td><td> " + ManifestData1[j]["NatureOfGoods"] + " </td> <td>  " + ManifestData1[j]["OriginCity"] + "</td><td>" + ManifestData1[j]["DestinationCity"] + "</td> <td> " + ManifestData1[j]["SPHC"] + "</td> <td>  </td>  <td> " + ManifestData0[0]["Remarks"] + " </td> </tr>"
                                //}
                                $("#divDetailPop").find("#tbadyManifestData_" + r).append("<tr> <td class='formSection'>Summary</td> <td  class='formSection'>" + ManifestData2[0]["AWBCount"] + "</td> <td  class='formSection'>" + ManifestData2[0]["TotalPlannedPieces"] + "</td> <td  class='formSection'>" + ManifestData2[0]["TotalPlannedGrossWeight"] + "</td> <td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td> <td class='formSection'></td></tr>");
                                //$("#tblLocal").html(str);

                            }
                            else {
                                //For Transit
                                $('#divDetailPop').find("#tbadyManifestData_" + r).html('');
                                $('#divDetailPop').find('#spnLocal_' + r).text('Transit');
                                $(ManifestData1).each(function (row, j) {
                                    $("#divDetailPop").find("#tbadyManifestData_" + r).append("<tr><td  class='formSection' >" + j.ULDNo + " </td><td  class='formSection'> " + j.AWBNo + "</td> <td  class='formSection'>  " + j.PlannedPieces + " </td><td  class='formSection'> " + j.PlannedGrossWeight + " </td> <td  class='formSection'> " + j.TotalPieces + " </td><td  class='formSection'> " + j.GrossWeight + " </td><td  class='formSection'> " + j.NatureOfGoods + " </td> <td  class='formSection'>  " + j.OriginCity + "</td><td  class='formSection'>" + j.DestinationCity + "</td> <td  class='formSection'> " + j.SPHC + "</td> <td  class='formSection'>  </td>  <td  class='formSection'> " + ManifestData0[0]["Remarks"] + " </td> </tr>");
                                });
                                $("#divDetailPop").find("#tbadyManifestData_" + r).append("<tr> <td class='formSection'>Summary</td> <td  class='formSection'>" + ManifestData2[0]["AWBCount"] + "</td> <td  class='formSection'>" + ManifestData2[0]["TotalPlannedPieces"] + "</td> <td  class='formSection'>" + ManifestData2[0]["TotalPlannedGrossWeight"] + "</td> <td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td><td class='formSection'></td> <td class='formSection'></td></tr>");


                            }
                            // $("#divDetailPop").html();
                            //$("#divDetailPop").append(str);

                        }
                    }

                    if (r < (FlightSNoArray.length - 1))
                        $("#divDetailPop").append('</br><div class="page-break"></div>');

                    //else
                    //    {

                    //        //str = '';
                    //        $("#spnLocal").show();
                    //        $("#tblLocal").show();
                    //        //str += "<tr> <td class='grdTableHeader'> ULD No.</td> <td class='grdTableHeader'> AWB No </td><td class='grdTableHeader'> Manifest Pieces </td><td class='grdTableHeader'> Manifest Wt[KG]</td><td class='grdTableHeader'>AWB Pieces</td><td class='grdTableHeader'> AWB Wt(kg)</td> <td class='grdTableHeader'>Description of Goods</td><td class='grdTableHeader'>Origin</td><td class='grdTableHeader'>Destination</td><td class='grdTableHeader'>SHC</td><td class='grdTableHeader'>Bonded </td> <td class='grdTableHeader'> Remarks</td></tr>"
                    //        str += "<tr><td style='border:none'  align='center'  colspan='12' style='font-size:30px;color:red'>NIL MANIFEST&nbsp;</td> </tr>"
                    //        str += "<tr> <tdstyle='border:none'   colspan='12'></td></tr>"
                    //        str += "<tr> <td style='border:none'  colspan='12'></td></tr>"
                    //        str += "<tr> <td style='border:none'  colspan='12'></td></tr>"
                    //        $("#tblLocal").html(str);
                    //        //$("#divDetailPop").append(result);
                    //        if (r < (FlightSNoArray.length - 1))
                    //            $("#divDetailPop").append('</br><div class="page-break"></div>');
                    //    }
                    //$("#divDetailPop").html();
                    //if (r < (FlightSNoArray.length - 1))
                    //    $("#divDetailPop").append('</br><div class="page-break"></div>');

                    //}

                }
                //ShowMessage('warning', 'Warning -Shipment ', result.split('?')[1], "bottom-right");
                //}
                else {
                    $("#divDetailPop").append(str);
                    if (r < (FlightSNoArray.length - 1))
                        $("#divDetailPop").append('</br><div class="page-break"></div>');

                    //  $("#divDetailPop tr[id=PrintTr]").hide();
                    //$("#divDetail").append(result);
                    //$("#divDetail").append('</br><div class="page-break"></div>');
                }
            },
            error: {

            }
        });
        // }
    });
    //$("#divDetailPop tr[id=PrintTr]:last").show();
    printDiv('Manifest');
    //$("#divDetail #btnPrint:last").unbind("click").bind("click", function () {
    //   // //$("#divDetailPrint #divDetail").printArea();
    //   //// window.open("", "_blank");
    //   // var myWindow = window.open("", "_self");
    //   // myWindow.document.write($("#divDetailPrint #divDetail").html());
    //    // //printWindow();
    //    //fnPrintClose();
    //});


}
var FlightSNoArray2 = '';
var FlightSNoArray = '';
function GetManifestReportData(FlightSNo, Type) {
    //$("#divDetail,#divStopOverDetail").html("");

    $("#divDetailPop").html("");
    $("#divDetailPop").css('display', 'none');
    var FlightSNoArray1 = FlightSNo.split(',');
    var LogedInAirport = userContext.AirportCode;

    if (userContext.SysSetting.IsStopOverShowInManifestPrint == 'TRUE') {
        FlightSNoArray2 = FlightSNoArray1 + ',' + FWDGroupSNo;
        FlightSNoArray = FlightSNoArray2.split(',');
    }
    else {
        FlightSNoArray = FlightSNoArray1;
    }
    // var FlightSNoArray = FlightSNoArray2.split(',');
    $(FlightSNoArray).each(function (r, i) {
        // if (r < (FlightSNoArray.length - 1)) {

        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetManifestReport?DailyFlightSNo=" + i + "&LogedInAirport=" + LogedInAirport + "&Type=" + Type + "&IsCart=0", async: false, type: "get", dataType: "html", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#btnPrint").closest('tr').hide();
                //$('#SecondTab').hide();
                //$('#OSCTab').hide();
                //$('#FlightStopOverDetailTab').hide();
                if (result.split('?')[0] == '1') {

                    ShowMessage('warning', 'Warning -Shipment ', result.split('?')[1], "bottom-right");
                }
                else {
                    $("#divDetailPop").append(result);
                    if (r < (FlightSNoArray.length - 1))
                        $("#divDetailPop").append('</br><div class="page-break"></div>');

                    //  $("#divDetailPop tr[id=PrintTr]").hide();
                    //$("#divDetail").append(result);
                    //$("#divDetail").append('</br><div class="page-break"></div>');
                }
            },
            error: {

            }
        });
        // }
    });

    //$("#divDetailPop tr[id=PrintTr]:last").show();
    printDiv('Manifest');
    //$("#divDetail #btnPrint:last").unbind("click").bind("click", function () {
    //   // //$("#divDetailPrint #divDetail").printArea();
    //   //// window.open("", "_blank");
    //   // var myWindow = window.open("", "_self");
    //   // myWindow.document.write($("#divDetailPrint #divDetail").html());
    //    // //printWindow();
    //    //fnPrintClose();
    //});


}
function printDiv(PageTitle) {
    var divToPrint = document.getElementById('divDetailPop');
    var newWin = window.open('', '_blank');
    newWin.document.open();
    newWin.document.title = PageTitle;
    newWin.document.write('<html><head><link type="text/css" rel="stylesheet" href="Styles/Application.css" /><title>' + PageTitle + '</title></head><body ><div><input id="btnPrint" type="button" value="Print" class="no-print" onclick="window.print();"/></div><br\>' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    newWin.focus();

}

function printDivCart(PageTitle) {
    var divToPrint = document.getElementById('divDetailCart');
    var newWin = window.open('', '_blank');
    newWin.document.open();
    newWin.document.title = PageTitle;
    newWin.document.write('<html><head><link type="text/css" rel="stylesheet" href="Styles/Application.css" /><title>' + PageTitle + '</title></head><body ><div><input id="btnPrint" type="button" value="Print" class="no-print" onclick="window.print();"/></div><br\>' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    newWin.focus();
    $("#tblprint").show();
    $("#btnPrint").show();
}
function GetDate(str) {
    var arr = str.split(" ");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = ('0' + (months.indexOf(arr[1]) + 1)).slice(-2);
    var final = arr[2] + '-' + month + '-' + arr[0];
    return final;
}
function fnCheckProcessLocking(ArrayList, ProcessSNo) {
    var flag = false;
    $(ArrayList).each(function (row, item) {
        if (item.GroupFlightSNo == GroupFlightSNo && item.EventType == 'SAVE' && item.ProcessSNo != ProcessSNo) {
            flag = true;
        }
    });
    return flag;
}
function SaveManifestInfo(mode) {
    signalR.startHub();
    //debugger;
    var flag = false;
    var chkSelect = false;
    //var isTobeRefersh = false;
    var IntectShipArray = new Array();
    var BulkShipArray = new Array();
    var LyingIntectShipArray = new Array();
    var LyingBulkShipArray = new Array();
    var OSCLyingIntectShipArray = new Array();
    var OSCLyingBulkShipArray = new Array();

    // Changes by Vipin Kumar for Check Empty Plannned Pieces
    var isPlannedPiecesDetail = false;
    var isPlannedPiecesLying = false;
    var isPlannedPiecesOSC = false;
    // Ends
    $('#btnSave,#btnFinalizedPreMan,#btnSaveAndClose').attr('disabled', 'disabled');
    //added for pax and freighter radio button
    var FlightType = $("input[type=radio][name=Pax]:checked").val();

    //if ((SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") && IsRFS == false && IsBuildup == false) {
    //    ShowMessage('warning', 'Warning -Load Plan/Flight Build Up not done.', "Cannot proceed with Pre-Manifest process", "bottom-right");
    //    flag = false;
    //}
    //else
    var IsPreTobeRefersh = false;
    var IsMANTobeRefersh = false;
    if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {

        var BUPdata = jQuery.grep(processList, function (n, i) {
            return (n.GroupFlightSNo == GroupFlightSNo && n.ProcessSNo == 30 && n.EventType == "SAVE");
        });
        var BUPTime = BUPdata.length > 0 ? BUPdata[0].ProcessSaveTime : null;
        var PREdata = jQuery.grep(processList, function (n, i) {
            return (n.GroupFlightSNo == GroupFlightSNo && n.ProcessSNo == 33 && (new Date(BUPTime) > new Date(n.ProcessOpenTime) && new Date(BUPTime) < new Date()));
        });
        if (BUPdata.length > 0 && PREdata.length > 0) { IsPreTobeRefersh = true }
        else {
            signalR.updateProcessStatus({ GroupFlightSNo: GroupFlightSNo, ProcessSNo: subprocesssno, EventType: 'SAVE' });
        }
    }
    else {

        var PREdata = jQuery.grep(processList, function (n, i) {
            return (n.GroupFlightSNo == GroupFlightSNo && n.ProcessSNo == 33 && n.EventType == "SAVE");
        });
        var PRETime = PREdata.length > 0 ? PREdata[0].ProcessSaveTime : null;
        var MANdata = jQuery.grep(processList, function (n, i) {
            return (n.GroupFlightSNo == GroupFlightSNo && n.ProcessSNo == 34 && (new Date(PRETime) > new Date(n.ProcessOpenTime) && new Date(PRETime) < new Date()));
        });
        if (PREdata.length > 0 && MANdata.length > 0) { IsMANTobeRefersh = true }
        else {
            signalR.updateProcessStatus({ GroupFlightSNo: GroupFlightSNo, ProcessSNo: subprocesssno, EventType: 'SAVE' });
        }
    }



    //if (!fnCheckProcessLocking(processList, subprocesssno)) {
    //    signalR.updateProcessStatus({ GroupFlightSNo: GroupFlightSNo, ProcessSNo: subprocesssno, EventType: 'SAVE' });
    //}

    if (IsMANTobeRefersh) {
        ShowMessage('warning', 'Warning', "Some changes have been made at Premanifest. Kindly refresh the page to proceed with Manifest.", "bottom-right");
        flag = false;
    }
    else if (IsPreTobeRefersh) {
        ShowMessage('warning', 'Warning', "Some changes have been made at Build Up. Kindly refresh the page to proceed with Premanifest", "bottom-right");
        flag = false;
    }
    else if ((SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") && IsRFS == false && IsPreManifested == false && IsNILManifested == "false") {
        ShowMessage('warning', 'Warning -Load Plan/Flight Build Up not done.', "Cannot proceed with Manifest process", "bottom-right");
        flag = false;
    }
    else if ((SaveProcessStatus == "MAN") && IsRFS == false && IsPreManifested == true && IsNILManifested == "false" && $("#RegistrationNo").val() == '') {
        var str = IsRegistrationAvailable == true ? 'select' : 'enter';
        ShowMessage('warning', 'Warning', 'Please ' + str + ' Aircraft Registration No.', "bottom-right");
        flag = false;
    }
    else
        //if ((SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") && IsRFS == true && IsPreManifested == true) {
        if ((SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") && IsRFS == true && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
            ShowMessage('warning', 'Warning -This is a RFS/Truck Movement.', " Kindly use RFS module to process Truck Manifest", "bottom-right");
            flag = false;
        }
        else if ((SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") && IsRFS == true && IsRFSFlightsEdit == false && userContext.SysSetting.ICMSInstance.toLowerCase() == "handler") {
            ShowMessage('warning', 'Warning -Flight assignment done for RFS/Truck Movement', "Cannot proceed with Pre-Manifest process", "bottom-right");
            flag = false;
        }
        else if ((SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") && (IsBuildup == false && userContext.SysSetting.IsDirectPreManifest.toLowerCase() == "false")) {
            ShowMessage('warning', 'Warning -Load Plan/Flight Build Up not done.', "Cannot proceed with Pre-Manifest process", "bottom-right");
            flag = false;
        }

        else {

            if (FlightCloseFlag != "DEP") {
                $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {


                    var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
                    var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                    var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                    // var IsCartIndex = Rowtr.find("th[data-field='IsCart']").index();
                    var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                    var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                    var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                    var FlightType = $("input[type=radio][name=Pax]:checked").val();
                    // var IsCartValue = $(tr).find('td:eq(' + IsCartIndex + ')').text() == "true" ? true : false;

                    var DailyFlightSNo = $('#hdnFlightSNo').val();
                    var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                    if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                        var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                        var nestedGridContent = $(tr).next().find("div.k-grid-content > table > tbody  tr");
                        var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                        var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
                        var IsFlightSNOIndex = nestedGridHeader.find("th[data-field='DailyFlightSNo']").index();
                        var PiecesIndex = nestedGridHeader.find("th[data-field='TotalPPcs']").index();

                        var PGWIndex = nestedGridHeader.find("th[data-field='PGW']").index();
                        var PVWIndex = nestedGridHeader.find("th[data-field='PVW']").index();
                        var PCBMWIndex = nestedGridHeader.find("th[data-field='PCCBM']").index();

                        var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                        var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                        var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                        var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                        var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                        var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

                        /*Following is added by Brajendra*/
                        cfi.SaveUpdateLockedProcess($(tr).find('td:eq(' + AWBSNoIndex + ')').text(), CurrentFlightSno, "", "", userContext.UserSNo, subprocesssno, subprocess, "0", "");

                        $(nestedGridContent).each(function (row1, tr1) {
                            if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                chkSelect = true;
                            }
                            else {
                                fn_CheckOffloadPCS($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]'));
                            }
                            var AG = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                            var AV = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                            var ACBM = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                            var PG = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                            var PV = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                            var PCBM = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();

                            // Changes by Vipin Kumar for Check Empty Plannned Pieces
                            var PlannedPieces = $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val();
                            if (PlannedPieces == "")
                                isPlannedPiecesDetail = true;
                            // Ends

                            BulkShipArray.push({
                                isBulk: $(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                                AWBSNo: $(tr1).find('td:eq(' + AWBSNoIndex + ')').text(),
                                DailyFlightSNo: $(tr1).find('td:eq(' + IsFlightSNOIndex + ')').text(),
                                TotalPieces: $(tr1).find('td:eq(' + PiecesIndex + ')').text(),
                                PlannedPieces: $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                                //ActualVolumeWt: AV,
                                //ActualGrossWt: AG,
                                //ActualCBM: ACBM,
                                ActualVolumeWt: $(tr1).find('td:eq(' + PVWIndex + ')').text(),
                                ActualGrossWt: $(tr1).find('td:eq(' + PGWIndex + ')').text(),
                                ActualCBM: $(tr1).find('td:eq(' + PCBMWIndex + ')').text(),
                                PlannedGrossWt: PG,
                                PlannedVolumeWt: PV,
                                PlannedCBM: PCBM,

                                ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                MovementType: 2,
                                RFSRemarks: $(tr1).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                                AWBOffPoint: $(tr1).find('td:eq(' + AWBOffPointIndex + ') input[type="Text"]').val().toUpperCase(),
                                McBookingSNo: $(tr1).find('td[data-column="McBookingSNo"]').text(),
                                IsChanged: $(tr1).find('td[data-column="IsChanged"]').text(),
                                // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                                // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                                UpdatedBy: 2
                            });
                        });

                    }
                    else {
                        if (isSelect) {
                            chkSelect = true;
                        }
                        IntectShipArray.push({
                            isSelect: isSelect,
                            DailyFlightSNo: DailyFlightSNo,
                            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                            MovementType: 2,
                            RFSRemarks: $(tr).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
                            LastPoint: $(tr).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                            UpdatedBy: 2
                        });
                    }

                });
                $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
                    var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
                    var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                    var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                    var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                    var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                    var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                    var DailyFlightSNo = $('#hdnFlightSNo').val();
                    var isSelect = $(trMain).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                    if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
                        var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                        var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                        var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

                        var PiecesIndex = nestedGridHeader.find("th[data-field='OLCPieces']").index();
                        var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                        var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                        var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                        var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                        var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                        var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();
                        $(nestedGridContent).each(function (rowChild, trChild) {
                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                chkSelect = true;
                            }
                            var AG = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                            var AV = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                            var ACBM = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                            var PG = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                            var PV = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                            var PCBM = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();

                            // Changes by Vipin Kumar for Check Empty Plannned Pieces
                            var PlannedPieces = $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val();
                            if (PlannedPieces == "")
                                isPlannedPiecesLying = true;
                            // Ends

                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                LyingBulkShipArray.push({
                                    isBulk: $(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                                    AWBSNo: $(trChild).find('td:eq(' + AWBSNoIndex + ')').text(),
                                    DailyFlightSNo: DailyFlightSNo,
                                    TotalPieces: $(trChild).find('td:eq(' + PiecesIndex + ')').text(),
                                    PlannedPieces: $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                                    ActualVolumeWt: AV,
                                    ActualGrossWt: AG,
                                    ActualCBM: ACBM,
                                    PlannedGrossWt: PG,
                                    PlannedVolumeWt: PV,
                                    PlannedCBM: PCBM,

                                    ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                    MovementType: 2,
                                    RFSRemarks: $(trChild).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                                    AWBOffPoint: $(trChild).find('td:eq(' + AWBOffPointIndex + ') input[type=Text]').val().toUpperCase(),
                                    McBookingSNo: $(trChild).find('td[data-column="McBookingSNo"]').text(),
                                    IsChanged: $(trChild).find('td[data-column="IsChanged"]').text(),
                                    // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                                    // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                                    UpdatedBy: 2
                                });
                            }
                        });

                    }
                    else {
                        if (isSelect) {
                            chkSelect = true;

                            LyingIntectShipArray.push({
                                isSelect: isSelect,
                                DailyFlightSNo: DailyFlightSNo,
                                ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                MovementType: 2,
                                RFSRemarks: $(trMain).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
                                LastPoint: $(trMain).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                                UpdatedBy: 2
                            });
                        }
                    }

                });
                $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
                    var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
                    var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                    var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                    var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                    var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                    var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                    var DailyFlightSNo = $('#hdnFlightSNo').val();
                    var isSelect = $(trMain).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                    if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
                        var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                        var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                        var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

                        var PiecesIndex = nestedGridHeader.find("th[data-field='OLCPieces']").index();
                        var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                        var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                        var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                        var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                        var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                        var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

                        $(nestedGridContent).each(function (rowChild, trChild) {
                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                chkSelect = true;
                            }
                            var AG = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                            var AV = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                            var ACBM = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                            var PG = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                            var PV = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                            var PCBM = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();

                            // Changes by Vipin Kumar for Check Empty Plannned Pieces
                            var PlannedPieces = $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val();
                            if (PlannedPieces == "")
                                isPlannedPiecesOSC = true;
                            // Ends

                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                OSCLyingBulkShipArray.push({
                                    isBulk: $(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                                    AWBSNo: $(trChild).find('td:eq(' + AWBSNoIndex + ')').text(),
                                    DailyFlightSNo: DailyFlightSNo,
                                    TotalPieces: $(trChild).find('td:eq(' + PiecesIndex + ')').text(),
                                    PlannedPieces: $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                                    ActualVolumeWt: AV,
                                    ActualGrossWt: AG,
                                    ActualCBM: ACBM,
                                    PlannedGrossWt: PG,
                                    PlannedVolumeWt: PV,
                                    PlannedCBM: PCBM,

                                    ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                    MovementType: 2,
                                    RFSRemarks: $(trChild).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                                    AWBOffPoint: $(trChild).find('td:eq(' + AWBOffPointIndex + ') input[type=Text]').val().toUpperCase(),
                                    McBookingSNo: $(trChild).find('td[data-column="McBookingSNo"]').text(),
                                    IsChanged: $(trChild).find('td[data-column="IsChanged"]').text(),
                                    // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                                    // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                                    UpdatedBy: 2
                                });
                            }
                        });

                    }
                    else {
                        if (isSelect) {
                            chkSelect = true;

                            OSCLyingIntectShipArray.push({
                                isSelect: isSelect,
                                DailyFlightSNo: DailyFlightSNo,
                                ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                MovementType: 2,
                                RFSRemarks: $(trMain).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
                                LastPoint: $(trMain).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                                UpdatedBy: 2
                            });
                        }
                    }

                });

                // Changes by Vipin Kumar for Check Empty Plannned Pieces
                if (isPlannedPiecesDetail == true) {
                    ShowMessage('warning', 'Warning', 'Planned pieces can not be empty', "bottom-right");
                    return;
                }
                if (isPlannedPiecesLying == true) {
                    ShowMessage('warning', 'Warning', 'Planned pieces can not be empty', "bottom-right");
                    return;
                }
                if (isPlannedPiecesOSC == true) {
                    ShowMessage('warning', 'Warning', 'Planned pieces can not be empty', "bottom-right");
                    return;
                }
                // Ends

                var FunctionName = "";
                if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
                    FunctionName = "SavePMenifestInformation";
                    mode = FlightCloseFlag == "PRE" ? "PRE_FINAL" : SaveProcessStatus
                }
                else //if(SaveProcessStatus== "MAN")
                {
                    FunctionName = "SaveMenifestInformation";
                    mode = SaveProcessStatus
                }

                var postData = SaveProcessStatus == "DEP" ? JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, LyingBulkShipmentInfo: LyingBulkShipArray, LyingIntectShipmentInfo: LyingIntectShipArray, OSCLyingBulkShipmentInfo: OSCLyingBulkShipArray, OSCLyingIntectShipmentInfo: OSCLyingIntectShipArray, POMailDNDetailsInfo: POMailDetailsArray, FlightType: FlightType, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val(), mode: mode, ATDDate: cfi.CfiDate("txtATDDate"), ATDTime: $("#txtATDTime").val(), IsExcludeFromFFM: $("#IsExcludeFromFFM").prop("checked"), OffloadRemarks: AllOffloadRemarksDetails }) : JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, LyingBulkShipmentInfo: LyingBulkShipArray, LyingIntectShipmentInfo: LyingIntectShipArray, OSCLyingBulkShipmentInfo: OSCLyingBulkShipArray, OSCLyingIntectShipmentInfo: OSCLyingIntectShipArray, POMailDNDetailsInfo: POMailDetailsArray, FlightType: FlightType, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val(), mode: mode, OffloadRemarks: AllOffloadRemarksDetails });

                if (chkSelect || (!chkSelect && IsNILManifested == "true")) {
                    if (FlightCloseFlag == "MAN" && (SaveProcessStatus != "DEP" && SaveProcessStatus != "MAN")) {
                        ShowMessage('warning', 'Warning -Manifest already created for flight.', " No more changes allowed ", "bottom-right");
                        flag = false;
                    }
                    else {
                        // SaveProcessStatus == "MAN" ||
                        if (SaveProcessStatus == "DEP") {
                            ///////////

                            //var ftDate = $("#tdFlightDate").text().replace('-', ' ').replace('-', ' ');
                            //var arr1 = ftDate.split(" ");
                            //var final1 = arr1[0] + ' ' + arr1[1] + ' ' + arr1[2];
                            //var Min = parseInt(ATDTime.split(":")[1]) + 10;
                            //var Hr = Min / 60;
                            //Min = Min % 60;
                            //var HRs = parseInt(ATDTime.split(":")[0]) + parseInt(Hr);
                            //var HHsMM = HRs + ":" + Min;
                            //var ATDData = (HHsMM == '') ? '00:00' : HHsMM;
                            //var flightDateAndATD = GetDate(final1).replace('-', ' ').replace('-', ' ') + ' ' + ATDData + ':00';

                            //var breakdownStartDateTime1 = $("#txtATDDate").val()
                            //var bdStartTime = ($("#txtATDTime").val() == '') ? '00:00' : $("#txtATDTime").val();
                            //breakdownStartDateTime1 = $("#txtATDDate").attr("sqldatevalue").replace('-', ' ').replace('-', ' ') + ' ' + bdStartTime + ':00';

                            //if ((Date.parse(breakdownStartDateTime1) > Date.parse(flightDateAndATD)) && ($("#ManifestRemarks").val() == '' || $("#ManifestRemarks").val() == undefined)) 
                            //    if ((Date.parse(breakdownStartDateTime1) > Date.parse(flightDateAndATD)) && ($("#ManifestRemarks").val() == '' || $("#ManifestRemarks").val() == undefined)) {
                            //    fn_AddManifestRemarks(this);
                            //}
                            //else {
                            $.ajax({
                                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                                data: postData,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    $('#btnSave,#btnFinalizedPreMan,#btnSaveAndClose').removeAttr('disabled');
                                    var ResultStatus = result.split('?')[0];
                                    var ResultValue = result.split('?')[1];
                                    if (ResultStatus == "0" || ResultStatus == "2") {
                                        if (ResultValue != '0') {
                                            ShowMessage('warning', 'Warning:-', ResultValue);
                                        }
                                        if (ResultStatus == '2')//For Hold Shipment
                                        {
                                            var msgString = '';
                                            var AWBArray = ResultValue.split('@')[0];
                                            var HOLDRemarksArray = ResultValue.split('@')[1];
                                            $(AWBArray.split('^')).each(function (r, i) {
                                                msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                            });
                                            msgString = '<table>' + msgString + '</table>';

                                            ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                            //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                            flag = false;
                                        }
                                        if (SaveProcessStatus == "PRE_FINAL")
                                            ShowMessage('success', 'Success -Pre Manifest Created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "PRE")
                                            ShowMessage('success', 'Success -Pre Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "DEP")
                                            ShowMessage('success', 'Success -Flight Departed Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "MAN" && $('#btnSave').text().toUpperCase() == "UPDATE MANIFEST")
                                            ShowMessage('success', 'Success -Manifest Updated Successfully', "Processed Successfully", "bottom-right");
                                        else
                                            ShowMessage('success', 'Success -Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        flag = true;
                                    }
                                    else if (ResultStatus == '1')//for Part Shipment
                                    {
                                        var AWBData = ResultValue.split('@')[0];
                                        if (SaveProcessStatus == "PRE_FINAL") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "PRE") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "DEP") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else
                                            ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '8')//For Hold Manifest Shipment
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[0];
                                        var HOLDRemarksArray = ResultValue.split('@')[1];
                                        $(AWBArray.split('^')).each(function (r, i) {
                                            msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                        });
                                        msgString = '<table>' + msgString + '</table>';

                                        ShowMessage('warning', 'Warning -Shipment ', 'Few pieces of shipments ' + msgString + '.Kindly cross check and plan the remaining pieces accordingly', "bottom-right");
                                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '9')//For CTM Charge
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[1];
                                        var ChargeRemarksArray = ResultValue.split('@')[0];
                                        //$(AWBArray.split('^')).each(function (r, i) {
                                        //    msgString = msgString + '<tr><td>' + i + ',' + ChargeRemarksArray.split('^')[r] + '</td></tr>';
                                        //});
                                        msgString = ChargeRemarksArray + '' + AWBArray;

                                        ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '3')//For Gross Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '4')//For Volumn Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '5')//For RFS Truck ULD Exceed
                                    {
                                        if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
                                            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '6')//For UWS Not Created
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            // ShowMessage('warning', "Warning", "UWS Incomplete for " + ResultValue + "</br>Kindly check again", "bottom-right");
                                            ShowMessage('warning', "Warning", ResultValue, "bottom-right");
                                            $("#cfMessage-container").css("margin-top", setshowmsg(ResultValue) + "%");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == "7")//for CargoClassification 'PAX' Check with 'CAO'
                                    {
                                        ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

                                    }
                                    else if (ResultStatus == "10")//for comman Message
                                    {
                                        ShowMessage('warning', "Warning ", ResultValue, "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }
                                },
                                error: function (xhr) {
                                    $('#btnSave,#btnFinalizedPreMan,#btnSaveAndClose').removeAttr('disabled');
                                    if (SaveProcessStatus == "PRE_FINAL")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "PRE")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "DEP")
                                        ShowMessage('warning', 'Warning -Flight could not be departed', " ", "bottom-right");
                                    else
                                        ShowMessage('warning', 'Warning -Manifest could not be created ', " ", "bottom-right");
                                    flag = false;
                                }
                            });
                            // }
                        }
                        else {
                            $.ajax({
                                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                                data: postData,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    $('#btnSave,#btnFinalizedPreMan,#btnSaveAndClose').removeAttr('disabled');
                                    var ResultStatus = result.split('?')[0];
                                    var ResultValue = result.split('?')[1];
                                    if (ResultStatus == "0" || ResultStatus == "2") {
                                        if (ResultValue != '0') {
                                            ShowMessage('warning', 'Warning:-', ResultValue);
                                        }
                                        if (ResultStatus == '2')//For Hold Shipment
                                        {
                                            var msgString = '';
                                            var AWBArray = ResultValue.split('@')[0];
                                            var HOLDRemarksArray = ResultValue.split('@')[1];
                                            $(AWBArray.split('^')).each(function (r, i) {
                                                msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                            });
                                            msgString = '<table>' + msgString + '</table>';

                                            ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                            //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                            flag = false;
                                        }
                                        if (SaveProcessStatus == "PRE_FINAL")
                                            ShowMessage('success', 'Success -Pre Manifest Created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "PRE")
                                            ShowMessage('success', 'Success -Pre Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "DEP")
                                            ShowMessage('success', 'Success -Flight Departed Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "MAN" && $('#btnSave').text().toUpperCase() == "UPDATE MANIFEST")
                                            ShowMessage('success', 'Success -Manifest Updated Successfully', "Processed Successfully", "bottom-right");
                                        else
                                            ShowMessage('success', 'Success -Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        flag = true;
                                    }
                                    else if (ResultStatus == '1')//for Part Shipment
                                    {
                                        var AWBData = ResultValue.split('@')[0];
                                        if (SaveProcessStatus == "PRE_FINAL") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "PRE") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "DEP") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else
                                            ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '8')//For Hold Manifest Shipment
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[0];
                                        var HOLDRemarksArray = ResultValue.split('@')[1];
                                        $(AWBArray.split('^')).each(function (r, i) {
                                            msgString = msgString + '<tr><td> ' + i + '' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                        });
                                        msgString = '<table>' + msgString + '</table>';

                                        // ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                        ShowMessage('warning', 'Warning -Shipment ', 'Few pieces of shipments ' + msgString + ' Kindly cross check and plan the remaining pieces accordingly', "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '9')//For CTM Charge
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[0];
                                        var ChargeRemarksArray = ResultValue.split('@')[1];
                                        $(AWBArray.split('^')).each(function (r, i) {
                                            msgString = msgString + '<tr><td>' + i + ',' + ChargeRemarksArray.split('^')[r] + '</td></tr>';
                                        });
                                        msgString = '<table>' + msgString + '</table>';

                                        ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '3')//For Gross Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '4')//For Volumn Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '5')//For RFS Truck ULD Exceed
                                    {
                                        if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
                                            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '6')//For UWS Not Created
                                    {
                                        if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', "Warning", ResultValue);
                                            $("#cfMessage-container").css("margin-top", setshowmsg(ResultValue) + "%");
                                            // ShowMessage('warning', "Warning", "UWS Incomplete for this flight .  Kindly check again.", "bottom-right");
                                        }

                                        if (SaveProcessStatus == "PRE_FINAL") {
                                            ShowMessage('warning', "Warning", ResultValue);
                                            $("#cfMessage-container").css("margin-top", setshowmsg(ResultValue) + "%");
                                            // ShowMessage('warning', "Warning", "UWS Incomplete for this flight .  Kindly check again.", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == "7")//for CargoClassification 'PAX' Check with 'CAO'
                                    {
                                        ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

                                    }
                                    else if (ResultStatus == "10")//for comman Message
                                    {
                                        ShowMessage('warning', "Warning ", ResultValue, "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }


                                },
                                error: function (xhr) {
                                    $('#btnSave,#btnFinalizedPreMan,#btnSaveAndClose').removeAttr('disabled');
                                    if (SaveProcessStatus == "PRE_FINAL")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "PRE")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "DEP")
                                        ShowMessage('warning', 'Warning -Flight could not be departed', " ", "bottom-right");
                                    else
                                        ShowMessage('warning', 'Warning -Manifest could not be created ', " ", "bottom-right");
                                    flag = false;
                                }
                            });
                        }

                    }
                }
                else {
                    if (SaveProcessStatus == "PRE_FINAL")
                        ShowMessage('warning', 'Warning -Select a shipment to prepare Pre Manifest', " ", "bottom-right");
                    else if (SaveProcessStatus == "PRE")
                        ShowMessage('warning', 'Warning -Select a shipment to prepare Pre Manifest', " ", "bottom-right");
                    else if (SaveProcessStatus == "DEP")
                        ShowMessage('warning', 'Warning - Select a shipment to prepare Flight depart', " ", "bottom-right");
                    else {
                        if (FlightStatus != 'MAN' && ManageCTMStatus == "MAN")
                            ShowMessage('warning', 'Warning ', "Manifest has not been prepared. Cannot proceed with Update of Manifest ", "bottom-right");
                        else {
                            //var r = jConfirm("Are you sure, you want to create NIL Manifest ?", "", function (r) {
                            //    if (r == true) {
                            //        OffloadDest = "ALL"; //FlightDestination;
                            //        fn_SaveNILManifest();
                            //        FlightSearch();
                            //    }
                            //});
                            ShowMessage('warning', 'Warning -Select a shipment to prepare Manifest', " ", "bottom-right");
                        }

                    }
                    flag = false;
                }
            }
            else {
                ShowMessage('warning', 'Warning -Selected flight has already departed', " ", "bottom-right");
                flag = false;
            }
        }
    $('#btnSave,#btnFinalizedPreMan,#btnSaveAndClose').removeAttr('disabled');
    return flag;

}
//function SaveGatePass(mode) {
//    debugger;
//    var flag = false;
//    var chkSelect = false;
//    var IntectShipArray = new Array();
//    var BulkShipArray = new Array();
//    var LyingIntectShipArray = new Array();
//    var LyingBulkShipArray = new Array();
//    var OSCLyingIntectShipArray = new Array();
//    var OSCLyingBulkShipArray = new Array();
//    //added for pax and freighter radio button
//    var FlightType = $("input[type=radio][name=Pax]:checked").val();




//    if (FlightCloseFlag == "MAN") {

//        $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {

//            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
//            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
//            var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
//            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
//            var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
//            var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
//            var FlightType = $("input[type=radio][name=Pax]:checked").val();

//            var DailyFlightSNo = $('#hdnFlightSNo').val();
//            var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
//            if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
//                var nestedGridHeader = $(tr).next().find("div.k-grid-header");
//                var nestedGridContent = $(tr).next().find("div.k-grid-content > table > tbody  tr");
//                var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
//                var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
//                var IsFlightSNOIndex = nestedGridHeader.find("th[data-field='DailyFlightSNo']").index();
//                var PiecesIndex = nestedGridHeader.find("th[data-field='TotalPPcs']").index();

//                var PGWIndex = nestedGridHeader.find("th[data-field='PGW']").index();
//                var PVWIndex = nestedGridHeader.find("th[data-field='PVW']").index();
//                var PCBMWIndex = nestedGridHeader.find("th[data-field='PCCBM']").index();

//                var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
//                var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
//                var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
//                var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
//                var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
//                var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
//                var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

//                $(nestedGridContent).each(function (row1, tr1) {
//                    if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
//                        chkSelect = true;
//                    }
//                    else {
//                        fn_CheckOffloadPCS($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]'));
//                    }
//                    var AG = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
//                    var AV = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
//                    var ACBM = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
//                    var PG = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
//                    var PV = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
//                    var PCBM = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
//                    BulkShipArray.push({
//                        isBulk: $(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
//                        AWBSNo: $(tr1).find('td:eq(' + AWBSNoIndex + ')').text(),
//                        DailyFlightSNo: $(tr1).find('td:eq(' + IsFlightSNOIndex + ')').text(),
//                        TotalPieces: $(tr1).find('td:eq(' + PiecesIndex + ')').text(),
//                        PlannedPieces: $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
//                        //ActualVolumeWt: AV,
//                        //ActualGrossWt: AG,
//                        //ActualCBM: ACBM,
//                        ActualVolumeWt: $(tr1).find('td:eq(' + PVWIndex + ')').text(),
//                        ActualGrossWt: $(tr1).find('td:eq(' + PGWIndex + ')').text(),
//                        ActualCBM: $(tr1).find('td:eq(' + PCBMWIndex + ')').text(),
//                        PlannedGrossWt: PG,
//                        PlannedVolumeWt: PV,
//                        PlannedCBM: PCBM,

//                        ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
//                        MovementType: 2,
//                        RFSRemarks: $(tr1).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
//                        AWBOffPoint: $(tr1).find('td:eq(' + AWBOffPointIndex + ') input[type="Text"]').val().toUpperCase(),
//                        // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
//                        // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
//                        UpdatedBy: 2
//                    });
//                });

//            }
//            else {
//                if (isSelect) {
//                    chkSelect = true;
//                }
//                IntectShipArray.push({
//                    isSelect: isSelect,
//                    DailyFlightSNo: DailyFlightSNo,
//                    ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
//                    MovementType: 2,
//                    RFSRemarks: $(tr).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
//                    LastPoint: $(tr).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
//                    UpdatedBy: 2
//                });
//            }

//        });
//        $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
//            var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
//            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
//            var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
//            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
//            var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
//            var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
//            var DailyFlightSNo = $('#hdnFlightSNo').val();
//            var isSelect = $(trMain).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
//            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
//                var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
//                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
//                var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
//                var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

//                var PiecesIndex = nestedGridHeader.find("th[data-field='OLCPieces']").index();
//                var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
//                var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
//                var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
//                var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
//                var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
//                var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
//                var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();
//                $(nestedGridContent).each(function (rowChild, trChild) {
//                    if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
//                        chkSelect = true;
//                    }
//                    var AG = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
//                    var AV = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
//                    var ACBM = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
//                    var PG = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
//                    var PV = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
//                    var PCBM = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
//                    if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
//                        LyingBulkShipArray.push({
//                            isBulk: $(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
//                            AWBSNo: $(trChild).find('td:eq(' + AWBSNoIndex + ')').text(),
//                            DailyFlightSNo: DailyFlightSNo,
//                            TotalPieces: $(trChild).find('td:eq(' + PiecesIndex + ')').text(),
//                            PlannedPieces: $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
//                            ActualVolumeWt: AV,
//                            ActualGrossWt: AG,
//                            ActualCBM: ACBM,
//                            PlannedGrossWt: PG,
//                            PlannedVolumeWt: PV,
//                            PlannedCBM: PCBM,

//                            ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
//                            MovementType: 2,
//                            RFSRemarks: $(trChild).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
//                            AWBOffPoint: $(trChild).find('td:eq(' + AWBOffPointIndex + ') input[type=Text]').val().toUpperCase(),
//                            // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
//                            // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
//                            UpdatedBy: 2
//                        });
//                    }
//                });

//            }
//            else {
//                if (isSelect) {
//                    chkSelect = true;

//                    LyingIntectShipArray.push({
//                        isSelect: isSelect,
//                        DailyFlightSNo: DailyFlightSNo,
//                        ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
//                        MovementType: 2,
//                        RFSRemarks: $(trMain).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
//                        LastPoint: $(trMain).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
//                        UpdatedBy: 2
//                    });
//                }
//            }

//        });
//        $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
//            var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
//            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
//            var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
//            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
//            var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
//            var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
//            var DailyFlightSNo = $('#hdnFlightSNo').val();
//            var isSelect = $(trMain).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
//            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
//                var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
//                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
//                var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
//                var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

//                var PiecesIndex = nestedGridHeader.find("th[data-field='OLCPieces']").index();
//                var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
//                var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
//                var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
//                var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
//                var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
//                var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
//                var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

//                $(nestedGridContent).each(function (rowChild, trChild) {
//                    if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
//                        chkSelect = true;
//                    }
//                    var AG = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
//                    var AV = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
//                    var ACBM = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
//                    var PG = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
//                    var PV = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
//                    var PCBM = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
//                    if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
//                        OSCLyingBulkShipArray.push({
//                            isBulk: $(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
//                            AWBSNo: $(trChild).find('td:eq(' + AWBSNoIndex + ')').text(),
//                            DailyFlightSNo: DailyFlightSNo,
//                            TotalPieces: $(trChild).find('td:eq(' + PiecesIndex + ')').text(),
//                            PlannedPieces: $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
//                            ActualVolumeWt: AV,
//                            ActualGrossWt: AG,
//                            ActualCBM: ACBM,
//                            PlannedGrossWt: PG,
//                            PlannedVolumeWt: PV,
//                            PlannedCBM: PCBM,

//                            ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
//                            MovementType: 2,
//                            RFSRemarks: $(trChild).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
//                            AWBOffPoint: $(trChild).find('td:eq(' + AWBOffPointIndex + ') input[type=Text]').val().toUpperCase(),
//                            // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
//                            // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
//                            UpdatedBy: 2
//                        });
//                    }
//                });

//            }
//            else {
//                if (isSelect) {
//                    chkSelect = true;

//                    OSCLyingIntectShipArray.push({
//                        isSelect: isSelect,
//                        DailyFlightSNo: DailyFlightSNo,
//                        ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
//                        MovementType: 2,
//                        RFSRemarks: $(trMain).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
//                        LastPoint: $(trMain).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
//                        UpdatedBy: 2
//                    });
//                }
//            }

//        });
//        var FunctionName = "";
//        //if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
//        //    FunctionName = "SavePMenifestInformation";
//        //    mode = FlightCloseFlag == "PRE" ? "PRE_FINAL" : SaveProcessStatus
//        //}
//        //else //if(SaveProcessStatus== "MAN")
//        //{
//        FunctionName = "SaveGatePass";
//        mode = SaveProcessStatus
//        //}

//        var postData = SaveProcessStatus == "GP" ? JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, LyingBulkShipmentInfo: LyingBulkShipArray, LyingIntectShipmentInfo: LyingIntectShipArray, OSCLyingBulkShipmentInfo: OSCLyingBulkShipArray, OSCLyingIntectShipmentInfo: OSCLyingIntectShipArray, FlightType: FlightType, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val(), mode: mode, ATDDate: cfi.CfiDate("txtATDDate"), ATDTime: $("#txtATDTime").val(), IsExcludeFromFFM: $("#IsExcludeFromFFM").prop("checked") }) : JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, LyingBulkShipmentInfo: LyingBulkShipArray, LyingIntectShipmentInfo: LyingIntectShipArray, OSCLyingBulkShipmentInfo: OSCLyingBulkShipArray, OSCLyingIntectShipmentInfo: OSCLyingIntectShipArray, FlightType: FlightType, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val(), mode: mode });

//        if (SaveProcessStatus == "GP") {
//            $.ajax({
//                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
//                data: postData,
//                contentType: "application/json; charset=utf-8",
//                success: function (result) {
//                    var ResultStatus = result.split('?')[0];
//                    var ResultValue = result.split('?')[1];
//                    if (ResultStatus == "0" || ResultStatus == "2") {
//                        if (ResultStatus == '2')//For Hold Shipment
//                        {
//                            var msgString = '';
//                            var AWBArray = ResultValue.split('@')[0];
//                            var HOLDRemarksArray = ResultValue.split('@')[1];
//                            $(AWBArray.split('^')).each(function (r, i) {
//                                msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
//                            });
//                            msgString = '<table>' + msgString + '</table>';

//                            ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
//                            //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
//                            flag = false;
//                        }
//                        if (SaveProcessStatus == "PRE_FINAL")
//                            ShowMessage('success', 'Success -Pre Manifest Created Successfully', "Processed Successfully", "bottom-right");
//                        else if (SaveProcessStatus == "PRE")
//                            ShowMessage('success', 'Success -Pre Manifest created Successfully', "Processed Successfully", "bottom-right");
//                        else if (SaveProcessStatus == "DEP")
//                            ShowMessage('success', 'Success -Flight Departed Successfully', "Processed Successfully", "bottom-right");
//                        else if (SaveProcessStatus == "MAN" && $('#btnSave').text().toUpperCase() == "UPDATE MANIFEST")
//                            ShowMessage('success', 'Success -Manifest Updated Successfully', "Processed Successfully", "bottom-right");
//                        else
//                            ShowMessage('success', 'Success -Manifest created Successfully', "Processed Successfully", "bottom-right");
//                        flag = true;
//                    }
//                    else if (ResultStatus == '1')//for Part Shipment
//                    {
//                        var AWBData = ResultValue.split('@')[0];
//                        if (SaveProcessStatus == "PRE_FINAL") {
//                            if (AWBData.length > 2) {
//                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
//                            }
//                        }
//                        else if (SaveProcessStatus == "PRE") {
//                            if (AWBData.length > 2) {
//                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
//                            }
//                        }
//                        else if (SaveProcessStatus == "DEP") {
//                            if (AWBData.length > 2) {
//                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
//                            }
//                        }
//                        else if (SaveProcessStatus == "MAN") {
//                            if (AWBData.length > 2) {
//                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
//                            }
//                        }
//                        else
//                            ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
//                        flag = false;
//                    }
//                    else if (ResultStatus == '8')//For Hold Manifest Shipment
//                    {
//                        var msgString = '';
//                        var AWBArray = ResultValue.split('@')[0];
//                        var HOLDRemarksArray = ResultValue.split('@')[1];
//                        $(AWBArray.split('^')).each(function (r, i) {
//                            msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
//                        });
//                        msgString = '<table>' + msgString + '</table>';

//                        ShowMessage('warning', 'Warning -Shipment ', 'Few pieces of shipments ' + msgString + '.Kindly cross check and plan the remaining pieces accordingly', "bottom-right");
//                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
//                        flag = false;
//                    }
//                    else if (ResultStatus == '9')//For CTM Charge
//                    {
//                        var msgString = '';
//                        var AWBArray = ResultValue.split('@')[1];
//                        var ChargeRemarksArray = ResultValue.split('@')[0];
//                        //$(AWBArray.split('^')).each(function (r, i) {
//                        //    msgString = msgString + '<tr><td>' + i + ',' + ChargeRemarksArray.split('^')[r] + '</td></tr>';
//                        //});
//                        msgString = ChargeRemarksArray + '' + AWBArray;

//                        ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
//                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
//                        flag = false;
//                    }
//                    else if (ResultStatus == '3')//For Gross Weight Exceed
//                    {
//                        if (SaveProcessStatus == "DEP") {
//                            ShowMessage('warning', 'Warning -Flight could not be departed', "Gross Weight Exceed ! ", "bottom-right");
//                        }
//                        else if (SaveProcessStatus == "MAN") {
//                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Gross Weight Exceed ! ", "bottom-right");
//                        }
//                        flag = false;
//                    }
//                    else if (ResultStatus == '4')//For Volumn Weight Exceed
//                    {
//                        if (SaveProcessStatus == "DEP") {
//                            ShowMessage('warning', 'Warning -Flight could not be departed', "Volume Weight Exceed ! ", "bottom-right");
//                        }
//                        else if (SaveProcessStatus == "MAN") {
//                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Volume Weight Exceed ! ", "bottom-right");
//                        }
//                        flag = false;
//                    }
//                    else if (ResultStatus == '5')//For RFS Truck ULD Exceed
//                    {
//                        if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
//                            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
//                        }
//                        flag = false;
//                    }
//                    else if (ResultStatus == '6')//For UWS Not Created
//                    {
//                        if (SaveProcessStatus == "DEP") {
//                            // ShowMessage('warning', "Warning", "UWS Incomplete for " + ResultValue + "</br>Kindly check again", "bottom-right");
//                            ShowMessage('warning', "Warning", ResultValue, "bottom-right");
//                            $("#cfMessage-container").css("margin-top", setshowmsg(ResultValue) + "%");
//                        }
//                        flag = false;
//                    }
//                    else if (ResultStatus == "7")//for CargoClassification 'PAX' Check with 'CAO'
//                    {
//                        ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

//                    }
//                    else if (ResultStatus == "10")//for comman Message
//                    {
//                        ShowMessage('warning', "Warning ", ResultValue, "bottom-right");
//                        flag = false;
//                    }
//                    else {
//                        ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
//                        flag = false;
//                    }
//                },
//                error: function (xhr) {
//                    if (SaveProcessStatus == "PRE_FINAL")
//                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
//                    else if (SaveProcessStatus == "PRE")
//                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
//                    else if (SaveProcessStatus == "DEP")
//                        ShowMessage('warning', 'Warning -Flight could not be departed', " ", "bottom-right");
//                    else
//                        ShowMessage('warning', 'Warning -Manifest could not be created ', " ", "bottom-right");
//                    flag = false;
//                }
//            });

//        }


//        else {
//            ShowMessage('warning', 'Warning -Selected flight has already departed', " ", "bottom-right");
//            flag = false;
//        }
//    }
//    return flag;

//}
function SaveManifestLyingInfo(mode) {

    var flag = false;
    var chkSelect = false;
    var IntectShipArray = new Array();
    var BulkShipArray = new Array();
    if (FlightCloseFlag != "DEP") {

        $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
            var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
            var DailyFlightSNo = $('#hdnFlightSNo').val();
            var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');

            if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {

                var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                var nestedGridContent = $(tr).next().find("div.k-grid-content");
                var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

                var PiecesIndex = nestedGridHeader.find("th[data-field='TotalPieces']").index();
                var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();

                $(nestedGridContent).each(function (row1, tr1) {
                    if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                        chkSelect = true;

                        var AG = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                        var AV = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                        var ACBM = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                        var PG = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                        var PV = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                        var PCBM = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                        BulkShipArray.push({
                            isBulk: $(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                            AWBSNo: $(tr1).find('td:eq(' + AWBSNoIndex + ')').text(),
                            DailyFlightSNo: DailyFlightSNo,
                            TotalPieces: $(tr1).find('td:eq(' + PiecesIndex + ')').text(),
                            PlannedPieces: $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                            ActualVolumeWt: AV,
                            ActualGrossWt: AG,
                            ActualCBM: ACBM,
                            PlannedGrossWt: PG,
                            PlannedVolumeWt: PV,
                            PlannedCBM: PCBM,

                            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                            MovementType: 2,
                            // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                            // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                            UpdatedBy: 2
                        });
                    }
                });

            }
            else {
                if (isSelect) {
                    chkSelect = true;

                    IntectShipArray.push({
                        isSelect: isSelect,
                        DailyFlightSNo: DailyFlightSNo,
                        ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                        UpdatedBy: 2
                    });
                }
            }

        });
        //  console.log(JSON.stringify(ManifestArray))if (FlightCloseFlag == 'BUP') {;
        // alert(JSON.stringify(BulkShipArray));
        // alert(JSON.stringify(IntectShipArray));
        var FunctionName = '';// FlightStatusFlag == "1_2_0_0" ? "SavePMenifestInformation" : "SaveMenifestInformation";
        if (FlightCloseFlag == 'BUP') {
            FunctionName = "SavePMenifestInformation";
        }
        else if (FlightCloseFlag == "PRE" && mode == "LYINGLIST") {
            FunctionName = "SavePMenifestInformation";
        }
        else {
            FunctionName = "SaveMenifestInformation";
        }

        if (chkSelect) {
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, mode: mode }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success -Lying List created successfully', "Processed Successfully", "bottom-right");
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning -Lying List could not be created ', " ", "bottom-right");
                        flag = false;
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning -Lying List could not be created ', " ", "bottom-right");
                    flag = false;
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning - Select a shipment to prepare Lying List', " ", "bottom-right");
            flag = false;
        }
    }
    else {
        ShowMessage('warning', 'Warning -selected flight has departed', " ", "bottom-right");
        flag = false;
    }
    return flag;
}
var CurrentRowHidden;
function fun_Remarks(e) {
    CurrentRowHidden = e;
    //  alert($(e).parent().html());

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/AWBRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetailPop").html(result);

            $('#Remarks').val($(e).parent().find('input[type=hidden]').val() == "Add" ? "" : $(e).parent().find('input[type=hidden]').val());
            cfi.PopUp("__divawbremarks__", "AWB Remarks");
            $('.k-window').closest("div:hidden").remove();

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

function fun_HDQRemarks(e, ActionFrom) {
    //CurrentRowHidden = e;
    //alert($(e).parent().html());
    var AWBSNO = ActionFrom == 1 ? $(e).closest('tr').find('td[data-column=SNo]').text() : $(e).closest('tr').find('td[data-column=AWBSNo]').text();


    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetHDQRemarks?DFGroupSNo=" + GroupFlightSNo + "&AWBSNo=" + AWBSNO, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // alert(result);
            var ResultData = jQuery.parseJSON(result);
            var Data = ResultData.Table0;
            $("#divDetailPop").html("<span>" + Data[0].Remarks + "</span>");
            // $('#Remarks').val($(e).parent().find('input[type=hidden]').val() == "Add" ? "" : $(e).parent().find('input[type=hidden]').val());
            cfi.PopUp("divDetailPop", "AWB HDQ Remarks", 300);
            // $('.k-window').closest("div:hidden").remove();

        }
    });

    //$.ajax({
    //    url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/AWBRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        $("#divDetailPop").html(result);

    //        $('#Remarks').val($(e).parent().find('input[type=hidden]').val() == "Add" ? "" : $(e).parent().find('input[type=hidden]').val());
    //        cfi.PopUp("__divawbremarks__", "AWB Remarks");
    //        $('.k-window').closest("div:hidden").remove();

    //    }

    //});


}

function fn_AddManifestRemarks(e) {
    GetManifestRemarks();
    //$.ajax({
    //    url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/ManifestRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        $("#divManifestRemarksPop").html(result);
    //        GetManifestRemarks();
    //        cfi.PopUp("__divmanifestremarks__", "Manifest Remarks");
    //        $('.k-window').closest("div:hidden").remove();
    //    },
    //    beforeSend: function (jqXHR, settings) {
    //    },
    //    complete: function (jqXHR, textStatus) {
    //    },
    //    error: function (xhr) {
    //        var a = "";
    //    }
    //});


}

function fn_AddOSI(e) {
    // alert("Test");
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/ManifestOSI/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#divDetailPop").html(result);
            GetManifestOSIDetails();
            cfi.PopUp("__divmanifestosi__", "OSI Details");
            $('.k-window').closest("div:hidden").remove();
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


function GetManifestOSIDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetManifestOSIDetails?DFGroupSNo=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // alert(result);
            var ResultData = jQuery.parseJSON(result);
            var Data = ResultData.Table0;
            // alert(Data.OSI1);
            if (Data.length > 0) {
                //alert(ResultData.OSI1);
                $('#txtManifestOSI_1').val(Data[0].OSI1);
                $('#txtManifestOSI_2').val(Data[0].OSI2);

            }

            if (FlightCloseFlag == "DEP") {
                $("#__divmanifestosi__").find("input[type='button']").remove();
                $("#txtManifestOSI_1").replaceWith('<label name="txtManifestOSI_1" id="txtManifestOSI_1">' + $("#txtManifestOSI_1").val().toUpperCase() + '</label>');
                $("#txtManifestOSI_2").replaceWith('<label name="txtManifestOSI_2" id="txtManifestOSI_2">' + $("#txtManifestOSI_2").val().toUpperCase() + '</label>');

            }

        }
    });
}

function GetManifestRemarks() {
    var DelayRemarks = '<table id="recordTbl" style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;">  <tbody><tr style="background-color:#b3b3b3; font-weight:bold; border:1px solid black;">                                            <td style="width:7%;">Delay Code</td>                                            <td style="width:7%;">Delay Sub Code</td>                                            <td style="width:12%;">Delay Code Description</td>                                            <td style="width:15%;">Estimated Time of Departure(hrs)</td>                                            <td style="width:12%;  ">Estimated Take Off(hrs)</td>                                                           <td style="width:15%;">Estimated Time of Arrival(hrs)</td>                                            <td style="width:10%;">Actual Departure-Chokes Off(hrs)</td><td style="width:10%;">Actual Departure- Airborne(hrs)</td><td style="width:10%;">Supplementary Information</td></tr>';

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetManifestRemarks?DFGroupSNo=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                $(FinalData).each(function (row, tr) {
                    DelayRemarks = DelayRemarks + '<tr style="border:1px solid black;"><td style="width:8%;">' + tr.DelayCode + '</td><td style="width:5%;">' + tr.DelaySubCode + '</td><td style="width:3%;">' + tr.DelayCodeDescription + '</td><td style="width:3%;">' + tr.EstimatedTimeofDeparture + '</td><td style="width:3%;">' + tr.EstimatedTakeOff + '</td><td style="width:3%;" >' + tr.EstimatedTimeofArrival + '</td><td style="width:3%;" >' + tr.ActualDepartureChokesOff + '</td><td style="width:3%;" >' + tr.ActualDepartureAirborne + '</td><td style="width:3%;" >' + tr.SupplementaryInformation + '</td></tr>';
                });
            }
            DelayRemarks = DelayRemarks + '</tbody></table>';

            $('#divFltDetails').html(DelayRemarks);
            // $('#ManifestRemarks').val(FinalData[0].ManifestRemarks);
            cfi.PopUp("divFltDetails", "Delay Remarks");
            $('.k-window').closest("div").css("width", "1000px");




        }
    });
}

function SaveManifestOSI(e) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/saveOSIDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DFGroupSNo: CurrentFlightSno, OSI1: $('#txtManifestOSI_1').val(), OSI2: $('#txtManifestOSI_2').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#__divmanifestosi__").data("kendoWindow").close();
        },
    });
}
function SaveManifestRemarks(e) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/saveManifestRemarksDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DFGroupSNo: CurrentFlightSno, Remarks: $('#ManifestRemarks').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#__divmanifestremarks__").data("kendoWindow").close();
        },
    });



}

function GetStopOverFlightULDDetails() {
    ShowIndexView("divStopOverDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/STOPOVERFLIGHT/" + GroupFlightSNo + "/SOFLIGHT" + "/" + subprocesssno);
}
var OffloadDest;
var IsOffloadPopup = false;
function fn_ResetDestVal(e) {
    OffloadDest = $('#' + e).val();
}

//function fn_ValidateNILManifest(e) {

//    if (IsNILManifested == "true") {

//        fn_PrintNILManifest();
//    }
//    else {
//        if ($("#RegistrationNo").val() != "") {
//            $('#divDetailPop').html(msgHtml);
//            $('#btnTransfer').hide();
//            if (FlightStatus == "PRE" || FlightStatus == "MAN") {
//                $('#btnTransfer').show();
//            }
//            $("#spntdFlightNo").text($("#tdFlightNo").text());
//            cfi.PopUp("divFlightTransfer", "Confirmation");
//            $('.k-window').closest("div").css("width", "500px").css("left", "450px");
//            $('.k-window').closest("div:hidden").remove();
//        }
//        else {
//            ShowMessage('warning', 'Warning -Please Enter Aircraft Registration No.', " ", "bottom-right");
//        }
//    }
//}
function fn_OnCancel() {
    $("#divFlightTransfer").data("kendoWindow").close();
}
function fn_CreateAndvalidateNIL() {
    // fn_OnCancel();
    /*
    var FlightDest = FlightDestination.split('-');
    var CurrentCityIndex = FlightDest.indexOf(userContext.AirportCode);
    if (FlightDest.length > 2) {
        $("#__divflighttransfer__").data("kendoWindow").close();
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/NILManifestSector/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetailPop").html(result);
                IsOffloadPopup = true;
                var OffloadCity = new Array();
                $(FlightDest).each(function (row, i) {
                    if (row == 0)
                        OffloadCity.push({ Key: "ALL", Text: "ALL" });
                    if (row > CurrentCityIndex)
                        OffloadCity.push({ Key: userContext.AirportCode + "-" + i, Text: userContext.AirportCode + "-" + i })
                })
                cfi.AutoCompleteByDataSource("txtNILDestinationCity", OffloadCity, fn_ResetDestVal);
                cfi.PopUp("__divnilmanifestsector__", "Select NIL Manifest Sector");
                $('.k-window').closest("div:hidden").remove();
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
    OffloadDest = FlightDestination;
    */
    OffloadDest = "ALL"; //FlightDestination;
    fn_SaveNILManifest();
    // }
}
function fn_SaveNILManifest() {

    var OffloadRemarks;
    if (userContext.SysSetting.IsMandetoryOffloadRemarks.toUpperCase() == 'TRUE') {
        OffloadRemarks = $('#OffloadRemarks').val();
    }
    else {
        OffloadRemarks = '';
    }
    if ((userContext.SysSetting.IsMandetoryOffloadRemarks.toUpperCase() == 'TRUE') && ($('#OffloadRemarks').val() == '')) 
        {
            ShowMessage('warning', 'Warning - Select Offload remarks');
        }
    else {

            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/SaveNILMenifest", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ GroupFlightSNo: GroupFlightSNo, FlightOrigin: FlightOrigin, FlightDestination: OffloadDest, FlightStatus: FlightStatus, RegistrationNo: $("#RegistrationNo").val(), OffloadRemarks: OffloadRemarks, }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultStatus = result.split('?')[0];
                    var ResultValue = result.split('?')[1];
                    if (ResultStatus == "0") {
                        if (IsOffloadPopup)
                            $("#__divnilmanifestsector__").data("kendoWindow").close();

                        ShowMessage('success', 'Success -NIL Manifest created successfully', "Processed Successfully", "bottom-right");
                        FlightSearch();
                        flag = true;
                        $("#__divflighttransfer__").data("kendoWindow").close();
                    }
                    else if (ResultStatus == "1") {
                        ShowMessage('warning', 'Warning - NIL Manifest', ResultValue, "bottom-right");
                        flag = false;
                    }
                    else {
                        ShowMessage('warning', 'Warning - NIL Manifest could not be created', " ", "bottom-right");
                        flag = false;
                    }
                
                }
                });
    }
}


function fn_SaveTransitNILManifest() {
    if ($('#Text_txtNILDestinationCity').val() != "")
        fn_SaveNILManifest();
    else
        ShowMessage('warning', 'Warning -Please Select Destination City', " ", "bottom-right");
}
function fn_PrintNILManifest() {
    $.ajax({
        url: "HtmlFiles/Export/NilManifest.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            $('#FirstTab').text('NILManifest');
            $('#SecondTab').hide();
            $('#OSCTab').hide();
            $('#divAction').hide();
            $("#tabstrip").kendoTabStrip();
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/GetFlightData?DailyFlightSno=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultData = jQuery.parseJSON(result);
                    var FinalData = ResultData.Table0;
                    if (FinalData.length > 0) {
                        $('#spnOwner').text(FinalData[0].airlinename)
                        $('#spnFlifgtNo').text(FinalData[0].FlightNo)
                        $('#spnFlightDate').text(FinalData[0].FlightDate)
                        $('#spnPointOfLoading').text(FinalData[0].OriginCity)
                        $('#spnPointOfUnloading').text(FinalData[0].DestinationCity)
                        $('#spnRes').text(FinalData[0].RegistrationNo)

                        $("#btnPrint").unbind("click").bind("click", function () {
                            //  alert($("#divDetailPrint").html());
                            $("#divDetailPrint #divDetail").printArea();
                        });
                    }
                }
            })

        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            // var a = "";
        }
    });

}
function ResetSelectedFlight() {
    $("#Text_FlightNo").data("kendoAutoComplete").value("");
    $("#Text_FlightNo").data("kendoAutoComplete").key("");
}
function fn_TransferFlightXML() {
    // fn_OnCancel();
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/FlightTransfer/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetailPop").html(result);
            $('#btnTransfer').closest('td').attr('colspan', 2);
            $('#CreateNILManifest').closest('td').attr('colspan', 2);
            $('#FlightTransfer').closest('td').attr('colspan', 2);
            $('#FlightTransfer').closest('tr').find('td[class="formthreelabel"]').remove();

            cfi.PopUp("__divflighttransfer__", "Flight Transfer Details");
            $("#FlightDate").kendoDatePicker();
            $("span[id=FlightOrigin]").text(userContext.AirportCode);
            $("#FlightDate").data("kendoDatePicker").value($("#tdFlightDate").text()); 
            //Changes by Vipin Kumar
            //cfi.AutoComplete("FlightNo", "FlightNo", "vwTransferFlightRCS", "SNO", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoCompleteV2("FlightNo", "FlightNo", "Flight_Control_FlightNo", null, "contains");
            //Ends
           
            $('#FlightDate').unbind("change").bind('change', function () { ResetSelectedFlight(); });
            $('.k-window').closest("div:hidden").remove();
            if (userContext.SysSetting.IsMandetoryOffloadRemarks.toUpperCase() == "TRUE") {
                cfi.AutoCompleteV2("OffloadRemarks", "Reason", "Flight_Control_OffloadRemarks", null, "contains", ",");
            }
            else {
                $('#__divflighttransfer__ table tr:eq(1)').hide();
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

function fn_liVersion(e) {

    var latestLiVer = 0;
    var flag = false;
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/getLatestLIVersion",
        async: false,
        type: "GET",
        data: { DailyFlightSNo: $('#hdnFlightSNo').val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (liversion) {
            var finalData = jQuery.parseJSON(liversion);
            latestLiVer = finalData.Table0[0].latestVersion;
            if (latestLiVer > 0) flag = true;
        },
        error: function (error) {


        }

    });

    if (flag == true) {
        $("#divLiVersionPop").remove();

        $('body').append($("<div />", {
            id: 'divLiVersionPop'
        }));

        $("#divLiVersionPop").append('<ul id="ulid" align="center"></ul>');

        //for (var i = 1; i <= latestLiVer; i++) {
        //    $("#divLiVersionPop").find("[id='ulid']").append($(document.createElement('li'))
        //        .append(
        //            $(document.createElement('button'))
        //                .addClass('btn btn-info btn-sm')
        //                .text((i == 1 ? i + 'st' : (i == 2 ? i + "nd" : (i == 3 ? i + "rd" : i + "th"))) + ' LI Version')

        //        ).css({ "display": "inline" }));
        //}

        $("#divLiVersionPop").find("[id='ulid']").append($(document.createElement('li'))
            .append("<div width='100%' style='text-allign:center'>LI Version :<input type='hidden' name='Liversion' id='Liversion' value='' /><input type='text' class='' name='Text_Liversion'  id='Text_Liversion'  tabindex=1002  controltype='autocomplete'   maxlength='10' data-width='40px'  value='' placeholder='LI Version' /><button class='btn btn-info btn-sm' id='btn_LiversionShow' onclick='ShowLiversion();'>Show</button><button class='btn btn-info btn-sm' id='btn_LiversionPrint' onclick='PrintLiVersion();'>Print</button></div>").css({ "display": "inline" }));

        var LiversionArray = new Array()
        for (var i = 1; i <= latestLiVer; i++) {
            LiversionArray.push({ Key: i.toString(), Text: i.toString() })
        }

        cfi.AutoCompleteByDataSource("Liversion", LiversionArray);
        //$("#ulid").on("click", "li", function () {
        //    showLIVersion($(this).index() + 1);

        //});

        cfi.PopUp("divLiVersionPop", "LI Version Details");
    }
    else
        alert("Record Not Found.");

}
function ShowLiversion() {
    if ($('#Liversion').val() == '') {
        ShowMessage('warning', 'Select Li version', " ", "bottom-right");
        return;
    }
    else {
        showLIVersion($('#Liversion').val());
    }
}
function PrintLiVersion() {
    if ($('#Liversion').val() == '') {
        ShowMessage('warning', 'Select Li version', " ", "bottom-right");
        return;
    }

    $("#divDetailPop").html("");
    $("#divDetailPop").css('display', 'none');
    //$("#divDetail").html("");
    var FlightSNoArray = GroupFlightSNo.split(',');
    var liv = $('#Liversion').val() == '' ? '0' : $('#Liversion').val();
    $(FlightSNoArray).each(function (r, i) {
        // if (r < (FlightSNoArray.length - 1)) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetLIReportForLiversion?DailyFlightSNo=" + i + ',' + liv,
            async: false,
            type: "get",
            dataType: "html",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //  $("#btnPrint").closest('tr').hide();
                // $('#SecondTab').hide();
                //$('#OSCTab').hide();
                // $('#FlightStopOverDetailTab').hide();
                $("#divDetailPop").append(result);
                // console.log(result);

                if (r < (FlightSNoArray.length - 1)) {
                    $("#divDetailPop").append('</br><div class="page-break"></div>');
                }
            },
            error: function (rex) {
                //   alert(rex);
            }
        });
        // }
    })
    printDiv('LoadingInstruction');
    // $("#divDetailPop #btnPrint:last").closest('tr').show();
}
function fn_ValidateNILManifest(e) {

    if (IsNILManifested == "true") {

        fn_PrintNILManifest();
    }
    else {
        if ($("#RegistrationNo").val() != "" || ($("#RegistrationNo").val() == "" && IsRFS == true)) {

            $('#btnTransfer').hide();
            $('#FlightTransfer').hide();
            if (FlightStatus == "PRE" || FlightStatus == "MAN") {
                fn_TransferFlightXML();
                $('#btnTransfer').show();
                $('#FlightTransfer').show();
            }
            else if (FlightStatus.toUpperCase() == "OPEN" || FlightStatus.toUpperCase() == "LI" || FlightStatus.toUpperCase() == "BUILD UP") {
                var r = jConfirm("Are you sure you want to create NIL Manifest ?", "", function (r) {
                    if (r == true) {
                        fn_CreateAndvalidateNIL();
                        FlightSearch();
                    }
                });

            }
            $("#spntdFlightNo").text($("#tdFlightNo").text());
        }
        else {
            var str = IsRegistrationAvailable == true ? 'select' : 'enter';
            ShowMessage('warning', 'Warning -Please ' + str + ' Aircraft Registration No.', " ", "bottom-right");
        }
    }
}
//function fn_ValidateNILManifest(e) {

//    if (IsNILManifested == "true") {

//        fn_PrintNILManifest();
//    }
//    else {
//        if ($("#RegistrationNo").val() != "") {
//            fn_TransferFlightXML();
//            $('#btnTransfer').hide();
//            $('#FlightTransfer').hide();
//            if (FlightStatus == "PRE" || FlightStatus == "MAN") {
//                $('#btnTransfer').show();
//                $('#FlightTransfer').show();
//            }
//            $("#spntdFlightNo").text($("#tdFlightNo").text());
//        }
//        else {
//            ShowMessage('warning', 'Warning -Please Enter Aircraft Registration No.', " ", "bottom-right");
//        }
//    }
//}
function fn_UpdateFlightTransfer(input, ProcessType) {
    var TotalULDCount = 0, OFLD_AWBSNo = "-1", TR_AWBSNo = "-1", OFLD_MCBookingSNo = "-1", TR_MCBookingSNo = "-1", TR_UldStockSNo = "-1", OFLD_UldStockSNo = "-1";
    var OffloadRemarks;
    if (userContext.SysSetting.IsMandetoryOffloadRemarks.toUpperCase() == 'TRUE') {
        OffloadRemarks = $('#OffloadRemarks').val();
    }
    else {
        OffloadRemarks = '';
    }
    if ($("#Text_FlightNo").data("kendoAutoComplete").key() != "") {
        if ($("#OffloadRemarks").val() == "" && userContext.SysSetting.IsMandetoryOffloadRemarks.toUpperCase() == 'TRUE') {
        
            ShowMessage('warning', 'Warning -Please Select Offload Remarks ', " ", "bottom-right");

        }
        else {
            /////////////////////////////
            $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
                var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
                var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                    var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                    var nestedGridContent = $(tr).next().find("div.k-grid-content > table > tbody  tr");
                    var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                    var MCBookingSNoIndex = nestedGridHeader.find("th[data-field='McBookingSNo']").index();
                    var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
                    $(nestedGridContent).each(function (row1, tr1) {
                        if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                            TR_AWBSNo = TR_AWBSNo + ($(tr1).find('td:eq(' + AWBSNoIndex + ')').text() != '0' ? "," + $(tr1).find('td:eq(' + AWBSNoIndex + ')').text() : '');
                            TR_MCBookingSNo = TR_MCBookingSNo + ($(tr1).find('td:eq(' + MCBookingSNoIndex + ')').text() != '0' ? "," + $(tr1).find('td:eq(' + MCBookingSNoIndex + ')').text() : '');
                        }
                        else {
                            OFLD_AWBSNo = OFLD_AWBSNo + ($(tr1).find('td:eq(' + AWBSNoIndex + ')').text() != '0' ? "," + $(tr1).find('td:eq(' + AWBSNoIndex + ')').text() : '');
                            OFLD_MCBookingSNo = OFLD_MCBookingSNo + ($(tr1).find('td:eq(' + MCBookingSNoIndex + ')').text() != '0' ? "," + $(tr1).find('td:eq(' + MCBookingSNoIndex + ')').text() : '');
                        }
                    });
                }
                else {
                    if (isSelect) {
                        TotalULDCount = TotalULDCount + 1;
                        TR_UldStockSNo = TR_UldStockSNo + "," + $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text();
                    }
                    else
                        OFLD_UldStockSNo = OFLD_UldStockSNo + "," + $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text();
                }
            });
            //////////////////////////////
            var IsAllSellected = true;
            $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
                var nestedGridContent = $(tr).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (row1, tr1) {
                    if ($(tr1).find("td[data-column=Bulk] input[type=checkbox]").prop('checked') == false) {
                        IsAllSellected = false;
                    }
                });
                if ($(tr).find("td[data-column=isSelect] input[type=checkbox]").prop('checked') == false) {
                    IsAllSellected = false;
                }

            });

            var IsDataPushToPlan = false, IsULDOFLD = false;
            if ($("#Text_FlightNo").data("kendoAutoComplete").key().split('_')[1] == 'LI' && TotalULDCount > 0) {
                var ofr = jConfirm("Flight No '" + $("#Text_FlightNo").data("kendoAutoComplete").value().trim() + "' is in " + $("#Text_FlightNo").data("kendoAutoComplete").key().split('_')[1] + " Stage. All Built ULD's would be marked as Off-Loaded, Do you wish to continue ?", "", function (ofr) {
                    IsULDOFLD = ofr == true ? true : false;
                    if (IsULDOFLD) {
                        if (IsStopOver && IsAllSellected) {
                            var r = jConfirm("Are you sure,you want to Transfer Stopover data in to plan section, else on Cancel the stopover data would be offloaded in current Airport ?", "", function (r) {
                                IsDataPushToPlan = r == true ? true : false;
                                $.ajax({
                                    url: "Services/FlightControl/FlightControlService.svc/UpdateTransferFlight", async: false, type: "POST", dataType: "json", cache: false,
                                    data: JSON.stringify({ OLDGroupFlightSNo: GroupFlightSNo, NewDailyFlightSno: $("#Text_FlightNo").data("kendoAutoComplete").key().split('_')[0], OFLD_AWBSNo: OFLD_AWBSNo, TR_AWBSNo: TR_AWBSNo, OFLD_MCBookingSNo: OFLD_MCBookingSNo, TR_MCBookingSNo: TR_MCBookingSNo, TR_UldStockSNo: TR_UldStockSNo, OFLD_UldStockSNo: OFLD_UldStockSNo, ProcessType: ProcessType, IsDataPushToPlan: IsDataPushToPlan, IsStopOverCargo: IsStopOver, OffloadRemarks: OffloadRemarks, }),
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        var ResultStatus = result.split('?')[0];
                                        var ResultValue = result.split('?')[1];
                                        if (ResultStatus == "0") {
                                            ShowMessage('success', 'Success -Processed Successfully', ResultValue, "bottom-right");
                                            //ShowMessage('success', 'Success - All selected shipments have been transferred from ' + $("#tdFlightNo").text() + "/" + $("#tdFlightDate").text() + " to " + $("#Text_FlightNo").val() + "/" + $("#tdFlightDate").text() + ' successfully', "Processed Successfully", "bottom-right");
                                            var FlightDest = FlightDestination.split('-');
                                            if (FlightDest.length > 2)
                                                OffloadDest = "ALL"
                                            else
                                                OffloadDest = FlightDestination;

                                            //if ((OFLD_AWBSNo == "-1" && OFLD_UldStockSNo == "-1") || ProcessType == 1)
                                            //    fn_SaveNILManifest();
                                            $("#__divflighttransfer__").data("kendoWindow").close();
                                            FlightSearch();
                                            flag = true;
                                        }
                                        else if (ResultStatus == "1") {
                                            ShowMessage('warning', 'Warning - Flight Transfer', ResultValue, "bottom-right");
                                            flag = false;
                                        }
                                        else {
                                            ShowMessage('warning', 'Warning - Flight transfer Process could not be completed', " ", "bottom-right");
                                            flag = false;
                                        }
                                    }

                                });
                            });
                        }
                        else {
                            $.ajax({
                                url: "Services/FlightControl/FlightControlService.svc/UpdateTransferFlight", async: false, type: "POST", dataType: "json", cache: false,
                                data: JSON.stringify({ OLDGroupFlightSNo: GroupFlightSNo, NewDailyFlightSno: $("#Text_FlightNo").data("kendoAutoComplete").key().split('_')[0], OFLD_AWBSNo: OFLD_AWBSNo, TR_AWBSNo: TR_AWBSNo, OFLD_MCBookingSNo: OFLD_MCBookingSNo, TR_MCBookingSNo: TR_MCBookingSNo, TR_UldStockSNo: TR_UldStockSNo, OFLD_UldStockSNo: OFLD_UldStockSNo, ProcessType: ProcessType, IsDataPushToPlan: IsDataPushToPlan, IsStopOverCargo: false, IsULDOFLD: IsULDOFLD, OffloadRemarks: OffloadRemarks, }),
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    var ResultStatus = result.split('?')[0];
                                    var ResultValue = result.split('?')[1];
                                    if (ResultStatus == "0") {
                                        ShowMessage('success', 'Success -Processed Successfully', ResultValue, "bottom-right");
                                        //ShowMessage('success', 'Success - All selected shipments have been transferred from ' + $("#tdFlightNo").text() + "/" + $("#tdFlightDate").text() + " to " + $("#Text_FlightNo").val() + "/" + $("#tdFlightDate").text() + ' successfully', "Processed Successfully", "bottom-right");
                                        var FlightDest = FlightDestination.split('-');
                                        if (FlightDest.length > 2)
                                            OffloadDest = "ALL"
                                        else
                                            OffloadDest = FlightDestination;

                                        //if ((OFLD_AWBSNo == "-1" && OFLD_UldStockSNo == "-1") || ProcessType == 1)
                                        //    fn_SaveNILManifest();
                                        $("#__divflighttransfer__").data("kendoWindow").close();
                                        FlightSearch();
                                        flag = true;
                                    }
                                    else if (ResultStatus == "1") {
                                        ShowMessage('warning', 'Warning - Flight Transfer', ResultValue, "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning - Flight transfer Process could not be completed', " ", "bottom-right");
                                        flag = false;
                                    }
                                }

                            });
                        }
                    }
                });
            }
            else {
                if (IsStopOver && IsAllSellected) {
                    var r = jConfirm("Are you sure,you want to Transfer Stopover data in to plan section, else on Cancel the stopover data would be offloaded in current Airport ?", "", function (r) {
                        IsDataPushToPlan = r == true ? true : false;
                        $.ajax({
                            url: "Services/FlightControl/FlightControlService.svc/UpdateTransferFlight", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ OLDGroupFlightSNo: GroupFlightSNo, NewDailyFlightSno: $("#Text_FlightNo").data("kendoAutoComplete").key().split('_')[0], OFLD_AWBSNo: OFLD_AWBSNo, TR_AWBSNo: TR_AWBSNo, OFLD_MCBookingSNo: OFLD_MCBookingSNo, TR_MCBookingSNo: TR_MCBookingSNo, TR_UldStockSNo: TR_UldStockSNo, OFLD_UldStockSNo: OFLD_UldStockSNo, ProcessType: ProcessType, IsDataPushToPlan: IsDataPushToPlan, IsStopOverCargo: IsStopOver, IsULDOFLD: IsULDOFLD, OffloadRemarks: OffloadRemarks, }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                var ResultStatus = result.split('?')[0];
                                var ResultValue = result.split('?')[1];
                                if (ResultStatus == "0") {
                                    ShowMessage('success', 'Success -Processed Successfully', ResultValue, "bottom-right");
                                    //ShowMessage('success', 'Success - All selected shipments have been transferred from ' + $("#tdFlightNo").text() + "/" + $("#tdFlightDate").text() + " to " + $("#Text_FlightNo").val() + "/" + $("#tdFlightDate").text() + ' successfully', "Processed Successfully", "bottom-right");
                                    var FlightDest = FlightDestination.split('-');
                                    if (FlightDest.length > 2)
                                        OffloadDest = "ALL"
                                    else
                                        OffloadDest = FlightDestination;

                                    //if ((OFLD_AWBSNo == "-1" && OFLD_UldStockSNo == "-1") || ProcessType == 1)
                                    //    fn_SaveNILManifest();
                                    $("#__divflighttransfer__").data("kendoWindow").close();
                                    FlightSearch();
                                    flag = true;
                                }
                                else if (ResultStatus == "1") {
                                    ShowMessage('warning', 'Warning - Flight Transfer', ResultValue, "bottom-right");
                                    flag = false;
                                }
                                else {
                                    ShowMessage('warning', 'Warning - Flight transfer Process could not be completed', " ", "bottom-right");
                                    flag = false;
                                }
                            }

                        });
                    });
                }
                else {
                    $.ajax({
                        url: "Services/FlightControl/FlightControlService.svc/UpdateTransferFlight", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ OLDGroupFlightSNo: GroupFlightSNo, NewDailyFlightSno: $("#Text_FlightNo").data("kendoAutoComplete").key().split('_')[0], OFLD_AWBSNo: OFLD_AWBSNo, TR_AWBSNo: TR_AWBSNo, OFLD_MCBookingSNo: OFLD_MCBookingSNo, TR_MCBookingSNo: TR_MCBookingSNo, TR_UldStockSNo: TR_UldStockSNo, OFLD_UldStockSNo: OFLD_UldStockSNo, ProcessType: ProcessType, IsDataPushToPlan: IsDataPushToPlan, IsStopOverCargo: false, IsULDOFLD: IsULDOFLD, OffloadRemarks: OffloadRemarks, }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var ResultStatus = result.split('?')[0];
                            var ResultValue = result.split('?')[1];
                            if (ResultStatus == "0") {
                                ShowMessage('success', 'Success -Processed Successfully', ResultValue, "bottom-right");
                                //ShowMessage('success', 'Success - All selected shipments have been transferred from ' + $("#tdFlightNo").text() + "/" + $("#tdFlightDate").text() + " to " + $("#Text_FlightNo").val() + "/" + $("#tdFlightDate").text() + ' successfully', "Processed Successfully", "bottom-right");
                                var FlightDest = FlightDestination.split('-');
                                if (FlightDest.length > 2)
                                    OffloadDest = "ALL"
                                else
                                    OffloadDest = FlightDestination;

                                //if ((OFLD_AWBSNo == "-1" && OFLD_UldStockSNo == "-1") || ProcessType == 1)
                                //    fn_SaveNILManifest();
                                $("#__divflighttransfer__").data("kendoWindow").close();
                                FlightSearch();
                                flag = true;
                            }
                            else if (ResultStatus == "1") {
                                ShowMessage('warning', 'Warning - Flight Transfer', ResultValue, "bottom-right");
                                flag = false;
                            }
                            else {
                                ShowMessage('warning', 'Warning - Flight transfer Process could not be completed', " ", "bottom-right");
                                flag = false;
                            }
                        }

                    });
                }
            }

            //$.ajax({
            //    url: "Services/FlightControl/FlightControlService.svc/UpdateTransferFlight", async: false, type: "POST", dataType: "json", cache: false,
            //    data: JSON.stringify({ OLDGroupFlightSNo: GroupFlightSNo, NewDailyFlightSno: $("#Text_FlightNo").data("kendoAutoComplete").key(), OFLD_AWBSNo: OFLD_AWBSNo, TR_AWBSNo: TR_AWBSNo, TR_UldStockSNo: TR_UldStockSNo, OFLD_UldStockSNo: OFLD_UldStockSNo, ProcessType: ProcessType, IsDataPushToPlan: IsDataPushToPlan }),
            //    contentType: "application/json; charset=utf-8",
            //    success: function (result) {
            //        var ResultStatus = result.split('?')[0];
            //        var ResultValue = result.split('?')[1];
            //        if (ResultStatus == "0") {
            //            ShowMessage('success', 'Success - All selected shipments have been transferred from ' + $("#tdFlightNo").text() + "/" + $("#tdFlightDate").text() + " to " + $("#Text_FlightNo").val() + "/" + $("#tdFlightDate").text() + ' successfully', "Processed Successfully", "bottom-right");
            //            var FlightDest = FlightDestination.split('-');
            //            if (FlightDest.length > 2)
            //                OffloadDest = "ALL"
            //            else
            //                OffloadDest = FlightDestination;

            //            if ((OFLD_AWBSNo == "-1" && OFLD_UldStockSNo == "-1") || ProcessType == 1)
            //                fn_SaveNILManifest();
            //            $("#__divflighttransfer__").data("kendoWindow").close();
            //            FlightSearch();
            //            flag = true;
            //        }
            //        else if (ResultStatus == "1") {
            //            ShowMessage('warning', 'Warning - Flight Transfer', ResultValue, "bottom-right");
            //            flag = false;
            //        }
            //        else {
            //            ShowMessage('warning', 'Warning - Flight transfer Process could not be completed', " ", "bottom-right");
            //            flag = false;
            //        }
            //    }

            //});


        }
       
    }
    else {
        ShowMessage('warning', 'Warning -Please Select FlightNo ', " ", "bottom-right");
    }
}



function SaveAWBRemarks(e) {
    //$('div[class="k-widget k-window"]').remove();
    $(CurrentRowHidden).parent().find('input[type=hidden]').val($('#Remarks').val());
    $(CurrentRowHidden).parent().find('a').text($('#Remarks').val());
    // $('div[class="k-widget k-window"]').data("kendoWindow").close();
    $("#__divawbremarks__").data("kendoWindow").close();
    ShowMessage('success', 'Success -Remarks added successfully', " ", "bottom-right");

}
function fun_PrintByProcess() {
    // alert(SaveProcessStatus);
    // $('#divAction').hide();
    $('#tblSearch').hide();
    //$("#tdNILManifest,#tdATDTime,#tdATDDate,#tdManRemarks,#tdregnNo,#tdregnNoTxt").hide();
    SaveProcessStatus = SaveProcessStatus;
    $('#tblSearch').show();
    if (SaveProcessStatus == "LI") {
        GetLIReportData(GroupFlightSNo);
    }
    else if (SaveProcessStatus == "BUP") {
        GetLIReportData(GroupFlightSNo);
    }
    else if (SaveProcessStatus == "PRE") {
        GetReportData(GroupFlightSNo);
    }
    else if (SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") {
        //if (IsNILManifested == 'true') {
        //    fn_PrintNILManifest();
        //}

        //else {
        // $('#rbNormal').prop('checked', true);
        //GetManifestReportData(GroupFlightSNo, 'N');
        /////////////for CBV shipment as discussed with CST/////////////////// 
        //if ($('#divDetail').html() == "" && (FlightCloseFlag == "MAN" || FlightCloseFlag == "DEP" || FlightCloseFlag == "CLSD") && ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR"))
        //{
        //    fn_PrintNILManifest();
        //}
        ///////////////////END////////////////////////
        // }
        if (userContext.SysSetting.ICMSEnvironment == 'I5') {
            GetManifestReportPrint(GroupFlightSNo, 'N');
        }
        else {
            GetManifestReportData(GroupFlightSNo, 'N');
        }
    }
    else if (SaveProcessStatus == "N") {
        $('#divDetail textarea').each(function () {
            $(this).replaceWith("<span id=" + $(this).attr("id") + ">" + $(this).val() + "</span>");
            // $(this).attr("style","font-size: 10px; font-family: 'Arial Tahoma'; border-bottom: none; font-weight: bold; color: gray;");
        })

        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/UpdateNotocStatus", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ GroupFlightSNo: GroupFlightSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
            }

        });

        $("#divDetailPrint #divDetail").printArea({ iframe: false });
    }
    else if (SaveProcessStatus == "A") {
        $("#divDetailPrint #divDetail").printArea();
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/UpdateAirmailStatus", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ GroupFlightSNo: GroupFlightSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                FlightSearch();
                flag = true;
            }

        });

    }
    else {
        //$("#divDetailPrint #divDetail").printArea();
    }
    //$("#dv_FlightManifestPrint").show();
}
//For Manage LI GrossWT
//For manage Li Calculation
function Get_ManageLICal(input) {
    fn_Cal_GVCBM1(input);
    ////var RemainingGWT = 0, RemainingVWT = 0, RemainingCBMWT = 0;
    //var flag = false;
    //var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    //var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    //var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    //var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    //var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    //var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    //var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    //var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    //var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    //var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    //var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    //if ($(input).val() != "") {
    //    var RemainingGWT = 0, RemainingVWT = 0, RemainingCBMWT = 0, PlannedActualVWT = 0, PlannedActualGWT = 0, PlannedActualCBMWT = 0,PlanPCs=0;
    //    var row_index = $(input).closest('tr').index();
    //    $(input).closest('tbody').find("tr").each(function (row, tr) {
    //        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
    //            if (row != row_index) {
    //                PlannedActualGWT = PlannedActualGWT + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
    //                PlannedActualVWT = PlannedActualVWT + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
    //                PlannedActualCBMWT = PlannedActualCBMWT + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
    //                PlanPCs = PlanPCs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
    //            }
    //            //PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
    //        }
    //    });
    //    RemainingGWT = parseFloat(ActualG_V_CBM[0]) - parseFloat(PlannedActualGWT);
    //    //RemainingVWT=parseFloat(ActualG_V_CBM[1])-parseFloat(PlannedActualVWT);
    //    //RemainingCBMWT=parseFloat(ActualG_V_CBM[2])-parseFloat(PlannedActualCBMWT);

    //    if ($.isNumeric($(input).val())) {
    //        if (RemainingGWT < 0) {
    //            ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
    //            //$(input).val(totalPcs - PlannedActualPcs);
    //            //fn_CalGVCBMForLI(input);
    //            flag = false;
    //        }
    //        else {
    //            $(input).closest('tbody').find("tr").each(function (row, tr) {
    //                if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
    //                    if (row != row_index) {
    //                        //   $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(0);
    //                        var trval = parseFloat($(input).val()) + (RemainingGWT /PlanPCs) *(parseFloat($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val()));
    //                        alert($(input).val() + " " + RemainingGWT + " " + PlanPCs + " " + $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
    //                        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(trval);
    //                    }
    //                }
    //            });
    //        }
    //    }
    //    else {
    //        ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
    //        //$(input).val(totalPcs);
    //        flag = false;

    //    }
    //    //Row wt+((rem/Tptal Other)*Each Row Pieces)

    //}

    ////
}
//

//for NOTOC PRINT
function fun_SendNTM() {
    var Sno = CurrentFlightSno;
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/SendNTM?Sno=" + Sno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            ShowMessage('success', "Success -NTM initiation successfully done", null, "bottom-right");
            FlightSearch();
        }
    })
    //$('#divDetail textarea').each(function () {
    //    $(this).replaceWith("<span id=" + $(this).attr("id") + ">" + $(this).val() + "</span>");
    //    // $(this).attr("style","font-size: 10px; font-family: 'Arial Tahoma'; border-bottom: none; font-weight: bold; color: gray;");
    //})
}

function fun_FlightClose() {
    if (IsFlightClosed) {
        ShowMessage('warning', 'Warning', "Flight already Closed", "bottom-right");
        return false;
    }
    else {
        var r = jConfirm("Are you sure,you want to Close Flight ?", "", function (r) {
            if (r == true) {
                $.ajax({
                    url: "Services/FlightControl/FlightControlService.svc/UpdateFlightStatus", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ DailyFlightSNo: $('#hdnFlightSNo').val() }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var ResultStatus = result.split('?')[0];
                        var ResultValue = result.split('?')[1];

                        if (ResultStatus == "0") {
                            ShowMessage('success', "Success -Flight Closed Successfully", " ", "bottom-right");
                            FlightSearch();
                        }

                        else if (ResultStatus == "1") {
                            ShowMessage('warning', 'Warning ', ResultValue, "bottom-right");
                        }
                        else {
                            ShowMessage('warning', 'Warning -Flight  could not be closed ', " ", "bottom-right");
                        }
                    },
                });
            }
        });
    }
}

//function fun_FlightClose() {
//    if (IsFlightClosed) {
//        ShowMessage('warning', 'Warning - Flight has already Closed', " ", "bottom-right");
//        return false;
//    }
//    else {
//        var r = jConfirm("Are you sure,you want to Close Flight ?", "", function (r) {
//            if (r == true) {
//                $.ajax({
//                    url: "Services/FlightControl/FlightControlService.svc/UpdateFlightStatus", async: false, type: "POST", dataType: "json", cache: false,
//                    data: JSON.stringify({ DailyFlightSNo: $('#hdnFlightSNo').val() }),
//                    contentType: "application/json; charset=utf-8",
//                    success: function (result) {
//                        var ResultStatus = result.split('?')[0];
//                        var ResultValue = result.split('?')[1];

//                        if (ResultStatus == "0") {
//                            ShowMessage('success', "Success -Flight Closed Successfully", " ", "bottom-right");
//                            FlightSearch();
//                        }
//                        else if (ResultStatus == "1") {
//                            ShowMessage('warning', 'Warning ', ResultValue, "bottom-right");
//                        }
//                        else {
//                            ShowMessage('warning', 'Warning -Flight  could not be closed ', " ", "bottom-right");
//                        }
//                    },
//                });
//            }
//        });
//    }
//}



function GetNotocData(sno) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetNotocRecord?Sno=" + sno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;
            var FinalData2 = ResultData.Table2;
            var FinalData3 = ResultData.Table3;
            var FinalData4 = ResultData.Table4;
            //Added by Pankaj kumar ishwar on 04-02-2019 for run time logo
            $('#dinMain0').find('#ImgLogo').attr('src', '');
            $('#dinMain0').find('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData2[0]["AirlineLOGO"]);
            $('#dinMain0').find('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/GaurdaCMS Logo.jpg";');
            if (FinalData2.length > 0) {
                //$('#spnPreparedBy').text(FinalData2[0].PreparedBy);
                $('#spnPreparedBy').text(FinalData2[0].PreparedBy);
                $('#spnOtherInfo').text(FinalData2[0].OtherInfo);
                $('#SpnStationOfLoading').text(FinalData2[0].OriginAirportCode)
                $('#spnFlightNo').text(FinalData2[0].FlightNo)
                $('#spnDate').text(FinalData2[0].FlightDate)
                $('#spnAircraftRegistration').text(FinalData2[0].RegistrationNo.toUpperCase())
            }
            var DGRNotoc = FinalData.length;
            var DgrCount = parseInt(DGRNotoc / 14);
            var DgrCountNext = parseInt(DGRNotoc % 14);
            // DgrCount=2
            var SPCNotoc = FinalData1.length;
            var SpcCount = parseInt(SPCNotoc / 6);
            var SpcCountNext = parseInt(SPCNotoc % 6);
            //if (SpcCount > 1 || DgrCount > 1) {
            if (SpcCount > DgrCount) {
                var div = $('#dinMain0').html();
                $('#dinMain0').after('<br/><div class="page-break" ></div>')
                for (var k = 1; k < SpcCount; k++) {
                    $('#divBreak').before('<div id="dinMain' + k + '">' + div + '</div><br/>')
                    $('#divBreak').before('<div id="divBreak' + k + '" class="page-break" ></div>')
                }
            }
            else if (DgrCount > 1) {
                var div = $('#dinMain0').html();
                $('#dinMain0').after('<br/><div class="page-break" ></div>')
                for (var k = 1; k < DgrCount; k++) {
                    $('#divBreak').before('<div id="dinMain' + k + '">' + div + '</div><br/>')
                    $('#divBreak').before('<div id="divBreak' + k + '" class="page-break" ></div>')

                    //$('#dinMain' + k).html(div);
                    //$('#dinMain' + k).after('<div id="divBreak"'+k +' class="page-break" ></div>')

                }
            }
            else {

            }
            //}
            if (DgrCount >= 1 || SpcCount >= 1) {
                var div = $('#dinMain0').html();
                if (DgrCountNext > 0 || SpcCountNext > 0) {
                    $('#divBreak').before('<div id="dinMain' + k + '">' + div + '</div><br/>')
                    $('#divBreak').before('<div id="divBreak' + k + '" class="page-break" ></div>')
                }
            }



            if (FinalData.length > 0) {
                $('#btn_SendNtm').css('visibility', 'visible');
                $('#td_sendNtm').show();
                var i = 0;
                var j = 0;
                var div1 = 0;
                var wayBill = FinalData[0].AWBNo

                $(FinalData).each(function (row, tr) {

                    if (tr.AWBNo != wayBill) {
                        j = parseInt(j) + 1;
                        wayBill = tr.AWBNo
                    }


                    i = parseInt(i) + 1;

                    //alert(tr.ProperShippingName.toUpperCase())
                    if (i < 15) {
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnStationOfUnloading' + i + '"]').text(tr.DestinationCity)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnAwbNo' + i + '"]').text(tr.AWBNo)
                        // $('#spnAwbNo' + i).text(tr.AWBNo)

                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnShipperName' + i + '"]').html(tr.ProperShippingName.toUpperCase())

                        // $('#spnShipperName' + i).html(tr.ProperShippingName.toUpperCase())
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnClass' + i + '"]').text(tr.ClassDivSub)
                        // $('#spnClass' + i).text(tr.ClassDivSub)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnUNNo' + i + '"]').text(tr.UNNo)
                        // $('#spnUNNo' + i).text(tr.UNNo)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnSubRisk' + i + '"]').text(tr.SubRisk)
                        ////Added by Shivali Thakur
                        //if (tr.ClassDivSub == "7") {
                        //    $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnTI' + i + '"]').text(tr.TI)
                        //}
                        //else {
                        //    $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnTI' + i + '"]').text("")
                        //}
                        // $('#spnSubRisk' + i).text(tr.SubRisk)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnPackInst' + i + '"]').text(tr.PackingInst)
                        //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').attr('rowspan', FinalData[i].PackingInst)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="SpnNoOfPkj' + i + '"]').text(tr.NoOfPackg)
                        //$('#SpnNoOfPkj' + i).text(tr.NoOfPackg)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="SpnNetQtyTiPerKg' + i + '"]').text(tr.NetQuantity)
                        // $('#SpnNetQtyTiPerKg' + i).text(tr.NetQuantity)
                        //Added by Shivali Thakur
                        if (tr.ClassDivSub == "7") {
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnRamCat' + i + '"]').text(tr.RAMCategory)
                        }
                        else {
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnRamCat' + i + '"]').text("")
                        }
                        // $('#spnRamCat' + i).text(tr.RAMCategory)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnUnPackingGroup' + i + '"]').text(tr.PackingGroup)
                        // $('#spnUnPackingGroup' + i).text(tr.PackingGroup)
                        if (tr.ImpCode != "") {
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').attr('rowspan', FinalData3[j].AWBCount)
                            for (var a = i + 1; a <= FinalData3[j].AWBCount; a++) {
                                $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + a + '"]').closest('td').remove();
                            }

                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').html(tr.ImpCode.replace(/@/g, '<br/><br/>'));
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').html(tr.ImpCode.replace(/;/g, ' '));
                        }
                        //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').text(tr.ImpCode)
                        // $('#spnImpCode' + i).text(tr.ImpCode)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnErgCode' + i + '"]').text(tr.ERGN)
                        // $('#spnErgCode' + i).text(tr.ERGN)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').text(tr.CaoX)
                        //$('#spnCaox' + i).text(tr.CaoX)
                        if (tr.CaoX != "") {
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').closest('td').attr('rowspan', FinalData3[j].AWBCount)
                            for (var a = i + 1; a <= FinalData3[j].AWBCount; a++) {
                                $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + a + '"]').closest('td').remove();
                            }
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').html(tr.CaoX.replace(/@/g, '<br/><br/>'));
                            //$('#spnULDNbr' + i).html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                        }

                        if (tr.ULDNo != "") {
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + i + '"]').closest('td').attr('rowspan', FinalData3[j].AWBCount)
                            for (var a = i + 1; a <= FinalData3[j].AWBCount; a++) {
                                $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + a + '"]').closest('td').remove();
                            }
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + i + '"]').html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                            //$('#spnULDNbr' + i).html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                        }
                        //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnPosition' + i + '"]').closest('td').remove();


                        // $('#spnPosition' + i).text("")

                    }
                    if (i == 14) {
                        i = 0;
                        div1 = parseInt(div1) + 1;
                    }


                })
                if (i < 13) {
                    $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnShipperName' + (i + 2) + '"]').html("/// END OF NOTOC ///");
                    //$('#spnShipperName' + (i + 2)).text("/// END OF NOTOC ///");
                }
                else {
                    $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnShipperName15"]').html("/// END OF NOTOC ///");
                    //$('#spnShipperName15').text("/// END OF NOTOC ///");
                }


            }


            else {
                $('#btn_SendNtm').css('visibility', 'visible')
                $('#td_sendNtm').show();
                $('#spnAircraftRegistration').text(FinalData2[0].RegistrationNo.toUpperCase())
            }


            if (FinalData1.length > 0) {
                var i = 0;
                var j = 0;
                var div2 = 0;
                var wayBill = FinalData1[0].AWBNo
                // $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id^="spnO_SuppInfo_"]').hide();
                //$('textarea[id="spnO_SuppInfo_' + i + '"]').show();
                $(FinalData1).each(function (row, tr) {
                    if (tr.AWBNo != wayBill) {
                        j = parseInt(j) + 1;
                        wayBill = tr.AWBNo
                    }
                    i = parseInt(i) + 1
                    if (i < 9) {
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_StationOfUnLoading' + i + '"]').text(tr.DestinationCity)
                        // $('#spnO_StationOfUnLoading' + i).text(tr.DestinationCity)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_AWBNo' + i + '"]').text(tr.AWBNo)
                        //$('#spnO_AWBNo' + i).text(tr.AWBNo)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Contents' + i + '"]').text(tr.NatureOfGoods)
                        // $('#spnO_Contents' + i).text(tr.NatureOfGoods)

                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_NoOfPkgs' + i + '"]').text(tr.NoOfPackg)
                        // $('#spnO_NoOfPkgs' + i).text(tr.NoOfPackg)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Quantity' + i + '"]').text(tr.Quantity)
                        // $('#spnO_Quantity' + i).text(tr.Quantity)
                        if (tr.AWBNo != "")
                            $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id="spnO_SuppInfo_' + i + '"]').show();
                        //$('textarea[id="spnO_SuppInfo_' + i + '"]').show();
                        $('#dinMain' + div2 + ' table:eq(1)').find('hidden[id="hdn_SuppInfo_' + i + '"]').val(tr.Man_SNo)
                        // $('#hdn_SuppInfo_' + i).val(tr.Man_SNo)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_SuppInfo_' + i + '"]').text(tr.SupplementaryInfo.toUpperCase())

                        // $('#spnO_SuppInfo_' + i).text(tr.SupplementaryInfo.toUpperCase())


                        //if (tr.ImpCode != "") {
                        //    //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').css('border', '1px solid black')
                        //    // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#spnULDNbr' + i).closest('td')
                        //    for (var a = i + 1; a <= FinalData4[j].AWBCount; a++) {
                        //        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + a + '"]').closest('td').remove();
                        //    }
                        //    // $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').text(tr.ImpCode.replace(/,/g, '<br/><br/>'));
                        //    //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').html(tr.ImpCode.replace(/;/g, ' '));
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').html(tr.ImpCode.replace(/@/g, '<br/><br/>'))
                        //}
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').text(tr.ImpCode.toUpperCase())

                        //if (tr.ImpCode != "")
                        //{
                        //   // $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').closest('td').css('border', '1px solid black')
                        //    // $('#SpnO_UldNbr' + i).closest('td').css('border', '1px solid black')
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#SpnO_UldNbr' + i).closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#spnULDNbr' + i).text(tr.ULDNo)
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').html(tr.ImpCode.replace(/,/g, '<br/><br/>'))
                        //}
                        // $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').text(tr.ImpCode)
                        // $('#spnO_ImpCode' + i).text(tr.ImpCode)

                        //if (tr.ULDNo != "") {
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').closest('td').css('border', '1px solid black')
                        //    // $('#SpnO_UldNbr' + i).closest('td').css('border', '1px solid black')
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#SpnO_UldNbr' + i).closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#spnULDNbr' + i).text(tr.ULDNo)
                        //    for (var a = i + 1; a <= FinalData4[j].AWBCount; a++) {
                        //        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + a + '"]').closest('td').remove();
                        //    }
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').html(tr.ULDNo.replace(/,/g, '<br/><br/>'))
                        //    //$('#SpnO_UldNbr' + i).html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                        //}
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').text(tr.ULDNo.toUpperCase())

                        //$('#SpnO_UldNbr' + i).text(tr.ULDNo)
                        //$('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Position' + i + '"]').closest('td').remove();
                        $('#spnO_Position' + i).text("")
                        // $('#spnO_Contents' + (i + 1)).text("/// END OF NOTOC ///");
                        $('#dinMain' + div2 + ' table:eq(1)').find('input:hidden[id="hdn_SuppInfo_' + i + '"]').val(tr.Man_SNo);
                        if (tr.DRYICEasRefrigerant == 'True') {
                            var a = tr.SupplementaryInfo.replace('DRY ICE AS REFRIGERANT ', '');
                            $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id="spnO_SuppInfo_' + i + '"]').text('DRY ICE AS REFRIGERANT ' + a);
                        }
                        else {
                            var a = tr.SupplementaryInfo.replace('DRY ICE AS REFRIGERANT ', '');
                            $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id="spnO_SuppInfo_' + i + '"]').text(a);
                        }

                    }
                    if (i == 8) {
                        i = 0;
                        div2 = parseInt(div2) + 1;
                    }
                })
                if (i < 7) {
                    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Contents' + (i + 2) + '"]').text("/// END OF NOTOC ///")
                    // $('#spnO_Contents' + (i + 2)).text("/// END OF NOTOC ///");
                }
                else {
                    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Contents9"]').text("/// END OF NOTOC ///")
                    //$('#spnO_Contents7' ).text("/// END OF NOTOC ///");
                }


            }

            //if (IsNILManifested.toLowerCase()=="true")
            //{
            //    $('#spnShipperName1').text("/// NIL ///");
            //    $('#spnShipperName2').text("/// END OF NOTOC ///");
            //    $('#spnO_Contents1').text("/// NIL ///");
            //    $('#spnO_Contents2').text("/// END OF NOTOC ///");
            //}
            if (FinalData.length == 0) {
                $('#spnShipperName1').text("/// NIL ///");
                $('#spnShipperName2').text("/// END OF NOTOC ///");
            }
            if (FinalData1.length == 0) {
                $('#spnO_Contents1').text("/// NIL ///");
                $('#spnO_Contents2').text("/// END OF NOTOC ///");
            }
        }
    });
    if (userContext.SysSetting.ICMSEnvironment == 'JT')
        $('TBody tr[id="trMain"] td:eq(6)').hide();
    else
        $('TBody tr[id="trMain"] td:eq(6)').show();
}

function fn_Cal_GVCBMOnPRE_MAN(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var TotalPPcsIndex = trRow.find("th[data-field='TotalPPcs']").index();
    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCCBMIndex = trRow.find("th[data-field='PCCBM']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PGW = $(input).closest('tr').find('td:eq(' + PGWIndex + ')').text();
    var PVW = $(input).closest('tr').find('td:eq(' + PVWIndex + ')').text();
    var PCCBM = $(input).closest('tr').find('td:eq(' + PCCBMIndex + ')').text();
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            if ($(input).val() != 0) {
                if (($(input).attr('id') == "txtPG") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PGW)) {
                        ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                        $(input).val(parseFloat(PGW).toFixed(1));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PV.val(parseFloat(PVW).toFixed(2));
                        PCBM.val(parseFloat(PCCBM).toFixed(3));
                    }
                    else
                        if ($(input).val() == parseFloat(PGW)) {
                            $(input).val(parseFloat(PGW).toFixed(1));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PV.val(parseFloat(PVW).toFixed(2));
                            PCBM.val(parseFloat(PCCBM).toFixed(3));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPV") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PVW)) {
                        ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                        $(input).val((parseFloat(PVW)).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(1));
                        PCBM.val(parseFloat(PCCBM).toFixed(3));
                    }
                    else
                        if ($(input).val() == parseFloat(PVW)) {
                            $(input).val((parseFloat(PVW)).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(1));
                            PCBM.val(parseFloat(PCCBM).toFixed(3));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPCBM") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PCCBM)) {
                        ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                        $(input).val((parseFloat(PCCBM)).toFixed(3));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(1));
                        PV.val(parseFloat(PVW).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PCCBM)) {
                            $(input).val((parseFloat(PCCBM)).toFixed(3));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(1));
                            PV.val(parseFloat(PVW).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else {

                    PG.val(parseFloat(PGW).toFixed(1));
                    PV.val(parseFloat(PVW).toFixed(2));
                    PCBM.val(parseFloat(PCCBM).toFixed(3));

                    return true;
                }
            }
            else {
                $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                PG.val(parseFloat(PGW).toFixed(1));
                PV.val(parseFloat(PVW).toFixed(2));
                PCBM.val(parseFloat(PCCBM).toFixed(3));
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  PG.val(parseFloat(PGW).toFixed(2));
            // PV.val(parseFloat(PVW).toFixed(2));
            // PCBM.val(parseFloat(PCCBM).toFixed(2));
            // fn_Cal_GVCBMOnPRE_MAN(input);
            flag = false;
            // flag = false;

        }

    }
    return flag;
}

//function fn_TransferFlight() {
//    // fn_OnCancel();
//    $.ajax({
//        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/FlightTransfer/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            $("#divDetailPop").html(result);
//           
//            cfi.PopUp("__divflighttransfer__", "Flight Transfer Details");
//            $("#FlightDate").kendoDatePicker();
//            $("span[id=FlightOrigin]").text(userContext.AirportCode);
//            $("#FlightDate").data("kendoDatePicker").value($("#tdFlightDate").text());
//            cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
//            $('#FlightDate').unbind("change").bind('change', function () { ResetSelectedFlight(); });
//            $('.k-window').closest("div:hidden").remove();
//        },
//        beforeSend: function (jqXHR, settings) {
//        },
//        complete: function (jqXHR, textStatus) {
//        },
//        error: function (xhr) {
//            var a = "";
//        }
//    });
//}

//added function for QRT Shipment popup

function QRTShipment() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/QRTShipmentInfo", type: "get", dataType: "json", cache: false,
        data: { GroupFlightSNo: GroupFlightSNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var table = JSON.parse(result);
            var table = JSON.parse(result);
            var Resultstatus = table.Table1[0].Column1.split('?')[0];
            var Resultvalue = table.Table1[0].Column1.split('?')[1];
            if (Resultstatus == 0) {
                $("#divareaQRTShipment").remove();
                $("div[id$='divDetail']").append(NogDiv);
                cfi.PopUp("divareaQRTShipment", "QRT Shipment", 950, null, null, null);
                cfi.PopUp("divareaQRTShipment", "");
                $(table.Table0).each(function (row, tr) {
                    //FPartnerCarrierCode += "'" + tr + "',";
                    if (tr.ULDSNo > 0) {
                        $("#QRshipmentawb").append('<tr>' + '<input type="hidden" id="hdnAWBSNo" value=' + tr.AWBSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><td class="ui-widget-content"><Label id="Awb">' + tr.AWBNo + '</Label></td><td class="ui-widget-content" colspan = 2><input type="text" style="width:400px;text-transform: uppercase;" name="OSI1_' + row + '" id="OSI1_' + row + '" onblur=""  controltype="alphanumericupper" maxlength="53" value="' + tr.OSI1 + '" ' + 'placeholder="Max length 53 characters" autocomplete="off" data-role="numerictextbox"></td><td class="ui-widget-content" style="display:none;"><input type="text" style="width:400px;text-transform: uppercase;" autocomplete="off" name="OSI2_' + row + '" id="OSI2_' + row + '" onblur="" controltype="alphanumericupper"' + ' maxlength="65"  value="' + tr.OSI2 + '" ' + ' placeholder="" data-role="numerictextbox"></td></tr>')
                    }
                    else {
                        $("#QRshipmentawb").append('<tr>' + '<input type="hidden" id="hdnAWBSNo" value=' + tr.AWBSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><td class="ui-widget-content"><Label id="Awb">' + tr.AWBNo + '</Label></td><td class="ui-widget-content"><input type="text" style="width:400px;text-transform: uppercase;" name="OSI1_' + row + '" id="OSI1_' + row + '" onblur=""  controltype="alphanumericupper" maxlength="65" value="' + tr.OSI1 + '" ' + 'placeholder="Max length 65 characters" autocomplete="off" data-role="numerictextbox"></td><td class="ui-widget-content"><input type="text" style="width:400px;text-transform: uppercase;" autocomplete="off" name="OSI2_' + row + '" id="OSI2_' + row + '" onblur="" controltype="alphanumericupper"' + ' maxlength="65" value="' + tr.OSI2 + '" ' + ' placeholder="Max length 65 characters" data-role="numerictextbox"></td></tr>')
                    }
                    //cfi.AlphabetTextBox("OSI1_" + row + "");
                    //cfi.AlphabetTextBox("OSI2_" + row + "");
                    AllowedSpecialChar("OSI1_" + row + "");
                    AllowedSpecialChar("OSI2_" + row + "");
                });
                $("#QRshipmentawb").append('<td colspan=3><input type="button" class="btn btn-block btn-success btn-sm" name="" id="" ' + 'style="width:90px;float:right;"value="Save" onclick="SaveQRTShipment()"></td>');
                // $('#Awb').text(table.Table0[0].AWBNo + ' ' + table.Table0[0].UldNo + '' + table.Table0[1].AWBNo + ' ' + table.Table0[1].UldNo);
            }
            else {
                ShowMessage('warning', 'Warning - QRT Shipment  ', Resultvalue, "bottom-right");
            }
        }
    });
}

//added function for Saving QRT Shipment
function SaveQRTShipment() {
    var QRTShipmentArray = [];
    $("div[id$='divareaQRTShipment']").find("[id^='QRshipmentawb']").find("tr").each(function () {
        var QRTShipmentViewModel = {
            DailyFlightSNo: $(this).find("[id^='hdnDailyFlightSNo']").val(),
            AWBSNo: $(this).find("[id^='hdnAWBSNo']").val(),
            ULDSNo: $(this).find("[id^='hdnULDSNo']").val(),
            OSI1: $(this).find("[id^='OSI1_']").val(),
            OSI2: $(this).find("[id^='OSI2_']").val(),
        };
        QRTShipmentArray.push(QRTShipmentViewModel);
        //data: JSON.stringify({ GroupFlightSNo: CurrentFlightSno });
    }
    )

    var obj = {
        QRTShipmentobj: QRTShipmentArray,
        GroupFlightSNo: GroupFlightSNo
    }

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/QRTShipmentSave", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != '' || data != '1') {
                ShowMessage('success', 'Success - QRT Shipment ', 'QRT Shipment saved Successfully  ');
                //$("input[name='operation']").prop('type', 'button');
                //navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=INDEXVIEW');
                $("#divareaQRTShipment").data("kendoWindow").close();
            } else {
                ShowMessage('warning', 'Warning - QRT Shipment  ', "Record Not Saved Please Try Again ", "bottom-right");
            }
        }
    });
};


////////////////////////for Move to Lying List from Plan/////////////////////////////
function fn_MoveToLying(input) {
    var chkFlag = false;
    $("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function () {
        if ($(this).prop('checked'))
            chkFlag = true;
    })
    if (chkFlag) {
        var LIArray = new Array();
        $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
            var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
            var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();
            var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
            var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
            var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
            var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
            var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
            var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
            var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
            var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
            var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
            var RemarksIndex = Rowtr.find("th[data-field='Remarks']").index();
            var ULDCountIndex = Rowtr.find("th[data-field='ULDCount']").index();
            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
            var FBLAWBSNoIndex = Rowtr.find("th[data-field='FBLAWBSNo']").index();
            var IsManifestedIndex = Rowtr.find("th[data-field='IsManifested']").index();
            var RowNumIndex = Rowtr.find("th[data-field='RowNum']").index();
            var BlockIndex = Rowtr.find("th[data-field='Block']").index();
            if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
                var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                LIArray.push({
                    isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                    AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                    DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
                    TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                    PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                    ActualVolumeWt: AV,
                    ActualGrossWt: AG,
                    ActualCBM: ACBM,
                    PlannedGrossWt: PG,
                    PlannedVolumeWt: PV,
                    PlannedCBM: PCBM,
                    MovementType: 2,
                    ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                    SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                    Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                    ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                    Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                    UpdatedBy: 2,
                    Remarks: $(tr).find('td:eq(' + (RemarksIndex - 1) + ') input[type=hidden]').val() == "" ? null : $(tr).find('td:eq(' + (RemarksIndex - 1) + ') input[type=hidden]').val(),
                    ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                    ULDCount: $(tr).find('td:eq(' + ULDCountIndex + ') input[type="text"]').val(),
                    FBLAWBSNo: $(tr).find('td:eq(' + FBLAWBSNoIndex + ')').text(),
                    RowNum: $(tr).find('td:eq(' + RowNumIndex + ')').text(),
                    Block: $(tr).find('td:eq(' + BlockIndex + ')').text()
                });
            }
        });

        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/MoveToLyingList", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ LIInfo: LIArray, FlightSNo: $('#hdnFlightSNo').val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultStatus = result.split('?')[0];
                var ResultValue = result.split('?')[1];
                if (ResultStatus == "0") {
                    ShowMessage('success', 'Success -Selected AWB pushed in Lying List successfully', "Processed Successfully", "bottom-right");
                    FlightSearch();
                }
                else if (ResultStatus == "1") {
                    ShowMessage('warning', 'Warning', "AWB '" + ResultValue + "' accepted with Flight '" + $("#tdFlightNo").text() + "'.Cannot be pushed in Lying List", "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Selected AWB can not be pushed in Lying List ', " ", "bottom-right");
                }
            }
        });


    }
    else
        ShowMessage('warning', 'Warning -Select Shipment for Move to Lying List', " ", "bottom-right");

}
function fn_CancelLI(input) {
    var r = jConfirm("Are you sure,you want to Cancel Loading Instruction ?", "", function (r) {
        if (r == true) {
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/CancelLI", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ FlightSNo: $('#hdnFlightSNo').val() }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultStatus = result.split('?')[0];
                    var ResultValue = result.split('?')[1];
                    if (ResultStatus == "0") {
                        ShowMessage('success', 'Success -Loading Instruction has been cancelled', "Processed Successfully", "bottom-right");
                        FlightSearch();
                    }
                    else if (ResultStatus == "1") {
                        ShowMessage('warning', 'Warning', ResultValue, "bottom-right");
                    }
                    else {
                        ShowMessage('warning', 'Warning', "Loading Instruction can not be cancelled", "bottom-right");
                    }
                }
            });
        }
    });
}

var UWSHTML;
function fn_ViewUWSDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetUWSDetails?GroupFlightSno=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var UWSTotalPCS = 0, UWSTotalWeight = 0, UWSTotalNetWeight = 0;
            UWSHTML = '<table id="recordTbl" style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;"><tbody><tr style="background-color:#b3b3b3; font-weight:bold; border:1px solid black;"><td style="width:8%;">Equipment</td><td style="width:5%;">ULD No / BULK</td><td style="width:5%;">Pieces/ULD</td><td style="width:5%;">Gross Wt</td><td style="width:3%;  ">Net Wt</td><td style="width:10%;" >SHC Code</td><td style="width:5%;">Variance</td><td style="width:5%;">Variance(%)</td><td style="width:5%;">ULD Contour Code</td></tr>';
            //<tr id="spDes" style="border:1px solid black;"> <td colspan="7" style="padding: 7px; font-size: 12px; font-weight: bold; text-align: center">[ Destination :  <span id="spnDes">DEL - NEW DELHI</span> ]</td></tr>';
            $(FinalData).each(function (row, tr) {
                UWSTotalPCS = UWSTotalPCS + parseInt(tr.Pieces);
                UWSTotalWeight = UWSTotalWeight + parseFloat(tr.GrossWt);
                UWSTotalNetWeight = UWSTotalNetWeight + parseFloat(tr.NetWeight);
                UWSHTML = UWSHTML + '<tr style="border:1px solid black;"><td style="width:8%;">' + tr.EquipmentNumber + '</td><td style="width:5%;">' + tr.ULDNo + '</td><td style="width:3%;">' + tr.Pieces + '</td><td style="width:3%;">' + tr.GrossWt + '</td><td style="width:3%;">' + tr.NetWeight + '</td><td style="width:3%;" >' + tr.SHC + '</td><td style="width:3%;" >' + (parseFloat(tr.VarianceWeight).toFixed(2) == "-0.00" ? "0.00" : parseFloat(tr.VarianceWeight).toFixed(2)) + '</td><td style="width:3%;" >' + (parseFloat(tr.Variance).toFixed(2) == "-0.00" ? "0.00" : parseFloat(tr.Variance).toFixed(2)) + '</td> <td style="width:15%;" >' + tr.ULDContourCode + '</td></tr>';
            });
            UWSHTML = UWSHTML + '<tr style="background-color: #cccccc; border: 1px solid black;"><td style="padding: 5%; padding: 7px; font-weight: bold;" colspan="2" >Total</td><td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTpcs">' + UWSTotalPCS + '</span></td><td style="width:5%; padding:7px;  font-weight:bold;"><span id="spnTGwt">' + UWSTotalWeight.toFixed(2) + '</span></td><td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTNwt">' + UWSTotalNetWeight.toFixed(2) + '</span></td><td style="width:5%; padding:7px;" >&nbsp;</td><td style="width:5%; padding:7px;">&nbsp;</td><td style="width:15%; padding:7px;">&nbsp;</td><td style="width:15%; padding:7px;">&nbsp;</td></tr></tbody></table>';
            $('#divFltDetails').html('');
            $('#divFltDetails').html(UWSHTML);
            $("#recordTbl").before('<div id="divWindow" style="overflow:auto; float:right;"><input type="button" class="button" id="btnUwsPrint" value="Print UWS" style="visibility:hidden" onclick="PrintUWS();"><input type="button" class="button" id="Excel" value="Download Excel" onclick="DownloadExcel();"><br/></div>');
            if (FinalData.length > 0)
                $('#btnUwsPrint').css('visibility', 'visible');
            else
                $('#btnUwsPrint').css('visibility', 'hidden');

            cfi.PopUp("divFltDetails", "UWS Details", 1300, null, null, 100);
        }
    });
}

function DownloadExcel() {
    var data_type = 'data:application/vnd.ms-excel';
    //var postfix = $("lblWarehouseName").text();
    var a = document.createElement('a');
    a.href = data_type + ', ' + encodeURIComponent('<table style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;" ><tbody><tr><td>' + UWSHTML + '</td></tr></tbody></table>');
    a.download = 'UWSDetails.xls';
    a.click();
}
function PrintUWS() {
    $.ajax({
        url: "HtmlFiles/Export/ManifestUWSPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $('#divFltDetails').html('');
            $('#divFltDetails').css('width', '100%');
            $('#divFltDetails').html(result);

            getUWSData();

            cfi.PopUp("divFltDetails", "UWS Details", 1300, null, null, 100);
            $('#Save_Print').click(function () {
                $('#divhead').printArea();

            })

        }
    })
}
function getUWSData() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetUWSDetails?GroupFlightSno=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;

            if (FinalData1.length > 0) {
                $("span#spnDateTime").text(FinalData1[0].FlightDateTime);
                $("span#spnAirline").text(FinalData1[0].AirlineName);
                $("span#spnFlight").text(FinalData1[0].FlightNo);
                $("span#spnFlightSNo").text(FinalData1[0].DailyFlightSNo);
                $("span#spnLBD").text(FinalData1[0].LBDSNo);

                $("span#spnSector").text(FinalData1[0].Sector);
                if (FinalData[0].LBDSNo == 1)
                    $("#UWSMessage").css("display", "none");
                else
                    $("#UWSMessage").css("display", "block");

                // $("span#spnExp").text("<a href='#' onClick='showOverhangData(\"" + FinalData[0].DailyFlightSNo + "\"); return false;'><b>UWS Message</b></a>");
                // $("#UWSMessage").text("<a href='#' onClick='showOverhangData(\"" + FinalData[0].DailyFlightSNo + "\"); return false;'><b>UWS Message</b></a>");
                $("span#spnDes").text(FinalData1[0].Destination);
                $("span#spnACFT").text(FinalData1[0].RegNo);
                $("span#spnAgent").text(FinalData1[0].AirlineName);
                $("span#spnEmpData").text(FinalData1[0].UserName);
                $("span#spnType").text(FinalData1[0].AircraftType);
                $("#SI1").text(FinalData1[0].OtherInfo1);
                $("#SI2").text(FinalData1[0].OtherInfo2);
            }

            if (FinalData.length > 0) {
                var UWSTotalPCS = 0, UWSTotalWeight = 0, UWSTotalNetWeight = 0;

                for (var i = 0; i < FinalData.length; i++) {
                    UWSTotalPCS = UWSTotalPCS + parseInt(FinalData[i].Pieces);
                    UWSTotalWeight = UWSTotalWeight + parseFloat(FinalData[i].GrossWt);
                    UWSTotalNetWeight = UWSTotalNetWeight + parseFloat(FinalData[i].NetWeight);
                    $('#trlast').before("<tr id='trInside' style='border:1px solid black;'><td style='width:12%; padding:7px;'>" + FinalData[i].EquipmentNumber + "</td><td style='width:14%; padding:7px;'>" + FinalData[i].ULDNo + "</td><td style='width:7%; padding:7px; text-align:center;'>" + FinalData[i].Pieces + "</td><td style='width:12%; padding:7px; text-align:center;' >" + FinalData[i].GrossWt + "</td><td style='width:12%; padding:7px; text-align:center;'>" + FinalData[i].NetWeight + "</td><td style='width:12%; padding:7px; text-align:center;'>" + FinalData[i].SHC + "</td><td style='width:12%; padding:7px; text-align:center;'>" + (parseFloat(FinalData[i].VarianceWeight).toFixed(2) == "-0.00" ? "0.00" : parseFloat(FinalData[i].VarianceWeight).toFixed(2)) + "</td><td style='width:12%; padding:7px; text-align:center;'>" + (parseFloat(FinalData[i].Variance).toFixed(2) == "-0.00" ? "0.00" : parseFloat(FinalData[i].Variance).toFixed(2)) + "</td><td style='width:12%; padding:7px; text-align:center;'>" + FinalData[i].ULDContourCode + "</td></tr>")
                    //SNo = SNo + FinalData[i].SNo + ',';
                    //Tpcs = parseFloat(Tpcs) + parseFloat(FinalData[i].Pieces);
                    //Tgwt = parseFloat(Tgwt) + parseFloat(FinalData[i].GrossWt.split(' ')[0]);
                    //Tnwt = parseFloat(Tnwt) + parseFloat(FinalData[i].NetWeight);
                }
                //$('#recordTbl tbody tr:last').after(
                //                       '<tr style="background-color: #cccccc; border: 1px solid black;">'+
                //                            '<td style="padding: 5%; padding: 7px; font-weight: bold;" colspan="2">Total</td>'+
                //                            '<td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTpcs"></span></td>'+
                //                            '<td style="width:5%; padding:7px;  font-weight:bold;"><span id="spnTGwt"></span></td>'+
                //                            '<td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTNwt"></span></td>' +
                //                            '<td style="width:5%; padding:7px; font-weight:bold;text-align:center" colspan="3"></span></td>'+

                //                        '</tr>')
                $('#spnTpcs').text(UWSTotalPCS)
                $('#spnTGwt').text(UWSTotalWeight.toFixed(2))
                $('#spnTNwt').text(UWSTotalNetWeight.toFixed(2))

                // SNo = SNo.slice(0, SNo.length - 1);
                //$('#hdnSNoList').val(SNo);
                //$("span#spnTpcs").text(Tpcs);
                //$("span#spnTGwt").text(Tgwt.toFixed(2));
                //$("span#spnTNwt").text(Tnwt.toFixed(2));
                //$("span#spnMainTGwt").text(Tgwt.toFixed(3));
                //$("span#spnMainTNwt").text(Tnwt.toFixed(3));


                //$(FinalData).each(function (row, tr) {
                //    //$('#spDes').after('<tr style="background-color:#b3b3b3; font-weight:bold; border:1px solid black;">'+
                //    //                        '<td>Equipment</td>'+
                //    //                        '<td>ULD No/BULK</td>'+
                //    //                        '<td>Pieces/ULD</td>'+
                //    //                        '<td>Gross Wt</td>'+
                //    //                        '<td>Net Wt</td>'+
                //    //                        '<td>SHC Code</td>'+
                //    //                        '<td>Variance</td>'+
                //    //                        '<td>ULD Contour Code</td>'+
                //    //                        '</tr>')
                //});
            }
        }
    });

}
function printManifestUws(div) {

    //var div1 = '';
    //    div1 = ('<div></div>')
    ////$('#div1').html('')
    //$('#div1').html($('#'+div).html())
    //$('#' + div).printArea();
    //$('#div').printArea();
}

///////////////////////////////////////////////////////////////////////////////////

//function fnGetCBV() {
//    $.ajax({
//        url: "HtmlFiles/Export/CBVPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            //  alert('Test')
//            $("#divDetail").html(result);
//            fn_GetCBVData();
//            $('#FirstTab').text('CBV Shipment Details');
//            $('#SecondTab').hide();
//            $('#OSCTab').hide();
//            $('#divAction').hide();
//            $("#btnPrint").unbind("click").bind("click", function () {
//                $("#divDetailPrint #divDetail").printArea();
//            });

//        },
//        beforeSend: function (jqXHR, settings) {
//        },
//        complete: function (jqXHR, textStatus) {
//        },
//        error: function (xhr) {
//            // var a = "";
//        }
//    });

//}

function fn_GetCBVData() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetCBVPrintRecord?DFGroupSNo=" + GroupFlightSNo,
        contentType: "application/json; charset=utf-8",
        //data: JSON.stringify({ AWBSNo: AWBSNo }),
        async: false,
        type: 'GET',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;
            if (FinalData.length > 0) {
                $('#spnOwner').text(FinalData[0].AirlineName)
                $('#spnRes').text(FinalData[0].RegistrationNo)
                $('#spnFlifgtNo').text(FinalData[0].FlightNo)
                $('#spnFlightDate').text(FinalData[0].FlightDate)
                $('#spnPointOfLoading').text(FinalData[0].OriginCity)
                $('#spnPointOfUnloading').text(FinalData[0].DestinationCity)
            }
            if (FinalData1.length > 0) {
                $(FinalData1).each(function (row, tr) {
                    $('#trData').after("<tr align='center' >" +
                        "<td colspan='2' class='grdTableRow'>" + tr.AWBNo + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + tr.Pieces + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + tr.NatureOfGoods + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + tr.GrossWeight + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + tr.ULDNo + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + tr.OriginDestin + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + tr.code + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + '' + "</td>" +
                        "<td colspan='1' class='grdTableRow'>" + '' + "</td>" +
                        "</tr>")
                })

            }
        }
    });
}

function fn_GetCMainData() {
    var str = '';
    var LogedInAirport = userContext.AirportCode;
    $('#maintbl').html(str);
    $.ajax({
        //url: "Services/SpaceControl/FreightBookingListService.svc/GetCartManifestPrint?DailyFlightSNo=206004&Type=N",
        url: "Services/FlightControl/FlightControlService.svc/GetCartManifestPrint?DailyFlightSNo=" + GroupFlightSNo + "&LogedInAirport=" + LogedInAirport + "&IsCart=1",
        contentType: "application/json; charset=utf-8",
        //data: JSON.stringify({ AWBSNo: AWBSNo }),
        async: false,
        type: 'GET',
        //dataType: "html",
        cache: false,

        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;
            FinalData2 = ResultData.Table2;

            if (FinalData.length > 0) {
                //$("#spnFlightDate").kendoDatePicker({
                //    min: FinalData[0].FlightDate,
                //    format: "dd-MMM-yyyy"
                //});

                // $.format.date($('#spnFlightDate').text(FinalData[0].FlightDate), "dd-MMM-yyyy");
                $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData[0]["AirlineLogo"]);
                $('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/GaurdaCMS Logo.jpg";');
                $('#spnNationality').text(FinalData[0].RegistrationNo)
                $('#spnFlightDate').text(FinalData[0].FlightDate);
                $("#tdFlightNumber").text(FinalData[0].FlightNo)
                $("#b_Airline").text(FinalData[0].airlinename)
                $('#spnPointOfLoading').text(FinalData[0].FlightOrigin)
                $('#spnPointOfUnloading').text(FinalData[0].FlightDestination)
            }
            if (FinalData1.length > 0) {
                $('#spnUpdatedOn').text(FinalData1[0].UpdatedOn)
                str += " <tr>"
                str += " <td style='text-align:center' class='grdTableHeader'>AWB_NUMBER</td>"
                str += "<td style='text-align:center' class='grdTableHeader'>PKGS</td>"
                str += "<td style='text-align:center' class='grdTableHeader'>NATURE OF GOODS</td>"
                str += "<td style='text-align:left' colspan='6' class='grdTableHeader'><b> For use by owner operator only </b></td>"
                str += "</tr>"
                str += "<tr rowspan='2' style='text-align:center'>"
                str += " <td colspan='3' ></td>"
                str += "<td class='grdTableHeader'>SPHC</td>"
                str += "<td class='grdTableHeader'>GROSS WEIGHT</td>"
                str += "<td class='grdTableHeader'>ORI / DES</td>"
                str += " <td class='grdTableHeader'>PRIORITY</td>"
                str += "<td class='grdTableHeader'>REMARKS</td>"
                str += "<td class='grdTableHeader'>CONNECTING FLIGHT</td>"
                str += "</tr>"
                //for (var i = 0; i < FinalData1.length; i++) {

                //     str += "<tr> <td>" + FinalData1[i]["AWBNo"] + "</td>"
                //     str += " <td>" + FinalData1[i]["TotalPieces"] + "</td>"
                //     str += " <td>" + FinalData1[i]["NatureOfGoods"] + "</td>"
                //     str +=" <td>"+FinalData1[i]["SPHC"]+"</td>"
                //     str +=" <td>"+FinalData1[i]["ULDNo"]+"</td>"
                //     str += " <td>" + FinalData1[i]["GrossWeight"] + "</td>"
                //     str += " <td>" + FinalData1[i]["DestinationCity"] + "</td></tr>"
                //     //FinalData1[i].remove();
                //     FinalData1.splice(i, 1);

                //}
                //--------------------------
                //var uniqueULD = [];
                //var newindex = 0;
                //if (FinalData1.length > 0) {
                //    uniqueULD[newindex] = FinalData1[0].ULDNo;
                //    //for (i = 0; i < FinalData1.length; i++) {
                //        for (j = 0; j < FinalData1.length; j++) {
                //            for (k = 0; k < uniqueULD.length; k++) {
                //                if (FinalData1[j].ULDNo != uniqueULD[k]) {
                //                    newindex++;
                //                    uniqueULD[newindex] = FinalData1[j].ULDNo
                //                }
                //            }
                //        }
                //    //}
                //}
                //  -------------------------------

                var newindex = 0;
                var unique = [];
                var uniqueULD = [];
                //uniqueULD = FinalData1[0].ULDNo;
                for (jj = 0; jj < FinalData1.length; jj++) {
                    unique[newindex] = FinalData1[jj].ULDNo;
                    newindex++;
                }
                for (var i = 0; i < unique.length; i++) {

                    if ((jQuery.inArray(unique[i], uniqueULD)) == -1) {
                        uniqueULD.push(unique[i]);
                    }
                }


                for (var i = 0; i < uniqueULD.length; i++) {

                    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                        str += " <tr align='left' class='grdTableRow'><td colspan=9><b>" + uniqueULD[i] + "</b><b style='margin: 200px;'><input id='Radio1' type='radio' name='Offload' value='Offload'/>Offload</b></td></tr>"
                    }
                    else {
                        str += " <tr align='left' class='grdTableRow'><td colspan=9><b>" + uniqueULD[i] + "</b><b style='margin: 200px;'></b></td></tr>"
                    }
                    // str += " <td colspan=6><input id='Radio1' type='radio' name='Offload' value='Offload'/>Offload</td>   </tr>";
                    var TotalPcs = 0;
                    var TotalGwt = 0;
                    for (var j = 0; j < FinalData1.length; j++) {
                        if (uniqueULD[i] == FinalData1[j].ULDNo) {
                            str += "<tr align='center' class='grdTableRow' > <td>" + FinalData1[j]["AWBNo"] + "</td>"
                            if (FinalData1[j]["PlannedPieces"] == FinalData1[j]["TotalPieces"]) {
                                str += " <td>" + FinalData1[j]["TotalPieces"] + "</td>"
                            }
                            else {
                                str += " <td>" + FinalData1[j]["PlannedPieces"] + "/" + FinalData1[j]["TotalPieces"] + "</td>"
                            }
                            str += " <td>" + FinalData1[j]["NatureOfGoods"] + "</td>"
                            str += " <td>" + FinalData1[j]["SPHC"] + "</td>"

                            str += " <td>" + FinalData1[j]["PlannedGrossWeight"] + "</td>"
                            // str += " <td>" + FinalData1[j]["OriginCity"] + "/" + FinalData1[j]["DestinationCity"] + "</td>"
                            str += " <td>" + FinalData1[j]["AWBSectorAirport"] + "</td>"
                            str += " <td>" + FinalData1[j]["Priority"] + "</td>"
                            str += " <td></td>"//Remarks value is not comming for now
                            str += " <td>" + FinalData1[j]["ConnectingFlight"] + "</td></tr>"
                            TotalPcs = parseInt(FinalData1[j]["PlannedPieces"]) + parseInt(TotalPcs);
                            TotalGwt = parseFloat(FinalData1[j]["PlannedGrossWeight"]) + parseFloat(TotalGwt);
                        }
                    }
                    str += " <tr  align='center' class='grdTableRow' >"
                    str += " <td ><b>TOTAL</b></td>"
                    str += "<td ><b>" + TotalPcs + "</b></td>"
                    str += "<td ></td><td ></td>"
                    str += " <td><b>" + TotalGwt.toFixed(2) + "</b></td>"
                    str += " <td></td>"
                    str += " <td></td>"
                    str += " <td></td>"
                    str += " <td></td>"
                    str += "</tr>"

                }
                str += " <tr  align='center' class='grdTableRow' >"
                str += " <td ><b>TOTAL ALL SHIPMENT </b></td>"
                str += "<td ><b>" + FinalData2[0]["TotalPlannedPieces"] + "</b></td>"
                str += "<td ></td><td ></td>"
                str += " <td><b>" + FinalData2[0]["TotalPlannedGrossWeight"] + "</b></td>"
                str += " <td></td>"
                str += " <td></td>"
                str += " <td></td>"
                str += " <td></td>"

                str += "</tr>"
                str += " <tr  align='center' class='grdTableRow' >"
                str += " <td ><b>LMC REMARKS :</b></td>"
                str += "<td colspan='8' ></td>"
                //str += "<td ></td><td ></td><td ></td>"
                //str += " <td></td>"
                //str += " <td></td>"
                //str += " <td></td>"

                str += "</tr>"
                //str += "<tr align='right'><td colspan='7'><input id='btnPrint' type='button' value='Print' class='no-print'></td></tr>"
                //$('#maintbl').html(str);
                //for (var i = 0; i < FinalData1.length; i++) {
                //    var id = '';
                //    var arr = [];
                //    // var newdata = [];
                //    // var newindex = 0;
                //    var TotalPcs = 0;
                //    var TotalGwt = 0;
                //    var ULDNo1 = FinalData1[i]["ULDNo"];
                //    str += " <tr align='left' class='grdTableRow'><td colspan=7><b>" + FinalData1[i]["ULDNo"] + "</b></td></tr>"
                //    for (var j = 0; j < FinalData1.length; j++) {
                //        var ULDNo2 = FinalData1[j]["ULDNo"];
                //        if (ULDNo1 == ULDNo2) {
                //            id = j + ',' + id;
                //            //newdata[newindex] = ULDNo2;
                //            //newindex++;
                //            str += "<tr align='center' class='grdTableRow' > <td>" + FinalData1[j]["AWBNo"] + "</td>"
                //            if (FinalData1[j]["PlannedPieces"] == FinalData1[j]["TotalPieces"]) {
                //                str += " <td>" + FinalData1[j]["TotalPieces"] + "</td>"
                //            }
                //            else {
                //                str += " <td>" + FinalData1[j]["PlannedPieces"] + "/" + FinalData1[j]["TotalPieces"] + "</td>"
                //            }
                //            str += " <td>" + FinalData1[j]["NatureOfGoods"] + "</td>"
                //            str += " <td>" + FinalData1[j]["SPHC"] + "</td>"
                //            str += " <td>" + FinalData1[j]["Priority"] + "</td>"
                //            str += " <td>" + FinalData1[j]["PlannedGrossWeight"] + "</td>"
                //            str += " <td>" + FinalData1[j]["DestinationCity"] + "</td></tr>"
                //            TotalPcs = parseInt(FinalData1[j]["PlannedPieces"]) + parseInt(TotalPcs);
                //            TotalGwt = parseInt(FinalData1[j]["PlannedGrossWeight"]) + parseInt(TotalGwt);

                //        }
                //    }
                //    str += " <tr  align='center' class='grdTableRow' >"
                //    str += " <td ><b>TOTAL</b></td>"
                //    str += "<td ><b>" + TotalPcs + "</b></td>"
                //    str += "<td ></td><td ></td><td ></td>"
                //    str += " <td><b>" + TotalGwt + "</b></td>"
                //    str += " <td></td>"
                //    str += "</tr>"
                //    //// str += "<tr  align='center' class='grdTableRow' ><td colspan=6><br/></td></tr>"
                //    //var data = FinalData1;
                //    arr = id.split(',');
                //    for (var k = 0; k < arr.length - 1; k++) {
                //        var index = arr[k];
                //        var data = FinalData1;
                //        data.splice(parseInt(index), 1);
                //        // data.splice(data.indexOf(ULDNo2), 1);
                //        FinalData1 = data;
                //    }
                //    i = 0;

                //}
                //str += " <tr  align='center' class='grdTableRow' >"
                //str += " <td ><b>TOTAL ALL SHIPMENT </b></td>"
                //str += "<td ><b>" + FinalData2[0]["TotalPlannedPieces"] + "</b></td>"
                //str += "<td ></td><td ></td><td ></td>"
                //str += " <td><b>" + FinalData2[0]["TotalPlannedGrossWeight"] + "</b></td>"
                //str += " <td></td>"
                //str += "</tr>"
                //$('#maintbl').html(str);
                //            $(FinalData1).each(function (row, tr) {
                //                $('#trData').after("<tr align='center' >" +
                //    "<td colspan='1' class='grdTableRow'>" + tr.AWBNo + "</td>" +
                //    "<td colspan='1' class='grdTableRow'>" + tr.TotalPieces + "</td>" +
                //    "<td colspan='1' class='grdTableRow'>" + tr.NatureOfGoods + "</td>" +
                //     "<td colspan='1' class='grdTableRow'>" + tr.SPHC + "</td>" +
                //    "<td colspan='1' class='grdTableRow'>" + tr.ULDNo + "</td>" +
                //    "<td colspan='1' class='grdTableRow'>" + tr.GrossWeight + "</td>" +

                //    "<td colspan='1' class='grdTableRow'>" + tr.DestinationCity + "</td>" +

                //"</tr>")
                //            })

            }
            else {
                str += " <tr  align='center' class='grdTableHeader' >"
                str += "<td style='text-align:center' class='grdTableHeader'>AWB_NUMBER</td>"
                str += "<td style='text-align:center' class='grdTableHeader'>PKGS</td>"
                str += "<td style='text-align:center' class='grdTableHeader'>NATURE OF GOODS</td>"
                str += "<td style='text-align:left' colspan='6' class='grdTableHeader'><b> For use by owner operator only </b></td>"
                str += "</tr>"
                str += "<tr rowspan='2'>"
                str += " <td colspan='3' ></td>"
                str += "<td class='grdTableHeader'>SPHC</td>"
                str += " <td class='grdTableHeader'>PRIORITY</td>"
                str += "<td class='grdTableHeader'>GROSS WEIGHT</td>"
                str += "<td class='grdTableHeader'>DESTINATION</td>"
                str += "<td class='grdTableHeader'>REMARKS</td>"
                str += "<td class='grdTableHeader'>CONNECTING FLIGHT</td>"
                str += "</tr>"
                str += "<tr> <td colspan=9 rowspan=4 align='center'><br/><b>NIL MANIFEST</b></td>"
                //$('#maintbl').html(str);
            }
            //str += "<tr align='left'><td colspan='9'><input id='btnPrint' type='button' value='Print' class='no-print'></td></tr>"
            $('#maintbl').html(str);
        }
    });
}

////////for ULD Remarks
var TDForRFSRemarks;
function fn_GetSetULDAWBRemarks(ProcessType, ProcessSNo, input) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/PreManifestRFSRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            TDForRFSRemarks = $(input).closest('td');
            $("#divDetailPop").html(result);
            $('#PreManifestRemarks').val($(input).closest('td').find('input[type=hidden]').val())
            cfi.PopUp("__divpremanifestrfsremarks__", "Remarks");
            $('.k-window').closest("div:hidden").remove();
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


function SavePreManifestRemarks(e) {
    $(TDForRFSRemarks).find('input[type=hidden]').val($('#PreManifestRemarks').val());
    $("#__divpremanifestrfsremarks__").data("kendoWindow").close();

}
///////////////for send EDI Message Manual


///////////////for send EDI Message/////////////////
function GetFlightMSGGrid() {
    $("#tdATDTime,#tdATDDate,#tdManRemarks,#tdregnNo,#tdregnNoTxt,#btnUWS,#btn_Print").hide();
    $('#SecondTab,#OSCTab,#StackDetailTab,#FlightStopOverDetailTab').hide();
    $('#FirstTab').text('EDI Message');
    $("#divAction button").hide();
    // $('#btnEDIMsgSend').show();
    $("#tabstrip").kendoTabStrip();
    ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/EDIMSG/" + CurrentFlightSno + "/" + FlightCloseFlag + "/" + subprocesssno);
}

function fun_SendEDIMessage() {
    var EDIMSGArray = new Array();
    $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var IsFWBIndex = Rowtr.find("th[data-field='IsFWB']").index();
        var IsFHLIndex = Rowtr.find("th[data-field='IsFHL']").index();
        var IsDEPIndex = Rowtr.find("th[data-field='IsDEP']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();

        var SHCCodeIndex = Rowtr.find("th[data-field='SHCCode']").index();

        $(tr).find('td').each(function (t, i) {
            if (t > SHCCodeIndex) {
                if ($(i).find('input[type="checkbox"][disabled!="disabled"]').prop('checked')) {
                    EDIMSGArray.push({
                        AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                        DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
                        MessageType: $(i).find('input[type="checkbox"]').val(),
                        IsSend: $(i).find('input[type="checkbox"]').prop('checked')
                    });
                }
            }
        })


        //if ($(tr).find('td:eq(' + IsFWBIndex + ') input[type=checkbox]').prop('checked') || $(tr).find('td:eq(' + IsFHLIndex + ') input[type=checkbox]').prop('checked') || $(tr).find('td:eq(' + IsDEPIndex + ') input[type=checkbox]').prop('checked') || $('#chkIsFFM').prop('checked')) {
        //    EDIMSGArray.push({
        //        AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
        //        DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
        //        IsFWB: $(tr).find('td:eq(' + IsFWBIndex + ') input[type=checkbox]').prop('checked'),
        //        IsFHL: $(tr).find('td:eq(' + IsFHLIndex + ') input[type=checkbox]').prop('checked'),
        //        IsDEP: $(tr).find('td:eq(' + IsDEPIndex + ') input[type=checkbox]').prop('checked')
        //    });
        //}
    });
    if ($('#chkIsFFM[disabled!="disabled"]').prop('checked')) {
        EDIMSGArray.push({
            AWBSNo: 0,
            DailyFlightSNo: $('#hdnFlightSNo').val(),
            MessageType: $('#chkIsFFM').val(),
            IsSend: $('#chkIsFFM').prop('checked')
        });
    }
    if (EDIMSGArray.length > 0) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/SaveFlightEDIMessageInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ EDIMessageInfo: EDIMSGArray, FlightSNo: $('#hdnFlightSNo').val(), IsFFM: $('#chkIsFFM').prop('checked') }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success -EDI Message sent successfully', "Processed Successfully", "bottom-right");
                    FlightSearch();
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - EDI Message could not be send', " ", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - EDI Message could not be send', " ", "bottom-right");
                flag = false;
            }
        });
    }
    //alert(JSON.stringify(EDIMSGArray));
}



function onMSGSuccess(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFWBIndex = MSGGridHeader.find("th[data-field='IsFWB']").index();
    var IsFHLIndex = MSGGridHeader.find("th[data-field='IsFHL']").index();
    var IsDEPIndex = MSGGridHeader.find("th[data-field='IsDEP']").index();
    var IsFFMIndex = MSGGridHeader.find("th[data-field='IsFFM']").index();
    $("#divDetail  div.k-grid-header:first  div  table  thead  tr th:nth-child(" + (IsFWBIndex + 1) + ")").html("<input type='checkbox' id='chkAllFWBBox' onchange='return CheckAllFWB(this);' >FWB");
    $("#divDetail  div.k-grid-header:first  div  table  thead  tr th:nth-child(" + (IsFHLIndex + 1) + ")").html("<input type='checkbox' id='chkAllFHLBox' onchange='return CheckAllFHL(this);' >FHL");
    $("#divDetail  div.k-grid-header:first  div  table  thead  tr th:nth-child(" + (IsDEPIndex + 1) + ")").html("<input type='checkbox' id='chkAllDEPBox' onchange='return CheckAllDEP(this);' > DEP");
    if ($("#divDetail div.k-grid-content table  tbody  tr:first td:nth-child(" + (IsFFMIndex + 1) + ")").text() == 'true') {
        $('#chkIsFFM').prop('checked', 1).prop('disabled', 1);
    }
    else {
        $('#chkIsFFM').prop('checked', 0).prop('disabled', 0);
    }

    if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
        $('#chkAllFWBBox').prop('checked', 1);
    }
    if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
        $('#chkAllFHLBox').prop('checked', 1);
    }

    if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
        $('#chkAllDEPBox').prop('checked', 1);
    }
}

function fn_CheckEDIMsg(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFWBIndex = MSGGridHeader.find("th[data-field='IsFWB']").index();
    var IsFHLIndex = MSGGridHeader.find("th[data-field='IsFHL']").index();
    var IsDEPIndex = MSGGridHeader.find("th[data-field='IsDEP']").index();
    var IsFFMIndex = MSGGridHeader.find("th[data-field='IsFFM']").index();
    if ($(e).attr('id').toLowerCase() == 'chkisfwb') {
        if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
            $('#chkAllFWBBox').prop('checked', 1);
        }
        else
            $('#chkAllFWBBox').prop('checked', 0);

    }
    if ($(e).attr('id').toLowerCase() == 'chkisfhl') {
        if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
            $('#chkAllFHLBox').prop('checked', 1);
        }
        else
            $('#chkAllFHLBox').prop('checked', 0);

    }
    if ($(e).attr('id').toLowerCase() == 'chkisdep') {
        if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
            $('#chkAllDEPBox').prop('checked', 1);
        }
        else
            $('#chkAllDEPBox').prop('checked', 0);
    }
}

function CheckAllFWB(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFWBIndex = MSGGridHeader.find("th[data-field='IsFWB']").index();
    $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ") input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));
}
function CheckAllFHL(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFHLIndex = MSGGridHeader.find("th[data-field='IsFHL']").index();
    $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ") input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));
}
function CheckAllDEP(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsDEPIndex = MSGGridHeader.find("th[data-field='IsDEP']").index();
    $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ") input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));
}
//added by ankit kumar


function fn_liAWBList(e) {
    var view = '';
    var CountPieces = 0;
    var CountGrossWeight = 0;
    if (AWBListProcess.toUpperCase() == 'PRE' || AWBListProcess.toUpperCase() == 'MAN') {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/AWBList?DailyFlightSNo=" + AWBListFlightSNo + "&Process=" + AWBListProcess,
            async: false,
            type: "GET",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var dataTableobj = JSON.parse(result);

                view = '<tr><td class="formSection" colspan="10" style="text-align:center"><b>AWB List</b></td></tr>'
                    + '<tr><td ><b>Owner or Operator:</b> <td><span id="spanOwner">' + dataTableobj.Table1[0].CarrierCode + '</span></td></td>'
                    + '<td ><b>Flight No.:</b><td><span id="spanFlight">' + dataTableobj.Table1[0].FlightNo + '</span></td></td>'
                    + '<td ><b>Date:</b><td><span id="spanDate">' + dataTableobj.Table1[0].FlightDate + '</span></td></td><tr>'
                    + '<tr><td "><b>Point of Loading:</b><td><span id="spanLoading">' + dataTableobj.Table1[0].OriginAirportCode + '</span></td></td>'
                    + '<td ><b>Point of Unloading:</b><td><span id="spanUnloading">' + dataTableobj.Table1[0].DestinationAirportCode + '</span></td></td>'
                    + '<td ><b>Aircraft No.:</b><td><span id="spanAircraft">' + dataTableobj.Table1[0].AircraftType + '</span></td></td></tr><br>'
                    + '<tr><td class="formtHeaderLabel"colspan="4">LOTO/Transit</td>'
                    + '<td class="formtHeaderLabel" colspan="4">For Use By Owner/Operation</td>'
                    + '<tr><td class="formtHeaderLabel">No.</td>'
                    + '<td class="formtHeaderLabel">Air WayBill and Part No</td>'
                    + '<td class="formtHeaderLabel">No of Picies</td>'
                    + '<td class="formtHeaderLabel">Nature of Goods</td>'
                    + '<td class="formtHeaderLabel">Gross Weight</td>'
                    + '<td class="formtHeaderLabel">ORI/DES</td>'
                    + '<td class="formtHeaderLabel">Remarks</td>'
                    + '<td class="formtHeaderLabel">Offical Use Only</td>'
                    + '</tr>';


                $(dataTableobj.Table0).each(function (i, e) {
                    view += "<tr>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.RNo + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.AWBNo + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.Pieces + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.NatureOfGoods + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.GrossWeight + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.OriginAirportCode + '/' + e.DestinationAirportCode + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\">" + e.Remarks + "</td>";
                    view += "<td class=\"formHeaderTranscolumn\"></td>"

                    view += "<tr>";
                    CountPieces = parseInt(CountPieces) + parseInt(e.Pieces);
                    CountGrossWeight = parseInt(CountGrossWeight) + parseInt(e.GrossWeight);
                })

                view += "<tr><td colspan=2 style='text-align:center'>Total Cargo :</td><td colspan=2>" + CountPieces + "</td><td colspan=4>" + CountGrossWeight + "</td></tr>";

            }


        });

        $("head").after('<div id="divLocationWindow" style="overflow:auto"><table class="WebFormTable">' + view + '</table></div>');
        //Show Popup
        $("#divLocationWindow").dialog(
            {
                autoResize: true,
                maxWidth: 1300,
                maxHeight: 800,
                width: 1000,
                height: 500,
                modal: true,
                title: 'AWB List',
                draggable: true,
                resizable: true,
                buttons: {

                    Cancel: function () {
                        $(this).dialog("close");
                    },
                    Print: function printAWBList() {
                        var divToPrint = document.getElementById('divLocationWindow');
                        var newWin = window.open('', '_blank');
                        newWin.document.open();
                        newWin.document.title = "AWB List";
                        newWin.document.write('<html><head><link type="text/css" rel="stylesheet" href="Styles/Application.css" /><title>' + "AWB List" + '</title></head><body ><div><input id="btnPrint" type="button" value="Print" class="no-print" onclick="window.print();"/></div><br\>' + divToPrint.innerHTML + '</body></html>');
                        newWin.document.close();
                        newWin.focus();
                        $("#tblprint").show();
                        $("#btnPrint").show();
                    }
                },
                close: function () {
                    $(this).dialog("close");
                }


            });
    }
}



//=========end=====================



function showLIVersion(LiVersion) {

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/getLIVersion",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: $('#hdnFlightSNo').val(), LiVersion: LiVersion
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData1 = jQuery.parseJSON(result)
            var GroupSNo = "*";
            var theDiv = document.getElementById("divLiVersionPop");
            $('#divLiVersionPop').find("table[id='tblLiversion']").remove();
            var table = "<table class='appendGrid ui-widget' id='tblLiversion'><thead class='ui-widget-header' style='text-align:center'>";
            table += "<tr><td colspan='6' class='ui-widget-header'>Flight No : <span id='spnFlightNo'>" + myData1.Table0[0].FlightNo + "</span></td><td colspan='6' class='ui-widget-header'>Flight Date  : <span id='spnFlightDate'>" + myData1.Table0[0].FlightDate + "</span></td></tr>";
            table += "<tr><td class='ui-widget-header'>AWB</td><td class='ui-widget-header'>Nature of Goods</td><td class='ui-widget-header'>No.Of Pcs</td><td class='ui-widget-header'>Gross Wt</td><td class='ui-widget-header'>Ori/Dest</td><td class='ui-widget-header'>Remarks</td><td class='ui-widget-header'>ULD Type/BULK</td><td class='ui-widget-header'>ULD Count</td>";
            //table += "<td class='ui-widget-header'>Assign Team/Personnel</td><td class='ui-widget-header'>Time(Hrs)</td>";
            //table += "<td class='ui-widget-header'>Action</td>";
            //table += "</tr></thead><tbody class='ui-widget-content'>";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    for (var i = 0; i < myData.Table0.length; i++) {
                        var tempType = (myData.Table0[i].ULDNoOrType == 'Select') ? '' : myData.Table0[i].ULDNoOrType;
                        if (GroupSNo != myData.Table0[i].ULDGroupNo && GroupSNo != "*")
                            table += "<tr><td style='height: 15px;'  colspan='12'></td></tr>";
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].NatureOfGoods + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Pieces + "</td><td class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].OriginAirportCode + "/" + myData.Table0[i].DestinationAirportCode + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Remarks + "</td><td class='ui-widget-content first'>" + tempType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDCount + "</td>";
                        //if (GroupSNo != myData.Table0[i].ULDGroupNo) {
                        //    table += "<td class='ui-widget-content first'><input name='AssignTeam" + myData.Table0[i].ULDGroupNo + "' id='AssignTeam" + myData.Table0[i].ULDGroupNo + "' type='hidden' value=''/>" + myData.Table0[i].ULDGroupNo + "</td><td class='ui-widget-content first'><input name='Time" + myData.Table0[i].ULDGroupNo + "' id='Time" + myData.Table0[i].ULDGroupNo + "' type='hidden' value=''/>"+ myData.Table0[i].ULDGroupNo + "</td><input name='HdnDailyFlightSNo" + myData.Table0[i].ULDGroupNo + "' id='HdnDailyFlightSNo" + myData.Table0[i].ULDGroupNo + "' type='hidden' value='" + myData.Table0[i].DailyFlightSNo + "'/></tr>";
                        //    //timeauto += "" + myData.Table0[i].ULDGroupNo + ",";
                        //    //employeSno += "" + myData.Table0[i].AssignTeam + "*";
                        //    //employeTxt += "" + myData.Table0[i].AssignTeamTxt + "*";
                        //    //timetxt += "" + myData.Table0[i].Time + "*";

                        //    //document.getElementById("hdnFlightNo").value = myData.Table0[i].FlightNo;
                        //    //document.getElementById("hdnFlightDate").value = myData.Table0[i].FlightDate;

                        //    //$("#hdnFlightNo").val(myData.Table0[i].FlightNo);
                        //    //$("#hdnFlightDate").val(myData.Table0[i].FlightDate);

                        //}
                        //else
                        //    table += "<td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td></tr>";
                        GroupSNo = myData.Table0[i].ULDGroupNo;
                    }
                    table += "</tbody></table>";
                    $("#divLiVersionPop").append(table);

                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}


//////////////////////////////////////////////////
//function fn_RemarksClick(input) {
//    $(input).css("height","40px");
//}
//function fn_onBlurRemarks(input) {
//    $(input).removeAttr("style").css("width","130px");
//}
//fn_CalPRE_Man_GVCBM
/*******************for PoMAil DN Details ******************/
function fn_GetPOMAilDNDetails(input, TotalPcs, ULDStockSNo, MCBookingSNo, ProcessStage) {
    $(input).closest('tr').find('td[data-column="IsChanged"]').text(false);
    if ($(input).val() != TotalPcs && MCBookingSNo > 0) {
        ClickThis = input;
        $(input).closest('tr').find('td[data-column="IsChanged"]').text(true);
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/POMailDNInfo", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ GroupFlightSNo: GroupFlightSNo, ULDStockSNo: ULDStockSNo, MCBookingSNo: MCBookingSNo, Stage: ProcessStage }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var table = JSON.parse(result);
                $("#divPOMailDetails").remove();
                $("div[id$='divDetail']").append(POMailDetailsDiv);
                cfi.PopUp("divPOMailDetails", "PO Mail Details", 950, null, null, null);
                $('div[class="k-window-actions k-header"]').hide();

                $('#lblCN38No').text($(input).closest('tr').find('td[data-column="AWBNo"]').text());
                $('#lblPlanPcs').text($(input).val());
                //$('#lblTotalPcs').text(TotalPcs);
                // cfi.PopUp("divPOMailDetails", "");
                $(table.Table0).each(function (row, tr) {
                    $("#bodyPOMailDetails").append('<tr>' + '<input type="hidden" id="hdnMCBookingSNo" value=' + tr.MCBookingSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDStockSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><input type="hidden" id="hdnDNSNo" value=' + tr.DNSNo + '><td class="ui-widget-content"><input type="checkbox" id="chkDNNo" checked=1  ></td><td class="ui-widget-content"><Label id="DNNo">' + tr.DNNo + '</Label></td><td class="ui-widget-content"><Label id="OriginCity">' + tr.OriginCity + '</Label></td><td class="ui-widget-content"><Label id="DestinationCity">' + tr.DestinationCity + '</Label></td><td class="ui-widget-content"><Label id="MailCategory">' + tr.MailCategory + '</Label></td><td class="ui-widget-content"><Label id="SubCategory">' + tr.SubCategory + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleNumber">' + tr.ReceptacleNumber + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleWeight">' + tr.ReceptacleWeight + '</Label></td></tr>')

                });
                $("#bodyPOMailDetails").append('<td colspan="8"><input type="button" class="btn btn-block btn-success btn-sm" name="" id="saveDNDetails" style="width:90px;float:right;"value="Save" onclick="SavePoMailDNDetails(' + MCBookingSNo + ',' + ULDStockSNo + ',' + $(input).val() + ')"><input type="button" class="btn btn-block btn-danger btn-sm" name="" id="btnDNSCancel" style="width:90px;float:right;"value="Cancel" onclick=fn_CancelDNDetails(this,"' + ProcessStage + '")></td>');


                $("#bodyPOMailDetails tr").each(function (r, t) {
                    $(POMailDetailsArray).each(function (row, n) {
                        if ($(t).find("[id^='hdnDNSNo']").val() == n.DNSNo)
                            $(t).find('input[type=checkbox]').prop('checked', n.isSelect);
                    });
                });
            }
        });
    }
}
var ClickThis;
function fn_CancelDNDetails(input, ProcessStage) {
    $(ClickThis).closest('tr').find('td[data-column="IsChanged"]').text(false);
    if (ProcessStage == 'OFLD') {
        $(ClickThis).closest('tr').find('td[data-column="PlannedPieces"] input[type="text"]').val($(ClickThis).closest('tr').find('td[data-column="OLCPieces"]').text());
        fn_CalculateOLCGVCBM(ClickThis);
    }
    else {
        $(ClickThis).closest('tr').find('td[data-column="PlannedPieces"] input[type="text"]').val($(ClickThis).closest('tr').find('td[data-column="TotalPPcs"]').text());
        fn_CalPRE_Man_GVCBM(ClickThis);
    }


    // cfi.ClosePopUp("divPOMailDetails");
    $("#divPOMailDetails").data("kendoWindow").close();
}

//function fn_ValidateSelectedDN(input,PlanPcs)
//{
//    $('#divDetail #div__0 tbody tr').each(function (r, t) {
//        if ($(t).find('td[data-column="MCBookingSNo"]').text()>0 )
//        {


//        }
//    });

//    if ($("#bodyPOMailDetails tr td input:checked").length != PlanPcs) {
//        ShowMessage('warning', 'Warning - POMail Details  ', "Selected DN should be equal to Plan Piece!", "bottom-right");
//    }


/******offloaded Cart ULD *************************************************/
function fn_OffloadUld(obj) {
    LoadPopUPStatus = true;
    $('#divOffloadedULD').html('');
    $("#divOffloadedULDButton").next('div').remove();


    ShowOffloadedShipment();
    $('#btnSaveOffload').show();
    ///   cfi.PopUp("divOffloadedULDButton", "Off-Loaded ULDs/Carts", 80, null, PopUpOnClose);

    cfi.PopUp("divOffloadedULDButton", "Off-Loaded ULDs/Carts", 500, null, PopUpOnClose, 100);


};

function PopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    $("#divPopUpBackground").hide();
    LoadPopUPStatus = false;
    return false;
}
function ShowOffloadedShipment() {
    var divUldShipmentSection = {
        processName: _CURR_PRO_,
        moduleName: 'BuildupULD',
        appName: 'SEARCHBUILDUPOFFLOADEDULD',
        DailyFlightSNo: CurrentFlightSno
    }

    cfi.ShowIndexViewV2("divOffloadedULD", "Services/Flightcontrol/FlightControlService.svc/GetFCULDGridData", divUldShipmentSection);


}

function SaveOffloadedUld() {
    var vgriduld = cfi.GetCFGrid("divOffloadedULD");
    if (vgriduld != undefined) {
        var detaildatasource = vgriduld.dataSource;
        var offULD1 = [];

        var detaildata = detaildatasource.data();
        $.each(detaildata, function (i, item) {
            if (item) {
                var chkid = "chkSelect_" + item.ULDStockSNo;
                if ($("input[type='checkbox'][id='" + chkid + "']").is(':checked')) {
                    var UldModel = {
                        UldStockSno: parseInt(item.ULDStockSNo),
                        DailyFlightSNo: CurrentFlightSno

                    }
                    offULD1.push(UldModel);
                }

            }
        });
        $("#imgprocessing").show();

        if (offULD1.length > 0) {
            $.ajax({
                url: "Services/Flightcontrol/FlightControlService.svc/SaveLIOffloadedULD", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({
                    ProcessedULDInfo: offULD1
                }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "") {
                        $("#divOffloadedULDButton").data("kendoWindow").close();
                        //cfi.ClosePopUp("divOffloadedULDButton");
                        if ($("#black_overlay").length > 0)
                            $("#black_overlay").remove();

                        //    BuildupSearch();
                        ShowMessage('success', 'Success - Flight Control', "Flight  Processed Successfully", "bottom-right");
                        //ResetSearchByFlight();
                        FlightSearch();
                    }
                    else
                        ShowMessage('warning', 'Warning - Flight Control', "Flight " + result, "bottom-right");
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Flight Control', "Flight -  unable to process.", "bottom-right");

                }
            });
        } else {
            ShowMessage('warning', 'Warning - Flight Control', "Kindly select at least one ULD to SAVE.", "bottom-right");

            $('#cfMessage-container').css('right', '40%');
        }
    }


}
/*********************************end***********************************************/


//}


function detailCollapse(e) {
    var expanededUldStockSno = e.data.ULDStockSNo;
    e.sender.options.parentValue = expanededUldStockSno;
    e.sender.options.storedparentValue = expanededUldStockSno;
    if (e.data.Shipments == 0) {
        CheckCollepsRow = 1;
    } else {
        CheckCollepsRow = 0;
    }
}

function detailExpand(e) {
    var expanededUldStockSno = e.data.ULDStockSNo;
    e.sender.options.parentValue = expanededUldStockSno;
    e.sender.options.storedparentValue = expanededUldStockSno;

    if (e.data.Shipments == 0) {
        CheckCollepsRow = 1;
    } else {
        CheckCollepsRow = 0;
    }
}
function removeValue(Arr, key, value) {
    for (var i = Arr.length - 1; i >= 0; i--) {
        if (Arr[i][key] == value) {
            Arr.splice(i, 1)
        }
    }
}

var POMailDetailsArray = [];
function SavePoMailDNDetails(MCBookingSNo, ULDStockSNo, PlanPcs) {
    removeValue(POMailDetailsArray, 'MCBookingSNo', MCBookingSNo);
    if ($("#bodyPOMailDetails tr td input:checked").length != PlanPcs) {
        ShowMessage('warning', 'Warning - POMail Details  ', "Selected DN should be equal to Plan Piece!", "bottom-right");
    }
    else {
        $("div[id$='divPOMailDetails']").find("[id^='bodyPOMailDetails']").find("tr").each(function () {
            POMailDetailsArray.push({
                isSelect: $(this).find("[id^='chkDNNo']").prop('checked') == true ? 1 : 0,
                GroupFlightSNo: GroupFlightSNo,
                DailyFlightSNo: CurrentFlightSno, //$(this).find("[id^='hdnDailyFlightSNo']").val(),
                MCBookingSNo: $(this).find("[id^='hdnMCBookingSNo']").val(),
                ULDStockSNo: $(this).find("[id^='hdnULDSNo']").val(),
                DNSNo: $(this).find("[id^='hdnDNSNo']").val()
            });
        }

        );
        $("#divPOMailDetails").data("kendoWindow").close();
    }


    // alert(JSON.stringify(POMailDetailsArray))
    /*
    //alert(JSON.stringify(POMailDetailsArray))
   
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/savePOMailDNDetails", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({
            POMailDNDetails: POMailDetailsArray,
            GroupFlightSNo: GroupFlightSNo

        }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result = '0') {
                ShowMessage('success', 'Success -POMail Details ', 'POMail Details saved Successfully  ');
                $("#divPOMailDetails").data("kendoWindow").close();
            } else {
                ShowMessage('warning', 'Warning - POMail Details  ', "Record Not Saved Please Try Again ", "bottom-right");
            }

        }
    });
    */

};
/*******************END ******************/

var msgHtml = '<div id="divFlightTransfer"><table class="WebFormTable" id="tblFlightTransfer"><tbody><tr><td class="formtwoInputcolumn" colspan="3" >Do you want to Offload/Transfer all shipments from <span id="spntdFlightNo"></span></td></tr><tr><td><input type="button" class="btn btn-info btn-sm" name="btnTransfer" id="btnTransfer" style="width:180px;" value="Transfer + Create NIL Manifest" onclick="fn_TransferFlight();"></td><td ><input type="button" class="btn btn-info btn-sm" name="CreateNILManifest" id="CreateNILManifest" style="width:180px;" value="Offload + Create NIL Manifest" onclick="fn_CreateAndvalidateNIL();"></td><td ><input type="button" class="btn btn-block btn-danger btn-sm" name="btnPopCancel" id="btnPopCancel" style="width:75px;" value="Cancel" onclick="fn_OnCancel();" ></td></tr></tbody></table></div>';


//
//adding for QRT SHIPMENT POPUP

var NogDiv = '<div id="divareaQRTShipment" style="display:none;display: block;" cfi-aria-trans="trans"> <table class="WebFormTable"><thead><tr><td class="ui-widget-header">AWB/ULD</td><td class="ui-widget-header">OSI 1</td><td class="ui-widget-header">OSI 2</td></tr></thead><tbody id ="QRshipmentawb"></tbody></table></div>'
//adding for VAL SHIPMENT POPUP

var fotter = '<div class="footertoolbar page-footertoolbar modify_top hidden-xs visible-stb" id="divAction">' +
    '<div class="row">' +
    '   <div class="">' +
    '      <table style="margin-left: 20px;">' +
    '         <tr>' +
    '       <td style="display:none;"><button class="btn btn-block btn-success btn-sm" style="width: 110px;" id="btnFlightClose" onclick="fun_FlightClose();">Flight Close</button></td>' +
    '           <td>&nbsp; &nbsp;</td>' +
    '       <td><button class="btn btn-block btn-success btn-sm"  style="width: 110px;display:none;" id="btnEDIMsgSend" onclick="fun_SendEDIMessage();">Send Message</button></td>' +
    '           <td>&nbsp; &nbsp;</td>' +
    '           <td><button class="btn btn-block btn-success btn-sm" id="btnSave">Save</button></td>' +
    '          <td>&nbsp; &nbsp;</td>' +
    '         <td><button class="btn btn-block btn-success btn-sm" id="btnSaveAndClose" style="display: none;">Save & Depart</button></td> ' +
    // '        <td>&nbsp; &nbsp;</td>' +
    //  '       <td><button class="btn btn-info btn-sm" style="width: 110px;" id="btnLyingList">Lying List</button></td>' +
    '      <td>&nbsp; &nbsp;</td>' +
    '     <td><button class="btn btn-block btn-success btn-sm" id="btnFinalizedPreMan" onclick="fun_FinalizedPreMan();">Create Pre Manifest</button></td>' +
    '      <td>&nbsp; &nbsp;</td>' +
    '     <td><button class="btn btn-block btn-danger btn-sm" id="btnCancel">Cancel</button></td>' +

    '        <td>&nbsp; &nbsp;</td>' +

    ' </tr>' +
    ' </table>' +
    '                </div>' +
    '           </div>' +
    '      </div>';

//adding for POMail Details

var POMailDetailsDiv = '<div id="divPOMailDetails" style="display:none;display: block; overflow: auto;max-height: 300px;" cfi-aria-trans="trans"> <table class="WebFormTable"><tbody><tr><td>CN38 No : <b><label id="lblCN38No"></label></b></td><td>Plan Piece : <b><label id="lblPlanPcs"></label></b></td></tr><tr><td colspan="3"></td></tr></tbody></table><table class="WebFormTable"><thead><tr><td class="ui-widget-header">Select</td><td class="ui-widget-header">DN Number</td><td class="ui-widget-header">Origin City</td><td class="ui-widget-header">Destination City</td><td class="ui-widget-header">Mail Category</td><td class="ui-widget-header">Sub Category</td><td class="ui-widget-header">Receptacle Number</td><td class="ui-widget-header">Receptacle Weight</td></tr></thead><tbody id ="bodyPOMailDetails"></tbody></table></div>';

var divContent = '<div ><input type="hidden" id="hdnProcessType" value="1"><input type="hidden" id="hdnSubProcessType" value="1"><div id="content">' +
    '<div class="rows"> <table style="width: 100%"><tr><td valign="top" class="td100Padding"><div id="divFlightDetails" style="width: 100%"></div></td></tr><tr>' +
    '<td valign="top"><div id="divFltDetails" style="width: 100%"></div></td></tr><tr><td valign="top"><table style="width: 100%"><tr><td style="width: 20%;display:none;"' +
    'valign="top" class="tdInnerPadding"><table class="TTFtable" style="width: 100%; margin: 0px; padding: 0px; display: none;" id="tblFlightAWBInfo"><tr>' +
    '<td class="formSection" colspan="3" style="color: maroon; font-size: 11px; font-weight: bold; border-bottom: #cccccc 1px solid;">Flight Information</td></tr><tr>' +
    '<td>Flight No<input type="hidden" id="hdnFlightSNo" /></td><td>:</td><td id="tdFlightNo"></td></tr><tr><td>Flight Date</td><td>:</td><td id="tdFlightDate"></td>' +
    '</tr><tr><td>Boarding Point</td><td>:</td><td id="tdBoardingPoint"></td></tr><tr><td>End Point</td><td>:</td><td id="tdEndPoint"></td></tr><tr><td>Flight Route</td>' +
    '<td>:</td><td id="tdFlightRoute"></td></tr><tr><td>Booked Gross</td><td>:</td><td id="tdBookedGross"></td></tr><tr><td>Booked Volume</td><td>:</td>' +
    '<td id="tdBookedVolume"></td></tr><tr><td>Booked CBM</td><td>:</td><td id="tdBookedCBM"></td></tr><tr><td>Available Gross</td><td>:</td><td id="tdAvailableGross"></td>' +
    '</tr><tr><td>Available Volume</td><td>:</td><td id="tdAvailableVolume"></td></tr><tr><td>Available CBM</td><td>:</td><td id="tdAvailableCBM"></td></tr><tr>' +
    '<td>Aircraft Type</td><td>:</td><td id="tdAircraftType"></td></tr><!--<tr><td>A/C Regn No</td><td>:</td><td id="tdACRegnNo"></td></tr>--><tr><td>Flight Status</td>' +
    '<td>:</td><td id="tdFlightStatus"></td></tr> </table><!--<table class="TTFtable" style="width: 100%; margin: 0px; padding: 0px; display:none; " id="tblAWBButtonInfo">' +
    '<tr><td class="formSection" colspan="3" style="color: maroon; font-size: 11px; font-weight: bold; border-bottom: #cccccc 1px solid;">Flight Action Information</td>' +
    '</tr><tr><td colspan="2"><br /></td></tr><tr><td><button class="btn btn-info btn-sm" style="width:110px;" id="btnLyingList">Lying List</button></td><td>' +
    '<button class="btn btn-info btn-sm" style="width: 110px;" id="btnViewManifest">View Manifest</button></td><!--<td><button class="btn btn-info btn-sm"' +
    'style="width: 110px;" id="btnOffLoadedCargo">Off-Loaded Cargo</button></td></tr><!--<tr><td colspan="2"><br /></td></tr><tr><td><button ' +
    'class="btn btn-info btn-sm" style="width: 110px;" id="btnBuildupDetails">Build up Details</button></td><td><button class="btn btn-info btn-sm"' +
    'style="width: 110px;" id="btnCreateManifest">Create Manifest</button></td></tr><tr><td colspan="2"><br /></td></tr><tr><td><button class="btn btn-info btn-sm"' +
    'style="width: 110px;" id="btnViewManifest">View Manifest</button></td><td><button class="btn btn-info btn-sm" style="width: 110px;" ' +
    'id="btnCloseFlightFFM">Close Flight/FFM</button></td></tr><tr><td colspan="2"><br /></td></tr></table>--></td><td style="width: 80%;" valign="top"' +
    'class="tdInnerPadding"><div id="dv_FlightManifestPrint" style="display:none"><div class="mfs_rel_wrapper make_relative append_bottom5 clearfix">' +
    '<div class="modify_search noneAll"><div class="modify_top col-md-12 col-sm-12 hidden-xs visible-stb ng-scope"><div class="row"><div class="col-xs-12 col-sm-12">' +
    '<!-- city and country --><a class="col-xs-12 col-sm-12 has_fade" style="padding-left: 2px; padding-right: 2px;"><table id="tblSearch"><tr><td>' +
    '<input type="radio" name="R" id="rbNormal" value="All" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"N") />All &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td><td><input type="radio" name="R" id="rbBulk" value="BULK" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"B") />BULK &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td><td><input type="radio" name="R" id="rbULD" value="ULD" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"U") />ULD &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td><td><input type="radio" name="R" id="rbHSC" value="HSC" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"S") />SHC &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td>' +

    // Changes By Vipin Kumar
    //'<td>&nbsp;</td></tr></table></a></div></div></div></div></div></div><div id="divDetailPrint"><div id="divContentDetail"> <div id="tabstrip"> <ul id="ulTab" style="display:none;"> <li class="k-state-active" id="FirstTab">Loading Instruction Details</li><li id="SecondTab">Lying List</li><li id="OSCTab">Other Station Cargo</li><li id="StackDetailTab" onclick="GetFlightULDSTACKDetails();" >Stack Details</li><li id="FlightStopOverDetailTab" onclick="GetStopOverFlightULDDetails();" >Stop Over Cargo</li><div style="float:right;margin-top:-5px;"><table><tr><td id="tdFlightType" style="display:none;"><input type="radio" data-radioval="Pax" class="" name="Pax" checked="Checked" id="Pax" value="0">PAX <input type="radio" data-radioval="Freighter" class="" name="Pax" id="Pax" value="1">FREIGHTER</td><td id="tdEDIMSG"  ><button style="display:none;" class="btn btn-info btn-sm" id="btnEDIMSG" onclick="GetFlightMSGGrid(this);">Send EDI Message</button></td><td id="tdUWS"><button class="btn btn-info btn-sm" id="btnUWS" onclick="fn_ViewUWSDetails(this);">UWS</button></td><td id="tdCancelLI" style="display:none;"><button class="btn btn-info btn-sm" id="btnCancelLI" onclick="fn_CancelLI(this);">Cancel LI</button></td><td id="tdMoveToLying"><button class="btn btn-info btn-sm" id="btnMoveToLying" onclick="fn_MoveToLying(this);">Move To Lying List</button></td><td id="tdbtnliversion"><button class="btn btn-info btn-sm" id="btnliversion" onclick="fn_liVersion(this);">View LI Version</button></td><td id="tdNILManifest"><button class="btn btn-info btn-sm" id="btnNILManifest" onclick="fn_ValidateNILManifest(this);">Transfer/Create NIL Manifest</button></td><td id="tdManRemarks"><Label id="lblManRemarks">ATD Date/Time</Label></td><td id="tdATDDate"><input type="text" class="k-input k-state-default" name="txtATDDate" id="txtATDDate"  controltype="datetype" placeholder="ATD Date"></td><td id="tdATDTime"><input type="text" class="k-input k-state-default" name="txtATDTime" id="txtATDTime"  placeholder="ATD Time"></td><td id="tdManifestRemarks"><a id="btnManifestRemarks" onclick="fn_AddManifestRemarks()" href="#" >Remarks</a> </td><td id="tdregnNo" ><span id="spnRegistrationNo"> Aircraft Regn No.</span></td><td id="tdregnNoTxt"><input type="text" class="k-input" name="RegistrationNo" id="RegistrationNo" style="width: 80px;  text-transform: uppercase;" controltype="alphanumericupper" tabindex="8" maxlength="10" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td><td><button class="btn btn-info btn-sm" id="btn_Print" onclick="fun_PrintByProcess();">Print</button></td><td><button class="btn btn-info btn-sm" id="btnCBV" onclick="fnGetCBV(this);">CBV</button></td><td id="td_sendNtm"><button class="btn btn-info btn-sm" id="btn_SendNtm"  onclick="fun_SendNTM();">Send NTM</button></td><td id="tdIsExcludeFromFFM" style="display:none;" ><input type="checkbox" id="IsExcludeFromFFM"> Exclude Stop Over from FFM</td></tr></table> </div></ul> <div> <div id="divDetail"></div></div><div><div id="divLyingSearch"></div> <div id="divLyingDetail"> </div></div><div><div id="divOSCSearch"></div><div id="divOSCDetail"> </div></div> <div><div id="divStackDetail"></div></div><div><div id="divStopOverDetail"></div></div></div></div> </div> <div id="divDetailPop"></div> <div id="divManifestRemarksPop"></div></div>' +
    '<td>&nbsp;</td></tr></table></a></div></div></div></div></div></div><div id="divDetailPrint"><div id="divContentDetail"> <div id="tabstrip"> <ul id="ulTab" style="display:none;"> <li class="k-state-active" id="FirstTab">Loading Instruction Details</li><li id="SecondTab">Lying List</li><li id="OSCTab">Other Station Cargo</li><li id="StackDetailTab" onclick="GetFlightULDSTACKDetails();" >Stack Details</li><li id="FlightStopOverDetailTab" onclick="GetStopOverFlightULDDetails();" >Stop Over Cargo</li><div style="float:right;margin-top:-5px;"><table><tr><td id="tdFlightType" style="display:none;"><input type="radio" data-radioval="Pax" class="" name="Pax" checked="Checked" id="Pax" value="0">PAX <input type="radio" data-radioval="Freighter" class="" name="Pax" id="Pax" value="1">FREIGHTER</td><td id="tdEDIMSG"  ><button style="display:none;" class="btn btn-info btn-sm" id="btnEDIMSG" onclick="GetFlightMSGGrid(this);">Send EDI Message</button></td><td id="tdUWS"><button class="btn btn-info btn-sm" id="btnUWS" onclick="fn_ViewUWSDetails(this);">UWS</button></td><td id="tdQRTShipment" style="display:none;"><button class="btn btn-info btn-sm" id="btnQRTShipment" onclick="QRTShipment();">QRT Shipment</button></td><td id="tdCancelLI" style="display:none;"><button class="btn btn-info btn-sm" id="btnCancelLI" onclick="fn_CancelLI(this);">Cancel LI</button></td><td id="tdMoveToLying"><button class="btn btn-info btn-sm" id="btnMoveToLying" onclick="fn_MoveToLying(this);">Move To Lying List</button></td><td id="tdExpectedLoad"><input type="button" class="btn btn-info btn-sm" name="btnExpectedLoad" id="btnExpectedLoad" style="width:160px;display:none;" value="Expected Load" onclick="fn_GetExpectedLoadDetails();"></td><td id="tdbtnliversion"><input type="button" class="btn btn-block btn-success btn-sm" name="OffLoadedULD" id="OffLoadedULD" style="width:160px;display:none;" value="Off-Loaded ULDs/Carts" onclick="fn_OffloadUld(this)"></td><td id="tdbtnliversion"><button class="btn btn-info btn-sm" id="btnliAWBList" onclick="fn_liAWBList(this);">AWB List</button></td><td id="tdbtnliversion"><button class="btn btn-info btn-sm" id="btnliversion" onclick="fn_liVersion(this);">View LI Version</button></td><td id="tdbtnliRemarks"><button class="btn btn-info btn-sm" id="btnliRemarks" onclick="fn_liRemarks();">Remarks</button></td><td id="tdNILManifest" style="display:none"><button class="btn btn-info btn-sm" id="btnNILManifest" onclick="fn_ValidateNILManifest(this);">Transfer/Create NIL Manifest</button></td><td id="tdManRemarks"><Label id="lblManRemarks">ATD Date/Time</Label></td><td id="tdATDDate"><input type="text" class="k-input k-state-default" name="txtATDDate" id="txtATDDate"  controltype="datetype" placeholder="ATD Date"></td><td id="tdATDTime"><input type="text" class="k-input k-state-default" name="txtATDTime" id="txtATDTime"  placeholder="ATD Time" maxlength=5></td><td id="tdManifestRemarks"><a id="btnManifestRemarks" onclick="fn_AddManifestRemarks()" href="#" >Delay Remarks</a> </td><td id="tdregnNo" ><span id="spnRegistrationNo"> Aircraft Regn No.</span></td><td id="tdregnNoTxt">' +
    '<input type="hidden" name="RegistrationNo" id="RegistrationNo" value="" /><input type="text" class="" name="Text_RegistrationNo"  id="Text_RegistrationNo"  tabindex=1002  controltype="autocomplete"   maxlength="10" data-width="40px"  value="" placeholder="Registration No" />' +
    //<input type="text" class="k-input" name="RegistrationNo" id="RegistrationNo" style="width: 80px;  text-transform: uppercase;" controltype="alphanumericupper" tabindex="8" maxlength="10" value="" placeholder="" data-role="alphabettextbox" autocomplete="off">
    '</td><td id="tdbtnliSendMail" style="display:none;"><button class="btn btn-info btn-sm" id="btnliSendMail" onclick="fn_SendMailPopup(this);">Send Mail</button></td><td id="tdUpdateRegistrationNo" style="display:none;"><button class="btn btn-info btn-sm" id="btnUpdateRegistrationNo" onclick="UpdateAircraftRegistrationNo();" >Update</button></td><td><button class="btn btn-info btn-sm" id="btn_Print" onclick="fun_PrintByProcess();">Print</button></td><td><button class="btn btn-info btn-sm" id="btnCBV" onclick="fnGetCBV(this);">CBV</button></td><td id="td_sendNtm"><button class="btn btn-info btn-sm" id="btn_SendNtm"  onclick="fun_SendNTM();">Send NTM</button></td><td id="tdIsExcludeFromFFM" style="display:none;" ><input type="checkbox" id="IsExcludeFromFFM"> Exclude Stop Over from FFM</td></tr></table> </div></ul> <div> <div id="divDetail"></div></div><div><div id="divLyingSearch"></div> <div id="divLyingDetail"> </div></div><div><div id="divOSCSearch"></div><div id="divOSCDetail"> </div></div> <div><div id="divStackDetail"></div></div><div><div id="divStopOverDetail"></div></div></div></div> </div> <div id="divDetailPop"></div> <div id="divManifestRemarksPop"></div></div>' +
    //Ends
    '<div id="divLyingListDetail"></div></td></tr></table></td></tr></table></div></div></div>' +
    '<div id="divOffloadedULDButton"><button class="btn btn-block btn-success btn-sm"  id="btnSaveOffload" style="display:none" onclick="SaveOffloadedUld();">Save</button></br><div id="divOffloadedULD"></div></div>';


//<td id="tdTransferFlight"><button class="btn btn-info btn-sm" id="btnTransferFlight" onclick="fn_TransferFlight(this);">Flight Transfer</button></td>
//<td id="tdOSI"><button class="btn btn-info btn-sm" id="btn_OSI" onclick="fn_AddOSI(this);">OSI</button></td>

//<td><button class="btn btn-info btn-sm" id="btn_OSI" onclick="fn_AddOSI(this);">OSI</button></td>


// Changes By Vipin Kumar 
function fn_liRemarks() {
    $("#divLiVersionPop").remove();
    $('body').append($("<div />", {
        id: 'divLiVersionPop'
    }));

    var str = "<table width='100%' cellspacing='0px'>"
        + "<tr><td style='text-align: center;width: 30%'><strong>Remarks</strong></td>"
        + "<td style='width:70%'><textarea style='width: 200px; rows='2' cols='20' id='txtLIRemarks' name='Remarks' maxlength='200'></textarea></td></tr>"
        + "<tr><td colspan='2'style='text-align: center'><input type='button' id='btnSaveRemarks' name='btnSaveRemarks' value='Save' class='btn btn-info btn-sm' style='width: 80px;'></td></tr></table>";
    $("#divLiVersionPop").append(str);
    Remarks = '';

    cfi.PopUp("divLiVersionPop", "Remarks", 500);
    $.ajax({
        url: "../Services/FlightControl/FlightControlService.svc/getLIRemarks",
        async: false,
        type: "POST",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ DailyFlightSNo: CurrentFlightSno, GroupFlightSNo: GroupFlightSNo, RemarkType: parseInt(RemarkType) }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result != "[]") {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                Remarks = MsgData[0]["Remarks"].trim();
                $("#txtLIRemarks").val(MsgData[0]["Remarks"].trim());
            }
        },
        error: function (error) {
        }
    });

    $('#txtLIRemarks').keypress(function (e) {
        var allowedChars = new RegExp("^[ A-Za-z0-9_@.]*$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^ A-Za-z0-9_@.]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });
}

$(document).on('click', '#btnSaveRemarks', function () {
    var NewRemarks = $('#txtLIRemarks').val().trim();
    if (Remarks == NewRemarks) {
        $("#divLiVersionPop").data("kendoWindow").close();
        return;
    }
    if (NewRemarks.length > 0) {
        $.ajax({
            url: "../Services/FlightControl/FlightControlService.svc/SaveLIRemarks",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ DailyFlightSNo: parseInt(CurrentFlightSno), GroupFlightSNo: GroupFlightSNo, RemarkType: parseInt(RemarkType), Remarks: NewRemarks }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result != null && result != "") {
                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData[0].MessageNumber == '1') {
                        ShowMessage('success', 'Success - LI Remarks', MsgData[0].Message, "bottom-right");
                        $("#divLiVersionPop").data("kendoWindow").close();
                    }
                    else {
                        ShowMessage('warning', 'Warning - LI Remarks', MsgData[0].Message, "bottom-right");
                    }
                }
            },
            error: function (error) {
            }
        });
    }
    else {
        $("#divLiVersionPop").data("kendoWindow").close();
    }
});

window.onbeforeunload = function () {
    cfi.SaveUpdateLockedProcess(0, GroupFlightSNo, "", "", userContext.UserSNo, subprocesssno, subprocess, "", "");
}



function UpdateAircraftRegistrationNo() {
    if ($("#RegistrationNo").val() != '') {
        $.ajax({
            url: "../Services/FlightControl/FlightControlService.svc/UpdateAircraftRegistrationNo",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ GroupFlightSNo: GroupFlightSNo, RegistrationNo: $("#RegistrationNo").val() }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var ResultStatus = result.split('?')[0];
                var ResultValue = result.split('?')[1];
                if (ResultStatus == "0") {
                    ShowMessage('success', 'Success -Aircraft Registration No', "Aircraft Registration No updated Successfully", "bottom-right");
                    FlightSearch();
                }
                else {
                    ShowMessage('warning', 'Warning -Aircraft Registration No', "Aircraft Registration number cannot be updated", "bottom-right");
                }
            },
        });
    }
    else {
        ShowMessage('warning', 'Warning -Aircraft Registration No', "Aircraft Registration number cannot be empty", "bottom-right");
    }
}


function GetNOTOCSPGoodsRecord(Sno) {

    $.ajax
        ({
            type: "get",
            url: "/Services/FlightControl/FlightControlService.svc/GetNotocRecord?Sno=" + Sno,
            datatype: JSON,
            success: function (data) {
                var result = $.parseJSON(data);



                //Begin SP Goods Data
                var SpGoodsTable = result.Table1;

                $("#tblSpGoods tbody tr").remove();

                if (SpGoodsTable.length > 0) {
                    for (i = 0; i < SpGoodsTable.length; i++) {
                        var SpGoodsRow = '';

                        var ImpCodeArray = [];
                        ImpCodeArray = SpGoodsTable[i].ImpCode.split(",");
                        var SPULDArray = [];
                        SPULDArray = SpGoodsTable[i].ULDNo.split(",");

                        SpGoodsRow += '<tr>';
                        SpGoodsRow += '<td>' + SpGoodsTable[i].DestinationCity + '</td>';
                        SpGoodsRow += '<td width="200px">' + SpGoodsTable[i].AWBNo + '</td>';

                        SpGoodsRow += '<td colspan="6">' + SpGoodsTable[i].NatureOfGoods + '</td>';
                        SpGoodsRow += '<td>' + SpGoodsTable[i].NoOfPackg + '</td>';
                        SpGoodsRow += '<td>' + SpGoodsTable[i].Quantity + '</td>';
                        SpGoodsRow += '<td colspan="3">' + SpGoodsTable[i].SupplementaryInfo + '</td>';

                        SpGoodsRow += '<td width="200px">';
                        for (j = 0; j < ImpCodeArray.length; j++) {
                            SpGoodsRow += ImpCodeArray[j] + ',';
                        }
                        SpGoodsRow += '</td>';

                        SpGoodsRow += '<td>';
                        for (x = 0; x < SPULDArray.length; x++) {
                            SpGoodsRow += SPULDArray[x] + '</br>';
                        }
                        SpGoodsRow += '</td>';

                        SpGoodsRow += '<td></td>';
                        SpGoodsRow += '</tr>';

                        $("#tblSpGoods tbody").append(SpGoodsRow);
                    }
                }
                else {
                    SpGoodsRow += '<tr>';
                    SpGoodsRow += ' <td colspan=16 align=center style=font-size:large><b> NIL NOTOC </b></td>';
                    SpGoodsRow += '</tr>';
                    SpGoodsRow += '<tr>';
                    SpGoodsRow += ' <td colspan=16 align=center > // END OF NOTOC // </td>';
                    SpGoodsRow += '</tr>';
                    $("#tblSpGoods tbody").append(SpGoodsRow);
                }
                //End SP Goods Data


                //Begin DG Data
                var DGGoodsTable = result.Table0;
                var DGGoodsTable2 = result.Table2;
                //Added by Pankaj kumar ishwar on 04-02-2019 for run time logo
                //$('#wrapper').find('#ImgLogo').attr('src', '');
                //$('#wrapper').find('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + DGGoodsTable2[0]["AirlineLOGO"]);
                //$('#wrapper').find('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/GaurdaCMS Logo.jpg";');
                $('#ImgLogo').attr('src', '');
                $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + DGGoodsTable2[0]["AirlineLOGO"]);
                //$('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/aa.jpg";');
                $("#spnOriginCity").text(DGGoodsTable2[0].OriginAirportCode);
                $("#spnFlightNo").text(DGGoodsTable2[0].FlightNo);
                $("#spnFlightDate").text(DGGoodsTable2[0].FlightDate);
                $("#spnRegistrationNo11").text(DGGoodsTable2[0].RegistrationNo);
                $("#spnPreparedBy").text(userContext.UserName);
                //console.log(result);
                //console.log(result.Table3[0]);
                $("#tblDgGoods tbody tr").remove();

                if (DGGoodsTable.length > 0) {
                    for (i = 0; i < DGGoodsTable.length; i++) {
                        var DGGoodsRow = '';


                        var CAOVal = DGGoodsTable[i].IsCAO == "true" ? "Yes" : "No";

                        var ULDArray = [];
                        ULDArray = DGGoodsTable[i].ULDNo.split(",");

                        DGGoodsRow += '<tr>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].DestinationCity + '</td>';
                        DGGoodsRow += ' <td width="200px">' + DGGoodsTable[i].AWBNo + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].ProperShippingName + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].ClassDivSub + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].UNNo + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].SubRisk + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].NoOfPackg + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].NetQuantity + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].TI + '</td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].RAMCategory + '</td>';
                        DGGoodsRow += ' <td></td>';
                        DGGoodsRow += ' <td width="200px">' + DGGoodsTable[i].ImpCode + '</td>';
                        DGGoodsRow += ' <td>' + CAOVal + '</td>';


                        DGGoodsRow += '<td>';
                        for (j = 0; j < ULDArray.length; j++) {
                            DGGoodsRow += ULDArray[j] + '</br>';
                        }

                        DGGoodsRow += '</td>';


                        DGGoodsRow += ' <td></td>';
                        DGGoodsRow += ' <td>' + DGGoodsTable[i].ERGN + '</td>';
                        DGGoodsRow += '</tr>';
                        $("#tblDgGoods tbody").append(DGGoodsRow);

                    }
                }
                else {
                    DGGoodsRow += '<tr>';
                    DGGoodsRow += ' <td colspan=16 align=center style=font-size:large><b> NIL NOTOC </b></td>';
                    DGGoodsRow += '</tr>';
                    DGGoodsRow += '<tr>';
                    DGGoodsRow += ' <td colspan=16 align=center > // END OF NOTOC // </td>';
                    DGGoodsRow += '</tr>';
                    $("#tblDgGoods tbody").append(DGGoodsRow);
                }

                //End DG Data

            }
        });

}


/// add by sushant kumar anayak
function UserSubProcessRightsFlightControl(container, subProcessSNo) {
    var isView = false, IsBlocked = false;
    //get the subprocess view permission
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            isView = e.IsView;
            return;
        }
    });
    if (isView) {
        if (subProcessSNo == 33) {

            $("#btnSave:contains('Save Pre Manifest')").hide()
            $("#btnSave:contains('Update Pre Manifest')").hide()
            $("#btnFinalizedPreMan:contains('Update Pre Manifest')").hide()
            $("#btnFinalizedPreMan:contains('Create Pre Manifest')").hide()
            $("#btnNILManifest").hide();
        }
        else if (subProcessSNo == 34) {

            $("#btnSave:contains('Save Manifest')").hide()
            $("#btnSave:contains('Update Manifest')").hide()
            $("#btnSaveAndClose").hide()
            $("#btnliRemarks").hide();
            $("#btnNILManifest").hide();
        } else if (subProcessSNo == 35) {
            $("#btnSave:contains('Save Pre Manifest')").hide()
            $("#btnSave:contains('Update Pre Manifest')").hide()
            $("#btnSave:contains('Save Loading Instruction')").hide()
            $("#btnSave:contains('Update Loading Instruction')").hide()
            $("#btnliRemarks").hide();
            $("#btnNILManifest").hide();

        } else if (subProcessSNo == 2102) {
            $("#btnSave:contains('Save')").hide()
            $("#btnliRemarks").hide();
            $('#btn_SendNtm').css('visibility', 'hidden');
            $("#btnNILManifest").hide();
        } else if (subProcessSNo == 2103) {

        }

    } else {
        if (subProcessSNo != 33) {
            $("#btnliRemarks").show();
        }

        $("#btnNILManifest").show();
    }

    //$(userContext.ProcessRights).each(function (i, e) {
    //    if (e.SubProcessSNo == subProcessSNo) {
    //        IsBlocked = e.IsBlocked;
    //        return;
    //    }
    //});

    //if (IsBlocked) {
    //    $('#' + container).html("")
    //    $(".btn-success").attr("style", "display:none;");
    //    $(".btn-danger").attr("style", "display:none;");
    //    $(".ui-button").closest("td").attr("style", "display:none;");
    //    $(".btnTrans").closest("td").attr("style", "display:none;");
    //    $(".btn-primary").attr("style", "display:none;");
    //    $(".btn-block").attr("style", "display:none;");
    //    $("#btnSearch").show();
    //    $("#btnCancel").show();
    //} else {

    //    //if view permission is true
    //    if (isView) {
    //        $(".btn-success").attr("style", "display:none;");
    //        $(".btn-danger").attr("style", "display:none;");
    //        $(".ui-button").closest("td").attr("style", "display:none;");
    //        $(".btnTrans").closest("td").attr("style", "display:none;");
    //        $(".btn-primary").attr("style", "display:none;");
    //        $(".btn-block").attr("style", "display:none;");
    //        $("#btnSearch").show();
    //        $("#btnCancel").show();
    //        $("#btnNILManifest").attr("disabled", true);
    //        $("#btnliRemarks").attr("disabled", true);
    //        //$(".k-icon,.k-delete").replaceWith("");

    //        $('#' + container).find('input').each(function () {
    //            var ctrltype = $(this).attr("type");
    //            var dataRole = $(this).attr("data-role");
    //            if (ctrltype != "hidden") {
    //                if (dataRole == "autocomplete") {
    //                    $(this).parent().parent().replaceWith("<span>" + this.value + "</span>");
    //                }
    //                else if (dataRole == "datepicker") {
    //                    $(this).parent().replaceWith("<span>" + this.value + "</span>");
    //                }
    //                else if (ctrltype == "radio") {
    //                    var name = $(this).attr("name");
    //                    if ($(this).attr("data-radioval"))
    //                        $(this).closest("td").html("<span>" + $("input[name='" + name + "']:checked").attr("data-radioval") + "</span>");
    //                    else
    //                        $(this).attr("disabled", true);
    //                }
    //                else if (ctrltype == "checkbox" || ctrltype == "radio") {// && (this.value == "0" || this.value == "1")
    //                    $(this).attr("disabled", true);
    //                }
    //                else if ($(this).attr("id").indexOf("_temp") >= 0) {
    //                    $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
    //                }
    //                else {
    //                    $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
    //                }
    //            }

    //        });

    //        $('#' + container).find('select').each(function () {
    //            $(this).replaceWith("<span>" + $("#" + $(this).attr("id") + " :selected").text() + "</span>");
    //        });

    //        $('#' + container).find('ul li span').each(function (i, e) {
    //            $(e).removeClass();
    //        });

    //    }
    //    else {
    //        if (subProcessSNo == 2513 || subProcessSNo == 2500 || subProcessSNo == 2391) {
    //            //$(".btn-success").attr("style", "width:100px;");
    //            //$(".btn-primary").attr("style", "width:100px;");
    //            //$(".btn-block").attr("style", "width:100px;");
    //        }
    //        else {
    //            $(".btn-success").attr("style", "display:block;");
    //            $(".btn-danger").attr("style", "display:block;");
    //            $(".btn-primary").attr("style", "display:block;");
    //            $(".btn-block").attr("style", "display:block;");
    //            $(".btnTrans").closest("td").attr("style", "display:table-cell;");
    //            $(".ui-button").closest("td").attr("style", "display:table-cell;");
    //            $("#btnNILManifest").attr("disabled", false);
    //            $("#btnliRemarks").attr("disabled", false);
    //        }
    //    }
    //}

}

function fn_GetAWBLabelPrint(AWBSNo) {

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetAWBLabelPrint?AWBSNo=" + AWBSNo,
        async: false,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) { },
    });
}

function SaveEPouchDetails() {
    var EPouchArray = [];
    var flag = false;
    $("div[id$='areaTrans_flightcontrol_flightepouchinfo']").find("[id^='areaTrans_flightcontrol_flightepouchinfo']").each(function () {
        var ePouchViewModel = {
            GroupFlightSNo: GroupFlightSNo,
            DocName: $(this).find("span[id^='DocName']").text(),
            AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
            Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
        };
        EPouchArray.push(ePouchViewModel);
    });
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/SaveEPouchDetail", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ GroupFlightSNo: GroupFlightSNo, FlightEPouchDetails: EPouchArray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Flight Pouch Information', "Processed Successfully", "bottom-right");
                flag = true;
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                flag = false;
            }
            else
                ShowMessage('warning', 'Warning - Flight Pouch Information', "unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Flight Pouch Information', "unable to process.", "bottom-right");

        },
        complete: function (xhr) {
            $("div[id$='areaTrans_shipment_shipmentsphcedoxinfo']").find("[id^='areaTrans_shipment_shipmentsphcedoxinfo']").each(function () {
                $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata", '');
            });

        }
    });
    return flag;
}

function BindEPouch() {

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetRecordAtFlightEPouch?GroupFlightSNo=" + GroupFlightSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ePouchData = jQuery.parseJSON(result);
            var ePouchArray = ePouchData.Table0;
            cfi.makeTrans("flightcontrol_flightepouchinfo", null, null, BindE_Pouch, ReBindE_Pouch, null, ePouchArray, null, true);
            $("div[id$='areaTrans_flightcontrol_flightepouchinfo']").find("[id='areaTrans_flightcontrol_flightepouchinfo']").each(function () {
                $(this).find("input[id^='DocsName']").each(function () {
                    $(this).unbind("change").bind("change", function () {
                        UploadEPouchDocument($(this).attr("id"), "DocName");
                        WrapSelectedFileName();
                    })
                });
                $(this).find("a[id^='ahref_DocName']").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        DownloadEPouchDocument($(this).attr("id"), "DocName");
                    })

                });
                if ($(this).find("a[id^='ahref_DocName']").attr("linkdata") == "" || $(this).find("a[id^='ahref_DocName']").attr("linkdata") == undefined) {
                    $(this).find("input[id^='DocsName']").css('width', '');
                    $(this).find("input[id^='DocsName']").attr("data-valid-msg", "Attach Document");
                    $(this).find("input[id^='DocsName']").attr("data-valid", "required");
                }
                $(this).find("textarea[id^='Doc_Remarks']").attr('style', 'width: 100px; text-transform: uppercase;');

            });

            $('#transActionDiv').find('i:first').hide();

        }
    });
}
function WrapSelectedFileName() {
    $("div[id$='areaTrans_flightcontrol_flightepouchinfo']").find("[id^='areaTrans_flightcontrol_flightepouchinfo']").each(function () {
        $(this).find("span[id^='DocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='DocsName']").css('width', '');
        if ($(this).find("a[id^='ahref_DocName']").attr("linkdata") == "" || $(this).find("a[id^='ahref_DocName']").attr("linkdata") == undefined) {
            $(this).find("input[id^='DocsName']").css('width', '');
            $(this).find("input[id^='DocsName']").attr("data-valid-msg", "Attach Document");
            $(this).find("input[id^='DocsName']").attr("data-valid", "required");
        }
    });

}
function UploadEPouchDocument(objId, nexctrlid) {

    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    var FileFlag = true;
    for (var i = 0; i < files.length; i++) {
        if (files[i].name.length > 150) {
            FileFlag = false;
        } else {
            fileName = files[i].name;
            data.append(files[i].name, files[i]);
        }
    }
    if (FileFlag == false) {
        ShowMessage('info', 'File Upload!', "Unable to upload selected file. File Name should be less than 150 characters.", "bottom-right");
        return;
    }
    $.ajax({
        url: "/BLOBUploadAndDownload/UploadToBlob",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {

            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(files[0].name);//result.substring(result.lastIndexOf('__') + 2)
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });

}

function DownloadEPouchDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindE_Pouch(elem, mainElem) {
    $(elem).find("input[type='file']").attr("data-valid-msg", "Attach Document");
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEPouchDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEPouchDocument($(this).attr("id"), "DocName");
        })
    });
    WrapSelectedFileName();
}

function ReBindE_Pouch(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_flightcontrol_flightepouchinfo']").find("[id^='areaTrans_flightcontrol_flightepouchinfo']").each(function () {
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEPouchDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEPouchDocument($(this).attr("id"), "DocName");
        })
    });
}

/// Add by Pankaj Kumar Ishwar
// Added Function for Send Mail Popup of Loading Instruction
function fn_SendMailPopup(e) {
    $("#divLiSendMailPop").html("");
    $("#divLiSendMailPop").css('display', 'none');
    $('body').append($("<div />", {
        id: 'divLiSendMailPop'
    }));
    $("#divLiSendMailPop").append('<center><table id="tblGeneratedSendMail" style="width:100%;"><tr><th align="left" style="width:20%;">MAIL TO<font color="red">*</font> :</th><td><input id="mailto" class="k-input" maxlength="61" type="text" style="width:95%;text-transform:uppercase;" /></td></tr><tr><th align="left" valign="top">SUBJECT<font color="red">*</font>:</th><td><input type="hidden" id="subniil" name="subniil" /><input id="subjmail" class="k-input" maxlength="50" style="width:95%;;text-transform:uppercase;" type="text"/><br/></td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><th align="left">Content<font color="red"></font>:</th><td><textarea  id="msgContent" style="height:auto;min-width:94%; min-height:100px; width:auto; height:auto;"></textarea></td></tr><tr><td align="center" colspan="2"><input type="button" class="btn btn-block btn-info" value="SEND MAIL" onclick="LoadingInstructionPDF();" />&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUp();" /></td></tr></table><center>');
    divmail = $("<div id='divmailAdds' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    if ($("#divmailAdd").length === 0)
        $("#mailto").after(divmail);
    cfi.PopUp("divLiSendMailPop", "LI Report Send Mail", 830, null, null, 10);
    $("#divLiSendMailPop").parent("div").css("position", "fixed");
}
function ClosePopUp() {
    $("#divLiSendMailPop").data("kendoWindow").close();
}
function LoadingInstructionPDF() {
    if ($("#mailto").val() != "") {
        if ($("#subjmail").val() != "") {
            GetLIReportData(GroupFlightSNo);
            ShowLimail();
            var mailto = $("#mailto").val()
            var subject = $("#subjmail").val()
            var content = $('#msgContent').val() == "" ? "" : $('#msgContent').val()
            var filename = userContext.SysSetting.EmailAttachmentWServicePath
            var html = btoa($('#tblReport').parent().html().replace('../BLOBUploadAndDownload', userContext.SysSetting.Domain + '/BLOBUploadAndDownload'));
            $.ajax({
                url: "../Master/DownloadPdfForLI",
                async: true,
                type: "POST",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ html: html, mailto: mailto, subject: subject, content: content, filename: filename }),
                success: function (response) {
                    var result = response[0];
                    if (result > 0) {
                        ShowMessage('success', 'Success!', 'Attachment Send Successfully!', "bottom-right");
                    }
                },
                error: function (er) {
                    debugger
                }
            });
        }
        else {
            ShowMessage('info', 'Info - Subject Required!', 'Subject can not be blank!', "bottom-right");
        }
    }
    else {
        ShowMessage('info', 'Info - Mail To Required!', 'Mail To can not be blank!', "bottom-right");
    }
}
function ShowLimail() {
    var mail = $("#mailto").val().toUpperCase();
    if (mail != "") {
        if (ShowValidLimail(mail)) {
        }
        else {
            ShowMessage('info', 'Info - Mail To Required!', 'Please enter valid Email Address!', "bottom-right");
        }
    }
}
function ShowValidLimail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}
/*------------------------------------------------*/
var YesReady = false;
function PageRightsCheckFlightControl() {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.PageName.toString().toUpperCase() == "FLIGHT CONTROL") {

            if (i.PageName.toString().toUpperCase() == "FLIGHT CONTROL" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.PageName.toString().toUpperCase() == "FLIGHT CONTROL" && i.PageRight == "Edit") {
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

        //$("#divAddUldSection").find('span').hide();

        $("#divFooter").find("button").hide();
        $("#divFooter").find("submit").hide();
        $("#divFooter").find("input").hide();
        $("#divContentDetail").find("button").hide();
        $("#divContentDetail").find("input").hide();
        $("#divDetailPrint").find("submit").hide();
        $("#divDetailPrint").find("button").hide();
        $("#divDetail").find("button").hide();
        $("#transActionDiv").hide();
        $("#divFlightDetails").find('input[value="CLS"]').attr("disabled", "disabled");
        $("#divContentDetail").find('input[type="file"]').attr("disabled", "disabled");
        $('#btnSaveAndClose').hide();
        $('#btnSave').hide();
        $('#btnCancel').hide();


        //  $("#Text_searchULDNo").data("kendoAutoComplete").enable(false);
    }
}
function fn_GetSetULDAWBRemarks(ProcessType, ProcessSNo, IsSaved, input) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/PreManifestRFSRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            TDForRFSRemarks = $(input).closest('td');
            $("#divDetailPop").html(result);
            $('#PreManifestRemarks').val($(input).closest('td').find('input[type=hidden]').val())
            cfi.PopUp("__divpremanifestrfsremarks__", "Remarks");
            $('.k-window').closest("div:hidden").remove();
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
//function fn_GetSetOffloadRemarks(ProcessType, ProcessSNo, IsSaved, input) {
//    var HTMLResult = "<div id='divManifest_OffloadReasonDetails'><table class='WebFormTable' id='tblManifest_OffloadReasonDetails'  validateonsubmit='true'  border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr><td colspan='2' ></td></tr><br/><tr><td class=\"formlabel\" >Offload Piece:</td><td class='formInputcolumn' > <span id=\"spnOffloadPiece\">2</span></td></tr><tr><td class=\"formlabel\" ><font color='red'>*</font>Offload Reason:</td><td class='formInputcolumn' > <input type=\"text\" class=\"k-input\" name=\"Text_txtOffloadReason\" id=\"Text_txtOffloadReason\" controltype=\"autocomplete\" colname=\"Offload Reason\" maxlength=\"10\"  placeholder=\"\Offload Reason\" data-role=\"autocomplete\" autocomplete=\"off\" style=\"width:100%;text-transform:uppercase;\"></td></tr><tr><td  class=\"formlabel\"></td><td  class='formInputcolumn' ><button  tabindex='3' class='btn btn-block btn-success btn-sm' style='float:right;margin: 3px;' name='btnsaveAssignTowTruck_DriverDetails' id='btnsaveAssignTowTruck_DriverDetails' style='width:90px;' value='Save' onclick='saveAssignTowTruck_DriverDetails();' >Save</button></td></tr></table></div>";
//    $("#divDetailPop").html(HTMLResult)

//    cfi.PopUp("divDetailPop", "Offload Reason Remarks", 500);
//    //cfi.AutoCompleteV2("txtOffloadReason", "Reason", "FlightControl_ManifestOffloadReason", null, "contains", ",");
//}
function fn_GetSetOffloadRemarks(ProcessType, ProcessSNo, input) {
    var OffloadRemarksArray = new Array();
    var Pcs = 0;
    Pcs = isNaN(parseInt($(input).closest('tr').find('td[data-column="TotalPPcs"]').text()) - ($(input).closest('tr').find('input[id="' + (ProcessType == "A" ? "chkBulk" : "chkbtnSelect") + '"]').prop("checked") == false ? 0 : parseInt($(input).closest('tr').find('input[id="txt_PlannedPieces"]').val()))) ? "" : parseInt($(input).closest('tr').find('td[data-column="TotalPPcs"]').text()) - ($(input).closest('tr').find('input[id="' + (ProcessType == "A" ? "chkBulk" : "chkbtnSelect") + '"]').prop("checked") == false ? 0 : parseInt($(input).closest('tr').find('input[id="txt_PlannedPieces"]').val()));
    //var OffloadRemarksHtml = '<div id="divareaTrans_flightcontrol_manifestoffloadremarks"  class="k-window-content k-content"><table class="WebFormTable"><tbody><tr><td class="formHeaderLabel" title="Offload Piece"><font color="red">*</font><span id="spntxtOffloadPiece"> Offload Piece</span></td><td class="formHeaderLabel" title="Enter Offload Reason">Offload Reason</td></tr><tr data-popup="true" id="areaTrans_flightcontrol_manifestoffloadremarks" totalfieldsadded="0" maxcountreached="false" fieldcount="0" uniqueid="icon-trans-plus-sign0.25335848625476554"><td class="formtwoInputcolumn"><span id="spnOffloadPiece"></span></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="txtOffloadReason" id="txtOffloadReason" recname="txtOffloadReason" controltype="autocomplete" colname="offload reason" maxlength="10" value="" placeholder="Offload Reason" data-role="autocomplete" autocomplete="off" style="width: 100%; text-transform: uppercase;"></td></tr><tr><td colspan="2" align="left" style="padding:5px;"><button class="btn btn-block btn-success btn-sm" id="btnSave" style="display:block;" onclick="fnSaveOffloadRemarksDetails();">Save</button></td></tr></tbody></table></div>';
    if ($(input).closest('tr').find('input[id="' + (ProcessType == "A" ? "chkBulk" : "chkbtnSelect") + '"]').prop("checked") == false || Pcs > 0) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/OffloadRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                // $('#divareaTrans_flightcontrol_towingtruckassignescortpersonnel  table').remove();
                //$.ajax({
                //    url: "Services/FlightControl/FlightControlService.svc/GetEscortPersonnelDetails?RFCDetailsSNo=" + RFCDetailsSNo + "&&TowTruckDriverDetailsSNo=" + TowTruckDriverDetailsSNo,
                //    async: false,
                //    type: "get",
                //    cache: false,
                //    contentType: "application/json; charset=utf-8",
                //    success: function (resultData) {
                //        var rData = jQuery.parseJSON(resultData);
                //        OffloadRemarksArray = rData.Table0;

                //        //EPArray = JSON.parse(resultData).Table0;

                //        //alert(resultData);
                //    }
                //});

                $("#divareaTrans_flightcontrol_manifestoffloadremarks").remove();
                $("#divDetailPop").html(result);
                cfi.makeTrans("flightcontrol_manifestoffloadremarks", null, null, null, null, null, OffloadRemarksArray, null);
                $('#divareaTrans_flightcontrol_manifestoffloadremarks > table > tbody > tr:nth-child(1) > td:nth-child(4)').remove();
                $('#transAction').remove();

                $("div[id$='areaTrans_flightcontrol_manifestoffloadremarks']").find("[id^='areaTrans_flightcontrol_manifestoffloadremarks']").each(function () {
                    $(this).find("input[id^='txtOffloadReason']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "Reason", "FlightControl_ManifestOffloadReason", null, "contains", ",");
                        $(this).removeAttr('onblur');
                        //$(this).css("text-transform", "uppercase");
                        $(this).attr("class", "transSection k-input");
                    });
                });

                if (!$("#divareaTrans_flightcontrol_manifestoffloadremarks").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_flightcontrol_manifestoffloadremarks", "Offload Reason Remarks", 450);
                }
                else {
                    $("#divareaTrans_flightcontrol_manifestoffloadremarks").data("kendoWindow").open();
                }
                $('input[id="lblOffloadPiece"]').text(Pcs);
                $('span[id="lblOffloadPiece"]').text(Pcs);
                $('#divareaTrans_flightcontrol_manifestoffloadremarks table tbody').append('<tr><td colspan="3" align="left" style="padding:5px;" ><button class="btn btn-block btn-success btn-sm" id="btnSave" style="display:block;" onclick=\'fnSaveOffloadRemarksDetails("' + ProcessType.toUpperCase() + '",' + ProcessSNo + ',' + Pcs + ');\' >Save</button></td></tr>');
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning ', "Please enter offload piece before adding remarks.", "bottom-right");
    }

}


var AllOffloadRemarksDetails = [];
function fnSaveOffloadRemarksDetails(ProcessType, ProcessSNo, Piece) {
    //Pending
    // alert('Data Saved');
    cfi.ValidateSection('divareaTrans_flightcontrol_manifestoffloadremarks');
    if (!cfi.IsValidSection($("div[id$='areaTrans_flightcontrol_manifestoffloadremarks']").parent("div")))
        return false;

    //var OffloadRemarksDetails = new Array();
    $("div[id$='areaTrans_flightcontrol_manifestoffloadremarks']").find("[id^='areaTrans_flightcontrol_manifestoffloadremarks']").each(function () {

        if ((Piece > 0 && ProcessType == "A") || (ProcessType == "U")) {
            AllOffloadRemarksDetails.push({
                DailyFlightSNo: CurrentFlightSno,
                GroupFlightSNo: GroupFlightSNo,
                ULDStockSNo: ProcessType == "U" ? ProcessSNo : 0,
                AWBSNo: ProcessType == "A" ? ProcessSNo : 0,
                OffloadPiece: ProcessType == "A" ? Piece : 0,
                OffloadReason: $(this).find("input[id^='txtOffloadReason']").val(),

            });
            ShowMessage('success', 'Success -Offload Remarks created Successfully', "Processed Successfully", "bottom-right");
            $("#divareaTrans_flightcontrol_manifestoffloadremarks").data("kendoWindow").close();
            $("div").remove(".k-overlay");
        }

    });

    //alert(JSON.stringify(AllOffloadRemarksDetails));
    //$.ajax({
    //    url: "Services/FlightControl/FlightControlService.svc/SaveOffloadRemarksDetails",
    //    async: false,
    //    type: "POST",
    //    dataType: "json",
    //    cache: false,
    //    data: JSON.stringify({
    //        OffloadRemarksDetails: OffloadRemarksDetails,
    //        DailyFlightSNo: DailyFlightSNo,
    //        GroupFlightSNo: CurrentFlightSno
    //    }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        var ResultStatus = result.split('?')[0];
    //        if (ResultStatus == "0") {
    //            ShowMessage('success', 'Success -Offload Remarks created Successfully', "Processed Successfully", "bottom-right");

    //        }
    //        else {
    //            ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
    //        }
    //        $("#divareaTrans_flightcontrol_manifestoffloadremarks").data("kendoWindow").close();
    //        $("div").remove(".k-overlay");

    //    }
    //});


    //alert(JSON.stringify(EscortPersonnelDetails));
}

//function GetExpectedLoadPrint() {
//    $.ajax({
//        url: "HtmlFiles/Export/ExpectedLoadPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            $("#divDetailPop").html(result);
//            fn_GetExpectedLoadDetails();
//            printDiv('Expected Load');
//        },
//        beforeSend: function (jqXHR, settings) {
//        },
//        complete: function (jqXHR, textStatus) {
//        }
//    });
//}

function fn_GetExpectedLoadDetails() {
   
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetExpectedLoadDetails?GroupFlightSNo=" + GroupFlightSNo,
        contentType: "application/json; charset=utf-8",
        async: false,
        type: 'GET',
        cache: false,
        success: function (result) {

            var ResultData = jQuery.parseJSON(result);
            var FlightDetails = ResultData.Table0;
            var ULDDetails = ResultData.Table1;
            var ShipmentDetails = ResultData.Table2;

            if (ShipmentDetails.length > 0) {
                $.ajax({
                    url: "HtmlFiles/Export/ExpectedLoadPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divDetailPop").hide();
                        $("#divDetailPop").html(result);
                var TotalPieces = 0;
                var TotalGrossWeight = 0;
                if (FlightDetails.length > 0) {
                    $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FlightDetails[0]["AirlineLogo"]);
                    $('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/GaurdaCMS Logo.jpg";');
                    $('#tdDestinationAirport').text(FlightDetails[0].DestinationAirport)
                    $('#tdRegistrationNo').text(FlightDetails[0].RegistrationNo);
                    $("#tdFlightNumber").text(FlightDetails[0].FlightNo);
                    $("#tdAirline").text(FlightDetails[0].AirlineName);
                    $('#tdOriginAirport').text(FlightDetails[0].OriginAirport);
                    $('#tdFlightNoAndDate').text(FlightDetails[0].FlightNo + "/" + FlightDetails[0].FlightDate);
                }
                if (ULDDetails.length > 0) {
                    $(ULDDetails).each(function (ULD_Row, ULD_tr) {
                        $("#trULDHeader").after('<tr align="left" class="grdTableRow" id="trULD_'+ULD_tr.ULDStockSNo+'"><td colspan="11"><b>'+ULD_tr.ULDNo+'</b></td></tr>');
                        var TotalULDPieces = 0;
                        var TotalULDGrossWeight = 0;
                        var trMaxTrID = 0;
                        if (ShipmentDetails.length > 0) {
                            $(ShipmentDetails).each(function (Shipment_Row, Shipment_tr) {

                                if (parseInt(ULD_tr.ULDStockSNo) == parseInt(Shipment_tr.ULDStockSNo)) {
                                    TotalULDPieces = TotalULDPieces + parseInt(Shipment_tr.Pieces);
                                    TotalULDGrossWeight = TotalULDGrossWeight + parseFloat(Shipment_tr.GrossWeight);
                                    TotalPieces = TotalPieces + parseInt(Shipment_tr.Pieces);
                                    TotalGrossWeight = TotalGrossWeight + parseFloat(Shipment_tr.GrossWeight);
                                    if (Shipment_Row == 0) {
                                        trMaxTrID = 'trULD_' + ULD_tr.ULDStockSNo;
                                    }
                                    

                                    $('#' + trMaxTrID).after('<tr align="center" class="grdTableRow" id="trShipment_' + Shipment_tr.ULDStockSNo + '_' + Shipment_tr.AWBSNo + '">'
                                        + ' <td colspan="1" style="width:20px;">' + (Shipment_Row+1) + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.AWBNo + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.Pieces + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.Description + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.SHC + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.Status + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.GrossWeight + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.AWBSector + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.Priority + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.Remarks + '</td>'
                                        + '<td colspan="1">' + Shipment_tr.OfficeUse + '</td>'
                                        + '</tr>');
                                    //if (Shipment_Row > 0) {
                                        trMaxTrID = 'trShipment_' + Shipment_tr.ULDStockSNo + '_' + Shipment_tr.AWBSNo;
                                    //}
                                }
                            });

                        }
                        $('#' + trMaxTrID).after('<tr align="center" class="grdTableRow">'
                            + '<td colspan = "1" >&nbsp;</td >'
                            + '<td colspan="1"><b>Total</b></td>'
                            + '<td colspan="1"><b id="b_TotalNoPieces">' + TotalULDPieces + '</b></td>'
                            + '<td colspan="1">&nbsp;</td>'
                            + '<td colspan="1"></td>'
                            + '<td colspan="1">&nbsp;</td>'
                            + '<td colspan="1"><b id="b_ULDTotalGrossWeight">' + TotalULDGrossWeight.toFixed(2) + '</b></td>'
                            + '<td colspan="1">&nbsp;</td>'
                            + '<td colspan="1">&nbsp;</td>'
                            + '<td colspan="1">&nbsp;</td>'
                            + '<td colspan="1">&nbsp;</td>'
                            + '</tr>')

                    });
                    $("#b_NoofAWB").text("No of AWB :" + $.unique(ShipmentDetails.map(function (d) { return d.AWBSNo; })).length);
                    $("#b_TotalPieces").text("Total Pieces :" + TotalPieces);
                    $("#b_TotalGrossWeight").text("Total Gross Weight  :" + TotalGrossWeight.toFixed(2));

                }
                        printDiv('Expected Load');
                    },
                    beforeSend: function (jqXHR, settings) {
                    },
                    complete: function (jqXHR, textStatus) {
                    }
                });
            }
            else {
                ShowMessage('warning', 'Warning', "Expected Load not found ", "bottom-right");
            }
        }
    });
}