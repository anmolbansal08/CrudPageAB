using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    #region ManageClassRate Description
    /*
	*****************************************************************************
	Class Name:		ManageClassRate  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shahabz Akhtar
	Created On:		01 Feb 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(ManageClassRate))]
   public class ManageClassRate
    {
        public int SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public int Status { get; set; }
        public int RateInPercentage { get; set; }
        public int ApplicableOn { get; set; }
        public string Text_ApplicableOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        public int OriginLevel { get; set; }
        public string Text_OriginLevel { get; set; }

        public int OriginSNo { get; set; }
        public string Text_OriginSNo { get; set; }

        public int DestinationLevel { get; set; }
        public string Text_DestinationLevel { get; set; }

        public int DestinationSNo { get; set; }
        public string Text_DestinationSNo { get; set; }
       
       
       
        public string CommoditySNo { get; set; }
        public string Text_CommoditySNo { get; set; }
        public int IsInclude { get; set; }
        public string ISINCLUDE { get; set; }
        public string Text_Status { get; set; }
        public bool IsInternational { get; set; }
        public string International { get; set; }

        public string SHCSNO { get; set; }
        public string Text_SHCSNO { get; set; }
        public string SHCGroupSno { get; set; }
        public string ReferenceNumber { get; set; }
        public List<ClassRateSlab> ClassRateSlab { get; set; }
        public int BasedOn { get; set; }
        public string AccountSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public string Text_BasedOn { get; set; }
        public string ClassRateName { get; set; }

        public string FlightSNo { get; set; }
        public string Text_FlightSNo { get; set; }

        public string OtherAirlineSNo { get; set; }
        public string Text_OtherAirlineSNo { get; set; }
    }
    [KnownType(typeof(ClassRateSlab))]
    public class ClassRateSlab
    {
        public int SNo { get; set; }
        public int RateAirlineClassRate { get; set; }
        public Decimal StartWeight { get; set; }
        public Decimal EndWeight { get; set; }
        public int RateBasedOn { get; set; }
        public Decimal Value { get; set; }
     
      




    }
}
