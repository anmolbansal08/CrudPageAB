$(document).ready(function () {
    var today = new Date();
    var MonthArray = [{ Key: "January", Text: "January" }, { Key: "February", Text: "February" }, { Key: "March", Text: "March" }, { Key: "April", Text: "April" }, { Key: "May", Text: "May" }, { Key: "June", Text: "June" }, { Key: "July", Text: "July" }, { Key: "August", Text: "August" }, { Key: "September", Text: "September" }, { Key: "October", Text: "October" }, { Key: "November", Text: "November" }, { Key: "December", Text: "December" }];
    var YearArray = [{ Key: today.getFullYear().toString(), Text: today.getFullYear().toString() }, { Key: (today.getFullYear() - 1).toString(), Text: (today.getFullYear() - 1).toString() }];
    var FortnightArray = [{ Key: "FN", Text: "First Fortnight" }, { Key: "SN", Text: "Second Fortnight" }];
    cfi.AutoCompleteByDataSource("Month", MonthArray);
    cfi.AutoCompleteByDataSource("Year", YearArray);
    cfi.AutoCompleteByDataSource("Fortnight", FortnightArray);
    cfi.AutoCompleteV2("OfficeName", "Name", "CBVSalesReport_OfficeName", null, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,airlinename", "CBVSalesReport_Airline", null, "contains");
    cfi.AutoCompleteV2("Currency", "CurrencyCode,CurrencyName", "CBVSalesReport_Currency", null, "contains");
    $("#imgexcel").hide();
    $("#imgpdf").hide();
    $('#grid').css('display', 'none')
    $('#btnPrint').hide();
});
var Model = [];
var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : ' ';
    return str;
} 
//function GenerateAndViewInvoiceHTML(data)
//{
    
//    $("#imgexcel").show();
//}
function GenerateAndViewInvoiceData() {
    $.ajax({
        url: "../CBVSalesReport/GetInvoiceDetail?AirlineSNo=" + $('#Airline').val() + "&OfficeSNo=" + $('#OfficeName').val() + "&month=" + $('#Month').val() + "&year=" + $('#Year').val() + "&Fortnight=" + $('#Fortnight').val() + "&CurrencySNo=" + $('#Currency').val()+ "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');
            var ResultData = jQuery.parseJSON(result.Data)
            if (ResultData.Table0.length > 0) {
                $(ResultData.Table0).each(function (row, tr) {
                    $.ajax({
                        url: "../Client/" + userContext.SysSetting.ICMSEnvironment + "/Reports/CBVSalesReport/CBVSalesReport.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var TotalGrossWeight = 0, TotalChargeableWeight = 0, TotalRevenue = 0, GTotal = 0,RateCountCol =0;

                            $('#' + DivID).append(result);
                            $('#' + DivID).find('#divrCBVReport').attr('id', 'divrCBVReport_' + row);
                            var HtmlData = $('#' + DivID).find('div[id="divrCBVReport_' + row + '"]');
                            var Data = tr;
                            $(HtmlData).find('#AirlineLogo').attr('src', userContext.SysSetting.LogoURL);
                            $(HtmlData).find("#spnGSA_CSA_Airline").text(Data.GSA_CSA_AirlineName);
                            $(HtmlData).find("#spnFortnight").text(Data.FortNight);
                            $(HtmlData).find("#spnCurrency").text(Data.Currency);
                            $(HtmlData).find("#spnPeriod").text(Data.Period);
                            $(HtmlData).find("#spnARCode").text(Data.ARCode);
                            $(HtmlData).find("#spnInvoiceNo").text(Data.InvoiceNo);
                            $(HtmlData).find("#spnType").text(Data.Type);
                            $(HtmlData).find("#spnCarrierCode1").text(Data.CarrierCode);
                            $(HtmlData).find("#spnCarrierCode2").text(Data.CarrierCode);
                            $(HtmlData).find("#spnCarrierCode3").text(Data.CarrierCode);
                            var TotalChargesArray = new Array();
                            //alert(RateCountCol);
                            $(ResultData.Table1).each(function (rowChild, trChild) {
                                if (Data.InvoiceNo == trChild.InvoiceNo) {
                                    if (rowChild == 0) {
                                        $(trChild.ChargesString.split(',')).each(function (rowt1, trt1) {
                                            RateCountCol = RateCountCol + 1;
                                            $('<th style="border:1px solid;" id="td_' + trt1.split('^')[0] + '" >' + trt1.split('^')[0] + '</th>').insertAfter("#tdCarrierCode2");
                                            $('<th style="border:1px solid;" id="td' + trt1.split('^')[0] + '">0</th>').insertAfter("#tdRevenue");
                                            TotalChargesArray.push({ Key: trt1.split('^')[0], Text: 0 });
                                        });
                                        $('#tdAirlineLogo').attr("colspan", (RateCountCol + $('#tdAirlineLogo').attr("colspan")));
                                        $('#tdCBV').attr("colspan", (RateCountCol + $('#tdCBV').attr("colspan")));
                                    }
                                   
                            TotalGrossWeight = TotalGrossWeight + parseFloat(trChild.GrossWeight);
                            TotalChargeableWeight = TotalChargeableWeight + parseFloat(trChild.ChargeableWeight);
                            TotalRevenue = TotalRevenue + parseFloat(trChild.Revenue);
                            //TotalFSC = TotalFSC + parseFloat(trChild.FSC);
                            //TotalSCC = TotalSCC + parseFloat(trChild.SCC);
                            //TotalX_Ray = TotalX_Ray + parseFloat(trChild.X_Ray);
                            //TotalMISC = TotalMISC + parseFloat(trChild.MISC);
                            //TotalAWBFee = TotalAWBFee + parseFloat(trChild.AWBFee);
                            GTotal = GTotal + parseFloat(trChild.Total);
                            //
                                    $(HtmlData).find('#bodyCBVSalesReport').append('<tr style="border:1px solid;">'
                                        + '<td style="border:1px solid;">' + trChild.Date + '</td >'
                                        + '<td style="border:1px solid;">' + trChild.AWBNo + '</td>'
                                        + '<td style="border:1px solid;">' + trChild.CarrierCode + '</td>'
                                        + '<td style="border:1px solid;">' + trChild.Origin + '</td>'
                                        + '<td style="border:1px solid;">' + trChild.Destination + '</td>'
                                        + '<td style="border:1px solid;">' + trChild.CommodityCode + '</td>'
                                        + '<td style="border:1px solid;text-align:right;">' + trChild.GrossWeight + '</td>'
                                        + '<td style="border:1px solid;text-align:right;">' + trChild.ChargeableWeight + '</td>'
                                        + '<td style="border:1px solid;text-align:right;">' + trChild.Rate + '</td>'
                                        + '<td style="border:1px solid;text-align:right;" id="tdRevenue_' + rowChild+'">' + trChild.Revenue + '</td>'
                                        //+ '<td style="border:1px solid;text-align:right;">' + trChild.FSC + '</td>'
                                        //+ '<td style="border:1px solid;text-align:right;">' + trChild.SCC + '</td>'
                                        //+ '<td style="border:1px solid;text-align:right;">' + trChild.X_Ray + '</td>'
                                        //+ '<td style="border:1px solid;text-align:right;">' + trChild.MISC + '</td>'
                                        //+ '<td style="border:1px solid;text-align:right;">' + trChild.AWBFee + '</td>'
                                        + '<td style="border:1px solid;text-align:right;">' + trChild.Total + '</td>'
                                        + '</tr >');
                                    $(trChild.ChargesString.split(',')).each(function (rowt3, trt3) {
                                        $('<td style="border:1px solid;text-align:right;">' + trt3.split('^')[1] + '</td>').insertAfter("#tdRevenue_" + rowChild+"");
                                    });
                                }
                            });

                            //
                            $(HtmlData).find('#bodyCBVSalesReport tr').each(function (r, t) {
                                $(TotalChargesArray).each(function (nr, nt) {
                                    nt.Text = parseFloat(nt.Text) + parseFloat($(t).find('td:eq(' + $('#trHeader').find('#td_' + nt.Key).index() + ')').text())
                                });
                                
                                //alert($(t).find('td:eq(' + $('#trHeader').find('#td_' + TotalChargesArray[r].Key).index() + ')').text())
                            })
                            $(TotalChargesArray).each(function (nr, nt) {
                                $('#trFooter').find('#td' + nt.Key).text(parseFloat(nt.Text).toFixed(2));
                            });
                            

                            $(HtmlData).find("#tdTotalGrWeight").text(parseFloat(TotalGrossWeight).toFixed(2));
                            $(HtmlData).find("#tdTotalChWeight").text(parseFloat(TotalChargeableWeight).toFixed(2));
                            $(HtmlData).find("#tdRevenue").text(parseFloat(TotalRevenue).toFixed(2));
                            //$(HtmlData).find("#tdFSC").text(TotalFSC);
                            //$(HtmlData).find("#tdSCC").text(TotalSCC);
                            //$(HtmlData).find("#tdX_RAY").text(TotalX_Ray);
                            //$(HtmlData).find("#tdMISC").text(TotalMISC);
                            //$(HtmlData).find("#tdAWBFee").text(TotalAWBFee);
                            $(HtmlData).find("#tdTOTAL").text(parseFloat(GTotal).toFixed(2));
                            //$(HtmlData).find("#divValueInWords").text(inWords(Data.TotalAmlount));
                            //$(HtmlData).find("#tdValueInNumber").text(Data.TotalAmlount);
                            //if (InvoiceNo == 0) {
                            $("#grid").append('</br><div class="page-break"></div>');
                            $('#grid').show();
                            //}
                        },
                        beforeSend: function (jqXHR, settings) {
                        },
                        complete: function (jqXHR, textStatus) {
                        },
                        error: function (xhr) {
                            // var a = "";
                        }
                    });
                });

                // Data.AirlineName
                $('#btnPrint').show();
                $("#imgexcel").show();
                $("#imgpdf").show();   
            }
            else {
                $('#btnPrint').hide();
                $("#imgexcel").hide();
                $("#imgpdf").hide();
                ShowMessage('warning', 'Warning - CBV Sales Report', 'Record not found !', "bottom-right");
            }
            
        }
      
    });

}
function PrintInvoice() {
    //$("#grid").printArea();
    var divToPrint = document.getElementById('grid');
        var newWin = window.open('', '_blank');
        newWin.document.open();
    newWin.document.title = 'Invoice';
    newWin.document.write('<html><head><link type="text/css" rel="stylesheet" href="Styles/Application.css" /><title>Invoice</title><script>$(document).ready(function () {window.print();});</script></head><body ><div><input id="btnPrint" type="button" value="Print" class="no-print"  onclick="window.print();"/></div><br\>' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    newWin.focus();
   // newWin.print()

}



function ExportToExcel() {
    var filename = 'Invoice';
    var tableID = 'grid';
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';
    // Create download link element
    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        // Setting the file name
        downloadLink.download = filename;
        //triggering the function
        downloadLink.click();
    }
}

function ExportToPDF() {
             html2canvas($('#grid')[0], {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("Invoice.pdf");
                }
            });
        }

//function ExportToPDF() {
//    ExportToPDF($('#grid'), [], 'Invoice', PDFPageType.Portrait, userContext.UserSNo);
//}

_ExtraCondition = function (textId) {
    if ($.isFunction(window.ExtraCondition)) {
        return ExtraCondition(textId);
    }
}
function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId.indexOf("OfficeName") >= 0) {
        var filterAirlineCondition = cfi.getFilter("AND");
        //cfi.setFilter(filterAirlineCondition, "AirlineSNo", "eq", $('#Airline').val());
        cfi.setFilter(filterAirlineCondition, "AirportSNo", "eq", userContext.AirportSNo);
        cfi.setFilter(filterAirlineCondition, "IsActive", "eq", 1);
        filterAirline = cfi.autoCompleteFilter(filterAirlineCondition);
        return filterAirline;
    }
      
}

function GetInvoiceByInvoiceNo(InvoiceNo) {
    $.ajax({
        url: "../GenrateAndViewInvoice/GetInvoiceByInvoiceNo?InvoiceNo=" + InvoiceNo + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');


            $(result.Data).each(function (row, tr) {
                $.ajax({
                    url: "../Client/" + userContext.SysSetting.ICMSEnvironment + "/Reports/Invoice/GenrateAndViewInvoice.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#' + DivID).append(result);
                        $('#' + DivID).find('#divrViewInvoice').attr('id', 'divrViewInvoice_' + row);
                        var HtmlData = $('#' + DivID).find('div[id="divrViewInvoice_' + row + '"]');
                        var Data = tr;
                        $(HtmlData).find('#AirlineLogo').attr('src', userContext.SysSetting.LogoURL);
                        $(HtmlData).find("#tdAirlineAddress").text(Data.AirlineAddress);
                        $(HtmlData).find("#tdDate").text(Data.InvoiceDate);
                        $(HtmlData).find("#tdGSA_CSA_Airline").text(Data.GSA_CSA_AirlineName);
                        $(HtmlData).find("#tdInvoiceNo").text(Data.InvoiceNo);
                        $(HtmlData).find("#tdAddress").text(Data.GSA_CSA_Address);
                        $(HtmlData).find("#tdPeriod").text(Data.InvoicePeriod);
                        $(HtmlData).find("#tdBillingCurrency").text(Data.InvoiceCurrency);
                        $(HtmlData).find("#tdCountry").text(Data.GSA_CSA_Country);
                        $(HtmlData).find("#tdARCode").text(Data.InvoiceARCode);
                        $(HtmlData).find("#tdAttention").text(Data.Attention);
                        $(HtmlData).find("#tdDueDate").text(Data.InvoiceDueDate);
                        $(HtmlData).find("#brRemarks").text(Data.Remarks);
                        $(HtmlData).find("#brAmount").text(Data.TotalAmlount);
                        $(HtmlData).find("#tdAccountName").text(Data.AccountName);
                        $(HtmlData).find("#tdAccountNo").text(Data.AccountNo);
                        $(HtmlData).find("#tdIBAN").text(Data.IBAN);
                        $(HtmlData).find("#tdBank").text(Data.BankName);
                        $(HtmlData).find("#tdBankAddress").text(Data.BankAddress);
                        $(HtmlData).find("#tdSwift").text(Data.Swift);
                        $(HtmlData).find("#divValueInWords").text(inWords(Data.TotalAmlount));
                        $(HtmlData).find("#tdValueInNumber").text(Data.TotalAmlount);
                        $("#grid").append('</br><div class="page-break"></div>');
                            $('#grid').show();
                    },
                    beforeSend: function (jqXHR, settings) {
                    },
                    complete: function (jqXHR, textStatus) {
                    },
                    error: function (xhr) {
                        // var a = "";
                    }
                });
            });
            $('#btnSendMail').hide();
            // Data.AirlineName
            if (result.Data.length > 0) {
                $('#btnPrint').show();
                $("#imgexcel").show();
                $("#imgpdf").show();
            }
            else {
                $('#btnPrint').hide();
            }
        }

    });

}