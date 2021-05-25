
// <copyright file="SpaceControlSearchModel.cs" company="Cargoflash">
//
// Created On: 06-Feb-2017
// Created By: Braj
// Description: Space Control Search Model
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>


namespace CargoFlash.Cargo.Model.SpaceControl
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    #endregion


    public class SpaceControlSearchModel
    {
        /// <summary>
        /// Gets or sets flight finalised
        /// </summary>
        public string FlightFinalised { get; set; }
       /// <summary>
       /// Gets or sets order by ETD, Queue, Revenue, Weight
       /// </summary>
        public string OrderBy { get; set; }
        /// <summary>
        /// Gets or sets CAO
        /// </summary>
        public string CAO { get; set; }
        /// <summary>
        /// Gets or sets capacity utilized
        /// </summary>
        public string CapacityUtilized { get; set; }
        /// <summary>
        /// Gets or sets time to departure 
        /// </summary>
        public int? TimeToDep { get; set; }
        /// <summary>
        /// Gets or sets product sno where we can search data based on product type
        /// </summary>
        public int? ProductSNo { get; set; }
        /// <summary>
        /// Gets or sets Flight type that is Domestic or international
        /// </summary>
        public string FlightType { get; set; }
        /// <summary>
        /// Gets or sets Zone type that is Origin or Destination
        /// </summary>
        public string ZoneType { get; set; }
        /// <summary>
        /// Gets or sets search by input parameters like (KK,LL,Both)
        /// </summary>
        public string SearchBy { get; set; }
        /// <summary>
        /// Gets or sets Zone
        /// </summary>
        /// 
        [Required]
        public string Zone { get; set; }
        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// Gets or sets flight date
        /// </summary>
        [Required(ErrorMessage = "Please select flight date")]
        public DateTime FlightDate { get; set; }
        /// <summary>
        /// Gets or set AWB no 
        /// </summary>
        public string AWBNo { get; set; }
        /// <summary>
        /// Gets or sets origin
        /// </summary>
        public int? Origin { get; set; }
        /// <summary>
        /// Gets or sets destination
        /// </summary>
        public int? Destination { get; set; }
    }


  

}
