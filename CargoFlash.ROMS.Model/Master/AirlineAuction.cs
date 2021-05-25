using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(AirlineAuction))]
    public class AirlineAuction
    {
        public Int64 SNo{get;set;}
        public double AuctionRate{get;set;}
        public String CurrencyCode{get;set;}
        public String AuctionName{get;set;}
        public Int32 CutoffTime{get;set;}
        public double TotalBucketSpace{get;set;}
        public string FlightNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public Nullable<DateTime> ValidFrom{get;set;}
        public Nullable<DateTime> ValidTo{get;set;}
        public Int64 ApprovedBy { get; set; }
        public Nullable<DateTime> ApprovedOn{get;set;}
        public String UpdatedBy { get; set; }
        public String CreatedBy { get; set; }
        public string Text_Origin { get; set; }
        public string Text_Destination { get; set; }
        public String Text_CurrencyCode { get; set; }
        public String Text_ApprovedBy { get; set; }
    }
}
