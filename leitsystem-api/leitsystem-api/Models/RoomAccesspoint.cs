using System.ComponentModel.DataAnnotations.Schema;

namespace leitsystem_api.Models
{
    public class RoomAccesspoint
    {
        // Composite key (RoomId, AccesspointId) should be configured in OnModelCreating.
        public int RoomId { get; set; }
        public int AccesspointId { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
        public virtual AccessPoint AccessPoint { get; set; }
    }
}