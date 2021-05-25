using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Flight Status Description
    /*
	*****************************************************************************
	Class Name:		Flight Status  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		23 June 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/

    #endregion
    [KnownType(typeof(FlightStatus))]
    public class FlightStatus
    {
        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String FlightOrigin { get; set; }
        public String TotalPlannedULD { get; set; }
        public String TotalManpower { get; set; }
      
        public String TotalTime { get; set; }
        public String CompletedULD { get; set; }
        public String TotalPercent { get; set; }
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public String Dt { get; set; }



    }
}
