using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    /*
    *****************************************************************************
    Class Name:		Payment      
    Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
    Company:		CargoFlash 
    Author:			Amit Kumar Gupta
    Created On:		23/05/ 2014
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    [KnownType(typeof(Payment))]
    public class Payment
    {
        #region Public Properties
    
        public int SNo { get; set; }

        public bool PaymentType { get; set; }

        public int ContactTypeSNo { get; set; }

        public string Text_ContactTypeSNo { get; set; }

        public decimal Amount { get; set; }

        public string ChequeNo { get; set; }

        public Nullable<DateTime> ChequeDate { get; set; }

        public string BankName { get; set; }

        public string BankCity { get; set; }

        public Nullable<DateTime> DepositDate { get; set; }

        public int ModeOfPayment { get; set; }

        public Nullable<DateTime> PaymentDate { get; set; }

        public int ? BankAccountSNo { get; set; }

        public string Text_BankAccountSNo { get; set; }

        public Int32  RequestBy { get; set; }

        public Nullable<DateTime> RequestOn { get; set; }

        public string RequestedRemarks { get; set; }

        public int VerifiedBy { get; set; }

        public Nullable<DateTime> VerifiedOn { get; set; }

        public string VerifiedRemarks { get; set; }

        public int ApprovedBy { get; set; }

        public Nullable<DateTime> ApprovedOn { get; set; }

        public string ApprovedRemarks { get; set; }

        public bool IsRejected { get; set; }

        public string OtherPaymentMode { get; set; }

        public bool IsReversed { get; set; }

        public int ReversedBy { get; set; }

        public Nullable<DateTime> ReveresedOn { get; set; }

        public string ReversedRemarks { get; set; }

        public string PaymentReferenceNo { get; set; }

        public string BankPaymentRefID { get; set; }

        public string BankGUID { get; set; }

        public Nullable<DateTime> BankPaymentRefDate { get; set; }

        public int CitySNo { get; set; }

        public string Text_CitySNo { get; set; }

        public string RequestedID { get; set; }

        public bool IsCredit { get; set; }

        public string InvoiceNo { get; set; }

        public bool IsFPR { get; set; }

        public string ContactsTypeName { get; set; }

        public string ContactsTypeDis { get; set; }

        public string PaymentMode { get; set; }

        public string CityName { get; set; }

        public string PaymentdateDisplay { get; set; }

        public string DepositDateDisplay { get; set; }

        public string RequestdateDisplay { get; set; }
        public string Requested { get; set; }

        public string Credit { get; set; }

        #endregion
    }
}
