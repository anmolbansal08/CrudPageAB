using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Credit Limit Description
    /*
	*****************************************************************************
	Class Name:		Credit Limit
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		14 July 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(CreditLimit))]
    public class CreditLimit
    {
      
        public String FromDate { get; set; }
        
        public String ToDate { get; set; }
    
    }
}
