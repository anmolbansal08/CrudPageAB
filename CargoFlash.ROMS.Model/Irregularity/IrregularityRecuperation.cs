using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Irregularity
{
    #region IrregularityPacking Description
    /*
	*****************************************************************************
	Class Name:		IrregularityPacking   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		12 oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(IrregularityRecuperation))]
    public class IrregularityRecuperation
    {
        public int SNo { get; set; }
        public string RecuperationType { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
    }
}
