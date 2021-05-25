using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [KnownType(typeof(HoldTypeReportRequestModel))]
    public class HoldTypeReportRequestModel
    {
        public string AirlineCode { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        //public string HoldType { get; set; }
        //public string AWBNo { get; set; }
    }


    [KnownType(typeof(HoldTypeReport))]
    public class HoldTypeReport
    {
        public int SNo { get; set; }
        public string AWB { get; set; }
        public string HAWBNo { get; set; }
        public string Pkgs { get; set; }
        public string Gwt { get; set; }
        public string HoldDate { get; set; }
        public string HoldedBy { get; set; }
        public string HoldRemark { get; set; }
    }
}
