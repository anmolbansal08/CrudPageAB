/*
*****************************************************************************
Javascript Name:	AccountGroupJS     
Purpose:		    This JS used to get Grid data for Account Group Trans.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    21 May 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/


$(document).ready(function () {
    $('#Name').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })

    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
});




$(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
});
var dbTableName = 'AccountGroupTrans';
function AccountGroupTransGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Group Trans Details can be added in Edit/Update mode only.");
        return;
    }
    else {
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,Name,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAccountGroupSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AccountGroupService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Account Group Trans',
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AccountGroupSNo', type: 'hidden', value: $('#hdnAccountGroupSNo').val() },
                { name: 'AccountSNo', display: 'Account Name', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'Accountgroup_AccountSNo', filterField: 'Name' },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });     
    }
}