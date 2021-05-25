
// <copyright file="OffloadShipmentGridResponse.cs" company="Cargoflash">
//
// Created On: 08-May-2017
// Created By: Braj
// Description: Offload shipment grid response model
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
    /// Offload shipment grid response 
    /// </summary>
    public class OffloadShipmentGridResponse
    {
        /// <summary>
        /// Gets or sets awb sno
        /// </summary>
        public string AWBSNo { get; set; }
        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }

        /// <summary>
        /// Gets or sets flight date
        /// </summary>    
        public string FlightDate { get; set; }

        /// <summary>
        /// Gets or set AWB no 
        /// </summary>
        public string AWBNo { get; set; }

        /// <summary>
        /// Gets or sets origin
        /// </summary>
        public string Board { get; set; }
        /// <summary>
        /// Gets or sets destination
        /// </summary>
        public string Destination { get; set; }

        /// <summary>
        /// Gets or sets reference number
        /// </summary>
        public string BookingRefNo { get; set; }
        /// <summary>
        /// Gets or sets pieces 
        /// </summary>
        public string Pieces { get; set; }
        /// <summary>
        /// Gets or sets gross weight 
        /// </summary>
        public string GrossWeight { get; set; }
        /// <summary>
        /// Gets or sets volume weight
        /// </summary>
        public string VolumeWeight { get; set; }
        /// <summary>
        /// Gets or sets flight volume 
        /// </summary>
        public string FlightVolume { get; set; }
        /// <summary>
        /// Gets or sets flight status
        /// </summary>
        public string FlightStatus { get; set; }

        /// <summary>
        /// Gets or sets awb status
        /// </summary>
        public string Status { get; set; }

    }

}
