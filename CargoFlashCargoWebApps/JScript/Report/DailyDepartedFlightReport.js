$(document).ready(function () {
    //cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    //cfi.AutoCompleteV2("Destination", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Users_Airport", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Users_Airport", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingReport_FlightNo", null, "contains");

    //if (userContext.CitySNo != "" && userContext.CityCode != "" && userContext.CityName != "") {
    //    $("#Origin").val(userContext.CitySNo);
    //    $("#Text_Origin_input").val(userContext.CityCode + '-' + userContext.CityName);
    //}
    
    //else {
    //    cfi.EnableAutoComplete('Origin', false, false, null);
    //}

    //if (userContext.GroupName.indexOf('ADMIN') >= 0) {    //Comment By Akash bcz of Super Admin

    //}
    //else if (userContext.GroupName == "AGENT") {

    //    if (userContext.AgentSNo != "") {
    //        $('#AgentName').val(userContext.AgentSNo == 0 ? "0" : userContext.AgentSNo);
    //        $('#Text_AgentName_input').val(userContext.AgentName);
    //    }
    //    cfi.EnableAutoComplete('AgentName', false, false, null);//diasble
    //}
   
  


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
        FromDate:$('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        FlightNo: $('#FlightNo').val(),
        Origin: $('#Text_Origin_input').val(),
        Destination: $('#Text_Destination_input').val()

    };
  
    if ($('input[type="radio"]:checked').val() == "Summary") {
        //if ($('#FlightNo').val() == '' || $('#Text_Origin').val() == '' || $('#Text_Destination').val() == '')
        if ( $('#Text_Origin').val() == '')
        {
            $('#exportflight').hide();
            $('#grid').css('display', 'none')
        }
        else {
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
                            url: "../DailyDepartedFlightReport/GetDailyDepartedFlightReportSummary",
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
                                FLIGHT_NO: { type: "string" },
                                FLIGHT_DATE: { type: "string" },
                                Flight_OD: { type: "string" },
                                ULD_Count: { type: "string" },
                                Total_AWB: { type: "string" },
                                Total_Awb_Pieces: { type: "string" },
                                Total_Awb_Weight: { type: "string" },
                                UserID:{type:"string"},
                                //NUM_OF_PCS: { type: "string" },
                                //ToDate: { type: "string" },
                                //VOL: { type: "string" },
                               // AWB_OD: { type: "string" },
                                //BOARD_POINT: { type: "string" },
                                //OFF_POINT: { type: "string" },
                               // AC_TYPE: { type: "string" },
                               // ULD_NO: { type: "string" },
                                //AWB_NO: { type: "string" },
                                //awb_pieces: { type: "string" },
                               // GRS_WT: { type: "string" },
                               // VOL: { type: "string" },
                                //no_of_ship: { type: "string" },

                            }
                        },
                        //data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                        data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),
                sortable: true,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },
                scrollable: true,
                columns: [

                //{ field: "FromDate", title: "DATETIME_UPDATED" },
                { field: "SNo", title: "SNo", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "FLIGHT_NO", title: "Flight NO", filterable: true, sortable: true, width: 130, lockable: false,},
                { field: "FLIGHT_DATE", title: "Flight Date", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "Flight_OD", title: "Flight OD", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "ULD_Count", title: "Total ULD", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "Total_AWB", title: "Total AWB", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "Total_Awb_Pieces", title: "Total Awb Pieces", filterable: true, sortable: true, width: 130, lockable: false, },
                { field: "Total_Awb_Weight", title: "Total Awb Weight", filterable: true, sortable: true, width: 130, lockable: false, },
                 { field: "UserID", title: "UserID", filterable: true, sortable: true, width: 130, lockable: false, },





                ]
            });
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
        }
    }
    else {
        //if ($('#FlightNo').val() == '' || $('#Text_Origin').val() == '' || $('#Text_Destination').val() == '')
        if ($('#Text_Origin').val() == '')
        {
            $('#exportflight').hide();
            $('#grid').css('display', 'none')
        }
        else {
            $("#grid").hide();
            $("#grid1").show();

            $("#grid1").kendoGrid({
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
                            url: "../DailyDepartedFlightReport/GetDailyDepartedFlightReportDetails",
                            dataType: "json",
                            global: true,
                            type: 'POST',
                            method: 'POST',
                            contentType: "application/json; charset=utf-8",
                            data: function GetDetails() {
                                return { Model: Model };
                            }

                        },
                        parameterMap: function (options) {
                            if (options.filter == undefined)
                                options.filter = null;
                            if (options.sort == undefined)
                                options.sort = null; return JSON.stringify(options);
                        },
                    },
                    schema: {
                        model: {
                            //   id: "SNo",
                            fields: {

                                SNo: { type: "string" },
                                // DATETIME_UPDATED: { type: "string" },
                                //FromDate: { type: "string" },
                                FLIGHT_NO: { type: "string" },
                                FLIGHT_DATE: { type: "string" },
                                Flight_OD: { type: "string" },
                                // ULD_Count: { type: "string" },
                                // Total_AWB: { type: "string" },
                                //Total_Awb_Pieces: { type: "string" },
                                // Total_Awb_Weight: { type: "string" },
                                //NUM_OF_PCS: { type: "string" },
                                //ToDate: { type: "string" },
                                // VOL: { type: "string" },
                                AWB_OD: { type: "string" },
                                //BOARD_POINT: { type: "string" },
                                //OFF_POINT: { type: "string" },
                                // AC_TYPE: { type: "string" },
                                ULD_NO: { type: "string" },
                                AWB_NO: { type: "string" },
                                awb_pieces: { type: "string" },
                                awb_weight: { type: "string" },
                                GRS_WT: {type:"string"},
                                // VOL: { type: "string" },
                                no_of_ship: { type: "string" },
                                SHC:{type:"string"},
                                UserID:{type:"string"},




                            }
                        },
                        data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),
                sortable: true,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },
                scrollable: true,
                columns: [

                    { field: "SNo", title: "SNo", filterable: true, sortable: true, width: 70, lockable: false, },
                    //{ field: "DATETIME_UPDATED", title: "Date Time Updated", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "FLIGHT_NO", title: "Flight NO", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "FLIGHT_DATE", title: "Flight Date", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "Flight_OD", title: "Flight OD", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "AWB_OD", title: "AWB OD", filterable: true, sortable: true, width: 130, lockable: false, },
                    //{ field: "BOARD_POINT", title: "Board Point", filterable: true, sortable: true, width: 130, lockable: false, },
                    //{ field: "OFF_POINT", title: "Off Point", filterable: true, sortable: true, width: 130, lockable: false, },
                    //{ field: "AC_TYPE", title: "AC Type", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "ULD_NO", title: "ULD NO", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "AWB_NO", title: "AWB NO", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "awb_pieces", title: "AWB Pieces", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "awb_weight", title: "AWB Weight", filterable: true, sortable: true, width: 130, lockable: false, },
                    
                    { field: "GRS_WT", title: "Loaded Weight", filterable: true, sortable: true, width: 130, lockable: false, },
                   // { field: "NUM_OF_PCS", title: "Number Of Pieces", filterable: true, sortable: true, width: 130, lockable: false, },
                   
                    //{ field: "VOL", title: "Volume", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "no_of_ship", title: "Loaded Pcs", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "SHC", title: "SHC", filterable: true, sortable: true, width: 130, lockable: false, },
                    { field: "UserID", title: "UserID", filterable: true, sortable: true, width: 130, lockable: false, }



                ]
            });
        }
        $('#grid1').css('display', '')
        $("#grid1").data('kendoGrid').dataSource.page(1);
    }
    
    $('span.k-i-excel').removeClass('k-icon');
    //$('#grid').css('display', '')
    //$("#grid").data('kendoGrid').dataSource.page(1);

   


}
function ExportToExcel() {
    if ($('input[type="radio"]:checked').val() == "Summary") {
        /*window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Summary?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#FlightNo').val() + "&Origin=" + $('#Text_Origin_input').val() +"&Destination="+$('#Text_Destination_input').val()+ "&PageSize=100000";*/
        if ($('#FlightNo').val() == '') {
            window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Summary?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&Origin=" + $('#Text_Origin_input').val() + "&Destination=" + $('#Text_Destination_input').val() + "&PageSize=100000";
        }
        else if ($('#Text_Destination_input').val() == '') {
            window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Summary?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#FlightNo').val() + "&Origin=" + $('#Text_Origin_input').val() + "&PageSize=100000";
        }
        else {
            window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Summary?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#FlightNo').val() + "&Origin=" + $('#Text_Origin_input').val() + "&Destination=" + $('#Text_Destination_input').val() + "&PageSize=100000";
        }
    }
    else {
        /*window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Details?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#FlightNo').val()+"&Origin=" + $('#Text_Origin_input').val() +"&Destination="+$('#Text_Destination_input').val()+"&PageSize=100000"; */
        if ($('#FlightNo').val() == '') {
            window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Details?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&Origin=" + $('#Text_Origin_input').val() + "&Destination=" + $('#Text_Destination_input').val() + "&PageSize=100000";
        }
        else if ($('#Text_Destination_input').val() == '') {
            window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Details?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#FlightNo').val() + "&Origin=" + $('#Text_Origin_input').val() + "&PageSize=100000";
        }
        else {
            window.location.href = "../DailyDepartedFlightReport/ExportToExcel_Details?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&FlightNo=" + $('#FlightNo').val() + "&Origin=" + $('#Text_Origin_input').val() + "&Destination=" + $('#Text_Destination_input').val() + "&PageSize=100000";
        }
    }
};
function ExtraCondition(textId) {
    var filterOrigin = cfi.getFilter("AND");
    var filterDest = cfi.getFilter("AND");
    var filterFlight = cfi.getFilter("AND");
    if (textId == "Text_Origin") {
        try {

            cfi.setFilter(filterOrigin, "SNo", "notin", $("#Destination").val());

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOrigin]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_Destination") {
        try {
            cfi.setFilter(filterDest, "SNo", "notin", $("#Origin").val());
            var Dest = cfi.autoCompleteFilter([filterDest]);
            return Dest;
        }
        catch (exp)
        { }
    }


}