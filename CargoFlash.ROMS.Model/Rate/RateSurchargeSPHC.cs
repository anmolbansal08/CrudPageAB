using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Tariff
{
    #region RateSurchargeSPHC Description
    /*
	*****************************************************************************
	Class Name:		RateSurchargeSPHC   
	Purpose:		This class used to handle RateSurchargeSPHC
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

    [KnownType(typeof(RateSurchargeSPHC))]
     public class RateSurchargeSPHC
    {

        public int SNo { get; set; }
        public string SurChargeName { get; set; }
        public int SPHCSNo { get; set; } 
        public decimal StartWeight { get; set; }
        public decimal EndWeight { get; set; }
        public int ValueType { get; set; }
        public decimal Value { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public bool IsInternational { get; set; }
        //public string International { get; set; }
        public bool IsActive { get; set; }
        public bool IsEditable { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        public String Editable { get; set; }
        public string Text_ValueType { get; set; }
        public string Text_SPHCSNo { get; set; }
    }
}
