using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Route Management
    /*
	*****************************************************************************
	Class Name:		Route   
	Purpose:		This class used to handle Route
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Arman Ali
	Created On:		22 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Route))]
    public class Route
    {
        public string SNo { get; set; }
        public string Routing { get; set; }
        public string Text_OriginAirportSNo { get; set; }
        public string Text_DestinationAirportSNo { get; set; }
        public string OriginAirportSNo { get; set; }
        public string DestinationAirportSNo { get; set; }
        public string Leg { get; set; }
        public string Text_Leg { get; set; }
        public string RoutePriority { get; set; }
        public string IsDirect { get; set; }
        public string Direct { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public String Active { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }

        public int UpdatedBy { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public string RouteMap { get; set; }
    }
    [KnownType(typeof(RouteGrid))]
    public class RouteGrid
    {
        public int SNo { get; set; }
        public string Routing { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string RoutePriority { get; set; }
        public string Direct { get; set; }
        public string Active { get; set; }
        public string RefNo { get; set; }

        //public bool IsDeleted { get; set; }

        //public int CreatedBy { get; set; }
        //public int UpdatedBy { get; set; }
        //public string CreatedUser { get; set; }
        //public string UpdatedUser { get; set; }

        //public Nullable<DateTime> CreatedDate { get; set; }
        //public Nullable<DateTime> UpdatedDate { get; set; }

    }
}
