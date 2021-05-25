using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(IrregularityFlightReport))]
    public class IrregularityFlightReport
    {
        public Int32 SNo { get; set; }
        public string AWBNo { get; set; }
        public string Commodity { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
        public string Irrpieces { get; set; }
        public string IrrWeight { get; set; }
        public string Description { get; set; }
        public string Action { get; set; }
        
    }
}
