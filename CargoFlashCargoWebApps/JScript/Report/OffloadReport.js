var AirlineAccess = "";
var IsAllAirline = 0;
$(document).ready(function () {
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "OffloadReport_FlightNo", null, "contains");
    // cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Gate_Pass_SearchAirlineCarrierCode1", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Tariff_AirportCode", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Tariff_AirportCode", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    // cfi.DateType("FlightDate");

    //$('#FromDate').attr('readonly', true);
    //$('#ToDate').attr('readonly', true);
    //$('#FlightDate').attr('readonly', true);

    $("#FromDate").change(function () {
        //$('#FromDate').css('width', '150px');
        //$('.k-datepicker').css('width', '150px');
        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());

        if ($("#ToDate").val() < $("#FromDate").val())
            $("#ToDate").data("kendoDatePicker").value('');
    });
    $.ajax({
        url: "../schedule/GetAirports", async: false, type: "POST", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result[0] != undefined && result[0] != null) {

                AirlineAccess = result[0].Airlines.TrimRight();
                IsAllAirline = parseInt(result[0].IsAllAirlines);
            }
        }
    });
});


function ExtraCondition(textId) {
    var filterOrigin = cfi.getFilter("AND");
    var filterDest = cfi.getFilter("AND");
    var filterFlight = cfi.getFilter("AND");
    if (textId == "Text_OriginSNo") {
        try {

            cfi.setFilter(filterOrigin, "SNo", "notin", $("#DestinationSNo").val());

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOrigin]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_DestinationSNo") {
        try {
            cfi.setFilter(filterDest, "SNo", "notin", $("#OriginSNo").val());
            var Dest = cfi.autoCompleteFilter([filterDest]);
            return Dest;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_FlightNo") {
        try {
            if ($("#OriginSNo").val() != "")
                cfi.setFilter(filterFlight, "OriginAirportSNo", "in", $("#OriginSNo").val());
            if ($("#DestinationSNo").val() != "")
                cfi.setFilter(filterFlight, "DestinationAirPortSNo", "in", $("#DestinationSNo").val());

            var Flight = cfi.autoCompleteFilter([filterFlight]);
            return Flight;
        }
        catch (exp)
        { }
    }

}


//function GetFlightSummaryDetail() {
//    var Modeldata = {
//        FromDate: $('#FromDate').val(),
//        ToDate: $('#ToDate').val(),
//        FlightNo: $('#Text_FlightNo').val() == "" ? "" : $('#Text_FlightNo').val(),
//        FlightDate: $('#FlightDate').val(),
//        OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
//        DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
//        //Airline: $('#Airline').val() == "" ? "0" : $('#Airline').val(),
//        //FlightStatus: $('#FlightStatus').val() == "" ? "0" : $('#FlightStatus').val(),
//    }


//    if (cfi.IsValidSubmitSection()) {

//        $.ajax({
//            url: "../SpecialCargoReports/GetSpecialCargoDetail",
//            async: false,
//            type: "GET",
//            dataType: "json",

//            data: Modeldata,
//            // contentType: "application/json; charset=utf-8", cache: false,
//            success: function (result) {

//                var Result = result.Table0
//                $('#theadid').html('');
//                $('#tbodyid').html('');


//                var thead_body = "";
//                var thead_row = "";

//                if (Result.length > 0) {

//                    for (var i = 0; i < Result.length; i++) {
//                        var columnsIn = Result[0];// Coulms Name geting from First Row
//                        thead_row += '<tr>'
//                        for (var key in columnsIn) { // Printing Columns
//                            if (i == 0)
//                                thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

//                            thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : Result[i][key]) + "</label></td>";
//                        }
//                        thead_row += '</tr>'
//                    }

//                }

//                $('#theadid').append('<tr>' + thead_body + '</tr>');
//                $('#tbodyid').append(thead_row);
//                $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll');
//                $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
//                $("#Serial").closest('td').attr('style', 'color:#daecf4');
//                $("#Serial").closest('td').text('Seri');
//                if (Result.length == 0) {


//                    ShowMessage('warning', 'Warning - Special Cargo Report', 'No Record Found.', " ", "bottom-right");
//                    return false;
//                    //$("#exportflight").hide();
//                }
//                //else {
//                //    $("#exportflight").show();
//                //}



//            },
//            complete: function (data) {



//                $("#btnExportToExcel_FlightSummaryDetail").show();
//            },
//            error: function (xhr) {
//                var a = "";
//            }
//        });



//    }
//}


var Model = [];
function search1() {

    Model = {
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        FlightNo: $('#Text_FlightNo').val() == "" ? "" : $('#Text_FlightNo').val(),
        FlightDate: $('#FlightDate').val(),
        OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
        DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val()

    };
    $('#grid').css('display', 'none')
    $("#grid").show();
    $("#grid").kendoGrid({
        autoBind: true,       
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: false,
            serverFiltering: false,
            pageSize: 10,
            transport: {
                read: {
                    url: "../OffloadReport/GetOffloadDetail",
                    dataType: "json",
                    global: true,
                    type: 'GET',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetDetail() {
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
                        AWBNo: { type: "string" },
                        Date: { type: "string" },
                        FlightNo: { type: "string" },
                        TailNo: { type: "string" },
                        STD: { type: "string" },
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        Plannedpieces: { type: "string" },
                        PlannedGrossWeight: { type: "string" },
                        PlannedChargeableWeight: { type: "string" },
                        Upliftedpieces: { type: "string" },
                        UpliftedGrossWeight: { type: "string" },
                        UpliftedChargeableWeight: { type: "string" },
                        OffloadedPieces: { type: "string" },
                        OffloadedGrossWeight: { type: "string" },
                        OffloadedChargeableWeight: { type: "string" }                       
                    }
                },

                data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },

        scrollable: true,
       
        columns: [
            { field: "Date", title: "Date", width: 20 },
            { field: "AWBNo", title: "AWB No", width: 20 },
            { field: "FlightNo", title: "Flight No", width: 20 },
            { field: "TailNo", title: "Tail No", width: 20 },
            { field: "STD", title: "STD", width: 20 },
            { field: "Origin", title: "Origin", width: 20 },
            { field: "Destination", title: "Destination", width: 20 },
            { field: "Plannedpieces", title: "Planned pieces", width: 20, headerTemplate: '<span title="Planned pieces">Planned pieces</span>' },
            { field: "PlannedGrossWeight", title: "Planned Gross Weight", width: 20, headerTemplate: '<span title="Planned Gross Weight">Planned Gross Weight</span>' },
            { field: "PlannedChargeableWeight", title: "Planned Chargeable Weight", width: 20, headerTemplate: '<span title="Planned Chargeable Weight">Planned Chargeable Weight</span>' },
            { field: "Upliftedpieces", title: "Uplifted pieces", width: 20, headerTemplate: '<span title="Uplifted pieces">Uplifted pieces</span>' },
            { field: "UpliftedGrossWeight", title: "Uplifted Gross Weight", width: 20, headerTemplate: '<span title="Uplifted Gross Weight">Uplifted Gross Weight</span>' },
            { field: "UpliftedChargeableWeight", title: "Uplifted Chargeable Weight", width: 20, headerTemplate: '<span title="Uplifted Chargeable Weight">Uplifted Chargeable Weight</span>' },
            { field: "OffloadedPieces", title: "Offloaded Pieces", width: 20, headerTemplate: '<span title="Offloaded Pieces">Offloaded Pieces</span>' },
            { field: "OffloadedGrossWeight", title: "Offloaded Gross Weight", width: 20, headerTemplate: '<span title="Offloaded Gross Weight">Offloaded Gross Weight</span>' },
            { field: "OffloadedChargeableWeight", title: "Offloaded Chargeable Weight", width: 20, headerTemplate: '<span title="Offloaded Chargeable Weight">Offloaded Chargeable Weight</span>' },
        ]
    });
    $("#grid").data('kendoGrid').dataSource.page(1);




}


function ExportToExcel() {

    window.location.href = "../OffloadReport/ExportToExcel?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#Text_FlightNo').val() + "&OriginSNo=" + $('#OriginSNo').val() + "&DestinationSNo=" + $('#DestinationSNo').val() + "&PageSize=100000";

};



function ExtraParameters(id) {
    var param = [];
    if (id == "Text_Airline") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}


if (typeof String.prototype.TrimRight !== 'function') {
    String.prototype.TrimRight = function (char) {
        if (this.lastIndexOf(char))
            return this.slice(0, this.length - 1);
        else
            return this;

    }
}