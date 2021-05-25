using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(CreditDebitNoteApprovalGrid))]
    public class CreditDebitNoteApprovalGrid
    {
        public int SNo { get; set; }
        public string AirlineName { get; set; }
        public string IssuedName { get; set; }
        public string Amount { get; set; }
        public string TransactionNo { get; set; }
        public string Status { get; set; }
        public string TransactionType { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime CreatedOn { get; set; }
        public string IssuedTo { get; set; }
        public string TotalCharges { get; set; }
        public string CreditNoteType { get; set; }
        public string ApprovedAmount { get; set; }
    }

    [KnownType(typeof(CreditDebitNoteApproval))]
    public class CreditDebitNoteApproval
    {
        public int CNDNSNo { get; set; }
        public List<ApproveCNDNTrans> LstCNDNChargesTrans { get; set; }
        public int CreatedBy { get; set; }

    }
     

    [KnownType(typeof(ApproveCNDNTrans))]
    public class ApproveCNDNTrans
    {
        public int CNDN_Charge_SNo { get; set; }
        public decimal TariffAmount { get; set; }
        public string ApprovedRemarks { get; set; }
        public string Action { get; set; }
    }
}
