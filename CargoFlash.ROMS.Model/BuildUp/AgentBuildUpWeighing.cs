using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.BuildUp
{
    [KnownType(typeof(AgentBuildUpWeighingGrid))]
    public class AgentBuildUpWeighingGrid
    {
        public int SNo { get; set; }
        public string AirlineName { get; set; }
        public string FlightNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public string AgentName { get; set; }
        public string OriginCityCode { get; set; }
        public string WeighingStatus { get; set; }
        public string WeighingBy { get; set; }
        public Nullable<DateTime> WeighingOn { get; set; }
        public string LotNo { get; set; }
        public string ULDStatus { get; set; }
        public string EqptAssignedtoBulk { get; set; }
    }

    [KnownType(typeof(AgentBuildUpWeighing))]
    public class AgentBuildUpWeighing
    {
        public int ULDStockSNo { get; set; }
        public decimal BuildUpWeight { get; set; }
        public decimal GetWeight { get; set; }
        public decimal TareWeight { get; set; }
        public decimal ActualWeight { get; set; }
        public int DailyFlightSNo { get; set; }
        public string ULDContour { get; set; }
        public string Equipment { get; set; }
        public string ULDOffPoint { get; set; }
    }
    [KnownType(typeof(AgentBuildUpBulkAssignEquipment))]
    public class AgentBuildUpBulkAssignEquipment
    {
        public string SNo { get; set; }
        public string AgentBuildUpSNo { get; set; }
        public string AWBNo { get; set; }
        public string HdnAWBNo { get; set; }
        public string Text_AWBNo { get; set; }
        public string Pieces { get; set; }
        public string TotalPieces { get; set; }
        public string EquipmentNo { get; set; }
        public string HdnEquipmentNo { get; set; }
        public string Text_EquipmentNo { get; set; }
    }
    [KnownType(typeof(AgentBuildUpBulkAssignEquipmentScaleWeight))]
    public class AgentBuildUpBulkAssignEquipmentScaleWeight
    {
        public string EquipmentSNo { get; set; }
        public string ScaleWeight { get; set; }
        public string OffPoint { get; set; }
    }

    [KnownType(typeof(AgentBuildUpViewBulkAssignEquipment))]
    public class AgentBuildUpViewBulkAssignEquipment
    {
        public string SNo { get; set; }
        public string AgentBuildUpSNo { get; set; }
        public string AWBNo { get; set; }
        public string HdnAWBNo { get; set; }
        public string Text_AWBNo { get; set; }
        public string Pieces { get; set; }
        public string TotalPieces { get; set; }
        public string EquipmentNo { get; set; }
        public string HdnEquipmentNo { get; set; }
        public string Text_EquipmentNo { get; set; }
        public string ScaleWeight { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OffPoint { get; set; }
    }
}
