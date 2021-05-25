$(document).ready(function () {
    //BindMessageTypeMaster();
    var SearchDataSource = [{ Key: "E", Text: "Outbound" }, { Key: "I", Text: "Inbound" }, { Key: "B", Text: "Both" }];//, { Key: "Transit", Text: "Transit" }
    cfi.AutoCompleteByDataSource("MessageMovementType", SearchDataSource);

    $("#tbl tr:nth-child(2) td:first input:submit").hide();

    $("[id='areaTrans_EDI_MessageTypeMasterTrans']").EnableMultiField({
    });



    $('#divareaTrans_EDI_MessageTypeMasterTrans input:text[id^="Version"]').live("keyup", function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#btnGenerate").attr("value", "Update");
    }

    $('.btn-success').first().prop('type', 'button').attr('id', 'btnGenerate');

    $("#btnGenerate").click(function (e) {
        if (cfi.IsValidSubmitSection()) {
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                SaveMessageTypeMaster();
                return false;
            }

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                UpdateMessageTypeMaster();
                return false;
            }
        }
    });
});




function SaveMessageTypeMaster() {
    var MessageTypeMasterParentInfo = new Array();
    MessageTypeMasterParentInfo.push({
        MessageType: $("#MessageType").val(),
        MessageSubType: $("#MessageSubType").val(),
        MessageMovementType: $("#MessageMovementType").val(),
        MessageDescription: $("#MessageDescription").val()
    })
    var MessageTypeMasterInfo = new Array();
    $('#divareaTrans_EDI_MessageTypeMasterTrans table:last tbody tr[id^="areaTrans_EDI_MessageTypeMasterTrans"]').each(function (row, tr) {
        MessageTypeMasterInfo.push({
            Version: $(tr).find("td").find('input:text[id^="Version"]').val()
        });

    });
    $.ajax({
        url: "Services/EDI/MessageTypeMasterService.svc/SaveMessageTypeMaster", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageTypeMasterInfo: MessageTypeMasterInfo, MessageTypeMasterParentInfo: MessageTypeMasterParentInfo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if ($(result).length==0) {
                ShowMessage('success', 'Success!', "Message Type Created Successfully");
                dirtyForm.isDirty = false;
                setTimeout(function () { navigateUrl('Default.cshtml?Module=EDI&Apps=MessageTypeMaster&FormAction=INDEXVIEW'); }, 1000);
            }
            else if ($(result)[0].indexOf("Message Type already exists") != -1) {
                ShowMessage('info', 'Need your Kind Attention!', "Message Type already exists");
                //alert("Message Type already exists");
            }

        },
        error: function (xhr) {
            debugger

        }
    });
}


function UpdateMessageTypeMaster() {


    var MessageTypeMasterInfoUpdate = new Array();
    $('#divareaTrans_EDI_MessageTypeMasterTrans table:last tbody tr[id^="areaTrans_EDI_MessageTypeMasterTrans"]').each(function (row, tr) {
        MessageTypeMasterInfoUpdate.push({
            MessageTypeVersionTransSNo: $(tr).find("td").find("input:hidden[id^='MessageTypeVersionTransSNo']").val() == "" ? 0 : $(tr).find("td").find("input:hidden[id^='MessageTypeVersionTransSNo']").val(),
            MessageTypeMasterSNo: getQueryStringValue("RecID"),//$("#MessageTypeMasterSNo").val() == "" ? 0 : $("#MessageTypeMasterSNo").val(),
            Version: $(tr).find("td").find('input:text[id^="Version"]').val()
        });
        if ($("#MessageType").val() == "" & $("#MessageDescription").val() == "" & $('input[id^="Version"]').val() == "") {
            alert("First fill all the blanks");
        }

    });
    debugger
    var JsonData = JSON.stringify({ MessageTypeMasterInfoUpdate: MessageTypeMasterInfoUpdate, MessageDescription: $("#MessageDescription").val() });
    $.ajax({
        url: "Services/EDI/MessageTypeMasterService.svc/UpdateMessageTypeMaster", async: false, type: "POST", dataType: "json", cache: false,
        data: JsonData,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if ($(result).length == 0) {
                ShowMessage('success', 'Success!', "Message Type Updated Successfully");
                dirtyForm.isDirty = false;
                setTimeout(function () { navigateUrl('Default.cshtml?Module=EDI&Apps=MessageTypeMaster&FormAction=INDEXVIEW'); }, 1000);
            }
            else if ($(result)[0].indexOf("Message Type already exists") != -1) {
                ShowMessage('info', 'Need your Kind Attention!', "Message Type already exists");
                //alert("Message Type already exists");
            }

        },
        error: function (xhr) {
            debugger

        }
    });
}



//function BindMessageTypeMaster() {
//    //pageType = 'READ';
//    var MessageTypeMaster = "MessageTypeMaster";
//    $('#tbl' + MessageTypeMaster).appendGrid({
//        tableID: 'tbl' + MessageTypeMaster,
//        contentEditable: true,
//        // contentEditable: false,
//        // tableColumns: 'SNo,CFTNumber,MawbNo,TotalPcs,TotalGrossWt,TotalCBM,NoOfBUP,ShipmentType,ForwarderName,AirlineName,IsSecure,Origin,SPHCSNo,FlightNo,Origin,Destination,FlightNo,CarrierCode',
//        masterTableSNo: 1,
//        currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
//        servicePath: './Services/Inventory/MessageTypeMasterService.svc',
//        getRecordServiceMethod: '',
//        createUpdateServiceMethod: '',
//        deleteServiceMethod: '',
//        caption: "Message Type Version",
//        initRows: 1,
//        rowNumColumnName: 'SNo',

//        columns: [{ name: 'SNo', type: 'hidden' },
//                  //{ name: "MessageType", display: "Message Type", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "default", maxlength: 12 }, isRequired: true },
//                  //{ name: 'MessageType', display: 'Message Type', type: 'text', vlaue: '0', isRequired: true, ctrlAttr: { min: '0', controltype: 'UPPERCASE', }, ctrlCss: { width: '150px' } },
//                  //{ name: 'Version', display: 'Version', type: 'text', vlaue: '0', isRequired: true, ctrlAttr: { min: '0', controltype: 'decimal2', }, ctrlCss: { width: '150px' } },
//                  { name: "Version", display: "Version", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "decimal2", maxlength: 12 }, isRequired: true }, ],
//        //hideButtons: { updateAll: true, append: true, insert: false, remove: true, removeLast: true },
//        hideButtons: { updateAll: true, append: false , insert: true, remove: true, removeLast: false },
//        isPaging: true
//    });
//    //$("#btnBack").hide();
//}