using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagement.Core.DTOs
{
    public class RequestPasswordResetRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string ResetCode { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class PasswordResetResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
