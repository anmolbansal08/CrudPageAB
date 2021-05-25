$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("LocationTypeSNo", "Description", "Warehouse_LocationTypeSNo", Reset, "contains");
    cfi.AutoCompleteV2("LocationSubTypeSNo", "SubType", "Warehouse_LocationSubTypeSNo", null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "AirlineName", "Warehouse_AirlineSNo", null, "contains");
    cfi.AutoCompleteV2("SPHCSNo", "Code", "Warehouse_SHC_Search",  null, "contains");
    cfi.AutoCompleteV2("CommoditySNo", "CommodityCode", "Warehouse_CommodityCode", null, "contains");
    cfi.AutoCompleteV2("DestinationCitySNo", "CityCode", "Warehouse_CityCode",  null, "contains");
    cfi.AutoCompleteV2("CityCode", "CityCode", "Warehouse_CityCode_Location",  null, "contains");
    cfi.AutoCompleteV2("CountrySNo", "CountryName", "Warehouse_DestCountry_Search", null, "contains");

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

