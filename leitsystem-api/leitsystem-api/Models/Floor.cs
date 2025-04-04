using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace leitsystem_api.Models
{
    public class Floor
    {
        [Key]
        public int Id { get; set; }

        // Foreign key to Building
        public int BuildingId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        // Navigation property: each Floor belongs to one Building.
        [ForeignKey("BuildingId")]
        public virtual Building Building { get; set; }

        // Navigation property: one Floor can have many Rooms.
        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
    }
}
