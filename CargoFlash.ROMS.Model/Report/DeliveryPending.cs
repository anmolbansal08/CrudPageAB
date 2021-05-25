using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Delivery Pending Description
    /*
	*****************************************************************************
	Class Name:		Delivery Pending  
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
    [KnownType(typeof(DeliveryPending))]
    public class DeliveryPending
    {
        
        public int SNo { get; set; }
        public String AWBNo { get; set; }
        public String TotalPieces { get; set; }
        public String TotalWeight { get; set; }
        public String Origin { get; set; }
        public String FlightDate { get; set; }
        public String FlightNo { get; set; }
        public String NatureOfGoods { get; set; }
        public String Cargotype { get; set; }
        public String Consignee { get; set; }
        public String DIff { get; set; }
        public String FreightType { get; set; }

        public String NFDDate { get; set; }
        public String NFDBy { get; set; }
        public String NFDRemark { get; set; }
        
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public String Airline { get; set; }
        public String AirlineName { get; set; }
        public String Dt { get; set; }
       
    }
}
