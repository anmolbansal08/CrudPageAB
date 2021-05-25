$(document).ready(function () {

    GetFCReportRecord();
    var LogoURL = getParameterByName("LogoURL", "");
  

    $('#ImgLogo').attr('src', LogoURL);
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

function GetFCReportRecord() {
    var DailyFlightSNo = getParameterByName("DailyFlightSNo", "");
    //if (FFMFlightMasterSNo == "" || FFMFlightMasterSNo == "0") {
    //    ShowMessage('warning', 'Warning - FC Report', "Record not found.");
    //}
    //else {
   

    $.ajax({
        url: "../../../Services/Import/InboundFlightService.svc/GetFCReport",
        data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo }),
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

            if (resData3.length > 0) {
                $("#spnFlightNo").text(resData3[0].FlightNo);
                $("#spnFlightDate").text(resData3[0].FlightDate);
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
                for (var key in resData) {
                    var amandby = resData[key].AmendedBy;
                    var amandon = resData[key].Amendedon;
                    if (amandby=="")
                    {
                        amandon = "";
                    }
                    $('#tblResult').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].MAWB + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;word-wrap: break-word;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].HAWBNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].FFMPieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" >' + resData[key].FFMGrossWeight + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;word-wrap: break-word;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].Movablelocation + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;word-wrap: break-word;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].location + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" >' + resData[key].Pieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="right">' + resData[key].GrossWeight + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].AmendedBy + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + amandon + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData[key].Remarks + '</td></tr>');

                }
                if (resData4.length > 0) {
                    for (var key in resData4) {
                        $('#tblResult').append('<tr><td style="padding:5px;font-family:sans-serif;font-weight:bold;font-size:12px;border-top: 1px solid #000; border-right: 1px solid #000;">TOTAL : </td><td style="padding:5px;font-family:sans-serif;font-size:13px;border-top: 1px solid #000; border-right: 1px solid #000;"></td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData4[key].GrTotalFFMPcs + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData4[key].GrTotalFFMWT + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;"></td><td style="padding:5px;font-family:sans-serif;font-size:13px;border-top: 1px solid #000; border-right: 1px solid #000;"></td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData4[key].GrTotalRcdPcs + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;" align="right">' + resData4[key].GrTotalRcdWT + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;" align="right"></td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-top: 1px solid #000; border-right: 1px solid #000;" align="right"></td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;"></td></tr>');
                    }
                }
                $('#tblResult').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="11"></td>');
            }
            else {
                $('#tblResult').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="9" >No record found!</td>');
            }
            if (resData1.length > 0) {
                for (var key in resData1) {
                    $('#tblResult1').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData1[key].CargoType + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" >' + resData1[key].FFMPieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" >' + resData1[key].FFMGrossWeight + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" >' + resData1[key].Pieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData1[key].GrossWeight + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData1[key].location + '</td></tr>');
                }

                if (resData4.length > 0) {
                    for (var key in resData4) {
                        $('#tblResult1').append('<tr><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">TOTAL : </td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" >' + resData4[key].GrTotalSplFFMPieces + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" >' + resData4[key].GrTotalSplFFMWT + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">' + resData4[key].GrTotalSplPcs + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" >' + resData4[key].GrTotalSplWT + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td></tr>');
                    }
                }
                $('#tblResult1').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="6"></td>');
            }
            else {
                $('#tblResult1').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="6" >No record found!</td>');
            }

            if (resData2.length > 0) {
                for (var key in resData2) {
                    $('#tblResultDiscrepancy').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].DiscrepancyType + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].AWBNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData2[key].Pieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].Origin + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData2[key].Destination + '</td></tr>');
                }
                if (resData4.length > 0) {
                    for (var key in resData4) {
                        $('#tblResultDiscrepancy').append('<tr><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">TOTAL : </td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;" align="left">' + resData4[key].GrTotalDesPcs + '</td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td><td style="border-top: 1px solid #000; border-right: 1px solid #000; -webkit-print-color-adjust: exact; background: #e9e9e9 !important; padding: 4px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;"></td></tr>');
                    }
                }
                $('#tblResultDiscrepancy').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="6"></td>');
            }
            else {
                $('#tblResultDiscrepancy').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;" colspan="6" >No record found!</td>');
            }

            if (resData5.length > 0) {
                for (var key in resData5) {
                    $('#tblResultAWBLocation').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].AWBNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].HAWB + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].SPHCCode + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData5[key].StartPieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData5[key].EndPieces + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].TempControlled + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].StartTemperature + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].EndTemperature + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].MovableLocation + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData5[key].AssignLocation + '</td></tr>');
                }
                $('#tblResultAWBLocation').append('<tr><td style="padding:5px;border-top: 1px solid #000; border-right: 1px solid #000;" colspan="10"></td>');
            }
            else
                $('#tblResultAWBLocation').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="10" >No record found!</td>');

            if (resData6.length > 0) {
                for (var key in resData6) {
                    $('#tblResultULDLocation').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData6[key].ULDNo + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData6[key].MovableLocation + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;">' + resData6[key].Location + '</td><td style="padding:5px;font-family:sans-serif;font-size:11px;border-top: 1px solid #000; border-right: 1px solid #000;" align="left">' + resData6[key].BUP + '</td></tr>');
                }
                $('#tblResultULDLocation').append('<tr><td style="border-top: 1px solid #000; border-right: 1px solid #000;border-top: 1px solid #000;padding:5px;" colspan="4"></td>');

            }
            else
                $('#tblResultULDLocation').append('<tr><td style="padding:5px;color:#676767;border-right: 1px solid #000;border-top: 1px solid #000;"colspan="4" >No record found!</td>');


            debugger;
            if (resData7.length > 0) {
                $("span#spncreatedby").text(resData7[0].UserName);
                $("span#spncreatedon").text(resData7[0].CreatedOn);
             
            }
        },
        error: {
        }
    });
    //}

}

function funPrintFCReportData(divID, bac) {

    PrintDiv($(divID).html(), $(bac).html());
    //var divContents = $("#" + divID).html();
    //// $(divContents).find('input:button[id=' + printButtonID + ']').remove();
    //var printWindow = window.open('', '', '');
    //// printWindow.document.write('<html><head><title>SLI Information</title>');
    //// printWindow.document.write('</head><body >');
    //printWindow.document.write(divContents);
    ////printWindow.document.write('</body></html>');
    //printWindow.document.close();
    //printWindow.print();
}
function PrintDiv(data, bac) {
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    if (bac == 'Nil Arrived') {
        var alldata = data + "<p id='bg-text' style='left: 100px; color: lightgrey; font-size: 100px; transform: rotate(300deg); width: 100%; margin-left: 0%; margin-right: 0%; margin-top: -30%; z-index:100;  -webkit-transform: rotate(300deg);'>Nil Arrived</p>";
    }
    else {
        var alldata = data;
    }
    mywindow.document.write('<html><head><title>my div</title>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(alldata);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}