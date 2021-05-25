using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    #region DueCarrierSpecialHandlingTrans Description
    /*
	*****************************************************************************
	Class Name:		DueCarrierSpecialHandlingTrans   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		27 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(DueCarrierSpecialHandlingTrans))]
    public class DueCarrierSpecialHandlingTrans
    {
        public int SNo { get; set; }
        public int DueCarrierSNo { get; set; }
        public string SpecialHandlingCodeSNo { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        public String HdnSpecialHandlingCodeSNo { get; set; }
    }
}
