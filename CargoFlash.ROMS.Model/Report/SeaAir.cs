using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Sea Air Description
    /*
	*****************************************************************************
	Class Name:		Sea Air
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		9 July 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(SeaAir))]
    public class SeaAir
    {

        public String MovementNo { get; set; }
        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String AWBNo { get; set; }
        public String Mnfpc { get; set; }
        public String Mnfwt { get; set; }
        public String Offpc { get; set; }
        public String Offwt { get; set; }
        public String upliftpc { get; set; }
        public String upliftwt { get; set; }
        public String Airline { get; set; }
        public String Agent { get; set; }
        public String AgentCode { get; set; }

        public String Destination { get; set; }
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public String Agt { get; set; }
        public String Air { get; set; }
        public String Rpt { get; set; }
        public String Dt { get; set; }
        public String SE { get; set; }
       
    }
}
