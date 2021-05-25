using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(InboundFlight))]
    public class InboundFlight
    {
        public int SNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string GroupFlightSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public String BoardingPoint { get; set; }
        public String OffPoint { get; set; }
        public String Sector { get; set; }

        public String Route { get; set; }
        public String EndPoint { get; set; }
        public String TransitFlight { get; set; }
        public String FlightNo { get; set; }
        public DateTime FlightDate { get; set; }
        public String ATD { get; set; }
        public String ETA1 { get; set; }
        public System.DateTime? ETA { get; set; }
        public String ETD { get; set; }
        //public DateTime? ATA { get; set; }
        public String ATA { get; set; }
        public String FlightType { get; set; }
        public String Equipment { get; set; }
        public String AirCraftRegnNo { get; set; }
        public String MVT { get; set; }
        public String FFM { get; set; }
        public bool IsFFM { get; set; }
        public String CPM { get; set; }
        public String FWB { get; set; }
        public String FHL { get; set; }
        //public int Pieces { get; set; }
        //public decimal GrossWt { get; set; }
        public String TotalAWBCount { get; set; }
        public String TotalCourierCount { get; set; }
        public String TotalPOMailCount { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public String ULDCount { get; set; }
        public String SHCDGR { get; set; }
        public string PIL { get; set; }
        public String QRT { get; set; }
        public String MCT { get; set; }
        public String ConnectingFlights { get; set; }
        public String Status { get; set; }
        public int IsArrivalStatus { get; set; }
        public int FCReport { get; set; }
        public int IsFlightClosed { get; set; }
        public String PomEquipment { get; set; }
        public String POMULDCount { get; set; }

    }

    [KnownType(typeof(WMSFlightArrivalShipmentGridData))]
    public class WMSFlightArrivalShipmentGridData
    {
        
        public string ProcessStatus { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string GroupFlightSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBDate { get; set; }
        public string CheckIn { get; set; }
        public string ULDNo { get; set; }
        public string ULDType { get; set; }
        public string UldArrived { get; set; }
        public string NatureOfGoods { get; set; }
        public string SPHC { get; set; }
        public string SPHCPriority { get; set; }
        public string ReceivedPcs { get; set; }
        public string ShipmentOriginAirportCode { get; set; }
        public string ShipmentDestinationAirportCode { get; set; }
        public string ShipmentOriginCityCode { get; set; }
        public string ShipmentDestinationCityCode { get; set; }
        public string FlightOriginAirportCode { get; set; }
        public string FlightDestinationAirportCode { get; set; }
        public string FlightOriginCityCode { get; set; }
        public string FlightDestinationCityCode { get; set; }
        public string GrossWeight { get; set; }
        public decimal? VolumeWeight { get; set; }
        public decimal? ChWeight { get; set; }
        public int Pieces { get; set; }
        public string FFMPieces { get; set; }
        public string TotalFFMPieces { get; set; }
        public string OSI { get; set; }
        public string COR { get; set; }
        public int RcdPieces { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal? AccGrWt { get; set; }
        public decimal? AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal? FBLWt { get; set; }// Added by RH 12-08-15
        public decimal? FWBWt { get; set; }// Added by RH 12-08-15
        public decimal? RCSWt { get; set; }// Added by RH 12-08-15
        public string BUP { get; set; }
        public string TotalPieces { get; set; }
        public decimal? TotalGrossWeight { get; set; }
        public string Transist { get; set; }
        public string CleanLoad { get; set; }
        public string BreakDownStart { get; set; }
        public string BreakDownEnd { get; set; }
        public string LoadDetails { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public int AWBSNo { get; set; }
        public string Remarks { get; set; }
        public string PosNo { get; set; }
        public int IsBUP { get; set; }
        public int IsDocument { get; set; }
        public int LocationStatus { get; set; }
        public decimal? ActualGrossWt { get; set; }
        public decimal? ActualVolumeWt { get; set; }
        public string Priority { get; set; }
        public int IsDeliveryOrder { get; set; }
        public int ArrivalStatus { get; set; }
        public int IsThroughULD { get; set; }
        public int IsDamaged { get; set; }
        public int Isamended { get; set; }
        public int Isamendedvalue { get; set; }
        public bool IsDisabled { get; set; }
        //Create IsLocationMandatoryOnImport property 
        public int IsLocationMandatoryOnImport { get; set; }
        //Create IsLocationMandatoryOnImport property 

        public string IsInternational { get; set; }
        public string DestinationAirportCode { get; set; }

        public string DisabledText { get; set; }
        public int IsRushHandling { get; set; }
        public int POMailSNo { get; set; }
        public string ShipmentType { get; set; }
        public int POMArrivedShipmentSNo { get; set; }
        public int IsDO { get; set; }
        public int IsNoShow { get; set; }
        public int IsNotBooked { get; set; }
        public int IsManual { get; set; }
    }
    [KnownType(typeof(WMSFlightArrivalStopShipmentGridData))]
    public class WMSFlightArrivalStopShipmentGridData
    {

        public string ProcessStatus { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBDate { get; set; }
        public string CheckIn { get; set; }
        public string ULDNo { get; set; }
        public string ULDType { get; set; }
        public string UldArrived { get; set; }
        public string NatureOfGoods { get; set; }
        public string SPHC { get; set; }
        public string SPHCPriority { get; set; }
        public string ReceivedPcs { get; set; }
        public string ShipmentOriginAirportCode { get; set; }
        public string ShipmentDestinationAirportCode { get; set; }
        public string ShipmentOriginCityCode { get; set; }
        public string ShipmentDestinationCityCode { get; set; }
        public string FlightOriginAirportCode { get; set; }
        public string FlightDestinationAirportCode { get; set; }
        public string FlightOriginCityCode { get; set; }
        public string FlightDestinationCityCode { get; set; }
        public string GrossWeight { get; set; }
        public decimal? VolumeWeight { get; set; }
        public decimal? CBMWeight { get; set; }

        public decimal? ChWeight { get; set; }
        public int Pieces { get; set; }
        public string FFMPieces { get; set; }
        public string TotalFFMPieces { get; set; }
        public string OSI { get; set; }
        public string COR { get; set; }
        public int RcdPieces { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal? AccGrWt { get; set; }
        public decimal? AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal? FBLWt { get; set; }// Added by RH 12-08-15
        public decimal? FWBWt { get; set; }// Added by RH 12-08-15
        public decimal? RCSWt { get; set; }// Added by RH 12-08-15
        public string BUP { get; set; }
        public string TotalPieces { get; set; }
        public decimal? TotalGrossWeight { get; set; }
        public string Transist { get; set; }
        public string CleanLoad { get; set; }
        public string BreakDownStart { get; set; }
        public string BreakDownEnd { get; set; }
        public string LoadDetails { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public int AWBSNo { get; set; }
        public string Remarks { get; set; }
        public int IsBUP { get; set; }
        public int IsDocument { get; set; }
        public int LocationStatus { get; set; }
        public decimal? ActualGrossWt { get; set; }
        public string Priority { get; set; }
        public string Route { get; set; }
        public int IsDisplay { get; set; }
        public int ULDStockSNo { get; set; }

        public int OFLDPieces { get; set; }
        public decimal? OFLDGrossWeight { get; set; }
        public decimal? OFLDVolumeWeight { get; set; }
        public decimal? OFLDCBM { get; set; }

        public decimal? AviOFLDGrossWeight { get; set; }
        public decimal? AviOFLDVolumeWeight { get; set; }
        public decimal? AviOFLDCBM { get; set; }
        public int MoveToSegregation { get; set; }
        public int AWBCount { get; set; }

        public int TotalAWBPieces { get; set; }
    }
    [KnownType(typeof(WMSFlightArrivalULDGridData))]
    public class WMSFlightArrivalULDGridData
    {
        public Int64 DailyFlightSNo { get; set; }//Added By Manoj Kumar on 3.7.2015
        public string ULDNo { get; set; }
        public string BUP { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
        public string Transit { get; set; }
        public string CleanLoad { get; set; }
        public string Position { get; set; }
        public string ThroughULD { get; set; }
        public string SPHC { get; set; }
        public string BreakDownStart { get; set; }
        public string BreakDownEnd { get; set; }

    }

    [KnownType(typeof(InboundFlightInformation))]
    public class InboundFlightInformation
    {
        public Int64 FFMFlightMasterSNo { get; set; }
        public String AWBNo { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public String FinalDestination { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWt { get; set; }
        public decimal VolumeWt { get; set; }
        public String BuildDetails { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public String ULDNo { get; set; }
        public String SpaceAllocation { get; set; }
        public String Position { get; set; }
        public String QRT { get; set; }
        public String MCT { get; set; }
        public String Commodity { get; set; }
        public String SHCDGR { get; set; }
        public String ConnectingFlights { get; set; }
        public String ConnectingFlightDate { get; set; }
        public String ETD { get; set; }
        public String CNXNFlightType { get; set; }
        public String CNXNEquipment { get; set; }
        public String DestCityRules { get; set; }
        public String AgentName { get; set; }
    }

    [KnownType(typeof(InboundFlightULDInformation))]
    public class InboundFlightULDInformation
    {
        public Int64 ULDStockSNo { get; set; }
        public String ULDNo { get; set; }
        public decimal Weight { get; set; }
        public String Height { get; set; }
        public String ClassType { get; set; }
        public String ContourCode { get; set; }
        public String SHCDGR { get; set; }
        public String Position { get; set; }
        public String ULDLoadingCode { get; set; }
    }

    [KnownType(typeof(InboundFlightULDInfo))]
    public class InboundFlightULDInfo
    {
        public Int64 ULDStockSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public String ULDNo { get; set; }
        public decimal BuildUpWeight { get; set; }
        public string AWBNo { get; set; }
        public int Pcs { get; set; }
        public decimal GrWt { get; set; }
        public string PartLoaded { get; set; }
        public String SHCDGR { get; set; }
    }

    [KnownType(typeof(FAULDLocation))]
    public class FAULDLocation
    {
        public int SNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public string ULDNo { get; set; }
        public string BUP { get; set; }
        public int HdnMovableLocation { get; set; }
        public string MovableLocation { get; set; }
        public int HdnLocation { get; set; }
        public string Location { get; set; }
        //public int HdnReturnTo { get; set; }
        //public string ReturnTo { get; set; }
        //public int HdnAirline { get; set; }
        //public string Airline { get; set; }
    }

    [KnownType(typeof(FAULDDamage))]
    public class FAULDDamage
    {
        public int SNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public string ULDNo { get; set; }
        public int Serviceable { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(FAConsumable))]
    public class FAConsumable
    {
        public int SNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public int HdnConsumablesList { get; set; }
        public string ConsumablesList { get; set; }
        public int Quantity { get; set; }
    }

    [KnownType(typeof(WMSInboundFlightArrivalULDGridData))]
    public class WMSInboundFlightArrivalULDGridData
    {
        public Int64 DailyFlightSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public int IsULD { get; set; }
        public string ULDNo { get; set; }
        public string BUP { get; set; }
        public string IsBUP { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
        public string Transit { get; set; }
        public string Position { get; set; }
        public string ThroughULD { get; set; }
        public string IsThroughULD { get; set; }
        public string SPHC { get; set; }
        public string BreakDownStart { get; set; }
        public string BreakDownEnd { get; set; }
        public string ULDCheckedIn { get; set; }
        public string LoadingIndicator { get; set; }
        public string Remarks { get; set; }
        public string OSIRemarks { get; set; }
        public int IsULDLocation { get; set; }
        public int IsULDDamage { get; set; }
        public int IsULDConsumable { get; set; }
        public int IsChangedTULD { get; set; }
        //public int IsThrougULDVal { get; set; }

        //public int IsTransitVal { get; set; }

        public int Isamended { get; set; }
        public int IsamendedvalueTop { get; set; }
        public int IsRushHandling { get; set; }
        public int IsManualIntactULD { get; set; }
        public int POMailSNo { get; set; }
        public int POMailArrivedShipmentSNo { get; set; }
        //Create IsLocationMandatoryOnImport property
        public int IsLocationMandatoryOnImport { get; set; }

        //Create IsLocationMandatoryOnImport property
    }
    [KnownType(typeof(WMSInboundFlightArrivalStopULDGridData))]
    public class WMSInboundFlightArrivalStopULDGridData
    {
        public Int64 DailyFlightSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public string Route { get; set; }
        //public string IsBUP { get; set; }

    }
    [KnownType(typeof(AddShipment))]
    public class AddShipment
    {
        public int SNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public string AWBNo { get; set; }
        public string FoundAWB { get; set; }
        public string HdnAWBOrigin { get; set; }
        public string AWBOrigin { get; set; }
        public string HdnAWBDestination { get; set; }
        public string AWBDestination { get; set; }
        public int HdnULDType { get; set; }
        public string ULDType { get; set; }
        public string BULKOrULD { get; set; }
        public string ULD { get; set; }
        public string TotalPieces { get; set; }
        public string GrossWeight { get; set; }
        public string CBM { get; set; }
        public string VolumeWeight { get; set; }

        public int HdnSPHC { get; set; }
        public string SPHC { get; set; }
        public string NatureOfGoods { get; set; }
        public string PartSplitTotal { get; set; }
        public string ArrivedPcs { get; set; }
        public string ArrivedGrossWt { get; set; }
        public string ArrivedCBM { get; set; }
        public string ArrivedVolume { get; set; }
        public string ShipmentRemarks { get; set; }
        public int KeepSameULD { get; set; }
        public string RefNo { get; set; }
        public int AwbType { get; set; }
    }

    [KnownType(typeof(ImportPOMDNDetail))]
    public class ImportPOMDNDetail
    {

        public int POMailSNo { get; set; }
        public int MailCategorySNo { get; set; }
        public int MailSubCategorySNo { get; set; }
        public string DNNo { get; set; }
        public string ReceptacleNumber { get; set; }
        public decimal ReceptacleWeight { get; set; }
        public string MailHCCode { get; set; }
        public int ExportDNSNo { get; set; }
        //public int ULDStockSNo { get; set; }
    }
    //End by Akaram Ali

    [KnownType(typeof(AwbULDLocation))]
    public class AwbULDLocation
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public int AWBSNo { get; set; }
        public string HdnHAWB { get; set; }
        public string HAWB { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public int RcvdPieces { get; set; }
        public decimal RcvdGrossWeight { get; set; }
        public string HdnAWBNo { get; set; }
        public int HdnRcvdPieces { get; set; }
        public decimal HdnRcvdGrossWeight { get; set; }
        public int StartPieces { get; set; }
        public int EndPieces { get; set; }
        public int HdnAssignLocation { get; set; }
        public string AssignLocation { get; set; }
        public int TempControlled { get; set; }
        public string StartTemperature { get; set; }
        public string EndTemperature { get; set; }
        public string HdnSPHC { get; set; }
        public string SPHC { get; set; }
        public int HdnMovableLocation { get; set; }
        public string MovableLocation { get; set; }
        public int HdnLocSNo { get; set; }
        public int HdnEndPieces { get; set; }

    }

    [KnownType(typeof(AwbULDLocationType))]
    public class AwbULDLocationType
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public string HdnSPHC { get; set; }
        public string HdnAWBNo { get; set; }
        public int HdnRcvdPieces { get; set; }
        public decimal HdnRcvdGrossWeight { get; set; }
        public string HdnHAWB { get; set; }
        public string HAWB { get; set; }
        public int StartPieces { get; set; }
        public int EndPieces { get; set; }
        public int TempControlled { get; set; }
        public string StartTemperature { get; set; }
        public string EndTemperature { get; set; }
        public int HdnMovableLocation { get; set; }
        public string MovableLocation { get; set; }
        public int HdnAssignLocation { get; set; }
        public string AssignLocation { get; set; }
        public int HdnLocSNo { get; set; }
        public int HdnEndPieces { get; set; }
    }

    [KnownType(typeof(AwbULDDamage))]
    public class AwbULDDamage
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int Pieces { get; set; }
        public int TotalPieces { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public string HdnAWBNo { get; set; }
        public string AWBNo { get; set; }
        public string IrregularityDamage { get; set; }
        public int HdnIrregularityDamage { get; set; }
    }

    [KnownType(typeof(AwbULDDamageType))]
    public class AwbULDDamageType
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public int TotalPieces { get; set; }
        public string HdnAWBNo { get; set; }
        public int Pieces { get; set; }
        public int HdnIrregularityDamage { get; set; }
        public string IrregularityDamage { get; set; }
    }

    [KnownType(typeof(BUPULDDetails))]
    public class BUPULDDetails
    {
        public int DailyFlightSNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public string ULDNo { get; set; }
    }
    [KnownType(typeof(ULDDetails))]
    public class ULDDetails
    {
        public int DailyFlightSNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public string ULDNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        //public string Document { get; set; }
        public int AWBPieces { get; set; }
        public string BuildDetails { get; set; }
        public string FFM { get; set; }
        public int RecvdPieces { get; set; }
        public decimal GrossWT { get; set; }
        public decimal VolumeWeight { get; set; }
        public string Remarks { get; set; }

        public bool IsRushHandling { get; set; }
        public string PosNo { get; set; }
    }
    public class FlightCheckInDetails
    {
        public string ATA { get; set; }
        public string ArrivalDate { get; set; }
        public string AircraftRegistration { get; set; }
        public decimal GrossWT { get; set; }
        public decimal VolumeWT { get; set; }
        public int AircraftTypeSNo { get; set; }
        public int AccountSNo { get; set; }
        public string AgendOrVendorName { get; set; }
        public string IsNil { get; set; }
        public string TruckScheduleNo { get; set; }
        public string TruckDate { get; set; }
        public int IsRFSAircraftType { get; set; }
        public string FlightType { get; set; }

        public string ArrivedPieces { get; set; }
    }

    [KnownType(typeof(AddShipmentType))]
    public class AddShipmentType
    {
        public int SNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public string AWBPrefix { get; set; }
        public string AWBNumber { get; set; }
        public string AWBNo { get; set; }
        public int HdnULDType { get; set; }
        public string ULDType { get; set; }
        public string SerialNo { get; set; }
        public string OwnerCode { get; set; }
        public string FoundAWB { get; set; }
        public int HdnAWBOrigin { get; set; }
        public string AWBOrigin { get; set; }
        public int HdnAWBDestination { get; set; }
        public string AWBDestination { get; set; }
        public string ULD { get; set; }
        public Nullable<decimal> TotalPieces { get; set; }
        public Nullable<decimal> GrossWeight { get; set; }
        public Nullable<decimal> CBM { get; set; }
        public Nullable<decimal> VolumeWeight { get; set; }
        public string HdnSPHC { get; set; }
        public string SPHC { get; set; }
        public string NatureOfGoods { get; set; }
        public string PartSplitTotal { get; set; }
        public Nullable<int> ArrivedPcs { get; set; }
        public Nullable<decimal> ArrivedGrossWt { get; set; }
        public Nullable<decimal> ArrivedCBM { get; set; }
        public Nullable<decimal> ArrivedVolume { get; set; }
        public string ShipmentRemarks { get; set; }
        public string RefNo { get; set; }
    }

    [KnownType(typeof(ShipmentFlightDetail))]
    public class ShipmentFlightDetail
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public string AirlineName { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public int AirlineSNo { get; set; }
        public int OriginAirportSNo { get; set; }
        public int DestinationAirportSNo { get; set; }
    }

    [KnownType(typeof(ShipmentDetail))]
    public class ShipmentDetail
    {
        public int DailyFlightSNo { get; set; }
        public int AWBSNo { get; set; }
        public string AirlineName { get; set; }
        public int FlightNo { get; set; }
    }

    [KnownType(typeof(GetGridData))]
    public class GetGridData
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string SearchAirlineCarrierCode { get; set; }
        public string SearchBoardingPoint { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string SearchFFMRcvd { get; set; }
        public string SearchQRT { get; set; }
        public string SearchSHCDGR { get; set; }
        public string SearchTransitFlight { get; set; }
        public string SearchFlightNo { get; set; }
        public string SearchConnectingFlights { get; set; }
        public string SearchFilterULDCounts { get; set; }
        public string SearchFilterMCT { get; set; }
        public string SearchFStatus { get; set; }
    }


    [KnownType(typeof(GetInboundFlightGridData))]
    public class GetInboundFlightGridData
    {
        public string SearchAirlineCarrierCode { get; set; }
        public string SearchBoardingPoint { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string SearchFFMRcvd { get; set; }
        public string SearchQRT { get; set; }
        public string SearchSHCDGR { get; set; }
        public string SearchTransitFlight { get; set; }
        public string SearchFlightNo { get; set; }
        public string SearchConnectingFlights { get; set; }
        public string SearchFilterULDCounts { get; set; }
        public string SearchFilterMCT { get; set; }
        public string SearchFStatus { get; set; }
    }

    [KnownType(typeof(GetWebForm))]
    public class GetWebForm
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string IsSubModule { get; set; }
    }

    [KnownType(typeof(GetFlightArrivalShipmentGrid))]
    public class GetFlightArrivalShipmentGrid
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string FFMFlightMasterSNo { get; set; }
    }

    [KnownType(typeof(GetInboundFlightULDInfoGridData))]
    public class GetInboundFlightULDInfoGridData
    {
        public string FFMFlightMasterSNo { get; set; }
        public string LoggedInCity { get; set; }
    }

    [KnownType(typeof(GetInboundFlightULDInformationGridData))]
    public class GetInboundFlightULDInformationGridData
    {
        public string ULDNo { get; set; }
        public string LoggedInCity { get; set; }
    }
}