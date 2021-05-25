/*
*****************************************************************************
Javascript Name:	TariffHistoryJS     
Purpose:		    This JS used to get autocomplete for Tariff History.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    18 June 2016
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

    cfi.AutoComplete("Tariffsno", "Sno", "vwTariff", "Sno", "Sno", null, null, "contains");
    cfi.AutoComplete("TariffCode", "TariffCode", "vwtariffcode", "TariffCodeSno", "TariffCode", ["TariffCode"], null, "contains");
    cfi.AutoComplete("TariffName", "TariffName", "vwTariff", "Sno", "TariffName", ["TariffName"], null, "contains");

    //cfi.AutoComplete("Origin", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        if ($("#Tariffsno").val() > 0 || $("#TariffCode").val() > 0 || $("#TariffName").val() > 0) {
            SearchData();
        }
        else {
            ShowMessage('warning', 'Information', "Select Atleast 1 paramter");
            return;
            // alert("Select Atleast 1 paramter")
        }


    });

    $("input[id='Search'][name='Search']").click(function () {
        if ($("#Tariffsno").val() > 0 || $("#TariffCode").val() > 0 || $("#TariffName").val() > 0) {

            Search();

        }
        else {

            ShowMessage('warning', 'Information', "Select Atleast 1 paramter");
            return;
        }

    });



});



function Search() {
    var tariffid = $("#Tariffsno").val();
    var tariffcode = $("#TariffCode").val();
    var tariffname = $("#TariffName").val();

    $.ajax({
        url: "Services/Report/TariffHistoryService.svc/GetTariffHistoryRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            Tariffsno: tariffid, TariffCode: tariffcode, TariffName: tariffname
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0.length > 0) {
                var myWindow;

                var str = "";

                str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1'>";
                str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Tariff History</b></font></td></TR>"


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
                        if (dataTableobj.Table0[i].Sequence == dataTableobj.Table1[j].Sequence) {
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
                myWindow = window.open("Tariff History", "_blank");
                myWindow.document.write(str);

                myWindow.document.title = "Tariff History";



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
}

function SearchData() {
    var tariffid = $("#Tariffsno").val();
    var tariffcode = $("#TariffCode").val();
    var tariffname = $("#TariffName").val();

    $.ajax({
        url: "Services/Report/TariffHistoryService.svc/GetTariffHistoryRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            Tariffsno: tariffid, TariffCode: tariffcode, TariffName: tariffname
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0.length > 0) {


                var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1'>";
                str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='15'><font color=':#419AD4'><b>Tariff History</b></font></td></TR>"

                str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                for (var key in dataTableobj.Table0[0]) {

                    str += "<td nowrap width='38%' align='center'><font color='white'>&nbsp;<b>" + key + "</b></font>&nbsp;</td>"
                }

                str += "</tr>"

                for (var i = 0; i < dataTableobj.Table0.length; i++) {
                    str += "<tr style='background-color:#C1E4F7;font-size:8pt;font-family:Arial'>"

                    for (var key in dataTableobj.Table0[i]) {
                        if (key.toLocaleLowerCase() == "created at" || key.toLocaleLowerCase() == "updated at")
                            str += "<td nowrap width='38%'  align='center'><b>'" + dataTableobj.Table0[i][key] + "</b></td>";
                        else
                            str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table0[i][key] + "</b></td>";
                    }


                    str += "</tr>"

                    for (var j = 0; j < dataTableobj.Table1.length; j++) {
                        if (dataTableobj.Table0[i].Sequence == dataTableobj.Table1[j].Sequence) {
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

                var postfix = "";
                var a = document.createElement('a');
                a.href = data_type + ' , ' + encodeURIComponent(str);
                a.download = 'Tariff History ' + postfix + '.xls';

                a.click();


            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}

