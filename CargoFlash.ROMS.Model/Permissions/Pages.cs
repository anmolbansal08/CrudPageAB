using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(Pages))]
    public class Pages
    {
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public string PageName { get; set; }
        public string Hyperlink { get; set; }
        public Nullable<Int32> MenuSNo { get; set; }
        public Int32 DisplayOrder { get; set; }
        public string Help { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public bool IsFound { get; set; }
    }

    public class ModulePage
    {
        public int SNo { get; set; }
    }

    [KnownType(typeof(ProcessPermissionList))]
    public class ProcessPermissionList
    {
        public int SNo { get; set; }
        public int UserSNo { get; set; }
        public int SubProcessSNo { get; set; }
        public string SubProcessDisplayName { get; set; }
        public bool IsBlocked { get; set; }
        public bool IsView { get; set; }
        public bool IsEdit { get; set; }
    }

    [KnownType(typeof(SpecialPermissionList))]
    public class SpecialPermissionList
    {
        public int SNo { get; set; }
        public string PageName { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public bool IsEnabled { get; set; }
    }

    [KnownType(typeof(StatusAccessibilityList))]
    public class StatusAccessibilityList
    {
        public int SNo { get; set; }
        public int StatusSNo { get; set; }
        public int PageSNo { get; set; }
        public string StatusCode { get; set; }
        public bool IsAllow { get; set; }
    }
}
