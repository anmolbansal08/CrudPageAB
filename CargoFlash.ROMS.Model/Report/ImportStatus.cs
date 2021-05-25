using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region UWS Pending Description
    /*
	*****************************************************************************
	Class Name:		Import Status
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		24 Nov 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ImportStatus))]
    public class ImportStatus
    {
        
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        

        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String ETA { get; set; }
        public String ATA { get; set; }
        public String NILArrived { get; set; }
        public String FCCompleted { get; set; }
        public String AWBCount { get; set; }
        public String FWBCount { get; set; }

        public String FWBCreatedOn { get; set; }

        public String FHLCreatedOn { get; set; }


        public String Dt { get; set; }
       
    }

    public class ImportStatusRequest
    {
        /// <summary>
        /// Get or Set FromDate
        /// </summary>
        public string FromDate { get; set; }
        /// <summary>
        /// Get or Set ToDate
        /// </summary>
        public string ToDate { get; set; }
        
    }
}
