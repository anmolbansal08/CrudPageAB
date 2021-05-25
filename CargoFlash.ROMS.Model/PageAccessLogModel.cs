using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model
{
    public class PageAccessLogModel
    {
        public int UserSNo { get; set; }
        public string UserID { get; set; }
        public string CityCode { get; set; }
        public string Module { get; set; }
        public string AppName { get; set; }
        public string FormAction { get; set; }
        public string IPAddress { get; set; }
        public string HostName { get; set; }
        public int TerminalSNo { get; set; }
        public string Browser { get; set; }
        public string URL { get; set; }
        public string AirlineSNo { get; set; }
    }
}
