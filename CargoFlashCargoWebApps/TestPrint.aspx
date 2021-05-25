<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestPrint.aspx.cs" Inherits="CargoFlashCargoWebApps.TestPrint" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
       
<style>
    .dataleft
    {
    background-color:#000333;
    colspan:4;
    valign:middle; 
    align:right;
    }
</style>
    <form id="form1" runat="server">
    <div>
        <table>
            <tr><th colspan="3" rowspan="2"><center><img alt="LOGO" src="Logo/LOGO_Cgarge.png" style="width: 139px; height: 56px" /></center></th><th colspan="4"></th></tr>
            <tr><th colspan="4">CHARGE NOTE - CARGO</th></tr>
            <tr><td colspan="6">CG02030</td><td align="right">Date:</td><td class="auto-style4">01/11/15</td></tr>
            <tr><td colspan="6"></td><td align="right">Page:</td><td>1</td></tr>
            <tr><td colspan="6"></td><td align="right">Time:</td><td>10:43</td></tr>
            <tr><td>Payment</td><td>:</td><td colspan="2">Credit</td><td colspan="2">&nbsp;</td><td>Doc No:</td> <td>ESS / SAA </td></tr>
            <tr><td>Airline</td><td>:</td><td colspan="2">**</td><td colspan="2">&nbsp;</td><td>&nbsp;</td> <td>1144705</td></tr>
            <tr><td>Flight No</td><td>:</td><td colspan="2">S098SHJ</td><td colspan="2">STARLIGHT AIRLINE</td><td>Doc Date:</td> <td>28/10/2015</td></tr>
            <tr><td>Party</td><td>:</td><td colspan="2">&nbsp;</td><td colspan="2">&nbsp;</td><td>Mvmt No:</td> <td>AWB 0</td></tr>
            <tr><td colspan="8">
                    <table>
                        <tr><td colspan="6"><hr /></td></tr>
                        <tr>
                            <th align="left">Chg</th><th align="left">Description</th><th align="left">Qty</th><th align="left">Disc. ChgAmt</th><td>&nbsp;</td>
                            <th align="left">Amt Remarks</th>
                        </tr>
                        <tr><td colspan="6"><hr /></td></tr>
                        <tr>
                            <td>AWB:</td><td>3021-11697685</td><td>Pcs/Wt:3/270</td><td>GEN</td><td align="right">90.00</td><td>&nbsp;Lot No: 158854</td>
                       </tr>
                       <tr>
                            <td>ACC</td><td>ACCEPTANCE CHARGES</td><td>270</td><td></td><td></td><td class="auto-style5">19</td>
                        </tr>
                        <tr>
                            <td>XRY</td><td>SECURITY SCEERNING</td><td>270</td><td></td><td></td><td class="auto-style5">36</td>
                        </tr>
                        <tr>
                            <td>SLI</td><td>SLI CHARGES</td><td>1</td><td></td><td></td><td class="auto-style5">10</td>
                        </tr>
                        <tr>
                            <td>FWB</td><td>AWB DATA ENTRY CHARGES</td><td>1</td><td></td><td></td><td class="auto-style5">25</td>
                        </tr>
                          <tr><td colspan="6"><hr /></td></tr>
                        <tr>
                            <td></td><td></td><td>Total Amount:</td><td></td><td align="right">****90.00</td><td align="right">(CREDIT)</td>
                        </tr>
                          <tr><td colspan="6"><hr /></td></tr>
                    </table>
            </td></tr>
            <tr><td colspan="8">Note :</td></tr>
            <tr><td colspan="8">* Total Amount rounded up/off next Dhs.</td></tr>
                        <tr>
                            <td colspan="5">Service</td>
                            <td colspan="3" align="right">S3012</td>
                        </tr>
                        <tr>
                            <td colspan="5">Received By___________</td>
                            <td colspan="3" align="right">Prepared By___________</td>
                        </tr>
                        <tr>
                            <td  colspan="8">Receipt Done By: S1305 on :28-10-2015 13:22</td>
                        </tr>
            <tr><td colspan="8"><div style="height:120px;"></div></td></tr>
            <tr><td colspan="8"><hr /></td></tr>
            <tr><td colspan="8"><center>Garuda Indonesia<br /> </center></td></tr>
            <tr><td colspan="8"><hr /></td></tr>
                    </table>
    </div>
        <table >
            <tr>
                <td class="auto-style1">HEMAL</td>
                </tr>
            <tr>
                <td>:</td>
                <td class="dataleft">KUMAR</td>
            </tr>
        </table>

       
    </form>
</body>
</html>
