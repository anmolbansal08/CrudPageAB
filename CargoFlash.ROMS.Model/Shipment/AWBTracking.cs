using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(AWBTracking))]
    public class AWBTracking
    {
        public int AWBSNo { get; set; }
        public Int64 ReferenceNumber { get; set; }
        public string AWBStatus { get; set; }
        public string StatusDescription { get; set; }
        public string BookongStationCode { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public int Pieces { get; set; }
        public int Unit { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal Volume { get; set; }
    }

    [KnownType(typeof(SendEmail))]
    public class SendEmail
    {
      
        public string EmailAddress { get; set; }
        public  string AWBNo { get; set; }

    }
}
