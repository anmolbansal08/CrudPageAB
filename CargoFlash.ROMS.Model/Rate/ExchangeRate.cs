using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    [KnownType(typeof(ExchangeRate))]
    public class ExchangeRate
    {
        public int SNo { get; set; }
        public string Rate { get; set; }
        public String FromCurrencyCode { get; set; }
        public int FromCurrencySNo { get; set; }
        public String Text_FromCurrencySNo { get; set; }
        public String ToCurrencyCode { get; set; }
        public int ToCurrencySNo { get; set; }
        public String Text_ToCurrencySNo { get; set; }
        //public Nullable<DateTime> ValidFrom { get; set; }
        //public Nullable<DateTime> ValidTo { get; set; }

        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }

        public Boolean IsActive { get; set; }
        public String Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public Boolean IsIataApplicable { get; set; }
        public String Text_IsIataApplicable { get; set; }
        public int ApplicableCountrySNo { get; set; }
        public String Text_ApplicableCountrySNo { get; set; }
        public int ExchangeRateTypeSNo { get; set; }
        public String Text_ExchangeRateTypeSNo { get; set; }
        public Boolean InverseApplicable { get; set; }
        public String Text_InverseApplicable { get; set; }
        public string RefNo { get; set; }
     }
}

