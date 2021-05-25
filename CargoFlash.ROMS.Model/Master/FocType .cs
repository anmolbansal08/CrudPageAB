using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(FocType))]
    public class FocType
    {
        public int SNo { get; set; }
        public String Foc_Type { get; set; }
        public String FocTypeCode { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
        public string CreatedBy { get; set; }     
        public string UpdatedBy { get; set; }
        public string FocPercentage { get; set; }
    }
}
