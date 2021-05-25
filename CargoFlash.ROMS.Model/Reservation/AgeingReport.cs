using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{

    [KnownType(typeof(AgeingReport))]
    public class AgeingReport
    {
        public int SNo { get; set; }
        
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string TotalAmount { get; set; }
        public string ReceiptNo { get; set; }
        public string ReceiptDate { get; set; }
        public string ReceiptAmount { get; set; }
        public string Days_01_30 { get; set; }
        public string Days_31_60 { get; set; }
        public string Days_61_90 { get; set; }
        public string Days_91_180 { get; set; }
        public string Days_181_360 { get; set; }
        public string Days_360 { get; set; }

    }

    public class PartyWiseReport
    {
        public int SNo { get; set; }

        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string InvoiceAmount { get; set; }
        public string ReceiptNo { get; set; }
        public string ReceiptDate { get; set; }
        public string ReceiptAmount { get; set; }
        public string FinalOverDue { get; set; }

    }

    public class AnalysisReport
    {
        public int SNo { get; set; }
        
        public string GSACODE { get; set; }
        public string GSAARCODE { get; set; }
        public string GSANAME { get; set; }
        public string InvoiceAmount { get; set; }
        public string ReceiptAmount { get; set; }
        public string OverDue { get; set; }
    }

    [KnownType(typeof(AgeingReportModel))]
    public class AgeingReportModel
    {
        public string AirlineCode { get; set; }
        public string AgentSno { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ReportType { get; set; }

    }
}
