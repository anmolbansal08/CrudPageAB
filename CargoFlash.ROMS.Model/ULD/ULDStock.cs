using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
    #region ULD Stock
    /*
	*****************************************************************************
	Class Name:		ULDStock  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		17 nov 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDStock))]
    public class ULDStock
    {
        public int SNo { get; set; }
        public string ULDType { get; set; }
        public string ULDNo { get; set; }
        public string City { get; set; }
        public string AirlineCode { get; set; }
        public string CityCode { get; set; }
        public string PurchaseFrom { get; set; }
        public string PurchaseAt { get; set; }
        public int IsActive { get; set; }
        public String Active { get; set; }
        public int IsAvailable { get; set; }
        public String Available { get; set; }
        public int TotalNoOfULD { get; set; }
        public string ULDSerialNo { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string OwnerCode { get; set; }
        public string PurchaseDate { get; set; }
        public int OwnershipSNo { get; set; }
        public string Text_OwnershipSNo { get; set;}
        public string ContainerType { get; set; }
        public int IsDamaged { get; set; }
        public string Damaged { get; set; }
        public int IsServiceable { get; set; }
        public string Serviceable { get; set; }
        public string AirportSNo { get; set; }
        public string Text_AirportSNo { get; set; }
        public decimal EmptyWeight { get; set; }

        
        public int Scrape { get; set; }
        public decimal PurchasedPrice { get; set; }
        public string Text_Scrape { get; set; }
        public string ContentType { get; set; }
        public string Text_ContentType { get; set; }  
        public string ContentCategory { get; set; }
        public string Text_ContentCategory { get; set; }
        public string SHCGroupSNo { get; set; }
        public string Text_SHCGroupSNo { get; set; }
       //public int UldStockSNo {get;set;}
        public string SHCSNo {get;set;}
       public string Text_SHCSNo { get; set; }
 
       // public string SingleCode { get; set; }
      
        
    }

    [KnownType(typeof(ULDStockGrid))]
    public class ULDStockGrid
    {
        public int SNo { get; set; }
        public string ULDType { get; set; }
        public string ULDNo { get; set; }
        public string City { get; set; }
        public Nullable<DateTime> PurchaseDate { get; set; }
        public string PurchaseAt { get; set; }
        public string PurchaseFrom { get; set; }
        public string Available { get; set; }
        public string Active { get; set; }
        public string ContainerType { get; set; }
        public string AirlineName { get; set; }
        public string Damaged { get; set; }
        public string Serviceable { get; set; }
        public string BaggageType { get; set; }
        public string SHC { get; set; }
        public string Content { get; set; }
        public string Code { get; set; }
        public string Text_ContentType { get; set; }
        public int ContentType{ get; set; }
        public int ContentCategory { get; set; }
        public string OriginAirport { get; set; }
        public string CurrentStatus { get; set; }
        public string PurchasedPrice { get; set; }
        public string EmptyWeight { get; set; }
        public string LostRemarks { get; set; }
        //Added By Shivali Thakur
        public string IsNonInventory { get; set; }
      
    }
    [KnownType(typeof(SelectBaggage))]
    public class SelectBaggage
    {
        public int SNo { get; set; }
        public string BaggageType { get; set; }
    }
}
