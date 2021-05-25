using System;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Commodity))]
    public class Commodity
    {

        public int SNo { get; set; }
        [StringLength(5)]
        public string CommodityCode { get; set; }
        public string CommoditySubGroupSNo { get; set; }
        [RegularExpression("^[0-9]*$", ErrorMessage ="Commodity Sub Group SNo should be numeric.")]
        public string Text_CommoditySubGroupSNo { get; set; }
        public string SubGroupName { get; set; }
        public string CommodityDescription { get; set; }
        public string DensityGroupSNo { get; set; }
        public string GroupName { get; set; }
        public string Text_DensityGroupSNo { get; set; }
        public bool IsHeavyWeightExempt { get; set; }
        public string HeavyWeightExempt { get; set; }
        public bool IsGeneral { get; set; }
        public string General { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        // Adeed by Arman Ali
        public string CommodityClass { get; set; }
        public string SHCSNo { get; set; }
        public string Text_SHCSNo { get; set; }
        // Added by Pankaj Kumar Ishwar
        public bool InsurancedCommodity { get; set; }
        public string Text_InsurancedCommodity { get; set; }
        public int InsuranceCategory { get; set; }
        public string Text_InsuranceCategory { get; set; }
        public decimal MinimumChargeableWeight { get; set; }

    }
}

