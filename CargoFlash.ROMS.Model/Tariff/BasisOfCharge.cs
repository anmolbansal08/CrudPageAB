using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Tariff
{
    /*
    *****************************************************************************
    Class Name:		Basis Of Charge      
    Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
    Company:		CargoFlash 
    Author:			Karan Kumar
    Created On:		24 Nove 2015
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    [KnownType(typeof(BasisOfCharge))]
    public class BasisOfCharge
    {
        /// <summary>
        /// SNo is primary value in Entity Account
        /// </summary>
        public Int32 SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string basisOfCharge { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string BaseUnit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal Value { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 
        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

        public string BaseunitText { get; set; }
    }
}
