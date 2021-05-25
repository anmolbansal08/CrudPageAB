
//Created By Shivali Thakur for Audit Log on 01-08-2017
$(document).ready(function () {
    cfi.AutoCompleteV2("ConAWBPrefix", "AirlineCode", "History_Airline", onselectval, "contains");
    cfi.AutoCompleteV2("KeyValueNameSNo", "SNO,KeyValue", "AuditLog_KeyValue", null, "contains");
    cfi.AutoCompleteV2("PageNameSNo", "PageName", "AuditLog_PageName", selectKeyk, "contains")
    cfi.AutoCompleteV2("AWBSNo", "AWBNo", "AuditLog_AWBNo", null, "contains");
    var form = [{ Key: "1", Text: "New" }, { Key: "2", Text: "Edit" }, { Key: "3", Text: "Delete" }, ];
    cfi.AutoCompleteByDataSource("FormActionNameSNo", form, onchange);
    cfi.DateType("Text_StartDate");
    cfi.DateType("Text_EndDate");
});

function onselectval()
{
    var awbprefix = $("#Text_ConAWBPrefix").val();
    if (awbprefix != "")
    {
        $("#Text_KeyValueNameSNo").attr("disabled", true);
        $("#Text_PageNameSNo").attr("disabled", true);
        $("#Text_FormActionNameSNo").attr("disabled", true);
        $("#Text_KeyValueNameSNo").val("");
        $("#Text_PageNameSNo").val("");
        $("#Text_FormActionNameSNo").val("");
    }
    else
        {
            $("#Text_KeyValueNameSNo").attr("disabled", false);
            $("#Text_PageNameSNo").attr("disabled", false);
            $("#Text_FormActionNameSNo").attr("disabled", false);
        }
}

function selectKeyk(e) {
    var PageNameSNo = $('#Text_PageNameSNo').val();
    if (PageNameSNo != "")
    {
        $("#Text_ConAWBPrefix").attr("disabled", true);
        $("#Text_ConAWBPrefix").val("");
        $("#Text_AWBSNo").attr("disabled", true);
        $("#Text_AWBSNo").val("");
    }
    else
    {
        $("#Text_ConAWBPrefix").attr("disabled", false);
        $("#Text_AWBSNo").attr("disabled", false);
    }
    var data = $('#' + e).data('kendoAutoComplete').key() || $('#' + e).data('kendoAutoComplete').value();// Added By devendra on 21 June 2018
    setAgreementNo(data);
}

function ExportExcel() {
    var awbno = $("#Text_AWBSNo").val();
    var prefix = $("#Text_ConAWBPrefix").val();
    var PageNameSNo = $('#Text_PageNameSNo').val();
    var KeyValueNameSNo = $('#Text_KeyValueNameSNo').val();  
    var fromdate = $("#Text_StartDate").val();
    var todate = $("#Text_EndDate").val();
    if (awbno != '') {
        if (prefix != '') {
            //if (PageNameSNo != '')
            //{
            //    $("#Text_ConAWBPrefix").val("");
            //    $("#Text_AWBSNo").val("");
            //}
            //else
            //{
                $("#Text_KeyValueNameSNo").attr('data-valid', '');
                $("#Text_PageNameSNo").attr('data-valid', '');
                window.location.href = "/AuditLogNew/ExportToExcel_Booking?PageNameSNo=" + prefix + awbno + "&fromdate=" + fromdate + "&todate=" + todate;
            //}
        }
        else {
            ShowMessage('warning', '', 'Please select Prefix.');
            return false;
        }
    }
    else if (prefix != '') {
        if (awbno != '') {
            //if (PageNameSNo != '') {
            //    $("#Text_ConAWBPrefix").val("");
            //    $("#Text_AWBSNo").val("");
            //}
            //else {
                $("#Text_KeyValueNameSNo").attr('data-valid', '');
                $("#Text_PageNameSNo").attr('data-valid', '');
                window.location.href = "/AuditLogNew/ExportToExcel_Booking?PageNameSNo=" + prefix + awbno + "&fromdate=" + fromdate + "&todate=" + todate;
            //}
        }
        else {
            ShowMessage('warning', '', 'Please select AWBNo.');
            return false;
        }
    }    
    else {
        if (PageNameSNo == '') {
            ShowMessage('warning', '', "Function Name cannot be blank !");
            return false;;
        }
        if (KeyValueNameSNo == '') {
            ShowMessage('warning', '', "Key Value cannot be blank !");
            return false;;
        }
        window.location.href = "/AuditLogNew/ExportToExcel?PageNameSNo=" + PageNameSNo + "&KeyValueNameSNo=" + KeyValueNameSNo + "&fromdate=" + fromdate + "&todate=" + todate;
    }
}
function setAgreementNo(val) {
    //var key = "";
    //var keyvalue = "";
    //if (val != undefined && val.length > 0) {

    //    var ANo = val.split('/');
    //    if (ANo.length > 1)
    //    key = ANo[0];
    //    keyvalue = ANo[1];
    //}
    $('#KeyValueNo').val(val);
    //$('#Text_KeyValueNameSNo').text(keyvalue);
}
//function selectKey()
//{   
//    var id = $("#PageNameSNo").val();
//    $.ajax({
//        type: "GET",
//        url: "../AuditLogNew/selectKey/"+id,
//        dataType: "json",
//        success: function (result) {              
//            var FinalData = result.Table0       
//            $("#KeyValueNameSNo").val(FinalData[0].SNo);
//            $("#Text_KeyValueNameSNo").val(FinalData[0].KeyValue);                                 
//        }
//    });

//}
function onchange() {
    var formaction = $("#FormActionNameSNo").val();
    if (formaction == 3) {
        $("#Text_KeyValueNameSNo").attr('data-valid', '');

        $("#spnvform").html("");
    }
    else {
        $("#Text_KeyValueNameSNo").attr('data-valid', 'required');

        $("#spnvform").html("*");
    }
}
$('#Text_KeyValueNameSNo').bind('keypress', function (e) {
    var valid = (e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122);
    if (!valid) {
        e.preventDefault();
    }
});
function Search() {
    var PageNameSNo = $('#Text_PageNameSNo').val();
    var awbno = $("#Text_AWBSNo").val();
    var prefix = $("#Text_ConAWBPrefix").val();
    if (awbno != '') {
        if (prefix != '') {
           
            
                $("#Text_KeyValueNameSNo").attr('data-valid', '');
                $("#Text_PageNameSNo").attr('data-valid', '');
                CreateAuditLogRecordGrid_Acceptence();
                CreateAuditLogRecordGrid_Booking();
          
        }
        else
        {
            ShowMessage('warning', '', 'Please select Prefix.');
            return false;
        }
    }
    else if (prefix != '')
    {
        if (awbno != '') {
          
         
                $("#Text_KeyValueNameSNo").attr('data-valid', '');
                $("#Text_PageNameSNo").attr('data-valid', '');
                CreateAuditLogRecordGrid_Acceptence();
                CreateAuditLogRecordGrid_Booking();
          
        }
        else {
            ShowMessage('warning', '', 'Please select AWBNo.');
            return false;
        }
    }
    else {
        $("#Text_KeyValueNameSNo").attr('data-valid', 'required');
        $("#Text_PageNameSNo").attr('data-valid', 'required');
        if (cfi.IsValidSection('ApplicationTabs')) {
           
                CreateAuditLogRecordGrid();
          
        }
        else {
            return false;
        }
    }
}
function CreateAuditLogRecordGrid_Acceptence() {
    var dbtableName = "AuditLogReport_Booking";
    $("#tblAuditLogReport_Booking").appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10,
        contentEditable: false,
        servicePath: "../AuditLogNew",
        getRecordServiceMethod: "GetActivityRecordSearch_Acceptence",
        deleteServiceMethod: "",
        caption: "Acceptence",
        initRows: 1,
        model: BindWhereCondition(),
        isGetRecord: true,
        columns: [
            { name: "subprocessname", display: "", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "KeyValue", display: "Unique Ref No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "KeyColumn", display: "Item Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "OldValue", display: "Old Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "NewValue", display: "New Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalID", display: "IP", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalName", display: "Terminal Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "FormAction", display: "Form Action", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "UserName", display: "User Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "RequestedOn", display: "Creation Date", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    });

    //$('#tblAuditLogReport__btnRemoveLast').remove();
    //$('#tblAuditLogReport_btnAppendRow').remove();
    //$("#tblAuditLogReport").appendGrid('hideColumn', '');

   

}
function CreateAuditLogRecordGrid_Booking() {
    var dbtableName = "AuditLogReport";

    $("#tblAuditLogReport").appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10,
        contentEditable: false,
        servicePath: "../AuditLogNew",
        getRecordServiceMethod: "GetActivityRecordSearch_Booking",
        deleteServiceMethod: "",
        caption: "Booking",
        initRows: 1,
        model: BindWhereCondition(),
        isGetRecord: true,
        columns: [
             { name: "KeyValue", display: "Unique Ref No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "KeyColumn", display: "Item Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "OldValue", display: "Old Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "NewValue", display: "New Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalID", display: "IP", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalName", display: "Terminal Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "FormAction", display: "Form Action", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "UserName", display: "User Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "RequestedOn", display: "Creation Date", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    });

   // $('#tblAuditLogReport__btnRemoveLast').remove();
    //$('#tblAuditLogReport_btnAppendRow').remove();
   // $("#tblAuditLogReport").appendGrid('hideColumn', '');



}
function CreateAuditLogRecordGrid() {
    var dbtableName = "AuditLogReport";


    $("#tblAuditLogReport").appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10,
        contentEditable: false,
        servicePath: "../AuditLogNew",
        getRecordServiceMethod: "GetActivityRecordSearch",
        deleteServiceMethod: "",
        caption: "Audit Log Report",
        initRows: 1,
        model: BindWhereCondition(),
        isGetRecord: true,
        columns: [
             { name: "subprocessname", display: "", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
             { name: "KeyValue", display: "Unique Ref No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "KeyColumn", display: "Item Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "OldValue", display: "Old Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "NewValue", display: "New Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalID", display: "IP", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalName", display: "Terminal Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "FormAction", display: "Form Action", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "UserName", display: "User Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "RequestedOn", display: "Creation Date", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    });

    $('#tblAuditLogReport_btnRemoveLast').remove();
    $('#tblAuditLogReport_btnAppendRow').remove();
    $("#tblAuditLogReport").appendGrid('hideColumn', '');



}




function BindWhereCondition() {
    return {
        Prefix: $("#Text_ConAWBPrefix").val(),
        AWBNo: $('#Text_AWBSNo').val(),
        PageName: $('#Text_PageNameSNo').val(),
        KeyValue: $('#Text_KeyValueNameSNo').val(),
        StartDate: $('#Text_StartDate').val(),
        EndDate: $('#Text_EndDate').val()

    }
}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
  
   
    if (textId == "Text_KeyValueNameSNo") {
        
        // return textId = filterAirline, cfi.setFilter(textId, "ApplicationName", "in", $("#KeyValueNo").val()), cfi.autoCompleteFilter(textId);
        cfi.setFilter(filterAirline, "ApplicationName", "in", $("#KeyValueNo").val());
        
        cfi.setFilter(filterAirline, "CreatedOn", "gte", cfi.CfiDate("Text_StartDate"));
       
        cfi.setFilter(filterAirline, "CreatedOn", "lte", cfi.CfiDate("Text_EndDate"));
       KeyValueNameSearch = cfi.autoCompleteFilter(filterAirline);
        
        return KeyValueNameSearch;
    }

    //if (textId == "Text_AWBSNo") {

    //    // return textId = filterAirline, cfi.setFilter(textId, "ApplicationName", "in", $("#KeyValueNo").val()), cfi.autoCompleteFilter(textId);
    //    cfi.setFilter(filterAirline, "AWBNo", "eq", $("#Text_AWBSNo").val());

    //    cfi.setFilter(filterAirline, "CreatedOn", "gte", cfi.CfiDate("Text_StartDate"));

    //    cfi.setFilter(filterAirline, "CreatedOn", "lte", cfi.CfiDate("Text_EndDate"));
    //    KeyValueNameSearch = cfi.autoCompleteFilter(filterAirline);

    //    return KeyValueNameSearch;
    //}
    
}


