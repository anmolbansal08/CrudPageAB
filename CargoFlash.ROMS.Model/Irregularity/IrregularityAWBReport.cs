using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(IrregularityAWBReport))]
    public class IrregularityAWBReport
    {
        public Int32 SNo { get; set; }
        public string IncidentCategory { get; set; }
        public string ReportingStation { get; set; }
        public string AWBNo { get; set; }
        public string IrregularityStatus { get; set; }
        public string UpdatedUser { get; set; }
        public string CreatedUser { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginAirportCode { get; set; }
        public string DestinationAirportCode { get; set; }
        public string Commodities { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
    }


    public class IrregularityBindAppendGrid
    {

        public string Type { get; set; }
    }



}
