$(document).ready(function () {
    //       $('#aspnetForm').cfValidator();
    //         var options = {        
    //         onBeforeValidate: function(element, action){
    //                     // do something here        
    //           // alert("onBeforeValidate");
    //         },};    
    //        $("input[name=operation]").click(function (e) {
    //            ('#aspnetForm').data('cfValidator').validate()
    //               // alert("abc");
    //        });

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ValidTo").val(getDateNextYear());
    }

    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    //cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyName", ["CurrencyCode", "CurrencyName"]);
    cfi.AutoComplete("CurrencyCode", "CurrencyName,CurrencyCode", "vwCurrency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("CustomerSNo", "SNo", "Customer", "SNo", "CustomerName");
    cfi.AutoComplete("ApprovedBy", "UserName", "vwUsers", "Sno", "UserName");
    cfi.AutoComplete("Origin", "CityName,CityCode", "vCity", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("Destination", "CityName,CityCode", "vCity", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
    //    cfi.DateType("ValidFrom");
    //    cfi.DateType("ValidTo");
    //    cfi.DateType("ApprovedOn");
    //ExtraCondition("City");
    //cfi.AutoComplete("CurrencyCode", "CurrencyName", "hdnCurrencyCode", "Services/AutoCompleteService.svc/AutoCompleteDataSource", "Currency", "CurrencyCode", "CurrencyName");
});

function ExtraCondition(textId) {
    var filterdaysdiscounting = cfi.getFilter("AND");
    if (textId.indexOf("Origin") >= 0) {
        var destination = textId.replace("Text_Origin", "Destination");
        cfi.setFilter(filterdaysdiscounting, "CityCode", "neq", $("#" + destination).val())
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }
    if (textId.indexOf("Destination") >= 0) {
        var origin = textId.replace("Text_Destination", "Origin");
        cfi.setFilter(filterdaysdiscounting, "CityCode", "neq", $("#" + origin).val())
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }
}
