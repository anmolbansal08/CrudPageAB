
var OnBlob = false;
$(document).ready(function () {

    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    $('#grid').hide();
    $('#grid_shipment').hide();
    $('#exportflight').hide();

    cfi.AutoCompleteV2("Airline", "CarrierCode,airlinename", "AllotmentReport_Airline", null, "contains");
    $("#Fromdate").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });
    $("#Todate").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });

    cfi.AutoCompleteV2("AllotmentFlightNo", "FlightNo", "AllotmentReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("AgentName", "AccountCode,Name", "AllotmentReport_Agent", null, "contains");

    $("#Fromdate").prop('readonly', true);
    $("#Todate").prop('readonly', true);

    var agentsno = $('#AgentName').val() == "" ? 0 : $('#AgentName').val()
    $('#btnSubmit').click(function () {
        if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

            alert('From Date can not be greater than To Date');
            return false;;
        }

        if (!cfi.IsValidSubmitSection()) {
            return false;
        }
        else {
            Model={
                 airlineSno : $('#Airline').val(),
             fromdate : $('#Fromdate').val(),
             todate : $('#Todate').val(),
             flightNo: $('#AllotmentFlightNo').val(),
             IsAutoProcess: (OnBlob==true?0:1)
        }
            if (OnBlob) {

                $.ajax({
                    url: "../Reports/Allotment",
                    async: true,
                    type: "GET",
                    dataType: "json",
                    data: Model,
                    success: function (result) {
                       
                        var data = result.Table0[0].ErrorMessage.split('~');

                        if (parseInt(data[0]) == 0)
                            ShowMessage('success', 'Reports!', data[1]);
                        else
                            ShowMessage('warning', 'Reports!', data[1]);
                    }
                });
            }
            else {
                $.ajax({
                    url: "../SearchSchedule/GetAllotmentReport",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data:Model,
                       // {
                       // airlineSno: airlineSno, fromdate: fromdate, todate: todate, flightNo: flightNo, Agentsno: agentsno
                  //  },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        $('#grid').show();
                        $('#gridbodys').html('');

                        var Result = (result.Data);
                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {
                            $('#exportflight').show();
                            var container = $("#gridbodys");
                            var tr = '';
                            for (var i = 0; i < Result.length; i++) {
                                tr += '<tr class="datarow">';
                                var td = '';
                                td += "<td class='ui-widget-content'  id='Flightno'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightNo + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Date'> <label  maxlength='100' style='width:100px;'>" + Result[i].Date + "</label></td>";
                                td += "<td class='ui-widget-content'  id='AircraftType'> <label  maxlength='100' style='width:100px;'>" + Result[i].AircraftType + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Origin'> <label  maxlength='100' style='width:100px;'>" + Result[i].Origin + '-' + Result[i].Destination + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Grosswight'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Grosswight || (0).toFixed(2)) + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Volume'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Volume || (0).toFixed(2)) + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Hard'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Hard || (0).toFixed(2)) + "</label></td>";
                                td += "<td class='ui-widget-content'  id='Utilised'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Utilised || (0).toFixed(2)) + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='Hard'> <label  maxlength='100' style='width:100px;'>" + Result[i].Hardvolume + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='Utilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].hardUtilisedvolume + "</label></td>";


                                td += "<td class='ui-widget-content'  id='Soft'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Soft || (0).toFixed(2)) + "</label></td>";
                                td += "<td class='ui-widget-content'  id='SoftUtilised'> <label  maxlength='100' style='width:100px;'>" + (Result[i].SoftUtilised || (0).toFixed(2)) + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='Soft'> <label  maxlength='100' style='width:100px;'>" + Result[i].softvolume + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='SoftUtilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].softUtilisedvolume + "</label></td>";


                                td += "<td class='ui-widget-content'  id='Fixed'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Fixed || (0).toFixed(2)) + "</label></td>";
                                td += "<td class='ui-widget-content'  id='FixedUtilised'> <label  maxlength='100' style='width:100px;'>" + (Result[i].FixedUtilised || (0).toFixed(2)) + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='Fixed'> <label  maxlength='100' style='width:100px;'>" + Result[i].fixedvolume + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='FixedUtilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].fixedUtilisedvolume + "</label></td>";

                                td += "<td class='ui-widget-content'  id='Open'> <label  maxlength='100' style='width:100px;'>" + Result[i].Open + "</label></td>";
                                td += "<td class='ui-widget-content'  id='OpenUtilised'> <label  maxlength='100' style='width:100px;'>" + (Result[i].OpenUtilised || (0).toFixed(2)) + "</label></td>";

                                //td += "<td class='ui-widget-content'  id='Open'> <label  maxlength='100' style='width:100px;'>" + Result[i].openvolume + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='OpenUtilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].openUtilisedvolume + "</label></td>";

                                td += "<td class='ui-widget-content'  id='Total'> <label  maxlength='100' style='width:100px;'>" + (Result[i].Total || (0).toFixed(2)) + "</label> </td>";
                                td += "<td class='ui-widget-content'  id='TotalUtilised'> <label  maxlength='100' style='width:100px;display:none;'>" + (Result[i].TotalUtilised || (0).toFixed(2)) + "</label><input type='button' value= '" + (Result[i].TotalUtilised || (0).toFixed(2)) + "' onclick='FlightDetails(" + Result[i].Dailyflightsno + "," + agentsno + ",\"" + Result[i].FlightNo + "\",\"" + Result[i].Date + "\")' title=" + (Result[i].TotalUtilised || (0).toFixed(2)) + " style='color: #fff; background-color: #428bca; border-color: #357ebd; cursor: pointer;width: 119px;'></td>";

                                //td += "<td class='ui-widget-content'  id='Total'> <label  maxlength='100' style='width:100px;'>" + Result[i].Totalvolume + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='TotalUtilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].TotalUtilisedvolume + "</label></td>";


                                tr += td + "</tr>";
                            }
                            container.append(tr);

                            $("#tblgrid tbody tr").on('click', function () {
                                $("#tblgrid tbody tr td").removeClass('highlightMBL');
                                $(this).find('td').addClass('highlightMBL');
                            });

                            //$('#tblgrid tbody  tr').mouseenter(function () {
                            //    $(this).find("td").each(function () {
                            //        $(this).addClass('highlightMBL');
                            //    });
                            //});
                            //$('#tblgrid tbody  tr').mouseleave(function () {
                            //    $(this).find("td").each(function () {
                            //        $(this).removeClass('highlightMBL');
                            //    });
                            //});

                        }
                        else {
                            $("#gridbodys").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                        }



                    },
                    error: function (xhr) {
                        var a = "";
                    }

                });
            }

        }

    });
});
var container_shipment = "";
function FlightDetails(SNo, Agentsno,FlightNo,FlightDate) {
    var agentsno = $('#AgentName').val() == "" ? 0 : $('#AgentName').val();
    $.ajax({
        url: "../SearchSchedule/GetAllotmentReport_Shipment",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: SNo,
            agentsno: agentsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            $("#gridbodys_shipment").html('');
            var Result = (result.Data);
            var thead_body = "";
            var thead_row = "";

            if (Result.length > 0) {
                container_shipment = $("#gridbodys_shipment");
                var tr = '';
                for (var i = 0; i < Result.length; i++) {
                    tr += '<tr class="datarow">';
                    var td = '';
                    td += "<td class='ui-widget-content'  id='Flightno'> <label  maxlength='100' style='width:100px;'>" + Result[i].AccountName + "</label></td>";
                    td += "<td class='ui-widget-content'  id='AWBNO'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNO + "</label></td>";
                    td += "<td class='ui-widget-content'  id='AWBPCS'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBPCS + "</label></td>";
                    td += "<td class='ui-widget-content'  id='Grosswight'> <label  maxlength='100' style='width:100px;'>" + (Result[i].AWBGRS || (0).toFixed(2)) + "</label></td>";
                    td += "<td class='ui-widget-content'  id='Volume'> <label  maxlength='100' style='width:100px;'>" + (Result[i].AWBVOLUME || (0).toFixed(2)) + "</label></td>";

                    td += "<td class='ui-widget-content'  id='Origin'> <label  maxlength='100' style='width:100px;'>" + Result[i].Origin + '-' + Result[i].Destination + "</label></td>";
                    td += "<td class='ui-widget-content'  id='Hard'> <label  maxlength='100' style='width:100px;'>" + Result[i].AllocationType + "</label></td>";
                    td += "<td class='ui-widget-content'  id='Utilised'> <label  maxlength='100' style='width:100px;'>" + Result[i].Allocationcode + "</label></td>";


                    tr += td + "</tr>";
                }
                container_shipment.append(tr);
                $('#tblgrid_shipment tbody  tr').mouseenter(function () {
                    $(this).find("td").each(function () {
                        $(this).addClass('highlightMBL');
                    });
                });
                $('#tblgrid_shipment tbody  tr').mouseleave(function () {
                    $(this).find("td").each(function () {
                        $(this).removeClass('highlightMBL');
                    });
                });
            }



            openDialogBox('grid_shipment', FlightNo, FlightDate);
        },
        error: function (xhr) {
            alert('Error on searching!!!');
        }
    });
}

function openDialogBox(DivID, FlightNo, FlightDate) {
    if ($("#gridbodys_shipment").html() == "") {
        $("#gridbodys_shipment").html('');
        $("div[id*='Norecord']").remove();
        $("img[id*='imgExcel']").remove();

        $("#" + DivID).append('<div id="Norecord" style="color:red; width: 100%; text-align:center;">No Record found!!<div>');
        $("#" + DivID).show();

        $("#" + DivID).dialog(
       {
           autoResize: true,
           maxWidth: 800,
           maxHeight: 400,
           style: 'font-size:20px;',
           width: 800,
           height: 400,
           modal: true,
           dialogClass: 'no-close success-dialog',
           title: 'Flight ' + FlightNo + ' (' + FlightDate + ') - Shipment Details',
           draggable: true,
           resizable: false,
           buttons: {
               "OK": function () {
                   $(this).dialog("close");
               },
           },
           close: function () {
               $(this).dialog("close");
           }
       });
    }
    else {
        $("div[id*='Norecord']").remove();
        $("img[id*='imgExcel']").remove();
        $("#" + DivID).show();
        $("#" + DivID).prepend('<img id="imgExcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"/>');
        $("#" + DivID).dialog(
       {
           autoResize: true,
           maxWidth: 800,
           maxHeight: 400,
           style: 'font-size:20px;',
           width: 800,
           height: 400,
           modal: true,
           dialogClass: 'no-close success-dialog',
           title: 'Flight ' + FlightNo + ' (' + FlightDate + ') - Shipment Details',
           draggable: true,
           resizable: false,
           buttons: {
               "OK": function () {
                   $(this).dialog("close");
               },
           },
           close: function () {
               $(this).dialog("close");
           }
       });
    }
}
function ExportToExcel_Flight() {
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
    
    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#tblgrid').html() + '</table></body></html>';

    exportToExcelNew(table_div, 'AllotmentReport_Flight' + today + '_.xls');

    return false
}
function ExportToExcel() {

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

    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#tblgrid_shipment').html() + '</table></body></html>';

    exportToExcelNew( table_div,'AllotmentReport_Shipment' + today + '_.xls');
    
    return false
}
function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");

    if (textId == "Text_Airline") {

        cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }

}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_Airline") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}