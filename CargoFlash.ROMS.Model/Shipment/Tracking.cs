using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(Tracking))]
    public class Tracking
    {
        public int SNo { get; set; }
        public string AWB { get; set; }
        public string AWBSNo { get; set; }
        public string AWBDate { get; set; }
        public string SLI { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string TotalPieces { get; set; }
        public string GrossWt { get; set; }
        public string VolumeWeight { get; set; }
        public string NatureOfGoods { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string SHC { get; set; }
        public string SLICustomerType { get; set; }
        public string HAWB { get; set; }
        public string BOE { get; set; }
        public string IsImportAWB { get; set; }
        public string IsAgentBuildUp { get; set; }
        public string OnHold { get; set; }
        public string AcceptedPieces { get; set; }
        public string PlannedPieces { get; set; }
        public string DepartedPieces { get; set; }
        public string LyingPieces { get; set; }

        public string ReceivedPieces { get; set; }
        public string DOReceivedPieces { get; set; }
        public string BalancePieces { get; set; }
        public string DOBalancePieces { get; set; }
        public string Shipmenttype { get; set; }
        public string IsRepriced { get; set; }
        public string NumberOfReprice { get; set; }

        public List<TrackingTrans> TrackingTrans { get; set; }
    }
    [KnownType(typeof(TrackingTrans))]
    public class TrackingTrans
    {
        public int? SNo { get; set; }
        public int SLISNo { get; set; }
        public string SLINo { get; set; }
        public int TrackingStagesSNo { get; set; }
        public string StageName { get; set; }
        public string ModuleName { get; set; }
        public string StageDate { get; set; }
        public int Pieces { get; set; }
        public string Weight { get; set; }
        public string VolumeWeight { get; set; }
        public string Terminal { get; set; }
        public string EventDetails { get; set; }

        public string EventDateTime { get; set; }
        public string FlightInfo { get; set; }
        public string UserID { get; set; }
        public string BGColorCode { get; set; }
        public string ColorCode { get; set; }
        public bool IsPopup { get; set; }
        public string ActualMessage { get; set; }
        public string CurrentAirport { get; set; }

    }

    [KnownType(typeof(AWBRecord))]
    public class AWBRecord
    {
        public int? SNo { get; set; }
        public int AWBNo { get; set; }
        public string FlightNo { get; set; }
        public int FlightDate { get; set; }
        public string Carrier { get; set; }
        public string CityCode { get; set; }
        public string MessageType { get; set; }
        public int Status { get; set; }
        public string EventType { get; set; }
        public string Reason { get; set; }
        public string ActualMessage { get; set; }

        public string SenderID { get; set; }
        public string EventDate { get; set; }


    }
    // Changes by Vipin Kumar
    [KnownType(typeof(ULDRecord))]
    public class ULDRecord
    {
        [Required]
        public int? UldStockSNo { get; set; }
        public string TrackingType { get; set; }
    }
     //added by preeti deep
    [KnownType(typeof(POMailRecord))]
    public class POMailRecord
    {
        [Required]
        public int? POMailNo { get; set; }
        public string TrackingType { get; set; }
    }
    //string AWBSNo, string IsImport, int tstage
    [KnownType(typeof(LocationRecord))]
    public class LocationRecord
    {
        [Required]
        public int? AWBSNo { get; set; }
        public string IsImport { get; set; }
        public int? Tstage { get; set; }
    }
    [KnownType(typeof(FlightRecord))]
    public class FlightRecord
    {
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string TrackingType { get; set; }
        public List<FlightRecordTrans> FlightRecordTrans { get; set; }
    }

    [KnownType(typeof(FlightRecordTrans))]
    public class FlightRecordTrans
    {
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string TrackingType { get; set; }

       
        public int TrackingStagesSNo { get; set; }
        public string StageName { get; set; }
        public string Route { get; set; }
        public string StageDate { get; set; }
        public string FlightStation { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string WayBillCount { get; set; }
        public string EventDetails { get; set; }
        public string MessageType { get; set; }
        public string EventDateTime { get; set; }
        public string ULDCount { get; set; }
        public string CBM { get; set; }
        public string UserID { get; set; }
        public string BGColorCode { get; set; }
        public string ColorCode { get; set; }
        public bool IsPopup { get; set; }
        public string ActualMessage { get; set; }
        public string CurrentAirport { get; set; }

        public string ModuleName { get; set; }
    }
    // Ends
}
