using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(ImportFlightMonitoringModel))]
    public class ImportFlightMonitoringModel
    {
        public int SNo { get; set; }
        public string OriginCity { get; set; }
        public string FlightNo { get; set; }
        public string FlightDateTime { get; set; }
        public string RcvdWeight { get; set; }
        public string DOWeight { get; set; }
        public string ARRColour { get; set; }
        public string RCFColour { get; set; }
        public string NFDColour { get; set; }
        public string DLVColour { get; set; }
    }
    [KnownType(typeof(ImportFlightMonitoringModelGrid))]
    public class ImportFlightMonitoringModelGrid
    {
        public int SNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightETADate { get; set; }
        public string OriginAirportCode { get; set; }
        public string FFMSLATime { get; set; }
        public string FFMSLAMet { get; set; }
        public string ULDBreak { get; set; }
        public string FFMArrLocPcCount { get; set; }
        public string LocationPercent { get; set; }
        public string SHCQRTDGR { get; set; }
        public string RCFSLATime { get; set; }
        public string NFDSLATime { get; set; }
        public string ARRSLATime { get; set; }
        public string DLVSLATime { get; set; }
        public string DLVSuccess { get; set; }
        public string AirlineName { get; set; }
        public string FFMPc { get; set; }
        public string FlightCapacity { get; set; }
        public string FFMWT { get; set; }
        public string NFDSuccess { get; set; }
        public string ARRSuccess { get; set; }
        public string RCFSuccess { get; set; }

    }
    [KnownType(typeof(ImportFlightMonitoringModelNestedGrid))]
    public class ImportFlightMonitoringModelNestedGrid
    {
        public int DailyFlightSno { get; set; }
        public string AWBNo { get; set; }
        public string Weight { get; set; }
        public string ARRTime { get; set; }
        public string RCFTime { get; set; }
        public string NFDTime { get; set; }
        public string SHC { get; set; }
        public string FFMArrLocPcsCount { get; set; }
        public string LocationPercent { get; set; }

    }
    [KnownType(typeof(ImportFlightMonitoringChart))]
    public class ImportFlightMonitoringChart
    {
        public string GrossWeight { get; set; }
        public string UpdatedOn { get; set; }
    }
}
