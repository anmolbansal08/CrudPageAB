using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Master
{
     [KnownType(typeof(TempratureSensor))]
    public class TempratureSensor
    {


        public int SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string SensorName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string SensorID { get; set; }
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
