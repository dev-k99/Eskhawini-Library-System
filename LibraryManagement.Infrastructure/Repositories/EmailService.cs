

using System.Net;
using System.Net.Mail;
using LibraryManagement.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPassword;
    private readonly bool _enableSsl;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        // Read from appsettings.json
        _fromEmail = _configuration["Email:FromEmail"] ?? "noreply@libraryos.com";
        _fromName = _configuration["Email:FromName"] ?? "LibraryOS";
        _smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
        _smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        _smtpUser = _configuration["Email:SmtpUser"] ?? "";
        _smtpPassword = _configuration["Email:SmtpPassword"] ?? "";
        _enableSsl = bool.Parse(_configuration["Email:EnableSsl"] ?? "true");
    }

    public async Task SendBookAvailableEmailAsync(string userEmail, string userName, string bookTitle)
    {
        var subject = $"📚 Book Available: {bookTitle}";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; color: #333;'>
                <h2>Good News, {userName}!</h2>
                <p>The book <strong>{bookTitle}</strong> is now available for checkout.</p>
                <p>Visit the library or log into your account to borrow it now.</p>
                <br>
                <p style='color: #666; font-size: 12px;'>
                    This is an automated message from LibraryOS. Please do not reply.
                </p>
            </body>
            </html>
        ";

        await SendEmailAsync(userEmail, subject, body);
    }

    public async Task SendReservationReadyEmailAsync(string userEmail, string userName, string bookTitle)
    {
        var subject = $"📖 Reservation Ready: {bookTitle}";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; color: #333;'>
                <h2>Hi {userName},</h2>
                <p>Your reserved book <strong>{bookTitle}</strong> is now ready for pickup!</p>
                <p>Please collect it from the library within the next 7 days.</p>
                <br>
                <p style='color: #666; font-size: 12px;'>
                    This is an automated message from LibraryOS. Please do not reply.
                </p>
            </body>
            </html>
        ";

        await SendEmailAsync(userEmail, subject, body);
    }

    public async Task SendLoanDueSoonEmailAsync(string userEmail, string userName, string bookTitle, DateTime dueDate)
    {
        var subject = $"⏰ Reminder: {bookTitle} Due Soon";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; color: #333;'>
                <h2>Hi {userName},</h2>
                <p>This is a friendly reminder that your borrowed book <strong>{bookTitle}</strong> is due on <strong>{dueDate:MMMM dd, yyyy}</strong>.</p>
                <p>Please return it on time to avoid late fees.</p>
                <br>
                <p style='color: #666; font-size: 12px;'>
                    This is an automated message from LibraryOS. Please do not reply.
                </p>
            </body>
            </html>
        ";

        await SendEmailAsync(userEmail, subject, body);
    }

    public async Task SendOverdueNoticeEmailAsync(string userEmail, string userName, string bookTitle, DateTime dueDate)
    {
        var subject = $"⚠️ Overdue Notice: {bookTitle}";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif; color: #333;'>
                <h2>Hi {userName},</h2>
                <p>Your borrowed book <strong>{bookTitle}</strong> was due on <strong>{dueDate:MMMM dd, yyyy}</strong> and is now overdue.</p>
                <p>Please return it as soon as possible to avoid additional late fees.</p>
                <br>
                <p style='color: #666; font-size: 12px;'>
                    This is an automated message from LibraryOS. Please do not reply.
                </p>
            </body>
            </html>
        ";

        await SendEmailAsync(userEmail, subject, body);
    }

    private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        // If SMTP not configured, just log and return (dev mode)
        if (string.IsNullOrWhiteSpace(_smtpUser) || string.IsNullOrWhiteSpace(_smtpPassword))
        {
            _logger.LogWarning("Email not sent (SMTP not configured): {Subject} to {Email}", subject, toEmail);
            return;
        }

        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(_fromEmail, _fromName);
            message.To.Add(new MailAddress(toEmail));
            message.Subject = subject;
            message.Body = htmlBody;
            message.IsBodyHtml = true;

            using var smtpClient = new SmtpClient(_smtpHost, _smtpPort);
            smtpClient.Credentials = new NetworkCredential(_smtpUser, _smtpPassword);
            smtpClient.EnableSsl = _enableSsl;

            await smtpClient.SendMailAsync(message);
            _logger.LogInformation("Email sent: {Subject} to {Email}", subject, toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email: {Subject} to {Email}", subject, toEmail);
        }
    }

    public async Task SendPasswordResetEmailAsync(string email, string userName, string resetCode)
    {
        var subject = "LibraryOS - Password Reset Code";

        var body = $@"
        <div style='font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background: #2563eb; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 28px;'>Password Reset Request</h1>
            </div>
            
            <div style='background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;'>
                <p style='color: #374151; font-size: 16px; margin-bottom: 20px;'>
                    Hi <strong>{userName}</strong>,
                </p>
                
                <p style='color: #374151; font-size: 16px; margin-bottom: 30px;'>
                    We received a request to reset your LibraryOS password. Use the code below to reset your password:
                </p>
                
                <div style='background: #f3f4f6; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;'>
                    <div style='font-size: 14px; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;'>
                        Your Reset Code
                    </div>
                    <div style='font-size: 42px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;'>
                        {resetCode}
                    </div>
                    <div style='font-size: 13px; color: #9ca3af; margin-top: 15px;'>
                        Code expires in 15 minutes
                    </div>
                </div>
                
                <div style='background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 8px; margin: 25px 0;'>
                    <p style='color: #92400e; font-size: 14px; margin: 0;'>
                        <strong>⚠️ Security Notice:</strong> If you didn't request this reset, please ignore this email or contact support.
                    </p>
                </div>
                
                <p style='color: #6b7280; font-size: 14px; margin-top: 30px;'>
                    Best regards,<br/>
                    <strong>The LibraryOS Team</strong>
                </p>
            </div>
            
            <div style='text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;'>
                <p style='margin: 5px 0;'>© 2026 LibraryOS. All rights reserved.</p>
            </div>
        </div>
    ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetConfirmationAsync(string email, string userName)
    {
        var subject = "LibraryOS - Password Changed Successfully";

        var body = $@"
        <div style='font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background: #059669; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;'>
                <div style='font-size: 48px; margin-bottom: 10px;'>✓</div>
                <h1 style='color: white; margin: 0; font-size: 28px;'>Password Changed</h1>
            </div>
            
            <div style='background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;'>
                <p style='color: #374151; font-size: 16px; margin-bottom: 20px;'>
                    Hi <strong>{userName}</strong>,
                </p>
                
                <p style='color: #374151; font-size: 16px; margin-bottom: 20px;'>
                    Your LibraryOS password has been successfully changed.
                </p>
                
                <div style='background: #d1fae5; border-left: 4px solid #059669; padding: 15px 20px; border-radius: 8px; margin: 25px 0;'>
                    <p style='color: #065f46; font-size: 14px; margin: 0;'>
                        <strong>✓ All Set!</strong> You can now sign in with your new password.
                    </p>
                </div>
                
                <div style='background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 8px; margin: 25px 0;'>
                    <p style='color: #92400e; font-size: 14px; margin: 0;'>
                        <strong>⚠️ Didn't make this change?</strong> Please contact support immediately.
                    </p>
                </div>
                
                <p style='color: #6b7280; font-size: 14px; margin-top: 30px;'>
                    Best regards,<br/>
                    <strong>The LibraryOS Team</strong>
                </p>
            </div>
            
            <div style='text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;'>
                <p style='margin: 5px 0;'>© 2026 LibraryOS. All rights reserved.</p>
            </div>
        </div>
    ";

        await SendEmailAsync(email, subject, body);
    }
}