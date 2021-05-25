using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    /*
     ------------------------------------------------------
     */
    [KnownType(typeof(ConnectionType))]
    public class ConnectionType
    {
        /// <summary>
        /// 
        /// </summary>
        public Int32 SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ConnectionTypeName { get; set; }
        public string ConnectionTypeDesc { get; set; }
        public int BasedOn { get; set; }
        public string Text_BasedOn { get; set; }

        public bool IsRouteSetting {get; set;}
        public string Text_IsRouteSetting { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsActive { get; set; }
        public string Active { get; set; }
        //public String IsActive { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CreatedBy { get; set; }
     
        /// <summary>
        /// 
        /// </summary>
        public string UpdatedUser { get; set; }
        

      
    }
}
