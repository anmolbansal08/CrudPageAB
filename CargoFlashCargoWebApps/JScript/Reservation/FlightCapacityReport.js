$(document).ready(function () {



    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "BookingVarianceReport_Airline", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }


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




    $('#exportflight').hide();
    $('#grid').css('display', 'none')

    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../FlightCapacityReport/GetFlightCapacityReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
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
                        FlightNumber: { type: "string" },
                        DepartureDate: { type: "string" },
                        BoardPoint: { type: "string" },
                        OffPoint: { type: "string" },
                        Sector: { type: "string" },
                        Stretch: { type: "string" },
                        PlannedAircraftType: { type: "string" },
                        OperatedAircraftType: { type: "string" },
                        Distance: { type: "string" },
                        CommercialCapacity: { type: "string" },
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
                        TargetedCLF: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
            { field: "FlightNumber", title: "Flight Number", filterable: true, width: 80 },
            { field: "DepartureDate", title: "Departure Date", width: 90 },
            { field: "BoardPoint", title: "Board Point", width: 80 },
            { field: "OffPoint", title: "Off Point", width: 70 },
            { field: "Sector", title: "Sector", width: 60 },
            { field: "Stretch", title: "Stretch", width: 60 },
            { field: "PlannedAircraftType", title: "Planned Aircraft Type", width: 110 },
           { field: "OperatedAircraftType", title: "Operated Aircraft Type", width: 110 },
            { field: "Distance", title: "Distance", width: 70 },
           { field: "CommercialCapacity", title: "Commercial Capacity", width: 100 },
            { field: "RTKC", title: "RTKC", width: 60 },
            { field: "ATKC", title: "ATKC", width: 60 },
            { field: "ActualCLF", title: "Actual CLF", width: 70 },
           { field: "GrossWeight", title: "Gross Weight", width: 70 },
             { field: "GrossVolume", title: "Gross Volume", width: 70 },
            { field: "Revenue", title: "Revenue", width: 60 },
            { field: "FlightStatus", title: "Flight Status", width: 90 },
             { field: "TargetedGrossWeight", title: "Targeted Gross Weight", width: 110 },
            { field: "TargetedRevenue", title: "Targeted Revenue", width: 110 },
            { field: "TargetedRTKC", title: "Targeted RTKC", width: 90 },
            { field: "TargetedATKC", title: "Targeted ATKC", width: 90 },
            { field: "TargetedCLF", title: "Targeted CLF", width: 90 },
        ]
    });
});

var Model = [];

$('#btnSubmit').click(function () {

    Model = {
        AirlineCode: $('#AirlineCode').val(),
        OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
        DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        DateType: $('input[type="radio"][name=Filter]:checked').val(),
        FlightNo: $('#FlightNo').val() == "" ? "0" :  $('#FlightNo').val()
    }

    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {
        ShowMessage('warning', 'warning - Booking VS Accepted Report', "From Date can not be greater than To Date !");
        return false;;
    }


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    if (Model.AirlineCode != "" && Model.FromDate != "" && Model.ToDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
        $('#grid table thead tr th a').css('cursor', 'auto')
    }
});

function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_DestinationSNo") {
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_OriginSNo") {
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_FlightNo") {
        if ($('#OriginSNo').val() != '')
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
        if ($('#DestinationSNo').val() != '')
            cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());


        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());
        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }

}
function ExportToExcel_Flight() {

    var AirlineCode = $('#AirlineCode').val();
    var OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    var DestinationSNo = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();
    var DateType = $('input[type="radio"][name=Filter]:checked').val();
    var FlightNo = $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val();
    if (AirlineCode != "" && FromDate != "" && ToDate != "") {
        window.location.href = "../FlightCapacityReport/GetFlightCapacityForExcel?AirlineCode=" + AirlineCode + "&OriginSNo=" + OriginSNo + "&DestinationSNo=" + DestinationSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&DateType=" + DateType + "&FlightNo=" + FlightNo;
    }
}
