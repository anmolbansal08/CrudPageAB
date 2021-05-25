using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDSupportAssigned))]
    public class ULDSupportAssigned
    {
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string ReferenceNo { get; set; }
        [Order(3)]
        public string ReqByAirport { get; set; }
        [Order(4)]
        public string ReqToAirport { get; set; }
        [Order(5)]
        public string EmailAddress { get; set; }
        [Order(6)]
        public string ReqStatus { get; set; }
        [Order(7)]
        public string UserName { get; set; }
        [Order(8)]
        public Nullable<DateTime> CreatedOn { get; set; }
        [Order(9)]
        public string ProcessStatus { get; set; }
        [Order(10)]
        public string Remarks { get; set; }
    }

    [KnownType(typeof(ULDAssigned))]
    public class ULDAssigned
    {
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string ReferenceNo { get; set; }
        [Order(3)]
        public string ReqByAirport { get; set; }
        [Order(4)]
        public string ReqToAirport { get; set; }
        [Order(5)]
        public string EmailAddress { get; set; }
    }


}
