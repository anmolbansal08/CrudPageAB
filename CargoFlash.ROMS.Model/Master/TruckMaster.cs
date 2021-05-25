using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(TruckMaster))]
    public class TruckMaster
    {
        public int SNo { get; set; }
        public string TruckNo { get; set; }
        public string AssignedTruckRegNo { get; set; }
        public Nullable<DateTime> AssignedTruckExpDate { get; set; }
        public string EIDNo { get; set; }
        public Nullable<DateTime> EIDNoExpDate { get; set; }
        public string PPNo { get; set; }
        public Nullable<DateTime> PPExpDate { get; set; }
        public string SHJcustomsCardNo { get; set; }
        public Nullable<DateTime> SHJcustomscardNoexpDate { get; set; }
        public string DXBcustomsCardNo { get; set; }
        public Nullable<DateTime> DXBcustomsExpDate { get; set; }
        public string ADPNo { get; set; }
        public Nullable<DateTime> ADPNoExpDate { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }


    }
}
