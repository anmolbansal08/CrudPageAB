/*
*****************************************************************************
Javascript Name:	TariffHistoryJS     
Purpose:		    This JS used to get autocomplete for Tariff History.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    18 June 2016
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

    cfi.AutoComplete("Airline", "airlinecode", "vairline", "sno", "airlinecode", ["airlinecode"], null, "contains");


    var alphabettypes = [{ Key: "1", Text: "CASH" }, { Key: "2", Text: "CREDIT" }, { Key: "3", Text: "ALL" }];
    cfi.AutoCompleteByDataSource("PaymentMode", alphabettypes);



    cfi.AutoComplete("Party", "Name", "account", "sno", "Name", ["Name"], null, "contains");


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


   //var doc = new jsPDF();
   // var specialElementHandlers = {
   //     '#editor': function (element, renderer) {
   //         return true;
   //     }
   // };
   // $('#cmd').click(function () {
   //     doc.fromHTML($('#target').html(), 15, 15, {
   //         'width': 170,
   //         'elementHandlers': specialElementHandlers
   //     });
   //     doc.save('sample-file.pdf');
   // });



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


//function Searchold() {

//    if (cfi.IsValidSubmitSection()) {
//        var FromDate = $("#FromDate").val();

//        var ToDate = $("#ToDate").val();
//        var Airline = $("#Airline").val();
//        $.ajax({
//            url: "Services/Report/ImportCSRService.svc/GetImportCSRRecord",
//            async: false,
//            type: "GET",
//            dataType: "json",
//            data: {
//                FromDate: FromDate, ToDate: ToDate, Airline: Airline
//            },
//            contentType: "application/json; charset=utf-8",
//            cache: false,
//            success: function (data) {
//                var dataTableobj = JSON.parse(data);
//                if (dataTableobj.Table0 != undefined) {
//                    if (dataTableobj.Table0.length > 0) {
//                        var myWindow;

//                        var str = "";

//                        var str = "<html>";

//                        for (var j = 0; j < dataTableobj.Table3.length; j++) {

//                            var str = "<table border=\"0px\" cellpadding='0' cellspacing='1' width='98%'>";
//                            //str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Export CSR</b></font></td></TR>"
//                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='6'>Sharjah Aviation Services</td><td colspan='7' align='center'><img src='\Images/sh.png' /></td><td align=\"right\" colspan='3'><font-size:18pt;font-family:Arial'><b>IMPORT Cargo Sales Report</b></font></td></tr><tr>"



//                            str += "<tr><td colspan='16' align='LEFT'><hr color ='red'/><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
//                            str += "<tr><td colspan='16' align='LEFT'><font-size:10pt;font-family:Arial'><b>CARGO AGENT</b></font></td> </tr>"
//                            str += "<tr><td colspan='16' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

//                            str += "<tr><td colspan='16'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
//                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"


//                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
//                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo) {
//                                    if (dataTableobj.Table0[i].RowNo == 1) {
//                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"
//                                        str += "<td  width='4%' align='center'>&nbsp;<b>Hawb No</b>&nbsp;</td>"
//                                        str += "<td  width='7%' align='center'>&nbsp;<b>Doc No</b>&nbsp;</td>"

//                                        str += "<td  width='30%' align='center'  valign='bottom'>&nbsp;<b><br/>DETAILS OF AIRWAY BILL</b><br/><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'><tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'><td  align='center' valign='bottom' width='20%'><b>Origin&nbsp;</b></td><td width='20%' valign='bottom'  align='center' ><b>Currency&nbsp;</b></td>"
//                                        str += "<td  valign='bottom' width='20%' align='center' ><b>Due Agent&nbsp;</b></td>"
//                                        str += "<td  valign='bottom' width='20%' align='center' ><b>Due Carrier&nbsp;</b></td>"
//                                        str += "<td  valign='bottom'  width='20%'align='center' ><b>Total Collect&nbsp;</b></td>"

//                                        str += "</tr></table></td>"

//                                        str += "<td  width='5%' align='center'>&nbsp;<b>Payment Status</b>&nbsp;</td>"
//                                        str += "<td  width='5%' align='center'>&nbsp;<b>Exchange Rate</b>&nbsp;</td>"
//                                        str += "<td  width='7%' align='center'>&nbsp;<b>Charges Collected Freight</b>&nbsp;</td>"
//                                        str += "<td  width='7%' align='center'>&nbsp;<b>Charges Collect Fees</b>&nbsp;</td>"
//                                        str += "<td  width='7%' align='center'>&nbsp;<b>Net Amount</b>&nbsp;</td>"

//                                        str += "</tr>"
//                                    }
//                                    //    for (var i = 0; i < dataTableobj.Table0.length; i++) {
//                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"


//                                    str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"
//                                    str += "<td align='center'>&nbsp;</td>"
//                                    str += "<td align='center'>" + dataTableobj.Table0[i].ESS + "</td>"

//                                    str += "<td  width='30%' align='center'  valign='top'><table border=\"0.5px\"  border-collapse: collapse; cellpadding='0.1' cellspacing='0.1' width='100%'><tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'><td  align='center' width='20%' valign='bottom'>" + dataTableobj.Table0[i].AirportCode + "&nbsp;</td><td  valign='bottom' width='20%' align='center' >" + dataTableobj.Table0[i].Currency + "</td>"
//                                    str += "<td  valign='bottom' width='20%' align='right' >" + dataTableobj.Table0[i].DueAgent + "</td>"
//                                    str += "<td  valign='bottom' width='20%'  align='right' >" + dataTableobj.Table0[i].DueCarrier + "</td>"
//                                    str += "<td  valign='bottom' width='20%' align='right' >" + dataTableobj.Table0[i].Collect + "</td>"

//                                    str += "</tr></table></td>"

//                                    str += "<td align='center'>" + dataTableobj.Table0[i].Payment + "</td>"
//                                    str += "<td align='right'>" + dataTableobj.Table0[i].Rate + "</td>"
//                                    str += "<td align='right'>" + dataTableobj.Table0[i].CCF + "</td>"
//                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalCollect + "</td>"
//                                    str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"



//                                    str += "</tr>"
//                                }
//                            }

//                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
//                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo) {

//                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='6' align='right'><b>Total</b> &nbsp;</td> <td  align='right'><b>" + dataTableobj.Table2[a].TotalCollect + "</b></td><td  align='right'><b>" + dataTableobj.Table2[a].TCCF + "</b></td><td align='right'><b>" + dataTableobj.Table2[a].Net + "</b></td></tr>"


//                                }


//                            }

//                            str += "</table></td></tr>";
//                        }


//                       // str += "</table></td></tr><p style='page-break-after: always'/>";

//                        str += "</table>";
//                        str += "</html>";
//                        myWindow = window.open("Import CSR", "_blank");
//                        myWindow.document.write(str);

//                        myWindow.document.title = 'Import CSR';

//                    }

//                    else {
//                        ShowMessage("info", "", "No Data Found...");
//                    }
//                }
//                else {
//                    ShowMessage("info", "", "No Data Found...");
//                }
//            }
//            //}
//        });
//    }

//}


//function SearchOLDFormat27dec2016() {

//    if (cfi.IsValidSubmitSection()) {
//        var FromDate = $("#FromDate").val();

//        var ToDate = $("#ToDate").val();
//        var Airline = $("#Airline").val();
//        $.ajax({
//            url: "Services/Report/ImportCSRService.svc/GetImportCSRRecord",
//            async: false,
//            type: "GET",
//            dataType: "json",
//            data: {
//                FromDate: FromDate, ToDate: ToDate, Airline: Airline
//            },
//            contentType: "application/json; charset=utf-8",
//            cache: false,
//            success: function (data) {
//                var dataTableobj = JSON.parse(data);
//                if (dataTableobj.Table0 != undefined) {
//                    if (dataTableobj.Table0.length > 0) {
//                        var myWindow;

//                        var str = "";

//                        var str = "<html>";

//                        for (var j = 0; j < dataTableobj.Table3.length; j++) {

//                            str += "<table border=\"0px\" cellpadding='0' cellspacing='1' width='98%'>";
//                            //str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Export CSR</b></font></td></TR>"
//                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='6'>Sharjah Aviation Services</td><td colspan='7' align='center'><img src='\Images/sh.png'/></td><td align=\"right\" colspan='3'><font-size:18pt;font-family:Arial'><b>Import Cargo Sales Report</b></font></td></tr><tr>"


//                            str += "<tr><td colspan='16' align='LEFT'><hr color ='red' /><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
//                            str += "<tr><td colspan='16' align='LEFT'><font-size:10pt;font-family:Arial'><b>CARGO AGENT</b></font></td> </tr>"
//                            str += "<tr><td colspan='16' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

//                            str += "<tr><td colspan='16'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
//                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"


//                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
//                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo) {
//                                    if (dataTableobj.Table0[i].RowNo == 1) {
//                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"
//                                                                                str += "<td  width='4%' align='center'>&nbsp;<b>Hawb No</b>&nbsp;</td>"
//                                                                                str += "<td  width='7%' align='center'>&nbsp;<b>Doc No</b>&nbsp;</td>"

//                                                                                str += "<td  width='30%' align='center'  valign='bottom'>&nbsp;<b><br/>DETAILS OF AIRWAY BILL</b><br/><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'><tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'><td  align='center' valign='bottom' width='20%'><b>Origin&nbsp;</b></td><td width='20%' valign='bottom'  align='center' ><b>Currency&nbsp;</b></td>"
//                                                                                str += "<td  valign='bottom' width='20%' align='center' ><b>Due Agent&nbsp;</b></td>"
//                                                                                str += "<td  valign='bottom' width='20%' align='center' ><b>Due Carrier&nbsp;</b></td>"
//                                                                                str += "<td  valign='bottom'  width='20%'align='center' ><b>Total Collect&nbsp;</b></td>"

//                                                                                str += "</tr></table></td>"

//                                                                                str += "<td  width='5%' align='center'>&nbsp;<b>Payment Status</b>&nbsp;</td>"
//                                                                                str += "<td  width='5%' align='center'>&nbsp;<b>Chargeable Wt.</b>&nbsp;</td>"
//                                                                                str += "<td  width='5%' align='center'>&nbsp;<b>Exchange Rate</b>&nbsp;</td>"
//                                                                                str += "<td  width='5%' align='center'>&nbsp;<b>Charge Rate</b>&nbsp;</td>"
//                                                                                str += "<td  width='7%' align='center'>&nbsp;<b>Charges Collected Freight</b>&nbsp;</td>"
//                                                                                str += "<td  width='7%' align='center'>&nbsp;<b>Charges Collect Fees</b>&nbsp;</td>"
//                                                                                str += "<td  width='7%' align='center'>&nbsp;<b>Net Amount</b>&nbsp;</td>"

//                                        str += "</tr>"
//                                    }


//                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"


//                                                                        str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"
//                                                                        str += "<td align='center'>&nbsp;</td>"
//                                                                        str += "<td align='center'>" + dataTableobj.Table0[i].ESS + "</td>"

//                                                                        str += "<td  width='30%' align='center'  valign='top'><table border=\"0.5px\"  border-collapse: collapse; cellpadding='0.1' cellspacing='0.1' width='100%'><tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'><td  align='center' width='20%' valign='bottom'>" + dataTableobj.Table0[i].AirportCode + "&nbsp;</td><td  valign='bottom' width='20%' align='center' >" + dataTableobj.Table0[i].Currency + "</td>"
//                                                                        str += "<td  valign='bottom' width='20%' align='right' >" + dataTableobj.Table0[i].DueAgent + "</td>"
//                                                                        str += "<td  valign='bottom' width='20%'  align='right' >" + dataTableobj.Table0[i].DueCarrier + "</td>"
//                                                                        str += "<td  valign='bottom' width='20%' align='right' >" + dataTableobj.Table0[i].Collect + "</td>"

//                                                                        str += "</tr></table></td>"

//                                                                        str += "<td align='center'>" + dataTableobj.Table0[i].Payment + "</td>"
//                                                                        str += "<td align='right'>" + dataTableobj.Table0[i].ChargeWt + "</td>"
//                                                                        str += "<td align='right'>" + dataTableobj.Table0[i].Rate + "</td>"
//                                                                        str += "<td align='right'>" + dataTableobj.Table0[i].ChargeRate + "</td>"
//                                                                        str += "<td align='right'>" + dataTableobj.Table0[i].CCF + "</td>"
//                                                                        str += "<td align='right'>" + dataTableobj.Table0[i].TotalCollect + "</td>"
//                                                                        str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"


//                                    str += "</tr>"
//                                }
//                            }

//                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
//                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo) {


//                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='6' align='right'><b>Total</b> &nbsp;</td> <td  align='right'><b>" + dataTableobj.Table2[a].TotalCollect + "</b></td><td  align='right'><b>" + dataTableobj.Table2[a].TCCF + "</b></td><td align='right'><b>" + dataTableobj.Table2[a].Net + "</b></td></tr>"
//                                }


//                            }


//                        }


//                        str += "</table></td></tr><p style='page-break-after: always'/>";
//                        str += "</table>";
//                        str += "</html>";

//                        myWindow = window.open("Import CSR", "_blank");
//                        myWindow.document.write(str);

//                        myWindow.document.title = 'Import CSR';
//                    }

//                    else {
//                        ShowMessage("info", "", "No Data Found...");
//                    }


//                }
//                else {
//                    ShowMessage("info", "", "No Data Found...");
//                }
//            }
//            //}
//        });
//    }

//}


function Search() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();
        var Airline = $("#Airline").val();

        var PaymentMode = $("#PaymentMode").val();
        var Party = $("#Party").val();

        $.ajax({
            url: "Services/Report/ImportCSRService.svc/GetImportCSRRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Airline: Airline, PaymentMode: PaymentMode,Party:Party
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0 != undefined) {
                    if (dataTableobj.Table0.length > 0) {
                        var myWindow;

                        var str = "";

                        var str = "<html>";
                        //  str += "<div id='editor'></div><button id='cmd'>generate PDF</button><div id='content'>";

                        for (var j = 0; j < dataTableobj.Table3.length; j++) {
                            if (j > 0) {
                                str += "<div id=pagebreak style='display: block;page-break-before: always'></div>";
                            }

                            str += "<table border=\"0px\" cellpadding='0' cellspacing='1' width='98%'>";
                            //str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Export CSR</b></font></td></TR>"
                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='6'>Sharjah Aviation Services</td><td colspan='7' align='center'><img src='\Images/sh.png'/></td><td align=\"right\" colspan='3'><font-size:18pt;font-family:Arial'><b>Import Cargo Sales Report</b></font></td></tr><tr>"


                            str += "<tr><td colspan='16' align='LEFT'><hr color ='red' /><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
                            str += "<tr><td colspan='16' align='LEFT'><font-size:10pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Agent + "</b></font></td> </tr>"
                            str += "<tr><td colspan='16' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

                            str += "<tr><td colspan='16'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"


                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table0[i].Accountsno) {
                                    if (dataTableobj.Table0[i].RowNo == 1) {
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Flight No.</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Flight Date</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Origin</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Base Currency</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Chargeable Wt.</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Rate</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Collect Amount</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>CC Fees</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Exchange Rate</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Amount Collected</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Doc No</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Payment Status</b>&nbsp;</td>"
                                        str += "</tr>"
                                    }


                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"


                                    str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"

                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightDate + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].AirportCode + "</td>"


                                    str += "<td align='center'>" + dataTableobj.Table0[i].Currency + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ChargeWt + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ChargeRate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].CollectAmount + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].CCAmount + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Rate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ESS + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Payment + "</td>"


                                    str += "</tr>"
                                }
                            }

                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table2[a].Accountsno) {


                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='5' align='right'><b>Total</b> &nbsp;</td> <td  align='right'><b>" + dataTableobj.Table2[a].TotalChargeWt + "</b></td><td>&nbsp;</td><td  align='right'><b>" + dataTableobj.Table2[a].TotalCollect + "</b></td><td  align='right'><b>" + dataTableobj.Table2[a].TotalCC + "</b></td><td>&nbsp;</td><td align='right'><b>" + dataTableobj.Table2[a].Net + "</b></td><td colspan='2'>&nbsp;</td></tr>"
                                }


                            }

                            str += "</table>";
                            str += "</td></tr>";
                            str += "</table></div>";
                        }



                        str += "</html>";

                        myWindow = window.open("Import CSR", "_blank");
                        myWindow.document.write(str);

                        myWindow.document.title = 'Import CSR';
                    }

                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
            //}
        });
    }

}


function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();
        var Airline = $("#Airline").val();
        var PaymentMode = $("#PaymentMode").val();
        var Party = $("#Party").val();
        $.ajax({
            url: "Services/Report/ImportCSRService.svc/GetImportCSRRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Airline: Airline, PaymentMode: PaymentMode,Party:Party
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0 != undefined) {
                    if (dataTableobj.Table0.length > 0) {
                        var myWindow;

                        var str = "";

                        var str = "<html>";


                        for (var j = 0; j < dataTableobj.Table3.length; j++) {

                            if (j > 0) {
                                str += "<div id=pagebreak style='display: block;page-break-before: always'></div>";
                            }

                            str += "<table border=\"0px\" cellpadding='0' cellspacing='1' width='98%'>";
                            //str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Export CSR</b></font></td></TR>"
                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='4'>Sharjah Aviation Services</td><td colspan='6' align='center'><img src='\Images/sh.png'/></td><td align=\"right\" colspan='2'><font-size:18pt;font-family:Arial'><b>Import Cargo Sales Report</b></font></td></tr><tr>"


                            str += "<tr><td colspan='12' align='LEFT'><hr color ='red' /><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
                            str += "<tr><td colspan='12' align='LEFT'><font-size:10pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Agent + "</b></font></td> </tr>"
                            str += "<tr><td colspan='12' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

                            str += "<tr><td colspan='12'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"


                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table0[i].Accountsno) {
                                    if (dataTableobj.Table0[i].RowNo == 1) {
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Flight No.</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Flight Date</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Origin</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Base Currency</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Chargeable Wt.</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Rate</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Collect Amount</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>CC Fees</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Exchange Rate</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Amount Collected</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Doc No</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Payment Status</b>&nbsp;</td>"
                                        str += "</tr>"
                                    }


                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"


                                    str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"

                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightDate + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].AirportCode + "</td>"


                                    str += "<td align='center'>" + dataTableobj.Table0[i].Currency + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ChargeWt + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ChargeRate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].CollectAmount + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].CCAmount + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Rate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ESS + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Payment + "</td>"


                                    str += "</tr>"
                                }
                            }

                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table2[a].Accountsno) {


                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='5' align='right'><b>Total</b> &nbsp;</td> <td  align='right'><b>" + dataTableobj.Table2[a].TotalChargeWt + "</b></td><td>&nbsp;</td><td  align='right'><b>" + dataTableobj.Table2[a].TotalCollect + "</b></td><td  align='right'><b>" + dataTableobj.Table2[a].TotalCC + "</b></td><td>&nbsp;</td><td align='right'><b>" + dataTableobj.Table2[a].Net + "</b></td><td colspan='2'>&nbsp;</td></tr>"
                                }


                            }


                            str += "</table>";
                            str += "</td></tr>";
                            str += "</table>";
                        }



                        str += "</html>";

                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Import CSR' + postfix + '.xls';

                        a.click();
                    }

                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
            //}
        });
    }

}