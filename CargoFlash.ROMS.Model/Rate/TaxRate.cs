using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Rate
{

    
    [KnownType(typeof(TaxRateGrid))]
    public class TaxRateGrid
    {
        public int SNo { get; set; }
        public string Airline { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Status { get; set; }
       // public string TaxDefination { get; set; }
        public string OriginLevel { get; set; }
        public string DestinationLevel { get; set; }
        public string TaxType { get; set; }
        public string Createduser { get; set; }
        public string UpdatedUser { get; set; }
        public string ReferenceNo { get; set; }
        public string TaxAppliedOn { get; set; }
        public string TaxCode { get; set; }



    }

    [KnownType(typeof(ReadTaxRateDetails))]
    public class ReadTaxRateDetails
    {
        public int SNo { get; set; }
        public int TaxType { get; set; }
        public string Text_TaxType { get; set; }
        public string TaxCode { get; set; }
        public string TaxName { get; set; }
       // public int TaxDefinition { get; set; }
       // public string Text_TaxDefinition { get; set; }
        public int Refundable { get; set; }
        public string REFNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int OriginLevel { get; set; }
        public string Text_OriginLevel { get; set; }
        public int OriginSNo { get; set; }
        public string Text_OriginSNo { get; set; }
        public int DestinationLevel { get; set; }
        public string Text_DestinationLevel { get; set; }
        public int DestinationSNo { get; set; }
        public string Text_DestinationSNo { get; set; }
        public int CurrencySNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public string AppliedAt { get; set; }
        public int Minimum { get; set; }
        public int Tax { get; set; }
        public string TaxAppliedOn { get; set; }
        public string Text_TaxAppliedOn { get; set; }
        public int Status { get; set; }
        public string Text_Status { get; set; }
        public int AirlineCode { get; set; }
        public string Text_AirlineCode { get; set; }
        public string Remark { get; set; }
        public decimal ApplicableTaxAmount { get; set; }
        public string Type { get; set; }
        public string Text_Type { get; set; }
        public string TaxExpiryEmailID { get; set; }
        public string Createduser { get; set; }
        public string UpdatedUser { get; set; }
    }

    [KnownType(typeof(SaveTaxRateDetails))]
    public class SaveTaxRateDetails
    {
        public int SNo { get; set; }
        public int TaxType { get; set; }
        public string TaxCode { get; set; }
        public string TaxName { get; set; }
        //public int TaxDefination { get; set; }
        public int Refundable { get; set; }
        public string ReferenceNo { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int OriginLevel { get; set; }
        public int OriginCitySno { get; set; }
       // public int OriginCountrySNo { get; set; }
        public int DestinationLevel { get; set; }
        public int DestinationCitySNo { get; set; }
       // public int DestinationCountrySNo { get; set; }
        public int CurrencySNo { get; set; }
        public int TaxApplicableAt { get; set; }
        public int MinimumCharges { get; set; }
        public int Tax { get; set; }
        public string TaxApplicableOn { get; set; }
        
        public int Status { get; set; }
        public int AirlineCodeSNo { get; set; }
        public int ApplicableTaxAmount { get; set; }
        public int Type { get; set; }
        public string TaxExpiryEmailID { get; set; }
       // public int OriginRegionSNo { get; set; }
       // public int DestinationRegionSNo { get; set; }
    }

    [KnownType(typeof(TaxRateRemarks))]
    public class TaxRateRemarks
    {
        public int SNo { get; set; }
        public string Remarks { get; set; }
        public int TaxRateSNo { get; set; }

    }

    //[KnownType(typeof(RateParam))]
    //public class RateParam
    //{
    //    public int SNo { get; set; }
    //    public int RateSNo { get; set; }
    //    public string AirlineSNo { get; set; }
    //    public int IsIncludeCarrier { get; set; }
    //    public string IAirlineSNo { get; set; }
    //    public int IsIncludeICarrier { get; set; }
    //    public string FlightSNo { get; set; }
    //    public int IsIncludeFlight { get; set; }
    //    public string Days { get; set; }
    //    public int IsIncludeDays { get; set; }
    //    public string StartTime { get; set; }
    //    public string EndTime { get; set; }
    //    public int IsIncludeETD { get; set; }
    //    public string TransitStationsSNo { get; set; }
    //    public int IsIncludeTransitStations { get; set; }
    //    public string AccountSNo { get; set; }
    //    public int IsIncludeAccount { get; set; }
    //    public string ShipperSNo { get; set; }
    //    public int IsIncludeShipper { get; set; }
    //    public string CommoditySNo { get; set; }
    //    public int IsIncludeCommodity { get; set; }
    //    public string ProductSNo { get; set; }
    //    public int IsIncludeProduct { get; set; }
    //    public string SHCSNo { get; set; }
    //    public int IsIncludeSHC { get; set; }
    //    public string AgentGroupSNo { get; set; }
    //    public int IsIncludeAgentGroup { get; set; }


    //}

    [KnownType(typeof(TaxRateOriginCountry))]
    public class TaxRateOriginCountry
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string CountrySNo { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateDestinationCountry))]
    public class TaxRateDestinationCountry
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string DestinationCountrySNo { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateOriginCity))]
    public class TaxRateOriginCity
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string CitySNo { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateDestinationCity))]
    public class TaxRateDestinationCity
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string DestinationCitySNo { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateProduct))]
    public class TaxRateProduct
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string ProductSno { get; set; }
        public int IsExclude { get; set; }

    }


    [KnownType(typeof(TaxRateCommodity))]
    public class TaxRateCommodity
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string CommoditySno { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateAgent))]
    public class TaxRateAgent
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string AgentSno { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateAgentShipper))]
    public class TaxRateAgentShipper
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string AgentShipperAccountSno { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateOtherChargeCode))]
    public class TaxRateOtherChargeCode
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string OtherChargeCodeSNo { get; set; }
        public int IsExclude { get; set; }

    }

    [KnownType(typeof(TaxRateIssueCarrier))]
    public class TaxRateIssueCarrier
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string IssueAirlinecarrierSNo { get; set; }
        public int IsExclude { get; set; }

    }
    [KnownType(typeof(TaxRateFlightNo))]
    public class TaxRateFlightNo
    {
        public int SNo { get; set; }
        public int RateAirlineTaxMasterSNo { get; set; }
        public string FlightNo { get; set; }
        public int IsExclude { get; set; }

    }
}
