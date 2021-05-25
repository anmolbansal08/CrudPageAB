using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    public class DailyReportPOD
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string AirportSNo { get; set; }
        public string AirlineSNo { get; set; }
        public int IsAutoProcess { get; set; }
        public string No { get; set; }
        public string FlightNo { get; set; }
        public string ArrDate { get; set; }
        public string MAWB { get; set; }
        public string HAWBNo { get; set; }
        public string Pieces { get; set; }
        public string weight { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string TransferTime { get; set; }
        public string CgoTime { get; set; }
        public string Consignee { get; set; }
        public string Note { get; set; }
    }
}
