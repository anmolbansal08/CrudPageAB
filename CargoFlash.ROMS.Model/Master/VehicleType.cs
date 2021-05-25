using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;



namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(VehicleType))]
    public class VehicleType
    {
        #region Public Properties
        [Order(1)]
        public Int32 SNo { get; set; }
        [Order(2)]
        public string vehicletype { get; set; }
        [Order(3)]
        public string Active { get; set; }
        [Order(4)]
        public Int64 CreatedBy { get; set; }
        [Order(5)]
        public Nullable<DateTime> CreatedOn { get; set; }
        [Order(6)]
        public Int64 UpdatedBy { get; set; }
        [Order(7)]
        public Nullable<DateTime> UpdatedOn { get; set; }
        [Order(8)]
        public string CreatedUser { get; set; }
        [Order(9)]
        public string UpdatedUser { get; set; }
        [Order(10)]
        public bool IsActive { get; set; }
        
        
        #endregion

        
    }
    [KnownType(typeof(VehicleTypeGridData))]
    public class VehicleTypeGridData
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public string vehicletype { get; set; }
        public string Active { get; set; }
       
        #endregion

      
    }
}