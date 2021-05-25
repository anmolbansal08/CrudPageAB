$(document).ready(function () {
    cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], onselectval, "contains", null, null, null, null, onselectval, null, null, null);
    cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], onselectval, "contains", null, null, null, null, onselectval, null, null, null);
    cfi.AutoComplete("FlightNo", "FlightNo", "DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    cfi.DateType('FlightDate');
});
//--(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue)
function GetFlightData() {
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
                        for (var key in columnsIn) { // Printing Columns
                            if (i == 0 && key!='SNo')
                                Columns += "<td class='ui-widget-header'> " + key.replace('@','</br>') + " </td>";

                            if (key == 'SNo') {
                                SNo = Result[i][key];
                            }
                            else if(key=='Flight No'){
                                Rows += "<td class='ui-widget-content'><input type='button' value =" + Result[i][key] + " onclick='FlightDetails("+SNo+",0)' title=" + Result[i][key] + " class='inProgress wa'> </td>";
                                //<a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ",0)'>" + Result[i][key] + "</a></td>";

                                //<input type='button' value = "+Result[i][key].split(' / ')[1]+"  onclick=" + GetAWBDetails(' + SNo + ', 1) + " title=" + Result[i][key].split(' / ')[1] + " class='inProgress wa'>
                                //<a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ",1)'>" + Result[i][key].split(' / ')[0] + "</a>
                                //<a href='#' style='color:blue;' onclick='FlightDetails(" + SNo + ",2)'>" + Result[i][key].split(' / ')[1] + "</a>
                            }
                            

                            else if (key == 'Total@(Confirm / Queue)') {
                                Rows += "<td class='ui-widget-content'><input type='button' value = " + Result[i][key].split(' / ')[0] + "  onclick='FlightDetails(" + SNo + ",1)' title=" + Result[i][key].split(' / ')[0] + " class='inProgress wa'> &nbsp;/&nbsp;<input type='button' value = " + Result[i][key].split(' / ')[1] + "  onclick='FlightDetails(" + SNo + ",2)' title=" + Result[i][key].split(' / ')[1] + " class='inProgress wa'></td>";
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
                }
                if ($("#FightsGrid").html() == '') {
                    $("#FightsGrid").append('<div style="color:red; width: 100%; text-align:center;">No Record found!!<div>');
                    $('#FightsGrid').show();
                }
            },
            error: function (xhr) {
                alert('Error on searching!!!');
            }
        });

    }
};

function FlightDetails(SNo, IsConfirm)
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
            }
            openDialogBox('FlightDetails');
        },
        error: function (xhr) {
            alert('Error on searching!!!');
        }
    });
}

function openDialogBox(DivID) {
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
       title: 'Flight - Shipment Details',
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

function onselectval(e)
{
    cfi.EnableAutoComplete('FlightNo', true, true, '');
}

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_FlightNo") {
        if ($('#OriginSNo').val() != '')
            cfi.setFilter(filterEmbargo, "OriginAirportSNo", "eq", $("#OriginSNo").val());
        if ($('#DestinationSNo').val() != '')
            cfi.setFilter(filterEmbargo, "DestinationAirportSNo", "eq", $("#DestinationSNo").val());
      
        cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#FlightDate").val());
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);

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