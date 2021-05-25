﻿var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });


    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "PostFlightReport_Airline", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "PostFlightReport_AirportCity", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "PostFlightReport_AirportCity", null, "contains");
    cfi.AutoCompleteV2("FlightSNo", "FlightNo", "PostFlightReport_FlightNo", null, "contains");



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

    if (userContext.AirportSNo != "" && userContext.AirportCode != "" && userContext.AirportName != "") {
        $("#OriginSNo").val(userContext.AirportSNo);
        $("#Text_OriginSNo_input").val(userContext.AirportCode + '-' + userContext.AirportName);
    }

    $('#imgexcel').hide();
    
        $('#grid').css('display', 'none')
        //var dataSource = $("#grid").kendoGrid({
        //    autoBind: false,
        //    dataSource: new kendo.data.DataSource({
        //        type: "json",
        //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
        //        transport: {
        //            read: {
        //                url: "../PostFlightReport/PostFlightReportGetRecord",
        //                dataType: "json",
        //                global: false,
        //                type: 'POST',
        //                contentType: "application/json; charset=utf-8",
        //                data: function GetReportData() {
        //                    return { Model: Model };
        //                }

        //            }, parameterMap: function (options) {
        //                if (options.filter == undefined)
        //                    options.filter = null;
        //                if (options.sort == undefined)
        //                    options.sort = null; return JSON.stringify(options);
        //            },
        //        },
        //        schema: {
        //            model: {
        //                id: "SNo",
        //                fields: {
        //                    SNo: { type: "number" },
        //                    FlightNo: { type: "string" },
        //                    Date: { type: "string" },
        //                    Origin: { type: "string" },
        //                    Destination: { type: "string" },

        //                    AircraftType: { type: "string" },
        //                    CapacityGross: { type: "string" },
        //                    CapacityVol: { type: "string" },

        //                    BookedShpts: { type: "string" },
        //                    BookedPcs: { type: "string" },
        //                    BookedGrWt: { type: "string" },
        //                    BookedVol: { type: "string" },
        //                    BookedChWt: { type: "string" },
        //                    BookedFreight: { type: "string" },
        //                    BookedRevenue: { type: "string" },
        //                    BookedYield: { type: "string" },

        //                    ExecutedShpts: { type: "string" },
        //                    ExecutedPcs: { type: "string" },
        //                    ExecutedGrWt: { type: "string" },
        //                    ExecutedVol: { type: "string" },
        //                    ExecutedChWt: { type: "string" },
        //                    ExecutedFreight: { type: "string" },
        //                    ExecutedRevenue: { type: "string" },
        //                    ExecutedYield: { type: "string" },


        //                    UpliftedShpts: { type: "string" },
        //                    UpliftedPcs: { type: "string" },
        //                    UpliftedGrWt: { type: "string" },
        //                    UpliftedVol: { type: "string" },
        //                    UpliftedChWt: { type: "string" },
        //                    UpliftedFreight: { type: "string" },
        //                    UpliftedRevenue: { type: "string" },
        //                    UpliftedYield: { type: "string" }


        //                }
        //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
        //        },

        //    }),

        //    //detailInit: detailInit,
        //    //filterable: { mode: 'menu' },
        //    sortable: true, filterable: false,
        //    pageable: {
        //        refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
        //    },
        //    scrollable: true,

        //    //height: 450,
        //    columns: [

        //        { field: "FlightNo", title: "Flight No", filterable: true, width: 70 },
        //        { field: "Date", title: "Date", width: 70 },
        //        { field: "Origin", title: "Origin", width: 70 },
        //        { field: "Destination", title: "Destination", width: 70 },
        //        { field: "AircraftType", title: "Aircraft Type", width: 70 },

        //        {
        //            headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Capacity</div>",
        //            columns: [{ field: "CapacityGross", headerTemplate: "<span style='color: blue;font-weight: bold'>Gross</span>", width: 70 },
        //               { field: "CapacityVol", headerTemplate: "<span style='color: blue;font-weight: bold'>Vol.</span>", width: 70 }, ]
        //        },

        //         {
        //             headerTemplate: "<div style='text-align: center;color: Green;font-weight: bold'>Booked</div>",
        //             columns: [
        //                 { field: "BookedShpts", headerTemplate: "<span style='color: Green;font-weight: bold'>Shpts.</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"B\")'>#= BookedShpts #</a>" },
        //                { field: "BookedPcs", headerTemplate: "<span style='color: Green;font-weight: bold'>PCs.</span>", width: 70 },
        //                 { field: "BookedGrWt", headerTemplate: "<span style='color: Green;font-weight: bold'>GrWt.</span>", width: 70 },
        //                { field: "BookedVol", headerTemplate: "<span style='color: Green;font-weight: bold'>Vol.</span>", width: 70 },
        //                 { field: "BookedChWt", headerTemplate: "<span style='color: Green;font-weight: bold'>ChWt.</span>", width: 70 },
        //                { field: "BookedFreight", headerTemplate: "<span style='color: Green;font-weight: bold'>Freight</span>", width: 70 },
        //                 { field: "BookedRevenue", headerTemplate: "<span style='color: Green;font-weight: bold'>Revenue</span>", width: 70 },
        //                { field: "BookedYield", headerTemplate: "<span style='color: Green;font-weight: bold'>Yield.</span>", width: 70 },
        //             ]
        //         },

        //          {
        //              headerTemplate: "<div style='text-align: center;color: red;font-weight: bold'>Executed</div>",
        //              columns: [
        //                  { field: "ExecutedShpts", headerTemplate: "<span style='color: red;font-weight: bold'>Shpts.</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"E\")'>#= ExecutedShpts #</a>" },
        //                  { field: "ExecutedPcs", headerTemplate: "<span style='color: red;font-weight: bold'>PCs.</span>", width: 70 },
        //                 { field: "ExecutedGrWt", headerTemplate: "<span style='color: red;font-weight: bold'>GrWt.</span>", width: 70 },
        //                { field: "ExecutedVol", headerTemplate: "<span style='color: red;font-weight: bold'>Vol.</span>", width: 70 },
        //                 { field: "ExecutedChWt", headerTemplate: "<span style='color: red;font-weight: bold'>ChWt.</span>", width: 70 },
        //                { field: "ExecutedFreight", headerTemplate: "<span style='color: red;font-weight: bold'>Freight</span>", width: 70 },
        //                 { field: "ExecutedRevenue", headerTemplate: "<span style='color: red;font-weight: bold'>Revenue</span>", width: 70 },
        //                { field: "ExecutedYield", headerTemplate: "<span style='color: red;font-weight: bold'>Yield.</span>", width: 70 },
        //              ]
        //          },


        //           {
        //               headerTemplate: "<div style='text-align: center;color: darkblue;font-weight: bold'>Uplifted</div>",
        //               columns: [
        //                   { field: "UpliftedShpts", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Shpts.</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"U\")'>#= UpliftedShpts #</a>" },
        //                   { field: "UpliftedPcs", headerTemplate: "<span style='color: darkblue;font-weight: bold'>PCs.</span>", width: 70 },
        //                 { field: "UpliftedGrWt", headerTemplate: "<span style='color: darkblue;font-weight: bold'>GrWt.</span>", width: 70 },
        //                { field: "UpliftedVol", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Vol.</span>", width: 70 },
        //                 { field: "UpliftedChWt", headerTemplate: "<span style='color: darkblue;font-weight: bold'>ChWt.</span>", width: 70 },
        //                { field: "UpliftedFreight", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Freight</span>", width: 70 },
        //                 { field: "UpliftedRevenue", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Revenue</span>", width: 70 },
        //                { field: "UpliftedYield", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Yield.</span>", width: 70 },
        //               ]
        //           }

        //    ]
        //});
        //dataSource.bind("error", dataSource_error);
    
    
});

function dataSource_error(e) {
    ShowMessage('warning', 'Something went wrong,please try later !', e.status, "bottom-right");
}


var Model = [];

function SearchPostFlightReport() {

    Model =
       {
           AirlineCode: $('#AirlineCode').val(),
           FromDate: $("#FromDate").val(),
           ToDate: $("#ToDate").val(),
           OriginSNo: $("#OriginSNo").val(),
           DestinationSNo: $("#DestinationSNo").val(),
           FlightNo: $("#FlightSNo").val() == "" ? 0 : $('#FlightSNo').val(),
           IsAutoProcess: (OnBlob == true ? 0 : 1),
           pagesize: 100000

       };


    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;
    }





    if (Model.AirlineCode != undefined && Model.OriginSNo != undefined && Model.FromDate != undefined && Model.ToDate != undefined) {
        if (Model.AirlineCode != "" && Model.OriginSNo != "" && Model.FromDate != "" && Model.ToDate != "") {
            if (OnBlob) {
                $.ajax({
                    url: "../Reports/PostFlightReport",
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
                var dataSource = $("#grid").kendoGrid({
                    autoBind: false,
                    dataSource: new kendo.data.DataSource({
                        type: "json",
                        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
                        transport: {
                            read: {
                                url: "../PostFlightReport/PostFlightReportGetRecord",
                                dataType: "json",
                                global: false,
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                data: function GetReportData() {
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
                                    FlightNo: { type: "string" },
                                    Date: { type: "string" },
                                    Origin: { type: "string" },
                                    Destination: { type: "string" },

                                    AircraftType: { type: "string" },
                                    CapacityGross: { type: "string" },
                                    CapacityVol: { type: "string" },

                                    BookedShpts: { type: "string" },
                                    BookedPcs: { type: "string" },
                                    BookedGrWt: { type: "string" },
                                    BookedVol: { type: "string" },
                                    BookedChWt: { type: "string" },
                                    BookedFreight: { type: "string" },
                                    BookedRevenue: { type: "string" },
                                    BookedYield: { type: "string" },

                                    ExecutedShpts: { type: "string" },
                                    ExecutedPcs: { type: "string" },
                                    ExecutedGrWt: { type: "string" },
                                    ExecutedVol: { type: "string" },
                                    ExecutedChWt: { type: "string" },
                                    ExecutedFreight: { type: "string" },
                                    ExecutedRevenue: { type: "string" },
                                    ExecutedYield: { type: "string" },


                                    UpliftedShpts: { type: "string" },
                                    UpliftedPcs: { type: "string" },
                                    UpliftedGrWt: { type: "string" },
                                    UpliftedVol: { type: "string" },
                                    UpliftedChWt: { type: "string" },
                                    UpliftedFreight: { type: "string" },
                                    UpliftedRevenue: { type: "string" },
                                    UpliftedYield: { type: "string" }


                                }
                            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                        },

                    }),

                    //detailInit: detailInit,
                    //filterable: { mode: 'menu' },
                    sortable: true, filterable: false,
                    pageable: {
                        refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
                    },
                    scrollable: true,

                    //height: 450,
                    columns: [

                        { field: "FlightNo", title: "Flight No", filterable: true, width: 70 },
                        { field: "Date", title: "Date", width: 70 },
                        { field: "Origin", title: "Origin", width: 70 },
                        { field: "Destination", title: "Destination", width: 70 },
                        { field: "AircraftType", title: "Aircraft Type", width: 70 },

                        {
                            headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Capacity</div>",
                            columns: [{ field: "CapacityGross", headerTemplate: "<span style='color: blue;font-weight: bold'>Gross</span>", width: 70 },
                               { field: "CapacityVol", headerTemplate: "<span style='color: blue;font-weight: bold'>Vol.</span>", width: 70 }, ]
                        },

                         {
                             headerTemplate: "<div style='text-align: center;color: Green;font-weight: bold'>Booked</div>",
                             columns: [
                                 { field: "BookedShpts", headerTemplate: "<span style='color: Green;font-weight: bold'>Shpts.</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"B\")'>#= BookedShpts #</a>" },
                                { field: "BookedPcs", headerTemplate: "<span style='color: Green;font-weight: bold'>PCs.</span>", width: 70 },
                                 { field: "BookedGrWt", headerTemplate: "<span style='color: Green;font-weight: bold'>GrWt.</span>", width: 70 },
                                { field: "BookedVol", headerTemplate: "<span style='color: Green;font-weight: bold'>Vol.</span>", width: 70 },
                                 { field: "BookedChWt", headerTemplate: "<span style='color: Green;font-weight: bold'>ChWt.</span>", width: 70 },
                                { field: "BookedFreight", headerTemplate: "<span style='color: Green;font-weight: bold'>Freight</span>", width: 70 },
                                 { field: "BookedRevenue", headerTemplate: "<span style='color: Green;font-weight: bold'>Revenue</span>", width: 70 },
                                { field: "BookedYield", headerTemplate: "<span style='color: Green;font-weight: bold'>Yield.</span>", width: 70 },
                             ]
                         },

                          {
                              headerTemplate: "<div style='text-align: center;color: red;font-weight: bold'>Executed</div>",
                              columns: [
                                  { field: "ExecutedShpts", headerTemplate: "<span style='color: red;font-weight: bold'>Shpts.</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"E\")'>#= ExecutedShpts #</a>" },
                                  { field: "ExecutedPcs", headerTemplate: "<span style='color: red;font-weight: bold'>PCs.</span>", width: 70 },
                                 { field: "ExecutedGrWt", headerTemplate: "<span style='color: red;font-weight: bold'>GrWt.</span>", width: 70 },
                                { field: "ExecutedVol", headerTemplate: "<span style='color: red;font-weight: bold'>Vol.</span>", width: 70 },
                                 { field: "ExecutedChWt", headerTemplate: "<span style='color: red;font-weight: bold'>ChWt.</span>", width: 70 },
                                { field: "ExecutedFreight", headerTemplate: "<span style='color: red;font-weight: bold'>Freight</span>", width: 70 },
                                 { field: "ExecutedRevenue", headerTemplate: "<span style='color: red;font-weight: bold'>Revenue</span>", width: 70 },
                                { field: "ExecutedYield", headerTemplate: "<span style='color: red;font-weight: bold'>Yield.</span>", width: 70 },
                              ]
                          },


                           {
                               headerTemplate: "<div style='text-align: center;color: darkblue;font-weight: bold'>Uplifted</div>",
                               columns: [
                                   { field: "UpliftedShpts", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Shpts.</span>", width: 70, template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"U\")'>#= UpliftedShpts #</a>" },
                                   { field: "UpliftedPcs", headerTemplate: "<span style='color: darkblue;font-weight: bold'>PCs.</span>", width: 70 },
                                 { field: "UpliftedGrWt", headerTemplate: "<span style='color: darkblue;font-weight: bold'>GrWt.</span>", width: 70 },
                                { field: "UpliftedVol", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Vol.</span>", width: 70 },
                                 { field: "UpliftedChWt", headerTemplate: "<span style='color: darkblue;font-weight: bold'>ChWt.</span>", width: 70 },
                                { field: "UpliftedFreight", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Freight</span>", width: 70 },
                                 { field: "UpliftedRevenue", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Revenue</span>", width: 70 },
                                { field: "UpliftedYield", headerTemplate: "<span style='color: darkblue;font-weight: bold'>Yield.</span>", width: 70 },
                               ]
                           }

                    ]
                });
                dataSource.bind("error", dataSource_error);

                $('#grid').css('display', '')
                $("#grid").data('kendoGrid').dataSource.page(1);
                $('#imgexcel').show();
            }
        }
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


    else if (textId == "Text_FlightSNo") {
        if ($('#OriginSNo').val() != '')
            cfi.setFilter(filterAirline, "OriginAirportSNo", "eq", $("#OriginSNo").val());
        if ($('#DestinationSNo').val() != '')
            cfi.setFilter(filterAirline, "DestinationAirportSNo", "eq", $("#DestinationSNo").val());

        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());
        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }
}


function ShowDetails(SNo, Type) {
    $.ajax({
        url: "../PostFlightReport/GetPostFlightReportDescription",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ SNo: SNo, Type: Type }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var Result = result.Table0
            var Columns = "";
            var Rows = "";
            $('#FlightDetails').html('');
            if (Result.length > 0) {

                for (var i = 0; i < Result.length; i++) {
                    var columnsIn = Result[0];// Coulms Name geting from First Row
                    Rows += '<tr>'
                    var SNo = 0;
                    for (var key in columnsIn) { // Printing Columns
                        if (i == 0 && key != 'SNo')
                            Columns += "<td class='ui-widget-header'> " + key + " </td>";

                        //if (key == 'SNo') {
                        //    SNo = Result[i][key];
                        //}
                        //else if (key == 'Flight No') {
                        //    Rows += "<td class='ui-widget-content'  id=" + key + i + "> <a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ")'>" + Result[i][key] + "</a></td>";
                        //}
                        //else
                        Rows += "<td class='ui-widget-content'> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                    }
                    Rows += '</tr>'
                }

                $('#FlightDetails').append('<table id="tblFlightDetails" class="appendGrid ui-widget" style="margin-bottom:10px;"><thead class="ui-widget-header" style="text-align:center" id="theadid_F"></thead> <tbody id="tbodyid_F" class="ui-widget-content"></tbody></table>');

                $('#theadid_F').append('<tr>' + Columns + '</tr>');

                $('#tbodyid_F').append(Rows);
            }
            openDialogBox('FlightDetails');
        },
        error: function (ErrorMessage) {
            if (ErrorMessage != undefined) {
                var CheckFormat = isJson(ErrorMessage);
                var PostFlightError, Result;
                if (CheckFormat == true) {
                    PostFlightError = jQuery.parseJSON(ErrorMessage);
                    if (PostFlightError.Table0 != undefined && PostFlightError.Table0.length > 0) {
                        Result = PostFlightError.Table0[0].Error;
                        ShowMessage('warning', 'Something went wrong,please try later !', Result, "bottom-right");
                    }
                    else {
                        ShowMessage('warning', 'Something went wrong,please try later !', PostFlightError, "bottom-right");
                    }
                }
                else {
                    ShowMessage('warning', 'Something went wrong,please try later !', ErrorMessage, "bottom-right");
                }
            }
        }
    });
}
function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}


function openDialogBox(DivID) {
    if ($("#" + DivID).html() == "")
        $("#" + DivID).append('<div style="color:red; width: 100%; text-align:center;">No Record found!!<div>');

    $("#" + DivID).show();

    $("#" + DivID).dialog(
   {
       autoResize: true,
       maxWidth: 800,
       maxHeight: 400,
       style: 'font-size:20px;',
       width: 800,
       height: 400,
       modal: true,
       dialogClass: 'no-close success-dialog',
       title: 'Post Flight - Details',
       draggable: true,
       resizable: false,
       buttons: {
           "OK": function () {
               $(this).dialog("close");
           },
       },
       close: function () {
           $(this).dialog("close");
       }
   });
}
function ExportToExcel_PostFlight() {

    if (Model.AirlineCode != undefined && Model.OriginSNo != undefined && Model.FromDate != undefined && Model.ToDate != undefined) {
        if (Model.AirlineCode != "" && Model.OriginSNo != "" && Model.FromDate != "" && Model.ToDate != "") {
            $.ajax({
                url: '../PostFlightReport/ExportToExcel',
                async: false,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(Model),
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.Data.length >= 50000) {
                        ShowMessage('warning', 'warning - Post Flight Report', "Data is too much big,Please Select Less Date Range ! !");
                        return false;
                    }

                    var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'><thead role='rowgroup' style='background-color: #daecf4'><tr role='row'  style='background-color: #daecf4'><th role='columnheader' " +
                    "data-field='FlightNo' rowspan='2' data-title='Flight No' data-index='0' class='k-header' data-role='columnsorter'>Flight No" +
                    "</ th><th role='columnheader' data-field='Date' rowspan='2' data-title='Date' data-index='1' class='k-header' data-role='columnsorter'>" +
                    "Date</th><th role='columnheader' data-field='Origin' rowspan='2' data-title='Origin' data-index='2' class='k-header' " +
                    "data-role='columnsorter'>Origin</th><th role='columnheader' data-field='Destination' rowspan='2' data-title='Destination'" +
                    "data-index='3' class='k-header' data-role='columnsorter'>Destination</th><th role='columnheader' data-field='AircraftType'" + "rowspan='2' data-title='Aircraft Type' data-index='4' class='k-header' data-role='columnsorter'>Aircraft Type</th><th role='columnheader' colspan='2' data-colspan='2' class='k-header'><div style='text-align: center;color: blue;font-weight: bold'>Capacity</div></th><th role='columnheader' colspan='8' data-colspan='8' class='k-header'><div style='text-align: center;color: Green;font-weight: bold'>Booked</div></th><th role='columnheader' colspan='8' data-colspan='8' class='k-header'><div style='text-align: center;color: red;font-weight: bold'>Executed</div></th><th role='columnheader' colspan='8' data-colspan='8' class='k-header'><div style='text-align: center;color: darkblue;font-weight: bold'>Uplifted</div></th></tr><tr role='row' style='background-color: #daecf4'><th role='columnheader' data-field='CapacityGross' data-index='5' class='k-header k-first' data-role='columnsorter'><span style='color: blue;font-weight: bold'>Gross</span></th><th role='columnheader' data-field='CapacityVol' data-index='6' class='k-header' data-role='columnsorter'><span style='color: blue;font-weight: bold'>Vol.</span></th><th role='columnheader' data-field='BookedShpts' data-index='7' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>Shpts.</span></th><th role='columnheader' data-field='BookedPcs' data-index='8' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>PCs.</span></th><th role='columnheader' data-field='BookedGrWt' data-index='9' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>GrWt.</span></th><th role='columnheader' data-field='BookedVol' data-index='10' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>Vol.</span></th><th role='columnheader' data-field='BookedChWt' data-index='11' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>ChWt.</span></th><th role='columnheader' data-field='BookedFreight' data-index='12' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>Freight</span></th><th role='columnheader' data-field='BookedRevenue' data-index='13' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>Revenue</span></th><th role='columnheader' data-field='BookedYield' data-index='14' class='k-header' data-role='columnsorter'><span style='color: Green;font-weight: bold'>Yield.</span></th><th role='columnheader' data-field='ExecutedShpts' data-index='15' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>Shpts.</span></th><th role='columnheader' data-field='ExecutedPcs' data-index='16' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>PCs.</span></th><th role='columnheader' data-field='ExecutedGrWt' data-index='17' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>GrWt.</span></th><th role='columnheader' data-field='ExecutedVol' data-index='18' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>Vol.</span></th><th role='columnheader' data-field='ExecutedChWt' data-index='19' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>ChWt.</span></th><th role='columnheader' data-field='ExecutedFreight' data-index='20' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>Freight</span></th><th role='columnheader' data-field='ExecutedRevenue' data-index='21' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>Revenue</span></th><th role='columnheader' data-field='ExecutedYield' data-index='22' class='k-header' data-role='columnsorter'><span style='color: red;font-weight: bold'>Yield.</span></th><th role='columnheader' data-field='UpliftedShpts' data-index='23' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>Shpts.</span></th><th role='columnheader' data-field='UpliftedPcs' data-index='24' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>PCs.</span></th><th role='columnheader' data-field='UpliftedGrWt' data-index='25' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>GrWt.</span></th><th role='columnheader' data-field='UpliftedVol' data-index='26' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>Vol.</span></th><th role='columnheader' data-field='UpliftedChWt' data-index='27' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>ChWt.</span></th><th role='columnheader' data-field='UpliftedFreight' data-index='28' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>Freight</span></th><th role='columnheader' data-field='UpliftedRevenue' data-index='29' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>Revenue</span></th><th role='columnheader' data-field='UpliftedYield' data-index='30' class='k-header' data-role='columnsorter'><span style='color: darkblue;font-weight: bold'>Yield.</span></th></tr></thead>";
                    if (result.Data.length > 0) {
                        for (var i = 0; i < result.Data.length; i++) {
                            str += "<tr>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].Date + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].AircraftType + "</td>";
                            str += "<td>" + result.Data[i].CapacityGross + "</td>";
                            str += "<td>" + result.Data[i].CapacityVol + "</td>";


                            str += "<td>" + result.Data[i].BookedShpts + "</td>";
                            str += "<td>" + result.Data[i].BookedPcs + "</td>";
                            str += "<td>" + result.Data[i].BookedGrWt + "</td>";
                            str += "<td>" + result.Data[i].BookedVol + "</td>";
                            str += "<td>" + result.Data[i].BookedChWt + "</td>";
                            str += "<td>" + result.Data[i].BookedFreight + "</td>";
                            str += "<td>" + result.Data[i].BookedRevenue + "</td>";
                            str += "<td>" + result.Data[i].BookedYield + "</td>";

                            str += "<td>" + result.Data[i].ExecutedShpts + "</td>";
                            str += "<td>" + result.Data[i].ExecutedPcs + "</td>";
                            str += "<td>" + result.Data[i].ExecutedGrWt + "</td>";
                            str += "<td>" + result.Data[i].ExecutedVol + "</td>";
                            str += "<td>" + result.Data[i].ExecutedChWt + "</td>";
                            str += "<td>" + result.Data[i].ExecutedFreight + "</td>";
                            str += "<td>" + result.Data[i].ExecutedRevenue + "</td>";
                            str += "<td>" + result.Data[i].ExecutedYield + "</td>";


                            str += "<td>" + result.Data[i].UpliftedShpts + "</td>";
                            str += "<td>" + result.Data[i].UpliftedPcs + "</td>";
                            str += "<td>" + result.Data[i].UpliftedGrWt + "</td>";
                            str += "<td>" + result.Data[i].UpliftedVol + "</td>";
                            str += "<td>" + result.Data[i].UpliftedChWt + "</td>";
                            str += "<td>" + result.Data[i].UpliftedFreight + "</td>";
                            str += "<td>" + result.Data[i].UpliftedRevenue + "</td>";
                            str += "<td>" + result.Data[i].UpliftedYield + "</td>";

                            str += "</tr>";
                        }
                    }
                    else {
                        str += " <tr>";
                        str += "<td colspan='31'><center><p style='color:red'>No Record Found</p></center></td>";
                        str += "</tr>";
                    }
                    str += "</table>";

                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!

                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    var today = dd + '_' + mm + '_' + yyyy;

                    exportToExcelNew('<div>' + str.toString() + '</div>', 'PostFlightReport_' + today);
                    return false
                },
                error: function (ErrorMessage) {

                    if (ErrorMessage != undefined) {

                        var PostFlightError = jQuery.parseJSON(ErrorMessage);
                        if (PostFlightError.Table0.length > 0) {
                            var Result = PostFlightError.Table0[0].Error;
                            ShowMessage('warning', 'Something went wrong,please try later !', Result, "bottom-right");
                        }
                    }
                }
            });
        }
    }

}