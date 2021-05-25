using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Dashboard
{
    [KnownType(typeof(MainDashboard))]
    public class MainDashboard
    {
        public string Airline { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Currency { get; set; }
        public string Mode { get; set; }
        public string AccountSNo { get; set; }
        public string UserSNo { get; set; }


    }
}
