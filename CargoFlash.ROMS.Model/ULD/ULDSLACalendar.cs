using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDSLACalendar))]
    public class ULDSLACalendar
    {
        public Int32 SNo { get; set; }
        public string CalendarName { get; set; }
        public string CalendarDesc { get; set; }
        public string Cityname { get; set; }
        public Int32 countryname { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Int32 IsActive { get; set; }
        public string Active { get; set; }
        public string Text_countryname { get; set; }
        public string Text_Cityname { get; set; }
        public string Year { get; set; }
        public Int32 CreatedBy { get; set; }
        public Int32 UpdatedBy { get; set; }
    }
    [KnownType(typeof(ULDSLACalendarTrans))]
    public class ULDSLACalendarTrans
    {
        public Int32 SNo { get; set; }
        public Int32 HolidayType { get; set; }
        public string HolidayDate { get; set; }
        public string HolidayWeekDay { get; set; }
        public string HolidayDesc { get; set; }
        public bool IsActive { get; set; }
    }
 [KnownType(typeof(WeekOffDaysList))]
    public class WeekOffDaysList
    {
       
        public string CalendarDate { get; set; }
        public string WeekDayName { get; set; }
        public bool IsActive { get; set; }
      
    }

    [KnownType(typeof(WeekOffHoliDatCustom))]
    public class WeekOffHoliDatCustom
    {

        public string WeekSno { get; set; }
        public string HoliDaySno { get; set; }
        public string CholidaySno { get; set; }

        public string WeekoffDate { get; set; }
        public string WeekoffDescription { get; set; }
        public bool TabActive { get; set; }


        public string HoliDays { get; set; }
        public string HoliDaysDescription { get; set; }


        public string customHoliDays { get; set; }
        public string customHoliDaysDescription { get; set; }


        public string Calendarsno { get; set; }
        public string WeekOFfDaysSno { get; set; }
        public string HoliDaysSno { get; set; }
        public string customHoliDaysSno { get; set; }
        public string calendarType { get; set; }





    }

}
