using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Agent Cargo Ranking Export & Import Description
    /*
	*****************************************************************************
	Class Name:		Cargo Ranking Export & Import
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
    [KnownType(typeof(CargoRankingEI))]
    public class CargoRankingEI
    {
        public int SNo { get; set; }
        public String CommodityCode { get; set; }
        public String CommodityDescription { get; set; }
        public String AgentCode { get; set; }
        public String Agent { get; set; }

        public String Export { get; set; }
        public String ERank { get; set; }
        public String Import { get; set; }
        public String IRank { get; set; }
        public String Total { get; set; }
        public String Rank { get; set; }
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public String AirlineCode { get; set; }
        public String AirlineName { get; set; }
        public String DestinationCode { get; set; }
        public String Destination { get; set; }
        public String Dt { get; set; }
        public String Transit { get; set; }
        public String RRank { get; set; }

        public String CargoType { get; set; }
        public String Filter { get; set; }
    }
}
