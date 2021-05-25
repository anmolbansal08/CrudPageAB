using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.SpaceControl
{
    public class FlightSearchModel
    {
        public int FlightDetailsDailyFlightSNo { get; set; }
        [Required(ErrorMessage = "Please select Flight Number")]
        public string FlightDetailsFlightNo { get; set; }
        [Required(ErrorMessage = "Please select Flight Date")]
        public DateTime FlightDetailsFlightDate { get; set; }
        [Required(ErrorMessage = "Please select Airport")]
        public string FlightDetailsAirport { get; set; }
    }
}
