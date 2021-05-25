using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
  public class TransitAWBReport
    {
        public int SNo { get; set; }
        public string AirportCode { get; set; }
        public string Station { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }

       
        public string AWBDate { get; set; }
        public string TransitStation { get; set; }

        public string AgentCode { get; set; }
        public string AgentName { get; set; }
        public string AirlineCode { get; set; }
        public string FlightNbr { get; set; }

        public string ATD { get; set; }
        public string GrossWeight { get; set; }
        public string AircraftType { get; set; }
        public string ProductName { get; set; }

        public string Commodity { get; set; }
        public string FlightType { get; set; }
    }
}


                     
