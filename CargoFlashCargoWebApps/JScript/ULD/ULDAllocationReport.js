$(document).ready(function () {

    //cfi.AutoComplete("UldStation", "AirportCode,AirportName", "vGetAirpotName", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoCompleteV2("UldStation", "AirportCode,AirportName", "ULD_UldStation", null, "contains");

    var caontettype = [{ Key: "1", Text: "HOST" }, { Key: "2", Text: "OAL" }];
    cfi.AutoCompleteByDataSource("UldOwnership", caontettype, null);
    $("#UldOwnership").val("1"); 
    $("#Text_UldOwnership").val("HOST");
    $("#divULDAllocationReport").html("");
    $.ajax({
        url: 'HtmlFiles/ULD/ULDAllocationReport.html',
        success: function (result) {

            $("#divULDAllocationReport").html(result);
            $("#divULDAllocationReport").css("overflow-x", "scroll");
        }


    });
    setTimeout(function () { UldAllocationReport(); }, 1500);
    $("#Search").click(function () {
        UldAllocationReport();
    })
});

function UldAllocationReport() {
    var Station = $("#UldStation").val();
    var Ownership = $("#UldOwnership").val();
    if (Station == "")
    {
        Station = "0";
    }
    $("#tblCityWiseULDAllocation").html('');
    $("#tblCurrentStock").html('');
    $("#tblDeficitSurplusStatus").html('');
    $.ajax({
        url: "Services/ULD/ULDAllocationReportService.svc/ULDAllocationReport?Station=" + Station + "&Ownership=" + ($("#UldOwnership").val()||"0"),
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var myData = jQuery.parseJSON(result).Table0;
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
			var FinalData1 = ResultData.Table1;
			if (myData != undefined && myData.length > 0)
				AppenDTableReport(myData, FinalData, FinalData1);
        }
    });
}
function AppenDTableReport(myData, FinalData, FinalData1) {

    var tbl = "", Hearder = "", Hearder1 = ""; Body = "", Footer = "", AddTr = "", AddTr1 = "", AddTr2 = "", ID = 0, ColSp1 = 0, ColSp2 = 0, thead1 = ""
         , tbody1 = "", tbody2 = "", background = "", tfoot = "", tfoot1 = "", tfoot2 = "", tbody = "", thead = "", ftd = "", ftd1 = "";

    if (myData.length > 0) {
        var columnsIn = myData[0];
        for (var key in columnsIn) {
            Hearder += "<td >" + key + "</td>"

            if (key != "NO" && key != "Station") {
                Hearder1 += "<td>" + key + "</td>"
                ftd1 += "<td></td>"
            }
            if (key == "NO" || key == "Station") {
                ColSp1 += 1;
            } else {
                ColSp2 += 1;
            }
        }
        for (var i in FinalData) {
            for (var j in FinalData[i]) {
                ID += 1
                tbody += "<td class='rowDataSd2'>" + FinalData[i][j] + "</td>"
            }
            AddTr += "<tr>" + tbody + "</tr>"
            tbody = "";
        }
        var ID1 = 0;
        var ID2 = 0;
        for (var k in FinalData1) {
            for (var l in FinalData1[i]) {
                ID1 += 1
                ID2 += 1;
                tbody1 += "<td class='rowDataSd'>" + FinalData1[k][l] + "</td>"
                var GG = parseInt(FinalData1[k][l] == "" ? 0 : FinalData1[k][l]) - parseInt(FinalData[k][l] == "" ? 0 : FinalData[k][l])
                if (GG < 0) {
                    background = "background-color: #f3b9c0 !important;color: red !important";
                } else if (GG == "0") {
                    GG = "";
                    background = "";
                } else {
                    background = "background-color: #61d6f9 !important";
                }
                tbody2 += "<td style='" + background + "' class='rowDataSd1'>" + GG + "</td>"
                if (ID1 == 1 || ID1 == 2) {
                    tbody1 = "";
                    tbody2 = "";
                }
            }
            AddTr1 += "<tr>" + tbody1 + "</tr>"
            AddTr2 += "<tr>" + tbody2 + "</tr>"
            ID1 = 0;
            tbody1 = "";
            tbody2 = "";

        }




    }
    thead = "<thead id='ULDAllocationthead' class='ULDAllocationthead'><tr><td colspan=" + ColSp1 + "></td><td colspan=" + ColSp2 + ">City Wise ULD Allocation</td></tr><tr>" + Hearder + "</tr></thead>";
    thead1 = "<thead id='ULDAllocationthead' class='ULDAllocationthead'><tr><td colspan=" + ColSp2 + ">Current Stock</td></tr><tr>" + Hearder1 + "</tr></thead>";
    thead2 = "<thead id='ULDAllocationthead' class='ULDAllocationthead'><tr><td colspan=" + ColSp2 + ">Deficit/ Surplus Status</td></tr><tr>" + Hearder1 + "</tr></thead>";
    tfoot = "<tfoot id='ULDAllocationtfoot' class='ULDAllocationtfoot'><tr><td><td>" + ftd1 + "</tr></tfoot>"
    tfoot1 = "<tfoot id='ULDAllocationtfoot' class='ULDAllocationtfoot'><tr class='totalColumn'>" + ftd1 + "</tr></tfoot>"
    tfoot2 = "<tfoot id='ULDAllocationtfoot' class='ULDAllocationtfoot'><tr>" + ftd1 + "</tr></tfoot>"
    $("#tblCityWiseULDAllocation").append(thead + "<tbody id='ULDAllocationtbody' class='ULDAllocationtbody'>" + AddTr + "</tbody>" + tfoot)
    $("#tblCurrentStock").append(thead1 + "<tbody id='ULDAllocationtbody' class='ULDAllocationtbody1'>" + AddTr1 + "</tbody>" + tfoot1)
    $("#tblDeficitSurplusStatus").append(thead2 + "<tbody id='ULDAllocationtbody' class='ULDAllocationtbody2'>" + AddTr2 + "</tbody>" + tfoot2)


    setTimeout(function () {
        FooterCalclulation()
    }, 100)


}
function FooterCalclulation() {
    var total2 = 0, total = 0; total1 = 0;

    for (K = 2; K < $('#tblCityWiseULDAllocation tr:eq(3) td').length; K++) {

        $('td.rowDataSd2:eq(' + K + ')', 'tr').each(function (K) {
            if ($(this).text() == '0') {
                $(this).text("")
            }
        });

    }

    for (s = 0; s < $('#tblCurrentStock tr:eq(3) td').length; s++) {

        $('td.rowDataSd:eq(' + s + ')', 'tr').each(function (s) {
            if ($(this).text() == '0') {
                $(this).text("")
            }
        });

    }

    for (K = 2; K < $('#tblCityWiseULDAllocation tr:eq(3) td').length; K++) {

        $('td.rowDataSd2:eq(' + K + ')', 'tr').each(function (K) {
            total2 = total2 + parseInt($(this).text() == "" ? 0 : $(this).text());
        });

        $('#tblCityWiseULDAllocation tr:last td').eq(K).text(total2 == "0" ? "" : total2);
        total2 = 0;
    }

    for (i = 0; i < $('#tblCurrentStock tr:eq(3) td').length; i++) {

        $('td.rowDataSd:eq(' + i + ')', 'tr').each(function (i) {
            total = total + parseInt($(this).text() == "" ? 0 : $(this).text());

        });

        $('#tblCurrentStock tr:last td').eq(i).text(total == "0" ? "" : total);
        total = 0;
    }

    for (j = 0; j < $('#tblDeficitSurplusStatus tr:eq(3) td').length; j++) {

        $('td.rowDataSd1:eq(' + j + ')', 'tr').each(function (j) {
            total1 = total1 + parseInt($(this).text() == "" ? 0 : $(this).text());
        });
        $('#tblDeficitSurplusStatus tr:last td').eq(j).text(total1 == "0" ? "" : total1);
        total1 = 0;
    }


}
function ULDAllocationPrintReport() {


    var divContents = $('#PrintTable').html();
    var printWindow = window.open('', '', '');
    printWindow.document.write('<html><head><title></title>' + css + '');
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();

    //PrintElem('#PrintTable');
}

function ULDAllocationPrintReportexcl(e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
    //creating a temporary HTML link element (they support setting file names)
    var a = document.createElement('a');
    //getting data from our div that contains the HTML table
    var data_type = 'data:application/vnd.ms-excel;charset=utf-8';

    var table_html = $('#PrintTable')[0].outerHTML;

    var css_html = '<style>table {border-collapse: collapse; border-spacing: 0;}'
    css_html += '.ULDAllocationthead td {width: 30px;background-color: #e3f0f6;color: black;border: 1px solid #CCC;}'
    css_html += '.ULDAllocationtfoot td {width: 30px;    background-color: #e3f0f6;    color: black;border: 1px solid #CCC; }'
    css_html += '.ULDAllocationtbody td {    width: 30px;    background-color: white;    color: black;    text-align: center;    border: 1px solid #CCC;    height: 20px;}'
    css_html += '.ULDAllocationtbody1 td {    width: 30px;   background-color: white;    color: black;    text-align: center;    border: 1px solid #CCC;    height: 20px;}'
    css_html += '.ULDAllocationtbody2 td {    width: 30px;    background-color: white;    color: black;    text-align: center;    border: 1px solid #CCC;    height: 20px;}';
    //    css_html = css_html.replace(/ /g, '%20');

    a.href = data_type + ',' + encodeURIComponent('<html><head>' + css_html + '</' + 'head><body>' + table_html + '</body></html>');

    //setting the file name
    a.download = 'ULDAllocation Report' + postfix + '.xls';
    //triggering the function

    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();


}
function ULDAllocationPrintReportpdf(e) {
    demoFromHTML();
}



function demoFromHTML() {
    var pdf = new jsPDF('p', 'pt', 'letter');

    pdf.cellInitialize();
    pdf.setFontSize(9);
    $.each($('#tblCityWiseULDAllocation tr'), function (i, row) {
        $.each($(row).find("td"), function (j, cell) {
            var txt = $(cell).text().trim() || " ";
            pdf.cell(3, 20, 27, 15, txt, i);
        });
    });
    $.each($('#tblCurrentStock tr'), function (i, row) {
        $.each($(row).find("td"), function (j, cell) {
            var txt = $(cell).text().trim() || " ";
            //  var width = (j == 3) ? 35 : 35; //make 4th column smaller
            pdf.cell(3, 30, 27, 15, txt, i);
        });
    });

    $.each($('#tblDeficitSurplusStatus tr'), function (i, row) {
        $.each($(row).find("td"), function (j, cell) {
            var txt = $(cell).text().trim() || " ";
            // var width = (j == 3) ? 35 : 35; //make 4th column smaller
            pdf.cell(3, 30, 27, 15, txt, i);
        });
    });

    pdf.save('ULDAllocation-Report.pdf');
}





var css = ' <style>table {border-collapse: collapse; border-spacing: 0;margin-top: 7px; }.ULDAllocationthead td {width: 30px;background-color: grey;color: black; text-align: center;'
    + 'border: 1px solid #CCC;font-weight: bold;height: 25px !important;}.ULDAllocationtfoot td {width: 30px; background-color: grey;color: black;text-align: center;'
    + 'border: 1px solid #CCC;font-weight: bold;height:40px !important;}.ULDAllocationtbody td { width: 30px;background-color: #8497b0;color: black;text-align: center;'
    + 'border: 1px solid #CCC;height: 20px;}.ULDAllocationtbody1 td {width: 30px;background-color: #d2a621;color: black;text-align: center;border: 1px solid #CCC;height: 20px;'
    + '}.ULDAllocationtbody2 td {width: 30px;background-color: #f4b084;color: black;text-align: center;border: 1px solid #CCC; height: 20px;}</style>'