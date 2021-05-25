var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "ReservationVSCRAComparision_CarrierCode", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "ReservationVsCRA_GetAWBNo", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);



    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $('#SumResAndCRA').hide();
    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }


    });

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "") {
        $("#AirlineSNo").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }
    var TotalCount = [];



    $('#exportflight1').hide();
    $('#imgexcel').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../ReservationVSCRAComparision/ReservationVSCRAComparisionGetRecord",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:function GetReportData() {
                        AirlineSNo = $('#AirlineSNo').val();
                        FromDate = $("#FromDate").val();
                        ToDate = $("#ToDate").val();
                        ReportType = $('input[type="radio"][name=Filter]:checked').val();
                        AWBNo = $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val();
                        IsAutoProcess = 1;
                        return { AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, ReportType: ReportType, AWBNo: AWBNo, IsAutoProcess: IsAutoProcess };
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
                        ////ResAWBTransfer,ResPOSTransfer,ResAWBNotTransfer,ResPOSNotTransfer,
                        ////CRAAWBTransfer,CRAPOSTransfer
                        SNo: { type: "number" },
                        ResAWBTransfer: { type: "string" },
                        ResPOSTransfer: { type: "string" },
                        ResCCATransfer: { type: "string" },
                        ResAWBNotTransfer: { type: "string" },
                        ResPOSNotTransfer: { type: "string" },
                        ResCCANotTransfer: { type: "string" },
                        ResAWBFailed: { type: "string" },
                        ResPOSFailed: { type: "string" },
                        CRAAWBTransfer: { type: "string" },
                        CRAPOSTransfer: { type: "string" }
                    }
                }, data: function (data) {
                    //TotalCount = "5";
                    $('#RESTransfer').text(data.Data[0].TotalRESTransfer)
                    $('#RESNotTransfer').text(data.Data[0].TotalRESNotTransfer)
                    $('#RESFailed').text(data.Data[0].TotalRESFailed)
                    $('#CCATransfer').text(data.Data[0].TotalCRATransfer)
                    return data.Data;
                },
            },

        }),

        //detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        //height: 450,
        columns: [

            {
                headerTemplate: "<div style='text-align: center;font-weight: bold'>Reservation</div>",
                columns: [
                        {
                            headerTemplate: "<div id='ResDivTransfer' style='text-align: center;font-weight: bold'>Transfer</div>",
                            columns: [
                                { field: "ResAWBTransfer", headerTemplate: "<span style='font-weight: bold'>AWB</span>", width: 70, template: "<a id='ResAWBTransfer' href='\\\#' class='name-link' onclick='ShowDetails(\"ResAWBTransfer\")'>#= ResAWBTransfer #</a>" },
                               { field: "ResPOSTransfer", headerTemplate: "<span style='font-weight: bold'>POS</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResPOSTransfer\")'>#= ResPOSTransfer #</a>" },
                               { field: "ResCCATransfer", headerTemplate: "<span style='font-weight: bold'>CCA</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResCCATransfer\")'>#= ResCCATransfer #</a>" },
                            ]
                        },
                        {
                            headerTemplate: "<div id='ResDivNotTransfer' style='text-align: center;font-weight: bold'>Not Transfer</div>",
                            columns: [
                                { field: "ResAWBNotTransfer", headerTemplate: "<span style='font-weight: bold'>AWB</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResAWBNotTransfer\")'>#= ResAWBNotTransfer #</a>" },
                               { field: "ResPOSNotTransfer", headerTemplate: "<span style='font-weight: bold'>POS</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResPOSNotTransfer\")'>#= ResPOSNotTransfer #</a>" },
                                 { field: "ResCCANotTransfer", headerTemplate: "<span style='font-weight: bold'>CCA</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResCCANotTransfer\")'>#= ResCCANotTransfer #</a>" },
                            ]
                        },
                         {
                             headerTemplate: "<div id='ResDivFailed' style='text-align: center;font-weight: bold'>Failed</div>",
                             columns: [
                                 { field: "ResAWBFailed", headerTemplate: "<span style='font-weight: bold'>AWB</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResAWBFailed\")'>#= ResAWBFailed #</a>" },
                                { field: "ResPOSFailed", headerTemplate: "<span style='font-weight: bold'>POS</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"ResPOSFailed\")'>#= ResPOSFailed #</a>" },
                             ]
                         },

                ]
            },

            {
                headerTemplate: "<div style='text-align: center;font-weight: bold'>CRA</div>",
                columns: [
                        {
                            headerTemplate: "<div id='ResDivCRATransfer'  style='text-align: center;color: Green;font-weight: bold'>Transfer</div>",
                            columns: [
                                { field: "CRAAWBTransfer", headerTemplate: "<span style='font-weight: bold'>AWB</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"CRAAWBTransfer\")'>#= CRAAWBTransfer #</a>" },
                               { field: "CRAPOSTransfer", headerTemplate: "<span style='font-weight: bold'>POS</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"CRAPOSTransfer\")'>#= CRAPOSTransfer #</a>" },
                               { field: "CRACCATransfer", headerTemplate: "<span style='font-weight: bold'>CCA</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"CRACCATransfer\")'>#= CRACCATransfer #</a>" },
                            ]
                        },
                ]
            },

        ]
    });

    //---------------------------AWB Show Details ----------------------
    $('#AWBDetailgrid').css('display', 'none')
    $("#AWBDetailgrid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../ReservationVSCRAComparision/ShowAWBDetails",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:function GetReportData() {
                        AirlineSNo = $('#AirlineSNo').val();
                        FromDate = $("#FromDate").val();
                        ToDate = $("#ToDate").val();
                        ReportType = $('input[type="radio"][name=Filter]:checked').val();
                        KeyColumn = TextKeyColumn;
                        AWBNo = $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val();
                        IsAutoProcess = 1;
                        return { AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, ReportType: ReportType, KeyColumn: KeyColumn, AWBNo: AWBNo, IsAutoProcess: IsAutoProcess };
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
                        ////ResAWBTransfer,ResPOSTransfer,ResAWBNotTransfer,ResPOSNotTransfer,
                        ////CRAAWBTransfer,CRAPOSTransfer
                        SNo: { type: "number" },
                        AWBNo: { type: "string" },
                        TotalPieces: { type: "string" },
                        TotalGrossWeight: { type: "string" },
                        TotalCBM: { type: "string" },
                        TotalChargeableWeight: { type: "string" }
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

            { field: "AWBNo", title: "AWBNo" },
              { field: "TotalPieces", title: "TotalPieces" },
                { field: "TotalGrossWeight", title: "TotalGrossWeight" },
                  { field: "TotalCBM", title: "TotalCBM" },
                    { field: "TotalChargeableWeight", title: "TotalChargeableWeight" },
        ]
    });


});




//var AirlineSNo = "";
//var FromDate = "";
//var ToDate = "";
//var ReportType = "";
//var TextKeyColumn = "";
//var AWBNo = "";
var Model = [];
function SearchReservationVSCRAComparision() {

    Model = {
        AirlineSNo: $('#AirlineSNo').val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        ReportType: $('input[type="radio"][name=Filter]:checked').val(),
        AWBNo: $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)


    };

    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        //alert('From Date can not be greater than To Date');
        return false;;
    }

    AirlineSNo = $('#AirlineSNo').val();
    if (AirlineSNo != "" && $('#ToDate').val() != "" && $('#FromDate').val() != "") {

        if (OnBlob) {
            $.ajax({
                url: "../Reports/ReservationVSCRA",
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
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
            $('#imgexcel').show();
            $('#ResDivTransfer').closest('th').css("background-color", "lightgreen");
            $('#ResDivNotTransfer').closest('th').css("background-color", "lightcoral");
            $('#ResDivFailed').closest('th').css("background-color", "yellowgreen");
            $('#ResDivCRATransfer').closest('th').css("background-color", "lightsalmon");
            $('table tr th[data-field="ResAWBTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResPOSTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResCCATransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResAWBNotTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResPOSNotTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResCCANotTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResAWBFailed"] a').css("background-color", "lightgray");
            $('table tr th[data-field="ResPOSFailed"] a').css("background-color", "lightgray");
            $('table tr th[data-field="CRAAWBTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="CRAPOSTransfer"] a').css("background-color", "lightgray");
            $('table tr th[data-field="CRACCATransfer"] a').css("background-color", "lightgray");
            $('#ResAWBTransfer').closest('tr').css('text-align', 'center')
            $('#SumResAndCRA').show();


        }
    }

}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}


function ExportToExcel_GetAWBDetails() {

    AirlineSNo = $('#AirlineSNo').val();
    FromDate = $("#FromDate").val();
    ToDate = $("#ToDate").val();
    ReportType = $('input[type="radio"][name=Filter]:checked').val();
    KeyColumn = TextKeyColumn;
    IsAutoProcess = 1;
    //AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, ReportType: ReportType, KeyColumn: KeyColumn
    if (AirlineSNo != "" && FromDate != "" && ToDate != "") {
        window.location.href = "../ReservationVSCRAComparision/ExportToExcel?AirlineSNo=" + AirlineSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&ReportType=" + ReportType + "&KeyColumn=" + KeyColumn + "&IsAutoProcess=" + IsAutoProcess;

    }

}




function ShowDetails(TextColumn) {
    TextKeyColumn = TextColumn;

    $('#AWBDetailgrid').css('display', '')
    $("#AWBDetailgrid").data('kendoGrid').dataSource.page(1);







    //$("#DivAWBDeatils").html('');
    //$("#DivAWBDeatils").append($("#AWBDetailgrid").html());

    if (!$("#DivAWBDeatils").data("kendoWindow")) {
        $('#exportflight1').show();
        cfi.PopUpCreate("DivAWBDeatils", "AWB Details", 800);
    } else {

        var win = $("#DivAWBDeatils").data("kendoWindow");
        win.open();
    }


}