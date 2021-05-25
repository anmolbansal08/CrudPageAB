using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(CLBalanceReport))]
    public class CLBalanceReport
    {
        public int SNo { get; set; }
        public string Origin { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string MaxCL { get; set; }
        public string AvlBalanceCL { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionType { get; set; }
        public string Currency { get; set; }
        public string ReferenceNo { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedDate { get; set; }
        public string Remarks { get; set; }
        public string Status { get; set; }

    }

    public class CLBalanceReportRequest
    {
        public string  OfficeSNo { get; set; }
        public string AccountSNo { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public int CurrencySNo { get; set; }
        public int AirlineSNo { get; set; }
        public string CitySNo { get; set; }
        public string Type { get; set; }
    }
}
