using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Schedule
{
    [KnownType(typeof(SSIMUpload))]
    public class SASSSIMUpload
    {
        public string CarrierCode { get; set; }
        public string FlightNo { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string Days { get; set; }
        public string Origin { get; set; }
        public string ETD { get; set; }
        public string Destination { get; set; }
        public string OriginAirportCode { get; set; }
        public string DestinationAirportCode { get; set; }
        public string ValidationMessage { get; set; }
    }
}
