using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(VehicleMake))]
    public class VehicleMake
    {
        #region Public Properties
        [Order(1)]
        public Int32 SNo { get; set; }
        [Order(2)]
        public string VehicleTypeSNo { get; set; }
        // [Order(3)]
        // public string vehicletype { get; set; }
        [Order(3)]
        public string vehiclemake { get; set; }
        [Order(4)]
        public Int64 Capacity { get; set; }
        [Order(5)]
        public bool IsActive { get; set; }
        [Order(6)]
        public Int64 CreatedBy { get; set; }
        [Order(7)]
        public Nullable<DateTime> CreatedOn { get; set; }
        [Order(8)]
        public Int64 UpdatedBy { get; set; }
        [Order(9)]
        public Nullable<DateTime> UpdatedOn { get; set; }
        [Order(10)]
        public string CreatedUser { get; set; }
        [Order(11)]
        public string UpdatedUser { get; set; }
        [Order(12)]
        public string Active { get; set; }
        [Order(13)]
        public string Text_VehicleTypeSNo { get; set; }
       
        #endregion


    }
    [KnownType(typeof(VehicleMakeGridData))]
    public class VehicleMakeGridData
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public string vehicletype { get; set; }
        public string vehiclemake { get; set; }
        public string Active { get; set; }
        public string Capacity { get; set; }
        #endregion


    }
}