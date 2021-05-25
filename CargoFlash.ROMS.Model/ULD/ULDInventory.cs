using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
    #region ULD Inventory Description
    /*
	*****************************************************************************
	Class Name:		ULDInventory   
	Purpose:		This class used to handle ULD Inventory
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Deepak Sharma
	Created On:		08 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    /// <summary>
    /// ULD Inventory
    /// </summary>
    [KnownType(typeof(ULDInventory))]
    public class ULDInventory
    {
        public int SNo { get; set; }
        public DateTime? InventoryDate { get; set; }
        public string Station { get; set; }
        public string ULDNo { get; set; }
        public string AirlineName { get; set; }
        public string SystemLocation { get; set; }
        public string PhysicallyAvailable { get; set; }
        public string PhysicalLocation { get; set; }
        public string LoadedInSystem { get; set; }
        public string Found { get; set; }
        public string Damaged { get; set; }
        public string InventoryDateSearch { get; set; }
        public string InventoryTakenAtSearch { get; set; }
        public string Serviceable { get; set; }
        public string InventoryTakenBy { get; set; }
        public DateTime? InventoryTakenAt { get; set; }
        public string IsSCMSent { get; set; }
        public int StationSNo { get; set; }
        public int ULDSTockSNo { get; set; }
        public int AirlineSNo { get; set; }
        public String AirlineCode { get; set; }
        public String CarrierCode { get; set; }
        public int SystemLocationSNo { get; set; }
        public bool IsPhysicallyAvailable { get; set; }
        public int PhysicalLocationSNo { get; set; }
        public bool IsLoadedInSystem { get; set; }
        public bool IsFound { get; set; }
        public bool IsDamaged { get; set; }
        public string IsScm { get; set; }

    }

    [KnownType(typeof(ULDInventoryListValue))]
    public class ULDInventoryListValue
    {
        //public int SNo { get; set; }

        public int RowSNo { get; set; }
        public string AirlineCode { get; set; }
        public string AirlineName { get; set; }
        public int ULDStockSNo { get; set; }
        public string IsStatus { get; set; }
        public String ULDNo { get; set; }
        public string HdnULDType { get; set; }
        public string ULDType { get; set; }
        public string SerialNo { get; set; }
        public string OwnerCode { get; set; }
        public String ULDLocation { get; set; }
        public int IsLoadedInSystem { get; set; } // Status
        public bool IsPhysicallyAvailable { get; set; } // Physical check
        public int IsFound { get; set; } // Remarks
        public String HdnPageULDLocationValue { get; set; }
        public String PageULDLocationValue { get; set; }// PageULDLocationValue
        public bool IsDamaged { get; set; } // Damage
        public int IsServiceable { get; set; }


        public String HdnULDLocation { get; set; }
        public string LoadedInSystem { get; set; }
        public string CurrentStatus { get; set; }



    }

    [KnownType(typeof(ULDInventoryList))]
    public class ULDInventoryList
    {
        //public int SNo { get; set; }
        public string RowSNo { get; set; }
        public string ULDStockSNo { get; set; }
        public string AirlineCode { get; set; }
        public string AirlineName { get; set; }
        public string IsStatus { get; set; }
        public string HdnULDType { get; set; }
        public string ULDType { get; set; }
        public string SerialNo { get; set; }
        public string OwnerCode { get; set; }
        public string ULDNo { get; set; }
        public string ULDLocation { get; set; }
        public string HdnULDLocation { get; set; }
        public string IsLoadedInSystem { get; set; } // Status
        public string LoadedInSystem { get; set; }
        public string IsPhysicallyAvailable { get; set; } // Physical check
        public string IsFound { get; set; } // Remarks
        public string PageULDLocationValue { get; set; }// PageULDLocationValue
        public string HdnPageULDLocationValue { get; set; }
        public string IsDamaged { get; set; } // Damage
        public string IsServiceable { get; set; }

    }
    public class Scm
    {
        public string SitaAddress { get; set; }
        public string EmailAddress { get; set; }
        public string SCMMessage { get; set; }


    }
}
