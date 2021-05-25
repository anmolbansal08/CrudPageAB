//updated by tarun k singh 06/11/17
//added uld station in uldtracking
TrackType = 1;
AWBSNo = 0;

var oldModel = null;
var prevColors = [];

//<script type='text/javascript' src='Scripts/jquery-1.7.2.js'></script>



$(document).ready(function () {
    $("#liPT").hide();
    $("#liET").hide();
    $("#RefNo").hide();
    $('#rblTrackingAWB').hide();
    $("#rblTrackingULD").hide();
    $('#rblTrackingFlight').hide();

    cfi.AutoCompleteV2("AWB", "AWBNumber", "History_AWBNumber", null, "contains");
    // cfi.AutoComplete("AWB", "AWBNumber", "vwAWBNumberProcess", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
    cfi.AutoCompleteV2("EDIAWB", "AWBNumber", "History_EDIAWBNumber", null, "contains");
    // cfi.AutoComplete("EDIAWB", "AWBNumber", "vwAWBNumberEDI", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
    cfi.AutoCompleteV2("ConAWBPrefix", "AirlineCode", "History_Airline", null, "contains");
    // cfi.AutoComplete("ConAWBPrefix", "AirlineCode", "vwAirline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");
    cfi.AutoCompleteV2("ConAWB", "AWBNumber", "History_ConAWBNumber", null, "contains");
    // cfi.AutoComplete("ConAWB", "AWBNumber", "vwAWBNumber", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
    cfi.AutoCompleteV2("ConRef", "ReferenceNumber", "History_ReferenceNumber", null, "contains");
    // cfi.AutoComplete("ConRef", "ReferenceNumber", "AWBReferenceBooking", "ReferenceNumber", "ReferenceNumber", ["ReferenceNumber"], null, "contains");
    cfi.AutoCompleteV2("ULDNo", "ULDNo", "History_ULDNo", null, "contains");
    // cfi.AutoComplete("ULDNo", "ULDNo", "vwUldStock", "SNo", "UldNo", ["ULDNo"], null, "contains");
    var UMSource = [{ Key: "0", Text: "CN38" }, { Key: "1", Text: "CN47" }];

    cfi.AutoCompleteByDataSource("POMailPrefix", UMSource);

    //cfi.AutoCompleteV2("POMailNo", "CN38No", "POMail_CN38No", null, "contains");
    cfi.AutoCompleteV2("POMailNo", "CN38No", "vwPOMailCNNumber", null, "contains");
    $("#Text_ConAWBPrefix").attr('maxlength', '3');
    //if (userContext.length) {
         $("#ConAWBPrefix").val(userContext.AirlineName.split('-')[0]);
        $("#Text_ConAWBPrefix").val(userContext.AirlineName.split('-')[0]);
        
    //}
    //cfi.AutoComplete("HistoryAWB", "AWBNumber", "vwAWBNumber", "AWBNumber", "AWBNumber", ["AWBNumber"],null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "History_FlightNo", null, "contains");
    //cfi.AutoComplete("FlightNo", "FlightNo", "vTrackingFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
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
        if ($(e.target).attr("id") == "Text_POMailNo" && e.keyCode == 13) {
            ConsolidatePOMailTrack();
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

    //$("#Text_AWBPrefix,#Text_ConAWBPrefix").unbind("keyup").bind("keyup", function () {
    //    if ($(this).val().length == 3) {
    //        if ($(this).attr("id") == "Text_AWBPrefix") {
    //            $("#Text_AWB").focus();
    //        } else if ($(this).attr("id") == "Text_ConAWBPrefix") {
    //            $("#Text_ConAWB").focus();
    //        }
    //    }
    //});

    $("#tbltracking").hide();
    $('#tbltracking').appendGrid({
        caption: 'EDI Message History',
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
                            //   cfi.PopUp("tblMessageType", "Message Type Details", "500");
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
    $("#tblMessageType").remove();
    $('#Re_execute').remove();
    //$(".k-select").remove();
    //$("#Text_AWBPrefix").next("span").remove();
    //$("#Text_AWB").next("span").remove();
    $("#liCT").closest('li').find('a').text('AWB History');
    $('.WebFormTable tr').find('td:contains("Consolidated History")').text('AWB History');
    $('#rblTrackingFlight').closest('td').hide();
    $('#rblTrackingULD').closest('td').hide()

    setTimeout(function () {
        var formAction = getQueryStringValue("FormAction")    //   $("a:contains('" + formAction + "')").click()
        $("a:contains('" + formAction + "')").click();
        $("#ApplicationTabs ul li span[class='k-link']:contains('" + formAction + "')").closest('li').click();
        $("#ApplicationTabs ul li a:not(:contains('" + formAction + "'))").closest('li').hide();
        $("#ApplicationTabs ul li span[class='k-link']:not(:contains('" + formAction + "'))").closest('li').hide();
        if (formAction == "Flight History")
        {
            $('input[type="button"][value="Print"]').hide();
            $('input[type="button"][value="Export to Excel"]').hide();
            var style = '   <style>  ' + '  \n   ' + '  \n     .k-callout-n {  ' + '   \n    display:none;  ' + '   \n    }  ' + ' \n    ' + '   \n    .k-window {  ' + '  \n         max-width: 98% !important;  ' + '  \n     }  ' + '  \n   ' + ' \n      .red {  ' + '  \n         color: red;  ' + '   \n    }  ' + ' \n   ' + ' \n     .green {  ' + ' \n         color: green;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-grid .k-hierarchy-col {  ' + ' \n         width: 30px;  ' + ' \n     }  ' + ' \n   ' + ' \n   ' + ' \n     .options {  ' + ' \n         padding: 0px;  ' + ' \n     }  ' + ' \n   ' + ' \n         .options > li {  ' + ' \n             float: left;  ' + ' \n             list-style: none;  ' + ' \n             padding-right: 1em;  ' + ' \n         }  ' + ' \n   ' + ' \n     label {  ' + ' \n         font-weight: 500;  ' + ' \n     }  ' + ' \n   ' + ' \n     .routetab > li {  ' + ' \n         float: left;  ' + ' \n         list-style: none;  ' + ' \n         padding-right: 1em;  ' + ' \n     }  ' + ' \n   ' + ' \n   ' + ' \n     .k-grid tbody .k-button {  ' + ' \n         min-width: 12px;  ' + ' \n         width: 18px;  ' + ' \n         color: transparent;  ' + ' \n         background-color: transparent;  ' + ' \n         border: transparent;  ' + ' \n         height: 22px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-grid-header th.k-header {  ' + ' \n         vertical-align: inherit !important;  ' + ' \n     }  ' + ' \n   ' + ' \n     .chkCls {  ' + ' \n         text-align: center;  ' + ' \n     }  ' + ' \n   ' + ' \n   ' + ' \n   ' + ' \n     .k-radio, input.k-checkbox {  ' + ' \n         display: inline;  ' + ' \n         opacity: 0;  ' + ' \n         width: 0;  ' + ' \n         margin: 0;  ' + ' \n         -webkit-appearance: none;  ' + ' \n         overflow: hidden;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio-label {  ' + ' \n         padding-right: 5px;  ' + ' \n         font-size: 11px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio:checked + .k-radio-label:after {  ' + ' \n         background-color: #3f51b5;  ' + ' \n         border-radius: 50%;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio:checked + .k-radio-label:after {  ' + ' \n         top: 4px;  ' + ' \n         left: 4px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-checkbox-label, .k-radio-label {  ' + ' \n         display: inline-block;  ' + ' \n         position: relative;  ' + ' \n         padding-left: 19px;  ' + ' \n         vertical-align: text-top;  ' + ' \n         line-height: 16px;  ' + ' \n         cursor: pointer;  ' + ' \n         border-style: solid;  ' + ' \n         border-width: 0;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio:checked + .k-radio-label:before, .k-radio:checked + .k-radio-label:hover:before {  ' + ' \n         border-color: #3f51b5;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio-label:before {  ' + ' \n         content: "";  ' + ' \n         position: absolute;  ' + ' \n         top: 0;  ' + ' \n         left: 0;  ' + ' \n         width: 12px;  ' + ' \n         height: 12px;  ' + ' \n         border-style: solid;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio:checked + .k-radio-label:after {  ' + ' \n         content: "";  ' + ' \n         width: 8px;  ' + ' \n         height: 8px;  ' + ' \n         position: absolute;  ' + ' \n         top: 4px;  ' + ' \n         left: 4px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio-label:before {  ' + ' \n         border-color: #7f7f7f;  ' + ' \n         border-radius: 50%;  ' + ' \n         background-color: #fff;  ' + ' \n         border-width: 2px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-invalid-msg {  ' + ' \n         position: fixed;  ' + ' \n     }  ' + ' \n   ' + ' \n     td[role=gridcell] {  ' + ' \n         white-space: nowrap;  ' + ' \n     }  ' + ' \n   ' + ' \n     .btninfo {  ' + ' \n         width: 10.5em;  ' + ' \n         padding: 2px;  ' + ' \n     }  ' + ' \n   ' + ' \n   ' + ' \n     .k-checkbox:disabled + .k-checkbox-label:before {  ' + ' \n         background: #696969;  ' + ' \n         border-color: #696969;  ' + ' \n         border-radius: 1px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-radio:disabled + .k-radio-label:before {  ' + ' \n         background: #ffffff;  ' + ' \n         border-color: #696969;  ' + ' \n     }  ' + ' \n   ' + ' \n     .img-route {  ' + ' \n         height: 25px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .Add-route {  ' + ' \n         height: 25px;  ' + ' \n         filter: contrast(0.6);  ' + ' \n     }  ' + ' \n   ' + ' \n     .btnRemove {  ' + ' \n         height: 18px;  ' + ' \n         margin-top: -18px;  ' + ' \n         margin-left: 1.8em;  ' + ' \n         position: absolute;  ' + ' \n     }  ' + ' \n   ' + ' \n     .Add-route:hover {  ' + ' \n         filter: contrast(5);  ' + ' \n         color: blue;  ' + ' \n         cursor: pointer;  ' + ' \n     }  ' + ' \n   ' + ' \n     .lblRoute {  ' + ' \n         margin: -10px 20px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .fltimg {  ' + ' \n         vertical-align: middle;  ' + ' \n         height: 18px;  ' + ' \n     }  ' + ' \n   ' + ' \n     div[kendo-window="winRoute"] table td {  ' + ' \n         border-bottom: 1px solid #7fc4e6;  ' + ' \n     }  ' + ' \n   ' + ' \n     div[id=ReRouteTab] .k-grid-content {  ' + ' \n         max-height: 421px;  ' + ' \n     }  ' + ' \n   ' + ' \n     div[id=ReRouteTab] .k-detail-cell .k-grid-content {  ' + ' \n         max-height: 200px;  ' + ' \n     }  ' + ' \n   ' + ' \n     div[options=FlightSearchO_DGridOptions] .k-grid-content {  ' + ' \n         max-height: 71vh;  ' + ' \n     }  ' + ' \n   ' + ' \n     div[kendo-window="historyWin"] .k-grid-content {  ' + ' \n         max-height: 70vh;  ' + ' \n     }  ' + ' \n   ' + ' \n     .redl {  ' + ' \n         color: red;  ' + ' \n     }  ' + ' \n   ' + ' \n         .redl:before {  ' + ' \n             content: \"\\f0c8\";  ' + ' \n             color: red;  ' + ' \n             margin-right: 8px;  ' + ' \n         }  ' + ' \n   ' + ' \n     .greenl {  ' + ' \n         color: green;  ' + ' \n         margin-right: 20px;  ' + ' \n     }  ' + ' \n   ' + ' \n         .greenl:before {  ' + ' \n             content: \"\\f0c8\";  ' + ' \n             color: green;  ' + ' \n             margin-right: 8px;  ' + ' \n         }  ' + ' \n   ' + ' \n     .lgd {  ' + ' \n         border: solid 1px #9a9898;  ' + ' \n         padding: 0px 10px;  ' + ' \n         font-size: 14px;  ' + ' \n         margin-left: 8px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-window-content .bVErrMsgContainer {  ' + ' \n         display: none;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-window-content {  ' + ' \n         font-size: 0.85em;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-grid-content-locked {  ' + ' \n         height: auto !important;  ' + ' \n     }  ' + ' \n   ' + ' \n     .hcap {  ' + ' \n         color: #9d331d;  ' + ' \n         font-weight: 700;  ' + ' \n     }  ' + ' \n   ' + ' \n     .m0 {  ' + ' \n         margin: 0;  ' + ' \n     }  ' + ' \n   ' + ' \n     .k-grid-content {  ' + ' \n         min-height: 40px;  ' + ' \n     }  ' + ' \n   ' + ' \n     .fb {  ' + ' \n         font-weight: 500;  ' + ' \n     }  ' + ' \n   ' + ' \n     .flt {  ' + ' \n         argin-left: 30em;  ' + ' \n         font-size: 13px;  ' + ' \n         font-weight: normal;  ' + ' \n     }  ' + ' \n  </style>  ';

            $("head").append(style);
        }
    }, 300);


    var _awbNo = new URLSearchParams(window.location.search).get('AWBNo');

    if (_awbNo) {
        $("#Text_ConAWB").val(_awbNo.split('-')[1])
        $("#Text_ConAWBPrefix").val(_awbNo.split('-')[0]);
        ConsolidateTrack();
    }


});
$(document).on('paste', '#Text_ConAWBPrefix', function (e) {
    if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
        e.preventDefault()
        var data = e.originalEvent.clipboardData.getData('Text');
        var len = data.length;
        if (len > 3) {
            var resdata = data.split('-');
            $("#Text_ConAWBPrefix").data("kendoAutoComplete").setDefaultValue(resdata[0], resdata[0]);
            var outval = resdata[1].replace(/[0-9,\s]/gi, '');
            if (outval.length == 0)
                $("#Text_ConAWB").val(resdata[1]);
            $('#operation').focus();
        }
    }
});
$("input[name='BasedOn']").on('change', function () {
    $("#Text_ConAWB").val('');
    $("#Text_ConRef").val('');
    if ($("input[name='BasedOn']:checked").val() == "0") {
        $("#RefNo").hide();
        $("#awbno").show();
        $("#Text_ConAWB").attr('data-valid', 'required');
        //  $("Text_ConAWBPrefix").attr('data-valid', 'maxlength[3], minlength[3], required');
        $("Text_ConRef").removeAttr('data-valid');

    }
    else {
        $("#awbno").hide();
        $("#RefNo").show();
        $("#Text_ConRef").attr('data-valid', 'required');
        // $("Text_ConAWBPrefix").removeAttr('data-valid');
        $("Text_ConAWB").removeAttr('data-valid');
    }

});


function printConsolidate() {

    $('[id="tdmodule"]').hide();
    var divContentstrans = $("#divConTrackingTrans").html();
    var divContents = $("#divConTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Consolidated History</title>');
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
    printWindow.document.write('<html><head><title>Process History</title>');
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
    printWindow.document.write('<html><head><title>EDI History</title>');
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
    $('[id="tdmodule"]').hide();
    var divContentstrans = $("#divFlightTrackingTrans").html();
    var divContents = $("#divFlightTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Flight History</title>');
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
    printWindow.document.write('<html><head><title>ULD History</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<style type="text/css">th {padding-top: 4px;padding-right: 2px; padding-bottom: 4px; white-space: nowrap;font-size: 10px; font-family: Verdana;} td {padding-top: 4px;padding-right: 2px;padding-bottom: 4px;white-space: nowrap;font-size: 10px;font-family: Verdana;}legend {font-size: 1.0em; font-weight: bold;padding: 2px 4px 8px; color:#222222;;font-family: Verdana;}</style>');
    printWindow.document.write(divContents);
    printWindow.document.write(divContentstrans);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    $('[id="tdmodule"]').show();
}


function printPOMail() {

    $('[id="tdmodule"]').hide();
    var divContentstrans = $("#divPOTrackingTrans").html();
    var divContents = $("#divPOTracking").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>PO Mail History</title>');
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
    //$("#Text_EDIAWBPrefix").next("span").remove();
    //$("#Text_EDIAWB").next("span").remove();
}
function onclickliCT() {
    $("#Text_ConAWBPrefix").val($("#Text_AWBPrefix").val());
    $("#Text_ConAWB").val($("#Text_AWB").val());
    //$(".k-select").remove();
    // $("#Text_ConAWBPrefix").next("span").remove();
    // $("#Text_ConAWB").next("span").remove();
}
function onclickliFT() {
    //$("#ConAWBPrefix").val($("#AWBPrefix").val());
    //$("#ConAWB").val($("#AWB").val());
}
function onclickliHT() {
    $("#Text_HistoryAWBPrefix").val($("#Text_AWBPrefix").val());
    $("#Text_HistoryAWB").val($("#Text_AWB").val());
    //$(".k-select").remove();
    //$("#Text_HistoryAWBPrefix").next("span").remove();
    //$("#Text_HistoryAWB").next("span").remove();
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
    var RefNo = $("#Text_ConRef").val();
    if ($("input[name='BasedOn']:checked").val() == "0") {
        var AWBNo = AWBPrefix + "-" + AWBNumber;
    }
    else {
        var AWBNo = RefNo;
    }
    if (AWBNo != "") {
        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetConsolidateTracking?recordID=" + AWBNo + "&AWBPrefix=" + AWBPrefix,
            type: "get",
            async: false,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //if (result.SNo > 0)
                //{
                //    CreateConsolidateTracking(result);

                //    $('[id="tdmodule"]').show();
                //}
                //else if (result.TrackingTrans.length > 0)
                //{
                //    CreateConsolidateTracking(result);

                //    $('[id="tdmodule"]').show();
                //}
                if (result != undefined) {

                    CreateConsolidateTracking(result);

                    $('[id="tdmodule"]').show();
                }
            }
        });
    }


}

function BindConsolidatePOMailTrackingData() {

    var POMailPrefix = $("#POMailPrefix").val();
    var POMailNo = $("#Text_POMailNo").val();

    //  var RefNo = $("#Text_ConRef").val();
    //if ($("input[name='BasedOn']:checked").val() == "0") {
    //    var AWBNo = AWBPrefix + "-" + AWBNumber;
    //}
    //else {
    //    var AWBNo = RefNo;
    //}
    if (POMailNo != "") {

        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetPOMailTracking?recordID=" + POMailNo + "&POMailPrefix=" + POMailPrefix,
            type: "get",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined) {

                    CreateConsolidatePOMailTracking(result);

                    $('[id="tdmodule"]').show();
                }
            }
        });
    }


}

function CreateConsolidatePOMailTracking(result) {

    var data = result.TrackingTrans;
    var routedata = '';
    //alert(data)    //Commented By Akash Incorrect alert on  24 Aug 2017
    var tbl = '<fieldset><legend>PO Mail History:</legend><table id="tblConPOMailTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblConPOMailTransCreate").remove();

    if (result.AWB != null) {
        $("#divPOTracking #lblPOMailNo").text(obj.AWB);
        $("#divPOTracking #lblPOMailNo").bind("click", function () {
            LocationPopup(obj.POMailSNo, obj.IsImportAWB, obj.TrackingStagesSNo);
        });
        $("#divPOTracking #lblPOMailDate").text(obj.AWBDate);
        //$("#divConTracking #lblSLI").text(obj.SLI);
        $("#divPOTracking #lblOrigin").text(obj.Origin);
        $("#divPOTracking #lblDestination").text(obj.Destination);
        $("#divPOTracking #lblTotalPieces").text(obj.TotalPieces);
        $("#divPOTracking #lblGrossWt").text(obj.GrossWt);

        $("#divPOTracking #lblrecdpc").text(obj.ReceivedPieces);
        $("#divPOTracking #lblbalpc").text(obj.BalancePieces);
        $("#divPOTracking #lbldorecdpc").text(obj.DOReceivedPieces);
        $("#divPOTracking #lbldobalpc").text(obj.DOBalancePieces);

        $("#divPOTracking #lblNatureOfGoods").text(obj.NatureOfGoods.toUpperCase());
        $("#divPOTracking #lblShipper").text('');
        $("#divPOTracking #lblConsignee").text('');
        $("#divPOTracking #lblBOE").text(obj.BOE);
        //$("#divPOTracking #lblSHC").text(obj.SHC.substring(0, obj.SHC.length - 1));
        $("#divPOTracking #lblSHC").text(obj.SHC);
        $("#divPOTracking #lblAWBType").text(obj.SLICustomerType);
        $("#divPOTracking #lblHAWB").text(obj.HAWB);
        $("#divPOTracking #lblAgentBuildUp").text(obj.IsAgentBuildUp == "True" ? "Yes" : "No");
        if ($("#divPOTracking #lblAgentBuildUp").text() == "Yes") {
            $("#divPOTracking #lblAgentBuildUp").attr("style", "color:red;font-weight:bold;");
        }
        $("#divPOTracking #lblOnHold").text(obj.OnHold == "True" ? "Yes" : "No");
        if ($("#divPOTracking #lblOnHold").text() == "Yes") {
            $("#divPOTracking #lblOnHold").attr("style", "color:red;font-weight:bold;cursor:pointer;");
        }
        else {
            $("#divPOTracking #lblOnHold").attr("style", "font-weight:bold;cursor:pointer;");
        }

        if (obj.Shipmenttype == "1") {
            $("#divPOTracking #trpcs").show();
            $("#divPOTracking #trpcsdata").show();

            $("#divPOTracking #trap").hide();
            $("#divPOTracking #trapdata").hide();

            $("#divPOTracking #transit").hide();
            $("#divPOTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "2") {
            $("#divPOTracking #trpcs").hide();
            $("#divPOTracking #trpcsdata").hide();

            $("#divPOTracking #trap").show();
            $("#divPOTracking #trapdata").show();

            $("#divConTracking #transit").hide();
            $("#divConTracking #transitdata").hide();
        }
        else if (obj.Shipmenttype == "3") {
            // Chnage by Riyaz to hide transit data
            //$("#divConTracking #transit").show();
            //$("#divConTracking #transitdata").show();
            $("#divPOTracking #transit").hide();
            $("#divPOTracking #transitdata").hide();

            $("#divPOTracking #trpcs").hide();
            $("#divPOTracking #trpcsdata").hide();

            $("#divPOTracking #trap").hide();
            $("#divPOTracking #trapdata").hide();
        }



        $("#divPOTracking #lblOnHold").bind("click", function () {
            AWBHoldPopup(obj.AWBSNo, obj.IsImportAWB);
        });

        var Ship = obj.Shipper.toUpperCase().split('<BR />');
        var Cong = obj.Consignee.toUpperCase().split('<BR />');
        $("#divPOTracking #lblShipperName").text(Ship[0]);
        $("#divPOTracking #lblShipperAddress").text(Ship[1] == undefined ? "" : Ship[1]);
        $("#divPOTracking #lblShipperEmail").text(Ship[2] == undefined ? "" : Ship[2] + ' , ' + Ship[3] == undefined ? "" : Ship[3]);

        $("#divPOTracking #lblConsigneeName").text(Cong[0]);
        $("#divPOTracking #lblConsigneeAddress").text(Cong[1] == undefined ? "" : Cong[1]);
        $("#divPOTracking #lblConsigneeEmail").text(Cong[2] == undefined ? "" : Cong[2] + ' , ' + Cong[3] == undefined ? "" : Cong[3]);

        $("#divPOTracking #lblAccepted").text(obj.AcceptedPieces);
        $("#divPOTracking #lblPlanned").text(obj.PlannedPieces);
        $("#divPOTracking #lblDeparted").text(obj.DepartedPieces);
        $("#divPOTracking #lblLying").text(obj.LyingPieces);
        $("#divPOTracking #lblLayingHeader").text('Lying at ' + userContext.AirportCode);

        tbl += "<thead><th> </th><th id='tdmodule'></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th> Date</th><th>Piece</th><th>Weight</th><th>Terminal</th><th>Event Details</th><th>Flight Info</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            //hide column as per cs sir on 10th Aug 
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
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
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:30%';><a href=\"#\" style=\"width: 50px;color: rgb(0, 0, 255);\" onclick=\"BindActualMessagePopup(this);return false;\">" + data[i].EventDetails + "</a><input type='hidden' id='hdnActualMessage' value ='" + data[i].ActualMessage + "'></td>";
            } else {
                if (data[i].EventDetails.indexOf('Route:') > 0) {
                    routedata = data[i].EventDetails.substring(data[i].EventDetails.indexOf('Route') + 6, data[i].EventDetails.indexOf(', Status'));
                    data[i].TrackingStagesSNo = 0;

                }
                else if (data[i].EventDetails.indexOf('SHIPPER CONSIGNEE DETAILS UPDATED:') >= 0) {
                    routedata = data[i].EventDetails;//.substring(data[i].EventDetails.indexOf('ROUTE') + 6, data[i].EventDetails.indexOf(', STATUS'));
                    data[i].TrackingStagesSNo = 1;
                }
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:30%'>" + BindEventDetails(data[i].IsPopup, obj.AWBSNo, data[i].EventDetails, data[i].TrackingStagesSNo, obj.IsImportAWB, routedata) + "</td>";
            }
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].FlightInfo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDateTime + "</td>";

            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";

            tbl += "</tr>";
        }
        tbl += "</tbody></table></fieldset>";
        $("#divPOTrackingTrans").append(tbl);
        $('#divPOTracking').show();

    }
    else {
        $('#divPOTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "POMail Number is incorrect", "bottom-left");
        return false;
    }
}

function CreateProceeTracking(result) {
    $('[id="tdmodule"]').show();
    var data = result.TrackingTrans;
    var tbl = '<fieldset><legend>Process History:</legend><table id="tblTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblTransCreate").remove();
    if (result.AWB != null) {
        $("#divTracking #lblAWB").text(obj.AWB);
        $("#divTracking #lblAWB").bind("click", function () {
            LocationPopup(obj.AWBSNo, obj.IsImportAWB, obj.TrackingStagesSNo);
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

        tbl += "<thead><th> </th><th id='tdmodule'></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th> Date</th><th>Piece</th><th>Weight</th><th>Terminal</th><th>Event Details</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>Flight Info</th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo1 + "</td>";
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

function BindEventDetails(isPopup, awbSNo, eventDetails, trackingStageSNo, isImport, routedata) {

    if (isPopup) {
        return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + eventDetails + "\" onclick=\"BindEventDetailsPopup(this);\">" + eventDetails.replace(/,/g, "<br>") + "</a>";
    }

        //else if (trackingStageSNo == 0 && eventDetails.indexOf('ROUTE') > 0) {

        //    return eventDetails.substring(0, eventDetails.indexOf(routedata) - 6).replace(/,/g, '<br>') + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + routedata + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>ROUTE</font></a>" + eventDetails.substring(eventDetails.indexOf(routedata) + routedata.length).replace(/,/g, '<br>') + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + routedata + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>SHIPPER CONSIGNEE DETAILS UPDATED</font></a>";
        //}
    else if (eventDetails.indexOf(';CCA ') > 0) {
        var newroutedata = eventDetails.substring(eventDetails.indexOf('ROUTE') + 6, eventDetails.indexOf(';CCA'));
      //  var shipperdetail = eventDetails.substring(eventDetails.indexOf('SHIPPER CONSIGNEE DETAILS UPDATED') + 34, eventDetails.indexOf(', DIMENSION'));
        var dimension = eventDetails.substring(eventDetails.indexOf('DIMENSION') + 10, eventDetails.indexOf(', ROUTE'));
      //  var custominfo = eventDetails.substring(eventDetails.indexOf('CUSTOMDETAILS') + 14, eventDetails.length);
        return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + dimension + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>DIMENSION</font></a>" + "<br>" + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + 0 + "\" data-event=\"" + newroutedata + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>ROUTE</font></a></br>" + eventDetails.substring(eventDetails.indexOf("CCA")).replace(/,/g, "<br>");
 
    }
    else if (trackingStageSNo == 0 && eventDetails.indexOf('ROUTE') > 0) {
        var newroutedata = eventDetails.substring(eventDetails.indexOf('ROUTE') + 6, eventDetails.indexOf(', STATUS'));
        var shipperdetail = eventDetails.substring(eventDetails.indexOf('SHIPPER CONSIGNEE DETAILS UPDATED') + 34, eventDetails.indexOf(', DIMENSION'));
        var dimension = eventDetails.substring(eventDetails.indexOf('DIMENSION') + 10, eventDetails.indexOf(', CUSTOMDETAILS'));
        var custominfo = eventDetails.substring(eventDetails.indexOf('CUSTOMDETAILS') + 14, eventDetails.length);

        return eventDetails.substring(0, eventDetails.indexOf(newroutedata) - 6).replace(/,/g, '<br>') + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + newroutedata + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>ROUTE</font></a>" + eventDetails.substring(eventDetails.indexOf(', STATUS'), eventDetails.indexOf('SHIPPER CONSIGNEE DETAILS UPDATED')).replace(/,/g, '<br>') + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + "1" + "\" data-event=\"" + shipperdetail + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>CUSTOMER INFORMATION</font></a>" + "<br>" + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + "2" + "\" data-event=\"" + dimension + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>DIMENSION</font></a>" + "<br>" + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + "3" + "\" data-event=\"" + custominfo + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>CUSTOM DETAILS</font></a>";
    }
    else if (trackingStageSNo == 0 && eventDetails.indexOf('Route') > 0) {
        var newroutedata = eventDetails.substring(eventDetails.indexOf('Route') + 6, eventDetails.indexOf(', Status'));
        //var shipperdetail = eventDetails.substring(eventDetails.indexOf('SHIPPER CONSIGNEE DETAILS UPDATED') + 34, eventDetails.indexOf(', DIMENSION'));
        //var dimension = eventDetails.substring(eventDetails.indexOf('DIMENSION') + 10, eventDetails.indexOf(', CUSTOMDETAILS'));
        //var custominfo = eventDetails.substring(eventDetails.indexOf('CUSTOMDETAILS') + 14, eventDetails.length);

        return eventDetails.substring(0, eventDetails.indexOf(newroutedata) - 6).replace(/,/g, '<br>') + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + newroutedata + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>ROUTE</font></a>" + eventDetails.substring(eventDetails.indexOf(', Status'), eventDetails.length).replace(/,/g, '<br>');
    }
    else if (trackingStageSNo == 2 && eventDetails.indexOf('DIMENSION') >= 0) {
        if (eventDetails.indexOf(', ROUTE') > 0) {
            var dimension = eventDetails.substring(eventDetails.indexOf('DIMENSION') + 10, eventDetails.indexOf(', ROUTE'));
            var route = eventDetails.substring(eventDetails.indexOf('ROUTE') + 6, eventDetails.length);
            return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + dimension + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>DIMENSION</font></a>" + "<br>" + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + 0 + "\" data-event=\"" + route + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>ROUTE</font></a>";
        }
        else {
            var dimension = eventDetails.substring(eventDetails.indexOf('DIMENSION') + 10, eventDetails.length);
            return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + dimension + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>DIMENSION</font></a>";
        }
    }
    else if (trackingStageSNo == 3 && eventDetails.indexOf('CUSTOMDETAILS') >= 0) {
        return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + routedata + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>CUSTOM DETAILS</font></a>";
    }
    else if (trackingStageSNo == 4 && eventDetails.indexOf('CUSTOMERINFORMATION') >= 0) {

        var CustomerInformation = eventDetails.substring(eventDetails.indexOf('CUSTOMERINFORMATION') + 20, eventDetails.indexOf('FWBCUSTOMDETAILS'));
        var CustomDetails = eventDetails.substring(eventDetails.indexOf('FWBCUSTOMDETAILS') + 17, eventDetails.length);

        return eventDetails.substring(0, eventDetails.indexOf(CustomerInformation) - 20).replace(/,/g, '<br>') + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + CustomerInformation + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>CUSTOMER INFORMATION</font></a>" + "<br>" + "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + 5 + "\" data-event=\"" + CustomDetails + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>CUSTOM DETAILS</font></a>";
    }
    else if (trackingStageSNo == 6 && eventDetails.indexOf('REPRICE') >= 0) {

        var Reprice = eventDetails.substring(eventDetails.indexOf('REPRICE') + 8, eventDetails.length);
        return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + Reprice + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>REPRICE</font></a>";
    }
    else if (trackingStageSNo == 7 && eventDetails.indexOf('LOCATION') >= 0) {

        var Location = eventDetails.substring(eventDetails.indexOf('LOCATION') + 9, eventDetails.length);
        return "<a href=\"#\" data-Awb=\"" + awbSNo + "\" data-IsImportAWB=\"" + isImport + "\" data-Tstage=\"" + trackingStageSNo + "\" data-event=\"" + Location + "\" onclick=\"BindEventDetailsPopup(this);\"><font color='blue'>LOCATION</font></a>";
    }
    else {
        return eventDetails.replace(/,/g, "<br>");
    }
}

function BindEventDetailsPopup(that) {
    if ($(that).attr("data-Tstage") == "16" || $(that).attr("data-Tstage") == "55" || $(that).attr("data-Tstage") == "40") {
        LocationPopup($(that).attr("data-Awb"), $(that).attr("data-IsImportAWB"), $(that).attr("data-Tstage"));
    }
    else if ($(that).attr("data-Tstage") == "38" || $(that).attr("data-Tstage") == "92") {
        LocationPopup($(that).attr("data-Awb"), $(that).attr("data-IsImportAWB"), $(that).attr("data-Tstage"));
        //HAWBPopup($(that).attr("data-Awb"), $(that).attr("data-IsImportAWB"), $(that).attr("data-event"));
    }
    else if ($(that).attr("data-Tstage") == "0") {



        var tblroutedata = '';
        var tblroute = '<tr><td class="formtHeaderLabel"><b>Flight No</b></td><td class="formtHeaderLabel">Flight Date</td><td class="formtHeaderLabel">Sector</td><td class="formtHeaderLabel">Pieces</td><td class="formtHeaderLabel">Gr Wt</td><td class="formtHeaderLabel">Volume</td><td class="formtHeaderLabel">Status</td><td class="formtHeaderLabel">Allotment Code</td></tr>';
        for (var i = 0; i < $(that).attr("data-event").split(',').length; i++) {
            tblroutedata = $(that).attr("data-event").split(',')[i];
            tblroute += '<tr>';
            for (var j = 0; j < tblroutedata.split(';').length ; j++) {
                tblroute += "<td class=\"formHeaderTranscolumn\">" + tblroutedata.split(';')[j] + "</td>";
            } tblroute += '</tr>';
        }

        $("head").after('<div id="divRouteWindow"><table class="WebFormTable">' + tblroute + '</table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        //var x = jQuery(this).position().left + jQuery(this).outerWidth();
        //var y = jQuery(this).position().top - jQuery(document).scrollTop();
       // jQuery("#dialog").dialog('option', 'position', [x, y]);

        $("#divRouteWindow").dialog(
             {
                 
                 maxWidth: 1300,
                 maxHeight: 500,
                 width: 550,
                 height: 250,
                 top:"0px",
                 modal: true,                               
                 title: 'Flight Details',
                 draggable: true,
                 resizable: true,
                 buttons: {
                     Cancel: function () {
                         $(this).dialog("close");
                     }
                 },
                 close: function () {
                     $(this).dialog("close");
                 },
                 open: function () {
                     $(this).closest('div[aria-describedby="divRouteWindow"]').css('top', '100px');
                     $(this).focus();
                     
                 }
             });

    }
    else if ($(that).attr("data-Tstage") == "1") {
        var tblshicondata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tblshicon = '<tr><td class="formtHeaderLabel"><b>Shipper</b></td><td class="formtHeaderLabel"><b>Consignee</b></td></tr>';
        tblshicon += '<tr>';
        for (var j = 0; j < tblshicondata.split(';').length ; j++) {
            tblshicon += "<td class=\"formHeaderTranscolumn\">" + tblshicondata.split(';')[j] + "</td>";
        } tblshicon += '</tr>';


        $("head").after('<div id="divShiConWindow"><table class="WebFormTable">' + tblshicon + '</table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divShiConWindow").dialog(
             {
                 autoResize: true,
                 maxWidth: 1300,
                 maxHeight: 800,
                 width: 550,
                 height: 250,
                 modal: true,
                 title: 'Shipper Consignee Details',
                 draggable: true,
                 resizable: true,
                 buttons: {
                     Cancel: function () {
                         $(this).dialog("close");
                     }
                 },
                 close: function () {
                     $(this).dialog("close");
                 },
                 open: function () {
                     $(this).closest('div[aria-describedby="divShiConWindow"]').css('top', '100px');
                     $(this).focus();
                 }
             });
    }
    else if ($(that).attr("data-Tstage") == "2") {
        var tbldimensiondata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tbldimension = '<tr><td class="formtHeaderLabel"><b>Length</b></td><td class="formtHeaderLabel"><b>Width</b></td><td class="formtHeaderLabel"><b>Height</b></td><td class="formtHeaderLabel"><b>Pieces</b></td><td class="formtHeaderLabel"><b>VolumeWeight</b></td><td class="formtHeaderLabel"><b>Volume</b></td><td class="formtHeaderLabel"><b>Mes.Unit</b></td></tr>';
        tbldimension += '<tr>';
        var tblMultiDimension = tbldimensiondata.split(',');
        //var k = (tbldimensiondata.split(';').length) / 7
        //var checkcount = 1;
        //var j = 0;

        for (var k = 0; k < tbldimensiondata.split(',').length; k++) {
            tbldimension += '<tr>';
            for (var j = 0; j < tblMultiDimension[k].split(';').length ; j++) {
                tbldimension += "<td class=\"formHeaderTranscolumn\">" + tblMultiDimension[k].split(';')[j] + "</td>";
                //if (checkcount != k) {
                //    if (j != 6) {
                //        tbldimension += "<td class=\"formHeaderTranscolumn\">" + tbldimensiondata.split(';')[j] + "</td>";
                //    }
                //    else {
                //        checkcount++;
                //        j = 0;
                //    }
                //}
            } tbldimension += '</tr>';
        }


        $("head").after('<div id="divDimensionWindow"><table class="WebFormTable">' + tbldimension + '</table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divDimensionWindow").dialog(
             {
                 autoResize: true,
                 maxWidth: 1300,
                 maxHeight: 800,
                 width: 550,
                 height: 250,
                 modal: true,
                 title: 'Dimension Details',
                 draggable: true,
                 resizable: true,
                 buttons: {
                     Cancel: function () {
                         $(this).dialog("close");
                     }
                 },
                 close: function () {
                     $(this).dialog("close");
                 },
                 open: function () {
                     $(this).closest('div[aria-describedby="divDimensionWindow"]').css('top', '100px');
                     $(this).focus();
                 }
             });
    }
    else if ($(that).attr("data-Tstage") == "3") {
        var tblcustomdata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tblcustom = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Information</b></td></tr>';
        //tblcustom += '<tr>';
        var tblspace2 = '';
        var tblcustom3 = '';
        var tbheadercol = '';
        var tbheaderrow = '';
        var headerCol1 = '';
        var row1 = '';
        var countrow = '';

        for (var j = 0; j < tblcustomdata.split(';').length; j++) {
            if (j == 0) {
                var SCIData = tblcustomdata.split(';')[j]
                tblcustom += '<tr><td class="formtHeaderLabel" colspan=4><b>OSI</b></td></tr>';
                for (var k = 0; k < SCIData.split(',').length; k++) {

                    tblcustom += '<tr>';
                    tblcustom += "<td class=\"formHeaderTranscolumn\" colspan=4>" + SCIData.split(',')[k] + "</td>";
                    tblcustom += '</tr>';
                }
            }
            //if (j == 1) {

            //    var tblspace = '<tr><td><br/></td></tr>';

            //    var OCIData = tblcustomdata.split(';')[j]

            //    var tblcustom2 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Customs, Security & Regulatory Control Information</b></td></tr>';
            //    tblcustom2 += '<tr><td class="formtHeaderLabel"><b>Country Code</b></td><td class="formtHeaderLabel"><b>Information Type</b></td><td class="formtHeaderLabel"><b>Customs, Security</b></td><td class="formtHeaderLabel"><b>Supplementary Customs</b></td></tr>';

            //    for (var k = 0; k < OCIData.split('/').length-1; k++) {
            //        var Multipledata = OCIData.split('/')[k];
            //        tblcustom2 += '<tr>';
            //        for (var m = 0; m < Multipledata.split(',').length; m++) {

            //            tblcustom2 += "<td class=\"formHeaderTranscolumn\">" + Multipledata.split(',')[m]+ "</td>";
            //        }
            //        tblcustom2 += '</tr>';


            //    }
            //}
            if (j == 1) {


                var tblspace = '<tr><td><br/></td></tr>';

                var OCIData = tblcustomdata.split(';')[j]

                var tblcustom2 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Customs, Security & Regulatory Control Information</b></td></tr>';
                //tblcustom2 += '<tr><td class="formtHeaderLabel"><b>Country Code</b></td><td class="formtHeaderLabel"><b>Information Type</b></td><td class="formtHeaderLabel"><b>Customs, Security</b></td><td class="formtHeaderLabel"><b>Supplementary Customs</b></td></tr>';

                for (var k = 0; k < OCIData.split('/').length - 1; k++) {
                    var Multipledata = OCIData.split('/')[k];
                    row1 += '<tr>';
                    for (var m = 0; m < Multipledata.split(',').length; m++) {
                        if (k == 0) {
                            headerCol1 += "<td class=\"formtHeaderLabel\">" + Multipledata.split(',')[m].split(':')[0] + "</td>";
                        }
                        row1 += "<td class=\"formHeaderTranscolumn\">" + Multipledata.split(',')[m].split(':')[1] + "</td>";
                    }
                    row1 += '</tr>';


                }
            }
            //if (j == 2) {
            //    var NitificationData = tblcustomdata.split(';')[j]
            //    tblspace2 = '<tr><td><br/></td></tr>';
            //    tblcustom3 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Notify Party Details</b></td></tr>';
            //    //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
            //    tblcustom3 += '<tr>';
            //    for (var k = 0; k < NitificationData.split(',').length; k++) {

            //        tblcustom3 += "<td class=\"formHeaderTranscolumn\">" + NitificationData.split(',')[k]+ "</td>";

            //    }
            //    tblcustom3 += '</tr>';

            //}
            if (j == 2) {

                var NitificationData = tblcustomdata.split(';')[j]
                var countcol = NitificationData.split(',').length;
                tblspace2 = '<tr><td><br/></td></tr>';
                tblcustom3 = '<tr><td colspan=' + countcol + ' class=\"formHeaderTranscolumn\"><b>Notify Party Details</b></td></tr>';
                //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
                // tblcustom3 += '<tr>';
                if (NitificationData != '') {
                    for (var k = 0; k < NitificationData.split(',').length; k++) {


                        tbheadercol += '<td class="formtHeaderLabel"><b>' + NitificationData.split(',')[k].split(':')[0] + '</b></td>';
                        tbheaderrow += "<td class=\"formHeaderTranscolumn\" colspan=>" + NitificationData.split(',')[k].split(':')[1] + "</td>";

                    }
                }
                else {
                    tbheadercol += '<td class="formtHeaderLabel"></td>';
                    tbheaderrow += "<td class=\"formHeaderTranscolumn\" colspan=></td>";

                }
                // tblcustom3 += '</tr>';

            }
            // tblcustom += "<td class=\"formHeaderTranscolumn\">" + tblcustomdata.split(';')[j] + "</td>";
        } //tblcustom += '</tr>';


        $("head").after('<div id="divCustomWindow"><table class="WebFormTable">' + tblcustom + '</table><table class="WebFormTable">' + tblspace + '</table><table class="WebFormTable">' + tblcustom2 + '<tr>' + headerCol1 + '</tr>' + row1 + '</table><table class="WebFormTable">' + tblspace2 + '</table><table class="WebFormTable">' + tblcustom3 + '<tr>' + tbheadercol + '</tr><tr>' + tbheaderrow + '</tr></table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divCustomWindow").dialog(
        {
            autoResize: true,
            maxWidth: 1300,
            maxHeight: 1000,
            width: 1000,
            height: 500,
            modal: true,
            title: 'Custom Details',
            draggable: true,
            resizable: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                $(this).dialog("close");
            },
            open: function () {
                $(this).closest('div[aria-describedby="divCustomWindow"]').css('top', '100px');
                $(this).focus();
            }
        });
    }

    else if ($(that).attr("data-Tstage") == "4") {



        //var tblshicondata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        //var tblshicon = '<tr><td class="formtHeaderLabel"><b>Shipper</b></td><td class="formtHeaderLabel"><b>Consignee</b></td></tr>';
        //tblshicon += '<tr>';
        //for (var j = 0; j < tblshicondata.split(';').length ; j++) {
        //    tblshicon += "<td class=\"formHeaderTranscolumn\">" + tblshicondata.split(';')[j] + "</td>";
        //} tblshicon += '</tr>';
        //var length = tblshicondata.split(';').length;

        // $("head").after('<div id="divShiConWindow"><table class="WebFormTable">' + tblshicon + '</table></div>');

        //Show Popup
        //$("#divShiConWindow").dialog(
        //     {
        //         autoResize: true,
        //         maxWidth: 1300,
        //         maxHeight: 800,
        //         width: 550,
        //         height: 250,
        //         modal: true,
        //         title: 'Shipper Consignee Details',
        //         draggable: true,
        //         resizable: true,
        //         buttons: {
        //             Cancel: function () {
        //                 $(this).dialog("close");
        //             }
        //         },
        //         close: function () {
        //             $(this).dialog("close");
        //         },
        //         open: function () {
        //             $(this).focus();
        //         }
        //     });
        //var tblcustomdata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        //var tblcustom = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Information</b></td></tr>';
        ////tblcustom += '<tr>';
        //var tblspace2 = '';
        //var tblcustom3 = '';
        //var tbheadercol = '';
        //var tbheaderrow = '';
        //var headerCol1 = '';
        //var row1 = '';
        //var countrow = '';

        //for (var j = 0; j < tblcustomdata.split(';').length; j++) {
        //    if (j == 0) {
        //        var SCIData = tblcustomdata.split(';')[j]
        //        tblcustom += '<tr><td class="formtHeaderLabel" colspan=4><b>OSI</b></td></tr>';
        //        for (var k = 0; k < SCIData.split(',').length; k++) {

        //            tblcustom += '<tr>';
        //            tblcustom += "<td class=\"formHeaderTranscolumn\" colspan=4>" + SCIData.split(',')[k] + "</td>";
        //            tblcustom += '</tr>';
        //        }
        //    }
        //    //if (j == 1) {

        //    //    var tblspace = '<tr><td><br/></td></tr>';

        //    //    var OCIData = tblcustomdata.split(';')[j]

        //    //    var tblcustom2 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Customs, Security & Regulatory Control Information</b></td></tr>';
        //    //    tblcustom2 += '<tr><td class="formtHeaderLabel"><b>Country Code</b></td><td class="formtHeaderLabel"><b>Information Type</b></td><td class="formtHeaderLabel"><b>Customs, Security</b></td><td class="formtHeaderLabel"><b>Supplementary Customs</b></td></tr>';

        //    //    for (var k = 0; k < OCIData.split('/').length-1; k++) {
        //    //        var Multipledata = OCIData.split('/')[k];
        //    //        tblcustom2 += '<tr>';
        //    //        for (var m = 0; m < Multipledata.split(',').length; m++) {

        //    //            tblcustom2 += "<td class=\"formHeaderTranscolumn\">" + Multipledata.split(',')[m]+ "</td>";
        //    //        }
        //    //        tblcustom2 += '</tr>';


        //    //    }
        //    //}
        //    if (j == 1) {


        //        var tblspace = '<tr><td><br/></td></tr>';

        //        var OCIData = tblcustomdata.split(';')[j]

        //        var tblcustom2 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Customs, Security & Regulatory Control Information</b></td></tr>';
        //        //tblcustom2 += '<tr><td class="formtHeaderLabel"><b>Country Code</b></td><td class="formtHeaderLabel"><b>Information Type</b></td><td class="formtHeaderLabel"><b>Customs, Security</b></td><td class="formtHeaderLabel"><b>Supplementary Customs</b></td></tr>';

        //        for (var k = 0; k < OCIData.split('/').length - 1; k++) {
        //            var Multipledata = OCIData.split('/')[k];
        //            row1 += '<tr>';
        //            for (var m = 0; m < Multipledata.split(',').length; m++) {
        //                if (k == 0) {
        //                    headerCol1 += "<td class=\"formtHeaderLabel\">" + Multipledata.split(',')[m].split(':')[0] + "</td>";
        //                }
        //                row1 += "<td class=\"formHeaderTranscolumn\">" + Multipledata.split(',')[m].split(':')[1] + "</td>";
        //            }
        //            row1 += '</tr>';


        //        }
        //    }
        //    //if (j == 2) {
        //    //    var NitificationData = tblcustomdata.split(';')[j]
        //    //    tblspace2 = '<tr><td><br/></td></tr>';
        //    //    tblcustom3 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Notify Party Details</b></td></tr>';
        //    //    //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
        //    //    tblcustom3 += '<tr>';
        //    //    for (var k = 0; k < NitificationData.split(',').length; k++) {

        //    //        tblcustom3 += "<td class=\"formHeaderTranscolumn\">" + NitificationData.split(',')[k]+ "</td>";

        //    //    }
        //    //    tblcustom3 += '</tr>';

        //    //}

        var tblspace2 = '';
        var tblcustom3 = '';
        var tbheadercol = '';
        var tbheaderrow = '';
        var headerCol1 = '';
        var row1 = '';
        var countrow = '';

        var tbheadercolAcc = '';
        var tbheaderrowAcc = '';
        var tblAccspace = '';
        var tblAccHeading = '';
        var tbheadercolNom = '';
        var tbheaderrowNom = '';
        var tblNomspace2 = '';
        var tblNomcustom3 = '';

        var tblshicondata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tblshicon = '<tr><td class="formtHeaderLabel"><b>Shipper</b></td><td class="formtHeaderLabel"><b>Consignee</b></td></tr>';
        tblshicon += '<tr>';
        for (var j = 0; j < tblshicondata.split(';').length - 3 ; j++) {
            tblshicon += "<td class=\"formHeaderTranscolumn\">" + tblshicondata.split(';')[j] + "</td>";
        } tblshicon += '</tr>';
        var length = tblshicondata.split(';').length;

        if (length > 4) {

            var j = length - 3
            var AccountData = tblshicondata.split(';')[j]
            var countcol = AccountData.split(',').length;
             tblAccspace = '<tr><td><br/></td></tr>';
             tblAccHeading = '<tr><td colspan=' + countcol + ' class=\"formHeaderTranscolumn\"><b>Forwarder(Agent) Details</b></td></tr>';
            //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
            // tblcustom3 += '<tr>';
            if (AccountData != '') {
                for (var k = 0; k < AccountData.split(',').length - 1; k++) {


                    tbheadercolAcc += '<td class="formtHeaderLabel"><b>' + AccountData.split(',')[k].split(':')[0] + '</b></td>';
                    tbheaderrowAcc += "<td class=\"formHeaderTranscolumn\" colspan=>" + AccountData.split(',')[k].split(':')[1] + "</td>";

                }
            }
            else {
                tbheadercolAcc += '<td class="formtHeaderLabel"></td>';
                tbheaderrowAcc += "<td class=\"formHeaderTranscolumn\" colspan=></td>";

            }


            var j = length - 2
            var NotificationData = tblshicondata.split(';')[j]
            var countcol = NotificationData.split(',').length;
            tblspace2 = '<tr><td><br/></td></tr>';
            tblcustom3 = '<tr><td colspan=' + countcol + ' class=\"formHeaderTranscolumn\"><b>Notify Party Details</b></td></tr>';
            //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
            // tblcustom3 += '<tr>';
            if (NotificationData != '') {
                for (var k = 0; k < NotificationData.split(',').length - 1; k++) {


                    tbheadercol += '<td class="formtHeaderLabel"><b>' + NotificationData.split(',')[k].split(':')[0] + '</b></td>';
                    tbheaderrow += "<td class=\"formHeaderTranscolumn\" colspan=>" + NotificationData.split(',')[k].split(':')[1] + "</td>";

                }
            }
            else {
                tbheadercol += '<td class="formtHeaderLabel"></td>';
                tbheaderrow += "<td class=\"formHeaderTranscolumn\" colspan=></td>";

            }


            var j = length - 1
            var NominatedData = tblshicondata.split(';')[j]
            var countcol = NominatedData.split(',').length;
            tblNomspace2 = '<tr><td><br/></td></tr>';
            tblNomcustom3 = '<tr><td colspan=' + countcol + ' class=\"formHeaderTranscolumn\"><b>Nominated Handling Party</b></td></tr>';
            //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
            // tblcustom3 += '<tr>';
            if (NominatedData != '') {
                for (var k = 0; k < NominatedData.split(',').length - 1; k++) {


                    tbheadercolNom += '<td class="formtHeaderLabel"><b>' + NominatedData.split(',')[k].split(':')[0] + '</b></td>';
                    tbheaderrowNom += "<td class=\"formHeaderTranscolumn\" colspan=>" + NominatedData.split(',')[k].split(':')[1] + "</td>";

                }
            }
            else {
                tbheadercolNom += '<td class="formtHeaderLabel"></td>';
                tbheaderrowNom += "<td class=\"formHeaderTranscolumn\" colspan=></td>";

            }
            // tblcustom3 += '</tr>';

        }
        // tblcustom += "<td class=\"formHeaderTranscolumn\">" + tblcustomdata.split(';')[j] + "</td>";
        //} //tblcustom += '</tr>';


        $("head").after('<div id="divCustomWindow"><table class="WebFormTable">' + tblshicon + '</table><table class="WebFormTable">' + tblAccspace + '</table><table class="WebFormTable">' + tblAccHeading + '<tr>' + tbheadercolAcc + '</tr><tr>' + tbheaderrowAcc + '</tr></table><table class="WebFormTable">' + tblspace2 + '</table><table class="WebFormTable">' + tblcustom3 + '<tr>' + tbheadercol + '</tr><tr>' + tbheaderrow + '</tr></table><table class="WebFormTable">' + tblNomspace2 + '</table><table class="WebFormTable">' + tblNomcustom3 + '<tr>' + tbheadercolNom + '</tr><tr>' + tbheaderrowNom + '</tr></table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divCustomWindow").dialog(
        {
            autoResize: true,
            maxWidth: 1300,
            maxHeight: 1000,
            width: 1000,
            height: 500,
            modal: true,
            title: 'Customer Information',
            draggable: true,
            resizable: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                $(this).dialog("close");
            },
            open: function () {
                $(this).closest('div[aria-describedby="divCustomWindow"]').css('top', '100px');
                $(this).focus();
            }
        });
    }
    else if ($(that).attr("data-Tstage") == "5") {
        var tblcustomdata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tblcustom = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Information</b></td></tr>';
        //tblcustom += '<tr>';
        var tblspace2 = '';
        var tblcustom3 = '';
        var tbheadercol = '';
        var tbheaderrow = '';
        var headerCol1 = '';
        var row1 = '';
        var countrow = '';

        for (var j = 0; j < tblcustomdata.split(';').length; j++) {
            if (j == 0) {
                var SCIData = tblcustomdata.split(';')[j]
                tblcustom += '<tr><td class="formtHeaderLabel" colspan=4><b>OSI</b></td></tr>';
                for (var k = 0; k < SCIData.split(',').length; k++) {

                    tblcustom += '<tr>';
                    tblcustom += "<td class=\"formHeaderTranscolumn\" colspan=4>" + SCIData.split(',')[k] + "</td>";
                    tblcustom += '</tr>';
                }
            }
            //if (j == 1) {

            //    var tblspace = '<tr><td><br/></td></tr>';

            //    var OCIData = tblcustomdata.split(';')[j]

            //    var tblcustom2 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Customs, Security & Regulatory Control Information</b></td></tr>';
            //    tblcustom2 += '<tr><td class="formtHeaderLabel"><b>Country Code</b></td><td class="formtHeaderLabel"><b>Information Type</b></td><td class="formtHeaderLabel"><b>Customs, Security</b></td><td class="formtHeaderLabel"><b>Supplementary Customs</b></td></tr>';

            //    for (var k = 0; k < OCIData.split('/').length-1; k++) {
            //        var Multipledata = OCIData.split('/')[k];
            //        tblcustom2 += '<tr>';
            //        for (var m = 0; m < Multipledata.split(',').length; m++) {

            //            tblcustom2 += "<td class=\"formHeaderTranscolumn\">" + Multipledata.split(',')[m]+ "</td>";
            //        }
            //        tblcustom2 += '</tr>';


            //    }
            //}
            if (j == 1) {


                var tblspace = '<tr><td><br/></td></tr>';

                var OCIData = tblcustomdata.split(';')[j]

                var tblcustom2 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Other Customs, Security & Regulatory Control Information</b></td></tr>';
                //tblcustom2 += '<tr><td class="formtHeaderLabel"><b>Country Code</b></td><td class="formtHeaderLabel"><b>Information Type</b></td><td class="formtHeaderLabel"><b>Customs, Security</b></td><td class="formtHeaderLabel"><b>Supplementary Customs</b></td></tr>';

                for (var k = 0; k < OCIData.split('/').length - 1; k++) {
                    var Multipledata = OCIData.split('/')[k];
                    row1 += '<tr>';
                    for (var m = 0; m < Multipledata.split(',').length; m++) {
                        if (k == 0) {
                            headerCol1 += "<td class=\"formtHeaderLabel\">" + Multipledata.split(',')[m].split(':')[0] + "</td>";
                        }
                        row1 += "<td class=\"formHeaderTranscolumn\">" + Multipledata.split(',')[m].split(':')[1] + "</td>";
                    }
                    row1 += '</tr>';


                }
            }
            //if (j == 2) {
            //    var NitificationData = tblcustomdata.split(';')[j]
            //    tblspace2 = '<tr><td><br/></td></tr>';
            //    tblcustom3 = '<tr><td colspan=4 class=\"formHeaderTranscolumn\"><b>Notify Party Details</b></td></tr>';
            //    //tblcustom3 += '<tr><td class="formtHeaderLabel"><b>Name 1</b></td><td class="formtHeaderLabel"><b>Name 2</b></td><td class="formtHeaderLabel"><b>Country</b></td><td class="formtHeaderLabel"><b>City </b></td><td class="formtHeaderLabel"><b>Contact Numbe </b></td><td class="formtHeaderLabel"><b>Telex </b></td><td class="formtHeaderLabel"><b>Address 1  </b></td><td class="formtHeaderLabel"><b>Address 2  </b></td><td class="formtHeaderLabel"><b>State  </b></td><td class="formtHeaderLabel"><b>Place </b></td><td class="formtHeaderLabel"><b>Postal Code </b></td><td class="formtHeaderLabel"><b>Fax </b></td><td class="formtHeaderLabel"><b>Fax </b></td></tr>';
            //    tblcustom3 += '<tr>';
            //    for (var k = 0; k < NitificationData.split(',').length; k++) {

            //        tblcustom3 += "<td class=\"formHeaderTranscolumn\">" + NitificationData.split(',')[k]+ "</td>";

            //    }
            //    tblcustom3 += '</tr>';

            //}

            // tblcustom += "<td class=\"formHeaderTranscolumn\">" + tblcustomdata.split(';')[j] + "</td>";
        } //tblcustom += '</tr>';


        $("head").after('<div id="divCustomWindow"><table class="WebFormTable">' + tblcustom + '</table><table class="WebFormTable">' + tblspace + '</table><table class="WebFormTable">' + tblcustom2 + '<tr>' + headerCol1 + '</tr>' + row1 + '</table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divCustomWindow").dialog(
        {
            autoResize: true,
            maxWidth: 1300,
            maxHeight: 1000,
            width: 1000,
            height: 500,
            modal: true,
            title: 'Custom Details',
            draggable: true,
            resizable: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                $(this).dialog("close");
            },
            open: function () {
                $(this).closest('div[aria-describedby="divCustomWindow"]').css('top', '100px');
                $(this).focus();
            }
        });
    }

    else if ($(that).attr("data-Tstage") == "6") {
        var tblRepricedata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tblRepriceRate = '<tr><td class="formtHeaderLabel"><b>MKT Rate</b></td><td class="formtHeaderLabel"><b>MKT Freight</b></td><td class="formtHeaderLabel"><b>Currency</b></td><td class="formtHeaderLabel"><b>Ref No.</b></td></tr>';
        var tblRepriceOtherCharge = '<tr><td class="formtHeaderLabel"><b>Charge Value</b></td><td class="formtHeaderLabel"><b>OtherCharge Code</b></td><td class="formtHeaderLabel"><b>Currency</b></td><td class="formtHeaderLabel"><b>Ref No.</b></td></tr>';
        var tblRepriceTax = '<tr><td class="formtHeaderLabel"><b>Tax Amount</b></td><td class="formtHeaderLabel"><b>Tax Code</b></td><td class="formtHeaderLabel"><b>Currency</b></td><td class="formtHeaderLabel"><b>Ref No.</b></td></tr>';
        // tblReprice += '<tr>';
        var tblMultiRepricing = tblRepricedata.split(';');
        //var k = (tbldimensiondata.split(';').length) / 7
        //var checkcount = 1;
        //var j = 0;

        for (var k = 0; k < tblRepricedata.split(';').length; k++) {
            //tblReprice += '<tr>';
            // if (tblMultiRepricing[k].length > 0) {

            if (k = 0) {
                lRepriceRate += "<tr>"
                for (var j = 0; j < tblMultiRepricing[0].split(',').length ; j++) {
                    tblRepriceRate += "<td class=\"formHeaderTranscolumn\">" + tblMultiRepricing[0].split(',')[j] + "</td>";
                }
                lRepriceRate += "</tr>"
            }
            if (k = 1) {
                tblRepriceOtherCharge +="<tr>"
                for (var j = 0; j < tblMultiRepricing[1].split(',').length ; j++) {
                    tblRepriceOtherCharge += "<td class=\"formHeaderTranscolumn\">" + tblMultiRepricing[1].split(',')[j] + "</td>";
                }
                tblRepriceOtherCharge += "</tr>"
            }
            if (k = 2) {
                tblRepriceTax += "<tr>"
                for (var j = 0; j < tblMultiRepricing[2].split(',').length ; j++) {
                    tblRepriceTax += "<td class=\"formHeaderTranscolumn\">" + tblMultiRepricing[2].split(',')[j] + "</td>";
                }
                tblRepriceTax += "</tr>"
            }
            // tblReprice += "<td class=\"formHeaderTranscolumn\">" + tblMultiRepricing[k].split(',')[j] + "</td>";
            //if (checkcount != k) {
            //    if (j != 6) {
            //        tbldimension += "<td class=\"formHeaderTranscolumn\">" + tbldimensiondata.split(';')[j] + "</td>";
            //    }
            //    else {
            //        checkcount++;
            //        j = 0;
            //    }
            //}
            // }
            // }
            //tblReprice += '</tr>';
        }


        $("head").after('<div id="divRepricingWindow"><table class="WebFormTable">' + tblRepriceRate + '</table><br/><table class="WebFormTable">' + tblRepriceOtherCharge + '</table><br/><table class="WebFormTable">' + tblRepriceTax + '</table><br/></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divRepricingWindow").dialog(
             {
                 autoResize: true,
                 maxWidth: 1500,
                 maxHeight: 800,
                 width: 950,
                 height: 350,
                 modal: true,
                 title: 'Repricing Details',
                 draggable: true,
                 resizable: true,
                 buttons: {
                     Cancel: function () {
                         $(this).dialog("close");
                     }
                 },
                 close: function () {
                     $(this).dialog("close");
                 },
                 open: function () {
                     $(this).closest('div[aria-describedby="divRepricingWindow"]').css('top', '100px');
                     $(this).focus();
                 }
             });
    }

    else if ($(that).attr("data-Tstage") == "7") {
        var tbllocationdata = $(that).attr("data-event");//.split(':PrintFreightBookingDetails')[1];
        var tbllocation = '<tr><td class="formtHeaderLabel"><b>SLINo</b></td><td class="formtHeaderLabel"><b>AWBNo</b></td><td class="formtHeaderLabel"><b>HAWBNo</b></td><td class="formtHeaderLabel"><b>Pieces</b></td><td class="formtHeaderLabel"><b>Location</b></td><td class="formtHeaderLabel"><b>LotNo</b></td><td class="formtHeaderLabel"><b>StartTemperature</b></td><td class="formtHeaderLabel"><b>EndTemperature</b></td></tr>';
        //tbllocation += '<tr>';
        //for (var j = 0; j < tbllocationdata.split(';').length ; j++) {
        //    tbllocation += "<td class=\"formHeaderTranscolumn\">" + tbllocationdata.split(';')[j] + "</td>";
        //} 
        //tbllocation += '<tr>';
        var tblMultilocation = tbllocationdata.split(',');
        //var k = (tbllocationdata.split(';').length) / 7
        //var checkcount = 1;
        //var j = 0;

        for (var k = 0; k < tbllocationdata.split(',').length; k++) {
            tbllocation += '<tr>';
            for (var j = 0; j < tblMultilocation[k].split(';').length ; j++) {
                tbllocation += "<td class=\"formHeaderTranscolumn\">" + tblMultilocation[k].split(';')[j] + "</td>";
                //if (checkcount != k) {
                //    if (j != 6) {
                //        tbldimension += "<td class=\"formHeaderTranscolumn\">" + tbldimensiondata.split(';')[j] + "</td>";
                //    }
                //    else {
                //        checkcount++;
                //        j = 0;
                //    }
                //}
            } tbllocation += '</tr>';
        }


        $("head").after('<div id="divLocationWindow"><table class="WebFormTable">' + tbllocation + '</table></div>');
        // $('#divRouteWindow').append('<table class="WebFormTable">' + tblroute + '</table>')
        //<table class="WebFormTable">' + tblroute + '</table>
        //Show Popup
        $("#divLocationWindow").dialog(
             {
                 autoResize: true,
                 maxWidth: 1300,
                 maxHeight: 800,
                 width: 852,
                 height: 250,
                 modal: true,
                 title: 'Location Details',
                 draggable: true,
                 resizable: true,
                 buttons: {
                     Cancel: function () {
                         $(this).dialog("close");
                     }
                 },
                 close: function () {
                     $(this).dialog("close");
                 },
                 open: function () {
                     $(this).closest('div[aria-describedby="divLocationWindow"]').css('top', '100px');
                     $(this).focus();
                 }
             });
    }

    else {

    }
}

function LocationPopup(AWBSNo, IsImport, tstage) {


    var LocationData = {
        AWBSNo: AWBSNo,
        IsImport: IsImport,
        Tstage: tstage

    }


    var tblLocation = '<tr><td class="formSection" colspan="3"><b>AWB Location</b></td></tr> <tr><td class="formtHeaderLabel">Pcs/ULD</td><td class="formtHeaderLabel">Location</td><td class="formtHeaderLabel">Movables</td></tr>';
    $.ajax({
        // Changes By Vipin Kumar
        //url: "Services/Shipment/TrackingService.svc/GetLocationDetails?recordId=" + AWBSNo + "&IsImport=" + IsImport + "&tstage=" + tstage,
        //type: "get",
        //dataType: 'json',
        //contentType: "application/json; charset=utf-8",
        url: "Services/Shipment/TrackingService.svc/GetLocationDetails",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ locationRecord: { AWBSNo: parseInt(AWBSNo), IsImport: IsImport, Tstage: parseInt(tstage) } }),
        async: false,
        type: 'post',
        cache: false,


        //url: "Services/Shipment/AcceptanceService.svc/GetWebForm",
        //async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        //data: JSON.stringify({ model: AcceptanceGetWebForm8 }),



        //async: false,
        //type: 'post',
        //cache: false,
        // Ends
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
                /*
                tblLocation += '<tr><td class="formSection" colspan="3"><b>Location</b></td></tr> <tr><td class="formtHeaderLabel">Pcs/ULD</td><td class="formtHeaderLabel">Location</td><td class="formtHeaderLabel">Movables</td></tr>';
                $(dataTableobj.Table1).each(function (i, e) {
                    tblLocation += "<tr>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.PieceNo + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.LocationName + "</td>";
                    tblLocation += "<td class=\"formHeaderTranscolumn\">" + e.ConsumablesName + "</td>";
                    tblLocation += "<tr>";
                });
                */
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
                         buttons:
                             {
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
        //
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
/*
function CreateFlightTracking(result) {
    $("#divFlightTrackingTrans").html('');
    var data = result.FlightRecordTrans;
    var routedata = '';
    //alert(data)    //Commented By Akash Incorrect alert on  24 Aug 2017
    var tbl = '<fieldset><legend><b>Flight History:</b></legend><table id="tblConTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblFtracking").remove();

    if (result != null) {

        tbl += "<thead><th></th><th id='tdmodule'></th><th>Route</th><th> Flight Station</th><th> Flight Stage</th><th>Flight Date</th><th>Air Waybill Count</th><th>ULD Count</th><th>Message Type</th><th>Gross Weight</th><th>Volume Weight</th><th>CBM</th><th>Event Details</th><th>Event Date/Time</th><th>User</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:''; color:'''> </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].Route + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].FlightStation + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageDate + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].WayBillCount + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].ULDCount + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].MessageType + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].GrossWeight + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].VolumeWeight + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].CBM + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDetails.replace(/,/g, "<br>") + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDateTime + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";
           
            tbl += "</tr>";
        }
        tbl += "</tbody></table></fieldset>";
        $("#divFlightTrackingTrans").append(tbl);
        $('#divFlightTracking').show();

    }
    else {
        $('#divFlightTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Flight Number is incorrect", "bottom-left");
        return false;
    }
}
*/

function CreateFlightTracking(result) {

    var Data = JSON.parse(result);

    $("#divFlightTrackingTrans").html('');
    $("#tblFtracking").remove();

    $("#divFlightTrackingTrans").append(
      '<div id="FlighttHistorytabstrip"><ul> <li class="k-state-active"> <span>Flight Capacity</span> </li> <li> <span class="k-link">Operation</span>  </li> <li> <span class="k-link">Re-Route</span> </li> </ul> <div style="overflow:auto"> <div id="HistoryGridOptions"> </div> </div> <div style="overflow:auto"> <div id="OperationHistoryGridOptions"> </div> </div> <div style="overflow:auto">  <div id="ReRouteHistoryGridOptions"> </div></div></div>');

    $("#FlighttHistorytabstrip").kendoTabStrip();

    oldModel = null;
    prevColors = [];
    $('input[type="button"][value="Export to Excel"]').show();
 
    $("#HistoryGridOptions").kendoGrid({
        dataSource: new kendo.data.DataSource({
            type: "json",
            data: Data.Table0,
            //transport: {
            //    read: {
            //        url: "../schedule/viewhistory",
            //        contentType: "application/json; charset=utf-8",
            //        dataType: "json", type: "post", global: false, data: historyRequest
            //    },
            //    parameterMap: function (options) {
            //        if (options.filter == undefined)
            //            options.filter = null;
            //        if (options.sort == undefined)
            //            options.sort = null;
            //        return JSON.stringify(options);
            //    },
            //},
            schema: {
                model: {
                    fields: {
                        sector: { type: "string" },
                        UpdatedOn: { type: "date" },
                        OverCBM: { type: "number" },
                        //Volume: { type: "number" },
                        //UnitsInStock: { type: "number" }
                    }
                }
            },
            sort: {
                field: "UpdatedOn",
                dir: "desc"
            },
            group: {
                field: "Sector", aggregates: [
                    { field: "Sector", aggregate: "count" },
                    //{ field: "UpdatedOn", aggregate: "max" },
                    //{ field: "Volume", aggregate: "sum" },
                    //{ field: "UnitsOnOrder", aggregate: "average" },

                ]

            },
            aggregate: [{ field: "Sector", aggregate: "count" },
                //{ field: "UpdatedOn", aggregate: "max" },
                //{ field: "Volume", aggregate: "sum" },
                //{ field: "UnitsOnOrder", aggregate: "average" },
                //{ field: "UnitsInStock", aggregate: "min" },
                //{ field: "UnitsInStock", aggregate: "max" }
            ]

        }),
        dataBound: function (e) {
            cfi.DisplayEmptyMessage(e, this);
            var grid = this;
            var preModel = null;
            grid.table.find('tr').each(function (i) {
                var model = grid.dataItem(this);

                if ($(this).find('td').length > 5) {
                    var model = grid.dataItem(this);
                    if (preModel != null) {


                    }
                    preModel = model.toJSON();

                } else
                    preModel = null;


            });


        },
        columns: [
            {
                field: "Sector", title: "Sector", aggregates: ["count"], hidden: true,
                groupHeaderTemplate: "Sector: #= value # (Total: #= count#)   Legend<span class='lgd'><lable class='fa greenl'>Recent Update</lable><lable class='fa redl'>Earlier Update</lable></span>"
            },
            {
                headerTemplate: "<span class='hcap'>Actual Capacity</span>",
                columns: [{ field: "GrossWeight", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'GrossWeight')#" } },
                {
                    field: "Volume", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'Volume')#" },
                }]
            },
            {
                headerTemplate: "<span class='hcap'>Free Sale Capacity</span>",
                columns: [{ field: "FreeSaleGross", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'FreeSaleGross')#" } },
                {
                    field: "FreeSaleCBM", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'FreeSaleCBM')#" },
                }]
            }
            , {

                headerTemplate: "<span class='hcap'>Reserved Capacity</span>",
                columns: [{ field: "ResGross", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'ResGross')#" } },
                { field: "ResCBM", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'ResCBM')#" } }, ]
            }
            , {

                headerTemplate: "<span class='hcap'>Over Booked Capacity</span>",
                columns: [{ field: "OverGross", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'OverGross')#" } },
                { field: "OverCBM", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'OverCBM')#" } }, ]
            }, {

                headerTemplate: "<span class='hcap'>Allocated Weight</span>",
                columns: [{ field: "AllocatedGross", title: "Gross", width: 70, attributes: { class: "#=setStatus(data,'AllocatedGross')#" } },
                { field: "AllocatedVolume", title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'AllocatedVolume')#" } }, ]
            },
            {
                headerTemplate: "<span class='hcap'>Max Gross Vol Per Pcs</span>",
                columns: [{ field: "MaxGrossPerPcs", title: "Gross", width: 70, attributes: { class: "#=setStatus(data,'MaxGrossPerPcs')#" } },
                { field: "MaxVolumePerPcs", title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'MaxVolumePerPcs')#" } }, ]
            },
            {
                headerTemplate: "<span class='hcap'>Flight Information</span>",
                columns: [
                    { field: "AircraftType", title: "Aircraft Type", width: 110 },
                    { field: "ACRegNo", title: "A/C Reg. No", width: 70 },
                    { field: "FlightTypeName", title: "Flight Type", width: 80 },
                    { field: "ETD", title: "ETD", width: 50 },
                    { field: "ETA", title: "ETA", width: 50 },
                    { template: BindcheckBox('IsCancelled'), title: "Cancelled", width: 70 },
                    { template: BindcheckBox('IsDelay'), title: "Delay", width: 50 },
                    { template: BindcheckBox('IsCAO'), title: "CAO", width: 50 },
                    { template: BindcheckBox('IsBuildup'), title: "Buildup", width: 50 },
                    { template: BindcheckBox('IsLoadingInstruction'), title: "LI", width: 35 },
                    { template: BindcheckBox('IsManifested'), title: "MAN", width: 45 },
                    { template: BindcheckBox('IsDeparted'), title: "DEP", width: 40 },
                    { template: BindcheckBox('IsReRoute'), title: "Re-Route", width: 70 }
                ]
            },
            { template: BindcheckBox('IsBookingClosed'), headerTemplate: "Booking<br>Closed", width: 60 },
            {
                field: "UpdatedOn", format: "{0: dd-MMM-yyyy HH:mm:ss}", title: "Updated On", width: 140
            },
            {
                field: "UpdatedBy", title: "Updated By", width: 100
            },
            {
                field: "Remarks", title: "Remarks", width: 140
            },
        ]
    });

    $("#OperationHistoryGridOptions").kendoGrid({
       
        dataSource: new kendo.data.DataSource({
            //data: function () { return $scope.opHistoryData },
            type: "json",
            data: Data.Table1,
            schema: {
                model: {
                    fields: {
                        sector: { type: "string" },
                        EventDateTime: { type: "date" },
                    }
                }
            },
            sort: {
                field: "EventDateTime",
                dir: "desc"
            },
            group: {
                field: "Sector", aggregates: [
                    { field: "Sector", aggregate: "count" },
                ]

            },
            aggregate: [{ field: "Sector", aggregate: "count" },
            ]

        }),
        dataBound: function (e) {
            cfi.DisplayEmptyMessage(e, this);
        },
        width: 1024,
        columns: [
            {
                field: "Sector", title: "Sector", aggregates: ["count"], hidden: true,
                groupHeaderTemplate: "<span class='hcap'> Flight Station: #= value #</span> (Total: #= count#)"
            },

            { field: "StageName", headerTemplate: "Flight Stage", width: 120 },
            { field: "FlightDate", headerTemplate: "Flight Date", width: 100 },
            { field: "WaybillCount", headerTemplate: "AWB<br>Count", width: 50 },
            { field: "ULDCount", headerTemplate: "ULD<br>Count", width: 50 },
            { field: "MessageType", headerTemplate: "Message Type", width: 100 },
            { field: "ETD", headerTemplate: "ETD", width: 50 },
            { field: "ETA", headerTemplate: "ETA", width: 50 },
            { field: "GrossWeight", headerTemplate: "Gross Wt.", width: 70 },
            { field: "VolumeWeight", headerTemplate: "Volume Wt.", width: 80 },
            { field: "CBM", headerTemplate: "CBM", width: 70 },
            { template: "#=EventDetails#", headerTemplate: "Event Details", width: 300 },
            {
                field: "EventDateTime", format: "{0: dd-MMM-yyyy}", title: "Event Date", width: 140
            },
            {
                field: "EventTime", format: "{0: HH:mm:ss}", title: "Event Time", width: 140
            },
            {
                field: "UserName", title: "Updated By", width: 100
            }

        ]

    });

    $("#ReRouteHistoryGridOptions").kendoGrid({
        dataSource: new kendo.data.DataSource({
            data: Data.Table2,
        }),
        dataBound: function (e) {
            cfi.DisplayEmptyMessage(e, this);
        },
        columns: [
            { field: "Route", title: "Route" },
            { field: "UpdatedBy", title: "Created By" },
            { field: "UpdatedOn", title: "Created On" }
        ]

    });

    $("#HistoryGridOptions, #OperationHistoryGridOptions, #ReRouteHistoryGridOptions").kendoTooltip({
        filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div))",
        content: function (e) {
            var target = e.target;
           
            return $(target).text();
        }
    });
}

function BindcheckBox(field) {
    return "<div class='chkCls'><input disabled id='" + field + "#=data.uid#' class='k-checkbox' type='checkbox' #=data." + field + "=='True' ? \"checked='checked'\" : '' # /><label for='" + field + "#=data.uid#' class='k-checkbox-label' ></label></div>";
}

function setStatus(model, field) {
    if (oldModel != null && oldModel.Sector != model.Sector) {
        oldModel = null;
        prevColors = [];
    }
    if (oldModel != undefined && oldModel.uid != model.uid) {
        var output = compareVal(oldModel[field], model[field], field);
        if (field == "MaxVolumePerPcs")
            oldModel = model;
        return output;
    } else
        oldModel = model;

    return "green";
}


function compareVal(old, newval, field) {
    if (Number(old) == Number(newval)) {
        if (prevColors[field] != undefined)
            return prevColors[field];
        else
            return prevColors[field] = "green";
    }
    else {
        if (prevColors[field] != undefined && prevColors[field] == "red")
            return prevColors[field] = "green";
        else
            return prevColors[field] = "red";
    }
}

function setStatusColor(status) {
    if (status.indexOf("onfirm") > 0)
        return "green";
    else
        return "red";
}


function CreateConsolidateTracking(result) {

    var data = result.TrackingTrans;
    var routedata = '';
    //alert(data)    //Commented By Akash Incorrect alert on  24 Aug 2017
    var tbl = '<fieldset><legend>Consolidated History:</legend><table id="tblConTransCreate" class="appendGrid ui-widget">';
    var obj = result;
    $("#tblConTransCreate").remove();

    if (result.AWB != null) {
        $("#divConTracking #lblAWB").text(obj.AWB);
        $("#divConTracking #lblAWB").bind("click", function () {
            LocationPopup(obj.AWBSNo, obj.IsImportAWB, obj.TrackingStagesSNo);
        });
        $("#divConTracking #lblAWBDate").text(obj.AWBDate);
        //$("#divConTracking #lblSLI").text(obj.SLI);
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

        //$("#divConTracking #lblRepriced").text(obj.IsRepriced);
        //$("#divConTracking #lblNumberOfReprice").text(obj.NumberOfReprice);

        $("#divConTracking #lblAccepted").text(obj.AcceptedPieces);
        $("#divConTracking #lblPlanned").text(obj.PlannedPieces);
        $("#divConTracking #lblDeparted").text(obj.DepartedPieces);
        $("#divConTracking #lblLying").text(obj.LyingPieces);
        $("#divConTracking #lblLayingHeader").text('Lying at ' + userContext.AirportCode);

        tbl += "<thead><th> </th><th id='tdmodule'></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th> Airport</th><th> Date</th><th>Pieces</th><th>Gr.wt./Vol Wt.</th><th>Terminal</th><th>Event Details</th><th>Flight Info</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td id='tdmodule' style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            //hide column as per cs sir on 10th Aug 
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].CurrentAirport + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].StageDate + "</td>";
            if (data[i].StageName.toUpperCase() == "GENERATE MESSAGE" || data[i].StageName.toUpperCase() == "TELEX TYPE" || data[i].StageName.toUpperCase() == "EDI MAILBOX" || data[i].StageName.toUpperCase() == "EDI MESSAGE" || data[i].StageName.toUpperCase() == "INBOUND") {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'></td>";
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'></td>";
            } else {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Pieces + "</td>";
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Weight + "/" + data[i].VolumeWeight + "</td>";
            }
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Terminal + "</td>";
            //tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].EventDetails + "</td>";
            if (data[i].StageName.toUpperCase() == "GENERATE MESSAGE" || data[i].StageName.toUpperCase() == "TELEX TYPE" || data[i].StageName.toUpperCase() == "EDI MAILBOX" || data[i].StageName.toUpperCase() == "EDI MESSAGE" || data[i].StageName.toUpperCase() == "INBOUND") {
                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>"+ data[i].EventDetails.split('<BR/>')[0].replace(/,/g,'<br>') +"<a href=\"#\" style=\"width: 50px;color: rgb(0, 0, 255);\" onclick=\"BindActualMessagePopup(this);return false;\">" + data[i].EventDetails.split('<BR/>')[1]+ "</a><input type='hidden' id='hdnActualMessage' value ='" +data[i].ActualMessage + "'></td>";
                //eventDetails.substring(0, eventDetails.indexOf(newroutedata) - 6).replace(/,/g, '<br>') +
            } else {

                if (data[i].EventDetails.substring(0, data[i].EventDetails.indexOf('LOCATION:') + 9, 9) == 'LOCATION:') {
                    routedata = data[i].EventDetails;//.substring(data[i].EventDetails.indexOf('DIMENSION') + 10, data[i].EventDetails.length);
                    data[i].TrackingStagesSNo = 7;
                }
               else if (data[i].EventDetails.substring(0, data[i].EventDetails.indexOf('REPRICE:') + 8, 8) == 'REPRICE:') {
                    routedata = data[i].EventDetails;//.substring(data[i].EventDetails.indexOf('DIMENSION') + 10, data[i].EventDetails.length);
                    data[i].TrackingStagesSNo = 6;
                }
                else if (data[i].EventDetails.substring(0, data[i].EventDetails.indexOf('DIMENSION:') + 10, 10) == 'DIMENSION:') {
                    routedata = data[i].EventDetails;//.substring(data[i].EventDetails.indexOf('DIMENSION') + 10, data[i].EventDetails.length);
                    data[i].TrackingStagesSNo = 2;
                }
                else if (data[i].EventDetails.indexOf('CUSTOMERINFORMATION:') >= 0) {
                    routedata = data[i].EventDetails.substring(data[i].EventDetails.indexOf('CUSTOMERINFORMATION') + 20, data[i].EventDetails.length);
                    data[i].TrackingStagesSNo = 4;

                }
                else if (data[i].EventDetails.substring(0, data[i].EventDetails.indexOf('CUSTOMDETAILS:') + 14, 14) == 'CUSTOMDETAILS:') {
                    routedata = data[i].EventDetails.substring(data[i].EventDetails.indexOf('CUSTOMDETAILS') + 14, data[i].EventDetails.length);
                    data[i].TrackingStagesSNo = 3;
                }
                else if (data[i].EventDetails.indexOf('ROUTE:') >= 0) {
                    routedata = data[i].EventDetails;//.substring(data[i].EventDetails.indexOf('ROUTE') + 6, data[i].EventDetails.indexOf(', STATUS'));
                    data[i].TrackingStagesSNo = 0;

                }

                tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + BindEventDetails(data[i].IsPopup, obj.AWBSNo, data[i].EventDetails, data[i].TrackingStagesSNo, obj.IsImportAWB, routedata) + "</td>";
            }
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].FlightInfo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;'>" + data[i].EventDateTime + "</td>";
         
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].UserID + "</td>";

            tbl += "</tr>";
        }
        tbl += "</tbody></table></fieldset>";

        $("#divConTrackingTrans").append(tbl);

        $('#divConTracking').show();


    }
    else {
        $('#divConTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "AWB Prefix or AWB Number/Reference Number is incorrect", "bottom-left");
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
        tbl += "<thead><th> </th><th></th><th id='Process' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortTable()'><u>Process</u></th><th>SLI</th><th> Date</th><th>Piece</th><th>Gr.wt./Vol Wt.</th><th>Terminal</th><th>Event Details</th><th id='date' style='cursor:pointer;' onmouseleave='OriginalColor(this);' onmousemove='ChangeColor(this);' onclick='sortDate()'><u>Event Date/Time</u></th><th>Flight Info</th><th>User ID</th></thead><tbody>"
        for (var i = 0; i < data.length; i++) {
            tbl += "<tr><td style='background-color:" + data[i].BGColorCode + "; color:" + data[i].ColorCode + "'>" + data[i].ModuleName + " </td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:0%';><input type='hidden' id='hdnSequenceNo' value =" + data[i].TrackingStagesSNo + "></td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center; width:10%';>" + data[i].StageName + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align: center;width:10%'>" + data[i].SLINo + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].StageDate + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Pieces + "</td>";
            tbl += "<td id=" + i + " class='ui-widget-content' style='text-align:center;width:10%'>" + data[i].Weight + "/" + data[i].VolumeWeight + "</td>";
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
            var data = GetDataSourceV2("AWB", "History_SLINo", null);
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
            var data = GetDataSourceV2("AWB", "History_ConAWBNumber", null);
            cfi.ChangeAutoCompleteDataSource("AWB", data, true, null, "AWBNumber", "contains");

        }
    }
}

function ProcessTrack() {
    $('#divTrackingTrans').html('');
    //$("#Text_AirlineCode").val(userContext.AirlineName.split('-')[0]);
    //$("#AirlineCode").val(userContext.AirlineName.split('-')[0]);
    //$("#AWBNo").attr('maxlength', 87);
    var AWBPrefix = $("#Text_AWBPrefix").val(userContext.AirlineName.split('-')[0]);
    var AWBNumber = $("#AWBNo").val();
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
//$(document).on('paste', '#Text_AWBPrefix', function (e) {
//    if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
//        e.preventDefault()
//        var data = e.originalEvent.clipboardData.getData('Text');
//        var len = data.length;
//        if (len > 3) {
//            var resdata = data.split('-');
//            $("#Text_AWBPrefix").data("kendoAutoComplete").setDefaultValue(resdata[0], resdata[0]);
//            var outval = resdata[1].replace(/[0-9,\s]/gi, '');
//            if (outval.length == 0)
//                $("#AWBNo").val(resdata[1]);
//            $('#operation').focus();
//        }
//    }
//});

$(document).on('focus', '#Text_ConAWB', function (e) {
    if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
        $("#Text_ConAWB").attr("placeholder", "AWB Number");
    }
});
$(document).on('blur', '#Text_ConAWB', function (e) {
    //if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
    $("#Text_ConAWB").removeAttr("placeholder");//, "Max 10 AWB entries (comma separated)");
    //}
});
$(document).on('paste', '#Text_ConAWB', function (e) {
    if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
        var data = e.originalEvent.clipboardData.getData('Text');
        var outval1 = data.replace(/[0-9\s]/gi, '');
        if (outval1.length == 0)
            $("#Text_ConAWB").val(data);
        e.preventDefault();
    }
});

$(document).on('keypress', '#Text_ConAWB', function (e) {
    if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
        var regex = new RegExp("^[0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
    }
    return true;
});

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
function ConsolidatePOMailTrack() {

    $('#divPOTrackingTrans').html('');

    var POMailNo = $("#Text_POMailNo").val();
    //alert(POMailNo);
    //var AWBNo = AWBPrefix + "-" + AWBNumber;
    // var refno = $("#Text_ConRef").val();
    //if ($("input[name='BasedOn']:checked").val() == "0") {
    //    if (AWBNumber.length != 8) {
    //        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
    //        $('#divConTracking').hide();

    //        $("#tblTrans").remove();
    //        return false;
    //    }
    //}
    //else {
    //    if (refno.length != 17) {
    //        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct Reference No.", "bottom-left");
    //        $('#divConTracking').hide();

    //        $("#tblTrans").remove();
    //        return false;
    //    }
    //}
    if (POMailNo != "") {
        $.ajax({
            url: 'HtmlFiles/Shipment/Tracking/POMailTracking.html',
            success: function (result) {

                $('#divPOTracking').html(result);
                $('#divPOTracking').hide();
                BindConsolidatePOMailTrackingData();
                //BindProceeTrackingData();
            }
        });
    }
    else {
        $('#divPOTracking').hide();
        $("#tblTrans").remove();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct POMail No.", "bottom-left");
        return false;
    }

}
function ConsolidateTrack() {

    $('#divConTrackingTrans').html('');
    var AWBPrefix = $("#Text_ConAWBPrefix").val();
    var AWBNumber = $("#Text_ConAWB").val();
    var AWBNo = AWBPrefix + "-" + AWBNumber;
    var refno = $("#Text_ConRef").val();
    if ($("input[name='BasedOn']:checked").val() == "0") {
        if (AWBNumber.length != 8) {
            ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
            $('#divConTracking').hide();

            $("#tblTrans").remove();
            return false;
        }
    }
    else {
        if (refno.length != 17) {
            ShowMessage('info', 'Need your Kind Attention!', "Please enter correct Reference No.", "bottom-left");
            $('#divConTracking').hide();

            $("#tblTrans").remove();
            return false;
        }
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
function FlightExportToExcel()
{
    
    var FlightNo = $("#Text_FlightNo_input").val();
    var FlightDate = $("#txtFlightdate").val();
    
    var trackingType = $("input[name=TrackingHistoryFlight]:checked").val();

    if (FlightNo != "" && FlightDate != "") {
        //var historyExcel = {
        //    dfSNo: ["0"],
        //    FlightNo: FlightNo,
        //    FlightDate: FlightDate
        //};
        window.location.href = "../schedule/ExportToExcel?dfSNo=" + 0 + "&FlightNo=" + FlightNo + "&FlightDate=" + FlightDate
        //$.ajax({
        //    url: "../schedule/ExportToExcel",
        //    contentType: "application/json; charset=utf-8",
        //    data: JSON.stringify({ ViewHistory: historyExcel }),
        //    type: 'post',
        //    async: false,
        //    cache: false,
        //    success: function (result) {
        //        alert('Download Successfully');
        //    },
        //    error: function (err) {
        //        alert("Generated Error");
        //    }
        //});

    }
    else {
        
        ShowMessage('warning', 'Warning - Flight History!', "Flight No and Flight Date are mandatory!")
    }
}
function FlightTrack() {
    var dataTableobj = '';
    $("#tblFtracking").show();
    // var FlightNo = $("#Text_FlightNo").val();
    var FlightNo = $("#Text_FlightNo_input").val();
    var FlightDate = $("#txtFlightdate").val();
    var Origin = "";//$("#Text_FlightOrigin").val().split("-")[0];
    var Destination = "";//$("#Text_FlightDestination").val().split("-")[0];
    var trackingType = $("input[name=TrackingHistoryFlight]:checked").val();

    if (FlightNo != "" && FlightDate != "") {


        /*Commented By Pankaj Khanna ::  History Will be Come from Flight Capacity Page*/
        /* 
        $.ajax({
            url: "Services/Shipment/TrackingService.svc/GetFlightRecord",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ flightRecord: { FlightNo: FlightNo, FlightDate: FlightDate, Origin: Origin, Destination: Destination, TrackingType: trackingType } }),
            type: 'post',
            async: false,
            cache: false,
            success: function (result) {
                // dataTableobj = JSON.parse(result);
                //if (dataTableobj.Table0.length > 0) {
                //    $('#tblFtracking').appendGrid('load', dataTableobj.Table0);
                //    //$("#divFlightTracking").html(tblFtracking);     --  Commented By Akash for Updated   Tacking grid on 28 Aug 2017

                CreateFlightTracking(result);

                //}
                //else
                //    ShowMessage('warning', 'Warning - Flight History!', "Record Not Found!");
            },
            error: function (err) {
                alert("Generated Error");
            }
        });
*/

        var historyRequest =  {
            dfSNo: ["0"],
            FlightNo: FlightNo,
            FlightDate: FlightDate
        };

        $.ajax({
            url: "../schedule/viewhistory",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ViewHistory: historyRequest }),
            type: 'post',
            async: false,
            cache: false,
            success: function (result) {
                CreateFlightTracking(result);
            },
            error: function (err) {
                alert("Generated Error");
            }
        });    
    }
    else {
        $("#tblFtracking").hide();
        ShowMessage('warning', 'Warning - Flight History!', "Flight No and Flight Date are mandatory!")
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
        caption: 'Flight History',
        captionTooltip: 'Flight History',
        columns: [{ name: 'SNo', type: 'hidden' },
                  //{ name: 'TrackingStagesSNo', display: 'Tracking Stages No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                  { name: 'Route', display: 'Route', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                  //  { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                  //  { name: 'Destination', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'FlightStation', display: 'Flight Station', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'StageName', display: 'Flight Stage', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'StageDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                    { name: 'WaybillCount', display: 'Air Waybill Count', type: 'label', isRequired: false },
                    { name: 'ULDCount', display: 'ULD Count', type: 'label', isRequired: false },
                    {
                        name: 'MessageType', display: 'Message Type', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {

                            $("#txtMessageType").remove();
                            $('#Re_execute').remove();
                            cfi.PopUp("tblMessageType", "Message Type Details", "500");
                            $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tblFtracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
                            //if ($("#tbltracking_Status_" + (i + 1)).text() == 'Failed') {
                            //    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
                            //}
                            //else {

                            //    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tbltracking_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
                            //}
                        }
                    },
                      { name: 'ActualMessage', type: 'hidden', id: 'hdnActualMessage' },
                    { name: 'GrossWeight', display: 'Gross Weight', type: 'label', isRequired: false },
                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'label', isRequired: false },
                    { name: 'CBM', display: 'CBM', type: 'label', isRequired: false },
                    //{ name: 'Terminal', display: 'Terminal', type: 'label', isRequired: false },
                    { name: 'EventDetails', display: 'Event Details', type: 'label', isRequired: false },

                    { name: 'EventDateTime', display: 'Event Date/Time', type: 'label', isRequired: false },
                    { name: 'UserID', display: 'User', type: 'label', isRequired: false }],
        dataLoaded: function () {
            $("tr[id^='tblFtracking_Row']").each(function (indexInArray, valueOfElement) {

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

    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_ConAWB" || textId == "Text_ConRef") {
        try {
            cfi.setFilter(filterEmbargo, "AWBPrefix", "eq", $("#Text_ConAWBPrefix").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    else if (textId == "Text_POMailNo") {
        var POMailPrefix = '';
        if ($("#Text_POMailPrefix").val() == "") {

            POMailPrefix = "2";
        }
        else {
            POMailPrefix = $("#POMailPrefix").val();
        }


        cfi.setFilter(filterEmbargo, "MailNumber", "eq", POMailPrefix)
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
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
            data: JSON.stringify({ uldRecord: { UldStockSNo: ULDStockSNo, TrackingType: trackingType } }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
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
                if (dataTableobj.Table0.length > 0) {
                    GetULDGrid();
                    $('#tblULDtracking').appendGrid('load', dataTableobj.Table1);
                }
                else
                    ShowMessage('warning', 'Warning - ULD History!', "Record Not Found!");
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
        caption: 'ULD History',
        captionTooltip: 'ULD History',
        columns: [{ name: 'SNo', type: 'hidden' },
                  //{ name: 'TrackingStagesSNo', display: 'Tracking Stages No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                  { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'FlightDate', display: 'Date', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'CityCode', display: 'Origin', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'DestinationCity', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                    { name: 'UldStation', display: 'ULD Station', type: 'label', isRequired: false },  // added by tarun k singh
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
        //        ;
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


//function POMailTrack() {
//    $("#tblPOMailtracking").show();
//    var POMailNo = $("#Text_POMailNo").val();
//    //var trackingType = $("input[name='TrackingHistoryULD']:checked").val();

//    if ((POMailNo || 0) != 0) {
//        $.ajax({
//            url: "Services/Shipment/TrackingService.svc/GetPOMailRecord",
//            contentType: "application/json; charset=utf-8",
//            data: JSON.stringify({ POMailNo: POMailNo }),
//            async: false,
//            type: 'post',
//            cache: false,
//            success: function (result) {
//                var dataTableobj = JSON.parse(result);
//                if (dataTableobj.Table0.length > 0) {
//                    GetULDDetails();
//                    $("#lblULDCode").html(dataTableobj.Table0[0].ULDCode);
//                    $("#lblULDNo").html(dataTableobj.Table0[0].ULDNo);
//                    $("#lblContainerType").html(dataTableobj.Table0[0].ULDContainerType);
//                    $("#lblCityCode").html(dataTableobj.Table0[0].City);
//                    $("#lblAirlineCode").html(dataTableobj.Table0[0].Airline);
//                    $("#lblTareWeight").html(dataTableobj.Table0[0].TareWeight);
//                    $("#lblGross").html(dataTableobj.Table0[0].GrossCapacity);
//                    $("#lblVolume").html(dataTableobj.Table0[0].VolumeCapacity);
//                }
//                if (dataTableobj.Table0.length > 0) {
//                    GetULDGrid();
//                    $('#tblULDtracking').appendGrid('load', dataTableobj.Table1);
//                }
//                else
//                    ShowMessage('warning', 'Warning - ULD History!', "Record Not Found!");
//            },
//            //error: function (err) {
//            //    alert("Generated Error");
//            //}
//        });
//    }
//    else {
//        $('#divTracking').hide();
//        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct ULD No.", "bottom-left");
//        return false;
//    }
//}

//function GetULDGrid() {
//    $("#tblULDtracking").appendGrid({
//        caption: 'ULD History',
//        captionTooltip: 'ULD History',
//        columns: [{ name: 'SNo', type: 'hidden' },
//                  //{ name: 'TrackingStagesSNo', display: 'Tracking Stages No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//                  { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//                    { name: 'FlightDate', display: 'Date', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//                    { name: 'CityCode', display: 'Origin', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//                    { name: 'DestinationCity', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//                    { name: 'UldStation', display: 'ULD Station', type: 'label', isRequired: false },  // added by tarun k singh
//                    { name: 'StageName', display: 'ULD Stage', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//                    { name: 'StageDate', display: 'Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
//                    { name: 'WaybillCount', display: 'Air Waybill Count', type: 'label', isRequired: false },
//                    { name: 'GrossWeight', display: 'Gross Weight', type: 'label', isRequired: false },
//                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'label', isRequired: false },
//                    //{ name: 'Terminal', display: 'Terminal', type: 'label', isRequired: false },
//                    { name: 'EventDetails', display: 'Event Details', type: 'label', isRequired: false },

//                    { name: 'EventDateTime', display: 'Event Date/Time', type: 'label', isRequired: false },
//                    { name: 'UserID', display: 'User', type: 'label', isRequired: false }],
//        //dataLoaded: function () {
//        //    $("tr[id^='tblFtracking_Row']").each(function (indexInArray, valueOfElement) {
//        //        ;
//        //        var cntrl = $("#tblFtracking_EventDetails_" + (indexInArray + 1));
//        //        //var $input = $("<span>", { val: $(cntrl).text(), id: cntrl, type: "textarea", style: "width:200px;height:50px;background-color:white; ", disabled: 1 });
//        //        //$(cntrl).replaceWith($input);
//        //        $(cntrl).replaceWith("<span id='" + $(cntrl).attr("id") + "' style='word-wrap:break-word; display:block; width:330px;text-align:left'>" + $(cntrl).text().replace(/,/g, "<br>") + "</span>");
//        //    });
//        //},
//        isPaging: false,
//        hideButtons: {
//            remove: true,
//            removeLast: true,
//            insert: true,
//            append: true,
//            updateAll: true

//        }
//    });
//}
//function GetPOMailDetails() {
//    $.ajax({
//        url: 'HtmlFiles/Shipment/Tracking/ULDTracking.html',
//        async: false,
//        success: function (result) {
//            $('#divULDTracking').html(result);
//        }
//    });
//}

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

//function ExtraCondition(textId) {

//    var filterAWB = cfi.getFilter("AND");
//    if (textId == "Text_ConAWBPrefix") {
//        cfi.setFilter(filterAWB, "IsActive", "eq", 1);
//        cfi.setFilter(filterAWB, "IsInterline", "eq", 0)
//        var AutoCompleteFilter = cfi.autoCompleteFilter([filterAWB]);
//        return AutoCompleteFilter;
//    }
//};


/* // Commented By Pankaj Khanna (ExtraCondition Function Multipul exist so I am magering this code in single function)
function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_ConAWB" || textId == "Text_ConRef") {
        try {
            cfi.setFilter(filterEmbargo, "AWBPrefix", "eq", $("#Text_ConAWBPrefix").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    else if (textId == "Text_POMailNo") {
        var POMailPrefix = '';
        if ($("#Text_POMailPrefix").val() == "") {

            POMailPrefix = "2";
        }
        else {
            POMailPrefix = $("#POMailPrefix").val();
        }


        cfi.setFilter(filterEmbargo, "MailNumber", "eq", POMailPrefix)
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
}
*/

function CheckFormAction() {
    //--------------Arman ---------------
    var formAction = getQueryStringValue("FormAction")    //   $("a:contains('" + formAction + "')").click()
    // $("a:contains('" + formAction + "')").click()
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(1);
    $("#ApplicationTabs ul li a:not(:contains('" + formAction + "'))").closest('li').hide()
}

