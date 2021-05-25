/*
*****************************************************************************
Javascript Name:	ConsigneeSummaryJS     
Purpose:		    This JS used to get autocomplete for Consignee Summary.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    08 June 2016
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
            Search();
        }


    });


});

function SearchData() {
    

    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
   
        $.ajax({
            url: "Services/Report/ConsigneeSummaryService.svc/GetConsigneeSummaryRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate:FromDate,ToDate:ToDate
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);

                if (dataTableobj.Table0.length > 0) {

                    var str = "<html>"


                    str += "<table border=\"0px\" cellpadding='0' cellspacing='0' width='80%'>"       
               
                   // var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Consignee Summary</b></font></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='8'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='3' align='LEFT'>From " + Fdt + " To " + Tdt + "</td>  <td align=\"right\" colspan='5'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"
                     

                    str += "<tr style='background-color:white;font-size:10pt;font-family:Arial'>"

                    //str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"


                    for (var key in dataTableobj.Table0[0]) {
                        str += "<td nowrap width='38%' align='center'><font color='black'>&nbsp;<b>" + key.substr(0, 7) + "</b></font>&nbsp;</td>"
                    }

                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                        str += "<tr style='background-color:white;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table0[i]) {
                            str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                        }
                        str += "</tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";
                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Consignee Summary ' + postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}


function Search() {
    if (cfi.IsValidSubmitSection()) {
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();

    $.ajax({
        url: "Services/Report/ConsigneeSummaryService.svc/GetConsigneeSummaryRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            FromDate: FromDate, ToDate: ToDate
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0.length>0) {



                var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Consignee Summary</b></font></td></TR>"

                str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                for (var key in dataTableobj.Table0[0]) {
                    str += "<td nowrap width='38%' align='center'><font color='white'>&nbsp;<b>" + key.substr(0, 7) + "</b></font>&nbsp;</td>"
                }

                str += "</tr>"

                for (var i = 0; i < dataTableobj.Table0.length; i++) {
                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    for (var key in dataTableobj.Table0[i]) {
                        str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                    }
                    str += "</tr>"
                }
                str += "</table></html>";
                //var data_type = 'data:application/vnd.ms-excel';

                //var postfix = "";
                //var a = document.createElement('a');
                //a.href = data_type + ' , ' + encodeURIComponent(str);
                //a.download = 'Consignee Summary ' + postfix + '.xls';

                //a.click();
                var myWindow;
                myWindow = window.open("Consignee Summary", "_blank");
                myWindow.document.write(str);
                myWindow.document.title = 'Consignee Summary';

            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
    }
}
