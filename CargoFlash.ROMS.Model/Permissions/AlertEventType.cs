using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(AlertEventType))]
    public class AlertEventType
    {
        public int SNo { get; set; }
        public string AlertEventTypeName { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public bool IsActive { get; set; }
    }

   
    
  

}
