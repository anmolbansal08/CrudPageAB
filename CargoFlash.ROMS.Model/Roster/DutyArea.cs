using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Roster
{
    [KnownType(typeof(DutyArea))]
    public class DutyArea
    {
        public int SNo { get; set; }
        public string AreaName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
       
        public string Active { get; set; }
        public string ColorName { get; set; }
        public int TerminalSno { get; set; }
        public string Text_TerminalSno { get; set; }
        public bool IsExport { get; set; }
        public string Export { get; set; }
        public string DutyAreaName { get; set; }
        public int HashColorCodeSno { get; set; }
        public string Text_HashColorCodeSno { get; set; }
    }

    [KnownType(typeof(HashColorName))]
    public class HashColorName
    {
        public string ColorName { get; set; }
    }
}
