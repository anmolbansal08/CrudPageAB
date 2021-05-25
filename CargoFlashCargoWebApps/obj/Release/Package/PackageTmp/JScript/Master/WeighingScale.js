/// <reference path="../../Scripts/references.js" />
//Javascript file for City Page for binding Autocomplete

$(document).ready(function () {
    cfi.ValidateForm();

    cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], CityCodeChange, "contains");
    cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "viewAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("TerminalSNo", "SNo,TerminalName", "viewterminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#CitySNo").val(userContext.CitySNo);
        $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
        $("#AirportSNo").val(userContext.AirportSNo);
        $("#Text_AirportSNo").val(userContext.AirportCode + '-' + userContext.AirportName);

    }
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    $('#IPAddress').keypress(function (e) {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;

    });
    if (!userContext.IsShowAllData && $("#Text_CitySNo").data("kendoAutoComplete")) {
        $("#Text_CitySNo").data("kendoAutoComplete").enable(false);
        $("#Text_AirportSNo").data("kendoAutoComplete").enable(false);
    }
});


//function CityCodeChange() {

// $("#AirportSNo").val('');
// $("#Text_AirportSNo").val('');
///$("#TerminalSNo").val('');
// $("#Text_TerminalSNo").val('');



//}
function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_AirportSNo") {
        try {
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_TerminalSNo") {
        try {
            cfi.setFilter(filterAirline, "AirportSNo", "eq", $("#Text_AirportSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



}


function CityCodeChange() {
    try {
        $.ajax({
            type: "GET",
            url: "Services/Master/WeighingScaleService.svc/GetAirportInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CitySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#AirportSNo').val(FinalData[0].SNo);
                    $('#Text_AirportSNo').val(FinalData[0].AirportName);
                }
            }
        });
    }
    catch (exp) { }

}