


$(document).ready(function () {

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "DailyStockTransactionreport_Airline", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "ImportInbound_FlightOrigin", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "ImportInbound_FlightDest", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "FlightSummary_FlightNo", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
   
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    $('#AirlineSNo').val(userContext.AirlineSNo);
    $('#Text_AirlineSNo').val(userContext.AirlineName);
    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    FromTime = $("#txtFromTime").kendoTimePicker({
        format: "HH:mm",

        change: function () {
            var startTime = FromTime.value();
            if (startTime) {
                startTime = new Date(startTime);
                startTime.setMinutes(startTime.getMinutes() + this.options.interval);
            } else {
                FromTime.value('');
            }
        }
    }).data("kendoTimePicker");

    ToTime = $("#txtToTime").kendoTimePicker({
        format: "HH:mm",
        change: function () {
            var startTime = ToTime.value();
            if (startTime) {
                startTime = new Date(startTime);
                startTime.setMinutes(startTime.getMinutes() + this.options.interval);
            } else {
                ToTime.value('');
            }
        }
    }).data("kendoTimePicker");


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
    
    $('#imgexcel').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({

        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../FlightStatusReport/FlightStatusReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        AirlineSNo = $('#AirlineSNo').val();
                        FromDate = $("#FromDate").val();
                        ToDate = $("#ToDate").val();
                        FromTime = $("#txtFromTime").val();
                        ToTime = $("#txtToTime").val();
                        OriginSNo = $("#OriginSNo").val();
                        DestinationSNo = $("#DestinationSNo").val();
                        FlightNo = $("#Text_FlightNo").val();
                        CitySNo = userContext.CitySNo;
                        SearchBy = $('input[type="radio"][name=searchby]:checked').val();
                        LoginAirportSNo= userContext.AirportSNo
                        return { AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, FromTime: FromTime, ToTime: ToTime, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, FlightNo:FlightNo, CitySNo: CitySNo, SearchBy: SearchBy, LoginAirportSNo: LoginAirportSNo };
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
                    fields: {
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        FlightStatus: { type: "string" },
                        FlightRoute: { type: "string" },
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        STD: { type: "string" },
                        ETD: { type: "string" },
                        ATD: { type: "string" },
                        STA: { type: "string" },
                        ETA: { type: "string" },
                        ATA: { type: "string" },
                        UpdatedBy: { type: "string" },
                        UpdatedOn: { type: "string" },
                        LocalTime: { type: "string"}
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            }
        }),

        sortable: true, filterable: false,
        dataBound: onDataBound,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
        { field: "FlightNo", title: "Flight No", filterable: true },
            { field: "FlightDate", title: "Flight Date" },
            { field: "FlightStatus", title: "Flight Status" },
            { field: "FlightRoute", title: "Route" },
            { field: "Origin", title: "Origin" },
           { field: "Destination", title: "Destination" },
           { field: "STD", title: "STD" },
           { field: "ETD", title: "ETD" },
           { field: "ATD", title: "ATD" },
           { field: "STA", title: "STA" },
           { field: "ETA", title: "ETA" },
           { field: "ATA", title: "ATA" },
           { field: "UpdatedBy", title: "Updated By" },
           { field: "UpdatedOn", title: "Updated On"  },
           { field: "LocalTime", title: "LocalTime", hidden: true }
        ]
    });
    function onDataBound(e) {
        var grid = $("#grid").data("kendoGrid");
        var data = grid.dataSource.data();
        $.each(data, function (i, row) {

            if (row.StatusColor == "1") {
                var element = $('tr[data-uid="' + row.uid + '"] ');
                $(element).addClass("change-background1");
            }
            else if (row.StatusColor == "2") {
                var element = $('tr[data-uid="' + row.uid + '"] ');
                $(element).addClass("change-background2");
            }
            else if (row.StatusColor == "3") {
                var element = $('tr[data-uid="' + row.uid + '"] ');
                $(element).addClass("change-background3");
            }
            else if (row.StatusColor == "4") {
                var element = $('tr[data-uid="' + row.uid + '"] ');
                $(element).addClass("change-background4");
        }
            else if (row.StatusColor == "5") {
            var element = $('tr[data-uid="' + row.uid + '"] ');
            $(element).addClass("change-background5");
        }
        });
    }
   
});



function SearchFlightStatusReport() {


    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    AirlineSNo = $('#AirlineSNo').val();

    $("#BlackListTbl").remove();
    if (AirlineSNo != "" && $('#ToDate').val() != "" && $('#FromDate').val() != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        setTimeout(function () {
            SearchFlightStatusReport()
        }, 300000);

    }
    
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    //else if (textId == "Text_DestinationSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    //}

    //else if (textId == "Text_OriginSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    //}

}


