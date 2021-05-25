/// <reference path="../../PermissionScripts/jquery.appendGrid-1.3.1.js" />
/// <reference path="../../PermissionScripts/jquery.appendGrid-1.3.2.js" />

//<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script>
$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "POMailReport_CarrierCode", null, "contains");

    cfi.AutoCompleteV2("Month", "Month", "FlightWisePerformancereport_MonthYear", null, "contains");
    cfi.AutoCompleteV2("Year", "Year", "FlightWisePerformancereport_Year", null, "contains");

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "") {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }

    $('#exportflight').hide();
    $('#example').hide();
});




var Model = [];

function SearchFlightWisePerformanceReport() {

    $("#tbltracking").show();

    Model = {
        AirlineCode: $('#AirlineCode').val(),
        Month: $("#Month").val(),
        Year: $("#Year").val(),
        Type: $('input[type="radio"][name=Filter]:checked').val()
    };

    if (Model.AirlineCode != undefined && Model.Month != undefined && Model.Year != undefined) {
        if (Model.AirlineCode != "" && Model.Month != "" && Model.Year != "") {
            $.ajax({
                url: "../FlightWisePerformanceReport/FlightWisePerformanceReportGetRecord",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(Model),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    if (dataTableobj.Table0.length > 0) {
                        $('#theadid').html('');
                        $('#tbodyid').html('');
                        var Result = dataTableobj.Table0
                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {

                            for (var i = 0; i < Result.length; i++) {
                                var columnsIn = Result[0];// Coulms Name geting from First Row
                                thead_row += '<tr>'
                                for (var key in columnsIn) { // Printing Columns
                                    if (i == 0)
                                        thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                                    thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                }
                                thead_row += '</tr>'
                            }
                        }
                        $('#theadid').append('<tr>' + thead_body + '</tr>');
                        $('#tbodyid').append(thead_row);
                        $(".k-grid-header-wrap").closest('div').attr('style', 'overflow: scroll;height:400px;');
                        $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                        $("#Serial").closest('td').attr('style', 'color:#daecf4');
                        $("#Serial").closest('td').text('Seri');
                        $('#example').show();
                    }
                    else {
                        $('#theadid').html('');
                        $('#tbodyid').html('');
                        $('#example').hide();
                        ShowMessage('warning', 'Warning - Flight Wise Performance !', "Record Not Found !");
                    }
                },
                //error: function (err) {
                //    alert("Generated Error");
                //}
            });

            $('#exportflight').show();
        }
    }
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}


function ExportToExcel_FlightWisePerformanceReport() {

    var AirlineCode = $('#AirlineCode').val();
    var Month = $("#Month").val();
    var Year = $("#Year").val();
    var Type = $('input[type="radio"][name=Filter]:checked').val();

    if (AirlineCode != "" && Month != "" && Year != "") {

        window.location.href = "../FlightWisePerformanceReport/ExportToExcel?AirlineCode=" + AirlineCode + "&Month=" + Month + "&Year=" + Year + "&Type=" + Type;

    }

}