using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(City))]
    public class ExcelUpload
    {
        public int SNo { get; set; }
    }
}
