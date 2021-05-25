using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{
    class FlightWisePerformanceReport
    {
    }

    public class FlightWisePerformanceRequestModel
    {
        public string AirlineCode { get; set; }
        public string Month { get; set; }
        public int Year { get; set; }
        public int Type { get; set; }
    }
}
