using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [KnownType(typeof(UserGroupsLevelDetails))]
    public  class UserGroupsLevelDetails
    {
        public int AirlineSNo { get; set; }
        public int UserSNo { get; set; }
        public int GroupSNo  { get; set; }
        public int IsAutoProcess { get; set; }
    }

    [KnownType(typeof(UserSpecialPermission))]
    public class UserSpecialPermission
    {
        public string SNo { get; set; }
        public string PageName { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }

    }

    [KnownType(typeof(UserExtraFunction))]
    public class UserExtraFunction
    {
           public string PageName { get; set; }
        public string Description { get; set; }

    }
}
