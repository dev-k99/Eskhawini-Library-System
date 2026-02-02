

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
}