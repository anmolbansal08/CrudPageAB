$(document).ready(function () {

    cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    $("#divareaTrans_EDI_EventMessageTransOne table tbody tr td:nth-child(4)").hide();
    validateEditEventMessageTrans();


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        BindEventMessageTrans();



    }
    if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
        BindEventMessageTrans();
        //$("#tblEventmessageTrans thead tr:nth-child(2) td:first-child").hide();
        //$("#tblEventmessageTrans thead tr:nth-child(2) td:last-child").hide();
        ////$("#tblEventmessageTrans_btnAppendRow").click(function () {
        //$("tr[id^=tblEventmessageTrans_Row]").each(function () {
        //    var id = $(this).attr("id");
        //    $("tr#" + id + " td:first").hide();
        //    //$("tr#" + id + " td:last").hide();
        //})
        ////})
    }

    $("input[name='operation']").unbind('click').click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        if (cfi.IsValidSubmitSection()) {
            GetAppendGridData();
            return true;
        }
        else {
            return false
        }
    });


}
);


function validateEditEventMessageTrans() {

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    }
}

function GetAppendGridData() {
    var res = $("#tblEventmessageTrans tr[id^='tblEventmessageTrans']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblEventmessageTrans');
    var data = $('#tblEventmessageTrans').appendGrid('getStringJson');


    $("#hdnFormData").val(JSON.stringify(JSON.parse(data)));

}


function BindEventMessageTrans() {
    var EventmessageTrans = "EventmessageTrans";
    //var GetRecord = "GetEventMessageTransRecordAppendGrid";
    var GetRecord = "GetEventMessageGridAppendGrid";

    //debugger;
    // if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {
    // GetRecord = "GetEventMessageGridAppendGrid";
    //}

    var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
    //  var controlType = getQueryStringValue("FormAction").toUpperCase() == 'DELETE' ? "Labe1" : "text";



    $('#tbl' + EventmessageTrans).appendGrid({
        tableID: 'tbl' + EventmessageTrans,
        contentEditable: true,//getQueryStringValue("FormAction").toUpperCase() != 'READ' && getQueryStringValue("FormAction").toUpperCase() != 'DELETE',
        masterTableSNo: $("#AirlineName").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: null,
        servicePath: 'Services/EDI/EventMessageTransService.svc',
        getRecordServiceMethod: GetRecord,
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: "Process",
        initRows: 1,
        isGetRecord: true,
        hideButtons: { updateAll: true, insert: true },
        //isPaging: true,
        //rowNumColumnName: 'SNo',
        columns: [{ name: 'SNo', type: 'hidden' },
                  { name: "EventName", display: "Event Name", type: controlType, ctrlAttr: { maxlength: 48, controltype: 'alphanumericupper' }, ctrlCss: { width: '150px' }, isRequired: false, tableName: "vwEventName", textColumn: "EventName", keyColumn: "SNo", filterCriteria: "contains", separator: "," },
                  { name: "SubProcessName", display: "Sub Process", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "250px" }, isRequired: false, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", separator: "," },
                  { name: "MessageType", display: "Message", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, tableName: "vwMessageType", textColumn: "MessageType", keyColumn: "SNo", filterCriteria: "contains", separator: "," },
                  { name: "MessageExecutionType", display: "Message Execution Type", type: getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "select", ctrlAttr: { maxlength: 100 }, ctrlCss: { width: "100px" }, isRequired: false, ctrlOptions: { "False": 'Manual', "True": 'Auto' } },

        ],

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblEventmessageTrans_Row']").each(function (row, tr) {

                $(tr).find("input[id^='tblEventmessageTrans_MessageType']").attr("data-valid", "required");
                $(tr).find("input[id^='tblEventmessageTrans_SubProcessName']").attr("data-valid", "required");
            });
        }
    });
    //$("#btnBack").hide();
    //$("#tblEventmessageTrans thead tr:nth-child(2) td:first-child").hide();

    //Remove requied for exist data
    //$("tr[id^=tblEventmessageTrans_Row]").each(function () {

    //    if ($(this).find("input[id^='tblEventmessageTrans_SubProcessName']").data("kendoAutoComplete").key() != "")
    //        $(this).find("input[id^='tblEventmessageTrans_SubProcessName']").removeAttr("required");

    //    if ($(this).find("input[id^='tblEventmessageTrans_MessageType']").data("kendoAutoComplete").key() != "")
    //        $(this).find("input[id^='tblEventmessageTrans_MessageType']").removeAttr("required");

    //});

    //Add row on append button
    //$("#tblEventmessageTrans_btnAppendRow").click(function () {
    //    $("tr[id^=tblEventmessageTrans_Row]").each(function () {
    //        var id = $(this).attr("id");
    //        $("tr#" + id + " td:first").hide();
    //    })
    //})





    if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        debugger;
        // $("#tblEventmessageTrans").find("input,select").attr("disabled", "disabled");

        //$("tr[id^=tblEventmessageTrans_Row]").each(function () {
        //    $(this).find("input[id^='tblEventmessageTrans_EventName']").attr("disabled", "disabled");
        //    $(this).find("input[id^='tblEventmessageTrans_SubProcessName']").attr("disabled", true);
        //    $(this).find("input[id^='tblEventmessageTrans_MessageType']").attr("disabled", true);
        //    $(".k-i-arrow-s").attr("disabled", "disabled");
        //});

    }



}
