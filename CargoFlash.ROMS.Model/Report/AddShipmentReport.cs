using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    public class AddShipmentReport
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string DestinationAirPortCode { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Sector { get; set; }
        public string AWBDate { get; set; }
        public string AgentName { get; set; }
        public string AgentCode { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }

        public string VolumeWeight { get; set; }
        public string ChargeableWeight { get; set; }
        public string ProductName { get; set; }
        public string Commodity { get; set; }
        public string FlightType { get; set; }
        public string BookingFlightNo { get; set; }
        public string BookingFlightDate { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }
        public string AddShipmentAt { get; set; }
        public string AddShipmentFlight { get; set; }
        public string DateAddShipment { get; set; }
        public string SNo { get; set; }
    }
    public class ValadityOfModuleModel
    {
        public int DurationSNo { get; set; }
        public int ModuleSNo { get; set; }
    }
}