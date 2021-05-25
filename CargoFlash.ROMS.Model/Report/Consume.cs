using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Consume Description
    /*
	*****************************************************************************
	Class Name:		Consume
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		16 Sept 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Consume))]
    public class Consume
    {

        public String Item { get; set; }
        public String City { get; set; }
        public String Ownertype { get; set; }
        public String Consumble { get; set; }
        public String ULDStack { get; set; }
        public String ULDOut { get; set; }
        public String BuildUp { get; set; }
        public String Balance { get; set; }
       
        public String Owner { get; set; }
     

        public String Agt { get; set; }
        public String Air { get; set; }
        public String CItem { get; set; }
        public String Rpt { get; set; }
        public String Dt { get; set; }
       
       
    }

    public class ConsumeRequest
    {
        public String rpt { get; set; }
        public String agent { get; set; }
        public String airline { get; set; }
        public String citem { get; set; }
    }
}
