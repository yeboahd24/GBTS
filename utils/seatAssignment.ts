import { Bus, Ticket } from '../types/schema';

/**
 * Auto-assign the next available seat for a bus
 * @param bus - The bus configuration
 * @param occupiedSeats - Array of already occupied seat numbers
 * @returns Next available seat number or null if bus is full
 */
export const getNextAvailableSeat = (bus: Bus, occupiedSeats: string[]): string | null => {
  // Generate all possible seat numbers for this bus
  const allSeats = generateSeatNumbers(bus);
  
  // Filter out reserved seats and occupied seats
  const availableSeats = allSeats.filter(seat => 
    !bus.reservedSeats.includes(seat) && 
    !occupiedSeats.includes(seat)
  );
  
  // Return the first available seat (lowest number)
  return availableSeats.length > 0 ? availableSeats[0] : null;
};

/**
 * Generate all seat numbers for a bus based on its capacity
 * Assumes standard bus layout: rows with A and B seats (aisle seating)
 * @param bus - The bus configuration
 * @returns Array of all seat numbers
 */
const generateSeatNumbers = (bus: Bus): string[] => {
  const seats: string[] = [];
  const seatsPerRow = 2; // A and B seats per row
  const totalRows = Math.ceil(bus.capacity / seatsPerRow);
  
  for (let row = 1; row <= totalRows; row++) {
    // Add A seat (window)
    if (seats.length < bus.capacity) {
      seats.push(`${row}A`);
    }
    // Add B seat (aisle)
    if (seats.length < bus.capacity) {
      seats.push(`${row}B`);
    }
  }
  
  return seats;
};

/**
 * Validate if a manually selected seat is available
 * @param seatNumber - The requested seat number
 * @param bus - The bus configuration
 * @param occupiedSeats - Array of already occupied seat numbers
 * @returns true if seat is available, false otherwise
 */
export const isSeatAvailable = (seatNumber: string, bus: Bus, occupiedSeats: string[]): boolean => {
  const allSeats = generateSeatNumbers(bus);
  
  return allSeats.includes(seatNumber) && 
         !bus.reservedSeats.includes(seatNumber) && 
         !occupiedSeats.includes(seatNumber);
};

/**
 * Get seat assignment info for display
 * @param seatNumber - The assigned seat number (could be auto or manual)
 * @param isAutoAssigned - Whether the seat was auto-assigned
 * @returns Display information about the seat assignment
 */
export const getSeatAssignmentInfo = (seatNumber: string, isAutoAssigned: boolean) => {
  return {
    seatNumber,
    isAutoAssigned,
    displayText: isAutoAssigned ? `${seatNumber} (Auto-assigned)` : seatNumber
  };
};