using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Import CSR Description
    /*
	*****************************************************************************
	Class Name:		Import CSR
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		11 July 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ImportCSR))]
    public class ImportCSR
    {
      
        public String FromDate { get; set; }
        
        public String ToDate { get; set; }
    
    }
}
