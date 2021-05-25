using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model
{

    [KnownType(typeof(UserHistory))]
    public class UserHistory
    {
        //public string Status { get; set; }
        //public string Created { get; set; }
        //public string modified { get; set; }
        //public string blocked { get; set; }
        //public string activated { get; set; }
        //public string deleted { get; set; }

        public int SNo { get; set; }
        public string Airline { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string GroupName { get; set; }
        public string EmailAddress { get; set; }
        public string CityCode { get; set; }
        public string NoOfBadAttemps { get; set; }
        public string LastLoggedOn { get; set; }
        public string Active { get; set; }
        public string Blocked { get; set; }
        public string Created { get; set; }
        public string Modified { get; set; }
        public string Deleted { get; set; }
    }

    [KnownType(typeof(UserHistoryDescription))]
    public class UserHistoryDescription
    {
        public int UsersHistorySNo { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public string AirlineName { get; set; }
        public string IsDefaultCity { get; set; }
        public string Active { get; set; }
        public string Created { get; set; }
        public string Modified { get; set; }
    }

    // Added by Vipin Kumar
    [KnownType(typeof(UserHistoryGetRecord))]
    public class UserHistoryGetRecord
    {
        [Required]
        public int? userSNo { get; set; }
        public string Email { get; set; }
    }
    // Ends
}
