$(document).ready (function () {
    cfi.AutoComplete("AirportName", "AirportName", "Airport", "SNo", "AirportName", ["AirportName"], null, "contains");
    cfi.AutoComplete("TerminalName", "TerminalName", "Terminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $("#AirportName").val(userContext.AirportSNo);
        $("#Text_AirportName").val(userContext.AirportName);
    }


    if ((getQueryStringValue("FormAction").toUpperCase() == "READ")) {
        $("input[name^='Active']").attr('disabled', true);
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "WAREHOUSEPLANNING")
    {
        // location.href = location.origin + '/Default.cshtml?Module=Warehouse&Apps=WarehousePlanning&FormAction=Planning&UserID=0&RecID=0~~';
        location.href = 'Default.cshtml?Module=Warehouse&Apps=WarehousePlanning&FormAction=Planning&UserID=0&RecID=0~~';
    }

    $("#WHRowCount").live("keyup", function () {
        if ($("#WHRowCount").val() > 100) {
            alert("Row Count can not be greater then 100");
            $("#WHRowCount").val('');
        }
    })
    $("#WHColumnCount").live("keyup", function () {
        if ($("#WHColumnCount").val() > 100) {
            alert("Column Count can not be greater then 100");
            $("#WHColumnCount").val('');
        }
    })
    
})

function ExtraCondition(a) {
    if ("Text_AirportName" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "CitySNo", "eq", userContext.CitySNo), filter = cfi.autoCompleteFilter(a);
    if ("Text_TerminalName" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AirportSNo", "eq", $("#AirportName").val()), filter = cfi.autoCompleteFilter(a);
}
