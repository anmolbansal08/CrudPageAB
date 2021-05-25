using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(XRayMachine))]
    public class XRayMachine
    {
        public int SNo { get; set; }
        public String MachineCode { get; set; }
        public String MachineName { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }


    }
}
