/*
*****************************************************************************
Javascript Name:	CommodityPackageJS     
Purpose:		    This JS used to get Grid data for Commodity Package Trans.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    22 May 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
$(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
});
var dbTableName = 'CommodityPackageTrans';
function CommodityPackageTransGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Commodity Package Trans Details can be added in Edit/Update mode only.");
        return;
    }
    else {
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,Name,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnCommodityPackageSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/CommodityPackageService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Commodity Package Trans',
            isGetRecord: true,
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'CommodityPackageSNo', type: 'hidden', value: $('#hdnCommodityPackageSNo').val() },
                //{ name: 'CommodityGroupSNo', display: 'Commodity Group', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
                  { name: 'CommodityGroupSNo', display: 'Commodity Group', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'Master_CommodityPackage_CommodityGroup', filterField: 'GroupName' },
                { name: 'CommoditySubGroupSNo', display: 'Commodity Sub Group', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'Master_CommodityPackage_CommoditySubGroup', filterField: 'CommoditySubGroup', filterCriteria: "contains" },
                { name: 'CommoditySNo', display: 'Commodity Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'Master_CommodityPackage_Code',filterField : 'CommodityCode' },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });
        
    }
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId.indexOf("CommodityGroupSNo") >= 0) {
        $("#" + textId.split('_')[0] + "_HdnCommoditySubGroupSNo_" + (textId.split('_')[2])).val('');
        $("#" + textId.split('_')[0] + "_CommoditySubGroupSNo_" + (textId.split('_')[2])).val('');
        $("#" + textId.split('_')[0] + "_HdnCommoditySNo_" + (textId.split('_')[2])).val('');
        $("#" + textId.split('_')[0] + "_CommoditySNo_" + (textId.split('_')[2])).val('');
    }
    if (textId.indexOf("CommoditySubGroupSNo") >= 0) {
        $("#" + textId.split('_')[0] + "_HdnCommoditySNo_" + (textId.split('_')[2])).val('');
        $("#" + textId.split('_')[0] + "_CommoditySNo_" + (textId.split('_')[2])).val('');
        cfi.setFilter(filter, "CommodityGroupSNo", "eq", $("#" + textId.split('_')[0] + "_HdnCommodityGroupSNo_" + (textId.split('_')[2])).val())
        var AutoCompleteFilter = cfi.autoCompleteFilter([filter]);
        return AutoCompleteFilter;
    }
    if (textId.indexOf("CommoditySNo") >= 0) {
        cfi.setFilter(filter, "CommoditySubGroupSNo", "eq", $("#" + textId.split('_')[0] + "_HdnCommoditySubGroupSNo_" + (textId.split('_')[2])).val())
        var AutoCompleteFilter = cfi.autoCompleteFilter([filter]);
        return AutoCompleteFilter;
    }
}