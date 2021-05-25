using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{
    [KnownType(typeof(ReservationGridData))]
    public class ReservationGridData
    {
        public string ProcessStatus { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBDate { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public decimal TotalChargeableWeight { get; set; }
        public int TotalPieces { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
        public decimal FBLWt { get; set; }
        public decimal FWBWt { get; set; }
        public decimal RCSWt { get; set; }
    }

    [KnownType(typeof(RouteSearch))]
    public class RouteSearchList
    {
        public List<RouteSearch> RouteSearch { get; set; }
        public List<RouteSearchTrans> Route { get; set; }
    }

    [KnownType(typeof(RouteSearch))]
    public class RouteSearch
    {
        public int SNo { get; set; }
        public int RowNo { get; set; }
        public string Routing { get; set; }
        public List<RouteSearchTrans> Route { get; set; }
    }

    [KnownType(typeof(RouteSearchTrans))]
    public class RouteSearchTrans
    {
        public int OriginAirportSNo { get; set; }
        public int DestAirportSNo { get; set; }
        public int RouteSNo { get; set; }
    }

    [KnownType(typeof(FlightSearch))]
    public class FlightSearch
    {
        public int LoginSNo { get; set; }
        public string FlightDate { get; set; }
        public int OriginAirportSNo { get; set; }
        public int DestinationAirportSNo { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public int ProductSNo { get; set; }
        public int CommoditySNo { get; set; }
        public bool IsCAO { get; set; }
        public bool IsULD { get; set; }
    }

    [KnownType(typeof(FlightSearchResult))]
    public class FlightSearchResult
    {
        public int DailyFlightSNo { get; set; }
        public string FlightNo { get; set; }
        public string From { get; set; }
        public string ETD { get; set; }
        public string To { get; set; }
        public string ETA { get; set; }
        public string AircraftType { get; set; }
        public decimal AvailableGross { get; set; }
        public decimal AvailableVolume { get; set; }
        public int OriginAirportSNo { get; set; }
        public int DestAirportSNo { get; set; }
    }

    [KnownType(typeof(FlightPlan))]
    public class FlightPlan
    {
        public int DailyFlightSNo { get; set; }
        public string FlightNo { get; set; }
        public string From { get; set; }
        public string ETD { get; set; }
        public string To { get; set; }
        public string ETA { get; set; }
        public string AircraftType { get; set; }
        public decimal AvailableGross { get; set; }
        public decimal AvailableVolume { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public int OriginAirportSNo { get; set; }
        public int DestAirportSNo { get; set; }
        public string ActionCode { get; set; }
        public int RouteSNo { get; set; }
        public int LotNo { get; set; }
        public int Priority { get; set; }
        public int Commodity { get; set; }
    }

    [KnownType(typeof(ReservationInfo))]
    public class ReservationInfo
    {
        public int BookingType { get; set; }
        public int ShipmentOrigin { get; set; }
        public int ShipmentDest { get; set; }
        public int AgentName { get; set; }
        public int AWBStock { get; set; }
        public int ServiceType { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public string CBM { get; set; }
        public decimal ChargeableWeight { get; set; }
        public int Commodity { get; set; }
        public string DensityGroup { get; set; }
        public string AllocationCode { get; set; }
        public string SHC { get; set; }
        public string Priority { get; set; }
        public List<FlightPlan> flightPlan { get; set; }

    }
}
