$(document).ready(function () {

    $("#FlightDate").kendoDatePicker({
        //min: new Date(),
        format: "dd-MMM-yyyy"
    });

    $("#FlightDate").attr('readOnly', true);
    var StructureType = [{ Key: "Flat File", Text: "Flat File" }, { Key: "XML", Text: "XML" }];

    var OutboundType = [{ Key: "Text", Text: "Text" }, { Key: "File", Text: "File" }];

    cfi.AutoCompleteByDataSource("Structure", StructureType);

    cfi.AutoCompleteByDataSource("Outbound", OutboundType);


    $("#Text_Outbound").data("kendoComboBox").setDefaultValue('Text', 'Text');
    $("#Text_Structure").data("kendoComboBox").setDefaultValue('Flat File', 'Flat File');

    var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
    $("#Text_Email").after(spnlbl2);

    $('#btnSend').attr('readonly', true);

    divemail = $("<div id='divemailAdd' style='overflow:auto;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    if ($("#divemailAdd").length == 0)
        $("#EmailLabel").after(divemail);
    var spnlbl3 = $("<span class='k-label'id='SitaLabel'>(Press space key to capture receiver Sita Address and Add New Sita Address ( If Required))</span>");
    $("#Text_SitaId").after(spnlbl3);
    divsita = $("<div id='divsitaAdd' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    if ($("#divsitaAdd").length == 0)
        $("#SitaLabel").after(divsita);
    PagerightsCheckGenerateMessage()
});

$('#btnCreateMessage').click(function () {

    var MsgType = $('#Text_MsgType').val().toUpperCase();
    var MsgSeqNo = $('#Text_MsgSeqNo').val().toUpperCase();
    var SerialNo = $('#Text_SerialNo').val().toUpperCase();
    var OutputType = $('#Outbound').val().toUpperCase();
    var SaveMsgInDB = 'false'; //$('#chksavemsg').val();
    var MsgSubType = $('#Text_Subtype').val().toUpperCase();
    var Receiver = $('#Text_Receiver').val().toUpperCase();
    var ReceiverType = $('#Text_ReceiverType').val().toUpperCase();
    var StructureType = $('#Structure').val().toUpperCase();
    var FlightNo = $('#Text_FlightNo').val().toUpperCase();
    var FlightDate = $('#FlightDate').val() == '' ? '1990-01-01' : $('#FlightDate').val();
    var MsgReqIDToUpdate = $('#Text_MsgType').val().toUpperCase();
    var TxtOrigin = $('#Text_Origin').val().toUpperCase();
    var TxtDestination = $('#Text_Destination').val().toUpperCase();
    var DoubleSig = 'false';
    var TxtVersion = $('#Text_Version').val().toUpperCase();
    var Nop = '';
    var GrossWeight = '';
    var VolAmount = '';
    var EventTimeStamp = '';

    if (MsgType == '') {
        ShowMessage('warning', 'Warning - EDI Message', "Please enter message type", "bottom-right");

        return false;
    }
    else if (TxtVersion == '') {
        ShowMessage('warning', 'Warning - EDI Message', "Please enter version", "bottom-right");

        return false;
    }


    $.ajax({
        url: "../Services/Common/CommonService.svc/GenerateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageType: MsgType, SerialNo: SerialNo, SubType: MsgSubType, flightNumber: FlightNo, flightDate: FlightDate, OriginAirport: TxtOrigin, isDoubleSignature: false, version: TxtVersion, nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: MsgSeqNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //  alert(result.GenerateCIMPMessageResult);
            $('#txtmessage').val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);
            $('#btnSend').attr('readonly', false);
        }
    });



});

$('#btnSend').click(function () {


    var k = ''; var L = '';
    for (var i = 0; i < $("ul#addlist2 li span").text().split(' ').length - 1; i++) { k = k + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    for (var i = 0; i < $("ul#addlist1 li span").text().split(' ').length - 1; i++) { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }

    var Email = k.substring(0, k.length - 1);// $('#Text_Email').val();
    var SitaId = L.substring(0, L.length - 1);// $('#Text_SitaId').val();
    var Message = $('#txtmessage').val();




    if (Message == '') {
        ShowMessage('warning', 'Warning - EDI Message', "Please genearte message.", "bottom-right");
    }
    else if (($("#addlist2 li").length == 0) && ($("#addlist1 li").length == 0)) {
        ShowMessage('warning', 'Warning - Telex Type', "Either SITA Address or E-mail Address is required to process message");
    }
    else {

        var Lines = '', ActMsg = '';
        //$.each($('#txtmessage').val().split(/\n/), function (i, line) {
        //    if (line) {
        //        ActMsg = ActMsg + line + '<BR/>'
        //    }

        //});

        var Actualmessage = btoa($('#txtmessage').val());// btoa(ActMsg);

        var MessageType = $('#Text_MsgType').val();
        var SuBtype = $('#Text_Subtype').val();
        var version = $('#Text_Version').val();


        $.ajax({
            url: "/ManualEdiMessage/SendMailRequest", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ MsgType: MessageType, MsgSubType: SuBtype, TxtVersion: version, Message: Actualmessage, Email: Email, SitaId: SitaId }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result == '0') {
                    ShowMessage('success', 'Success - EDI Message', "Email Sent Successfully", "bottom-right");
                    cleardata();
                }
                else
                    ShowMessage('warning', 'Warning - EDI Message', "Email not sent.", "bottom-right");
                //  alert(result.GenerateCIMPMessageResult);
                //$('#txtmessage').val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);

            }
        });
    }

});

$('#btnClearData').click(function () {

    cleardata();
});

function cleardata() {
    $('#Text_MsgType').val('');
    $('#Text_MsgSeqNo').val('');
    $('#Text_SerialNo').val('');
    $('#Outbound').val('');
    $('#Text_Subtype').val('');
    $('#Text_Receiver').val('');
    $('#Text_ReceiverType').val('');
    $('#Structure').val('');
    $('#Text_FlightNo').val('');
    $('#FlightDate').val('');
    $('#Text_MsgType').val('');
    $('#Text_Origin').val('');
    $('#Text_Destination').val('');
    $('#Text_Version').val('');
    $('#Text_Email').val('');
    $('#Text_SitaId').val('');
    $('#txtmessage').val('');
    if ($("#addlist2 li").length > 0)
        $("#addlist2 li").remove();
    if ($("#addlist1 li").length > 0)
        $("#addlist1 li").remove();

}

//function SetEMailNew() {
// var arm = $("#Email").val().toUpperCase()
$("#Text_Email").keyup(function (e) {
    var addlen = $("#Text_Email").val().toUpperCase();
    var iKeyCode = (e.which) ? e.which : e.keyCode
    if (iKeyCode == 32) {
        addlen = addlen.slice(0, -1);
        if (addlen != "") {
            if (ValidateEMail(addlen)) {
                if ($("ul#addlist2 li").length < 10) {
                    //-------added by arman For Duplicate Email --------------
                    var abc = $("#addlist2 li span").text().split(' ')
                    if (abc.includes(addlen)) {
                        ShowMessage('warning', 'Warning - Account', "Email Already Entered");
                        $("#Text_Email").val('');
                    }
                    //---------------end
                    else {
                        var listlen = $("ul#addlist2 li").length;
                        $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                    }
                }
                else {
                    ShowMessage('warning', 'Warning - Account', "Maximum 10 E-mail Addresses allowed.");
                }
                $("#Text_Email").val('');
                // $("#Email").removeAttr('data-valid');
            }
            else {
                ShowMessage('warning', 'Warning - Account', "Please enter valid Email Address.");
                $("#Text_Email").val('');
            }
        }
    }
    else
        e.preventDefault();
});
$("#Text_Email").blur(function () {
    $("#Text_Email").val('');
});

$("#Text_SitaId").keyup(function (e) {
    var addlen = $("#Text_SitaId").val().toUpperCase();
    var iKeyCode = (e.which) ? e.which : e.keyCode
    if (iKeyCode == 32) {
        addlen = addlen.slice(0, -1);
        if (addlen != "") {

            if ($("ul#addlist1 li").length < 10) {
                //-------added by arman For Duplicate Email --------------
                var abc = $("#addlist1 li span").text().split(' ')
                if (abc.includes(addlen)) {
                    ShowMessage('warning', 'Warning - Account', "Sita Address Already Entered");
                    $("#Text_SitaId").val('');
                }
                //---------------end
                else {
                    var listlen = $("ul#addlist1 li").length;
                    $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                }
            }
            else {
                ShowMessage('warning', 'Warning - Account', "Maximum 10 Sita Addresses allowed.");
            }
            $("#Text_SitaId").val('');
            // $("#Email").removeAttr('data-valid');


        }
    }
    else
        e.preventDefault();
});
$("#Text_SitaId").blur(function () {
    $("#Text_SitaId").val('');
});
//}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

$("body").on("click", ".remove", function () {
    $(this).closest("li").remove();
});

var RightsCheck = false;
function PagerightsCheckGenerateMessage() {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.PageName.toString().toUpperCase() == "GENERATE EDI MESSAGE") {
         
                if (i.PageName.toString().toUpperCase() == "GENERATE EDI MESSAGE" && i.PageRight == "New") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.PageName.toString().toUpperCase() == "GENERATE EDI MESSAGE" && i.PageRight == "Edit") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.PageName.toString().toUpperCase() == "GENERATE EDI MESSAGE" && i.PageRight == "Delete") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                    RightsCheck = true;
                    return
                }
            
        }
    });
    if (RightsCheck) {


        $("#btnCreateMessage").hide()
        $("#btnClearData").hide()
        $("#btnSend").hide()


    }

}