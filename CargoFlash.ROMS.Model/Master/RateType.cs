using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{

    [KnownType(typeof(RateType))]
    public class RateType
    {
        public int SNo { get; set; }
        public string RateTypeName { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }

    }
}
