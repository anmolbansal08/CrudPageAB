using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(DueCarrier))]
    public class DueCarrier
    {
        public int SNo { get; set; }
        public string DueCarrierCode { get; set; }
        public string Description { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        //public string Deleted { get; set; }
    }
}
