using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
  
{
    #region City Wise ULD Allocation
    /*
	*****************************************************************************
	Class Name:		ULDStockReportDetails  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Sushant Kumar Nayak
	Created On:		20-11-2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDStockReportDetails))]
    public class ULDStockReportDetails
    {
        public string AirportCode { get; set; }
        public string ULDType { get; set; }
        public string ULDCategory { get; set; }
        public string ULDNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public string Condition { get; set; }
        public string Idledays { get; set; }
        public string AddOncount { get; set; }
        public string TypeCount { get; set; }
        public string TotalULD { get; set; }
        public string LostRemarks { get; set; }
        public string AirLine { get; set; }
        public string Ownership { get; set; }
        public string ULDId { get; set; }
        public string IdleDays { get; set; }
        public string IdleDaysval { get; set; }
       
       
    }
     
   

}
