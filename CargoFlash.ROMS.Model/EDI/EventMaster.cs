using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.EDI
{
    [KnownType(typeof(EventMaster))]
    public class EventMaster
    {
        public int SNo { get; set; }
        public string EventName { get; set; }
        public string Description { get; set; }
        public string UpdatedBy { get; set; }
    }
}
