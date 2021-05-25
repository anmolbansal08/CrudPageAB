using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Tools
{
    [KnownType(typeof(SeaAirTool))]
    public class SeaAirTool
    {
        //public int SNo { get; set; }
        public int Awbsno { get; set; }
        public int AWBNo { get; set; }
        public int BookingType { get; set; }
        public string BOENo { get; set; }
        public string BOEDate { get; set; }
        public int UpdatedBy { get; set; }
    }
}
