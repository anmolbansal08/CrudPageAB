using System.Runtime.Serialization;
using System;
namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(SpecialCargo))]
    public class SpecialCargo
    {
        public int SNo {get; set;}
        public string SpecialCargoType { get; set; }
        public string SpecialCargoNo { get; set; }
        public string Remarks { get; set; }
        public string Document { get; set; }
        public bool IsDoc { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
