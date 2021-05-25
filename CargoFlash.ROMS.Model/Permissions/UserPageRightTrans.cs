using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(UserPageRightTrans))]
    public class UserPageRightTrans
    {
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public Int32 UserSNo { get; set; }
        public Int32 IncludePageRightSNo { get; set; }
        public Int32 ExcludePageRightSNo { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
    }
}
