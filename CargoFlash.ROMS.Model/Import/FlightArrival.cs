using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(FlightArrival))]
    public class FlightArrival
    {
        public int SNo { get; set; }
    }
    
    [KnownType(typeof(FlightArrivalGridData))]
    public class FlightArrivalGridData
    {
        public Int64 SNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String OriginCityCode { get; set; }
        public String DestinationCityCode { get; set; }
        public String Status { get; set; }
        public String TotalPieces { get; set; }
        public String TotalGrossWt { get; set; }
        public String TotalVolumeWt { get; set; }
        public String FFM { get; set; }
        public String CPM { get; set; }
        public String FWB { get; set; }
        public String FHL { get; set; }
        public String MVT { get; set; }
    }
    [KnownType(typeof(FlightInformation))]
    public class FlightInformation
    {
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightOrigin { get; set; }
        public string ATA { get; set; }
        public string FlightArrivedDate { get; set; }
        public string AircraftRegistrationNo { get; set; }

    }
}