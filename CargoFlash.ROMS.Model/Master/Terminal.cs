using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Terminal))]
    public class Terminal
    {
        public int SNo { get; set; }
        public string TerminalName { get; set; }
        public int AirportSNo { get; set; }
        
         
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
     
        public string Active { get; set; }
        public string AirportName { get; set; }
        //public DateTime ?CreatedOn { get; set; }
        //public DateTime ?UpdatedOn { get; set; }
        public int CitySNo { get; set; }
        public string CityName { get; set; }

        public string Text_AirportName { get; set; }
        public string Text_CitySNo { get; set; }

        public string XrayMachineName { get; set; }

        public string Text_XrayMachineName { get; set; }
        public string VAccountNo { get; set; }
       
    }
}
