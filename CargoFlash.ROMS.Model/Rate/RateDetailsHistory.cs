using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Rate
{
    #region RateDeatilsHistory Description
    /*
	*****************************************************************************
	Class Name:		RateDeatilsHistory   
	Purpose:		This class used to contain RateDeatilsHistory properties.
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Laxmikanta
	Created On:		23 Feb 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(RateDetailsHistory))]
    public class RateDetailsHistory
    {
        public int SNo { get; set; }
        public string AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string Charge { get; set; }
        public string DueCarrierCodeSNo { get; set; }
        public string OfficeSNo { get; set; }
        public string Text_OfficeSNo { get; set; }
        public string RateTypeSNo { get; set; }
        public string Text_RateTypeSNo { get; set; }
        public string OCCodeSNo { get; set; }
        public string Text_OCCodeSNo { get; set; }
        public string Active { get; set; }
        public string OriginType { get; set; }
        public string OriginSNo { get; set; }
        public string DestinationType { get; set; }
        public string DestinationSNo { get; set; }
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
        public string Text_OriginType { get; set; }
        public int DestinationLevel { get; set; }
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
        //public DateTime ValidFrom { get; set; }
        //public DateTime ValidTo { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string Remarks { get; set; }
        public int Unit { get; set; }
        public string UnitText { get; set; }
        public int PaymentType { get; set; }
        public string Text_PaymentType { get; set; }
        public int Status { get; set; }
        public string Text_Active { get; set; }
        public decimal MinimumCharge { get; set; }

        public decimal MaximumCharge { get; set; }
        public int ChargeType { get; set; }
        public string Text_ChargeType { get; set; }
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
    }
}
