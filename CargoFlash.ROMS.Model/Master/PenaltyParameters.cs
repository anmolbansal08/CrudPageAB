using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Master
{
  [KnownType(typeof(PenaltyParameters))]
   public class PenaltyParameters
    {

      public int SNo { get; set; }
      public int IsInternational { get; set; }
      public string Text_IsInternational { get; set; }
      public int PenaltyType { get; set; }
      public string Text_PenaltyType { get; set; }

      public int AirlineSNo { get; set; }
      public string Text_AirlineSNo { get; set; }
     
        public int LocationBasis { get; set; }
      public string Text_LocationBasis { get; set; }
      public int LocationBasisSNo { get; set; }
      public string Text_LocationBasisSNo { get; set; }

      public int ProductSNo { get; set; }
      public string Text_ProductSNo { get; set; }
      public decimal ApplicableWeight { get; set; }
      public int AppliedOn { get; set; }
      public string Text_AppliedOn { get; set; }
     
      public bool IsExceludeSHC { get; set; }
      public string Text_IsExceludeSHC { get; set; }
    //  public bool IsExcludeAirport { get; set; }
    //  public string Text_IsExcludeAirport { get; set; }
      public bool IsExcludeAgent { get; set; }
      public string Text_IsExcludeAgent { get; set; }

    

     public int CreatedBy { get; set; } 
      public Nullable<DateTime>  CreatedOn{get; set;}
      public int UpdatedBy { get; set; }
      public Nullable<DateTime> UpdatedOn { get; set; }
      public string SHCSNo { get; set; }
      public string Text_SHCSNo { get; set; }
     // public string AirportSNo { get; set; }
    //  public string Text_AirportSNo { get; set; }
      public string AccountSNo { get; set; }
      public string Text_AccountSNo { get; set; }
      public List<PenaltyParametersSlab> PenaltyParametersSlab { get; set; }
      public string CreatedUser { get; set; }
      public string UpdatedUser { get; set; }
      public int CitySNo { get; set; }
      public int CountrySNo { get; set; }
      public int MinimumCharge { get; set; }
      public int TaxOnPenalty { get; set; }
      public string Text_CitySNo { get; set; }
      public string Text_CountrySNo { get; set; }
      public Nullable<DateTime> ValidTo { get; set; }
      public Nullable<DateTime> ValidFrom { get; set; }
      public string Text_ValidTo { get; set; }
      public string Text_ValidFrom { get; set; }
      public bool IsActive { get; set; }
      public string Active { get; set; }
      public int    CurrencySNo { get; set; }
      public string Commodity   { get; set; }
      public string Text_CurrencySNo { get; set; }
      public string Text_Commodity { get; set; }
        public string OtherAirlineSNo { get; set; }
        public string Text_OtherAirlineSNo { get; set; }
        public string RefNo { get; set; }
        // public string UserCreatedBy { get; set; }
        // public string UserUpdatedBy { get; set; } 
    }

    [KnownType(typeof(PenaltyParametersGrid))]
    public class PenaltyParametersGrid
    {
        public int SNo { get; set; }
        public string PenaltyType { get; set; }
        public string AirlineSNo { get; set; }
        public string CountrySNo { get; set; }
        public string ProductSNo { get; set; }
        public string ChargeBase { get; set; }
        public string Text_CitySNo { get; set; }
        public string Text_CountrySNo { get; set; }
        public Nullable<decimal> PenaltyCharge { get; set; }
        public string Text_IsInternational { get; set; }
        public string MinimumCharge { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string RefNo { get; set; }
        public string Active { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string BasedOn { get; set; }
    }

    [KnownType(typeof(PenaltyParametersSlab))]
    public class PenaltyParametersSlab
    {
        public int SNo { get; set; }
        public int PenaltyParameterSNo { get; set; }
        public int StartRange { get; set; }
        public int EndRange { get; set; }
        public string BasedOn { get; set; }
        public int HdnBasedOn { get; set; }
        public decimal PenaltyCharge { get; set; }
        public string ChargeBasis { get; set; }
        public int HdnChargeBasis { get; set; }
        public int HdnAppliedOn { get; set; }
        public string AppliedOn { get; set; }
        
    }
}
