using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(DemurrageFreePeriod))]
    public class DemurrageFreePeriod
    {
        public int SNo { get; set; }
        public string ULDTypeSno { get; set; }
        public string AirlineSNo { get; set; }
        public string AgentSNo { get; set; }
        public string ShipperSNo { get; set; }
        public string TypeSNo { get; set; }

        public string Text_ULDTypeSno { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string Text_AgentSNo { get; set; }
        public string Text_ShipperSNo { get; set; }
        public string Text_TypeSNo { get; set; }
        public string FreeDaysSNo { get; set; }
    }

    [KnownType(typeof(DemurragFreePeriodGrid))]
    public class DemurragFreePeriodGrid
    {
        public int SNo { get; set; }
        public string ULDType { get; set; }
        public string AirlineName { get; set; }
        public string AgentName { get; set; }
        public string Name { get; set; }
        public string FreeType { get; set; }
        public string FreeDays { get; set; }
    
    }
}
