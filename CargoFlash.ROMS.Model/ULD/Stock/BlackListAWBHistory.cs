using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.ULD.Stock
{
    [KnownType(typeof(BlackListAWBHistoryRequestModel))]
    public class BlackListAWBHistoryRequestModel
    {
        public string AWBPrefix { get; set; }
        public int OfficeSNo { get; set; }
        public int CitySNo { get; set; }
        public int AgentSNo { get; set; }
        public string StockType { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string AWBNo { get; set; }
        public string Type { get; set; }
    }
}
