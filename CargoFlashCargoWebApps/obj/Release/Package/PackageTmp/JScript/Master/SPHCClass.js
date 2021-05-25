
var updatedRows = new Array();
$(function () {
    cfi.ValidateForm();
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });


    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });

    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liSPHCSubClass").hide();
            var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
        }
    }
});

function SPHCClassGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "DG Sub Class - Can be added in Edit/Update Mode only.");
        return;
    }
    else {
        var dbTableName = 'SPHCSubClass';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,DivisionName,Division,IsActive',
            masterTableSNo: $('#hdnSPHCClassSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'DG Sub Class',
            initRows: 1,
            isGetRecord: true,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'ClassSNo', type: 'hidden', value: $('#hdnSPHCClassSNo').val() },

                { name: 'Division', display: 'Division', type: 'text', value: '0', ctrlAttr: { maxlength: 4, controltype: 'alphanumericupper',allowchar: '.' }, ctrlCss: { width: '90px' }, isRequired: true },
                { name: 'DivisionName', display: 'Division Name', type: 'text', ctrlAttr: { maxlength: 200, Controltype: 'alphanumericupper' }, ctrlCss: { width: '150px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });

    }
}
$('#ClassName').blur(function () {
    
    if ($.isNumeric($('#ClassName').val()) == true) {
        ShowMessage('warning', 'Warning - DG Class!', "DG Class Name cannot have numbers only");
        $('#ClassName').val('');
        return false;
    }
});


