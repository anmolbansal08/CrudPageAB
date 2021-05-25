$(document).ready(function () {
    GetDeliveryOrderPrint();
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

function GetDeliveryOrderPrint() {
    debugger;
    var ISNo = getParameterByName("ISNo", "");
    if (ISNo !== null) {
        $.ajax({
            url: "../../Services/Irregularity/IrregularityReportService.svc/GetCDRPrint",
            async: false,
            type: "GET",
            dataType: "json",
            data: { ISNo: ISNo },
            contentType: "application/json; charset=utf-8", cache: false,

            success: function (result) {
                //alert(data); // this is Json data object
                debugger;
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                FinalData1 = ResultData.Table1;
                FinalData2 = ResultData.Table2;

                if (FinalData.length > 0) {
                    $("#spnAWBIssueDate").text(FinalData[0].AWBIssueDate);
                    $("#spnAWBNumber").text(FinalData[0].AWBNumber);
                    $("#spnAirportOfDestination").text(FinalData[0].AirportOfDestination);
                    $("#spnAirportOfOrgin").text(FinalData[0].AirportOfOrgin);
                    $("#spnConsigneesNameAndAddress").text(FinalData[0].ConsigneesNameAndAddress);
                    $('#spnDate').text(FinalData[0].Date)
                    $("#spnDescriptionOfContents").text(FinalData[0].DescriptionOfContents);
                    $("#spnRemarks").html(FinalData[0].Remarks);
                    $("#spnFlightNumber").html(FinalData[0].FlightNumber);
                    $("#spnPiecesWeightAsPerAWB").html(FinalData[0].PiecesWeightAsPerAWB);
                    $("#spnPiecesWeightDamaged").html(FinalData[0].PiecesWeightDamaged);
                    $("#spnPiecesWeightMissing").html(FinalData[0].PiecesWeightMissing);
                    $("#spnPiecesWeightRecived").html(FinalData[0].PiecesWeightRecived);
                    $("#spnSignedConsignee").html(FinalData[0].SignedConsignee);
                    if (FinalData[0].IsCancel == "False")
                        $("#spnReprintCount").html(FinalData[0].PrintCount > 1 ? "(RE-PRINT: " + (FinalData[0].PrintCount - 1).toString() + ")" : "");
                }
                var strdata = '';

                //  if (FinalData1.length > 0) {
                //      strdata = strdata + "<tr><td align='center' style='width:8%'>Pcs</td><td align='center' style='width:15%'>Gross Wt.</td><td align='center' style='width:52%'>Description of Goods</td><td align='center' style='width:25%'>Flight Details</td></tr>";
                //  for (var num = 0; num < FinalData1.length; num++) {
                //      strdata = strdata + "<tr><td style='border:1px solid black; padding-right:10px' align='center'><span id='spnPcs'>" + FinalData1[num].Pieces + "</span></td><td class='auto-style36' style='border:1px solid black;' align='center'><span id='spnGrossWt'>" + FinalData1[num].GrossWeight + "</span></td><td class='auto-style12' style='border:1px solid black; vertical-align:top;'><span id='spnDescription'>" + FinalData1[num].DescriptionOfGoods + "</span></td><td style='border:1px solid black;height:40px; vertical-align:top;'><span id='spnFlightDetails'>" + FinalData1[num].FlightDetails + "</span></td><tr>";
                //$("#spnPcs").text(FinalData1[num].Pieces);
                //$("#spnGrossWt").text(FinalData1[num].GrossWeight);
                //$("#spnDescription").text(FinalData1[num].DescriptionOfGoods);
                //$("#spnFlightDetails").text(FinalData1[num].FlightDetails);
                //   }

                //      $('#tabletrans').html(strdata);
                //  }
                //var Particulars;
                //var Charges;
                //var TotalCharges = 0;
                //if (FinalData2.length > 0) {
                //    for (var num = 0; num < FinalData2.length; num++) {
                //        Particulars = Particulars + "</br>" + FinalData2[num].TariffName;
                //        Charges = Charges + "</br>" + FinalData2[num].ChargeValue;
                //        TotalCharges = parseFloat(TotalCharges) + parseFloat(FinalData2[num].ChargeValue);
                //    }
                //    $("#spnParticulars").html(Particulars.replace(undefined, ""));
                //    $("#spnAmount").html(Charges.replace(undefined, ""));
                //    $("#spnTotal").html(TotalCharges);
                // }
                PrintElem('#table1');
            },
            error: function (err) {
                alert("Generated error");
            }
        });
    }
    else {
        PrintElem('#table1');
        // alert("Value Null");
    }
}
function PrintElem(elem) {
    Popup($(elem).html());
}

function Popup(data) {
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>my div</title>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}