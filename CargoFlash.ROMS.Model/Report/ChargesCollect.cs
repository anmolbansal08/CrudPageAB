using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class ChargesCollect
    {
        public int SNo { get; set; }
        public string Airline { get; set; }
        public string ReferenceNumber { get; set; }
        public string AWBNo { get; set; }

        public string BookingDate { get; set; }
        public string FlightDate { get; set; }
        public string ORIGIN { get; set; }
        public string DESTINATION { get; set; }
        public string ProductName { get; set; }
        public string SHC { get; set; }
        public string COMMODITYCODE { get; set; }
        public string NatureOfGoods { get; set; }
        public string FlightNo { get; set; }
        public string FlightFromdate { get; set; }
        public string FlightTodate { get; set; }
        public string BookingFromdate { get; set; }
        public string BookingTodate { get; set; }
        public string BookingStatus { get; set; }
        public string ChargeCollect { get; set; }
        public string ExecutedPieces { get; set; }
        public string BookedPieces { get; set; }
        public string AccountName { get; set; }
        public string BookedGrossWeight { get; set; }
        public string ExecutedGrossWeight { get; set; }
        public string ParticipantID { get; set; }
        public string ReceivedPieces { get; set; }
        public string DeliverdPieces { get; set; }
        public string TotalPieces { get; set; }
        public string STATUS { get; set; }
        public string TotalAmount { get; set; }
       
    }
}
