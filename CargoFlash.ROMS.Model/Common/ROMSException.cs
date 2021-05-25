using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Common
{
    [KnownType(typeof(ROMSException))]
    public class ROMSException

    {
        public int Id { get; set; }
        //public Exception innerException { get; set; }
        public string ApplicationDomainName { get; set; }
        public string AssemblyName { get; set; }
        public string AssemblyVersion { get; set; }
        public string ClientDetails { get; set; }
        public DateTime DateTimeOfException { get; set; }
        public string MachineName { get; set; }
        public string Message { get; set; }
        public string RequestedUrl { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public string TypeName { get; set; }
        public string ThreadId { get; set; }
        public string ThreadUser { get; set; }
        public string UserId { get; set; }


        public ROMSException()
        {
            // TODO: Complete member initialization
        }




    }
}
