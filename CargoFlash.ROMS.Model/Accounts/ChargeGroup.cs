using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Accounts
{
    #region ChargeGroup Description
    /*
	*****************************************************************************
	Class Name:		ChargeGroup   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		14 Nov 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ChargeGroup))]
    public class ChargeGroup
    {

        public int SNo { get; set; }
        public string GroupCode { get; set; }
        public string GroupName { get; set; }
        public string LedgerSno { get; set; }
        public string Ledger { get; set; }
        public string Text_LedgerSno { get; set; }

        public bool IsActive { get; set; }      
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }        
        public string Active { get; set; }
        
    }
   
}
