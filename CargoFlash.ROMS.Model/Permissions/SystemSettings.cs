using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(SystemSettings))]
    public class SystemSettings
    {
        public int SNo { get; set; }
        public string CategoryName { get; set; }
        public string SysKey { get; set; }
        public string SysValue { get; set; }
        public Boolean Status { get; set; }
       
    }

    [KnownType(typeof(SystemSettingsList))]
    public class SystemSettingsList
    {
        public int SNo { get; set; }        
        public string SysKey { get; set; }
        public string SysValue { get; set; }
        public Boolean Status { get; set; }

    }

}
