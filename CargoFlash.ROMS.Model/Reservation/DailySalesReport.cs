using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;


namespace CargoFlash.Cargo.Model.Reservation
{
    [KnownType(typeof(DailySalesReport))]
    public class DailySalesReport
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string BookingType { get; set; }
        public string FlightDate { get; set; }
        public string BookingDate { get; set; }
        public string GSAName { get; set; }
        public string ParticipantID { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string FlightNo { get; set; }
        public string Pieces { get; set; }
        public string GrWt { get; set; }
        public string ChWt { get; set; }
        public string Amount { get; set; }
        public string Rate { get; set; }
        public string Yield { get; set; }
        public string TotalOtherCharges { get; set; }
        public string OfficeName { get; set; }
    }


    [KnownType(typeof(DailySalesRequestModel))]
    public class DailySalesRequestModel
    {
        public string AirlineCode { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Type { get; set; }
        public string DateType { get; set; }

        public string AgentSNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }

        public string AWBSNo { get; set; }
        public string OfficeSNo { get; set; }
        public int IsAutoProcess { get; set; }
    }
}
