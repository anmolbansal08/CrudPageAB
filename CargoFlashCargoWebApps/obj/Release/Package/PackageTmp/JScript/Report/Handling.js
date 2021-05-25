/*
*****************************************************************************
Javascript Name:	handlingJS     
Purpose:		    This JS used to get autocomplete for Handling.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    25 Nov 2016
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


    $('#spntypespn').closest('td').next().html('<input type="radio" tabindex="3" data-radioval="Export" class="" name="HandlingType" id="HandlingType" value="1" checked="True">Export <input type="radio" tabindex="3" data-radioval="Import" class="" name="HandlingType" id="HandlingType" value="2">Import<input type="radio" tabindex="3" data-radioval="Both" class="" name="HandlingType" id="HandlingType" value="3">Both')

    $('#spntestspn').closest('td').next().html('<input type="radio" tabindex="5" data-radioval="Agent" class="" name="ReportType" id="ReportType" value="1" checked="True">Agent <input type="radio" tabindex="5" data-radioval="Airline" class="" name="ReportType" id="ReportType" value="2">Airline')


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    var alphabettypes = [{ Key: "1", Text: "Cash" }, { Key: "2", Text: "Credit" }, { Key: "3", Text: "Both" }];
    cfi.AutoCompleteByDataSource("Type", alphabettypes);



    cfi.AutoComplete("Agent", "Name", "account", "sno", "Name", ["Name"], null, "contains", ",");

    cfi.AutoComplete("Awb", "AWBNo", "vwinvoiceawb", "awbsno", "AWBNo", ["AWBNo"], null, "contains");


    cfi.AutoComplete("InvoiceNo", "InvoiceNo", "vwInvoicelist", "sno", "InvoiceNo", ["InvoiceNo"], null, "contains");


    cfi.AutoComplete("Airline", "AirlineName", "Airline", "sno", "AirlineName", ["AirlineName"], null, "contains",",");

    Text_Airline = $("#Text_Airline").val();
    cfi.BindMultiValue("Airline", $("#Text_Airline").val(), $("#Airline").val());

    Text_Agent = $("#Text_Agent").val();
    cfi.BindMultiValue("Agent", $("#Text_Agent").val(), $("#Agent").val());

    $('#spntestspn').closest('tr').next().show();
    $('#spnInvoiceNo').closest('tr').prev().hide();


    $("input[id='Search'][name='Search']").click(function () {

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
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

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            SearchData();
        }
    });

    $("input:radio[name='ReportType']").on("change", function () {

        if ($("input:radio[name='ReportType']:checked").val() == "1") {

            $('#spntestspn').closest('tr').next().show();
            $('#spnInvoiceNo').closest('tr').prev().hide();

        }

        else if ($("input:radio[name='ReportType']:checked").val() == "2") {

            $('#spntestspn').closest('tr').next().hide();
            $('#spnInvoiceNo').closest('tr').prev().show();

        }


    });


});



function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_Awb") >= 0) {

        cfi.setFilter(filterEmbargo, "Invoicetype", "eq", $("input:radio[name='HandlingType']:checked").val());

        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
        return filterULD;
    }
    if (textId.indexOf("Text_InvoiceNo") >= 0) {

        cfi.setFilter(filterEmbargo, "IType", "eq", $("input:radio[name='HandlingType']:checked").val());
        cfi.setFilter(filterEmbargo, "Mode", "eq", $("#Text_Type").data("kendoAutoComplete").key());
        // cfi.setFilter(filterEmbargo, "Mode", "eq", $("#Text_Type").data("kendoAutoComplete").key() == "" ? 3 : $("#Text_Type").data("kendoAutoComplete").key());
        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
        return filterULD;
    }


}




function SearchData1() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var type = $("#Type").val();
        var handling = $("input:radio[name='HandlingType']:checked").val();
        var report = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();
        var awb = $("#Awb").val();

        if ($("#Type").val() == "1") {
            if (handling == "1") {
                var fix = "Invoice Cash Report - Export Handling";
            }
            else {

                var fix = "Invoice Cash Report - Import Handling";
            }
        }
        if ($("#Type").val() == "2") {
            if (handling == "1") {
                var fix = "Invoice Credit Report - Export Handling";
            }
            else {

                var fix = "Invoice Credit Report - Import Handling";
            }

        }
        if ($("#Type").val() == "3") {
            if (handling == "1") {
                var fix = "Invoice Cash/Credit Report - Export Handling";
            }
            else {

                var fix = "Invoice Cash/Credit Report - Import Handling";
            }
        }


        $.ajax({
            url: "Services/Report/HandlingService.svc/GetHandlingRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, AWBNo: awb, HandlingType: handling, ReportType: report, Agent: agent, Airline: airline, Type: type
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if ($("#Type").val() != "3") {
                    if (dataTableobj.Table0.length > 0) {



                        var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"



                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                        for (var key in dataTableobj.Table0[0]) {
                            str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                        }

                        str += "</tr>"

                        for (var i = 1; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[i]) {

                                str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"

                            }

                            str += "</tr>"
                        }

                        for (var j = 0; j < 1; j++) {

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[j]) {
                                str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                            }
                            str += "</tr>"
                        }





                        str += "</table></html>";

                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = fix + '.xls';

                        a.click();

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
                else if ($("#Type").val() == "3") {
                    if (dataTableobj.Table0.length > 0 || dataTableobj.Table2.length > 0) {

                        var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"

                        if (dataTableobj.Table0.length > 0) {

                            str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>Cash</b></font></td></TR>"

                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                            for (var key in dataTableobj.Table0[0]) {
                                str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                            }

                            str += "</tr>"

                            for (var i = 1; i < dataTableobj.Table0.length; i++) {
                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table0[i]) {
                                    str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                                }
                                str += "</tr>"
                            }

                            for (var j = 0; j < 1; j++) {

                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table0[j]) {
                                    str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                                }
                                str += "</tr>"
                            }
                        }


                        /*-------- Credit------------*/
                        if (dataTableobj.Table2.length > 0) {
                            str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>Credit</b></font></td></TR>"

                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                            for (var key in dataTableobj.Table2[0]) {
                                str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                            }

                            str += "</tr>"

                            for (var i = 1; i < dataTableobj.Table2.length; i++) {
                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table2[i]) {
                                    str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"
                                }
                                str += "</tr>"
                            }

                            for (var j = 0; j < 1; j++) {

                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table2[j]) {
                                    str += "<td align='center'>" + dataTableobj.Table2[j][key] + "</td>"
                                }
                                str += "</tr>"
                            }
                        }

                        str += "</table></html>";


                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = fix + '.xls';

                        a.click();

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }

                }

            }
        });
    }
}


function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var type = $("#Type").val();

        var handling = $("input:radio[name='HandlingType']:checked").val();
        var report = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();
        var awb = $("#Awb").val();
        var InvoiceNo = $("#InvoiceNo").val();

        if ($("#Type").val() == "1") {
            if (handling == "1") {
                var fix = "Invoice Cash Report - Export Handling";
            }
            else if (handling == "2") {

                var fix = "Invoice Cash Report - Import Handling";
            }
            else if (handling == "3") {

                var fix = "Invoice Cash Report - Import/Export Handling";
            }


        }
        if ($("#Type").val() == "2") {
            if (handling == "1") {
                var fix = "Invoice Credit Report - Export Handling";
            }
            else if (handling == "2") {

                var fix = "Invoice Credit Report - Import Handling";
            }

            else if (handling == "3") {

                var fix = "Invoice Credit Report - Import/Export Handling";
            }

        }
        if ($("#Type").val() == "3") {
            if (handling == "1") {
                var fix = "Invoice Cash/Credit Report - Export Handling";
            }
            else {

                var fix = "Invoice Cash/Credit Report - Import Handling";
            }
        }



        $.ajax({
            url: "Services/Report/HandlingService.svc/GetHandlingRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {

                FromDate: FromDate, ToDate: ToDate, AWBNo: awb, HandlingType: handling, ReportType: report, Agent: agent, Airline: airline, Type: type, InvoiceNo: InvoiceNo
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if ($("#Type").val() != "3") {
                    if (dataTableobj.Table0.length > 1) {



                        var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"



                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                        for (var key in dataTableobj.Table0[0]) {
                            if (key != "sno00") {
                                str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                            }
                        }

                        str += "</tr>"

                        for (var i = 1; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[i]) {


                                if (dataTableobj.Table0[i].DocNo00 == dataTableobj.Table0[i][key]) {

                                    str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>";

                                }
                                else if (dataTableobj.Table0[i].DocNo00 != dataTableobj.Table0[i][key] && dataTableobj.Table0[i].sno00 != dataTableobj.Table0[i][key]) {
                                    str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                                }
                            }
                            str += "</tr>"
                        }

                        for (var j = 0; j < 1; j++) {

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[j]) {
                                if (dataTableobj.Table0[j].sno00 != dataTableobj.Table0[j][key]) {
                                    str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                                }
                            }
                            str += "</tr>"
                        }





                        str += "</table></html>";


                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = fix + '.xls';

                        a.click();

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
                else if ($("#Type").val() == "3") {
                    if (dataTableobj.Table0.length > 1 || dataTableobj.Table2.length > 1) {

                        var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"

                        if (dataTableobj.Table0.length > 1) {

                            str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>Handling Cash</b></font></td></TR>"

                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                            for (var key in dataTableobj.Table0[0]) {

                                if (key != "sno00") {
                                    str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                                }
                            }

                            str += "</tr>"

                            for (var i = 1; i < dataTableobj.Table0.length; i++) {
                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table0[i]) {

                                    if (dataTableobj.Table0[i].DocNo00 == dataTableobj.Table0[i][key]) {

                                        str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>";

                                    }
                                    else if (dataTableobj.Table0[i].DocNo00 != dataTableobj.Table0[i][key] && dataTableobj.Table0[i].sno00 != dataTableobj.Table0[i][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                                    }
                                }
                                str += "</tr>"
                            }

                            for (var j = 0; j < 1; j++) {

                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table0[j]) {

                                    if (dataTableobj.Table0[j].sno00 != dataTableobj.Table0[j][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                                    }

                                }
                                str += "</tr>"
                            }
                        }


                        /*-------- Credit------------*/
                        if (dataTableobj.Table2.length > 1) {
                            str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b> Handling Credit</b></font></td></TR>"

                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                            for (var key in dataTableobj.Table2[0]) {

                                if (key != "sno00") {
                                    str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                                }

                            }

                            str += "</tr>"

                            for (var i = 1; i < dataTableobj.Table2.length; i++) {
                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table2[i]) {
                                    // str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"

                                    if (dataTableobj.Table2[i].DocNo00 == dataTableobj.Table2[i][key]) {

                                        str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"


                                    }
                                    else if (dataTableobj.Table2[i].DocNo00 != dataTableobj.Table2[i][key] && dataTableobj.Table2[i].sno00 != dataTableobj.Table2[i][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"
                                    }

                                }
                                str += "</tr>"
                            }

                            for (var j = 0; j < 1; j++) {

                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table2[j]) {

                                    if (dataTableobj.Table2[j].sno00 != dataTableobj.Table2[j][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table2[j][key] + "</td>"
                                    }


                                }
                                str += "</tr>"
                            }
                        }

                        str += "</table></html>";


                        var data_type = 'data:application/vnd.ms-excel';

                        var postfix = "";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = fix + '.xls';

                        a.click();

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }

                }

            }
        });
    }
}


function Search() {

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var type = $("#Type").val();

        var handling = $("input:radio[name='HandlingType']:checked").val();
        var report = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();
        var awb = $("#Awb").val();
        var InvoiceNo = $("#InvoiceNo").val();

        if ($("#Type").val() == "1") {
            if (handling == "1") {
                var fix = "Invoice Cash Report - Export Handling";
            }
            else if (handling == "2") {

                var fix = "Invoice Cash Report - Import Handling";
            }
            else if (handling == "3") {

                var fix = "Invoice Cash Report - Import/Export Handling";
            }
        }
        if ($("#Type").val() == "2") {
            if (handling == "1") {
                var fix = "Invoice Credit Report - Export Handling";
            }
            else {

                var fix = "Invoice Credit Report - Import Handling";
            }

        }
        if ($("#Type").val() == "3") {
            if (handling == "1") {
                var fix = "Invoice Cash/Credit Report - Export Handling";
            }
            else if (handling == "2") {

                var fix = "Invoice Cash/Credit Report - Import Handling";
            }
            else if (handling == "3") {

                var fix = "Invoice Cash/Credit Report - Import/Export Handling";
            }
        }



        $.ajax({
            url: "Services/Report/HandlingService.svc/GetHandlingRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {

                FromDate: FromDate, ToDate: ToDate, AWBNo: awb, HandlingType: handling, ReportType: report, Agent: agent, Airline: airline, Type: type, InvoiceNo: InvoiceNo
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if ($("#Type").val() != "3") {
                    if (dataTableobj.Table0.length > 1) {


                        var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"



                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                        for (var key in dataTableobj.Table0[0]) {
                            if (key != "sno00") {
                                str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                            }
                        }

                        str += "</tr>"

                        for (var i = 1; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[i]) {


                                if (dataTableobj.Table0[i].DocNo00 == dataTableobj.Table0[i][key]) {
                                    if ($("#Type").val() == 1) {
                                        if (handling == "1") {
                                            str += "<td align='center'><a  target='_blank' href='HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + dataTableobj.Table0[i].sno00 + "&InvoiceType=0&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table0[i][key] + "</a></td>"
                                        }
                                        else {
                                            str += "<td align='center'><a  target='_blank' href='HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + dataTableobj.Table0[i].sno00 + "&InvoiceType=1&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table0[i][key] + "</a></td>"
                                        }
                                    }
                                    else {

                                        str += "<td align='center'><a  target='_blank' href='HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + dataTableobj.Table0[i].sno00 + "&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table0[i][key] + "</a></td>"
                                    }

                                }
                                else if (dataTableobj.Table0[i].DocNo00 != dataTableobj.Table0[i][key] && dataTableobj.Table0[i].sno00 != dataTableobj.Table0[i][key]) {
                                    str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                                }
                            }
                            str += "</tr>"
                        }

                        for (var j = 0; j < 1; j++) {

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[j]) {
                                if (dataTableobj.Table0[j].sno00 != dataTableobj.Table0[j][key]) {
                                    str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                                }
                            }
                            str += "</tr>"
                        }





                        str += "</table></html>";


                        var myWindow;
                        myWindow = window.open("ESS", "_blank");
                        myWindow.document.write(str);
                        myWindow.document.title = fix;

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
                else if ($("#Type").val() == "3") {
                    if (dataTableobj.Table0.length > 1 || dataTableobj.Table2.length > 1) {

                        var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"

                        if (dataTableobj.Table0.length > 1) {

                            str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>Handling Cash</b></font></td></TR>"

                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                            for (var key in dataTableobj.Table0[0]) {

                                if (key != "sno00") {
                                    str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                                }
                            }

                            str += "</tr>"

                            for (var i = 1; i < dataTableobj.Table0.length; i++) {
                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table0[i]) {

                                    if (dataTableobj.Table0[i].DocNo00 == dataTableobj.Table0[i][key]) {

                                        //   str += "<td align='center'><a  target='_blank' href='HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + dataTableobj.Table0[i].sno00 + "&InvoiceType=1&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table0[i][key] + "</a></td>"


                                        if (handling == "1") {
                                            str += "<td align='center'><a  target='_blank' href='HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + dataTableobj.Table0[i].sno00 + "&InvoiceType=0&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table0[i][key] + "</a></td>"
                                        }
                                        else {
                                            str += "<td align='center'><a  target='_blank' href='HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + dataTableobj.Table0[i].sno00 + "&InvoiceType=1&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table0[i][key] + "</a></td>"
                                        }




                                    }
                                    else if (dataTableobj.Table0[i].DocNo00 != dataTableobj.Table0[i][key] && dataTableobj.Table0[i].sno00 != dataTableobj.Table0[i][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                                    }
                                }
                                str += "</tr>"
                            }

                            for (var j = 0; j < 1; j++) {

                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table0[j]) {

                                    if (dataTableobj.Table0[j].sno00 != dataTableobj.Table0[j][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                                    }

                                }
                                str += "</tr>"
                            }
                        }


                        /*-------- Credit------------*/
                        if (dataTableobj.Table2.length > 1) {
                            str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b> Handling Credit</b></font></td></TR>"

                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                            for (var key in dataTableobj.Table2[0]) {

                                if (key != "sno00") {
                                    str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                                }

                            }

                            str += "</tr>"

                            for (var i = 1; i < dataTableobj.Table2.length; i++) {
                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table2[i]) {
                                    // str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"

                                    if (dataTableobj.Table2[i].DocNo00 == dataTableobj.Table2[i][key]) {

                                        str += "<td align='center'><a  target='_blank' href='HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + dataTableobj.Table2[i].sno00 + "&UserSNo=" + userContext.UserSNo + "'>" + dataTableobj.Table2[i][key] + "</a></td>"






                                    }
                                    else if (dataTableobj.Table2[i].DocNo00 != dataTableobj.Table2[i][key] && dataTableobj.Table2[i].sno00 != dataTableobj.Table2[i][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"
                                    }

                                }
                                str += "</tr>"
                            }

                            for (var j = 0; j < 1; j++) {

                                str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                                for (var key in dataTableobj.Table2[j]) {

                                    if (dataTableobj.Table2[j].sno00 != dataTableobj.Table2[j][key]) {
                                        str += "<td align='center'>" + dataTableobj.Table2[j][key] + "</td>"
                                    }


                                }
                                str += "</tr>"
                            }
                        }

                        str += "</table></html>";


                        var myWindow;
                        myWindow = window.open("Invoice Report", "_blank");
                        myWindow.document.write(str);
                        myWindow.document.title = fix;

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }

                }

            }
        });
    }
}


