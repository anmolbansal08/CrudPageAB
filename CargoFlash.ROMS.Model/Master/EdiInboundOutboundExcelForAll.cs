using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
   public  class EdiInboundOutboundExcelForAll

    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Carrier { get; set; }
        public string CityCode { get; set; }
        public string MessageTypeCheck { get; set; }
        public string MessageType { get; set; }
        public string FlightNo { get; set; }
        public string AWBNo { get; set; }
        public string Status { get; set; }
        public string EventType { get; set; }
        public string SenderID { get; set; }
        
    }
   public class InvalidRecipientExcelForAll
   {
      // public int SNo { get; set; }
       public string FromDate { get; set; }
       public string ToDate { get; set; }
   }  
}
