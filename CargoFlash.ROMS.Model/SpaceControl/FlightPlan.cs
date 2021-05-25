using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.SpaceControl
{

    [KnownType(typeof(FlightPlan))]
    public class FlightPlan
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public int Pieces { get; set; }
        public string AccountName { get; set; }
        public string Status { get; set; }

    }


    [KnownType(typeof(FlightPlanGrid))]
    public class FlightPlanGrid
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public int Pieces { get; set; }
        public string AccountName { get; set; }
        public string Status { get; set; }
       
    }
}
