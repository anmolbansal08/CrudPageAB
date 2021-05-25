
var OnBlob = false;
var GtDays = false;


$(document).ready(function () {

    ClickOnBlob();

    

    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "FprLionReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingVarianceReport_AWB", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
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
    $('#grid').css('display', 'none')
    

});


var Model = [];


function SearchFPRReport() {
    var startDate = new Date($("#FromDate").data("kendoDatePicker").value());
    startDate = new Date(startDate.setHours(0, 0, 0, 0));
    var endDate = new Date($("#ToDate").data("kendoDatePicker").value());
    endDate = new Date(endDate.setHours(0, 0, 0, 0));

    var day = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);
    if (day < 7) {
        GtDays = false;
    }
    else {
        GtDays = true;
        $('#grid').css('display', 'none');
        $('#exportflight').hide();
    }
    Model =
    {
        AirlineCode: $('#AirlineCode').val(),
        FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
        OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
        DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        AWBNo: $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val(),
        IsAutoProcess: (OnBlob == true && GtDays == true ? 0 : 1),
        pageSize: 100000
    };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - FMR Daily Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {

        if (OnBlob && GtDays) {
            $.ajax({
                url: "../Reports/FMRDailyReport",
                async: true,
                type: "GET",
                dataType: "json",
                data: Model,
                success: function (result) {

                    var data = result.Table0[0].ErrorMessage.split('~');

                    if (parseInt(data[0]) == 0)
                        ShowMessage('success', 'Reports!', data[1]);
                    else
                        ShowMessage('warning', 'Reports!', data[1]);
                }
            });
        }


        else {
            $("#grid").kendoGrid({
                autoBind: false,
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
                    transport: {
                        read: {
                            url: "../FMRDailyReport/FMRDailyReportGetRecord",
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
                               
                                SNo: { type: "number" },
                                AWBNo: { type: "string" },
                                Origin: { type: "string" },
                                Destination: { type: "string" },
                                OriginAirportCode: { type: "string" },
                                DestinationAirportCode: { type: "string" },
                                AWBDate: { type: "string" },
                                PlaceOfAWB: { type: "string" },
                                AgentName: { type: "string" },
                                AgentCode: { type: "string" },
                                FlightNo: { type: "string" },
                                Charter: { type: "string" },
                                AirlineCode: { type: "string" },
                                FlightDate: { type: "string" },
                                ETD: { type: "string" },
                                ETA: { type: "string" },
                                AircraftType: { type: "string" },
                                RegistrationNo: { type: "string" },
                                FreightType: { type: "string" },
                                Pieces: { type: "string" },
                                GrossWeight: { type: "string" },
                                ChargeableWeight: { type: "string" },
                                TotalDistance: { type: "string" },
                                SectorDistance: { type: "string" },
                                TariffRate: { type: "string" },
                                ProductName: { type: "string" },
                                Commodity: { type: "string" },
                                NatureofGoods: { type: "string" },
                                FlightType: { type: "string" },
                                WeightCharge: { type: "string" },
                                ValuationCharge: { type: "string" },
                                OtherCharges: { type: "string" },
                                SurchargeName: { type: "string" },
                                SurchargeValue: { type: "string" },
                                Tax: { type: "string" },
                                TotalPrepaid: { type: "string" },
                                Part: { type: "string" }
                            }
                        }, data: function (data) {
                            ShowLoader(false);
                            if (data.Data[0] != undefined && data.Data[0].Part.length > 5) {
                                ShowMessage('warning', 'Warning - FMR', 'FMR report can be generated for a period of 7 days maximum.');
                                return;
                            }
                            return data.Data;
                        }, total: function (data) { return data.Total; }
                    },

                }),
                sortable: true, filterable: false,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                scrollable: true,
                columns: [
                   
                    { field: "SNo", title: "SNo", width: 90 },
                    { field: "AWBNo", title: "AWB No", width: 90 },
                    { field: "Origin", title: "Origin", width: 90 },
                    { field: "Destination", title: "Destination", width: 90 },
                    { field: "OriginAirportCode", title: "Origin AirportCode", width: 90 },
                    { field: "DestinationAirportCode", title: "Destination AirportCode", width: 90 },
                    { field: "AWBDate", title: "AWB Date", width: 90 },
                    { field: "PlaceOfAWB", title: "Place Of AWB", width: 90 },
                    { field: "AgentName", title: "Agent Name", width: 130 },
                    { field: "AgentCode", title: "Agent Code", width: 110 },
                    { field: "FlightNo", title: "Flight No", width: 90 },
                    { field: "Charter", title: "Charter", width: 90 },
                    { field: "AirlineCode", title: "Airline Code", width: 90 },
                    { field: "FlightDate", title: "Flight Date", width: 90 },
                    { field: "ETD", title: "ETD", width: 50 },
                    { field: "ETA", title: "ETA", width: 50 },
                    { field: "AircraftType", title: "Aircraft Type", width: 90 },
                    { field: "RegistrationNo", title: "Registration No", width: 90 },
                    { field: "FreightType", title: "Freight Type", width: 90 },
                    { field: "Pieces", title: "Pieces", width: 90 },
                    { field: "GrossWeight", title: "Gross Weight", width: 90 },
                    { field: "ChargeableWeight", title: "Chargeable Weight", width: 110 },

                    { field: "TotalDistance", title: "Total Sector Distance ", width: 110 },
                    { field: "SectorDistance", title: "Sector Distance", width: 110 },
                    { field: "TariffRate", title: "Tariff Rate", width: 90 },
                    { field: "ProductName", title: "Product Name", width: 90 },
                    { field: "Commodity", title: "Commodity", width: 130 },
                    { field: "NatureOfGoods", title: "Nature of Goods", width: 130 },
                    { field: "FlightType", title: "Flight Type", width: 90 },
                    { field: "WeightCharge", title: "Weight Charge", width: 110 },
                    { field: "ValuationCharge", title: "Valuation Charge", width: 110 },
                    { field: "OtherCharges", title: "Other Charges", width: 110 },
                    { field: "SurchargeName", title: "Surcharge Name", width: 110 },
                    { field: "SurchargeValue", title: "Surcharge Value", width: 110 },
                    { field: "Tax", title: "Tax", width: 90 },
                    { field: "TotalPrepaid", title: "Total Prepaid", width: 110 },
                    { field: "Part", title: "Part", width: 50 }
                ]
            });
            $('#grid').css('display', '');
            $('#exportflight').show();
            ShowLoader(true);
            $("#grid").data('kendoGrid').dataSource.page(1);
            //    

        }
    }

}


function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AirlineCode") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_DestinationSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_FlightNo") {
        if ($('#Text_OriginSNo').val() != '')
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
        if ($('#Text_DestinationSNo').val() != '')
            cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());

        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }
}



function ExportExcelHoldType() {
    var AirlineCode = $('#AirlineCode').val();
    var FlightNo = $('#FlightNo').val() == "" ? "0" : $("#FlightNo").val();
    var OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    var DestinationSNo = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
    var AWBNo = $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    window.location.href = "../FMRDailyReport/ExportToExcel?AirlineCode=" + AirlineCode + "&FlightNo=" + FlightNo + "&OriginSNo=" + OriginSNo + "&DestinationSNo=" + DestinationSNo + "&AWBNo=" + AWBNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&IsAutoProcess=1";
}

function ClickOnBlob() {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue('Apps').toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });
}
