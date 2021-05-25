//Created By Shivali Thakur for Invoice Detail Report on 12-04-2018
$(document).ready(function () {
   // cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName,AirlineCode", "ULD_ChargeAirlineName", null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,airlinename", "AgentAnalysisReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentName", "Name", "GSACSRReport_Office", null, "contains");
   // cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName,AirlineCode", "ULD_ChargeAirlineName", null, "contains");
    cfi.AutoCompleteV2("AWBSNo", "AWBNo", "AuditLog_AWBNo", null, "contains");
    cfi.DateType("Text_StartDate");
    cfi.DateType("Text_EndDate");
    $("#AirlineSNo").val(userContext.AirlineSNo);
    $("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
    $('#btnSubmit').click(function () {
      
    

       
           var careerCode = $('#AirlineSNo').val() || 0;    
            var Agentsno = $('#AgentName').val();
            var Startdate = $('#Text_StartDate').val();
            var Enddate = $('#Text_EndDate').val();
  
         $.ajax({
                url: "../InvoiceDetail/GenerateGSACSRReport",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    careerCode: careerCode, Agentsno: Agentsno, Startdate: Startdate, Enddate: Enddate
                },
                contentType: "application/json; charset=utf-8",
                cache: false,
                 contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        //$('#grid_bookingprofile').show();
                        $('#tbodygridbookingprofile').html('');
                        var Result = (result.Data);
                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {
                            $('#exportflight').show();
                            var container = $("#tbodygridbookingprofile");
                            //var tr = '';
                            //for (var i = 0; i < Result.length; i++) {
                            //    tr += '<tr class="datarow">';
                            //    var td = '';
                            //    td += "<td class='ui-widget-content'  id='AWBNo'> <label  maxlength='100' style='width:100px;'>" + Result[i].AgentName + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='BookingType'> <label  maxlength='100' style='width:100px;'>" + Result[i].AgentCode + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='AWBDATE'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNo + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='FlightNo'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightNo + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='FlightDate'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightDate + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='BoardingPoint'> <label  maxlength='100' style='width:100px;'>" + Result[i].BoardingPoint + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='OffPoint'> <label  maxlength='100' style='width:100px;'>" + Result[i].OffPoint + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='ORIGIN'> <label  maxlength='100' style='width:100px;'>" + Result[i].ORIGIN + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='DESTINATION'> <label  maxlength='100' style='width:100px;'>" + Result[i].DESTINATION + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='ISUPlace'> <label  maxlength='100' style='width:100px;'>" + Result[i].ISUPlace + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='ISUDate'> <label  maxlength='100' style='width:100px;'>" + Result[i].ISUDate + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='ProductName'> <label  maxlength='100' style='width:100px;'>" + Result[i].ProductName + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='SHC'> <label  maxlength='100' style='width:100px;'>" + Result[i].SHC + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='COMMODITYCODE'> <label  maxlength='100' style='width:100px;'>" + Result[i].COMMODITYCODE + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='NATUREOFGOODS'> <label  maxlength='100' style='width:100px;'>" + Result[i].NATUREOFGOODS + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='SplitBooking'> <label  maxlength='100' style='width:100px;'>" + Result[i].SplitBooking + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='Pieces'> <label  maxlength='100' style='width:100px;'>" + Result[i].Pieces + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='GrossWeight'> <label  maxlength='100' style='width:100px;'>" + Result[i].GrossWeight + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='Volume'> <label  maxlength='100' style='width:100px;'>" + Result[i].Volume + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='PiecesUplift'> <label  maxlength='100' style='width:100px;'>" + Result[i].PiecesUplift + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='GrossWeightUplift'> <label  maxlength='100' style='width:100px;'>" + Result[i].GrossWeightUplift + "</label></td>";
                            //    td += "<td class='ui-widget-content'  id='Volumelift'> <label  maxlength='100' style='width:100px;'>" + Result[i].Volumelift + "</label></td>";

                            //    tr += td + "</tr>";
                            //}
                            container.append(Result);

                        }
                        else {
                            $("#tbodygridbookingprofile").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                        }
                    }, 
                    error: function (xhr) {
                        var a = "";
                    }

            });
        
    });
});
function ExportToExcel_GSACSR() {

    var careerCode = $('#AirlineSNo').val() || 0;
    var Agentsno = $('#AgentName').val();
    var Startdate = $('#Text_StartDate').val();
    var Enddate = $('#Text_EndDate').val();

    if (careerCode != undefined && Startdate != undefined && Enddate != undefined) {
        if (careerCode != "" && Startdate != undefined && Enddate != undefined) {
            $.ajax({
                url: "../InvoiceDetail/GetGSACSRReport",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    careerCode: careerCode, Agentsno: Agentsno, Startdate: Startdate, Enddate: Enddate
                },
                contentType: "application/json; charset=utf-8", cache: false,

                success: function (result) {
                    if (result.Total > 0) {

                        var Result = (result.Data);

                        var a = document.createElement('a');
                        var data_type = 'data:application/vnd.ms-excel';
                        var table_div = Result;
                        var table_html = table_div.replace(/ /g, '%20');
                        a.href = data_type + ', ' + table_html;
                        a.download = 'GSACSRInvoiceDetailReport.xls';
                        a.click();
                        return false
                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });
        }
    }
}