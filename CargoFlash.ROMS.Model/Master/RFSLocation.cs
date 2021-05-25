using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(RFSLocation))]
    public class RFSLocation
    {
        public int SNo { get; set; }
        public String LocationCode { get; set; }
        public String Location { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
