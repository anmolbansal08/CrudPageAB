$(document).ready(function () {
    $('.form2buttonrow').remove();
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if (pageType == 'READ') {
        $.ajax({
            url: 'HtmlFiles/CRA/CRAInvoiceListRead.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                BindInvoiceSummary();
            }
        });
       
    }
        if (pageType == 'EDIT') {
            $.ajax({
                url: 'HtmlFiles/CRA/CRAInvoiceListEdit.html',
                success: function (result) {
                    $('#aspnetForm').on('submit', function (e) {
                        e.preventDefault();
                    });
                    $('#aspnetForm').append(result);
                    BindInvoiceSummary();
                }
            });
        }

       
});
function BindInvoiceSummary()
{
    $("#divInvoiceAWBDetails").remove();
    var SNo = getQueryStringValue("RecID").toUpperCase();
   
    if(SNo != "")
    {
        $.ajax({
            url: "Services/CRA/CRAInvoiceListService.svc/GetRecordListInvoice", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SNo: SNo }),
            success: function (result) {
                var getdata = JSON.parse(result)
                if (getdata != undefined) {
                    // basic details
                    $("#RecordInfo").text(getdata.Table0[0].Invoice_Number);
                        $("#BatchID").text(getdata.Table0[0].fk_Batch_ID);  
                        $("#PartyID").text(getdata.Table0[0].FK_Invoice_Party_ID);
                        $("#Partytype").text(getdata.Table0[0].Invoice_Party_type);
                        $("#Status").text(getdata.Table0[0].Status);
                        $("#CCAs").text(getdata.Table0[0].No_Of_CCAs);
                        $("#DCMs").text(getdata.Table0[0].No_Of_DCM);
                        $("#AWBs").text(getdata.Table0[0].N0_Of_AWBs);
                    // invoice Details
                        $("#InvoiceNo").val(getdata.Table0[0].Invoice_Number); //InvoiceNo, InvoiceCurrency,FromDate,UntilDate,PartyName,Party Address1 :	
                        $("#InvoiceCurrency").text(getdata.Table0[0].Invoice_Currency);
                        $("#FromDate").text(getdata.Table0[0].Invoice_Period_From_Date);
                        $("#UntilDate").text(getdata.Table0[0].Invoice_Period_Until_Date);
                        $("#PartyName").text(getdata.Table0[0].Invoice_Party_Name);
                        $("#PartyAddress1").text(getdata.Table0[0].Invoice_Party_Address1);
                        $("#PartyAddress2").text(getdata.Table0[0].Invoice_Party_Address2);
                        $("#PartyVATReg").text(getdata.Table0[0].Invoice_Party_VAT_Registration);
                        $("#PartyIATACode").text(getdata.Table0[0].Invoice_Party_IATA_Code);
                        $("#InvoiceType").text(getdata.Table0[0].Invoice_Type);
                        $("#GenDate").text(getdata.Table0[0].Invoice_Generated_Date);
                        $("#GenByuserid").text(getdata.Table0[0].Invoice_Generated_By_userid);
                        $("#Verifieddate").text(getdata.Table0[0].Invoice_Verified_on_date);
                        $("#VerifiedUserid").text(getdata.Table0[0].Invoice_Verified_by_Userid);
                        $("#PrintedDate").text(getdata.Table0[0].Invoice_Printed_on_Date);
                        $("#PrintedUserid").text(getdata.Table0[0].Invoice_Printed_by_Userid);
                        $("#isinvoicelocked").text(getdata.Table0[0].is_invoice_locked);
                    // total charges
                        $("#MAINItemsBilled").text(getdata.Table0[0].Total_MAIN_Items_Billed);
                        $("#TotCorrBilled").text(getdata.Table0[0].Total_Corrections_Billed);
                        $("#DRCRBilled").text(getdata.Table0[0].Total_DEBIT_CREDIT_Billed);
                        $("#PPWgtChrg").text(getdata.Table0[0].Total_PP_Weight_Charge);
                        $("#PPValChrg").text(getdata.Table0[0].Total_PP_Valuation_Charge);
                        $("#PPWgtValChrg").text(getdata.Table0[0].Total_PP_Weight_Plus_Valuation_Charge);
                        $("#CCWgtChrg").text(getdata.Table0[0].Total_CC_Weight_Charge);
                        $("#CCValChrg").text(getdata.Table0[0].Total_CC_Valuation_Charge);
                        $("#CCWgtValChrg").text(getdata.Table0[0].Total_CC_Weight_Plus_Valuation_Charge);
                        $("#CommSale").text(getdata.Table0[0].Total_Commissionable_Sale);
                        $("#Comm").text(getdata.Table0[0].Total_Commission);
                        $("#Amnt").text(getdata.Table0[0].Total_Amount);
                        $("#Inc").text(getdata.Table0[0].Total_Incentive);
                        $("#PPOCDueCarrier").text(getdata.Table0[0].Total_PP_OC_Due_Carrier);
                        $("#PPOCDueAgent").text(getdata.Table0[0].Total_PP_OC_Due_Agent);
                        $("#CCOCDueCarrier").text(getdata.Table0[0].Total_CC_OC_Due_Carrier);
                        $("#CCOCDueAgent").text(getdata.Table0[0].Total_CC_OC_Due_Agent);
                        $("#TotRecords").text(getdata.Table0[0].Total_Records);
                        $("#HashTot").text(getdata.Table0[0].Hash_Total);
                        $("#TotMiscChrgs").text(getdata.Table0[0].Total_Miscellaneous_Charges);
                    // invoice awb details
                        $("#TSerialNumber").text(getdata.Table1[0].AWB_Serial_Number);
                        $("#TWCPP").text(getdata.Table1[0].Weight_Charges_PP);
                        $("#TWCCC").text(getdata.Table1[0].Weight_Charges_CC);
                        $("#TOCDAPP").text(getdata.Table1[0].Other_Charges_Due_Agent_PP);
                        $("#TOCDCPP").text(getdata.Table1[0].Other_Charges_Due_Carrier_PP);
                        $("#TCommission").text(getdata.Table1[0].Commission);
                        $("#TIncentive").text(getdata.Table1[0].Incentive);
                        $("#TPayable").text(getdata.Table1[0].Payable);
                        $("#TOCDACC").text(getdata.Table1[0].Other_Charges_Due_Agent_CC);
                        $("#TOCDCCC").text(getdata.Table1[0].Other_Charges_Due_Carrier_CC);
                        $("#TCurr").text(getdata.Table1[0].AWB_Currency);
                        $("#TGrossWeight").text(getdata.Table1[0].AWB_Gross_Weight);
                        $("#TTotalPP").text(getdata.Table1[0].AWB_Total_PP);
                        $("#TTotalCC").text(getdata.Table1[0].AWB_Total_CC);
                        $("#TValuationChargePP").text(getdata.Table1[0].AWB_Valuation_Charge_PP);
                        $("#TValuationChargeCC").text(getdata.Table1[0].AWB_Valuation_Charge_CC);
                        $("#TAWBWTVALChargePP").text(getdata.Table1[0].AWB_WT_VAL_Charge_PP);
                        $("#TAWBWTVALChargeCC").text(getdata.Table1[0].AWB_WT_VAL_Charge_CC);
                        $("#TNetTotal").text(getdata.Table1[0].Net_Total);
                        $("#tbl").after("<div id='divInvoiceAWBDetails' style=' overflow-x: scroll;'><span id='spnInvoiceAWBDetails'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + getQueryStringValue("FormAction").toUpperCase() + "'/><input id='hdnInvoiceAWBDetailsSNo' name='hdnInvoiceAWBDetailsSNo' type='hidden' value='" + getQueryStringValue("RecID").toUpperCase() + "'/><table id='tblInvoiceAWBDetails' Style='margin-top: 20px;'></table></span></div>")
                        InvoiceAWBDetails();
                    }
                    }
            });       
   }   
    

}

$(document).on('click', '#liCharges', function () {
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(1);
});
//onclick = "navigateUrl('Default.cshtml?Module=Master&amp;Apps=Account&amp;FormAction=Edit&amp;RecID=5217');"
$(document).on('click', '#btnEdit', function () {
    navigateUrl('Default.cshtml?Module=CRA&amp;Apps=CRAInvoiceList&amp;FormAction=Edit&amp;RecID=5217')
   // window.navigate('Default.cshtml?Module=CRA&amp;Apps=CRAInvoiceList&amp;FormAction=Edit&amp;RecID=' + getQueryStringValue("RecID").toUpperCase());
    alert('sdfsd');
  //  window.navigate
});
var wCondition = "";
function InvoiceAWBDetails()
{
    var dbtableName = "InvoiceAWBDetails";
    wCondition = BindWhereCondition();
    $("#tblInvoiceAWBDetails").appendGrid({

        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10, whereCondition: wCondition, sort: "",
        contentEditable: false,
        servicePath: "Services/CRA/CRAInvoiceListService.svc",
        getRecordServiceMethod: "GetInvoiceAWBDetailsRecord",
        deleteServiceMethod: "",
        caption: "Invoice AWB Details",
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: "AWB_Serial_Number", display: "Serial Number", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
            { name: "Weight_Charges_PP", display: "WC PP", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Weight_Charges_CC", display: "WC CC", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Other_Charges_Due_Agent_PP", display: "OC DA PP", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Other_Charges_Due_Carrier_PP", display: "OC DC PP", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Commission", display: "Commission", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Incentive", display: "Incentive", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Payable", display: "Payable", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Other_Charges_Due_Agent_CC", display: "OC DA CC", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
             { name: "Other_Charges_Due_Carrier_CC", display: "OC DC CC", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_Currency", display: "Curr.", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_Gross_Weight", display: "Gross Weight", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },

              { name: "AWB_Total_PP", display: "Total PP", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_Total_CC", display: "Total CC", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_Valuation_Charge_PP", display: "Valuation Charge PP", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_Valuation_Charge_CC", display: "Valuation Charge CC", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_WT_VAL_Charge_PP", display: "AWB WT VAL Charge PP", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "AWB_WT_VAL_Charge_CC", display: "AWB WT VAL Charge CC", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            { name: "Net_Total", display: "Net Total", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
          
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

function BindWhereCondition() {
    var WhereCondition;
    WhereCondition = " FK_Invoice_Summary =" + getQueryStringValue("RecID").toUpperCase();
    return WhereCondition;
}