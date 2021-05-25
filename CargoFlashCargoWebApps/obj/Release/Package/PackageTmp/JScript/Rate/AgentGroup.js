$(document).ready(function () {
    cfi.ValidateForm();
    var GroupLevelList = [{ Key: "0", Text: "Country" }, { Key: "1", Text: "City" }]
    cfi.AutoCompleteByDataSource("GroupLevel", GroupLevelList, null);
    cfi.AutoComplete("CountrySNo", "CountryCode,CountryName", "vCountryListDetails", "CountrySNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains" , ",");
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
   
    if ( getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('#GroupLevel').closest('tr').next().hide();
        $('#CountrySNo').closest('tr').next().hide();
        
    }
    
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" && $('#GroupLevel').val() == '0') {
        $('#CountrySNo').closest('td').next().hide();
        $('#CitySNo').closest('td').hide();
    }
});



function LevelChange() {
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW")
    //{
    //    cfi.ResetAutoComplete("CountrySNo");
        
    //    $('#GroupLevel').closest('tr').next().show();
    //    $('#CountrySNo').closest('tr').next().hide();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(4)').show();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(3)').show();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(2)').hide();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(1)').hide();

    //}
}

function selectcity()
{
    //AutoCompleteDeleteCallBack('', "divMultiAccountSNo", "Text_AccountSNo");
    //cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    cfi.ResetAutoComplete("CitySNo");
    //    $("#divMultiAccountSNo").remove();
    //    cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    //    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    //    if ($('#GroupLevel').val() == 0) {
    //        $('#CountrySNo').closest('tr').next().show();

    //    }
    //    if ($('#GroupLevel').val() == 1) {
    //        $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(2)').show();
    //        $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(1)').show();
    //        $('#CountrySNo').closest('tr').next().hide();
    //    }
    //}
}


function selectaccount() {
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {

    //    $('#CountrySNo').closest('tr').next().show();
    //    $("#divMultiAccountSNo").remove();
    //    cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    //    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    //}
}


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_CitySNo") {
        try {
            cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#Text_CountrySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if ($('#CitySNo').val() == "") {
        if (textId == "Text_AccountSNo") {
            try {
                cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#Text_CountrySNo").data("kendoAutoComplete").key())
                var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter2;
            }
            catch (exp)
            { }
        }
    }
    else {
        if (textId == "Text_AccountSNo") {
            try {
                cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
                var OriginCityAutoCompleteFilter3 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter3;
            }
            catch (exp)
            { }
        }
    }
}


$('#Text_GroupLevel').select(function () {

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        cfi.ResetAutoComplete("CountrySNo");

        $('#GroupLevel').closest('tr').next().show();
        $('#CountrySNo').closest('tr').next().hide();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(4)').show();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(3)').show();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(2)').hide();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(1)').hide();

    }
});

$('#Text_CountrySNo').select(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        cfi.ResetAutoComplete("CitySNo");
        $("#divMultiAccountSNo").remove();
        cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
        cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
        if ($('#GroupLevel').val() == 0) {
            $('#CountrySNo').closest('tr').next().show();

        }
        if ($('#GroupLevel').val() == 1) {
            $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(2)').show();
            $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(1)').show();
            $('#CountrySNo').closest('tr').next().hide();
        }
    }
   
});

$('#Text_CitySNo').select(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $('#CountrySNo').closest('tr').next().show();
        $("#divMultiAccountSNo").remove();
        cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
        cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    }

});
//================================ added By arman Ali  Date :  28 Mar, 2017========================================================
//===================================End============================================================================================ 