using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(AirlineHub))]
    public class AirlineHub
    {
        public Int32 SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public int OriginAirportSNo { get; set; }
        public string Text_OriginAirportSNo { get; set; }        
        public int Transit1 { get; set; }
        public int Transit2 { get; set; }
        public int Hub { get; set; }
        public bool IsExclude { get; set; }
        public string Text_Transit1 { get; set; }
        public string Text_Transit2 { get; set; }
        public string Text_Hub { get; set; }
        public string Text_IsExclude { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public int DestinationAirportSNo { get; set; }      //Added by Shahbaz Akhtar
        public string Text_DestinationAirportSNo { get; set; }//Added by Shahbaz Akhtar
    }
}