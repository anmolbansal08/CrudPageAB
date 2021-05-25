using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(ReadyToUnloading))]
    public class ReadyToUnloading
    {
        public int SNo { get; set; }
        public int Sli { get; set; }
        public string AWBNo { get; set; }
        public string Pieces { get; set; }
        public string Verified { get; set; }
        public int SLISNo { get; set; }
        public string TruckNo { get; set; }
        public string ManPower { get; set; }
        public string BuildEquipment { get; set; }
        public string HdnBuildEquipment { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string StartUTime { get; set; }
        public string EndUTime { get; set; }
        public string Location { get; set; }
        public string HdnLocation { get; set; }
        public string SLINo { get; set; }
        public string AgentName { get; set; }
        
    }
}


