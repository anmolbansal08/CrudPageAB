
// <copyright file="OffloadShipmentGridRequest.cs" company="Cargoflash">
//
// Created On: 07-May-2017
// Created By: Braj
// Description: Offload shipment grid request model
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

    /// <summary>
    /// Offload shipment grid request 
    /// </summary>
    public class OffloadShipmentGridRequest
    {

        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }

        /// <summary>
        /// Gets or sets flight date
        /// </summary>    
        public DateTime? FlightDate { get; set; }
        /// <summary>
        /// Gets or sets flight date start from
        /// </summary>
        public DateTime? From { get; set; }
        /// <summary>
        /// Gets or sets flight date end to
        /// </summary>
        public DateTimeOffset? To { get; set; }

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

        /// <summary>
        /// Gets or sets reference number
        /// </summary>
        public string ReferenceNo { get; set; }


    }

}
