using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(SLIAWBInfoforGrid))]
    public class SLIAWBInfoforGrid
    {
        [Order(1)]
        public long? SNo { get; set; }
        [Order(2)]
        public int? CustomerType { get; set; }
        [Order(3)]
        public Nullable<byte> BookingType { get; set; }
        [Order(4)]
        public int? MovementTypeSNo { get; set; }
        [Order(5)]
        public string AWBNo { get; set; }
        [Order(6)]
        public string HAWBNo { get; set; }
        [Order(7)]
        public Nullable<int> DestinationAirportSNo { get; set; }
        [Order(8)]
        public int? AirlineSNo { get; set; }
        [Order(9)]
        public int? DestinationCitySNo { get; set; }
        [Order(10)]
        public string RoutingCity { get; set; }
        [Order(11)]
        public Nullable<int> OfficeSNo { get; set; }
        [Order(12)]
        public int? CurrencySNo { get; set; }
        [Order(13)]
        public string DeclaredCarriagevalue { get; set; }
        [Order(14)]
        public string DeclaredCustomValue { get; set; }
        [Order(15)]
        public string ChargeCode { get; set; }
        [Order(16)]
        public double? VolumeWeight { get; set; }
        [Order(17)]
        public string BOENo { get; set; }
        [Order(18)]
        public string IDNumber { get; set; }
        [Order(19)]
        public bool IDRetained { get; set; }
        [Order(20)]
        public string SPHCCode { get; set; }
        [Order(21)]
        public int? CreatedBy { get; set; }
        [Order(22)]
        public DateTime? CreatedOn { get; set; }
        [Order(23)]
        public int? UpdatedBy { get; set; }
        [Order(24)]
        public DateTime? UpdatedOn { get; set; }
        [Order(25)]
        public Nullable<long> AccountSNo { get; set; }
        [Order(26)]
        public string Shipper_Agent { get; set; }
        [Order(27)]
        public string DestinationCity { get; set; }
        [Order(28)]
        public string Airline { get; set; }
        [Order(29)]
        public int? RoutingCitySNo { get; set; }
        [Order(30)]
        public string SPHCCodeSNo { get; set; }
        [Order(31)]
        public string AgentName { get; set; }
        [Order(32)]
        public string BookingTypeValue { get; set; }
        [Order(33)]
        public string ProcessStatus { get; set; }
        [Order(34)]
        public string SLINo { get; set; }
        [Order(35)]
        public bool isBup { get; set; }
        [Order(36)]
        public bool IsFinalSLI { get; set; }
        [Order(37)]
        public bool IsProcessed { get; set; }
        [Order(38)]
        public string AirportCode { get; set; }
        [Order(39)]
        public bool SLIFlag { get; set; }
        [Order(40)]
        public string GRNNo { get; set; }
        [Order(41)]
        public string StartTemperature { get; set; }
        [Order(42)]
        public string EndTemperature { get; set; }
        [Order(43)]
        public bool? isBOEVerified { get; set; }
        [Order(44)]
        public bool isCSD { get; set; }
        //[Order(45)]
        //public string SHCStatement { get; set; }
        [Order(46)]
        public string BOEDate { get; set; }
        [Order(47)]
        public System.DateTime SLIDate { get; set; }
        [Order(48)]
        public string BuildUpType { get; set; }
        [Order(49)]
        public string RefSLI { get; set; }
    }

    [KnownType(typeof(SLIAWBInfo))]
    public class SLIAWBInfo
    {
        [Order(1)]
        public long? SNo { get; set; }
        [Order(2)]
        public int? CustomerType { get; set; }
        [Order(3)]
        public Nullable<byte> BookingType { get; set; }
        [Order(4)]
        public int? MovementTypeSNo { get; set; }
        [Order(5)]
        public string AWBNo { get; set; }
        [Order(6)]
        public string HAWBNo { get; set; }
        [Order(7)]
        public Nullable<int> DestinationAirportSNo { get; set; }
        [Order(8)]
        public int? AirlineSNo { get; set; }
        [Order(9)]
        public int? DestinationCitySNo { get; set; }
        [Order(10)]
        public string RoutingCity { get; set; }
        [Order(11)]
        public Nullable<int> OfficeSNo { get; set; }
        [Order(12)]
        public int? CurrencySNo { get; set; }
        [Order(13)]
        public string DeclaredCarriagevalue { get; set; }
        [Order(14)]
        public string DeclaredCustomValue { get; set; }
        [Order(15)]
        public string ChargeCode { get; set; }
        [Order(16)]
        public double? VolumeWeight { get; set; }
        [Order(17)]
        public string BOENo { get; set; }
        [Order(18)]
        public string IDNumber { get; set; }
        [Order(19)]
        public bool IDRetained { get; set; }
        [Order(20)]
        public string SPHCCode { get; set; }
        [Order(21)]
        public int? CreatedBy { get; set; }
        [Order(22)]
        public DateTime? CreatedOn { get; set; }
        [Order(23)]
        public int? UpdatedBy { get; set; }
        [Order(24)]
        public DateTime? UpdatedOn { get; set; }
        [Order(25)]
        public Nullable<long> AccountSNo { get; set; }
        [Order(26)]
        public string Shipper_Agent { get; set; }
        [Order(27)]
        public string DestinationCity { get; set; }
        [Order(28)]
        public string Airline { get; set; }
        [Order(29)]
        public int? RoutingCitySNo { get; set; }
        [Order(30)]
        public string SPHCCodeSNo { get; set; }
        [Order(31)]
        public string AgentName { get; set; }
        [Order(32)]
        public string BookingTypeValue { get; set; }
        [Order(33)]
        public string ProcessStatus { get; set; }
        [Order(34)]
        public string SLINo { get; set; }
        [Order(35)]
        public bool isBup { get; set; }
        [Order(36)]
        public bool IsFinalSLI { get; set; }
        [Order(37)]
        public bool IsProcessed { get; set; }
        [Order(38)]
        public string AirportCode { get; set; }
        [Order(39)]
        public bool SLIFlag { get; set; }
        [Order(40)]
        public string GRNNo { get; set; }
        [Order(41)]
        public string StartTemperature { get; set; }
        [Order(42)]
        public string EndTemperature { get; set; }
        [Order(43)]
        public bool? isBOEVerified { get; set; }
        [Order(44)]
        public bool isCSD { get; set; }
        //[Order(45)]
        //public string SHCStatement { get; set; }
        [Order(46)]
        public string BOEDate { get; set; }
        [Order(47)]
        public string HAWBCount { get; set; }
        [Order(47)]
        public string RefSLINo { get; set; }

    }

    [KnownType(typeof(SLIDimensions))]
    public class SLIDimensions
    {
        public string SLISPHCCode { get; set; }
        public string StartTemperature { get; set; }
        public string EndTemperature { get; set; }
        public string Capturedtemp { get; set; }
        [Order(1)]
        public string SLISNo { get; set; }
        [Order(2)]
        public int PackingTypeSNo { get; set; }
        [Order(3)]
        public string Description { get; set; }
        [Order(4)]
        public string Height { get; set; }
        [Order(5)]
        public string Length { get; set; }
        [Order(6)]
        public string Width { get; set; }
        [Order(7)]
        public string Pieces { get; set; }
        [Order(8)]
        public string GrossWeight { get; set; }
        [Order(9)]
        public string VolumeWeight { get; set; }
        [Order(10)]
        public string CBM { get; set; }
        [Order(11)]
        public string Unit { get; set; }
        [Order(12)]
        public bool IsCMS { get; set; }
        [Order(13)]
        public string SLINo { get; set; }
        [Order(14)]
        public string CapturedWeight { get; set; }
        [Order(15)]
        public string TareWeight { get; set; }
        [Order(16)]
        public int RowNo { get; set; }

    }

    [KnownType(typeof(SLIULDDimensions))]
    public class SLIULDDimensions
    {
        public string ULDSPHCCode { get; set; }
        public string ULDStartTemperature { get; set; }
        public string ULDEndTemperature { get; set; }
        public string ULDCapturedtemp { get; set; }
        [Order(1)]
        public string SLISNo { get; set; }
        [Order(2)]
        public int PackingTypeSNo { get; set; }
        [Order(3)]
        public string GrossWeight { get; set; }
        [Order(4)]
        public string ULDTypeSNo { get; set; }
        [Order(5)]
        public string ULDNo { get; set; }
        [Order(6)]
        public string OwnerCode { get; set; }
        [Order(7)]
        public string CountofBUP { get; set; }
        [Order(8)]
        public string SLACPieces { get; set; }
        [Order(9)]
        public string UldPieces { get; set; }
        [Order(10)]
        public string IsCMS { get; set; }
        [Order(11)]
        public string ULDLength { get; set; }
        [Order(12)]
        public string ULDWidth { get; set; }
        [Order(13)]
        public string ULDHeight { get; set; }
        [Order(14)]
        public string ULDVolWt { get; set; }
        [Order(15)]
        public string ULDCBM { get; set; }
        [Order(16)]
        public string ULDNoSNo { get; set; }
        [Order(17)]
        public string UldoldPieces { get; set; }
        [Order(18)]
        public string SLINo { get; set; }
        [Order(19)]
        public bool isOverhang { get; set; }
        [Order(20)]
        public string UCapturedWeight { get; set; }
        [Order(21)]
        public string UTareWeight { get; set; }
        [Order(22)]
        public string CountourCode { get; set; }



    }


    [KnownType(typeof(SLIChargesHeader))]
    public class SLIChargesHeader
    {
        [Order(1)]
        public string SLISNo { get; set; }
        [Order(2)]
        public int HandlingChargeMasterSNo { get; set; }
        [Order(3)]
        public decimal PrimaryValue { get; set; }
        [Order(4)]
        public decimal SecondaryValue { get; set; }

    }
    [KnownType(typeof(SLIUnloading))]
    public class SLIUnloading
    {
        [Order(1)]
        public string SLISNo { get; set; }
        [Order(2)]
        public int VerifiedType { get; set; }
        [Order(3)]
        public int Pieces { get; set; }
        [Order(4)]
        public bool Verified { get; set; }
    }

    [KnownType(typeof(SLIShipperInformation))]
    public class SLIShipperInformation
    {
        [Order(1)]
        public string ShipperAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string ShipperName
        {
            get;
            set;
        }
        [Order(3)]
        public string ShipperName1
        {
            get;
            set;
        }
        [Order(4)]
        public string ShipperStreet
        {
            get;
            set;
        }
        [Order(5)]
        public string ShipperStreet1
        {
            get;
            set;
        }
        [Order(6)]
        public string ShipperLocation
        {
            get;
            set;
        }
        [Order(7)]
        public string ShipperState
        {
            get;
            set;
        }
        [Order(8)]
        public string ShipperPostalCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ShipperCity
        {
            get;
            set;
        }
        [Order(10)]
        public string ShipperCountryCode
        {
            get;
            set;
        }
        [Order(11)]
        public string ShipperMobile
        {
            get;
            set;
        }
        [Order(12)]
        public string Telex
        {
            get;
            set;
        }

        [Order(13)]
        public string ShipperEMail
        {
            get;
            set;
        }

    }

    [KnownType(typeof(SLIConsigneeInformation))]
    public class SLIConsigneeInformation
    {
        [Order(1)]
        public string ConsigneeAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string ConsigneeName
        {
            get;
            set;
        }
        [Order(3)]
        public string ConsigneeName1
        {
            get;
            set;
        }
        [Order(4)]
        public string ConsigneeStreet
        {
            get;
            set;
        }
        [Order(5)]
        public string ConsigneeStreet1
        {
            get;
            set;
        }
        [Order(6)]
        public string ConsigneeLocation
        {
            get;
            set;
        }
        [Order(6)]
        public string ConsigneeState
        {
            get;
            set;
        }
        [Order(8)]
        public string ConsigneePostalCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ConsigneeCity
        {
            get;
            set;
        }
        [Order(10)]
        public string ConsigneeCountryCode
        {
            get;
            set;
        }
        [Order(11)]
        public string ConsigneeMobile
        {
            get;
            set;
        }
        [Order(12)]
        public string ConsigneeTelex
        {
            get;
            set;
        }
        [Order(13)]
        public string ConsigneeEMail
        {
            get;
            set;
        }

    }


    [KnownType(typeof(ULDDetails))]
    public class ULDDetails
    {
        public string ULDInfoHeight { get; set; }
        public string MeasurementUnit { get; set; }
        public string Remarks { get; set; }
        public string LoadCode { get; set; }
        public string LoadIndicator { get; set; }
        public string AbbrCode { get; set; }
        public string UldBupType { get; set; }
        public string UldBasePallet { get; set; }
        public string ULDContourSNo { get; set; }
        public string Text_AbbrCode { get; set; }
        public string Text_LoadCode { get; set; }
        public string Text_LoadIndicator { get; set; }
        public string Text_MeasurementUnit { get; set; }
        public string Text_UldBasePallet { get; set; }
        public string Text_UldBupType { get; set; }
        public string ULDOtherPallets { get; set; }
        public string _tempHeight { get; set; }

        //public string ULDStockSNo { get; set; }
        //public string StartTime { get; set; }
        //public string EndTime { get; set; }
        //public string Location { get; set; }
        //public string Build { get; set; }
        //public string LocationSNo { get; set; }
        //public string BuildSNo { get; set; }
        //public bool NotToBeManifested { get; set; }
        //public string ScaleWeight { get; set; }
        //public string LoadIndicationSNo { get; set; }
        //public int? BaseULDSNo { get; set; }
        //public bool IsOverhangPallet { get; set; }
        //public bool IsTeamPersonnel { get; set; }
        //public int LoadCodeSNo { get; set; }
        //public string ULDBuildUpLocation { get; set; }
    }

    [KnownType(typeof(SLIOverhangPallet))]
    public class SLIOverhangPallet
    {
        public string SNo { get; set; }
        public string ULDStockDetailsSNo { get; set; }
        public Boolean IsOverhangPallet { get; set; }
        public string CutOffHeight { get; set; }
        public string CutOffMesUnit { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(SLIOverhangTrans))]
    public class SLIOverhangTrans
    {
        public string SNo { get; set; }
        public string OverhangPalletSNo { get; set; }
        public string OverhangDirection { get; set; }
        public string Width { get; set; }
        public string WidthMesUnit { get; set; }
        public string OverhangType { get; set; }
        public string OtherInfo { get; set; }
    }
    [KnownType(typeof(SLISHCTemp))]
    public class SLISHCTemp
    {
        public string SLISNo { get; set; }
        public string TDSHCCode { get; set; }
        public string StartTemp { get; set; }
        public string EndTemp { get; set; }
        public string Piece { get; set; }
        public string UpdatedBy { get; set; }
        public string SLINo { get; set; }
    }
    [KnownType(typeof(AWBLocation))]
    public class SLIAWBLocation
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBNo { get; set; }

        [Order(3)]
        public string ScannedPieces { get; set; }

        [Order(4)]
        public string LocationSNo { get; set; }

        [Order(5)]
        public string SLISNo { get; set; }

        [Order(6)]
        public string SLINo { get; set; }

        [Order(7)]
        public string HAWBNo { get; set; }

        [Order(8)]
        public string StartTemp { get; set; }

        [Order(9)]
        public string EndTemp { get; set; }
        [Order(10)]
        public string ConsumablesSno { get; set; }


    }

    [KnownType(typeof(ULDLocation))]
    public class SLIULDLocation
    {
        [Order(1)]
        public int RowNo { get; set; }
        [Order(2)]
        public string ULDSNo { get; set; }
        [Order(3)]
        public string LocationSno { get; set; }
        [Order(4)]
        public string ConsumablesSno { get; set; }
    }

    [KnownType(typeof(SLIEquipment))]
    public class SLIEquipment
    {
        [Order(1)]
        public string EqType { get; set; }
        [Order(2)]
        public string Equipment { get; set; }
        [Order(3)]
        public string EqNo { get; set; }
        [Order(4)]
        public int Count { get; set; }
        [Order(5)]
        public decimal TareWt { get; set; }
        [Order(6)]
        public int UpdatedBy { get; set; }
        [Order(7)]
        public string ESLINo { get; set; }
        [Order(8)]
        public string ESLISNo { get; set; }
        [Order(9)]
        public string EULDNo { get; set; }
        [Order(10)]
        public string LooseSNo { get; set; }


    }
    [KnownType(typeof(CancellationArray))]
    public class CancellationArray
    {
        [Order(1)]
        public string SLISNo { get; set; }
        [Order(2)]
        public int VerifiedType { get; set; }
        [Order(3)]
        public bool Verified { get; set; }
        [Order(4)]
        public int UpdatedBy { get; set; }
    }
}
