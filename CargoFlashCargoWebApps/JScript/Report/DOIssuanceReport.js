$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "DOIssuance_Report_Airline", null, "contains");
    //cfi.AutoCompleteV2("AWBNo", "AWBNo", "DeliveryOrder_GridAWBNo", null, "contains");
    ////cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    //cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("OriginCode", "AirportCode,AirportName", "DOIssuance_Report", null, "contains");
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
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../DOIssuanceReport/DOIssuanceReportGetRecord",
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
                        ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn
                        //SNo: { type: "number" },
                        //Org: { type: "string" },
                        //Dest: { type: "string" },
                        DONo: { type: "string" },
                        MAWBNo: { type: "string" },
                        HAWBNo: { type: "string" },
                        Pcs: { type: "string" },
                        GWt: { type: "string" },
                        Origin:{type:"Origin"},
                        CreatedBy: { type: "string" },
                        CreatedOn: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
           ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn
            // { field: "SNo", title: "SNo" },
            //   { field: "Org", title: "Org"},
            //{ field: "Dest", title: "Dest" },
            { field: "DONo", title: "DO No"},
            { field: "MAWBNo", title: "AWB No" },
            { field: "HAWBNo", title: "HAWB No" },
            { field: "Pcs", title: "Pcs." },
            { field: "GWt", title: "Gr Wt." },
            { field: "Origin", title: "Origin" },
            { field: "CreatedBy", title: "Created By." },
            { field: "CreatedOn", title: "Created On" }

        ]
    });
});
var Model = [];
function SearchDOIssuanceReport() {
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            //FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
            //OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
            OriginCode: $('#OriginCode').val() == "" ? "0" : $('#OriginCode').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            //AWBNo: $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val()
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode != "0" && Model.OriginCode != "0" && Model.ToDate != "" && Model.FromDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
    }
}



function ExtraCondition(textId) {
    //var filterAirline = cfi.getFilter("AND");
    //if (textId == "Text_AirlineCode") {
    //    cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //    return OriginCityAutoCompleteFilter2;
    //}
    //else if (textId == "Text_DestinationSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    //}

    //else if (textId == "Text_OriginSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    //}
    ////else if (textId == "Text_FlightNo") {
    ////    if ($('#Text_OriginSNo').val() != '')
    ////        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
    ////    if ($('#Text_DestinationSNo').val() != '')
    ////        cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

    //    cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());

    //    var RT_Filter = cfi.autoCompleteFilter(filterAirline);
    //    return RT_Filter;
    //}
}



function ExportExcelHoldType() {
    var AirlineCode = $('#AirlineCode').val();
    //var FlightNo = $('#FlightNo').val() == "" ? "0" : $("#FlightNo").val();
    //var OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    var OriginCode = $('#OriginCode').val() == "" ? "0" : $('#OriginCode').val();
    //var AWBNo = $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    window.location.href = "../DOIssuanceReport/ExportToExcel?AirlineCode=" + AirlineCode + "&OriginCode=" + OriginCode + "&FromDate=" + FromDate + "&ToDate=" + ToDate;
}

