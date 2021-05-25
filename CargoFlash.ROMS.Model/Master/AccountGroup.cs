using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Account Group Description
    /*
	*****************************************************************************
	Class Name:		AccountGroup   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		21 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(AccountGroup))]
    public class AccountGroup
    {
        public int SNo { get; set; }
        public String Name { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
    }


    [KnownType(typeof(AccountGroupTrans))]
    public class AccountGroupTrans
    {
        public int SNo { get; set; }
        public int AccountGroupSNo { get; set; }
        public String AccountSNo { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        public String HdnAccountSNo { get; set; }
    }
}
