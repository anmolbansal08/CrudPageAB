using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Irregularity
{
    #region IrregularityNonDeliveryReason Description
    /*
	*****************************************************************************
	Class Name:		IrregularityNonDeliveryReason  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		12 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(IrregularityNonDeliveryReason))]
    public class IrregularityNonDeliveryReason
    {

        public int SNo { get; set; }
        public string NonDeliveryReason { get; set; }      
        public bool IsActive { get; set; }      
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }        
        public string Active { get; set; }       

    }
}
