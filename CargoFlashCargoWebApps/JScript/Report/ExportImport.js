/*
*****************************************************************************
Javascript Name:	ExportImportJS     
Purpose:		    This JS used to get autocomplete for Export Import
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    06 July 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {

    $('#spntestspn').closest('td').next().html('<input type="radio" tabindex="16" data-radioval="Airline" class="" name="ReportType" id="ReportType" value="1" checked="True">Airline <input type="radio" tabindex="16" data-radioval="Agent" class="" name="ReportType" id="ReportType" value="2">Agent')


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");



    $('#spn6spn').closest('tr').next().hide();
    $('#spnSearch').closest('tr').prev().show();


    cfi.AutoComplete("Agent", "Name", "account", "sno", "Name", ["Name"], null, "contains");

    //cfi.AutoComplete("Airline", "AirlineName", "Airline", "sno", "AirlineName", ["AirlineName"], null, "contains");
    cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "Airline", "sno", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");


    cfi.ValidateForm();

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
    var alphabettypes = [{ Key: "1", Text: "Jan" }, { Key: "2", Text: "Feb" }, { Key: "3", Text: "Mar" },
        { Key: "4", Text: "Apr" }, { Key: "5", Text: "May" }, { Key: "6", Text: "Jun" }, { Key: "7", Text: "Jul" },
        { Key: "8", Text: "Aug" }, { Key: "9", Text: "Sep" }, { Key: "10", Text: "Oct" }, { Key: "11", Text: "Nov" }, { Key: "12", Text: "Dec" }];

    cfi.AutoCompleteByDataSource("CMonth", alphabettypes);

    cfi.AutoCompleteByDataSource("PMonth", alphabettypes);
    var Yr = [{ Key: "2016", Text: "2016" }, { Key: "2017", Text: "2017" }];
    cfi.AutoCompleteByDataSource("CYear", Yr);

    cfi.AutoCompleteByDataSource("PYear", Yr);


    $("input[id='Search'][name='Search']").click(function () {

        Search();


    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        SearchData();


    });

    $("input:radio[name='ReportType']").on("change", function () {
        if ($("input:radio[name='ReportType']:checked").val() == "1") {

            $('#spn6spn').closest('tr').next().hide();
            $('#spnSearch').closest('tr').prev().show();

        }

        else if ($("input:radio[name='ReportType']:checked").val() == "2") {

            $('#spn6spn').closest('tr').next().show();
            $('#spnSearch').closest('tr').prev().hide();

        }


    });



});



function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var PM = $("#PMonth").val();
        var PY = $("#PYear").val();

        var M = $("#CMonth").val();
        var Y = $("#CYear").val();

        var rpttype = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();


        $.ajax({
            url: "Services/Report/ExportImportService.svc/GetExportImportRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                PMonth: PM, PYear: PY, CMonth: M, CYear: Y, rpt: rpttype, agent: agent, airline: airline
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0.length > 0) {

                    var counter = 1;
                    for (var key in dataTableobj.Table0[0]) {
                        counter++;
                    }
                    var cols = (counter / 2);

                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan=" + cols + "><font color=':#419AD4'><b>Export Import Cargo</b></font></td></TR>"
                    //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan=" + cols + ">GARUDA AIRLINES</td></tr><tr><td align=\"right\" colspan=" + cols + ">Date : " + dataTableobj.Table1[0].Dt + "</td></tr>"


                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                    for (var key in dataTableobj.Table0[0]) {
                        str += "<td nowrap width='38%' align='center'><font color='white'>&nbsp;<b>" + key.substr(2, 25) + "</b></font>&nbsp;</td>"
                    }

                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table0[i]) {
                            str += "<td align='center'>" + dataTableobj.Table0[i][key] + "</td>"
                        }
                        str += "</tr>"
                    }
                    str += "</table></html>";

                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";
                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Export Import Cargo ' + postfix + '.xls';

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
        var PM = $("#PMonth").val();
        var PY = $("#PYear").val();

        var M = $("#CMonth").val();
        var Y = $("#CYear").val();

        var rpttype = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();


        $.ajax({
            url: "Services/Report/ExportImportService.svc/GetExportImportRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                PMonth: PM, PYear: PY, CMonth: M, CYear: Y, rpt: rpttype, agent: agent, airline: airline
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0.length > 0) {

                    var counter = 1;
                    for (var key in dataTableobj.Table0[0]) {
                        counter++;
                    }
                    var cols = (counter / 2);

                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan=" + cols + "><font color=':#419AD4'><b>Export Import Cargo</b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"



                    for (var key in dataTableobj.Table0[0]) {
                        str += "<td nowrap width='38%' align='center'><font color='white'>&nbsp;<b>" + key.substr(2, 25) + "</b></font>&nbsp;</td>"
                    }

                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table0[i]) {
                            str += "<td align='right' nowrap>" + dataTableobj.Table0[i][key] + "</td>"
                        }
                        str += "</tr>"
                    }
                    str += "</table></html>";

                    var myWindow;
                    myWindow = window.open("ExportImport", "_blank");
                    myWindow.document.write(str);
                    myWindow.document.title = 'Export Import';


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}




