using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.ULD
{

      [KnownType(typeof(ULDInCompatibility))]
  public class ULDInCompatibility
    {
          public int SNo { get; set; }
          public string UldTypeName { get; set; }
          public string Text_UldTypeName { get; set; }
          public string SPHCSNo1 { get; set; }
          public string SPHCSNo2 { get; set; }
          public string SPHC1 { get; set; }
          public string SPHC2 { get; set; }
          public string Text_SPHC1 { get; set; }
          public string Text_SPHC2 { get; set; }
          public bool IsActive { get; set; }
          public string Active { get; set; }
          public string Airline { get; set; }
          public string Text_Airline { get; set; }
         

    }
      [KnownType(typeof(ULDInCompatibility))]
  public class ULDInCompatibilityTrans
  {
      public int SNo { get; set; }
      public string UldTypeName { get; set; }
      public string Text_UldTypeName { get; set; }
      public string SPHC1 { get; set; }
      public string SPHC2 { get; set; }
      public string Text_SPHC1 { get; set; }
      public string Text_SPHC2 { get; set; }
      public bool IsActive { get; set; }
      public string Active { get; set; }
     
  }


}
