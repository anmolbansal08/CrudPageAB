using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    //[KnownType(typeof(Groups))]
    //public class Groups
    //{
    //    public Int32 MSNo { get; set; }
    //    public Int32 SNo { get; set; }
    //    public string GroupName { get; set; }
    //    public bool IsActive { get; set; }
    //    public int CreatedBy { get; set; }
    //    public Nullable<DateTime> CreatedOn { get; set; }
    //    public int UpdatedBy { get; set; }
    //    public Nullable<DateTime> UpdatedOn { get; set; }
    //    public string Active { get; set; }
    //    public string CreatedUser { get; set; }
    //    public string UpdatedUser { get; set; }
    //}

    [KnownType(typeof(Groups))]
    public class Groups
    {
        #region Public Properties
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public string RefNo { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public string Active { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public bool IsMultiCity { get; set; }
        public string MultiCity { get; set; }
        public Nullable<int> CloneGroupSNo { get; set; }
        public string Text_CloneGroupSNo { get; set; }
        public string UserTypeSNo { get; set; }
        public string Text_UserTypeSNo { get; set; }
        public string PenaltyType { get; set; }
        public string Text_PenaltyType { get; set; }
        #endregion
    }

    [KnownType(typeof(GroupsGridData))]
    public class GroupsGridData
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public string RefNo { get; set; }
        public string GroupName { get; set; }
        public string Active { get; set; }
        public string AllowMultiCity { get; set; }
        #endregion
    }
}
