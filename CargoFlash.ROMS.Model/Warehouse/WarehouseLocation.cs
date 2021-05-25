using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Warehouse
{
    #region WarehouseLocation Description
    /*
	*****************************************************************************
	Class Name:		WarehouseLocation   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		 06 Nov 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(WarehouseLocation))]
    public class WarehouseLocation
    {

        public int SNo { get; set; }
        public string CityCode { get; set; }
       public string Text_CityCode { get; set; }
      

        public string LocationNo { get; set; }
  

        public int RowNo { get; set; }
        public int ColumnNo { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string Airline { get; set; }

        public int SPHCSNo { get; set; }
        public string Text_SPHCSNo { get; set; }
        public string SPHC { get; set; }

        public int CommoditySNo { get; set; }
        public string Text_CommoditySNo { get; set; }
        public string Commodity { get; set; }

        public int DestinationCitySNo { get; set; }
        public string Text_DestinationCitySNo { get; set; }
        public string DestinationCity { get; set; }

        public int CountrySNo { get; set; }
        public string Text_CountrySNo { get; set; }
        public string Country { get; set; }

        public int LocationTypeSNo { get; set; }
        public string Text_LocationTypeSNo { get; set; }
        public string LocationType { get; set; }

        public int LocationSubTypeSNo { get; set; }
        public string Text_LocationSubTypeSNo { get; set; }
        public string LocationSubType { get; set; }

        public string Description { get; set; } 
        public bool IsActive { get; set; }            
        public string CreatedBy { get; set; }        
        public string Active { get; set; }
        public string UpdatedBy { get; set; }

    }
}
