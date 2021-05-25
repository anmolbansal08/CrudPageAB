using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Schedule
{
    [KnownType(typeof(SSIMUpload))]
    public class SSIMUpload
    {
        public string AirlineCode { get; set; }
        public string FlightNo { get; set; }
        public string FlightType { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Days { get; set; }
        public string Origin { get; set; }
        public string ETD { get; set; }
        public string ETDGMT { get; set; }
        public string Destination { get; set; }
        public string ETA { get; set; }
        public string ETAGMT { get; set; }
        public string AircraftType { get; set; }
        public string AircraftTypeSNo { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string TimeDifference { get; set; }
	
    }
}
