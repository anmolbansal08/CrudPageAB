using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    #region RateServiceType Description
    /*
	*****************************************************************************
	Class Name:		RateServiceType   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Parvez Khan
	Created On:		5 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(RateServiceType))]
   public class RateServiceType
    {
        public int SNo { get; set; }
        public string ServiceName { get; set; }
        public bool IsActive { get; set; }
        public bool IsEditable { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        public String Editable { get; set; }
    }
}
