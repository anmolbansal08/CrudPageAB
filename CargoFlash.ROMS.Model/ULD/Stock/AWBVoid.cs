using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Stock
{
    #region AWB Lost
    /*
	*****************************************************************************
	Class Name:		AWB Void   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		5 nov 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(AWBVoid))]
    public class AWBVoid
    {
        public int StartRange { get; set; }
        public int EndRange { get; set; }
        public string AWBNumber { get; set; }
        public string AirlineName { get; set; }
        public String CreatedBy { get; set; }
        public String UpdatedOn { get; set; }
    }
}
