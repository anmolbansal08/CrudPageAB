using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Schedule
{
    [KnownType(typeof(AllotmentReleaseFlight))]
    public class AllotmentReleaseFlight
    {
        public string SNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string DepDate { get; set; }
        public string ETD_ETA { get; set; }
        public string TotalGroUsedAvail { get; set; }
        public string TotalVolUsedAvail { get; set; }
        public string ReserveGroUsedAvail { get; set; }
        public string ReserveVolUsedAvail { get; set; }
        public string AllotmentGroUsedAvail { get; set; }
        public string AllotmentVolUsedAvail { get; set; }
    }

    [KnownType(typeof(AllotmentReleaseAgent))]
    public class  AllotmentReleaseAgent
    {
        public string SNo { get; set; }
        public string DailyFlightAllotmentSNo { get; set; }
        //public string Office { get; set; }
        public string Agent { get; set; }
        //public string Shipper { get; set; }
        public string AllotmentType { get; set; }
        public string AllotmentCode { get; set; }
        public decimal AvaGross { get; set; }
        public decimal AvaVol { get; set; }
        public string Gross { get; set; }
        public string ReleaseGross { get; set; }
        public string Volume { get; set; }
        public string ReleaseVol { get; set; }

        public string TotalReleaseGross { get; set; }
        public string TotalReleaseVol { get; set; }
        //public string Commodity { get; set; }
        //public string Commodity_Type { get; set; }
        //public string SHC { get; set; }
        //public string SHC_Type { get; set; }
        //public string Product { get; set; }
        //public string Product_Type { get; set; }
        public string ReleaseTime { get; set; }
        public string RemainingReleaseTime { get; set; }
        public string AutoRelease { get; set; }
    }

    [KnownType(typeof(AllotmentReleaseShipment))]
    public class AllotmentReleaseShipment
    {
        public string SNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        //public string FlightNo { get; set; }
        //public string FlightDate { get; set; }
        //public string ETD_ETA { get; set; }
        public string Pieces { get; set; }
        public string Gross { get; set; }
        public string Volume { get; set; }
        public string Product { get; set; }
        public string Commodity { get; set; }
        //public string AircraftType { get; set; }
        public string AllotmentCode { get; set; }
    }
}
