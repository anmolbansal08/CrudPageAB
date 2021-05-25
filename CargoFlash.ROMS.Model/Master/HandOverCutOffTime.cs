using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(HandOverCutOffTime))]
    public class HandOverCutOffTime
    {

        public int SNo { get; set; }
        public string BucketClassSNo { get; set; }
        public string CityCode { get; set; }
        public int HandOverCutoffTime { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string Name { get; set; }
        public string Text_BucketClassSNo { get; set; }
        public string Text_CityCode { get; set; }
        
        public Int32 DaysHandOverCutOffTime { get; set; }
        public Int32 HoursHandOverCutOffTime { get; set; }
        public Int32 MinsHandOverCutOffTime { get; set; }
         
   
      


    }
}
