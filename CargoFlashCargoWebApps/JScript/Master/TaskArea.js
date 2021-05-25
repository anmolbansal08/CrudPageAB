var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    if (pageType == "NEW") {
        TaskAreaGrid();
    }

});

function TaskAreaGrid() {
    var dbTableName = 'TaskArea';
    var bindvalue = '1';
    var pageType = '0';
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        masterTableSNo: bindvalue,
        currentPage: 1, itemsPerPage: 5, whereCondition: '', sort: '',
        servicePath: './Services/Master/TaskAreaService.svc',
        getRecordServiceMethod: 'GetTaskAreaDetailRecord',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Area Name',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'TASNo', type: 'hidden' },
            { name: 'totRowCount', type: 'hidden' },
            { name: 'AreaName', display: 'Area Name', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 50 } },
            { name: 'IsActive', display: 'Active', type: 'checkbox' },
        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: false,
            append: false,
            updateAll: false

        }

    });
    
}

//function ExtraCondition(textId) {
//    var f = cfi.getFilter("AND");
//    if (textId.indexOf("PageSNo") > 0) {
//        cfi.setFilter(f, "hyperlink", "neq", null)
//    }
//    if (textId.indexOf("ProcessSNo") > 0) {
//        cfi.setFilter(f, "PageSNo", "eq", $("#PageSNo").val() == "" ? "0" : $("#PageSNo").val())
//    }

//    return cfi.autoCompleteFilter([f]);
//}

