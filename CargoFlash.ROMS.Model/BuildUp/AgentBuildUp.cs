using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.BuildUp
{
    [KnownType(typeof(AgentBuildUp))]
    public class AgentBuildUp
    {
        public int AirlineSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int AgentSNo { get; set; }
        public string OriginCity { get; set; }
        public int CreatedBy { get; set; }
    }

    [KnownType(typeof(AgentBuildUpTrans))]
    public class AgentBuildUpTrans
    {
        public string ULDNo { get; set; }
        public string AWBNo { get; set; }
        public string SLINo { get; set; }
        public string BOENo { get; set; }
        public string BuildPieces { get; set; }
        public string TotalPieces { get; set; }
        public string GrossWeight { get; set; }
        public string NatureOfGoods { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string SHC { get; set; }
        public string TotalGrossWeight { get; set; }
    }

    [KnownType(typeof(AgentBuildUpGrid))]
    public class AgentBuildUpGrid
    {
        public int SNo { get; set; }
        public string AirlineName { get; set; }
        public string FlightNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public string AgentName { get; set; }
        public string OriginCityCode { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UploadFrom { get; set; }
        public int TotalULD { get; set; }
        public int TotalShipment { get; set; }
        public string LotNo { get; set; }
    }
}
