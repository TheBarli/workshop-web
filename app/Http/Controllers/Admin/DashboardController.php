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
        $user = auth()->user();

        if ($user->isMechanic()) {
            return Inertia::render('admin/AdminDashboard', [
                'stats' => [
                    'myAssignedJobs'  => Booking::where('mechanic_id', $user->id)->count(),
                    'myActiveJobs'    => Booking::where('mechanic_id', $user->id)->whereIn('status', ['confirmed', 'in_progress'])->count(),
                    'myCompletedJobs' => Booking::where('mechanic_id', $user->id)->where('status', 'completed')->count(),
                ],
                'recentBookings' => Booking::with(['customer', 'vehicle', 'mechanic', 'items.service'])
                    ->where('mechanic_id', $user->id)
                    ->latest()
                    ->take(6)
                    ->get(),
            ]);
        }

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
        $user = auth()->user();
        $query = Booking::with(['customer', 'vehicle', 'mechanic', 'items.service']);

        if ($user->isMechanic()) {
            $query->where('mechanic_id', $user->id);
        }

        $workOrders = $query->latest()->get();

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

        // Monthly revenue aggregation for area chart (Database Agnostic)
        $monthlyChart = $paidTransactions
            ->groupBy(function ($t) {
                $date = $t->paid_at ?? $t->created_at;
                return $date ? $date->format('M Y') : 'Unknown';
            })
            ->map(fn ($group, $key) => [
                'month'    => $key,
                'omzet'    => (float) $group->sum('total_amount'),
                'bookings' => (int) $group->count(),
            ])
            ->values();

        // Service frequency distribution for bar chart (Database Agnostic)
        $serviceChart = BookingItem::with('service:id,name')
            ->get()
            ->groupBy('service_id')
            ->map(function ($group) {
                $first = $group->first();
                return [
                    'name'  => $first->service?->name ?? 'Service #' . $first->service_id,
                    'total' => (int) $group->sum('quantity'),
                ];
            })
            ->sortByDesc('total')
            ->take(5)
            ->values();

        return Inertia::render('admin/ReportsAnalytics', [
            'transactions' => $paidTransactions,
            'totalRevenue' => $paidTransactions->sum('total_amount'),
            'monthlyChart' => $monthlyChart,
            'serviceChart' => $serviceChart,
        ]);
    }
}