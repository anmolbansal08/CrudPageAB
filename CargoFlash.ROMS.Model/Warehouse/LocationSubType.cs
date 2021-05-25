using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Warehouse
{
    #region LocationSubType Description
    /*
	*****************************************************************************
	Class Name:		LocationSubType   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		21 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(LocationSubType))]
    public class LocationSubType
    {

        public int SNo { get; set; }
        public string SubLocationType { get; set; }
        public string SubLocationCode { get; set; }
        public bool IsActive { get; set; }      
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }        
        public string Active { get; set; }       

    }
}
