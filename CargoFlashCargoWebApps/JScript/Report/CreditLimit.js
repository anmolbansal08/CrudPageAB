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

    cfi.AutoCompleteV2("Agent", "Name", "CreditLimit_Name", null, "contains");

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

function Search() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();
        var Agent = $("#Agent").val();
        $.ajax({
            url: "Services/Report/CreditLimitService.svc/GetCreditLimitRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Agent: Agent
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0 != undefined) {
                    if (dataTableobj.Table0.length > 0) {
                        var myWindow;

                        var str = "";

                        var str = "<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script> <script>function printsd(){ $('#btnprint').hide(); window.print(); }  </script> <html><div id='divprint'><input type='button' id='btnprint' onclick='printsd()' name='Print' value='Print'/></div><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:15pt;font-family:Arial'><td align='center' colspan='12'><font color=':#419AD4'><b>Credit Limit History</b></font></td></TR>"
                        //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='12'>GARUDA AIRLINES</td></tr><tr><td colspan='6' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='8'>Date : " + dataTableobj.Table4[0].Dt + "</td></tr>"

                        str += "<tr><td colspan='10'><br/></td></tr>"

                        for (var i = 0; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='font-size:11pt;font-family:Arial'>"


                            str += "<td align='left'><b>" + dataTableobj.Table0[i].agent + "</b></td>"

                            str += "<tr><td colspan='12'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";
                            for (var j = 0; j < dataTableobj.Table1.length; j++) {

                                if (dataTableobj.Table0[i].sno == dataTableobj.Table1[j].sno) {


                                    if (dataTableobj.Table1[j].RowNo == 1) {
                                        str += "<tr style='background-color:#E2DFDF;font-size:9pt;font-family:Arial'><td align='center'><b>CURRENCY</b></td><td align='center'><b>EXISTING CREDIT LIMIT</b></td><td align='center'><b>UPDATE TYPE</b></td><td align='center'><b>AMOUNT</b></td>"
                                        str += "<td align='center'><b>REMARKS</b></td>   <td align='center'><b>UPDATED BY </b></td> <td align='center'><b>UPDATED AT </b></td><td align='center'><b>NEW CREDIT LIMIT</b></td> <td align='center'><b>CHQ/TRANS DATE</b></td>                                            <td align='center'><b>CHQ/REF NO</b></td> <td align='center'><b>TYPE</b></td> <td align='center'><b>MODE</b></td></tr>"
                                    }
                                    str += "<tr  style='font-size:8pt;font-family:Arial'>"

                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].CurrencyCode + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table1[j].ExistingCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].UpdateType + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + (dataTableobj.Table1[j].Amount).substr(1, 60) + "&nbsp;&nbsp;&nbsp;</b></td>";
                                    str += "<td width='7%'><span style='max-width:70px; word-wrap:break-word;display: inline-block;'><b>" + dataTableobj.Table1[j].Remarks + "</b></span></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].ApprovedBy + "</b></td>";
                                    str += "<td width='11%' align='center'><b>" + dataTableobj.Table1[j].UpdatedAt + "</b>&nbsp;&nbsp;</td>";
                                    str += "<td width='11%' align='right'><b>" + dataTableobj.Table1[j].NewCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].ChDate + "</b></td>";
                                    str += "<td width='11%' align='center'><b>" + dataTableobj.Table1[j].ChNo + "</b></td>";
                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].Type + "</b></td>";
                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].Mode + "</b></td>";

                                    str += "</tr>"


                                }
                            }
                            str += "</table></td></tr>"

                            /* for (var z = 0; z< dataTableobj.Table2.length; z++) {
 
                                if (dataTableobj.Table0[i].sno == dataTableobj.Table2[z].sno) {
 
                                   str += "<tr><td colspan='8'><hr/><table width='100%' cellpadding='0' cellspacing='1' border='0'>";
                                    
                                    str += "<tr  style='font-size:9pt;font-family:Arial'>"
 
                                    str += "<td width=7%' align='right'><b>Sub Total : &nbsp;</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].ExistingCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].Amount.substr(1, 60) + "&nbsp;&nbsp;&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                   
                                    str += "</tr></table><hr/></td></tr>"
                                }
                            }*/




                            str += "</tr>"
                        }


                        /* str += "<tr><td colspan='8'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";

                         str += "<tr  style='font-size:10pt;font-family:Arial'>"

                         str += "<td width=7%' align='right'><b>Grand Total : &nbsp;</b></td>";
                         str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[0].ExistingCreditLimit.substr(1, 60) + "</b></td>";
                         str += "<td width='7%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[0].Amount.substr(1, 60) + "&nbsp;&nbsp;&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";

                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                         str += "<td width='11%' align='center'><b>&nbsp;</b></td>";

                         str += "</tr></table><hr/></td></tr>"*/



                        //    str+="</table></td></tr>"


                        str += "</table></html>";
                        myWindow = window.open("Credit Limit History", "_blank");
                        myWindow.document.write(str);

                        myWindow.document.title = 'Credit Limit History';


                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            }
        });
    }

}


function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();
        var Agent = $("#Agent").val();
        $.ajax({
            url: "Services/Report/CreditLimitService.svc/GetCreditLimitRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Agent: Agent
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0 != undefined) {
                    if (dataTableobj.Table0.length > 0) {
                        var myWindow;

                        var str = "";

                        var str = "<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script> <script>function printsd(){ $('#btnprint').hide(); window.print(); }  </script> <html><div id='divprint'><input type='button' id='btnprint' onclick='printsd()' name='Print' value='Print'/></div><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:15pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>Credit Limit History</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>GARUDA AIRLINES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table4[0].Dt + "</td></tr>"

                        str += "<tr><td colspan='10'><br/></td></tr>"

                        for (var i = 0; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='font-size:11pt;font-family:Arial'>"


                            str += "<td align='left'><b>" + dataTableobj.Table0[i].agent + "</b></td>"
                            str += "<tr><td colspan='8'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";

                            for (var j = 0; j < dataTableobj.Table1.length; j++) {

                                if (dataTableobj.Table0[i].sno == dataTableobj.Table1[j].sno) {


                                    if (dataTableobj.Table1[j].RowNo == 1) {
                                        str += "<tr style='background-color:#E2DFDF;font-size:9pt;font-family:Arial'><td align='center'><b>CURRENCY</b></td><td align='center'><b>EXISTING CREDIT LIMIT</b></td><td align='center'><b>UPDATE TYPE</b></td><td align='center'><b>AMOUNT</b></td>"
                                        str += "<td align='center'><b>REMARKS</b></td>   <td align='center'><b>UPDATED BY </b></td> <td align='center'><b>UPDATED AT </b></td>                                          <td align='center'><b>NEW CREDIT LIMIT</b></td><td align='center'><b>CHQ/TRANS DATE</b></td>                                            <td align='center'><b>CHQ/REF NO</b></td> <td align='center'><b>TYPE</b></td> <td align='center'><b>MODE</b></td></tr>"
                                    }
                                    str += "<tr  style='font-size:8pt;font-family:Arial'>"

                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].CurrencyCode + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table1[j].ExistingCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].UpdateType + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + (dataTableobj.Table1[j].Amount).substr(1, 60) + "</b></td>";
                                    str += "<td width='7%'><span style='max-width:70px; word-wrap:break-word;display: inline-block;'><b>" + dataTableobj.Table1[j].Remarks + "</b></span></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].ApprovedBy + "</b></td>";
                                    str += "<td width='11%' align='center'><b>" + dataTableobj.Table1[j].UpdatedAt + "</b>&nbsp;&nbsp;</td>";
                                    str += "<td width='11%' align='right'><b>" + dataTableobj.Table1[j].NewCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].ChDate + "</b></td>";
                                    str += "<td width='11%' align='center'><b>" + dataTableobj.Table1[j].ChNo + "</b></td>";
                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].Type + "</b></td>";
                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].Mode + "</b></td>";

                                    str += "</tr>"
                                }
                            }
                            str += "</table></td></tr>"
                            /*   for (var z = 0; z < dataTableobj.Table2.length; z++) {

                                if (dataTableobj.Table0[i].sno == dataTableobj.Table2[z].sno) {

                                    str += "<tr><td colspan='8'><hr/><table width='100%' cellpadding='0' cellspacing='1' border='0'>";

                                    str += "<tr  style='font-size:9pt;font-family:Arial'>"

                                    str += "<td width=7%' align='right'><b>Sub Total : &nbsp;</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].ExistingCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].Amount.substr(1, 60) + "</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";

                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                                    str += "</tr></table><hr/></td></tr>"
                                }
                            }*/




                            str += "</tr>"
                        }


                        /* str += "<tr><td colspan='8'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";

                        str += "<tr  style='font-size:10pt;font-family:Arial'>"

                        str += "<td width=7%' align='right'><b>Grand Total : &nbsp;</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[0].ExistingCreditLimit.substr(1, 60) + "</b></td>";
                        str += "<td width='7%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[0].Amount.substr(1, 60) + "</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='11%' align='center'><b>&nbsp;</b></td>";

                        str += "</tr></table><hr/></td></tr>"*/





                        str += "</table></html>";

                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Credit Limit' + postfix + '.xls';

                        a.click();


                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            }
        });
    }

}