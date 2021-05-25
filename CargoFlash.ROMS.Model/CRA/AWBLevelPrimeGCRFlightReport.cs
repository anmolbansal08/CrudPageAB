using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Stock
{
   
    [KnownType(typeof(AWBLevelPrimeGCRFlightReport))]
    public class AWBLevelPrimeGCRFlightReport
    {
        public string AWBPrefix { get; set; }
        public string AWBNo { get; set; }
        public string Status { get; set; }
        public string AirlineName { get; set; }
        public string StockType { get; set; }
        public string AWBType { get; set; }
        public string OfficeName { get; set; }
        public string CityName { get; set; }
        public string AgentName { get; set; }
        public string Issuedon { get; set; }
        //public int StockStatus { get; set; }
    }
}
