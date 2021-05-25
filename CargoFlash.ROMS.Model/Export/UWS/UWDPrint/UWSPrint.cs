using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Export.UWS.UWDPrint
{
    [KnownType(typeof(UWSPrint))]
   public class UWSPrint
    {
        public string AirlineName { get; set; }
    }
}
