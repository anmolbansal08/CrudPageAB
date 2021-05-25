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

   
    cfi.AutoComplete("AirportCode", "SNo,AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("ULDNo", "ULDNo", "vwULDStock", "SNo", "ULDNo", ["ULDNo"], null, "contains");

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
            bindExportToExcel();
        }



    });


    function uldDetails() {
        $('#divULDMovementHistory').find('table').remove();
        $('#divULDMovementHistory').append('<table id="tblulddetails" class="appendGrid ui-widget" ><thead class="ui-widget-header"><tr><td class="ui-widget-header" >Current City&nbsp;&nbsp;:&nbsp;&nbsp; <span id="spnCurrentCity"></td><td class="ui-widget-header" >ULD No &nbsp;&nbsp;:&nbsp;&nbsp; <span id="spnULDs"></span> </td><td class="ui-widget-header" >ULD Type &nbsp;&nbsp;:&nbsp;&nbsp; <span id="spnULDType"></span></td><td class="ui-widget-header">Available &nbsp;&nbsp;:&nbsp;&nbsp;<span id="spnIsAvailable"></span></td><td><input type="button" class="btn btn-success" style="width:100px;" value="Generate Excel" name="GenExcel" id="GenExcel"></td></tr></thead></table>');
        $.ajax({
            url: "./Services/Report/ULDMovementHistoryService.svc/getULDDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDSNo: $("#ULDNo").val() }),
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







    function bindExportToExcel() {
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
                ExportToExcel();
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


function ExportToExcel() {


    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();

    if (cfi.IsValidSubmitSection()) {
        $.ajax({

            contentType: "application/json; charset=utf-8",
            async: false,
            type: "get",
            dataType: "json",
            cache: false,
            url: "./Services/Report/ULDMovementHistoryService.svc/SearchData?AirportSNo=" + $("#Text_AirportCode").val() + "&ULDSNo=" + $("#ULDNo").val() + "&FromDate=" + $("#FromDate").val() + "&ToDate=" + $("#ToDate").val() + "",

            success: function (result) {

                var finalTbl = jQuery.parseJSON(result).Table0;
                if (finalTbl.length > 0) {
                    var str = "<html><table style='width:90%;'  border=\"1px\"><thead><tr ><td>Status</td><td>Movement Type</td><td>Flight No</td><td>Flight Date</td><td>ATD</td><td>ATA</td><td>Origin</td><td>Destination</td><td>ULD No</td></tr></thead><tbody>"

                    for (var i = 0; i < finalTbl.length; i++) {
                        str += "<tr><td>" + finalTbl[i].Status + "</td><td>" + finalTbl[i].MovementType + "</td><td>" + finalTbl[i].FlightNo + "</td><td>" + finalTbl[i].FlightDate
                           + "</td><td>" + finalTbl[i].ATD + "</td><td>" + finalTbl[i].ATA
                            + "</td><td>" + finalTbl[i].OriginAirPortCode + "</td><td>" + finalTbl[i].DestinationAirPortCode
                            + "</td><td>" + finalTbl[i].ULDNo + "</td></tr>"
                    }
                    str += "</tbody></table></html>";
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



function ULDMovementHistoryGrid() {
    if (cfi.IsValidSubmitSection()) {

        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
        var ULDSNo = $("#ULDNo").val();
        var AirportSNo = $("#Text_AirportCode").val();

        var dbtableName = "ULDMovementHistory";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: false,
            isGetRecord: true,
            tableColumn: 'ULDNo',

            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 10, whereCondition: '' + FDate +
                '*' + TDate + '*' + ULDSNo + '*' + AirportSNo, sort: '',
            servicePath: './Services/Report/ULDMovementHistoryService.svc',
            getRecordServiceMethod: 'GetULDMovementHistoryRecord',
            caption: 'ULD Movement History',
            initRows: 1,
            columns: [
                     { name: 'SNo', type: 'hidden', value: '0' },
                     { name: 'Status', display: 'Status', type: 'label' },
                     { name: 'MovementType', display: 'Movement Type', type: 'label' },
                     { name: 'FlightNo', display: 'Flight No', type: 'label', },
                     { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                     { name: 'OriginAirPortCode', display: 'Origin', type: 'label' },
                     { name: 'DestinationAirPortCode', display: 'Destination', type: 'label' },

                     { name: 'ATD', display: 'ATD', type: 'label' },
                     { name: 'ATA', display: 'ATA', type: 'label' },
                    
                     { name: 'ULDNo', display: 'ULD No', type: 'label' },



            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_ULDNo") {
        return cfi.getFilter("AND"), cfi.setFilter(filter, "CurrentAirportSNo", "in", $("#AirportCode").val().trim()), cfi.autoCompleteFilter(filter);
    }
}

