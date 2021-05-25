/*
*****************************************************************************
Javascript Name:	PettyJS     
Purpose:		    This JS used to get autocomplete for Petty.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    20 Feb 2017
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

    $("#FlightDt").val("");

   // $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");
   
    $("input[id='Search'][name='Search']").val('PRINT');
    $("input[id='Search'][name='Search']").click(function () {

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate)
        {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else
        {
           // var LogoURL = userContext.SysSetting.LogoURL;
            //var LogoURL = "";
            //LogoURL = str.split('/');
            //LogoURL = str[3] + "/" + str[4];

            window.open("HtmlFiles/RFS/PettyCashVoucher.html?StartDate=" + FromDate + "&EndDate=" + ToDate + "&LogoURL=" + userContext.SysSetting.LogoURL);
           // window.open("http://192.168.2.45/sastest/HtmlFiles/RFS/PettyCashVoucher.html?StartDate=" + FromDate + "&EndDate=" + ToDate);
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
            window.open("HtmlFiles/RFS/PettyCashVoucher.html?StartDate=" + FromDate + "&EndDate=" + ToDate);
            //window.open("HtmlFiles/RFS/PettyCashVoucher.html?StartDate=" + FromDate + "&EndDate=" + ToDate);
        }

           
      

    });


});

//function SearchData() {

//    if (cfi.IsValidSubmitSection()) {
//        var obj = {
            
//            FromDate: $("#FromDate").val(),
//            ToDate:$("#ToDate").val()
//        }

//        $.ajax({
//            type: "POST",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",

//            url: "./Services/Report/ImportStatusService.svc/SearchData",
//            data: JSON.stringify(obj),
//            success: function (response) {
//                if (response.length > 0) {
//                    var str = "<html><table  style='width:90%;'>"
//                    str += "<tr><td align=\"center\" colspan='9'>Import Status </td></tr>"
//                    str += " <tr><td align=\"left\"  colspan='5'>SHARJAH AVIATION SERVICES</td>"
//                    str += " <td align=\"right\" colspan='4'>Date : " + response[0].Dt + "</td></tr></table> "


//                    str += "<br/><table style='width:90%;'  border=\"1px\">";

//                    str += "<tr ><td>Flight Date </td><td>Flight No</td> <td>ETA</td><td>ATA</td><td>NIL Arrived</td><td>FC Completed</td><td>AWB Count</td><td>FWB Count</td><td>FWB CreatedON</td><td>FHL CreatedOn</td></tr>"

//                    for (var i = 0; i < response.length; i++) {
//                        str += "<tr><td>" + response[i].FlightDate + "</td><td>" + response[i].FlightNo + "</td><td>" + response[i].ETA + "</td><td>" + response[i].ATA
//                            + "</td><td>" + response[i].NILArrived + "</td><td>" + response[i].FCCompleted + "</td><td>" + response[i].AWBCount
//                        +"</td><td>"+response[i].FWBcount
//                            + "</td><td>" + response[i].FWBCreatedOn
//                            + "</td><td>" + response[i].FHLCreatedOn
//                            + "</td></tr>"
//                    }
//                    str += "</table></html>";
//                    var data_type = 'data:application/vnd.ms-excel';

//                    var postfix = "";

//                    var a = document.createElement('a');
//                    a.href = data_type + ' , ' + encodeURIComponent(str);
//                    a.download = 'Import Status Report ' + postfix + '.xls';

//                    a.click();


//                }
//                else {
//                    ShowMessage("info", "", "No Data Found...");
//                }
//            }
//        });
//    }
//}

//function Grid() {
//    if (cfi.IsValidSubmitSection()) {

       
//        var FromDate = $("#FromDate").val();
//        var ToDate = $("#ToDate").val();
       

//        var dbtableName = "ImportStatus";

//        $('#tbl' + dbtableName).appendGrid({
//            tableID: 'tbl' + dbtableName,
//            contentEditable: true,
//            isGetRecord: true,
//            tableColume: 'ImportStatus',
//            masterTableSNo: 1,
//            currentPage: 1, itemsPerPage: 5000000, whereCondition: '' + FromDate  +
//                        '*' + ToDate + '', sort: '',
//                  servicePath: './Services/Report/ImportStatusService.svc',
//                  getRecordServiceMethod: 'GetImportStatusRecord',
//            //   createUpdateServiceMethod: 'CreateUpdateUWSPending',
//            //deleteServiceMethod: 'DeleteUWSPending',
//            caption: 'Import Status',
//            initRows: 1,
//            columns: [
                     
                     
//                      { name: 'FlightDate', display: 'Flight Date', type: 'label' },
//                       { name: 'FlightNo', display: 'Flight No', type: 'label', },
//                      { name: 'ETA', display: 'ETA', type: 'label' },
//                      { name: 'ATA', display: 'ATA', type: 'label' },
//                      { name: 'NILArrived', display: 'NIL Arrived', type: 'label' },
//                      {name:'FCCompleted',display:'FC Completed',type:'label'},
//                      { name: 'AWBcount', display: 'AWB Count', type: 'label' },
//                      { name: 'FWBCount', display: 'FWB Count', type: 'label' },
//                      { name: 'FWBCreatedOn', display: 'FWB CreatedOn', type: 'label' },
//                      { name: 'FHLCreatedOn', display: 'FHL CreatedOn', type: 'label' }
                     

//            ],
//            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
//            isPaging: true,
//        });
//    }

//}

