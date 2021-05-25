/*
*****************************************************************************
Javascript Name:	DueCarrierJS     
Purpose:		    This JS 
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    26 Mar 2014
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

$(document).ready(function () {
    $('#liDueCarrierSPHC').hide();
    $('#liDueCarrierCommodity').hide();
});
function DueCarrierSPHCGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Due Carrier SPHC Details can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'DueCarrierSpecialHandlingTrans';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,DueCarrierSNo,SpecialHandlingCodeSNo,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnDueCarrierSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Due Carrier Special Handling',
            initRows: 1,
            isGetRecord: true,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'DueCarrierSNo', type: 'hidden', value: $('#hdnDueCarrierSNo').val() },
                { name: 'SpecialHandlingCodeSNo', display: 'SPHC Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'Due_Carrier_SHCCode', filterField: 'Code' },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });
    }
}
function DueCarrierCommodityGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Due Carrier Commodity Details can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'DueCarrierCommodityTrans';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,DueCarrierSNo,CommoditySNo,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnDueCarrierSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Due Carrier Commodity',
            initRows: 1,
            isGetRecord: true,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'DueCarrierSNo', type: 'hidden', value: $('#hdnDueCarrierSNo').val() },
                { name: 'CommoditySNo', display: 'Commodity Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'Due_Carrier_Commodity', filterField: 'CommodityCode' },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });

    }
}