using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [System.Runtime.Serialization.KnownType(typeof(AirMailReportRequestModel))]
    public class AirMailReportRequestModel
    {
        public string AirlineCode { get; set; }
        //public string FlightNo { get; set; }
        public string AirportCode { get; set; }
        //public string OriginSNo { get; set; }
        //public string DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string MovementTypeSNo { get; set; }
    }


    [System.Runtime.Serialization.KnownType(typeof(AirMailReport))]
    public class AirMailReport
    {
        //MovementType 	TotalConsignment	TotalPcs	TotalGrWt	TotalChWt

        public int SNo { get; set; }
        //public string Org { get; set; }
        //public string Dest { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string MovementType { get; set; }
        public string TotalConsignment { get; set; }
        public string TotalPcs { get; set; }
        public string TotalGrWt { get; set; }
        public string TotalChWt { get; set; }
    }
}
