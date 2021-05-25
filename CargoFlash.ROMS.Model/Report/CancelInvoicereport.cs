using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(CancelInvoicereport))]
    public class CancelInvoicereport
    {
        public int Sno { get; set; }
        public string awbno { get; set; }
        public string bookingType { get; set; }
        public string agentname { get; set; }
        public string origin { get; set; }
        public string destination { get; set; }
        public string flightno { get; set; }
        public string flightdate { get; set; }
        public string bookingdate { get; set; }
        public string pieces { get; set; }
        public string grossweight { get; set; }
        public string volumeweight { get; set; }
        public string Chargeableweight { get; set; }
        public string Amount { get; set; }
        public string Type { get; set; }
        public string RequestedBy { get; set; }
        public string ApprovedBy { get; set; }
        public string RequestedDate { get; set; }
        public string ApprovalDate { get; set; }
        public string InvoiceNo { get; set; }
    }
    [KnownType(typeof(CancelInvoicereRequest))]
    public class CancelInvoicereRequest
    {
        public int IsAutoProcess { get; set; }
        public string AirlineSNo { get; set; }
        public string OriginSNo { get; set; }
        public string DestinationSno { get; set; }
        public Nullable<DateTime> FromDate { get; set; }
        public Nullable<DateTime> ToDate { get; set; }
        public string AWBSNo { get; set; }
        public string CancelType { get; set; }
        public string OptionType { get; set; }
        public string agentsno { get; set; }


    }
}
