using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;
using LibraryManagement.Core.Interfaces;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;

namespace LibraryManagement.Infrastructure.Services;

public class PasswordResetService : IPasswordResetService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly LibraryDbContext _context;
    private readonly ILogger<PasswordResetService> _logger;

    public PasswordResetService(
        IUserRepository userRepository,
        IEmailService emailService,
        LibraryDbContext context,
        ILogger<PasswordResetService> logger)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _context = context;
        _logger = logger;
    }

    public async Task<PasswordResetResponse> RequestPasswordResetAsync(string email)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(email);

            // Don't reveal whether the email exists
            if (user == null)
            {
                _logger.LogWarning("Password reset requested for non-existent email");
                return new PasswordResetResponse
                {
                    Success = true,
                    Message = "If an account exists with this email, a reset code will be sent."
                };
            }

            // Invalidate any existing unused codes for this user
            var existingTokens = await _context.PasswordResetTokens
                .Where(t => t.UserId == user.Id && !t.IsUsed)
                .ToListAsync();

            foreach (var token in existingTokens)
                token.IsUsed = true;

            // Generate new code and persist it
            var resetCode = GenerateResetCode();
            _context.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                Code = resetCode,
                ExpiryTime = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            await _emailService.SendPasswordResetEmailAsync(email, user.Name, resetCode);

            _logger.LogInformation("Password reset code sent to user {UserId}", user.Id);

            return new PasswordResetResponse
            {
                Success = true,
                Message = "Reset code sent to your email"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error requesting password reset");
            throw new InvalidOperationException("Failed to process password reset request");
        }
    }

    public async Task<PasswordResetResponse> ResetPasswordAsync(string email, string resetCode, string newPassword)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return new PasswordResetResponse { Success = false, Message = "Invalid or expired reset code" };
            }

            var token = await _context.PasswordResetTokens
                .Where(t => t.UserId == user.Id && t.Code == resetCode && !t.IsUsed)
                .OrderByDescending(t => t.CreatedAt)
                .FirstOrDefaultAsync();

            if (token == null)
            {
                return new PasswordResetResponse { Success = false, Message = "Invalid or expired reset code" };
            }

            if (token.ExpiryTime < DateTime.UtcNow)
            {
                token.IsUsed = true;
                await _context.SaveChangesAsync();
                return new PasswordResetResponse { Success = false, Message = "Reset code has expired" };
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            token.IsUsed = true;

            await _userRepository.UpdateAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Password reset successful for user {UserId}", user.Id);

            await _emailService.SendPasswordResetConfirmationAsync(email, user.Name);

            return new PasswordResetResponse { Success = true, Message = "Password reset successful" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password");
            throw new InvalidOperationException("Failed to reset password");
        }
    }

    private static string GenerateResetCode()
    {
        var bytes = new byte[4];
        RandomNumberGenerator.Fill(bytes);
        var value = Math.Abs(BitConverter.ToInt32(bytes)) % 900000 + 100000;
        return value.ToString();
    }
}
