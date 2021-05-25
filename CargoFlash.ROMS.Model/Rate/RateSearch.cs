using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Rate
{
    [KnownType(typeof(RateSearch))]
    public class RateSearch
    {
        public int SNo { get; set; }
        public string Origin { get; set; }
        public string Text_Origin { get; set; }
        public string Destination { get; set; }
        public string Text_Destination { get; set; }
        public string Commodity { get; set; }
        public string Text_Commodity { get; set; }
        public string Product { get; set; }
        public string Text_Product { get; set; }
        public string SHC { get; set; }
        public string Text_SHC { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
