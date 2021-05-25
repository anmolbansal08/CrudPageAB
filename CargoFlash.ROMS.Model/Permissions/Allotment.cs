using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(Allotment))]
    public class Allotment
    {
        public int SNo { get; set; }
        public int IsSector { get; set; }
        public string Sector { get; set; }
        public string TotalGross { get; set; }
        public string TotalGrossUnit { get; set; }
        public string TotalVolume { get; set; } 
        public string TotalVolumeUnit { get; set; }
        public string ReserveGross { get; set; }
        public string ReserveGrossUnit { get; set; }
        public string ReserveVolume { get; set; }
        public string ReserveVolumeUnit { get; set; }
        public Nullable<int> OriginSNo { get; set; }
        public string Text_OriginSNo { get; set; }
        public Nullable<int> DestinationSNo { get; set; }
        public string Text_DestinationSNo { get; set; }
        public Nullable<int> FlightNo { get; set; }
        public string Text_FlightNo { get; set; }
        public int AllotmentType { get; set; }
        public string Text_AllotmentType { get; set; }
        public string AllotmentCode { get; set; }
        public  Nullable<int> OfficeSNo { get; set; }
        public string Text_OfficeSNo { get; set; }
        public Nullable<int> AccountSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public Nullable<int> ShipperAccountSNo { get; set; }
        public string Text_ShipperAccountSNo { get; set; }
        public int GrossWeightType { get; set; }
        public string Text_GrossWeightType { get; set; }
        public decimal GrossWeight { get; set; }
        public int VolumeWeightType { get; set; }
        public string Text_VolumeWeightType { get; set; }        
        public decimal VolumeWeight { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public Nullable<int> CommodityType { get; set; }
        public string Text_CommodityType { get; set; }
        public string Commodity { get; set; }
        public string Text_Commodity { get; set; }
        public Nullable<int> SHCType { get; set; }
        public string Text_SHCType { get; set; }
        public string SHC { get; set; }
        public string Text_SHC { get; set; }
        public Nullable<int> ProductType { get; set; }
        public string Text_ProductType { get; set; }
        public string ProductSNo { get; set; }
        public string Text_ProductSNo { get; set; }
        public string Days { get; set; }
        public string Text_Days { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string ExcludeScheduleTransSNo { get; set; }
        public string FlightValidFrom { get; set; }
        public string FlightValidTo { get; set; }
        public string IsUsed { get; set; }
        public string FlightDaysOfOps { get; set; }
        public int GrossWeightVariance_P { get; set; }
        public int GrossWeightVariance_N { get; set; }
        public int VolumeVariance_P { get; set; }
        public int VolumeVariance_N { get; set; }
        public string AllotmentReleaseTime { get; set; }
        public int AllotmentReleaseTimeHr { get; set; }
        public int AllotmentReleaseTimeMin { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public bool IsMandatory { get; set; }
        public string Mandatory { get; set; }
    }


    [KnownType(typeof(AllotmentGridMain))]
    public class AllotmentGridMain
    {
        public int SNo { get; set; }
        public string AllotmentCode { get; set; }
        public string AllotmentType { get; set; }
        public string FlightNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string DaysOfOps { get; set; }
        public string AllotmentReleaseTime { get; set; }
        public string Active { get; set; }
    }


    [KnownType(typeof(AllotmentMaster))]
    public class AllotmentMaster
    {
        public int AllotmentSNo { get; set; }
        public int AirlineSNo { get; set; }
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public bool IsSector { get; set; }
        public string FlightNo { get; set; }
        public int AllotmentType { get; set; }
        public int? OfficeSNo { get; set; }
        public int? AccountSNo { get; set; }
        public int? ShipperAccountSNo { get; set; }
        public int GrossWeightType { get; set; }
        public decimal GrossWeight { get; set; }
        public int VolumeWeightType { get; set; }
        public decimal VolumeWeight { get; set; }
        public int GrossWeightVariance_P { get; set; }
        public int GrossWeightVariance_N { get; set; }
        public int VolumeVariance_P { get; set; }
        public int VolumeVariance_N { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string Days { get; set; }
        public int AllotmentReleaseTime { get; set; }
        public bool IsActive { get; set; }
        public string CommoditySNo { get; set; }
        public bool? IsExcludeCommodity { get; set; }
        public string SHCSNo { get; set; }
        public bool? IsExcludeSHC { get; set; }
        public string ProductSNo { get; set; }
        public bool? IsExcludeProduct { get; set; }
        public bool IsMandatory { get; set; }
    }

    [KnownType(typeof(AllotmentValidGrid))]
    public class AllotmentValidGrid
    {
        public bool? IsAllot { get; set; }
        public int? DailyFlightSNo { get; set; }
        public decimal? NewGrossWt { get; set; }
        public decimal? NewVolWt { get; set; }
        public bool? IsValidationFaild { get; set; }
        public bool? IsValidWT { get; set; }
    }

    [KnownType(typeof(AllotmentData))]
    public class AllotmentData
    {        
        public int AllotmentSNo { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string FlightNo { get; set; }
    }

    [KnownType(typeof(AllotmentRecords))]
    public class AllotmentRecords
    {
        public int SNo { get; set; }
        public int IsUsed { get; set; }
        public int AllowToSubmit { get; set; }
        public int DailyFlightSNo { get; set; }
        public int AllotmentSNo { get; set; }
        public string AllotmentCode { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Ori { get; set; }
        public string Dest { get; set; }       
        public string AllotmentTypeSNo { get; set; }
        public string HdnAllotmentTypeSNo { get; set; }
        public string OfficeSNo { get; set; }
        public string HdnOfficeSNo { get; set; }
        public string AccountSNo { get; set; }
        public string HdnAccountSNo { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal Volume { get; set; }
        public decimal UsedGrossWT { get; set; }
        public decimal UsedVolWT { get; set; }
        public string ReleaseGross { get; set; }
        public string ReleaseVolume { get; set; }
        public decimal GrossVariancePlus { get; set; }
        public decimal GrossVarianceMinus { get; set; }
        public decimal VolumeVariancePlus { get; set; }
        public decimal VolumeVarianceMinus { get; set; }
        public string SHC { get; set; }
        public string HdnSHC { get; set; }
        public string Commodity { get; set; }
        public string HdnCommodity { get; set; }
        public string Product { get; set; }
        public string HdnProduct { get; set; }
        public Nullable<bool> IsExcludeSHC { get; set; }
        public string ExcludeSHC { get; set; }
        public Nullable<bool> IsExcludeCommodity { get; set; }
        public string ExcludeCommodity { get; set; }
        public Nullable<bool> IsExcludeProduct { get; set; }
        public string ExcludeProduct { get; set; }
        public string ReleaseTimeHr { get; set; }
        public string ReleaseTimeMin { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public bool IsMandatory { get; set; }
        public string Mandatory { get; set; }
        public DateTime ETD { get; set; }
        public DateTime OriginAirportCurrentTime { get; set; }
    }
}
