/// <reference path="../../Scripts/jquery-1.7.2.js" />
var rowDelete = false;
var pageType = $("#hdnPageType").val();
var createdby=$("#hdnCreatedBy").val();
var updatedby = $("#hdnUpdatedBy").val();
var applicationentitysno = $("#hdnApplicationEntitySNo").val();
$(document).ready(function () {
    $('#tbl tr:last-child').hide();
    $("input[name^='operation']").hide();
    $('#__SpanHeader__').closest('tr').hide();
    LoadGrid();
});


function LoadGrid() {
    // Initialize appendGrid
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Commission can be added in Edit/Update mode only.");
        return;
    }
    else {
        $('#tblApplicationEntityValueList').appendGrid({
            tableID: "tblApplicationEntityValueList",
            contentEditable: true,
            masterTableSNo: $("#hdnApplicationEntitySNo").val(),
            // currentPage: 1,
            //itemsPerPage: 500,
            //whereCondition: null,ApplicationEntityValueListService
            //sort: "",ApplcationEntityValueListService
            isGetRecord: true,
            servicePath: "./Services/Irregularity/ApplicationEntityValueListService.svc",
            getRecordServiceMethod: "GetApplicationEntityValueListRecord",
            deleteServiceMethod: "DeleteApplicationEntityValueListRecord",
            createUpdateServiceMethod: "createUpdateApplicationEntityValueListRecord",
            caption: "Application Entity Value List",
            columns: [{ name: 'SNo', type: 'hidden' }, { name: 'ApplicationEntitySno', type: 'hidden' },
           { name: 'ApplicationCode', display: 'Code', type: (pageType == "READ") ? "label" : "text", ctrlAttr: { controltype: pageType == "READ" ? "" : "alphanumericupper", maxlength: 10, title: "Enter Code" }, ctrlCss: { width: "150px" }, isRequired: pageType == "READ" ? false : true, dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false", onChange: function (evt, rowIndex) { checkvalidation(rowIndex); } },
           { name: 'ApplicationName', display: 'Name', isRequired: pageType == "READ" ? false : true, type: (pageType == "READ") ? "label" : "text", ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: pageType == "READ" ? "" : "alphanumericupper", maxlength: 40, title: "Enter Name" }, ctrlCss: { width: "250px" } },
           { name: 'Remarks', display: 'Remarks', ctrlCss: { width: '80px', height: '20px' }, type: (pageType == "READ") ? "label" : "text", ctrlAttr: { controltype: pageType == "READ" ? "" : "alphanumericupper", maxlength: 400, title: "Enter Remarks" }, ctrlCss: { width: "250px" }, },
           { name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: (pageType == "READ") ? "label" : 'radiolist', ctrlOptions: (pageType == "READ") ? {} : { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
           { name: 'CreatedBy', type: 'hidden' },
            { name: 'UpdatedBy', type: 'hidden' }
            ],
            isPaging: false,
            beforeRowAppend: function (tableID, uniqueIndex) {

                if (pageType == 'EDIT') {

                    length = $("tr[id^='tblApplicationEntityValueList_Row']").length;
                    if (length > 0) {
                        var lastRowIndex = $("tr[id^='tblApplicationEntityValueList_Row']:last").attr('id').split("_")[2];
                        if ($("#tblApplicationEntityValueList_ApplicationName_" + lastRowIndex).val() != '') {
                            if (length - gridAddedRowCount > 0) {
                                return true;
                            }
                            else { return true; }
                        }
                        else {
                            alert("Valid  data is required!!!");
                            return false;
                        }
                    }
                    else
                        return true;

                }
                else { return true; }
            },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                CurrentRowSno = '';
                if (pageType == 'NEW' || pageType == 'EDIT') {
                    length = $("tr[id^='tblApplicationEntityValueList_Row']").length;
                    var lastRowIndex = $("tr[id^='tblApplicationEntityValueList_Row']:last").attr('id').split("_")[2];
                    $("#tblApplicationEntityValueList_ApplicationEntitySno_" + lastRowIndex).val(applicationentitysno);
                    $("#tblApplicationEntityValueList_CreatedBy_" + lastRowIndex).val(createdby);
                    $("#tblApplicationEntityValueList_UpdatedBy_" + lastRowIndex).val(updatedby);
                    $("#tblApplicationEntityValueList_SNo_" + lastRowIndex).val('0');
                }
                else
                    return true;

            },
            hideButtons: { updateAll: pageType == "EDIT" ? false : true, insert: pageType == "EDIT" ? false : true, remove: pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: pageType == "EDIT" ? false : true },
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                $("tr[id^='tblApplicationEntityValueList_Row']").each(function (idx) {
                    var rowno = parseInt(idx) + 1;
                    $("#tblApplicationEntityValueList_ApplicationEntitySno_" + rowno).val(applicationentitysno);
                    $("#tblApplicationEntityValueList_CreatedBy_" + rowno).val(createdby);
                    $("#tblApplicationEntityValueList_UpdatedBy_" + rowno).val(updatedby);
                });
            }
        });

        //On Grid Load
        if (pageType == "EDIT") {
            gridAddedRowCount = $("tr[id^='tblApplicationEntityValueList_Row']").length;
            $("#tblApplicationEntityValueList tbody tr input").attr('disabled', false);
            //var lastRowIndex = $("tr[id^='tblApplicationEntityValueList_Row']:last").attr('id').split("_")[2];
            $("#tblApplicationEntityValueList tbody td").find("[id^='tblApplicationEntityValueList_Delete']").show();

            length = $("tr[id^='tblApplicationEntityValueList_Row']").length;
            $("tr[id^='tblApplicationEntityValueList_Row']").each(function (idx) {
                var rowno = parseInt(idx)+1;
                $("#tblApplicationEntityValueList_ApplicationEntitySno_" + rowno).val(applicationentitysno);
                $("#tblApplicationEntityValueList_CreatedBy_" + rowno).val(createdby);
                $("#tblApplicationEntityValueList_UpdatedBy_" + rowno).val(updatedby);
            });
        }
        else if (pageType == "READ") {
            gridAddedRowCount = $("tr[id^='tblApplicationEntityValueList_Row']").length;
            $("#tblApplicationEntityValueList tbody tr input").attr('disabled', true);
            $("#tblApplicationEntityValueList tbody td").find("[id^='tblApplicationEntityValueList_Delete']").hide();
        }
        else {
            return true;
        }
    }
}
function checkvalidation(latestrow) {
    latestrow = parseInt(latestrow) + 1;
    var flag = false;
    $("tr[id^='tblApplicationEntityValueList_Row']").not($("tr[id^='tblApplicationEntityValueList_Row_" + latestrow + "']")).each(function (idx) {
        var rowno = parseInt(idx) + 1;
        if ($("#tblApplicationEntityValueList_ApplicationCode_" + rowno).val() == $("tr[id^='tblApplicationEntityValueList_Row_" + latestrow + "'] #tblApplicationEntityValueList_ApplicationCode_" + latestrow).val()) {
            $("tr[id^='tblApplicationEntityValueList_Row_" + latestrow + "'] #tblApplicationEntityValueList_ApplicationCode_" + latestrow).val('')
        }
    });
}