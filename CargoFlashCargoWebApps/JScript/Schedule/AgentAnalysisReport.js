var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    var agentsno = "";
    cfi.AutoCompleteV2("Airline", "CarrierCode,airlinename", "AgentAnalysisReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentName", "AccountCode,Name", "AgentAnalysisReport_Agent", null, "contains");
    cfi.AutoCompleteV2("BookingFlightNo", "FlightNo", "AgentAnalysisReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "AgentAnalysisReport_City", null, "contains");

    cfi.AutoCompleteV2("Product", "ProductName", "AgentAnalysisReport_Product", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "AgentAnalysisReport_Commodity", null, "contains");
    $("#Fromdate").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });
    $("#Todate").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });
    $("#Fromdate").prop('readonly', true);
    $("#Todate").prop('readonly', true);


});

var Model = [];
$('#btnSubmit').click(function () {
    Model = {
        careerCode: $('#Airline').val() == "" ? "0" : $('#Airline').val(),
        Agentsno: $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
     OriginCitySno: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
    Fromdate : $('#Fromdate').val(),
    Todate : $('#Todate').val(),
    flightNo: $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val(),
    IsAutoProcess: (OnBlob == true ? 0 : 1)


    };

        if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

            // alert('From Date can not be greater than To Date');
            $('#tbodygridbookingprofile').html('');
            $('#lblerror').html('From Date can not be greater than To Date').css({ 'color': 'red' });
            return false;;
        }
            

        else if (!cfi.IsValidSubmitSection()) {
            return false;
        }
        else if (OnBlob) {
                $.ajax({
                    url: "../Reports/AgentAnalysisReport",               
                    type: "GET",
                    dataType: "json",
                    data: Model,
                    success: function (result) {
                        //if (result != null && result.Table0 !== undefined) {
                            //if (result.Table0.length > 0) {
                                var data = result.Table0[0].ErrorMessage.split('~');

                                if (parseInt(data[0]) == 0)
                                    ShowMessage('success', 'Reports!', data[1]);
                                else
                                    ShowMessage('warning', 'Reports!', data[1]);
                    }
                    //}
                        //}
                        
                });
            }
            else {
                  $('#lblerror').html('');
                var Airline = $('#Airline').val();
                var AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()

                var Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();

                var Fromdate = $('#Fromdate').val();


                var Todate = $('#Todate').val();
                var flightNo = $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val();
                var IsAutoProcess = 1;

                $.ajax({
                    url: "../SearchSchedule/GetAgentAnalysisReport",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data:
                       {
                           careerCode: Airline, Agentsno: AgentName, OriginCitySno: Origin, fromdate: Fromdate, todate: Todate, flightNo: flightNo, IsAutoProcess: IsAutoProcess
                   },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        $('#grid_bookingprofile').show();
                        $('#tbodygridbookingprofile').html('');

                        var Result = (result.Data);
                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {
                            $('#exportflight').show();
                            var container = $("#tbodygridbookingprofile");
                            var tr = '';
                            for (var i = 0; i < Result.length; i++) {
                                tr += '<tr class="datarow">';
                                var td = '';
                                td += "<td class='ui-widget-content'  id='AWBNo'> <label  maxlength='100' style='width:100px;'>" + Result[i].AgentName + "</label></td>";
                                td += "<td class='ui-widget-content'  id='BookingType'> <label  maxlength='100' style='width:100px;'>" + Result[i].AgentCode + "</label></td>";
                                td += "<td class='ui-widget-content'  id='AWBDATE'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNo + "</label></td>";
                                td += "<td class='ui-widget-content'  id='FlightNo'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightNo + "</label></td>";
                                td += "<td class='ui-widget-content'  id='FlightDate'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightDate + "</label></td>";
                                td += "<td class='ui-widget-content'  id='BoardingPoint'> <label  maxlength='100' style='width:100px;'>" + Result[i].BoardingPoint + "</label></td>";
                                td += "<td class='ui-widget-content'  id='OffPoint'> <label  maxlength='100' style='width:100px;'>" + Result[i].OffPoint + "</label></td>";
                                td += "<td class='ui-widget-content'  id='ORIGIN'> <label  maxlength='100' style='width:100px;'>" + Result[i].ORIGIN + "</label></td>";
                                td += "<td class='ui-widget-content'  id='DESTINATION'> <label  maxlength='100' style='width:100px;'>" + Result[i].DESTINATION + "</label></td>";
                                td += "<td class='ui-widget-content'  id='ISUPlace'> <label  maxlength='100' style='width:100px;'>" + Result[i].ISUPlace + "</label></td>";
                                td += "<td class='ui-widget-content'  id='ISUDate'> <label  maxlength='100' style='width:100px;'>" + Result[i].ISUDate + "</label></td>";
                                td += "<td class='ui-widget-content'  id='ProductName'> <label  maxlength='100' style='width:100px;'>" + Result[i].ProductName + "</label></td>";
                                td += "<td class='ui-widget-content'  id='SHC'> <label  maxlength='100' style='width:100px;'>" + Result[i].SHC + "</label></td>";
                                td += "<td class='ui-widget-content'  id='COMMODITYCODE'> <label  maxlength='100' style='width:100px;'>" + Result[i].COMMODITYCODE + "</label></td>";
                                td += "<td class='ui-widget-content'  id='NATUREOFGOODS'> <label  maxlength='100' style='width:100px;'>" + Result[i].NATUREOFGOODS + "</label></td>";
                                td += "<td class='ui-widget-content'  id='SplitBooking'> <label  maxlength='100' style='width:100px;'>" + Result[i].SplitBooking + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Pieces'> <label  maxlength='100' style='width:100px;'>" + Result[i].Pieces + "</label></td>";
                                td += "<td class='ui-widget-content'  id='GrossWeight'> <label  maxlength='100' style='width:100px;'>" + Result[i].GrossWeight + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Volume'> <label  maxlength='100' style='width:100px;'>" + Result[i].Volume + "</label></td>";
                                td += "<td class='ui-widget-content'  id='PiecesUplift'> <label  maxlength='100' style='width:100px;'>" + Result[i].PiecesUplift + "</label></td>";
                                td += "<td class='ui-widget-content'  id='GrossWeightUplift'> <label  maxlength='100' style='width:100px;'>" + Result[i].GrossWeightUplift + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Volumelift'> <label  maxlength='100' style='width:100px;'>" + Result[i].Volumelift + "</label></td>";

                                tr += td + "</tr>";
                            }
                            container.append(tr);

                        }
                        else {
                            $("#tbodygridbookingprofile").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                        }
                    },
                    error: function (xhr) {
                        var a = "";
                    }

                });
            }
        
        });

    $("#Text_Origin_input").unbind('select').bind('select', function () {

    });
    $("#Text_Origin").change(function () {
        var end = this.value;
        var firstDropVal = $("#Origin").val();;
        // SelectAgentName();
    });

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");

    if (textId == "Text_Airline") {

        cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
        // cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }
    else if (textId == "Text_Origin") {
       // $('#Text_AgentName').val('');
       // $('#AgentName').val('');
        //cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
        //// cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

        //var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        //return OriginCityAutoCompleteFilter2;
        //if ($('#Text_Origin').val() != "")
        //{
        //    SelectAgentName();
        //}

    }
    //else if (textId == "Text_AgentName") {
    //    debugger;
    //    if ($('#Text_Origin').val() != "") {
    //        cfi.setFilter(filterEmbargo, "SNO", "in", agentsno);
    //        // cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //        return OriginCityAutoCompleteFilter2;
    //    }

    //}

}

function SelectAgentName() {

    $.ajax({
        url: "../SearchSchedule/getAgentName",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#Origin").val() == "" ? 0 : $("#Origin").val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            debugger;
            agentsno = "";
            agentsno = result[0].AgentCode;
            if (agentsno == "") {
                agentsno = 0;
                $('#Text_AgentName').val('');
                $('#AgentName').val('');
                $('#Text_AgentName_input').val('');

            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
//function ExportToExcel_Flight() {
//    var today = new Date();
//    var dd = today.getDate();
//    var mm = today.getMonth() + 1;

//    var yyyy = today.getFullYear();
//    if (dd < 10) {
//        dd = '0' + dd;
//    }
//    if (mm < 10) {
//        mm = '0' + mm;
//    }
//    var today = dd + '_' + mm + '_' + yyyy;


//    var a = document.createElement('a');
//    var data_type = 'data:application/vnd.ms-excel';
//    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#tbl_bookingprofile').html() + '</table></body></html>';
//    //var table_div = '<table>' + $('#tbl_bookingprofile').html() + '</table>';
//    var table_html = table_div.replace(/ /g, '%20');
//    a.href = data_type + ', ' + table_html;
//    a.download = 'BookingProfile' + today + '_.xls';
//    a.click();

//    return false
//}

function ExportToExcel_Flight() {



    careerCode = $('#Airline').val();
    Agentsno = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
    OriginCitySno = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    fromdate = $('#Fromdate').val();
    todate = $('#Todate').val();
    flightNo = $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val();
    IsAutoProcess = 1;

    if (careerCode != undefined && fromdate != undefined && todate != undefined) {
        if (careerCode != "" && fromdate != "" && todate != "") {
            //airlineCode: AirlineCode, FlightNo: flightNo, Fromdate: fromdate, Todate: todate, OriginSno: Origin, DestinationSno: Destination, AgentSno: AgentName, DateType: DateType
            window.location.href = "../SearchSchedule/GetAgentAnalysisReport_Toexcel?careerCode=" + careerCode + "&Agentsno=" + Agentsno + "&OriginCitySno=" + OriginCitySno + "&fromdate=" + fromdate + "&todate=" + todate + "&flightNo=" + flightNo + "&IsAutoProcess=" + IsAutoProcess;
        }
    }
}
