$(document).ready(function () {


    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "vGetAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("TerminalSNo", "TerminalName", "Terminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");
    var Ownership = [{ Key: "0", Text: "DOMESTIC" }, { Key: "1", Text: "INTERNATIONAL" }, { Key: "2", Text: "BOTH" }];


    cfi.AutoCompleteByDataSource("TransactionType", Ownership);


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        BindEventMessageTrans();
        $('#Text_TransactionType').data("kendoAutoComplete").value('BOTH');
        $('#TransactionType').val('2');
    }
    if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {

        BindEventMessageTrans();


    }
    $("input[name='operation']").unbind("click").click(function () {

      
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        if (cfi.IsValidSubmitSection()) {
            GetAppendGridData();

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

                var _KeyValue = document.getElementById("__SpanHeader__").innerText
                var parts = _KeyValue.split(":");
                var KeyValue = parts[parts.length - 1];
                AuditLogSaveNewValue("tbl", true, '', 'Process Dependency', KeyValue);
            }
           
            return true;
        }
        else {
            return false
        }
    });



});

function GetAppendGridData() {
    var res = $("#tblProcessDependencyTrans tr[id^='tblProcessDependencyTrans']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblProcessDependencyTrans');
    var data = $('#tblProcessDependencyTrans').appendGrid('getStringJson');
    $("#hdnFormData").val(JSON.stringify(JSON.parse(data)));
}

function AWBShow(obj) {
    if ($(obj).closest('tr').find("input[id^=tblProcessDependencyTrans_SubProcessName_").val() != "") {
        $(obj).closest('tr').find("input[id^=tblProcessDependencyTrans_AWBStatusType_").val('');
        $(obj).closest('tr').find("input[id^=tblProcessDependencyTrans_AWBStatusType_").data("kendoAutoComplete").enable(false);
    }
}


function SubProcessShow(obj) {
    if ($(obj).closest('tr').find("input[id^=tblProcessDependencyTrans_AWBStatusType_").val() != "") {
        $(obj).closest('tr').find("input[id^=tblProcessDependencyTrans_SubProcessName_").val('');
        $(obj).closest('tr').find("input[id^=tblProcessDependencyTrans_SubProcessName_").data("kendoAutoComplete").enable(false);
    }
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_AirportSNo") {
        try {
            cfi.setFilter(filter, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    var filterterminal = cfi.getFilter("AND");
    if (textId == "Text_TerminalSNo") {
        try {
            cfi.setFilter(filterterminal, "AirportSNo", "eq", $("#Text_AirportSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterterminal]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}
function BindEventMessageTrans() {
    var ProcessDependencyTrans = "ProcessDependencyTrans";
    var GetRecord = "GetProcessDependencyGridAppendGrid";
    var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
    $('#tbl' + ProcessDependencyTrans).appendGrid({
        tableID: 'tbl' + ProcessDependencyTrans,
        contentEditable: true,
        masterTableSNo: $("#hdnEditSno").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: null,
        servicePath: 'Services/Permissions/ProcessDependencyService.svc',
        getRecordServiceMethod: GetRecord,
        createUpdateServiceMethod: '',
        caption: "Process",
        initRows: 1,
        isGetRecord: true,
        hideButtons: { updateAll: true, insert: true },
        columns: [{ name: 'SNo', type: 'hidden' },
                  { name: "SubProcessName", display: "Sub Process", ctrlClass: 'classSubProcessName', type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return AWBShow(this);" }, ctrlCss: { width: "250px" }, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains",  },
                 { name: "AWBStatusType", display: "AWB Staus", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return SubProcessShow(this);" }, ctrlCss: { width: "100px" }, tableName: "vwAWBStatusMessageType", textColumn: "AWBStatusType", keyColumn: "SNo", filterCriteria: "contains" },
                   { name: "DependSubProcessName", display: "Dependent Sub Process", ctrlClass: 'classDependSubProcessName', type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "250px" }, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", separator: ",", isRequired: false },
                   {
                       name: "ReturnMessage", display: "Message", type: 'textarea', ctrlClass: 'classReturnMessage', type: controlType, ctrlAttr: { maxlength: 100, controltype: "textarea" }, ctrlCss: { width: "250px", height: "45px" }, isRequired: false
                   },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblProcessDependencyTrans_Row']").each(function (row, tr) {
                //$(tr).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").attr("data-valid", "required");
                //$(tr).find("input[id^='tblProcessDependencyTrans_HdnSubProcessName_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").attr("width", "100px");
                $(tr).find("input[id^='tblProcessDependencyTrans_DependSubProcessName_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblProcessDependencyTrans_DependSubProcessName_']").attr("width", "100px");
                $(tr).find("input[id^='tblProcessDependencyTrans_ReturnMessage_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblProcessDependencyTrans_ReturnMessage_']").attr("width", "100px");

    
            });
        },
    });


    // Remove requied for exist data
    $("tr[id^=tblProcessDependencyTrans_Row]").each(function () {



        if ($(this).find("input[id^='tblProcessDependencyTrans_SubProcessName']").data("kendoAutoComplete").key() != "")
            $(this).find("input[id^='tblProcessDependencyTrans_SubProcessName']").removeAttr("required");

        if ($(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType']").data("kendoAutoComplete").key() != "")
            $(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType']").removeAttr("required");

    });
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        debugger;

        $("tr[id^=tblProcessDependencyTrans_Row_]").each(function () {

            if ($(this).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").val() == "") {
                $(this).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").data("kendoAutoComplete").enable(false);
            }

            if ($(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType_']").val() == "") {
                $(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType_']").data("kendoAutoComplete").enable(false);

            }
            $(".k-i-arrow-s").attr("disabled", "disabled");
        });
    }





}
