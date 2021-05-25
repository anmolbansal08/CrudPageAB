using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
  
{
    #region 
    /*
	*****************************************************************************
	Class Name:		ULDStatisticReports  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Sushant Kumar Nayak
	Created On:		05-02-2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDStatisticReports))]
    public class ULDStatisticReports
    {
        public string PurchasedFrom { get; set; }
        public string ULDType { get; set; }
        public string ULDID { get; set; }
        public string TotalMovement { get; set; }
        public string Price { get; set; }
        public string TotalRepairCost { get; set; }
        public string PurchasedDate { get; set; }
        public string WriteOffDate { get; set; }
        public string ULDTypewiseCount { get; set; }
        public string AverageLifeDays { get; set; }
        public string AirportCode { get; set; }

       
       
    }
     
   

}
