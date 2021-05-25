using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    [System.Runtime.Serialization.KnownType(typeof(AgentPaymentRequestModel))]
    public  class AgentPaymentRequestModel
    {
        public string AirlineSNo { get; set; }
        public string CitySNo { get; set; } 
        public string OfficeSNo { get; set; }
        public string AccountSNo { get; set; }
        public string CurrencySNo { get; set; }
        
    }

    [System.Runtime.Serialization.KnownType(typeof(AgentPayment))]
    public class AgentPayment
    {
       // public string Sno { get; set; }
        public string OfficeName { get; set; }
        public string AccountName { get; set; }
        public string CityCode { get; set; }
        public string CurrentBalance { get; set; }
        public string CurrencyCode { get; set; }
    }
    //public class DataSourceResultAppendGrid
    //{
    //    /// <summary>
    //    /// Represents a single page of processed data.
    //    /// </summary>
    //    public IEnumerable value { get; set; }

    //    /// <summary>
    //    /// The total number of records available.
    //    /// </summary>
    //    public int key { get; set; }

    //}

}
