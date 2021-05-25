using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Commodity Package Description
    /*
	*****************************************************************************
	Class Name:		CommodityPackage   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		22 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(CommodityPackage))]
    public class CommodityPackage
    {
        public int SNo { get; set; }
        public String Name { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
    }


    [KnownType(typeof(CommodityPackageTrans))]
    public class CommodityPackageTrans
    {
        public int SNo { get; set; }
        public int CommodityPackageSNo { get; set; }
        public String CommoditySNo { get; set; }
        public String CommodityGroupSNo { get; set; }
        public String CommoditySubGroupSNo { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        public String HdnCommoditySNo { get; set; }
        public String HdnCommodityGroupSNo { get; set; }
        public String HdnCommoditySubGroupSNo { get; set; }
    }
}
