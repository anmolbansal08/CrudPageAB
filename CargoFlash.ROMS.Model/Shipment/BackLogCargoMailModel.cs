using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    #region Back Log Cargo mail model   Description
    /*
	*****************************************************************************
	Class Name:		Back Log Cargo mail model  
	Purpose:		This class used to send email
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Devendra
	Created On:		21 June 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(BackLogCargoMailModel))]
    public class BackLogCargoMailModel
    {
        public string Content { get; set; }
        public string MailTo { get; set; }
        public string CC { get; set; }
        public string Subject { get; set; }
        public BackLogCargo BackLogCargo { get; set; } 
    }
}
