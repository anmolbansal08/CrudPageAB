using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Roster
{
    [KnownType(typeof(RosterEmployee))]
    public class RosterEmployee
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public int StaffNo { get; set; }
        public string CityCode { get; set; }
        public string AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string DesignationSNo { get; set; }
        public string Text_DesignationSNo { get; set; }
        public int TeamIDSNo { get; set; }
        public string Text_TeamIDSNo { get; set; }
        public string MailID { get; set; }
        public string ContactNo { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string SkillSNo { get; set; }
        public string Text_SkillSNo { get; set; }
        public DateTime? JoiningDate { get; set; }
        public DateTime? ResignDate { get; set; }
        public DateTime? LWorkingDate { get; set; }      
        public Boolean IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }      
        public string UpdatedBy { get; set; }
        public string DepartmentSNo { get; set; }
        public string Text_DepartmentSNo { get; set; }
        public string EmployeeTypeSNo { get; set; }       
        public string Text_EmployeeTypeSNo { get; set; }
        
    }

    [KnownType(typeof(RosterEmployeeGrid))]
    public class RosterEmployeeGrid
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public string DesignationName { get; set; }
        public string Text_DepartmentSNo { get; set; }
        public string DepartmentName { get; set; }
        public string TeamName { get; set; }
        public string Active { get; set; }
        public string CityName { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public string HdnShiftSNo { get; set; }
        public string ShiftSNo { get; set; }
        public int StaffNumber { get; set; }
       
    }
}
