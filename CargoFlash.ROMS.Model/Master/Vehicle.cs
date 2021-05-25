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
    [KnownType(typeof(Vehicle))]
    public class Vehicle
    {
        #region Public Properties
        [Order(1)]
        public Int32 SNo { get; set; }
        [Order(2)]
        public string VehicleTypeSNo { get; set; }
        [Order(3)]
        public string Text_VehicleTypeSNo { get; set; }
        [Order(4)]
        public Int64 Capacity { get; set; }
        [Order(5)]
        public bool IsActive { get; set; }
        [Order(6)]
        public string VehiclePlateNo { get; set; }
        [Order(7)]
        public string CitySNo { get; set; }
        [Order(8)]
        public string Text_CitySNo { get; set; }
        [Order(9)]
        public string CityCode { get; set; }
        [Order(10)]
        public string CityName { get; set; }
        [Order(11)]
        public Int64 CreatedBy { get; set; }
        [Order(12)]
        public Nullable<DateTime> CreatedOn { get; set; }
        [Order(13)]
        public Int64 UpdatedBy { get; set; }
        [Order(14)]
        public Nullable<DateTime> UpdatedOn { get; set; }
        [Order(15)]
        public string Active { get; set; }
        [Order(16)]
        public string CreatedUser { get; set; }
        [Order(17)]
        public string UpdatedUser { get; set; }
        [Order(18)]
        public string VehicleType { get; set; }
        [Order(19)]
        public Nullable<DateTime> ExpiryDate { get; set; }
        [Order(20)]
        public string ISOwner { get; set; }
        [Order(21)]
        public int ISOwnerType { get; set; }
        [Order(22)]
        public string VehicleMakeSNo { get; set; }
        [Order(23)]
        public string Text_VehicleMakeSNo { get; set; }
        [Order(24)]
        public string vehiclemake { get; set; }
        [Order(25)]
        public int ISOwnerTypeNo { get; set; }  
        #endregion
    }

    [KnownType(typeof(VehicleRecords))]
    public class VehicleRecords
    {
        #region Public Properties
        
        public Int32 SNo { get; set; }
       
        public string VehicleTypeSNo { get; set; }
        
        public string Text_VehicleTypeSNo { get; set; }
        
        public Int64 Capacity { get; set; }
        
        public bool IsActive { get; set; }
       
        public string VehiclePlateNo { get; set; }
       
        public string CitySNo { get; set; }
       
        public string Text_CitySNo { get; set; }
       
        public string CityCode { get; set; }        
        
        public Int64 CreatedBy { get; set; }
       
       
        public Int64 UpdatedBy { get; set; }
       
        public string CreatedUser { get; set; }
       
        public string UpdatedUser { get; set; }
       
        
        public Nullable<DateTime> ExpiryDate { get; set; }
        
        
        public int ISOwnerType { get; set; }

        public int ISOwner { get; set; }
        
        public string VehicleMakeSNo { get; set; }
       
        public string Text_VehicleMakeSNo { get; set; }
      
        public int ISOwnerTypeNo { get; set; }  

        #endregion
    }


    [KnownType(typeof(VehicleRecordstrans))]
    public class VehicleRecordstrans
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public int ISOwner { get; set; }
        public Int64 Capacity { get; set; }
        public string CitySNo { get; set; }
        public string Text_CitySNo { get; set; }
        public string CityCode { get; set; }  
        public bool IsActive { get; set; }
        public Int64 UpdatedBy { get; set; }
        public string UpdatedUser { get; set; }
        public Nullable<DateTime> ExpiryDate { get; set; }
        #endregion
    }


    [KnownType(typeof(VehicleGridData))]
    public class VehicleGridData
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public string vehiclemake { get; set; }
        public string VehiclePlateNo { get; set; }
        public string Capacity { get; set; }
        public string VehicleType { get; set; }
        public string CityName { get; set; }
        public string Owner { get; set; }
        public string Active { get; set; }
        #endregion
    }

    [KnownType(typeof(VehicleGridDataModel))]
    public class VehicleGridDataModel
    {
        public string CitySNo { get; set; }
    }
}