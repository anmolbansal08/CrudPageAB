using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(UCMInOutAlert))]
    public class UCMInOutAlert
    {
        public string FlightNo { get; set; }  
        public string OriginAirportSNo { get; set; }
        public string DestinationAirPortSNo { get; set; }
        public string startdate { get; set; }
        public string enddate { get; set; }
        public string ATD { get; set; }
        public string ATA { get; set; }
        public string FlightDate { get; set; }
        public string UCMIn { get; set; }
        public string UCMOut { get; set; }
        public string EmailCount { get; set; }

        public string UCMOutAlertCount { get; set; }

        public string UCMInAlertCount { get; set; }

        public int DailyFlightSNo { get; set; }

        public string DailyFlightNo { get; set; }
    }
}
