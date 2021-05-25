$(document).ready(function () {
    $('#tbl tbody tr td[title="OfficeName"] span').hide();
    $('#OfficeName').parent().find('*').hide();
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
    //cfi.AutoCompleteV2("OfficeName", "Name", "InterlineCSR_OfficeName", null, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,airlinename", "InterlineCSR_Airline", null, "contains");
    $("#imgexcel").hide();
    $("#imgpdf").hide();
    $('#grid').css('display', 'none')
    $('#btnPrint').hide();
    $("input[id='rbtAWB']").prop('checked', true);
    $("input[id='rbtCSRGenerate']").prop('checked', true)
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

function InterlineCSROperation() {

    if (cfi.IsValidSubmitSection()) {
        if ($("input[name='CSROperationalType']:checked").val() == "Generate") {
            GenrateInterlineCSR();
        }
        else {
            GetInterlineCSRDetail();
        }
    }
}

function t() {
    $.ajax({
        url: "../InterlineCSR/GetInterlineCSRDetail?AirlineSNo=" + $('#Airline').val() + "&OfficeSNo=" + $("#OfficeName").val()+"&month=" + $('#Month').val() + "&year=" + $('#Year').val() + "&Fortnight=" + $('#Fortnight').val() + "&BookingType=" + $('input[name="BookingType"]').val() + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');
            var ResultData = jQuery.parseJSON(result.Data)
            if (ResultData.Table0.length > 0) {
                //Object.keys(ResultData.Table1[0]).each()
               
                //$('#tdAllSurcharges').append('<td style="background-color:#B8CCE4;border:1px solid"></td>');
               
                $(ResultData.Table0).each(function (row, tr) {
                    $.ajax({
                        url: "../Client/" + userContext.SysSetting.ClientEnvironment + "/Reports/InterlineCSR/InterlineCSR.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var TotalGrossWeight = 0, TotalChargeableWeight = 0, TotalRevenue = 0, TotalFSC = 0, TotalSCC = 0, TotalX_Ray = 0, TotalMISC = 0, TotalAWBFee = 0, GTotal = 0, RateCountCol=0;

                            $('#' + DivID).append(result);
                            $('#' + DivID).find('#divrInterlineCSR').attr('id', 'divrInterlineCSR_' + row);
                            var HtmlData = $('#' + DivID).find('div[id="divrInterlineCSR_' + row + '"]');

                            $(HtmlData).find("#tdGSA_CSAName").text(tr.Name);
                            $(HtmlData).find("#tdPeriodRemarks").text(tr.PeriodRemarks);
                            $(HtmlData).find("#tdBillingCurrency").text(tr.CurrencyCode);
                            $(HtmlData).find("#tdPeriod").text(tr.Period);
                            $(HtmlData).find("#tdInvoiceNo").text(tr.CsrNumberprfix);
                            $(HtmlData).find("#tdARCode").text(tr.ERPCode);
                            $(HtmlData).find("#tdCarrierCode1").text(userContext.SysSetting.ClientEnvironment);
                            $(HtmlData).find("#tdCarrierCode").text(userContext.SysSetting.ClientEnvironment);
                            $(ResultData.Table1).each(function (rowChild, trChild) {


                                $(trChild.ChargesString.split(',')).each(function (rowt3, trt3) {
                                    $('<td style="border:1px solid black">' + trt3.split('^')[1] + '</td>').insertAfter("#tdFlownRevenue_" + rowChild + "");
                                });
                           

                            if (row == 0) {
                                $(trChild.ChargesString.split(',')).each(function (rowt1, trt1) {
                                    RateCountCol = RateCountCol + 1;
                                    $(HtmlData).find('#tdAllSurcharges').append('<td style="background-color:#B8CCE4;border:1px solid" id="td_' + trt1.split('^')[0] + '">' + trt1.split('^')[0] + '</td>');
                                  //  $('<th style="border:1px solid;" id="td_' + trt1.split('^')[0] + '" >' + trt1.split('^')[0] + '</th>').insertAfter("#tdCarrierCode2");
                                    $('<td style="background-color:#B8CCE4;border:1px solid" id="td' + trt1.split('^')[0] + '">0</td>').insertAfter("#tdFlownRevenue");
                                    TotalChargesArray.push({ Key: trt1.split('^')[0], Text: 0 });
                                });
                                //$('#tdAirlineLogo').attr("colspan", (RateCountCol + $('#tdAirlineLogo').attr("colspan")));
                                //$('#tdCBV').attr("colspan", (RateCountCol + $('#tdCBV').attr("colspan")));
                                }
                            });
                            //$(HtmlData).find("#tdGrossWeight").text(parseFloat(TotalVolumeWeight).toFixed(3));
                            //$(HtmlData).find("#tdChargeableWeight").text(parseFloat(TotalChargeableWeight).toFixed(3));
                            //$(HtmlData).find("#tdFlownRevenue").text(parseFloat(TotalRate).toFixed(3));
                            //$(HtmlData).find("#tdGrossTotal").text(parseFloat(TotalAmount).toFixed(3));
                            //$(HtmlData).find("#tdCustomsCharges").text(parseFloat(TotalAmount).toFixed(3));
                            //$(HtmlData).find("#tdInterlineTotal").text(parseFloat(TotalAmount).toFixed(3));
                            //$(HtmlData).find("#tdNetPayableTotal").text(parseFloat(TotalAmount).toFixed(3));
                            //if (row == 0) {
                            //    Object.keys(ResultData.Table2[0]).forEach(function (key) {
                            //        $(HtmlData).find('#tdAllSurcharges').append('<td style="background-color:#B8CCE4;border:1px solid">' + key + '</td>');
                            //        $(HtmlData).find('#tdAllSurcharges').append('<td style="background-color:#B8CCE4;border:1px solid">' + key + '</td>');
                            //    });
                            //}
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
                ShowMessage('warning', 'Warning - Interline CSR', 'Record not found !', "bottom-right");
            }

        }

    });

}

function GetInterlineCSRDetail() {
    $.ajax({
        url: "../InterlineCSR/GetInterlineCSRDetail?AirlineSNo=" + $('#Airline').val() + "&OfficeSNo=" + $("#OfficeName").val() + "&month=" + $('#Month').val() + "&year=" + $('#Year').val() + "&Fortnight=" + $('#Fortnight').val() + "&BookingType=" + $('input[name="BookingType"]:checked').val() + "",
        async: false,
        type: "get",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');
            var ResultData = jQuery.parseJSON(result.Data)
            if (ResultData.Table0.length > 0) {
                $(ResultData.Table0).each(function (row, tr) {
                    $.ajax({
                        url: "../Client/" + userContext.SysSetting.ClientEnvironment + "/Reports/InterlineCSR/InterlineCSR.html",
                        async: false,
                        type: "get",
                        cache: false,
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var TotalGrossWeight = 0,
                                TotalChargeableWeight = 0,
                                TotalRevenue = 0,
                                GTotal = 0,
                                RateCountCol = 0,
                                CustomsCharges = 0,
                                NetPayableTotal = 0,
                                InterlineTotal = 0;

                            $('#' + DivID).append(result);
                            $('#' + DivID).find('#divrInterlineCSR').attr('id', 'divrInterlineCSR_' + row);
                            var HtmlData = $('#' + DivID).find('div[id="divrInterlineCSR_' + row + '"]');
                            var Data = tr;
                            $(HtmlData).find("#tdGSA_CSAName").text(Data.Name);
                            $(HtmlData).find("#tdPeriodRemarks").text(Data.PeriodRemarks);
                            $(HtmlData).find("#tdBillingCurrency").text(Data.CurrencyCode);
                            $(HtmlData).find("#tdPeriod").text(Data.Period);
                            $(HtmlData).find("#tdInvoiceNo").text(Data.CsrNumberprfix);
                            $(HtmlData).find("#tdARCode").text(Data.ERPCode);
                            //$(HtmlData).find("#tdCarrierCode1").text(Data.CarrierCode);
                            //$(HtmlData).find("#tdCarrierCode").text(Data.CarrierCode);
                            $(HtmlData).find("#tdCarrierCode1").text(userContext.SysSetting.ClientEnvironment);
                            $(HtmlData).find("#tdCarrierCode").text(userContext.SysSetting.ClientEnvironment);
                            var TotalChargesArray = new Array();
                            //alert(RateCountCol);
                            $(ResultData.Table1).each(function (rowChild, trChild) {
                                if (Data.InvoiceNo == trChild.InvoiceNo) {
                                    if (rowChild == 0) {
                                        var tdid = 'tdRevenue';
                                        $(trChild.ChargesString.split(',')).each(function (rowt1, trt1) {
                                            RateCountCol = RateCountCol + 1;
                                            $('#tdAllSurcharges').append('<td style="background-color:#B8CCE4;border:1px solid" id="th_' + trt1.split('^')[0] + '" >' + trt1.split('^')[0] + '</td>');
                                            $('<td style="border:1px solid black" id="td' + trt1.split('^')[0] + '">0</td>').insertAfter("#" + tdid);
                                            tdid = "td"+ trt1.split('^')[0];
                                            TotalChargesArray.push({
                                                Key: trt1.split('^')[0],
                                                Text: 0
                                            });
                                        });
                                        $('#tdHeaderMain').attr("colspan", (RateCountCol + parseInt($('#tdHeaderMain').attr("colspan"))));
                                        $('#tdSurcharges').attr("colspan", RateCountCol);
                                        $('#tdPeriodRemarks').attr("colspan", (RateCountCol + parseInt($('#tdPeriodRemarks').attr("colspan"))));
                                        
                                    }

                                    TotalGrossWeight = TotalGrossWeight + parseFloat(trChild.GrossWeight);
                                    TotalChargeableWeight = TotalChargeableWeight + parseFloat(trChild.ChargeableWeight);
                                    TotalRevenue = TotalRevenue + parseFloat(trChild.FlownRevenue);
                                    GTotal = GTotal + parseFloat(trChild.TotalAmlount);
                                    CustomsCharges = CustomsCharges + parseFloat(trChild.EuropeCustomCharges);
                                    InterlineTotal = InterlineTotal + parseFloat(trChild.InterLineTotal);
                                    NetPayableTotal = NetPayableTotal + parseFloat(trChild.NetTotalPaybleAmount)

                                    $(HtmlData).find('#bodyInterlineCSRReport').append('<tr>' +
                                        '<td class= "ui-widget-content" >' + trChild.AWBDate + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.AWBNumber + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.CarrierCode + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.Origin + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.Transit + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.ISInterLineCarrier + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.Destination + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.FlightDate + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.Commodity + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.GrossWeight + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.ChargeableWeight + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.BaseRate + '</td>' +
                                        '<td class="ui-widget-content" id="tdRevenue_' + rowChild + '">' + trChild.FlownRevenue + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.TotalAmlount + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.InterLineRate + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.EuropeCustomCharges + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.InterLineTotal + '</td>' +
                                        '<td class="ui-widget-content">' + trChild.NetTotalPaybleAmount + '</td>' +
                                        '</tr >');
                                    $(trChild.ChargesString.split(',')).each(function (rowt3, trt3) {
                                        $('<td class="ui-widget-content">' + trt3.split('^')[1] + '</td>').insertAfter("#tdRevenue_" + rowChild + "");
                                    });
                                }
                            });

                            //
                            $(HtmlData).find('#bodyInterlineCSRReport tr').each(function (r, t) {
                                $(TotalChargesArray).each(function (nr, nt) {
                                    nt.Text = parseFloat(nt.Text) + parseFloat($(t).find('td:eq(' + ($('#tdAllSurcharges').find('#th_' + nt.Key).index()+13) + ')').text())
                                });

                                //alert($(t).find('td:eq(' + $('#trHeader').find('#td_' + TotalChargesArray[r].Key).index() + ')').text())
                            });
                            $(TotalChargesArray).each(function (nr, nt) {
                                $('#trFooter').find('#td' + nt.Key).text(parseFloat(nt.Text).toFixed(2));
                            });


                            $(HtmlData).find("#tdTotalGrWeight").text(parseFloat(TotalGrossWeight).toFixed(2));
                            $(HtmlData).find("#tdTotalChWeight").text(parseFloat(TotalChargeableWeight).toFixed(2));
                            $(HtmlData).find("#tdRevenue").text(parseFloat(TotalRevenue).toFixed(2));
                            $(HtmlData).find("#tdTOTAL").text(parseFloat(GTotal).toFixed(2));
                            $(HtmlData).find("#tdCustomsCharges").text(parseFloat(CustomsCharges).toFixed(2));
                            $(HtmlData).find("#tdInterlineTotal").text(parseFloat(InterlineTotal).toFixed(2));
                            $(HtmlData).find("#tdNetPayableTotal").text(parseFloat(NetPayableTotal).toFixed(2));

                            $("#grid").append('</br><div class="page-break"></div>');
                            $('#grid').show();
                        },
                        beforeSend: function (jqXHR, settings) { },
                        complete: function (jqXHR, textStatus) { },
                        error: function (xhr) {
                            // var a = "";
                        }
                        //});
                    });

                    // Data.AirlineName
                    $('#btnPrint').show(); $("#imgexcel").show(); $("#imgpdf").show();
                });
            } else {
                $('#btnPrint').hide();
                $("#imgexcel").hide();
                $("#imgpdf").hide();
                ShowMessage('warning', 'Warning - CBV Sales Report', 'Record not found !', "bottom-right");
            }

        }

    });
}

function GenrateInterlineCSR() {
    var DivID = 'grid';
    $('#' + DivID).html('');
    var FromDate = '', ToDate = '';
    var m = (new Date('1-' + $('#Month').val() + '-' + $('#Year').val())).getMonth();
    var y = (new Date('1-' + $('#Month').val() + '-' + $('#Year').val())).getYear();
    var D=new Date(y, m + 1, 0);
    FromDate = ($('#Fortnight').val() == 'FN' ? '1' : '16') + '-' + $('#Month').val() + '-' + $('#Year').val();
    ToDate = ($('#Fortnight').val() == 'FN' ? '15' : (new Date(D)).getDate().toString()) + '-' + $('#Month').val() + '-' + $('#Year').val();
    $.ajax({
        url: "../InterlineCSR/GenerateInterlineCSRReport?AirlineSNo=" + $('#Airline').val() + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&BookingType=" + $('input[name="BookingType"]:checked').val() + "&OfficeSNo=" + $("#OfficeName").val() + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            if (result.Data.split('?')[0] == '0') {
                ShowMessage('success', 'Success-Interline CSR Report', result.Data.split('?')[1], "bottom-right");
            }
            else {
                ShowMessage('warning', 'Warning-Interline CSR Report', result.Data.split('?')[1], "bottom-right");
            }
            //alert(result);
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
    var tableHTML = "<html><body>" + $('#divInterlineCSRDetails').html() + "</body></html>";//tableSelect.outerHTML.replace(/ /g, '%20');
    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';
    // Create download link element
   /* downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        // Setting the file name
        downloadLink.download = filename;
        //triggering the function
        downloadLink.click();
    }*/

    var contentType = "application/vnd.ms-excel";
    var byteCharacters = tableHTML; //e.format(fullTemplate, e.ctx);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    var blobUrl = URL.createObjectURL(blob);
    //FILEDOWNLOADFIX END
    a = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

    if (textId.indexOf("Airline") >= 0) {
        var filterAirlineCondition = cfi.getFilter("AND");
        cfi.setFilter(filterAirlineCondition, "IsInterline", "eq", 1);
        cfi.setFilter(filterAirlineCondition, "IsActive", "eq", 1);
        filterAirline = cfi.autoCompleteFilter(filterAirlineCondition);
        return filterAirline;
    }

}

