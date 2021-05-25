var AirlineAccess = "";
var IsAllAirline = "";
$(document).ready(function () {
    //cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], onselectval, "contains", null, null, null, null, onselectval, null, null, null);
    //cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], onselectval, "contains", null, null, null, null, onselectval, null, null, null);
    //cfi.AutoComplete("FlightNo", "FlightNo", "DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Master_MasterBookingList_AirportCode",  onselectval, "contains", null, null, null, null, onselectval, null, null, null);
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Master_MasterBookingList_Destination",  onselectval, "contains", null, null, null, null, onselectval, null, null, null);
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Master_MasterBookingList_FlightNo", null, "contains");
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
    cfi.DateType('FlightDate');
    $('input[name="operation"]').after('<input type="button"id="ExportToExcelFlights" title="" style="display:none" value="Export to Excel" class="btn btn-success" onClick="ExportToExcel_UserGroupLevelDetail(\'tblsearchrateList\')">')
});
//--(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue)
function GetFlightData() {

    if ($("#FlightNo").val() == "" && $("#OriginSNo").val() == "")
    {
        ShowMessage('warning', '', "Please select any one from ‘Origin’ or ‘Flight No’.");
        return false;
    }

    if (cfi.IsValidSubmitSection()) {

        $.ajax({
            url: "../MasterBookList/GetFlightData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                FlightNo: $("#FlightNo").val(),
                FlightDate: $("#FlightDate").val(),
                OriginSNo: $("#OriginSNo").val(),
                DestinationSNo: $("#DestinationSNo").val(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                //var Result = JSON.parse(result).Table0
                var Result = result.Table0
                var Columns = "";
                var Rows = "";
                $('#FightsGrid').html('');
                $('#FightDetails').html('');
                if (Result.length > 0)
                {

                    for (var i = 0; i < Result.length; i++) {
                        var columnsIn = Result[0];// Coulms Name geting from First Row
                        Rows += '<tr>'
                        var SNo = 0;
                        var FlightNo = '';
                        for (var key in columnsIn) { // Printing Columns
                            if (i == 0 && key!='SNo')
                                Columns += "<td class='ui-widget-header'> " + key.replace('@','</br>') + " </td>";

                            if (key == 'SNo') {
                                SNo = Result[i][key];
                            }
                            else if (key == 'Flight No') {
                                FlightNo =Result[i][key];
                                Rows += "<td class='ui-widget-content'><span style='display:none'>" + Result[i][key] + "</span><input type='button' value =" + Result[i][key] + " onclick='FlightDetails(" + SNo + ",0,\"" + FlightNo + "\",this)' title=" + Result[i][key] + " class='inProgress wa'> </td>";
                                //<a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ",0)'>" + Result[i][key] + "</a></td>";

                                //<input type='button' value = "+Result[i][key].split(' / ')[1]+"  onclick=" + GetAWBDetails(' + SNo + ', 1) + " title=" + Result[i][key].split(' / ')[1] + " class='inProgress wa'>
                                //<a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ",1)'>" + Result[i][key].split(' / ')[0] + "</a>
                                //<a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ",2)'>" + Result[i][key].split(' / ')[1] + "</a>
                            }
                            

                            else if (key == 'Total@(Confirm / Queue)') {
                                Rows += "<td class='ui-widget-content'><span style='display:none'>" + Result[i][key].split(' / ')[0] + "</span><input type='button' value = " + Result[i][key].split(' / ')[0] + "  onclick='FlightDetails(" + SNo + ",1,\"" + FlightNo + "\",this)' title=" + Result[i][key].split(' / ')[0] + " class='inProgress wa'> &nbsp;/&nbsp;<span style='display:none'>" + Result[i][key].split(' / ')[1] + "</span><input type='button' value = " + Result[i][key].split(' / ')[1] + "  onclick='FlightDetails(" + SNo + ",2,\"" + FlightNo + "\",this)' title=" + Result[i][key].split(' / ')[1] + " class='inProgress wa'></td>";
                            }
                            else
                                Rows += "<td class='ui-widget-content'> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                        }
                        Rows += '</tr>'
                    }

                    $('#FightsGrid').append('<table id="tblsearchrateList" class="appendGrid ui-widget" style="margin-bottom:10px;"><thead class="ui-widget-header" style="text-align:center" id="theadid"></thead> <tbody id="tbodyid" class="ui-widget-content"></tbody></table>');

                    $('#theadid').append('<tr>' + Columns + '</tr>');

                    $('#tbodyid').append(Rows);

                    $('#FightsGrid').show();

                    $('#ExportToExcelFlights').show();

                }
                if ($("#FightsGrid").html() == '') {
                    $("#FightsGrid").append('<div style="color:red; width: 100%; text-align:center;">No Record found!!<div>');
                    $('#FightsGrid').show();
                    $('#ExportToExcelFlights').hide();
                }

                $("#tblsearchrateList tbody tr").on('click', function () {
                    $("#tblsearchrateList tbody tr td").removeClass('highlightMBL');
                    $(this).find('td').addClass('highlightMBL');
                });
                //$('#tblsearchrateList tbody  tr').mouseenter(function () {
                //    $(this).find("td").each(function () {
                //        $(this).addClass('highlightMBL');
                //    });
                //});
                //$('#tblsearchrateList tbody  tr').mouseleave(function () {
                //    $(this).find("td").each(function () {
                //        $(this).removeClass('highlightMBL');
                //    });
                //});
            },
            error: function (xhr) {
                $('#ExportToExcelFlights').hide();
                alert('Error on searching!!!');
            }
        });

    }
};

function FlightDetails(SNo, IsConfirm, FlightNo, obj)
{   
    $.ajax({
        url: "../MasterBookList/GetFlightShipments",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: SNo,
            IsConfirm: IsConfirm
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            //var Result = JSON.parse(result).Table0
            var Result = result.Table0
            var Columns = "";
            var Rows = "";           
            $('#FlightDetails').html('');
            if (Result.length > 0) {

                for (var i = 0; i < Result.length; i++) {
                    var columnsIn = Result[0];// Coulms Name geting from First Row
                    Rows += '<tr>'
                    var SNo = 0;
                    for (var key in columnsIn) { // Printing Columns
                        if (i == 0 && key != 'SNo')
                            Columns += "<td class='ui-widget-header'> " + key + " </td>";

                        //if (key == 'SNo') {
                        //    SNo = Result[i][key];
                        //}
                        //else if (key == 'Flight No') {
                        //    Rows += "<td class='ui-widget-content'  id=" + key + i + "> <a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ")'>" + Result[i][key] + "</a></td>";
                        //}
                        //else
                            Rows += "<td class='ui-widget-content'> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                    }
                    Rows += '</tr>'
                }

                $('#FlightDetails').append('<table id="tblFlightDetails" class="appendGrid ui-widget" style="margin-bottom:10px;"><thead class="ui-widget-header" style="text-align:center" id="theadid_F"></thead> <tbody id="tbodyid_F" class="ui-widget-content"></tbody></table>');

                $('#theadid_F').append('<tr>' + Columns + '</tr>');

                $('#tbodyid_F').append(Rows);

                $('#tblFlightDetails tbody  tr').mouseenter(function () {
                    $(this).find("td").each(function () {
                        $(this).addClass('highlightMBL');
                    });
                });
                $('#tblFlightDetails tbody  tr').mouseleave(function () {
                    $(this).find("td").each(function () {
                        $(this).removeClass('highlightMBL');
                    });
                });
            }
            openDialogBox('FlightDetails', FlightNo);
        },
        error: function (xhr) {
            alert('Error on searching!!!');
        }
    });
}

function openDialogBox(DivID, FlightNo) {
    if ($("#" + DivID).html() == "")
        $("#" + DivID).append('<div style="color:red; width: 100%; text-align:center;">No Record found!!<div>');

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
       title: 'Flight ' + FlightNo + ' - Shipment Details',
       draggable: true,
       resizable: false,
       buttons: {
           "Export To Excel": function () {
               if ($('#tblFlightDetails tbody tr').length > 0)
                   ExportToExcel_UserGroupLevelDetail("tblFlightDetails");
           },
           "OK": function () {
               $(this).dialog("close");
           }
       },
       close: function () {
           $(this).dialog("close");
       }
   });
}

function onselectval(e)
{
    cfi.EnableAutoComplete('FlightNo', true, true, '');
}

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_FlightNo")
    {
        if(AirlineAccess!='')
            cfi.setFilter(filterEmbargo, "CarrierCode", "in", AirlineAccess);
        if ($('#OriginSNo').val() != '' || $('#DestinationSNo').val() != '')
        {
            if ($('#OriginSNo').val() != '')
                cfi.setFilter(filterEmbargo, "OriginAirportSNo", "eq", $("#OriginSNo").val());
            if ($('#DestinationSNo').val() != '')
                cfi.setFilter(filterEmbargo, "DestinationAirportSNo", "eq", $("#DestinationSNo").val());
      
            cfi.setFilter(filterEmbargo, "ScheduleDate", "eq", $("#FlightDate").val());
            cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
            cfi.setFilter(filterEmbargo, "IsExpired", "eq", 0);
        }
        var RT_Filter = cfi.autoCompleteFilter(filterEmbargo);
        return RT_Filter;

    }

    else if (textId == "Text_DestinationSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }
}

function ExportToExcel_UserGroupLevelDetail(tblName) {

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
    $("#"+tblName+" tbody tr").each(function () {
        var i = $(this).index();
        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
        $(this).attr('style', 'background-color:' + co);
    });
    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#' + tblName + ' thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#' + tblName + ' tbody').html() + '</tbody></table></body></html>';
   
    var contentType = "application/vnd.ms-excel";
    var byteCharacters = table_div; 
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    var blobUrl = URL.createObjectURL(blob);

    a = document.createElement("a");
    a.download = (tblName=="tblsearchrateList"? 'MBL_Flights_' :'MBL_ShipmentsOnFlight_') + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}


if (typeof String.prototype.TrimRight !== 'function') {
    String.prototype.TrimRight = function (char) {
        if (this.lastIndexOf(char))
            return this.slice(0, this.length - 1);
        else
            return this;

    }
}