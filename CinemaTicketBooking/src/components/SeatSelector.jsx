export default function SeatSelector({ screening, ticketCounts, selectedSeats, setSelectedSeats }) {

  const totalToSelect = ticketCounts.adult + ticketCounts.student + ticketCounts.senior;
  
  const isBooked = (row, seat) => {
    return screening.bookings.some(b => b.row === row && b.seat === seat);
  };
  
  const isSelected = (row, seat) => {
    return selectedSeats.some(s => s.row === row && s.seat === seat);
  };
  
  const toggleSeat = (row, seat) => {
    const selected = isSelected(row, seat);
    let updated;
  
    if (selected) {
    updated = selectedSeats.filter(s => !(s.row === row && s.seat === seat));
    } else {
    if (selectedSeats.length >= totalToSelect) return;
    updated = [...selectedSeats, { row, seat }];
    }
  
    setSelectedSeats(updated);
  };
  
  const rows = Array.from({ length: screening.room.rows }, (_, i) => i + 1);
  const seats = Array.from({ length: screening.room.seatsPerRow }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center items-center my-6">
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Válaszd ki a helyeket ({selectedSeats.length}/{totalToSelect})</h2>
      <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${rows.length}, auto)` }}>
      {rows.map(row => (
        <div key={row} className="flex gap-2 justify-center">
        {seats.map(seat => {
          const booked = isBooked(row, seat);
          const selected = isSelected(row, seat);
          return (
          <button
            key={`${row}-${seat}`}
            disabled={booked}
            onClick={() => toggleSeat(row, seat)}
            className={`w-8 h-8 text-sm rounded ${
            booked
              ? 'bg-gray-300 cursor-not-allowed'
              : selected
              ? 'bg-green-500 text-white'
              : 'bg-blue-200 hover:bg-blue-400'
            }`}
          >
            {seat}
          </button>
          );
        })}
        </div>
      ))}
      </div>
    </div>
    </div>
  );
  }