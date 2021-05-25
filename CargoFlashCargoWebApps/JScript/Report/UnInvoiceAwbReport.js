$(document).ready(function ()
{
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "UNInvoiceAWBReport_Airline", null, "contains");
    cfi.AutoCompleteV2("GSAnames", "GSANAME", "UNInvoiceAWBReport_Office", null, "contains");
    $("#imgexcel").hide();
    $("#imgpdf").hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
            transport: {
                read: {
                    url: "../UnInvoiceAwbReport/UnInvoicedAWBData",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:
                        function GetReportData()
                        {
                            return { Model: Model };
                        }

                }, parameterMap: function (options)
                {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    fields:
                      {
                          SNo: { type: "string" },
                          ARCode: { type: "string" },
                          GSAName: { type: "string" },
                          ActualCrLimit: { type: "string" },
                          CurrentCrLimit: { type: "string" },
                          AvailableLimit: { type: "string" },
                          UnInvoiced: { type: "string" },
                      }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable:
            {
                refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 1, totalinfo: false
            },
        scrollable: true,
        columns: [
            { template: '<input type="button" value="V" onclick="GetUnInvoicedAwbTransReport(\'#=SNo#\');" title="View Details" class="inProgress">', width: 40},
            { field: "ARCode", title: "AR Code",width:"50"},
            { field: "GSAName", title: "GSA Name", width: "50" },
            { field: "ActualCrLimit", title: "Actual Cr. Limit", width: "100" },
            { field: "CurrentCrLimit", title: "Current Cr. Limit", width: "100" },
            { field: "AvailableLimit", title: "Available Limit", width: "100" },
            { field: "UnInvoiced", title: "Un Invoiced", width: "50" }
        ]
    });
});
function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_Airline") {
        try {
            cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
            cfi.setFilter(filterAirline, "IsActive", "eq", "1");
            var Airlinefilter = cfi.autoCompleteFilter([filterAirline]);
            return Airlinefilter;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_GSAnames") {
        if ($("#Text_Airline").val() != '')
        {
            try
            {
                cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_Airline").data("kendoComboBox").key());
                var OfficeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
                return OfficeAutoCompleteFilter2;
            }
            catch (exp)
            { }
        }
    }
}
var Model = [];
function GetUnInvoicedAwbTransReport(SNo)
{
    $("#imgpdf").show();
    cfi.ShowPopUp("Un Invoiced AWB detail", "/UnInvoiceAwbReport/GetUnInvoicedAwbTransReport", { SNo: SNo }, 1024, onclosePopup);
}
function onclosePopup()
{
    $("#imgpdf").hide();
}
function UnInvoicedAWBData()
{
    Model =
       {
           Airline: $('#Airline').val(),
           GSAnames: $('#GSAnames').val(),
       };
    var WhereCondition = "";
    
    if (Model.Airline != "")
    {
        if (Model.GSAname != "")
        {
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
        }
        $("#imgexcel").show();
    }
}
function ExportToExcel()
{
    var Airline = $('#Airline').val();
    var GSAnames = $('#GSAnames').val()
    window.location.href = "../UnInvoiceAwbReport/ExportToExcel?Airline=" + Airline + "&GSAnames=" + GSAnames;
}
function ExportToPDF()
{
    html2canvas($('#UnInvoicedAwbGridDiv')[0], {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500
                }]
            };
            pdfMake.createPdf(docDefinition).download("UnInvoiceAwbReport.pdf");
        }
    });
}
