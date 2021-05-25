
TrackType = 1;
AWBSNo = 0;


//<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script>


$(document).ready(function () {
    //cfi.AutoComplete("AWBPrefix", "AirlineCode", "vwAirline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");
    cfi.AutoComplete("AWB", "AWBNumber", "vwAWBNumberProcess", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
    cfi.AutoComplete("EDIAWBPrefix", "AirlineCode", "vwAirline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");
    cfi.AutoComplete("EDIAWB", "AWBNumber", "vwAWBNumberEDI", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
    cfi.AutoComplete("ConAWBPrefix", "AirlineCode", "vwAirline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");
    cfi.AutoComplete("ConAWB", "AWBNumber", "vwAWBNumber", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
    cfi.AutoComplete("ULDNo", "ULDNo", "vwUldStock", "SNo", "UldNo", ["ULDNo"], null, "contains");
    //cfi.AutoComplete("HistoryAWB", "AWBNumber", "vwAWBNumber", "AWBNumber", "AWBNumber", ["AWBNumber"],null, "contains");

    cfi.AutoComplete("FlightNo", "FlightNo", "vTrackingFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    $("#tblAddFlight").find(".flightdatepicker").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    //cfi.AutoComplete("FlightOrigin", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode","AirportName"], null, "contains");
    //cfi.AutoComplete("FlightDestination", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode","AirportName"], null, "contains");
    $(document).bind('keydown', function (e) {
        var keyCode = e.KeyCode;
        if ($(e.target).attr("id") == "Text_AWB" && e.keyCode == 13) {
            ProcessTrack();

        }
        if ($(e.target).attr("id") == "Text_EDIAWB" && e.keyCode == 13) {
            EDITrack();
        }
        if ($(e.target).attr("id") == "Text_ConAWB" && e.keyCode == 13) {
            ConsolidateTrack();
        }
    });
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(0);
    $('#divTracking').hide();
    //$("#txtFlightdate").datepicker({
    //    onSelect: function (dateText) {
    //        display("Selected date: " + dateText + "; input's current value: " + this.value);
    //    }
    //});
    //$('#Text_AWBPrefix').focus();
    //$('#Text_AWBPrefix').bind('paste', function (e) {
    //    var data = e.originalEvent.clipboardData.getData('Text');
    //    var len = data.length;
    //    if (len > 3) {
    //        var resdata = data.split('-');
    //        $("#Text_AWBPrefix").val(resdata[0]);
    //        //$("#Text_AWB").val(resdata[1]);
    //        // $("#Text_AWBPrefix").data("kendoAutoComplete").setDefaultValue(resdata[0], resdata[0]);
    //        $("#Text_AWB").data("kendoAutoComplete").setDefaultValue(resdata[1], resdata[1]);
    //        $('#btnTrack').focus();

    //    }
    //});
    //$('#Text_EDIAWBPrefix').bind('paste', function (e) {
    //    var data = e.originalEvent.clipboardData.getData('Text');
    //    var len = data.length;
    //    if (len > 3) {
    //        var resdata = data.split('-');
    //        $("#Text_EDIAWBPrefix").val(resdata[0]);
    //        $("#Text_EDIAWB").data("kendoAutoComplete").setDefaultValue(resdata[1], resdata[1]);
    //        $('#btnEDITrack').focus();

    //    }
    //});
    //$('#Text_ConAWBPrefix').bind('paste', function (e) {
    //    var data = e.originalEvent.clipboardData.getData('Text');
    //    var len = data.length;
    //    if (len > 3) {
    //        var resdata = data.split('-');
    //        $("#Text_ConAWBPrefix").val(resdata[0]);
    //        $("#Text_ConAWB").val(resdata[1]);
    //        $('#btnConsolidateTrack').focus();

    //    }
    //});
    //$('#Text_HistoryAWBPrefix').bind('paste', function (e) {
    //    var data = e.originalEvent.clipboardData.getData('Text');
    //    var len = data.length;
    //    if (len > 3) {
    //        var resdata = data.split('-');
    //        $("#Text_HistoryAWBPrefix").val(resdata[0]);
    //        $("#Text_HistoryAWB").val(resdata[1]);
    //        $('#btnHistoryTrack').focus();

    //    }
    //});
    $('#Text_ConAWBPrefix').focus();
    $('#Text_AWBPrefix,#Text_EDIAWBPrefix,#Text_ConAWBPrefix,#Text_HistoryAWBPrefix').bind('paste', function (e) {
        var data = e.originalEvent.clipboardData.getData('Text');
        var len = data.length;
        if (len > 3) {
            var resdata = data.split('-');
            $("#Text_AWBPrefix").val(resdata[0]);
            $("#Text_AWB").data("kendoAutoComplete").setDefaultValue(resdata[1], resdata[1]);
            $('#btnTrack').focus();

            $("#Text_EDIAWBPrefix").val(resdata[0]);
            $("#Text_EDIAWB").data("kendoAutoComplete").setDefaultValue(resdata[1], resdata[1]);

            $("#Text_ConAWBPrefix").val(resdata[0]);
            $("#Text_ConAWB").data("kendoAutoComplete").setDefaultValue(resdata[1], resdata[1]);

            $("#Text_HistoryAWBPrefix").val(resdata[0]);
            $("#Text_HistoryAWB").data("kendoAutoComplete").setDefaultValue(resdata[1], resdata[1]);
        }
    });

    $("#Text_AWBPrefix,#Text_ConAWBPrefix").unbind("keyup").bind("keyup", function () {
        if ($(this).val().length == 3) {
            if ($(this).attr("id") == "Text_AWBPrefix") {
                $("#Text_AWB").focus();
            } else if ($(this).attr("id") == "Text_ConAWBPrefix") {
                $("#Text_ConAWB").focus();
            }
        }
    });

    $("#tbltracking").hide();
    $('#tbltracking').appendGrid({
        caption: 'EDI Message Tracking',
        captionTooltip: 'EDI Message',
        columns: [{ name: 'SNo', type: 'hidden' },
                  { name: 'AWBNo', display: 'AWBNo', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                    { name: 'Carrier', display: 'Carrier', type: 'label', isRequired: false },
                    { name: 'CityCode', display: 'Airport', type: 'label', isRequired: false },
                    {
                        name: 'MessageType', display: 'Message Type', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {

                            $("#txtMessageType").remove();
                            $('#Re_execute').remove();
                            //cfi.PopUp("tblMessageType", "Message Type Details", "500");
                            //$("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
                            if ($("#tbltracking_Status_" + (i + 1)).text() == 'Failed') {
                                $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
                            }
                            else {
                                $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
                            }
                            cfi.PopUp("tblMessageType", "Message Type Details", "500");
                        }
                    },
                    { name: 'Status', display: 'Status', type: 'label', isRequired: false },
                    { name: 'EventType', display: 'Event Type', type: 'label', isRequired: false },
                    { name: 'Reason', display: 'Reason', type: 'label', isRequired: false },
                    { name: 'ActualMessage', type: 'hidden', id: 'hdnActualMessage' },
                    { name: 'SenderID', display: 'Sender/Receiver', type: 'label', isRequired: false },
                    { name: 'EventDate', display: 'Received Date/Sender Date', type: 'label', isRequired: false }],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }
    });
    $("#tblFtracking").hide();
    GetFlightGrid();
    //$(".k-select").remove();
    $("#Text_AWBPrefix").next("span").remove();
    $("#Text_AWB").next("span").remove();
});

function printConsolidate() {

    $('[id="tdmodule"]').hide();
    var divContentstrans = $("#divConTrackingTrans").html();
    var divContents = $("#divConTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Consolidated Tracking</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<style type="text/css">th {padding-top: 4px;padding-right: 2px; padding-bottom: 4px; white-space: nowrap;font-size: 10px; font-family: Verdana;} td {padding-top: 4px;padding-right: 2px;padding-bottom: 4px;white-space: nowrap;font-size: 10px;font-family: Verdana;}legend {font-size: 1.0em; font-weight: bold;padding: 2px 4px 8px; color:#222222;;font-family: Verdana;}</style>');
    printWindow.document.write(divContents);
    printWindow.document.write(divContentstrans);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();

    $('[id="tdmodule"]').show();
}

function printProcess() {

    $('[id="tdmodule"]').hide();
    var divContentstrans = $("#divTrackingTrans").html();
    var divContents = $("#divTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Process Tracking</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<style type="text/css">th {padding-top: 4px;padding-right: 2px; padding-bottom: 4px; white-space: nowrap;font-size: 10px; font-family: Verdana;} td {padding-top: 4px;padding-right: 2px;padding-bottom: 4px;white-space: nowrap;font-size: 10px;font-family: Verdana;}legend {font-size: 1.0em; font-weight: bold;padding: 2px 4px 8px; color:#222222;;font-family: Verdana;}</style>');
    printWindow.document.write(divContents);
    printWindow.document.write(divContentstrans);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    $('[id="tdmodule"]').show();
}

function printEDI() {
    var divContentstrans = $("#divEDITrackingTrans").html();
    var divContents = $("#divEDITracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>EDI Tracking</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<style type="text/css">th {padding-top: 4px;padding-right: 2px; padding-bottom: 4px; white-space: nowrap;font-size: 10px; font-family: Verdana;} td {padding-top: 4px;padding-right: 2px;padding-bottom: 4px;white-space: nowrap;font-size: 10px;font-family: Verdana;}legend {font-size: 1.0em; font-weight: bold;padding: 2px 4px 8px; color:#222222;;font-family: Verdana;}</style>');
    printWindow.document.write(divContents);
    printWindow.document.write(divContentstrans);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    $('[id="tdmodule"]').show();
}

function printFlight() {
    var divContentstrans = $("#divFlightTrackingTrans").html();
    var divContents = $("#divFlightTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Flight Tracking</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<style type="text/css">th {padding-top: 4px;padding-right: 2px; padding-bottom: 4px; white-space: nowrap;font-size: 10px; font-family: Verdana;} td {padding-top: 4px;padding-right: 2px;padding-bottom: 4px;white-space: nowrap;font-size: 10px;font-family: Verdana;}legend {font-size: 1.0em; font-weight: bold;padding: 2px 4px 8px; color:#222222;;font-family: Verdana;}</style>');
    printWindow.document.write(divContents);
    printWindow.document.write(divContentstrans);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    $('[id="tdmodule"]').show();
}

function printULD() {
    var divContentstrans = $("#divULDTrackingTrans").html();
    var divContents = $("#divULDTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>ULD Tracking</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<style type="text/css">th {padding-top: 4px;padding-right: 2px; padding-bottom: 4px; white-space: nowrap;font-size: 10px; font-family: Verdana;} td {padding-top: 4px;padding-right: 2px;padding-bottom: 4px;white-space: nowrap;font-size: 10px;font-family: Verdana;}legend {font-size: 1.0em; font-weight: bold;padding: 2px 4px 8px; color:#222222;;font-family: Verdana;}</style>');
    printWindow.document.write(divContents);
    printWindow.document.write(divContentstrans);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    $('[id="tdmodule"]').show();
}

function onclickliET() {
    $("#Text_EDIAWBPrefix").val($("#Text_AWBPrefix").val());
    $("#Text_EDIAWB").val($("#Text_AWB").val());
    //$(".k-select").remove();
    $("#Text_EDIAWBPrefix").next("span").remove();
    $("#Text_EDIAWB").next("span").remove();
}
function onclickliCT() {
    $("#Text_ConAWBPrefix").val($("#Text_AWBPrefix").val());
    $("#Text_ConAWB").val($("#Text_AWB").val());
    //$(".k-select").remove();
    $("#Text_ConAWBPrefix").next("span").remove();
    $("#Text_ConAWB").next("span").remove();
}
function onclickliFT() {
    //$("#ConAWBPrefix").val($("#AWBPrefix").val());
    //$("#ConAWB").val($("#AWB").val());
}
function onclickliHT() {
    $("#Text_HistoryAWBPrefix").val($("#Text_AWBPrefix").val());
    $("#Text_HistoryAWB").val($("#Text_AWB").val());
    //$(".k-select").remove();
    $("#Text_HistoryAWBPrefix").next("span").remove();
    $("#Text_HistoryAWB").next("span").remove();
}
function BindHistoryTrackingData() {
    var AWBPrefix = $("#Text_HistoryAWBPrefix").val();
    var AWBNumber = $("#Text_HistoryAWB").val();
    //var Type = $("input[name='ProcesTrackType']:checked").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    //if (Type == "1") {
    //    AWBNo = AWBNumber;
    //}
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetChoiceOfTracking?recordID=" + AWBNo,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                ResultData = jQuery.parseJSON(result)
                if (ResultData.Table0.length > 1 && TrackType == 1) {
                    var tbl = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>Waybill No</td><td>Lot No</td><td>Forwarder</td><td>Flight No</td><td>Flight Date</td><td>Origin </td><td>Destination </td><td>Type </td></tr>";
                    for (var i = 0; i < ResultData.Table0.length; i++) {
                        tbl += "<tr><td>" + ResultData.Table0[i].AWBNo + "</td><td>" + ResultData.Table0[i].SLINo + "</td><td>" + ResultData.Table0[i].CustomerName + "</td><td>" + ResultData.Table0[i].FlightNo + "</td><td>" + ResultData.Table0[i].FlightDate + "</td><td>" + ResultData.Table0[i].Origin + "</td><td>" + ResultData.Table0[i].Destination + "</td><td><span>" + ResultData.Table0[i].IsImport + "</span><input type='radio' id='rblTrackType' name='rblTrackType' value='" + ResultData.Table0[i].SNo + "' checked='checked'/></td></tr>"
                        //tbl += "<tr><td>" + ResultData.Table0[i].AWBNo + "</td><td>" + ResultData.Table0[i].Origin + "</td><td>" + ResultData.Table0[i].Destination + "</td><td><span>" + ResultData.Table0[i].IsImport + "</span><input type='radio' id='rblAirWaybill' name='ProcesTrackType' value='0' checked='checked' onclick='CheckAWBRadio(\"ProcesTrackType\");' /></td></tr>"

                        //<input type='checkbox' id='chkbx" + i + "' name='chkbx" + i + "' value=" + ResultData.Table0[i].IsImport + ">
                    }
                    tbl += "<tr><td colspan='8'><input type='button' tabindex='3' value='Track' text='ProcessTrack' class='btn btn-success' onClick='ProcessTrackType()' id='btnTrack'></td></tr></thead></table>";
                    $("#divChoiceOfTracking").html(tbl);
                    cfi.PopUp("divChoiceOfTracking", "Tracking Type", "700");
                }
                else {
                    $.ajax({
                        url: "Services/Shipment/TrackingService.svc/GetHistoryTracking?recid=" + AWBNo + "&TrackType=" + TrackType + "&AWBSNo=" + AWBSNo,
                        type: "get",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            if (result != undefined) {

                                CreateHistoryTracking(result);
                                TrackType = 1;
                                $("#divChoiceOfTracking").data("kendoWindow").close();
                            }
                        }
                    });
                }
            }
        }
    });

}
function BindProceeTrackingData() {
    var AWBPrefix = $("#Text_AWBPrefix").val();
    var AWBNumber = $("#Text_AWB").val();
    var Type = $("input[name='ProcesTrackType']:checked").val();
    var trackingType = $("input[name='TrackingHistoryAWB']:checked").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    if (Type == "1") {
        AWBNo = AWBNumber;
    }
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetChoiceOfTracking?recordID=" + AWBNo,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
            debugger
            if (result != undefined) {
                ResultData = jQuery.parseJSON(result)
                if (ResultData.Table0.length > 1 && TrackType == 1) {
                    var tbl = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>Waybill No</td><td>Lot No</td><td>Forwarder</td><td>Flight No</td><td>Flight Date</td><td>Origin </td><td>Destination </td><td>Type </td></tr>";
                    for (var i = 0; i < ResultData.Table0.length; i++) {
                        tbl += "<tr><td>" + ResultData.Table0[i].AWBNo + "</td><td>" + ResultData.Table0[i].SLINo + "</td><td>" + ResultData.Table0[i].CustomerName + "</td><td>" + ResultData.Table0[i].FlightNo + "</td><td>" + ResultData.Table0[i].FlightDate + "</td><td>" + ResultData.Table0[i].Origin + "</td><td>" + ResultData.Table0[i].Destination + "</td><td><span>" + ResultData.Table0[i].IsImport + "</span><input type='radio' id='rblTrackType' name='rblTrackType' value='" + ResultData.Table0[i].SNo + "' checked='checked'/></td></tr>"
                        //tbl += "<tr><td>" + ResultData.Table0[i].AWBNo + "</td><td>" + ResultData.Table0[i].Origin + "</td><td>" + ResultData.Table0[i].Destination + "</td><td><span>" + ResultData.Table0[i].IsImport + "</span><input type='radio' id='rblAirWaybill' name='ProcesTrackType' value='0' checked='checked' onclick='CheckAWBRadio(\"ProcesTrackType\");' /></td></tr>"

                        //<input type='checkbox' id='chkbx" + i + "' name='chkbx" + i + "' value=" + ResultData.Table0[i].IsImport + ">
                    }
                    tbl += "<tr><td colspan='8'><input type='button' tabindex='3' value='Track' text='ProcessTrack' class='btn btn-success' onClick='ProcessTrackType()' id='btnTrack'></td></tr></thead></table>";
                    $("#divChoiceOfTracking").html(tbl);
                    cfi.PopUp("divChoiceOfTracking", "Tracking Type", "700");

                    //if (ResultData.Table0[0].Shipmenttype == "1") {
                    //    $("#trpcs").show();
                    //    $("#trpcsdata").show();

                    //    $("#trap").hide();
                    //    $("#trapdata").hide();

                    //    $("#transit").hide();
                    //    $("#transitdata").hide();
                    //}
                    //else if (ResultData.Table0[0].Shipmenttyp == "2") {
                    //    $("#trpcs").hide();
                    //    $("#trpcsdata").hide();

                    //    $("#trap").show();
                    //    $("#trapdata").show();

                    //    $("#transit").hide();
                    //    $("#transitdata").hide();
                    //}
                    //else if (ResultData.Table0[0].Shipmenttyp == "3")
                    //    {
                    $("#divTracking #trpcs").hide();
                    $("#divTracking #trpcsdata").hide();

                    $("#divTracking #trap").hide();
                    $("#divTracking #trapdata").hide();
                    // Chnage by Riyaz to hide transit data
                    //$("#divTracking #transit").show();
                    //$("#divTracking #transitdata").show();
                    $("#divTracking #transit").hide();
                    $("#divTracking #transitdata").hide();


                    // }

                }
                else {
                    $.ajax({
                        url: "Services/Shipment/TrackingService.svc/GetTracking?recid=" + AWBNo + "&Type=" + Type + "&TrackType=" + TrackType + "&AWBSNo=" + AWBSNo + "&TrackingType=" + trackingType,
                        type: "get",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            if (result != undefined) {

                                CreateProceeTracking(result);
                                var ob = result;

                                //if (ob.IsImportAWB == "False") {
                                //    $("#divTracking #trpcs").hide();
                                //    $("#divTracking #trpcsdata").hide();

                                //    $("#divTracking #trap").show();
                                //    $("#divTracking #trapdata").show();

                                //    $("#divTracking #transit").hide();
                                //    $("#divTracking #transitdata").hide();
                                //}
                                //else {
                                //    $("#divTracking #trpcs").show();
                                //    $("#divTracking #trpcsdata").show();

                                //    $("#divTracking #trap").hide();
                                //    $("#divTracking #trapdata").hide();

                                //    $("#divTracking #transit").hide();
                                //    $("#divTracking #transitdata").hide();
                                //}

                                TrackType = 1;
                                if ($("#divChoiceOfTracking").length != 0 && $("#divChoiceOfTracking").data("kendoWindow") != undefined) {
                                    $("#divChoiceOfTracking").data("kendoWindow").close();
                                }

                            }
                        }
                    });
                }
            }
        }
    });

}
function BindEDITrackingData() {
    var AWBPrefix = $("#EDIAWBPrefix").val();
    var AWBNumber = $("#EDIAWB").val();

    var AWBNo = AWBPrefix + "-" + AWBNumber;
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetTracking?recid=" + AWBNo,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                CreateEDITracking(result);

            }
        }
    });
}
function BindConsolidateTrackingData() {
    var AWBPrefix = $("#Text_ConAWBPrefix").val();
    var AWBNumber = $("#Text_ConAWB").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    if (AWBNo != "") {
        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetConsolidateTracking?recordID=" + AWBNo,
            type: "get",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined) {

                    CreateConsolidateTracking(result);

                    $('[id="tdmodule"]').show();
                }
            }
        });
    }


}
function CreateProceeTracking(result) {

    $('[id="tdmodule"]').show();
    var data = result.TrackingTrans;
    var tbl = '<fieldset><legend>Process Tracking:</legend><table id="tblTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblTransCreate").remove();
    if (result.AWB != null) {
        $("#divTracking #lblAWB").text(obj.AWB);
        $("#divTracking #lblAWB").bind("click", function () {
            LocationPopup(obj.AWBSNo, obj.IsImportAWB);
        });
        $("#divTracking #lblAWBDate").text(obj.AWBDate);
        $("#divTracking #lblSLI").text(obj.SLI);
        $("#divTracking #lblOrigin").text(obj.Origin);
        $("#divTracking #lblDestination").text(obj.Destination);
        $("#divTracking #lblTotalPieces").text(obj.TotalPieces);
        $("#divTracking #lblrecdpc").text(obj.ReceivedPieces);
        $("#divTracking #lblbalpc").text(obj.BalancePieces);
        $("#divTracking #lbldorecdpc").text(obj.DOReceivedPieces);
        $("#divTracking #lbldobalpc").text(obj.DOBalancePieces);
        $("#divTracking #lblGrossWt").text(obj.GrossWt);

        $("#divTracking #lblNatureOfGoods").text(obj.NatureOfGoods.toUpperCase());
        $("#divTracking #lblShipper").text('');
        $("#divTracking #lblConsignee").text('');
        $("#divTracking #lblBOE").text(obj.BOE);
        $("#divTracking #lblSHC").text(obj.SHC.substring(0, obj.SHC.length - 1));
        $("#divTracking #lblAWBType").text(obj.SLICustomerType);
        $("#divTracking #lblAWBType").text(obj.SLICustomerType);
        $("#divTracking #lblHAWB").text(obj.HAWB);
        $("#divTracking #lblAgentBuildUp").text(obj.IsAgentBuildUp == "True" ? "Yes" : "No");
        if ($("#divTracking #lblAgentBuildUp").text() == "Yes") {
            $("#divTracking #lblAgentBuildUp").attr("style", "color:red;font-weight:bold;");
        }
        $("#divTracking #lblOnHold").text(obj.OnHold == "True" ? "Yes" : "No");
        if ($("#divTracking #lblOnHold").text() == "Yes") {
            $("#divTracking #lblOnHold").attr("style", "color:red;font-weight:bold;cursor:pointer;");
        }
        else {
            $("#divTracking #lblOnHold").attr("style", "font-weight:bold;cursor:pointer;");
        }

        $("#divTracking #lblOnHold").bind("click", function () {
            AWBHoldPopup(obj.AWBSNo, obj.IsImportAWB);
        });

        //if (obj.IsImportAWB == "False") {
        //    $("#divTracking #trpcs").hide();
        //    $("#divTracking #trpcsdata").hide();

        //    $("#divTracking #trap").show();
        //    $("#divTracking #trapdata").show();

        //    $("#divTracking #transit").hide();
        //    $("#divTracking #transitdata").hide();
        //}
        //else {
        //    $("#divTracking #trpcs").show();
        //    $("#divTracking #trpcsdata").show();

        //    $("#divTracking #trap").hide();
        //    $("#divTracking #trapdata").hide();

        //    $("#divTracking #transit").hide();
        //    $("#divTracking #transitdata").hide();
        //}
        if (obj.Shipmenttype == "1") {
            $("#divTracking #trpcs").show();
            $("#divTracking #trpcsdata").show();

            $("#divTracking #trap").hide();
            $("#divTracking #trapdata").hide();

            $("#divTracking #transit").hide();
            $("#divTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "2") {
            $("#divTracking #trpcs").hide();
            $("#divTracking #trpcsdata").hide();

            $("#divTracking #trap").show();
            $("#divTracking #trapdata").show();

            $("#divTracking #transit").hide();
            $("#divTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "3") {
            $("#divTracking #trpcs").hide();
            $("#divTracking #trpcsdata").hide();

            $("#divTracking #trap").hide();
            $("#divTracking #trapdata").hide();

            // Chnage by Riyaz to hide transit data
            //$("#divTracking #transit").show();
            //$("#divTracking #transitdata").show();
            $("#divTracking #transit").hide();
            $("#divTracking #transitdata").hide();


        }

        var Ship = obj.Shipper.toUpperCase().split('<BR />');
        var Cong = obj.Consignee.toUpperCase().split('<BR />');
        $("#divTracking #lblShipperName").text(Ship[0]);
        $("#divTracking #lblShipperAddress").text(Ship[1] == undefined ? "" : Ship[1]);
        $("#divTracking #lblShipperEmail").text(Ship[2] == undefined ? "" : Ship[2] + ' , ' + Ship[3] == undefined ? "" : Ship[3]);

        $("#divTracking #lblConsigneeName").text(Cong[0]);
        $("#divTracking #lblConsigneeAddress").text(Cong[1] == undefined ? "" : Cong[1]);
        $("#divTracking #lblConsigneeEmail").text(Cong[2] == undefined ? "" : Cong[2] + ' , ' + Cong[3] == undefined ? "" : Cong[3]);

        $("#divTracking #lblAccepted").text(obj.AcceptedPieces);
        $("#divTracking #lblPlanned").text(obj.PlannedPieces);
        $("#divTracking #lblDeparted").text(obj.DepartedPieces);
        $("#divTracking #lblLying").text(obj.LyingPieces);
        $("#divTracking #lblLayingHeader").text('Lying at ' + userContext.AirportCode);

        tbl += "<thead><th> </th><th id='tdmodule'></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th>SLI</th><th> Date</th><th>Piece</th><th>Weight</th><th>Terminal</th><th>Event Details</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>Flight Info</th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].StageDate + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Pieces + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Weight + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Terminal + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + BindEventDetails(data[i].IsPopup, obj.AWBSNo, data[i].EventDetails, data[i].TrackingStagesSNo, obj.IsImportAWB) + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDateTime + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].FlightInfo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";

            tbl += "</tr>";
        }
        tbl += "</tbody></table></fieldset>";
        $("#divTrackingTrans").append(tbl);
        $('#divTracking').show();

    }
    else {
        $('#divTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }
}

function BindEventDetails(isPopup, awbSNo, eventDetails, trackingStageSNo, isImport) {
    if (isPopup) {
        return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + eventDetails + "\" onclick=\"BindEventDetailsPopup(this);\">" + eventDetails + "</a>";
    }
    else {
        return eventDetails;
    }
}

function BindEventDetailsPopup(that) {
    if ($(that).attr("data-Tstage") == "16" || $(that).attr("data-Tstage") == "55" || $(that).attr("data-Tstage") == "40") {
        LocationPopup($(that).attr("data-Awb"), $(that).attr("data-IsImportAWB"));
    }
    else if ($(that).attr("data-Tstage") == "38" || $(that).attr("data-Tstage") == "92") {
        HAWBPopup($(that).attr("data-Awb"), $(that).attr("data-IsImportAWB"), $(that).attr("data-event"));
    }
    else {

    }
}

function LocationPopup(AWBSNo, IsImport) {
    var tblLocation = '<tr><td class="formSection" colspan="3"><b>AWB Location</b></td></tr> <tr><td class="formtHeaderLabel">Pcs/ULD</td><td class="formtHeaderLabel">Location</td><td class="formtHeaderLabel">Movables</td></tr>';
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetLocationDetails?recordId=" + AWBSNo + "&IsImport=" + IsImport,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                var dataTableobj = JSON.parse(result);
                //SLI Location
                $(dataTableobj.Table0).each(function (i, e) {
                    tblLocation += "<tr>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.PieceNo + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.LocationName + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.ConsumablesName + "</td>";
                    tblLocation += "<tr>";
                });
                //AWB Location
                tblLocation += '<tr><td class="formSection" colspan="3"><b>SLI Location</b></td></tr> <tr><td class="formtHeaderLabel">Pcs/ULD</td><td class="formtHeaderLabel">Location</td><td class="formtHeaderLabel">Movables</td></tr>';
                $(dataTableobj.Table1).each(function (i, e) {
                    tblLocation += "<tr>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.PieceNo + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.LocationName + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.ConsumablesName + "</td>";
                    tblLocation += "<tr>";
                });
                //Add Popup Div
                $("head").after('<div id="divLocationWindow"><table class="WebFormTable">' + tblLocation + '</table></div>');
                //Show Popup
                $("#divLocationWindow").dialog(
                     {
                         autoResize: true,
                         maxWidth: 1300,
                         maxHeight: 800,
                         width: 800,
                         height: 500,
                         modal: true,
                         title: 'Warehouse Location',
                         draggable: true,
                         resizable: true,
                         buttons: {
                             Cancel: function () {
                                 $(this).dialog("close");
                             }
                         },
                         close: function () {
                             $(this).dialog("close");
                         }
                     });
            }
        }
    });
}

// To get HAWB Details
function HAWBPopup(AWBSNo, IsImport, HAWBNo) {
    var tblHAWB = '<tr><td class="formSection" colspan="7"><b>HAWB Details</b></td></tr> <tr><td class="formtHeaderLabel">HAWB No</td><td class="formtHeaderLabel">Received/Total Pieces</td><td class="formtHeaderLabel">Gross Weight</td><td class="formtHeaderLabel">Nature of Goods</td><td class="formtHeaderLabel">SHC</td><td class="formtHeaderLabel">HAWB CONSIGNEE</td><td class="formtHeaderLabel">MAWB CONSIGNEE</td></tr>';
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetHAWBDetails?recordId=" + AWBSNo + "&IsImport=" + IsImport + "&HAWBNo=" + HAWBNo,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                var dataTableobj = JSON.parse(result);
                //HAWB Details Location
                $(dataTableobj.Table0).each(function (i, e) {
                    tblHAWB += "<tr>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.HAWBNo + "</td>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.TotalPieces + "</td>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.TotalGrossWeight + "</td>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.CommodityDescription + "</td>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.SHC + "</td>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.HAWBCONSIGNEE + "</td>";
                    tblHAWB += "<td class=\"formHeaderTranscolumn\">" + e.MAWBCONSIGNEE + "</td>";
                    tblHAWB += "<tr>";
                });

                //Add Popup Div
                $("head").after('<div id="divHAWBWindow"><table class="WebFormTable">' + tblHAWB + '</table></div>');
                //Show Popup
                $("#divHAWBWindow").dialog(
                     {
                         autoResize: true,
                         maxWidth: 1300,
                         maxHeight: 800,
                         width: 800,
                         height: 500,
                         modal: true,
                         title: 'HAWB Details',
                         draggable: true,
                         resizable: true,
                         buttons: {
                             Cancel: function () {
                                 $(this).dialog("close");
                             }
                         },
                         close: function () {
                             $(this).dialog("close");
                         }
                     });
            }
        }
    });
}

function AWBHoldPopup(AWBSNo, IsImport) {
    var tblLocation = '<tr><td class="formSection" colspan="8"><b>Hold Type</b></td></tr>'
        + '<tr><td class="formtHeaderLabel">Hold Type</td>'
        + '<td class="formtHeaderLabel">Hold Pieces</td>'
        + '<td class="formtHeaderLabel">Remarks</td>'
        + '<td class="formtHeaderLabel">Unhold</td>'
        + '<td class="formtHeaderLabel">Unhold Remarks</td>'
        + '<td class="formtHeaderLabel">Unhold Type</td>'
        + '<td class="formtHeaderLabel">Unhold On</td>'
        + '<td class="formtHeaderLabel">Unhold By</td>'
        + '</tr>';
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetAWBHoldDetails?recordId=" + AWBSNo + "&IsImport=" + IsImport,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                var dataTableobj = JSON.parse(result);
                //Hold Type
                $(dataTableobj.Table0).each(function (i, e) {
                    tblLocation += "<tr>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.HoldType + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.HoldPieces + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.HoldRemarks + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.Unhold + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.UnholdRemarks + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.UnholdType + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.UnholdOn + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.UnholdBy + "</td>";
                    tblLocation += "<tr>";
                });

                //Add Popup Div
                $("head").after('<div id="divLocationWindow"><table class="WebFormTable">' + tblLocation + '</table></div>');
                //Show Popup
                $("#divLocationWindow").dialog(
                     {
                         autoResize: true,
                         maxWidth: 1300,
                         maxHeight: 800,
                         width: 800,
                         height: 500,
                         modal: true,
                         title: 'AWB Hold',
                         draggable: true,
                         resizable: true,
                         buttons: {
                             Cancel: function () {
                                 $(this).dialog("close");
                             }
                         },
                         close: function () {
                             $(this).dialog("close");
                         }
                     });
            }
        }
    });
}

function CreateEDITracking(result) {
    var data = result.TrackingTrans;
    var tbl = '<table id="tblTrans" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblTrans").remove();
    if (result.AWB != null) {
        $("#lblAWB").text(obj.AWB);
        $("#lblAWBDate").text(obj.AWBDate);
        $("#lblSLI").text(obj.SLI);
        $("#lblOrigin").text(obj.Origin);
        $("#lblDestination").text(obj.Destination);
        $("#lblTotalPieces").text(obj.TotalPieces);
        $("#lblGrossWt").text(obj.GrossWt);

        $("#lblrecdpc").text(obj.ReceivedPieces);
        $("#lblbalpc").text(obj.BalancePieces);
        $("#lbldorecdpc").text(obj.DOReceivedPieces);
        $("#lbldobalpc").text(obj.DOBalancePieces);

        $("#lblNatureOfGoods").text(obj.NatureOfGoods.toUpperCase());
        $("#lblShipper").text('');
        $("#lblConsignee").text('');
        $("#lblBOE").text(obj.BOE);
        var Ship = obj.Shipper.toUpperCase().split('<BR />');
        var Cong = obj.Consignee.toUpperCase().split('<BR />');
        $("#lblShipperName").text(Ship[0]);
        $("#lblShipperAddress").text(Ship[1]);
        $("#lblShipperEmail").text(Ship[2] + ' , ' + Ship[3]);

        $("#lblConsigneeName").text(Cong[0]);
        $("#lblConsigneeAddress").text(Cong[1]);
        $("#lblConsigneeEmail").text(Cong[2] + ' , ' + Cong[3]);

        // tbl += "<thead><th> </th><th id='tdmodule'></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th>SLI</th><th> Date</th><th>Piece</th><th>Weight</th><th>Terminal</th><th>Event Details</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>Flight Info</th><th>User ID</th></thead><tbody>"
        tbl += "<tr class='ui-widget-header'><th id='tdmodule'>Date</th><th>Carrier</th><th> Type</th><th>Message Type</th><th>AWBNo/FlightNo</th><th>Status</th><th>Reason</th><th>Sender/Receiver</th><th>Received Date/Sender Date</th></tr>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%;'><input type='hidden' id='hdnSequenceNo' value = '" + data[i].TrackingStagesSNo + "'></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%;'>" + data[i].StageName + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].StageDate + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Pieces + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Weight + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Terminal + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDetails + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDateTime + "</td>";
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].FlightInfo + "</td>";
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";

            tbl += "</tr>";
        }
        //debugger
        tbl += "</table>";
        $("#divEDITrackingTrans").append(tbl);
        $('#divEDITracking').show();

    }
    else {
        $('#divEDITracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Record Not Found.", "bottom-left");
        return false;
    }
}
function CreateConsolidateTracking(result) {

    var data = result.TrackingTrans;
    var tbl = '<fieldset><legend>Consolidated Tracking:</legend><table id="tblConTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblConTransCreate").remove();

    if (result.AWB != null) {
        $("#divConTracking #lblAWB").text(obj.AWB);
        $("#divConTracking #lblAWB").bind("click", function () {
            LocationPopup(obj.AWBSNo, obj.IsImportAWB);
        });
        $("#divConTracking #lblAWBDate").text(obj.AWBDate);
        $("#divConTracking #lblSLI").text(obj.SLI);
        $("#divConTracking #lblOrigin").text(obj.Origin);
        $("#divConTracking #lblDestination").text(obj.Destination);
        $("#divConTracking #lblTotalPieces").text(obj.TotalPieces);
        $("#divConTracking #lblGrossWt").text(obj.GrossWt);

        $("#divConTracking #lblrecdpc").text(obj.ReceivedPieces);
        $("#divConTracking #lblbalpc").text(obj.BalancePieces);
        $("#divConTracking #lbldorecdpc").text(obj.DOReceivedPieces);
        $("#divConTracking #lbldobalpc").text(obj.DOBalancePieces);

        $("#divConTracking #lblNatureOfGoods").text(obj.NatureOfGoods.toUpperCase());
        $("#divConTracking #lblShipper").text('');
        $("#divConTracking #lblConsignee").text('');
        $("#divConTracking #lblBOE").text(obj.BOE);
        $("#divConTracking #lblSHC").text(obj.SHC.substring(0, obj.SHC.length - 1));
        $("#divConTracking #lblAWBType").text(obj.SLICustomerType);
        $("#divConTracking #lblHAWB").text(obj.HAWB);
        $("#divConTracking #lblAgentBuildUp").text(obj.IsAgentBuildUp == "True" ? "Yes" : "No");
        if ($("#divConTracking #lblAgentBuildUp").text() == "Yes") {
            $("#divConTracking #lblAgentBuildUp").attr("style", "color:red;font-weight:bold;");
        }
        $("#divConTracking #lblOnHold").text(obj.OnHold == "True" ? "Yes" : "No");
        if ($("#divConTracking #lblOnHold").text() == "Yes") {
            $("#divConTracking #lblOnHold").attr("style", "color:red;font-weight:bold;cursor:pointer;");
        }
        else {
            $("#divConTracking #lblOnHold").attr("style", "font-weight:bold;cursor:pointer;");
        }

        if (obj.Shipmenttype == "1") {
            $("#divConTracking #trpcs").show();
            $("#divConTracking #trpcsdata").show();

            $("#divConTracking #trap").hide();
            $("#divConTracking #trapdata").hide();

            $("#divConTracking #transit").hide();
            $("#divConTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "2") {
            $("#divConTracking #trpcs").hide();
            $("#divConTracking #trpcsdata").hide();

            $("#divConTracking #trap").show();
            $("#divConTracking #trapdata").show();

            $("#divConTracking #transit").hide();
            $("#divConTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "3") {
            // Chnage by Riyaz to hide transit data
            //$("#divConTracking #transit").show();
            //$("#divConTracking #transitdata").show();
            $("#divConTracking #transit").hide();
            $("#divConTracking #transitdata").hide();

            $("#divConTracking #trpcs").hide();
            $("#divConTracking #trpcsdata").hide();

            $("#divConTracking #trap").hide();
            $("#divConTracking #trapdata").hide();
        }



        $("#divConTracking #lblOnHold").bind("click", function () {
            AWBHoldPopup(obj.AWBSNo, obj.IsImportAWB);
        });

        var Ship = obj.Shipper.toUpperCase().split('<BR />');
        var Cong = obj.Consignee.toUpperCase().split('<BR />');
        $("#divConTracking #lblShipperName").text(Ship[0]);
        $("#divConTracking #lblShipperAddress").text(Ship[1] == undefined ? "" : Ship[1]);
        $("#divConTracking #lblShipperEmail").text(Ship[2] == undefined ? "" : Ship[2] + ' , ' + Ship[3] == undefined ? "" : Ship[3]);

        $("#divConTracking #lblConsigneeName").text(Cong[0]);
        $("#divConTracking #lblConsigneeAddress").text(Cong[1] == undefined ? "" : Cong[1]);
        $("#divConTracking #lblConsigneeEmail").text(Cong[2] == undefined ? "" : Cong[2] + ' , ' + Cong[3] == undefined ? "" : Cong[3]);

        $("#divConTracking #lblAccepted").text(obj.AcceptedPieces);
        $("#divConTracking #lblPlanned").text(obj.PlannedPieces);
        $("#divConTracking #lblDeparted").text(obj.DepartedPieces);
        $("#divConTracking #lblLying").text(obj.LyingPieces);
        $("#divConTracking #lblLayingHeader").text('Lying at ' + userContext.AirportCode);

        tbl += "<thead><th> </th><th id='tdmodule'></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th>SLI</th><th> Date</th><th>Piece</th><th>Weight</th><th>Terminal</th><th>Event Details</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>Flight Info</th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].StageDate + "</td>";
            if (data[i].StageName.toUpperCase() == "EDI MESSAGE" || data[i].StageName.toUpperCase() == "INBOUND") {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'></td>";
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'></td>";
            } else {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Pieces + "</td>";
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Weight + "</td>";
            }
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Terminal + "</td>";
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDetails + "</td>";
            if (data[i].StageName.toUpperCase() == "EDI MESSAGE" || data[i].StageName.toUpperCase() == "INBOUND") {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';><a href=\"#\" style=\"width: 50px;color: rgb(0, 0, 255);\" onclick=\"BindActualMessagePopup(this);return false;\">" + data[i].EventDetails + "</a><input type='hidden' id='hdnActualMessage' value ='" + data[i].ActualMessage + "'></td>";
            } else {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + BindEventDetails(data[i].IsPopup, obj.AWBSNo, data[i].EventDetails, data[i].TrackingStagesSNo, obj.IsImportAWB) + "</td>";
            }
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDateTime + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].FlightInfo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";

            tbl += "</tr>";
        }
        tbl += "</tbody></table></fieldset>";
        $("#divConTrackingTrans").append(tbl);
        $('#divConTracking').show();

    }
    else {
        $('#divConTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }
}
function BindActualMessagePopup(obj) {
    $("#tblMessageType").find("div").remove();
    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $(obj).closest("td").find("input[type=hidden]").val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
    //cfi.PopUp("tblMessageType", "Message Type Details", "500");

    if (!$("#tblMessageType").data("kendoWindow"))
        cfi.PopUp("tblMessageType", "Message Type Details", "500");
    else
        $("#tblMessageType").data("kendoWindow").open();

}
function ProcessTrackType() {
    var selected = [];
    var Export = 0;
    var Import = 0;
    AWBSNo = $('input[name=rblTrackType]:checked').val();
    //$("[id^='chkbx']").each(function (index,element) {
    //    if ($(element).is(":checked")) {
    //        if ($(this).attr('value') == "Export") {
    //            Export = Export + 1;
    //        }
    //        if ($(this).attr('value') == "Import") {
    //            Import = Import + 1;
    //        }
    //    }
    //});
    //if (Export == 1 && Import == 0) {
    //    TrackType = 1;
    //}
    //if (Import == 1 && Export == 0) {
    //    TrackType = 2;
    //}
    //if (Export == 1 && Import == 1) {
    //    TrackType = 3;
    //}
    //if (Export==2) {
    TrackType = 2;
    // }
    ProcessTrack();
}

function CreateHistoryTracking(result) {

    var data = result.TrackingTrans;
    var tbl = '<fieldset><legend>History Tracking:</legend><table id="tblHistoryTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblHistoryTransCreate").remove();
    if (result.AWB != null) {
        $("#divHistoryTracking #lblAWB").text(obj.AWB);
        $("#divHistoryTracking #lblAWBDate").text(obj.AWBDate);
        $("#divHistoryTracking #lblSLI").text(obj.SLI);
        $("#divHistoryTracking #lblOrigin").text(obj.Origin);
        $("#divHistoryTracking #lblDestination").text(obj.Destination);
        $("#divHistoryTracking #lblTotalPieces").text(obj.TotalPieces);
        $("#divHistoryTracking #lblGrossWt").text(obj.GrossWt);



        $("#divHistoryTracking #lblrecdpc").text(obj.ReceivedPieces);
        $("#divHistoryTracking #lblbalpc").text(obj.BalancePieces);
        $("#divHistoryTracking #lbldorecdpc").text(obj.DOReceivedPieces);
        $("#divHistoryTracking #lbldobalpc").text(obj.DOBalancePieces);

        $("#divHistoryTracking #lblNatureOfGoods").text(obj.NatureOfGoods.toUpperCase());
        $("#divHistoryTracking #lblShipper").text('');
        $("#divHistoryTracking #lblConsignee").text('');
        $("#divHistoryTracking #lblBOE").text(obj.BOE);
        $("#divHistoryTracking #lblSHC").text(obj.SHC.substring(0, obj.SHC.length - 1));

        var Ship = obj.Shipper.toUpperCase().split('<BR />');
        var Cong = obj.Consignee.toUpperCase().split('<BR />');
        $("#divHistoryTracking #lblShipperName").text(Ship[0]);
        $("#divHistoryTracking #lblShipperAddress").text(Ship[1] == undefined ? "" : Ship[1]);
        $("#divHistoryTracking #lblShipperEmail").text(Ship[2] == undefined ? "" : Ship[2] + ' , ' + Ship[3] == undefined ? "" : Ship[3]);

        $("#divHistoryTracking #lblConsigneeName").text(Cong[0]);
        $("#divHistoryTracking #lblConsigneeAddress").text(Cong[1] == undefined ? "" : Cong[1]);
        $("#divHistoryTracking #lblConsigneeEmail").text(Cong[2] == undefined ? "" : Cong[2] + ' , ' + Cong[3] == undefined ? "" : Cong[3]);


        if (obj.Shipmenttype == "1") {
            $("#divHistoryTracking #trpcs").show();
            $("#divHistoryTracking #trpcsdata").show();

            $("#divHistoryTracking #trap").hide();
            $("#divHistoryTracking #trapdata").hide();

            $("#divHistoryTracking #transit").hide();
            $("#divHistoryTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "2") {
            $("#divHistoryTracking #trpcs").hide();
            $("#divHistoryTracking #trpcsdata").hide();

            $("#divHistoryTracking #trap").show();
            $("#divHistoryTracking #trapdata").show();

            $("#divHistoryTracking #transit").hide();
            $("#divHistoryTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "3") {
            $("#divHistoryTracking #trpcs").hide();
            $("#divHistoryTracking #trpcsdata").hide();

            $("#divHistoryTracking #trap").hide();
            $("#divHistoryTracking #trapdata").hide();

            // Chnage by Riyaz to hide transit data
            //$("#divHistoryTracking #transit").show();
            //$("#divHistoryTracking #transitdata").show();
            $("#divHistoryTracking #transit").hide();
            $("#divHistoryTracking #transitdata").hide();


        }
        tbl += "<thead><th> </th><th></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th>SLI</th><th> Date</th><th>Piece</th><th>Weight</th><th>Terminal</th><th>Event Details</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>Flight Info</th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].StageDate + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Pieces + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Weight + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Terminal + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDetails + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDateTime + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].FlightInfo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";

            tbl += "</tr>";
        }
        tbl += "</tbody></table></fieldset>";
        $("#divHistoryTrackingTrans").append(tbl);
        $('#divHistoryTracking').show();

    }
    else {
        $('#divHistoryTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }
}
function CheckAWBRadio(ProcessName) {
    if ($("input[name='" + ProcessName + "']:checked").val() == 1) {
        if (ProcessName == 'EDITrackType')
            $("#EDIAWBPrefix").hide();
        else if (ProcessName == 'ConsolidatedTrackType')
            $("#ConAWBPrefix").hide();
        else {
            $("#spnAWBPrefix").hide();
            //$("#Text_AWBPrefix").val('');
            var data = GetDataSource("AWB", "vwSLITracking", "SLINo", "SLINo", ["SLINo"], null);
            cfi.ChangeAutoCompleteDataSource("AWB", data, true, null, "SLINo", "contains");
        }
    }
    else {
        if (ProcessName == 'EDITrackType')
            $("#EDIAWBPrefix").show();
        else if (ProcessName == 'ConsolidatedTrackType')
            $("#ConAWBPrefix").show();
        else {
            $("#spnAWBPrefix").show();
            var data = GetDataSource("AWB", "vwAWBNumber", "AWBNumber", "AWBNumber", ["AWBNumber"], null);
            cfi.ChangeAutoCompleteDataSource("AWB", data, true, null, "AWBNumber", "contains");

        }
    }
}

function ProcessTrack() {
    $('#divTrackingTrans').html('');
    var AWBPrefix = $("#Text_AWBPrefix").val();
    var AWBNumber = $("#Text_AWB").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    var trackingType = $("input[name=TrackingHistoryAWB]:checked").val();

    var Type = $("input[name='ProcesTrackType']:checked").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    if (Type == "1") {
        AWBNo = AWBNumber;
    }
    if (AWBNumber.length != 8) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        $('#divTracking').hide();

        $("#tblTrans").remove();
        return false;
    }
    if (AWBNo != "") {
        $.ajax({
            url: 'HtmlFiles/Shipment/Tracking/Tracking.html',
            success: function (result) {

                $('#divTracking').html(result);
                $('#divTracking').hide();
                BindProceeTrackingData();
            }
        });
    }
    else {
        $('#divTracking').hide();
        $("#tblTrans").remove();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }


}

function EDITrack() {
    // $('#divTrackingTrans').html('');
    //BindProceeTrackingData();
    $("#tbltracking").show();
    var AWBPrefix = $("#Text_EDIAWBPrefix").val();
    var AWBNumber = $("#Text_EDIAWB").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    //GetAwbtrackingData(AWBNo);
    if (AWBNumber.length != 8) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        $('#divEDITracking').hide();

        $("#tblTrans").remove();
        return false;
    }
    if (AWBPrefix != "" && AWBNumber != "") {
        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetAWBRecord",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AWBNo: AWBNo }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                if (dataTableobj.Table0.length > 0) {
                    $('#tbltracking').appendGrid('load', dataTableobj.Table0);
                    $('#divEDITracking').html(tbltracking);
                }
                else
                    ShowMessage('warning', 'Warning - EDI Tracking!', "Record Not Found !");
            },
            //error: function (err) {
            //    alert("Generated Error");
            //}
        });
        //$.ajax({
        //    url: "../../Services/Shipment/TrackingService.svc",
        //    success: function (result) {

        //        $('#divEDITracking').html(result);
        //        $('#divEDITracking').hide();
        //        BindEDITrackingData();
        //    }
        //});
    }
    //else {
    //    $('#divEDITracking').hide();
    //    $("#tblTrans").remove();
    //    ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
    //    return false;
    //}

}
function ConsolidateTrack() {

    $('#divConTrackingTrans').html('');
    var AWBPrefix = $("#Text_ConAWBPrefix").val();
    var AWBNumber = $("#Text_ConAWB").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;


    if (AWBNumber.length != 8) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        $('#divConTracking').hide();

        $("#tblTrans").remove();
        return false;
    }
    if (AWBNo != "") {
        $.ajax({
            url: 'HtmlFiles/Shipment/Tracking/Tracking.html',
            success: function (result) {

                $('#divConTracking').html(result);
                $('#divConTracking').hide();
                BindConsolidateTrackingData();
                //BindProceeTrackingData();
            }
        });
    }
    else {
        $('#divConTracking').hide();
        $("#tblTrans").remove();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }

}

function FlightTrack() {
    $("#tblFtracking").show();
    var FlightNo = $("#Text_FlightNo").val();
    var FlightDate = $("#txtFlightdate").val();
    var Origin = "";//$("#Text_FlightOrigin").val().split("-")[0];
    var Destination = "";//$("#Text_FlightDestination").val().split("-")[0];
    var trackingType = $("input[name=TrackingHistoryFlight]:checked").val();

    if (FlightNo != "" && FlightDate != "") {
        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetFlightRecord",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, Origin: Origin, Destination: Destination, TrackingType: trackingType }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                if (dataTableobj.Table0.length > 0) {
                    $('#tblFtracking').appendGrid('load', dataTableobj.Table0);
                    $("#divFlightTracking").html(tblFtracking);


                }
                else
                    ShowMessage('warning', 'Warning - Flight Tracking!', "Record Not Found!");
            },
            error: function (err) {
                alert("Generated Error");
            }
        });

    }
    else {
        $("#tblFtracking").hide();
        ShowMessage('warning', 'Warning - Flight Tracking!', "Flight No and Flight Date are mandatory!")
    }
}
function HistoryTrack() {
    $('#divHistoryTrackingTrans').html('');
    var AWBPrefix = $("#Text_HistoryAWBPrefix").val();
    var AWBNumber = $("#Text_HistoryAWB").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;

    //var Type = $("input[name='ProcesTrackType']:checked").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    //if (Type == "1") {
    //    AWBNo = AWBNumber;
    //}
    if (AWBNumber.length != 8) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        $('#divTracking').hide();

        $("#tblTrans").remove();
        return false;
    }
    if (AWBNo != "") {
        $.ajax({
            url: 'HtmlFiles/Shipment/Tracking/Tracking.html',
            success: function (result) {

                $('#divHistoryTracking').html(result);
                $('#divHistoryTracking').hide();
                BindHistoryTrackingData();
            }
        });
    }
    else {
        $('#divHistoryTracking').hide();
        $("#tblHistoryTrans").remove();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }

}
var f = -1;
function sortTable() {
    f = f == -1 ? 1 : -1;
    var row = $("#tblTransCreate tbody tr").get();
    $("#tblTransCreate tbody tr").remove();
    row.sort(function (a, b) {

        var A = getVal(a);
        var B = getVal(b);
        if (A < B) {
            return -1 * f;
        }
        if (A > B) {
            return 1 * f;
        }
        return 0;
    });

    // $("#tblTransCreate tbody tr").remove();
    $.each(row, function (index, row) {
        $("#tblTransCreate").children('tbody').append(row);
    });
}
function getVal(elm) {
    var v = $(elm).find("td:eq(1)").find("input").val();
    if ($.isNumeric(v)) {
        v = parseInt(v, 10);
    }
    return v;
}


var f = -1;
function sortDate() {
    f = f == -1 ? 1 : -1;
    var row = $("#tblTransCreate tbody tr").get();
    $("#tblTransCreate tbody tr").remove();
    row.sort(function (a, b) {

        var A = getVals(a);
        var B = getVals(b);
        if (A < B) {
            return -1 * f;
        }
        if (A > B) {
            return 1 * f;
        }
        return 0;
    });

    // $("#tblTransCreate tbody tr").remove();
    $.each(row, function (index, row) {
        $("#tblTransCreate").children('tbody').append(row);
    });
}
function getVals(elm) {
    var v = $(elm).find("td:eq(9)").text();
    if ($.isNumeric(v)) {
        v = parseInt(v, 10);
    }
    return v;
}

function ChangeColor(obj) {
    $(obj).css("background-color", "#ddcff8");
}
function OriginalColor(obj) {
    $(obj).css("background-color", "#f5f7f8");
}

function GetFlightGrid() {
    $("#tblFtracking").appendGrid({
        caption: 'Flight Tracking',
        captionTooltip: 'Flight Tracking',
        columns: [{ name: 'SNo', type: 'hidden' },
                  //{ name: 'TrackingStagesSNo', display: 'Tracking Stages No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'Destination', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'StageName', display: 'Flight Stage', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'StageDate', display: 'Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                    { name: 'WaybillCount', display: 'Air Waybill Count', type: 'label', isRequired: false },
                    { name: 'ULDCount', display: 'ULD Count', type: 'label', isRequired: false },
                    {
                        name: 'MessageType', display: 'Message Type', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {

                            $("#txtMessageType").remove();
                            $('#Re_execute').remove();
                            cfi.PopUp("tblMessageType", "Message Type Details", "500");
                            //$("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
                            if ($("#tbltracking_Status_" + (i + 1)).text() == 'Failed') {
                                $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
                            }
                            else {

                                $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
                            }
                        }
                    },
                    { name: 'GrossWeight', display: 'Gross Weight', type: 'label', isRequired: false },
                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'label', isRequired: false },
                    { name: 'CBM', display: 'CBM', type: 'label', isRequired: false },
                    //{ name: 'Terminal', display: 'Terminal', type: 'label', isRequired: false },
                    { name: 'EventDetails', display: 'Event Details', type: 'label', isRequired: false },

                    { name: 'EventDateTime', display: 'Event Date/Time', type: 'label', isRequired: false },
                    { name: 'UserID', display: 'User', type: 'label', isRequired: false }],
        dataLoaded: function () {
            $("tr[id^='tblFtracking_Row']").each(function (indexInArray, valueOfElement) {
                debugger;
                var cntrl = $("#tblFtracking_EventDetails_" + (indexInArray + 1));
                //var $input = $("<span>", { val: $(cntrl).text(), id: cntrl, type: "textarea", style: "width:200px;height:50px;background-color:white; ", disabled: 1 });
                //$(cntrl).replaceWith($input);
                $(cntrl).replaceWith("<span id='" + $(cntrl).attr("id") + "' style='word-wrap:break-word; display:block; width:330px;text-align:left'>" + $(cntrl).text().replace(/,/g, "<br>") + "</span>");
            });
        },
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }
    });
}

function ExtraCondition(textId) {

    var filterTracking = cfi.getFilter("AND");
    if (textId == "Text_FlightNo") {
        cfi.setFilter(filterTracking, "FlightDate", "eq", $("#txtFlightdate").val())
        var DestinationCountryAutoCompleteFilter1 = cfi.autoCompleteFilter([filterTracking]);
        return DestinationCountryAutoCompleteFilter1;
    }
    else if (textId == "Text_FlightOrigin") {
        cfi.setFilter(filterTracking, "AirportCode", "neq", $("#Text_FlightDestination").val().split("-")[0])
        var OriginGlobalZoneAutoCompleteFilter4 = cfi.autoCompleteFilter([filterTracking]);
        return OriginGlobalZoneAutoCompleteFilter4;
    }
    else if (textId == "Text_FlightDestination") {
        cfi.setFilter(filterTracking, "AirportCode", "neq", $("#Text_FlightOrigin").val().split("-")[0])

        var DestinationGlobalZoneAutoCompleteFilter5 = cfi.autoCompleteFilter([filterTracking]);
        return DestinationGlobalZoneAutoCompleteFilter5;
    }
    else if (textId == "Text_AWB") {
        cfi.setFilter(filterTracking, "AWBPrefix", "neq", 'SLI')
        cfi.setFilter(filterTracking, "AWBPrefix", "contains", $("#Text_AWBPrefix").val())
        // cfi.setFilter(filterTracking, "AWB", "eq", $("#Text_AWB").val())
        var AWBAutoCompleteFilter = cfi.autoCompleteFilter([filterTracking]);
        return AWBAutoCompleteFilter;
    }
}
function SetDateRangeValue() {

    $("#Text_FlightNo").val('');
    $("#Text_FlightOrigin").val('');
    $("#Text_FlightDestination").val('');
}
GetDataSource = function (textId, tableName, keyColumn, textColumn, templateColumn, procName) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 25,
        transport: {
            read: {
                url: "Services/AutoCompleteService.svc/AutoCompleteDataSource",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

function ULDTrack() {
    $("#tblULDtracking").show();
    var ULDStockSNo = $("#ULDNo").val();
    var trackingType = $("input[name='TrackingHistoryULD']:checked").val();

    if ((ULDStockSNo || 0) != 0) {
        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetULDRecord",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ uldStockSNo: ULDStockSNo, TrackingType: trackingType }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                debugger
                var dataTableobj = JSON.parse(result);
                if (dataTableobj.Table0.length > 0) {
                    GetULDDetails();
                    $("#lblULDCode").html(dataTableobj.Table0[0].ULDCode);
                    $("#lblULDNo").html(dataTableobj.Table0[0].ULDNo);
                    $("#lblContainerType").html(dataTableobj.Table0[0].ULDContainerType);
                    $("#lblCityCode").html(dataTableobj.Table0[0].City);
                    $("#lblAirlineCode").html(dataTableobj.Table0[0].Airline);
                    $("#lblTareWeight").html(dataTableobj.Table0[0].TareWeight);
                    $("#lblGross").html(dataTableobj.Table0[0].GrossCapacity);
                    $("#lblVolume").html(dataTableobj.Table0[0].VolumeCapacity);
                }
                if (dataTableobj.Table1.length > 0) {
                    GetULDGrid();
                    $('#tblULDtracking').appendGrid('load', dataTableobj.Table1);

                }
                else
                    ShowMessage('warning', 'Warning - ULD Tracking!', "Record Not Found!");
            },
            //error: function (err) {
            //    alert("Generated Error");
            //}
        });
    }
    else {
        $('#divTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct ULD No.", "bottom-left");
        return false;
    }
}

function GetULDGrid() {
    $("#tblULDtracking").appendGrid({
        caption: 'ULD Tracking',
        captionTooltip: 'ULD Tracking',
        columns: [{ name: 'SNo', type: 'hidden' },
                  //{ name: 'TrackingStagesSNo', display: 'Tracking Stages No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                  { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'FlightDate', display: 'Date', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'CityCode', display: 'Origin', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'DestinationCity', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'StageName', display: 'ULD Stage', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'StageDate', display: 'Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                    { name: 'WaybillCount', display: 'Air Waybill Count', type: 'label', isRequired: false },
                    { name: 'GrossWeight', display: 'Gross Weight', type: 'label', isRequired: false },
                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'label', isRequired: false },
                    //{ name: 'Terminal', display: 'Terminal', type: 'label', isRequired: false },
                    { name: 'EventDetails', display: 'Event Details', type: 'label', isRequired: false },

                    { name: 'EventDateTime', display: 'Event Date/Time', type: 'label', isRequired: false },
                    { name: 'UserID', display: 'User', type: 'label', isRequired: false }],
        //dataLoaded: function () {
        //    $("tr[id^='tblFtracking_Row']").each(function (indexInArray, valueOfElement) {
        //        debugger;
        //        var cntrl = $("#tblFtracking_EventDetails_" + (indexInArray + 1));
        //        //var $input = $("<span>", { val: $(cntrl).text(), id: cntrl, type: "textarea", style: "width:200px;height:50px;background-color:white; ", disabled: 1 });
        //        //$(cntrl).replaceWith($input);
        //        $(cntrl).replaceWith("<span id='" + $(cntrl).attr("id") + "' style='word-wrap:break-word; display:block; width:330px;text-align:left'>" + $(cntrl).text().replace(/,/g, "<br>") + "</span>");
        //    });
        //},
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }
    });
}
function GetULDDetails() {
    $.ajax({
        url: 'HtmlFiles/Shipment/Tracking/ULDTracking.html',
        async: false,
        success: function (result) {
            $('#divULDTracking').html(result);
        }
    });
}
//function GetAwbtrackingData(obj)
//{
//    var dbtableName = "AwbData";
//    $('#tbl' + dbtableName).appendGrid({
//        tableID: 'tbl' + dbtableName,
//        //contentEditable: pageType == 'EDIT',
//        tableColume: 'SNo,AWBNo,FlightNo,FlightDate,Carrier,CityCode,MessageType,Status,EventType,Reason,ActualMessage,SenderID,EventDate',
//        masterTableSNo: $('#hdnOfficeCommisionSNo').val(),
//        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: '',
//        servicePath: '/Services/Shipment/TrackingService.svc',
//        getRecordServiceMethod: 'GetAWBRecord',
//        createUpdateServiceMethod: 'CreateUpdate' + dbtableName,
//        deleteServiceMethod: 'Delete' + dbtableName,
//        caption: 'GSA Commission',
//        isGetRecord: true,
//        initRows: 1,
//        columns: [{ name: 'SNo', type: 'hidden' },
//                  { name: 'AWBNo', display: 'AWBNo', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//        { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//        { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
//        { name: 'Carrier', display: 'Carrier', type: 'label', isRequired: false },
//        { name: 'CityCode', display: 'Airport', type: 'label', isRequired: false },
//        {
//            name: 'MessageType', display: 'Message Type', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {

//                $("#txtMessageType").remove();
//                $('#Re_execute').remove();
//                cfi.PopUp("tblMessageType", "Message Type Details", "500");
//                //$("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
//                if ($("#tbltracking_Status_" + (i + 1)).text() == 'Failed')
//                {
//                    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
//                }
//                else {

//                    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
//                }
//            }
//        },
//        { name: 'Status', display: 'Status', type: 'label', isRequired: false },
//        { name: 'EventType', display: 'Event Type', type: 'label', isRequired: false }, 
//        { name: 'Reason', display: 'Reason', type: 'label', isRequired: false },
//        { name: 'ActualMessage', type: 'hidden', id: 'hdnActualMessage' },
//        { name: 'SenderID', display: 'Sender/Receiver', type: 'label', isRequired: false },
//        { name: 'EventDate', display: 'Received Date/Sender Date', type: 'label', isRequired: false }],
//        isPaging: false,
//        hideButtons: {
//            remove: false,
//            removeLast: false,
//            insert: false,
//            append: false,
//            updateAll: false

//        }
//    });
//}