
$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "TransactionHistory_Airline", clearnext, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "TransactionHistory_City", clearnext, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "TransactionHistory_Office", clearagent, "contains");
    cfi.AutoCompleteV2("AccountSNo", "AgentName", "TransactionHistory_Agent", null, "contains");
});
//CreateTransactionHistoryGrid();
var strData = [];
var wCondition = "";
//var pageType = $('#hdnPageType').val();
function CreateTransactionHistoryGrid() {
    var dbtableName = "TransactionHistory";
    //wCondition = BindWhereCondition();
    $("#tblTransactionHistory").appendGrid({
        V2 : true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10, model : BindWhereCondition(), sort: "",
        contentEditable: true,
        servicePath: "/Services/Accounts/TransactionHistoryService.svc",
        getRecordServiceMethod: "GetTransactionHistoryRecord",
        deleteServiceMethod: "",
        caption: "Transaction History",
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: "Text_AirlineSNo", display: "Airline", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AgentName", display: "Agent Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AgentCode", display: "Agent Code", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Text_CitySNo", display: "City", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Text_OfficeSNo", display: "Office", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Text_CurrencySNo", display: "Currency", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Amount", display: "Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Text_TransactionType", display: "Transaction Mode", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AccountNo", display: "Account No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false }

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    })
    $('#tblTransactionHistory_btnRemoveLast').remove();
    $('#tblTransactionHistory_btnAppendRow').remove();
    $("#tblTransactionHistory").appendGrid('hideColumn', '');
}



//function BindWhereCondition() {
 //   var WhereCondition = $("#Text_CitySNo").data("kendoAutoComplete").key() != "" ? "CitySNo='" + $("#Text_CitySNo").data("kendoAutoComplete").key() + "'" : "";
 //   WhereCondition += $("#Text_OfficeSNo").data("kendoAutoComplete").key() != "" ? "AND OfficeSNo='" + $("#Text_OfficeSNo").data("kendoAutoComplete").key() + "'" : "";
//    WhereCondition += $("#Text_AccountSNo").data("kendoAutoComplete").key() != "" ? "AND AccountSNo='" + $("#Text_AccountSNo").data("kendoAutoComplete").key() + "'" : "";
 //   return btoa(WhereCondition);
//}

function BindWhereCondition() {
    return {
        AirlineSNo: $("#Text_AirlineSNo").data("kendoAutoComplete").key() || 0,
        CitySNo: $("#Text_CitySNo").data("kendoAutoComplete").key() || 0,
        OfficeSNo: $("#Text_OfficeSNo").data("kendoAutoComplete").key() || 0,
        AccountSNo: $("#Text_AccountSNo").data("kendoAutoComplete").key() || 0

    }
}
function ExtraCondition(textId) {
    var filter1 = cfi.getFilter("AND");

    if (textId == "Text_OfficeSNo") {
        try {
            cfi.setFilter(filter1, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
            cfi.setFilter(filter1, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }

    if (textId == "Text_AccountSNo") {
        try {
            cfi.setFilter(filter1, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter4 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter4;
        }
        catch (exp)
        { }
    }
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}
//
$('#SearchTransactionHistory').click(function (evt) {
    $('#tblTransactionHistory').hide();
    if ($('#AirlineSNo').val() == "" || $('#CitySNo').val() == "" || $('#OfficeSNo').val() == "") {
       
        ShowMessage('info', 'Need your Kind Attention!', " Airline, City, Office cannot be blank")
    }
    else
    {
        $('#tblTransactionHistory').show();
        CreateTransactionHistoryGrid();
    }
});

function clearnext() {
    $('#OfficeSNo').val('');
    $('#Text_OfficeSNo').val('');
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');
}
function clearagent() {
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');

}