using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region CustomerType Description
    /*
	*****************************************************************************
	Class Name:		CustomerType      
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		13 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(CustomerType))]
    public class CustomerType
    {
        public Int32 SNo { get; set; }
        public string CustomerTypeName { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
        public bool IsMandatory { get; set; }
        public String Mandatory { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
    }
}
