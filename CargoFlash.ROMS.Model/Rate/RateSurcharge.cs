using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    #region RateSurcharge Description
    /*
	*****************************************************************************
	Class Name:		Rate Surcharge   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shahabz Akhtar
	Created On:		14 Jan 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(RateSurcharge))]
    public class RateSurcharge
    {
        public int SNo { get; set; }
        public String SurchargeName { get; set; }
        public int SurchargeTypeSNo { get; set; }
        public int ProductSNo { get; set; }
        public int OriginSNo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string CommoditySNo { get; set; }
        public string SHCSNo { get; set; }
       
       
        public bool IsActive { get; set; }
        public string UpdatedBy { get; set; }
       
        public String Active { get; set; }
        public string CreatedBy { get; set; }
        //public String Text_CountryCode { get; set; }
        public String Text_SurchargeTypeSNo { get; set; }
        public String Text_OriginSNo { get; set; }
        public String Text_CommoditySNo { get; set; }
        public String Text_SHCSNo { get; set; }
        public string ActionType { get; set; }
        public string strData { get; set; }
        public string Text_ValidFrom { get; set; }
        public string Text_ValidTo { get; set; }
        public string Text_ProductSNo { get; set; }
        public List<RateSurchargeSlab> RateSurchargeSlab { get; set; }
    }

    [KnownType(typeof(RateSurchargeSlab))]
    public class RateSurchargeSlab
    {
        public int SNo { get; set; }
        public Decimal StartWeight { get; set; }
        public Decimal EndWeight { get; set; }
       
        public int BasedOn { get; set; }
        public Decimal Amount { get; set; }
        public int BasedONSNo { get; set; }
        public int SurchargeSNo { get; set; }
        public int SHCSNo { get; set; }
       
       
       

    }
}
