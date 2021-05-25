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
 

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    
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
});

function Search() {
    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();

        var ToDate = $("#ToDate").val();

        $.ajax({
            url: "Services/Report/HandedOverService.svc/GetHandedOverRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
               if (dataTableobj.Table0 != undefined) {
                    if (dataTableobj.Table0.length > 0) {
                        var myWindow;

                        var str = "";

                        str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";

                        str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Handed Over [" + dataTableobj.Table8[0].DT + "]</b></font></td></TR>"
                        str += "<tr style='background-color:#283747  ;font-size:12pt;font-family:Arial'><td align='center' colspan='8'><font color='white'><b>Export Activities</b></font></td></TR>"
                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                        str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Acceptance</b></font></td></TR>"
                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                        //for (var key in dataTableobj.Table0[0]) {
                        //    str += "<td nowrap width='38%' align='center'><font color='white'><b>" + key + "</b></font></td>"
                        //}
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Shipment Description&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Total&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No. of Pieces Accepted&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Total Weight Accepted(KG)&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Total Shipments Screened&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.Shipments handed over for Acceptance&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Offic&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.of Staff Allocated&nbsp;</b></font></td>"

                        str += "</tr>"

                        if (dataTableobj.Table0.length > 0) {

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"

                            str += "<td nowrap width='38%'  align='left'>&nbsp;<b> Export Acceptance</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].TotalNo + "</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].NoofPieces + "</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].TotalWt + "</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].TotalScreened + "</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].HandedOver + "</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            str += "</tr>"
                            str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='8'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td></tr>"
                        }

                        if (dataTableobj.Table1.length > 0) {
                            str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Warehouse - Buildup Details</b></font></td></TR>"
                            str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                            str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;No.of Pallets/Trolleys &nbsp;</b></font></td>"
                            str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                            str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Cargo Weight&nbsp;</b></font></td>"
                            str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight(KG)&nbsp;</b></font></td>"
                            str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                            str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.of Staff Allocated&nbsp;</b></font></td>"


                            str += "</tr>"

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> ULD</b></td>"
                            if (dataTableobj.Table1[0].NOULD == undefined) {
                                str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            }
                            else {
                                str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOULD + "</b></td>"
                            }
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDCargoWeight + "</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDTareWt + "</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            str += "</tr>"



                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> BULK</b></td>"

                            if (dataTableobj.Table1[0].NOBULK == undefined) {
                                str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            }
                            else {
                                str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOBULK + "</b></td>"
                            }


                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].BULKCargoWeight + "</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            str += "</tr>"

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> ULD RFS</b></td>"
                            if (dataTableobj.Table1[0].NOULDRFS == undefined) {
                                str += "<td nowrap width='38%'  align='right'><b>&nbsp;</b></td>"

                            }
                            else {
                                str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOULDRFS + "</b></td>"
                            }


                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDCargoWeightRFS + "</b></td>"
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDTareWtRFS + "</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            str += "</tr>"

                            str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                            str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> BUILD RFS</b></td>"
                            if (dataTableobj.Table1[0].NOBULKRFS == undefined) {
                                str += "<td nowrap width='38%'  align='right'><b>&nbsp;</b></td>"

                            }
                            else {
                                str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOBULKRFS + "</b></td>"
                            }



                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].BULKCargoWeightRFS + "</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                            str += "</tr>"
                            str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table1[0].TotalNo + "</b></font>&nbsp;</td>"
                            str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table1[0].TotalCargoWt + "</b></font>&nbsp;</td>"
                            str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table1[0].TotalWt + "</b></font>&nbsp;</td>"
                            str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"

                        }

                        str += "<tr style='background-color:#283747  ;font-size:12pt;font-family:Arial'><td align='center' colspan='8'><font color='white'><b>Import Activities</b></font></td></TR>"


                        str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Warehouse</b></font></td></TR>"

                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                        str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;No. of Pallets/Trolleys&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Cargo Weight&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight(KG)&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center' colspan='2'><font color='white'><b>&nbsp;No of Shipments Received&nbsp;</b></font></td>"

                        str += "</tr>"

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> BULK</b></td>"
                        if (dataTableobj.Table2[0].NoofBULK == undefined) {
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].NoofBULK + "</b></td>"
                        }


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].BulkCargoWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].BULKWT + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> ULD</b></td>"
                        if (dataTableobj.Table2[0].NoofULD == undefined) {
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].NoofULD + "</b></td>"
                        }


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].ULDCargoWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].ULDWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='8'>&nbsp;<b> SKD</b></td>"
                        str += "</tr>"

                        str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table2[0].TotalNo + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table2[0].TotalCargoWt + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table2[0].TotalWt + "</b></font>&nbsp;</td>"
                        str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"



                        //Start Breakdown

                        str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Check Report Details - Breakdown Details </b></font></td></TR>"

                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                        str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;No. of Pallets/Trolleys&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Pieces BrokenDown&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight(KG)&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center' ><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No of Staff Allocated&nbsp;</b></font></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> Flight</b></td>"
                        if (dataTableobj.Table3[0].FlightULD == undefined) {
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].FlightULD + "</b></td>"
                        }


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].FlightPc + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].FlightWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> RFS</b></td>"
                        if (dataTableobj.Table3[0].RFSULD == undefined) {
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].RFSULD + "</b></td>"
                        }


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].RFSPc + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].RFSWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table3[0].TotalNo + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table3[0].TotalPc + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table3[0].TotalWt + "</b></font>&nbsp;</td>"
                        str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"

                        // End Breakdown

                        //Start Deliveries
                        str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Deliveries </b></font></td></TR>"

                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                        str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;Delivery Handling&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Pieces Delivered&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight Delivered(KG)&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center' ><font color='white'><b>&nbsp;No of Staff Allocated&nbsp;</b></font></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> D.O Issued</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table4[0].DOShipment + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table4[0].DOPieces + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table4[0].DOWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b>Physical Delivery</b></td>"

                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table5[0].PShipment + "</b></td>"


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table5[0].PPieces + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table5[0].PWT + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'>"
                        str += "<b>" + dataTableobj.Table6[0].TotalNo + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table6[0].TotalPc + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table6[0].TotalWt + "</b></font>&nbsp;</td>"
                        str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"

                        //End Deliveries

                        //Start Deliveries
                        str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Trucking </b></font></td></TR>"

                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                        str += "<td nowrap width='38%' align='center' colspan='4'><font color='white'><b>&nbsp;No. of Trucks Handled During the Shift&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.of Pallets Handled&nbsp;</b></font></td>"

                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight Handled(KG)&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center' ><font color='white'><b>&nbsp;No of Staff Allocated&nbsp;</b></font></td>"
                        str += "</tr>"


                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"

                        str += "<td nowrap width='38%'  align='center' colspan='4'><b>" + dataTableobj.Table7[0].Truck + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table7[0].ULD + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table7[0].Weight + "</b></td>"
                        str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                        str += "</tr>"







                        str += "</table></html>";
                        myWindow = window.open("Handed Over", "_blank");
                        myWindow.document.write(str);

                        myWindow.document.title = 'Handed Over';


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
            }
        });
    }

}

function SearchData() {



    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();

    if (cfi.IsValidSubmitSection()) {
        var FromDate = $("#FromDate").val();
        var ToDate = $("#ToDate").val();

        $.ajax({
            url: "Services/Report/HandedOverService.svc/GetHandedOverRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FromDate: FromDate, ToDate: ToDate
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
              if (dataTableobj.Table0 != undefined) {
                    if (dataTableobj.Table0.length >0) {

                    var str = "";

                    str = "<html><table border=\"0px\" cellpadding='0' cellspacing='1' width='80%'>";

                   // str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><font color=':#419AD4'><b>Handed Over [" + dataTableobj.Table8[0].DT + "]</b></font></td></TR>"

                    str += "<tr font-size:13pt;font-family:Arial'><td align='center' colspan='8'><b>Handed Over </b></td></TR>"

                    str += "<tr  font-size:13pt;font-family:Arial'><td align=\"left\" colspan='8'>SHARJAH AVIATION SERVICES</td></tr><tr><td colspan='3' align='LEFT'>From " + Fdt + " To " + Tdt + "</td>  <td align=\"right\" colspan='5'>Date : " + dataTableobj.Table9[0].Dt + "</td></tr>"


                    str += "<tr style='background-color:#283747  ;font-size:12pt;font-family:Arial'><td align='center' colspan='8'><font color='white'><b>Export Activities</b></font></td></TR>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                    str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Acceptance</b></font></td></TR>"
                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                    //for (var key in dataTableobj.Table0[0]) {
                    //    str += "<td nowrap width='38%' align='center'><font color='white'><b>" + key + "</b></font></td>"
                    //}
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Shipment Description&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Total&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No. of Pieces Accepted&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Total Weight Accepted(KG)&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Total Shipments Screened&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.Shipments handed over for Acceptance&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Offic&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.of Staff Allocated&nbsp;</b></font></td>"

                    str += "</tr>"

                    if (dataTableobj.Table0.length > 0) {

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"

                        str += "<td nowrap width='38%'  align='left'>&nbsp;<b> Export Acceptance</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].TotalNo + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].NoofPieces + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].TotalWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].TotalScreened + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table0[0].HandedOver + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        str += "</tr>"
                        str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='8'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td></tr>"
                    }

                    if (dataTableobj.Table1.length > 0) {
                        str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Warehouse - Buildup Details</b></font></td></TR>"
                        str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                        str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;No.of Pallets/Trolleys &nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Cargo Weight&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight(KG)&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                        str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.of Staff Allocated&nbsp;</b></font></td>"


                        str += "</tr>"

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> ULD</b></td>"
                        if (dataTableobj.Table1[0].NOULD == undefined) {
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOULD + "</b></td>"
                        }
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDCargoWeight + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDTareWt + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        str += "</tr>"



                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> BULK</b></td>"

                        if (dataTableobj.Table1[0].NOBULK == undefined) {
                            str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOBULK + "</b></td>"
                        }


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].BULKCargoWeight + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        str += "</tr>"

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> ULD RFS</b></td>"
                        if (dataTableobj.Table1[0].NOULDRFS == undefined) {
                            str += "<td nowrap width='38%'  align='right'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOULDRFS + "</b></td>"
                        }


                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDCargoWeightRFS + "</b></td>"
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].ULDTareWtRFS + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        str += "</tr>"

                        str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                        str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> BUILD RFS</b></td>"
                        if (dataTableobj.Table1[0].NOBULKRFS == undefined) {
                            str += "<td nowrap width='38%'  align='right'><b>&nbsp;</b></td>"

                        }
                        else {
                            str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].NOBULKRFS + "</b></td>"
                        }



                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table1[0].BULKCargoWeightRFS + "</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                        str += "</tr>"
                        str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table1[0].TotalNo + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table1[0].TotalCargoWt + "</b></font>&nbsp;</td>"
                        str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table1[0].TotalWt + "</b></font>&nbsp;</td>"
                        str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"

                    }

                    str += "<tr style='background-color:#283747  ;font-size:12pt;font-family:Arial'><td align='center' colspan='8'><font color='white'><b>Import Activities</b></font></td></TR>"


                    str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Warehouse</b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"

                    str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;No. of Pallets/Trolleys&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Cargo Weight&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight(KG)&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center' colspan='2'><font color='white'><b>&nbsp;No of Shipments Received&nbsp;</b></font></td>"

                    str += "</tr>"

                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> BULK</b></td>"
                    if (dataTableobj.Table2[0].NoofBULK == undefined) {
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                    }
                    else {
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].NoofBULK + "</b></td>"
                    }


                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].BulkCargoWt + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].BULKWT + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"

                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> ULD</b></td>"
                    if (dataTableobj.Table2[0].NoofULD == undefined) {
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                    }
                    else {
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].NoofULD + "</b></td>"
                    }


                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].ULDCargoWt + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table2[0].ULDWt + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='8'>&nbsp;<b> SKD</b></td>"
                    str += "</tr>"

                    str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table2[0].TotalNo + "</b></font>&nbsp;</td>"
                    str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table2[0].TotalCargoWt + "</b></font>&nbsp;</td>"
                    str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table2[0].TotalWt + "</b></font>&nbsp;</td>"
                    str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"



                    //Start Breakdown

                    str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Check Report Details - Breakdown Details </b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;No. of Pallets/Trolleys&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Pieces BrokenDown&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight(KG)&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center' ><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No of Staff Allocated&nbsp;</b></font></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> Flight</b></td>"
                    if (dataTableobj.Table3[0].FlightULD == undefined) {
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                    }
                    else {
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].FlightULD + "</b></td>"
                    }


                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].FlightPc + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].FlightWt + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> RFS</b></td>"
                    if (dataTableobj.Table3[0].RFSULD == undefined) {
                        str += "<td nowrap width='38%'  align='center'><b>&nbsp;</b></td>"

                    }
                    else {
                        str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].RFSULD + "</b></td>"
                    }


                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].RFSPc + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table3[0].RFSWt + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table3[0].TotalNo + "</b></font>&nbsp;</td>"
                    str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table3[0].TotalPc + "</b></font>&nbsp;</td>"
                    str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table3[0].TotalWt + "</b></font>&nbsp;</td>"
                    str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"

                    // End Breakdown

                    //Start Deliveries
                    str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Deliveries </b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td nowrap width='38%' align='center' colspan='3'><font color='white'><b>&nbsp;Delivery Handling&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Pieces Delivered&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight Delivered(KG)&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center' ><font color='white'><b>&nbsp;No of Staff Allocated&nbsp;</b></font></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b> D.O Issued</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table4[0].DOShipment + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table4[0].DOPieces + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table4[0].DOWt + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"
                    str += "<td nowrap width='38%'  align='left' colspan='3'>&nbsp;<b>Physical Delivery</b></td>"

                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table5[0].PShipment + "</b></td>"


                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table5[0].PPieces + "</b></td>"
                    str += "<td nowrap width='38%'  align='right'><b>" + dataTableobj.Table5[0].PWT + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#C1E4F7;font-size:10pt;font-family:Arial'><td colspan='3' align='left'>&nbsp;<font color='black'><b>Total</b></font>&nbsp;</td><td align='right'>&nbsp;<font color='black'>"
                    str += "<b>" + dataTableobj.Table6[0].TotalNo + "</b></font>&nbsp;</td>"
                    str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table6[0].TotalPc + "</b></font>&nbsp;</td>"
                    str += "<td align='right'>&nbsp;<font color='black'><b>" + dataTableobj.Table6[0].TotalWt + "</b></font>&nbsp;</td>"
                    str += "<td align='right' colspan='2'>&nbsp;<font color='black'><b></b></font>&nbsp;</td></tr>"

                    //End Deliveries

                    //Start Deliveries
                    str += "<tr style='background-color:#F2F4F4;font-size:12pt;font-family:Arial'><td align='left' colspan='8'>&nbsp;&nbsp;<font color='#419AD4'><b> Trucking </b></font></td></TR>"

                    str += "<tr style='background-color:#419AD4;font-size:10pt;font-family:Arial'>"
                    str += "<td nowrap width='38%' align='center' colspan='4'><font color='white'><b>&nbsp;No. of Trucks Handled During the Shift&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;No.of Pallets Handled&nbsp;</b></font></td>"

                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Weight Handled(KG)&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center'><font color='white'><b>&nbsp;Office&nbsp;</b></font></td>"
                    str += "<td nowrap width='38%' align='center' ><font color='white'><b>&nbsp;No of Staff Allocated&nbsp;</b></font></td>"
                    str += "</tr>"


                    str += "<tr style='background-color:#F2F4F4;font-size:8pt;font-family:Arial'>"

                    str += "<td nowrap width='38%'  align='center' colspan='4'><b>" + dataTableobj.Table7[0].Truck + "</b></td>"
                    str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table7[0].ULD + "</b></td>"
                    str += "<td nowrap width='38%'  align='center'><b>" + dataTableobj.Table7[0].Weight + "</b></td>"
                    str += "<td nowrap width='38%'  align='center' colspan='2'><b>&nbsp;</b></td>"
                    str += "</tr>"







                    str += "</table></html>";


                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";
                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Handed Over' + postfix + '.xls';

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

