using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    /*
       *****************************************************************************
       I Name:		      EmailAlert
       Purpose:		    
       Company:		      CargoFlash Infotech Pvt Ltd.
       Author:			  Sushant Kumar Nayak
       Created On:		  22-01-2018
       Updated By:    
       Updated On:
       Approved By:
       Approved On:
       *****************************************************************************
       */
    [KnownType(typeof(EmailAlert))]
    public class EmailAlert
    {

        public Int32 SNo { get; set; }
        public string AirlineName { get; set; }
        public string Process { get; set; }
        public string CityCountry { get; set; }
        public string frequency { get; set; }
        public string intervals { get; set; }


    }

    [KnownType(typeof(EmailAlertCollection))]
    public class EmailAlertCollection
    {
        public string Airline { get; set; }
        public string Process { get; set; }
        public string CityCountryType { get; set; }
        public string CityCountry { get; set; }
        public string Occurs { get; set; }
        public string Hours { get; set; }
        public string DailyTime { get; set; }
        public string Weekly { get; set; }
        public string WeeklyTime { get; set; }
        public string Month { get; set; }
        public string MonthTime { get; set; }
        public string EmailAddress { get; set; }

    }
}
