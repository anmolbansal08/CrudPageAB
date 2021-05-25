using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Schedule
{
    [KnownType(typeof(FlightOpen))]
    public class FlightOpen
    {
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }
        public string AirCraftSNo { get; set; }
        public string ForwarderAgent { get; set; }
        public string ScheduleType { get; set; }
    }

    public class FlightCreatedRecord
    {
      public  string DFAlreadyCreated { get; set; }
    }
}
