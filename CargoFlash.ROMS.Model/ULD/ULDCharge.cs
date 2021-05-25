using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.ULD
{
    #region ULD Charge Description
    /*
	*****************************************************************************
	Class Name:		ULD Charge   
	Purpose:		This class used to handle ULD Charge
	Company:		
	Author:			Pankaj Kumar Ishwar
	Created On:		11 Aug 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(ULD_Charge))]
    public class ULD_Charge
    {

        public int SNo { get; set; }
        public int AgentName { get; set; }
        public string ULDType { get; set; }
        public int TarriffTo { get; set; }
        public int AirlineName { get; set; }
        public string SDate { get; set; }
        public int Currency { get; set; }
        public int FreeType { get; set; }
        public int FreePeriod { get; set; }
        public decimal DemurrageCharge { get; set; }
        public int NonReturnDays { get; set; }
        public int NoReturnValues { get; set; }
        public decimal TAX { get; set; }
        public int Owner { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string country { get; set; }
        public string City { get; set; }
        public string Text_endDate { get; set; }
        public string endDate { get; set; }





        public string Owner1 { get; set; }
        public string Text_AgentName { get; set; }
        public string Text_country { get; set; }
        public string Text_City { get; set; }
        public string Text_SDate { get; set; }
        public string Text_ULDType { get; set; }
        public string Text_Owner { get; set; }      
        public string Text_FreeType { get; set; }
        public string Text_AirlineName { get; set; }
        public string Text_Currency { get; set; }
        public string Text_TarriffTo { get; set; }
        public string Text_DemurrageCharge { get; set; }
        public string Text_NonReturnValue { get; set; }
        public string TAX1 { get; set; }
        public string ULDCharge { get; set; }
       


    }
    [KnownType(typeof(ULDCharges))]
    public class ULDCharges
    {
        public int SNo { get; set; }
        public string AgentName { get; set; }
        public string AirlineName { get; set; }
        public string uldname { get; set; }
        public string FreeType { get; set; }
        public string Text_ULDType { get; set; }
        public string TransferToo { get; set; }
        public string FreePeriod { get; set; }
        public string currencycode { get; set; }
        public string CountryName { get; set; }
        public int FreePeriodsDays { get; set; }
        public string ReferenceNo { get; set; }
        public string Active { get; set; }
    }
    
}
