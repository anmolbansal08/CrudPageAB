using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model
{
    [KnownType(typeof(Users))]
    public class Users
    {
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public string UserName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
    }
}
