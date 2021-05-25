$(document).ready(function () {
    $("#MasterDuplicate").hide();
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName","Terminal_CityName", CityCodeChange, "contains");
    
    cfi.AutoCompleteV2("AirportName", "AirportName,AirportCode","Terminal_AirportName", null, "contains");
    cfi.AutoCompleteV2("XrayMachineName", "SNo,XrayMachineName","Terminal_XrayMachineName", null, "contains", ",");

    cfi.BindMultiValue("XrayMachineName", $("#Text_XrayMachineName ").val(), $("#XrayMachineName").val());


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#CitySNo").val(userContext.CitySNo);
        $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
        $("#AirportName").val(userContext.AirportSNo);
        $("#Text_AirportName").val(userContext.AirportCode + '-' + userContext.AirportName);

    }
 
    $("#Text_AirportName").prop("disabled", true);

    //$('#TerminalName').keypress(function (e) {

    //    if (e.keyCode != 32)
    //        return true;
    //    else
    //        return false;
    //})
  
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    $(document).on('drop', function () {
        return false;
    });
});



//function CheckMachinExistence(e) {
//    if ($("#" + e).val() != "") {
//        $.ajax({
//            url: "Services/Master/TerminalService.svc/GetXRayMachineInfo?XraymachineSNo=" + $("#" + e).closest("td").find("input[id='XrayMachineName']").val(), async: false, type: "get", dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                var Data = jQuery.parseJSON(result);
//                var XratDetails = Data.Table;
//                if (XratDetails[0].Message != "") {
//                    var xraymachineSNo = XratDetails[0].XraymachineSNo;                  
//                   // $('#divMultiXrayMachineName li:last').find('span').remove();
//                    //$("#" + e).val("");
//                    AutoCompleteDeleteCallBack(e,'divMultiXrayMachineName', 'XrayMachineName');//(e, div, textboxid);
//                    ShowMessage('warning', 'Information!', XratDetails[0].Message, "bottom-right");
//                    return false;
//                }
//            }
//        });
//    }
//}



function onSelectCity(e) {
    $("#Text_AirportName").prop("disabled", false);
    $("#Text_AirportName").val('');
}
function ExtraCondition(textId) {
    var TerminalSNo = getQueryStringValue("RecID")
    var filterProcess = cfi.getFilter("AND");
    var filtersearchOriginCity = cfi.getFilter("AND");
    var filterProcessOR = cfi.getFilter("AND");
    var searchCityFilter = cfi.getFilter("AND");
    try {
        if (textId == "Text_CitySNo") {
            if (textId.indexOf("Text_CitySNo") >= 0) {
                cfi.setFilter(filterProcess, "IsActive", "eq", "1")
                cfi.setFilter(filtersearchOriginCity, "CityCode", "notin", $("#Text_CitySNo").data("kendoAutoComplete").key());
                searchCityFilter = cfi.autoCompleteFilter(filtersearchOriginCity);
                return searchCityFilter;
            }

           // cfi.setFilter(filterProcess, "IsActive", "eq", "1")
           // cfi.autoCompleteFilter(filterProcess);
            //cfi.setFilter(filterProcess, "CityCode", "eq", $("#CitySNo").val(), "IsActive", "eq", "1")
            //var SubProcessAutoCompleteFilter2 = cfi.autoCompleteFilter([filterProcess]);
            //return SubProcessAutoCompleteFilter2;
        }
        if (textId == "Text_AirportName") {
            cfi.setFilter(filterProcess, "CitySNo", "eq", $("#CitySNo").val(), "IsActive", "eq", "1")
            var SubProcessAutoCompleteFilter2 = cfi.autoCompleteFilter([filterProcess]);
            return SubProcessAutoCompleteFilter2;
        }
        if (textId == "Text_XrayMachineName") {
            cfi.setFilter(filterProcess, "SNo", "notin", $("#XrayMachineName").val()), cfi.autoCompleteFilter(filterProcess);
            cfi.setFilter(filterProcess, "TerminalSNo", "in", TerminalSNo + "," + "0"), cfi.autoCompleteFilter(filterProcess);
            var SubProcessAutoCompleteFilter2 = cfi.autoCompleteFilter([filterProcess]);
            return SubProcessAutoCompleteFilter2;
        }



    }
    catch (exp)
    { }




}


function CityCodeChange() {
    try {
        $.ajax({
            type: "GET",
            url: "Services/Master/TerminalService.svc/GetAirportInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CitySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#AirportName').val(FinalData[0].SNo);
                    $('#Text_AirportName').val(FinalData[0].AirportName);
                }
            }
        });
    }
    catch (exp) { }

}