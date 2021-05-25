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
    cfi.AutoCompleteV2("CurrencyCode", "CurrencyName,CurrencyCode", "AirlineAuction_Currency", null, "contains");
    cfi.AutoCompleteV2("CustomerSNo", "SNo", "AirlineAuction_Customer");
    cfi.AutoCompleteV2("ApprovedBy", "UserName", "AirlineAuction_User");
    cfi.AutoCompleteV2("Origin", "CityName,CityCode", "AirlineAuction_City", null, "contains");
    cfi.AutoCompleteV2("Destination", "CityName,CityCode", "AirlineAuction_City", null, "contains");
    //    cfi.DateType("ValidFrom");
    //    cfi.DateType("ValidTo");
    //    cfi.DateType("ApprovedOn");
    //ExtraCondition("City");
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
