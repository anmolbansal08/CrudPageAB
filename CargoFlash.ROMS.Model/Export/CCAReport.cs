using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Export
{
    [KnownType(typeof(CCAReportRequestModel))]
    public class CCAReportRequestModel
    {
        public string AirlineCode { get; set; }
        public int StatusType { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int OriginSNo { get; set; }
        public string FlightNo { get; set; }
        public int AWBSNo { get; set; }
        public int CCASNo { get; set; }
        public int IsAutoProcess { get; set; }
    }
}
