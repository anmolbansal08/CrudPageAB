using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.SpaceControl
{
    [KnownType(typeof(AllocationAccount))]
    public class AllocationAccount
    {
        public int SNo { get; set; }
        public string AccountAllocationCode { get; set; }
        public String Remarks { get; set; }
        public String AllocationCode { get; set; }
        public Int32 HdnAccountSNo { get; set; }
        public Int32 AllocationTransSNo { get; set; }
        public Int32 HdnProductSNo { get; set; }
        public int AllocationBlockType { get; set; }
        public string Text_AllocationBlockType { get; set; }
        //public Boolean Day1 { get; set; }
        //public Boolean Day2 { get; set; }
        //public Boolean Day3 { get; set; }
        //public Boolean Day4 { get; set; }
        //public Boolean Day5 { get; set; }
        //public Boolean Day6 { get; set; }
        //public Boolean Day7 { get; set; }

        public bool AllDays { get; set; }
        public string lblAllDays { get; set; }
        public string AllDay { get; set; }

        public bool Day1 { get; set; }
        public string lblDay1 { get; set; }
        public string Sun { get; set; }
        public bool Day2 { get; set; }
        public string lblDay2 { get; set; }
        public string Mon { get; set; }
        public bool Day3 { get; set; }
        public string lblDay3 { get; set; }
        public string Tue { get; set; }
        public bool Day4 { get; set; }
        public string lblDay4 { get; set; }
        public string Wed { get; set; }
        public bool Day5 { get; set; }
        public string lblDay5 { get; set; }
        public string Thu { get; set; }
        public bool Day6 { get; set; }
        public string lblDay6 { get; set; }
        public string Fri { get; set; }
        public bool Day7 { get; set; }
        public string lblDay7 { get; set; }
        public string Sat { get; set; }


        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal RemGrossWeight { get; set; }
        public decimal RemVolumeWeight { get; set; }
        public string ReleaseTime { get; set; }
        public string BsaReference { get; set; }
        public bool IsActive { get; set;}
        public int CreatedBy { get; set; }
        public string Text_AllocationTransSNo { get; set; }
        public string ProductSNo { get; set; }
        public string ProductName { get; set; }
        public string AccountSNo { get; set; }
        public string Text_ProductSNo { get; set; }
        public string Text_AccountSNo { get; set; }

    }

    [KnownType(typeof(AllocationTransAccountULDTrans))]
    public class AllocationTransAccountULDTrans
    {

        public Int32 SNo { get; set; }
        public Int32 AllocationTransAccountSNo { get; set; }
        public string ULDTypeSNo { get; set; }
        //public string Text_ULDTypeSNo { get; set; }
        public int HdnULDTypeSNo { get; set; }
        public Int32 Unit { get; set; }
        public Decimal GrossWeight { get; set; }
        public Decimal VolumeWeight { get; set; }
        public Boolean IsActive { get; set; }
        public string ComoditySNo { get; set; }
        public int HdnComoditySNo { get; set; }
        public string SPHCSNO { get; set; }
        public int HdnSPHCSNO { get; set; }

    }
}
