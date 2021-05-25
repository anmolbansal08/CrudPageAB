using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Petty Description
    /*
	*****************************************************************************
	Class Name:		Petty
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		20 Feb 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Petty))]
    public class Petty
    {
        
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        

     
        public String Dt { get; set; }
       
    }
}
