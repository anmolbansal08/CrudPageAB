var originalval = '';
var recordId = 0;
var newID = 0;
$(document).ready(function () {
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");

    cfi.AutoCompleteV2("SPHCCode", "Code", "Master_CheckListType_SHCCode", SPHCFunction, "contains");
    cfi.AutoCompleteV2("CopyFrom", "SPHCCode", "Master_CheckListType_CopyFrom", getExistRecord, "contains");
    cfi.AutoCompleteV2("AirportName", "AirportCode,AirportName", "Master_CheckListType_AirportName", null, "contains");
    cfi.AutoCompleteV2("AirlineName", "CarrierCode,AirlineName", "Master_CheckListType_AirlineName", null, "contains", ",");
    var TransactionType = [{ Key: "0", Text: "EXPORT" }, { Key: "1", Text: "IMPORT" }, { Key: "2", Text: "BOTH" }];
    cfi.AutoCompleteByDataSource("Type", TransactionType);
    var tabStrip1 = $("#CheckListTypeTabs").kendoTabStrip().data("kendoTabStrip");

    cfi.AutoCompleteV2("SPHCSubGroupSNo", "SNo,SPHCCode", "Master_CheckListType_SPHCSubGroup", null,"contains");
    $("#spnAirlineName").closest('td').find('*').hide();
    $("#AirlineName").closest('td').find("span").hide();

    $("input[name='Text_AirlineName']").attr('disabled', true);

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //$("#AirportName").attr("value", userContext.SysSetting.DefaultAirportSNo);
        //$("#Text_AirportName").attr("value", userContext.SysSetting.DefaultAirportCode + "-" + userContext.SysSetting.DefaultAirportName);


        //commented by akash bcz incorrect  binding

        $("#AirportName").attr("value", userContext.AirportSNo);
        $("#Text_AirportName").attr("value", userContext.AirportCode + "-" + userContext.AirportName);

    }
    cfi.EnableAutoComplete("AirportName", true, false, "");





    $('#tblCheckListType input:text[id^="tblCheckListType_PRIORITY"]').live("keyup", function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });
    BindingGridonClick();
    RemovingAppendGridColumnInEDIT();
    BindingAutocompleteOnRadioButtonAction();
    $("#btnGenerate").click(function (e) {

        var tblCheckListType = "tblCheckListType";
        if (recordId != 0) {
            var rows = $("tr[id^='" + tblCheckListType + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            $("[id^='tblCheckListType_CLTSNo']").val(newID);
            $("[id^='tblCheckListType_SNo']").val(0);
            getUpdatedRowIndex(rows.join(","), tblCheckListType);
            if (!validateTableData(tblCheckListType, rows)) {
                return false;
            }
        }
        else {
            var rows = $("tr[id^='" + tblCheckListType + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            getUpdatedRowIndex(rows.join(","), tblCheckListType);
            if (!validateTableData(tblCheckListType, rows)) {
                return false;
            }
        }
        var bool = false;
        $("tr[id^=tblCheckListType_Row]").each(function () {
            var id = $(this).attr("id");
            var id1 = $("tr[id=" + id + "] td:nth-child(3) input[type=text]").attr("id");
            if ($("input[id=" + id1 + "]").val() == "") {
                bool = false;
                return false;
            }
            else {
                bool = true;
            }
        });
        if (bool == true) {
            SaveCheckListTypeHeader();

        }
    });

    var hidden = $("#Name").val();
    if (hidden != "") {
        $("#btnGenerate").attr("value", "Update");
    }
    if (hidden != "") {
        $("#btnGenerateDetail").attr("value", "Update");
    }

    $("#btnGenerateDetail").click(function (e) {
        var tblCheckListDetail = "tblCheckListDetail"
        var rows = $("tr[id^='" + tblCheckListDetail + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        //getUpdatedRowIndex(rows.join(","), tblCheckListDetail);
        if (!validateTableData(tblCheckListDetail, rows)) {
            $('#btnGenerateDetail').attr('disabled', false);
            return false;
        }
        else {
            if (rows.length != 0)
                $('#btnGenerateDetail').attr('disabled', true);
        }
        var bool = false;
        $("tr[id^=tblCheckListDetail_Row]").each(function () {
            var id = $(this).attr("id");
            var id1 = $("tr[id=" + id + "] td:nth-child(2) input[type=text]").attr("id");
            if ($("input[id=" + id1 + "]").val() == "") {
                bool = false;
                return false;
            }
            else {
                bool = true;
            }
        });
        if (bool == true) {
            SaveDetailChecklist();
            //$('#btnGenerateDetail').attr('disabled', false);
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#btnGenerate").hide();
        $("#btnGenerateDetail").hide();

        var Airline = $("#FOR").val();

        if (Airline == "Airline") {
            $("span[id='spnAirlineName']").show();//.attr("Display", "Visible");
            $("span[id='Text_AirlineName']").show();
        }
        else if (Airline == "SAS") {
            $("span[id='spnAirlineName']").hide();//.attr("Display", "Visible");
            $("span[id='Text_AirlineName']").hide();
        }
        else if (Airline == "IATA") {
            $("span[id='spnAirlineName']").hide();//.attr("Display", "Visible");
            $("span[id='Text_AirlineName']").hide();
        }
    }


    var pagetype = getQueryStringValue("FormAction").toUpperCase();
    if (pagetype == "NEW" || pagetype == "EDIT") {
        $('#GeneralHeader,#GeneralFooter').on('input keydown keyup', function () {
            var header = $("#GeneralHeader").val();
            var footer = $("#GeneralFooter").val();
            $("#GeneralHeader").val(header);
            $("#GeneralFooter").val(footer);
        });

    }

});
//$('input[name="operation"]').click(function (e) {
//    debugger
//    var SKeyValue = "";
//    var FormAction = "";
//    var KeyValue = "";
//    var TerminalSNo = "";
//    var TerminalName = "";
//    var KeyColumn = "CheckList Type";
//    FormAction = getQueryStringValue("FormAction").toUpperCase();
//    KeyValue = document.getElementById('__SpanHeader__').innerText;
//    TerminalSNo = userContext.TerminalSNo;
//    TerminalName = userContext.NewTerminalName;
//    Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName);

//});
//function Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName) {
//    if (FormAction == "DELETE" || FormAction == "EDIT") {
//        SKeyValue = KeyValue.split(':');
//        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue[1], '', FormAction, TerminalSNo, TerminalName);
//    }
//    else if (FormAction == "NEW") {
//        KeyValue = document.getElementById('Name').value;
//        SKeyValue = KeyValue.toUpperCase();
//        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue, '', FormAction, TerminalSNo, TerminalName);
//    }
//}
function SaveCheckList() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var serviceName = "UpdateCheckListType";
        var CheckListType = [];
        var a
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
            a = CUrrentCTLSNo;
        else
            a = $("#SNo").val();
        CheckListType.push({
            Name: $("#Name").val(),
            For: $("input[id='FOR']:checked").val(),
            AirportSNo: $("#AirportName").val() || 0,
            //SNo: $("#SNo").val(),
            SNo: a,
            //SHC: $("#SHC").val(),
            SHC: $("input[id='SHC']:checked").val(),
            SPHCCode: $("#Text_SPHCCode").val(),
            SPHCSNo: $('input[name=SHC]:checked').val() == "0" ? $("#SPHCCode").val() : 0,
            //SPHCSNo: $("#SPHCCode").val(),
            SPHCGroupSNo: $('input[name=SHC]:checked').val() == "1" ? $("#SPHCCode").val() : 0,
            IsIATA: $("input[name='FOR']:checked").val() == "0" ? true : false,
            IsSAS: $("input[name='FOR']:checked").val() == "1" ? true : false,
            AirlineSNo: $("#AirlineName").val() == "" ? "0" : $("#AirlineName").val(),
            EnteredBy: userContext.UserSNo,//1,//((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
            ChecklistVersion: $("#ChecklistVersion").val(),
            GeneralHeader: $("#GeneralHeader").val(),
            GeneralFooter: $("#GeneralFooter").val(),
            ColumnName1: $("#ColumnName1").val(),
            ColumnName2: $("#ColumnName2").val(),
            ColumnName3: $("#ColumnName3").val(),
            Type: $("#Type").val(),
            SPHCSubGroupSNo: $("#SPHCSubGroupSNo").val()
        });

        $.ajax({
            url: "Services/Master/CheckListTypeService.svc/" + serviceName,
            async: false,
            type: "POST",
            cache: false,
            data: JSON.stringify(CheckListType),
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                if (response.length > 0) {
                    ShowMessage('warning', 'Warning - Checklist', response[0]);
                }
                else {
                    ShowMessage('success', 'Success!', "Checklist Updated Successfully");
                    $("#liCheckListHeader").show();
                    $("#liCheckListDetail").show();
                    $("#CheckListTypeTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liCheckListHeader'));
                    $("#liCheckListHeader").trigger("click");
                }

            }
        });
        return false;
    }
}
var CUrrentCTLSNo = 0;
function SaveCheckListType() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        var serviceName = "SaveCheckListTypenew";
        var CheckListType = [];
        CheckListType.push({
            Name: $("#Name").val(),
            For: $("input[id='FOR']:checked").val(),
            AirportSNo: $("#AirportName").val() || 0,
            SNo: $("#SNo").val(),
            //SHC: $("#SHC").val(),
            SHC: $("input[id='SHC']:checked").val(),
            SPHCCode: $("#Text_SPHCCode").val(),
            SPHCSNo: $('input[name=SHC]:checked').val() == "0" ? $("#SPHCCode").val() : 0,
            SPHCGroupSNo: $('input[name=SHC]:checked').val() == "1" ? $("#SPHCCode").val() : 0,
            IsIATA: $("input[name='FOR']:checked").val() == "0" ? true : false,
            CopyFrom: recordId,
            IsSAS: $("input[name='FOR']:checked").val() == "1" ? true : false,
            AirlineSNo: $("#AirlineName").val() == "" ? "0" : $("#AirlineName").val(),
            EnteredBy: userContext.UserSNo,//1,//((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
            ChecklistVersion: $("#ChecklistVersion").val(),
            GeneralHeader: $("#GeneralHeader").val(),
            GeneralFooter: $("#GeneralFooter").val(),
            ColumnName1: $("#ColumnName1").val(),
            ColumnName2: $("#ColumnName2").val(),
            ColumnName3: $("#ColumnName3").val(),
            Type: $("#Type").val(),
            SPHCSubGroupSNo: $("#SPHCSubGroupSNo").val()
        });

        $.ajax({
            url: "Services/Master/CheckListTypeService.svc/" + serviceName,
            async: false,
            type: "POST",
            cache: false,
            data: JSON.stringify(CheckListType),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ErrorNo = parseInt(JSON.parse(response)[0].ReturnErrorNo);
                CUrrentCTLSNo = parseInt(JSON.parse(response)[0].SNo);
                newID = parseInt(JSON.parse(response)[0].SNo);
                if (ErrorNo != 0) {
                    ShowMessage('warning', 'Warning - Checklist', 'Checklist Type Already Exists');
                }
                else {
                    ShowMessage('success', 'Success!', "Checklist Added Successfully");
                    if ($("#Text_CopyFrom").val() == '')
                        $("#Text_CopyFrom").val(0);
                    if ($("#Text_CopyFrom").val() != "0") {
                        window.setTimeout(function () {
                            window.location.href = 'Default.cshtml?Module=Master&Apps=CheckListType&FormAction=INDEXVIEW';
                        }, 500);
                    }
                    else {
                        $("input[type='submit']").hide();
                        var str = '<input type="button" id="name="operation" value="Update" class="btn btn-success" onclick="SaveCheckList()">';
                        $("#Text_CopyFrom").parent().hide();
                        $("#spnCopyFrom").hide();
                        $("input[type=submit][value='Save']").after(str);
                        $("#liCheckListHeader").show();
                        $("#liCheckListDetail").show();
                        $("#CheckListTypeTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liCheckListHeader'));
                        $("#liCheckListHeader").trigger("click");
                    }
                }
            }
        });
        return false;
    }
}

function SaveCheckListTypeHeader() {
    var hidden;
    var chkHidden = true;
    $("tr[id^='tblCheckListType_Row']").each(function () {
        hidden = $("#" + $(this).attr("id").replace("Row", "SNo")).val();
        if (hidden == "0")
            chkHidden = false;
        return chkHidden;
    });
    if (hidden != "0") {

        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            var res = $("#tblCheckListType tr[id^='tblCheckListType']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
            getUpdatedRowIndex(res, 'tblCheckListType');
        }
        var data = JSON.parse(($('#tblCheckListType').appendGrid('getStringJson')));
        if (data != false) {
            $.ajax({
                url: "Services/Master/CheckListTypeService.svc/UpdateCheckListTypeHeader", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ss = result;
                    $("#CheckListTypeTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liCheckListDetail'));
                    DetailCheckListType();
                    ShowMessage('success', 'Success!', "Checklist Header Updated Successfully");
                    //$('#btnGenerate').removeAttr('disabled');
                },
                error: function (error) {
                    // $('#btnGenerate').removeAttr('disabled');
                }
            });
        }
    }

    else {
        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {
            var res = $("#tblCheckListType tr[id^='tblCheckListType']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
            getUpdatedRowIndex(res, 'tblCheckListType');
        }
        var data = JSON.parse(($('#tblCheckListType').appendGrid('getStringJson')));
        for (var i = 0; i < data.length; i++) {
            if (data[i].CLTSNo == "") {
                data[i].CLTSNo = CUrrentCTLSNo;
            }
        }
        if (data != false) {
            $.ajax({
                url: "Services/Master/CheckListTypeService.svc/SaveCheckListTypeHeader", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ss = result;
                    $("#CheckListTypeTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liCheckListDetail'));
                    DetailCheckListType();
                    ShowMessage('success', 'Success!', "Checklist Header Added Successfully");
                    // $('#btnGenerate').removeAttr('disabled');
                },
                error: function (error) {
                    //$('#btnGenerate').removeAttr('disabled');
                }
            });
        }
    }
}

function SaveDetailChecklist() {
    var hidden;
    var chkHidden = true;
    $("tr[id^='tblCheckListDetail_Row']").each(function () {
        hidden = $("#" + $(this).attr("id").replace("Row", "SNo")).val();
        //if (recordId != 0) {
        //    $("#" + $(this).attr("id").replace("Row", "SNo")).val(0);
        //    hidden = $("#" + $(this).attr("id").replace("Row", "SNo")).val();
        //}
        if (hidden == "0")
            chkHidden = false;
        return chkHidden;
    });
    var res = true;
    $("table[id^='tblCheckListDetail']").find("tr[id^='tblCheckListDetail_Row']").each(function () {
        var yes = $("#" + $(this).attr("id") + " td:eq(6)").find(":checkbox").is(":checked");
        var no = $("#" + $(this).attr("id") + " td:eq(8)").find(":checkbox").is(":checked");
        var na = $("#" + $(this).attr("id") + " td:eq(10)").find(":checkbox").is(":checked");
        var remark = $("#" + $(this).attr("id") + " td:eq(12)").find(":checkbox").is(":checked");
        var control1 = $("#" + $(this).attr("id") + " td:eq(14)").find(":checkbox").is(":checked");
        var control2 = $("#" + $(this).attr("id") + " td:eq(16)").find(":checkbox").is(":checked");
        var control3 = $("#" + $(this).attr("id") + " td:eq(18)").find(":checkbox").is(":checked");

        if (Control1 != '' && Control2 != '' && Control3 != '') {
            if (yes == false && no == false && na == false && remark == false && control1 == false && control2 == false && control3 == false) {
                alert("Check atleast one of the options.");
                res = false;
            }
        } else if (Control2 == '' && Control3 == '') {
            if (yes == false && no == false && na == false && remark == false && control1 == false) {
                alert("Check atleast one of the options.");
                res = false;
            }
        }
        else if (Control3 == '') {
            if (yes == false && no == false && na == false && remark == false && control1 == false && control2 == false) {
                alert("Check atleast one of the options.");
                res = false;
            }
        } else if (Control1 == '' && Control2 == '' && Control3 == '') {
            if (yes == false && no == false && na == false && remark == false) {
                alert("Check atleast one of the options.");
                res = false;
            }
        }
    });
    if (!res) {
        alert("Check atleast one of the options.");
        $('#btnGenerateDetail').attr('disabled', false);
        return res;
    }
    if (hidden != "0") {

        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            var res = $("#tblCheckListDetail tr[id^='tblCheckListDetail']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
            getUpdatedRowIndex(res, 'tblCheckListDetail');
        }
        if (recordId != 0) {
            var rows = $("#tblCheckListDetail tr[id^='tblCheckListDetail']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            // $("[id^='tblCheckListType_CLTSNo']").val(newID);
            $("[id^='tblCheckListDetail_SNo']").val(0);
            getUpdatedRowIndex(rows.join(","), 'tblCheckListDetail');
        }
        var setting = $('#tblCheckListDetail').data("appendGrid");
        var data = JSON.parse(tableToJSON(setting.tableID, setting.columns, setting.updatedRows));
        // var data = JSON.parse(($('#tblCheckListDetail').appendGrid('getStringJson')));
        if (data != false) {
            $.ajax({
                url: "Services/Master/CheckListTypeService.svc/UpdateCheckListDetail", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ShowMessage('success', 'Success!', "Checklist Detail Updated Successfully.");
                    setTimeout(function () { navigateUrl('Default.cshtml?Module=Master&Apps=CheckListType&FormAction=INDEXVIEW'); }, 1000);
                },
                error: function (error) {
                    $('#btnGenerateDetail').attr('disabled', false);
                }
            });
        }
    }
    else {
        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {
            if (recordId != 0) {
                var rows = $("#tblCheckListDetail tr[id^='tblCheckListDetail']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
                //   $("[id^='tblCheckListType_CLTSNo']").val(newID);
                $("[id^='tblCheckListType_SNo']").val(0);
                getUpdatedRowIndex(rows.join(","), 'tblCheckListDetail');

            }
            else {
                var res = $("#tblCheckListDetail tr[id^='tblCheckListDetail']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
                getUpdatedRowIndex(res, 'tblCheckListDetail');
            }
        }
        var setting = $('#tblCheckListDetail').data("appendGrid");
        var data = JSON.parse(tableToJSON(setting.tableID, setting.columns, setting.updatedRows));
        if (data != false) {
            $.ajax({
                url: "Services/Master/CheckListTypeService.svc/SaveCheckListDetail", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ShowMessage('success', 'Success!', "Checklist Detail Added Successfully", 20000);
                    setTimeout(function () { navigateUrl('Default.cshtml?Module=Master&Apps=CheckListType&FormAction=INDEXVIEW'); }, 1000);
                },
                error: function (error) {
                    $('#btnGenerateDetail').attr('disabled', false);
                }
            });
        }
    }
}

// convert table data to JSON
function ngetJSONDataString(tableName, colName, type, rIndex) {
    var str = '';
    if (colName.type == 'radio' || colName.type == 'checkbox')
        str += '"' + colName.name + '":"' + (document.getElementById(tableName + '_' + colName.name + '_' + rIndex).checked ? 1 : 0) + '"';
    else if ((!isEmpty(colName.ctrlAttr) ? (!isEmpty(colName.ctrlAttr.controltype) ? colName.ctrlAttr.controltype : colName.type) : colName.type) == 'autocomplete') {
        str += '"Hdn' + colName.name + '":"' + $('#' + tableName + '_Hdn' + colName.name + '_' + rIndex).val() + '",';
        str += '"' + colName.name + '":"' + $('#' + tableName + '_' + colName.name + '_' + rIndex).val() + '"';
    }
    else if (!isEmpty($('#' + tableName + '_' + colName.name + '_' + rIndex).attr('data-role')) && $('#' + tableName + '_' + colName.name + '_' + rIndex).attr('data-role') == 'numerictextbox') {
        str += '"' + colName.name + '":"' + $('#_temp' + tableName + '_' + colName.name + '_' + rIndex).val() + '"';
    }
    else if (colName.type == 'radiolist') {
        for (var x in colName.ctrlOptions) {
            if (document.getElementById(tableName + '_Rbtn' + colName.name + '_' + rIndex + '_' + x).checked)
                str += '"' + colName.name + '":"' + $('#' + tableName + '_Rbtn' + colName.name + '_' + rIndex + '_' + x).val() + '"';
        }
    }
    else
        str += '"' + colName.name + '":"' + $('#' + tableName + '_' + colName.name + '_' + rIndex).val().replace(/"/g, '~') + '"';
    return str;

}

function tableToJSON(tableName, colName, uRows) {
    try {
        var noOfRows;
        if (!$.isArray(uRows)) {
            noOfRows = new Array();
            noOfRows[0] = uRows;
        }
        else
            noOfRows = uRows;
        var strJSON = '[';
        for (var row = 0; row < noOfRows.length; row++) {
            strJSON += '{';
            for (var col = 0; col < colName.length; col++) {
                if (colName[col].type == 'div') {
                    for (var d = 0; d < colName[col].divElements.length; d++) {
                        if (colName[col].divElements[d].type != 'label') {
                            strJSON += ngetJSONDataString(tableName, colName[col].divElements[d], colName[col].divElements[d].type, noOfRows[row]);
                            if (d < (colName[col].divElements.length - 1))
                                strJSON += ',';
                        }
                    }
                }
                else if (colName[col].type != 'label') {

                    strJSON += ngetJSONDataString(tableName, colName[col], colName[col].type, noOfRows[row]);

                }
                if (col < (colName.length - 1) && colName[col].type != 'label')
                    strJSON += ',';
            }
            strJSON += '}';
            if (row < noOfRows.length - 1)
                strJSON += ',';
        }
        // }
        strJSON += ']';
        return strJSON;
    }
    catch (e) { return '[]'; }
}

function DetailCheckListType() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        CUrrentCTLSNo = $("#SNo").val();
    }
    if (recordId != 0) {
        CUrrentCTLSNo = recordId;
    }
    GetColumnName(CUrrentCTLSNo);
    var CheckListType = "CheckListDetail";
    $('#tbl' + CheckListType).appendGrid({
        tableID: 'tbl' + CheckListType,
        contentEditable: true,
        masterTableSNo: CUrrentCTLSNo,
        currentPage: 1, itemsPerPage: 100, whereCondition: null,
        servicePath: './Services/Master/CheckListTypeService.svc',
        getRecordServiceMethod: 'GetCheckListDetail',
        createUpdateServiceMethod: '',
        deleteServiceMethod: 'DeleteCheckListDetail',
        caption: "Checklist Detail",
        initRows: 1,
        isGetRecord: true,
        rowNumColumnName: 'SNo',
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            { CLTSNo: 'CLTSNo', type: 'hidden', value: CUrrentCTLSNo },
                  { name: "Name", display: "Checklist Header Name", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: "CheckListDetail_Header", filterField: "Name" },
                  {
                      name: "SrNo", display: "Serial No.", type: "text", ctrlCss: { width: '30px' }, ctrlAttr: { controltype: "text", allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/', maxlength: 8 }, isRequired: true
                  },
                  { name: "Description", display: "Description", type: "text", ctrlCss: { width: '300px' }, ctrlAttr: { controltype: "text", allowchar: "'\"!@#$%^&*()_-+={[}]:;<,>.?/", maxlength: 500 }, isRequired: true },
                  { name: "PRIORITY", display: "Priority", type: "text", ctrlCss: { width: '30px' }, ctrlAttr: { controltype: "number", maxlength: 4, onblur: "return CheckPriority(this.id);" }, isRequired: true },
                  {
                      name: 'Options', display: 'Options', type: 'div', isRequired: true,
                      divElements:
                      [{ divRowNo: 1, name: "Y", type: "checkbox", display: "YES:" },
                      { divRowNo: 1, name: "N", type: "checkbox", display: "NO:" },
                      { divRowNo: 1, name: "NA", type: "checkbox", display: "NA:" },
                      { divRowNo: 1, name: "Remarks", type: "checkbox", display: "REMARKS:" },
                      { divRowNo: 1, name: "Column1", type: "checkbox", display: Control1 },
                      { divRowNo: 1, name: "Column2", type: "checkbox", display: Control2 },
                      { divRowNo: 1, name: "Column3", type: "checkbox", display: Control3 }
                      //{ divRowNo: 1, name: "Document", type: "checkbox", display: "Document:" },
                      //{ divRowNo: 1, name: "Mandatory", type: "checkbox", display: "Required:" }
                      ]
                  },
        ],
        dataLoaded: function () {
            $("tr[id^='tblCheckListDetail_Row']").each(function (indexInArray, valueOfElement) {
                $("#tblCheckListDetail_Name_" + (indexInArray + 1)).trigger('click');
            })
        },
        beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
            var res = true;
            $("tr[id^='tblCheckListDetail_Row']").each(function () {
                var yes = $("#" + $(this).attr("id") + " td:eq(6)").find(":checkbox").is(":checked");
                var no = $("#" + $(this).attr("id") + " td:eq(8)").find(":checkbox").is(":checked");
                var na = $("#" + $(this).attr("id") + " td:eq(10)").find(":checkbox").is(":checked");
                var remark = $("#" + $(this).attr("id") + " td:eq(12)").find(":checkbox").is(":checked");
                var control1 = $("#" + $(this).attr("id") + " td:eq(14)").find(":checkbox").is(":checked");
                var control2 = $("#" + $(this).attr("id") + " td:eq(16)").find(":checkbox").is(":checked");
                var control3 = $("#" + $(this).attr("id") + " td:eq(18)").find(":checkbox").is(":checked");
                if (Control1 != '' && Control2 != '' && Control3 != '') {
                    if (yes == false && no == false && na == false && remark == false && control1 == false && control2 == false && control3 == false) {
                        alert("Check atleast one of the options.");
                        res = false;
                    }
                } else if (Control2 == '' && Control3 == '') {
                    if (yes == false && no == false && na == false && remark == false && control1 == false) {
                        alert("Check atleast one of the options.");
                        res = false;
                    }
                }
                else if (Control3 == '') {
                    if (yes == false && no == false && na == false && remark == false && control1 == false && control2 == false) {
                        alert("Check atleast one of the options.");
                        res = false;
                    }
                } else if (Control1 == '' && Control2 == '' && Control3 == '') {
                    if (yes == false && no == false && na == false && remark == false) {
                        alert("Check atleast one of the options.");
                        res = false;
                    }
                }
                else {
                    res = true;
                }
            });
            return res;
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            var j = $("#tblCheckListDetail tr[id]:last").attr('id').split('_')[2];
            $("#_temptblCheckListDetail_PRIORITY_" + j).css("width", "30px");
            $("#tblCheckListDetail_PRIORITY_" + j).css("width", "30px");
            if (Control1 == '' && Control2 == '' && Control3 == '') {
                $("#tblCheckListDetail_Column1_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn1_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column2_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn2_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column3_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').hide();
            }
            else if (Control2 == '' && Control3 == '') {
                $("#tblCheckListDetail_Column2_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn2_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column3_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').hide();
            }
            else if (Control3 == '') {
                $("#tblCheckListDetail_Column3_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').hide();
            }
            else {
                $("#tblCheckListDetail_lblColumn1_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn2_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').show();
                $("#tblCheckListDetail_Column1_" + j).closest('td').show();
                $("#tblCheckListDetail_Column2_" + j).closest('td').show();
                $("#tblCheckListDetail_Column3_" + j).closest('td').show();
            }

        },
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        isPaging: true
    });
    var pagetype = getQueryStringValue("FormAction").toUpperCase();
    if (pagetype == "NEW" || pagetype == "EDIT" || pagetype == 'READ') {
        var totalrow = $("tr[id^='tblCheckListDetail_Row']").length;
        for (var j = 1; j < totalrow + 1; j++) {
            if (Control1 == '' && Control2 == '' && Control3 == '') {
                $("#tblCheckListDetail_Column1_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn1_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column2_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn2_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column3_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').hide();
            }
            else if (Control2 == '' && Control3 == '') {
                $("#tblCheckListDetail_Column2_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn2_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column3_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').hide();
            }
            else if (Control3 == '') {
                $("#tblCheckListDetail_Column3_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').hide();
            }
            else {
                $("#tblCheckListDetail_lblColumn1_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn2_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn3_" + j).closest('td').show();
                $("#tblCheckListDetail_Column1_" + j).closest('td').show();
                $("#tblCheckListDetail_Column2_" + j).closest('td').show();
                $("#tblCheckListDetail_Column3_" + j).closest('td').show();
            }
        }
    }


}

function ViewDetailCheckListType() {
    var CheckListType = "CheckListDetail";
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    GetColumnName($("#SNo").val());
    $('#tbl' + CheckListType).appendGrid({
        tableID: 'tbl' + CheckListType,
        contentEditable: false,
        masterTableSNo: $("#SNo").val(),
        currentPage: 1, itemsPerPage: 100, whereCondition: null,
        servicePath: './Services/Master/CheckListTypeService.svc',
        getRecordServiceMethod: 'GetCheckListDetail',
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: "Checklist Detail",
        initRows: 1,
        isGetRecord: true,
        rowNumColumnName: 'SNo',
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                  { name: "Name", display: "Checklist Header Name", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "60px" }, isRequired: true, AutoCompleteName: "CheckListType_Header", filterField: "Name"},
                  { name: "SrNo", display: "Serial No.", type: "text", ctrlCss: { width: '10px' }, ctrlAttr: { controltype: "number", maxlength: 8 }, isRequired: true },
                  { name: (pageType == "READ" ? "vDescription" : "Description"), display: "Description", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "uppercase", maxlength: 500 }, isRequired: true },
                  { name: "PRIORITY", display: "Priority", type: "text", ctrlCss: { width: '10px' }, ctrlAttr: { controltype: "number", maxlength: 4 }, isRequired: true },
                  {
                      name: 'Options', display: 'Options', type: 'div', ctrlCss: { width: "100px" }, isRequired: true,
                      divElements:
                      [
                      { divRowNo: 1, name: "YTxt", type: "label", display: "YES:" },
                      { divRowNo: 1, name: "NTxt", type: "label", display: "NO:" },
                      { divRowNo: 1, name: "NATxt", type: "label", display: "NA:" },
                      { divRowNo: 1, name: "RemarksTxt", type: "label", display: "REMARKS:" },
                      { divRowNo: 1, name: "Column1Txt", type: "label", display: Control1 },
                      { divRowNo: 1, name: "Column2Txt", type: "label", display: Control2 },
                      { divRowNo: 1, name: "Column3Txt", type: "label", display: Control3 }
                      ]
                  },
        ],
        dataLoaded: function () {
            $("tr[id^='tblCheckListDetail_Row']").each(function (indexInArray, valueOfElement) {
                var cntrl = $("#tblCheckListDetail_vDescription_" + (indexInArray + 1));
                var $input = $("<textarea>", { val: $(cntrl).text(), id: cntrl, type: "textarea", style: "width:200px;height:50px;background-color:white; ", disabled: 1 });
                $(cntrl).replaceWith($input);

                cntrl = $("#tblCheckListDetail_Name_" + (indexInArray + 1));
                $input = $("<textarea>", { val: $(cntrl).text(), type: "textarea", style: "width:200px;height:50px;background-color:white;", disabled: 1 });
                $(cntrl).replaceWith($input);
            });
        },

        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        isPaging: true
    });

    var pagetype = getQueryStringValue("FormAction").toUpperCase();
    if (pagetype == 'READ') {
        var totalrow = $("tr[id^='tblCheckListDetail_Row']").length;
        for (var j = 1; j < totalrow + 1; j++) {
            if (Control1 == '' && Control2 == '' && Control3 == '') {
                $("#tblCheckListDetail_Column1Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn1Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column2Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn2Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column3Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3Txt_" + j).closest('td').hide();
            }
            else if (Control2 == '' && Control3 == '') {
                $("#tblCheckListDetail_Column2Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn2Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_Column3Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3Txt_" + j).closest('td').hide();
            }
            else if (Control3 == '') {
                $("#tblCheckListDetail_Column3Txt_" + j).closest('td').hide();
                $("#tblCheckListDetail_lblColumn3Txt_" + j).closest('td').hide();
            }
            else {
                $("#tblCheckListDetail_Column1Txt_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn1Txt_" + j).closest('td').show();
                $("#tblCheckListDetail_Column2Txt_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn2Txt_" + j).closest('td').show();
                $("#tblCheckListDetail_Column3Txt_" + j).closest('td').show();
                $("#tblCheckListDetail_lblColumn3Txt_" + j).closest('td').show();
            }


        }
    }
}

function UpdateCheckListType() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        CUrrentCTLSNo = $("#SNo").val();
    }
    if (recordId != 0) {
        CUrrentCTLSNo = recordId;
    }
    var CheckListType = "CheckListType";
    $('#tbl' + CheckListType).appendGrid({
        tableID: 'tbl' + CheckListType,
        contentEditable: true,
        masterTableSNo: CUrrentCTLSNo,
        currentPage: 1, itemsPerPage: 100, whereCondition: null, sort: '',
        servicePath: './Services/Master/CheckListTypeService.svc',
        getRecordServiceMethod: 'GetCheckListTypeAppendGrid',
        createUpdateServiceMethod: '',
        deleteServiceMethod: 'DeleteCheckListTypeHeader',
        caption: "Checklist Header",
        initRows: 1,
        isGetRecord: true,
        rowNumColumnName: 'SNo',
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            { name: 'CLTSNo', type: 'hidden', value: CUrrentCTLSNo },
            { name: "SectionHeader", display: "Section Header", type: "text", ctrlCss: { width: '300px' }, ctrlAttr: { controltype: "text", maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' } },
             { name: "SrNo", display: "Serial No.", type: "text", ctrlCss: { width: '30px' }, ctrlAttr: { controltype: "text", maxlength: 8, allowchar: '.' }, isRequired: true },

                  //{ name: "Name", display: "Name", type: "text", ctrlCss: { width: '500px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' }, isRequired: true, },
                  {
                      name: 'Options', display: 'Name', type: 'div', isRequired: true,
                      divElements:
                      [
                      { divRowNo: 1, name: "Name", type: "text", ctrlCss: { width: '400px' }, ctrlAttr: { controltype: "text", maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' }, isRequired: true, },
                      { divRowNo: 1, name: "HideHeader", type: "checkbox", display: "Hide" }
                      ]
                  },

                  { name: "PRIORITY", display: "Priority", type: "text", ctrlCss: { width: '30px' }, ctrlAttr: { controltype: "number", maxlength: 4, onblur: "return CheckPriority(this.id);" }, isRequired: true },
                  { name: "SectionFooter", display: "Section Footer", type: "text", ctrlCss: { width: '300px' }, ctrlAttr: { controltype: "text", maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' }, }],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            var j = $("#tblCheckListType tr[id]:last").attr('id').split('_')[2];
            $("#_temptblCheckListType_PRIORITY_" + j).css("width", "30px");
            $("#tblCheckListType_PRIORITY_" + j).css("width", "30px");
        },
        isPaging: true,
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },

    });


}

function ViewCheckListType() {
    var CheckListType = "CheckListType";
    $('#tbl' + CheckListType).appendGrid({
        tableID: 'tbl' + CheckListType,
        contentEditable: false,
        masterTableSNo: $("#SNo").val(),
        currentPage: 1, itemsPerPage: 100, whereCondition: null,
        servicePath: './Services/Master/CheckListTypeService.svc',
        getRecordServiceMethod: 'GetCheckListTypeAppendGrid',
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: "Checklist Header",
        initRows: 1,
        isGetRecord: true,
        rowNumColumnName: 'SNo',
        columns: [{ name: 'SNo', type: 'hidden' },
             { name: "SectionHeader", display: "Section Header", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "text", maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' } },
                 { name: "SrNo", display: "Serial No.", type: "text", ctrlCss: { width: '30px' }, ctrlAttr: { controltype: "number", maxlength: 8, allowchar: '.' }, isRequired: true },
                  //{ name: "Name", display: "Name", type: "text", ctrlCss: { width: '300px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' }, isRequired: true },
                  {
                      name: 'Options', display: 'Name', type: 'div', isRequired: true,
                      divElements:
                      [
                      { divRowNo: 1, name: "Name", type: "text", ctrlCss: { width: '200px' }, ctrlAttr: { controltype: "text", maxlength: 120, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' }, isRequired: true, },
                      { divRowNo: 1, name: "HideHeaderTxt", type: "label", display: "Hide", ctrlCss: { width: '10px', height: '10px' } }
                      ]
                  },
                  { name: "PRIORITY", display: "Priority", type: "text", ctrlCss: { width: '50px' }, ctrlAttr: { controltype: "number", maxlength: 12 }, isRequired: true },
        { name: "SectionFooter", display: "Section Footer", type: "text", ctrlCss: { width: '200px' }, ctrlAttr: { controltype: 'text', maxlength: 200, allowchar: '!@#$%^&*()_-+={[}]~`:;<,>.?/' } }],
        dataLoaded: function () {
            $("tr[id^='tblCheckListType_Row']").each(function (indexInArray, valueOfElement) {
                var cntrl = $("#tblCheckListType_SectionHeader_" + (indexInArray + 1));
                var $input = $("<textarea>", { val: $(cntrl).text(), id: cntrl, type: "textarea", style: "width:300px;height:50px;background-color:white; ", disabled: 1 });
                $(cntrl).replaceWith($input);

                cntrl = $("#tblCheckListType_Name_" + (indexInArray + 1));
                $input = $("<textarea>", { val: $(cntrl).text(), type: "textarea", style: "width:300px;height:50px;background-color:white;", disabled: 1 });
                $(cntrl).replaceWith($input);
                cntrl = $("#tblCheckListType_SectionFooter_" + (indexInArray + 1));
                $input = $("<textarea>", { val: $(cntrl).text(), type: "textarea", style: "width:300px;height:50px;background-color:white;", disabled: 1 });
                $(cntrl).replaceWith($input);
            });
        },
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        isPaging: true
    });
    var pagetype = getQueryStringValue("FormAction").toUpperCase();
    if (pagetype == "READ") {
        var totalrow = $("tr[id^='tblCheckListType']").length;
        for (var i = 1; i < totalrow + 1; i++) {
            $("#tblCheckListType_HideHeaderTxt_" + i).closest('td').css("width", "10px");
            $("#tblCheckListType_lblHideHeaderTxt_" + i).closest('td').css("width", "20px");
            $("#tblCheckListType_lblHideHeaderTxt_" + i).closest('td').css("border", "none");
            $("#tblCheckListType_HideHeaderTxt_" + i).closest('td').css("border", "none")
        }
    }
}

function CheckPriority(obj) {
    var priority = $("#" + obj).val();
    if (priority == "0") {
        alert("Priority can not be zero");
        $("#" + obj).val("");
    }
    else {
        if (obj.indexOf("tblCheckListType") > -1) {
            $("tr[id^=tblCheckListType_Row]").each(function () {
                if (obj != $(this).attr("id").replace("Row", "PRIORITY")) {
                    var currValue = $("#" + obj.replace(obj.split("_")[2], $(this).attr("id").split("_")[2])).val();
                    if (priority == currValue && priority != "") {
                        alert("Priority can not be repeated");
                        $("#" + obj).val("");
                    }
                    return;
                }
            })
        }
        else if (obj.indexOf("tblCheckListDetail") > -1) {
            $("tr[id^=tblCheckListDetail_Row]").each(function () {
                if (obj != $(this).attr("id").replace("Row", "PRIORITY")) {
                    var currValue = $("#" + obj.replace(obj.split("_")[2], $(this).attr("id").split("_")[2])).val();
                    if (priority == currValue && priority != "") {
                        alert("Priority can not be repeated");
                        $("#" + obj).val("");
                    }
                    return;
                }
            })
        }
    }
}

function BackButton() {
    navigateUrl('Default.cshtml?Module=Master&Apps=CheckListType&FormAction=INDEXVIEW');
}

function BindingGridonClick() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#liCheckListHeader").hide();
        $("#liCheckListDetail").hide();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#liCheckListHeader").on("click", function (event) {
            UpdateCheckListType();
        });
        $("#liCheckListDetail").on("click", function (event) {
            DetailCheckListType();
        });
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#liCheckListType").on("click", function (event) {
            UpdateCheckListType();
        });
        $("#liCheckListDetail").on("click", function (event) {
            DetailCheckListType();
        });
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#liCheckListHeader").on("click", function (event) {
            ViewCheckListType();
        });
        $("#liCheckListDetail").on("click", function (event) {
            ViewDetailCheckListType();
        });
    }

}

function RemovingAppendGridColumnInEDIT() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#liCheckListHeader").on("click", function (event) {
            UpdateCheckListType();
        });

        $("#liCheckListDetail").on("click", function (event) {
            DetailCheckListType();
        })
    }
}

function BindingAutocompleteOnRadioButtonAction() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        if ($("input[name^=FOR]:checked").val() == 2) {
            $("#spnAirlineName").closest('td').find('*').show();
            $("#Text_AirlineName").attr("data-valid", "required");
            $("#AirlineName").closest('td').find('span').show();
            //$("#tbl tr:nth-child(6) td font").show();
            //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").show();
            $("input[name='Text_AirlineName']").attr('disabled', false);
            cfi.BindMultiValue("AirlineName", $("#Text_AirlineName").val(), $("#AirlineName").val());
            $("#Multi_AirlineName").val($("#AirlineName").val());

            //cfi.ResetAutoComplete("Text_AirlineName");
            //cfi.ResetAutoComplete("AirlineName")
        }
        if ($("input[name^=FOR]:checked").val() == 1) {
            $("#Text_AirlineName").attr("data-valid", "required");
            $("#Text_AirlineName").val("");
            $("#AirlineName").val("");
            $("#divMultiAirlineName ul li").find('span[class="k-icon k-delete"]').click();
        }
        if ($("input[name^=FOR]:checked").val() == 0) {
            $("#Text_AirlineName").attr("data-valid", "required");
            $("#Text_AirlineName").val("");
            $("#AirlineName").val("");
            $("#divMultiAirlineName ul li").find('span[class="k-icon k-delete"]').click();
        }
        if ($("input[name^=SHC]:checked").val() == 1) {
            //cfi.AutoComplete("SPHCCode", "Name", "SPHCGroup", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoCompleteV2("SPHCCode", "Name", "Master_CheckListType_SPHCCode", null,"contains");
            $("#spnSPHCCode").text("SHC Group Name:");
            $("span#spnSPHCSubGroupSNo").closest('td').find("*").hide();
            $("#SPHCSubGroupSNo").closest('td').find("*").hide();
            $("#SPHCSubGroupSNo").val('');
            $("#Text_SPHCSubGroupSNo").val('');
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

        if ($("input[name^=FOR]:checked").val() == 2) {
            $("#spnAirlineName").closest('td').find('*').show();
            $("#AirlineName").closest('td').find('span').show();
            //$('#Multi_AirlineName').closest('li').hide();
            //$("#tbl tr:nth-child(6) td font").show();
            //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").show();
        }
        //if ($("input[name^=SHC]:checked").val() == 1) {
        if ($("input[name^=SHC]").val() == 'SHC Group') {
            $("#spnSPHCCode").text("SHC Group Name:");
            $("span#spnSPHCSubGroupSNo").closest('td').find("*").hide();
            $("#SPHCSubGroupSNo").closest('td').find("*").hide();
            $("#SPHCSubGroupSNo").val('');
            $("#Text_SPHCSubGroupSNo").val('');
        }

        $("input[name='FOR']").attr('disabled', true);
        $("input[name^='SHC']").attr('disabled', true);
    }

    $("input[name^=SHC]").live("click", function () {
        if ($("input[name^=SHC]:checked").val() == 0) {
            var data = GetDataSourceV2("SPHCCode", "Master_CheckListType_SHCCode");
            cfi.ChangeAutoCompleteDataSource("SPHCCode", data, true, SPHCFunction, "Code", "contains");
            $('#spnSPHCCode').text('SHC Code:');
            $("#Text_SPHCCode").attr('data-valid-msg', 'SHC Code cannot be blank');
            $("#CopyFrom").val('');
            $("#Text_CopyFrom").val('');
            $("span#spnSPHCSubGroupSNo").closest('td').find("*").show();
            $("#SPHCSubGroupSNo").closest('td').find("*").show();
            $("#SPHCSubGroupSNo").val('');
            $("#Text_SPHCSubGroupSNo").val('');
        }
        if ($("input[name^=SHC]:checked").val() == 1) {
            var data = GetDataSourceV2("SPHCCode", "SHCDocument_SPHCGroup", "SNo", "Name", ["Name"], null);
            cfi.ChangeAutoCompleteDataSource("SPHCCode", data, true, null, "Name", "contains");
            $('#spnSPHCCode').text('SHC Group Name:');
            $("#Text_SPHCCode").attr('data-valid-msg', 'SHC Group Name cannot be blank');
            $("#CopyFrom").val('');
            $("#Text_CopyFrom").val('');
            $("span#spnSPHCSubGroupSNo").closest('td').find("*").hide();
            $("#SPHCSubGroupSNo").closest('td').find("*").hide();
            $("#SPHCSubGroupSNo").val('');
            $("#Text_SPHCSubGroupSNo").val('');
        }
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("input[name^=FOR]").live("click", function () {
            if ($("input[name^=FOR]:checked").val() == 2) {

                $("#spnAirlineName").closest('td').find('*').show();
                $("#AirlineName").closest('td').find('span').show();
                //$('#Multi_AirlineName').closest('li').hide();
                //$("#tbl tr:nth-child(6) td font").show();
                $("#Text_AirlineName").attr("data-valid", "required");
                $("#Text_AirlineName").val("");

                $("#AirlineName").val("");
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").parent("li").show();
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").show();
                $("input[name='Text_AirlineName']").attr('disabled', false);

                $("#divMultiAirlineName ul li").find('span[class="k-icon k-delete"]').click();
                //var len = $("#divMultiAirlineName ul").find('li').length;                
                //$("#divMultiAirlineName ul li").each(function (i, r) {
                //    if (r < len)
                //        $(r).remove();
                //})
                //$("#AirlineName").val('');
                //$("#Multi_AirlineName").val('');
                //$("#FieldKeyValuesAirlineName").text('');
                //$('#Text_AirlineName').val("");


            }
            else {

                $("#spnAirlineName").closest('td').find('*').hide();
                $("#AirlineName").closest('td').find('span').hide();
                //$("#tbl tr:nth-child(6) td font").hide();
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").parent("li").hide();
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").hide();
                $("#divMultiAirlineName ul li").find('span[class="k-icon k-delete"]').click();
                $("input[name='Text_AirlineName']").attr('disabled', true);
                cfi.ResetAutoComplete("AirlineName");

            }
        });
    }
    else
        $("input[name^=FOR]").live("click", function () {
            if ($("input[name^=FOR]:checked").val() == 2) {

                $("#spnAirlineName").closest('td').find('*').show();
                $("#AirlineName").closest('td').find('span').show();
                //$("#tbl tr:nth-child(6) td font").show();
                $("#Text_AirlineName").attr("data-valid", "required");
                $("#Text_AirlineName").val("");
                $("#AirlineName").val("");
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").parent("li").show();
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").show();
                $("input[name='Text_AirlineName']").attr('disabled', false);

                $("#divMultiAirlineName ul li").find('span[class="k-icon k-delete"]').click();
                //var len = $("#divMultiAirlineName ul").find('li').length;
                //$("#divMultiAirlineName ul li").each(function (i, r) {
                //    if (r < len)
                //        $(r).remove();
                //})
                //$("#AirlineName").val('');
                //$("#Multi_AirlineName").val('');
                //$("#FieldKeyValuesAirlineName").text('');
                //$('#Text_AirlineName').val("");
            }
            else {

                $("#spnAirlineName").closest('td').find('*').hide();
                $("#AirlineName").closest('td').find('span').hide();
                $("#divMultiAirlineName ul li").find('span[class="k-icon k-delete"]').click();
                //$("#tbl tr:nth-child(6) td font").hide();
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").parent("li").hide();
                //$("#tbl tbody tr:nth-child(6) td:nth-child(2) span").hide();
                $("input[name='Text_AirlineName']").attr('disabled', true);
                cfi.ResetAutoComplete("AirlineName");
            }
        });
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("tblCheckListDetail_Name_") >= 0) {
        if (recordId == 0)
            cfi.setFilter(filterEmbargo, "CheckListTypeSNo", "in", CUrrentCTLSNo);
        else
            cfi.setFilter(filterEmbargo, "CheckListTypeSNo", "in", newID);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId == "Text_AirlineName") {
        return cfi.getFilter("AND"), cfi.setFilter(filterEmbargo, "SNo", "notin", $("#AirlineName").val()), cfi.autoCompleteFilter(filterEmbargo);
    };

    if (textId == "Text_CopyFrom") {
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SPHCSNo", "eq", $("#SPHCCode").val()), cfi.autoCompleteFilter(textId);
    }

    if (textId == "Text_SPHCSubGroupSNo") {
        cfi.setFilter(filterEmbargo, "SPHCSNo", "neq", 0);
        cfi.setFilter(filterEmbargo, "SPHCSNo", "eq", $('#SPHCCode').val())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
}


function GetColumnName(CUrrentCTLSNo) {
    var recordID = CUrrentCTLSNo;
    $.ajax({
        url: "./Services/Master/CheckListTypeService.svc/GetColumnName",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ recordID: recordID }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {

            var dataTableobj = JSON.parse(result);
            var data = dataTableobj.Table;
            if (data.length > 0) {
                Control1 = data[0].ColumnName1;
                Control2 = data[0].ColumnName2;
                Control3 = data[0].ColumnName3;
            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}
//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

function getExistRecord(id, text, hdnid, key) {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        if ($("#Text_CopyFrom").val != 0) {
            var SphcSno = key;
            var SphcCode = text.split('-')[0];
            var Name = text.split('-')[1]
            $.ajax({
                url: "Services/Master/CheckListTypeService.svc/getExistsRecord",
                async: false,
                type: "POST",
                cache: false,
                data: JSON.stringify({ SphcSno: SphcSno, SphcCode: SphcCode, Name: Name }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    var data = dataTableobj.Table;
                    if (data.length > 0) {
                        recordId = data[0].Sno;
                        $("#GeneralHeader").val(data[0].GeneralHeader);
                        $("#GeneralFooter").val(data[0].GeneralFooter);
                        $("#ColumnName1").val(data[0].ColumnName1);
                        $("#ColumnName2").val(data[0].ColumnName2);
                        $("#ColumnName3").val(data[0].ColumnName3);
                        $("#GeneralHeader").attr('readonly', true);
                        $("#GeneralFooter").attr('readonly', true);
                        $("#ColumnName1").attr('readonly', true);
                        $("#ColumnName2").attr('readonly', true);
                        $("#ColumnName3").attr('readonly', true);
                    }
                }
            });
        }
    }
}

function SPHCFunction() {
    $('#SPHCSubGroupSNo').val('');
    $('#Text_SPHCSubGroupSNo').val('');
}

