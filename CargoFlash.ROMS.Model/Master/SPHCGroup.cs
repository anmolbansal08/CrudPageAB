using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region SPHC Group Description
    /*
	*****************************************************************************
	Class Name:		SPHCGroup   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		21 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(SPHCGroup))]
    public class SPHCGroup
    {
        public int SNo { get; set; }
        public String Name { get; set; }
        public string SHCCode { get; set; }
        public string Text_SHCCode { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Active { get; set; }
        
    }

    //[KnownType(typeof(SPHCGroupTrans))]
    //public class SPHCGroupTrans
    //{
    //    //public int SNo { get; set; }
    //    public int SPHCGroupSNo { get; set; }
    //    public String SPHCSNo { get; set; }
    //    //public int IsActive { get; set; }
    //    //public string CreatedBy { get; set; }
    //    //public string UpdatedBy { get; set; }
    //    //public String Active { get; set; }
    //    public String HdnSPHCSNo { get; set; }
    //}
}
