using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Consignee Summary Description
    /*
	*****************************************************************************
	Class Name:		Cargo Ranking   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		08 June 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ConsigneeSummary))]
    public class ConsigneeSummary
    {
      
        public String FromDate { get; set; }
        public String ToDate { get; set; }

       // public String tablebuilder { get; set; }
       
    }
}
