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
	Class Name:		UWS Pending
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		05 August 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(UWSPending))]
    public class UWSPending
    {
        public int SNo { get; set; }
        public String Equipment { get; set; }
        public String DestCode { get; set; }
        public string Airline { get; set; }
        public string FlightNumber { get; set; }
        public string FlightDt { get; set; }
        public string ULD { get; set; }

        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String Load { get; set; }
        public String EquipmentNo { get; set; }
        public String Issued { get; set; }
        public String ULDNo { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public String ScaleWt { get; set; }
        public String TareWt { get; set; }
        public String TotalWt { get; set; }
        public String NetWt { get; set; }
        public String Variance { get; set; }
        public String Manual { get; set; }
        public String Remark { get; set; }
        public String SHC { get; set; }
        public String Dt { get; set; }
        public String Process { get; set; }
        public String AwbNo { get; set; }

    }



    [KnownType(typeof(UWSPendingRequest))]
    public class UWSPendingRequest
    {
        public string Equipment { get; set; }
        public string Destination { get; set; }

        public string Airline { get; set; }
        public string FlightNumber { get; set; }
        public string FlightDt { get; set; }
        public string ULD { get; set; }
        public string AwbNo { get; set; }
      

    }
}
