using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(BTBMachinePallet))]
    public class BTBMachinePallet
    {
        public int SNo { get; set; }
        public string MachineName { get; set; }
        public int Weight { get; set; }
        public bool IsActive { get; set; }
        public int UserSno { get; set; }
        public int UpdatedBy { get; set; }
        public string Active { get; set; }
    }
}




   