/*
*****************************************************************************
Javascript Name:	ExchangeRateJS     
Purpose:		    This JS used to get Grid Data for Exchange Rate and its tab function.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    
Created On:		    
Updated By:        
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoComplete("FromCurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ToCurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ApplicableCountrySNo", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("ExchangeRateTypeSNo", "RateTypeCode", "ExchangeRateType", "SNo", "RateTypeCode");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ValidTo").data("kendoDatePicker").value("");

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        

        $("#ValidTo").val();
        
    }
    var todaydate = new Date();
    SetDateRangeValue(undefined, "ValidTo");

    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        
        var validfromdate = $("#ValidFrom").data("kendoDatePicker");
        validfromdate.min(todaydate);
        var validTodate = $("#ValidTo").data("kendoDatePicker");
        validTodate.min(todaydate);
        $("#ValidFrom").attr('readonly', true);
        $("#ValidTo").attr('readonly', true);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

      //  var validTodate = $("#ValidTo").data("kendoDatePicker");
       // validTodate.min(todaydate);
        $("#ValidTo").data('kendoDatePicker').min(todaydate);
    }
});

function ExtraCondition(textId) {
    var filterexchangerate = cfi.getFilter("AND");
    if (textId == "Text_FromCurrencySNo") {
        cfi.setFilter(filterexchangerate, "CurrencyCode", "neq", $("#Text_ToCurrencySNo").data("kendoAutoComplete").value())
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);
        return CurrencyAutoCompleteFilter;
    }
    if (textId == "Text_ToCurrencySNo") {
        cfi.setFilter(filterexchangerate, "CurrencyCode", "neq", $("#Text_FromCurrencySNo").data("kendoAutoComplete").value())
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);
        return CurrencyAutoCompleteFilter;
    }
}

$("#Rate").blur(function () {
    if ($("#Rate").val() == 0) {
        ShowMessage('info', 'Need your Kind Attention!', "Rate Cannot be Zero.");
        $("#Rate").val('')

        return true;

    }
})



if (getQueryStringValue("FormAction").toUpperCase() == "READ") {


    if (($("#ValidTo").val().indexOf('9999')) >= 0)
    {
        $("span#ValidTo").text('');
    }

}

//== '31-Dec-9999'