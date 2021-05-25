$(document).ready(function () {
    GetFreightarrival();
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

function GetFreightarrival() {
    var arrivedShipmentSNo = getParameterByName("ArrivedShipmentSNo", "");
    var awbSNo = getParameterByName("AWBSNo", "");
    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var d = new Date();
    var localdate = d.getDate() + '-' + m_names[(d.getMonth())] + '-' + d.getFullYear();
    var localdate1 = d.getDate() + '-' + m_names[(d.getMonth())] + '-' + d.getFullYear() + '  ' + d.getHours() + ':' + d.getMinutes() //+ ':' + d.getSeconds();
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
            if (FinalData.length > 0) {
                $('#spnCDate').text(localdate1);
                $("#spnConsqnee").text(FinalData[0].Consiqnee);
                $("#spnNo").text(FinalData[0].FAANo);
                $("#spnFax").text(FinalData[0].Fax);
                $('#spnDate').text(localdate);
                $("#spnFlight").text(FinalData[0].FlightNo);
                $("#spnArrival").text(FinalData[0].FlightDate);
                $('#spnAWBNo').text(FinalData[0].AWBNo);
                $('#spnOrigin').text(FinalData[0].Origin);
                $('#spnPcs').text(FinalData[0].Pcs);
                $("#spnWeight").text(FinalData[0].Weight);
                $("#spnCCPP").text(FinalData[0].CCPP);
                $("#spnCargoType").text(FinalData[0].CargoType);
                $('#spnContent').text(FinalData[0].Contents);
                //$("#spnHandlingCharge").text(FinalData[0].DeliveryHandlingCharge);
                //$("#spnDeliveryOrderFee").text(FinalData[0].DeliveryOrderFee);
                //$("#spnTotal").text(FinalData[0].Total);
                $('#spnAWBNo1').text(FinalData[0].AWBNo);
            }
            var totalpieces = 0.000;
            if (ChargeData.length > 0) {
                var theDiv = document.getElementById("DivCharge");
                theDiv.innerHTML = "";
                var table = "<table class='appendGrid ui-widget' id='tblfaaSection' style='width:100%'><thead class='ui-widget-header'><tr><td class='ui-widget-header'><b>Charge Description</b></td><td class='ui-widget-header'  style='text-align:right'><b>Amount in  " + userContext.CurrencyCode + "</b></td></tr></thead><tbody class='ui-widget-content'>";
                for (var i = 0; i < ResultData.Table1.length; i++) {
                    if (ResultData.Table1[i].isMandatory == "1") {
                        table += "<tr><td class='ui-widget-content first'> " + ResultData.Table1[i].TariffCode + "</td><td class='ui-widget-content first' style='text-align:right '><table width='100%'><tr><td style='width:85%; text-align:right'>  </td> <td style=' text-align:left'><span style=' text-align:left'>" + ResultData.Table1[i].ChargeAmount + "</span> </td></tr></table></td></tr>";
                        totalpieces += parseFloat(ResultData.Table1[i].ChargeAmount);
                    }
                }
                table += "</tbody></table>";
                theDiv.innerHTML += table;
            }
            $("#spnTotal").text(totalpieces.toFixed(3));
            inWords(totalpieces);
        },
        error: function (err) {
            alert("Generated error");
        }
    });
}

function GenerateNo() {
    var no = 10000
    //if (!localStorage.count) {
    //    localStorage.count = 0;
    //}
    //localStorage.count++;
    //var num = localStorage.count;
}

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    $('#spnTotalText').text(str.toUpperCase())
}