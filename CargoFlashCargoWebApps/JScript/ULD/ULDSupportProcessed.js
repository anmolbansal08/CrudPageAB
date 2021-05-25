$(document).ready(function ()
{
    ULDSupportProcessedDetails();
});
function ULDSupportProcessedDetails()
{
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var dbtableName = 'ULDSupportProcessed';
    $('#tbl' + dbtableName).appendGrid({
        tableID: 'tbl' + dbtableName,
        contentEditable: true,
        masterTableSNo:1,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: './Services/ULD/ULDSupportProcessedService.svc',
        getRecordServiceMethod: "GetULDSupportProcessedRecord",
        caption: 'ULD Support Processed Details',
        initRows: 1,
        columns: [
            { name: 'ULDSupportRequestAssignTransSNo', type: 'hidden' },
            { name: 'ULDSupportRequestSno', type: 'hidden' },
            { name: 'ULDSupportRequestQTY', type: 'hidden' },
            { name: 'RequestRefNo', display: 'Request Ref. No', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '100px' } },
            { name: 'RequestBy', display: 'Requested By', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '100px' } },
            { name: 'ULDType', display: 'ULD Type', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '100x' } },
            { name: 'RequestQTY', display: 'Request QTY.', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '100px' } },
            { name: 'ProcessedQTY', display: 'Processed QTY.', type: 'text', ctrlAttr: { controltype: 'number', maxlength:6 }, ctrlCss: { width: '80px' }, isRequired: true },
            //{ name: 'AssignedTo', display: 'Assigned To', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '100px' } },
            { name: 'InitiateRemarks', display: 'Initiate Remarks', type: 'label', ctrlAttr: { controltype: 'label', onblur: '' }, ctrlCss: { width: '350px', height: '30px' }, isRequired: false },
            { name: 'Remarks', display: 'Remarks', type: 'text', ctrlAttr: { controltype: 'text', onblur: '',controltype: 'alphanumericupper', allowchar: "" }, ctrlCss: { width: '350px', height: '30px' }, isRequired: true },
            { name: 'UpdatedBy', display: 'Process By', type: 'label', ctrlAttr: { controltype: 'label', onblur: '' }, ctrlCss: { width: '350px', height: '30px' }, isRequired: false },
            { name: 'UpdatedOn', display: 'Process date', type: 'label', ctrlAttr: { controltype: 'label', onblur: '' }, ctrlCss: { width: '350px', height: '30px' }, isRequired: false },
            { name: 'ClosedOn', display: 'Closed date', type: 'label', ctrlAttr: { controltype: 'label', }, ctrlCss: { width: '80px' }, },
            { name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 7, controltype: 'button', onclick: "return UpdateULDSupportProcessed(this.id);" }, ctrlCss: { width: '50px' } },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblULDSupportProcessed_Row_']").each(function (row, tr) {
                $(tr).find("input[id^='tblULDSupportProcessed_ProcessedQTY_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblULDSupportProcessed_Action_']").attr('value', 'Update');
                $(tr).find("input[id^='tblULDSupportProcessed_Action_']").addClass("ui-button-text");
            });
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
     $("tr[id^='tblULDSupportProcessed_Row_']").each(function (row, tr) {
         $(tr).find("input[id^='tblULDSupportProcessed_ProcessedQTY_']").attr("data-valid", "required");
         $(tr).find("input[id^='tblULDSupportProcessed_Action_']").attr("value", "Update");
         $(tr).find("input[id^='tblULDSupportProcessed_Action_']").addClass("ui-button-text");

         if (($(tr).find("input[id^='tblULDSupportProcessed_ProcessedQTY_']").val() > 0) ||( $(tr).find("input[id^='tblULDSupportProcessed_Remarks_']").val() != ""))
         {
             $(tr).find("input[id^='tblULDSupportProcessed_ProcessedQTY_']").attr("readonly", true);
             $(tr).find("input[id^='tblULDSupportProcessed_Remarks_']").attr("readonly", true);
             $(tr).find("input[id^='tblULDSupportProcessed_ProcessedQTY_']").css("background-color", "white");
             $(tr).find("input[id^='tblULDSupportProcessed_Remarks_']").css("background-color", "white");
             $(tr).find("input[id^='tblULDSupportProcessed_Action_']").hide();
         }
     });
}
function UpdateULDSupportProcessed(input)
{
    var ClosestTr = $("#" + input).closest("tr")
    var ULDSupportRequestAssignTrans_SNo = ClosestTr.find("input[id^='tblULDSupportProcessed_ULDSupportRequestAssignTransSNo'").val();
    var ULDSupportProcessed_Processed_QTY = ClosestTr.find("input[id^='tblULDSupportProcessed_ProcessedQTY'").val();
    var ULDSupportProcessed_Remarks = ClosestTr.find("input[id^='tblULDSupportProcessed_Remarks'").val();
    var ULDSupportRequestSno = ClosestTr.find("input[id^='tblULDSupportProcessed_ULDSupportRequestSno'").val();
    if (ValidateData(input))
    {
    $.ajax({

        url: "Services/ULD/ULDSupportProcessedService.svc/UpdateULDSupportProcessed?ULDSupportRequestAssignTransSNo=" + ULDSupportRequestAssignTrans_SNo + "&ULDSupportProcessedQTY=" + ULDSupportProcessed_Processed_QTY + "&ULDSupportProcessedRemarks=" + ULDSupportProcessed_Remarks + "&ULDSupportRequestSno=" + ULDSupportRequestSno, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "" && result != null) {
                ClosestTr.find("input[id^='tblULDSupportProcessed_Action'").hide();
                ClosestTr.find("input[id^='tblULDSupportProcessed_ProcessedQTY'").attr("readonly", true);
                ClosestTr.find("input[id^='tblULDSupportProcessed_Remarks'").attr("readonly", true);
                ClosestTr.find("input[id^='tblULDSupportProcessed_Remarks'").css("background-color", "white");
                ClosestTr.find("input[id^='tblULDSupportProcessed_ProcessedQTY'").css("background-color", "white");
           
                ShowMessage('success', 'Success -Update Successfully', "Update Successfully", "bottom-right");
               ULDSupportProcessedDetails();
            }
        }
    });

    }
}
function ValidateData(input) {
    var ClosestTr = $("#" + input).closest("tr")
    var ULDSupportProcessed_RequestQTY = ClosestTr.find("input[id^='tblULDSupportProcessed_ULDSupportRequestQTY'").val();
    var ULDSupportProcessed_Processed_QTY = ClosestTr.find("input[id^='tblULDSupportProcessed_ProcessedQTY'").val();
    var ULDSupportProcessed_Remarks = ClosestTr.find("input[id^='tblULDSupportProcessed_Remarks'").val();

    if (parseInt(ULDSupportProcessed_Processed_QTY) >parseInt(ULDSupportProcessed_RequestQTY))
    {
        ShowMessage('warning', 'Warning ', "Processed QTY can not be greater than Total Requested QTY.");
        return false;
    }
    else if (ULDSupportProcessed_Processed_QTY == "" || ULDSupportProcessed_Processed_QTY == 0) {
        ShowMessage('warning', 'Warning ', "Please Enter Release QTY.");
        return false;
      
    }else if (ULDSupportProcessed_Remarks == "")
    {
        ShowMessage('warning', 'Warning ', "Please Enter Remarks.");
        return false;
    }
    return true;
}
