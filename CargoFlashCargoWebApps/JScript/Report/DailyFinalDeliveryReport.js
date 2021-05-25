/*
*****************************************************************************
Javascript Name:	DailyFinaldeliveryreport     
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Shivali Thakur
	
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("AirportSNo", "AirportCode,AirportName", "ULDSTOCK_Airport", null, "contains");
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
    $("#tbl").after("<div id='grid'><font color=':#419AD4'><b>Daily Final Delivery Report</b></font>");
    $("#Search").after('<input type="button" id="btnexcel" tabindex="4" value="Download Excel" class="btn btn-success" onclick="serchexcel();" style="width:100px">');
    $("#grid").hide();

    $('#AirportSNo').val(userContext.AirportSNo);
    $('#Text_AirportSNo').val(userContext.AirportCode + '-' + userContext.AirportName);

    var d = new Date();
    d.setHours(d.getHours());
    $('#ToDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1,
        value: d
    });


    var d = new Date();
    d.setHours(d.getHours());
    $('#FromDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1,
        value: d
    });

    //$('#grid').css('display', 'none')


    $("input[id='Search'][name='Search']").click(function () {

        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

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
function serchexcel()
{
    var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
    var eDate = new Date(ToDate);
    var sDate = new Date(FromDate);
    if (FromDate != '' && FromDate != '' && sDate > eDate)
    {
        ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
        return false;
    }
    else
    {
        window.location.href = "../DailySalesReport/GetDailyFinalDeliveryReport_Excel?airportsno=" + $('#AirportSNo').val() + "&FromDate=" + kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt") + "&ToDate=" + kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt") + "&page=" + 1 + "&pageSize=" + 50;
    }
}
function Search() {
    if (cfi.IsValidSubmitSection()) {

        $("#grid").kendoGrid({
            autoBind: true,
            dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 50,
                transport: {
                    read: {
                        url: "Services/Report/DailyFinalDeliveryReportService.svc/GetDailyFinalDeliveryReport",
                        dataType: "json",
                        global: false,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: {
                            FromDate: kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt"),
                            ToDate: kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt"),
                            airportsno: $('#AirportSNo').val(),
                        }

                    }, parameterMap: function (options) {
                        if (options.filter == undefined)
                            options.filter = null;
                        if (options.sort == undefined)
                            options.sort = null; return JSON.stringify(options);
                    },
                },
                schema: {
                 data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                },
            }),       
            sortable: false, filterable: false,
            pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
            scrollable: true,
            columns: [
                    { field: "SNo", title: "No", width: 20 },
                    { field: "MASTER_AWB", title: "MASTER AWB No.", width: 20 },
                    { field: "TANGGAL", title: "TANGGAL", width: 20 },
                    { field: "NO_DB", title: "NO DB", width: 20 },
                    { field: "H_AWBNo", title: "H/AWBNo", width: 20 },
                    { field: "KOLI", title: "KOLI", width: 20 },
                    { field: "KILO", title: "KILO", width: 20 },
                    { field: "VOL", title: "VOL", width: 20 },
                    { field: "NOP_IBP", title: "NOP IBP", width: 20 },
                    { field: "POS", title: "POS", width: 20 },
                    { field: "BC1_1", title: "BC1", width: 20 },
                    { field: "ConsigneeName", title: "CONSIGNEE", width: 20 },
                    { field: "No_SPPB", title: "No SPPB", width: 20 },
                    { field: "NO_DAFT", title: "No DAFT", width: 20 },
                    { field: "TGL_SPPB", title: "TGL SPPB", width: 20 },
                    { field: "TGL_DAFT", title: "TGL DAFT", width: 20 },
            ]
        });       
    }
    $("#grid").show();
}
