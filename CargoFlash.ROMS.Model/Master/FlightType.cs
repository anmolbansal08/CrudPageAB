using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(FlightType))]
    public class FlightType
    {
        public int SNo { get; set; }
        public string FlightTypeName { get; set; }
        public Nullable<Decimal> Priority { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }


    }
}
