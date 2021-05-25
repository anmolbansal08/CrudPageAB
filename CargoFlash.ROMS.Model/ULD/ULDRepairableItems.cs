﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
    #region ULDRepairableItems Description
    /*
    *****************************************************************************
    Class Name:		ULDRepairableItems   
    Purpose:		This class used to handle
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Swati Rastogi.
    Created On:		19 Nov 2015
    Updated By:     Pankaj Khanna
    Updated On:     25-Feb-2016
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    [KnownType(typeof(ULDRepairableItems))]
    public class ULDRepairableItems
    {

        public int SNo { get; set; }
        public string ItemName { get; set; }
        
      //  public decimal GrossWeight { get; set; }
      //  public decimal VolumeWeight { get; set; }
      //  public decimal Length { get; set; }
      //  public decimal Width { get; set; }
      //  public int Unit { get; set; }
          public string ItemDescription { get; set; }
          //public int ULDType { get; set; }
          public string ULDType { get; set; }
          public string Text_ULDTypes { get; set; }
      //  public decimal EmptyWeight { get; set; }


      //  public string Units { get; set; }
      //  public bool IsActive { get; set; }
      ////  
      //  public string Active { get; set; }
        public string CreatedBy { get; set; }
       public string UpdatedBy { get; set; }
      //  public string CommonDesignation { get; set; }
      //  public int AirlineSno { get; set; }
      //  public string Text_AirlineSno { get; set; }
      //  public string Airline { get; set; }

      //  public string Text_Units { get; set; }
      //  public string Text_IsActive { get; set; }

      //  //Added by Pankaj Khanna
      //  public string ULDTypes { get; set; }
      //  public string Text_ULDTypeSno { get; set; }
      //  public int ULDTypeSno { get; set; }

      //  public string RateClass { get; set; }
      //  public string Text_RateClassSno { get; set; }
      //  public int RateClassSno { get; set; }
      //  public string ULDdescription { get; set; }
    }
}
