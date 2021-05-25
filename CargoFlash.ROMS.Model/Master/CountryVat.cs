using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    /*
 *****************************************************************************
 Class Name:	CountryVat      
 Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                Implemenatation of class is perfomed in WEBUIs and Services 
 Company:		CargoFlash 
 Author:		Amit Kumar Gupta
 
 *****************************************************************************
 */
    [KnownType(typeof(CountryVat))]
    public  class CountryVat
    {
        public int SNo { get; set; }

        public int CountrySNo { get; set; }

        public string  Text_CountrySNo { get; set; }

        public string CountryName { get; set; }

        public bool IsDomsticVat { get; set; }
       
        public Decimal Value { get; set; }

        // public string ValidFrom { get; set; }

        //public string ValidTo { get; set; }

        public string ValidFrom { get; set; }

        public string ValidTo { get; set; } 

        public Boolean IsActive { get; set; }

        public string Active { get; set; }

        public string DomsticVat { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }



        
    }
}
