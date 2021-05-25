using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{

    /*
*****************************************************************************
Class Name: 	CityConnectionTime      
Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                Implemenatation of class is perfomed in WEBUIs and Services 
Company:		CargoFlash Infotech Pvt ltd.
Author:		    Ajay Yadav
 
*****************************************************************************
*/

    [KnownType(typeof(CityConnectionTime))]

    public class CityConnectionTime
    {
        public int SNo { get; set; }
        public string RefNo { get; set; }

        public int ProductSNo { get; set; }
        public string Text_ProductSNo { get; set; }
        public string ProductName { get; set; }

        public string AirportSNo { get; set; }
        public string Text_AirportSNo { get; set; }
        public string AirportCode { get; set; }

        public string AircraftSNo { get; set; }
        public string Text_AircraftSNo { get; set; }
        public string AircraftType { get; set; }

        public string SPHCSNo { get; set; }
        public string Text_SPHCSNo { get; set; }
        public string SPHCode { get; set; }

        public int ConnectionTypeSNo { get; set; }

        public string ConnectionTypeName { get; set; }
        public string Text_ConnectionTypeSNo { get; set; }
        public string ConnectionTime { get; set; }

        public int ConnectionTimeHr { get; set; }
        public int ConnectionTimeMin { get; set; }
        //public Nullable<int> ConnectionTimeMin { get; set; }

        //public Nullable<int> ConnectionTimeMax { get; set; }

        //public Nullable<int> UldConnectionTimeMin { get; set; }

        //public Nullable<int> UldConnectionTimeMax { get; set; }

        //public Nullable<int> ExpressConnectionTime { get; set; }

        //public Nullable<int> UldExpressConnectionTime { get; set; }

        public bool IsRoot { get; set; }
        public int BasedOn { get; set; }
        public bool IsInternational { get; set; }
        public string Text_IsInternational { get; set; }
        public string Root { get; set; }
        public string Text_BasedOn { get; set; }
        public bool IsActive { get; set; }
        // public string ConnectionTime { get; set; }

        public string Active { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

        public string AirlineSNo { get; set; } //Added by Shahbaz Akhtar
     
        public string Text_AirlineCodeSNo { get; set; } //Added by Shahbaz Akhtar
         /**********************************/
        public string userCreatedBy { get; set; }

        public string userUpdatedBy { get; set; }

        /**********************************/
        public string OtherAirlineAccess { get; set; } //Added by Pankaj Kumar Ishwar
        public string Text_OtherAirlineAccess { get; set; } //Added by Pankaj Kumar Ishwar

        public string AgentSNo { get; set; } //Added by Mukesh
        public string Text_AgentSNo { get; set; } //Added by Mukesh
        public Decimal AdjustableWeight { get; set; } //Added by Mukesh
        public string Text_AdjustableWeight { get; set; } //Added by Mukesh

        public List<CityConnectionTimeSlab> CCTSlabs { get; set; }

    }

    [KnownType(typeof(CityConnectionTimeSlab))]
   public class CityConnectionTimeSlab
    {
        public int SNo { get; set; }
        public int CityConnectionTimeSNo { get; set; }
        public int StartWeight { get; set; }
        public int EndWeight { get; set; }
        public Nullable<int> GrossWtVariancePlus { get; set; }
        public Nullable<int> GrossWtVarianceminus { get; set; }
        public Nullable<int> VoluemeWeightPlus { get; set; }        
        public Nullable<int> VoluemeWeightminus { get; set; }     
        public int UpdatedBy { get; set; }
        
    }

}
