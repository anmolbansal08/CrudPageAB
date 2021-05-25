using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.EDI
{
    [KnownType(typeof(TelexType))]
    public class TelexType
    {
        public string SitaAddress { get; set; }
        public string EmailAddress { get; set; }
        public string TeleTextMessage { get; set; }
        public string Text_SitaAddress { get; set; }
        public string Text_EmailAddress { get; set; }
    }
}
