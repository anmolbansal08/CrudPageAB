$(document).ready(function () {
    cfi.ValidateForm();
    var DateToUseList = [{ Key: "0", Text: "First Flown" }, { Key: "1", Text: "Sale Date" }, { Key: "2", Text: "AWP Execution Date" }]
    cfi.AutoCompleteByDataSource("ExecutionOn", DateToUseList);
    cfi.AutoComplete("RateTypeUse", "RateTypeCode", "ExchangeRateType", "SNo", "RateTypeCode", ["RateTypeCode"], null, "contains", ",");
    cfi.BindMultiValue("RateTypeUse", $("#Text_RateTypeUse").val(), $("#RateTypeUse").val());
    
    //$("#MasterDuplicate").hide();
    //$('#aspnetForm').attr("enctype", "multipart/form-data");
    //if ( getQueryStringValue("FormAction").toUpperCase() == "EDIT")
    //{

    //    //cfi.AutoCompleteByDataSource("ExecutionOn", DateToUseList);
    //   // cfi.AutoComplete("ExecutionOn", "ExecutionOn", "ExchangeRateConfiguration", "SNo", "Execution", ["ExecutionOn"], getSource, "contains");
    //    //cfi.AutoComplete("RateTypeUse", "RateTypeCode", "ExchangeRateType", "SNo", "RateTypeCode", ["RateTypeCode"], null,"contains",",");

    //   // cfi.BindMultiValue("RateTypeUse", $("#Text_RateTypeUse").val(), $("#RateTypeUse").val());


    //}
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    //{
        //cfi.AutoCompleteByDataSource("ExecutionOn", DateToUseList);
        //// cfi.AutoComplete("ExecutionOn", "ExecutionOn", "ExchangeRateConfiguration", "SNo", "Execution", ["ExecutionOn"], getSource, "contains");
        //cfi.AutoComplete("RateTypeUse", "RateTypeCode", "ExchangeRateType", "SNo", "RateTypeCode", ["RateTypeCode"], null, "contains", ",");
    //}
    //$('#tbl > tbody:last-child').append('<tr><td><b> Note:</b> Rate Type has OR condition only</td></tr>');
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('#aspnetForm').append('<table class="WebFormTable"><tr><td class="formSection"><span style="color:red;" >Note:</span> Rate Type has OR condition only</td></tr></table>');
    }
});
//style="color:red;"
// class="formSection" 