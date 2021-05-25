using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(ExportFlightMonitoringModel))]
    public class ExportFlightMonitoringModel
    {
        public int SNo { get; set; }
        public string ProcessStatus { get; set; }

        public string Destination { get; set; }
        public string FlightNo { get; set; }
        public string FlightDateTime { get; set; }
        public string FBL { get; set; }
        public string HandoverCargo { get; set; }
        public string LIColour { get; set; }
        public string BuildupColour { get; set; }
        public string PREColour { get; set; }
        public string MANColour { get; set; }
        public string ClosedColour { get; set; }
        public string UWSColour { get; set; }
        public string FFMColour { get; set; }
        public string UCMColour { get; set; }
    }

    [KnownType(typeof(ExportFlightMonitoringModelGrid))]
    public class ExportFlightMonitoringModelGrid
    {
        public int SNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string ETD { get; set; }
        public string LPWeight { get; set; }
        public string ActualBuildUpWeight { get; set; }
        public string BuildCount { get; set; }
        public string DestinationAirportCode { get; set; }
        public string FWB { get; set; }
        public string RCS { get; set; }
        public string FOH { get; set; }
        public string UWSCutOffMinutes { get; set; }
        public string UWSSlaMet { get; set; }
        public string UWSTimeDifference { get; set; }
        public string TimeRemainingToDep { get; set; }
        public string GrossWeight { get; set; }
        public string AirlineName { get; set; }
        public string FWBSLATime { get; set; }
        public string FOHSLATime { get; set; }
        public string RCSSLATime { get; set; }
        public string UWSSLATime { get; set; }
        public string FlightStatus { get; set; }
        public string FBLSLAMet { get; set; }
        public string FBLAwbCount { get; set; }
        public string FBLGross { get; set; }
        public string FBLPcs { get; set; }
        public string LateCount { get; set; }
        public string LateWeightPct { get; set; }
        public string FWBRecdCount { get; set; }
        public string FWBRecdPct { get; set; }
        public string FWBSentCount { get; set; }
        public string FFMSLATime { get; set; }
        public string FFMSLAMet { get; set; }

    }
    [KnownType(typeof(ExportFlightMonitoringModelNestedGrid))]
    public class ExportFlightMonitoringModelNestedGrid
    {
        public int DailyFlightSno { get; set; }
        public string AWBNo { get; set; }
        public string Weight { get; set; }
        public string Pieces { get; set; }
        public string RCSTime { get; set; }
        public string FOHTime { get; set; }
        public string FWBTime { get; set; }
        public string BuildUPWeight { get; set; }
        public string RemaingWeight { get; set; }
        public string SHC { get; set; }
        public string Late { get; set; }

    }
    [KnownType(typeof(ExportFlightMonitoringChart))]
    public class ExportFlightMonitoringChart
    {
        public string GrossWeight { get; set; }
        public string UpdatedOn { get; set; }
    }
}
