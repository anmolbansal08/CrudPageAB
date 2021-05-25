var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoComplete("AccountSNo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains", null, null, null, null, OnSelectAccount);
    cfi.AutoComplete("AllocationTransSNo", "sno,AllocationCode", "allocation", "SNo", "AllocationCode", null, null, "contains", null, null, null, null, OnSelectAllocationCode);
    cfi.AutoComplete("ProductSNo", "SNo,ProductName", "Product", "SNo", "ProductName", null, null, "contains");
    cfi.AutoComplete("UldTypeSNo", "SNo,ULDName", "ULDType", "SNo", "ULDName", null, null, "contains");
    cfi.AutoComplete("ComoditySNo", "SNo,CommodityDescription", "Commodity", "SNo", "CommodityDescription", null, null, "contains");
    cfi.AutoComplete("SPHCSNO", "SNo,Code", "sphc", "SNo", "Code", null, null, "contains");

    var alphabettypes = [{ Key: "1", Text: "Soft Block" }, { Key: "2", Text: "Hard Block" }];
    cfi.AutoCompleteByDataSource("AllocationBlockType", alphabettypes);

    if (pageType != "NEW") {
        var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    }
    
});

function OnSelectAccount()
{
    $("#Text_AllocationTransSNo").val('');
    $("AllocationTransSNo").val('')
}

function checkboxunchecked()
{

    if (!$("#tblAllocationTransAccount_Day1_1").is(":checked"))
        $("#tblAllocationTransAccount_Day1_1").prop('disabled', 'disabled')



    //$('input:checkbox[id^="tblAllocationTransAccount_Day"]').each(function () {
    //    if (!$(this).is(":checked") || !$(this).attr('checked'))
    //        $(this).prop('disabled', 'disabled')
    //});
    //$('input:checkbox[id*="tblAllocationTransAccount_AllDay"]').each(function () {
    //    if (!$(this).is(":checked"))
    //        $(this).prop('disabled', 'disabled')
    //});
} 


function OnSelectAllocationCode(e)
{
    if ($("#AccountSNo").val() == "") {
        ShowMessage('info', 'Account No!', "Please select Account number");
        return false;
    }


    var Data = this.dataItem(e.item.index());
    AllocationAccountTransINSGrid(Data.Key)
    if ($("#__SpanHeader__").html() != "New Space Allocation Account Management:")
    try{
        AllocationAccountTransGrid(Data.Key);
    }
    catch (err)
    {
        
    }

    

    var AcNo = $('#tblAllocationTransAccount input[id^=tblAllocationTransAccount_AccountSNo]');
    for (var count = 0; count < AcNo.length; count++) {
        var name = AcNo[count.toString()].id.toString();
        var value = $("#AccountSNo").val();
        $("#" + name).val(value);
    }

    var Alloc = $('#tblAllocationTransAccount input[id^=tblAllocationTransAccount_AllocationCode]');
    for (var count = 0; count < Alloc.length; count++) {
        var name = Alloc[count.toString()].id.toString();
        $("#" + name).val(Data.Key);
    }


    //$("#tblAllocationTransAccount_btnRemoveLast").hide();
    //$("#tblAllocationTransAccount_btnAppendRow").hide();
    
}

function CheckAccountAllocationCode(evt, rowIndex)
{
    rowIndex = rowIndex + 1; 
    var val = $('#tblAllocationTransAccount_AccountAllocationCode_' + rowIndex).val();
    var checkreturn = 0;
    var aloccode = $('#tblAllocationTransAccount input[id^=tblAllocationTransAccount_AccountAllocationCode');
    for (var count = 0; count < aloccode.length; count++) {
        for (var innercount = 0; innercount < aloccode.length; innercount++) {
            if (count != innercount && $("#" + aloccode[innercount.toString()].id.toString()).val() != "" && $("#" + aloccode[count.toString()].id.toString()).val() != "")
            {
                if($("#" +aloccode[count.toString()].id.toString()).val() == $("#" +aloccode[innercount.toString()].id.toString()).val())
                {
                    $("#" + aloccode[innercount.toString()].id.toString()).val('');
                    var p = parseInt(innercount) + 1;
                    ShowMessage('info', 'Allocation Account Code!', "Allocation account code not valid for row no " + p);
                    checkreturn = 1;
                }
            }
        }
    }

    if (checkreturn == 1)
        return false;
    $.ajax({
        type: "POST",
        url: "./Services/spacecontrol/allocationAccountService.svc/GetAccountAllocationCode?recid=" + val,
        data: { id: val },
        dataType: "json",
        success: function (response) {
            if (response.Data[0] == "1") {
                $('#tblAllocationTransAccount_AccountAllocationCode_' + rowIndex).val('');
                ShowMessage('info', 'Account Allocation Code!',  "Allocation Account Code not valid on row no. "+rowIndex );
                return false;
            }       
        }
    });
}

function CheckGWeight (evt, ind)
{
    ind = ind + 1;
    if (parseFloat($('#tblAllocationTransAccount_GrossWeight_' + ind).val()) > parseFloat($('#tblAllocationTransAccount_RemGrossWeight_' + ind).html())) {
        $('#tblAllocationTransAccount_GrossWeight_' + ind).val('');
        ShowMessage('info', 'Gross Weight Msg!', "Gross weight not sufficient");
        return false;
    }
}

function CheckVWeight(evt, ind) {
    ind = ind + 1;
    if (parseFloat($('#tblAllocationTransAccount_VolumeWeight_' + ind).val()) > parseFloat($('#tblAllocationTransAccount_RemVolumeWeight_' + ind).html())) {
        $('#tblAllocationTransAccount_VolumeWeight_' + ind).val('');
        ShowMessage('info', 'Volume Weight Msg!', "Gross Volume  not sufficient");
        return false;
    }
}


function AllocationAccountTransINSGrid(ddlval) {
    var days = new Array();
    days = ['-1','0','1','2','3','4','5','6','7'];
    var dbTableName = 'AllocationTransAccount';
    var num = $('#hdnAllocationTransAcountSNo').val();
    num = ddlval;
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        masterTableSNo:num,
        currentPage: 1, itemsPerPage: 5, whereCondition: '', sort: '',
        servicePath: './Services/SpaceControl/AllocationAccountService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'AllocationAccount New',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            {
                name: 'AccountAllocationCode', display: 'A/C Alloc code.', type: 'text', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '60px' }, isRequired: true, onChange: function (evt, rowIndex) {
                    CheckAccountAllocationCode(evt, rowIndex);
                }
            },
            { name: 'Remarks', display: 'Remarks', type: 'text', ctrlAttr: { maxlength: 150 }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'AccountSNo', type: 'hidden', value: 0 },
            { name: 'AllocationTransSNo', type: 'hidden', value: 0 },
            { name: 'ProductSNo', display: 'Product', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'Product', textColumn: 'ProductName', keyColumn: 'SNo' },
            { name: 'AllocationBlockType', display: 'Alloc Block', type: 'select', ctrlOptions: { 0: '', 1: 'Soft Block', 2: 'Hard Block' }, isRequired: true },


         //   { name: 'AllocationCode', type: 'hidden', value : 0},
            
            
             
             
      
            
           {
               name: 'divDays', display: 'Days of Operation in Week', type: 'div', isRequired: false,
               divElements: [{
                   divRowNo: 1, name: pageType != 'View' ? 'AllDays' : 'AllDay', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                       $('input:checkbox[id*="_' + (rowIndex + 1) + '"]').each(function () {
                           if (this.id != 'tbl' + dbTableName + '_IsActive_' + (rowIndex + 1))
                               this.checked = $('input[id*="AllDays_' + (rowIndex + 1) + '"]:checked').val() != undefined;
                       });
                      
                     
                   }
               },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day1' : 'Sun', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day2' : 'Mon', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day3' : 'Tue', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day4' : 'Wed', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day5' : 'Thu', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day6' : 'Fri', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day7' : 'Sat', display: null, type: 'checkbox' },
                   { divRowNo: 2, name: 'lblAllDays', value: 'Days', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay1', value: 'Sun', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay2', value: 'Mon', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay3', value: 'Tue', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay4', value: 'Wed', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay5', value: 'Thu', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay6', value: 'Fri', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay7', value: 'Sat', type: 'label', ctrlCss: { 'font-weight': 'bold' } }]
           },
            { name: 'StartDate', display: 'From Date', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', startControl: 'StartDate', endControl: 'EndDate' } },
            { name: 'EndDate', display: 'To Date', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', startControl: 'StartDate', endControl: 'EndDate' } },
            { name: 'GrossWeight', display: 'G. Wt.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true, onChange: function (evt, rowIndex) { CheckGWeight(evt, rowIndex); } },
             { name: 'RemGrossWeight', display: 'Rem Gwt.', type: 'label', value: '150', ctrlCss: { width: '40px' } },
            {
                name: 'VolumeWeight', display: 'V. Wt.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true, onChange: function (evt, rowIndex) {
                    CheckVWeight(evt, rowIndex);
                }
            },          
            { name: 'RemVolumeWeight', display: 'Rem Vwt.', type: 'label', value: '150', ctrlCss: { width: '40px' } },
            { name: 'ReleaseTime', display: 'Rel Time', type: 'text', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'BsaReference', display: 'BsaRef', type: 'text', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'IsActive', display: 'Active', type: 'checkbox', ctrlCss: { width: '50px' }, isRequired: true },
            { name: 'CreatedBy', type: 'hidden', value: 0 }

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            checkboxunchecked();
        },
        isPaging: false
       // ,hideButtons: { insert: false, remove: true, updateAll: true, append: false, removeLast: true }

    });
    
}

function AllocationAccountULDDetails() {
    var dbTableName = 'AllocationTransAccountULD';
    var num = $('#hdnAllocationTransAccountSNo').val();
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        masterTableSNo: num,
        currentPage: 1, itemsPerPage: 5, whereCondition: '', sort: '',
        servicePath: './Services/SpaceControl/AllocationAccountService.svc',
        getRecordServiceMethod: 'Get'+dbTableName.toString()+'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Allocation AccountULD Detail ULd',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
             { name: 'AllocationTransAccountSNo', type: 'hidden', value: $('#hdnAllocationTransAccountSNo').val() },
            { name: 'ULDTypeSNo', display: 'ULDType', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'ULDType', textColumn: 'ULDName', keyColumn: 'SNo' },
            { name: 'Unit', display: 'Unit', type: 'text', ctrlCss: { width: '80px', height: '20px' }},
            { name: 'GrossWeight', display: 'Gross Weight.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'VolumeWeight', display: 'Volume Weight.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'IsActive', display: 'Active', type: 'checkbox', ctrlCss: { width: '50px' }, isRequired: true }
        ],
        isPaging: false,
    });
    
}
