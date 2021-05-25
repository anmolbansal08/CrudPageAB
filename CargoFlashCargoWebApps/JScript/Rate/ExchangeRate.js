/*
*****************************************************************************
Javascript Name:	ExchangeRateJS     
Purpose:		    This JS used to get Grid Data for Exchange Rate and its tab function.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    
Created On:		    
Updated By:      arman ali  
Updated On:	     2017-06-08       
Approved By:        
Approved On:	    
*****************************************************************************
*/
$(document).ready(function () {

    cfi.ValidateForm();
    // Changes By Vipin Kumar
    //cfi.AutoComplete("FromCurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoCompleteV2("FromCurrencySNo", "CurrencyCode,CurrencyName", "Exchange_Rate_FromCurrency", null, "contains");

    //cfi.AutoComplete("ToCurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoCompleteV2("ToCurrencySNo", "CurrencyCode,CurrencyName", "Exchange_Rate_FromCurrency", null, "contains");

    //cfi.AutoComplete("ApplicableCountrySNo", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoCompleteV2("ApplicableCountrySNo", "CountryCode,CountryName", "Exchange_Rate_ApplicableCountry", null, "contains");

    //cfi.AutoComplete("ExchangeRateTypeSNo", "RateTypeCode", "ExchangeRateType", "SNo", "RateTypeCode");
    cfi.AutoCompleteV2("ExchangeRateTypeSNo", "RateTypeCode", "Exchange_Rate_ExchangeRateType");
    // Added by arman Date : 2017-06-06 for conversiontype required;
    $("#Text_ExchangeRateTypeSNo").attr("data-valid", "required");
    $("#Text_ExchangeRateTypeSNo").attr("data-valid-msg", "Select Conversion Type");
    $("[title='Select Conversion Type:']").closest('td').text('');
    $("[title='Select Conversion Type:']").closest('td').append("<font color='red'>*</font> Conversion Type:")
    //end here
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ValidTo").data("kendoDatePicker").value("");

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#Text_FromCurrencySNo').data("kendoAutoComplete").enable(false);
        $('#Text_ToCurrencySNo').data("kendoAutoComplete").enable(false);

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

        //var validfromdate = $("#ValidFrom").data("kendoDatePicker");
        //validfromdate.min(todaydate);
        var validTodate = $("#ValidTo").data("kendoDatePicker");
        validTodate.min(todaydate);
        $("#ValidFrom").attr('readonly', true);
        $("#ValidTo").attr('readonly', true);
        if (userContext.SysSetting.ValidateRequiredonExchangeRate == "TRUE") {
            $("#ValidTo").attr("data-valid", "required");
            $("#ValidTo").attr("data-valid-msg", "Valid To can not be blank");
            $("[title='Select Valid To']").closest('td').text('');
            $("[title='Select Valid To']").closest('td').append("<font color='red'>*</font>  Valid To")
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        //  var validTodate = $("#ValidTo").data("kendoDatePicker");
        // validTodate.min(todaydate);
          $("#ValidTo").data('kendoDatePicker').min(todaydate);
        if (userContext.SysSetting.ValidateRequiredonExchangeRate== "TRUE") {
            $("#ValidTo").attr("data-valid", "required");
            $("#ValidTo").attr("data-valid-msg", "Valid To can not be blank");
            $("[title='Select Valid To']").closest('td').text('');
            $("[title='Select Valid To']").closest('td').append("<font color='red'>*</font>  Valid To")
        }
    }
});


function ExtraCondition(textId) {
    var filterexchangerate = cfi.getFilter("AND");
    if (textId == "Text_FromCurrencySNo") {
        cfi.setFilter(filterexchangerate, "CurrencyCode", "neq", $("#Text_ToCurrencySNo").data("kendoAutoComplete").value().split('-')[0])
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);
        return CurrencyAutoCompleteFilter;
    }
    if (textId == "Text_ToCurrencySNo") {
        cfi.setFilter(filterexchangerate, "CurrencyCode", "neq", $("#Text_FromCurrencySNo").data("kendoAutoComplete").value().split('-')[0])
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


    if (($("#ValidTo").val().indexOf('9999')) >= 0) {
        $("span#ValidTo").text('');
    }

}

//----- added by arman for rate allow decimal only date : 2017-11-07----------
$("#Rate").keyup(function () {
    var $this = $(this);
    $this.val($this.val().replace(/[^\d.]/g, ''));
});
//-------- added by Arman for fixed decimal value upto 7 digit-------------
$("#Rate").blur(function () {
    if ($("#Rate").val() != "") {
        var rateval = parseFloat($("#Rate").val())
        $("#Rate").val(rateval.toFixed(7));
    }
})
$("input[name = 'operation'][value = 'Update']").click(function () {
    $('#Text_FromCurrencySNo').data("kendoAutoComplete").enable(true);
    $('#Text_ToCurrencySNo').data("kendoAutoComplete").enable(true);

});