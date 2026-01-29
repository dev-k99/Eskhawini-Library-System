using System.Text;
using LibraryManagement.Core.Interfaces;
using ZXing;
using ZXing.Common;

namespace LibraryManagement.Infrastructure.Services;

public class QRCodeService : IQRCodeService
{
    public string GenerateQRCode(string content)
    {
        var writer = new BarcodeWriterSvg
        {
            Format = BarcodeFormat.QR_CODE,
            Options = new EncodingOptions
            {
                Height = 200,
                Width = 200,
                Margin = 1
            }
        };

        var svgContent = writer.Write(content);
        var base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(svgContent.Content));
        return $"data:image/svg+xml;base64,{base64}";
    }

    public string GenerateLoanQRCode(int loanId, int bookId, int userId)
    {
        var content = $"LOAN:{loanId}|BOOK:{bookId}|USER:{userId}|TIME:{DateTime.UtcNow:O}";
        return GenerateQRCode(content);
    }
}
