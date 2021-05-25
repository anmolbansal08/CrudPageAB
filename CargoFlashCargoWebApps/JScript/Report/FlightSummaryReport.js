var AirlineAccess = "";
var IsAllAirline = 0;
$(document).ready(function () {
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "FlightSummary_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Gate_Pass_SearchAirlineCarrierCode1", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Tariff_AirportCode", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Tariff_AirportCode", null, "contains");

    cfi.AutoCompleteV2("FlightStatus", "FlightStatus", "ViewGetAllFlightStatus", null, "contains");

    cfi.AutoCompleteV2("FlightType", "FlightTypeName", "Schedule_FlightType", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $("#FromDate").change(function () {
        //$('#FromDate').css('width', '150px');
        //$('.k-datepicker').css('width', '150px');
        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());

        if ($("#ToDate").val() < $("#FromDate").val())
            $("#ToDate").data("kendoDatePicker").value('');
    });
    $.ajax({
        url: "../schedule/GetAirports", async: false, type: "POST", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result[0] != undefined && result[0] != null) {

                AirlineAccess = result[0].Airlines.TrimRight();
                IsAllAirline = parseInt(result[0].IsAllAirlines);
            }
        }
    });
});


function ExtraCondition(textId) {
    var filterOrigin = cfi.getFilter("AND");
    var filterDest = cfi.getFilter("AND");
    var filterFlight = cfi.getFilter("AND");
    if (textId == "Text_OriginSNo") {
        try {
           
            cfi.setFilter(filterOrigin, "SNo", "notin", $("#DestinationSNo").val());
           
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOrigin]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_DestinationSNo") {
        try {
            cfi.setFilter(filterDest, "SNo", "notin", $("#OriginSNo").val());
            var Dest = cfi.autoCompleteFilter([filterDest]);
            return Dest;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_FlightNo") {
        try {
            if ($("#OriginSNo").val()!="")
                cfi.setFilter(filterFlight, "OriginAirportSNo", "in", $("#OriginSNo").val());
            if ($("#DestinationSNo").val() != "")
                cfi.setFilter(filterFlight, "DestinationAirPortSNo", "in", $("#DestinationSNo").val());
            if ($("#Airline").val() != "")
                cfi.setFilter(filterFlight, "CarrierCode", "in", $("#Airline").val());
            if (IsAllAirline==0)
                cfi.setFilter(filterFlight, "CarrierCode", "in", AirlineAccess);
            var Flight = cfi.autoCompleteFilter([filterFlight]);
            return Flight;
        }
        catch (exp)
        { }
    }
     
}


function GetFlightSummaryDetail() {
    var Modeldata = {
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        FlightNo: $('#Text_FlightNo').val() == "" ? "" : $('#Text_FlightNo').val(),
        OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(), 
        DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val() ,
        Airline: $('#Airline').val() == "" ? "0" : $('#Airline').val(),
        FlightStatus: $('#FlightStatus').val() == "" ? "0" : $('#FlightStatus').val(),
        FlightType: $('#FlightType').val() == "" ? "0" : $('#FlightType').val(),
        RouteType: $("input[name='RouteTypeFilter']:checked").val(),
    }


    if (cfi.IsValidSubmitSection()) {

        $.ajax({
            url: "../FlightSummaryReport/GetFlightSummaryDetail",
            async: false,
            type: "GET",
            dataType: "json",

            data: Modeldata,
            // contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                var Result = result.Table0
                $('#theadid').html('');
                $('#tbodyid').html('');


                var thead_body = "";
                var thead_row = "";

                if (Result.length > 0) {

                    for (var i = 0; i < Result.length; i++) {
                        var columnsIn = Result[0];// Coulms Name geting from First Row
                        thead_row += '<tr>'
                        for (var key in columnsIn) { // Printing Columns
                            if (i == 0)
                                thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                            thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : Result[i][key]) + "</label></td>";
                        }
                        thead_row += '</tr>'
                    }

                }
                $('#theadid').append('<tr>' + thead_body + '</tr>');
                $('#tbodyid').append(thead_row);
                $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll');
                $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                $("#Serial").closest('td').attr('style', 'color:#daecf4');
                $("#Serial").closest('td').text('Seri');
                if (Result.length == 0) {


                    ShowMessage('warning', 'Warning - Flight Summary Report', 'No Record Found.', " ", "bottom-right");
                    return false;
                    //$("#exportflight").hide();
                }
                //else {
                //    $("#exportflight").show();
                //}



            },
            complete: function (data) {


                
                $("#btnExportToExcel_FlightSummaryDetail").show();
            },
            error: function (xhr) {
                var a = "";
            }
        });



    }
}

function ExportToExcel_FlightSummaryDetail() {

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
    $("#tblGetFlightSummaryDetail tbody tr").each(function () {
        var i = $(this).index();
        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
        $(this).attr('style', 'background-color:' + co);
    });
    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblGetFlightSummaryDetail thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblGetFlightSummaryDetail tbody').html() + '</tbody></table></body></html>';
    var contentType = "application/vnd.ms-excel";
    var byteCharacters = table_div; //e.format(fullTemplate, e.ctx);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    var blobUrl = URL.createObjectURL(blob);
    a = document.createElement("a");
    a.download = 'FlightSummaryReport' + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_Airline") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}


if (typeof String.prototype.TrimRight !== 'function') {
    String.prototype.TrimRight = function (char) {
        if (this.lastIndexOf(char))
            return this.slice(0, this.length - 1);
        else
            return this;

    }
}