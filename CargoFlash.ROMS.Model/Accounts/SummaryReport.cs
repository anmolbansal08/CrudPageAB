using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(SummaryReport))]
    public class SummaryReport
    {
        public int SNo { get; set; }
        public string CashierId { get; set; }
        public string CashierName { get; set; }
        public string CashRegisterDate { get; set; }
        public Nullable<DateTime> StartSession { get; set; }
        public Nullable<DateTime> EndSession { get; set; }
        public string Startbalance { get; set; }
        public string ClosingBalance { get; set; }
        public Nullable<DateTime> ShiftStart { get; set; }
        public Nullable<DateTime> ShiftEnd { get; set; }
        public string CashierIDGroupSNo { get; set; }
        public string cashregisterSNo { get; set; }
    }
}
