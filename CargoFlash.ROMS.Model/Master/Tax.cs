using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Tax))]
    public class Tax
    {
        public int SNo { get; set; }
        
        public string TaxCode { get; set; }
        
        public string Description { get; set; }
        
        public int CountrySNo { get; set; }
        
        public string CountryName { get; set; }

        public string CountryCode { get; set; }
        
        public string Text_CountrySNo { get; set; }

        public int CitySNo { get; set; }

        public string CityName { get; set; }
        
        public string CityCode { get; set; }

        public string Text_CitySNo { get; set; }

        public bool IsActive { get; set; }

        public string Active { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

        public List<TaxTrans> TransData { get; set; }

        public string TaxType { get; set; }

    }

    [KnownType(typeof(TaxPost))]
    public class TaxPost
    {
        public int TaxMasterSNo { get; set; }

        public string TaxCode { get; set; }

        public string Description { get; set; }

        public int CountrySNo { get; set; }

        public string CitySNo { get; set; }

        public bool IsActive { get; set; }

        public int UpdatedBy { get; set; }

        public List<TaxTrans> TransData { get; set; }

        public string TaxType { get; set; }
    }

    public class TaxTrans
    {
        public string SNo { get; set; }
        public decimal Percentage { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        
    }

[KnownType(typeof(TaxGrid))]
    public class TaxGrid
    {
        public int SNo { get; set; }
        public string TaxCode { get; set; }
        public string TaxType { get; set; }
        public string Description { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public string Active { get; set; }
    }
    //[KnownType(typeof(TaxSlabData))]
    //public class TaxSlabData
    //{
    //    public string TaxMasterSNo { get; set; }

    //    public string TaxCode { get; set; }

    //    public string Description { get; set; }

    //    public int CountrySNo { get; set; }

    //    public string CitySNo { get; set; }

    //    public bool IsActive { get; set; }
    //    public List<TaxSlabData> TaxSlabData { get; set; }
    //}
}
