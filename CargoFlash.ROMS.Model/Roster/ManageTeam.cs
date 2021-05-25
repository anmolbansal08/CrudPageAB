using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Roster
{

      [KnownType(typeof(ManageTeam))]
   public class ManageTeam
    {
          public int SNo { get; set; }
          public string TeamID { get; set; }
          public string TeamName{ get; set; }
          public string Text_TeamName { get; set; }
          public string EmployeeName { get; set; }
          public string Designation { get; set; }
          public int TeamIdSNo { get; set; }
          public int EmpSNo { get; set; }
          public string ValidFrom { get; set; }
          public string ValidTo { get; set; }
          public string CreatedBy { get; set; }
          public string UpdatedBy { get; set; }
          public bool IsActive { get; set; }
        
          public string Active { get; set; }
    }
     [KnownType(typeof(ManageTeamTrans))]
      public class ManageTeamTrans
      {
          public int TeamIdSNo { get; set; }
          public int EmpSNo { get; set; }
      }

}
