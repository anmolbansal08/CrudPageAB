using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.ULDDamage
{
    [KnownType(typeof(ULDDamage))]
    public class ULDDamage
    {
        public string ULDNo { get; set; }
        public string ULDType { get; set; }
         public string MaintenanceType { get; set; }
         public string AMaintenanceType { get; set; }
         public string Ownership { get; set; }
         public string DamageDate { get; set; }
        public string Station { get; set; }
        public string MaintenanceStatus { get; set; }
        public string MaintenanceDate{ get; set; }

    }
}
