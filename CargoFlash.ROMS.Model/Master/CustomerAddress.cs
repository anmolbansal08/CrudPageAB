using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Customer Address Description
    /*
	*****************************************************************************
	Class Name:		CustomerAddress   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(CustomerAddress))]
    public class CustomerAddress
    {
        public int SNo { get; set; }
        public int CustomerSNo { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        // public string CityName { get; set; }
        // public string CountryCode { get; set; }

        //Added by Pankaj Khanna
        public string CitySNo { get; set; }
        public string CountrySNo { get; set; }

        public string State { get; set; }
        public string Street { get; set; }
        public string Address2 { get; set; }
        public string Town { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public string Telex { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public int IsPrimary { get; set; }
        public int IsActive { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public String Primary { get; set; }
        public String Active { get; set; }
        public String HdnCountrySNo { get; set; }
        public String HdnCitySNo { get; set; }

    }
}
