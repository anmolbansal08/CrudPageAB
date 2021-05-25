// <copyright file="AWBNoDetailsRequestModel.cs" company="Cargoflash">
//
// Created On: 8-Feb-2017
// Created By: Braj
// Description: AWBNo Details Request Model
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

    public class AWBNoDetailsRequestModel
    {
        /// <summary>
        /// Gets or sets awb reference booking sno
        /// </summary>
        public int? AWBRefBookingSNo { get; set; }
        /// <summary>
        /// Gets or sets awb no
        /// </summary>
        public string AWBNo { get; set; }
        /// <summary>
        /// Gets or sets is tab or not
        /// </summary>
        public bool? IsTab { get; set; }
        /// <summary>
        /// Gets or sets booked from
        /// </summary>
        public string bookedFrom { get; set; }

    }
}
