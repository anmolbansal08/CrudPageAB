//Javascript file for City Page for binding Autocomplete

$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("City", "CityCode", "Mater_City", null, "contains");
   // cfi.AutoComplete("City", "CityCode", "vCity", "CityCode", "CityCode", ["CityCode"], null, "contains");
   // cfi.AutoComplete("TimeZoneSNo", "SNo,TimeZoneName", "AirlineTimeZone", "SNo", "TimeZoneName", ["TimeZoneName"], null, "contains");
    //cfi.AutoComplete("CountrySNo", "CountryName,CountryCode", "Country", "SNo", "CountryCode", ["CountryName", "CountryCode"], null, "contains");
    //cfi.AutoComplete("IATAArea", "SNo,IATAAreaName", "CityIataArea", "SNo", "IATAAreaName", ["IATAAreaName"], null, "contains");
   // cfi.AutoCompleteByDataSource("IATAArea", IATATYPE);

    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    $("input:radio[name='IsDayLightSaving'][value ='1']").prop('checked', true);
    //    $('#DaylightSaving').attr('readonly', true);
    //}

    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //    ShowHideDayLightSaving();
    //}


    //$('input:radio[name=IsDayLightSaving]').click(function () {
    //    if ($(this).val() == '0') {
    //        $('#DaylightSaving').attr('readonly', false);
    //    }
    //    else if ($(this).val() == '1') {
    //        $('#DaylightSaving').val('');
    //        $('#DaylightSaving').attr('readonly', true);
    //    }
    //});
});


//function ShowHideDayLightSaving() {
//    if ($('input:radio[name=IsDayLightSaving]:checked').val() == '0') {
//        $('#DaylightSaving').attr('readonly', false);
//    }
//    else if ($('input:radio[name=IsDayLightSaving]:checked').val() == '1') {
//        $('#DaylightSaving').attr('readonly', true);
//    }
//}


