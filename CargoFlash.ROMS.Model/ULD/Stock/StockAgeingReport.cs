using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.ULD.Stock
{

    [KnownType(typeof(StockAgeingReport))]
    public class StockAgeingReport
    {
        public string Quater { get; set; }
        public string NoofAwb { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string AwbNo { get; set; }
        public string IssueDate { get; set; }
    }

    // Changes by Vipin Kumar
    [KnownType(typeof(StockAgeingRequestModel))]
    public class StockAgeingRequestModel
    {
        [Required]
        public string AirlineCode { get; set; }

        [Required]
        public string Quater { get; set; }

        [Required]
        public int? Year { get; set; }
        public int IsAutoProcess { get; set; }
    }
    // Ends
}
