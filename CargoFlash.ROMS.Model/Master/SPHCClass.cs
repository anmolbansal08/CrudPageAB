using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(SPHCClass))]
    public class SPHCClass
    {
        public int SNo { get; set; }
        public string ClassName { get; set; }
        public string ClassDescription { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(SPHCSubClass))]
    public class SPHCSubClass
    {
        public int SNo { get; set; }
        public int ClassSNo { get; set; }
        public string ClassName { get; set; }
        public string Division { get; set; }
        public string DivisionName { get; set; }
        public int IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
