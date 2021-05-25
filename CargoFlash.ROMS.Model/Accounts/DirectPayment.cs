using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(DirectPayment))]
    public class DirectPayment
    {
        public string SNo { get; set; }
        public int AccountSNo { get; set; }
        public int AWBSNo { get; set; } // Add by Umar for Direct Payment On 29-Aug-2018
        public string Amount { get; set; }
        public string Remarks { get; set; }
        public string TotalNtaAmount { get; set; }
        public int UpdateType { get; set; }
        public int TransectionModeSNo { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public string ChequeAccountName { get; set; }
        public string BankAccountNo { get; set; }
        public Nullable<DateTime> ChequeDate { get; set; }
        public string ReferenceNo { get; set; }
        public string ChequeNo { get; set; }
        public int CreatedBy { get; set; }
        public int OfficeSNo { get; set; } // updated by Shahbaz Akhtar on 29-12-16 for office 

        public string Office { get; set; } // updated by Shahbaz Akhtar on 29-12-16 for view office
        public string Agent { get; set; }
        public string UpdateTypeText { get; set; }
        public string Credit { get; set; }
        public string Transaction { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public int AirlineSNo { get; set; }
        public int CitySNo { get; set; }
        public int CurrencySNo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
       
        //================= edit====================
        public string Text_City { get; set; }
        public string Text_Agent { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public string Text_Office { get; set; }
        public int PaymentBy { get; set; }
        public string ExistingCreditLimit { get; set; }
        public string CreditLimit { get; set; }
       
        public string TransactionType { get; set; }
        public string AccountNo { get; set; }
        public string Text_TransectionModeSNo { get; set; }
        public string Text_UpdateType { get; set; }
        public string RefNo { get; set; }
        public int RequestedBy { get; set; } // RequestedBy add by umar on 04-july-2018
        public string Text_AWBSNo { get; set; } //Add by Umar  On 31-Aug-2018
        public string Description { get; set; }
        public string PaymentDate { get; set; }
        public Nullable<DateTime> PaymentDateCal { get; set; }

        // public int PaymentBy { get; set; }
    }
    //updated by Shahbaz Akhtar on 29-12-16 for grid
    [KnownType(typeof(DirectPaymentGridData))]
    public class DirectPaymentGridData
    {
        #region Public Properties
        public string SNo { get; set; }
        public int OfficeSNo { get; set; }
        public string Agent { get; set; }
        public string Amount { get; set; }
        public string Credit { get; set; }
        public string UpdateType { get; set; }
        public string Transaction { get; set; }
        public string Office { get; set; }
        public string RefNo { get; set; }
        // Add By AccountSNo, OfficeSNo Umar
       // public int AccountSNo { get; set; }
      //  public int OfficeSNo { get; set; }
        #endregion
    }
}


