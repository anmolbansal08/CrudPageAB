using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region OffloadReason Description
    /*
	*****************************************************************************
	Class Name:		HSCodes   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			PRITI YADAV
	Created On:		20 Apr 2020
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(HSCodes))]
    public class HSCodes
    {
        public Int32 SNo { get; set; }
        public string HSCode { get; set; }
        public Int32 Length { get; set; }
        public string DescriptionOFGoods { get; set; }
        public string DescriptionOFGoodsinIndonasia { get; set; }
        public bool IsActive { get; set; }
        public String Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
    }

}
