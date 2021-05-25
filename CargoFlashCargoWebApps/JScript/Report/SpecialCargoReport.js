var AirlineAccess = "";
var IsAllAirline = 0;
$(document).ready(function () {
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "SpecialCargo_FlightNo", null, "contains");
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
               // toolbar: ["excel"],
                //excel: {
                //    fileName: "Kendo UI Grid Export.xlsx",
                //    allPages: true
                //},
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true,
                    //serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,
                    transport: {
                        read: {
                            url: "../SpecialCargoReports/GetSpecialCargoDetail",
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
                                OriginAirport: { type: "string,"},
                                DestinationAirport: { type: "string" },
                                BookingDate: { type: "string" },
                                AgentName: { type: "string" },
                                AWBPieces: { type: "string" },
                                GrossWeight: { type: "string" },
                                Volume: { type: "string" },
                                Commodity: { type: "string" },
                                SHC: { type: "string" },                               
                                AWBSTATUS: { type: "string" },
                                RouteType: { type: "string" },
                                FlightDate: { type: "string" },
                                FlightNo: { type: "string" },
                                ShipmentStatus: { type: "string" },
                                Createdby: { type: "string" }
                            }
                        },
                        
                        data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),
                sortable: false,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },

                scrollable: true,
                //excelExport: function (e) {
                //    var workbook = e.workbook;
                //    var sheet = workbook.sheets[0];

                //    workbook.rtl = true;
                //    for (var i = 0; i < sheet.rows.length; i++) {
                //        for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
                //            sheet.rows[i].cells[ci].hAlign = "right";
                //        }
                //    }
                //},
                columns: [
                    { field: "AWBNo", title: "AWB No", width: 20, filterable: true },
                    { field: "OriginAirport", title: "Origin Airport", width: 20, filterable: true },
                    { field: "DestinationAirport", title: "Destination Airport", width: 20, filterable: true },
                    { field: "BookingDate", title: "Booking Date", width: 20 },
                    { field: "AgentName", title: "Agent Name", width: 20 },
                    { field: "AWBPieces", title: "AWB Pieces", width: 20 },
                    { field: "GrossWeight", title: "Gross Weight", width: 20 },
                    { field: "Volume", title: "Volume", width: 20 },
                    { field: "Commodity", title: "Commodity", width: 20 },
                    { field: "SHC", title: "SHC", width: 20 },
                    { field: "AWBSTATUS", title: "AWB Status", width: 20 },
                    { field: "RouteType", title: "Route Type", width: 20 },
                    { field: "FlightDate", title: "Flight Date", width: 20 },
                    { field: "FlightNo", title: "Flight No", width: 20 },
                    { field: "ShipmentStatus", title: "Shipment Status", width: 20 },
                    { field: "Createdby", title: "Created by", width: 20 },

                ]
                //filterable: true,
            });          
            $("#grid").data('kendoGrid').dataSource.page(1);
       
    
   
       
    }
   

function ExportToExcel() {
   
    window.location.href = "../SpecialCargoReports/ExportToExcel?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#Text_FlightNo').val() + "&OriginSNo=" + $('#OriginSNo').val() + "&DestinationSNo=" + $('#DestinationSNo').val() + "&PageSize=100000";
   
};



//function ExportToExcel_FlightSummaryDetail() {

//    var today = new Date();
//    var dd = today.getDate();
//    var mm = today.getMonth() + 1;
//    var yyyy = today.getFullYear();
//    if (dd < 10) {
//        dd = '0' + dd;
//    }
//    if (mm < 10) {
//        mm = '0' + mm;
//    }
//    var today = dd + '_' + mm + '_' + yyyy;
//    var a = document.createElement('a');
//    var data_type = 'data:application/vnd.ms-excel';
//    $("#tblGetFlightSummaryDetail tbody tr").each(function () {
//        var i = $(this).index();
//        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
//        $(this).attr('style', 'background-color:' + co);
//    });
//    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblGetFlightSummaryDetail thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblGetFlightSummaryDetail tbody').html() + '</tbody></table></body></html>';
//    var contentType = "application/vnd.ms-excel";
//    var byteCharacters = table_div; //e.format(fullTemplate, e.ctx);
//    var byteNumbers = new Array(byteCharacters.length);
//    for (var i = 0; i < byteCharacters.length; i++) {
//        byteNumbers[i] = byteCharacters.charCodeAt(i);
//    }
//    var byteArray = new Uint8Array(byteNumbers);
//    var blob = new Blob([byteArray], { type: contentType });
//    var blobUrl = URL.createObjectURL(blob);
//    a = document.createElement("a");
//    a.download = 'SpecialCargoReport' + today + '_.xls';
//    a.href = blobUrl;
//    document.body.appendChild(a);
//    a.click();
//    document.body.removeChild(a);

//}


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