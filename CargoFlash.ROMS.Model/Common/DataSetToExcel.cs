using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Common
{
    [KnownType(typeof(DataSetToExcel))]
    public class DataSetToExcel
    {
        public int? OfficeSNo { get; set; }
        public int? AccountSNo { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public int AirlineSNo { get; set; }
        public int CurrencySNo { get; set; }
        public int IsBGREport { get; set; }
        public string TransactionMode { get; set; }
        public string BgType { get; set; }

        public string Env { get; set; }
        public int IsAutoProcess { get; set; }
    }
}
