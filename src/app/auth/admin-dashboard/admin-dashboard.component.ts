import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService } from '../../services/admin/admin.service';
import { User } from '../../types/types';


export interface AdminSettings {
  name: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [FormsModule, RouterModule, NgFor, NgIf, CommonModule]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('noUsersTemplate', { static: true }) noUsersTemplate!: TemplateRef<any>;

  // Dashboard data
  users: User[] = []

  filteredUsers: User[] = [];
  totalUsers = 0;
  totalReviews = 156;
  totalRestaurants = 89;

  // Search and filter
  searchTerm = '';

  // Modal states
  showUserModal = false;
  showSettingsModal = false;
  isEditMode = false;
  currentUser: Partial<User> = {};

  // Admin settings
  adminName = 'Admin';
  adminSettings: AdminSettings = {
    name: 'Admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Loading states
  isLoading = false;

  // Validation flags
  emailExists = false;
  usernameExists = false;

  // Messages
  errorMessage = '';
  successMessage = '';

  // Next ID for new users
  private nextId = 4;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.getUsersApi()
  }

  getUsersApi() {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.filteredUsers = data.data;
        this.users = [...data.data];
        this.totalUsers = this.filteredUsers.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false;
      },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Track by function for ngFor performance
  trackByUserId(index: number, user: User): string {
    return user._id!;
  }

  // Get user initials for avatar
  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  // Get avatar color based on user ID
  getAvatarColor(userId: string): string {
    const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  // Filter users based on search term and status
  filterUsers(): void {
    let filtered = [...this.users];


    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.firstName!.toLowerCase().includes(searchLower) ||
        user.lastName!.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }

    this.filteredUsers = filtered;
  }


  // Open add user modal
  openAddUserModal(): void {
    this.isEditMode = false;
    this.currentUser = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
    };
    this.showUserModal = true;
    this.clearMessages();
    this.resetValidationFlags();
  }

  // Edit user
  editUser(user: User): void {
    this.isEditMode = true;
    this.currentUser = { ...user };
    this.showUserModal = true;
    this.clearMessages();
    this.resetValidationFlags();
  }

  // Close user modal
  closeUserModal(): void {
    this.showUserModal = false;
    this.currentUser = {};
    this.clearMessages();
    this.resetValidationFlags();
  }

  // Check if email exists
  checkEmailExists(): void {
    if (!this.currentUser.email) {
      this.emailExists = false;
      return;
    }

    const existingUser = this.users.find(u =>
      u.email.toLowerCase() === this.currentUser.email?.toLowerCase() &&
      u._id !== this.currentUser._id
    );

    this.emailExists = !!existingUser;
  }

  // Check if username exists
  checkUsernameExists(): void {
    if (!this.currentUser.username) {
      this.usernameExists = false;
      return;
    }

    const existingUser = this.users.find(u =>
      u.username.toLowerCase() === this.currentUser.username?.toLowerCase() &&
      u._id !== this.currentUser._id
    );

    this.usernameExists = !!existingUser;
  }

  // Reset validation flags
  resetValidationFlags(): void {
    this.emailExists = false;
    this.usernameExists = false;
  }

  // Save user (create or update)
  saveUser(): void {
    this.isLoading = true;

    // Simulate API call delay
    // setTimeout(() => {
    //   try {
    //     if (this.isEditMode && this.currentUser._id) {
    //       // Update existing user
    //       const index = this.users.findIndex(u => u._id === this.currentUser._id);
    //       if (index !== -1) {
    //         this.users[index] = {
    //           ...this.users[index],
    //           firstName: this.currentUser.firstName!.trim(),
    //           lastName: this.currentUser.lastName!.trim(),
    //           email: this.currentUser.email!.trim().toLowerCase(),
    //           username: this.currentUser.username!.trim().toLowerCase(),
    //         };
    //         this.showSuccessMessage('User updated successfully');
    //       }
    //     } else {
    //       // Create new user
    //       const newUser: User = {
    //         id: this.nextId++,
    //         firstName: this.currentUser.firstName!.trim(),
    //         lastName: this.currentUser.lastName!.trim(),
    //         email: this.currentUser.email!.trim().toLowerCase(),
    //         username: this.currentUser.username!.trim().toLowerCase(),
    //         createdAt: new Date()
    //       };

    //       this.users.unshift(newUser);
    //       this.totalUsers = this.users.length;
    //       this.showSuccessMessage('User created successfully');
    //     }

    //     this.filterUsers();
    //     this.closeUserModal();
    //   } catch (error) {
    //     this.errorMessage = 'An error occurred while saving the user';
    //   } finally {
    //     this.isLoading = false;
    //   }
    // }, 1000);
  }

  // Delete user
  deleteUser(userId: string, firstName: string, lastName: string): void {
    const fullName = `${firstName} ${lastName}`;
    const confirmMessage = `Are you sure you want to delete "${fullName}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.isLoading = true;

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== userId);
        this.totalUsers = this.users.length;
        this.filterUsers();
        this.showSuccessMessage(`User "${fullName}" deleted successfully`);
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false;
      },
    })
  }

  // Open settings modal
  openSettingsModal(): void {
    this.adminSettings = {
      name: this.adminName,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.showSettingsModal = true;
    this.clearMessages();
  }

  // Close settings modal
  closeSettingsModal(): void {
    this.showSettingsModal = false;
    this.clearMessages();
  }

  // Save admin settings
  saveSettings(): void {
    this.isLoading = true;

    // Simulate API call delay
    setTimeout(() => {
      try {
        // In a real app, you would validate the current password with the backend
        this.adminName = this.adminSettings.name.trim();
        this.showSuccessMessage('Settings updated successfully');
        this.closeSettingsModal();
      } catch (error) {
        this.errorMessage = 'An error occurred while saving settings';
      } finally {
        this.isLoading = false;
      }
    }, 1000);
  }

  // Show success message
  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 4000);
  }

  // Clear messages
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Refresh data
  refreshData(): void {
    this.isLoading = true;

    this.getUsersApi()

  }

  // Export users data
  exportUsers(): void {
    try {
      const csvContent = this.generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `foodreview_users_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSuccessMessage('Users data exported successfully');
      }
    } catch (error) {
      this.errorMessage = 'Failed to export users data';
    }
  }

  // Generate CSV content
  private generateCSV(): string {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Username', 'Join Date'];
    const csvRows = [headers.join(',')];

    this.filteredUsers.forEach(user => {
      const row = [
        user._id,
        `"${user.firstName}"`,
        `"${user.lastName}"`,
        `"${user.email}"`,
        `"${user.username}"`,
        new Date(user.createdAt!).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  logout(): void {
    this.adminService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      },
      error: (error) => {
        console.log(error)
      },
    })

  }

}