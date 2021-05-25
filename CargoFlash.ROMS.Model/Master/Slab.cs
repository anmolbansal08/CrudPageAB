using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Slab Description
    /*
	*****************************************************************************
	Class Name:		Slab   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		12 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(Slab))]
    public class Slab
    {
        public int SNo { get; set; }
        public int SlabMasterSNo { get; set; }
        public string SlabName { get; set; }
        public string StartWeight { get; set; }
        public string EndWeight { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
    }
}
