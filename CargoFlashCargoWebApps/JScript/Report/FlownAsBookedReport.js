
$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "FlownasBooked_Airline", null, "contains");
    cfi.AutoCompleteV2("Origin", "AirportCode,CityName", "FlownAsBooked_Origin", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,CityName", "FlownAsBooked_Origin", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "FWBImport_searchAWBNo", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $("#FromDate").change(function () {
        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());

        if ($("#ToDate").val() < $("#FromDate").val())
            $("#ToDate").data("kendoDatePicker").value('');
    });
   });
    
    
$('#grid').css('display', 'none')
$("#grid").kendoGrid({
    autoBind: false,
    toolbar: ["excel"],
    excel: {
        allPages: true
    },
    dataSource: new kendo.data.DataSource({
        type: "json",
        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
        transport: {
            read: {
                url: "../Reports/FlownAsBookedReport",
                dataType: "json",
                global: true,
                type: 'POST',
                method: 'POST',
                contentType: "application/json; charset=utf-8",
                data:
                    function GetFlownAsBookedReport() {
                        return { Model: Model };
                    }

            }, pageSize: 20, parameterMap: function (options) {
                if (options.filter == undefined)
                    options.filter = null;
                if (options.sort == undefined)
                    options.sort = null; return JSON.stringify(options);
            },
        },
        schema: {
            // total:"request.Page",
            model: {
                // id: "SNo",
                fields:
                  {
                      AWBNo: { type: "string" },
                      AgentName: { type: "string" },
                      Commodity: { type: "string" },
                      BookedFlightNo: { type: "string" },
                      BookedFlightDate: { type: "string" },
                      BookedOri: { type: "string" },
                      BookedDest: { type: "string" },
                      BookedPieces: { type: "string" },
                      BookedGrossWeight: { type: "string" },
                      BookedVolumeWeight: { type: "string" },
                      AcceptanceFlightNo: { type: "string" },
                      AcceptanceFlightDate: { type: "string" },
                      AcceptancePieces: { type: "string" },
                      AcceptanceGrossWeight: { type: "string" },
                      AcceptanceVolumeWeight: { type: "string" },
                      FlownFlightNo: { type: "string" },
                      FlownFlightDate: { type: "string" },
                      FlownOrigin: { type: "string" },
                      FlownDestination: { type: "string" },
                      FlownPieces: { type: "string" },
                      FlownGrossWeight: { type: "string" },
                      Actual_Weight: { type: "string" },
                      FlownVolumeWeight: { type: "string" },
                      Status: { type: "string" },
                      
                  }
            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
        },

    }),
    sortable: true, filterable: false,
    pageable:
        {
            refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
        },
    scrollable: true,
    //toolbar: ['Export'],
    columns: [
       {
           field: "AWBNo", title: "AWB No", filterable: true, sortable: true, width:85, lockable: false,
       },
        {
            field: "AgentName", title: "Agent Name", filterable: true, sortable: true, width: 120,
        }        
        ,
        {
            field: "Commodity", title: "Commodity", filterable: true, sortable: true, width: 120,
        },
        {
            field: "BookedFlightNo", title: "Booked Flight No", filterable: true, sortable: true, width: 100
        },
        {
            field: "BookedFlightDate", title: "Booked Flight Date", filterable: true, sortable: true, width: 100
        },
        {
            field: "BookedOri", title: "Booked Origin", filterable: true, sortable: true, width: 90
        },
        {
            field: "BookedDest", title: "Booked Destination", filterable: true, sortable: true, width: 100
        },
        {
            field: "BookedPieces", title: "Booked Pieces", filterable: true, sortable: true, width: 90
        },
         {
             field: "BookedGrossWeight", title: "Booked Gross Weight", filterable: true, sortable: true, width: 100
         },
        {
            field: "BookedVolumeWeight", title: "Booked Volume Weight", filterable: true, sortable: true, width: 100
        },
        {
            field: "AcceptanceFlightNo", title: "Acceptance Flight No", filterable: true, sortable: true, width: 100
        },
         {
             field: "AcceptanceFlightDate", title: "Acceptance Flight Date", filterable: true, sortable: true, width: 100
         },

        {
            field: "AcceptancePieces", title: "Acceptance Pieces", filterable: true, sortable: true, width: 100
        },
        {
            field: "AcceptanceGrossWeight", title: "Acceptance Gross Weight", filterable: true, sortable: true, width: 100
        },
        {
            field: "AcceptanceVolumeWeight", title: "Acceptance Volume Weight", filterable: true, sortable: true, width: 100
        },
        {
            field: "FlownFlightNo", title: "Flown Flight No", filterable: true, sortable: true, width: 100
        },
        {
            field: "FlownFlightDate", title: "Flown Flight Date", filterable: true, sortable: true, width: 100,
        },
        {
            field: "FlownOrigin", title: "Flown Origin", filterable: true, sortable: true, width:100
        },
        {
            field: "FlownDestination", title: "Flown Destination", filterable: true, sortable: true, width: 100
        },
        {
            field: "FlownPieces", title: "Flown Pieces", filterable: true, sortable: true, width: 90
        },
        {
            field: "FlownGrossWeight", title: "Flown Gross Weight", filterable: true, sortable: true, width: 100
        },
        {
            field: "FlownVolumeWeight", title: "Flown Volume Weight ", filterable: true, sortable: true, width: 100
        },
        {
            field: "Status", title: "Status", filterable: true, sortable: true, width: 75, template: "# if( Status=='ONTIME') {#<span style='color:green'>#=Status#<span/>#} else if(Status=='INTIME') {#<span style='color:blue'>#=Status#<span/> #} else if(Status=='DELAY') {#<span style='color:red'>#=Status#<span/> #}else {#<span>#=Status#<span/> #}#", width: "80px"
        }
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
var Model = [];
function Search() {
    Model =
       {
           Airline: $('#AirlineSNo').val(),
           Origin: $('#Origin').val(),
           Destination: $('#Destination').val(),
           AWBNo: $('#AWBNo').val(),
           FromDate: $('#FromDate').val(),
           ToDate: $('#ToDate').val(),


       };
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
    

};

function SetColor(obj,Text)
{


}