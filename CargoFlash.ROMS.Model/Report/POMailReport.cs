using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    public class POMailReport
    {
        public int SNo { get; set; }
        public string Airline { get; set; }
        public string CNNo { get; set; }
        public string CN38No { get; set; }
        public string CN47No { get; set; }
        public string ORIGIN { get; set; }
        public string DESTINATION { get; set; }
        public string FlightNo { get; set; }
        public string FlightFromdate { get; set; }
        public string FlightTodate { get; set; }
        public string BookingFromdate { get; set; }
        public string BookingTodate { get; set; }
        public string BookingStatus { get; set; }
        public string DNNo { get; set; }
        public string AcceptedPieces { get; set; }
        public string BookedPieces { get; set; }
        public string AcceptedWeight { get; set; }
        public string BookedWeight { get; set; }
        public string AccountName { get; set; }
        public string ParticipantID { get; set; }
        public string BookingDate { get; set; }
        public string FlightDate { get; set; }
      
    }
}
