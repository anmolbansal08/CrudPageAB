using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [KnownType(typeof(FlightSummaryDetail))]
    public class FlightSummaryDetail
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FlightNo { get; set; }
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public string Airline { get; set; }

        public string FlightStatus { get; set; }

        public int FlightType { get; set; }

        public int RouteType { get; set; }

    }
    public class SpecialCargoDetail
    {
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
      
   
    }

    public class OffloadReportDetail
    {
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }


    }


    public class ShortAdhocDetail
    {
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public int AirlineSNo { get; set; }
        public string AWBSNo { get; set; }       
    }

    public class ShortAdhocReportResponse
    {
        public string SNo { get; set; }
        public string RASNo { get; set; }  //RateAirlineAdhocRequest SNO
        public string AirlineName { get; set; }        
        public string ReqType { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AgentName { get; set; }
        public string Commodity { get; set; }
        public string ChargeableWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string Currency { get; set; }
        public string Rate { get; set; }
        public string RequestedRate { get; set; }
        public string ApprovedRate { get; set; }
        public string ApprovedStatus { get; set; }

        public string RequestedBy { get; set; }

        public string RequestedOn { get; set; }
    }




    public class SpecialCargoReportResponse
    {
        public string SNo { get; set; }
        public string AWBNo { get; set; }

        public string OriginAirport { get; set; }
        public string DestinationAirport { get; set; }
        public string BookingDate { get; set; }
        public string AgentName { get; set; }
        public string AWBPieces { get; set; }
        public string GrossWeight { get; set; }
        public string Volume { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        public string AWBSTATUS { get; set; }
        public string RouteType { get; set; }
        public string FlightDate { get; set; }
        public string FlightNo { get; set; }
        public string ShipmentStatus { get; set; }
        public string Createdby { get; set; }
    }

    public class OffloadReportResponse
    {

        //Date AWB No Flight No Tail No STD Origin Destination Planned pieces  Planned Gross Weight Planned Chargeable Weight   Uplifted pieces Uplifted Gross Weight Uplifted Chargeable Weight  Offloaded Pieces    Offloaded Gross Weight Offloaded Chargeable Weight

        public string SNo { get; set; }
        public string Date { get; set; }

        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string TailNo { get; set; }
        public string STD { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Plannedpieces { get; set; }
        public string PlannedGrossWeight { get; set; }
        public string PlannedChargeableWeight { get; set; }
        public string Upliftedpieces { get; set; }
        public string UpliftedGrossWeight { get; set; }
        public string UpliftedChargeableWeight { get; set; }
        public string OffloadedPieces { get; set; }
        public string OffloadedGrossWeight { get; set; }
        public string OffloadedChargeableWeight { get; set; }
    }


    [KnownType(typeof(SpaceAvailability))]
    public class SpaceAvailability
    {
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }
        public string STD { get; set; }
        public string STA { get; set; }
        public string AircraftType { get; set; }
        public string AvlFreesaleGross { get; set; }
        public string AvlFreeSaleVolume { get; set; }
        public string CLOSED { get; set; }

    }

}
