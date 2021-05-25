using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{
    public class PointOfSales
    {
        public int SNo { get; set; }
        public int RowNo { get; set; }
        public string POSCode { get; set; }
        public string POSName { get; set; }
        public string AWBNo { get; set; }
        public string MOP { get; set; }
        public string Org { get; set; }
        public string Dest { get; set; }
        public string CCANo { get; set; }
        public string ChWt { get; set; }
        public string Commodity { get; set; }
        public string FrtCharges { get; set; }
        public string Comm { get; set; }
        public string Disc { get; set; }
        public string TotalOtherCharges { get; set; }
        public string TotalNet { get; set; }
        public string RefundFee { get; set; }
        public string Curr { get; set; }
        public string RecieptNo { get; set; }
        public string PaymentDetailsFormOfPayment { get; set; }
        public string PaymentDetailsAmount { get; set; }
        public string PaymentDetailsBankName { get; set; }
        public string PaymentDetailsCardType { get; set; }
        public string PaymentDetailsCardNo { get; set; }
        public string UserId { get; set; }
        public string Remarks { get; set; }

        public string IssueDate { get; set; }
        public string PaymentDate { get; set; }

        public string TotalFreightCharges { get; set; }
        public string TotalAWBRefundFee { get; set; }
        public string TotalCash { get; set; }
        public string TotalCredit { get; set; }
        public string TotalAutodebet { get; set; }
        public string TotalSettlement { get; set; }
        public string Difference { get; set; }
        public string PaymentStatus { get; set; }
        public string Tax { get; set; }
        public string AWBStatus { get; set; }
    }
    public class PointOfSalesRequestModel
    {
        public int AirlineSNo { get; set; }
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Type { get; set; }
        public int AccountSNo { get; set; }
        public string POSCode { get; set; }
        public string PaymentStatus { get; set; }
        
    }
}
