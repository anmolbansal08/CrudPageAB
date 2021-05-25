
$(document).ready(function () {
    //============== added by arman ali date : 2017-07-08===============
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "AccountType_Product", null, "contains", ",");
    cfi.BindMultiValue("ProductSNo", $("#Text_ProductSNo").val(), $("#ProductSNo").val());
    //=====================end==========================================
    //$('#AccountTypeName').keypress(function (e) {

    //    if (e.keyCode != 32)
    //        return true;
    //    else
    //        return false;
    //})
   
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
});

function ExtraCondition(textId) {
    var filterCountry = cfi.getFilter("AND");
    if (textId == "Text_ProductSNo") {
       
        cfi.setFilter(filterCountry, "SNo", "notin", $("#Text_ProductSNo").data("kendoAutoComplete").key());
        var CountryFilter = cfi.autoCompleteFilter(filterCountry);
        return CountryFilter;
    }

}