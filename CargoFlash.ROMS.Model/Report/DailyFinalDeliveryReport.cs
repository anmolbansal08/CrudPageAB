using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region ESS Description
    /*
	*****************************************************************************
	Class Name:		ESS   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		07 July 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(DailyFinalDeliveryReport))]
    public class DailyFinalDeliveryReport
    {
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public int SNo { get; set; }
        public String MASTER_AWB { get; set; }
        public String TANGGAL { get; set; }
        public String NO_DB { get; set; }
        public String H_AWBNo { get; set; }
        public String KOLI { get; set; }
        public String KILO { get; set; }
        public String VOL { get; set; }
        public String NOP_IBP { get; set; }
        public String POS { get; set; }
        public String BC1_1 { get; set; }
        public String ConsigneeName { get; set; }
        public String No_SPPB { get; set; }
        public String NO_DAFT { get; set; }
        public String TGL_SPPB { get; set; }
        public String TGL_DAFT { get; set; }
    }
}
