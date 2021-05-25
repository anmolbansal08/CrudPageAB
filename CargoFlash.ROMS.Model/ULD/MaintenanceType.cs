using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.ULD
{
    #region MaintenanceType Description
    /*
    *****************************************************************************
    Class Name:		MaintenanceType   
    Purpose:		This class used to handle MaintenanceType
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Devendra Singh.
    Created On:	    10 July 2017
    Updated By:     
    Updated On:    
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    [KnownType(typeof(MaintenanceType))]
    public class MaintenanceType
    {
        public int SNo { get; set; }
        public string MaintenancType { get; set; }
        public string MaintenanceDesc { get; set; }
        public string ManhourCost { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string uldtype { get; set; }
        public string uldtypesno { get; set; }
        public int MaintenanceCategory { get; set; }
        public string MaintenanceCategorys { get; set; }
        public string Description { get; set; }
        public string ReferenceNo { get; set; }
    }
}
