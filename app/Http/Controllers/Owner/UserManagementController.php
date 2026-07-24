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
     * Update a user's role (cannot change own role).
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        // Guard: cannot change own role
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Kamu tidak bisa mengubah role dirimu sendiri.');
        }

        $request->validate([
            'role' => ['required', Rule::in(['customer', 'mechanic', 'admin', 'owner'])],
        ]);

        $user->update(['role' => $request->role]);

        return back()->with('success', "Role {$user->name} berhasil diubah menjadi {$request->role}.");
    }

    /**
     * Update a user's status (active / inactive / suspended).
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        // Guard: cannot suspend self
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Kamu tidak bisa mengubah status dirimu sendiri.');
        }

        $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user->update(['status' => $request->status]);

        return back()->with('success', "Status {$user->name} berhasil diubah menjadi {$request->status}.");
    }

    /**
     * Delete / Kick a user account (cannot delete self).
     */
    public function destroy(User $user): RedirectResponse
    {
        // Guard: cannot delete self
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Kamu tidak bisa menghapus akun dirimu sendiri.');
        }

        $user->delete();

        return back()->with('success', "Akun {$user->name} berhasil dihapus dari sistem.");
    }
}
