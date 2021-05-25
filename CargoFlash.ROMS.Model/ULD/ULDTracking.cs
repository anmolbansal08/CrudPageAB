using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDTracking))]
    public class ULDTracking
    {
        public int ULDSNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    [KnownType(typeof(ULDGridData))]
    public class ULDGridData
    {
        public string ULDNo { get; set; }
        public Int32 ULDSNo { get; set; }
        public string FlightNo { get; set; }
        public string StartDate { get; set; }
        public string Location { get; set; }        
    }

 
}
