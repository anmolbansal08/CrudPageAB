$(document).ready(function () {
    cfi.AutoCompleteV2("InvoiceNo", "InvoiceNo", "ViewInvoiceAndReceipt_InvoiceNo", null, "contains");
    $("#imgexcel").hide();
    $("#imgpdf").hide();
    $('#grid').css('display', 'none')
    $('#btnPrint').hide();
});
var Model = [];
var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

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
$("input:radio[name='rbtInvoice']").bind("click", function () {
    if ($("input:radio[name='rbtInvoice']:checked").val() != 'Invoice') {
        $("#spnInvoiceNo").hide();
        $("#fstric").hide();
        $('#dvInvoiceNo').hide()
    }
    else {
        $("#spnInvoiceNo").show();
        $("#fstric").show();
        $('#dvInvoiceNo').show()
    }
});



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
    //var filename = 'Invoice';
    //var tableID = 'grid';
    //var downloadLink;
    //var dataType = 'application/vnd.ms-excel';
    //var tableSelect = document.getElementById(tableID);
    //var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    //// Specify file name
    //filename = filename ? filename + '.xls' : 'excel_data.xls';
    //// Create download link element
    //downloadLink = document.createElement("a");
    //document.body.appendChild(downloadLink);
    //if (navigator.msSaveOrOpenBlob) {
    //    var blob = new Blob(['\ufeff', tableHTML], {
    //        type: dataType
    //    });
    //    navigator.msSaveOrOpenBlob(blob, filename);
    //} else {
    //    // Create a link to the file
    //    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    //    // Setting the file name
    //    downloadLink.download = filename;
    //    //triggering the function
    //    downloadLink.click();
    //}
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('div[id$=grid]').html()));
    e.preventDefault();
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

//_ExtraCondition = function (textId) {
//    if ($.isFunction(window.ExtraCondition)) {
//        return ExtraCondition(textId);
//    }
//}
//function ExtraCondition(textId) {

//    var filterAirline = cfi.getFilter("AND");

//    if (textId.indexOf("OfficeName") >= 0) {
//        var filterAirlineCondition = cfi.getFilter("AND");
//        //cfi.setFilter(filterAirlineCondition, "AirlineSNo", "eq", $('#Airline').val());
//        cfi.setFilter(filterAirlineCondition, "AirportSNo", "eq", userContext.AirportSNo);
//        cfi.setFilter(filterAirlineCondition, "IsActive", "eq", 1);
//        filterAirline = cfi.autoCompleteFilter(filterAirlineCondition);
//        return filterAirline;
//    }

//}

function GetInvoiceByInvoiceNo() {
    $.ajax({
        url: "../ViewInvoiceAndReceipt/GetInvoiceByInvoiceNo?InvoiceNo=" + $('#InvoiceNo').val() + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');


            $(result.Data).each(function (row, tr) {
                $.ajax({
                    url: "../Client/" + userContext.SysSetting.ClientEnvironment + "/Reports/Invoice/GenrateAndViewInvoice.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#' + DivID).append(result);
                        $('#' + DivID).find('#divrViewInvoice').attr('id', 'divrViewInvoice_' + row);
                        var HtmlData = $('#' + DivID).find('div[id="divrViewInvoice_' + row + '"]');
                        var Data = tr;
                        var amount = Data.TotalAmlount.toLocaleString();
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
                        $(HtmlData).find("#brAmount").text(amount);
                        $(HtmlData).find("#tdAccountName").text(Data.AccountName);
                        $(HtmlData).find("#tdAccountNo").text(Data.AccountNo);
                        $(HtmlData).find("#tdIBAN").text(Data.IBAN);
                        $(HtmlData).find("#tdBank").text(Data.BankName);
                        $(HtmlData).find("#tdBankAddress").text(Data.BankAddress);
                        $(HtmlData).find("#tdSwift").text(Data.Swift);
                        $(HtmlData).find("#divValueInWords").text(inWords(Data.TotalAmlount.toLocaleString()));
                        $(HtmlData).find("#tdValueInNumber").text(amount);


                        $("#grid").append('</br><div class="page-break"></div>');
                        $('#grid').show();
                        if (userContext.SysSetting.ClientEnvironment = 'G9') {
                            Data.InvoiceDays != '' ? $(HtmlData).find("#tdDueDays").text(Data.InvoiceDays) : $(HtmlData).find("#tdDueDays").text(0);
                            var amount1 = Data.TotalAmlount.toLocaleString();
                            $(HtmlData).find('#AirlineLogo').attr('src', userContext.SysSetting.SiteUrl + "logo/AirArabiaLogo.jpg");
                            $(HtmlData).find(".brAmount").text(amount1);
                            $(HtmlData).find(".tdCommodity").text(Data.Remarks);
                            $(HtmlData).find(".tdBillingCurrency").text(Data.InvoiceCurrency);
                            $(HtmlData).find(".brAmountforaed").text(amount);
                            $(HtmlData).find(".divValueInWords1").text(inWords(Data.TotalAmlount));
                            $(HtmlData).find("#tdExchangeRate").text(Data.ExchangeRate);

                            $(HtmlData).find("#tdCompanyName").text(Data.CompanyName);

                        }
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