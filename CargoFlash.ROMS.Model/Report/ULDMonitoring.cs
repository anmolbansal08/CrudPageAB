using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(ULDGridData))]
    public class ULDGridData
    {

        public int ULdSno { get; set; }
        public String ULDName { get; set; }

        public String OUTULD { get; set; }
        public String InDate { get; set; }

        public String FlightNo { get; set; }

        public String AwbCount { get; set; }
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
    }

    [KnownType(typeof(AwbULDLocationTransitMonitoring))]
    public class AwbULDLocationTransitMonitoring
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public int AWBSNo { get; set; }
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
        public string MovableLocation { get; set; }
        public string HdnMovableLocation { get; set; }
    }

    [KnownType(typeof(FAULDLocationTransitMonitoring))]
    public class FAULDLocationTransitMonitoring
    {
        public int SNo { get; set; }
        public int FFMFlightMasterSNo { get; set; }
        public int FFMShipmentTransSNo { get; set; }
        public string ULDNo { get; set; }
        public string BUP { get; set; }
        public int HdnReturnTo { get; set; }
        public string ReturnTo { get; set; }
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
}

