$(document).ready(function () {
    cfi.ValidateForm();
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    cfi.AutoCompleteV2("AccountSNo", "Name", "CreditLimitTransactionReport_Name", null, "contains");

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
            Search(1);
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
            Search(0);
        }


    });
});

function Search(BTN) {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var AccountSNo = $("#AccountSNo").val();
        $.ajax({
            url: "Services/Report/CreditLimitTransactionReportService.svc/GetCreditLimitTransactionReportRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, AccountSNo: AccountSNo
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
                        str += "<tr font-size:15pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>CREDIT LIMIT TRANSACTION REPORT</b></font></td></TR>"
                        //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>GARUDA AIRLINES</td></tr><tr><td colspan='6' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='4'>Date : " + dataTableobj.Table2[0].Dt + "</td></tr>"

                        for (var i = 0; i < dataTableobj.Table0.length; i++) {
                            str += "<tr><td colspan='10'><br/></td></tr>"
                            str += "<tr style='font-size:11pt;font-family:Arial'>"


                            str += "<td align='left' colspan='10'><b>" + dataTableobj.Table0[i].AccountName + "</b></td>"

                            str += "<tr><td colspan='10'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";
                            for (var j = 0; j < dataTableobj.Table1.length; j++) {

                                if (dataTableobj.Table0[i].SNo == dataTableobj.Table1[j].SNo) {


                                    if (dataTableobj.Table1[j].RowNo == 1) {
                                        str += "<tr style='background-color:#E2DFDF;font-size:9pt;font-family:Arial'><td align='center'><b>AGENT NAME</b></td><td align='center'><b>CURRENCY</b></td><td align='center'><b>AGENT CREDIT LIMIT</b></td><td align='center'><b>AVAILABLE CREDIT LIMIT</b></td>"
                                        str += "<td align='center'><b>TYPE</b></td>   <td align='center'><b>AMOUNT </b></td> <td align='center'><b>REMAINING CREDIT LIMIT</b></td><td align='center'><b>PROCESS NAME</b></td> <td align='center'><b>SUB PROCESS NAME</b></td>                                            <td align='center'><b>REMARKS</b></td> <td align='center'><b>USER NAME</b></td> <td align='center'><b>UPDATED ON</b></td></tr>"
                                    }
                                    str += "<tr  style='font-size:8pt;font-family:Arial'>"
                                    str += "<td width='10%' align='left'><b>" + dataTableobj.Table1[j].AccountName + "</b></td>";
                                    str += "<td width='6%' align='center'><b>" + dataTableobj.Table1[j].CurrencyCode + "</b></td>";
                                    str += "<td width='8%' align='right'><b>" + dataTableobj.Table1[j].CreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table1[j].RemainingCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='3%' align='center'><b>" + dataTableobj.Table1[j].TransactionType + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + (dataTableobj.Table1[j].Amount).substr(1, 60) + "&nbsp;&nbsp;&nbsp;</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table1[j].UpdatedRemainingCreditLimit.substr(1, 60) + "</b></td>";
                                    str += "<td width='7%' align='center'><span style='word-wrap:break-word;display: inline-block;'><b>" + dataTableobj.Table1[j].ProcessName + "</b></span></td>";
                                    str += "<td width='7%' align='center'><span style='word-wrap:break-word;display: inline-block;'><b>" + dataTableobj.Table1[j].SubProcessName + "</b></span></td>";
                                    str += "<td width='15%' align='left'><span style='word-wrap:break-word;display: inline-block;'><b>" + dataTableobj.Table1[j].Remarks + "</b></span></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].UserName + "</b></td>";
                                    str += "<td width='7%' align='center'><b>" + dataTableobj.Table1[j].UpdatedOn + "</b>&nbsp;&nbsp;</td>";
                                    str += "</tr>"


                                }
                            }
                            str += "</table></td></tr>"
                            str += "</tr>"
                        }
                        str += "</table></html>";

                        if (BTN == 0) {
                            myWindow = window.open("Credit Limit Transection Report", "_blank");
                            myWindow.document.write(str);

                            myWindow.document.title = 'Credit Limit Transection Report';
                        }
                       else if (BTN == 1) {
                            var data_type = 'data:application/vnd.ms-excel';

                            var postfix = "";
                            var a = document.createElement('a');
                            a.href = data_type + ' , ' + encodeURIComponent(str);
                            a.download = 'Credit Limit' + postfix + '.xls';

                            a.click();
                        }

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            }
        });
    }

}

