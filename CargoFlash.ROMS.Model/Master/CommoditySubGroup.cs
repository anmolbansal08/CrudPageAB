using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    /*
   *****************************************************************************
   Class Name:		CommoditySubGroup      
   Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                   Implemenatation of class is perfomed in WEBUIs and Services 
   Company:		CargoFlash 
   Author:			Anand
   Created On:		12 Feb 2014
   Approved By:    
   Approved On:	
   *****************************************************************************
   */
    [KnownType(typeof(CommoditySubGroup))]
    public class CommoditySubGroup
    {
        /// <summary>
        /// SNo for the entity as primary key 
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// SNo for the entity as primary key 
        /// </summary>
        public int CommodityGroupSNo { get; set; }

        /// <summary>
        /// Name of the commodity sub group
        /// </summary>
        public String SubGroupName { get; set; }
        ///// <summary>
        ///// Name of the commodity group
        ///// </summary>
        //public String CommodityGroup { get; set; }
        /// <summary>
        /// Start Range for the entity which is 4 character long 
        /// </summary>
        public string StartRange { get; set; }
        /// <summary>
        /// End Range for the entity which is 4 character long 
        /// </summary>
        public string EndRange { get; set; }

        /// <summary>
        /// Confirm whether commodity sub group is Heavy Weight Exempt or not
        /// </summary>
        public int IsHeavyWeightExempt { get; set; }
        /// <summary>
        /// Confirm whether commodity sub group is Heavy Weight Exempt or not
        /// </summary>
        public String HeavyWeightExempt { get; set; }
        /// <summary>
        /// Confirm whether commodity sub group is Active or not
        /// </summary>
        public int IsActive { get; set; }
        /// <summary>
        /// Confirm whether commodity sub group is Active or not
        /// </summary>
        public String Active { get; set; }
    }
}
