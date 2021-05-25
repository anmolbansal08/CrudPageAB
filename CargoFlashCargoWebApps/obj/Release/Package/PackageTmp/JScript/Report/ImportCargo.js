/*
*****************************************************************************
Javascript Name:	ImportCargoJS     
Purpose:		    This JS used to get autocomplete for Import Cargo.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    09 June 2016
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
    var alphabettypes = [{ Key: "A", Text: "Consignee" }, { Key: "B", Text: "Cargo Type" }, { Key: "C", Text: "Destination" }, { Key: "D", Text: "Country" }];
    cfi.AutoCompleteByDataSource("Type", alphabettypes);
  


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
        var Type = $("#Type").val();

        $.ajax({
            url: "Services/Report/ImportCargoService.svc/GetImportCargoRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Type: Type
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0.length>0) {

                    if ($("#Type").val() == "A") {
                        var postfix = "Consignee Wise Report";
                    }
                    else if ($("#Type").val() == "B") {
                        var postfix = "Type Wise Report";
                    }
                    else if ($("#Type").val() == "C") {
                        var postfix = "Destination Wise Report";
                    }
                    else if ($("#Type").val() == "D") {
                        var postfix = "Country Wise Report";
                    }



                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";

                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Import Cargo "+postfix+"</b></font></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='8'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='3' align='LEFT'>From " + Fdt + " To " + Tdt + "</td>  <td align=\"right\" colspan='5'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"



                 //   str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>" + postfix + "</b></font></td></TR>"

                    str += "<tr style='background-color:white;font-size:10pt;font-family:Arial'>"

                    for (var key in dataTableobj.Table0[0]) {
                        str += "<td nowrap width='38%' align='center'><font color='black'><b>" + key.substr(0, 7) + "</b></font></td>"
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
                    //  var data_type = 'data:application/pdf';

                 

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Import Cargo ' + postfix + '.xls';

                    //  a.download = 'Import Cargo ' + postfix + '.pdf';

                    //doc.fromHTML(str.html(), 15, 15, {
                    //    'width': 170,
                    //    'elementHandlers': specialElementHandlers
                    //});
                    //doc.save('sample-file.pdf');

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
        var Type = $("#Type").val();

        $.ajax({
            url: "Services/Report/ImportCargoService.svc/GetImportCargoRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Type: Type
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);

                if (dataTableobj.Table0.length>0) {

                    if ($("#Type").val() == "A") {
                        var postfix = "Import Cargo Consignee Wise Report";
                    }
                    else if ($("#Type").val() == "B") {
                        var postfix = "Import Cargo Type Wise Report";
                    }
                    else if ($("#Type").val() == "C") {
                        var postfix = "Import Cargo Destination Wise Report";
                    }
                    else if ($("#Type").val() == "D") {
                        var postfix = "Import Cargo Country Wise Report";
                    }

                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>" + postfix + "</b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                    for (var key in dataTableobj.Table0[0]) {
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>" + key.substr(0, 7) + "</b></font></td>"
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




                    var myWindow;
                    myWindow = window.open(postfix, "_blank");
                    myWindow.document.write(str);

                    myWindow.document.title =  postfix;



                    //var a = document.createElement('a');
                    //a.href = data_type + ' , ' + encodeURIComponent(str);
                    //a.download = 'Import Cargo ' + postfix + '.xls';



                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}
