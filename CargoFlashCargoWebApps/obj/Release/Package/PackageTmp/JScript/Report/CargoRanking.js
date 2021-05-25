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
  //  var alphabettypes = [{ Key: "0", Text: "OffLoaded" }, { Key: "1", Text: "Transit" }, { Key: "2", Text: "Transfer" }];
   // cfi.AutoCompleteByDataSource("Status", alphabettypes);
    //cfi.AutoComplete("SHC", "Code", "SPHC", "Code", "Code", null, null, "contains");
    //cfi.AutoComplete("AWBNo", "AWBNo", "AWB", "AWBNo", "AWBNo", null, null, "contains");
    //cfi.AutoComplete("Origin", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");
    //cfi.AutoComplete("Destination", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");
    //cfi.AutoComplete("Airline", "AirlineCode,AirlineName", "vwairline", "CarrierCode", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
    //cfi.AutoComplete("ULDNo", "ULDName", "ULD", "ULDName", "ULDName", null, null, "contains");
   

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");
  
    $("input[id='Search'][name='Search']").click(function () {       
       
        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            CargoRankingGrid();
        }
        
      

    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        
        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
        
            return false;
        }
        else{
         SearchData();
        }

        


    });


});


function SearchData() {


    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();

    if (cfi.IsValidSubmitSection()) {
        var obj = {
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val()
        }


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/CargoRankingService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {
                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>CARGO RANKING REPORT <BR/> AGENT WISE </td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                       "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";
                    //var str = "<html><table border=\"1px\">";
                    str += "<tr ><td>Agent Code</td><td>Agent </td><td>Export</td><td>E/Rank</td> <td>Import</td><td>I/Rank</td><td>Total</td><td>Rank</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].AgentCode + "</td><td>" + response[i].Agent + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                            + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                            + "</td><td>" + response[i].Total + "</td><td>" + response[i].Rank
                            + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "Agent Wise";

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Cargo Ranking ' + postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}



function CargoRankingGrid() {
    if (cfi.IsValidSubmitSection()) {
        
        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
       
        var dbtableName = "CargoRanking";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
          tableColume: 'AgentCode',
          masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 50, whereCondition: '' + FDate +
                '*' + TDate + '', sort: '',
            servicePath: './Services/Report/CargoRankingService.svc',
            getRecordServiceMethod: 'GetCargoRankingRecord',
            createUpdateServiceMethod: 'CreateUpdateCargoRanking',
            deleteServiceMethod: 'DeleteCargoRanking',
            caption: 'Cargo Ranking Agent Wise',
            initRows: 1,
            columns: [
                      { name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'AgentCode', display: 'Code', type: 'label', },
                      { name: 'Agent', display: 'Agent', type: 'label' },
                      { name: 'Export', display: 'Export', type: 'label' },
                      { name: 'ERank', display: 'E/Rank', type: 'label' },
                      { name: 'Import', display: 'Import', type: 'label' },
                      { name: 'IRank', display: 'I/Rank', type: 'label' },
                      { name: 'Total', display: 'Total', type: 'label', },
                      { name: 'Rank', display: 'Rank', type: 'label' }                  

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}

