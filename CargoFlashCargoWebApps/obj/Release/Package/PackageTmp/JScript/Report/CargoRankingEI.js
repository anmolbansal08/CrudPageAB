/*
*****************************************************************************
Javascript Name:	CargoRankingJS     
Purpose:		    This JS used to get autocomplete for Cargo Ranking.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    06 June 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
    var alphabettypes = [{ Key: "0", Text: "Commodity" }, { Key: "1", Text: "Airline" }, { Key: "2", Text: "Airport" }, { Key: "3", Text: "Agent" }];
    cfi.AutoCompleteByDataSource("Type", alphabettypes, CargoTypeChange);

    var ctypes = [{ Key: "0", Text: "ALL" }, { Key: "1", Text: "Export" }, { Key: "2", Text: "Import" }, { Key: "3", Text: "Transit" }];
    cfi.AutoCompleteByDataSource("CargoType", ctypes);


    cfi.AutoComplete("FilterType", "Name", "vwGetMultiple", "sno", "Name", ["Name"], null, "contains");

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    //  document.getElementById('Text_FilterType').style.display = 'none';
    $('#Text_FilterType').closest('span').hide();


    //$("#Text_FilterType").autocomplete({

    //    minLength: 0
    //});

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
            CargoRankingGrid();
        }


    });


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
            SearchData();
        }

    });
});

function CargoTypeChange() {
    if ($("#Type").val() == "0") {
        $('#Text_FilterType').closest('span').show();
        $('#Text_FilterType').val("");
        $('#spnFilterType').text("Commodity");
    }
    else if ($("#Type").val() == "1") {
        $('#Text_FilterType').closest('span').show();
        $('#Text_FilterType').val("");
        $('#spnFilterType').text("Airline");
    }
    else if ($("#Type").val() == "2") {
        $('#Text_FilterType').closest('span').show();
        $('#Text_FilterType').val("");
        $('#spnFilterType').text("Airport");
    }
    else if ($("#Type").val() == "3") {
        $('#Text_FilterType').closest('span').show();
        $('#Text_FilterType').val("");
        $('#spnFilterType').text("Agent");
    }
    else {
        $('#Text_FilterType').closest('span').hide();
    }

}
function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_FilterType") >= 0) {

        cfi.setFilter(filterEmbargo, "Code", "eq", $("#Text_Type").data("kendoAutoComplete").key() == "" ? 4 : $("#Text_Type").data("kendoAutoComplete").key());

        if ($("#Text_Type").data("kendoAutoComplete").key() == 2) {
            cfi.setFilter(filterEmbargo, "id", "neq", userContext.CityCode);
        }

        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
        return filterULD;
    }
}

function SearchData() {

    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();
    if (cfi.IsValidSubmitSection()) {
        if ($("#Type").val() == 0) {
            var obj = {
                FromDate: $("#FromDate").val(),
                ToDate: $("#ToDate").val(),
                CargoType: $("#CargoType").val(),
                Filter: $("#FilterType").val()
            }
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                url: "./Services/Report/CargoRankingEIService.svc/SearchData",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {

                        var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>CARGO RANKING REPORT <BR/> COMMODITY WISE </td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                            "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "

                        str += "<br/><table style='width:90%;'  border=\"1px\">";
                        if ($("#CargoType").val() == 0) {
                            str += "<tr ><td>Commodity Code</td><td>Commodity </td><td>Export</td><td>E/Rank</td> <td>Import</td><td>I/Rank</td><td>Transit</td><td>T/Rank</td>                     <td>Total</td><td>Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].CommodityCode + "</td><td>" + response[i].CommodityDescription + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                    + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td><td>" + response[i].Total + "</td><td>" + response[i].Rank
                                    + "</td></tr>"
                            }
                        }

                        else if ($("#CargoType").val() == 1) {
                            str += "<tr ><td>Commodity Code</td><td>Commodity </td><td>Export</td><td>E/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].CommodityCode + "</td><td>" + response[i].CommodityDescription + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 2) {
                            str += "<tr ><td>Commodity Code</td><td>Commodity </td><td>Import</td><td>I/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].CommodityCode + "</td><td>" + response[i].CommodityDescription + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 3) {
                            str += "<tr ><td>Commodity Code</td><td>Commodity </td><td>Transit</td><td>T/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].CommodityCode + "</td><td>" + response[i].CommodityDescription + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td></tr>"
                            }
                        }

                        str += "</table></html>";


                        var data_type = 'data:application/vnd.ms-excel'

                        var postfix = "Commodity Wise";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Cargo Ranking ' + postfix + '.xls';
                        a.click();
                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });
        }
        else if ($("#Type").val() == 1) {
            var obj = {
                FromDate: $("#FromDate").val(),
                ToDate: $("#ToDate").val(),
                CargoType: $("#CargoType").val(),
                Filter: $("#FilterType").val()
            }
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                url: "./Services/Report/CargoRankingEIService.svc/SearchDataAirline",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {

                        var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>CARGO RANKING REPORT <BR/> AIRLINE WISE </td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                           "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "

                        str += "<br/><table style='width:90%;'  border=\"1px\">";




                        if ($("#CargoType").val() == 0) {

                            str += "<tr ><td>Airline Code</td><td>Airline </td><td>Export</td><td>E/Rank</td> <td>Import</td><td>I/Rank</td><td>Transit</td><td>T/Rank</td><td>Total</td><td>Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AirlineCode + "</td><td>" + response[i].AirlineName + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                     + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td><td>" + response[i].Total + "</td><td>" + response[i].Rank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 1) {

                            str += "<tr ><td>Airline Code</td><td>Airline </td><td>Export</td><td>E/Rank</td> </tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AirlineCode + "</td><td>" + response[i].AirlineName + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 2) {

                            str += "<tr ><td>Airline Code</td><td>Airline </td><td>Import</td><td>I/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AirlineCode + "</td><td>" + response[i].AirlineName + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 3) {

                            str += "<tr ><td>Airline Code</td><td>Airline </td><td>Transit</td><td>T/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AirlineCode + "</td><td>" + response[i].AirlineName + "</td><td>"
                                     + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td></tr>"
                            }
                        }

                        str += "</table></html>";

                        //  window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
                        // e.preventDefault();
                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "Airline Wise";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Cargo Ranking ' + postfix + '.xls';

                        a.click();
                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });

        }
        else if ($("#Type").val() == 2) {
            var obj = {
                FromDate: $("#FromDate").val(),
                ToDate: $("#ToDate").val(),
                CargoType: $("#CargoType").val(),
                Filter: $("#FilterType").val()
            }


            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "./Services/Report/CargoRankingEIService.svc/SearchDataDestination",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {

                        var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>CARGO RANKING REPORT <BR/> Airport WISE</td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                          "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                        str += "<br/><table style='width:90%;'  border=\"1px\">";


                        if ($("#CargoType").val() == 0) {
                            str += "<tr ><td border='1px'>Airport Code</td><td>Airport </td><td>Export</td><td>E/Rank</td> <td>Import</td><td>I/Rank</td><td>Transit</td><td>T/Rank</td><td>Total</td><td>Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].DestinationCode + "</td><td>" + response[i].Destination + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                     + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td><td>" + response[i].Total + "</td><td>" + response[i].Rank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 1) {
                            str += "<tr ><td border='1px'>Airport Code</td><td>Airport </td><td>Export</td><td>E/Rank</td> </tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].DestinationCode + "</td><td>" + response[i].Destination + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 2) {
                            str += "<tr ><td border='1px'>Airport Code</td><td>Airport </td> <td>Import</td><td>I/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].DestinationCode + "</td><td>" + response[i].Destination + "</td><td>"
                                 + response[i].Import + "</td><td>" + response[i].IRank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 3) {
                            str += "<tr ><td border='1px'>Airport Code</td><td>Airport </td><td>Transit</td><td>T/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].DestinationCode + "</td><td>" + response[i].Destination + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td></tr>"
                            }
                        }


                        str += "</table></html>";

                        //  window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
                        // e.preventDefault();
                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "Airport Wise";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Cargo Ranking ' + postfix + '.xls';

                        a.click();


                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });
        }

        else if ($("#Type").val() == 3) {
            var obj = {
                FromDate: $("#FromDate").val(),
                ToDate: $("#ToDate").val(),
                CargoType: $("#CargoType").val(),
                Filter: $("#FilterType").val()
            }


            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                url: "./Services/Report/CargoRankingEIService.svc/SearchDataAgent",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {

                        var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>CARGO RANKING REPORT <BR/> AGENT WISE </td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                          "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                        str += "<br/><table style='width:90%;'  border=\"1px\">";



                        if ($("#CargoType").val() == 0) {
                            str += "<tr ><td border='1px'>Agent Code</td><td>Airport </td><td>Export</td><td>E/Rank</td> <td>Import</td><td>I/Rank</td><td>Transit</td><td>T/Rank</td><td>Total</td><td>Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AgentCode + "</td><td>" + response[i].Agent + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                     + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td><td>" + response[i].Total + "</td><td>" + response[i].Rank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 1) {
                            str += "<tr ><td border='1px'>Agent Code</td><td>Airport </td><td>Export</td><td>E/Rank</td> </tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AgentCode + "</td><td>" + response[i].Agent + "</td><td>" + response[i].Export + "</td><td>" + response[i].ERank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 2) {
                            str += "<tr ><td border='1px'>Agent Code</td><td>Airport </td> <td>Import</td><td>I/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AgentCode + "</td><td>" + response[i].Agent + "</td><td>" + response[i].Import + "</td><td>" + response[i].IRank
                                    + "</td></tr>"
                            }
                        }
                        else if ($("#CargoType").val() == 3) {
                            str += "<tr ><td border='1px'>Agent Code</td><td>Airport </td><td>Transit</td><td>T/Rank</td></tr>"

                            for (var i = 0; i < response.length; i++) {
                                str += "<tr><td>" + response[i].AgentCode + "</td><td>" + response[i].Agent
                                     + "</td><td>" + response[i].Transit + "</td><td>" + response[i].RRank
                                    + "</td></tr>"
                            }
                        }

                        str += "</table></html>";

                        //  window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
                        // e.preventDefault();
                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "Agent Wise";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Cargo Ranking ' + postfix + '.xls';

                        a.click();


                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });
        }
    }

}


function CargoRankingGrid() {
    if (cfi.IsValidSubmitSection()) {

        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
        var VType = $('#Type').val();
        var CType = $("#CargoType").val();

        var Filter = $("#FilterType").val();

        var dbtableName = "CargoRankingEI";


        if ($("#Type").val() == 0) {
            if ($("#CargoType").val() == 0) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'CommodityCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingRecord',
                    //createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    // deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Commodity Wise',
                    initRows: 1,
                    columns: [
                            //  { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'CommodityCode', display: 'Commodity Code', type: 'label', },
                              { name: 'CommodityDescription', display: 'Commodity Description', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' },
                              { name: 'Import', display: 'Import', type: 'label' },
                              { name: 'IRank', display: 'I/Rank', type: 'label' },
                               { name: 'Transit', display: 'Transit', type: 'label' },
                              { name: 'RRank', display: 'T/Rank', type: 'label' },

                              { name: 'Total', display: 'Total', type: 'label' },
                              { name: 'Rank', display: 'Rank', type: 'label' }


                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 1) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'CommodityCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingRecord',
                    //createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    // deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Commodity Wise',
                    initRows: 1,
                    columns: [
                            //  { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'CommodityCode', display: 'Commodity Code', type: 'label', },
                              { name: 'CommodityDescription', display: 'Commodity Description', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 2) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'CommodityCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                       '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingRecord',
                    //createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    // deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Commodity Wise',
                    initRows: 1,
                    columns: [
                            //  { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'CommodityCode', display: 'Commodity Code', type: 'label', },
                              { name: 'CommodityDescription', display: 'Commodity Description', type: 'label' },
                              { name: 'Import', display: 'Import', type: 'label' },
                              { name: 'IRank', display: 'I/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 3) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'CommodityCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingRecord',
                    //createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    // deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Commodity Wise',
                    initRows: 1,
                    columns: [
                            //  { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'CommodityCode', display: 'Commodity Code', type: 'label', },
                              { name: 'CommodityDescription', display: 'Commodity Description', type: 'label' },
                              { name: 'Transit', display: 'Transit', type: 'label' },
                              { name: 'RRank', display: 'T/Rank', type: 'label' }
                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }

        }
        else if ($("#Type").val() == 1) {

            if ($("#CargoType").val() == 0) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AirlineCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                       '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAirlineRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airline Wise',
                    initRows: 1,
                    columns: [
                             // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'AirlineCode', display: 'Airline Code', type: 'label', },
                              { name: 'AirlineName', display: 'Airline Name', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' },
                              { name: 'Import', display: 'Import', type: 'label' },
                              { name: 'IRank', display: 'I/Rank', type: 'label' },
                              { name: 'Transit', display: 'Transit', type: 'label' },
                              { name: 'RRank', display: 'T/Rank', type: 'label' },
                              { name: 'Total', display: 'Total', type: 'label', },
                              { name: 'Rank', display: 'Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 1) {

                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AirlineCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                       '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAirlineRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airline Wise',
                    initRows: 1,
                    columns: [
                             // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'AirlineCode', display: 'Airline Code', type: 'label', },
                              { name: 'AirlineName', display: 'Airline Name', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 2) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AirlineCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                       '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAirlineRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airline Wise',
                    initRows: 1,
                    columns: [
                             // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'AirlineCode', display: 'Airline Code', type: 'label', },
                              { name: 'AirlineName', display: 'Airline Name', type: 'label' },
                              { name: 'Import', display: 'Import', type: 'label' },
                              { name: 'IRank', display: 'I/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 3) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AirlineCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAirlineRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airline Wise',
                    initRows: 1,
                    columns: [
                             // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'AirlineCode', display: 'Airline Code', type: 'label', },
                              { name: 'AirlineName', display: 'Airline Name', type: 'label' },
                                { name: 'Transit', display: 'Transit', type: 'label' },
                              { name: 'RRank', display: 'T/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }

        }
        else if ($("#Type").val() == 2) {

            if ($("#CargoType").val() == 0) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'DestinationCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingDestinationRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airport Wise',
                    initRows: 1,
                    columns: [
                             // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'DestinationCode', display: 'Airport Code', type: 'label', },
                              { name: 'Destination', display: 'Airport', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' },
                              { name: 'Import', display: 'Import', type: 'label' },
                              { name: 'IRank', display: 'I/Rank', type: 'label' },
                                { name: 'Transit', display: 'Transit', type: 'label' },
                              { name: 'RRank', display: 'T/Rank', type: 'label' },

                              { name: 'Total', display: 'Total', type: 'label', },
                              { name: 'Rank', display: 'Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 1) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'DestinationCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                           '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingDestinationRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airport Wise',
                    initRows: 1,
                    columns: [
                    // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'DestinationCode', display: 'Airport Code', type: 'label', },
                              { name: 'Destination', display: 'Airport', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 2) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'DestinationCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                               '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingDestinationRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airport Wise',
                    initRows: 1,
                    columns: [
                    // { name: 'SNo', type: 'hidden', value: '0' },
                               { name: 'DestinationCode', display: 'Airport Code', type: 'label', },
                               { name: 'Destination', display: 'Airport', type: 'label' },

                               { name: 'Import', display: 'Import', type: 'label' },
                               { name: 'IRank', display: 'I/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 3) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'DestinationCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                                   '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingDestinationRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Airport Wise',
                    initRows: 1,
                    columns: [
                    // { name: 'SNo', type: 'hidden', value: '0' },
                                   { name: 'DestinationCode', display: 'Airport Code', type: 'label', },
                                   { name: 'Destination', display: 'Airport', type: 'label' },
                                     { name: 'Transit', display: 'Transit', type: 'label' },
                                   { name: 'RRank', display: 'T/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }


        }
        else if ($("#Type").val() == 3) {

            if ($("#CargoType").val() == 0) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AgentCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAgentRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Agent Wise',
                    initRows: 1,
                    columns: [
                              { name: 'AgentCode', display: 'Agent Code', type: 'label', },
                              { name: 'Agent', display: 'Agent', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' },
                              { name: 'Import', display: 'Import', type: 'label' },
                              { name: 'IRank', display: 'I/Rank', type: 'label' },
                              { name: 'Transit', display: 'Transit', type: 'label' },
                              { name: 'RRank', display: 'T/Rank', type: 'label' },
                              { name: 'Total', display: 'Total', type: 'label', },
                              { name: 'Rank', display: 'Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 1) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AgentCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAgentRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Agent Wise',
                    initRows: 1,
                    columns: [
                    // { name: 'SNo', type: 'hidden', value: '0' },
                              { name: 'AgentCode', display: 'Agent Code', type: 'label', },
                              { name: 'Agent', display: 'Agent', type: 'label' },
                              { name: 'Export', display: 'Export', type: 'label' },
                              { name: 'ERank', display: 'E/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 2) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AgentCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                        '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAgentRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Agent Wise',
                    initRows: 1,
                    columns: [
                               { name: 'AgentCode', display: 'Agent Code', type: 'label', },
                               { name: 'Agent', display: 'Agent', type: 'label' },
                               { name: 'Import', display: 'Import', type: 'label' },
                               { name: 'IRank', display: 'I/Rank', type: 'label' }

                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }
            else if ($("#CargoType").val() == 3) {
                $('#tbl' + dbtableName).appendGrid({
                    tableID: 'tbl' + dbtableName,
                    contentEditable: true,
                    isGetRecord: true,
                    tableColume: 'AgentCode',
                    masterTableSNo: 1,
                    currentPage: 1, itemsPerPage: 500000, whereCondition: '' + FDate +
                       '*' + TDate + '*' + CType + '*' + Filter + '', sort: '',
                    servicePath: './Services/Report/CargoRankingEIService.svc',
                    getRecordServiceMethod: 'GetCargoRankingAgentRecord',
                    createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                    deleteServiceMethod: 'DeleteCargoRankingEI',
                    caption: 'Cargo Ranking Agent Wise',
                    initRows: 1,
                    columns: [
                                   { name: 'AgentCode', display: 'Agent Code', type: 'label', },
                                   { name: 'Agent', display: 'Agent', type: 'label' },
                                   { name: 'Transit', display: 'Transit', type: 'label' },
                                   { name: 'RRank', display: 'T/Rank', type: 'label' }
                    ],
                    hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                    isPaging: true,
                });
            }

        }


    }

}

