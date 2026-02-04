using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LibraryManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBooks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "AvailableCopies", "CoverUrl", "CreatedAt", "Description", "Genre", "ISBN", "MetadataJson", "Status", "Title", "TotalCopies", "UpdatedAt" },
                values: new object[,]
                {
                    { 7, "F. Scott Fitzgerald", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9970), "A novel about the American dream and tragedy in the Jazz Age", "Fiction", "978-0743273565", null, "Available", "The Great Gatsby", 4, null },
                    { 8, "Jane Austen", 5, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9973), "A classic romantic novel about manners and matrimonial machinations", "Fiction", "978-1503290563", null, "Available", "Pride and Prejudice", 5, null },
                    { 9, "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", 2, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9977), "Elements of reusable object?oriented software", "Programming", "978-0201633610", null, "Available", "Design Patterns (GoF)", 2, null },
                    { 10, "Kyle Simpson", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9980), "A deep dive into JavaScript’s core mechanisms", "Programming", "978-1098115464", null, "Available", "You Don't Know JS Yet", 3, null },
                    { 11, "Cormen, Leiserson, Rivest, Stein", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9984), "Comprehensive algorithms textbook", "Programming", "978-0262033848", null, "Available", "Introduction to Algorithms (CLRS)", 3, null },
                    { 12, "Stephen Hawking", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9987), "Exploration of the universe’s origins and structure", "Science", "978-0553380163", null, "Available", "A Brief History of Time", 4, null },
                    { 13, "Richard Dawkins", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9991), "Evolutionary biology from a gene?centric view", "Science", "978-0198788607", null, "Available", "The Selfish Gene", 4, null },
                    { 14, "Yuval Noah Harari", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9994), "Big history of human species", "Science", "978-0062316097", null, "Available", "Sapiens: A Brief History of Humankind", 4, null },
                    { 15, "Thomas S. Kuhn", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 967, DateTimeKind.Utc).AddTicks(9998), "Foundations of paradigm shifts in science", "Science", "978-0226458120", null, "Available", "The Structure of Scientific Revolutions", 3, null },
                    { 16, "Rebecca Skloot", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(3), "Story of Henrietta Lacks and HeLa cells", "Science", "978-1400052189", null, "Available", "The Immortal Life of Henrietta Lacks", 4, null },
                    { 17, "Jared Diamond", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(44), "Analysis of factors shaping civilizations", "History", "978-0393354324", null, "Available", "Guns, Germs, and Steel", 4, null },
                    { 18, "Sun Tzu", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(49), "Ancient military strategy classic", "History", "978-1590302255", null, "Available", "The Art of War", 3, null },
                    { 19, "Anne Frank", 5, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(235), "Wartime diary of a Jewish girl", "History", "978-0553296983", null, "Available", "The Diary of Anne Frank", 5, null },
                    { 20, "Edward Gibbon", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(239), "Classic history of Rome’s fall", "History", "978-0140442106", null, "Available", "Decline of the Roman Empire", 3, null },
                    { 21, "Antony Beevor", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(243), "Comprehensive WWII history", "History", "978-0241987091", null, "Available", "The Second World War", 4, null },
                    { 22, "Walter Isaacson", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(246), "Biography of Apple co?founder", "Biography", "978-1451648539", null, "Available", "Steve Jobs", 3, null },
                    { 23, "Nelson Mandela", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(250), "Autobiography of Nelson Mandela", "Biography", "978-0316548182", null, "Available", "Long Walk to Freedom", 4, null },
                    { 24, "Samuel Pepys", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(253), "17th?century English diary", "Biography", "978-0141440644", null, "Available", "The Diary of Samuel Pepys", 3, null },
                    { 25, "Walter Isaacson", 3, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(257), "Life of Albert Einstein", "Biography", "978-0743264747", null, "Available", "Einstein: His Life and Universe", 3, null },
                    { 26, "Michelle Obama", 5, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(261), "Memoir of Michelle Obama", "Biography", "978-1524763138", null, "Available", "Becoming", 5, null },
                    { 27, "Agatha Christie", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(265), "Hercule Poirot mystery", "Mystery", "978-0007119318", null, "Available", "The Murder of Roger Ackroyd", 4, null },
                    { 28, "Stieg Larsson", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(269), "Thriller novel", "Mystery", "978-0307454546", null, "Available", "The Girl with the Dragon Tattoo", 4, null },
                    { 29, "Gillian Flynn", 4, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(274), "Psychological thriller", "Mystery", "978-0307588371", null, "Available", "Gone Girl", 4, null },
                    { 30, "Dan Brown", 5, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(278), "Conspiracy thriller", "Mystery", "978-0307474278", null, "Available", "The Da Vinci Code", 5, null },
                    { 31, "Agatha Christie", 5, null, new DateTime(2026, 2, 3, 14, 9, 38, 968, DateTimeKind.Utc).AddTicks(281), "Classic locked?room mystery", "Mystery", "978-0062073488", null, "Available", "And Then There Were None", 5, null }
                });

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
                columns: new[] { "Name", "PasswordHash" },
                values: new object[] { "Sizwe Librarian", "$2a$11$ajhc3F4uJeIv2TYj/YA3.egPR.g8.8fqCxi2IUrj0roGcybbwb/Ou" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "PasswordHash" },
                values: new object[] { "Luyanda Patron", "$2a$11$0ThRgPFUjQ5m7e5jt0jp6OHutk.Bhd3xMaLFnGH67.2u6pmuCRUBi" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$D3sDQYKA3G3ayrGCsksai.xNK8Ll6dk4gaoxIQLPRqgwargfJjtki");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Name", "PasswordHash" },
                values: new object[] { "Jane Librarian", "$2a$11$k9vHwpIHgLuknr1gY9zlcO81.OFjqza7iBWGrjCj0WPz0OgJHqDKm" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "PasswordHash" },
                values: new object[] { "John Patron", "$2a$11$sqTkNMt0saPdYH2k0mNom.hPNTPGzRVJ7f0.C6Ba/0KOClEjqO84G" });
        }
    }
}
