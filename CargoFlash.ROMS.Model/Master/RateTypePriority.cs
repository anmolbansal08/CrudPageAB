using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(RateTypePriority))]
    public class RateTypePriority
    {
        //public string RateTypeName { get; set; }
        public string SNo { get; set; }
        public string RatePriority { get; set; }
    }

}
