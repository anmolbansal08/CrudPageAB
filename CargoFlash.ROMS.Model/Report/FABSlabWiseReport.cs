using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    public class FABSlabWiseReport
    {
        public string POSSlabs { get; set; }
        public string TotalAcceptedNoofAWB { get; set; }
        public string TotalAcceptedPcs { get; set; }
        public string TotalAcceptedGr { get; set; }
        public string TotalAcceptedVol { get; set; }
        public string TotalAcceptedCh { get; set; }
        public string DepartedNoofAWB { get; set; }
        public string DepartedPcs { get; set; }
        public string DepartedGr { get; set; }
        public string DepartedVol { get; set; }
        public string DepartedCh { get; set; }
        public string TotalFABAWB { get; set; }
        public string TotalFABCh { get; set; }
        public string OffloadedAWB { get; set; }
        public string OffloadedChWt { get; set; }
        public string NoofshptsoffloadedPercentage { get; set; }
        public string TotalOffloadedPercentageslabwise { get; set; }
    }
}
