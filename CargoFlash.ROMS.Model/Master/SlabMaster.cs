using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region SlabMaster Description
    /*
	*****************************************************************************
	Class Name:		SlabMaster   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		11 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(SlabMaster))]
    public class SlabMaster
    {
        public int SNo { get; set; }
        public String SlabTitle { get; set; } 
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public bool IsDefault { get; set; }
        public string Default{get;set;}
        public int SlabLevel { get; set; }
        public string Slab { get; set; }
        public string Text_Slab { get; set; }
        public String Text_SlabLevel { get; set; } 
        //public string CountryCode { get; set; }
        //public string CitySNo { get; set; }
        //public string CityCode { get; set; }
        public bool IsActive { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public String Active { get; set; }
        //public String Text_CountryCode { get; set; }
        //public String Text_CityCode { get; set; }
        //public String Text_AirlineName { get; set; }
    }
}
