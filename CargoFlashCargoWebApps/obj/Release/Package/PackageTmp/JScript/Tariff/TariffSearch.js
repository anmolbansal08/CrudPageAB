/*
*****************************************************************************
Javascript Name:	TariffSearchJS     
Purpose:		    This JS used to get autocomplete for Tariff Search.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    24 June 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {


    $('#spntestspn').closest('td').next().html('<input type="radio" tabindex="16" data-radioval="General" class="" name="ReportType" checked="True" id="ReportType" value="0">General <input type="radio" tabindex="16" data-radioval="Airline" class="" name="ReportType" id="ReportType" value="1">Airline <input type="radio" tabindex="16" data-radioval="Agent" class="" name="ReportType" id="ReportType" value="2">Forwarder (Agent)')

    //$('#spnTariffAgent').closest('td').next().disabled();
    //$('#spnTariffAgent').hide();

    //$('#spnrspn').closest('td').next().hide();
    //$('#spnrspn').hide();

    //$('#Text_TariffAgent').attr('autocomplete', 'off');

    //$('#spnrspn').closest('td').next().hide();

    $('#spnGenExcel').closest('tr').prev().hide();
    $('#spnTariffAirline').closest('tr').prev().hide();

    //$('#Text_TariffAgent').prop('disabled', false);
    cfi.ValidateForm();

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();

    cfi.AutoComplete("TariffAgent", "Name", "vtariffagent", "Code", "Name", ["Name"], null, "contains");

    cfi.AutoComplete("TariffAirline", "Name", "vtariffairline", "Code", "Name", ["Name"], null, "contains");


    //cfi.AutoComplete("TariffCode", "TariffCode", "vwtariffcode", "TariffCodeSno", "TariffCode", ["TariffCode"], null, "contains");
    //cfi.AutoComplete("TariffName", "TariffName", "vwTariff", "Sno", "TariffName", ["TariffName"], null, "contains");

    //cfi.AutoComplete("Origin", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        //if ($("input:radio[name='ReportType']:checked").val() == "1") {

        //        SearchData();

        //}
        //if ($("input:radio[name='ReportType']:checked").val() == "2") {

        //        SearchData();

        //}

        //else {
        //    SearchData();
        //}

        SearchData();
    });

    $("input[id='Search'][name='Search']").click(function () {

        Search();
        //if ($("input:radio[name='ReportType']:checked").val() == "1")
        //{
        //    if ($("#TariffAirline").val() > 0) {
        //        Search();
        //    }
        //    else {

        //        ShowMessage('warning', 'Information', "Please select Airline");
        //        return;
        //    }
        //}
        //if ($("input:radio[name='ReportType']:checked").val() == "2") {
        //    if ($("#TariffAgent").val() > 0) {
        //        Search();
        //    }
        //    else {

        //        ShowMessage('warning', 'Information', "Please select Agent");
        //        return;
        //    }
        //}

        //if ($("input:radio[name='ReportType']:checked").val() == "0") {
        //    Search();
        //}


    });

    $("input:radio[name='ReportType']").on("change", function () {
        if ($("input:radio[name='ReportType']:checked").val() == "1") {
            $('#spnGenExcel').closest('tr').prev().show();

            $('#spnTariffAirline').closest('tr').prev().hide();
            // $("#Text_TariffAirline").attr("data-valid", "required").attr("data-valid-msg", "Select Airline.");


        }
        else if ($("input:radio[name='ReportType']:checked").val() == "2") {
            $('#spnGenExcel').closest('tr').prev().hide();

            $('#spnTariffAirline').closest('tr').prev().show();
            // $("#Text_TariffAgent").attr("data-valid", "required").attr("data-valid-msg", "Select Agent.");
        }

        else if ($("input:radio[name='ReportType']:checked").val() == "0") {
            $('#spnGenExcel').closest('tr').prev().hide();

            $('#spnTariffAirline').closest('tr').prev().hide();
        }


    });

});





function Search() {
    var tarifftype = $("input:radio[name='ReportType']:checked").val();
    var tariffagent = $("#TariffAgent").val();
    var tariffairline = $("#TariffAirline").val();
    var tariffdate = $("#TariffDate").val();

    //if (!cfi.IsValidForm()) {
    //    return false;
    //}

    //if (cfi.IsValidSubmitSection()) {

    var postfix = "";
    if (tarifftype == "0") {
        postfix = " - General";
    }
    else if (tarifftype == "1") {
        postfix = " - Airline Wise";
    }
    else if (tarifftype == "2") {
        postfix = "- Agent Wise";
    }


    $.ajax({
        url: "Services/Tariff/TariffSearchService.svc/GetTariffSearchRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            TariffType: tarifftype, TariffAgent: tariffagent, TariffAirline: tariffairline, TariffDate: tariffdate
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0.length > 0) {
                var myWindow;

                var str = "";

                str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1'>";
                str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Tariff Search " + postfix + "</b></font></td></TR>"


                str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                for (var key in dataTableobj.Table0[0]) {
                    str += "<td nowrap width='38%' align='center'><font color='white'>&nbsp;<b>" + key + "</b></font>&nbsp;</td>"
                }

                str += "</tr>"

                for (var i = 0; i < dataTableobj.Table0.length; i++) {
                    str += "<tr style='background-color:#C1E4F7;font-size:8pt;font-family:Arial'>"

                    for (var key in dataTableobj.Table0[i]) {
                        str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table0[i][key] + "</b></td>"
                    }


                    str += "</tr>"

                    for (var j = 0; j < dataTableobj.Table1.length; j++) {
                        if (dataTableobj.Table0[i].TariffSno == dataTableobj.Table1[j].TariffSno) {
                            str += "<tr><td colspan='10'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";
                            if (dataTableobj.Table1[j].RowNo == 1) {
                                str += "<tr style='background-color:#D4AC0D;font-size:9pt;font-family:Arial'><td align='center'><font color='#362302'><b>Slab Type</b></font></td><td align='center'><font color='#362302'><b>Start Value</b></font></td><td align='center'><font color='#362302'><b>End Value</b></font></td><td align='center'><font color='#362302'><b>Slab Value</b></font></td><td align='center'><font color='#362302'><b>Flat Rate</b></font></td></tr>"
                            }
                            str += "<tr  style='background-color:#F9E79F;font-size:7pt;font-family:Arial'>"
                            //for (var key in dataTableobj.Table1[j]) {
                            str += "<td width='20%' align='center'><b>" + dataTableobj.Table1[j].SlabType + "</b></td>";
                            str += "<td width='20%' align='right'><b>" + dataTableobj.Table1[j].StartValue + "</b></td>";
                            str += "<td width='20%' align='right'><b>" + dataTableobj.Table1[j].EndValue + "</b></td>";
                            str += "<td width='20%' align='right'><b>" + dataTableobj.Table1[j].SlabValue + "</b></td>";
                            str += "<td width='20%' align='center'><b>" + dataTableobj.Table1[j].FlatRate + "</b></td>";
                            // }
                            str += "</tr></table></td></tr>"
                        }
                    }




                }






                str += "</table></html>";


                myWindow = window.open("Tariff Search" + postfix, "_blank");
                myWindow.document.write(str);

                myWindow.document.title = "Tariff Search" + postfix;




                //$('#divList').html(str);
                //$('#divList').show();
                //  a.href = encodeURIComponent(str);
                //window.open(encodeURIComponent(str));



                //var data_type = 'data:application/vnd.ms-excel';

                //var postfix = "";
                //var a = document.createElement('a');
                //a.href = data_type + ' , ' + encodeURIComponent(str);
                //a.download = 'Tariff History ' + postfix + '.xls';

                //a.click();


            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
    //  }
}

function SearchData() {
    var tarifftype = $("input:radio[name='ReportType']:checked").val();
    var tariffagent = $("#TariffAgent").val();
    var tariffairline = $("#TariffAirline").val();
    var tariffdate = $("#TariffDate").val();
    //if (cfi.IsValidSubmitSection()) {

    var postfix = "";
    if (tarifftype == "0") {
        postfix = " - General";
    }
    else if (tarifftype == "1") {
        postfix = " - Airline Wise";
    }
    else if (tarifftype == "2") {
        postfix = "- Agent Wise";
    }

    $.ajax({
        url: "Services/Tariff/TariffSearchService.svc/GetTariffSearchRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            TariffType: tarifftype, TariffAgent: tariffagent, TariffAirline: tariffairline, TariffDate: tariffdate
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0.length > 0) {


                var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1'>";
                str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Tariff Search" + postfix + "</b></font></td></TR>"

                str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                for (var key in dataTableobj.Table0[0]) {

                    str += "<td nowrap width='38%' align='center'><font color='white'>&nbsp;<b>" + key + "</b></font>&nbsp;</td>"
                }

                str += "</tr>"

                for (var i = 0; i < dataTableobj.Table0.length; i++) {
                    str += "<tr style='background-color:#C1E4F7;font-size:8pt;font-family:Arial'>"

                    for (var key in dataTableobj.Table0[i]) {
                        if (key.toLocaleLowerCase() == "created at" || key.toLocaleLowerCase() == "updated at" || key.toLocaleLowerCase() == "valid from" || key.toLocaleLowerCase() == "valid to")
                            str += "<td nowrap width='38%'  align='center'><b>'" + dataTableobj.Table0[i][key] + "</b></td>";
                        else
                            str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table0[i][key] + "</b></td>";
                    }


                    str += "</tr>"

                    for (var j = 0; j < dataTableobj.Table1.length; j++) {
                        if (dataTableobj.Table0[i].TariffSno == dataTableobj.Table1[j].TariffSno) {
                            str += "<tr><td colspan='10'><table width='100%' cellpadding='0' cellspacing='1' border='0'>";
                            if (dataTableobj.Table1[j].RowNo == 1) {
                                str += "<tr style='background-color:#D4AC0D;font-size:9pt;font-family:Arial'><td align='center'><font color='#362302'><b>Slab Type</b></font></td><td align='center'><font color='#362302'><b>Start Value</b></font></td><td align='center'><font color='#362302'><b>End Value</b></font></td><td align='center'><font color='#362302'><b>Slab Value</b></font></td><td align='center'><font color='#362302'><b>Flat Rate</b></font></td></tr>"
                            }
                            str += "<tr  style='background-color:#F9E79F;font-size:7pt;font-family:Arial'>"
                            //for (var key in dataTableobj.Table1[j]) {
                            str += "<td width='20%' align='center'><b>" + dataTableobj.Table1[j].SlabType + "</b></td>";
                            str += "<td width='20%' align='right'><b>" + dataTableobj.Table1[j].StartValue + "</b></td>";
                            str += "<td width='20%' align='right'><b>" + dataTableobj.Table1[j].EndValue + "</b></td>";
                            str += "<td width='20%' align='right'><b>" + dataTableobj.Table1[j].SlabValue + "</b></td>";
                            str += "<td width='20%' align='center'><b>" + dataTableobj.Table1[j].FlatRate + "</b></td>";
                            // }
                            str += "</tr></table></td></tr>"
                        }
                    }




                }






                str += "</table></html>";
                var data_type = 'data:application/vnd.ms-excel';



                var a = document.createElement('a');
                a.href = data_type + ' , ' + encodeURIComponent(str);
                a.download = 'Tariff Search ' + postfix + '.xls';

                a.click();


            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
    //}
}

