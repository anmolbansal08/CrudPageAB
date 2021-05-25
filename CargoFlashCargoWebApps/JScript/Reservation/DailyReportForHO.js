


$(document).ready(function () {
	cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "DailySalesReport_Airline", null, "contains");
	cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "Reservation_Airport", null, "contains");
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

    if (userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN" && userContext.GroupName != "ADMIN1") {
		$("#Airport").val(userContext.AirportSNo);
		$("#Text_Airport_input").val(userContext.AirportCode + '-' + userContext.AirportName);
		cfi.EnableAutoComplete('Airport', false, true, null);//diasble
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
                    url: "../DailyReportForHO/DailyReportForHOGetRecord",
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
                        Date: { type: "string" },
                        Org: { type: "string" },
                        Dest: { type: "string" },
                        Pcs: { type: "string" },
                        GrossWeight: { type: "string" },
                        ChargeableWeight: { type: "string" }

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
            { field: "Date", title: "Date" },
            { field: "Org", title: "Org" },
            { field: "Dest", title: "Dest" },
            { field: "Pcs", title: "Pcs" },
            { field: "GrossWeight", title: "Gr. Wt." },
            { field: "ChargeableWeight", title: "Ch. Wt." }
        ]
    });

});


var Model = [];


function SearchDailyReportForHO() {
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            FromDate: $("#FromDate").val(),
			ToDate: $("#ToDate").val(),
			Airport: $('#Airport').val() || 0
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Daily Report', "From Date can not be greater than To Date !");
        return false;;
    }




    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);

        $('#exportflight').show();

        SumOfCharges();
        $('#tblSUMOfCharges').show();

        $('#df #AirlineCode').val(Model.AirlineCode);
        $('#df #FromDate').val(Model.FromDate);
		$('#df #ToDate').val(Model.ToDate);
		$('#df #Airport').val(Model.Airport);
    }
}

function SumOfCharges() {
    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {
        $.ajax({
            url: '../StationWiseSummary/GetSumofCharges',
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                if (result != undefined && result.Data.length > 0) {
                    $('#lblGrWt').html(result.Data[0].SumOfGrossWeight);
                    $('#lblChWt').html(result.Data[0].SumOfChargeableWeight);
                }
                else {
                    $('#lblGrWt').html(0);
                    $('#lblChWt').html(0);
                }
            }
        });
    }
}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}

