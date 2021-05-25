using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class LoadFactorFlight
    {
        public string OriginAirPortSNo { get; set; }
        public string DestinationAirPortSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Dest { get; set; }
        public string FlightNo { get; set; }
        public string FlightType { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }
        public string RouteType { get; set; }
        public string FlightDate { get; set; }
        public string Aircraft { get; set; }
        public string TotalCapacityGross { get; set; }
        public string TotalCapacityVolume { get; set; }
        public string UsedTotalCapacityGross { get; set; }
        public string UsedTotalCapacityVolume { get; set; }
        public string UsedChargeableTotalCapacity { get; set; }
        public string LoadFactorFlights { get; set; }
        public string FlightStatus { get; set; }

    }
}
