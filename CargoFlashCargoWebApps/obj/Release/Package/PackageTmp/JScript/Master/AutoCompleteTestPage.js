/// <reference path="common.js" />

$(document).ready(function () {
        cfi.AutoComplete("txtCurrency", "CurrencyCode", "hdnCurrencySNo", "Services/AutoCompleteService.svc/GetCurrencyDataSource");
        cfi.AutoComplete("txtCountry", "CountryCode", "hdnCountrySNo", "Services/AutoCompleteService.svc/GetCountryDataSource");
    cfi.AutoComplete("Currency","CurrencyCode", "Currency","CurrencyCode","CurrencyName",["CurrencyCode", "CurrencyName"]);
    cfi.AutoComplete("Country","CountryCode","Country","CountryCode","CountryName");
    ExtraCondition("Country")
});


function ExtraCondition(textId) {
    if (textId == "txtCountry") {
        var filterCurrency = cfi.getFilter("OR");
        cfi.setFilter(filterCurrency, "CurrencyCode", "eq", $("#Currency").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency, "CurrencyCode", "eq", $("#Currency").data("kendoAutoComplete").key());
        var filterCurrency1 = cfi.getFilter("OR");
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#Currency").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#Currency").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#Currency").data("kendoAutoComplete").key());
        cfi.setFilter(filterCurrency1, "CurrencyCode", "eq", $("#Currency").data("kendoAutoComplete").key());
        var countryAutoCompleteFilter = cfi.autoCompleteFilter([filterCurrency, filterCurrency1]);
        return countryAutoCompleteFilter;
    }
}
