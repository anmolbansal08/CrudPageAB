using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(RateCard))]
    public class RateCard
    {
       public int SNo { get; set; }
        public string RateCardName { get; set; }
        public Nullable<DateTime> StartDate { get; set; }
        public Nullable<DateTime> EndDate { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public bool IsActive { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
    }

     [KnownType(typeof(RateCardGrid))]
    public class RateCardGrid
    {
        public int SNo { get; set; }
        public string RateCardName { get; set; }
         public string StartDate { get; set; }
        public string  EndDate { get; set; }
      
        public string Active { get; set; }
       
      
      


       
      
       
        
       
        
    }


}
