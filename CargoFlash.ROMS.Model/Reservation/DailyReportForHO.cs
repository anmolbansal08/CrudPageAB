using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{

    [KnownType(typeof(DailyReportForHO))]
    public class DailyReportForHO
    {
        public int SNo { get; set; }
        public string Date { get; set; }
        public string Org { get; set; }
        public string Dest { get; set; }
        public string Pcs { get; set; }
        public string GrossWeight { get; set; }
        public string ChargeableWeight { get; set; }
    }


    [KnownType(typeof(DailyReportForHOModel))]
    public class DailyReportForHOModel
    {
        public string AirlineCode { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
		public string Airport { get; set; }
	}
}
