using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Cargo Airline Volume Description
    /*
	*****************************************************************************
	Class Name:		Cargo Airline Volume
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		1 July 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(CargoAirlineVolume))]
    public class CargoAirlineVolume
    {
        
       
        public String CMonth { get; set; }
        public String CYear { get; set; }

       
    }
}
