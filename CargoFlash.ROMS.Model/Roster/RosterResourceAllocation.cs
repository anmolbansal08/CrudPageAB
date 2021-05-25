using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Roster
{
    public class RosterResourceAllocation
    {
        public int MeetingID { get; set; }
        //public string RoomID { get; set; }
        public string[] Attendees { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string StartTimezone { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string EndTimezone { get; set; }
        //public string RecurrenceRule { get; set; }
        //public string RecurrenceID { get; set; }
        //public string RecurrenceException { get; set; }
        public string PunchInTime { get; set; }
        public string PunchOutTime { get; set; }
        public bool IsAllDay { get; set; }
        public bool ReportingShiftTime { get; set; }
        public bool isdisabled { get; set; }
        public int DutyAreaSNo { get; set; }
        public string Color { get; set; }
        public DutyArea DutyArea { get; set; }
    }

    public class RosterEmployeeAllocation
    {
        public string text { get; set; }
        public string value { get; set; }
        public string color { get; set; }
    }
    public class RosterGetData
    {
        public string Employee { get; set; }
        public string DutyArea { get; set; }
        public string Designation { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }


    public class SchedulerMessage
    {
        public string Status { get; set; }
        public string Result { get; set; }
        public string Error { get; set; }
    }
}
