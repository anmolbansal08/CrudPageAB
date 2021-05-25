using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Warehouse
{
    #region LocationType Description
    /*
	*****************************************************************************
	Class Name:		LocationType   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta.
	Created On:		16 Jan 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(LocationType))]
    public class LocationType
    {
        public int SNo { get; set; }
        public string LocationType1 { get; set; }
        public string LocationCode { get; set; }
        public int OpsType { get; set; }
        public string Text_OpsType { get; set; }
        public bool IsActive { get; set; }
        public bool IsEditable { get; set; }
        public string Editable { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string Active { get; set; }  
    }
}
