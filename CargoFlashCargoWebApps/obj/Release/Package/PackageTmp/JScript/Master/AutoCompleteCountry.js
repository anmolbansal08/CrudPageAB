/// <reference path="common.js" />

$(document).ready(function () {
    cfi.AutoComplete("CurrencyCode", "CurrencyName", "hdnCurrencyCode", "Services/AutoCompleteService.svc/AutoCompleteDataSource", "Currency", "CurrencyCode", "CurrencyName", ["CurrencyCode", "CurrencyName"]);
    //    cfi.AutoComplete("txtCountry", "CountryCode", "hdnCountrySNo", "Services/AutoCompleteService.svc/AutoCompleteDataSource", "Country", "CountryCode", "CountryName");
    //    ExtraCondition("txtCountry")
});


function ExtraCondition(textId) {
    if (textId == "CurrencyCode") {
        var filterCurrency = cfi.getFilter("OR");
        cfi.setFilter(filterCurrency, "CurrencyCode", "eq", $("#CurrencyCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency, "CurrencyCode", "eq", $("#CurrencyCode").data("kendoAutoComplete").key());

        var filterCurrency1 = cfi.getFilter("OR");
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#CurrencyCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#CurrencyCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#CurrencyCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#CurrencyCode").data("kendoAutoComplete").key());

        var countryAutoCompleteFilter = cfi.autoCompleteFilter([filterCurrency, filterCurrency1]);
        return countryAutoCompleteFilter;
    }
}
