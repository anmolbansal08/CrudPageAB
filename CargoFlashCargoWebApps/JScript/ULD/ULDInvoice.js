var PageType;
var flage = true;

$(document).ready(function ()
{
    PageType = getQueryStringValue("FormAction").toUpperCase();
    $("#ULDInvoiceContainer").load("HtmlFiles/ULD/ULDInvoice.html", onLoad);
});

function ValidateNopa(e)
{
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
}


function SaveULDInvoice() {
    var ULDInvoice = new Array();
    $("input:checked[id^='tblULDGridDetails_Chkselect']").each(function (index, item) {
        var NPPANo = $("#tblULDGridDetails_NPPANo_" + (index + 1)).val();
        var SalesOrderNo = $("#tblULDGridDetails_SalesOrderNo_" + (index + 1)).val();
        var ULDRepairSNo = $("#tblULDGridDetails_ULDRepairSNo_" + (index + 1)).val();
        var AgreementNumber = $("#tblULDGridDetails_AgreementNumber_" + (index + 1)).val();

        ULDInvoice.push({
            NPPANo: $("#Text_NPPANo").val(),
            SalesOrderNo: SalesOrderNo,
            ParticipientSNo: $('#VendorSNo').val(),
            ULDRepairSNo: ULDRepairSNo,
            AgreementNumber: $("#Text_AgreementNo").text(),
        });
    });

    $.ajax({
        url: "Services/ULD/ULDInvoiceService.svc/SaveULDInvoice", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ULDInvoice: ULDInvoice }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result == 0) {
                ShowMessage('success', 'Success', "Cost Approval Invoice generated successfully", "bottom-right");

                setTimeout(function () {
                    navigateUrl('Default.cshtml?Module=ULD&Apps=ULDInvoice&FormAction=INDEXVIEW');
                }, 1500);
            }
        }
    });


}
function onLoad() {
    $("input[name='operation']").unbind("click").click(function () {
        debugger
        cfi.ValidateSubmitSection("tbl");
        dirtyForm.isDirty = false;//to track the changes
        if (!cfi.IsValidSubmitSection()) return false;

        var countcheck = 0;
        if (PageType == "NEW") {


            $('#tblULDGridDetails tbody tr ').each(function () {
                var MyRows = $('table#tblULDGridDetails').find('tbody').find('tr');
                for (var i = 0; i < MyRows.length; i++) {

                    var MyCheckvalue = $(MyRows[i]).find('input:checkbox[id^="tblULDGridDetails_Chkselect_"]').is(":checked") ? 1 : 0;


                    if (MyCheckvalue == 1) {
                        countcheck = parseInt(countcheck) + 1;
                    }
                }
            });

            if (countcheck == 0) {
                ShowMessage('warning', 'Information!', "Select Record!", "bottom-right");
                return false;
            }

            SaveULDInvoice();
            return false;
        }


    });

    function OnSelectAirline(e) {
        debugger
        var Data = this.dataItem(e.item.index());
        //var QueryString = "rateAirlineMasterSNo=" + Data.Key + "&originCitySNo=" + ($("#OriginCitySNo").val() == "" ? "0" : $("#OriginCitySNo").val()) + "&originAirportSNo=" + ($("#OriginAirportSNo").val() == "" ? "0" : $("#OriginAirportSNo").val()) + "";
        //createRateAirlineTrans(QueryString);



        var ULDGridDetails = "ULDGridDetails";
        var GetRecord = "ULDInvoiceGridAppendGrid";
        var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
        $('#tbl' + ULDGridDetails).appendGrid({
            tableID: 'tbl' + ULDGridDetails,
            contentEditable: true,
            masterTableSNo: Data.Key,
            currentPage: 1, itemsPerPage: 10, whereCondition: null,
            servicePath: 'Services/ULD/ULDInvoiceService.svc',
            getRecordServiceMethod: GetRecord,
            createUpdateServiceMethod: '',
            caption: "Available ULD List",
            initRows: 1,
            isGetRecord: true,
            hideButtons: { updateAll: true, insert: true, },
            columns: [
                             { name: 'ULDRepairSNo', type: 'hidden' },
                             { name: 'NPPANo', type: 'hidden' },
                             { name: 'AgreementNumber', type: 'hidden' },
                             { name: 'SalesOrderNo', type: 'hidden' },
                             { name: 'InvoiceDate', type: 'hidden' },
                             { name: 'ParticipientSNo', type: 'hidden' },

                        { name: 'Chkselect', display: 'Select', type: 'Checkbox' },
                         { name: 'RONO', display: 'RO No', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Equipment', display: 'Equipment', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Registration', display: 'Registration', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Work_Inspection', display: 'Work Inspection', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Meterial', display: 'Material(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'ManHours', display: 'Man Hours(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Total', display: 'Total(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },

            ],
            isPaging: false,
            hideButtons: {
                remove: true,
                removeLast: true,
                insert: true,
                append: true,
                updateAll: true


            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {

                setTimeout(function () {
                    ToatlCostApproval()
                }, 500)
            }
        });
        // Remove requied for exist data
        //$("tr[id^=tblProcessDependencyTrans_Row]").each(function () {

        //    if ($(this).find("input[id^='tblProcessDependencyTrans_SubProcessName']").data("kendoAutoComplete").key() != "")
        //        $(this).find("input[id^='tblProcessDependencyTrans_SubProcessName']").removeAttr("required");

        //    if ($(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType']").data("kendoAutoComplete").key() != "")
        //        $(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType']").removeAttr("required");

        //});
        //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        //    debugger;

        //    $("tr[id^=tblProcessDependencyTrans_Row_]").each(function () {

        //        if ($(this).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").val() == "") {
        //            $(this).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").data("kendoAutoComplete").enable(false);
        //        }

        //        if ($(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType_']").val() == "") {
        //            $(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType_']").data("kendoAutoComplete").enable(false);

        //        }
        //        $(".k-i-arrow-s").attr("disabled", "disabled");
        //    });
        //}


        GetAgreementNumber(Data.Key)

    }

    if (PageType == "READ" || PageType == "EDIT") {

        $("#__SpanHeader__").hide();
        $("#trsearch").hide();
        $(".btn-success").hide();
        $("#btnPrint").show();
        var metrialval = 0.00;
        var ManHours = 0.00;
        var Total = 0.00;

        var dbTableName = "ULDGridDetails";

        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: false,
            tableColumns: 'SNo',
            masterTableSNo: getQueryStringValue("RecID").toUpperCase(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: 'Services/ULD/ULDInvoiceService.svc',
            getRecordServiceMethod: 'ULDInvoiceGridAppendGridForInvoice',
            createUpdateServiceMethod: '',
            deleteServiceMethod: '',
            caption: 'ULD Invoice List',
            initRows: 1,
            isGetRecord: true,
            columns: [
                  { name: 'RONO', display: 'RO No', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                { name: 'Equipment', display: 'Equipment', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Registration', display: 'Registration', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Work_Inspection', display: 'Work Inspection', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Meterial', display: 'Material(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'ManHours', display: 'Man Hours(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
                        { name: 'Total', display: 'Total(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
            ],

            isPaging: false,
            hideButtons: { updateAll: true, insert: true },


            afterRowAppended: function (tbWhole, parentIndex, addedRows) {


                setTimeout(function () {
                    ToatlCostApproval()
                }, 500)

                var currentIndex = addedRows.length;

                //$("#tblULDGridDetails").find("input[id^='tblULDGridDetails_Row']").each(function (i, el) {
                //    var ind = $(this).attr('id').split('_')[2];
                //    //$(el).css('background', 'bisque');
                //    //$(el).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").css('background', 'bisque');
                //    //$(el).closest("table").find("select[id^='tblAddShipment_FoundAWB']").css('background', 'bisque');
                //    //$(el).closest("table").find("select[id^='tblAddShipment_PartSplitTotal']").css('background', 'bisque');

                //    if (ind > 1) {

                //    }

                //})


                //$('#tblULDGridDetails tbody tr ').each(function () {
                //    var MyRows = $('table#tblULDGridDetails').find('tbody').find('tr');
                //    for (var i = 0; i < MyRows.length; i++) {

                //        var Merrilavalue = $(MyRows[i]).find('td:eq(4)').find("label[id^='tblULDGridDetails_Meterial_']").text();
                //        metrialval = parseFloat(metrialval) + parseFloat(Merrilavalue)





                //    }


                //});
                //$("#tblULDGridDetails").append("<tr id='tblULDGridDetails_total'><td class='ui-widget-content first' colspan='4'>TOTAL</td><td class='ui-widget-content' colspan='1'><label id='tblULDGridDetails_Meterial_total' style='width: 55px;'>" + metrialval.toString() + "</label></td><td class='ui-widget-content' colspan='1'><label id='tblULDGridDetails_ManHours_3' style='width: 55px;'>105</label></td><td class='ui-widget-content' colspan='1'><label id='tblULDGridDetails_Total_3' style='width: 55px;'>210</label></td></tr>");

            },

        });
        $("tr[id^='tblULDGridDetails_Row']").each(function (row, tr) {
            //var MyRows = $('table#tblULDGridDetails').find('tbody').find('tr');
            //for (var i = 0; i < MyRows.length; i++) {

            var Merrilavalue = $(tr).find("label[id^='tblULDGridDetails_Meterial_']").text();
            metrialval = (parseFloat(metrialval) + parseFloat(Merrilavalue)).toFixed(3)

            var ManHoursvalue = $(tr).find("label[id^='tblULDGridDetails_ManHours_']").text();
            ManHours = parseFloat(ManHours) + parseFloat(ManHoursvalue)

            var Totalvalue = $(tr).find("label[id^='tblULDGridDetails_Total_']").text();
            Total = parseFloat(Total) + parseFloat(Totalvalue)

        });
        $("#tblULDGridDetails").append("<tr id='tblULDGridDetails_total'><td class='ui-widget-content first' colspan='5'>TOTAL</td><td class='ui-widget-content' colspan='1'><label id='tblULDGridDetails_Meterial_total' style='width: 55px;'>" + metrialval.toString() + "</label></td><td class='ui-widget-content' colspan='1'><label id='tblULDGridDetails_ManHours_value' style='width: 55px;'>" + ManHours.toString() + "</label></td><td rowspan='2' class='ui-widget-content' colspan='1'><label id='tblULDGridDetails_Total_value' style='width: 55px;'>" + (parseFloat(Total.toString()) + parseFloat(ManHours.toString())).toFixed(3) + "</label></td></tr>");


        $("#tblULDGridDetails").append("<tr id='tblULDGridDetails_grandtotal'><td class='ui-widget-content first' colspan='6'>GRAND TOTAL</td></tr>");
        //$("#__SpanHeader__").hide();
        //$("#trsearch").hide();
        //$(".btn-success").hide();
        //$("#btnPrint").show();




        //var ULDGridDetailsread = "ULDGridDetails";
        //var GetRecordread = "ULDInvoiceGridAppendGridForInvoice";
        //var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
        //$('#tbl' + ULDGridDetailsread).appendGrid({
        //    tableID: 'tbl' + ULDGridDetailsread,
        //    contentEditable: true,
        //    masterTableSNo: 14,// getQueryStringValue("RecID").toUpperCase(),
        //    currentPage: 1, itemsPerPage: 5, whereCondition: null,
        //    servicePath: 'Services/ULD/ULDInvoiceService.svc',
        //    getRecordServiceMethod: GetRecordread,
        //    createUpdateServiceMethod: '',
        //    caption: "ULD Invoice List",
        //    initRows: 1,
        //    isGetRecord: true,
        //    hideButtons: { updateAll: true, insert: true, },
        //    columns: [
        //                     // { name: 'ULDRepairSNo', type: 'hidden' },
        //                     //{ name: 'NPPANo', type: 'hidden' },
        //                     //{ name: 'SalesOrderNo', type: 'hidden' },
        //                     //  { name: 'InvoiceDate', type: 'hidden' },
        //                     //   { name: 'ParticipientSNo', type: 'hidden' },

        //                //{ name: 'Chkselect', display: 'Select', type: 'Checkbox' },
        //                { name: 'Equipment', display: 'Equipment', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
        //                { name: 'Registration', display: 'Registration', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
        //                { name: 'Work_Inspection', display: 'Work Inspection', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
        //                { name: 'Meterial', display: 'Meterial(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
        //                { name: 'ManHours', display: 'ManHours(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
        //                { name: 'Total', display: 'Total(IDR)', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },

        //    ],
        //    //isPaging: false,
        //    hideButtons: {
        //        remove: true,
        //        removeLast: true,
        //        insert: true,
        //        append: true,
        //        updateAll: true

        //    }
        //});







    }
    else if (PageType == "NEW") {
        //cfi.AutoComplete("VendorSNo", "sno,Name", "vGetVendorList", "sno", "Name", ["Name"], null, "contains");
        cfi.AutoCompleteV2("VendorSNo", "SNo,Name", "ULDSTACK_VendorSNo", null, "contains", null, null, null, null, OnSelectAirline);
        $("#__SpanHeader__").hide();
        $("#btnPrint").hide();

    }




}

function ToatlCostApproval() {

    TotalCost = 0;

    $("tr[id^='tblULDGridDetails_Row']").each(function (row, tr) {
        var MAt = parseFloat($(tr).find("label[id^='tblULDGridDetails_Meterial_']").text() == "" ? 0 : $(tr).find("label[id^='tblULDGridDetails_Meterial_']").text());
        var ManHours = parseFloat($(tr).find("label[id^='tblULDGridDetails_ManHours_']").text() == "" ? 0 : $(tr).find("label[id^='tblULDGridDetails_ManHours_']").text());
        $(tr).find("label[id^='tblULDGridDetails_Total_']").text((parseFloat(MAt) + parseFloat(ManHours)).toFixed(3))
    });


}


function printDiv()
{



    var win = window.open('HtmlFiles/ULD/ULDInvoicePrint.html?RecID=' + getQueryStringValue("RecID").toUpperCase() + "&LogoURL=" + userContext.SysSetting.LogoURL, '_blank');


}

function GetAgreementNumber(recordID) {
    $("#Text_AgreementNo").text("")

    $.ajax({
        url: "Services/ULD/ULDInvoiceService.svc/InvoiceGetAgreementNumber?recordID=" + recordID, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#Text_AgreementNo").text(jQuery.parseJSON(result).Table0[0].AgreementNumber)
        }
    });
}

