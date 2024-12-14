using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VstepPractice.API.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnDurationForSectionPart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "duration",
                table: "SectionParts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "duration",
                table: "SectionParts");
        }
    }
}
