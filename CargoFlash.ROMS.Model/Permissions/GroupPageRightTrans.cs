using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(GroupPageRightTrans))]
    public class GroupPageRightTrans
    {
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public Int32 GroupSNo { get; set; }
        public Int32 PageRightsSNo { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
    }
}
