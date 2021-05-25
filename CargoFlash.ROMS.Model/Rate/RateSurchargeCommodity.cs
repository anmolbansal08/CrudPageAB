using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Tariff
{
    #region RateSurchargeCommodity Description
    /*
	*****************************************************************************
	Class Name:		RateSurchargeSPHC   
	Purpose:		This class used to handle RateSurchargeCommodity
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Parvez Khan
	Created On:		7 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
     [KnownType(typeof(RateSurchargeCommodity))]
    public class RateSurchargeCommodity
    {
        public int SNo { get; set; }
        public string SurChargeName { get; set; }
        public int CommoditySNo { get; set; }
        public int CommoditySubGroupSNo { get; set; }
        
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public int ValueType { get; set; }
        public decimal Value { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public bool IsInternational { get; set; }
        public bool IsActive { get; set; }
        public bool IsEditable { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        public String Editable { get; set; }
        public string Text_ValueType { get; set; }
        public string Text_CommoditySubGroupSNo { get; set; }
        public string Text_CommoditySNo { get; set; }
    }
}
