
$(document).ready(function () {

    //GetInvoiceReportRecord();
    CreditInvoiceSummary();
    //js2pdf();     
})
var urls = "";
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function GetInvoiceReportRecord() {
    var AirlineInvoiceSNo = getParameterByName("AirlineInvoiceSNo", (urls == "") ? "" : urls);
    var ObjAgentOrAirline = getParameterByName("ObjAgentOrAirline", (urls == "") ? "" : urls);
    var PrintType = getParameterByName("PrintType", (urls == "") ? "" : urls);
    var ProcedureName = "";
    if (AirlineInvoiceSNo == "" || AirlineInvoiceSNo == "0") {
        ShowMessage('warning', 'Warning - Invoice Report', "Record not found.");
    }
    if (AirlineInvoiceSNo == undefined) {
        return;
    }
    else {
        //ObjAgentOrAirline =  0 means agent and ObjAgentOrAirline =  1 means airline
        var path = window.location.protocol + '//' + window.location.href.split('/Default')[0].split('//')[1];
        ProcedureName = (ObjAgentOrAirline == 0) ? 'CI_GetInvoiceReportForAgent' : 'CI_GetInvoiceReportForAirline';
        var newurl = (urls == "" ? "../../Services/Tariff/TariffInvoiceService.svc/GetInvoiceReport" : path + "/Services/Tariff/TariffInvoiceService.svc/GetInvoiceReport");
        $.ajax({
            url: newurl,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AirlineInvoiceSNo: AirlineInvoiceSNo || 0, ProcedureName: ProcedureName }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;
                var resData2 = Data.Table2;
                var resData3 = Data.Table3;
                var resData4 = Data.Table4;
                var resData5 = Data.Table5;
                var resData6 = Data.Table6;
                var resData7 = Data.Table7;
                var resData8 = Data.Table8;
                var resData9 = Data.Table9;
                var resData10 = Data.Table10;
                var resData11 = Data.Table11;
                var resData12 = Data.Table12;
                var resData13 = Data.Table13;
                var resData14 = Data.Table14;
                var resData15 = Data.Table15;
                var resData16 = Data.Table16;
                


                if (resData.length > 0) {
                    for (var key in resData) {
                        $('#tblData').append('<tr style=\" page-break-inside:avoid; page-break-after: always\"><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[key].ChargeName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;" align="right">' + resData[key].ChargeAmount + '</td></tr>');
                    }
                }

                if (resData1.length > 0) {
                    $("span#spnChargeAmount").text(resData1[0].ChargeAmount);
                    $("span#spnChargeAmountInWords").text(resData1[0].ChargeAmountInWords);

                }
                var resDataItem = "";
                if (resData3.length > 0) {
                    resDataItem = resData3[0].ColumnHeader.split(',');
                    var tbody = '';
                    tbody += '<tr>';
                    for (var i = 0; i <= resDataItem.length - 1; i++) {
                        tbody += '<td>';
                        tbody += resDataItem[i] == "INVOICENO" ? "WORK ORDER NO" : (resDataItem[i] == "INVOICEDATE" ? "WORK ORDER DATE" : (resDataItem[i] == "AWBNO" ? "AWB NO" : (resDataItem[i] == "FLTDATE" ? "FLIGHT DATE" : (resDataItem[i] == "FLIGHTNO" ? "FLIGHT NO" : (resDataItem[i] == "HEADNAME" ? "HEAD NAME" : (resDataItem[i] == "TARIFFRATE" ? "TARIFF RATE" : (resDataItem[i] == "AMOUNT" ? "AMOUNT" : (resDataItem[i] == "ORG" ? "ORG" : (resDataItem[i] == "DES" ? "DEST" : (resDataItem[i] == "WT" ? "WT" : "REMARKS"))))))))));
                        tbody += '</td>'
                    }
                    tbody += '</tr>';
                }
                var resData3Value = "";
                if (resData4.length > 0) {
                    for (var key in resData4) {
                        tbody += '<tr style=\"page-break-after:always\">';
                        var key1 = "";
                        if ((resData4[key]["INVOICENO"] == "" || resData4[key]["INVOICENO"] == undefined) && (resData4[key]["INVOICEDATE"] == "" || resData4[key]["INVOICEDATE"] == undefined)) {
                            key1 = key;
                        }
                        for (var i = 0; i <= resDataItem.length - 1; i++) {
                            resData3Value = resDataItem[i].toString().trim();

                            if (key1 != "") {
                                if (resData4[key1][resData3Value] != "" && resData4[key1][resData3Value] != undefined) {
                                    tbody += '<td align="center" id="' + resData3Value + "_" + key1 + '" style="\;border-top:1px solid black;font-weight:bold;border-right:1px solid black;padding:2px;font-family:sans-serif;font-size: 10px; word-wrap: break-word; max-width: 200px;\">';
                                    tbody += resData4[key1][resData3Value];
                                }
                            }
                            else {
                                tbody += '<td style="\;border-top:1px solid black;border-right:1px solid black;padding:2px;font-family:sans-serif;font-size: 10px; word-wrap: break-word; max-width: 200px;\">';
                                tbody += resData4[key][resData3Value];
                            }
                            tbody += '</td>'
                        }
                        tbody += '</tr>';
                    }

                    $('#tblInvoiceDetails').append(tbody);
                    $("#tblInvoiceDetails").find("tr:first > td").css({ "border-right": "1px solid black", "background": "#ffffff", "color": "#000000", "padding": "2px", "font-family": "sans-serif", "font-size": "11px", "font-weight": "bold" });
                    $("#tblInvoiceDetails").find("tr").find("td:eq(0)").next().attr("align", "CENTER");
                    $("#tblInvoiceDetails").find("tr").find("td:eq(5)").nextAll().attr("align", "right");
                    

                    $("#tblInvoiceDetails").find("tr:last > td").css({ "border": "1px solid #ffffff", "background": "#ffffff", "color": "#000000", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                    $('#tblInvoiceDetails tr').find('td:last').css('border-right', '');
                    $('#tblInvoiceDetails tr:last').find('td').css('border-top', '1px solid black');
                    $('#tblInvoiceDetails tr:first td').css('text-align', 'center');

                    var len = $("#tblInvoiceDetails tr:first").find('td').length - 1;
                    $("#tblInvoiceDetails tr").find('td[id]:first').closest('tr').find("td:first").attr('colspan', len);
                    $("#tblInvoiceDetails tr").find('td[id]:first').closest('tr').find("td:first").css('border-right', '');
                    $("#tblInvoiceDetails tr").find('td[id]:first').closest('tr').find("td:last").css('text-align', 'right');
                    $("td[id^='HEADNAME_']").parent('tr').each(function () {
                        if ($(this).find('td').length === 1) {
                            $(this).append('<td  align="center" style="border-top:1px solid black;padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;"></td>');
                        }
                        else if ($(this).find('td').length > 1) {
                            $(this).after('<tr><td  colspan="' + (len + 1) + '" style="border-top:1px solid black;padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;"></td></tr>');
                        }
                    });
                    $("td[id^='HEADNAME_']").css('text-align', 'left');
                }
                if (resData2.length > 0) {
                    $("span#spnName").text(resData2[0].AirlineName);
                    $("span#spnAddress").text(resData2[0].Address);
                    $("span#spnPhoneNo").text(resData2[0].PhoneNo);
                    $("span#spnFaxNo").text(resData2[0].FaxNo);
                    $("span#spnInvoiceDate").text(resData2[0].InvoiceDate);
                    $("span#spnPeriodDate").text(resData2[0].PeriodDetails);
                    $("span#spnInvoiceNo").text(resData2[0].InvoiceNo);
                    $("span#spnHeader").text((resData2[0].InvoiceNo == undefined || resData2[0].InvoiceNo == "") ? "PROVISIONAL INVOICE" : "INVOICE");
                    $("span#spnHeader1").text((resData2[0].InvoiceNo == undefined || resData2[0].InvoiceNo == "") ? "PROVISIONAL INVOICE DETAILS" : "INVOICE DETAILS");
                    $("span#spnCurrencyCode").text(resData2[0].CurrencyCode);
                    $("td#tdParty").text(resData2[0].Name);
                    $("td#tdType").text(resData2[0].Period);
                    $("td#tdPeriod").text(resData2[0].BillDate);
                    $("span#spnInvoicedate").text(resData2[0].BillDate);
                    $("td#tdStartDate").text(resData2[0].StartDate);
                    $("td#tdEndDate").text(resData2[0].EndDate);
                    $("td#tdSummary").text("Report - " + resData2[0].Period);

                    $("span#spanUserName").text('(' + resData2[0].CreatedOn + ') ' + resData2[0].UserName);

                    //$("span#spnFaxNo").text(resData2[0].FaxNo);                    
                }


                if ($('div#divHeight').height() < 940) {
                    $('td#tdHeight').height(940 - $('div#divHeight').height());
                }
                if (ObjAgentOrAirline == 0) {
                    //$('#tblHandlingChargesImportTR1').remove();
                    //$('#tblHandlingChargesImportTR2').remove();
                    //$('#tblHandlingChargesImport').remove();

                    //$('#tblHandlingChargesImport-TransitTR1').remove();
                    //$('#tblHandlingChargesImport-TransitTR2').remove();
                    //$('#tblHandlingChargesImport-Transit').remove();

                    //$('#tblHandlingChargesExportTR1').remove();
                    //$('#tblHandlingChargesExportTR2').remove();
                    //$('#tblHandlingChargesExport').remove();

                    //$('#tblHandlingChargesExport-TransitTR1').remove();
                    //$('#tblHandlingChargesExport-TransitTR2').remove();
                    //$('#tblHandlingChargesExport-Transit').remove();

                    $('#tblHandlingChargesStorageTR1').remove();
                    $('#tblHandlingChargesStorageTR2').remove();
                    $('#tblHandlingChargesStorage').remove();

                    $('#tblInvoiceDetails').closest('tr').nextAll().remove();
                }
                else {
                    //if (resData5.length > 0) {
                    //    for (var key in resData5) {
                    //        if (resData5[0].Type == "Total" || resData5[0].Type == undefined) {
                    //            $("tr#tblHandlingChargesImportTR1").remove();
                    //            $("tr#tblHandlingChargesImportTR2").remove();
                    //            $("#tblHandlingChargesImport").remove();
                    //        }
                    //        else {
                    //            $("#tblHandlingChargesImport").append('<tr><td style="padding: 2px; border-top: 1px solid black; border-right: 1px solid black; font-family: sans-serif; font-size: 10px;">' + resData5[key].Type + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].AWBNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].AWBOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].AWBDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].FlightNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].FlightDate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].FlightOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].FlightDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].Pieces + '</td><td style="border-top: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData5[key].TotalGrossWeight + '</td></tr>');
                    //        }

                    //    }
                    //    $("#tblHandlingChargesImport").find("tr:last > td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                    //    $('#tblHandlingChargesImport tr').find('td:last').css('border-right', '');
                    //    $('#tblHandlingChargesImport tr:last').find('td').css('border-top', '1px solid black');
                    //    $('#tblHandlingChargesImport tr').find('td:nth-last-child(1)').css('text-align', 'right');
                    //    $('#tblHandlingChargesImport tr').find('td:nth-last-child(2)').css('text-align', 'right');
                    //    $('#tblHandlingChargesImport tr:first td').css('text-align', 'center');

                    //}
                    //if (resData6.length > 0) {
                    //    if (resData6[0].Type == "Total" || resData6[0].Type == undefined) {
                    //        $("tr#ttblHandlingChargesImport-TransitTR1").remove();
                    //        $("tr#tblHandlingChargesImport-TransitTR2").remove();
                    //        $("#tblHandlingChargesImport-Transit").remove();
                    //    }
                    //    else {
                    //        for (var key in resData6) {
                    //            $("#tblHandlingChargesImport-Transit").append('<tr><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].Type + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].AWBNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].AWBOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].AWBDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].FlightNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].FlightDate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].FlightOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].FlightDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].Pieces + '</td><td style="border-top: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData6[key].GrossWeight + '</td></tr>');
                    //        }
                    //        $("#tblHandlingChargesImport-Transit").find("tr:last > td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                    //        $('#tblHandlingChargesImport-Transit tr').find('td:last').css('border-right', '');
                    //        $('#tblHandlingChargesImport-Transit tr:last').find('td').css('border-top', '1px solid black');
                    //        $('#tblHandlingChargesImport-Transit tr').find('td:nth-last-child(1)').css('text-align', 'right');
                    //        $('#tblHandlingChargesImport-Transit tr').find('td:nth-last-child(2)').css('text-align', 'right');
                    //        $('#tblHandlingChargesImport-Transit tr:first td').css('text-align', 'center');
                    //    }
                    //}

                    //if (resData7.length > 0) {

                    //    if (resData7[0].Type == "Total" || resData7[0].Type == undefined) {
                    //        $("tr#tblHandlingChargesExportTR1").remove();
                    //        $("tr#tblHandlingChargesExportTR2").remove();
                    //        $("#tblHandlingChargesExport").remove();
                    //    }
                    //    else {
                    //        for (var key in resData7) {
                    //            $("#tblHandlingChargesExport").append('<tr><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].Type + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].AWBNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].AWBOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].AWBDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].FlightNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].FlightDate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].FlightOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].FlightDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].Pieces + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData7[key].GrossWeight + '</td></tr>');
                    //        }
                    //        $("#tblHandlingChargesExport").find("tr:last > td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                    //        $('#tblHandlingChargesExport tr').find('td:last').css('border-right', '');
                    //        $('#tblHandlingChargesExport tr:last').find('td').css('border-top', '1px solid black');
                    //        $('#tblHandlingChargesExport tr').find('td:nth-last-child(1)').css('text-align', 'right');
                    //        $('#tblHandlingChargesExport tr').find('td:nth-last-child(2)').css('text-align', 'right');
                    //        $('#tblHandlingChargesExport tr:first td').css('text-align', 'center');
                    //    }
                    //}


                    //if (resData8.length > 0) {
                    //    if (resData8[0].Type == "Total" || resData8[0].Type == undefined) {
                    //        $("tr#tblHandlingChargesExport-TransitTR1").remove();
                    //        $("tr#tblHandlingChargesExport-TransitTR2").remove();
                    //        $("#tblHandlingChargesExport-Transit").remove();
                    //    }
                    //    else {
                    //        for (var key in resData8) {
                    //            $("#tblHandlingChargesExport-Transit").append('<tr><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].Type + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].AWBNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].AWBOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].AWBDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].FlightNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].FlightDate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].FlightOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].FlightDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].Pieces + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData8[key].GrossWeight + '</td></tr>');
                    //        }
                    //        $("#tblHandlingChargesExport-Transit").find("tr:last > td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                    //        $('#tblHandlingChargesExport-Transit tr').find('td:last').css('border-right', '');
                    //        $('#tblHandlingChargesExport-Transit tr:last').find('td').css('border-top', '1px solid black');
                    //        $('#tblHandlingChargesExport-Transit tr').find('td:nth-last-child(1)').css('text-align', 'right');
                    //        $('#tblHandlingChargesExport-Transit tr').find('td:nth-last-child(2)').css('text-align', 'right');
                    //        $('#tblHandlingChargesExport-Transit tr:first td').css('text-align', 'center');
                    //    }
                    //}
                    if (resData9.length > 0) {
                        if (resData9[0].AWBNo == "Total" || resData9[0].AWBNo == undefined) {
                            $("tr#tblHandlingChargesStorageTR1").remove();
                            $("tr#tblHandlingChargesStorageTR2").remove();
                            $("#tblHandlingChargesStorage").closest('tr').remove();
                        }
                        else {
                            for (var key in resData9) {
                                $("#tblHandlingChargesStorage").append('<tr><td align="center" nowrap  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].AWBNo + '</td><td align="center"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].AWBOrigin + '</td><td align="center"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].AWBDestination + '</td><td align="center"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;" align="center" >' + resData9[key].FlightNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;" align="center" nowrap  width="80px">' + resData9[key].FlightDate + '</td><td align="center"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].FlightOrigin + '</td><td align="center"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].FlightDestination + '</td><td align="right"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].Pieces + '</td><td width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].GrossWeight + '</td><td  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].StorageTime + '</td><td align="center" width="120px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].StorageRemark + '</td><td align="right"  width="80px" style="border-top: 1px solid black; border-right: 1px solid black; padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData9[key].StorageAmount + '</td></tr>');
                            }
                            $("#tblHandlingChargesStorage").find("tr:last > td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                            $('#tblHandlingChargesStorage tr').find('td:last').css('border-right', '');
                            $('#tblHandlingChargesStorage tr:last').find('td').css('border-top', '1px solid black');
                            $('#tblHandlingChargesStorage tr').find('td:nth-last-child(1)').css('text-align', 'right');
                            $('#tblHandlingChargesStorage tr').find('td:nth-last-child(2)').css('text-align', 'right');
                            $('#tblHandlingChargesStorage tr').find('td:nth-last-child(3)').css('text-align', 'right');
                            $('#tblHandlingChargesStorage tr').find('td:nth-last-child(4)').css('text-align', 'right');
                            $('#tblHandlingChargesStorage tr:first td').css('text-align', 'center');
                        }
                    }
                    if (resData10.length > 0) {
                        if (resData10[0].WorkOrderNo == undefined) {
                            $("tr#tblWorkOrderTR1").remove();
                            $("tr#tblWorkOrderTR2").remove();
                            $("#tblWorkOrder").closest('tr').remove();
                        }
                        else {
                            for (var key in resData10) {
                                $("#tblWorkOrder").append('<tr><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData10[key].WorkOrderNo + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData10[key].WorkOrderDate + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData10[key].ChargeHead + '</td><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData10[key].Description + '</td><td align="right"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData10[key].Amount + '</td></tr>');
                            }
                            $('#tblWorkOrder tr').find('td:last').css('border-right', '');
                            $('#tblWorkOrder tr:last').find('td').css('border-top', '1px solid black');
                            $('#tblWorkOrder tr').find('td:nth-last-child(1)').css('text-align', 'right');
                            $('#tblWorkOrder tr:first td').css('text-align', 'center');
                        }
                    }

                    if (resData15.length > 0) {
                        for (var key in resData15) {

                            $("#tblOffloadedDetails").append('<tr style=\"page-break-after:always\"><tr><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData15[key].AWBNo + '</td><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData15[key].AWBOrigin + '</td><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData15[key].AWBDestination + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData15[key].FlightNo + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData15[key].FlightDate + '</td><td align="right" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData15[key].TotalGrossWeight + '</td></tr>');
                        }
                        $("#tblOffloadedDetails").find("tr:last td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                        $('#tblOffloadedDetails tr').find('td:last').css('border-right', '');
                        $('#tblOffloadedDetails tr:last').find('td').css('border-top', '1px solid black');
                        $('#tblOffloadedDetails tr').find('td:nth-last-child(1)').css('text-align', 'right');
                        $('#tblClericalDetails tr:first td').css('text-align', 'center');
                    }

                    if (resData16.length > 0) {
                        if (resData16[0].AWBNo == "Total" || resData16[0].AWBNo == undefined) {
                            $("tr#tblClericalDetails").remove();
                            $("#ClericalDetailsRow").remove();
                            $("#tblClericalDetails").closest('tr').remove();
                        }
                        else {
                            for (var key in resData16) {

                                $("#tblClericalDetails").append('<tr style=\"page-break-after:always\"><tr><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].AWBNo + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].ShipmentType + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].AWBOrigin + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].AWBDestination + '</td><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].FlightNo + '</td><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].FlightDate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].GrossWeight + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].ClericalRate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].ClericalMinAmount + '</td><td style="border-top: 1px solid black; border-right: 1px solid black; padding:2px;font-family:sans-serif;font-size: 10px;">' + resData16[key].ClericalAmount + '</td></tr>');
                            }
                            $("#tblClericalDetails").find("tr:last td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                            $('#tblClericalDetails tr').find('td:last').css('border-right', '');
                            $('#tblClericalDetails tr:last').find('td').css('border-top', '1px solid black');
                            $('#tblClericalDetails tr').find('td:nth-last-child(1)').css('text-align', 'right');
                            $('#tblClericalDetails tr').find('td:nth-last-child(2)').css('text-align', 'right');
                            $('#tblClericalDetails tr').find('td:nth-last-child(3)').css('text-align', 'right');
                            $('#tblClericalDetails tr').find('td:nth-last-child(4)').css('text-align', 'right');
                            $('#tblClericalDetails tr').find('td:nth-last-child(2)').css('width', '100px');
                            $('#tblClericalDetails tr:first td').css('text-align', 'center');
                        }
                        $('#tblImpClericalDetails tr:first td').css('text-align', 'center');

                    }


                    


                    if (resData11.length > 0) {
                        //if (resData11[0].Type == "Total" || resData11[0].Type == undefined) {
                        //    $("tr#tblHandlingChargesImportFlightWiseTR1").remove();
                        //    $("tr#tblHandlingChargesImportFlightWiseTR2").remove();
                        //    $("#tblHandlingChargesFlightWiseImport").closest('tr').remove();
                        //}
                        //else {
                        for (var key in resData11) {
                            $("#tblHandlingChargesFlightWiseImport").append('<tr><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" >' + resData11[key].FlightNo + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData11[key].FlightDate + '</td><td align="center"  style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData11[key].FlightOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="center">' + resData11[key].FlightDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData11[key].TotalGrossWeight + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData11[key].TotalTransitGrossWeight + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData11[key].TotalGrossWt + '</td></tr>');
                        }
                        $("#tblHandlingChargesFlightWiseImport").find("tr:last td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                        $('#tblHandlingChargesFlightWiseImport tr').find('td:last').css('border-right', '');
                        $('#tblHandlingChargesFlightWiseImport tr:last').find('td').css('border-top', '1px solid black');
                        //}
                    }
                    if (resData12.length > 0) {
                        //if (resData12[0].Type == "Total" || resData12[0].Type == undefined) {
                        //    $("tr#tblHandlingChargesImportTransitFlightWiseTR1").remove();
                        //    $("tr#tblHandlingChargesImportTransitFlightWiseTR2").remove();
                        //    $("#tblHandlingChargesImportTransitFlightWise").closest('tr').remove();
                        //}
                        //else {
                        //    for (var key in resData12) {
                        //        $("#tblHandlingChargesImportTransitFlightWise").append('<tr><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="left">' + resData12[key].FlightNo + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData12[key].FlightDate + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData12[key].FlightOrigin + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData12[key].FlightDestination + '</td><td style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData12[key].Pieces + '</td><td style="border-top: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 11px;font-weight:bold;" align="right">' + resData12[key].GrossWeight + '</td></tr>');
                        //    }
                        //}
                    }

                    if (resData13.length > 0) {
                        //if (resData13[0].Type == "Total" || resData13[0].Type == undefined) {
                        //    $("tr#tblHandlingChargesExportFlightWiseTR1").remove();
                        //    $("tr#tblHandlingChargesExportFlightWiseTR2").remove();
                        //    $("#tblHandlingChargesExportFlightWise").closest('tr').remove();
                        //}
                        //else {
                        for (var key in resData13) {
                            $("#tblHandlingChargesExportFlightWise").append('<tr><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData13[key].FlightNo + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData13[key].FlightDate + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData13[key].FlightOrigin + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData13[key].FlightDestination + '</td><td align="right" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData13[key].GrossWeight + '</td><td align="right" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData13[key].TransitGrossWeight + '</td><td align="right" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData13[key].TotalGrossWt + '</td></tr>');

                        }
                        $("#tblHandlingChargesExportFlightWise").find("tr:last td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                        $('#tblHandlingChargesExportFlightWise tr').find('td:last').css('border-right', '');
                        $('#tblHandlingChargesExportFlightWise tr:last').find('td').css('border-top', '1px solid black');
                        //}
                    }
                    if (resData14.length > 0) {
                        if (resData14[0].Type == "Total" || resData14[0].Type == undefined) {
                            $("tr#tblHandlingChargesExportTransitFlightWiseTR1").remove();
                            $("tr#tblHandlingChargesExportTransitFlightWiseTR2").remove();
                            $("#tblHandlingChargesExportTransitFlightWise").closest('tr').remove();
                        }
                        else {
                            for (var key in resData14) {
                                $("#tblHandlingChargesExportTransitFlightWise").append('<tr><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;">' + resData14[key].FlightNo + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData14[key].FlightDate + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData14[key].FlightOrigin + '</td><td align="center" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData14[key].FlightDestination + '</td><td align="right" style="border-top: 1px solid black; border-right: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 10px;" align="right">' + resData14[key].Pieces + '</td><td align="right" style="border-top: 1px solid black;padding: 2px; font-family: sans-serif; font-size: 11px;font-weight:bold;" align="right">' + resData14[key].GrossWeight + '</td></tr>');
                            }

                            $("#tblHandlingChargesExportTransitFlightWise").find("tr:last td").css({ "background": "#ffffff", "color": "#000000", "border": "1px solid #ffffff", "padding": "2px", "font-family": "sans-serif", "font-size": "12px", "font-weight": "bold" });
                            $('#tblHandlingChargesExportTransitFlightWise tr').find('td:last').css('border-right', '');
                            $('#tblHandlingChargesExportTransitFlightWise tr:last').find('td').css('border-top', '1px solid black');
                        }
                    }
                }

            },
            error: {
            }
        });
        if (PrintType == 1) {
            $('div#dvDetailsinvoice').hide();
            $('#PrintInvoiceReportsNext').hide();
        }
        if (urls == "") {
            $('#tblInvoiceDetails').closest('td').height(($('#tblInvoiceDetails').height()));
            $('#tblHandlingChargesStorage').closest('td').height(($('#tblHandlingChargesStorage').height()));
            $('#tblWorkOrder').closest('td').height(($('#tblWorkOrder').height()));
            $('#tblHandlingChargesFlightWiseImport').closest('td').height(($('#tblHandlingChargesFlightWiseImport').height()));
            $('#tblHandlingChargesImportTransitFlightWise').closest('td').height(($('#tblHandlingChargesImportTransitFlightWise').height()));
            $('#tblHandlingChargesExportFlightWise').closest('td').height(($('#tblHandlingChargesExportFlightWise').height()));
            $('#tblHandlingChargesExportTransitFlightWise').closest('td').height(($('#tblHandlingChargesExportTransitFlightWise').height()));
        }
    }
}

function PrintInvoiceReports() {
    var PrintType = getParameterByName("PrintType", "");
    if (PrintType == 1) {
        $("#containMain").printArea();
    }
    if (PrintType == 2) {
        $("#Containerdiv").printArea();
        //$("#Containerdiv").css("size", "landscape");
        $("#dvDetailsinvoice").printArea();
    }
}
$(document).bind("keyup keydown", function (e) {
    if (e.ctrlKey && e.keyCode == 80) {
        PrintInvoiceReports();
    }
});
//function PrintInvoiceReportsNext() {


//    $("#dvDetailsinvoice").printArea();
//    $("#dvDetailsinvoice").css('width', '8.27in');
//    $("#dvDetailsinvoice").css('min-height', '11.69in');
//}

function js2pdf() {
    var UserSNo = getParameterByName("AirlineInvoiceSNo", (urls == "") ? "" : urls);
    ExportToPDF($('#InvoiceReportContentAll'), [], 'Report', PDFPageType.Portrait, UserSNo);
}



function CreditInvoiceSummary()
{
    var AirlineInvoiceSNo = getParameterByName("AirlineInvoiceSNo", (urls == "") ? "" : urls);
    var ObjAgentOrAirline = getParameterByName("ObjAgentOrAirline", (urls == "") ? "" : urls);
    var PrintType = getParameterByName("PrintType", (urls == "") ? "" : urls);
    var ProcedureName = "";
    if (AirlineInvoiceSNo == "" || AirlineInvoiceSNo == "0") {
        ShowMessage('warning', 'Warning - Invoice Report', "Record not found.");
    }
    if (PrintType == 1) {
        if (AirlineInvoiceSNo == undefined) {
            return;
        }
        else {
            //ObjAgentOrAirline =  0 means agent and ObjAgentOrAirline =  1 means airline
            var path = window.location.protocol + '//' + window.location.href.split('/Default')[0].split('//')[1];
            ProcedureName = (ObjAgentOrAirline == 0) ? 'CI_GetInvoiceReportForAgent_New' : 'CI_GetInvoiceReportForAirline';
            var newurl = (urls == "" ? "/Services/Tariff/TariffInvoiceService.svc/GetInvoiceReport" : path + "/Services/Tariff/TariffInvoiceService.svc/GetInvoiceReport");
            $.ajax({
                url: newurl,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AirlineInvoiceSNo: AirlineInvoiceSNo || 0, ProcedureName: ProcedureName }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    var resData1 = Data.Table1;
                    var resData2 = Data.Table2;
                    var resData3 = Data.Table3;


                    $("span#spnCode").text(resData2[0].AgentCode);
                    $("span#spnName").text(resData2[0].Name);
                    $("span#spnAddress").text(resData2[0].Address);
                    $("span#spnPhone").text(resData2[0].MobileNo);

                    $("span#spnInvoice_No").text(resData2[0].InvoiceNo);
                    $("span#spnInvoice_Date").text(resData2[0].InvoiceDate);
                    $("span#spnPayment_Terms").text(resData2[0].Period);
                    $("span#spnPayment_Due_Date").text(resData2[0].EndDate);

                    $("span#spnPreparedBy").text(resData2[0].CreatedBy);
                    $("span#spnApprovedby").text(resData2[0].ApprovedBy);

                    //$("span#spnTerbilang").text(resData1[resData1.length].ChargeAmountInWords);
                    $("#imgAirline").attr({ "src": "/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + resData2[0].AirlineLogo, height: "90px", width: "200px", "alt": resData2[0].Airline_Name });
                    
                    if (resData.length > 0) {
                        var tbody = ''; var trclass = '';
                        for (var i = 0; i <= resData.length - 1; i++) {
                            tbody += '<tr class="fod">';
                            if (i == 0) trclass = '<td rowspan="' + resData.length + '" align="center" valign="middle">Billing Period Aug</td>'; else trclass = '';
                            tbody += trclass + '<td align="center">' + (i + 1) + '</td><td align="center" colspan="4">' + resData[i].ChargeName + '</td><td align="center">' + resData[i].CurrencyCode + '</td><td align="center">' + resData[i].ChargeAmount + '</td>';
                            tbody += '</tr>';
                        }

                    }

                    if (resData1.length > 0) {
                        for (var i = 0; i <= resData1.length - 1; i++) {
                            tbody += '<tr class="fod"> <td width="100px" colspan="2" style="border-bottom-color: transparent; border-right-color: transparent;" class="top5"></td><td width="100px" colspan="2" style="border-bottom-color: transparent;" class="top5"></td>';
                            tbody += '<td class="top5" width="40%" colspan="2" style="text-align:left">' + resData1[i].ChargeHead + '</td><td class="top5" width="5%" style="text-align:center">' + resData1[i].CurrencyCode + '</td><td class="top5" width="10%" style="text-align:center">' + resData1[i].ChargeAmount + '</td>';
                          
                            tbody += '</tr>';
                        }
                        var ChargeAmountInWords = resData1[(resData1.length) - 1].ChargeAmountInWords;
                        ChargeAmountInWords = ChargeAmountInWords.replace('IDR', '')
                        $("span#spnSpelling").text(ChargeAmountInWords);
                    }
                    if (resData3.length > 0) {
                        
                            tbody += '<tr class="fod"> <td width="100px" colspan="2" style="border-bottom-color: transparent; border-right-color: transparent;" class="top5"></td><td width="100px" colspan="2" style="border-bottom-color: transparent;" class="top5"></td>';
                            tbody += '<td class="top5" width="40%" colspan="2" style="text-align:left">' + resData3[0].Credithead + '</td><td class="top5" width="5%" style="text-align:center">' + resData3[0].CurrencyCode + '</td><td class="top5" width="10%" style="text-align:center">' + resData3[0].ApprovedAmount + '</td>';

                            tbody += '</tr>';
                       
                      
                    }
                    $("#trcharges").after(tbody);
                }
            });
        }
    }
    else
    {


        var path = window.location.protocol + '//' + window.location.href.split('/Default')[0].split('//')[1];
        // add CI_AirlineCreditInvoice proc for Airline bu umar
        ProcedureName = (ObjAgentOrAirline == 0) ? 'CI_pivot_AgentCreditInvoice' : 'CI_AirlineCreditInvoice';  
        var newurl = (urls == "" ? "/Services/Tariff/TariffInvoiceService.svc/GetInvoiceReport" : path + "/Services/Tariff/TariffInvoiceService.svc/GetInvoiceReport");
        $.ajax({
            url: newurl,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AirlineInvoiceSNo: AirlineInvoiceSNo || 0, ProcedureName: ProcedureName }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;
                var resData2 = Data.Table2;
                var resData3 = Data.Table3; // add new  by umar
                var resData4 = Data.Table4; // add new  by umar


                $("span#spnInvoiceNo").text(resData[0].InvoiceNo);
                $("span#spnInvoiceDate").text(resData[0].InvoiceDate);
                $("span#spnPaymentTerms").text(resData[0].StartDate + '-' + resData[0].EndDate);
                $("span#CurrencyCode").text(resData[0].CurrencyCode);


                var resDataItem = "";
                if (resData1.length > 0) {
                    resDataItem = resData1[0].ColumnHeader.split(',');
                    var tbody = '';
                    tbody += '<table width="100%" border="1" cellpadding="0" cellspacing="0"><tr class="fnt">';
                    for (var i = 0; i <= resDataItem.length - 1; i++) {
                        tbody += '<th>';
                        tbody += resDataItem[i].replace('[', '').replace(']', '').replace('_', ' ');
                        tbody += '</th>'
                    }
                    tbody += '</tr>';
                }
                
                //if (resData2.length > 0) {                   
                //    for (var i = 0; i <= resData2.length - 1; i++) {
                //        tbody += '<tr class="fnt">';
                //        tbody += '<td>' + resData2[i].AWBNO + '</td><td>';
                //        tbody += '</tr>';
                //    }

                //}

                var resData3Value = "";
                if (resData2.length > 0) {
                    for (var key in resData2) {
                        tbody += '<tr class="fnt">';
                       for (var i = 0; i <= resDataItem.length - 1; i++) {
                            resData3Value = resDataItem[i].toString().trim();
                            {
                                var isnum = (resData2[key][resData3Value.replace('[', '').replace(']', '').replace(/\s+/g, '')]);
                                if ($.isNumeric(isnum)) { tbody += '<td style="text-align:right">'; } else tbody += '<td>';
                               
                               //tbody += resData2[key][resData3Value.replace('[', '').replace(']', '')];
                                tbody += isnum;
                            }
                            tbody += '</td>'
                        }
                        tbody += '</tr>';
                    }
                }
                tbody += '</table>';
                $("#trinvoicedetails").html(tbody);          


                //$("span#spnTerbilang").text(resData1[resData1.length].ChargeAmountInWords);


                //if (resData.length > 0) {
                //    var tbody = ''; var trclass = '';
                //    for (var i = 0; i <= resData.length - 1; i++) {
                //        tbody += '<tr class="fod">';
                //        if (i == 0) trclass = '<td rowspan="' + resData.length + '" align="center" valign="middle">Billing Period Aug</td>'; else trclass = '';
                //        tbody += trclass + '<td align="center">' + (i + 1) + '</td><td align="center" colspan="4">' + resData[i].ChargeName + '</td><td align="center">' + resData[i].CurrencyCode + '</td><td align="center">' + resData[i].ChargeAmount + '</td>';
                //        tbody += '</tr>';
                //    }

                //}

                //if (resData1.length > 0) {
                //    for (var i = 0; i <= resData1.length - 1; i++) {
                //        tbody += '<tr class="fod"> <td width="100px" colspan="2" style="border-bottom-color: transparent; border-right-color: transparent;" class="top5"></td><td width="100px" colspan="2" style="border-bottom-color: transparent;" class="top5"></td>';
                //        tbody += '<td class="top5" width="40%" colspan="2" style="text-align:left">' + resData1[i].ChargeHead + '</td><td class="top5" width="5%" style="text-align:center">' + resData1[i].CurrencyCode + '</td><td class="top5" width="10%" style="text-align:center">' + resData1[i].ChargeAmount + '</td>';
                //        tbody += '</tr>';
                //    }
                //    var ChargeAmountInWords = resData1[(resData1.length) - 1].ChargeAmountInWords;
                //    ChargeAmountInWords = ChargeAmountInWords.replace('IDR', '')
                //    $("span#spnSpelling").text(ChargeAmountInWords);
                //}
                //$("#trInvoiceDetails").after(tbody);
            }
        });

    }
}