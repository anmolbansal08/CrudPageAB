var AirlineAccess = "";
var IsAllAirline = 0;
$(document).ready(function () {
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Accelaero_CarrierCode", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Accelaero_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Accelaero_AirportCode", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Accelaero_AirportCode", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");


    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $("#FromDate").change(function () {
        //$('#FromDate').css('width', '150px');
        //$('.k-datepicker').css('width', '150px');
        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());

        if ($("#ToDate").val() < $("#FromDate").val())
            $("#ToDate").data("kendoDatePicker").value('');
    });

});

var model = {};




function search() {
    Model =
    {
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        FlightNo: $('#FlightNo').val() == null ? "" : $('#FlightNo').val(),
        CarrierCode: $('#Airline').val() == null ? "" : $('#Airline').val(),
        Origin: $('#Origin').val() == null ? "" : $('#Origin').val(),
        Destination: $('#Destination').val() == null ? "" : $('#Destination').val(),


    };

    $("#grid").kendoGrid({
        autoBind: true,
        toolbar: ["excel"],
        excel: {
            allPages: true
        },
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "../AccelaeroReport/GetFlightDetail",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: { model: Model }

                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "FlightNo",
                    fields: {
                        CarrierCode: { type: "string" },
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        ETD: { type: "string" },
                        ETA: { type: "string" },
                        EnteredDate: { type: "string" },
                        IsProcessed: { type: "string" },
                        ValidationMessage: { type: "string" },
                        ProcessedAt: { type: "string" },
                        MsgType:{type:"string"},



                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        filterable: true,
        sortable: true,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
        { field: "CarrierCode", title: "Airline" },
        { field: "FlightNo", title: "Flight No", filterable: true },
        { field: "FlightDate", title: "Flight Date" },
        { field: "Origin", title: "Origin " },
        { field: "Destination", title: "Destination" },
        { field: "ETD", title: "ETD" },
        { field: "ETA", title: "ETA" },
        { field: "EnteredDate", title: "Entered Date" },
        { field: "IsProcessed", title: "Processed" },
        { field: "ValidationMessage", title: "Validation Message" },
        { field: "ProcessedAt", title: "Processed On" },
        {field:"MsgType",title:"MsgType"},

        ]
    });
    $('span.k-i-excel').removeClass('k-icon');

    $("#grid").kendoTooltip({
        filter: "table tr:not(.k-grouping-row):not(.k-footer-template) :nth-child(n):not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(a)",
        content: function (e) {
            var target = e.target;
            return $(target).text();
        }
    });

}

function ExtraCondition(textId) {

    var filter= cfi.getFilter("AND");
    if (textId == "Text_FlightNo") {
        cfi.setFilter(filter, "CarrierCode", "eq", $("#Airline").val());
        return cfi.autoCompleteFilter(filter);
    }
}

