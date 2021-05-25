
$(document).ready(function () {

    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
    cfi.AutoCompleteV2("FlightNumber", "FlightNumber,FlightNumber", "Temp_vwUcmFlight", null, "contains");
    cfi.AutoCompleteV2("Status", "Status,Status", "Temp_vwUcmFlightStatus", null, "contains");
    var UCMType = [{ Key: "UCM-IN", Text: "UCM-IN" }, { Key: "UCM-OUT", Text: "UCM-OUT" }];
    cfi.AutoCompleteByDataSource("UCMType", UCMType, null);

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#OriginSNo').val(userContext.AirportSNo);
    $('#Text_OriginSNo_input').val(userContext.AirportCode + '-' + userContext.AirportName);

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);


    $("#ReportDate").text($("#FromDate").val())

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



    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../Ulducmreport/GetULDUCMReport",
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
                        OriginAirPort: { type: "string" },
                        Flightdate: { type: "string" },
                        UCMDate: { type: "string" },
                        UCMType: { type: "string" },
                        NotificationStatus: { type: "string" },
                        CurrentStatus: { type: "string" },
                        Remarks: { type: "string" },
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),

        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [



             { field: "OriginAirPort", title: "Station", width: 130 },
             { field: "UCMType", title: "UCM Type", width: 130 },
             { field: "FlightNumber", title: "Flight Number", width: 130 },
             { field: "Flightdate", title: "LTA (Local Time Arrival)", width: 130 },
             { field: "UCMDate", title: "UCM Date", width: 130 },
             { field: "NotificationStatus", title: "Status", width: 130 },
              { field: "CurrentStatus", title: "Movement Status", width: 130 },
             { field: "Remarks", title: "Remarks", width: 130 },

        ]
    });




});


var Model = [];


function SearchFPRReport() {

    var OriginSNo = $('#Text_OriginSNo_input').val()
    var SOriginSNo = OriginSNo.split("-")

    Model =
        {
            OriginAirPort: SOriginSNo[0] == "" ? "" : SOriginSNo[0],
            fromdate: $("#FromDate").val(),
            todate: $("#ToDate").val(),
            FlightNumber: $("#FlightNumber").val() == "0" ? "" : $("#FlightNumber").val(),
            NotificationStatus: $("#Status").val() == "0" ? "" : $("#Status").val(),
            UCMType: $("#UCMType").val() == "0" ? "" : $("#UCMType").val(),
        };

    if (Date.parse($(Model.fromdate).val()) > Date.parse($(Model.todate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    $('#grid').css('display', '')
    $("#grid").data('kendoGrid').dataSource.page(1);
    $('#exportflight').show();
}



function ExtraCondition(textId) {

}



function ExportExcelHoldType() {

    var OriginSNo = $('#Text_OriginSNo_input').val()
    var SOriginSNo = OriginSNo.split("-")

    var Text_OriginSNo = SOriginSNo[0] == "" ? "" : SOriginSNo[0];
    var fromdate = $("#FromDate").val();
    var todate = $("#ToDate").val();

    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    var FlightNumber = $("#FlightNumber").val() == "0" ? "" : $("#FlightNumber").val();
    var NotificationStatus = $("#Status").val() == "0" ? "" : $("#Status").val();
    var UCMType = $("#UCMType").val() == "0" ? "" : $("#UCMType").val();


    window.location.href = "../Ulducmreport/ExportToExcel?OriginAirPort=" + Text_OriginSNo + "&fromdate=" + fromdate + "&todate=" + todate + "&FlightNumber=" + FlightNumber + "&NotificationStatus=" + NotificationStatus + "&UCMType=" + UCMType;
}

