using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(UserGroup))]
    public class UserGroup
    {
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public Int32 UserSNo { get; set; }
        public Int32 GroupSNo { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public string UserName { get; set; }
        public string GroupName { get; set; }
        public bool IsGroup { get; set; }
    }

    [KnownType(typeof(GroupUsersCollection))]
    public class GroupUsersCollection
    {
        public Int32 UserSNo { get; set; }
        public Int32 GroupSNo { get; set; }
    }

    [KnownType(typeof(GroupUsers))]
    public class GroupUsers
    {
        public Int32 UserSNo { get; set; }
    }

    [KnownType(typeof(UserGroups))]
    public class UserGroups
    {
        public Int32 GroupSNo { get; set; }
    }
}
