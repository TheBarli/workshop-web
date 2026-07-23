<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Admin Overview Dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('admin/AdminDashboard', [
            'stats' => [
                'totalBookings'   => Booking::count(),
                'activeQueue'     => Booking::whereIn('status', ['pending', 'in_progress'])->count(),
                'totalCustomers'  => User::where('role', 'customer')->count(),
                'totalRevenue'    => Transaction::where('payment_status', 'paid')->sum('total_amount'),
            ],
            'recentBookings' => Booking::with(['customer', 'vehicle', 'mechanic'])
                ->latest()
                ->take(6)
                ->get(),
        ]);
    }

    /**
     * Queue & Schedule Management.
     */
    public function queue(): Response
    {
        $queue = Booking::with(['customer', 'vehicle', 'mechanic', 'items.service'])
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        $mechanics = User::where('role', 'mechanic')->where('status', 'active')->get();

        return Inertia::render('admin/QueueManagement', [
            'queue'     => $queue,
            'mechanics' => $mechanics,
        ]);
    }

    /**
     * Work Orders View.
     */
    public function workOrders(): Response
    {
        $workOrders = Booking::with(['customer', 'vehicle', 'mechanic', 'items.service'])
            ->latest()
            ->get();

        return Inertia::render('admin/WorkOrders', [
            'workOrders' => $workOrders,
        ]);
    }

    /**
     * POS Cashier Module.
     */
    public function pos(): Response
    {
        $unpaidBookings = Booking::with(['customer', 'vehicle', 'items.service'])
            ->where('status', 'completed')
            ->whereDoesntHave('transaction', function ($q) {
                $q->where('payment_status', 'paid');
            })
            ->get();

        $servicesAndParts = Service::all();

        return Inertia::render('admin/POSCashier', [
            'unpaidBookings'   => $unpaidBookings,
            'servicesAndParts' => $servicesAndParts,
        ]);
    }

    /**
     * Spare Parts Inventory.
     */
    public function inventory(): Response
    {
        $spareparts = Service::where('category', 'sparepart')->get();

        return Inertia::render('admin/SparepartsInventory', [
            'inventory' => $spareparts,
        ]);
    }

    /**
     * Reports & Analytics Page.
     */
    public function reports(): Response
    {
        $paidTransactions = Transaction::with(['booking.customer', 'booking.vehicle'])
            ->where('payment_status', 'paid')
            ->latest()
            ->get();

        // Monthly revenue aggregation for area chart
        $monthlyChart = Transaction::where('payment_status', 'paid')
            ->select(
                DB::raw('YEAR(paid_at) as year'),
                DB::raw('MONTH(paid_at) as month'),
                DB::raw('SUM(total_amount) as omzet'),
                DB::raw('COUNT(*) as bookings')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month'    => \Carbon\Carbon::create($row->year, $row->month)->format('M Y'),
                'omzet'    => (float) $row->omzet,
                'bookings' => (int) $row->bookings,
            ]);

        // Service frequency distribution for bar chart
        $serviceChart = BookingItem::select('service_id', DB::raw('SUM(quantity) as total'))
            ->with('service:id,name')
            ->groupBy('service_id')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name'  => $item->service?->name ?? 'Unknown',
                'total' => (int) $item->total,
            ]);

        return Inertia::render('admin/ReportsAnalytics', [
            'transactions' => $paidTransactions,
            'totalRevenue' => $paidTransactions->sum('total_amount'),
            'monthlyChart' => $monthlyChart,
            'serviceChart' => $serviceChart,
        ]);
    }
}