using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;                        // BackgroundService
using Microsoft.Extensions.Logging;                         // ILogger<T>
using Microsoft.Extensions.DependencyInjection;            // CreateScope(), GetRequiredService<>
using LibraryManagement.Core.Interfaces;

namespace LibraryManagement.Infrastructure.Services
{
    public class NotificationBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationBackgroundService> _logger;

        public NotificationBackgroundService(IServiceProvider serviceProvider, ILogger<NotificationBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckDueDates();
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken); // Check daily
            }
        }

        private async Task CheckDueDates()
        {
            using var scope = _serviceProvider.CreateScope();
            var loanRepo = scope.ServiceProvider.GetRequiredService<ILoanRepository>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            var loans = await loanRepo.GetActiveLoansAsync();
            foreach (var loan in loans)
            {
                var daysUntilDue = (loan.DueDate - DateTime.UtcNow).Days;

                // Notify 3 days before due date
                if (daysUntilDue == 3)
                {
                    await notificationService.NotifyLoanDueSoonAsync(
                        loan.UserId, loan.Id, loan.Book?.Title ?? "", loan.DueDate);
                }
            }

            _logger.LogInformation("Due date check completed");
        }
    }
}
