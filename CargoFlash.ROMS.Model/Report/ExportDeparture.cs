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
	Class Name:		Export Departure
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		23 Nov 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ExportDeparture))]
    public class ExportDeparture
    {
        
        public string FlightDt { get; set; }
        public string Exclude { get; set; }

        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String FlightStatus { get; set; }
        public String ACType { get; set; }
        public String FlightRoute { get; set; }
        public String ETD { get; set; }
        public String ATD { get; set; }
        public String Delay { get; set; }
        public String NILManifest { get; set; }
        public String DelayMN { get; set; }


        public String Dt { get; set; }
       
    }
}
