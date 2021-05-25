using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(IrregularityEvent))]


  public class IrregularityEvent
    {
        public int SNo { get; set; }
        public string EventName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedBy{ get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
     
        public string Active { get; set; }


        public List<SubCategoryTrans> TransData { get; set; }   //added


    }
    public class SubCategoryTrans
    {

        public string SNo { get; set; }
        public string SubCategoryCode { get; set; }
        public string SubCategoryName { get; set; }  
        public string SubCategoryDesc { get; set; }
        public int IsActive { get; set; }
        //public string Active { get; set; }
    }
}
