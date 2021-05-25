using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Rate
{
    
        public class SlabSearch
        {
            public string FlightNo { get; set; }
        }

        public class FlightSearch
        {
            public string FlightNo { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public string FlightDate { get; set; }
            public string FlightType { get; set; }
            
            public string Airline { get; set; }
        }

        public class SaveDiscount
        {
            public string Product { get; set; }
            public List<Slabs> Slabs { get; set; }

            //  public List<ChangeBy> ChangeBy { get; set; }
            //  public List<IncDec> IncDec { get; set; }

        }


        public class Slabs
        {
            public string SlabName { get; set; }
            public string value { get; set; }
            public string ChangeBy { get; set; }
            public string IncDec { get; set; }
        }

        public class ChangeBy
        {
            public string ChangeByVal { get; set; }
            public string value { get; set; }
        }

        public class IncDec
        {
            public string IncDecVal { get; set; }
            public string value { get; set; }
        }
        public class DiscountConditions
        {
            public string Agent { get; set; }
            public string AgentGroup { get; set; }
            public string SPHC { get; set; }
            public string SPHCGroup { get; set; }
            public string Commodity { get; set; }
            public string IsIncludeAgent { get; set; }
            public string IsIncludeAgentGroup { get; set; }
            public string IsIncludeSPHC { get; set; }
            public string IsIncludeSPHCGroup { get; set; }
            public string IsIncludeCommodity { get; set; }
    }
    }

