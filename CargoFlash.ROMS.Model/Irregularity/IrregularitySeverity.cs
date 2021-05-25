using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Irregularity
{
    #region IrregularitySeverity Description
    /*
	*****************************************************************************
	Class Name:		IrregularitySeverity   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		09 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(IrregularitySeverity))]
    public class IrregularitySeverity
    {

        public int SNo { get; set; }
        public string SeverityName { get; set; }      
        public bool IsActive { get; set; }      
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }        
        public string Active { get; set; }       

    }
}
