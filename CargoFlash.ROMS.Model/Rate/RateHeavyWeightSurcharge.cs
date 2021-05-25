using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Rate
{

    /*
    *****************************************************************************
    Class Name:		Heavey Weight Surcharge      
    Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
    Company:		CargoFlash 
    Author:			Madhav Kumar Jha
    Created On:		21 March 2014
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    [KnownType(typeof(RateHeavyWeightSurcharge))]
    public class RateHeavyWeightSurcharge
    {

        /// <summary>
        /// SNo is primary value in Entity Account
        /// </summary>
        public Int32 SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string HeavyWeightName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal StartWeight { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal EndWeight { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int ValueType { get; set; }

        public string Text_ValueType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal Value { get; set; }
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
        public bool IsInternational { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string International { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool IsActive { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Active { get; set; }
        /// <summary>
        /// 
        /// </summary>


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
        public bool IsEditable { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Editable { get; set; }

        /// </summary>
        
        /// <summary>
        /// 
        /// </summary>
    

    }

    [KnownType(typeof(RateHeavyWeightSurchargeGridData))]
    public class RateHeavyWeightSurchargeGridData
    {
        public Int32 SNo { get; set; }
        public string HeavyWeightName { get; set; }
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public Int32 ValueType { get; set; }
        public string Text_ValueType { get; set; }
        public decimal Value { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }

        public string Active { get; set; }


    }

    public class RateHeavyWeightCommodityExemption
    {
        public Int32 SNo { get; set; }
        public Int32 RateHeavyWeightSurchargeSNo { get; set; }
        public Int32 CommoditySNo { get; set; }
        public Int32 HdnCommodityCode { get; set; }
        public string CommodityCode { get; set; }
        public Int32 CommoditySubGroupSNo { get; set; }
        public Int32 HdnCommoditySubGroupName { get; set; }
        public string CommoditySubGroupName { get; set; }
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public Int32 IsActive { get; set; }
        public string Active { get; set; }


    }
    public class RateHeavyWeightSPHCExemption
    {
        public Int32 SNo { get; set; }
        public Int32 RateHeavyWeightSurchargeSNo { get; set; }
        public Int32 SPHCSNo { get; set; }
        public string Code { get; set; }
        public Int32 HdnCode { get; set; }
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public Int32 IsActive { get; set; }
        public string Active { get; set; }
 

    }
}
