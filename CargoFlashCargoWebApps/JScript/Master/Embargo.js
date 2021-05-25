/// <reference path="../../Scripts/common.js" />

//AUTOCOMPLETE
var AirPortCitySNo = 0;
$(document).ready(function () {
    cfi.ValidateForm();
    // DestinationFunction();
    // $("#Text_AirlineSNo").attr("placeholder", "All");
    // $("#Text_AccountSNo").attr("placeholder", "All");
    var FreightTypeList = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }]
    // By Arman Ali  REMOVE  { Key: "1", Text: "Transit" }  
    var ApplicableOnList = [{ Key: "0", Text: "Sector" }, { Key: "2", Text: "Origin" }, { Key: "3", Text: "Destination" }]
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
        // $(".btn-danger").hide();$('#RefNo').closest('td').html('')
    }
        $('#RefNo').closest('td').html('')
    cfi.AutoCompleteV2("AccountSNo", "ParticipantID,Name", "Embargo_Name", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Embargo_AirlineCode", null, "contains");
    cfi.AutoCompleteV2("OriginCountrySNo", "CountryCode,CountryName", "Embargo_CountryCode", OriginFunction, "contains");
    cfi.AutoCompleteV2("DestinationCountrySNo", "CountryCode,CountryName", "Embargo_CountryCode", DestinationFunction, "contains");
    cfi.AutoCompleteV2("OriginCitySNo", "CityCode,CityName", "Embargo_CityCode", OriginFunction, "contains");
    cfi.AutoCompleteV2("DestinationCitySNo", "CityCode,CityName", "Embargo_CityCode", DestinationFunction, "contains");
    cfi.AutoCompleteV2("OriginAirportSNo", "AirportCode,AirportName", "Embargo_AirportCode", OriginFunction, "contains");
    cfi.AutoCompleteV2("DestinationAirportSNo", "AirportCode,AirportName", "Embargo_AirportCode", DestinationFunction, "contains");
    cfi.AutoCompleteV2("SHC", "SNo,Code", "Embargo_Code", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "Embargo_CommodityCode", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("Product", "ProductName", "Embargo_ProductName", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("Aircraft", "AircraftType,AirlineName", "Embargo_AircraftType", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("Flight", "FlightNo", "Embargo_FlightNo", FlightSelect, "contains", ",", null, null, null, null);
    /******************************************************************************************************************************/
    cfi.AutoCompleteV2("ExcludeSHC", "SNo,Code", "Embargo_Code", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("ExcludeCommodity", "CommodityCode,CommodityDescription", "Embargo_CommodityCode", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("ExcludeProduct", "ProductName", "Embargo_ProductName", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("ExcludeAircraft", "AircraftType,AirlineName", "Embargo_AircraftType", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("ExcludeFlight", "FlightNo", "Embargo_FlightNo", FlightSelect, "contains", ",", null, null, null, null);
    cfi.AutoCompleteV2("ExcludeAccountSNo", "ParticipantID,Name", "Embargo_Name", SetCommodity, "contains", ",");
    cfi.AutoCompleteV2("AgentsAirline", "CarrierCode,AirlineName", "Embargo_AgentsAirline", SetCommodity, "contains", ",");
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    cfi.BindMultiValue("SHC", $("#Text_SHC").val(), $("#SHC").val());
    cfi.BindMultiValue("Product", $("#Text_Product").val(), $("#Product").val());
    cfi.BindMultiValue("Aircraft", $("#Text_Aircraft").val(), $("#Aircraft").val());
    cfi.BindMultiValue("Flight", $("#Text_Flight").val(), $("#Flight").val());
    cfi.BindMultiValue("Commodity", $("#Text_Commodity").val(), $("#Commodity").val());
    /******************************************************************************************************************************/
    cfi.BindMultiValue("ExcludeCommodity", $("#Text_ExcludeCommodity").val(), $("#ExcludeCommodity").val());
    cfi.BindMultiValue("ExcludeSHC", $("#Text_ExcludeSHC").val(), $("#ExcludeSHC").val());
    cfi.BindMultiValue("ExcludeProduct", $("#Text_ExcludeProduct").val(), $("#ExcludeProduct").val());
    cfi.BindMultiValue("ExcludeAircraft", $("#Text_ExcludeAircraft").val(), $("#ExcludeAircraft").val());
    cfi.BindMultiValue("ExcludeFlight", $("#Text_ExcludeFlight").val(), $("#ExcludeFlight").val());
    cfi.BindMultiValue("ExcludeAccountSNo", $("#Text_ExcludeAccountSNo").val(), $("#ExcludeAccountSNo").val());
    cfi.BindMultiValue("AgentsAirline", $("#Text_AgentsAirline").val(), $("#AgentsAirline").val());
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

            if (OriginCountrySNo != "") {
                cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
            }
            else if (OriginCitySNo != "") {
                cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
            }
            else if (OriginAirportSNo != "") {
                cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
                cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
            }

            if (DestinationCountrySNo != "") {
                cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
            }
            else if (DestinationCitySNo != "") {
                cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
                cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
            }
            else if (DestinationAirportSNo != "") {
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
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {
        $("#Commodity").val("");
        $("#SHC").val("");
        $("#ExcludeSHC").val("");
        $("#ExcludeCommodity").val("");
        $("#Product").val("");
        $("#ExcludeProduct").val("");
        $("#Aircraft").val("");
        $("#ExcludeAircraft").val("");
        $("#AccountSNo").val("");
        $("#ExcludeAccountSNo").val("");
        $("#Flight").val("");
        $("#ExcludeFlight").val("");
        $('.k-delete').click();
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' && userContext.SysSetting.ICMSEnvironment.toUpperCase()=='GA') {
                $("input:checkbox[id^='Day']").prop('checked', true);
        }
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
        SetDropdownDisable(); // Added by devendra 1 Aug 2018
    }
  
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    $(document).on('drop', function () {
        return false;
    });
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {
        if ($("input:radio[name='ConfigType']:checked").val() == 0) {
            $('#Text_Period').data("kendoAutoComplete").enable(false);
            var LimitOnList = [{ Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }, { Key: "4", Text: "Min Weight / Pieces" }, { Key: "5", Text: "Min Weight / Shipment" }, { Key: "6", Text: "Pieces / Flight" }, { Key: "7", Text: "Weight / Flight" }];
            cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
        }
        else {
            var LimitOnList = [{ Key: "0", Text: "No of Shipment" }, { Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }, { Key: "4", Text: "Min Weight / Pieces" }, { Key: "5", Text: "Min Weight / Shipment" }, { Key: "6", Text: "Pieces / Flight" }, { Key: "7", Text: "Weight / Flight" }];
            cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
            $('#Text_Period').data("kendoAutoComplete").enable(true);
        }
    }
    if (userContext.SysSetting.HideAgentofAirline.toUpperCase() == "TRUE") {
        $('#Text_AgentsAirline').closest('span').hide();
        $('#spnAgentsAirline').closest('span').hide();
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
    $('#divMultiAccountSNo span[id]').click();
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
                if ($('#OriginAirportSNo').val() > 0) {
                    $.ajax({
                        url: "./Services/Master/EmbargoService.svc/AirportCitySNo", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ OriginAirportSNo: $('#OriginAirportSNo').val() }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            AirPortCitySNo = result;
                        }
                    });
                }
            }
        }

        if (flag == 'F') {
            cfi.EnableAutoComplete("OriginAirportSNo", true, false, "White");
            cfi.EnableAutoComplete("OriginCitySNo", true, false, "White");
            cfi.EnableAutoComplete("OriginCountrySNo", true, false, "White");


            $("#Text_OriginCountrySNo").attr('data-valid', 'required');
            $("#Text_OriginCountrySNo").attr('data-valid-msg', 'Kindly select Destination Country , City or Airport .');

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
            $("#Text_DestinationCountrySNo").attr('data-valid-msg', 'Kindly select Origin Country , City or Airport .');
        }
    }

}


//tarun kumar singh

function handleClick() {
    if ($('#Day0').is(":checked")) {
        $('input[type="checkbox"]').attr('checked', true);
    }
 else {
        $('input[type="checkbox"]').attr('checked', false);
    }
}

function changeClick() {
    var mlgth = $('input[type=checkbox][id^="Day"][value=8]').filter(':checked').length;
    var lgth = $('input[type=checkbox][id^="Day"]').filter(':checked').length-mlgth;
    
    if ($('input[id^="Day"][value!="8"]').not(":checked")) {

        $('#Day0').attr('checked', false);
    }
    if (lgth == 7) {

        $('#Day0').attr('checked', true);
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
        var LimitOnList = [{ Key: "0", Text: "No of Shipment" }, { Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }, { Key: "4", Text: "Min Weight / Pieces" }, { Key: "5", Text: "Min Weight / Shipment" }, { Key: "6", Text: "Pieces / Flight" }, { Key: "7", Text: "Weight / Flight" }];
        cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
    }
    else {
        $('#ValidFrom').attr("data-valid", "required");
        $('#ValidTo').attr("data-valid", "required");
        $('#Period').removeAttr("data-valid");
        $('#Text_Period').removeAttr("data-valid");
        $('#Text_Period').removeAttr("data-valid-msg");
        $('#Text_Period').data("kendoAutoComplete").enable(false);
        var LimitOnList = [{ Key: "1", Text: "Pieces / Shipment" }, { Key: "2", Text: "Max Weight / Pieces" }, { Key: "3", Text: "Max Weight / Shipment" }, { Key: "4", Text: "Min Weight / Pieces" }, { Key: "5", Text: "Min Weight / Shipment" }, { Key: "6", Text: "Pieces / Flight" }, { Key: "7", Text: "Weight / Flight" }];
        cfi.AutoCompleteByDataSource("LimitOn", LimitOnList, ValidatePeriod);
    }
});
function FlightSelect(obj) {
    if (($("#Text_OriginCountrySNo").val() == "" && $("#Text_OriginCitySNo").val() == "" && $("#Text_OriginAirportSNo").val() == "") && ($('#Text_ApplicableOn').val().toUpperCase() == "ORIGIN")) {
        alert("Please select origin.");
        $("#Text_Flight").val('');
        $("#Flight").val('');
        $("#Text_ExcludeFlight").val('');
        $("#ExcludeFlight").val('');
       // $("#divMulti" + obj.split('_')[1]).closest('td').find('[class="k-icon k-delete"]').click();
    } else if (($("#Text_DestinationCountrySNo").val() == "" && $("#Text_DestinationCitySNo").val() == "" && $("#Text_DestinationAirportSNo").val() == "") && $('#Text_ApplicableOn').val().toUpperCase() == "DESTINATION") {
        alert("Please select destination.");
        $("#Text_Flight").val('');
        $("#Flight").val('');
        $("#Text_ExcludeFlight").val('');
        $("#ExcludeFlight").val('');
      // $("#divMulti" + obj.split('_')[1]).closest('td').find('[class="k-icon k-delete"]').click();
    } else if ($('#Text_ApplicableOn').val().toUpperCase() == "SECTOR") {
        if (($("#Text_DestinationCountrySNo").val() == "" && $("#Text_DestinationCitySNo").val() == "" && $("#Text_DestinationAirportSNo").val() == "") && ($("#Text_OriginCountrySNo").val() == "" && $("#Text_OriginCitySNo").val() == "" && $("#Text_OriginAirportSNo").val() == "")) {
            alert("Please select origin and destination.");
            $("#Text_Flight").val('');
            $("#Flight").val('');
            $("#Text_ExcludeFlight").val('');
            $("#ExcludeFlight").val('');
        }
        else if (($("#Text_DestinationCountrySNo").val() == "" && $("#Text_DestinationCitySNo").val() == "" && $("#Text_DestinationAirportSNo").val() == "")) {
            alert("Please select destination.");
            $("#Text_Flight").val('');
            $("#Flight").val('');
            $("#Text_ExcludeFlight").val('');
            $("#ExcludeFlight").val('');
        } else if (($("#Text_OriginCountrySNo").val() == "" && $("#Text_OriginCitySNo").val() == "" && $("#Text_OriginAirportSNo").val() == "")) {
            alert("Please select origin.");
            $("#Text_Flight").val('');
            $("#Flight").val('');
            $("#Text_ExcludeFlight").val('');
            $("#ExcludeFlight").val('');
}
         //$("#divMulti" + obj.split('_')[1]).closest('td').find('[class="k-icon k-delete"]').click();
    }
    SetCommodity(obj)
}
//FILTER
function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_OriginCountrySNo" && $("#DestinationCountrySNo").val()>0) {
        //cfi.setFilter(filterEmbargo, "CountryCode", "neq", $("#Text_DestinationCountrySNo").val().split("-")[0])
        //var OriginCountryAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCountryAutoCompleteFilter;
    }

    else if(textId == "Text_AccountSNo")
    {
        if ($('#OriginCitySNo').val() != '' && $('#OriginCitySNo').val() != '0')
        {
        cfi.setFilter(filterEmbargo, "CitySNo", "in", $("#OriginCitySNo").val());       
        }
        else if ($('#OriginAirportSNo').val() != '' && $('#OriginAirportSNo').val() != '0' && AirPortCitySNo != 0)
        {
            cfi.setFilter(filterEmbargo, "CitySNo", "in", AirPortCitySNo);
        }
            //--------added by arman Date : 2017-08-23-----------------
        else if ($('#OriginCountrySNo').val() != '' && $('#OriginCountrySNo').val() != '0' ) {
            cfi.setFilter(filterEmbargo, "CountrySNo", "in", $('#OriginCountrySNo').val());
        }
    
            //-----------------end------------------------------------------
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").key());
        var OriginCountryAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCountryAutoCompleteFilter;
    }
    //else if (textId == "Text_DestinationCountrySNo") {
    //    cfi.setFilter(filterEmbargo, "CountryCode", "neq", $("#Text_OriginCountrySNo").val().split("-")[0])
    //    var DestinationCountryAutoCompleteFilter1 = cfi.autoCompleteFilter([filterEmbargo]);
    //    return DestinationCountryAutoCompleteFilter1;
    //}
    else if (textId == "Text_OriginAirportSNo" && $("#DestinationAirportSNo").val()>0) {
        cfi.setFilter(filterEmbargo, "AirportCode", "neq", $("#Text_DestinationAirportSNo").val().split("-")[0])
        var OriginGlobalZoneAutoCompleteFilter4 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginGlobalZoneAutoCompleteFilter4;
    }
    else if (textId == "Text_DestinationAirportSNo" && $("#OriginAirportSNo").val()>0) {
        cfi.setFilter(filterEmbargo, "AirportCode", "neq", $("#Text_OriginAirportSNo").val().split("-")[0])
        var DestinationGlobalZoneAutoCompleteFilter5 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationGlobalZoneAutoCompleteFilter5;
    }
    else if (textId == "Text_OriginCitySNo" && $("#DestinationCitySNo").val()>0) {
        cfi.setFilter(filterEmbargo, "CityCode", "neq", $("#Text_DestinationCitySNo").val().split("-")[0])
        var OriginLocalZoneAutoCompleteFilter6 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginLocalZoneAutoCompleteFilter6;
    }
    else if (textId == "Text_DestinationCitySNo" && $("#OriginCitySNo").val()>0) {
        cfi.setFilter(filterEmbargo, "CityCode", "neq", $("#Text_OriginCitySNo").val().split("-")[0])
        var DestinationLocalZoneAutoCompleteFilter7 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationLocalZoneAutoCompleteFilter7;
    }
    else if (textId == "Text_Flight") {
        if ($("#OriginCountrySNo").val() != "" && $("#OriginCountrySNo").val()>0) {
            cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#OriginCountrySNo").val())
            //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        }
        if ($("#OriginCitySNo").val() != "" && $("#OriginCitySNo").val()>0) {
            cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#OriginCitySNo").val())
            //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        }
        if ($("#OriginAirportSNo").val() != "" && $("#OriginAirportSNo").val()>0) {
            cfi.setFilter(filterEmbargo, "AirportSNo", "eq", $("#OriginAirportSNo").val())
            //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        }
        //if ($("#AirlineSNo").val() != "") {
        //    cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
        //    //var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        //}
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Flight").data("kendoAutoComplete").key())
        cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        var DestinationLocalZoneAutoCompleteFilter8 = cfi.autoCompleteFilter([filterEmbargo]);
        return DestinationLocalZoneAutoCompleteFilter8;


    }
    else if (textId == "Text_SHC") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_SHC").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeSHC").data("kendoAutoComplete").key());
        filterSHC = cfi.autoCompleteFilter(filterEmbargo);
        return filterSHC;
    }
    else if (textId == "Text_Product") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Product").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeProduct").data("kendoAutoComplete").key());
        filterProduct = cfi.autoCompleteFilter(filterEmbargo);
        return filterProduct;
    }
    else if (textId == "Text_Commodity") {        
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Commodity").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeCommodity").data("kendoAutoComplete").key());
        filterCommodity = cfi.autoCompleteFilter(filterEmbargo);
        return filterCommodity;
    }
    else if (textId == "Text_ExcludeCommodity") {       
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Commodity").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeCommodity").data("kendoAutoComplete").key());
        filterExCommodity = cfi.autoCompleteFilter(filterEmbargo);
        return filterExCommodity;
    }
    else if (textId == "Text_Aircraft") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Aircraft").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeAircraft").data("kendoAutoComplete").key());
        filterAircraft = cfi.autoCompleteFilter(filterEmbargo);
        return filterAircraft;
    }
    /****************************/
    else if (textId == "Text_ExcludeSHC") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_SHC").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeSHC").data("kendoAutoComplete").key());
        filterExcludeSHC = cfi.autoCompleteFilter(filterEmbargo);
        return filterExcludeSHC;
    }
    else if (textId == "Text_ExcludeProduct") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Product").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeProduct").data("kendoAutoComplete").key());
        filterExcludeProduct = cfi.autoCompleteFilter(filterEmbargo);
        return filterExcludeProduct;
    }
    else if (textId == "Text_ExcludeAircraft") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Aircraft").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeAircraft").data("kendoAutoComplete").key());
        filterExcludeAircraft = cfi.autoCompleteFilter(filterEmbargo);
        return filterExcludeAircraft;
    }
    else if (textId == "Text_ExcludeAccountSNo") {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").key());
        filterExcludeAccountSNo = cfi.autoCompleteFilter(filterEmbargo);
        return filterExcludeAccountSNo;
    }
    else if (textId == "Text_ExcludeFlight") {
        cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_Flight").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ExcludeFlight").data("kendoAutoComplete").key());
        filterExcludeFlight = cfi.autoCompleteFilter(filterEmbargo);
        return filterExcludeFlight;
    }
    /***************************/
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    if (textId.indexOf("Text_AgentsAirline") >= 0) {
        var filter13 = cfi.getFilter("AND");
        cfi.setFilter(filter13, "IsActive", "eq", "1");
        cfi.setFilter(filter13, "IsInterline", "eq", "0");
        cfi.setFilter(filter13, "SNO", "notin", $("#Text_AgentsAirline").data("kendoAutoComplete").key());
        filterAirlineSNo = cfi.autoCompleteFilter(filter13);
        return filterAirlineSNo;
    }
}
// Added By Arman Ali  
//Purpose : For Checking required field on button click event

$('input[name="operation"]').click(function () {
  

    SetEmbargo();
    var daysop = $('input[type=checkbox][id^="Day"]:checked').length;
    if (daysop >= 1) {
   
    }
    else {
        ShowMessage('warning','Need Your Kind Attention - Embargo', "Days of Operation is Mandatory. Select at-least 1 Day ", "bottom-right");
        return false;
    }
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
$('#ValidFrom ,#ValidTo').blur(function () {
    validDate;
});

var validDate = function (_this) {
    var dtRegex = new RegExp("^([0]?[1-9]|[1-2]\\d|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-[1-2]\\d{3}$", 'i');
    if (!dtRegex.test($(_this).val())) {
        $(_this).val('');
    }
}
//End
//== added by arman ali Date : 24 Apr 2017=====
//== for changing origin and destination on select of Applicabletype
function SetEmbargo() {
    if ($('#ApplicableOn').val() == '0') {
        $("#Text_DestinationCountrySNo").attr('data-valid', 'required');
        $("#Text_DestinationCountrySNo").attr('data-valid-msg', 'Kindly select Destination Country , City OR Airport.');
        $("#Text_OriginCountrySNo").attr('data-valid', 'required');
        $("#Text_OriginCountrySNo").attr('data-valid-msg', 'Kindly select Origin Country , City OR Airport.');
        //$('[type="text"][id*="Origin"]').val('');
        //$('[type="hidden"][id*="Origin"]').val('');
        //$('[type="text"][id*="Destination"]').val('');
        //$('[type="hidden"][id*="Destination"]').val('');
        enableDestination(2);
        enableOrigin(2);
    }
    else if ($('#ApplicableOn').val() == '2') {
        $("#Text_OriginCountrySNo").attr('data-valid', 'required');
        $("#Text_OriginCountrySNo").attr('data-valid-msg', 'Kindly select Origin Country , City OR Airport.');
        $("#Text_DestinationCountrySNo").removeAttr('data-valid');
        $("#Text_DestinationCountrySNo").removeAttr('data-valid-msg');
        enableDestination(1);
        enableOrigin(2);
        $('[type="text"][id*="Destination"]').val('');
        $('[type="hidden"][id*="Destination"]').val('');
    }
    else if ($('#ApplicableOn').val() == '3') {
        $("#Text_DestinationCountrySNo").attr('data-valid', 'required');
        $("#Text_DestinationCountrySNo").attr('data-valid-msg', 'Kindly select Destination Country , City OR Airport.');
        $("#Text_OriginCountrySNo").removeAttr('data-valid');
        $("#Text_OriginCountrySNo").removeAttr('data-valid-msg');
        enableDestination(2);
        enableOrigin(1);
        $('[type="text"][id*="Origin"]').val('');
        $('[type="hidden"][id*="Origin"]').val('');

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
    if (DestinationCountrySNo != "") {
        cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationCitySNo", false, true, "grey");
    }
    else if (DestinationCitySNo != "") {
        cfi.EnableAutoComplete("DestinationAirportSNo", false, true, "grey");
        cfi.EnableAutoComplete("DestinationCountrySNo", false, true, "grey");
    }
    else if (DestinationAirportSNo != "") {
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
    if (OriginCountrySNo != "" ) {
        cfi.EnableAutoComplete("OriginCitySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
    }
    else if (OriginCitySNo != "") {
        cfi.EnableAutoComplete("OriginCountrySNo", false, true, "grey");
        cfi.EnableAutoComplete("OriginAirportSNo", false, true, "grey");
    }
    else if (OriginAirportSNo != "") {
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
/************* 
--Added by devendra singh on 5 FEB 2018 
---FOR DISABLE BUTTON AFTER  FIRST CLICK ON SUBMIT FORM 
**************/
$(window).on('beforeunload', function () {
    //$("input[type=submit], input[type=button]").prop("disabled", "disabled");
    $('input[name="operation"]').prop("disabled", "disabled");
});


function SetCommodity(id) {

    if (id.indexOf("Text_Commodity") >= 0 && ($('#Commodity').val()!="")) {
        $("#Text_ExcludeCommodity").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_ExcludeCommodity") >= 0 && ($('#ExcludeCommodity').val()!= "")) {
        $("#Text_Commodity").data("kendoAutoComplete").enable(false)
    }
    /***************************************************************************************************************************/
    else if (id.indexOf("Text_SHC") >= 0 && ($('#SHC').val()!= "")) {
        $("#Text_ExcludeSHC").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_ExcludeSHC") >= 0 && ($('#ExcludeSHC').val()!= "")) {
        $("#Text_SHC").data("kendoAutoComplete").enable(false)
    }

    else if (id.indexOf("Text_Product") >= 0 && ($('#Product').val()!= "")) {
        $("#Text_ExcludeProduct").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_ExcludeProduct") >= 0 && ($('#ExcludeProduct').val()!= "")) {
        $("#Text_Product").data("kendoAutoComplete").enable(false)
    }

    else if (id.indexOf("Text_Aircraft") >= 0 && ($('#Aircraft').val()!= "")) {
        $("#Text_ExcludeAircraft").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_ExcludeAircraft") >= 0 && ($('#ExcludeAircraft').val() != "")) {
        $("#Text_Aircraft").data("kendoAutoComplete").enable(false)
    }

    else if (id.indexOf("Text_AccountSNo") >= 0 && ($('#AccountSNo').val() != "")) {
        $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").enable(false)
        $("#Text_AgentsAirline").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_ExcludeAccountSNo") >= 0 && ($('#ExcludeAccountSNo').val() != "")) {
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(false) 
        $("#Text_AgentsAirline").data("kendoAutoComplete").enable(false)
    }

    else if (id.indexOf("Text_Flight") >= 0 && ($('#Flight').val() != "")) {
        $("#Text_ExcludeFlight").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_ExcludeFlight") >= 0 && ($('#ExcludeFlight').val() != "")) {
        $("#Text_Flight").data("kendoAutoComplete").enable(false)
    }
    else if (id.indexOf("Text_AgentsAirline") >= 0 && ($('#AgentsAirline').val() != "")) {
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(false)
        $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").enable(false)
    }
    //
    //if (id == 'Text_ExcludeCommodity') {
    //    var Cl = $('#Commodity').val().length;
    //    if (Cl > 0) {
    //        $("#Text_ExcludeCommodity").val("");
    //        $('#ExcludeCommodity').val('');
    //        $("#Text_ExcludeCommodity").data("kendoAutoComplete").enable(false)
    //        return true;
    //    } else {
    //        $("#Text_ExcludeCommodity").data("kendoAutoComplete").enable(true)
    //    }
    //}
    //else if (id == 'Text_Commodity') { 

    //    var ECl = $('#ExcludeCommodity').val().length;
    //    if (ECl > 0) {
    //        $("#Text_Commodity").val("");
    //        $('#Commodity').val('');
    //        $("#Text_Commodity").data("kendoAutoComplete").enable(false)
    //        return true;
    //    } else {
    //        $("#Text_Commodity").data("kendoAutoComplete").enable(true)
    //    }
    //}
}
function AutoCompleteDeleteCallBack(e, div, textboxid) {
    if (textboxid.indexOf("Text_Commodity") >= 0 && ($('#Commodity').val().split(',').length - 1) ==0) {
        $("#Text_ExcludeCommodity").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_ExcludeCommodity") >= 0 && ($('#ExcludeCommodity').val().split(',').length - 1) ==0) {
        $("#Text_Commodity").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_SHC") >= 0 && ($('#SHC').val().split(',').length - 1) == 0) {
        $("#Text_ExcludeSHC").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_ExcludeSHC") >= 0 && ($('#ExcludeSHC').val().split(',').length - 1) == 0) {
        $("#Text_SHC").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_Product") >= 0 && ($('#Product').val().split(',').length - 1) == 0) {
        $("#Text_ExcludeProduct").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_ExcludeProduct") >= 0 && ($('#ExcludeProduct').val().split(',').length - 1) == 0) {
        $("#Text_Product").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_Aircraft") >= 0 && ($('#Aircraft').val().split(',').length - 1) == 0) {
        $("#Text_ExcludeAircraft").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_ExcludeAircraft") >= 0 && ($('#ExcludeAircraft').val().split(',').length - 1) == 0) {
        $("#Text_Aircraft").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_AccountSNo") >= 0 && ($('#AccountSNo').val().split(',').length - 1) == 0) {
        $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").enable(true)

        if ($('#ExcludeAccountSNo').val() == "") {
            $("#Text_AgentsAirline").data("kendoAutoComplete").enable(true)
        }
    }
    else if (textboxid.indexOf("Text_ExcludeAccountSNo") >= 0 && ($('#ExcludeAccountSNo').val().split(',').length - 1) == 0) {
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(true)

        if ($('#AccountSNo').val() == "") {
            $("#Text_AgentsAirline").data("kendoAutoComplete").enable(true)
        }
    }
    else if (textboxid.indexOf("Text_Flight") >= 0 && ($('#Flight').val().split(',').length - 1) == 0) {
        $("#Text_ExcludeFlight").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_ExcludeFlight") >= 0 && ($('#ExcludeFlight').val().split(',').length - 1) == 0) {
        $("#Text_Flight").data("kendoAutoComplete").enable(true)
    }
    else if (textboxid.indexOf("Text_AgentsAirline") >= 0 && ($('#AgentsAirline').val().split(',').length - 1) == 0) {
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(true)
        $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").enable(true)
    }
}
//===============end here=============================== 

function SetDropdownDisable() {

    if ( $('#Commodity').val() != "" && $('#ExcludeCommodity').val() == "") {
        $("#Text_ExcludeCommodity").data("kendoAutoComplete").enable(false)
    }
   if( $('#Commodity').val() == "" && $('#ExcludeCommodity').val() != "" ) {
        $("#Text_Commodity").data("kendoAutoComplete").enable(false)
    }
 if ($('#ExcludeSHC').val() == "" && $('#SHC').val() != "") {
        $("#Text_ExcludeSHC").data("kendoAutoComplete").enable(false)
    }
 if ($("#ExcludeSHC").val()!="" && $('#SHC').val() == "") {
        $("#Text_SHC").data("kendoAutoComplete").enable(false)
    }

 if ($('#ExcludeProduct').val() == "" && $('#Product').val() != "") {
        $("#Text_ExcludeProduct").data("kendoAutoComplete").enable(false)
    }
     if ($('#Product').val() == "" && $('#ExcludeProduct').val() != "") {
        $("#Text_Product").data("kendoAutoComplete").enable(false)
    }

     if ($('#ExcludeAircraft').val() == "" && $('#Aircraft').val() != "") {
        $("#Text_ExcludeAircraft").data("kendoAutoComplete").enable(false)
    }
     if ($('#Aircraft').val() == "" && $('#ExcludeAircraft').val() != "") {
        $("#Text_Aircraft").data("kendoAutoComplete").enable(false)
    }

     if ($("#ExcludeAccountSNo").val() == "" && $('#AccountSNo').val() != "") {
         $("#Text_ExcludeAccountSNo").data("kendoAutoComplete").enable(false)
         $("#Text_AgentsAirline").data("kendoAutoComplete").enable(false)
    }
     if ($('#AccountSNo').val() == "" && $('#ExcludeAccountSNo').val() != "") {
         $("#Text_AccountSNo").data("kendoAutoComplete").enable(false)
         $("#Text_AgentsAirline").data("kendoAutoComplete").enable(false)
    }

     if ($('#ExcludeFlight').val() == "" && $('#Flight').val() != "") {
        $("#Text_ExcludeFlight").data("kendoAutoComplete").enable(false)
    }
     if ($('#Flight').val() == "" && $('#ExcludeFlight').val() != "" ) {
        $("#Text_Flight").data("kendoAutoComplete").enable(false)
    }
}

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}