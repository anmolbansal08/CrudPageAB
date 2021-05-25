$(document).ready(function () {
    //var FromDate = "";
    //var ToDate = "";
    $('#btnPrint').hide();
    $("#imgexcel").hide();
    $("#imgpdf").hide();
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    cfi.AutoCompleteV2("InterlineCarrier", "CarrierCode,airlinename", "InterlineFlownShipment_InterlineCarrier", null, "contains");
    $('#grid').css('display', 'none');
   
});
function GetInterlineFlownShipmentData() {
    var interlinecode = $('#InterlineCarrier').val() == "" ? 0 : $('#InterlineCarrier').val()
    $.ajax({
        url: "../InterlineFlownShipments/GetInterlineFlownShipmentDetail?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + "&InterlineCarrier=" + interlinecode + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');
            var ResultData = jQuery.parseJSON(result.Data)
            if (ResultData.Table0.length > 0) {
               $.ajax({
                        url: "../Client/" + "GA" + "/Reports/InterlineFlownShipment/InterlineFlownShipment.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var TotalGrossWeight = 0, TotalChargeableWeight = 0, TotalAmount = 0, TotalVolumeWeight = 0, TotalRate = 0, TotalPieces = 0;
                            $('#' + DivID).append(result);
                            var HtmlData = $('#divrInterlineFlownShipment');
                            $(ResultData.Table0).each(function (rowChild, trChild) {
                                TotalGrossWeight = TotalGrossWeight + parseFloat(trChild.GrossWeight);
                                TotalVolumeWeight = TotalVolumeWeight + parseFloat(trChild.VolumeWeight);
                                TotalPieces = TotalPieces + parseFloat(trChild.Pieces);
                                TotalChargeableWeight = TotalChargeableWeight + parseFloat(trChild.ChargeableWeight);
                                TotalRate = TotalRate + parseFloat(trChild.Rate);
                                TotalAmount = TotalAmount + parseFloat(trChild.Amount);

                                $(HtmlData).find('#bodyInterlineFlownShipment').append('<tr style="border:1px solid;">'
                                    + '<td style="border:1px solid;">' + trChild.AWBNo + '</td >'
                                        + '<td style="border:1px solid;">' + trChild.AWBDate + '</td>'
                                        + '<td style="border:1px solid;">' + trChild.Origin + '</td>'
                                    + '<td style="border:1px solid;">' + trChild.Destination + '</td>'
                                    + '<td style="border:1px solid;">' + trChild.Sector + '</td>'
                                    + '<td style="border:1px solid;">' + trChild.Flight + '</td>'
                                    + '<td style="border:1px solid;">' + trChild.FlightDate + '</td>'
                                    + '<td style="border:1px solid;">' + trChild.CommodityCode + '</td>'
                                    + '<td style="border:1px solid;">' + trChild.CurrencyCode + '</td>'
                                    + '<td style="border:1px solid;text-align:right;">' + trChild.Pieces + '</td>'
                                    + '<td style="border:1px solid;text-align:right;">' + trChild.GrossWeight + '</td>'
                                    + '<td style="border:1px solid;text-align:right;">' + trChild.VolumeWeight + '</td>'
                                        + '<td style="border:1px solid;text-align:right;">' + trChild.ChargeableWeight + '</td>'
                                    + '<td style="border:1px solid;text-align:right;">' + trChild.Rate + '</td>'
                                    + '<td style="border:1px solid;text-align:right;">' + parseFloat(trChild.Amount).toFixed(3) + '</td>'
                                        + '</tr >');
                            });
                            $(HtmlData).find("#tdTotalPieces").text(parseFloat(TotalGrossWeight).toFixed(3));
                            $(HtmlData).find("#tdTotalGrWeight").text(parseFloat(TotalGrossWeight).toFixed(3));
                            $(HtmlData).find("#tdTotalVOLWeight").text(parseFloat(TotalVolumeWeight).toFixed(3));
                            $(HtmlData).find("#tdTotalChWeight").text(parseFloat(TotalChargeableWeight).toFixed(3));
                            $(HtmlData).find("#tdTotalRate").text(parseFloat(TotalRate).toFixed(3));
                            $(HtmlData).find("#tdTotalAmount").text(parseFloat(TotalAmount).toFixed(3));
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

                // Data.AirlineName
                $('#btnPrint').show();
                $("#imgexcel").show();
                $("#imgpdf").show();
            }
            else {
                $('#btnPrint').hide();
                $("#imgexcel").hide();
                $("#imgpdf").hide();
                ShowMessage('warning', 'Warning - Interline Flown Shipment ', 'Record not found !', "bottom-right");
            }

        }

    });

}
//$('#InterlineCarrier').val()--- userContext.SysSetting.ICMSEnvironment
function GetInterlineFlownShipmentData_Summary() {
    var interlinecode = $('#InterlineCarrier').val() == "" ? "0" : $('#InterlineCarrier').val();
    $.ajax({
        url: "../InterlineFlownShipments/GetInterlineFlownShipmentDetail_Summary?FromDate=" + $('#FromDate').val() + "&ToDate=" + $('#ToDate').val() + " &InterlineCarrier=" + interlinecode + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid';
            $('#' + DivID).html('');
            var ResultData = jQuery.parseJSON(result.Data)
            if (ResultData.Table0.length > 0) {
               $.ajax({
                   url: "../Client/" + "GA" + "/Reports/InterlineFlownShipment/InterlineFlownShipmentSummary.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var TotalGrossWeight = 0,  TotalAmount = 0;
                            $('#' + DivID).append(result);
                            var HtmlData = $('#divrInterlineFlownShipmentSummary');
                            $(ResultData.Table0).each(function (rowChild, trChild) {
                                TotalGrossWeight = TotalGrossWeight + parseFloat(trChild.GrossWeight);                               
                                TotalAmount = TotalAmount + parseFloat(trChild.Amount);

                                $(HtmlData).find('#bodyInterlineFlownShipmentSummary').append('<tr style="border:1px solid;">'
                                  
                                    + '<td style="border:1px solid;">' + trChild.AirlineName + '</td>'                                
                                    + '<td style="border:1px solid;text-align:right;">' + trChild.GrossWeight + '</td>'                                  
                                    + '<td style="border:1px solid;text-align:right;">' + parseFloat(trChild.Amount).toFixed(3) + '</td>'
                                        + '</tr >');
                            });
                           
                            $(HtmlData).find("#tdTotalWeight_Summary").text(parseFloat(TotalGrossWeight).toFixed(3));
                         
                            $(HtmlData).find("#tdTotalAmount_Summary").text(parseFloat(TotalAmount).toFixed(3));
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

                // Data.AirlineName
                $('#btnPrint').show();
                $("#imgexcel").show();
                $("#imgpdf").show();
            }
            else {
                $('#btnPrint').hide();
                $("#imgexcel").hide();
                $("#imgpdf").hide();
                ShowMessage('warning', 'Warning - Interline Flown Shipment ', 'Record not found !', "bottom-right");
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
    var filename = 'Interline Flown Shipments';
    var tableID = 'grid';
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = "<html><body>" + $('#grid').find('table').parent().html() + "</body></html>";//tableSelect.outerHTML.replace(/ /g, '%20');
    // Specify file name
    filename = filename.length>0 ? filename + '.xlsx' : 'excel_data.xlsx';
    // Create download link element
    /*downloadLink = document.createElement("a");
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
            pdfMake.createPdf(docDefinition).download("Interline Flown Shipments.pdf");
        }
    });
}
function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId.indexOf("InterlineCarrier") >= 0) {
        var filterAirlineCondition = cfi.getFilter("AND");
        cfi.setFilter(filterAirlineCondition, "IsInterline", "eq", 1);
        cfi.setFilter(filterAirlineCondition, "IsActive", "eq", 1);
        filterAirline = cfi.autoCompleteFilter(filterAirlineCondition);
        return filterAirline;
    }

}

function SearchRecord()
{
    if($('input[name=rdbsummary]:checked').val()=="0")
    {
        GetInterlineFlownShipmentData()
    }
    else
    {
        GetInterlineFlownShipmentData_Summary()
    }
}
