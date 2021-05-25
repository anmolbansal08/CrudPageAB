using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Handed Over Description
    /*
	*****************************************************************************
	Class Name:		Handed Over
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		22 June 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(HandedOver))]
    public class HandedOver
    {
      
        public String FromDate { get; set; }
        
        public String ToDate { get; set; }
    
    }
}
