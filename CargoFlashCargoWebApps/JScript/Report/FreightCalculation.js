$(document).ready(function () {
    //cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    //cfi.AutoCompleteV2("Destination", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    //cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Users_Airport", null, "contains");
    //cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Users_Airport", null, "contains");
    //cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("AwbNo", "AwbNo", "Freight_AwbNo", null, "contains");
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


});



var Model = [];
function search() {

    Model = {
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        AwbNo: $('#Text_AwbNo').val()

    };

        
            $("#grid1").hide();
            $("#grid").show();
            $("#grid").kendoGrid({
                autoBind: true,
                //toolbar: ["excel"],
                //excel: {
                //    allPages: true
                //},
                dataSource: new kendo.data.DataSource({


                    type: "json",
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,


                    transport: {
                        read: {
                            url: "../FreightCalculation/FreightCalculation",
                            dataType: "json",
                            global: true,
                            type: 'POST',
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

                                SNo: { type: "string" },
                                // DATETIME_UPDATED: { type: "string" },
                                // FromDate: { type: "string" },
                                AwbNO: { type: "string" },
                                FlightNO: { type: "string" },
                                FlightDate: { type: "string" },
                                OriginAirportCode: { type: "string" },
                                Remarks: { type: "string" },
                                
                            }
                        },
                        data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),
                sortable: true,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },
                scrollable: true,
                columns: [

                //{ field: "FromDate", title: "DATETIME_UPDATED" },
                { field: "SNo", title: "SNo", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "AwbNO", title: "AwbNO", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "FlightNO", title: "FlightNO", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "FlightDate", title: "FlightDate", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "OriginAirportCode", title: "OriginAirportCode", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "Remarks", title: "Total AWB", filterable: true, sortable: true, width: 130, lockable: false, },
                ]
            });
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
        }

function ExportToExcel() {
    
    window.location.href = "../FreightCalculation/ExportToExcel?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&AwbNo=" + $('#Text_AwbNo').val() + "&PageSize=100000";
    
    
};
//function ExtraCondition(textId) {
//    var filterOrigin = cfi.getFilter("AND");
//    var filterDest = cfi.getFilter("AND");
//    var filterFlight = cfi.getFilter("AND");
//    if (textId == "Text_Origin") {
//        try {

//            cfi.setFilter(filterOrigin, "SNo", "notin", $("#Destination").val());

//            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOrigin]);
//            return OriginCityAutoCompleteFilter2;
//        }
//        catch (exp)
//        { }
//    }
//    if (textId == "Text_Destination") {
//        try {
//            cfi.setFilter(filterDest, "SNo", "notin", $("#Origin").val());
//            var Dest = cfi.autoCompleteFilter([filterDest]);
//            return Dest;
//        }
//        catch (exp)
//        { }
//    }


//}