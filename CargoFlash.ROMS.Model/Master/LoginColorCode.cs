using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(LoginColorCode))]
    public class LoginColorCode
    {
        public Int32 SNo { get; set; }
        public string Name { get; set; }
        public int ColorCodeSNo { get; set; }
        public string ColorCode { get; set; }
        public string Text_ColorCode { get; set; }
        public string ColorName { get; set; } 
        public int MaxUsers { get; set; }
    }
}
