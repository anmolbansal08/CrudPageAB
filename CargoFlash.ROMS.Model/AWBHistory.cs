using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model
{
   public  class AWBHistory
    {
        public string AWBSNO { get; set; }
        //    public string AWBPrefix { get; set; } FlightWeight Pieces
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AWBReferenceBookingSNo { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightVolume { get; set; }
        public string Action { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }

    }
}
