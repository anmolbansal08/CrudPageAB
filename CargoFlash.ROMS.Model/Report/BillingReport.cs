using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace CargoFlash.Cargo.Model.Report
{


    [System.Runtime.Serialization.KnownType(typeof(BillingReport))]
    public class BillingReport
    {
        public string Airline { get; set; }
        public string BookingDate { get; set; }
        public string Product { get; set; }
        public string Agent { get; set; }
        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string SHC { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FlightDate { get; set; }
        public string whereCondition { get; set; }
        public string OrderBy { get; set; }
        //public string Flightno { get; set; }
        //public string Flightroute { get; set; }
        //public string Code { get; set; }
        public string Aircraft { get; set; }
        //public string Mawb { get; set; }
        //public string Shipper { get; set; }
        //public string AgentorCustomer { get; set; }
        public string Commodity { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        //public string Page { get; set; }
        //public string PageSize { get; set; }
        //public string Pcs { get; set; }
        //public string Cargo_Dimensions { get; set; }
        //public string Actual_Weight { get; set; }
        //public string Chargeable_Weight { get; set; }
        //public string Remarks { get; set; }
        //public string Cass { get; set; }
        //public string Rating { get; set; }
        //public string Airfreight_Rate { get; set; }
        //public string Total_Airfreight { get; set; }
        //public string Block_Space { get; set; }
        //public string FSC_Rate { get; set; }
        //public string FSC_Total { get; set; }
        //public string OVS_Rate { get; set; }
        //public string OVS_Total { get; set; }
        //public string TC_RateOrigin { get; set; }
        //public string TC_RateDest { get; set; }
        //public string Tc_Total { get; set; }
        //public string Secuirty { get; set; }
        //public string Custom_Clr { get; set; }
        //public string AWB_Cutting { get; set; }
        //public string AWB_Fees { get; set; }
        //public string EDI_Fees { get; set; }
        //public string DGR_Fees { get; set; }
        //public string Secuirty_Surcharge { get; set; }
        //public string Trucking_Fees { get; set; }
        //public string Other_Fees { get; set; }
        //public string Total_GST { get; set; }
        //public string GST_Summary { get; set; }
        //public string GST_6 { get; set; }
        //public string Total_Billing { get; set; }
        //public string InvoiceNo { get; set; }
        //public string Payment { get; set; }
        //public string Trucking_Cost { get; set; }
        //public string Third_Party { get; set; }
        //public string Other_Cost { get; set; }


    }
    [System.Runtime.Serialization.KnownType(typeof(BillingReport1))]
    public class BillingReport1
    {
        public string SNo { get; set; }
        public string RowNumber { get; set; }
        public string Cnee { get; set; }
        public string Commodity { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Aircraft { get; set; }
        public string FlightDate { get; set; }
        public string Flightno { get; set; }
        public string Flightroute { get; set; }
        public string Code { get; set; }
        public string Mawb { get; set; }
        public string Shipper { get; set; }
        public string AgentorCustomer { get; set; }
        public string Pcs { get; set; }
        public string Cargo_Dimensions { get; set; }
        public string Length { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public string Actual_Weight { get; set; }
        public string Chargeable_Weight { get; set; }
        public string Remarks { get; set; }
        public string Cass { get; set; }
        public string Rating { get; set; }
        public string Airfreight_Rate { get; set; }
        public string Total_Airfreight { get; set; }
        public string Block_Space { get; set; }
        public string FSC_Rate { get; set; }
        public string FSC_Total { get; set; }
        public string OVS_Rate { get; set; }
        public string OVS_Total { get; set; }
        public string TC_RateOrigin { get; set; }
        public string TC_RateDest { get; set; }
        public string Tc_Total { get; set; }
        public string Secuirty { get; set; }
        public string Custom_Clr { get; set; }
        public string AWB_Cutting { get; set; }
        public string AWB_Fees { get; set; }
        public string EDI_Fees { get; set; }
        public string DGR_Fees { get; set; }
        public string Secuirty_Surcharge { get; set; }
        public string Trucking_Fees { get; set; }
        public string Other_Fees { get; set; }
        public string Total_GST { get; set; }
        public string GST_Summary { get; set; }
        public string GST_6 { get; set; }
        public string Total_Billing { get; set; }
        public string InvoiceNo { get; set; }
        public string Payment { get; set; }
        public string Trucking_Cost { get; set; }
        public string Third_Party { get; set; }
        public string Other_Cost { get; set; }
    }
}