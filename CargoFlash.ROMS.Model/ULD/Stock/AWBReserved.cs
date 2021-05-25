using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Stock
{
    [KnownType(typeof(AWBReserved))]
    public class AWBReserved
    {
        public Int32? SNo { get; set; }
        public string AWBNo { get; set; }
        public string ReservedFor { get; set; }
        public string ReservedBy { get; set; }
        public Nullable<DateTime> ReservedOn { get; set; }
        public string CreatedBy { get; set; }
        public string Text_AWBNum { get; set; }
        public string AWBNum { get; set; }
        public Int32? IsReserved { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string Used { get; set; }
        public string AirlineName { get; set; }
    }

}
