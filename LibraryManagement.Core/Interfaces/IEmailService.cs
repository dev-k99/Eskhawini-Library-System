using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagement.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendBookAvailableEmailAsync(string userEmail, string userName, string bookTitle);
        Task SendReservationReadyEmailAsync(string userEmail, string userName, string bookTitle);
        Task SendLoanDueSoonEmailAsync(string userEmail, string userName, string bookTitle, DateTime dueDate);
        Task SendOverdueNoticeEmailAsync(string userEmail, string userName, string bookTitle, DateTime dueDate);
        Task SendPasswordResetEmailAsync(string email, string userName, string resetCode);
        Task SendPasswordResetConfirmationAsync(string email, string userName);
    }
}
