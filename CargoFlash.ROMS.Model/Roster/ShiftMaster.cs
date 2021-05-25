using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Roster
{
   [KnownType(typeof(ShiftMaster))]
    public class ShiftMaster
    {
        public int SNo { get; set; }
        public string ShiftName { get; set; }
        public string TimeIn { get; set; }
        public string TimeOut { get; set; }
        public bool NextDay { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        //public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        //public DateTime? UpdatedOn { get; set; }
      
        public string Active { get; set; }
        public string DayNext { get; set; }

    }
}
