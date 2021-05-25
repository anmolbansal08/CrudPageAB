using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Roster
{

     [KnownType(typeof(SkillMaster))]
   public class SkillMaster
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
      
        public bool IsActive { get; set; }
        public string Active { get; set; }
    }
}
