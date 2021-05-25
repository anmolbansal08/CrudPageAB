
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{

    [KnownType(typeof(CityConnectionTimePriority))]
    public class CityConnectionTimePriority
    {
        public string SNo { get; set; }
        public string Priority { get; set; }

    }
}
