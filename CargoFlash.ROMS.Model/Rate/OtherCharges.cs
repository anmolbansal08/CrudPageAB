using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Rate
{
    #region OtherCharges Description
    /*
	*****************************************************************************
	Class Name:		OtherCharges   
	Purpose:		This class used to contain other charges properties.
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Vipin Kumar
	Created On:		23 Jan 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(OtherCharges))]
    public class OtherCharges
    {
        public int SNo { get; set; }
        public string AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string DueCarrierCodeSNo { get; set; }
        public string Text_OCCodeSNo { get; set; }
        public int OtherChargeType { get; set; }
        public bool IsOtherChargeMandatory { get; set; }
        public string OtherChargeMandatory { get; set; }
        public string DueChargeTypeText { get; set; }
        public string DueChargeType { get; set; }
        public bool IsTaxable { get; set; }
        public string Taxable { get; set; }
        public bool IsCommissionable { get; set; }
        public string Commissionable { get; set; }
        public int OriginLevel { get; set; }
        public int OriginType { get; set; }
        public string Text_OriginType { get; set; }
        public int DestinationLevel { get; set; }
        public int DestinationType { get; set; }
        public string Text_DestinationType { get; set; }
        public string ChargeTypeText { get; set; }
        public int OriginZoneSNo { get; set; }
        public int DestinationZoneSNo { get; set; }
        public int OriginCitySNo { get; set; }
        public int DestinationCitySNo { get; set; }
        public int OriginAirPortSNo { get; set; }
        public string Text_OriginAirPortSNo { get; set; }
        public int DestinationAirPortSNo { get; set; }
        public string Text_DestinationAirPortSNo { get; set; }
        public string Text_OriginSNo { get; set; }
        public string Text_DestinationSNo { get; set; }
        public int OriginCountrySNo { get; set; }
        public int DestinationCountrySNo { get; set; }
        public int OriginRegionSNo { get; set; }
        public int DestinationRegionSNo { get; set; }
        public int CurrencySNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public string Remarks { get; set; }
        public int Unit { get; set; }
        public string UnitText { get; set; }
        public int PaymentType { get; set; }
        public string Text_PaymentType { get; set; }
        public int Status { get; set; }
        public string Text_Active { get; set; }
        public decimal MinimumCharge { get; set; }
        public decimal Charge { get; set; }
        public decimal MaximumCharge { get; set; }
        public int ChargeType { get; set; }
        public string Text_ChargeType { get; set; }
        public string ReferenceNumber { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedOn { get; set; }
        public int SlabCount { get; set; }
        public int RemarksCount { get; set; }
        public List<OtherChargesRemarks> listOtherChargesRemarks { get; set; }
        public List<OtherChargesSlabParameter> listOtherChargesSLABParameter { get; set; }
        public List<OtherChargesRateParameter> listOtherChargesRateParameter { get; set; }
        public int ApplicableOn { get; set; }
        public string Text_ApplicableOn { get; set; }
        public bool IsReplanCharges { get; set; }
        public string Text_IsReplanCharges { get; set; }
    }
    [KnownType(typeof(OtherChargesGrid))]
    public class OtherChargesGrid
    {
        public string SNo { get; set; }
        public string Airline { get; set; }
        public string OtherCharges { get; set; }
        public string ChargeType { get; set; }
        public string PaymentType { get; set; }
        public string Currency { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public string OriginLevel { get; set; }
        public string DestinationLevel { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string Status { get; set; }
        public string ReferenceNumber { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        //public string StartWeight { get; set; }
        //public string EndWeight { get; set; }
        //public string Rate { get; set; }
        //public string BasedOn { get; set; }
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
       
        public string Mandatory { get; set; }
        public string Taxable { get; set; }
        public string Commissionable { get; set; }
        public string Unit { get; set; }
        public string ApplicableOn { get; set; }
        public string IsReplanCharges { get; set; }
        public string MinimumCharge { get; set; }
        public string Charge { get; set; }
        public string Charge_Type { get; set; }
        public string AgentGroup { get; set; }
        public string AccountGroup_IsInclude { get; set; }
    }

    [KnownType(typeof(OtherChargesSlabParameter))]
    public class OtherChargesSlabParameter
    {
        public int SNo { get; set; }
        public int SlabSNo { get; set; }
        public int RateClassSNo { get; set; }
        public Decimal RateValue { get; set; }
        public string SlabName { get; set; }
        public Decimal StartWt { get; set; }
        public Decimal EndWt { get; set; }

        public int RateSNo { get; set; }
        public string Text_RateClassSNo { get; set; }
     
        public string Based { get; set; }
        
    }

    [KnownType(typeof(OtherChargesRateParameter))]
    public class OtherChargesRateParameter
    {
        public int SNo { get; set; }

        public string IssueCarrierSNo { get; set; }
        public string Text_IssueCarrierSNo { get; set; }
        public bool IEIssueCarrier { get; set; }

        public string FlightSNo { get; set; }
        public string Text_FlightSNo { get; set; }
        public bool IEFlight { get; set; }


        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public bool IEEtd { get; set; }

        public string Days { get; set; }
        public bool IEDays { get; set; }

        public string TransitStationsSNo { get; set; }
        public string Text_TransitStationsSNo { get; set; }
        public bool IETransitStation { get; set; }

        public string ProductSNo { get; set; }
        public string Text_ProductSNo { get; set; }
        public bool IEProduct { get; set; }

        public string AgentGroupSNo { get; set; }
        public string Text_AgentGroupSNo { get; set; }
        public bool IEAgentGroup { get; set; }

        public string CommoditySNo { get; set; }
        public string Text_CommoditySNo { get; set; }
        public bool IECommodity { get; set; }

        public string AccountSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public bool IEAccount { get; set; }

        public string SHCSNo { get; set; }
        public string Text_SHCSNo { get; set; }
        public bool IESHCS { get; set; }

        public string ShipperSNo { get; set; }
        public string Text_ShipperSNo { get; set; }
        public bool IEShipper { get; set; }

        public string SPHCGroupSNo { get; set; }
        public string Text_SPHCGroupSNo { get; set; }
        public bool IESPHCGroup { get; set; }
    }
    [KnownType(typeof(OtherChargesRemarks))]
    public class OtherChargesRemarks
    {
        public int SNo { get; set; }
        public string Remarks { get; set; }

    }

    [KnownType(typeof(OtherChargesRequest))]
    public class OtherChargesRequest
    {
        public string AirlineSNo { get; set; }
        public string OriginType { get; set; }
        public string OriginSNo { get; set; }
        public Decimal? recordID { get; set; }

    }
}
