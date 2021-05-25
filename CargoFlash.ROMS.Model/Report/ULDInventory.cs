using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region ULD Inventory Description
    /*
	*****************************************************************************
	Class Name:	     ULD Inventory
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		17 Sept 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDInventory))]
    public class ULDInventory
    {
        public int SNo { get; set; }
        public String Airline { get; set; }
        public String ULDType { get; set; }
        public String ULDNo { get; set; }
        public String Dt { get; set; }
        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String CurrentCity { get; set; }
        public String ContentType { get; set; }
        public String CurrentAirPort { get; set; }

        public String Type { get; set; }
        public String Air { get; set; }
        public String Rpt { get; set; }
        public int Airportcode { get; set;}
        public string ownercode { get; set; }
        public string ULDNumber { get; set; }
        public string AirlineN { get; set; }
    
    }

    public class UldInventory {
        public string rpt { get; set; }
        public string Type { get; set; }
        public int Airportcode { get; set; }
        public string ownercode { get; set; }
        public string ULDNumber { get; set; }
        public string AirlineN { get; set; }
    }
}
