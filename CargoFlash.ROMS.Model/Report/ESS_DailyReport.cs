using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region ESS Description
    /*
	*****************************************************************************
	Class Name:		ESS_Daily Report   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shivali Thakur
	Created On:		11 02 1992
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ESS_DailyReport))]
    public class ESS_DailyReport
    {
        public String FromDate { get; set; }
        public String ToDate { get; set; }
     
       
    }
}
