using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.Web;

namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for BarcodeGenerator
    /// </summary>
    public class BarcodeGenerator : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            //Creating the bitmap object creating the same using the parameters provided...
            Bitmap barCodeBitmap = GenerateBarCode(context.Request.QueryString["text"], context.Server.MapPath(context.Request.QueryString["barCodeFileRelativePath"]), Convert.ToInt32(context.Request.QueryString["fontSize"]), Convert.ToInt32(context.Request.QueryString["imageWidth"]), Convert.ToInt32(context.Request.QueryString["imageHeight"]));

            context.Response.ContentType = "image/gif";
            context.Response.Clear();
            // Send the image for display...
            barCodeBitmap.Save(context.Response.OutputStream, ImageFormat.Gif);
            context.Response.End();
            barCodeBitmap.Dispose();
        }
        private Bitmap GenerateBarCode(string barCodeText, string barCodeRelativeFilePath, int fontSize, int width, int height)
        {
            // For Code 128...
            //barCodeText = (new Code128Encoder()).GetCode128DataString(barCodeText).ToString();
            // For IDAutomationHC39M...
            barCodeText = "*" + barCodeText + "*";
            //Creating the font collection, to create a font from the font file...
            PrivateFontCollection pfCollections = new PrivateFontCollection();
            pfCollections.AddFontFile(barCodeRelativeFilePath);
            Font font = new Font(new FontFamily("IDAutomationHC39M", pfCollections), fontSize, FontStyle.Regular, GraphicsUnit.Point);

            Bitmap barCodeBitmapTemp = new Bitmap(1, 1);
            Graphics graphicsTemp = Graphics.FromImage(barCodeBitmapTemp);

            SizeF textSize = graphicsTemp.MeasureString(barCodeText, font);
            Bitmap barCodeBitmap = new Bitmap(Convert.ToInt16(textSize.Width), Convert.ToInt16(textSize.Height)); //new Bitmap(barCodeBitmap, textSize.ToSize());
            Graphics graphics = Graphics.FromImage(barCodeBitmap);
            graphics.Clear(Color.White);
            graphics.TextRenderingHint = TextRenderingHint.SingleBitPerPixel;
            graphics.DrawString(barCodeText, font, new SolidBrush(Color.Black), 0, 0);
            graphics.Flush();
            font.Dispose();
            graphics.Dispose();
            return barCodeBitmap;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}