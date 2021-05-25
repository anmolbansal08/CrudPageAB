using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Tariff
{
    #region RateAirlineMaster Description
    /*
	*****************************************************************************
	Class Name:		RateAirlineMaster   
	Purpose:		This class used to handle Rate Airlin eMaster
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Madhav Kumar Jha
	Created On:		7 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(RateAirlineMaster))]
    public class RateAirlineMaster
    {
        /// <summary>
        /// 
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<int> AirlineSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_AirlineSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 
        /// <summary>
        /// Name: Anshul verma 
        ///  Date: 22-Feb-2017
        ///   Work: Add two field TruckCode and AirportName Property.

        /// </summary>
        public string TruckCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_TruckCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AirportName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_AirportName { get; set; }



        public Nullable<int> RateType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_RateType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //  public string RateClassCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //  public Nullable<int> CommoditySubGroupSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //  public string Text_CommoditySubGroupSNo { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        /// 


        // public Nullable<int> CommoditySNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        // public string Text_CommoditySNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public Nullable<int> SHCSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_SHCSNo { get; set; }
        public Nullable<int> SPHCGroupSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_SPHCGroupSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<int> WeightType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_WeightType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public Nullable<int> OfficeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_OfficeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public Nullable<int> AccountSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public string Text_AccountSNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        // public Nullable<int> OriginZoneSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_OriginZoneSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //  public Nullable<int> DestinationZoneSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_DestinationZoneSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public Nullable<int> OriginCitySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_OriginCitySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public Nullable<int> DestinationCitySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_DestinationCitySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string OriginCityCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public string DestinationCityCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<int> OriginAirportSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_OriginAirportSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>

        public Nullable<int> DestinationAirportSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_DestinationAirportSNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        //public Nullable<int> ProductSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_ProductSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public Nullable<int> FlightTypeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        // public string Text_FlightTypeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<int> CurrencySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_CurrencySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal MinimumRate { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal Tax { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public bool IsGlobalSurCharge { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public String GlobalSurCharge { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsGlobalDueCarrier { get; set; }
        public string Text_IsGlobalDueCarrier { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public String GlobalDueCarrier { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidFrom { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidTo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Remarks { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsApproved { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public String Approved { get; set; }
        /// <summary>
        /// 
        /// </summary>

        public bool IsActive { get; set; }
        public string Text_IsActive { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public String Active { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CreatedBy { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UpdatedBy { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public int AccountGroupSNo { get; set; }
        ///// <summary>
        ///// 
        ///// </summary>
        //public string Text_AccountGroupSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public string Text_CommodityPackageSNo { get; set; }
        ///// <summary>
        ///// 
        ///// </summary>
        //public int CommodityPackageSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>

        public Nullable<int> TruckType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_TruckType { get; set; }



    }
    [KnownType(typeof(RateAirlineMasterGridData))]
    public class RateAirlineMasterGridData
    {
        public string SNo { get; set; }

        // public string AirlineCode { get; set; }
        public string Text_TruckType { get; set; }
        public string Text_SHCSNo { get; set; }
        public string TruckCode { get; set; }
        public string AirlineName { get; set; }
        // public string OfficeName { get; set; }
        // public string Text_AccountSNo { get; set; }
        //public string AccountName { get; set; }
        // public string ProductName { get; set; }
        public string Text_SPHCSNo { get; set; }
        public string SPHCGroupName { get; set; }
        // public string Text_CommoditySNo { get; set; }
        // public string CommoditySubGroupName { get; set; }
        // public string FlightTypeName { get; set; }
        // public string OriginCityCode { get; set; }
        // public string DestinationCityCode { get; set; }
        public string OriginAirportCode { get; set; }
        public string DestinationAirportCode { get; set; }
        //  public string ValidFrom { get; set; }
        // public string ValidTo { get; set; }

        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string Active { get; set; }
    }
    [KnownType(typeof(RateAirlineTrans))]
    public class RateAirlineTrans
    {
        public Int32 SNo { get; set; }
        public Int32 RateAirlineMasterSNo { get; set; }
        public string SlabName { get; set; }
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public decimal Value { get; set; }
    }
    [KnownType(typeof(RateDueCarrierTrans))]
    public class RateDueCarrierTrans
    {
        public Int32 SNo { get; set; }
        public Int32 RateAirlineMasterSNo { get; set; }
        public Int32 DueCarrierSNo { get; set; }
        public Int32 Mandatory { get; set; }
        public Int32 HdnName { get; set; }
        public string Name { get; set; }
        public string IsCarrier { get; set; }
        public string Carrier { get; set; }
        public string FreightType { get; set; }
        public Int32 IsFreightType { get; set; }
        public Boolean IsChargeableWeight { get; set; }
        public Int32 DueCarrierTransSNo { get; set; }
        public bool IsMandatory { get; set; }
        public string ChargeableWeight { get; set; }
        public decimal Value { get; set; }
        public decimal MinimumValue { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }

    }

    [KnownType(typeof(RateAirlineCustomCharges))]
    public class RateAirlineCustomCharges
    {
        public Int32 SNo { get; set; }
        public Int32 RateAirlineMasterSNo { get; set; }
        public string Charge_Name { get; set; }
        //public Int32 Minimum { get; set; }
        //public Int32 Maximum { get; set; }
        public decimal Value { get; set; }
    }

    [KnownType(typeof(RateAirlineMasterCollection))]
    public class RateAirlineMasterCollection
    {
        public List<RateAirlineMaster> rateAirlineMaster { get; set; }
        public List<RateAirlineTrans> rateAirlineTrans { get; set; }
        public List<RateDueCarrierTrans> rateDueCarrierTrans { get; set; }
        public List<RateAirlineCustomCharges> rateAirlineCustomCharges { get; set; }


    }
}
