/*
*****************************************************************************
Javascript Name:	ESSJS     
Purpose:		    This JS used to get autocomplete for ESS.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    07 July 2016
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


    cfi.AutoCompleteV2("Party", "PartyName", "ESS_PartyName",  null, "contains");

    var alphabettypes = [{ Key: "1", Text: "Cash" }, { Key: "2", Text: "Credit" }, { Key: "3", Text: "Both" }];
    cfi.AutoCompleteByDataSource("Type", alphabettypes);
    cfi.AutoCompleteV2("CitySno", "CityCode,CityName", "BookingProfileReport_City", null, "contains");
    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");


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

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        
        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
        
            return false;
        }
        else{
         SearchData();
        }

        


    });


});



function SearchData() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt"); 
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
        var type = $("#Type").val();
        var handling = $("input:radio[name='HandlingType']:checked").val();
        var reporting = $("input:radio[name='ReportType']:checked").val();
        var party = $("#Party").val();
        if (handling == "1")
        {
            var hfix = "Export ";
        }
        if (handling == "2") {
            var hfix = "Import ";
        }
        if (handling == "3") {
            var hfix = "Export/Import ";
        }


        if (reporting == "1") {
            var rfix = "Summary";
        }
        if (reporting == "2") {
            var rfix = "Detail";
        }
       

        if ($("#Type").val() == "1") {
            var fix = hfix+ "Cash Register " +rfix;
        }
        if ($("#Type").val() == "2") {
            var fix = hfix+"Credit Register " + rfix;

        }
        if ($("#Type").val() == "3") {
            var fix = hfix+ "Cash/Credit Register "+rfix;
        }

        var citysno = $('#CitySno').val();
        $.ajax({
            url: "Services/Report/ESSService.svc/GetESSRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Type: type, Handling: handling, Reporting: reporting, Party: party, citysno: citysno
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if ($("#Type").val() != "3") {
                    if (dataTableobj.Table0.length > 1) {



                        var str = "<html><table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>'" + userContext.AirlineName.substring(4, 30) + "'</td></tr><tr><td colspan='6' align='LEFT'>From " + $("#FromDate").val() + " To " + $("#ToDate").val() + "</td>  <td align=\"right\" colspan='4'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"



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
                    if (dataTableobj.Table0.length > 1 || dataTableobj.Table2.length > 1) {

                        var str = "<html><table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>'" + userContext.AirlineName.substring(4, 30) + "'</td></tr><tr><td colspan='6' align='LEFT'>From " + $("#FromDate").val() + " To " + $("#ToDate").val() + "</td>  <td align=\"right\" colspan='4'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"

                        if (dataTableobj.Table0.length > 1) {

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
                        if (dataTableobj.Table2.length > 1) {
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


function SearchData1() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var type = $("#Type").val();
        var handling = $("input:radio[name='HandlingType']:checked").val();

        if ($("#Type").val() == "1") {
            var fix = "Cash Register";
        }
        else if ($("#Type").val() == "2") {
            var fix = "Credit Register";
        }
        else if ($("#Type").val() == "3") {
            var fix = "Cash/Credit Register";
        }

       
        $.ajax({
            url: "Services/Report/ESSService.svc/GetESSRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Type: type,Handling:handling
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0.length > 0) {
                

                    var str = "<html><table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><b>" + fix + "</b></td></TR>"
                    //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>" + userContext.AirlineName.substring(4, 30) + "</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"

                    if ($("#Type").val() != "3") 
                    {
                        str += "<tr style='font-size:10pt;font-family:Arial'>"



                        for (var key in dataTableobj.Table0[0]) {
                            str += "<td nowrap align='center'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b>&nbsp;</td>"
                        }

                        str += "</tr>"

                        for (var i = 1; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[i]) {
                                str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                            }
                            str += "</tr>"
                        }

                        for (var j = 0; j < 1; j++) {

                            str += "<tr style='font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[j]) {
                                str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
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
                else if ($("#Type").val() == "3") {

                    if (dataTableobj.Table0.length > 0|| dataTableobj.Table2.length>0)
                        {
                    var str = "<html><table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><b>" + fix + "</b></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>" + userContext.AirlineName.substring(4, 30) + "</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"
                    }


                    if (dataTableobj.Table0.length > 0) {
                       

                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><b>Cash</b></td></TR>"

                        str += "<tr style='font-size:10pt;font-family:Arial'>"



                        for (var key in dataTableobj.Table0[0]) {
                            str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                        }

                        str += "</tr>"

                        for (var i = 1; i < dataTableobj.Table0.length; i++) {
                            str += "<tr style='font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[i]) {
                                str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                            }
                            str += "</tr>"
                        }

                        for (var j = 0; j < 1; j++) {

                            str += "<tr style='font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table0[j]) {
                                str += "<td align='center'>" + dataTableobj.Table0[j][key] + "</td>"
                            }
                            str += "</tr>"
                        }
                    }

                    /*-------- Credit------------*/
                    if (dataTableobj.Table2.length > 0) {
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><b>Credit</b></td></TR>"

                        str += "<tr style='font-size:10pt;font-family:Arial'>"



                        for (var key in dataTableobj.Table2[0]) {
                            str += "<td nowrap align='center'><font color='white'>&nbsp;<b>" + (key.replace("_", " ")).substring(0, (key.replace("_", " ")).length - 2) + "</b></font>&nbsp;</td>"
                        }

                        str += "</tr>"

                        for (var i = 1; i < dataTableobj.Table2.length; i++) {
                            str += "<tr style='font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table2[i]) {
                                str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"
                            }
                            str += "</tr>"
                        }

                        for (var j = 0; j < 1; j++) {

                            str += "<tr style='font-size:8pt;font-family:Arial'>"
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
        });
    }
}


function Search() {
    if (cfi.IsValidSubmitSection()) {

        var FromDate = kendo.toString($('#FromDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
        var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
        var type = $("#Type").val();
        var handling = $("input:radio[name='HandlingType']:checked").val();
        var reporting = $("input:radio[name='ReportType']:checked").val();
        var party = $("#Party").val();

        if (handling == "1") {
            var hfix = "Export ";
        }
        if (handling == "2") {
            var hfix = "Import ";
        }
        if (handling == "3") {
            var hfix = "Export/Import ";
        }

        if (reporting == "1") {
            var rfix = "Summary";
        }
        if (reporting == "2") {
            var rfix = "Detail";
        }

        if ($("#Type").val() == "1") {
            var fix =hfix+ "Cash Register " +rfix;
        }
        if ($("#Type").val() == "2") {
            var fix = hfix+"Credit Register " +rfix;

        }
        if ($("#Type").val() == "3") {
            var fix = hfix+"Cash/Credit Register "+rfix;
        }
        var citysno = $('#CitySno').val();

        $.ajax({
            url: "Services/Report/ESSService.svc/GetESSRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, Type: type, Handling: handling, Reporting: reporting, Party: party, citysno: citysno
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if ($("#Type").val() != "3") {
                    if (dataTableobj.Table0.length > 1) {
                      


                        var str = "<html><table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                        str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>" + userContext.AirlineName.substring(4, 30) + "</td></tr><tr><td colspan='6' align='LEFT'>From " + $("#FromDate").val() + " To " + $("#ToDate").val() + "</td>  <td align=\"right\" colspan='4'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"


                      
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


                        var myWindow;
                        myWindow = window.open("ESS", "_blank");
                        myWindow.document.write(str);
                        myWindow.document.title = fix;

                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
                else if ($("#Type").val() == "3")
                {
                    if (dataTableobj.Table0.length > 1||dataTableobj.Table2.length >1) {

                    var str = "<html><table border=\"1px\" cellpadding='0' cellspacing='2' width='100%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + fix + "</b></font></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>" + userContext.AirlineName.substring(4, 30) + "</td></tr><tr><td colspan='6' align='LEFT'>From " + $("#FromDate").val() + " To " + $("#ToDate").val() + "</td>  <td align=\"right\" colspan='4'>Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"

                    if (dataTableobj.Table0.length > 1) {

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
                    if (dataTableobj.Table2.length > 1) {
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


                        var myWindow;
                        myWindow = window.open("ESS", "_blank");
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
