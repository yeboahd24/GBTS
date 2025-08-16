import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Company, Route, Bus, Trip, Ticket, BookingData, AnalyticsData } from '../types/schema';
import { mockQuery } from '../data/gbtsMockData';
import { getNextAvailableSeat } from '../utils/seatAssignment';

// Mock API implementation
const mockApiCall = async <T>(data: T, delay = 500): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return data;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Company', 'Route', 'Bus', 'Trip', 'Ticket', 'Analytics'],
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      queryFn: async () => {
        const data = await mockApiCall(mockQuery.companies);
        return { data };
      },
      providesTags: ['Company'],
    }),
    
    getRoutes: builder.query<Route[], string | undefined>({
      queryFn: async (companyId) => {
        let data = mockQuery.routes;
        if (companyId) {
          data = data.filter(route => route.companyId === companyId);
        }
        const result = await mockApiCall(data);
        return { data: result };
      },
      providesTags: ['Route'],
    }),
    
    getBuses: builder.query<Bus[], string | undefined>({
      queryFn: async (companyId) => {
        let data = mockQuery.buses;
        if (companyId) {
          data = data.filter(bus => bus.companyId === companyId);
        }
        const result = await mockApiCall(data);
        return { data: result };
      },
      providesTags: ['Bus'],
    }),
    
    getTrips: builder.query<Trip[], { routeId?: string; departureDate?: string; origin?: string; destination?: string }>({
      queryFn: async (params) => {
        let data = mockQuery.trips;
        
        if (params.routeId) {
          data = data.filter(trip => trip.routeId === params.routeId);
        }
        if (params.departureDate) {
          data = data.filter(trip => trip.departureDate === params.departureDate);
        }
        if (params.origin && params.destination) {
          data = data.filter(trip => 
            trip.route?.origin === params.origin && 
            trip.route?.destination === params.destination
          );
        }
        
        const result = await mockApiCall(data);
        return { data: result };
      },
      providesTags: ['Trip'],
    }),
    
    getTickets: builder.query<Ticket[], { tripId?: string; passengerPhone?: string; dateRange?: { start: string; end: string } }>({
      queryFn: async (params) => {
        let data = mockQuery.tickets;
        
        if (params.tripId) {
          data = data.filter(ticket => ticket.tripId === params.tripId);
        }
        if (params.passengerPhone) {
          data = data.filter(ticket => ticket.passengerPhone === params.passengerPhone);
        }
        
        const result = await mockApiCall(data);
        return { data: result };
      },
      providesTags: ['Ticket'],
    }),
    
    getAnalytics: builder.query<AnalyticsData, string | undefined>({
      queryFn: async (companyId) => {
        // In real app, filter analytics by company
        const result = await mockApiCall(mockQuery.analytics);
        return { data: result };
      },
      providesTags: ['Analytics'],
    }),
    
    bookTicket: builder.mutation<Ticket, BookingData>({
      queryFn: async (booking) => {
        // Get trip and bus data for seat assignment
        const trip = mockQuery.trips.find(t => t.id === booking.tripId);
        const bus = mockQuery.buses.find(b => b.id === trip?.busId);
        
        if (!trip || !bus) {
          throw new Error('Trip or bus not found');
        }
        
        // Get occupied seats for this trip
        const occupiedSeats = mockQuery.tickets
          .filter(ticket => ticket.tripId === booking.tripId)
          .map(ticket => ticket.seatNumber);
        
        // Auto-assign seat if not provided
        let assignedSeat = booking.seatNumber;
        if (!assignedSeat) {
          assignedSeat = getNextAvailableSeat(bus, occupiedSeats);
          if (!assignedSeat) {
            throw new Error('No available seats on this trip');
          }
        }
        
        // Validate manually selected seat
        if (booking.seatNumber && (
          bus.reservedSeats.includes(booking.seatNumber) || 
          occupiedSeats.includes(booking.seatNumber)
        )) {
          throw new Error('Selected seat is not available');
        }
        
        // Simulate booking process
        const newTicket: Ticket = {
          id: `ticket-${Date.now()}`,
          ticketCode: Math.random().toString().substr(2, 8),
          tripId: booking.tripId,
          passengerPhone: booking.passengerPhone,
          passengerName: booking.passengerName,
          seatNumber: assignedSeat,
          farePaid: trip.route?.baseFare || 45.00,
          paymentMethod: booking.paymentMethod,
          status: 'booked' as const,
          smsSent: true,
          createdAt: new Date().toISOString(),
        };
        
        const result = await mockApiCall(newTicket, 1500);
        return { data: result };
      },
      invalidatesTags: ['Ticket', 'Trip'],
    }),
    
    cancelTicket: builder.mutation<void, string>({
      queryFn: async (ticketId) => {
        await mockApiCall(null, 1000);
        return { data: undefined };
      },
      invalidatesTags: ['Ticket', 'Trip'],
    }),
    
    checkInTicket: builder.mutation<Ticket, string>({
      queryFn: async (ticketCode) => {
        const ticket = mockQuery.tickets.find(t => t.ticketCode === ticketCode);
        if (!ticket) {
          throw new Error('Ticket not found');
        }
        
        const updatedTicket = {
          ...ticket,
          status: 'checked_in' as const,
        };
        
        const result = await mockApiCall(updatedTicket, 1000);
        return { data: result };
      },
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetRoutesQuery,
  useGetBusesQuery,
  useGetTripsQuery,
  useGetTicketsQuery,
  useGetAnalyticsQuery,
  useBookTicketMutation,
  useCancelTicketMutation,
  useCheckInTicketMutation,
} = apiSlice;