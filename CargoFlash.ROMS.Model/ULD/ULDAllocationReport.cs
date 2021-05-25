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
	Class Name:		CityWiseULDAllocation  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Sushant Kumar Nayak
	Created On:		24-07-2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDAllocationReport))]
    public class ULDAllocationReport
    {
        public int SNo { get; set; }
        public int Airport { get; set; }
        public string Text_Airport { get; set; }
        public int Airline { get; set; }
        public string Text_Airline { get; set; }
        public int Office { get; set; }
        public string Text_Office { get; set; }
        public string City { get; set; }

       
    }
     
   

}
