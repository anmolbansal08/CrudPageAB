using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region OffloadReason Description
    /*
	*****************************************************************************
	Class Name:		OffloadReason      
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			PRITI YADAV
	Created On:		15 Apr 2020
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(OffloadReason))]
    public class OffloadReason
    {
        public Int32 SNo { get; set; }
        public string Reason { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
    }
}
