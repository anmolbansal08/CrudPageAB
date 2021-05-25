

$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "BookingReport_Airline", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Accelaero_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "AirportCode,CityName", "Billing_report", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,CityName", "Billing_report", null, "contains");
    cfi.AutoCompleteV2("Agent", "AgentName", "DirectPayment_AgentName", null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "CCA_ProductName", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "BookingReport_Commodity", null, "contains");
    cfi.AutoCompleteV2("SHC", "SNo,Code", "Embargo_Code", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "FlightSummary_FlightNo", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "FWBImport_searchAWBNo", null, "contains");
    cfi.AutoCompleteV2("aircraft", "AircraftType", "ViewNEditFlight_AircraftType", null, "contains");
    cfi.DateType("BookingDate");
    cfi.DateType("FlightDate");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#BookingDate').attr('readonly', true);
    $('#FlightDate').attr('readonly', true);

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $("#FromDate").change(function () {
        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());

        if ($("#ToDate").val() < $("#FromDate").val())
            $("#ToDate").data("kendoDatePicker").value('');
    });
    $("#Flight_Date").click(function () {
        $("#Flight_Date").val('1');
        $("#Booking_Date").val('0');
    });
    $("#Booking_Date").click(function () {
        $("#Booking_Date").val('1');
        $("#Flight_Date").val('0');
    });
    //$('#FromDate').css('width', '150px');
    //    //$('.k-datepicker').css('width', '150px');
    //    $("#FlightDate").data("kendoDatePicker").min($("#BookingDate").val());

    //    if ($("#FlightDate").val() < $("#BookingDate").val())
    //        $("#FlightDate").data("kendoDatePicker").value('');
    // });

    //$('input[name=Booking_Date]').click(function () {
    //    $('input[name=Flight_Date]').attr('disabled', true);
    //});
    //$('input[name=Flight_Date]').click(function () {
    //    $('input[name=Flight_Date]').attr('disabled', true);
    //});
});
$('#grid').css('display', 'none')
$("#grid").kendoGrid({
    autoBind: false,
    //toolbar: ["pdf"],
    //pdf: {
    //    fileName: "Kendo UI Grid Export.pdf"
    //    },
    //dataSource: new kendo.data.DataSource({
    dataSource: new kendo.data.DataSource({
        type: "json",
        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
        transport: {
            read: {
                url: "../Reports/GetBillingDetail",
                dataType: "json",
                global: true,
                type: 'POST',
                method: 'POST',
                contentType: "application/json; charset=utf-8",
                data:
                    function GetFlightDetail() {
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
                      FlightDate: { type: "string" },
                      Flightno: { type: "string" },
                      FlightRoute: { type: "string" },
                      Code: { type: "Code" },
                      Aircraft: { type: "string" },
                      Mawb: { type: "Mawb" },
                      Shipper: { type: "Shipper" },
                      Cnee: { type: "Cnee" },
                      AgentorCustomer: { type: "AgentorCustomer" },
                      Commodity: { type: "Commodity" },
                      Origin: { type: "Origin" },
                      Destination: { type: "Destination" },
                      Pcs: { type: "Pcs" },
                      Cargo_Dimensions: { type: "Cargo_Dimensions" },
                      Length: { type: "Length" },
                      Width: { type: "Width" },
                      Height: { type: "Height" },
                      Actual_Weight: { type: "Actual_Weight" },
                      Chargeable_Weight: { type: "Chargeable_Weight" },
                      Remarks: { type: "Remarks" },
                      Cass: { type: "Cass" },
                      Rating: { type: "Rating" },
                      Airfreight_Rate: { type: "Airfreight_Rate" },
                      Total_Airfreight: { type: "Total_Airfreight" },
                      Block_Space: { type: "Block_Space" },
                      FSC_Rate: { type: "FSC_Rate" },
                      FSC_Total: { type: "FSC_Total" },
                      OVS_Rate: { type: "OVS_Rate" },
                      OVS_Total: { type: "OVS_Total" },
                      TC_RateOrigin: { type: "TC_RateOrigin" },
                      TC_RateDest: { type: "TC_RateDest" },
                      Tc_Total: { type: "Tc_Total" },
                      Secuirty: { type: "Secuirty" },
                      Custom_Clr: { type: "Custom_Clr" },
                      AWB_Cutting: { type: "AWB_Cutting" },
                      AWB_Fees: { type: "AWB_Fees" },
                      EDI_Fees: { type: "EDI_Fees" },
                      DGR_Fees: { type: "DGR_Fees" },
                      Secuirty_Surcharge: { type: "Secuirty_Surcharge" },
                      Trucking_Fees: { type: "Trucking_Fees" },
                      Other_Fees: { type: "Other_Fees" },
                      Total_GST: { type: "Total_GST" },
                      GST_Summary: { type: "GST_Summary" },
                      GST_6: { type: "GST_6" },
                      Total_Billing: { type: "Total_Billing" },
                      InvoiceNo: { type: "InvoiceNo" },
                      Payment: { type: "Payment" },
                      Trucking_Cost: { type: "Trucking_Cost" },
                      Third_Party: { type: "Third_Party" },
                      Other_Cost: { type: "Other_Cost" }


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
           field: "FlightDate", title: "FlightDate", filterable: true, sortable: true, width: 70, lockable: false,
       },
        {
            field: "Flightno", title: "FlightNo", filterable: true, sortable: true, width: 60,
        },
        {
            field: "Flightroute", title: "FlightRoute", filterable: true, sortable: true, width: 70
        },
        {
            field: "Code", title: "Code", filterable: true, sortable: true, width: 60
        },
        {
            field: "Aircraft", title: "Aircraft", filterable: true, sortable: true, width: 60
        },
        {
            field: "Mawb", title: "Mawb", filterable: true, sortable: true, width: 75
        },
        {
            field: "Shipper", title: "Shipper", filterable: true, sortable: true, width: 75
        },
         {
             field: "Cnee", title: "Cnee", filterable: true, sortable: true, width: 75
         },
        {
            field: "AgentorCustomer", title: "Agent/Customer", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Agent OR Customer">Agent/Customer</span>'
        },
        {
            field: "Commodity", title: "Commodity", filterable: true, sortable: true, width: 75
        },
         {
             field: "Origin", title: "Origin", filterable: true, sortable: true, width: 70
         },
        {
            field: "Destination", title: "Destination", filterable: true, sortable: true, width: 70
        },
        {
            field: "Pcs", title: "Pcs", filterable: true, sortable: true, width: 40,
        },
        {
            field: "Cargo_Dimensions", title: "Cargo Dimensions", filterable: true, sortable: true, width: 120
            //,template:'<a href="" onclick="showName();">'# if( Cargo_Dimensions==null) {#<span>show xxx<span># } else {#<span>#: Cargo_Dimensions#<span>#} #'</a>'//,headerTemplate: '<span title="Cargo Dimensions">Cargo_Dimensions</span>'
        },
        {
            field: "Actual_Weight", title: "Actual Weight", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Actual Weight">Actual Weight</span>'
        },
        {
            field: "Chargeable_Weight", title: "Chargeable Weight", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Chargeable Weight">Chargeable_Weight</span>'
        },
        {
            field: "Remarks", title: "Remarks", filterable: true, sortable: true, width: 75
        },
        {
            field: "Cass", title: "Cass ", filterable: true, sortable: true, width: 75
        },
        {
            field: "Rating", title: "Rating", filterable: true, sortable: true, width: 75
        },
        {
            field: "Airfreight_Rate", title: "Airfreight Rate", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Airfreight Rate">Airfreight_Rate</span>'
        },
        {
            field: "Total_Airfreight", title: "Total Airfreight", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Total Airfreight">Total_Airfreight</span>'
        },
        {
            field: "Block_Space", title: "Block Space", filterable: true, sortable: true, width: 75
        },
        {
            field: "FSC_Rate", title: "Fsc Rate", filterable: true, sortable: true, width: 75
        },
        {
            field: "FSC_Total", title: "Fsc Total", filterable: true, sortable: true, width: 75
        },
        {
            field: "OVS_Rate", title: "Ovs Rate", filterable: true, sortable: true, width: 75
        },
        {
            field: "OVS_Total", title: "Ovs Total", filterable: true, sortable: true, width: 75
        },
        {
            field: "TC_RateOrigin", title: "Tc-RateOrigin", filterable: true, sortable: true, width: 75
        },
        {
            field: "TC_RateDest", title: "Tc-RateDest.", filterable: true, sortable: true, width: 75
        },
        {
            field: "Tc_Total", title: "Tc total", filterable: true, sortable: true, width: 75
        },
        {
            field: "Secuirty", title: "Secuirty screening", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Secuirty Screening">Secuirty</span>'
        },
        //{
        //    field: "total_secuirty", title: "total secuirty screening", filterable: true, sortable: true, width: 75
        //},
        {
            field: "Custom_Clr", title: "Custom Clr", filterable: true, sortable: true, width: 75
        },
        {
            field: "AWB_Cutting ", title: "Awb Cutting", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="AWB Cutting">AWB_Cutting</span>'
        },
        {
            field: "AWB_Fees", title: "Awb Fees", filterable: true, sortable: true, width: 75
        },
        {
            field: "EDI_Fees", title: "EDI FEES", filterable: true, sortable: true, width: 75
        },
        {
            field: "DGR_Fees", title: "DGR FEES", filterable: true, sortable: true, width: 75
        },
        {
            field: "Secuirty_Surcharge", title: "SECUIRTY SURCHARGE", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Secuirty Surcharge">Secuirty_Surcharge</span>'
        },
        {
            field: "Trucking_Fees", title: "TRUCKING FEES", filterable: true, sortable: true, width: 75
        },
        {
            field: "Other_Fees", title: "OTHER FEES", filterable: true, sortable: true, width: 75
        },
        {
            field: "Total_GST", title: "TOTAL(EXCLUDING GST)", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Total(EXCLUDING GST)">Total_GST</span>'
        },
        {
            field: "GST_Summary", title: "GST SUMMARY STANDARD RATED", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="GST Summary Standard Rated">GST_Summary</span>'
        },
        {
            field: "GST_6", title: "GST 6%", filterable: true, sortable: true, width: 75
        },
        {
            field: "Total_Billing", title: "TOTAL BILLING", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Total Billing">Total_Billing</span>'
        },
        {
            field: "InvoiceNo", title: "INVOICE NO.", filterable: true, sortable: true, width: 75
        },
        {
            field: "Payment", title: "PAYMENT", filterable: true, sortable: true, width: 75
        },
        {
            field: "Trucking_Cost", title: "TRUCKING COST", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="Trucking Cost">Trucking_Cost</span>'
        },
        {
            field: "Third_Party", title: "3RD PARTY SPACE COST ", filterable: true, sortable: true, width: 75, headerTemplate: '<span title="3RD PARTY SPACE COST">Third_Party</span>'
        },
        {
            field: "Other_Cost", title: "Other Cost", filterable: true, sortable: true, width: 70
        }

    ]
});
//});

var Model = [];
function Search() {
    Model =
       {
           Airline: $('#AirlineCode').val(),
           BookingDate: $('#Booking_Date').val() == "" ? "0" : $('#Booking_Date').val(),
           FlightDate: $('#Flight_Date').val() == "" ? "0" : $('#Flight_Date').val(),
           Product: $('#Product_input').val() == "" ? "0" : $('#Text_Product_input').val(),
           Origin: $('#Origin').val(),
           Destination: $('#Destination').val(),
           Aircraft: $('#aircraft').val(),
           Agent: $('#Agent').val(),
           Commodity: ($('#Text_Commodity_input').val()).slice(5),
           SHC: $('#Text_SHC_input').val(),
           AWBNo: $('#AWBNo').val(),
           FlightNo: $('#FlightNo').val(),
           FromDate: $('#FromDate').val(),
           ToDate: $('#ToDate').val(),


       };

    if ($('#Text_AirlineCode').val() != "" && $("input[name$='date']:checked").val()) {
        $('#grid').css('display', '')
        // ShowLoader(true);
        $("#grid").data('kendoGrid').dataSource.page(1);
    }

};

function ExportToExcel() {

    Model.Airline = $('#AirlineCode').val();
    Model.BookingDate = $('#Booking_Date').val();
    Model.FlightDate = $('#Flight_Date').val();
    Model.Product = $('#Text_Product_input').val();
    Model.Origin = $('#Origin').val();
    Model.Destination = $('#Destination').val();
    Model.Aircraft = $('#aircraft').val();
    Model.Agent = $('#Agent').val();
    Model.Commodity = ($('#Text_Commodity_input').val()).slice(5),
    Model.SHC = $('#Text_SHC_input').val();
    Model.AWBNo = $('#Text_AWBNumber_input').val();
    Model.FlightNo = $('#Text_FlightNo_input').val();
    Model.FromDate = $('#FromDate').val();
    Model.ToDate = $('#ToDate').val();
    window.location.href = "../Reports/ExportToExcel?Airline=" + Model.Airline + "&BookingDate=" + Model.BookingDate + "&FlightDate=" + Model.FlightDate +
     "&Product=" + Model.Product + "&FromDate=" + Model.FromDate + "&ToDate=" + Model.ToDate + "&Origin=" + Model.Origin + "&Destination=" + Model.Destination;
    // + "&Aircraft=" + Model.Aircraft + "&Agent=" + Model.Agent + "&Commodity=" + Model.Commodity + "&SHC=" + Model.SHC + "&AWBNo=" + Model.AWBNo + "&FlightNo=" + Model.FlightNo ;

};
//function Generate_PDF() {

//    Model.Airline = $('#Airline').val();
//    Model.BookingDate = $('#Booking_Date').val();
//    Model.FlightDate = $('#Flight_Date').val();
//    Model.Product = $('#Text_Product_input').val();
//    Model.Origin = $('#Origin').val();
//    Model.Destination = $('#Destination').val();
//    Model.Aircraft = $('#aircraft').val();
//    Model.Agent = $('#Agent').val();
//    Model.Commodity = ($('#Text_Commodity_input').val()).slice(5),
//    Model.SHC = $('#Text_SHC_input').val();
//    Model.AWBNo = $('#Text_AWBNumber_input').val();
//    Model.FlightNo = $('#Text_FlightNo_input').val();
//    Model.FromDate = $('#FromDate').val();
//    Model.ToDate = $('#ToDate').val();
//    window.location.href = "../Reports/Generate_PDF?Airline=" + Model.Airline + "&BookingDate=" + Model.BookingDate + "&FlightDate=" + Model.FlightDate +
//     "&Product=" + Model.Product + "&Origin=" + Model.Origin + "&Destination=" + Model.Destination + "&Aircraft=" + Model.Aircraft + "&Agent=" + Model.Agent + "&Commodity=" + Model.Commodity + "&SHC=" + Model.SHC + "&AWBNo=" + Model.AWBNo + "&FlightNo=" + Model.FlightNo + "&FromDate=" + Model.FromDate + "&ToDate=" + Model.ToDate;

//};

function ExtraCondition(textId) {

    var filter = cfi.getFilter("AND");
    if (textId == "Text_AWBNo") {
        cfi.setFilter(filter, "AWBPrefix", "eq", $('#AirlineCode').val());
        return cfi.autoCompleteFilter(filter);
    }
    else if (textId == "Text_FlightNo") {
        cfi.setFilter(filter, "AirlineCode", "eq", $('#AirlineCode').val());
        return cfi.autoCompleteFilter(filter);
    }
}
function ExtraParameters(textId) {
    var param = [];
    //if (textId == "Text_AWBSNo") {

    //    var UserSNo = userContext.UserSNo;
    //    param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
    //    param.push({ ParameterName: "AccountSno", ParameterValue: $('#Agent').val() });
    //    param.push({ ParameterName: "CitySNo", ParameterValue: $("#City").val() });
    //    param.push({ ParameterName: "AirlineSno", ParameterValue: $("#AirlineSNo").val() });

    //    return param;
    //}
    if (textId == "Text_AirlineCode") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}

