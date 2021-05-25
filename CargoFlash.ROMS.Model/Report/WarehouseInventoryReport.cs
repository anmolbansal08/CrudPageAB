using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [System.Runtime.Serialization.KnownType(typeof(WarehouseInventoryReportRequestModel))]
    public class WarehouseInventoryReportRequestModel
    {
        public string AirlineCode { get; set; }
        //public string FlightNo { get; set; }
        public string OriginSNo { get; set; }
        //public string DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        //public string AWBNo { get; set; }
    }
    [System.Runtime.Serialization.KnownType(typeof(WarehouseInventoryReport))]
    public class WarehouseInventoryReport
    {
        //ReceiveChWt 	Location	
        public int SNo { get; set; }
        public string Org { get; set; }
        public string Dest { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string MAWB { get; set; }
        public string HAWB { get; set; }        
        public string ReceivePcs { get; set; }
        public string ReceiveGWt { get; set; }
        public string ReceiveChWt { get; set; }
        public string Location { get; set; }
    }
}
