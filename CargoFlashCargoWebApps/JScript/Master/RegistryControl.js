var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    
    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "vwAirline", "SNo", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
    //cfi.AutoComplete("CitySNo", "cityCode,CityName", "vcity", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("GroupSNo", "SNo,GroupName", "vwGroups", "SNo", "GroupName", null, null, "contains");
    //cfi.AutoComplete("ProcessSNo", "SNo,ProcessName", "vwProcess", "SNo", "ProcessName", null, RegistryControlTranGrid, "contains");
    //cfi.AutoComplete("PageSNo", "SNo,PageName", "vwPage", "SNo", "PageName", null, null, "contains");

    cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName", "Master_RegistryControl_AirlineName", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "cityCode,CityName", "Master_RegistryControl_CityName", null, "contains");
    cfi.AutoCompleteV2("GroupSNo", "SNo,GroupName", "Master_RegistryControl_GroupName",  null, "contains");
    cfi.AutoCompleteV2("ProcessSNo", "SNo,ProcessName", "Master_RegistryControl_ProcessName", null, RegistryControlTranGrid, "contains");
    cfi.AutoCompleteV2("PageSNo", "SNo,PageName", "Master_RegistryControl_PageName",  null, "contains");

    if (pageType != "NEW") {
        $('#Text_ProcessSNo').attr("disabled", true).closest("span").find("span").find("span.k-icon").hide();
        $('#Text_AirlineSNo').attr("disabled", true).closest("span").find("span").find("span.k-icon").hide();
        $('#Text_CitySNo').attr("disabled", true).closest("span").find("span").find("span.k-icon").hide();
        $('#Text_GroupSNo').attr("disabled", true).closest("span").find("span").find("span.k-icon").hide();
        $('#Text_PageSNo').attr("disabled", true).closest("span").find("span").find("span.k-icon").hide();
        RegistryControlTranGrid();        
    }
});

function RegistryControlTranGrid() {
    var dbTableName = 'RegistryControlTran';
    var bindvalue = $('#RecordID').val();
    if (bindvalue == '')
        bindvalue = $("#ProcessSNo").val();
    var pageType =  '0';
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        masterTableSNo: bindvalue,
        currentPage: 1, itemsPerPage: 5, whereCondition: '', sort: '',
        servicePath: './Services/Master/RegistryControlService.svc',
        getRecordServiceMethod: 'GetRegistryControlTranRecord',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Registry Control Transaction',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SPSNo', type: 'hidden' },
            { name: 'PSNo', type: 'hidden' },
            { name: 'totRowCount', type: 'hidden' },
            { name: 'SPName', display: 'SubProcess Name', type: 'label' },
            
            { name: 'priority', display: 'Priority', type: 'text', ctrlCss: { width: '50px' }, ctrlAttr: { maxlength: 3 } },
            { name: 'IsRequired', display: 'Required', type: 'checkbox' },
            { name: 'IsDisplay', display: 'Display', type: 'checkbox'},
            { name: 'IsActive', display: 'Active', type: 'checkbox' },           
            { name: 'IsOnClick', display: 'OnClick', type: 'checkbox' },
            { name: 'DC', display: 'Display Caption', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10 } },
            { name: 'ProgressCheck', display: 'Progress Check', type:'checkbox'},            
            { name: 'IsPopUpSubProcess', display: 'Popup SubProcess', type: 'checkbox' },
            { name: 'Group', display: 'Group', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100 } },
            { name: 'Status', display: 'Status', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100 } },
            

        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }
        
    });
    
    
}

function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("PageSNo") > 0) {
        cfi.setFilter(f, "hyperlink", "neq", null)
    }
    if (textId.indexOf("ProcessSNo") > 0) {
        cfi.setFilter(f, "PageSNo", "eq", $("#PageSNo").val() == "" ? "0" : $("#PageSNo").val())
    }

    return cfi.autoCompleteFilter([f]);
}



