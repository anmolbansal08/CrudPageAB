
$(document).ready(function () {
 //   BindAutoComplete();
   // cfi.AutoComplete("Country", "CountryName", "vCountryDetails", "SNo", "CountryName", ["CountryName"], null, "contains", ",", null, null, null, null, true);//, null, null, null, null, true);
    cfi.AutoCompleteV2("Country", "CountryCode,CountryName", "Master_Region_CountryName", null, "contains", ",", null, null, null, null, true);//, null, null, null, null, true);
});

$('input[type="radio"][name="RegionType"]').click(function () {
    $("#Country").val('');
    $('#divMultiCountry ul li span').not('span[id="FieldKeyValuesCountry"]').click();  // added by arman ALI DATE 30-05-2017
     // $("#divMultiCountry").remove();
     //BindAutoComplete();
});

function ExtraCondition(textId) {
    var filterCountry = cfi.getFilter("AND");
    if (textId == "Text_Country" && $("#Country").val() != "" && $('#RegionType:checked').val() == '1'  ) {
        var currenycode = $("#divMultiCountry ul li:eq(1) span")[1].id.split("-")[1];
        cfi.setFilter(filterCountry, "CurrencyCode", "eq", currenycode);
        cfi.setFilter(filterCountry, "SNo", "neq", $("#Country").val());
       
        var CountryFilter = cfi.autoCompleteFilter(filterCountry);
        return CountryFilter;
    }
    if (textId == "Text_Country" && $("#Country").val() != "" && $('#RegionType:checked').val() == '0') {
        //var currenycode = $("#divMultiCountry ul li:eq(1) span")[1].id.split("-")[1];
        //cfi.setFilter(filterCountry, "CurrencyCode", "eq", currenycode);
        //cfi.setFilter(filterCountry, "SNo", "neq", $("#Country").val());
        cfi.setFilter(filterCountry, "SNo", "notin", $("#Text_Country").data("kendoAutoComplete").key());
        var CountryFilter = cfi.autoCompleteFilter(filterCountry);
        return CountryFilter;
    }
    
}

