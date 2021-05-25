using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    [DataContract]
    public class FlightDetail
    {
        [DataMember]
        public string flightNo { get; set; }
        [DataMember]
        public DateTime flightDate { get; set; }
        [DataMember]
        public string origin { get; set; }
        [DataMember]
        public string destination { get; set; }
        [DataMember]
        public DateTime ETA { get; set; }
        [DataMember]
        public DateTime ETD { get; set; }
        [DataMember]
        public bool flightStatus { get; set; }

    }

    [DataContract]
    public class FlightSchedule
    {
        [DataMember]
        public List<FlightDetail> flightDetail { get; set; }
    }
    [DataContract]
    public class FlightResponse
    {
        [DataMember]
        public string Flightno { get; set; }
        [DataMember]
        public DateTime FlightDate { get; set; }
        [DataMember]
        public string Origin { get; set; }
        [DataMember]
        public string Destination { get; set; }
    }
    [DataContract]
    public class ServiceResponse
    {
        [DataMember]
        public List<FlightResponse> flightResponse { get; set; }
    }
}
