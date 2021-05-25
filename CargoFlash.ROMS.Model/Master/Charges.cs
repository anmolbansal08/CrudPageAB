using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Master
{
     [KnownType(typeof(Charges))]
   public class Charges
    {
        public int SNo { get; set; }
        public string ChargesType { get; set; }
        public string Charge { get; set; }
        public bool IsActive { get; set; }
       
       // public string CreatedOn { get; set; }
        public string CreatedBy { get; set; }
       // public string UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }


      
       
       
       
    }
}
