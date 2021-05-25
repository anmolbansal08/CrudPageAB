using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    [KnownType(typeof(RateDetails))]
    public class RateDetails
    {
        public int SNo { get; set; }
        public int RateCardSNo { get; set; }
        public int MailRatingCodeSNo { get; set; }
        public int RAirlineSNo { get; set; }
        public int OfficeSNo { get; set; }
        public int OriginType { get; set; }
        public int OriginSNo { get; set; }
        public int DestinationType { get; set; }
        public int DestinationSNo { get; set; }
        public string REFNo { get; set; }
        public int CurrencySNo { get; set; }
        public int Active { get; set; }
        public int RateBaseSNo { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public int IsNextSLAB { get; set; }
        public decimal Tax { get; set; }
        public int UOMSNo { get; set; }
        public int FlightTypeSNo { get; set; }
        public int RateTypeSNo { get; set; }
        public int AllotmentSNo { get; set; }
        public string Remark { get; set; }
        public int IsCommissionable { get; set; }
    }

    [KnownType(typeof(RateDetailsER))]
    public class RateDetailsER
    {
        public int SNo { get; set; }
        public int RateCardSNo { get; set; }
        public string Text_RateCardSNo { get; set; }
        public string MailRatingCodeSNo { get; set; }
        public string Text_MailRatingCodeSNo { get; set; }
        public int RAirlineSNo { get; set; }
        public string Text_RAirlineSNo { get; set; }
        public string OfficeSNo { get; set; }
        public string Text_OfficeSNo { get; set; }
        public int OriginType { get; set; }
        public string Text_OriginType { get; set; }
        public int DestinationType { get; set; }
        public string Text_DestinationType { get; set; }
        public int OriginSNo { get; set; }
        public string Text_OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public string Text_DestinationSNo { get; set; }
        public string REFNo { get; set; }
        public int CurrencySNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public int Active { get; set; }
        public string Text_Active { get; set; }
        public int RateBaseSNo { get; set; }
        public string Text_RateBaseSNo { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public bool IsNextSLAB { get; set; }
        public decimal Tax { get; set; }
        public int UOMSNo { get; set; }
        public string Text_UOMSNo { get; set; }
        public int FlightTypeSNo { get; set; }
        public string Text_FlightTypeSNo { get; set; }
        public int RateTypeSNo { get; set; }
        public string Text_RateTypeSNo { get; set; }
        public int AllotmentSNo { get; set; }
        public string Text_AllotmentSNo { get; set; }
        public string Remark { get; set; }
        public bool IsCommissionable { get; set; }
        public bool IsULDRateSlab { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }


    [KnownType(typeof(RateGrid))]
    public class RateGrid
    {
        public int SNo { get; set; }
        public string OD { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public string Active { get; set; }
        public string RateCardName { get; set; }
        public string OriginType { get; set; }
         
        public string Unit { get; set; }
        public string FlightTypeName { get; set; }
        public string OfficeName { get; set; }
        public string Commissionable { get; set; }
        public string Weight_Breakup_Advantage { get; set; }
        public string DestinationType { get; set; }
        public string Currency { get; set; }
        public string RateBased { get; set; }
        public string RateRaferenceNumber { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string IsExcelUpload { get; set; }
        public string SlabDetails { get; set; }
        public string SlabName { get; set; }
        public string REMARKS { get; set; }
        public string CarrierCode { get; set; }
        public string IssueCarrier { get; set; }
        public string FlightNumber { get; set; }
        public string ProductName { get; set; }
        public string Commodity { get; set; }
        public string Shipper { get; set; }
        public string Agent { get; set; }
        public string SPHC { get; set; }
        public string SPHCGroup { get; set; }
        public string TransitStation { get; set; }
        public string WeekDays { get; set; }
        public string ETDT { get; set; }
        public string FlightCarrier_IsInclude { get; set; }
        public string FlightNumber_IsInclude { get; set; }
        public string IssueCarrier_IsInclude { get; set; }
        public string Product_IsInclude { get; set; }
        public string Commodity_IsInclude { get; set; }
        public string AccountShipper_IsInclude { get; set; }
        public string Account_IsInclude { get; set; }
        public string SPHC_IsInclude { get; set; }
        public string SPHCGroup_IsInclude { get; set; }
        public string Transit_IsInclude { get; set; }
        public string WeekDays_IsInclude { get; set; }
        public string ETDT_IsInclude { get; set; }
        public string AgentGroup { get; set; }
        public string AccountGroup_IsInclude { get; set; }
    }

    [KnownType(typeof(RateAirlineSLAB))]
    public class RateAirlineSLAB
    {
        public int SNo { get; set; }
        public int SlabSNo { get; set; }
        public int RateSNo { get; set; }
        public string SlabName { get; set; }
        public string SlabTitle { get; set; }
        public string RateClassSNo { get; set; }
        public string Text_RateClassSNo { get; set; }
        public Decimal StartWt { get; set; }
        public Decimal EndWt { get; set; }
        public Decimal? Rate { get; set; }
        public string Based { get; set; }
        public string Text_Based { get; set; }
        public string HdnRateClassSNo { get; set; }
    }

    [KnownType(typeof(RateULDAirlineSLAB))]
    public class RateULDAirlineSLAB
    {
        public int SNo { get; set; }
        public string ULDSNo { get; set; }
        public string HdnULDSNo { get; set; }
        public string HdnRateClassCodeSNo { get; set; }
        public string HdnRateClassCode { get; set; }
        public string Text_RateClassCode { get; set; }
        public int SlabSNo { get; set; }
        public int RateSNo { get; set; }
        public string SLABName { get; set; }
        public string RateClassSNo { get; set; }
        public string RateClassCode { get; set; }        
        public string Text_RateClassSNo { get; set; }
        public string HdnRateClassSNo { get; set; }
        public Decimal StartWt { get; set; }
        public Decimal EndWt { get; set; }
        public Decimal UldMinChWT { get; set; }
        public Decimal Rate { get; set; }
        // public string Based { get; set; }
    }
    [KnownType(typeof(RateParam))]
    public class RateParam
    {
        public int SNo { get; set; }
        public int RateSNo { get; set; }
        public string AirlineSNo { get; set; }
        public int IsIncludeCarrier { get; set; }
        public string IAirlineSNo { get; set; }
        public int IsIncludeICarrier { get; set; }
        public string FlightSNo { get; set; }
        public int IsIncludeFlight { get; set; }
        public string Days { get; set; }
        public int IsIncludeDays { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int IsIncludeETD { get; set; }
        public string TransitStationsSNo { get; set; }
        public int IsIncludeTransitStations { get; set; }
        public string AccountSNo { get; set; }
        public int IsIncludeAccount { get; set; }
        public string ShipperSNo { get; set; }
        public int IsIncludeShipper { get; set; }
        public string CommoditySNo { get; set; }
        public int IsIncludeCommodity { get; set; }
        public string ProductSNo { get; set; }
        public int IsIncludeProduct { get; set; }
        public string SHCSNo { get; set; }
        public int IsIncludeSHC { get; set; }
        public string AgentGroupSNo { get; set; }
        public int IsIncludeAgentGroup { get; set; }
        public string SHCGroupSNo { get; set; }
        public int IsIncludeSHCGroup { get; set; }

    }
    [KnownType(typeof(RateRemarks))]
    public class RateRemarks
    {
        public int SNo { get; set; }
        public int RateSNo { get; set; }
        public string Remarks { get; set; }

    }

}
