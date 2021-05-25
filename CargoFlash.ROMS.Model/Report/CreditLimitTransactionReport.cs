using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{   
    [KnownType(typeof(CreditLimit))]
    public class CreditLimitTransactionReport
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int AccountSNo { get; set; }
    }
}
