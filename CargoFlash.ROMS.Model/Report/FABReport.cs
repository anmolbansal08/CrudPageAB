using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    public class FABReport
    {
        public int SNo { get; set; }
        public string StationName { get; set; }
        public string TotalAcceptedNoOfShipts { get; set; }
        public string TotalAcceptedPCS { get; set; }
        public string TotalAcceptedGWt { get; set; }
        public string TotalAcceptedChwt { get; set; }
        public string TotalAcceptedVolwt { get; set; }
        public string UpliftedNoOfShipts { get; set; }
        public string UpliftedPCS { get; set; }
        public string UpliftedGWt { get; set; }
        public string UpliftedChwt { get; set; }
        public string UpliftedVolwt { get; set; }
        public string TotalFlownasbookedNoOfShipts { get; set; }
        public string TotalFlownasbookedChwt { get; set; }
        public string TotalFlownasbookedFABPercentage { get; set; }
        public string OffloadNoOfShipts { get; set; }
        public string OffloadChwt { get; set; }
        public string OffloadOLPercentageNoOfShipts { get; set; }
        public string OffloadOLPercentageBasedOnChwt { get; set; }
    }
}
