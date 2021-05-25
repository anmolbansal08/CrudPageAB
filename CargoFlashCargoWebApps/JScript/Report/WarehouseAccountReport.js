/// <reference path="../../PermissionScripts/jquery.appendGrid-1.3.1.js" />
/// <reference path="../../PermissionScripts/jquery.appendGrid-1.3.2.js" />

//<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script>
var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "WareHouseAccountReport_CarrierCode", null, "contains");
   
    // cfi.AutoComplete("ConAWBPrefix", "AirlineCode", "vwAirline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");

    cfi.AutoCompleteV2("AWBSNo", "AWBNo", "WareHouseAccountReport_AWBNo", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCODE,AirportName", "WareHouseAccountReport_AirportName", null, "contains");


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

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "") {
        $("#AirlineSNo").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }

    $('#imgexcel').hide();
   $('#example').hide();
});




//var AirlineSNo = "";
//var OriginSNo = "";
//var FromDate = "";
//var ToDate = "";
//var AWBSNo = "";
//var ReportType = "";
var Model = [];

function SearchWarehouseAccountReport() {

    Model = {
        AirlineSNo: $('#AirlineSNo').val(),
        OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        AWBSNo: $('#AWBSNo').val() == "" ? "0" : $('#AWBSNo').val(),
        ReportType: $('input[type="radio"][name=Filter]:checked').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)
     };

    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }
    $("#tbltracking").show();
    $('#theadid').html('');
    $('#tbodyid').html('');
    AirlineSNo = $('#AirlineSNo').val();
    if (AirlineSNo != undefined && $('#ToDate').val() != undefined && $('#FromDate').val() != undefined) {
        if (AirlineSNo != "" && $('#ToDate').val() != "" && $('#FromDate').val() != "") {
            if (OnBlob) {
                $.ajax({
                    url: "../Reports/WarehouseAccountingReport",
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
              
                $.ajax({
                    url: "../WarehouseAccountReport/WarehouseAccountReportGetRecord",
                    contentType: "application/json; charset=utf-8",
                    data:JSON.stringify(Model),
                    async: false,
                    type: 'post',
                    cache: false,
                    success: function (result) {
                        var dataTableobj = JSON.parse(result);
                        var unique = "";
                        var Result1 = "";
                        var Result2 = ""
                        var Result = "";
                        var Result3 = "";
                        var Result4 = "";
                        if (dataTableobj.Table1 != undefined) {
                            if (dataTableobj.Table1.length > 0) {
                                Result1 = dataTableobj.Table1
                            }
                        }
                        if (dataTableobj.Table3 != undefined) {
                            if (dataTableobj.Table3.length > 0) {
                                Result3 = dataTableobj.Table3
                                var columnsInDistinct = Result3[0];
                                var arr = [];


                                if (Result3.length > 0) {

                                    for (var i = 0; i < Result3.length; i++) {
                                        var columnsIn = Result3[0];
                                        for (var key in columnsIn) { // Printing Columns
                                            //if (i == 0) {
                                            //  if (Key == 'TariffIdName')
                                            if (key == 'TariffIdName') {
                                                if (Result3[i]["TariffIdName"] != '') {
                                                    arr.push(Result3[i][key]);
                                                    unique = arr.filter(function (itm, i, arr) {
                                                        return i == arr.indexOf(itm);
                                                    });
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                        }
                        if (dataTableobj.Table2 != undefined) {
                            if (dataTableobj.Table2.length > 0) {
                                Result2 = dataTableobj.Table2
                            }
                        }
                        if (dataTableobj.Table4 != undefined) {
                            if (dataTableobj.Table4.length > 0) {
                                Result4 = dataTableobj.Table4
                            }
                        }

                        if (dataTableobj.Table0.length > 0) {

                            Result = dataTableobj.Table0
                            var thead_body = "";
                            var thead_body_subheader = "";
                            var thead_row = "";
                            thead_body = '<td class="ui-widget-header" id="WarehouseLocation"> WarehouseLocation </td>' +                          '<td class="ui-widget-header" id="IssueDate"> IssueDate </td>' +                          '<td class="ui-widget-header" id="ArrivalDate"> ArrivalDate </td>' +                      '<td class="ui-widget-header" id="OriginAirportCode"> OriginAirportCode </td>' +                          '<td class="ui-widget-header" id="DestinationAirportCode"> DestinationAirportCode </td>' +                              '<td class="ui-widget-header" id="FlightNo"> FlightNo </td>' +                                  '<td class="ui-widget-header" id="AirlineCode">  AirlineCode </td>' +                                      '<td class="ui-widget-header" id="InvoiceNo"> InvoiceNo </td>' +                                          '<td class="ui-widget-header" id="AWBNo"> AWBNo </td>' +                                              '<td class="ui-widget-header" id="CustomerName"> CustomerName </td>' +                                                  '<td class="ui-widget-header" id="Commodity"> Commodity </td>' +                                                      '<td class="ui-widget-header" id="HouseNo"> HouseNo </td>' +                                                          '<td class="ui-widget-header" id="Days"> Days </td><td class="ui-widget-header" id="Pieces"> Pieces </td>' +                      '<td class="ui-widget-header" id="GrossWeight"> GrossWeight </td>' +                          '<td class="ui-widget-header" id="ChargeableWeight"> ChargeableWeight </td>' +                              '<td class="ui-widget-header" id="TotalWarehouseSharing"> TotalWarehouseSharing </td>' +                                    '<td class="ui-widget-header" id="TotalWarehouseSharing"> VatOut </td>' +                                      '<td class="ui-widget-header" id="TotalWarehouseSharing"> TotalCharges </td>' +                                        '<td class="ui-widget-header" id="TotalWarehouseSharing"> PaymentType </td>' +                                           '<td class="ui-widget-header" id="TotalWarehouseSharing"> PaymentDifference </td>' +                                              '<td class="ui-widget-header" id="TotalWarehouseSharing"> TotalPayment </td>' +                                                 '<td class="ui-widget-header" id="TotalWarehouseSharing"> TotalAmount </td>' +                                                    '<td class="ui-widget-header" id="TariffIdName"> TariffIdName </td>'


                            thead_body_subheader = '<td class="ui-widget-header" id="WarehouseLocation">  </td>' +                         '<td class="ui-widget-header" id="IssueDate">  </td>' +                         '<td class="ui-widget-header" id="ArrivalDate">  </td>' +                     '<td class="ui-widget-header" id="OriginAirportCode">  </td>' +                         '<td class="ui-widget-header" id="DestinationAirportCode">  </td>' +                             '<td class="ui-widget-header" id="FlightNo">  </td>' +                                 '<td class="ui-widget-header" id="AirlineCode">   </td>' +                                     '<td class="ui-widget-header" id="InvoiceNo">  </td>' +                                         '<td class="ui-widget-header" id="AWBNo">  </td>' +                                             '<td class="ui-widget-header" id="CustomerName">  </td>' +                                                 '<td class="ui-widget-header" id="Commodity">  </td>' +                                                     '<td class="ui-widget-header" id="HouseNo">  </td>' +                                                         '<td class="ui-widget-header" id="Days">  </td><td class="ui-widget-header" id="Pieces">  </td>' +                     '<td class="ui-widget-header" id="GrossWeight">  </td>' +                         '<td class="ui-widget-header" id="ChargeableWeight">  </td>' +                             '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                               '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                                 '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                                   '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                                     '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                                       '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                                          '<td class="ui-widget-header" id="TotalWarehouseSharing">  </td>' +                                                   '<td class="ui-widget-header" id="TariffIdNamesub">  </td>'

                            if (Result3.length > 0) {

                                for (var i = 0; i < unique.length; i++) {
                                    var columnsIn = Result3[0];// Coulms Name geting from First Row

                                    for (var key in columnsIn) { // Printing Columns

                                        if (key == 'TariffIdName') {
                                            if (Result3[i]["TariffIdName"] != '') {
                                                var idname = unique[i];
                                                var idnamewithspace = idname.split(" ").join("")
                                                if (Result4.length > 0) {
                                                    var string = Result4[0]["Vendor"]
                                                    var array = string.split(',');
                                                    thead_body += '<td class="ui-widget-header" id="' + idnamewithspace + '" colspan=' + array.length + '>' + unique[i] + '</td>'

                                                    for (var tt = 0; tt < array.length; tt++) {
                                                        //thead_body_subheader += '<td class="ui-widget-header" id="TotalAmount__' + idnamewithspace + '" colspan="">TotalAmount<span style="display:none" id="TotalAmount_' + tt + ' ">"</span></td>'

                                                        thead_body_subheader += '<td class="ui-widget-header" id="' + array[tt].replace(/\s|\[|\]/g, " ") + '__' + idnamewithspace + '" colspan="">' + array[tt] + '<span style="display:none" id="' + array[tt] + '_' + tt + ' ">"</span></td>'

                                                    }


                                                }

                                            }
                                        }


                                    }

                                }


                            }
                            $('#theadid').append('<tr>' + thead_body + '</tr>');
                            $('#theadid').append('<tr>' + thead_body_subheader + '</tr>');



                            if (Result.length > 0) {
                                for (var i = 0; i < Result.length;) {
                                    var columnsIn = Result[0];// Coulms Name geting from First Row
                                    thead_row += '<tr>'
                                    for (var key in columnsIn) { // Printing Columns

                                        if (key == "AWBNo") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "AirlineCode") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "ArrivalDate") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "ChargeableWeight") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "Commodity") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "CustomerName") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "Days") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "WarehouseLocation") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "IssueDate") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "FlightDate") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "OriginAirportCode") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "DestinationAirportCode") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "FlightNo") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }

                                        if (key == "InvoiceNo") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }



                                        if (key == "HouseNo") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }

                                        if (key == "Pieces") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "GrossWeight") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }

                                        if (key == "TotalWarehouseSharing") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }


                                        if (key == "VatOut") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "TotalCharges") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "PaymentType") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "PaymentDifference") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "TotalPayment") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }
                                        if (key == "TotalAmount") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }

                                        if (key == "UTariffIdName") {
                                            thead_row += "<td class='ui-widget-content'  id=" + key + "_" + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label><span style='display:none' id=" + key + "_" + i + ">" + Result[i][key] + "</span></td>";

                                        }

                                        var lengthsubheader = $('span[id*="TotalAmount_"]').length;
                                        if (lengthsubheader > 0 && key != "WarehouseLocation" && key != "IssueDate"
                                            && key != "FlightDate" && key != "OriginAirportCode"
                                            && key != "DestinationAirportCode" && key != "FlightNo"
                                            && key != "AirlineCode" && key != "InvoiceNo"
                                            && key != "AWBNo" && key != "CustomerName"
                                             && key != "Commodity" && key != "HouseNo"
                                            && key != "Days" && key != "Pieces"
                                            && key != "GrossWeight" && key != "ChargeableWeight"
                                            && key != "TotalWarehouseSharing"
                                          && key != "VatOut"
                                            && key != "TotalCharges" && key != "PaymentType"
                                              && key != "TotalAmount" && key == "UTariffIdName"
                                            && key != "PaymentDifference" && key != "TotalPayment") {




                                            var tariifidnameindex = 25
                                            if (unique.length > 0) {
                                                for (var kk = 0; kk < unique.length;) {



                                                    var columnsIn = Result1[0];// Coulms Name geting from First Row
                                                    var idnamewithspace = unique[kk]
                                                    var tariiffname = idnamewithspace.split(" ").join("")



                                                    for (var key in columnsIn) {
                                                        if (Result4.length > 0) {
                                                            var string = Result4[0]["Vendor"]
                                                            var array = string.split(',');

                                                            if (key == "TariffIdName")
                                                                if (Result1[i]["TariffIdName"] != '') {
                                                                    for (var tt = 0; tt < array.length; tt++) {

                                                                        thead_row += "<td class='ui-widget-content'  id='" + array[tt].replace(/\s|\[|\]/g, "") + "_" + tariiffname + "_" + i + "'> <label  maxlength='100' style='width:100px;'  id='" + array[tt].replace(/\s|\[|\]/g, "") + "_" + tariiffname + "_" + i + "'></label><span style='display:none'  id='" + array[tt].replace(/\s|\[|\]/g, "") + "_" + tariiffname + "_" + i + "'></span></td>";



                                                                    }
                                                                }

                                                        }




                                                    }
                                                    //
                                                    //  counterCheck++;
                                                    kk++;
                                                    if (kk == unique.length) {
                                                        break;
                                                    }

                                                }
                                            }

                                        }

                                        /// }

                                    }

                                    thead_row += '</tr>'

                                    i++;
                                    if (i == Result.length) {
                                        break;
                                    }
                                }

                            }
                            else {
                                alert("No Record found");
                            }
                            $('#tbodyid').append(thead_row);
                        }
                        var p = 0;
                        var counterCheck = 0;
                        if (Result.length > 0) {
                            for (var i = 0; i < Result.length; i++) {

                                if (i != 0) {
                                    if (Result[i]["AWBSNo"] == Result[i - 1]["AWBSNo"]) {

                                        continue;
                                    }

                                }
                                if (unique.length > 0) {
                                      for (var m = 0; m < Result1.length; m++) {

                                          if (m > Result2[p].awbsno-1)
                                          {
                                              break;
                                          }
                                        for (var j = 0; j < unique.length;) {
                                            if (counterCheck >= Result1.length) {
                                                break;
                                            }
                                            var idnamewithspace = Result1[counterCheck]["TariffIdName"];
                                            var awbno = Result1[counterCheck]["AWBNo"];
                                            var tariiffname = idnamewithspace.split(" ").join("")
                                            var tariffuniqname = unique[j];
                                            var tarifdistinctname = tariffuniqname.split(" ").join("")

                                            if (Result4.length > 0) {
                                                var string = Result4[0]["Vendor"]
                                                var array = string.split(',')


                                                for (var tt = 0; tt < array.length; tt++) {

                                                    $('#' + array[tt].replace(/\s|\[|\]/g, "") + "_" + tariiffname + "_" + i).html(Result1[counterCheck][array[tt].replace(/\s|\[|\]/g, " ").trim()]);
                                                }


                                            }
                                            j++;
                                        }
                                    counterCheck++;
                                      }
                                      p++;
                                }


                            }
                        }

                        else {
                            alert("No Record found");
                        }
                        if ($('td[id=TariffIdName]').length > 0) {
                            $('td[id=TariffIdName]').remove()
                        }
                        if ($('td[id=TariffIdNamesub]').length > 0) {
                            $('td[id=TariffIdNamesub]').remove()
                        }

                        if ($('td[id^=UTariffIdName_]').length > 0) {
                            $('td[id^=UTariffIdName_]').remove()
                        }


                        $(".k-grid-header-wrap").closest('div').attr('style', 'overflow: scroll;height:400px;');
                        $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                        $("#Serial").closest('td').attr('style', 'color:#daecf4');
                        $("#Serial").closest('td').text('Seri');
                        $('#example').show();
                        $('#imgexcel').show();



                    },
                    //error: function (err) {
                    //    alert("Generated Error");
                    //}
                });
            }

        }
    }
}


function checkValue(value, arr) {
    var status = 'Not exist';

    for (var i = 0; i < arr.length; i++) {
        var name = arr[i];
        if (name == value) {
            status = 'Exist';
            break;
        }
    }

    return status;
}
function ExtraCondition(textId) {
    //var filterAirline = cfi.getFilter("AND");
    //if (textId == "Text_AirlineSNo") {
    //    cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //    return OriginCityAutoCompleteFilter2;
    //}
}


function ExportToExcel_PostFlight() {

    //AirlineSNo = $('#AirlineSNo').val();
    //OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    //FromDate = $("#FromDate").val();
    //ToDate = $("#ToDate").val();
    //AWBSNo = $('#AWBSNo').val() == "" ? "0" : $('#AWBSNo').val();
    //ReportType = $('input[type="radio"][name=Filter]:checked').val();

    //if (AirlineSNo != "" && FromDate != "" && ToDate != "") {

    //    //AirlineSNo: AirlineSNo, OriginSNo: OriginSNo, FromDate: FromDate, ToDate: ToDate, AWBSNo: AWBSNo, ReportType: ReportType

    //    window.location.href = "../WarehouseAccountReport/ExportToExcel?AirlineSNo=" + AirlineSNo + "&OriginSNo=" + OriginSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&AWBSNo=" + AWBSNo + "&ReportType=" + ReportType;

    //}


        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '_' + mm + '_' + yyyy;


        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#tblsearchrateList').html() + '</table></body></html>';
        //var table_div = '<table>' + $('#tbl_bookingprofile').html() + '</table>';
        var table_html = table_div.replace(/ /g, '%20');
        a.href = data_type + ', ' + table_html;
        a.download = 'WarehouseAccountingReport' + today + '_.xls';
        a.click();

        return false

}