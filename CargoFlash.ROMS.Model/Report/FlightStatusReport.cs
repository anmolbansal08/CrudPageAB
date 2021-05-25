using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class FlightStatusReport
    {
    
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightStatus { get; set; }
        public string FlightRoute { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string STD { get; set; }
        public string ETD { get; set; }
        public string ATD { get; set; }
        public string STA { get; set; }
        public string ETA { get; set; }
        public string ATA { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
        public string LocalTime { get; set; }
        public string StatusColor { get; set; }
    }
}
