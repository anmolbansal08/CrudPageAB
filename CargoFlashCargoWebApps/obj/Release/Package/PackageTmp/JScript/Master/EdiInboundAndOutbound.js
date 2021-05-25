$(document).ready(function ()
{
    cfi.ValidateForm();
    var type = [{ Key: "Inbound", Text: "Inbound" }, { Key: "Outbound", Text: "Outbound" }, { Key: "Both", Text: "Both" }];
    var status = [{ Key: "Accepted", Text: "Accepted" }, { Key: "Rejected", Text: "Rejected" }, { Key: "Pending", Text: "Pending" }, { Key: "Processed", Text: "Processed" }, { Key: "All", Text: "All" }];
    //cfi.AutoComplete("Carrier", "CarrierCode", "Airline", "CarrierCode", "AirlineCode", ["CarrierCode", "AirlineCode"]);
    cfi.AutoComplete("Carrier", "CarrierCode,AirlineCode,AirlineName", "Airline", "CarrierCode", "AirlineCode", ["CarrierCode", "AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoCompleteByDataSource("Type", type, null, null);
    //cfi.AutoComplete("Airport", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"]);
    cfi.AutoComplete("Airport", "AirportCode,AirportName", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("MessageType", "MessageType", "vwMessageType", "MessageType", "MessageType", ["MessageType"]);
    //cfi.AutoComplete("AWBNo", "AWBNo", "vwEdiIO_AWBNo", "AWBNo", "AWBNo", ["AWBNo"]);
    cfi.AutoComplete("AWBNo", "AWBNo", "vwEdiIO_AWBNo", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");
    cfi.AutoComplete("FlightNo", "FlightNo", "vwEdiIO_FlightNo", "FlightNo", "FlightNo", ["FlightNo"]);

    $("#__SpanHeader__").css("color", "black");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    {
        //$("#Airport").val(userContext.AirportCode);
        //$("#Text_Airport").val(userContext.AirportCode + '-' + userContext.AirportName);// ;
    }

    var d = new Date();
    d.setMonth(d.getMonth());
    var todayDate = kendo.toString(kendo.parseDate(d), userContext.SysSetting.DateFormat);
    $("#ValidFrom").data("kendoDatePicker").value(todayDate);

    $("#Text_Type").data("kendoAutoComplete").key("Both");
    $("#Text_Type").data("kendoAutoComplete").value("Both");
    cfi.AutoCompleteByDataSource("Status", status, null, null);

    $("#btnRefresh").click(function (evt) {
        BindGrid();
    });
    $('#SearchEdiInboundOUtbound').click(function (evt) {
        BindGrid();
    });

});
function callMethod(i) {
    var Message = $('#txtMessageType').val();
    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/ReExecutedMessage",
        async: false,
        type: "POST",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ SNo: $("#tblEdiInboundOubound_SNo_" + i).val(), EDIBoundType: $("#tblEdiInboundOubound_EventType_" + i).text(), UpdatedMessage: Message }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == 0) {
                alert("Re-Executed Successfully!!");
            }
            else
                alert("Re-Execution failed!!");
        },
        error: function (xhr) {
            alert('warning', "Error!!!", "bottom-right");

        }
    });

}

function BindWhereCondition() {
    var d = new Date($("#ValidTo").attr("sqldatevalue"));
    d.setDate(d.getDate() + 1);
    var dd = ((parseInt(d.getDate()) < 10) ? ('0' + d.getDate()) : d.getDate());
    var mm = ((parseInt(d.getMonth() + 1) < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1));
    var toDate = d.getFullYear() + "-" + mm + "-" + dd;
    var fromDate = $("#Text_AWBNo").data("kendoAutoComplete").key() != "" ? "2015-01-01" : $("#ValidFrom").attr("sqldatevalue");
    var WhereCondition = "UpdatedAt BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
    WhereCondition += $("#Text_Carrier").data("kendoAutoComplete").key() != "" ? "AND Carrier='" + $("#Text_Carrier").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_Airport").data("kendoAutoComplete").key() != "" ? "AND CityCode='" + $("#Text_Airport").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_MessageType").data("kendoAutoComplete").key() != "" ? "AND MessageType='" + $("#Text_MessageType").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_FlightNo").data("kendoAutoComplete").key() != "" ? "AND FlightNo='" + $("#Text_FlightNo").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_AWBNo").data("kendoAutoComplete").key() != "" ? "AND AWBNo='" + $("#Text_AWBNo").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += ($("#Text_Status").data("kendoAutoComplete").key().toUpperCase() != "ALL" && $("#Text_Status").data("kendoAutoComplete").key().toUpperCase() != "") ? "AND Status='" + $("#Text_Status").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_Type").data("kendoAutoComplete").key().toUpperCase() != "BOTH" ? "AND EventType='" + $("#Text_Type").data("kendoAutoComplete").key() + "'" : "";

    return WhereCondition;
}

function loadAppendGridData()
{
    if (!cfi.IsValidForm())
    {
        return false;
    }

    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/GetEdiInboundOutbound",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            FromDate: $("#ValidFrom").val(),
            ToDate: $("#ValidTo").val(),
            Carrier: $("#Carrier").val(),
            Type: $("#Type").val(),
            MessageType: $("#Text_MessageType").val(),
            FlightNo: $("#Text_FlightNo").val(),
            AWbNo: $("#Text_AWBNo").val(),
            Airport: $("#Text_Airport").val(),
            Status: $("#Status").val()
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result)
        {
            var dataTableobj = JSON.parse(result);
            if (dataTableobj.Table0.length > 0)
                $('#tblEdiInboundOubound').appendGrid('load', dataTableobj.Table0);
            else
                ShowMessage('warning', 'Warning - EDI Inbound/Outbound Search!', "Record Not Found!");
        },
        error: function (err)
        {
            alert("Generated Error");
        }
    });
}

var wCondition = "";
function BindGrid() {
    wCondition = BindWhereCondition();
    $('#tblEdiInboundOubound').appendGrid({
        tableID: 'tblEdiInboundOubound',
        contentEditable: true,
        isGetRecord: true,
        caption: 'EDI Inbound/Outbound Search Details',
        captionTooltip: 'Edi Inbound/Outbound Search Details',
        currentPage: 1, itemsPerPage: 30, whereCondition: wCondition, sort: "",
        servicePath: 'Services/Master/EdiInboundAndOutboundService.svc',
        getRecordServiceMethod: 'GetEdiInboundOutbound',
        masterTableSNo: 1,
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
                //alert($("#tblEdiInboundOubound_Reason_" + (i + 1)).text());
                cfi.PopUp("tblMessageType", "Message Type Details", "500");
                if ($("#tblEdiInboundOubound_Reason_" + (i + 1)).text() != '') {
                    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tblEdiInboundOubound_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea><input type='button' id='Re_execute' value='Re-Execute' onclick='callMethod(" + (i + 1) + ");'></div>");
                }
                else {

                    $("#tblMessageType").append("<div style='text-align=center'><textarea id='txtMessageType' style='width:488px;height:200px'>" + $("#tblEdiInboundOubound_ActualMessage_" + (i + 1)).val().replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n") + "</textarea></div>");
                }
            }
        },
        { name: 'Status', display: 'Status', type: 'label', isRequired: false },
        { name: 'EventType', display: 'Event Type', type: 'label', isRequired: false},
        {
            name: 'Reason', display: 'Reason', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {
                //$("#tblEdiInboundOubound_Row_" + (i + 1))
                //    .css("background-color", "#ff9999");
                $(e.currentTarget).closest("tr").children('td, th').css('background', '#ff9999');
                //$("#tblEdiInboundOubound_Reason_8").closest("tr").find("td").css("background", "red")[0]
                MessageTrailPopup($("#tblEdiInboundOubound_SNo_" + (i + 1)).val(), $("#tblEdiInboundOubound_EventType_" + (i + 1)).text(), e.currentTarget);
        } },
        { name: 'ActualMessage', type: 'hidden', id: 'hdnActualMessage' },
        { name: 'SenderID', display: 'Sender/Receiver', type: 'label', isRequired: false },
        { name: 'EventDate', display: 'Received Date/Sender Date', type: 'label', isRequired: false }],
        isPaging: true,
        isExtraPaging: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }

    });
}

function PopUpOnOpen(cntrlId) {
    savetype = "ULDDETAILS";
    return false;
}

function PopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    return false;
}

function MessageTrailPopup(SNo, EDIBoundType, elementId) {
    var tblMsg = '<tr><td class="formSection" colspan="8"><b>EDI Inbound/Outbound</b></td></tr>'
        + '<tr><td class="formtHeaderLabel">Message Type</td>'
        + '<td class="formtHeaderLabel">Status</td>'
        + '<td class="formtHeaderLabel">Reason</td>'
        + '<td class="formtHeaderLabel">Sent/Received Date</td>'
        + '</tr>';
    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/GetMessageTrail?SNo=" + SNo + "&EDIBoundType=" + EDIBoundType,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                var dataTableobj = JSON.parse(result);
                //Hold Type
                $(dataTableobj.Table0).each(function (i, e) {
                    tblMsg += "<tr>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + e.MessageType + "</td>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + e.Status + "</td>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + e.Reason + "</td>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + e.ExecutionDate + "</td>";
                    tblMsg += "<tr>";
                });

                //Add Popup Div
                $("head").after('<div id="divMsgWindow"><table class="WebFormTable">' + tblMsg + '</table></div>');
                //Show Popup
                $("#divMsgWindow").dialog(
                     {
                         autoResize: true,
                         maxWidth: 1300,
                         maxHeight: 800,
                         width: 800,
                         height: 500,
                         modal: true,
                         title: 'EDI Inbound/Outbound',
                         draggable: true,
                         resizable: true,
                         buttons: {
                             Cancel: function () {
                                 $(this).dialog("close");
                                 $(elementId).closest("tr").children('td, th').css('background', '#fff');
                             }
                         },
                         close: function () {
                             $(this).dialog("close");
                             $(elementId).closest("tr").children('td, th').css('background', '#fff');
                         }
                     });
            }
        }
    });
}
