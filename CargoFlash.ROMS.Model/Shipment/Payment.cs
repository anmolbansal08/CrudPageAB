using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(Payment))]
    public class Payment
    {
        public int SNo { get; set; }
        public string AccountNo { get; set; }
        public string InvoiceNo { get; set; }
        public string AWBNo { get; set; }
        public int AWBSNo { get; set; }
        public string TotalReceivable { get; set; }
        public string BalanceReceivable { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string AccountName { get; set; }
        public string AccountAddress { get; set; }
        public string AccountCity { get; set; }
        public decimal PaymentAmmount { get; set; }
        public int PaymentMode { get; set; }
        public string Text_PaymentMode { get; set; }
        public string PaymentReference { get; set; }
        public Nullable<DateTime> PaymentDate { get; set; }
        public string PaymentReceivable { get; set; }
        public string CreatedBy { get; set; }
        public string TxtPaymentMode { get; set; }
        public string DONo { get; set; }
        public string DOSNo { get; set; }
        //added by Pankaj Khanna
        public int AccountSNo { get; set; }
        public int AirlineSNo { get; set; }
        public string NetPayableAmount { get; set; }
        public string AirlineName { get; set; }
        public string ShipmentType { get; set; }
        public string InvoiceType { get; set; }
        public string Text_CreditNote { get; set; }
        public decimal CreditNoteAmount { get; set; }
        public string ChequeNo { get; set; }
        public string ChequeAccountName { get; set; }
        public decimal ChequeAmmount { get; set; }
        public Nullable<DateTime> ChequeDate { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public string SessionCitySNo { get; set; }
        public string ProcessName { get; set; }
        public Nullable<decimal> PaymentReceived { get; set; }


        public string HAWBNO { get; set; }
        public int DB_btn_Hide { get; set; }
        public int I_btn_Hide { get; set; }

        //added by jitendra kumar
        public string CardNumber { get; set; }
        public string CardType { get; set; }
        //added by SUSHANT
        public string VirtualAccountNo { get; set; }
        public string VirtualAccountNo1 { get; set; }
        //added by Devendra
        public string DBNo { get; set; }
        public string OfficeName { get; set; }
        public Int32? OfficeSno { get; set; }
        //
    }

    [KnownType(typeof(PaymentReceipt))]
    public class PaymentReceipt
    {
        public int SNo { get; set; }
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public string AirlineName { get; set; }
        public string ShipmentType { get; set; }
        public string InvoiceNo { get; set; }
        public string ReceiptNo { get; set; }
        public string AWBNo { get; set; }
        public string TotalReceivable { get; set; }
        public string PaidAmount { get; set; }
        public string PaymentReceivable { get; set; }
        public Nullable<DateTime> ReceiptDate { get; set; }
        public int InvoiceSNo { get; set; }
        public int InvoiceType { get; set; }
        public string DONo { get; set; }
        public string DOSNo { get; set; }

        public string HAWBNO { get; set; }
        public int DB_btn_Hide { get; set; }
        public int I_btn_Hide { get; set; }
        //added by Devendra
        public string DBNo { get; set; }
    }
    [KnownType(typeof(GetInvoiceSearch))]
    public class GetInvoiceSearch
    {

        public string searchinvoiceno { get; set; }
        public string searchAWBNo { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }

        public string PaymentOption { get; set; }

    }
    [KnownType(typeof(GetGridDataReceipt_Search))]
    public class GetGridDataReceipt_Search
    {

        public string searchinvoiceno { get; set; }
        public string searchAWBNo { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }

        public string PaymentOption { get; set; }

    }
    [KnownType(typeof(PaymentInvoiceSearch))]
    public class PaymentInvoiceSearch
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string searchinvoiceno { get; set; }
        public string searchAWBNo { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }

        public string PaymentOption { get; set; }
    }
    [KnownType(typeof(PaymentInvoiceSearchReceipt))]
    public class PaymentInvoiceSearchReceipt
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string searchinvoiceno { get; set; }
        public string searchAWBNo { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }

        public string PaymentOption { get; set; }
    }
}