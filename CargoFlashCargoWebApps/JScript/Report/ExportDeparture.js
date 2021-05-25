/*
*****************************************************************************
Javascript Name:	ExportDepartureJS     
Purpose:		    This JS used to get autocomplete for Export Departure.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    23 Nov 2016
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


    $('#spntypespn').closest('td').next().html('<input type="radio" tabindex="3" data-radioval="Export" class="" name="Exclude" id="Exclude" value="1" checked="True">Yes <input type="radio" tabindex="3" data-radioval="Import" class="" name="Exclude" id="Exclude" value="2">No')


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");
    //$("#AirlineSNo").before("<input type="");




    $("input[id='Search'][name='Search']").click(function () {
       
            Grid();
       


    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

            SearchData();
      

    });


});



function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var obj = {
            
            FlightDt: $("#FlightDt").val(),
            Exclude: $("input:radio[name='Exclude']:checked").val()
        }

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/ExportDepartureService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {
                    var str = "<html><table  style='width:90%;'>"
                    str += "<tr><td align=\"center\" colspan='10'>Export Departure </td></tr>"
                    //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                    str += " <tr><td align=\"left\"  colspan='5'>GARUDA AIRLINES</td>"
                    str += " <td align=\"right\" colspan='5'>Date : " + response[0].Dt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";

                    str += "<tr ><td>Flight Date </td><td>Flight No</td> <td>Flight Route</td><td>ETD</td><td>ATD</td><td>Flight Status</td><td>NIL Manifest</td><td>ACType</td><td>Delay In Minutes</td><td>Delay</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].FlightDate + "</td><td>" + response[i].FlightNo + "</td><td>" + response[i].FlightRoute + "</td><td>" + response[i].ETD
                            + "</td><td>" + response[i].ATD + "</td><td>" + response[i].FlightStatus + "</td><td>" + response[i].NILManifest
                            + "</td><td>" + response[i].ACType
                        +"</td><td>"+response[i].DelayMN
                            + "</td><td>" + response[i].Delay 
                            + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Export Departure Report ' + postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}

function Grid() {
    if (cfi.IsValidSubmitSection()) {

       
        var FlightDt = $("#FlightDt").val();
        var Exclude = $("input:radio[name='Exclude']:checked").val();

        var dbtableName = "ExportDeparture";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'ExportDeparture',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 5000000, whereCondition: '' + FlightDt  +
                        '*' + Exclude + '', sort: '',
                  servicePath: './Services/Report/ExportDepartureService.svc',
                  getRecordServiceMethod: 'GetExportDepartureRecord',
            //   createUpdateServiceMethod: 'CreateUpdateUWSPending',
            //deleteServiceMethod: 'DeleteUWSPending',
            caption: 'Export Departure',
            initRows: 1,
            columns: [
                     
                     
                      { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                       { name: 'FlightNo', display: 'Flight No', type: 'label', },
                      { name: 'FlightRoute', display: 'Flight Route', type: 'label' },
                      { name: 'ETD', display: 'ETD', type: 'label' },
                      { name: 'ATD', display: 'ATD', type: 'label' },
                      { name: 'FlightStatus', display: 'Flight Status', type: 'label' },
                      { name: 'NILManifest', display: 'NIL Manifest', type: 'label' },
                      { name: 'ACType', display: 'ACType', type: 'label' },
                      { name: 'DelayMN', display: 'Delay In Minutes', type: 'label' },
                      { name: 'Delay', display: 'Delay [HH:MM]', type: 'label' }
                     

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}

