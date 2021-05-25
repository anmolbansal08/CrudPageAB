using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.ULD
{
    //Added By Shivali
    [KnownType(typeof(VendorGridPriceList))]
    public class VendorGridPriceList
    {
        #region public properties

        //  SNo,PartNumber,ItemDescription,Qty,CustomerSNo,Price,Name
        public int SNo { get; set; }
        public string PartNumber { get; set; }
        public string ItemDescription { get; set; }
        public int Qty { get; set; }
        public int UOM { get; set; }
        public string Text_UOM { get; set; }
        public decimal price { get; set; }
        public int CustomerSNo { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        #endregion
    }
    [KnownType(typeof(VendorPriceList))]
    public class VendorPriceList
    {
        #region public properties
        public int SNo { get; set; }
        public string PartNumber { get; set; }
        public string ItemDescription { get; set; }
        public int Qty { get; set; }
        public string Agreement { get; set; }
        public int UOM { get; set; }
        public string Text_UOM { get; set; }
        public decimal price { get; set; }
        //public string pricel { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public  int CustomerSNo { get; set; }
        public string Text_CustomerSNo { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }

        #endregion
    }
    [KnownType(typeof(SelectVendor))]
    public class SelectVendor
    {
        public int SNo { get; set; }
        public string Agreement { get; set; }
        public int CustomerSNo { get; set; }
        public string Text_CustomerSNo { get; set; }
    }


}
