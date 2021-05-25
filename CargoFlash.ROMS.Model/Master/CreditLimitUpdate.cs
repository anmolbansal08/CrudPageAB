using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(CreditLimitUpdate))]
    public class CreditLimitUpdate
    {
        public int Agent { get; set; }
        public bool UpdateType { get; set; }
        public int ApprovedBy { get; set; }
        public decimal TopUpCreditLimit { get; set; }
        public string Remarks { get; set; }
        public int CreatedBy { get; set; }
        public bool IsRevert { get; set; }
    }
}
