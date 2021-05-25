$(document).ready(function ()
{
    //var FromDate = "";
    //var ToDate = "";
    cfi.AutoCompleteV2("DestinationAirPortSNo", "AirportCode", "AddShipment_Dest_Airport", null, "contains");
    if (userContext.GroupName.toUpperCase() != "ADMIN" && userContext.GroupName.toUpperCase() != "SUPER ADMIN") {
        $("#DestinationAirPortSNo").val(userContext.AirportCode.toUpperCase());
        $("#Text_DestinationAirPortSNo_input").val(userContext.AirportCode.toUpperCase());
        $("#Text_DestinationAirPortSNo").data("kendoComboBox").enable(false)
    }

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
                    url: "../AddShipmentReport/SearchAddShipmentData",
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
                          AddShipmentAt: { type: "string" },
                          AddShipmentFlight: { type: "string" },
                          DateAddShipment: { type: "string" },
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
            { field: "AWBNo", title: "AWB No", width: "120px" },
            { field: "Origin", title: "Origin", width: "120px" },
            { field: "Destination", title: "Destination", width: "120px" },
            { field: "Sector", title: "Sector", width: "120px" },
            { field: "AWBDate", title: "AWB Date", width: "120px" },
            { field: "AgentName", title: "Agent Name", width: "120px" },
            { field: "AgentCode", title: "Agent Code", width: "120px" },
            { field: "Pieces", title: "Pcs", width: "120px" },
            { field: "GrossWeight", title: "Gr. Wt.", width: "120px" },
            { field: "VolumeWeight", title: "Vol. Wt.", width: "120px" },
            { field: "ChargeableWeight", title: "Ch. Wt.", width: "120px" },
            { field: "ProductName", title: "Product Name", width: "120px" },
            { field: "Commodity", title: "Commodity", width: "120px" },
            { field: "FlightType", title: "Flight Type", width: "120px" },
            { field: "BookingFlightNo", title: "Flight No", width: "120px" },
            { field: "BookingFlightDate", title: "Flight Date", width: "120px" },
            { field: "ETD", title: "ETD", width: "80px" },
            { field: "ETA", title: "ETA", width: "80px" },
            { field: "AddShipmentAt", title: "Shipment Added At Station", width: "150px" },
            { field: "AddShipmentFlight", title: "Shipment Added on Flight", width: "150px" },
            { field: "DateAddShipment", title: "Shipment Added on Date", width: "200px" }
        ]
    });
});
function CalculateDiff() {
    if ($("#FromDate").val() != "" && $("#ToDate").val() != "") {
        if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
            ShowMessage('warning', 'Warning - Load Factor Flight Report', "From Date can not be greater than To Date ");
            return false;
        }
        var From_date = new Date($("#FromDate").val());
        var To_date = new Date($("#ToDate").val());
        var diff_date = To_date - From_date;

        var years = Math.floor(diff_date / 31536000000);
        var months = Math.floor((diff_date % 31536000000) / 2628000000);
        var days = diff_date / (1000 * 60 * 60 * 24);//Math.floor(((diff_date % 31536000000) % 2628000000) / 86400000);
        if (days > 62) {
            return false;
        }
        return true;
    }
}
var Model = [];

function SearchAddShipmentData()
{
    Model =
       {
           FromDate: $('#FromDate').val(),
           ToDate: $('#ToDate').val(),
           DestinationAirPortCode: $('#DestinationAirPortSNo').val() == "" ? "" : $('#DestinationAirPortSNo').val()
       };
    var WhereCondition = "";
    var result = CalculateDiff();
    if (result == false) {
        ShowMessage('warning', 'Warning - Report', "Add Shipment Report can be fetched for maximum 62 Days");
        return false;
    }
    if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate)) {
        ShowMessage('warning', 'Warning - Report ', "From Date can not be greater than To Date !");
        return;
    }
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
            $("#imgexcel").show();
}
function ExportToExcel() {
    Model =
      {
          FromDate: $('#FromDate').val(),
          ToDate: $('#ToDate').val(),
          DestinationAirPortCode: $('#DestinationAirPortSNo').val() == "" ? "" : $('#DestinationAirPortSNo').val()
      };
    var result = CalculateDiff();
    if (result == false) {
        ShowMessage('warning', 'Warning - Load Factor Flight Report', "Load Factor Flight Report can be fetched for maximum 62 Days");
        return false;
    }
    $('#ASToExcel #FromDate').val(Model.FromDate);
    $('#ASToExcel #ToDate').val(Model.ToDate);
    $('#ASToExcel #DestinationAirPortSNo').val(Model.DestinationAirPortCode == "" ? "" : Model.DestinationAirPortCode);

    $('#ASToExcel').submit();
}
function ExtraParameters(id) {
    var param = [];
    if (id == "Text_DestinationAirPortSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}