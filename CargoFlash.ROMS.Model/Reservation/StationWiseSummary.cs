using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{

    [KnownType(typeof(StationWiseSummary))]
    public class StationWiseSummary
    {
        public int SNo { get; set; }
        public string Station { get; set; }
        public string GrossWeight { get; set; }
        public string ChargeableWeight { get; set; }
    }


    [KnownType(typeof(StationWiseSummaryModel))]
    public class StationWiseSummaryModel
    {
        public string AirlineCode { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string BookingFilter { get; set; }
		public string Airport { get; set; }
	}



    [KnownType(typeof(SumOfCharges))]
    public class SumOfCharges
    {
        public string SumOfGrossWeight { get; set; }
        public string SumOfChargeableWeight { get; set; }
    }
}
