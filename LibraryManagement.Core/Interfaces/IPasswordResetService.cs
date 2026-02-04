using LibraryManagement.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagement.Core.Interfaces
{
    public interface IPasswordResetService
    {
        Task<PasswordResetResponse> RequestPasswordResetAsync(string email);
        Task<PasswordResetResponse> ResetPasswordAsync(string email, string resetCode, string newPassword);
    }
}
