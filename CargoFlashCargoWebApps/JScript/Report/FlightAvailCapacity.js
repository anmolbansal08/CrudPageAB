$(document).ready(function () {
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "FlightAvail_FlightNo", null, "contains");
   
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Tariff_AirportCode", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Tariff_AirportCode", null, "contains");
    cfi.DateType("FlightDate");
    $('#FlightDate').attr('readonly', true);

   if (userContext.GroupName.toUpperCase() == 'GSA') {
       if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
           $("#OriginSNo").val(userContext.CitySNo);
           $("#Text_OriginSNo_input").val(userContext.CityCode + '-' + userContext.CityName);
          
           cfi.EnableAutoComplete("OriginSNo", false);
            
       }
   }

  
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
    else if (textId == "Text_DestinationSNo") {
        try {
            cfi.setFilter(filterDest, "SNo", "notin", $("#OriginSNo").val());
            var Dest = cfi.autoCompleteFilter([filterDest]);
            return Dest;
        }
        catch (exp)
        { }
    }
    else if (textId == "Text_FlightNo") {
        try {

            cfi.setFilter(filterOrigin, "FlightDate", "in", $('#FlightDate').val());

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOrigin]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
   

}


function GetFlightSummaryDetail() {
    //var Modeldata = {
    //    FromDate: $('#FlightDate').val(),
    //    ToDate: '',
    //    FlightNo: $('#Text_FlightNo').val() == "" ? "" : $('#Text_FlightNo').val(),
    //    OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
    //    DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
    //    Airline: '',
    //}


    if (cfi.IsValidSubmitSection()) {

        $("#grid").kendoGrid({
            autoBind: true,
            dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true, serverSorting: true, serverFiltering: false, pageSize: 10,
                transport: {
                    read: {
                        url: "../FlightAvailCapacity/GetFlightCapacityDetail",
                        dataType: "json",
                        global: false,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: function GetReportData() {
                            FlightDate = $('#FlightDate').val();
                            FlightNo = $('#Text_FlightNo').val() == "" ? "" : $('#Text_FlightNo').val();
                            OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
                            DestinationSNo = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
                            return { FlightDate: FlightDate, FlightNo: FlightNo, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo };
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
                                Origin: { type: "string" },
                                Destination: { type: "string" },
                                ETD: { type: "string" },
                                ETA: { type: "string" },
                                STD: { type: "string" },
                                STA: { type: "string" },
                                AircraftType: { type: "string" },
                                AvlFreesaleGross: { type: "string" },
                                AvlFreeSaleVolume: { type: "string" },
                                CLOSED: { type: "string" }
                        }
                    }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                },

            }),
            sortable: true, filterable: false,
            pageable: { refresh: false, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
            scrollable: true,
            toolbar: ["excel"],
            excel: {
                allPages: true,
                fileName: "SpaceAvailability.xlsx",
                proxyURL: "/proxy"
            },
            columns: [
                { field: "FlightNo", title: "Flight No"},
                { field: "FlightDate", title: "Flight Date"},
                { field: "Origin", title: "Origin" },
                { field: "Destination", title: "Destination" },
                { field: "ETD", title: "ETD"},
                { field: "ETA", title: "ETA" },
                { field: "STD", title: "STD"},
                { field: "STA", title: "STA" },
                { field: "AircraftType", title: "Aircraft Type" },
                { field: "AvlFreesaleGross", title: "Avl. Free Sale Gross Wt. (KG)" },
                { field: "AvlFreeSaleVolume", title: "Avl. Free Sale Vol. (CBM)" },
                { field: "CLOSED", title: "Closed" }
            ]
        });
        $('.k-i-excel').hide();
        var grid = $("#grid").data("kendoGrid");
        if (userContext.UserType != 0 && userContext.UserType != 5 && userContext.UserType != 6) //0. AIRLINE 1. AGENT 2.GSA 3. GHA/CTO 4. GSSA  5. POS-CSC 6. POS-KSO
        {
            grid.hideColumn(grid.columns[6]);
            grid.hideColumn(grid.columns[7]);
            grid.hideColumn(grid.columns[11]);
        }
        /*
        $.ajax({
            url: "../FlightAvailCapacity/GetFlightCapacityDetail",
            async: false,
            type: "GET",
            dataType: "json",

            data: Modeldata,
            // contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                var Result = result.Table0
                $('#theadid').html('');
                $('#tbodyid').html('');


                var thead_body = "";
                var thead_row = "";

                if (Result.length > 0) {

                    for (var i = 0; i < Result.length; i++) {
                        var columnsIn = Result[0];// Coulms Name geting from First Row
                        thead_row += '<tr>'
                        for (var key in columnsIn) { // Printing Columns
                            if (i == 0)
                                thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                            thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : Result[i][key]) + "</label></td>";
                        }
                        thead_row += '</tr>'
                    }

                }
                $('#theadid').append('<tr>' + thead_body + '</tr>');
                $('#tbodyid').append(thead_row);
                $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll');
                $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                $("#Serial").closest('td').attr('style', 'color:#daecf4');
                $("#Serial").closest('td').text('Seri');
                if (Result.length == 0) {


                    ShowMessage('warning', 'Warning - Space Availability', 'No Record Found.', " ", "bottom-right");
                    return false;
                    //$("#exportflight").hide();
                }
                //else {
                //    $("#exportflight").show();
                //}



            },
            complete: function (data) {



                $("#btnExportToExcel_FlightSummaryDetail").show();
            },
            error: function (xhr) {
                var a = "";
            }
        });
        */
     }
}

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
//    //----remove hiiden field column-------------------
//    //  $("#tblCreditLimitReport tbody tr").find('td:last').remove();
//    //   $("#tblCreditLimitReport thead tr td:last").remove();
//    // var i = $("#tblCreditLimitReport tbody tr").length;
//    //  
//    $("#tblGetFlightSummaryDetail tbody tr").each(function () {
//        var i = $(this).index();
//        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
//        $(this).attr('style', 'background-color:' + co);
//    });
//    //------- end---------------------------------------
//    //    $('#tblsearchrateList [id^="Serial"]').hide();
//    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblGetFlightSummaryDetail thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblGetFlightSummaryDetail tbody').html() + '</tbody></table></body></html>';
//    var table_html = table_div.replace(/ /g, '%20');
//    a.href = data_type + ', ' + table_html;
//    a.download = 'SpaceAvailability' + today + '_.xls';
//    a.click();

//}