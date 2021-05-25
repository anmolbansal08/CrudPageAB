using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Tariff
{


    [KnownType(typeof(TariffInvoiceHandlingCharges))]
    public class TariffInvoiceHandlingCharges
    {
        //public string ChargeName { get; set; }
        //public string HdnChargeName { get; set; }
        //public string Amount { get; set; }
        //public string TotalAmount { get; set; }
        //public string Payment { get; set; }
        //public string Credit { get; set; }
        //public string Remarks { get; set; }
        //public string BillTo { get; set; }
        //public string HdnBillTo { get; set; }

        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string WaveOff { get; set; }
        [Order(4)]
        public string TariffCodeSNo { get; set; }
        [Order(5)]
        public string TariffHeadName { get; set; }
        [Order(6)]
        public string pValue { get; set; }
        [Order(6)]
        public string sValue { get; set; }
        [Order(7)]
        public decimal Amount { get; set; }
        [Order(8)]
        public decimal TotalTaxAmount { get; set; }
        [Order(9)]
        public decimal TotalAmount { get; set; }
        [Order(10)]
        public string Rate { get; set; }
        [Order(11)]
        public string Min { get; set; }
        [Order(12)]
        public string Mode { get; set; }
        [Order(13)]
        public string ChargeTo { get; set; }
        [Order(14)]
        public string pBasis { get; set; }
        [Order(15)]
        public string sBasis { get; set; }
        [Order(16)]
        public string Remarks { get; set; }
        //[Order(5)]
        //public decimal Value { get; set; }
        //[Order(7)]
        //public string Basis { get; set; }
        //[Order(8)]
        //public string OnWt { get; set; }
        //[Order(9)]
        //public string Rate { get; set; }
        //[Order(10)]
        //public string Min { get; set; }
        //[Order(11)]
        //public string TotalTaxAmount { get; set; }
        //[Order(14)]
        //public string WaveOff { get; set; }
    }

    [KnownType(typeof(TariffInvoiceAirline))]
    public class TariffInvoiceAirline
    {
        public int IsApproved { get; set; }
        public int AirlineInvoiceSNo { get; set; }
        public int AirlineSNo { get; set; }
        public string AirlineCode { get; set; }
        public string CarrierCode { get; set; }
        public string ChargeGroupName { get; set; }
        public string AirlineName { get; set; }
        public string CurrentAirportCode { get; set; }
        public string Period { get; set; }
        public string StartPeriod { get; set; }
        public string EndPeriod { get; set; }
        public string CurrentDate { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string InvoiceAmount { get; set; }
        public string IssueType { get; set; }
        public string IssueSNo { get; set; }
        public string ApprovedBy { get; set; }
        public string PreparedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public DateTime? PreparedOn { get; set; }
    }
    [KnownType(typeof(TariffInvoiceAgent))]
    public class TariffInvoiceAgent
    {
        public int IsApproved { get; set; }
        public int AccountSNo { get; set; }
        public string AirlineCode { get; set; }
        public int AirlineInvoiceSNo { get; set; }        
        public string AccountName { get; set; }
        public string ChargeGroupName { get; set; }
        public string OfficeName { get; set; }
        public string CurrentAirportCode { get; set; }
        public string Period { get; set; }
        public string StartPeriod { get; set; }
        public string EndPeriod { get; set; }
        public string CurrentDate { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string InvoiceAmount { get; set; }
        public string IssueType { get; set; }
        public string IssueSNo { get; set; }
        public string AirlineAccountSNo { get; set; }

        public string ApprovedBy { get; set; }
        public string PreparedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public DateTime? PreparedOn { get; set; }
    }

    //Added by deepak sharma
    [KnownType(typeof(SummaryCreditInvoiceGridData))]
    public class SummaryCreditInvoiceGridData
    {
        public int AirlineInvoiceSNo { get; set; }
        public int InvHandlingChargeMasterSNo { get; set; }
        public string ChargeName { get; set; }
        public decimal ChargeAmount { get; set; }
    }

    [KnownType(typeof(DetailsCreditInvoiceGridData))]
    public class DetailsCreditInvoiceGridData
    {
        public int InvHandlingChargeMasterSNo { get; set; }
        public string AWBNo { get; set; }
        public string WorkOrderNo { get; set; }
        public DateTime WorkOrderDate { get; set; }
        public string ChargeName { get; set; }
        public decimal ChargeAmount { get; set; }
    }


}
