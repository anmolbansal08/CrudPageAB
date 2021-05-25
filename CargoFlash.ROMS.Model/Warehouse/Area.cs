using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Warehouse
{
    [KnownType(typeof(AreaGrid))]
    public class AreaGrid
    {
        public Int32 SNo { get; set; }
        public string AreaName { get; set; }
        public string ColorCode { get; set; }
        public string IsStorable { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
    }
        [KnownType(typeof(Area))]
        public class Area
    {
            public Int32 SNo { get; set; }
            public string AreaName { get; set; }
            public string ColorCode { get; set; }
            public string Text_ColorCode { get; set; }
            public string ColorSNo { get; set; }
            public bool IsStorable { get; set; }
            public string Storable { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedOn { get; set; }
            public string UpdatedBy { get; set; }
            public string UpdatedOn { get; set; }
        }
    }

