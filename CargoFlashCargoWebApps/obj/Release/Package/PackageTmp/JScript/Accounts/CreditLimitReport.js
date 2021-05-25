
$(document).ready(function () {
   
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], clearnext, "contains");
    cfi.AutoComplete("OfficeSNo", "OfficeName", "vw_AirlineOffice", "OfficeSNo", "OfficeName", null, clearagent, "contains");
    cfi.AutoComplete("AccountSNo", "AgentName", "vAirlineOfficeAgent", "AccountSNo", "AgentName", null, null, "contains");
    $('#SearchTransactionHistory').removeClass('button');
    $('#SearchTransactionHistory').addClass('btn btn-success');
    if (userContext.GroupName == "ADMIN") {
       $('#AirlineSNo').val(userContext.AirlineSNo);
       $('#Text_AirlineSNo').val(userContext.AirlineName);
       //$('#OfficeSNo').val(userContext.OfficeSNo);
       //$('#Text_OfficeSNo').val(userContext.OfficeName);
       //$('#AccountSNo').val(userContext.AgentSNo);
       //$('#Text_AccountSNo').val(userContext.AgentName);
       // $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
    }
    else if (userContext.GroupName == "AGENT") {
        $('#AirlineSNo').val(userContext.AirlineSNo);
        $('#Text_AirlineSNo').val(userContext.AirlineName);
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
        $('#OfficeSNo').val(userContext.OfficeSNo);
        $('#Text_OfficeSNo').val(userContext.OfficeName);
        $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
        $('#AccountSNo').val(userContext.AgentSNo);
        $('#Text_AccountSNo').val(userContext.AgentName);
        $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
    }

    // Date picker
    
    $("#ValidFrom").kendoDatePicker({
        
        change : clearDate
    });
    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

    $("#ValidTo,#ValidFrom").closest("span").width(100);
    $("#ValidFrom").data('kendoDatePicker').value('');
    $("#ValidTo").data('kendoDatePicker').value('');



});

function clearDate() {
    if ($("#ValidTo").data('kendoDatePicker').value() < $("#ValidFrom").data('kendoDatePicker').value()) {
        $("#ValidTo").data('kendoDatePicker').value('');
    }
   
$("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
   
    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

    $("#ValidTo,#ValidFrom").closest("span").width(100);
}

 //end

var strData = [];
var wCondition = "";
var pageType = $('#hdnPageType').val();
function CreateCreditLimitReportGrid() {
    var dbtableName = "CreditLimitReport";
    wCondition = BindWhereCondition();
    $("#tblCreditLimitReport").appendGrid({

        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10, whereCondition: wCondition, sort: "",
        contentEditable: true,
        servicePath: "Services/Accounts/CreditLimitReportService.svc",
        getRecordServiceMethod: "GetCreditLimitReportRecord",
        deleteServiceMethod: "",
        caption: "Credit Limit Report",
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: "Reference", display: "Ref/AWBno", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "OfficeName", display: "Office Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AgentName", display: "Agent Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Type", display: "Type", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "CreditLimit", display: "Credit Limit", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "RemainingCreditLimit", display: "Remaining CreditLimit", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "DebitAmount", display: "Debit Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "CreditAmount", display: "Credit Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Transaction_Mode", display: "Transaction Mode", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
             { name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "PenaltyCharges", display: "Penalty Charges", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Cancel", display: "Booking Status", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
           
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
           
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    })
    $('#tblCreditLimitReport_btnRemoveLast').remove();
    $('#tblCreditLimitReport_btnAppendRow').remove();
  //  $("#tblCreditLimitReport").appendGrid('hideColumn', '');
}


function BindWhereCondition() {
    var WhereCondition;
    if ($("#Text_AccountSNo").val() == "") {
        WhereCondition = "OfficeSNo=" + $("#Text_OfficeSNo").data("kendoAutoComplete").key() + " or AccountSNo in ( SELECT SNo FROM account WHERE dbo.account.OfficeSNo IN (SELECT sno FROM office WHERE sno = " + $("#Text_OfficeSNo").data("kendoAutoComplete").key() + "))"
    }
    else {
        WhereCondition = "AccountSNo=" + $("#Text_AccountSNo").data("kendoAutoComplete").key();
    }
    //WhereCondition += $("#Text_AccountSNo").data("kendoAutoComplete").key() != "" ? " AND AccountSNo='" + $("#Text_AccountSNo").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += " And TransactionDate Between '" + $('#ValidFrom').val() + "'" + " And '" + $('#ValidTo').val() + "'"
    return WhereCondition;
}

function ExtraCondition(textId) {
    var filter1 = cfi.getFilter("AND");

    if (textId == "Text_OfficeSNo") {
        try {
            cfi.setFilter(filter1, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
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

$('#SearchTransactionHistory').click(function (e) {

    
    $('#tblCreditLimitReport').hide();
        if ($('#AirlineSNo').val() == "" || $('#OfficeSNo').val() == "") {
            ShowMessage('info', 'Need your Kind Attention!', " Airline, Office cannot be blank")
        }
        
        else if ($('#ValidFrom').val() == "") {
           ShowMessage('info', 'Need your Kind Attention!', " Select Valid From Date")
        }
        else if ($('#ValidTo').val() == "") {
            ShowMessage('info', 'Need your Kind Attention!', " Select Valid To Date")
        }
        else {
            $('#tblCreditLimitReport').show();
            CreateCreditLimitReportGrid();
            //  if (getQueryStringValue("FormAction").toUpperCase() == "NEW"){
            if ($('#tblCreditLimitReport_Type_1').length < 1) {
                ShowMessage('info', 'Need your Kind Attention!', " No Record Found For Given Parameters");
                $('#tblCreditLimitReport').hide();
            };
          
            
            
        }
       

});

//function check() {
//    if ($("#tblCreditLimitReport_rowOrder").val() == "") {
//        ShowMessage('info', 'Need your Kind Attention!', " No Record Found")
//    }
//}

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