$(document).ready(function () {
    var LogoURL = getParameterByName("LogoURL", "");
    GetFCReportRecord();
})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var ImagePath = "";
function GetFCReportRecord() {
    var resData = [];
    var DailyFlightSNo = getParameterByName("DailyFlightSNo", "");
    $.ajax({
        url: "../../../Services/Import/InboundFlightService.svc/GetFlightCloseDetalil",
        data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo }),
        async: false, type: "POST", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            resData = Data.Table0;
        }
    });

    if (resData.length > 0) {
        resData.forEach(function (i, index) {
            var ClosedOn = i.ClosedOn;
            $.ajax({
                url: "../../../Services/Import/InboundFlightService.svc/GetFCReport",
                data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo, ClosedOn: ClosedOn }),
                async: false, type: "POST", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
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

                    $("#FCReportContent").css("display", "block");
                    $("#spnReportVersion").text(index == resData.length ? "Original" : "Version(" + (index + 1) + ")");

                    if (resData3.length > 0) {
                        $("#spnFlightNo").text(resData3[0].FlightNo);
                        $("#spnFlightDate").text(resData3[0].FlightDate);
                        $("#SpnOrigin").text(resData3[0].OriginAirportCode);
                        $("#SpnAta").text(resData3[0].ATA);

                        $("#SpnTos").text(resData3[0].BreakdownStartTime);
                        $("#SpnToc").text(resData3[0].BreakdownEndTime);

                        if (resData3[0].IsNilArrived == "1") {
                            $("div#background p").html("Nil Arrived").css("margin-top", "350px");
                            $("div#background").css("display", "block");
                        }
                        else {
                            $("div#background p").html("");
                            $("div#background").css("display", "none");
                        }
                    }

                    if (resData.length > 0) {
                        $("#SpnManifestedPcs").text(resData[0].ManifestedPcs);
                        $("#SpnManifestedWeight").text(resData[0].Manifested_Weight);
                        $("#SpnReceivePcs").text(resData[0].ReceivePcs);
                        $("#SpnReceiveWeight").text(resData[0].Receive_Weight);
                        $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + resData[0].AirlineLogo);//'http://'+ window.location.host + '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + resData[0].AirlineLogo
                        $('#ImgLogo').attr('onError', 'this.style.display=\"none\"');
                        ImagePath = resData[0].AirlineLogo;
                    }

                    if (resData8.length > 0) {
                        $("#SpnNoofpcsshortlanded").text(resData8[0].NoofShorLanded);
                        $("#SpnNoofpcsexcesslanded").text(resData8[0].Noofexcesslanded);
                        $("#Spnpcstranshipment").text(resData8[0].Noofpcstrans);
                        $("#Spnpcsrecdamage").text(resData8[0].Noofpcsrecdamage);
                        $("#Spnpcsloadpackage").text(resData8[0].NoofSpecialLoadPackage);
                    }

                    if (resData1.length > 0) {
                        for (var key in resData1) {
                            $('#tblResult1').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData1[key].CargoType + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData1[key].AWBNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;"></td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" >' + resData1[key].Pieces + '/' + resData1[key].GrossWeight + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData1[key].OriginAirportCode + '/' + resData1[key].DestinationAirportCode + '</td></tr>');
                        }

                        if (resData4.length > 0) {
                            for (var key in resData4) {
                                $('#tblResult1').append('<tr><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">TOTAL : </td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" ></td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" >' + resData4[key].GrTotalSplPcs + '/' + resData4[key].GrTotalSplWT + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td></tr>');
                            }
                        }
                        $('#tblResult1').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="5"></td>');
                    }
                    else {
                        $('#tblResult1').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="5" ></td>');
                    }

                    // Removed NO Record Found! Message from FC Report as per bug id 3514 by Rahul Singh on 28-08-2017 
                    var totaldispcs = 0;
                    var totaldiswt = 0.0;
                    if (resData2.length > 0) {
                        for (var key in resData2) {
                            $('#tblResultDiscrepancy').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].DiscrepancyType + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].AWBNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;"></td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData2[key].Pieces + '/' + resData2[key].Weight + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].Origin + '/' + resData2[key].Destination + '</td></tr>');
                            totaldispcs += parseInt(resData2[key].Pieces)
                            totaldiswt += parseFloat(resData2[key].Weight)
                        }

                        if (resData4.length > 0) {
                            for (var key in resData4) {
                                $('#tblResultDiscrepancy').append('<tr><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">TOTAL : </td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" align="left"></td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">' + totaldispcs.toString() + '/' + totaldiswt.toFixed(2).toString() + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td></tr>');
                            }
                        }
                        $('#tblResultDiscrepancy').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="6"></td>');
                    }
                    else {
                        $('#tblResultDiscrepancy').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;" colspan="6" ></td>');
                    }

                    if (resData5.length > 0) {
                        for (var key in resData5) {
                            $('#tblResultAWBLocation').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].AWBNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].HAWB + '/' + resData5[key].SPHCCode + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData5[key].EndPieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].AssignLocation + '</td></tr>');
                        }
                        $('#tblResultAWBLocation').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="4"></td>');
                    }
                    else
                        $('#tblResultAWBLocation').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="4" ></td>');

                    if (resData6.length > 0) {
                        for (var key in resData6) {
                            $('#tblResultULDLocation').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData6[key].ULDNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData6[key].Location + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData6[key].Damage + '</td></tr>');
                        }
                        $('#tblResultULDLocation').append('<tr><td style="border-top: 1px solid #000; border-right: 1px solid #000;border-top: 1px solid #000;padding:5px;" colspan="3"></td>');
                    }
                    else
                        $('#tblResultULDLocation').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="3" ></td>');

                    if (resData7.length > 0) {
                        $("span#spncreatedby").text(resData7[0].UserName);
                        $("span#spncreatedon").text(resData7[0].CreatedOn);
                    }
                },
                error: {
                }
            });
            var html = "";
            if ($("#divMultiFCReport")[0].innerText != "")
                html += "</br></br></br></br><hr style='width:868px;margin-left:-38px;'>";
            html += $("#FCReportContent").html();

            $("#divMultiFCReport").append(html);
            $("#FCReportContent").css("display", "none");
        });
    }
}

function funPrintFCReportData(divID, bac) {
    PrintDiv($(divID).html(), $(bac).html());
}

function PrintDiv(data, bac) {
    var mywindow = window.open('', '', 'height=400,width=600');
    if (bac == 'Nil Arrived') {
        var alldata = data + "<p id='bg-text' style='left: 100px; color: lightgrey; font-size: 100px; transform: rotate(300deg); width: 100%; margin-left: 0%; margin-right: 0%; margin-top: -30%; z-index:100;  -webkit-transform: rotate(300deg);'>Nil Arrived</p>";
    }
    else {
        var alldata = data;
    }

    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    //mywindow.document.write('<img id="ImgLogo" height="100" width="300" alt="" src="/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=aHR0cHM6Ly9nYXJlc3N0b3JhZ2UuYmxvYi5jb3JlLndpbmRvd3MubmV0L2NmcmVzY29udGFpbmVyLzZfZmViXzIwMThfMDU6Mzc6NDVfMTMzX19nYXJ1ZGFpbmRvbmVzaWFncm91cG5ldy5wbmc=">');
    mywindow.document.write(alldata);
    mywindow.document.write('</body></html>');
    setTimeout(function () {
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10
        mywindow.print();
        mywindow.close();
    }, 500);
    return true;
}