using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Priority Description
    /*
	*****************************************************************************
	Class Name:		Priority   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shivang Srivastava.
	Created On:		05 March 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Priority))]
    public class Priority
    {
        public int SNo { get; set; }
        public string Code { get; set; }
        public string PriorityName { get; set; }
        public string Value { get; set; }
        public bool IsActive { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string Active { get; set; }

    }
}
