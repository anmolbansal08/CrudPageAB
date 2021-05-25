using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model
{
    [KnownType(typeof(MarineInsuranceGridData))]
    public class MarineInsuranceGridData
    {
        #region Public Properties
        public int SNo { get; set; }
        public string Commodity { get; set; }
        public string InsuranceCategory { get; set; }
        public string InsuranceBasedOn { get; set; }
        public decimal InsuranceValue { get; set; }
        public string Airline { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string Createdby { get; set; }

        public string Active { get; set; }

        public string CurrencySno { get; set; }



        #endregion
    }

    [KnownType(typeof(MarineInsuranceRecord))]
    public class MarineInsuranceRecord
    {
        public int SNo { get; set; }
        public string CommoditySno { get; set; }
        public int HdnCommoditySno { get; set; }
        public string InsuranceCategorySno { get; set; }
        public int HdnInsuranceBasedOn { get; set; }
        public string InsuranceBasedOn { get; set; }
        public decimal InsuranceValue { get; set; }
        public string AirlineSno { get; set; }

        public int HdnAirlineSno { get; set; }
        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }

        public string Active { get; set; }
        public string IsActive { get; set; }

        public int HdnCurrencyCode { get; set; }

        public string CurrencyCode { get; set; }
    }

    /// <summary>
    /// irre resoponse req by tarun k singh
    /// 12-01-2018
    /// </summary>

    public class MarineInsuranceResponseRequest
    {
        public int Airline { get; set; }
        public int SNo { get; set; }
        

    }
}
