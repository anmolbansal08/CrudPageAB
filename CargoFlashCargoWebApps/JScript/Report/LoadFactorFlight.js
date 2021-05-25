$(document).ready(function ()
{
    //var FromDate = "";
    //var ToDate = "";
    cfi.AutoCompleteV2("Origin", "AirportCode", "Org_Dest_Airport", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode", "Org_Dest_Airport", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "FlightNo_LoadFactorFlightReport", null, "contains");
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
                    url: "../LoadFactorFlight/GetLoadFactorFlightReport",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:
                        function GetReportData() {
                            return { Model: Model };
                        }

                }, parameterMap: function (options) {
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
                          Origin: { type: "string" },
                          Dest: { type: "string" },
                          FlightNo: { type: "string" },
                          FlightType: { type: "string" },
                          ETD: { type: "string" },
                          ETA: { type: "string" },
                          RouteType: { type: "string" },
                          FlightDate: { type: "string" },
                          Aircraft: { type: "string" },
                          TotalCapacityGross: { type: "string" },
                          TotalCapacityVolume: { type: "string" },
                          UsedTotalCapacityGross: { type: "string" },
                          UsedTotalCapacityVolume: { type: "string" },
                          UsedChargeableTotalCapacity: { type: "string" },
                          LoadFactorFlights: { type: "string" },
                          FlightStatus: { type: "string" },
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
            { field: "Origin", title: "Origin", width: "50px" },
            { field: "Dest", title: "Dest", width: "40px" },
            { field: "FlightNo", title: "Flight No", width: "60px" },
            { field: "FlightType", title: "Flight Type", width: "70px" },
            { field: "ETD", title: "ETD", width: "50px" },
            { field: "ETA", title: "ETA", width: "50px" },
            { field: "RouteType", title: "Route Type", width: "80px" },
            { field: "FlightDate", title: "Flight Date", width: "80px" },
            { field: "Aircraft", title: "Aircraft", width: "50px" },
            { field: "TotalCapacityGross", title: "Total Gross Capacity", width: "120px" },
            { field: "TotalCapacityVolume", title: "Total Volume Capacity", width: "130px" },
            { field: "UsedTotalCapacityGross", title: "Total Gross Capacity Used", width: "140px" },
            { field: "UsedTotalCapacityVolume", title: "Total Volume Capacity Used", width: "150px" },
            { field: "UsedChargeableTotalCapacity", title: "Total Chargeable Capacity Used", width: "180px" },
            { field: "LoadFactorFlights", title: "Flight Load Factor (%)", width: "120px" },
            { field: "FlightStatus", title: "Flight Status", width: "100px" },
        ]
    });
});

function CalculateDiff()
{
    if ($("#FromDate").val() != "" && $("#ToDate").val() != "")
    {
        if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val()))
        {
            ShowMessage('warning', 'Warning - Load Factor Flight Report', "From Date can not be greater than To Date ");
            return false;
        }
        var From_date = new Date($("#FromDate").val());
        var To_date = new Date($("#ToDate").val());
        var diff_date = To_date - From_date;

        var years = Math.floor(diff_date / 31536000000);
        var months = Math.floor((diff_date % 31536000000) / 2628000000);
        var days = diff_date / (1000 * 60 * 60 * 24);//Math.floor(((diff_date % 31536000000) % 2628000000) / 86400000);
        if (days > 62)
        {
            return false;
        }
        return true;
    }
}
var Model = [];

function LoadFactorFlightData()
{
    Model =
       {
           OriginAirPortSNo: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
           DestinationAirPortSNo:$('#Destination').val() == "" ? "0" : $('#Destination').val(), 
           FromDate: $('#FromDate').val(),
           ToDate: $('#ToDate').val(),
           FlightNumber: $('#FlightNo').val()
       };
    var WhereCondition = "";
    var result = CalculateDiff();
    if (result == false)
    {
        ShowMessage('warning', 'Warning - Load Factor Flight Report', "Load Factor Flight Report can be fetched for maximum 62 Days");
        return false;
    } 
    if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate))
    {
        ShowMessage('warning', 'Warning - Report ', "From Date can not be greater than To Date !");
        return;
    }
    //if (Model.DestinationAirPortSNo != "")
    //{
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
    //}
    $("#imgexcel").show();
}

function ExportToExcel()
{
    Model =
      {
          OriginAirPortSNo:$('#Origin').val() == "" ? "0" : $('#Origin').val(),
          DestinationAirPortSNo:$('#Destination').val() == "" ? "0" : $('#Destination').val(),
          FromDate: $('#FromDate').val(),
          ToDate: $('#ToDate').val(),
          FlightNumber: $('#FlightNo').val()
      };
   // if (Model.OriginAirPortSNo != "" && Model.FromDate != "" & Model.ToDate != "") {
        var result = CalculateDiff();
        if (result == false)
        {
            ShowMessage('warning', 'Warning - Load Factor Flight Report', "Load Factor Flight Report can be fetched for maximum 62 Days");
            return false;
        }
    //}

    $('#LoadFactorFlightToExcel #OriginAirPortSNo').val(Model.OriginAirPortSNo);
    $('#LoadFactorFlightToExcel #DestinationAirPortSNo').val(Model.DestinationAirPortSNo);
    $('#LoadFactorFlightToExcel #FromDate').val(Model.FromDate);
    $('#LoadFactorFlightToExcel #ToDate').val(Model.ToDate);
    $('#LoadFactorFlightToExcel #FlightNo').val(Model.FlightNumber);
    $('#LoadFactorFlightToExcel').submit();
}