<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Show the user management page.
     */
    public function index(Request $request): Response
    {
        $query = User::query()->withTrashed(false);

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $users = $query
            ->orderBy('role')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'role'         => $user->role,
                'status'       => $user->status,
                'phone_number' => $user->phone_number,
                'avatar'       => $user->avatar
                    ? (str_starts_with($user->avatar, 'http') ? $user->avatar : asset('storage/' . $user->avatar))
                    : null,
                'created_at'   => $user->created_at?->format('d M Y'),
                'is_self'      => $user->id === auth()->id(),
            ]);

        return Inertia::render('owner/UserManagement', [
            'users'   => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Update a user's role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $currentUser = auth()->user();

        // Guard 1: Cannot change own role
        if ($user->id === $currentUser->id) {
            return back()->with('error', 'Kamu tidak bisa mengubah role dirimu sendiri.');
        }

        // Guard 2: Owner account is untouchable
        if ($user->role === 'owner') {
            return back()->with('error', 'Akun Owner adalah kasta tertinggi dan tidak dapat diubah rolenya.');
        }

        // Guard 3: Admin cannot touch another admin or assign admin/owner roles
        if ($currentUser->role === 'admin') {
            if ($user->role === 'admin') {
                return back()->with('error', 'Admin tidak memiliki hak akses untuk mengubah role sesama Admin.');
            }
            if (in_array($request->role, ['admin', 'owner'])) {
                return back()->with('error', 'Admin hanya dapat mengelola role Mechanic dan Customer.');
            }
        }

        // Guard 4: Cannot assign Owner role to any user
        if ($request->role === 'owner') {
            return back()->with('error', 'Role Owner tidak dapat diberikan kepada siapapun.');
        }

        $request->validate([
            'role' => ['required', Rule::in(['customer', 'mechanic', 'admin'])],
        ]);

        $user->update(['role' => $request->role]);

        return back()->with('success', "Role {$user->name} berhasil diubah menjadi {$request->role}.");
    }

    /**
     * Update a user's status (active / inactive / suspended).
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $currentUser = auth()->user();

        // Guard 1: Cannot suspend self
        if ($user->id === $currentUser->id) {
            return back()->with('error', 'Kamu tidak bisa mengubah status dirimu sendiri.');
        }

        // Guard 2: Owner account is untouchable
        if ($user->role === 'owner') {
            return back()->with('error', 'Akun Owner tidak dapat ditangguhkan atau di-kick oleh siapapun.');
        }

        // Guard 3: Admin cannot suspend/kick another admin
        if ($currentUser->role === 'admin' && $user->role === 'admin') {
            return back()->with('error', 'Admin tidak memiliki hak akses untuk menangguhkan atau me-kick sesama Admin.');
        }

        $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user->update(['status' => $request->status]);

        return back()->with('success', "Status {$user->name} berhasil diubah menjadi {$request->status}.");
    }

    /**
     * Delete / Kick a user account.
     */
    public function destroy(User $user): RedirectResponse
    {
        $currentUser = auth()->user();

        // Guard 1: Cannot delete self
        if ($user->id === $currentUser->id) {
            return back()->with('error', 'Kamu tidak bisa menghapus akun dirimu sendiri.');
        }

        // Guard 2: Owner account is untouchable
        if ($user->role === 'owner') {
            return back()->with('error', 'Akun Owner tidak dapat dihapus oleh siapapun.');
        }

        // Guard 3: Admin cannot delete another admin
        if ($currentUser->role === 'admin' && $user->role === 'admin') {
            return back()->with('error', 'Admin tidak memiliki hak akses untuk menghapus sesama Admin.');
        }

        $user->delete();

        return back()->with('success', "Akun {$user->name} berhasil dihapus dari sistem.");
    }
}
