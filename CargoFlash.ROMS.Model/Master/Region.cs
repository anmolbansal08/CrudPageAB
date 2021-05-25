using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Region))]
    public class Region
    {
        #region Public Properties
        //SNo,RegionName,IsForRate,IsActive,CreatedOn,CreatedBy,UpdatedOn,UpdatedBy
        public int SNo { get; set; }
        public string RegionName { get; set; }
        public string Text_Country { get; set; }
        public string Country { get; set; }
        public string CountrySNo { get; set; }
        public bool RegionType { get; set; }
        public string RegionTypeText { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedUser { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public string UpdatedUser { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        #endregion
    }
}
