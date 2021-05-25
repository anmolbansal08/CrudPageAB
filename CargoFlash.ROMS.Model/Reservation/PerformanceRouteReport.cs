using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;


namespace CargoFlash.Cargo.Model.Reservation
{
    [KnownType(typeof(PerformanceRouteReport))]
    public class PerformanceRouteReport
    {
        public int SNo { get; set; }
        public string FlightNo { get; set; }
        public string Date { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AircraftType { get; set; }
        public string CapacityGross { get; set; }
        public string CapacityVol { get; set; }

        public string BookedShpts { get; set; }
        public string BookedPcs { get; set; }
        public string BookedGrWt { get; set; }
        public string BookedVol { get; set; }
        public string BookedChWt { get; set; }
        public string BookedFreight { get; set; }
        public string BookedRevenue { get; set; }
        public string BookedYield { get; set; }

        public string ExecutedShpts { get; set; }
        public string ExecutedPcs { get; set; }
        public string ExecutedGrWt { get; set; }
        public string ExecutedVol { get; set; }
        public string ExecutedChWt { get; set; }
        public string ExecutedFreight { get; set; }
        public string ExecutedRevenue { get; set; }
        public string ExecutedYield { get; set; }

        public string UpliftedShpts { get; set; }
        public string UpliftedPcs { get; set; }
        public string UpliftedGrWt { get; set; }
        public string UpliftedVol { get; set; }
        public string UpliftedChWt { get; set; }
        public string UpliftedFreight { get; set; }
        public string UpliftedRevenue { get; set; }
        public string UpliftedYield { get; set; }
    }
}
