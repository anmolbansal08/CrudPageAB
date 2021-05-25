using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Roster
{
    [KnownType(typeof(RosterTeamID))]
    public class RosterTeamID
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
       
    }
}
