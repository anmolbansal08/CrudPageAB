/*
*****************************************************************************
Javascript Name:	CargoRankingJS     
Purpose:		    This JS used to get autocomplete for Cargo Ranking.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    06 June 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
  
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");


    //cfi.AutoComplete("FlightOrigin", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("FlightOrigin", "OriginCity", "v_DailyFlight", "OriginCity", "OriginCity", ["OriginCity"], null, "contains");
    cfi.AutoComplete("FlightNo", "FlightNo", "vDailyFlightFBL", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
  
    $("input[id='Search'][name='Search']").click(function () {
        FlightStatusGrid();    

    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        
        SearchData();


    });

    //$('#FlightOrigin')
    $("#Text_FlightOrigin").data("kendoAutoComplete").key(userContext.CityCode);
    $("#Text_FlightOrigin").data("kendoAutoComplete").value(userContext.CityCode);
    $("#Text_FlightOrigin").data("kendoAutoComplete").enable(false);
});



function SearchData() {
    if (cfi.IsValidSubmitSection()) {
        var fno = $("#FlightNo").val();

        var obj = {
            FlightDate: $("#FlightDate").val(),
            FlightOrigin: $("#FlightOrigin").val(),
            FlightNo: $("#FlightNo").val()
        }


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/FlightStatusService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {

                    var str = "<html><table border=\"1px\">";
                    // var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Flight Build Up Status</b></font></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='8'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='3' align='LEFT'>Flight No => " + fno + "</td>  <td align=\"right\" colspan='5'>Date : " + response[0].Dt + "</td></tr>"


                    str += "<tr ><td>Flight No</td><td>Flight Date </td><td>Flight Origin</td><td>Total Planned ULD</td> <td>Total Manpower</td><td>Total Time</td><td>Completed ULD</td><td>Total Percent[%]</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].FlightNo + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].FlightOrigin + "</td><td>" + response[i].TotalPlannedULD
                            + "</td><td>" + response[i].TotalManpower + "</td><td>" + response[i].TotalTime
                            + "</td><td>" + response[i].CompletedULD + "</td><td>" + response[i].TotalPercent
                            + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Flight Build Up Status ' + postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }

}

function FlightStatusGrid() {
    if (cfi.IsValidSubmitSection()) {
        
        var FDate = $("#FlightDate").val();
        var FOrigin = $("#FlightOrigin").val();
        var FNo = $("#FlightNo").val();
       
        var dbtableName = "FlightStatus";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
          tableColume: 'FlightNo',
          masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 50, whereCondition: '' + FDate +
                '*' + FOrigin +
                '*' + FNo + '', sort: '',
            servicePath: './Services/Report/FlightStatusService.svc',
            getRecordServiceMethod: 'GetFlightStatusRecord',
            createUpdateServiceMethod: 'CreateUpdateFlightStatus',
            deleteServiceMethod: 'DeleteFlightStatus',
            caption: 'Flight Build Up Status',
            initRows: 1,
            columns: [
                   //   { name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'FlightNo', display: 'Flight No', type: 'label', },
                      { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                      { name: 'FlightOrigin', display: 'Flight Origin', type: 'label' },
                      { name: 'TotalPlannedULD', display: 'Total Planned ULD', type: 'label' },
                      { name: 'TotalManpower', display: 'Total Manpower', type: 'label' },
                      { name: 'TotalTime', display: 'Total Time', type: 'label' },
                      { name: 'CompletedULD', display: 'Completed ULD', type: 'label', },
                      { name: 'TotalPercent', display: 'Total Percent[%]', type: 'label' }                  

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}

