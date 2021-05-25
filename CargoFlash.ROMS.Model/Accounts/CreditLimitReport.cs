using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(CreditLimitReport))]
    public class CreditLimitReport
    {
        public int SNo { get; set; }
        public string Reference {get ; set;}
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string Type { get; set; }
        public string CreditLimit { get; set; }
        public string RemainingCreditLimit { get; set; }
        public string DebitAmount { get; set; }
        public string CreditAmount { get; set; }
        public string UPDATEDBY { get; set; }
        public string UPDATEDON { get; set; }
        public string TransactionDate { get; set; }
        public string Transaction_Mode { get; set; }
         public string PenaltyCharges { get; set; }
         public string Cancel { get; set; }
         public string UpdatedBy { get; set; }
         public string BookingStatus { get; set; }
         public string PaymentCurrency { get; set; }
         public string TariffRate { get; set; }
         public string Product { get; set; }
         public string Commodity { get; set; }
         public string ChargeableWeight { get; set; }
         public string ExchangeRate { get; set; }
         public string ExchangeCurrency { get; set; }
         public string Remarks { get; set; }
        public string RequestedBy { get; set; }
        public string RequestedOn { get; set; }
        public string BankName { get; set; }
        public string ReferenceNo { get; set; }
        public string RefNumber { get; set; }

    }

    [KnownType(typeof(CreditLimitBGReport))]
    public class CreditLimitBGReport
    {
        public int SNo { get; set; }
        public string ReferenceNumber { get; set; }
        public string Office { get; set; }
        public string AgentName { get; set; }
        public string ParticipantId { get; set; }
        public string MaxCreditlimit { get; set; }
        public string BalanceCreditlimit { get; set; }
        public string BGReferencenumber { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string Transactiontype { get; set; }
        public string Status { get; set; }
        public string Amount { get; set; }
        public string CurrencyCode { get; set; }
        public string TransactionDate { get; set; }
        public string ApprovedBy { get; set; }
        public string RequestedBy { get; set; }
        public string RequestedOn { get; set; }
        public string ApproveDate { get; set; }
    }
}
