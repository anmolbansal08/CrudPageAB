

var pageType = $("#hdnPageType").val();;


$(function () {
    // Initialize appendGrid

    // function BindEventMessageTrans() {
    $("input[name='operation']").click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();    

        //if (cfi.IsValidSubmitSection()) {

        //    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        //        ///AuditLogSaveNewValue("divbody");
        //    }

        //    GetSubCategoryData();
        //    return true;
        //}
        //else {
        //    return false
        //}
        GetSubCategoryData();
    });


    $('#tblIrregularityIncident').appendGrid({
        tableID: "tblIrregularityIncident",
        contentEditable: true,
        masterTableSNo: $("#hdnIrregularitySNo").val(),
        //currentPage: 1,
        //itemsPerPage: 500,
        //whereCondition: null,
        //sort: "",
        isGetRecord: true,
        servicePath: "./Services/Irregularity/IrregularityEventService.svc",
        getRecordServiceMethod: "GetIrregularityIncidentRecord",
        deleteServiceMethod: "DeleteIrregularityIncidentSubCategoryRecord",
        caption: "Irregularity Incident SubCategory Information",

        columns: [{ name: 'SNo', type: 'hidden' },
            // (pageType == "READ") ? "label" : 
       { name: 'SubCategoryCode', display: 'SubCategory Code', type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 10, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "" }, isRequired: false },
       { name: 'SubCategoryName', display: 'SubCategory Name', type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 50, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "" }, isRequired: false },
       { name: 'SubCategoryDesc', display: 'SubCategory Desc', type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 50, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "" }, isRequired: false },
       //{ name: 'SubCategoryName', display: 'SubCategory Name', type:"text", ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 50, controltype: 'alphanumericupper' }, isRequired: true },
       //{ name: 'SubCategoryDesc', display: 'SubCategory Desc', type:"text", ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 50, controltype: 'alphanumericupper' }, isRequired: true },
       //{ name: 'IsActive', display: 'IsActive', type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label",  ctrlCss: { width: '40px' }, isRequired: false },
       { name: 'IsActive', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1 },
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
    

    if (pageType == "NEW") {
        // Adding blank a row in grid on load.
        ///$('#tblIrregularityIncident').appendGrid('insertRow', 1, 0);
        $("#tblIrregularityIncident tbody td").find("[id^='tblIrregularityIncident_Delete_1']").hide();
        //tblIrregularityIncident_Delete_1
    }

});

function GetSubCategoryData()
{
    var tblGrid = "tblIrregularityIncident";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val(btoa($('#tblIrregularityIncident').appendGrid('getStringJson')));
}