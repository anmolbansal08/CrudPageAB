$(document).ready(function () {
    cfi.AutoCompleteV2("AirportCode", "AirportCode,AirportName", "TransitAwbReport_Airport", null, "contains", null, null, null, null, null);
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

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }

    $('#exportflight').hide();
    $('#tblSUMOfCharges').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../TransitAWBReport/GetAwbTransitReport",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:
                        function GetReportData() {
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
                        //SNo: { type: "number" },
                        AWBNo: { type: "string" },
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        AWBDate: { type: "string" },
                        TransitStation: { type: "string" },
                        AgentName: { type: "string" },
                        AgentCode: { type: "string" },
                        AirlineCode: { type: "string" },
                        FlightNbr: { type: "string" },
                        ATD: { type: "string" },
                        GrossWeight: { type: "string" },
                        AircraftType: { type: "string" },
                        ProductName: { type: "string" },
                        Commodity: { type: "string" },
                        FlightType: { type: "string" },
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

   //{ field: "SNo", title: "SNo"},
  { field: "AWBNo", title: "AWB No" },
 { field: "Origin", title: "Origin" },
{ field: "Destination", title: "Destination", filterable: false },
{ field: "AWBDate", title: "AWB Date", filterable: false },
{ field: "TransitStation", title: "Transit Station", filterable: false },
{ field: "AgentName", title: "Agent Name", filterable: false },
{ field: "AgentCode", title: "Agent Code", filterable: false },
{ field: "AirlineCode", title: "Airline Code", filterable: false },
{ field: "FlightNbr", title: "Flight Number", filterable: false },
{ field: "ATD", title: "Date/ATD", filterable: false },
{ field: "GrossWeight", title: "Gross Wt.", filterable: false },
{ field: "AircraftType", title: "Aircraft Type", filterable: false },
{ field: "ProductName", title: "Product Name", filterable: false },
{ field: "Commodity", title: "Commodity", filterable: false },
//{ field: "Station", title: "Station", filterable: false },
{ field: "FlightType", title: "Flight Type", filterable: false }
    
        ]
    });

});
var Model = [];


function GetAwbTransitReport() {
    Model =
        {
            AirportCode: $('#AirportCode').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val()
        };
    if (Model.AirportCode != "" && Model.ToDate != "" && Model.FromDate != "") {
       
        var result =  CalculateDiff();
        if(result == false) {
            ShowMessage('warning', 'Warning - Transit AWB Report', "Transit AWB Report can be fetched for maximum 62 Days ");
            return false;
            }
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);

      $('#exportflight').show();
        //SumOfCharges();
     //   $('#tblSUMOfCharges').show();
      $('#df #AirportCode').val(Model.AirportCode);
        $('#df #FromDate').val(Model.FromDate);
        $('#df #ToDate').val(Model.ToDate);
    }
};

function CalculateDiff() {

    if ($("#FromDate").val() != "" && $("#ToDate").val() != "") {
        if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
            ShowMessage('warning', 'Warning - Transit AWB Report', "From Date can not be greater than To Date ");
            return false;
        }
        var From_date = new Date($("#FromDate").val());
        var To_date = new Date($("#ToDate").val());
        var diff_date = To_date - From_date;

        var years = Math.floor(diff_date / 31536000000);
        var months = Math.floor((diff_date % 31536000000) / 2628000000);
        var days = diff_date / (1000 * 60 * 60 * 24);//Math.floor(((diff_date % 31536000000) % 2628000000) / 86400000);
        if (days > 62) {
           
            return false;
        }
        return true;
      //  $("#Result").html(years + " year(s) " + months + " month(s) " + days + " and day(s)");
      //  alert( years+" year(s) "+months+" month(s) "+days+" and day(s)");
    }
    //else {
    //    alert("Please select dates");
    //    ShowMessage('info', 'Info - Transit Awb Report', "Please select dates !");
    //    return false;
    //}
}
//
function ExportToExcel_GetTransitAwBReport() {
 Model =
       {
           AirportCode: $('#AirportCode').val(),
           FromDate: $("#FromDate").val(),
           ToDate: $("#ToDate").val()
       };
    if (Model.AirportCode != "" && Model.FromDate != "" & Model.ToDate != "") {
        var result = CalculateDiff();
        if (result == false) {
            ShowMessage('warning', 'Warning - Transit AWB Report', "Transit AWB Report can be fetched for maximum 62 Days");
            return false;
        }
        
    }

}
















