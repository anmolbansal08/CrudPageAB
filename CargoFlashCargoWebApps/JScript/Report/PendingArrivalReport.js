$(document).ready(function ()
{
    //var FromDate = "";
    //var ToDate = "";
    cfi.AutoCompleteV2("OriginAirPortSNo", "AirportCode", "Org_Dest_Airport", null, "contains");
    $("#imgexcel").hide();
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({

            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
            transport: {
                read: {
                    url: "../PendingArrivalReport/GetPendingArriveData",
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
                    id: "SNo",
                    fields:
                      {
                          AWBNo: { type: "string" },
                          Origin: { type: "string" },
                          Destination: { type: "string" },
                          Sector: { type: "string" },
                          AWBDate: { type: "string" },
                          AgentName: { type: "string" },
                          AgentCode: { type: "string" },
                          BookingFlightNo: { type: "string" },
                          BookingFlightDate: { type: "string" },
                          ETD: { type: "string" },
                          ETA: { type: "string" },
                          ProductName: { type: "string" },
                          Commodity: { type: "string" },
                          FlightType: { type: "string" },
                          Pieces: { type: "string" },
                          GrossWeight: { type: "string" },
                          VolumeWeight: { type: "string" },
                          ChargeableWeight: { type: "string" },
                          RemainingPCS : { type: "string" },
                          RemainingGrossWeight: { type: "string" },
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
        //toolbar: ['Export'],
        columns: [
            { field: "AWBNo", title: "AWB Number", width: "100px" },
            { field: "Origin", title: "Org", width: "100px" },
            { field: "Destination", title: "Dest", width: "100px" },
            { field: "Sector", title: "Sector", width: "100px" },
            { field: "AWBDate", title: "AWB Date", width: "100px" },
            { field: "AgentName", title: "Agent Name", width: "100px" },
            { field: "AgentCode", title: "Agent Code", width: "100px" },
            { field: "Pieces", title: "Pcs", width: "100px" },
            { field: "GrossWeight", title: "Gr.Wt.", width: "100px" },
            { field: "ProductName", title: "Product", width: "100px" },
            { field: "VolumeWeight", title: "Vo.Wt.", width: "100px" },
            { field: "ChargeableWeight", title: "Ch.Wt.", width: "100px" },
            { field: "Commodity", title: "Commodity", width: "100px" },
            { field: "FlightType", title: "Flight Type", width: "100px" },
            { field: "BookingFlightNo", title: "Flight No", width: "100px" },
            { field: "BookingFlightDate", title: "Flight Date", width: "100px" },
            { field: "ETD", title: "ETD", width: "120px", width: "100px" },
            { field: "ETA", title: "ETA", width: "120px", width: "100px" },
            { field: "RemainingPCS", title: "Remaining PCS.", width: "120px" },
            { field: "RemainingGrossWeight", title: "Rem.Gr.Wt.", width: "120px" },
        ]
    });
});
var Model = [];

function SearchPendingArrivalData() {
    $("#PendingArrivalReport").remove();
    $("#PendingArrivalReport").html('');
    Model =
       {
           OriginAirPortSNo: $('#OriginAirPortSNo').val() == "" ? "0" : $('#OriginAirPortSNo').val(),
           DestinationAirPortSNo: userContext.AirportSNo,
           FromDate: $('#FromDate').val(),
           ToDate: $('#ToDate').val(),
       };
    var WhereCondition = "";
    if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate)) {
        ShowMessage('warning', 'Warning - Report ', "From Date can not be greater than To Date !");
        return;
    }
    if (Model.DestinationAirPortSNo != "")
    {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
    }
    $("#imgexcel").show();
}

function ExportToExcel()
{
    Model =
      {
          FromDate: $('#FromDate').val(),
          ToDate: $('#ToDate').val(),
          OriginAirPortSNo: $('#OriginAirPortSNo').val(),
          DestinationAirPortSNo: userContext.AirportSNo,
      };
    $('#PToExcel #FromDate').val(Model.FromDate);
    $('#PToExcel #ToDate').val(Model.ToDate);
    $('#PToExcel #OriginAirPortSNo').val(Model.OriginAirPortSNo);
    $('#PToExcel #DestinationAirPortSNo').val(userContext.AirportSNo);
    $('#PToExcel').submit();
}