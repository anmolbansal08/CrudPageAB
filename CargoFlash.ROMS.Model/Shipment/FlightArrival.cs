using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    #region FlightArrival Description
    /*
	*****************************************************************************
	Class Name:		Flight Arrival
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		20 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(FlightArrival))]
    public class FlightArrival
    {

        public int AirlineSNo { get; set; }
    }
}
