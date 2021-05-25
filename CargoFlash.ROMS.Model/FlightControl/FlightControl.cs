using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.FlightControl
{
    // Created By manoj Kumar on 16.7.2015
    [KnownType(typeof(ULDTypeData))]
    public class ULDTypeData
    {

        public string ULDName { get; set; }
        public Int64 SNo { get; set; }
    }
    public class CreateFlightEPouchWhereCondition
    {
        public string GroupFlightSNo { get; set; }


    }
    [KnownType(typeof(PriorityTypeData))]
    public class PriorityTypeData
    {

        public string PriorityCode { get; set; }
        public Int64 SNo { get; set; }
    }
    [KnownType(typeof(WMSFlightAWBGridData))]
    public class WMSFlightAWBGridData
    {

        public string ProcessStatus { get; set; }
        public string ULDNo { get; set; }
        public Int64 SNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBSector { get; set; }
        public decimal TotalPieces { get; set; }
        public Int64 PlannedPieces { get; set; }
        public Int64 hdnTotalPieces { get; set; }
        public string WHLocation { get; set; }
        public string ActG_V_CBM { get; set; }
        public string PlanG_V_CBM { get; set; }
        public string Status { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        public string SHCCodeName { get; set; }
        public int IsManifested { get; set; }
        public string Agent { get; set; }
        public decimal PG { get; set; }
        public decimal PV { get; set; }
        public decimal PCBM { get; set; }
        public decimal PGW { get; set; }
        public decimal PVW { get; set; }
        public decimal PCBMW { get; set; }
        public bool isSelect { get; set; }
        public string Priority { get; set; }
        public string ULDGroupNo { get; set; }
        public string ULDType { get; set; }
        public bool isPayment { get; set; }
        public bool isHold { get; set; }
        public string Remarks { get; set; }
        public bool IsBUP { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public string ULDCount { get; set; }
        public Int32 FBLAWBSNo { get; set; }
        public string HOLDRemarks { get; set; }
        public Int16 Block { get; set; }
        public Int64 RowNum { get; set; }
        public int FPSNo { get; set; }
        public int McBookingSNo { get; set; }
        public string ShipmentType { get; set; }
        public int AWBReferenceBookingSNo { get; set; }
        public string HDQRemarks{ get; set; }
        public string Transit { get; set; }


    }
    [KnownType(typeof(WMSLyingListGridData))]
    public class WMSLyingListGridData
    {
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBSector { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal OLCPieces { get; set; }
        public Int64 PlannedPieces { get; set; }
        public string ActG_V_CBM { get; set; }
        public string PlanG_V_CBM { get; set; }
        public string Status { get; set; }
        public string SHC { get; set; }
        public string SHCCodeName { get; set; }
        public string Agent { get; set; }
        public decimal PG { get; set; }
        public decimal PV { get; set; }
        public decimal PCBM { get; set; }
        public bool isSelect { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string FlightNo { get; set; }
        public string OffloadStatus { get; set; }
        public string ULDGroupNo { get; set; }
        public string ULDType { get; set; }
        public string Priority { get; set; }
        public bool isHold { get; set; }
        public string HOLDRemarks { get; set; }
        public int FPSNo { get; set; }
        public int McBookingSNo { get; set; }
        public string ShipmentType { get; set; }

        public Nullable<DateTime> FlightDate { get; set; }

    }

    [KnownType(typeof(WMSAmendFlightControlGridData))]
    public class WMSAmendFlightControlGridData
    {
        public string Booked_G_V_CBM { get; set; }
        public string Avilable_G_V_CBM { get; set; }
        public decimal BookedGrossWeight { get; set; }
        public decimal BookedVolumeWeight { get; set; }
        public decimal BookedCBMWeight { get; set; }
        public decimal AvilableGrossWeight { get; set; }
        public decimal AvilableVolumeWeight { get; set; }
        public decimal AvilableCBMWeight { get; set; }
        public string ProcessStatus { get; set; }
        public string FlightStatus { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string ATD { get; set; }
        public string ATDGMT { get; set; }
        public string BoardingPoint { get; set; }
        public string EndPoint { get; set; }
        public string ACType { get; set; }
        public string CAO { get; set; }
        public string DAY { get; set; }
        public Int64 SNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }

        public string FlightRoute { get; set; }
        public string SearchRoute { get; set; }

        public string GroupFlightSNo { get; set; }
        public string AirlineName { get; set; } //add  by Brajesh
        public bool IsStack { get; set; }
        public bool IsStopOver { get; set; }
        public bool IsNILManifested { get; set; }
        public bool IsRFS { get; set; }
        public bool IsBuildup { get; set; }
        public bool IsPreManifested { get; set; }
        public bool IsFlightClosed { get; set; }
        public bool IsRFSFlightsEdit { get; set; }
        public bool IsPAX { get; set; }
        public bool IsUWS { get; set; }
        public string RegistrationNo { get; set; }
        public string PartnerAirline { get; set; }
        public bool IsCargoTransfered { get; set; }
        public string FlightAmendmentRemarks { get; set; }

    }
    // End


    [KnownType(typeof(WMSFlightControlGridData))]
    public class WMSFlightControlGridData
    {
        public string Booked_G_V_CBM { get; set; }
        public string Avilable_G_V_CBM { get; set; }
        public decimal BookedGrossWeight { get; set; }
        public decimal BookedVolumeWeight { get; set; }
        public decimal BookedCBMWeight { get; set; }
        public decimal AvilableGrossWeight { get; set; }
        public decimal AvilableVolumeWeight { get; set; }
        public decimal AvilableCBMWeight { get; set; }
        public string ProcessStatus { get; set; }
        public string FlightStatus { get; set; }
        public string ViewFlightStatus { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string STD { get; set; }
        public string ATD { get; set; }
        public string ATDGMT { get; set; }
        public string BoardingPoint { get; set; }
        public string EndPoint { get; set; }
        public string GatePassNo { get; set; }
        public string ACType { get; set; }
        public string CAO { get; set; }
        public string DAY { get; set; }
        public Int64 SNo { get; set; }
        public string FlightNo { get; set; }
        public string ATDSystemTime { get; set; }
        //public string FlightDate { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string FlightRoute { get; set; }
        public string SearchRoute { get; set; }

        public string GroupFlightSNo { get; set; }

        public string FWDGroupSNo { get; set; }
        public string AirlineName { get; set; } //add  by Brajesh
        public bool IsStack { get; set; }
        public bool IsStopOver { get; set; }
        public bool IsNILManifested { get; set; }
        public bool IsRFS { get; set; }
        public bool IsBuildup { get; set; }
        public bool IsPreManifested { get; set; }
        public bool IsFlightClosed { get; set; }
        public bool IsRFSFlightsEdit { get; set; }
        public bool IsPAX { get; set; }
        public bool IsUWS { get; set; }
        public string RegistrationNo { get; set; }
        public string PartnerAirline { get; set; }
        public bool IsCargoTransfered { get; set; }
        public int FlightType { get; set; }
        public bool IsInternational { get; set; }
        public bool IsNarrowBody{ get; set; }
        public int AirCraftSNo { get; set; }
        public bool IsRegistrationAvailable { get; set; }

    }
    // End
    [KnownType(typeof(LIInfo))]
    public class LIInfo
    {
        public bool isSelect { get; set; }
        public Int64 AWBSNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal PlannedPieces { get; set; }
        public decimal ActualVolumeWt { get; set; }
        public decimal ActualGrossWt { get; set; }
        public decimal ActualCBM { get; set; }
        public decimal PlannedGrossWt { get; set; }
        public decimal PlannedVolumeWt { get; set; }
        public decimal PlannedCBM { get; set; }
        public Int32 MovementType { get; set; }
        public string ULDGroupNo { get; set; }
        public string SHC { get; set; }
        public string Agent { get; set; }
        public string ULDType { get; set; }
        public string Priority { get; set; }
        public Int32 UpdatedBy { get; set; }
        public string Remarks { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public string ULDCount { get; set; }
        public Int32 FBLAWBSNo { get; set; }
        public int FPSNo { get; set; }
        public int McBookingSNo { get; set; }
        public bool IsManifested { get; set; }
        public int AWBReferenceBookingSNo { get; set; }

    }

    [KnownType(typeof(MoveToLying))]
    public class MoveToLying
    {
        public bool isSelect { get; set; }
        public Int64 AWBSNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal PlannedPieces { get; set; }
        public decimal ActualVolumeWt { get; set; }
        public decimal ActualGrossWt { get; set; }
        public decimal ActualCBM { get; set; }
        public decimal PlannedGrossWt { get; set; }
        public decimal PlannedVolumeWt { get; set; }
        public decimal PlannedCBM { get; set; }
        public Int32 MovementType { get; set; }
        public string ULDGroupNo { get; set; }
        public string SHC { get; set; }
        public string Agent { get; set; }
        public string ULDType { get; set; }
        public string Priority { get; set; }
        public Int32 UpdatedBy { get; set; }
        public string Remarks { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public string ULDCount { get; set; }
        public Int32 FBLAWBSNo { get; set; }
        public Int64 RowNum { get; set; }
        public Int16 Block { get; set; }
    }


    [KnownType(typeof(LyingInformation))]
    public class LyingInformation
    {
        public bool isSelect { get; set; }
        public Int64 AWBSNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal PlannedPieces { get; set; }
        public decimal ActualVolumeWt { get; set; }
        public decimal ActualGrossWt { get; set; }
        public decimal ActualCBM { get; set; }
        public decimal PlannedGrossWt { get; set; }
        public decimal PlannedVolumeWt { get; set; }
        public decimal PlannedCBM { get; set; }
        public Int32 MovementType { get; set; }
        public string ULDGroupNo { get; set; }
        public string SHC { get; set; }
        public string Agent { get; set; }
        public string ULDType { get; set; }
        public string Priority { get; set; }
        public Int32 UpdatedBy { get; set; }
        public int FPSNo { get; set; }
        public int McBookingSNo { get; set; }
       
    }
    //// For Manifest 
    [KnownType(typeof(Buildup))]
    public class Buildup
    {
        public Int64 AWBSNo { get; set; }
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
        //public string Commodity { get; set; }
        public string Plan { get; set; }

    }

    [KnownType(typeof(ManifestULD))]
    public class ManifestULD
    {
        //public string Name { get; set; }
        //public decimal GrossWeight { get; set; }
        //public decimal VolumeWeight { get; set; }
        //public decimal EmptyWeight { get; set; }
        //public string TotalWeight { get; set; }
        //public string TotalShipment { get; set; }
        //public string Status { get; set; }   
        //public string ChargeCSS { get; set; }
        //public bool IsCTM { get; set; }
        //public string ChargesRemarks { get; set; }
        public string LastPointId { get; set; }
        public string LastPoint { get; set; }
        public string RFSRemarks { get; set; }
        public Int32 ULDStockSNo { get; set; }
        public Int32 Pieces { get; set; }
        public decimal MaxVolumeWeight { get; set; }
        public decimal MaxGrossWeight { get; set; }
        public string EmptyWeight { get; set; }
        public string ULDNo { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public Int32 DailyFlightSNo { get; set; }
        public string Status { get; set; }
        public Int32 Shipments { get; set; }
        public Int16 isSelect { get; set; }
        public string HoldShip { get; set; }
        public bool IsDisabledULD { get; set; }
        public bool IsCart { get; set; }


    }

    [KnownType(typeof(FlightULDStackGrid))]
    public class FlightULDStackGrid
    {
        public Int32 ULDStackSNo { get; set; }
        public Int32 DailyFlightSNo { get; set; }
        public string BaseUldNo { get; set; }
        public Int32 CountAsStock { get; set; }
        public decimal ScaleWeight { get; set; }
        public string Status { get; set; }
        public string OffPoint { get; set; }
    }

    [KnownType(typeof(FlightULDStackChildGrid))]
    public class FlightULDStackChildGrid
    {
        public Int32 ULDStackSNo { get; set; }
        public Int32 ULDStockSNo { get; set; }
        public Int32 DailyFlightSNo { get; set; }
        public string ULDNo { get; set; }
        public string OwnerCode { get; set; }
        public string ULDCity { get; set; }
    }

    [KnownType(typeof(ManifestShipment))]
    public class ManifestShipment
    {
        public string AWBOffPointId { get; set; }
        public string AWBOffPoint { get; set; }
        public string RFSRemarks { get; set; }
        public string ChargeCSS { get; set; }
        public bool IsCTM { get; set; }
        public int CTMSNo { get; set; }
        public string ChargesRemarks { get; set; }
        public Int32 ULDStockSNo { get; set; }
        public Int16 IsBulk { get; set; }

        public Int64 DailyFlightSNo { get; set; }
        public string ProcessStatus { get; set; }
        public Int64 AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBSector { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal OLCPieces { get; set; }
        public Int64 PlannedPieces { get; set; }
        public string ActG_V_CBM { get; set; }
        public string PlanG_V_CBM { get; set; }
        public string Status { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        public string SHCCodeName { get; set; }
        public string Agent { get; set; }
        public decimal PG { get; set; }
        public decimal PV { get; set; }
        public decimal PCBM { get; set; }
        public decimal PGW { get; set; }
        public decimal PVW { get; set; }
        public decimal PCCBM { get; set; }
        public bool isSelect { get; set; }
        public string Priority { get; set; }
        public string ULDGroupNo { get; set; }
        public string ULDType { get; set; }
        public bool isPayment { get; set; }
        public bool isHold { get; set; }
        public Int64 TotalPPcs { get; set; }
        public bool IsPreManifested { get; set; }
        public string HOLDRemarks { get; set; }
        public string CarrierCode { get; set; }
        public int McBookingSNo { get; set; }
        public string ShipmentType { get; set; }
        public bool IsChanged { get; set; }
        public bool IsCart { get; set; }
        public string HDQRemarks { get; set; }
    }
    [KnownType(typeof(BulkShipment))]
    public class BulkShipment
    {
        public bool isBulk { get; set; }
        public Int64 AWBSNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public Int64 TotalPieces { get; set; }
        public Int64 PlannedPieces { get; set; }
        public decimal ActualVolumeWt { get; set; }
        public decimal ActualGrossWt { get; set; }
        public decimal ActualCBM { get; set; }
        public decimal PlannedGrossWt { get; set; }
        public decimal PlannedVolumeWt { get; set; }
        public decimal PlannedCBM { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public Int32 MovementType { get; set; }
        public string RFSRemarks { get; set; }
        public string AWBOffPoint { get; set; }
        public int McBookingSNo { get; set; }
        public bool IsChanged { get; set; }
        public Int32 UpdatedBy { get; set; }
    }
    [KnownType(typeof(IntectShipment))]
    public class IntectShipment
    {
        public bool isSelect { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public Int64 ULDStockSNo { get; set; }
        public Int32 MovementType { get; set; }
        public string RFSRemarks { get; set; }
        public string LastPoint { get; set; }
        public Int32 UpdatedBy { get; set; }
    }
    [KnownType(typeof(SupplentaryInformation))]
    public class SupplentaryInformation
    {
        public Int64 ManifestSNo { get; set; }
        public string SupplentaryInfo { get; set; }
    }
    [KnownType(typeof(FlightEDIMSGGridData))]
    public class FlightEDIMSGGridData
    {

        public string ProcessStatus { get; set; }
        public Int64 SNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBSector { get; set; }
        public string SHCCode { get; set; }
        public bool IsFWB { get; set; }
        public bool IsFHL { get; set; }
        public bool IsDEP { get; set; }
        public int IsNoOfHouse { get; set; }
        public bool IsFFM { get; set; }
        public Int16 FFMMessageType { get; set; }
        public Int16 FWBMessageType { get; set; }
        public Int16 FHLMessageType { get; set; }
        public Int16 DEPMessageType { get; set; }
    }
    [KnownType(typeof(EDIMessageInfo))]
    public class EDIMessageInfo
    {
        public Int64 AWBSNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public Int16 MessageType { get; set; }
        public bool IsSend { get; set; }

    }
    // added for QRT Shipment work
    [KnownType(typeof(QRTShipmentobj))]
    public class QRTShipmentobj
    {
        public string DailyFlightSNo { get; set; }
        public string AWBSNo { get; set; }
        public string ULDSNo { get; set; }
        public string OSI1 { get; set; }
        public string OSI2 { get; set; }

    }
    [KnownType(typeof(GatePassGridData))]
   
    public class GatePassGridData
    {
        public string Booked_G_V_CBM { get; set; }
        public string Avilable_G_V_CBM { get; set; }
        public decimal BookedGrossWeight { get; set; }
        public decimal BookedVolumeWeight { get; set; }
        public decimal BookedCBMWeight { get; set; }
        public decimal AvilableGrossWeight { get; set; }
        public decimal AvilableVolumeWeight { get; set; }
        public decimal AvilableCBMWeight { get; set; }
        public string ProcessStatus { get; set; }
        public string FlightStatus { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string ATD { get; set; }
        public string ATDGMT { get; set; }
        public string BoardingPoint { get; set; }
        public string EndPoint { get; set; }
        public string ACType { get; set; }
        public string CAO { get; set; }
        public string DAY { get; set; }
        public Int64 SNo { get; set; }
        public int GatePassSNo { get; set; } public int ULD { get; set; } public int DailyFlightSNo { get; set; } public int BulkShipment { get; set; } public string GatePassNo { get; set; }
        public string FlightNo { get; set; }
        public string ATDSystemTime { get; set; }
        //public string FlightDate { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string FlightRoute { get; set; }
        public string SearchRoute { get; set; }

        public string GroupFlightSNo { get; set; }
        public string AirlineName { get; set; } //add  by Brajesh
        public bool IsStack { get; set; }
        public bool IsStopOver { get; set; }
        public bool IsNILManifested { get; set; }
        public bool IsRFS { get; set; }
        public bool IsBuildup { get; set; }
        public bool IsPreManifested { get; set; }
        public bool IsFlightClosed { get; set; }
        public bool IsRFSFlightsEdit { get; set; }
        public bool IsPAX { get; set; }
        public bool IsUWS { get; set; }
        public string RegistrationNo { get; set; }
        public string PartnerAirline { get; set; }
        public bool IsCargoTransfered { get; set; }
        public int FlightType { get; set; }
        

    }
     [KnownType(typeof(POMailDNDetails))]

    public class POMailDNDetails
    {
         public bool isSelect { get; set; }
            public string GroupFlightSNo { get; set; }
            public int  DailyFlightSNo { get; set; }
            public int  MCBookingSNo { get; set; }
            public int  ULDStockSNo { get; set; }
            public int  DNSNo { get; set; }
    }

    [KnownType(typeof(FlightEPouchDetails))]
    public class FlightEPouchDetails
    {
        [Order(1)]
        public string GroupFlightSNo { get; set; }
        [Order(2)]
        public string DocName { get; set; }
        [Order(3)]
        public string AltDocName { get; set; }
        [Order(4)]
        public string Remarks { get; set; }

    }
    [KnownType(typeof(LIMailPrintDetails))]
    public class LIMailPrintDetails
    {
        public string MailTo { get; set; }
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public string FileName { get; set; }
    }

    [KnownType(typeof(FlightEPouch))]
    public class FlightEPouch
    {
        public int SNo { get; set; }
        public string DocName { get; set; }
        public string AltDocName { get; set; }
    }

    [KnownType(typeof(ProcessedOffLoadedULD))]
    public class ProcessedOffLoadedULD
    {
        [Order(1)]
        public int UldStockSno { get; set; }

        [Order(2)]
        public string DailyFlightSNo { get; set; }


    }
    public class WebFormBuildWebFormRequest
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string DailyFlightSNo { get; set; }
    }

    [KnownType(typeof(OffloadRemarksDetails))]
    public class OffloadRemarksDetails
    {
       public int DailyFlightSNo     { get; set; }
       public string GroupFlightSNo  { get; set; }
       public int ULDStockSNo        { get; set; }
       public int AWBSNo             { get; set; }
       public int OffloadPiece       { get; set; }
       public string OffloadReason { get; set; }
    }

}
