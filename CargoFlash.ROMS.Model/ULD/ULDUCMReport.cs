using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDUCMReport))]
    public class ULDUCMReport
    {

        public string OriginAirPort { get; set; }
        public string Flightdate { get; set; }
        public string UCMType { get; set; }
        public string NotificationStatus { get; set; }
        public string Remarks { get; set; }
        public string fromdate { get; set; }
        public string todate { get; set; }
        public string UCMDate { get; set; }
        public string FlightNumber { get; set; }
        public string ULDType { get; set; }
        public string ULDCategory { get; set; }
        public string ContentIndicator { get; set; }
        public string NoOfReceipts { get; set; }
        public string NoOfIssues { get; set; }
        public string ULDsReceived { get; set; }
        public string ULDsIssued { get; set; }
        public string CurrentStatus { get; set; }

    }

    
}
