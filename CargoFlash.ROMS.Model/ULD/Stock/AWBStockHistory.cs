using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Stock
{
    [KnownType(typeof(AWBStockHistory))]
    public class AWBStockHistory
    {
        //AirlineSNo	OfficeSNo	AccountSNo	AirlineName	StartAWB	EndAWB	IssueDate	OfficeName	AgentName

        public int AirlineSNo { get; set; }
        public int OfficeSNo { get; set; }
        public int AccountSNo { get; set; }
        public string AirlineName { get; set; }
        public string StartAWB { get; set; }
        public string EndAWB { get; set; }
        public string IssueDate { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
    }
}
