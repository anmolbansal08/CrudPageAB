$(document).ready(function () {
    var today = new Date();
    /*
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var MonthArray = [{ Key: months[today.getMonth()], Text: months[today.getMonth()] }];
    var YearArray = [{ Key: today.getFullYear().toString(), Text: today.getFullYear().toString() }];
    var FortnightArray = [{ Key: "First Fortnight", Text: "First Fortnight" }, { Key: "Second Fortnight", Text: "Second Fortnight" }];
    cfi.AutoCompleteByDataSource("Month", MonthArray );
    cfi.AutoCompleteByDataSource("Year", YearArray);
    cfi.AutoCompleteByDataSource("Fortnight", FortnightArray);
     */ 
    var MonthArray = [{ Key: "January", Text: "January" }, { Key: "February", Text: "February" }, { Key: "March", Text: "March" }, { Key: "April", Text: "April" }, { Key: "May", Text: "May" }, { Key: "June", Text: "June" }, { Key: "July", Text: "July" }, { Key: "August", Text: "August" }, { Key: "September", Text: "September" }, { Key: "October", Text: "October" }, { Key: "November", Text: "November" }, { Key: "December", Text: "December" }];
    var YearArray = [{ Key: today.getFullYear().toString(), Text: today.getFullYear().toString() }];
    var FortnightArray = [{ Key: "FN", Text: "First Fortnight" }, { Key: "SN", Text: "Second Fortnight" }];
    cfi.AutoCompleteByDataSource("Month", MonthArray);
    cfi.AutoCompleteByDataSource("Year", YearArray);
    cfi.AutoCompleteByDataSource("Fortnight", FortnightArray);
    cfi.AutoCompleteV2("OfficeName", "Name", "GenrateAndViewInvoice_OfficeName", null, "contains", ",", "", "", "", clearnext);
    cfi.AutoCompleteV2("Airline", "CarrierCode,airlinename", "GenrateAndViewInvoice_Airline", null, "contains");
    cfi.AutoCompleteV2("Currency", "CurrencyCode,CurrencyName", "GenerateAndviewinvoice_CurrencyCode", null, "contains");

    //, ",", "", "", "", clearnext
        var AirSNo = userContext.AirlineSNo;
        var AirCarrierCode = userContext.AirlineCarrierCode;
        $('#Airline').val(AirSNo);
        $('#Text_Airline_input').val(AirCarrierCode);
        $('#Currency').val(userContext.CurrencySNo);
        $('#Text_Currency_input').val(userContext.CurrencyCode + '-' + userContext.CurrencyName);
        $("#imgexcel").hide();
        $("#imgpdf").hide();
        $('#grid').css('display', 'none')
        $('#btnSendMail').hide();
        $('#btnPrint').hide();


        

      
});


//function clearnext() {
//    try {
//        var officeSNo = $("#OfficeName").val();
//        $.ajax({
//            type: "GET",
//            url: "../GenrateAndViewInvoice/GetCurrencyInformation",
//            async: false, type: "POST", dataType: "json", cache: false,
//            data: JSON.stringify({ SNo: officeSNo }),
//            contentType: "application/json; charset=utf-8",
//            success: function (response) {
//                var ResultData = response;
//                var FinalData = ResultData.Table0;
//                if (FinalData.length > 0) {
//                    $('#Currency').val(FinalData[0].SNo);
//                    $('#Text_Currency_input').val(FinalData[0].CurrencyName);

//                }
//            }
//        });

//    }
//    catch (exp) { }
//}
function clearnext() {
    var OfficeList = $("#Text_OfficeName_input").autocomplete({ 
        change: function () {

            try {
                var officeSNo = $("#OfficeName").val();
                $.ajax({
                    type: "GET",
                    url: "../GenrateAndViewInvoice/GetCurrencyInformation",
                    async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ SNo: officeSNo }),
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        var ResultData = response;
                        var FinalData = ResultData.Table0;
                        if (FinalData.length > 0) {
                            $('#Currency').val(FinalData[0].SNo);
                            $('#Text_Currency_input').val(FinalData[0].CurrencyName);

                        }
                    }
                });

            }
            catch (exp) { }
           
        }
    });
    //OfficeList.autocomplete('option', 'change').call(OfficeList);
}
   
        

 


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
//function GenerateAndViewInvoiceHTML(data)
//{
    
//    $("#imgexcel").show();
//}
function GenerateAndViewInvoiceData(InvoiceNo) {
    $.ajax({
        url: "../GenrateAndViewInvoice/GetInvoiceDetail?AirlineSNo=" + $('#Airline').val() + "&OfficeSNo=" + $('#OfficeName').val() + "&month=" + $('#Month').val() + "&year=" + $('#Year').val() + "&Fortnight=" + $('#Fortnight').val() + "&CurrencySNo=" + $('#Currency').val() + "&InvoiceNo=" + InvoiceNo + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = InvoiceNo == 0 ? 'grid' : 'gridHide';
            $('#' + DivID).html('');


            $(result.Data).each(function (row, tr) {
                $.ajax({
                    url: "../Client/" + userContext.SysSetting.ClientEnvironment + "/Reports/Invoice/GenrateAndViewInvoice.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#' + DivID).append(result);
                        $('#' + DivID).find('#divrViewInvoice').attr('id', 'divrViewInvoice_' + row);
                        var HtmlData = $('#' + DivID).find('div[id="divrViewInvoice_' + row+'"]');
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
                       
                        if (userContext.SysSetting.ClientEnvironment == 'G9') {1
                            Data.InvoiceDays != '' ? $(HtmlData).find("#tdDueDays").text(Data.InvoiceDays) : $(HtmlData).find("#tdDueDays").text(0);
                            var amount1 = Data.TotalAmlount.toLocaleString();
                            $(HtmlData).find('#AirlineLogo').attr('src', userContext.SysSetting.SiteUrl + "logo/AirArabiaLogo.jpg");
                            $(HtmlData).find(".tdBillingCurrency").text(Data.ConvertedCurrency);
                            $(HtmlData).find(".brAmount").text(amount1);
                            $(HtmlData).find(".tdCommodity").text(Data.Remarks);
                          
                            $(HtmlData).find(".brAmountforaed").text(amount);
                            $(HtmlData).find(".divValueInWords1").text(inWords(Data.TotalAmlount));
                            $(HtmlData).find("#tdExchangeRate").text(Data.ExchangeRate);
                             
                                //if (Data.IsInvoiceType == '1') {
                                    //$("#tdforusd").hide();
                                    //$("#tdforusd1").hide();
                                    //$("#tdforusd2").hide();
                                    //$("#tdforusd3").hide();
                                //} else if (Data.IsInvoiceType == '0') {
                                //    $("#tdforaed").hide();
                                //    $("#tdforaed1").hide();
                                //    $("#tdforaed2").hide();
                                //}
                            }
                     
                        if (InvoiceNo == 0) {
                            $("#grid").append('</br><div class="page-break"></div>');
                            $('#grid').show();
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
            
            // Data.AirlineName
            if (result.Data.length > 0) {
                $('#btnSendMail').show();
                $('#btnPrint').show();
                $("#imgexcel").show();
                $("#imgpdf").show();
            }
            else {
                $('#btnSendMail').hide();
                $('#btnPrint').hide();
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
function fn_SendMail() {
    $.ajax({
        url: "../GenrateAndViewInvoice/GetSendMailDetails?AirlineSNo=" + $('#Airline').val() + "&OfficeSNo=" + $('#OfficeName').val() + "&month=" + $('#Month').val() + "&year=" + $('#Year').val() + "&Fortnight=" + $('#Fortnight').val() + ""
        , async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $('#bodySendMail').html('');
            $(result.Data).each(function (row, tr) {
                $('#bodySendMail').append('<tr><td><input id="chkGetSelected_' + row + '" type="checkbox" ><input type="hidden" value=' + tr.InvoiceSNo + '></td><td>' + tr.InvoiceNo + '</td><td>' + tr.GSA_CSA_AirlineName + '</td><td><input type="text" value=' + tr.EmailID + '></td><td><input type="text" value=' + tr.MailSubject + '></td></tr>');
                $('#bodySendMail').find("#chkGetSelected_" + row + "").attr("checked", (tr.IsChecked == true?1:0));
            });
            PopUp("tblSendMail", "Send Mail");
        }
    });
    
    //alert("Mail send functionality here")
}
function fn_MailSent() {
    var SendMailModel = new Array();
    $('#bodySendMail tr').each(function (row, tr) {
        if ($("#chkGetSelected_" + row + "").attr("checked")) {
            GenerateAndViewInvoiceData($(tr).find('td:nth-child(2)').text());
            SendMailModel.push({
                InvoiceSNo: $(tr).find('input[type="hidden"]').val(),
                EmailID: $(tr).find('td:nth-child(4) input[type="text"]').val(),
                OfficeSNo: $('#OfficeName').val(),
                MailBody: $('#gridHide').html(),
                MailSubject: $(tr).find('td:last input[type="text"]').val(),
                CreatedBy: userContext.UserSNo
            });
        }

    });
    $.ajax({
        url: "../GenrateAndViewInvoice/saveSendMailDetail", async: false, type: "post", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(SendMailModel),
        success: function (result) {
            if (result == '0')
                ShowMessage('success', 'Success -Mail sent successfully', "Mail sent successfully", "bottom-right");
            else
                ShowMessage('warning', 'Warning', 'unable to process', "bottom-right");

            PopUpClose();

        }
    });
}

function PopUp(cntrlId, title, width, OnOpen, OnClose, topPosition) {

        var Kwindow = $("#" + cntrlId);

        if (!Kwindow.data("kendoWindow")) {
            Kwindow.kendoWindow({
                appendTo: "form#aspnetForm",
                width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
                actions: ["Minimize", "Close"],
                title: title,
                modal: true,
                maxHeight: 500,
                close: (OnClose == undefined ? null : OnClose),
                open: (OnOpen == undefined ? null : OnOpen)
            });
            Kwindow.data("kendoWindow").open();
        }
        else {
            Kwindow.data("kendoWindow").open();
        }
        $(document).bind("keydown", function (e) {
            if (e.keyCode == kendo.keys.ESC) {
                var visibleWindow = $(".k-window:visible:last > .k-window-content")
                if (visibleWindow.length)
                    visibleWindow.data("kendoWindow").close();
            }
        });

        Kwindow.data("kendoWindow").center();
        $("#" + cntrlId).closest(".k-window").centerTop(topPosition);

        return false;
}

function PopUpClose() {
    var visibleWindow = $(".k-window:visible:last > .k-window-content")
    if (visibleWindow.length)
        visibleWindow.data("kendoWindow").close();
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
    //if (textId =="Currency") {
    //    var filterEmbargo = cfi.getFilter("AND");
    //    cfi.setFilter(filterEmbargo, "CurrencyCode", "", $("#Airline").val())
    //    filterAirline = cfi.autoCompleteFilter(filterEmbargo);
    //    return filterAirline;
    //}
      
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
                        $(HtmlData).find("#brAmount").text(amount);
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