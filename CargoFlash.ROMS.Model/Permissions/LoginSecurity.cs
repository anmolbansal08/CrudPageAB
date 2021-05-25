using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(LoginSecurity))]
    public class LoginSecurity
    {
        /*------Property of Login Security-----*/
        public string CountMaximumDayNoActivity { get; set; }
        public string NoOfBadAttemps { get; set; }
        public string CountPasswoedExpiryDate { get; set; }
        public string ISCaptcha { get; set; }
        public string LogoURL { get; set; }
        public string FooterHTML { get; set; }
        /*---------------------------------------------------*/
    }
}
