using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Stock
{
    [KnownType(typeof(AWBStock))]
    public class AWBStock
    {
        public Int32? SNo { get; set; }
        public string AirlineName { get; set; }
        public int AirlineSNo { get; set; }
        public int Counts { get; set; }
        public string AWBSeries { get; set; }
        public String IsAutoAWB { get; set; }
        public int IsAutoAWBSNo { get; set; }
        public string AWBType { get; set; }
        public int CitySNo { get; set; }
        public int OfficeSNo { get; set; }
        public int AWBTypeSNo { get; set; }
        public string AWBPrefix { get; set; }
        public int StartRange { get; set; }
        public int EndRange { get; set; }
        public int RemainingCount { get; set; }
        public int BlackListed { get; set; }
        public Nullable<DateTime> ExpiryDate { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public String CreatedBy { get; set; }
    }
}
