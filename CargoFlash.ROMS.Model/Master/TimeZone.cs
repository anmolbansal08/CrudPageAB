using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Timezone))]
    public class Timezone
    {
        #region Public Properties

        public int SNo { get; set; }

        public string ZoneName { get; set; }
        public bool IsActive { get; set; }

        public Int64 CreatedBy { get; set; }

        public Nullable<DateTime> CreatedOn { get; set; }

        public Int64 UpdatedBy { get; set; }

        public Nullable<DateTime> UpdatedOn { get; set; }

        public string CreatedUser { get; set; }

        public string UpdatedUser { get; set; }

        public string Active { get; set; }
        public string GMT { get; set; }
        #endregion
    }

    [KnownType(typeof(TimezoneGridData))]
    public class TimezoneGridData
    {
        #region Public Properties
        public int SNo { get; set; }
        public string ZoneName { get; set; }
        public string Prefix { get; set; }
        public string PrefixName { get; set; }
        public int Hour { get; set; }
        public int Minute { get; set; }
        public string IsDaylightSaving { get; set; }
        public string Active { get; set; }
        public string StandardName { get; set; }
        public string GMT { get; set; }
        #endregion
    }

    [KnownType(typeof(TimeZoneTrans))]
    public class TimeZoneTrans
    {
        #region Public Properties
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public int TimeZoneSNo { get; set; }
        //[Order(3)]
        //public string Prefix { get; set; }
        [Order(4)]
        public string Text_Prefix { get; set; }
        [Order(5)]
        public int Hour { get; set; }
        [Order(6)]
        public int Minute { get; set; }
        [Order(7)]
        public String ValidFrom { get; set; }
        [Order(8)]
        public String ValidTo { get; set; }
        [Order(9)]
        public string ZoneName { get; set; }

        [Order(10)]
        public String ValidFromTime { get; set; }
        [Order(11)]
        public String ValidToTime { get; set; }
        #endregion
    }

    [KnownType(typeof(TimeZomeMasterInfo))]
    public class TimeZomeMasterInfo
    {
        #region Public Properties
        public List<Timezone> timeZoneMaster { get; set; }
        public List<TimeZoneTrans> timeZoneTrans { get; set; }
        #endregion
    }
}
