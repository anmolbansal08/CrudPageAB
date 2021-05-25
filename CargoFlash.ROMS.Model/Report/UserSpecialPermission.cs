using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   
     [KnownType(typeof(UserSpecialPermissionDetails))]
     public class UserSpecialPermissionDetails
        {
            public int AirlineSNo { get; set; }
            public int UserSNo { get; set; }
            public int GroupSNo { get; set; }
            public int IsAutoProcess { get; set; }

        }
    
    //public class DownloadBlobReport
    //{
    //  public int SNo { get; set; }
    //  public string  ReportName { get; set; }
    //  public string GeneratedURL { get; set; }

    //}

    }
