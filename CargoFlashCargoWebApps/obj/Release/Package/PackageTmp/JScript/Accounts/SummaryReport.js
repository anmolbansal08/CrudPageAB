function PrintSummaryReport(SNo, CashRegisterDate, obj) {
    var StartDateTime = $(obj).closest('tr').find('td[data-column=StartSession]').text();
    var EndDateTime = $(obj).closest('tr').find('td[data-column=EndSession]').text();
    SNo = SNo + '-' + userContext.UserSNo;
    window.open("HtmlFiles\\Account\\SummaryReport.html?SNo=" + SNo + "&Date=" + CashRegisterDate + "&StartSession=" + StartDateTime + "&EndSession=" + EndDateTime);
}