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



    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    cfi.AutoComplete("Airline", "airlinecode", "vairline", "sno", "airlinecode", ["airlinecode"], null, "contains");


    var alphabettypes = [{ Key: "1", Text: "CASH" }, { Key: "2", Text: "CREDIT" }, { Key: "3", Text: "ALL" }];
    cfi.AutoCompleteByDataSource("PaymentMode", alphabettypes);


    cfi.AutoComplete("Party", "Name", "account", "sno", "Name", ["Name"], null, "contains");



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

function SearchOLD() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();
        var Airline = $("#Airline").val();
        $.ajax({
            url: "Services/Report/ExportCSRService.svc/GetExportCSRRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Airline: Airline
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

                            str += "<table border=\"0px\" cellpadding='0' cellspacing='1' width='98%'>";
                            //str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Export CSR</b></font></td></TR>"
                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='6'>Sharjah Aviation Services</td><td colspan='7' align='center'><img src='\Images/sh.png'/></td><td align=\"right\" colspan='3'><font-size:18pt;font-family:Arial'><b>Export Cargo Sales Report</b></font></td></tr><tr>"


                            str += "<tr><td colspan='16' align='LEFT'><hr color ='red' /><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
                            str += "<tr><td colspan='16' align='LEFT'><font-size:10pt;font-family:Arial'><b>CARGO AGENT</b></font></td> </tr>"
                            str += "<tr><td colspan='16' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

                            str += "<tr><td colspan='16'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"


                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo) {
                                    if (dataTableobj.Table0[i].RowNo == 1) {
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"
                                        str += "<td  width='4%' align='center'>&nbsp;<b>TYPE</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Charge Weight</b>&nbsp;</td>"
                                        str += "<td  width='4%' align='center'>&nbsp;<b>PAY</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Weight</b>&nbsp;</td>"
                                        str += "<td  width='3%' align='center'>&nbsp;<b>Pcs</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Rate</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Dest</b>&nbsp;</td>"
                                        str += "<td  width='13%' align='center'  valign='bottom'>&nbsp;<b><br/>FREIGHT</b><br/><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'><tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'><td  align='right' valign='bottom'><b>Prepaid&nbsp;</b></td><td  valign='bottom'  align='right' ><b>Collect&nbsp;</b></td></tr></table></td>"
                                        str += "<td  width='13%' align='center'  valign='bottom'>&nbsp;<b><br/>DUE CARRIER CHARGES</b><br/><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'><tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'><td  align='right' valign='bottom'><b>HND/OTH &nbsp; Charges&nbsp;</b></td><td  valign='bottom'  align='right' ><b>Fuel&nbsp;  Surcharges&nbsp;</b></td></tr></table></td>"

                                        //   str += "<td  width='7%' align='center'>&nbsp;<b>DUE CARRIER CHARGES</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Agent Commission</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Agent Chgs.Coll</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Payment Status</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>ESS No</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>ESS Date</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Net Amount</b>&nbsp;</td>"

                                        str += "</tr>"
                                    }
                                    //  for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"


                                    str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].CargoType + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalChargeableWeight + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Pay + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalGrossWeight + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].TotalPieces + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Rate + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Destination + "</td>"
                                    str += "<td  width='13%' align='center'  valign='bottom'>&nbsp;<table border=\"0px\" cellpadding='0' cellspacing='0' width='100%'><tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'><td  align='right' valign='bottom' width='50%'>" + dataTableobj.Table0[i].Freight + " </td><td  valign='bottom'  align='center' width='50%' >-</td></tr></table></td>"

                                    str += "<td  width='13%' align='center'  valign='bottom'>&nbsp;<table border=\"0px\" cellpadding='0' cellspacing='0' width='100%'><tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'><td  align='right' valign='bottom' width='50%' >" + dataTableobj.Table0[i].DueCarrier + "</td><td  valign='bottom'  align='center' width='50%'  >-</td></tr></table></td>"


                                    str += "<td align='center'> - </td>"
                                    str += "<td align='center'>&nbsp;</td>"

                                    str += "<td align='center'>" + dataTableobj.Table0[i].Payment + "</td>"

                                    str += "<td align='center'>" + dataTableobj.Table0[i].ESS + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Invoicedate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"



                                    str += "</tr>"
                                }
                            }

                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo) {

                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='4' align='right'><b>Total</b> &nbsp;</td><td align='right'><b>" + dataTableobj.Table2[a].TotalWt + "</b></td><td colspan='3'>&nbsp;</td> <td  align='center'><b>" + dataTableobj.Table2[a].Prepaid +
                                        "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td  align='center'><b>" + dataTableobj.Table2[a].DC + "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align='right' colspan='2'><b>0</b></td><td colspan='4' align='right'><b>" + dataTableobj.Table2[a].TotalNet + "</b></td></tr>"

                                }


                            }


                        }


                        str += "</table></td></tr><p style='page-break-after: always'/>";
                        str += "</table>";
                        str += "</html>";

                        myWindow = window.open("Export CSR", "_blank");
                        myWindow.document.write(str);

                        myWindow.document.title = 'Export CSR';
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


function Search() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();
        var Airline = $("#Airline").val();
        var PaymentMode = $("#PaymentMode").val();
        var Party = $("#Party").val();
        $.ajax({
            url: "Services/Report/ExportCSRService.svc/GetExportCSRRecord",
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
                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='6'>Sharjah Aviation Services</td><td colspan='7' align='center'><img src='\Images/sh.png'/></td><td align=\"right\" colspan='3'><font-size:18pt;font-family:Arial'><b>Export Cargo Sales Report</b></font></td></tr><tr>"


                            str += "<tr><td colspan='16' align='LEFT'><hr color ='red' /><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
                            str += "<tr><td colspan='16' align='LEFT'><font-size:10pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Agent + " </b></font></td> </tr>"
                            str += "<tr><td colspan='16' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

                            str += "<tr><td colspan='16'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"


                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table0[i].Accountsno) {
                                    if (dataTableobj.Table0[i].RowNo == 1) {
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"
                                        
                                        str += "<td  width='4%' align='center'>&nbsp;<b>Flight No</b>&nbsp;</td>"
                                        str += "<td  width='4%' align='center'>&nbsp;<b>Flight Date</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Dest</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Commodity</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Charge Weight</b>&nbsp;</td>"
                                        str += "<td  width='4%' align='center'>&nbsp;<b>Pay</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Weight</b>&nbsp;</td>"
                                        str += "<td  width='3%' align='center'>&nbsp;<b>Pcs</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Rate</b>&nbsp;</td>"                                  
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Freight</b></td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Due Carrier</b></td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Commission</b></td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Net Amount</b></td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>ESS No</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>ESS Date</b>&nbsp;</td>"                                    

                                        str += "</tr>"
                                    }
                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightDate + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Destination + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Commodity + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalChargeableWeight + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Pay + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalGrossWeight + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalPieces + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ChargeRate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Freight + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].DueCarrier + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Commission + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].ESS + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Invoicedate + "</td>"
                                    str += "</tr>"
                                }
                            }

                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table2[a].Accountsno) {

                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='5' align='right'><b>Total</b> &nbsp;</td><td align='right'><b>" + dataTableobj.Table2[a].TotalChWt + "</b></td><td>&nbsp;</td> <td align='right'><b>" + dataTableobj.Table2[a].TotalWt + "</b></td> <td colspan='2'>&nbsp;</td><td  align='right'><b>" + dataTableobj.Table2[a].Prepaid+"</td><td  align='right'><b>" + dataTableobj.Table2[a].DC + "</b></td><td align='right'><b>"+dataTableobj.Table2[a].Commission+"</b></td><td  align='right'><b>" + dataTableobj.Table2[a].TotalNet + "</b></td><td colspan='2'>&nbsp;</td></tr>"

                                }


                            }


                            str += "</table>";
                            str += "</td></tr>";
                            str += "</table>";
                        }



                        str += "</html>";

                        myWindow = window.open("Export CSR", "_blank");
                        myWindow.document.write(str);

                        myWindow.document.title = 'Export CSR';
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
            url: "Services/Report/ExportCSRService.svc/GetExportCSRRecord",
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
                            str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='6'>Sharjah Aviation Services</td><td colspan='6' align='center'><img src='\Images/sh.png'/></td><td align=\"right\" colspan='3'><font-size:18pt;font-family:Arial'><b>EXPORT Cargo Sales Report</b></font></td></tr><tr>"


                            str += "<tr><td colspan='15' align='LEFT'><hr color ='red' /><font-size:16pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Airline + "</b></font></td> </tr>"
                            str += "<tr><td colspan='15' align='LEFT'><font-size:10pt;font-family:Arial'><b>" + dataTableobj.Table3[j].Agent + "</b></font></td> </tr>"
                            str += "<tr><td colspan='15' align='LEFT'>From " + FromDate + " To " + ToDate + "</td> <br/></tr>"

                            str += "<tr><td colspan='15'><table border=\"1px\" cellpadding='0' cellspacing='0' width='100%'>"
                            str += "<tr style='background-color:#E2DFDF;font-size:10pt;font-family:Arial'>"



                            for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table0[i].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table0[i].Accountsno) {
                                    if (dataTableobj.Table0[i].RowNo == 1) {
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Airway Bill No.</b>&nbsp;</td>"

                                        str += "<td  width='4%' align='center'>&nbsp;<b>Flight No</b>&nbsp;</td>"
                                        str += "<td  width='4%' align='center'>&nbsp;<b>Flight Date</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Dest</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Commodity</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Charge Weight</b>&nbsp;</td>"
                                        str += "<td  width='4%' align='center'>&nbsp;<b>Pay</b>&nbsp;</td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>Weight</b>&nbsp;</td>"
                                        str += "<td  width='3%' align='center'>&nbsp;<b>Pcs</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Rate</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Freight</b></td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Due Carrier</b></td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Commission</b></td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>Net Amount</b></td>"
                                        str += "<td  width='7%' align='center'>&nbsp;<b>ESS No</b>&nbsp;</td>"
                                        str += "<td  width='5%' align='center'>&nbsp;<b>ESS Date</b>&nbsp;</td>"

                                        str += "</tr>"
                                    }
                                    //  for (var i = 0; i < dataTableobj.Table0.length; i++) {
                                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].AWBNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightNo + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].FlightDate + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Destination + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Commodity + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalChargeableWeight + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Pay + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalGrossWeight + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].TotalPieces + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].ChargeRate + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Freight + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].DueCarrier + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].Commission + "</td>"
                                    str += "<td align='right'>" + dataTableobj.Table0[i].NetAmount + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].ESS + "</td>"
                                    str += "<td align='center'>" + dataTableobj.Table0[i].Invoicedate + "</td>"
                                    str += "</tr>"
                                }
                            }

                            for (var a = 0; a < dataTableobj.Table2.length; a++) {
                                if (dataTableobj.Table3[j].AirlineSNo == dataTableobj.Table2[a].AirlineSNo && dataTableobj.Table3[j].Accountsno == dataTableobj.Table2[a].Accountsno) {

                                    str += "<tr style='background-color:#F2F4F4;font-size:9pt;font-family:Arial'><td colspan='5' align='right'><b>Total</b> &nbsp;</td><td align='right'><b>" + dataTableobj.Table2[a].TotalChWt + "</b></td><td>&nbsp;</td> <td align='right'><b>" + dataTableobj.Table2[a].TotalWt + "</b></td> <td colspan='2'>&nbsp;</td><td  align='right'><b>" + dataTableobj.Table2[a].Prepaid + "</td><td  align='right'><b>" + dataTableobj.Table2[a].DC + "</b></td><td align='right'><b>" + dataTableobj.Table2[a].Commission + "</b></td><td  align='right'><b>" + dataTableobj.Table2[a].TotalNet + "</b></td><td colspan='2'>&nbsp;</td></tr>"

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
                        a.download = 'Export CSR' + postfix + '.xls';

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

