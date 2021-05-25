using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Distance))]
    public class Distance
    {

        public int SNo { get; set; }
        public string RefNo { get; set; }
        public int OriginAirportSNo { get; set; }
        public string Text_OriginAirportSNo { get; set; }
        public int DestinationAirportSNo { get; set; }
        public string Text_DestinationAirportSNo { get; set; }
        public int TDistance { get; set; }

    }


    [KnownType(typeof(DistanceGrid))]
    public class DistanceGrid
    {
        public int SNo { get; set; }
        public string RefNo {get;set;}
        public string OriginAirportSNo { get; set; }
        public string DestinationAirportSNo { get; set; }
        public int TDistance { get; set; }

    }
}
