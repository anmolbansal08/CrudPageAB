using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;


namespace CargoFlash.Cargo.Model.Export
{
   

    [KnownType(typeof(WMSTransitMonitoringShipmentGridData))]
    public class WMSTransitMonitoringShipmentGridData
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
        public decimal? ChWeight { get; set; }
        public int Pieces { get; set; }
        public string FFMPieces { get; set; }
        public string TotalFFMPieces { get; set; }
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
        public string Build { get; set; }
        public string ConnectingFlightNo { get; set; }
        public string ConnectingFlightDate { get; set; }
        public string TransGridSNo { get; set; }
        public int IsULD { get; set; }
    }

    [KnownType(typeof(WMSTransitMonitoringArrivalULDGridData))]
    public class WMSTransitMonitoringArrivalULDGridData
    {
        public Int64 DailyFlightSNo { get; set; }
        public Int64 FFMFlightMasterSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public int IsULD { get; set; }
        public string ULDNo { get; set; }
        public string BUP { get; set; }
        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string FinalDestination { get; set; }
        public string QRT { get; set; }
        public string MCT { get; set; }
        public string SHC { get; set; }
        public string NatureOfGoods { get; set; }
        public string ConnectingFlightNo { get; set; }
        public string ConnectingFlightDate { get; set; }
        public string ConFlightType { get; set; }
        public string ConFlightEqu { get; set; }
        public int IsULDLocation { get; set; }
        public int IsULDDamage { get; set; }
        public int IsULDConsumable { get; set; }
        public string TransGridSNo { get; set; }
        public int IsRebuild { get; set; }
    }

    [KnownType(typeof(AwbULDLocationTransitMonitoring))]
    public class AwbULDLocationTransitMonitoring
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
        public string SPHC { get; set; }
        public int HdnMovableLocation { get; set; }
        public string MovableLocation { get; set; }
    }

    [KnownType(typeof(FAULDLocationTransitMonitoring))]
    public class FAULDLocationTransitMonitoring
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
        public int HdnAirline { get; set; }
        public string Airline { get; set; }
    }

    [KnownType(typeof(AWBXray))]
    public class AWBXray
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public string AWBNo { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWT { get; set; }
        public decimal VolumeWT { get; set; }
        public decimal StartPieces { get; set; }
        public decimal EndPieces { get; set; }
    }

    [KnownType(typeof(ULDXray))]
    public class ULDXray
    {
        public int SNo { get; set; }
        public string ULDNo { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWT { get; set; }
        public decimal VolumeWT { get; set; }
    }

    [KnownType(typeof(ReBuild))]
    public class ReBuild
    {
        public int SNo { get; set; }
        public string ServiceName { get; set; }
        public string PrimaryValue { get; set; }
        public string SecondaryValue { get; set; }
    }

    [KnownType(typeof(Terminate))]
    public class Terminate
    {
        public int SNo { get; set; }
        public string ULDNo { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWT { get; set; }
        public decimal VolumeWT { get; set; }
    }

    [KnownType(typeof(ManifestShipment))]
    public class ManifestShipment
    {
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
        public string Act_G_V { get; set; }
        public string Plan_G_V { get; set; }
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
        public int Location { get; set; }
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


    }

    [KnownType(typeof(RampOffloadData))]
    public class RampOffloadData
    {

       
        public int AWBSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int ULDStockSNo { get; set; }
        public int Location { get; set; }
      
     
    }

      [KnownType(typeof(RampOffloadDataDetail))]
    public class RampOffloadDataDetail
    {

     
        public int AWBSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public int ULDStockSNo { get; set; }       
        public string AWBSector { get; set; }

            public decimal TotalPieces { get; set; }
            public decimal PlannedPieces { get; set; }
            public decimal Act_G { get; set; }
            public decimal Act_V { get; set; }

            public decimal Plan_G { get; set; }
            public decimal Plan_V { get; set; }
            public string Status { get; set; }
            public int Location { get; set; }
    }

      [KnownType(typeof(WHLocation))]
      public class WHLocation
      {

          public string LocationName { get; set; }
          public Int64 SNo { get; set; }
      }
}
