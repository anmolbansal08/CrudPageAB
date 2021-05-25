using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(UnLockedPage))]
    public class UnLockedPage
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string ULDNo { get; set; }
        public string FLIGHTNo { get; set; }
        public string FlightDate { get; set; }
        public string LockedProcessName { get; set; }
        public string IsLocked { get; set; }
        public string LockedBy { get; set; }
        public string  LockedOn { get; set; }
       
       
    }
    public class whereconditionmodel
    {
        public string type { get; set; }
        public string Typeof { get; set; }
        public string FlightDate { get; set; }
        public int? LockedBySNo { get; set; }

    }
}
