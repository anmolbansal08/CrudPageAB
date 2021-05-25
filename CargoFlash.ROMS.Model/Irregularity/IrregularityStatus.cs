using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Irregularity
{
    #region IrregularityStatus Description
    /*
	*****************************************************************************
	Class Name:		IrregularityStatus   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		14 oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(IrregularityStatus))]
    public class IrregularityStatus
    {
        public int SNo { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
       
        public string Active { get; set; }
    }
}
