using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Uncleared Shipment Description
    /*
	*****************************************************************************
	Class Name:		Uncleared Shipment  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		21 Sept 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(UnclearedShipment))]
    public class UnclearedShipment
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string AgentName { get; set; }
        public string DeliveryOrder { get; set; }
        public string DateofIssuance { get; set; }
        public string TotalPieces { get; set; }
        public string TotalWeight { get; set; }

        public string FlightDate { get; set; }
        public string FlightNo { get; set; }
        public string HAWBNo { get; set; }
        public string DLVPC { get; set; }
        public string DLVWT { get; set; }
        public string DIff { get; set; }
        public string Consignee { get; set; }


        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Airline { get; set; }

        public string AirlineName { get; set; }
        public string TimeFromArrivalDaysHour { get; set; }

        public string Origin { get; set; }
        public string Dest { get; set; }

    }

    public class UnclearedShipmentRequestModel
    {


        public string AirlineSNo { get; set; }
        public string AirportSNo { get; set; }
        public string Type { get; set; }
        public string AgentSNo { get; set; }
        public string FromDt { get; set; }

        public string ToDt { get; set; }
    }


    public class UnclearedShipmentRequest
    {


        public string Airline { get; set; }

        public string FromDt { get; set; }

        public string ToDt { get; set; }
    }

}
