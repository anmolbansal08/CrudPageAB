using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(SLA))]
    public class SLA
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string FlightNo { get; set; }
        public int AirlineSNo { get; set; }
        public int AirportSNo { get; set; }
        public bool Mode { get; set; }
    }
}
