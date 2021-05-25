using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Accounts
{
    #region Ledger Description
    /*
	*****************************************************************************
	Class Name:		Ledger   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		26 Dec 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Ledger))]
    public class Ledger
    {

        public int SNo { get; set; }
        public string LedgerCode { get; set; }
        public string LedgerName { get; set; }      
        public bool IsPayable { get; set; }      
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }        
        public string Payable { get; set; }
        
    }
   
}
