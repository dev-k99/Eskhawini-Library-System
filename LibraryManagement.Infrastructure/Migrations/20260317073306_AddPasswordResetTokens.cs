using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LibraryManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Code = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    ExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6507));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6511));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6515));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6519), "A deep dive into JavaScript�s core mechanisms" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6523));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6527), "Exploration of the universe�s origins and structure" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6530));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6561));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6565));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6568));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6765));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6792));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6796));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6800), "Classic history of Rome�s fall" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6826));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6831));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6835));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6839));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6843));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6847));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6851));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6855));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6859));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 30,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6863));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 17, 7, 33, 4, 157, DateTimeKind.Utc).AddTicks(6867));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$ly4kTiOXs6R2z1jBfyNKFuuSLt2TCZR6ugEQh4axJg4OhLVbuU4Du");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$pPXlLKpDsj3nWkrisl1euO0m05ZQ9NtaSJAw7u3MdOGEMt.jzEAI.");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$hzAMSZ5nirp7GC7S3.P07ekrxgtdEwAQ0Y22JTOdgjc9OPyRB3RPq");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_UserId_IsUsed",
                table: "PasswordResetTokens",
                columns: new[] { "UserId", "IsUsed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetTokens");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9970));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9973));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9977));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9980), "A deep dive into JavaScript’s core mechanisms" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9984));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9987), "Exploration of the universe’s origins and structure" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9991));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9994));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9998));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(3));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(44));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(49));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(235));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(239), "Classic history of Rome’s fall" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(243));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(246));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(250));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(253));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(257));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(261));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(265));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(269));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(274));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 30,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(278));

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(281));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$0iDzYi4kc5E.H//F2zM3zehgVsVHt3u.bK6jjcR7AWMcIzTx5Z9bi");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$ajhc3F4uJeIv2TYj/YA3.egPR.g8.8fqCxi2IUrj0roGcybbwb/Ou");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$0ThRgPFUjQ5m7e5jt0jp6OHutk.Bhd3xMaLFnGH67.2u6pmuCRUBi");
        }
    }
}
