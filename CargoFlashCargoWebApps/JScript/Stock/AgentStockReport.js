$(document).ready(function () {




    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "AgentStockReport_Airline", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "AgentStockReport_City", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "SNo,Name", "AgentStockReport_office", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "SNo,Name", "AgentStockReport_Agents", null, "contains");



    //if (userContext.GroupName == 'ADMIN' || userContext.GroupName == 'SUPER ADMIN')
    if (userContext.GroupName.indexOf('ADMIN') >= 0) {    //Comment By Akash bcz of Super Admin


    }
    else if (userContext.GroupName == "AGENT" || userContext.SysSetting.ClientEnvironment != "UK" && userContext.GroupName == "GSA" || userContext.GroupName == "GSSA" || userContext.GroupName == "CBVAGENT") {
        $('#AirlineSNo').val(userContext.AirlineName.substring(0, 3) == 0 ? "" : userContext.AirlineName.substring(0, 3));
        $('#Text_AirlineSNo_input').val(userContext.AirlineName);

        $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        $('#Text_OfficeSNo_input').val(userContext.OfficeName);


        $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
        $('#Text_CitySNo_input').val(userContext.CityCode);


        $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        $('#Text_AgentSNo_input').val(userContext.AgentName);


        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
        cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble
    }
    else { }

});


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        //cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        //return OriginCityAutoCompleteFilter2;
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
            cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
            cfi.setFilter(filterAirline, "IsBlacklist", "eq", 0);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}

var AirlineSNo = "";
var OfficeSNo = "";
var CitySNo = "";
var AgentSNo = "";
var WhereCondition = "";
var OrderBy = "";


function DownloadExcelReport() {

    //AirlineSNo = $('#Text_AirlineSNo').val().substring(0, 3);
    //if (AirlineSNo == "") {
    //    AirlineSNo = $('#Text_AirlineSNo_input').val().substring(0, 3);
    //}
    AirlineSNo = $('#AirlineSNo').val();
    OfficeSNo = $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val();
    CitySNo = $("#CitySNo").val() == null ? "" : $("#CitySNo").val();
    AgentSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();

    if (AirlineSNo != "" && OfficeSNo != "" && CitySNo != "" && AgentSNo != "") {


        window.location.href = "../AgentStockReport/GetRecordInExcel?AWBPrefix=" + AirlineSNo + "&OfficeSNo=" + OfficeSNo + "&CitySNo=" + CitySNo + "&AgentSNo=" + AgentSNo;

   
    }
}



function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}