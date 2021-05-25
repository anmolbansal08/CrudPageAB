$(document).ready(function () {
    GetULDInvoiceData();
   
});


function GetULDInvoiceData() {
 




    var recordID = getParameterByName("RecID", "");
    var LogoURL = getParameterByName("LogoURL", "");
    $('#ImgLogo').attr('src', LogoURL);

    var tbl = "";


  



    if (recordID != "") {
        $.ajax({
            url: "../../Services/ULD/ULDInvoiceService.svc/ULDInvoiceGridAppendGridForInvoiceForPrint", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ recordID: recordID }),
            success: function (result) {
                var totalmetrial = 0.00;
                var totalmanhours = 0.00;
                var grandTotal = 0.00;
                var GetSucessResult = JSON.parse(result);
                if (GetSucessResult != undefined) {

                    if (GetSucessResult.Table1.length > 0) {


                        $("span#spncustomerdetails").text(GetSucessResult.Table1[0].CustomerName);
                       // $("span#spncustomerName").text(GetSucessResult.Table1[0].CustomerName);

                        $("span#spnphone").text(GetSucessResult.Table1[0].Phone);
                        $("span#spnnppano").text(GetSucessResult.Table1[0].NPPANo);
                        $("span#spnfax").text(GetSucessResult.Table1[0].Fax);
                        $("span#spnInvoicedate").text(GetSucessResult.Table1[0].InvoiceDate);
                        $("span#spncitycountry").text(GetSucessResult.Table1[0].citycountry);
                        $("span#spnsalesorderno").text(GetSucessResult.Table1[0].SalesOrderNo);
                        $("span#spnAgreementNumberno").text(GetSucessResult.Table1[0].AgreementNumber);
                        $("span#spnaddress").text(GetSucessResult.Table1[0].Addressvalue);
                        $("span#spnfootervendorname").text(GetSucessResult.Table1[0].CustomerName);
                        
                    }

                    if (GetSucessResult.Table0.length > 0) {

            







                        if (GetSucessResult.Table0.length > 0) {


                            tbl += "<table  cellpadding='0' cellspacing='0' style='width:100%; ' >"

                            tbl += " <tr style='width:100%; border: 1px solid black;'>"
                            tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>RO NO</b></td>"
                            tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>Equipment</b></td>"
                            tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>Registration</b></td>"
                            tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>Work Inspection</b></td>"
                            tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>Meterial(IDR)</b></td>"
                            tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>ManHours(IDR)</b></td>"
                            tbl += "<td  style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' width='15%'><b>Total(IDR)</b></td>"
                            

                            tbl += "</tr>"


                            for (var i = 1; i <= GetSucessResult.Table0.length; i++) {

                                totalmetrial = parseFloat(totalmetrial) + parseFloat(GetSucessResult.Table0[i - 1].Meterial);
                                totalmanhours = parseFloat(totalmanhours) + parseFloat(GetSucessResult.Table0[i - 1].ManHours);
                                grandTotal = parseFloat(grandTotal) + parseFloat(GetSucessResult.Table0[i - 1].Total);
                                tbl += "<tr>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].RONO + "</td>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].Equipment + "</td>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].Registration + "</td>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].Work_Inspection + "</td>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].Meterial + "</td>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].ManHours + "</td>"
                                tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + GetSucessResult.Table0[i - 1].Total + "</td>"
                                tbl += "</tr>"






                            }

                            tbl += "<tr>"
                            tbl += "<td colspan='4' style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' align='right'>TOTAL</td>"
                           
                            tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + totalmetrial + "</td>"
                            tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + totalmanhours + "</td>"
                            tbl += "<td style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' rowspan='2'>" + grandTotal + "</td>"
                            tbl += "</tr>"


                            tbl += "<tr>"
                            tbl += "<td colspan='6' style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;' align='right'>GRAND TOTAL</td>"

                           // tbl += "<td rowspan='2' style='padding: 4px; font-family: sans-serif; font-size: 12px; border: 1px solid black;'>" + grandTotal + "</td>"
                         
                            tbl += "</tr>"

                            tbl += "</table>"

                            $("#DivDetails").append(tbl);
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
    var mywindow = window.open('', 'my div', 'height=500,width=800');
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