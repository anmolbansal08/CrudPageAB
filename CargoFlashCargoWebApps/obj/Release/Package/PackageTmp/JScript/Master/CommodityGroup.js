var dbTableName = 'CommoditySubGroup';

var pageType = $('#hdnPageType').val();

$(document).ready(function () {
    $('input[name="operation"]').click(function (e) {
        if ($("#StartRange").val() != "" && $("#EndRange").val() != "") {
            if (parseInt($("#EndRange").val()) <= parseInt($("#StartRange").val())) {
                alert('Start range must be equal to or between master Start range and End range.');
                return false;
            }

        }

    });

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

    //$(document).keypress(function (e) {

    //    if (e.keyCode != 32)
    //        return true;
    //    else
    //        return false;
    //})

});

$(function () {
    $('#StartRange').attr('onchange', 'checkNumeric(\"StartRange\");checkRange(0);');
    $('#EndRange').attr('onchange', 'checkNumeric(\"EndRange\");checkRange(0);');

    cfi.ValidateForm();
    // Initialize appendGrid
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType == 'EDIT',
        tableColumns: 'SubGroupName,StartRange,EndRange,HeavyWeightExempt,Active',
        masterTableSNo: $('#hdnCommodityGroupSno').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Master/' + dbTableName + 'Service.svc',
        isGetRecord: true,
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Commodity Sub Groups',
        initRows: 1,
        // column for edit
        //{ name: 'SubGroupName', display: 'Sub Group Name', type: 'autocomplete', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { updatedRows[updatedRows.length] = rowIndex + 1; }, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                  { name: 'CommodityGroupSNo', type: 'hidden', value: $('#hdnCommodityGroupSno').val() },
                  {
                      name: 'SubGroupName', display: 'Sub Group Name', type: 'text', ctrlAttr: { maxlength: 100, controltype: "default" }, ctrlCss: { width: '160px' }, isRequired: true
                  },
          
                  {
                      name: 'StartRange', display: 'Start Range', type: 'text', value: 0, ctrlAttr: { maxlength: 4,controltype: "default" }, ctrlCss: { width: '40px' }, onChange: function (evt, rowIndex) {
                          checkNumeric('tbl' + dbTableName + '_StartRange_' + eval(evt.data.uIndex));
                          if ($('#tbl' + dbTableName + '_EndRange_' + eval(evt.data.uIndex)).val() == '') { $('#tbl' + dbTableName + '_EndRange_' + eval(evt.data.uIndex)).val($('#tbl' + dbTableName + '_StartRange_' + eval(evt.data.uIndex)).val()); }
                          checkRange(rowIndex + 1);
                      }, isRequired: true
                  },
                  { name: 'EndRange', display: 'End Range', type: 'text', value: 0, ctrlAttr: { maxlength: 4, controltype: "default" }, ctrlCss: { width: '40px' }, onChange: function (evt, rowIndex) { checkNumeric('tbl' + dbTableName + '_EndRange_' + eval(rowIndex + 1)); checkRange(rowIndex + 1); }, isRequired: true },
                  {
                      name: pageType == 'EDIT' ? 'IsHeavyWeightExempt' : 'HeavyWeightExempt', display: 'Heavy Weight Exempt', type: 'checkbox', isRequired: false, onClick: function (evt, rowIndex) {
                      }
                  },
                  {
                      name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, isRequired: false, onClick: function (evt, rowIndex) {
                      }
                  }
        ],
        isPaging: true
        //, hideButtons: { insert: true, remove: true, updateAll: true, append: true, removeLast: true }
    });
    // load data

    //showPage(1);
});

function checkRange(rowNo) {    
    if (eval($(rowNo > 0 ? '#tbl' + dbTableName + '_StartRange_' + rowNo : '#StartRange').val()) > eval($(rowNo > 0 ? '#tbl' + dbTableName + '_EndRange_' + rowNo : '#EndRange').val()) && eval($(rowNo > 0 ? '#tbl' + dbTableName + '_EndRange_' + rowNo : '#EndRange').val()) > 0) {
        alert('End range must be greater than Start range.');
        //$('#tbl' + dbTableName + '_EndRange_' + rowNo).val($('#tbl' + dbTableName + '_StartRange_' + rowNo).val());
        $(rowNo > 0 ? '#tbl' + dbTableName + '_EndRange_' + rowNo : '#EndRange').css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        //return false;
    }
    else {
        $(rowNo > 0 ? '#tbl' + dbTableName + '_EndRange_' + rowNo : '#EndRange').css({
            "border": "",
            "background": ""
        });
        //return true;
    }
    if (rowNo > 0) {
        if (eval($('#tbl' + dbTableName + '_StartRange_' + rowNo).val()) > 0 && (eval($('#tbl' + dbTableName + '_StartRange_' + rowNo).val()) > eval($('#EndRange').val()) || eval($('#tbl' + dbTableName + '_StartRange_' + rowNo).val()) < eval($('#StartRange').val()))) {
            alert('Start range must be equal to or between master Start range and End range.');
            $('#tbl' + dbTableName + '_StartRange_' + rowNo).val($('#StartRange').val());
            $('#tbl' + dbTableName + '_StartRange_' + rowNo).css({
                "border": "1px solid red",
                "background": "#FFCECE"
            });
            //return false;
        }
        else {
            $('#tbl' + dbTableName + '_StartRange_' + rowNo).css({
                "border": "",
                "background": ""
            });
            // return true;
        }
        if (eval($('#tbl' + dbTableName + '_EndRange_' + rowNo).val()) > 0 && (eval($('#tbl' + dbTableName + '_EndRange_' + rowNo).val()) > eval($('#EndRange').val()) || eval($('#tbl' + dbTableName + '_EndRange_' + rowNo).val()) < eval($('#StartRange').val()))) {
            alert('End range must be equal to or between master Start range and End range.');
            $('#tbl' + dbTableName + '_EndRange_' + rowNo).val($('#EndRange').val());
            $('#tbl' + dbTableName + '_EndRange_' + rowNo).css({
                "border": "1px solid red",
                "background": "#FFCECE"
            });
            //return false;
        }
        else {
            $('#tbl' + dbTableName + '_EndRange_' + rowNo).css({
                "border": "",
                "background": ""
            });
            //return true;
        }
    }
}
