//@*/Add By akash 6 Jun as per Pradip sir 5:30 for export to excel/*@
var OnBlob = false;

$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });
    
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "CCAReport_Airline", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CityCode,CityName", "CCAReport_City", null, "contains");
    cfi.AutoCompleteV2("FlightSNo", "FlightNo", "CCAReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "CCAReport_AWB", null, "contains");
    cfi.AutoCompleteV2("CCANo", "CCANo", "CCAReport_CCANo", null, "contains");


    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    if (userContext.AirlineCarrierCode != "" && userContext.AirlineName.substring(0, 3) != "") {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }

    //$("#FromDate").change(function () {

    //    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //    $("#ToDate").data("kendoDatePicker").value('');
    //});
    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
    });
 
    $('#imgexcel').hide();
});


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_FlightSNo") {
        if ($('#OriginSNo').val() != '') {
            cfi.setFilter(filterAirline, "CitySno", "eq", $("#OriginSNo").val());
        }
        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());
        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }
}

var Model = [];
function SearchCCAReport() {



    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    Model = {
        AirlineCode: $('#AirlineCode').val(),
        StatusType: $("input[name='StatusType']:checked").val(),
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        OriginSNo: $('#OriginSNo').val() == "" ? 0 : $('#OriginSNo').val(),
        FlightNo: $('#FlightSNo').val() == "" ? "0" : $('#FlightSNo').val(),
        AWBSNo: $('#AWBNo').val() == "" ? 0 : $('#AWBNo').val(),
        CCASNo: $('#CCANo').val() == "" ? 0 : $('#CCANo').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)
    }





    if (Model.AirlineCode != "" && Model.FromDate != "" && Model.ToDate != "") {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/CCAReport",
                async: true,
                type: "GET",
                dataType: "json",
                data: Model,
                success: function (result) {
                    var data = result.Table0[0].ErrorMessage.split('~');

                    if (parseInt(data[0]) == 0)
                        ShowMessage('success', 'Reports!', data[1]);
                    else
                        ShowMessage('warning', 'Reports!', data[1]);
                }
            });
        }
        else {
            $.ajax({
                url: 'GetCCARecord',
                async: false,
                type: "POST",
                method: "POST",
                dataType: "json",
                data: JSON.stringify(Model),
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $('#imgexcel').show();
                    var DivID = document.getElementById("BindBlakListTable");
                    DivID.innerHTML = "";
                    var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>Action</th><th bgcolor='lightblue'>CCANo</th><th bgcolor='lightblue'>AWBNo</th><th bgcolor='lightblue'>Origin</th><th bgcolor='lightblue'>Destination</th><th bgcolor='lightblue'>Flight No</th><th bgcolor='lightblue'>CCA Gross Weight</th><th bgcolor='lightblue'>CCA Pieces</th><th bgcolor='lightblue'>CCA Volume</th><th bgcolor='lightblue'>Agent Name </th><th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>Created By</th><th bgcolor='lightblue'>Approved By</th></tr></thead>";
                    if (result.Data.length > 0) {
                        for (var i = 0; i < result.Data.length; i++) {
                            str += " <tbody><tr>";
                            if (Model.StatusType != '0') {
                                str += "<td><input type='button' id=" + result.Data[i].SNo + " value='Print' class='btn btn-success' onclick='RenderPrintCCA(this.id);' /></td>";
                            }
                            else {
                                str += "<td></td>";
                            }
                            str += "<td>" + result.Data[i].CCANo + "</td>";
                            str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].flightno + "</td>";
                            str += "<td>" + result.Data[i].CCAGrossWeight + "</td>";
                            str += "<td>" + result.Data[i].CCAPieces + "</td>";
                            str += "<td>" + result.Data[i].CCAVolume + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].CreatedBy + "</td>";
                            str += "<td>" + result.Data[i].UpdatedUser + "</td>";
                            str += "</tr></tbody>";

                        }
                    }
                    else {
                        str += " <tbody><tr>";
                        str += "<td colspan='13'><center><p style='color:red'>Not Exists</p></center></td>";
                        str += "</tr></tbody>";
                    }
                    str += "</table>";
                    DivID.innerHTML = str;

                    $('#BlackList').css('display', 'block');

                    return false
                },

            });
        }
    }
}


function RenderPrintCCA(CCANo) {
    if (CCANo > 0)
        window.open("../HtmlFiles/CCA/PrintCCA.html?CCANo=" + CCANo);
    else
        jAlert("CCANo not generated");
}





//@*/Add By akash 6 Jun as per Pradip sir 5:30 for export to excel/*@

function ExportToExcel_CCAReport() {

    var str = "";

    if (Model.AirlineCode != "" && Model.FromDate != "" && Model.ToDate != "") {
        $.ajax({
            url: 'GetCCARecord',
            async: false,
            type: "POST",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>CCANo</th><th bgcolor='lightblue'>AWBNo</th><th bgcolor='lightblue'>Origin</th><th bgcolor='lightblue'>Destination</th><th bgcolor='lightblue'>Flight No</th><th bgcolor='lightblue'>CCA Gross Weight</th><th bgcolor='lightblue'>CCA Pieces</th><th bgcolor='lightblue'>CCA Volume</th><th bgcolor='lightblue'>Agent Name </th><th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>Created By</th><th bgcolor='lightblue'>Approved By</th></tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += " <tbody><tr>";
                        str += "<td>" + result.Data[i].CCANo + "</td>";
                        str += "<td>" + result.Data[i].AWBNo + "</td>";
                        str += "<td>" + result.Data[i].Origin + "</td>";
                        str += "<td>" + result.Data[i].Destination + "</td>";
                        str += "<td>" + result.Data[i].flightno + "</td>";
                        str += "<td>" + result.Data[i].CCAGrossWeight + "</td>";
                        str += "<td>" + result.Data[i].CCAPieces + "</td>";
                        str += "<td>" + result.Data[i].CCAVolume + "</td>";
                        str += "<td>" + result.Data[i].AgentName + "</td>";
                        str += "<td>" + result.Data[i].Status + "</td>";
                        str += "<td>" + result.Data[i].CreatedBy + "</td>";
                        str += "<td>" + result.Data[i].UpdatedUser + "</td>";
                        str += "</tr></tbody>";

                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='12'><center><p style='color:red'>Not Exists</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";




                return false
            },

        });
    }



    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '_' + mm + '_' + yyyy;


    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = str;
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = 'CCAReport_' + today + '_.xls';
    a.click();
    //}
    return false

}



function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineCode") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}