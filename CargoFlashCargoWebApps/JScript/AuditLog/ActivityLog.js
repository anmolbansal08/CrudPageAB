$(document).ready(function () {


    cfi.AutoCompleteV2("UserIdSNo", "UserID", "ActivityLog_UserID", null, "contains")

  
    cfi.AutoCompleteV2("ModuleSNo", "Module", "ActivityLog_Module", null, "contains")
    cfi.AutoCompleteV2("PageSNo", "AppName", "ActivityLog_Page", null, "contains");
  
    cfi.AutoCompleteV2("ActionSNo", "Action", "ActivityLog_Form", null, "contains");
    cfi.DateType("Text_StartDate");
    cfi.DateType("Text_EndDate");

    $("#Text_UserIdSNo").data("kendoAutoComplete").setDefaultValue(userContext.UserName, userContext.UserName);


    $("#Text_StartDate").data("kendoDatePicker").value(new Date());
    $("#Text_EndDate").data("kendoDatePicker").value(new Date())

    var todaydate = new Date();
    var validfromdate = $("#Text_StartDate").data("kendoDatePicker");
    var validTodate = $("#Text_EndDate").data("kendoDatePicker");
   

    $("input[id^=Text_EndDate]").change(function (e) {

        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("End", "Start");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });

    $("input[id^=Text_StartDate]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("Start", "End");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");

    });



});

var PageNameSNo = "";

//Edited to Export Excel Print by rahul SIngh on 04-08-2017
function ExportActivityToExcel() {

    if (cfi.IsValidSection('ApplicationTabs')) {
        var UserId = $('#UserIdSNo').val();
        var Module = $('#ModuleSNo').val();
        var Page = $('#PageSNo').val();
        var Action = $('#ActionSNo').val();
        var StartDate = $('#Text_StartDate').val();
        var EndDate = $('#Text_EndDate').val();

    }
    else {
        return false;
    }
    window.location.href = "../AuditLog/GetActivityRecordInExcel?userId=" + UserId + "&module=" + Module + "&page=" + Page + "&Raction=" + Action + "&fromDate=" + StartDate + "&toDate=" + EndDate;

    //$.post("/AuditLog/GetActivityRecordInExcel",

    //     { userId: UserId, module: Module, page: Page, action: Action, fromDate: StartDate, toDate: EndDate },
    //                    function (response) {


    //                        //var today = new Date();
    //                        //var dd = today.getDate();
    //                        //var mm = today.getMonth() + 1; //January is 0!

    //                        //var yyyy = today.getFullYear();
    //                        //if (dd < 10) {
    //                        //    dd = '0' + dd;
    //                        //}
    //                        //if (mm < 10) {
    //                        //    mm = '0' + mm;
    //                        //}
    //                        //var today = dd + '_' + mm + '_' + yyyy;
    //                        //var a = document.createElement('a');
    //                        //var data_type = 'data:application/vnd.ms-excel';
    //                        //var table_div = response;
    //                        //var table_html = table_div.replace(/ /g, '%20');
    //                        //a.href = data_type + ', ' + table_html;
    //                        //a.download = 'ActivityLogData_' + today + '_.xls';
    //                        //a.click();
    //                        ////}
    //                        //return false
    //                    }
    //                 );

}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_PageSNo") {
        try {

            cfi.setFilter(filterAirline, "Module", "eq", $("#Text_ModuleSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }

        catch (exp)
        { }
    }

    if (textId == "Text_ActionSNo") {
        try {

            cfi.setFilter(filterAirline, "AppName", "eq", $("#Text_PageSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }

        catch (exp)
        { }
    }

}

function ExportActivitySearch() {

    if (cfi.IsValidSection('ApplicationTabs')) {
        CreateActivityRecordReportGrid();
    }
    else {
        return false;
    }
}

function CreateActivityRecordReportGrid() {
    //var dbtableName = "CreditLimitReport";
    var dbtableName = "ActivityLogReport";
    var UserId = $('#UserIdSNo').val();
    var Module = $('#ModuleSNo').val();
    var Page = $('#PageSNo').val();
    var Action = $('#ActionSNo').val();
    var StartDate = $('#Text_StartDate').val();
    var EndDate = $('#Text_EndDate').val();
    
    $("#tblActivityLogReport").appendGrid({
        V2:true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10,
        contentEditable: false,
        servicePath: "../AuditLog",
        getRecordServiceMethod: "GetActivityRecordSearch",
        deleteServiceMethod: "",
        caption: "Activity Log Report",
        initRows: 1,
        model:BindWhereCondition(),
        isGetRecord: true,
        columns: [
        
            { name: "UserID", display: "UserID", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "SessionKey", display: "Session Key", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "City", display: "City", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "Module", display: "Module", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "Page", display: "Page", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "Action", display: "Action", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "IpAddress", display: "Ip Address", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "TerminalName", display: "Terminal Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "Browser", display: "Browser", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "RequestedOn", display: "Requested On", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    });
 
    $('#tblActivityLogReport_btnRemoveLast').remove();
    $('#tblActivityLogReport_btnAppendRow').remove();
    $("#tblActivityLogReport").appendGrid('hideColumn', '');
}


function BindWhereCondition()
{
    return{
        UserId     : $('#UserIdSNo').val()||'',
        Module     : $('#ModuleSNo').val()||'',
        Page       : $('#PageSNo').val()||'',
        Action     : $('#ActionSNo').val()||'',
        StartDate  : $('#Text_StartDate').val(),
        EndDate    : $('#Text_EndDate').val()
}
}
