using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Commodity Density Group Description
    /*
	*****************************************************************************
	Class Name:		CommodityDensityGroup   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		19 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(CommodityDensityGroup))]
    public class CommodityDensityGroup
    {
        public int SNo { get; set; }
        public string GroupName { get; set; }
        public string Divisor { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
