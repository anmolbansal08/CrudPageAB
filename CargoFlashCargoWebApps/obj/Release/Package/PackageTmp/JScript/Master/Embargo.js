/// <reference path="../../Scripts/common.js" />

//AUTOCOMPLETE

$(document).ready(function () {
    cfi.ValidateForm();
    // DestinationFunction();
    // $("#Text_AirlineSNo").attr("placeholder", "All");
    // $("#Text_AccountSNo").attr("placeholder", "All");
    var FreightTypeList = [{ Key: "0", Text: "PP" }, { Key: "1", Text: "CC" }]
    // By Arman Ali  REMOVE  { Key: "1", Text: "Transit" }  
    var ApplicableOnList = [{ Key: "0", Text: "ALL" }, { Key: "2", Text: "Origin" }, { Key: "3", Text: "Destination" }]
    var PeriodList = [{ Key: "0", Text: "Weekly" }, { Key: "1", Text: "Fortnightly" }, { Key: "2", Text: "Monthly" }, { Key: "3", Text: "Annually" }]
    cfi.AutoCompleteByDataSource("FreightType", FreightTypeList);
    // Added by Tarun Kumar singh
    $('span#DaysOfOps').after('<input type="checkbox" tabindex="17" class="" name="Day0" id="Day0" onclick="handleClick();" validatename="Days[]" value="8">ALL '
        + '<input type="checkbox" tabindex="17" class="" name="Day1" id="Day1" onclick="changeClick();" validatename="Days[]" value="1">Sun'
        + '    <input type="checkbox" tabindex="17" class="" name="Day2" id="Day2" onclick="changeClick();" validatename="Days[]" value="2">Mon'
         + '   <input type="checkbox" tabindex="17" class="" name="Day3" id="Day3" onclick="changeClick();" validatename="Days[]" value="3">Tue'
         + '   <input type="checkbox" tabindex="17" class="" name="Day4" id="Day4" onclick="changeClick();" validatename="Days[]" value="4">Wed'
         + '   <input type="checkbox" tabindex="17" class="" name="Day5" id="Day5" onclick="changeClick();" validatename="Days[]" value="5">Thu'
         + '   <input type="checkbox" tabindex="17" class="" name="Day6" id="Day6" onclick="changeClick();" validatename="Days[]" value="6">Fri'
         + '   <input type="checkbox" tabindex="17" class="" name="Day7" id="Day7" onclick="changeClick();" validatename="Days[]" value="7" >Sat');
    ////////tarun kumar singh
    // $('input[name="Days"]').attr('checked', true);
    /////////////($('input[type="checkbox"][value="8"]').attr('checked'))
    cfi.AutoCompleteByDataSource("Period", PeriodList);
    cfi.AutoCompleteByDataSource("ApplicableOn", ApplicableOnList, SetEmbargo);
    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        // disable from webformpage 
        // $(".btn-danger").hide();
    }
    cfi.AutoComplete("AccountSNo", "Name", "vAccount", "SNo", "Name", ["Name"], null, "contains", ",");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("OriginCountrySNo", "CountryCode,CountryName", "vwCountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OriginFunction, "contains");
    cfi.AutoComplete("DestinationCountrySNo", "CountryCode,CountryName", "vwCountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], DestinationFunction, "contains");
    cfi.AutoComplete("OriginCitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], OriginFunction, "contains");
    cfi.AutoComplete("DestinationCitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], DestinationFunction, "contains");
    cfi.AutoComplete("OriginAirportSNo", "AirportCode,AirportName", "VAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OriginFunction, "contains");
    cfi.AutoComplete("DestinationAirportSNo", "AirportCode,AirportName", "VAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], DestinationFunction, "contains");

    cfi.AutoComplete("SHC", "SNo,Code", "vwsphc", "SNo", "Code", ["Code"], null, "contains", ",");
    cfi.AutoComplete("Commodity", "CommodityCode,CommodityDescription", "vwCommodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains", ",");
    cfi.AutoComplete("Product", "ProductName", "vwProduct", "SNo", "ProductName", ["ProductName"], null, "contains", ",");
    cfi.AutoComplete("Aircraft", "AircraftType,AirlineName", "vwAirCraftForEmbargo", "SNo", "AircraftType", ["AircraftType", "AirlineName"], null, "contains", ",");
    cfi.AutoComplete("Flight", "FlightNo", "VDailyFlightForEmbargo", "SNo", "FlightNo", ["FlightNo"], FlightSelect, "contains", ",", null, null, null, null);

    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    cfi.BindMultiValue("SHC", $("#Text_SHC").val(), $("#SHC").val());
    cfi.BindMultiValue("Product", $("#Text_Product").val(), $("#Product").val());
    cfi.BindMultiValue("Aircraft", $("#Text_Aircraft").val(), $("#Aircraft").val());
    cfi.BindMultiValue("Flight", $("#Text_Flight").val(), $("#Flight").val());
    cfi.BindMultiValue("Commodity", $("#Text_Commodity").val(), $("#Commodity").val());


    if (!(getQueryStringValue("FormAction").toUpperCase() == "DELETE")) {
        if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT") || (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")) {
            var OriginCountry = $("#Text_OriginCountrySNo").val();
            var OriginCountrySNo = $("#OriginCountrySNo").val();
            var DestinationCountry = $("#Text_DestinationCountrySNo").val();
            var DestinationCountrySNo = $("#DestinationCountrySNo").val();
            var OriginCity = $("#Text_OriginCitySNo").val();
            var OriginCitySNo = $("#OriginCitySNo").val();
            var DestinationCity = $("#Text_DestinationCitySNo").val();
            var DestinationCitySNo = $("#DestinationCitySNo").val();
            var OriginAirport = $("#Text_OriginAirportSNo").val();
            var OriginAirportSNo = $("#OriginAirportSNo").val();
            var DestinationAirport = $("#Text_DestinationAirportSNo").val();
            var DestinationAirportSNo = $("#DestinationAirportSNo").val();

            if (OriginCountrySNo != "" && OriginCountrySNo != 0) {
                cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
            }
            else if (OriginCitySNo != "" && OriginCitySNo != 0) {
                cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
            }
            else if (OriginAirportSNo != "" && OriginAirportSNo != 0) {
                cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
            }

            if (DestinationCountrySNo != "" && DestinationCountrySNo != "0") {
                cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
            }
            else if (DestinationCitySNo != "" && DestinationCitySNo != 0) {
                cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
            }
            else if (DestinationAirportSNo != "" && DestinationAirportSNo != 0) {
                cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
            }
        }
        SetEmbargo();
    }
    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    $("span#DaysOfOps").hide();
    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#ValidFrom").val("");
        $("#ValidTo").val("");
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    $("#ValidTo").val(getDateNextYear());
    //}
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($("#Text_AirlineSNo").text() == "") {
            $("#Text_AirlineSNo").text("ALL");
        }
        if ($("#Text_AccountSNo").text() == "") {
            $("#Text_AccountSNo").text("ALL");
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        var a = $("#DaysOfOps").val();
        var countday = 0;
        for (i = 1; i < 8; i++) {
            if (a.indexOf(i) != -1) {
                $("#Day" + i).attr('checked', true);
                countday += 1;
            }
        }
        if (countday == 7) {
            $("#Day0").attr('checked', true);
        }
    }
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    $(document).on('drop', function () {
        return false;
    });

    if ($("input:radio[name='ConfigType']:checked").val() == 0) {
        $('#Text_Period').data("kendoAutoComplete").enable(false);
        var LimitOnList = [{ Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }];
        cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
    }
    else {
        var LimitOnList = [{ Key: "0", Text: "No of Shipment" }, { Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }];
        cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
        $('#Text_Period').data("kendoAutoComplete").enable(true);
    }
});



function ValidatePeriod() {
    if ($("input:radio[name='ConfigType']:checked").val() == 0) {


    }
    else {
        if ($("#Text_LimitOn").val() == "No of Shipment") {
            $("#Text_Period").removeAttr('data-valid');
            $("#Text_Period").removeAttr('data-valid-msg');
        }
        else {
            $("#Text_Period").attr('data-valid', 'required');
            $("#Text_Period").attr('data-valid-msg', 'Period cannot be blank');
        }
    }
    return false;
}
function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}
function OriginFunction(id, val) {
    var id = id;
    var flag = 'F';
    id = id.replace("Text_", "");
    var val = val;
    if ($('#ApplicableOn').val() != '3') {
        if (id == "OriginCountrySNo") {
            if (val != '') {
                cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
                $("#OriginAirportSNo").removeAttr('data-valid');
                $("#OriginAirportSNo").removeAttr('data-valid-msg');
                $("#OriginCitySNo").removeAttr('data-valid');
                $("#OriginCitySNo").removeAttr('data-valid-msg');

                flag = 'T';
            }
        }
        else if (id == "OriginCitySNo") {
            if (val != '') {
                cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
                $("#OriginAirportSNo").removeAttr('data-valid');
                $("#OriginAirportSNo").removeAttr('data-valid-msg');
                $("#OriginCountrySNo").removeAttr('data-valid');
                $("#OriginCountrySNo").removeAttr('data-valid-msg');

                flag = 'T';
            }

        }
        else if (id == "OriginAirportSNo") {
            if (val != '') {
                cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
                $("#OriginCountrySNo").removeAttr('data-valid');
                $("#OriginCountrySNo").removeAttr('data-valid-msg');
                $("#OriginCitySNo").removeAttr('data-valid');
                $("#OriginCitySNo").removeAttr('data-valid-msg');

                flag = 'T';
            }
        }

        if (flag == 'F') {
            cfi.EnableAutoComplete("OriginAirportSNo", true, false, "White");
            cfi.EnableAutoComplete("OriginCitySNo", true, false, "White");
            cfi.EnableAutoComplete("OriginCountrySNo", true, false, "White");


            $("#Text_OriginCountrySNo").attr('data-valid', 'required');
            $("#Text_OriginCountrySNo").attr('data-valid-msg', 'Destination Country OR Airport OR City can not be blank.');

            $('#divMultiFlight ul li').remove();

        }
    }

}
function DestinationFunction(id, val) {
    var id = id;
    var flag = 'F';
    id = id.replace("Text_", "");
    var val = val;
    if ($('#ApplicableOn').val() != '2') {


        if (id == "DestinationCountrySNo") {
            if (val != '') {
                cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
                $("#DestinationAirportSNo").removeAttr('data-valid');
                $("#DestinationAirportSNo").removeAttr('data-valid-msg');
                $("#DestinationCitySNo").removeAttr('data-valid');
                $("#DestinationCitySNo").removeAttr('data-valid-msg');


                flag = 'T';
            }
        }
        else if (id == "DestinationCitySNo") {
            if (val != '') {
                cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
                $("#DestinationAirportSNo").removeAttr('data-valid');
                $("#DestinationAirportSNo").removeAttr('data-valid-msg');
                $("#DestinationCountrySNo").removeAttr('data-valid');
                $("#DestinationCountrySNo").removeAttr('data-valid-msg');

                flag = 'T';
            }
        }
        else if (id == "DestinationAirportSNo") {
            if (val != '') {
                cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
                $("#DestinationCitySNo").removeAttr('data-valid');
                $("#DestinationCitySNo").removeAttr('data-valid-msg');
                $("#DestinationCountrySNo").removeAttr('data-valid');
                $("#DestinationCountrySNo").removeAttr('data-valid-msg');

                flag = 'T';
            }
        }

        if (flag == 'F') {
            cfi.EnableAutoComplete("DestinationAirportSNo", true, false, "white");
            cfi.EnableAutoComplete("DestinationCitySNo", true, false, "white");
            cfi.EnableAutoComplete("DestinationCountrySNo", true, false, "white");

            $("#Text_DestinationCountrySNo").attr('data-valid', 'required');
            $("#Text_DestinationCountrySNo").attr('data-valid-msg', 'Origin Country OR Airport OR City can not be blank.');
        }
    }

}


//tarun kumar singh

function handleClick() {
    if ($('#Day0').is(":checked")) {
        $('input[type="checkbox"]').attr('checked', true);
    }

}

function changeClick() {
    if ($('input[id^="Day"][value!="8"]').not(":checked")) {

        $('#Day0').attr('checked', false);
    }

}




$("input:radio[name='ConfigType']").on('change', function () {
    if (this.value == "1") {
        $('#ValidFrom').removeAttr("data-valid");
        $('#ValidTo').removeAttr("data-valid");
        $('#Period').attr("data-valid", "required");
        $('#Text_Period').attr("data-valid", "required");
        $('#Text_Period').attr("data-valid-msg", "Period cannot be blank");
        $('#Text_Period').data("kendoAutoComplete").enable(true);
        var LimitOnList = [{ Key: "0", Text: "No of Shipment" }, { Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }];
        cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
    }
    else {
        $('#ValidFrom').attr("data-valid", "required");
        $('#ValidTo').attr("data-valid", "required");
        $('#Period').removeAttr("data-valid");
        $('#Text_Period').removeAttr("data-valid");
        $('#Text_Period').removeAttr("data-valid-msg");
        $('#Text_Period').data("kendoAutoComplete").enable(false);
        var LimitOnList = [{ Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }];
        cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
    }
});
function FlightSelect(obj) {
    if (!($("#Text_OriginCountrySNo").val() != "" || $("#Text_OriginCitySNo").val() != "" || $("#Text_OriginAirportSNo").val() != "")) {
        alert("Please select origin.");
        $("#Text_Flight").val('');
    }
}
//FILTER
function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_OriginCountrySNo") {
        cfi.setFilter(filterEmbargo, "CountryCode", "neq", $("#Text_DestinationCountrySNo").val().split("-")[0])
        var OriginCountryAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCountryAutoCompleteFilter;
    }
    else if (textId == "Text_DestinationCountrySNo") {
        cfi.setFilter(filterEmbargo, "CountryCode", "neq", $("#Text_OriginCountrySNo").val().split("-")[0])
        var DestinationCountryAutoCompleteFilter1 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationCountryAutoCompleteFilter1;
    }
    else if (textId == "Text_OriginAirportSNo") {
        cfi.setFilter(filterEmbargo, "AirportCode", "neq", $("#Text_DestinationAirportSNo").val().split("-")[0])
        var OriginGlobalZoneAutoCompleteFilter4 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginGlobalZoneAutoCompleteFilter4;
    }
    else if (textId == "Text_DestinationAirportSNo") {
        cfi.setFilter(filterEmbargo, "AirportCode", "neq", $("#Text_OriginAirportSNo").val().split("-")[0])
        var DestinationGlobalZoneAutoCompleteFilter5 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationGlobalZoneAutoCompleteFilter5;
    }
    else if (textId == "Text_OriginCitySNo") {
        cfi.setFilter(filterEmbargo, "CityCode", "neq", $("#Text_DestinationCitySNo").val().split("-")[0])
        var OriginLocalZoneAutoCompleteFilter6 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginLocalZoneAutoCompleteFilter6;
    }
    else if (textId == "Text_DestinationCitySNo") {
        cfi.setFilter(filterEmbargo, "CityCode", "neq", $("#Text_OriginCitySNo").val().split("-")[0])
        var DestinationLocalZoneAutoCompleteFilter7 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationLocalZoneAutoCompleteFilter7;
    }
    else if (textId == "Text_Flight") {
        if ($("#OriginCountrySNo").val() != "") {
            cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#OriginCountrySNo").val())
            cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Flight").data("kendoAutoComplete").key())
            //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        }
        if ($("#OriginCitySNo").val() != "") {
            cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#OriginCitySNo").val())
            cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Flight").data("kendoAutoComplete").key())
            //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        }
        if ($("#OriginAirportSNo").val() != "") {
            cfi.setFilter(filterEmbargo, "AirportSNo", "eq", $("#OriginAirportSNo").val())
            cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Flight").data("kendoAutoComplete").key())
            //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        }
        //if ($("#AirlineSNo").val() != "") {
        //    cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
        //    //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        //}
        var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationLocalZoneAutoCompleteFilter8;


    }
    else if (textId == "Text_SHC") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_SHC").data("kendoAutoComplete").key());
        filterSHC = cfi.autoCompleteFilter(filterEmbargo);
        return filterSHC;
    }
    else if (textId == "Text_Product") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Product").data("kendoAutoComplete").key());
        filterProduct = cfi.autoCompleteFilter(filterEmbargo);
        return filterProduct;
    }
    else if (textId == "Text_Commodity") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Commodity").data("kendoAutoComplete").key());
        filterCommodity = cfi.autoCompleteFilter(filterEmbargo);
        return filterCommodity;
    }
    else if (textId == "Text_Aircraft") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Aircraft").data("kendoAutoComplete").key());
        filterAircraft = cfi.autoCompleteFilter(filterEmbargo);
        return filterAircraft;
    }

    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }

}
// Added By Arman Ali  
//Purpose : For Checking required field on button click event

$('input[name="operation"]').click(function () {
  

    SetEmbargo();
    if ($("#Text_LimitOn").val() != "") {
        if ($('#MaxWeight').val() < 0.01) {
            ShowMessage('warning', 'warning - Embargo', "Value cannot be Zero ", "bottom-right");
            return false;
        }

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        AuditLogSaveNewValue("tbl");
    }



});


//End
//== added by arman ali Date : 24 Apr 2017=====
//== for changing origin and destination on select of Applicabletype
function SetEmbargo() {
    if ($('#ApplicableOn').val() == '0') {
        $("#Text_DestinationCountrySNo").attr('data-valid', 'required');
        $("#Text_DestinationCountrySNo").attr('data-valid-msg', 'Origin Country OR Airport OR City can not be blank.');
        $("#Text_OriginCountrySNo").attr('data-valid', 'required');
        $("#Text_OriginCountrySNo").attr('data-valid-msg', 'Destination Country OR Airport OR City can not be blank.');
        enableDestination(2);
        enableOrigin(2);
    }
    else if ($('#ApplicableOn').val() == '2') {
        $("#Text_OriginCountrySNo").attr('data-valid', 'required');
        $("#Text_OriginCountrySNo").attr('data-valid-msg', 'Origin Country OR Airport OR City can not be blank.');
        $("#Text_DestinationCountrySNo").removeAttr('data-valid');
        $("#Text_DestinationCountrySNo").removeAttr('data-valid-msg');
        enableDestination(1);
        enableOrigin(2);
        $('[type="text"][id*="Destination"]').val('');
        $('[type="hidden"][id*="Destination"]').val('0');
    }
    else if ($('#ApplicableOn').val() == '3') {
        $("#Text_DestinationCountrySNo").attr('data-valid', 'required');
        $("#Text_DestinationCountrySNo").attr('data-valid-msg', 'Destination Country OR Airport OR City can not be blank.');
        $("#Text_OriginCountrySNo").removeAttr('data-valid');
        $("#Text_OriginCountrySNo").removeAttr('data-valid-msg');
        enableDestination(2);
        enableOrigin(1);
        $('[type="text"][id*="Origin"]').val('');
        $('[type="hidden"][id*="Origin"]').val('0');

    }
}

function enableDestination(val) {
    var DestinationCountry = $("#Text_DestinationCountrySNo").val();
    var DestinationCountrySNo = $("#DestinationCountrySNo").val();

    var DestinationCity = $("#Text_DestinationCitySNo").val();
    var DestinationCitySNo = $("#DestinationCitySNo").val();

    var DestinationAirport = $("#Text_DestinationAirportSNo").val();
    var DestinationAirportSNo = $("#DestinationAirportSNo").val();

    if (val == '1') {
        cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
    }
    else if (val == '2') {
        cfi.EnableAutoComplete("DestinationCitySNo", true, false, "white");
        cfi.EnableAutoComplete("DestinationCountrySNo", true, false, "white");
        cfi.EnableAutoComplete("DestinationAirportSNo", true, false, "white");
    }
    if (DestinationCountrySNo != "" && DestinationCountrySNo != "0") {
        cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
    }
    else if (DestinationCitySNo != "" && DestinationCitySNo != 0) {
        cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
    }
    else if (DestinationAirportSNo != "" && DestinationAirportSNo != 0) {
        cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
    }


}

function enableOrigin(val) {
    var OriginCountry = $("#Text_OriginCountrySNo").val();
    var OriginCountrySNo = $("#OriginCountrySNo").val();
    var OriginCity = $("#Text_OriginCitySNo").val();
    var OriginCitySNo = $("#OriginCitySNo").val();
    var OriginAirport = $("#Text_OriginAirportSNo").val();
    var OriginAirportSNo = $("#OriginAirportSNo").val();
    if (val == '1') {
        cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
    }
    else if (val == '2') {
        cfi.EnableAutoComplete("OriginCitySNo", true, false, "white");
        cfi.EnableAutoComplete("OriginCountrySNo", true, false, "white");
        cfi.EnableAutoComplete("OriginAirportSNo", true, false, "white");
    }
    if (OriginCountrySNo != "" && OriginCountrySNo != 0) {
        cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
    }
    else if (OriginCitySNo != "" && OriginCitySNo != 0) {
        cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
    }
    else if (OriginAirportSNo != "" && OriginAirportSNo != 0) {
        cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
    }

}
$('#MaxWeight').blur(function () {
    if ($("#Text_LimitOn").val() != "") {
        if ($('#MaxWeight').val() < 0.01) {
            ShowMessage('warning', 'warning - Embargo', "Value cannot be Zero ", "bottom-right");
            return false;
        }
    }


});


//===============end here=============================== 




