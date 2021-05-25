using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(BannerGridData))]
    public class BannerGridData
    {
        #region Public Properties
        public int SNo { get; set; }
        public string BannerSubject { get; set; }
        public string Active { get; set; }
        public string Title { get; set; }
        public string BannerType { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        #endregion
    }
    [KnownType(typeof(Banner))]
    public class Banner
    {
        #region Public Properties
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string Title { get; set; }
        [Order(3)]
        public string BannerSubject { get; set; }
        [Order(4)]
        public string BannerDescription { get; set; }
        [Order(5)]
        public bool IsActive { get; set; }
        [Order(6)]
        public Int64 CreatedBy { get; set; }
        [Order(7)]
        public Int64 UpdatedBy { get; set; }
        [Order(8)]
        public string Active { get; set; }
        [Order(9)]
        public string CreatedUser { get; set; }
        [Order(10)]
        public string UpdatedUser { get; set; }
        [Order(11)]
        public Nullable<int> BannerType { get; set; }
        [Order(12)]
        public Nullable<int> BannerTypeNo { get; set; }

        [Order(13)]
        public string BannerTypeName { get; set; }


        [Order(14)]
        public string UploadDocument { get; set; }
        [Order(15)]
        public Nullable<DateTime> ValidFrom { get; set; }
        [Order(16)]
        public Nullable<DateTime> ValidTo { get; set; }


        #endregion
    }
}

