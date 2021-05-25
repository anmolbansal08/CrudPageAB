using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{
    public class IndividualSalesReport
    {
        public int SNo { get; set; }
        public int RowNo { get; set; }
        public string DocNo { get; set; }
        public string POSName { get; set; }

        public string MOP { get; set; }
        public string Org { get; set; }
        public string Dest { get; set; }
        public string GrossWt { get; set; }
        public string ChWt { get; set; }
        public string Curr { get; set; }
        public string FrtCharges { get; set; }
        public string TotalValuationCharges { get; set; }
        public string TotalOtherCharges { get; set; }
        public string TotalNet { get; set; }
        public string AWBRefundFee { get; set; }
        public string RecieptNo { get; set; }
        public string TypeofPayment { get; set; }
        public string Amount { get; set; }
        public string DetailsBank { get; set; }
        public string DetailsCardType { get; set; }

        public string DetailsCardNo { get; set; }

        public string IssueDate { get; set; }
        public string PaymentDate { get; set; }

        public string UserId { get; set; }

        public string Remarks { get; set; }
        public string PaymentStatus { get; set; }

        public string Tax { get; set; }
        

        //public string Curr { get; set; }
        public string TotalFreightAmount { get; set; }
        //public string TotalValuationCharges { get; set; }
        //public string TotalOtherCharges { get; set; }
        public string TotalAWBRefundFee { get; set; }
        public string TotalCash { get; set; }
        public string TotalCredit { get; set; }
        public string TotalAutodebet { get; set; }
        public string TotalSettlement { get; set; }
        public string Difference { get; set; }
    }
    //public class IndividualSalesReportSummary
    //{
    //    public string Curr { get; set; }
    //    public string TotalFreightCharges { get; set; }
    //    public string TotalValuationCharges { get; set; }
    //    public string TotalOtherCharges { get; set; }
    //    public string TotalAWBRefundFee { get; set; }
    //    public string TotalCash { get; set; }
    //    public string TotalCredit { get; set; }
    //    public string TotalAutodebet { get; set; }
    //    public string TotalSettlement { get; set; }
    //    public string Difference { get; set; } 
    //}
}

