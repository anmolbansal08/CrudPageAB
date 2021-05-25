using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Country Description
    /*
	*****************************************************************************
	Class Name:		Country   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		24 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Country))]
    public class Country
    {
        public int SNo { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public Nullable<int> CurrencySNo { get; set; }
        public string CurrencyCode { get; set; }
        public string Text_CurrencyCode { get; set; }
        public string Continent { get; set; }
        public string Text_Continent { get; set; }
        public string IATAAreaCode { get; set; }
        public string Text_IATAAreaCode { get; set; }
        public string ISDCode { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public bool IsDiscountOnTactRate { get; set; }
        public string Text_DiscountOnTactRate { get; set; }

    }
}
