using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace LibraryManagement.Infrastructure.Services;

public class PasswordResetService : IPasswordResetService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<PasswordResetService> _logger;
    
    // In-memory storage for reset codes (for production, use Redis or database)
    private static readonly ConcurrentDictionary<string, ResetCodeData> _resetCodes = new();

    public PasswordResetService(
        IUserRepository userRepository,
        IEmailService emailService,
        ILogger<PasswordResetService> logger)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<PasswordResetResponse> RequestPasswordResetAsync(string email)
    {
        try
        {
            // Find user
            var user = await _userRepository.GetByEmailAsync(email);
            
            // Don't reveal if user exists for security
            if (user == null)
            {
                _logger.LogWarning("Password reset requested for non-existent email: {Email}", email);
                return new PasswordResetResponse
                {
                    Success = true,
                    Message = "If an account exists with this email, a reset code will be sent."
                };
            }

            // Generate 6-digit code
            var resetCode = GenerateResetCode();
            var expiryTime = DateTime.UtcNow.AddMinutes(15);

            // Store code
            var emailKey = email.ToLower();
            _resetCodes[emailKey] = new ResetCodeData
            {
                Code = resetCode,
                ExpiryTime = expiryTime,
                UserId = user.Id
            };

            // Send email
            await _emailService.SendPasswordResetEmailAsync(email, user.Name, resetCode);

            _logger.LogInformation("Password reset code sent to {Email}", email);

            return new PasswordResetResponse
            {
                Success = true,
                Message = "Reset code sent to your email"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error requesting password reset for {Email}", email);
            throw new InvalidOperationException("Failed to process password reset request");
        }
    }

    public async Task<PasswordResetResponse> ResetPasswordAsync(string email, string resetCode, string newPassword)
    {
        try
        {
            var emailKey = email.ToLower();
            
            // Verify code exists
            if (!_resetCodes.TryGetValue(emailKey, out var storedData))
            {
                return new PasswordResetResponse
                {
                    Success = false,
                    Message = "Invalid or expired reset code"
                };
            }

            // Check expiry
            if (storedData.ExpiryTime < DateTime.UtcNow)
            {
                _resetCodes.TryRemove(emailKey, out _);
                return new PasswordResetResponse
                {
                    Success = false,
                    Message = "Reset code has expired"
                };
            }

            // Verify code matches
            if (storedData.Code != resetCode)
            {
                return new PasswordResetResponse
                {
                    Success = false,
                    Message = "Invalid reset code"
                };
            }

            // Get user
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return new PasswordResetResponse
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            //user.UpdatedAt = DateTime.UtcNow;
            
            await _userRepository.UpdateAsync(user);

            // Remove used code
            _resetCodes.TryRemove(emailKey, out _);

            _logger.LogInformation("Password reset successful for {Email}", email);

            // Send confirmation email
            await _emailService.SendPasswordResetConfirmationAsync(email, user.Name);

            return new PasswordResetResponse
            {
                Success = true,
                Message = "Password reset successful"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password for {Email}", email);
            throw new InvalidOperationException("Failed to reset password");
        }
    }

    private static string GenerateResetCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private class ResetCodeData
    {
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiryTime { get; set; }
        public int UserId { get; set; }
    }
}
