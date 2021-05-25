
$(document).ready(function () {

    //cfi.ValidateForm();

    cfi.AutoCompleteV2("ULDNo", "UldStockSno,ULDNo", "ULD_RepairSLAReports", null, "contains", ",");
    //cfi.AutoComplete("AirlineName", "UldStockSno,AirlineName", "v_ULDRepairSLA_AirlineName", "UldStockSno", "AirlineName", ["AirlineName"], null, "contains");
    //cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "AirlineCode", "Airline", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoCompleteV2("AirlineName", "CarrierCode,AirlineName", "ULD_RepairSLAReport", null, "contains");
    $("#FromDate").val("")
    $("#ToDate").val("")


    $("#AirlineName").val(userContext.AirlineSNo);
    $("#Text_AirlineName").val(userContext.AirlineCarrierCode);

    //$('#FromDate').attr('readonly', true);
    //$('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#FromDate").change(function () {

        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        $("#ToDate").data("kendoDatePicker").value('');
    });



    $('#spnULDNo').closest('tr').prev().attr('class', 'formlabel');
    //$('#tbl tbody tr:eq(0)').attr('class', 'formInputcolumn');
    $.ajax({
        url: 'HtmlFiles/ULDRepair/RepairSLAReport.html',
        success: function (result) {
            $("#divSLARepair").html(result);

        }
    });

    cfi.ValidateForm();
    $('tr').find('td.formbuttonrow').remove();
    //$('tr').find('td.formActiontitle').remove();

    $("input[id='Search'][name='Search']").click(function () {
        $('table[id="Desctbl"]').show()
        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);

        //if (sDate > eDate) {
        //    ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
        //    return false;
        //}
        //else {
        ReportSLA(FromDate, ToDate)
        // }


    });


    $("input[id='ExportToExcel'][name='ExportToExcel']").click(function (e) {

        $('table[id="Desctbl"]').hide()

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
            return false;
        }

        else {
            ReportSLAExcel(FromDate, ToDate)
            setTimeout(function () {
                Excel(e)
            }, 100)
        }
    });


});

//$('#spnULDNo').closest('tr').prev().attr('class', 'formlabel');
////$('#tbl tbody tr:eq(0)').attr('class', 'formInputcolumn');
//$.ajax({
// url: 'HtmlFiles/ULDRepair/RepairSLAReport.html',
//success: function (result) {
//$("#divSLARepair").html(result);

//}
//});



function printSLAReport() {
    PrintElem('#divMainDiv');
}
function PrintElem(elem) {
    //$('#table1 tr[id^=trPrint]').remove();
    Popup($(elem).html());
}
function Popup(data) {
    var mywindow = window.open('', '', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<style type="text/css">' + css + '</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}
function ReportSLA(FromDate, ToDate) {

    $('table[id="Desctbl"] tbody').html("")

    $.ajax({
        url: "Services/ULD/ULDRepairSLAReportService.svc/ReportSLA",
        async: false,
        type: "GET",
        dataType: "json",
        data: { FromDate: FromDate, ToDate: ToDate, ULDSNo: $("#ULDNo").val(), AirlineName: $("#AirlineName").val() },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var tbl = "";
            var Color = "", CostAppSLA = "", CutReturn = "", CutInvoice = "";
            var css = "max-width: 50px;font-size: 16px;color: White;padding: 0px 3px 0px 5px;border: 1px solid #ded215;border-radius: 4px; z-index: 1;white-space: nowrap";

            if (FinalData.length > 0) {
                for (var i = 0; i < FinalData.length; i++) {

                    if (FinalData[i].CostAppSLA != "") {
                        var splipt = FinalData[i].CostAppSLA.split("-")

                        if (parseInt(splipt[1]) > parseInt(splipt[2])) {

                            CostAppSLA = '<table id="codexpl"><tr><td><a style="background: #4187a7;" class="round-button2">' + splipt[0] + '</a></td><td><a style="background: #2762af;" class="round-button">' + splipt[1] + '</a></td> <td><a style="background: green;" class="round-button1">' + splipt[2] + '</a></td></tr></table>';
                        } else {
                            CostAppSLA = '<table id="codexpl"><tr><td><a style="background: #4187a7;" class="round-button2">' + splipt[0] + '</a></td><td><a style="background: #2762af;" class="round-button">' + splipt[1] + '</a></td> <td><a style="background: red;" class="round-button1">' + splipt[2] + '</a></td></tr></table>';
                        }
                    }
                    if (FinalData[i].ReturnSLA != "") {
                        var splipt1 = FinalData[i].ReturnSLA.split("-")

                        if (parseInt(splipt1[1]) > parseInt(splipt1[2])) {
                            CutReturn = '<table id="codexpl"><tr><td><a style="background: #4187a7;" class="round-button2">' + splipt1[0] + '</a></td><td><a style="background: #2762af;" class="round-button">' + splipt1[1] + '</a></td> <td><a style="background: green;" class="round-button1">' + splipt1[2] + '</a></td></tr></table>';
                        } else {
                            CutReturn = '<table id="codexpl"><tr><td><a style="background: #4187a7;" class="round-button2">' + splipt1[0] + '</a></td><td><a style="background: #2762af;" class="round-button">' + splipt1[1] + '</a></td> <td><a style="background: red;" class="round-button1">' + splipt1[2] + '</a></td></tr></table>';

                        }
                    }

                    if (FinalData[i].InvoiceSLA != "") {
                        var splipt2 = FinalData[i].InvoiceSLA.split("-")
                        if (parseInt(splipt2[1]) > parseInt(splipt2[2])) {
                            CutInvoice = '<table id="codexpl"><tr><td><a style="background: #4187a7;" class="round-button2">' + splipt2[0] + '</a></td><td><a style="background: #2762af;" class="round-button">' + splipt2[1] + '</a></td> <td><a style="background: green;" class="round-button1">' + splipt2[2] + '</a></td></tr></table>';
                        } else {
                            CutInvoice = '<table id="codexpl"><tr><td><a style="background: #4187a7;" class="round-button2">' + splipt2[0] + '</a></td><td><a style="background: #2762af;" class="round-button">' + splipt2[1] + '</a></td> <td><a style="background: red;" class="round-button1">' + splipt2[2] + '</a></td></tr></table>';
                        }
                    }

                    tbl += '<tr> <td style="border:1px solid black;text-align:center"><span>' + (i + 1) + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center;"><span>' + FinalData[i].SNo + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:left;background: #4187a7;color: White"><span >' + FinalData[i].ULDNo + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].RepairRequest + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].QuotedOn + '</span></td> '
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].ReturnDate + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].IsinvoiceRcvdDate + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].MaintenanceType + '</span></td> '
                    tbl += '<td style="border:1px solid black;" align="center">' + CostAppSLA + '</td> '
                    tbl += '<td style="border:1px solid black;" align="center">' + CutReturn + '</td>'
                    tbl += '<td style="border:1px solid black;" align="center">' + CutInvoice + '</td></tr>';
                    CostAppSLA = "";
                    CutInvoice = "";
                    CutReturn = "";
                }
            }

            $('table[id="Desctbl"]').append('<tbody>' + tbl + '</tbody>')



        }





    });


}
function ReportSLAExcel(FromDate, ToDate) {

    $('table[id="Desctbl"] tbody').html("")

    $.ajax({
        url: "Services/ULD/ULDRepairSLAReportService.svc/ReportSLA",
        async: false,
        type: "GET",
        dataType: "json",
        data: { FromDate: FromDate, ToDate: ToDate, ULDSNo: $("#ULDNo").val(), AirlineName: $("#AirlineName").val() },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var tbl = "";
            if (FinalData.length > 0) {
                for (var i = 0; i < FinalData.length; i++) {
                    tbl += '<tr> <td style="border:1px solid black;text-align:center"><span>' + (i + 1) + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].SNo + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].ULDNo + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].RepairRequest + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].ReturnDate + '</span></td> '
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].ReturnDate + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].IsinvoiceRcvdDate + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].MaintenanceType + '</span></td> '
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].CostAppSLA + '</span></td> '
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].ReturnSLA + '</span></td>'
                    tbl += '<td style="border:1px solid black;text-align:center"><span>' + FinalData[i].InvoiceSLA + '</span></td></tr>';
                }
            }
            $('table[id="Desctbl"]').append('<tbody>' + tbl + '</tbody>')



        }





    });


}
function ExtraCondition(textId) {
    //$("#Text_Office").val('');
    //$("#Office").val('');
    //var f = cfi.getFilter("AND");

    //if (textId == "Text_AirlineName") {
    //    try {


    //        cfi.setFilter(f, "IsInterline", "eq", "0")
    //        //cfi.setFilter(f, "IsActive", "eq", "0")

    //        return cfi.autoCompleteFilter([f]);

    //    }
    //    catch (exp)
    //    { }
    //}
    var filter1 = cfi.getFilter("AND");

    if (textId.indexOf("Text_AirlineName") >= 0) {
        cfi.setFilter(filter1, "IsInterline", "eq", "0")
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }

    if (textId.indexOf("Text_ULDNo") >= 0) {
        cfi.setFilter(filter1, "UldStockSno", "notin", $('#ULDNo').val())
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}

function Excel(e) {


    //getting values of current time for generating the file name
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

    var table_html = $('#Desctbl')[0].outerHTML;
    //    table_html = table_html.replace(/ /g, '%20');
    table_html = table_html.replace(/<tfoot[\s\S.]*tfoot>/gmi, '');

    var css_html = '<style>td {border: 0.5pt solid #c0c0c0} .tRight { text-align:right} .tLeft { text-align:left} </style>';
    //    css_html = css_html.replace(/ /g, '%20');

    a.href = data_type + ',' + encodeURIComponent('<html><head>' + css_html + '</' + 'head><body>' + table_html + '</body></html>');

    //setting the file name
    a.download = 'ULD SLA Report' + postfix + '.xls';
    //triggering the function

    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();

}

//function color () {
//    // Score Color
//    var score = parseInt($('#score').text().trim());
//    var color = 'red';
//    if (!isNaN(score)) {
//        if (score >=0) {
//            color = 'orange';
//        }
//        if (score > 0) {
//            color = 'green';
//        }
//        $('#score').css('color', color);
//    }
//};

var css = ".ui-button-text {font-size: 11px;}#divMainGrid {"
css += " color: #333;"
css += "    font-size: 11px;"
css += "  font-family: 'Segoe UI', Verdana, Helvetica, Sans-Serif;"
css += "   margin: 0;"
css += "   padding: 0;"
css += "   height: 100%;}"
css += ".k-list-container {"
css += "   max-height: 200px;}"
css += "ul.k-list {   max-height: 200px;}"
css += "  #codexpl th, #codexpl td {   padding: 0.1em;}"
css += ".round-button {"
css += "    display: block;"
css += "    width: 30px;"
css += "    height: 25px;"
css += "   line-height: 25px;"
css += "    border: 2px solid black;"
css += "    border-radius: 30%;"
css += "    color: black;"
css += "    text-align: center;"
css += "    text-decoration: none;"
css += "   box-shadow: 0 0 2px gray;"
css += "    font-size: 10px;"
css += "   font-weight: bold;}"
css += ".round-button1 {"
css += "    display: block;"
css += "   width: 30px;"
css += "   height: 25px;"
css += "    line-height: 25px;"
css += "   border: 2px solid black;"
css += "    border-radius: 30%;"
css += "    color: black;"
css += "   text-align: center;"
css += "    text-decoration: none;"
css += "    box-shadow: 0 0 3px gray;"
css += "   font-size: 10px;"
css += "   font-weight: bold;}"

css += ".round-button2 {"
css += "  display: block;"
css += "  width: 60px;"
css += "   height: 25px;"
css += "    line-height: 25px;"
css += "    border: 2px solid black;"
css += "    border-radius: 10%;"
css += "    color: black;"
css += "    text-align: center;"
css += "    text-decoration: none;"
css += "    box-shadow: 0 0 3px gray;"
css += "    font-size: 8px;"
css += "    font-weight: bold;}"