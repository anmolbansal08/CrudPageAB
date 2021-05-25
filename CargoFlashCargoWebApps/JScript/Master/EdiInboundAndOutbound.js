$(document).ready(function () {

    $('#SearchEdiInboundOUtbound').attr('class', 'btn btn-success');
    var Accepted = '';
    var Pending = '';
    var Processed = '';
    var Rejected = '';
    var todayDate = '';
    var StartTime = '';
    var EndTime = '';
    var FromDate = '';
    var ToDate = '';
    cfi.ValidateForm();
    var type = [{ Key: "Inbound", Text: "Inbound" }, { Key: "Outbound", Text: "Outbound" }, { Key: "Both", Text: "Both" }];
    var MessageFormat = [{ Key: "1", Text: "CXML" }, { Key: "0", Text: "EDI" }];
    var status = [{ Key: "Accepted", Text: "Accepted" }, { Key: "Rejected", Text: "Rejected" }, { Key: "Pending", Text: "Pending" }, { Key: "Processed", Text: "Processed" }, { Key: "All", Text: "All" }];
    //cfi.AutoComplete("Carrier", "CarrierCode", "Airline", "CarrierCode", "AirlineCode", ["CarrierCode", "AirlineCode"]);
    //cfi.AutoComplete("Carrier", "CarrierCode,AirlineCode,AirlineName", "Airline", "CarrierCode", "AirlineCode", ["CarrierCode", "AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoCompleteV2("Carrier", "CarrierCode,AirlineCode,AirlineName", "EDIMailbox_AirlineName", null, "contains");
    cfi.AutoCompleteByDataSource("Type", type, null, null);
    //cfi.AutoComplete("Airport", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"]);
    //cfi.AutoComplete("Airport", "AirportCode,AirportName", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "EDIMailbox_AirportName", null, "contains");
    cfi.AutoCompleteByDataSource("MessageFormat", MessageFormat,  null, null);
    //cfi.AutoComplete("MessageType", "MessageType", "vwMessageType", "MessageType", "MessageType", ["MessageType"]);
    cfi.AutoCompleteV2("MessageType", "MessageType", "EDIMailbox_MessageType", null, "contains",",");
    cfi.BindMultiValue("MessageType", $("#Text_MessageType").val(), $("#MessageType").val());
    //cfi.AutoComplete("AWBNo", "AWBNo", "vwEdiIO_AWBNo", "AWBNo", "AWBNo", ["AWBNo"]);
    cfi.AutoCompleteV2("AWBNo", "AirlineCode", "EDIMailbox_Airline", null, "contains");
    //cfi.AutoCompleteV2("FlightNo", "FlightNo", "EDIMailbox_FlightNo", null, "contains");
    cfi.AutoCompleteV2("CarrierCode", "CarrierCode", "FlightOpen_CarrierCode", null, "contains");
    cfi.AutoCompleteV2("Recipient", "ReceivingID", "EDIMailbox_ReceivingID", null, "contains",",");
    cfi.BindMultiValue("Recipient", $("#Text_Recipient").val(), $("#Recipient").val());

    $('#spnReportFilter').closest('td').next().html('<input type="radio" tabindex="3" data-radioval="ReportFilter" class="" name="ReportFilter" id="ReportFilter" value="1" checked="True">Generated/Received At<input type="radio" tabindex="3" data-radioval="ReportFilter" class="" name="ReportFilter" id="ReportFilter" value="2"> Processed At');
    //$("#Text_ConAWBPrefix").attr('maxlength', '3');
    //if (userContext.length) {
    $("#AWBNo").val(userContext.AirlineName.split('-')[0]);
    $("#Text_AWBNo").val(userContext.AirlineName.split('-')[0]);
    $("#CarrierCode").val(userContext.AirlineCarrierCode.split('-')[0]);
    $("#Text_CarrierCode").val(userContext.AirlineCarrierCode.split('-')[0]);

     $('#__SpanHeader__').text("EDI Mailbox");
    $("#__SpanHeader__").css("color", "black");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("input[name='InvalidRecipient']:eq(1)").attr("checked", true);
        if (userContext.GroupName.toUpperCase() == 'GSA') {
            if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
                $("#Airport").val(userContext.AirportCode);
                $("#Text_Airport").val(userContext.AirportCode + '-' + userContext.AirportName);
            
            $('#Text_Airport').data("kendoAutoComplete").enable(false);
        }
    }

        //else if ($("input[name=IsBlacklist]:radio:checked").val() == "0"){
        //        $("#Remark").closest('tr').show();
        //        $("#Remark").attr("data-valid", 'required');
        //    }
        //$("#Airport").val(userContext.AirportCode);
        //$("#Text_Airport").val(userContext.AirportCode + '-' + userContext.AirportName);// ;
    }
    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

    $("#ValidTo,#ValidFrom").closest("span").width(100);
    var d = new Date();
    d.setMonth(d.getMonth());
    todayDate = kendo.toString(kendo.parseDate(d), userContext.SysSetting.DateFormat);
    $("#ValidFrom").data("kendoDatePicker").value(todayDate);
    $('#ValidFrom').attr('readonly', true);
    $('#ValidTo').attr('readonly', true);
    $("#Text_Type").data("kendoAutoComplete").key("Both");
    $("#Text_Type").data("kendoAutoComplete").value("Both");
    cfi.AutoCompleteByDataSource("Status", status, null, null);


    /////////////////
    $("#StartTime").css('width', '100px').attr("placeholder", "Start Time");
    $("#EndTime").css('width', '100px').attr("placeholder", "End Time");
    var start = $("#StartTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");


    var end = $("#EndTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");

    $("#StartTime,#EndTime").live("keypress", function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var Charactors = ":";
        var regex = /^[0-9]*$/;
        if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    });

    ///////////////////



    $("#btnRefresh").click(function (evt) {
        BindGrid();
    });
   
}); // this is done by om




function BindInvalidRecipientGrid() {
  

    var startFlag = '';
    var EndFlag = '';
    var validStartTime = '';
    var validEndTime = '';
    if ($('#StartTime').val() == "") {
        startFlag = 0;
    }
    else {
        var x = $("#StartTime").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;

            if (i == 3)
                if (firstno >= 6)
                    value = 1;
        }
        if (value == 1 || x.length != 5 || $("#StartTime").val().search(':') == -1) {

            validStartTime = "Invalid";
        }
        startFlag = 1;
    }
    if ($('#EndTime').val() == "") {
        EndFlag = 0;
    }
    else {
        var y = $("#EndTime").val();
        var value = 0;
        for (var i = 0; i < y.length - 1; i++) {
            var firstno = y.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (y.charAt(0) == 0) {

                }
                else if (firstno >= 4 && y.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
            if (i == 3)
                if (firstno >= 6)
                    value = 1;
        }
        if (value == 1 || y.length != 5 || $("#EndTime").val().search(':') == -1) {
            validEndTime = "Invalid";
        }

        EndFlag = 1;
    }

    if ((startFlag == "1") && (validStartTime == "Invalid")) {
        $("#StartTime").val('');
        ShowMessage('info', 'Need your Kind Attention!', "Incorrect Time Format")
        checkSucess = false;
        return checkSucess;
    }
    else if ((EndFlag == "1") && (validEndTime == "Invalid")) {

        $("#EndTime").val('');
        ShowMessage('info', 'Need your Kind Attention!', "Incorrect Time Format")
        checkSucess = false;
        return checkSucess;
    }

    else {
        GetutcdateByAirportSno();
        $('#tblInvalidRecipient').appendGrid({
            V2: true,
            tableID: 'tblInvalidRecipient',
            contentEditable: true,
            isGetRecord: true,
            caption: 'Invalid Recipient',
            captionTooltip: 'Invalid Recipient',
            currentPage: 1, itemsPerPage: 20, model: BindWhereConditionForInvalidRecipient(), sort: "",
            servicePath: 'Services/Master/EdiInboundAndOutboundService.svc',
            getRecordServiceMethod: 'GetInvalidRecipient',
            masterTableSNo: 1,
            columns: [{ name: 'SNo', type: 'hidden' },
            { name: 'FileName', display: 'File Name', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            //{ name: 'FileContent', display: 'FileContent', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
             //{ name: 'ActualFileContent', type: 'hidden', id: 'hdnActualFileContent' },
             { name: 'ActualFileContent', display: 'ActualFileContent', type: 'hidden', id: 'hdnActualFileContent' },
            {
                name: 'FileContent', display: 'File Content', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {

                    $("#txtFileContent").remove();

                    //alert($("#tblInvalidRecipient_ActualFileContent_" + (i + 1)).text());tblInvalidRecipient_ActualFileContent_1
                    cfi.PopUp("tblFileContentMessageType", "File Content Details", "500");
                    $("#tblFileContentMessageType").append("<div style='text-align=center'><textarea id='txtFileContent' style='width:488px;height:200px'>" + $("#tblInvalidRecipient_ActualFileContent_" + (i + 1)).val() + "</textarea> </div>");
                    //$("#tblFileContentMessageType").append("<div style='text-align=center'><textarea id='txtFileContent' style='width:488px;height:200px'>" + $("#tblInvalidRecipient_ActualFileContent_" + (i + 1)).val() + "</textarea>" +
                    //   "  <input type='button' value='Cancel' onclick='msg()'> </div>");


                }
            },


            { name: 'ReadAt', display: 'Read At', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'Senderaddress', display: 'Sender Address', type: 'label', isRequired: false },
            { name: 'ErrorMessage', display: 'Error Message', type: 'label', isRequired: false }],


            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {


                $("#tblInvalidRecipient_divStatusMsg").closest('tr').css("display", "");
                $("#tblInvalidRecipient_divStatusMsg").css({ "font-size": "15px" });



            },
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
        if ($('#tblInvalidRecipient_Row_1').length >= 1) {

       

            $('.formSection').closest('td').append('<div id="exportflight" style="margin-left:680px;"> <span id="exportflight" ><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></span>' +
            '<form id="df1" action="../ExcelForEdi/ExportToAllExcelInvalidRecipient" method="post" style="width: 480px;margin-left: 85px;margin-top:-30px"><input id="FromDate" type="hidden" name="FromDate" value="" />' +
             '<input id="ToDate" type="hidden" name="ToDate" value="" />' +
            '<span id="exportflight"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export All To Excel" onclick="ExportToExcelAll()"></span></form></div>');
            //margin-right:456px;
            //style = "margin-right:456px;"
        }


    }

}
    $('#SearchEdiInboundOUtbound').click(function (evt) {
        if ($('input[name=InvalidRecipient]:checked').val() == "1") {
            BindGrid();
            $('#tblInvalidRecipient').html('');

        }
        else {
            $('#tblEdiInboundOubound').html('');
            BindInvalidRecipientGrid();
        }
    });
    //---------------------radio type
    $('input[type="radio"][name="InvalidRecipient"]').click(function () {
        if ($(this).val() == "1") {
            //$('#Text_Carrier').data("kendoAutoComplete").enable(true);
            //$('#Text_Airport').data("kendoAutoComplete").enable(true);
            //$('#Text_Type').data("kendoAutoComplete").enable(true);
            //$('#Text_MessageType').data("kendoAutoComplete").enable(true);
            //$('#Text_AWBNo').data("kendoAutoComplete").enable(true);
            //$('#Text_FlightNo').data("kendoAutoComplete").enable(true);
            //$('#Text_Status').data("kendoAutoComplete").enable(true);
            //$('#Text_Recipient').data("kendoAutoComplete").enable(true);
            //$("#StartTime").prop("disabled", false).addClass("k-state-disabled");
            //$("#EndTime").prop("disabled", false).addClass("k-state-disabled");
            $('#Carrier').closest('tr').show();
            $('#Text_Type').closest('tr').show();
            $('#Text_AWBNo').closest('tr').show();
            $('#Text_Status').closest('tr').show();
            $('#tblInvalidRecipient').html('');
        }
        else {
            $('#Carrier').closest('tr').hide();
            $('#Text_Type').closest('tr').hide();
            $('#Text_AWBNo').closest('tr').hide();
            $('#Text_Status').closest('tr').hide();
            $('#tblEdiInboundOubound').html('');
            //$('#Text_Carrier').data("kendoAutoComplete").enable(false);
            //$('#Text_Airport').data("kendoAutoComplete").enable(false);
            //$('#Text_Type').data("kendoAutoComplete").enable(false);
            //$('#Text_MessageType').data("kendoAutoComplete").enable(false);
            //$('#Text_AWBNo').data("kendoAutoComplete").enable(false);
            //$('#Text_FlightNo').data("kendoAutoComplete").enable(false);
            //$('#Text_Status').data("kendoAutoComplete").enable(false);
            //$('#Text_Recipient').data("kendoAutoComplete").enable(false);
            //$("#StartTime").prop("disabled", true).addClass("k-state-disabled");
            //$("#EndTime").prop("disabled", true).addClass("k-state-disabled");
        }
        // alert('yes')

    });
    //-------------end
//});
function callMethod(i) {
    var Message = $('#txtMessageType').val();
    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/ReExecutedMessage",
        type: "POST",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ SNo: $("#tblEdiInboundOubound_SNo_" + i).val(), EDIBoundType: $("#tblEdiInboundOubound_EventType_" + i).text(), UpdatedMessage: btoa(Message) }),
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
var Model = [];

function BindWhereConditionForInvalidRecipient() {
    Model = {
        FromDate: FromDate,
        ToDate: ToDate
    }
    return Model;
}

function BindWhereCondition() {
    var d = new Date($("#ValidTo").attr("sqldatevalue"));
    d.setDate(d.getDate());
    var usersno = userContext.UserSNo;
    var AirportSNo = userContext.AirportSNo;
    StartTime = $("#StartTime").val();
    EndTime = $("#EndTime").val();
    var dd = ((parseInt(d.getDate()) < 10) ? ('0' + d.getDate()) : d.getDate());
    var mm = ((parseInt(d.getMonth() + 1) < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1));
    var toDate = d.getFullYear() + "-" + mm + "-" + dd;
    var fromDate = $("#Text_AWBNo").data("kendoAutoComplete").key() != "" ? "2015-01-01" : $("#ValidFrom").attr("sqldatevalue");
    var FlightDate = $("#FlightDate").attr("sqldatevalue");
    var awbnumber = $("#AWBNumber").val() != "" && $("#Text_AWBNo").data("kendoAutoComplete").key() != "" ? $("#Text_AWBNo").data("kendoAutoComplete").key() + '-' + $("#AWBNumber").val() : "";
    var FlightNo = $("#FlightNumber").val() != "" && $("#Text_CarrierCode").data("kendoAutoComplete").key() != "" ? $("#Text_CarrierCode").data("kendoAutoComplete").key() + '-' + $("#FlightNumber").val() : "";
    Model = {
        FromDate: FromDate,
        ToDate: ToDate,
        Carrier: $("#Text_Carrier").data("kendoAutoComplete").key(),
        CityCode: $("#Text_Airport").data("kendoAutoComplete").key(),
        MessageTypeCheck: $("#MessageType").val(),
        MessageType: $("#Text_MessageType").data("kendoAutoComplete").key(),
        FlightNo: FlightNo,
        AWBNo: awbnumber,
        Status: $("#Text_Status").data("kendoAutoComplete").key(),
        EventType: $("#Text_Type").data("kendoAutoComplete").key().toUpperCase() != "BOTH" ? $("#Text_Type").data("kendoAutoComplete").key() : "",
        SenderID: $("#Text_Recipient").data("kendoAutoComplete").key(),
        FlightDate: FlightDate,
        MessageFormat: $("#Text_MessageFormat").data("kendoAutoComplete").key(),
        Reportfilter: $('input:radio[name=ReportFilter]:checked').val()
    }
    return Model;
    /* --Commented By Pankaj khanna 1-OCT-2017

    // var WhereCondition = "UpdatedAt BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
    var WhereCondition = '';
   // if (StartTime != '' && EndTime != '' && StartTime != '00:00' && EndTime != '00:00')
    //if (StartTime != '' && EndTime != '') {
       // WhereCondition = "cast(convert(varchar(17),cast(dbo.fnDateByUserSNo(EventDate, 'L'," + usersno + ") as datetime))as datetime) Between'" + fromDate + ' ' + StartTime + "' AND '" + toDate + ' ' + EndTime + "' ";
     //  WhereCondition = "cast(EventDate as date) Between cast('"  + fromDate + ' ' + StartTime + "' as Date) AND cast('" + toDate + ' ' + EndTime + "' as Date) ";
       // WhereCondition = "updatedat Between dbo.fn_GetATAGMT('" + fromDate + "' ,'" + StartTime + "'," + AirportSNo + ") AND dbo.fn_GetATAGMT('" + toDate + "' ,'" + EndTime + "'," + AirportSNo + ")";

        WhereCondition = "cast(updatedat as datetime) Between cast('" + FromDate + "' as datetime) AND cast('" + ToDate + "' as datetime)";
    //}
    //else {
       

      
    //    WhereCondition = "cast(updatedat as date) Between cast('" + fromDate + ' ' + '00:00' + "' as Date) AND cast('" + toDate + ' ' + '00:00' + "' as Date) ";
    //    //WhereCondition = "cast(EventDate as date) Between cast('" + fromDate + ' ' + '00:00' + "' as Date) AND cast('" + toDate + ' ' + '00:00' + "' as Date) ";
    //  //  WhereCondition = " cast (EventDate as date) Between'" + fromDate + ' ' + '00:00' + "' AND '" + toDate + ' ' + '00:00' + "' ";
    //}
    WhereCondition += $("#Text_Carrier").data("kendoAutoComplete").key() != "" ? "AND Carrier='" + $("#Text_Carrier").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_Airport").data("kendoAutoComplete").key() != "" ? "AND CityCode='" + $("#Text_Airport").data("kendoAutoComplete").key() + "'" : "";
    if ($("#MessageType").val() == "FSU") {
        WhereCondition += $("#Text_MessageType").data("kendoAutoComplete").key() != "" ? "AND MessageType like'" + $("#Text_MessageType").data("kendoAutoComplete").key() + "%'" : "";

    }
    else {

        WhereCondition += $("#Text_MessageType").data("kendoAutoComplete").key() != "" ? "AND MessageType='" + $("#Text_MessageType").data("kendoAutoComplete").key() + "'" : "";
    }

    WhereCondition += $("#Text_FlightNo").data("kendoAutoComplete").key() != "" ? "AND FlightNo='" + $("#Text_FlightNo").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_AWBNo").data("kendoAutoComplete").key() != "" ? "AND AWBNo='" + $("#Text_AWBNo").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += ($("#Text_Status").data("kendoAutoComplete").key().toUpperCase() != "ALL" && $("#Text_Status").data("kendoAutoComplete").key().toUpperCase() != "") ? "AND Status='" + $("#Text_Status").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_Type").data("kendoAutoComplete").key().toUpperCase() != "BOTH" ? "AND EventType='" + $("#Text_Type").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_Recipient").data("kendoAutoComplete").key() != "" ? "AND SenderID='" + $("#Text_Recipient").data("kendoAutoComplete").key() + "'" : "";

    return btoa(WhereCondition);
    */
}

function loadAppendGridData() {
    if (!cfi.IsValidForm()) {
        return false;
    }

    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/GetEdiInboundOutbound",
        //url: "Services/Master/EdiInboundAndOutboundService.svc/GetEdiInboundOutbound_Fortest1",
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
        success: function (result) {
            var dataTableobj = JSON.parse(result);
            if (dataTableobj.Table0.length > 0) {
                $('#tblEdiInboundOubound').appendGrid('load', dataTableobj.Table0);

               
            }
            else
                ShowMessage('warning', 'Warning - EDI Inbound/Outbound Search!', "Record Not Found!");
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}

var wCondition = "";
var checkSucess = true;
function BindGrid() {
    //  var usersno = userContext.UserSNo;
    StartTime = $("#StartTime").val();
    EndTime = $("#EndTime").val();
    var startFlag = '';
    var EndFlag = '';
    var validStartTime = '';
    var validEndTime = '';
    if ($('#StartTime').val() == "") {
        startFlag = 0;
    }
    else {
        var x = $("#StartTime").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;

            if (i == 3)
                if (firstno >= 6)
                    value = 1;
        }
        if (value == 1 || x.length != 5 || $("#StartTime").val().search(':') == -1) {

            validStartTime = "Invalid";
        }
        startFlag = 1;
    }
    if ($('#EndTime').val() == "") {
        EndFlag = 0;
    }
    else {
        var y = $("#EndTime").val();
        var value = 0;
        for (var i = 0; i < y.length - 1; i++) {
            var firstno = y.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (y.charAt(0) == 0) {

                }
                else if (firstno >= 4 && y.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
            if (i == 3)
                if (firstno >= 6)
                    value = 1;
        }
        if (value == 1 || y.length != 5 || $("#EndTime").val().search(':') == -1) {
            validEndTime = "Invalid";
        }

        EndFlag = 1;
    }
    if ($('#ValidFrom').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Valid From Date")
        checkSucess = false;
        return checkSucess;
    }
    else if ($('#ValidTo').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Valid To Date")
        checkSucess = false;
        return checkSucess;
    }

    else if ($('#Text_Type').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Type")
        checkSucess = false;
        return checkSucess;
    }
    else if ($('#Text_Type').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Type")
        checkSucess = false;
        return checkSucess;
    }
        // else if ((startFlag == "1") && (StartTime.indexOf(':') == "-1"))
    else if ((startFlag == "1") && (validStartTime == "Invalid")) {
        $("#StartTime").val('');
        ShowMessage('info', 'Need your Kind Attention!', "Incorrect Time Format")
        checkSucess = false;
        return checkSucess;
    }
    else if ((EndFlag == "1") && (validEndTime == "Invalid")) {

        $("#EndTime").val('');
        ShowMessage('info', 'Need your Kind Attention!', "Incorrect Time Format")
        checkSucess = false;
        return checkSucess;
    }
        //else if (StartTime != '' && EndTime != '' && StartTime != '00:00' && EndTime != '00:00')
        //{
        //    var start0 = $('#StartTime').val().split(":")[0];
        //    var start1 = $('#StartTime').val().split(":")[1];
        //    var end0 = $('#EndTime').val().split(":")[0];
        //    var end1 = $('#EndTime').val().split(":")[1];
        //    var sumstart = start0 + start1;
        //    var sumend = end0 + end1;
        //    if (parseInt(sumstart) > parseInt(sumend))
        //    {

        //        ShowMessage('info', 'Need your Kind Attention!', " Start Time can not be greater than End Time ")
        //        checkSucess = false;
        //        return checkSucess;
        //    }
        //    else {
        //        checkSucess = true;
        //        return checkSucess;
        //    }

        //}

    else {
        //if (checkSucess == true)
        //{

        $('#exportflight').remove();
        $('#exportflight1').remove();
        StartTime = $("#StartTime").val();
        EndTime = $("#EndTime").val();

        GetutcdateByAirportSno();
        $("#tblEdiInboundOutbound").css("width:100%;")



        // wCondition = BindWhereCondition();
        $('#tblEdiInboundOubound').appendGrid({
            V2: true,
            tableID: 'tblEdiInboundOubound',
            contentEditable: true,
            isGetRecord: true,
            caption: 'EDI Mailbox',
            captionTooltip: 'EDI Mailbox',
            currentPage: 1, itemsPerPage: 20, model: BindWhereCondition(), sort: "",
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
               { name: 'MessageVersion', display: 'Message Version', type: 'label', isRequired: false },
            { name: 'Status', display: 'Status', type: 'label', isRequired: false },
            { name: 'EventType', display: 'Event Type', type: 'label', isRequired: false },
            {
                name: 'Reason', display: 'Reason', type: 'label', ctrlCss: { width: '50px', 'color': '#0000FF', cursor: 'pointer' }, isRequired: false, onClick: function (e, i) {
                    //$("#tblEdiInboundOubound_Row_" + (i + 1))
                    //    .css("background-color", "#ff9999");
                    $(e.currentTarget).closest("tr").children('td, th').css('background', '#ff9999');
                    //$("#tblEdiInboundOubound_Reason_8").closest("tr").find("td").css("background", "red")[0]
                    MessageTrailPopup($("#tblEdiInboundOubound_SNo_" + (i + 1)).val(), $("#tblEdiInboundOubound_EventType_" + (i + 1)).text(), e.currentTarget);
                }
            },
            { name: 'ActualMessage', type: 'hidden', id: 'hdnActualMessage' },
            { name: 'SenderID', display: 'Sender/Receiver', type: 'label', ctrlCss: {"width":"20%","text-align":"left","white-space":"pre-wrap",   "max-width":"20px;","word-wrap":"break-word;"}, isRequired: false },
            { name: 'EventDate', display: 'Generated/Received At', type: 'label', isRequired: false },
              { name: 'ProcessedAt', display: 'Processed At', type: 'label', isRequired: false }
            ],
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                //  $("#tblCreditLimitReport_divStatusMsg").text().replace(' 1 to 10 of', '');
                //$("#tblCreditLimitReport_divStatusMsg").text('');
                //  $('#SearchEdiInboundOUtbound').closest('td').append('<div id="exportflight" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></div>');
                //   $('#exportflight').append('<div id="exportflight1" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To ExcelAll" onclick="ExportToExcelAll()"></div>');
                //
                $("#tblEdiInboundOubound_divStatusMsg").closest('tr').css("display", "");
                $("#tblEdiInboundOubound_divStatusMsg").css({ "font-size": "15px" });

                // GetStatus();

            },
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
        if ($('#tblEdiInboundOubound_Row_1').length >= 1) {
            GetStatus();
            $('.formSection').closest('td').append('<span id="tblEdiInboundOubound_Total" class="pg-normal" title="Total Message" >Total Message:</span><span id="tblEdiInboundOubound_TotalRecords" class="pg-normal" title="Total" ></span>');

            // $('#tblEdiInboundOubound_TotalRecords').closest('td').append('<span id="tblEdiInboundOubound_Accepted" class="pg-normal" title="Total Accepted " >Accepted:</span><span id="tblEdiInboundOubound_TotalRecordsAccepted" class="pg-normal" title="Accepted" ></span>');
            $('#tblEdiInboundOubound_TotalRecords').closest('td').append('<span id="tblEdiInboundOubound_Pending" class="pg-normal" title="Total Pending " >Pending:</span><span id="tblEdiInboundOubound_TotalRecordsPending" class="pg-normal" title="Pending" ></span>');
            $('#tblEdiInboundOubound_TotalRecordsPending').closest('td').append('<span id="tblEdiInboundOubound_Processed" class="pg-normal" title="Total Processed " >Processed:</span><span id="tblEdiInboundOubound_TotalRecordsProcessed" class="pg-normal" title="Pending" ></span>');
            $('#tblEdiInboundOubound_TotalRecordsProcessed').closest('td').append('<span id="tblEdiInboundOubound_Rejected" class="pg-normal" title="Total Rejected " >Rejected:</span><span id="tblEdiInboundOubound_TotalRecordsPRejected" class="pg-normal" title="Rejected" ></span>');
            //$('#SearchEdiInboundOUtbound').closest('td').append('<div id="exportflight" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></div>');
            //$('#exportflight').append('<div id="exportflight" style="margin-left: 50px; margin-top: -30px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export All to Excel" onclick="ExportToExcelAll()"></div>');

            $('#tblEdiInboundOubound_TotalRecordsProcessed').closest('td').append('<div style="float: right;width: 511px;"><span id="exportflight" ><img id=" imgexcel" src="../Images/IconExcel.png" style="height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></span> ' +
           '<form id="df" action="../ExcelForEdi/DataSetToAllExcelFile" method="post" style="width: 480px;float: right;"><input id="FromDate" type="hidden" name="FromDate" value="" />' +
                        '<input id="ToDate" type="hidden" name="ToDate" value="" />' +
                        '<input id="Carrier" type="hidden" name="Carrier" value="" />' +
                        '<input id="EventType" type="hidden" name="EventType" value="" />' +
                        '<input id="MessageTypeCheck" type="hidden" name="MessageTypeCheck" value="" />' +
                        '<input id="MessageType" type="hidden" name="MessageType" value="" />' +
                        '<input id="FlightNo" type="hidden" name="FlightNo" value="" />' +
                        '<input id="AWBNo" type="hidden" name="AWBNo" value="" />' +
                        '<input id="CityCode" type="hidden" name="CityCode" value="" />' +
                        '<input id="Status" type="hidden" name="Status" value="" />' +
                        '<input id="SenderID" type="hidden" name="SenderID" value="" />' +
                    '<span id="exportflight" style="margin-left: 50px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export All To Excel" onclick="ExportToExcelAll()"></span></form></div>');
            // '<span id="exportflight" style="margin-left: 50px;"><button type="submit"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export All To Excel" onclick="ExportToExcelAll()"></span></button></form></div>');
            $('#tblEdiInboundOubound_TotalRecords').text($("#tblEdiInboundOubound_divStatusMsg").text().split(" ")[5]);
            //  $('#tblEdiInboundOubound_TotalRecordsAccepted').text(Accepted);
            $('#tblEdiInboundOubound_TotalRecordsPending').text(Pending);
            $('#tblEdiInboundOubound_TotalRecordsProcessed').text(Processed);
            $('#tblEdiInboundOubound_TotalRecordsPRejected').text(Rejected);

            //for (var i = 0; i < data.length; i++)
            //{
            //    var str=     $("[id=tblEdiInboundOubound_Status_1]").text();
            //}

                $('#tblEdiInboundOubound tbody tr').each(function (id) {
                    if ($(this).find('#tblEdiInboundOubound_MessageType_' + (id + 1)).text() == 'FSU-RCF') {
                        var MasterVal = $(this).find('#tblEdiInboundOubound_ActualMessage_' + (id + 1)).val().split('RCF');
                        if ($(this).find('#tblEdiInboundOubound_ActualMessage_' + (id + 1)).val() !='')  //changes by shahbaz akhtar - 2017-11-30
                        $(this).find('#tblEdiInboundOubound_ActualMessage_' + (id + 1)).val(MasterVal[0] + 'RCF' + MasterVal[(MasterVal.length - 1)]);
                        //alert(MasterVal[0] + 'RCF' + MasterVal[(MasterVal.length - 1)]);
                    }
                });
            


        }

        //  $('#SearchEdiInboundOUtbound').closest('td').append('<div id="exportflight" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></div>');
        //   $('#exportflight').append('<div id="exportflight" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To ExcelAll" onclick="ExportToExcelAll()"></div>');
        //$('#exportflight').closest('td').after('<div id="exportflight1" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel1" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To ExcelAll" onclick="ExportToExcelAll()"></div>');

        // }
    }
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
function GetStatus() {
    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/GetAllStatus",
        async: false,
        type: "Post",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            model: BindWhereCondition(),
        }),

        cache: false,
        success: function (result) {
            //var dataTableobj = JSON.parse(result);

            var Finalresult = JSON.parse(result).Table0;
            if (Finalresult.length > 0) {
                // Accepted = Finalresult[0].Accepted;
                Pending = Finalresult[0].Pending;
                Processed = Finalresult[0].Processed;
                Rejected = Finalresult[0].Rejected;

            }
            else {


            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}

///////////////////////

function GetutcdateByAirportSno() {
    var st = '';
    var et = '';
    if ($("#StartTime").val() != '') {
        st = $("#StartTime").val();

    }
    else {
        st = "00:00";

    }
    if ($("#EndTime").val() != '') {
        et = $("#EndTime").val();

    }

    else {
        et = "23:59";

    }

    var Model = {
        FromDate: $("#ValidFrom").val(),
        ToDate: $("#ValidTo").val(),
        StartTime: st,
        EndTime: et,
        AirportSNo: userContext.AirportSNo
    };
    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/GetutcdateByAirportSno",
        async: false,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Model: Model }),

        cache: false,
        success: function (result) {
            //var dataTableobj = JSON.parse(result);

            var Finalresult = JSON.parse(result).Table0;

            if (Finalresult.length > 0) {

                FromDate = Finalresult[0].FromDate1;
                ToDate = Finalresult[0].ToDate1;


            }
            else {


            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}

/////////////////




function MessageTrailPopup(SNo, EDIBoundType, elementId) {
    var tblMsg = '<tr><td class="formSection" colspan="8"><b>EDI Inbound/Outbound</b></td></tr>'
        + '<tr><td class="formtHeaderLabel">Message Type</td>'
        + '<td class="formtHeaderLabel">Status</td>'
        + '<td class="formtHeaderLabel">Reason</td>'
        + '<td class="formtHeaderLabel">Sent/Received Date</td>'
        + '</tr>';
    var Model = {
        SNo: SNo,
        EDIBoundType: EDIBoundType
    };

    $.ajax({
        url: "Services/Master/EdiInboundAndOutboundService.svc/GetMessageTrail",
        type: "POST",
        data: JSON.stringify({ Model: Model }),
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
    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';
    //----remove hiiden field column-------------------
    //  $("#tblEdiInboundOubound tbody tr").find('td:last').remove();
    // $("#tblEdiInboundOubound thead tr td:last").remove();
    // var i = $("#tblEdiInboundOubound tbody tr").length;
    //  
    if ($('input[name=InvalidRecipient]:checked').val() == "1") {
        $("#tblEdiInboundOubound tbody tr[id *='tblEdiInboundOubound_Row_']").each(function () {
            var i = this.id.split('_')[2];
            var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
            $(this).attr('style', 'background-color:' + co);
        });
        //------- end---------------------------------------
        var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblEdiInboundOubound thead tr:eq(1)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblEdiInboundOubound tbody').html() + '</tbody></table></body></html>';
        var table_html = table_div.replace(/ /g, '%20');
        a.href = data_type + ', ' + table_html;
        a.download = 'EDI_Mailbox_' + today + '_.xls';
    }
    else {
        $("#tblInvalidRecipient tbody tr[id *='tblInvalidRecipient_Row_']").each(function () {
            var i = this.id.split('_')[2];
            var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
            $(this).attr('style', 'background-color:' + co);
        });
        //------- end---------------------------------------
        var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblInvalidRecipient thead tr:eq(1)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblInvalidRecipient tbody').html() + '</tbody></table></body></html>';
        var table_html = table_div.replace(/ /g, '%20');
        a.href = data_type + ', ' + table_html;
        a.download = 'InvalidRecipient_' + today + '_.xls';

    }
    a.click();
}


function ExportToExcelAll() {
    if ($('input[name=InvalidRecipient]:checked').val() == "1") {
        $('#df #FromDate').val(Model.FromDate);
        $('#df #ToDate').val(Model.ToDate);
        $('#df #Carrier').val(Model.Carrier);
        $('#df #EventType').val(Model.EventType);
        $('#df #MessageTypeCheck').val(Model.MessageTypeCheck);
        $('#df #MessageType').val(Model.MessageType);
        $('#df #FlightNo').val(Model.FlightNo);
        $('#df #AWBNo').val(Model.AWBNo);
        $('#df #CityCode').val(Model.CityCode);
        $('#df #Status').val(Model.Status);
        $('#df #SenderID').val(Model.SenderID);
        $('#df').submit();
    }

    else {
        $('#df1 #FromDate').val(Model.FromDate);
        $('#df1 #ToDate').val(Model.ToDate);
        $('#df1').submit();

    }
    //window.location.href = "../ExcelForEdi/DataSetToAllExcelFile?whereCondition=" + wCondition;
}

$("#ValidFrom").kendoDatePicker({

    change: clearDate
});

//$("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
//$("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

//$("#ValidTo,#ValidFrom").closest("span").width(100);
//$("#ValidFrom").data('kendoDatePicker').min(todaydate);
//$("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
function clearDate() {
    if ($("#ValidTo").data('kendoDatePicker').value() < $("#ValidFrom").data('kendoDatePicker').value()) {
        $("#ValidTo").data('kendoDatePicker').value('');
    }

    $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());

    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

    $("#ValidTo,#ValidFrom").closest("span").width(100);

}

$("#AWBNumber").on("keypress keyup", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});


function msg() {
    alert("Hello world!");
   // cfi.PopUp.close();

}

function CheckAWB()
{
    var AWBNumber = $("#AWBNumber").val();
    if (AWBNumber.length != 8 && AWBNumber.length > 0) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        $("#AWBNumber").val('');
        $("#_tempAWBNumber").val('');
      
        return false;
    }
}

function CheckFlightNumber() {
    var FlightNumber = $("#FlightNumber").val();
    if (FlightNumber.length < 1) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct Flight No.", "bottom-left");
        $("#FlightNumber").val('');
        $("#_tempFlightNumber").val('');

        return false;
    }
}
//function CheckTimeFormat() {
//    if ($("#Text_IssuedTime").val() != '') {
//        var x = $("#Text_IssuedTime").val();
//        var value = 0;
//        for (var i = 0; i < x.length - 1; i++) {
//            var firstno = x.charAt(i);
//            if (i == 0)
//                if (firstno >= 3)
//                    value = 1;
//            if (i == 1)
//                if (x.charAt(0) == 0) {

//                }
//                else if (firstno >= 4 && x.charAt(0) != 1)
//                    value = 1;
//            if (i == 2)
//                if (firstno >= 6)
//                    value = 1;
//        }

//        if (value == 1 || x.length != 5 || $("#Text_IssuedTime").val().search(':') == -1) {
//            $("#Text_IssuedTime").val('');
//            alert('Please enter correct format Time');
//            return false;
//        }

//    }
//}
/******************* ADD BY DEVENDRA  FOR TASK 17488 **************************/
function ExtraParameters(id) {
    var param = [];
    if (id == "Text_CarrierCode") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}
/***************************************************************************/