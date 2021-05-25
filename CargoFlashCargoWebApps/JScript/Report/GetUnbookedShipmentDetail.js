$(document).ready(function () {

    

    $("#Fromdate").kendoDatePicker({

        format: "dd-MMM-yyyy"
      
    });
    $("#Todate").kendoDatePicker({

        format: "dd-MMM-yyyy"
       
    });


    //cfi.DateType("Fromdate");
    //cfi.DateType("Todate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    $(document).on("change", "#Fromdate", function () {
        $("#Todate").data("kendoDatePicker").value("");
        var startDate = new Date($('#Fromdate').val());
        $("#Todate").data("kendoDatePicker").min(startDate);
    });
   
});

function UnBookedShipmentSearch() {

var dbtableName = "CreditLimitReport";
  
if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

    ShowMessage('warning', 'Warning - Unbooked Shipment Report ', "From Date can not be greater than To Date !");
    //alert('From Date can not be greater than To Date');
    return;
}

    $("#tblCreditLimitReport").appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10, model: BindWhereCondition(), sort: "",
        contentEditable: true,
        servicePath: "../UnbookedReport",
        getRecordServiceMethod: "GetUnbookedDetail",
        deleteServiceMethod: "",
       caption:"Unbooked Shipment Detail",
        initRows: 1,
        isGetRecord: true,
        columns: [
           // { name: "SNo", type: "hidden" },
            {
                name: "AWbNo", display: "Awb Number", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "BookingType", display: "Booking Type", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "GSAName", display: "GSA Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Origin", display: "Origin", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Destination", display: "Destination", type: "label", ctrlCss: { width: '100px',height:'100ox' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Grossweight", display: "Gross weight", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Bookeddate", display: "Bookeddate", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
            {
                name: "Remarks", display: "Remarks", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false
            },
             {
                 name: "TotalPieces", type: "hidden", id: 'TotalPieces'
             },
              {
                  name: "Totalweight", type: "hidden", id: 'Totalweight'
              },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex)
        {

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) { 

            //$("#tblCreditLimitReport tr td label[id*='tblCreditLimitReport_Pieces_']").each(function () {
            //    $("#spnTPS").text(parseFloat($("#spnTPS").text() == "" ? 0 : $("#spnTPS").text()) + parseFloat($(this).text()))
            //})
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    })
    $('#tblCreditLimitReport_btnRemoveLast').remove();
    $('#tblCreditLimitReport_btnAppendRow').remove();

    //$('#tblCreditLimitReport thead tr td:first').append("<div style='float: left; padding-right: 5px;'><span></span></div><div style='float: left; padding-right: 5px;'><span>Total Pieces :</span><span id='spnTPS' style='color:blue;'></span></div> <div style='float: left; padding-right: 5px;'><span>Total Weight:</span><span id='spnTW' style='color:blue;'></span></div>");
    $('#tblCreditLimitReport thead tr td:first').append("<span style='font-size: 12px;font-weight: bold;'>  Total Pieces : </span><span id='spnTPS' style='color:blue;font-size: 12px;'></span> <span style='font-size: 12px;font-weight: bold;'>  Total Weight : </span><span id='spnTW' style='color:blue;font-size: 12px;'></span>");

    $("#spnTPS").text("");
    $("#spnTW").text("");
    //$("#tblCreditLimitReport tr td label[id*='tblCreditLimitReport_Pieces_']").each(function () {
    //    $("#spnTPS").text(parseFloat($("#spnTPS").text() == "" ? 0 : $("#spnTPS").text()) + parseFloat($(this).text()))
    //})
    //$("#tblCreditLimitReport tr td label[id*='tblCreditLimitReport_Grossweight_']").each(function () {
    //    $("#spnTW").text(parseFloat($("#spnTW").text() == "" ? 0 : $("#spnTW").text()) + parseFloat($(this).text()))
    if ($('#tblCreditLimitReport_Row_1').length >= 1) {
        $("#spnTPS").text($('#tblCreditLimitReport_TotalPieces_1').val());
        $("#spnTW").text($('#tblCreditLimitReport_Totalweight_1').val());
    }
    //})

    $("#spnTW").text(parseFloat($("#spnTW").text()).toFixed(2))
}

function ExportToExcel() {

    var Fromdate = $("#Fromdate").val() || 0;
    var Todate = $("#Todate").val() || 0;
  
    window.onbeforeunload = null;
   
    window.location.href = "../UnbookedReport/ExportToExcelFile?Fromdate=" + Fromdate + "&Todate=" + Todate;

}
function AuditLogBindOldValue(id) {

}

function BindWhereCondition() {
    return {
        Fromdate: $('#Fromdate').val() || 0,
        Todate: $('#Todate').val() || 0
        //PaymentType: $("#Text_PaymentType_input").val(),
        //PaymentStatus: $("#Text_PaymentStatus_input").val()

    };
}


