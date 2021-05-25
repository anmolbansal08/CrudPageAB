using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(XrayExemption))]
    public class XrayExemption
    {
        public Int32 SNo { get; set; }
        public Int32 AirportSNo { get; set; }
        public String AirportCode { get; set; }
        public Int32 XrayExemptionSNo { get; set; }
        public String AirlineSNo { get; set; }
        public String SHCSNo { get; set; }
        public String CommoditySNo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsActive { get; set; }


    }
    [KnownType(typeof(XrayExemptionGetGrid))]
    public class XrayExemptionGetGrid
    {
        public Int32 SNo { get; set; }
        public String Airport { get; set; }

        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public String Active { get; set; }

        // public String CarrierCode { get; set; }
        //public String Text_AirlineCode { get; set; }
        //// public String CommodityCode { get; set; }
        //public String Text_SHCCode { get; set; }
        //// public String SHCCode { get; set; }
        //public String Text_CommodityCode { get; set; }
        public string UpdatedBy { get; set; }
      

    }

    [KnownType(typeof(XrayExemptionGetRecord))]
    public class XrayExemptionGetRecord
    {

        public Int32 SNo { get; set; }
        public Int32 AirportCode { get; set; }
        public String Text_AirportCode { get; set; }
     
        public string AirlineSNo { get; set; }
        public String Text_AirlineSNo { get; set; }
       
        public String SHCSNo { get; set; }
        public String Text_SHCSNo { get; set; }
        public String CommoditySNo { get; set; }
        public String Text_CommoditySNo { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
      
        
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }

    }
}
