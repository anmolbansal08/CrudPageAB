
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [KnownType(typeof(GroupPermissionDetail))]
    public class GroupPermissionDetail
    {
        public string AirlineSNo { get; set; }
        public string GroupName { get; set; }
        public string ModuleName { get; set; }
        public string PageName { get; set; }
        public int IsAutoProcess { get; set; }
    }
}
