using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.BuildUp
{
    [KnownType(typeof(Buildup))]
    public class Buildup
    {
        public Int64 AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public int FPSNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string OriginCity { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public int LoadPieces { get; set; }
        public decimal LoadGrossWeight { get; set; }
        public decimal LoadVol { get; set; }
        public string SPHC { get; set; }
        public int LIPieces { get; set; }
        //public string Commodity { get; set; }
        public string Plan { get; set; }
        public int FromTable { get; set; }
        public int FromTableSNo { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string ShipmentDetail { get; set; }
        public string WeightDetail { get; set; }
        public string LoadDetail { get; set; }
        public string AWBPieces { get; set; }
        public string AWBGrossWeight { get; set; }
        public string AWBVolumeWeight { get; set; }
        public string OffloadStage { get; set; }
        public Int64 MCBookingSNo { get; set; }
        public string ShipmentType { get; set; }
        public string Status { get; set; }
        public decimal CBM { get; set; }
        public decimal AWBCBM { get; set; }
        public decimal LoadCBM { get; set; }
        //public int IsChanged { get; set; } 
        public string ShipmentId { get; set; }
        public string Action { get; set; }
        public string IsPlanned { get; set; }
        public string Priority { get; set; }
    }

    [KnownType(typeof(LyingBuildup))]
    public class LyingBuildup
    {
        public Int64 SNo { get; set; }
        public Int64 AWBSNo { get; set; }
        public Int64 FPSNo { get; set; }
        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string OriginCity { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public int LoadPieces { get; set; }
        public decimal LoadGrossWeight { get; set; }
        public decimal LoadVol { get; set; }
        public string SPHC { get; set; }
        public int LIPieces { get; set; }
        //public string Commodity { get; set; }
        public string Plan { get; set; }
        public int FromTable { get; set; }
        public int FromTableSNo { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string ShipmentDetail { get; set; }
        public string WeightDetail { get; set; }
        public string LoadDetail { get; set; }
        public string AWBPieces { get; set; }
        public string AWBGrossWeight { get; set; }
        public string AWBVolumeWeight { get; set; }
        public string OffloadStage { get; set; }
        public Int64 MCBookingSNo { get; set; }
        public string ShipmentType { get; set; }
        public string Status { get; set; }
        public decimal CBM { get; set; }
        public decimal AWBCBM { get; set; }
        public decimal LoadCBM { get; set; }
        public string Priority { get; set; }
        //public Boolean IsChanged { get; set; }
    }

    [KnownType(typeof(BuildupULD))]
    public class BuildupULD
    {
        public Int32 ULDStockSNo { get; set; }
        public Int32 Pieces { get; set; }
        public decimal MaxVolumeWeight { get; set; }
        public decimal MaxGrossWeight { get; set; }
        public string IsUWS { get; set; }//added for AssignEquipmentBulk
        public decimal EmptyWeight { get; set; }
        public string ULDNo { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginCity { get; set; }
        public Int32 SNo { get; set; }
        public string Status { get; set; }
        public Int32 Shipments { get; set; }
        public string Total { get; set; }
        public string Used { get; set; }
        public string LastPoint { get; set; }
        public string Remove { get; set; }
        public string ULDWeight { get; set; }
        public string IsBUP { get; set; }
        public string ULDStatus { get; set; }
        public string ConnectingFlight { get; set; }
        public Int64 MCBookingSNo { get; set; }
        public string SHC { get; set; }
        public string ShipmentId { get; set; }
        public Boolean IsCart { get; set; }
        public string EquipmentSNo { get; set; }

        public string FlightStatus { get; set; }
    }


    [KnownType(typeof(BuildupOffLoadedULD))]
    public class BuildupOffLoadedULD
    {
        public Int32 ULDStockSNo { get; set; }
        public Int32 Pieces { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal GrossWeight { get; set; }
      
        public string ULDNo { get; set; }
        public string OriginAirportCode { get; set; }
        public string DestinationAirportCode { get; set; }
       public int DailyFlightSNo { get; set; }
    }




    [KnownType(typeof(BuildupOffloadedULDChild))]
    public class BuildupOffloadedULDChild
    {
        public Int32 AWBSno { get; set; }
        public string AwbNo { get; set; }
        public string AWBSector { get; set; }
        public Int32 ULDStockSNo { get; set; }
        public Int32 Pieces { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public string ULDNo { get; set; }

        public Int32 DailyFlightSno { get; set; }
       
       
        public string SPHC { get; set; }
     
    }



    [KnownType(typeof(BuildupULDChild))]
    public class BuildupULDChild
    {
        public Int32 AWBSno { get; set; }
        public string AwbNo { get; set; }

        public Int32 DailyFlightSno { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginCity { get; set; }
        public Int32 ULDStockSNo { get; set; }
        public Int32 Pieces { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public string SPHC { get; set; }
        public int FromTable { get; set; }
        public int FromTableSNo { get; set; }
        public int FromTableTotalPieces { get; set; }
        public string ShipmentDetail { get; set; }
        public string AWBPieces { get; set; }
        public string AWBGrossWeight { get; set; }
        public string AWBVolumeWeight { get; set; }
        public string OffloadStage { get; set; }
        public string AWBOffPoint { get; set; }
        public string ConnectingFlight { get; set; }
        public string ConnectingFlightSNo { get; set; }
        public Int64 MCBookingSNo { get; set; }
        public string ShipmentType { get; set; }
        public string Status { get; set; }
        public decimal CBM { get; set; }
        public decimal AWBCBM { get; set; }
        public decimal LoadCBM { get; set; }
        public string ShipmentId { get; set; }
        public string IsPlanned { get; set; }
        public string Priority { get; set; }
        public string Action { get; set; }
        public string HDQ { get; set; }
    }

    [KnownType(typeof(ProcessedAWB))]
    public class ProcessedAWB
    {
        [Order(1)]
        public string AWBSno { get; set; }
        [Order(2)]
        public string AWBNo { get; set; }
        [Order(3)]
        public string Pieces { get; set; }
        [Order(4)]
        public string GrossWeight { get; set; }
        [Order(5)]
        public string VolumeWeight { get; set; }
        [Order(6)]
        public string SPHC { get; set; }
        [Order(7)]
        public string ULDStockSNo { get; set; }
        [Order(8)]
        public string FromTable { get; set; }
        [Order(9)]
        public string FromTableSNo { get; set; }
        [Order(10)]
        public string AWBOffPoint { get; set; }
        [Order(11)]
        public string ConnectingFlight { get; set; }
        [Order(12)]
        public string DailyFlightSNo { get; set; }
        [Order(13)]
        public string FPSNo { get; set; }
        [Order(14)]
        public string ConnectingFlightSNo { get; set; }
        [Order(15)]
        public string MCBookingSNo { get; set; }
        [Order(16)]
        public decimal CBM { get; set; }
        //[Order(16)]
        // public Boolean IsChanged { get; set; }
    }

    [KnownType(typeof(ProcessedFlightInfo))]
    public class ProcessedFlightInfo
    {
        [Order(1)]
        public string DailyFlightSNo { get; set; }
        [Order(2)]
        public string RegistrationNo { get; set; }
    }

    [KnownType(typeof(ProcessedOffLoadedULD))]
    public class ProcessedOffLoadedULD
    {
        [Order(1)]
        public int UldStockSno { get; set; }

        [Order(2)]
        public string DailyFlightSNo { get; set; }


    }


    [KnownType(typeof(ProcessedULDInfo))]
    public class ProcessedULDInfo
    {
        [Order(1)]
        public string ULDStockSNo { get; set; }
        [Order(2)]
        public string OffloadPoint { get; set; }
        [Order(3)]
        public string TotalShipment { get; set; }
        [Order(3)]
        public string IsProcessed { get; set; }
    }

    [KnownType(typeof(ProcessedULDShipment))]
    public class ProcessedULDShipment
    {
        [Order(1)]
        public string ULDStockSNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string Pieces { get; set; }
        [Order(4)]
        public string GrossWeight { get; set; }
        [Order(5)]
        public string VolumeWeight { get; set; }
        [Order(6)]
        public string AWBOffPoint { get; set; }
        [Order(7)]
        public string ConnectingFlight { get; set; }
        [Order(8)]
        public string MCBookingSNo { get; set; }
        [Order(9)]
        public decimal CBM { get; set; }
        //[Order(9)]
        //public Boolean IsChanged { get; set; }

    }

    [KnownType(typeof(ProcessedShipmentForBuildUp))]
    public class ProcessedShipmentForBuildUp
    {
        [Order(1)]
        public string AWBSNo { get; set; }
    }

    [KnownType(typeof(ULDDetails))]
    public class ULDDetails
    {
        public string ULDStockSNo { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Location { get; set; }
        public string Build { get; set; }
        public string LocationSNo { get; set; }
        public string BuildSNo { get; set; }
        public bool NotToBeManifested { get; set; }
        public string ScaleWeight { get; set; }
        public string LoadIndicationSNo { get; set; }
        public string ULDContourSNo { get; set; }
        public int? Height { get; set; }
        public int MeasurementUnit { get; set; }
        public string Remarks { get; set; }
        public int? BUPTypeSNo { get; set; }
        public int? BaseULDSNo { get; set; }
        public string OtherPallets { get; set; }
        public string LoadCode { get; set; }
        public string LoadIndicator { get; set; }
        public string AbbrCode { get; set; }
        public bool IsOverhangPallet { get; set; }
        public bool IsTeamPersonnel { get; set; }
        public int LoadCodeSNo { get; set; }
        public string ULDBuildUpLocation { get; set; }
        public string IsShowInFFM { get; set; }
        public int EquipmentID { get; set; }
    }

    [KnownType(typeof(ULDConsumables))]
    public class ULDConsumables
    {
        [Order(1)]
        public string ULDStockSNo { get; set; }
        [Order(2)]
        public string ConsumablesSNo { get; set; }
        [Order(3)]
        public string Quantity { get; set; }
    }

    [KnownType(typeof(ULDBuildUpOverhangPallet))]
    public class ULDBuildUpOverhangPallet
    {
        public int SNo { get; set; }
        public int ULDStockDetailsSNo { get; set; }
        public Boolean IsOverhangPallet { get; set; }
        public int CutOffHeight { get; set; }
        public int CutOffMesUnit { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(ULDBuildUpOverhangTrans))]
    public class ULDBuildUpOverhangTrans
    {
        public int SNo { get; set; }
        public int OverhangPalletSNo { get; set; }
        public int? OverhangDirection { get; set; }
        public int? Width { get; set; }
        public int? WidthMesUnit { get; set; }
        public int? OverhangType { get; set; }
        public string OtherInfo { get; set; }
        public bool IsFFMRemarks { get; set; }
    }

    //added for AssignEquipmentBulk
    [KnownType(typeof(BuildUpBulkAssignEquipment))]
    public class BuildUpBulkAssignEquipment
    {
        public string SNo { get; set; }
        public string DailyFlightSNo { get; set; }
        public string AWBNo { get; set; }
        public string HdnAWBNo { get; set; }
        public string Text_AWBNo { get; set; }

        public string Pieces { get; set; }
        //   public string TotalPieces { get; set; }
        public string EquipmentNo { get; set; }
        public string HdnEquipmentNo { get; set; }
        public string Text_EquipmentNo { get; set; }
    }
    [KnownType(typeof(BuildUpViewBulkAssignEquipment))]
    public class BuildUpViewBulkAssignEquipment
    {
        public string SNo { get; set; }
        public string DailyFlightSNo { get; set; }
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
    [KnownType(typeof(BuildUpBulkAssignEquipmentScaleWeight))]
    public class BuildUpBulkAssignEquipmentScaleWeight
    {
        public string EquipmentSNo { get; set; }
        public string ScaleWeight { get; set; }
        public string OffPoint { get; set; }
    }


    [KnownType(typeof(POMailDNDetails))]
    public class POMailDNDetails
    {
        public bool isSelect { get; set; }
        public string GroupFlightSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int MCBookingSNo { get; set; }
        public int ULDStockSNo { get; set; }
        public int DNSNo { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string MailCategory { get; set; }
        public string SubCategory { get; set; }
        public int ReceptacleNumber { get; set; }
        public decimal ReceptacleWeight { get; set; }
        public bool Planned { get; set; }
        public int DNNo { get; set; }

    }

    [KnownType(typeof(BuildUpFlightDetails))]
    public class BuildUpFlightDetails
    {
        public string DailyFlightSNo { get; set; }
        public string City { get; set; }
        public int AirlineSNo { get; set; }
        public int UserSNo { get; set; }
        public string FlightDate { get; set; }
        public int AirportSNo { get; set; }

    }

    public class WebFormBuildUpRequest
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string IsSubModule { get; set; }
    }
    public class WebFormBuildWebFormRequest
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string DailyFlightSNo { get; set; }
    }

    public class GetGridDataModel
    {
        public string DailyFlightSNo { get; set; }
    }

    public class WebFormBuildUpRequestLyingListGrid
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string AWBNo { get; set; }
        public string LoggedInCity { get; set; }
        public string DailyFlightSNo { get; set; }

    }

    public class GetLyingListGridDataModel
    {
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AWBNo { get; set; }
        public string LoggedInCity { get; set; }
        public string DailyFlightSNo { get; set; }


    }





}