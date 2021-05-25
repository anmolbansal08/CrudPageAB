using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    #region DueCarrier Description
    /*
	*****************************************************************************
	Class Name:		DueCarrier   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		26 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(DueCarrier))]
    public class DueCarrier
    {
        public int SNo { get; set; }
        public String Code { get; set; }
        public string Name { get; set; }
        public bool IsCarrier { get; set; }
        public string FreightType { get; set; }
        public bool IsMandatory { get; set; }
        public bool IsActive { get; set; }
        public bool IsEditable { get; set; }

        public bool IsShowOnCSR { get; set; }   //added by indra pratap singh---------//
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Carrier { get; set; }
        public String Mandatory { get; set; }
        public String Active { get; set; }
        public String Editable { get; set; }
        public String ShowOnCSR { get; set; }    //added by indra pratap singh---------//
        public String TempFreightType { get; set; }
    }
}
