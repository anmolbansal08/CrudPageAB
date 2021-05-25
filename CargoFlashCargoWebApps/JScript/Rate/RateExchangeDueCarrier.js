$(document).ready(function () {
    cfi.ValidateForm();
    // Changes by Vipin Kumar
    //cfi.AutoComplete("FromCurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoCompleteV2("FromCurrencySNo", "CurrencyCode,CurrencyName", "RateExchangeDueCarrier_Currency", null, "contains");
    //cfi.AutoComplete("ToCurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoCompleteV2("ToCurrencySNo", "CurrencyCode,CurrencyName", "RateExchangeDueCarrier_Currency", null, "contains");
    //cfi.AutoComplete("DueCarrierSNo", "Code,Name", "vwDueCarrier", "SNo", "Code", ["Code", "Name"], null, "contains");
    cfi.AutoCompleteV2("DueCarrierSNo", "Code,Name", "RateExchangeDueCarrier_DueCarrier", null, "contains");
    // Ends
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ValidTo").data("kendoDatePicker").value("");

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#ValidTo").val();

    }

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
    })

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