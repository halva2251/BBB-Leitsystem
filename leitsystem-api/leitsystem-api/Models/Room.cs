using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace leitsystem_api.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        // Foreign key to Floor
        public int FloorId { get; set; }

        public int Capacity { get; set; }

        public string Type { get; set; }

        public bool IsActive { get; set; }

        // Navigation property: each Room belongs to one Floor.
        [ForeignKey("FloorId")]
        public virtual Floor Floor { get; set; }

        // Many-to-many relationship: a Room can be connected to multiple AccessPoints.
        public virtual ICollection<RoomAccesspoint> RoomAccesspoints { get; set; } = new List<RoomAccesspoint>();
    }
}
