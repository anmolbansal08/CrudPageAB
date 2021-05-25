using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Irregularity
{
    #region IrregularityDamage Description
    /*
	*****************************************************************************
	Class Name:		IrregularityDamage
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		13 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(IrregularityDamage))]
    public class IrregularityDamage
    {

        public int SNo { get; set; }
        public string Damage { get; set; }
        public int DamageType { get; set; }
        public bool IsActive { get; set; }      
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }        
        public string Active { get; set; }
        public string Text_DamageType { get; set; }  
        

    }
}
