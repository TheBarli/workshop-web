// Mock API Engine & LocalStorage State Manager for Bengkel Stelle System

import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_SERVICES,
  INITIAL_SPAREPARTS,
  INITIAL_BOOKINGS,
  INITIAL_WORK_ORDERS,
  INITIAL_INVOICES,
} from './mockData';

// Helper to get or initialize LocalStorage
const getStorageItem = (key, initialValue) => {
  const data = localStorage.getItem(`autocare_${key}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error parsing ${key} from storage`, e);
    }
  }
  localStorage.setItem(`autocare_${key}`, JSON.stringify(initialValue));
  return initialValue;
};

const setStorageItem = (key, value) => {
  localStorage.setItem(`autocare_${key}`, JSON.stringify(value));
};

// Simulated delay helper
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // --- AUTH SERVICES ---
  async login(email, password) {
    await delay();
    const users = getStorageItem('users', INITIAL_USERS);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Demo fallback: if email contains role keyword, create session
      let role = 'customer';
      if (email.includes('admin') || email.includes('kasir')) role = 'admin';
      else if (email.includes('mechanic') || email.includes('mekanik')) role = 'mechanic';
      else if (email.includes('owner') || email.includes('bos')) role = 'owner';

      const demoUser = {
        id: Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email,
        phone_number: '0812' + Math.floor(10000000 + Math.random() * 90000000),
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
      return { user: demoUser, token: `demo_sanctum_token_${Date.now()}` };
    }

    return { user, token: `sanctum_token_${user.id}_${Date.now()}` };
  },

  async register(userData) {
    await delay();
    const users = getStorageItem('users', INITIAL_USERS);
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    users.push(newUser);
    setStorageItem('users', users);
    return { user: newUser, token: `sanctum_token_${newUser.id}` };
  },

  // --- VEHICLES ---
  async getVehicles(userId = 1) {
    await delay();
    const vehicles = getStorageItem('vehicles', INITIAL_VEHICLES);
    return vehicles.filter((v) => v.user_id === userId);
  },

  async addVehicle(vehicleData) {
    await delay();
    const vehicles = getStorageItem('vehicles', INITIAL_VEHICLES);
    const newVehicle = {
      id: Date.now(),
      user_id: vehicleData.user_id || 1,
      license_plate: vehicleData.license_plate.toUpperCase(),
      brand: vehicleData.brand,
      model: vehicleData.model,
      manufacture_year: Number(vehicleData.manufacture_year) || 2022,
      engine_capacity: Number(vehicleData.engine_capacity) || 1500,
      type: vehicleData.type || 'Mobil',
    };
    vehicles.push(newVehicle);
    setStorageItem('vehicles', vehicles);
    return newVehicle;
  },

  // --- SERVICES & SPAREPARTS MASTER ---
  async getServices() {
    await delay(200);
    return getStorageItem('services', INITIAL_SERVICES);
  },

  async getSpareparts() {
    await delay(200);
    return getStorageItem('spareparts', INITIAL_SPAREPARTS);
  },

  async addSparepart(partData) {
    await delay();
    const parts = getStorageItem('spareparts', INITIAL_SPAREPARTS);
    const newPart = {
      id: Date.now(),
      part_code: `PRT-${Math.floor(100 + Math.random() * 900)}`,
      ...partData,
      stock: Number(partData.stock),
      min_stock: Number(partData.min_stock || 5),
      purchase_price: Number(partData.purchase_price),
      selling_price: Number(partData.selling_price),
    };
    parts.push(newPart);
    setStorageItem('spareparts', parts);
    return newPart;
  },

  async updateSparepartStock(id, newStock) {
    await delay();
    const parts = getStorageItem('spareparts', INITIAL_SPAREPARTS);
    const part = parts.find((p) => p.id === id);
    if (part) {
      part.stock = Number(newStock);
      setStorageItem('spareparts', parts);
    }
    return part;
  },

  // --- SLOT CHECK & BOOKING ENGINE ---
  async checkSlotAvailability(dateString) {
    await delay(200);
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const activeBookingsOnDate = bookings.filter(
      (b) => b.booking_date === dateString && ['pending', 'confirmed', 'in_progress'].includes(b.status)
    );

    const timeSlots = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'];
    const maxLimit = 4;

    const slots = timeSlots.map((time) => {
      const bookedCount = activeBookingsOnDate.filter((b) => b.booking_time === time).length;
      return {
        time,
        booked_count: bookedCount,
        max_limit: maxLimit,
        is_available: bookedCount < maxLimit,
      };
    });

    return { date: dateString, slots };
  },

  async getBookings(userId = null) {
    await delay();
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    if (userId) {
      return bookings.filter((b) => b.user_id === userId);
    }
    return bookings;
  },

  async createBooking(bookingData) {
    await delay();
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const vehicles = getStorageItem('vehicles', INITIAL_VEHICLES);
    const services = getStorageItem('services', INITIAL_SERVICES);

    const vehicle = vehicles.find((v) => v.id === Number(bookingData.vehicle_id)) || vehicles[0];
    const selectedServices = services.filter((s) => (bookingData.service_ids || []).includes(s.id));

    const dateFormatted = bookingData.booking_date.replace(/-/g, '');
    const codeRandom = Math.floor(100 + Math.random() * 900);
    const newBooking = {
      id: Date.now(),
      booking_code: `BK-${dateFormatted}-${codeRandom}`,
      user_id: bookingData.user_id || 1,
      user_name: bookingData.user_name || 'Budi Santoso',
      user_phone: bookingData.user_phone || '081234567890',
      vehicle_id: vehicle.id,
      license_plate: vehicle.license_plate,
      vehicle_model: `${vehicle.brand} ${vehicle.model}`,
      booking_date: bookingData.booking_date,
      booking_time: bookingData.booking_time,
      status: 'pending',
      services: selectedServices.length > 0 ? selectedServices : [INITIAL_SERVICES[0]],
      complaint_notes: bookingData.complaint_notes || '-',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    bookings.unshift(newBooking);
    setStorageItem('bookings', bookings);
    return newBooking;
  },

  async updateBookingStatus(id, newStatus) {
    await delay();
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const booking = bookings.find((b) => b.id === Number(id));
    if (booking) {
      booking.status = newStatus;
      setStorageItem('bookings', bookings);
    }
    return booking;
  },

  // --- WORK ORDERS & MECHANIC WORKBENCH ---
  async getWorkOrders() {
    await delay();
    return getStorageItem('work_orders', INITIAL_WORK_ORDERS);
  },

  async createWorkOrderFromBooking(bookingId) {
    await delay();
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const workOrders = getStorageItem('work_orders', INITIAL_WORK_ORDERS);
    const booking = bookings.find((b) => b.id === Number(bookingId));

    if (!booking) throw new Error('Booking not found');

    booking.status = 'in_progress';
    setStorageItem('bookings', bookings);

    const newWO = {
      id: Date.now(),
      work_order_number: `WO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      booking_id: booking.id,
      booking_code: booking.booking_code,
      license_plate: booking.license_plate,
      vehicle_model: booking.vehicle_model,
      customer_name: booking.user_name,
      mechanic_id: 2,
      mechanic_name: 'Agus Pratama',
      status: 'inspecting',
      mechanic_notes: 'Pemeriksaan unit awal dimulai.',
      started_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      services: booking.services.map((s) => ({ ...s, approval_status: 'approved' })),
      proposed_spareparts: [],
    };

    workOrders.unshift(newWO);
    setStorageItem('work_orders', workOrders);
    return newWO;
  },

  async proposeSparepartsEstimate(workOrderId, proposedParts, mechanicNotes) {
    await delay();
    const workOrders = getStorageItem('work_orders', INITIAL_WORK_ORDERS);
    const wo = workOrders.find((w) => w.id === Number(workOrderId));

    if (wo) {
      wo.status = 'estimate_proposed';
      wo.mechanic_notes = mechanicNotes || wo.mechanic_notes;
      wo.proposed_spareparts = proposedParts;
      setStorageItem('work_orders', workOrders);
    }

    return wo;
  },

  async updateEstimateApproval(workOrderId, partId, approvalStatus) {
    await delay();
    const workOrders = getStorageItem('work_orders', INITIAL_WORK_ORDERS);
    const wo = workOrders.find((w) => w.id === Number(workOrderId));

    if (wo && wo.proposed_spareparts) {
      const part = wo.proposed_spareparts.find((p) => p.sparepart_id === partId);
      if (part) {
        part.approval_status = approvalStatus; // 'approved' or 'rejected'
      }
      setStorageItem('work_orders', workOrders);
    }
    return wo;
  },

  async completeWorkOrder(workOrderId) {
    await delay();
    const workOrders = getStorageItem('work_orders', INITIAL_WORK_ORDERS);
    const wo = workOrders.find((w) => w.id === Number(workOrderId));

    if (wo) {
      wo.status = 'completed';
      wo.completed_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Auto deduct inventory stock for approved parts
      const spareparts = getStorageItem('spareparts', INITIAL_SPAREPARTS);
      (wo.proposed_spareparts || []).forEach((part) => {
        if (part.approval_status === 'approved') {
          const sp = spareparts.find((s) => s.id === part.sparepart_id);
          if (sp) {
            sp.stock = Math.max(0, sp.stock - part.qty);
          }
        }
      });
      setStorageItem('spareparts', spareparts);
      setStorageItem('work_orders', workOrders);
    }
    return wo;
  },

  // --- POS CASHIER & INVOICES ---
  async getInvoices() {
    await delay();
    return getStorageItem('invoices', INITIAL_INVOICES);
  },

  async processPOSCheckout(checkoutData) {
    await delay();
    const invoices = getStorageItem('invoices', INITIAL_INVOICES);
    const workOrders = getStorageItem('work_orders', INITIAL_WORK_ORDERS);
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);

    const wo = workOrders.find((w) => w.id === Number(checkoutData.work_order_id));

    const subtotalServices = (wo?.services || []).reduce((acc, s) => acc + Number(s.price), 0);
    const subtotalParts = (wo?.proposed_spareparts || [])
      .filter((p) => p.approval_status === 'approved')
      .reduce((acc, p) => acc + Number(p.unit_price) * Number(p.qty), 0);

    const discountAmount = Number(checkoutData.discount_amount) || 0;
    const grossTotal = subtotalServices + subtotalParts - discountAmount;
    const taxAmount = Math.round(grossTotal * 0.11); // PPN 11%
    const grandTotal = grossTotal + taxAmount;

    const paidAmount = Number(checkoutData.paid_amount) || grandTotal;
    const changeAmount = Math.max(0, paidAmount - grandTotal);

    const newInvoice = {
      id: Date.now(),
      invoice_number: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      work_order_id: checkoutData.work_order_id,
      license_plate: wo?.license_plate || 'B 1234 XYZ',
      customer_name: wo?.customer_name || 'Pelanggan Bengkel',
      cashier_name: checkoutData.cashier_name || 'Siti Rahmawati',
      subtotal_services: subtotalServices,
      subtotal_spareparts: subtotalParts,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      paid_amount: paidAmount,
      change_amount: changeAmount,
      payment_method: checkoutData.payment_method || 'cash',
      payment_status: 'paid',
      paid_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    invoices.unshift(newInvoice);
    setStorageItem('invoices', invoices);

    // Update booking status to completed
    if (wo?.booking_id) {
      const booking = bookings.find((b) => b.id === wo.booking_id);
      if (booking) {
        booking.status = 'completed';
        setStorageItem('bookings', bookings);
      }
    }

    return newInvoice;
  },
};
