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

    // Updated: accepts the full Loan entity so we can embed ISBN + DueDate
    public string GenerateLoanQRCode(int loanId, int bookId, int userId, string isbn, DateTime dueDate)
    {
        var content = $"LOAN:{loanId}|BOOK:{bookId}|USER:{userId}|ISBN:{isbn}|DUE:{dueDate:yyyy-MM-dd}|TIME:{DateTime.UtcNow:O}";
        return GenerateQRCode(content);
    }
}