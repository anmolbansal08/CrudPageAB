using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Roster
{
    [KnownType(typeof(ManageRoster))]
    public class ManageRoster
    {
        public int SNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public bool ShiftCriteria { get; set; }
        public int DutyAreaSNo { get; set; }
        public int TeamSNo { get; set; }
        public int ShiftSNo { get; set; }

        public string RosterDate { get; set; }
        public string ShiftName { get; set; }
        public string EmployeeName { get; set; }
        public string TeamName { get; set; }
    }

    [KnownType(typeof(RosterTeam))]
    public class RosterTeam
    {
        public int EmpSNo { get; set; }
        public int EmpName { get; set; }
        public int DepartmentName { get; set; }
        public int DesignationName { get; set; }
        public int TeamName { get; set; }
        public int CityName { get; set; }
    }

}
