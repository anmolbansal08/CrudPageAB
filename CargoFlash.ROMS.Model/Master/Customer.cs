using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Customer Description
    /*
	*****************************************************************************
	Class Name:		Customer   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		17 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(Customer))]
    public class Customer
    {
        public int SNo { get; set; }
        public String CustomerTypeSNo { get; set; }
        public string CustomerTypeName { get; set; }
        public String AccountSNo { get; set; }
        public string AccountName { get; set; }
        public string SecurityCode { get; set; }
        public string AccountNo { get; set; }
        public string CitySNo { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public string CityCode { get; set; }
        public string CustomerNo { get; set; }
        public bool IsActive { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string Active { get; set; }
        public string Text_CustomerTypeSNo { get; set; }
        public string Text_CityCode { get; set; }
        public string Text_AccountSNo { get; set; }
        public bool IsFocConsignee { get; set; }
        public string FocConsignee { get; set; }
        public bool IsConsigneeAsForwarder { get; set; }
        public string ConsigneeAsForwarder { get; set; }
        public string CustomCode { get; set; }
        public string AgreementNumber { get; set; }

        public string TaxID { get; set; }
    }

    [KnownType(typeof(AuthorizedPersonal))]
    public class AuthorizedPersonal
    {
        public int SNo { get; set; }
        public string CustomerSNo { get; set; }
        public string Name { get; set; }
        public string IdCardNo { get; set; }
        public string MobileNo { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string IdCardName { get; set; }
        public string AttachIdCardName { get; set; }
        public string AuthorizationLetterName { get; set; }
        public string AttachAuthorizationLetterName { get; set; }
        public string PhotoName { get; set; }
        public string AttachPhotoName { get; set; }
    }
}
