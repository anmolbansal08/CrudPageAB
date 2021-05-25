using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [System.Runtime.Serialization.KnownType(typeof(TransitShipmentsReportRequestModel))]
    public class TransitShipmentsReportRequestModel
    {
        public int LoginAirportSNo { get; set; }
        public string AirlineCode { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }


    [System.Runtime.Serialization.KnownType(typeof(TransitShipmentsReport))]
    public class TransitShipmentsReport
    {
        public int SNo { get; set; }
        public string Station { get; set; }
        public string Org { get; set; }
        public string Dest { get; set; }
        public string JoiningCargo { get; set; }
        public string RampTransfer { get; set; }
        public string Transit { get; set; }
        public string Total { get; set; }
    }

    [System.Runtime.Serialization.KnownType(typeof(TransitShipmentsAWBRequestModel))]
    public class TransitShipmentsAWBRequestModel
    {
        public int LoginAirportSNo { get; set; }
        public string AirlineCode { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int SNo { get; set; }
        public string Type { get; set; }
    }

    [KnownType(typeof(TransitShipmentsShowAWBDetails))]
    public class TransitShipmentsShowAWBDetails
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }

        public string FlightNo { get; set; }
        public string FlightDate { get; set; }

        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string TotalChargeableWeight { get; set; }
    }

}
