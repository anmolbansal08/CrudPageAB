$(document).ready(function () {
   

    var POMULDCount = getParameterByName("POMULDCount", "");
    if (parseInt(POMULDCount) > 0)
        GetPOMailULDReport();
    else
        GetULDReportRecord();
    var LogoURL = getParameterByName("LogoURL", "");
    var str = LogoURL;
    str = str.split('/');
   // $('#ImgLogo').attr('src', str[1] + '/' + str[2] + "/" + str[3] + "/" + str[4]);
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

function GetULDReportRecord() {
  
    var FFMFlightMasterSNo = getParameterByName("FFMFlightMasterSNo", "");
    if (FFMFlightMasterSNo == "" || FFMFlightMasterSNo == "0") {
        ShowMessage('warning', 'Warning - ULD Report', "Record not found.");
    }
    else {
        $.ajax({
            url: "../../Services/Import/InboundFlightService.svc/GetULDReport",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ FFMFlightMasterSNo: FFMFlightMasterSNo }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;
                var resData2 = Data.Table2;
                var resData3 = Data.Table3;


                var TodayDate = new Date();
                //$("span#spnDate").text(('0' + (parseInt(TodayDate.getUTCDate()))).slice(-2) + "-" + ('0' + (parseInt(TodayDate.getUTCMonth() + 1))).slice(-2) + "-" + TodayDate.getUTCFullYear());
                //$("span#spnTime").text(('0' + (parseInt(TodayDate.getUTCHours()))).slice(-2) + ':' + ('0' + (parseInt(TodayDate.getUTCMinutes()))).slice(-2));

              

                for (var keyval in resData3) {
                    $("span#spnDate").text(resData3[keyval].CurrentDate);
                    $("span#spnTime").text(resData3[keyval].CurrentTime);
                    }


                if (resData.length > 0) {
                  
                        $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + resData[0].AirlineLogo);
                        $('#ImgLogo').attr('onError', 'this.onerror=null;this.src="/Images/Logo_Garuda_Indonesia New.jpg";');
                        //$('#ImgLogo').attr('onError', 'this.style.display=\"none\"');
                  
                    for (var key in resData) {
                        $("span#spnFlightNo").text(resData[key].FlightNo.split('-')[0] + ' ' + resData[key].FlightNo.split('-')[1]);
                        $("span#spnFlightDate").text(resData[key].FlightDate);
                        $("span#spnETD").text(resData[key].ETD);
                        $("span#spnMvmtNo").text(resData[key].MovementNo);
                        $("span#spnAircraftType").text(resData[key].AircraftType);
                        $("span#spnAirline").text(resData[key].AirlineName);
                        //$("span#spnRegNo").text(resData[key].FlightNo);
                        $("span#spnRegNo").text(resData[key].RegistrationNo);
                    }
                }

                if (resData1.length > 0) {
                    for (var i = 0; i < resData1.length; i++) {
                        $('#tblResult').append('<tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + parseInt(i + 1) + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + resData1[i].ULDNo + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + resData1[i].ULDTare + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + resData1[i].CargoWT + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td></tr>');
                    }
                    if (resData2.length > 0) {
                        $('#tblResult').append('<tr><td style="padding: 5px;border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 13px; color: #5a5a5a;">Total : </td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">' + resData2[0].TotalCargoWT + '</td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td></tr>');
                    }
                }
                else {
                    $('#tblResult').append('<tr><td style="padding:5px;color:#676767;"colspan="6" >No record found!</td>');
                }
            },
            error: {
            }
        });
    }
}

function funPrintFCReportData(divID, bac) {
    PrintDiv($(divID).html(), $(bac).html());
}

function PrintDiv(data, bac) {
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
    return true;
}

//==========Added by Akaram Ali on 9 Dec 2017

function GetPOMailULDReport() {
    var FFMFlightMasterSNo = getParameterByName("FFMFlightMasterSNo", "");
    if (FFMFlightMasterSNo == "" || FFMFlightMasterSNo == "0") {
        ShowMessage('warning', 'Warning - ULD Report', "Record not found.");
    }
    else {
        $.ajax({
            url: "../../Services/Import/InboundFlightService.svc/GetPOMailULDReport",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ FFMFlightMasterSNo: FFMFlightMasterSNo }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;
                var resData2 = Data.Table2;
                var resData3 = Data.Table3;


                var TodayDate = new Date();
                for (var keyval in resData3) {
                    $("span#spnDate").text(resData3[keyval].CurrentDate);
                    $("span#spnTime").text(resData3[keyval].CurrentTime);
                }


                if (resData.length > 0) {
                    for (var key in resData) {
                        $("span#spnFlightNo").text(resData[key].FlightNo.split('-')[0] + ' ' + resData[key].FlightNo.split('-')[1]);
                        $("span#spnFlightDate").text(resData[key].FlightDate);
                        $("span#spnETD").text(resData[key].ETD);
                        $("span#spnMvmtNo").text(resData[key].MovementNo);
                        $("span#spnAircraftType").text(resData[key].AircraftType);
                        $("span#spnAirline").text(resData[key].AirlineName);
                        //$("span#spnRegNo").text(resData[key].FlightNo);
                        $("span#spnRegNo").text(resData[key].RegistrationNo);
                    }
                }

                if (resData1.length > 0) {
                    for (var i = 0; i < resData1.length; i++) {
                        $('#tblResult').append('<tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + parseInt(i + 1) + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + resData1[i].ULDNo + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + resData1[i].ULDTare + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;">' + resData1[i].CargoWT + '</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td></tr>');
                    }
                    if (resData2.length > 0) {
                        $('#tblResult').append('<tr><td style="padding: 5px;border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 13px; color: #5a5a5a;">Total : </td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #5a5a5a;">' + resData2[0].TotalCargoWT + '</td><td style="padding: 5px; border-bottom: thin dashed #000000;border-top: thin dashed #000000; font-weight: bold; font-family: sans-serif; font-size: 11px; color: #5a5a5a;"></td></tr>');
                    }
                }
                else {
                    $('#tblResult').append('<tr><td style="padding:5px;color:#676767;"colspan="6" >No record found!</td>');
                }
            },
            error: {
            }
        });
    }
}

