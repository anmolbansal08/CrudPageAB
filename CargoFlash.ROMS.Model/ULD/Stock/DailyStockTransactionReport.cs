using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.ULD.Stock
{
    public class DailyStockTransactionReport
    {
        public int SNo { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public string StartRange { get; set; }
        public string EndRange { get; set; }
        public string Count { get; set; }
        public string TransactionType { get; set; }
        public string TransactionDate { get; set; }
    }
}
