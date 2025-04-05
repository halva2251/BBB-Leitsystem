using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace leitsystem_api.Models
{
    public class RoomAccesspoint
    {
        // Composite key (RoomId, AccesspointId) should be configured in OnModelCreating.
        public int RoomId { get; set; }
        public int AccesspointId { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual Room Room { get; set; }
        public virtual AccessPoint AccessPoint { get; set; }
    }
}