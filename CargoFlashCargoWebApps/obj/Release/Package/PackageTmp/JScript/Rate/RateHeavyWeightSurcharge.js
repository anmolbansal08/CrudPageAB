var pageType = $('#hdnPageType').val();
var dbTableName = "";
$(document).ready(function () {
    $("input[id=ValidTo]").change(function (e) {
        var dto = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        var dfrom = new Date(Date.parse($("#ValidFrom").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        if (dfrom > dto)
            alert('Valid To must be greater than Valid From.');
        $(this).val("");
        return false;
    })
    $("input[id=ValidFrom]").change(function (e) {

        var dfrom = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));

        var dto = new Date(Date.parse($("#ValidTo").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        if (dfrom > dto)
            alert('Valid To must be greater than Valid From.');
        $(this).val("");
        return false;
    })

});

$(function () {
    cfi.AutoCompleteByDataSource("ValueType", ValueType);
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $('#StartWeight').attr('onchange', 'checkWeight(this);');
    $('#EndWeight').attr('onchange', 'checkWeight(this);');
});

function checkWeight(obj) {
    var StartWeight = parseFloat($('#StartWeight').val());
    var EndWeight = parseFloat($('#EndWeight').val());

    if (StartWeight != "" && EndWeight != "") {
        if (EndWeight < StartWeight) {
            alert('End Weight must be greater than Start Weight.');
            $("#" + obj.id).val('');
            $("#_temp" + obj.id).val('')
            return false;
        }

    }
}
function OnSelectAirport(e) {
    var Data = this.dataItem(e.item.index());
    $.ajax({
        type: "POST",
        url: "./Services/Master/AccountTargetService.svc/GetAccount?recid=" + Data.Key,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var Name = response.Data[1];
            $("#AccountSNo").val(SNo);
            $("#Text_AccountSNo").val(Name);
            $("#Name").val(Name);
        }
    });
}
function checkRange(rowNo) {
    if (eval($(rowNo > 0 ? parseFloat($('#tbl' + dbTableName + '_StartWeight_' + rowNo).val()) : '#StartWeight').val()) > eval($(rowNo > 0 ? parseFloat($('#tbl' + dbTableName + '_StartWeight_' + rowNo).val()) : '#EndWeight').val())) {
        alert('End Weight must be greater than Start Weight.');
        //$('#tbl' + dbTableName + '_EndRange_' + rowNo).val($('#tbl' + dbTableName + '_StartRange_' + rowNo).val());
        $(rowNo > 0 ? '#tbl' + dbTableName + '_EndWeight_' + rowNo : '#EndWeight').css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        return false;
    }
    else {
        $(rowNo > 0 ? '#tbl' + dbTableName + '_EndWeight_' + rowNo : '#EndWeight').css({
            "border": "",
            "background": ""
        });
        return true;
    }
}
function CreateRateHeavyWeightCommodityExemption() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Heavy Weight Commodity Exemption can be added in Edit/Update mode only.");
        return;
    }
    else {

        //$("input[id^='EndRange']").attr('onchange', 'checkRange(0);');
        $('#EndRange').attr('onchange', 'checkRange(0);');
        var pageType = $('#hdnPageType').val();
        $("#spnHeavyWeightSPHCExemption").html('<table id=tblRateHeavyWeightSPHCExemption></table>');
        dbTableName = "RateHeavyWeightCommodityExemption";
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,CommoditySubGroupSNo,CommoditySNo,StartWeight,EndWeight,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnRateHeavyWeightSurchargeSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Heavy Weight Commodity Exemption',
            isGetRecord: true,
            initRows: 1,
            // column for edit
            //{ name: 'SubGroupName', display: 'Sub Group Name', type: 'autocomplete', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { updatedRows[updatedRows.length] = rowIndex + 1; }, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                      { name: 'RateHeavyWeightSurchargeSNo', type: 'hidden', value: $('#hdnRateHeavyWeightSurchargeSNo').val() },
                      { name: 'CommoditySubGroupName', display: 'Commodity Sub Group', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'CommoditySubGroup', textColumn: 'SubGroupName', keyColumn: 'SNo' },
                      { name: 'CommodityCode', display: 'Commodity', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'Commodity', textColumn: 'CommodityCode', keyColumn: 'SNo' },
                      { name: 'StartWeight', display: 'Start Weight', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true, onChange: function (evt, rowIndex) { checkWeightRange(rowIndex) } },
                      { name: 'EndWeight', display: 'End Weight', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true, onChange: function (evt, rowIndex) { checkWeightRange(rowIndex) } },
                      //{ name: 'ValidFrom', display: 'Valid From', type: 'text', ctrlAttr: {  controltype: "datetype" } },
                      //{ name: 'ValidTo', display: 'Valid To', type: 'text', ctrlAttr: { controltype: "datetype" } },
                      {
                          name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                      },
                 {
                     name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                 },
                      { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } }
            ],
            isPaging: true
        });
        // load data
        

        //$("#tblRateHeavyWeightCommodityExemption").find("tbody.ui-widget-content").find("tr[id*='tblRateHeavyWeightCommodityExemption']").find("input[id*='StartWeight']").attr('onchange', 'CheckStartWeight(this);');
        //$("#tblRateHeavyWeightCommodityExemption").find("tbody.ui-widget-content").find("tr[id*='tblRateHeavyWeightCommodityExemption']").find("input[id*='EndWeight']").attr('onchange', 'CheckEndWeight(this);');

    }
}
function CreateRateHeavyWeightSPHCExemption() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Heavy Weight SPHC Exemption add on update mode.");
        return;
    }
    else {
        var pageType = $('#hdnPageType').val();
        $("#spnHeavyWeightCommodityExemption").html('<table id=tblRateHeavyWeightCommodityExemption></table>');
        dbTableName = "RateHeavyWeightSPHCExemption";
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,SPHCSNo,StartWeight,EndWeight,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnRateHeavyWeightSurchargeSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Heavy Weight Commodity Exemption',
            isGetRecord: true,
            initRows: 1,
            // column for edit
            //{ name: 'SubGroupName', display: 'Sub Group Name', type: 'autocomplete', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { updatedRows[updatedRows.length] = rowIndex + 1; }, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                      { name: 'RateHeavyWeightSurchargeSNo', type: 'hidden', value: $('#hdnRateHeavyWeightSurchargeSNo').val() },
                      { name: 'Code', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px' }, tableName: 'SPHC', textColumn: 'Code', keyColumn: 'SNo' },
                      { name: 'StartWeight', display: 'Start Weight', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true, onChange: function (evt, rowIndex) { checkWeightRange(rowIndex) } },
                      { name: 'EndWeight', display: 'End Weight', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true, onChange: function (evt, rowIndex) { checkWeightRange(rowIndex) } },
                      { name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' } },
                      { name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' } },
                      { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } }
            ],
            isPaging: true,

        });
        // load data
       // getRecord();

        //$("#tblRateHeavyWeightSPHCExemption").find("tbody.ui-widget-content").find("tr[id*='tblRateHeavyWeightSPHCExemption']").find("input[id*='StartWeight']").attr('onchange', 'CheckStartWeight(this);');
        //$("#tblRateHeavyWeightSPHCExemption").find("tbody.ui-widget-content").find("tr[id*='tblRateHeavyWeightSPHCExemption']").find("input[id*='EndWeight']").attr('onchange', 'CheckEndWeight(this);');
    }
}
function checkWeightRange(rowNo) {
    //if(rowNo>0)
    //{
    
        var StartWeight = parseFloat($('#tbl' + dbTableName + '_StartWeight_' + (rowNo + 1)).val())>0 ? parseFloat($('#tbl' + dbTableName + '_StartWeight_' + (rowNo + 1)).val()):0
        var EndWeight = parseFloat($('#tbl' + dbTableName + '_EndWeight_' + (rowNo + 1)).val())>0 ? parseFloat($('#tbl' + dbTableName + '_EndWeight_' + (rowNo + 1)).val()):0;

        if (StartWeight != 0 && EndWeight != 0) {
            if (EndWeight < StartWeight) {
                alert('End Weight must be greater than Start Weight.');
                $('#tbl' + dbTableName + '_EndWeight_' + (rowNo + 1)).val('');
                $('#_temptbl' + dbTableName + '_EndWeight_' + (rowNo + 1)).val('');
                return false;
            }

        }
    //}
}

//function CheckStartWeight(weight)
//{
//    var StartWeight = parseFloat(weight.value);
//    var SW = weight.id;
//    var EW = SW.replace("StartWeight", "EndWeight")
//    var EndWeight = parseFloat($("#" + EW).val());

//    if (StartWeight > EndWeight  ) {
//        alert('End Weight must be greater than Start Weight.');
//        $("#" + SW).val('');
//        return false;
//    }
//}

//function CheckEndWeight(weight) {
//    var EndWeight = parseFloat(weight.value);
//    var SW = weight.id;
//    var EW = SW.replace("EndWeight", "StartWeight")
//    var StartWeight = parseFloat($("#" + EW).val());

//    if (StartWeight > EndWeight ) {
//        alert('End Weight must be greater than Start Weight.');
//        $("#" + SW).val('');
//        return false;
//    }
//}