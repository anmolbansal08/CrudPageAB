$(document).ready(function () {
    //$('#grid').hide();
    //$('#grid_shipment').hide();
    //$('#exportflight').hide();

   
    $("#date").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });
  

   
    $("#date").prop('readonly', true);
 

  
    $('#btnSubmit').click(function () {
       
        if (!cfi.IsValidSubmitSection()) {
            return false;
        }
        else {

          
            var fromdate = $('#date').val();
            var TopNumber = $('#TopNumber').val();
            TopNumber = "";

            $.ajax({
                url: "../SearchSchedule/PostDailyProcessingReport",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    date: fromdate, topnumer: TopNumber
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $('#grid_shipment').show();
                    $('#gridbodys_Proccesing').html('');

                    var Result = (result.Data);
                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 0) {
                        $('#ExportProcessing').show();
                        var container = $("#gridbodys_Proccesing");
                        var tr = '';
                        for (var i = 0; i < Result.length; i++) {
                            tr += '<tr class="datarow">';
                            var td = '';
                            td += "<td class='ui-widget-content'  id='Flightno'> <label  maxlength='100' style='width:100px;'>" + Result[i].Staion + "</label></td>";
                            td += "<td class='ui-widget-content'  id='DomesticDeparture'> <label  maxlength='100' style='width:100px;'>" + Result[i].DomesticDeparture + "</label></td>";
                            td += "<td class='ui-widget-content'  id='DomesticArrival'> <label  maxlength='100' style='width:100px;'>" + Result[i].DomesticArrival + "</label></td>";
                            td += "<td class='ui-widget-content'  id='InternationalDeparture'> <label  maxlength='100' style='width:100px;'>" + Result[i].InternationalDeparture + "</label></td>";
                            td += "<td class='ui-widget-content'  id='InternationalArrival'> <label  maxlength='100' style='width:100px;'>" + Result[i].InternationalArrival + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ManualBooking'> <label  maxlength='100' style='width:100px;'>" + Result[i].ManualBooking + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ElectronicBooking'> <label  maxlength='100' style='width:100px;'>" + Result[i].ElectronicBooking + "</label></td>";
                            td += "<td class='ui-widget-content'  id='AWBExecuted'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBExecuted + "</label></td>";
                            td += "<td class='ui-widget-content'  id='FWBRecieved'> <label  maxlength='100' style='width:100px;'>" + Result[i].FWBRecieved + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='Hard'> <label  maxlength='100' style='width:100px;'>" + Result[i].Hardvolume + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='Utilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].hardUtilisedvolume + "</label></td>";


                           

                            tr += td + "</tr>";
                        }
                        container.append(tr);

                    }
                    else {
                        $("#gridbodys_Proccesing").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                    }



                },
                error: function (xhr) {
                    var a = "";
                }

            });

            $.ajax({
                url: "../SearchSchedule/DailyProcessingReport_handlingcharges",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    date: fromdate, topnumer: TopNumber
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $('#grid_shipment_handling').show();
                    $('#gridbodys_secondProccesing').html('');
                    
                
                    var Result = (result.Data);
                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 0) {
                        $('#importProcessing').show();
                        var container = $("#gridbodys_secondProccesing");
                        var tr = '';
                        var j = 0;
                        for (var i = 0; i < Result.length; i++) {
                            tr += '<tr class="datarow">';
                            var td = '';
                            if (i == 0)
                            {
                                td += "<td class='ui-widget-content'  id='Flightno'> <label  maxlength='100' style='width:100px;'>" + Result[i].Staion + "</label></td>";
                            }
                            if (i > 0)
                            {
                                if (Result[i].Staion == Result[j-1].Staion)
                                {
                                    td += "<td class='ui-widget-content'  id='Flightno'> <label  maxlength='100' style='width:100px;'></label></td>";
                                }
                                else {
                                    td += "<td class='ui-widget-content'  id='Flightno'> <label  maxlength='100' style='width:100px;'>" + Result[i].Staion + "</label></td>";
                                }
                            }
                         
                            td += "<td class='ui-widget-content'  id='Warehouse'> <label  maxlength='100' style='width:100px;'>" + Result[i].Warehouse + "</label></td>";
                            td += "<td class='ui-widget-content'  id='TotalweightHandled'> <label  maxlength='100' style='width:100px;'>" + Result[i].TotalweightHandled + "</label></td>";
                            td += "<td class='ui-widget-content'  id='TotalhandlingCharge_export'> <label  maxlength='100' style='width:100px;'>" + Result[i].TotalhandlingCharge_export + "</label></td>";
                            td += "<td class='ui-widget-content'  id='TotalweightImport'> <label  maxlength='100' style='width:100px;'>" + Result[i].TotalweightImport + "</label></td>";
                            td += "<td class='ui-widget-content'  id='TotalhandlingCharge_import'> <label  maxlength='100' style='width:100px;'>" + Result[i].TotalhandlingCharge_import + "</label></td>";

                            tr += td + "</tr>";
                            j++;
                        }
                        container.append(tr);

                    }
                    else {
                        
            //            $("#tblgrid_secondProccesing").append("<thead class='ui-widget-header' style='text-align:center' id='theadid_secondProccesing'">+

            //    '<tr>'+

            //        '<td class="ui-widget-header">Staion</td>'+
            //        '<td class="ui-widget-header">WareHouse</td>'+
            //        '<td class="ui-widget-header">Total Weight handled (export)</td>'+
            //        '<td class="ui-widget-header">Total Handling Charge (Export)</td>'+

            //        '<td class="ui-widget-header">Total Weight Import</td>'+
            //        '<td class="ui-widget-header">Total Handling Charge (Import)</td>'+


            //    '</tr>'+
            //'</thead>')
                        $("#gridbodys_secondProccesing").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                    }



                },
                error: function (xhr) {
                    var a = "";
                }

            });
        }

    });
});




function ImportToExcel_Processing() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '_' + mm + '_' + yyyy;


    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';

    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#theadid_secondProccesing').html() + $('#gridbodys_secondProccesing').html() + '</table></body></html>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = 'ImportProcessingReport' + today + '_.xls';
    a.click();

    return false
}

function ExportToExcel_Processing() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '_' + mm + '_' + yyyy;


    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';

    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#theadid_shipment').html() + $('#gridbodys_Proccesing').html() + '</table></body></html>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = 'ExportProcessingReport' + today + '_.xls';
    a.click();

    return false
}




