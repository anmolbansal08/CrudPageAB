using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
  
{
    #region City Wise ULD Allocation
    /*
	*****************************************************************************
	Class Name:		CityWiseULDAllocation  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		23 nov 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(CityWiseULDAllocation))]
    public class CityWiseULDAllocation
    {
        public int SNo { get; set; }
        public int Airport { get; set; }
        public string Text_Airport { get; set; }
        public int Airline { get; set; }
        public string Text_Airline { get; set; }
        public int Office { get; set; }
        public string Text_Office { get; set; }
        public string City { get; set; }
        public string EmailAddress { get; set; }
    }
     [KnownType(typeof(CityWiseULDAllocationTrans))]
    public class CityWiseULDAllocationTrans
    {
         public int SNo { get; set; }
        //public int ULDAllocationSNo { get; set; }
        public int HdnULDCode { get; set; }
        public int CurrentULDStock { get; set; }
        public string ULDCode { get; set; }
        public string MinAllocation { get; set; }
        public string MinAlert { get; set; }
        public string MaxAllocation { get; set; }
        public string MaxAlert { get; set; }
        public string AlertEmail { get; set; }
        public string EmailAddress { get; set; }
       
    }
     [KnownType(typeof(CityWiseULDAllocationTransSave))]
     public class CityWiseULDAllocationTransSave
     {
         public string SNo { get; set; }
         public string Airport { get; set; }
         public string Text_Airport { get; set; }
         public int   Airline { get; set; }
         public string Text_Airline { get; set; }
         public string EmailAddress { get; set; }
        public List<CityWiseULDAllocationTrans> EventTransData { get; set; }
     }

     [KnownType(typeof(CityWiseULDAllocationGrid))]
     public class CityWiseULDAllocationGrid
     {
         public int ULDAllocationSNo { get; set; }
         public string AirportName { get; set; }
         public string AirlineName { get; set; }
         public string ULDCode { get; set; }
         public int CurrentStock { get; set; }
         public string ContainerType { get; set; }
         public string MinAllocation { get; set; }
         public string MaxAllocation { get; set; }
     }
}
