using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(PagesPermissionCollection))]
    public class PagesPermissionCollection
    {
        public Int32 SNo { get; set; }
        public bool IsActive { get; set; }
        public bool IsFound { get; set; }
        public List<ChildPagesPermission> ChildPage { get; set; }
    }

    [KnownType(typeof(PagesPermission))]
    public class PagesPermission
    {
        public Int32 SNo { get; set; }
        public bool IsActive { get; set; }
    }

    [KnownType(typeof(ChildPagesPermission))]
    public class ChildPagesPermission
    {
        public Int32 IsCreateSNo { get; set; }
        public Int32 IsEditSNo { get; set; }
        public Int32 IsDeleteSNo { get; set; }
        public Int32 IsReadSNo { get; set; }
        public bool IsCreate { get; set; }
        public bool IsEdit { get; set; }
        public bool IsDelete { get; set; }
        public bool IsRead { get; set; }
    }

    [KnownType(typeof(ChildPagesPermissionCollection))]
    public class ChildPagesPermissionCollection
    {
        public Int32 SNo { get; set; }
        public Int32 GroupSNo { get; set; }
        public Int32 PageRightsSNo { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }

    [KnownType(typeof(ChildPagesUserPermissionCollection))]
    public class ChildPagesUserPermissionCollection
    {
        public Int32 SNo { get; set; }
        public Int32 UserSNo { get; set; }
        public Int32 PageRightsSNo { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }


    [KnownType(typeof(DeletePermission))]
    public class DeletePermission
    {
        public Int32 UserSNo { get; set; }
        public Int32 GroupSNo { get; set; }
    }

    [KnownType(typeof(DeletePermissionUserCollection))]
    public class DeletePermissionUserCollection
    {
        public Int32 PageSNo { get; set; }
        public Int32 UserSNo { get; set; }
    }

    [KnownType(typeof(DeletePermissionGroupCollection))]
    public class DeletePermissionGroupCollection
    {
        public Int32 PageSNo { get; set; }
        public Int32 GroupSNo { get; set; }
    }
}
