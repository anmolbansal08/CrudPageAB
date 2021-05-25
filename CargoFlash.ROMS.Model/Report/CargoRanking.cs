using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Agent Cargo Ranking Description
    /*
	*****************************************************************************
	Class Name:		Cargo Ranking   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		06 June 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(CargoRanking))]
    public class CargoRanking
    {
        public int SNo { get; set; }
        public String AgentCode { get; set; }
        public String Agent { get; set; }
        public String Export { get; set; }
        public String ERank { get; set; }
        public String Import { get; set; }
        //public Nullable<DateTime> FlightDate { get; set; }
        public String IRank { get; set; }
        public String Total { get; set; }
        public String Rank { get; set; }
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public String Dt { get; set; }

       // public String tablebuilder { get; set; }
       
    }
}
