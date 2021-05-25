$(document).ready(function () {
    //var Status = [{ Key: "4", Text: "Booked" }, { Key: "5", Text: "Executed" }, { Key: "6", Text: "Accepted" },
    //        { Key: "7", Text: "Loading Instruction" }, { Key: "8", Text: "Manifested" }, { Key: "9", Text: "Departed" },
    //        { Key: "10", Text: "Arrived" }, { Key: "11", Text: "Delivered" }, { Key: "12", Text: "Void" },
    //        { Key: "13", Text: "Expire" }, { Key: "14", Text: "Blacklisted" }, { Key: "15", Text: "No Show" }, { Key: "16", Text: "Cancel" }]
    cfi.AutoCompleteByDataSource("Status", Status, null, null);
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "DashBoardFlight_Report_Airline", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "DashBoardFlightReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "DashBoardFlightReport_Origin", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "DashBoardFlightReport_Destination", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#FromDate").change(function () {
        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
    });

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineSNo").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }
    $('#exportflight').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../DashBoardFlightReport/DashBoardFlightReportGetRecord",
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
                    fields: {
                        SNo: { type: "number" },
                        FlightNo: { type: "string" },
                        DepartureDate: { type: "string" },
                        BoardPoint: { type: "string" },
                        Offpoint: { type: "string" },
                        Sector: { type: "string" },
                        Stretch: { type: "string" },
                        PlannedAircraftType: { type: "string" },
                        OperatedAircraftType: { type: "string" },
                        Distance: { type: "string" },
                        Commercialcapacity: { type: "string" },
                        RTKC: { type: "string" },
                        ATKC: { type: "string" },
                        ActualCLF: { type: "string" },
                        GrossWeight: { type: "string" },
                        GrossVolume: { type: "string" },
                        Revenue: { type: "string" },
                        FlightStatus: { type: "string" },
                        TargetedGrossWeight: { type: "string" },
                        TargetedRevenue: { type: "string" },
                        TargetedRTKC: { type: "string" },
                        TargetedATKC: { type: "string" },
                        TargetedCLF:{type:"string"}
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
            { field: "FlightNo", title: "Carrier/Flight Number/Suffix"},
            { field: "DepartureDate", title: "Departure Date"},
            { field: "BoardPoint", title: "Board Point"},
            { field: "Offpoint", title: "Off Point" },
            { field: "Sector", title: "Sector" },
            { field: "Stretch", title: "Stretch" },
            { field: "PlannedAircraftType", title: "Planned Aircraft Type" },
            { field: "OperatedAircraftType", title: "Operated Aircraft Type" },
            { field: "Distance", title: "Distance" },
            { field: "Commercialcapacity", title: "Commercial Capacity" },
            { field: "RTKC", title: "RTKC" },
            { field: "ATKC", title: "ATKC" },
            { field: "ActualCLF", title: "Actual CLF" },
            { field: "GrossWeight", title: "Gross Weight" },
            { field: "GrossVolume", title: "GrossVolume" },
            { field: "Revenue", title: "Revenue" },
            { field: "FlightStatus", title: "Flight Status" },
            { field: "TargetedGrossWeight", title: "Targeted Gross Weight" },
            { field: "TargetedRevenue", title: "Targeted Revenue" },
            { field: "TargetedRTKC", title: "Targeted RTKC" },
            { field: "TargetedATKC", title: "Targeted ATKC" },
            { field: "TargetedCLF", title: "Targeted CLF" },
        ]
    });
});

var Model = [];
function SearchDashBoardFlightReport() {
    Model =
        {
            AirlineSNo: $('#AirlineSNo').val(),
            FlightNo: $('#FlightNo').val(),
            OriginSNo: $('#OriginSNo').val(),
            DestinationSNo: $('#DestinationSNo').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            Status: $('#Status').val(),
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineSNo != "" && Model.ToDate != "" && Model.FromDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
    }
}
function ExportToExcel() {
    var AirlineSNo = $('#AirlineSNo').val();
    var FlightNo = $('#FlightNo').val();
    var OriginSNo = $('#OriginSNo').val();
    var DestinationSNo = $('#DestinationSNo').val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var Status = $("#Status").val();
    window.location.href = "../DashBoardFlightReport/ExportToExcel?AirlineSNo=" + AirlineSNo + "&FlightNo=" + FlightNo + "&OriginSNo=" + OriginSNo + "&DestinationSNo=" + DestinationSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Status" + Status;
}


