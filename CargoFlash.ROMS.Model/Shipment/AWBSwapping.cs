using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;

namespace CargoFlash.Cargo.Model.Shipment
{
     [KnownType(typeof(AWBSwapping))]
   public class AWBSwapping
    {
        public string FPSno { get; set; }
        public string FlightNo{get;set;}
        public string FlightDate{get;set;}
        public string Origin{get;set;}
        public string Dest{get;set;}
        public string Pieces{get;set;}
        public string Grwt{get;set;}
        public string VolWt{get;set;}
        public string Status { get; set; }
    }
}
