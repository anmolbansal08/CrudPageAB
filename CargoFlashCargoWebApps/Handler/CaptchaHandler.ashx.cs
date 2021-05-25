using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for CaptchaHandler
    /// </summary>
    public class CaptchaHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            using (Bitmap b = new Bitmap(150, 40, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(b))
                {
                    Rectangle rect = new Rectangle(0, 0, 149, 39);
                    g.FillRectangle(Brushes.White, rect);

                    // Create string to draw.
                    Random r = new Random();
                    int startIndex = r.Next(1, 5);
                    int length = r.Next(5, 10);
                    String drawString = Guid.NewGuid().ToString().Replace("-", "0").Substring(startIndex, length);
                    context.Session["CaptchaCode"] = drawString.ToString();  

                    // Create font and brush.
                    Font drawFont = new Font("Arial", 16, FontStyle.Italic | FontStyle.Strikeout);
                    using (SolidBrush drawBrush = new SolidBrush(Color.Black))
                    {
                        // Create point for upper-left corner of drawing.
                        PointF drawPoint = new PointF(15, 10);

                        // Draw string to screen.
                        g.DrawRectangle(new Pen(Color.Red, 0), rect);
                        g.DrawString(drawString, drawFont, drawBrush, drawPoint);
                    }
                    b.Save(context.Response.OutputStream, ImageFormat.Jpeg);
                    context.Response.ContentType = "image/jpeg";
                    context.Response.End();
                }
            }
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