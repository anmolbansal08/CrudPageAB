$(document).ready(function () {
    cfi.AutoComplete("AWBNum", "AWBNo,SNo", "vwAWBReserved_AutoComplete", "SNo", "AWBNo", ["AWBNo"], null, "contains");
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("input[data-radioval='No']").attr('disabled', true);
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
    //    var data = GetDataSource("AWBNo", "ImportAWB", "SNo", "AWBNo", ["AWBNo"], null);
    //    cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
    //}

    //$('input[name="operation"]').bind("click", function (event) {
    //    //ShowMessage('info', 'AWB Reserve', "This AWB is reserved for '  "+$("#ReservedFor").val()+"  ' . Do you wish to continue", "bottom-right");
    //    if (confirm("This AWB is reserved for '  " + $("#ReservedFor").val().toUpperCase() + "  ' . Do you wish to continue")) {

    //    } else {
    //        event.preventDefault();
    //    }
    //})

})


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_AWBNum") {
        try {
            cfi.setFilter(filterEmbargo, "IsReserved", "eq", 0)
            cfi.setFilter(filterEmbargo, "AgentName", "eq", 'SAS')
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}