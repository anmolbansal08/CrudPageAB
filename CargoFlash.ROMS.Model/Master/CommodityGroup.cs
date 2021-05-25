using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    /*
   *****************************************************************************
   Class Name:		CommodityGroup      
   Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                   Implemenatation of class is perfomed in WEBUIs and Services 
   Company:		CargoFlash 
   Author:			Anand
   Created On:		12 Feb 2014
   Approved By:    
   Approved On:	
   *****************************************************************************
   */
    [KnownType(typeof(CommodityGroup))]
   public class CommodityGroup
    {
        /// <summary>
        /// SNo for the entity as primary key 
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// Start Range for the entity which is 4 character long 
        /// </summary>
        public string StartRange { get; set; }
        /// <summary>
        /// End Range for the entity which is 4 character long 
        /// </summary>
        public string EndRange { get; set; }
        /// <summary>
        /// Name of the commodity group
        /// </summary>
        public String GroupName { get; set; }
       
        /// <summary>
        /// Confirm whether commodity group is Active or not
        /// </summary>
        public bool IsActive { get; set; }
        public String Active { get; set; }
        /// <summary>
        /// User who created this record
        /// </summary>
        //public String CreatedOn { get; set; }
        public String CreatedBy { get; set; }
        /// <summary>
        /// User who updated the record
        /// </summary>
        //public String UpdatedOn { get; set; }// NOT NULL,
        public String UpdatedBy { get; set; }// NOT NULL,
    }
}
