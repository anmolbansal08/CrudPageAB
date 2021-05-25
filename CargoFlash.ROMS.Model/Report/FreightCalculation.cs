using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{     
    public class FreightCalculation
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string AwbNO { get; set; }
        
    }

    public class FreightCalculationResponce
    {
        public string SNo { get; set; }
        public string AwbNO { get; set; }
        public string FlightNO { get; set; }
        public string FlightDate { get; set; }
        public string OriginAirportCode { get; set; }
        public string Remarks { get; set; }
    }

}
