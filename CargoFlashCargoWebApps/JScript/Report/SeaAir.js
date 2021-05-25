
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

    $('#spntestspn').closest('td').next().html('<input type="radio" tabindex="16" data-radioval="Agent" class="" name="ReportType" id="ReportType" value="2" checked="True">Agent <input type="radio" tabindex="16" data-radioval="Airline" class="" name="ReportType" id="ReportType" value="1">Airline')


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");


    //$("#FromDate").val('');
   // $("#ToDate").val('');
      $('#spntestspn').closest('tr').next().show();
    $('#spnGen').closest('tr').prev().hide();
    

    $("#FromDate").val('');
   //$("#ToDate").val('');


    cfi.AutoComplete("Agent", "Name", "account", "sno", "Name", ["Name"], null, "contains");

    cfi.AutoComplete("Awb", "AWBNo", "vwseawb", "sno", "AWBNo", ["AWBNo"], null, "contains");

    cfi.AutoComplete("Airline", "AirlineName", "Airline", "sno", "AirlineName", ["AirlineName"], null, "contains");
    
    cfi.ValidateForm();

  
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
   


  
    $("input[id='Search'][name='Search']").click(function () {

        Search();
      

    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        
        SearchData();


    });

    $("input:radio[name='ReportType']").on("change", function () {
       if ($("input:radio[name='ReportType']:checked").val() == "1") {
           
           $('#spntestspn').closest('tr').next().hide();
           $('#spnGen').closest('tr').prev().show();
          
        }

        else if ($("input:radio[name='ReportType']:checked").val() == "2") {
          
            $('#spntestspn').closest('tr').next().show();
            $('#spnGen').closest('tr').prev().hide();

        }


    });



});



function Search() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var rpt = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();
        var Awb = $("#Awb").val();       

        $.ajax({
            url: "Services/Report/SeaAirService.svc/GetSeaAirRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, rpt: rpt, Agt: agent, Air: airline, Awb: Awb
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);

                if (dataTableobj.Table0.length>0) {

                    if (rpt == "1") {
                        var postfix = "Sea Air Vs Airline";
                    }
                    else if (rpt == "2") {
                        var postfix = "Sea Air Vs Agent Cargo";
                    }
                   
                   

                    var str = "<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script> <script>function printsd(){ $('#btnprint').hide(); window.print(); }  </script> <html><div id='divprint'><input type='button' id='btnprint' onclick='printsd()' name='Print' value='Print'/></div> <table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + postfix + "</b></font> </td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>GARUDA AIRLINES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table4[0].Dt + "</td></tr>"
                    str+="<tr><TD colspan='10'><br/></td></tr>"

                    str += "<tr style='font-size:10pt;font-family:Arial'>"                   

                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                     
                    
                        if (rpt == "1") {
                            str += "<tr style='font-size:10pt;font-family:Arial'>"
                            str += "<td align='left' colspan='13'><b><u>" + dataTableobj.Table0[i].Airline + "</u></b></td>"
                            str += "</tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                            str += "<tr style='font-size:09pt;font-family:Arial'><td align='center'><b>MOVEMENT NO</b></td><td align='center'><b>FLIGHT NO</b></td><td align='center'><b>DEPARTURE DATE </b></td><td align='center'><b>AWB NO</b></td><td align='center'><b>DESTINATION</b></td><td align='center'><b>MNF PCs</b></td><td align='center'><b>MNF WT</b></td><td align='center'><b>OFF PCs</b></td><td align='center'><b>                                        OFF WT</b></td><td align='center'><b>UPLIFT PCs</b></td><td align='center'><b>UPLIFT WT</b></td></tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                        }
                        if (rpt == "2") {
                            str += "<tr style='font-size:09pt;font-family:Arial'>"
                            str += "<td align='left' colspan='13'><b><u>" + dataTableobj.Table0[i].Agent + "</u></b></td>"
                            str += "</tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                            str += "<tr style='font-size:09pt;font-family:Arial'><td align='center'><b>MOVEMENT NO</b></td><td align='center'><b>FLIGHT NO</b></td><td align='center'><b>DEPARTURE DATE </b></td><td align='center'><b>AWB NO</b></td><td align='center'><b>DESTINATION</b></td><td align='center'><b>MNF PCs</b></td><td align='center'><b>MNF WT</b></td><td align='center'><b>OFF PCs</b></td><td align='center'><b>OFF WT</b></td><td align='center'><b>UPLIFT PCs</b></td><td align='center'><b>UPLIFT WT</b></td></tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                        }
                           

                            for (var j = 0; j < dataTableobj.Table1.length; j++) {
                                if (rpt == "1") {
                                    if (dataTableobj.Table0[i].Airlinesno == dataTableobj.Table1[j].Airlinesno) {
                                        str += "<tr  style='font-size:8pt;font-family:Arial'>"
                                        str += "<td  width='5%' align='center'><b>" + dataTableobj.Table1[j].movementno + "</b></td>";
                                        str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightNo + "</b></td>";
                                        str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightDate + "</b></td>";
                                        str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].AWBNo + "</b></td>";
                                        str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].Destination + "</b></td>";
                                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table1[j].MnfPieces + "</b></td>";
                                        str += "<td  width='5%'align='right'><b>" + dataTableobj.Table1[j].MnfWt + "</b></td>";
                                        str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffPieces + "</b></td>";
                                        str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffWt + "</b></td>";
                                        str += "<td  width='10%'align='right'><b>" + dataTableobj.Table1[j].UpliftPieces + "</b></td>";
                                        str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].UpliftWt + "</b></td>";
                                        str += "</tr>"


                                    }
                                }
                                else if (rpt == "2") {
                                    if (dataTableobj.Table0[i].Agentsno == dataTableobj.Table1[j].Agentsno) {
                                            str += "<tr  style='font-size:8pt;font-family:Arial'>"
                                            str += "<td  width='5%' align='center'><b>" + dataTableobj.Table1[j].movementno + "</b></td>";
                                            str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightNo + "</b></td>";
                                            str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightDate + "</b></td>";
                                            str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].AWBNo + "</b></td>";
                                            str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].Destination + "</b></td>";
                                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table1[j].MnfPieces + "</b></td>";
                                            str += "<td  width='5%'align='right'><b>" + dataTableobj.Table1[j].MnfWt + "</b></td>";
                                            str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffPieces + "</b></td>";
                                            str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffWt + "</b></td>";
                                            str += "<td  width='10%'align='right'><b>" + dataTableobj.Table1[j].UpliftPieces + "</b></td>";
                                            str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].UpliftWt + "</b></td>";
                                            str += "</tr>"
                                        }
                                    }
                                   

                                   
                                  
                                }
                         
                            for (var z = 0; z < dataTableobj.Table2.length; z++) {
                                if (rpt == "1") {
                                    if (dataTableobj.Table0[i].Airlinesno == dataTableobj.Table2[z].Airlinesno) {
                                        str += "<tr><td colspan='11'><hr/></td></Tr>"
                                        str += "<tr  style='font-size:09pt;font-family:Arial'>"
                                        str += "<td width='5%' align='center'><b>&nbsp;</b></td>";
                                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                        str += "<td width='10%' align='center'><b> SUB TOTAL :</b></td>";
                                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfPieces + "</b></td>";
                                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfWt + "</b></td>";
                                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffPieces + "</b></td>";
                                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffWt + "</b></td>";
                                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftPieces + "</b></td>";
                                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftWt + "</b></td>";
                                        str += "</tr>"
                                        str += "<tr><td colspan='11'><hr/></td></Tr>"
                                    }


                                    }
                                    if (rpt == "2") {
                                        if (dataTableobj.Table0[i].Agentsno == dataTableobj.Table2[z].Agentsno) {
                                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                                            str += "<tr  style='font-size:09pt;font-family:Arial'>"
                                            str += "<td width='5%' align='center'><b>&nbsp;</b></td>";
                                            str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                            str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                            str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                            str += "<td width='10%' align='center'><b> SUB TOTAL :</b></td>";
                                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfPieces + "</b></td>";
                                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfWt + "</b></td>";
                                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffPieces + "</b></td>";
                                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffWt + "</b></td>";
                                            str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftPieces + "</b></td>";
                                            str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftWt + "</b></td>";
                                            str += "</tr>"
                                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                                        }
                                        }
                            }


                    }
                            
                   
                    
                    for (var y = 0; y < dataTableobj.Table3.length; y++) {

                       
                            // str += "<tr><td colspan='10'><table width='100%' cellpadding='0' cellspacing='0'  border='1'>";
                         //   str+="<tr><td colspan='10'><hr/></td></Tr>"
                            str += "<tr  style='font-size:09pt;font-family:Arial'>"
                            str += "<td width='5%' align='center'><b>&nbsp;</b></td>";
                            str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                            str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                            str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                            str += "<td width='10%' align='center'><b> GRAND TOTAL :</b></td>";
                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].MnfPieces + "</b></td>";
                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].MnfWt + "</b></td>";
                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].OffPieces + "</b></td>";
                            str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].OffWt + "</b></td>";
                            str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].UpliftPieces + "</b></td>";
                            str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].UpliftWt + "</b></td>";
                            //str += "</tr></table></td></tr>"
                            str += "</tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                        }





                    str += "</table></html>";

                    var myWindow;
                    myWindow = window.open(postfix, "_blank");
                    myWindow.document.write(str);

                    myWindow.document.title = postfix;


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}


function SearchData() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var rpt = $("input:radio[name='ReportType']:checked").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();
        var Awb = $("#Awb").val();

        $.ajax({
            url: "Services/Report/SeaAirService.svc/GetSeaAirRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, rpt: rpt, Agt: agent, Air: airline, Awb: Awb
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);

                if (dataTableobj.Table0.length > 0) {

                    if (rpt == "1") {
                        var postfix = "Sea Air Vs Airline";
                    }
                    else if (rpt == "2") {
                        var postfix = "Sea Air Vs Agent Cargo";
                    }


                    var str = "<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script> <script>function printsd(){ $('#btnprint').hide(); window.print(); }  </script> <html><div id='divprint'><input type='button' id='btnprint' onclick='printsd()' name='Print' value='Print'/></div> <table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>";
                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + postfix + "</b></font> </td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>GARUDA AIRLINES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table4[0].Dt + "</td></tr>"
                    str += "<tr><TD colspan='10'><br/></td></tr>"

                    str += "<tr style='font-size:10pt;font-family:Arial'>"

                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {


                        if (rpt == "1") {
                            str += "<tr style='font-size:09pt;font-family:Arial'>"
                            str += "<td align='left' colspan='11'><b><u>" + dataTableobj.Table0[i].Airline + "</u></b></td>"
                            str += "</tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                            str += "<tr style='font-size:09pt;font-family:Arial'><td align='center'><b>MOVEMENT NO</b></td><td align='center'><b>FLIGHT NO</b></td><td align='center'><b>DEPARTURE DATE </b></td><td align='center'><b>AWB NO</b></td><td align='center'><b>DESTINATION</b></td><td align='center'><b>MNF PCs</b></td><td align='center'><b>MNF WT</b></td><td align='center'><b>OFF PCs</b></td><td align='center'><b>                                        OFF WT</b></td><td align='center'><b>UPLIFT PCs</b></td><td align='center'><b>UPLIFT WT</b></td></tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                        }
                        if (rpt == "2") {
                            str += "<tr style='font-size:09pt;font-family:Arial'>"
                            str += "<td align='left' colspan='11'><b><u>" + dataTableobj.Table0[i].Agent + "</u></b></td>"
                            str += "</tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                            str += "<tr style='font-size:09pt;font-family:Arial'><td align='center'><b>MOVEMENT NO</b></td><td align='center'><b>FLIGHT NO</b></td><td align='center'><b>DEPARTURE DATE </b></td><td align='center'><b>AWB NO</b></td><td align='center'><b>DESTINATION</b></td><td align='center'><b>MNF PCs</b></td><td align='center'><b>MNF WT</b></td><td align='center'><b>OFF PCs</b></td><td align='center'><b>                                        OFF WT</b></td><td align='center'><b>UPLIFT PCs</b></td><td align='center'><b>UPLIFT WT</b></td></tr>"
                            str += "<tr><td colspan='11'><hr/></td></Tr>"
                        }


                        for (var j = 0; j < dataTableobj.Table1.length; j++) {
                            if (rpt == "1") {
                                if (dataTableobj.Table0[i].Airlinesno == dataTableobj.Table1[j].Airlinesno) {
                                    str += "<tr  style='font-size:9pt;font-family:Arial'>"
                                    str += "<td  width='5%' align='center'><b>" + dataTableobj.Table1[j].movementno + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightNo + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightDate + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].AWBNo + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].Destination + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table1[j].MnfPieces + "</b></td>";
                                    str += "<td  width='5%'align='right'><b>" + dataTableobj.Table1[j].MnfWt + "</b></td>";
                                    str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffPieces + "</b></td>";
                                    str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffWt + "</b></td>";
                                    str += "<td  width='10%'align='right'><b>" + dataTableobj.Table1[j].UpliftPieces + "</b></td>";
                                    str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].UpliftWt + "</b></td>";
                                    str += "</tr>"


                                }
                            }
                            else if (rpt == "2") {
                                if (dataTableobj.Table0[i].Agentsno == dataTableobj.Table1[j].Agentsno) {
                                    str += "<tr  style='font-size:9pt;font-family:Arial'>"
                                    str += "<td  width='5%' align='center'><b>" + dataTableobj.Table1[j].movementno + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightNo + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightDate + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].AWBNo + "</b></td>";
                                    str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].Destination + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table1[j].MnfPieces + "</b></td>";
                                    str += "<td  width='5%'align='right'><b>" + dataTableobj.Table1[j].MnfWt + "</b></td>";
                                    str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffPieces + "</b></td>";
                                    str += "<td  width='5%' align='right'><b>" + dataTableobj.Table1[j].OffWt + "</b></td>";
                                    str += "<td  width='10%'align='right'><b>" + dataTableobj.Table1[j].UpliftPieces + "</b></td>";
                                    str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].UpliftWt + "</b></td>";
                                    str += "</tr>"
                                }
                            }




                        }

                        for (var z = 0; z < dataTableobj.Table2.length; z++) {
                            if (rpt == "1") {
                                if (dataTableobj.Table0[i].Airlinesno == dataTableobj.Table2[z].Airlinesno) {
                                    str += "<tr><td colspan='11'><hr/></td></Tr>"
                                    str += "<tr  style='font-size:10pt;font-family:Arial'>"
                                    str += "<td width='5%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b> SUB TOTAL :</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfPieces + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfWt + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffPieces + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffWt + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftPieces + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftWt + "</b></td>";
                                    str += "</tr>"
                                    str += "<tr><td colspan='11'><hr/></td></Tr>"
                                }


                            }
                            if (rpt == "2") {
                                if (dataTableobj.Table0[i].Agentsno == dataTableobj.Table2[z].Agentsno) {
                                    str += "<tr><td colspan='11'><hr/></td></Tr>"
                                    str += "<tr  style='font-size:10pt;font-family:Arial'>"
                                    str += "<td width='5%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                    str += "<td width='10%' align='center'><b> SUB TOTAL :</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfPieces + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].MnfWt + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffPieces + "</b></td>";
                                    str += "<td width='5%' align='right'><b>" + dataTableobj.Table2[z].OffWt + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftPieces + "</b></td>";
                                    str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftWt + "</b></td>";
                                    str += "</tr>"
                                    str += "<tr><td colspan='11'><hr/></td></Tr>"
                                }
                            }
                        }


                    }



                    for (var y = 0; y < dataTableobj.Table3.length; y++) {


                        // str += "<tr><td colspan='10'><table width='100%' cellpadding='0' cellspacing='0'  border='1'>";
                        //   str+="<tr><td colspan='10'><hr/></td></Tr>"
                        str += "<tr  style='font-size:10pt;font-family:Arial'>"
                        str += "<td width='5%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b> GRAND TOTAL :</b></td>";
                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].MnfPieces + "</b></td>";
                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].MnfWt + "</b></td>";
                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].OffPieces + "</b></td>";
                        str += "<td width='5%' align='right'><b>" + dataTableobj.Table3[y].OffWt + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].UpliftPieces + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].UpliftWt + "</b></td>";
                        //str += "</tr></table></td></tr>"
                        str += "</tr>"
                        str += "<tr><td colspan='11'><hr/></td></Tr>"
                    }





                    str += "</table></html>";

                    var data_type = 'data:application/vnd.ms-excel';


                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = postfix + '.xls';

                    a.click();

                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}




function SearchData1() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();
        var rpt = $("#ReportType").val();
        var agent = $("#Agent").val();
        var airline = $("#Airline").val();
        var Awb = $("#Awb").val();

        $.ajax({
            url: "Services/Report/SeaAirService.svc/GetSeaAirRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate, rpt: rpt, Agt: agent, Air: airline, Awb: Awb
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);

                if (dataTableobj.Table0.length > 0) {

                    if (rpt == "1") {
                        var postfix = "Sea Air Vs Airline";
                    }
                    else if (rpt == "2") {
                        var postfix = "Sea Air Vs Agent Cargo";
                    }


                    var str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='97%'>";

                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='10'><font color=':#419AD4'><b>" + postfix + "</b></font></td></TR>"
                    //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='10'>GARUDA AIRLINES</td></tr><tr><td colspan='4' align='LEFT'>From " + FromDate + " To " + ToDate + "</td>  <td align=\"right\" colspan='6'>Date : " + dataTableobj.Table4[0].Dt + "</td></tr>"
                    str += "<tr><TD colspan='10'><br/></td></tr>"



                    str += "<tr style='font-size:10pt;font-family:Arial'>"



                    str += "</tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                        str += "<tr style='font-size:10pt;font-family:Arial'>"

                        str += "<td align='left' colspan='10'><b><u>" + dataTableobj.Table0[i].Airline + "</u></b></td>"
                        str += "</tr>"

                        for (var j = 0; j < dataTableobj.Table1.length; j++) {
                            if (dataTableobj.Table0[i].Airlinesno == dataTableobj.Table1[j].Airlinesno) {

                                if (dataTableobj.Table1[j].RowNo == 1) {
                                    str += "<tr><td colspan='10'><hr/></td></Tr>"
                                    str += "<tr style='font-size:10pt;font-family:Arial'><td align='center'><b>MOVEMENT NO</b></td><td align='center'><b>FLIGHT NO</b></td><td align='center'><b>DEPARTURE DATE </b></td><td align='center'><b>Awb No</b></td><td align='center'><b>MNF PIECES</b></td><td align='center'><b>MNF WT</b></td><td align='center'><b>OFF PIECES</b></td><td align='center'><b>                                        OFF WT</b></td><td align='center'><b>UPLIFT PIECES</b></td><td align='center'><b>UPLIFT WT</b></td></tr>"
                                    str += "<tr><td colspan='10'><hr/></td></Tr>"
                                }

                                str += "<tr  style='font-size:9pt;font-family:Arial'>"
                                str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].movementno + "</b></td>";
                                str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightNo + "</b></td>";
                                str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].FlightDate + "</b></td>";
                                str += "<td  width='10%' align='center'><b>" + dataTableobj.Table1[j].AWBNo + "</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table1[j].MnfPieces + "</b></td>";
                                str += "<td  width='10%'align='right'><b>" + dataTableobj.Table1[j].MnfWt + "</b></td>";
                                str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].OffPieces + "</b></td>";
                                str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].OffWt + "</b></td>";
                                str += "<td  width='10%'align='right'><b>" + dataTableobj.Table1[j].UpliftPieces + "</b></td>";
                                str += "<td  width='10%' align='right'><b>" + dataTableobj.Table1[j].UpliftWt + "</b></td>";
                                str += "</tr>"

                            }
                        }
                        for (var z = 0; z < dataTableobj.Table2.length; z++) {

                            if (dataTableobj.Table0[i].Airlinesno == dataTableobj.Table2[z].Airlinesno) {

                                str += "<tr><td colspan='10'><hr/></td></Tr>"
                                str += "<tr  style='font-size:10pt;font-family:Arial'>"
                                str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                                str += "<td width='10%' align='center'><b> SUB TOTAL :</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].MnfPieces + "</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].MnfWt + "</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].OffPieces + "</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].OffWt + "</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftPieces + "</b></td>";
                                str += "<td width='10%' align='right'><b>" + dataTableobj.Table2[z].UpliftWt + "</b></td>";
                                str += "</tr>"
                                str += "<tr><td colspan='10'><hr/></td></Tr>"
                            }
                        }
                    }

                    for (var y = 0; y < dataTableobj.Table3.length; y++) {


                        // str += "<tr><td colspan='10'><table width='100%' cellpadding='0' cellspacing='0'  border='1'>";
                        //   str+="<tr><td colspan='10'><hr/></td></Tr>"
                        str += "<tr  style='font-size:10pt;font-family:Arial'>"
                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b>&nbsp;</b></td>";
                        str += "<td width='10%' align='center'><b> GRAND TOTAL :</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].MnfPieces + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].MnfWt + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].OffPieces + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].OffWt + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].UpliftPieces + "</b></td>";
                        str += "<td width='10%' align='right'><b>" + dataTableobj.Table3[y].UpliftWt + "</b></td>";
                        //str += "</tr></table></td></tr>"
                        str += "</tr>"
                        str += "<tr><td colspan='10'><hr/></td></Tr>"
                    }





                    str += "</table></html>";

                    var data_type = 'data:application/vnd.ms-excel';

                  
                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}

