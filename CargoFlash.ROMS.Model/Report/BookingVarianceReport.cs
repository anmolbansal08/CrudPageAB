using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    public class BookingVarianceReport
    {



        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string BookingType { get; set; }
        public string AWBDATE { get; set; }
        public string ORIGIN { get; set; }
        public string DESTINATION { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string BookingDate { get; set; }
        public string BookingPieces { get; set; }
        public string ExecutedPieces { get; set; }
        public string AcceptedPieces { get; set; }

        public string TotalChargeableWeight { get; set; }
        public string AccountName { get; set; }
        public string BookingStatus { get; set; }
        public string BookingGrossWeight { get; set; }
        public string AcceptedGrossWeight { get; set; }
        public string ExecutedGrossWeight { get; set; }
        public string BookingVolume { get; set; }
        public string AcceptedVolume { get; set; }
        public string ExecutedVolume { get; set; }
    }
}
