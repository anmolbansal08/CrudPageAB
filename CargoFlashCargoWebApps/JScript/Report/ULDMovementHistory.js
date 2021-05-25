/*
*****************************************************************************
Javascript Name:	CargoRankingJS     
Purpose:		    This JS used to get autocomplete for ULD History.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    09 Sept 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {
    // cfi.ValidateForm();

    $("#Text_AirportCode").hide();
    // cfi.AutoComplete("AirportCode", "SNo,AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoCompleteV2("ULDNo", "ULDNo", "ULDMovementHistory_ULDNo", null, "contains");
    $("#FromDate").val("")
    $("#ToDate").val("")

    $("input[id='Search'][name='Search']").click(function () {


        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {

            ULDMovementHistoryGrid();
            uldDetails();
            bindExportToExcelPdf();
            setTimeout(function () {
                ExportToOnlyPdf()
            }, 200)
        }



    });


    function uldDetails() {
        $('#divULDMovementHistory').find('table').remove();
        $('#divULDMovementHistory').append('<table id="tblulddetails" class="appendGrid ui-widget" ><thead class="ui-widget-header"><tr><td class="ui-widget-header" >Current City&nbsp;&nbsp;:&nbsp;&nbsp; <span id="spnCurrentCity"></td><td class="ui-widget-header" >ULD No &nbsp;&nbsp;:&nbsp;&nbsp; <span id="spnULDs"></span> </td><td class="ui-widget-header" >ULD Type &nbsp;&nbsp;:&nbsp;&nbsp; <span id="spnULDType"></span></td><td class="ui-widget-header">Available &nbsp;&nbsp;:&nbsp;&nbsp;<span id="spnIsAvailable"></span></td><td><input type="button" class="btn btn-success" style="width:100px;" value="Generate Excel" name="GenExcel" id="GenExcel"><input type="button" class="btn btn-success" style="width:100px;" value="Generate Pdf" name="GenPdf" id="GenPdf"></td></tr></thead></table><div id="DivPrint" style="display:none"></div> ');
        $.ajax({
            url: "./Services/Report/ULDMovementHistoryService.svc/getULDDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDSNo: parseInt($("#ULDNo").val()) }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $("#spnCurrentCity").text(FinalData[0].CurrentCityCode);
                    $("#spnULDs").text(FinalData[0].ULDNo);
                    $("#spnULDType").text(FinalData[0].ULDType);
                    $("#spnIsAvailable").text(FinalData[0].Available);
                }
                //ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value> Occured", ""), "bottom-right");
            },
            error: function (er) {
                debugger
            }
        });
    }







    function bindExportToExcelPdf() {
        $("input[id='GenExcel'][name='GenExcel']").click(function () {

            var FromDate = document.getElementById('FromDate').value;
            var ToDate = document.getElementById('ToDate').value;
            var eDate = new Date(ToDate);
            var sDate = new Date(FromDate);
            if (FromDate != '' && FromDate != '' && sDate > eDate) {
                ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

                return false;
            }
            else {
                ExportToExcelPdf(1);
            }




        });


    }



    $("input[id^=ToDate]").blur(function (e) {
        var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("ToDate", "FromDate");
        k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
        var dfrom = new Date(Date.parse(k));
        $("input[id^=ToDate]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));

        if (dfrom > dto)
            $(this).val("");
    });

    $("input[id^=FromDate]").blur(function (e) {
        var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("FromDate", "ToDate");
        k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
        var dto = new Date(Date.parse(k));
        $("input[id^=FromDate]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
        if (dfrom > dto)
            $(this).val("");

    })


});

$(document).on('click', '#GenPdf', function () {

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


    var pdf = new jsPDF('p', 'pt', 'letter');
    pdf.cellInitialize(20);
    pdf.setFontSize(7);
    var width = 0;

    $.each($('#PdfExport tr'), function (i, row) {
        $.each($(row).find("td"), function (j, cell) {
            var txt = $(cell).text().trim() || " ";


            if (j == 0) {
                width = 200
            } else if (j == 4) {
                width = 74
            } else if (j == 5) {
                width = 42
            }
            else {
                width = 58
            }

            pdf.cell(1, 30, width, 15, txt, i);

        });
    });
    //  ULD Movement History
    pdf.save('ULD_Movement_History' + today + '.pdf');

});
function ExportToExcelPdf(ExportType) {


    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();
    var AirportCode = "";

    if (cfi.IsValidSubmitSection()) {
        $.ajax({
            // Changes by Vipin Kumar
            type: "POST",
            dataType: "json",
            url: "./Services/Report/ULDMovementHistoryService.svc/SearchData",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ searchData: { Airport: AirportCode, ULDSNo: parseInt($("#ULDNo").val()), FromDate: $("#FromDate").val(), ToDate: $("#ToDate").val() } }),
            cache: false,
            // Ends           
            success: function (result) {

                var finalTbl = jQuery.parseJSON(result).Table0;
                if (finalTbl.length > 0) {
                    var str = "<table style='width:90%;'  border=\"1px\"><thead><tr ><td>Status</td><td>Movement Type</td><td>Flight No</td><td>Flight Date</td><td>Event Date Time</td><td>Origin</td><td>Destination</td><td>ULD No</td></tr></thead><tbody>"

                    for (var i = 0; i < finalTbl.length; i++) {
                        str += "<tr><td>" + finalTbl[i].Status + "</td><td>" + finalTbl[i].MovementType + "</td><td>" + finalTbl[i].FlightNo + "</td><td>" + finalTbl[i].FlightDate
                        str += "</td>"
                        // str += "<td>" + finalTbl[i].ATD + "</td><td>" + finalTbl[i].ATA + "</td>"
                        str += "<td>" + finalTbl[i].ATA + "</td>"
                        str += "<td>" + finalTbl[i].OriginAirPortCode + "</td><td>" + finalTbl[i].DestinationAirPortCode
                        str += "</td><td>" + finalTbl[i].ULDNo + "</td></tr>"
                    }
                    str += "</tbody></table>";


                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "ULD Movement History";

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'ULDMovementHistory ' + postfix + '.xls';

                    a.click();




                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}


var wCondition = "";
function ULDMovementHistoryGrid() {
    if (cfi.IsValidSubmitSection()) {

        //wCondition = BindWhereCondition();

        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
        var ULDSNo = $("#ULDNo").val();
        var AirportSNo = $("#Text_AirportCode").val();

        var dbtableName = "ULDMovementHistory";

        $('#tbl' + dbtableName).appendGrid({
            V2: true,
            tableID: 'tbl' + dbtableName,
            contentEditable: false,
            isGetRecord: true,
            tableColumn: 'ULDNo',
            masterTableSNo: 1,
            // Changes by Vipin Kumar
            //currentPage: 1, itemsPerPage: 30, whereCondition: btoa(wCondition), sort: '',
            currentPage: 1, itemsPerPage: 30, model: BindWhereCondition(), sort: '',
            // Ends
            //  currentPage: 1, itemsPerPage: 10, whereCondition: '' + FDate +
            //     '*' + TDate + '*' + ULDSNo + '*' + AirportSNo, sort: '',
            servicePath: './Services/Report/ULDMovementHistoryService.svc',
            getRecordServiceMethod: 'GetULDMovementHistoryRecord',
            caption: 'ULD Movement History',
            initRows: 1,
            columns: [
                     { name: 'SNo', type: 'hidden', value: '0' },

                     { name: 'MovementType', display: 'Movement Type', type: 'label' },
                     { name: 'FlightNo', display: 'Flight No', type: 'label', },
                     { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                     { name: 'OriginAirPortCode', display: 'Origin', type: 'label' },
                     { name: 'DestinationAirPortCode', display: 'Destination', type: 'label' },
                     { name: 'ATD', value: '0', type: 'hidden' },
                     { name: 'Status', display: 'Event Details', type: 'label', value: '0' },
                     { name: 'ATA', display: 'Event Date Time', type: 'label' },

                     { name: 'ULDNo', display: 'ULD No', type: 'label' },



            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
            isExtraPaging: true,
        });
    }

}
function BindWhereCondition() {

    return {
        ULDNo: $("#ULDNo").val(),
        ToDate: $('#ToDate').val(),
        FromDate: $('#FromDate').val()
    };

    //var toDate = $("#ToDate").val();
    //var fromDate = $("#FromDate").val();
    //var WhereCondition = "";
    //if (fromDate != "" && toDate == "") {
    //    WhereCondition = "FlightDate = cast('" + fromDate + "' as date ) ";
    //} if (fromDate == "" && toDate != "") {
    //    WhereCondition = "FlightDate = cast('" + toDate + "' as date ) ";
    //} if (fromDate != "" && toDate != "") {
    //    WhereCondition = "FlightDate BETWEEN cast('" + fromDate + "'as date ) AND cast('" + toDate + "' as date )";
    //}
    //if (WhereCondition != "") {
    //    WhereCondition += $("#ULDNo").val() != "" ? "  AND SNo='" + $("#ULDNo").val() + "'" : "";
    //} else {
    //    WhereCondition += $("#ULDNo").val() != "" ? "  SNo='" + $("#ULDNo").val() + "'" : "";
    //}

    //return WhereCondition;

}
function ExtraCondition(textId) {
    //var filter = cfi.getFilter("AND");
    //if (textId == "Text_ULDNo") {
    //    return cfi.getFilter("AND"), cfi.setFilter(filter, "CurrentAirportSNo", "in", $("#AirportCode").val().trim()), cfi.autoCompleteFilter(filter);
    //}
}

function ExportToOnlyPdf() {


    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();
    var AirportCode = "";
    $("#DivPrint").html("")
    if (cfi.IsValidSubmitSection()) {
        $.ajax({
            // Changes by Vipin Kumar
            type: "POST",
            dataType: "json",
            url: "./Services/Report/ULDMovementHistoryService.svc/SearchData",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ searchData: { Airport: AirportCode, ULDSNo: parseInt($("#ULDNo").val()), FromDate: $("#FromDate").val(), ToDate: $("#ToDate").val() } }),
            cache: false,
            // Ends           
            success: function (result) {

                var finalTbl = jQuery.parseJSON(result).Table0;
                if (finalTbl.length > 0) {
                    var str = "<table id='PdfExport' style='width:90%;'  border=\"1px\"><thead><tr ><td>Status</td><td>Movement Type</td><td>Flight No</td><td>Flight Date</td><td>Event Date Time</td><td>Origin</td><td>Destination</td><td>ULD No</td></tr></thead><tbody>"

                    for (var i = 0; i < finalTbl.length; i++) {
                        str += "<tr><td style='word-wrap: break-word;white-space:inherit;' >" + finalTbl[i].Status + "</td><td>" + finalTbl[i].MovementType + "</td><td>" + finalTbl[i].FlightNo + "</td><td>" + finalTbl[i].FlightDate
                        str += "</td>"
                        // str += "<td>" + finalTbl[i].ATD + "</td><td>" + finalTbl[i].ATA + "</td>"
                        str += "<td align='center'>" + finalTbl[i].ATA + "</td>"
                        str += "<td>" + finalTbl[i].OriginAirPortCode + "</td><td>" + finalTbl[i].DestinationAirPortCode
                        str += "</td><td>" + finalTbl[i].ULDNo + "</td></tr>"
                    }
                    str += "</tbody></table>";
                    $("#DivPrint").html(str)


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}
