using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Permissions
{
     [KnownType(typeof(ChangePassword))]
    public class ChangePassword
    {
        public int SNo { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
