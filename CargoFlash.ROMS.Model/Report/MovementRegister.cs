using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Movement Register Description
    /*
    *****************************************************************************
    Class Name:		Movement Register
    Purpose:		This class used to handle
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Swati Rastogi
    Created On:		22 Feb 2017
    Updated By:    
    Updated On:
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    [KnownType(typeof(MovementRegister))]
    public class MovementRegister
    {

        public string FromDt { get; set; }
        public string ToDt { get; set; }
        public string reporttype { get; set; }
        public string ISRFS { get; set; }

        public String Dt { get; set; }

        /* Import */
        public string FlightDate { get; set; }
        public string FlightNo { get; set; }
        public String ATA { get; set; }
        public String MovementNo { get; set; }
        public String MovementDate { get; set; }
        public String RFS { get; set; }
        public String Origin { get; set; }
        public String AWB { get; set; }
        public String CRP { get; set; }
        public String ULD { get; set; }
        public String DPY { get; set; }
        public String Pieces { get; set; }
        public String ArivedWt { get; set; }
        public String CargoWt { get; set; }
        public String Agent { get; set; }

        /* Export */

        public String FlightStatus { get; set; }
        public String MnfPc { get; set; }
        public String MnfWt { get; set; }
        public String OffPc { get; set; }
        public String OffWt { get; set; }
        public String LBdPc { get; set; }
        public String CGOWt { get; set; }
        public String UpliftPc { get; set; }
        public String UpliftWt { get; set; }







    }
}
