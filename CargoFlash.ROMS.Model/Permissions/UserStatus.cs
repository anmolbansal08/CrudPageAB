using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(UserStatusGrid))]
    public class UserStatusGrid
    {
        public Int32 SNo { get; set; }          
        public string UserName { get; set; }
        public string OldTerminal { get; set; }
        public string NewTerminal { get; set; }
        public string WeighingScaleName { get; set; }
      //  public string UpdatedBy { get; set; }
//public string UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }

     
        //public string EMailID { get; set; }
        //public string UserType { get; set; }
        //public string Mobile { get; set; }
        //public string CityCode { get; set; }
        //public string CurrentTerminal { get; set; }
        public Int32 UsreSNo { get; set; }
    }

    [KnownType(typeof(UserStatus))]
    public class UserStatus
    {
        public Int32 SNo { get; set; }
        public Int32 UserSNo { get; set; }        
        public Int32 NewTerminalSNo { get; set; }
        public Int32 WeighingScaleSNo { get; set; } 
        public string UpdatedBy { get; set; }
        //public string NewTerminalName { get; set; }
    }

}
