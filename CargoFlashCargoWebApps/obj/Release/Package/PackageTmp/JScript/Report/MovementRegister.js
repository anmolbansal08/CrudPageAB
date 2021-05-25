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


    $('#spntypespn').closest('td').next().html('<input type="radio" tabindex="3" data-radioval="reporttype" class="" name="reporttype" id="reporttype" value="1" checked="True">Import <input type="radio" tabindex="3" data-radioval="reporttype" class="" name="reporttype" id="reporttype" value="2">Export')

    $('#spnrspn').closest('td').next().html('<input type="radio" tabindex="4" data-radioval="IsRFS" class="" name="IsRFS" id="IsRFS" value="1" checked="True">Yes <input type="radio" tabindex="4" data-radioval="IsRFS" class="" name="IsRFS" id="IsRFS" value="2">No  <input type="radio" tabindex="4" data-radioval="IsRFS" class="" name="IsRFS" id="IsRFS" value="3">Both')



    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");
    //$("#AirlineSNo").before("<input type="");




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
            Grid();
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
        else {
            SearchData();
        }


           
      

    });


});



function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var obj = {

            FromDt: $("#FromDate").val(),
            ToDt: $("#ToDate").val(),
            reporttype:  $("input:radio[name='reporttype']:checked").val(),           
            ISRFS: $("input:radio[name='IsRFS']:checked").val()
        }

        var rpttype= $("input:radio[name='reporttype']:checked").val();

        
        if (rpttype == "2") {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "./Services/Report/MovementRegisterService.svc/SearchExportData",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {
                        var str = "<html><table  style='width:90%;'>"
                        str += "<tr><td align=\"center\" colspan='10'>Export Movement Register</td></tr>"
                        str += " <tr><td align=\"left\"  colspan='5'>SHARJAH AVIATION SERVICES</td>"
                        str += " <td align=\"right\" colspan='5'>Date : " + response[0].Dt + "</td></tr></table> "
                      //str += " <td align=\"right\" colspan='5'></td></tr></table> "

                        str += "<br/><table style='width:90%;'  border=\"1px\">";

                        str += "<tr ><td>SNo</td><td>FLIGHT NO </td><td>FLIGHT DATE</td> <td>RFS</td><td>FLIGHT STATUS</td><td>AWB</td><td>MANIFEST PCS</td><td>MANIFEST WT</td><td>OFFLOAD PCS</td><td>OFFLOAD WT</td><td>LBD PCS</td><td>CGO WT</td><td>UPLIFT PCS</TD><TD>UPLIFT WT</TD></tr>"
                        var j=0;
                        for (var i = 0; i < response.length; i++) {
                            j++;
                              str += "<tr><td>"+j +"</td> <td>" + response[i].FlightNo + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].RFS + "</td><td>" + response[i].FlightStatus + "</td><td>" + response[i].AWB
                                  + "</td><td>" + response[i].MnfPc + "</td><td>" + response[i].MnfWt + "</td><td>" + response[i].OffPc
                                  + "</td><td>" + response[i].OffWt
                              + "</td><td>" + response[i].LBdPc
                                  + "</td><td>" + response[i].CGOWt + "</td><td>" + response[i].UpliftPc + "</td><td>" + response[i].UpliftWt
                                  + "</td></tr>"
                          }
                          
                        
                          str += "</table></html>";
                          var data_type = 'data:application/vnd.ms-excel';
      
                          var postfix = "";
      
                          var a = document.createElement('a');
                          a.href = data_type + ' , ' + encodeURIComponent(str);
                          a.download = 'Export Movement Register ' + postfix + '.xls';
      
                          a.click();


                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });
        }
        else 
        {
            
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "./Services/Report/MovementRegisterService.svc/SearchImportData",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        if (response.length > 0) {
                            var str = "<html><table  style='width:90%;'>"
                            str += "<tr><td align=\"center\" colspan='10'>Import Movement Register</td></tr>"
                            str += " <tr><td align=\"left\"  colspan='5'>SHARJAH AVIATION SERVICES</td>"
                         str += " <td align=\"right\" colspan='5'>Date : " + response[0].Dt + "</td></tr></table> "
                        //  str += " <td align=\"right\" colspan='5'></td></tr></table> "

                            str += "<br/><table style='width:90%;'  border=\"1px\">";




                             str += "<tr ><td>SNo</td><td>FLIGHT NO</td><td>FLIGHT DATE</td><td>ATA</td><td>MOVEMENT NO</td><td>MOVEMENT DATE</td><td>ORIGIN</td><td>RFS</td><td>AGENT</td><td>AWB</td><td>CRP</td><td>ULD</TD><TD>DPY</TD><td>PIECES</td><td>ARRIVED WT</TD><TD>CARGO WT</TD></tr>"
                             var j = 0;
                             for (var i = 0; i < response.length; i++) {
                                 j++;
                                 str += "<tr><td>" + j + "</td><td>" + response[i].FlightNo + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].ATA + "</td><td>"
                                     + response[i].MovementNo + "</td><td>" + response[i].MovementDate + "</td><td>" + response[i].Origin + "</td><td>" + response[i].RFS + "</td><td>" + response[i].Agent
                                     + "</td><td>" + response[i].AWB
                                    + "</td><td>" + response[i].CRP
                                + "</td><td>" + response[i].ULD
                                    + "</td><td>" + response[i].DPY + "</td><td>" + response[i].Pieces + "</td><td>" + response[i].ArivedWt + "</td><td>" + response[i].CargoWt
                                    + "</td></tr>"
                            }

                            
                            str += "</table></html>";
                            var data_type = 'data:application/vnd.ms-excel';

                            var postfix = "";

                            var a = document.createElement('a');
                            a.href = data_type + ' , ' + encodeURIComponent(str);
                            a.download = 'Import Movement Register ' + postfix + '.xls';

                            a.click();


                        }
                        else {
                            ShowMessage("info", "", "No Data Found...");
                        }
                    }
                });
            }
    }
}

function Grid() {
    if (cfi.IsValidSubmitSection()) {

       
        var FromDt =$("#FromDate").val();
        var ToDt =$("#ToDate").val();

        var reporttype = $("input:radio[name='reporttype']:checked").val();
        
        var ISRFS = $("input:radio[name='IsRFS']:checked").val();

        var dbtableName = "MovementRegister";

        if (reporttype == "2") {

            $('#tbl' + dbtableName).appendGrid({
                tableID: 'tbl' + dbtableName,
                contentEditable: true,
                isGetRecord: true,
                tableColume: 'MovementRegister',
                masterTableSNo: 1,
                currentPage: 1, itemsPerPage: 5000000, whereCondition: '' + FromDt +
                            '*' + ToDt + '*' + reporttype + '*' + ISRFS + '', sort: '',
                servicePath: './Services/Report/MovementRegisterService.svc',
                getRecordServiceMethod: 'GetMovementExportRegisterRecord',
         
                caption: 'Export Movement Register',
                initRows: 1,
                columns: [

           

                            { name: 'FlightNo', display: 'FLIGHT NO', type: 'label' },
                            { name: 'FlightDate', display: 'FLIGHT DATE', type: 'label', },
                            { name: 'FlightStatus', display: 'FLIGHT STATUS', type: 'label' },
                             { name: 'RFS', display: 'RFS', type: 'label' },
                             { name: 'AWB', display: 'AWB', type: 'label' },
                            { name: 'MnfPc', display: 'MANIFEST PC', type: 'label' },
                          { name: 'MnfWt', display: 'MANIFEST WT', type: 'label' },                         
                          { name: 'OffPc', display: 'OFFLOAD PC', type: 'label' },
                          { name: 'OffWt', display: 'OFFLOAD WT', type: 'label' },
                          { name: 'LBdPc', display: 'LBD PC', type: 'label' },
                          { name: 'CGOWt', display: 'CGO WT', type: 'label' },
                           { name: 'UpliftPc', display: 'UPLIFT PC', type: 'label' },
                           { name: 'UpliftWt', display: 'UPLIFT WT', type: 'label' }


                ],
                hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                isPaging: true,
            });
        }
        else
        {

            $('#tbl' + dbtableName).appendGrid({
                tableID: 'tbl' + dbtableName,
                contentEditable: true,
                isGetRecord: true,
                tableColume: 'MovementRegister',
                masterTableSNo: 1,
                currentPage: 1, itemsPerPage: 5000000, whereCondition: '' + FromDt +
                             '*' + ToDt + '*' + reporttype + '*' + ISRFS + '', sort: '',
                servicePath: './Services/Report/MovementRegisterService.svc',
                getRecordServiceMethod: 'GetMovementImportRegisterRecord',
                //   createUpdateServiceMethod: 'CreateUpdateUWSPending',
                //deleteServiceMethod: 'DeleteUWSPending',
                caption: 'Import Movement Register',
                initRows: 1,
                columns: [

                        
                           { name: 'FlightNo', display: 'FLIGHT NO', type: 'label', },
                             { name: 'FlightDate', display: 'FLIGHT DATE', type: 'label' },

                          { name: 'ATA', display: 'ATA', type: 'label' },
                          { name: 'MovementNo', display: 'MOVEMENT NO', type: 'label' },
                          { name: 'MovementDate', display: 'MOVEMENT DATE', type: 'label' },
                       
                          { name: 'Origin', display: 'ORIGIN', type: 'label' },
                             { name: 'RFS', display: 'RFS', type: 'label' },
                                { name: 'Agent', display: 'AGENT', type: 'label' },
                          { name: 'AWB', display: 'AWB', type: 'label' },
                          { name: 'CRP', display: 'CRP', type: 'label' },
                          { name: 'ULD', display: 'ULD', type: 'label' },
                          { name: 'DPY', display: 'DPY', type: 'label' },
                          { name: 'Pieces', display: 'PIECES', type: 'label' },
                          { name: 'ArivedWt', display: 'ARRIVED WT', type: 'label' },
                          { name: 'CargoWt', display: 'CARGO WT', type: 'label' }


                ],
                hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                isPaging: true,
            });

        }
        
    }

}

