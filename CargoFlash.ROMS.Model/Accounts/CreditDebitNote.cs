using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(CreditDebitNoteGrid))]
    public class CreditDebitNoteGrid
    {
        public int SNo { get; set; }
        public string AirlineName { get; set; }
        //public string AgentName { get; set; }
        public string IssuedName { get; set; }
        public string Amount { get; set; }
        public string TransactionNo { get; set; }
        public string Status { get; set; }
        public string TransactionType { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime CreatedOn { get; set; }
        public string IssuedTo { get; set; }
        public string CreditNoteType { get; set; }
        public string ApprovedAmount { get; set; }
        public string AWBno { get; set; }
    }

    [KnownType(typeof(CreditDebitNote))]
    public class CreditDebitNote
    {
        public string InvoiceSNo { get; set; }
        public List<CNDNChargesTrans> LstCNDNChargesTrans { get; set; }
        public int CreatedBy { get; set; }
        public string CreditNoteType { get; set; }
        
    }

    [KnownType(typeof(CNDNChargesTrans))]
    public class CNDNChargesTrans
    {
        [Order(1)]
        public int InvTariffSNo { get; set; }
         [Order(2)]
        public int ChargeSNo { get; set; }
         [Order(3)]
        public decimal InputAmount { get; set; }
         [Order(4)]
        public string Remarks { get; set; }
    }
       
}
