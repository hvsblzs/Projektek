const PRICES = {
    adult: 2500,
    student: 2000,
    senior: 1800,
  };
  
  export default function TicketSelector({ ticketCounts, setTicketCounts, onContinue }) {
    const handleChange = (type, value) => {
      const number = Math.max(0, parseInt(value) || 0);
      setTicketCounts({ ...ticketCounts, [type]: number });
    };
  
    const total =
      ticketCounts.adult * PRICES.adult +
      ticketCounts.student * PRICES.student +
      ticketCounts.senior * PRICES.senior;
  
    const totalTickets = ticketCounts.adult + ticketCounts.student + ticketCounts.senior;
  
    return (
      <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Jegyek kiválasztása</h2>
        {Object.entries(PRICES).map(([type, price]) => (
          <div key={type} className="mb-3">
            <label className="block mb-1 capitalize">{type} jegy ({price} Ft)</label>
            <input
              type="number"
              min="0"
              value={ticketCounts[type]}
              onChange={(e) => handleChange(type, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ))}
        <div className="mt-4 font-semibold">Összesen: {total} Ft ({totalTickets} jegy)</div>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={onContinue}
          disabled={totalTickets === 0}
        >
          Tovább a helyválasztáshoz
        </button>
      </div>
    );
  }