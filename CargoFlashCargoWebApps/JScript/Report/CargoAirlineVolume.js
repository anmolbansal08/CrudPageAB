/*
*****************************************************************************
Javascript Name:	CargoRankingJS     
Purpose:		    This JS used to get autocomplete for Cargo Ranking.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    06 June 2016
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


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");


    var alphabettypes = [{ Key: "1", Text: "Jan" }, { Key: "2", Text: "Feb" }, { Key: "3", Text: "Mar" },
        { Key: "4", Text: "Apr" }, { Key: "5", Text: "May" }, { Key: "6", Text: "Jun" }, { Key: "7", Text: "Jul" },
        { Key: "8", Text: "Aug" }, { Key: "9", Text: "Sep" }, { Key: "10", Text: "Oct" }, { Key: "11", Text: "Nov" }, { Key: "12", Text: "Dec" }];

    cfi.AutoCompleteByDataSource("CMonth", alphabettypes);

    var Yr = [{ Key: "2016", Text: "2016" }, { Key: "2017", Text: "2017" }];

    cfi.AutoCompleteByDataSource("CYear", Yr);

  
    $("input[id='Search'][name='Search']").click(function () {
        Search();
      

    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        
        SearchData();


    });


});



function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var M = $("#CMonth").val();
        var Y = $("#CYear").val();

        $.ajax({
            url: "Services/Report/CargoAirlineVolumeService.svc/GetCargoAirlineVolumeRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                CMonth: M, CYear: Y
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table1 != undefined) {



                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Cargo Airline Volume</b></font></td></TR>"
                    //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='8'>GARUDA AIRLINES</td></tr><tr><td colspan='3' align='LEFT'>&nbsp;</td>  <td align=\"right\" colspan='5'>Date : " + dataTableobj.Table3[0].Dt + "</td></tr>"



                    str += "<tr><td colspan='4'><table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'><td align='center' colspan='4'><font color='white' colspan='4'>&nbsp;<b>" + dataTableobj.Table0[0].Mn + " - " + ($("#CYear").val() - 1) + "</b></font>&nbsp;</td></tr>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td align='center' ><font color='white' >&nbsp;<b>Airline</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Export</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Import</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Total</b></font>&nbsp;</td>"
                    str += "</tr>"
                    if (dataTableobj.Table2.length > 0) {
                        for (var i = 0; i < dataTableobj.Table2.length; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table2[i]) {
                                str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"
                            }
                            str += "</tr>"
                        }
                    }

                    else {
                        for (var i = 0; i < 7; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var j = 0; j < 4; j++) {
                                str += "<td align='center'>&nbsp;</td>"
                            }
                            str += "</tr>"
                        }

                    }
                    str += "</table></td>"




                    str += "<td colspan='4'><table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'><td align='center' colspan='4'><font color='white' colspan='4'>&nbsp;<b>" + dataTableobj.Table0[0].Mn + " - " + $("#CYear").val() + "</b></font>&nbsp;</td></tr>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td align='center' ><font color='white' >&nbsp;<b>Airline</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Export</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Import</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Total</b></font>&nbsp;</td>"
                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table1.length; i++) {
                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table1[i]) {
                            str += "<td align='center'>" + dataTableobj.Table1[i][key] + "</td>"
                        }
                        str += "</tr>"
                    }

                    str += "</table></td></tr></table></html>";

                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";
                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Cargo Airline Volume ' + postfix + '.xls';

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
        var M= $("#CMonth").val();
        var Y = $("#CYear").val();

        $.ajax({
            url: "Services/Report/CargoAirlineVolumeService.svc/GetCargoAirlineVolumeRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                CMonth: M, CYear: Y
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table1.length>0) {



                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Cargo Airline Volume</b></font></td></TR>"

                    

                    str += "<tr><td colspan='4'><table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'><td align='center' colspan='4'><font color='white' colspan='4'>&nbsp;<b>" + dataTableobj.Table0[0].Mn + " - " + ($("#CYear").val() - 1) + "</b></font>&nbsp;</td></tr>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td align='center' ><font color='white' >&nbsp;<b>Airline</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Export</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Import</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Total</b></font>&nbsp;</td>"
                    str += "</tr>"
                    if (dataTableobj.Table2.length > 0)
                    {
                        for (var i = 0; i < dataTableobj.Table2.length; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var key in dataTableobj.Table2[i]) {
                                str += "<td align='center'>" + dataTableobj.Table2[i][key] + "</td>"
                            }
                            str += "</tr>"
                        }
                    }

                    else{
                        for (var i = 0; i < 7; i++) {
                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            for (var j = 0; j <4; j++) {
                                str += "<td align='center'>&nbsp;</td>"
                            }
                            str += "</tr>" 
                        }
                    
                    }
                     str+="</table></td>"
                        
                      


                    str += "<td colspan='4'><table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'><td align='center' colspan='4'><font color='white' colspan='4'>&nbsp;<b>" + dataTableobj.Table0[0].Mn + " - " + $("#CYear").val() + "</b></font>&nbsp;</td></tr>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td align='center' ><font color='white' >&nbsp;<b>Airline</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Export</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Import</b></font>&nbsp;</td>"
                    str += "<td align='center' ><font color='white'>&nbsp;<b>Total</b></font>&nbsp;</td>"
                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table1.length; i++) {
                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        for (var key in dataTableobj.Table1[i]) {
                            str += "<td align='center'>" + dataTableobj.Table1[i][key] + "</td>"
                        }
                        str += "</tr>"
                    }






                   

                    str += "</table></td></tr></table></html>";
                 
                    var myWindow;
                    myWindow = window.open("Cargo Airline Volume", "_blank");
                    myWindow.document.write(str);
                    myWindow.document.title = 'Cargo Airline Volume';


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}




