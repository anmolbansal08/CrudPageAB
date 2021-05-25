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
    [KnownType(typeof(Drivers))]
    public class Drivers
    {
        #region Public Properties
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string CitySNo { get; set; }
        [Order(3)]
        public string Text_CitySNo { get; set; }
        [Order(4)]
        public int AssociatedBranch { get; set; }
        [Order(5)]
        public string AssociatedBranchName { get; set; }
        [Order(6)]
        public int? Name { get; set; }
        [Order(7)]
        public string Text_Name { get; set; }
        [Order(8)]
        public string FirstName { get; set; }
        [Order(9)]
        public string LastName { get; set; }
        [Order(10)]
        public string EMailID { get; set; }
        [Order(11)]
        public string Mobile { get; set; }
        [Order(12)]
        public string UserName { get; set; }
        [Order(13)]
        public string Password { get; set; }
        [Order(14)]
        public string Address { get; set; }
        [Order(15)]
        public string ZipCode { get; set; }
        [Order(16)]
        public string LicenceNo { get; set; }
        [Order(17)]
        public DateTime LicenceExpiry { get; set; }
        [Order(18)]
        public bool IsActive { get; set; }
        [Order(19)]
        public string Active { get; set; }
        [Order(20)]
        public bool IsBlock { get; set; }
        [Order(21)]
        public string Block { get; set; }
        [Order(22)]
        public string CreatedUser { get; set; }
        [Order(23)]
        public string UpdatedUser { get; set; }
        [Order(24)]
        public string TempPassword { get; set; }
        [Order(25)]
        public int AssociatedBranchType { get; set; }
        [Order(26)]
        public string DriverName { get; set; }

        #endregion

     
    }
    [KnownType(typeof(DriversGridData))]
    public class DriversGridData
    {
        #region Public Properties
        [Order(1)]
        public Int32 SNo { get; set; }
        [Order(2)]
        public string Mobile { get; set; }
        [Order(3)]
        public string DriverName { get; set; }
        [Order(4)]
        public string CityName { get; set; }
        [Order(5)]
        public string LicenceNo { get; set; }



        [Order(6)]
        public string Active { get; set; }
        

        #endregion






    }
    [KnownType(typeof(DriversSave))]
    public class DriversSave
    {
        #region Public Properties
        [Order(1)]
        public Int32 SNo { get; set; }
        [Order(2)]
        public Nullable<int> CitySNo { get; set; }
       
        [Order(3)]
        public string FirstName { get; set; }
        [Order(4)]
        public string LastName { get; set; }
        [Order(5)]
        public string EMailID { get; set; }
        [Order(6)]
        public string Mobile { get; set; }
      
        [Order(7)]
        public string Address { get; set; }
        [Order(8)]
        public string ZipCode { get; set; }
        [Order(9)]
        public string LicenceNo { get; set; }
        [Order(10)]
        public Nullable<DateTime> LicenceExpiry { get; set; }
        [Order(11)]
        public bool IsActive { get; set; }
        [Order(12)]
        public Int64 CreatedBy { get; set; }
        [Order(13)]
        public Int64 UpdatedBy { get; set; }

        //public string Active { get; set; }

        #endregion
    }

}