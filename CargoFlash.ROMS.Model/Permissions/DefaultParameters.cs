using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
   [KnownType(typeof(DefaultParameters))]
   public class DefaultParameters
    {
        /*------Property of Default Parameter-----*/
        public string DefaultProductSNo { get; set; }
        public string DefaultProductName { get; set; }
        public string DefaultAirportSNo { get; set; }
        public string DefaultAirportName { get; set; }
        public string FWBTransfer { get; set; }
        public string FWBAmendmentTime { get; set; }
        public string BOEVerification { get; set; }
        public string FC_AirlineName { get; set; }
        public string FC_AllowedCity { get; set; }
        public bool IsCheckFlightOverBooking { get; set; }
        public string DefaultAirportCode { get; set; }
        public string DomesticBookingPeriod { get; set; }
        public string CMSDivisor { get; set; }
        public string INHDivisor { get; set; }
        public string InternationalBookingPeriod { get; set; }
        public bool FWBOnExecution { get; set; }
        /*---------------------------------------------------*/
    }
}
