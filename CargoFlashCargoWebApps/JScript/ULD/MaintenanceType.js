$(document).ready(function ()
{
    cfi.AutoCompleteV2("uldtype", "UldType", "ULDSLA_UldTypeName", null, "contains");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#uldtype").val("0");
        $("#Text_uldtype").val("CONTAINER");
    }
    $('#ManhourCost').after('<label>(' + userContext.CurrencyCode+')</lable>');
})