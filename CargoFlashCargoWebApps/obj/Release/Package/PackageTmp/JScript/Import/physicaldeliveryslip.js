$(document).ready(function () {
    
    var LogoURL = getParameterByName("LogoURL", "");
    $('#ImgLogo').attr('src', LogoURL);
    GetPhysicalDeliveryPrintData();
    GetDeliveryBillPrint();
})

//var AwbNo = getParameterByName("sno", "");
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function GetPhysicalDeliveryPrintData() {
    var PDSNo = getParameterByName("PDSNo", "");
    var OFW = getParameterByName("OFW", "");
    var FinalData;
    var FinalData1;
    $.ajax({
        url: "../../Services/Import/DeliveryOrderService.svc/GetPhysicalDeliveryPrint?PDSNo=" + parseInt(PDSNo) + "&OFW=" + OFW,
        contentType: "application/json; charset=utf-8",
        async: true,
        type: 'GET',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;
            var FinalData2 = ResultData.Table2;

            if (FinalData.length > 0) {
                $("#lblDate1").append(FinalData[0].CurrentDate);
                $("#lblStaff").text(FinalData[0].UserName);
                $("#lblTime").text(FinalData[0].CurrentTime);
                $("#lblWHS").text(FinalData[0].WHLocation);
                $("#lblPDS").text(FinalData[0].PDNo);
                $("#lblPdsDate").text(FinalData[0].PDSDateTime);
                $("#lblDoNo").text(FinalData[0].DeliveryOrderNo);
                $("#lblDoDate").text(FinalData[0].DeliveryOrderDate);
                $("#lblAwbNo").text(FinalData[0].AWBNo);
                $("#lblHawbNo").text(FinalData[0].HAWBNo);
                $("#lblConsignee").text(FinalData[0].Consignee);
                $("#lblNOG").text(FinalData[0].NatureOfGoods);
                $("#lblCargoType").text(FinalData[0].CargoType);
                $("#lblPieces").text(FinalData[0].Pieces);
                $("#lblWeightDeliveryTo").text(FinalData[0].Weight);
                $("#lblRemarks").text(FinalData[0].PDSRemarks);
                $("#lblDate").text(FinalData[0].Date);
                $("#lblUser").text(FinalData[0].UserName)
            }
        },
        error: function (err) {
            if (err.responseText.toLowerCase().indexOf("object reference not set") != -1) {
                document.cookie = "UserDetail=0";
                location.href = '../../Account/GarudaLogin.cshtml?islogout=true';
            }
        }
    })
}

