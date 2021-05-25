using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(CustomerBid))]
    public class CustomerBid
    {
        public Int64 SNo { get; set; }
        public String AuctionSNo { get; set; }
        public String CustomerSNo { get; set; }
        public double CustomerRate { get; set; }
        public String CurrencyCode { get; set; }
        public String UpdatedBy { get; set; }
        public String CreatedBy { get; set; }
        //Extra Control Column
        public String Text_AuctionSNo { get; set; }
        public String Text_CustomerSNo { get; set; }
        public String Text_CurrencyCode { get; set; }
    }
}
