$(document).ready(function ()
{
    $('#btnValidate').click(function ()
    {
        var TxtMessage = $('#txtmessage').val();
        if (TxtMessage == "")
        {
            ShowMessage('warning', 'Warning - EDI Message', "Message can not be blank!", "bottom-right");
            $("#mainDiv").hide();
        }
        else
        {
            $.ajax({
                url: "../Services/Common/CommonService.svc/ValidateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ MessageText: btoa(TxtMessage) }),
                contentType: "application/json; charset=utf-8",
                success: function (result)
                {
                    var ResultData = jQuery.parseJSON(result);
                    if (result.lstClsExecutionResultField != undefined || result.lstClsMessageDataField != null || result.lstClsMessageDetailsField != null)
                    {
                        if (result.lstClsExecutionResultField.length == 1)
                        {
                            bindMessageDetails(result.lstClsExecutionResultField);
                            $("#tblInfo").show();
                        }
                        else
                        {
                            $("#tblInfo").hide();
                        }
                        bindMessageData(result.lstClsMessageDataField);
                        bindNextTData(result.lstClsMessageDetailsField);
                        $("#mainDiv").show();
                        $("#txtmessages").show();
                    }
                    else
                    {
                        ShowMessage('warning', 'Warning - EDI Message', "Not a valid CIMP Format!", "bottom-right");
                        $("#mainDiv").hide();
                        $("#txtmessages").hide();
                    }
                },
                error: function (xhr)
                {
                    ShowMessage('warning', 'Warning - EDI Message', "Not a valid CIMP Format!", "bottom-right");
                }
            });
        }
    });

    PageRightsCheckVALIDATEMESSAGEVIEW()
});
function bindMessageDetails(MessageDetails)
{
    var trHTML='';
    $.each(MessageDetails, function (i, item)
    {
        trHTML =trHTML+ '<tr><td>' + item.idField + '</td><td>' + item.areaField + '</td><td>' + item.returnCodeField + '</td><td>' + item.reasonCodeField
            + '</td><td>' + item.languageField + '</td><td>' + item.techinicalDescriptionField + '</td><td>' + item.userDescriptionField + '<td></td>'
            + item.correctiveActionField + '</td><td>' + item.typeField + '</td><td>' + item.severityField + '</td><td>' + item.moduleNameField + '</td><td>' 
            + item.procNameField + '</td></tr>';
    });
    $("#tblInfoBody tr").remove();
    $('#tblInfoBody').append(trHTML);
}
function bindMessageData(MessageData)
{
    var trHTML = '';
    $.each(MessageData, function (i, item)
    {
        trHTML =trHTML+ '<tr><td>' + item.carImpRefNoField + '</td><td>' + item.messageDefinitionField + '</td><td>'
            + item.dataFoundTextField + '</td><td>' + item.sucessField + '</td><td>' + item.regexstringField + '</td><td>'
            + item.sEQNumberField + '</td><td>' + item.carImpAlphaNoField + '<td></td>' + item.lineNumberInMessageField + '</td><td>'
            + item.dataGroupIdField + '</td><td>' + item.dataElementIdField + '</td><td>'
            + item.lineIdentifierField + '</td><td>' + item.internalGroupIdField + '</td><td>' 
            + item.isRepeatableField + '</td><td>' + item.repeatCountField + '</td><td>'
            + item.minRepeatCountField + '</td><td>' + item.nextLineMessagREGEXField + '</td><td>'
            + item.repeatCarIMPIdField + '</td><td>' + item.seqOfGroupCountWithinElementField + '</td><td>'
            + item.isGroupMandatoryField + '</td><td>' + item.linesIncludedField + '</td><td>'
            + item.includedLinesMinCountField + '</td><td>' + item.includedLinesMaxCountField + '</td><td>'
            + item.includedLineRepeatConditionField + '</td><td>' + item.includedLineMessagREGEXField + '</td><td>'
            + item.isThisImmediateChildField + '</td><td>' + item.dataFoundField + '</td></tr>';
    });
    $("#tblMainBody tr").remove();
    $('#tblMainBody').append(trHTML);
}
function bindNextTData(Message)
{
    var LinesDataField = [];
    var CarimpRefIdField = [];
    var Str = ''
    $.each(Message.lLinesDataField, function (i, item)
    {
        Str = Str + ((i + 1).toString().length < 2 ? '0' + (i + 1).toString() : (i + 1).toString()) + ' - '
            + (i < Message.lCarimpRefIdField.length ? Message.lCarimpRefIdField[i] : '') + ' - ' + item + '\r\n'
    });
    var content = "Message Type         :" + ' ' + Message.lMessageTypeField + '\r\n' + "Message Var          :" +' '+ + Message.lMessageVersionField + '\r\n'
                  + "Message Line Count   :" +' '+ + Message.lLinesCountField +
                   '\r\n' + "Message Char Count   :" + ' ' + (Message.lCharaterCountField) + '\r\n' + "Message Data         :" + '\r\n' + Str;
    $('#txtmessages').val(content); 
}

var YesReady = false;
function PageRightsCheckVALIDATEMESSAGEVIEW() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Hyperlink.toString().toUpperCase() == "VALIDATEEDIMESSAGE/VALIDATEMESSAGEVIEW") {

            if (i.Hyperlink.toString().toUpperCase() == "VALIDATEEDIMESSAGE/VALIDATEMESSAGEVIEW" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Hyperlink.toString().toUpperCase() == "VALIDATEEDIMESSAGE/VALIDATEMESSAGEVIEW" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Hyperlink.toString().toUpperCase() == "VALIDATEEDIMESSAGE/VALIDATEMESSAGEVIEW" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                YesReady = true;
                CheckIsFalse = 1;
                return
            }

        }
    });

    if (YesReady) {
        $('#btnValidate').hide();

    }
}