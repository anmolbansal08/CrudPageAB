using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(FWBImportGridData))]
    public class FWBImportGridData
    {
        public string ProcessStatus { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string SLINo { get; set; }
        public string AWBDate { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public decimal Gross { get; set; }
        public decimal Volume { get; set; }
        public decimal ChWt { get; set; }
        public int Pcs { get; set; }
        public string FlightNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal FBLWt { get; set; }
        public decimal FWBWt { get; set; }
        public decimal RCSWt { get; set; }
    }
}
