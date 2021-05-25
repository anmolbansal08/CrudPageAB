using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Details))]
    public class Details
    {
        #region Public Properties
       
        public int Sno { get; set; }
      
        public string Name { get; set; }
       
        public int PhoneNo { get; set; }
     

        public DateTime DOB { get; set; }
  
        public bool Gender { get; set; }
       
        public string Address { get; set; }
     
        public int CitySno { get; set; }
       
        public string EmailId { get; set; }
      
        public string CityName { get; set; }
        
        
        #endregion
    }










}











/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.Model.Master
{

    [KnownType(typeof(Details))]
    public class Details
    {
        public int Sno { get; set; }
        public String MailId { get; set; }

        public String Name { get; set; }

        public int PhoneNo { get; set; }

        public DateTime DOB { get; set; }

        public bool Gender { get; set; }

        public String Address { get; set; }

        public int CitySno { get; set; }
        public String CityName { get; set; }
    }*/









/*   [KnownType(typeof(DetailsGridData))]
   public class DetailsGridData
   {
       public int Sno { get; set; }
       public String MailId { get; set; }

       public String Name { get; set; }

       public String PhoneNo { get; set; }

       public String DOB { get; set; }

       public String Gender { get; set; }

       public String Address { get; set; }

       public String CitySNo { get; set; }
       public String CityName { get; set; } 
   }

   [KnownType(typeof(DetailsSave))]
   public class DetailsSave
   {
       [Order(1)]
       public String MailId { get; set; }
       [Order(2)]
       public String Name { get; set; }
       [Order(3)]
       public String PhoneNo { get; set; }
       [Order(4)]
       public String DOB { get; set; }

       [Order(5)] 
       public Boolean Gender { get; set; }

       [Order(6)] 
       public String Address { get; set; }

       [Order(7)] 
       public String CitySNo { get; set; }
   }*/

