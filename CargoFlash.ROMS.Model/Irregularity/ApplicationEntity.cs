using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Runtime.Serialization;

using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(ApplicationEntity))]
    public class ApplicationEntity
    {
        public int SNo { get; set; }
        public string ApplicationEntitySno { get; set; }
        public string ApplicationCode { get; set; }
        public string ApplicationName { get; set; }
        public string Remarks { get; set; }
        public string IsActive { get; set; }
        public string Active { get; set; }
        public string ApplicationSNo { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        
    }
    [KnownType(typeof(ApplicationEntityGrid))]
    public class ApplicationEntityGrid
    {
        public int SNo { get; set; }
        public string ApplicationCode { get; set; }
        public string ApplicationName { get; set; }
        public string Remarks { get; set; }
        public string IsActive { get; set; }
    }
}
