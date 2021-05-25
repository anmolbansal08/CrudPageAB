using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(AmendFlightStatus))]
    public class AmendFlightStatus
    {
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string FlightNo { get; set; }
        [Order(3)]
        public string FlightStatus { get; set; }
        [Order(4)]
        public string FlightAmendmentRemarks { get; set; }
    }

    public class FlightCondition
    {
        public string  Airline {get;set;}
     public string Org {get;set;}
     public string Dest {get;set;}
      public string SearchFlightNo {get;set;}
      public string SearchFlightStatus {get;set;}
      public string DateFlight { get; set; }

    }
}
