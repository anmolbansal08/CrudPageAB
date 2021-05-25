using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(IndustryType))]
  public class IndustryType
    {
        public int SNo { get; set; }
        public String IndustryTypeName { get; set; }
        public String IndustryTypeDesc { get; set; }
      
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
       

    }

     [KnownType(typeof(IndustryTypeGrid))]
    public class IndustryTypeGrid
    {

        public int SNo { get; set; }

        public String IndustryTypeName { get; set; }
        public String IndustryTypeDesc { get; set; }
        

     
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public bool IsDeleted { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }

    }
}
