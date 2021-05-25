
$(document).ready(function () {
   
    var paymenttype = [{ Key: "0", Text: "ALL" }, { Key: "1", Text: "ENTRY" }, { Key: "2", Text: "VERIFICATION" }, { Key: "3", Text: "APPROVAL" }, { Key: "4", Text: "REVERSAL" }];
    cfi.AutoCompleteByDataSource("PaymentType", paymenttype, null);
    cfi.AutoCompleteV2("AgentName", "Name,ParticipantID", "EDI_RecipientConfig_Account", null, "contains");
    //cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "AllotmentRelease_Airport", null, "contains");
    var PaymentStatus = [{ Key: "0", Text: "ALL" }, { Key: "1", Text: "VERIFIED" }, { Key: "2", Text: "REJECTED" }];
    cfi.AutoCompleteByDataSource("PaymentStatus", PaymentStatus, null);
    $("#Text_PaymentStatus").closest('td').prev('td').text("");
    $("#Text_PaymentStatus").closest('td').contents().hide();
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var firstdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), 1)
    var lastDate = new Date(todaydate.getFullYear(), todaydate.getMonth() +1 , 0)
    var validTodate = $("#ToDate").data("kendoDatePicker");
    
   // validTodate.min(todaydate);
    $("#FromDate").data("kendoDatePicker").value(firstdate);
    $("#ToDate").data("kendoDatePicker").value(lastDate);
    validTodate.min(todaydate);


    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }

    });
    function checkcondition(e) {
        var value = this.value();
        if (value == "ALL" || value == "REVERSAL" || value == "ENTRY" || value == "") {
            $("#Text_PaymentStatus_input, Text_PaymentStatus,PaymentStatus").val("")
            $("#Text_PaymentStatus").closest('td').prev('td').text("");
            $("#Text_PaymentStatus").closest('td').contents().hide()


            //cfi.EnableAutoComplete('PaymentStatus', false, false, null);
            //$("#Text_PaymentStatus_input, Text_PaymentStatus,PaymentStatus").val("")
        }
        else {
          //  cfi.EnableAutoComplete('PaymentStatus', true, true, null);
            $("#Text_PaymentStatus").closest('td').prev('td').text("Payment Status");
            $("#Text_PaymentStatus").closest('td').contents().show()
            if (value == "APPROVAL") {
                var PaymentStatus = [{ Key: "0", Text: "ALL" }, { Key: "1", Text: "APPROVED" }, { Key: "2", Text: "REJECTED" }];
                cfi.AutoCompleteByDataSource("PaymentStatus", PaymentStatus, null);
            }
            else {
                var PaymentStatus = [{ Key: "0", Text: "ALL" }, { Key: "1", Text: "VERIFIED" }, { Key: "2", Text: "REJECTED" }];
                cfi.AutoCompleteByDataSource("PaymentStatus", PaymentStatus, null);
            }
        }
    }
    
    var combobox = $("#Text_PaymentType").data("kendoComboBox");
    combobox.bind("change", checkcondition);

});
function SearchPaymentStatusReport() {
    var dbtableName = "CreditLimitReport";
    //wCondition = BindWhereCondition();
    $("#tblCreditLimitReport").appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10,
        model: BindWhereCondition(),
        sort: "",
        contentEditable: false,
        servicePath: "../PaymentStatusReport",
        getRecordServiceMethod: "GetPaymentStatusRecord",
        deleteServiceMethod: "",
        caption: "Payment Report",
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: "SNo", type: "hidden" },
            {
                name: "AirlineName", display: "Airline Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false
            },
                

            {
                name: "RequestedID", display: "Requested ID", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "CityCode", display: "City Code", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "OfficeName", display: "Office Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "AgentName", display: "Agent Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "Currency", display: "Currency", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "Amount", display: "Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "PaymentMode", display: "Payment Mode", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "RequestedDate", display: "Requested Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },


            {
                name: "RequestedBy", display: "Requested By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            {
                name: "RequestedRemarks", display: "Requested Remarks", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },

            {
                name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "ReferenceNo", display: "Reference No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Status", display: "Status", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "ApprovedBy", display: "Approved By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },

            {
                name: "ApprovedOn", display: "Approved On", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "ApprovedRemarks", display: "Approved Remarks", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "ReversedBy", display: "Reversed By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "ReversedOn", display: "Reversed On", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "ReversalRemarks", display: "Reversal Remarks", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false

            }

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            //  $("#tblCreditLimitReport_divStatusMsg").text().replace(' 1 to 10 of', '');
            //$("#tblCreditLimitReport_divStatusMsg").text('');

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    })
    $('#tblCreditLimitReport_btnRemoveLast').remove();
    $('#tblCreditLimitReport_btnAppendRow').remove();

}
function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AirlineCode") {

        //var UserSNo = $("#htmlkeysno").val() || userContext.UserSNo;
        var UserSNo = userContext.UserSNo;
        //var UserSNo = 0
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        //    UserSNo = userContext.UserSNo;
        //else
        //    UserSNo = $("#htmlkeysno").val();

        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}
function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_DestinationSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_FlightNo") {
        if ($('#Text_OriginSNo').val() != '')
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
        if ($('#Text_DestinationSNo').val() != '')
            cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());

        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }
}

var Model = [];
function BindWhereCondition() {
    Model = {
        ValidFrom: $('#FromDate').val(),
        ValidTo: $('#ToDate').val(),
        PaymentType: $("#Text_PaymentType_input").val(),
        AgentName:$('#AgentName').val(),
        PaymentStatus: $("#Text_PaymentStatus_input").val()

    }
    return Model;
}
function ExportToExcel() {
    var ValidFrom = $('#FromDate').val();
    var ValidTo = $('#ToDate').val();
    var PaymentType = $("#Text_PaymentType_input").val();
    var PaymentStatus = $("#Text_PaymentStatus_input").val();
    var AgentName = $('#AgentName').val()
    window.location.href = "../PaymentStatusReport/ExportToExcel?ValidFrom=" + ValidFrom + "&ValidTo=" + ValidTo + "&PaymentType=" + PaymentType + "&PaymentStatus=" + PaymentStatus + "&AgentName="  + AgentName ;
}
function AuditLogBindOldValue(id) {
   
}

