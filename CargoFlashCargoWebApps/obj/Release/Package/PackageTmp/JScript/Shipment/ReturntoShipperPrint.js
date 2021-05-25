$(document).ready(function () {
    GetReturntoShipperData();
})


function GetReturntoShipperData() {
    debugger;
    var AwbSno;
    var tbl = "";
    var NopiecesDiv = "";

 


 
    AwbSno = getParameterByName("AWBSNo", "");

        
        
        if (AwbSno != "") {
            $.ajax({
                url: "../../Services/Shipment/ReturntoShipperService.svc/GetReturntoShipperDataFormReturnShipper", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AwbSno: AwbSno}),
                success: function (result) {

                    var GetSucessResult = JSON.parse(result);
                    if (GetSucessResult != undefined) {
             
                        if (GetSucessResult.Table0.length > 0) {

                            $("span#spnOrigin").text(GetSucessResult.Table0[0].OriginCityName);
                            $("span#spnDestination").text(GetSucessResult.Table0[0].DestinationCityName);

                            $("span#spnProduct").text(GetSucessResult.Table0[0].ProductName);
                            $("span#spnForwarder").text(GetSucessResult.Table0[0].Name);
                            $("#spnPieces").text(GetSucessResult.Table0[0].Pieces);
                            $("#spnGrWt").text(GetSucessResult.Table0[0].FOHGrossWeight);
                            $("#spnCBM").text(GetSucessResult.Table0[0].FOHCBM);
                            $("#spnVolWt").text(GetSucessResult.Table0[0].FOHVolumeWeight);
                          
                            $("span#spnNatureofGoods").text(GetSucessResult.Table0[0].CommodityDescription);
                            $("span#spnSHC").text(GetSucessResult.Table0[0].SHC);

                          



                            $("#spnCustomeRefNo").text(GetSucessResult.Table0[0].CustomRefNo);
                            $("#spnNOCRefNo").text(GetSucessResult.Table0[0].NOCRefNo);
                            $("#spnReason").text(GetSucessResult.Table0[0].Reason);
                            $("#spnTotalCharges").text(GetSucessResult.Table0[0].TotalCharges);




                            if (GetSucessResult.Table1.length > 0) {


                                tbl += "<table  border='0' cellpadding='0' cellspacing='0' style='width:100%;' >"
                             
                                tbl += " <tr>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px;' width='25%'><b>Board Point</b></td>"
                                tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px;' width='25%'><b>Off Point</b></td>"
                                tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px;' width='25%'><b>Flight Date</b></td>"
                                tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px;' width='25%'><b>Flight No.</b></td>"

                                tbl += "</tr>"


                                for (var i = 1; i <= GetSucessResult.Table1.length; i++) {



                                    tbl += "<tr>"
                                    tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px;'>" + GetSucessResult.Table1[i - 1].OriginAirportName + "</td>"
                                    tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px;'>" + GetSucessResult.Table1[i - 1].DestinationAirportName + "</td>"
                                    tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px;'>" + GetSucessResult.Table1[i - 1].FlightDate + "</td>"
                                    tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px;'>" + GetSucessResult.Table1[i - 1].FlightNo + "</td>"
                                    tbl += "</tr>"






                                }
                                tbl += "</table>"

                                $("#DivItineraryInformation").append(tbl);
                                tbl = "";

                            }




                        }
                        else {
                            ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                        }
                    }

                    else {
                        ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                    }
                }
            });
        }
        else {
          
        }




  
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function funPrintRSReportData(divID, bac) {
    PrintDiv($(divID).html(), $(bac).html());
}

function PrintDiv(data, bac) {
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>my div</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
    return true;
}