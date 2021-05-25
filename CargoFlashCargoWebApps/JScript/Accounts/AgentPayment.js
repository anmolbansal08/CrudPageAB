
$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "CreditLimitReport_Airline", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "AWBStockStatus_City", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "CreditLimitReport_AirlineOffice", null, "contains");
    cfi.AutoCompleteV2("AccountSNo", "AgentName", "AgentPayment_Account", null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "DirectPayment_Currency", null, "contains");
   // $('#imgexcel').hide();
});



function SearchPaymentStatusReport() {

    var airline = $('#AirlineSNo').val();
    var city = $('#CitySNo').val();
    var agent = $("#AccountSNo").val();
    if (airline == "" && city == "" && agent == "") {
        return false;
    }
    else {
        var dbtableName = "CreditLimitReport";
        //wCondition = BindWhereCondition();
        $("#tblCreditLimitReport").appendGrid({
            V2: true,
            tableID: "tbl" + dbtableName,
            tableColumns: 'SNo',
            masterTableSNo: 1,
            isExtraPaging: true,
            currentPage: 1,
            itemsPerPage: 10, model: BindWhereCondition(), sort: "",
            contentEditable: false,
            servicePath: "../AgentPayment",
            getRecordServiceMethod: "GetAgentPaymentRecord",
            deleteServiceMethod: "",
            caption: "Agent Credit Limit Report",
            initRows: 1,
            isGetRecord: true,
            columns: [
            //  { name: "SNo", type: "hidden" },
          // { name: "OfficeName", display: "Office Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                {
                    name: "OfficeName", display: "Office Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false
                },
                {
                    name: "AccountName", display: "Account Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                },
                {
                    name: "CityCode", display: "City Code", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                },
                {
                    name: "CurrentBalance", display: "Current Balance", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                },
                {
                    name: "CurrencyCode", display: "Currency Code", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                },

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
    }

}



function BindWhereCondition() {
    return {

        OfficeSNo: $("#OfficeSNo").val() || 0,
        AccountSNo: $("#AccountSNo").val() || 0,
        CurrencySNo: $('#CurrencySNo').val() == "" ? 0 : $('#CurrencySNo').val(),
        AirlineSNo: $('#AirlineSNo').val() || 0,
        CitySNo: $('#CitySNo').val() || 0,
    };
}


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    //if (textId == "Text_OfficeSNo") {
    //    cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
    //    cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());

    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //    return OriginCityAutoCompleteFilter2;
    //}

    if (textId == "Text_AccountSNo") {
       // cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        //cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}

function AuditLogBindOldValue(id) {

}


function ExportToExcel() {

    var OfficeSNo = $("#OfficeSNo").val() || 0;
    var AccountSNo =$("#AccountSNo").val() || 0;
    var CurrencySNo= $('#CurrencySNo').val() == "" ? 0 : $('#CurrencySNo').val();
    var AirlineSNo = $('#AirlineSNo').val() || 0;
    var CitySNo = $('#CitySNo').val() || 0;
  
    window.onbeforeunload = null;
    //window.location.href = "../DataSetToExcel/DataSetToExcelFile?officeSno=" + officeSno + "&AccountSNo=" + AccountSNo + "&ValidFrom=" + $("#ValidFrom").val() + "&ValidTo=" + $("#ValidTo").val() + "&AirlineSNo=" + $("#AirlineSNo").val() + "&CurrencySNo=" + CurrencySNo + "&IsBGREport=" + IsBGREport + "&TransactionMode=" + TransactionMode;
    window.location.href = "../AgentPayment/ExportToExcelFile?AirlineSNo=" + AirlineSNo + "&CitySNo=" + CitySNo + "&AccountSNo=" + AccountSNo + "&OfficeSNo=" + OfficeSNo + "&CurrencySNo=" + CurrencySNo;


}