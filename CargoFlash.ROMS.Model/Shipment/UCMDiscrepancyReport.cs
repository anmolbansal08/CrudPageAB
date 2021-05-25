using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Shipment
{
   [KnownType(typeof(UCMDiscrepancyReportGrid))]
    public class UCMDiscrepancyReportGrid
    {

       public string SNo { get; set; }
        public string Airline { get; set; }
        public DateTime? Flightdate { get; set; }
        public string Flightno { get; set; }
        public string UCMType { get; set; }
        public string ReceivedUCM { get; set; }
        public string ProcessedUCM { get; set; }
        public string DiscepancyULD { get; set; }
        public string notificationsentto { get; set; }
        public string EDI_UCM_ID { get; set; }
        public string UCMAmendmentSNo { get; set; }
        public string OriginAirPort { get; set; }
        public string NotificationStatus { get; set; }
        public string DestinationAirPort { get; set; }
        public string utimestamp { get; set; }
        
    }



   [KnownType(typeof(UCMDiscrepancyReportTrans))]
   public class UCMDiscrepancyReportTrans
   {

       public int SNo { get; set; }
       public string ULDNo { get; set; }
       public string Content { get; set; }
       public string Destination { get; set; }

   }
}
