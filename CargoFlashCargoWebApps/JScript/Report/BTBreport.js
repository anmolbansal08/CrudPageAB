
$(document).ready(function () {

   
    cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "Users_Airport", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "BTBReport_AWB", null, "contains");
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "BTBReport_airline", null, "contains");
    //cfi.AutoCompleteV2("BTBU", "UserName", "BTBReport_User", null, "contains");
    cfi.AutoCompleteV2("UserName", "UserName", "BTB_Users", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var firstdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), 1)
    var lastDate = new Date(todaydate.getFullYear(), todaydate.getMonth() + 1, 0)
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

    //setTimeout(function () {
    //    $("#Text_BTBU").removeAttr("disabled");
    //    cfi.AutoCompleteV2("BTBU", "UserName", "BTBReport_User", null, "contains");

    //}, 100);
});
function SearchPaymentStatusReport() {
   
    if ($("#Text_AirlineCode").val() != "" && $("#Text_AirlineCode").val() != null) {
        if (($("#Text_Airport").val() != "" && $("#Text_Airport").val() != null) )
        {
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
                servicePath: "../BTBReport",
                getRecordServiceMethod: "GetBTBReportData",
                deleteServiceMethod: "",
                caption: "BTB Report",
                initRows: 1,
                isGetRecord: true,
                columns: [
                    { name: "SNo", type: "hidden" },
                    {
                        name: "UserID", display: "User ID", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false
                    },
                    {
                        name: "UserName", display: "User Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                    },
                    {
                        name: "AWBNo", display: "AWB No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                    },
                    {
                        name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                    },
                    {
                        name: "GrossWeight", display: "Gross Weight", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
                    },
                    {
                        name: "VolumeWeight", display: "Volume Weight", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
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
    }
    //else {

    //    ShowMessage('warning', 'Information!', "Airline and Airport  are mandatory fields.");
    //}

   

}
//function ExtraParameters(textId) {
//    var param = [];
//    if (textId == "Text_AirlineCode") {

//        //var UserSNo = $("#htmlkeysno").val() || userContext.UserSNo;
//        var UserSNo = userContext.UserSNo;
//        //var UserSNo = 0
//        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
//        //    UserSNo = userContext.UserSNo;
//        //else
//        //    UserSNo = $("#htmlkeysno").val();

//        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
//        return param;
//    }

//}

function ExtraCondition(textId) {
    
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_UserName") {
        try {
            cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#AirlineCode").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
        if (textId == "Text_UserName") {
        try {
            cfi.setFilter(filterAirline, "AirportSNo", "eq", $("#Airport").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
{
}
}
    if (textId == "Text_AWBNo") {
        try {
            cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#AirlineCode").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
}
        catch (exp)
{
}
}

    //if (textId == "Text_AirlineCode") {
    //    try {

    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //        return OriginCityAutoCompleteFilter2;
    //    }
    //    catch (exp)
    //    { }
    //}
    //if (textId == "Text_Airport") {
    //    cfi.setFilter(filter, "", "eq", $('#AirlineCode').val());
    //    return cfi.autoCompleteFilter(filter);
    //}
    //else if (textId == "Text_FlightNo") {
    //    cfi.setFilter(filter, "AirlineCode", "eq", $('#AirlineCode').val());
    //    return cfi.autoCompleteFilter(filter);
    //}
    //var filterAirline = cfi.getFilter("AND");
    //if (textId == "Text_AirlineCode") {
    //    cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //    return OriginCityAutoCompleteFilter2;
    //}

    //else if (textId == "Text_DestinationSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    //}

    //else if (textId == "Text_OriginSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    //}
    //else if (textId == "Text_FlightNo") {
    //    if ($('#Text_OriginSNo').val() != '')
    //        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
    //    if ($('#Text_DestinationSNo').val() != '')
    //        cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

    //    cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());

    //    var RT_Filter = cfi.autoCompleteFilter(filterAirline);
    //    return RT_Filter;
    //}
}
function BindWhereCondition() {
    return {
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        AWBNo: $("#AWBNo").val() || '',
        Airport: $("#Airport").val() || '',
        User: $("#UserName").val() || '',
        AirlineSNo: $('#AirlineCode').val(),


    };
}
function ExportToExcel() {
    var FromDate = $('#FromDate').val();
    var ValidTo = $('#ToDate').val();
    var AWBNo = $("#AWBNo").val() ;
    var Airport = $("#Airport").val() || '';
    var User = $("#UserName").val() || ''
    var AirlineSNo = $('#AirlineCode').val() || '';
    window.location.href = "../BTBReport/ExportToExcel?ValidFrom=" + FromDate + "&ValidTo=" + ValidTo + "&Airport=" + Airport + "&AirlineSNo=" + AirlineSNo + "&User=" + User + "&AWBNo=" + AWBNo;
}
function AuditLogBindOldValue(id) {

}

