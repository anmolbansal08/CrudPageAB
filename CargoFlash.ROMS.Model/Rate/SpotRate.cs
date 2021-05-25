using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Rate
{
    #region RateSurcharge Description
    /*
	*****************************************************************************
	Class Name:	    Spot Rate  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Vikram Singh
	Created On:		14 Jan 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(SpotRate))]
    public class SpotRate
    {


        //       SNo,ReferenceNo,AWBType,AirlineSNo,RateAdhocType,
        //AWBSNo,OriginCitySNo,DestinationCitySNo,OfficeSNo,
        //AccountSNo,ProductSNo,CommoditySNo,Pieces,WeightType,
        //GrossWeight,PlusGrossVariance,PlusVarainceGrossPercentage,
        //MinusGrossVariance,MinusVarainceGrossPercentage,VolumeUnit,Volume,
        //PlusVolumeVariance,PlusVarainceVolumePercentage,MinusVolumeVariance,
        //MinusVarainceVolumePercentage,ChareableWeight,ValidTo,SectorRate,
        //RequestedRate,ApprovedRate,IsApproved,IsActive,CreatedOn,CreatedBy,
        //UpdatedBy,UpdatedOn,ApprovedBy,ApprovedDate

        public int? SNo { get; set; }
        public int? AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public int? AWBTypeSNo { get; set; }
        public string Text_AWBTypeSNo { get; set; }
        public int? RateAdhocType { get; set; }
        public string Text_RateAdhocType { get; set; }
        public string AWBcode { get; set; }
        public string AWBNo { get; set; }
        public string AWBSNo { get; set; }
        public string OriginCitySNo { get; set; }
        public string Text_OriginCitySNo { get; set; }
        public int? DestinationCitySNo { get; set; }
        public string Text_DestinationCitySNo { get; set; }
        public int? OfficeSNo { get; set; }
        public string Text_OfficeSNo { get; set; }
        public int? AccountSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public int? ProductSNo { get; set; }
        public string Text_ProductSNo { get; set; }
        public int? CommoditySNo { get; set; }
        public string Text_CommoditySNo { get; set; }
        public int? Pieces { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTill { get; set; }
        public string Reference { get; set; }
        public int? WeightType { get; set; }
        public int? VolumeUnit { get; set; }
        public decimal? GrossWeight { get; set; }
        public int? PlusVarainceGrossPercentage { get; set; }
        public int? MinusVarainceGrossPercentage { get; set; }
        public decimal? Volume { get; set; }
        public int? PlusVarainceVolumePercentage { get; set; }
        public int? MinusVarainceVolumePercentage { get; set; }
        public decimal? ChargeableWeight { get; set; }
        public decimal? SectorRate { get; set; }
        public decimal? RequestedRate { get; set; }
        public int? CurrencySNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public int? BasedOnSNo { get; set; }
        public string Text_BasedOnSNo { get; set; }
        public bool AllInRate { get; set; }
        public string SHCSNo { get; set; }
        public string Text_SHCSNo { get; set; }
        public decimal? ApprovedRate { get; set; }
     
        public int? IsApproved { get; set; }
        public int? ApprovedBy { get; set; }
        public bool IsCommissionable { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public int? UpdatedBy { get; set; }
        public int? CreatedBy { get; set; }
        public string Text_IsApproved { get; set; }


        public string Text_AllinRate { get; set; }
        public string Text_IsCommissionable { get; set; }
        public string ApprovedUser { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public string Text_WeightType { get; set; }
        public string Text_VolumeUnit { get; set; }

        public string ActionType { get; set; }

        public Nullable<DateTime> ValidFr { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }

        public int? CodeType { get; set; }
        public string Text_CodeType { get; set; }
        public int? CodeNo { get; set; }

        public string CompaignSpotCode { get; set; }
        public bool IsCodeUsed { get; set; }
        public string Text_IsCodeUsed { get; set; }
        public string spotcode { get; set; }

        //public int CompaignType { get; set; }
        public string CampaignType { get; set; }
        public int? HdnCampaignType { get; set; }

        public int? HdnNoofCodes { get; set; }
        public int? HdnPageSNo { get; set; }
        public int? IsSingleCompaignCode { get; set; }
        public int? NoofCompaignAgentTransaction { get; set; }
        public int? NoofTransaction { get; set; }
        public int? HdnCodeType { get; set; }
        //public string CompaignSingleCode { get; set; }

        public string Name { get; set; }
        public int IsAgentGroup { get; set; }
        public string AccountGroupSNo { get; set; }
        public string Text_AccountGroupSNo { get; set; }
        public bool IsFlatRate { get; set; }
        public bool IsWeiveDueCarrierCharges { get; set; }
       
    }

    [KnownType(typeof(SpotRateRemarks))]
    public class SpotRateRemarks
    {
        public int? SNo { get; set; }
        public int? RateAirlineAdhocRequestSNo { get; set; }
        public string Remarks { get; set; }
        public bool IsAgentRemarks { get; set; }

        public string CreatedBy { get; set; }

    }

    [KnownType(typeof(SpotRateFlightInfo))]
    public class SpotRateFlightInfo
    {
        public int? SNo { get; set; }
        public int? SpotRateSNo { get; set; }
        public string FlightOriginSNo { get; set; }
        public int? HdnFlightOriginSNo { get; set; }
        public string FlightDestinationSNo { get; set; }
        public int? HdnFlightDestinationSNo { get; set; }
        public string FlightNumSNo { get; set; }
        public string HdnFlightNumSNo { get; set; }
        public string FlightDate { get; set; }

    }

    [KnownType(typeof(SpotRateULDAirlineSLAB))]
    public class SpotRateULDAirlineSLAB
    {
        public int? SNo { get; set; }
        public int? SpotRateSNo { get; set; }
        public int? HdnULDSNo { get; set; }
        public string ULDSNo { get; set; }
        //  public int SlabSNo { get; set; }

        // public string SLABName { get; set; }
        public int? HdnRateClassSNo { get; set; }
        public string Text_RateClassSNo { get; set; }
        public string RateClassSNo { get; set; }
        public decimal? Rate { get; set; }
        public decimal? RequestedRate { get; set; }
        public decimal? ApprovedRate { get; set; }
        public int IsULDRate { get; set; }

        // public string Based { get; set; }
    }





    [KnownType(typeof(SpotCodeApplied))]
    public class SpotCodeApplied
    {
        public int AWbSNo { get; set; }
        public int OriginSno { get; set; }
        public int DestinationCitySno { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal Volume { get; set; }
        public decimal ChargeableWeight { get; set; }
        public string SpotCode { get; set; }
        public int SpotSno { get; set; }
        public int UpdatedBy { get; set; }
        public int CodeType { get; set; }
        public string CampaignCode { get; set; }
        public int AccountSNo { get; set; }
    }


    [KnownType(typeof(AppliedSpotRateReport))]
    public class AppliedSpotRateReport
    {
        public string AWBNo { get; set; }
        public string OfficeName { get; set; }
        public string CityName { get; set; }
        public string AgentName { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal TotalGrossWeight { get; set; }
        public decimal TotalChargeableWeight { get; set; }
        public string ProductName { get; set; }
        public string IsSingleCompaignCode { get; set; }
        public decimal MKTRate { get; set; }
        public decimal MKTFreight { get; set; }
        public string SpotCode { get; set; }
        public string AppliedBy { get; set; }
        public string AppliedOn { get; set; }
    }

    [KnownType(typeof(ApprovalRateInformation))]

    public class ApprovalRateInformation

    {
        public int AWBNumber { get; set; }
        public string SpotCode { get; set; }
        public int CodeTypeValue { get; set; }

    }
}
