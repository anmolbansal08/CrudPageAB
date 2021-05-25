
$(document).ready(function () {
    
    var LogoURL = getParameterByName("LogoURL", "");
    var str = LogoURL;
    str = str.split('/');
    //$('#ImgLogo').attr('src', str[1] + '/' + str[2] + "/" + str[3] + "/" + str[4]);
    var userContext = "";
    var Environment = "";
    if (window.opener) {
        userContext = window.opener.parent.userContext;
        Environment = userContext.SysSetting.ICMSEnvironment;
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'GA')
        {
            $('#foruk').remove();
        }
        else {
            $('#forga').remove();
        }
    }
    GetNotificationarrival();
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function GetNotificationarrival() {
    var arrivedShipmentSNo = getParameterByName("ArrivedShipmentSNo", "");
    var awbSNo = getParameterByName("AWBSNo", "");
    var tbl = "";
    var IsInternational = 0;
    $('#divcharge').html('');
    userContext = window.opener.parent.userContext;
    Environment = userContext.SysSetting.ICMSEnvironment;
    $.ajax({
        url: "../../Services/Import/FreightarrivalnotifactionService.svc/GetFreightData",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ arrivedShipmentSNo: arrivedShipmentSNo, awbSNo: awbSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            ChargeData = ResultData.Table1;
            if (Environment == "JT") {
                $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData[0].AirlineLogo);
                if (FinalData.length > 0) {
                    $('#spnDate').text(FinalData[0].FlightDate);
                    $("#spnFlightNo").text(FinalData[0].FlightNo);
                    $('#spnAWBNo').text(FinalData[0].AWBNo);
                    $('#spnPieces').text(FinalData[0].Pcs);
                    $('#spnShipper').text(FinalData[0].CustomerName);
                    $('#spnOrigin').text(FinalData[0].Origin);
                    $('#spnCCPP').text(FinalData[0].CCPP);
                    $('#spnContent').text(FinalData[0].Contents);
                    $('#spnCreatedDate').text(FinalData[0].CreatedOn);
                    $('#spnAWBNo1').text(FinalData[0].AWBNo);
                    $('#Arrival_Date').text(FinalData[0].ArrivalDate);
                }
                var totalpieces = 0.000;

                if (ResultData.Table1.length > 0) {
                    tbl += "<table  style='border-collapse:collapse;width:100%' border='1'  class='WebFormTable' >"
                    tbl += " <tr>"
                    tbl += "<td class='bc formlabel' >Warehouse</td>"
                    tbl += "<td class='bc formlabel' >Components</td>"
                    tbl += "<td class='bc formlabel'>Remark</td>"
                    tbl += "<td class='bc formlabel'>Tariff</td>"
                    tbl += "</tr>"

                    for (var i = 1; i <= ResultData.Table1.length; i++) {
                        tbl += "<tr>"
                        if ((i - 1) == 0) {
                            tbl += "<td class='bc' rowspan='" + ResultData.Table1.length + "'>Import</td>"
                        }

                        tbl += "<td class='bc'>" + ResultData.Table1[i - 1].TariffIdName + "</td>"
                        tbl += "<td class='bc'>" + ResultData.Table1[i - 1].ChargeRemarks + "</td>"
                        tbl += "<td class='bc'>" + ResultData.Table1[i - 1].TotalAmount + "</td>"
                        tbl += "</tr>"
                    }
                    tbl += "</table>"
                    $('#divcharge').append(tbl);
                }
            } else {
                $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData[0].AirlineLogo);
                $('#ImgLogo').attr('onError', 'this.onerror=null;this.src="/Images/new GA logo cargo-05.png";');
                if (FinalData.length > 0) {
                    $('#spnDate').text(FinalData[0].FlightDate);
                    $("#spnFlightNo").text(FinalData[0].FlightNo);
                    $('#spnAWBNo').text(FinalData[0].AWBNo);
                    $('#spnPieces').text(FinalData[0].Pcs);
                    $('#spnWeight').text(FinalData[0].Weight);
                    $('#spnShipper').text(FinalData[0].CustomerName);
                    $('#spnConsignee').text(FinalData[0].Consiqnee);
                    $('#spnConsignee').text(FinalData[0].Consiqnee);
                    $('#spnConsigneeAddress').text(FinalData[0].ConsiqneeAddress);
                    $('#spnCreatedDate').text(FinalData[0].CreatedOn);
                    $('#splFinalyDeliveryBy').text(FinalData[0].FinalyDeliveryBy);
                    $('#spnBC1').text(FinalData[0].BC1);
                    $('#spnPosNo').text(FinalData[0].Posno);
                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'UK') {
                        $('#spnOrigin').text(FinalData[0].Origin);
                        $('#spnCCPP').text(FinalData[0].CCPP);
                        $('#spnContent').text(FinalData[0].Contents);
                        $('#spnAWBNo1').text(FinalData[0].AWBNo);
                        $('#Arrival_Date').text(FinalData[0].ArrivalDate);
                    }
                    IsInternational = FinalData[0].IsInternational;
                    if (FinalData[0].IsInternational > 0) {
                        $(".trHide").show();
                        $(".trFooter").hide();
                        $('#spnConditionSequence').text(4);
                    }
                    else {
                        $(".trHide").hide();
                        $(".trFooter").show();
                        $('#spnConditionSequence').text(3);
                    }
                }

                if (IsInternational > 0) {
                    tbl += "<table  style='border-collapse:collapse;width:100%' border='1'  class='WebFormTable'>"
                    tbl += "IL. INTERNATIONAL"
                    tbl += "<tr><td class='bc formlabel'>Gudang</td><td class='bc formlabel'>Komponen</td><td class='bc formlabel'>Dasar Perhitungan</td><td class='bc formlabel'>Tarif ( IDR )</td></tr>"
                    tbl += "<tr><td class='bc formlabel' rowspan=10>Import</td><td class='bc formlabel' rowspan=3>Tarif Jasa Terminal Cargo</td><td class='bc formlabel'>1 s/d hari ke 3, per kg dikenakan hanya satu hari</td><td class='bc formlabel'>Rp 2,500</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Hari ke 4 s/d hari ke 10 per kg/hari</td><td class='bc formlabel'>Rp 2,500</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Hari ke 11 dst per kg/hari</td><td class='bc formlabel'>Rp 2,700</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>HAWB Surcharge</td><td class='bc formlabel'>Per HAWB</td><td class='bc formlabel'>Rp 45,455</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Biaya Administrasi</td><td class='bc formlabel'>Per document</td><td class='bc formlabel'>Rp 20,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Envirotainer Electricity Charge</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 5,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Cold Storage/ Cool Room/ Box</td><td class='bc formlabel'>Surcharge 200%</td><td class='bc formlabel'>Rp 7,500</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Strong Room Khusus Valuable Cargo</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 5,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>AC Room</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 5,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>DG Room</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 5,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel' rowspan=8>Handling</td><td class='bc formlabel' rowspan=3>Tarif Jasa Terminal Cargo</td><td class='bc formlabel'>1 s/d hari ke 3, per kg dikenakan hanya satu hari</td><td class='bc formlabel'>Rp 3,250</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Hari ke 4 s/d hari ke 10 per kg/hari</td><td class='bc formlabel'>Rp 3,250</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Hari ke 11 dst per kg/hari</td><td class='bc formlabel'>Rp 3,350</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Rush Handling Service</td><td class='bc formlabel'>Per AWB</td><td class='bc formlabel'>Rp 10,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Biaya Administrasi</td><td class='bc formlabel'>Per document</td><td class='bc formlabel'>Rp 20,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Cold Storage/ Cool Room/ Box</td><td class='bc formlabel'>Surcharge 200%</td><td class='bc formlabel'>Rp 9,750</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Strong Room Khusus Valuable Cargo</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 6,500</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>AC Room</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 6,500</td></tr>"
                    tbl += "</table>"
                }
                else {
                    tbl += "<table  style='border-collapse:collapse;width:100%' border='1'  class='WebFormTable' >"
                    tbl += "DOMESTIC";
                    tbl += "<tr><td class='bc formlabel'>Gudang</td><td class='bc formlabel'>Komponen</td><td class='bc formlabel'>Dasar Perhitungan</td><td class='bc formlabel'>Tarif ( IDR )</td></tr>"
                    tbl += "<tr><td class='bc formlabel' rowspan=6>Incoming Domestic</td><td class='bc formlabel' rowspan=2>Tarif Jasa Terminal Cargo</td><td class='bc formlabel'>1 s/d hari ke 3, per kg dikenakan hanya satu hari</td><td class='bc formlabel'>Rp 1,280</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Hari ke 4 dst, per kg</td><td class='bc formlabel'>Rp 1280</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Biaya Administrasi</td><td class='bc formlabel'>Per document (DB)</td><td class='bc formlabel'>Rp 5,000</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Cold Storage/ Cool Room/ Box</td><td class='bc formlabel'>Surcharge 200%</td><td class='bc formlabel'>Rp 3,840</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>Strong Room Khusus Valuable Cargo</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 2,560</td></tr>"
                    tbl += "<tr><td class='bc formlabel'>AC Room</td><td class='bc formlabel'>Surcharge 100%</td><td class='bc formlabel'>Rp 2,560</td></tr>"
                    tbl += "</table>"
                }

                $('#divcharge').append(tbl);
            }
        }
    });
}