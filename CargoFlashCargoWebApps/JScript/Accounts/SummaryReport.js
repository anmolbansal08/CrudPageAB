function PrintSummaryReport(SNo, CashierIDGroupSNo, cashregisterSNo) {
    //var StartDateTime = $(obj).closest('tr').find('td[data-column=StartSession]').text();
    //var EndDateTime = $(obj).closest('tr').find('td[data-column=EndSession]').text();
    //SNo = SNo + '-' + userContext.UserSNo;
    //window.open("HtmlFiles\\Account\\SummaryReport.html?SNo=" + SNo + "&Date=" + CashRegisterDate + "&StartSession=" + StartDateTime + "&EndSession=" + EndDateTime);
    window.open("HtmlFiles\\CashRegister\\CashierClosingReceipt.html?CurrentSno=" + cashregisterSNo + "&CashierID=" + SNo + "&GroupSNo=" + CashierIDGroupSNo);
}


function DPrintSummaryReport(SNo, CashRegisterDate, obj) {
    var StartDateTime = $(obj).closest('tr').find('td[data-column=ShiftStart]').text();
    var EndDateTime = $(obj).closest('tr').find('td[data-column=ShiftEnd]').text();
    SNo = SNo;

    // window.open("HtmlFiles\\Account\\SummaryReport.html?SNo=" + SNo + "&Date=" + CashRegisterDate + "&StartSession=" + StartDateTime + "&EndSession=" + EndDateTime);
    SearchData(StartDateTime, EndDateTime, SNo);

    //alert(kendo.toString(StartDateTime, "yyyy-MM-dd HH_mm tt"));
}



//var CashierID = getParameterByName("SNo", "");
//var Date = getParameterByName("Date", "");
//var StartSession = getParameterByName("StartSession", "");
//var EndSession = getParameterByName("EndSession", "");

function SearchData(StartDateTime, EndDateTime, SNo) {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = kendo.toString(StartDateTime, "yyyy-MM-dd HH_mm tt");
        var ToDate = kendo.toString(EndDateTime, "yyyy-MM-dd HH_mm tt");
        var CashierSno = SNo;

        var hfix = "Export/Import ";
        var rfix = "Detail";

        var fix = hfix + "Cash Register " + rfix;
        //var myWindow;
        //myWindow = window.open("Cash Register", "_blank");

        $.ajax({
            url: "Services/Report/ESSService.svc/GetCashierRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, CashierSno: CashierSno
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                debugger
                var dataTableobj = JSON.parse(data);

                if (dataTableobj.Table0.length > 1) {

                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>" + dataTableobj.Table1[0].AirlineName + "</td></tr><tr><td colspan='6' align='LEFT'>From " + dataTableobj.Table1[0].FromDate + " To " + dataTableobj.Table1[0].ToDate + "</td>  <td align=\"right\" colspan='4'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"


                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>Cash</b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                    for (var key in dataTableobj.Table0[0]) {
                        str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                    }

                    str += "</tr>"

                    for (var i = 1; i < dataTableobj.Table0.length; i++) {
                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table0[i]) {
                            str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                        }
                        str += "</tr>"
                    }

                    for (var j = 0; j < 1; j++) {

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table0[j]) {
                            str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                        }
                        str += "</tr>"
                    }

                    str += "</table></html>";
                    var myWindow;
                    myWindow = window.open("Cash Register", "_blank");
                    myWindow.document.write(str);
                    myWindow.document.title = fix;

                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                    //myWindow.close();
                }

            }


        });
    }
}