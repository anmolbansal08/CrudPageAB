
$(document).ready(function () {
    GetNotificationarrival();

    var LogoURL = getParameterByName("LogoURL", "");
    //var FooterHTML = getParameterByName("FooterHTML", "");



    var str = LogoURL;
    str = str.split('/');
    $('#ImgLogo').attr('src', str[1]+'/'+str[2] + "/" + str[3]+"/"+str[4]);


    $('#FooterHTML').html(FooterHTML);


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
    var tbl= "";
    $('#divcharge').html('');
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
               
                $('#spnDate').text(FinalData[0].FlightDate);
                $("#spnFlightNo").text(FinalData[0].FlightNo);
                $('#spnAWBNo').text(FinalData[0].AWBNo);
                $('#spnPieces').text(FinalData[0].Pcs); 
                $('#spnShipper').text(FinalData[0].CustomerName);
            }
            var totalpieces = 0.000;
            //if (ChargeData.length > 0) {
            //    var theDiv = document.getElementById("DivCharge");
            //    theDiv.innerHTML = "";
            //    var table = "<table class='appendGrid ui-widget' id='tblfaaSection' style='width:100%'><thead class='ui-widget-header'><tr><td class='ui-widget-header'><b>Charge Description</b></td><td class='ui-widget-header'  style='text-align:right'><b>Amount in  " + userContext.CurrencyCode + "</b></td></tr></thead><tbody class='ui-widget-content'>";
            //    for (var i = 0; i < ResultData.Table1.length; i++) {
            //        if (ResultData.Table1[i].isMandatory == "1") {
            //            table += "<tr><td class='ui-widget-content first'> " + ResultData.Table1[i].TariffCode + "</td><td class='ui-widget-content first' style='text-align:right '><table width='100%'><tr><td style='width:85%; text-align:right'>  </td> <td style=' text-align:left'><span style=' text-align:left'>" + ResultData.Table1[i].ChargeAmount + "</span> </td></tr></table></td></tr>";
            //            totalpieces += parseFloat(ResultData.Table1[i].ChargeAmount);
            //        }
            //    }
            //    table += "</tbody></table>";
            //    theDiv.innerHTML += table;
            //}

            
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
                    if((i-1)==0)
                        {
                    tbl += "<td class='bc' rowspan='" + ResultData.Table1.length + "'>Import</td>"
                        }
                   
                    tbl += "<td class='bc'>" + ResultData.Table1[i - 1].TariffIdName + "</td>"
                    tbl += "<td class='bc'>" + ResultData.Table1[i-1].ChargeRemarks + "</td>"
                    tbl += "<td class='bc'>" + ResultData.Table1[i-1].TotalAmount + "</td>"
                    tbl += "</tr>"






                }
                tbl += "</table>"

                $('#divcharge').append(tbl);


                // $("#spnTotal").text(totalpieces.toFixed(3));




                //inWords(totalpieces);
            }
         
            
        }
    });
}