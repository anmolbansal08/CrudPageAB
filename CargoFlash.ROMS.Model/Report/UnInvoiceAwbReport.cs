using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class UnInvoiceAwbReport
    {
        public string Airline { get; set; }
        public string GSAnames { get; set; }
        public string SNo { get; set; }
        public string ARCode { get; set; }
        public string GSAName { get; set; }
        public string ActualCrLimit { get; set; }
        public string CurrentCrLimit { get; set; }
        public string AvailableLimit { get; set; }
        public string UnInvoiced { get; set; }
        public string Status { get; set; }
        public string UseCreditLimit { get; set; }
        public string EnteredBy { get; set; }
        public string EnteredDt { get; set; }
    }
}
