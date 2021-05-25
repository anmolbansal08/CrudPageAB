$(document).ready(function () {
    // Changes by Vipin Kumar
    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName", "Applied_Spot_Rate_AirlineSNo", null, "contains");

    //cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Applied_Spot_Rate_CitySNo", null, "contains");

    //cfi.AutoComplete("OfficeSNo", "SNo,Name", "vw_Office", "SNo", "Name", null, null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "SNo,Name", "Applied_Spot_Rate_OfficeSNo", null, "contains");

    //cfi.AutoComplete("AgentSNo", "SNo,Name", "AllotmentAgents", "SNo", "Name", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "SNo,Name", "Applied_Spot_Rate_AgentSNo", "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    //$("#ToDate").kendoDatePicker({
    //    min: $("#FromDate").val(),
    //    format: "dd-MMM-yyyy"
    //});


    if (userContext.GroupName == 'ADMIN') {

    }
    else {
        $('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
        $('#Text_AirlineSNo_input').val(userContext.AirlineName);

        $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        $('#Text_OfficeSNo_input').val(userContext.OfficeName);


        $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
        $('#Text_CitySNo_input').val(userContext.CityName);


        $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        $('#Text_AgentSNo_input').val(userContext.AgentName);



        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
        cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble
    }

});


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
            cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
            cfi.setFilter(filterAirline, "IsBlacklist", "eq", 0);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}




function GetAppliedSpotRate() {


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    var AirlineSNo = $('#AirlineSNo').val();
    var OfficeSNo = $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val();
    var CitySNo = $("#CitySNo").val() == null ? "" : $("#CitySNo").val();
    var AccountSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();
    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();
    var WhereCondition = "";
    var OrderBy = "";
    $("#BlackListTbl").remove();
    if (AirlineSNo != "") {
        $.ajax({
            url: 'GetRecordAppliedSpotRate',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirlineSNo: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AccountSNo: AccountSNo, FromDate: FromDate, ToDate: ToDate, WhereCondition: WhereCondition, OrderBy: OrderBy
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>AWB No</th><th bgcolor='lightblue'>Agent</th><th bgcolor='lightblue'>Origin</th><th bgcolor='lightblue'>Destination</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Gr. Weight</th><th bgcolor='lightblue'>Ch. Weight </th><th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Code</th><th bgcolor='lightblue'>Rate</th><th bgcolor='lightblue'>Freight</th><th bgcolor='lightblue'>Spot Code</th><th bgcolor='lightblue'>Applied By</th><th bgcolor='lightblue'>Applied On</th></tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += " <tbody><tr>";

                        str += "<td>" + result.Data[i].AWBNo + "</td>";

                        str += "<td>" + result.Data[i].AgentName + "</td>";
                        str += "<td>" + result.Data[i].Origin + "</td>";
                        str += "<td>" + result.Data[i].Destination + "</td>";
                        str += "<td>" + result.Data[i].TotalPieces + "</td>";

                        str += "<td>" + result.Data[i].TotalGrossWeight + "</td>";
                        str += "<td>" + result.Data[i].TotalChargeableWeight + "</td>";
                        str += "<td>" + result.Data[i].ProductName + "</td>";
                        str += "<td>" + result.Data[i].IsSingleCompaignCode + "</td>";
                        str += "<td>" + result.Data[i].MKTRate + "</td>";

                        str += "<td>" + result.Data[i].MKTFreight + "</td>";
                        str += "<td>" + result.Data[i].SpotCode + "</td>";
                        str += "<td>" + result.Data[i].AppliedBy + "</td>";
                        str += "<td>" + result.Data[i].AppliedOn + "</td>";
                        str += "</tr></tbody>";
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='14'><center><p style='color:red'>Not Exists</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";

                $('#BindBlakListTable').append(str);
                //}





                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}