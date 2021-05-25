using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Tariff
{
    /*
  *****************************************************************************
  Class Name:		RateExchangeDueCarrier      
  Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                  Implemenatation of class is perfomed in WEBUIs and Services 
  Company:		CargoFlash 
  Author:			Amit Kumar Gupta
  Created On:		23 Apirl 2014
  Approved By:    
  Approved On:	
  *****************************************************************************
  */
    [KnownType(typeof(RateExchangeDueCarrier))]
    public class RateExchangeDueCarrier
    {
        public int SNo { get; set; }
        public int DueCarrierSNo { get; set; }
        public string Text_DueCarrierSNo { get; set; }
        public string DueCarrier { get; set; }
        public double Rate { get; set; }
        public String FromCurrencyCode { get; set; }
        public int FromCurrencySNo { get; set; }
        public String Text_FromCurrencySNo { get; set; }
        public String ToCurrencyCode { get; set; }
        public int ToCurrencySNo { get; set; }
        public String Text_ToCurrencySNo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }

        //public string ValidFrom { get; set; }
        public string ValidtoDisplay { get; set; }
        public Boolean IsActive { get; set; }

        public String Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }

    }

}
