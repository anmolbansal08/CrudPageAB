using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Report
{
   public class AccelaeroReport
    {
        public string CarrierCode { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string EnteredDate { get; set; }
        public string IsProcessed { get; set; }
        public string ValidationMessage { get; set; }
        public string ProcessedAt { get; set; }
        public string MsgType { get; set; }
    }
    public class ModelReport
    {
        public string CarrierCode { get; set; }
        public string Destination { get; set; }
        public string FlightNo { get; set; }
        public string FromDate { get; set; }
        public string Origin { get; set; }
        public string ToDate { get; set; }
    }
}
