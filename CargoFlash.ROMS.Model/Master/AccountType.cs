using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    /*
  *****************************************************************************
  Class Name:	AccountType      
  Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                 Implemenatation of class is perfomed in WEBUIs and Services 
  Company:		CargoFlash 
  Author:		Ajay Yadav
 
  *****************************************************************************
  */
    [KnownType(typeof(AccountType))]
    public class AccountType
    {
        /// <summary>
        /// SNo is the Primary  value in AccountType Entity
        /// </summary>
        public Int32 SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public String AccountTypeName { get; set; }
        public String PrefixCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsActive { get; set; }
        public String Active { get; set; }

        public bool IsAirline { get; set; }
        public String Airline { get; set; }
        public string ProductSNo { get; set; }
        public string Text_ProductSNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string UpdatedBy { get; set; }


    }
}
