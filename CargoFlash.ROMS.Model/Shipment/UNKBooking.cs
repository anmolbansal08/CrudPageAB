using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(UNKBooking))]
    public class UNKBooking
    {
        public string UNKNo { get; set; }
  
        public string Origin { get; set; }
        public string Dest { get; set; }
        public string Pieces { get; set; }
        public string Grwt { get; set; }
        public string VolWt { get; set; }

        public decimal CBM { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        public DateTime BookedDateTime { get; set; }

        public DateTime AutoReleaseDateTime { get; set; }

    }
}
