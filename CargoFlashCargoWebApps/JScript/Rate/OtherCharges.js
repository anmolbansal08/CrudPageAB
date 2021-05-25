$(document).ready(function () {
   // $("table thead th:eq(11)").find('.k-link').text('Reference No')// change grid column
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $('#MasterSaveAndNew').hide();
        cfi.ValidateForm();
        $("#IsTaxable").after('Taxable');
        $("#IsCommissionable").after('Commissionable');
        BindAutoComplete();
        if (getQueryStringValue("FormAction").toUpperCase() != "DUPLICATE") {
            $("#Text_AllotmentSNo").closest("span").hide();
            $("#Text_OriginType").val("AIRPORT");
            $("#Text_DestinationType").val("AIRPORT");
            $("#OriginType").val("1");
            $("#DestinationType").val("1");
            var todaydate = new Date();
            var validfromdate = $("#ValidFrom").data("kendoDatePicker");
            validfromdate.min(todaydate);
            var validTodate = $("#ValidTo").data("kendoDatePicker");
            validTodate.min(todaydate);
            //  --------------by default checked otherchargesmandatiry--------
            $("#IsOtherChargeMandatory").attr('checked', true);
            //----------------------------------------------------------
        }

        if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            bindRecords();
        }
        $("#ValidFrom").attr('readonly', true);
        $("#ValidTo").attr('readonly', true);

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
           $('[name="IsReplanCharges"][value="1"]').attr('checked', true)
            CreateRemarks();
            CreateRateParamGrid();
            $("#divRateBase").hide();
            for (var i = 0; i < $('input[type="checkbox"][name="Days"]').length; i++) {
                $('input[type="checkbox"][name="Days"][value="' + i + '"]').attr("checked", true);
            }
            $("[name='IEDays'][value='1']").attr('checked', true);
        }
        $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
            $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");
            $(tr).find("input[id^='tblRateBase_Rate_']").val("");
            $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
            $(tr).find("input[id^='tblRateBase_Based_']").val("");
        });

    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#IsTaxable").after('Taxable');
        $("#IsCommissionable").after('Commissionable');
        cfi.ValidateForm();
        BindAutoComplete();
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            bindRecords();
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() != "NEW" && getQueryStringValue("FormAction").toUpperCase()!="INDEXVIEW") {
        GetRecord();
    }
    $('input[type=radio][data-radioval=DueCarrier]').parent().contents()[2].data = "DueCarrier";
    $('input[type=radio][data-radioval=DueCarrier]').parent().contents()[4].data = "DueAgent";
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        if ($('#Text_OCCodeSNo').val().split('-')[1] == "REPLAN CHARGES") {
            $('input[id="IsReplanCharges"][value="0"]').attr("checked", true);
            $('input[id="IsReplanCharges"][value="1"]').attr("disabled", 'disabled');
        }
    }
});

function ExporttoExcel() {
    $('.k-toolbar').append('dfgd');
}

function BindAutoComplete() {
    // Changes by Vipin Kumar
    //cfi.AutoComplete("AirlineSNo", "AirlineName", "vwAirlineCurrencyDetails", "SNo", "AirlineName");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "OtherCharges_Airline", null, "contains");
    //cfi.AutoComplete("OCCodeSNo", "Code,Name", "vwDueCarrierDetails", "SNo", "Name", ["Code", "Name"], onChangeOtherCharges, "contains");
    cfi.AutoCompleteV2("OCCodeSNo", "Code,Name", "OtherCharges_OCCode", onChangeOtherCharges, "contains");
    // Ends
    cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
    cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
    // Changes by Vipin Kumar
    //cfi.AutoComplete("OriginSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectOrigin, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode", "OtherCharges_Airport", OnSelectOrigin, "contains");
    //cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectDestination, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode", "OtherCharges_Airport", OnSelectDestination, "contains");
    // Ends
    cfi.AutoCompleteByDataSource("Active", Active, null, null);
    cfi.AutoCompleteByDataSource("PaymentType", PaymentType, null, null);
    cfi.AutoCompleteByDataSource("ChargeType", ChargeType, onchangeChargeType);
    cfi.AutoCompleteByDataSource("ChargeApply", ChargeApplyOn, null, null);
    // Changes by Vipin Kumar
    //cfi.AutoComplete("CurrencySNo", "CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode", "OtherCharges_Currency", null, "contains");
    //Ends
}

function GetRecord()
{
if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    CreateRemarks();
    $("#divRateBase").hide();
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        var charges = $("#ChargeType").val().toUpperCase()
        if (charges == "PER PIECE" || charges == "CHARGEABLE WEIGHT" || charges == "GROSS WEIGHT") {
            CreateSlabGrid();
            $("#divRateBase").show();

            $("[id*='tblRateBase_RateClassSNo_']").each(function () {
                if ($("#" + this.id).text() == "0")
                    $("#" + this.id).text('M')
                else if ($("#" + this.id).text() == "1")
                    $("#" + this.id).text('N')
                else if ($("#" + this.id).text() == "2")
                    $("#" + this.id).text('Q')
            });
        }
        else
            if (userContext.SysSetting.FlateChargesOnSlabRateApply == "TRUE") {
                CreateSlabGrid();
                $("#divRateBase").show();

                $("[id*='tblRateBase_RateClassSNo_']").each(function () {
                    if ($("#" + this.id).text() == "0")
                        $("#" + this.id).text('M')
                    else if ($("#" + this.id).text() == "1")
                        $("#" + this.id).text('N')
                    else if ($("#" + this.id).text() == "2")
                        $("#" + this.id).text('Q')
                });
            }
            else {
                $("#divRateBase").hide();
            }
    }
    var ChargeType = $("#ChargeType").val();
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        var tempMinimum = $('#_tempMinimum');
        var Minimum = $('#Minimum');
        var tempCharge = $('#_tempChargeText');
        var Charge = $('#ChargeText');
        Minimum.attr('data-valid', 'required');
        Charge.attr('data-valid', 'required');
        if (ChargeType == 0) {
            if (userContext.SysSetting.FlateChargesOnSlabRateApply == "TRUE") {
                Minimum.attr('disabled', true);
                tempMinimum.attr('disabled', true);
                Charge.attr('disabled', true);
                tempCharge.attr('disabled', true);
                CreateSlabGrid();
                $("#divRateBase").show();
                var minRow = $("#tblRateBase tbody tr").first().closest('tr').attr('id').split('_')[2]
                $("[id=tblRateBase_RateClassSNo_1] option[value='1']").hide();
                $('[name*= "tblRateBase_RateClassSNo_"][id!="tblRateBase_RateClassSNo_1" ] option[value="0"]').hide();
            }
            else {
                tempMinimum.attr('disabled', true);
                Minimum.attr('disabled', true);
                tempCharge.attr('disabled', false);
                Charge.attr('disabled', false);
                Minimum.removeAttr('data-valid');
                Charge.attr('data-valid', 'required');
                $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
                $("#divRateBase").hide();
            }
        }
        else if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
            Minimum.attr('disabled', true);
            tempMinimum.attr('disabled', true);
            Charge.attr('disabled', true);
            tempCharge.attr('disabled', true);
            CreateSlabGrid();
            $("#divRateBase").show();
            var minRow = $("#tblRateBase tbody tr").first().closest('tr').attr('id').split('_')[2]
            $("[id=tblRateBase_RateClassSNo_1] option[value='1']").hide();
            $('[name*= "tblRateBase_RateClassSNo_"][id!="tblRateBase_RateClassSNo_1" ] option[value="0"]').hide();

            //arman


        }
        else {
            Minimum.attr('disabled', false);
            tempMinimum.attr('disabled', false);
            Charge.attr('disabled', false);
            tempCharge.attr('disabled', false);
            $('td[title="Enter Minimum Value"]').html("<span style = 'color:red'>*</span> Minimum Value");
            $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
            Minimum.attr('data-valid', 'required');
            Charge.attr('data-valid', 'required');
            $("#divRateBase").hide();
        }

        if ($('input[type="radio"][name="Charge"]:checked').val() == "1") {
            $("#spnOCCodeSNo").text(' Due Carrier Charges');
        }
        else { $("#spnOCCodeSNo").text(' Due Agent Charges'); }
    }
}
//if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//    CreateRemarks();
//    $("#divRateBase").hide();
//    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//        var charges = $("#ChargeType").val().toUpperCase()
//        if (charges == "PER PIECE" || charges == "CHARGEABLE WEIGHT" || charges == "GROSS WEIGHT") {
//            CreateSlabGrid();
//            $("#divRateBase").show();

//            $("[id*='tblRateBase_RateClassSNo_']").each(function () {
//                if ($("#" + this.id).text() == "0")
//                    $("#" + this.id).text('M')
//                else if ($("#" + this.id).text() == "1")
//                    $("#" + this.id).text('N')
//                else if ($("#" + this.id).text() == "2")
//                    $("#" + this.id).text('Q')
//            });
//        }
//        else
//            $("#divRateBase").hide();
//    }
//    var ChargeType = $("#ChargeType").val();
//    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//        var tempMinimum = $('#_tempMinimum');
//        var Minimum = $('#Minimum');
//        var tempCharge = $('#_tempChargeText');
//        var Charge = $('#ChargeText');
//        Minimum.attr('data-valid', 'required');
//        Charge.attr('data-valid', 'required');
//        if (ChargeType == 0) {
//            tempMinimum.attr('disabled', true);
//            Minimum.attr('disabled', true);
//            tempCharge.attr('disabled', false);
//            Charge.attr('disabled', false);
//            Minimum.removeAttr('data-valid');
//            Charge.attr('data-valid', 'required');
//            $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
//            $("#divRateBase").hide();
//        }
//        else if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
//            Minimum.attr('disabled', true);
//            tempMinimum.attr('disabled', true);
//            Charge.attr('disabled', true);
//            tempCharge.attr('disabled', true);
//            CreateSlabGrid();
//            $("#divRateBase").show();
//            var minRow = $("#tblRateBase tbody tr").first().closest('tr').attr('id').split('_')[2]
//            $("[id=tblRateBase_RateClassSNo_1] option[value='1']").hide();
//            $('[name*= "tblRateBase_RateClassSNo_"][id!="tblRateBase_RateClassSNo_1" ] option[value="0"]').hide();

//            //arman


//        }
//        else {
//            Minimum.attr('disabled', false);
//            tempMinimum.attr('disabled', false);
//            Charge.attr('disabled', false);
//            tempCharge.attr('disabled', false);
//            $('td[title="Enter Minimum Value"]').html("<span style = 'color:red'>*</span> Minimum Value");
//            $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
//            Minimum.attr('data-valid', 'required');
//            Charge.attr('data-valid', 'required');
//            $("#divRateBase").hide();
//        }

//        if ($('input[type="radio"][name="Charge"]:checked').val() == "1") {
//            $("#spnOCCodeSNo").text(' Due Carrier Charges');
//        }
//        else { $("#spnOCCodeSNo").text(' Due Agent Charges'); }
//    }

    function onChangeOtherCharges() {
        if ($("#OCCodeSNo").val() != "") {
            if ($("#OCCodeSNo").val().split('-')[1] == '1' || $('#Text_OCCodeSNo').val().split('-')[1] == "REPLAN CHARGES") {
                if ($("#OCCodeSNo").val().split('-')[1] == '1') {
                    $("#IsOtherChargeMandatory").attr('checked', true);
                    $('input[id="IsReplanCharges"]').removeAttr("disabled");
                }
                if ($('#Text_OCCodeSNo').val().split('-')[1] == "REPLAN CHARGES") {
                    $('input[id="IsReplanCharges"][value="0"]').attr("checked", true);
                    $('input[id="IsReplanCharges"][value="1"]').attr("disabled", 'disabled');
                }
            }
            
            else {
                $("#IsOtherChargeMandatory").attr('checked', false);
                $('input[id="IsReplanCharges"]').removeAttr("disabled");
                $('input[id="IsReplanCharges"][value="1"]').attr("checked", true);
            }
        }
        else {
            $("#IsOtherChargeMandatory").attr('checked', false);
            $('input[id="IsReplanCharges"]').removeAttr("disabled");
            $('input[id="IsReplanCharges"][value="1"]').attr("checked", true);
        }
    }
    CreateRateParamGrid();
    getRateParameterValues();
    AuditLogBindOldValue('tblRateParam');

}
function onSelectAllotment(input) {
    if ($("#Text_RateTypeSNo").val() == "ALLOTMENT") {
        $("#Text_AllotmentSNo").closest("span").show();
    }
    else {
        $("#Text_AllotmentSNo").closest("span").hide();
    }
}
function GetAllotmentType() {
    var AllotmentSNo = $("#AllotmentSNo").val();
    $.ajax({
        url: "Services/Rate/RateService.svc/GetAllotmentType?AllotmentSNo=" + AllotmentSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            var ResultData = jQuery.parseJSON(result);
            $("#Text_AllotmentSNo").after("<span style='padding-left:40px;font-weight:BOLD;'>" + ResultData.Table0[0].AllotmentType + "</span>");


        }
    });
}
function OnSelectOrigin(input) {
    var Origin = $("#Text_OriginType").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Origin == "AIRPORT") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', 'Origin Airport can not be same as Destination Airport.', "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");
            }

        }
        else if (Origin == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Origin City can not be same as Destination City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }
        }
    }
}
function OnSelectDestination(input) {
    debugger;
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Destination == "AIRPORT") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination Airport can not be same as Origin Airport.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");
            }
        }
        else if (Destination == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination Airport can not be same as Origin Airport.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");
            }
        }
    }
}


var FlightType = [{ Key: "", Text: "" }]
var UOM = [{ Key: "0", Text: "Kg" }, { Key: "1", Text: "Lbs" }];
var PaymentType = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }];
var ChargeType = [{ Key: "0", Text: "Flat Charges" }, { Key: "1", Text: "Per Piece" }, { Key: "3", Text: "Per House" }, { Key: "4", Text: "Chargeable Weight" }, { Key: "5", Text: "Gross Weight" }];
var ChargeApplyOn = [{ Key: "1", Text: "Freight" }, { Key: "2", Text: "Declare Value" }, { Key: "2", Text: "Due Agent" }];
var RateBaseName = [{ Key: "0", Text: "Per AWB" }, { Key: "1", Text: "On Gross Wt." }, { Key: "2", Text: "Per Piece" }, { Key: "0", Text: "On Chargable Wt." }];
var Active = [{ Key: "1", Text: "Active" }, { Key: "2", Text: "Draft" }, { Key: "3", Text: "In Active" }, { Key: "4", Text: "Expire" }];
var RateCard = [{ Key: "0", Text: "IATA" }, { Key: "1", Text: "MARKET" }, { Key: "2", Text: "SPA" }];
var Origin = [{ Key: "1", Text: "Airport" }, { Key: "2", Text: "City" }, { Key: "3", Text: "Region" }, { Key: "4", Text: "Zone" }, { Key: "5", Text: "Country" }];
var Destination = [{ Key: "1", Text: "Airport" }, { Key: "2", Text: "City" }, { Key: "3", Text: "Region" }, { Key: "4", Text: "Zone" }, { Key: "5", Text: "Country" }];
var currentRateSNo = 0;

function FnGetOriginAC(input) {
    $('#Text_OriginSNo, #OriginSNo').val('');
    var Origin = $("#Text_OriginType").val().toUpperCase();
    if (Origin == "AIRPORT") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes By Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_Origin")
        // Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
    }
    else if (Origin == "CITY") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginCity")
        //Ends 
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
    }
    else if (Origin == "REGION") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName", ["RegionName"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginRegion")
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");
    }
    else if (Origin == "COUNTRY") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginCountry");
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
        //cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
        cfi.AutoCompleteV2("OriginSNo", "CountryCode,CountryName", "OtherCharges_OriginCountry", OnSelectOrigin, "contains");
        // Ends
    }
    else if (Origin == "ZONE") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginZone")
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "ZoneName");
    }
}

function FnGetDestinationAC(input) {
    $('#Text_DestinationSNo, #DestinationSNo').val('');
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_Origin")
        //ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "AirportCode");
    }
    else if (Destination == "CITY") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_OriginCity")
        //Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
    }
    else if (Destination == "REGION") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName", ["RegionName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_OriginRegion")
        // Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");
    }
    else if (Destination == "COUNTRY") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_OriginCountry")
        // Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
    }
    else if (Destination == "ZONE") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_OriginZone")
        // Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "ZoneName");
    }
}

function CheckValidation(input) {
    if (parseInt($("#" + input).val()) <= 0 || $("#" + input).val() == "") {
        $("#_temp" + input).attr('style', 'width: 97.3333px; text-align: right; display: inline-block; border: 1px solid red')
        ShowMessage('warning', 'Warning - Rate', 'Value Should Be Greater Than Zero', "bottom-right");
        return false;
    }
    else {
        var startValue = 0;
        var endValue = 0;
        if (input.indexOf("Start") >= 0) {
            startValue = $("#" + input).val();
            endValue = $("#" + input.replace("Start", "End")).val();
            previousEndValue = $("#" + input.replace("Start", "End").replace(input.split("_")[2], input.split("_")[2] - 1)).val();
        }
        else {
            endValue = $("#" + input).val();
            startValue = $("#" + input.replace("End", "Start")).val();
        }
        if (parseFloat(startValue) > parseFloat(endValue)) {
            //  alert("End Weight can not be greater than Start Weight.");
            ShowMessage('warning', 'Warning - Rate', 'End Weight Can Not Be Greater Than Start Weight.', "bottom-right");
            $("#" + input).val("");
            $("#_temp" + input).val('');
            $("#" + input).attr("required", "required");
            return false;
        }
        if (parseFloat(endValue) == 0) {
            $("#" + input).val("");
            $("#_temp" + input).val('');

        }
        if ($.isNumeric($("#" + input).val()) == false) {
            $("#" + input).val('');
            $("#_temp" + input).val('');
            return false;
        }

    }
    //---------------added by arman for slab range validation 2017-07-26
    if (input.indexOf("Start") >= 0) {
        var prevVal = $("#" + input).closest('tr').prev('tr').find('td [id^="tblRateBase_EndWt_"]').val()
        var currVal = $("#" + input).val()
        if (parseInt(currVal) <= parseInt(prevVal)) {
            ShowMessage('warning', 'Warning - Rate', 'Start Weight Should Be Greater Than Previous End Weight.', "bottom-right");
            $("#" + input).val('');
            $("#_temp" + input).val('');
            return false;
        }
    }
    //---------------
}
function CheckValueValidation(input) {
    if (parseFloat($("#" + input).val()) <= 0 || $("#" + input).val() == "") {
        $("#_temp" + input).attr('style', 'width: 97.3333px; text-align: right; display: inline-block; border: 1px solid red')
        ShowMessage('warning', 'Warning - Rate', 'Rate Should Be Greater Than Zero', "bottom-right");

        return false;
    }
}
function ChangeUnitType(input) {

}

function CreateRemarks() {
    var dbtableName = "Remarks";

    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnRateSNo").val() || 10000,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/OtherChargesService.svc",
        getRecordServiceMethod: "GetRemarks",
        deleteServiceMethod: "",
        caption: "Remarks",
        initRows: 1,
        columns: [
                    { name: "SNo", type: "hidden" },
                    { name: "Remarks", display: "Remark", type: "textarea", ctrlAttr: { maxlength: 100, }, ctrlCss: { width: "350px", height: "40px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : true, removeLast: true }
    });
    $('#tblRemarks button.insert,#tblRemarks button.remove').hide();
    $("#tblRemarks button.removeLast").hide();
    $("#RemarksCount").val($("[id^='tblRemarks_Remarks_']").length);
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#tblRemarks_Remarks_1").val('');
    }
}

var strData = [];
var pageType = $('#hdnPageType').val();



function BindWhereCondition() {

    return {
        AirlineSNo: $("#AirlineSNo").val(),
        OriginType: $("#OriginType").val(),
        OriginSNo: $("#OriginSNo").val(),
        //recordID:$("#hdnRateSNo").val() || 1.1
        recordID: $("#hdnRateSNo").val()==""?1.1:$("#hdnRateSNo").val()

    };
}



function CreateSlabGrid(Origin, OriginSNo) {
    var page = getQueryStringValue("FormAction").toUpperCase();
    var dbTableName = 'RateBase';
    var AirlineSNo = $('#AirlineSNo').val().trim().split('-')[0];
    var Origin = $("#OriginType").val() || 0;
    var OriginSNo = $("#OriginSNo").val() || 0;
    if (AirlineSNo == 0) {
        return;
    }



    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: page == "READ" || page == "DELETE" ? false : true,
        tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: $("#hdnRateSNo").val() || 1.1,
        currentPage: 1, itemsPerPage: 50, model: BindWhereCondition(), sort: '',
        servicePath: 'Services/Rate/OtherChargesService.svc',
        getRecordServiceMethod: 'GetRateSLAB',
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: 'Rate Slab Information',
        initRows: 1, 
        isGetRecord: true,
        columns: [
                  { name: "SNo", type: "hidden" },
                  { name: "SlabName", display: "Slab Name", type: page == "READ" || page == "DELETE" ? "label" : "text", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "150px" }, isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? true : false },
                  { name: "StartWt", display: "Start Weight", type: page == "READ" || page == "DELETE" ? "label" : "text", ctrlAttr: { maxlength: 7, controltype: page == "READ" || page == "DELETE" ? "" : "number", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? 'min[1],required' : "" },
                  { name: "EndWt", display: "End Weight", type: page == "READ" || page == "DELETE" ? "label" : "text", ctrlAttr: { maxlength: 7, controltype: page == "READ" || page == "DELETE" ? "" : "number", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? 'min[1],required' : "" },
                 { name: "RateClassSNo", display: "Type", type: "select", ctrlAttr: { maxlength: 100, onclick: "return CheckOption(this.id);", onblur: "return CheckOption(this.id);", onSelect: "return CheckOption(this.id);", onChange: "return CheckOption(this.id);" }, ctrlOptions: { 0: "M", 1: "N" }, ctrlCss: { width: "100px" }, isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? true : false },
                  { name: "RateValue", display: "Rate", type: "text", ctrlAttr: { controltype: "decimal3", maxlength: 11, onblur: "return CheckRateValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? 'min[0.01],required' : "" },

        ],
        beforeRowRemove: function (caller, rowIndex) {
            $("[id*=tblRateBase_Insert_]").remove();
            //   validationforSlab();
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("[id*=tblRateBase_Insert_]").remove();
            $("[id^='tblRateBase_SlabName_']").val("WEIGHT")
            $("[id^='tblRateBase_SlabName_']").attr("disabled", true);
            var uniqueindex;
            uniqueindex = $('#tblRateBase').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            if (uniqueindex != undefined && uniqueindex != null) {
                $("#tblRateBase_RateClassSNo_" + uniqueindex).prop("selectedIndex", -1);
              //  $("[id=tblRateBase_RateClassSNo_1] option[value='1']").hide();
              //  $('[name*= "tblRateBase_RateClassSNo_"][id!="tblRateBase_RateClassSNo_1" ] option[value="0"]').hide();
                checkMinSlab();
            }
          //  
            ////clear (select)
            //

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            if (page == "NEW") {
                $("[id*='tblRateBase_RateClassSNo_']").prop("selectedIndex", -1);
            }

            $("[id*=tblRateBase_Insert_]").remove();
            $("[id^='tblRateBase_SlabName_']").val("WEIGHT")
            $("[id^='tblRateBase_SlabName_']").attr("disabled", true);
            $("[id=tblRateBase_RateClassSNo_1] option[value='1']").hide();
            $('[name*= "tblRateBase_RateClassSNo_"][id!="tblRateBase_RateClassSNo_1" ] option[value="0"]').hide();
            // clear fields if zero // 
            $("#_temptblRateBase_StartWt_1").val() == "0" ? $("#_temptblRateBase_StartWt_1").val('') : $("#_temptblRateBase_StartWt_1").val($("#_temptblRateBase_StartWt_1").val())
            $("#_temptblRateBase_EndWt_1").val() == "0" ? $("#_temptblRateBase_EndWt_1").val('') : $("#_temptblRateBase_EndWt_1").val($("#_temptblRateBase_EndWt_1").val())
            $("#tblRateBase_StartWt_1").val() == "0" ? $("#tblRateBase_StartWt_1").val('') : $("#tblRateBase_StartWt_1").val($("#tblRateBase_StartWt_1").val())
            $("#tblRateBase_EndWt_1").val() == "0" ? $("#tblRateBase_EndWt_1").val('') : $("#tblRateBase_EndWt_1").val($("#tblRateBase_EndWt_1").val())
            checkMinSlab();
        },
        afterRowRemoved: function (caller, rowIndex) {

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: false, remove: true, append: page == "DUPLICATE" || page == "NEW" || page == "EDIT" ? false : true, removeLast: page == "DUPLICATE" || page == "NEW" || page == "EDIT" ? false : true }
    });

    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //    $("[id*='tblRateBase_RateClassSNo_']").prop("selectedIndex", -1);
            $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val("");
            $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");

            $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
            $(tr).find("input[id^='tblRateBase_Rate_']").val("");
            $(tr).find("input[id^='_temptblRateBase_StartWt_']").val("");
            $(tr).find("input[id^='_temptblRateBase_EndWt_']").val("");
            $(tr).find("input[id^='tblRateBase_StartWt_']").val("");
            $(tr).find("input[id^='tblRateBase_EndWt_']").val("");
        }
        $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblRateBase_RateClassSNo_']").attr("data-valid", "required");

        //   validationforSlab();
    });
    //  $('#tblRateBase button.append').hide();
    $("#tblRateBase_btnRemoveLast").unbind("click").bind("click", function () {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

            var table = document.getElementById("tblRateBase");
            if (table != null && table.rows.length > 1) {
                var id = table.rows.length;
                var valid = id - 3;
                if (valid > 1) {
                    var rem = $('[id="tblRateBase"]').find('tbody tr').last().attr('id').split('_')[2]

                    $('#tblRateBase_Row_' + rem).remove();
                    ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");



                }

            }
            checkMinSlab();
        }
    });
    $("[id *='tblRateBase_Delete_']").unbind("click").bind("click", function () {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            var table = document.getElementById("tblRateBase");
            var rowno = (this.id).split('_')[2];
            if (table != null && table.rows.length > 1) {
                var id = table.rows.length;
                var valid = id - 3;
                if (valid > 2) {
                    $('#tblRateBase_Row_' + rowno).remove();
                    ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");
                    //     var len = $("#tblRateBase_rowOrder").val().split(',').length;


                }
            }
        }
        checkMinSlab();
    });
}


function CreateULDSlabGrid() {
    var dbtableName = "ULDRate";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: 1, //$("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/OtherChargesService.svc",
        getRecordServiceMethod: "GetULDRate",
        deleteServiceMethod: "",
        caption: "ULD Rate Slab Information",
        initRows: 1,
        hideRowNumColumn: true,
        columns: [
                 { name: "SNo", type: "hidden" },
                 { name: "SLABName", display: "Slab Name", type: "text", ctrlAttr: { maxlength: 100, }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: 'ULDSNo', display: 'ULD Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'OtherCharges_ULD', filterField: 'ULDName', filterCriteria: "contains" },
                 { name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'OtherCharges_RateClass', filterField: 'RateClassCode', filterCriteria: "contains" },
                 { name: "StartWt", display: "Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 11 }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
}

function SaveRateAirlineMaster() {
    SlabCount = $("[id^='tblRateBase_SlabName_']").length;
    $("#SlabCount").val(SlabCount);

    var RateRemarksarray = [];
    var RateSLABInfoarray = [];
    var RateULDSLABInfoArray = [];
    var RateParamArray = [];
    var RateViewModel = {
        SNo: 0,
        RateCardSNo: parseInt($("#RateCardSNo").val()) || 0,
        RAirlineSNo: parseInt($("#RAirlineSNo").val()) || 0,
        OriginType: parseInt($("#OriginType").val()) || 0,
        OriginSNo: parseInt($("#OriginSNo").val()) || 0,
        DestinationType: parseInt($("#DestinationType").val()) || 0,
        DestinationSNo: parseInt($("#DestinationSNo").val()) || 0,
        REFNo: $("#REFNo").val(),
        CurrencySNo: parseInt($("#CurrencySNo").val()) || 0,
        Active: parseInt($("#Active").val()) || 0,
        RateBaseSNo: parseInt($("#RateBaseSNo").val()) || 0,
        ValidFrom: $("#ValidFrom").val(),
        ValidTo: $("#ValidTo").val(),
        IsNextSLAB: $("#IsNextSLAB").checked == true ? 1 : 0,
        Tax: $("#Tax").val() || 0.0,
        UOMSNo: parseInt($("input[name=UOMSNo]:checked").val()) || 0,
        FlightTypeSNo: parseInt($("#FlightTypeSNo").val()) || 0,
        RateTypeSNo: parseInt($("#RateTypeSNo").val()) || 0,
        AllotmentSNo: parseInt($("#AllotmentSNo").val()) || 0,
        Remark: null,
    }
    $("tr[id^='tblRemarks_Row']").each(function (row, tr) {
        var RateRemarksViewModel = {
            SNo: 0,
            RateSNo: 0,
            Remark: $(tr).find("input[id^='tblRemarks_Remarks_']").val()
        }
        RateRemarksarray.push(RateRemarksViewModel);
    });

    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        var RateSLABViewModel = {
            SNo: $(tr).find("input[id^='tblRateBase_SNo_']").val(),
            SlabSNo: $(tr).find("input[id^='tblRateBase_SNo_']").val(),
            RateSNo: 0,
            SlabName: 0,
            RateClassSNo: $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val(),
            Text_RateClassSNo: "",
            StartWt: 0,
            EndWt: 0,
            Rate: $(tr).find("input[id^='_temptblRateBase_Rate_']").val(),
            Based: null
        }
        RateSLABInfoarray.push(RateSLABViewModel);
    });

    $("tr[id^='tblULDRate_Row']").each(function (row, tr) {
        var RateULDSLABViewModel = {
            SNo: 0,
            ULDSNo: $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").val(),//,
            SlabSNo: 0,
            RateSNo: 0,
            SlabName: $(tr).find("input[id^='tblULDRate_SLABName_']").val(),
            RateClassSNo: $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_1']").val(),
            Text_RateClassSNo: "",
            StartWt: $(tr).find("input[id^='tblULDRate_StartWt_']").val(),
            EndWt: 0,
            Rate: $(tr).find("input[id^='_temptblULDRate_Rate_']").val()
        }
        RateULDSLABInfoArray.push(RateULDSLABViewModel);
    });
    var SelectedDays = "";

    $("input[type='checkbox'][id^='Days']").each(function () {

        if ($("input[name='Days'][value=0]:checked").val()) {
            SelectedDays = "1,2,3,4,5,6,7";
        }
        else {
            if ($("input[name='Days'][value=0]:checked").val() == undefined) {
                var days = [];
                $("input[name='Days']:checked").each(function (item) {
                    days.push(this.value);
                });
                SelectedDays = days.join(',');
            }
        }
    });

    var RateParamViewModel = {
        SNo: 0,
        RateSNo: 0,
        AirlineSNo: $("#FlightCarrierSNo").val(),
        IsIncludeCarrier: $("input[name='IE']:checked").val(),
        IAirlineSNo: $("#IAirlineSNo").val(),
        IsIncludeICarrier: $("input[name='IE1']:checked").val(),
        FlightSNo: $("#FlightSNo").val(),
        IsIncludeFlight: $("input[name='IE2']:checked").val(),
        Days: SelectedDays,
        IsIncludeDays: $("input[name='IE3']:checked").val(),
        StartTime: $("#StartTime").val(),
        EndTime: $("#EndTime").val(),
        IsIncludeETD: $("input[name='IE10']:checked").val(),
        TransitStationsSNo: $("#TransitStationsSNo").val(),
        IsIncludeTransitStations: $("input[name='IE4']:checked").val(),
        AccountSNo: $("#AccountSNo").val(),
        IsIncludeAccount: $("input[name='IE5']:checked").val(),
        ShipperSNo: $("#ShipperSNo").val(),
        IsIncludeShipper: $("input[name='IE6']:checked").val(),
        CommoditySNo: $("#CommoditySNo").val(),
        IsIncludeCommodit: $("input[name='IE7']:checked").val(),
        ProductSNo: $("#ProductSNo").val(),
        IsIncludeProduct: $("input[name='IE8']:checked").val(),
        SHCSNo: $("#SHCSNo").val(),
        IsIncludeSHC: $("input[name='IE9']:checked").val(),
        SPHCGroupSNo: $("#SPHCGroupSNo").val(),
        IsIncludeSPHCGroup: $("input[name='IE11']:checked").val(),
    }
    $.ajax({
        url: "Services/Rate/OtherChargesService.svc/SaveCharges", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RateSNo: 1, RateInfo: RateViewModel, RateRemarks: RateRemarksarray, RateSLABInfoarray: RateSLABInfoarray, RateULDSLABInfoArray: RateULDSLABInfoArray, RateParamList: RateParamViewModel }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Rate', "Rate Details Successfully Saved", "bottom-right");
                $("input[type='submit'][name='operation'][value='Save']").click();
            }
        }
    });
}

function CreateRateParamGrid() {
    var RateParamHtml = "<tr style='height: 50px;'><td class='ui-widget-header' align=center style='padding-left:11px;border-base:2' colspan=6 ><h2>Rate Parameter</h2></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Issue Carrier</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='IssueCarrierSNo' name='IssueCarrierSNo' tabindex='0'  /> <input type=text id='Text_IssueCarrierSNo' name='Text_IssueCarrierSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input id='IEIssueCarrier' type='radio' class='radio' value='1' name='IEIssueCarrier' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IEIssueCarrier' name='IEIssueCarrier' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Flight Number</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='FlightSNo' name='FlightSNo' tabindex='0'  /> <input type=text id='Text_FlightSNo' name='Text_FlightSNo'  tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' id='IEFlight' name='IEFlight' />Include </label>&nbsp;<label><input type='radio' class='radio' id='IEFlight' value='0' name='IEFlight' />Exclude </label> </td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>ETD</strong></td><td align=left style='padding-left:11px;' class='ui-widget-content'><span class='k-widget k-timepicker k-header' style='width: 85px; height: 18px;'><span class='k-picker-wrap k-state-default'><input type='text' id='StartTime' name='StartTime' maxlength='5' data-role='timepicker' placeholder='Start Time' class='k-input' style='width:85px ; height: 15px;'><span unselectable='on' class='k-select'><span unselectable='on' class='k-icon k-i-clock'>select</span></span></span></span>&nbsp;<span class='k-widget k-timepicker k-header' style='width: 85px; height: 15px;'><span class='k-picker-wrap k-state-default'><input type='text' id='EndTime' name='EndTime' maxlength='5' placeholder='End Time' data-role='timepicker' class='k-input' style='width: 85px; height: 15px;'><span unselectable='on' class='k-select'><span unselectable='on' class='k-icon k-i-clock'>select</span></span></span></span> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' id='IEEtd' name='IEEtd' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEEtd' id='IEEtd' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Day of Week</strong>  </td><td class='ui-widget-content'><input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='0'>All<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='1'>Sun<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='2'>Mon<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='3'>Tue<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='4'>Wed<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='5'>Thu<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='6'>Fri<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='7'>Sat</td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEDays' id='IEDays' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEDays' id='IEDays' />Exclude </label></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Transit Station</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='TransitStationsSNo' name='TransitStationsSNo' tabindex='0'  /> <input type=text id='Text_TransitStationsSNo' name='Text_TransitStationsSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IETransitStation' id='IETransitStation' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IETransitStation' name='IETransitStation' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Product Type</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='ProductSNo' name='ProductSNo' tabindex='0'  /> <input type=text id='Text_ProductSNo' name='Text_ProductSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEProduct' id='IEProduct' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IEProduct' name='IEProduct' />Exclude </label></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Agent Group</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='AgentGroupSNo' name='AgentGroupSNo' tabindex='0'/><input type=text id='Text_AgentGroupSNo' name='Text_AgentGroupSNo' tabindex='0' controltype='autocomplete'/></td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEAgentGroup' id='IEAgentGroup' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEAgentGroup'  id='IEAgentGroup' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Commodity Code</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='CommoditySNo' name='CommoditySNo' tabindex='0'  /> <input type=text id='Text_CommoditySNo' name='Text_CommoditySNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IECommodity' id='IECommodity' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IECommodity' name='IECommodity' />Exclude </label> </td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Agent Name</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='AccountSNo' name='AccountSNo' tabindex='0'/><input type=text id='Text_AccountSNo' name='Text_AccountSNo' tabindex='0' controltype='autocomplete'/></td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEAccount' id='IEAccount' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IEAccount'  name='IEAccount' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Special Handling Code</strong>  </td><td align=left style='padding-left:11px;'  class='ui-widget-content'><input type='hidden' id='SHCSNo' name='SHCSNo' tabindex='0'  /> <input type=text id='Text_SHCSNo' name='Text_SHCSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' id='IESHCS' name='IESHCS' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IESHCS' id='IESHCS' />Exclude </label></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Shipper Code</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='ShipperSNo' name='ShipperSNo' tabindex='0'  /> <input type=text id='Text_ShipperSNo' name='Text_ShipperSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1'  id='IEShipper' name='IEShipper' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IEShipper' name='IEShipper' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong> SPHC Group</strong>  </td><td align=left style='padding-left:11px;'  class='ui-widget-content'><input type='hidden' id='SPHCGroupSNo' name='SPHCGroupSNo' tabindex='0'  /> <input type=text id='Text_SPHCGroupSNo' name='Text_SPHCGroupSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' id='IESPHCGroup' name='IESPHCGroup' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' id='IESPHCGroup' name='IESPHCGroup' />Exclude </label></td></tr>";
    var dbtableName = "RateParam";
    $("#tbl" + dbtableName).append(RateParamHtml);
    // Changes by Vipin Kumar
    //cfi.AutoComplete("FlightCarrierSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");
    cfi.AutoCompleteV2("FlightCarrierSNo", "CarrierCode,AirlineName", "OtherCharges_FlightCarrier", null, "contains", ",");
    //cfi.AutoComplete("IssueCarrierSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");
    cfi.AutoCompleteV2("IssueCarrierSNo", "CarrierCode,AirlineName", "OtherCharges_FlightCarrier", null, "contains", ",");
    //cfi.AutoComplete("FlightSNo", "FlightNo", "getflightNo", "SNo", "FlightNo@", ["FlightNo"], null, "contains", ",");
    cfi.AutoCompleteV2("FlightSNo", "FlightNo", "OtherCharges_Flight", null, "contains", ",");
    //cfi.AutoComplete("AgentGroupSNo", "AgentGroupName", "RateAirlineAgentGroup", "SNo", null, null, null, "contains", ",");
    cfi.AutoCompleteV2("AgentGroupSNo", "AgentGroupName", "OtherCharges_AgentGroup", null, "contains", ",");
    // cfi.AutoComplete("TransitStationsSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode@", ["AirportCode", "AirportName"], null, "contains", ",");
    cfi.AutoCompleteV2("TransitStationsSNo", "AirportCode,AirportName", "OtherCharges_TransitStation", null, "contains", ",");
    //cfi.AutoComplete("AccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
    cfi.AutoCompleteV2("AccountSNo", "ParticipantID,AgentName", "OtherCharges_Account", null, "contains", ",");
    //cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSShipper", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
    cfi.AutoCompleteV2("ShipperSNo", "AgentName", "OtherCharges_Shipper", null, "contains", ",");
    //cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNO", "CommodityCode@", ["CommodityCode", "CommodityDescription"], null, "contains", ",", null, null, null, null, true);
    cfi.AutoCompleteV2("CommoditySNo", "CommodityCode,CommodityDescription", "OtherCharges_Commodity", null, "contains", ",", null, null, null, null, true);
    //cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains", ",");
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "OtherCharges_Product", null, "contains", ",");
    //cfi.AutoComplete("SHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");
    cfi.AutoCompleteV2("SHCSNo", "Code,Description", "OtherCharges_SPHC", null, "contains", ",");
    //cfi.AutoComplete("SPHCGroupSNo", "Name", "SPHCGroup", "SNo", "Name@", ["Name"], null, "contains", ",");
    cfi.AutoCompleteV2("SPHCGroupSNo", "Name", "OtherCharges_SPHCGroup", null, "contains", ",");
    // Ends
    $('[id^="StartTime"]').kendoTimePicker({
        format: "HH", interval: 60
    });
    $('[id^="EndTime"]').kendoTimePicker({
        format: "HH", interval: 60
    });

    $("input[id^=StartTime]").change(function (e) {
        checkETD(this);
    });
    $("input[id^=EndTime]").change(function (e) {
        checkETD(this);

    });
    $('input[type=radio][name^=IE][value=0]').each(function () {
        $('input[type=radio][name^=IE][value=0]').attr('checked', true);
    });
  
    $("input[type='checkbox'][id^='Days']").each(function () {
        $(this).click(function () {
            if ($(this).val() == "0") {
                $("input[type='checkbox'][id^='" + $(this).attr("id") + "']").attr("checked", $(this).is(":checked"));
            }
            else {
                if (!$(this).is(":checked")) {
                    $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", $(this).is(":checked"));
                }
                else {
                    var checked = true;
                    $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:gt(0)").each(function () {
                        if (checked)
                            checked = $(this).is(":checked");
                        if (!checked)
                            return false;
                    });
                    if (checked) {
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", checked);
                    }
                }
            }
        });
    });
    //-------- added by Arman ali for by default Checked in rate otehr condition : 2017-01-11----- 
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('input[type="radio"][id^="IE"][value="1"]').attr('checked', true)
    }
}
function checkETD(input) {
    var StartTime = $("#StartTime").val();
    var EndTime = $("#EndTime").val();
    if (StartTime != "" && EndTime != "") {
        if (EndTime <= StartTime) {
            ShowMessage('warning', 'Warning - Rate', 'End Time can not be less than or equal Start Time.', "bottom-right");
            $("#EndTime").val("");
        }
    }
}

function ExtraCondition(textId) {
    var filterAirlineSNo = cfi.getFilter("AND");
    var filterIAirlineSNo = cfi.getFilter("AND");
    var filterFlightSNo = cfi.getFilter("AND");
    var filterTransitStationsSNo = cfi.getFilter("AND");
    var filterAccountSNo = cfi.getFilter("AND");
    var filterShipperSNo = cfi.getFilter("AND");
    var filterCommoditySNo = cfi.getFilter("AND");
    var filterProductSNo = cfi.getFilter("AND");
    var filterSHCSNo = cfi.getFilter("AND");
    var filterSPHCGroupSNo = cfi.getFilter("AND");
    var filterAgentGroupSNo = cfi.getFilter("AND");
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        $("#Text_ChargeType").val('');
        $("#ChargeType").val('');
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNO", "notin", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter1, "IsActive", "eq", 1);
        cfi.setFilter(filter1, "IsInterline", "eq", 0);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    else if (textId.indexOf("Text_IAirlineSNo") >= 0) {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "SNO", "notin", $("#Text_IAirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter2, "IsActive", "eq", 1);
        filterIAirlineSNo = cfi.autoCompleteFilter(filter2);
        return filterIAirlineSNo;
    }
    else if (textId.indexOf("Text_FlightSNo") >= 0) {
        var filter3 = cfi.getFilter("AND");
        cfi.setFilter(filter3, "SNO", "notin", $("#Text_FlightSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter3, "IsActive", "eq", 1);
        filterFlightSNo = cfi.autoCompleteFilter(filter3);
        return filterFlightSNo;
    } else if (textId.indexOf("Text_TransitStationsSNo") >= 0) {
        var filter4 = cfi.getFilter("AND");
        cfi.setFilter(filter4, "SNO", "notin", $("#Text_TransitStationsSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter4, "IsActive", "eq", 1);
        filterTransitStationsSNo = cfi.autoCompleteFilter(filter4);
        return filterTransitStationsSNo;
    }
    else if (textId.indexOf("Text_AccountSNo") >= 0) {
        var filter5 = cfi.getFilter("AND");
        cfi.setFilter(filter5, "SNO", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key());
        //cfi.setFilter(filter5, "AccountTypeName", "eq", "FORWARDER");
        filterAccountSNo = cfi.autoCompleteFilter(filter5);
        return filterAccountSNo;
    }
    else if (textId.indexOf("Text_SPHCGroupSNo") >= 0) {
        var filter11 = cfi.getFilter("AND");
        cfi.setFilter(filter11, "SNO", "notin", $("#Text_SPHCGroupSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter11, "IsActive", "eq", 1);
        filterSPHCGroupSNo = cfi.autoCompleteFilter(filter11);
        return filterSPHCGroupSNo;
    }
    else if (textId.indexOf("Text_AgentGroupSNo") >= 0) {
        var filter12 = cfi.getFilter("AND");
        cfi.setFilter(filter12, "SNO", "notin", $("#Text_AgentGroupSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter12, "IsActive", "eq", 1);
        filterAgentGroupSNo = cfi.autoCompleteFilter(filter12);
        return filterAgentGroupSNo;
    }
    else if (textId.indexOf("Text_ShipperSNo") >= 0) {
        var filter6 = cfi.getFilter("AND");
        cfi.setFilter(filter6, "SNO", "notin", $("#Text_ShipperSNo").data("kendoAutoComplete").key());
        //cfi.setFilter(filter6, "AccountTypeSNo", "eq", 66);
        filterShipperSNo = cfi.autoCompleteFilter(filter6);
        return filterShipperSNo;
    }
    else if (textId.indexOf("Text_CommoditySNo") >= 0) {
        var filter7 = cfi.getFilter("AND");
        cfi.setFilter(filter7, "SNO", "notin", $("#Text_CommoditySNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter7, "IsActive", "eq", 1);
        filterCommoditySNo = cfi.autoCompleteFilter(filter7);
        return filterCommoditySNo;
    }
    else if (textId.indexOf("Text_ProductSNo") >= 0) {
        var filter8 = cfi.getFilter("AND");
        cfi.setFilter(filter8, "SNO", "notin", $("#Text_ProductSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter8, "IsActive", "eq", 1);
        filterProductSNo = cfi.autoCompleteFilter(filter8);
        return filterProductSNo;
    }
    if (textId.indexOf("Text_SHCSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNO", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNO", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    var filterTransit = cfi.getFilter("AND");

    if (textId.indexOf("Text_TransitStationSNo") >= 0) {
        var addedValue = "";
        if (textId == "Text_TransitStationSNo") {
            addedValue = $('input[type="hidden"][id="TransitStationSNo"]').val();
        }
        else {
            addedValue = $('input[type="hidden"][id="' + textId.replace('Text_', '') + '"]').val();
        }
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", addedValue), cfi.autoCompleteFilter(textId);
    }

    if (textId.indexOf("Text_OCCodeSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        var ChargeValue = $("input[name='Charge']:checked").val();
        if (ChargeValue != "1") {
            ChargeValue = "0";
        }
        cfi.setFilter(filter9, "IsCarrier", "eq", ChargeValue);
        cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
}


function onchangeChargeType() {

    var ChargeType = $("#ChargeType").val();
    var Minimum = $('#_tempMinimum');
    var MinimumText = $('#Minimum');
    var Charge = $('#_tempChargeText');
    var Maximum = $('#_tempMaximum');
    Minimum.val('');
    Charge.val('');
    Maximum.val('');
    $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").val('')
    Minimum.attr('data-valid', 'required');
    Maximum.attr('data-valid', 'required');
    Charge.attr('data-valid', 'required');
    $('td[title="Enter Minimum Value"]').html("Minimum Value");
    $('td[title="Enter Charge Value"]').html("Charge Value");
    $('td[title="Enter Maximum Value"]').html("Maximum Value");

       if (ChargeType == 0) {
        if (userContext.SysSetting.FlateChargesOnSlabRateApply == "TRUE") {
            CreateSlabGrid();

            Minimum.attr('disabled', true);
            MinimumText.attr('disabled', true);
            Charge.attr('disabled', true);
            Maximum.attr('disabled', true);

            $("#divRateBase").show();
            if ($("#tblRateBase tbody tr").length == 1) {

            }
            $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").attr('disabled', true);
            $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").removeAttr('data-valid')
        }
        else {
            Minimum.attr('disabled', true);
            MinimumText.attr('disabled', true);
            Charge.attr('disabled', false);
            Maximum.attr('disabled', true);
            Minimum.removeAttr('data-valid');
            Charge.attr('data-valid', 'required');
            $('#ChargeText').prop('disabled', false);
            $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
            Maximum.removeAttr('data-valid');
            $("#divRateBase").hide();
        }
    }
    else if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
        //------------added by arman Date: 2017-06-16
        if ($("#Text_AirlineSNo").val() == "") {
            ShowMessage('warning', 'Warning - Other Charges', 'Select Airline First', "bottom-right");
            $("#ChargeType").val('')
            $("#Text_ChargeType").val('')
            return false;
        }
        CreateSlabGrid();

        Minimum.attr('disabled', true);
        MinimumText.attr('disabled', true);
        Charge.attr('disabled', true);
        Maximum.attr('disabled', true);

        $("#divRateBase").show();
        if ($("#tblRateBase tbody tr").length == 1) {

        }
        $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").attr('disabled', true);
        $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").removeAttr('data-valid')

    }
    else {
        Minimum.attr('disabled', false);
        MinimumText.attr('disabled', false);
        Charge.attr('disabled', false);
        Maximum.attr('disabled', false);
        $('td[title="Enter Minimum Value"]').html("<span style = 'color:red'>*</span> Minimum Value");
        $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
        $('td[title="Enter Maximum Value"]').html("<span style = 'color:red'>*</span> Maximum Value");
        Minimum.attr('data-valid', 'required');
        Charge.attr('data-valid', 'required');
        Maximum.attr('data-valid', 'required');
        $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").attr('disabled', false);
        $("#_tempMinimum, #_tempChargeText,#Minimum,#ChargeText").attr('data-valid', 'required');
        $("#divRateBase").hide();
    }
}

function onChangeOtherCharges() {
    if ($("#OCCodeSNo").val() != "") {
        if ($("#OCCodeSNo").val().split('-')[1] == '1' || $('#Text_OCCodeSNo').val().split('-')[1] == "REPLAN CHARGES") {
            if ($("#OCCodeSNo").val().split('-')[1] == '1') {
                $("#IsOtherChargeMandatory").attr('checked', true);
                $('input[id="IsReplanCharges"]').removeAttr("disabled");
            }
            if ($('#Text_OCCodeSNo').val().split('-')[1] == "REPLAN CHARGES") {
                $('input[id="IsReplanCharges"][value="0"]').attr("checked", true);
                $('input[id="IsReplanCharges"][value="1"]').attr("disabled", 'disabled');
            }
        }
      
        else {
            $("#IsOtherChargeMandatory").attr('checked', false);
            $('input[id="IsReplanCharges"]').removeAttr("disabled");
            $('input[id="IsReplanCharges"][value="1"]').attr("checked", true);
        }
    }
    else {
        $("#IsOtherChargeMandatory").attr('checked', false);
        $('input[id="IsReplanCharges"]').removeAttr("disabled");
         $('input[id="IsReplanCharges"][value="1"]').attr("checked", true);
    }
}

function getRateParameterValues() {
    $.ajax({
        url: "Services/Rate/OtherChargesService.svc/GetRateParameterDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: parseInt($("#hdnRateSNo").val())
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                //
                $('#IssueCarrierSNo').val(myData[0].IssueCarrierSNo);
                $('#Text_IssueCarrierSNo').val(myData[0].IssueCarrier);
                $('input[type="radio"][name="IEIssueCarrier"][value="' + myData[0].IssueCarrierInclude + '"]').attr("checked", true);
                //
                $('#FlightSNo').val(myData[0].FlightNumberSNo);
                $('#Text_FlightSNo').val(myData[0].FlightNumber);
                $('input[type="radio"][name="IEFlight"][value="' + myData[0].FlightNumberInclude + '"]').attr("checked", true);
                //
                $('#TransitStationsSNo').val(myData[0].TransitStationSNo);
                $('#Text_TransitStationsSNo').val(myData[0].TransitStation);
                $('input[type="radio"][name="IETransitStation"][value="' + myData[0].TransitStationInclude + '"]').attr("checked", true);
                //
                $('#AccountSNo').val(myData[0].AgentNameSNo);
                $('#Text_AccountSNo').val(myData[0].AgentName);
                $('input[type="radio"][name="IEAccount"][value="' + myData[0].AgentNameInclude + '"]').attr("checked", true);
                //

                $('#ShipperSNo').val(myData[0].ShipperCodeSNo);
                $('#Text_ShipperSNo').val(myData[0].ShipperCode);
                $('input[type="radio"][name="IEShipper"][value="' + myData[0].ShipperCodeInclude + '"]').attr("checked", true);
                //
                $('#CommoditySNo').val(myData[0].CommoditySNo);
                $('#Text_CommoditySNo').val(myData[0].Commodity);
                $('input[type="radio"][name="IECommodity"][value="' + myData[0].CommodityInclude + '"]').attr("checked", true);
                //
                $('#ProductSNo').val(myData[0].ProductSNo);
                $('#Text_ProductSNo').val(myData[0].Product);
                $('input[type="radio"][name="IEProduct"][value="' + myData[0].ProductInclude + '"]').attr("checked", true);
                //
                $('#SHCSNo').val(myData[0].SHCSNo);
                $('#Text_SHCSNo').val(myData[0].SHCS);
                $('input[type="radio"][name="IESHCS"][value="' + myData[0].SHCSInclude + '"]').attr("checked", true);
                //
                $('#SPHCGroupSNo').val(myData[0].SPHCGroupSNo);
                $('#Text_SPHCGroupSNo').val(myData[0].SPHCGroup);
                $('input[type="radio"][name="IESPHCGroup"][value="' + myData[0].SPHCGroupInclude + '"]').attr("checked", true);
                //
                $('#StartTime').val(myData[0].ETDStartTime);
                $('#EndTime').val(myData[0].ETDEndTime);
                $('input[type="radio"][name="IEEtd"][value="' + myData[0].ETDInclude + '"]').attr("checked", true);
                //
                $('#AgentGroupSNo').val(myData[0].AgentGroupSNo);
                $('#Text_AgentGroupSNo').val(myData[0].AgentGroup);
                $('input[type="radio"][name="IEAgentGroup"][value="' + myData[0].AgentGroupInclude + '"]').attr("checked", true);
                var days = myData[0].DaysOfWeek.split(',');
                if (days.length > 0) {
                    for (var i = 0; i < days.length; i++) {
                        $('input[type="checkbox"][name="Days"][value="' + days[i] + '"]').attr("checked", true);
                    }
                }
                $('input[type="radio"][name="IEDays"][value="' + myData[0].DaysOfWeekInclude + '"]').attr("checked", true);
                
            }
            BindMultipleValues();

            
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function BindMultipleValues() {
    cfi.BindMultiValue("IssueCarrierSNo", $("#Text_IssueCarrierSNo").val(), $("#IssueCarrierSNo").val());
    cfi.BindMultiValue("FlightSNo", $("#Text_FlightSNo").val(), $("#FlightSNo").val());
    cfi.BindMultiValue("TransitStationsSNo", $("#Text_TransitStationsSNo").val(), $("#TransitStationsSNo").val());
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    cfi.BindMultiValue("ShipperSNo", $("#Text_ShipperSNo").val(), $("#ShipperSNo").val());
    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());
    cfi.BindMultiValue("ProductSNo", $("#Text_ProductSNo").val(), $("#ProductSNo").val());
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.BindMultiValue("AgentGroupSNo", $("#Text_AgentGroupSNo").val(), $("#AgentGroupSNo").val());
    cfi.BindMultiValue("SPHCGroupSNo", $("#Text_SPHCGroupSNo").val(), $("#SPHCGroupSNo").val());
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        $('#Text_IssueCarrierSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IEIssueCarrier"]').attr("disabled", true);
        $('#Text_FlightSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IEFlight"]').attr("disabled", true);
        $('#Text_TransitStationsSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IETransitStation"]').attr("disabled", true);
        $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IEAccount"]').attr("disabled", true);
        $('#Text_ShipperSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IEShipper"]').attr("disabled", true);
        $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IECommodity"]').attr("disabled", true);
        $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IEProduct"]').attr("disabled", true);
        $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IESHCS"]').attr("disabled", true);
        $('#Text_AgentGroupSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IEAgentGroup"]').attr("disabled", true);

        $('#Text_SPHCGroupSNo').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="IESPHCGroup"]').attr("disabled", true);
        $("#StartTime").attr("disabled", true);
        $("#EndTime").attr("disabled", true);
        $('input[type="radio"][name="IEEtd"]').attr("disabled", true);
        $('input[type="checkbox"][name="Days"]').attr("disabled", true);
        $('input[type="radio"][name="IEDays"]').attr("disabled", true);
        $("#Text_OriginType").html($("#OriginType").val() + ' - ' + $("#OriginSNo").val());
        $("#Text_OriginAirPortSNo").remove();
        $("#Text_DestinationType").html($("#DestinationType").val() + ' - ' + $("#DestinationSNo").val());
        $("#Text_DestinationAirPortSNo").remove();
        $('[id*="tblRateBase_RateClassSNo_"]').each(function () {
            $("#" + this.id).attr("disabled", true);
        });
        $('[id*="tblRemarks_Remarks_"]').each(function () {
            if ($("#" + this.id).val() != "") {
                $("#" + this.id).attr("disabled", true);
            }
            else {
                $("#" + this.id).closest("tr").hide();
            }
        });
        $('[id*="tblRateBase_RateValue_"]').each(function () {
            $("#" + this.id).attr("disabled", true);
        });
        $("span.k-delete").removeClass('k-icon k-delete');
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('[id*="tblRemarks_Remarks_"]').each(function () {
            if ($("#" + this.id).val() != "") {
                $("#" + this.id).attr("disabled", true);
            }
            else {
                $("#" + this.id).attr('maxlength', '100');

            }
        });
        setTimeout(function () { $("#ValidFrom").data("kendoDatePicker").enable(false); }, 100);
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        var length = $('[id^="tblRemarks_Remarks_"]').length;
        for (var i = 1; i <= length; i++) {
            if (i > 1) {
                $("#tblRemarks_Row_" + i).remove();
            }
            else {
                $("#tblRemarks_Row_" + i).val('');
            }
        }
    }
}

$("#Text_AirlineSNo").select(function () {
    var airlineDetails = $("#AirlineSNo").val();
    if (airlineDetails != "") {
        $("#Text_CurrencySNo").val(airlineDetails.split('-')[1]);
        $("#CurrencySNo").val(airlineDetails.split('-')[2]);
    }
    else {
        $("#Text_CurrencySNo").val('');
        $("#CurrencySNo").val('');
    }
});

$('input[type="submit"][name="operation"]').click(function () {
    var validFromdate = new Date($("#ValidFrom").val());
    var validTodate = new Date($("#ValidTo").val());

    if (validFromdate > validTodate) {
        ShowMessage('warning', 'Warning - Other Charges', 'Valid To Date must be Greater Than Valid From Date', "bottom-right");
        return false;
    }

    //   $("#SlabCount").val(SlabCount);
    //  validationforSlab();
    var ChargeType = $("#ChargeType").val();
    var flag = 1;
    if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
        $("[id^='tblRateBase_RateValue_']").each(function (index) {
            if (parseFloat( $("#tblRateBase_RateValue_" + (index + 1)).val()) <= 0 || $("#tblRateBase_RateValue_" + (index + 1)).val() == "") {
                $("#_temptblRateBase_RateValue_" + (index + 1)).attr('style', 'width: 97.3333px; text-align: right; display: inline-block; border: 1px solid red')
                flag = 0;
            }
        });
    }
    if (flag == 0) {
        ShowMessage('warning', 'Warning - Other Charges', 'Rate value must be greater than zero.', "bottom-right");
        return false;
    }
    var flag2 = 1;
    if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
        $("[id^='tblRateBase_StartWt_']").each(function (index) {
            if ($("#tblRateBase_StartWt_" + (index + 1)).val() <= 0 || $("#tblRateBase_StartWt_" + (index + 1)).val() == "") {
                $("#_temptblRateBase_StartWt_" + (index + 1)).attr('style', 'width: 97.3333px; text-align: right; display: inline-block; border: 1px solid red')
                flag2 = 0;
            }
        });
    }
    if (flag2 == 0) {
        ShowMessage('warning', 'Warning - Other Charges', 'Start Weight must be greater than zero.', "bottom-right");
        return false;
    }

    var flag1 = 1;
    if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
        $("[id^='tblRateBase_EndWt_']").each(function (index) {
            if ($("#tblRateBase_EndWt_" + (index + 1)).val() <= 0 || $("#tblRateBase_EndWt_" + (index + 1)).val() == "") {
                $("#_temptblRateBase_EndWt_" + (index + 1)).attr('style', 'width: 97.3333px; text-align: right; display: inline-block; border: 1px solid red')
                flag1 = 0;
            }
        });
    }
    if (flag1 == 0) {
        ShowMessage('warning', 'Warning - Other Charges', 'End Weight must be greater than zero.', "bottom-right");
        return false;
    }

    var ChargeValue = $("#_tempChargeText").val();
    var minimum = $("#_tempMinimum").val();
    if (ChargeType == 0) {
        if (ChargeValue != "" && ChargeValue == 0) {
            ShowMessage('warning', 'Warning - Other Charges', 'ChargeValue must be greater than zero', "bottom-right");
            return false;
        }
    }
    if (ChargeType == 3) {
        if (ChargeValue != "" && ChargeValue == 0) {
            ShowMessage('warning', 'Warning - Other Charges', 'ChargeValue must be greater than zero', "bottom-right");
            return false;
        }
        if (minimum != "" && minimum == 0) {
            ShowMessage('warning', 'Warning - Other Charges', 'Minimum Value must be greater than zero', "bottom-right");
            return false;
        }
    }

   
});


$('input[type="radio"][name="Charge"]').click(function () {
    if (this.value == "1") {
        $("#spnOCCodeSNo").text(' Due Carrier Charges');
        $("#Text_OCCodeSNo").val('');
        $("#OCCodeSNo").val('');
    }
    else { $("#spnOCCodeSNo").text(' Due Agent Charges'); }
    $("#Text_OCCodeSNo").val('');
    $("#OCCodeSNo").val('');
});

function bindRecords() {
    var Origin = $("#Text_OriginType").val().toUpperCase();
    var Destination = $("#Text_DestinationType").val().toUpperCase();

    if (Origin == "AIRPORT") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode@", ["AirportCode"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginAirport")
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
    }
    if (Destination == "AIRPORT") {
        // Changes By Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode@", ["AirportCode"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginAirport")
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
    }
    if (Origin == "CITY") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_OriginCity")
        // ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
    }
    if (Destination == "CITY") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode@", ["CityCode"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_OriginCity")
        //Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectOrigin, "CityCode");
    }
    if (Origin == "REGION") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName@", ["RegionName"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_Region")
        // Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "RegionName");
    }

    if (Destination == "REGION") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName@", ["RegionName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_Region")
        // Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "RegionName");
    }
    if (Origin == "ZONE") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName@", ["ZoneName"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_Zone")
        //ends        
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "ZoneName");
    }
    if (Destination == "ZONE") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName@", ["ZoneName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_Zone")
        //ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "ZoneName");
    }
    if (Origin == "COUNTRY") {
        // Changes By Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode@", ["CountryCode"])
        var dataSource = GetDataSourceV2("OriginSNo", "OtherCharges_Country")        
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "CountryCode");
    }
    if (Destination == "COUNTRY") {
        // Changes By Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode@", ["CountryCode"])
        var dataSource = GetDataSourceV2("DestinationSNo", "OtherCharges_Country")
        //ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "CountryCode");
    }
}

if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //----------------- codition for destination----------
    switch ($("#Text_DestinationType").val().toUpperCase()) {
        case ("AIRPORT"): $("#DestinationType").val("1")
            break;
        case ("CITY"): $("#DestinationType").val("2")
            break;
        case ("REGION"): $("#DestinationType").val("3")
            break;
        case ("ZONE"): $("#DestinationType").val("4")
            break;
        case ("COUNTRY"): $("#DestinationType").val("5")
            break;

    }
    //----------------- codition for origin----------
    switch ($("#Text_OriginType").val().toUpperCase()) {
        case ("AIRPORT"): $("#OriginType").val("1")
            break;
        case ("CITY"): $("#OriginType").val("2")
            break;
        case ("REGION"): $("#OriginSNo").val("3")
            break;
        case ("ZONE"): $("#OriginType").val("4")
            break;
        case ("COUNTRY"): $("#OriginType").val("5")
            break;

    }

}

$("input[type='submit'][name='operation']").click(function () {
    var SlabCount = "";//$("[id^='tblRateBase_SlabName_']").length;
    $("[id*='tblRateBase_SlabName_']").each(function () {
        SlabCount = SlabCount + this.id.split('_')[2] + ','
    });
    $("#SlabCount").val(SlabCount);
    //  $("[id*='tblRateBase_StartWt_']").attr('disabled', false)
    // $("[id*='tblRateBase_EndWt_']").attr('disabled', false)
    //------------validation for 0 in slab--------


})


function CheckOption(obj) {
    var rowno = $("table[id='tblRateBase'] tbody").find('tr').eq(0).attr("id").split('_')[2]
    //  var nextrow = $("table[id='tblRateBase'] tbody").find('tr').eq(1).attr("id").split('_')[2]
    checkMinSlab();
    //var cuurentrow = obj.split('_')[2]

    //if (rowno == cuurentrow) {
    //    $("#" + obj + " " + " option[value='1']").hide();
    //    //   $("#" + obj + " " + " option[value='2']").hide();
    //    $("#" + obj).val('0');
    //}
    //else {
    //    $("#" + obj + " " + " option[value='0']").hide();
    //    //  $("#" + obj + " " + " option[value='2']").hide();
    //    $("#" + obj).val('1');
    //}

}
function CheckRateValidation(input) {
    if (parseFloat($("#" + input).val()) <= 0 || $("#" + input).val() == "") {
        $("#_temp" + input).attr('style', 'width: 97.3333px; text-align: right; display: inline-block; border: 1px solid red')
        ShowMessage('warning', 'Warning - Rate', 'Rate Value Should Be Greater Than Zero', "bottom-right");
        return false;
    }
}

function checkMinSlab() {
    $('[name*= "tblRateBase_RateClassSNo_"]" option').show();
    $("[id^='tblRateBase_RateClassSNo_']").each(function () {
        if ($(this).val() == "0") {
            $('[name*= "tblRateBase_RateClassSNo_"][id!="' + $(this).attr('id') + '" ] option[value="0"]').hide();
            return false;
        }
    });
}

$(window).on('beforeunload', function () {
    
    $('input[name="operation"]').prop("disabled", "disabled");
});



function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
    //else if (id == "Text_IssueCarrierSNo") {
    //    var UserSNo = userContext.UserSNo;
    //    param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
    //    return param;
    //}
    else if (id == "Text_FlightCarrierSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
    
}
