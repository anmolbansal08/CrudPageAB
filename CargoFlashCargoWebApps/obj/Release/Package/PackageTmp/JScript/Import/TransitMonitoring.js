
var billto = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];
$(document).ready(function () {
    SearchTransitMonitoring();


    cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);
    cfi.AutoCompleteByDataSource("TerminateBillType", billto, onTerminateBillToSelect, null);
    $('.icon-trans-plus-sign').hide();

});


function onTerminateBillToSelect(e) {


    cfi.ResetAutoComplete("TerminateBillToSNo");
    //$("#Text_TerminateBillToSNo").closest('.k-widget').show();
    if ($('#TerminateBillType').val() == '0') {


        //var data = GetDataSource("TerminateBillToSNo", "Account", "SNo", "Name", ["Name"], null);
        //cfi.ChangeAutoCompleteDataSource("TerminateBillToSNo", data, true, null, "Name", "contains");
        $("#Text_TerminateBillToSNo").data("kendoAutoComplete").enable(false);
        $('#spnbillto').hide();
        $('#Text_TerminateBillToSNo').removeAttr('data-valid');
        $('#Text_TerminateBillToSNo').removeAttr('data-valid-msg');
        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
        });

    }
    else if ($('#TerminateBillType').val() == '1') {

        $('#spnbillto').show();
        var data = GetDataSource("TerminateBillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        cfi.ChangeAutoCompleteDataSource("TerminateBillToSNo", data, true, null, "AirlineName", "contains");
        $("#Text_TerminateBillToSNo").data("kendoAutoComplete").enable(true);
        $('#Text_TerminateBillToSNo').attr('data-valid', 'required');
        $('#Text_TerminateBillToSNo').attr('data-valid-msg', 'Enter Airline.');


        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled", "disabled");

        });

    }


}

function onBillToSelect(e) {


    cfi.ResetAutoComplete("BillToSNo");
    $("#Text_BillToSNo").closest('.k-widget').show();
    if ($('#BillType').val() == '0') {

        $('#spnBillToSNo').text('Agent Name');
        var data = GetDataSource("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, null, "Name", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Agent.');

        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');

        });
    }
    else if ($('#BillType').val() == '1') {

        $('#spnBillToSNo').text('Airline Name');
        var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, null, "AirlineName", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Airline.');

        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');

        });

    }


}


function SearchTransitMonitoring() {
    _CURR_PRO_ = "TransitMonitoring";
    _CURR_OP_ = "Transit Monitoring";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divTransitMonitoringDetails").html("");

    $("#tblAwbULDLocation_btnAppendRow").live("click", function () {
        $("#tblAwbULDLocation_btnRemoveLast").show();
        GetTempreatureControlled();
    });

    $.ajax({
        url: "Services/Import/TransitMonitoringService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/TransitMonitoring/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#searchFromDate").change(function () {
                ValidateDate();
            });

            $("#searchToDate").change(function () {
                ValidateDate();
            });

            //---------------------- Transit Monitoring search ---------------------------//
            $("#btnSearch").bind("click", function () {
                TransitMonitoringSearch();
            });
        }
    });
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

    cfi.AutoComplete("SearchAirlineCarrierCode", "CarrierCode,AirlineName", "VGetInventoryAirline", "CarrierCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("SearchBoardingPoint", "AirportCode,AirportName", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("searchFlightNo", "FlightNo", "vDailyFlightFBL", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    $("#Text_SearchAirlineCarrierCode").attr("placeholder", "Airline");
    $("#Text_SearchBoardingPoint").attr("placeholder", "Boarding Point");
    $("#Text_searchFlightNo").attr("placeholder", "Flight No.");
}

//--------------------- Inbound flight search -----------------------//
function TransitMonitoringSearch() {
    $("#divTransitMonitoringInformation").html("");
    $("#divTransitMonitoringULDInformation").html("");

    var SearchAirlineCarrierCode = $("#SearchAirlineCarrierCode").val() == "" ? "A~A" : $("#SearchAirlineCarrierCode").val();
    var SearchBoardingPoint = $("#SearchBoardingPoint").val() == "" ? "A~A" : $("#SearchBoardingPoint").val();
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var searchFromDate = "0";

    searchFromDate = $("#searchFromDate").attr("sqldatevalue") != "" ? $("#searchFromDate").attr("sqldatevalue") : "0";
    var searchToDate = "0";

    searchToDate = $("#searchToDate").attr("sqldatevalue") != "" ? $("#searchToDate").attr("sqldatevalue") : "0";
    var currentFFMFlightMasterSNo = "77533";

    _CURR_PRO_ = "TransitMonitoringFlightArrival";
    if (_CURR_PRO_ == "TransitMonitoringFlightArrival") {
        cfi.ShowIndexView("divTransitMonitoringDetails", "Services/Import/TransitMonitoringService.svc/GetFlightArrivalShipmentGrid/" + _CURR_PRO_ + "/Import/TransitMonitoringFlightArrivalShipment/" + currentFFMFlightMasterSNo + "/" + SearchAirlineCarrierCode + "/" + SearchBoardingPoint + "/" + SearchFlightNo + "/" + searchFromDate + "/" + searchToDate);
    }
}

function ValidateDate() {
    var fromDate = $("#searchFromDate").attr("sqldatevalue");
    var toDate = $("#searchToDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");
            $("#searchFromDate").val("");
            $("#searchToDate").val("");
            ShowMessage('warning', 'Warning - Inbound Flight', "From date should not be greater than To date.");
        }
    }
}

function GetFAULDLocation(ffmShipmentTransSNo) {
    var dbTableName = 'FAULDLocation';
    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
}

function GetULDXray(ffmShipmentTransSNo) {
    var dbTableName = 'ULDXray';
    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
}

function GetReBuild(ffmShipmentTransSNo, FFMFlightMasterSNo, obj) {
    // var ReBuildULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var retVal = confirm("Are you sure ULD needs to be re-build ?");
    if (retVal == true)
    { }
    else {
        return false;
    }

    var dbTableName = 'ReBuild';
    //ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
    RebuildProcess(obj);

}

function GetBindReBuild(ffmShipmentTransSNo, FFMFlightMasterSNo, obj) {
    //   var ffmShipmentTransSNo = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    var RULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    // var FFMFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();
    $("#divDetail2").html('');
    $("#divDetail2").append('<B>Applied Charges<B><br/><table id="tblResultCharge" class="WebFormTable"></table>')
    $.ajax({
        url: "Services/Import/TransitMonitoringService.svc/GetBindRebuildCharge?ULDNo=" + RULDNo,
        async: false, type: "GET", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData.length > 0) {
                $('#tblResultCharge').html('<tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AIRLINE/AGENT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr>');

                for (var i = 0; i < resData.length; i++) {
                    $('#tblResultCharge').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;">' +
                        resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + " " + userContext.CurrencyCode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRebuildHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
                }
                // $("#tblResult").append
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });

    cfi.PopUp("divDetail2", "Rebuild Charges", 1000);


}
function PrintRebuildHandlingDetails(SNo, InvoiceType) {
    if (InvoiceType < 2)
        window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + SNo + "&InvoiceType=" + InvoiceType);
    else
        window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo);
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

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
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
                    //else {
                    //    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //}
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

function BindChargeAutoComplete(elem, mainElem) {
    if ($(elem)[0].id.indexOf("rebuildhandlingcharge") > -1) {
        $(elem).find("input[id^='ChargeName']").each(function () {
            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffHeadName", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
        });
        //$(elem).find("input[id^='BillTo']").each(function () {
        //    cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
        //    $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
        //});
        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
            if (i < MendatoryHandlingCharges.length) {
                $(this).find("div[id^='transActionDiv']").hide();
            }
            if (i >= MendatoryHandlingCharges.length) {
                $(this).find("span[id^='Type']").text("E");
                $(this).find("input[id^='WaveOff']").hide();
            }
            $(this).find("input[id^='BillTo']").hide();
        });
    }
}

function ReBindChargeAutoComplete(elem, mainElem) {
    if ($(elem)[0].id.indexOf("dohandlingcharge") > -1) {
        $(elem).closest("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function () {
            $(this).find("input[id^='ChargeName']").each(function () {
                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffHeadName", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
            });
        });
        //$(elem).find("input[id^='BillTo']").each(function () {
        //    cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
        //    $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
        //});
        var totalRow = $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").length;
        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
            if (i + 1 == totalRow) {
                $(this).find("div[id^='transActionDiv']").show();
            }
            if (i >= MendatoryHandlingCharges.length) {
                $(this).find("span[id^='Type']").text("E");
                $(this).find("input[id^='WaveOff']").hide();
            }
            $(this).find("input[id^='BillTo']").hide();
        });
    }
}

var currentawbsno = 0;
var currentdetination = '';
var currArrivedShipmentSNo = 0;

var totalHandlingCharges = 0;
var pValue = 0;
var sValue = 0;
var MendatoryHandlingCharges = new Array();
function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("PValue", "SValue")).val() : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("SValue", "PValue")).val() : 0;
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
            url: "Services/Import/DeliveryOrderService.svc/GetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(0) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue) + "&HAWBSNo=" + hawbSNo,
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis']").text(doItem.SecondryBasis);
                        $("span[id^='Amount']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id^='Remarks']").text(doItem.ChargeRemarks);
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
                        $("span[id^='Remarks" + rowId + "']").text(doItem.ChargeRemarks);
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
}
//function GetChargeValue(obj) {
//    rowId = obj.id.split("_")[1];
//    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
//    if (obj.id.indexOf("PValue") > -1) {
//        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
//        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("PValue", "SValue")).val() : 0;
//    }
//    else {
//        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
//        pValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("SValue", "PValue")).val() : 0;
//    }
//    if (tariffSNo == "" || tariffSNo == undefined) {
//        alert("Please select Charges.");
//    }
//    else {
//        $.ajax({
//            url: "Services/Import/TransitMonitoringService.svc/GetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currArrivedShipmentSNo) + "&DestinationCity=" + currentdetination + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue),
//            async: false, type: "GET", dataType: "json",
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                var resData = jQuery.parseJSON(result);
//                var doCharges = resData.Table0;
//                if (doCharges.length > 0) {
//                    var doItem = doCharges[0];
//                    if (rowId == undefined) {
//                        $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                        $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                        $("span[id^='PBasis']").text(doItem.PrimaryBasis);
//                        $("span[id^='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                        $("span[id^='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                        $("span[id^='SBasis']").text(doItem.SecondryBasis);
//                        $("span[id^='Amount']").text(doItem.ChargeAmount);
//                        $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
//                        $("span[id^='TotalAmount']").text(doItem.TotalAmount);
//                        $("span[id^='Remarks']").text(doItem.ChargeRemarks);
//                    }
//                    else {
//                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
//                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
//                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
//                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
//                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
//                        $("span[id^='Remarks" + rowId + "']").text(doItem.ChargeRemarks);
//                    }
//                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(doItem.TotalAmount);
//                }
//            }
//        });
//    }
//}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (row, tr) {
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

function RebuildProcess(obj) {

    var ffmShipmentTransSNo = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    var RULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var FFMFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();

    $.ajax({
        url: "Services/Import/TransitMonitoringService.svc/GetWebForm/TransitMonitoring/Import/ChargeNote/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#tblTerminate").html('');
            $("#divDetail2").html("<table class='WebFormTable' id='tbl' validateonsubmit='true'><tbody><tr><td class='formlabel' title='Select Bill Type'><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillType'> Bill Type</span></td><td class='formInputcolumn'><input type='hidden' name='BillType' id='BillType' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillType' id='Text_BillType' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td class='formlabel' title='Select '><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillToSNo'>Bill To</span></td><td class='formInputcolumn'><input type='hidden' name='BillToSNo' id='BillToSNo' value=''><span class='k-widget k-combobox k-header' style='display: inline-block;'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillToSNo' id='Text_BillToSNo' style='width: 100%; text-transform: uppercase;' tabindex='6' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Bill To.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr></tbody></table>");



            $("#divDetail2").append(result);

            cfi.PopUp("divDetail2", "Rebuild Charges", 1000);
            $.ajax({
                url: "Services/Import/TransitMonitoringService.svc/GetRebuildCharges?ffmShipmentTransSNo=" + ffmShipmentTransSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var sDetail = resData.Table0;
                    var hcData = resData.Table1;
                    currentawbsno = sDetail[0].AWBSNo;
                    currentdetination = sDetail[0].DestinationCity;
                    currArrivedShipmentSNo = sDetail[0].ArrivedShipmentSNo;
                    $("#divDetail2").append("</br><input id='btnPrint' type='button' value='Save' onclick=\"SaveRebuildCharges(" + FFMFlightMasterSNo + ",'" + RULDNo + "');\"> &nbsp; <input id='btnPrint' type='button' value='Cancel' onclick='ClosePopUp();'>");


                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            // if (i.isMandatory == 1) {
                            MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                            //  totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            // }
                        });
                    }
                    cfi.makeTrans("import_rebuildhandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                        });

                        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id='areaTrans_import_rebuildhandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });

                            cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);
                            $('#spnWaveOff').hide();
                            $(this).find("input[id^='WaveOff']").hide();
                            $('#spnBillTo').hide();

                            $('#Text_BillTo').hide();



                        });
                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            if (MendatoryHandlingCharges.length > 0) {
                                $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                    $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                                });

                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                                //if (MendatoryHandlingCharges.length - 1 == i) {
                                //    $(this).find("div[id^='transActionDiv']").show();
                                //    if (MendatoryHandlingCharges.length > 1)
                                //        $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                                //}

                            }

                        });

                        //$("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        //    $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                        //    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    if (MendatoryHandlingCharges.length - 1 == i) {
                        //        $(this).find("div[id^='transActionDiv']").show();
                        //        if (MendatoryHandlingCharges.length > 1)
                        //            $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                        //    }
                        //});
                    }
                    else {

                        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id='areaTrans_import_rebuildhandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffHeadName", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });
                        });

                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='Type']").text("E");
                            $(this).find("input[id^='WaveOff']").hide();
                            $(this).find("input[id^='BillTo']").hide();
                        });
                    }
                    cfi.AutoComplete("BillToSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");

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

function SetChargeValues(textId, textValue, keyId, keyValue) {
    //var chkCash = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCash]");
    //var chkCredit = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCredit]");

    //if (keyValue == "0") {
    //    MarkSelected(chkCash);
    //    chkCash.attr('disabled', false);
    //} else {
    //    MarkSelected(chkCredit);
    //    chkCash.attr('disabled', true);
    //}
    //CalculateTotalFBLAmount();
}
function GatValueOfAutocomplete(valueId, value, keyId, key) {
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
                url: "Services/Import/DeliveryOrderService.svc/GetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(0) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo,
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                            //if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                            //    $("span[id^='SBasis']").closest("tr").find("td:eq(5)").find("input").css("display", "none");
                            //    $("span[id^='SBasis']").closest("tr").find("td:eq(5)").find("span").css("display", "none");
                            //}
                            //else {
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").text(doItem.SecondaryBasis);
                            //}
                            $("span[id^='Amount']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id^='Remarks']").text(doItem.ChargeRemarks);
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            //if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("input").css("display", "none");
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("span").css("display", "none");
                            //}
                            //else {
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("input").css("display", "");
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("span").css("display", "");
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            //}
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                        }
                    }

                    $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
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
//function GatValueOfAutocomplete(valueId, value, keyId, key) {
//    rowId = valueId.split("_")[2];
//    totalHandlingCharges = 0;
//    totalAmountDO = 0;
//    if (ValidateExistingCharges(valueId, value, keyId, key)) {
//        if (value != "") {
//            if ($("input[id^='Text_HAWB']").length > 0) {
//                var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
//            }
//            else
//                var hawbSNo = 0;
//            $.ajax({
//                url: "Services/Import/TransitMonitoringService.svc/GetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currArrivedShipmentSNo) + "&DestinationCity=" + currentdetination + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo,
//                async: false, type: "GET", dataType: "json",
//                contentType: "application/json; charset=utf-8",
//                success: function (result) {
//                    var resData = jQuery.parseJSON(result);
//                    var doCharges = resData.Table0;
//                    if (doCharges.length > 0) {
//                        var doItem = doCharges[0];
//                        if (rowId == undefined) {
//                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
//                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                            $("span[id^='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                            $("span[id^='SBasis']").text(doItem.SecondryBasis);
//                            $("span[id^='Amount']").text(doItem.ChargeAmount);
//                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
//                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);
//                            $("span[id^='Remarks']").text(doItem.ChargeRemarks);
//                        }
//                        else {
//                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
//                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
//                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
//                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
//                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
//                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
//                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
//                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
//                        }
//                    }

//                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
//                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
//                    });
//                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
//                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
//                },
//                error: function (ex) {
//                    var ex = ex;

//                }
//            });
//        }
//    }
//}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
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

var dourl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
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

function SaveRebuildCharges(FFMFlightMasterSNo, RULDNo) {

    var SaveFlag = true;

    if ($("#BillType").val() == "") {
        ShowMessage('warning', 'Enter Bill Type', " ", "bottom-right");
        $("#BillType").focus();
        SaveFlag = false;
    }
    else if ($("#BillToSNo").val() == "") {
        if ($("#BillType").val() == "0") {
            ShowMessage('warning', 'Enter Agent', " ", "bottom-right");
        } else {
            ShowMessage('warning', 'Enter Airline', " ", "bottom-right");
        }
        $("#BillToSNo").focus();
        SaveFlag = false;
    }

    if (SaveFlag) {
        var flag = false;
        var HandlingChargeArray = [];
        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function () {
            if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                var HandlingChargeViewModel = {
                    SNo: $(this).find("td[id^='tdSNoCol']").html(),
                    AWBSNo: (currentawbsno == "" ? 0 : currentawbsno),
                    WaveOff: 0,
                    TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                    TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                    pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                    sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                    Amount: parseFloat($(this).find("[id^='Amount']").val() == "" ? 0 : $(this).find("[id^='Amount']").val()),
                    TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text(),
                    TotalAmount: $(this).find("[id^='TotalAmount']").text(),
                    Rate: $(this).find("[id^='Amount']").text(),
                    Min: 1,
                    Mode: $("[id^='PaymentMode']").prop('checked') == true ? "CASH" : "CREDIT",
                    //  ChargeTo: $("#Text_BillTo").data("kendoAutoComplete").key(),
                    ChargeTo: $('#BillToSNo').val(),
                    pBasis: $(this).find("[id^='PBasis']").text(),
                    sBasis: $(this).find("[id^='SBasis']").text(),
                    Remarks: $(this).find("[id^='Remarks']").val()
                };
                HandlingChargeArray.push(HandlingChargeViewModel);
            }
        });

        if (HandlingChargeArray.length > 0) {
            $.ajax({
                url: "Services/Import/TransitMonitoringService.svc/SaveRebuildProcess", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ FFMFlightMasterSNo: FFMFlightMasterSNo, ULDNo: RULDNo, AWBSNo: (currentawbsno == "" ? 0 : currentawbsno), DestCity: currentdetination, ChargeType: $('#BillType').val(), lstHandlingCharges: HandlingChargeArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != "") {
                        //InvoiceNo = result;
                        //ShowMessage('success', 'Success - Charge Note', "DO No. [" + curDO + "] -  Processed Successfully", "bottom-right");
                        ShowMessage('success', 'Success - Rebuild Process', "Processed Successfully", "bottom-right");
                        //$("#btnSave").unbind("click");
                        //$(".ui-dialog-buttonset").find("button")[1].disabled = false;
                        flag = true;
                        $("#divDetail2").data("kendoWindow").close();

                        TransitMonitoringSearch();
                    }
                    else
                        ShowMessage('warning', 'Warning', "Please correct value(s) for :- " + result + ".", "bottom-right");
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Rebuild Process', "unable to process.", "bottom-right");
                }
            });
        }
        else {
            alert("Select Charges First");
        }
        return flag;
    }
}

function ClosePopUp() { }

function ULDAppendProcess(dbTableName, transSNO) {
    var dbCaption = '';
    var columnsValue = '';
    var tableColumnsValue = '';
    if ($("#tbl" + dbTableName).length === 0)
        $("#divAfterContent").html("<table id='tbl" + dbTableName + "'></table>");
    if (dbTableName == 'FAULDLocation') {
        dbCaption = 'ULD Location';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,ULDNo,BUP,MovableLocation,Location',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: dbCaption,
            initRows: 1,
            columns: [
               { name: 'SNo', type: 'hidden', value: 0 },
               { name: 'FFMFlightMasterSNo', type: 'hidden' },
               { name: 'FFMShipmentTransSNo', type: 'hidden' },
             { name: 'ULDNo', type: 'hidden' },
               { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
               { name: 'BUP', type: 'hidden' },
               { name: 'BUP', display: 'BUP', type: 'label' },
               { name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckULDMovableLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, tableName: 'vInboundMovableLocation', textColumn: 'ConsumablesName', keyColumn: 'SNo' },
               { name: 'Location', display: 'Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'vAssignLocation', isRequired: true, textColumn: 'LocationName', keyColumn: 'SNo' }
                //{ name: 'Airline', display: 'Select Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'Airline', textColumn: 'AirlineName', keyColumn: 'SNo' }
            ],
            rowUpdateExtraFunction: function (id) {
                $("input[id^=tblFAULDLocation_ULDNo]").each(function () {
                    $(this).closest("table").find("td").removeClass("ui-widget-content");

                    $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
                    if ($(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() == "" && $(this).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() == "") {
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").attr("required", "required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").attr("required", "required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
                    }

                    if ($(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() == "" && $(this).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() != "") {
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").removeAttr("required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").removeAttr("required").css("cursor", "auto");
                    }
                });
            },
            hideButtons: { updateAll: false, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
    }
    else if (dbTableName == 'ULDXray') {
        dbCaption = 'X-ray';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,StartPieces,EndPieces',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'GetULDXrayRecord',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdateULDXray',
            deleteServiceMethod: 'deleteULDXray',
            caption: dbCaption,
            initRows: 1,
            columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'ULDNo', type: 'hidden' },
            { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
            { name: 'Pieces', display: 'Total Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
            { name: 'GrossWT', display: 'Total Gr. WT', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal2" }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'VolumeWT', display: 'Total Vol. WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true }
            ],
            hideButtons: { updateAll: false, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
    }
    else if (dbTableName == 'ReBuild') {
        //dbCaption = 'Service Charges Information';
        //$('#tbl' + dbTableName).appendGrid({
        //    tableID: 'tbl' + dbTableName,
        //    contentEditable: true,
        //    tableColumns: 'SNo,AWBNo,StartPieces,EndPieces',
        //    masterTableSNo: transSNO,
        //    currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        //    servicePath: './Services/Import/TransitMonitoringService.svc',
        //    getRecordServiceMethod: 'GetReBuildRecord',
        //    isGetRecord: true,
        //    createUpdateServiceMethod: 'createUpdateReBuild',
        //    deleteServiceMethod: 'deleteReBuild',
        //    caption: dbCaption,
        //    initRows: 1,
        //    columns: [
        //    { name: 'SNo', type: 'hidden', value: 0 },
        //    { name: 'ServiceName', display: 'Service Name', type: 'text', ctrlCss: { 'text-transform': 'uppercase', width: '120px' }, ctrlAttr: { maxlength: 10, Controltype: 'alphanumericupper' }, isRequired: true },
        //    { name: 'PrimaryValue', display: 'Primary Value', type: 'text', ctrlCss: { 'text-transform': 'uppercase', width: '120px' }, ctrlAttr: { maxlength: 10, Controltype: 'alphanumericupper' }, isRequired: true },
        //    { name: 'SecondaryValue', display: 'Secondary Value', type: 'text', ctrlCss: { 'text-transform': 'uppercase', width: '120px' }, ctrlAttr: { maxlength: 10, Controltype: 'alphanumericupper' }, isRequired: true },
        //    ],
        //    hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: true },
        //    isPaging: true
        //});
    }
    else {
        dbCaption = '';
        tableColumnsValue = '';
        columnsValue = '';
    }

    cfi.PopUp("tbl" + dbTableName, dbCaption, 800, null, null, 100);
    if ($("#tblReBuildRecord").length === 0) {
        $("#tblReBuild").before("<div><table id='tblReBuildRecord' style='width:100%;'><tr><td colspan='5' class='formSection'>Re-Build</<td></tr><tr><td >ULD No: <span style='font-weight:bold;'>AKE12345PC</span></td><td>Total Pieces: <span style='font-weight:bold;'>5</span></td><td>Total Gr. WT: <span style='font-weight:bold;'>5</span></td></td><td>Total Vol. WT: <span style='font-weight:bold;'>5</span></td></td></tr></table></div>");
    }
}

//------------- AWB Locaton -------------------//
function GetAWBULDLocation(awbSNo, obj) {
    var arvShipmentSNo = $(obj).closest("tr").find("td:eq(5)").text();
    var dbAwbTableName = 'AwbULDLocation';
    if (arvShipmentSNo == '0' || awbSNo == '0') {
        ShowMessage('warning', 'Warning - ULD Location', "Shipment not arrived.");
        return;
    }
    AWBAppendProcess(dbAwbTableName, arvShipmentSNo, awbSNo);
    //GetTempreatureControlled();
    $("#tblAwbULDLocation_AssignLocation_1").focus();
    if ($('#tblAwbULDLocation tr').index() == 1)
        $("#tblAwbULDLocation_btnRemoveLast").hide();
    else
        $("#tblAwbULDLocation_btnRemoveLast").show();



}

//------------- AWB XRay process -------------------//
function GetAWBXray(awbSNo, obj) {

    var dbAwbTableName = 'AWBXray';


    AWBXrayAppendProcess(dbAwbTableName, awbSNo, obj);
}

function GetTerminate(awbSNo, obj) {
    var dbTableName = 'Terminate';
    AWBAppendTerminate(dbTableName, 0, awbSNo, obj);
}
function GetPlaning(awbSNo, obj) {
    var dbTableName = 'Planing';
    ///AWBAppendPlaning(dbTableName, 0, awbSNo);
}


function AWBAppendPlaning(dbAwbTableName, arrivedShipmentSNo, awbSNo) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    $("#tbl" + dbAwbTableName).remove();
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    }

    dbAWBCaption = 'Planing';
    $('#tbl' + dbAwbTableName).appendGrid({
        tableID: 'tbl' + dbAwbTableName,
        contentEditable: true,
        tableColumns: 'SNo,AWBNo,Origin,Destination,Routing,Pieces,GrossWT,VolumeWT,FlightNo,FlightDate,ConnFlightNo,ConnFlightDate,TerminateAt',
        masterTableSNo: awbSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Import/TransitMonitoringService.svc',
        getRecordServiceMethod: 'GetPlanningRecord',
        isGetRecord: true,
        createUpdateServiceMethod: 'createUpdatePlanning',
        deleteServiceMethod: 'deletePlanning',
        caption: dbAWBCaption,
        initRows: 1,
        columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AWBNo', type: 'hidden' },
                { name: 'AWBNo', display: 'AWB No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                { name: 'Destination', display: 'Destination', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                { name: 'FlightDate', display: 'FlightDate', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                //{ name: 'ConnFlightNo', display: 'ConnFlightNo', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },

        ],
        hideButtons: { updateAll: false, append: true, insert: true, remove: true, removeLast: true },
        isPaging: true
    });

    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, 1200, null, null, 100);
}


function saveTerminate() {

    var AWBSno = $('#tblTerminate_HdnAWBNo').val();
    var destSno = userContext.CitySNo;


    var SaveFlag = true;

    if ($("#TerminateBillType").val() == "") {
        ShowMessage('warning', 'Enter Bill Type', " ", "bottom-right");
        $("#TerminateBillType").focus();
        SaveFlag = false;
    }
    else if ($("#TerminateBillToSNo").val() == "" && $("#TerminateBillType").val() == "1") {
        ShowMessage('warning', 'Enter Bill To', " ", "bottom-right");
        $("#TerminateBillToSNo").focus();
        SaveFlag = false;
    }

    if (SaveFlag) {
        var flag = false;
        var HandlingChargeArray = [];
        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function () {
            if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                var HandlingChargeViewModel = {
                    SNo: $(this).find("td[id^='tdSNoCol']").html(),
                    AWBSNo: currentawbsno,
                    WaveOff: 0,
                    TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                    TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                    pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                    sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                    Amount: parseFloat($(this).find("[id^='Amount']").val() == "" ? 0 : $(this).find("[id^='Amount']").val()),
                    TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text(),
                    TotalAmount: $(this).find("[id^='TotalAmount']").text(),
                    Rate: $(this).find("[id^='Amount']").text(),
                    Min: 1,
                    Mode: $("[id^='CustomerType']").prop('checked') == true ? "CASH" : "CREDIT",
                    //  ChargeTo: $("#Text_BillTo").data("kendoAutoComplete").key(),
                    ChargeTo: $("#TerminateBillToSNo").val(),
                    pBasis: $(this).find("[id^='PBasis']").text(),
                    sBasis: $(this).find("[id^='SBasis']").text(),
                    Remarks: $(this).find("[id^='Remarks']").val()
                };
                HandlingChargeArray.push(HandlingChargeViewModel);
            }
        });

        if (HandlingChargeArray.length > 0) {
            $.ajax({
                url: "Services/Import/TransitMonitoringService.svc/saveTerminate", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AWBSno: parseInt(AWBSno), destSno: parseInt(destSno), ChargeType: $("#TerminateBillType").val(), lstHandlingCharges: HandlingChargeArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != "") {
                        //InvoiceNo = result;
                        //ShowMessage('success', 'Success - Charge Note', "DO No. [" + curDO + "] -  Processed Successfully", "bottom-right");
                        ShowMessage('success', 'Success - Rebuild Process', "Processed Successfully", "bottom-right");
                        //$("#btnSave").unbind("click");
                        //$(".ui-dialog-buttonset").find("button")[1].disabled = false;
                        flag = true;
                        $("#tblTerminate").data("kendoWindow").close();
                        TransitMonitoringSearch();
                    }
                    else
                        ShowMessage('warning', 'Warning', "Please correct value(s) for :- " + result + ".", "bottom-right");
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Rebuild Process', "unable to process.", "bottom-right");
                }
            });
        }
        else {
            alert("Select Charges First");
        }
        return flag;
    }
}

function AWBAppendTerminate(dbAwbTableName, arrivedShipmentSNo, awbSNo, obj) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    $("#tbl" + dbAwbTableName).remove();
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table width='100%' id='tbl" + dbAwbTableName + "'></table>");
    }

    //  $("#tbl" + dbAwbTableName).html("<table id='tblTerminate' class='appendGrid ui-widget k-window-content k-content' data-role='window' style='min-width: 90px; min-height: 50px; max-height: 500px;'>");
    var strdata = "<thead class='ui-widget-header'><tr>";
    //$("#tbl" + dbAwbTableName).html("<thead class='ui-widget-header'><tr>");
    strdata = strdata + "<td class='formSection' colspan='7'>Terminate</td></tr><tr><td class='ui-widget-header'></td><td class='ui-widget-header'>AWB No</td>";
    strdata = strdata + "<td class='ui-widget-header'>Origin<font color='red'>*</font></td><td class='ui-widget-header'>Destination<font color='red'>*</font></td><td class='ui-widget-header'>Terminate At</td><td class='ui-widget-header'>Bill Type<font color='red'>*</font></td><td class='ui-widget-header'>Bill To<font color='red'  id='spnbillto'>*</font></tr></thead>";
    strdata = strdata + "<tbody class='ui-widget-content'><tr id='tblTerminate_Row'><td class='ui-widget-content first'>1</td><td class='ui-widget-content' colspan='1'><input id='tblTerminate_HdnAWBNo' name='tblTerminate_HdnAWBNo' type='hidden' value=" + $(obj).closest("tr").find("td[data-column='AWBSNo']").text() + "><label id='tblTerminate_AWBNo'>" + $(obj).closest("tr").find("td[data-column='AWBNo']").text() + "</label></td><td class='ui-widget-content' colspan='1'><input id='tblTerminate_HdnOrigin' name='tblTerminate_HdnOrigin' type='hidden' value=''><label id='tblTerminate_Origin'>" + $(obj).closest("tr").find("td[data-column='ShipmentOriginAirportCode']").text() + "</label></td><td class='ui-widget-content' colspan='1'><input id='tblTerminate_HdnDestination' name='tblTerminate_HdnDestination' type='hidden' value=''><label id='tblTerminate_Destination'>" + $(obj).closest("tr").find("td[data-column='ShipmentDestinationAirportCode']").text() + "</label></td><td class='ui-widget-content' colspan='1'><input id='tblTerminate_HdnTerminate' name='tblTerminate_HdnTerminate' type='hidden' value=" + userContext.CitySNo + "><label id='tblTerminate_Terminate'>" + userContext.CityCode + "</label></td><td> <input type='hidden' name='TerminateBillType' id='TerminateBillType' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_TerminateBillType' id='Text_TerminateBillType' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td><input type='hidden' name='TerminateBillToSNo' id='TerminateBillToSNo' value=''><span class='k-widget k-combobox k-header' style='display: inline-block;'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_TerminateBillToSNo' id='Text_TerminateBillToSNo' style='width: 100%; text-transform: uppercase;' tabindex='6' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Bill To.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr></tbody>";
    strdata = strdata + "<tfoot><tr><td colspan='7'><div id='tblTerminate_divStatusMsg' style='float: right;'><input name='operation' class='btn btn-success' type='submit' value='Terminate' onclick='saveTerminate();'></td></tr></tfoot><tr><td id=\"tdcharge\" class='formSection' colspan='7'></td></tr>";


    dbAWBCaption = 'Terminate';


    $.ajax({
        url: "Services/Import/TransitMonitoringService.svc/GetWebForm/TransitMonitoring/Import/ChargeNote/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail2").html('');
            $("#tbl" + dbAwbTableName).html(strdata);
            //$("#tbl" + dbAwbTableName).append(result);
            //$("#tbl" + dbAwbTableName).append("</\td></\tr>");
            $("#tdcharge").append(result);

            cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, 1000, null, null, 100);
            $.ajax({
                url: "Services/Import/TransitMonitoringService.svc/GetGetAmandmentChargesForTerminate?AWBSNO=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var sDetail = resData.Table0;
                    var hcData = resData.Table1;
                    currentawbsno = sDetail[0].AWBSNo;
                    currentdetination = sDetail[0].DestinationCity;
                    currArrivedShipmentSNo = sDetail[0].ArrivedShipmentSNo;
                    //$("#tbl" + dbAwbTableName).append("</br><input id='btnPrint' type='button' value='Save' onclick=\"SaveRebuildCharges(" + FFMFlightMasterSNo + ",'" + RULDNo + "');\"> &nbsp; <input id='btnPrint' type='button' value='Cancel' onclick='ClosePopUp();'>");


                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            // if (i.isMandatory == 1) {
                            MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                            //  totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            // }
                        });
                    }
                    cfi.makeTrans("import_rebuildhandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                        });

                        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id='areaTrans_import_rebuildhandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });

                            cfi.AutoCompleteByDataSource("TerminateBillType", billto, onTerminateBillToSelect, null);
                            $('#spnWaveOff').hide();
                            $(this).find("input[id^='WaveOff']").hide();
                            $('#spnBillTo').hide();

                            $('#Text_BillTo').hide();



                        });


                        //$("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        //    $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                        //    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    if (MendatoryHandlingCharges.length - 1 == i) {
                        //        $(this).find("div[id^='transActionDiv']").show();
                        //        if (MendatoryHandlingCharges.length > 1)
                        //            $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                        //    }
                        //});
                    }
                    else {

                        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id='areaTrans_import_rebuildhandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffHeadName", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });
                        });

                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='Type']").text("E");
                            $(this).find("input[id^='WaveOff']").hide();
                            $(this).find("input[id^='BillTo']").hide();
                        });
                    }
                    cfi.AutoComplete("TerminateBillToSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");


                    $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                        if (MendatoryHandlingCharges.length > 0) {
                            $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                            $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                            });

                            $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                            $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");

                        }

                    });
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

function CheckMovableLocation(obj) {
    if ($(obj).val() != "") {
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val("0");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").focus();
    }
}

// AWB Locaton and Damage process
function AWBAppendProcess(dbAwbTableName, arrivedShipmentSNo, awbSNo) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    $("#tbl" + dbAwbTableName).remove();
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    }
    //var newDataSource;
    if (dbAwbTableName == 'AwbULDLocation') {
        dbAWBCaption = 'AWB Location';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,StartPieces,EndPieces,AssignLocation,TempControlled,StartTemperature,EndTemperature',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
            deleteServiceMethod: 'delete' + dbAwbTableName,
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: false },
            columns: [
               { name: 'SNo', type: 'hidden', value: 0 },
               { name: 'AWBSNo', type: 'hidden' },
               { name: 'ArrivedShipmentSNo', type: 'hidden' },
               { name: 'SPHC', type: 'hidden' },
               { name: 'HdnAWBNo', type: 'hidden' },
               { name: 'HdnRcvdPieces', type: 'hidden' },
               { name: 'HdnRcvdGrossWeight', type: 'hidden' },
               { name: 'AWBNo', display: 'AWB No', type: 'label' },
               //{ name: 'HAWB', display: 'HAWB No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'ImportHAWB', textColumn: 'HAWBNo', keyColumn: 'SNo' },
               { name: 'RcvdPieces', display: 'Rcvd Pieces', type: 'label' },
               { name: 'RcvdGrossWeight', display: 'Rcvd Gr.WT', type: 'label' },
               { name: 'StartPieces', display: 'Start Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '100px' }, isRequired: true },
               { name: 'EndPieces', display: 'End Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '100px' }, isRequired: true },
               {
                   name: 'TempControlled', display: 'Temp Controlled', type: 'text', value: "1", type: 'select', onChange: function (evt, rowIndex) {
                       var ind = evt.target.id.split('_')[2];
                       if ($("#" + evt.target.id + " option:checked").val() == 1) {
                           $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                           $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                           $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                           $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                           $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                           $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                       } else {
                           $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                           $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
                           $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                           $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                           $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
                           $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
                       }

                   }, ctrlOptions: { '0': 'Yes', '1': 'No' }, ctrlCss: { width: '50px', height: '20px' }
               },

               { divRowNo: 1, name: 'StartTemperature', display: 'Start Temp.', type: 'text', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true },
               {
                   divRowNo: 1, name: 'EndTemperature', display: 'End Temp.', type: 'text', ctrlAttr: {
                       controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)"
                   }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
               },
               { name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, tableName: 'vInboundMovableLocation', textColumn: 'ConsumablesName', keyColumn: 'SNo' },
               { name: 'AssignLocation', display: 'Assign Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckAssignLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'vAssignLocation', textColumn: 'LocationName', keyColumn: 'SNo' }

            ], rowUpdateExtraFunction: function (id) {
                var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
                $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];
                    $("#tblAwbULDLocation_StartTemperature_" + ind).closest("table").find("td").removeClass("ui-widget-content");
                    if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    } else {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_StartTemperature_" + ind).val());
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_EndTemperature_" + ind).val());
                    }

                    if (rowAWBULDCount == 1) {
                        $("#tblAwbULDLocation_StartPieces_" + ind).removeAttr("disabled").css("cursor", "auto");
                        $("#tblAwbULDLocation_EndPieces_" + ind).removeAttr("disabled").css("cursor", "auto");
                    }
                    else {

                        $("#tblAwbULDLocation_StartPieces_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_EndPieces_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                    }

                    $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
                        $(this).closest("table").find("td").removeClass("ui-widget-content");

                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                        }

                        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
                        }
                    });
                });
            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {

            }

        });
    }


    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, 1180, null, null, 10);
    $("#tbl" + dbAwbTableName).parent("div").css("position", "fixed");


}


// AWB Locaton and Damage process
function AWBXrayAppendProcess(dbAwbTableName, awbSNo, obj) {
    var arrivedShipmentSNo = $(obj).closest("tr").find("td:eq(5)").text();
    var AWBno = $(obj).closest("tr").find("td:eq(9)").text();
    if (arrivedShipmentSNo == '0' || awbSNo == '0') {
        ShowMessage('warning', 'Warning - ULD Location', "Shipment not arrived.");
        return;
    }
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    $("#tbl" + dbAwbTableName).remove();
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    }
    //var newDataSource;

    if (dbAwbTableName == 'AWBXray') {
        dbAWBCaption = 'AWB Xray';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,StartPieces,EndPieces,AssignLocation,TempControlled,StartTemperature,EndTemperature',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
            deleteServiceMethod: 'delete' + dbAwbTableName,
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: false },
            columns: [
               { name: 'SNo', type: 'hidden', value: 0 },
               { name: 'AWBSNo', type: 'hidden', value: awbSNo },
               { name: 'ArrivedShipmentSNo', type: 'hidden', value: arrivedShipmentSNo },
               { name: 'SPHC', type: 'hidden' },
               { name: 'HdnAWBNo', type: 'hidden', value: '0' },
               { name: 'HdnRcvdPieces', type: 'hidden', value: '0' },
               { name: 'HdnRcvdGrossWeight', type: 'hidden', value: '0' },
               { name: 'AWBNo', display: 'AWB No', type: 'label', value: AWBno },

               { name: 'StartPieces', display: 'Start Pieces', value: 'StartPieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '100px' }, isRequired: true },
               { name: 'EndPieces', display: 'End Pieces', type: 'text', value: 'EndPieces', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '100px' }, isRequired: true }
            ],
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
            }
        });
    }

    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, 1180, null, null, 10);
    $("#tbl" + dbAwbTableName).parent("div").css("position", "fixed");


}
function createUpdateRecord(uRows, settings, isSingleRow, obj) {
    try {

        if (!isSingleRow) {
            $("tr[id^='" + settings.tableID + "']").each(function () {
                uRows.push($(this).attr("id").split('_')[2])
            });
        } else {
            uRows.push($(obj).attr("id").split('_')[2])
        }
        if ($.isArray(uRows)) {
            uRows.sort();
            uRows = uRows.filter(function (itm, i, a) {
                return i == a.indexOf(itm);
            });
        }

        if (validateTableData(settings.tableID, uRows)) {
            var strData = tableToJSON(settings.tableID, settings.columns, uRows);

            if (strData == '[]') {
                ShowMessage('success', '', 'Record Updated Successfully.');
            }
            else {
                $.ajax({
                    type: "POST",
                    url: settings.servicePath + "/" + settings.createUpdateServiceMethod + "?strData=" + strData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processData: true,
                    success: function (result) {
                        if (result != undefined) {
                            if (result[0].m_Item1 != undefined) {
                                if (result[0].m_Item2 == 0) {
                                    ShowMessage('warning', '', result[0].m_Item1);
                                    return;
                                } else {
                                    AjaxSucceeded(result[0].m_Item1.replace('<value>', '').replace('</value>', ''));
                                }
                            }
                            else if (!isEmpty(result[0]) != '') {
                                AjaxSucceeded(result[0].replace('<value>', '').replace('</value>', ''));
                            }
                            settings.isDataLoad = false;
                            if (settings.currentPage == 1) {
                                getRecord(settings.tableID);
                            }
                            else {
                                showPage(settings.currentPage, settings);
                            }
                        } else {
                            ShowMessage('error', '', "Server error.");
                        }
                    }
                });
            }
        }
        if (settings.isPageRefresh)
            location.reload();
    }
    catch (e) { }

    $("#tblAwbULDLocation").data("kendoWindow").close();
    TransitMonitoringSearch();
}
function GetTempreatureControlled() {
    $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
        var ind = this.id.split('_')[2];
        $("#tblAwbULDLocation_AWBNo_" + ind).text($("#tblAwbULDLocation_AWBNo_1").text());
        $("#tblAwbULDLocation_RcvdPieces_" + ind).text($("#tblAwbULDLocation_RcvdPieces_1").text());
        $("#tblAwbULDLocation_RcvdGrossWeight_" + ind).text($("#tblAwbULDLocation_RcvdGrossWeight_1").text());
        $("#tblAwbULDLocation_ArrivedShipmentSNo_" + ind).val($("#tblAwbULDLocation_ArrivedShipmentSNo_1").val());
        $("#tblAwbULDLocation_AWBSNo_" + ind).val($("#tblAwbULDLocation_AWBSNo_1").val());

        $("#tblAwbULDLocation_HdnAWBNo_" + ind).val($("#tblAwbULDLocation_AWBNo_1").text());
        $("#tblAwbULDLocation_HdnRcvdPieces_" + ind).val($("#tblAwbULDLocation_RcvdPieces_1").text());
        $("#tblAwbULDLocation_HdnRcvdGrossWeight_" + ind).val($("#tblAwbULDLocation_RcvdGrossWeight_1").text());

        if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
        }
        else {
            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
        }
    });
}

function CheckFAStartEndPieces(obj) {
    var cValue = $(obj).val();
    var startPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val());
    var endPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val());

    if (startPieces > endPieces) {
        $(obj).val('');
        ShowMessage("warning", "", "Start Pieces can not be greater than End Pieces");
    }
}

function CheckFATempratureStartEnd(obj) {
    var startVal = parseInt($(obj).closest("table").find("input[id^='tblAwbULDLocation_StartTemperature']").val());
    var endVal = parseInt($(obj).closest("table").find("input[id^='tblAwbULDLocation_EndTemperature']").val());
    if (startVal > endVal) {
        $(obj).val('');
        ShowMessage("warning", "", "End temperature should be greater than start temperature.");
    }
}




function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    var filterEmbargo1 = cfi.getFilter("OR");
    var filterEmbargo2 = cfi.getFilter("in");

    //if (textId == "Text_searchFlightNo") {
    //    try {
    //        cfi.setFilter(filterEmbargo, "DestinationAirport", "eq", userContext.CityCode)
    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //        return OriginCityAutoCompleteFilter2;
    //    }
    //    catch (exp) { }
    //}

    if (textId == "tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "SHCSNo", "in", ($("#tblAwbULDLocation_SPHC_" + textId.split('_')[2]).val() == "" ? "0" : $("#tblAwbULDLocation_SPHC_" + textId.split('_')[2]).val()));
            cfi.setFilter(filterEmbargo, "CityCode", "eq", userContext.CityCode);
            if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == 0 && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() != "") {
                cfi.setFilter(filterEmbargo, "StartTemperature", "gte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filterEmbargo, "EndTemperature", "lte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
            }
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
    if (textId == "tblFAULDLocation_Location_1") {
        try {
            if (IsThroughULD == 0 && IsBUP == 0) {
                cfi.setFilter(filterEmbargo, "LocationTypeSNo", "eq", 6);
                var FAULDLocationAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return FAULDLocationAutoCompleteFilter;
            }
            else {
                cfi.setFilter(filterEmbargo, "LocationTypeSNo", "eq", 2);
                var FAULDLocationAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return FAULDLocationAutoCompleteFilter;
            }
        }
        catch (exp) { }
    }

    if (textId == "Text_BillToSNo") {

    }

}

//-------------- Div content for Transit Monitoring --------------------------//
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divTransitMonitoringDetails' style='width:100%'></div><div id='divDetail2'></div></td></tr></table></div>";
