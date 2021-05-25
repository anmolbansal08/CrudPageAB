using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
/*
*****************************************************************************
    Class Name:		City      
    Purpose:		Used to Traverse Structured data from Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
    Company:		CargoFlash 
    Author:			Ajay Yadav
    Created On:		06 March 2014

    *****************************************************************************

*/
namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(City))]
    public class City
    {
        public int SNo { get; set; }

        //public int ZoneSNo { get; set; }

        public string StandardName { get; set; }

        //public string Text_ZoneSNo { get; set; }

        public string CityCode { get; set; }

        public string CityName { get; set; }

        public int CountrySNo { get; set; }

        public string Text_CountrySNo { get; set; }

        public string CountryCode { get; set; }

        public string CountryName { get; set; }

        public string DayLightSaving { get; set; }

        public string DeltaSeconds { get; set; }

        //public int TimeDifference { get; set; }

        public int TimeZoneSNo { get; set; }

        public string Text_TimeZoneSNo { get; set; }

        //public bool IsDayLightSaving { get; set; }
        
        public string IATAArea { get; set; }

        public string Text_IATAArea { get; set; }

        //public string strDayLightSaving { get; set; }

        public bool IsActive { get; set; }

        public string Active { get; set; }

        public bool PriorApproval { get; set; }
        public string IsPriorApproval { get; set; }
        public int ZoneSNo { get; set; }
        public string Text_ZoneSNo { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }


        public string SHCSNo { get; set; }           

        public string Text_SHCSNo { get; set; }


        public string DGClassSNo { get; set; }
        public string Text_DGClassSNo { get; set; }

        public double VolumeConversionInch { get; set; }
        // public string Text_VolumeConversionInch { get; set; }

        public double VolumeConversionCM { get; set; }
      //  public string Text_VolumeConversionCM { get; set; }

        public bool IsHouse { get; set; }
        public string House { get; set; }

        // Added By Pankaj Kumar Ishwar
        public bool IsDimension { get; set; }
        public string Dimension { get; set; }
    }

    [KnownType(typeof(DayLightSavingTime))]
    public class DayLightSavingTime
    {
        public String DeltaSeconds { get; set; }
        public String DayLightSaving { get; set; }
    }

    
}
