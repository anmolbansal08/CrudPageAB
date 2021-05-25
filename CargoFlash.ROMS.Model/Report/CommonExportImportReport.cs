using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(CommonExportImportReport))]
    public class CommonExportImportReport
    {
        public int EIType { get; set; }
        public string ReportType { get; set; }
        public string ReportName { get; set; }
    }

    [KnownType(typeof(ExportImportReport))]
    public class ExportImportReport
    {
        public string SNo { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Cons { get; set; }
        public string Pkgs { get; set; }
        public string GRSWt { get; set; }
        public string CHRGWt { get; set; }

    }
    [KnownType(typeof(ExportImportDetails))]
    public class ExportImportDetails
    {
        public string SNo { get; set; }
        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginAirport { get; set; }
        public string DestinationAirport { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Cons { get; set; }
        public string Pkgs { get; set; }
        public string GRSWt { get; set; }
        public string CHRGWt { get; set; }

    }

    public class CommonExportImportRequest
    {
        public int ReportNameSNo { get; set; }
        public string AirlineSNo { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string type { get; set; }
        public string EIType { get; set; }

    }

}
