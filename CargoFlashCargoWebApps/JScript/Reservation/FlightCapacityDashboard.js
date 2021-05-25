


$(document).ready(function () {

    ///                ControlId         FilterField              autocomplete Name
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "FlightCapRpt_Airline", null, "contains");
    var flightstatusType = [{ Key: "1", Text: "Depart" }, { Key: "3", Text: "Open" }, { Key: "2", Text: "Manifest" }, { Key: "4", Text: "Cancel" }];

    cfi.AutoCompleteByDataSource("FlightStatus", flightstatusType);

    cfi.AutoCompleteV2("FlightSNo", "FlightNo", "FlightCapacityDashboard_FlightNo", null, "contains");


    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineSNo").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }


    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    //$("#FromDate").change(function () {

    //    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //    $("#ToDate").data("kendoDatePicker").value('');
    //});


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
                    url: "FlightCapacityDashboardGetRecord",
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
                        CarrierFlightNumberSuffix: { type: "string" },
                        DepartureDate: { type: "string" },
                        BoardPoint: { type: "string" },
                        OffPoint: { type: "string" },
                        Mode: { type: "string" },
                        PlannedAircraftType: { type: "string" },
                        OperatedAircraftType: { type: "string" },
                        GrossWeight: { type: "string" },
                        GrossVolume: { type: "string" },
                        Revenue: { type: "string" },
                      
                      
                        YieldbyChargeableWeight: { type: "string" },
                     
                        FlightNo: { type: "string" },
                        FlightStatus: { type: "string" }
                       

                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),

        //detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        //height: 450,
        columns: [
            { field: "CarrierFlightNumberSuffix", title: "Carrier Code", width: 50 },
            { field: "FlightNo", title: "Flight No", width: 90 },
            { field: "DepartureDate", title: "Departure Date", width: 90 },
            { field: "BoardPoint", title: "Board Point", width: 90 },
            { field: "OffPoint", title: "Off Point", width: 90 },
            { field: "Mode", title: "Mode", width: 70 },
            { field: "PlannedAircraftType", title: "A/C TYpe-org", width: 130 },
            { field: "OperatedAircraftType", title: "A/C Type operated", width: 130 },
            { field: "GrossWeight", title: "Gross Weight", width: 90 },
            { field: "GrossVolume", title: "Chargeable Weight", width: 90 },
            { field: "Revenue", title: "Revenue", width: 70 },
          
            { field: "YieldbyChargeableWeight", title: "Yield by Chargeable Weight", width: 130 },
            //{ field: "LoadFactor", title: "Load Factor", width: 90 },
        
            { field: "FlightStatus", title: "Flight Status", width: 90 },
            //{ field: "TargetedGrossWeight", title: "Targeted Gross Weight", width: 130 },
            //{ field: "TargetedRevenue", title: "Targeted Revenue", width: 90 },
            //{ field: "TargetedYield", title: "Targeted Yield", width: 90 },
            //{ field: "GrossWeightDeviation", title: "Gross Weight Deviation", width: 130 },
            //{ field: "RevenueDeviation", title: "Revenue Deviation", width: 90 },
            //{ field: "YieldDeviation", title: "Yield Deviation", width: 90 }
        ]
    });

});



var Model = [];

function SearchFlightCapacityDashboard() {

    Model = {
        AirlineSNo: $('#AirlineSNo').val(),
        FlightNo: $("#FlightSNo").val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        FlightStatus:$('#FlightStatus').val()
    };
    if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate)) {
        ShowMessage('warning', 'warning - Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    //AirlineSNo = $('#AirlineSNo').val();


    if (Model.AirlineSNo != "" && Model.FromDate != "" && Model.ToDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#imgexcel').show();
    }
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}


function ExportToExcel_FlightCapacityDashboard() {

    var AirlineSNo = $('#AirlineSNo').val();
    var FlightNo = $("#FlightSNo").val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var flightstatus = $('#FlightStatus').val();


    if (Model.AirlineSNo != "" && Model.FromDate != "" && Model.ToDate != "") {
        window.location.href = "./ExportToExcelAll?AirlineSNo=" + AirlineSNo + "&FlightNo=" + FlightNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&flightstatus=" + flightstatus + "";
    }

    //if (AirlineSNo != "" && $("#FromDate").val() != "" && $("#ToDate").val() != "") {
    //    $.ajax({
    //        url: '../FlightCapacityDashboard/ExportToExcel',
    //        async: false,
    //        type: "GET",
    //        dataType: "json",
    //        data: {
    //            AirlineSNo: AirlineSNo, FlightNo: FlightNo, FromDate: FromDate, ToDate: ToDate
    //        },
    //        contentType: "application/json; charset=utf-8", cache: false,
    //        success: function (result) {
    //            var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'>" +
    //            "<thead role='rowgroup' ><tr role='row' style='background-color: #daecf4'>" +
    //            "<th role='columnheader'>Carrier Flight Number Suffix</th>" +
    //            "<th role='columnheader' >Departure Date</th>" +
    //            "<th role='columnheader' >Board Point</th>" +
    //            "<th role='columnheader' >Off Point</th>" +
    //            "<th role='columnheader' >Mode</th>" +
    //            "<th role='columnheader' >Planned Aircraft Type</th>" +
    //            "<th role='columnheader' >Operated Aircraft Type</th>" +
    //            "<th role='columnheader' >Gross Weight</th>" +
    //            "<th role='columnheader' >Gross Volume</th>" +
    //            "<th role='columnheader' >Revenue</th>" +
    //            "<th role='columnheader' >Gross weight utilization</th>" +
    //            "<th role='columnheader' >Gross volume utilization</th>" +
    //            "<th role='columnheader' >Yield by Chargeable Weight</th>" +
    //            "<th role='columnheader' >Load Factor</th>" +
    //            "<th role='columnheader' >Flight Status</th>" +
    //            "<th role='columnheader' >Targeted Gross Weight</th>" +
    //            "<th role='columnheader' >Targeted Revenue</th>" +
    //            "<th role='columnheader' >Targeted Yield</th>" +
    //            "<th role='columnheader' >Gross Weight Deviation</th>" +
    //            "<th role='columnheader' >Revenue Deviation</th>" +
    //            "<th role='columnheader' >Yield Deviation</th>" +
    //            "</tr></thead>";
    //            if (result.Data.length > 0) {
    //                for (var i = 0; i < result.Data.length; i++) {
    //                    str += "<tr>";
    //                    str += "<td>" + result.Data[i].CarrierFlightNumberSuffix + "</td>";
    //                    str += "<td>" + result.Data[i].DepartureDate + "</td>";
    //                    str += "<td>" + result.Data[i].BoardPoint + "</td>";
    //                    str += "<td>" + result.Data[i].OffPoint + "</td>";
    //                    str += "<td>" + result.Data[i].Mode + "</td>";
    //                    str += "<td>" + result.Data[i].PlannedAircraftType + "</td>";
    //                    str += "<td>" + result.Data[i].OperatedAircraftType + "</td>";
    //                    str += "<td>" + result.Data[i].GrossWeight + "</td>";
    //                    str += "<td>" + result.Data[i].GrossVolume + "</td>";
    //                    str += "<td>" + result.Data[i].Revenue + "</td>";
    //                    str += "<td>" + result.Data[i].Grossweightutilization + "</td>";
    //                    str += "<td>" + result.Data[i].Grossvolumeutilization + "</td>";
    //                    str += "<td>" + result.Data[i].YieldbyChargeableWeight + "</td>";
    //                    str += "<td>" + result.Data[i].LoadFactor + "</td>";
    //                    str += "<td>" + result.Data[i].FlightStatus + "</td>";
    //                    str += "<td>" + result.Data[i].TargetedGrossWeight + "</td>";
    //                    str += "<td>" + result.Data[i].TargetedRevenue + "</td>";
    //                    str += "<td>" + result.Data[i].TargetedYield + "</td>";
    //                    str += "<td>" + result.Data[i].GrossWeightDeviation + "</td>";
    //                    str += "<td>" + result.Data[i].RevenueDeviation + "</td>";
    //                    str += "<td>" + result.Data[i].YieldDeviation + "</td>";
    //                    str += "</tr>";
    //                }
    //            }
    //            else {
    //                str += " <tr>";
    //                str += "<td colspan='21'><center><p style='color:red'>No Record Found</p></center></td>";
    //                str += "</tr>";
    //            }
    //            str += "</table>";

    //            var today = new Date();
    //            var dd = today.getDate();
    //            var mm = today.getMonth() + 1; //January is 0!

    //            var yyyy = today.getFullYear();
    //            if (dd < 10) {
    //                dd = '0' + dd;
    //            }
    //            if (mm < 10) {
    //                mm = '0' + mm;
    //            }
    //            var today = dd + '_' + mm + '_' + yyyy;


    //            var a = document.createElement('a');
    //            var data_type = 'data:application/vnd.ms-excel';
    //            var table_div = str;
    //            var table_html = table_div.replace(/ /g, '%20');
    //            a.href = data_type + ', ' + table_html;
    //            a.download = 'FlightCapacityDashboard_' + today + '.xls';
    //            a.click();
    //            //}
    //            return false
    //        },
    //        error: function (xhr) {
    //            var a = "";
    //        }
    //    });
    //}
}