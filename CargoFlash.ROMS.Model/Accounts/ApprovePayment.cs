using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
  
        [KnownType(typeof(ApprovePayment))]
        public class ApprovePayment
        {
            public int SNo { get; set; }
            public int AccountSNo { get; set; }
            public string Amount { get; set; }
            public string Remarks { get; set; }
            public int UpdateType { get; set; }
            //public int TransectionModeSNo { get; set; }
            public string BankName { get; set; }
            public string BranchName { get; set; }
            public string ChequeAccountName { get; set; }
            public string BankAccountNo { get; set; }
            public Nullable<DateTime> ChequeDate { get; set; }
            public Nullable<DateTime> TransectionDate { get; set; }
            public string ReferenceNo { get; set; }
            public string ChequeNo { get; set; }
            public int CreatedBy { get; set; }
            public int OfficeSNo { get; set; }

            public string Office { get; set; }
            public string Agent { get; set; }
            public string UpdateTypeText { get; set; }
            public string CreditLimit { get; set; }
            public string TransactionType { get; set; }
            public string CreatedUser { get; set; }
            public string UpdatedUser { get; set; }
            public string VerifiedBy { get; set; }
            public string Airline { get; set; }
            public string City { get; set; }
            public string ExistingCreditLimit { get; set; }
            public string PaymentDate { get; set; }
            public string TransectionModeSNo { get; set; }
            public string IsVerified { get; set; }
            public string VerifiedRemarks { get; set; }
            public string IsApproved { get; set; }
            public string ApprovedRemarks { get; set; }
            public string AccountNo { get; set; }
            public string BankGaranteeValidFrom { get; set; }
            public string BankGaranteeValidTo { get; set; }
            public string AwbNumber { get; set; } // Add AwbNumber by umar on 31-Aug-2018
            public string RefNo { get; set; }
    }

        [KnownType(typeof(ISApprovePayment))]
        public class ISApprovePayment
        {
            public string SNo { get; set; }
            public int OfficeSNo { get; set; }
            public int IsApproved { get; set; }
            public string ApprovedRemarks { get; set; }
            public int ApprovedBy { get; set; }
            public int UpdateType { get; set; }
            //public int AccountSNo { get; set; }
        }

        [KnownType(typeof(ApprovePaymentGridData))]
        public class ApprovePaymentGridData
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
        #endregion
    }
  
}
