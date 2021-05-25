using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Export
{

    [KnownType(typeof(ExecutionReport))]
    public class ExecutionReport
    {
        public string AWBCount { get; set; }
        public string POMailCount { get; set; }
    }

    public class ExecReportModel
    {
        public String Month { get; set; }
        public String Year { get; set; }
    }

    public class ExcelReportModel
    {
        public String Month { get; set; }
        public String Year { get; set; }

        public string RecordType { get; set; }
    }
    public class ExecutionReportDetail
    {
        public string AWBNo { get; set; }

        public string Origin { get; set; }

        public string Destination { get; set; }
        public string Pieces { get; set; }

        public string Grossweight { get; set; }

        public string Volumeweight { get; set; }
        public string Cbm { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
    }
}
