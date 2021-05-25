$(document).ready(function () {
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStrDestinationSNoingValue("FormAction").toUpperCase() == "DUPLICATE") {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        cfi.ValidateForm();
        $("#IsTaxable").after('Taxable');
        $("#IsCommissionable").after('Commissionable');
        BindAutoComplete();
        //$('#MasterSaveAndNew').after('<input type="button" id="btnSaveDueMaster" name="btnSaveDueMaster" value="Save" class="btn btn-success">');
        //$("input[type='submit'][name='operation']").hide();

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
        $("#ValidFrom").attr('readonly', true);
        $("#ValidTo").attr('readonly', true);


        //$("input[id^=ValidTo]").change(function (e) {
        //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dto = new Date(Date.parse(k));
        //    var validFrom = $(this).attr("id").replace("To", "From");
        //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dfrom = new Date(Date.parse(k));
        //    if (dfrom > dto)
        //        $(this).val("");
        //});

        //$("input[id^=ValidFrom]").change(function (e) {
        //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dfrom = new Date(Date.parse(k));
        //    var validFrom = $(this).attr("id").replace("From", "To");
        //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dto = new Date(Date.parse(k));
        //    if (dfrom > dto)
        //        $(this).val("");

        //});
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            CreateRemarks();
            CreateRateParamGrid();
            $("#divRateBase").hide();
        }
        //$("#btnSaveDueMaster").unbind("click").bind("click", function () {
        //    if (cfi.IsValidSubmitSection()) {
        //        SaveRateAirlineMaster();
        //    }
        //});
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
            var Origin = $("#Text_OriginType").val().toUpperCase();
            var Destination = $("#Text_DestinationType").val().toUpperCase();

            if (Origin == "AIRPORT") {
                var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode@", ["AirportCode"])
                cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
            }
            if (Destination == "AIRPORT") {

                var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode@", ["AirportCode"])
                cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
            }


            if (Origin == "CITY") {

                var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode"])
                cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
            }

            if (Destination == "CITY") {
                // cfi.ResetAutoComplete("DestinationSNo");
                var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode@", ["CityCode"])
                cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectOrigin, "CityCode");
            }

            if (Origin == "REGION") {

                var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName@", ["RegionName"])
                cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "RegionName");


            }

            if (Destination == "REGION") {

                var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName@", ["RegionName"])
                cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "RegionName");

            }

            if (Origin == "ZONE") {

                var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName@", ["ZoneName"])
                cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "ZoneName");


            }

            if (Destination == "ZONE") {


                var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName@", ["ZoneName"])
                cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "ZoneName");

            }

            if (Origin == "COUNTRY") {



                var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode@", ["CountryCode"])
                cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "CountryCode");
            }

            if (Destination == "COUNTRY") {

                var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode@", ["CountryCode"])
                cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "CountryCode");


            }

        }

        //FnGetOriginAC();
        //FnGetDestinationAC();
    }
});

function BindAutoComplete() {
    cfi.AutoComplete("AirlineSNo", "AirlineName", "vwAirlineCurrencyDetails", "SNo", "AirlineName");
    cfi.AutoComplete("OCCodeSNo", "Code,Name", "vwDueCarrierDetails", "SNo", "Name", ["Code", "Name"], onChangeOtherCharges, "contains");
    cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
    cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
    cfi.AutoComplete("OriginSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectOrigin, "contains");
    cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectDestination, "contains");
    cfi.AutoCompleteByDataSource("Active", Active, null, null);
    cfi.AutoCompleteByDataSource("PaymentType", PaymentType, null, null);
    cfi.AutoCompleteByDataSource("ChargeType", ChargeType, onchangeChargeType);
    cfi.AutoCompleteByDataSource("ChargeApply", ChargeApplyOn, null, null);
    cfi.AutoComplete("CurrencySNo", "CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
    // cfi.AutoComplete("AccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
    // cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
    //cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNO", "CommodityCode@", ["CommodityCode", "CommodityDescription"], null, "contains", ",", null, null, null, null, true);
    //cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains", ",");
    //cfi.AutoComplete("SHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");
}


if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    CreateRemarks();
    $("#divRateBase").hide();
    if ($('#Text_ChargeType').html() == "Weight Slab" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        CreateSlabGrid();
        $("#divRateBase").show();
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
            tempMinimum.attr('disabled', true);
            Minimum.attr('disabled', true);
            tempCharge.attr('disabled', false);
            Charge.attr('disabled', false);
            Minimum.removeAttr('data-valid');
            Charge.attr('data-valid', 'required');
            $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
            $("#divRateBase").hide();
        }
        else if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
            Minimum.attr('disabled', true);
            tempMinimum.attr('disabled', true);
            Charge.attr('disabled', true);
            tempCharge.attr('disabled', true);
            CreateSlabGrid();
            $("#divRateBase").show();
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

    function onChangeOtherCharges() {
        if ($("#OCCodeSNo").val() != "") {
            if ($("#OCCodeSNo").val().split('-')[1] == '1') {
                $("#IsOtherChargeMandatory").attr('checked', true);
            }
            else {
                $("#IsOtherChargeMandatory").attr('checked', false);
            }
        }
        else {
            $("#IsOtherChargeMandatory").attr('checked', false);
        }
    }
    CreateRateParamGrid();
    getRateParameterValues();

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
    // CreateSlabGrid(Origin, $("#OriginSNo").val());
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
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectOrigin, "contains");
        }
        else {
            var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode@", ["AirportCode"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "CityCode");
        }
        //$('#Text_OriginSNo').nextAll("span").remove();
        //cfi.AutoComplete("OriginSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
        //$("#Text_OriginSNo").val("");
        //$("#OriginSNo").val("");
    }
    else if (Origin == "CITY") {
        var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "CityCode");

        //$('#Text_OriginSNo').nextAll("span").remove();
        //cfi.AutoComplete("OriginSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        //$("#Text_OriginSNo").val("");
        //$("#OriginSNo").val("");
    }
    else if (Origin == "REGION") {
        var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName@", ["RegionName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "RegionName");

        //$('#Text_OriginSNo').nextAll("span").remove();
        //cfi.AutoComplete("OriginSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], null, "contains");
        //$("#Text_OriginSNo").val("");
        //$("#OriginSNo").val("");
    }
    else if (Origin == "COUNTRY") {
        var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode@", ["CountryCode"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "CountryCode");

        //$('#Text_OriginSNo').nextAll("span").remove();
        //cfi.AutoComplete("OriginSNo", "CountryCode", "vwcountry", "SNo", "CountryCode", ["CountryCode"], null, "contains");
        //$("#Text_OriginSNo").val("");
        //$("#OriginSNo").val("");
    }
    else if (Origin == "ZONE") {
        var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName@", ["ZoneName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, null, "ZoneName");

        //$('#Text_OriginSNo').nextAll("span").remove();
        //cfi.AutoComplete("OriginSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
        //$("#Text_OriginSNo").val("");
        //$("#OriginSNo").val("");
    }
    else {
    }

}

function FnGetDestinationAC(input) {


    $('#Text_DestinationSNo, #DestinationSNo').val('');
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
        }
        else {
            var dataSource = GetDataSource("DestinationSNo", "vwAirport", "SNo", "AirportCode@", ["AirportCode"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "CityCode");
        }
        //$('#Text_DestinationSNo').nextAll("span").remove();
        //cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
        //$("#Text_DestinationSNo").val("");
        //$("#DestinationSNo").val("");
    }
    else if (Destination == "CITY") {
        var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode@", ["CityCode"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "CityCode");

        //$('#Text_DestinationSNo').nextAll("span").remove();
        //cfi.AutoComplete("DestinationSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        //$("#Text_DestinationSNo").val("");
        //$("#DestinationSNo").val("");
    }
    else if (Destination == "REGION") {
        var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName@", ["RegionName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "RegionName");

        //$('#Text_DestinationSNo').nextAll("span").remove();
        //cfi.AutoComplete("DestinationSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], null, "contains");
        //$("#Text_DestinationSNo").val("");
        //$("#DestinationSNo").val("");
    }
    else if (Destination == "COUNTRY") {
        var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode@", ["CountryCode"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "CountryCode");

        //$('#Text_DestinationSNo').nextAll("span").remove();
        //cfi.AutoComplete("DestinationSNo", "CountryCode", "vwcountry", "SNo", "CountryCode", ["CountryCode"], null, "contains");
        //$("#Text_DestinationSNo").val("");
        //$("#DestinationSNo").val("");
    }
    else if (Destination == "ZONE") {
        var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName@", ["ZoneName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, null, "ZoneName");

        //$('#Text_DestinationSNo').nextAll("span").remove();
        //cfi.AutoComplete("DestinationSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
        //$("#Text_DestinationSNo").val("");
        //$("#DestinationSNo").val("");
    }

}











function CheckValidation(input) {

}
function CheckValueValidation(input) {

}
function ChangeUnitType(input) {

}




function CreateRemarks() {
    //divReference
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
function CreateSlabGrid(Origin, OriginSNo) {
    //if (Origin != "undefined" && OriginSNo != "") {
    //    var Wh = Origin + "-" + OriginSNo || "";
    //}
    //else {
    //    Wh = null;
    //}
    //var dbtableName = "RateBase";
    //$("#tbl" + dbtableName).appendGrid({
    //    tableID: "tbl" + dbtableName,
    //    contentEditable: true,
    //    masterTableSNo: $("#hdnRateSNo").val() || 1,
    //    currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
    //    isGetRecord: true,
    //    servicePath: "./Services/Rate/OtherChargesService.svc",
    //    getRecordServiceMethod: "GetRateSLAB",
    //    deleteServiceMethod: "",
    //    caption: "Rate Slab Information",
    //    initRows: 1,
    //    hideRowNumColumn: true,
    //    columns: [
    //             { name: "SNo", type: "hidden" },
    //             { name: "SlabName", display: "Slab Name", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "150px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
    //             { name: "StartWt", display: "Start Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
    //             { name: "EndWt", display: "End Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "number" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
    //             { name: "RateClassSNo", display: "Type", type: "select", ctrlAttr: {  maxlength: 100 }, ctrlOptions: { 0: "M", 1: "N", 2: "Q" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
    //             { name: "RateValue", display: "Rate", type: "text", ctrlAttr: { controltype: "decimal3", maxlength: 11 }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },

    //    ]
    //    //,
    //    //afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
    //    //    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
    //    //        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
    //    //        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

    //    //        $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
    //    //        $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

    //    //        $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
    //    //        $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);

    //    //        $(tr).find("input[id^='_temptblRateBase_EndWt_']").attr("disabled", true);
    //    //    });
    //    //},
    //    //isPaging: true,
    //    //hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    //});
    //SlabCount = $("[id^='tblRateBase_SlabName_']").length;
    //$("#SlabCount").val(SlabCount);
    //$("tr[id^='tblRateBase_Row']").each(function (row, tr) {
    //    $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
    //    $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

    //    $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
    //    $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

    //    $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
    //    $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);
    //    //if ($(tr).find("input[id^='tblRateBase_SlabName_']").val() == 'Minimum') {
    //    //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='1']").remove();
    //    //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='2']").remove();
    //    //}
    //    //else if ($(tr).find("input[id^='tblRateBase_SlabName_']").val() == 'Normal') {
    //    //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='0']").remove();
    //    //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='2']").remove();
    //    //} else {
    //    //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='0']").remove();
    //    //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='1']").remove();
    //    //}
    //});
    //$('#tblRateBase button.insert,#tblRateBase button.remove').hide();
    //$('#tblRateBase button.append,#tblRateBase button.removeLast').hide();

    ////$("[id^='tblRateBase_SlabName_']").each(function () {
    ////    alert(this.id);
    ////});


    var dbTableName = 'RateBase';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: true,
        tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: $("#hdnRateSNo").val() || 1,
        currentPage: 1, itemsPerPage: 50, whereCondition: 0, sort: '',
        servicePath: 'Services/Rate/OtherChargesService.svc',
        getRecordServiceMethod: 'GetRateSLAB',
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: 'Rate Slab Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
                  { name: "SNo", type: "hidden" },
                  { name: "SlabName", display: "Slab Name", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "150px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                  { name: "StartWt", display: "Start Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                  { name: "EndWt", display: "End Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                  { name: "RateClassSNo", display: "Type", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "M", 1: "N", 2: "Q" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                  { name: "RateValue", display: "Rate", type: "text", ctrlAttr: { controltype: "decimal3", maxlength: 11 }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },

        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true, remove: true },
        //hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }

    });
    SlabCount = $("[id^='tblRateBase_SlabName_']").length;
    $("#SlabCount").val(SlabCount);
    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

        $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

        $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);
        //if ($(tr).find("input[id^='tblRateBase_SlabName_']").val() == 'Minimum') {
        //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='1']").remove();
        //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='2']").remove();
        //}
        //else if ($(tr).find("input[id^='tblRateBase_SlabName_']").val() == 'Normal') {
        //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='0']").remove();
        //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='2']").remove();
        //} else {
        //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='0']").remove();
        //    $("#tblRateBase_RateClassSNo_" + (row + 1) + " option[value='1']").remove();
        //}
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
                 {
                     name: 'ULDSNo', display: 'ULD Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vwRateULDType', textColumn: 'ULDName', keyColumn: 'SNo', filterCriteria: "contains"
                 },
                 {
                     name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'RateClass', textColumn: 'RateClassCode', keyColumn: 'SNo', filterCriteria: "contains"
                 },
                  { name: "StartWt", display: "Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },

                 //{ name: "StartWt", display: "Start Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 //{ name: "EndWt", display: "End Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, onblur: "return CheckValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 11 }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });


}

function SaveRateAirlineMaster() {

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
        //TransitStationSNo: $("#TransitStationSNo").val(),
        Remark: null,
    }
    //Ratearray.push(RateViewModel);
    //var RateRemarks = $("#tblRemarks").serializeToJSON();
    $("tr[id^='tblRemarks_Row']").each(function (row, tr) {
        var RateRemarksViewModel = {
            SNo: 0,
            RateSNo: 0,
            Remark: $(tr).find("input[id^='tblRemarks_Remarks_']").val()
        }
        RateRemarksarray.push(RateRemarksViewModel);

    });


    //var RateSLABInfo = $("#tblRateBase").serializeToJSON();
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

    //var RateULDSLABInfo = $("#tblULDRate").serializeToJSON();

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
            // Based: 0,
        }
        RateULDSLABInfoArray.push(RateULDSLABViewModel);
    });

    //var RateBaseParam = $("#tblRateParam").serializeToJSON();
    var SelectedDays = "";

    $("input[type='checkbox'][id^='Days']").each(function () {

        if ($("input[name='Days'][value=0]:checked").val()) {
            SelectedDays = "1,2,3,4,5,6,7";
        }
        else {
            if ($("input[name='Days'][value=0]:checked").val() == undefined) {
                //var chkLen = $("input[name='Days']:checked").length;

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
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Issue Carrier</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='IssueCarrierSNo' name='IssueCarrierSNo' tabindex='0'  /> <input type=text id='Text_IssueCarrierSNo' name='Text_IssueCarrierSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEIssueCarrier' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEIssueCarrier' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Flight Number</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='FlightSNo' name='FlightSNo' tabindex='0'  /> <input type=text id='Text_FlightSNo' name='Text_FlightSNo'  tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEFlight' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEFlight' />Exclude </label> </td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>ETD</strong></td><td align=left style='padding-left:11px;' class='ui-widget-content'><span class='k-widget k-timepicker k-header' style='width: 85px; height: 18px;'><span class='k-picker-wrap k-state-default'><input type='text' id='StartTime' name='StartTime' maxlength='5' data-role='timepicker' placeholder='Start Time' class='k-input' style='width:85px ; height: 15px;'><span unselectable='on' class='k-select'><span unselectable='on' class='k-icon k-i-clock'>select</span></span></span></span>&nbsp;<span class='k-widget k-timepicker k-header' style='width: 85px; height: 15px;'><span class='k-picker-wrap k-state-default'><input type='text' id='EndTime' name='EndTime' maxlength='5' placeholder='End Time' data-role='timepicker' class='k-input' style='width: 85px; height: 15px;'><span unselectable='on' class='k-select'><span unselectable='on' class='k-icon k-i-clock'>select</span></span></span></span> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEEtd' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEEtd' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Day of Week</strong>  </td><td class='ui-widget-content'><input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='0'>All<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='1'>Sun<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='2'>Mon<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='3'>Tue<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='4'>Wed<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='5'>Thu<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='6'>Fri<input type='checkbox' tabindex='17' class='' name='Days' id='Days' validatename='Days[]' value='7'>Sat</td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEDays' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEDays' />Exclude </label></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Transit Station</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='TransitStationsSNo' name='TransitStationsSNo' tabindex='0'  /> <input type=text id='Text_TransitStationsSNo' name='Text_TransitStationsSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IETransitStation' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IETransitStation' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Product Type</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='ProductSNo' name='ProductSNo' tabindex='0'  /> <input type=text id='Text_ProductSNo' name='Text_ProductSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEProduct' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEProduct' />Exclude </label></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Agent Group</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='AgentGroupSNo' name='AgentGroupSNo' tabindex='0'/><input type=text id='Text_AgentGroupSNo' name='Text_AgentGroupSNo' tabindex='0' controltype='autocomplete'/></td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEAgentGroup' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEAgentGroup' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Commodity Code</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='CommoditySNo' name='CommoditySNo' tabindex='0'  /> <input type=text id='Text_CommoditySNo' name='Text_CommoditySNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IECommodity' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IECommodity' />Exclude </label> </td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Agent Name</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='AccountSNo' name='AccountSNo' tabindex='0'/><input type=text id='Text_AccountSNo' name='Text_AccountSNo' tabindex='0' controltype='autocomplete'/></td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEAccount' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEAccount' />Exclude </label> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Special Handling Code</strong>  </td><td align=left style='padding-left:11px;'  class='ui-widget-content'><input type='hidden' id='SHCSNo' name='SHCSNo' tabindex='0'  /> <input type=text id='Text_SHCSNo' name='Text_SHCSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IESHCS' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IESHCS' />Exclude </label></td></tr>"
                      + "<tr style='height: 50px;'><td align=left style='padding-left:11px;' class='ui-widget-content'><strong>Shipper Code</strong>  </td><td align=left style='padding-left:11px;' class='ui-widget-content'><input type='hidden' id='ShipperSNo' name='ShipperSNo' tabindex='0'  /> <input type=text id='Text_ShipperSNo' name='Text_ShipperSNo' tabindex='0'   controltype='autocomplete'/> </td><td align=left style='padding-left:11px;' class='ui-widget-content'><label><input type='radio' class='radio' value='1' name='IEShipper' />Include </label>&nbsp;<label><input type='radio' class='radio' value='0' name='IEShipper' />Exclude </label> </td><td align=left style='padding-left:11px;'  class='ui-widget-content'></td><td align=left style='padding-left:11px;'  class='ui-widget-content'></td><td align=left style='padding-left:11px;'  class='ui-widget-content'></td></tr>";
    var dbtableName = "RateParam";
    $("#tbl" + dbtableName).append(RateParamHtml);
    cfi.AutoComplete("FlightCarrierSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");
    cfi.AutoComplete("IssueCarrierSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");
    cfi.AutoComplete("FlightSNo", "FlightNo", "getflightNo", "SNo", "FlightNo@", ["FlightNo"], null, "contains", ",");
    cfi.AutoComplete("AgentGroupSNo", "AgentGroupName", "RateAirlineAgentGroup", "SNo", null, null, null, "contains", ",");
    cfi.AutoComplete("TransitStationsSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode@", ["AirportCode", "AirportName"], null, "contains", ",");
    cfi.AutoComplete("AccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
    cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSShipper", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
    cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNO", "CommodityCode@", ["CommodityCode", "CommodityDescription"], null, "contains", ",", null, null, null, null, true);
    cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains", ",");
    cfi.AutoComplete("SHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");
    $('[id^="StartTime"]').kendoTimePicker({
        format: "HH", interval: 60
    });
    //$('[id^="StartTime"]').kendoTimePicker({ timeFormat: 'h' });
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
        //$('input[type=radio][name^=IE][value=1]').removeAttr('checked');
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

    if (textId.indexOf("Text_AirlineSNo") >= 0) {
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
        cfi.setFilter(filter5, "AccountTypeName", "eq", "FORWARDER");
        filterAccountSNo = cfi.autoCompleteFilter(filter5);
        return filterAccountSNo;
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
    var Charge = $('#_tempChargeText');
    var Maximum = $('#_tempMaximum');
    Minimum.val('');
    Charge.val('');
    Maximum.val('');
    Minimum.attr('data-valid', 'required');
    Maximum.attr('data-valid', 'required');
    Charge.attr('data-valid', 'required');
    $('td[title="Enter Minimum Value"]').html("Minimum Value");
    $('td[title="Enter Charge Value"]').html("Charge Value");
    $('td[title="Enter Maximum Value"]').html("Maximum Value");
    if (ChargeType == 0) {
        Minimum.attr('disabled', true);
        Charge.attr('disabled', false);
        Maximum.attr('disabled', true);
        Minimum.removeAttr('data-valid');
        Charge.attr('data-valid', 'required');
        $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
        Maximum.removeAttr('data-valid');
        $("#divRateBase").hide();
    }
    else if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
        Minimum.attr('disabled', true);
        Charge.attr('disabled', true);
        Maximum.attr('disabled', true);
        CreateSlabGrid();
        $("#divRateBase").show();
    }
    else {
        Minimum.attr('disabled', false);
        Charge.attr('disabled', false);
        Maximum.attr('disabled', false);
        $('td[title="Enter Minimum Value"]').html("<span style = 'color:red'>*</span> Minimum Value");
        $('td[title="Enter Charge Value"]').html("<span style = 'color:red'>*</span> Charge Value");
        $('td[title="Enter Maximum Value"]').html("<span style = 'color:red'>*</span> Maximum Value");
        Minimum.attr('data-valid', 'required');
        Charge.attr('data-valid', 'required');
        Maximum.attr('data-valid', 'required');
        $("#divRateBase").hide();
    }
}

function onChangeOtherCharges() {
    if ($("#OCCodeSNo").val() != "") {
        if ($("#OCCodeSNo").val().split('-')[1] == '1') {
            $("#IsOtherChargeMandatory").attr('checked', true);
        }
        else {
            $("#IsOtherChargeMandatory").attr('checked', false);
        }
    }
    else {
        $("#IsOtherChargeMandatory").attr('checked', false);
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

//DaysOfWeek,DaysOfWeekSNo, DaysOfWeekInclude

function BindMultipleValues() {
    // cfi.BindMultiValue("FlightCarrierSNo", $("#Text_FlightCarrierSNo").val(), $("#FlightCarrierSNo").val());
    cfi.BindMultiValue("IssueCarrierSNo", $("#Text_IssueCarrierSNo").val(), $("#IssueCarrierSNo").val());
    cfi.BindMultiValue("FlightSNo", $("#Text_FlightSNo").val(), $("#FlightSNo").val());
    cfi.BindMultiValue("TransitStationsSNo", $("#Text_TransitStationsSNo").val(), $("#TransitStationsSNo").val());
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    cfi.BindMultiValue("ShipperSNo", $("#Text_ShipperSNo").val(), $("#ShipperSNo").val());
    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());
    cfi.BindMultiValue("ProductSNo", $("#Text_ProductSNo").val(), $("#ProductSNo").val());
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.BindMultiValue("AgentGroupSNo", $("#Text_AgentGroupSNo").val(), $("#AgentGroupSNo").val());
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
        //$('[id*="tblRemarks_Remarks_"]').each(function () {
        //    if ($("#" + this.id).val() != "") {
        //        $("#" + this.id).attr("disabled", false);
        //        $("#" + this.id).val('');
        //        $("#" + this.id).attr('data-valid', 'required');
        //    }
        //    else {
        //        $("#" + this.id).remove();
        //        $("#tblRemarks_Row_" + this.id.split('_')[2]).remove();
        //    }
        //});
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

$('input[type="submit"][name="operation"][value="Save"]').click(function () {
    var validFromdate = new Date($("#ValidFrom").val());
    var validTodate = new Date($("#ValidTo").val());

    if (validFromdate > validTodate) {
        ShowMessage('warning', 'Warning - Other Charges', 'Valid To Date must be Greater Than Valid From Date', "bottom-right");
        return false;
    }

    $("#SlabCount").val(SlabCount);
    var ChargeType = $("#ChargeType").val();
    var flag = 1;
    if (ChargeType == 1 || ChargeType == 4 || ChargeType == 5) {
        $("[id^='tblRateBase_RateValue_']").each(function (index) {
            if ($("#tblRateBase_RateValue_" + (index + 1)).val() == 0) {
                flag = 0;
                // break;
            }
        });
    }
    if (flag == 0) {
        ShowMessage('warning', 'Warning - Other Charges', 'Rate value must be greater than zero.', "bottom-right");
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

$('input[type="submit"][name="operation"][value="Update"]').click(function () {
    var validFromdate = new Date($("#ValidFrom").val());
    var validTodate = new Date($("#ValidTo").val());

    if (validFromdate > validTodate) {
        ShowMessage('warning', 'Warning - Other Charges', 'Valid To Date must  be Greater Than Valid From Date', "bottom-right");
        return false;
    }
});

//function CheckRate(id) {
//    var idValue = $("#" + id).val();
//    //$('[id^="tblRemarks_Remarks_"]').not(idNew)
//    $('[id^="tblRateBase_RateClassSNo_"]').each(function (i, obj) {
//        if (this.id != id) {
//            $("#" + this.id + " option[value='" + idValue + "']").remove();
//        }
//        else {

//        }
//    });
//    //$.each('[id^="tblRateBase_RateClassSNo_"]', function () {
//    //    alert(this.id);

//    //});

//    //$('[id^="tblRemarks_Remarks_"] : not(' +idNew+')'.each(function() {
//    //    alert(this.id);
//    //});
//    //$('[id^="tblRemarks_Remarks_"]')
//}

//$("#tblRateBase_RateClassSNo_1 option[value='N'][value='Q']").remove();
//}