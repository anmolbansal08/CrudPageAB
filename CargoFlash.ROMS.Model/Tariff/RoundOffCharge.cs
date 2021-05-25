using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Tariff
{
    [KnownType(typeof(RoundOffCharge))]
    public class RoundOffCharge
    {
        public int? SNo { get; set; }
       
        public string HdnCountryCode { get; set; }
        public decimal? InDecimal { get; set; }
        public decimal? InAmount { get; set; }
        public int? Basis { get; set; }     
        public string CountryCode { get; set; }
        public string Currency { get; set; }
       
     

    }
    [KnownType(typeof(RoundOffCurrency))]
   public class RoundOffCurrency
   {
        public int? SNo { get; set; }
        public int UpdatedBy { get; set; }
        public List<RoundOffCharge> TransData { get; set; }
   }

    [KnownType(typeof(RoundOffCurrencyGrid))]
    public class RoundOffCurrencyGrid
    {
        public int SNo { get; set; }
        public string CountryCode { get; set; }
        public string CurrencyCode { get; set; }
        public int InDecimal { get; set; }
        public int InAmount { get; set; }
        public string Basis { get; set; }
  

    }
}
