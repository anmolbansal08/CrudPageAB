$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoComplete("LocationTypeSNo", "Description", "MovementType", "SNo", "Description", ["Description"], Reset, "contains");
    cfi.AutoComplete("LocationSubTypeSNo", "SubType", "LocationSubType", "SNo", "SubType", ["SubType"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
    cfi.AutoComplete("SPHCSNo", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoComplete("CommoditySNo", "CommodityCode", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains");
    cfi.AutoComplete("DestinationCitySNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
    cfi.AutoComplete("CityCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");
    cfi.AutoComplete("CountrySNo", "CountryName", "Country", "SNo", "CountryName", ["CountryName"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

    }

});

function Reset() {
    $('#Text_LocationSubTypeSNo').val('');
    //cfi.ResetAutoComplete("LocationSubTypeSNo");
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_LocationSubTypeSNo") {
        try {
            cfi.setFilter(filter, "LocationTypeSNo", "eq", $("#Text_LocationTypeSNo").data("kendoAutoComplete").key())
            var AutoCompleteFilter = cfi.autoCompleteFilter([filter]);
            return AutoCompleteFilter;
        }
        catch (exp)
        { }
    }
}

