using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
namespace CargoFlash.Cargo.Model.Master
{
  [KnownType(typeof(HoldType))]
  public class HoldType
    {
        public int SNo { get; set; }
        public String Hold_Type { get; set; }
        public String HoldTypeCode { get; set; }
        public string HoldMessage { get; set; }
        public string UnHoldMessage { get; set; }
        public bool IsAutoHold { get; set; }
        public string AutoHold { get; set; }   
        public bool IsRestrictChangeFinalization { get; set; }
        public String RestrictChangeFinalization { get; set; }
        public bool IsActive { get; set; }        
        public String Active { get; set; }

        public string hdnEditSno { get; set; }
     

        public string CreatedBy { get; set; }
       // public DateTime CreatedOn { get; set; }  
        public string UpdatedBy { get; set; }
        // public DateTime UpdatedOn { get; set; }
        public bool IsAutoUnhold { get; set; }
       public string Text_IsAutoUnhold { get; set; }
        public string ExcludeProduct { get; set; }
        public string Text_ExcludeProduct { get; set; }
        public string Airline { get; set; }
        public string Text_Airline { get; set; }
    }


  [KnownType(typeof(HoldTypeGridAppendGrid))]
  public class HoldTypeGridAppendGrid
  {
      //public int  RowNo { get; set; }
      public Nullable<int> SNo { get; set; }

      public string CountrySNo { get; set; }
      public string HdnCountrySNo { get; set; }
      public string CitySNo { get; set; }
      public string HdnCitySNo { get; set; }

      public string AirportSNo { get; set; }
      public string HdnAirportSNo { get; set; }
      public string HoldTypeSNo { get; set; }
  }

  [KnownType(typeof(HoldTypeTransSave))]
  public class HoldTypeTransSave
  {
      public int SNo { get; set; }
      public string CountrySNo { get; set; }
      public int HdnCountrySNo { get; set; }
      public string CitySNo { get; set; }
      public int HdnCitySNo { get; set; }

      public string AirportSNo { get; set; }
      public int HdnAirportSNo { get; set; }
      public string HoldTypeSNo { get; set; }



  
      public string Text_CountrySNo { get; set; }

      public string Text_CitySNo { get; set; }
    

    
      public string Text_AirportSNo { get; set; }
  




      public String Hold_Type { get; set; }
      public String HoldTypeCode { get; set; }
      public string HoldMessage { get; set; }
      public string UnHoldMessage { get; set; }
      public bool IsAutoHold { get; set; }
      public string AutoHold { get; set; }
      public bool IsRestrictChangeFinalization { get; set; }
      public String RestrictChangeFinalization { get; set; }
      public bool IsActive { get; set; }
      public String Active { get; set; }



      public string CreatedBy { get; set; }
 
      public string UpdatedBy { get; set; }
      public string hdnEditSno { get; set; }

        public bool IsAutoUnhold { get; set; }
        public string Text_IsAutoUnhold { get; set; }
        public List<HoldTypeGridAppendGrid> HoldTypeTransData { get; set; }
        public string ExcludeProduct { get; set; }
        public string Text_ExcludeProduct { get; set; }
        public string Airline { get; set; }
        public string Text_Airline { get; set; }
    }
}
