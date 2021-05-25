/*
*****************************************************************************
Javascript Name:	DAILY REPORT STORAGE CHARGES   
Purpose:		    This JS used to get autocomplete for ESS.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Shivali Thakur
Created On:		    21 Feb 2019
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();


    $('#spntypespn').closest('td').next().html('<input type="radio" tabindex="4" data-radioval="Export" class="" name="HandlingType" id="HandlingType" value="1" checked="True">Export <input type="radio" tabindex="4" data-radioval="Import" class="" name="HandlingType" id="HandlingType" value="2">Import<input type="radio" tabindex="4" data-radioval="Both" class="" name="HandlingType" id="HandlingType" value="3">Both')

    $('#spnrptspn').closest('td').next().html('<input type="radio" tabindex="5" data-radioval="Summary" class="" name="ReportType" id="ReportType" value="1" checked="True">Summary <input type="radio" tabindex="5" data-radioval="Detail" class="" name="ReportType" id="ReportType" value="2">Detail')


    cfi.AutoCompleteV2("Party", "PartyName", "ESS_PartyName", null, "contains");

    var alphabettypes = [{ Key: "1", Text: "Domestic" }, { Key: "2", Text: "International" }, { Key: "0", Text: "Both" }];
    cfi.AutoCompleteByDataSource("Type", alphabettypes);
    cfi.AutoCompleteV2("CitySno", "CityCode,CityName", "BookingProfileReport_City", null, "contains");
    //$("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");
    //$("input[id='ExportToExcel'][name='ExportToExcel']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='ExportToExcel' id='ExportToExcel' />");
    $("#tbl").after("<div id='tblreport'></div>");

    var d = new Date();
    d.setHours(d.getHours());
    $('#ToDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1,
        value: d
    });


    var d = new Date();
    d.setHours(d.getHours());
    $('#FromDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1,
        value: d
    });


    $("input[id='Search'][name='Search']").click(function () {

        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);

        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            Search();
        }



    });

    $("input[id='ExportToExcel'][name='ExportToExcel']").click(function () {

        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);

        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            GetExcel();
        }
    });

});

function GetExcel() {

    var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd");
    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd");
    var type = $("#Type").val() || 0;
    var handling = $("input:radio[name='HandlingType']:checked").val();
    var reporting = $("input:radio[name='ReportType']:checked").val();
    var party = $("#Party").val();

    if (handling == "1") {
        var hfix = "EXPORT ";
    }
    if (handling == "2") {
        var hfix = "IMPORT ";
    }
    if (handling == "3") {
        var hfix = "EXPORT/IMPORT ";
    }

    if (reporting == "1") {
        var rfix = "Summary";
    }
    if (reporting == "2") {
        var rfix = "Detail";
    }

    if ($("#Type").val() == "1") {
        var fix = hfix + "Cash Register " + rfix;
    }
    if ($("#Type").val() == "2") {
        var fix = hfix + "Credit Register " + rfix;

    }
    if ($("#Type").val() == "3") {
        var fix = hfix + "Cash/Credit Register " + rfix;
    }
    var citysno = $('#CitySno').val();
    var airlinesno = userContext.AirlineSNo;
    var airportsno = userContext.AirportSNo;
    var colval = [];
    var colval1 = [];
    var colval2 = [];
    var colval3 = [];
    var totalc = 0;
    var totalT10 = 0;
    var totalT9 = 0;
    var totalCSC = 0;
    var count = 0;
    var totalcount = 0;

    $.ajax({
        url: "Services/Report/ESS_DailyReportService.svc/GetESS_DailyReportRecord",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            airlinesno: airlinesno, airportsno: airportsno, FromDate: FromDate, ToDate: ToDate, Type: type, Handling: handling, Reporting: reporting, Party: party, citysno: citysno
        }),
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData0 = ResultData.Table0;
            var FinalData1 = ResultData.Table1;
            var FDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "dd-MMM-yyyy HH:mm");

            var tbl = "";
            if (FinalData0.length > 0) {
                var str = "<html><table class='dataTable' width:100%  border=\"1px\">";
                str += "<tr style='background-color:#D5E1F0;border:1px solid;font-size: 18px;height:20px;text-align: center;'><td colspan=9><b>PARTELAAN CARGO IMPORT</b></td></tr>"
                str += "<tr style='background-color:#D5E1F0;border:1px solid;font-size: 18px;height:20px;text-align: center;'><td colspan=9><b> Date : " + FDate+"</b></td></tr>"
                str += "<tr style='background-color:#C0C0C0;border:1px solid;font-size: 16px;height: 20px;'><td>No</td><td>DRSC</td><td>Unique No.</td>"
                str += "<td> Agent Name</td > <td>CCY</td> <td>Penerimaan</td> <td>Uraian</td> <td>CCY1</td> <td>Pengeluaran</td>"
                str += "</tr > "

                for (var i = 0; i < FinalData0.length; i++) {
                    str += "<tr><td>" + (i + 1) + "</td><td>" + FinalData0[i].DRSC
                        + "</td><td>" + FinalData0[i].Unique_No
                        + "</td><td>" + FinalData0[i].AgentName
                        + "</td><td>" + FinalData0[i].CCY
                        + "</td><td>" + FinalData0[i].Penerimaan
                        + "</td><td>" + FinalData0[i].Uraian
                        + "</td><td>" + FinalData0[i].CCY1
                        + "</td> <td align=left>" + FinalData0[i].Pengeluaran + "</td></tr>"
                }
                if (FinalData1.length > 0) {
                    for (var i = 0; i < FinalData1.length; i++) {
                        str += "<tr> <td> </td>"
                            + "<td> DRSC </td>" 
                            + "<td> </td> <td>" + FinalData1[i].TotalCash
                            + "</td> <td align=left>" + FinalData1[i].Totalvalue
                            + "</td> <td> </td> <td> </td> <td> </td> <td> </td> </tr>"
                    }
                }

                str += "</table></html>";

                var d = new Date();
                var dd = d.getDate();
                var month = d.getMonth() + 1;
                var yrs = d.getFullYear();
                var yyyy = d.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                var today = dd + '_' + month + '_' + yrs;
                var filename = 'Daily Report Storage_' + today + '_'; //  
                exportToExcelNew(str, filename);
            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }

        }
    });
}
function Search() {
    if (cfi.IsValidSubmitSection()) {

        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd");
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd");
        var type = $("#Type").val()||0;
        var handling = $("input:radio[name='HandlingType']:checked").val();
        var reporting = $("input:radio[name='ReportType']:checked").val();
        var party = $("#Party").val();

        if (handling == "1") {
            var hfix = "EXPORT ";
        }
        if (handling == "2") {
            var hfix = "IMPORT ";
        }
        if (handling == "3") {
            var hfix = "EXPORT/IMPORT ";
        }

        if (reporting == "1") {
            var rfix = "Summary";
        }
        if (reporting == "2") {
            var rfix = "Detail";
        }

        if ($("#Type").val() == "1") {
            var fix = hfix + "Cash Register " + rfix;
        }
        if ($("#Type").val() == "2") {
            var fix = hfix + "Credit Register " + rfix;

        }
        if ($("#Type").val() == "3") {
            var fix = hfix + "Cash/Credit Register " + rfix;
        }
        var citysno = $('#CitySno').val();
        var airlinesno = userContext.AirlineSNo;
        var airportsno = userContext.AirportSNo;
        var colval = [];
        var colval1 = [];
        var colval2 = [];
        var colval3 = [];
        var totalc = 0;
        var totalT10 = 0;
        var totalT9 = 0;
        var totalCSC = 0;
        var count = 0;

        var totalcount = 0;
        $.ajax({
            url: "Services/Report/ESS_DailyReportService.svc/GetESS_DailyReportRecord",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                airlinesno: airlinesno, airportsno: airportsno, FromDate: FromDate, ToDate: ToDate, Type: type, Handling: handling, Reporting: reporting, Party: party, citysno: citysno
            }),
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                if (reporting == 1) {
                    var dataTableobj = JSON.parse(data);
                    var m = 0;
                    if (dataTableobj.Table0.length > 0) {

                        var str = "";
                        str += "<table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan=9><font color=':#419AD4'><b>PARTELAAN CARGO IMPORT</b></font></td></tr>"
                        str += "<tr  font-size:13pt;font-family:Arial'><td align='center' colspan=9>Date : " + $("#FromDate").val(); + "</td></tr>"
                        //  <tr><td colspan='8' align='LEFT'>Garuda Indonesia Establishment</td>  <td align=\"right\" colspan='6'>Date : " + $("#FromDate").val(); + "</td></tr>";
                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'><font color='white'>&nbsp;<b><td>No</td><td>DRSE</td><td>Unique_No</td><td>AgentName</td><td>CCY</td><td>Penerimaan</td><td>Uraian</td><td>CCY1</td><td>Pengeluaran</td></font></tr>";

                        for (var l = 0; l < dataTableobj.Table0.length; l++) {
                            str += "<tr>";
                            str += "<td>" + (l + 1) + "</td><td>" + dataTableobj.Table0[l]["DRSC"] + "</td><td>" + dataTableobj.Table0[l]["Unique_No"] + "</td><td>" + dataTableobj.Table0[l]["AgentName"] + "</td><td>" + dataTableobj.Table0[l]["CCY"] + "</td>";
                            str += "<td>" + dataTableobj.Table0[l]["Penerimaan"] + "</td>";
                            str += "<td>" + dataTableobj.Table0[l]["Uraian"] + "</td><td>" + dataTableobj.Table0[l]["CCY1"] + "</td><td>" + dataTableobj.Table0[l]["Pengeluaran"] + "</td>"
                            str += "</tr>";

                        }
                        str += "<tr><hr/></tr>";

                        for (var m = 0; m < dataTableobj.Table1.length; m++) {
                            str += "<tr>";
                            str += "<td></td><td>DRSC</td><td></td><td>" + dataTableobj.Table1[m]["TotalCash"] + "</td><td>" + dataTableobj.Table1[m]["Totalvalue"] + "</td>";
                            str += "<td></td>";
                            str += "<td></td><td></td><td></td>";
                            str += "</tr>";
                        }

                        str += "</table>";

                        var myWindow;
                        myWindow = window.open("ESS", "_blank");
                        myWindow.document.write(str);
                        myWindow.document.title = fix;
                    }
                    else {
                        alert("Data not found");
                    }

                }
                else {
                    var dataTableobj = JSON.parse(data);


                    //FOR CASH
                    count = parseInt(dataTableobj.Table0.length);
                    var table = '';
                    var div = '';
                    var RowData = {};
                    var Columns = [];
                    var JSONColumn = {};
                    var row = '';
                    var footer = '';
                    var rowsum = 0;
                    var colval = [];

                    $.each(dataTableobj.Table0, function (id, item) {
                        var FirstSplit = item.ChargesString.split(',');
                        RowData[id] = {};
                        $.each(item, function (key, value) {
                            if (key != "ChargesString") {
                                if (RowData[id].hasOwnProperty([key])) {
                                    RowData[id][key] = value;
                                }
                                else {

                                    RowData[id][key] = value;
                                    if (!JSONColumn.hasOwnProperty([key])) {
                                        Columns.push(key);
                                        JSONColumn[key] = 0;
                                    }
                                }
                            }
                        });
                        var TotalCharge = 0;
                        $.each(FirstSplit, function (k1, item1) {
                            var SecondSplit = item1.split('_');

                            $.each(SecondSplit, function (k2, item2) {
                                var ThirdSplit = item2.split(':');
                                if (RowData[id].hasOwnProperty([ThirdSplit[0]])) {
                                    RowData[id][ThirdSplit[0]] = parseFloat(RowData[id][ThirdSplit[0]]) + parseFloat(ThirdSplit[1]);
                                }
                                else {
                                    RowData[id][ThirdSplit[0]] = parseFloat(ThirdSplit[1]);
                                    if (!JSONColumn.hasOwnProperty([ThirdSplit[0]])) {
                                        Columns.push(ThirdSplit[0]);
                                        JSONColumn[ThirdSplit[0]] = 0;
                                    }
                                }
                                TotalCharge += parseFloat(ThirdSplit[1]);
                            })
                            if (!JSONColumn.hasOwnProperty('Total')) {
                                Columns.push('Total');
                            }
                            JSONColumn['Total'] = TotalCharge;
                            RowData[id]['Total'] = TotalCharge;


                        });
                       
                    });

                    if (Columns.length > 0) {
                        for (var i = 0; i < Columns.length; i++) {
                            if (Columns[i] == 'T10' || Columns[i] == 'T9' || Columns[i] == 'Total' || Columns[i] == 'Remarks') {
                                Columns.splice(i, 1);
                            }
                            if (Columns[i] == 'T9') {
                                Columns.splice(i, 1);
                            }
                            if (Columns[i] == 'Total') {
                                Columns.splice(i, 1);
                            }
                            if (Columns[i] == 'Remarks') {
                                Columns.splice(i, 1);
                            }
                        }

                        Columns.push('T10');
                        Columns.push('T9');
                        Columns.push('Total');
                        Columns.push('Remarks');
                    }
                   $.each(dataTableobj.Table0, function (id, item) {
                        

                       // $.each(dataTableobj.Table0, function (id, item) {
                            var ColLength = Columns.length;
                            if (id % 25 == 0) {
                                if (table.length > 0) {


                                    div += '</table></br><br/>';

                                }

                                table = "<table border=\"1px\" cellpadding='0' style='border-collapse:collapse' cellspacing='2' width='100%'>";
                                table += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='" + ColLength + "'><font color=':#419AD4'><b>DAILY REPORT STORAGE CHARGES(CASH)</b></font></td></tr>"
                                table += "'<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='" + parseInt(ColLength / 3) + "'></td><td align=\"left\" colspan='" + (parseFloat(ColLength / 3) - parseInt(ColLength / 3) > 0 ? parseInt(ColLength / 3) + 1 : parseInt(ColLength / 3)) + "'><b>DAILY REPORT STORAGE CHARGES CARGO " + hfix + "</b></td><td align=\"left\" colspan='" + parseInt(ColLength / 3) + "'>Kurs:IDR||No:" + RowData[id]["ref"] + "</td></tr><tr><td colspan='" + parseInt(ColLength / 2) + "' align='LEFT'>Garuda Indonesia Establishment</td>  <td align=\"left\" colspan='" + (parseFloat(ColLength / 2) - parseInt(ColLength / 2) > 0 ? parseInt(ColLength / 2) + 1 : parseInt(ColLength / 2)) + "'>Date : " + $("#FromDate").val() +"  " + $("#ToDate").val() + "</td></tr>";
                                var header = "<tr  style='background-color:#419AD4;font-size:10pt;font-family:Arial'>";
                                row = '<tr>';
                                for (var i = 0; i < ColLength; i++) {
                                    if (Columns[i] != "ref") {
                                        header += '<td>' + Columns[i] + '</td>';
                                        if (Columns[i] != "ref") {
                                            if (Columns[i] == 'T10' || Columns[i] == 'Total') {
                                                row += '<td>' + (RowData[id].hasOwnProperty([Columns[i]]) == true ? RowData[id][Columns[i]].toFixed(2) : "") + '</td>';
                                            }
                                            else {
                                                row += '<td>' + (RowData[id].hasOwnProperty([Columns[i]]) == true ? RowData[id][Columns[i]] : "") + '</td>';
                                            }
                                        }
                                    }
                                }
                                header += '</tr>';
                                row += '</tr>';
                                table += header + row;
                                div += table;
                            }
                            else {
                                row = '<tr font-size:13pt;font-family:Arial>';
                                for (var i = 0; i < ColLength; i++) {
                                    if (Columns[i] != "ref") {
                                        if (Columns[i] == 'T10' || Columns[i] == 'Total') {
                                            row += '<td>' + (RowData[id].hasOwnProperty([Columns[i]]) == true ? RowData[id][Columns[i]].toFixed(2) : "") + '</td>';
                                        }
                                        else {
                                            row += '<td>' + (RowData[id].hasOwnProperty([Columns[i]]) == true ? RowData[id][Columns[i]] : "") + '</td>';
                                        }
                                    }
                                    //if (Columns[i] != "ref") {
                                    //    row += '<td>' + (RowData[id].hasOwnProperty([Columns[i]]) == true ? RowData[id][Columns[i]].toFixed(2) : "") + '</td>';
                                    //}
                                   
                                }
                                row += '</tr>';

                                div += row;
                            }

                            if (dataTableobj.Table0.length - 1 == id) {

                                row += '</tr>';
                                div += '</table>';
                            }



                       // });
                    });



                    //FOR CREDIT 
                    var count1 = parseInt(dataTableobj.Table1.length);
                    var table1 = '';
                    var div1 = '';
                    var RowData1 = {};
                    var Columns1 = [];
                    var JSONColumn1 = {};
                    var row1 = '';
                    var footer1 = '';
                    var rowsum1 = 0;
                    var RefNo = 0;
                    var PRNo = 0;

                    $.each(dataTableobj.Table1, function (id, item) {
                        var FirstSplit1 = item.ChargesString.split(',');
                        RowData1[id] = {};
                        $.each(item, function (key, value) {
                            if (key != "ChargesString") {
                                if (RowData1[id].hasOwnProperty([key])) {
                                    RowData1[id][key] = value;
                                }
                                else {
                                    RowData1[id][key] = value;

                                    if (!JSONColumn1.hasOwnProperty([key])) {
                                        Columns1.push(key);
                                        JSONColumn1[key] = 0;
                                    }
                                }
                            }
                            else {
                                var TotalCharge = 0;
                                $.each(FirstSplit1, function (k1, item1) {
                                    var SecondSplit1 = item1.split('_');                                   
                                    $.each(SecondSplit1, function (k2, item2) {
                                        var ThirdSplit1 = item2.split(':');
                                        if (RowData1[id].hasOwnProperty([ThirdSplit1[0]])) {
                                            RowData1[id][ThirdSplit1[0]] = parseFloat(RowData1[id][ThirdSplit1[0]]) + parseFloat(ThirdSplit1[1]);
                                        }
                                        else {
                                            RowData1[id][ThirdSplit1[0]] = parseFloat(ThirdSplit1[1]);
                                            if (!JSONColumn1.hasOwnProperty([ThirdSplit1[0]])) {
                                                Columns1.push(ThirdSplit1[0]);
                                                JSONColumn1[ThirdSplit1[0]] = 0;
                                            }
                                        }
                                        TotalCharge += parseFloat(ThirdSplit1[1]);
                                    })
                                    if (!JSONColumn1.hasOwnProperty('Total')) {
                                        Columns1.push('Total');                                        
                                    }
                                    JSONColumn1['Total'] = TotalCharge;
                                    RowData1[id]['Total'] = TotalCharge;

                                });
                               
                            }
                        });
                    });
                    
                    if (Columns1.length > 0)
                    {
                        for(var i=0; i<Columns1.length;i++)
                        {
                            if (Columns1[i] == 'T10' || Columns1[i] == 'T9' || Columns1[i] == 'Total' || Columns1[i] == 'Remarks')
                            {
                                Columns1.splice(i, 1);
                            }
                            if (Columns1[i] == 'T9') {
                                Columns1.splice(i, 1);
                            }
                            if (Columns1[i] == 'Total') {
                                Columns1.splice(i, 1);
                            }
                            if (Columns1[i] == 'AccountName') {
                                Columns1.splice(i, 1);
                            }
                            if (Columns1[i] == 'PRNo') {
                                Columns1.splice(i, 1);
                            }
                            if (Columns1[i] == 'ref') {
                                Columns1.splice(i, 1);
                            }
                        }

                        Columns1.push('T10');
                        Columns1.push('T9');
                        Columns1.push('Total');
                        Columns1.push('Remarks');
                    }

                    $.each(dataTableobj.Table1, function (id, item) {
                        var n = 0;
                        PRNo = parseInt(item.PRNo) - 1;
                        var ColLength = Columns1.length;
                        if (PRNo % 25 == 0 || RefNo != parseInt(item.ref)) {

                            RefNo = parseInt(item.ref);

                            if (table1.length > 0) {
                                div1 += '</table></br><br/>';
                            }
                           
                            table1 = "<BR/><BR/><table border=\"1px\" style='border-collapse: collapse;' cellpadding='0' cellspacing='2' width='100%'>";
                            table1 += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='" + ColLength + "'><font color=':#419AD4'><b>DAILY REPORT STORAGE CHARGES(CREDIT)</b></font></td></tr>"
                            table1 += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='" + parseInt(ColLength / 3) + "'>'" + RowData1[id]["AccountName"] + "'</td><td align=\"left\" colspan='" + (parseFloat(ColLength / 3) - parseInt(ColLength / 3) > 0 ? parseInt(ColLength / 3) + 1 : parseInt(ColLength / 3)) + "'><b>DAILY REPORT STORAGE CHARGES CARGO " + hfix + "</b></td><td align=\"left\" colspan='" + parseInt(ColLength / 3) + "'>Kurs:IDR||No:" + RowData1[id]["ref1"] + "</td></tr><tr><td colspan='" + parseInt(ColLength / 2) + "' align='LEFT'>Garuda Indonesia Establishment</td>  <td align=\"left\" colspan='" + (parseFloat(ColLength / 2) - parseInt(ColLength / 2) > 0 ? parseInt(ColLength / 2) + 1 : parseInt(ColLength / 2)) + "'>Date : "+$("#FromDate").val() +"  " + $("#ToDate").val()+ "</td></tr>";
                            var header = "<tr  style='background-color:#419AD4;font-size:10pt;font-family:Arial'>";
                            row1 = '<tr>';
                            // footer = '<tr>';
                            for (var i = n; i < ColLength; i++) {
                                if (Columns1[i] != "ref" && Columns1[i] != "ref1" &&  Columns1[i] != "PRNo" && Columns1[i] != "AccountName") {                  
                                    header += '<td>' + Columns1[i] + '</td>';
                                  
                                    if (Columns1[i] == 'T10' || Columns1[i] == 'Total') {
                                            row1 += '<td>' + (RowData1[id].hasOwnProperty([Columns1[i]]) == true ? RowData1[id][Columns1[i]].toFixed(2) : "") + '</td>';
                                        }
                                        else {
                                            row1 += '<td>' + (RowData1[id].hasOwnProperty([Columns1[i]]) == true ? RowData1[id][Columns1[i]] : "") + '</td>';
                                        }
                                   
                                       
                                 
                                }
                            }
                            header += '</tr>';
                            row1 += '</tr>';
                            //  footer += '</tr>';
                            table1 += header + row1;
                            div1 += table1;
                        }
                        else {
                            row1 = '<tr font-size:13pt;font-family:Arial>';
                            for (var i = 0; i < ColLength; i++) {
                                if (Columns1[i] != "" && Columns1[i] != "ref" && Columns1[i] != "ref1" && Columns1[i] != "PRNo" && Columns1[i] != "AccountName") {
                                    if (Columns1[i] == 'T10'||  Columns1[i] == 'Total') {
                                        row1 += '<td>' + (RowData1[id].hasOwnProperty([Columns1[i]]) == true ? RowData1[id][Columns1[i]].toFixed(2) : "") + '</td>';
                                    }
                                    else {
                                        row1 += '<td>' + (RowData1[id].hasOwnProperty([Columns1[i]]) == true ? RowData1[id][Columns1[i]] : "") + '</td>';
                                    }
                                }
                            }
                            row1 += '</tr>';

                            div1 += row1;
                            n += id;
                            RefNo = parseInt(item.ref);
                        }

                        if (dataTableobj.Table1.length - 1 == id) {

                            row1 += '</tr>';
                            div1 += '</table>';
                        }

                    });

                    //FOR WAREHOUSE CHARGE
                    var count2 = parseInt(dataTableobj.Table2.length);
                    var table2 = '';
                    var div2 = '';
                    var RowData2 = {};
                    var Columns2 = [];
                    var JSONColumn2 = {};
                    var row2 = '';
                    var footer2 = '';
                    var rowsum2 = 0;
                    $.each(dataTableobj.Table2, function (id, item) {
                        var FirstSplit2= item.ChargesString.split(',');
                        RowData2[id] = {};
                        $.each(item, function (key, value) {
                            if (key != "ChargesString") {
                                if (RowData2[id].hasOwnProperty([key])) {
                                    RowData2[id][key] = value;
                                }
                                else {
                                    RowData2[id][key] = value;

                                    if (!JSONColumn2.hasOwnProperty([key])) {
                                        Columns2.push(key);
                                        JSONColumn2[key] = 0;
                                    }
                                }
                            }
                        });
                        var TotalCharge = 0;
                        $.each(FirstSplit2, function (k1, item1) {
                            var SecondSplit2 = item1.split('_');

                            $.each(SecondSplit2, function (k2, item2) {
                                var ThirdSplit2 = item2.split(':');
                                if (RowData2[id].hasOwnProperty([ThirdSplit2[0]])) {
                                    RowData2[id][ThirdSplit2[0]] = parseFloat(RowData2[id][ThirdSplit2[0]]) + parseFloat(ThirdSplit2[1]);
                                }
                                else {
                                    RowData2[id][ThirdSplit2[0]] = parseFloat(ThirdSplit2[1]);
                                    if (!JSONColumn2.hasOwnProperty([ThirdSplit2[0]])) {
                                        Columns2.push(ThirdSplit2[0]);
                                        JSONColumn2[ThirdSplit2[0]] = 0;
                                    }
                                }
                                TotalCharge += parseFloat(ThirdSplit2[1]);
                            })
                            if (!JSONColumn.hasOwnProperty('Total')) {
                                Columns2.push('Total');
                            }
                            JSONColumn2['Total'] = TotalCharge;
                            RowData2[id]['Total'] = TotalCharge;


                        });
                    });
                        if (Columns2.length > 0) {
                            for (var i = 0; i < Columns2.length; i++) {
                                if (Columns2[i] == 'T10' || Columns2[i] == 'T9' || Columns2[i] == 'Total'  || Columns2[i] == 'Remarks') {
                                    Columns2.splice(i, 1);
                                }
                                if (Columns2[i] == 'T9') {
                                    Columns2.splice(i, 1);
                                }
                                if (Columns2[i] == 'Total') {
                                    Columns2.splice(i, 1);
                                }
                                if (Columns2[i] == 'Remarks') {
                                    Columns2.splice(i, 1);
                                }
                            }

                            Columns2.push('T10');
                            Columns2.push('T9');
                            Columns2.push('Total');
                            Columns2.push('Remarks');
                        }
                        var ColLength = Columns2.length;
                        $.each(dataTableobj.Table2, function (id, item) {
                            if (id % 25 == 0) {
                                if (table2.length > 0) {


                                    //div += '<tr>'                           
                                    //for (var i = 8; i < ColLength; i++) {
                                    //    div+="<td>"+i+"</td>"
                                    //}
                                    //div += '</tr>'

                                    div2 += '</table></br><br/>';

                                }


                                table2 = "<table border=\"1px\" cellpadding='0' style='border-collapse:collapse' cellspacing='2' width='100%'>";
                                table2 += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='" + ColLength + "'><font color=':#419AD4'><b>DAILY REPORT STORAGE CHARGES(CASH)</b></font></td></tr>"
                                table2 += "'<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='" + parseInt(ColLength / 3) + "'></td><td align=\"left\" colspan='" + (parseFloat(ColLength / 3) - parseInt(ColLength / 3) > 0 ? parseInt(ColLength / 3) + 1 : parseInt(ColLength / 3)) + "'><b>DAILY REPORT STORAGE EXPORT WAREHOUSE VOID " + hfix + "</b></td><td align=\"left\" colspan='" + parseInt(ColLength / 3) + "'>Kurs:IDR||No:" + RowData[id]["ref"] + "</td></tr><tr><td colspan='" + parseInt(ColLength / 2) + "' align='LEFT'>Garuda Indonesia Establishment</td>  <td align=\"left\" colspan='" + (parseFloat(ColLength / 2) - parseInt(ColLength / 2) > 0 ? parseInt(ColLength / 2) + 1 : parseInt(ColLength / 2)) + "'>Date : " + $("#FromDate").val() +"  " + $("#ToDate").val()+ "</td></tr>";

                                var header = "<tr  style='background-color:#419AD4;font-size:10pt;font-family:Arial'>";
                                row2 = '<tr>';
                                // footer = '<tr>';
                                for (var i = 0; i < ColLength; i++) {
                                    if (Columns2[i] != "ref") {
                                        header += '<td>' + Columns2[i] + '</td>';
                                        if (Columns2[i] == 'T10' || Columns2[i] == 'Total') {
                                            row2 += '<td>' + (RowData2[id].hasOwnProperty([Columns2[i]]) == true ? RowData2[id][Columns2[i]].toFixed(2) : "") + '</td>';
                                        }
                                        else {
                                            row2 += '<td>' + (RowData2[id].hasOwnProperty([Columns2[i]]) == true ? RowData2[id][Columns2[i]] : "") + '</td>';
                                        }

                                       
                                    }
                                    // rowsum += parseFloat(RowData[id][Columns[i]);
                                }
                                header += '</tr>';
                                row2 += '</tr>';
                                //  footer += '</tr>';
                                table2 += header + row2;
                                div2 += table2;
                            }
                            else {
                                row2 = '<tr font-size:13pt;font-family:Arial>';
                                for (var i = 0; i < ColLength; i++) {
                                    if (Columns2[i] != "ref") {
                                        if (Columns2[i] == 'T10' || Columns2[i] == 'Total') {
                                            row2 += '<td>' + (RowData2[id].hasOwnProperty([Columns2[i]]) == true ? RowData2[id][Columns2[i]].toFixed(2) : "") + '</td>';
                                        }
                                        else {
                                            row2 += '<td>' + (RowData2[id].hasOwnProperty([Columns2[i]]) == true ? RowData2[id][Columns2[i]] : "") + '</td>';
                                        }
                                     
                                    }
                                }
                                row2 += '</tr>';

                                div2 += row2;
                            }

                            if (dataTableobj.Table2.length - 1 == id) {

                                row2 += '</tr>';
                                div2 += '</table>';
                            }
                        });

                 
                    var myWindow;
                    myWindow = window.open("ESS", "_blank");
                    myWindow.document.write(div);
                    myWindow.document.write(div1);
                    myWindow.document.write(div2);
                    myWindow.document.title = fix;
                }

            }
        });
    }
}



//function GetExcel() {
//    var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
//    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
//    var eDate = new Date(ToDate);
//    var sDate = new Date(FromDate);
//    var type = $("#Type").val() || 0;
//    var handling = $("input:radio[name='HandlingType']:checked").val();
//    var reporting = $("input:radio[name='ReportType']:checked").val();
//    var party = $("#Party").val();
//    var citysno = $('#CitySno').val();

//    if (FromDate != '' && FromDate != '' && sDate > eDate) {
//        ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
//        return false;

//    }
//    else {
//            window.location.href = "../ESS_DailyReportService/GetESS_DailyReportRecord_Excel?airlinesno="+ 1 ;

//        //window.location.href = "../DailySalesReport/ExportToExcel?AirlineCode=" + AirlineCode + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Type=" + Type + "&DateType=" + DateType + "&AgentSNo=" + AgentSNo + "&Origin=" + Origin + "&Destination=" + Destination + "&AWBSNo=" + AWBSNo + "&OfficeSNo=" + OfficeSNo + "&IsAutoProcess=1";
//    }
//}

